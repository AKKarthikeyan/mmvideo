"""W4-07: great-circle distances between the four regions' main towns (our measurement).
Coordinates: Puducherry = Natural Earth 10m populated_places_simple (79.83, 11.934994); Karaikal, Mahe, Yanam = OpenStreetMap Nominatim town nodes/ways
(saved in ../sources/osm_nominatim.json; ODbL), NOT in Natural Earth. Run: python3 -I pondy_distances.py > pondy_distances_output.txt
"""
import math
R=6371.0088
P={'Puducherry':(79.83,11.934994),'Karaikal':(79.8375761,10.9157100),'Mahe':(75.5364701,11.7021978),'Yanam':(82.2106199,16.7385032)}
def hav(a,b):
    lo1,la1,lo2,la2=map(math.radians,(a[0],a[1],b[0],b[1]))
    h=math.sin((la2-la1)/2)**2+math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
n=list(P)
for i,a in enumerate(n):
    for b in n[i+1:]: print(f'{a}-{b}: {hav(P[a],P[b]):.0f} km great-circle')
print('Mahe-Yanam is the widest pair; Karaikal is the near one.')
