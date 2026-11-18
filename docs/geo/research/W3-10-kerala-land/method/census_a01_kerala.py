"""Census of India 2011, table A-01 (saved: sources/census2011_A01.xlsx).
1) Kerala state rows (Total/Rural/Urban) 2) density rank of every State/UT (Total rows, state level)
3) Kerala districts' density 4) density of Kerala with forest area (LUS 2023-24, 1,082 thousand ha) taken out -- our own computation."""
import openpyxl
ws=openpyxl.load_workbook('sources/census2011_A01.xlsx',read_only=True).active
rows=[r[:15] for r in ws.iter_rows(values_only=True)]
hdr=['state','dist','sub','level','name','tru','vill_inh','vill_uninh','towns','hh','pop','male','female','area','dens']
def d(r): return dict(zip(hdr,r))
print('--- Kerala state rows')
for r in rows:
    if r[0]=='32' and r[1]=='000': print(d(r))
print('--- Kerala districts, Total rows')
for r in rows:
    if r[0]=='32' and r[1]!='000' and r[2]=='00000' and r[5]=='Total': print(r[4],'pop',r[10],'area',r[13],'dens',r[14])
print('--- State/UT density ranking (Total)')
st=[d(r) for r in rows if r[1]=='000' and r[0] not in('00',None) and r[5]=='Total']
for i,x in enumerate(sorted(st,key=lambda x:-float(x['dens'])),1): print(i,x['name'],x['pop'],x['area'],x['dens'])
k=[d(r) for r in rows if r[0]=='32' and r[1]=='000' and r[5]=='Total'][0]
pop=float(k['pop']); area=float(k['area'])
print('--- our computation')
print('Kerala pop/area =',round(pop/area,1),'(printed',k['dens'],')')
forest_km2=1082*10  # thousand ha -> km2 (1 ha = 0.01 km2; 1082 thousand ha = 10,820 km2)
print('forest (LUS 2023-24, land records) km2 =',forest_km2)
print('density on non-forest area =',round(pop/(area-forest_km2),0))
