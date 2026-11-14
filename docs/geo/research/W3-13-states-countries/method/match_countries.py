# For every state/UT: rank among UN countries and nearest country, 2026 (NCP 1 July vs WPP2024 1 July), plus sensitivity bases.
import json, csv
ncp=json.load(open('ncp_table11_parsed.json'))
st=[k for k in ncp['2026'] if k!='INDIA']
for y in ('2011','2026','2036'):
    print(y,'sum of states',sum(ncp[y][k] for k in st),'vs printed India',ncp[y]['INDIA'])
pop={}
with open('../../W3-01-up/sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['Variant']=='Medium' and r['LocTypeName']=='Country/Area' and r['Time'] in ('2011','2026'):
            pop[(r['Location'],r['Time'])]=float(r['PopTotal'])
un_in={y:pop[('India',y)] for y in ('2011','2026')}
print('UN India',un_in,' NCP India 1 Jul',ncp['2011']['INDIA'],ncp['2026']['INDIA'],' ratio UN/NCP 2026=',un_in['2026']/ncp['2026']['INDIA'])
# world list excluding India (India is replaced by its states)
def world(y): return sorted([(p,n) for (n,yy),p in pop.items() if yy==y and n!='India'],reverse=True)
def rank_in(y,v,wl):
    return sum(1 for p,n in wl if p>v)+1
res=[]
for y,basis in (('2026','A: NCP 1 Jul 2026 as printed'),('2026','B: NCP share x UN India (sensitivity)')):
    wl=world(y); print('\n=====',basis,'; countries in list (India removed):',len(wl))
    for k in sorted(st,key=lambda k:-ncp[y][k]):
        v=ncp[y][k]*(1 if basis.startswith('A') else un_in[y]/ncp[y]['INDIA'])
        above=[(n,p) for p,n in wl if p>v][-1:] ; below=[(n,p) for p,n in wl if p<=v][:1]
        near=min(wl,key=lambda t:abs(t[0]-v))
        rk=rank_in(y,v,wl)
        print(f"{k:28s} {v:10,.0f}k  rank {rk:3d} of {len(wl)+1} (states and countries, India removed); nearest {near[1]} {near[0]:,.0f}k ({v/near[0]-1:+.1%}); next above {above}; next below {below}")
        if basis.startswith('A'): res.append({'state':k,'pop2026_k':v,'rank':rk,'nearest':near[1],'nearest_k':round(near[0]),'diff_pct':round((v/near[0]-1)*100,2)})
json.dump(res,open('match_countries_2026.json','w'),indent=1)
# Census 2011 (1 Mar) vs WPP2011 (1 Jul)
c=json.load(open('census_a01_states.json'))
wl=world('2011'); print('\n===== Census 2011 as counted (1 March) vs WPP2024 2011 (1 July), India removed')
for o in sorted(c,key=lambda o:-o['pop']):
    if o['code']=='00': continue
    v=o['pop']/1000; near=min(wl,key=lambda t:abs(t[0]-v))
    print(f"{o['name']:30s} {v:10,.0f}k rank {rank_in('2011',v,wl):3d}; nearest {near[1]} {near[0]:,.0f}k ({v/near[0]-1:+.1%})")
