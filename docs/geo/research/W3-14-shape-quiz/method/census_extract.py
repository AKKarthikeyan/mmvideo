# Dump raw Census 2011 A-01 rows (header, state totals, Kanniyakumari district) to a text copy for quote checking.
# Run: python3 -I method/census_extract.py  -> sources/census2011_A01_extract.txt
import zipfile, re, html, os
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
z = zipfile.ZipFile(os.path.join(HERE, "sources/census2011_A01.xlsx"))
ss = [html.unescape(re.sub('<[^>]+>', '', x)) for x in re.findall(r'<si>(.*?)</si>', z.read('xl/sharedStrings.xml').decode(), re.S)]
sh = z.read('xl/worksheets/sheet1.xml').decode()
out = ["Census of India 2011, Table A-01 (ORGI). Raw cell values, tab-separated, copied by method/census_extract.py from sources/census2011_A01.xlsx sheet1.", ""]
for rn, x in re.findall(r'<row [^>]*r="(\d+)"[^>]*>(.*?)</row>', sh, re.S):
    c = {}
    for ref, t, v in re.findall(r'<c r="([A-Z]+)\d+"([^>]*)>(?:<f>.*?</f>)?<v>(.*?)</v>', x, re.S):
        c[ref] = ss[int(v)] if 't="s"' in t else v
    keep = int(rn) <= 6 or (c.get('F') == 'Total' and c.get('C') == '00000' and c.get('D') in ('INDIA', 'STATE')) \
        or (c.get('A') == '33' and 'KANNIYAKUMARI' in (c.get('E', '') + c.get('D', '')).upper() and c.get('F') == 'Total') \
        or (c.get('A') == '33' and c.get('F') == 'Total' and c.get('E', '').replace('@','').strip().upper() in ('AGASTHEESWARAM', 'THOVALA', 'KALKULAM', 'VILAVANCODE', 'KANNIYAKUMARI', 'SHENKOTTAI', 'SENGOTTAI'))
    if keep:
        out.append(f"row {rn}: " + "\t".join(f"{k}={v.strip()}" for k, v in sorted(c.items(), key=lambda kv: (len(kv[0]), kv[0]))))
# footnotes (last rows)
allrows = re.findall(r'<row [^>]*r="(\d+)"[^>]*>(.*?)</row>', sh, re.S)
out.append(""); out.append("Last 22 rows (footnotes):")
for rn, x in allrows[-22:]:
    t = [ss[int(v)] if 't="s"' in tt else v for tt, v in re.findall(r'<c r="[A-Z]+\d+"([^>]*)>(?:<f>.*?</f>)?<v>(.*?)</v>', x, re.S)]
    out.append(f"row {rn}: " + " | ".join(s.strip() for s in t))
open(os.path.join(HERE, "sources/census2011_A01_extract.txt"), "w").write("\n".join(out) + "\n")
print(len(out), "lines")
