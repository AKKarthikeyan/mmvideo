#!/usr/bin/env python3
"""Make clip-ready PDFs of Berkshire letters in sources/berkshire/<year>.pdf.
1977-1999 exist only as HTML on berkshirehathaway.com: typeset them line-for-line in Courier, with curly quotes and
dashes normalised to ASCII (base-14 Courier renders them as '·'). 2000+ are copied from the original PDFs.
Usage: typeset_letters.py <year> [year ...]"""
import html, pathlib, re, shutil, sys
import fitz
SRC = pathlib.Path("/Volumes/DarwinSSD/Research/Fund Manager Letters/Warren Buffet Letters")
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/sources/berkshire")
ASCII = str.maketrans({"’": "'", "‘": "'", "“": '"', "”": '"', "—": "--", "–": "-", "\t": "    "})
for y in sys.argv[1:]:
    if int(y) >= 2000:
        shutil.copy(SRC / f"{y}ltr.pdf", OUT / f"{y}.pdf"); print(y, "copied"); continue
    t = (SRC / f"{y}.html").read_bytes().decode("cp1252", errors="replace")
    m = re.search(r"<pre>(.*)</pre>", t, re.S | re.I)
    body = html.unescape(re.sub(r"<[^>]+>", "", m.group(1) if m else t)).translate(ASCII)
    lines = body.replace("\r", "").splitlines()
    doc = fitz.open()
    for i in range(0, len(lines), 62):
        pg = doc.new_page(width=612, height=792); yy = 48
        for l in lines[i:i + 62]:
            pg.insert_text((54, yy), l, fontname="cour", fontsize=9.5); yy += 11.5
    doc.save(OUT / f"{y}.pdf"); print(y, len(doc), "pages", "" if m else "(no <pre>)")
