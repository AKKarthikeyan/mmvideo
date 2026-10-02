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
import audioop, hashlib, json, os, subprocess, sys, time, wave
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SR = 44100
SPEED_MAX = 1.25      # above this a voice sounds rushed: shorten the translation instead
SLOP = 0.15           # keep this much silence before the next beat starts

LANGS = {
    "ta": {"name": "Tamil", "boost": "Tamil"},
    "hi": {"name": "Hindi", "boost": "Hindi"},
}
# Tamil has no native MiniMax voice: use the same English voices as the English videos (scripts/voices.py).
# Hindi has native voices. All must be ear-tested by AK / a native speaker before publishing.
VOICES = {
    ("ta", "male"): "English_Diligent_Man", ("ta", "female"): "English_captivating_female1",
    ("hi", "male"): "hindi_male_1_v2", ("hi", "female"): "hindi_female_1_v2",
}


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
def tts(text, voice, lang, speed, path):
    if path.exists():
        return json.load(open(str(path) + ".json"))["sec"]
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text.replace("MoatSCORE", "Moat Score"), "stream": False,
            "language_boost": LANGS[lang]["boost"],
            "voice_setting": {"voice_id": voice, "speed": speed, "vol": 1, "pitch": 0},
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


def cmd_build(vid, lang, short, gender, video):
    D = load(vid); tl, total = timeline(D, short)
    p = tpath(vid, lang)
    if not p.exists():
        raise SystemExit(f"missing {p}: run prep first")
    T = json.load(open(p)); tr = T["beats"]
    miss = [b["key"] for b, _, _ in tl if not (tr.get(b["key"]) or "").strip()]
    if miss:
        raise SystemExit(f"{vid}.{lang}: no translation for {miss}")
    voice = VOICES[(lang, gender)]
    tag = f"{vid}_{lang}" + (f"_short{short + 1}" if short is not None else "")
    out = ROOT / "out" / "audio" / vid; cache = out / "cache" / lang; cache.mkdir(parents=True, exist_ok=True)
    buf = bytearray(int(total / FPS * SR) * 2)
    report, bad = [], []
    for b, f, n in tl:
        text = tr[b["key"]].strip(); slot = n / FPS - SLOP
        h = lambda sp: cache / (b["key"] + "_" + hashlib.md5(f"{text}|{voice}|{sp}".encode()).hexdigest()[:8] + ".mp3")
        speed = 1.0; sec = tts(text, voice, lang, speed, h(speed))
        for _ in range(3):      # speed does not scale linearly (pauses stay), so correct up to 3 times
            if sec <= slot or speed >= SPEED_MAX:
                break
            speed = min(SPEED_MAX, round(speed * sec / slot * 1.03, 2))
            sec = tts(text, voice, lang, speed, h(speed))
        status = "TOO LONG" if sec > slot + 0.05 else ("ok, FAST (shorten if you can)" if speed > 1.15 else "ok")
        if status != "ok":
            bad.append(b["key"])
        report.append({"key": b["key"], "english_sec": b["sec"], "slot": round(slot, 2), "regional_sec": round(sec, 2),
                       "speed": speed, "status": status, "text": text})
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
        return cmd_build(a[1], a[2], short, opt("--gender", "male"), opt("--video"))
    raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
