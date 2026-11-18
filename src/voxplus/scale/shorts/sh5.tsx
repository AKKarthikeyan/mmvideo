// Short 5/5: A licence, "What does Jio's spectrum give it?" (vertical, VoxPlus look).
// Shots: moat card; the licence as permission; 26,800.8 MHz bar; it splits into 22,000 MHz = 82% (26 GHz); Airtel's 18,000 MHz on the
// same scale; 22 "700" tiles (in all 22 circles, to 2042); the cash calendar; deferred spectrum liabilities; verdict stamp PARTIAL.
import React from "react";
import {Shot, SP, Stamp} from "../kit/A01V4Parts";
import {SCue} from "../kit/A01V4Cold";
import {DocPage} from "../kit/DocPage";
import {Rect} from "../kit/Marker";
import {StickerLabel} from "../kit/Collage";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "../kit/tokens";
import {CashCalendar, ENTITY, EntityTag} from "../devices";
import {H0, PU, S, W, WL, WR, useAt} from "./cue";
import {VFrame, VSource} from "./frame";
import {Svg, Txt} from "../parts56";
import {Badge, MoatCard} from "./parts15";
import AR from "../../../../public/voxplus/scale/docs/sc06_airtel26.json";

const K = "sh5";
const TOT = 26800.8, BX = 60, BW = 960, bx = (m: number) => (BW * m) / TOT;
const HOLD = {text: "RJIL · JIO HOLDINGS", period: "AS OF 30 JUN 2026"};

// 1. moat card
const c1: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <VFrame f={f} d={d}><MoatCard f={f} n={5} title="A LICENCE?" sub="What does Jio's spectrum give it?"/></VFrame>;
};

// 2. a licence: the rule-maker's permission to operate (code-drawn certificate)
const c2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const e = spr(f, -8, 12, 160), seal = spr(f, a("operate"), 9, 230);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.04]}>
      <div style={{position: "absolute", left: 90, top: 380, width: 900, height: 780, background: C.white, transform: `translateY(${(1 - e) * 200}px) rotate(-1.5deg)`, opacity: clamp01(e * 2),
        boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 24px 44px rgba(30,20,10,0.24)", border: `4px solid ${C.ink}`, outline: `3px solid ${C.ink}`, outlineOffset: -22, boxSizing: "border-box"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: F.serif, fontSize: 120, color: C.ink, letterSpacing: 6}}>LICENCE</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 5, color: C.grey,
          opacity: ease(f, a("rule"), a("rule") + 8)}}>PERMISSION TO OPERATE</div>
        {[0, 1, 2].map((i) => <div key={i} style={{position: "absolute", left: 90, top: 340 + i * 64, width: [600, 680, 520][i] * ease(f, a("permission") + i * 4, a("permission") + i * 4 + 14), height: 16, background: "rgba(14,14,14,0.14)"}}/>)}
        <div style={{position: "absolute", right: 90, bottom: 80, width: 190, height: 190, borderRadius: 95, border: `10px double ${C.teal}`, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.serif, fontSize: 56, color: C.teal, transform: `scale(${seal}) rotate(-14deg)`, opacity: clamp01(seal * 2)}}>OK</div>
        <div style={{position: "absolute", left: 90, bottom: 110, fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: C.ink, opacity: ease(f, a("rule"), a("rule") + 8)}}>the rule-maker's</div>
      </div>
      <VSource text="Illustration · code-drawn"/>
    </VFrame>
  );
};

// 3-5. the bandwidth bars: total, 82% split, Airtel on the same scale (one layout, states by time)
const LicBars: React.FC<{f: number; a: (x: string) => number}> = ({f, a}) => {
  const tNum = a("twenty six thousand"), tPct = a("eighty"), tBand = a("twenty six gigahertz"), tAir = a("Airtel"), tAn = a("eighteen");
  const BH = 170, AT = 640, AY = 690;
  const dy = ease(f, tAir - 10, tAir + 14, inOut), top = 1 - ease(f, tAir - 10, tAir + 4);
  const BY = 600 - 290 * dy, JT = 300 - 50 * dy;
  const nv = TOT * ease(f, tNum, tNum + 46, outQuint), grow = ease(f, a("Jio holds") + 2, a("Jio holds") + 16, outQuint);
  const part = ease(f, tPct - 4, tPct + 22, inOut), n82 = Math.round(82 * ease(f, tPct, tPct + 20, outQuint));
  const slices = ease(f, tBand - 10, tBand + 14, inOut);
  const aw = ease(f, tAn - 10, tAn + 24, outQuint);
  const legend = ease(f, tBand, tBand + 10) * top;
  return (
    <>
      <EntityTag f={f} at={-20} {...HOLD} x={BX} y={JT} size={28}/>
      <div style={{opacity: top}}>
        <div style={{position: "absolute", left: BX, top: 340, fontFamily: F.serif, fontSize: 190, lineHeight: 1, color: C.ink, opacity: f >= tNum - 2 ? 1 : 0, whiteSpace: "nowrap"}}>{nv.toLocaleString("en-IN", {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
        <Txt f={f} at={a("megahertz")} text="MHz · all bands" x={BX} y={545} size={36} weight={600} color={C.grey} align="left"/>
      </div>
      <Svg>
        <rect x={BX} y={BY} width={BW * grow} height={BH} fill={C.grey} opacity={0.9}/>
        <rect x={BX} y={BY} width={bx(22000) * part} height={BH} fill={C.teal}/>
        {Array.from({length: 21}).map((_, i) => <line key={i} x1={BX + (bx(22000) * (i + 1)) / 22} x2={BX + (bx(22000) * (i + 1)) / 22} y1={BY + 10} y2={BY + BH - 10} stroke={C.white}
          strokeWidth={2} opacity={0.5 * slices * (part > 0.95 ? 1 : 0)}/>)}
      </Svg>
      {part > 0.35 ? <Txt f={f} at={tPct - 2} text="22,000" x={BX + 26} y={BY + BH / 2} size={84} color={C.white} align="left"/> : null}
      {part > 0.35 ? <Txt f={f} at={tPct} text={`= ${n82}%`} x={BX + bx(22000) - 26} y={BY + BH / 2} size={104} color={C.highlight} align="right"/> : null}
      {part > 0.95 ? <Txt f={f} at={tPct + 22} text="4,800.8" x={BX + bx(22000) + (BW - bx(22000)) / 2} y={BY + BH / 2} size={30} color={C.white}/> : null}
      <Txt f={f} at={tBand} text="26 GHz band" x={BX + bx(22000) / 2} y={BY + BH + 50} size={50} color={C.ink}/>
      <Txt f={f} at={tBand + 6} text="other bands" x={BX + bx(22000) + (BW - bx(22000)) / 2} y={BY + BH + 50} size={28} weight={600} color={C.grey}/>
      <div style={{opacity: top}}>
        <Txt f={f} at={tBand + 10} text="aggregated across licence areas" x={540} y={BY + BH + 135} size={38} color={C.ink}/>
        <Txt f={f} at={tBand + 14} text="22 × 1,000 MHz in the 26 GHz band" x={540} y={BY + BH + 190} size={32} weight={600} color={C.inkSoft}/>
      </div>
      <div style={{opacity: legend}}><Txt f={f} at={tBand + 18} text="Band = frequency (GHz).  Bar = bandwidth held (MHz)." x={540} y={BY + BH + 260} size={28} weight={600} color={C.grey}/></div>
      <EntityTag f={f} at={tAir} text={ENTITY.airtel} period="FY26" x={BX} y={AT} size={28}/>
      <Svg>{aw > 0 ? <g><rect x={BX} y={AY} width={bx(18000) * aw} height={BH} fill={C.teal} opacity={0.18}/><rect x={BX} y={AY} width={bx(18000) * aw} height={BH} fill="none" stroke={C.teal} strokeWidth={6}/></g> : null}</Svg>
      {aw > 0.5 ? <Txt f={f} at={tAn + 12} text="18,000 MHz" x={BX + 26} y={AY + BH / 2} size={92} color={C.ink} align="left"/> : null}
      {aw > 0.5 ? <Txt f={f} at={tAn + 14} text="26 GHz band · same scale" x={BX} y={AY + BH + 46} size={32} weight={600} color={C.grey} align="left"/> : null}
      <DocPage f={f} src="scale/docs/sc06_airtel26.png" imgW={AR.w} imgH={AR.h} x={540} y={1130} width={520} margin={0.04} enter={{at: tAn + 10, mode: "slide-up", dur: 12}}
        highlights={[{rects: AR.rects["18000 MHz in the mmWave (26 GHz) band"] as Rect[], at: tAn + 22, dur: 14}]}/>
      <Txt f={f} at={tAn + 14} text="Airtel Annual Report 2025-26, p.52" x={540} y={1250} size={24} weight={600} color={C.grey}/>
    </>
  );
};
const c3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return <VFrame f={f} d={d} z={[1.0, 1.02]}><LicBars f={f} a={a}/><VSource text="Jio Platforms RHP p.221-225 · total, 30 June 2026"/></VFrame>;
};
const c4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return <VFrame f={f} d={d} z={[1.0, 1.02]}><LicBars f={f} a={a}/><VSource text="Jio Platforms RHP p.222-225 · 26 GHz, 1,000 MHz per circle"/></VFrame>;
};
const c5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return <VFrame f={f} d={d} z={[1.0, 1.02]}><LicBars f={f} a={a}/><VSource text="Airtel Annual Report 2025-26 p.52 · same MHz scale"/></VFrame>;
};

// 6. 700 MHz: smaller, but in every circle, to 2042
const TX0 = 70, TW = 220, TH = 128, GAP = 20, TY0 = 330;
const slot = (i: number): [number, number] => [TX0 + (i % 4) * (TW + GAP), TY0 + Math.floor(i / 4) * (TH + GAP)];
const c6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0), e = spr(f, -8, 11, 170);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <div style={{position: "absolute", left: 140, top: 520, width: 800, height: 520, background: C.teal, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transform: `scale(${0.8 + 0.2 * e})`, opacity: clamp01(e * 3), boxShadow: "0 18px 40px rgba(0,0,0,0.25)"}}>
        <div style={{fontFamily: F.serif, fontSize: 210, color: C.white, lineHeight: 1}}>700 MHz</div>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.highlight, marginTop: 20}}>FREQUENCY OF THE BAND</div>
      </div>
      <Txt f={f} at={a("smaller")} text="smaller" x={540} y={1200} size={110} color={C.ink}/>
      <VSource text="Jio RHP p.222-225 · 700 MHz band"/>
    </VFrame>
  );
};
const Tiles: React.FC<{f: number; a: (x: string) => number; banner: boolean}> = ({f, a, banner}) => {
  const t1 = a("all twenty two");
  return (
    <>
      <EntityTag f={f} at={-20} {...HOLD} x={TX0} y={262} size={28}/>
      <Svg>
        {Array.from({length: 22}).map((_, i) => {
          const [x, y] = slot(i);
          const at = i === 0 ? -20 : t1 + (i - 1) * 1.3, p = spr(f, at, 12, 220);
          return (
            <g key={i}>
              <rect x={x} y={y} width={TW} height={TH} rx={10} fill="none" stroke={C.grey} strokeWidth={3} strokeDasharray="10 8" opacity={0.7}/>
              {p > 0 ? <g transform={`translate(${x + TW / 2} ${y + TH / 2}) scale(${p}) translate(${-TW / 2} ${-TH / 2})`} opacity={clamp01(p * 2)}>
                <rect width={TW} height={TH} rx={10} fill={C.teal}/><text x={TW / 2} y={TH / 2 + 22} textAnchor="middle" fontFamily={F.serif} fontSize={64} fill={C.white}>700</text></g> : null}
            </g>
          );
        })}
      </Svg>
      <Txt f={f} at={banner ? -10 : t1} text="in all 22 circles" x={540} y={1296} size={72} color={C.ink}/>
      <Txt f={f} at={banner ? -10 : a("until")} text="to 2042" x={540} y={1376} size={72} color={C.teal}/>
    </>
  );
};
const c7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return <VFrame f={f} d={d} z={[1.0, 1.02]}><Tiles f={f} a={a} banner={false}/><VSource text="Jio RHP p.222-225 · our count of 22"/></VFrame>;
};
const c8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return <VFrame f={f} d={d} z={[1.0, 1.02]}><Tiles f={f} a={a} banner/><VSource text="Jio RHP p.222-225 · our count of 22"/></VFrame>;
};

// 7. spectrum costs money: the cash calendar, then the deferred liabilities
const c9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <CashCalendar f={f} at={-10} x={540} y={780} w={900} rot={-1.5}/>
      <VSource text="Illustration · cash payments, no amounts or dates"/>
    </VFrame>
  );
};
const c10: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0), t = a("owes"), v = 104514 * ease(f, t, t + 44, outQuint);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <EntityTag f={f} at={-20} text={ENTITY.jioPlat} period="AT 31 MAR 2026" x={60} y={262} size={28}/>
      <Txt f={f} at={-10} text="Deferred spectrum liabilities" x={60} y={350} size={46} weight={800} color={C.inkSoft} align="left"/>
      <div style={{position: "absolute", left: 60, right: 60, top: 450, textAlign: "left", fontFamily: F.serif, fontSize: 190, lineHeight: 1, color: C.ink, opacity: f >= t - 2 ? 1 : 0, whiteSpace: "nowrap"}}>
        ₹{Math.round(v).toLocaleString("en-IN")}</div>
      <Txt f={f} at={t + 20} text="crore" x={60} y={700} size={110} color={C.ink} align="left"/>
      <Txt f={f} at={a("spectrum it")} text="still to pay for spectrum already bought" x={60} y={830} size={36} weight={600} color={C.grey} align="left"/>
      <CashCalendar f={f} at={-20} x={540} y={1130} w={560} rot={1.5}/>
      <VSource text="Jio Platforms RHP p.137 note 2 · p.364"/>
    </VFrame>
  );
};

// 8. verdict
const Row: React.FC<{f: number; y: number; at: number; kind: "yes" | "no" | "note"; text: string}> = ({f, y, at, kind, text}) => {
  const p = ease(f, at, at + 10, outCubic);
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -60}px)`}}>
      <Badge x={110} y={y + 50} kind={kind} at={at} f={f} r={36}/>
      <div style={{position: "absolute", left: 180, top: y, width: 840, fontFamily: F.sans, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: C.ink}}>{text}</div>
    </div>
  );
};
const c11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0), tV = a("Verdict");
  return (
    <VFrame f={f} d={d} z={[1.0, 1.02]}>
      <Row f={f} y={300} at={-8} kind="yes" text="Most spectrum: 26,800.8 MHz"/>
      <Row f={f} y={470} at={tV + 6} kind="note" text="82% is one band, where Airtel holds 18,000 MHz"/>
      <Row f={f} y={680} at={tV + 16} kind="yes" text="700 MHz in all 22 circles, to 2042"/>
      <Row f={f} y={850} at={tV + 26} kind="note" text="Still owes ₹1,04,514 crore for spectrum"/>
      <Stamp f={f} at={a("partial")} text="PARTIAL" x={540} y={1180} size={170} rot={-6}/>
      <VSource text="RHP p.137, p.222-225 · Airtel AR p.52"/>
    </VFrame>
  );
};

export const SHOTS_SH5: Shot[] = [
  S(K, 0, H0, c1, "sh5-card"),
  S(K, "the rule|-0.05", PU, c2, "sh5-licence"),
  S(K, "Jio holds|-0.1", WL, c3, "sh5-total"),
  S(K, "But eighty|-0.1", H0, c4, "sh5-82"),
  S(K, "where Airtel|-0.1", H0, c5, "sh5-airtel"),
  S(K, "What's distinctive|-0.1", PU, c6, "sh5-700"),
  S(K, "Jio holds seven|-0.1", H0, c7, "sh5-tiles"),
  S(K, "valid until|-0.1", H0, c8, "sh5-2042"),
  S(K, "And spectrum|-0.1", WL, c9, "sh5-calendar"),
  S(K, "Jio still|-0.1", H0, c10, "sh5-owes"),
  S(K, "Verdict|-0.1", WR, c11, "sh5-verdict"),
];
export const CUES_SH5: SCue[] = [
  [W(K, "twenty six thousand"), "pop", 0.35],
  [W(K, "eighty"), "highlighter", 0.4],
  [W(K, "all twenty two"), "pop", 0.3],
  [W(K, "partial|-0.05"), "stamp", 0.7],
];
