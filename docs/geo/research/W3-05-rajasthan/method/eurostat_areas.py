"""Eurostat reg_area3 (area by NUTS region; country level, total area km2) for the borderline countries, 2023 and 2025. python3 -I eurostat_areas.py"""
import json
d=json.load(open('../sources/eurostat_reg_area3.json'))
geo=d['dimension']['geo']['category']; tim=list(d['dimension']['time']['category']['index'])
gi=geo['index']; lab=geo['label']; nt=len(tim)
print(d['label'],'| updated',d['updated'],'| landuse=TOTAL unit=KM2')
RAJ=342239
for g,i in sorted(gi.items(),key=lambda x:x[1]):
    row={t:d['value'].get(str(i*nt+k)) for k,t in enumerate(tim)}
    v23=row['2023']; v25=row.get('2025')
    print('%-3s %-30s 2023=%s 2025=%s  Rajasthan/2023 = %.3f'%(g,lab[g],v23,v25,RAJ/v23 if v23 else 0))
