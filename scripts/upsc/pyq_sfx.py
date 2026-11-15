#!/usr/bin/env python3
"""Sound effects for the Mains answer videos: our own synthesised sounds (scripts/upsc/long_sfx_upsc.py, imported, never edited),
with cues for the pyq_* scene kinds added. Borrowed concept-film scenes keep that tool's own cues.

  .venv/bin/python scripts/upsc/pyq_sfx.py <id> cues
  .venv/bin/python scripts/upsc/pyq_sfx.py <id> mix --video V.mp4 --voice narration.wav --out OUT.mp4

Pen scratches while the sheet is written, a card sound when paper lands, ticks when a demand box is ticked, a strike when a weak line
is ringed. Same levels, 5-a-second limit, side-chain and -16 LUFS master as the monsoon film.
"""
import os, sys

vid = sys.argv[1]
os.environ["UPSC_FILM"] = f"pyq-{vid}"
sys.argv = [sys.argv[0]] + sys.argv[2:]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import long_sfx_upsc as U   # noqa: E402

_base = U.scene_cues


def scene_cues(s):
    k, sp, rv, F, dur = s["kind"], s["spec"], s.get("reveals", {}), s["from"], s["dur"]
    if not k.startswith("pyq_"):
        return _base(s)
    out = []
    add = lambda fx, f, pan=0.0, **kw: out.append({"fx": fx, "f": F + f, "pan": round(pan, 2), "scene": s["id"], **kw})
    at = lambda key: rv.get(key, -1)
    if k == "pyq_question":
        add("up_card", 4)
        for g in sp.get("glow", []): add("up_tick", at(g["key"]))
        st = sp.get("strip")
        if st:
            for i in range(len(st["hits"])): add("up_pop", at(st["key"]) + i * 6, (i / max(1, len(st["hits"]) - 1) - 0.5) * 0.6)
    elif k == "pyq_xray":
        add("up_card", 4)
        for d in sp["directives"]: add("up_scribble", at(d["key"]) + 6, -0.2, sec=0.9)
        for i, d in enumerate(sp["demands"]): add("up_pop", at(d["key"]), (i - 1.5) * 0.15)
    elif k == "pyq_sheet":
        a0 = at(sp.get("start") or "w") if sp.get("start") else 8
        end = max(a0 + 10, dur * 0.88)
        f = a0
        while f < end - 10:                              # pen on paper, a scratch every ~1.3 s while the hand writes
            add("up_scribble", f, -0.25, sec=1.1); f += 39
        for i, _ in enumerate(sp.get("done", [])): add("up_tick", a0 + 0.9 * (end - a0) + 3 + i * 7, 0.3)
    elif k == "pyq_compare":
        add("up_card", 4)
        for w in sp["weak"]:
            add("up_scribble", at(w["key"]), -0.3, sec=0.8); add("up_strike", at(w["key"]) + 14, -0.3)
    elif k == "pyq_cousins":
        for i in range(len(sp["demands"])): add("up_tick", 6 + i * 7, (i - 1.5) * 0.15)
        for c in sp["cousins"]: add("up_card", at(c["key"]))
        add("up_pop", at(sp["next"]["key"]), 0.3)
    elif k == "pyq_timeline":
        add("up_card", 4)
        for it in sp["items"]:
            if it.get("key"): add("up_pop", at(it["key"]))
        if sp.get("quote"): add("up_card", at(sp["quote"]["key"]))
    return [c for c in out if c["f"] >= F]


U.scene_cues = scene_cues
if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser(); sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("cues")
    x = sub.add_parser("mix"); x.add_argument("--video", required=True); x.add_argument("--voice"); x.add_argument("--out", required=True)
    a = p.parse_args()
    if a.cmd == "cues": U.cmd_cues()
    else: U.mix(a.video, a.voice, a.out)
