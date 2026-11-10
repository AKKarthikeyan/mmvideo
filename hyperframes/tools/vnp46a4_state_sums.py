"""Per-state sum of night-light radiance for each year, from NASA Black Marble annual tiles (VNP46A4), streamed.

usage: vnp46a4_state_sums.py <out.csv> <year> [<year> ...]        e.g.  vnp46a4_state_sums.py hyperframes/data/nightlight_state_sums.csv 2012 2013 2014
For each year it takes the 16 India tiles (h24-h27 x v05-v08), downloads each one that is not already in the cache
(see vnp46a4_fetch.py; needs the same Earthdata token set-up), adds up AllAngle_Composite_Snow_Free radiance inside every
state's districts, and deletes the tile again if it had to download it. Rows already in the csv are skipped, so it can be
re-run. Columns: year, state, sum_nw (sum of radiance, nW/(cm^2 sr), fill treated as 0), lit_px (pixels >= 0.5).
State shapes: shared/geo/india_districts.js (community data). Needs h5py, Pillow, numpy.
"""
import csv
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import h5py
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / "out" / "hyperframes" / "cache" / "vnp46a4"
BASE = "https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content"
AUTH = ["-H", f"Authorization: Bearer {os.environ['LAADS_TOKEN']}"] if os.environ.get("LAADS_TOKEN") else []
LAYER = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/AllAngle_Composite_Snow_Free"
LON0, LAT1, SPAN, N = 60.0, 40.0, 40.0, 9600
H, V = range(24, 28), range(5, 9)


def state_raster(india):
    f = CACHE / "state_ids.npy"
    names = sorted({d["s"] for d in india["districts"] if d["s"] and "Islands" not in d["s"] or d["s"] == "Andaman And Nicobar Islands"})
    if f.exists():
        return np.load(f), names
    img = Image.new("L", (N, N), 0)
    dr = ImageDraw.Draw(img)
    for d in india["districts"]:
        if d["s"] in names:
            for r in d["rings"]:
                dr.polygon([((lo - LON0) / SPAN * N, (LAT1 - la) / SPAN * N) for lo, la in zip(r[0::2], r[1::2])], fill=names.index(d["s"]) + 1)
    ids = np.asarray(img)
    np.save(f, ids)
    return ids, names


def listing(year):
    out = subprocess.run(["curl", "-sf", "-m", "180", *AUTH, f"{BASE}/details/allData/5200/VNP46A4/{year}/001"], capture_output=True, check=True).stdout
    want = {f"h{h}v{v:02d}" for h in H for v in V}
    return [(x["name"], int(x["size"])) for x in json.loads(out)["content"] if x["name"].split(".")[2] in want]


def one(job):
    year, name, size, ids, ns = job
    path = CACHE / str(year) / name
    had = path.exists() and path.stat().st_size == size
    if not had:
        path.parent.mkdir(parents=True, exist_ok=True)
        for _ in range(4):
            subprocess.run(["curl", "-sf", "-m", "900", "-C", "-", *AUTH, "-o", str(path), f"{BASE}/archives/allData/5200/VNP46A4/{year}/001/{name}"])
            if path.exists() and path.stat().st_size == size:
                break
        else:
            raise RuntimeError(f"download failed: {name}")
    h, v = map(int, re.search(r"\.h(\d\d)v(\d\d)\.", name).groups())
    with h5py.File(path, "r") as h5:
        a = h5[LAYER][:]
    a[a < 0] = 0
    m = ids[(v - 5) * 2400:(v - 4) * 2400, (h - 24) * 2400:(h - 23) * 2400]
    s = np.bincount(m.ravel(), weights=a.ravel().astype(np.float64), minlength=ns + 1)
    c = np.bincount(m.ravel(), weights=(a.ravel() >= 0.5).astype(np.float64), minlength=ns + 1)
    if not had:
        path.unlink()
    return s, c


def main():
    out = Path(sys.argv[1])
    years = [int(y) for y in sys.argv[2:]]
    src = (ROOT / "hyperframes" / "shared" / "geo" / "india_districts.js").read_text()
    india = json.loads(src[src.index("{"):].rstrip().rstrip(";"))
    ids, names = state_raster(india)
    done = set()
    if out.exists():
        done = {(int(r["year"])) for r in csv.DictReader(out.open())}
    out.parent.mkdir(parents=True, exist_ok=True)
    new = not out.exists()
    with out.open("a", newline="") as fh:
        w = csv.writer(fh)
        if new:
            w.writerow(["year", "state", "sum_nw", "lit_px"])
        for y in years:
            if y in done:
                continue
            files = listing(y)
            with ThreadPoolExecutor(4) as ex:
                res = list(ex.map(one, [(y, n, s, ids, len(names)) for n, s in files]))
            tot = sum(r[0] for r in res)
            cnt = sum(r[1] for r in res)
            for i, nm in enumerate(names, 1):
                w.writerow([y, nm, f"{tot[i]:.1f}", int(cnt[i])])
            fh.flush()
            print(y, "done", len(files), "tiles", flush=True)


main()
