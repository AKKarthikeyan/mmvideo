# TP01 distances (Rule 2.2) - status: NOT CLEARED, no official point coordinates reached

Opened 30 Oct 2026: tiruppur.nic.in and coimbatore.nic.in (about-district, how-to-reach, district-profile) give no point coordinates; erode.nic.in gives only a district bounding box (10 36'-11 58' N, 76 49'-77 58' E). ntadcl.com returned 406 (blocked); cochinport.gov.in returned an empty page. Bhuvan / Survey of India / Natural Earth were not opened. So no coordinate of record exists yet.
distances.py uses approximate finding-aid coordinates (Wikipedia, entered from memory, not opened) and its output is INDICATIVE ONLY. Replace them with official coordinates before any figure goes on screen.

| Item | Beat | Figure in script | Kind | Measured (indicative, straight line) | Suggested on-screen wording |
|---|---|---|---|---|---|
| Tiruppur to Coimbatore | t23 | 53 (MIDS) / 55 (Textile Commr) / 60 (UNIDO) km, note says "say nearby" | road figures, copied | 43.3 km | "about 45 km in a straight line" (after official coords); keep "nearby" until then |
| Pipeline length | t63 | 53 km (CAP ~53.5 km main) | owner's document (NTADCL) only; not measurable | intake not located; Tiruppur to confluence straight line 52.8 km, so a ~53 km pipe cannot reach the confluence in a straight line unless the intake is nearer. Check this | "53 km pipeline (NTADCL)"; map line stays "route illustrative" |
| Tanker haul | t62 | up to 50 km | source claim; not measurable | none | "tankers up to 50 km (as reported)" |
| Organisers cycled | t52 | 20-22 km | testimony; not measurable | none | attribute to Subbarayan |
| CFS from town | t64 | ~10 km (2015) | TEA claim, road; not measurable | none | "about 10 km (TEA)" |
| TEKIC from town | t66 | 8 km | source claim; not measurable | none | "8 km out (as stated)" |
| Nearest sea / ports | t64 | no distance said; Cochin named | measurable | Cochin 172.9, Tuticorin 277.2, Chennai 389.9 km | "no seaport; Cochin about 170 km in a straight line" |
| Areas | t66, t71 | 220 acres, 100 acres (TEKIC), 20,000 ha (Orathupalayam dam, "to irrigate") | documents' own figures | not measurable | attribute |

Coordinate sources (all finding aid, not of record): Wikipedia infoboxes for Tiruppur, Coimbatore, Bhavani, Port of Cochin, V.O.C. Port, Chennai Port. Missing and needed: NTADCL intake and plant (ask NTADCL / TWAD), port authority or Bhuvan points, Tiruppur and Coimbatore from Bhuvan or Census.
Straight-line differs from road length (roads usually longer) and from pipeline length.

## Correction (30 Oct 2026, main session)
The first run used Wikipedia coordinates typed from memory, which breaks Rule 0. The towns and ports now use **Natural Earth 10m populated places** (P1, the local file `MMVideo/sources/geo/ne_10m_populated_places_simple.geojson`). The port figures are measured to the city points, not the berths, so on screen they should say "about". The Bhavani–Cauvery confluence is still a finding-aid point. The 53 km pipeline length can only come from NTADCL's own document (G7, open). `distances_output.txt` above has been replaced by the re-run.
