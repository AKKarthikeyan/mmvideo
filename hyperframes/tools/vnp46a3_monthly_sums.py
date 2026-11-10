"""All-India monthly night-light totals from NASA Black Marble monthly tiles (VNP46A3, Suomi NPP), streamed.

usage: vnp46a3_monthly_sums.py <out.csv> <first YYYY-MM> <last YYYY-MM>       e.g.  vnp46a3_monthly_sums.py hyperframes/data/nightlight_india_monthly.csv 2012-04 2026-09
Per month: downloads the India tiles that contain land (11 of the 16 in h24-h27 x v05-v08; needs the same Earthdata token set-up as
vnp46a4_fetch.py), adds up AllAngle_Composite_Snow_Free radiance over all Indian state pixels (state shapes: shared/geo/india_districts.js,
raster built by vnp46a4_state_sums.py), counts the valid pixels (fill -999.9 is not valid), and deletes each tile. Months already in the csv
are skipped; months NASA has not published are noted and skipped.
Columns: year, month, sum_nw, n_valid, n_land.  Mean radiance of valid pixels = sum_nw / n_valid.
Needs h5py, numpy.
"""
import csv
import datetime as dt
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import h5py
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
TMP = ROOT / "out" / "hyperframes" / "cache" / "vnp46a3"
BASE = "https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content"
AUTH = ["-H", f"Authorization: Bearer {os.environ['LAADS_TOKEN']}"] if os.environ.get("LAADS_TOKEN") else []
LAYER = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/AllAngle_Composite_Snow_Free"
H, V = range(24, 28), range(5, 9)


def months(a, b):
    y, m = map(int, a.split("-")); y2, m2 = map(int, b.split("-"))
    while (y, m) <= (y2, m2):
        yield y, m
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)


def curl_json(url):
    r = subprocess.run(["curl", "-sf", "-m", "180", *AUTH, url], capture_output=True)
    return r.stdout if r.returncode == 0 else b""


def one(job):
    y, doy, name, size, ids = job
    h, v = map(int, re.search(r"\.h(\d\d)v(\d\d)\.", name).groups())
    path = TMP / f"{y}_{doy}_{h}_{v}.h5"
    path.parent.mkdir(parents=True, exist_ok=True)
    for _ in range(4):
        subprocess.run(["curl", "-sf", "-m", "900", "-C", "-", *AUTH, "-o", str(path), f"{BASE}/archives/allData/5200/VNP46A3/{y}/{doy}/{name}"])
        if path.exists() and path.stat().st_size == size:
            break
    else:
        raise RuntimeError(f"download failed: {name}")
    with h5py.File(path, "r") as h5:
        a = h5[LAYER][:]
    path.unlink()
    m = ids[(v - 5) * 2400:(v - 4) * 2400, (h - 24) * 2400:(h - 23) * 2400] > 0
    ok = m & (a >= 0)
    return float(a[ok].sum(dtype=np.float64)), int(ok.sum()), int(m.sum())


def main():
    import json
    out = Path(sys.argv[1])
    ids = np.load(ROOT / "out" / "hyperframes" / "cache" / "vnp46a4" / "state_ids.npy")
    keep = {(h, v) for h in H for v in V if (ids[(v - 5) * 2400:(v - 4) * 2400, (h - 24) * 2400:(h - 23) * 2400] > 0).any()}
    done = set()
    if out.exists():
        done = {(int(r["year"]), int(r["month"])) for r in csv.DictReader(out.open())}
    out.parent.mkdir(parents=True, exist_ok=True)
    new = not out.exists()
    with out.open("a", newline="") as fh:
        w = csv.writer(fh)
        if new:
            w.writerow(["year", "month", "sum_nw", "n_valid", "n_land"])
        for y, mo in months(sys.argv[2], sys.argv[3]):
            if (y, mo) in done:
                continue
            doy = f"{dt.date(y, mo, 1).timetuple().tm_yday:03d}"
            raw = curl_json(f"{BASE}/details/allData/5200/VNP46A3/{y}/{doy}")
            try:
                files = [(x["name"], int(x["size"])) for x in json.loads(raw)["content"]]
            except Exception:
                print(y, mo, "not published, skipped", flush=True)
                continue
            files = [(n, s) for n, s in files if tuple(map(int, re.search(r"\.h(\d\d)v(\d\d)\.", n).groups())) in keep]
            if len(files) != len(keep):
                print(y, mo, f"only {len(files)} of {len(keep)} tiles, skipped", flush=True)
                continue
            with ThreadPoolExecutor(4) as ex:
                res = list(ex.map(one, [(y, doy, n, s, ids) for n, s in files]))
            w.writerow([y, mo, f"{sum(r[0] for r in res):.1f}", sum(r[1] for r in res), sum(r[2] for r in res)])
            fh.flush()
            print(y, mo, "done", flush=True)


main()
