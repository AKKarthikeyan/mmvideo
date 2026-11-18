# Gadget Short: word timings for vo_raw.mp3, aligned to the SCRIPT, then the read is tightened into vo.wav.
# 1. Unprompted mlx-whisper gives the times; difflib maps them onto the script tokens (same method as
#    scripts/voxplus/scale_shorts_align.py), so every cue matches what is actually said.
# 2. Tighten: every silent gap longer than GAP is cut down to GAP (the series is brisk); a gap after a beat with "pause" in
#    script.json keeps up to pause + GAP. Word times are shifted by the removed spans.
# 3. Holds: "hold" adds silence after a beat (reading time) with no re-voice.
# Output public/gadget/<id>/vo.wav and src/gadget/<id>/timing.json {total, beats: {key: [start, end]}, words: [[token, s, e, key]]}.
# Run on the Mini: ~/jev_full/.stt-venv/bin/python scripts/gadget/gk_align.py src/gadget/mivione/script.json
import json, pathlib, re, subprocess, sys, wave, difflib
import numpy as np, mlx_whisper
FF = "/tmp/ffbin/ffmpeg"; SR = 44100; GAP = 0.28; DB = -42
SP = pathlib.Path(sys.argv[1]); S = json.load(open(SP)); D = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/gadget") / S["id"]
n = lambda s: re.sub(r"[^a-z0-9]+", "", s.lower().replace("’", "").replace("'", ""))
def load(path, sr):
    wav = f"/tmp/gk_{S['id']}_{sr}.wav"
    subprocess.run([FF, "-v", "error", "-y", "-i", str(path), "-ac", "1", "-ar", str(sr), "-c:a", "pcm_s16le", wav], check=True)
    w = wave.open(wav); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
a16 = load(D / "vo_raw.mp3", 16000); raw = load(D / "vo_raw.mp3", SR); total = len(raw) / SR
r = mlx_whisper.transcribe(a16, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="en", word_timestamps=True)
heard = [(x["word"].strip(), x["start"], x["end"]) for s in r["segments"] for x in s.get("words", [])]
toks = [(t, b["key"]) for b in S["beats"] for t in b["say"].split()]
say = [t for t, _ in toks]
res = [None] * len(say)
sm = difflib.SequenceMatcher(a=[n(x[0]) for x in heard], b=[n(x) for x in say], autojunk=False)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if j2 == j1: continue
    if op == "equal":
        for d in range(j2 - j1): res[j1 + d] = (heard[i1 + d][1], heard[i1 + d][2])
    elif i2 > i1:   # replace (whisper writes "16", "9.15", "mAh"): spread the script words over the heard span by length
        t0, t1 = heard[i1][1], heard[i2 - 1][2]; L = [max(1, len(x)) for x in say[j1:j2]]; c = 0
        for d, l in enumerate(L):
            res[j1 + d] = (t0 + (t1 - t0) * c / sum(L), t0 + (t1 - t0) * (c + l) / sum(L)); c += l
for j in range(len(say)):   # pure inserts: interpolate between neighbours
    if res[j] is None:
        p = next((res[i][1] for i in range(j - 1, -1, -1) if res[i]), 0.0); q = next((res[i][0] for i in range(j + 1, len(say)) if res[i]), total)
        res[j] = (p, max(p + 0.05, (p + q) / 2))
eq = sum(j2 - j1 for op, i1, i2, j1, j2 in sm.get_opcodes() if op == "equal")

# --- tighten: silent runs from 10 ms RMS frames
hop = SR // 100; fr = len(raw) // hop
rms = np.sqrt(np.mean(raw[: fr * hop].reshape(fr, hop) ** 2, axis=1) + 1e-12); quiet = 20 * np.log10(rms) < DB
runs, i = [], 0
while i < fr:
    if quiet[i]:
        j = i
        while j < fr and quiet[j]: j += 1
        runs.append((i / 100, j / 100)); i = j
    else: i += 1
pause_after = {}   # end time of each beat with a pause -> allowed gap
for b in S["beats"]:
    if b.get("pause"):
        last = max(k for k, (t, kk) in enumerate(toks) if kk == b["key"]); pause_after[res[last][1]] = b["pause"] + GAP
cuts = []   # (start, end) spans removed from the raw read
for s0, s1 in runs:
    keep = GAP
    for t_end, g in pause_after.items():
        if abs(t_end - s0) < 0.35: keep = g
    if s0 <= 0.01: keep = 0.05   # lead-in
    if s1 - s0 > keep + 0.02:
        m = s0 + keep / 2; cuts.append((m, m + (s1 - s0 - keep)))
keep_mask = np.ones(len(raw), bool)
for c0, c1 in cuts: keep_mask[int(c0 * SR): int(c1 * SR)] = False
out = raw[keep_mask].copy()
pos = 0   # 4 ms fades around each join to avoid clicks
for c0, c1 in cuts:
    j = int(c0 * SR) - pos; f = int(0.004 * SR)
    if f < j < len(out) - f: out[j - f: j] *= np.linspace(1, 0, f); out[j: j + f] *= np.linspace(0, 1, f)
    pos += int(c1 * SR) - int(c0 * SR)
def shift(t):
    d = 0.0
    for c0, c1 in cuts:
        if t >= c1: d += c1 - c0
        elif t > c0: return c0 - d
    return t - d
words = [[t, shift(s), shift(e), k] for (t, k), (s, e) in zip(toks, res)]
# 3. holds: "hold" in script.json adds silence after a beat (screen time to read its visual) without re-voicing
for b in reversed(S["beats"]):
    if not b.get("hold"): continue
    last = max(i for i, x in enumerate(words) if x[3] == b["key"])
    nxt = words[last + 1][1] if last + 1 < len(words) else len(out) / SR
    # whisper's word ends can run into the silence: insert at the quietest 10 ms between the last words and the next
    lo, hi = int(max(0, words[last][2] - 0.35) * 100), int(nxt * 100)
    seg = [np.sqrt(np.mean(out[i * hop:(i + 1) * hop] ** 2)) for i in range(lo, max(lo + 1, hi))]
    i_ins = (lo + int(np.argmin(seg))) * hop + hop // 2
    out = np.concatenate([out[:i_ins], np.zeros(int(b["hold"] * SR), np.float32), out[i_ins:]])
    for x in words[last + 1:]: x[1] += b["hold"]; x[2] += b["hold"]
words = [[t, round(s, 3), round(e, 3), k] for t, s, e, k in words]
w = wave.open(str(D / "vo.wav"), "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
tight = len(out) / SR
beats = {}
for t, s, e, k in words:
    beats.setdefault(k, [s, e]); beats[k][1] = e
json.dump({"total": round(tight, 3), "beats": beats, "words": words}, open(SP.parent / "timing.json", "w"), indent=0)
print(f"{S['id']}: raw {total:.2f}s -> tight {tight:.2f}s ({len(cuts)} gaps cut); {len(say)} script tokens, {eq} matched exactly")
for k, (s, e) in beats.items(): print(f"  {k} {s:6.2f}-{e:6.2f}")
