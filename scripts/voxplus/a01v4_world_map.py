# A01 v4: world map for n02 ("rival mills, at home and abroad") from Natural Earth 10m admin 0 countries,
# INDIA POINT OF VIEW (ne_10m_admin_0_countries_ind, public domain), so India carries its official outline on any map.
# Same recipe as src/voxplus/tools/ne_india.py, clipped to the inhabited world and simplified harder.
#   uv run -q -p 3.13 --with pyshp --with shapely python a01v4_world_map.py SHP_DIR OUT.geojson
import sys, json
import shapefile
from shapely.geometry import shape, mapping, box, Polygon, MultiPolygon
from shapely.geometry.polygon import orient
src, out = sys.argv[1], sys.argv[2]
r = shapefile.Reader(src + "/ne_10m_admin_0_countries_ind", encoding="latin-1")
names = [f[0] for f in r.fields[1:]]
clip = box(-170, -58, 179.9, 80)
feats = []
for sr in r.iterShapeRecords():
    rec = dict(zip(names, sr.record)); a3 = rec.get("ADM0_A3") or rec.get("ISO_A3")
    g = shape(sr.shape.__geo_interface__).intersection(clip)
    if g.is_empty: continue
    g = g.simplify(0.06 if a3 == "IND" else 0.18, preserve_topology=True)
    polys = [g] if isinstance(g, Polygon) else [q for q in getattr(g, "geoms", []) if isinstance(q, Polygon)]
    polys = [orient(q, sign=-1.0) for q in polys if not q.is_empty and q.area > 0.05]
    if not polys: continue
    feats.append({"type": "Feature", "properties": {"a3": a3, "name": rec.get("NAME")}, "geometry": mapping(MultiPolygon(polys))})
def rnd(o):
    if isinstance(o, float): return round(o, 2)
    if isinstance(o, (list, tuple)): return [rnd(x) for x in o]
    if isinstance(o, dict): return {k: rnd(v) for k, v in o.items()}
    return o
json.dump(rnd({"type": "FeatureCollection", "source": "Natural Earth 10m admin 0 countries, India point of view (public domain)", "features": feats}), open(out, "w"), separators=(",", ":"))
print(len(feats), "features")
