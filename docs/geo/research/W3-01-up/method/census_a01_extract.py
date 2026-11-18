# Extract the Census 2011 A-01 rows for INDIA and Uttar Pradesh (state 09, 'Total') from the xlsx (no extra libraries).
import zipfile,re,html
z=zipfile.ZipFile('../sources/census_A01.xlsx')
ss=[html.unescape(re.sub('<[^>]+>','',s)) for s in re.findall(r'<si>(.*?)</si>',z.read('xl/sharedStrings.xml').decode(),re.S)]
sh=z.read('xl/worksheets/sheet1.xml').decode()
rows=re.findall(r'<row [^>]*r="(\d+)"[^>]*>(.*?)</row>',sh,re.S)
def cells(x):
    out={}
    for ref,t,v in re.findall(r'<c r="([A-Z]+)\d+"([^>]*)>(?:<f>.*?</f>)?<v>(.*?)</v>',x,re.S):
        out[ref]=ss[int(v)] if 't="s"' in t else v
    return out
data=[(int(r),cells(x)) for r,x in rows]
hdr=[c for r,c in data[:6]]
for r,c in data[:8]: print(r,c)

print("\nINDIA and UP state-level 'Total' rows:")
for r,c in data:
    if c.get('A')=='09' and c.get('B')=='000' and c.get('F')=='Total' or (c.get('A')=='00' and c.get('F')=='Total'):
        print(r,c)
