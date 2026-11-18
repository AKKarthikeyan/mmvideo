# "Jio's Size Advantage Has a Catch" (AK revised script, 20 Oct 2026): parse SAY per scene, one beat per paragraph,
# voice with MiniMax (English_Diligent_Man, speed 1, same tts() as build_vx) -> public/voxplus/scale/vo/<key>.mp3 + beats.json.
# Re-running only voices beats whose text changed.
import json, pathlib, re, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
SRC = pathlib.Path(sys.argv[1]); OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/scale/vo"); OUT.mkdir(parents=True, exist_ok=True)
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
