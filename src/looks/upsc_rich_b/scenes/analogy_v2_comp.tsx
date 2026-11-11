// GEO-04 Part 1, builder V2: `composite`. mode "cone" (s017): a steep cone cut open, stripes of lava and ash. mode "flow" (s018): a grey pyroclastic cloud races down the flank.
import React from "react";
import {W, eo, eio, clamp, rng} from "../kit";
import {Cloud, Sun, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {V2Defs, SkyBox, Plume, Ballistic, Glow, Strata, Pine, curve, pts, under, bandPath, ease, mix, type XY} from "./analogy_v2_kit";

const CX = 960, YB = 840, HT = 500, HW = 700, RIM = 62;
const base = (x: number) => YB - HT * Math.pow(Math.max(0, 1 - Math.abs(x - CX) / HW), 1.5);
const RIMY = base(CX + RIM);
/** silhouette with a summit crater */
const prof = (x: number) => { const dx = Math.abs(x - CX); return dx < RIM ? RIMY + 46 * (1 - (dx / RIM) * (dx / RIM)) : base(x); };
const OFFS = [0, 22, 54, 76, 108, 130, 164, 188, 222, 246, 282, 306, 342, 368, 404, 430, 470, 500];
const LAVA = ["#4b3430", "#5b3d36", "#3f2c2a"], ASH = ["#dac49c", "#cdb287", "#e2cfa8"];

const Mount: React.FC<{f: number; dur: number; cut: boolean}> = ({f, dur, cut}) => {
  const K = OFFS.length - 1, gap = Math.max(8, (dur * 0.34) / K), crY = RIMY + 46;
  return (
    <g>
      <defs>
        <clipPath id="v2cp-clip"><rect x={-80} y={0} width={W + 160} height={YB + 1}/></clipPath>
        <linearGradient id="v2cp-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4d3a33"/><stop offset="1" stopColor="#2d201d"/></linearGradient>
        <linearGradient id="v2cp-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a6050"/><stop offset="1" stopColor="#2a1f1b"/></linearGradient>
      </defs>
      <path d={`M-80,${YB} L${W + 80},${YB} L${W + 80},1100 L-80,1100 Z`} fill="url(#v2cp-rock)"/>
      <Strata id="v2cp-st" x0={-80} x1={W + 80} y0={YB + 2} y1={1100} seed={8} gap={46}/>
      <rect x={-80} y={YB} width={W + 160} height={6} fill="#cfae7e" opacity={0.85}/>
      {/* deep chamber and the pipe up to the crater */}
      <Glow x={CX} y={1040} r={460} a={0.8}/>
      <ellipse cx={CX} cy={1040} rx={250} ry={90} fill="#3a1a12" opacity={0.9}/>
      <ellipse cx={CX} cy={1040} rx={220} ry={70} fill="url(#v2-lavaV)" opacity={0.9}/>
      <g clipPath="url(#v2cp-clip)">
        <path d={under(prof, CX - HW - 4, CX + HW + 4, YB, 14)} fill="url(#v2cp-core)"/>
        {Array.from({length: K}, (_, i) => K - 1 - i).map((k) => {
          const t0 = 10 + (K - 1 - k) * gap, u = eo(prog(f, t0, 22)), lava = k % 2 === 0;
          if (u <= 0.003) return null;
          const a = (x: number) => prof(x) + OFFS[k], b = (x: number) => prof(x) + OFFS[k + 1];
          return (
            <g key={k} opacity={u}>
              <path d={bandPath(a, b, CX - HW - 4, CX + HW + 4, 14)} fill={lava ? LAVA[(k >> 1) % 3] : ASH[(k >> 1) % 3]}/>
              <path d={pts(curve(a, CX - HW, CX + HW, 14))} fill="none" stroke={lava ? "#e0845a" : "#fff3d6"} strokeWidth={1.5} opacity={lava ? 0.5 : 0.6}/>
            </g>
          );
        })}
        {/* ash speckle and lava vesicles */}
        {Array.from({length: 90}, (_, i) => { const r = rng(i * 7 + 3), x = CX - HW * 0.9 + r() * HW * 1.8, kk = Math.floor(r() * 12), y = prof(x) + OFFS[kk] + 6 + r() * (OFFS[kk + 1] - OFFS[kk] - 10);
          return y < YB - 4 ? <circle key={i} cx={x} cy={y} r={1.4 + r() * 1.6} fill={kk % 2 ? "#9a8460" : "#22160f"} opacity={0.55 * eo(prog(f, 10 + (K - 1 - kk) * gap + 20, 20))}/> : null; })}
        {/* the pipe */}
        <g opacity={eo(prog(f, 10 + K * gap * 0.7, 30))}>
          <rect x={CX - 11} y={crY} width={22} height={1100 - crY} rx={7} fill="#241210"/>
          <rect x={CX - 6} y={crY} width={12} height={1100 - crY} rx={5} fill="url(#v2-lavaV)"/>
        </g>
      </g>
      {/* crater glow */}
      <Glow x={CX} y={crY - 6} r={80} a={0.55 + 0.1 * Math.sin(f / 5)}/>
      <ellipse cx={CX} cy={crY - 1} rx={26} ry={5} fill="#ff9a30" opacity={0.9}/>
      {/* pines on the lower flanks */}
      {[-1, 1].flatMap((sg) => [380, 430, 480, 530, 580, 620, 660].map((d, i) => { const x = CX + sg * d, y = prof(x) + 3;
        return <Pine key={`${sg}${i}`} x={x} y={y} s={0.55 + 0.1 * ((i * 3) % 4)} tone={(i * 5) % 14}/>; }))}
    </g>
  );
};

const Exterior: React.FC<{f: number}> = ({f}) => {
  const sg = [-0.82, -0.6, -0.4, -0.18, 0.2, 0.42, 0.62, 0.84];
  return (
    <g>
      <defs>
        <linearGradient id="v2cp-ext" gradientUnits="userSpaceOnUse" x1="0" y1={RIMY} x2="0" y2={YB}><stop offset="0" stopColor="#8d7f72"/><stop offset="0.35" stopColor="#7a7466"/><stop offset="0.7" stopColor="#6b7f4a"/><stop offset="1" stopColor="#4f7a3a"/></linearGradient>
        <linearGradient id="v2cp-shade" gradientUnits="userSpaceOnUse" x1={CX - 100} y1="0" x2={CX + 420} y2="0"><stop offset="0" stopColor="#1b2440" stopOpacity="0"/><stop offset="1" stopColor="#1b2440" stopOpacity="0.5"/></linearGradient>
        <linearGradient id="v2cp-gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6c8f48"/><stop offset="1" stopColor="#3d5a2c"/></linearGradient>
      </defs>
      <path d={under((x) => 770 - 22 * Math.sin(x / 190 + 1) - 12 * Math.sin(x / 71), -60, W + 60, YB, 20)} fill="#8fb094" opacity={0.7}/>
      <path d={`M-80,${YB - 6} L${W + 80},${YB - 6} L${W + 80},1100 L-80,1100 Z`} fill="url(#v2cp-gnd)"/>
      <path d={under(prof, CX - HW - 4, CX + HW + 4, YB, 14)} fill="url(#v2cp-ext)"/>
      <path d={under(prof, CX - 60, CX + HW + 4, YB, 14)} fill="url(#v2cp-shade)"/>
      {sg.map((j, i) => { const g: XY[] = Array.from({length: 36}, (_, k) => { const x = CX + j * HW * (k / 35); return [x, k === 0 ? RIMY + 20 : base(CX + (x - CX) / Math.abs(j))] as XY; });
        return <path key={i} d={pts(g)} fill="none" stroke={j < 0 ? "#f1dcb0" : "#232c44"} strokeWidth={2} opacity={0.3}/>; })}
      <path d={pts(curve(prof, CX - HW, CX + HW, 14))} fill="none" stroke="#f0d9a8" strokeWidth={2.2} opacity={0.5}/>
      {[-1, 1].flatMap((s) => [300, 360, 420, 480, 540, 600, 650].map((d, i) => { const x = CX + s * d; return <Pine key={`${s}${i}`} x={x} y={prof(x) + 3} s={0.6 + 0.12 * ((i * 3) % 4)} tone={(i * 5) % 14}/>; }))}
      <Glow x={CX} y={RIMY + 36} r={60} a={0.4}/>
    </g>
  );
};

export const CompositeArt: React.FC<AP> = ({f, dur, spec}) => {
  const flow = (spec as any).mode === "flow";
  const sky = (
    <>
      <SkyBox id="v2cp" top="#5e9fd2" mid="#b6d8e6" bot="#f7e8c8" y1={YB}/>
      <Sun x={flow ? 1500 : 1480} y={flow ? 190 : 220} r={46} f={f} glow={0.8}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={60 + i * 640} y={160 + (i % 2) * 130} s={0.95 - i * 0.1} f={f} speed={0.16} seed={i + 21} a={0.8}/>)}
    </>
  );
  if (!flow) {
    return (
      <g>
        <V2Defs/>{sky}
        <Mount f={f} dur={dur} cut/>
        <Plume x={CX} y={RIMY + 36} f={f} n={14} rise={190} drift={110} r0={20} r1={60} kind="D" period={120} a={0.8} seed={4} sway={9}/>
      </g>
    );
  }
  // flow: the cloud front runs down the right flank on a repeating surge
  const C = 150, t = Math.max(0, f - 24), cyc = (t % C) / C, front = eo(clamp(cyc / 0.62)) * (f > 24 ? 1 : 0), fade = 1 - clamp((cyc - 0.8) / 0.2);
  const S = 14, path = (s: number): XY => { const x = CX + RIM + s * 640; return [x, prof(x)]; };
  const puffs = Array.from({length: 74}, (_, i) => { const r = rng(i * 13 + 5); return {i, a: r(), b: r(), c: r(), ph: r() * 6.28}; })
    .map((q) => ({...q, sp: front - q.a * 0.36 * (0.35 + 0.65 * front)})).filter((q) => q.sp > 0).sort((p, q) => p.sp - q.sp);
  const at = (q: {sp: number; a: number; b: number; c: number}, k: number) => { const [x, y] = path(Math.min(1, q.sp)), r = (38 + 88 * q.sp + q.c * 34) * (0.8 + 0.4 * (1 - q.a)) * k; return {x, y, r}; };
  return (
    <g>
      <V2Defs/>{sky}
      <Exterior f={f}/>
      <Plume x={CX} y={RIMY + 30} f={f} n={16} rise={330} drift={-100} r0={26} r1={90} kind="D" period={110} a={0.95} seed={6} sway={14}/>
      <Ballistic x={CX} y={RIMY + 28} f={f} n={8} vx={14} vy={24} period={58} seed={9} r={6}/>
      {/* the pyroclastic cloud: ground-hugging, grey, billowing */}
      <g opacity={fade}>
        {puffs.filter((q) => q.b < 0.6).map((q) => { const {x, y, r} = at(q, 0.9); return <circle key={`d${q.i}`} cx={x + (q.c - 0.5) * 30} cy={y - r * 0.4} r={r} fill="url(#v2-puffD)" opacity={0.7}/>; })}
        {puffs.map((q) => { const {x, y, r} = at(q, 1), bob = Math.sin(f / 6 + q.ph) * 4; return <circle key={`g${q.i}`} cx={x + (q.c - 0.5) * 40} cy={y - r * (0.5 + q.b * 0.85) + bob} r={r} fill="url(#v2-puffG)" opacity={0.92}/>; })}
        {puffs.filter((q) => q.i % 3 === 0).map((q) => { const {x, y, r} = at(q, 1.15); return <circle key={`t${q.i}`} cx={x} cy={y - r * 1.5 - 20 * q.b} r={r * 0.9} fill="url(#v2-puffG)" opacity={0.4}/>; })}
        {puffs.filter((q) => q.i % 5 === 0).map((q) => { const [x, y] = path(Math.min(1, q.sp)); return <circle key={`e${q.i}`} cx={x + (q.c - 0.5) * 60} cy={y - 10 - q.b * 30} r={3.2} fill="#ff9a30" opacity={0.5 + 0.4 * Math.sin(f / 3 + q.ph)}/>; })}
      </g>
    </g>
  );
};

export const CompositeLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), flow = (p.spec as any).mode === "flow";
  if (flow) return (
    <>
      {L[0] && <P2Card cx={470} y={84} text={L[0].text} f={p.f} at={L[0].at} size={38} maxW={780}/>}
      {L[1] && <P2Card cx={1500} y={420} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={540} upper={false}/>}
    </>
  );
  return (
    <>
      {L[1] && <P2Card cx={960} y={72} text={L[1].text} f={p.f} at={L[1].at} size={42} maxW={1200}/>}
      {L[0] && <P2Card cx={400} y={420} text={L[0].text} f={p.f} at={L[0].at} size={36} maxW={440} upper={false}/>}
      {L[2] && <P2Card cx={1540} y={420} text={L[2].text} f={p.f} at={L[2].at} size={34} maxW={520} upper={false}/>}
    </>
  );
};
