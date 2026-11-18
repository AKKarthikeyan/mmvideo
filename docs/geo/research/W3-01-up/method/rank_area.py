# Rank UP's area (Census 2011 basis, 240,928 km2) among countries by FAO/World Bank surface area 2021 (AG.SRF.TOTL.K2).
# 'Countries' = WPP2024 'Country/Area' locations that have an ISO3 code (aggregates in the World Bank file are dropped).
import csv, json
iso=set()
with open('../sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['LocTypeName']=='Country/Area' and r['ISO3_code']: iso.add(r['ISO3_code'])
wb=json.load(open('../sources/wb_surface_area_2021.json'))[1]
rows=[(x['country']['value'],x['countryiso3code'],x['value']) for x in wb if x['value'] and x['countryiso3code'] in iso]
UP=240928
rows.sort(key=lambda r:-r[2])
print("countries with a World Bank/FAO area:",len(rows))
above=[r for r in rows if r[2]>UP]
print("UP area",UP,"would rank #",len(above)+1,"of",len(rows)+1)
for i,r in enumerate(rows):
    if 200000<r[2]<290000: print(i+1,r)
print("India",[r for r in rows if r[1]=='IND'])
print("UK/UP =",[r[2] for r in rows if r[1]=='GBR'][0]/UP)
