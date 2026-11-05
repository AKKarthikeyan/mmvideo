"""State night lights from NASA Black Marble annual composites (VNP46A4, collection 002).

Reads the 16 India tiles per year (vnp46a4/<year>/*.h5, AllAngle_Composite_Snow_Free, nW/(cm2 sr), 15 arc-second
grid), cuts each state/UT to its DataMeet boundary (sources/geo/Admin2.*, Government of India boundaries) and writes
per-state totals plus 2-panel images on one shared colour scale.

  python nl_states.py 2012 2025 [--img TN,UP,BR]

Measures (per state, per year):
  sol      sum of lights: radiance x pixel area (km2), summed over the state. Its 2025/2012 ratio is the headline.
  mean     area-weighted mean radiance.
  lit_pct  share of the state's area brighter than LIT (nW/(cm2 sr)).
"""
import glob, json, math, pathlib, struct, sys
import h5py, numpy as np


HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SHP = ROOT / "sources" / "geo" / "Admin2"
FIELD = "HDFEOS/GRIDS/VIIRS_Grid_DNB_2d/Data Fields/"
BAND = "AllAngle_Composite_Snow_Free"
PIX = 1 / 240  # 15 arc-seconds in degrees
LIT = 1.0  # nW/(cm2 sr): a pixel at or above this counts as lit
IDS = {"Andaman & Nicobar": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", "Assam": "AS", "Bihar": "BR",
       "Chandigarh": "CH", "Chhattisgarh": "CG", "Dadra and Nagar Haveli and Daman and Diu": "DH", "Delhi": "DL",
       "Goa": "GA", "Gujarat": "GJ", "Haryana": "HR", "Himachal Pradesh": "HP", "Jammu & Kashmir": "JK",
       "Jharkhand": "JH", "Karnataka": "KA", "Kerala": "KL", "Ladakh": "LA", "Lakshadweep": "LD",
       "Madhya Pradesh": "MP", "Maharashtra": "MH", "Manipur": "MN", "Meghalaya": "ML", "Mizoram": "MZ",
       "Nagaland": "NL", "Odisha": "OD", "Puducherry": "PY", "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK",
       "Tamil Nadu": "TN", "Telangana": "TS", "Tripura": "TR", "Uttar Pradesh": "UP", "Uttarakhand": "UK",
       "West Bengal": "WB"}


def read_dbf(path):
    b = open(path, "rb").read()
    n, hlen, rlen = struct.unpack("<IHH", b[4:12])
    fields, off = [], 32
    while b[off] != 0x0D:
        fields.append((b[off:off + 11].split(b"\0")[0].decode(), b[off + 16])); off += 32
    rows = []
    for i in range(n):
        r, p, row = b[hlen + i * rlen: hlen + (i + 1) * rlen], 1, {}
        for name, ln in fields:
            row[name] = r[p:p + ln].decode("utf-8", "replace").strip(); p += ln
        rows.append(row)
    return rows


def read_shp(path):
    """Polygon records -> list of rings (each an (n,2) lon/lat array) per record."""
    b, off, out = open(path, "rb").read(), 100, []
    while off < len(b):
        clen = struct.unpack(">i", b[off + 4:off + 8])[0] * 2
        rec = b[off + 8: off + 8 + clen]; off += 8 + clen
        if struct.unpack("<i", rec[:4])[0] == 0: out.append([]); continue
        nparts, npts = struct.unpack("<ii", rec[36:44])
        parts = list(struct.unpack(f"<{nparts}i", rec[44:44 + 4 * nparts])) + [npts]
        pts = np.frombuffer(rec, "<f8", npts * 2, 44 + 4 * nparts).reshape(-1, 2)
        out.append([pts[parts[i]:parts[i + 1]] for i in range(nparts)])
    return out


def states():
    rows, recs, by = read_dbf(f"{SHP}.dbf"), read_shp(f"{SHP}.shp"), {}
    for row, rings in zip(rows, recs):
        by.setdefault(IDS[row["ST_NM"]], (row["ST_NM"], []))[1].extend(rings)
    assert len(by) == 36, f"expected 36 states/UTs, got {len(by)}"
    return by


def mosaic(year):
    """India mosaic for one year: 40 x 40 degrees (60E-100E, 0-40N), north-up."""
    files = sorted(glob.glob(str(HERE / "vnp46a4" / str(year) / "VNP46A4.*.h5")))
    assert len(files) == 16, f"{year}: expected 16 tiles, found {len(files)}"
    big = np.full((9600, 9600), np.nan, np.float32)
    for f in files:
        name = pathlib.Path(f).name.split(".")[2]  # h25v06
        h, v = int(name[1:3]), int(name[4:6])
        with h5py.File(f, "r") as d:
            a = d[FIELD + BAND][:].astype(np.float32)
            q = d[FIELD + BAND + "_Quality"][:]
            a[(a == -999.9) | (q == 1) | (q == 255)] = np.nan  # fill and poor quality out, as RBI (2026) does
        r, c = (v - 5) * 2400, (h - 24) * 2400  # tile h24v05 holds 60-70E, 30-40N
        big[r:r + 2400, c:c + 2400] = a
    return big


def mask(rings, lon0=60.0, lat1=40.0):
    xs = np.concatenate([r[:, 0] for r in rings]); ys = np.concatenate([r[:, 1] for r in rings])
    c0, c1 = int((xs.min() - lon0) / PIX), int(math.ceil((xs.max() - lon0) / PIX))
    r0, r1 = int((lat1 - ys.max()) / PIX), int(math.ceil((lat1 - ys.min()) / PIX))
    # rasterise: outer rings (clockwise in a shapefile) fill, holes (anticlockwise) cut; 4x supersampled
    from PIL import Image, ImageDraw
    k = 4
    im = Image.new("L", ((c1 - c0) * k, (r1 - r0) * k)); d = ImageDraw.Draw(im)
    for r in sorted(rings, key=lambda r: _signed_area(r) > 0):  # outer rings first, then holes
        xy = [((x - lon0) / PIX - c0) * k for x in r[:, 0]], [((lat1 - y) / PIX - r0) * k for y in r[:, 1]]
        d.polygon(list(zip(*xy)), fill=0 if _signed_area(r) > 0 else 1)
    m = np.asarray(im, np.float32).reshape(r1 - r0, k, c1 - c0, k).mean((1, 3)) >= 0.5
    return (slice(r0, r1), slice(c0, c1)), m


def _signed_area(r):
    x, y = r[:, 0], r[:, 1]
    return 0.5 * float(np.dot(x[:-1], y[1:]) - np.dot(x[1:], y[:-1]))  # > 0: anticlockwise (a hole)


def area_km2(rows_slice, shape):
    lat = 40.0 - (np.arange(rows_slice.start, rows_slice.stop) + 0.5) * PIX
    a = (PIX * 111.32) ** 2 * np.cos(np.radians(lat))
    return np.repeat(a[:, None], shape[1], 1)


def measure(arr, area, m, ok):
    """ok: pixels valid in every year compared, so both years sum over the same ground."""
    v, a, ok = arr[m], area[m], ok[m]
    return {"sol": float(np.sum(v[ok] * a[ok])), "mean": float(np.sum(v[ok] * a[ok]) / a[ok].sum()),
            "lit_pct": float(100 * a[ok][v[ok] >= LIT].sum() / a[ok].sum()), "nodata_pct": float(100 * (~ok).mean()),
            "area_km2": float(a.sum())}


def image(sid, name, crops, years, vmax=60.0):
    from PIL import Image, ImageDraw, ImageFont
    panels = []
    for (arr, m), y in zip(crops, years):
        t = np.clip(np.log1p(np.nan_to_num(arr)) / np.log1p(vmax), 0, 1)
        rgb = np.stack([t ** 0.8, t ** 1.1, t ** 2.2], -1) * 255
        rgb[~m] *= 0.18  # outside the state: dimmed, not hidden
        im = Image.fromarray(rgb.astype("uint8"))
        try: f = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", max(24, im.width // 18))
        except Exception: f = None
        ImageDraw.Draw(im).text((20, 16), str(y), fill=(255, 220, 150), font=f)
        panels.append(im)
    w, h = panels[0].size
    out = Image.new("RGB", (w * 2 + 16, h)); out.paste(panels[0], (0, 0)); out.paste(panels[1], (w + 16, 0))
    out.save(HERE / "out" / f"{sid}_{years[0]}_vs_{years[1]}.jpg", quality=90)


def main():
    years = [int(a) for a in sys.argv[1:3]]
    img = sys.argv[sys.argv.index("--img") + 1].split(",") if "--img" in sys.argv else []
    (HERE / "out").mkdir(exist_ok=True)
    st, mos = states(), [mosaic(y) for y in years]
    res = {}
    for sid, (name, rings) in sorted(st.items()):
        (rs, cs), m = mask(rings)
        area = area_km2(rs, m.shape)
        ok = np.logical_and.reduce([~np.isnan(a[rs, cs]) for a in mos])
        r = {y: measure(a[rs, cs], area, m, ok) for y, a in zip(years, mos)}
        a0, a1 = r[years[0]], r[years[1]]
        res[sid] = {"name": name, **{str(y): v for y, v in r.items()},
                    "sol_ratio": a1["sol"] / a0["sol"] if a0["sol"] else None,
                    "lit_pp": a1["lit_pct"] - a0["lit_pct"]}
        if sid in img:
            image(sid, name, [(a[rs, cs], m) for a in mos], years)
    meta = {"source": "NASA Black Marble VNP46A4 collection 002, " + BAND + ", LAADS DAAC",
            "boundaries": "DataMeet India states (CC BY 4.0), Government of India boundaries",
            "lit_threshold_nW_cm2_sr": LIT, "years": years}
    json.dump({"meta": meta, "states": res}, open(HERE / "out" / f"states_{years[0]}_{years[1]}.json", "w"), indent=1)
    print(f"{'id':3} {'state':28} {'SOL x':>6} {'lit% ' + str(years[0]):>10} {'lit% ' + str(years[1]):>10} {'nodata%':>8}")
    for sid, v in sorted(res.items(), key=lambda kv: -(kv[1]["sol_ratio"] or 0)):
        print(f"{sid:3} {v['name'][:28]:28} {v['sol_ratio']:6.2f} {v[str(years[0])]['lit_pct']:10.1f} "
              f"{v[str(years[1])]['lit_pct']:10.1f} {max(v[str(y)]['nodata_pct'] for y in years):8.2f}")


if __name__ == "__main__":
    main()
