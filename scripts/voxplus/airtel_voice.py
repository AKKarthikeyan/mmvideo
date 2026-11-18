# "Airtel's Moat: Price, Mix or Convergence?" (Moat & Margin, script 6 Nov 2026): parse SAY per scene, one beat per paragraph,
# voice with MiniMax (speech-2.6-hd, English_Diligent_Man, speed 1: the same tts() as build_vx) -> public/voxplus/airtel/vo/<key>.mp3 + beats.json.
# Re-running only voices beats whose text changed. Refuses to run outside 06:45-22:10 IST (the key is busy at night).
# Run: zsh -lic 'cd /Volumes/DarwinSSD/MMVideo && python3 scripts/voxplus/airtel_voice.py'   (key comes from the login shell; never printed)
import datetime, json, os, pathlib, re, sys
try:
    from zoneinfo import ZoneInfo
    now = datetime.datetime.now(ZoneInfo("Asia/Kolkata"))
except Exception:
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=5, minutes=30)
hm = now.hour * 60 + now.minute
if not (6 * 60 + 45 <= hm <= 22 * 60 + 10):
    raise SystemExit(f"Refusing to voice: it is {now:%H:%M} IST. The MiniMax window is 06:45-22:10 IST (Vigil/Ravens use the key at night). Run again in the window.")
if not os.environ.get("MINIMAX_API_KEY"):
    raise SystemExit("MINIMAX_API_KEY is not set: run inside zsh -lic '...' on the Mini so the login shell loads it.")
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/Volumes/DarwinSSD/MMVideo/scripts/voxplus/SCRIPT_airtel_convergence_moat_6nov.md")
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/airtel/vo"); OUT.mkdir(parents=True, exist_ok=True)
s = SRC.read_text()
old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
beats = []
for n, title, body in re.findall(r"## (\d\d) \| [^|]+\| ([^\n]+)\n(.*?)(?=\n## |\Z)", s, re.S):
    say = re.search(r"\*\*SAY:\*\*\n(.*?)\n\*\*PICTURE", body, re.S).group(1)
    paras = [" ".join(p.split()) for p in say.strip().split("\n\n") if p.strip()]
    for i, p in enumerate(paras, 1):
        k = f"s{n}p{i}"
        mp3 = OUT / f"{k}.mp3"
        o = old.get(k)
        if mp3.exists() and o and o["say"] == p: sec = o["sec"]
        else: sec = round(tts(p, mp3, "English_Diligent_Man"), 2); print(" voiced", k, sec, flush=True)
        beats.append({"key": k, "scene": int(n), "title": title.strip(), "para": i, "say": p, "sec": sec})
json.dump(beats, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
print(len(beats), "beats", round(sum(b["sec"] for b in beats) / 60, 2), "min")
