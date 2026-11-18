// Flow Build icon set: each icon is a list of primitives on a 100x100 box, with a colour role.
// Skins decide how roles are painted (line, flat fill, sketchy rough.js, isometric). No text inside icons.
export type Role = "fill" | "accent" | "light" | "line" | "solid";
export type Prim = {d: string; role: Role};

const circle = (cx: number, cy: number, r: number) => `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
const rect = (x: number, y: number, w: number, h: number) => `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
const poly = (pts: number[][]) => "M " + pts.map(p => p.join(" ")).join(" L ") + " Z";
const line = (x1: number, y1: number, x2: number, y2: number) => `M ${x1} ${y1} L ${x2} ${y2}`;
const gear = (cx: number, cy: number, r1: number, r2: number, n: number) => {
  const pts: number[][] = [];
  for (let i = 0; i < n * 2; i++) {
    const a0 = (Math.PI * i) / n, a1 = (Math.PI * (i + 1)) / n, r = i % 2 ? r1 : r2;
    pts.push([cx + r * Math.cos(a0), cy + r * Math.sin(a0)], [cx + r * Math.cos(a1), cy + r * Math.sin(a1)]);
  }
  return poly(pts.map(p => p.map(v => Math.round(v * 10) / 10)));
};

export const ICONS: Record<string, Prim[]> = {
  saver: [
    {d: circle(46, 28, 15), role: "fill"},
    {d: "M 18 90 Q 18 56 46 56 Q 74 56 74 90 Z", role: "fill"},
    {d: circle(78, 70, 14), role: "accent"},
    {d: circle(78, 70, 7), role: "line"},
  ],
  bank: [
    {d: poly([[8, 38], [50, 12], [92, 38]]), role: "accent"},
    {d: rect(12, 38, 76, 7), role: "solid"},
    {d: rect(18, 48, 9, 30), role: "light"}, {d: rect(36, 48, 9, 30), role: "light"},
    {d: rect(55, 48, 9, 30), role: "light"}, {d: rect(73, 48, 9, 30), role: "light"},
    {d: rect(8, 80, 84, 9), role: "solid"},
  ],
  factory: [
    {d: "M 8 90 V 52 L 30 64 V 52 L 52 64 V 52 L 70 64 V 22 H 84 V 90 Z", role: "fill"},
    {d: rect(16, 72, 10, 10), role: "accent"}, {d: rect(36, 72, 10, 10), role: "accent"}, {d: rect(56, 72, 10, 10), role: "accent"},
    {d: line(72, 16, 82, 6), role: "line"},
  ],
  percent: [
    {d: circle(50, 50, 40), role: "light"},
    {d: circle(35, 35, 9), role: "accent"},
    {d: circle(65, 65, 9), role: "accent"},
    {d: line(68, 28, 32, 72), role: "line"},
  ],
  gear: [
    {d: gear(50, 50, 30, 40, 9), role: "fill"},
    {d: circle(50, 50, 14), role: "accent"},
  ],
  warning: [
    {d: poly([[50, 10], [93, 88], [7, 88]]), role: "accent"},
    {d: line(50, 38, 50, 64), role: "line"},
    {d: circle(50, 75, 4), role: "solid"},
  ],
  trophy: [
    {d: "M 30 14 H 70 V 38 Q 70 60 50 62 Q 30 60 30 38 Z", role: "accent"},
    {d: "M 30 22 Q 14 22 16 36 Q 18 46 30 46", role: "line"},
    {d: "M 70 22 Q 86 22 84 36 Q 82 46 70 46", role: "line"},
    {d: rect(45, 62, 10, 14), role: "solid"},
    {d: rect(30, 76, 40, 11), role: "fill"},
  ],
  bars: [
    {d: rect(14, 48, 16, 40), role: "light"},
    {d: rect(42, 30, 16, 58), role: "fill"},
    {d: rect(70, 14, 16, 74), role: "accent"},
    {d: line(6, 90, 94, 90), role: "line"},
  ],
};
