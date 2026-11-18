// Scene 09 | Scale and share (7:40-8:35). TRAI September 2026: (1) REAL crop of the TRAI p.8 chart (highlighted) + zero-based share bars with
// Airtel's June 37.96% tick; (2) Airtel's M2M 88.58 million = 61.16% of India's M2M; (3) OUR ARITHMETIC, excluding M2M (approx.) beside the headline pair;
// (4) active share bars; (5) closing line. Every figure = a ledger row (claims C121, C129, C124, C140, C127), cued to the words that say it.
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {C, F, ease, outQuint, useTicks} from "./kit/tokens";
import {H0, PU, S, W, WL, useAt} from "./cue";
import {ENTITY, EntityTag} from "./devices";
import {PairBars} from "./devices_airtel";
import {Card, Frame, Head, Mono, Tag} from "./parts0911";
import CH from "../../../public/voxplus/airtel/docs/sc09_trai_chart.json";

const CHIP1 = "TRAI PR 140/2026 p.8 · wireless subscribers · 30 Sep 2026";
const GREYBAR = "#B9B2A4";

// 1 (p1): real crop of the TRAI chart; bars read from it; Airtel's June tick
const A9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tJ = a("s09p1", "thirty nine") - 2, tA = a("s09p1", "thirty eight") - 2, tE = a("s09p1", "edged up") - 2;
  const bx = 1130, by = 330, bw = 640, bh = 480, mx = 50, barW = 170;
  const ty = by + bh - (37.96 / mx) * bh, cx = bx + 320 + (320 - barW) / 2 + barW / 2;
  const tk = ease(f, tE, tE + 10, outQuint);
  return (
    <Frame f={f} d={d} chip={CHIP1} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text="TRAI · MOBILE CONNECTIONS" period="SEP 2026 · SHARE" x={54} y={150} size={26}/>
      <DocPage f={f} src="airtel/docs/sc09_trai_chart.png" imgW={CH.w} imgH={CH.h} x={540} y={570} width={1020} margin={0.03} rot={-0.6} enter={{at: -14, mode: "drop", dur: 8}}
        highlights={[{rects: [CH.rects.jio as any], at: tJ, dur: 12}, {rects: [CH.rects.airtel as any], at: tA, dur: 12}]}/>
      <PairBars f={f} x={bx} y={by} w={bw} h={bh} max={mx} barW={barW} title="SHARE OF MOBILE CONNECTIONS" items={[
        {label: "Reliance Jio", v: 39.32, text: "39.32%", at: tJ + 6, color: C.ink},
        {label: "Bharti Airtel", v: 38.02, text: "38.02%", at: tA + 6, color: C.teal}]}/>
      {tk > 0 ? <>
        <div style={{position: "absolute", left: cx - barW / 2 - 22, top: ty - 2, width: barW + 44, height: 5, background: C.markerRed, opacity: tk}}/>
        <div style={{position: "absolute", left: cx - 120, top: ty + 16, width: 240, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.white, opacity: tk}}>JUN 37.96%</div>
      </> : null}
      <Mono f={f} at={tE} text="TICK = AIRTEL, JUN 2026 (TRAI PR 104/2026, our recomputation)" x={1130} y={880} size={22} w={700}/>
    </Frame>
  );
};

// 2a (p2 start): Airtel's machine-to-machine connections
const B9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tN = a("s09p2", "eighty nine") - 2, tP = a("s09p2", "sixty one") - 4;
  const x0 = 300, w = 1320, y = 520, h = 140, k = ease(f, tP, tP + 24, outQuint), seg = w * 0.6116 * k;
  return (
    <Frame f={f} d={d} chip="TRAI PR 140/2026 p.11 · M2M cellular mobile connections · 30 Sep 2026" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text="TRAI · MACHINE-TO-MACHINE (M2M) CONNECTIONS" period="SEP 2026" x={54} y={150} size={26}/>
      <Head f={f} at={tN} a="AIRTEL'S COUNT INCLUDES" b="88.58 MILLION M2M CONNECTIONS" y={260} size={78}/>
      <div style={{position: "absolute", left: x0, top: y, width: w, height: h, background: GREYBAR, opacity: ease(f, tP - 6, tP + 6)}}/>
      <div style={{position: "absolute", left: x0, top: y, width: seg, height: h, background: C.teal}}/>
      <div style={{position: "absolute", left: x0, top: y + h, width: w, height: 3, background: C.ink}}/>
      <div style={{position: "absolute", left: x0, top: y + h + 14, fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey, opacity: k > 0 ? 1 : 0}}>0%</div>
      <div style={{position: "absolute", left: x0 + w - 100, width: 100, textAlign: "right", top: y + h + 14, fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey, opacity: k > 0 ? 1 : 0}}>100%</div>
      <div style={{position: "absolute", left: x0 + 24, top: y + 44, fontFamily: F.sans, fontWeight: 800, fontSize: 52, color: C.white, opacity: k > 0.5 ? 1 : 0}}>AIRTEL 61.16%</div>
      <div style={{position: "absolute", left: x0 + w - 524, width: 500, textAlign: "right", top: y + 46, fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.ink, opacity: k > 0.9 ? 1 : 0}}>OTHERS</div>
      <Head f={f} at={tP + 8} b="OF ALL M2M CONNECTIONS IN INDIA" y={800} size={50} color={C.inkSoft}/>
    </Frame>
  );
};

// 2b (p2 "Take those out"): OUR ARITHMETIC beside the headline pair
const C9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("s09p2", "Take those out") - 2, tA = a("s09p2", "thirty five") - 4, tJ = a("s09p2", "forty two") - 4;
  const mx = 50;
  return (
    <Frame f={f} d={d} chip="TRAI PR 140/2026 p.8, p.11 · our arithmetic from TRAI's M2M totals · approximate" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text="TRAI · MOBILE CONNECTIONS" period="SEP 2026 · SHARE" x={54} y={150} size={26}/>
      <div style={{position: "absolute", left: 140, top: 238, fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.grey, letterSpacing: 1.5}}>HEADLINE, AS TRAI PUBLISHES</div>
      <PairBars f={f} x={140} y={360} w={700} h={380} max={mx} barW={200} items={[
        {label: "Bharti Airtel", v: 38.02, text: "38.02%", at: -20, color: GREYBAR}, {label: "Reliance Jio", v: 39.32, text: "39.32%", at: -20, color: GREYBAR}]}/>
      <div style={{position: "absolute", left: 1020, top: 238, fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.ink, letterSpacing: 1.5, opacity: ease(f, t, t + 10)}}>EXCLUDING M2M (APPROX.)</div>
      <Tag f={f} at={t + 4} text="OUR ARITHMETIC" x={1020} y={300} bg={C.markerRed} color={C.white} size={26}/>
      <PairBars f={f} x={1020} y={360} w={760} h={380} max={mx} barW={200} items={[
        {label: "Bharti Airtel", v: 35.1, text: "≈35.1%", at: tA, color: C.teal}, {label: "Reliance Jio", v: 41.8, text: "≈41.8%", at: tJ, color: C.ink}]}/>
      <Mono f={f} at={tA} text="(connections less M2M) ÷ (all connections less M2M) · approximate: M2M by operator uses TRAI's share of the national M2M total" x={140} y={890} size={22} w={1640}/>
    </Frame>
  );
};

// 3 (p3): active share
const D9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("s09p3", "ninety nine") - 4, tL = a("s09p3", "level") - 2, bx = 560, by = 390, bw = 800, bh = 440, mx = 100;
  const y98 = by + bh - (98.94 / mx) * bh, l = ease(f, tL, tL + 14, outQuint);
  return (
    <Frame f={f} d={d} chip="TRAI PR 140/2026 Annexure-III p.21 · peak VLR ÷ reported base · Sep 2026" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text="TRAI · ACTIVE SHARE" period="SEP 2026" x={54} y={150} size={26}/>
      <Head f={f} at={-20} b="CONNECTIONS ACTUALLY IN USE, % OF REPORTED" y={215} size={46} color={C.grey}/>
      <PairBars f={f} x={bx} y={by} w={bw} h={bh} max={mx} barW={220} items={[
        {label: "Bharti Airtel", v: 98.94, text: "98.9%", at: t, color: C.teal}, {label: "Reliance Jio", v: 98.67, text: "98.7%", at: t + 8, color: C.ink}]}/>
      <div style={{position: "absolute", left: bx - 20, top: y98 - 2, width: (bw + 40) * l, height: 0, borderTop: `4px dashed ${C.markerRed}`}}/>
      <Tag f={f} at={tL + 6} text="LEVEL" x={bx + bw + 40} y={y98 - 2} bg={C.markerRed} color={C.white} size={30}/>
    </Frame>
  );
};

// 4 (p4): closing line
const E9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t1 = a("s09p4", "scale") - 2, t2 = a("s09p4", "flatters") - 6;
  return (
    <Frame f={f} d={d} chip="TRAI PR 140/2026 · Sep 2026 · M2M adjustment is our arithmetic (approx.)" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Head f={f} at={t1} b="SCALE IS REAL" y={250} size={120} color={C.teal}/>
      <Card f={f} at={t2} x={960} y={600} w={1300} h={250} strip="AIRTEL · SHARE OF MOBILE CONNECTIONS">
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 80, color: C.ink, whiteSpace: "nowrap"}}>38.02% <span style={{color: C.grey}}>→</span> <span style={{color: C.teal}}>≈35.1%</span></div>
        <div style={{fontFamily: F.mono, fontSize: 26, color: C.grey, marginTop: 8, letterSpacing: 1}}>HEADLINE → EXCLUDING M2M · OUR ARITHMETIC, APPROX.</div>
      </Card>
    </Frame>
  );
};

export const SHOTS09: Shot[] = [
  S("s09p1", 0, H0, (p) => <A9 {...p}/>, "sc09-trai-bars"),
  S("s09p2", 0, WL, (p) => <B9 {...p}/>, "sc09-m2m"),
  S("s09p2", "Take those out|-0.3", PU, (p) => <C9 {...p}/>, "sc09-ex-m2m"),
  S("s09p3", 0, WL, (p) => <D9 {...p}/>, "sc09-active"),
  S("s09p4", 0, H0, (p) => <E9 {...p}/>, "sc09-close"),
];
export const CUES09: SCue[] = [[W("s09p1", "thirty nine"), "highlighter", 0.4], [W("s09p1", "edged up"), "pop", 0.3], [W("s09p2", "sixty one"), "pop", 0.3],
  [W("s09p2", "Take those out"), "paper", 0.35], [W("s09p3", "level"), "pop", 0.3], [W("s09p4", "flatters"), "paper", 0.3]];
