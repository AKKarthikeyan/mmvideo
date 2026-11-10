"""All-India quarterly correlation of night-light growth with real GDP growth. OUR calculation, not the RBI's.

usage: nightlight_india_gdp_corr.py       (needs hyperframes/data/nightlight_india_monthly.csv from vnp46a3_monthly_sums.py)
Writes hyperframes/data/nightlight_india_gdp_quarterly.csv and prints the correlations.
GDP: India real GDP, growth over the same quarter a year earlier, %, quarterly (OECD copy of MoSPI/NSO figures, via FRED series
INDGDPRQPSMEI, https://fred.stlouisfed.org/series/INDGDPRQPSMEI), by calendar quarter (Apr-Jun = fiscal Q1). The latest quarters may sit
on the new 2022-23 base and earlier ones on 2011-12: check the base before quoting. Lights: NASA Black Marble monthly VNP46A3 (Suomi NPP),
mean radiance of valid pixels over India, summed by quarter; growth = same quarter a year earlier (Apr-Jun 2013 to Apr-Jun 2026, 53 quarters).
Checks fixed in advance: A all quarters; B without the Covid quarters (Jan-Mar 2020 to Jul-Sep 2021, the RBI paper's exclusion);
C without Covid and without 2022-23 (the Suomi NPP series steps up then, see README); E without 2022-23 only; Spearman rank of A.
Needs numpy, scipy.
"""
import csv
import subprocess
from pathlib import Path

import numpy as np
from scipy.stats import pearsonr, spearmanr

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "hyperframes" / "data"


def main():
    M = {(int(r["year"]), int(r["month"])): (float(r["sum_nw"]), int(r["n_valid"])) for r in csv.DictReader((DATA / "nightlight_india_monthly.csv").open())}
    raw = subprocess.run(["curl", "-sSL", "-m", "60", "https://fred.stlouisfed.org/graph/fredgraph.csv?id=INDGDPRQPSMEI"], capture_output=True, check=True).stdout.decode()
    G = {x["observation_date"][:7]: float(x["INDGDPRQPSMEI"]) for x in csv.DictReader(raw.splitlines()) if x["INDGDPRQPSMEI"] not in ("", ".")}
    (DATA / "india_gdp_growth_quarterly_fred.csv").write_text(raw)

    def q(y, qi):
        ms = [(y, 3 * qi + k) for k in (1, 2, 3)]
        if not all(m in M for m in ms):
            return None
        s = sum(M[m][0] for m in ms); n = sum(M[m][1] for m in ms)
        return s / n

    rows = []
    for y in range(2013, 2027):
        for qi in range(4):
            a, b, key = q(y, qi), q(y - 1, qi), f"{y}-{3 * qi + 1:02d}"
            if a and b and key in G:
                rows.append((key, a / b - 1, G[key] / 100))
    keys = [r[0] for r in rows]; L = np.array([r[1] for r in rows]); g = np.array([r[2] for r in rows])
    with (DATA / "nightlight_india_gdp_quarterly.csv").open("w", newline="") as fh:
        w = csv.writer(fh); w.writerow(["quarter_start", "lights_growth", "gdp_growth"]); w.writerows([(k, round(a, 4), round(c, 4)) for k, a, c in rows])
    covid = {"2020-01", "2020-04", "2020-07", "2020-10", "2021-01", "2021-04", "2021-07"}
    step = {f"{y}-{m:02d}" for y in (2022, 2023) for m in (1, 4, 7, 10)}
    print(len(rows), "quarters", keys[0], "to", keys[-1])
    for lab, ex in (("A all", set()), ("B without Covid", covid), ("C without Covid and 2022-23", covid | step), ("E without 2022-23", step)):
        s = np.array([k not in ex for k in keys]); r, p = pearsonr(L[s], g[s])
        print(f"{lab:30s} n={s.sum():2d}  r={r:+.2f}  p={p:.3f}  rank={spearmanr(L[s], g[s])[0]:+.2f}")


main()
