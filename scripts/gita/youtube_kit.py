#!/usr/bin/env python3
"""Build the "Gita in Ink" channel folder on the SSD (AK, 22 Oct 2026): video, YouTube kit, brand, script and review.

  python3 -I scripts/gita/youtube_kit.py
Chapters and the SRT come from public/gita/g15/data.json, so they match the rendered v2 timing.
"""
import json, re, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
KIT = Path("/Volumes/DarwinSSD/Gita in Ink")
D = json.load(open(ROOT / "public/gita/g15/data.json"))
dirs = {k: KIT / v for k, v in {"video": "01 Video", "yt": "02 YouTube Kit", "brand": "03 Brand", "script": "04 Script and Review"}.items()}
for d in dirs.values(): d.mkdir(parents=True, exist_ok=True)

def mmss(s): s = int(s); return f"{s // 60}:{s % 60:02d}"
def srt_t(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"

# ---------- chapters (YouTube: first at 0:00, at least 3, each at least 10 s)
names = {c: v["en"] for c, v in D["chapters"].items()}
marks = [(0, "Kurukshetra at dawn"), (next(b for b in D["beats"] if b["key"] == "title")["start"], "What the Gita is: three movements of six chapters")]
for b in D["beats"]:
    if b["chapter"]: marks.append((b["start"], f"Chapter {b['chapter']}: {names[str(b['chapter'])]}"))
marks.append((next(b for b in D["beats"] if b["key"] == "close1")["start"], "Arjuna stands firm (18.73)"))
marks.append((next(b for b in D["beats"] if b["key"] == "end")["start"], "Where Krishna is (18.78)"))
for a, b in zip(marks, marks[1:]): assert b[0] - a[0] >= 10, (a, b)
chapters = "\n".join(f"{mmss(t)} {n}" for t, n in marks)

TITLE = "The Bhagavad Gita in 15 Minutes: All 18 Chapters, Verse on Screen"
TITLE_HI = "सम्पूर्ण भगवद्गीता 15 मिनट में | सभी 18 अध्याय, श्लोक सहित"
DESC = f"""All 18 chapters of the Bhagavad Gita in 15 minutes, in plain words, with the actual Sanskrit verse, its transliteration and its source on screen.

On the field of Kurukshetra, the great archer Arjuna puts down his bow. What Krishna tells him next is the Gita: action, devotion and knowledge, in three movements of six chapters. Alongside, a modern thread follows Meera, 21, at 1:47 a.m. with a decision to make (Meera is an illustration, not a real person).

Chapters
{chapters}

How we make these videos
• Every verse is shown in Devanagari, with IAST transliteration and chapter and verse.
• Sanskrit text: sanskritdocuments.org (Bhagavad Gita, 701-verse edition: 13.2 here is 13.1 in Gita Press numbering).
• Translations are our own, word for word. Lines marked "Our note" are our interpretation, not scripture.
• Krishna appears only as symbols (the peacock feather, the flute, the reins), never as an AI-generated image.
• Illustrations are drawn in code from the script. Narration is synthetic (an Indian English voice).

Bhagavad Gita · Bhagwat Geeta · Geeta Saar · श्रीमद्भगवद्गीता

#BhagavadGita #Gita #Krishna"""
TAGS = ["bhagavad gita", "bhagwat geeta", "gita in 15 minutes", "bhagavad gita summary", "all 18 chapters of gita", "geeta saar",
        "gita explained", "krishna arjuna", "bhagavad gita in english", "karma yoga", "bhakti yoga", "jnana yoga", "gita jayanti",
        "kurukshetra", "hindu philosophy", "hinduism", "gita in ink"]
PINNED = ("Which verse stayed with you? Tell us the chapter and verse, and we will make a full episode on it.\n"
          "Next: chapter 2, the chapter that answers overthinking.")

(dirs["yt"] / "metadata.txt").write_text(
    f"TITLE (English, {len(TITLE)} chars)\n{TITLE}\n\nTITLE (Hindi)\n{TITLE_HI}\n\nDESCRIPTION\n{DESC}\n\nTAGS ({sum(len(t) for t in TAGS) + len(TAGS)} of 500 chars)\n"
    + ", ".join(TAGS) + f"\n\nPINNED COMMENT\n{PINNED}\n\nSETTINGS\nCategory: Education · Language: English (India) · Made for kids: No\n"
    "Altered or synthetic content: Yes (synthetic narration voice)\nEnd screen: last 20 s, subscribe + next video\n"
    "Handle: @Gita-in-ink\n")

# ---------- English SRT from the voiced timeline (narration + translations read aloud)
REF = re.compile(r"(Chapter [a-z-]+, verse [a-z-]+\.|Verses? [a-z- ]+\.|verse [a-z-]+\.)$")
rows = []
for c in D["cues"]:
    text = c["text"]
    parts, st = [], 0
    for i, ch in enumerate(text):
        if ch in ".?!" and (i == len(text) - 1 or text[i + 1] == " ") and not re.search(r"(^|\s)[A-Z]$", text[max(0, i - 2):i]):
            parts.append((st, i + 1)); st = i + 1
    if st < len(text): parts.append((st, len(text)))
    for a, b in parts:
        seg = text[a:b].strip()
        if not seg: continue
        rows.append((c["start"] + c["dur"] * a / len(text), c["start"] + c["dur"] * b / len(text), seg))
srt = "\n".join(f"{i}\n{srt_t(a)} --> {srt_t(b)}\n{t}\n" for i, (a, b, t) in enumerate(rows, 1))
(dirs["yt"] / "captions_en.srt").write_text(srt)

# ---------- copy the files in
shutil.copy(ROOT / "out/gita/gita15_v2.mp4", dirs["video"] / "Gita in Ink - Bhagavad Gita in 15 Minutes (v2).mp4")
shutil.copy(ROOT / "out/gita/brand/thumb-g15.png", dirs["yt"] / "thumbnail_1280x720.png")
for src, dst in [("logo.png", "logo_800x800.png"), ("watermark.png", "watermark_150x150.png"), ("banner.png", "banner_2560x1440.png"),
                 ("banner-guides.png", "banner_2560x1440_with_safe_areas.png")]:
    shutil.copy(ROOT / "out/gita/brand" / src, dirs["brand"] / dst)
for src, dst in [("docs/gita/gita15_script.md", "script_15min.md"), ("docs/gita/jev_review_findings.md", "jev_review_findings.md"),
                 ("docs/gita/names/finalists.md", "channel_name_finalists.md"), ("docs/gita/G15_RUNBOOK.md", "runbook.md")]:
    shutil.copy(ROOT / src, dirs["script"] / dst)

(KIT / "README.txt").write_text(f"""GITA IN INK  (@Gita-in-ink)
The Bhagavad Gita, verse by verse, drawn in ink.

01 Video             The 15-minute Bhagavad Gita, v2 (15:00, 1920x1080). Not published.
02 YouTube Kit       Thumbnail, metadata (titles, description with chapters, tags, pinned comment, settings), English captions (SRT).
03 Brand             Logo (profile picture), watermark (video branding), banner (2560x1440; the safe-areas version shows what phones and desktops display).
04 Script and Review The approved script, Jev review findings, channel-name finalists, runbook.

Before upload
- A person who reads Sanskrit signs off on the 24 verse cards (Jev's review is a first pass only).
- Upload the captions SRT, and set "Altered or synthetic content: Yes" (synthetic narration).
- Upload is manual in YouTube Studio; nothing has been published.

Code lives in /Volumes/DarwinSSD/MMVideo (src/gita, scripts/gita). Built {D['voice']}, {mmss(D['total'])}.
""")
print("chapters:", len(marks)); print(chapters); print("srt rows:", len(rows)); print("title chars:", len(TITLE))
