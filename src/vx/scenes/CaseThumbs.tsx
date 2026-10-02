// The Moat Files thumbnails (1280x720), code-drawn. Rules: one focal image, <=3 huge words, readable at
// phone-feed size (~320 px wide), high contrast (black / crime-tape yellow / red / white), a curiosity gap
// the title answers. No real-person likeness: anonymous silhouettes only.
import React from "react";
import {AbsoluteFill, Still, staticFile} from "remotion";
import {VoxFonts} from "../../voxkit";

const K = {bg: "#101010", yel: "#FFD21F", red: "#E3261B", white: "#FFFFFF", paper: "#EFE6D2", gray: "#6B6B6B"};
const F = "Oswald, Impact, 'Arial Narrow', sans-serif";
const Base: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: K.bg}}><VoxFonts/>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
      <defs>
        <radialGradient id="spot" cx="70%" cy="45%" r="60%"><stop offset="0" stopColor="#3a3a3a"/><stop offset="1" stopColor="#101010"/></radialGradient>
        <filter id="sh"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.7"/></filter>
      </defs>
      <rect width={1280} height={720} fill="url(#spot)"/>
      {children}
    </svg>
  </AbsoluteFill>
);
// crime-scene tape across the frame
const Tape: React.FC<{y: number; rot: number; text?: string}> = ({y, rot, text = "CRIME SCENE · DO NOT CROSS · "}) => (
  <g transform={`rotate(${rot} 640 ${y})`}>
    <rect x={-200} y={y - 38} width={1700} height={76} fill={K.yel} filter="url(#sh)"/>
    <text x={-180} y={y + 16} fontFamily={F} fontWeight={700} fontSize={44} letterSpacing={3} fill={K.bg}>{text.repeat(5)}</text>
  </g>
);
const Word: React.FC<{x: number; y: number; t: string; size: number; fill?: string; anchor?: "start" | "middle" | "end"}> = ({x, y, t, size, fill = K.white, anchor = "start"}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={F} fontWeight={700} fontSize={size} fill={fill} stroke={K.bg} strokeWidth={size / 14} paintOrder="stroke" filter="url(#sh)">{t}</text>
);
const person = (x: number, y: number, s: number, knock = false) =>
  `M${x - 34 * s} ${y - 250 * s} h${68 * s} l${10 * s} ${22 * s} h${-88 * s} z M${x - 26 * s} ${y - 284 * s} q${26 * s} ${-14 * s} ${52 * s} 0 v${36 * s} h${-52 * s} z ` +
  `M${x} ${y - 226 * s} a${34 * s} ${40 * s} 0 1 0 0.1 0 z M${x - 70 * s} ${y} C${x - 80 * s} ${y - 120 * s} ${x - 60 * s} ${y - 150 * s} ${x} ${y - 150 * s} C${x + 60 * s} ${y - 150 * s} ${x + 80 * s} ${y - 120 * s} ${x + 70 * s} ${y} z ` +
  (knock ? `M${x + 40 * s} ${y - 140 * s} L${x + 150 * s} ${y - 230 * s} L${x + 172 * s} ${y - 210 * s} L${x + 62 * s} ${y - 110 * s} z M${x + 176 * s} ${y - 222 * s} a${22 * s} ${22 * s} 0 1 0 0.1 0 z` : "");

// T1 · "DIED TWICE?" — a tombstone that says GEICO, crime tape, one huge question
const T1: React.FC = () => (
  <Base>
    <g filter="url(#sh)">
      <path d="M800 690 V330 a200 200 0 0 1 400 0 V690 Z" fill="#8A8A8A" stroke={K.bg} strokeWidth={8}/>
      <text x={1000} y={380} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={50} fill={K.bg}>R.I.P.</text>
      <text x={1000} y={480} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={104} fill={K.bg}>GEICO</text>
      <text x={1000} y={545} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={48} fill={K.bg}>1936 – ?</text>
      <path d="M1110 190 l-25 60 l35 45 l-30 40" fill="none" stroke={K.bg} strokeWidth={8}/>
    </g>
    <Word x={60} y={230} t="IT DIED" size={190}/>
    <Word x={60} y={440} t="TWICE?" size={230} fill={K.yel}/>
    <g transform="rotate(-8 330 560)"><rect x={60} y={515} width={500} height={100} fill={K.red} filter="url(#sh)"/>
      <text x={310} y={590} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={70} fill={K.white}>STOCK −95%</text></g>
    <Tape y={690} rot={-3}/>
  </Base>
);

// T2 · "$ BILLIONS" — the knock: silhouette at a locked door, money behind it
const T2: React.FC = () => (
  <Base>
    <rect x={840} y={80} width={380} height={640} fill="#2A2A2A" stroke={K.white} strokeWidth={10} filter="url(#sh)"/>
    <rect x={865} y={105} width={160} height={590} fill="#1b1b1b" stroke={K.gray} strokeWidth={3}/><rect x={1035} y={105} width={160} height={590} fill="#1b1b1b" stroke={K.gray} strokeWidth={3}/>
    <g transform="rotate(-5 1030 250)"><rect x={920} y={210} width={220} height={90} fill={K.white}/><text x={1030} y={275} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={60} fill={K.red}>CLOSED</text></g>
    <path d={person(760, 760, 1.75, true)} fill={K.bg} stroke={K.yel} strokeWidth={8} filter="url(#sh)"/>
    <Word x={40} y={170} t="1 KNOCK." size={150} fill={K.white}/>
    <Word x={40} y={320} t="$BILLIONS" size={128} fill={K.yel}/>
    <g transform="rotate(-6 250 420)"><rect x={40} y={380} width={390} height={80} fill={K.red} filter="url(#sh)"/>
      <text x={235} y={440} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={56} fill={K.white}>SATURDAY, 1951</text></g>
  </Base>
);

// T3 · "INSIDE JOB" — magnifying glass on a crime board, the culprit card circled
const T3: React.FC = () => (
  <Base>
    <rect x={640} y={40} width={610} height={640} fill="#A08C63" stroke={K.bg} strokeWidth={10} filter="url(#sh)"/>
    {[[760, 150], [1140, 150], [760, 560], [1140, 560]].map(([x, y], i) => <line key={i} x1={950} y1={360} x2={x} y2={y} stroke={K.red} strokeWidth={8}/>)}
    {[[760, 150, "RIVALS?"], [1140, 150, "REGULATORS?"], [760, 560, "ECONOMY?"]].map(([x, y, t]) => <g key={String(t)}>
      <rect x={Number(x) - 120} y={Number(y) - 45} width={240} height={90} fill={K.paper}/><text x={Number(x)} y={Number(y) + 16} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={40} fill={K.bg}>{t}</text>
      <line x1={Number(x) - 110} y1={Number(y) - 35} x2={Number(x) + 110} y2={Number(y) + 35} stroke={K.red} strokeWidth={10}/></g>)}
    <rect x={820} y={290} width={260} height={140} fill={K.paper}/><text x={950} y={385} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={80} fill={K.bg}>GEICO</text>
    <g filter="url(#sh)"><circle cx={1140} cy={560} r={115} fill="rgba(255,255,255,0.15)" stroke={K.yel} strokeWidth={22}/>
      <line x1={1060} y1={650} x2={960} y2={740} stroke={K.yel} strokeWidth={34} strokeLinecap="round"/>
      <text x={1140} y={590} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={96} fill={K.red}>?</text></g>
    <Word x={40} y={240} t="INSIDE" size={185}/>
    <Word x={40} y={470} t="JOB." size={250} fill={K.yel}/>
    <g transform="rotate(-6 250 600)"><rect x={40} y={560} width={460} height={90} fill={K.red} filter="url(#sh)"/>
      <text x={270} y={625} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={58} fill={K.white}>WHO KILLED GEICO?</text></g>
  </Base>
);

export const CaseThumbStills: React.FC = () => (
  <>
    <Still id="MFT-mf001-geico-1" component={T1} width={1280} height={720}/>
    <Still id="MFT-mf001-geico-2" component={T2} width={1280} height={720}/>
    <Still id="MFT-mf001-geico-3" component={T3} width={1280} height={720}/>
  </>
);

// photo thumbnails: an illustration plate, darkened on the left, 2-3 huge words, one red tag
const PhotoThumb: React.FC<{vid: string; img: string; l1: string; l2: string; tag: string; ring?: [number, number]; shift?: number; zoom?: number}> = ({vid, img, l1, l2, tag, ring, shift = 0, zoom = 1}) => (
  <AbsoluteFill style={{background: K.bg}}><VoxFonts/>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
      <defs><linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity="0.92"/><stop offset="0.55" stopColor="#000" stopOpacity="0.45"/><stop offset="1" stopColor="#000" stopOpacity="0"/></linearGradient>
        <filter id="sh"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.7"/></filter></defs>
      <g transform={`translate(${shift} 0) translate(640 360) scale(${zoom}) translate(-640 -360)`}><image href={staticFile(`vx/${vid}/img/${img}.jpeg`)} x={0} y={0} width={1280} height={720} preserveAspectRatio="xMaxYMid slice"/></g>
      <rect width={1280} height={720} fill="url(#fadeL)"/>
      {ring && <g filter="url(#sh)"><circle cx={ring[0]} cy={ring[1]} r={120} fill="none" stroke={K.yel} strokeWidth={20}/>
        <line x1={ring[0] - 90} y1={ring[1] + 90} x2={ring[0] - 190} y2={ring[1] + 190} stroke={K.yel} strokeWidth={32} strokeLinecap="round"/></g>}
      <Word x={40} y={250} t={l1} size={l1.length > 8 ? 150 : 190}/>
      <Word x={40} y={470} t={l2} size={200} fill={K.yel}/>
      <g transform="rotate(-6 250 590)"><rect x={40} y={545} width={Math.max(360, tag.length * 32 + 60)} height={90} fill={K.red} filter="url(#sh)"/>
        <text x={70} y={610} fontFamily={F} fontWeight={700} fontSize={58} fill={K.white}>{tag}</text></g>
    </svg>
  </AbsoluteFill>
);
export const PhotoThumbStills: React.FC = () => (
  <>
    <Still id="MFT-mf002-sees-1" component={PhotoThumb as any} defaultProps={{vid: "mf002-sees", img: "chocolates_box", l1: "$25M", l2: "→ $1.9B", tag: "FROM A CANDY SHOP?"}} width={1280} height={720}/>
    <Still id="MFT-mf002-sees-2" component={PhotoThumb as any} defaultProps={{vid: "mf002-sees", img: "boardroom1972", l1: "HE ALMOST", l2: "WALKED AWAY", tag: "OVER $5 MILLION"}} width={1280} height={720}/>
    <Still id="MFT-mf002-sees-3" component={PhotoThumb as any} defaultProps={{vid: "mf002-sees", img: "scale", l1: "THE SECRET", l2: "RECIPE?", tag: "PRICE ×6.6 · POUNDS ×1.9", ring: [810, 425], shift: 330, zoom: 1.35}} width={1280} height={720}/>
    <Still id="MFT-mf003-textile-1" component={PhotoThumb as any} defaultProps={{vid: "mf003-textile", img: "mill_town", l1: "HE BOUGHT IT", l2: "IN ANGER", tag: "“MONUMENTALLY STUPID”"}} width={1280} height={720}/>
    <Still id="MFT-mf003-textile-2" component={PhotoThumb as any} defaultProps={{vid: "mf003-textile", img: "scrap", l1: "$5,000", l2: "→ $26", tag: "SOLD FOR SCRAP"}} width={1280} height={720}/>
    <Still id="MFT-mf003-textile-3" component={PhotoThumb as any} defaultProps={{vid: "mf003-textile", img: "cigar", l1: "A 12.5¢", l2: "GRUDGE", tag: "BUFFETT, 1964"}} width={1280} height={720}/>
    <Still id="MFT-mf004-amex-1" component={PhotoThumb as any} defaultProps={{vid: "mf004-amex", img: "tank_farm", l1: "FULL OF", l2: "WATER?", tag: "THE $180M SWINDLE"}} width={1280} height={720}/>
    <Still id="MFT-mf004-amex-2" component={PhotoThumb as any} defaultProps={{vid: "mf004-amex", img: "steakhouse", l1: "HE WATCHED", l2: "DINERS", tag: "BUFFETT'S STAKEOUT"}} width={1280} height={720}/>
    <Still id="MFT-mf004-amex-3" component={PhotoThumb as any} defaultProps={{vid: "mf004-amex", img: "partner_letter", l1: "40% IN", l2: "ONE STOCK", tag: "RIGHT AFTER A SCANDAL"}} width={1280} height={720}/>
    <Still id="MFT-mf005-nfm-1" component={PhotoThumb as any} defaultProps={{vid: "mf005-nfm", img: "carpet_rolls", l1: "$500 VS", l2: "EVERYONE", tag: "NO RIVAL LEFT STANDING"}} width={1280} height={720}/>
    <Still id="MFT-mf005-nfm-2" component={PhotoThumb as any} defaultProps={{vid: "mf005-nfm", img: "court_omaha", l1: "ON TRIAL", l2: "FOR CHEAP", tag: "THEN SOLD THE JUDGE CARPET"}} width={1280} height={720}/>
    <Still id="MFT-mf005-nfm-3" component={PhotoThumb as any} defaultProps={{vid: "mf005-nfm", img: "mega_store", l1: "WRESTLE", l2: "GRIZZLIES?", tag: "BUFFETT ON MRS. B"}} width={1280} height={720}/>
    <Still id="MFT-mf006-buffalo-1" component={PhotoThumb as any} defaultProps={{vid: "mf006-buffalo", img: "two_trucks", l1: "ONLY ONE", l2: "SURVIVES", tag: "BUFFETT'S NEWSPAPER WAR"}} width={1280} height={720}/>
    <Still id="MFT-mf006-buffalo-2" component={PhotoThumb as any} defaultProps={{vid: "mf006-buffalo", img: "court_appeal", l1: "17 MONTHS", l2: "OF HELL", tag: "“ALL HELL BROKE LOOSE”"}} width={1280} height={720}/>
    <Still id="MFT-mf006-buffalo-3" component={PhotoThumb as any} defaultProps={{vid: "mf006-buffalo", img: "tv_glow", l1: "WON THE WAR", l2: "LOST THE ERA", tag: "THE MOAT THAT DISSOLVED"}} width={1280} height={720}/>
    <Still id="MFT-mf007-coke-1" component={PhotoThumb as any} defaultProps={{vid: "mf007-coke", img: "boy_bottles", l1: "52 YEARS", l2: "TOO LATE?", tag: "THEN $1 BILLION"}} width={1280} height={720}/>
    <Still id="MFT-mf007-coke-2" component={PhotoThumb as any} defaultProps={{vid: "mf007-coke", img: "castle_moat", l1: "THE MOAT", l2: "SENTENCE", tag: "BUFFETT ON COKE, 1993"}} width={1280} height={720}/>
    <Still id="MFT-mf007-coke-3" component={PhotoThumb as any} defaultProps={{vid: "mf007-coke", img: "analyst_1938", l1: "“TOO LATE”", l2: "IN 1938?", tag: "THEN IT GREW 50×"}} width={1280} height={720}/>
    <Still id="MFT-mf008-costco-1" component={PhotoThumb as any} defaultProps={{vid: "mf008-costco", img: "jeans_stack", l1: "HE SAID", l2: "NO.", tag: "TO AN EASY 50% MARK-UP"}} width={1280} height={720}/>
    <Still id="MFT-mf008-costco-2" component={PhotoThumb as any} defaultProps={{vid: "mf008-costco", img: "warehouse_aisle", l1: "$5 FOR YOU", l2: "$1 FOR IT", tag: "THE COSTCO MOAT"}} width={1280} height={720}/>
    <Still id="MFT-mf008-costco-3" component={PhotoThumb as any} defaultProps={{vid: "mf008-costco", img: "framed_memo", l1: "THE 1967", l2: "MEMO", tag: "FRAMED ON A FUND'S WALL"}} width={1280} height={720}/>
    <Still id="MFT-mf009-walmart-1" component={PhotoThumb as any} defaultProps={{vid: "mf009-walmart", img: "fund_office", l1: "THEY SOLD", l2: "WAL-MART", tag: "THEIR BIGGEST MISTAKE?"}} width={1280} height={720}/>
    <Still id="MFT-mf009-walmart-2" component={PhotoThumb as any} defaultProps={{vid: "mf009-walmart", img: "store_night", l1: "1,500×", l2: "STILL CHEAP", tag: "WAL-MART, 1972"}} width={1280} height={720}/>
    <Still id="MFT-mf009-walmart-3" component={PhotoThumb as any} defaultProps={{vid: "mf009-walmart", img: "two_paths", l1: "SOLD", l2: "TOO EARLY", tag: "WHY SMART PEOPLE DO IT"}} width={1280} height={720}/>
    <Still id="MFT-mf010-dexter-1" component={PhotoThumb as any} defaultProps={{vid: "mf010-dexter", img: "shoe_factory", l1: "$433M →", l2: "$6 BILLION", tag: "BUFFETT'S WORST DEAL"}} width={1280} height={720}/>
    <Still id="MFT-mf010-dexter-2" component={PhotoThumb as any} defaultProps={{vid: "mf010-dexter", img: "share_certificate", l1: "HE PAID", l2: "IN SHARES", tag: "THE $6 BILLION MISTAKE"}} width={1280} height={720}/>
    <Still id="MFT-mf010-dexter-3" component={PhotoThumb as any} defaultProps={{vid: "mf010-dexter", img: "maine_town", l1: "“DIDN'T SEE", l2: "IT COMING”", tag: "WARREN BUFFETT, 2014"}} width={1280} height={720}/>
  </>
);
