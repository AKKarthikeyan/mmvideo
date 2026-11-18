"""Sum IMD's annual table (annualcd.pdf): cyclonic disturbances, cyclones (>=34 kt) and severe cyclones (>=48 kt)
by basin (BOB, AS, LAND, TOTAL), 1891 onward. Input: pdftotext -layout output. Data rows have 13 numbers:
year + 3 groups x (BOB, AS, LAND, TOTAL). Rows that do not parse are listed."""
import re, sys
rows = {}; bad = []
for line in open(sys.argv[1]):
    p = line.split()
    if p and re.fullmatch(r"(18|19|20)\d\d", p[0]):
        if len(p) == 13 and all(x.isdigit() for x in p[1:]):
            rows[int(p[0])] = list(map(int, p[1:]))
        else:
            bad.append(line.strip())
print(f"parsed years {min(rows)}-{max(rows)}: {len(rows)}; unparsed rows: {bad}")
for lo, hi in [(1891, 2024), (1891, 1981), (1982, 2024), (1891, 1995), (2004, 2024)]:
    ys = [y for y in rows if lo <= y <= hi]
    s = [sum(rows[y][i] for y in ys) for i in range(12)]
    cb, ca, sb, sa = s[4], s[5], s[8], s[9]
    print(f"{lo}-{hi} ({len(ys)} yrs): disturbances Bay {s[0]} Arabian {s[1]} | cyclones Bay {cb} Arabian {ca} ratio {cb/ca:.2f} | severe Bay {sb} Arabian {sa} ratio {sb/sa:.2f} | severe share of cyclones Bay {sb/cb:.0%} Arabian {sa/ca:.0%}")
