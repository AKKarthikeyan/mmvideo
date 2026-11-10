"""Annual correlation of night-light growth with state economic growth, for every state with data. OUR calculation, not the RBI's.

usage: nightlight_nsdp_corr.py            (needs hyperframes/data/nightlight_state_sums.csv from vnp46a4_state_sums.py 2012..2024)
Writes hyperframes/data/nightlight_nsdp_corr.csv and prints a table.

Economy: Net State Domestic Product at constant (2011-12) prices, RBI Handbook of Statistics on the Indian Economy, Table 6
(source NSO), https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23180, base-year-2011-12 block, fiscal years 2011-12 to 2023-24.
Lights: sum of NASA Black Marble annual radiance (VNP46A4, Suomi NPP) inside the state, calendar years 2012-2024.
Method (fixed before looking at results): correlate year-on-year growth of lights with year-on-year growth of NSDP.
  A      lights growth in calendar year Y vs NSDP growth FY Y to Y+1 (9 of 12 months overlap), Y = 2013..2023
  A-excl A without Y = 2022 and 2023 (the Suomi NPP series steps up in 2021-23, see README)
  rank   Spearman correlation of A
  B      lights growth in Y vs NSDP growth FY Y-1 to Y (3 months overlap), Y = 2013..2024
A state "holds up" only if A, A-excl, rank and B all have the same sign and |A - A-excl| <= 0.25. Jammu & Kashmir is left
out (Ladakh was split off in 2019, and its boundaries are on hold). With 11-12 yearly points a correlation needs about
0.58 to 0.60 to be significant at 5%, and with about 32 states some will pass by chance.
Needs numpy, scipy.
"""
import csv
import html
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from scipy.stats import pearsonr, spearmanr

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "hyperframes" / "data"
URL = "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23180"
FIX = {"Jammu & Kashmir": "Jammu And Kashmir", "Andaman & Nicobar Islands": "Andaman And Nicobar Islands"}
SKIP = {"Jammu & Kashmir"}


def nsdp():
    page = subprocess.run(["curl", "-sSL", "-m", "60", "-A", "Mozilla/5.0", URL], capture_output=True, check=True).stdout.decode("utf8", "ignore")
    data, hdr, base = {}, None, None
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", re.sub(r"<script.*?</script>", "", page, flags=re.S), flags=re.S):
        c = [html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", x))).strip() for x in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, flags=re.S)]
        if not c:
            continue
        if c[0] == "Year":
            hdr, base = c[1:], None
        elif (m := re.match(r"\(Base Year : (.+)\)", c[0])):
            base = m.group(1)
        elif hdr and base == "2011-12" and re.match(r"^\d{4}-\d{2}$", c[0]) and len(c) == len(hdr) + 1:
            for st, v in zip(hdr, c[1:]):
                v = v.replace(",", "")
                if re.match(r"^\d+(\.\d+)?$", v):
                    data.setdefault(st, {})[int(c[0][:4])] = float(v)
    return data


def main():
    N = nsdp()
    L = {}
    for r in csv.DictReader((DATA / "nightlight_state_sums.csv").open()):
        L.setdefault(r["state"], {})[int(r["year"])] = float(r["sum_nw"])
    out = []
    for st in sorted(N):
        ls = FIX.get(st, st)
        if st in SKIP or ls not in L:
            continue
        l, n = L[ls], N[st]

        def pair(shift, drop=()):
            ys = [Y for Y in range(2013, 2025) if Y not in drop and Y - 1 in l and Y in l and l[Y - 1] > 0 and Y + shift in n and Y + shift - 1 in n]
            return (np.array([l[Y] / l[Y - 1] - 1 for Y in ys]), np.array([n[Y + shift] / n[Y + shift - 1] - 1 for Y in ys]))

        a = pair(0); e = pair(0, (2022, 2023)); b = pair(-1)
        rA, pA = pearsonr(*a); rE = pearsonr(*e)[0]; rS = spearmanr(*a)[0]; rB = pearsonr(*b)[0]
        same = len({np.sign(x) for x in (rA, rE, rS, rB)}) == 1
        out.append(dict(state=st, n=len(a[0]), r_A=round(rA, 2), p_A=round(pA, 3), r_A_excl=round(rE, 2), r_rank=round(rS, 2), r_B=round(rB, 2),
                        holds_up=bool(same and abs(rA - rE) <= 0.25)))
    with (DATA / "nightlight_nsdp_corr.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, list(out[0]))
        w.writeheader(); w.writerows(out)
    print(f"{'state':28s} n    A     p   A-excl  rank   B   holds up")
    for o in out:
        print(f"{o['state']:28s} {o['n']:2d} {o['r_A']:+.2f} {o['p_A']:5.3f}  {o['r_A_excl']:+.2f}  {o['r_rank']:+.2f}  {o['r_B']:+.2f}  {'YES' if o['holds_up'] else '-'}")
    print("holds up:", [o["state"] for o in out if o["holds_up"]], "| p<0.05:", [o["state"] for o in out if o["p_A"] < 0.05], "| of", len(out))


main()
