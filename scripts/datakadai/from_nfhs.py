#!/usr/bin/env python3
"""Write a Map of the Day data.csv from an NFHS state fact-sheet CSV (columns: state, indicator, nfhs5_total,
nfhs4_total, as in github.com/pratapvardhan/NFHS-5). value = latest round, prev = previous round.
Usage: from_nfhs.py <states.csv> "<exact indicator text>" <episode id> [value column] [prev column]
"""
import csv, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
# NFHS state names -> india.json ids
IDS = {"India": "IN", "Andaman & Nicobar Islands": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR",
       "Assam": "AS", "Bihar": "BR", "Chandigarh": "CH", "Chhattisgarh": "CG",
       "Dadra & Nagar Haveli and Daman & Diu": "DH", "NCT Delhi": "DL", "Goa": "GA", "Gujarat": "GJ",
       "Haryana": "HR", "Himachal Pradesh": "HP", "Jammu & Kashmir": "JK", "Jharkhand": "JH", "Karnataka": "KA",
       "Kerala": "KL", "Ladakh": "LA", "Lakshadweep": "LD", "Madhya Pradesh": "MP", "Maharashtra": "MH",
       "Manipur": "MN", "Meghalaya": "ML", "Mizoram": "MZ", "Nagaland": "NL", "Odisha": "OD", "Puducherry": "PY",
       "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK", "Tamil Nadu": "TN", "Telangana": "TS", "Tripura": "TR",
       "Uttar Pradesh": "UP", "Uttarakhand": "UK", "West Bengal": "WB"}


def main(src, indicator, eid, vcol="nfhs5_total", pcol="nfhs4_total"):
    rows = [r for r in csv.DictReader(open(src)) if r["indicator"] == indicator]
    if not rows: sys.exit(f"no rows for indicator {indicator!r}")
    unknown = sorted({r["state"] for r in rows} - set(IDS))
    if unknown: sys.exit(f"unknown state names {unknown}")
    out = ROOT / "public" / "datakadai" / "maps" / eid; out.mkdir(parents=True, exist_ok=True)
    with open(out / "data.csv", "w", newline="") as f:
        w = csv.writer(f); w.writerow(["id", "name", "value", "prev"])
        for r in sorted(rows, key=lambda r: IDS[r["state"]]):
            w.writerow([IDS[r["state"]], r["state"], r[vcol].strip(), r[pcol].strip()])
    print(f"wrote {len(rows)} rows -> {(out / 'data.csv').relative_to(ROOT)}")


if __name__ == "__main__":
    if len(sys.argv) < 4: sys.exit(__doc__)
    main(*sys.argv[1:])
