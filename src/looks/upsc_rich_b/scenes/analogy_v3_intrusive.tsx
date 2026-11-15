// GEO-04 Part 1, builder V3: `intrusive` (s025 rocks, s026 batholith, s027 all forms, s028 deccan). Crust cut-aways with sedimentary strata.
// Motion follows f, dur and at(key) only (the measured voice replaces the estimated timeline later).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, lerp} from "../kit";
import type {AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {V3Defs, Strata, STRATA, band, trace, crystalCells, GraniteFill, GRANITE, BASALT, PathGlow, Leader, Sky, Rise, seg, prog, type Fn} from "./analogy_v3_kit";

const gs = (x: number, c: number, w: number) => Math.exp(-Math.pow((x - c) / w, 2));
const lbl = (p: AP, key: string) => { const L = ((p.spec as any).labels ?? []).findIndex((l: any) => l.key === key); return L; };

// ---- s025 two rock samples under a lens ------------------------------------------------------------------------------------------------------
const Disc = React.memo(({id, cx, cy, r, cell, seed, pal, flecks}: {id: string; cx: number; cy: number; r: number; cell: number; seed: number; pal: string[]; flecks: boolean}) => {
  const cells = crystalCells(cx - r, cy - r, cx + r, cy + r, cell, seed, pal);
  return (
    <g>
      <defs><clipPath id={`${id}-c`}><circle cx={cx} cy={cy} r={r}/></clipPath></defs>
      <circle cx={cx} cy={cy} r={r} fill={pal[0]}/>
      <g clipPath={`url(#${id}-c)`}>
        {cells.map((c, i) => <path key={i} d={c.d} fill={c.fill} stroke={flecks ? "#1e1e26" : "#7c5a52"} strokeWidth={flecks ? 0.6 : 1.3}/>)}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#000" strokeWidth={30} opacity={0.18}/>
      </g>
    </g>
  );
});

const Chunk: React.FC<{cx: number; cy: number; seed: number; dark: boolean}> = ({cx, cy, seed, dark}) => {
  const pts = Array.from({length: 11}).map((_, i) => { const a = (i / 11) * 6.283, rr = 1 + 0.16 * Math.sin(i * 2.1 + seed) + 0.1 * Math.cos(i * 3.7 + seed * 2); return `${cx + Math.cos(a) * 270 * rr},${cy + Math.sin(a) * 150 * rr}`; });
  const d = "M" + pts.join("L") + "Z";
  return (
    <g>
      <ellipse cx={cx + 20} cy={cy + 150} rx={300} ry={34} fill="#3a2410" opacity={0.28} filter="url(#ak-blur22)"/>
      <path d={d} fill={dark ? "#43434d" : "#cba99c"} stroke={dark ? "#26262e" : "#7a5650"} strokeWidth={3} strokeLinejoin="round"/>
      <path d={d} fill="url(#v3-dots)" opacity={0.9}/>
      <path d={`M${cx - 250},${cy - 30} Q${cx},${cy - 120} ${cx + 230},${cy - 60}`} fill="none" stroke="#fff" strokeWidth={14} opacity={0.12} strokeLinecap="round"/>
      {dark && Array.from({length: 16}).map((_, i) => <ellipse key={i} cx={cx - 200 + ((i * 97) % 400)} cy={cy - 90 + ((i * 53) % 190)} rx={5 + (i % 3) * 2} ry={3 + (i % 2) * 2} fill="#17171d" opacity={0.7}/>)}
    </g>
  );
};

const LensRim: React.FC<{cx: number; cy: number; r: number; f: number}> = ({cx, cy, r, f}) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#6d4a1c" strokeWidth={22}/>
    <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#d9a94a" strokeWidth={14}/>
    <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#fff0b8" strokeWidth={3} opacity={0.8}/>
    <path d={`M${cx - r * 0.7},${cy - r * 0.35} A${r * 0.78},${r * 0.78} 0 0 1 ${cx - r * 0.2},${cy - r * 0.78}`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.5 + 0.12 * Math.sin(f / 18)}/>
    <g transform={`rotate(38 ${cx} ${cy})`}>
      <rect x={cx + r + 6} y={cy - 17} width={150} height={34} rx={17} fill="#5a3418" stroke="#2d1a0a" strokeWidth={2}/>
      <rect x={cx + r + 14} y={cy - 11} width={134} height={9} rx={4.5} fill="#a8703a" opacity={0.7}/>
    </g>
  </g>
);

const MiniVolcano: React.FC<{cx: number; y: number; a: number; f: number}> = ({cx, y, a, f}) => (
  <g opacity={a} transform={`translate(${cx} ${y})`}>
    <ellipse cx={0} cy={86} rx={150} ry={12} fill="#3a2410" opacity={0.22}/>
    <path d="M-150,86 Q-60,70 -26,10 L26,10 Q62,70 150,86 Z" fill="#7a6a5a" stroke="#4b3f35" strokeWidth={2}/>
    <path d="M26,10 Q62,70 150,86 L40,86 Z" fill="#000" opacity={0.18}/>
    <path d="M-20,12 Q-10,40 -34,86 L-8,86 Q8,44 16,12 Z" fill="url(#v3-lava)"/>
    <circle cx={0} cy={4} r={36} fill="url(#v3-glow)" opacity={0.7 + 0.2 * Math.sin(f / 6)}/>
    <path d="M-30,90 Q-110,106 -140,92" fill="none" stroke="#f1621f" strokeWidth={8} strokeLinecap="round" opacity={0.9}/>
    <rect x={-170} y={86} width={340} height={6} fill="#c9b184" opacity={0.0}/>
  </g>
);
const MiniUnder: React.FC<{cx: number; y: number; a: number}> = ({cx, y, a}) => (
  <g opacity={a} transform={`translate(${cx} ${y})`}>
    <rect x={-150} y={20} width={300} height={70} rx={6} fill="#cf9b62" stroke="#8a5a2a" strokeWidth={2}/>
    <rect x={-150} y={20} width={300} height={16} rx={4} fill="#7aa35a"/>
    <path d="M-150,48 Q0,58 150,46 M-150,66 Q0,76 150,64" stroke="#8a5a2a" strokeWidth={1.5} fill="none" opacity={0.5}/>
    <path d="M-92,90 Q-104,62 -62,56 Q-10,44 40,58 Q96,56 94,90 Z" fill="#c99f92" stroke="#7a5650" strokeWidth={2.4}/>
    <path d="M-60,70 l12,-6 l14,8 l-8,10 z M10,66 l16,-4 l10,10 l-14,8 z M54,74 l12,-6 l8,12 z" fill="#f4eee8" opacity={0.7}/>
  </g>
);

export const RocksArt: React.FC<AP> = ({f, dur, at}) => {
  const aV = seg(f, 6, 24), aP = seg(f, at("pr") - 24, 28), cxs = [520, 1400];
  const hover = (k: number) => Math.sin(f / 26 + k * 2) * 5;
  return (
    <g>
      <V3Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ECE2CC"/>
      <rect x={-60} y={760} width={W + 120} height={400} fill="#E3D6B8"/>
      {[0, 1].map((k) => {
        const a = k ? aP : aV, cx = cxs[k], cy = 560;
        return (
          <g key={k} opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
            <Chunk cx={cx} cy={cy} seed={k * 3 + 1} dark={k === 0}/>
            <g transform={`translate(0 ${hover(k)})`}>
              <Disc id={`v3r${k}`} cx={cx + 110} cy={cy - 50} r={176} cell={k ? 42 : 12} seed={k + 4} pal={k ? GRANITE : BASALT} flecks={k === 0}/>
              <LensRim cx={cx + 110} cy={cy - 50} r={176} f={f}/>
            </g>
          </g>
        );
      })}
      <MiniVolcano cx={cxs[0] - 40} y={132} a={aV} f={f}/>
      <MiniUnder cx={cxs[1] - 40} y={132} a={aP}/>
    </g>
  );
};
export const RocksLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={520} y={742} text={L[0].text} f={p.f} at={L[0].at} size={34} maxW={760} upper={false}/>}
      {L[1] && <P2Card cx={1400} y={742} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={800} upper={false}/>}
    </>
  );
};

// ---- the crust cut-away: the batholith (s026) -------------------------------------------------------------------------------------------------
const S0: Fn = (x) => 292 + 26 * Math.sin(x / 210 + 0.8) + 18 * Math.sin(x / 90);
const gTop: Fn = (x) => 650 - 190 * gs(x, 770, 210) - 210 * gs(x, 1170, 240) - 70 * gs(x, 960, 140) - 30 * gs(x, 1500, 160);
const gPath = () => { let d = trace(gTop, 330, 1600, 16); d += `C1630,720 1690,820 1700,900 C1712,990 1740,1060 1770,1130 L190,1130 C220,1060 250,990 262,900 C272,820 310,720 330,${gTop(330)}Z`; return d; };

export const BatholithArt: React.FC<AP> = ({f, dur, at}) => {
  const tb = at("bt"), te = at("er"), ero = eio(prog(f, tb + 60, Math.max(60, te - tb - 74)));
  const P = 618;
  const surf: Fn = (x) => lerp(S0(x), Math.min(P, gTop(x)), ero);
  const edges: Fn[] = [S0, 410, 500, 590, 690, 780].map((b, i) => (i === 0 ? ((x: number) => 292 + 26 * Math.sin(x / 210 + 0.8) + 18 * Math.sin(x / 90)) : (x: number) => b + 24 * Math.sin(x / 260 + i) - (130 - i * 20) * gs(x, 960, 420) * (i < 4 ? 1 : 0.6)));
  const gp = gPath(), gBox: [number, number, number, number] = [320, 400, 1610, 1130];
  const aLift = seg(f, tb - 10, 40), glow = seg(f, tb, 24) * (1 - seg(f, tb + 90, 60) * 0.7), clk = clamp(Math.min(ero * 10, (1 - ero) * 10)), bump = 0;
  return (
    <g>
      <V3Defs/>
      <Sky h={H} f={f} sun={[1540, 180]}/>
      <defs><clipPath id="v3-below"><path d={band(surf, () => 1200, -20, W + 20, 16)}/></clipPath></defs>
      <g clipPath="url(#v3-below)">
        <rect x={-20} y={200} width={W + 40} height={900} fill="#6d6a72"/>
        <Strata edges={edges} floor={() => 1200} a={-20} b={W + 20} id="v3b"/>
        <path d={trace(surf, -20, W + 20, 16)} fill="none" stroke="#6f9f4a" strokeWidth={22} opacity={0.0}/>
        <path d={band(surf, (x) => surf(x) + 15, -20, W + 20, 16)} fill="#79ad4e"/>
        <path d={band(surf, (x) => surf(x) + 5, -20, W + 20, 16)} fill="#a6cf6a" opacity={0.9}/>
        <path d={gp} fill="none" stroke="#b8714a" strokeWidth={26} opacity={0.35 * seg(f, 4, 20)} filter="url(#v3-b14)"/>
        <GraniteFill path={gp} id="v3gr" box={gBox} cell={32} seed={5}/>
        <defs><clipPath id="v3-gclip"><path d={gp}/></clipPath></defs>
        <g clipPath="url(#v3-gclip)">
          {[26, 54, 84].map((o, i) => <path key={i} d={trace((x) => gTop(x) + o, 330, 1600, 16)} fill="none" stroke="#6a4a44" strokeWidth={2} opacity={0.32}/>)}
          <path d={trace(surf, 330, 1600, 16)} fill="none" stroke="#a6a3a0" strokeWidth={34} opacity={0.5 * ero}/>
        </g>
      </g>
      {/* weathered boulders on the exposed domes */}
      {ero > 0.72 && [700, 760, 850, 1100, 1170, 1250, 1300].map((x, i) => {
        const y = surf(x), a = seg(f, 0, 1) * clamp((ero - 0.72) * 4), onG = gTop(x) <= P + 1;
        return onG ? <g key={i} opacity={a}><ellipse cx={x} cy={y - 4} rx={12 + (i % 3) * 5} ry={8 + (i % 2) * 3} fill="#bfb6b0" stroke="#7d726d" strokeWidth={1.4}/><ellipse cx={x - 3} cy={y - 7} rx={5} ry={3} fill="#fff" opacity={0.4}/></g> : null;
      })}
      {/* dust of the wearing away */}
      <g opacity={clk * 0.6}>{Array.from({length: 9}).map((_, i) => { const u = (f * 0.012 + i / 9) % 1, x = 160 + i * 190 + u * 60; return <circle key={i} cx={x} cy={surf(x) - 14 - u * 80} r={14 + u * 22} fill="#b48a5a" opacity={(1 - u) * 0.28} filter="url(#v3-b4)"/>; })}</g>
      {/* the fast clock */}
      <g transform="translate(1750 330)" opacity={clk}>
        <circle r={64} fill="#fffaf0" stroke="#5a3418" strokeWidth={5} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.35))"}}/>
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-52} x2={0} y2={-44} stroke="#5a3418" strokeWidth={3} transform={`rotate(${i * 30})`}/>)}
        <line x1={0} y1={0} x2={0} y2={-46} stroke="#b83a1a" strokeWidth={4} strokeLinecap="round" transform={`rotate(${f * 14})`}/>
        <line x1={0} y1={0} x2={0} y2={-30} stroke="#3a2410" strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 1.2})`}/>
        <circle r={6} fill="#3a2410"/>
      </g>
    </g>
  );
};
export const BatholithLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={900} y={70} text={L[0].text} f={p.f} at={L[0].at} size={42} maxW={900}/>}
      {L[1] && <P2Card cx={960} y={770} text={L[1].text} f={p.f} at={L[1].at} size={38} maxW={880} tone="dark" upper/>}
      {L[2] && <P2Card cx={960} y={188} text={L[2].text} f={p.f} at={L[2].at} size={38} maxW={800} upper={false} tone="cool"/>}
    </>
  );
};

// ---- all the intrusive forms in one cut-away (s027) ------------------------------------------------------------------------------------------------
const SF: Fn = (x) => 340 + 18 * Math.sin(x / 300 + 0.4);
const BASE_Y = [0, 440, 528, 616, 706, 796];
const fold = (x: number) => -46 * Math.cos(((x - 1060) * 2 * Math.PI) / 320) * Math.exp(-Math.pow((x - 1060) / 330, 2));

const Dolerite: React.FC<{d: string; id: string; a: number; box: [number, number, number, number]; cell?: number}> = ({d, id, a, box, cell = 14}) => {
  const cells = React.useMemo(() => crystalCells(box[0], box[1], box[2], box[3], cell, 9, BASALT), [box.join(), cell]);
  return (
    <g opacity={a}>
      <defs><clipPath id={`${id}-dc`}><path d={d}/></clipPath></defs>
      <path d={d} fill="#34343e"/>
      <g clipPath={`url(#${id}-dc)`}>{cells.map((c, i) => <path key={i} d={c.d} fill={c.fill} stroke="#1c1c24" strokeWidth={0.6}/>)}</g>
      <path d={d} fill="none" stroke="#17171f" strokeWidth={2.4} strokeLinejoin="round"/>
    </g>
  );
};

export const AllArt: React.FC<AP> = ({f, dur, at}) => {
  const k = (n: string) => at(n);
  const pLa = seg(f, k("la"), 52), pLp = seg(f, k("lp"), 52), pPh = seg(f, k("ph"), 46), pSi = seg(f, k("si"), 56), pDk = seg(f, k("dk"), 50);
  const gl = (n: string) => clamp(seg(f, k(n), 10) * (1 - seg(f, k(n) + 70, 90) * 0.75));
  const yb = 704;
  // laccolith: overlying layers arch; lapolith: layers sag; both in the same edges
  const bumpLa = (x: number) => gs(x, 300, 150), sagLp = (x: number) => gs(x, 720, 210);
  const edgeFn = (i: number): Fn => (x) => {
    if (i === 0) { const w = 0.55; return SF(x) - 118 * pLa * bumpLa(x) * w + 74 * pLp * sagLp(x) * 0.35 + fold(x) * 0.3; }
    const b = BASE_Y[i], up = b < yb ? 118 * pLa * bumpLa(x) * (1 - 0.5 * (yb - b) / (yb - 340)) : 0;
    const sag = 74 * pLp * sagLp(x) * (b < 700 ? 1 - 0.12 * i : 0.55);
    return b + (i > 0 ? 6 * Math.sin(x / 240 + i) : 0) + fold(x) * (1 - 0.1 * i) - up + sag;
  };
  const edges = [0, 1, 2, 3, 4, 5].map(edgeFn);
  const surf = edges[0];
  // bodies
  const laTop = (x: number) => yb - 128 * pLa * Math.pow(bumpLa(x), 0.85);
  const la = pLa > 0.01 ? band(laTop, () => yb + 2, 130, 470, 8) : "";
  const pipeX = (y: number) => 300 + 6 * Math.sin(y / 80);
  const lpC = (x: number) => 626 + 74 * pLp * sagLp(x), lpT = (x: number) => 52 * pLp * Math.pow(sagLp(x), 0.6);
  const lp = pLp > 0.01 ? band((x) => lpC(x) - lpT(x) * 0.5, (x) => lpC(x) + lpT(x) * 0.5, 480, 960, 8) : "";
  const e2 = edges[2], phT = (x: number) => 40 * pPh * Math.max(0, 1 - Math.pow((x - 1060) / 108, 2)), phT2 = (x: number) => 40 * pPh * Math.max(0, 1 - Math.pow((x - 1220) / 108, 2));
  const ph1 = pPh > 0.01 ? band((x) => e2(x) + 3, (x) => e2(x) + 3 + phT(x), 952, 1168, 8) : "";
  const ph2 = pPh > 0.01 ? band((x) => e2(x) - 3 - phT2(x), (x) => e2(x) - 3, 1112, 1328, 8) : "";
  const e3 = edges[3], sx0 = 1300, sx1 = 1590, sxl = sx1 - (sx1 - sx0) * pSi;
  const sillT = (x: number) => 1 - Math.pow(clamp((x - (sx0 + sx1) / 2) / ((sx1 - sx0) / 2)), 6);
  const sill = pSi > 0.01 ? band((x) => e3(x) + 2, (x) => e3(x) + 2 + 30 * sillT(x), sxl, sx1, 8) : "";
  const e2b = edges[2], sheet = pSi > 0.01 ? band((x) => e2b(x) + 2, (x) => e2b(x) + 2 + 11 * sillT(x), lerp(sx1, 1360, pSi), sx1 - 20, 8) : "";
  const dkX = (y: number) => 1712 + (y - 700) * 0.035, dkTop = lerp(1100, SF(1712) + 6, pDk);
  const dyke = pDk > 0.01 ? `M${dkX(1100) - 21},1100L${dkX(dkTop) - 18},${dkTop}L${dkX(dkTop) + 18},${dkTop}L${dkX(1100) + 21},1100Z` : "";
  const feeder = pSi > 0.01 ? `M${sx1 - 54},${lerp(1100, e3(sx1 - 54) + 20, pSi)}L${sx1 - 54},1100L${sx1 - 44},1100L${sx1 - 44},${lerp(1100, e3(sx1 - 44) + 20, pSi)}Z` : "";
  const pipe = pLa > 0.01 ? `M${pipeX(1100) - 15},1100L${pipeX(yb) - 11},${lerp(1100, yb, pLa)}L${pipeX(yb) + 11},${lerp(1100, yb, pLa)}L${pipeX(1100) + 15},1100Z` : "";
  const lpPipe = pLp > 0.01 ? `M705,1100L708,${lerp(1100, lpC(720) + 20, pLp)}L728,${lerp(1100, lpC(720) + 20, pLp)}L736,1100Z` : "";
  const dark = (d: string, id: string, a: number, bx: [number, number, number, number], c = 14) => d ? <Dolerite d={d} id={id} a={a} box={bx} cell={c}/> : null;
  return (
    <g>
      <V3Defs/>
      <Sky h={420} f={f} sun={[1010, 62]}/>
      <defs><clipPath id="v3-allclip"><path d={band(surf, () => 1200, -20, W + 20, 16)}/></clipPath></defs>
      <g clipPath="url(#v3-allclip)">
        <rect x={-20} y={300} width={W + 40} height={900} fill="#6d6a72"/>
        <Strata edges={edges} floor={() => 1200} a={-20} b={W + 20} id="v3a"/>
        <path d={band(surf, (x) => surf(x) + 14, -20, W + 20, 16)} fill="#79ad4e"/>
        <path d={band(surf, (x) => surf(x) + 5, -20, W + 20, 16)} fill="#a6cf6a" opacity={0.9}/>
        {dark(pipe, "v3p0", 1, [250, 700, 350, 1100], 12)}
        {dark(la, "v3la", 1, [130, 560, 470, 710], 14)}
        {dark(lpPipe, "v3p1", 1, [700, 600, 740, 1100], 12)}
        {dark(lp, "v3lp", 1, [480, 560, 960, 770], 14)}
        {dark(ph1, "v3ph1", 1, [952, 440, 1168, 560], 12)}
        {dark(ph2, "v3ph2", 1, [1112, 440, 1328, 560], 12)}
        {dark(feeder, "v3fd", 1, [sx1 - 60, 600, sx1 - 40, 1100], 10)}
        {dark(sill, "v3si", 1, [sx0, 600, sx1, 700], 12)}
        {dark(sheet, "v3sh", 1, [sx0, 500, sx1, 560], 10)}
        {dark(dyke, "v3dk", 1, [1670, 340, 1760, 1100], 12)}
        <PathGlow d={la} a={gl("la")} f={f}/><PathGlow d={lp} a={gl("lp")} f={f}/><PathGlow d={ph1} a={gl("ph")} f={f}/><PathGlow d={ph2} a={gl("ph")} f={f}/>
        <PathGlow d={sill} a={gl("si")} f={f}/><PathGlow d={sheet} a={gl("si")} f={f}/><PathGlow d={dyke} a={gl("dk")} f={f}/>
        <Rise x0={pipeX(1090)} y0={1090} x1={pipeX(yb)} y1={yb + 4} f={f} n={5} r={7} a={pLa} seed={1}/>
      </g>
      {/* leaders: from under the card to the body */}
      <Leader from={[300, 236]} to={[300, 580]} a={seg(f, k("la") + 10, 30)}/>
      <Leader from={[720, 236]} to={[720, 668]} a={seg(f, k("lp") + 10, 30)}/>
      <Leader from={[1050, 236]} to={[1060, e2(1060) + 14]} a={seg(f, k("ph") + 10, 30)}/>
      <Leader from={[1430, 236]} to={[1440, e3(1440) + 14]} a={seg(f, k("si") + 10, 30)}/>
      <Leader from={[1720, 236]} to={[dkX(560) + 4, 560]} a={seg(f, k("dk") + 10, 30)}/>
    </g>
  );
};
export const AllLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), cx = [300, 720, 1050, 1410, 1722];
  return <>{L.map((l, i) => <P2Card key={i} cx={cx[i]} y={128} text={l.text} f={p.f} at={l.at} size={34} maxW={420}/>)}</>;
};

// ---- dykes and the Deccan Traps (s028) -------------------------------------------------------------------------------------------------------------
export const DeccanArt: React.FC<AP> = ({f, dur, at}) => {
  const tw = at("wm"), td = at("dt"), n = 6, sh = 40, y0 = 584, DX = 960;
  const gl = 0.55 + 0.45 * seg(f, tw, 24), dyke = seg(f, 6, 30);
  const sheets = Array.from({length: n}).map((_, j) => {
    const start = td - 10 + j * ((dur - td - 70) / n) * 0.9, p = eo(prog(f, start, 46)), half = 880 - j * 118;
    return {j, p, half, yb: y0 - sh * j, start};
  });
  const topY = Math.min(y0, ...sheets.filter((s) => s.p > 0.02).map((s) => s.yb - sh));
  const ground = (x: number) => y0 + 6 * Math.sin(x / 180);
  const cells = React.useMemo(() => crystalCells(0, 0, 1, 1, 10, 1, BASALT), []);
  void cells;
  return (
    <g>
      <V3Defs/>
      <Sky h={y0} f={f} sun={[1790, 240]}/>
      <rect x={-20} y={y0} width={W + 40} height={H} fill="#6d6a72"/>
      <path d={band(() => y0 - 1, () => y0 + 8, -20, W + 20, 40)} fill="#4f4a4f" opacity={0.0}/>
      <Strata edges={[ground, (x) => y0 + 150 + 12 * Math.sin(x / 140), (x) => y0 + 260 + 10 * Math.sin(x / 200 + 1), (x) => y0 + 360]} floor={() => 1200} a={-20} b={W + 20} id="v3d"/>
      {/* the sheets, oldest widest at the bottom */}
      {sheets.map((s) => {
        if (s.p < 0.005) return null;
        const xl = DX - s.half * s.p, xr = DX + s.half * s.p, top = (x: number) => s.yb - sh + 5 * Math.sin(x / 70 + s.j * 2) * 0, bot = () => s.yb;
        const sl = 22, d = `M${xl - sl * 0.2},${s.yb}L${xl + sl},${s.yb - sh}L${xr - sl},${s.yb - sh}L${xr + sl * 0.2},${s.yb}Z`;
        const tone = s.j % 2 ? "#3a3a46" : "#45454f";
        return (
          <g key={s.j}>
            <path d={d} fill={tone} stroke="#17171f" strokeWidth={1.8} strokeLinejoin="round"/>
            <defs><clipPath id={`v3sh${s.j}`}><path d={d}/></clipPath></defs>
            <g clipPath={`url(#v3sh${s.j})`}>
              {Array.from({length: Math.round(s.half * 2 / 26)}).map((_, i) => { const x = xl + (i + 0.5) * 26; return <line key={i} x1={x} y1={s.yb - sh + 4} x2={x + (i % 3 - 1) * 1.5} y2={s.yb - 6} stroke="#17171f" strokeWidth={1.3} opacity={0.55}/>; })}
              <rect x={xl} y={s.yb - 7} width={xr - xl} height={7} fill="#b4553a" opacity={0.85}/>
              <rect x={xl} y={s.yb - sh} width={xr - xl} height={4} fill="#fff" opacity={0.12}/>
              <rect x={xl} y={s.yb - sh - 2} width={xr - xl} height={7} fill="#6f9f4a" opacity={s.p > 0.97 ? 0.95 : 0}/>
            </g>
            {/* hot front */}
            {s.p < 0.98 && [xl, xr].map((x, i) => <g key={i}><rect x={x - 8} y={s.yb - sh} width={16} height={sh} rx={6} fill="url(#v3-lava)"/><circle cx={x} cy={s.yb - sh / 2} r={46} fill="url(#v3-glow)" opacity={0.8}/></g>)}
          </g>
        );
      })}
      {/* the dyke: a glowing vertical wall feeding them */}
      {dyke > 0.01 && (() => {
        const top = lerp(1100, Math.min(topY, y0 - 6), dyke), d = `M${DX - 20},1100L${DX - 17},${top}L${DX + 17},${top}L${DX + 20},1100Z`;
        return (
          <g>
            <path d={d} fill="#2c2c36" stroke="#17171f" strokeWidth={2}/>
            <PathGlow d={d} a={gl} f={f} w={9}/>
            <path d={d} fill="url(#v3-lava)" opacity={0.78 * gl}/>
            <Rise x0={DX} y0={1070} x1={DX} y1={top + 4} f={f} n={9} r={6} a={dyke} seed={2}/>
          </g>
        );
      })()}
      <ellipse cx={DX} cy={topY} rx={90} ry={16} fill="url(#v3-glow)" opacity={0.7 * seg(f, td, 20)}/>
    </g>
  );
};
export const DeccanLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={640} y={90} text={L[0].text} f={p.f} at={L[0].at} size={36} maxW={760} upper={false}/>}
      {L[1] && <P2Card cx={1400} y={150} text={L[1].text} f={p.f} at={L[1].at} size={36} maxW={560} upper={false} tone="dark"/>}
    </>
  );
};

void SANS; void SERIF; void STRATA; void lbl;
