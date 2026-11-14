"""Parse the Europe block of UNSD Demographic Yearbook 2022, Table 3 (surface area, km2) from pdftotext output,
then compare with Rajasthan (Census of India 2011 area). python3 -I dyb_europe.py"""
import re
RAJ=342239
L=open('../sources/dyb2022_table03.txt',encoding='utf-8').read().split('\n')
# Europe blocks: from a line equal 'EUROPE' to next 'OCEANIA' / page break repeats the header 'EUROPE'
res=[]; inside=False; name=''
for ln in L:
    s=ln.strip()
    if s=='EUROPE': inside=True; name=''; continue
    if s.startswith('OCEANIA'): inside=False
    if not inside or not s: continue
    if s.startswith(('3. Population','Population selon','Population at','Continent','and census','Les deux','2015','Estim')): continue
    m=re.match(r'^\d+\s+[IVX]+\s+\d{4}\s*\.*\s+(D[FJ]|[A-Z]+)\s+(.*)$',s)
    if m:
        data=m.group(2)
        # surface area and density are the last two fields (3+ spaces apart)
        parts=re.split(r'\s{2,}',data)
        res.append((name.strip(),parts[-2] if len(parts)>=2 else None,parts[-1]))
        name=''
    elif re.match(r'^\d+\s+[IVX]+\s+\d{4}|^\d{1,2}\s+[IVX]+\s+\d{4}',s): pass
    elif re.match(r'^\d+$',s): pass   # page number
    else:
        name=(name+' '+s) if name and not re.match(r'^[A-Z]',s[:1]) else (name+' '+s if name else s)

def num(x):
    x=x.replace('...','').strip()
    m=re.match(r'^(\d{1,3}(?: \d{3})*|\d+)',x)
    return int(m.group(1).replace(' ','')) if m else None
FOOT={'Finland - Finlande':336884,'Denmark - Danemark143':42947,'Holy See - Saint-Siège153':0}  # footnote digits glued to value in pdftotext
rows=[]
for n,a,d in res:
    nm=n.split(' - ')[0].replace('143','').replace('153','').replace('177','')
    if n in FOOT: v=FOOT[n]
    else: v=num(a.replace('...','').strip()) if a else None
    rows.append((nm.strip(),v))
rows.sort(key=lambda r:-(r[1] or 0))
print('UNSD Demographic Yearbook 2022, Table 3, Europe block: %d lines (countries and areas, M49 Europe)'%len(rows))
print('Rajasthan (Census of India 2011) = %d km2'%RAJ)
bigger=[r for r in rows if r[1] and r[1]>RAJ]
print('\nLarger than Rajasthan (%d): '%len(bigger)+', '.join('%s %s'%(n,format(v,',')) for n,v in bigger))
print('Smaller (%d of %d)'%(len(rows)-len(bigger),len(rows)))
for n,v in rows: print('  %-60s %12s  %s'%(n,format(v,',') if v is not None else 'NA','Rajasthan x%.2f'%(RAJ/v) if v else ''))
fi=336884; al=1583
print('\nFinland incl Aland (footnote 145: DYB Finland excludes Aland): %d; Rajasthan - that = %d km2 (%.1f%%)'%(fi+al,RAJ-(fi+al),100*(RAJ-(fi+al))/(fi+al)))
print('Germany: Rajasthan is %.1f%% smaller'%(100*(1-RAJ/357581)))
print('Norway (DYB, excludes Svalbard+Jan Mayen listed separately 62,422): %d; with them %d (> Rajasthan: %s)'%(323772,323772+62422,323772+62422>RAJ))

# --- counts ---
NONSOV={'Åland Islands','Faroe Islands','Gibraltar','Guernsey','Isle of Man','Jersey','Svalbard and Jan Mayen Islands'}
sov=[r for r in rows if r[0] not in NONSOV]
big=[r[0] for r in sov if r[1]>RAJ]
print('\nUN-member and observer states in M49 Europe in the DYB table: %d (51 lines less 7 non-sovereign areas: %s)'%(len(sov),', '.join(sorted(NONSOV))))
print('Larger than Rajasthan (%d): %s'%(len(big),', '.join(big)))
print('Rajasthan larger than %d of %d (%.0f%%)'%(len(sov)-len(big),len(sov),100*(len(sov)-len(big))/len(sov)))
print('If Norway = Kingdom incl. Svalbard and Jan Mayen (Eurostat reg_area3 NO = 384,486 km2 in 2023: mainland + Svalbard 60,299 + Jan Mayen 377): larger than Rajasthan = %d, smaller = %d of %d'%(len(big)+1,len(sov)-len(big)-1,len(sov)))
print('All 51 lines: larger than Rajasthan = %d; smaller = %d'%(len(big),51-len(big)))
print('\nNeighbours by margin (Rajasthan/country - 1):')
for n in ['Germany','Finland','Norway','Poland','Italy','United Kingdom of Great Britain and Northern Ireland','Romania','Belarus']:
    v=dict(rows).get(n) or dict(rows).get(n.split(' of ')[0])
    if v: print('  %-12s %8d  Rajasthan is %+.1f%%  (%+d km2)'%(n[:12],v,100*(RAJ/v-1),RAJ-v))
# same-census-year population: Rajasthan 2011 census vs UK 2011 census (DYB lines: 27 III 2011 63 379 787)
print('\nPopulation, census 2011: Rajasthan 68,548,437 (Census of India A-1) vs United Kingdom 63,379,787 (UNSD DYB 2022 Table 3, census 27 III 2011; excludes Channel Islands and Isle of Man): Rajasthan %+d (%.1f%%)'%(68548437-63379787,100*(68548437/63379787-1)))
