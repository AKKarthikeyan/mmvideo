// ECO-16 Part 1, builder E1: backgrounds. StreetBG (an Indian market street in morning light: hazy far skyline, shopfronts, background stalls, bunting, a drifting
// auto-rickshaw, paved ground with long shadows) and ShopBG (a small provision shop interior with shelves, a hanging bulb, a window and a wooden counter).
import React from "react";
import {SANS, SERIF, W, H, rng} from "../kit";
import {Cloud, Sun, Hills, Tree} from "./analogy_kit";
import {Adult, Awning, FruitPile, E1Defs, type Look} from "./analogy_e1_kit";

const SHOP_COL = ["#e3b27a", "#c9776a", "#9fb59a", "#e8cf8f", "#8fa6bd", "#d98f5c", "#b9a0c4"];

export const Auto: React.FC<{x: number; y: number; s?: number; f?: number; op?: number}> = ({x, y, s = 1, f = 0, op = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <ellipse cx={0} cy={4} rx={92} ry={9} fill="#2a1808" opacity={0.28}/>
    <path d="M-86,-8 L-86,-46 Q-82,-58 -62,-60 L40,-60 Q70,-56 84,-30 L88,-8 Z" fill="#f3c63a" stroke="#7a5a10" strokeWidth={2}/>
    <path d="M-86,-8 L88,-8 L88,-22 L-86,-22 Z" fill="#2c3a34"/>
    <path d="M-64,-60 Q-60,-112 -20,-112 L28,-112 Q50,-108 62,-62 Z" fill="#2c4a3c" stroke="#162820" strokeWidth={2}/>
    <path d="M-50,-62 Q-46,-100 -18,-100 L24,-100 Q40,-96 50,-64 Z" fill="#a9d6e8" opacity={0.85}/>
    <rect x={-6} y={-100} width={5} height={38} fill="#2c4a3c"/>
    <circle cx={86} cy={-22} r={6} fill="#fff6c8" stroke="#7a5a10" strokeWidth={1.4}/>
    {[-52, 56].map((cx) => <g key={cx} transform={`translate(${cx} 0) rotate(${f * 14})`}><circle r={16} fill="#1c1c1e"/><circle r={8} fill="#8c8c92"/><path d="M-14,0 H14 M0,-14 V14" stroke="#4a4a50" strokeWidth={2}/></g>)}
    <path d="M-86,-46 Q-82,-58 -62,-60" stroke="#fff" strokeWidth={2} opacity={0.4} fill="none"/>
  </g>
);

const Sign: React.FC<{x: number; y: number; w: number; text: string; bg: string; fg?: string}> = ({x, y, w, text, bg, fg = "#fff6e4"}) => (
  <g>
    <rect x={x} y={y} width={w} height={34} rx={4} fill={bg} stroke="#00000040" strokeWidth={1.4}/>
    <text x={x + w / 2} y={y + 25} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={21} letterSpacing="0.16em" fill={fg}>{text}</text>
  </g>
);

export const StreetBG: React.FC<{f: number; dur: number; variant?: "fruit" | "lane" | "velocity"; sun?: [number, number]}> = ({f, dur, variant = "fruit", sun = [300, 190]}) => {
  const g = rng(variant === "lane" ? 41 : variant === "velocity" ? 59 : 23), sway = Math.sin(f / 26);
  const SIGNS = ["TEA", "SWEETS", "PROVISIONS", "TAILOR", "MEDICALS", "BAKERY", "STORES"];
  const mid = Array.from({length: 7}, (_, i) => ({x: -50 + i * 300 + g() * 20, w: 270 + g() * 30, top: 270 + g() * 90, c: SHOP_COL[(i + (variant === "lane" ? 3 : 0)) % SHOP_COL.length], sg: SIGNS[(i + (variant === "velocity" ? 2 : 0)) % SIGNS.length], sgc: ["#2a6fb8", "#b23a48", "#2f7a4a", "#8a5a1c", "#6a3a8a"][i % 5]}));
  const par = (k: number) => Math.sin((f / Math.max(1, dur)) * 3) * k;
  return (
    <g>
      <E1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#e1-sky)"/>
      <Sun x={sun[0]} y={sun[1]} r={46} f={f} glow={0.9}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={380 + i * 640} y={130 + (i % 2) * 70} s={0.7} f={f} speed={0.12} seed={i + 11} a={0.7}/>)}
      {/* far skyline: hazy pale blue, a tiered temple tower and palms */}
      <g transform={`translate(${par(-6)} 0)`} opacity={0.9}>
        <Hills id="e1h1" base={560} amp={40} top="#b9cbdd" bottom="#d6dfe0" seed={2.4} wl={300}/>
        {Array.from({length: 11}, (_, i) => { const x = i * 190 - 40 + g() * 30, w = 120 + g() * 50, t = 400 + g() * 110; return (
          <g key={i} fill="#b4c4d4" opacity={0.85}><rect x={x} y={t} width={w} height={640 - t}/>
            {Array.from({length: 3}, (_, r) => Array.from({length: 3}, (_, c) => <rect key={`${r}${c}`} x={x + 14 + c * (w - 28) / 3} y={t + 20 + r * 34} width={14} height={18} fill="#9fb2c6"/>))}</g>); })}
        <g fill="#a9bacb" transform="translate(1480 640)">{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-92 + i * 12},${-i * 38} L${92 - i * 12},${-i * 38} L${80 - i * 12},${-(i + 1) * 38} L${-80 + i * 12},${-(i + 1) * 38} Z`}/>)}<rect x={-6} y={-262} width={12} height={22}/></g>
        <Tree x={110} y={650} s={0.9} f={f} seed={4} hue={10}/><Tree x={1780} y={650} s={0.85} f={f} seed={6} hue={14}/>
      </g>
      <rect x={-60} y={540} width={W + 120} height={120} fill="#dbe4e6" opacity={0.28}/>
      {[0, 1, 2].map((i) => { const u = ((f * (0.5 + i * 0.12) + i * 600) % 2300) - 200; return <path key={i} d="M0,0 q8,-9 16,0 q8,-9 16,0" transform={`translate(${u} ${150 + i * 55 + Math.sin(f / 8 + i) * 6}) scale(${1.1 - i * 0.2})`} stroke="#3a3a42" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.7}/>; })}
      {/* mid row of shopfronts */}
      <g transform={`translate(${par(-14)} 0)`}>
        {mid.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.top} width={b.w} height={700 - b.top} fill={b.c} stroke="#00000030" strokeWidth={1.6}/>
            <rect x={b.x} y={b.top} width={b.w * 0.34} height={700 - b.top} fill="#fff" opacity={0.1}/>
            <rect x={b.x + b.w * 0.72} y={b.top} width={b.w * 0.28} height={700 - b.top} fill="#3a2412" opacity={0.12}/>
            <rect x={b.x - 6} y={b.top - 8} width={b.w + 12} height={14} fill="#00000022"/>
            {[0, 1].map((r) => [0, 1].map((c) => { const wx = b.x + 36 + c * (b.w - 120), wy = b.top + 34 + r * 90; return (
              <g key={`${r}${c}`}><rect x={wx} y={wy} width={52} height={62} fill="#35261a" stroke="#00000040" strokeWidth={1.2}/>
                <rect x={wx - 14} y={wy} width={14} height={62} fill={i % 2 ? "#3f7a58" : "#7a4a2a"} opacity={0.95}/><rect x={wx + 52} y={wy} width={14} height={62} fill={i % 2 ? "#3f7a58" : "#7a4a2a"} opacity={0.95}/>
                <rect x={wx - 6} y={wy + 58} width={64} height={7} fill="#4a3a2a"/></g>); }))}
            <rect x={b.x + 18} y={b.top + 238 > 540 ? 520 : b.top + 238} width={b.w - 36} height={700 - (b.top + 238 > 540 ? 520 : b.top + 238)} fill="#3a2a1c"/>
            <Sign x={b.x + b.w / 2 - 76} y={(b.top + 238 > 540 ? 520 : b.top + 238) - 38} w={152} text={b.sg} bg={b.sgc}/>
            {[0, 1, 2].map((s) => <rect key={s} x={b.x + 30} y={(b.top + 238 > 540 ? 520 : b.top + 238) + 26 + s * 38} width={b.w - 60} height={6} fill="#6a4a2c"/>)}
            {Array.from({length: 7}, (_, s) => <rect key={`i${s}`} x={b.x + 34 + s * ((b.w - 80) / 7)} y={(b.top + 238 > 540 ? 520 : b.top + 238) + 6 + (s % 3) * 38} width={20} height={20} rx={3} fill={["#e8b84a", "#c0603d", "#7fa58a", "#e8dcc4"][s % 4]} opacity={0.9}/>)}
          </g>
        ))}
        {/* overhead wires and bunting */}
        <path d={`M-40,330 Q480,${392 + sway * 3} 960,334 T1960,340`} stroke="#3b2f2c" strokeWidth={1.8} fill="none" opacity={0.7}/>
        {Array.from({length: 22}, (_, i) => { const x = i * 88 + 20, yy = 338 + Math.sin(i / 21 * Math.PI) * 38; return <path key={i} d={`M${x},${yy} l20,0 l-10,26 Z`} fill={["#e0523a", "#f2c23a", "#3f9a5a", "#fff4e0", "#2a6fb8"][i % 5]} opacity={0.92} transform={`rotate(${sway * 2} ${x} ${yy})`}/>; })}
      </g>
      {/* background stalls: hazy awnings with produce and small shoppers */}
      <g transform={`translate(${par(-24)} 0)`} opacity={0.94}>
        {[{x: 60, c1: "#2f7a4a", c2: "#f4ead0"}, {x: 640, c1: "#c0603d", c2: "#f4ead0"}, {x: 1530, c1: "#2a6fb8", c2: "#f4ead0"}].map((s, i) => (
          <g key={i} opacity={variant === "fruit" && i === 2 ? 0.9 : 1}>
            <rect x={s.x + 10} y={560} width={6} height={140} fill="#6a4a2c"/><rect x={s.x + 224} y={560} width={6} height={140} fill="#6a4a2c"/>
            <Awning x={s.x} y={520} w={240} h={46} c1={s.c1} c2={s.c2} n={6} f={f}/>
            <rect x={s.x + 8} y={650} width={224} height={50} fill="#9a6a3a" stroke="#00000040" strokeWidth={1.2}/>
            <FruitPile x={s.x + 120} y={644} w={200} rows={2} kind={(["guava", "orange", "apple"] as const)[i]} seed={i + 3} r={13}/>
            <Adult x={s.x + 120} y={700} h={190} f={f} seed={i + 40} look={{shirt: [["#6c8fb5", "#41607f"], ["#c0603d", "#8c3a22"], ["#7fa58a", "#4d7358"]][i] as [string, string], kind: "plain"}} op={0.9} lookX={0.2} legsHidden/>
          </g>
        ))}
      </g>
      <rect x={-60} y={640} width={W + 120} height={90} fill="#d7e1e2" opacity={0.18}/>
      {/* drifting auto-rickshaw on the far lane */}
      <Auto x={((f * 1.3 + 520) % 2500) - 300} y={716} s={0.5} f={f} op={0.92}/>
      {/* ground: warm paved street with long shadows and seams */}
      <rect x={-60} y={700} width={W + 120} height={H - 700 + 60} fill="url(#e1-ground)"/>
      <rect x={-60} y={700} width={W + 120} height={22} fill="#f0dcb4" opacity={0.7}/>
      <rect x={-60} y={722} width={W + 120} height={6} fill="#7a5a36" opacity={0.5}/>
      {Array.from({length: 13}, (_, i) => <path key={i} d={`M${960 + (i - 6) * 40},728 L${960 + (i - 6) * 360},${H + 40}`} stroke="#6a4a2a" strokeWidth={1.4} opacity={0.18}/>)}
      {Array.from({length: 7}, (_, i) => <path key={`h${i}`} d={`M-60,${745 + i * i * 7 + i * 16} L${W + 60},${745 + i * i * 7 + i * 16}`} stroke="#6a4a2a" strokeWidth={1.2} opacity={0.16}/>)}
      <ellipse cx={1100} cy={860} rx={520} ry={34} fill="#fff" opacity={0.08}/>
      {[{x: 120, w: 260}, {x: 690, w: 300}, {x: 1590, w: 300}].map((s, i) => <path key={i} d={`M${s.x},706 L${s.x + s.w},706 L${s.x + s.w + 220},800 L${s.x + 120},800 Z`} fill="#3a2412" opacity={0.17}/>)}
      {Array.from({length: 22}, (_, i) => { const u = (f * 0.004 + i * 0.137) % 1; return <circle key={i} cx={(i * 211 + u * 120) % W} cy={560 + ((i * 97) % 330) - u * 40} r={1.6 + (i % 3)} fill="#fff4c8" opacity={0.5 * Math.sin(u * Math.PI)}/>; })}
      {/* foreground: crates, sacks and a basket at the corners */}
      {variant !== "velocity" && <g>
        <g transform="translate(40 880)">
          <ellipse cx={150} cy={118} rx={190} ry={14} fill="#2a1808" opacity={0.3}/>
          <path d="M20,40 Q10,110 40,116 L250,116 Q290,100 270,40 Z" fill="#b99a64" stroke="#6a4a2c" strokeWidth={2.4}/>
          <path d="M20,40 Q90,10 150,22 Q220,6 270,40 Q150,60 20,40 Z" fill="#d8b878" stroke="#6a4a2c" strokeWidth={2}/>
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${46 + i * 44},46 L${40 + i * 44},112`} stroke="#6a4a2c" strokeWidth={1.4} opacity={0.5}/>)}
          <rect x={150} y={52} width={150} height={64} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={176 + i * 34} cy={50} r={17} fill="url(#e1-orange)" stroke="#00000026"/>)}
        </g>
      </g>}
      {/* sun shafts */}
      <g style={{mixBlendMode: "screen"}} opacity={0.5}>
        {[0, 1, 2].map((i) => <path key={i} d={`M${sun[0] - 30 + i * 70},${sun[1]} L${sun[0] + 520 + i * 360},${H} L${sun[0] + 760 + i * 360},${H} Z`} fill="url(#e1-ray)" opacity={0.5 - i * 0.12}/>)}
      </g>
    </g>
  );
};

// ---- shop interior ------------------------------------------------------------------------------------------------------------
export const ShopBG: React.FC<{f: number}> = ({f}) => {
  const g = rng(77), fan = f * 9;
  return (
    <g>
      <E1Defs/>
      <defs>
        <linearGradient id="e1-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dcb67a"/><stop offset="1" stopColor="#f0d7a2"/></linearGradient>
        <linearGradient id="e1-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe0f4"/><stop offset="1" stopColor="#fff2cc"/></linearGradient>
        <radialGradient id="e1-bulb" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff6c8" stopOpacity="0.95"/><stop offset="1" stopColor="#ffd37a" stopOpacity="0"/></radialGradient>
        <linearGradient id="e1-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9774a"/><stop offset="1" stopColor="#6e4626"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#e1-wall)"/>
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${i * 150 - 20},-20 L${i * 150 - 20},760`} stroke="#b88a52" strokeWidth={1.6} opacity={0.18}/>)}
      <rect x={-60} y={640} width={W + 120} height={16} fill="#8a5a30" opacity={0.7}/>
      {/* window on the right with daylight */}
      <rect x={1380} y={160} width={330} height={400} fill="#6a4a2c" stroke="#3a2412" strokeWidth={3}/>
      <rect x={1396} y={176} width={298} height={368} fill="url(#e1-win)"/>
      <clipPath id="e1-wclip"><rect x={1396} y={176} width={298} height={368}/></clipPath>
      <g clipPath="url(#e1-wclip)"><Hills id="e1wh" base={470} amp={50} top="#9fb8c8" bottom="#c8d4c0" seed={1.7} wl={150} bottomY={544}/></g>
      <path d="M1545,176 V544 M1396,360 H1694" stroke="#6a4a2c" strokeWidth={8}/>
      <path d="M1396,544 L1694,544 L1900,800 L1190,800 Z" fill="#fff2c4" opacity={0.26}/>
      {/* shelves with jars, packets and tins */}
      {[0, 1].map((side) => (
        <g key={side} transform={`translate(${side ? 120 : 120} 0)`}>
          {side === 0 && [0, 1, 2].map((r) => (
            <g key={r}>
              <rect x={20} y={250 + r * 130} width={1100} height={12} fill="#6a4228" stroke="#3a2412" strokeWidth={1.4}/>
              {Array.from({length: 17}, (_, i) => { const x = 40 + i * 63 + g() * 6, hh = 56 + g() * 44, col = ["#e8b84a", "#c0603d", "#7fa58a", "#e8dcc4", "#6c8fb5", "#d98a8a"][(i + r) % 6]; return i % 3 === 0
                ? <g key={i}><rect x={x} y={250 + r * 130 - hh} width={42} height={hh} rx={8} fill="#cfe6ef" opacity={0.65} stroke="#7da3ba" strokeWidth={1.6}/><rect x={x + 3} y={250 + r * 130 - hh * 0.7} width={36} height={hh * 0.66} rx={5} fill={col} opacity={0.85}/><rect x={x - 1} y={250 + r * 130 - hh - 6} width={44} height={8} rx={3} fill="#7a5030"/></g>
                : <g key={i}><rect x={x} y={250 + r * 130 - hh} width={44} height={hh} rx={4} fill={col} stroke="#00000030" strokeWidth={1.2}/><rect x={x + 6} y={250 + r * 130 - hh + 10} width={32} height={14} rx={2} fill="#fff6e4" opacity={0.7}/></g>; })}
            </g>
          ))}
        </g>
      ))}
      <rect x={120} y={236} width={20} height={440} fill="#6a4228"/><rect x={1220} y={236} width={20} height={440} fill="#6a4228"/>
      {/* plain wall calendar and clock */}
      <rect x={1245} y={290} width={92} height={118} rx={5} fill="#fffaf0" stroke="#b8a074" strokeWidth={2}/><rect x={1245} y={290} width={92} height={30} rx={5} fill="#c0603d"/>
      {Array.from({length: 12}, (_, i) => <rect key={i} x={1256 + (i % 4) * 20} y={332 + Math.floor(i / 4) * 22} width={14} height={12} rx={2} fill="#d9cdb0"/>)}
      {/* ceiling fan and hanging bulb */}
      <g transform="translate(560 40)">
        <path d="M0,0 V40" stroke="#4a3a2a" strokeWidth={5}/>
        <g transform={`translate(0 44) scale(1 0.22) rotate(${fan})`}><rect x={-170} y={-12} width={340} height={24} rx={12} fill="#6a4a2c" opacity={0.9}/><rect x={-12} y={-170} width={24} height={340} rx={12} fill="#6a4a2c" opacity={0.9}/></g>
        <ellipse cx={0} cy={44} rx={22} ry={11} fill="#3a2a1a"/>
      </g>
      <g transform="translate(1000 0)"><path d="M0,0 V130" stroke="#2a2018" strokeWidth={3}/><circle cx={0} cy={140} r={150} fill="url(#e1-bulb)"/><circle cx={0} cy={140} r={15} fill="#fff6c8" stroke="#b8923a" strokeWidth={1.6}/><rect x={-8} y={118} width={16} height={14} fill="#4a3a2a"/></g>
      {/* floor */}
      <rect x={-60} y={656} width={W + 120} height={H} fill="url(#e1-floor)"/>
      {Array.from({length: 10}, (_, i) => <path key={i} d={`M-60,${680 + i * 44} Q960,${676 + i * 44} ${W + 60},${680 + i * 44}`} stroke="#4a2c14" strokeWidth={1.6} opacity={0.4} fill="none"/>)}
      <ellipse cx={1100} cy={790} rx={560} ry={50} fill="#fff2c4" opacity={0.1}/>
    </g>
  );
};

/** the shop counter: drawn after the shopkeeper so he stands behind it */
export const Counter: React.FC<{y0?: number}> = ({y0 = 700}) => (
  <g>
    <defs>
      <linearGradient id="e1-ctop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9a468"/><stop offset="1" stopColor="#a8723c"/></linearGradient>
      <linearGradient id="e1-cfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a30"/><stop offset="1" stopColor="#4e301a"/></linearGradient>
    </defs>
    <rect x={380} y={y0} width={1240} height={22} rx={5} fill="url(#e1-ctop)" stroke="#4e301a" strokeWidth={2}/>
    <rect x={380} y={y0 + 20} width={1240} height={H - y0 - 10} fill="url(#e1-cfront)"/>
    {Array.from({length: 5}, (_, i) => <rect key={i} x={410 + i * 244} y={y0 + 50} width={210} height={170} rx={6} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.4}/>)}
    <rect x={380} y={y0} width={1240} height={5} fill="#fff" opacity={0.28}/>
  </g>
);
