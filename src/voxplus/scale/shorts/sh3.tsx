// Short 3/5 | Hard to leave | "How many customers leave Jio each month?" (voice 33.9 s). Shots: moat card; 1,000-dot grid (illustration); Q4 FY26 and Jio's 1.67%;
// two grids with magnified insets "about 17" vs "about 24" (tagged EXIT QUARTER FY26); three-year strip 1.52/2.37, 1.81/2.31, 1.67/2.43; verdict stamp
// two cautions (bases differ; churn after the price rise); customers stay, not can't leave; verdict ENCOURAGING, NOT PROVEN. Figures: scripts/ledger/jioscale.csv (RHP p.131, p.136).
import React from "react";
import {Shot, SP, Stamp} from "../kit/A01V4Parts";
import {SCue} from "../kit/A01V4Cold";
import {StickerLabel} from "../kit/Collage";
import {C, F, clamp01, ease, outCubic, outQuint, spr, useTicks} from "../kit/tokens";
import {DotGrid, ENTITY, EntityTag} from "../devices";
import {H0, PU, S, W, WL, WR, useAt} from "./cue";
import {VFrame, VSource} from "./frame";
import {Fly, MoatCard} from "./parts23";

const K = "sh3";
const PERIOD = "EXIT QUARTER FY26";

const s1: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <VFrame f={f} d={d}><MoatCard f={f} n={3} l1="HARD TO" l2="LEAVE?" q="How many customers walk away each month?"/></VFrame>;
};

// "How many customers walk away each month?": one illustrative 1,000-dot grid
const s2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.04]}>
      <VSource text="Illustration · 1,000 connections"/>
      <div style={{position: "absolute", left: 60, right: 60, top: 270, textAlign: "center", fontFamily: F.serif, fontSize: 110, lineHeight: 1.05, color: C.ink}}>How many leave<br/>in a month?</div>
      <DotGrid f={f} at={-30} x={540} y={900} hi={0} hiAt={0} cols={40} cell={24}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 52, color: C.ink, opacity: ease(f, a("each month") - 6, a("each month") + 6)}}>PER 1,000 CONNECTIONS</div>
    </VFrame>
  );
};

// "In the last quarter of financial year twenty six, Jio reported monthly churn of one point six seven percent."
const s3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const q4 = ease(f, a("last quarter") - 4, a("last quarter") + 6, outCubic), num = spr(f, a("one point six seven") - 4, 11, 200);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131 · monthly churn (for exit quarter)"/>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period={PERIOD} x={60} y={265} size={32}/>
      <div style={{position: "absolute", left: 60, top: 330, fontFamily: F.serif, fontSize: 80, lineHeight: 1, color: C.ink}}>FY26 · LAST QUARTER</div>
      <div style={{position: "absolute", left: 60, top: 450, display: "flex", gap: 14}}>
        {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
          <div key={q} style={{width: 222, height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 80,
            background: i === 3 ? `rgba(255,242,0,${q4})` : "rgba(14,14,14,0.08)", color: C.ink, border: i === 3 ? `5px solid ${C.ink}` : "5px solid transparent"}}>{q}</div>
        ))}
      </div>
      <div style={{position: "absolute", left: 60, top: 700, fontFamily: F.sans, fontWeight: 800, fontSize: 48, letterSpacing: 3, color: C.grey}}>MONTHLY CHURN</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: F.serif, fontSize: 380, lineHeight: 1, color: C.ink, opacity: clamp01(num * 3),
        transform: `scale(${1.4 - 0.4 * num})`}}>1.67%</div>
    </VFrame>
  );
};

// the two rows: grid + reported rate; the departing dots fly into a magnified box "ABOUT 17" / "ABOUT 24"
const ROWS = [
  {top: 250, tag: ENTITY.rjil, hi: 17, rate: "1.67%", word: "17", rateKey: "one point six seven", flyKey: "seventeen", n: 17},
  {top: 830, tag: ENTITY.airtelMob, hi: 24, rate: "2.43%", word: "24", rateKey: "two point four three", flyKey: "twenty four", n: 24},
];
const s4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const cell = 12, cols = 50, gx = 60 + (cols * cell) / 2;
  return (
    <VFrame f={f} d={d} z={[1.0, 1.02]} cy={800}>
      <VSource text="Jio RHP p.131, p.136 · illustration · about 17 / 24 = our calculation"/>
      {ROWS.map((r, i) => {
        const gy = r.top + 60 + 120, flyAt = a(r.flyKey) - 4, hiAt = flyAt - 28 - 0, boxTop = r.top + 330;
        const rateAt = i === 0 ? -30 : a(r.rateKey) - 4, rp = spr(f, rateAt, 11, 200);
        const slot = (k: number): [number, number] => [60 + 54 + (k % 8) * 56, boxTop + 36 + Math.floor(k / 8) * 56];
        const cnt = ease(f, flyAt + 14 + r.n * 1.4, flyAt + 24 + r.n * 1.4, outCubic);
        return (
          <React.Fragment key={r.tag}>
            <EntityTag f={f} at={-30} text={r.tag} period={PERIOD} x={60} y={r.top + 22} size={28}/>
            <DotGrid f={f} at={i === 0 ? -30 : a("Airtel's") - 6} x={gx} y={gy} hi={r.hi} hiAt={hiAt} goneAt={flyAt} cols={cols} cell={cell}/>
            <div style={{position: "absolute", left: 700, top: r.top + 100, width: 320, textAlign: "center", opacity: clamp01(rp * 3), transform: `scale(${1.3 - 0.3 * rp})`, lineHeight: 1}}>
              <div style={{fontFamily: F.serif, fontSize: 130, color: C.ink}}>{r.rate}</div>
              <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.grey, marginTop: 8}}>MONTHLY CHURN</div>
            </div>
            <div style={{position: "absolute", left: 60, top: boxTop, width: 960, height: 230, background: C.white, border: `5px solid ${C.ink}`, borderRadius: 14,
              boxShadow: "0 14px 26px rgba(30,20,10,0.18)", opacity: 1}}>
              <div style={{position: "absolute", left: 24, top: 12, fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: C.grey, opacity: 1 - cnt}}>MAGNIFIED: DEPARTING DOTS</div>
              <div style={{position: "absolute", left: 560, top: 14, width: 380, textAlign: "center", opacity: cnt, lineHeight: 1}}>
                <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: C.ink}}>ABOUT</div>
                <div style={{fontFamily: F.serif, fontSize: 118, color: C.rust}}>{r.word}</div>
                <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: C.grey}}>PER 1,000</div>
              </div>
            </div>
            <Fly f={f} gx={gx} gy={gy} cell={cell} cols={cols} hi={r.hi} flyAt={flyAt + 8} slot={slot} R={22}/>
          </React.Fragment>
        );
      })}
    </VFrame>
  );
};

// "And Jio was lower in each of the last three years."
const STRIP = [{fy: "FY24", jio: 1.52, air: 2.37}, {fy: "FY25", jio: 1.81, air: 2.31}, {fy: "FY26", jio: 1.67, air: 2.43}];
const s5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const KX = 250, X0 = 230, top = 520;
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.136 · monthly churn (for exit quarter), % per month"/>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period="EXIT QUARTER" x={60} y={255} size={30}/>
      <EntityTag f={f} at={-30} text={ENTITY.airtelMob} period="EXIT QUARTER" x={60} y={320} size={30} dark/>
      <div style={{position: "absolute", left: 60, top: 372, fontFamily: F.serif, fontSize: 84, lineHeight: 1, color: C.ink}}>LAST 3 YEARS</div>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        <line x1={X0} x2={X0} y1={top - 20} y2={top + 760} stroke={C.ink} strokeWidth={5}/>
        {STRIP.map((r, i) => {
          const t0 = a("Jio") + 2 + i * 12, p = ease(f, t0, t0 + 18, outQuint), y = top + i * 260;
          return (
            <g key={r.fy} opacity={clamp01(p * 3)}>
              <text x={X0 - 22} y={y + 112} textAnchor="end" fontFamily={F.serif} fontSize={62} fill={C.ink}>{r.fy}</text>
              <rect x={X0} y={y} width={r.jio * KX * p} height={96} fill={C.teal}/>
              <rect x={X0} y={y + 110} width={r.air * KX * p} height={96} fill="#5E5A53"/>
              <text x={X0 + r.jio * KX * p + 16} y={y + 72} fontFamily={F.serif} fontSize={74} fill={C.ink}>{r.jio.toFixed(2)}</text>
              <text x={X0 + r.air * KX * p + 16} y={y + 182} fontFamily={F.serif} fontSize={74} fill={C.ink}>{r.air.toFixed(2)}</text>
            </g>
          );
        })}
      </svg>
      <StickerLabel f={f} text="Jio lower, 3 years running" x={540} y={1330} size={46} rot={-1} bg={C.teal} color={C.white} enter={{at: a("lower") - 4, mode: "pop", rot0: -5}}/>
    </VFrame>
  );
};

const PhoneIcon: React.FC<{x: number; y: number; s: number; at: number; f: number}> = ({x, y, s, at, f}) => {
  const p = spr(f, at, 12, 180);
  if (p <= 0.01) return null;
  return (
    <svg width={110 * s} height={170 * s} viewBox="0 0 110 170" style={{position: "absolute", left: x, top: y, opacity: clamp01(p * 2), transform: `scale(${0.7 + 0.3 * p})`}}>
      <rect x={6} y={6} width={98} height={158} rx={18} fill={C.ink}/><rect x={16} y={24} width={78} height={112} rx={6} fill={C.white}/><circle cx={55} cy={150} r={6} fill={C.grey}/>
    </svg>
  );
};
const HomeIcon: React.FC<{x: number; y: number; s: number; at: number; f: number}> = ({x, y, s, at, f}) => {
  const p = spr(f, at, 12, 180);
  if (p <= 0.01) return null;
  return (
    <svg width={150 * s} height={150 * s} viewBox="0 0 150 150" style={{position: "absolute", left: x, top: y, opacity: clamp01(p * 2), transform: `scale(${0.7 + 0.3 * p})`}}>
      <path d="M 10 72 L 75 14 L 140 72" fill="none" stroke={C.ink} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round"/>
      <rect x={30} y={72} width={90} height={64} fill={C.ink}/><rect x={64} y={96} width={22} height={40} fill={C.white}/>
    </svg>
  );
};
const Chip: React.FC<{f: number; at: number; text: string; y?: number}> = ({f, at, text, y = 262}) => {
  const p = ease(f, at, at + 8, outCubic);
  return <div style={{position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: p}}><span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 3, background: C.highlight, color: C.ink, padding: "10px 24px"}}>{text}</span></div>;
};

// "But two cautions. Jio's base includes home broadband customers; Airtel's figure is mobile only." The card, then the bases side by side
const s6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const k0 = a("Jio's") - 4, card = 1 - ease(f, k0, k0 + 10), rest = ease(f, k0 + 4, k0 + 16, outCubic);
  const h = a("home broadband"), air = a("Airtel's figure") - 4, rp = spr(f, a("home broadband") + 8, 11, 200), ap = ease(f, air, air + 10, outCubic);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.132 note 1 · Airtel: RHP p.136"/>
      <div style={{position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", opacity: card, transform: `scale(${0.92 + 0.08 * card})`}}>
        <div style={{fontFamily: F.serif, fontSize: 230, lineHeight: 1, color: C.ink}}>TWO</div>
        <div style={{fontFamily: F.serif, fontSize: 230, lineHeight: 1, color: C.teal, marginTop: 10}}>CAUTIONS</div>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 52, color: C.grey, marginTop: 40, letterSpacing: 4}}>1 · 2</div>
      </div>
      <Chip f={f} at={k0 + 4} text="CAUTION 1 · THE BASES DIFFER"/>
      <div style={{opacity: rest}}>
        <EntityTag f={f} at={k0 + 6} text={ENTITY.rjil} period="31 MAR 2026" x={60} y={372} size={30}/>
        <PhoneIcon f={f} x={60} y={430} s={1.0} at={k0 + 8}/>
        <HomeIcon f={f} x={190} y={450} s={1.0} at={h - 4}/>
        <div style={{position: "absolute", left: 360, top: 430, fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: C.ink, whiteSpace: "nowrap"}}>524.4 mn</div>
        <div style={{position: "absolute", left: 60, top: 625, width: 960, fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.ink, lineHeight: 1.25, opacity: rp}}>
          customers, of which <span style={{background: C.highlight, padding: "0 8px"}}>496.3 mn mobile broadband</span></div>
        <EntityTag f={f} at={air} text={ENTITY.airtelMob} x={60} y={850} size={30}/>
        <PhoneIcon f={f} x={60} y={905} s={1.0} at={air + 4}/>
        <div style={{position: "absolute", left: 220, top: 935, fontFamily: F.serif, fontSize: 96, lineHeight: 1, color: C.ink, whiteSpace: "nowrap", opacity: ap}}>India mobile only</div>
        <div style={{position: "absolute", left: 540 - 20, top: 800, fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: C.grey, opacity: ap}}/>
      </div>
    </VFrame>
  );
};

// "And after the price rise, Jio's churn went up while Airtel's went down." FY24 -> FY25 exit quarter
const RowChurn: React.FC<{f: number; y: number; tag: string; a0: string; a1: string; up: boolean; at: number; atTag: number}> = ({f, y, tag, a0, a1, up, at, atTag}) => {
  const p = spr(f, at, 11, 200);
  const big: React.CSSProperties = {position: "absolute", top: y + 40, fontFamily: F.serif, fontSize: 128, lineHeight: 1, color: C.ink, whiteSpace: "nowrap"};
  return (
    <>
      <EntityTag f={f} at={atTag} text={tag} period="EXIT QUARTER" x={60} y={y} size={30}/>
      <div style={{...big, left: 60}}>{a0}</div>
      <div style={{...big, left: 400, fontSize: 90, color: C.grey, top: y + 55}}>→</div>
      <div style={{...big, left: 520, opacity: clamp01(p * 3), transform: `scale(${1.3 - 0.3 * p})`, transformOrigin: "0 50%"}}>{a1}<span style={{color: up ? C.rust : C.teal, fontSize: 80}}>{up ? " ▲" : " ▼"}</span></div>
      <div style={{position: "absolute", left: 60, top: y + 190, fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: C.grey, whiteSpace: "nowrap"}}>FY24 exit quarter</div>
      <div style={{position: "absolute", left: 520, top: y + 190, fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: C.grey, whiteSpace: "nowrap"}}>FY25 exit quarter</div>
    </>
  );
};
const s7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131, p.136 · monthly churn (for exit quarter)"/>
      <Chip f={f} at={-30} text="CAUTION 2 · AFTER THE PRICE RISE"/>
      <RowChurn f={f} y={420} tag={ENTITY.rjil} a0="1.52%" a1="1.81%" up at={a("up") - 4} atTag={-30}/>
      <RowChurn f={f} y={880} tag={ENTITY.airtelMob} a0="2.37%" a1="2.31%" up={false} at={a("down") - 4} atTag={-30}/>
    </VFrame>
  );
};

// "Low churn shows customers stay, not that they can't leave."
const s8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const p1 = spr(f, -10, 12, 170), p2 = spr(f, a("not") - 6, 10, 220), p3 = spr(f, a("can't") - 6, 12, 170);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131, p.136"/>
      <div style={{position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: C.ink, opacity: clamp01(p1 * 2), transform: `translateY(${(1 - p1) * 40}px)`}}>CUSTOMERS<br/>STAY</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontFamily: F.serif, fontSize: 280, lineHeight: 1, color: C.rust, opacity: clamp01(p2 * 3), transform: `scale(${1.5 - 0.5 * p2})`}}>≠</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: C.teal, opacity: clamp01(p3 * 2), transform: `translateY(${(1 - p3) * 40}px)`}}>CAN'T<br/>LEAVE</div>
    </VFrame>
  );
};

// "Verdict: encouraging, not proven."
const s9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const chips = [["Lower churn, 3 years running", C.teal], ["Bases differ", C.ink], ["Churn rose after the price rise", C.rust]] as const;
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131, p.132, p.136"/>
      <div style={{position: "absolute", left: 0, right: 0, top: 290, textAlign: "center"}}><span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 44, letterSpacing: 4, background: C.highlight, color: C.ink, padding: "10px 26px"}}>VERDICT</span></div>
      <div style={{position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: F.serif, fontSize: 120, lineHeight: 1.05, color: C.ink}}>Hard to leave?</div>
      <Stamp f={f} at={a("encouraging") - 4} text="ENCOURAGING" x={540} y={770} size={112} rot={-5}/>
      <Stamp f={f} at={a("not proven") - 4} text="NOT PROVEN" x={540} y={965} size={112} rot={-3}/>
      {chips.map(([t, bg], i) => (
        <StickerLabel key={t} f={f} text={t} x={540} y={1150 + i * 90} size={40} rot={i % 2 ? 1 : -1} bg={bg} color={C.white} enter={{at: a("Verdict") + 10 + i * 10, mode: "pop", rot0: 4}}/>
      ))}
    </VFrame>
  );
};

export const SHOTS_SH3: Shot[] = [
  S(K, 0, H0, s1, "sh3-card"), S(K, "How many|-0.1", WL, s2, "sh3-grid"), S(K, "In the last|-0.1", PU, s3, "sh3-q4"), S(K, "Airtel's|-0.1", WR, s4, "sh3-rows"),
  S(K, "And Jio|-0.1", PU, s5, "sh3-strip"), S(K, "But two|-0.1", WL, s6, "sh3-bases"), S(K, "And after|-0.1", PU, s7, "sh3-after"), S(K, "Low churn|-0.1", WR, s8, "sh3-stay"),
  S(K, "Verdict|-0.1", PU, s9, "sh3-verdict"),
];
export const CUES_SH3: SCue[] = [[W(K, "seventeen"), "pop", 0.3], [W(K, "home broadband"), "pop", 0.3], [W(K, "encouraging"), "stamp", 0.5]];
