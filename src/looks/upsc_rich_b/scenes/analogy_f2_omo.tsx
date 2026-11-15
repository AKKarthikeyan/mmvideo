// ECO-16 Part 2, builder F2: `omo` (b12). A bond dealer hands a certificate to a plain RBI building (a purchase); a cheque flies back and lands in a bank's reserve bar, which rises; the reverse
// trade (a sale) makes the bar fall; at `ll` a lifebuoy hangs on the RBI building: lender of last resort. No amounts are drawn, only direction.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {Tree, type AP} from "./analogy_kit";
import {Adult, E1Defs, handPos, type Arms, type Look} from "./analogy_e1_kit";
import {Cert} from "./analogy_e2_kit";
import {Classical, Cheque, Defs, ECard, Lifebuoy, Plate, Plaza, Shade, Spot, elabs, ez, lerp, pop, pulse, sm} from "./analogy_f2_kit";

const GROUND = 724, BASE = 770, RBI = {x: 900, w: 440, h: 390}, BANK = {x: 1600, w: 300, h: 270}, BAR = {x: 1290, base: BASE - 14, h: 250, w: 100};
const DEALER: Look = {kind: "plain", shirt: ["#34476a", "#1f2c47"], pants: "#262c38", hair: "#1a120d", glasses: true, skin: 2};
const DX = 250, DY = BASE + 14, DH = 340;
const ARMS: Arms = {R: [52, 84], L: [6, 10]};
const hand = handPos(DX, DY, DH, ARMS, "R");
const DOOR: [number, number] = [RBI.x, BASE - 70];
const arcP = (a: [number, number], b: [number, number], lift: number, u: number): [number, number] => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(Math.PI * u) * lift];

const Tube: React.FC<{x: number; base: number; w: number; h: number; level: number; f: number; glow: number}> = ({x, base, w, h, level, f, glow}) => {
  const wy = base - h * level;
  return (
    <g>
      <defs>
        <linearGradient id="omo-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a0"/><stop offset="0.5" stopColor="#f0b44a"/><stop offset="1" stopColor="#b9811a"/></linearGradient>
        <clipPath id="omo-k"><rect x={x - w / 2 + 7} y={base - h + 7} width={w - 14} height={h - 14} rx={12}/></clipPath>
        <linearGradient id="omo-gl" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.6"/><stop offset="0.25" stopColor="#fff" stopOpacity="0.05"/><stop offset="0.85" stopColor="#fff" stopOpacity="0.08"/><stop offset="1" stopColor="#fff" stopOpacity="0.4"/></linearGradient>
      </defs>
      <ellipse cx={x + 16} cy={base + 10} rx={w * 0.8} ry={14} fill="#2a1808" opacity={0.32} filter="url(#e3-glow-s)"/>
      {glow > 0.01 && <ellipse cx={x} cy={base - h * level} rx={w * 1.2} ry={90} fill="#ffd37a" opacity={0.5 * glow} filter="url(#e3-glow)"/>}
      <rect x={x - w / 2} y={base - h} width={w} height={h} rx={18} fill="#e6f1f5" opacity={0.45}/>
      <g clipPath="url(#omo-k)">
        <rect x={x - w / 2} y={wy} width={w} height={base - wy} fill="url(#omo-g)"/>
        <path d={`M${x - w / 2},${wy} ${Array.from({length: 9}, (_, i) => `L${x - w / 2 + (i + 1) * (w / 8)},${wy + Math.sin(f / 9 + i * 1.3) * 2.6}`).join(" ")} L${x + w / 2},${wy - 8} L${x - w / 2},${wy - 8} Z`} fill="#fff3bd" opacity={0.85}/>
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M${x - w / 2},${base - 20 - i * (h / 8)} H${x + w / 2}`} stroke="#fff" strokeWidth={1.4} opacity={0.22}/>)}
      </g>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${x + w / 2 - 10},${base - 16 - i * ((h - 34) / 9)} h${i % 3 === 2 ? -28 : -16}`} stroke="#4d6d86" strokeWidth={i % 3 === 2 ? 3 : 2} opacity={0.55} strokeLinecap="round"/>)}
      <rect x={x - w / 2} y={base - h} width={w} height={h} rx={18} fill="url(#omo-gl)" stroke="#7da3ba" strokeWidth={5}/>
      <rect x={x - w / 2 - 12} y={base - 8} width={w + 24} height={20} rx={8} fill="#8a6a44" stroke="#4e361c" strokeWidth={2}/>
      <rect x={x - w / 2 - 6} y={base - h - 8} width={w + 12} height={15} rx={6} fill="#b8cfda" stroke="#7da3ba" strokeWidth={3}/>
    </g>
  );
};

export const OmoArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), tBu = L.bu.at, tSe = L.se.at, tLl = L.ll.at;
  const bondU = clamp((f - tBu) / 46), cheqU = clamp((f - (tBu + 44)) / 52), cheq2U = clamp((f - tSe) / 50), bond2U = clamp((f - (tSe + 46)) / 48);
  const rise = sm(f, tBu + 90, 36), fall = sm(f, tSe + 4, 40), level = 0.42 + 0.26 * rise - 0.26 * fall;
  const bond = f < tBu ? hand : f < tBu + 46 ? arcP(hand, DOOR, 150, bondU) : f > tSe + 46 ? arcP(DOOR, hand, 150, bond2U) : DOOR;
  const bondA = f < tBu ? 1 : f < tBu + 46 ? 1 - Math.max(0, (bondU - 0.82) / 0.18) : f > tSe + 46 ? Math.min(1, bond2U * 5) : 0;
  const bondS = f < tBu ? 1 : f < tBu + 46 ? 1 - 0.55 * bondU : f > tSe + 46 ? 0.45 + 0.55 * bond2U : 0.45;
  const BARTOP: [number, number] = [BAR.x, BAR.base - BAR.h - 20];
  let cheq: [number, number] | null = null, cheqA = 0, cheqRot = 0;
  if (f >= tBu + 44 && f < tBu + 98) { cheq = arcP(DOOR, BARTOP, 130, cheqU); cheqA = Math.min(1, cheqU * 6) * (1 - Math.max(0, (cheqU - 0.85) / 0.15)); cheqRot = lerp(-12, 6, cheqU); }
  if (f >= tSe && f < tSe + 54) { cheq = arcP(BARTOP, DOOR, 130, cheq2U); cheqA = Math.min(1, cheq2U * 6) * (1 - Math.max(0, (cheq2U - 0.85) / 0.15)); cheqRot = lerp(6, -12, cheq2U); }
  const bunting = Array.from({length: 11}, (_, i) => i);
  const lb = pop(f, tLl, 24);
  return (
    <g>
      <Defs/>
      <E1Defs/>
      <Plaza id="omo" ground={GROUND} f={f}/>
      <Spot id="omo-sp" cx={900} cy={420} rx={900} ry={380} c="#fff0c8" a={0.28}/>
      {/* the RBI and a bank, both plain classical buildings */}
      <Classical x={RBI.x} y={BASE} w={RBI.w} h={RBI.h} text="RESERVE BANK" id="omo-rbi" cols={6} stone={["#e6d3a8", "#a98a52"]} glow={0.25}/>
      <Classical x={BANK.x} y={BASE} w={BANK.w} h={BANK.h} text="BANK" id="omo-bk" cols={4} stone={["#e6d3a8", "#a98a52"]}/>
      <Tree x={1810} y={BASE + 20} s={0.52} f={f} seed={6}/>
      <Tube x={BAR.x} base={BAR.base} w={BAR.w} h={BAR.h} level={level} f={f} glow={Math.max(pulse(f, tBu + 92, 50), pulse(f, tSe + 8, 50))}/>
      <Plate x={BAR.x} y={BAR.base + 52} w={176} text="RESERVES" size={20} a={1}/>
      {/* the dealer, with a bond certificate */}
      <Adult x={DX} y={DY} h={DH} f={f} seed={4} look={DEALER} arms={ARMS} hands={{R: "open", L: "relax"}} lookX={0.7} smile={0.5}/>
      {bondA > 0.01 && <g transform={`translate(${bond[0]} ${bond[1] - 14 * (f < tBu ? 1 : bondS)}) scale(${bondS}) rotate(${f < tBu ? -6 : lerp(-6, 8, Math.sin(Math.PI * bondU))})`} opacity={bondA}><Cert x={0} y={0} w={170} word="BOND"/></g>}
      {cheq && <Cheque x={cheq[0]} y={cheq[1]} w={190} rot={cheqRot} a={cheqA}/>}
      {/* the lifebuoy hung on the RBI, with its rope from the frieze */}
      {lb > 0.02 && <g transform={`translate(0 ${(1 - lb) * -70})`} opacity={clamp(lb * 3)}>
        <path d={`M${RBI.x - 30},${BASE - RBI.h * 0.6} L${RBI.x - 24},${BASE - RBI.h * 0.35 - 70} M${RBI.x + 30},${BASE - RBI.h * 0.6} L${RBI.x + 24},${BASE - RBI.h * 0.35 - 70}`} stroke="#b78a4a" strokeWidth={4} strokeLinecap="round"/>
        <Lifebuoy x={RBI.x} y={BASE - RBI.h * 0.35} r={74} k={0.7 + 0.3 * lb} f={f}/>
      </g>}
    </g>
  );
};

export const OmoLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  return <>
    <ECard cx={960} y={58} text={L.om.text} f={f} at={L.om.at} size={40} maxW={1100}/>
    <ECard cx={560} y={176} text={L.bu.text} f={f} at={L.bu.at} size={28} maxW={560} upper={false} tone="green"/>
    <ECard cx={1330} y={176} text={L.se.text} f={f} at={L.se.at} size={28} maxW={560} upper={false} tone="red"/>
    <ECard cx={900} y={822} text={L.ll.text} f={f} at={L.ll.at} size={34} maxW={720} tone="red"/>
  </>;
};
