"""Then vs Now Shorts (9:16): night lights 2012 vs 2016 for one state, from NASA Black Marble via GIBS.

usage: nightlight_shorts.py <State name> [<State name> ...]      e.g.  nightlight_shorts.py Maharashtra Karnataka Gujarat
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
    "Maharashtra": [("Mumbai", 72.88, 19.08), ("Pune", 73.86, 18.52), ("Nagpur", 79.09, 21.15)],
    "Karnataka": [("Bengaluru", 77.59, 12.97), ("Mysuru", 76.64, 12.30), ("Hubballi", 75.12, 15.36)],
    "Gujarat": [("Ahmedabad", 72.57, 23.02), ("Surat", 72.83, 21.17), ("Rajkot", 70.80, 22.30)],
}


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
    ox, oy = (min(xs) + max(xs)) / 2 - side / 2, (min(ys) + max(ys)) / 2 - side / 2
    k = SIZE / side
    slug = name.lower().replace(" ", "-")
    d = VID / f"nl-{slug}"
    (d / "assets" / "img").mkdir(parents=True, exist_ok=True)
    for y in YEARS:
        picture(y, ox, oy, side).save(d / "assets" / "img" / f"y{y}.jpg", quality=88)
    rings = [[round(v, 1) for i in range(0, len(r), 2) for v in ((wx(r[i]) - ox) * k, (wy(r[i + 1]) - oy) * k)] for dd in ds for r in dd["rings"]]
    story = {"name": name, "years": list(YEARS), "size": SIZE, "rings": rings, "duration": DURATION,
             "cities": [{"n": n, "x": round((wx(lo) - ox) * k, 1), "y": round((wy(la) - oy) * k, 1)} for n, lo, la in CITIES.get(name, [])]}
    if name in CORR:
        story["corr"], story["period"] = CORR[name]
    (d / "story.js").write_text("window.STORY = " + json.dumps(story, ensure_ascii=False, separators=(",", ":")) + ";\n")
    tpl = (VID / "_template_nl" / "index.html").read_text().replace("__DURATION__", str(DURATION))
    (d / "index.html").write_text(tpl)
    print(name, "->", d.relative_to(ROOT), f"side {side * 0.5 * 2 / 256:.1f} tiles-ish, {len(ds)} districts")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = (ROOT / "hyperframes" / "shared" / "geo" / "india_districts.js").read_text()
    india = json.loads(src[src.index("{"):].rstrip().rstrip(";"))
    for n in sys.argv[1:]:
        build(n, india)


main()
