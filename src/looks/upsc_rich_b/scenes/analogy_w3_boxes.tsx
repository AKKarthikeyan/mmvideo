// POL-03 Part 2, builder W3: `glass-boxes`. mode "boxes": rights as separate glass boxes on a shelf; a stamped rulebook alone opens the LIBERTY box (the Gopalan reading).
// mode "web": a passport stamped IMPOUNDED, seven empty judges' chairs (six together, one apart), and the boxes melting into one connected web. Motion follows f and at(key).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {W3Defs, Motes, Chair, GlassBox, WoodShelf} from "./analogy_w3_kit";

const NAMES = ["EQUALITY", "FREEDOMS", "LIBERTY", "EDUCATION", "REMEDIES"];

const Ico: React.FC<{k: number; c?: string}> = ({k, c = "#2f78b8"}) => {
  if (k === 0) return <g><path d="M0,-70 V-8 M-40,-52 H40 M-40,-52 L-56,-22 H-24 Z M40,-52 L24,-22 H56 Z" stroke={c} strokeWidth={5} fill="none" strokeLinejoin="round"/><rect x={-26} y={-8} width={52} height={10} rx={3} fill={c}/></g>;
  if (k === 1) return <g><path d="M-44,-50 L-6,-62 V-14 L-44,-26 Z" fill={c}/><path d="M-6,-62 L34,-84 V8 L-6,-14 Z" fill={c} opacity={0.75}/><path d="M48,-60 q16,22 0,44 M60,-72 q26,34 0,68" stroke={c} strokeWidth={4} fill="none" strokeLinecap="round"/></g>;
  if (k === 2) return <g><path d="M-8,-30 Q-44,-62 -64,-30 Q-40,-40 -22,-24 Z M8,-30 Q44,-62 64,-30 Q40,-40 22,-24 Z" fill="#e0902a"/><ellipse cx={0} cy={-26} rx={14} ry={24} fill="#f6c46a" stroke="#965a14" strokeWidth={2}/><circle cx={0} cy={-56} r={9} fill="#f6c46a" stroke="#965a14" strokeWidth={2}/><path d="M-6,-56 L-22,-52 L-6,-50 Z" fill="#e0902a"/></g>;
  if (k === 3) return <g><path d="M-48,-6 V-62 Q-20,-72 0,-58 Q20,-72 48,-62 V-6 Q20,-16 0,-2 Q-20,-16 -48,-6 Z" fill="#fffaf0" stroke={c} strokeWidth={4}/><path d="M0,-58 V-2" stroke={c} strokeWidth={3}/></g>;
  return <g><rect x={-12} y={-54} width={56} height={22} rx={4} fill={c} transform="rotate(-30 0 -40)"/><rect x={-48} y={-22} width={64} height={7} rx={3} fill="#7a4a26" transform="rotate(-30 -16 -18)"/><rect x={-40} y={-4} width={56} height={10} rx={3} fill="#7a4a26"/></g>;
};

const Book: React.FC<{stamp: number}> = ({stamp}) => (
  <g>
    <ellipse cx={0} cy={86} rx={110} ry={10} fill="#000" opacity={0.2}/>
    <rect x={-96} y={-70} width={192} height={150} rx={8} fill="#1d3a66" stroke="#0e2040" strokeWidth={3}/>
    <rect x={-96} y={-70} width={16} height={150} rx={6} fill="#142a4c"/>
    <rect x={-84} y={-58} width={168} height={126} rx={4} fill="none" stroke="#e8c86a" strokeWidth={2.4}/>
    <text x={0} y={-14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={36} letterSpacing="0.2em" fill="#f4dd96">LAW</text>
    <path d="M-40,2 H40" stroke="#e8c86a" strokeWidth={2}/>
    <path d="M-34,12 H34 M-26,22 H26" stroke="#e8c86a" strokeWidth={2} opacity={0.6}/>
    {[[-96, -70], [96, -70], [-96, 80], [96, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="url(#w3-brass)"/>)}
    <path d="M40,-70 V-30 L52,-40 L64,-30 V-70 Z" fill="#c8402a"/>
    {stamp > 0.01 && (
      <g transform={`translate(34 44) rotate(-12) scale(${1 + (1 - stamp) * 0.9})`} opacity={stamp}>
        <circle r={34} fill="none" stroke="#d8402a" strokeWidth={5}/><circle r={26} fill="none" stroke="#d8402a" strokeWidth={2}/>
        <path d="M-14,2 L-4,12 L16,-12" stroke="#d8402a" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    )}
  </g>
);

const Passport: React.FC<{x: number; y: number; stamp: number; f: number}> = ({x, y, stamp, f}) => {
  const sh = stamp > 0 && stamp < 0.4 ? Math.sin(f * 2.4) * (1 - stamp / 0.4) * 5 : 0;
  return (
    <g transform={`translate(${x + sh} ${y}) rotate(-6)`}>
      <ellipse cx={0} cy={166} rx={150} ry={14} fill="#000" opacity={0.22}/>
      <rect x={-112} y={-150} width={224} height={310} rx={14} fill="#1c2f5c" stroke="#0e1a38" strokeWidth={3}/>
      <rect x={-112} y={-150} width={18} height={310} rx={10} fill="#142548"/>
      <rect x={-98} y={-136} width={196} height={282} rx={8} fill="none" stroke="#d8b858" strokeWidth={2}/>
      <circle cx={0} cy={-34} r={50} fill="none" stroke="#d8b858" strokeWidth={3}/><circle cx={0} cy={-34} r={36} fill="none" stroke="#d8b858" strokeWidth={2} strokeDasharray="3 5"/>
      <circle cx={0} cy={-34} r={20} fill="#d8b858" opacity={0.85}/>
      <text x={0} y={-82} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.3em" fill="#e8d088">PASSPORT</text>
      <rect x={-60} y={52} width={120} height={8} rx={4} fill="#d8b858" opacity={0.7}/><rect x={-40} y={70} width={80} height={8} rx={4} fill="#d8b858" opacity={0.5}/>
      <path d="M-100,-150 L-40,-150 L-100,-80 Z" fill="#fff" opacity={0.08}/>
      {stamp > 0.01 && (
        <g transform={`translate(10 70) rotate(-20) scale(${1 + (1 - stamp) * 1.6})`} opacity={clamp(stamp * 1.6)}>
          <rect x={-150} y={-32} width={300} height={64} rx={6} fill="rgba(200,40,30,0.08)" stroke="#d8402a" strokeWidth={7}/>
          <rect x={-142} y={-24} width={284} height={48} rx={3} fill="none" stroke="#d8402a" strokeWidth={2}/>
          <text x={0} y={13} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} letterSpacing="0.12em" fill="#d8402a">IMPOUNDED</text>
        </g>
      )}
    </g>
  );
};

export const BoxesArt: React.FC<AP> = (p) => {
  const web = (p.spec as any).mode === "web", {f} = p;
  const T = (k: string) => { try { return p.at(k); } catch { return 1e9; } };
  if (!web) {
    const a21 = T("a21"), gp = T("gp"), nc = T("nc");
    const spread = eio(prog(f, gp - 10, 40)), sp = 262 + 56 * spread;
    const X = (i: number) => 960 + (i - 2) * sp;
    const bookIn = eio(prog(f, gp + 50, 50)), stamp = eo(prog(f, gp + 108, 14)), openU = eio(prog(f, gp + 134, 36));
    const bookY = 430 + 340 * 0 + (1 - bookIn) * -120 + Math.sin(f / 18) * 5 * (1 - openU) - 70 * openU;
    const libGlow = (0.35 + 0.25 * Math.sin(f / 12)) * eo(prog(f, a21, 20)) * (1 - openU * 0.4) + openU * 0.55;
    return (
      <g>
        <W3Defs/>
        <defs><linearGradient id="w3-lib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9d9bd"/><stop offset="1" stopColor="#cdb68a"/></linearGradient></defs>
        <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w3-lib)"/>
        {/* a study wall: tall window and book spines far behind */}
        {Array.from({length: 30}, (_, i) => { const g = rng(i * 7 + 3); return <rect key={i} x={20 + i * 66} y={150 + g() * 40} width={52} height={430 - g() * 40} fill={["#9a6a50", "#6c7f96", "#8a9a6a", "#b0884a", "#7a5a7a"][i % 5]} opacity={0.22}/>; })}
        <rect x={-60} y={640} width={W + 120} height={400} fill="url(#w3-wood)" opacity={0.0}/>
        <Motes f={f} x0={100} x1={1800} y0={160} y1={740} n={26} seed={6}/>
        <WoodShelf x={120} y={770} w={1680}/>
        <rect x={-60} y={800} width={W + 120} height={300} fill="url(#w3-woodd)" opacity={0.85}/>
        {NAMES.map((n, i) => {
          const lib = i === 2, ap = eo(prog(f, a21 - 14 + i * 5, 22));
          return <GlassBox key={n} x={X(i)} y={770} w={210} h={250} a={ap} glow={lib ? libGlow : 0} open={lib ? openU : 0} plate={n}><g transform="translate(0 -80)"><Ico k={i}/></g>
            {lib && openU > 0.05 && <g opacity={openU}><ellipse cx={0} cy={-132} rx={90} ry={110} fill="url(#w3-glow)"/></g>}</GlassBox>;
        })}
        {/* dividers make the "separate" reading visible */}
        {spread > 0.02 && [0, 1, 2, 3].map((i) => <rect key={i} x={(X(i) + X(i + 1)) / 2 - 4} y={540} width={8} height={234} rx={4} fill="#8a6a38" opacity={0.75 * spread}/>)}
        {bookIn > 0.01 && (
          <g transform={`translate(${X(2)} ${bookY - (stamp > 0.5 ? 0 : 0)}) scale(${0.82 + 0.0 * bookIn}) rotate(${(1 - bookIn) * 14})`} opacity={clamp(bookIn * 2)}>
            <Book stamp={stamp}/>
          </g>
        )}
        {openU > 0.1 && Array.from({length: 10}, (_, i) => { const u = ((f * 0.02 + i / 10) % 1) * openU; return <circle key={i} cx={X(2) + Math.sin(i * 2.1 + f / 20) * 50} cy={640 - u * 190} r={3 + (i % 3)} fill="#ffe08a" opacity={(1 - u) * 0.8}/>; })}
      </g>
    );
  }
  const pi = T("pi"), mg = T("mg"), dj = T("dj"), t14 = T("t14"), ov = T("ov");
  const stamp = eo(prog(f, pi - 6, 14)), chA = eo(prog(f, mg - 30, 30)), djL = eo(prog(f, dj, 30));
  const melt = eio(prog(f, ov - 40, 70)), webP = eo(prog(f, ov - 24, 56));
  const BXS = [360, 660, 960, 1260, 1560];
  const chairX = [700, 812, 924, 1036, 1148, 1260].map((x) => x + 20), CY = 610;
  const pulse = 0.5 + 0.5 * Math.sin(f / 10);
  return (
    <g>
      <W3Defs/>
      <defs><linearGradient id="w3-lib2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6d6b8"/><stop offset="1" stopColor="#cdb68a"/></linearGradient></defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w3-lib2)"/>
      {Array.from({length: 30}, (_, i) => { const g = rng(i * 7 + 3); return <rect key={i} x={20 + i * 66} y={150 + g() * 40} width={52} height={430 - g() * 40} fill={["#9a6a50", "#6c7f96", "#8a9a6a", "#b0884a", "#7a5a7a"][i % 5]} opacity={0.2}/>; })}
      <Motes f={f} x0={100} x1={1800} y0={160} y1={740} n={24} seed={8}/>
      {/* the judges' bench floor line */}
      <rect x={560} y={CY} width={1130} height={14} rx={6} fill="url(#w3-woodd)" opacity={chA}/>
      <Passport x={330} y={430} stamp={stamp} f={f}/>
      {chairX.map((x, i) => <Chair key={i} x={x} y={CY} s={0.86} a={chA} tone="green" glow={eo(prog(f, mg + i * 4, 20)) * 0.45 * (0.7 + 0.3 * pulse)}/>)}
      <Chair x={1560} y={CY} s={0.86} a={chA * (0.55 + 0.45 * djL)} tone="amber" glow={djL * (0.6 + 0.4 * pulse)}/>
      {chA > 0.01 && <path d={`M${chairX[0] - 52},${CY - 190} Q${(chairX[0] + chairX[5]) / 2},${CY - 214} ${chairX[5] + 52},${CY - 190}`} stroke="#2f9a4a" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7 * chA}/>}
      {/* the shelf, the boxes, then the web */}
      <WoodShelf x={120} y={880} w={1680}/>
      {BXS.map((x, i) => <GlassBox key={i} x={x} y={880} w={170} h={140} melt={melt} a={eo(prog(f, 10 + i * 6, 20))} plate={NAMES[i]}><g transform="translate(0 -52) scale(0.58)"><Ico k={i}/></g></GlassBox>)}
      {webP > 0.01 && (
        <g>
          {BXS.flatMap((x, i) => BXS.slice(i + 1).map((x2, j) => { const jj = i + 1 + j, my = 790 - Math.sin(Math.PI * 0.5) * 70 * (jj - i > 1 ? 1 : 0.3) * 0 ; return (
            <path key={`${i}-${jj}`} d={`M${x},800 Q${(x + x2) / 2},${800 - 30 * (jj - i)} ${x2},800`} fill="none" stroke="#e8a82a" strokeWidth={4} strokeLinecap="round" opacity={0.85 * webP} strokeDasharray="1000" strokeDashoffset={1000 * (1 - webP)}/>); }))}
          {BXS.map((x, i) => <g key={i} transform={`translate(${x} 800)`} opacity={webP}><circle r={34} fill="url(#w3-glow)"/><circle r={17} fill="#f6c46a" stroke="#965a14" strokeWidth={3}/></g>)}
        </g>
      )}
    </g>
  );
};

export const BoxesLabels: React.FC<AP> = (p) => {
  const web = (p.spec as any).mode === "web", L = rlabs(p);
  if (!web) return (
    <>
      {L[0] && <P2Card cx={960} y={80} text={L[0].text} f={p.f} at={L[0].at} size={48} maxW={900}/>}
      {L[1] && <P2Card cx={960} y={196} text={L[1].text} f={p.f} at={L[1].at} size={30} maxW={1300} upper={false}/>}
      {L[2] && <P2Card cx={420} y={310} text={L[2].text} f={p.f} at={L[2].at} size={26} maxW={560} upper={false}/>}
      {L[3] && <P2Card cx={1500} y={310} text={L[3].text} f={p.f} at={L[3].at} size={28} maxW={500} upper={false}/>}
    </>
  );
  return (
    <>
      {L[0] && <P2Card cx={346} y={80} text={L[0].text} f={p.f} at={L[0].at} size={28} maxW={460}/>}
      {L[1] && <P2Card cx={1200} y={80} text={L[1].text} f={p.f} at={L[1].at} size={28} maxW={1000} upper={false}/>}
      {L[2] && <P2Card cx={1560} y={650} text={L[2].text} f={p.f} at={L[2].at} size={28} maxW={420} upper={false}/>}
      {L[3] && <P2Card cx={560} y={650} text={L[3].text} f={p.f} at={L[3].at} size={28} maxW={420} upper={false}/>}
      {L[4] && <P2Card cx={1060} y={650} text={L[4].text} f={p.f} at={L[4].at} size={30} maxW={460}/>}
    </>
  );
};
