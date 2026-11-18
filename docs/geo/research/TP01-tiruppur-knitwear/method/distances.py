"""TP01 distances. stdlib only. Haversine, WGS84 mean radius 6371.0088 km.
STATUS: no official point coordinate was reachable on 30 Oct 2026 (see distances.md).
Coordinates below are FINDING-AID values (approximate, entered from reference knowledge,
NOT opened from a source and NOT of record). Output is INDICATIVE ONLY until replaced by
official coordinates (Bhuvan / Survey of India / port authority / NTADCL)."""
from math import radians, sin, cos, asin, sqrt
R = 6371.0088
# name: (lat, lon, source_url, locator, of_record)
P = {
 "Tiruppur (town)": (11.080421, 77.329998, "Natural Earth ne_10m_populated_places_simple (P1), local MMVideo/sources/geo/ne_10m_populated_places_simple.geojson", "name=Tiruppur", True),
 "Coimbatore (city)": (11.001906, 76.948075, "Natural Earth ne_10m_populated_places_simple (P1), local MMVideo/sources/geo/ne_10m_populated_places_simple.geojson", "name=Coimbatore", True),
 "Bhavani-Cauvery confluence (Kooduthurai)": (11.4450, 77.6830, "finding aid: en.wikipedia.org/wiki/Bhavani,_Tamil_Nadu", "approx; NTADCL intake NOT located", False),
 "Cochin port (Willingdon Is.)": (10.016953, 76.22197, "Natural Earth ne_10m_populated_places_simple (P1), local MMVideo/sources/geo/ne_10m_populated_places_simple.geojson", "name=Kochi (city point, not the berth)", True),
 "Tuticorin (V.O.C.) port": (8.7978, 78.131797, "Natural Earth ne_10m_populated_places_simple (P1), local MMVideo/sources/geo/ne_10m_populated_places_simple.geojson", "name=Tuticorin (city point, not the berth)", True),
 "Chennai port": (13.091934, 80.278053, "Natural Earth ne_10m_populated_places_simple (P1), local MMVideo/sources/geo/ne_10m_populated_places_simple.geojson", "name=Chennai (city point, not the berth)", True),
}
def hav(a, b):
    la1, lo1, la2, lo2 = map(radians, (a[0], a[1], b[0], b[1]))
    h = sin((la2-la1)/2)**2 + cos(la1)*cos(la2)*sin((lo2-lo1)/2)**2
    return 2*R*asin(sqrt(h))
PAIRS = [("Tiruppur (town)","Coimbatore (city)"),
         ("Tiruppur (town)","Bhavani-Cauvery confluence (Kooduthurai)"),
         ("Tiruppur (town)","Cochin port (Willingdon Is.)"),
         ("Tiruppur (town)","Tuticorin (V.O.C.) port"),
         ("Tiruppur (town)","Chennai port")]
if __name__ == "__main__":
    print("Coordinates of record: Natural Earth 10m populated places (P1). The confluence point is a finding aid only. Great-circle, R=%.4f km" % R)
    for a, b in PAIRS:
        print("%-42s -> %-42s %7.1f km straight line" % (a, b, hav(P[a][:2], P[b][:2])))
