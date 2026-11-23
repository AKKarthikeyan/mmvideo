"""Check the Anthropic S-1 script: words and timing per beat, hook gaps, and every ledger anchor against the saved S-1 text.
Run: python3 -I atlas_ants1_check.py EP_ANTHROPIC_S1_SCRIPT.md ~/jev_full/research/anthropic_s1_20261026/anthropicpbc-sx1.txt"""
import re, sys
script, src = open(sys.argv[1]).read(), open(sys.argv[2]).read()
norm = lambda t: re.sub(r"[\s|​]+", "", t)
S = norm(src)
WPS, GAP, CARD = 2.6, 0.42, 1.1
body = script.split("## Beats")[1].split("## The 3 Shorts")[0]
t, rows, words_total = 0.0, [], 0
for ch in re.split(r"\n### ", body)[1:]:
    t += CARD
    for bid, txt in re.findall(r"\*\*([a-z]\d\d)\*\*\n> (.+)", ch):
        n = len(re.findall(r"[A-Za-z0-9$%.,'’\-]+", txt.replace(" - ", " ")))
        d = n / WPS
        rows.append((bid, t, d, n)); t += d + GAP; words_total += n
for bid, st, d, n in rows:
    print(f"{bid}  {int(st//60)}:{st%60:04.1f}  {d:4.1f}s  {n} words")
print(f"TOTAL {words_total} words, {int(t//60)}:{t%60:04.1f}")
led = script.split("## Ledger")[1]
bad = 0
for line in led.splitlines():
    m = re.match(r"\| (\d+) \|", line)
    if not m: continue
    for a in re.findall(r"`([^`]+)`", line):
        ok = norm(a) in S
        if not ok and "EDGAR" not in a:
            bad += 1; print(f"row {m.group(1)}: NOT FOUND  {a[:90]}")
print("anchors not found:", bad)
