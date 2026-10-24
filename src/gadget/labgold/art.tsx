// Rich, moving art for No. 003 "Lab-Made Gold" (Now episode, 23 Oct 2026). Same look as 001/002: everything drawn in code,
// everything keeps moving (flames, smoke, sparkles, wobbling nuclei). Page coordinates, 1080 x 1920, inside the Safe box.
import React from "react";
import {C, Draw, HEAD, MONO, W, interpolateColor} from "../kit";

export const GOLD = "#E5B23A", GOLD_D = "#A97A16", GOLD_L = "#F8DE8C", SILVER = "#C3C9D0", SILVER_D = "#7E8792";
const PROTON = "#E8563A", NEUTRON = "#A2A7AE", FIRE = "#F2A03D", FIRE2 = "#E8563A";
const Page: React.FC<{o?: number; children: React.ReactNode}> = ({o = 1, children}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o, overflow: "visible"}}>{children}</svg>
);
const Sparkle: React.FC<{x: number; y: number; t: number; s?: number; c?: string}> = ({x, y, t, s = 1, c = "#fff"}) => {
  const k = (Math.sin(t * 5 + x * 0.7) + 1) / 2;
  return <path d={`M ${x} ${y - 18 * s * k} L ${x + 4 * s} ${y} L ${x} ${y + 18 * s * k} L ${x - 4 * s} ${y} Z M ${x - 18 * s * k} ${y} L ${x} ${y + 4 * s} L ${x + 18 * s * k} ${y} L ${x} ${y - 4 * s} Z`} fill={c} opacity={0.35 + 0.65 * k}/>;
};
/** radiation trefoil */
const Trefoil: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <circle r={r} fill="#F6D24A" stroke={C.ink} strokeWidth={4}/>
    {[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d={`M 0 0 L ${-r * 0.42} ${-r * 0.78} A ${r * 0.9} ${r * 0.9} 0 0 1 ${r * 0.42} ${-r * 0.78} Z`} fill={C.ink}/>)}
    <circle r={r * 0.2} fill="#F6D24A" stroke={C.ink} strokeWidth={3}/>
  </g>
);

/** a nucleus: n balls packed in a disc, protons red, neutrons grey; `tint` 0..1 washes it gold; wobble shakes it */
export const Nucleus: React.FC<{cx: number; cy: number; r: number; protons?: number; n?: number; tint?: number; wobble?: number; t: number; seed?: number}> = ({cx, cy, r, protons = 0.45, n = 34, tint = 0, wobble = 0, t, seed = 1}) => {
  const balls = Array.from({length: n}, (_, k) => {
    const a = k * 2.39996 + seed, d = Math.sqrt((k + 0.5) / n) * r * 0.82;
    return {x: Math.cos(a) * d, y: Math.sin(a) * d, p: Math.sin(k * 12.9898 + seed) * 0.5 + 0.5 < protons};
  });
  const wx = Math.sin(t * 31) * 6 * wobble, wy = Math.cos(t * 27) * 6 * wobble;
  return (
    <g transform={`translate(${cx + wx},${cy + wy})`}>
      <circle r={r * 1.12} fill={GOLD_L} opacity={0.5 * tint}/>
      {balls.map((b, k) => (
        <circle key={k} cx={b.x} cy={b.y} r={r * 0.2} fill={interpolateColor(tint, b.p ? PROTON : NEUTRON, b.p ? GOLD : GOLD_D)} stroke={C.ink} strokeWidth={3}/>
      ))}
      {tint > 0.6 && [0, 1, 2].map((k) => <Sparkle key={k} x={Math.cos(k * 2.1 + t) * r} y={Math.sin(k * 2.1 + t) * r} t={t + k} s={1.1}/>)}
    </g>
  );
};

/** b01: an old thermometer; a bead of mercury rolls out of the bulb and turns to gold */
export const ThermoBead: React.FC<{p: number; roll: number; gold: number; t: number; o?: number}> = ({p, roll, gold, t, o = 1}) => {
  const bx = 330 + 360 * roll, by = 1330 - 20 * Math.sin(roll * Math.PI), col = interpolateColor(gold, SILVER, GOLD);
  return (
    <Page o={o * p}>
      <g transform="translate(250,1180) rotate(-28)">
        <rect x={0} y={-34} width={620} height={68} rx={34} fill="#F7FAFC" stroke={C.ink} strokeWidth={6}/>
        <rect x={20} y={-10} width={380 * (1 - 0.25 * roll)} height={20} rx={10} fill={SILVER} stroke={SILVER_D} strokeWidth={3}/>
        {Array.from({length: 11}).map((_, k) => <line key={k} x1={120 + k * 44} y1={-34} x2={120 + k * 44} y2={k % 2 ? -18 : -8} stroke={C.ink2} strokeWidth={3}/>)}
        <circle cx={-10} cy={0} r={62} fill={SILVER} stroke={C.ink} strokeWidth={6}/>
        <ellipse cx={-26} cy={-18} rx={16} ry={10} fill="#fff" opacity={0.8}/>
      </g>
      <ellipse cx={bx} cy={by + 64} rx={70} ry={12} fill="#000" opacity={0.12}/>
      <circle cx={bx} cy={by} r={60} fill={col} stroke={interpolateColor(gold, SILVER_D, GOLD_D)} strokeWidth={6}/>
      <ellipse cx={bx - 20} cy={by - 22} rx={20} ry={12} fill="#fff" opacity={0.75}/>
      {gold > 0.4 && [0, 1, 2, 3].map((k) => <Sparkle key={k} x={bx + Math.cos(k * 1.6 + t) * 100} y={by + Math.sin(k * 1.6 + t) * 80} t={t + k} s={1.4} c={GOLD}/>)}
      <text x={180} y={1500} fontFamily={MONO} fontSize={28} letterSpacing={3} fill={C.ink2}>HG · MERCURY</text>
      <text x={900} y={1500} textAnchor="end" fontFamily={MONO} fontSize={28} letterSpacing={3} fill={gold > 0.5 ? GOLD_D : C.line}>AU · GOLD</text>
    </Page>
  );
};

/** b02: an alchemist's furnace, flickering fire, a bubbling flask and smoke drifting up */
export const Furnace: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    {Array.from({length: 5}).map((_, k) => { const ph = (t * 0.35 + k / 5) % 1; return <circle key={k} cx={560 + Math.sin(t + k) * 40 + ph * 60} cy={900 - ph * 330} r={30 + ph * 60} fill={C.ink2} opacity={0.12 * (1 - ph)}/>; })}
    <clipPath id="lgFurn"><path d="M 330 1500 L 330 1180 Q 330 1080 430 1080 L 650 1080 Q 750 1080 750 1180 L 750 1500 Z"/></clipPath>
    <path d="M 330 1500 L 330 1180 Q 330 1080 430 1080 L 650 1080 Q 750 1080 750 1180 L 750 1500 Z" fill="#C9734A"/>
    <g clipPath="url(#lgFurn)">{Array.from({length: 7}).map((_, r) => Array.from({length: 5}).map((__, c) => <rect key={`${r}${c}`} x={290 + c * 100 + (r % 2) * 50} y={1090 + r * 64} width={90} height={56} rx={6} fill="none" stroke="#9E5232" strokeWidth={3}/>))}</g>
    <path d="M 330 1500 L 330 1180 Q 330 1080 430 1080 L 650 1080 Q 750 1080 750 1180 L 750 1500 Z" fill="none" stroke={C.ink} strokeWidth={7}/>
    <path d="M 450 1500 L 450 1360 Q 540 1290 630 1360 L 630 1500 Z" fill={C.night}/>
    {[0, 1, 2].map((k) => { const h = 80 + 30 * Math.sin(t * 9 + k * 2); return <path key={k} d={`M ${480 + k * 40} 1500 Q ${470 + k * 40} ${1500 - h * 0.6} ${490 + k * 40} ${1500 - h} Q ${510 + k * 40} ${1500 - h * 0.6} ${500 + k * 40} 1500 Z`} fill={k === 1 ? FIRE : FIRE2}/>; })}
    <path d="M 500 1080 L 500 960 Q 440 940 440 880 Q 440 800 540 800 Q 640 800 640 880 Q 640 940 580 960 L 580 1080 Z" fill="#EAF4F7" stroke={C.ink} strokeWidth={6}/>
    <path d="M 452 900 Q 540 930 628 900 Q 640 940 580 962 L 500 962 Q 446 940 452 900 Z" fill={SILVER}/>
    {[0, 1, 2, 3].map((k) => { const ph = (t * 0.9 + k * 0.25) % 1; return <circle key={k} cx={500 + k * 26} cy={940 - ph * 150} r={8 + 4 * ph} fill="none" stroke={SILVER_D} strokeWidth={3} opacity={1 - ph}/>; })}
    <text x={230} y={1000} fontFamily={HEAD} fontSize={92} fill={GOLD} opacity={0.5 + 0.3 * Math.sin(t * 2)}>☉</text>
    <text x={790} y={930} fontFamily={HEAD} fontSize={92} fill={SILVER_D} opacity={0.5 + 0.3 * Math.sin(t * 2 + 1)}>☿</text>
  </Page>
);

/** b03: every bit of gold ever mined as one cube, next to a seven-storey building and a person */
export const GoldCube: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const s = 540, x = 430, y = 1500 - s * p;
  return (
    <Page o={o}>
      <line x1={60} y1={1500} x2={1020} y2={1500} stroke={C.ink} strokeWidth={6}/>
      <g opacity={Math.min(1, p * 2)}>
        <rect x={110} y={960} width={250} height={540} fill={C.paper2} stroke={C.ink} strokeWidth={6}/>
        {Array.from({length: 7}).map((_, r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={135 + c * 76} y={985 + r * 74} width={50} height={46} fill={C.white} stroke={C.ink2} strokeWidth={3}/>))}
        <text x={235} y={940} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink2}>7 STOREYS</text>
      </g>
      <g transform={`translate(${x},${y})`}>
        <path d={`M 0 0 L ${s} 0 L ${s} ${s * p} L 0 ${s * p} Z`} fill={GOLD} stroke={GOLD_D} strokeWidth={6}/>
        <path d={`M 0 0 L 70 -60 L ${s + 70} -60 L ${s} 0 Z`} fill={GOLD_L} stroke={GOLD_D} strokeWidth={6} opacity={p}/>
        <path d={`M ${s} 0 L ${s + 70} -60 L ${s + 70} ${s * p - 60} L ${s} ${s * p} Z`} fill={GOLD_D} stroke={GOLD_D} strokeWidth={6} opacity={p}/>
        <Sparkle x={90} y={60} t={t} s={1.6}/><Sparkle x={s - 80} y={s * 0.6} t={t + 2} s={1.3}/>
      </g>
      <g opacity={Math.max(0, p * 2 - 1)}>
        <line x1={x + 40} y1={y + 70} x2={x + s - 40} y2={y + 70} stroke={GOLD_D} strokeWidth={5}/>
        <path d={`M ${x + 40} ${y + 56} L ${x + 40} ${y + 84} M ${x + s - 40} ${y + 56} L ${x + s - 40} ${y + 84}`} stroke={GOLD_D} strokeWidth={5}/>
        <text x={x + s / 2} y={y + 300} textAnchor="middle" fontFamily={HEAD} fontSize={120} fill={C.white}>22 m</text>
        <text x={x + s / 2} y={y + 360} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={GOLD_D}>ON EACH SIDE</text>
      </g>
      <g transform="translate(395,1500)"><circle cy={-52} r={9} fill={C.ink}/><line y1={-42} y2={-14} stroke={C.ink} strokeWidth={5}/><line y1={-14} y2={0} x2={-7} stroke={C.ink} strokeWidth={5}/><line y1={-14} y2={0} x2={7} stroke={C.ink} strokeWidth={5}/></g>
    </Page>
  );
};

/** b04 / b16: Newton's desk by candlelight: flasks, quill, a stack of manuscript pages that grows */
export const NewtonDesk: React.FC<{p: number; pages: number; t: number; o?: number}> = ({p, pages, t, o = 1}) => {
  const f = 1 + 0.12 * Math.sin(t * 11) + 0.06 * Math.sin(t * 23);
  return (
    <Page o={o * p}>
      <circle cx={300} cy={1010} r={170 * f} fill="#FCE7B0" opacity={0.35}/>
      <rect x={90} y={1300} width={900} height={36} rx={8} fill="#8A5A3C" stroke={C.ink} strokeWidth={6}/>
      <rect x={130} y={1336} width={30} height={170} fill="#6E4630"/><rect x={920} y={1336} width={30} height={170} fill="#6E4630"/>
      <rect x={282} y={1130} width={36} height={170} rx={6} fill="#FBF6EC" stroke={C.ink} strokeWidth={5}/>
      <path d={`M 300 ${1130 - 70 * f} Q 274 1100 300 1126 Q 326 1100 300 ${1130 - 70 * f} Z`} fill={FIRE}/>
      <path d={`M 300 ${1130 - 40 * f} Q 290 1112 300 1126 Q 310 1112 300 ${1130 - 40 * f} Z`} fill="#FFF3C4"/>
      {Array.from({length: Math.round(18 * pages)}).map((_, k) => <rect key={k} x={420 + (k % 3) * 3} y={1290 - k * 9} width={220} height={8} fill={k % 2 ? "#FBF6EC" : "#F1E8D6"} stroke={C.ink2} strokeWidth={2}/>)}
      <path d="M 700 1290 L 700 1200 Q 660 1190 660 1150 Q 660 1100 720 1100 Q 780 1100 780 1150 Q 780 1190 740 1200 L 740 1290 Z" fill="#EAF4F7" stroke={C.ink} strokeWidth={5}/>
      <path d="M 664 1160 Q 720 1180 776 1160 Q 778 1192 740 1204 L 700 1204 Q 664 1192 664 1160 Z" fill={SILVER}/>
      <path d="M 820 1290 L 820 1230 L 850 1180 L 880 1230 L 880 1290 Z" fill="#E7D9F2" stroke={C.ink} strokeWidth={5}/>
    </Page>
  );
};

/** b05: two metals stirred in a pot stay two metals */
export const MixPot: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    <path d="M 260 1100 L 820 1100 L 780 1440 Q 540 1500 300 1440 Z" fill="#4A4642" stroke={C.ink} strokeWidth={7}/>
    <ellipse cx={540} cy={1100} rx={280} ry={50} fill="#2B2826" stroke={C.ink} strokeWidth={7}/>
    {[0, 1].map((k) => { const a = t * 2.4 + k * Math.PI; return <ellipse key={k} cx={540 + Math.cos(a) * 140} cy={1100 + Math.sin(a) * 22} rx={90} ry={22} fill={k ? SILVER : "#8F8A84"} stroke={C.ink} strokeWidth={4}/>; })}
    <g transform={`rotate(${Math.sin(t * 2.4) * 18}, 540, 1100)`}><rect x={526} y={760} width={28} height={360} rx={12} fill="#B98A5E" stroke={C.ink} strokeWidth={5}/></g>
    <text x={540} y={1560} textAnchor="middle" fontFamily={MONO} fontSize={28} letterSpacing={3} fill={C.ink2}>STIR · HEAT · MIX · STILL TWO METALS</text>
  </Page>
);

/** b06: a tiny particle flies in and knocks a piece off an atom's centre */
export const AtomHit: React.FC<{p: number; hit: number; t: number; o?: number}> = ({p, hit, t, o = 1}) => {
  const bx = 100 + 330 * Math.min(1, hit * 2), off = Math.max(0, hit * 2 - 1);
  return (
    <Page o={o * p}>
      {[0, 1, 2].map((k) => <ellipse key={k} cx={600} cy={1130} rx={330} ry={110} fill="none" stroke={C.line} strokeWidth={4} transform={`rotate(${k * 60 + t * 6}, 600, 1130)`}/>)}
      <Nucleus cx={600} cy={1130} r={120} n={22} protons={0.3} t={t} wobble={off > 0 ? 1 - off : 0}/>
      {off === 0 && <><circle cx={bx} cy={1130} r={22} fill={C.accent} stroke={C.ink} strokeWidth={4}/><line x1={bx - 140} y1={1130} x2={bx - 30} y2={1130} stroke={C.accent} strokeWidth={6} strokeDasharray="14 12" opacity={0.6}/></>}
      {off > 0 && <circle cx={620 + 360 * off} cy={1080 - 380 * off} r={26} fill={PROTON} stroke={C.ink} strokeWidth={4}/>}
      <text x={600} y={1460} textAnchor="middle" fontFamily={MONO} fontSize={28} letterSpacing={3} fill={C.ink2}>THE ATOM'S CENTRE: THE NUCLEUS</text>
    </Page>
  );
};

/** b07: a dark vial with a few glowing atoms of radioactive gold */
export const FewAtoms: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    <rect x={300} y={860} width={480} height={600} rx={50} fill={C.night} stroke={C.ink} strokeWidth={7}/>
    {[[430, 1060], [640, 1000], [560, 1240], [700, 1330], [400, 1320]].map(([x, y], k) => {
      const g = 0.6 + 0.4 * Math.sin(t * 4 + k * 1.7);
      return <g key={k}><circle cx={x} cy={y} r={46 * g} fill={GOLD} opacity={0.25}/><circle cx={x} cy={y} r={16} fill={GOLD_L}/></g>;
    })}
    <Trefoil x={780} y={870} r={66} o={0.95}/>
  </Page>
);

/** b08: two lead nuclei skim past in the collider ring; three protons pop off one, it flashes gold, then breaks apart */
export const LeadSkim: React.FC<{p: number; skim: number; t: number; o?: number}> = ({p, skim, t, o = 1}) => {
  const a = Math.min(1, skim * 1.6), pop = Math.max(0, skim * 1.6 - 0.6), brk = Math.max(0, skim * 2 - 1.5) * 2;
  return (
    <Page o={o * p}>
      <ellipse cx={540} cy={1120} rx={440} ry={250} fill="none" stroke={C.ink} strokeWidth={10}/>
      <ellipse cx={540} cy={1120} rx={410} ry={222} fill="none" stroke={C.accent} strokeWidth={3} strokeDasharray="10 16" strokeDashoffset={-t * 120}/>
      <Nucleus cx={160 + 340 * a} cy={1075} r={78} n={28} protons={0.4} t={t} seed={2}/>
      <g opacity={1 - brk}><Nucleus cx={920 - 340 * a} cy={1185} r={78} n={28} protons={0.4} t={t} seed={5} tint={Math.min(1, pop * 2)} wobble={pop > 0 ? 0.6 : 0}/></g>
      {pop > 0 && [0, 1, 2].map((k) => <circle key={k} cx={580 + (k - 1) * 90 * pop} cy={1185 - 200 * pop - k * 10} r={22} fill={PROTON} stroke={C.ink} strokeWidth={4} opacity={Math.min(1, pop * 3)}/>)}
      {brk > 0 && Array.from({length: 8}).map((_, k) => <circle key={k} cx={580 + Math.cos(k) * 160 * brk} cy={1185 + Math.sin(k) * 120 * brk} r={14} fill={GOLD_D} opacity={1 - brk}/>)}
      <text x={540} y={1430} textAnchor="middle" fontFamily={MONO} fontSize={28} letterSpacing={3} fill={C.ink2}>LEAD 82 − 3 PROTONS = GOLD 79</text>
    </Page>
  );
};

/** b10: a slice of the periodic table; gold and mercury lit up next to each other */
export const PeriodicPair: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const els = [["Pt", "78", "PLATINUM"], ["Au", "79", "GOLD"], ["Hg", "80", "MERCURY"], ["Tl", "81", "THALLIUM"]];
  return (
    <Page o={o}>
      {els.map(([s, n, name], k) => {
        const hi = k === 1 || k === 2, q = Math.min(1, Math.max(0, p * 4 - k * 0.6)), x = 70 + k * 240, lift = hi ? -24 - 6 * Math.sin(t * 3 + k) : 0;
        return (
          <g key={s} transform={`translate(${x},${1000 + lift + (1 - q) * 80})`} opacity={q}>
            <rect width={220} height={260} rx={22} fill={k === 1 ? GOLD : k === 2 ? SILVER : C.paper2} stroke={C.ink} strokeWidth={hi ? 8 : 4}/>
            <text x={20} y={56} fontFamily={MONO} fontSize={40} fontWeight={600} fill={C.ink}>{n}</text>
            <text x={110} y={170} textAnchor="middle" fontFamily={HEAD} fontSize={100} fill={C.ink}>{s}</text>
            <text x={110} y={230} textAnchor="middle" fontFamily={MONO} fontSize={21} letterSpacing={2} fill={C.ink2}>{name}</text>
          </g>
        );
      })}
    </Page>
  );
};

/** b11: fusion glow sends a fast neutron into mercury; two neutrons leave, the nucleus wobbles */
export const NeutronHit: React.FC<{p: number; hit: number; t: number; o?: number}> = ({p, hit, t, o = 1}) => {
  const fly = Math.min(1, hit * 1.8), out = Math.max(0, hit * 1.8 - 1);
  return (
    <Page o={o * p}>
      {[0, 1, 2].map((k) => <circle key={k} cx={210} cy={1120} r={(110 + k * 40) * (1 + 0.05 * Math.sin(t * 6 + k))} fill="#F6C453" opacity={0.35 - k * 0.1}/>)}
      <circle cx={210} cy={1120} r={80} fill="#FBE29A" stroke={FIRE} strokeWidth={6}/>
      <text x={210} y={1290} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.ink2}>FUSION</text>
      <Nucleus cx={760} cy={1120} r={130} n={36} protons={0.42} t={t} wobble={out > 0 ? 1 : 0} tint={0} seed={3}/>
      <text x={760} y={1330} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.ink2}>MERCURY 80</text>
      {out === 0 && <circle cx={300 + 330 * fly} cy={1120} r={24} fill={NEUTRON} stroke={C.ink} strokeWidth={4}/>}
      {out === 0 && <line x1={260 + 330 * fly} y1={1120} x2={160 + 330 * fly} y2={1120} stroke={NEUTRON} strokeWidth={6} strokeDasharray="12 10"/>}
      {out > 0 && [0, 1].map((k) => <circle key={k} cx={890 + 90 * out} cy={1120 + (k ? 1 : -1) * 200 * out} r={24} fill={NEUTRON} stroke={C.ink} strokeWidth={4}/>)}
    </Page>
  );
};

/** b12: one proton turns into a neutron; the nucleus counter ticks 80 -> 79 and it turns gold */
export const Decay: React.FC<{p: number; change: number; t: number; o?: number}> = ({p, change, t, o = 1}) => (
  <Page o={o * p}>
    <Nucleus cx={540} cy={1120} r={190} n={40} protons={0.42} t={t} tint={change} seed={3}/>
    {[0, 1, 2, 3].map((k) => <circle key={k} cx={540} cy={1120} r={230 + k * 40 + 30 * Math.sin(t * 2 + k)} fill="none" stroke={GOLD} strokeWidth={4} opacity={change * (0.4 - k * 0.09)}/>)}
  </Page>
);

/** b13: a balance: the fresh gold bar (with a fading trefoil) against one banana; years tick on a calendar */
export const GoldBanana: React.FC<{p: number; years: number; t: number; o?: number}> = ({p, years, t, o = 1}) => {
  const tilt = 8 * (1 - Math.min(1, years / 17.7));
  return (
    <Page o={o * p}>
      <rect x={510} y={1000} width={60} height={460} fill="#8F8A84" stroke={C.ink} strokeWidth={5}/>
      <path d="M 400 1470 L 680 1470 L 640 1430 L 440 1430 Z" fill="#6B6762" stroke={C.ink} strokeWidth={5}/>
      <g transform={`rotate(${-tilt}, 540, 1000)`}>
        <line x1={170} y1={1000} x2={910} y2={1000} stroke={C.ink} strokeWidth={10} strokeLinecap="round"/>
        <g transform="translate(240,1000)">
          <line x1={0} y1={0} x2={-60} y2={150} stroke={C.ink} strokeWidth={4}/><line x1={0} y1={0} x2={60} y2={150} stroke={C.ink} strokeWidth={4}/>
          <path d="M -100 150 L 100 150 L 80 180 L -80 180 Z" fill={C.paper2} stroke={C.ink} strokeWidth={5}/>
          <path d="M -80 150 L -56 92 L 56 92 L 80 150 Z" fill={GOLD} stroke={GOLD_D} strokeWidth={5}/>
          <Sparkle x={-10} y={116} t={t} s={1}/>
          <Trefoil x={70} y={70} r={34} o={Math.max(0.15, 1 - years / 17.7)}/>
        </g>
        <g transform="translate(840,1000)">
          <line x1={0} y1={0} x2={-60} y2={150} stroke={C.ink} strokeWidth={4}/><line x1={0} y1={0} x2={60} y2={150} stroke={C.ink} strokeWidth={4}/>
          <path d="M -100 150 L 100 150 L 80 180 L -80 180 Z" fill={C.paper2} stroke={C.ink} strokeWidth={5}/>
          <path d="M -78 140 Q 0 170 78 116 Q 70 100 60 112 Q 0 146 -70 126 Z" fill="#F4D35E" stroke={C.ink} strokeWidth={5}/>
        </g>
      </g>
      <g transform="translate(540,880)">
        <rect x={-160} y={-80} width={320} height={110} rx={16} fill={C.white} stroke={C.ink} strokeWidth={5}/>
        <rect x={-160} y={-80} width={320} height={30} rx={14} fill={C.accent}/>
        <text x={0} y={18} textAnchor="middle" fontFamily={HEAD} fontSize={58} fill={C.ink}>{`${years.toFixed(1)} YRS`}</text>
      </g>
    </Page>
  );
};

/** b15: what one big fusion plant might make in a year, next to what mines dig up */
export const Piles: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const pile = (cx: number, w: number, h: number) => `M ${cx - w} 1440 Q ${cx - w * 0.4} ${1440 - h * 1.1} ${cx} ${1440 - h} Q ${cx + w * 0.4} ${1440 - h * 1.1} ${cx + w} 1440 Z`;
  return (
    <Page o={o}>
      <line x1={60} y1={1440} x2={1020} y2={1440} stroke={C.ink} strokeWidth={6}/>
      <path d={pile(230, 50 * p, 28 * p)} fill={GOLD} stroke={GOLD_D} strokeWidth={5}/>
      <path d={pile(660, 340 * p, 470 * p)} fill={GOLD} stroke={GOLD_D} strokeWidth={6}/>
      {p > 0.6 && [0, 1, 2, 3].map((k) => <Sparkle key={k} x={560 + k * 70} y={1180 + (k % 2) * 90} t={t + k} s={1.3}/>)}
      <text x={230} y={1500} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink2}>ONE PLANT · A YEAR</text>
      <text x={230} y={1534} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink2}>A FEW TONNES</text>
      <text x={660} y={1500} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink2}>MINES · 2025</text>
      <text x={660} y={1534} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink2}>3,672 TONNES</text>
    </Page>
  );
};

/** b16: a fusion reactor ring (doughnut) with its glowing plasma, for the callback */
export const FusionRing: React.FC<{p: number; t: number; o?: number; cx?: number; cy?: number; s?: number}> = ({p, t, o = 1, cx = 770, cy = 1180, s = 1}) => (
  <Page o={o * p}>
    <g transform={`translate(${cx},${cy}) scale(${s})`}>
      <ellipse rx={230} ry={130} fill="#D9DDE2" stroke={C.ink} strokeWidth={7}/>
      <ellipse rx={110} ry={52} fill={C.paper} stroke={C.ink} strokeWidth={6}/>
      <ellipse rx={170} ry={90} fill="none" stroke="#C59BF0" strokeWidth={18} opacity={0.55 + 0.25 * Math.sin(t * 5)}/>
      <ellipse rx={170} ry={90} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="20 30" strokeDashoffset={-t * 200}/>
      {Array.from({length: 8}).map((_, k) => { const a = (k / 8) * Math.PI * 2; return <rect key={k} x={Math.cos(a) * 200 - 14} y={Math.sin(a) * 112 - 30} width={28} height={60} rx={6} fill={C.accent} stroke={C.ink} strokeWidth={3}/>; })}
    </g>
  </Page>
);

/** b14: CLAIMED stamp (the claim ladder: CLAIMED / PUBLISHED / REPEATED / ON SALE) */
export const Stamp: React.FC<{text: string; p: number; x: number; y: number; rot?: number}> = ({text, p, x, y, rot = -8}) => (
  <div style={{position: "absolute", left: x, top: y, opacity: Math.min(1, p * 3), transform: `rotate(${rot}deg) scale(${1.8 - 0.8 * Math.min(1, p)})`, transformOrigin: "center"}}>
    <div style={{border: `10px solid ${C.accent}`, borderRadius: 18, padding: "10px 36px 14px", fontFamily: HEAD, fontSize: 120, letterSpacing: 4, color: C.accent, background: "rgba(242,238,231,0.85)"}}>{text}</div>
  </div>
);

/** b16 (v2): two gold rings, identical atom for atom; one mined (pickaxe), one made (reactor ring). `p` draws them in. */
export const TwoRings: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const ring = (cx: number, k: number) => {
    const q = Math.min(1, Math.max(0, p * 1.6 - k * 0.4)), bob = Math.sin(t * 2 + k) * 8;
    return (
      <g key={k} transform={`translate(${cx},${1130 + bob}) scale(${0.6 + 0.4 * q})`} opacity={q}>
        <circle r={190} fill={GOLD_L} opacity={0.35}/>
        <ellipse rx={150} ry={150} fill="none" stroke={GOLD_D} strokeWidth={58}/>
        <ellipse rx={150} ry={150} fill="none" stroke={GOLD} strokeWidth={44}/>
        <path d="M -118 -70 A 140 140 0 0 1 -40 -138" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.8}/>
        <Sparkle x={110} y={-110} t={t + k} s={1.6}/>
      </g>
    );
  };
  return (
    <Page o={o}>
      {ring(300, 0)}{ring(780, 1)}
      <text x={540} y={1150} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill={C.ink} opacity={Math.max(0, p * 2 - 1)}>=</text>
      <g opacity={Math.max(0, p * 2 - 1)}>
        <g transform="translate(300,1400)"><line x1={-40} y1={30} x2={30} y2={-40} stroke="#8A5A3C" strokeWidth={10} strokeLinecap="round"/><path d="M -10 -70 Q 40 -60 70 -10" fill="none" stroke={C.ink2} strokeWidth={12} strokeLinecap="round"/></g>
        <g transform="translate(780,1390)"><ellipse rx={70} ry={38} fill="#D9DDE2" stroke={C.ink} strokeWidth={5}/><ellipse rx={30} ry={14} fill={C.paper} stroke={C.ink} strokeWidth={4}/><ellipse rx={50} ry={26} fill="none" stroke="#C59BF0" strokeWidth={6} opacity={0.6 + 0.3 * Math.sin(t * 5)}/></g>
        <text x={300} y={1480} textAnchor="middle" fontFamily={MONO} fontSize={30} letterSpacing={4} fill={C.ink}>MINED</text>
        <text x={780} y={1480} textAnchor="middle" fontFamily={MONO} fontSize={30} letterSpacing={4} fill={C.ink}>MADE</text>
      </g>
    </Page>
  );
};
