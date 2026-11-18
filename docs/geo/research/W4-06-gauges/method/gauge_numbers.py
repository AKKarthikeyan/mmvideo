# W4-06 gauges: arithmetic from official figures. Run: python3 -I gauge_numbers.py > gauge_numbers_output.txt
# Inputs copied from sources/ (S01 MoSPI Statistical Year Book ch.19; S02 PIB 15 Apr 2026).
import json, math
G = '/Volumes/DarwinSSD/MMVideo/sources/geo/'
gauges_mm = {'broad': 1676, 'metre': 1000, 'narrow_a': 762, 'narrow_b': 610}   # S01: 1.676m, 1.000m, 0.762m, 0.610m
print('distinct track widths in the official classification:', len(set(gauges_mm.values())), '(in 3 classes: broad, metre, narrow)')
print('broad / narrowest = %.2f' % (gauges_mm['broad']/gauges_mm['narrow_b']))
print('broad - narrowest = %d mm' % (gauges_mm['broad']-gauges_mm['narrow_b']))
print('broad / metre = %.2f ; broad - metre = %d mm' % (gauges_mm['broad']/gauges_mm['metre'], gauges_mm['broad']-gauges_mm['metre']))
# S01 file B, as on 31 March 2010 (route km)
bg, mg, ng, tot = 54257, 7180, 2537, 63974
print('2010 check sum BG+MG+NG = %d (stated total %d, diff %d)' % (bg+mg+ng, tot, bg+mg+ng-tot))
for n, v in (('BG', bg), ('MG', mg), ('NG', ng)):
    print('2010 share %s = %.1f%% (1 km in %.1f)' % (n, 100*v/tot, tot/v))
print('2010 non-broad route km = %d (%.1f%%)' % (mg+ng, 100*(mg+ng)/tot))
# S01 file A: share 72% (2002-03) -> 88% (2013-14), 88.4% of route as on 31.03.2014, total 65,808 km
t14 = 65808
print('2014: 88.4%% of %d = %.0f km broad; non-broad = %.0f km (derived, rounded share)' % (t14, .884*t14, (1-.884)*t14))
print('share gain 2002-03 to 2013-14 = %d points in 11 years' % (88-72))
# S02: 70,142 broad gauge route km (March 2026); growth vs 2010 broad figure (different publishers, same owner of numbers)
print('broad route km 2010 -> Mar 2026: %d -> 70142 = +%d km (+%.0f%%)' % (bg, 70142-bg, 100*(70142-bg)/bg))
print('years since Project Unigauge launch (1 Apr 1992) to 15 Nov 2026: %d' % (2026-1992))
try:
    want = ('Darjiling', 'Darjeeling', 'Shimla', 'Simla', 'Udagamandalam', 'Udhagamandalam', 'Ooty', 'Coimbatore', 'Siliguri', 'Chandigarh', 'Mumbai', 'Thane')
    for f in json.load(open(G+'ne_10m_populated_places_simple.geojson'))['features']:
        p = f['properties']
        if p['name'] in want and p.get('adm0name') == 'India':
            print('NE place', p['name'], [round(c, 3) for c in f['geometry']['coordinates']])
except Exception as e:
    print('NE places not read:', e)
