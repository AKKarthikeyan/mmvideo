import math
def hav(a,b):
    R=6371.0088;p1,p2=map(math.radians,(a[0],b[0]));dl=math.radians(b[1]-a[1]);dp=p2-p1
    h=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))
colaba=(18.9253590,72.8212466)   # OSM Nominatim, Colaba (German Consulate, Colaba), ODbL
mahim=(19.0482597,72.8383531)    # OSM Nominatim, Mahim Causeway
print("straight line Colaba-Mahim Causeway: %.1f km"%hav(colaba,mahim))
sqmi=22.48; km2=sqmi*2.589988110336
print("Gazetteer 1909 island area: %.2f sq mi = %.1f km2"%(sqmi,km2))
print("MCGM island city (DRMMP 2011): 67.79 km2 (Table 1 gives 68.71)")
for v in (67.79,68.71): print("ratio %.2f (+%.0f%%)"%(v/km2,(v/km2-1)*100))
print("Hornby Vellard acres 400 ->km2 %.2f"%(400*0.00404686))
print("Seven islands -> one: Gaz says 22.48 sq mi; Edwardes 1841 note 19 sq mi incl Colaba")
