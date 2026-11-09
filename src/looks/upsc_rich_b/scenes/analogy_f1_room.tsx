// ECO-16 Part 2, builder F1: Lala's shop (an open-fronted room at the left of the village set): back wall with shelves, an iron safe, a hanging lamp, the wooden counter with
// balance scales, a pad and an open strongbox (4 gold-bar slots), and a hanging signboard. The lane, houses and stall are in analogy_f1_kit.tsx.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {GoldBar, type P} from "./analogy_f1_kit";
import {E} from "./analogy_f1_kit";

export const LX = 560, CTY = 640, LY = 926, LH = 520;       // Lala, counter top, Lala's feet and height
export const RX = 720, CY0 = 950, CH0 = 560;                // a customer in front of the counter
export const HX: P = [650, 628];                            // the handover spot on the counter
export const PX: P = [580, 630];                            // the pad where Lala writes
export const SLOT: P[] = [[322, 566], [374, 566], [426, 566], [478, 566]];   // strongbox slots (world)

export const ShopRoom: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-60} y={-60} width={982} height={790} fill="url(#f1-plaster)"/>
    {Array.from({length: 8}, (_, i) => <path key={i} d={`M${i * 130 - 10},50 V540`} stroke="#b88a52" strokeWidth={1.4} opacity={0.12}/>)}
    {/* wainscot, beam and rafters */}
    <rect x={-60} y={500} width={982} height={230} fill="#8a6446"/>
    {Array.from({length: 7}, (_, i) => <rect key={i} x={20 + i * 132} y={518} width={112} height={176} rx={4} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.36}/>)}
    <rect x={-60} y={494} width={982} height={10} fill="#d9b45a" opacity={0.75}/>
    <rect x={-60} y={-10} width={982} height={64} fill="#5a3a22"/><rect x={-60} y={44} width={982} height={10} fill="#2f1d0e" opacity={0.5}/>
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M${i * 118 + 10},54 L${i * 118 - 30},-10`} stroke="#3f2814" strokeWidth={8} opacity={0.7}/>)}
    {/* the iron safe on the back wall */}
    <g transform="translate(110 316)">
      <rect x={0} y={0} width={190} height={330} rx={8} fill="url(#f1-iron)" stroke="#1a2030" strokeWidth={3}/>
      <rect x={14} y={14} width={162} height={302} rx={5} fill="none" stroke="#9aa6b6" strokeWidth={2} opacity={0.6}/>
      <circle cx={95} cy={140} r={52} fill="#2a3040" stroke="#b8c2d2" strokeWidth={4}/>
      <circle cx={95} cy={140} r={38} fill="none" stroke="#d9b45a" strokeWidth={3}/>
      {Array.from({length: 12}, (_, i) => <path key={i} d="M95,106 V114" stroke="#d9b45a" strokeWidth={2.4} transform={`rotate(${i * 30} 95 140)`}/>)}
      <path d="M95,140 L95,112" stroke="#f6dc8a" strokeWidth={4} strokeLinecap="round" transform={`rotate(${28 + Math.sin(f / 70) * 2} 95 140)`}/>
      <rect x={134} y={128} width={34} height={24} rx={5} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={1.6}/>
      {[[10, 10], [176, 10], [10, 316], [176, 316]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.4} fill="#b8c2d2" stroke="#1a2030"/>)}
      <path d="M14,14 L60,14 L14,120 Z" fill="#fff" opacity={0.1}/>
    </g>
    {/* shelves with brass pots and jars */}
    {[300, 410].map((y, r) => (
      <g key={y}>
        <rect x={600} y={y} width={290} height={11} fill="#6a4228" stroke="#3a2412" strokeWidth={1.4}/>
        {Array.from({length: 5}, (_, i) => { const x = 624 + i * 56, hh = 40 + ((i * 17 + r * 11) % 34); return i % 2 === 0
          ? <g key={i}><ellipse cx={x} cy={y - 6} rx={22} ry={5} fill="#8a5f12" opacity={0.6}/><path d={`M${x - 20},${y} Q${x - 26},${y - hh * 0.7} ${x - 12},${y - hh} L${x + 12},${y - hh} Q${x + 26},${y - hh * 0.7} ${x + 20},${y} Z`} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/><path d={`M${x - 14},${y - 8} Q${x - 18},${y - hh * 0.6} ${x - 8},${y - hh + 4}`} stroke="#fff" strokeWidth={2} opacity={0.4} fill="none"/></g>
          : <g key={i}><rect x={x - 18} y={y - hh} width={36} height={hh} rx={7} fill="#cfe6ef" opacity={0.7} stroke="#7da3ba" strokeWidth={1.6}/><rect x={x - 14} y={y - hh * 0.62} width={28} height={hh * 0.56} rx={4} fill={["#e8b84a", "#c0603d", "#7fa58a"][(i + r) % 3]} opacity={0.85}/></g>; })}
      </g>
    ))}
    {/* wall calendar */}
    <rect x={520} y={330} width={64} height={84} rx={4} fill="#fffaf0" stroke="#b8a074" strokeWidth={1.8}/><rect x={520} y={330} width={64} height={20} rx={4} fill="#c0603d"/>
    {Array.from({length: 12}, (_, i) => <rect key={i} x={528 + (i % 4) * 14} y={358 + Math.floor(i / 4) * 17} width={9} height={9} rx={1.5} fill="#d9cdb0"/>)}
    {/* hanging oil lamp */}
    <g transform="translate(790 0)"><path d="M0,54 V150" stroke="#2a2018" strokeWidth={3}/><circle cx={0} cy={198} r={110 + Math.sin(f / 11) * 4} fill="url(#f1-lamp)"/><path d="M-18,168 L18,168 L24,206 Q0,222 -24,206 Z" fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.6}/><ellipse cx={0} cy={192} rx={9} ry={14 + Math.sin(f / 5) * 1.5} fill="#fff2c0"/></g>
    {/* pillar at the open front */}
    <rect x={884} y={-60} width={38} height={790} fill="#6a4228" stroke="#3a2412" strokeWidth={2}/><rect x={884} y={-60} width={12} height={790} fill="#fff" opacity={0.14}/>
    <rect x={874} y={494} width={58} height={18} rx={3} fill="#5a3a22" stroke="#2f1d0e" strokeWidth={1.6}/>
    {/* floor and a light shaft from the doorway */}
    <rect x={-60} y={722} width={982} height={H} fill="url(#f1-floor)"/>
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M-60,${748 + i * 34} Q460,${744 + i * 34} 922,${748 + i * 34}`} stroke="#4a2c14" strokeWidth={1.6} opacity={0.36} fill="none"/>)}
    <rect x={922} y={722} width={30} height={H} fill="#b6a98f" opacity={0.8}/>
    <path d="M922,330 L922,640 L560,1010 L330,1010 Z" fill="#fff2c4" opacity={0.12}/>
  </g>
);

/** the counter front and top; items on the top are drawn by the caller after this */
export const ShopCounter: React.FC = () => (
  <g>
    <rect x={96} y={CTY} width={812} height={26} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={96} y={CTY} width={812} height={5} fill="#fff" opacity={0.3}/>
    <rect x={104} y={CTY + 26} width={796} height={290} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    {Array.from({length: 4}, (_, i) => <rect key={i} x={126 + i * 194} y={CTY + 52} width={168} height={232} rx={6} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>)}
    <rect x={96} y={CTY + 26} width={812} height={9} fill="url(#f1-brass)" opacity={0.9}/>
    <g transform={`translate(246 ${CTY - 2})`}>
      <path d="M-44,0 L-38,-18 L-2,-15 L-2,2 Z" fill="#fffaf0" stroke="#b8a074" strokeWidth={1.4}/><path d="M44,0 L38,-18 L2,-15 L2,2 Z" fill="#f6efdc" stroke="#b8a074" strokeWidth={1.4}/>
      <path d="M-34,-12 L-8,-10 M-34,-6 L-8,-4 M8,-10 L34,-12 M8,-4 L34,-6" stroke="#8a7a58" strokeWidth={1} opacity={0.8}/>
      <path d="M-46,2 L46,2 L42,7 L-42,7 Z" fill="#8c2a1c" stroke="#4a1208" strokeWidth={1.2}/>
    </g>
    <g transform={`translate(312 ${CTY - 2})`}><rect x={-8} y={-13} width={16} height={13} rx={3} fill="#2a3a5c" stroke="#101828" strokeWidth={1.2}/><path d="M3,-13 L10,-32" stroke="#6a4228" strokeWidth={1.8}/></g>
  </g>
);

export const Scales: React.FC<{x: number; f: number; tilt?: number}> = ({x, f, tilt = 0}) => {
  const a = tilt + Math.sin(f / 26) * 1.2, r = (a * Math.PI) / 180, dx = Math.cos(r) * 66, dy = Math.sin(r) * 66;
  return (
    <g transform={`translate(${x} ${CTY})`}>
      <ellipse cx={0} cy={0} rx={38} ry={6} fill="#2a1808" opacity={0.3}/>
      <path d="M-26,0 Q-24,-10 -10,-12 L10,-12 Q24,-10 26,0 Z" fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.6}/>
      <rect x={-5} y={-124} width={10} height={114} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/>
      <circle cx={0} cy={-128} r={8} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/>
      <path d={`M${-dx},${-128 - dy} L${dx},${-128 + dy}`} stroke="#8a5f12" strokeWidth={7} strokeLinecap="round"/><path d={`M${-dx},${-129 - dy} L${dx},${-129 + dy}`} stroke="#f6dc8a" strokeWidth={2.4} strokeLinecap="round"/>
      {[-1, 1].map((s) => { const cx = s * dx, cy = -128 - s * dy * -1 * -1, py = -128 + s * dy + 78; return (
        <g key={s}>
          <path d={`M${cx},${-128 + s * dy} L${cx - 26},${py} M${cx},${-128 + s * dy} L${cx + 26},${py}`} stroke="#8a5f12" strokeWidth={1.6}/>
          <path d={`M${cx - 30},${py} Q${cx},${py + 14} ${cx + 30},${py} Z`} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/>
        </g>); })}
    </g>
  );
};

/** an open strongbox on the counter with 4 slots for gold bars; pres[i] 0..1 is how present each bar is */
export const Chest: React.FC<{pres: number[]; glow?: number}> = ({pres, glow = 0}) => {
  const x = 400, y = CTY;
  return (
    <g>
      <ellipse cx={x} cy={y + 2} rx={130} ry={9} fill="#2a1808" opacity={0.3}/>
      {/* raised lid behind */}
      <path d={`M${x - 108},${y - 66} L${x - 96},${y - 150} Q${x},${y - 164} ${x + 96},${y - 150} L${x + 108},${y - 66} Z`} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/>
      <path d={`M${x - 92},${y - 70} L${x - 82},${y - 140} Q${x},${y - 152} ${x + 82},${y - 140} L${x + 92},${y - 70} Z`} fill="#3a2412" opacity={0.55}/>
      <rect x={x - 6} y={y - 156} width={12} height={90} fill="url(#f1-brass)" opacity={0.85}/>
      {/* inside */}
      <path d={`M${x - 108},${y - 66} L${x + 108},${y - 66} L${x + 100},${y - 92} L${x - 100},${y - 92} Z`} fill="#2a1a0e"/>
      {glow > 0.01 && <ellipse cx={x} cy={y - 80} rx={130} ry={44} fill="url(#ak-sunglow)" opacity={glow}/>}
      {SLOT.map(([sx], i) => { const p = clamp(pres[i] ?? 0); return p > 0.01 ? (
        <g key={i} transform={`translate(${sx} ${y - 84 - (1 - p) * 38}) scale(${0.58 * (0.7 + 0.3 * p)})`} opacity={p}><GoldBar/></g>) : null; })}
      {/* front */}
      <rect x={x - 112} y={y - 70} width={224} height={72} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/>
      <rect x={x - 112} y={y - 70} width={224} height={8} fill="#fff" opacity={0.25}/>
      {[-112, 100].map((dx) => <rect key={dx} x={x + dx} y={y - 70} width={12} height={72} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.2}/>)}
      <rect x={x - 112} y={y - 40} width={224} height={8} fill="url(#f1-brass)" opacity={0.85}/>
      <rect x={x - 14} y={y - 52} width={28} height={30} rx={4} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.6}/><circle cx={x} cy={y - 40} r={3.6} fill="#3a2412"/>
    </g>
  );
};

/** a blank paper pad lying on the counter */
export const Pad: React.FC<{x?: number}> = ({x = PX[0]}) => (
  <g transform={`translate(${x} ${CTY - 3})`}>
    <ellipse cx={0} cy={2} rx={46} ry={6} fill="#2a1808" opacity={0.25}/>
    <path d="M-44,0 L-32,-14 L48,-14 L40,0 Z" fill="url(#f1-paper)" stroke="#b8a074" strokeWidth={1.4}/>
    <path d="M-28,-6 L26,-6 M-22,-10 L34,-10" stroke="#a8946a" strokeWidth={1.4} opacity={0.6}/>
  </g>
);

/** the hanging sign board; text is drawn as given (a label) or a fixed shop word */
export const SignBoard: React.FC<{x: number; text: string; a: number; f: number; w?: number; size?: number; y?: number}> = ({x, text, a, f, w = 460, size = 36, y = 108}) => {
  if (a <= 0.002) return null;
  const sw = Math.sin(f / 18) * 1.1 * a, drop = (1 - a) * -90;
  return (
    <g transform={`translate(${x} ${y + drop}) rotate(${sw} 0 -52)`} opacity={clamp(a * 2)}>
      <path d={`M${-w / 2 + 40},0 L${-w / 2 + 40},-58 M${w / 2 - 40},0 L${w / 2 - 40},-58`} stroke="#2a2018" strokeWidth={4}/>
      <rect x={-w / 2} y={0} width={w} height={86} rx={8} fill="#000" opacity={0.3} transform="translate(5 8)"/>
      <rect x={-w / 2} y={0} width={w} height={86} rx={8} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={3}/>
      <rect x={-w / 2 + 8} y={8} width={w - 16} height={70} rx={5} fill="#f4e7c4" opacity={0.92} stroke="#8a5a30" strokeWidth={1.6}/>
      <text x={0} y={58} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} fill="#5a2a10" letterSpacing="0.03em">{text}</text>
    </g>
  );
};
