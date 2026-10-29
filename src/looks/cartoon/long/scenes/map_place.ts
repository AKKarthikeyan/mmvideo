// MAP scene: automatic placement of label chips and notes. A chip is put where it covers the least land, does not touch a card, another
// chip or another state's pin, stays inside the safe area, and keeps its leader line short and uncrossed. Pure geometry (no frame
// input), so every frame of a scene places the same way. Land comes from a coarse grid made once with canvas Path2D from the geo paths.
// Chips are placed greedily; several orders are tried and the cheapest result is kept.
import {GEO, MAP, SMALL} from "./map_geo";

export type Rect = {x0: number; y0: number; x1: number; y1: number};
export type Item = {id: string; state: string; pinX: number; pinY: number; w: number; h: number; note?: boolean};
export type Placed = {cx: number; cy: number; leader: boolean};
type Pin = {state: string; x: number; y: number};

const CELL = 5, GW = Math.ceil(1000 / CELL), GH = Math.ceil(1100 / CELL);
let GRID: Uint8Array | null = null;     // 0 sea, else state index + 1
const AREA: number[] = GEO.map(() => 0);   // land cells per state
const grid = (): Uint8Array => {
  if (GRID) return GRID;
  const g = new Uint8Array(GW * GH);
  if (typeof document !== "undefined") {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) GEO.forEach((s, k) => {
      const p = new Path2D(s.d), [x0, y0, x1, y1] = s.bbox;
      for (let j = Math.max(0, Math.floor(y0 / CELL)); j <= Math.min(GH - 1, Math.floor(y1 / CELL)); j++)
        for (let i = Math.max(0, Math.floor(x0 / CELL)); i <= Math.min(GW - 1, Math.floor(x1 / CELL)); i++)
          if (ctx.isPointInPath(p, (i + 0.5) * CELL, (j + 0.5) * CELL, "evenodd")) { g[j * GW + i] = k + 1; AREA[k]++; }
    });
  }
  GRID = g; return g;
};
const landAt = (sx: number, sy: number): number => {
  const i = Math.floor(((sx - MAP.x) / MAP.s) / CELL), j = Math.floor(((sy - MAP.y) / MAP.s) / CELL);
  return i < 0 || j < 0 || i >= GW || j >= GH ? 0 : grid()[j * GW + i];
};

const hit = (a: Rect, b: Rect, m = 0) => a.x0 < b.x1 + m && a.x1 > b.x0 - m && a.y0 < b.y1 + m && a.y1 > b.y0 - m;
const inside = (r: Rect, x: number, y: number, m = 0) => x > r.x0 - m && x < r.x1 + m && y > r.y0 - m && y < r.y1 + m;
const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
const cross = (a: number[], b: number[]) => ccw(a[0], a[1], b[0], b[1], b[2], b[3]) !== ccw(a[2], a[3], b[0], b[1], b[2], b[3]) && ccw(a[0], a[1], a[2], a[3], b[0], b[1]) !== ccw(a[0], a[1], a[2], a[3], b[2], b[3]);
export const BOUNDS: Rect = {x0: 100, y0: 66, x1: 1820, y1: 932};

const RADII = [0, 64, 100, 140, 185, 235, 295, 365, 445];

const run = (order: Item[], forbid: Rect[], pins: Pin[], keep: Set<string>, labelled: Set<string>) => {
  const out: Record<string, Placed> = {};
  const rects: Rect[] = [], leaders: number[][] = [];
  let total = 0;
  for (const it of order) {
    const own = GEO.findIndex((s) => s.name === it.state) + 1;
    let best: {score: number; cx: number; cy: number; r: number} | null = null;
    for (const r of RADII) {
      const nAng = r === 0 ? 1 : 24;
      for (let a = 0; a < nAng; a++) {
        const th = (a / nAng) * Math.PI * 2 + (r === 0 ? 0 : 0.11);
        const cx = it.pinX + r * Math.cos(th), cy = it.pinY + r * Math.sin(th);
        const R: Rect = {x0: cx - it.w / 2, y0: cy - it.h / 2, x1: cx + it.w / 2, y1: cy + it.h / 2};
        let score = r * 1.1;
        if (R.x0 < BOUNDS.x0 || R.x1 > BOUNDS.x1 || R.y0 < BOUNDS.y0 || R.y1 > BOUNDS.y1) score += 6000;
        for (const f of forbid) if (hit(R, f, 6)) score += 2500;
        for (const q of rects) if (hit(R, q, 10)) score += 2500;
        if ((r > 0 || SMALL.has(it.state) || it.note) && inside(R, it.pinX, it.pinY, 14)) score += 3000;      // would hide its own pin / ring marker
        for (const p of pins) if (p.state !== it.state && inside(R, p.x, p.y, 8)) score += labelled.has(p.state) ? 1800 : 500;
        // colour information hidden under the chip: the share of each state's area it covers, weighted (own state a little, labelled and
        // must-stay-visible states a lot). A chip inside a big state costs little; a chip on a small state costs the whole state.
        const nx = Math.ceil(it.w / 20) + 1, ny = Math.ceil(it.h / 20) + 1, per = (it.w * it.h) / (nx * ny);
        const hid: Record<number, number> = {};
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const v = landAt(R.x0 + (it.w * i) / (nx - 1), R.y0 + (it.h * j) / (ny - 1));
          if (v) hid[v] = (hid[v] ?? 0) + per;
        }
        for (const k of Object.keys(hid)) {
          const v = +k, nm = GEO[v - 1].name, share = Math.min(1, hid[v] / Math.max(1, AREA[v - 1] * CELL * CELL * MAP.s * MAP.s));
          const wgt = keep.has(nm) || (v === own && it.note) ? 6 : v === own ? 0.9 : labelled.has(nm) ? 2 : 0.6;
          score += 400 * wgt * share;
        }
        for (const l of leaders) for (let k = 1; k < 10; k++) if (inside(R, l[0] + ((l[2] - l[0]) * k) / 10, l[1] + ((l[3] - l[1]) * k) / 10, 4)) { score += 1500; break; }
        if (r > 0) {
          let over = 0;
          for (let k = 1; k < 13; k++) { const v = landAt(it.pinX + ((cx - it.pinX) * k) / 13, it.pinY + ((cy - it.pinY) * k) / 13); if (v && v !== own) over++; }
          score += over * 14;
          for (const q of rects) for (let k = 1; k < 10; k++) if (inside(q, it.pinX + ((cx - it.pinX) * k) / 10, it.pinY + ((cy - it.pinY) * k) / 10, 2)) { score += 1500; break; }
          const seg = [it.pinX, it.pinY, cx, cy];
          for (const l of leaders) if (cross(seg, l)) score += 450;
          for (const p of pins) if (p.state !== it.state && labelled.has(p.state)) {      // the line must not pass through another labelled pin
            const dx = cx - it.pinX, dy = cy - it.pinY, t = Math.max(0, Math.min(1, ((p.x - it.pinX) * dx + (p.y - it.pinY) * dy) / (dx * dx + dy * dy)));
            if (Math.hypot(it.pinX + t * dx - p.x, it.pinY + t * dy - p.y) < 14) score += 300;
          }
        }
        if (!best || score < best.score) best = {score, cx, cy, r};
      }
    }
    const b = best!;
    total += b.score;
    out[it.id] = {cx: b.cx, cy: b.cy, leader: b.r > 0};
    rects.push({x0: b.cx - it.w / 2, y0: b.cy - it.h / 2, x1: b.cx + it.w / 2, y1: b.cy + it.h / 2});
    if (b.r > 0) leaders.push([it.pinX, it.pinY, b.cx, b.cy]);
  }
  return {out, total};
};

export const place = (items: Item[], forbid: Rect[], pins: Pin[], keep: Set<string>): Record<string, Placed> => {
  const labelled = new Set(items.map((i) => i.state));
  const notes = items.filter((i) => i.note), chips = items.filter((i) => !i.note);
  const orders = [chips, [...chips].reverse(), [...chips].sort((a, b) => a.pinX - b.pinX), [...chips].sort((a, b) => b.pinX - a.pinX),
    [...chips].sort((a, b) => a.pinY - b.pinY), [...chips].sort((a, b) => b.pinY - a.pinY), [...chips].sort((a, b) => b.w - a.w)];
  let best: ReturnType<typeof run> | null = null;
  const seen = new Set<string>();
  for (const o of orders) {
    const k = o.map((i) => i.id).join("|");
    if (seen.has(k)) continue;
    seen.add(k);
    const res = run([...notes, ...o], forbid, pins, keep, labelled);
    if (!best || res.total < best.total) best = res;
  }
  return best ? best.out : {};
};
