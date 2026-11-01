"""Copy voiced lines from paradox_v1 to long_road_v1 where the translated text is identical (so each line is voiced once)."""
import json, os, shutil, sys
R = "/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks/voice"; lang = sys.argv[1]
a = json.load(open(f"{R}/paradox_v1/translations/{lang}.json"))["scenes"]; b = json.load(open(f"{R}/long_road_v1/translations/{lang}.json"))["scenes"]
src = {v["text"]: k for k, v in a.items() if os.path.exists(f"{R}/paradox_v1/tracks/{lang}/{k}.wav")}
os.makedirs(f"{R}/long_road_v1/tracks/{lang}", exist_ok=True); n = 0
for k, v in b.items():
    s = src.get(v["text"])
    cur = f"{R}/long_road_v1/tracks/{lang}/{k}.json"
    stale = (not os.path.exists(cur)) or json.load(open(cur, encoding="utf-8")).get("text") != v["text"]
    if s and stale:
        for ext in ("wav", "json"): shutil.copy(f"{R}/paradox_v1/tracks/{lang}/{s}.{ext}", f"{R}/long_road_v1/tracks/{lang}/{k}.{ext}")
        n += 1
print(lang, "reused", n, "lines")
