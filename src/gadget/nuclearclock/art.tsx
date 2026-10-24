// Rich, moving art for No. 004 "The Clock Inside an Atom" (Now episode, written with the Nolan method, 23 Oct 2026).
// Three clocks (sea 1707, pocket today, lab 2026) converge on one rule; the head/feet clocks bookend it (hairpin).
import React from "react";
import {C, Draw, HEAD, MONO, W} from "../kit";

const SEA = "#5FA8D3", SEA_D = "#2F7BAE", STORM = "#5B6470", BRASS = "#C9A24A", BRASS_D = "#8C6A1E", LASER = "#7B4DFF", GLOW = "#B9A4FF";
const Page: React.FC<{o?: number; children: React.ReactNode}> = ({o = 1, children}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o, overflow: "visible"}}>{children}</svg>
);
/** a clock face; `a` is the minute-hand angle in turns, `ring` the rim colour */
export const Dial: React.FC<{cx: number; cy: number; r: number; a: number; ring?: string; fill?: string}> = ({cx, cy, r, a, ring = C.ink, fill = C.white}) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r} fill={fill} stroke={ring} strokeWidth={Math.max(4, r * 0.09)}/>
    {Array.from({length: 12}).map((_, k) => { const q = (k / 12) * Math.PI * 2; return <line key={k} x1={Math.sin(q) * r * 0.78} y1={-Math.cos(q) * r * 0.78} x2={Math.sin(q) * r * 0.9} y2={-Math.cos(q) * r * 0.9} stroke={C.ink2} strokeWidth={Math.max(2, r * 0.04)}/>; })}
    <line x1={0} y1={0} x2={Math.sin(a * Math.PI * 2) * r * 0.75} y2={-Math.cos(a * Math.PI * 2) * r * 0.75} stroke={C.accent} strokeWidth={Math.max(3, r * 0.06)} strokeLinecap="round"/>
    <line x1={0} y1={0} x2={Math.sin(a * Math.PI * 2 / 12) * r * 0.5} y2={-Math.cos(a * Math.PI * 2 / 12) * r * 0.5} stroke={C.ink} strokeWidth={Math.max(4, r * 0.08)} strokeLinecap="round"/>
    <circle r={r * 0.07} fill={C.ink}/>
  </g>
);

/** b01 / b16: a standing person with a clock at the head and one at the feet; the head clock runs a hair ahead */
export const HeadFeet: React.FC<{p: number; t: number; o?: number; lead?: number}> = ({p, t, o = 1, lead = 1}) => (
  <Page o={o * p}>
    <circle cx={540} cy={860} r={70} fill={C.paper2} stroke={C.ink} strokeWidth={7}/>
    <path d="M 540 930 L 540 1250 M 540 990 L 430 1130 M 540 990 L 650 1130 M 540 1250 L 470 1480 M 540 1250 L 610 1480" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round"/>
    <line x1={360} y1={1490} x2={720} y2={1490} stroke={C.ink} strokeWidth={6}/>
    <Dial cx={760} cy={830} r={70} a={t * 0.5 + 0.03 * lead}/>
    <Dial cx={760} cy={1420} r={70} a={t * 0.5}/>
    <path d="M 680 830 L 620 850 M 680 1420 L 630 1450" stroke={C.line} strokeWidth={4}/>
    <text x={860} y={845} fontFamily={MONO} fontSize={30} fontWeight={600} fill={C.accent} opacity={lead}>+</text>
    <text x={760} y={940} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink2}>HEAD</text>
    <text x={760} y={1530} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink2}>FEET</text>
  </Page>
);

/** b02: a globe with Vienna and Beijing pinned, a pulse running between them */
export const TwoLabs: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const V = [460, 1020], B = [700, 1090], k = (t * 0.6) % 1;
  return (
    <Page o={o * p}>
      <circle cx={540} cy={1130} r={330} fill="#EAF2F8" stroke={C.ink} strokeWidth={7}/>
      {[-2, -1, 0, 1, 2].map((i) => <ellipse key={i} cx={540} cy={1130 + i * 120} rx={330 * Math.sqrt(1 - (i * 120 / 330) ** 2)} ry={18} fill="none" stroke={C.line} strokeWidth={3}/>)}
      {[0.35, 0.7, 1].map((s, i) => <ellipse key={i} cx={540} cy={1130} rx={330 * s} ry={330} fill="none" stroke={C.line} strokeWidth={3}/>)}
      <path d="M 380 980 q 60 -40 140 -10 q 40 30 120 10 q 70 20 110 70 q -40 40 -120 20 q -80 10 -150 -20 q -70 -10 -100 -70 Z" fill="#C9DCC0" opacity={0.8}/>
      <path d={`M ${V[0]} ${V[1]} Q 580 900 ${B[0]} ${B[1]}`} fill="none" stroke={C.accent} strokeWidth={4} strokeDasharray="10 12"/>
      <circle cx={V[0] + (B[0] - V[0]) * k} cy={V[1] + (B[1] - V[1]) * k - 160 * Math.sin(k * Math.PI)} r={10} fill={C.accent}/>
      {[[V, "VIENNA"], [B, "BEIJING"]].map(([q, l], i) => (
        <g key={i}><circle cx={(q as number[])[0]} cy={(q as number[])[1]} r={16} fill={C.accent} stroke={C.white} strokeWidth={4}/>
          <text x={(q as number[])[0]} y={(q as number[])[1] + (i ? 56 : -30)} textAnchor="middle" fontFamily={MONO} fontSize={28} fontWeight={600} letterSpacing={3} fill={C.ink}>{l as string}</text></g>
      ))}
    </Page>
  );
};

/** b03 / b09: the three clocks of the story, as three framed icons */
export const ThreeClocks: React.FC<{p: number; t: number; o?: number; y?: number; s?: number; hi?: number}> = ({p, t, o = 1, y = 1150, s = 1, hi = -1}) => {
  const items = [["SEA · 1707", 0], ["POCKET · TODAY", 1], ["LAB · 2026", 2]] as const;
  return (
    <Page o={o}>
      {items.map(([label, k]) => {
        const q = Math.min(1, Math.max(0, p * 3 - k)), cx = 200 + k * 340;
        return (
          <g key={k} transform={`translate(${cx},${y}) scale(${s * (0.7 + 0.3 * q)})`} opacity={q * (hi < 0 || hi === k ? 1 : 0.35)}>
            <rect x={-140} y={-150} width={280} height={300} rx={30} fill={C.white} stroke={C.ink} strokeWidth={6}/>
            {k === 0 && <g><circle r={80} fill="none" stroke={BRASS_D} strokeWidth={10}/>{Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * Math.PI / 4 + t * 0.5) * 100} y2={Math.sin(i * Math.PI / 4 + t * 0.5) * 100} stroke={BRASS_D} strokeWidth={8}/>)}<circle r={22} fill={BRASS}/></g>}
            {k === 1 && <g><rect x={-60} y={-105} width={120} height={210} rx={20} fill={C.night}/><rect x={-48} y={-88} width={96} height={170} rx={8} fill="#DCE8F2"/><circle cx={0} cy={0} r={12} fill={C.accent}/><circle cx={0} cy={0} r={12 + 14 * ((t * 1.2) % 1)} fill="none" stroke={C.accent} strokeWidth={3} opacity={1 - ((t * 1.2) % 1)}/></g>}
            {k === 2 && <g><rect x={-110} y={-20} width={90} height={40} rx={8} fill={C.ink2}/><line x1={-20} y1={0} x2={50} y2={0} stroke={LASER} strokeWidth={8}/><path d="M 50 -50 L 100 -30 L 100 30 L 50 50 Z" fill="#EAE4FF" stroke={C.ink} strokeWidth={4}/><circle cx={75} cy={0} r={18 + 4 * Math.sin(t * 8)} fill={GLOW} opacity={0.7}/></g>}
            <text x={0} y={128} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={600} letterSpacing={2} fill={C.ink}>{label}</text>
          </g>
        );
      })}
    </Page>
  );
};

const wave = (y: number, amp: number, len: number, ph: number, bottom = 1560) => {
  const pts = []; for (let x = 60; x <= 1020; x += 20) pts.push(`${x},${y + amp * Math.sin(x / len + ph)}`);
  return `M 60 ${bottom} L ${pts.join(" L ")} L 1020 ${bottom} Z`;
};
/** b04-05: a storm at sea; the compass needle spins; on `wreck` four ships tilt onto rocks */
export const StormSea: React.FC<{p: number; t: number; wreck: number; o?: number}> = ({p, t, wreck, o = 1}) => (
  <Page o={o * p}>
    {[0, 1, 2].map((k) => <ellipse key={k} cx={300 + k * 260 + Math.sin(t * 0.4 + k) * 30} cy={760 + k * 20} rx={200} ry={60} fill={STORM} opacity={0.35}/>)}
    {[0, 1, 2, 3, 4, 5].map((k) => { const ph = (t * 1.5 + k / 6) % 1; return <line key={k} x1={120 + k * 160 - ph * 60} y1={800 + ph * 500} x2={100 + k * 160 - ph * 60} y2={840 + ph * 500} stroke={SEA_D} strokeWidth={4} opacity={0.5}/>; })}
    <path d={wave(1240, 26, 60, t * 2.4)} fill={SEA} opacity={0.6}/>
    {[0, 1, 2, 3].map((k) => {
      const x = 230 + k * 190, tilt = (Math.sin(t * 1.8 + k) * 6) + wreck * (24 + k * 6), dy = wreck * 30;
      return (
        <g key={k} transform={`translate(${x},${1200 + dy + Math.sin(t * 2 + k) * 10}) rotate(${tilt})`} opacity={1 - wreck * 0.25}>
          <path d="M -70 10 L 70 10 L 52 48 L -52 48 Z" fill="#8A5A3C" stroke={C.ink} strokeWidth={5}/>
          <line x1={0} y1={10} x2={0} y2={-110} stroke={C.ink} strokeWidth={6}/>
          <path d="M 4 -104 Q 50 -60 60 -20 L 4 -20 Z" fill={C.white} stroke={C.ink} strokeWidth={4}/>
        </g>
      );
    })}
    <g opacity={wreck}>{[[260, 1300], [520, 1320], [780, 1300]].map(([x, y], k) => <path key={k} d={`M ${x - 80} ${y + 40} L ${x - 30} ${y - 30} L ${x + 20} ${y - 10} L ${x + 80} ${y + 40} Z`} fill="#6B6762" stroke={C.ink} strokeWidth={5}/>)}</g>
    <path d={wave(1300, 30, 80, -t * 2.8)} fill={SEA_D} opacity={0.8}/>
    <g transform="translate(860,1460)"><circle r={70} fill={C.white} stroke={BRASS_D} strokeWidth={8}/><g transform={`rotate(${t * 400})`}><path d="M 0 -55 L 12 0 L 0 55 L -12 0 Z" fill={C.accent}/></g><text y={-82} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.ink2}>N ?</text></g>
  </Page>
);

/** b06-07: a phone with its map dot, satellites beaming, and a 30 cm ruler */
export const PhoneSats: React.FC<{p: number; t: number; ruler: number; o?: number}> = ({p, t, ruler, o = 1}) => (
  <Page o={o * p}>
    {[[220, 820], [540, 740], [860, 820]].map(([x, y], k) => (
      <g key={k} transform={`translate(${x},${y + Math.sin(t + k) * 8})`}>
        <rect x={-26} y={-18} width={52} height={36} rx={6} fill={C.ink2}/><rect x={-86} y={-10} width={52} height={20} fill={C.accent}/><rect x={34} y={-10} width={52} height={20} fill={C.accent}/>
        {[0, 1, 2].map((i) => { const ph = (t * 0.8 + i / 3 + k * 0.2) % 1; return <path key={i} d={`M ${-40 * ph - 10} ${30 + 200 * ph} Q 0 ${50 + 230 * ph} ${40 * ph + 10} ${30 + 200 * ph}`} fill="none" stroke={C.accent} strokeWidth={4} opacity={1 - ph}/>; })}
      </g>
    ))}
    <g transform="translate(540,1170)">
      <rect x={-110} y={-200} width={220} height={400} rx={34} fill={C.night}/>
      <rect x={-94} y={-176} width={188} height={340} rx={14} fill="#DCE8F2"/>
      <path d="M -94 -60 L 94 -120 M -94 60 L 94 0 M -30 -176 L 10 164" stroke="#B9CCDA" strokeWidth={10}/>
      <circle r={16} fill={C.accent}/><circle r={16 + 22 * ((t * 1.2) % 1)} fill="none" stroke={C.accent} strokeWidth={4} opacity={1 - ((t * 1.2) % 1)}/>
    </g>
    <g opacity={ruler}>
      <rect x={210} y={1430} width={660 * ruler} height={60} rx={8} fill="#F6E7B8" stroke={C.ink} strokeWidth={4}/>
      {Array.from({length: 31}).map((_, k) => k * 22 < 660 * ruler && <line key={k} x1={210 + k * 22} y1={1430} x2={210 + k * 22} y2={k % 5 ? 1450 : 1462} stroke={C.ink} strokeWidth={3}/>)}
      <text x={540} y={1540} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={2} fill={C.ink}>1 BILLIONTH OF A SECOND = 30 CM</text>
    </g>
  </Page>
);

/** b08: a laser beam into a crystal holding thorium atoms; the crystal glows when lit */
export const LaserCrystal: React.FC<{p: number; t: number; on: number; o?: number}> = ({p, t, on, o = 1}) => (
  <Page o={o * p}>
    <rect x={110} y={1080} width={260} height={120} rx={20} fill={C.ink2} stroke={C.ink} strokeWidth={6}/>
    <circle cx={370} cy={1140} r={24} fill={LASER}/>
    <line x1={380} y1={1140} x2={380 + 300 * on} y2={1140} stroke={LASER} strokeWidth={14} opacity={0.85}/>
    <line x1={380} y1={1140} x2={380 + 300 * on} y2={1140} stroke="#fff" strokeWidth={4}/>
    <g transform="translate(780,1140)">
      <circle r={200 * on} fill={GLOW} opacity={0.25 + 0.1 * Math.sin(t * 6)}/>
      <path d="M -110 -150 L 110 -150 L 150 0 L 110 150 L -110 150 L -150 0 Z" fill="#F1EEFF" stroke={C.ink} strokeWidth={6}/>
      {Array.from({length: 12}).map((_, k) => { const x = -80 + (k % 4) * 54, y = -80 + Math.floor(k / 4) * 80; return <circle key={k} cx={x} cy={y} r={12} fill={k % 3 ? "#C7BFEA" : LASER} opacity={0.6 + 0.4 * on * Math.abs(Math.sin(t * 5 + k))}/>; })}
    </g>
    <text x={780} y={1360} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink2}>THORIUM-229 IN CALCIUM FLUORIDE</text>
  </Page>
);

/** b10: Harrison's sea watch (H4 style), ticking */
export const SeaWatch: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    <circle cx={540} cy={1150} r={290} fill={BRASS} opacity={0.25}/>
    <rect x={510} y={790} width={60} height={70} rx={14} fill={BRASS} stroke={BRASS_D} strokeWidth={6}/>
    <circle cx={540} cy={760} r={34} fill="none" stroke={BRASS_D} strokeWidth={10}/>
    <circle cx={540} cy={1150} r={270} fill={BRASS} stroke={BRASS_D} strokeWidth={12}/>
    <Dial cx={540} cy={1150} r={225} a={Math.floor(t * 2) / 120} ring={BRASS_D} fill="#FFFBF0"/>
  </Page>
);

/** b11-13: an atom: electron cloud around a tiny nucleus. `jostle` shakes the electrons (b12), `zoom` dives into the nucleus (b13) */
export const AtomDive: React.FC<{p: number; t: number; jostle: number; zoom: number; o?: number}> = ({p, t, jostle, zoom, o = 1}) => {
  const s = 1 + zoom * 5, shake = jostle * (1 - zoom);
  return (
    <Page o={o * p}>
      <g transform={`translate(540,1150) scale(${s})`}>
        {[0, 1, 2].map((k) => <ellipse key={k} rx={260} ry={90} fill="none" stroke={C.line} strokeWidth={4 / s} transform={`rotate(${k * 60})`} opacity={1 - zoom}/>)}
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = t * (1.2 + k * 0.15) + k, ring = k % 3, x0 = Math.cos(a) * 260, y0 = Math.sin(a) * 90, r = (ring * 60 * Math.PI) / 180;
          const x = x0 * Math.cos(r) - y0 * Math.sin(r) + Math.sin(t * 37 + k) * 22 * shake, y = x0 * Math.sin(r) + y0 * Math.cos(r) + Math.cos(t * 41 + k) * 22 * shake;
          return <circle key={k} cx={x} cy={y} r={16 / Math.sqrt(s)} fill={C.accent} opacity={1 - zoom}/>;
        })}
        <circle r={28} fill={GLOW} opacity={0.5 + 0.3 * zoom}/>
        {Array.from({length: 9}).map((_, k) => <circle key={k} cx={Math.cos(k * 2.4) * 12 * Math.sqrt(k / 9)} cy={Math.sin(k * 2.4) * 12 * Math.sqrt(k / 9)} r={6} fill={k % 2 ? "#E8563A" : "#A2A7AE"} stroke={C.ink} strokeWidth={1.5}/>)}
        {zoom > 0.6 && [0, 1, 2].map((k) => <circle key={k} r={30 + ((t * 3 + k / 3) % 1) * 40} fill="none" stroke={LASER} strokeWidth={2} opacity={1 - ((t * 3 + k / 3) % 1)}/>)}
      </g>
      <g opacity={jostle * (1 - zoom)}>
        <g transform="translate(180,1420)"><path d="M 0 40 Q -40 0 0 -60 Q 10 -20 30 -40 Q 60 10 0 40 Z" fill="#F2A03D" stroke={C.ink} strokeWidth={4}/><text y={90} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.ink2}>HEAT</text></g>
        <g transform="translate(900,1420)"><path d="M -40 -50 L -40 20 A 40 40 0 0 0 40 20 L 40 -50 L 16 -50 L 16 20 A 16 16 0 0 1 -16 20 L -16 -50 Z" fill="#E8563A" stroke={C.ink} strokeWidth={4}/><text y={90} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.ink2}>MAGNETS</text></g>
      </g>
    </Page>
  );
};

/** b15: two layers of atoms one millimetre apart; the top layer pulses faster */
export const MmLayers: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    {[0, 1].map((k) => {
      const y = k ? 1300 : 1000, rate = k ? 3.0 : 3.25, pulse = (Math.sin(t * rate * Math.PI * 2) + 1) / 2;
      return (
        <g key={k}>
          {Array.from({length: 9}).map((_, i) => <circle key={i} cx={180 + i * 90} cy={y} r={22 + 8 * pulse} fill={k ? "#A2A7AE" : C.accent} opacity={0.6 + 0.4 * pulse}/>)}
          <text x={940} y={y + 10} fontFamily={MONO} fontSize={26} letterSpacing={2} fill={C.ink2}>{k ? "LOWER" : "HIGHER"}</text>
        </g>
      );
    })}
    <line x1={120} y1={1040} x2={120} y2={1260} stroke={C.ink} strokeWidth={4}/>
    <path d="M 108 1060 L 120 1040 L 132 1060 M 108 1240 L 120 1260 L 132 1240" fill="none" stroke={C.ink} strokeWidth={4}/>
    <text x={150} y={1160} fontFamily={HEAD} fontSize={52} fill={C.ink}>1 mm</text>
    <Draw d="M 180 1420 Q 540 1380 900 1420" p={p} stroke={C.line} w={4} len={900}/>
  </Page>
);
