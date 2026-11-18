#!/usr/bin/env python3
"""kotakq2 regional mix. Usage: kotakq2_regional_mix.py LANG ENGINE(g|p)   (g = Google Chirp 3 HD mp3, p = Indic Parler wav)
Per beat: trim lead/trail silence to 0.10 s, loudnorm -16, fit to the English beat slot (atempo <= 1.12; padded by silence when short; overruns are logged, never cut),
place at the English beat start, mix over the music+SFX stem (same bed and ducking as the English film), loudnorm -16 LUFS -> kotakq2_LANG[_p].m4a and a 540p phone preview."""
import json, pathlib, re, subprocess, sys
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); P = R / "public/voxplus/kotakq2"; O = R / "out/voxplus/kotakq2"; FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
lang, eng = sys.argv[1], sys.argv[2]; ext = "mp3" if eng == "g" else "wav"
TL = json.load(open(P / "vo/timeline.json")); D, S, ORDER, TOTAL = TL["dur"], TL["start"], TL["order"], TL["total"]
src = P / "regional" / lang; W = src / f"fit_{eng}"; W.mkdir(exist_ok=True)
def dur(p):
    e = subprocess.run([FF, "-hide_banner", "-i", str(p), "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"time=(\d+):(\d+):([\d.]+)", e)[-1]; return int(m[0]) * 3600 + int(m[1]) * 60 + float(m[2])
rep = {}
for k in ORDER:
    i = src / f"{k}_{eng}.{ext}"; n = W / f"{k}_n.wav"; o = W / f"{k}_f.wav"
    sr = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.10:detection=peak"; trim = sr + ",areverse," + sr + ",areverse"
    subprocess.run([FF, "-v", "error", "-y", "-i", str(i), "-af", f"{trim},loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", str(n)], check=True)
    d = dur(n); slot = D[k] + 0.2; need = d / slot; t = min(max(need, 1.0), 1.12)
    af = f"atempo={t:.4f}" if t > 1.0005 else "anull"
    subprocess.run([FF, "-v", "error", "-y", "-i", str(n), "-af", af, str(o)], check=True)
    d2 = dur(o); rep[k] = {"slot": round(slot, 2), "raw": round(d, 2), "need": round(need, 3), "atempo": round(t, 3), "final": round(d2, 2), "overrun_s": round(max(0, d2 - slot), 2)}
json.dump(rep, open(src / f"fit_{eng}.json", "w"), indent=1)
over = {k: v for k, v in rep.items() if v["overrun_s"] > 0.05}
print("overruns (need shortening):", over or "none"); print("max atempo", max(v["atempo"] for v in rep.values()))
args, filt = [FF, "-v", "error", "-y"], []
for j, k in enumerate(ORDER):
    args += ["-i", str(W / f"{k}_f.wav")]; ms = int(round(S[k] * 1000)); filt.append(f"[{j}:a]adelay={ms}|{ms}[a{j}]")
filt.append("".join(f"[a{j}]" for j in range(len(ORDER))) + f"amix=inputs={len(ORDER)}:normalize=0:dropout_transition=0[v]")
vt = W / "voice_track.wav"; subprocess.run(args + ["-filter_complex", ";".join(filt), "-map", "[v]", "-ar", "44100", "-ac", "1", str(vt)], check=True)
out = O / f"kotakq2_{lang}{'' if eng == 'g' else '_parler'}.m4a"
subprocess.run([FF, "-v", "error", "-y", "-i", str(O / "music_sfx_stem.wav"), "-i", str(vt), "-filter_complex",
    f"[0:a]aresample=44100,aformat=channel_layouts=stereo[m];[1:a]aformat=channel_layouts=stereo[v];[m][v]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-16:TP=-1.5:LRA=11[x]",
    "-map", "[x]", "-c:a", "aac", "-b:a", "192k", "-t", str(TOTAL), str(out)], check=True)
ph = O / f"kotakq2_{lang}{'' if eng == 'g' else '_parler'}_540p.mp4"
subprocess.run([FF, "-v", "error", "-y", "-i", str(O / "kotak-q2-fcnr-margin_phone_540p30.mp4"), "-i", str(out), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "96k", "-shortest", "-movflags", "+faststart", str(ph)], check=True)
print("wrote", out.name, ph.name)
