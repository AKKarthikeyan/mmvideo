// Geometry for the Katha kit (21 Oct 2026): smooth outlines through points, tapered bands, hanging locks, seeded noise.
// Everything is deterministic: the same frame always draws the same picture (no Math.random anywhere in the kit).
// 22 Oct 2026 (kit pass): open Catmull-Rom sampling to points (crPoints), arc length (cumLen, atLen, resample), winding
// helpers (area, orient) and a winding option on smooth() and ribbon(), so shapes joined in one path never cancel.
export type Pt = [number, number] | [number, number, "c"];
export const fmt = (p: ArrayLike<number | string>) => `${(+p[0]).toFixed(1)} ${(+p[1]).toFixed(1)}`;
// Seeded pseudo-random in [0, 1).
export const rnd = (i: number, salt = 0) => { const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return v - Math.floor(v); };
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------- winding ----------
// Signed area (shoelace). In SVG's y-down space a positive area is a clockwise outline on screen.
export const area = (pts: ArrayLike<number>[]): number => {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; }
  return a / 2;
};
// The same outline turned to the wanted winding ("cw" = clockwise on screen). Corner marks ("c") travel with their points.
export type Wind = "cw" | "ccw";
export const orient = <T extends ArrayLike<number | string>>(pts: T[], wind: Wind = "cw"): T[] =>
  (area(pts as any) >= 0) === (wind === "cw") ? pts : [...pts].reverse();

// Catmull-Rom through points, as cubic Béziers. A point marked "c" is a sharp corner.
// The second argument is either `closed` (true by default: the outline ends with Z) or an options object:
//   {closed?: boolean (default true), t?: tension (0.5), wind?: "cw" | "ccw" (closed outlines only: turn the outline so
//   every shape joined into one path has the same winding and overlaps never cut holes under the nonzero rule)}.
// smooth(pts, false) or smooth(pts, {closed: false}) is an open curve with no Z (a stroke, or the top of a ridge you close
// yourself with L ... Z).
export const smooth = (pts: Pt[], closed: boolean | {closed?: boolean; t?: number; wind?: Wind} = true, t = 0.5): string => {
  if (typeof closed === "object") { const o = closed; closed = o.closed ?? true; t = o.t ?? t; if (o.wind && closed) pts = orient(pts, o.wind); }
  const cl = closed as boolean;
  const n = pts.length, P = (i: number) => (cl ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${fmt(pts[0])}`;
  const last = cl ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const s1 = p1[2] === "c" ? 0 : t, s2 = p2[2] === "c" ? 0 : t;
    d += ` C ${fmt([p1[0] + (p2[0] - p0[0]) * s1 / 3, p1[1] + (p2[1] - p0[1]) * s1 / 3])} ${fmt([p2[0] - (p3[0] - p1[0]) * s2 / 3, p2[1] - (p3[1] - p1[1]) * s2 / 3])} ${fmt(p2)}`;
  }
  return d + (cl ? " Z" : "");
};
// A straight-segment outline (or polyline when closed = false), optionally turned to a winding.
export const polyD = (pts: ArrayLike<number>[], closed = true, wind?: Wind): string => {
  const q = wind && closed ? orient(pts as number[][], wind) : pts;
  let d = "";
  for (let i = 0; i < q.length; i++) d += `${i ? " L" : "M"} ${fmt(q[i])}`;
  return d + (closed ? " Z" : "");
};
const cubicAt = (a: ArrayLike<number>, b: ArrayLike<number>, c: ArrayLike<number>, d: ArrayLike<number>, t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
};
// Samples along a chain of cubics [p0, c1, c2, p1, c1, c2, p2, ...], n per segment.
export const sampleCubics = (p: number[][], n: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let s = 0; s + 3 < p.length; s += 3) for (let i = 0; i <= n; i++) { if (s > 0 && i === 0) continue; out.push(cubicAt(p[s], p[s + 1], p[s + 2], p[s + 3], i / n)); }
  return out;
};
// Points along the Catmull-Rom curve through pts (the same curve smooth() draws), `per` samples per segment.
// Open by default: the curve starts at the first point and ends at the last. "c" corners are honoured.
export const crPoints = (pts: Pt[] | number[][], per = 8, closed = false, t = 0.5): [number, number][] => {
  const P0 = pts as any[], n = P0.length;
  if (n < 2) return P0.map((p) => [p[0], p[1]] as [number, number]);
  const P = (i: number) => (closed ? P0[(i + n) % n] : P0[Math.max(0, Math.min(n - 1, i))]);
  const out: [number, number][] = [[P0[0][0], P0[0][1]]];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const s1 = p1[2] === "c" ? 0 : t, s2 = p2[2] === "c" ? 0 : t;
    const c1 = [p1[0] + (p2[0] - p0[0]) * s1 / 3, p1[1] + (p2[1] - p0[1]) * s1 / 3], c2 = [p2[0] - (p3[0] - p1[0]) * s2 / 3, p2[1] - (p3[1] - p1[1]) * s2 / 3];
    for (let k = 1; k <= per; k++) out.push(cubicAt(p1, c1, c2, p2, k / per));
  }
  if (closed) out.pop();
  return out;
};
// Cumulative arc length along a polyline: cum[i] is the length from pts[0] to pts[i]; cum[n - 1] is the total.
export const cumLen = (pts: ArrayLike<number>[]): number[] => {
  const c = [0];
  for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return c;
};
// The point at arc length s along a polyline (clamped to its ends): [x, y, angle of travel in radians].
// Pass the cumLen() of the same points when calling it many times.
export const atLen = (pts: ArrayLike<number>[], s: number, cum?: number[]): [number, number, number] => {
  const c = cum ?? cumLen(pts), n = pts.length;
  if (n === 1) return [pts[0][0], pts[0][1], 0];
  const L = c[n - 1], v = Math.max(0, Math.min(L, s));
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= v) lo = m; else hi = m; }
  const seg = c[hi] - c[lo] || 1, u = (v - c[lo]) / seg, a = pts[lo], b = pts[hi];
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0])];
};
// n points evenly spaced by arc length along a polyline (n >= 2), ends included.
export const resample = (pts: ArrayLike<number>[], n: number): [number, number][] => {
  const c = cumLen(pts), L = c[c.length - 1], out: [number, number][] = [];
  for (let i = 0; i < n; i++) { const p = atLen(pts, (L * i) / Math.max(1, n - 1), c); out.push([p[0], p[1]]); }
  return out;
};
export const nrmAt = (pts: number[][], i: number): [number, number] => {
  const n = pts.length, a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
  return [-ty / l, tx / l];
};
// A band along a polyline tapering from w0 to w1 (pw bends the taper): scarves, quills, reins, tails.
// wind ("cw" | "ccw"): turn the outline to that winding whatever the direction of the points, so ribbons joined into one
// path string never cancel each other where they overlap (leave it out for the old behaviour: winding follows the points).
export const ribbon = (pts: number[][], w0: number, w1: number, pw = 1, wind?: Wind): string => {
  const L: number[][] = [], R: number[][] = [], n = pts.length;
  for (let i = 0; i < n; i++) { const nn = nrmAt(pts, i), w = (w0 + (w1 - w0) * Math.pow(i / Math.max(1, n - 1), pw)) / 2; L.push([pts[i][0] + nn[0] * w, pts[i][1] + nn[1] * w]); R.push([pts[i][0] - nn[0] * w, pts[i][1] - nn[1] * w]); }
  const ring = [...L, ...R.reverse()];
  const q = wind ? orient(ring, wind) : ring;
  return `M ${q.map(fmt).join(" L ")} Z`;
};
// A smooth tapered band (its two edges smoothed, a rounded or pointed tip), always wound clockwise: branches, blades,
// stalks and fronds that are joined by the dozen into one path. tip: "round" | "point".
export const band = (pts: number[][], w0: number, w1: number, pw = 1, tip: "round" | "point" = "point"): string => {
  const L: Pt[] = [], R: Pt[] = [], n = pts.length;
  if (n < 2) return "";
  for (let i = 0; i < n; i++) { const nn = nrmAt(pts, i), w = Math.max(0.15, (w0 + (w1 - w0) * Math.pow(i / Math.max(1, n - 1), pw)) / 2); L.push([pts[i][0] + nn[0] * w, pts[i][1] + nn[1] * w]); R.push([pts[i][0] - nn[0] * w, pts[i][1] - nn[1] * w]); }
  const e = pts[n - 1], d = pts[n - 2], l = Math.hypot(e[0] - d[0], e[1] - d[1]) || 1, ex = (e[0] - d[0]) / l, ey = (e[1] - d[1]) / l;
  const cap: Pt[] = tip === "point" ? [[e[0] + ex * w1 * 0.9, e[1] + ey * w1 * 0.9, "c"]] : [[e[0] + ex * w1 * 0.5, e[1] + ey * w1 * 0.5]];
  L[0] = [L[0][0], L[0][1], "c"]; R[0] = [R[0][0], R[0][1], "c"];
  return smooth([...L, ...cap, ...R.reverse()], {wind: "cw"});
};
// A soft band whose edges are smoothed: a cloth end or a streamer that waves with phase ph.
export const streamer = (x0: number, y0: number, len: number, w0: number, w1: number, ph: number, amp = 12, dir = 1, k = 9): string => {
  const pts: number[][] = [];
  for (let i = 0; i <= k; i++) { const u = i / k; pts.push([x0 + dir * len * u, y0 + Math.sin(ph + u * 5.0) * amp * Math.pow(u, 0.8) + u * u * 14]); }
  return ribbon(pts, w0, w1, 0.8);
};
// Smooth 1-D noise in about [-1, 1] from incommensurate sines (deterministic flicker, sway and wobble).
export const wob = (t: number, s = 0) => Math.sin(t + s * 1.7) * 0.5 + Math.sin(t * 2.31 + s * 3.1) * 0.3 + Math.sin(t * 4.07 + s * 5.3) * 0.2;
// Rotate / move points: handy when placing a shape drawn about its own origin.
export const place = (pts: ArrayLike<number>[], x: number, y: number, a = 0, sx = 1, sy = sx): [number, number][] => {
  const c = Math.cos(a), s = Math.sin(a);
  return Array.from(pts, (p) => { const px = p[0] * sx, py = p[1] * sy; return [x + px * c - py * s, y + px * s + py * c] as [number, number]; });
};
