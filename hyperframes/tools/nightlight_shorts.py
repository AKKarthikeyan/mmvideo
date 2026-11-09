"""Then vs Now Shorts (9:16): night lights 2012 vs 2016 for one state, from NASA Black Marble via GIBS.

usage: nightlight_shorts.py all | <State name> [<State name> ...]      e.g.  nightlight_shorts.py Maharashtra Karnataka Gujarat
Writes hyperframes/videos/nl-<slug>/{index.html, story.js, assets/img/y2012.jpg, y2016.jpg}. Then:
  python3 hyperframes/tools/hf.py sync videos      (fonts, libs)
  python3 hyperframes/tools/hf.py render nl-maharashtra     -> out/hyperframes/nl-maharashtra.mp4

Imagery: NASA GIBS layer VIIRS_Black_Marble, time=2012-01-01 and time=2016-01-01 (the only two years the layer serves),
web-mercator zoom 8 (about 0.55 km a pixel), public, no login. The two years are separate composites: the Short
compares patterns and says so on screen; do not turn the pictures into a brightness percentage.
Shapes: shared/geo/india_districts.js (community data: replace with Survey of India boundaries before publishing).
Correlations (CORR) are the RBI Bulletin, Oct 2026, Table 3 figures (total GSVA); only three states have one.
Tiles are cached in out/hyperframes/cache/gibs/. Needs Pillow and numpy.
"""
import json
import math
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "hyperframes" / "videos"
CACHE = ROOT / "out" / "hyperframes" / "cache" / "gibs"
URL = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/{y}-01-01/GoogleMapsCompatible_Level8/8/{r}/{c}.png"
Z = 8
WORLD = 256 * 2 ** Z
SIZE = 1400          # output square, px
DURATION = 18
YEARS = (2012, 2016)

# RBI Bulletin Oct 2026, Table 3: correlation of y-o-y quarterly night-light growth with total GSVA growth
CORR = {"Maharashtra": (0.90, "2012-13 to 2024-25"), "Karnataka": (0.79, "2012-13 to 2024-25"), "Gujarat": (0.66, "2012-13 to 2023-24")}
# a few well-known cities (lon, lat) so viewers can find their bearings
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
MIN_SIDE = 700  # world px at zoom 8 (about 400 km): tiny territories still get a readable picture


def wx(lon):
    return (lon + 180) / 360 * WORLD


def wy(lat):
    r = math.radians(lat)
    return (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * WORLD


def tile(year, c, r):
    f = CACHE / f"{year}_z{Z}_{c}_{r}.png"
    if not f.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "60", "--retry", "3", "-o", str(f), URL.format(y=year, r=r, c=c)], check=True)
    return Image.open(f).convert("RGB")


def picture(year, ox, oy, side):
    c0, c1, r0, r1 = int(ox // 256), int((ox + side) // 256), int(oy // 256), int((oy + side) // 256)
    big = Image.new("RGB", ((c1 - c0 + 1) * 256, (r1 - r0 + 1) * 256))
    jobs = [(c, r) for c in range(c0, c1 + 1) for r in range(r0, r1 + 1)]
    with ThreadPoolExecutor(6) as ex:
        for (c, r), im in zip(jobs, ex.map(lambda p: tile(year, *p), jobs)):
            big.paste(im, ((c - c0) * 256, (r - r0) * 256))
    ax, ay = ox - c0 * 256, oy - r0 * 256
    im = big.crop((round(ax), round(ay), round(ax + side), round(ay + side))).resize((SIZE, SIZE), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0  # same gamma lift for both years, nothing else
    return Image.fromarray((np.power(a, 0.7) * 255).astype(np.uint8))


def build(name, india):
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
    for y in YEARS:
        picture(y, ox, oy, side).save(d / "assets" / "img" / f"y{y}.jpg", quality=88)
    rings = [[round(v, 1) for i in range(0, len(r), 2) for v in ((wx(r[i]) - ox) * k, (wy(r[i + 1]) - oy) * k)] for dd in ds for r in dd["rings"]]
    dur = DURATION if name in CORR else 12   # no RBI card where the Bulletin has no figure
    story = {"name": name, "years": list(YEARS), "size": SIZE, "rings": rings, "duration": dur,
             "title": TITLES.get(name, name), "cities": [{"n": n, "x": round((wx(lo) - ox) * k, 1), "y": round((wy(la) - oy) * k, 1)} for n, lo, la in CITIES.get(name, [])]}
    if name in CORR:
        story["corr"], story["period"] = CORR[name]
    (d / "story.js").write_text("window.STORY = " + json.dumps(story, ensure_ascii=False, separators=(",", ":")) + ";\n")
    tpl = (VID / "_template_nl" / "index.html").read_text().replace("__DURATION__", str(dur))
    (d / "index.html").write_text(tpl)
    print(name, "->", d.relative_to(ROOT), f"{len(ds)} districts, {dur}s")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    names = sorted(CITIES) if sys.argv[1:] == ["all"] else sys.argv[1:]
    src = (ROOT / "hyperframes" / "shared" / "geo" / "india_districts.js").read_text()
    india = json.loads(src[src.index("{"):].rstrip().rstrip(";"))
    for n in names:
        build(n, india)
    print("hold until boundaries are checked:", ", ".join(sorted(HOLD & set(names))) or "none")


main()
