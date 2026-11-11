#!/usr/bin/env python3
"""Build one episode of "The Letter" series (long form, 16:9) in the fixed fund-letter style (16 mm + kinetic, AK 29 Sep 2026).
Generalises build_long.py: the episode lives in scripts/letters/ep/<slug>.py (BEATS, CHAPTERS, PDF, META).
Checks spoken phrases, rings `find` on the real letter page, voices beats (MiniMax only; waits on 429), writes
public/letters/<slug>/data.json and out/letters/<slug>/ (SRT, chapters, YouTube description).
Usage: build_letter.py <slug> [--no-tts]"""
import importlib, json, math, sys, pathlib
import fitz
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1])); sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent / "ep"))
import mm
from build_vx import chunks
from minimax import MALE, estimate, narrate

FPS = 30; PAD = 0.6
MM = mm.REPO

def spoken_phrases(s):
    out = [s.get(k) for k in ("at", "sync", "finale_at", "lead_at", "second_at") if s.get(k)]
    out += [it[1] for it in s.get("items", [])]
    return out

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; notts = "--no-tts" in sys.argv
    slug = args[0]; E = importlib.import_module(slug)
    BEATS, CHAPTERS, META = E.BEATS, E.CHAPTERS, E.META
    VOICE = getattr(E, "VOICE", MALE)
    OUT = MM / "public/letters" / slug; (OUT / "pages").mkdir(parents=True, exist_ok=True)
    REL = MM / "out/letters" / slug; REL.mkdir(parents=True, exist_ok=True)
    keys = [b["key"] for b in BEATS]
    if len(keys) != len(set(keys)): raise SystemExit("duplicate beat keys")
    bad = [(b["key"], p) for b in BEATS for p in spoken_phrases(b["scene"]) if p.lower() not in b["say"].lower()]
    if bad: raise SystemExit(f"phrases not in narration: {bad}")
    docs = {}
    for b in BEATS:
        s = b["scene"]
        if s["type"] != "page": continue
        pdf = s.get("pdf", E.PDF); doc = docs.setdefault(pdf, fitz.open(pdf))
        # `page` is a hint (editions differ): take the matching page nearest to it, and show that page on screen
        hint = s.get("hint", s["page"]); s["hint"] = hint
        found = [n for n in sorted(range(1, len(doc) + 1), key=lambda n: abs(n - hint)) if doc[n - 1].search_for(s["find"])]
        if not found: raise SystemExit(f"{b['key']}: '{s['find']}' not in {pathlib.Path(pdf).name}")
        if found[0] != hint: print(f" {b['key']}: p.{hint} -> p.{found[0]}")
        s["page"] = found[0]; s["src"] = s["src"].replace(f"p.{hint}", f"p.{found[0]}")
        pg = doc[s["page"] - 1]; hits = pg.search_for(s["find"])
        hits = [h for h in hits if h.y0 - hits[0].y0 < 40]
        r = fitz.Rect(hits[0]); [r.include_rect(h) for h in hits]
        W, H = pg.rect.width, pg.rect.height
        tag = s.get("tag", "") + f"p{s['page']}"; s["img"] = f"letters/{slug}/pages/{tag}.png"
        png = OUT / "pages" / f"{tag}.png"
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
    json.dump({"slug": slug, "meta": META, "beats": BEATS, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
    mm.write_srt(REL / f"{slug}.srt", tl, parts=said)
    chapters = mm.chapters(CHAPTERS, tl, pad=False)
    open(REL / "chapters.txt", "w").write(chapters + "\n")
    desc = META["description"].strip() + "\n\nChapters\n" + chapters + "\n\n" + META.get("sources", "").strip() + \
        "\n\nEducational research, not investment advice. No company is scored. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser.\n"
    open(REL / "youtube_description.txt", "w").write(META["title"] + "\n\n" + desc + "\nTags: " + META.get("tags", "") + "\n")
    print(f"{slug}: {len(BEATS)} beats, {t/FPS/60:.2f} min")

if __name__ == "__main__":
    main()
