#!/usr/bin/env python3
"""Build one episode of "The Letter" series (long form, 16:9) in the fixed fund-letter style (16 mm + kinetic, AK 29 Sep 2026).
Generalises build_long.py: the episode lives in scripts/letters/ep/<slug>.py (BEATS, CHAPTERS, PDF, META).
Checks spoken phrases, rings `find` on the real letter page, voices beats (MiniMax only; waits on 429), writes
public/letters/<slug>/data.json and out/letters/<slug>/ (SRT, chapters, YouTube description).
Usage: build_letter.py <slug> [--no-tts]"""
import importlib, json, math, sys, pathlib
import fitz
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts"); sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts/letters/ep")
from build_vx import chunks, tts

FPS = 30; PAD = 0.6
MM = pathlib.Path("/Volumes/DarwinSSD/MMVideo")

def spoken_phrases(s):
    out = [s.get(k) for k in ("at", "sync", "finale_at", "lead_at", "second_at") if s.get(k)]
    out += [it[1] for it in s.get("items", [])]
    return out

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; notts = "--no-tts" in sys.argv
    slug = args[0]; E = importlib.import_module(slug)
    BEATS, CHAPTERS, META = E.BEATS, E.CHAPTERS, E.META
    VOICE = getattr(E, "VOICE", "English_Diligent_Man")
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
    t = 0; srt = []; chap = {}
    for b in BEATS:
        s = b["scene"]
        if not b["say"]: b["sec"] = s["silent"]
        else:
            mp3 = OUT / f"{b['key']}.mp3"; o = old.get(b["key"])
            if mp3.exists() and o and o.get("say") == b["say"]: b["sec"] = o["sec"]
            elif notts: b["sec"] = max(3.0, len(b["say"]) / 15)
            else: b["sec"] = round(tts(b["say"], mp3, VOICE), 2); print(" voiced", b["key"], b["sec"], flush=True)
        b["frames"] = math.ceil((b["sec"] + (PAD if b["say"] else 0)) * FPS)
        chap.setdefault(b["ch"], t)
        if b["say"]:
            cues = chunks(b["say"]); tot = sum(len(c) for c in cues); acc = 0
            for c in cues:
                a = t / FPS + b["sec"] * acc / tot; acc += len(c); z = t / FPS + b["sec"] * acc / tot
                srt.append((a, z, c))
        t += b["frames"]
    json.dump({"slug": slug, "meta": META, "beats": BEATS, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
    ts = lambda x: f"{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(round(x%1*1000))%1000:03d}"
    open(REL / f"{slug}.srt", "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(z)}\n{c}\n" for i, (a, z, c) in enumerate(srt)))
    mmss = lambda f: f"{int(f/FPS//60)}:{int(f/FPS%60):02d}"
    chapters = "\n".join(f"{mmss(chap[i])} {n}" for i, n in enumerate(CHAPTERS) if i in chap)
    open(REL / "chapters.txt", "w").write(chapters + "\n")
    desc = META["description"].strip() + "\n\nChapters\n" + chapters + "\n\n" + META.get("sources", "").strip() + \
        "\n\nEducational research, not investment advice. No company is scored. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser.\n"
    open(REL / "youtube_description.txt", "w").write(META["title"] + "\n\n" + desc + "\nTags: " + META.get("tags", "") + "\n")
    print(f"{slug}: {len(BEATS)} beats, {t/FPS/60:.2f} min")

if __name__ == "__main__":
    main()
