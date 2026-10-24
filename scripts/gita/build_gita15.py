#!/usr/bin/env python3
"""Build the 15-minute Gita video data: voice every cue, lay out the timeline, write public/gita/g15/data.json.

  python3 -I scripts/gita/build_gita15.py            # placeholder voice: macOS `say -v Aman` (for building scenes)
  python3 -I scripts/gita/build_gita15.py minimax    # English_Diligent_Man, only 06:45-22:10 IST (Vigil/Ravens use the key at night)

Re-voices only cues whose text or voice changed. Script and verse text come from scripts/gita/gita15.py (run its `check` first).
A card cue becomes two audio cues: "<beat>_<i>" (the spoken reference) and "<beat>_<i>v" (our translation, read aloud),
with the ritual pause between them while the bell rings and the Devanagari writes itself.
"""
import array, json, os, shutil, socket, subprocess, sys, wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import gita15 as G

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "gita" / "g15"; AUD = OUT / "a"
AUD.mkdir(parents=True, exist_ok=True)
VOICE = sys.argv[1] if len(sys.argv) > 1 else "say"
SPEED = 1.04                                   # calmer than the Shorts (1.12); the long video breathes
VTAG = f"minimax@{SPEED}" if VOICE == "minimax" else VOICE
FFMPEG = ROOT / "node_modules/@remotion/compositor-darwin-arm64/ffmpeg"

LEAD, TAIL = 1.8, 4.0
GAP_CUE, GAP_BEAT = 0.28, 0.75
AFTER_TITLE = 0.6                              # after "Chapter N. <name>."
WRITE_2, WRITE_4 = 3.3, 4.8                    # ritual pause for a 2-line / 4-line card
AFTER_EN = 1.1                                 # card stays a beat after its translation
TARGET = float(os.environ.get("TARGET", 0))      # e.g. TARGET=900 stretches pauses toward 15:00
MAX_PAD = 1.5
EXTRA = {"open2_0": 0.6, "open3_0": 1.2, "meera1_0": 0.8, "title_0": 0.8, "map_0": 1.0, "ch11_1": 0.6,
         "meera2_0": 0.8, "meera3_0": 0.8, "meera4_0": 1.0, "end_1": 0.5}


def wav_seconds(p):
    with wave.open(str(p)) as w: return w.getnframes() / w.getframerate()


def trim(wav, pad=0.06, thr=500):
    with wave.open(str(wav)) as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth(); a = array.array("h", w.readframes(w.getnframes()))
    i = next((k for k, x in enumerate(a) if abs(x) > thr), 0); j = len(a) - next((k for k, x in enumerate(reversed(a)) if abs(x) > thr), 0)
    a = a[max(0, i - int(pad * sr)): min(len(a), j + int(pad * sr))]
    with wave.open(str(wav), "w") as w:
        w.setnchannels(ch); w.setsampwidth(sw); w.setframerate(sr); w.writeframes(a.tobytes())


def voice_say(text, wav):
    aiff = wav.with_suffix(".aiff")
    subprocess.run(["say", "-v", "Aman", "-r", "172", "-o", str(aiff), text], check=True)
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@44100", "-c", "1", str(aiff), str(wav)], check=True)
    aiff.unlink()


def voice_minimax(text, wav):   # same call as scripts/geo/voice_geo.py; IPv4 only (the Mini's IPv6 route hangs)
    import time, requests, urllib3.util.connection as uc
    uc.allowed_gai_family = lambda: socket.AF_INET
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": G.VOICE, "speed": SPEED, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"},
                          json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            mp3 = wav.with_suffix(".mp3"); mp3.write_bytes(bytes.fromhex(j["data"]["audio"]))
            subprocess.run([str(FFMPEG), "-y", "-loglevel", "error", "-i", str(mp3), "-ac", "1", "-ar", "44100", str(wav)],
                           check=True, env={**os.environ, "DYLD_LIBRARY_PATH": str(FFMPEG.parent)})
            mp3.unlink(); return
        print("  retry", wav.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))   # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + wav.name)


def main():
    if not G.check(): raise SystemExit("gita15.py check failed")
    corpus = json.load(open(G.CORPUS)); V = corpus["verses"]
    old = {}
    if (OUT / "data.json").exists():
        old = {c["key"]: c for c in json.load(open(OUT / "data.json"))["cues"]}

    memo = {}
    def voiced(key, text):
        if key in memo: return memo[key]
        wav = AUD / f"{key}.wav"; o = old.get(key)
        if not (wav.exists() and o and o["text"] == text and o.get("voice") == VTAG):
            (voice_minimax if VOICE == "minimax" else voice_say)(text, wav); trim(wav); print(" voiced", key)
        memo[key] = round(wav_seconds(wav), 3); return memo[key]

    def lay(pad):   # pad: extra seconds after each beat and after each card's translation (length tuning)
        t = LEAD; cues = []; beats = []
        for b in G.B:
            b0 = t
            ch = int(b["key"][2:]) if b["key"].startswith("ch") else None
            for i, q in enumerate(b["cues"]):
                key = f"{b['key']}_{i}"
                dur = voiced(key, q["say"])
                cues.append({"key": key, "beat": b["key"], "kind": "say", "text": q["say"], "voice": VTAG, "note": bool(q.get("note")),
                             "card": q.get("card"), "start": round(t, 3), "dur": dur})
                t += dur + GAP_CUE + EXTRA.get(key, 0)
                if q["say"].startswith("Chapter ") and q["say"].count(".") == 2 and not q.get("card"): t += AFTER_TITLE
                if q.get("card"):
                    keys = q["card"].split("+")
                    lines = sum(len(V[k]["deva"]) for k in keys)
                    t += (WRITE_4 if lines > 2 else WRITE_2) - GAP_CUE
                    en = " ".join(G.CARDS[k]["en"] for k in keys)
                    kv = key + "v"; dv = voiced(kv, en)
                    cues.append({"key": kv, "beat": b["key"], "kind": "en", "text": en, "voice": VTAG, "note": False,
                                 "card": q["card"], "start": round(t, 3), "dur": dv})
                    t += dv + AFTER_EN + pad
            beats.append({"key": b["key"], "section": b["section"], "chapter": ch, "refs": b["refs"], "start": round(b0, 3), "end": round(t, 3)})
            t += GAP_BEAT - GAP_CUE + pad
        return cues, beats, round(t + TAIL, 3)

    cues, beats, total = lay(0)
    if TARGET and total < TARGET:     # stretch the breathing room toward the target, at most MAX_PAD per gap
        slots = len(beats) + sum(1 for c in cues if c["kind"] == "en")
        pad = round(min(MAX_PAD, (TARGET - total) / slots), 3)
        cues, beats, total = lay(pad)
        print(f" length tuning: +{pad} s after each beat and card ({slots} gaps)")

    used = sorted({k for c in cues if c["card"] for k in c["card"].split("+")}, key=lambda k: tuple(map(int, k.split("."))))
    cards = {k: {"deva": V[k]["deva"], "iast": G.CARDS[k]["iast"], "en": G.CARDS[k]["en"], "speaker": V[k]["speaker"],
                 "gloss": G.CARDS[k].get("gloss")} for k in used}
    chapters = {n: {"deva": corpus["chapter_names"][str(n)]["deva"], "iast": G.CHAPTER_IAST[n], "en": G.CHAPTERS[n],
                    "ordinal": G.ORDINALS[n - 1] + "ऽध्यायः"} for n in range(1, 19)}
    for snd in ["tanpura.wav", "bell.wav", "conch.wav", "thud.wav"]:
        src = ROOT / "public" / "gita" / "styletest" / snd
        if not (OUT / snd).exists(): shutil.copy(src, OUT / snd)
    labels = {k: {"v": v["v"], "show": v["show"], "en": v["en"], "deva": v["deva"]} for k, v in G.LABELS.items()}
    counts = [sum(1 for k in V if int(k.split(".")[0]) == n) for n in range(1, 19)]
    json.dump({"id": "g15", "fps": 30, "voice": VTAG, "total": total, "beats": beats, "cues": cues, "cards": cards, "chapters": chapters,
               "labels": labels, "verse_counts": counts},
              open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
    print(f"g15: {len(beats)} beats, {len(cues)} cues, {total:.1f} s ({int(total // 60)}:{int(total % 60):02d}), voice {VTAG}")


if __name__ == "__main__":
    main()
