# ia-inner-chariot-short: Indica Atlas × The Inner Chariot Short (9:16, 54 s, silent draft)

Why Rama and Sita's flight home took "Dussehra to Diwali": the route on an India map, three halts, Hanuman sent ahead,
then the numbers. Light sandal look, no slogans.

Data:
- India: `assets/geo/india_districts.js` (community district data, datta07/INDIAN-SHAPEFILES; synced by `hf.py sync`).
- Sri Lanka and neighbours: `land.js`, Natural Earth 50m land, from
  `python3 hyperframes/tools/region_land.py hyperframes/videos/ia-inner-chariot-short/land.js --box 40,-45,120,60`.
- Distances are computed on screen (haversine) from approximate site coordinates in `index.html` (SITES):
  straight Lanka–Ayodhya ≈ 2,100 km, route via Setu, Kishkindha, Prayag, Nandigrama ≈ 2,370 km (+ ≈ 270 km, 13%).
  Lanka = central Sri Lanka, Setu = Dhanushkodi, Kishkindha = Hampi, Bharadwaja's ashram = Prayagraj (tradition).

Before publishing:
- Replace the India outline with Survey of India boundaries (repo rule for India maps).
- Check the halts and wording against Yuddha Kanda 121–128 (Vibhishana's request, the Kishkindha stop, Bharadwaja,
  Hanuman to Bharata). The Kishkindha stop and the festival dates are labelled as tradition.
- Voice-over and music come from the normal build pipeline.
