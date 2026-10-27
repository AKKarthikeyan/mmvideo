"""Build the export-story videos (Indica Atlas and Data Kadai) from DGCIS trade data.

usage: export_videos.py [video id ...]
For each video in VIDEOS, computes the numbers from the DGCIS commodity x country x port data and writes
hyperframes/videos/<id>/story.js plus a copy of videos/_template/index.html. Then: hf.py sync, hf.py render <id>.

Data: DGCIS Foreign Trade Data Dissemination Portal, via github.com/Vonter/india-export-import (ODbL; monthly, by
principal commodity, destination country and Indian port). FY = April to March: FY2026 is FY 2025-26.
District-of-origin figures come from the DGCIS "Export by District of Origin" tables, which this mirror does not carry:
put them in out/hyperframes/cache/district_exports.csv (columns: state, district, commodity, value_crore) and the
district map scene appears; without it the scene is left out rather than guessed.
"""
import csv
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "hyperframes" / "videos"
CACHE = ROOT / "out" / "hyperframes" / "cache"
PARQUET = "https://github.com/Vonter/india-export-import/releases/latest/download/export-import.parquet"
FYS = [2022, 2023, 2024, 2025, 2026]

COUNTRY = {"U ARAB EMTS": "UAE", "U S A": "USA", "CHINA P RP": "China", "VIETNAM SOC REP": "Vietnam", "EGYPT A RP": "Egypt",
           "SAUDI ARAB": "Saudi Arabia", "BANGLADESH PR": "Bangladesh", "NETHERLAND": "Netherlands", "U K": "UK",
           "KOREA RP": "South Korea", "IRAN": "Iran", "RUSSIA": "Russia"}
# Indian ports and depots as (label, lat, lon). Positions are the port or the city it serves, to the nearest ~5 km.
PORT = {
    "COCHIN SEA": ("Kochi port", 9.97, 76.26), "COCHIN AIRPORT": ("Kochi airport", 10.15, 76.40),
    "TUTICORIN SEA": ("Thoothukudi port", 8.75, 78.19), "ICD BANGALORE": ("Bengaluru inland depot", 12.98, 77.73),
    "BANGALORE AIRPORT": ("Bengaluru airport", 13.20, 77.71), "ICD HYDERABAD": ("Hyderabad inland depot", 17.45, 78.44),
    "HYDERABAD AIRPORT": ("Hyderabad airport", 17.24, 78.43), "NHAVA SHEVA SEA": ("Nhava Sheva (JNPA)", 18.95, 72.95),
    "MUNDRA": ("Mundra port", 22.74, 69.70), "CHENNAI SEA": ("Chennai port", 13.10, 80.30),
    "ENNORE SEA": ("Kamarajar port, Ennore", 13.26, 80.33), "VISAKHAPATNAM SEA": ("Visakhapatnam port", 17.69, 83.29),
    "KOLKATA SEA": ("Kolkata port", 22.54, 88.31), "PIPAVAB(VICYOR)": ("Pipavav port", 20.92, 71.51),
    "CHENNAI AIR": ("Chennai airport", 12.99, 80.17), "DELHI AIR": ("Delhi airport", 28.56, 77.10),
    "MUMBAI AIR": ("Mumbai airport", 19.09, 72.87), "KOLKATA AIR": ("Kolkata airport", 22.65, 88.45),
    "AHMEDABAD AIR CARGO COMPLEX": ("Ahmedabad airport", 23.07, 72.63),
    "ICD PALWAL, BHAGOLA-JANAULI": ("Palwal inland depot (Haryana)", 28.14, 77.33),
    "ICD GARHIHARSARU": ("Garhi Harsaru inland depot (Haryana)", 28.44, 76.92),
    # customs codes at the same inland depots are counted together: three at Dadri (Greater Noida), two at Kanpur
    "ICD JUHI RAILWAY YARD KANPUR": ("Kanpur inland depots (UP)", 26.46, 80.30), "ICD PANKI, UP": ("Kanpur inland depots (UP)", 26.46, 80.30),
    "CGM DADRI": ("Dadri inland depots (UP)", 28.55, 77.55), "CFS ALBATROSS/ICD DADRI": ("Dadri inland depots (UP)", 28.55, 77.55),
    "ICD NOIDA-DADRI": ("Dadri inland depots (UP)", 28.55, 77.55),
}

VIDEOS = {
    # Indica Atlas: where it leaves from and where it goes, on the map
    "ia-poultry": dict(channel="INDICA ATLAS", theme="atlas", product="POULTRY PRODUCTS", name="Poultry products",
                       title="INDIA'S POULTRY EXPORTS NEARLY DOUBLED"),
    "ia-seafood": dict(channel="INDICA ATLAS", theme="atlas", product="MARINE PRODUCTS", name="Marine products",
                       title="INDIA'S SEAFOOD COAST"),
    "ia-spices": dict(channel="INDICA ATLAS", theme="atlas", product="SPICES", name="Spices",
                      title="WHERE INDIA'S SPICES SAIL FROM"),
    # Data Kadai: the numbers
    "dk-phones": dict(channel="DATA KADAI", theme="kadai", product="TELECOM INSTRUMENTS", name="Phones and telecom equipment",
                      title="₹3 LAKH CRORE OF PHONES AND TELECOM GEAR"),
    "dk-buffalo": dict(channel="DATA KADAI", theme="kadai", product="BUFFALO MEAT", name="Buffalo meat",
                       title="INDIA'S QUIET MEAT EXPORT"),
    "dk-growth": dict(channel="DATA KADAI", theme="kadai", mode="ranking", title="INDIA'S FASTEST-GROWING BIG EXPORTS",
                      name="Exports over ₹20,000 crore", min_crore=20000, top=6),
}
NAMES = {"COPPER AND PRDCTS MADE OF COPR": "Copper and copper products", "TELECOM INSTRUMENTS": "Phones and telecom equipment",
         "BUFFALO MEAT": "Buffalo meat", "TWO AND THREE WHEELERS": "Two- and three-wheelers",
         "MOTOR VEHICLE/CARS": "Cars and motor vehicles", "OTHER CONSTRUCTION MACHINERY": "Construction machinery",
         "AC, REFRIGERATION MACHNRY ETC": "AC and refrigeration machinery", "MARINE PRODUCTS": "Marine products"}


def the(country):
    return f"The {country}" if country in ("UAE", "USA", "UK", "Netherlands") else country


def inr(cr):
    """₹ crore in Indian grouping, or lakh crore above 1,00,000 crore."""
    if cr >= 100000:
        return f"₹{cr / 100000:.2f} lakh crore"
    s = f"{round(cr):d}"
    head, tail = s[:-3], s[-3:]
    while len(head) > 2:
        tail = head[-2:] + "," + tail
        head = head[:-2]
    return f"₹{head + ',' if head else ''}{tail} crore"


def change(cur, prev):
    g = (cur / prev - 1) * 100
    if cur / prev >= 1.9:
        return g, "nearly double the year before" if cur / prev < 2 else "double the year before"
    if abs(g) < 1:
        return g, "about the same as the year before"
    return g, f"{'up' if g > 0 else 'down'} {abs(g):.0f}% on the year before"


def load():
    import pandas as pd
    p = CACHE / "export-import.parquet"
    if not p.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sfL", "-m", "900", "-o", str(p), PARQUET], check=True)
    df = pd.read_parquet(p, columns=["Commodity", "Country", "Port", "Year", "Month", "Type", "Quantity", "Unit", "INR Value"])
    ex = df[df.Type == "Export"].copy()
    ex["FY"] = ex.Year.where(ex.Month <= 3, ex.Year + 1)
    return ex[ex.FY.isin(FYS)]


# DGCIS district names that differ from the map's (state, district) names, after norm()
ALIAS = {"NILGIRIS": "THENILGIRIS", "KANCHEEPURAM": "KANCHIPURAM", "TUTICORIN": "THOOTHUKUDI", "TRICHY": "TIRUCHIRAPPALLI",
         "TIRUCHIRAPALLI": "TIRUCHIRAPPALLI", "KANYAKUMARI": "KANNIYAKUMARI", "VILLUPURAM": "VILUPPURAM",
         "TIRUVALLUR": "THIRUVALLUR", "THIRUVARUR": "THIRUVARUR", "TIRUVARUR": "THIRUVARUR", "KALLAKURICHI": "KALLAKKURICHI",
         "TIRUPATTUR": "TIRUPATHUR", "GURGAON": "GURUGRAM", "MEWAT": "NUH", "ALLAHABAD": "PRAYAGRAJ", "FAIZABAD": "AYODHYA",
         "BANGALORE": "BENGALURUURBAN", "BANGALOREURBAN": "BENGALURUURBAN", "BANGALORERURAL": "BENGALURURURAL",
         "MYSORE": "MYSURU", "BELGAUM": "BELAGAVI", "GULBARGA": "KALABURAGI", "BELLARY": "BALLARI", "SHIMOGA": "SHIVAMOGGA",
         "TUMKUR": "TUMAKURU", "BIJAPUR": "VIJAYAPURA", "MUMBAISUBURBAN": "MUMBAISUBURBAN", "AHMEDNAGAR": "AHILYANAGAR"}


def norm(name):
    return "".join(ch for ch in name.upper() if ch.isalpha())


def districts(product):
    """District rows for a product, matched to the map's districts by state and name. None if there is no district file."""
    f = CACHE / "district_exports.csv"
    if not f.exists():
        return None
    rows = [r for r in csv.DictReader(f.open()) if r["commodity"].strip().upper() == product]
    if not rows:
        return None
    geo = json.loads((ROOT / "hyperframes" / "shared" / "geo" / "india_districts.js").read_text()[len("window.INDIA = "):-2])
    index = {(norm(d["s"]), norm(d["n"])): i for i, d in enumerate(geo["districts"]) if d["n"]}
    out, missing = [], []
    for r in rows:
        k = (norm(r["state"]), ALIAS.get(norm(r["district"]), norm(r["district"])))
        i = index.get(k)
        (missing if i is None else out).append({"i": i, "s": r["state"].title(), "n": r["district"].title(), "v": float(r["value_crore"])})
    if missing:
        print(f"  {product}: {len(missing)} district names not on the map:", ", ".join(f"{m['n']} ({m['s']})" for m in missing[:12]))
    return {"rows": sorted(out, key=lambda d: -d["v"]), "unmatched": missing}


def product_story(ex, v):
    s = ex[ex.Commodity == v["product"]]
    by = (s.groupby("FY")["INR Value"].sum() / 1e7).reindex(FYS).fillna(0)
    cur, prev = by[2026], by[2025]
    india = ex[ex.FY == 2026]["INR Value"].sum() / 1e7
    now = s[s.FY == 2026]
    ports = {}
    for code, val in now.groupby("Port")["INR Value"].sum().items():
        label, lat, lon = PORT.get(code, (code.title(), None, None))
        p = ports.setdefault(label, {"label": label, "lat": lat, "lon": lon, "pct": 0.0})
        p["pct"] += val / now["INR Value"].sum() * 100
    ports = sorted(ports.values(), key=lambda p: -p["pct"])[:5]
    ctry = (now.groupby("Country")["INR Value"].sum() / now["INR Value"].sum() * 100).sort_values(ascending=False)
    dest = [{"label": COUNTRY.get(c, c.title()), "pct": round(p, 1)} for c, p in ctry.head(6).items()]
    g, words = change(cur, prev)
    qty = now.groupby("Unit")["Quantity"].sum()
    tonnes = qty.get("TON", 0) + qty.get("KGS", 0) / 1000
    top2 = ports[0]["pct"] + ports[1]["pct"]
    dist = districts(v["product"])
    lines = {
        "hook": f"In 2025–26, India exported {inr(cur)} worth of {v['name'].lower()}: {words}.",
        "growth": f"In 2021–22 it was {inr(by[2022])}.",
        "ports": f"{top2:.0f}% of it left through {ports[0]['label']} and {ports[1]['label']}.",
        "dest": f"{the(dest[0]['label'])} alone bought {dest[0]['pct']:.0f}%.",
        "end": f"That is {cur / india * 100:.2f}% of India's {inr(india)} of goods exports.",
    }
    if dist:
        d0 = dist["rows"][0]
        mapped = sum(d["v"] for d in dist["rows"])
        lines["district"] = f"{d0['n']} district alone accounted for {d0['v'] / mapped * 100:.0f}% of the exports with a district on record."
    return {"mode": "product", "fy": [{"fy": f"FY{str(y - 1)[2:]}-{str(y)[2:]}", "cr": round(by[y])} for y in FYS],
            "cur": round(cur), "prev": round(prev), "growth": round(g, 1), "india": round(india), "share": round(cur / india * 100, 2),
            "tonnes": round(tonnes) if tonnes else None, "ports": [{**p, "pct": round(p["pct"], 1)} for p in ports], "dest": dest,
            "lines": lines, "districts": dist}


def ranking_story(ex, v):
    g = ex[ex.FY.isin([2025, 2026])].groupby(["Commodity", "FY"])["INR Value"].sum().unstack() / 1e7
    g = g[g[2026] >= v["min_crore"]]
    g["gr"] = (g[2026] / g[2025] - 1) * 100
    g = g.sort_values("gr", ascending=False).head(v["top"])
    rows = [{"label": NAMES.get(c, c.title()), "cur": round(r[2026]), "prev": round(r[2025]), "gr": round(r["gr"], 1)} for c, r in g.iterrows()]
    lines = {
        "hook": f"Among India's exports worth over {inr(v['min_crore'])}, these grew fastest in 2025–26.",
        "rank": f"{rows[0]['label']} grew {rows[0]['gr']:.0f}%, from {inr(rows[0]['prev'])} to {inr(rows[0]['cur'])}.",
        "end": f"{rows[1]['label']} added {inr(rows[1]['cur'] - rows[1]['prev'])} in a single year.",
    }
    return {"mode": "ranking", "rows": rows, "lines": lines}


SCENES = {"product": [("hook", 6.5), ("growth", 7.5), ("district", 9.0), ("ports", 9.0), ("dest", 7.5), ("end", 5.0)],
          "ranking": [("hook", 6.0), ("rank", 14.0), ("end", 5.0)]}


def plan(story):
    t, out = 0.0, []
    for sid, d in SCENES[story["mode"]]:
        if sid == "district" and not story.get("districts"):
            continue
        out.append({"id": sid, "t0": round(t, 2), "d": d})
        t += d
    return out, round(t, 2)


def main():
    want = sys.argv[1:] or list(VIDEOS)
    ex = load()
    for vid in want:
        v = VIDEOS[vid]
        story = {**{k: v[k] for k in ("channel", "theme", "title", "name")},
                 **(ranking_story(ex, v) if v.get("mode") == "ranking" else product_story(ex, v)),
                 "source": "Data: DGCIS Foreign Trade Data Dissemination Portal (via Vonter/india-export-import, ODbL) · FY = April to March"}
        story["scenes"], dur = plan(story)
        d = VID / vid
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text((VID / "_template" / "index.html").read_text().replace("__DURATION__", str(dur)))
        (d / "story.js").write_text("window.STORY = " + json.dumps(story, ensure_ascii=False, indent=1) + ";\n")
        print(vid, f"{dur}s", story["lines"])


if __name__ == "__main__":
    main()
