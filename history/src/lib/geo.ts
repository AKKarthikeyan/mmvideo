// Map data helpers (Natural Earth via world-atlas, bundled offline).
import { feature } from "topojson-client";
import { geoMercator, geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import countries110 from "world-atlas/countries-110m.json";
import countries50 from "world-atlas/countries-50m.json";

type Topo = Parameters<typeof feature>[0];

const toFC = (topo: unknown) =>
  feature(topo as Topo, (topo as any).objects.countries) as unknown as FeatureCollection<Geometry>;

export const world110 = toFC(countries110);
export const world50 = toFC(countries50);

/** ISO 3166 numeric id → feature. India = "356". */
export const country = (id: string, detail: "110" | "50" = "50"): Feature<Geometry> => {
  const fc = detail === "50" ? world50 : world110;
  const f = fc.features.find((x) => String(x.id) === id);
  if (!f) throw new Error(`Country ${id} not found`);
  return f;
};

export const fitMercator = (f: Feature<Geometry> | FeatureCollection<Geometry>, w: number, h: number, pad = 40) =>
  geoMercator().fitExtent(
    [
      [pad, pad],
      [w - pad, h - pad],
    ],
    f as any,
  );

export const worldProjection = (w: number, h: number) =>
  geoNaturalEarth1().fitExtent(
    [
      [20, 20],
      [w - 20, h - 20],
    ],
    { type: "Sphere" } as any,
  );

export const pathOf = (proj: GeoProjection) => geoPath(proj);

/** Lon/lat ring → SVG path string with the given projection. */
export const ringPath = (proj: GeoProjection, ring: [number, number][], close = true) =>
  ring
    .map((p, i) => {
      const [x, y] = proj(p)!;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + (close ? " Z" : "");

/** Great-circle-ish arc between two projected points (quadratic curve, lifted). */
export const arcPath = (proj: GeoProjection, a: [number, number], b: [number, number], lift = 0.25) => {
  const [x1, y1] = proj(a)!;
  const [x2, y2] = proj(b)!;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1},${y1} Q${mx},${my - dist * lift} ${x2},${y2}`;
};
