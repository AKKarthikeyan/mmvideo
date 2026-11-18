# Five Jio moat Shorts (AK approved scripts 20 Oct 2026): parse SAY blocks from SHORTS_and_SOCIAL.md, voice each Short as one
# file with MiniMax (English_Diligent_Man, speed 1, build_vx.tts) -> public/voxplus/scale/shorts/vo/shN.mp3 + beats.json.
import json, pathlib, re, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
SRC = pathlib.Path(sys.argv[1]); OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/scale/shorts/vo"); OUT.mkdir(parents=True, exist_ok=True)
s = SRC.read_text()
blocks = re.findall(r"## Short (\d): ([^\n]+)\n.*?\*\*SAY:\*\*\n> (.*?)\n", s, re.S)
assert len(blocks) == 5, len(blocks)
old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
beats = []
for n, title, say in blocks:
    k = "sh" + n; say = " ".join(say.split()); mp3 = OUT / (k + ".mp3"); o = old.get(k)
    if mp3.exists() and o and o["say"] == say: sec = o["sec"]
    else: sec = round(tts(say, mp3, "English_Diligent_Man"), 2); print(" voiced", k, sec, flush=True)
    beats.append({"key": k, "title": title.strip(), "say": say, "sec": sec})
json.dump(beats, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
print([(b["key"], b["sec"]) for b in beats])
