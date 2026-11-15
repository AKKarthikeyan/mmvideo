// ECO-16 Part 2, builder F1: `goldsmith` (3 scenes in the same village set). mode "receipts" (villagers leave gold bars and get paper receipts; the receipts pass hand to hand at a
// stall), mode "lend" (Ramu borrows a bar, pays Ali, Ali re-deposits it and only then is a fresh receipt written; the pile of receipts in use counts from `gold` to `receipts`),
// mode "moral" (a glow round the new receipts, a thought bubble, a stamp, a bank building fading in). Motion is a function of f and at(key); events are the label keys.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Adult, handPos, type Arms, type Look} from "./analogy_e1_kit";
import {Thought} from "./analogy_e1_props";
import {GoldBar, Receipt, ReceiptPile, Stamp, BankBuilding, House, Stall, VillageOutdoors, F1Defs, pv, E, win, path, px, walkOf, armTo, blend, mixp, type P, type K} from "./analogy_f1_kit";
import {ShopRoom, ShopCounter, Scales, Chest, Pad, SignBoard, LX, CTY, LY, LH, RX, CY0, CH0, HX, PX, SLOT} from "./analogy_f1_room";

const LALA: Look = {kind: "kurta", shirt: ["#efe3c6", "#b9a77c"], pants: "#efe6cf", hair: "#8a8a86", skin: 1, glasses: true, stache: true};
const RAMU: Look = {kind: "pagri", accent: "#c8401d", shirt: ["#eee2c0", "#bfae86"], pants: "#efe6cf", hair: "#2a1c14", skin: 2, stache: true};
const ALI: Look = {kind: "gamcha", shirt: ["#6c8fb5", "#41607f"], pants: "#3a3f52", hair: "#1a120d", skin: 1, stache: true};
const VA: Look = {kind: "saree", accent: "#b23a48", female: true, skin: 3, shirt: ["#d98a8a", "#a65a5a"], hair: "#1a120d"};
const VB: Look = {kind: "plain", shirt: ["#7fa58a", "#4d7358"], pants: "#5a4a3a", skin: 0, hair: "#2b1d14"};
const SELL: Look = {kind: "gamcha", shirt: ["#d9b26a", "#a5782e"], pants: "#6b5b4a", skin: 2, stache: true, hair: "#2b1d14"};
const VD: Look = {kind: "saree", accent: "#2f7a8a", female: true, skin: 3, hair: "#1a120d", shirt: ["#8fb5c0", "#4d7a86"]};
const STALL_X = 1180, STALL_W = 580;
const SHX: P = [1330, 628], SELX = 1480, DX = 1720;
const CY1 = 904, CH1 = 480;                 // a person behind a counter

const GoldBarHeld: React.FC = () => <g transform="translate(2 -1)"><GoldBar s={0.2}/></g>;
const ReceiptHeld: React.FC = () => <g transform="translate(2 -1) rotate(-10)"><Receipt s={0.19}/></g>;
const Pen: React.FC = () => <path d="M0,2 L-1.6,-9" stroke="#2a1a10" strokeWidth={1.1} strokeLinecap="round"/>;

/** the glowing trail behind a free item: the item's earlier positions */
const Trail: React.FC<{f: number; pos: (t: number) => P; t0: number; t1: number; col?: string}> = ({f, pos, t0, t1, col = "#ffd36a"}) => (
  <g>
    {Array.from({length: 18}, (_, k) => {
      const a = f - (k + 1) * 2.4, b = f - k * 2.4;
      if (a < t0 || b > t1 + 6) return null;
      const pa = pos(a), pb = pos(Math.min(b, t1));
      return <path key={k} d={`M${pa[0]},${pa[1]} L${pb[0]},${pb[1]}`} stroke={col} strokeWidth={14 * (1 - k / 22)} strokeLinecap="round" opacity={0.5 * (1 - k / 19)}/>;
    })}
  </g>
);

const Lala: React.FC<{f: number; arms: Arms; held?: React.ReactNode; look?: number; nod?: number; smile?: number; headRot?: number; talk?: boolean; hand?: "relax" | "open" | "fist"}> =
  ({f, arms, held, look = 0.7, nod = 0, smile = 0.5, headRot = 0, talk = false, hand = "relax"}) => (
  <Adult x={LX} y={LY} h={LH} f={f} seed={41} look={LALA} arms={arms} hands={{R: hand, L: "relax"}} lookX={look} smile={smile} nod={nod} headRot={headRot} talk={talk} held={{R: held}}/>
);

const village = (f: number, dur: number, stall: boolean, glow = 0) => (
  <g>
    <VillageOutdoors f={f} dur={dur} houses glowDoors={glow} sun={[1850, 150]}/>
    {stall && <Stall x={STALL_X} w={STALL_W} f={f}/>}
    <ShopRoom f={f}/>
  </g>
);

// ============================== receipts ==============================================================================================================
const ReceiptsArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, nlTxt = rlabs(p)[0]?.text ?? "";
  const nl = at("nl"), gb = at("gb"), rc = at("rc"), rm = at("rm");
  // timeline (all relative to the label keys)
  const tA = gb, wsA = Math.max(0, gb - 100), arrA = Math.max(wsA + 20, gb - 16), lvA = Math.max(arrA + 30, rc + 62), arrS = Math.max(lvA + 36, rm + 6);
  const tB = rc + 66, tBr = rc + 128;
  const axK: [number, number][] = [[wsA, 2140], [arrA, RX], [lvA, RX], [arrS, 1190]];
  const ax = px(axK, f), awk = walkOf(axK, f);
  const bxK: [number, number][] = [[rc + 6, -150], [tB - 2, RX], [tBr + 40, RX], [tBr + 92, 320]];
  const bx = px(bxK, f), bwk = walkOf(bxK, f);
  // gold bars: A's bar, B's bar
  const barA: K[] = [[tA + 6, HX[0], HX[1]], [tA + 24, HX[0], HX[1]], [tA + 42, SLOT[2][0], SLOT[2][1] + 8]];
  const barB: K[] = [[tB + 6, HX[0], HX[1]], [tB + 24, HX[0], HX[1]], [tB + 42, SLOT[3][0], SLOT[3][1] + 8]];
  const presAll = [1, 1, E(f, tA + 40, 8), E(f, tB + 40, 8)];
  // receipts: A's, B's
  const rA: K[] = [[rc + 12, PX[0], PX[1]], [rc + 28, PX[0], PX[1]], [rc + 50, HX[0], HX[1]]];
  const rB: K[] = [[tBr - 24, PX[0], PX[1]], [tBr - 8, PX[0], PX[1]], [tBr + 16, HX[0], HX[1]]];
  const rS: K[] = [[rm + 14, SHX[0], SHX[1]], [rm + 36, 1340, 630], [rm + 52, 1426, 598], [rm + 74, 1620, 628]];
  // Lala's right hand
  const L = blend([
    [win(f, tA + 10, tA + 46, 8), path(f < tA + 24 ? [[0, HX[0], HX[1]]] as K[] : barA, f)],
    [win(f, tB + 10, tB + 46, 8), path(f < tB + 24 ? [[0, HX[0], HX[1]]] as K[] : barB, f)],
    [win(f, rc - 6, rc + 28, 8), [PX[0] + Math.sin(f * 0.9) * 8, PX[1] - 4 + Math.sin(f * 1.7) * 2]],
    [win(f, rc + 26, rc + 58, 8), path(rA, f)],
    [win(f, tBr - 28, tBr - 4, 8), [PX[0] + Math.sin(f * 0.9) * 8, PX[1] - 4 + Math.sin(f * 1.7) * 2]],
    [win(f, tBr - 6, tBr + 22, 8), path(rB, f)],
  ]);
  const writing = win(f, rc - 6, rc + 28, 6) + win(f, tBr - 28, tBr - 4, 6) > 0.5;
  const lalaArms: Arms = {R: armTo(LX, LY, LH, "R", L.t, L.w), L: [5, 8]};
  const takeA = win(f, tA + 10, tA + 46, 8), takeB = win(f, tB + 10, tB + 46, 8);
  const nodL = Math.max(takeA, takeB, win(f, rc + 28, rc + 56, 8)) * (0.5 + 0.5 * Math.sin(f / 4)) * 1.1;
  // customers' arms
  const wA = win(f, tA - 6, tA + 24, 8);
  const wAr = win(f, rc + 36, rc + 70, 8);
  const wAs = win(f, rm + 2, rm + 30, 8);
  const aArms: Arms = {R: armTo(RX, CY0, CH0, "R", f < rm - 20 ? HX : SHX, Math.max(wA, wAr, wAs)), L: [5, 8]};
  const wB = win(f, tB - 4, tB + 24, 8), wBr = win(f, tBr + 4, tBr + 36, 8);
  const bArms: Arms = {R: armTo(RX, CY0, CH0, "R", HX, Math.max(wB, wBr)), L: [5, 8]};
  const showAbar = f < tA + 6, showBbar = f < tB + 6;
  const aRecHeld = f >= rc + 56, bRecHeld = f >= tBr + 18;
  // the stall: seller C and shopper D
  const cL = win(f, rm + 18, rm + 52, 8), cR = win(f, rm + 46, rm + 80, 8), dW = win(f, rm + 60, rm + 92, 8);
  const sellerArms: Arms = {L: armTo(SELX, CY1, CH1, "L", path(rS, f), cL), R: armTo(SELX, CY1, CH1, "R", path(rS, f), cR)};
  const dArms: Arms = {L: armTo(DX, CY0, CH0, "L", [rS[3][1], rS[3][2]], dW), R: [5, 8]};
  const rsOn = f >= rm + 14 && f < rm + 78;
  const dHolds = f >= rm + 78;
  const shown = (e: number) => clamp(e);
  return (
    <g>
      {village(f, dur, true)}
      <SignBoard x={330} text={nlTxt} a={E(f, nl, 22)} f={f}/>
      {/* the stall people */}
      <Adult x={SELX} y={CY1} h={CH1} f={f} seed={47} look={SELL} arms={sellerArms} hands={{L: "open", R: "open"}} lookX={-0.5} smile={0.6}/>
      <Lala f={f} arms={lalaArms} held={writing ? <Pen/> : undefined} smile={0.4} nod={nodL} look={0.8} hand={writing ? "fist" : "relax"}/>
      <ShopCounter/>
      <Scales x={170} f={f}/>
      <Pad/>
      <Chest pres={presAll} glow={0.5 * Math.max(win(f, tA + 36, tA + 60, 8), win(f, tB + 36, tB + 60, 8))}/>
      {/* villagers in front */}
      <Adult x={ax} y={CY0} h={CH0} f={f} seed={43} look={VA} arms={aArms} hands={{R: "open"}} lookX={-0.6} walkAmt={awk} smile={0.6} held={{R: showAbar ? <GoldBarHeld/> : aRecHeld ? <ReceiptHeld/> : undefined}}/>
      <Adult x={bx} y={CY0} h={CH0} f={f} seed={44} look={VB} arms={bArms} hands={{R: "open"}} lookX={0.7} walkAmt={bwk} smile={0.6} held={{R: showBbar ? <GoldBarHeld/> : bRecHeld ? <ReceiptHeld/> : undefined}}/>
      <Adult x={DX} y={CY0} h={CH0} f={f} seed={48} look={VD} arms={dArms} hands={{L: "open"}} lookX={-0.7} smile={0.6} held={{L: dHolds ? <ReceiptHeld/> : undefined}}/>
      {/* free items: bars in transit, receipts in transit */}
      {f >= tA + 6 && f < tA + 42 && (() => { const p = path(barA, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.5)`}><GoldBar/></g>; })()}
      {f >= tB + 6 && f < tB + 42 && (() => { const p = path(barB, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.5)`}><GoldBar/></g>; })()}
      {f >= rc + 12 && f < rc + 56 && (() => { const p = path(rA, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(${0.82 + 0.1 * E(f, rc + 12, 14)})`} opacity={E(f, rc + 12, 8)}><Receipt s={1} glow={0.5}/></g>; })()}
      {f >= tBr - 24 && f < tBr + 18 && (() => { const p = path(rB, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.9)`} opacity={E(f, tBr - 24, 8)}><Receipt s={1} glow={0.5}/></g>; })()}
      {rsOn && <g><Trail f={f} pos={(t) => path(rS, t)} t0={rm + 14} t1={rm + 74}/>{(() => { const p = path(rS, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.95)`}><Receipt s={1} glow={0.9} rot={Math.sin(f / 5) * 4}/></g>; })()}</g>}
    </g>
  );
};

// ============================== lend ===================================================================================================================
const LendArt: React.FC<AP> = ({f, dur, at}) => {
  const rk = at("rk"), na = at("na"), al = at("al"), t125 = at("t125");
  const D = Math.max(120, al - na);
  const gold = pv("e16_lala", "gold"), receipts = pv("e16_lala", "receipts");
  const tl = na + 0.22 * D, tWalk = tl + 40, tpay = Math.max(tWalk + 40, na + 0.6 * D), tgo = tpay + 24;
  // after Ali re-deposits (key al): he walks back, hands the bar over, Lala writes a fresh receipt, Ali puts it on the pile
  const aArr = al + 48, tw0 = al + 78;
  const arr = Math.max(18, rk - 6), x0 = Math.max(-150, RX - 8 * arr);
  const ramK: [number, number][] = [[0, x0], [arr, RX], [tWalk, RX], [tpay - 8, 1090], [tgo, 1090], [tgo + 110, 2160]];
  const rx = px(ramK, f), rwk = walkOf(ramK, f);
  const aliK: [number, number][] = [[0, 1330], [al, 1330], [aArr, RX]];
  const ax = px(aliK, f), awk = walkOf(aliK, f);
  const AHX: P = [1215, 630];
  const barOut: K[] = [[tl + 6, SLOT[3][0], SLOT[3][1] + 8], [tl + 30, HX[0], HX[1]]];
  const barIn: K[] = [[al + 46, HX[0], HX[1]], [al + 54, HX[0], HX[1]], [al + 74, SLOT[3][0], SLOT[3][1] + 8]];
  const slot3 = clamp(f < al ? 1 - E(f, tl + 4, 10) : E(f, al + 72, 8));
  const presAll = [1, 1, 1, slot3];
  const rcpt: K[] = [[tw0 + 4, PX[0], PX[1]], [tw0 + 16, PX[0], PX[1]], [tw0 + 32, HX[0], HX[1]]];
  const toPile: P = [868, 626];
  const rPile: K[] = [[tw0 + 40, HX[0], HX[1]], [tw0 + 58, toPile[0], toPile[1]]];
  const pileN = 6 + (f > tw0 + 58 ? 1 : 0);
  const Lh = blend([
    [win(f, tl - 4, tl + 34, 8), path([[0, SLOT[3][0], SLOT[3][1] + 8], ...barOut], f)],
    [win(f, al + 52, al + 80, 8), path([[0, HX[0], HX[1]], ...barIn], f)],
    [win(f, tw0 - 2, tw0 + 18, 8), [PX[0] + Math.sin(f * 0.9) * 8, PX[1] - 4 + Math.sin(f * 1.7) * 2]],
    [win(f, tw0 + 16, tw0 + 38, 8), path(rcpt, f)],
  ]);
  const writing = win(f, tw0 - 2, tw0 + 18, 6) > 0.5;
  const lookV = win(f, na, na + 0.2 * D, 12);
  const nodL = win(f, na + 0.14 * D, na + 0.26 * D, 8) * (0.5 + 0.5 * Math.sin(f / 4)) * 1.2;
  const lalaArms: Arms = {R: armTo(LX, LY, LH, "R", Lh.t, Lh.w), L: [5, 8]};
  // Ramu asks, takes the bar, pays Ali
  const ask = win(f, rk, na, 12);
  const rTake = win(f, tl + 8, tl + 46, 8), rPay = win(f, tpay - 12, tpay + 22, 8);
  const ramArms: Arms = {R: armTo(rx, CY0, CH0, "R", rPay > 0.3 ? AHX : rTake > ask ? HX : [rx + 130, 570 + Math.sin(f / 6) * 14], Math.max(rTake, rPay, ask * 0.85)), L: [5, 8]};
  const ramHolds = f >= tl + 34 && f < tpay + 6;
  // Ali takes the bar from Ramu, carries it, hands it over; takes the receipt, puts it on the pile
  const aWait = win(f, tpay - 12, tpay + 22, 8), aGive = win(f, al + 40, al + 66, 8), aTake = win(f, tw0 + 22, tw0 + 48, 8), aPile = win(f, tw0 + 38, tw0 + 62, 8);
  const aliTarget: P = aPile > 0.3 ? path(rPile, f) : aGive > aTake ? HX : aWait > 0.2 ? AHX : HX;
  const aliArms: Arms = {L: armTo(ax, CY0, CH0, "L", aliTarget, Math.max(aWait, aGive, aTake, aPile)), R: [5, 8]};
  const aliHolds = f >= tpay + 6 && f < al + 46;
  const aliRec = f >= tw0 + 34 && f < tw0 + 40;
  const tp = Math.max(tw0 + 40, t125 - 24);
  const cnt = Math.round(gold.value + (receipts.value - gold.value) * E(f, tp, 30));
  const plate = E(f, tp - 8, 14);
  const bubble = E(f, na, 16) * (1 - E(f, na + 0.36 * D, 14));
  return (
    <g>
      {village(f, dur, true)}
      <SignBoard x={330} text="GOLDSMITH" a={1} f={f}/>
      <Lala f={f} arms={lalaArms} held={writing ? <Pen/> : undefined} look={0.7 + 0.25 * lookV} nod={nodL} smile={0.4} headRot={lookV * 4} hand={writing ? "fist" : "relax"}/>
      <ShopCounter/>
      <Scales x={170} f={f}/>
      <Pad/>
      <Chest pres={presAll} glow={0.35 * Math.max(win(f, tl - 4, tl + 24, 8), win(f, al + 70, al + 100, 8))}/>
      {/* the pile of receipts in circulation, at the counter end */}
      <g><ReceiptPile x={868} y={CTY - 2} s={1.3} n={pileN} glow={0.6 * win(f, tw0 + 56, tw0 + 96, 10)}/></g>
      <Adult x={rx} y={CY0} h={CH0} f={f} seed={45} look={RAMU} arms={ramArms} hands={{R: "open", L: "relax"}} lookX={f < tpay - 20 ? 0.8 : 0.5} walkAmt={rwk} smile={0.4} talk={ask > 0.4 && rTake < 0.3}
        held={{R: ramHolds ? <GoldBarHeld/> : undefined}}/>
      <Adult x={ax} y={CY0} h={CH0} f={f} seed={46} look={ALI} arms={aliArms} hands={{L: "open"}} lookX={-0.7} smile={0.5} walkAmt={awk}
        held={{L: aliHolds ? <GoldBarHeld/> : aliRec ? <ReceiptHeld/> : undefined}}/>
      {/* free items */}
      {f >= tl + 6 && f < tl + 34 && (() => { const p = path(barOut, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.5)`}><GoldBar/></g>; })()}
      {f >= tpay && f < tpay + 8 && <g transform={`translate(${AHX[0]} ${AHX[1]}) scale(0.5)`}><GoldBar/></g>}
      {f >= al + 46 && f < al + 76 && (() => { const p = path(barIn, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.5)`}><GoldBar/></g>; })()}
      {f >= tw0 + 4 && f < tw0 + 34 && (() => { const p = path(rcpt, f); return <g transform={`translate(${p[0]} ${p[1]}) scale(0.9)`} opacity={E(f, tw0 + 4, 8)}><Receipt s={1} glow={0.7}/></g>; })()}
      {f >= tw0 + 40 && f < tw0 + 60 && (() => { const p = path(rPile, f); const arc: P = [p[0], p[1] - 40 * Math.sin(Math.PI * prog(f, tw0 + 40, 18))]; return <g transform={`translate(${arc[0]} ${arc[1]}) scale(0.9)`}><Receipt s={1} glow={0.8}/></g>; })()}
      {/* what Lala is thinking of: a quiet village */}
      <Thought x={600} y={292} r={100} tx={580} ty={420} a={bubble}>
        <g transform="translate(-76 40) scale(0.4)">
          <rect x={-10} y={-190} width={380} height={230} fill="#cfe4ee" opacity={0.85}/>
          <House x={20} y={30} w={170} h={110} wall="#e8cf9f" roof="#b4562e" glow={0.9}/><House x={210} y={30} w={140} h={96} wall="#d9b08a" roof="#9a4228" glow={0.9}/>
          <circle cx={310} cy={-120} r={26} fill="#ffe08a"/><ellipse cx={70} cy={-130} rx={50} ry={16} fill="#fff" opacity={0.9}/>
        </g>
      </Thought>
      {/* the plate over the pile */}
      {plate > 0.01 && (
        <g transform={`translate(890 ${440 + (1 - plate) * 14})`} opacity={plate}>
          <path d="M-60,40 L-60,86 M60,40 L60,86" stroke="#2a2018" strokeWidth={3}/>
          <rect x={-104} y={-44} width={208} height={90} rx={10} fill="#000" opacity={0.3} transform="translate(4 7)"/>
          <rect x={-104} y={-44} width={208} height={90} rx={10} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2.4}/>
          <rect x={-94} y={-34} width={188} height={70} rx={6} fill="#1a2238"/>
          <text x={0} y={-12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={16} letterSpacing="0.26em" fill="#f6e3a8">IN USE</text>
          <text x={0} y={26} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill="#fff0c4">{cnt} kg</text>
        </g>
      )}
    </g>
  );
};

// ============================== moral ==================================================================================================================
const MoralArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, stampTxt = rlabs(p)[1]?.text ?? "";
  const tt = at("tt"), mu = at("mu"), mb = at("mb");
  const bank = E(f, mb - 22, 34);
  const bub = E(f, tt, 16);
  const glow = 0.55 + 0.25 * Math.sin(f / 9);
  const wisps = Array.from({length: 7}, (_, i) => { const u = ((f * 0.011 + i * 0.147) % 1); return {x: Math.sin(i * 2.1 + f / 40) * 62, y: 66 - u * 120, o: Math.sin(Math.PI * u), i}; });
  const rcv = Array.from({length: 3}, (_, i) => { const u = ((f * 0.008 + i * 0.33) % 1); return {x: -56 + i * 56, y: 52 - u * 96, o: Math.sin(Math.PI * u), r: (i - 1) * 12}; });
  const lalaArms: Arms = {R: armTo(LX, LY, LH, "R", [PX[0] + 40, PX[1] - 4], 0.25 + 0.0), L: [5, 8]};
  return (
    <g>
      <F1Defs/>
      <VillageOutdoors f={f} dur={dur} houses={false}/>
      {bank > 0.01 && <g opacity={bank} transform={`translate(0 ${(1 - bank) * 18})`}>
        <ellipse cx={1500} cy={730} rx={380} ry={30} fill="#fff" opacity={0.1}/>
        <BankBuilding x={1290} y={724} w={540} h={330}/>
      </g>}
      <ShopRoom f={f}/>
      <SignBoard x={330} y={142} text="GOLDSMITH" a={1} f={f}/>
      <Lala f={f} arms={lalaArms} look={0.4} smile={0.35} nod={Math.sin(f / 30) * 0.8}/>
      <ShopCounter/>
      <Scales x={170} f={f}/>
      <Chest pres={[1, 1, 1, 1]}/>
      {/* the new receipts on the counter, with a faint glow */}
      <g><ellipse cx={680} cy={CTY - 20} rx={150} ry={64} fill="url(#ak-sunglow)" opacity={glow}/>
        <ReceiptPile x={680} y={CTY - 2} n={9} s={1.5}/></g>
      {/* thin air: wisps and receipts that appear from nowhere inside the bubble */}
      <Thought x={640} y={290} r={118} tx={600} ty={430} a={bub}>
        <g transform="translate(0 6)">
          <circle r={96} fill="#e8f0f6" opacity={0.75}/>
          {wisps.map((w) => <path key={w.i} d={`M${w.x - 10},${w.y} q10,-14 20,0 q10,14 20,0`} stroke="#8aa8bc" strokeWidth={3} fill="none" opacity={0.7 * w.o}/>)}
          {rcv.map((r, i) => <g key={i} transform={`translate(${r.x} ${r.y}) rotate(${r.r})`} opacity={r.o}><Receipt s={0.62}/></g>)}
          <text x={0} y={34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={120} fill="#5a3c0a" opacity={0.5 + 0.2 * Math.sin(f / 8)}>?</text>
        </g>
      </Thought>
      <Stamp x={1040} y={548} text={stampTxt} f={f} at={mu} size={56}/>
    </g>
  );
};
export const GoldArt: React.FC<AP> = (p) => {
  const mode = (p.spec as any).mode ?? "receipts";
  return mode === "lend" ? <LendArt {...p}/> : mode === "moral" ? <MoralArt {...p}/> : <ReceiptsArt {...p}/>;
};

export const GoldLabels: React.FC<AP> = (p) => {
  const mode = (p.spec as any).mode ?? "receipts", L = rlabs(p);
  if (mode === "lend") return (
    <>
      {L[0] && <P2Card cx={940} y={66} text={L[0].text} f={p.f} at={L[0].at} size={34} maxW={460} upper={false}/>}
      {L[1] && <P2Card cx={940} y={178} text={L[1].text} f={p.f} at={L[1].at} size={30} maxW={440} upper={false}/>}
      {L[2] && <P2Card cx={1440} y={66} text={L[2].text} f={p.f} at={L[2].at} size={34} maxW={460} upper={false} tone="cool"/>}
      {L[3] && <P2Card cx={1440} y={178} text={L[3].text} f={p.f} at={L[3].at} size={32} maxW={560} upper={false} tone="green"/>}
    </>
  );
  if (mode === "moral") return (
    <>
      {L[0] && <P2Card cx={900} y={122} text={L[0].text} f={p.f} at={L[0].at} size={38} maxW={560} upper={false}/>}
      {L[2] && <P2Card cx={1530} y={122} text={L[2].text} f={p.f} at={L[2].at} size={32} maxW={640} upper={false} tone="cool"/>}
    </>
  );
  return (
    <>
      {L[1] && <P2Card cx={310} y={268} text={L[1].text} f={p.f} at={L[1].at} size={30} maxW={370} upper={false}/>}
      {L[2] && <P2Card cx={820} y={248} text={L[2].text} f={p.f} at={L[2].at} size={30} maxW={380} upper={false}/>}
      {L[3] && <P2Card cx={1480} y={150} text={L[3].text} f={p.f} at={L[3].at} size={34} maxW={560} upper={false} tone="green"/>}
    </>
  );
};
