"""Export value by district of origin, per principal commodity, from the DGCIS Foreign Trade Data Dissemination Portal.

usage: dgcis_districts.py <from Mon-YYYY> <to Mon-YYYY> <PRINCIPAL COMMODITY> [...]
e.g.   dgcis_districts.py Apr-2025 Mar-2026 "POULTRY PRODUCTS" "SPICES"
Writes out/hyperframes/cache/district_exports.csv (state, district, commodity, value_crore, value_usd), replacing rows
for the commodities fetched and keeping the others. Uses the portal's guest "Export by State by District of Origin"
query (report type 6: state by district of origin by commodity, principal commodity level), the same request the
portal's own page makes. DGCIS compiles these from the district codes exporters report on shipping bills and does not
validate them. Needs ftddp.dgciskol.gov.in reachable.
"""
import csv
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "out" / "hyperframes" / "cache" / "district_exports.csv"
BASE = "https://ftddp.dgciskol.gov.in/dgcis"


def post(jar, endpoint):
    r = subprocess.run(["curl", "-sSf", "-m", "300", "-c", jar, "-b", jar, "-X", "POST", "-H", "X-Requested-With: XMLHttpRequest",
                        "-H", f"Referer: {BASE}/guestindex.html", f"{BASE}/{endpoint}"], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def main(frm, to, *names):
    with tempfile.TemporaryDirectory() as tmp:
        jar = str(Path(tmp) / "jar.txt")
        subprocess.run(["curl", "-sSf", "-m", "60", "-c", jar, "-o", "/dev/null", f"{BASE}/guestindex.html"], check=True)
        codes = {c["DESCRIPTION"].strip(): c["CODE"] for c in
                 post(jar, f"stateoforiginprincipalcommoditylist?datepicker={frm}&datepicker1={to}")["commoditylists"]}
        rows = []
        for name in names:
            if name not in codes:
                sys.exit(f"{name!r} is not a DGCIS principal commodity for {frm} to {to}")
            q = (f"gueststateoforiginsearch?datepicker={frm}&datepicker1={to}&principalcomodity={codes[name]}&countries=undefined"
                 f"&state=A&district=A&stated=&ports=undefined&offset=1&noOfRecords=10000&description=3&digites=undefined&type=6"
                 f"&scrollDate=&username=")
            d = post(jar, q)
            got = d.get("searchlists") or []
            if d.get("result") != "success" or len(got) != int(d.get("totalNoOfRecords", len(got))):
                sys.exit(f"{name}: incomplete answer ({len(got)} of {d.get('totalNoOfRecords')} rows)")
            for r in got:
                rows.append({"state": r["STATE"].strip(), "district": r["DISTRICT"].strip(), "commodity": name,
                             "value_crore": round(float(r["VALUE"]) / 1e7, 4), "value_usd": float(r["DVALUE"])})
            print(f"{name}: {len(got)} districts, ₹{sum(float(r['VALUE']) for r in got) / 1e7:,.1f} crore")
            time.sleep(3)
    keep = []
    if OUT.exists():
        keep = [r for r in csv.DictReader(OUT.open()) if r["commodity"] not in names]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["state", "district", "commodity", "value_crore", "value_usd"])
        w.writeheader()
        w.writerows(keep + rows)
    print(OUT, len(keep) + len(rows), "rows")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])
