#!/usr/bin/env python3
"""Mouth cues from Rhubarb Lip Sync (MIT, github.com/DanielSWolf/rhubarb-lip-sync): public/datayt/beats/<id>/mouth_cues.json.

Replaces the audio-envelope stand-in (scripts/datayt/mouth_cues.py) with Rhubarb's phoneme-based cues, in the same file format, so
the CARTOON look needs no change. Each narration line is decoded to a mono 16-bit WAV, Rhubarb is run on it with the line's own
text as the dialog (this makes it much more accurate), and the cues are turned into one shape letter per video frame.

Rhubarb 1.14.0 ships an Intel-only macOS binary. On Apple Silicon it needs Rosetta (softwareupdate --install-rosetta, run by the
Mac's admin). Point RHUBARB at the binary (default: the unzipped release under research/2026-10-28-cartoon/rhubarb).
English only: Rhubarb's recogniser is English. Tamil words inside a line are read as English sounds; for non-English lines use
--recognizer phonetic or keep the envelope stand-in.

  .venv/bin/python scripts/datayt/rhubarb_cues.py cw01
  .venv/bin/python scripts/datayt/rhubarb_cues.py --selftest      # checks the cue-to-frame conversion with a made-up Rhubarb JSON
"""
import json, os, subprocess, sys, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BEATS = os.path.join(ROOT, "public/datayt/beats")
COMP = os.path.join(ROOT, "node_modules/@remotion/compositor-darwin-arm64")
RHUBARB = os.environ.get("RHUBARB", "/Volumes/DarwinSSD/DataKadai/research/2026-10-28-cartoon/rhubarb/unpacked/Rhubarb-Lip-Sync-1.14.0-macOS/rhubarb")
FPS = 30


def to_wav(src, dst):
    env = {**os.environ, "DYLD_LIBRARY_PATH": COMP}
    subprocess.run([f"{COMP}/ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "16000", "-acodec", "pcm_s16le", dst], check=True, env=env)


def frames_from_cues(cues, n_frames):
    """One shape letter per video frame, read at the frame's midpoint; before the first cue and after the last, X (rest)."""
    out, j = [], 0
    for k in range(n_frames):
        t = (k + 0.5) / FPS
        while j < len(cues) - 1 and cues[j]["end"] <= t: j += 1
        c = cues[j] if cues else None
        out.append(c["value"] if c and c["start"] <= t < c["end"] else "X")
    return "".join(out)


def cues_abs(shapes, f0):
    cues, i = [], 0
    while i < len(shapes):
        j = i
        while j < len(shapes) and shapes[j] == shapes[i]: j += 1
        cues.append({"start": round((f0 + i) / FPS, 3), "end": round((f0 + j) / FPS, 3), "shape": shapes[i]})
        i = j
    return cues


def run_rhubarb(wav, text, recognizer):
    with tempfile.TemporaryDirectory() as td:
        dlg, out = os.path.join(td, "dialog.txt"), os.path.join(td, "cues.json")
        open(dlg, "w").write(text)
        cmd = [RHUBARB, "-f", "json", "--extendedShapes", "GHX", "-r", recognizer, "-o", out, "--quiet"]
        if recognizer == "pocketSphinx": cmd += ["-d", dlg]
        subprocess.run(cmd + [wav], check=True)
        return json.load(open(out))["mouthCues"]


def main(sid, recognizer="pocketSphinx"):
    if not os.path.exists(RHUBARB): raise SystemExit(f"Rhubarb binary not found: {RHUBARB} (set RHUBARB)")
    d = os.path.join(BEATS, sid)
    D = json.load(open(os.path.join(d, "data.json")))
    dst = os.path.join(d, "mouth_cues.json")
    lines = []
    for v in D["vo"]:
        with tempfile.TemporaryDirectory() as td:
            wav = os.path.join(td, "line.wav")
            to_wav(os.path.join(d, v["file"]), wav)
            cues = run_rhubarb(wav, v.get("text", ""), recognizer)
        n = int(round(v["sec"] * FPS)) + 2
        sh = frames_from_cues(cues, n)
        f0 = int(round(v["at"] * FPS))
        lines.append({"file": v["file"], "at": v["at"], "f0": f0, "text": v.get("text", ""), "shapes": sh, "cues": cues_abs(sh, f0)})
        print(v["file"], {c: sh.count(c) for c in sorted(set(sh))}, flush=True)
    # keep the envelope stand-in beside the new file, only once Rhubarb has actually produced cues
    if os.path.exists(dst) and "envelope" in json.load(open(dst)).get("method", ""):
        os.replace(dst, os.path.join(d, "mouth_cues_envelope.json"))
    json.dump({"id": sid, "fps": FPS, "method": f"Rhubarb Lip Sync 1.14.0 ({recognizer}, dialog given)", "lines": lines}, open(dst, "w"), indent=1)


def selftest():
    cues = [{"start": 0.0, "end": 0.1, "value": "X"}, {"start": 0.1, "end": 0.3, "value": "C"}, {"start": 0.3, "end": 0.4, "value": "A"}, {"start": 0.4, "end": 0.5, "value": "X"}]
    got = frames_from_cues(cues, 16)
    want = "XXXCCCCCCAAAXXXX"      # frames 0-2 X (t .017-.083), 3-8 C (.117-.283), 9-11 A (.317-.383), 12-14 X, 15 past the end: X
    assert got == want, (got, want)
    assert cues_abs("XXCC", 4)[1] == {"start": round(6 / FPS, 3), "end": round(8 / FPS, 3), "shape": "C"}
    print("selftest ok:", got)


if __name__ == "__main__":
    if "--selftest" in sys.argv: selftest()
    else:
        a = [x for x in sys.argv[1:] if not x.startswith("-")]
        rec = sys.argv[sys.argv.index("--recognizer") + 1] if "--recognizer" in sys.argv else "pocketSphinx"
        main(a[0] if a else "cw01", rec)
