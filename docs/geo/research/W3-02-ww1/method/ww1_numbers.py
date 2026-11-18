"""W3-02-ww1: every derived figure, recomputed from values read off the printed tables.
Inputs are typed from page images (locators in each block). Run: python3 -I ww1_numbers.py"""
import json, math, os

print("== A. HMSO 1922 Statistics, p.777 (pdf p.795): India's Military Contribution, table 3 (sent overseas to 31 Dec 1919)")
# columns: Indian officers+WOs, Indian other ranks, non-combatant Indians, Indian total (printed)
A = {  # theatre: (IO, IOR, noncomb, printed Indian total)
 "France":      (1923,  87412,  49273, 138608),
 "East Africa": (848,   33835,  13021,  47704),
 "Mesopotamia": (9514, 317142, 348735, 675391),
 "Egypt":       (2204, 107742,  34047, 143993),
 "Gallipoli":   (90,    3041,   1819,    4950),
 "Salonica":    (132,   6545,   3254,    9931),
 "Palestine":   (4,      1,       28,      33),
 "Aden":        (480,  19936,   5786,   26205),  # parts sum to 26,202: a 3-unit gap inside the printed Aden row
 "Persian Gulf":(967,  29408,  18823,   49198),
}
tot_printed = 1096013
sum_printed = sum(v[3] for v in A.values())
print("sum of printed Indian totals by theatre:", sum_printed, "| printed grand Indian total:", tot_printed)
IO = sum(v[0] for v in A.values()); IOR = sum(v[1] for v in A.values()); NC = sum(v[2] for v in A.values())
print("Indian officers+WOs", IO, "(printed 16,162) | Indian other ranks", IOR, "(printed 605,062) | non-combatants", NC, "(printed 474,789)")
comb = 16162 + 605062
print("Indian combatants overseas (printed cols) =", comb, "; non-combatants =", 474789, "; total =", comb+474789)
print("non-combatant share of Indians sent overseas = %.1f%%" % (100*474789/tot_printed))
for k in ("Mesopotamia","France","Egypt","East Africa"):
    print("  %-12s %7d = %.1f%% of 1,096,013" % (k, A[k][3], 100*A[k][3]/tot_printed))
print("Mesopotamia + Persian Gulf + Aden + Egypt share: %.1f%%" % (100*(675391+49198+26205+143993)/tot_printed))
print("Indian combatants overseas vs pre-war Indian combatants (serving 159,134 + reservists 34,767 = 193,901): x%.1f" % (comb/193901))

print("\n== B. HMSO 1922, p.777: recruited in India (Indian ranks) to 31 Dec 1919: 877,068 comb + 563,369 non-comb = 1,440,437")
print("check sum:", 877068+563369)
print("pre-war army in India: 76,953 British + 239,561 Indian incl. non-combatants; combatant Indians 193,901")
print("1,440,437 / 239,561 = x%.1f ; 877,068 / 193,901 = x%.1f" % (1440437/239561, 877068/193901))

print("\n== C. India's Contribution 1923, p.177 (leaf 184): 'Dead from all causes' by theatre (B.O., I.O., B.R., I.R., Followers)")
D = {
 "France":      (380,189,17,6094,2227),
 "East Africa": (50,67,11,2439,504),
 "Mesopotamia": (730,380,905,19186,12261),
 "Dunsterforce":(6,0,50,158,23),
 "Persia":      (14,28,0,1875,758),
 "Egypt":       (89,79,17,4282,626),
 "Gallipoli":   (72,33,3,1690,128),
 "Aden":        (14,8,2,522,86),
 "Muscat":      (1,1,0,64,4),
 "Frontier ops":(111,62,190,2439,2166),
}
grand = [1467,847,1195,38749,18783]
cols = [sum(v[i] for v in D.values()) for i in range(5)]
print("column sums:", cols, "| printed grand totals:", grand)
total_dead = sum(grand); print("dead from all causes (printed grand) =", total_dead, "(printed summary 61,041)")
for k,v in D.items():
    print("  %-13s %6d = %.1f%%" % (k, sum(v), 100*sum(v)/total_dead))
overseas_dead = total_dead - sum(D["Frontier ops"])
print("overseas dead (excl frontier ops):", overseas_dead)
m = sum(D["Mesopotamia"]); f = sum(D["France"])
print("Mesopotamia dead / France dead = %.2f ; Mesopotamia share of overseas dead %.1f%%" % (m/f, 100*m/overseas_dead))
indian_ranks_followers = grand[3]+grand[4]
print("dead Indian ranks + followers (I.R.+Foll.):", indian_ranks_followers, " Indian officers (I.O.):", grand[1])

print("\n== D. Cross-source death totals (whose count, what basis)")
print("HMSO 1922 p.237 Table (i)(a), 'lost their lives' Indian (b): 904 officers + 61,152 other ranks =", 904+61152, "(printed 62,056); wounded 66,889; prisoners 11,070")
print("Govt of India 1923 p.177: dead from all causes 61,041; wounded 67,771; missing+prisoners 1,262; total 130,074 ->", 61041+67771+1262)
print("CWGC: ~74,000 Indian Army WW1 (blog 2025); 74,000 WW1 of 160,950 both wars (2018); 'National memorial to the 70,000 servicemen of Undivided India who died 1914-1921' (CWGC blog)")
print("difference CWGC 74,000 - HMSO 62,056 = %d ; - GoI 61,041 = %d" % (74000-62056, 74000-61041))

print("\n== E. India's Contribution 1923, p.278 'Recruitment by Provinces' (to the Armistice; British India provinces)")
P = {  # province: (combatants, non-combatants, total)
 "Madras": (51223,41117,92340), "Bombay": (41272,30211,71483), "Bengal": (7117,51935,59052),
 "United Provinces": (163578,117565,281143), "Punjab": (349688,97288,446976), "NWFP": (32181,13050,45231),
 "Baluchistan": (1761,327,2088), "Burma": (14094,4579,18673), "Bihar and Orissa": (8576,32976,41552),
 "Central Provinces": (5376,9631,15007), "Assam": (942,14182,15124), "Ajmer-Merwara": (7341,1632,8973)}
sc = sum(v[0] for v in P.values()); sn = sum(v[1] for v in P.values()); st = sum(v[2] for v in P.values())
print("sum combatants", sc, "(printed 683,149) | sum non-comb", sn, "(printed 414,493) | sum total", st, "(printed 1,097,642)")
print("Punjab share of combatants: %.1f%% | UP %.1f%% | Punjab+UP+NWFP %.1f%%" % (100*349688/683149, 100*163578/683149, 100*(349688+163578+32181)/683149))
print("Punjab combatants vs Bengal combatants: %.0f : 1 ; Bengal share of non-combatants %.1f%%" % (349688/7117, 100*51935/414493))
print("each row total equals its parts:", all(v[0]+v[1]==v[2] for v in P.values()))
print("Punjab share of ALL combatants incl. Indian States 115,891 (printed total 826,855): %.1f%%" % (100*349688/826855))
print("printed 'Total recruitment' incl 115,891 Indian States recruits: combatants 826,855; non-combatants 445,582; Nepal 58,904 separately")

print("\n== F. Census of India 1921 Vol I Part I, p.54-58 Subsidiary Table III (persons 1921), read from the scan (low-res; digits uncertain)")
C = {"Ajmer-Merwara":495271,"Andamans":27086,"Assam":7990246,"Baluchistan":790625,"Bengal":47592462,"Bihar and Orissa":37961858,
     "Bombay":26757648,"Burma":13212192,"Central Provinces and Berar":15970660,"Coorg":163838,"Delhi":488188,"Madras":42794155,
     "NWFP":5076476,"Punjab":25101060,"United Provinces":46510668}
s = sum(C.values()); print("sum of 15 province rows (incl. attached States per census note):", s)
print("Punjab share of those provinces' people: %.1f%%" % (100*C["Punjab"]/s))
print("(printed 'Provinces' row 270,950,433 -> %.1f%%; India incl. States 318,942,480 -> %.1f%%)" % (100*25101060/270950433, 100*25101060/318942480))
print("NOTE: the Census 'Punjab' row includes the Punjab States; the war recruitment table is 'Punjab' without saying so. Compare only as 'about a tenth'.")

print("\n== G. Great-circle distances (Natural Earth 10m populated places, haversine, km) - map notes only, NOT sea routes")
d = json.load(open('/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_populated_places_simple.geojson'))
want = {"Mumbai":None,"Karachi":None,"Marseille":None,"Basra":None,"Calcutta":None,"Kolkata":None,"Delhi":None,"Neuve-Chapelle":None,"Amritsar":None,"Lahore":None,"Mombasa":None,"Suez":None}
for ft in d["features"]:
    p = ft["properties"]; n = p.get("name")
    if n in want and want[n] is None: want[n] = ft["geometry"]["coordinates"]
    if p.get("nameascii") in want and want[p["nameascii"]] is None: want[p["nameascii"]] = ft["geometry"]["coordinates"]
print({k:v for k,v in want.items() if v})
def gc(a,b):
    R=6371.0088; la1,lo1,la2,lo2=map(math.radians,(a[1],a[0],b[1],b[0]))
    h=math.sin((la2-la1)/2)**2+math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
for a,b in (("Mumbai","Marseille"),("Karachi","Basra"),("Mumbai","Basra"),("Mumbai","Mombasa"),("Mumbai","Suez"),("Delhi","Marseille"),("Amritsar","Marseille")):
    if want.get(a) and want.get(b): print("  %s -> %s = %.0f km great-circle" % (a,b,gc(want[a],want[b])))
