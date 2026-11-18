#!/bin/zsh
# A01 v4 audio prep: loudness-normalise every narration beat to -16 LUFS (TP -1.5) as 44.1 kHz wav (vo/<beat>_n.wav),
# skipping beats already done (pass -f to redo), and write vo/timing.json: per beat the wav duration, MiniMax's sentence
# timings and the pauses found by silencedetect (-38 dB, 0.09 s), for cut timing and the hook check. Vendor ffmpeg.
source /Volumes/DarwinSSD/vendor/env.sh
V=/Volumes/DarwinSSD/MMVideo/public/voxplus/a01v4/vo
for m in $V/*.mp3; do b=${m:t:r}
  if [[ "$1" == "-f" || ! -f $V/${b}_n.wav ]]; then ffmpeg -v error -y -i $m -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 $V/${b}_n.wav; fi
done
python3 - $V <<'PY'
import json, pathlib, subprocess, sys, re
V = pathlib.Path(sys.argv[1]); out = {}
for j in sorted(V.glob("*.json")):
    if j.name == "timing.json": continue
    b = j.stem; meta = json.loads(j.read_text())
    w = V / f"{b}_n.wav"
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(w)], capture_output=True, text=True).stdout)
    e = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(V / f"{b}.mp3"), "-af", "silencedetect=n=-38dB:d=0.09", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", e)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]
    out[b] = {"dur": round(dur, 3), "sents": [[round(s["time_begin"] / 1000, 2), round(s["time_end"] / 1000, 2), s["text"]] for s in meta.get("subs", [])],
              "pauses": [[round(a, 2), round(b2, 2)] for a, b2 in zip(st, en)]}
(V / "timing.json").write_text(json.dumps(out, indent=1, ensure_ascii=False)); print(len(out), "beats", round(sum(v["dur"] for v in out.values()), 1), "s")
PY
