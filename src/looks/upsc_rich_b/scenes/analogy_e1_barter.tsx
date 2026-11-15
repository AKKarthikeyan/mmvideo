// ECO-16 Part 1, builder E1: the market lane. `barter` (mode "stuck": a shoe-maker and a wheat farmer cannot trade; mode "coin": a coin appears and the gap closes)
// and `medium-exchange` (the shoe-maker sells shoes for a coin, then spends the same coin on wheat). Motion follows at(key) and dur only.
import React from "react";
import {SANS, SERIF, clamp, eo, eio} from "../kit";
import {FlowArrow, prog} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {StreetBG} from "./analogy_e1_bg";
import {Adult, Coin, reach, mix2, ease, bump, type Arms, type Look} from "./analogy_e1_kit";
import {Cross, Plough, Shoes, Sheaf, ShoeStall, Thought, Tick, WheatSack, WheatStall} from "./analogy_e1_props";
import type {AP} from "./analogy_kit";

const SHOE: Look = {kind: "apron", shirt: ["#e8dcc4", "#b8a888"], pants: "#5a4a3a", hair: "#241812", skin: 1, stache: true};
const FARM: Look = {kind: "pagri", accent: "#c8401d", shirt: ["#eee2c0", "#bfae86"], pants: "#efe6cf", hair: "#2a1c14", skin: 2, stache: true};
const BUYER: Look = {kind: "plain", female: true, shirt: ["#7fa58a", "#4d7358"], pants: "#3a3f52", hair: "#1a120d", skin: 3};
const Y = 930, H0 = 540;
const FX = 1220;
type P = [number, number];

const LaneBG: React.FC<{f: number; dur: number}> = ({f, dur}) => (
  <g>
    <StreetBG f={f} dur={dur} variant="lane" sun={[1560, 180]}/>
    <ShoeStall x={90} w={430} f={f}/>
    <WheatStall x={1470} w={390} f={f}/>
    <g transform="translate(1500 884) rotate(-3)"><Plough s={0.85}/></g>
  </g>
);

// ---- barter -------------------------------------------------------------------------------------------------------------------
export const BarterArt: React.FC<AP> = (p) => {
  const {f, dur} = p, coinMode = (p.spec as any).mode === "coin", L = rlabs(p);
  const ex = coinMode ? -200 : p.at("ex"), sw = coinMode ? 0 : p.at("sw"), gb = coinMode ? p.at("gb") : 1e9, mo = coinMode ? p.at("mo") : 1e9;
  const SX = 700;
  const offer = eio(prog(f, ex - 6, 28)), T1 = sw + 24, T2 = sw + 44, T3 = sw + 80;
  const shake = eio(prog(f, T1, 20)), pointU = eio(prog(f, T2, 18)), shrug = eio(prog(f, T3 + 30, 22));
  const settle = eio(prog(f, gb + 8, 26)), relaxPt = eio(prog(f, gb + 22, 24));
  const sRh = mix2(mix2([SX + 62, 770], [880, 612], offer), [900, 640], settle * 0), tS: [P, P] = [mix2([SX - 62, 770], [606, 668], shrug), mix2([SX + 62, 770], [880, 612], offer)];
  const sArms: Arms = {L: reach(SX, Y, H0, "L", tS[0]), R: reach(SX, Y, H0, "R", sRh)};
  const fL = mix2(mix2([FX - 62, 770], [1112, 612], pointU), [1108, 650], settle), fR = mix2(mix2([FX + 62, 770], [1424, 598], pointU), [FX + 60, 770], relaxPt);
  const fArms: Arms = {L: reach(FX, Y, H0, "L", fL), R: reach(FX, Y, H0, "R", fR)};
  const wob = Math.sin(f / 4.4), damp = 1 - settle;
  const fLook = -0.7 * (1 - shake) + shake * damp * wob * 0.95 - 0.7 * settle * shake, fRot = shake * damp * wob * 5.5, fNod = settle * (1 + Math.sin(f / 5.2)) * 1.1;
  const coinA = ease(f, gb, 22), coinY = 506 + Math.sin(f / 15) * 8 + (1 - coinA) * 40;
  const bubS = eo(prog(f, sw + 4, 16)), bubF = eo(prog(f, T3, 16)), crossA = eo(prog(f, T3 + 30, 14));
  const gap = (u: number) => eo(prog(f, gb + 8, 26)) * u;
  return (
    <g>
      <LaneBG f={f} dur={dur}/>
      <Adult x={SX} y={Y} h={H0} f={f} seed={21} look={SHOE} arms={sArms} hands={{L: shrug > 0.1 || settle > 0.1 ? "open" : "relax", R: "relax"}} lookX={0.7} smile={settle > 0.5 ? 0.9 : 0.1} headRot={shrug * -3}
        held={{R: <g transform="translate(5 -2.4) rotate(-6)"><Shoes s={0.17}/></g>}}/>
      <Adult x={FX} y={Y} h={H0} f={f} seed={22} look={FARM} arms={fArms} hands={{L: pointU > 0.1 ? "open" : "relax", R: pointU > 0.1 && relaxPt < 0.5 ? "point" : "relax"}} lookX={fLook} headRot={fRot} nod={fNod} smile={settle > 0.5 ? 0.9 : -0.3}/>
      {/* thought bubbles and the crossed-out shoes */}
      <Thought x={620} y={290} r={60} tx={660} ty={420} a={bubS}><g transform="translate(-6 40) scale(0.2)"><Sheaf/></g><Tick x={42} y={34} s={0.8}/></Thought>
      <Thought x={1300} y={290} r={60} tx={1250} ty={400} a={bubF}><g transform="translate(-26 34) scale(0.2) rotate(-6)"><Plough/></g><Tick x={44} y={34} s={0.8}/></Thought>
      {crossA > 0.01 && (
        <g transform={`translate(1420 ${430 - (1 - crossA) * 16})`} opacity={crossA}>
          <circle r={66} fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.3))"}}/>
          <g transform="translate(0 6)"><Shoes s={0.5}/></g>
          <Cross x={0} y={0} s={0.8}/>
        </g>
      )}
      {/* coin mode: the coin, the closing arrows and the MONEY badge */}
      {coinMode && coinA > 0.01 && (
        <g>
          <g transform={`translate(990 ${coinY}) scale(${0.5 + 0.5 * coinA})`} opacity={coinA}><Coin s={1.5} f={f} glow={0.9}/></g>
          <FlowArrow pts={[[760, 846], [840, 846], [925, 846]]} f={f} p={gap(1)} w={24} c1="#e98a2e" dark="#7a3a10"/>
          <FlowArrow pts={[[1160, 846], [1080, 846], [995, 846]]} f={f} p={gap(1)} w={24} c1="#e98a2e" dark="#7a3a10"/>
          {f > mo && (() => { const a = ease(f, mo, 14); return (
            <g transform={`translate(990 ${coinY - 84}) scale(${0.6 + 0.4 * a})`} opacity={a}>
              <rect x={-96} y={-26} width={192} height={52} rx={26} fill="#8c2a1c" stroke="#ffd36a" strokeWidth={3.2} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.4))"}}/>
              <text x={0} y={11} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} letterSpacing="0.2em" fill="#ffe9a8">{L[2]?.text ?? ""}</text>
            </g>); })()}
        </g>
      )}
    </g>
  );
};
export const BarterLabels: React.FC<AP> = (p) => {
  const coinMode = (p.spec as any).mode === "coin", L = rlabs(p);
  return coinMode ? (
    <>
      {L[0] && <P2Card cx={960} y={80} text={L[0].text} f={p.f} at={L[0].at} size={52} maxW={1500}/>}
      {L[1] && <P2Card cx={960} y={236} text={L[1].text} f={p.f} at={L[1].at} size={32} maxW={430} upper={false}/>}
    </>
  ) : (
    <>
      {L[0] && <P2Card cx={360} y={88} text={L[0].text} f={p.f} at={L[0].at} size={30} maxW={420}/>}
      {L[1] && <P2Card cx={960} y={88} text={L[1].text} f={p.f} at={L[1].at} size={32} maxW={640} upper={false}/>}
    </>
  );
};

// ---- medium-exchange ----------------------------------------------------------------------------------------------------------
export const MediumArt: React.FC<AP> = (p) => {
  const {f, dur} = p, j1 = p.at("j1");
  const t0 = j1 + 16, D = Math.max(120, dur - 30 - t0), T = (k: number) => t0 + k * D;
  const pA0 = T(0), pAx = T(0.12), pA1 = T(0.2), w0 = T(0.26), w1 = T(0.54), ext0 = T(0.54), swapCoin = T(0.68), sack0 = T(0.7), swapSack = T(0.86), pocket = T(0.76);
  const BX = 330, FXX = 1330;
  const sxAt = (t: number) => 700 + 300 * eio(prog(t, w0, w1 - w0));
  const PX: P = [540, 646];
  const M2: P = [1180, 632];
  const swapHand = eio(prog(f, w0 - 14, 12));
  const exR = eio(prog(f, pA0, pAx - pA0)) * (1 - eio(prog(f, pAx + 4, pA1 - pAx)));
  // targets over time (world), each a function of a frame t so the trail can sample the past
  const sL = (t: number): P => {
    const sx = sxAt(t), e = eio(prog(t, pA0, pAx - pA0)), back = eio(prog(t, pAx + 4, pA1 - pAx));
    let a = mix2([sx - 62, 770], PX, e); a = mix2(a, [sx - 8, 664], back); return mix2(a, [sx - 62, 770], eio(prog(t, w0 - 1, 10)));
  };
  const sR = (t: number): P => {
    const sx = sxAt(t), toChest = eio(prog(t, w0 - 14, 12)), fwd = eio(prog(t, w0 - 2, 14)), ex = eio(prog(t, ext0 + 4, 0.1 * D)), back = eio(prog(t, swapSack + 4, 0.1 * D));
    let a = mix2([sx + 62, 770], [sx + 8, 664], toChest); a = mix2(a, [sx + 120, 640], fwd); a = mix2(a, M2, ex); return mix2(a, [sx + 44, 696], back);
  };
  const bR = (t: number): P => {
    const e = eio(prog(t, pA0, pAx - pA0)), back = eio(prog(t, pAx + 4, pA1 - pAx));
    return mix2(mix2([BX + 62, 770], [PX[0] - 6, PX[1] + 4], e), [BX + 40, 690], back);
  };
  const fL = (t: number): P => {
    const rec = eio(prog(t, ext0 + 6, 0.1 * D)), wst = eio(prog(t, ext0 + 0.1 * D + 4, 0.06 * D)), lift = eio(prog(t, sack0, 0.12 * D)), back = eio(prog(t, swapSack + 4, 0.1 * D));
    let a = mix2([FXX - 62, 770], M2, rec); a = mix2(a, [FXX - 70, 764], wst); a = mix2(a, M2, lift); return mix2(a, [FXX - 62, 770], back);
  };
  const coinPos = (t: number): P => (t < pAx ? bR(t) : t < w0 ? sL(t) : t < swapCoin ? sR(t) : fL(t));
  const sx = sxAt(f), moving = prog(f, w0, w1 - w0), wk = Math.min(1, 5 * Math.sin(Math.PI * moving));
  const sArms: Arms = {L: reach(sx, Y, H0, "L", sL(f)), R: reach(sx, Y, H0, "R", sR(f))};
  const bArms: Arms = {L: [8, 10], R: reach(BX, Y, 520, "R", bR(f))};
  const fArms: Arms = {L: reach(FXX, Y, H0, "L", fL(f)), R: [8, 10]};
  const shoes = <g transform="translate(5 -2.4) rotate(-6)"><Shoes s={0.15}/></g>;
  const coinHeld = <g transform="translate(2 -3)"><Coin s={0.15} f={f} glow={0.7}/></g>;
  const sackHeld = <g transform="translate(3 5)"><WheatSack s={0.15}/></g>;
  const coinHolder = f < pAx ? "B" : f < w0 - 1 ? "SL" : f < swapCoin ? "SR" : f < pocket ? "FL" : "";
  const shoesHolder = f < pAx ? "SL" : "B";
  const sackHolder = f < sack0 ? "" : f < swapSack ? "FL" : "SR";
  const trail: React.ReactNode[] = [];
  if (f > pAx) for (let k = 1; k <= 18; k++) {
    const t1 = f - k * 2.4, t2 = f - (k - 1) * 2.4; if (t1 < pAx || t2 > pocket + 6) continue;
    const a = coinPos(t1), b = coinPos(Math.min(t2, pocket)); const al = 0.5 * (1 - k / 19);
    trail.push(<path key={k} d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} stroke="#ffd36a" strokeWidth={14 * (1 - k / 22)} strokeLinecap="round" opacity={al}/>);
  }
  const spark = bump(f, pAx - 4, 18);
  return (
    <g>
      <LaneBG f={f} dur={dur}/>
      <Adult x={BX} y={Y} h={520} f={f} seed={23} look={BUYER} arms={bArms} hands={{R: "fist"}} lookX={0.7} smile={0.7} held={{R: coinHolder === "B" ? coinHeld : shoesHolder === "B" ? shoes : undefined}}/>
      <Adult x={FXX} y={Y} h={H0} f={f} seed={22} look={FARM} arms={fArms} hands={{L: "open"}} lookX={-0.7} smile={0.6} held={{L: coinHolder === "FL" ? coinHeld : sackHolder === "FL" ? sackHeld : undefined}}/>
      <Adult x={sx} y={Y} h={H0} f={f} seed={21} look={SHOE} arms={sArms} hands={{L: "fist", R: "fist"}} lookX={moving > 0.02 && moving < 0.98 ? 0.7 : f < w0 ? -0.7 : 0.7} walkAmt={wk} smile={0.7}
        held={{L: coinHolder === "SL" ? coinHeld : shoesHolder === "SL" ? shoes : undefined, R: coinHolder === "SR" ? coinHeld : sackHolder === "SR" ? sackHeld : undefined}}/>
      <g>{trail}</g>
      {spark > 0.02 && <circle cx={PX[0] - 4} cy={PX[1]} r={90} fill="url(#ak-sunglow)" opacity={spark}/>}
    </g>
  );
};
export const MediumLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return L[0] ? <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={46} maxW={1500}/> : null;
};
