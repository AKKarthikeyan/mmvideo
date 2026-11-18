#!/usr/bin/env python3
"""marutiq2 regional mix (29 Oct 2026, from kotakq2_regional_mix.py). Usage: marutiq2_regional_mix.py LANG   (hi|ta|te)
Per beat (Gemini TTS wav from marutiq2_regional.py): loudnorm -16, the English pause fix (lead/trail silence to 0.10 s, in-beat pauses
over 0.42 s cut to 0.36 s), fit to the English beat slot (atempo <= 1.12, padded by silence when short; overruns logged, never cut),
placed at the English beat start over out/voxplus/marutiq2/music_sfx_stem.wav (the film's own beds + SFX rendered with voice=false, so
ducking follows the English beat times), two-pass loudnorm to -16 LUFS / TP -1.5, exact English length -> marutiq2_LANG.m4a + 540p30 preview."""
import json, pathlib, re, subprocess, sys
import numpy as np, wave
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); P = R / "public/voxplus/marutiq2"; O = R / "out/voxplus/marutiq2"; FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
lang = sys.argv[1]
TL = json.load(open(P / "vo/timeline.json")); D, S, ORDER, TOTAL = TL["dur"], TL["start"], TL["order"], TL["total"]
src = P / "regional" / lang; W = src / "fit"; W.mkdir(exist_ok=True)
import os
KEEP_END = 0.10; MAXP = float(os.environ.get("MQ2_MAXP", 0.42)); KEEPP = float(os.environ.get("MQ2_KEEPP", 0.36))
# slot = up to 0.08 s before the next English beat starts (the last beat: its English length + 0.2)
NXT = {k: (S[ORDER[j + 1]] - S[k] - 0.08 if j + 1 < len(ORDER) else D[k] + 0.2) for j, k in enumerate(ORDER)}


def run(a): subprocess.run([FF, "-v", "error", "-y"] + a, check=True)
def sil(p, d=0.1):
    e = subprocess.run([FF, "-hide_banner", "-i", str(p), "-af", f"silencedetect=n=-35dB:d={d}", "-f", "null", "-"], capture_output=True, text=True).stderr
    return list(zip([float(x) for x in re.findall(r"silence_start: ([\d.]+)", e)], [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]))
def read(p):
    with wave.open(str(p)) as w: return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
def write(p, sr, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(x, -32768, 32767).astype(np.int16).tobytes())


def pausefix(n, t):   # same logic as marutiq2_audio.py
    sr, x = read(n); d = len(x) / sr; s = sil(n)
    first = s[0][1] if s and s[0][0] < 0.02 else 0.0
    last = s[-1][0] if s and s[-1][1] > d - 0.05 else d
    a0, a1 = max(0.0, first - KEEP_END), min(d, last + KEEP_END)
    cuts = [(a + KEEPP / 2, z - KEEPP / 2) for a, z in s if a > a0 + 0.01 and z < a1 - 0.01 and z - a > MAXP]
    keep, c = [], a0
    for c0, c1 in cuts: keep.append((c, c0)); c = c1
    keep.append((c, a1)); parts = []; fade = int(0.005 * sr)
    for k0, k1 in keep:
        y = x[int(round(k0 * sr)): int(round(k1 * sr))].copy()
        if len(y) > 2 * fade: y[:fade] *= np.linspace(0, 1, fade); y[-fade:] *= np.linspace(1, 0, fade)
        parts.append(y)
    y = np.concatenate(parts); write(t, sr, y); return len(y) / sr


rep = {}; M0 = (MAXP, KEEPP)
for k in ORDER:
    i = src / f"{k}_g.wav"; n = W / f"{k}_n.wav"; t = W / f"{k}_t.wav"; o = W / f"{k}_f.wav"
    run(["-i", str(i), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", str(n)])
    d = pausefix(n, t); slot = NXT[k]
    if d / slot > 1.12:   # still long: tighter pause cap for this beat only (pauses over 0.24 s cut to 0.20 s)
        MAXP, KEEPP = 0.24, 0.20; d = pausefix(n, t); MAXP, KEEPP = M0; print(lang, k, "tight pauses")
    need = d / slot; a = min(max(need, 1.0), 1.12)
    run(["-i", str(t), "-af", f"atempo={a:.4f}" if a > 1.0005 else "anull", str(o)])
    sr, y = read(o); d2 = len(y) / sr
    rep[k] = {"slot": round(slot, 2), "fixed": round(d, 2), "need": round(need, 3), "atempo": round(a, 3), "final": round(d2, 2), "overrun_s": round(max(0, d2 - slot), 2)}
json.dump(rep, open(src / "fit.json", "w"), indent=1)
over = {k: v for k, v in rep.items() if v["overrun_s"] > 0.05}
import os
if os.environ.get("FITONLY"):
    for k, v in rep.items(): print(k, v)
    sys.exit(0)
print(lang, "overruns:", over or "none"); print(lang, "above 1.08:", {k: v["atempo"] for k, v in rep.items() if v["atempo"] > 1.08} or "none")
# voice track: every fitted beat at its English start (a beat that still overruns ends early enough not to collide: gap check)
sr = 44100; vt = np.zeros(int(round(TOTAL * sr)) + sr, np.float32)
for j, k in enumerate(ORDER):
    _, y = read(W / f"{k}_f.wav"); s0 = int(round(S[k] * sr))
    if j + 1 < len(ORDER) and S[k] + len(y) / sr > S[ORDER[j + 1]]: print(lang, "COLLISION", k, "runs into", ORDER[j + 1])
    vt[s0:s0 + len(y)] += y
write(W / "voice_track.wav", sr, vt[: int(round(TOTAL * sr))])
mix = f"[0:a]aresample=44100,aformat=channel_layouts=stereo[m];[1:a]aformat=channel_layouts=stereo[v];[m][v]amix=inputs=2:normalize=0:duration=longest,apad,atrim=0:{TOTAL}"
args = ["-i", str(O / "music_sfx_stem.wav"), "-i", str(W / "voice_track.wav")]
e = subprocess.run([FF, "-hide_banner"] + args + ["-filter_complex", mix + ",loudnorm=I=-16:TP=-2:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(e[e.rindex("{"): e.rindex("}") + 1])
ln = (f"loudnorm=I=-16:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
out = O / f"marutiq2_{lang}.m4a"
run(args + ["-filter_complex", mix + "," + ln + ",aresample=48000[x]", "-map", "[x]", "-c:a", "aac", "-b:a", "192k", "-t", str(TOTAL), str(out)])
ph = O / f"marutiq2_{lang}_540p30.mp4"
run(["-i", str(O / "maruti-q2-material-cost-margin_phone_540p30.mp4"), "-i", str(out), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "96k",
     "-t", str(TOTAL), "-movflags", "+faststart", str(ph)])
e = subprocess.run([FF, "-hide_banner", "-nostats", "-i", str(out), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
I = re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1]; TP = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)[-1]
dd = subprocess.run([FF, "-hide_banner", "-i", str(out), "-f", "null", "-"], capture_output=True, text=True).stderr
print(lang, "wrote", out.name, ph.name, "I", I, "LUFS, true peak", TP, "dBFS, duration", re.findall(r"time=([\d:.]+)", dd)[-1])
