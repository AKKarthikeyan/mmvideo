#!/usr/bin/env python3
"""Build the Nick Sleep long form: check phrases, render letter pages + ring boxes, voice beats (MiniMax), frames, SRT, chapters.
Usage: build_long.py [--no-tts]"""
import json, math, sys, pathlib
import fitz
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
import mm
from build_vx import chunks
from minimax import MALE, estimate, narrate
import sleep_long
from sleep_long import BEATS, CHAPTERS, PDF
VOICE = getattr(sleep_long, "VOICE", MALE)

FPS = 30; PAD = 0.6
OUT = mm.PUBLIC / "letters/sleep_long"; (OUT / "pages").mkdir(parents=True, exist_ok=True)
REL = mm.OUT / "letters/long"; REL.mkdir(parents=True, exist_ok=True)

def spoken_phrases(s):
    out = [s.get(k) for k in ("at", "sync", "finale_at", "lead_at", "second_at") if s.get(k)]
    out += [it[1] for it in s.get("items", [])]
    return out

def main():
    notts = "--no-tts" in sys.argv
    bad = [(b["key"], p) for b in BEATS for p in spoken_phrases(b["scene"]) if p.lower() not in b["say"].lower()]
    if bad: raise SystemExit(f"phrases not in narration: {bad}")
    doc = fitz.open(PDF)
    for b in BEATS:
        s = b["scene"]
        if s["type"] != "page": continue
        pg = doc[s["page"] - 1]; hits = pg.search_for(s["find"])
        if not hits: raise SystemExit(f"{b['key']}: '{s['find']}' not on p.{s['page']}")
        hits = [h for h in hits if h.y0 - hits[0].y0 < 40]
        r = fitz.Rect(hits[0]);  [r.include_rect(h) for h in hits]
        W, H = pg.rect.width, pg.rect.height
        png = OUT / "pages" / f"p{s['page']}.png"
        if not png.exists(): pg.get_pixmap(matrix=fitz.Matrix(2.5, 2.5)).save(png)
        s["box"] = [r.x0 / W, r.y0 / H, r.width / W, r.height / H]; s["aspect"] = W / H
    old = {}
    if (OUT / "data.json").exists(): old = {b["key"]: b for b in json.load(open(OUT / "data.json"))["beats"]}
    for b in BEATS:
        s = b["scene"]
        o = old.get(b["key"])
        if not b["say"]: b["sec"] = s["silent"]
        else: b["sec"] = narrate(b["say"], OUT / f"{b['key']}.mp3", o["sec"] if o and o.get("say") == b["say"] else None,
                                 VOICE, estimate(b["say"]) if notts else None)
        b["frames"] = math.ceil((b["sec"] + (PAD if b["say"] else 0)) * FPS)
    tl, t = mm.framed_timeline(BEATS)
    said = lambda b: chunks(b["say"]) if b["say"] else []      # silent title cards carry no caption
    json.dump({"beats": BEATS, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
    mm.write_srt(REL / "sleep_long.srt", tl, parts=said)
    open(REL / "chapters.txt", "w").write(mm.chapters(CHAPTERS, tl, pad=False) + "\n")
    print(f"{len(BEATS)} beats, {t/FPS/60:.2f} min")

if __name__ == "__main__":
    main()
