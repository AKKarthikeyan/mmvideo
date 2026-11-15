// ECO-16 Part 1, builder E1: the provision shop. `legal-tender` (a note offered, a push-back, a red hand-stop, the note accepted), `cheque` (a cheque is written and handed over;
// a block rises from the buyer's account bar into the shop's) and `not-tender` (the shopkeeper nods, can wave the cheque away; two stamps flip in).
import React from "react";
import {SANS, SERIF, W, clamp, eo, eio} from "../kit";
import {prog} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {ShopBG, Counter} from "./analogy_e1_bg";
import {Adult, AccountBar, Note, reach, mix2, ease, bump, type Arms, type Look} from "./analogy_e1_kit";
import {Glide} from "./analogy_e1_pay";
import type {AP} from "./analogy_kit";

type P = [number, number];
const CX = 730, CY = 1040, CH = 600;     // the customer, in front of the counter
const SX = 1200, SY = 1000, SHh = 560;   // the shopkeeper, behind it
const CUST: Look = {kind: "plain", shirt: ["#a84a3a", "#7a2f24"], pants: "#6b5b4a", hair: "#1a120d", skin: 0};
const SHOP: Look = {kind: "plain", shirt: ["#e8e0c4", "#b8a888"], pants: "#3a3f52", hair: "#8a8a86", skin: 1, stache: true, glasses: true};

const restC = (side: "L" | "R"): P => [CX + (side === "R" ? 74 : -74), 770];
const restS = (side: "L" | "R"): P => [SX + (side === "R" ? 62 : -62), 742];

/** a cheque, natural size 300 x 130 (origin at its centre). `sig` is the signature's progress 0..1 */
export const Cheque: React.FC<{s?: number; sig?: number; rot?: number}> = ({s = 1, sig = 1, rot = 0}) => (
  <g transform={`rotate(${rot}) scale(${s})`} style={{filter: "drop-shadow(0 8px 6px rgba(40,22,8,.4))"}}>
    <rect x={-150} y={-65} width={300} height={130} rx={6} fill="#f7f1dc" stroke="#9a8a5a" strokeWidth={2.4}/>
    <rect x={-146} y={-61} width={292} height={122} rx={4} fill="none" stroke="#7fa0b8" strokeWidth={1.2} opacity={0.7}/>
    <rect x={-142} y={-57} width={96} height={26} rx={4} fill="#1f4f86"/>
    <path d="M-132,-40 L-122,-52 L-112,-40 Z M-130,-40 h16 v4 h-16 Z" fill="#e8dcc0"/>
    <text x={-78} y={-38} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={15} letterSpacing="0.22em" fill="#f4ead0">BANK</text>
    <text x={-140} y={-6} fontFamily={SANS} fontWeight={800} fontSize={13} letterSpacing="0.2em" fill="#5a6a7a">PAY</text>
    <path d="M-106,-6 H100" stroke="#5a6a7a" strokeWidth={1.6}/><path d="M-140,18 H100" stroke="#5a6a7a" strokeWidth={1.6}/>
    <rect x={106} y={-26} width={36} height={32} rx={3} fill="none" stroke="#1f4f86" strokeWidth={2}/>
    <text x={124} y={-4} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={22} fill="#1f4f86">₹</text>
    <path d="M30,50 q14,-26 28,-4 q10,16 24,-14 q12,-14 22,6 q10,12 26,-6" stroke="#1d2a6a" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - sig)}/>
    <path d="M24,52 H138" stroke="#5a6a7a" strokeWidth={1.2}/>
    {Array.from({length: 22}, (_, i) => <rect key={i} x={-140 + i * 12.6} y={50} width={i % 3 === 0 ? 5 : 3} height={9} fill="#2a2a30" opacity={0.7}/>)}
  </g>
);
const Pen: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(28)`}><rect x={-3} y={-60} width={6} height={64} rx={3} fill="#1f3a6a" stroke="#0e1e3a" strokeWidth={1.4}/><path d="M-3,4 L3,4 L0,13 Z" fill="#d9b04a" stroke="#6a4a10" strokeWidth={1}/><rect x={-3} y={-60} width={6} height={10} rx={3} fill="#c9a23a"/></g>
);
const Till: React.FC = () => (
  <g transform="translate(1480 700)">
    <rect x={-70} y={-96} width={140} height={96} rx={8} fill="#7a5a2a" stroke="#3a2a10" strokeWidth={2.4}/>
    <rect x={-56} y={-130} width={112} height={44} rx={6} fill="#2a3a34" stroke="#101a16" strokeWidth={2}/><rect x={-46} y={-122} width={92} height={22} rx={3} fill="#9fd8b8" opacity={0.7}/>
    {Array.from({length: 12}, (_, i) => <circle key={i} cx={-42 + (i % 6) * 17} cy={-76 + Math.floor(i / 6) * 22} r={6} fill="#e8d8a0" stroke="#3a2a10" strokeWidth={1.2}/>)}
    <rect x={-70} y={-8} width={140} height={8} fill="#3a2a10"/>
  </g>
);
const StopHand: React.FC<{x: number; y: number; a: number; k: number}> = ({x, y, a, k}) => {
  if (a <= 0.01) return null;
  const o = Array.from({length: 8}, (_, i) => { const t = ((i + 0.5) / 8) * Math.PI * 2; return `${Math.cos(t) * 64},${Math.sin(t) * 64}`; }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={a}>
      <circle r={96} fill="#e0402a" opacity={0.28} filter="url(#ak-blur22)"/>
      <polygon points={o} fill="#d83a26" stroke="#fff4e0" strokeWidth={6} strokeLinejoin="round" style={{filter: "drop-shadow(0 10px 8px rgba(80,20,10,.45))"}}/>
      <g fill="#fff4e0">
        <rect x={-26} y={-6} width={52} height={40} rx={18}/>
        {[[-22, -42, 10], [-9, -50, 10], [5, -50, 10], [18, -42, 10]].map(([fx, fy], i) => <rect key={i} x={fx} y={fy} width={11} height={44 - (i === 0 || i === 3 ? 6 : 0)} rx={5.5}/>)}
        <rect x={-42} y={4} width={34} height={11} rx={5.5} transform="rotate(-36 -30 10)"/>
      </g>
    </g>
  );
};
const Stage: React.FC<{f: number; arms: {c: Arms; s: Arms}; cHands?: {L?: any; R?: any}; sHands?: {L?: any; R?: any}; cSmile?: number; sSmile?: number; sNod?: number; cLook?: number; sLook?: number; children?: React.ReactNode; front?: React.ReactNode}> =
  ({f, arms, cHands, sHands, cSmile = 0.3, sSmile = 0.5, sNod = 0, cLook = 0.6, sLook = -0.6, children, front}) => (
  <g>
    <ShopBG f={f}/>
    <Adult x={SX} y={SY} h={SHh} f={f} seed={41} look={SHOP} arms={arms.s} hands={sHands} lookX={sLook} smile={sSmile} nod={sNod} legsHidden/>
    <Till/>
    <Counter y0={700}/>
    {children}
    <Adult x={CX} y={CY} h={CH} f={f} seed={42} look={CUST} arms={arms.c} hands={cHands} lookX={cLook} smile={cSmile}/>
    {front}
  </g>
);

// ---- legal-tender ------------------------------------------------------------------------------------------------------------------
export const LegalArt: React.FC<AP> = (p) => {
  const {f} = p, cr = p.at("cr"), lt = p.at("lt"), rf = p.at("rf"), q = p.at("q");
  const O: P = [935, 636], PUSH: P = [1042, 640];
  const ext = eio(prog(f, Math.min(cr, lt) - 34, 28)), pushU = eio(prog(f, rf - 44, 22)), acc = prog(f, rf + 56, 30);
  const accA = eio(clamp(acc * 2)), accB = eio(clamp(acc * 2 - 1)), back = pushU * (1 - accA) * 22;
  const cRet = eio(prog(f, rf + 90, 24));
  const cR = mix2(mix2(mix2(restC("R"), O, ext), [O[0] - back, O[1]], 1), restC("R"), cRet);
  const chest: P = [SX - 24, 700];
  const sL = mix2(mix2(mix2(restS("L"), PUSH, pushU), O, accA), chest, accB);
  const arms = {c: {L: reach(CX, CY, CH, "L", restC("L")), R: reach(CX, CY, CH, "R", cR)}, s: {L: reach(SX, SY, SHh, "L", sL), R: reach(SX, SY, SHh, "R", restS("R"))}};
  const noteAt: P = f < rf + 56 + 15 ? cR : sL;
  const stopA = ease(f, rf, 12) * (1 - eo(prog(f, rf + 56, 14))), vis = f < rf + 56 + 30 + 18 ? 1 : 0;
  const noteS = 0.5 * (1 - eo(prog(f, rf + 56 + 28, 10)));
  const qa = ease(f, q, 16), ng = bump(f, lt, 70);
  return (
    <Stage f={f} arms={arms} cHands={{R: "open"}} sHands={{L: "open"}} cSmile={0.35} sSmile={f > rf + 56 ? 0.9 : -0.3} sNod={bump(f, rf + 80, 34) * 2.6}
      front={<g>
        {vis > 0 && noteS > 0.01 && (
          <g transform={`translate(${noteAt[0]} ${noteAt[1] - 6}) rotate(${-8 + (f < rf ? 0 : 0)})`}>
            {ng > 0.01 && <circle r={120} fill="url(#ak-sunglow)" opacity={0.95 * ng}/>}
            <Note s={noteS}/>
          </g>)}
        <StopHand x={PUSH[0] + 6} y={PUSH[1] - 30} a={stopA} k={0.6 + 0.4 * ease(f, rf, 10)}/>
        {qa > 0.01 && (
          <g transform={`translate(1700 ${430 + Math.sin(f / 14) * 12})`} opacity={qa}>
            <circle r={66} fill="#fff8e8" stroke="#c28a52" strokeWidth={3} style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.35))"}}/>
            <text x={0} y={36} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={110} fill="#a8281c">?</text>
          </g>)}
      </g>}/>
  );
};
export const LegalLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  const by = (k: string) => L.find((_, i) => ((p.spec as any).labels[i].key === k));
  const lt = by("lt"), cr = by("cr"), rf = by("rf");
  return <>
    {lt && <P2Card cx={960} y={72} text={lt.text} f={p.f} at={lt.at} size={64} maxW={1200}/>}
    {cr && <P2Card cx={960} y={206} text={cr.text} f={p.f} at={cr.at} size={30} maxW={980} upper={false}/>}
    {rf && <P2Card cx={1010} y={322} text={rf.text} f={p.f} at={rf.at} size={36} maxW={520} tone="cool"/>}
  </>;
};

// ---- bars shared by cheque ---------------------------------------------------------------------------------------------------
const Bars: React.FC<{f: number; t0: number; d: number; a: number}> = ({f, t0, d, a}) => {
  const bh = 30, base = 540, cx = 880, sx = 1090;
  const moved = f >= t0 + d, cB = 6 - (f > t0 ? 1 : 0), sB = 3 + (moved ? 1 : 0), settle = moved ? Math.sin(Math.PI * clamp((f - t0 - d) / 14)) * 5 : 0;
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
      <rect x={cx - 70} y={base - 8 * bh - 24} width={sx - cx + 140} height={8 * bh + 78} rx={26} fill="#fff8e8" fillOpacity={0.66} stroke="#c28a52" strokeWidth={2} style={{filter: "drop-shadow(0 14px 14px rgba(80,44,18,.3))"}}/>
      <AccountBar x={cx} baseY={base} w={66} bh={bh} blocks={cB} col={["#4f9ad8", "#1f5f9a"]} cap={8} tag="BUYER" tagSize={17}/>
      <AccountBar x={sx} baseY={base} w={66} bh={bh} blocks={sB} col={["#58b27a", "#2a7a4a"]} cap={8} tag="SHOP" tagSize={17}/>
      {settle > 0.1 && <rect x={sx - 37} y={base - 4 * bh + 2 - settle} width={74} height={bh} rx={7} fill="none" stroke="#ffd36a" strokeWidth={3} opacity={0.8}/>}
      <Glide f={f} t0={t0} d={d} a={[cx, base - 6 * bh + 4]} b={[sx, base - 3 * bh - 6]} size={56} lift={130}/>
    </g>
  );
};

// ---- cheque -----------------------------------------------------------------------------------------------------------------
export const ChequeArt: React.FC<AP> = (p) => {
  const {f} = p, ch = p.at("ch");
  const c0: P = [900, 668], M2: P = [1040, 652];
  const hv = eio(prog(f, ch + 6, 42)), pull = eio(prog(f, ch + 60, 30));
  const c: P = mix2(mix2(c0, M2, hv), [1100, 690], pull);
  const write = prog(f, 4, Math.max(20, ch - 20)), grip = eio(prog(f, ch - 8, 12));
  const penP: P = [c0[0] - 20 + write * 90 + Math.sin(f / 2.1) * 6, c0[1] + 2 + Math.sin(f / 1.7) * 4];
  const gripP: P = [c[0] - 118, c[1] + 6];
  const cRt = mix2(mix2(penP, gripP, grip), restC("R"), eio(prog(f, ch + 62, 26)));
  const cLt = mix2([c0[0] - 128, c0[1] + 24], restC("L"), eio(prog(f, ch + 6, 20)));
  const take = eio(prog(f, ch + 20, 22)), rel = eio(prog(f, ch + 70, 24));
  const sLt = mix2(mix2(restS("L"), [c[0] + 116, c[1] - 2], take), [SX - 40, 690], pull);
  const arms = {c: {L: reach(CX, CY, CH, "L", cLt), R: reach(CX, CY, CH, "R", cRt)}, s: {L: reach(SX, SY, SHh, "L", sLt), R: reach(SX, SY, SHh, "R", restS("R"))}};
  const appear = ease(f, 6, 22);
  return (
    <Stage f={f} arms={arms} cHands={{L: "open", R: "fist"}} sHands={{L: "open"}} cSmile={0.4} sSmile={0.7} sNod={bump(f, ch + 70, 30) * 2.4}
      front={<g>
        <g transform={`translate(${c[0]} ${c[1]})`}><Cheque s={0.78} sig={write} rot={-3 + hv * 3}/></g>
        {f < ch - 6 && <Pen x={penP[0] + 6} y={penP[1] - 6}/>}
        <Bars f={f} t0={ch + 22} d={46} a={appear}/>
      </g>}/>
  );
};
export const ChequeLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return <>
    {L[1] && <P2Card cx={960} y={72} text={L[1].text} f={p.f} at={L[1].at} size={56} maxW={1300}/>}
    {L[2] && <P2Card cx={960} y={190} text={L[2].text} f={p.f} at={L[2].at} size={32} maxW={700} upper={false}/>}
    {L[0] && <P2Card cx={960} y={790} text={L[0].text} f={p.f} at={L[0].at} size={34} maxW={720} upper={false}/>}
  </>;
};

// ---- not-tender -----------------------------------------------------------------------------------------------------------------
const Stamp: React.FC<{cx: number; cy: number; text: string; f: number; at: number; fill: string; ink: string; edge: string; rot: number}> = ({cx, cy, text, f, at, fill, ink, edge, rot}) => {
  const u = prog(f, at, 20);
  if (u <= 0) return null;
  const flip = u < 0.75 ? eo(u / 0.75) * 1.12 : 1.12 - 0.12 * eo((u - 0.75) / 0.25);
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(1 ${flip})`} opacity={Math.min(1, u * 4)}>
      <rect x={-210} y={-58} width={420} height={116} rx={22} fill={fill} stroke={edge} strokeWidth={5} style={{filter: "drop-shadow(0 16px 12px rgba(40,22,8,.45))"}}/>
      <rect x={-196} y={-46} width={392} height={92} rx={14} fill="none" stroke={ink} strokeWidth={2.4} opacity={0.65}/>
      <text x={0} y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={42} textLength={Math.min(364, text.length * 25)} lengthAdjust="spacingAndGlyphs" fill={ink}>{text}</text>
      <path d="M-196,-46 Q-100,-60 0,-58 L-60,-46 Z" fill="#fff" opacity={0.18}/>
    </g>
  );
};
export const NotTenderArt: React.FC<AP> = (p) => {
  const {f} = p, L = rlabs(p), rf = p.at("rf"), dm = p.at("dm"), nt = p.at("nt");
  const held: P = [1030, 650], lay: P = [1010, 688];
  const drop = eio(prog(f, rf - 34, 16)), wv = eio(prog(f, rf - 20, 12)) * (1 - eio(prog(f, nt + 10, 20)));
  const c: P = mix2(held, lay, drop);
  const sLt = f < rf - 34 ? mix2(restS("L"), [c[0] + 112, c[1] - 4], eio(prog(f, 0, 20))) : mix2([1146, 646], [1010 + Math.sin(f / 3.1) * 40, 628], wv);
  const sL: P = f < rf - 34 ? sLt : mix2(mix2([1146, 646], [1010 + Math.sin(f / 3.1) * 40, 628], wv), restS("L"), eio(prog(f, nt + 20, 24)));
  const arms = {c: {L: reach(CX, CY, CH, "L", restC("L")), R: reach(CX, CY, CH, "R", restC("R"))}, s: {L: reach(SX, SY, SHh, "L", sL), R: reach(SX, SY, SHh, "R", restS("R"))}};
  return (
    <Stage f={f} arms={arms} cHands={{}} sHands={{L: "open"}} cSmile={-0.3} sSmile={f < rf ? 0.8 : 0.1} sNod={f < rf - 34 ? bump(f, 14, 40) * 2.8 : 0}
      front={<g>
        <g transform={`translate(${c[0]} ${c[1]})`}><Cheque s={0.78} rot={-3 + drop * 3}/></g>
        {L[1] && <Stamp cx={700} cy={290} text={L[1].text} f={f} at={dm} fill="#2f8a4a" ink="#effbe8" edge="#17542a" rot={-5}/>}
        {L[2] && <Stamp cx={1250} cy={290} text={L[2].text} f={f} at={nt} fill="#f0b030" ink="#5a3408" edge="#a8700e" rot={4}/>}
      </g>}/>
  );
};
export const NotTenderLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return L[0] ? <P2Card cx={960} y={72} text={L[0].text} f={p.f} at={L[0].at} size={52} maxW={1400}/> : null;
};
