// KURZ look, sets (art builder, 29 Oct 2026): village, hospital, road, sheds, train, market, hall, regulator. Each set is drawn in
// parallax layers: L(depth) gives the camera transform for a layer (0 = sky, 1 = the ground the cast stands on, >1 = foreground).
// Light comes from the upper left. Signboards and banners carry no readable text; vehicles and buildings carry no brand or emblem.
import React from "react";
import {Cloud, GlowDot, Haze, Lit, Motes, P, Shafts, Sky, Smoke, Stipple, ell, litOf, mix, mod, poly, ridge, rng, rr, shadeOf, useArt} from "./base";
import {CrateArt} from "./props";
import {Person} from "./cast";

export type SetProps = {f: number; L: (depth: number) => string; scroll: number};
export type SetDef = {Back: React.FC<SetProps>; Front: React.FC<SetProps>};

// ---- shared scenery ----------------------------------------------------------------------------------------------------------------
const StarField: React.FC<{f: number; n: number; seed: number; y1: number}> = ({f, n, seed, y1}) => {
  const {T} = useArt(), r = rng(seed);
  return <g>{Array.from({length: n}, (_, i) => { const x = r() * 2200 - 140, y = r() * y1 - 200, rad = 0.8 + r() * 2.2, ph = r() * 6.28;
    return <circle key={i} cx={x} cy={y} r={rad} fill={T("#F4F7FF")} opacity={(0.2 + 0.5 * (0.5 + 0.5 * Math.sin(f / 19 + ph))) * Math.max(0, 1 - y / y1)}/>; })}</g>;
};

// A hill band: smooth ridge, shaded under each down-slope with a diagonal cut, crest rim light, stipple texture.
const Hill: React.FC<{y: number; amp: number; seed: number; n?: number; c: string; rim?: string; x0?: number; x1?: number; stip?: boolean}> = ({y, amp, seed, n = 7, c, rim, x0, x1, stip = true}) => {
  const {T} = useArt(), {d, peaks} = ridge(y, amp, seed, n, 1400, x0, x1);
  const sh = shadeOf(c, 0.32), cid = `hill${seed}${Math.round(y)}`;
  let crest = `M ${peaks[0][0]} ${peaks[0][1]}`;
  for (let i = 0; i < peaks.length - 1; i++) { const [ax, ay] = peaks[i], [bx, by] = peaks[i + 1], mx = (ax + bx) / 2; crest += ` C ${mx} ${ay} ${mx} ${by} ${bx} ${by}`; }
  return <g>
    <clipPath id={cid}><path d={d}/></clipPath>
    <path d={d} fill={T(c)}/>
    <g clipPath={`url(#${cid})`}>
      {peaks.slice(0, -1).map(([ax, ay], i) => { const [bx, by] = peaks[i + 1]; if (by <= ay) return null;
        return <path key={i} d={poly([[(ax + bx) / 2 - 20, ay - 60], [bx + 40, by - 60], [bx + 40 + 700, 1400], [(ax + bx) / 2 - 20 + 700, 1400]])} fill={T(sh)}/>; })}
    </g>
    {stip && <Stipple d={d} c={shadeOf(c, 0.5)} o={0.16} seed={seed}/>}
    <path d={crest} fill="none" stroke={T(rim ?? litOf(c, 0.5))} strokeWidth={5} opacity={0.75}/>
  </g>;
};

export const Palm: React.FC<{x: number; y: number; h: number; f: number; seed?: number; lean?: number; c?: string; fr?: string; flat?: boolean}> =
  ({x, y, h, f, seed = 0, lean = 0.12, c = "#7A5A44", fr = "#2E9C6E", flat}) => {
  const {T} = useArt(), sway = Math.sin(f / 47 + seed * 1.9) * 2.6 + Math.sin(f / 19 + seed) * 0.6;
  const tx = x + lean * h, ty = y - h, w0 = h * 0.045, w1 = h * 0.028;
  const trunk = `M ${x - w0} ${y} Q ${x + lean * h * 0.2 - w0} ${y - h * 0.6} ${tx - w1} ${ty} L ${tx + w1} ${ty} Q ${x + lean * h * 0.2 + w0} ${y - h * 0.6} ${x + w0} ${y} Z`;
  const L = h * 0.42;
  const frond = (a: number, k: number, i: number) => {
    const up = `M 0 0 Q ${L * 0.45} ${-L * 0.32} ${L} ${L * 0.16} Q ${L * 0.5} ${-L * 0.08} 0 0 Z`;
    const dn = `M 0 0 Q ${L * 0.5} ${-L * 0.08} ${L} ${L * 0.16} Q ${L * 0.5} ${L * 0.1} 0 0 Z`;
    const lit = Math.cos(((a + 200) * Math.PI) / 180) > -0.1;
    return <g key={i} transform={`rotate(${a + Math.sin(f / 31 + i + seed) * 3}) scale(${k})`}>
      <path d={up} fill={T(flat ? fr : lit ? litOf(fr, 0.18) : fr)}/>
      <path d={dn} fill={T(flat ? fr : shadeOf(fr, 0.32))}/>
    </g>;
  };
  const angles = [-170, -140, -110, -70, -40, -10, 20, 160, 195];
  return <g>
    <path d={trunk} fill={T(c)}/>
    {!flat && <path d={`M ${x + w0 * 0.1} ${y} Q ${x + lean * h * 0.2 + w0 * 0.3} ${y - h * 0.6} ${tx + w1 * 0.2} ${ty} L ${tx + w1} ${ty} Q ${x + lean * h * 0.2 + w0} ${y - h * 0.6} ${x + w0} ${y} Z`} fill={T(shadeOf(c, 0.35))}/>}
    {!flat && Array.from({length: 9}, (_, i) => { const t = (i + 1) / 10, px = x + (tx - x) * t * t * 0.5 + (tx - x) * t * 0.5; return <path key={i} d={`M ${px - w0 * 0.9} ${y - h * t} q ${w0} 6 ${w0 * 1.8} 0`} stroke={T(shadeOf(c, 0.45))} strokeWidth={2.5} fill="none" opacity={0.6}/>; })}
    <g transform={`translate(${tx} ${ty}) rotate(${sway})`}>
      {angles.map((a, i) => frond(a, 0.75 + ((i * 37 + seed * 11) % 30) / 100, i))}
      {!flat && [[-10, 10], [8, 14], [0, 22]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={h * 0.022} fill={T(i === 1 ? "#6E5A2A" : "#8A7034")}/>)}
    </g>
  </g>;
};

const Tree: React.FC<{x: number; y: number; r: number; f: number; seed?: number; c?: string; trunk?: string; flat?: boolean}> = ({x, y, r, f, seed = 0, c = "#2F8A62", trunk = "#5A3E30", flat}) => {
  const {T} = useArt(), g = rng(seed + 100), sway = Math.sin(f / 53 + seed) * r * 0.02;
  const blobs = [[0, -1.55, 0.62], [-0.55, -1.3, 0.5], [0.55, -1.32, 0.52], [-0.25, -1.9, 0.48], [0.32, -1.86, 0.46], [0, -1.15, 0.5]].map(([a, b, k]) => [a + (g() - 0.5) * 0.12, b + (g() - 0.5) * 0.1, k]);
  return <g>
    {flat ? <P d={rr(x - r * 0.1, y - r * 1.2, r * 0.2, r * 1.2, r * 0.05)} c={trunk}/> : <Lit d={rr(x - r * 0.11, y - r * 1.2, r * 0.22, r * 1.2, r * 0.05)} c={trunk} cut={x} side={1}/>}
    <g transform={`translate(${sway} 0)`}>
      {flat ? <P d={blobs.map(([a, b, k]) => ell(x + a * r, y + b * r, k * r)).join(" ")} c={c}/> : <>
        <Lit d={blobs.map(([a, b, k]) => ell(x + a * r, y + b * r, k * r)).join(" ")} c={c} cut={x + r * 0.12} cy={y - r * 1.5} tilt={0.7} rim={Math.max(4, r * 0.035)} k={0.32}/>
        {blobs.slice(0, 4).map(([a, b, k], i) => <path key={i} d={`M ${x + (a - k * 0.5) * r} ${y + (b + k * 0.35) * r} Q ${x + a * r} ${y + (b + k * 0.6) * r} ${x + (a + k * 0.5) * r} ${y + (b + k * 0.35) * r}`} stroke={T(shadeOf(c, 0.45))} strokeWidth={Math.max(3, r * 0.03)} fill="none" opacity={0.45}/>)}
        <Stipple d={blobs.map(([a, b, k]) => ell(x + a * r, y + b * r, k * r)).join(" ")} c={shadeOf(c, 0.5)} o={0.2} seed={seed + 3}/>
      </>}
    </g>
  </g>;
};

const House: React.FC<{x: number; y: number; w: number; h: number; wall: string; roof?: string; f: number; seed?: number; glow?: boolean}> = ({x, y, w, h, wall, roof = "#B5523A", f, seed = 0, glow}) => {
  const {T} = useArt(), rh = h * 0.55;
  return <g>
    <Lit d={rr(x, y - h, w, h, 4)} c={wall} cut={x + w * 0.62} side={1} tilt={0} rim={3}/>
    <Lit d={poly([[x - w * 0.08, y - h + 4], [x + w * 1.08, y - h + 4], [x + w * 0.88, y - h - rh], [x + w * 0.12, y - h - rh]])} c={roof} cut={x + w * 0.6} cy={y - h} tilt={0.5} rim={3}/>
    {Array.from({length: 4}, (_, i) => <path key={i} d={`M ${x - w * 0.04 + i * 0.03 * w} ${y - h - rh * (i / 4)} L ${x + w * 1.04 - i * 0.03 * w} ${y - h - rh * (i / 4)}`} stroke={T(shadeOf(roof, 0.4))} strokeWidth={2} opacity={0.6}/>)}
    <rect x={x + w * 0.16} y={y - h * 0.62} width={w * 0.2} height={h * 0.62} rx={3} fill={T("#3A2A3A")}/>
    <rect x={x + w * 0.56} y={y - h * 0.66} width={w * 0.22} height={h * 0.28} rx={3} fill={T(glow ? "#FFC86B" : "#2A2238")} opacity={glow ? 0.65 + 0.2 * Math.sin(f / 23 + seed) : 1}/>
  </g>;
};

const Grass: React.FC<{x: number; y: number; s: number; f: number; c: string; seed?: number}> = ({x, y, s, f, c, seed = 0}) => {
  const {T} = useArt(), r = rng(seed + 7);
  return <g>{Array.from({length: 7}, (_, i) => { const a = (i - 3) * 0.22 + (r() - 0.5) * 0.2, len = (40 + r() * 50) * s, sw = Math.sin(f / 27 + i + seed) * 0.08;
    const tx = x + Math.sin(a + sw) * len, ty = y - Math.cos(a + sw) * len;
    return <path key={i} d={`M ${x - 5 * s + i * 1.6 * s} ${y} Q ${x + Math.sin(a) * len * 0.4} ${y - len * 0.5} ${tx} ${ty} Q ${x + Math.sin(a) * len * 0.4 + 6 * s} ${y - len * 0.5} ${x + 5 * s + i * 1.6 * s} ${y} Z`}
      fill={T(i % 2 ? c : shadeOf(c, 0.25))}/>; })}</g>;
};

// ---- village: Namakkal at dawn, a rock with a fort wall, palms, tiled roofs, fields -----------------------------------------------
const Village: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt();
    return <g>
      <g transform={L(0.04)}>
        <Sky stops={[[0, "#0B1433"], [0.25, "#1E2466"], [0.38, "#4A3A8E"], [0.47, "#A24E88"], [0.53, "#F06A5E"], [0.58, "#FFAE6E"], [0.66, "#FFE0A0"], [1, "#FFE9B8"]]}/>
        <StarField f={f} n={70} seed={5} y1={420}/>
        <Cloud f={f} x={1150} y={440} s={1.3} c="#E890A0" o={0.75}/><Cloud f={f} x={250} y={380} s={1.0} c="#E890A0" o={0.6}/><Cloud f={f} x={1750} y={330} s={0.8} c="#E890A0" o={0.5}/>
      </g>
      <g transform={L(0.08)}>
        <GlowDot x={620} y={660} r={620} c="#FFC27A" o={0.55}/>
        <Shafts f={f} x={620} y={660} ang={-Math.PI / 2} spread={Math.PI * 0.95} n={11} len={1200} c="#FFE2A8" o={0.13} seed={3}/>
        <circle cx={620} cy={660} r={70} fill={T("#FFE6A0")}/><path d={`M 620 590 A 70 70 0 0 1 620 730 Z`} fill={T("#FFC266")} opacity={0.6}/>
      </g>
      <g transform={L(0.16)}><Hill y={650} amp={100} seed={11} n={9} c="#5B4C9E" rim="#C9A2D8"/></g>
      <Haze y={560} h={170} c="#FFB27A" o={0.42}/>
      <g transform={L(0.3)}>
        <Hill y={712} amp={50} seed={23} n={8} c="#6A4E8E" rim="#F0A890"/>
        <Lit d="M 1440 770 C 1452 610 1556 520 1700 514 C 1830 512 1920 600 1980 770 Z" c="#7C5A92" cut={1720} cy={600} tilt={0.35} rim={6} rimC="#F7B08E"/>
        <Stipple d="M 1440 770 C 1452 610 1556 520 1700 514 C 1830 512 1920 600 1980 770 Z" c="#3A2A5A" o={0.2} seed={4}/>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={1606 + i * 30} y={506 - (i % 2) * 12} width={20} height={26 + (i % 2) * 12} fill={T(i < 4 ? "#9C7AA8" : "#6A4A7E")}/>)}
        <rect x={1600} y={526} width={214} height={14} fill={T("#8A6A9A")}/>
        <path d="M 1690 470 L 1712 440 L 1734 470 Z" fill={T("#B88AA8")}/><rect x={1694} y={470} width={36} height={40} fill={T("#A07A9A")}/>
      </g>
      <Haze y={650} h={140} c="#FF9F7A" o={0.38}/>
      <g transform={L(0.52)}>
        <path d="M -300 780 Q 400 740 960 770 T 2220 760 L 2220 1300 L -300 1300 Z" fill={T("#2C5E70")}/>
        {[[60, 120, 84, "#E9C9A0"], [270, 150, 100, "#D9B98E"], [1000, 130, 90, "#E6CFA8"], [1210, 160, 104, "#D8B48A"], [1560, 120, 80, "#E9C9A0"], [1800, 150, 96, "#D9B98E"]].map(([x, w, h, c], i) =>
          <House key={i} x={x as number} y={786} w={w as number} h={h as number} wall={c as string} f={f} seed={i} glow={i % 2 === 0}/>)}
        <Smoke f={f} x={330} y={650} c="#CDB8C8" n={6} life={170} rise={200} drift={70} r0={8} r1={34} o={0.4} seed={2}/>
        <Smoke f={f} x={1280} y={640} c="#CDB8C8" n={6} life={190} rise={220} drift={60} r0={8} r1={36} o={0.35} seed={5}/>
        {[[200, 300], [460, 340], [770, 260], [1150, 320], [1420, 290], [1680, 330], [1890, 280]].map(([x, h], i) => <Palm key={i} x={x} y={790} h={h} f={f} seed={i} lean={i % 2 ? -0.1 : 0.12} c="#4A3A5A" fr="#2D6E6A"/>)}
      </g>
      <Haze y={730} h={110} c="#FFC89A" o={0.3}/>
      <g transform={L(1)}>
        <path d="M -300 820 Q 500 790 1100 812 T 2220 800 L 2220 1300 L -300 1300 Z" fill={T("#1F6B62")}/>
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M -300 ${840 + i * 30 + i * i * 2} Q 900 ${826 + i * 30 + i * i * 2} 2220 ${838 + i * 30 + i * i * 2}`} stroke={T("#2E8C7A")} strokeWidth={6 + i} fill="none" opacity={0.6}/>)}
        <path d="M 980 812 Q 1060 812 1150 812 L 1420 1300 L 760 1300 Z" fill={T("#B4613E")}/>
        <path d="M 1100 812 L 1150 812 L 1420 1300 L 1250 1300 Z" fill={T(shadeOf("#B4613E", 0.3))}/>
        <Stipple d="M -300 820 Q 500 790 1100 812 T 2220 800 L 2220 1300 L -300 1300 Z" c="#0E3A3A" o={0.25} seed={9}/>
        <Haze y={790} h={70} c="#FFD7A0" o={0.35}/>
        {[[300, 900], [520, 960], [1720, 930], [1880, 990], [180, 1010]].map(([x, y], i) => <Grass key={i} x={x} y={y} s={0.9} f={f} c="#3FA88A" seed={i}/>)}
      </g>
      <g transform={L(1.05)}><Palm x={120} y={1020} h={640} f={f} seed={9} lean={0.18} c="#5A4038" fr="#1E7A62"/></g>
    </g>;
  },
  Front: ({f, L}) => <g>
    <g transform={L(1.0)}><Motes f={f} n={36} seed={7} box={[-100, 260, 2020, 900]} c="#FFE6A8" r={[1.5, 3.6]} vx={0.18} vy={-0.12} o={0.85} glow/></g>
    <g transform={L(1.3)}>{[[40, 1090], [1880, 1090], [1780, 1100]].map(([x, y], i) => <Grass key={i} x={x} y={y} s={2.2} f={f} c="#14504A" seed={20 + i}/>)}</g>
  </g>,
};

// ---- hospital: a 1960s government veterinary hospital, verandah, pillars, a board with no text -----------------------------------
const Hospital: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt(), wall = "#E8C46A", pillar = "#F1D693";
    const pillars = Array.from({length: 10}, (_, i) => 150 + i * 182);
    return <g>
      <g transform={L(0.04)}><Sky stops={[[0, "#1E2E7A"], [0.35, "#3E5BB8"], [0.52, "#86A2DC"], [0.62, "#F3D3A0"], [1, "#F8E2B8"]]}/>
        <GlowDot x={240} y={120} r={700} c="#FFE2A0" o={0.6}/><Cloud f={f} x={900} y={230} s={1.4} c="#F6E8D8" o={0.85}/><Cloud f={f} x={1600} y={160} s={1.0} c="#F6E8D8" o={0.7}/><Cloud f={f} x={200} y={300} s={0.9} c="#F6E8D8" o={0.6}/></g>
      <g transform={L(0.16)}>
        {Array.from({length: 16}, (_, i) => <circle key={i} cx={-100 + i * 140 + (i % 3) * 20} cy={600 - (i % 4) * 22} r={90 + (i % 3) * 20} fill={T(i % 2 ? "#4E6E8E" : "#56789A")}/>)}
        <rect x={-300} y={600} width={2520} height={300} fill={T("#4E6E8E")}/>
      </g>
      <Haze y={480} h={220} c="#F3D3A0" o={0.5}/>
      <g transform={L(0.62)}>
        {/* verandah back wall, doors and windows in the shade of the roof */}
        <rect x={130} y={470} width={1660} height={300} fill={T(shadeOf(wall, 0.42))}/>
        {[330, 700, 1080, 1460].map((x, i) => <g key={i}>
          <rect x={x} y={548} width={116} height={222} rx={6} fill={T("#245C4A")}/>
          <rect x={x + 58} y={548} width={58} height={222} fill={T(shadeOf("#245C4A", 0.3))}/>
          <path d={`M ${x + 58} 548 L ${x + 58} 770`} stroke={T("#163A30")} strokeWidth={4}/>
        </g>)}
        {[500, 880, 1260, 1630].map((x, i) => <g key={i}>
          <rect x={x} y={560} width={96} height={120} rx={4} fill={T("#2A2238")}/>
          {[0, 1, 2, 3].map((k) => <rect key={k} x={x + 12 + k * 22} y={560} width={5} height={120} fill={T("#7C6A5A")}/>)}
          <rect x={x - 30} y={556} width={28} height={128} fill={T("#2E6E5A")}/><rect x={x + 98} y={556} width={28} height={128} fill={T(shadeOf("#2E6E5A", 0.3))}/>
        </g>)}
        <rect x={130} y={470} width={1660} height={60} fill={T("#1B1650")} opacity={0.35}/>
        {/* sun patches through the pillars */}
        <g style={{mixBlendMode: "screen"}}>{pillars.slice(0, -1).map((x, i) => <path key={i} d={poly([[x + 60, 770], [x + 170, 770], [x + 230, 560], [x + 120, 560]])} fill={T("#FFE2A0")} opacity={0.16}/>)}</g>
        {/* roof slab, parapet, central raised board */}
        <Lit d={rr(96, 438, 1728, 42, 4)} c="#EFDDB0" cut={1500} tilt={0} rim={3}/>
        <Lit d={rr(110, 396, 1700, 44, 2)} c={wall} cut={1500} tilt={0} rim={3}/>
        {Array.from({length: 42}, (_, i) => <rect key={i} x={130 + i * 40} y={404} width={14} height={28} rx={3} fill={T(shadeOf(wall, 0.3))}/>)}
        <Lit d={rr(690, 318, 540, 84, 4)} c={wall} cut={1080} tilt={0} rim={3}/>
        <path d="M 690 318 L 960 286 L 1230 318 Z" fill={T(litOf(wall, 0.2))}/>
        <rect x={730} y={332} width={460} height={56} rx={6} fill={T("#1F5A46")}/>
        {[[760, 120], [900, 70], [990, 150], [1160, 0]].map(([x, w], i) => w ? <rect key={i} x={x} y={352} width={w} height={14} rx={7} fill={T("#E9E2C4")} opacity={0.32}/> : null)}
        {/* pillars */}
        {pillars.map((x, i) => <g key={i}>
          <Lit d={rr(x, 480, 46, 290, 2)} c={pillar} cut={x + 28} tilt={0} rim={4}/>
          <rect x={x - 6} y={478} width={58} height={14} fill={T(litOf(pillar, 0.3))}/><rect x={x - 6} y={752} width={58} height={18} fill={T(shadeOf(pillar, 0.2))}/>
        </g>)}
        <Lit d={rr(100, 768, 1720, 34, 2)} c="#9A3B2A" cut={1500} tilt={0} rim={3}/>
        <Lit d={rr(840, 790, 240, 18, 2)} c="#C8B494" cut={1040} tilt={0}/>
        {/* bicycle at the first pillar */}
        <g transform="translate(250 790)" fill="none" stroke={T("#262236")} strokeWidth={6}>
          <circle cx={-60} cy={-38} r={38}/><circle cx={70} cy={-38} r={38}/>
          <path d="M -60 -38 L -10 -38 L 30 -96 L -30 -96 L -10 -38 M 30 -96 L 70 -38 M -36 -110 L -22 -110 M 22 -116 L 44 -116"/>
        </g>
        <g transform="translate(1290 790)"><Lit d="M -30 0 C -48 -10 -46 -50 -20 -60 L -14 -72 L 14 -72 L 20 -60 C 46 -50 48 -10 30 0 Z" c="#B4552E" cut={6} rim={3}/></g>
        {[262, 626, 1172, 1536].map((x, i) => <g key={i} transform={`translate(${x + 66} 770)`}>
          <Lit d="M -22 0 L -28 -40 L 28 -40 L 22 0 Z" c="#B4552E" cut={6} rim={2}/>
          {[-1, 0, 1].map((k) => <Lit key={k} d={ell(k * 16, -56 - (k === 0 ? 12 : 0), 20, 16)} c="#4E8A4A" cut={k * 16 + 6} rim={2}/>)}
        </g>)}
      </g>
      <g transform={L(0.8)}><Tree x={1830} y={800} r={190} f={f} seed={3} c="#3F8A5A"/></g>
      <g transform={L(1)}>
        <path d="M -300 800 L 2220 800 L 2220 1300 L -300 1300 Z" fill={T("#C27A45")}/>
        <path d="M 820 800 L 1100 800 L 1300 1300 L 640 1300 Z" fill={T("#D49A62")} opacity={0.6}/>
        <Stipple d="M -300 800 L 2220 800 L 2220 1300 L -300 1300 Z" c="#6A3A20" o={0.22} seed={12}/>
        {pillars.map((x, i) => <path key={i} d={poly([[x + 20, 806], [x + 50, 806], [x + 150, 870], [x + 110, 870]])} fill={T("#1B1650")} opacity={0.12}/>)}
        <Haze y={790} h={60} c="#FFE2A0" o={0.3}/>
        {[[140, 960], [1760, 940], [1880, 1000], [60, 880]].map(([x, y], i) => <Grass key={i} x={x} y={y} s={0.9} f={f} c="#6E9A3E" seed={i + 3}/>)}
        <g transform="translate(1720 860)">
          <Lit d={rr(-90, -16, 180, 22, 4)} c="#BFAE96" cut={40} tilt={0} rim={3}/><rect x={-76} y={6} width={18} height={30} fill={T("#8A7A66")}/><rect x={58} y={6} width={18} height={30} fill={T("#6E5E4E")}/>
        </g>
        <g transform="translate(120 850)">
          <Lit d={rr(-14, -120, 28, 120, 6)} c="#4E5A6A" cut={2} tilt={0} rim={3}/><path d="M 0 -110 L 60 -136" stroke={T("#3E4858")} strokeWidth={10} strokeLinecap="round"/>
          <path d="M -14 -84 L -44 -78 L -44 -70" stroke={T("#3E4858")} strokeWidth={10} fill="none" strokeLinecap="round"/>
          <Lit d={rr(-60, -6, 90, 16, 3)} c="#9A9AA8" cut={0} tilt={0}/>
        </g>
        {[[420, 1010, 10], [1240, 980, 8], [1560, 1030, 12]].map(([x, y, r], i) => <Lit key={i} d={ell(x, y, r * 1.6, r)} c="#A4683E" cut={x + r * 0.4} rim={2}/>)}
      </g>
    </g>;
  },
  Front: ({f, L}) => { const {T} = useArt(); return <g>
    <g transform={L(1)}><Shafts f={f} x={240} y={-160} ang={1.05} spread={0.5} n={7} len={1500} c="#FFE6B0" o={0.12} seed={8}/>
      <Motes f={f} n={30} seed={13} box={[100, 200, 1900, 900]} c="#FFF0C8" r={[1.2, 3]} vx={0.12} vy={-0.06} o={0.75}/></g>
    <g transform={L(1.3)}>
      <Lit d={rr(-60, 300, 110, 900, 4)} c="#B5603E" cut={20} tilt={0} rim={5}/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M -60 ${330 + i * 60} L 50 ${330 + i * 60}`} stroke={T("#7A3A28")} strokeWidth={4} opacity={0.5}/>)}
      <Lit d={rr(-76, 270, 142, 40, 4)} c="#E8C46A" cut={30} tilt={0}/>
      <Grass x={1870} y={1100} s={2.4} f={f} c="#3E5A2A" seed={31}/>
    </g>
  </g>; },
};

// ---- road: a country road; layers scroll with the distance driven ---------------------------------------------------------------
const Road: SetDef = {
  Back: ({f, L, scroll}) => {
    const {T} = useArt();
    const rep = (x0: number, period: number, k: number) => mod(x0 - scroll * k, period) - 200;
    return <g>
      <g transform={L(0.04)}><Sky stops={[[0, "#24408E"], [0.4, "#5577C8"], [0.53, "#A9C1E8"], [0.6, "#F2D8A6"], [1, "#F6E2BA"]]}/>
        <GlowDot x={300} y={140} r={700} c="#FFE6B0" o={0.55}/><Cloud f={f} x={700} y={300} s={1.5} c="#F6E8D8" o={0.85}/><Cloud f={f} x={1500} y={220} s={1.1} c="#F6E8D8" o={0.75}/><Cloud f={f} x={100} y={380} s={0.9} c="#F6E8D8" o={0.6}/><Cloud f={f} x={2100} y={360} s={1.2} c="#F6E8D8" o={0.7}/></g>
      <g transform={`${L(0.12)} translate(${-mod(scroll * 0.05, 1200)} 0)`}><Hill y={640} amp={130} seed={31} n={12} c="#5E6FAE" rim="#C8D2F0" x1={3500}/></g>
      <Haze y={560} h={170} c="#E8D8B8" o={0.5}/>
      <g transform={`${L(0.3)} translate(${-mod(scroll * 0.16, 1400)} 0)`}><Hill y={712} amp={80} seed={37} n={14} c="#3F8A7A" rim="#B8E8C8" x1={3700}/></g>
      <Haze y={660} h={130} c="#F2D8A6" o={0.35}/>
      <g transform={L(0.5)}>
        {Array.from({length: 9}, (_, i) => { const x = rep(i * 300 + 60, 2700, 0.42); return i % 3 === 1
          ? <Tree key={i} x={x} y={790} r={70 + (i % 2) * 16} f={f} seed={i} c="#2F7A5A"/>
          : <Palm key={i} x={x} y={790} h={210 + (i % 4) * 30} f={f} seed={i} lean={i % 2 ? -0.1 : 0.1} c="#5A4A44" fr="#2E8A64"/>; })}
      </g>
      <g transform={L(0.78)}>
        {Array.from({length: 6}, (_, i) => { const x = rep(i * 560, 3360, 0.78), nx = x + 560;
          return <g key={i}>
            <path d={`M ${x} 512 Q ${x + 280} 560 ${nx} 512 M ${x} 532 Q ${x + 280} 580 ${nx} 532`} stroke={T("#2A2A40")} strokeWidth={2.5} fill="none" opacity={0.7}/>
            <Lit d={rr(x - 7, 500, 14, 330, 3)} c="#6E5A4A" cut={x + 2} tilt={0}/>
            <rect x={x - 30} y={506} width={60} height={8} rx={3} fill={T("#4E3E34")}/><rect x={x - 22} y={526} width={44} height={7} rx={3} fill={T("#4E3E34")}/>
          </g>; })}
      </g>
      <g transform={L(1)}>
        <path d="M -300 790 L 2220 790 L 2220 1300 L -300 1300 Z" fill={T("#C98A50")}/>
        <Stipple d="M -300 790 L 2220 790 L 2220 846 L -300 846 Z" c="#6A3A20" o={0.25} seed={41}/>
        {Array.from({length: 3}, (_, i) => { const x = rep(i * 1100 + 300, 3300, 1); return <g key={i}>
          <Lit d={`M ${x - 18} 836 L ${x - 18} 800 Q ${x - 18} 780 ${x} 780 Q ${x + 18} 780 ${x + 18} 800 L ${x + 18} 836 Z`} c="#F2EEE2" cut={x + 6} tilt={0} rim={2}/>
          <path d={`M ${x - 18} 800 Q ${x - 18} 780 ${x} 780 Q ${x + 18} 780 ${x + 18} 800 Z`} fill={T("#E8762A")}/></g>; })}
        <rect x={-300} y={846} width={2520} height={150} fill={T("#4A4A62")}/>
        <rect x={-300} y={846} width={2520} height={8} fill={T("#8A8AA6")}/>
        <rect x={-300} y={960} width={2520} height={36} fill={T(shadeOf("#4A4A62", 0.25))}/>
        <Stipple d="M -300 854 L 2220 854 L 2220 996 L -300 996 Z" c="#2A2A3A" o={0.3} seed={43} size={16}/>
        {Array.from({length: 16}, (_, i) => { const x = rep(i * 180, 2880, 1); return <rect key={i} x={x} y={914} width={96} height={9} rx={4} fill={T("#E8E2C8")} opacity={0.85}/>; })}
        <path d="M -300 996 L 2220 996 L 2220 1300 L -300 1300 Z" fill={T("#B97A45")}/>
        <Stipple d="M -300 996 L 2220 996 L 2220 1300 L -300 1300 Z" c="#5A3018" o={0.3} seed={44}/>
        {Array.from({length: 8}, (_, i) => { const x = rep(i * 340 + 100, 2720, 1); return <Grass key={i} x={x} y={i % 2 ? 1030 : 792} s={i % 2 ? 1 : 0.6} f={f} c="#7A9A3E" seed={i}/>; })}
        <Haze y={770} h={60} c="#F6E2BA" o={0.4}/>
      </g>
    </g>;
  },
  Front: ({f, L, scroll}) => <g>
    <g transform={L(1)}><Motes f={f} n={22} seed={17} box={[-100, 300, 2020, 900]} c="#FFF2D0" r={[1.2, 2.8]} vx={0.1 - Math.min(2, scroll ? 1.2 : 0)} vy={-0.05} o={0.6}/></g>
    <g transform={`${L(1.35)}`}>{Array.from({length: 7}, (_, i) => { const x = mod(i * 420 - scroll * 1.35, 2940) - 200; return <Grass key={i} x={x} y={1100} s={2.2} f={f} c="#4E6A2A" seed={50 + i}/>; })}</g>
  </g>,
};

// ---- sheds: small thatched poultry sheds, wire mesh, a brooder glow, deep litter -------------------------------------------------
const Shed: React.FC<{x: number; w: number; f: number; seed: number}> = ({x, w, f, seed}) => {
  const {T} = useArt(), r = rng(seed + 60), thatch = "#C9A55A";
  const roof = poly([[x - 46, 566], [x + w + 46, 566], [x + w - 16, 404], [x + 16, 404]]);
  return <g>
    <rect x={x} y={540} width={w} height={170} fill={T("#2A2236")}/>
    <GlowDot x={x + w / 2} y={600} r={220} c="#FFB050" o={0.55 + 0.08 * Math.sin(f / 17 + seed)}/>
    {Array.from({length: 9}, (_, i) => <circle key={i} cx={x + 40 + r() * (w - 80)} cy={690 - r() * 30} r={6} fill={T("#FFD84A")} opacity={0.8}/>)}
    <g stroke={T("#C8C4D0")} strokeWidth={2} opacity={0.4}>{Array.from({length: Math.ceil(w / 24) + 8}, (_, i) => <path key={i} d={`M ${x + i * 24 - 170} 710 L ${x + i * 24} 540 M ${x + i * 24 - 170} 540 L ${x + i * 24} 710`}/>)}</g>
    <rect x={x - 2} y={540} width={4} height={1} fill="none"/>
    {Array.from({length: Math.floor(w / 135) + 1}, (_, i) => <Lit key={i} d={rr(x + i * 135 - 6, 540, 14, 260, 3)} c="#7A5232" cut={x + i * 135 + 2} tilt={0}/>)}
    <Lit d={rr(x, 700, w, 100, 4)} c="#B8784A" cut={x + w * 0.66} tilt={0} rim={3}/>
    <Stipple d={rr(x, 700, w, 100, 4)} c="#5A3020" o={0.3} seed={seed}/>
    <Lit d={roof} c={thatch} cut={x + w * 0.62} cy={480} tilt={0.55} rim={5} rimC="#F6DC98"/>
    {Array.from({length: Math.floor(w / 12)}, (_, i) => { const xx = x - 30 + i * 12 + (r() - 0.5) * 6; return <path key={i} d={`M ${xx + (xx - x - w / 2) * 0.08} 412 L ${xx + (xx - x - w / 2) * 0.12} 566`} stroke={T(i % 3 ? shadeOf(thatch, 0.25) : litOf(thatch, 0.3))} strokeWidth={2} opacity={0.5}/>; })}
    <path d={`M ${x - 46} 566 ` + Array.from({length: Math.floor((w + 92) / 16)}, (_, i) => `L ${x - 46 + i * 16 + 8} ${582 + (i % 2) * 6 + Math.sin(f / 30 + i) * 1.2} L ${x - 46 + (i + 1) * 16} 566`).join(" ") + " Z"} fill={T(shadeOf(thatch, 0.18))}/>
    <path d={`M ${x + w / 2} 566 L ${x + w / 2} 600`} stroke={T("#2A2236")} strokeWidth={3}/>
    <circle cx={x + w / 2} cy={606} r={9} fill={T("#FFF0C0")}/>
  </g>;
};
const Sheds: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt();
    return <g>
      <g transform={L(0.04)}><Sky stops={[[0, "#1E2E7A"], [0.35, "#3E5BB8"], [0.5, "#8AA6DC"], [0.6, "#F3D3A0"], [1, "#F8E2B8"]]}/>
        <GlowDot x={260} y={160} r={700} c="#FFE2A0" o={0.6}/><Cloud f={f} x={1000} y={250} s={1.4} c="#F6E8D8" o={0.85}/><Cloud f={f} x={1700} y={180} s={1.0} c="#F6E8D8" o={0.7}/><Cloud f={f} x={400} y={320} s={0.9} c="#F6E8D8" o={0.6}/></g>
      <g transform={L(0.16)}><Hill y={600} amp={90} seed={51} n={8} c="#5E74AE" rim="#D0DAF4"/></g>
      <Haze y={500} h={200} c="#F3D3A0" o={0.45}/>
      <g transform={L(0.35)}>{[80, 330, 600, 900, 1180, 1470, 1760].map((x, i) => <Palm key={i} x={x} y={640} h={300 + (i % 3) * 40} f={f} seed={i + 3} lean={i % 2 ? -0.12 : 0.1} c="#5A4A5A" fr="#2D7E6A"/>)}
        <path d="M -300 630 L 2220 630 L 2220 900 L -300 900 Z" fill={T("#3E7E6A")}/></g>
      <Haze y={560} h={140} c="#F3D3A0" o={0.3}/>
      <g transform={L(0.62)}>
        <Shed x={40} w={540} f={f} seed={1}/><Shed x={690} w={540} f={f} seed={2}/><Shed x={1340} w={540} f={f} seed={3}/>
        <g transform="translate(640 800)"><Lit d="M -34 0 L -40 -70 Q 0 -84 40 -70 L 34 0 Z" c="#D8CBA8" cut={10} rim={3}/><path d="M -40 -70 Q 0 -60 40 -70" stroke={T("#9A8A6A")} strokeWidth={3} fill="none"/></g>
        <g transform="translate(1290 800)"><Lit d="M -34 0 L -40 -70 Q 0 -84 40 -70 L 34 0 Z" c="#D8CBA8" cut={10} rim={3}/></g>
      </g>
      <g transform={L(1)}>
        <path d="M -300 796 L 2220 796 L 2220 1300 L -300 1300 Z" fill={T("#C9A060")}/>
        <Stipple d="M -300 796 L 2220 796 L 2220 1300 L -300 1300 Z" c="#7A5420" o={0.35} seed={53} size={14}/>
        <Stipple d="M -300 796 L 2220 796 L 2220 1300 L -300 1300 Z" c="#FFF0B8" o={0.25} seed={54} size={18}/>
        <Haze y={784} h={60} c="#FFE2A0" o={0.35}/>
        {[[590, 930], [1340, 940]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
          <Lit d={ell(0, 0, 70, 16)} c="#A9AEBE" cut={20} tilt={0} rim={3}/><ellipse cx={0} cy={-4} rx={56} ry={9} fill={T("#E2B860")}/></g>)}
        {Array.from({length: 40}, (_, i) => { const r = rng(i + 300); const x = r() * 2000 - 40, y = 820 + r() * 240; return <path key={i} d={`M ${x} ${y} l ${10 + r() * 14} ${(r() - 0.5) * 8}`} stroke={T(i % 2 ? "#E8C47A" : "#8A6430")} strokeWidth={3} strokeLinecap="round"/>; })}
      </g>
    </g>;
  },
  Front: ({f, L}) => <g>
    <g transform={L(1)}><Shafts f={f} x={260} y={-120} ang={1.0} spread={0.55} n={7} len={1500} c="#FFE6B0" o={0.12} seed={18}/>
      <Motes f={f} n={34} seed={19} box={[0, 300, 1920, 960]} c="#FFF0C0" r={[1.2, 3]} vx={0.1} vy={-0.08} o={0.75}/></g>
    <g transform={L(1.3)}><Lit d={rr(1880, 360, 90, 900, 6)} c="#7A5232" cut={1920} tilt={0} rim={4}/><Grass x={60} y={1100} s={2.2} f={f} c="#8A7030" seed={61}/></g>
  </g>,
};

// ---- market: a town street with shophouses, striped awnings, stalls and passers-by ----------------------------------------------
const Stall: React.FC<{x: number; w: number; f: number; seed: number; c1: string; c2: string; goods: "veg" | "sacks" | "bananas"}> = ({x, w, f, seed, c1, c2, goods}) => {
  const {T} = useArt(), r = rng(seed + 90), wave = Math.sin(f / 36 + seed) * 2;
  const n = Math.floor(w / 40);
  return <g>
    <Lit d={rr(x + 6, 470, 12, 330, 3)} c="#6A4A3A" cut={x + 12} tilt={0}/><Lit d={rr(x + w - 18, 470, 12, 330, 3)} c="#6A4A3A" cut={x + w - 12} tilt={0}/>
    <Lit d={rr(x - 10, 690, w + 20, 26, 4)} c="#8A5A3A" cut={x + w * 0.7} tilt={0} rim={3}/>
    <rect x={x} y={716} width={w} height={84} fill={T(shadeOf("#8A5A3A", 0.4))}/>
    {goods === "veg" && Array.from({length: 14}, (_, i) => { const row = i < 6 ? 0 : i < 11 ? 1 : 2, k = row === 0 ? i : row === 1 ? i - 6 : i - 11;
      const cx = x + 40 + k * 34 + row * 17, cy = 676 - row * 24; return <Lit key={i} d={ell(cx, cy, 16)} c={i % 3 ? "#E2453A" : "#C8784A"} cut={cx + 4} rim={2}/>; })}
    {goods === "veg" && Array.from({length: 8}, (_, i) => { const cx = x + w - 160 + (i % 4) * 32 + Math.floor(i / 4) * 16, cy = 678 - Math.floor(i / 4) * 22; return <Lit key={`o${i}`} d={ell(cx, cy, 14, 13)} c="#B86A8A" cut={cx + 3} rim={2}/>; })}
    {goods === "sacks" && Array.from({length: 4}, (_, i) => { const cx = x + 60 + i * (w - 120) / 3; return <g key={i}><Lit d={`M ${cx - 40} 690 Q ${cx - 46} 630 ${cx - 30} 620 L ${cx + 30} 620 Q ${cx + 46} 630 ${cx + 40} 690 Z`} c="#D9C08A" cut={cx + 10} rim={3}/>
      <ellipse cx={cx} cy={622} rx={30} ry={9} fill={T(i % 2 ? "#F2E2B0" : "#E8B04A")}/></g>; })}
    <g transform={`translate(0 ${wave * 0.3})`}>
      <path d={`M ${x - 24} 470 L ${x + w + 24} 470 L ${x + w + 4} 420 L ${x - 4} 420 Z`} fill={T(c1)}/>
      {Array.from({length: n}, (_, i) => i % 2 ? <path key={i} d={`M ${x - 24 + (i * (w + 48)) / n} 470 L ${x - 24 + ((i + 1) * (w + 48)) / n} 470 L ${x - 4 + ((i + 1) * (w + 8)) / n} 420 L ${x - 4 + (i * (w + 8)) / n} 420 Z`} fill={T(c2)}/> : null)}
      <path d={`M ${x - 24} 470 ` + Array.from({length: n}, (_, i) => `Q ${x - 24 + ((i + 0.5) * (w + 48)) / n} ${500 + wave} ${x - 24 + ((i + 1) * (w + 48)) / n} 470`).join(" ") + " Z"} fill={T(c1)}/>
      <path d={`M ${x - 24} 470 L ${x + w + 24} 470 L ${x + w + 4} 420 L ${x + w * 0.6} 420 Z`} fill={T("#1B1650")} opacity={0.18}/>
    </g>
    {goods === "bananas" && [x + 50, x + w - 60].map((bx, i) => <g key={i} transform={`rotate(${Math.sin(f / 40 + i + seed) * 3} ${bx} 480)`}>
      <path d={`M ${bx} 480 L ${bx} 500`} stroke={T("#5A4A3A")} strokeWidth={4}/>
      {Array.from({length: 7}, (_, k) => { const fx = bx - 30 + (k % 4) * 16 + (Math.floor(k / 4) * 8), fy = 500 + Math.floor(k / 4) * 24; return <Lit key={k} d={`M ${fx} ${fy} C ${fx + 2} ${fy + 20} ${fx + 10} ${fy + 34} ${fx + 26} ${fy + 40} C ${fx + 18} ${fy + 30} ${fx + 13} ${fy + 16} ${fx + 12} ${fy} Z`} c="#F2C83A" cut={fx + 8} rim={2}/>; })}
    </g>)}
    <path d={`M ${x + w / 2} 470 L ${x + w / 2} 520`} stroke={T("#2A2236")} strokeWidth={3}/>
    <GlowDot x={x + w / 2} y={528} r={90} c="#FFC86B" o={0.55}/><circle cx={x + w / 2} cy={528} r={9} fill={T("#FFF2C8")}/>
  </g>;
};
const Market: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt();
    const shops: [number, number, number, string][] = [[-120, 300, 470, "#E6C27A"], [180, 330, 410, "#9CC3D9"], [510, 280, 500, "#E7A99C"], [790, 320, 430, "#BFD8A8"], [1110, 300, 480, "#E6C27A"], [1410, 340, 420, "#C9B4E0"], [1750, 320, 470, "#9CC3D9"]];
    return <g>
      <g transform={L(0.04)}><Sky stops={[[0, "#3A5AAE"], [0.3, "#6A86C8"], [0.45, "#F2D6A0"], [1, "#F6E2BA"]]}/><GlowDot x={280} y={60} r={600} c="#FFE6B0" o={0.55}/><Cloud f={f} x={900} y={170} s={1.1} c="#F6E8D8" o={0.8}/><Cloud f={f} x={1600} y={120} s={0.9} c="#F6E8D8" o={0.7}/></g>
      <g transform={L(0.3)}>
        {shops.map(([x, w, h, c], i) => { const top = 770 - h; return <g key={i}>
          <Lit d={rr(x, top, w, h, 2)} c={c} cut={x + w * 0.7} tilt={0} rim={4}/>
          <Lit d={rr(x - 10, top - 18, w + 20, 22, 2)} c={litOf(c, 0.2)} cut={x + w * 0.7} tilt={0}/>
          {[0, 1].map((k) => <g key={k}>
            <rect x={x + 30 + k * (w - 120)} y={top + 40} width={60} height={90} rx={30} fill={T("#2A2238")}/>
            <rect x={x + 26 + k * (w - 120)} y={top + 40} width={8} height={90} fill={T(shadeOf(c, 0.4))}/>
          </g>)}
          <rect x={x + 10} y={top + 150} width={w - 20} height={10} fill={T(shadeOf(c, 0.3))}/>
          {Array.from({length: Math.floor((w - 20) / 22)}, (_, k) => <rect key={k} x={x + 14 + k * 22} y={top + 160} width={5} height={36} fill={T(shadeOf(c, 0.35))}/>)}
          <rect x={x + 30} y={top + 214} width={w - 60} height={56} rx={6} fill={T(["#2E6E5A", "#B8393A", "#2C3556", "#E8762A"][i % 4])}/>
          <rect x={x + 50} y={top + 236} width={(w - 100) * 0.55} height={12} rx={6} fill={T("#F4EBD0")} opacity={0.3}/>
          <rect x={x + 20} y={top + 300} width={w - 40} height={h - 300} fill={T("#2A2238")}/>
          <GlowDot x={x + w / 2} y={top + 340} r={120} c="#FFB050" o={0.35}/>
        </g>; })}
        <path d={`M -200 230 Q 400 ${290 + Math.sin(f / 50) * 4} 1000 240 T 2200 240`} stroke={T("#2A2238")} strokeWidth={3} fill="none"/>
        {Array.from({length: 22}, (_, i) => { const x = -160 + i * 105, y = 252 + Math.sin(i / 3.5) * 22 + Math.sin(f / 30 + i) * 2; return <path key={i} d={`M ${x} ${y} L ${x + 40} ${y + 2} L ${x + 18} ${y + 40 + Math.sin(f / 21 + i) * 3} Z`} fill={T(["#F25F5C", "#FFD25A", "#2EC4B6", "#7B6CF6"][i % 4])}/>; })}
      </g>
      <Haze y={600} h={200} c="#F2D6A0" o={0.35}/>
      <g transform={L(0.55)}>{Array.from({length: 6}, (_, i) => { const x = mod(i * 380 + f * (i % 2 ? 0.6 : -0.5), 2400) - 240;
        return <g key={i} opacity={0.85}><Person who={i % 3 === 0 ? "farmer" : i % 3 === 1 ? "farmer2" : "trader"} x={x} y={800} h={190} f={f * 1.6} seed={i + 30} flip={i % 2 === 0}/></g>; })}</g>
      <Haze y={640} h={180} c="#F6E2BA" o={0.3}/>
      <g transform={L(0.8)}>
        <Stall x={40} w={380} f={f} seed={1} c1="#F2EAD6" c2="#E8762A" goods="veg"/>
        <Stall x={1450} w={400} f={f} seed={2} c1="#F2EAD6" c2="#2E9C8E" goods="sacks"/>
        <Stall x={860} w={300} f={f} seed={3} c1="#F2EAD6" c2="#B8393A" goods="bananas"/>
      </g>
      <g transform={L(1)}>
        <path d="M -300 800 L 2220 800 L 2220 1300 L -300 1300 Z" fill={T("#B98552")}/>
        <Stipple d="M -300 800 L 2220 800 L 2220 1300 L -300 1300 Z" c="#5A3018" o={0.28} seed={71}/>
        {Array.from({length: 5}, (_, i) => <path key={i} d={`M -300 ${840 + i * i * 22} L 2220 ${840 + i * i * 22}`} stroke={T("#9A6A3E")} strokeWidth={3} opacity={0.5}/>)}
        <Haze y={790} h={50} c="#FFE2A0" o={0.3}/>
        {Array.from({length: 18}, (_, i) => { const r = rng(i + 500), x = r() * 2000 - 40, y = 830 + r() * 220; return <ellipse key={i} cx={x} cy={y} rx={8 + r() * 6} ry={4} fill={T(i % 3 ? "#7A9A3E" : "#E8B04A")} opacity={0.7} transform={`rotate(${r() * 60 - 30} ${x} ${y})`}/>; })}
      </g>
    </g>;
  },
  Front: ({f, L}) => <g>
    <g transform={L(1)}><Motes f={f} n={26} seed={23} box={[0, 300, 1920, 900]} c="#FFF0C8" r={[1.2, 3]} vx={0.12} vy={-0.06} o={0.6}/></g>
    <g transform={L(1.3)}><Lit d={rr(-40, 140, 80, 1000, 6)} c="#6A4A3A" cut={0} tilt={0} rim={4}/><Grass x={1860} y={1100} s={2.2} f={f} c="#6E7A3A" seed={71}/></g>
  </g>,
};

// ---- train: an old platform, a canopy on iron columns, maroon coaches, a goods wagon, steam drifting in -------------------------
const Train: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt(), coach = "#7A2E2A";
    const Coach = ({x, w}: {x: number; w: number}) => <g>
      <Lit d={rr(x, 450, w, 340, 14)} c={coach} cut={x + w * 0.78} tilt={0} rim={5}/>
      <path d={`M ${x} 470 Q ${x} 430 ${x + 30} 428 L ${x + w - 30} 428 Q ${x + w} 430 ${x + w} 470 Z`} fill={T("#4A4652")}/>
      <rect x={x} y={610} width={w} height={14} fill={T("#E8C46A")} opacity={0.85}/>
      {Array.from({length: Math.floor((w - 160) / 92)}, (_, i) => { const wx = x + 110 + i * 92; return <g key={i}>
        <rect x={wx} y={500} width={58} height={84} rx={8} fill={T("#231C2A")}/>
        {i % 3 === 1 && <rect x={wx} y={500} width={58} height={84} rx={8} fill={T("#FFC86B")} opacity={0.35}/>}
        {[0, 1, 2].map((k) => <rect key={k} x={wx} y={516 + k * 22} width={58} height={4} fill={T("#8A6A5A")}/>)}
      </g>; })}
      <rect x={x + 22} y={490} width={64} height={260} rx={6} fill={T(shadeOf(coach, 0.35))}/><rect x={x + 30} y={510} width={48} height={60} rx={5} fill={T("#231C2A")}/>
    </g>;
    return <g>
      <g transform={L(0.04)}><Sky stops={[[0, "#3E5BB8"], [0.35, "#7F9BDA"], [0.48, "#F0D2A0"], [1, "#F6E2BA"]]}/><GlowDot x={220} y={240} r={600} c="#FFE6B0" o={0.6}/><Cloud f={f} x={1100} y={380} s={1.2} c="#F6E8D8" o={0.8}/><Cloud f={f} x={1800} y={330} s={0.9} c="#F6E8D8" o={0.7}/></g>
      <g transform={L(0.2)}>
        {Array.from({length: 12}, (_, i) => <circle key={i} cx={-60 + i * 180} cy={470 - (i % 3) * 16} r={70 + (i % 2) * 20} fill={T("#5E7EA0")}/>)}
        <Lit d={rr(1500, 300, 30, 200, 2)} c="#6A6A80" cut={1516} tilt={0}/><Lit d={rr(1440, 240, 150, 70, 10)} c="#7A7A92" cut={1540} tilt={0}/>
      </g>
      <Haze y={380} h={160} c="#F0D2A0" o={0.45}/>
      <g transform={L(0.42)}>
        <Smoke f={f} x={-80} y={470} c="#F4F0EA" n={9} life={240} rise={260} drift={1100} r0={40} r1={150} o={0.6} seed={3} blur={14}/>
      </g>
      <g transform={L(0.58)}>
        <Coach x={-260} w={720}/><Coach x={480} w={760}/>
        <rect x={460} y={480} width={20} height={300} fill={T("#2A2230")}/>
        <Lit d={rr(1260, 440, 700, 350, 8)} c="#6A4A3A" cut={1700} tilt={0} rim={5}/>
        {Array.from({length: 13}, (_, i) => <rect key={i} x={1270 + i * 52} y={450} width={6} height={330} fill={T(shadeOf("#6A4A3A", 0.3))}/>)}
        <rect x={1440} y={490} width={260} height={290} fill={T("#1E1824")}/>
        {[[1480, 740], [1560, 740], [1640, 740], [1520, 680], [1600, 680]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(0.5)`}><CrateArt f={f} seed={i}/></g>)}
        <Lit d={rr(1700, 480, 160, 304, 4)} c="#7A5A44" cut={1790} tilt={0}/>
      </g>
      <g transform={L(0.86)}>
        <Lit d={poly([[-300, -60], [2220, -60], [2220, 170], [-300, 200]])} c="#5A4E62" cut={1700} tilt={0.3} cy={100}/>
        <path d={"M -300 196 " + Array.from({length: 64}, (_, i) => `L ${-300 + i * 40 + 20} ${222} L ${-300 + (i + 1) * 40} ${196 - (i + 1) * 0.47}`).join(" ") + " L 2220 166 L 2220 150 L -300 180 Z"} fill={T("#E8C46A")}/>
        {[360, 1000, 1640].map((x, i) => <g key={i}>
          <Lit d={rr(x - 14, 180, 28, 640, 6)} c="#3E5A50" cut={x + 4} tilt={0} rim={4}/>
          <path d={`M ${x} 260 Q ${x - 70} 250 ${x - 100} 196 M ${x} 260 Q ${x + 70} 250 ${x + 100} 196`} stroke={T("#3E5A50")} strokeWidth={10} fill="none"/>
          <rect x={x - 22} y={790} width={44} height={30} rx={4} fill={T("#2E443C")}/>
        </g>)}
        <g transform={`rotate(${Math.sin(f / 60) * 1.5} 680 196)`}>
          <path d="M 680 196 L 680 248" stroke={T("#2A2230")} strokeWidth={5}/>
          <Lit d={ell(680, 292, 46)} c="#F4EEDC" cut={696} rim={3}/><circle cx={680} cy={292} r={46} fill="none" stroke={T("#3E5A50")} strokeWidth={8}/>
          {Array.from({length: 12}, (_, i) => <rect key={i} x={678} y={252} width={4} height={8} fill={T("#5A5468")} transform={`rotate(${i * 30} 680 292)`}/>)}
          <path d={`M 680 292 L ${680 + Math.sin(f / 400) * 22} ${292 - Math.cos(f / 400) * 22}`} stroke={T("#231C2A")} strokeWidth={6} strokeLinecap="round"/>
          <path d={`M 680 292 L ${680 + Math.sin(f / 33) * 34} ${292 - Math.cos(f / 33) * 34}`} stroke={T("#231C2A")} strokeWidth={4} strokeLinecap="round"/>
        </g>
        <path d="M 1320 196 L 1320 236" stroke={T("#2A2230")} strokeWidth={4}/><GlowDot x={1320} y={250} r={100} c="#FFC86B" o={0.55}/><circle cx={1320} cy={248} r={12} fill={T("#FFF2C8")}/>
      </g>
      <g transform={L(1)}>
        <rect x={-300} y={784} width={2520} height={30} fill={T("#1E1824")} opacity={0.75}/>
        <path d="M -300 800 L 2220 800 L 2220 1300 L -300 1300 Z" fill={T("#C9B08A")}/>
        <rect x={-300} y={800} width={2520} height={18} fill={T("#F2E6C0")}/>
        {Array.from({length: 4}, (_, i) => <path key={i} d={`M -300 ${850 + i * i * 30} L 2220 ${850 + i * i * 30}`} stroke={T("#9A8462")} strokeWidth={3} opacity={0.55}/>)}
        {Array.from({length: 14}, (_, i) => <path key={i} d={`M ${-200 + i * 170} 818 L ${-200 + i * 170 + (i * 170 - 1060) * 0.5} 1300`} stroke={T("#9A8462")} strokeWidth={3} opacity={0.4}/>)}
        <Stipple d="M -300 818 L 2220 818 L 2220 1300 L -300 1300 Z" c="#5A4630" o={0.25} seed={81}/>
        <g transform="translate(1720 900) scale(1.1)"><CrateArt f={f} seed={7}/></g>
        <g transform="translate(1720 822) scale(1.1)"><CrateArt f={f} seed={8}/></g>
        <g transform="translate(1110 900)"><Lit d={rr(-120, -40, 240, 22, 4)} c="#8A5A3A" cut={60} tilt={0} rim={3}/><circle cx={-80} cy={-6} r={24} fill={T("#2A2230")}/><circle cx={80} cy={-6} r={24} fill={T("#2A2230")}/>
          <path d="M 120 -30 L 190 -90" stroke={T("#6A4A3A")} strokeWidth={8} strokeLinecap="round"/></g>
      </g>
    </g>;
  },
  Front: ({f, L}) => <g>
    <g transform={L(1)}><Shafts f={f} x={220} y={160} ang={0.75} spread={0.5} n={6} len={1400} c="#FFE6B0" o={0.12} seed={28}/>
      <Motes f={f} n={28} seed={29} box={[0, 220, 1920, 900]} c="#FFF0C8" r={[1.2, 3]} vx={0.14} vy={-0.06} o={0.7}/></g>
    <g transform={L(1.3)}><Lit d={rr(-90, 120, 120, 1000, 8)} c="#2E443C" cut={-20} tilt={0} rim={5}/></g>
  </g>,
};

// ---- hall: a meeting hall in 1982 lamplight, tall windows, a chalkboard with scribbles (no text), fans turning -------------------
const Fan: React.FC<{x: number; f: number; seed: number}> = ({x, f, seed}) => {
  const {T} = useArt(), th = f * 0.055 + seed;
  return <g>
    <path d={`M ${x} 0 L ${x} 96`} stroke={T("#3A2A30")} strokeWidth={6}/>
    {[0, 1, 2].map((k) => { const a = th + (k * 2 * Math.PI) / 3, c = Math.cos(a); return <ellipse key={k} cx={x + c * 41} cy={104 + Math.sin(a) * 3} rx={Math.abs(c) * 41 + 8} ry={7} fill={T(mix("#5A4048", "#7A5A60", 0.5 + 0.5 * Math.sin(a)))}/>; })}
    <Lit d={ell(x, 102, 22, 14)} c="#8A6A6A" cut={x + 6}/>
  </g>;
};
const Hall: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt(), wall = "#E3C48E";
    const Win = ({x}: {x: number}) => <g>
      <rect x={x - 12} y={168} width={214} height={414} rx={100} fill={T("#7A4E2E")}/>
      <rect x={x} y={180} width={190} height={390} rx={95} fill={T("#FFE8B8")}/>
      <GlowDot x={x + 95} y={330} r={260} c="#FFE2A0" o={0.45}/>
      <path d={`M ${x + 95} 180 L ${x + 95} 570 M ${x} 330 L ${x + 190} 330 M ${x} 450 L ${x + 190} 450`} stroke={T("#7A4E2E")} strokeWidth={8}/>
    </g>;
    return <g>
      <g transform={L(0.4)}>
        <rect x={-300} y={-200} width={2520} height={1100} fill={T(wall)}/>
        <Stipple d="M -300 -200 L 2220 -200 L 2220 900 L -300 900 Z" c="#9A7040" o={0.14} seed={91}/>
        <rect x={-300} y={-200} width={2520} height={290} fill={T("#B88A5A")}/>
        {Array.from({length: 9}, (_, i) => <Lit key={i} d={rr(-200 + i * 280, -200, 40, 290, 2)} c="#8A5E3A" cut={-180 + i * 280} tilt={0}/>)}
        <rect x={-300} y={88} width={2520} height={14} fill={T("#9A6A3A")}/>
        <rect x={-300} y={640} width={2520} height={170} fill={T("#9A5A3A")}/><rect x={-300} y={640} width={2520} height={10} fill={T("#C8885A")}/>
        <Win x={140}/><Win x={1590}/>
        <rect x={1250} y={168} width={220} height={16} rx={8} fill={T("#FFF8E0")}/><GlowDot x={1360} y={176} r={160} c="#FFF0C0" o={0.5}/>
        <Lit d={rr(546, 214, 578, 284, 10)} c="#7A4E2E" cut={1000} tilt={0} rim={4}/>
        <rect x={562} y={230} width={546} height={252} rx={4} fill={T("#2E3E3A")}/>
        <Stipple d={rr(562, 230, 546, 252, 4)} c="#9AB0A4" o={0.12} seed={92} size={18}/>
        <g fill="none" stroke={T("#E8EEE8")} strokeWidth={5} strokeLinecap="round" opacity={0.75}>
          <path d="M 640 300 C 640 262 690 262 690 300 C 690 330 640 330 640 300 Z"/>
          <path d="M 720 300 L 800 300 M 790 290 L 802 300 L 790 310"/>
          <path d="M 840 280 Q 880 270 920 286 Q 960 300 1000 282"/><path d="M 840 330 Q 900 320 980 336"/>
          <path d="M 620 400 L 620 450 L 760 450"/><path d="M 640 440 L 680 410 L 710 425 L 750 380"/>
          <path d="M 820 400 Q 860 390 900 404 T 1060 400"/><path d="M 820 440 Q 900 430 1020 446"/>
        </g>
        <rect x={556} y={484} width={558} height={14} rx={4} fill={T("#8A5E3A")}/>
        <rect x={600} y={480} width={30} height={7} rx={3} fill={T("#F4F4F0")}/>
        <g transform={`rotate(${Math.sin(f / 70) * 0.6} 835 150)`}>
          <path d="M 560 150 L 1110 150" stroke={T("#5A4048")} strokeWidth={3}/>
          <path d={`M 600 150 L 1070 150 L 1070 196 Q 835 ${206 + Math.sin(f / 40) * 3} 600 196 Z`} fill={T("#F25F5C")}/>
          <rect x={660} y={166} width={350} height={12} rx={6} fill={T("#FFE2C2")} opacity={0.35}/>
          <path d="M 600 150 L 1070 150 L 1070 160 L 600 160 Z" fill={T("#B8393A")}/>
        </g>
      </g>
      <g transform={L(0.55)}><Fan x={480} f={f} seed={0}/><Fan x={1400} f={f} seed={1.3}/></g>
      <g transform={L(1)}>
        <path d="M -300 800 L 2220 800 L 2220 1300 L -300 1300 Z" fill={T("#8E5A3E")}/>
        {Array.from({length: 5}, (_, i) => <path key={i} d={`M -300 ${830 + i * i * 26} L 2220 ${830 + i * i * 26}`} stroke={T("#6E4030")} strokeWidth={3} opacity={0.5}/>)}
        {Array.from({length: 16}, (_, i) => <path key={i} d={`M ${-300 + i * 160} 800 L ${-300 + i * 160 + (i * 160 - 1260) * 0.7} 1300`} stroke={T("#6E4030")} strokeWidth={3} opacity={0.35}/>)}
        <path d="M 160 800 L 360 800 L 520 1300 L 160 1300 Z" fill={T("#FFD9A0")} opacity={0.18}/>
        <path d="M 1610 800 L 1800 800 L 1980 1300 L 1640 1300 Z" fill={T("#FFD9A0")} opacity={0.16}/>
        <Haze y={780} h={60} c="#5A2A2A" o={0.35}/>
      </g>
    </g>;
  },
  Front: ({f, L}) => { const {T} = useArt(); return <g>
    <g transform={L(1)}>
      <Shafts f={f} x={235} y={300} ang={0.62} spread={0.35} n={5} len={1300} c="#FFE2A8" o={0.13} seed={38}/>
      <Shafts f={f} x={1685} y={300} ang={0.62} spread={0.3} n={4} len={700} c="#FFE2A8" o={0.1} seed={39}/>
      <Motes f={f} n={36} seed={33} box={[0, 160, 1920, 900]} c="#FFE8B8" r={[1.2, 3]} vx={0.1} vy={-0.05} o={0.7}/>
    </g>
    <g transform={L(1.3)}>
      <Lit d={rr(-200, 1010, 900, 40, 8)} c="#4A2A30" cut={600} tilt={0} rim={4}/><Lit d={rr(1300, 1020, 900, 40, 8)} c="#4A2A30" cut={2000} tilt={0} rim={4}/>
      {[-120, 200, 540, 1380, 1720].map((x) => <rect key={x} x={x} y={1040} width={26} height={80} fill={T("#3A2028")}/>)}
    </g>
  </g>; },
};

// ---- regulator: a modern government office in Delhi at blue hour; columns, steps, an empty flag pole -----------------------------
const Regulator: SetDef = {
  Back: ({f, L}) => {
    const {T} = useArt(), stone = "#C96A48", r = rng(77);
    const cols = Array.from({length: 9}, (_, i) => 330 + i * 157);
    return <g>
      <g transform={L(0.04)}><Sky stops={[[0, "#0B1433"], [0.33, "#1E2C70"], [0.47, "#3E4FA8"], [0.56, "#9A6FB0"], [0.63, "#F2A07A"], [1, "#F6C090"]]}/>
        <StarField f={f} n={60} seed={9} y1={360}/></g>
      <g transform={L(0.15)}>
        {Array.from({length: 24}, (_, i) => { const x = -200 + i * 100 + r() * 30, h = 90 + r() * 170, w = 70 + r() * 40; return <g key={i}>
          <rect x={x} y={720 - h} width={w} height={h} fill={T(i % 2 ? "#2A3270" : "#323A7E")}/>
          {Array.from({length: 6}, (_, k) => r() < 0.45 ? <rect key={k} x={x + 10 + (k % 3) * 20} y={730 - h + 16 + Math.floor(k / 3) * 26} width={8} height={10} fill={T("#FFD27A")} opacity={0.75}/> : null)}
        </g>; })}
      </g>
      <Haze y={560} h={220} c="#9A6FB0" o={0.35}/>
      <g transform={L(0.5)}>
        <Lit d={rr(420, 180, 1080, 130, 4)} c="#B85A3E" cut={1300} tilt={0} rim={4}/>
        {Array.from({length: 10}, (_, i) => <rect key={i} x={460 + i * 104} y={206} width={70} height={76} rx={4} fill={T(i % 3 === 1 ? "#FFD27A" : "#1F2A5A")} opacity={i % 3 === 1 ? 0.8 : 1}/>)}
        <rect x={240} y={330} width={1440} height={420} fill={T("#1F2A5A")}/>
        {Array.from({length: 4}, (_, row) => Array.from({length: 18}, (_, k) => { const on = r() < 0.5; return <rect key={`${row}-${k}`} x={256 + k * 79} y={350 + row * 96} width={62} height={76} fill={T(on ? "#FFD27A" : "#2E3A78")} opacity={on ? 0.55 + 0.25 * Math.sin(f / 90 + k + row) : 1}/>; }))}
        <Lit d={rr(206, 290, 1508, 54, 4)} c="#D9805C" cut={1500} tilt={0} rim={5}/>
        <rect x={206} y={290} width={1508} height={8} fill={T("#F6B08A")}/>
        {cols.map((x, i) => <g key={i}><Lit d={rr(x - 26, 344, 52, 400, 3)} c={stone} cut={x + 8} tilt={0} rim={5} rimC="#F6B08A"/>
          <rect x={x - 32} y={344} width={64} height={14} fill={T(shadeOf(stone, 0.3))}/></g>)}
        {[0, 1, 2].map((k) => <Lit key={k} d={rr(180 - k * 30, 744 + k * 18, 1560 + k * 60, 20, 2)} c="#D9C2A8" cut={1600 + k * 30} tilt={0} rim={3}/>)}
        <g transform="translate(150 800)">
          <Lit d={rr(-6, -620, 12, 620, 4)} c="#D8DCE6" cut={2} tilt={0} rim={2}/><circle cx={0} cy={-626} r={10} fill={T("#F2E2A0")}/>
          <path d={`M 4 -610 Q ${10 + Math.sin(f / 40) * 3} -300 4 -20`} stroke={T("#9A9AB0")} strokeWidth={2} fill="none"/>
          <Lit d={rr(-40, -16, 80, 16, 3)} c="#B8B0C8" cut={10} tilt={0}/>
        </g>
      </g>
      <g transform={L(0.78)}>
        <Tree x={-40} y={810} r={210} f={f} seed={6} c="#245A5E"/><Tree x={1960} y={810} r={220} f={f} seed={7} c="#245A5E"/>
        {Array.from({length: 22}, (_, i) => <Lit key={i} d={ell(-100 + i * 100, 806, 66, 40)} c="#2A6A5E" cut={-100 + i * 100 + 20} rim={3}/>)}
      </g>
      <g transform={L(1)}>
        <path d="M -300 810 L 2220 810 L 2220 1300 L -300 1300 Z" fill={T("#5E5478")}/>
        {Array.from({length: 5}, (_, i) => <path key={i} d={`M -300 ${840 + i * i * 26} L 2220 ${840 + i * i * 26}`} stroke={T("#463E62")} strokeWidth={3} opacity={0.6}/>)}
        {Array.from({length: 14}, (_, i) => <path key={i} d={`M ${-200 + i * 170} 810 L ${-200 + i * 170 + (i * 170 - 1160) * 0.6} 1300`} stroke={T("#463E62")} strokeWidth={3} opacity={0.5}/>)}
        {Array.from({length: 9}, (_, i) => <rect key={i} x={280 + i * 160} y={830 + (i % 2) * 8} width={40} height={90} fill={T("#FFD27A")} opacity={0.08}/>)}
        <Stipple d="M -300 810 L 2220 810 L 2220 1300 L -300 1300 Z" c="#2A2448" o={0.25} seed={101}/>
        {[300, 1760].map((x, i) => <g key={i}>
          <Lit d={rr(x - 7, 470, 14, 400, 4)} c="#3A3850" cut={x + 2} tilt={0} rim={2}/>
          <path d={`M ${x} 476 Q ${x + 40} 456 ${x + 64} 476`} stroke={T("#3A3850")} strokeWidth={8} fill="none"/>
          <GlowDot x={x + 64} y={492} r={190} c="#FFB25A" o={0.6}/><Lit d={ell(x + 64, 484, 22, 12)} c="#FFE2A0" cut={x + 70}/>
          <Motes f={f} n={8} seed={110 + i} box={[x - 10, 420, x + 140, 560]} c="#FFE6B0" r={[1.2, 2.4]} vx={0.6} vy={0.4} o={0.9}/>
        </g>)}
      </g>
    </g>;
  },
  Front: ({f, L}) => <g>
    <g transform={L(1)}><Motes f={f} n={18} seed={41} box={[0, 300, 1920, 900]} c="#DCE4FF" r={[1, 2.4]} vx={0.08} vy={-0.04} o={0.45}/></g>
    <g transform={L(1.3)}>{Array.from({length: 6}, (_, i) => <Lit key={i} d={ell(-60 + i * 80, 1070 - (i % 2) * 20, 90, 60)} c="#1E4A4A" cut={-60 + i * 80 + 30} rim={4}/>)}</g>
  </g>,
};

export const SETS: Record<string, SetDef> = {village: Village, hospital: Hospital, road: Road, sheds: Sheds, market: Market, train: Train, hall: Hall, regulator: Regulator};
export const SET_NAMES = Object.keys(SETS);
