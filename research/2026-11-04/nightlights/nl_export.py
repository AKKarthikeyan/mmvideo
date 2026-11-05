"""Export per-state night-light frames + numbers for the DATA-nl-<id> Shorts.

Reads out/states_<y0>_<y1>.json (from nl_states.py) and the VNP46A4 mosaics, writes to
public/datayt/nightlights/: <ID>_<year>.jpg (same colour scale both years, outside the state dimmed),
and data.json (numbers, ranks, outline path in image pixels, image size).

  python nl_export.py 2012 2025
"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import numpy as np
from PIL import Image
import nl_states as N

BOX = 1000  # longest side of each exported frame, px
VMAX = 60.0  # nW/(cm2 sr) at full white; log scale, shared by both years and all states
OUT = N.ROOT / "public" / "datayt" / "nightlights"
MAIN = {"PY": "Shown: Puducherry region. Numbers: all four parts.",
        "DH": "Shown: Dadra & Nagar Haveli and Daman. Numbers include Diu."}


def colour(arr, m):
    t = np.clip(np.log1p(np.nan_to_num(arr)) / np.log1p(VMAX), 0, 1)
    rgb = np.stack([t ** 0.8, t ** 1.1, t ** 2.2], -1) * 255
    rgb[~m] *= 0.16
    return Image.fromarray(rgb.astype("uint8"))


def outline(rings, rs, cs, k):
    parts = []
    for r in rings:
        x = ((r[:, 0] - 60.0) / N.PIX - cs.start) * k; y = ((40.0 - r[:, 1]) / N.PIX - rs.start) * k
        if abs(N._signed_area(np.column_stack([x, y]))) < 30: continue  # specks vanish at this size
        step = max(1, len(x) // 700)
        pts = np.column_stack([x[::step], y[::step]])
        parts.append("M" + "L".join(f"{a:.1f} {b:.1f}" for a, b in pts) + "Z")
    return "".join(parts)


def main():
    y0, y1 = (int(a) for a in sys.argv[1:3])
    res = json.load(open(N.HERE / "out" / f"states_{y0}_{y1}.json"))
    OUT.mkdir(parents=True, exist_ok=True)
    st, mos = N.states(), {y: N.mosaic(y) for y in (y0, y1)}
    order = sorted(res["states"], key=lambda s: -res["states"][s]["sol_ratio"])
    data = {"years": [y0, y1], "meta": res["meta"], "states": {}}
    for sid, (name, rings) in sorted(st.items()):
        (rs, cs), m = N.mask(rings)
        pad_r, pad_c = max(4, (rs.stop - rs.start) // 25), max(4, (cs.stop - cs.start) // 25)
        rs2, cs2 = slice(rs.start - pad_r, rs.stop + pad_r), slice(cs.start - pad_c, cs.stop + pad_c)
        mm = np.zeros((rs2.stop - rs2.start, cs2.stop - cs2.start), bool); mm[pad_r:-pad_r, pad_c:-pad_c] = m
        note = None
        if sid in MAIN:  # scattered UT: frame the main piece only; the numbers still cover every piece
            big = max(rings, key=lambda r: abs(N._signed_area(r)))
            cx, cy = big[:, 0].mean(), big[:, 1].mean()
            near = [r for r in rings if abs(r[:, 0].mean() - cx) < 0.6 and abs(r[:, 1].mean() - cy) < 0.6]
            xs = np.concatenate([r[:, 0] for r in near]); ys = np.concatenate([r[:, 1] for r in near])
            r0, r1 = int((40 - ys.max()) / N.PIX), int(np.ceil((40 - ys.min()) / N.PIX))
            c0, c1 = int((xs.min() - 60) / N.PIX), int(np.ceil((xs.max() - 60) / N.PIX))
            p = max(6, (r1 - r0) // 8, (c1 - c0) // 8)
            ra, rb = max(rs2.start, r0 - p), min(rs2.stop, r1 + p); ca, cb = max(cs2.start, c0 - p), min(cs2.stop, c1 + p)
            mm = mm[ra - rs2.start:rb - rs2.start, ca - cs2.start:cb - cs2.start]; rs2 = slice(ra, rb); cs2 = slice(ca, cb)
            note = MAIN[sid]
        h, w = mm.shape; k = BOX / max(h, w); size = (round(w * k), round(h * k))
        for y in (y0, y1):
            colour(mos[y][rs2, cs2], mm).resize(size, Image.LANCZOS).save(OUT / f"{sid}_{y}.jpg", quality=88)
        v = res["states"][sid]
        data["states"][sid] = {"name": name, "w": size[0], "h": size[1], "path": outline(rings, rs2, cs2, k),
                               "ratio": round(v["sol_ratio"], 2), "rank": order.index(sid) + 1,
                               "lit": [round(v[str(y0)]["lit_pct"], 1), round(v[str(y1)]["lit_pct"], 1)],
                               "area_km2": round(v[str(y0)]["area_km2"]),
                               "nodata_pct": round(max(v[str(y)]["nodata_pct"] for y in (y0, y1)), 2), "note": note}
    json.dump(data, open(OUT / "data.json", "w"), separators=(",", ":"))
    print("wrote", len(data["states"]), "states to", OUT)


if __name__ == "__main__":
    main()
