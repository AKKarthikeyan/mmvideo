#!/usr/bin/env python3
"""A01 v4 pause fix (AK 18 Oct: "In some places Voice is paused"). Same words, same voice, no re-voicing:
each normalised beat file (vo/<beat>_n.wav) is cut only inside its silences:
  - leading and trailing silence trimmed to 0.10 s;
  - every pause inside a beat longer than 0.42 s (silencedetect -35 dB) shortened to 0.36 s (0.18 s kept each side,
    5 ms fades at the joins);
-> vo/<beat>_t.wav. New beat starts: 0.22 s between beats (0.42 s of voice silence with the 0.10 s ends),
0.90 s before a chapter question, the "But..." beat and m01 after the title card (about 1.1 s of silence);
the script's holds after m03, n04, w06 are folded into the normal gap.
Writes: vo/timing.json and vo/timeline.json for the new files (old ones kept as *_1018.json), and
src/voxplus/a01v4Timing.ts with the new starts plus a piecewise-linear WARP from old film seconds to new film seconds,
so every visual cue written against the 18 Oct timing lands on the same word.
Run: uv run -q -p 3.13 --with numpy python a01v4_tighten.py"""
import json, pathlib, re, subprocess, wave
import numpy as np
MM = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); V = MM / "public/voxplus/a01v4/vo"; FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
T = json.loads((V / "timing_1018.json").read_text()); TL = json.loads((V / "timeline_1018.json").read_text())
ORDER, S_OLD = TL["order"], TL["start"]
KEEP_END, MAXP, KEEPP = 0.10, 0.42, 0.36
CHAPQ = {"n01", "w01", "f01", "s01", "l01", "x01", "l02", "m01"}
def silences(path, d=0.1):
    e = subprocess.run([FF, "-hide_banner", "-i", str(path), "-af", f"silencedetect=n=-35dB:d={d}", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", e)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]
    return list(zip(st, en))
def read(p):
    with wave.open(str(p)) as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        assert sw == 2 and ch == 1, (sw, ch)
        return sr, np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32)
def write(p, sr, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(x, -32768, 32767).astype(np.int16).tobytes())
new_t, segmap, report = {}, {}, {}
for b in ORDER:
    sr, x = read(V / f"{b}_n.wav"); dur = len(x) / sr
    sil = silences(V / f"{b}_n.wav")
    first = sil[0][1] if sil and sil[0][0] < 0.02 else 0.0
    last = sil[-1][0] if sil and sil[-1][1] > dur - 0.05 else dur
    a0, a1 = max(0.0, first - KEEP_END), min(dur, last + KEEP_END)
    cuts = [(a + KEEPP / 2, z - KEEPP / 2) for a, z in sil if a > a0 + 0.01 and z < a1 - 0.01 and z - a > MAXP]
    keep, t = [], a0
    for c0, c1 in cuts: keep.append((t, c0)); t = c1
    keep.append((t, a1))
    parts, pos, seg = [], 0.0, []
    fade = int(0.005 * sr)
    for k0, k1 in keep:
        y = x[int(round(k0 * sr)): int(round(k1 * sr))].copy()
        if len(y) > 2 * fade:
            y[:fade] *= np.linspace(0, 1, fade); y[-fade:] *= np.linspace(1, 0, fade)
        parts.append(y); L = len(y) / sr
        seg.append([round(k0, 4), round(k1, 4), round(pos, 4), round(pos + L, 4)]); pos += L
    write(V / f"{b}_t.wav", sr, np.concatenate(parts))
    segmap[b] = seg
    new_t[b] = pos
    report[b] = {"old_dur": round(dur, 3), "new_dur": round(pos, 3), "lead_cut": round(a0, 2), "tail_cut": round(dur - a1, 2),
                 "pauses_shortened": [[round(c0 - KEEPP / 2, 2), round(c1 + KEEPP / 2, 2)] for c0, c1 in cuts]}
def local(b, t):   # old file time -> new file time (piecewise linear through the kept segments)
    seg = segmap[b]
    if t <= seg[0][0]: return seg[0][2]
    for i, (k0, k1, n0, n1) in enumerate(seg):
        if t <= k1: return n0 + (t - k0)
        if i + 1 < len(seg) and t < seg[i + 1][0]: return n1
    return seg[-1][3]
# new starts
start, t = {}, 0.0
for i, b in enumerate(ORDER):
    if i: t += (0.90 if b in CHAPQ else 0.22)
    start[b] = round(t, 3); t = start[b] + new_t[b]
total = round(start["e01"] + new_t["e01"] + 1.0 + 5.0, 3)
# warp knots: old film second -> new film second, at every kept segment edge
ko, kn = [], []
for b in ORDER:
    for k0, k1, n0, n1 in segmap[b]:
        ko += [S_OLD[b] + k0, S_OLD[b] + k1]; kn += [start[b] + n0, start[b] + n1]
# new timing.json (sentences mapped onto the new files, pauses re-detected) and timeline.json
T2 = {}
for b in ORDER:
    p = [[round(a, 2), round(z, 2)] for a, z in silences(V / f"{b}_t.wav", 0.09)]
    T2[b] = {"dur": round(new_t[b], 3), "sents": [[round(local(b, s0), 2), round(local(b, s1), 2), tx] for s0, s1, tx in T[b]["sents"]], "pauses": p}
(V / "timing.json").write_text(json.dumps(T2, indent=1, ensure_ascii=False))
(V / "timeline.json").write_text(json.dumps({"start": start, "total": total, "order": ORDER, "suffix": "_t"}, indent=1))
(V / "tighten_report.json").write_text(json.dumps({"segments": segmap, "beats": report}, indent=1))
ts = ("// generated by scripts/voxplus/a01v4_tighten.py (pause fix, 18 Oct 2026): do not edit by hand\n"
      "// BEAT/BEAT_DUR = the tightened narration (vo/<beat>_t.wav). Visual cues were written against the first timing\n"
      "// (BEAT_OLD); W() maps an old film second onto the new film, so each cue still lands on its word.\n"
      f"export const BEAT: Record<string, number> = {json.dumps(start)};\n"
      f"export const BEAT_DUR: Record<string, number> = {json.dumps({b: round(new_t[b], 3) for b in ORDER})};\n"
      f"export const BEAT_OLD: Record<string, number> = {json.dumps(S_OLD)};\n"
      f"export const BEAT_DUR_OLD: Record<string, number> = {json.dumps({b: T[b]['dur'] for b in ORDER})};\n"
      f"export const BEAT_ORDER = {json.dumps(ORDER)};\n"
      f"export const FILM_TOTAL_S = {total};\n"
      f"export const VO_SUFFIX = \"_t\";\n"
      f"const WO = {json.dumps([round(v, 4) for v in ko])};\n"
      f"const WN = {json.dumps([round(v, 4) for v in kn])};\n"
      "/** old film second -> new film second (linear between knots, slope 1 outside, never below 0). */\n"
      "export const W = (t: number) => {\n"
      "  if (t <= WO[0]) return Math.max(0, WN[0] + (t - WO[0]));\n"
      "  if (t >= WO[WO.length - 1]) return WN[WN.length - 1] + (t - WO[WO.length - 1]);\n"
      "  let lo = 0, hi = WO.length - 1;\n"
      "  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (WO[m] <= t) lo = m; else hi = m; }\n"
      "  const span = WO[hi] - WO[lo];\n"
      "  return span <= 1e-9 ? WN[hi] : WN[lo] + ((t - WO[lo]) / span) * (WN[hi] - WN[lo]);\n"
      "};\n")
(MM / "src/voxplus/a01v4Timing.ts").write_text(ts)
print("old total", TL["total"], "new total", total, "=", f"{int(total // 60)}:{total % 60:04.1f}")
print("beats:", " ".join(f"{b}:{report[b]['old_dur']}->{report[b]['new_dur']}" for b in ORDER))
