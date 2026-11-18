#!/usr/bin/env python3
"""Regional-language AUDIO TRACKS for existing videos (Tamil, Hindi first).

Plan (AK, 2 Oct 2026): the English video stays the original. Each regional language is an extra audio track uploaded
to YouTube (multi-language audio). The picture is never re-rendered, so every spoken line must fit its beat's slot
and the track must be exactly as long as the English video.

    python3 scripts/audio_tracks.py list
    python3 scripts/audio_tracks.py prep  <id> <lang>  [--short N]     # writes the translation template
    python3 scripts/audio_tracks.py build <id> <lang>  [--short N] [--gender male|female] [--video path.mp4]

<id> = folder in public/vx/ (data.json).  <lang> = ta | hi.
Translation file: scripts/translations/<id>.<lang>.json  (see docs/AUDIO_TRACKS.md).
Needs MINIMAX_API_KEY in the environment. Output: out/audio/<id>/ (not in git).
"""
import audioop, hashlib, json, os, re, subprocess, sys, time, wave
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SR = 44100
SLOP = 0.15           # keep this much silence before the next beat starts

# speed_max: above this a voice sounds rushed, so shorten the translation instead. fast: report marks faster beats.
# pause: (after a sentence, after a comma) in seconds, sent to MiniMax as <#x#> so speed-up cannot swallow them.
# AK 2 Oct: the Tamil track sounded rushed with no pauses, so Tamil is capped lower and gets explicit pauses.
LANGS = {
    "ta": {"name": "Tamil", "boost": "Tamil", "speed_max": 1.10, "fast": 1.06, "pause": (0.35, 0.15)},
    "hi": {"name": "Hindi", "boost": "Hindi", "speed_max": 1.25, "fast": 1.15, "pause": None},
}
EMOTIONS = {"happy", "sad", "angry", "fearful", "disgusted", "surprised", "calm"}
# Default voices. A translation file can override with "voice" (e.g. a cloned native Tamil voice).
# Tamil has no native MiniMax system voice: the default is the English voice used by the English videos (scripts/voices.py).
# Hindi has native voices. All must be ear-tested by AK / a native speaker before publishing.
VOICES = {
    ("ta", "male"): "English_Diligent_Man", ("ta", "female"): "English_captivating_female1",
    ("hi", "male"): "hindi_male_1_v2", ("hi", "female"): "hindi_female_1_v2",
}


# AK 5 Oct: native Indian voices from Sarvam (Bulbul v3). Opt in with `--provider sarvam` (or "provider": "sarvam" in the
# translation file). Needs SARVAM_API_KEY. Speakers below are first guesses for the ear test; override with `--voice <speaker>`.
PROVIDER = "minimax"
SARVAM_CODE = {"ta": "ta-IN", "hi": "hi-IN", "te": "te-IN", "ml": "ml-IN"}
SARVAM_VOICES = {("ta", "male"): "mani", ("ta", "female"): "kavitha", ("hi", "male"): "shubh", ("hi", "female"): "priya"}


def ffmpeg(tool="ffmpeg"):
    return ["npx", "remotion", tool, "-hide_banner", "-loglevel", "error"] if tool == "ffmpeg" else ["npx", "remotion", tool]


# ---------- timeline: mirrors beatFrames / shortLayout in src/vx/VoxEngine.tsx and CaseEngine.tsx ----------
def beat_frames(b):
    return int(-(-((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) // 1))


def timeline(D, short=None):
    """Returns [(beat, start_frame, slot_frames)], total_frames."""
    if short is None:
        out, f = [], 0
        for b in D["beats"]:
            n = beat_frames(b); out.append((b, f, n)); f += n
        return out, f
    s = D["shorts"][short]
    bs = [next(b for b in D["beats"] if b["key"] == k) for k in s["beats"]]
    gap = 0.12 if s.get("loop") else 0.35
    out, f = [], 0
    for b in bs:
        n = int(-(-((b["sec"] + gap) * FPS) // 1)); out.append((b, f, n)); f += n
    f += 0 if s.get("loop") else (2 * FPS if s.get("hook") else 4 * FPS)
    return out, f


def load(vid):
    return json.load(open(ROOT / "public" / "vx" / vid / "data.json"))


def tpath(vid, lang):
    return ROOT / "scripts" / "translations" / f"{vid}.{lang}.json"


# ---------- TTS ----------
def with_pauses(text, lang):
    """Explicit pauses after sentences and commas. Only after a non-Latin letter, so "H. H. Brown" or "Mrs. B" keep flowing."""
    p = LANGS[lang]["pause"]
    if not p or PROVIDER != "minimax":      # the <#x#> markers are MiniMax syntax
        return text
    text = re.sub(r"(?<=[^\x00-\x7F])([.?!])\s+(?=\S)", lambda m: f"{m.group(1)}<#{p[0]}#>", text)
    return re.sub(r",\s+(?=\S)", f",<#{p[1]}#>", text)


def tts(text, voice, lang, speed, path, emotion=None):
    if path.exists():
        return json.load(open(str(path) + ".json"))["sec"]
    if PROVIDER == "sarvam":
        return tts_sarvam(text, voice, lang, speed, path)
    key = os.environ["MINIMAX_API_KEY"]
    vs = {"voice_id": voice, "speed": speed, "vol": 1, "pitch": 0}
    if emotion:
        vs["emotion"] = emotion
    body = {"model": "speech-2.6-hd", "text": text.replace("MoatSCORE", "Moat Score"), "stream": False,
            "language_boost": LANGS[lang]["boost"], "voice_setting": vs,
            "audio_setting": {"sample_rate": SR, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"},
                          json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            path.write_bytes(bytes.fromhex(j["data"]["audio"]))
            sec = j["extra_info"]["audio_length"] / 1000
            json.dump({"sec": sec}, open(str(path) + ".json", "w"))
            return sec
        print("  retry", path.name, j.get("base_resp"))
        time.sleep(20 * (attempt + 1))        # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + path.name)


def tts_sarvam(text, speaker, lang, pace, path):
    """Sarvam Bulbul v3: POST /text-to-speech, base64 audio in `audios[0]`. Max 2500 characters per request."""
    import base64
    key = os.environ["SARVAM_API_KEY"]
    if len(text) > 2500:
        raise SystemExit(f"{path.name}: {len(text)} characters, Sarvam allows 2500 per call; shorten the beat")
    body = {"text": text.replace("MoatSCORE", "Moat Score"), "target_language_code": SARVAM_CODE[lang], "speaker": speaker,
            "model": "bulbul:v3", "pace": pace, "speech_sample_rate": SR, "output_audio_codec": "mp3"}
    for attempt in range(6):
        r = requests.post("https://api.sarvam.ai/text-to-speech", headers={"api-subscription-key": key}, json=body, timeout=120)
        if r.status_code == 422 and "target_language_code" in body:      # the docs name this field `language_code`
            body["language_code"] = body.pop("target_language_code"); continue
        if r.status_code == 200 and r.json().get("audios"):
            path.write_bytes(base64.b64decode("".join(r.json()["audios"])))
            pr = subprocess.run(ffmpeg("ffprobe") + ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                                capture_output=True, text=True, cwd=ROOT)
            sec = float(pr.stdout.strip().splitlines()[-1])
            json.dump({"sec": sec}, open(str(path) + ".json", "w"))
            return sec
        print("  retry", path.name, r.status_code, r.text[:200])
        if r.status_code in (401, 403):
            raise SystemExit("Sarvam rejected the key (401/403): check SARVAM_API_KEY")
        time.sleep(20 * (attempt + 1))        # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + path.name)


def to_pcm(mp3):
    wav = mp3.with_suffix(".pcm.wav")
    if not wav.exists():
        subprocess.run(ffmpeg() + ["-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", "-sample_fmt", "s16", str(wav)], check=True, cwd=ROOT)
    with wave.open(str(wav)) as w:
        return w.readframes(w.getnframes())


# ---------- commands ----------
def cmd_list():
    for f in sorted((ROOT / "public" / "vx").glob("*/data.json")):
        D = json.load(open(f)); tot = timeline(D)[1] / FPS
        done = sorted(p.name.split(".")[1] for p in (ROOT / "scripts" / "translations").glob(f"{D['id']}.*.json")) \
            if (ROOT / "scripts" / "translations").exists() else []
        print(f"{D['id']:<22} long {tot/60:5.1f} min  {len(D['beats']):>3} beats  {len(D['shorts'])} shorts  translations: {','.join(done) or '-'}")


def cmd_prep(vid, lang, short):
    D = load(vid); tl, _ = timeline(D, short)
    p = tpath(vid, lang)      # one file per video: Shorts reuse the long video's beats
    cur = json.load(open(p)) if p.exists() else {"video": vid, "lang": lang, "reviewed_by": None, "notes": "", "beats": {}}
    for b, f, n in tl:
        cur["beats"].setdefault(b["key"], "")
        cur.setdefault("_english", {})[b["key"]] = {"say": b["say"], "slot_sec": round(n / FPS - SLOP, 2)}
    p.parent.mkdir(exist_ok=True); json.dump(cur, open(p, "w"), indent=1, ensure_ascii=False)
    print("template:", p, f"({len(tl)} beats). Fill beats.<key> with the spoken translation. Leave _english alone.")


def cmd_build(vid, lang, short, gender, video, provider=None, voice_opt=None):
    global PROVIDER
    D = load(vid); tl, total = timeline(D, short)
    p = tpath(vid, lang)
    if not p.exists():
        raise SystemExit(f"missing {p}: run prep first")
    T = json.load(open(p)); tr = T["beats"]
    miss = [b["key"] for b, _, _ in tl if not (tr.get(b["key"]) or "").strip()]
    if miss:
        raise SystemExit(f"{vid}.{lang}: no translation for {miss}")
    PROVIDER = provider or T.get("provider") or "minimax"
    if PROVIDER == "sarvam":
        voice = voice_opt or T.get("voice_sarvam") or SARVAM_VOICES[(lang, gender)]
    else:
        voice = voice_opt or T.get("voice") or VOICES[(lang, gender)]
    emo = T.get("emotion") or {}      # optional {beat_key: emotion}; "_default" applies to the rest; none = model's own choice
    wrong = {k: e for k, e in emo.items() if e not in EMOTIONS}
    if wrong:
        raise SystemExit(f"{vid}.{lang}: unknown emotion {wrong}; use one of {sorted(EMOTIONS)}")
    L = LANGS[lang]
    sfx = "" if PROVIDER == "minimax" else f"_{PROVIDER}_{voice}"      # keep providers/voices apart for A/B listening
    tag = f"{vid}_{lang}{sfx}" + (f"_short{short + 1}" if short is not None else "")
    out = ROOT / "out" / "audio" / vid; cache = out / "cache" / (lang + sfx); cache.mkdir(parents=True, exist_ok=True)
    buf = bytearray(int(total / FPS * SR) * 2)
    report, bad = [], []
    for b, f, n in tl:
        text = tr[b["key"]].strip(); slot = n / FPS - SLOP
        spoken = with_pauses(text, lang); e = emo.get(b["key"], emo.get("_default"))
        h = lambda sp: cache / (b["key"] + "_" + hashlib.md5(
            (f"{spoken}|{voice}|{sp}" + (f"|{e}" if e else "")).encode()).hexdigest()[:8] + ".mp3")
        speed = 1.0; sec = tts(spoken, voice, lang, speed, h(speed), e)
        for _ in range(3):      # speed does not scale linearly (pauses stay), so correct up to 3 times
            if sec <= slot or speed >= L["speed_max"]:
                break
            speed = min(L["speed_max"], round(speed * sec / slot * 1.03, 2))
            sec = tts(spoken, voice, lang, speed, h(speed), e)
        status = "TOO LONG" if sec > slot + 0.05 else ("ok, FAST (shorten if you can)" if speed > L["fast"] else "ok")
        if status != "ok":
            bad.append(b["key"])
        report.append({"key": b["key"], "english_sec": b["sec"], "slot": round(slot, 2), "regional_sec": round(sec, 2),
                       "speed": speed, "status": status, "emotion": e, "text": text})
        pcm = to_pcm(h(speed)); off = int(f / FPS * SR) * 2
        seg = pcm[: max(0, len(buf) - off)]
        buf[off: off + len(seg)] = audioop.add(bytes(buf[off: off + len(seg)]), seg, 2)
        print(f"  {b['key']:<6} slot {slot:5.2f}s  voice {sec:5.2f}s  speed {speed:.2f}  {status}")
    reviewed = bool(T.get("reviewed_by"))
    name = tag + ("" if reviewed else "_DRAFT")
    wavp = out / (name + ".wav")
    with wave.open(str(wavp), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(bytes(buf))
    m4a = out / (name + ".m4a")
    subprocess.run(ffmpeg() + ["-y", "-i", str(wavp), "-c:a", "aac", "-b:a", "192k", "-f", "mp4", str(m4a)], check=True, cwd=ROOT)
    json.dump({"video": vid, "lang": lang, "short": short, "voice": voice, "reviewed_by": T.get("reviewed_by"),
               "expected_sec": round(total / FPS, 2), "too_long": bad, "beats": report},
              open(out / (name + "_report.json"), "w"), indent=1, ensure_ascii=False)
    print(f"\n{m4a}  expected length {total / FPS:.2f}s  too-long beats: {bad or 'none'}  reviewed: {reviewed}")
    if video:
        r = subprocess.run(ffmpeg("ffprobe") + ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
                           capture_output=True, text=True, cwd=ROOT)
        try:
            vd = float(r.stdout.strip().splitlines()[-1]); print(f"video {vd:.2f}s vs track {total / FPS:.2f}s "
                  + ("MATCH" if abs(vd - total / FPS) < 0.2 else "MISMATCH: do not upload"))
        except Exception:
            print("could not read video duration:", r.stdout, r.stderr)
    if bad:
        sys.exit("Shorten the translation for the TOO LONG beats and rebuild. Do not upload this track.")


def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    short = int(opt("--short")) - 1 if "--short" in sys.argv else None
    if not a or a[0] == "list":
        return cmd_list()
    if a[0] == "prep":
        return cmd_prep(a[1], a[2], short)
    if a[0] == "build":
        return cmd_build(a[1], a[2], short, opt("--gender", "male"), opt("--video"), opt("--provider"), opt("--voice"))
    raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
