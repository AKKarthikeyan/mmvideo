"""Night-lights data for sample 16: NASA Black Marble tiles from GIBS, stitched, plus the district shapes of three states.

usage: gibs_nightlights.py <sample assets dir>
Writes <assets>/img/nightlights_india.jpg and <assets>/data/geo.js (window.NL = {...}).

Image: layer VIIRS_Black_Marble (NASA Black Marble, a single 2016 composite) from NASA GIBS, web-mercator tiles at zoom 7,
x 87..98, y 50..61 (about 67E to 98E, 6N to 36N). Public, no login. Tiles are cached in out/hyperframes/cache/gibs/.
The study in the RBI Bulletin (Oct 2026) used monthly VNP46A3 2012-2024, which needs a NASA Earthdata login; this
tool does not fetch it.
Shapes: shared/geo/india_districts.js (community data: replace with Survey of India boundaries before publishing).
Needs Pillow and numpy.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / "out" / "hyperframes" / "cache" / "gibs"
URL = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/default/GoogleMapsCompatible_Level8/7/{y}/{x}.png"
Z, X0, X1, Y0, Y1 = 7, 87, 98, 50, 61
STATES = ["Maharashtra", "Karnataka", "Gujarat"]


def tile(x, y):
    f = CACHE / f"{x}_{y}.png"
    if not f.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "60", "--retry", "3", "-o", str(f), URL.format(x=x, y=y)], check=True)
    return Image.open(f).convert("RGB")


def main():
    out = Path(sys.argv[1])
    (out / "img").mkdir(parents=True, exist_ok=True)
    (out / "data").mkdir(parents=True, exist_ok=True)
    n = X1 - X0 + 1
    big = Image.new("RGB", (n * 256, (Y1 - Y0 + 1) * 256))
    for x in range(X0, X1 + 1):
        for y in range(Y0, Y1 + 1):
            big.paste(tile(x, y), ((x - X0) * 256, (y - Y0) * 256))
    # lift the dim lights so they read on video: gamma 0.7, nothing else
    a = np.asarray(big).astype(np.float32) / 255.0
    big = Image.fromarray((np.power(a, 0.7) * 255).astype(np.uint8))
    big.save(out / "img" / "nightlights_india.jpg", quality=88)

    src = (ROOT / "hyperframes" / "shared" / "geo" / "india_districts.js").read_text()
    india = json.loads(src[src.index("{"):].rstrip().rstrip(";"))
    ds = [{"s": d["s"], "n": d["n"], "rings": d["rings"]} for d in india["districts"] if d["s"] in STATES]
    geo = {"z": Z, "x0": X0, "y0": Y0, "w": n * 256, "h": (Y1 - Y0 + 1) * 256, "states": STATES, "districts": ds}
    (out / "data" / "geo.js").write_text("window.NL = " + json.dumps(geo, separators=(",", ":")) + ";\n")
    print("districts", len(ds), "image", big.size)


main()
