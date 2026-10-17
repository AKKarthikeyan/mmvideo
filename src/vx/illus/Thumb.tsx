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

// ---------- 7-9: cablerest: a stack of coins, two stacks, a television ----------
// One coin of a stack: (cx, yTop) is the centre of its top face.
const CoinC: React.FC<{cx: number; yTop: number; fill: string; side: string; rx?: number}> = ({cx, yTop, fill, side, rx = 120}) => {
  const ry = 34, h = 40;
  return (
    <g>
      <path d={`M ${cx - rx} ${yTop} L ${cx - rx} ${yTop + h} A ${rx} ${ry} 0 0 0 ${cx + rx} ${yTop + h} L ${cx + rx} ${yTop} Z`} fill={side} stroke={INK} strokeWidth={9}/>
      <ellipse cx={cx} cy={yTop} rx={rx} ry={ry} fill={fill} stroke={INK} strokeWidth={9}/>
    </g>
  );
};

// 7: one stack of coins: the lower coins gold (what subscription covers), the upper ones red (the rest)
const V7: React.FC = () => {
  const cx = 1100, base = 606, step = 42;
  const coins = Array.from({length: 8}, (_, i) => i); // 0 = bottom
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={cx} cy={420} color={T.yellowHi}/>
      <ellipse cx={cx + 14} cy={base + 62} rx={130} ry={26} fill={INK} opacity={0.35}/>
      {coins.map((i) => <CoinC key={i} cx={cx} yTop={base - i * step} fill={i < 5 ? P.gold : P.red} side={i < 5 ? "#C9981C" : "#B63A27"} rx={100}/>)}
      <Big x={50} y={235} size={196} text="WHAT COVERS"/>
      <Big x={50} y={440} size={216} parts={[["THE ", WHITE], ["REST?", P.red]]}/>
    </g>
  );
};

// 8: a short stack against a tall one, the two Den figures over them
const V8: React.FC = () => {
  const base = 620, step = 38;
  const stack = (cx: number, n: number, fill: string, side: string) => Array.from({length: n}, (_, i) => <CoinC key={`${cx}-${i}`} cx={cx} yTop={base - i * step} fill={fill} side={side} rx={112}/>);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={640} cy={420} color={T.yellowHi}/>
      <ellipse cx={540} cy={base + 62} rx={560} ry={26} fill={INK} opacity={0.3}/>
      {stack(215, 4, P.gold, "#C9981C")}
      {stack(850, 8, P.red, "#B63A27")}
      <Big x={215} y={228} size={210} anchor="middle" text="₹86"/>
      <Big x={850} y={228} size={210} anchor="middle" fill={P.red} text="₹162"/>
      <Big x={520} y={400} size={120} anchor="middle" fill={T.sun} text="vs" rot={-4}/>
      <Slab x={1130} y={560} text="DEN" size={96} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
    </g>
  );
};

// 9: a television, and who pays for what is on it
const V9: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={1030} cy={430} color={T.yellowHi}/>
    <g transform="translate(1030 440) rotate(3)">
      <path d="M -40 -150 L -110 -250 M 40 -150 L 110 -250" fill="none" stroke={INK} strokeWidth={14}/>
      <circle cx={-110} cy={-250} r={14} fill={INK}/><circle cx={110} cy={-250} r={14} fill={INK}/>
      <rect x={-170} y={-130} width={374} height={266} rx={34} fill={INK}/>
      <rect x={-190} y={-150} width={374} height={266} rx={34} fill={P.blue} stroke={INK} strokeWidth={11}/>
      <rect x={-160} y={-120} width={246} height={206} rx={18} fill={WHITE} stroke={INK} strokeWidth={9}/>
      <text x={-37} y={58} fontFamily={COND} fontWeight={700} fontSize={220} textAnchor="middle" fill={P.red} stroke={INK} strokeWidth={9} paintOrder="stroke">?</text>
      <circle cx={134} cy={-70} r={19} fill={T.sun} stroke={INK} strokeWidth={8}/>
      <circle cx={134} cy={-14} r={19} fill={WHITE} stroke={INK} strokeWidth={8}/>
      <rect x={-130} y={114} width={46} height={34} fill={INK}/><rect x={86} y={114} width={46} height={34} fill={INK}/>
    </g>
    <Big x={50} y={225} size={200} text="WHO PAYS"/>
    <Big x={50} y={410} size={160} fill={T.sun} text="FOR"/>
    <Big x={50} y={610} size={150} fill={P.red} text="CHANNELS?"/>
  </g>
);

// ---------- 10-12: lombardfloat: a scale, two stacks, an hourglass ----------
// 10: a balance with the waiting money (gold coins) outweighing the insurance loss (a red tag): "insurance loss, still profit?"
const V10: React.FC = () => {
  const px = 985, py = 290, L = 190, th = (9 * Math.PI) / 180, dx = L * Math.cos(th), dy = L * Math.sin(th), drop = 135, pw = 88;
  const lx = px - dx, ly = py - dy + drop, rx = px + dx, ry = py + dy + drop;
  const pan = (cx: number, cy: number) => (
    <g>
      <path d={`M ${cx - pw} ${cy - 6} L ${cx + pw} ${cy - 6} A ${pw} 52 0 0 1 ${cx - pw} ${cy - 6} Z`} fill={INK} transform="translate(8 10)"/>
      <path d={`M ${cx - pw} ${cy - 6} L ${cx + pw} ${cy - 6} A ${pw} 52 0 0 1 ${cx - pw} ${cy - 6} Z`} fill={P.mustard} stroke={INK} strokeWidth={9}/>
    </g>
  );
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={px} cy={430} color={T.yellowHi}/>
      <rect x={px - 150} y={640} width={300} height={34} rx={10} fill={INK}/>
      <rect x={px - 14} y={py} width={28} height={360} fill={INK}/>
      <path d={`M ${px - dx} ${py - dy} L ${lx - pw + 10} ${ly - 6} M ${px - dx} ${py - dy} L ${lx + pw - 10} ${ly - 6} M ${px + dx} ${py + dy} L ${rx - pw + 10} ${ry - 6} M ${px + dx} ${py + dy} L ${rx + pw - 10} ${ry - 6}`} stroke={INK} strokeWidth={6} fill="none"/>
      <line x1={px - dx} y1={py - dy} x2={px + dx} y2={py + dy} stroke={INK} strokeWidth={22}/>
      <circle cx={px} cy={py} r={22} fill={P.gold} stroke={INK} strokeWidth={9}/>
      {pan(lx, ly)}
      {pan(rx, ry)}
      {/* left: the loss, a red tag */}
      <g transform={`translate(${lx} ${ly - 44}) rotate(-8)`}>
        <path d="M -52 -30 L 30 -30 L 58 0 L 30 30 L -52 30 Z" fill={INK} transform="translate(5 6)"/>
        <path d="M -52 -30 L 30 -30 L 58 0 L 30 30 L -52 30 Z" fill={P.red} stroke={INK} strokeWidth={7}/>
        <circle cx={32} cy={0} r={7} fill={T.yellow} stroke={INK} strokeWidth={4}/>
      </g>
      {/* right: the waiting money, gold coins */}
      {[0, 1, 2, 3].map((i) => <CoinC key={i} cx={rx} yTop={ry - 30 - i * 30} fill={P.gold} side="#C9981C" rx={62}/>)}
      <Big x={50} y={150} size={128} text="INSURANCE"/>
      <Big x={50} y={300} size={150} fill={P.red} text="LOSS."/>
      <Big x={50} y={455} size={128} text="STILL"/>
      <Big x={50} y={640} size={178} fill={T.sun} text="PROFIT?"/>
    </g>
  );
};

// 11: a short red stack against a tall gold one, three coins to nine (the loss and the profit are about 1 to 3)
const V11: React.FC = () => {
  const base = 626, step = 38;
  const stack = (cx: number, n: number, fill: string, side: string) => Array.from({length: n}, (_, i) => <CoinC key={`${cx}-${i}`} cx={cx} yTop={base - i * step} fill={fill} side={side} rx={112}/>);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={640} cy={420} color={T.yellowHi}/>
      <ellipse cx={640} cy={base + 62} rx={580} ry={26} fill={INK} opacity={0.3}/>
      {stack(230, 3, P.red, "#B63A27")}
      {stack(900, 9, P.gold, "#C9981C")}
      <Big x={265} y={450} size={170} anchor="middle" fill={P.red} text="−₹318"/>
      <Big x={900} y={235} size={190} anchor="middle" text="₹946"/>
      <Big x={565} y={400} size={120} anchor="middle" fill={T.sun} text="vs" rot={-4}/>
      <Slab x={215} y={100} text="LOMBARD" size={68} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
    </g>
  );
};

// 12: an hourglass of coins: the money that waits ("what is float?")
const V12: React.FC = () => {
  const glass = "M -135 -215 H 135 L 20 0 L 135 215 H -135 L -20 0 Z";
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect width={TW} height={TH} fill={T.yellow}/>
      <Rays cx={1060} cy={420} color={T.yellowHi}/>
      <g transform="translate(1075 392)">
        <path d={glass} fill={INK} transform="translate(12 14)"/>
        <clipPath id="t12-glass"><path d={glass}/></clipPath>
        <path d={glass} fill={WHITE}/>
        <g clipPath="url(#t12-glass)">
          <rect x={-140} y={-120} width={280} height={125} fill={P.gold}/>
          <path d="M -140 215 L -140 120 Q 0 70 140 120 L 140 215 Z" fill={P.gold}/>
          <rect x={-5} y={0} width={10} height={130} fill={P.gold}/>
        </g>
        <path d={glass} fill="none" stroke={INK} strokeWidth={11}/>
        <rect x={-165} y={-250} width={330} height={36} rx={10} fill={P.red} stroke={INK} strokeWidth={9}/>
        <rect x={-165} y={214} width={330} height={36} rx={10} fill={P.red} stroke={INK} strokeWidth={9}/>
        <circle cx={-40} cy={-150} r={26} fill={T.sun} stroke={INK} strokeWidth={7}/>
        <circle cx={30} cy={-120} r={22} fill={T.sun} stroke={INK} strokeWidth={7}/>
      </g>
      <Big x={50} y={240} size={190} text="WHAT IS"/>
      <Big x={50} y={455} size={235} fill={P.red} text="FLOAT?"/>
    </g>
  );
};

// ---------- 13-15: e2egpu: a GPU rack, a rack with one slice pulled out, one tray (the slice) ----------
// The machine is green everywhere in this video: green trays, green lights, ink cabinet.
const GTray: React.FC<{x: number; y: number; w: number; h: number; fill?: string}> = ({x, y, w, h, fill = P.green}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={INK} strokeWidth={8}/>
    {Array.from({length: 6}, (_, i) => <rect key={i} x={x + 26 + i * ((w - 150) / 6)} y={y + h * 0.26} width={(w - 150) / 6 - 16} height={h * 0.48} rx={5} fill="#2B5A38" stroke={INK} strokeWidth={4}/>)}
    <circle cx={x + w - 72} cy={y + h / 2} r={h * 0.13} fill={T.note} stroke={INK} strokeWidth={4}/>
    <circle cx={x + w - 36} cy={y + h / 2} r={h * 0.13} fill={T.sun} stroke={INK} strokeWidth={4}/>
  </g>
);
const GRack: React.FC<{x: number; y: number; w: number; n: number; th: number; gap: number; pull?: number; pullDx?: number}> = ({x, y, w, n, th, gap, pull = -1, pullDx = 0}) => {
  const pad = 22, h = pad * 2 + n * th + (n - 1) * gap;
  return (
    <g>
      <rect x={x + 16} y={y + 18} width={w} height={h} rx={18} fill={INK}/>
      <rect x={x} y={y} width={w} height={h} rx={18} fill="#3A3A3A" stroke={INK} strokeWidth={11}/>
      {Array.from({length: n}, (_, i) => i === pull
        ? <rect key={i} x={x + pad} y={y + pad + i * (th + gap)} width={w - pad * 2} height={th} rx={8} fill={INK}/>
        : <GTray key={i} x={x + pad} y={y + pad + i * (th + gap)} w={w - pad * 2} h={th}/>)}
      <rect x={x + 40} y={y + h} width={34} height={26} fill={INK}/><rect x={x + w - 74} y={y + h} width={34} height={26} fill={INK}/>
      {pull >= 0 ? (
        <g transform={`translate(${pullDx} 0)`}>
          <rect x={x + pad + 12} y={y + pad + pull * (th + gap) + 14} width={w - pad * 2} height={th} rx={8} fill={INK}/>
          <GTray x={x + pad} y={y + pad + pull * (th + gap)} w={w - pad * 2} h={th}/>
        </g>
      ) : null}
    </g>
  );
};

// 13: the whole rack, and where the ₹44 went
const V13: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={1040} cy={400} color={T.yellowHi}/>
    <GRack x={930} y={60} w={300} n={7} th={62} gap={14}/>
    <Big x={50} y={230} size={168} text="WHERE DID"/>
    <Big x={50} y={455} size={215} fill={P.red} text="₹44 GO?"/>
    <Slab x={200} y={600} text="E2E" size={84} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
  </g>
);

// 14: the rack with one tray pulled out: the slice
const V14: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={1010} cy={400} color={T.yellowHi}/>
    <GRack x={930} y={60} w={300} n={7} th={62} gap={14} pull={3} pullDx={-190}/>
    <Big x={50} y={250} size={210} text="TWO"/>
    <Big x={50} y={470} size={165} fill={P.red} text="STORIES?"/>
    <Slab x={200} y={610} text="E2E" size={84} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
  </g>
);

// 15: one tray on its own, big: the slice of the machine
const V15: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={640} cy={520} color={T.yellowHi}/>
    <g transform="translate(250 395) rotate(-4)">
      <rect x={16} y={18} width={780} height={150} rx={14} fill={INK}/>
      <GTray x={0} y={0} w={780} h={150}/>
    </g>
    <Big x={640} y={250} size={180} anchor="middle" parts={[["WHY THE ", WHITE], ["GAP?", P.red]]}/>
    <Slab x={1060} y={630} text="E2E" size={84} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
  </g>
);


// ---------- 16-18: a01moat: the castle with blue water (flat yellow ground, kid-friendly, no number) ----------
const MOATBLUE = "#3E9BE0", GRASS = "#5DB862";
// A sticker castle on its island, ringed by blue water; (x, y) is the middle of the island, k its scale.
const TCastle: React.FC<{x: number; y: number; k?: number; rivals?: boolean}> = ({x, y, k = 1, rivals = true}) => {
  const SW = 10;
  const merl = (x0: number, x1: number, top: number, n: number) => {
    const mw = (x1 - x0) / (n * 2 - 1);
    return Array.from({length: n}, (_, i) => <rect key={i} x={x0 + i * 2 * mw} y={top - 30} width={mw} height={32} fill={WHITE} stroke={INK} strokeWidth={SW}/>);
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
      {/* water ring and its ripples */}
      <ellipse cx={14} cy={78} rx={420} ry={150} fill={INK}/>
      <ellipse cx={0} cy={60} rx={420} ry={150} fill={MOATBLUE} stroke={INK} strokeWidth={SW}/>
      {[[-300, 110, 90], [190, 150, 110], [250, 0, 70], [-260, 10, 60], [-60, 175, 80]].map((r, i) => <path key={i} d={`M ${r[0]} ${r[1]} q ${r[2] / 2} -16 ${r[2]} 0`} fill="none" stroke={WHITE} strokeWidth={9}/>)}
      {/* island */}
      <ellipse cx={0} cy={66} rx={250} ry={78} fill="#B8853F" stroke={INK} strokeWidth={SW}/>
      <ellipse cx={0} cy={50} rx={250} ry={74} fill={GRASS} stroke={INK} strokeWidth={SW}/>
      {/* walls and towers */}
      <rect x={-110} y={-150} width={220} height={190} fill={WHITE} stroke={INK} strokeWidth={SW}/>
      {merl(-110, 110, -150, 4)}
      <rect x={-210} y={-230} width={100} height={270} fill={WHITE} stroke={INK} strokeWidth={SW}/>
      {merl(-222, -98, -230, 3)}
      <rect x={110} y={-230} width={100} height={270} fill={WHITE} stroke={INK} strokeWidth={SW}/>
      {merl(98, 222, -230, 3)}
      <rect x={-62} y={-330} width={124} height={200} fill={WHITE} stroke={INK} strokeWidth={SW}/>
      {merl(-74, 74, -330, 3)}
      <path d="M -10 -175 v -46 a 10 10 0 0 1 20 0 v 46 Z" fill={INK}/>
      <path d="M -170 -120 v -40 a 10 10 0 0 1 20 0 v 40 Z" fill={INK}/><path d="M 150 -120 v -40 a 10 10 0 0 1 20 0 v 40 Z" fill={INK}/>
      <path d="M -46 40 V -40 A 46 46 0 0 1 46 -40 V 40 Z" fill="#C89B5A" stroke={INK} strokeWidth={SW}/>
      {/* flag */}
      <line x1={0} y1={-360} x2={0} y2={-470} stroke={INK} strokeWidth={10}/>
      <path d="M 4 -470 C 50 -490, 80 -440, 140 -458 L 140 -392 C 80 -376, 50 -424, 4 -404 Z" fill={P.red} stroke={INK} strokeWidth={SW}/>
      {/* rivals kept out on the far bank */}
      {rivals ? [-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 500} 120) rotate(${sd * 6})`}><StoreIcon size={150} accent={P.gray}/></g>) : null}
    </g>
  );
};

// 16: what is a moat?
const V16: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={960} cy={420} color={T.yellowHi}/>
    <TCastle x={968} y={500} k={0.72} rivals={false}/>
    <Big x={50} y={235} size={190} text="WHAT IS"/>
    <Big x={50} y={455} size={190} parts={[["A ", WHITE], ["MOAT?", P.red]]}/>
  </g>
);

// 17: what keeps rivals out?
const V17: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={640} cy={520} color={T.yellowHi}/>
    <TCastle x={640} y={605} k={0.6}/>
    <Big x={640} y={150} size={128} anchor="middle" text="WHAT KEEPS"/>
    <Big x={640} y={285} size={128} anchor="middle" fill={P.red} text="RIVALS OUT?"/>
  </g>
);

// 18: moats, explained simply
const V18: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect width={TW} height={TH} fill={T.yellow}/>
    <Rays cx={880} cy={430} color={T.yellowHi}/>
    <TCastle x={930} y={500} k={0.74} rivals={false}/>
    <Big x={50} y={300} size={250} fill={P.red} text="MOATS"/>
    <Slab x={300} y={460} text="EXPLAINED" size={92} fill={INK} color={T.sun} edge={WHITE} rot={-4}/>
    <Slab x={260} y={600} text="SIMPLY" size={92} fill={WHITE} color={INK} rot={3}/>
  </g>
);


export const IllusThumb: React.FC<{v: number}> = ({v}) => {
  useOswald();
  return (
    <AbsoluteFill style={{background: v === 2 ? T.blue : v === 3 ? T.coral : T.yellow}}>
      <VoxFonts/>
      <svg width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`}>
        <VoxDefs/>
        {v === 18 ? <V18/> : v === 17 ? <V17/> : v === 16 ? <V16/> : v === 15 ? <V15/> : v === 14 ? <V14/> : v === 13 ? <V13/> : v === 12 ? <V12/> : v === 11 ? <V11/> : v === 10 ? <V10/> : v === 9 ? <V9/> : v === 8 ? <V8/> : v === 7 ? <V7/> : v === 6 ? <V6/> : v === 5 ? <V5/> : v === 4 ? <V4/> : v === 2 ? <V2/> : v === 3 ? <V3/> : <V1/>}
      </svg>
    </AbsoluteFill>
  );
};
