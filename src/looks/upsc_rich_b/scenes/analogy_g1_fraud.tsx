// ECO-16 Part 3, builder G1: `fraud` (b16). A table in a quiet room: a phone with an incoming message and a link (a red cross lands on the link at lk), an OTP card that a hand covers (sh),
// a stranger seen only as a faint silhouette through the window (no face), and a helpline card 1930 that glows (hl) with the National Cybercrime Reporting Portal beneath it (read from the hl label).
// fr is the headline. Before fr the phone shows a payment that went through (digital payments made life easier). Generic UI only; no real app, logo or number other than the label's.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {GDefs, E1Defs, F1Defs, Hills, Cloud, Sun, Badge, P2Card, elabs, ez, sm, pop, pulse, mixn, type AP} from "./analogy_g1_kit";

const parse = (t: string) => ({num: (t.match(/\d{4}/) ?? [""])[0], portal: (t.split("·")[1] ?? "").trim()});

const Stranger: React.FC<{a: number; f: number}> = ({a, f}) => a > 0.01 ? (
  <g opacity={a * 0.85} transform={`translate(0 ${Math.sin(f / 30) * 1.2})`}>
    <ellipse cx={0} cy={2} rx={30} ry={5} fill="#10182c" opacity={0.3}/>
    <path d="M-22,0 L-20,-70 Q-24,-96 -10,-104 L10,-104 Q24,-96 20,-70 L22,0 Z" fill="#1b2438"/>
    <circle cx={0} cy={-122} r={17} fill="#1b2438"/>
    <path d="M-14,-132 Q0,-148 14,-132 Q18,-118 0,-102 Q-18,-118 -14,-132 Z" fill="#1b2438"/>
    <path d="M-18,-104 L-34,-62 M18,-104 L32,-72" stroke="#1b2438" strokeWidth={9} strokeLinecap="round"/>
  </g>
) : null;

/** an open hand seen from above, covering something: palm, four fingers, thumb, a cuff running off to the right */
const CoverHand: React.FC<{x: number; y: number; a: number; s?: number}> = ({x, y, a, s = 1}) => a > 0.01 ? (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp(a * 2)} filter="url(#g1-sh)">
    <path d="M60,-38 L330,-70 L330,70 L60,44 Z" fill="#6c8fb5" stroke="#41607f" strokeWidth={3}/>
    <path d="M70,-34 L330,-62 L330,-50 L70,-22 Z" fill="#fff" opacity={0.14}/>
    {[[-78, -50, -8], [-86, -16, 0], [-80, 18, 6], [-62, 50, 14]].map(([fx, fy, r], i) => (
      <g key={i} transform={`translate(${fx} ${fy}) rotate(${r})`}>
        <rect x={-62} y={-14} width={106} height={28} rx={14} fill="#a9744a" stroke="#6a3f26" strokeWidth={2}/>
        <rect x={-62} y={-14} width={106} height={28} rx={14} fill="#d8a47a"/>
        <rect x={-58} y={-10} width={96} height={8} rx={4} fill="#fff" opacity={0.2}/>
        <ellipse cx={-52} cy={0} rx={7} ry={9} fill="#f0cfae" stroke="#a8754f" strokeWidth={1}/>
      </g>
    ))}
    <ellipse cx={20} cy={0} rx={72} ry={70} fill="#d8a47a" stroke="#6a3f26" strokeWidth={2}/>
    <ellipse cx={14} cy={-14} rx={46} ry={34} fill="#e6b88c" opacity={0.7}/>
    <path d="M10,-72 Q-50,-84 -60,-96" stroke="#d8a47a" strokeWidth={34} strokeLinecap="round" fill="none" transform="translate(0 -6)"/>
    <path d="M-10,60 Q40,70 70,54" stroke="#a8754f" strokeWidth={3} fill="none" opacity={0.5}/>
  </g>
) : null;

export const FraudArt: React.FC<AP> = (p) => {
  const {f, at} = p, L = elabs(p), fr = at("fr"), sh = at("sh"), lk = at("lk"), hl = at("hl");
  const hlp = parse(L.hl.text);
  const warn = pop(f, fr, 20), msg = ez(f, fr + 24, 26), bubble = pop(f, fr + 50, 20);
  const otp = sm(f, sh - 4, 28), hand = sm(f, sh + 18, 28), str = ez(f, sh, 24);
  const cross = pop(f, lk, 14), shake = Math.sin((f - lk) * 1.9) * Math.max(0, 1 - (f - lk) / 24) * 5;
  const hlA = pop(f, hl, 22), hlG = hlA * (0.7 + 0.3 * Math.sin(f / 8));
  const PX = 380, PYb = 760;
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      {/* a quiet room with a window onto a hazy street */}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-wallcool)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#2a3a5c" opacity={0.05 + 0.08 * warn}/>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={-30 + i * 200} y={-20} width={100} height={700} fill="#cdd6de" opacity={0.28}/>)}
      <g transform="translate(700 200)">
        <rect x={-14} y={-14} width={556} height={346} rx={8} fill="#6a5a46" stroke="#2f2418" strokeWidth={3}/>
        <clipPath id="g1-fwin"><rect x={0} y={0} width={528} height={318}/></clipPath>
        <g clipPath="url(#g1-fwin)">
          <rect x={0} y={0} width={528} height={318} fill="url(#g1-sky)"/>
          <Sun x={430} y={90} r={30} f={f} glow={0.5}/>
          <g transform="translate(-700 -200)"><Hills id="g1fh1" base={460} amp={34} top="#b9cbdd" bottom="#d6dfe0" seed={2.3} wl={260}/></g>
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={20 + i * 110} y={150 + (i % 3) * 24} width={84} height={170} fill="#b4c4d4" opacity={0.75}/>)}
          <rect x={0} y={270} width={528} height={48} fill="#cdbf9e"/>
          <g transform="translate(300 292) scale(0.62)"><Stranger a={str * 0.8} f={f}/></g>
        </g>
        <path d="M264,0 V318 M0,159 H528" stroke="#6a5a46" strokeWidth={7}/>
        <path d="M18,10 L180,10 L30,170 Z" fill="#fff" opacity={0.16}/>
        <rect x={-24} y={330} width={576} height={16} rx={3} fill="#8a6038" stroke="#3a2412" strokeWidth={2}/>
      </g>
      {/* a dotted request line from the stranger towards the table */}
      {str > 0.01 && <path d="M1000,500 Q1020,620 970,690" stroke="#c63f2f" strokeWidth={4} strokeDasharray="3 12" strokeLinecap="round" fill="none" opacity={0.7 * str}/>}
      {/* the table */}
      <rect x={-60} y={690} width={W + 120} height={H - 690 + 60} fill="url(#g1-floor)"/>
      <rect x={-60} y={690} width={W + 120} height={10} fill="#f2d79c" opacity={0.7}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M-60,${716 + i * 30} Q960,${708 + i * 30 + (i % 2) * 6} ${W + 60},${716 + i * 30}`} stroke="#3a2412" strokeWidth={1.5} opacity={0.3} fill="none"/>)}
      {/* a few things on the table */}
      <g transform="translate(700 760)"><ellipse cx={0} cy={6} rx={50} ry={9} fill="#2a1808" opacity={0.3}/><ellipse cx={0} cy={2} rx={44} ry={8} fill="#fff7e4" stroke="#b58a52" strokeWidth={1.6}/>
        <path d="M-22,-4 L-18,-52 L18,-52 L22,-4 Z" fill="#e8c27a" opacity={0.85} stroke="#b58a52" strokeWidth={1.6}/><path d="M-20,-30 H20" stroke="#fff" strokeWidth={1.6} opacity={0.5}/>
        {[0, 1].map((i) => <path key={i} d={`M${-6 + i * 12},-60 q-8,-14 0,-26 q8,-12 0,-24`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5 * (0.5 + 0.5 * Math.sin(f / 12 + i))} strokeLinecap="round"/>)}</g>
      <g transform="translate(1810 770)"><ellipse cx={0} cy={6} rx={54} ry={9} fill="#2a1808" opacity={0.3}/><path d="M-34,0 L-28,-62 L28,-62 L34,0 Z" fill="#b8643a" stroke="#6a3418" strokeWidth={2}/>
        {[-26, -10, 8, 24].map((x, i) => <path key={i} d={`M${x * 0.4},-62 Q${x * 1.6},${-96 - (i % 2) * 14} ${x * 1.9},${-118 - (i % 3) * 8}`} stroke="#3f8a3a" strokeWidth={9} fill="none" strokeLinecap="round"/>)}</g>
      {/* the phone */}
      <g transform={`translate(${PX} ${PYb}) rotate(-4)`}>
        <ellipse cx={0} cy={4} rx={130} ry={14} fill="#2a1808" opacity={0.34}/>
        <g filter="url(#g1-sh)"><rect x={-126} y={-480} width={252} height={484} rx={30} fill="#1e222a" stroke="#4b5566" strokeWidth={4}/></g>
        <rect x={-114} y={-466} width={228} height={456} rx={20} fill="#f4f7fb"/>
        <circle cx={0} cy={-452} r={4.4} fill="#0a0d12"/>
        {/* payment that went through, until the warning */}
        <g opacity={1 - msg}>
          <rect x={-114} y={-466} width={228} height={456} rx={20} fill="#1f9a5a"/>
          <circle cx={0} cy={-270} r={54} fill="#eafff2"/><path d="M-26,-270 L-8,-250 L28,-292" stroke="#1f9a5a" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x={-70} y={-170} width={140} height={14} rx={7} fill="#eafff2" opacity={0.85}/><rect x={-48} y={-140} width={96} height={10} rx={5} fill="#eafff2" opacity={0.6}/>
        </g>
        <g opacity={msg}>
          <rect x={-114} y={-466} width={228} height={46} rx={20} fill="#2a6fb8"/><rect x={-114} y={-440} width={228} height={20} fill="#2a6fb8"/>
          <rect x={-90} y={-452} width={80} height={10} rx={5} fill="#e9f3ff"/>
          {[0, 1, 2].map((i) => <g key={i}><circle cx={-92} cy={-390 + i * 66} r={16} fill="#cfdceb"/><rect x={-64} y={-402 + i * 66} width={90} height={9} rx={4.5} fill="#9fb2c6"/><rect x={-64} y={-384 + i * 66} width={140} height={8} rx={4} fill="#dfe8f2"/></g>)}
          {/* the incoming message with a link */}
          <g transform={`translate(0 ${(1 - bubble) * 30})`} opacity={clamp(bubble * 1.4)}>
            <rect x={-104} y={-196} width={208} height={150} rx={16} fill="#fff" stroke="#9fb2c6" strokeWidth={2.4} filter="url(#g1-sh-s)"/>
            <circle cx={-80} cy={-172} r={11} fill="#8a93a0"/><rect x={-60} y={-178} width={70} height={8} rx={4} fill="#9fb2c6"/>
            <rect x={-86} y={-152} width={172} height={8} rx={4} fill="#dfe8f2"/><rect x={-86} y={-136} width={128} height={8} rx={4} fill="#dfe8f2"/>
            <g transform={`translate(${shake} 0)`}>
              <rect x={-86} y={-112} width={172} height={42} rx={21} fill="#e3efff" stroke={cross > 0.1 ? "#c63f2f" : "#2a6fb8"} strokeWidth={3}/>
              <path d="M-62,-86 H40" stroke={cross > 0.1 ? "#c63f2f" : "#2a6fb8"} strokeWidth={4} strokeLinecap="round" strokeDasharray="12 6"/>
              <circle cx={62} cy={-91} r={10} fill="none" stroke={cross > 0.1 ? "#c63f2f" : "#2a6fb8"} strokeWidth={3}/>
            </g>
            {cross > 0.01 && <g transform={`translate(${shake} -91) scale(${0.5 + 0.5 * cross})`} opacity={cross}><circle r={46} fill="url(#g1-red)"/><path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#fff" strokeWidth={16} strokeLinecap="round"/><path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#c63f2f" strokeWidth={10} strokeLinecap="round"/></g>}
          </g>
        </g>
        {/* warning triangle on the phone's corner */}
        {warn > 0.01 && <g transform={`translate(96 -470) scale(${warn})`}><path d="M0,-40 L42,30 L-42,30 Z" fill="#f6c844" stroke="#8a6a10" strokeWidth={5} strokeLinejoin="round"/><rect x={-4} y={-14} width={8} height={26} rx={4} fill="#5a3c0a"/><circle cx={0} cy={20} r={5} fill="#5a3c0a"/></g>}
      </g>
      {/* the OTP card, covered by a hand */}
      <g transform={`translate(${mixn(960, 960, otp)} ${mixn(900, 650, otp)})`} opacity={clamp(otp * 2)}>
        <g filter="url(#g1-sh)"><rect x={-170} y={-96} width={340} height={192} rx={16} fill="#fff7e4" stroke="#b58a52" strokeWidth={3}/></g>
        <rect x={-170} y={-96} width={340} height={46} rx={16} fill="#8c2a48"/><rect x={-170} y={-68} width={340} height={18} fill="#8c2a48"/>
        <text x={0} y={-62} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing="0.3em" fill="#fff0e4">OTP</text>
        {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><rect x={-141 + i * 48} y={-16} width={38} height={58} rx={8} fill="#fff" stroke="#8c2a48" strokeWidth={3}/><circle cx={-122 + i * 48} cy={13} r={6.4} fill="#8c2a48" opacity={0.85}/></g>)}
        <text x={0} y={80} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={15} letterSpacing="0.2em" fill="#8a6a4a">ONE-TIME PASSWORD</text>
      </g>
      <CoverHand x={mixn(1320, 930, hand)} y={mixn(640, 668, hand)} a={hand} s={0.82}/>
      {/* the helpline card and the portal */}
      <g transform={`translate(1520 ${520 + (1 - hlA) * 40}) scale(${0.8 + 0.2 * hlA})`} opacity={clamp(hlA * 1.5)}>
        {hlA > 0.05 && <ellipse cx={0} cy={20} rx={250} ry={190} fill="url(#g1-spot)" opacity={hlG * 0.95}/>}
        <g filter="url(#g1-sh)"><rect x={-190} y={-150} width={380} height={300} rx={22} fill="#fff7e4" stroke="url(#f1-brass)" strokeWidth={7}/></g>
        <rect x={-190} y={-150} width={380} height={68} rx={22} fill="#2f7a56"/><rect x={-190} y={-110} width={380} height={28} fill="#2f7a56"/>
        <text x={-20} y={-103} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} letterSpacing="0.22em" fill="#eafff2">HELPLINE</text>
        <g transform="translate(-142 -116)"><path d="M-14,-10 q-4,-8 4,-8 l8,2 q6,2 4,8 l-4,6 q6,12 14,16 l6,-4 q6,-2 8,4 l2,8 q0,8 -8,6 q-22,-2 -34,-28 z" fill="#eafff2"/></g>
        <text x={0} y={46} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={124} letterSpacing="0.06em" fill="#173a5c">{hlp.num}</text>
        <path d="M-120,70 H120" stroke="#b58a52" strokeWidth={3}/>
        <text x={0} y={106} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.2em" fill="#5e2a0e">CALL FOR HELP</text>
      </g>
      {hlp.portal && (
        <g transform={`translate(1520 ${722 + (1 - hlA) * 30})`} opacity={clamp(hlA * 1.5 - 0.3)} filter="url(#g1-sh-s)">
          <rect x={-190} y={-26} width={380} height={64} rx={12} fill="#fff" stroke="#6f808b" strokeWidth={2.4}/>
          <rect x={-190} y={-26} width={380} height={22} rx={12} fill="#cfdceb"/><rect x={-190} y={-12} width={380} height={8} fill="#cfdceb"/>
          {[-172, -158, -144].map((x, i) => <circle key={i} cx={x} cy={-15} r={4.2} fill={["#c63f2f", "#e8b84a", "#2f9a5a"][i]}/>)}
          <text x={0} y={26} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={14} letterSpacing="0.03em" fill="#173a5c">{hlp.portal.toUpperCase()}</text>
        </g>
      )}
    </g>
  );
};

export const FraudLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={960} y={118} text={L.fr.text} f={f} at={L.fr.at} size={46} maxW={1100} upper={false} tone="dark"/>
      <P2Card cx={400} y={792} text={L.lk.text} f={f} at={L.lk.at} size={30} maxW={420} upper={false}/>
      <P2Card cx={960} y={792} text={L.sh.text} f={f} at={L.sh.at} size={28} maxW={560} upper={false} tone="cool"/>
    </>
  );
};
