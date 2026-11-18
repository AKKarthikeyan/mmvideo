# Shorten pauses >0.2 s to 0.15 s in each voiced beat -> <key>_t.wav, and re-time data.json.
# Run after voice_geo.py: python3 scripts/geo/trim_geo.py siliguri [tempo, e.g. 1.07]
# (Remotion's bundled ffmpeg has no silenceremove/aselect, so the cut is done here on PCM.)
import json, os, re, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
F = str(ROOT / "node_modules/@remotion/compositor-darwin-arm64")
ENV = dict(os.environ, DYLD_LIBRARY_PATH=F)
d = ROOT / "public" / "geo" / sys.argv[1]
TEMPO = sys.argv[2] if len(sys.argv) > 2 else "1.0"
data = json.load(open(d / "data.json"))
for b in data["beats"]:
    src, full, dst = d / f"{b['key']}.mp3", d / f"{b['key']}_full.wav", d / f"{b['key']}_t.wav"
    subprocess.run([F + "/ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", f"atempo={TEMPO}", "-ac", "1", "-ar", "44100", full], env=ENV, check=True)
    log = subprocess.run([F + "/ffmpeg", "-hide_banner", "-i", full, "-af", "silencedetect=n=-35dB:d=0.2", "-f", "null", "-"],
                         env=ENV, capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    w = wave.open(str(full)); sr, sw = w.getframerate(), w.getsampwidth(); fr = w.readframes(w.getnframes()); w.close()
    keep, pos = [], 0
    for s, e in zip(st, en):
        keep.append(fr[pos * sw:int((s + 0.075) * sr) * sw]); pos = int((e - 0.075) * sr)
    keep.append(fr[pos * sw:]); out = b"".join(keep)
    o = wave.open(str(dst), "wb"); o.setnchannels(1); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(out); o.close()
    full.unlink()
    b["raw_sec"] = b.get("raw_sec", b["sec"]) if "audio" in b else b["sec"]
    b["sec"] = round(len(out) / sw / sr, 2); b["audio"] = dst.name
json.dump(data, open(d / "data.json", "w"), indent=1, ensure_ascii=False)
data["tempo"] = float(TEMPO)
json.dump(data, open(d / "data.json", "w"), indent=1, ensure_ascii=False)
print(sys.argv[1], "tempo", TEMPO, "trimmed to", round(sum(b["sec"] for b in data["beats"]), 1), "s")
