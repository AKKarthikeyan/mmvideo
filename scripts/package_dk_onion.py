#!/usr/bin/env python3
"""12 Nov 2026 kit: Data Kadai Short dk-onion (paper craft, Reveal Loop).
Writes out/hyperframes/dk-onion-kit/: youtube-dk-onion.txt (titles, description, pinned comment, Instagram caption,
checklist), dk-onion.srt (from the voiced timings), and the cover thumbnails (thumb-A/B.png, 1080 x 1920, rendered
from the Short's own scene by scripts/thumbs_dk_onion.js).
Numbers: MoSPI CPI release for October 2026 (provisional, 12 Nov 2026), via AK's research package. Re-check before posting."""
import json, pathlib, re, subprocess, shutil

ROOT = pathlib.Path(__file__).resolve().parents[1]
SID = "dk-onion"
OUT = ROOT / "out" / "hyperframes" / f"{SID}-kit"
OUT.mkdir(parents=True, exist_ok=True)
st = (ROOT / "hyperframes" / "shorts" / SID / "story.js").read_text(encoding="utf-8")
S = json.loads(st[st.index("{"): st.rindex("}") + 1])


def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


srt = []
for i, c in enumerate(S["caps"], 1):
    txt = re.sub(r"<[^>]+>", "", c["html"]).replace("&amp;", "&").replace("&lt;", "<")
    srt += [str(i), f"{ts(c['t0'])} --> {ts(min(c['t1'], S['dur']))}", txt, ""]
(OUT / f"{SID}.srt").write_text("\n".join(srt), encoding="utf-8")

SRC = [
    "MoSPI (National Statistical Office), Consumer Price Index press release for October 2026, released 12 Nov 2026 "
    "(base 2024=100; October figures provisional): all-India CPI 6.09% year on year, Consumer Food Price Index 8.94%; "
    "item inflation onion +116.22%, garlic +60.74%, ginger +48.32%, potato −14.24%, cauliflower −10.57%. mospi.gov.in",
    "Inflation target: 4% with a band of ±2 percentage points (2% to 6%), for 1 Apr 2026 to 31 Mar 2031 (Government of India / RBI).",
]
L = [
    f"SHORT · Data Kadai · {SID}-final.mp4 · {S['dur']:.1f} s · 1080x1920 · voice MiniMax English_Diligent_Man (0.96) · loop",
    "Series: none yet (proposed: Inside the Basket)",
    "",
    "TITLE OPTIONS (max 50 characters; A is the one in the script)",
    "  A. Onions +116%, potatoes -14%: same inflation      (43)",
    "  B. Onions +116%. Potatoes cheaper. Same month.       (43)",
    "  C. Food inflation 8.94%? Not for potatoes            (38)",
    "Avoid 'Who is making your food expensive?' and 'blame the onion': the data show what rose, not who caused it.",
    "",
    "DESCRIPTION",
    "India's inflation crossed 6% in October: 6.09%, just above the top of the RBI's 2–6% band. Food inflation was 8.94%. "
    "But inside the same grocery basket, prices moved in opposite directions. Onions were up 116% on a year ago, garlic "
    "61% and ginger 48%, while potatoes were 14% cheaper and cauliflower more than 10% cheaper. Food inflation is a "
    "weighted average of all of these, so it isn't the rise every item saw. Your own grocery bill depends on what you buy.",
    "",
    "In the picture, each vegetable's area is drawn in proportion to its price compared with a year ago. The scene is an "
    "illustration drawn in code; the numbers are MoSPI's.",
    "",
    "SOURCES",
    *SRC,
    "",
    "Educational explainer, not financial advice.",
    "#inflation #CPI",
    "",
    "PINNED COMMENT",
    "Onion +116%, garlic +61%, potato −14%: same month, same basket (MoSPI, October 2026, provisional). Which item in "
    "your kitchen got costlier this year?",
    "",
    "INSTAGRAM REEL CAPTION (post natively from the clean master; links go in the bio)",
    "India's inflation: 6.09%. Food: 8.94%. But onions are up 116% while potatoes are 14% cheaper. Same basket, opposite "
    "stories. Source: MoSPI CPI, Oct 2026 (provisional). #inflation #CPI",
    "",
    "COVER / THUMBNAIL",
    "  thumb-A.png  The onion swollen in the basket, '+116%' in red, '−14% POTATO' in green, headline 'SAME BASKET. OPPOSITE PRICES.'",
    "               Use as the Shorts cover where YouTube offers a custom one, and as the Reel cover.",
    "  thumb-B.png  The ruler: FOOD 8.94% and ALL ITEMS 6.09% past the RBI band, headline 'INFLATION 6.09% BUT ONIONS +116%'.",
    "  On YouTube, if only a frame can be chosen, pick about 12.5 s (all four tags and the swollen onion on screen).",
    "",
    "CAPTIONS FILE: dk-onion.srt (burned-in captions are already on the video; upload the file for search and accessibility)",
    "",
    "BEFORE POSTING",
    "  1. Check every number against the MoSPI release table (October is provisional; look for any correction).",
    "  2. AK listens once (the transcription check could not run in the cloud session). Listen closely to "
    "'But garlic is up sixty one. Ginger, forty eight.'",
    "  3. Related video: set by hand in desktop Studio to the closest Data Kadai long video (none on CPI yet).",
    "  4. 48-hour read against the Data Kadai median (docs/SHORTS_RULES.md, section 7).",
]
(OUT / f"youtube-{SID}.txt").write_text("\n".join(L), encoding="utf-8")

node = shutil.which("node")
gl = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
r = subprocess.run([node, str(ROOT / "scripts" / "thumbs_dk_onion.js"), str(ROOT / "hyperframes" / "shorts" / SID / "index.html"), str(OUT)],
                   env={**__import__("os").environ, "NODE_PATH": gl})
print(OUT, "thumbnails ok" if r.returncode == 0 else "thumbnails FAILED")
