#!/usr/bin/env python3
"""A01 v4 full-film narration, beats m01-e01 (the cold open c01-c05 is a01v4_tts.py and is reused as voiced).
MiniMax speech-2.6-hd, voice English_Diligent_Man, one mp3 per beat + MiniMax sentence timings (vo/<beat>.json).
Text: scripts/voxplus/a01v4_beats.json = script.md v4.1 narration word for word with pause tags <#s#> only
(checked when the JSON was made). Rate limits: wait and retry, never switch provider. Skips beats already voiced.
Usage (inside zsh -lic): python3 scripts/voxplus/a01v4_tts_full.py [beat ...]"""
import json, pathlib, sys, importlib.util
H = pathlib.Path(__file__).parent
spec = importlib.util.spec_from_file_location("a01v4_tts", H / "a01v4_tts.py"); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
BEATS = json.loads((H / "a01v4_beats.json").read_text())
if __name__ == "__main__":
    m.OUT.mkdir(parents=True, exist_ok=True)
    want = sys.argv[1:] or list(BEATS)
    for k in want:
        if (m.OUT / f"{k}.mp3").exists() and (m.OUT / f"{k}.json").exists() and not sys.argv[1:]:
            print(" have", k, flush=True); continue
        m.tts(k, BEATS[k], m.OUT / f"{k}.mp3")
    print("done", len(want), flush=True)
