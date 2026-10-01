#!/usr/bin/env python3
"""Letter Reader build: validate phrases, crop real PDF clippings (PyMuPDF highlight boxes), voice beats (MiniMax), write public/letters/<id>/data.json.
Usage: build_letters.py [--no-tts] [ids...]   (needs MINIMAX_API_KEY unless --no-tts)"""
import json, os, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import crop, chunks, tts, phrases
from sleep_shorts import SHORTS, PDF

ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/letters")

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; notts = "--no-tts" in sys.argv
    for V in SHORTS:
        if args and V["id"] not in args: continue
        out = ROOT / V["id"]; (out / "clips").mkdir(parents=True, exist_ok=True)
        bad = []
        for b in V["beats"]:
            b["cap"] = b.get("cap") or b["say"]
            for p in phrases(b["scene"]):
                if isinstance(p, str) and p.split("|")[0].lower() not in b["say"].lower(): bad.append((b["key"], p))
        if bad: raise SystemExit(f"{V['id']}: phrases not in narration: {bad}")
        clips = {}
        for b in V["beats"]:
            c = b["scene"].get("clip")
            if c and c not in clips:
                ph, up, dn = V["clips"][c]
                clips[c] = crop(c, pathlib.Path(PDF), ph, up, dn, out / "clips")
        old = {}
        if (out / "data.json").exists():
            old = {b["key"]: b for b in json.load(open(out / "data.json"))["beats"]}
        for b in V["beats"]:
            mp3 = out / f"{b['key']}.mp3"; o = old.get(b["key"])
            if mp3.exists() and o and o.get("say") == b["say"]: b["sec"] = o["sec"]
            elif notts: b["sec"] = max(3.0, len(b["say"]) / 15)
            else: b["sec"] = round(tts(b["say"], mp3), 2); print(" voiced", b["key"], b["sec"])
            b["cues"] = chunks(b["cap"])
        data = {"id": V["id"], "title": V["title"], "beats": V["beats"], "clips": clips}
        json.dump(data, open(out / "data.json", "w"), indent=1, ensure_ascii=False)
        print(f"{V['id']}: {len(V['beats'])} beats, {sum(b['sec'] for b in V['beats']):.1f}s narration, {len(clips)} clips")

if __name__ == "__main__":
    main()
