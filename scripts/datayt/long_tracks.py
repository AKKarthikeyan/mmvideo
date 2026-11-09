#!/usr/bin/env python3
"""Regional audio tracks for a long-form film: voice each scene's translated line, then fit it into the English scene's slot.

  zsh -lic '.venv/bin/python scripts/datayt/long_tracks.py voice A hi'                       # Hindi: Gemini TTS, voice Charon (GEMINI_API_KEY)
  /Volumes/DarwinSSD/DataKadai/research/2026-10-28-voices/work/mayavenv/bin/python \\
      scripts/datayt/long_tracks.py voice A ta                                               # Tamil / Telugu: Maya-2-Native (local MLX), voice Siddhant
  .venv/bin/python scripts/datayt/long_tracks.py fit A hi                                    # place on the English timeline -> <lang>_DRAFT.wav/.m4a

Voices (AK, 29 Oct 2026): English MiniMax (long_voice.py), Hindi Gemini Charon, Tamil and Telugu Maya Siddhant.
Input: public/datayt/long/namakkal/<film>/translations/<lang>.json ({"scenes": {id: {"text": ...}}}, status DRAFT, reviewed_by null).
Voice: tracks/<lang>/<id>.wav (24 kHz mono) plus <id>.json (the text it was made from; a changed line is re-voiced, an unchanged one is reused).
Fit: each line starts with its English scene (timeline.json `from` + LEAD s) and must end before the next spoken line starts (minus GAP s): it may
run past its own scene's cut into a pause or a silent chapter card, never into the next line. A longer line is
sped up with ffmpeg atempo up to CAP[lang]; beyond that the build stops and names the line to shorten (never cut words, never overlap scenes).
The mix is loudness-normalised to -16 LUFS. Files stay _DRAFT until a native speaker reviews them (MMVideo docs/AUDIO_TRACKS.md).
"""
import base64, json, os, subprocess, sys, time, wave

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = os.path.join(ROOT, os.environ.get("LONG_BASE", "public/datayt/long/namakkal"))   # UPSC: LONG_BASE=public/datayt/long/upsc
FF = "/tmp/ffbin/ffmpeg"
SR = 24000
LEAD, GAP = 0.10, 0.20
CAP = {"hi": 1.20, "ta": 1.15, "te": 1.15, "kn": 1.15}   # kn: voice not chosen by AK; Maya Siddhant is a sample       # AUDIO_TRACKS.md allows Hindi up to 1.25x
GEMINI = "gemini-3.8-flash-tts"


def paths(film, lang):
    d = os.path.join(BASE, film)
    return d, os.path.join(d, "translations", f"{lang}.json"), os.path.join(d, "tracks", lang)


def write_wav(p, pcm16: bytes):
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm16); w.close()


def to24k(src, dst):
    subprocess.run([FF, "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", dst], check=True)


def gemini(text, dst):
    import requests
    body = {"contents": [{"parts": [{"text": text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Charon"}}}}}
    for attempt in range(6):
        r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI}:generateContent",
                          headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"]}, json=body, timeout=180)
        if r.status_code == 200:
            parts = r.json()["candidates"][0]["content"]["parts"]
            if parts and "inlineData" in parts[0]:
                raw = base64.b64decode(parts[0]["inlineData"]["data"])
                mime = parts[0]["inlineData"].get("mimeType", "")
                if raw[:4] == b"RIFF":
                    tmp = dst + ".in.wav"; open(tmp, "wb").write(raw); to24k(tmp, dst); os.remove(tmp)
                else:                                          # audio/L16 PCM, rate in the mime type (24 kHz by default)
                    rate = int(mime.split("rate=")[1].split(";")[0]) if "rate=" in mime else SR
                    tmp = dst + ".in.wav"; w = wave.open(tmp, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(raw); w.close()
                    to24k(tmp, dst); os.remove(tmp)
                return
        elif r.status_code not in (402, 429, 500, 503):
            raise SystemExit(f"Gemini {r.status_code}: {r.text[:300]}")
        time.sleep(10 * (attempt + 1))
    raise SystemExit("Gemini TTS failed: " + text[:80])


_MAYA = None


def maya(text, lang, dst):
    global _MAYA
    import numpy as np
    if _MAYA is None:
        from mlx_audio.tts.utils import load
        _MAYA = load("aruntemme/maya2-native-mlx-8bit")
    r = next(_MAYA.generate(text, voice="Siddhant", lang_code=lang))
    a = np.clip(np.asarray(r.audio, dtype=np.float64).reshape(-1), -1, 1)
    write_wav(dst, (a * 32767).astype(np.int16).tobytes())


def dur(p):
    w = wave.open(p); n = w.getnframes() / w.getframerate(); w.close(); return n


def voice(film, lang):
    _, tp, td = paths(film, lang)
    tr = json.load(open(tp, encoding="utf-8"))
    os.makedirs(td, exist_ok=True)
    for sid, sc in tr["scenes"].items():
        text = (sc.get("text") or "").strip()
        if not text:
            continue
        wav, side = os.path.join(td, f"{sid}.wav"), os.path.join(td, f"{sid}.json")
        if os.path.exists(wav) and os.path.exists(side) and json.load(open(side, encoding="utf-8")).get("text") == text:
            continue
        t0 = time.time()
        gemini(text, wav) if (lang == "hi" and os.environ.get("HI_ENGINE") == "gemini") else maya(text, lang, wav)   # AK 4 Nov 2026: Hindi on Maya (Gemini credits out); HI_ENGINE=gemini to go back
        json.dump({"text": text, "engine": "gemini-charon" if (lang == "hi" and os.environ.get("HI_ENGINE") == "gemini") else "maya-siddhant", "sec": round(dur(wav), 3)},
                  open(side, "w", encoding="utf-8"), ensure_ascii=False)
        print(film, lang, sid, f"{dur(wav):.2f}s", f"({time.time() - t0:.1f}s)", flush=True)


def fit(film, lang):
    import numpy as np
    d, tp, td = paths(film, lang)
    tl = json.load(open(os.path.join(d, "timeline.json")))
    tr = json.load(open(tp, encoding="utf-8"))
    fps = tl["fps"]
    total = int(round(tl["total"] / fps * SR))
    track = np.zeros(total, dtype=np.float32)
    report, bad = [], []
    spoken = [s for s in tl["scenes"] if s["vo"].strip()]
    nxt = {a["id"]: (spoken[i + 1]["from"] / fps + LEAD if i + 1 < len(spoken) else tl["total"] / fps) for i, a in enumerate(spoken)}
    for s in tl["scenes"]:
        sc = tr["scenes"].get(s["id"])
        if not s["vo"].strip() or not sc or not (sc.get("text") or "").strip():
            continue
        src = os.path.join(td, f"{s['id']}.wav")
        side = json.load(open(os.path.join(td, f"{s['id']}.json"), encoding="utf-8"))
        if side["text"] != sc["text"].strip():
            raise SystemExit(f"{s['id']}: the voiced line is stale; run voice first")
        slot = nxt[s["id"]] - GAP - (s["from"] / fps + LEAD)
        length = dur(src)
        speed = max(1.0, length / slot)
        use = src
        if speed > CAP[lang] + 1e-9:
            bad.append((s["id"], round(length, 2), round(slot, 2), round(speed, 3)))
            continue
        if speed > 1.0:
            use = src.replace(".wav", ".fit.wav")
            subprocess.run([FF, "-v", "error", "-y", "-i", src, "-filter:a", f"atempo={speed:.4f}", "-ar", str(SR), "-ac", "1", use], check=True)
        w = wave.open(use); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; w.close()
        i = int(round((s["from"] / fps + LEAD) * SR))
        end = min(total, i + len(a))
        track[i:end] += a[:end - i]
        report.append({"id": s["id"], "sec": round(length, 2), "slot": round(slot, 2), "speed": round(speed, 3), "flag": "FAST" if speed > 1.06 else ""})
    if bad:
        for sid, ln, sl, sp in bad:
            print(f"TOO LONG {sid}: {ln}s for a {sl}s slot (needs {sp}x, cap {CAP[lang]}x): shorten the {lang} line", flush=True)
        raise SystemExit(f"{len(bad)} line(s) too long; nothing written")
    raw = os.path.join(d, "tracks", f"{lang}_raw.wav")
    write_wav(raw, (np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
    out = os.path.join(d, "tracks", f"{film}_{lang}_DRAFT")
    subprocess.run([FF, "-v", "error", "-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", out + ".wav"], check=True)
    subprocess.run(["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", out + ".wav", "-c:a", "aac", "-b:a", "192k", "-f", "mp4", out + ".m4a"],
                   check=True, cwd=ROOT)                       # the /tmp/ffbin wrapper has no AAC encoder
    json.dump({"film": film, "lang": lang, "status": "DRAFT", "reviewed_by": tr.get("reviewed_by"), "timing": tl.get("timing"), "lines": report},
              open(out + "_report.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"wrote {out}.wav/.m4a: {len(report)} lines, {sum(1 for r in report if r['flag'])} sped past 1.06x, track {total / SR:.1f}s")


if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[1] not in ("voice", "fit") or sys.argv[3] not in CAP:
        raise SystemExit(__doc__)
    {"voice": voice, "fit": fit}[sys.argv[1]](sys.argv[2], sys.argv[3])
