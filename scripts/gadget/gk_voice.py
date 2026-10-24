# Gadget Short (tech-launch series, 21 Oct 2026): voice a script.json as ONE continuous MiniMax read so the narration flows
# like a single take. Pauses between beats use MiniMax's <#s#> tag. Output public/gadget/<id>/vo_raw.mp3 (+ vo.json with the text); gk_align.py tightens it into vo.wav.
# Run on the Mini: zsh -lic 'python3 scripts/gadget/gk_voice.py src/gadget/mivione/script.json'
import json, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
S = json.load(open(sys.argv[1])); OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/gadget") / S["id"]; OUT.mkdir(parents=True, exist_ok=True)
text = " ".join(b["say"] + (f" <#{b['pause']}#>" if b.get("pause") else "") for b in S["beats"])
meta = OUT / "vo.json"
if meta.exists() and json.load(open(meta)).get("text") == text and "--force" not in sys.argv:
    print("unchanged, not re-voiced"); raise SystemExit
sec = round(tts(text, OUT / "vo_raw.mp3", S.get("voice", "English_Diligent_Man")), 2)
json.dump({"text": text, "sec": sec}, open(meta, "w"), indent=1)
print("voiced", S["id"], sec, "s,", len(text.split()), "tokens")
