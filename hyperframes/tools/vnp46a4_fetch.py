"""Download NASA Black Marble annual night lights (VNP46A4, collection 2) tiles that cover India.

usage: vnp46a4_fetch.py <year> [<year> ...]        e.g.  vnp46a4_fetch.py 2012 2025
Tiles h24-h27 x v05-v08 (60E-100E, 0N-40N), about 130 MB each, into out/hyperframes/cache/vnp46a4/<year>/.
Needs a NASA Earthdata user token that the network proxy adds to requests for ladsweb.modaps.eosdis.nasa.gov (in this
cloud environment: request_credential for that host; elsewhere an Authorization: Bearer header via LAADS_TOKEN).
Files already complete are skipped; partial ones resume.
"""
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / "out" / "hyperframes" / "cache" / "vnp46a4"
BASE = "https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content"
H, V = range(24, 28), range(5, 9)
AUTH = ["-H", f"Authorization: Bearer {os.environ['LAADS_TOKEN']}"] if os.environ.get("LAADS_TOKEN") else []


def listing(year):
    out = subprocess.run(["curl", "-sf", "-m", "120", *AUTH, f"{BASE}/details/allData/5200/VNP46A4/{year}/001"], capture_output=True, check=True).stdout
    return {x["name"]: int(x["size"]) for x in json.loads(out)["content"]}


def fetch(job):
    year, name, size = job
    dst = CACHE / str(year) / name
    if dst.exists() and dst.stat().st_size == size:
        return name, "have"
    dst.parent.mkdir(parents=True, exist_ok=True)
    for _ in range(4):
        subprocess.run(["curl", "-sf", "-m", "900", "-C", "-", *AUTH, "-o", str(dst), f"{BASE}/archives/allData/5200/VNP46A4/{year}/001/{name}"])
        if dst.exists() and dst.stat().st_size == size:
            return name, "ok"
    return name, f"FAILED ({dst.stat().st_size if dst.exists() else 0} of {size} bytes)"


def main():
    jobs = []
    for y in sys.argv[1:]:
        files = listing(y)
        want = {f"h{h}v{v:02d}" for h in H for v in V}
        jobs += [(y, n, s) for n, s in sorted(files.items()) if n.split(".")[2] in want]
    print(len(jobs), "tiles", flush=True)
    with ThreadPoolExecutor(4) as ex:
        for name, st in ex.map(fetch, jobs):
            print(name, st, flush=True)


main()
