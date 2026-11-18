"""Sum IMD's June-September depression counts (cdmon.pdf) by basin, 1891 onward.
Input: the PDF converted with `pdftotext -layout imd_cdmon_monsoon_depressions.pdf out.txt`.
Each data row has 21 fields: year + 4 months x (BOB, AS, LAND, TOTAL) + season (BOB, AS, LAND, TOTAL); we sum the season columns."""
import re, sys
b = a = l = 0; ys = []
for line in open(sys.argv[1]):
    p = line.split()
    if len(p) == 21 and re.fullmatch(r"(18|19|20)\d\d", p[0]):
        ys.append(int(p[0])); b += int(p[17]); a += int(p[18]); l += int(p[19])
print(f"years {min(ys)}-{max(ys)} ({len(ys)} rows): Bay of Bengal {b}, Arabian Sea {a}, land {l}; Bay share of sea-born = {b/(a+b):.1%}")
