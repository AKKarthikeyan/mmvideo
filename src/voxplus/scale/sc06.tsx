// Scene 06 | 3:50-4:55 | Unpack the spectrum headline (AK brief). A frequency strip ("Frequency of the band", log scale, not to scale);
// the actual RHP holdings table (p.222-225); the 26,800.8 MHz total extracted into a stacked bar of "Bandwidth held" with the
// 22,000 MHz in the 26 GHz band highlighted (82%, aggregated across licence areas); Airtel's 18,000 MHz in 26 GHz (Annual Report
// p.52); the 700 MHz nationwide holding; a schematic building cross-section (Illustration, not measured coverage); the
// customer question. GHz / MHz of a BAND (its frequency) and MHz HELD (its bandwidth) are labelled apart throughout.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {StickerLabel} from "./kit/Collage";
import {DocPage, docPoint} from "./kit/DocPage";
import {Rect} from "./kit/Marker";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, lin, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {RechargePhone, DotGrid, EntityTag, ENTITY} from "./devices";
import {H0, MZ, PU, S, W, WL, WR, useAt} from "./cue";
import {Frame, Arcs, Headline, HouseG, PanelG, PhoneG, Svg, TowerBig, Txt, pulse} from "./parts56";
import HT from "../../../public/voxplus/scale/docs/sc06_hold_top.json";
import HB from "../../../public/voxplus/scale/docs/sc06_hold_total.json";
import AR from "../../../public/voxplus/scale/docs/sc06_airtel26.json";
import B7 from "../../../public/voxplus/scale/docs/sc06_700.json";

const R = (j: {rects: Record<string, number[][]>}, k: string) => j.rects[k] as Rect[];
const BAND_X = (mhz: number) => 200 + (1520 * (Math.log10(mhz) - 2.6)) / 2.0;     // log axis, 400 MHz .. 40 GHz

// ---------------------------------------------------------------------------------------------------------------------
// p1 + p2: the frequency strip (frequency of the band), then high band = capacity / short reach, low band = reach / indoors
// ---------------------------------------------------------------------------------------------------------------------
const Strip: React.FC<{f: number; at: number; y: number}> = ({f, at, y}) => {
  const p = 0.3 + 0.7 * ease(f, at, at + 26, inOut);
  const x0 = 200, x1 = 1720, h = 92;
  const N = 420, pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    if (t > p) break;
    const ph = 2 * Math.PI * (8 * t + 60 * t * t);                       // wave tightens to the right (schematic)
    pts.push(`${(x0 + (x1 - x0) * t).toFixed(1)},${(y + Math.sin(ph) * h * 0.32).toFixed(1)}`);
  }
  return (
    <Svg>
      <defs><linearGradient id="stripg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={C.highlight}/><stop offset="1" stopColor={C.teal}/></linearGradient></defs>
      <rect x={x0} y={y - h / 2} width={(x1 - x0) * p} height={h} rx={8} fill="url(#stripg)" opacity={0.55}/>
      <polyline points={pts.join(" ")} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
};
const BAND_LABELS: [number, string][] = [[700, "700 MHz"], [3300, "3,300 MHz"], [26000, "26 GHz"]];
const Cell: React.FC<{f: number; at: number; x: number; y: number; r: number; color: string; title: string; sub: string; rings: number}> = ({f, at, x, y, r, color, title, sub, rings}) => {
  const e = ease(f, at, at + 12, outQuint);
  if (e <= 0) return null;
  return (
    <>
      <Svg style={{opacity: e}}>
        <TowerBig x={x} yb={y + 60} h={110} w={42} sw={4}/>
        {Array.from({length: rings}).map((_, i) => <circle key={i} cx={x} cy={y} r={(r * (i + 1)) / rings * ease(f, at + i * 4, at + 20 + i * 4, outCubic)} fill="none" stroke={color} strokeWidth={rings > 1 ? 4 : 10} opacity={0.35 + 0.65 * ((i + 1) / rings)}/>)}
      </Svg>
      <Txt f={f} at={at + 6} text={title} x={x} y={y + r + 72} size={44} color={color}/>
      <Txt f={f} at={at + 10} text={sub} x={x} y={y + r + 124} size={32} weight={600} color={C.inkSoft}/>
    </>
  );
};
const q1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const SY = 330;
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.02, 960, 540]]} chip="Illustration · log scale, not to scale">
      <Strip f={f} at={a("s06p1", "Spectrum")} y={SY}/>
      <Txt f={f} at={a("s06p1", "radio")} text="Radio frequencies" x={960} y={200} size={50} out={a("s06p2", "bands") - 4}/>
      <Txt f={f} at={a("s06p1", "carry") - 6} text="FREQUENCY OF THE BAND" x={200} y={SY + 100} size={26} weight={600} color={C.grey} align="left" spacing={3}/>
      <Txt f={f} at={a("s06p1", "carry") - 6} text="lower  →  higher" x={1720} y={SY + 100} size={26} weight={600} color={C.grey} align="right" spacing={3}/>
      {BAND_LABELS.map(([mhz, t], i) => {
        const at = a("s06p2", "bands") + i * 6;
        const x = BAND_X(mhz);
        return <React.Fragment key={t}>
          <Svg><line x1={x} x2={x} y1={SY - 66} y2={SY + 66} stroke={C.ink} strokeWidth={4} opacity={ease(f, at, at + 8)}/></Svg>
          <Txt f={f} at={at} text={t} x={x} y={SY - 92} size={38}/>
        </React.Fragment>;
      })}
      {/* high band: capacity, shorter distance. low band: farther, buildings */}
      <Cell f={f} at={a("s06p2", "Lower") - 4} x={480} y={690} r={150} color={C.rust} title="Lower: reach" sub="farther, into buildings" rings={4}/>
      <Cell f={f} at={a("s06p2", "Higher") - 4} x={1440} y={690} r={78} color={C.teal} title="Higher: capacity" sub="shorter distances" rings={1}/>
      <Svg style={{opacity: ease(f, a("s06p2", "Higher") + 4, a("s06p2", "Higher") + 14)}}>
        <path d={`M ${BAND_X(26000)} ${SY + 60} L ${BAND_X(26000)} ${SY + 66} L ${1440} 600`} fill="none" stroke={C.teal} strokeWidth={3} strokeDasharray="8 8"/>
      </Svg>
      <Svg style={{opacity: ease(f, a("s06p2", "Lower") + 4, a("s06p2", "Lower") + 14)}}>
        <path d={`M ${BAND_X(700)} ${SY + 66} L ${480} 520`} fill="none" stroke={C.rust} strokeWidth={3} strokeDasharray="8 8"/>
      </Svg>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p3-p5: the actual holdings table (ONE row highlighted), then its Total row, then both are REPLACED by one full-width band
// breakdown of the 26,800.8 MHz (22,000 MHz = 82% in the 26 GHz band); Airtel's 18,000 MHz on the same scale; AR excerpt as a thumbnail.
// ---------------------------------------------------------------------------------------------------------------------
const MHZ_TOT = 26800.8, MHZ_26 = 22000, BX0 = 160, BW = 1600, BH = 140;
const bx = (mhz: number) => (BW * mhz) / MHZ_TOT;
const q2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tA = a("s06p3", "Now"), tC = a("s06p3", "total"), tD = a("s06p4", "About");
  const tPct = a("s06p4", "percent"), tAgg = a("s06p4", "aggregated"), tBw = a("s06p4", "bandwidth"), tAir = a("s06p4", "Airtel");
  const tUse = a("s06p5", "useful"), tSingle = a("s06p5", "single");
  const tOut1 = ease(f, tC - 2, tC + 8), tOut2 = ease(f, tD + 6, tD + 16);
  const row = HT.rects["26 GHz"][0], cell = HT.rects["1,000.0 MHz"][0];
  const rowRect: Rect = [row[0] - 14, row[1], cell[0] + cell[2] - row[0] + 28, row[3]];       // the first 26 GHz row, across the table
  // bar block: moves up when Airtel arrives
  const dy = ease(f, tAir - 10, tAir + 14, inOut), by = 430 - 80 * dy;
  const grow = ease(f, tD + 8, tD + 22, outQuint), part = ease(f, tPct - 15, tPct + 3, inOut);
  const n82 = Math.round(82 * ease(f, tPct - 14, tPct + 3, outQuint));
  const slices = ease(f, tAgg, tAgg + 20, inOut);
  const fade1 = 1 - ease(f, tAir - 8, tAir + 2);               // total label, bracket and key leave when Airtel comes
  const aw = ease(f, tAir, tAir + 26, outQuint), AY = 650;
  const barShow = f >= tD + 4;
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.012, 960, 540]]} chip="Jio Platforms RHP · spectrum holdings as of 30 June 2026 · p.222-225">
      {/* 1. the holdings table, one 26 GHz row highlighted */}
      <div style={{position: "absolute", inset: 0, opacity: 1 - tOut1, transform: `translateY(${-tOut1 * 80}px)`}}>
        <DocPage f={f} src="scale/docs/sc06_hold_top.png" imgW={HT.w} imgH={HT.h} x={960} y={555} width={1150} margin={0.025} enter={{at: -16, mode: "slide-up", dur: 14}}
          highlights={[{rects: [rowRect], at: tA + 8, dur: 14}]}/>
      </div>
      {/* 2. its Total row */}
      <div style={{position: "absolute", inset: 0, opacity: 1 - tOut2}}>
        <DocPage f={f} src="scale/docs/sc06_hold_total.png" imgW={HB.w} imgH={HB.h} x={960} y={500} width={1400} margin={0.04} enter={{at: tC + 2, mode: "slide-up", dur: 12}}
          highlights={[{rects: R(HB, "26,800.8"), at: tC + 12, dur: 9}]}/>
      </div>
      {f < tD + 16 ? <EntityTag f={f} at={-20} text="RJIL · JIO HOLDINGS" period="AS OF 30 JUN 2026" x={BX0} y={118} anchor="left" size={28}/> : null}
      {/* 3. the band breakdown (full width) */}
      {barShow ? <>
        <EntityTag f={f} at={tD + 8} text="RJIL · JIO HOLDINGS" period="AS OF 30 JUN 2026" x={BX0} y={by - 120} anchor="left" size={28}/>
        <Txt f={f} at={tD + 10} text="26,800.8 MHz in total" x={BX0 + BW} y={by - 120} size={44} weight={800} color={C.ink} align="right" out={tAir - 8}/>
        <Svg>
          <rect x={BX0} y={by} width={BW * grow} height={BH} fill={C.grey} opacity={0.9}/>
          <rect x={BX0} y={by} width={bx(MHZ_26) * part} height={BH} fill={C.teal}/>
          {Array.from({length: 21}).map((_, i) => <line key={i} x1={BX0 + (bx(MHZ_26) * (i + 1)) / 22} x2={BX0 + (bx(MHZ_26) * (i + 1)) / 22} y1={by + 8} y2={by + BH - 8}
            stroke={C.white} strokeWidth={2} opacity={0.5 * slices * (part > 0.95 ? 1 : 0)}/>)}
          {part > 0.95 ? <g opacity={slices * fade1}><path d={`M ${BX0} ${by + BH + 96} v 14 H ${BX0 + BW} v -14`} fill="none" stroke={C.ink} strokeWidth={4}/></g> : null}
        </Svg>
        {part > 0.3 ? <Txt f={f} at={tPct - 14} text="22,000 MHz" x={BX0 + 40} y={by + BH / 2} size={78} color={C.white} align="left"/> : null}
        {part > 0.3 ? <Txt f={f} at={tPct - 12} text={`= ${n82}%`} x={BX0 + bx(MHZ_26) - 40} y={by + BH / 2} size={104} color={C.highlight} align="right"/> : null}
        {part > 0.9 ? <Txt f={f} at={tPct + 6} text="4,800.8" x={BX0 + bx(MHZ_26) + (BW - bx(MHZ_26)) / 2} y={by + BH / 2} size={34} color={C.white}/> : null}
        {part > 0.9 ? <Txt f={f} at={tPct + 10} text="26 GHz band" x={BX0 + bx(MHZ_26) / 2} y={by + BH + 36} size={42} color={C.ink}/> : null}
        {part > 0.9 ? <Txt f={f} at={tPct + 12} text="other bands" x={BX0 + bx(MHZ_26) + (BW - bx(MHZ_26)) / 2} y={by + BH + 36} size={30} weight={600} color={C.grey}/> : null}
        <Txt f={f} at={tAgg} text="aggregated across licence areas · 22 × 1,000 MHz" x={960} y={by + BH + 140} size={36} color={C.ink} out={tAir - 8}/>
        <Txt f={f} at={tBw} text="Band = frequency of the band (GHz).  Bar = bandwidth held (MHz)." x={960} y={by + BH + 200} size={26} weight={600} color={C.grey} out={tAir - 8}/>
      </> : null}
      {/* 4. Airtel on the same scale; the AR excerpt is only a thumbnail */}
      <EntityTag f={f} at={tAir - 4} text={ENTITY.airtel} period="FY26" x={BX0} y={AY - 58} anchor="left" size={28}/>
      <Svg>
        {aw > 0 ? <g><rect x={BX0} y={AY} width={bx(18000) * aw} height={BH} fill={C.teal} opacity={0.18}/>
          <rect x={BX0} y={AY} width={bx(18000) * aw} height={BH} fill="none" stroke={C.teal} strokeWidth={6}/></g> : null}
      </Svg>
      {aw > 0.5 ? <Txt f={f} at={tAir + 12} text="18,000 MHz" x={BX0 + 40} y={AY + BH / 2} size={78} color={C.ink} align="left"/> : null}
      {aw > 0.5 ? <Txt f={f} at={tAir + 14} text="26 GHz band · same scale" x={BX0 + bx(18000) / 2} y={AY + BH + 38} size={32} weight={600} color={C.grey}/> : null}
      <DocPage f={f} src="scale/docs/sc06_airtel26.png" imgW={AR.w} imgH={AR.h} x={1560} y={715} width={380} margin={0.04} enter={{at: tAir + 4, mode: "slide-left", dur: 12}}
        highlights={[{rects: R(AR, "18000 MHz in the mmWave (26 GHz) band"), at: a("s06p4", "substantial"), dur: 14}]}/>
      <Txt f={f} at={tAir + 10} text="Airtel Annual Report 2025-26, p.52" x={1560} y={790} size={20} weight={600} color={C.grey}/>
      <StickerLabel f={f} text="Substantial there too" x={1560} y={625} size={30} rot={-1.5} dark enter={{at: a("s06p4", "there"), mode: "pop", rot0: -6}}/>
      {/* p5 labels */}
      <StickerLabel f={f} text="26 GHz: capacity" x={1560} y={262} size={34} rot={-1.5} bg={C.teal} color={C.white} enter={{at: tUse - 2, mode: "pop", rot0: -6}}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 0}}><Headline f={f} at={tSingle - 4} text="TOTAL BANDWIDTH ≠ COMPLETE NETWORK ADVANTAGE" y={150} size={50}/></div>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p6a: 700 MHz, nationwide (RHP p.164 passage) with the 22 licence areas from the table (our count)
// ---------------------------------------------------------------------------------------------------------------------
const q3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tNat = a("s06p6", "nationwide"), tHold = a("s06p6", "holding");
  const cols = 11, cw = 112, TX = 960 - (cols * cw) / 2;
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.02, 960, 540]]} chip="Jio Platforms RHP · p.164 · 700 MHz band, 'across all circles'">
      <DocPage f={f} src="scale/docs/sc06_700.png" imgW={B7.w} imgH={B7.h} x={960} y={290} width={1560} margin={0.03} enter={{at: -14, mode: "slide-up", dur: 12}}
        highlights={[{rects: R(B7, "across all circles"), at: tNat, dur: 14}]}/>
      <Svg>
        {Array.from({length: 22}).map((_, i) => {
          const x = TX + (i % cols) * cw + cw / 2, y = 640 + Math.floor(i / cols) * 120;
          const p = spr(f, tNat + 8 + i * 1.6, 12, 220);
          return p > 0 ? <g key={i} opacity={clamp01(p * 2)}><rect x={x - 42} y={y - 36} width={84} height={72} rx={10} fill={C.rust} transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}/>
            <text x={x} y={y + 9} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={24} fill={C.white}>700</text></g> : null;
        })}
      </Svg>
      <EntityTag f={f} at={tNat} text="RJIL · JIO HOLDINGS" period="AS OF 30 JUN 2026" x={TX} y={540} anchor="left" size={26}/>
      <Txt f={f} at={tNat + 30} text="700 MHz (paired) in all 22 licence areas · our count from the table" x={960} y={870} size={32} color={C.ink} out={tHold + 90}/>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p6b: schematic building cross-section. Illustration, not measured coverage.
// ---------------------------------------------------------------------------------------------------------------------
const q4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tReach = a("s06p6", "reach"), tIn = a("s06p6", "indoor"), tCov = a("s06p6", "coverage");
  const TX = 360, GY = 780, AYc = 380;
  const BXl = 1060, BXr = 1640, BYt = 470;
  const hi = [70, 130, 190, 250, 310], lo = [360, 520, 680, 840, 1000, 1160, 1320];
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.02, 960, 540]]} chip="Illustration · schematic, not measured coverage">
      <Svg>
        <defs>
          <clipPath id="inside"><rect x={BXl} y={BYt} width={BXr - BXl} height={GY - BYt}/></clipPath>
          <clipPath id="outside"><path d={`M 0 0 H 1920 V ${GY} H 0 Z M ${BXl} ${BYt} V ${GY} H ${BXr} V ${BYt} Z`} clipRule="evenodd"/></clipPath>
        </defs>
        <line x1={120} x2={1800} y1={GY} y2={GY} stroke={C.grey} strokeWidth={5}/>
        {/* building: walls, floor, windows */}
        <rect x={BXl} y={BYt} width={BXr - BXl} height={GY - BYt} fill={C.white} stroke={C.ink} strokeWidth={9}/>
        <line x1={BXl} x2={BXr} y1={625} y2={625} stroke={C.ink} strokeWidth={6}/>
        <line x1={(BXl + BXr) / 2} x2={(BXl + BXr) / 2} y1={BYt} y2={GY} stroke={C.ink} strokeWidth={4} opacity={0.4}/>
        {/* tower */}
        <TowerBig x={TX} yb={GY} h={420} w={130} sw={7}/>
        {[-1, 0, 1].map((k) => <PanelG key={k} x={TX + k * 24} y={AYc - 8 + Math.abs(k) * 20} s={0.85}/>)}
        {/* 26 GHz: capacity, shorter reach (stops before the building) */}
        <Arcs f={f} at={a("s06p6", "supporting") - 8} cx={TX + 20} cy={AYc + 10} radii={hi} color={C.teal} sw={13} span={46} gap={5}/>
        {/* 700 MHz: reach, outside and then through the wall */}
        <Arcs f={f} at={tReach - 4} cx={TX + 20} cy={AYc + 10} radii={lo} color={C.rust} sw={9} span={34} gap={6} clipId="outside"/>
        <Arcs f={f} at={tIn - 4} cx={TX + 20} cy={AYc + 10} radii={lo} color={C.rust} sw={9} span={34} gap={0} clipId="inside" op={0.7}/>
        {/* phones: near the tower (capacity) and inside the building (indoor coverage) */}
        {[0, 1, 2, 3].map((i) => <PhoneG key={i} x={560 + (i % 2) * 70 + i * 6} y={GY - 40 - (i > 1 ? 56 : 0)} s={0.9} color={C.teal} op={ease(f, a("s06p6", "supporting") + 4 + i * 3, a("s06p6", "supporting") + 12 + i * 3)}/>)}
        <g opacity={ease(f, tIn + 4, tIn + 14)}><PhoneG x={1370} y={705} s={1.4} color={C.rust}/><PhoneG x={1190} y={560} s={1.2} color={C.rust}/></g>
      </Svg>
      <StickerLabel f={f} text="26 GHz: capacity" x={560} y={850} size={38} rot={-2} bg={C.teal} color={C.white} enter={{at: a("s06p6", "supporting"), mode: "pop", rot0: -6}}/>
      <Txt f={f} at={a("s06p6", "supporting") + 8} text="shorter reach" x={560} y={900} size={28} weight={600} color={C.inkSoft}/>
      <StickerLabel f={f} text="700 MHz: reach" x={1340} y={850} size={38} rot={2} bg={C.rust} color={C.white} enter={{at: tReach, mode: "pop", rot0: 6}}/>
      <Txt f={f} at={tIn} text="farther, indoors" x={1340} y={900} size={28} weight={600} color={C.inkSoft}/>
      
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p7 "The advantage depends on the mix, geography and deployment, not just the largest number."
// ---------------------------------------------------------------------------------------------------------------------
const BigCard: React.FC<{f: number; at: number; x: number; y: number; big: string; sub: string; word: string; color: string}> = ({f, at, x, y, big, sub, word, color}) => {
  const e = spr(f, at, 13, 160);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 700, height: 300, transform: `translate(-50%, -50%) translateY(${(1 - e) * 200}px)`, opacity: clamp01(e * 2), background: C.white,
      boxShadow: `0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.2)`, borderTop: `14px solid ${color}`, boxSizing: "border-box", padding: "26px 44px"}}>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 112, color, lineHeight: 1}}>{big}</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey, letterSpacing: 2, textTransform: "uppercase", marginTop: 4}}>{sub}</div>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 70, color: C.ink, marginTop: 14}}>{word}</div>
    </div>
  );
};
const q5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.02, 960, 540]]} chip="Moat & Margin · reading of the RHP and Airtel annual report">
      <div style={{position: "absolute", left: 0, right: 0, top: 0}}><Headline f={f} at={-20} text="TOTAL BANDWIDTH ≠ COMPLETE NETWORK ADVANTAGE" y={150} size={50}/></div>
      <BigCard f={f} at={-12} x={520} y={500} big="26 GHz" sub="frequency of the band" word="capacity" color={C.teal}/>
      <BigCard f={f} at={-8} x={1400} y={500} big="700 MHz" sub="frequency of the band" word="reach" color={C.rust}/>
      <Txt f={f} at={a("s06p7", "mix")} text="MIX" x={420} y={790} size={46} spacing={3}/>
      <Txt f={f} at={a("s06p7", "geography")} text="GEOGRAPHY" x={960} y={790} size={46} spacing={3}/>
      <Txt f={f} at={a("s06p7", "deployment")} text="DEPLOYMENT" x={1500} y={790} size={46} spacing={3}/>
      <Svg>
        <line x1={190} x2={190 + 460 * ease(f, a("s06p7", "mix"), a("s06p7", "mix") + 10)} y1={826} y2={826} stroke={C.teal} strokeWidth={8}/>
        <line x1={730} x2={730 + 460 * ease(f, a("s06p7", "geography"), a("s06p7", "geography") + 10)} y1={826} y2={826} stroke={C.teal} strokeWidth={8}/>
        <line x1={1270} x2={1270 + 460 * ease(f, a("s06p7", "deployment"), a("s06p7", "deployment") + 10)} y1={826} y2={826} stroke={C.teal} strokeWidth={8}/>
      </Svg>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p8 "But even a well-equipped network faces a very ordinary question: will the customer keep paying?"
// The network, then the customer question; the dots arrive (hand-off to scene 07).
// ---------------------------------------------------------------------------------------------------------------------
const q6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tQ = a("s06p8", "ordinary"), tWill = a("s06p8", "will"), tCust = a("s06p8", "customer"), tKeep = a("s06p8", "keep");
  const tap = a("s06p8", "paying") - 4;
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]} chip="Illustration">
      <Svg>
        <TowerBig x={300} yb={760} h={330} w={110} sw={6}/>
        {[-1, 0, 1].map((k) => <PanelG key={k} x={300 + k * 20} y={452 + Math.abs(k) * 16} s={0.75}/>)}
        <Arcs f={f} at={4} cx={318} cy={458} radii={[70, 125, 180]} color={C.teal} sw={9} span={44} gap={6}/>
      </Svg>
      <Txt f={f} at={a("s06p8", "well") - 2} text="Well-equipped network" x={300} y={830} size={32} color={C.inkSoft}/>
      <Txt f={f} at={tQ} text="A very ordinary question" x={960} y={170} size={40} weight={600} color={C.grey}/>
      <Txt f={f} at={tWill} text="Will the customer keep paying?" x={960} y={260} size={76} color={C.ink}/>
      <DotGrid f={f} at={tCust} x={960} y={640} hi={0} hiAt={9999} cols={40} cell={17} seed="dots"/>
      <RechargePhone f={f} x={1560} y={640} s={0.5} enterAt={tKeep - 8} tapAt={tap} rot={-3}/>
    </Frame>
  );
};

export const SHOTS06: Shot[] = [
  S("s06p1", 0, MZ, q1, "s06-strip"),
  S("s06p3", 0, WL, q2, "s06-table-bar"),
  S("s06p6", 0, PU, q3, "s06-700-all"),
  S("s06p6", "supporting|-0.35", WR, q4, "s06-building"),
  S("s06p7", "the mix|-0.3", H0, q5, "s06-mix"),
  S("s06p8", 0, PU, q6, "s06-customer"),
];
export const CUES06: SCue[] = [
  [W("s06p1", "Spectrum") + 0.1, "pop", 0.25],
  [W("s06p3", "spectrum") + 0.2, "highlighter", 0.4],
  [W("s06p4", "percent") - 0.35, "pop", 0.45],
  [W("s06p6", "nationwide") + 0.1, "pop", 0.3],
  [W("s06p6", "reach") - 0.3, "whoosh", 0.25],
  [W("s06p8", "paying") - 0.15, "click", 0.4],
];
