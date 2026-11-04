"""Namakkal Shorts S2, S6 and S10 as vertical HyperFrames videos (1080x1920), voiced with the house voice.

The words are the locked beats in darwin-research (tools/namakkal_beats.py); nothing is typed here. Voice and word times come from
mmvideo-dk's long_voice.py (MiniMax English_Diligent_Man, mlx-whisper), pointed at out/hyperframes/shorts/<id>/ with LONG_DIR.

  python3 hyperframes/tools/namakkal_shorts.py board               # storyboard.json per Short, from the locked beats
  (voice + words with long_voice.py, see SHORTS.md)
  python3 hyperframes/tools/namakkal_shorts.py story               # timeline.json + videos/nk-<id>/story.js from the measured audio
  (mix + srt with long_voice.py, render with hf.py)
  python3 hyperframes/tools/namakkal_shorts.py mux                 # silent render + narration -> out/hyperframes/shorts/<id>/<id>_DRAFT.mp4
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DR = Path("/Volumes/DarwinSSD/darwin-research/contentengine/youtube/namakkal_egg_city")
OUT = ROOT / "out" / "hyperframes" / "shorts"
VIDEOS = ROOT / "hyperframes" / "videos"
FPS = 30
HOOK = 2.5       # hook text on screen over the start of the first beat
GAP = 0.5        # silence between beats
END = 2.4        # silent end card (2 s readable after its 0.3 s entrance)
SUB_SEC = 5.0    # subscribe button at the bottom, mid-video (AK, 4 Nov 2026)
SUB_END = 0.5    # and the last 0.5 s of the Short, after the end card's 2 s
TAIL = 0.4       # breath after the last word before the end card
SHORTS = {"S2": "nk-s2", "S6": "nk-s6", "S10": "nk-s10"}
# each Short keeps its own look; all three carry the Indica Atlas name (AK, 4 Nov 2026)
THEME = {"S2": "atlas", "S6": "kadai", "S10": "green"}
# end cards, word for word from darwin-research's SHORTS_KIT.md and kits/ (S10)
END_CARD = {
    "S2": ["What happened next:", "the full Namakkal story.", "Link in the pinned comment."],
    "S6": ["Which number is right?", "3, 6 or 7 crore a day.", "The full check is in the long video."],
    "S10": ["Namakkal moves with India's egg rate.", "It doesn't lead it.", "Full story in the pinned comment."],
}

sys.path.insert(0, str(DR / "tools"))
import namakkal_beats as NB  # noqa: E402

BEAT = {b["key"]: b for b in NB.BEATS}
SPEC = {s["id"]: s for s in NB.SHORTS}


def board():
    for sid in SHORTS:
        d = OUT / sid
        d.mkdir(parents=True, exist_ok=True)
        sc = [{"id": k, "vo": BEAT[k]["say"]} for k in SPEC[sid]["beats"]]
        json.dump({"id": sid, "scenes": sc}, open(d / "storyboard.json", "w"), indent=1, ensure_ascii=False)
        print(sid, len(sc), "beats,", sum(len(s["vo"].split()) for s in sc), "words")


def alnum(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def tokens(say, heard):
    """The script's own words, each timed from whisper's word times by character position (as long_voice.srt does), in phrases for the
    on-screen captions: [[word, start, end], ...] and [[first, last], ...]."""
    cum, tot = [], 0
    for w in heard:
        n = len(alnum(w["w"]))
        cum.append((tot, tot + n, w["start"], w["end"]))
        tot += n
    words = say.split()
    total = sum(len(alnum(w)) for w in words) or 1

    def time(pos):
        p = pos * tot / total
        for a, b, s, e in cum:
            if p <= b and b > a:
                return s + (e - s) * max(0.0, min(1.0, (p - a) / (b - a)))
        return cum[-1][3]
    toks, pos = [], 0
    for w in words:
        n = len(alnum(w))
        toks.append([w, round(time(pos + 0.01), 3), round(time(pos + n), 3)])
        pos += n
    phrases, i0, chars = [], 0, 0
    for i, (w, _, _) in enumerate(toks):
        chars += len(w) + 1
        n = i - i0 + 1
        if i == len(toks) - 1 or chars > 38 or (n >= 3 and w[-1] in ".,?!:;") or (n >= 2 and w[-1] in ".?!"):
            phrases.append([i0, i]); i0, chars = i + 1, 0
    return toks, phrases


def figs(sid):
    """Every number a scene draws, computed from darwin-research's notes and data (sources named on screen per beat)."""
    if sid == "S6":
        india_bn, india_year = 142.77, "2023-24"        # PIB, BAHS 2024 (ANALYSIS_NOTES.md, India row)
        india_bn2, tn_share = 149.11, 15.63             # 2024-25 total and Tamil Nadu's share (PIB via Factly)
        claim, claim_all = 6, 18                        # DT Next, 14 Nov 2022 (e81)
        day = india_bn * 1e9 / 365 / 1e7
        tn = india_bn2 * 1e9 * tn_share / 100 / 365 / 1e7
        return dict(indiaBn=india_bn, indiaYear=india_year, indiaDay=round(day, 1), claim=claim, claimAll=claim_all,
                    claimPct=round(100 * claim / round(day, 1)), indiaBn2=india_bn2, tnShare=tn_share, tnDay=round(tn, 2),
                    tnPct=round(100 * claim / round(tn, 2)))
    if sid == "S10":
        import csv
        from collections import defaultdict
        states = [["Andhra Pradesh", 17.85], ["Tamil Nadu", 15.64], ["Telangana", 12.88], ["West Bengal", 11.37], ["Karnataka", 6.63]]  # PIB, 2023-24 (RESEARCH.md)
        lead = [dict(zone=r["zone"], role=r["role"], lag=int(r["best_lag_days"]))
                for r in csv.DictReader(open(DR / "data" / "price_leadership_by_zone.csv"))]
        wk = defaultdict(lambda: defaultdict(list))
        days = set()
        for r in csv.DictReader(open(DR / "data" / "necc_daily_all_centres_paise.csv")):
            if r["section"] != "NECC SUGGESTED EGG PRICES" or not r["paise"]:
                continue
            days.add(r["date"])
            y, m, dd = map(int, r["date"].split("-"))
            import datetime
            iso = datetime.date(y, m, dd).isocalendar()
            wk[r["centre"]][(iso[0], iso[1])].append(float(r["paise"]))
        weeks = sorted({w for c in wk.values() for w in c})
        strips = {}
        for c, ws in wk.items():
            v = [sum(ws[w]) / len(ws[w]) if w in ws else None for w in weeks]
            lo, hi = min(x for x in v if x), max(x for x in v if x)
            strips[c] = [None if x is None else round((x - lo) / (hi - lo), 3) for x in v]
        corr = re.search(r"correlation (0\.\d+)", BEAT["e57c"]["cap"]).group(1)
        return dict(states=states, statesYear="2023-24", lead=lead, strips=strips, nSheets=len(days), nZones=len(wk),
                    span=[min(days), max(days)], corr=corr)
    return {}


def story():
    for sid, vid in SHORTS.items():
        d = OUT / sid
        man = json.load(open(d / "vo" / "manifest.json"))
        wt = json.load(open(d / "word_times.json"))["scenes"]
        t, beats, tl = 0.0, [], []
        for k in SPEC[sid]["beats"]:
            b, sec = BEAT[k], man[k]["sec"]
            toks, phrases = tokens(b["say"], wt[k]["words"])
            beats.append(dict(key=k, t0=round(t, 3), dur=round(sec, 3), cap=b["cap"], src=b["src"], tag=b["tag"],
                              toks=toks, phrases=phrases))
            tl.append(dict(id=k, vo=b["say"], **{"from": round(t * FPS)}))
            t += sec + GAP
        t = t - GAP + TAIL
        total = round(t + END + SUB_END, 3)
        json.dump({"fps": FPS, "total": round(total * FPS), "scenes": tl}, open(d / "timeline.json", "w"), indent=1)
        s = dict(id=sid, title=SPEC[sid]["title"], hook=SPEC[sid]["hook"].split("|"), channel=SPEC[sid]["channel"], theme=THEME[sid],
                 hookSec=HOOK, endAt=round(t, 3), total=total, subAt=round(max(HOOK + 1, t / 2 - SUB_SEC / 2), 2), subSec=SUB_SEC,
                 subEnd=round(t + END, 3), end=END_CARD[sid], fig=figs(sid), beats=beats)
        (VIDEOS / vid).mkdir(exist_ok=True)
        (VIDEOS / vid / "story.js").write_text("// generated by hyperframes/tools/namakkal_shorts.py story; do not edit\nwindow.STORY = "
                                                + json.dumps(s, ensure_ascii=False) + ";\n")
        html = (VIDEOS / "_short" / "index.html").read_text().replace("__DURATION__", str(total))
        (VIDEOS / vid / "index.html").write_text(html)
        print(sid, f"{total:.1f} s", [f'{b["key"]} {b["dur"]:.1f}' for b in beats])


def mux():
    for sid, vid in SHORTS.items():
        d = OUT / sid
        silent, voice, out = ROOT / "out" / "hyperframes" / f"{vid}.mp4", d / "vo" / "narration.wav", d / f"{vid}_DRAFT.mp4"
        subprocess.run(["/tmp/ffbin/ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", str(voice), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "192k", str(out)], check=True)
        print("wrote", out)


if __name__ == "__main__":
    {"board": board, "story": story, "mux": mux}[sys.argv[1]]()
