# ants1 document excerpts (27 Oct 2026). The S-1 is an EDGAR HTML file whose saved text (anthropicpbc-sx1.txt) keeps the printed lines and page
# numbers. Each excerpt = the printed lines around ANCHOR, set again line for line in Georgia 9.5 pt (the filing's own face and size), then
# rasterised at 3x. Words are verbatim; layout is ours (left-aligned). Same output as kotakq2_shot.py:
# OUT.png + OUT.json {w, h, page (printed prospectus page), rects: {phrase: [[x,y,w,h],...]}}.
import json, pathlib, re, sys, fitz
TXT = pathlib.Path.home() / "jev_full/research/anthropic_s1_20261026/anthropicpbc-sx1.txt"
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo-atlas-ant/public/voxplus/ants1/docs")
GEO, GEOB = "/System/Library/Fonts/Supplemental/Georgia.ttf", "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
L = [l.strip() for l in TXT.read_text().split("\n") if l.strip() != "Table of Contents"]   # drop the EDGAR running-header link
flat, owner = "", []
for i, l in enumerate(L):
    for ch in l + " ": flat += ch; owner.append(i)
norm = lambda s: re.sub(r"\s+", " ", s).strip()
def page_of(i):
    for j in range(i, min(len(L), i + 120)):
        if re.fullmatch(r"\d{1,3}|[ivx]{1,6}|F-\d{1,3}", L[j]): return L[j]
    return None
def shot(name, anchor, nb, na, phrases, bold=False, width_pt=None):
    k = flat.find(norm(anchor))
    if k < 0: raise SystemExit(f"{name}: anchor not found: {anchor}")
    i0, i1 = owner[k], owner[k + len(norm(anchor)) - 1]
    lines = [l for l in L[max(0, i0 - nb): i1 + na + 1] if not re.fullmatch(r"\d{1,3}|[ivx]{1,6}|F-\d{1,3}", l)]   # no page-number lines inside an excerpt
    fs, lh, mx = 9.5, 13.2, 10
    font = fitz.Font(fontfile=GEOB if bold else GEO)
    wmax = width_pt or max(font.text_length(l, fs) for l in lines)
    doc = fitz.open(); pg = doc.new_page(width=wmax + 2 * mx, height=len(lines) * lh + 2 * 6 + 3)
    pg.insert_font(fontname="geo", fontfile=GEOB if bold else GEO)
    for n, l in enumerate(lines):
        pg.insert_text((mx, 6 + fs + n * lh), l, fontname="geo", fontsize=fs, color=(0.08, 0.08, 0.08))
    S = 3; pix = pg.get_pixmap(matrix=fitz.Matrix(S, S)); pix.save(OUT / f"{name}.png")
    rects = {}
    for p in phrases:
        rs = pg.search_for(p)
        if not rs: print("WARNING phrase not found:", name, p); continue
        rects[p] = [[round(r.x0 * S, 1), round(r.y0 * S, 1), round(r.width * S, 1), round(r.height * S, 1)] for r in rs]
    j = {"w": pix.width, "h": pix.height, "page": page_of(i1), "rects": rects}
    json.dump(j, open(OUT / f"{name}.json", "w"), indent=1)
    print(f"{name:10s} {pix.width}x{pix.height} p.{j['page']} lines {len(lines)}", {q[:24]: len(v) for q, v in rects.items()})

SPECS = [
 ("new80", "For example, model versions released in the six months ended", 1, 2, ["model versions released in the six months ended", "September 30, 2026 accounted for over 80% of our revenue"]),
 ("frontier", "Customers adopt and retain our technology based on whether our models are at the frontier", 0, 2, ["Customers adopt and retain our technology", "at the frontier of AI capability", "essential to revenue generation"]),
 ("rivals", "Many have substantially greater financial, technical, and marketing resources", 1, 1, ["substantially greater financial, technical, and marketing resources", "greater access to sources of compute"]),
 ("primary", "Our primary competitors in this category include Alphabet Inc.", 0, 1, ["Our primary competitors", "OpenAI"]),
 ("decline", "We do not expect our revenue will continue to grow at", 0, 4, ["not be sustainable over time", "it may decline significantly and more rapidly than we anticipate"]),
 ("takepay", "obligate us to pay for resources regardless of actual utilization", 1, 1, ["regardless of actual utilization", "substantial fixed obligations"]),
 ("y2045", "substantially all of the remainder is expected to be incurred between 2031 and 2045", 1, 0, ["between 2031 and 2045"]),
 ("blank", "aggregate committed spend of more than $", 0, 0, ["aggregate committed spend of more than $"]),
 ("violate", "revenue from such customers represented approximately 5% to 7% of our revenue", 1, 1, ["approximately 5% to 7% of our revenue"]),
 ("holiday", "total customer spend declined by approximately 20%", 1, 1, ["declined by approximately 20%"]),
 ("safety", "In the past these measures have included delaying the release of models", 0, 6, ["delaying the release of models", "slow our capability gains"]),
 ("ltbt", "a financially disinterested trust, which we refer to as the Long-Term Benefit Trust", 0, 2, ["financially disinterested trust", "elect and remove a majority"]),
 ("classf", "will be entitled to an aggregate number of votes that equals 50.1% of the total voting power", 1, 0, ["50.1% of the total voting power"]),
 ("electall", "Collectively, the LTBT and the Founder LLC will have the ability to elect all members of our board of directors", 0, 0, ["elect all members of our board of directors"]),
 ("netloss", "and $80.7 billion for the six months ended June 30, 2026", 1, 2, ["$80.7 billion"]),
 ("fvnotes", "and $10.9 billion and $72.4 billion for the six months ended June 30, 2025 and 2026", 1, 2, ["$72.4 billion", "increase in the fair value of our outstanding convertible promissory notes"]),
 ("raised", "raised an aggregate of $141.1 billion of capital", 0, 1, ["$141.1 billion", "$112.4 billion", "$19.3 billion"]),
 ("codebase", "Over 90% of the contributions to our codebase in September 2026 were written by Claude", 0, 0, ["Over 90% of the contributions to our codebase"]),
 ("headcount", "our headcount grew over five times", 0, 1, ["headcount grew over five times", "86 times"]),
 ("nrr", "Net Revenue Retention of approximately 900% as of September 30, 2026", 0, 0, ["approximately 900%"]),
 ("custs", "We had more than 11,900 customers with $100,000 or more of revenue on a TTM basis", 0, 1, ["more than 11,900 customers", "more than 950"]),
 ("top5", "Approximately 79% of our revenue came from customers outside of our top five customers", 0, 1, ["Approximately 79%", "approximately 64%"]),
 ("costrev", "Substantially all of cost of revenue consists of compute and infrastructure costs", 0, 0, ["compute and infrastructure costs"]),
 ("rsu", "the performance-based vesting condition will be satisfied upon the effectiveness of the registration statement", 1, 0, ["upon the effectiveness of the registration statement"]),
 ("forty", "was generated by approximately 40 million customers", 0, 0, ["approximately 40 million customers"]),
 ("f500", "Over 50% of the Fortune 500", 0, 3, ["Over 50% of the Fortune 500", "less than 0.1% of their total expenses"]),
 ("opus", "Claude Opus 5.5 reduced customer costs per task by approximately 40%", 0, 0, ["approximately 40%"]),
 ("coding", "Claude Code, our coding agent", 0, 0, ["Claude Code, our coding agent"]),
 ("loop", "We operate an iterative cycle in which compute deployed to model development", 0, 1, ["iterative cycle"]),
]
if __name__ == "__main__":
    only = sys.argv[1:]
    for s in SPECS:
        if not only or s[0] in only: shot(*s)
