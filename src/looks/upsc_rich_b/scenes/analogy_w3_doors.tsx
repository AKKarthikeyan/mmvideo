// POL-03 Part 2, builder W3: `six-doors`. mode "open": six doors in a hall open one by one (speech, assembly, association, movement, residence, profession);
// mode "gates": all six stand open and each gets a small barrier gate with a sign for its limits. Motion follows f and at(key) only.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {Cloud, Hills, Sun, Tree, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Adult, Awning, E1Defs, type Look} from "./analogy_e1_kit";
import {W3Defs} from "./analogy_w3_kit";

const DW = 210, DH = 470, BY = 790, XS = [0, 1, 2, 3, 4, 5].map((i) => 960 + (i - 2.5) * 290);
const KEYS = ["d1", "d2", "d3", "d4", "d5", "d6"];
const LA: Look = {kind: "kurta", shirt: ["#e8dcc4", "#b8a888"], pants: "#efe6cf", hair: "#241812", skin: 1, stache: true};
const LB: Look = {kind: "plain", female: true, shirt: ["#6c8fb5", "#41607f"], pants: "#3a3f52", hair: "#1a120d", skin: 3};
const LC: Look = {kind: "plain", shirt: ["#c0603d", "#8c3a22"], pants: "#3d4658", hair: "#2b1d14", skin: 2};
const LD: Look = {kind: "saree", shirt: ["#9a6fa0", "#6a4472"], pants: "#3a3f52", hair: "#1a120d", skin: 0};
const LE: Look = {kind: "apron", shirt: ["#7fa58a", "#4d7358"], pants: "#5a4a3a", hair: "#3a2a1c", skin: 3, stache: true};

/** the picture inside each doorway; local origin = floor centre, the opening spans x -105..105, y -470..0 */
const Inside: React.FC<{i: number; f: number; t: number}> = ({i, f, t}) => {
  const sky = <rect x={-110} y={-476} width={220} height={480} fill="url(#w3-day)"/>;
  if (i === 0) return (
    <g>
      <rect x={-110} y={-476} width={220} height={480} fill="#e9d2a4"/><rect x={-110} y={-476} width={220} height={200} fill="#cfb27c" opacity={0.5}/>
      <path d="M-60,0 L-52,-150 L52,-150 L60,0 Z" fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={2}/>
      <Adult x={0} y={0} h={330} f={f} seed={31} look={LA} arms={{R: [58 + Math.sin(f / 9) * 6, 70], L: [14, 18]}} hands={{R: "open"}} talk smile={0.6}/>
      <rect x={-30} y={-168} width={60} height={20} rx={4} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={1.6} opacity={0}/>
      <path d="M-54,-176 L-46,-146 L46,-146 L54,-176 Z" fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={2}/>
      <path d="M-4,-176 V-210 M-4,-210 q6,0 6,8" stroke="#3a3e48" strokeWidth={3} fill="none"/><circle cx={-2} cy={-214} r={7} fill="#2a2d34"/>
      {[0, 1, 2].map((k) => { const u = ((f * 0.02 + k / 3) % 1); return <path key={k} d={`M${62 + u * 34},${-250 - k * 10} q10,${14 + k * 4} 0,${28}`} fill="none" stroke="#c8582a" strokeWidth={5 - k} strokeLinecap="round" opacity={1 - u}/>; })}
    </g>
  );
  if (i === 1) return (
    <g>
      {sky}<Hills id="w3d2h" base={-170} amp={30} top="#9cc0a0" bottom="#c5d8a8" seed={2} wl={200} bottomY={4}/>
      <rect x={-110} y={-120} width={220} height={124} fill="#d7c38e"/>
      <Tree x={-82} y={-110} s={0.4} f={f} seed={2}/><Tree x={90} y={-112} s={0.36} f={f} seed={7}/>
      {[[-62, LB, 2], [-20, LA, 3], [24, LC, 4], [66, LD, 5]].map(([x, lk, sd]: any, k) => <Adult key={k} x={x} y={-4 + (k % 2) * 6} h={200 - (k % 2) * 10} f={f} seed={sd} look={lk} arms={{L: [30, 46], R: [30, 46]}} hands={{L: "open", R: "open"}} smile={0.6}/>)}
    </g>
  );
  if (i === 2) return (
    <g>
      <rect x={-110} y={-476} width={220} height={480} fill="#d9c49a"/><rect x={-110} y={-476} width={220} height={130} fill="#c1a878" opacity={0.6}/>
      <rect x={-52} y={-300} width={104} height={64} rx={4} fill="#f7f1e0" stroke="#8a6a38" strokeWidth={2}/>
      {[0, 1, 2].map((k) => <rect key={k} x={-40} y={-288 + k * 16} width={80 - k * 12} height={5} rx={2} fill="#9aa0ab"/>)}
      {[[-74, LB, 6], [-26, LC, 7], [26, LA, 8], [74, LD, 9]].map(([x, lk, sd]: any, k) => <Adult key={k} x={x} y={-70} h={190} f={f} seed={sd} look={lk} arms={{L: [10, 20], R: [k % 2 ? 50 : 10, k % 2 ? 80 : 20]}} hands={{R: "open"}} smile={0.5}/>)}
      <rect x={-104} y={-96} width={208} height={30} rx={5} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={2}/><rect x={-96} y={-66} width={14} height={66} fill="url(#w3-woodd)"/><rect x={82} y={-66} width={14} height={66} fill="url(#w3-woodd)"/>
      <path d="M-30,-98 L30,-98" stroke="#f2d49a" strokeWidth={4} opacity={0.5}/>
    </g>
  );
  if (i === 3) {
    const u = (f * 0.012) % 1;
    return (
      <g>
        {sky}<Hills id="w3d4h" base={-170} amp={28} top="#b6cde0" bottom="#d6e0d8" seed={3} wl={180} bottomY={4}/>
        <rect x={-110} y={-70} width={220} height={74} fill="#cbb88c"/><rect x={-110} y={-76} width={220} height={7} fill="#6a6f7a"/>
        {Array.from({length: 9}, (_, k) => <rect key={k} x={-120 + ((k * 28 - f * 3) % 252 + 252) % 252 - 20} y={-62} width={10} height={12} fill="#6e4a2a"/>)}
        <g transform={`translate(${14 + Math.sin(f / 30) * 4} -70)`}>
          <rect x={-90} y={-92} width={92} height={78} rx={6} fill="#2f78b8" stroke="#173a5c" strokeWidth={2}/><rect x={-84} y={-86} width={80} height={16} fill="#f6d27a" opacity={0.9}/>
          {[-80, -56, -32].map((x) => <rect key={x} x={x} y={-64} width={18} height={20} rx={2} fill="#bfe0ee" stroke="#173a5c" strokeWidth={1.4}/>)}
          <rect x={2} y={-84} width={56} height={70} rx={4} fill="#b23a48" stroke="#5a1c28" strokeWidth={2}/><rect x={14} y={-110} width={22} height={28} fill="#3a3e48"/>
          <rect x={6} y={-64} width={20} height={24} fill="#bfe0ee"/>
          {[-70, -44, 14, 40].map((x) => <circle key={x} cx={x} cy={-12} r={10} fill="#2a2d34" stroke="#8a8f99" strokeWidth={2}/>)}
          {[0, 1, 2].map((k) => { const s = ((f * 0.03 + k / 3) % 1); return <circle key={k} cx={25 - s * 70} cy={-120 - s * 60} r={10 + s * 22} fill="#f3f3f0" opacity={0.7 * (1 - s)}/>; })}
        </g>
      </g>
    );
  }
  if (i === 4) return (
    <g>
      {sky}<Sun x={60} y={-380} r={22} f={f} glow={0.8}/>
      <Hills id="w3d5h" base={-130} amp={26} top="#9cc0a0" bottom="#c5d8a8" seed={5} wl={170} bottomY={4}/>
      <rect x={-110} y={-70} width={220} height={74} fill="#c7d9a2"/>
      <path d="M-80,-70 L-80,-170 L0,-232 L80,-170 L80,-70 Z" fill="#e8cf9a" stroke="#8a6a38" strokeWidth={2.4}/>
      <path d="M-96,-166 L0,-248 L96,-166 L84,-158 L0,-228 L-84,-158 Z" fill="#b2503a" stroke="#6a2a1c" strokeWidth={2.4}/>
      <rect x={-18} y={-132} width={36} height={62} rx={3} fill="#7a4a26" stroke="#4e2f18" strokeWidth={2}/><circle cx={10} cy={-100} r={3} fill="#f6dd8a"/>
      <rect x={-64} y={-142} width={30} height={30} rx={2} fill="#bfe0ee" stroke="#6a4a2a" strokeWidth={2}/><rect x={34} y={-142} width={30} height={30} rx={2} fill="#f6e0a0" stroke="#6a4a2a" strokeWidth={2}/>
      <g transform="translate(-70 -66)"><rect x={-20} y={-30} width={40} height={30} fill="#c9a06a" stroke="#6a4a2a" strokeWidth={2}/><path d="M-20,-18 H20" stroke="#6a4a2a" strokeWidth={2}/></g>
      <g transform={`translate(70 ${-90 + Math.sin(f / 12) * 2}) rotate(20)`}><circle r={9} fill="none" stroke="url(#w3-brass)" strokeWidth={4}/><path d="M8,6 L28,22 M20,16 l6,-6 M26,21 l6,-6" stroke="#c99a3a" strokeWidth={4} strokeLinecap="round"/></g>
    </g>
  );
  return (
    <g>
      <rect x={-110} y={-476} width={220} height={480} fill="#efe2c0"/><rect x={-110} y={-476} width={220} height={180} fill="#d9c8a0" opacity={0.6}/>
      <Awning x={-104} y={-330} w={208} h={44} c1="#c8402a" c2="#f4e6c4" n={6} pole={false} f={f}/>
      <rect x={-104} y={-110} width={208} height={110} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={2}/>
      {[[-62, "#e8a02a"], [-24, "#c8402a"], [14, "#8fb55a"], [52, "#e8a02a"]].map(([x, c]: any, k) => <g key={k}><ellipse cx={x} cy={-116} rx={17} ry={7} fill="#6a4a2a"/><path d={`M${x - 17},-116 Q${x},${-150 - (k % 2) * 6} ${x + 17},-116 Z`} fill={c} stroke="#00000030" strokeWidth={1.4}/></g>)}
      <Adult x={0} y={-108} h={250} f={f} seed={41} look={LE} arms={{L: [10, 18], R: [26, 30]}} hands={{R: "open"}} smile={0.7}/>
      <rect x={-104} y={-112} width={208} height={8} fill="#f2d49a" opacity={0.5}/>
      <g transform="translate(60 -134)"><path d="M-16,0 H16 M0,0 V-26 M-16,0 L-20,12 H-12 Z M16,0 L12,12 H20 Z" stroke="#7a5414" strokeWidth={3} fill="#c99a3a"/></g>
    </g>
  );
};

const Door: React.FC<{i: number; open: number; f: number; t: number; glow?: number}> = ({i, open, f, t, glow = 0}) => {
  const c = 1 - 0.76 * open, hx = -DW / 2;
  return (
    <g transform={`translate(${XS[i]} ${BY})`}>
      {glow > 0.01 && <ellipse cx={0} cy={-DH / 2} rx={DW * 1.05} ry={DH * 0.7} fill="url(#w3-glow)" opacity={glow}/>}
      <ellipse cx={0} cy={6} rx={DW * 0.62} ry={10} fill="#1a0e04" opacity={0.3}/>
      <clipPath id={`w3dc${i}`}><rect x={-DW / 2} y={-DH} width={DW} height={DH}/></clipPath>
      <rect x={-DW / 2 - 6} y={-DH} width={DW + 12} height={DH} fill="#2a1a0c"/>
      {open > 0.02 && <g clipPath={`url(#w3dc${i})`}><Inside i={i} f={f} t={t}/><rect x={-DW / 2} y={-DH} width={DW} height={DH} fill="url(#w3-beam)" opacity={0.18 * open}/></g>}
      {/* the leaf, hinged on the left */}
      <g transform={`translate(${hx} 0) scale(${c} 1)`}>
        <rect x={0} y={-DH} width={DW} height={DH} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={3}/>
        <rect x={16} y={-DH + 20} width={DW - 32} height={DH * 0.38} rx={4} fill="none" stroke="#4e2f18" strokeWidth={3} opacity={0.7}/>
        <rect x={16} y={-DH * 0.5} width={DW - 32} height={DH * 0.44} rx={4} fill="none" stroke="#4e2f18" strokeWidth={3} opacity={0.7}/>
        <rect x={20} y={-DH + 24} width={DW - 40} height={6} fill="#f2d49a" opacity={0.35}/>
        <circle cx={DW - 24} cy={-DH * 0.48} r={9} fill="url(#w3-brass)" stroke="#5a3c0c" strokeWidth={2}/>
        {[-DH + 60, -60].map((y) => <rect key={y} x={-3} y={y} width={12} height={26} rx={3} fill="url(#w3-brass)"/>)}
      </g>
      <rect x={-DW / 2 - 18} y={-DH - 22} width={DW + 36} height={26} rx={4} fill="url(#w3-woodd)" stroke="#2a1a0c" strokeWidth={2}/>
      <rect x={-DW / 2 - 18} y={-DH - 22} width={20} height={DH + 22} fill="url(#w3-woodd)" stroke="#2a1a0c" strokeWidth={2}/>
      <rect x={DW / 2 - 2} y={-DH - 22} width={20} height={DH + 22} fill="url(#w3-woodd)" stroke="#2a1a0c" strokeWidth={2}/>
    </g>
  );
};

/** a small barrier gate across a doorway with a sign plaque; u 0..1 lowers the arm */
const Gate: React.FC<{i: number; u: number; glow: number; f: number}> = ({i, u, glow, f}) => {
  if (u <= 0.01) return null;
  const x = XS[i], ang = -62 * (1 - u), lift = 12 * (1 - u);
  return (
    <g transform={`translate(${x} ${BY})`} opacity={clamp(u * 4)}>
      {glow > 0.01 && <ellipse cx={0} cy={-90} rx={150} ry={110} fill="url(#w3-glow)" opacity={glow * 0.9}/>}
      <rect x={-DW / 2 - 40} y={-120} width={26} height={120} rx={4} fill="#d8d2c4" stroke="#6a6558" strokeWidth={2}/><rect x={-DW / 2 - 40} y={-120} width={26} height={16} fill="#c8402a"/>
      <rect x={DW / 2 + 14} y={-120} width={26} height={120} rx={4} fill="#d8d2c4" stroke="#6a6558" strokeWidth={2}/><rect x={DW / 2 + 14} y={-120} width={26} height={16} fill="#c8402a"/>
      <g transform={`translate(${-DW / 2 - 27} ${-100 - lift}) rotate(${ang})`}>
        <rect x={0} y={-9} width={DW + 54} height={18} rx={4} fill="#f4eee0" stroke="#6a6558" strokeWidth={2}/>
        {Array.from({length: 6}, (_, k) => <path key={k} d={`M${22 + k * 36},-9 L${40 + k * 36},-9 L${24 + k * 36},9 L${6 + k * 36},9 Z`} fill="#c8402a"/>)}
      </g>
      <g transform={`translate(0 ${-DH - 50})`}>
        <path d="M-70,0 V30 M70,0 V30" stroke="#6a6558" strokeWidth={3}/>
        <rect x={-92} y={-8} width={184} height={46} rx={8} fill="#fffaf0" stroke="#c8402a" strokeWidth={3.4}/>
        <path d="M-60,16 H60" stroke="#c8402a" strokeWidth={4} strokeLinecap="round" strokeDasharray="14 9"/>
        <path d="M-72,6 v20 M72,6 v20" stroke="#c8402a" strokeWidth={5} strokeLinecap="round"/>
      </g>
    </g>
  );
};

export const DoorsArt: React.FC<AP> = (p) => {
  const {f, dur} = p, gates = (p.spec as any).mode === "gates", t = clamp(f / Math.max(1, dur));
  const ats = KEYS.map((k) => { try { return p.at(k); } catch { return 1e9; } });
  const rr = gates ? p.at("rr") : 0, sp = gates ? p.at("sp") : 1e9, mv = gates ? p.at("mv") : 1e9;
  const pulse = (a: number) => (f > a ? 0.5 + 0.5 * Math.sin((f - a) / 8) : 0) * eo(prog(f, a, 10)) * (1 - eo(prog(f, a + 150, 40)));
  return (
    <g>
      <W3Defs/><E1Defs/>
      <defs><linearGradient id="w3-hallw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe2c4"/><stop offset="1" stopColor="#d8c294"/></linearGradient></defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w3-hallw)"/>
      {/* hall: pilasters, cornice, dado and a stone floor in perspective */}
      <rect x={-60} y={150} width={W + 120} height={26} fill="#c8b07c" opacity={0.7}/><rect x={-60} y={150} width={W + 120} height={6} fill="#fff" opacity={0.3}/>
      {Array.from({length: 7}, (_, i) => <g key={i}><rect x={-40 + i * 290 - 14 + 145 * 0} y={176} width={20} height={640} fill="#000" opacity={0.0}/></g>)}
      <rect x={-60} y={BY - 220} width={W + 120} height={230} fill="#c9ae78" opacity={0.28}/>
      <rect x={-60} y={BY - 18} width={W + 120} height={26} fill="#a98a52"/><rect x={-60} y={BY - 18} width={W + 120} height={5} fill="#f6e2b0" opacity={0.6}/>
      <path d={`M-60,${BY + 8} L${W + 60},${BY + 8} L${W + 60},${H + 60} L-60,${H + 60} Z`} fill="#b69b6a"/>
      {Array.from({length: 17}, (_, i) => <path key={i} d={`M${960 + (i - 8) * 90},${BY + 8} L${960 + (i - 8) * 260},${H + 60}`} stroke="#8e7448" strokeWidth={2} opacity={0.6}/>)}
      {[0.25, 0.6, 1].map((u, i) => <path key={i} d={`M-60,${BY + 8 + u * u * 280} L${W + 60},${BY + 8 + u * u * 280}`} stroke="#8e7448" strokeWidth={2} opacity={0.6}/>)}
      <path d={`M-60,${BY + 8} L${W + 60},${BY + 8} L${W + 60},${BY + 170} L-60,${BY + 170} Z`} fill="url(#w3-beam)" opacity={0.14}/>
      {XS.map((x, i) => {
        const open = gates ? eo(prog(f, 0, 20)) : eio(prog(f, ats[i] - 6, 46));
        const g = gates ? eo(prog(f, rr + 8 + i * 16, 36)) : 0;
        const glow = gates ? (i === 0 ? pulse(sp) : i === 3 ? pulse(mv) : 0) : 0;
        return <g key={i}><Door i={i} open={open} f={f} t={t} glow={glow}/>{gates && <Gate i={i} u={g} glow={glow} f={f}/>}</g>;
      })}
    </g>
  );
};

export const DoorsLabels: React.FC<AP> = (p) => {
  const gates = (p.spec as any).mode === "gates", L = rlabs(p);
  if (!gates) return (
    <>
      {L[0] && <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={42} maxW={1500}/>}
      {XS.map((x, i) => L[i + 1] ? <P2Card key={i} cx={x} y={810} text={L[i + 1].text} f={p.f} at={L[i + 1].at} size={22} maxW={270}/> : null)}
    </>
  );
  return (
    <>
      {L[0] && <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={44} maxW={1500}/>}
      {L[1] && <P2Card cx={560} y={800} text={L[1].text} f={p.f} at={L[1].at} size={26} maxW={800} upper={false}/>}
      {L[2] && <P2Card cx={1500} y={800} text={L[2].text} f={p.f} at={L[2].at} size={26} maxW={620} upper={false}/>}
    </>
  );
};
