"""Sum IMD's October-December depression counts (cdpos.pdf) by basin, 1891 onward.
Input: pdftotext -layout output. Data rows: year + 3 months x (BOB, AS, LAND, TOTAL) + season (BOB, AS, LAND, TOTAL) = 17 fields."""
import re, sys
b = a = l = 0; ys = []
for line in open(sys.argv[1]):
    p = line.split()
    if len(p) == 17 and re.fullmatch(r"(18|19|20)\d\d", p[0]) and all(x.isdigit() for x in p[1:]):
        ys.append(int(p[0])); b += int(p[13]); a += int(p[14]); l += int(p[15])
print(f"years {min(ys)}-{max(ys)} ({len(ys)} rows): Oct-Dec depressions and above: Bay of Bengal {b}, Arabian Sea {a}, land {l}")
