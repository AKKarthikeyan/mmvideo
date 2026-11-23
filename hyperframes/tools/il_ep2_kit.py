"""India Ledger Episode 2: gather the YouTube kit into out/india_ledger/youtube-kit-ep2/ (copied to DataKadai/04 YouTube Kit/il-gold-ep2/) and write caption files.

usage: python3 hyperframes/tools/il_ep2_kit.py   (after il_ep2_maya.py hi|ta|te and the final mux)
Captions: English from act.js (MiniMax sentence timings); Hindi, Tamil, Telugu from each track's report (where each line
was placed). Each line is split into sentences, timed in proportion to their length. Nothing is uploaded.
"""
import json, re, shutil
from pathlib import Path

ROOT = Path("/Volumes/DarwinSSD/MMVideo")
VID = "il-gold-ep2"
KIT = ROOT / "out" / "india_ledger" / "youtube-kit-ep2"
CHAN = Path("/Volumes/DarwinSSD/DataKadai/04 YouTube Kit/il-gold-ep2")
AUD = ROOT / "out" / "audio" / VID
TRACKS = {"hi": "hi_maya-siddhant", "ta": "ta_maya-siddhant", "te": "te_maya-siddhant"}   # AK 20 Nov 2026: Maya Siddhant for all three


def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3_600_000); m, ms = divmod(ms, 60_000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def cues(rows):
    """rows: (start, end, text) per beat -> sentence cues"""
    out = []
    for a, b, text in rows:
        parts = [p.strip() for p in re.split(r"(?<=[.?!।])\s+", text) if p.strip()]
        n = sum(len(p) for p in parts); t = a
        for p in parts:
            d = (b - a) * len(p) / n
            out.append((t, t + d, p)); t += d
    return out


def srt(path, cs):
    path.write_text("\n".join(f"{i}\n{ts(a)} --> {ts(b)}\n{x}\n" for i, (a, b, x) in enumerate(cs, 1)), encoding="utf-8")


def main():
    KIT.mkdir(parents=True, exist_ok=True)
    act = json.loads(re.sub(r"^window.ACT = |;\s*$", "", (ROOT / "hyperframes" / "videos" / VID / "act.js").read_text()))
    srt(KIT / "captions_en.srt", cues([(b["t0"], b["t1"], b["say"]) for b in act["beats"]]))
    for lang, tag in TRACKS.items():
        rep = json.load(open(AUD / f"{VID}_{tag}_DRAFT_report.json"))
        srt(KIT / f"captions_{lang}_DRAFT.srt", cues([(r["start"], r["start"] + r["sec"], r["text"]) for r in rep["beats"]]))
        shutil.copy2(AUD / f"{VID}_{tag}_DRAFT.m4a", KIT / f"audio_{lang}_{tag.split('_')[1]}_DRAFT.m4a")
    for k in "AB":
        shutil.copy2(ROOT / "out" / "india_ledger" / f"il-gold-ep2-thumb-{k}.jpg", KIT / f"thumbnail_option_{k}.jpg")
    shutil.copy2(ROOT / "out" / "hyperframes" / "il-gold-ep2-final.mp4", ROOT / "out" / "india_ledger" / "india-ledger-gold-ep2.mp4")
    CHAN.mkdir(parents=True, exist_ok=True)
    for f in KIT.iterdir():
        shutil.copy2(f, CHAN / f.name)
    print("copied to", CHAN)
    for f in sorted(KIT.iterdir()):
        print(f"{f.stat().st_size:>11,}  {f.name}")


if __name__ == "__main__":
    main()
