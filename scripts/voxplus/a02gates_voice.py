# a02gates (Asian Paints Q2 FY27 story, 30 Oct 2026; copy of marutiq2_voice.py): voice each beat of scripts/voxplus/a02gates_beats.json
# (from the reviewed contentengine/drafts/2026-10-29/_video/script.md) with MiniMax speech-2.6-hd, English_Diligent_Man (build_vx.tts) ->
# public/voxplus/a02gates/vo/<key>.mp3 + voiced.json. Re-running only voices beats whose text changed. Pass keys to voice only those.
# Run inside zsh -lic (MINIMAX_API_KEY from the login env; never printed). Voice only 06:45-22:10 IST.
import json, pathlib, sys, datetime
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
now = datetime.datetime.utcnow() + datetime.timedelta(hours=5, minutes=30)
if not (datetime.time(6, 45) <= now.time() <= datetime.time(22, 10)): sys.exit("outside the 06:45-22:10 IST voice window")
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); OUT = R / "public/voxplus/a02gates/vo"; OUT.mkdir(parents=True, exist_ok=True)
B = json.load(open(R / "scripts/voxplus/a02gates_beats.json")); only = set(sys.argv[1:])
old = {b["key"]: b for b in json.load(open(OUT / "voiced.json"))} if (OUT / "voiced.json").exists() else {}
done = []
for b in B:
    mp3 = OUT / (b["key"] + ".mp3"); o = old.get(b["key"])
    if mp3.exists() and o and o["say"] == b["say"]: b["sec"] = o["sec"]
    elif only and b["key"] not in only: continue
    else: b["sec"] = round(tts(b["say"], mp3, "English_Diligent_Man"), 2); print(" voiced", b["key"], b["sec"], flush=True)
    done.append(b); json.dump(done, open(OUT / "voiced.json", "w"), indent=1, ensure_ascii=False)
print(len(done), "beats", round(sum(b["sec"] for b in done) / 60, 2), "min raw")
