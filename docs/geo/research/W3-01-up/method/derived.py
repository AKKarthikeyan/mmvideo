import csv, json
pop={}; iso={}
with open('../sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['Variant']=='Medium' and r['LocTypeName']=='Country/Area':
            pop[(r['Location'],int(r['Time']))]=float(r['PopTotal']); iso[r['Location']]=r['ISO3_code']
wb={x['countryiso3code']:x['value'] for x in json.load(open('../sources/wb_surface_area_2021.json'))[1] if x['value']}
UP_AREA=240928; UP26=243466; UP11c=199812.341; IND_C11=1210854.977  # '000; India Census 2011 total 1,210,854,977
# NCP report: India 1 Jul 2026 = 14,26,907 ('000), UP 2,43,466 ; India census table gives 12,10,855 (1 Mar 2011)
print("UP share of India, Census 2011 (NCP Table 1: 199,812 / 1,210,855):", 199812/1210855)
print("UP share of India, NCP 1 Jul 2026: 243,466 / 1,426,907 =", 243466/1426907)
print("UP area share of India (NCP/Census 240,928 / 3,287,263 survey) =", 240928/3287263)
# sensitivity: scale UP by UN's India figure
for y,upshare in ((2011,199812/1210855),(2026,243466/1426907)):
    ind=pop[('India',y)]; v=ind*upshare
    others=sorted([(p,n) for (n,yy),p in pop.items() if yy==y],reverse=True)
    rk=sum(1 for p,n in others if p>v)+1
    print(f"{y}: UN India {ind:,.0f}k x UP share {upshare:.4f} = {v:,.0f}k -> rank {rk} of {len(others)+1}; just above: {[ (n,round(p)) for p,n in others if p>v][-2:]} below: {[(n,round(p)) for p,n in others if p<=v][:2]}")
# margins 2026
n26=pop[('Nigeria',2026)]; b26=pop[('Brazil',2026)]; pk26=pop[('Pakistan',2026)]
print("2026 UP vs Nigeria diff (k):",UP26-n26, "(%.2f%%)"%((UP26-n26)/n26*100), "; vs Pakistan:",UP26-pk26,"; vs Brazil:",UP26-b26)
# area ratios
for nm,code in (('Nigeria','NGA'),('Pakistan','PAK'),('Brazil','BRA'),('United Kingdom','GBR'),('United States of America','USA'),('Indonesia','IDN'),('Bangladesh','BGD')):
    a=wb[code]; p=pop[(nm,2026)]
    print(f"{nm}: area {a:,.0f} km2 = {a/UP_AREA:.1f}x UP ; pop2026 {p:,.0f}k ; UP pop/that = {UP26/p:.2f}; density {p*1000/a:,.0f}/km2")
print("UP density 2026 (NCP 1 Jul 2026 / Census area):",UP26*1000/UP_AREA, " Census 2011 density (199,812,341/240,928)=",199812341/240928)
# density rank among countries with pop>10M
rows=[]
for (n,y),p in pop.items():
    if y==2026 and p>10000 and iso[n] in wb: rows.append((p*1000/wb[iso[n]],n))
rows.sort(reverse=True)
d=UP26*1000/UP_AREA
print("countries >10M people 2026 with density above UP:",[(n,round(x)) for x,n in rows if x>d])
# largest landlocked developing country 2026
lldc=["Afghanistan","Armenia","Azerbaijan","Bhutan","Bolivia (Plurinational State of)","Botswana","Burkina Faso","Burundi","Central African Republic","Chad","Eswatini","Ethiopia","Kazakhstan","Kyrgyzstan","Lao People's Democratic Republic","Lesotho","North Macedonia","Malawi","Mali","Mongolia","Nepal","Niger","Paraguay","Republic of Moldova","Rwanda","South Sudan","Tajikistan","Turkmenistan","Uganda","Uzbekistan","Zambia","Zimbabwe"]
miss=[l for l in lldc if (l,2026) not in pop]; print("unmatched LLDC names:",miss)
l=sorted([(pop[(n,2026)],n) for n in lldc if (n,2026) in pop],reverse=True)[:4]; print("largest LLDCs 2026:",l)
# Other landlocked (non-LLDC) countries >20M in WPP: Czechia, Hungary, Austria, Switzerland, Serbia, Belarus, Slovakia... max
for n in ['Belarus','Czechia','Hungary','Austria','Switzerland','Serbia']: print(n,round(pop[(n,2026)]))
# landlocked UP vs Ethiopia
print("UP / Ethiopia 2026:",UP26/pop[('Ethiopia',2026)])
# UK
print("UK pop 2026 k:",pop[('United Kingdom',2026)], " UP/UK:",UP26/pop[('United Kingdom',2026)])
# India share of world; world rank list top 10 2026 
