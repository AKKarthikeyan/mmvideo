# Rank Uttar Pradesh among countries by population, one year and one basis.
# Countries: UN DESA WPP 2024, TotalPopulationBySex, Medium variant, 1 July, thousands, LocTypeName == 'Country/Area'.
# UP: (a) Census 2011 count (1 March 2011) 199,812,341 -- compare with WPP 2011 estimate;
#     (b) National Commission on Population Technical Group (Nov 2019) projection, 1 July 2011 and 1 July 2026 ('000).
import csv, json
rows=[]
with open('../sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['Variant']=='Medium' and r['Time'] in ('2011','2026','2036') and r['LocTypeName']=='Country/Area':
            rows.append((r['Time'],r['Location'],float(r['PopTotal'])))
UP={'2011_census_march':199812.341,'2011_ncp_july':200897,'2026_ncp_july':243466,'2036_ncp_july':259459}
def rank(year,label,val):
    c=sorted([(p,n) for y,n,p in rows if y==year],reverse=True)
    above=[(n,p) for p,n in c if p>val]
    below=[(n,p) for p,n in c if p<=val]
    print(f"\n== {label}: UP {val:,.0f}k vs WPP2024 medium {year} (n countries={len(c)})")
    print(f"UP would rank #{len(above)+1} of {len(c)+1}")
    print("countries just above UP:",[(n,round(p)) for n,p in above[-3:]])
    print("countries just below UP:",[(n,round(p)) for n,p in below[:5]])
    print("top 8:",[(n,round(p)) for p,n in c[:8]])
rank('2011','Census 2011 (1 Mar)',UP['2011_census_march'])
rank('2011','NCP projection 1 Jul 2011',UP['2011_ncp_july'])
rank('2026','NCP projection 1 Jul 2026',UP['2026_ncp_july'])
rank('2036','NCP projection 1 Jul 2036',UP['2036_ncp_july'])
d={n:p for y,n,p in rows if y=='2026'}
print("\nIndia WPP 2026:",d['India'],"Pakistan",d['Pakistan'],"Brazil",d['Brazil'],"Indonesia",d['Indonesia'],"USA",d['United States of America'])
print("UP share of the 2026 ranking: 243,466 / Pakistan",243466/d['Pakistan'], " / Brazil",243466/d['Brazil'])
d11={n:p for y,n,p in rows if y=='2011'}
print("2011 Brazil",d11['Brazil'],"Pakistan",d11['Pakistan'],"Indonesia",d11['Indonesia'])
