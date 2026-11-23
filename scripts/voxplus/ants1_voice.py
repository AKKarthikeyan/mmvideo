# ants1 (Moat Atlas, Anthropic S-1, 27 Oct 2026; copy of kotakq2_voice.py): voice each beat of scripts/voxplus/ants1_beats.json with MiniMax
# speech-2.6-hd, English_Diligent_Man (same tts() as build_vx) -> public/voxplus/ants1/vo/<key>.mp3 + voiced.json. Re-running only voices changed beats.
# Run inside zsh -lic with the Go key swapped in for this run only: export MINIMAX_API_KEY="$MINIMAX_GO_API_KEY" (never printed).
import json, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo-atlas-ant"); OUT = R / "public/voxplus/ants1/vo"; OUT.mkdir(parents=True, exist_ok=True)
B = json.load(open(R / (sys.argv[1] if len(sys.argv) > 1 else "scripts/voxplus/ants1_beats.json")))
VJ = OUT / (sys.argv[2] if len(sys.argv) > 2 else "voiced.json")
old = {b["key"]: b for b in json.load(open(VJ))} if VJ.exists() else {}
for b in B:
    mp3 = OUT / (b["key"] + ".mp3"); o = old.get(b["key"])
    if mp3.exists() and o and o["say"] == b["say"]: b["sec"] = o["sec"]
    else: b["sec"] = round(tts(b["say"], mp3, "English_Diligent_Man"), 2); print(" voiced", b["key"], b["sec"], flush=True)
    json.dump(B, open(VJ, "w"), indent=1, ensure_ascii=False)
print(len(B), "beats", round(sum(b["sec"] for b in B) / 60, 2), "min raw")
