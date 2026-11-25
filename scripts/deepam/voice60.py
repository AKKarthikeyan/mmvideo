"""English male voice-over for kd-deepam60 (Blender cut). AK, 24 Nov 2026: "Voice in English also kept ready to upload".
Voices each beat with MiniMax (VOICE['en-IN'], male), places it at the beat start, ducks the score under it,
and writes out/hyperframes/kd-deepam60-voice-en.mp4 at about -14 LUFS. The picture is the chosen Blender film, unchanged."""
import json, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "hyperframes/tools"))
from shorts_build import tts  # noqa: E402

FILM = ROOT / "out/hyperframes/kd-deepam60-blender.mp4"
import os
ONLY = os.environ.get("VOICE_ONLY") == "1"   # AK 24 Nov: "remove the background sound" -> voice with no score
OUT = ROOT / ("out/hyperframes/kd-deepam60-voice-en-only.mp4" if ONLY else "out/hyperframes/kd-deepam60-voice-en.mp4")
VDIR = ROOT / "public/deepam/voice_en"; VDIR.mkdir(parents=True, exist_ok=True)
LEAD = 0.15
js = (ROOT / "hyperframes/shorts/kd-deepam60/story.js").read_text()
beats = json.loads(js[js.index("{"):js.rindex("}") + 1])["beats"]

# Voice-only respellings (on-screen text unchanged). The English voice reads "th" as in "think"; Tamil த is a soft t,
# AK: the flower is தாழம்பூ, said "thalampoo". Long vowels are doubled so the stress lands right.
SAY = {"thalampoo": "taalam-poo", "Thiruvannamalai": "Tiruvannaa-malai", "Karthigai": "Kaar-tigai"}
def say(text):
    for k, v in SAY.items(): text = text.replace(k, v)
    return text

def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                                capture_output=True, text=True).stdout)

t, plan, bad = 0.0, [], []
for b in beats:
    p = VDIR / f"{b['id']}.mp3"
    if not p.exists() and not tts(say(b["say"]), "en-IN", p):
        sys.exit(f"voice failed for {b['id']}")
    w = VDIR / f"{b['id']}.wav"; t = b["t0"]   # trim silence, then speed up a line that would spill into the next beat
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(p), "-af", trim, "-ar", "48000", str(w)], check=True)
    d = dur(w); room = b["sec"] - LEAD - 0.1
    if d > room:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(p), "-af", f"{trim},atempo={d / room:.3f}", "-ar", "48000", str(w)], check=True)
        print(f"     {b['id']} sped up x{d / room:.2f}"); d = dur(w)
    p = w; plan.append((p, t + LEAD, d))
    print(f"{b['id']:4} start {t:5.1f}  voice {d:4.1f}s / beat {b['sec']:4.1f}s  {'OVER' if d + LEAD > b['sec'] else 'ok'}")
    if d + LEAD > b["sec"]: bad.append(b["id"])
if bad: print("WARNING: voice runs past its beat:", bad)

ins = ["-i", str(FILM)]; fl = []
for i, (p, at, d) in enumerate(plan, 1):
    ins += ["-i", str(p)]; ms = int(at * 1000)
    fl.append(f"[{i}:a]aresample=48000,adelay={ms}|{ms},apad[v{i}]")
n = len(plan)
fl.append("".join(f"[v{i}]" for i in range(1, n + 1)) + f"amix=inputs={n}:normalize=0:duration=first,asplit[vo][sc]")
if ONLY:
    fl[-1] = fl[-1].replace(",asplit[vo][sc]", "[mix]")
else:
  fl.append("[0:a]aresample=48000[bed]")
  fl.append("[bed][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck]")
  fl.append("[duck][vo]amix=inputs=2:normalize=0:weights=0.8 1.6:duration=first[mix]")
pre = VDIR / "mix_pre.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fl), "-map", "[mix]", "-t", str(dur(FILM)), str(pre)], check=True)
m = subprocess.run(["ffmpeg", "-i", str(pre), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
      f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(FILM), "-i", str(pre), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                "-af", ln + ",aresample=48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT)], check=True)
print("wrote", OUT)
