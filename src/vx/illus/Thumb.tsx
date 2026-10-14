// Thumbnails drawn with the illustration kit (1280 x 720). props: {v: 1 | 2 | 3}
//   1 = the note with a piece torn off ("who took it?")
//   2 = a trolley piled sky-high against one coin
//   3 = 85 new stores and the price tag hanging over them
// Same hand as the video (flat fills, ink outlines, Oswald caps) on brighter grounds: strong tints of the kit palette.
import React from "react";
import {AbsoluteFill, continueRender, delayRender} from "remotion";
import {COND, VoxDefs, VoxFonts} from "../../voxkit";
import {NoteIcon, P, StoreIcon} from "./kit";

const TW = 1280, TH = 720;
const INK = P.ink, WHITE = "#FFFFFF";
const T = {yellow: "#FFC928", yellowHi: "#FFD95C", blue: "#4AA3E8", blueHi: "#66B4EF", coral: "#F4593F", coralHi: "#F77159", note: "#B9E6AC", sun: "#FFD534"};

// Hold the still until Oswald is in, so the type never falls back to Impact.
const useOswald = () => {
  const [h] = React.useState(() => delayRender("oswald"));
  React.useEffect(() => {
    const done = () => continueRender(h);
    const fonts = (document as any).fonts;
    if (fonts && fonts.load) fonts.load("700 120px Oswald").then(done, done); else done();
  }, [h]);
};

// Rough advance widths (em) of Oswald 700 caps, for sizing the blocks behind the type.
const CW: Record<string, number> = {" ": 0.22, I: 0.28, "1": 0.38, ".": 0.24, ",": 0.24, "?": 0.44, "+": 0.5, "%": 0.62, W: 0.72, M: 0.66, T: 0.46, L: 0.43, E: 0.45, F: 0.43, J: 0.32};
const tw = (s: string, size: number) => s.split("").reduce((a, ch) => a + (CW[ch] ?? 0.53) * size, 0);
const pts = (a: number[][]) => a.map((q) => q.join(",")).join(" ");

// Sticker type: fat ink outline and a hard ink drop.
type BigP = {x: number; y: number; size: number; text?: string; parts?: [string, string][]; fill?: string; anchor?: "start" | "middle" | "end"; rot?: number; sw?: number; drop?: number};
const Big: React.FC<BigP> = ({x, y, size, text, parts, fill = WHITE, anchor = "start", rot = 0, sw, drop}) => {
  const w = sw ?? size * 0.12, d = drop ?? size * 0.06;
  const ps: [string, string][] = parts ?? [[text ?? "", fill]];
  const base = {fontFamily: COND, fontWeight: 700, fontSize: size, textAnchor: anchor, stroke: INK, strokeWidth: w, strokeLinejoin: "round" as const};
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <text x={d} y={d} {...base} fill={INK}>{ps.map((p) => p[0]).join("")}</text>
      <text x={0} y={0} {...base} paintOrder="stroke">{ps.map((p, i) => <tspan key={i} fill={p[1]}>{p[0]}</tspan>)}</text>
    </g>
  );
};

// Solid block with type on it; (x, y) is the centre.
const Slab: React.FC<{x: number; y: number; text: string; size: number; fill?: string; color?: string; edge?: string; rot?: number; flat?: boolean}> = ({x, y, text, size, fill = P.red, color = WHITE, edge = INK, rot = 0, flat = false}) => {
  const px = size * 0.3, bw = tw(text, size) + px * 2, bh = size * 1.28;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {flat ? null : <rect x={-bw / 2 + 12} y={-bh / 2 + 14} width={bw} height={bh} rx={10} fill={INK}/>}
      <rect x={-bw / 2} y={-bh / 2} width={bw} height={bh} rx={10} fill={fill} stroke={edge} strokeWidth={10}/>
      <text x={0} y={size * 0.39} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor="middle" fill={color} textLength={bw - px * 2} lengthAdjust="spacingAndGlyphs">{text}</text>
    </g>
  );
};

// Sunburst behind the hero: alternate wedges in a lighter tint of the ground.
const Rays: React.FC<{cx: number; cy: number; color: string; n?: number}> = ({cx, cy, color, n = 14}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const a0 = (i * 2 * Math.PI) / n, a1 = ((i * 2 + 1) * Math.PI) / n, R = 1700;
    return <path key={i} d={`M ${cx} ${cy} L ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} L ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z`} fill={color}/>;
  })}</g>
);

// ---------- 1: the note with a piece torn off ----------
const V1: React.FC = () => {
  const hw = 390, hh = 195;
  const tear = [[262, -hh], [214, -132], [272, -78], [222, -18], [282, 40], [232, 100], [290, 150], [250, hh]];
  const note = [[-hw, -hh], ...tear, [-hw, hh]];
  const piece = [...tear, [hw, hh], [hw, -hh]];
  const NOTE = "translate(420 478) rotate(-6)", ARM = "translate(1004 474) rotate(8)";
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={440} cy={470} color={T.yellowHi}/>
      {/* the note */}
      <g transform={NOTE}>
        <polygon points={pts(note)} fill={INK} transform="translate(14 16)"/>
        <polygon points={pts(note)} fill={T.note} stroke={INK} strokeWidth={11}/>
        <clipPath id="t1-note"><polygon points={pts(note)}/></clipPath>
        <g clipPath="url(#t1-note)"><rect x={-hw + 28} y={-hh + 28} width={hw * 2 - 56} height={hh * 2 - 56} rx={6} fill="none" stroke={INK} strokeWidth={5} opacity={0.45}/></g>
        <text x={-75} y={92} fontFamily={COND} fontWeight={700} fontSize={236} textAnchor="middle" fill={INK}>₹100</text>
      </g>
      {/* the arm that took it: plain sleeve (no burglar stripes: the answer in the video is ordinary costs, not theft), white cuff and glove */}
      <g transform={ARM}>
        <clipPath id="t1-sleeve"><rect x={110} y={-76} width={420} height={152}/></clipPath>
        <rect x={110} y={-76} width={420} height={152} fill={P.blue}/>
        <rect x={110} y={-76} width={420} height={152} fill="none" stroke={INK} strokeWidth={10}/>
        <rect x={72} y={-94} width={58} height={188} rx={16} fill={WHITE} stroke={INK} strokeWidth={10}/>
        <rect x={-60} y={-92} width={158} height={184} rx={56} fill={WHITE} stroke={INK} strokeWidth={10}/>
      </g>
      {/* the torn piece, pulled away */}
      <g transform={`${NOTE} translate(125 35) rotate(14 320 0)`}>
        <polygon points={pts(piece)} fill={INK} transform="translate(12 14)"/>
        <polygon points={pts(piece)} fill={T.note} stroke={INK} strokeWidth={11}/>
        <clipPath id="t1-piece"><polygon points={pts(piece)}/></clipPath>
        <g clipPath="url(#t1-piece)"><rect x={-hw + 28} y={-hh + 28} width={hw * 2 - 56} height={hh * 2 - 56} rx={6} fill="none" stroke={INK} strokeWidth={5} opacity={0.45}/></g>
      </g>
      {/* four fingers closed over the piece */}
      <g transform={ARM}>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-142 - (i === 0 || i === 3 ? -14 : 0)} y={-93 + i * 46} width={140 - (i === 0 || i === 3 ? 14 : 0)} height={48} rx={24} fill={WHITE} stroke={INK} strokeWidth={9}/>)}
      </g>
      {/* rip marks in the gap */}
      {[-108, -68, -28].map((a, i) => { const c = Math.cos((a * Math.PI) / 180), sn = Math.sin((a * Math.PI) / 180); return <line key={i} x1={722 + 30 * c} y1={300 + 30 * sn} x2={722 + 82 * c} y2={300 + 82 * sn} stroke={INK} strokeWidth={10}/>; })}
      <Big x={640} y={196} size={200} anchor="middle" parts={[["WHO TOOK ", WHITE], ["IT?", P.red]]}/>
      <Slab x={198} y={640} text="DMART" size={90} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
    </g>
  );
};

// ---------- 2: the piled trolley against one coin ----------
const V2: React.FC = () => {
  // x, y (top-left), w, h, fill, tilt: listed from the top of the pile down
  const boxes: [number, number, number, number, string, number][] = [
    [226, -80, 182, 116, P.mustard, -3], [410, -90, 150, 112, WHITE, 3],
    [252, 32, 178, 112, P.red, 4], [432, 18, 142, 112, P.green, -2],
    [186, 140, 172, 112, WHITE, -4], [360, 126, 182, 112, P.mustard, 2],
    [214, 248, 188, 114, P.green, 3], [404, 234, 152, 118, WHITE, -3],
    [172, 358, 180, 122, P.mustard, -2], [356, 346, 192, 134, P.red, 2],
  ];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.blue}/>
      <Rays cx={370} cy={420} color={T.blueHi}/>
      <rect x={0} y={694} width={TW} height={26} fill={P.blue}/><line x1={0} y1={694} x2={TW} y2={694} stroke={INK} strokeWidth={9}/>
      {/* the pile */}
      <g transform="rotate(2.5 362 470)">{boxes.map(([x, y, w, h, fill, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={INK} strokeWidth={10}/>
          <rect x={x + w / 2 - 15} y={y} width={30} height={h} fill={INK} opacity={0.16}/>
          <line x1={x + 22} y1={y + h - 26} x2={x + 62} y2={y + h - 26} stroke={INK} strokeWidth={7} opacity={0.6}/>
        </g>
      ))}</g>
      {/* the trolley */}
      <path d="M 58 392 L 106 392 L 140 470" fill="none" stroke={INK} strokeWidth={20}/>
      <path d="M 138 470 L 586 470 L 544 612 L 182 612 Z" fill={WHITE} stroke={INK} strokeWidth={11}/>
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={206 + i * 62} y1={476} x2={222 + i * 54} y2={606} stroke={INK} strokeWidth={6} opacity={0.75}/>)}
      <path d="M 206 612 L 222 650 L 512 650 L 520 612" fill="none" stroke={INK} strokeWidth={12}/>
      {[236, 500].map((x) => <g key={x}><circle cx={x} cy={666} r={27} fill={INK}/><circle cx={x} cy={666} r={9} fill={P.gray}/></g>)}
      <Slab x={362} y={541} text="DMART" size={66} fill={INK} color={WHITE} edge={INK} flat/>
      {/* the coin it leaves */}
      <g transform="translate(790 618)">
        <circle cx={9} cy={11} r={66} fill={INK}/>
        <circle r={66} fill={P.gold} stroke={INK} strokeWidth={10}/>
        <circle r={47} fill="none" stroke={INK} strokeWidth={5} opacity={0.5}/>
        <text y={30} fontFamily={COND} fontWeight={700} fontSize={84} textAnchor="middle" fill={INK}>₹</text>
      </g>
      {[[706, 560, -140], [690, 610, 180], [760, 530, -100]].map(([x, y, a], i) => <line key={i} x1={x} y1={y} x2={x + 34 * Math.cos((a * Math.PI) / 180)} y2={y + 34 * Math.sin((a * Math.PI) / 180)} stroke={WHITE} strokeWidth={10}/>)}
      {/* arrow from the words to the coin */}
      <path d="M 1076 430 Q 1092 622 960 622" fill="none" stroke={INK} strokeWidth={48}/>
      <polygon points="876,622 966,560 966,684" fill={INK} stroke={INK} strokeWidth={22}/>
      <path d="M 1076 430 Q 1092 622 960 622" fill="none" stroke={P.red} strokeWidth={26}/>
      <polygon points="876,622 966,560 966,684" fill={P.red}/>
      <Big x={1240} y={190} size={178} anchor="end" text="ALL THIS"/>
      <Slab x={930} y={338} text="FOR THIS?" size={138} fill={T.sun} color={INK} rot={-3}/>
    </g>
  );
};

// ---------- 3: 85 new stores and the price tag ----------
const V3: React.FC = () => {
  const tag = [[-88, -200], [88, -200], [222, -92], [222, 200], [-222, 200], [-222, -92]];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.coral}/>
      <Rays cx={240} cy={210} color={T.coralHi}/>
      {/* a street of new stores running off both edges */}
      {Array.from({length: 6}, (_, i) => <g key={i}><StoreIcon x={105 + i * 214} y={610} size={220} accent={P.mustard}/>
        <rect x={105 + i * 214 - 42} y={522} width={84} height={13} rx={6} fill={WHITE}/></g>)}
      <rect x={0} y={702} width={TW} height={18} fill={INK}/>
      <Big x={52} y={322} size={350} fill={T.sun} text="85"/>
      <Big x={54} y={462} size={120} text="NEW STORES"/>
      <Slab x={600} y={104} text="DMART" size={82} fill={INK} color={WHITE} edge={WHITE} rot={3}/>
      {/* the price tag */}
      <path d="M 1036 -12 Q 1044 60 1001 124" fill="none" stroke={INK} strokeWidth={9}/>
      <g transform="translate(990 262) rotate(5)">
        <polygon points={pts(tag)} fill={INK} transform="translate(14 16)"/>
        <polygon points={pts(tag)} fill={WHITE} stroke={INK} strokeWidth={11}/>
        <circle cx={0} cy={-146} r={22} fill={T.coral} stroke={INK} strokeWidth={9}/>
        <text x={0} y={28} fontFamily={COND} fontWeight={700} fontSize={160} textAnchor="middle" fill={INK}>WHO</text>
        <text x={0} y={172} fontFamily={COND} fontWeight={700} fontSize={150} textAnchor="middle" fill={P.red}>PAYS?</text>
      </g>
    </g>
  );
};

// ---------- 4: amckeeps: the note with a thin slice cut off ("who gave way?") ----------
const V4: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={840} cy={520} color={T.yellowHi}/>
    <Big x={640} y={190} size={200} anchor="middle" text="WHO GAVE"/>
    <g transform="translate(800 565) rotate(-5) scale(0.82)">
      <clipPath id="t4-main"><rect x={-340} y={-190} width={578} height={380}/></clipPath>
      <clipPath id="t4-slice"><rect x={238} y={-190} width={120} height={380}/></clipPath>
      <rect x={-298} y={-136} width={536} height={304} rx={20} fill={INK}/>
      <g clipPath="url(#t4-main)"><NoteIcon size={400} label="₹100"/></g>
      <g transform="translate(78 40) rotate(11 238 0)">
        <rect x={252} y={-136} width={74} height={304} fill={INK}/>
        <g clipPath="url(#t4-slice)"><NoteIcon size={400} label="₹100"/></g>
      </g>
    </g>
    <Big x={60} y={430} size={250} fill={P.red} text="WAY?" rot={-3}/>
  </g>
);

// ---------- 5: amckeeps: one coin with a wedge pulled out ("only 53 paise") ----------
const V5: React.FC = () => {
  const cx = 900, cy = 430, R = 250, a0 = (-24 * Math.PI) / 180, a1 = (6 * Math.PI) / 180;
  const pt = (a: number) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
  const body = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 1 1 ${x0} ${y0} Z`;
  const wedge = `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} Z`;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={cx} cy={cy} color={T.yellowHi}/>
      <path d={body} fill={INK} transform="translate(14 16)"/>
      <path d={body} fill={P.gold} stroke={INK} strokeWidth={11}/>
      <circle cx={cx} cy={cy} r={196} fill="none" stroke={INK} strokeWidth={6} opacity={0.4} strokeDasharray="1 0" clipPath="url(#t5-clip)"/>
      <clipPath id="t5-clip"><path d={body}/></clipPath>
      <text x={cx - 20} y={cy + 100} fontFamily={COND} fontWeight={700} fontSize={300} textAnchor="middle" fill={INK}>₹</text>
      <g transform="translate(100 -16)">
        <path d={wedge} fill={INK} transform="translate(10 12)"/>
        <path d={wedge} fill={P.gold} stroke={INK} strokeWidth={11}/>
      </g>
      <Big x={60} y={190} size={170} text="ONLY"/>
      <Big x={50} y={480} size={330} text="53"/>
      <Big x={60} y={640} size={150} fill={P.red} text="PAISE?"/>
    </g>
  );
};

// ---------- 6: amckeeps: the seller, one figure ("who pays the seller?") ----------
const V6: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={230} cy={470} color={T.yellowHi}/>
    <g transform="translate(195 525) scale(4.1)">
      <g transform="translate(2.6 3)"><circle cx={0} cy={-28} r={15} fill={INK}/><path d="M -26 40 v -22 a 26 26 0 0 1 52 0 v 22 Z" fill={INK}/></g>
      <circle cx={0} cy={-28} r={15} fill={P.purple} stroke={INK} strokeWidth={2}/>
      <path d="M -26 40 v -22 a 26 26 0 0 1 52 0 v 22 Z" fill={P.purple} stroke={INK} strokeWidth={2}/>
    </g>
    <Big x={1240} y={200} size={190} anchor="end" text="WHO PAYS"/>
    <Big x={1240} y={400} size={190} anchor="end" text="THE"/>
    <Big x={1240} y={640} size={250} anchor="end" fill={P.red} text="SELLER?" rot={-2}/>
  </g>
);

export const IllusThumb: React.FC<{v: number}> = ({v}) => {
  useOswald();
  return (
    <AbsoluteFill style={{background: v === 2 ? T.blue : v === 3 ? T.coral : T.yellow}}>
      <VoxFonts/>
      <svg width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`}>
        <VoxDefs/>
        {v === 6 ? <V6/> : v === 5 ? <V5/> : v === 4 ? <V4/> : v === 2 ? <V2/> : v === 3 ? <V3/> : <V1/>}
      </svg>
    </AbsoluteFill>
  );
};
