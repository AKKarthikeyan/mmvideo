// WINDMAP layers (UPSC monsoon film): every layer id in CONTRACT_UPSC.md. A layer returns shapes for three stacks:
// under (drawn on the land, below India), over (above India: arrows, glows, lines). Labels and badges are drawn by windmap.tsx.
// Every layer is drawn only from at(layer.key). No figure is typed here: quantities on screen come from lab() in windmap.tsx.
import React from "react";
import {C} from "../../palette";
import {ROUND, ease, easeIO} from "../../ui";
import {BOXES, G, curve, type Box, type Focus, type LL, type Pt} from "./windmap_geo";
import {Cloud, FlowArrow, INK, PillBox, Rain, Shimmer} from "./windmap_parts";

export type Layer = {id: string; key: string; badge?: {lab: string; key: string}; pos?: string; to?: string; items?: {text?: string; lab?: string; at: string; key: string}[]};
export type WindmapSpec = {focus: Focus; zoomFromBeach?: boolean; layers: Layer[]};
export type Ctx = {f: number; dur: number; at: (k: string) => number; B: Box; focus: Focus; P: (lon: number, lat: number) => Pt; spec: WindmapSpec; clipId: string};
type Out = {under?: React.ReactNode; over?: React.ReactNode};

const prog = (f: number, t: number, n = 26) => ease(f, t, t + n);
const pts = (P: Ctx["P"], l: LL[]): Pt[] => l.map(([a, b]) => P(a, b));
const unit = (B: Box) => B.k / 25.714;     // 1 for the India box
const hot = "#F2542D";

const labelAt = (c: Ctx, has: string) => {
  for (const l of c.spec.layers) for (const it of l.items ?? []) if ((it.text ?? "").includes(has)) return c.at(it.key);
  return null;
};
const layerKey = (c: Ctx, id: string) => { const l = c.spec.layers.find((x) => x.id === id); return l ? c.at(l.key) : null; };

// ---- individual layers ---------------------------------------------------------------------------------------------
const seabreezeGiant = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), w = c.focus === "india" ? 104 : 70;
  return {over: <FlowArrow c={pts(c.P, G.giant)} f={c.f} p={prog(c.f, t, 34)} w={w} fill={C.white} chev={C.blue} speed={3}/>};
};

const monsoonSw = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), w = c.focus === "ocean" ? 40 : 30;
  return {over: <>{G.swArrows.map((a, i) => <FlowArrow key={i} c={pts(c.P, a)} f={c.f} p={prog(c.f, t + i * 12, 40)} w={w} fill={C.white} chev={C.blue} speed={3}/>)}</>};
};

const equator = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), a = c.P(c.B.lon0 - 1, 0), b = c.P(c.B.lon1 + 1, 0), p = prog(c.f, t, 30);
  if (p <= 0.003) return {};
  const x2 = a.x + (b.x - a.x) * p;
  return {over: <g>
    <line x1={a.x} y1={a.y} x2={x2} y2={b.y} stroke={C.white} strokeWidth={13} strokeLinecap="round"/>
    <line x1={a.x} y1={a.y} x2={x2} y2={b.y} stroke={INK} strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-c.f * 0.8}/>
    <PillBox x={c.P(80.5, 0).x} y={c.P(80.5, 0).y - 40} text="EQUATOR" f={c.f} at={t + 14} size={28}/>
  </g>};
};

const tradesSe = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), bd = layerKey(c, "bend");
  return {over: <>{G.trades.map((a, i) => {
    const headFade = bd === null ? 1 : 1 - ease(c.f, bd + i * 14, bd + i * 14 + 6);
    return <FlowArrow key={i} c={pts(c.P, a.trade)} f={c.f} p={prog(c.f, t + i * 10, 36)} w={36} fill={C.yellow} chev={C.white} speed={2.6} head={headFade > 0.05}/>;
  })}</>};
};

const cross = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), a = c.P(40, 11), b = c.P(60, -11), p = prog(c.f, t, 22), h = (b.y - a.y) * p, y0 = c.P(0, 0).y - h / 2;
  if (p <= 0.003) return {};
  return {under: <g>
    <rect x={a.x} y={y0} width={b.x - a.x} height={h} rx={14} fill={C.yellow} opacity={0.36}/>
    <rect x={a.x} y={y0} width={b.x - a.x} height={h} rx={14} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={-c.f * 0.6}/>
  </g>};
};

const bend = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key);
  return {over: <>{G.trades.map((a, i) => <FlowArrow key={i} c={pts(c.P, a.bend)} f={c.f} p={prog(c.f, t + i * 14, 44)} w={36} fill={C.orange} chev={C.white} speed={2.8}/>)}</>};
};

// glow clipped to land (flat translucent rings)
const hotGlow = (c: Ctx, t: number, rScale = 1, extra = 0): React.ReactNode => {
  const o = c.P(...G.hotNW), u = unit(c.B), p = prog(c.f, t, 30), beat = 1 + 0.035 * Math.sin((c.f - t) / 6);
  if (p <= 0.003) return null;
  const R = (r: number, col: string, op: number, sx = 1.0) => <ellipse cx={o.x} cy={o.y} rx={r * u * 1.18 * rScale * p * beat * sx} ry={r * u * 0.92 * rScale * p * beat} fill={col} opacity={op}/>;
  return <g clipPath={`url(#${c.clipId})`}>{R(190 + extra, hot, 0.32)}{R(135 + extra, C.orange, 0.42)}{R(78 + extra * 0.5, C.yellow, 0.55)}</g>;
};

const hotNw = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), o = c.P(...G.hotNW), u = unit(c.B), gaugeAt = labelAt(c, "HARDLY");
  const gx = c.P(56.5, 26.6).x, gy = c.P(56.5, 26.6).y;
  const gp = gaugeAt === null ? 0 : ease(c.f, gaugeAt, gaugeAt + 14), lvl = 0.07 + 0.015 * Math.sin(c.f / 7);
  return {over: <g>
    {hotGlow(c, t)}
    <Shimmer x={o.x - 120 * u} y={o.y - 200 * u} w={240 * u} h={200 * u} f={c.f} color={C.white} opacity={prog(c.f, t + 14, 20) * 0.9}/>
    {gp > 0.01 && <g transform={`translate(${gx} ${gy}) scale(${gp})`}>
      <rect x={-34} y={-52} width={68} height={110} rx={10} fill={INK} transform="translate(0 8)" opacity={0.3}/>
      <rect x={-34} y={-52} width={68} height={110} rx={10} fill={C.white} stroke={INK} strokeWidth={6}/>
      <rect x={-27} y={58 - 7 - 100 * lvl} width={54} height={100 * lvl} fill={C.blue}/>
      {[-30, -8, 14, 36].map((yy) => <line key={yy} x1={-34} x2={-16} y1={yy} y2={yy} stroke={INK} strokeWidth={4}/>)}
      <rect x={-34} y={-52} width={68} height={110} rx={10} fill="none" stroke={INK} strokeWidth={6}/>
    </g>}
  </g>};
};

const swirl = (cx: number, cy: number, r: number, rot: number, sc: number): React.ReactNode => {
  const arm = (a0: number) => {
    const d = Array.from({length: 26}).map((_, i) => { const th = a0 + i * 0.26, rr = r * (0.18 + i / 26 * 0.82); return `${(cx + Math.cos(th) * rr).toFixed(1)} ${(cy + Math.sin(th) * rr * 0.62).toFixed(1)}`; });
    return "M" + d.join("L");
  };
  return <g transform={`rotate(${rot} ${cx} ${cy}) translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`}>
    {[0, Math.PI].map((a, i) => <g key={i}><path d={arm(a)} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round"/><path d={arm(a)} fill="none" stroke={C.white} strokeWidth={10} strokeLinecap="round"/></g>)}
  </g>;
};

const heatlow = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), o = c.P(...G.hotNW), u = unit(c.B), p = prog(c.f, t, 28);
  if (p <= 0.003) return {};
  const dome = `M${o.x - 175 * u} ${o.y}a${175 * u} ${150 * u} 0 1 0 ${350 * u} 0a${175 * u} ${150 * u} 0 1 0 ${-350 * u} 0Z`;
  return {over: <g>
    <g clipPath={`url(#${c.clipId})`} opacity={p}><path d={dome} fill={hot} opacity={0.3 + 0.05 * Math.sin(c.f / 6)}/></g>
    <path d={dome} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="16 12" opacity={p * 0.8} strokeDashoffset={-c.f * 0.5}/>
    <Shimmer x={o.x - 150 * u} y={o.y - 190 * u} w={300 * u} h={190 * u} f={c.f} n={8} opacity={p}/>
    {swirl(o.x, o.y + 10 * u, 120 * u, -c.f * 2.2, p)}
  </g>};
};

const lat20 = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), a = c.P(c.B.lon0 - 1, 20), b = c.P(c.B.lon1 + 1, 20), p = prog(c.f, t, 34);
  if (p <= 0.003) return {};
  const x2 = a.x + (b.x - a.x) * p;
  return {over: <g>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke={C.white} strokeWidth={14} strokeLinecap="round"/>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke={C.red} strokeWidth={6} strokeDasharray="26 14" strokeDashoffset={-c.f * 0.8}/>
  </g>};
};

const itczJuly = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), slide = easeIO(c.f, t, t + 56), off = (1 - slide) * 21 * c.B.k, p = prog(c.f, t, 24);
  if (p <= 0.003) return {};
  const mid = curve(pts(c.P, G.itcz), 10), hw = 2.6 * c.B.k;
  const top = mid.pts.map((q) => `${q.x.toFixed(1)} ${(q.y - hw).toFixed(1)}`), bot = mid.pts.map((q) => `${q.x.toFixed(1)} ${(q.y + hw).toFixed(1)}`).reverse();
  const band = "M" + top.join("L") + "L" + bot.join("L") + "Z";
  const clouds = Array.from({length: 7}).map((_, i) => {
    const q = mid.pts[Math.min(mid.pts.length - 1, Math.round((i + 0.5) / 7 * (mid.pts.length - 1)))];
    return <Cloud key={i} x={q.x} y={q.y - 6 + (i % 2 ? 12 : -10)} s={0.95 + (i % 3) * 0.12} bob={Math.sin(c.f / 12 + i * 1.7) * 5}/>;
  });
  const q0 = mid.pts[Math.round(mid.pts.length * 0.3)], q1 = mid.pts[Math.round(mid.pts.length * 0.78)];
  return {over: <g transform={`translate(0 ${off})`} opacity={p}>
    <path d={band} fill={C.white} opacity={0.62}/>
    <path d={band} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="20 12" strokeDashoffset={-c.f * 0.6}/>
    {clouds}
    <Rain x={q0.x} y={q0.y + 40} w={q1.x - q0.x} h={80} f={c.f} n={16} opacity={ease(c.f, t + 50, t + 70)} seed={3}/>
  </g>};
};

const lerpLL = (a: LL[], b: LL[], u: number): LL[] => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * u, p[1] + (b[i][1] - p[1]) * u] as LL);
const trough = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), mv = c.spec.layers.find((x) => x.id === "trough-move");
  const start = L.pos === "north" ? G.troughNorth : G.troughSouth, end = mv?.to === "south" ? G.troughSouth : G.troughNorth;
  const tm = mv ? c.at(mv.key) : null, u = tm === null ? 0 : easeIO(c.f, tm, tm + 70);
  const ll = lerpLL(start, end, u), p = prog(c.f, t, 40);
  if (p <= 0.003) return {};
  const west = c.P(...ll[0]), east = c.P(...ll[ll.length - 1]);
  const ac = labelAt(c, "ACTIVE"), br = labelAt(c, "BREAK");
  const act = ac === null ? 0 : ease(c.f, ac, ac + 14) * (br === null ? 1 : 1 - ease(c.f, br - 2, br + 10));
  const brk = br === null ? 0 : ease(c.f, br, br + 14);
  const a = c.P(75, 21.4), b = c.P(88, 17), fa = c.P(78, 31.4), fb = c.P(93, 27.2);
  return {over: <g>
    <FlowArrow c={pts(c.P, ll)} f={c.f} p={p} w={20} fill={C.red} chev={C.white} head={false} speed={1.4} ink={6}/>
    {p > 0.95 && <g><circle cx={east.x} cy={east.y} r={14} fill={C.red} stroke={INK} strokeWidth={6}/></g>}
    <g transform={`translate(${west.x} ${west.y})`}><circle r={30} fill={C.red} stroke={INK} strokeWidth={7}/><text y={13} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={38} fill={C.white}>L</text></g>
    {act > 0.01 && <g opacity={act}>{[0, 1, 2].map((i) => <Cloud key={i} x={a.x + (b.x - a.x) * (0.15 + i * 0.35)} y={a.y - 8 + (i % 2) * 18} s={1.0} bob={Math.sin(c.f / 11 + i) * 5}/>)}
      <Rain x={a.x} y={a.y + 10} w={b.x - a.x} h={150} f={c.f} n={24} seed={5}/></g>}
    {brk > 0.01 && <g opacity={brk}>{[0, 1, 2, 3].map((i) => <Cloud key={i} x={fa.x + (fb.x - fa.x) * (0.1 + i * 0.27)} y={fa.y + (i % 2) * 12} s={1.0} bob={Math.sin(c.f / 11 + i) * 5}/>)}
      <Rain x={fa.x} y={fa.y + 24} w={fb.x - fa.x} h={90} f={c.f} n={24} seed={8}/></g>}
  </g>};
};

const mascarene = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), o = c.P(...G.mascarene), u = 1, p = ease(c.f, t, t + 16);
  if (p <= 0.003) return {};
  return {over: <g transform={`translate(${o.x} ${o.y}) scale(${p})`}>
    {[82, 60].map((r, i) => <ellipse key={r} rx={r} ry={r * 0.72} fill="none" stroke={INK} strokeWidth={4.5} strokeDasharray={i ? "none" : "14 10"} opacity={0.75}/>)}
    <g transform={`rotate(${-c.f * 1.2})`}>{[0, 120, 240].map((a) => <g key={a} transform={`rotate(${a}) translate(${82 * u} 0) scale(0.55)`}><polygon points="-14,-22 10,0 -14,22" fill={C.white} stroke={INK} strokeWidth={5} strokeLinejoin="round"/></g>)}</g>
    <circle r={40} fill={C.royal} stroke={INK} strokeWidth={7}/>
    <text y={20} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={56} fill={C.white}>H</text>
  </g>};
};

const somali = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key);
  return {over: <FlowArrow c={pts(c.P, G.somali)} f={c.f} p={prog(c.f, t, 80)} w={22} fill={C.lime} chev={C.greenDark} speed={4.2} ink={6}/>};
};

const tibet = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), p = ease(c.f, t, t + 22);
  if (p <= 0.003) return {};
  const cp = pts(c.P, G.tibet), cx = cp.reduce((a, q) => a + q.x, 0) / cp.length, cy = cp.reduce((a, q) => a + q.y, 0) / cp.length;
  const cv = curve([...cp, cp[0]], 8), d = "M" + cv.pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("L") + "Z";
  const hatch = Array.from({length: 24}).map((_, i) => { const x = cx - 420 + i * 36; return `M${x} ${cy + 220}L${x + 220} ${cy - 220}`; }).join("");
  const id = "wmtib";
  return {under: <g transform={`translate(${cx} ${cy}) scale(${p}) translate(${-cx} ${-cy})`}>
    <clipPath id={id}><path d={d}/></clipPath>
    <path d={d} fill={INK} transform="translate(0 9)" opacity={0.3}/>
    <path d={d} fill="#C99B68"/>
    <g clipPath={`url(#${id})`}><path d={hatch} stroke="#A97A48" strokeWidth={9}/><path d={d} fill="none" stroke="#E6C08C" strokeWidth={34} transform={`translate(${cx} ${cy}) scale(0.82) translate(${-cx} ${-cy})`} opacity={0.0}/></g>
    <path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
  </g>, over: (() => {
    const ib = labelAt(c, "BARRIER"), q = ib === null ? 0 : ease(c.f, ib, ib + 16);
    if (q <= 0.01) return null;
    const s0 = c.P(86, 17), s1 = c.P(85.5, 24), s2 = c.P(87, 27.3);
    return <g opacity={q}>
      <FlowArrow c={[s0, s1, s2]} f={c.f} p={1} w={26} fill={C.white} chev={C.blue} speed={2.6}/>
      <Shimmer x={cx - 170} y={cy - 110} w={340} h={130} f={c.f} n={7} color={C.red} opacity={0.95}/>
    </g>;
  })()};
};

const tej = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), p = prog(c.f, t, 70), cp = pts(c.P, G.tej), ch = c.P(...G.chennai);
  return {over: <g>
    <g transform="translate(0 40)" opacity={0.28}><FlowArrow c={cp} f={c.f} p={p} w={16} fill={INK} chev={INK} shadow={false} speed={0} ink={0}/></g>
    <FlowArrow c={cp} f={c.f} p={p} w={16} fill={C.white} chev={C.red} speed={9} ink={5}/>
    {[-22, 22].map((dy) => <g key={dy} transform={`translate(0 ${dy})`} opacity={0.8}><FlowArrow c={cp} f={c.f + dy * 3} p={p * 0.96} w={5} fill={C.white} chev={C.white} head={false} shadow={false} speed={12} ink={2}/></g>)}
    {p > 0.4 && <g opacity={ease(c.f, t + 30, t + 44)}><circle cx={ch.x} cy={ch.y} r={11} fill={C.red} stroke={INK} strokeWidth={5}/>
      <text x={ch.x} y={ch.y + 40} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={26} fill={INK} stroke={C.white} strokeWidth={7} paintOrder="stroke">CHENNAI</text></g>}
  </g>};
};

export const LAYERS: Record<string, (c: Ctx, L: Layer) => Out> = {
  "seabreeze-giant": seabreezeGiant, "monsoon-sw": monsoonSw, equator, "trades-se": tradesSe, cross, bend, "hot-nw": hotNw, heatlow, lat20, "itcz-july": itczJuly,
  trough, "trough-move": () => ({}), mascarene, somali, tibet, tej, labels: () => ({}),
};
void BOXES; void Rain;
