"""Rajasthan vs UN-geoscheme Europe: areas from FAOSTAT (country area, land area). python3 -I europe_areas.py"""
import csv, json, html, re
S='../sources/'
rows=json.load(open(S+'m49_rows.json'))
seen=set(); eu=[]
for r in rows:
    if len(r)>=16 and r[3]=='Europe' and r[9] not in seen:  # the UN page repeats every row in French; keep first (English)
        seen.add(r[9]); eu.append(r)
fao={}
with open(S+'fao/Inputs_LandUse_E_All_Data_(Normalized).csv',encoding='utf-8',errors='replace') as f:
    for r in csv.DictReader(f):
        if r['Item Code'] in ('6600','6601') and r['Element Code']=='5110' and r['Value']:
            fao.setdefault(r['Area Code (M49)'].lstrip("'"),{}).setdefault(r['Item'],{})[int(r['Year'])]=(float(r['Value'])*10, r['Flag'], r['Area'])
RAJ=342239.0
print('Europe members (UN M49 geoscheme, countries and areas):',len(eu))
out=[]
for r in eu:
    name,code=r[8],r[9]
    d=fao.get(code)
    if not d: out.append((name,code,None,None,None)); continue
    def last(it):
        y=d.get(it,{});  
        if not y: return None
        yy=max(y); return yy,y[yy][0]
    out.append((name,code,last('Country area'),last('Land area'),r[5]))
print('%-34s %-4s %-24s %-24s'%('country','m49','country area km2 (yr)','land area km2 (yr)'))
for o in sorted(out,key=lambda x:-(x[2][1] if x[2] else 0)):
    ca=o[2]; la=o[3]
    print('%-34s %-4s %-24s %-24s %s'%(o[0],o[1], f'{ca[1]:,.0f} ({ca[0]})' if ca else 'NA', f'{la[1]:,.0f} ({la[0]})' if la else 'NA', ('Rajasthan is bigger' if ca and ca[1]<RAJ else 'COUNTRY IS BIGGER' if ca else 'no FAO figure')))
tot=[o for o in out if o[2]]
for lab,idx in (('country area',2),('land area',3)):
    vals=[(o[0],o[idx][1]) for o in out if o[idx]]
    bigger=[n for n,v in vals if v<RAJ]
    print(f'\n[{lab}] '); print(f'{lab}: n={len(vals)}; Rajasthan ({RAJ:,.0f}) bigger than {len(bigger)} of {len(vals)} Europe countries/areas; larger-than-Rajasthan: {[ (n,round(v)) for n,v in vals if v>=RAJ]}')
