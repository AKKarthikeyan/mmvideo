"""Then vs Now Shorts (9:16): night lights 2012 vs 2025 for one state, from NASA Black Marble annual composites.

usage: nightlight_shorts.py all | <State name> [<State name> ...]      e.g.  nightlight_shorts.py Maharashtra Karnataka Gujarat
Needs the tiles from vnp46a4_fetch.py 2012 2025 (NASA Earthdata token). Then for each state writes
hyperframes/videos/nl-<slug>/{index.html, story.js, assets/img/y2012.jpg, y2025.jpg}, and:
  python3 hyperframes/tools/hf.py sync nl-maharashtra ...
  python3 hyperframes/tools/hf.py render nl-maharashtra ...     -> out/hyperframes/nl-maharashtra.mp4

Data: NASA Black Marble VNP46A4 (collection 2, Suomi NPP, annual), layer AllAngle_Composite_Snow_Free, nW/(cm^2 sr),
15 arcsecond grid: same product and same colour scale for both years. The Short shows the pictures only: NO total-light
percentage. Checked on tile h25v07 (10-20N, 70-80E): Suomi NPP total radiance is flat 2012-2018 (about 2.8 M), then steps up
2021-2023 (3.5 -> 5.6 M) and reads about 20% above NOAA-20 (VJ146A4) by 2024 (5.8 M vs 4.75 M); NOAA-20 shows steady growth,
about +70% 2018-2024. So lights have grown, but the size of the change depends on the satellite, and a figure like "+139%"
would not be defensible. Read the pattern, not the exact brightness.
Shapes: shared/geo/india_districts.js (community data: replace with Survey of India boundaries before publishing).
RBI correlations (CORR): RBI Bulletin, Oct 2026, Table 3 (total GSVA); only three states have one.
The mosaics are cached in out/hyperframes/cache/vnp46a4/. Needs h5py, scipy, Pillow, numpy.
"""
import json
import math
import re
import sys
from pathlib import Path

import h5py
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "hyperframes" / "videos"
TILES = ROOT / "out" / "hyperframes" / "cache" / "vnp46a4"
LAYER = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/AllAngle_Composite_Snow_Free"
YEARS = (2012, 2025)
LON0, LAT1, SPAN = 60.0, 40.0, 40.0   # mosaic covers 60-100E, 0-40N
N = 9600                              # 4 tiles x 2400
Z = 8
WORLD = 256 * 2 ** Z
SIZE = 1400          # output square, px
MIN_SIDE = 700       # world px (about 400 km): tiny territories still get a readable picture
DUR_BASE, DUR_RBI = 12, 18

# RBI Bulletin Oct 2026, Table 3: correlation of y-o-y quarterly night-light growth with total GSVA growth
CORR = {"Maharashtra": (0.90, "2012-13 to 2024-25"), "Karnataka": (0.79, "2012-13 to 2024-25"), "Gujarat": (0.66, "2012-13 to 2023-24")}
CITIES = {
    "Andaman And Nicobar Islands": [("Port Blair", 92.74, 11.62)],
    "Andhra Pradesh": [("Visakhapatnam", 83.22, 17.69), ("Vijayawada", 80.65, 16.51), ("Tirupati", 79.42, 13.63)],
    "Arunachal Pradesh": [("Itanagar", 93.62, 27.08), ("Tawang", 91.86, 27.59), ("Pasighat", 95.33, 28.07)],
    "Assam": [("Guwahati", 91.74, 26.14), ("Dibrugarh", 94.91, 27.47), ("Silchar", 92.80, 24.83)],
    "Bihar": [("Patna", 85.14, 25.59), ("Gaya", 85.00, 24.80), ("Bhagalpur", 87.00, 25.24)],
    "Chandigarh": [("Chandigarh", 76.78, 30.73)],
    "Chhattisgarh": [("Raipur", 81.63, 21.25), ("Bilaspur", 82.15, 22.08), ("Bhilai", 81.38, 21.21)],
    "Dadra & Nagar Haveli & Daman & Diu": [("Silvassa", 73.02, 20.27), ("Daman", 72.83, 20.40), ("Diu", 71.00, 20.71)],
    "Delhi": [("Delhi", 77.21, 28.61)],
    "Goa": [("Panaji", 73.83, 15.50), ("Margao", 73.95, 15.27)],
    "Gujarat": [("Ahmedabad", 72.57, 23.02), ("Surat", 72.83, 21.17), ("Rajkot", 70.80, 22.30)],
    "Haryana": [("Gurugram", 77.03, 28.46), ("Faridabad", 77.31, 28.41), ("Hisar", 75.72, 29.15)],
    "Himachal Pradesh": [("Shimla", 77.17, 31.10), ("Dharamshala", 76.32, 32.22), ("Manali", 77.19, 32.24)],
    "Jammu And Kashmir": [("Srinagar", 74.80, 34.08), ("Jammu", 74.86, 32.73)],
    "Jharkhand": [("Ranchi", 85.33, 23.34), ("Jamshedpur", 86.20, 22.80), ("Dhanbad", 86.43, 23.80)],
    "Karnataka": [("Bengaluru", 77.59, 12.97), ("Mysuru", 76.64, 12.30), ("Hubballi", 75.12, 15.36)],
    "Kerala": [("Thiruvananthapuram", 76.94, 8.52), ("Kochi", 76.27, 9.93), ("Kozhikode", 75.78, 11.26)],
    "Ladakh": [("Leh", 77.58, 34.16), ("Kargil", 76.13, 34.56)],
    "Lakshadweep": [("Kavaratti", 72.64, 10.57)],
    "Madhya Pradesh": [("Bhopal", 77.41, 23.26), ("Indore", 75.86, 22.72), ("Jabalpur", 79.94, 23.18)],
    "Maharashtra": [("Mumbai", 72.88, 19.08), ("Pune", 73.86, 18.52), ("Nagpur", 79.09, 21.15)],
    "Manipur": [("Imphal", 93.94, 24.82), ("Churachandpur", 93.67, 24.33)],
    "Meghalaya": [("Shillong", 91.88, 25.57), ("Tura", 90.21, 25.51)],
    "Mizoram": [("Aizawl", 92.72, 23.73), ("Lunglei", 92.75, 22.89)],
    "Nagaland": [("Kohima", 94.11, 25.67), ("Dimapur", 93.73, 25.91)],
    "Odisha": [("Bhubaneswar", 85.82, 20.30), ("Cuttack", 85.88, 20.46), ("Rourkela", 84.85, 22.26)],
    "Puducherry": [("Puducherry", 79.83, 11.93), ("Karaikal", 79.84, 10.92)],
    "Punjab": [("Ludhiana", 75.86, 30.90), ("Amritsar", 74.87, 31.63), ("Jalandhar", 75.58, 31.33)],
    "Rajasthan": [("Jaipur", 75.79, 26.91), ("Jodhpur", 73.02, 26.24), ("Udaipur", 73.71, 24.59)],
    "Sikkim": [("Gangtok", 88.61, 27.33), ("Namchi", 88.36, 27.17)],
    "Tamil Nadu": [("Chennai", 80.27, 13.08), ("Coimbatore", 76.96, 11.02), ("Madurai", 78.12, 9.92)],
    "Telangana": [("Hyderabad", 78.49, 17.39), ("Warangal", 79.59, 17.97), ("Nizamabad", 78.10, 18.67)],
    "Tripura": [("Agartala", 91.28, 23.83), ("Dharmanagar", 92.17, 24.37)],
    "Uttar Pradesh": [("Lucknow", 80.95, 26.85), ("Kanpur", 80.35, 26.45), ("Varanasi", 82.97, 25.32)],
    "Uttarakhand": [("Dehradun", 78.03, 30.32), ("Haridwar", 78.16, 29.95), ("Haldwani", 79.52, 29.22)],
    "West Bengal": [("Kolkata", 88.36, 22.57), ("Siliguri", 88.43, 26.72), ("Asansol", 86.98, 23.68)],
}
# shorter on-screen names for the long ones
TITLES = {"Andaman And Nicobar Islands": "Andaman & Nicobar", "Jammu And Kashmir": "Jammu & Kashmir",
          "Dadra & Nagar Haveli & Daman & Diu": "DNH & Daman & Diu"}
# boundary data for these two is community data and must be checked against Survey of India before publishing
HOLD = {"Jammu And Kashmir", "Ladakh"}

# one colour scale for both years: log stretch of radiance, then a warm lights ramp
STOPS = [0.0, 0.15, 0.35, 0.60, 0.85, 1.0]
RAMP = np.array([(3, 5, 9), (20, 26, 58), (120, 84, 70), (232, 160, 72), (255, 214, 140), (255, 250, 235)], np.float32)


def wx(lon):
    return (lon + 180) / 360 * WORLD


def wy(lat):
    r = math.radians(lat)
    return (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * WORLD


def mosaic(year):
    """Radiance for 60-100E x 0-40N as one (9600, 9600) array, row 0 = 40N, column 0 = 60E. Missing tiles and fill are 0."""
    f = TILES / f"mosaic_{year}.npy"
    if f.exists():
        return np.load(f, mmap_mode="r")
    m = np.zeros((N, N), np.float32)
    files = sorted((TILES / str(year)).glob("*.h5"))
    if not files:
        sys.exit(f"no tiles for {year}: run vnp46a4_fetch.py {year}")
    for p in files:
        h, v = map(int, re.search(r"\.h(\d\d)v(\d\d)\.", p.name).groups())
        with h5py.File(p, "r") as h5:
            a = h5[LAYER][:]
        a[a < 0] = 0
        m[(v - 5) * 2400:(v - 4) * 2400, (h - 24) * 2400:(h - 23) * 2400] = a
    np.save(f, m)
    return np.load(f, mmap_mode="r")


def colour(r):
    v = np.clip(np.log1p(r / 0.4) / math.log1p(80 / 0.4), 0, 1)
    return np.stack([np.interp(v, STOPS, RAMP[:, c]) for c in range(3)], -1).astype(np.uint8)


def picture(m, ox, oy, side):
    """Web-mercator square (ox, oy, side in zoom-8 world px) resampled from the lat/lon mosaic, coloured."""
    t = (np.arange(SIZE) + 0.5) / SIZE
    xs, ys = ox + t * side, oy + t * side
    lon = xs / WORLD * 360 - 180
    lat = np.degrees(np.arctan(np.sinh(math.pi * (1 - 2 * ys / WORLD))))
    cols = (lon - LON0) / SPAN * N - 0.5
    rows = (LAT1 - lat) / SPAN * N - 0.5
    r0, r1 = max(int(rows.min()) - 2, 0), min(int(rows.max()) + 3, N)
    c0, c1 = max(int(cols.min()) - 2, 0), min(int(cols.max()) + 3, N)
    win = np.asarray(m[r0:r1, c0:c1])
    rr, cc = np.meshgrid(rows - r0, cols - c0, indexing="ij")
    out = map_coordinates(win, [rr, cc], order=1, mode="constant", cval=0.0)
    return Image.fromarray(colour(out))


def build(name, india, ms):
    ds = [d for d in india["districts"] if d["s"] == name]
    if not ds:
        sys.exit(f"no districts for {name}")
    xs = [wx(r[i]) for d in ds for r in d["rings"] for i in range(0, len(r), 2)]
    ys = [wy(r[i + 1]) for d in ds for r in d["rings"] for i in range(0, len(r), 2)]
    side = max(max(xs) - min(xs), max(ys) - min(ys)) * 1.14
    side = max(side, MIN_SIDE)
    ox, oy = (min(xs) + max(xs)) / 2 - side / 2, (min(ys) + max(ys)) / 2 - side / 2
    k = SIZE / side
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    d = VID / f"nl-{slug}"
    (d / "assets" / "img").mkdir(parents=True, exist_ok=True)
    for old in (d / "assets" / "img").glob("y*.jpg"):
        old.unlink()
    for y, m in zip(YEARS, ms):
        picture(m, ox, oy, side).save(d / "assets" / "img" / f"y{y}.jpg", quality=88)
    rings = [[round(v, 1) for i in range(0, len(r), 2) for v in ((wx(r[i]) - ox) * k, (wy(r[i + 1]) - oy) * k)] for dd in ds for r in dd["rings"]]
    dur = DUR_RBI if name in CORR else DUR_BASE
    story = {"name": name, "title": TITLES.get(name, name), "years": list(YEARS), "size": SIZE, "rings": rings, "duration": dur,
             "cities": [{"n": n, "x": round((wx(lo) - ox) * k, 1), "y": round((wy(la) - oy) * k, 1)} for n, lo, la in CITIES.get(name, [])]}
    if name in CORR:
        story["corr"], story["period"] = CORR[name]
    (d / "story.js").write_text("window.STORY = " + json.dumps(story, ensure_ascii=False, separators=(",", ":")) + ";\n")
    (d / "index.html").write_text((VID / "_template_nl" / "index.html").read_text()
        .replace("__DURATION__", str(dur)).replace("__Y0__", str(YEARS[0])).replace("__Y1__", str(YEARS[1])))
    print(f"{name:36s} {len(ds):3d} districts, {dur}s", flush=True)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    names = sorted(CITIES) if sys.argv[1:] == ["all"] else sys.argv[1:]
    src = (ROOT / "hyperframes" / "shared" / "geo" / "india_districts.js").read_text()
    india = json.loads(src[src.index("{"):].rstrip().rstrip(";"))
    ms = [mosaic(y) for y in YEARS]
    for n in names:
        build(n, india, ms)
    print("hold until boundaries are checked:", ", ".join(sorted(HOLD & set(names))) or "none")


main()
