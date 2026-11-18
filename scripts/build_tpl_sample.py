#!/usr/bin/env python3
"""Build the template sample (scripts/tpl_sample.py): voice each beat (MiniMax, male), render the Union Bank filing page
with row geometry for the Filing Dive, add the 25-bank tracker rows for the notebook, write public/tpl/<id>/data.json.
Usage: build_tpl_sample.py [--no-tts]"""
import json, pathlib, re, sys
import fitz
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from build_vx import tts, chunks
from tpl_sample import SAMPLE as V

OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/tpl") / V["id"]
PDF = pathlib.Path("/Users/akkarthikeyan/jev_full/research/bankq2/UNIONBANK_01102026223208_ProvFinancialResults30092026.pdf")
TRACKER = pathlib.Path("/Users/akkarthikeyan/jev_full/q2tracker/bank_q2fy27.json")
SHORT = {"Union Bank of India": "Union Bank", "Punjab & Sind Bank": "Punjab & Sind", "Tamilnad Mercantile Bank": "Tamilnad Merc.",
         "Capital Small Finance Bank": "Capital SFB", "ESAF Small Finance Bank": "ESAF SFB", "Punjab National Bank": "PNB",
         "Ujjivan Small Finance Bank": "Ujjivan SFB", "Bank of India": "Bank of India", "Yes Bank": "Yes Bank", "Indian Bank": "Indian Bank", "Bank of Baroda": "Bank of Baroda", "AU Small Finance Bank": "AU SFB", "Jammu & Kashmir Bank": "J&K Bank"}


def page_geometry():
    doc = fitz.open(PDF); p = doc[0]; W, H = p.rect.width, p.rect.height
    p.get_pixmap(matrix=fitz.Matrix(4, 4)).save(OUT / "page.png")
    def row(label, value):
        b = p.search_for(value)[0]
        a = min(p.search_for(label), key=lambda r: abs((r.y0 + r.y1) / 2 - (b.y0 + b.y1) / 2))
        r = fitz.Rect(min(a.x0, b.x0) - 30, min(a.y0, b.y0) - 3, W - 40, max(a.y1, b.y1) + 3)
        return [round(r.x0 / W, 4), round(r.y0 / H, 4), round(r.width / W, 4), round(r.height / H, 4)]
    top = p.search_for("S.No")[0]; bot = p.search_for("Including Bank Deposits")[0]
    table = [round(30 / W, 4), round((top.y0 - 8) / H, 4), round((W - 60) / W, 4), round((bot.y1 + 10 - top.y0 + 8) / H, 4)]
    return dict(w=round(W, 1), h=round(H, 1), table=table,
                rows=dict(adv=row("Gross Advances", "11,55,930"), dep=row("Total Deposits", "13,19,457")))


def banks():
    d = json.load(open(TRACKER))
    out = [dict(name=SHORT.get(r["bank"], r["bank"].replace(" Bank", "").replace(" of India", "")), sym=r["symbol"],
                dep=r["deposit_growth_pct"], adv=r["advance_growth_pct"], gap=r["gap_pp"], ldr25=r["ldr_sep25_our"], ldr26=r["ldr_sep26_our"]) for r in d["rows"]]
    assert len(out) == 25 and sum(1 for b in out if b["gap"] > 0) == 21
    return sorted(out, key=lambda b: -b["gap"])


def main():
    notts = "--no-tts" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    old = {}
    if (OUT / "data.json").exists():
        old = {b["key"]: b for b in json.load(open(OUT / "data.json"))["beats"]}
    beats = []
    for b in V["beats"]:
        b = dict(b)
        for ph in re.findall(r"'at': '([^']+)'|_at': '([^']+)'", str(b["scene"])):
            ph = [x for x in ph if x][0]
            assert ph.lower() in b["say"].lower(), f"{b['key']}: phrase not in narration: {ph}"
        mp3 = OUT / f"{b['key']}.mp3"; o = old.get(b["key"])
        if mp3.exists() and o and o.get("say") == b["say"]: b["sec"] = o["sec"]
        elif notts: b["sec"] = max(3.0, len(b["say"].split()) / 2.9)
        else: b["sec"] = round(tts(b["say"], mp3, voice=V["voice"]), 2); print(" voiced", b["key"], b["sec"])
        b["cues"] = chunks(b["cap"])
        beats.append(b)
    data = dict(id=V["id"], title=V["title"], chapters=V["chapters"], next_video=V["next_video"],
                page=page_geometry(), banks=banks(), beats=beats)
    json.dump(data, open(OUT / "data.json", "w"), ensure_ascii=False, indent=1)
    print(f"{OUT}/data.json: {len(beats)} beats, {sum(b['sec'] for b in beats):.1f} s of narration")


if __name__ == "__main__":
    main()
