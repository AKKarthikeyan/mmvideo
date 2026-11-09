// ECO-16 Part 1, builder E1: `phone-pay` (mode "start": b00, mode "end": b22). A fruit cart on a market street, a customer taps a phone at the QR card,
// two account bars float up and one block glides from the customer's bar to the seller's bar. Event keys: tap, nn (start), bm (end, also a label).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {prog} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {StreetBG} from "./analogy_e1_bg";
import {Adult, AccountBar, Awning, BananaBunch, FruitPile, Phone, QRCard, arc, reach, mix2, ease, bump, handPos, type Arms, type Look} from "./analogy_e1_kit";
import type {AP} from "./analogy_kit";

const CUST: Look = {shirt: ["#4f8f9a", "#2f5f6a"], pants: "#31405a", hair: "#1a120d", skin: 2, kind: "plain"};
const SELLER: Look = {kind: "saree", accent: "#b8323f", shirt: ["#e8b84a", "#a5782e"], hair: "#1a120d", skin: 1, female: true};
const CX = 790, CY = 930, CH = 560;            // the customer
const SX = 1290, SY = 890, SH = 480;           // the seller (behind the counter)
const REST: [number, number] = [905, 592], TAPP: [number, number] = [1004, 624], CHEST_R: [number, number] = [884, 652], CHEST_L: [number, number] = [700, 652], SIDE_L: [number, number] = [724, 760];
const CART = {x: 960, w: 620, top: 708};

const CartBack: React.FC<{f: number}> = ({f}) => (
  <g>
    {[CART.x + 24, CART.x + CART.w - 28].map((px) => <g key={px}><rect x={px} y={350} width={9} height={CART.top - 340} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/><rect x={px} y={350} width={3} height={CART.top - 340} fill="#fff" opacity={0.25}/></g>)}
    <Awning x={CART.x - 24} y={294} w={CART.w + 48} h={66} c1="#d8682a" c2="#fff4e0" n={10} f={f} sway={1.6}/>
    <path d={`M${CART.x - 24},362 L${CART.x + CART.w + 24},362`} stroke="#00000030" strokeWidth={2}/>
    <BananaBunch x={CART.x + 70} y={384} s={0.78} sway={Math.sin(f / 22) * 1.2}/>
    <BananaBunch x={CART.x + CART.w - 70} y={384} s={0.7} sway={Math.sin(f / 25 + 1) * 1.2}/>
    <path d={`M${CART.x + 40},366 L${CART.x + 40},384 M${CART.x + CART.w - 40},366 L${CART.x + CART.w - 40},384`} stroke="#6a4a2c" strokeWidth={2}/>
  </g>
);
const CartFront: React.FC<{f: number; sign: number; text: string; qrGlow: number}> = ({f, sign, text, qrGlow}) => {
  const x0 = CART.x, y0 = CART.top;
  return (
    <g>
      {/* fruit on the counter */}
      <FruitPile x={x0 + 120} y={y0 - 19} w={170} rows={3} kind="mango" seed={2} r={19}/>
      <FruitPile x={x0 + 420} y={y0 - 17} w={150} rows={3} kind="apple" seed={5} r={17}/>
      <FruitPile x={x0 + 560} y={y0 - 17} w={120} rows={2} kind="guava" seed={8} r={17}/>
      <FruitPile x={x0 + 290} y={y0 - 16} w={130} rows={2} kind="orange" seed={11} r={16}/>
      {/* counter top and front panel */}
      <rect x={x0 - 10} y={y0 - 4} width={CART.w + 20} height={30} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
      <rect x={x0 - 10} y={y0 - 4} width={CART.w + 20} height={5} fill="#fff" opacity={0.3}/>
      <rect x={x0} y={y0 + 26} width={CART.w} height={150} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${x0 + i * 104},${y0 + 26} V${y0 + 176}`} stroke="#3a2412" strokeWidth={1.6} opacity={0.45}/>)}
      <rect x={x0 + 12} y={y0 + 40} width={CART.w - 24} height={14} fill="#f4e7c4" opacity={0.5}/>
      <path d={`M${x0 + 10},${y0 + 62} H${x0 + CART.w - 10}`} stroke="#b8323f" strokeWidth={5} opacity={0.75}/>
      {[0, 1, 2].map((i) => <circle key={i} cx={x0 + 130 + i * 180} cy={y0 + 120} r={26} fill={`url(#e1-${["mango", "apple", "guava"][i]})`} stroke="#00000030" strokeWidth={1.4}/>)}
      {/* handles and wheels */}
      <path d={`M${x0 + CART.w},${y0 + 60} L${x0 + CART.w + 150},${y0 + 160}`} stroke="#6a4a2c" strokeWidth={13} strokeLinecap="round"/>
      <path d={`M${x0 + CART.w},${y0 + 60} L${x0 + CART.w + 150},${y0 + 160}`} stroke="#c28a52" strokeWidth={6} strokeLinecap="round"/>
      {[x0 + 78, x0 + CART.w - 78].map((wx) => (
        <g key={wx} transform={`translate(${wx} ${y0 + 190})`}><ellipse cx={14} cy={72} rx={72} ry={10} fill="#2a1808" opacity={0.25}/>
          <circle r={72} fill="#2a2a2e" stroke="#101014" strokeWidth={3}/><circle r={58} fill="#c9a26a" stroke="#6a4a2c" strokeWidth={3}/><circle r={11} fill="#4a3a2a"/>
          {Array.from({length: 8}, (_, i) => <path key={i} d="M0,0 L0,-58" stroke="#6a4a2c" strokeWidth={4} transform={`rotate(${i * 45})`}/>)}</g>
      ))}
      {/* QR card on a stand */}
      <g transform={`translate(${x0 + 14} ${y0 - 142})`}>
        {qrGlow > 0.01 && <rect x={-18} y={-14} width={146} height={180} rx={20} fill="#9fe0ff" opacity={0.5 * qrGlow} filter="url(#ak-blur8)"/>}
        <QRCard w={110} seed={9}/>
        <path d="M30,142 L22,156 M80,142 L88,156" stroke="#6a4a2c" strokeWidth={5} strokeLinecap="round"/>
      </g>
      {/* chalkboard sign: label fc */}
      {sign > 0.01 && (
        <g transform={`translate(${x0 + 330} ${y0 + 200 - (1 - sign) * 120}) rotate(${(1 - sign) * -8 + Math.sin(f / 18) * 0.6})`} opacity={sign}>
          <path d="M-150,0 L-170,70 M150,0 L170,70" stroke="#5a3a1e" strokeWidth={9} strokeLinecap="round"/>
          <rect x={-182} y={-70} width={364} height={86} rx={9} fill="#3a2412" stroke="#5a3a1e" strokeWidth={4} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.45))"}}/>
          <rect x={-170} y={-60} width={340} height={66} rx={5} fill="#244538"/>
          <text x={0} y={-16} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={29} fill="#f6efd8">{text}</text>
          <path d="M-120,-4 q30,5 60,0 M40,-4 q40,5 80,0" stroke="#f6efd8" strokeWidth={1.4} fill="none" opacity={0.5}/>
        </g>
      )}
    </g>
  );
};

/** the customer's arms and phone for a tap at frame t (start: pockets the phone and shows empty hands; end: keeps the phone at the card) */
const custPose = (f: number, t: number, end: boolean) => {
  const a1 = eio(prog(f, t - 54, 50)), a2 = eio(prog(f, t + 10, 18)), a3 = eio(prog(f, t + 6, 18));
  let hand = mix2(REST, TAPP, a1);
  if (!end) hand = mix2(hand, CHEST_R, a2);
  const idle = Math.sin(f / 30) * 2;
  const handR: [number, number] = [hand[0], hand[1] + idle];
  const handL = end ? SIDE_L : mix2(SIDE_L, CHEST_L, a3);
  const arms: Arms = {R: reach(CX, CY, CH, "R", handR), L: end ? [6, 8] : reach(CX, CY, CH, "L", handL)};
  const phoneS = end ? 1 : 1 - eio(prog(f, t + 12, 18));
  return {arms, phoneS, a1, tapNear: a1};
};

const SellerArms = (f: number, nn: number | null, tap: number): Arms => {
  const open = nn === null ? 0 : eio(prog(f, nn - 22, 20));
  const bag = Math.sin(f / 26) * 0.5 + 0.5;
  const R = reach(SX, SY, SH, "R", [SX + 62 + bag * 14, SY - 190 + bag * 8]);
  const L = open > 0.001 ? reach(SX, SY, SH, "L", mix2([SX - 100, SY - 205], [1108, 612], open)) : reach(SX, SY, SH, "L", [SX - 100, SY - 205 + Math.sin(f / 31) * 4]);
  return {L, R};
};

const Rings: React.FC<{f: number; t: number; x: number; y: number}> = ({f, t, x, y}) => {
  const els: React.ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    const u = prog(f, t + i * 7, 38);
    if (u <= 0 || u >= 1) continue;
    els.push(<circle key={i} cx={x} cy={y} r={20 + eo(u) * 150} fill="none" stroke="#8fe0ff" strokeWidth={7 * (1 - u) + 1} opacity={0.9 * (1 - u)}/>);
  }
  const g = prog(f, t, 60);
  return (
    <g>
      {g > 0 && g < 1 && <circle cx={x} cy={y} r={90} fill="url(#ak-sunglow)" opacity={0.9 * (1 - g)}/>}
      {els}
      {[0, 1].map((i) => { const u = prog(f, t + 6 + i * 10, 46); if (u <= 0 || u >= 1) return null; const nx = x + 20 + i * 44, ny = y - 90 - u * 70; return (
        <g key={`n${i}`} transform={`translate(${nx} ${ny}) rotate(${i ? 10 : -8})`} opacity={Math.sin(u * Math.PI)}>
          <ellipse cx={0} cy={0} rx={9} ry={6.4} fill="#1d6fb0" transform="rotate(-20)"/><path d="M8,-2 L8,-32 Q20,-26 20,-14" stroke="#1d6fb0" strokeWidth={3.4} fill="none" strokeLinecap="round"/></g>); })}
      {[0, 1, 2].map((i) => { const u = prog(f, t + i * 5, 34); if (u <= 0 || u >= 1) return null; return <path key={`a${i}`} d={`M${x + 60 + i * 24},${y - 36} q14,36 0,72`} stroke="#1d6fb0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7 * Math.sin(u * Math.PI)}/>; })}
    </g>
  );
};

const NoNote: React.FC<{f: number; t: number}> = ({f, t}) => {
  const a = eo(prog(f, t, 14));
  if (a <= 0.001) return null;
  const dash = f * 0.8;
  return (
    <g opacity={a}>
      <circle cx={700} cy={658} r={54 + (1 - a) * 12} fill="#fff7e0" fillOpacity={0.2} stroke="#c0392b" strokeWidth={4.4} strokeDasharray="4 12" strokeLinecap="round" strokeDashoffset={-dash}/>
      <circle cx={884} cy={658} r={54 + (1 - a) * 12} fill="#fff7e0" fillOpacity={0.2} stroke="#c0392b" strokeWidth={4.4} strokeDasharray="4 12" strokeLinecap="round" strokeDashoffset={-dash}/>
      <circle cx={1108} cy={618} r={56 + (1 - a) * 12} fill="#fff7e0" fillOpacity={0.2} stroke="#c0392b" strokeWidth={4.4} strokeDasharray="4 12" strokeLinecap="round" strokeDashoffset={dash}/>
      <g transform={`translate(${977} ${496 - (1 - a) * 14})`}>
        <rect x={-92} y={-27} width={184} height={54} rx={27} fill="#fff7e4" stroke="#c0392b" strokeWidth={3} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.35))"}}/>
        <text x={0} y={11} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={31} letterSpacing="0.1em" fill="#a8281c">NO NOTE</text>
      </g>
    </g>
  );
};

export const Glide: React.FC<{f: number; t0: number; d: number; a: [number, number]; b: [number, number]; size: number; lift: number}> = ({f, t0, d, a, b, size, lift}) => {
  const u = prog(f, t0, d);
  if (u <= 0 || u >= 1) return null;
  const e = eio(u), p = arc(a, b, lift, e);
  const trail = Array.from({length: 7}, (_, i) => { const q = arc(a, b, lift, eio(clamp(u - (i + 1) * 0.035))); return <rect key={i} x={q[0] - size / 2} y={q[1] - size * 0.2} width={size} height={size * 0.4} rx={6} fill="#ffd36a" opacity={0.34 - i * 0.045}/>; });
  return (
    <g>
      {trail}
      <circle cx={p[0]} cy={p[1]} r={size * 0.95} fill="url(#ak-sunglow)" opacity={0.9}/>
      <rect x={p[0] - size / 2} y={p[1] - size * 0.2} width={size} height={size * 0.4} rx={7} fill="#ffd36a" stroke="#c28a14" strokeWidth={2.4}/>
      <rect x={p[0] - size / 2 + 6} y={p[1] - size * 0.2 + 5} width={size * 0.5} height={5} rx={2.5} fill="#fff" opacity={0.7}/>
    </g>
  );
};

export const PhonePayArt: React.FC<AP> = (p) => {
  const {f, dur} = p, end = (p.spec as any).mode === "end", L = rlabs(p);
  const tap = end ? 78 : p.at("tap"), nn = end ? null : p.at("nn"), bm = end ? p.at("bm") : 0;
  const pose = custPose(f, tap, end), sign = end ? 0 : eo(prog(f, L[0]?.at ?? 96, 20));
  const post = f > tap;
  const qrGlow = bump(f, tap - 4, 40);
  const heldR = (
    <g transform="translate(2.6 -3.6) rotate(-14)"><Phone s={0.17 * pose.phoneS} screen={post ? "pay" : "idle"} glow={bump(f, tap, 40)}/></g>
  );
  const street = (
    <g>
      <StreetBG f={f} dur={dur} variant="fruit"/>
      <CartBack f={f}/>
      <Adult x={SX} y={SY} h={SH} f={f} seed={5} look={SELLER} arms={SellerArms(f, nn, tap)} hands={{L: nn !== null && f > nn - 20 ? "open" : "relax", R: "relax"}} lookX={-0.7} smile={0.8} legsHidden/>
      <CartFront f={f} sign={sign} text={L[0]?.text ?? ""} qrGlow={qrGlow}/>
      <Adult x={CX} y={CY} h={CH} f={f} seed={3} look={CUST} arms={pose.arms} hands={{R: pose.phoneS > 0.05 ? "fist" : "open", L: !end && f > tap + 4 ? "open" : "relax"}} lookX={0.7} smile={0.6} held={{R: pose.phoneS > 0.02 ? heldR : undefined}}/>
      <Rings f={f} t={tap} x={1030} y={end ? 640 : 626}/>
    </g>
  );
  // account bars
  const BW = end ? 100 : 70, BH = end ? 38 : 36, CAP = 8;
  const cx = end ? 560 : 540, sx = end ? 1360 : 1716, base = end ? 450 : 700;
  const appear = end ? ease(f, 6, 24) : ease(f, tap + 2, 22);
  const t0 = end ? bm : tap + 20, gd = end ? 40 : 32;
  const moved = prog(f, t0 + gd, 10);
  const custBlocks = 6 - (f > t0 ? 1 : 0), sellBlocks = 3 + (f >= t0 + gd ? 1 : 0);
  const settle = f >= t0 + gd ? Math.sin(Math.PI * clamp((f - t0 - gd) / 14)) * 5 : 0;
  const topC: [number, number] = [cx, base - 6 * BH + 4], topS: [number, number] = [sx, base - 3 * BH - 6];
  const bars = (
    <g opacity={appear} transform={`translate(0 ${(1 - appear) * 40})`}>
      <AccountBar x={cx} baseY={base} w={BW} bh={BH} blocks={custBlocks} col={["#4f9ad8", "#1f5f9a"]} cap={CAP} tag="BANK ACCOUNT" tagA={0.9} tagSize={end ? 20 : 17}/>
      <AccountBar x={sx} baseY={base} w={BW} bh={BH} blocks={sellBlocks} col={["#58b27a", "#2a7a4a"]} cap={CAP} tag="BANK ACCOUNT" tagA={0.9} tagSize={end ? 20 : 17}/>
      {settle > 0.1 && <rect x={sx - BW / 2 - 4} y={base - 4 * BH + 2 - settle} width={BW + 8} height={BH} rx={7} fill="none" stroke="#ffd36a" strokeWidth={3} opacity={0.8 * (1 - moved * 0.4)}/>}
      <Glide f={f} t0={t0} d={gd} a={topC} b={topS} size={end ? 82 : 50} lift={end ? 120 : 190}/>
    </g>
  );
  if (!end) {
    return (
      <g>
        {street}
        {bars}
        <NoNote f={f} t={nn as number}/>
      </g>
    );
  }
  // end: the street seen closer, shifted down; an infographic panel above holds the big phone and the two bars
  const k = 1.1, shift = 250, a = ease(f, 0, 20);
  const bigPay = post ? "pay" : "idle";
  return (
    <g>
      <rect x={-60} y={-300} width={W + 120} height={800} fill="url(#e1-sky)"/>
      <g transform={`translate(960 ${640 + shift}) scale(${k}) translate(-960 -640)`}>{street}</g>
      <rect x={250} y={96} width={1420} height={414} rx={30} fill="#fff8e8" fillOpacity={0.72} stroke="#c28a52" strokeWidth={2} opacity={a} style={{filter: "drop-shadow(0 26px 30px rgba(80,44,18,.35))"}}/>
      <g opacity={a}>
        <path d="M900,560 L860,330 M1032,572 L1070,330" stroke="#c28a52" strokeWidth={2.4} strokeDasharray="6 8" opacity={0.7}/>
        <g transform="translate(960 232)">
          {post && <circle r={170} fill="url(#ak-sunglow)" opacity={0.55 * bump(f, tap, 80)}/>}
          <Phone s={2.7} screen={bigPay as any} glow={bump(f, tap, 50)}/>
        </g>
        {bars}
      </g>
    </g>
  );
};

export const PhonePayLabels: React.FC<AP> = (p) => {
  const end = (p.spec as any).mode === "end", L = rlabs(p);
  if (!end || !L[0]) return null;
  return <P2Card cx={960} y={338} text={L[0].text} f={p.f} at={L[0].at} size={31} maxW={560} upper={false}/>;
};
