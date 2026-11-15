// GEO-04 Part 1, builder V3: `subduction` (s029 both, s031 join, s036 summary). A slice of the Earth: a mid-ocean ridge at the left, an ocean plate
// crossing the sea and sinking at a trench under a continent, a composite volcano inland over the sinking plate. Motion follows f and at(key) only.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, lerp} from "../kit";
import {FlowArrow, type AP, type Pt} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {V3Defs, Sky, Rise, PathGlow, seg, prog} from "./analogy_v3_kit";

// ---- geometry --------------------------------------------------------------------------------------------------------------------------------
const cr = (pts: Pt[], n = 10): Pt[] => {
  const P = [pts[0], ...pts, pts[pts.length - 1]], out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [P[i], P[i + 1], P[i + 2], P[i + 3]];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const off = (pts: Pt[], d: number): Pt[] => pts.map((p, i) => {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  return [p[0] - (dy / L) * d, p[1] + (dx / L) * d] as Pt;
});
const path = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
const poly = (a: Pt[], b: Pt[]) => path(a) + path([...b].reverse()).replace("M", "L") + "Z";

const R_TOP = cr([[282, 523], [340, 540], [460, 566], [620, 590], [780, 601], [900, 606], [960, 614], [1010, 636], [1055, 676], [1100, 724], [1170, 764], [1300, 838], [1500, 954], [1700, 1070], [1780, 1116]], 8);
const L_TOP = cr([[-60, 606], [60, 580], [160, 545], [235, 525], [257, 522]], 8);
const TH_C = 34, TH = 86;
const rMid = off(R_TOP, TH_C), rBot = off(R_TOP, TH), lMid = off(L_TOP, TH_C), lBot = off(L_TOP, TH);
const CONT_TOP: Pt[] = cr([[1090, 712], [1130, 650], [1175, 566], [1220, 490], [1262, 452]], 8);
const LAND = (x: number) => 424 - 4 * Math.sin(x / 160) - 3 * Math.sin(x / 60);
const CONT_BASE_Y = 592;
const VX = 1500, VT = 238;
const slabC = (x: number) => { let best = R_TOP[0]; for (const p of R_TOP) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p; return best[1] + 48; };

const SeaDefs: React.FC = () => (
  <defs>
    <linearGradient id="v3-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9dcec"/><stop offset="0.5" stopColor="#4f9bc2"/><stop offset="1" stopColor="#1f5a86"/></linearGradient>
    <linearGradient id="v3-crust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#566d82"/><stop offset="1" stopColor="#3b4f63"/></linearGradient>
    <linearGradient id="v3-lith" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8c9db0"/><stop offset="1" stopColor="#6c7f94"/></linearGradient>
    <linearGradient id="v3-ccrust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9bd8a"/><stop offset="1" stopColor="#a8896a"/></linearGradient>
    <linearGradient id="v3-clith" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a8573"/><stop offset="1" stopColor="#7a6556"/></linearGradient>
    <linearGradient id="v3-mt2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c5703f"/><stop offset="0.55" stopColor="#a04a29"/><stop offset="1" stopColor="#6e2b1a"/></linearGradient>
    <linearGradient id="v3-ash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a39d94"/><stop offset="1" stopColor="#6d665f"/></linearGradient>
    <clipPath id="v3-slice"><rect x={60} y={96} width={1800} height={940} rx={34}/></clipPath>
  </defs>
);

const Volcano: React.FC<{f: number; glow: number; sticky: number; burst: number}> = ({f, glow, sticky, burst}) => {
  const cone = `M1332,424 Q1420,380 1452,300 Q1462,262 1470,${VT} Q1500,${VT + 14} 1530,${VT} Q1538,262 1548,300 Q1580,380 1668,424 Z`;
  const sc = (s: number) => `translate(${VX} ${VT}) scale(${s} ${s}) translate(${-VX} ${-VT})`;
  return (
    <g>
      <defs><clipPath id="v3-cone"><path d={cone}/></clipPath></defs>
      <ellipse cx={VX} cy={428} rx={200} ry={16} fill="#2a1a0c" opacity={0.25}/>
      <g clipPath="url(#v3-cone)">
        {[0, 1, 2, 3, 4, 5, 6].map((k) => <path key={k} d={cone} transform={sc(1 - k * 0.135)} fill={k % 2 ? "#6a3f30" : "url(#v3-ash)"} stroke="#3c2a22" strokeWidth={1.2}/>)}
        <path d={`M${VX},${VT} L1668,424 L${VX + 10},424 Z`} fill="#000" opacity={0.14}/>
        <path d={cone} fill="url(#v3-dots)" opacity={0.6}/>
      </g>
      <path d={cone} fill="none" stroke="#3a2a22" strokeWidth={2.4} strokeLinejoin="round"/>
      <PathGlow d={cone} a={glow} f={f} w={9}/>
      {/* sticky lava plug, bubbles trapped in it */}
      <g opacity={0.35 + 0.65 * sticky}>
        <path d={`M1478,${VT + 4} Q1500,${VT - 16 - 8 * sticky} 1522,${VT + 4} Q1500,${VT + 14} 1478,${VT + 4} Z`} fill="#b04a22" stroke="#6a2410" strokeWidth={2}/>
        {sticky > 0.2 && [[1492, VT - 2], [1504, VT - 5], [1511, VT + 1]].map((b, i) => <circle key={i} cx={b[0]} cy={b[1] + Math.sin(f / 7 + i) * 0.8} r={3 + i * 0.6} fill="#ffd9a0" opacity={0.85}/>)}
      </g>
      {/* gas plume */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const u = (f * 0.0075 + i / 6) % 1, x = VX + 6 + u * 70 + Math.sin(u * 7 + i) * 8, y = VT - 8 - u * 150, r = 14 + u * 36, a = Math.min(1, u * 5) * (1 - u) * 0.82 * (0.45 + 0.55 * Math.max(sticky, burst));
        return <circle key={i} cx={x} cy={y} r={r} fill={i % 2 && burst > 0.3 ? "#6d665f" : "url(#ak-cloud)"} opacity={a}/>;
      })}
      {burst > 0.05 && Array.from({length: 7}).map((_, i) => {
        const u = ((f * 0.02 + i * 0.17) % 1), ang = -1.9 + i * 0.28, rr = 30 + u * 150 * burst;
        return <circle key={i} cx={VX + Math.cos(ang) * rr} cy={VT - 6 + Math.sin(ang) * rr * 0.9} r={5 - u * 3} fill="#ffb347" opacity={(1 - u) * burst}/>;
      })}
    </g>
  );
};

type SliceProps = {f: number; at: (k: string) => number; mode: string};
const Slice: React.FC<SliceProps> = ({f, at, mode}) => {
  const both = mode === "both", join = mode === "join", summ = mode === "summary";
  const pe = both ? seg(f, at("pe"), 20) * (1 - 0.55 * seg(f, at("pe") + 110, 50)) : 0;
  const sk = both ? seg(f, at("sk"), 40) : join ? 0.5 : 0, pt = both ? seg(f, at("pt"), 40) : join ? 0.5 : 0;
  const sc = join ? seg(f, at("sc"), 30) : summ ? seg(f, at("st"), 30) : 0, rb = join ? seg(f, at("rb"), 30) : summ ? seg(f, at("rb"), 30) : 0;
  const burst = summ ? seg(f, at("st") + 20, 40) : join ? seg(f, at("sc") + 30, 50) * 0.7 : 0;
  const waterTop = 450;
  const waterPoly = `M-20,${waterTop}L1262,${waterTop}` + path([...CONT_TOP].reverse()).replace("M", "L") + path([...R_TOP].reverse()).replace("M", "L") + "L270,538" + path([...L_TOP].reverse()).replace("M", "L") + "L-20,606Z";
  const wob = (x: number) => waterTop + 3 * Math.sin(x / 70 + f / 22) + 2 * Math.sin(x / 31 - f / 14);
  let wave = ""; for (let x = -20; x <= 1262; x += 18) wave += `${wave ? "L" : "M"}${x} ${wob(x).toFixed(1)}`;
  const slabArrow: Pt[] = [[880, slabC(880) - 4], [1000, slabC(1000) - 2], [1090, slabC(1090) + 10], [1210, slabC(1210) + 2], [1340, slabC(1340) + 2]];
  const contact = path(cr([[1040, 668], [1090, 718], [1150, 752], [1215, 790]], 6));
  const contBase = `M1090,712L1235,${CONT_BASE_Y}L1900,${CONT_BASE_Y}L1900,${LAND(1900)}`;
  const landPath = (() => { let d = path(CONT_TOP) + `L1262,${LAND(1262).toFixed(1)}`; for (let x = 1262; x <= 1900; x += 24) d += `L${x} ${LAND(x).toFixed(1)}`; return d + `L1900,${CONT_BASE_Y}L1235,${CONT_BASE_Y}Z`; })();
  const crustBot = (() => { let d = path(CONT_TOP.map((p) => [p[0] + 2, p[1] + 2] as Pt)); for (let x = 1262; x <= 1900; x += 24) d += `L${x} ${LAND(x) + (x < 1300 ? 30 : 70)}`; return d; })();
  void contBase; void crustBot;
  const t = f;
  return (
    <g>
      <SeaDefs/>
      <Sky h={waterTop} f={f} sun={[260, 220]}/>
      <rect x={-20} y={480} width={W + 40} height={700} fill="url(#v3-mt2)"/>
      {/* slow mantle flow lines */}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-60 + i * 150},${960 - i * 22} Q${400 + i * 150},${800 + Math.sin(t / 40 + i) * 14} ${900 + i * 120},${900 - i * 10}`} fill="none" stroke="#f0a060" strokeWidth={3} opacity={0.18} strokeDasharray="30 22" strokeDashoffset={-t * 0.6}/>)}
      {/* ridge magma and upwelling */}
      <ellipse cx={270} cy={640} rx={90 + 30 * rb} ry={86} fill="url(#v3-glow)" opacity={0.9}/>
      <path d={`M256,520L284,520L292,660L248,660Z`} fill="url(#v3-lava)"/>
      <Rise x0={270} y0={930} x1={270} y1={528} f={t} n={8} r={8} a={1} seed={3}/>
      {/* water */}
      <path d={waterPoly} fill="url(#v3-sea)"/>
      <path d={wave} fill="none" stroke="#e8f6fb" strokeWidth={3} opacity={0.8}/>
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${120 + i * 190},${490 + (i % 3) * 22} q22,-8 44,0 t44,0`} fill="none" stroke="#e8f6fb" strokeWidth={2} opacity={0.35}/>)}
      {/* oceanic plates: dark crust over lighter lithospheric mantle */}
      {[[L_TOP, lMid, lBot], [R_TOP, rMid, rBot]].map(([top, mid, bot], k) => (
        <g key={k}>
          <path d={poly(top as Pt[], mid as Pt[])} fill="url(#v3-crust)" stroke="#2b3b4b" strokeWidth={1.4}/>
          <path d={poly(mid as Pt[], bot as Pt[])} fill="url(#v3-lith)" stroke="#4d5f73" strokeWidth={1.4}/>
          <path d={poly(top as Pt[], bot as Pt[])} fill="url(#v3-dots)" opacity={0.5}/>
          <path d={path(top as Pt[])} fill="none" stroke="#c7d6e2" strokeWidth={2} opacity={0.5}/>
        </g>
      ))}
      {/* hot new crust near the ridge and pillow lava */}
      <ellipse cx={270} cy={575} rx={95 + 40 * pt} ry={50} fill="url(#v3-glow)" opacity={0.55 + 0.4 * pt}/>
      {[[255, 520, 12], [271, 514, 14], [287, 520, 12], [263, 507, 10], [280, 506, 10], [245, 528, 9], [297, 528, 9]].map((c, i) => (
        <g key={i}><ellipse cx={c[0]} cy={c[1]} rx={c[2] * 1.2} ry={c[2]} fill="url(#v3-lava)" stroke="#8a2a10" strokeWidth={1.4}/><ellipse cx={c[0] - 3} cy={c[1] - 3} rx={c[2] * 0.4} ry={c[2] * 0.25} fill="#fff4c8" opacity={0.7}/></g>
      ))}
      {rb > 0.02 && [-1, 1].map((sd) => (
        <g key={sd} opacity={rb}>
          <path d={`M${270 + sd * 14},508 Q${270 + sd * 120},${520 + (sd > 0 ? 6 : 14)} ${270 + sd * 210 * (0.4 + 0.6 * eo(prog(t, 0, 90)))},${sd > 0 ? 548 : 562}`} fill="none" stroke="#ff8a2a" strokeWidth={10} strokeLinecap="round" opacity={0.9}/>
          <path d={`M${270 + sd * 14},507 Q${270 + sd * 120},${518 + (sd > 0 ? 6 : 14)} ${270 + sd * 180},${sd > 0 ? 543 : 556}`} fill="none" stroke="#fff0b0" strokeWidth={3.5} strokeLinecap="round" strokeDasharray="1 18" strokeDashoffset={-t * 2}/>
        </g>
      ))}
      {/* continent */}
      <defs><clipPath id="v3-land"><path d={landPath}/></clipPath></defs>
      <path d={landPath} fill="url(#v3-clith)" stroke="#4a382c" strokeWidth={2}/>
      <g clipPath="url(#v3-land)">
        <path d={`M1000,300L1000,${CONT_BASE_Y}L1900,${CONT_BASE_Y}L1900,${LAND(1900)}`} fill="none"/>
        <path d={(() => { let d = path(CONT_TOP) + `L1262,${LAND(1262).toFixed(1)}`; for (let x = 1262; x <= 1900; x += 24) d += `L${x} ${LAND(x).toFixed(1)}`; for (let x = 1900; x >= 1262; x -= 24) d += `L${x} ${(LAND(x) + 74).toFixed(1)}`; d += path(CONT_TOP.map((p) => [p[0] + 38, p[1] + 52] as Pt).reverse()).replace("M", "L"); return d + "Z"; })()} fill="url(#v3-ccrust)"/>
        {[0, 1, 2].map((i) => <path key={i} d={`M1240,${LAND(1262) + 18 + i * 20}L1900,${LAND(1900) + 16 + i * 20}`} stroke="#7a5a3a" strokeWidth={1.4} opacity={0.35} strokeDasharray="30 8"/>)}
        <rect x={1000} y={CONT_BASE_Y - 4} width={900} height={8} fill="#3a2a22" opacity={0.35}/>
      </g>
      <path d={(() => { let d = `M1262,${LAND(1262).toFixed(1)}`; for (let x = 1262; x <= 1900; x += 24) d += `L${x} ${LAND(x).toFixed(1)}`; return d; })()} fill="none" stroke="#7fb352" strokeWidth={9} strokeLinecap="round"/>
      {/* the sinking plate stays visible where it dives under the continent */}
      <path d={poly(R_TOP.filter((p) => p[0] > 1060), rMid.filter((p) => p[0] > 1060))} fill="url(#v3-crust)" stroke="#2b3b4b" strokeWidth={1.4}/>
      <path d={poly(rMid.filter((p) => p[0] > 1060), rBot.filter((p) => p[0] > 1060))} fill="url(#v3-lith)" stroke="#4d5f73" strokeWidth={1.4}/>
      <g opacity={0.9 * sk}><path d={poly(R_TOP.filter((p) => p[0] > 1060), rBot.filter((p) => p[0] > 1060))} fill="url(#v3-glow)" opacity={0.0}/></g>
      {/* magma made above the sinking plate, rising to the chamber and the vent */}
      <ellipse cx={1470} cy={930} rx={80} ry={50} fill="url(#v3-glow)" opacity={0.55}/>
      <Rise x0={1462} y0={936} x1={VX} y1={560} f={t} n={6} r={8} seed={5}/>
      <ellipse cx={VX} cy={534} rx={78} ry={36} fill="url(#v3-lava)" stroke="#7a2410" strokeWidth={2.4}/>
      <path d={`M${VX - 7},${VT + 8}L${VX - 6},534L${VX + 6},534L${VX + 7},${VT + 8}Z`} fill="url(#v3-lava)" opacity={0.95}/>
      <Rise x0={VX} y0={540} x1={VX} y1={VT + 6} f={t} n={5} r={5} seed={7}/>
      <Volcano f={f} glow={sc} sticky={join || summ ? sc : 0.4} burst={burst}/>
      {/* plate arrows */}
      <FlowArrow pts={[[236, 466], [190, 462], [120, 464]]} f={f} p={pt} w={20} c1="#f0a43a" dark="#6a3510" op={pt}/>
      <FlowArrow pts={[[304, 466], [350, 462], [420, 464]]} f={f} p={pt} w={20} c1="#f0a43a" dark="#6a3510" op={pt}/>
      <FlowArrow pts={[[470, 584], [560, 598], [680, 616]]} f={f} p={pt} w={20} c1="#f0a43a" dark="#6a3510" op={pt * 0.9}/>
      <FlowArrow pts={slabArrow} f={f} p={sk} w={22} c1="#f0a43a" dark="#6a3510" op={sk}/>
      {/* plate edges: the ridge and the trench glow */}
      <PathGlow d={`M270,500L270,650`} a={pe} f={f} w={12}/>
      <PathGlow d={contact} a={pe} f={f} w={12}/>
      <PathGlow d={path(R_TOP.filter((p) => p[0] > 1010 && p[0] < 1300))} a={both ? seg(f, at("sk"), 30) * 0.8 : 0} f={f} w={7} col="#ffd38a"/>
    </g>
  );
};

// ---- the three modes --------------------------------------------------------------------------------------------------------------------------
const Bottle: React.FC<{cx: number; cy: number; f: number; calm: number; boil: number}> = ({cx, cy, f, calm, boil}) => {
  const body = "M-34,-86 L-34,-150 Q-34,-168 -22,-176 L-22,-216 L22,-216 L22,-176 Q34,-168 34,-150 L34,92 Q34,112 14,112 L-14,112 Q-34,112 -34,92 Z";
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx={0} cy={118} rx={60} ry={10} fill="#2a1808" opacity={0.25}/>
      <defs><clipPath id="v3-bot"><path d={body}/></clipPath></defs>
      <path d={body} fill="#eaf6fb" opacity={0.55} stroke="#6b93aa" strokeWidth={3}/>
      <g clipPath="url(#v3-bot)">
        <rect x={-40} y={-90 - 40 * boil} width={80} height={220} fill="#7fc3e0" opacity={0.7}/>
        {Array.from({length: 9}).map((_, i) => {
          const u = (f * (0.008 + 0.012 * boil) + i / 9) % 1, x = -20 + ((i * 37) % 40), y = 90 - u * (160 + 40 * boil), r = (2.5 + (i % 3)) * (1 + boil * 1.6);
          return <circle key={i} cx={x + Math.sin(u * 8 + i) * 4} cy={y} r={r} fill="#fff" opacity={(0.5 + 0.4 * calm) * Math.min(1, u * 8)}/>;
        })}
        {boil > 0.05 && <ellipse cx={0} cy={-130 - 40 * boil} rx={34} ry={26 * boil + 4} fill="#fff" opacity={0.85}/>}
      </g>
      <rect x={-27} y={-232 - 12 * boil} width={54} height={22} rx={6} fill="#c8402a" stroke="#7a2412" strokeWidth={2} transform={`rotate(${boil * -16} 0 -220)`}/>
      {boil > 0.1 && Array.from({length: 6}).map((_, i) => { const u = ((f * 0.03 + i * 0.2) % 1); return <circle key={i} cx={-26 + i * 10 + Math.sin(i) * 8} cy={-240 - u * 60} r={6 + (i % 3) * 3} fill="#fff" opacity={(1 - u) * boil}/>; })}
      <path d="M-24,-60 L-24,60" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.5}/>
    </g>
  );
};
const Globe: React.FC<{cx: number; cy: number; r: number; f: number; rbA: number; stA: number}> = ({cx, cy, r, f, rbA, stA}) => (
  <g transform={`translate(${cx} ${cy})`}>
    <defs><clipPath id="v3-gl"><circle r={r}/></clipPath><radialGradient id="v3-gsea" cx="38%" cy="32%" r="80%"><stop offset="0" stopColor="#8fd0ea"/><stop offset="1" stopColor="#2f6f9e"/></radialGradient></defs>
    <circle r={r} fill="url(#v3-gsea)" stroke="#1f4a6e" strokeWidth={3}/>
    <g clipPath="url(#v3-gl)">
      {[-0.66, -0.33, 0, 0.33, 0.66].map((u, i) => <ellipse key={i} cx={0} cy={0} rx={Math.abs(u) * r + 2} ry={r} fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.3} transform={`rotate(0)`}/>)}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((u, i) => <ellipse key={i} cx={0} cy={u * r} rx={r * Math.sqrt(1 - u * u)} ry={r * 0.14} fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.28}/>)}
      <path d={`M${-r * 0.5},${-r * 0.2} Q${-r * 0.2},${-r * 0.7} ${r * 0.1},${-r * 0.4} Q${r * 0.2},${-r * 0.1} ${-r * 0.1},${r * 0.2} Q${-r * 0.4},${r * 0.1} ${-r * 0.5},${-r * 0.2}Z`} fill="#bfd49a" opacity={0.85}/>
      <path d={`M${r * 0.4},${r * 0.1} Q${r * 0.7},${-r * 0.2} ${r * 0.85},${r * 0.2} Q${r * 0.7},${r * 0.6} ${r * 0.45},${r * 0.5}Z`} fill="#bfd49a" opacity={0.85}/>
      <path d={`M${-r * 0.75},${-r * 0.55} Q${-r * 0.95},${r * 0.1} ${-r * 0.7},${r * 0.6}`} fill="none" stroke="#e8481a" strokeWidth={9} strokeLinecap="round" opacity={stA * (0.7 + 0.3 * Math.sin(f / 6))}/>
      <path d={`M${r * 0.78},${-r * 0.5} Q${r * 0.98},${r * 0.1} ${r * 0.74},${r * 0.62}`} fill="none" stroke="#e8481a" strokeWidth={9} strokeLinecap="round" opacity={stA * (0.7 + 0.3 * Math.sin(f / 6 + 1))}/>
      <path d={`M${-r * 0.05},${-r * 0.8} Q${r * 0.12},${-r * 0.1} ${-r * 0.05},${r * 0.8}`} fill="none" stroke="#ffb13c" strokeWidth={7} strokeLinecap="round" opacity={rbA * (0.7 + 0.3 * Math.sin(f / 7))}/>
      <circle cx={-r * 0.22} cy={r * 0.05} r={8} fill="#ffd36a" stroke="#c0541a" strokeWidth={2} opacity={rbA}/>
    </g>
    <path d={`M${-r * 0.7},${-r * 0.6} A${r * 0.9},${r * 0.9} 0 0 1 ${-r * 0.1},${-r * 0.92}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.5}/>
  </g>
);

export const SubductionArt: React.FC<AP> = ({f, dur, spec, at}) => {
  const mode = (spec as any).mode ?? "both";
  if (mode === "summary") {
    const sc = 0.64, rbA = seg(f, at("rb"), 30), stA = seg(f, at("st"), 30);
    return (
      <g>
        <V3Defs/>
        <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ECE2CC"/>
        <g transform={`translate(60 ${248 - 96 * sc}) scale(${sc})`}>
          <g clipPath="url(#v3-slice)"><Slice f={f} at={at} mode="summary"/></g>
          <rect x={60} y={96} width={1800} height={940} rx={34} fill="none" stroke="#4a3320" strokeWidth={7}/>
        </g>
        <Globe cx={1590} cy={400} r={104} f={f} rbA={rbA} stA={stA}/>
        <Bottle cx={1590} cy={792} f={f} calm={rbA} boil={stA * (0.55 + 0.45 * Math.sin(f / 5) * 0.5 + 0.2)}/>
      </g>
    );
  }
  return (
    <g>
      <V3Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ECE2CC"/>
      <ellipse cx={960} cy={1050} rx={900} ry={22} fill="#2a1808" opacity={0.18} filter="url(#ak-blur22)"/>
      <g clipPath="url(#v3-slice)"><Slice f={f} at={at} mode={mode}/></g>
      <rect x={60} y={96} width={1800} height={940} rx={34} fill="none" stroke="#4a3320" strokeWidth={7}/>
    </g>
  );
};
export const SubductionLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), mode = (p.spec as any).mode ?? "both";
  if (mode === "both") return <>{L[0] && <P2Card cx={900} y={130} text={L[0].text} f={p.f} at={L[0].at} size={38} maxW={700}/>}{L[1] && <P2Card cx={1090} y={296} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={520} tone="cool"/>}{L[2] && <P2Card cx={360} y={290} text={L[2].text} f={p.f} at={L[2].at} size={32} maxW={520} upper={false}/>}</>;
  if (mode === "join") return <>{L[1] && <P2Card cx={330} y={150} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={460}/>}{L[0] && <P2Card cx={960} y={150} text={L[0].text} f={p.f} at={L[0].at} size={34} maxW={640} tone="dark" upper={false}/>}</>;
  return <>{L[0] && <P2Card cx={450} y={110} text={L[0].text} f={p.f} at={L[0].at} size={32} maxW={600} upper={false}/>}{L[1] && <P2Card cx={1130} y={110} text={L[1].text} f={p.f} at={L[1].at} size={32} maxW={600} tone="dark" upper={false}/>}</>;
};
void SANS; void SERIF; void clamp; void lerp; void H;
