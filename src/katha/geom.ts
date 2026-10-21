// Geometry for the Katha kit (21 Oct 2026): smooth outlines through points, tapered bands, hanging locks, seeded noise.
// Everything is deterministic: the same frame always draws the same picture (no Math.random anywhere in the kit).
export type Pt = [number, number] | [number, number, "c"];
export const fmt = (p: ArrayLike<number | string>) => `${(+p[0]).toFixed(1)} ${(+p[1]).toFixed(1)}`;
// Seeded pseudo-random in [0, 1).
export const rnd = (i: number, salt = 0) => { const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return v - Math.floor(v); };
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Catmull-Rom through points, as cubic Béziers. A point marked "c" is a sharp corner.
export const smooth = (pts: Pt[], closed = true, t = 0.5): string => {
  const n = pts.length, P = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${fmt(pts[0])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const s1 = p1[2] === "c" ? 0 : t, s2 = p2[2] === "c" ? 0 : t;
    d += ` C ${fmt([p1[0] + (p2[0] - p0[0]) * s1 / 3, p1[1] + (p2[1] - p0[1]) * s1 / 3])} ${fmt([p2[0] - (p3[0] - p1[0]) * s2 / 3, p2[1] - (p3[1] - p1[1]) * s2 / 3])} ${fmt(p2)}`;
  }
  return d + (closed ? " Z" : "");
};
const cubicAt = (a: number[], b: number[], c: number[], d: number[], t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
};
// Samples along a chain of cubics [p0, c1, c2, p1, c1, c2, p2, ...], n per segment.
export const sampleCubics = (p: number[][], n: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let s = 0; s + 3 < p.length; s += 3) for (let i = 0; i <= n; i++) { if (s > 0 && i === 0) continue; out.push(cubicAt(p[s], p[s + 1], p[s + 2], p[s + 3], i / n)); }
  return out;
};
export const nrmAt = (pts: number[][], i: number): [number, number] => {
  const n = pts.length, a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
  return [-ty / l, tx / l];
};
// A band along a polyline tapering from w0 to w1 (pw bends the taper): scarves, quills, reins, tails.
export const ribbon = (pts: number[][], w0: number, w1: number, pw = 1): string => {
  const L: number[][] = [], R: number[][] = [], n = pts.length;
  for (let i = 0; i < n; i++) { const nn = nrmAt(pts, i), w = (w0 + (w1 - w0) * Math.pow(i / Math.max(1, n - 1), pw)) / 2; L.push([pts[i][0] + nn[0] * w, pts[i][1] + nn[1] * w]); R.push([pts[i][0] - nn[0] * w, pts[i][1] - nn[1] * w]); }
  return `M ${L.map(fmt).join(" L ")} L ${R.reverse().map(fmt).join(" L ")} Z`;
};
// A soft band whose edges are smoothed: a cloth end or a streamer that waves with phase ph.
export const streamer = (x0: number, y0: number, len: number, w0: number, w1: number, ph: number, amp = 12, dir = 1, k = 9): string => {
  const pts: number[][] = [];
  for (let i = 0; i <= k; i++) { const u = i / k; pts.push([x0 + dir * len * u, y0 + Math.sin(ph + u * 5.0) * amp * Math.pow(u, 0.8) + u * u * 14]); }
  return ribbon(pts, w0, w1, 0.8);
};
