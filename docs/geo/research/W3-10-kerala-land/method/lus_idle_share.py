"""Idle-class share by state, LUS 2023-24 (p), Table II (percent of reporting area).
Columns: 1 forest, 2 non-agri, 3 barren, 4 pasture, 5 misc tree, 6 culturable waste, 7 fallow other, 8 current fallow, 9 NSA.
Rows are read by serial number (names wrap over lines in the PDF); names are the table's own order.
 A = barren + pasture + culturable waste   (never-used / abandoned classes)
 B = A + fallow other than current + current fallow (everything not forest, not built-on, not cropped, not tree crop)
"""
import re
names=["A&N Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","DNH & DD","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
txt=open('sources/lus_2023_24.txt').read().split('\n')
start=[i for i,l in enumerate(txt) if 'Table No. II: State-wise Percentage' in l][0]
rows={}
for l in txt[start:start+90]:
    m=re.match(r'\s*(\d{1,2})\s+(?:[A-Za-z&\. ]+?\s{2,})?((?:\d+\.\d\s+){8}\d+\.\d)\s*$',l)
    if m: rows[int(m.group(1))]=[float(x) for x in m.group(2).split()]
    m=re.match(r'\s*ALL INDIA\s+((?:\d+\.\d\s+){8}\d+\.\d)\s*$',l)
    if m: rows[99]=[float(x) for x in m.group(1).split()]
assert sorted(k for k in rows if k<99)==list(range(1,37)),sorted(rows)
out=[]
for k,v in rows.items():
    n=names[k-1] if k<99 else 'ALL INDIA'
    A=v[2]+v[3]+v[5]; B=A+v[6]+v[7]
    out.append((n,v,round(A,1),round(B,1),round(sum(v),1)))
print('rows parsed:',len(out))
for key,idx in (('A: barren+pasture+culturable waste',2),('B: A + both fallows',3)):
    print('\nRanked ascending by',key)
    for i,r in enumerate(sorted(out,key=lambda r:r[idx]),1): print(f'{i:2d} {r[0]:20s} A={r[2]:5.1f} B={r[3]:5.1f} rowsum={r[4]}  forest={r[1][0]} nonagri={r[1][1]} NSA={r[1][8]}')
