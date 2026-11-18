# tatamotorsq2 (Tata Motors Q2 FY27 story, 24 Oct 2026): voice each beat of scripts/voxplus/tatamotorsq2_beats.json (from the
# reviewed _video/script.md) with MiniMax speech-2.6-hd, English_Diligent_Man (same tts() as build_vx) ->
# public/voxplus/tatamotorsq2/vo/<key>.mp3 + voiced.json. Re-running only voices beats whose text changed.
# Run inside zsh -lic (needs MINIMAX_API_KEY from the login env; never printed).
import json, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); OUT = R / "public/voxplus/tatamotorsq2/vo"; OUT.mkdir(parents=True, exist_ok=True)
B = json.load(open(R / "scripts/voxplus/tatamotorsq2_beats.json"))
old = {b["key"]: b for b in json.load(open(OUT / "voiced.json"))} if (OUT / "voiced.json").exists() else {}
for b in B:
    mp3 = OUT / (b["key"] + ".mp3"); o = old.get(b["key"])
    if mp3.exists() and o and o["say"] == b["say"]: b["sec"] = o["sec"]
    else: b["sec"] = round(tts(b["say"], mp3, "English_Diligent_Man"), 2); print(" voiced", b["key"], b["sec"], flush=True)
    json.dump(B, open(OUT / "voiced.json", "w"), indent=1, ensure_ascii=False)
print(len(B), "beats", round(sum(b["sec"] for b in B) / 60, 2), "min raw")
