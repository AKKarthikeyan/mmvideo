#!/usr/bin/env python3
"""Validate a Map of the Day episode and write public/datakadai/maps/<id>/episode.json.

Inputs in public/datakadai/maps/<id>/: data.csv (id,name,value[,prev]; one row per state/UT plus an IN row for the
national figure; blank value = no data) and spec.json (on-screen text, scale, source, stamp, claims).
Every claim in spec.json is checked against the data; any mismatch stops the build.
Usage: build_map.py <id> [<id> ...]
"""
import csv, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
MAPS = ROOT / "public" / "datakadai" / "maps"
GEO = json.load(open(ROOT / "public" / "datakadai" / "geo" / "india.json"))
NAMES = {s["id"]: s["short"] for s in GEO["states"]}
STAMPS = ("OFFICIAL", "ESTIMATE", "CLAIM")
# low -> high; diverging runs good (leaf) -> neutral (cream) -> bad (brick)
PALETTES = {
    "diverging": ["#1F6B45", "#5FA36F", "#CFE3B8", "#F2C27B", "#D9733B", "#9E3324"],
    "turmeric": ["#FBEFD2", "#F5D58A", "#E8A317", "#C27A12", "#8A4F0E", "#5A3208"],
    "leaf": ["#EAF3E1", "#BFDDB0", "#86BF85", "#4E9A5F", "#2A7445", "#174F2E"],
    "brick": ["#FBE6DA", "#F2B79A", "#E0835E", "#C3553A", "#9E3324", "#6E1F16"],
}
NO_DATA = "#D8D2C4"


def load(eid):
    d = MAPS / eid
    spec = json.load(open(d / "spec.json"))
    rows = list(csv.DictReader(open(d / "data.csv")))
    num = lambda s: float(s) if s not in (None, "", "NA") else None
    vals = {r["id"]: num(r["value"]) for r in rows}
    prev = {r["id"]: num(r.get("prev")) for r in rows if num(r.get("prev")) is not None}
    return spec, vals, prev


def fail(eid, msg):
    sys.exit(f"[{eid}] {msg}")


def ranked(vals, n, top):
    xs = sorted(((v, k) for k, v in vals.items() if v is not None), key=lambda t: (-t[0] if top else t[0], t[1]))
    out = xs[:n]
    while len(out) < len(xs) and xs[len(out)][0] == out[-1][0]:  # never cut a tie in half
        out.append(xs[len(out)])
    return [{"id": k, "name": NAMES[k], "v": v} for v, k in out]


def check(eid, claims, vals, prev, india):
    allv = dict(vals, IN=india)
    for c in claims:
        t = c["type"]
        if t == "value":
            if allv.get(c["id"]) != c["eq"]: fail(eid, f"claim {c}: data has {allv.get(c['id'])}")
            if "prev" in c and prev.get(c["id"]) != c["prev"]: fail(eid, f"claim {c}: prev is {prev.get(c['id'])}")
        elif t in ("top", "bottom"):
            got = [r["id"] for r in ranked(vals, len(c["ids"]), t == "top")][:len(c["ids"])]
            if got != c["ids"]: fail(eid, f"claim {c}: data ranks {got}")
        elif t == "count_lte":
            n = sum(1 for v in vals.values() if v is not None and v <= c["max"])
            if n != c["n"]: fail(eid, f"claim {c}: data has {n}")
        elif t == "count_gte":
            n = sum(1 for v in vals.values() if v is not None and v >= c["min"])
            if n != c["n"]: fail(eid, f"claim {c}: data has {n}")
        elif t == "rose":
            got = sorted(k for k, v in vals.items() if v is not None and k in prev and v > prev[k])
            if got != sorted(c["ids"]): fail(eid, f"claim {c}: rose in data {got}")
        elif t == "fell":
            got = sorted(k for k, v in vals.items() if v is not None and k in prev and v < prev[k])
            if got != sorted(c["ids"]): fail(eid, f"claim {c}: fell in data {got}")
        else:
            fail(eid, f"unknown claim type {t}")


def build(eid):
    spec, vals, prev = load(eid)
    india = vals.pop("IN", None); prev.pop("IN", None)
    missing = sorted(set(NAMES) - set(vals)); extra = sorted(set(vals) - set(NAMES))
    if missing or extra: fail(eid, f"data.csv must have every state/UT id. missing {missing}, unknown {extra}")
    if spec.get("stamp") not in STAMPS: fail(eid, f"stamp must be one of {STAMPS}")
    src = spec.get("source", {})
    for k in ("name", "checked"):
        if not src.get(k): fail(eid, f"source.{k} is required")
    check(eid, spec.get("claims", []), vals, prev, india)

    sc = spec["scale"]; breaks = sc["breaks"]; pal = PALETTES[sc.get("palette", "turmeric")]
    if len(breaks) + 1 > len(pal): fail(eid, f"at most {len(pal) - 1} breaks")
    cols = pal if len(breaks) + 1 == len(pal) else [pal[round(i * (len(pal) - 1) / len(breaks))] for i in range(len(breaks) + 1)]
    dec = spec["metric"].get("decimals", 0)
    fmt = lambda x: f"{x:,.{dec}f}"
    bins = [{"max": b, "color": cols[i], "label": f"≤ {fmt(b)}"} for i, b in enumerate(breaks)]
    bins.append({"max": None, "color": cols[-1], "label": f"> {fmt(breaks[-1])}"})
    color = lambda v: NO_DATA if v is None else next(b["color"] for b in bins if b["max"] is None or v <= b["max"])

    ep = dict(spec)
    ep.update({"values": vals, "prev": prev, "india": india, "bins": bins, "noData": NO_DATA,
               "fills": {k: color(v) for k, v in vals.items()},
               "order": [k for k, _ in sorted(((k, v) for k, v in vals.items() if v is not None), key=lambda t: (t[1], t[0]))],
               "top": ranked(vals, spec.get("rankN", 3), True), "bottom": ranked(vals, spec.get("rankN", 3), False),
               "mapAttribution": GEO["attribution"]})
    out = MAPS / eid / "episode.json"
    json.dump(ep, open(out, "w"), indent=1, ensure_ascii=False)
    have = sum(v is not None for v in vals.values())
    print(f"[{eid}] ok: {have}/36 with data, {len(spec.get('claims', []))} claims checked"
          + (f", DRAFT ({spec['draft']})" if spec.get("draft") else "") + f" -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(__doc__)
    for e in sys.argv[1:]: build(e)
