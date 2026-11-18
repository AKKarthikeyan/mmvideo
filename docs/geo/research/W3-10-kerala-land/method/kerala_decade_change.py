"""Kerala change 2014-15 -> 2023-24 (p), LUS 2023-24 Table 5 (thousand ha), values copied from sources/lus_2023_24.txt
(KERALA block, two pages of Table 5). Plus Census 2011 A-01 urban/rural shares (values from census_a01_kerala_output.txt)."""
t5={'reporting':(3886,3886),'forest':(1082,1082),'non_agri':(526,610),'barren':(13,9),'pasture':(0,0),
    'misc_tree':(3,2),'cult_waste':(101,102),'fallow_other':(55,51),'current_fallow':(65,57),'net_sown':(2043,1973)}
for k,(a,b) in t5.items(): print(f'{k:15s} 2014-15={a:5d} 2023-24p={b:5d} change={b-a:+5d} ({(b-a)/a*100 if a else 0:+.1f}%)')
r=3886; idle=9+0+102+51+57
print('idle 2023-24p (barren+pasture+cult waste+both fallows) =',idle,'thousand ha =',round(idle/r*100,1),'% of reporting area; 1 in',round(r/idle,1))
print('India B share (Table II) = 21.0% -> 1 in',round(100/21.0,1))
print('non-agri+net sown+misc tree =',610+1973+2,'=',round((610+1973+2)/r*100,1),'%')
pop,upop,area,uarea=33406061,15934926,38852,7598.8
print('urban share of population',round(upop/pop*100,1),'%; urban share of area',round(uarea/area*100,1),'%')
print('villages: inhabited 1017, uninhabited 1 (A-01 Kerala Total row)')
