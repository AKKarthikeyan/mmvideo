# Rank every Indian state/UT as if a country, by population. One year (2026) and one basis (1 July).
# States: NCP Technical Group (Nov 2019) Table 11 (1 July), parsed from ../sources/ncp_table11_1july_excerpt.txt
# Countries: UN DESA WPP 2024, Medium variant, 1 July, thousands, LocTypeName == Country/Area
# Also: Census 2011 (1 March) vs WPP 2011 (1 July) as a cross-check on the 2011 basis.
import re, csv, json, bisect
txt=open('../sources/ncp_table11_1july_excerpt.txt',encoding='utf-8').read().splitlines()
# page order of columns, read from the page headers in the excerpt (3 states per page, India first page)
order=['INDIA','Jammu & Kashmir','Himachal Pradesh','Punjab','Haryana','NCT of Delhi','Rajasthan','Uttar Pradesh','Bihar',
 'Assam','West Bengal','Jharkhand','Odisha','Chhattisgarh','Madhya Pradesh','Gujarat','Maharashtra','Andhra Pradesh',
 'Karnataka','Kerala','Tamil Nadu','Chandigarh','Uttarakhand','Sikkim','Arunachal Pradesh','Nagaland','Manipur',
 'Mizoram','Tripura','Meghalaya','Daman & Diu','Dadra & Nagar Haveli','Goa','Lakshadweep','Puducherry','Andaman & Nicobar Islands','Telangana','Ladakh']
def nums(line): return [int(x.replace(',','')) for x in re.findall(r'\d[\d,]*',line)[1:]]
rows={'2011':[], '2026':[], '2036':[]}
for i,l in enumerate(txt):
    m=re.match(r'\s*(2011|2026|2036)\b(.*)$',l)
    if m:
        if len(re.findall(r'\d[\d,]*',l))==1:   # Telangana/Ladakh page: the numbers are on the next line
            l=l.strip()+' '+txt[i+1]
        rows[m.group(1)].append(nums(l))
# India's Indian-lakh commas: '14,26,907' handled by comma removal. Each row: persons,male,female per state.
def persons(vals): return vals[0::3]
out={}
for y in ('2011','2026','2036'):
    # first matching row of each page; collect all rows with 9 numbers (3 states) except India page (3 numbers + 3 + 3)
    flat=[]
    for v in rows[y]: flat.append(persons(v))
    names=[]
    # India page has 9 numbers => India, J&K, HP ; others 9 numbers (3 states) ; last page 6 numbers (Telangana, Ladakh);
    seq=[x for v in flat for x in v]
    out[y]=dict(zip(order,seq))
    print(y,'parsed',len(seq),'values for',len(order),'names; pages=',len(rows[y]))
json.dump(out,open('ncp_table11_parsed.json','w'),indent=1)
print('Telangana/Ladakh 2026:',out['2026']['Telangana'],out['2026']['Ladakh'])
for k in ('INDIA','Uttar Pradesh','Maharashtra','Bihar','Goa','Ladakh','Telangana'): print(k,{y:out[y][k] for y in out})
