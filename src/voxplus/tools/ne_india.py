# Natural Earth 10m "admin 0 countries, India point of view" (ne_10m_admin_0_countries_ind, public domain) ->
# a small GeoJSON of India and its neighbours for MapRoute. India's outline here is India's official claim
# (Natural Earth's India worldview), which is the boundary a map shown in India must carry.
#   ne_india.py SHP_DIR OUT.geojson
import sys, json
import shapefile
from shapely.geometry import shape, mapping, box, Polygon, MultiPolygon
from shapely.geometry.polygon import orient

src, out = sys.argv[1], sys.argv[2]
r = shapefile.Reader(src + "/ne_10m_admin_0_countries_ind", encoding="latin-1")
names = [f[0] for f in r.fields[1:]]
clip = box(25, -25, 140, 62)   # wide enough that no clip edge is ever on screen at the default camera
feats = []
for sr in r.iterShapeRecords():
    rec = dict(zip(names, sr.record))
    a3 = rec.get("ADM0_A3") or rec.get("ISO_A3")
    g = shape(sr.shape.__geo_interface__).intersection(clip)
    if g.is_empty:
        continue
    g = g.simplify(0.03 if a3 == "IND" else 0.08, preserve_topology=True)
    # d3-geo wants exterior rings clockwise (the opposite of RFC 7946), or it fills the rest of the globe
    polys = [g] if isinstance(g, Polygon) else [q for q in getattr(g, "geoms", []) if isinstance(q, Polygon)]
    g = MultiPolygon([orient(q, sign=-1.0) for q in polys if not q.is_empty])
    feats.append({"type": "Feature", "properties": {"a3": a3, "name": rec.get("NAME")}, "geometry": mapping(g)})
    print(a3, rec.get("NAME"))

def rnd(o):
    if isinstance(o, float):
        return round(o, 3)
    if isinstance(o, (list, tuple)):
        return [rnd(x) for x in o]
    if isinstance(o, dict):
        return {k: rnd(v) for k, v in o.items()}
    return o

json.dump(rnd({"type": "FeatureCollection", "source": "Natural Earth 10m admin 0 countries, India point of view (public domain)", "features": feats}), open(out, "w"), separators=(",", ":"))
