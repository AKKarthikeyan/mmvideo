#!/usr/bin/env python3
"""Mouth cues for a cartoon character that speaks the narration: public/datayt/beats/<id>/mouth_cues.json.

Same shape alphabet as Rhubarb Lip Sync (X rest, A closed lips P/B/M, B slightly open, C open, D wide open, E rounded,
F pucker, G teeth on lip, H tongue up), so a Rhubarb run can replace this file later without touching the look. Rhubarb 1.14
ships an Intel-only macOS binary and this Mac Mini has no Rosetta, so these cues come from the audio instead: loudness for
how far the mouth opens, zero-crossing rate for hissing sounds (s, f, sh), spectral centroid for round vowels (o, oo), and a
short dip inside speech for closed lips. It is a stand-in, not a phoneme recogniser: it reads as talking, not as exact words.

  .venv/bin/python scripts/datayt/mouth_cues.py cw01
Writes {id, fps, method, lines: [{file, at, f0, shapes: one letter per video frame, cues: [{start, end, shape}] in absolute seconds}]}.
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BEATS = os.path.join(ROOT, "public/datayt/beats")
COMP = os.path.join(ROOT, "node_modules/@remotion/compositor-darwin-arm64")
SR, FPS, HOP, WIN = 16000, 30, 0.01, 0.025


def load_audio(path):
    env = {**os.environ, "DYLD_LIBRARY_PATH": COMP}
    raw = subprocess.run([f"{COMP}/ffmpeg", "-v", "error", "-i", path, "-f", "wav", "-acodec", "pcm_s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, env=env, check=True).stdout
    i = raw.find(b"data")
    return np.frombuffer(raw[i + 8: i + 8 + (len(raw) - i - 8) // 2 * 2], np.int16).astype(np.float32) / 32768


def features(a):
    n, hop = int(WIN * SR), int(HOP * SR)
    win = np.hanning(n)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    db, zcr, cen = [], [], []
    for i in range(0, max(1, len(a) - n), hop):
        x = a[i:i + n]
        rms = float(np.sqrt(np.mean(x ** 2)) + 1e-9)
        db.append(20 * np.log10(rms))
        zcr.append(float(np.mean(np.abs(np.diff(np.signbit(x).astype(np.int8))))))
        s = np.abs(np.fft.rfft(x * win))
        cen.append(float((freqs * s).sum() / (s.sum() + 1e-9)))
    return np.array(db), np.array(zcr), np.array(cen)


def shapes_for(a):
    db, zcr, cen = features(a)
    floor, peak = np.percentile(db, 8), np.percentile(db, 96)
    lvl = np.clip((db - floor) / max(1e-6, peak - floor), 0, 1)
    lvl = np.convolve(lvl, np.ones(3) / 3, mode="same")
    raw = []
    for L, z, c in zip(lvl, zcr, cen):
        if L < 0.14: raw.append("X")
        elif z > 0.30 and L < 0.75: raw.append("G" if (L > 0.5 and c > 3500) else "B")      # hiss: s, sh, f
        elif c < 450 and L > 0.35: raw.append("F")                                           # oo
        elif c < 650 and L > 0.5: raw.append("E")                                            # o
        elif L < 0.5: raw.append("B")
        elif L < 0.84: raw.append("C")
        else: raw.append("D")
    # a short rest inside speech is a closed-lips consonant (p, b, m)
    s = raw[:]
    i = 0
    while i < len(s):
        if s[i] == "X":
            j = i
            while j < len(s) and s[j] == "X": j += 1
            if 0 < i and j < len(s) and (j - i) * HOP <= 0.12: s[i:j] = ["A"] * (j - i)
            i = j
        else: i += 1
    # one letter per video frame: the loudest-weighted shape among the analysis frames inside it
    nf = int(np.ceil(len(a) / SR * FPS)) + 1
    out = []
    per = int(round(1 / (FPS * HOP)))
    for k in range(nf):
        seg = range(int(k / FPS / HOP), min(len(s), int((k + 1) / FPS / HOP) + 1))
        if not len(seg): out.append("X"); continue
        w = {}
        for j in seg: w[s[j]] = w.get(s[j], 0) + 0.2 + float(lvl[j])
        out.append(max(w, key=w.get))
    # no single-frame flicker: a shape held for one frame between two equal shapes takes theirs
    for k in range(1, len(out) - 1):
        if out[k - 1] == out[k + 1] != out[k]: out[k] = out[k - 1]
    return "".join(out)


def cues_of(shapes, f0):
    cues, i = [], 0
    while i < len(shapes):
        j = i
        while j < len(shapes) and shapes[j] == shapes[i]: j += 1
        cues.append({"start": round((f0 + i) / FPS, 3), "end": round((f0 + j) / FPS, 3), "shape": shapes[i]})
        i = j
    return cues


def main(sid):
    d = os.path.join(BEATS, sid)
    D = json.load(open(os.path.join(d, "data.json")))
    lines = []
    for v in D["vo"]:
        sh = shapes_for(load_audio(os.path.join(d, v["file"])))
        f0 = int(round(v["at"] * FPS))
        lines.append({"file": v["file"], "at": v["at"], "f0": f0, "text": v.get("text", ""), "shapes": sh, "cues": cues_of(sh, f0)})
        hist = {c: sh.count(c) for c in sorted(set(sh))}
        print(v["file"], f"{len(sh)} frames", hist)
    json.dump({"id": sid, "fps": FPS, "method": "audio envelope stand-in (Rhubarb 1.14 is Intel-only; no Rosetta on this Mac): loudness, zero-crossing rate, centroid",
               "lines": lines}, open(os.path.join(d, "mouth_cues.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "cw01")
