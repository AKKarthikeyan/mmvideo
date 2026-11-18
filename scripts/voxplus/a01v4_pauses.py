#!/usr/bin/env python3
"""A01 v4 pause audit: places the per-beat narration files at their beat starts (narration only, no music or SFX),
runs silencedetect (-35 dB, 0.6 s) on that track and lists every silence over 0.7 s with where it sits and why.
Usage: python3 a01v4_pauses.py TIMELINE_JSON TIMING_JSON SUFFIX OUT_JSON   (SUFFIX: _n for the 18 Oct files, _t for tightened)"""
import json, pathlib, re, subprocess, sys
V = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/a01v4/vo")
tl, tm, suf, out = json.loads(pathlib.Path(sys.argv[1]).read_text()), json.loads(pathlib.Path(sys.argv[2]).read_text()), sys.argv[3], pathlib.Path(sys.argv[4])
S, order = tl["start"], tl["order"]
FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
args, filt = [FF, "-v", "error", "-y"], []
for i, b in enumerate(order):
    args += ["-i", str(V / f"{b}{suf}.wav")]
    ms = int(round(S[b] * 1000)); filt.append(f"[{i}:a]adelay={ms}|{ms}[a{i}]")
filt.append("".join(f"[a{i}]" for i in range(len(order))) + f"amix=inputs={len(order)}:normalize=0:dropout_transition=0[m]")
track = out.with_suffix(".wav")
subprocess.run(args + ["-filter_complex", ";".join(filt), "-map", "[m]", "-ar", "44100", "-ac", "1", str(track)], check=True)
e = subprocess.run([FF, "-hide_banner", "-i", str(track), "-af", "silencedetect=n=-35dB:d=0.6", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", e)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]
CHAP = {"m01", "n01", "w01", "f01", "s01", "l01", "x01"}
HOLD = {"m03": 0.5, "n04": 0.6, "w06": 0.3}
def voiced(b):   # first and last voiced time in the beat file (from its pauses list)
    p = tm[b].get("pauses", []); d = tm[b]["dur"]
    lead = p[0][1] if p and p[0][0] < 0.02 else 0.0
    tail = p[-1][0] if p and p[-1][1] > d - 0.05 else d
    return lead, tail
rows = []
for a, z in zip(st, en):
    L = z - a
    if L <= 0.7: continue
    inside = [b for b in order if S[b] <= a and z <= S[b] + tm[b]["dur"]]
    if inside:
        b = inside[0]; ra, rz = a - S[b], z - S[b]
        sents = tm[b]["sents"]
        between = any(abs(s1 - x[0]) < 1.5 and s1 <= ra + 0.6 for s1, x in zip([s[1] for s in sents[:-1]], sents[1:]) if x[0] >= rz - 0.6)
        cause = "inside the beat: pause between sentences (MiniMax pause tag + its own sentence pause)" if between else "inside the beat: MiniMax pause mid-sentence"
        where = f"inside {b} ({ra:.2f}-{rz:.2f} s into the beat)"
    else:
        prev = [b for b in order if S[b] + tm[b]["dur"] <= z + 0.01 and S[b] < a + 0.01]
        nxt = [b for b in order if S[b] >= a - 0.01]
        p = prev[-1] if prev else None; n = nxt[0] if nxt else None
        if p and n:
            tail = tm[p]["dur"] - voiced(p)[1]; lead = voiced(n)[0]; gap = S[n] - (S[p] + tm[p]["dur"])
            kind = "title card + chapter card" if n == "m01" else "chapter card" if n in CHAP else "the 'But...' moment" if n == "l02" else f"script hold {HOLD[p]} s" if p in HOLD else "gap between beats"
            cause = f"between beats: {p} trailing silence {tail:.2f} s + composition gap {gap:.2f} s ({kind}) + {n} leading silence {lead:.2f} s"
            where = f"between {p} and {n}"
        else:
            cause, where = "end of film (hold + end card, no narration by design)", f"after {p}"
    rows.append({"t": round(a, 2), "len": round(L, 2), "where": where, "cause": cause})
out.write_text(json.dumps({"track_s": tl["total"], "silences_over_0_7": rows}, indent=1))
for r in rows: print(f"{int(r['t']//60)}:{r['t']%60:05.2f}  {r['len']:.2f} s  {r['where']:<40} {r['cause']}")
print("COUNT over 0.7 s:", len(rows))
