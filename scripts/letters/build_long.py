#!/usr/bin/env python3
"""Build the Nick Sleep long form: check phrases, render letter pages + ring boxes, voice beats (MiniMax), frames, SRT, chapters.
Usage: build_long.py [--no-tts]"""
import json, math, sys, pathlib
import fitz
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts"); sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts/letters")
from build_vx import chunks, tts
import sleep_long
from sleep_long import BEATS, CHAPTERS, PDF
VOICE = getattr(sleep_long, "VOICE", "English_Diligent_Man")

FPS = 30; PAD = 0.6
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/letters/sleep_long"); (OUT / "pages").mkdir(parents=True, exist_ok=True)
REL = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/letters/long"); REL.mkdir(parents=True, exist_ok=True)

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
    t = 0; srt = []; chap = {}
    for b in BEATS:
        s = b["scene"]
        if not b["say"]: b["sec"] = s["silent"]
        else:
            mp3 = OUT / f"{b['key']}.mp3"; o = old.get(b["key"])
            if mp3.exists() and o and o.get("say") == b["say"]: b["sec"] = o["sec"]
            elif notts: b["sec"] = max(3.0, len(b["say"]) / 15)
            else: b["sec"] = round(tts(b["say"], mp3, VOICE), 2); print(" voiced", b["key"], b["sec"])
        b["frames"] = math.ceil((b["sec"] + (PAD if b["say"] else 0)) * FPS)
        chap.setdefault(b["ch"], t)
        if b["say"]:
            cues = chunks(b["say"]); tot = sum(len(c) for c in cues); acc = 0
            for c in cues:
                a = t / FPS + b["sec"] * acc / tot; acc += len(c); z = t / FPS + b["sec"] * acc / tot
                srt.append((a, z, c))
        t += b["frames"]
    json.dump({"beats": BEATS, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
    ts = lambda x: f"{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(round(x%1*1000))%1000:03d}"
    open(REL / "sleep_long.srt", "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(z)}\n{c}\n" for i, (a, z, c) in enumerate(srt)))
    mmss = lambda f: f"{int(f/FPS//60)}:{int(f/FPS%60):02d}"
    open(REL / "chapters.txt", "w").write("\n".join(f"{mmss(chap[i])} {n}" for i, n in enumerate(CHAPTERS)) + "\n")
    print(f"{len(BEATS)} beats, {t/FPS/60:.2f} min")

if __name__ == "__main__":
    main()
