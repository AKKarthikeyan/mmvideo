"""Count IMD's own list of North Indian Ocean tropical cyclones (tcintensity.xls, sheet 'TC DATA', 1990-2025)
by basin and by IMD maximum-wind class. The xls was exported to CSV text (sources/imd_tcintensity.txt) with xlrd:
each sheet starts with a '## SHEET,<name>' row. Column 2 = basin, column 4 = maximum intensity e.g. '127kt'.
Rows whose wind cannot be parsed are listed and left out. 'Andaman' rows would count as Bay (none found)."""
import csv, re, sys
from collections import Counter
data = []; sheet = None; skipped = []
for r in csv.reader(open(sys.argv[1])):
    if r and r[0] == "## SHEET": sheet = r[1]; continue
    if sheet != "TC DATA" or len(r) < 5: continue
    try: y = int(float(r[1]))
    except ValueError: continue
    basin = re.sub(r"\s+", " ", r[2]).strip().lower()
    m = re.search(r"(\d+)\s*kt", r[4].replace(" ", ""))
    if not m: skipped.append((y, basin, r[3][:50].replace("\n", " "))); continue
    data.append((y, basin, int(m.group(1))))
print("rows:", len(data), "basins:", dict(Counter(d[1] for d in data)))
print("left out (no wind parsed):", skipped)
for lo, hi in [(1990, 2024), (1990, 2003), (2004, 2024)]:
    for t, nm in [(34, "CS+"), (48, "SCS+"), (64, "VSCS+"), (90, "ESCS+"), (120, "SuCS")]:
        b = sum(1 for d in data if lo <= d[0] <= hi and d[2] >= t and ("bay" in d[1] or "andaman" in d[1]))
        a = sum(1 for d in data if lo <= d[0] <= hi and d[2] >= t and "arabian" in d[1])
        print(f"IMD list {lo}-{hi} {nm}: Bay {b} Arabian {a}")
