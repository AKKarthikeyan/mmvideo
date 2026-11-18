# Extract the Census 2011 A-01 rows for INDIA and Uttar Pradesh (state 09, 'Total') from the xlsx (no extra libraries).
import zipfile,re,html
z=zipfile.ZipFile('../../W3-01-up/sources/census_A01.xlsx')
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



import json
out=[]
for r,c in data:
    if c.get('B')=='000' and c.get('C')=='00000' and c.get('F')=='Total' and c.get('D') in ('INDIA','STATE'):
        out.append({'row':r,'code':c['A'],'name':c['E'].replace('@','').replace('&amp;','&').strip(),'pop':int(c['K']),'area':float(c['N']),'density':c['O']})
json.dump(out,open('census_a01_states.json','w'),indent=1)
for o in out: print(o)
