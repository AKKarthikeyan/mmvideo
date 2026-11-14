# The five candidate pairs: robustness across bases (A NCP 1 Jul 2026; B NCP scaled to UN India; C Census 2011 vs WPP 2011), area and density.
import json, csv
ncp=json.load(open('ncp_table11_parsed.json')); cen={o['name'].strip(' @&').upper():o for o in json.load(open('census_a01_states.json'))}
pop={}
with open('../../W3-01-up/sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['Variant']=='Medium' and r['LocTypeName']=='Country/Area' and r['Time'] in ('2011','2026'): pop[(r['Location'],r['Time'])]=float(r['PopTotal']); 
wb={x['country']['value']:x['value'] for x in json.load(open('../../W3-01-up/sources/wb_surface_area_2021.json'))[1] if x['value']}
iso={x['countryiso3code']:x['value'] for x in json.load(open('../../W3-01-up/sources/wb_surface_area_2021.json'))[1] if x['value']}
k=pop[('India','2026')]/ncp['2026']['INDIA']
pairs=[('Uttar Pradesh','Nigeria','NGA'),('Uttar Pradesh','Brazil','BRA'),('Maharashtra','Japan','JPN'),('Bihar','Mexico','MEX'),('Rajasthan','Germany','DEU'),('Karnataka','United Kingdom','GBR'),('West Bengal','Viet Nam','VNM'),('Kerala','Malaysia','MYS'),('Telangana','Morocco','MAR')]
print(f"UN India / NCP India (1 Jul 2026) = {k:.4f}; UN India/Census 2011 count = {pop[('India','2011')]*1000/1210854977:.4f}")
for s,c,i in pairs:
    a=ncp['2026'][s]; b=a*k; w=pop[(c,'2026')]
    cs=cen[s.upper()]['pop']/1000; w11=pop[(c,'2011')]
    ar=cen[s.upper()]['area']; ca=iso[i]
    print(f"{s:14s} vs {c:15s} | A {a:9,.0f}k vs {w:9,.0f}k -> {a/w-1:+.1%} | B {b:9,.0f}k -> {b/w-1:+.1%} | C(2011) {cs:9,.0f}k vs {w11:9,.0f}k -> {cs/w11-1:+.1%} | area {ar:9,.0f} vs {ca:9,.0f} km2 (country {ca/ar:.2f}x state) | density state {a*1000/ar:6,.0f} country {w*1000/ca:6,.0f} /km2")
# Bihar overtakes Maharashtra: year-by-year from Table 11 is only in excerpt; use parsed 2011,2026,2036
for y in ('2011','2026','2036'): print(y,'Bihar',ncp[y]['Bihar'],'Maharashtra',ncp[y]['Maharashtra'])
