"""Read Rajasthan and the other large states' area from Census of India 2011 table A-1 (xlsx parsed with zipfile only). python3 -I census_area.py"""
import zipfile,re,xml.etree.ElementTree as ET
Z=zipfile.ZipFile('../sources/census2011_A1_area.xlsx')
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ss=[ ''.join(t.text or '' for t in si.iter('{%s}t'%ns['m'])) for si in ET.fromstring(Z.read('xl/sharedStrings.xml')).findall('m:si',ns)]
print([n for n in Z.namelist() if 'sheet' in n][:5])
sh=ET.fromstring(Z.read('xl/worksheets/sheet1.xml'))
rows=[]
for r in sh.iter('{%s}row'%ns['m']):
    d={}
    for c in r.findall('m:c',ns):
        col=re.match(r'[A-Z]+',c.get('r')).group(); v=c.find('m:v',ns)
        if v is None: continue
        d[col]=ss[int(v.text)] if c.get('t')=='s' else v.text
    rows.append((int(r.get('r')),d))
for rn,d in rows[:6]: print(rn,d)

print('--- footnotes (@ & $) and Rajasthan state row')
for rn,d in rows:
    if d.get('A','').strip()=='08' and d.get('B','').strip()=='000' and d.get('C','').strip()=='00000': print(rn,d)
st=[(d['E'].strip(),float(d['N'])) for rn,d in rows if d.get('B','').strip()=='000' and d.get('C','').strip()=='00000' and d.get('F','').strip()=='Total' and d.get('A','').strip()!='00' and d.get('N')]
st.sort(key=lambda x:-x[1])
print('Largest states/UTs by A-1 area (sq km):')
for n,a in st[:6]: print('  %-20s %10.0f'%(n,a))
ind=[float(d['N']) for rn,d in rows if d.get('A','').strip()=='00' and d.get('F','').strip()=='Total'][0]
raj=[a for n,a in st if n.upper().startswith('RAJASTHAN')][0]
print('Rajasthan share of India: %.2f%%'%(100*raj/ind), ' India total', ind)
