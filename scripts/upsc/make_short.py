#!/usr/bin/env python3
"""A vertical Short cut from a finished UPSC long film: chosen scenes, the film's own voice and sound, captions from the measured word times.

  .venv/bin/python scripts/upsc/make_short.py build  <id>     # spec -> shorts/<id>/props.json + audio.wav
  .venv/bin/python scripts/upsc/make_short.py render <id>     # Remotion UPSC-SHORT (1080x1920, 60 fps) + mux -> out/upsc/shorts/<id>/<id>.mp4

Spec: public/datayt/long/upsc/shorts/<id>.json
  {film, video (the film's final mp4, the sound source), kicker, title, end, scenes: [{id, start?, end?}]}
`start` / `end` name a word in that scene's narration (as in word_times.json): the cut begins just before `start` and ends just after
`end`, so a scene can drop a sentence that only makes sense inside the long film. No new words are voiced: every sound is the film's.
"""
import json, os, subprocess, sys, wave

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = os.path.join(ROOT, "public/datayt/long/upsc")
FF = "/tmp/ffbin/ffmpeg"
FPS = 30                 # the timeline's logical frame rate
END = 75                 # end card, logical frames (2.5 s)
PRE, POST = 0.06, 0.40
SR = 48000   # seconds kept before a `start` word and after an `end` word


def find(words, w, after=0):
    for i in range(after, len(words)):
        if words[i]["w"] == w:
            return i
    raise SystemExit(f"word {w!r} not found")


def build(sid):
    spec = json.load(open(os.path.join(BASE, "shorts", f"{sid}.json"), encoding="utf-8"))
    d = os.path.join(BASE, spec["film"])
    tl = {s["id"]: s for s in json.load(open(os.path.join(d, "timeline.json")))["scenes"]}
    wt = json.load(open(os.path.join(d, "word_times.json")))["scenes"]
    scenes, words, segs, at = [], [], [], 0
    for c in spec["scenes"]:
        s, ws = tl[c["id"]], wt.get(c["id"], {}).get("words", [])
        full = s["dur"] / FPS
        i0 = find(ws, c["start"]) if c.get("start") else 0
        i1 = find(ws, c["end"], i0) if c.get("end") else len(ws) - 1
        t0 = max(0.0, ws[i0]["start"] - PRE) if c.get("start") else 0.0
        t1 = min(full, ws[i1]["end"] + POST) if c.get("end") else full
        skip, dur = int(round(t0 * FPS)), int(round((t1 - t0) * FPS))
        scenes.append({**{k: s[k] for k in ("id", "kind", "spec", "reveals")}, "from": at, "dur": dur, "skip": skip, "full": s["dur"]})
        for w in ws[i0:i1 + 1]:
            if w["w"].startswith("-") and words:                 # whisper splits "thirty-two" into "thirty" + "-two": rejoin
                words[-1]["w"] += w["w"]; words[-1]["end"] = round(at / FPS + w["end"] - skip / FPS, 3); continue
            words.append({"w": w["w"], "start": round(at / FPS + w["start"] - skip / FPS, 3), "end": round(at / FPS + w["end"] - skip / FPS, 3)})
        segs.append((s["from"] / FPS + skip / FPS, dur / FPS))
        at += dur
    out = os.path.join(BASE, "shorts", sid)
    os.makedirs(out, exist_ok=True)
    props = {"timeline": {"id": sid, "fps": FPS, "total": at, "scenes": scenes}, "words": words, "kicker": spec["kicker"],
             "title": spec["title"], "end": spec["end"], "dur": at + END}
    json.dump(props, open(os.path.join(out, "props.json"), "w", encoding="utf-8"), ensure_ascii=False)
    # the film's mixed sound (voice + effects), cut to the same pieces with 10 ms / 30 ms fades at each join; end card in silence.
    # Cut in numpy: the /tmp/ffbin build has no afade/concat filters.
    import numpy as np
    video = spec["video"] if os.path.isabs(spec["video"]) else os.path.join(ROOT, spec["video"])
    full = os.path.join(out, "film.wav")
    subprocess.run([FF, "-v", "error", "-y", "-i", video, "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", full], check=True)
    w = wave.open(full); film = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768; w.close()
    os.remove(full)
    parts = []
    for a, b in segs:
        x = film[int(round(a * SR)):int(round((a + b) * SR))].copy()
        fi, fo = int(0.01 * SR), int(0.03 * SR)
        x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        parts.append(x)
    parts.append(np.zeros((int(END / FPS * SR), 2), np.float32))
    cut = os.path.join(out, "cut.wav")
    w = wave.open(cut, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(np.concatenate(parts), -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    subprocess.run([FF, "-v", "error", "-y", "-i", cut, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-ac", "2", os.path.join(out, "audio.wav")], check=True)
    print(f"{sid}: {len(scenes)} scenes, {len(words)} words, {(at + END) / FPS:.1f} s with the end card -> {out}")


def render(sid):
    src = os.path.join(BASE, "shorts", sid)
    o = os.path.join(ROOT, "out/upsc/shorts", sid)
    os.makedirs(o, exist_ok=True)
    pic, fin = os.path.join(o, f"{sid}_picture.mp4"), os.path.join(o, f"{sid}.mp4")
    subprocess.run(["npx", "remotion", "render", "src/index.ts", "UPSC-SHORT", pic, f"--props={os.path.join(src, 'props.json')}", "--crf=18"],
                   check=True, cwd=ROOT)
    subprocess.run(["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", pic, "-i", os.path.join(src, "audio.wav"), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", fin], check=True, cwd=ROOT)   # /tmp/ffbin has no AAC encoder
    print(f"wrote {fin}")


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in ("build", "render"):
        raise SystemExit(__doc__)
    {"build": build, "render": render}[sys.argv[1]](sys.argv[2])
