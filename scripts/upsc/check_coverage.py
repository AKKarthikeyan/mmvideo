#!/usr/bin/env python3
"""Check docs/upsc/catalogue.csv: every in-scope line of the CSE syllabus has an episode, and every tag is real."""
import csv
import sys
from collections import Counter
from pathlib import Path

# Syllabus lines in scope, as printed in the CSE 2026 notice (PDF page in the comment).
CODES = (
    "P-HIS P-GEO P-POL P-ECO "  # p32
    "G1-culture G1-modern G1-freedom G1-postind G1-world G1-pop G1-physgeo G1-resources G1-geophys "  # p33-34
    "G2-const G2-fed G2-sep G2-compare G2-parl G2-exec G2-rpa G2-constbodies G2-statutory "  # p34
    "G2-policy G2-dev G2-welfare G2-social G2-poverty G2-gov G2-civil "  # p34-35
    "G3-eco G3-incl G3-budget G3-crops G3-msp G3-food G3-land G3-lib G3-infra G3-invest "  # p35
    "ECO1-1a ECO1-1b ECO1-1c ECO1-1d ECO1-2 ECO1-3a ECO1-3b ECO1-4a ECO1-4b ECO1-4c "  # p61-62
    "ECO1-5a ECO1-5b ECO1-5c ECO1-5d ECO1-5e ECO1-5f "  # p62
    "ECO2-P ECO2-A1 ECO2-A2 ECO2-A3 ECO2-A4 ECO2-A5 "  # p62-63
    "ECO2-B1 ECO2-B2 ECO2-B3 ECO2-B4 ECO2-B5 ECO2-B6 ECO2-B7 ECO2-B8 "  # p63
    "GEO1-P1 GEO1-P2 GEO1-P3 GEO1-P4 GEO1-P5 GEO1-H1 GEO1-H2 GEO1-H3 GEO1-H4 GEO1-H5 "  # p65-66
    "GEO2-1 GEO2-2 GEO2-3 GEO2-4 GEO2-5 GEO2-6 GEO2-7 GEO2-8 GEO2-9 GEO2-10 GEO2-map "  # p66-67
    + " ".join(f"HIS1-{i}" for i in range(1, 25)) + " "  # p70-73
    + " ".join(f"HIS2-{i}" for i in range(1, 28)) + " "  # p73-76
    + " ".join(f"PSIR-G{i}" for i in range(1, 12)) + " "  # p136-137, Indian Government and Politics only
    + " ".join(f"AGR1-{i}" for i in range(1, 10)) + " "  # p37, paragraphs in printed order
    + " ".join(f"AGR2-{i}" for i in range(1, 9)) + " "  # p38, paragraphs in printed order
    # RBI Grade B (Advt. RBISB/DA/03/2025-26), economics and finance lines only; printed pages 34-40 of the notice.
    # ESI = Phase II Paper I of the General cadre; FS/FMK/GT = Paper III a-c; MIC/MAC/ENV/QM/IE/CUR = DEPR papers.
    # Out of scope: English, reasoning, quantitative aptitude, general awareness, Paper III management and ethics, DSIM statistics.
    + " ".join(f"RBI-ESI{i}" for i in range(1, 5)) + " " + " ".join(f"RBI-FS{i}" for i in range(1, 8)) + " RBI-FMK "
    + " ".join(f"RBI-GT{i}" for i in range(1, 10)) + " " + " ".join(f"RBI-MIC{i}" for i in range(1, 6)) + " "
    + " ".join(f"RBI-MAC{i}" for i in range(1, 8)) + " RBI-ENV " + " ".join(f"RBI-QM{i}" for i in range(1, 4)) + " "
    + " ".join(f"RBI-IE{i}" for i in range(1, 7)) + " RBI-CUR"
).split()

rows = list(csv.DictReader(open(Path(__file__).parents[2] / "docs/upsc/catalogue.csv", encoding="utf-8")))
assert all(None not in r and all(r.values()) for r in rows), "a row has the wrong number of fields"
ids = Counter(r["id"] for r in rows)
hits = Counter(c for r in rows for c in r["syllabus"].split())

dup = [i for i, n in ids.items() if n > 1]
unknown = sorted(set(hits) - set(CODES))
missing = [c for c in CODES if c not in hits]

print(f"{len(rows)} episodes, {len(CODES)} syllabus lines in scope")
for s in ("Economics", "Geography", "History", "Polity", "Agriculture"):
    sub = [r for r in rows if r["subject"] == s]
    print(f"  {s:<12} core {sum(r['tier'] == 'C' for r in sub):>3}  depth {sum(r['tier'] == 'D' for r in sub):>3}  "
          f"living {sum(r['change'] == 'L' for r in sub):>3}  fixed {sum(r['change'] == 'F' for r in sub):>3}")
core = [r for r in rows if r["tier"] == "C"]
print(f"  total core {len(core)}, depth {len(rows) - len(core)}, living {sum(r['change'] == 'L' for r in rows)}")
multi = sum(len({c.split('-')[0][:3] for c in r['syllabus'].split() if c[:3] in ('ECO', 'GEO', 'HIS', 'PSI', 'AGR')}) > 1 for r in rows)
print(f"  episodes serving more than one optional: {multi}")
print("duplicate ids:", dup or "none")
print("unknown tags:", unknown or "none")
print("uncovered lines:", missing or "none")
sys.exit(1 if dup or unknown or missing else 0)
