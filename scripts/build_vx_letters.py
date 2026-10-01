#!/usr/bin/env python3
"""Build "The Letter" series videos for the Vox engine (same data format as build_vx.py, own script file vx_letters.py).
Validates phrases, crops real PDF clippings (page chosen nearest a hint, since letter editions differ), voices beats (MiniMax only;
waits on 429s), writes public/vx/<id>/data.json, and out/vx/<id>.srt + <id>-chapters.txt.
Usage: build_vx_letters.py [--no-tts] [ids...]"""
import json, math, os, sys, pathlib, tempfile
import fitz
sys.path.insert(0, os.path.dirname(__file__))
from build_vx import crop, chunks, phrases, tts
from vx_letters import VIDEOS

ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx"); OUTV = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx")
NOMAD = pathlib.Path("/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf")
# name: (pdf, verbatim phrase, lines above, lines below, page hint)
CLIPS = {
  "n47_order": (NOMAD, "the end result (the destination) is identical", 2, 2, 74),
  "n47_1622": (NOMAD, "matter if it takes 18 years or 22 years", 2, 2, 74),
  "n47_stage": (NOMAD, "shares purchased at 14p were sold at a high of around 90p", 1, 2, 128),
  "n47_anchor": (NOMAD, "anchoring on the original purchase decision analysis", 1, 2, 128),
  "n47_conseco": (NOMAD, "Conseco went bankrupt", 1, 2, 128),
  "n47_static": (NOMAD, "static view of a firm formed at the time of purchase", 1, 2, 128),
  "n47_sorry": (NOMAD, "sorry, learning opportunities", 1, 1, 128),
  "n47_banks": (NOMAD, "may well have kept us out of the US banks", 2, 2, 128),
  "n47_pimply": (NOMAD, "commissioned pimply youth", 1, 2, 127),
  "n47_dad": (NOMAD, "who has known your Dad for fifty years", 1, 1, 127),
  "n_1021": (NOMAD, "$10.21", 3, 1, 218),
  "n48_noughts": (NOMAD, "you have missed off the noughts", 2, 2, 94),
  "n48_nofees": (NOMAD, "no performance means no fees", 2, 1, 34),
  "n48_job": (NOMAD, "Job one, two and three for your manager", 1, 1, 35),
  "n48_three": (NOMAD, "approximately three times", 1, 1, 35),
  "n48_please": (NOMAD, "large capitalization shares (please)", 1, 1, 35),
  "n48_profit": (NOMAD, "should not be a profits centre", 2, 1, 99),
  "n48_hawaii": (NOMAD, "catches a plane to Hawaii", 2, 1, 99),
  "n48_children": (NOMAD, "stocks are not like children", 1, 1, 37),
  "n48_longhard": (NOMAD, "think long and hard about your investment in Nomad", 1, 1, 37),
  "n48_renters": (NOMAD, "(the renters)", 2, 1, 141),
  "n48_galactic": (NOMAD, "at Galactic HQ is", 2, 1, 210),
  "n48_bamboo": (NOMAD, "No Bamboozlement Here", 0, 2, 171),
  "n48_revolving": (NOMAD, "revolving door of interested parties", 2, 1, 225),
  "n49_highfive": (NOMAD, "claim victory, high five, and sell our shares in Amazon", 1, 1, 120),
  "n49_biggest": (NOMAD, "the biggest error an investor can make is the sale of a Wal-Mart", 1, 1, 120),
  "n49_unrecorded": (NOMAD, "opportunity costs go unrecorded in performance records", 1, 1, 120),
  "n49_greatest": (NOMAD, "our greatest error was the sale of Stagecoach", 1, 1, 120),
  "n49_oktosell": (NOMAD, "the stock has risen in price so it is OK to sell", 1, 1, 77),
  "n49_diversified": (NOMAD, "fund managers sell their winners in order to appear diversified", 1, 1, 161),
  "n49_hundred": (NOMAD, "start at a hundred percent", 1, 1, 120),
  "n49_costco": (NOMAD, "made his first mistake investing in Costco", 1, 1, 52),
  "n49_redeem": (NOMAD, "less than two percent of the Partnership", 1, 1, 154),
  "n49_seventy": (NOMAD, "order of seventy percent (and counting!)", 1, 1, 167),
  "n50_chart": (NOMAD, "Chart 2: Cheap for Decades", 0, 1, 162),
  "n50_150": (NOMAD, "over one hundred and fifty times the prevailing share price", 1, 1, 162),
  "n50_200": (NOMAD, "he could still have paid over two hundred times", 1, 1, 162),
  "n50_walton": (NOMAD, "no one but the founding Walton family", 1, 1, 160),
  "n50_barbie": (NOMAD, "call this the Barbie problem", 1, 1, 160),
  "n50_active": (NOMAD, "Active fund managers have to look active", 0, 1, 161),
  "n50_odds": (NOMAD, "for five years is one in five, and for ten years just one in ten", 1, 1, 161),
  "n50_decades": (NOMAD, "cheap, in some cases, for decades", 1, 1, 161),
  "n50_ibm": (NOMAD, "their sale of IBM thirty years earlier", 1, 1, 160),
  "n50_sellwmt": (NOMAD, "made the decision to sell", 1, 1, 160),
  "n50_fcf": (NOMAD, "free cash flow of just over U$500m", 1, 1, 105),
  "n50_novalue": (NOMAD, "your growth spending has no value", 2, 1, 105),
}
BRK = pathlib.Path("/Volumes/DarwinSSD/MMVideo/sources/berkshire")
CLIPS.update({
  "g95_door": (BRK/"1995.pdf", "until a custodian appeared", 3, 2, 6),
  "g95_direct": (BRK/"1995.pdf", "of selling - direct marketing - gave it an enormous cost", 2, 2, 7),
  "g04_reserve": (BRK/"2004.pdf", "reserving for losses. This produced faulty cost information", 2, 2, 8),
  "g24_gem": (BRK/"2024.pdf", "gem that needed major repolishing", 2, 1, 4),
  "g25_retention": (BRK/"2025.pdf", "restored margins but come at the cost of lower", 1, 2, 10),
  "s07_dream": (BRK/"2007.pdf", "prototype of a dream business", 1, 2, 6),
  "s83_prices": (BRK/"1983.pdf", "we have raised prices significantly", 3, 2, 12),
  "s11_zero": (BRK/"2011.pdf", "of less than zero", 2, 2, 13),
  # 1978/1979/1985 are typeset from the berkshirehathaway.com letter text (quotes normalised to ASCII)
  "t14_stupid": (BRK/"2014.pdf", "That was a monumentally stupid decision", 3, 1, 23),
  "t14_minutes": (BRK/"2014.pdf", "started going out of", 1, 2, 23),
  "t14_eighth": (BRK/"2014.pdf", "offering an eighth of a point less", 2, 1, 23),
  "t14_colossal": (BRK/"2014.pdf", "I simply made a colossal", 3, 1, 24),
  "t78_textbook": (BRK/"1978.pdf", "illustrates in textbook style how", 1, 4, 4),
  "t78_diligent": (BRK/"1978.pdf", "our competitors are just as", 3, 1, 3),
  "t79_turn": (BRK/"1979.pdf", "seldom turn, and that the same", 2, 1, 5),
  "t85_faulted": (BRK/"1985.pdf", "faulted for not quitting sooner", 3, 3, 7),
  "t85_row": (BRK/"1985.pdf", "how effectively you row", 2, 2, 8),
})
_docs = {}
# Pronunciation fixes for the TTS voice only (captions keep the real spelling). AK 30 Sep: "GEICO" was read 3 ways.
PRON = {"GEICO's": "Guyco's", "GEICO": "Guyco", "See's": "Sees", "Nebraska Furniture Mart": "Nebraska Furniture Mart",
        "Waumbec": "Wombeck", "Chace": "Chase"}
def pron(s):
    for a, b in PRON.items(): s = s.replace(a, b)
    return s

def timed(scene):
    """Case-scene timing phrases that phrases() doesn't collect: *_at keys and suspect cross-outs."""
    out = []
    def walk(x):
        if isinstance(x, dict):
            for k, v in x.items():
                if (k.endswith("_at") or k == "cross") and isinstance(v, str): out.append(v)
                else: walk(v)
        elif isinstance(x, list):
            for v in x: walk(v)
    walk(scene); return out

def crop_near(name, pdf, phrase, up, dn, hint, outdir):
    d = _docs.setdefault(pdf, fitz.open(pdf))
    pages = [n for n in sorted(range(1, len(d) + 1), key=lambda n: abs(n - hint)) if d[n - 1].search_for(phrase)]
    if not pages: raise SystemExit(f"clip {name}: phrase not found: {phrase}")
    one = fitz.open(); one.insert_pdf(d, from_page=pages[0] - 1, to_page=pages[0] - 1)
    tmp = pathlib.Path(tempfile.gettempdir()) / f"vxl_{name}.pdf"; one.save(tmp)
    c = crop(name, tmp, phrase, up, dn, outdir); c["page"] = pages[0]
    return c

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; notts = "--no-tts" in sys.argv
    for V in VIDEOS:
        if args and V["id"] not in args: continue
        out = ROOT / V["id"]; (out / "clips").mkdir(parents=True, exist_ok=True)
        keys = [b["key"] for b in V["beats"]]
        if len(keys) != len(set(keys)): raise SystemExit(f"{V['id']}: duplicate keys")
        bad = []
        for b in V["beats"]:
            b["cap"] = b["cap"] or b["say"]
            for p in phrases(b["scene"]):
                if isinstance(p, str) and p.split("|")[0].lower() not in b["say"].lower(): bad.append((b["key"], p))
            for p in timed(b["scene"]):
                if p.lower() not in b["say"].lower(): bad.append((b["key"], p))
            for ln in b["scene"].get("lines", []) if b["scene"]["type"] == "kinetic" else []:
                if ln["at"].lower() not in b["say"].lower(): bad.append((b["key"], ln["at"]))
        for s in V["shorts"]:
            for k in s["beats"]:
                if k not in keys: bad.append(("short", k))
        if bad: raise SystemExit(f"{V['id']}: phrases not in narration: {bad}")
        clips = {}
        for b in V["beats"]:
            c = b["scene"].get("clip")
            if c and c not in clips:
                pdf, ph, up, dn, hint = CLIPS[c]; clips[c] = crop_near(c, pdf, ph, up, dn, hint, out / "clips")
        old = {}
        if (out / "data.json").exists():
            old = {b["key"]: b for b in json.load(open(out / "data.json"))["beats"]}
        for b in V["beats"]:
            mp3 = out / f"{b['key']}.mp3"; o = old.get(b["key"]); spoken = pron(b["say"]); b["spoken"] = spoken
            if mp3.exists() and o and o.get("spoken", o.get("say")) == spoken: b["sec"] = o["sec"]
            elif notts: b["sec"] = max(3.0, len(b["say"]) / 15)
            else: b["sec"] = round(tts(spoken, mp3), 2); print(" voiced", b["key"], b["sec"], flush=True)
            b["cues"] = chunks(b["cap"])
        data = {k: V[k] for k in ("id", "title", "chapters", "shorts")}; data["engine"] = V.get("engine", "vox")
        data["timelines"] = V.get("timelines", {}); data["beats"] = V["beats"]; data["clips"] = clips
        json.dump(data, open(out / "data.json", "w"), indent=1, ensure_ascii=False)
        # SRT + chapter times, using the engine's long layout (beatFrames = sec + 1.1 s for titles, + 0.5 s otherwise)
        FPS = 30; t = 0; srt = []; chap = {}
        for b in V["beats"]:
            n = math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS)
            chap.setdefault(b["ch"], t); tot = sum(len(c) for c in b["cues"]); acc = 0
            for c in b["cues"]:
                a = t / FPS + b["sec"] * acc / tot; acc += len(c); srt.append((a, t / FPS + b["sec"] * acc / tot, c))
            t += n
        ts = lambda x: f"{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(round(x%1*1000))%1000:03d}"
        OUTV.mkdir(parents=True, exist_ok=True)
        open(OUTV / f"{V['id']}.srt", "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(z)}\n{c}\n" for i, (a, z, c) in enumerate(srt)))
        mmss = lambda f: f"{int(f/FPS//60):02d}:{int(f/FPS%60):02d}"
        open(OUTV / f"{V['id']}-chapters.txt", "w").write("\n".join(f"{mmss(chap[i])} {n}" for i, n in enumerate(V["chapters"]) if i in chap) + "\n")
        print(f"{V['id']}: {len(V['beats'])} beats, {t/FPS/60:.2f} min, {len(clips)} clips", flush=True)

if __name__ == "__main__":
    main()
