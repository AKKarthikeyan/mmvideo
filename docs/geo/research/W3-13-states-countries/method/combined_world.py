# World where India is dissolved into its states/UTs (each a "country"), one year, one basis. Also a world where only ONE state is split out.
# Basis A = NCP 1 Jul 2026 as printed vs WPP2024 Medium 1 Jul 2026. Basis B = each NCP state scaled by UN India / NCP India (3.48% higher).
# Basis C = Census 2011 count (1 March) vs WPP2024 2011 (1 July), India removed.
import json, csv
ncp=json.load(open('ncp_table11_parsed.json')); census=json.load(open('census_a01_states.json'))
pop={}
with open('../../W3-01-up/sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['Variant']=='Medium' and r['LocTypeName']=='Country/Area' and r['Time'] in ('2011','2026'):
            pop[(r['Location'],r['Time'])]=float(r['PopTotal'])
def show(label,ents,n=25):
    ents=sorted(ents,reverse=True); print('\n====',label,'; entities:',len(ents))
    for i,(p,nm,kind) in enumerate(ents[:n],1): print(f"{i:3d} {nm:34s} {p:12,.0f}k {kind}")
    return ents
st26={k:v for k,v in ncp['2026'].items() if k!='INDIA'}
ctry26=[(p,n,'C') for (n,y),p in pop.items() if y=='2026' and n!='India']
A=[(v,k,'S') for k,v in st26.items()]+ctry26
eA=show('A: 2026, NCP states as printed + UN countries (India dissolved)',A,30)
k=pop[('India','2026')]/ncp['2026']['INDIA']
B=[(v*k,kk,'S') for kk,v in st26.items()]+ctry26
eB=show('B: 2026, states scaled to UN India total',B,30)
for nm,e in (('A',eA),('B',eB)):
    top20=[x for x in e[:20] if x[2]=='S']; top50=[x for x in e[:50] if x[2]=='S']
    print(nm,'states in the top 20:',[(i+1,x[1]) for i,x in enumerate(e[:20]) if x[2]=='S'],' count in top 50:',len(top50))
# Census 2011 basis
c11=[(o['pop']/1000,o['name'].replace(' &','').strip(),'S') for o in census if o['code']!='00']
# fix names ending with '@&' leftovers
ctry11=[(p,n,'C') for (n,y),p in pop.items() if y=='2011' and n!='India']
eC=show('C: 2011 Census count (1 Mar) states + UN 2011 countries (India dissolved)',c11+ctry11,15)
print('C states in top 20:',[(i+1,x[1]) for i,x in enumerate(eC[:20]) if x[2]=='S'])
# Rank of each state inside 'A' for the report
json.dump([{'rank':i+1,'name':x[1],'pop_k':round(x[0]),'kind':x[2]} for i,x in enumerate(eA)],open('combined_world_2026_A.json','w'),indent=0)
# how many states bigger than how many UN member entries etc
n_ctry_smaller_than_up=sum(1 for p,n,t in ctry26 if p<st26['Uttar Pradesh'])
print('\nCountries/areas in WPP smaller than UP (2026 basis A):',n_ctry_smaller_than_up,'of',len(ctry26))
tot_states_bigger_than_median=None
import statistics
print('median WPP country/area 2026 (k):',statistics.median([p for p,n,t in ctry26]),'; median state/UT (k):',statistics.median(st26.values()))
print('states/UTs with 2026 pop above the median country:',sum(1 for v in st26.values() if v>statistics.median([p for p,n,t in ctry26])),'of',len(st26))
