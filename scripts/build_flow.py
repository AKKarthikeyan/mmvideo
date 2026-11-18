#!/usr/bin/env python3
"""Build Flow Build data: voice each beat (MiniMax), check every node/highlight phrase exists in its beat,
write public/flow/<id>/data.json. Usage: build_flow.py <id> [--no-tts]"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from build_vx import tts, chunks
from flow_scripts import FLOWS

ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/flow")


def main():
    vid = sys.argv[1]; notts = "--no-tts" in sys.argv
    V = next(v for v in FLOWS if v["id"] == vid)
    out = ROOT / vid; out.mkdir(parents=True, exist_ok=True)
    say = {b["key"]: b["say"] for b in V["beats"]}
    for ref in [n["at"] for n in V["nodes"]] + [V["highlight"]["at"]]:
        k, ph = ref.split("|", 1)
        assert ph.lower() in say[k].lower(), f"phrase not in {k}: {ph}"
    old = {}
    if (out / "data.json").exists():
        old = {b["key"]: b for b in json.load(open(out / "data.json"))["beats"]}
    beats = []
    for b in V["beats"]:
        b = dict(b); mp3 = out / f"{b['key']}.mp3"; o = old.get(b["key"])
        if mp3.exists() and o and o.get("say") == b["say"] and o.get("voiced"):
            b["sec"] = o["sec"]; b["voiced"] = True
        elif notts:
            b["sec"] = round(len(b["say"].split()) / 2.9 + 0.3, 2); b["voiced"] = False
        else:
            b["sec"] = round(tts(b["say"], mp3, voice=V["voice"]), 2); b["voiced"] = True; print(" voiced", b["key"], b["sec"])
        b["cues"] = chunks(b["cap"]); beats.append(b)
    data = {k: V[k] for k in ("id", "title", "source", "nodes", "edges", "highlight")}
    data["beats"] = beats
    json.dump(data, open(out / "data.json", "w"), ensure_ascii=False, indent=1)
    print(f"{out}/data.json: {len(beats)} beats, {sum(b['sec'] for b in beats):.1f} s, voiced={all(b['voiced'] for b in beats)}")


if __name__ == "__main__":
    main()
