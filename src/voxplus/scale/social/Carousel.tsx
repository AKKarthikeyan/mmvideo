// Instagram carousel (10 slides, 1080x1350) for "Jio's Size Advantage Has a Catch" (20 Oct 2026). Copy and figures: SHORTS_and_SOCIAL.md
// ("Instagram carousel"); every figure is in scripts/ledger/jioscale.csv. Original VoxPlus look, no logos, no faces, no price band or valuation.
// Nothing under 28 px; 60 px safe margins. Slides 4-8 share one template (KindSlide): kind of moat, evidence, verdict stamp.
import React from "react";
import {C, F} from "../kit/tokens";
import {useVoxFonts} from "../kit/fonts";
import {random} from "remotion";
import {ENTITY, EntityTag, GREY_BAR, Hi, KindSlide, Slide, T, VERDICTS, pillStyle} from "./common";

/** Horizontal bar with a figure at its end. */
const Bar: React.FC<{x?: number; y: number; w: number; h?: number; color: string; value: string; size?: number; children?: React.ReactNode; vcolor?: string}> =
  ({x = 60, y, w, h = 100, color, value, size = 108, children, vcolor = C.ink}) => (
    <>
      <div style={{position: "absolute", left: x, top: y, width: w, height: h, background: color, boxShadow: "0 8px 18px rgba(0,0,0,0.18)"}}>{children}</div>
      <T x={x + w + 26} y={y + h / 2 - size * 0.56} size={size} serif ls={-2} lh={1.1} color={vcolor} style={{whiteSpace: "nowrap"}}>{value}</T>
    </>
  );

// ------------------------------------------------------------------------------------------------ 1 cover
export const S1: React.FC = () => {
  useVoxFonts();
  const kinds = ["Low cost", "A name people trust", "Hard to leave", "A crowd", "A licence"];
  return (
    <Slide n={1}>
      <EntityTag f={0} text="THE FIVE-MOATS TEST" period="JIO" x={60} y={104} size={30}/>
      <T x={60} y={170} w={960} size={122} serif ls={-3.5} lh={1}>Jio is India's biggest telco.</T>
      <T x={60} y={450} w={960} size={132} serif ls={-4} lh={1.24} color={C.ink}>Is it the<br/><span style={{whiteSpace: "nowrap"}}><Hi>best protected?</Hi></span></T>
      <div style={{position: "absolute", left: 60, top: 880, width: 960, display: "flex", flexWrap: "wrap", gap: 14}}>
        {kinds.map((k, i) => (
          <div key={k} style={{display: "flex", alignItems: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 0.5, boxShadow: "0 6px 14px rgba(0,0,0,0.14)"}}>
            <span style={{background: i === 2 ? C.teal : C.ink, color: C.white, padding: "10px 18px"}}>{i + 1}</span>
            <span style={{background: C.white, color: C.ink, padding: "10px 20px"}}>{k}</span>
          </div>
        ))}
      </div>
      <T x={60} y={1070} size={64} serif color={C.teal} ls={-1}>Swipe for the verdict →</T>
    </Slide>
  );
};

// ------------------------------------------------------------------------------------------------ 2 the surprise (₹100 -> ~₹20.5)
export const S2: React.FC = () => {
  useVoxFonts();
  const cell = 38, gap = 4, gx = 1020 - (10 * cell + 9 * gap), gy = 420;
  return (
    <Slide n={2} dark src="RHP p.330, p.370 · our calculation">
      <EntityTag f={0} text={ENTITY.jioPlat} period="FY26" x={60} y={104} size={30} dark/>
      <T x={60} y={160} w={960} size={92} serif ls={-2.5} lh={1.02} color={C.white}>What is left of ₹100 of revenue?</T>
      <T x={60} y={400} size={150} serif ls={-4} color={C.white}>₹100</T>
      <T x={64} y={555} size={36} weight={800} color="#B9B2A6" ls={1}>OF REVENUE</T>
      <T x={60} y={625} size={150} serif ls={-4} color={C.highlightPrint}>~₹20.5</T>
      <T x={64} y={780} size={36} weight={800} color="#B9B2A6" ls={1}>NET PROFIT</T>
      <svg width={1080} height={1350} style={{position: "absolute", left: 0, top: 0}}>
        {Array.from({length: 100}, (_, i) => {
          const col = i % 10, row = Math.floor(i / 10), v = Math.max(0, Math.min(1, 20.5 - i));
          const x = gx + col * (cell + gap), y = gy + row * (cell + gap);
          return (
            <g key={i}>
              <rect x={x} y={y} width={cell} height={cell} fill="#3A3631"/>
              {v > 0 ? <rect x={x} y={y} width={cell * v} height={cell} fill={C.highlightPrint}/> : null}
            </g>
          );
        })}
      </svg>
      <T x={60} y={880} w={960} size={36} weight={600} color="#D8D2C6" lh={1.3}>Every square is ₹1. After network, staff, spectrum, depreciation, interest and tax. Our calculation from reported FY26 figures.</T>
    </Slide>
  );
};

// ------------------------------------------------------------------------------------------------ 3 the gap (₹119 vs ₹154)
export const S3: React.FC = () => {
  useVoxFonts();
  const k = 3.4, jio = 119 * k, air = 154 * k;
  return (
    <Slide n={3} src="RHP p.34, p.117, p.131 · AAR p.180, p.250">
      <T x={60} y={84} w={960} size={100} serif ls={-3} lh={1.2}>EBITDA per customer, <Hi>a month</Hi></T>
      <EntityTag f={0} text={ENTITY.rjil} period="FY26" x={60} y={402} size={30}/>
      <Bar y={440} w={jio} color={C.teal} value="₹119"/>
      <EntityTag f={0} text={ENTITY.airtelMob} period="FY26" x={60} y={612} size={30}/>
      <Bar y={650} w={air} color={GREY_BAR} value="₹154">
        <div style={{position: "absolute", left: jio, top: 0, width: air - jio, height: "100%",
          background: `repeating-linear-gradient(135deg, ${C.rust} 0 12px, #F3EEE3 12px 20px)`}}/>
      </Bar>
      <T x={60} y={810} size={100} serif ls={-3} color={C.rust}>~₹35 gap</T>
      <T x={60} y={930} w={960} size={36} weight={600} color={C.inkSoft} lh={1.3}>Different business scopes: Jio telecom company vs Airtel India mobile. Our calculation.</T>
    </Slide>
  );
};

// ------------------------------------------------------------------------------------------------ 4 low cost
export const S4: React.FC = () => {
  useVoxFonts();
  const k = 2.3;
  return (
    <KindSlide slide={4} kind={1} title="Low cost?" verdict="PLAUSIBLE, NOT PROVEN" src="RHP p.131, p.136 · notes p.132, p.137">
      <EntityTag f={0} text={ENTITY.jioPlat} period="FY26" x={60} y={355} size={30}/>
      <Bar y={392} w={241.4 * k} h={96} color={C.teal} value="241.4"/>
      <EntityTag f={0} text={ENTITY.airtelMob} period="FY26" x={60} y={555} size={30}/>
      <Bar y={592} w={101.3 * k} h={96} color={GREY_BAR} value="101.3"/>
      <T x={60} y={716} size={36} weight={800} color={C.inkSoft} ls={1}>BILLION GB CARRIED</T>
      <T x={60} y={790} w={960} size={36} weight={800} lh={1.3}><Hi pad={10}>Not like for like:</Hi> Jio's figure includes home broadband. Airtel's is mobile only.</T>
    </KindSlide>
  );
};

// ------------------------------------------------------------------------------------------------ 5 a trusted name
export const S5: React.FC = () => {
  useVoxFonts();
  const rows: [string, string, string, string, string][] = [
    [ENTITY.rjil, "ARPU · EXIT QUARTER", "₹181.7", "₹206.2", "up"],
    [ENTITY.rjil, "CHURN · EXIT QUARTER", "1.52%", "1.81%", "up"],
    [ENTITY.rjil, "NET ADDS · FULL YEAR", "4.25 crore", "64 lakh", "down"],
  ];
  return (
    <KindSlide slide={5} kind={2} title="A trusted name?" verdict="MIXED" src="RHP p.42, p.43, p.131">
      {rows.map(([ent, per, a, b, dir], i) => (
        <React.Fragment key={per}>
          <EntityTag f={0} text={ent} period={per} x={60} y={352 + i * 188} size={30}/>
          <T x={60} y={388 + i * 188} size={96} serif ls={-2} color={C.ink} style={{whiteSpace: "nowrap"}}>
            {a} <span style={{color: dir === "up" ? C.teal : C.rust}}>→</span> <span style={{color: dir === "up" ? C.ink : C.rust}}>{b}</span></T>
        </React.Fragment>
      ))}
      <T x={60} y={900} w={960} size={34} weight={800} color={C.inkSoft} ls={0.5}>FY24 → FY25 · after the Q2 FY25 tariff rise</T>
    </KindSlide>
  );
};

// ------------------------------------------------------------------------------------------------ 6 hard to leave
/** 1,000 connections (50 x 20); `hi` of them (seeded positions) are the ones that leave each month, drawn large in marker red. */
const Dots: React.FC<{x: number; y: number; hi: number; seed: string}> = ({x, y, hi, seed}) => {
  const cell = 8, cols = 50, order = Array.from({length: 1000}, (_, i) => i).sort((a, b) => random(seed + a) - random(seed + b)).slice(0, hi), set = new Set(order);
  return (
    <svg width={cols * cell} height={20 * cell} style={{position: "absolute", left: x, top: y, overflow: "visible"}}>
      {Array.from({length: 1000}, (_, i) => set.has(i) ? null : <circle key={i} cx={(i % cols) * cell + cell / 2} cy={Math.floor(i / cols) * cell + cell / 2} r={2.4} fill={C.teal} opacity={0.42}/>)}
      {order.map((i) => <circle key={i} cx={(i % cols) * cell + cell / 2} cy={Math.floor(i / cols) * cell + cell / 2} r={5.4} fill={C.rust} stroke={C.white} strokeWidth={1.5}/>)}
    </svg>
  );
};
export const S6: React.FC = () => {
  useVoxFonts();
  const years: [string, string, string][] = [["FY24", "1.52", "2.37"], ["FY25", "1.81", "2.31"], ["FY26", "1.67", "2.43"]];
  const row = (y: number, ent: string, big: string, per1000: string, hi: number, color: string) => (
    <>
      <EntityTag f={0} text={ent} period="EXIT QUARTER FY26" x={60} y={y} size={30}/>
      <T x={60} y={y + 36} size={124} serif ls={-3} color={color}>{big}</T>
      <T x={64} y={y + 164} size={32} weight={800} color={C.inkSoft}>{per1000}</T>
      <Dots x={610} y={y + 44} hi={hi} seed={"churn" + hi}/>
    </>
  );
  return (
    <KindSlide slide={6} kind={3} title="Hard to leave?" verdict="ENCOURAGING, NOT PROVEN" src="RHP p.131, p.132 note 1, p.136">
      {row(318, ENTITY.rjil, "1.67%", "~17 per 1,000 a month", 17, C.teal)}
      {row(548, ENTITY.airtelMob, "2.43%", "~24 per 1,000 a month", 24, GREY_BAR)}
      <T x={60} y={782} size={28} weight={800} color={C.inkSoft} ls={0.5}>JIO LOWER IN EACH OF THE LAST 3 YEARS, BUT BASES DIFFER:</T>
      <T x={60} y={816} size={28} weight={800} color={C.rust} ls={0.5}>JIO INCLUDES HOME BROADBAND · AIRTEL IS MOBILE ONLY</T>
      <div style={{position: "absolute", left: 60, top: 856, width: 960, display: "flex", gap: 14}}>
        {years.map(([y, j, a]) => (
          <div key={y} style={{flex: 1, background: C.white, boxShadow: "0 6px 14px rgba(0,0,0,0.14)", padding: "10px 16px 12px", borderTop: `6px solid ${C.ink}`}}>
            <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 28, color: C.grey, letterSpacing: 1}}>{y}</div>
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36, whiteSpace: "nowrap"}}><span style={{color: C.teal}}>{j}{y === "FY25" ? " ▲" : ""}</span> <span style={{color: C.grey}}>vs</span> {a}</div>
            {y === "FY25" ? <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.rust}}>after the price rise</div> : null}
          </div>
        ))}
      </div>
    </KindSlide>
  );
};

// ------------------------------------------------------------------------------------------------ 7 a crowd
const Phone: React.FC<{x: number; y: number; color: string; label: string}> = ({x, y, color, label}) => (
  <>
    <div style={{position: "absolute", left: x - 56, top: y - 96, width: 112, height: 192, borderRadius: 22, background: C.white, border: `10px solid ${color}`, boxShadow: "0 10px 20px rgba(0,0,0,0.2)"}}>
      <div style={{position: "absolute", left: 28, top: 20, width: 36, height: 8, borderRadius: 4, background: color, opacity: 0.6}}/>
    </div>
    <T x={x - 200} y={y + 112} w={400} size={30} weight={800} align="center" color={color === C.teal ? C.teal : C.inkSoft} ls={1}>{label}</T>
  </>
);
export const S7: React.FC = () => {
  useVoxFonts();
  return (
    <KindSlide slide={7} kind={4} title="A crowd?" verdict="SCALE ONLY" src="TRAI QPIR table 1.11">
      <EntityTag f={0} text={ENTITY.trai} period="30 JUN 2026" x={60} y={340} size={30}/>
      <T x={56} y={376} size={236} serif ls={-6} color={C.ink} style={{whiteSpace: "nowrap"}}>51.76<span style={{fontSize: 100, letterSpacing: -2, marginLeft: 18, color: C.teal}}>crore</span></T>
      <T x={60} y={620} w={960} size={38} weight={800} color={C.inkSoft}>Jio has the most subscribers in India.</T>
      <Phone x={150} y={790} color={C.teal} label="JIO"/>
      <Phone x={890} y={790} color={GREY_BAR} label="OTHER NETWORK"/>
      <svg width={1080} height={1350} style={{position: "absolute", left: 0, top: 0}}>
        <line x1={235} x2={805} y1={790} y2={790} stroke={C.rust} strokeWidth={8} strokeDasharray="2 18" strokeLinecap="round"/>
      </svg>
      <div style={{position: "absolute", left: 520, top: 790, transform: "translate(-50%, -50%)", background: C.highlight, color: C.ink, fontFamily: F.sans, fontWeight: 800,
        fontSize: 34, padding: "10px 22px", whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(0,0,0,0.18)"}}>calls cross networks</div>
    </KindSlide>
  );
};

// ------------------------------------------------------------------------------------------------ 8 a licence
export const S8: React.FC = () => {
  useVoxFonts();
  const W = 960, total = 26800.8, jioW = W, ghz = (22000 / total) * W, airW = (18000 / total) * W;
  return (
    <KindSlide slide={8} kind={5} title="A licence?" verdict="PARTIAL" src="RHP p.137, p.164, p.221-225 · AAR p.52">
      <EntityTag f={0} text="JIO PLATFORMS" period="ALL BANDS 26,800.8 MHZ" x={60} y={352} size={30}/>
      <div style={{position: "absolute", left: 60, top: 392, width: jioW, height: 78, background: C.inkSoft, boxShadow: "0 8px 18px rgba(0,0,0,0.18)"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: ghz, height: "100%", background: C.teal, display: "flex", alignItems: "center", paddingLeft: 20,
          fontFamily: F.sans, fontWeight: 800, fontSize: 32, color: C.white, whiteSpace: "nowrap"}}>26 GHz · 22,000 MHz · 82%</div>
        <div style={{position: "absolute", left: ghz, top: 0, width: jioW - ghz, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: "#D8D2C6"}}>other</div>
      </div>
      <EntityTag f={0} text={ENTITY.airtel} period="26 GHZ BAND" x={60} y={528} size={30}/>
      <div style={{position: "absolute", left: 60, top: 568, width: airW, height: 78, background: GREY_BAR, display: "flex", alignItems: "center", paddingLeft: 20,
        fontFamily: F.sans, fontWeight: 800, fontSize: 32, color: C.white, whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(0,0,0,0.18)"}}>18,000 MHz</div>
      <T x={60} y={680} size={34} weight={800} color={C.inkSoft} ls={0.5}>JIO'S 700 MHz: ALL 22 CIRCLES</T>
      <div style={{position: "absolute", left: 60, top: 740, width: 960, display: "flex", flexWrap: "wrap", gap: 8}}>
        {Array.from({length: 22}, (_, i) => (
          <div key={i} style={{width: 76, height: 70, background: C.highlight, color: C.ink, fontFamily: F.sans, fontWeight: 800, fontSize: 30, display: "flex",
            alignItems: "center", justifyContent: "center", boxShadow: "0 4px 8px rgba(0,0,0,0.16)"}}>700</div>
        ))}
      </div>
      <T x={60} y={900} size={40} serif color={C.teal} ls={-0.5}>valid until 2042</T>
    </KindSlide>
  );
};

// ------------------------------------------------------------------------------------------------ 9 the footnote
export const S9: React.FC = () => {
  useVoxFonts();
  return (
    <Slide n={9} src="RHP p.132 · p.137 note 2 · our calculation">
      <EntityTag f={0} text={ENTITY.jioPlat} period="FY26" x={60} y={104} size={30}/>
      <T x={60} y={196} w={960} size={116} serif ls={-3.5} lh={1}>The <Hi>footnote</Hi></T>
      <T x={60} y={366} size={34} weight={800} color={C.inkSoft} ls={2}>NET DEBT ÷ EBITDA</T>
      <T x={52} y={420} size={220} serif ls={-6} color={C.ink}>0.36×</T>
      <T x={620} y={470} w={400} size={36} weight={800}>AS REPORTED</T>
      <T x={620} y={518} w={400} size={32} weight={600} color={C.inkSoft} lh={1.2}>net debt leaves out deferred spectrum payments</T>
      <T x={52} y={690} size={220} serif ls={-6} color={C.rust}>~1.73×</T>
      <T x={720} y={740} w={300} size={36} weight={800} color={C.rust}>ADDED BACK</T>
      <T x={720} y={788} w={300} size={32} weight={600} color={C.inkSoft} lh={1.2}>₹1,04,514 crore of deferred spectrum dues</T>
      <T x={60} y={960} w={960} size={36} weight={800} lh={1.3}><Hi pad={10}>Same EBITDA, same year.</Hi> Only the debt changes.</T>
    </Slide>
  );
};

// ------------------------------------------------------------------------------------------------ 10 verdict
export const S10: React.FC = () => {
  useVoxFonts();
  const watch = ["Earnings per customer", "Retention", "Cash and capital returns"];
  return (
    <Slide n={10} dark src="Jio RHP · TRAI · Airtel AR · our view">
      <T x={60} y={78} size={32} weight={800} color="#B9B2A6" ls={5}>OUR ASSESSMENT</T>
      <T x={60} y={124} w={960} size={150} serif ls={-4} lh={1} color={C.white}>Narrow <span style={{background: C.highlight, color: C.ink, padding: "0 16px"}}>moat</span></T>
      {VERDICTS.map(([k, v, tone], i) => {
        const p = pillStyle(tone);
        return (
          <div key={k} style={{position: "absolute", left: 60, top: 316 + i * 78, width: 960, height: 66, display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "2px solid #3A3631"}}>
            <div style={{display: "flex", alignItems: "center", gap: 18}}>
              <span style={{fontFamily: F.mono, fontWeight: 500, fontSize: 32, color: "#B9B2A6", width: 30}}>{i + 1}</span>
              <span style={{fontFamily: F.serif, fontSize: 48, color: C.white, letterSpacing: -0.5}}>{k}</span>
            </div>
            <span style={{background: p.bg, color: p.fg, fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 1, padding: "8px 16px 7px", whiteSpace: "nowrap"}}>{v}</span>
          </div>
        );
      })}
      <T x={60} y={730} size={32} weight={800} color="#B9B2A6" ls={5}>THREE THINGS TO WATCH</T>
      <div style={{position: "absolute", left: 60, top: 782, width: 960, display: "flex", gap: 14}}>
        {watch.map((w, i) => (
          <div key={w} style={{flex: 1, background: C.white, color: C.ink, padding: "12px 16px 14px", minHeight: 150, borderTop: `8px solid ${C.highlight}`}}>
            <div style={{fontFamily: F.serif, fontSize: 44, color: C.teal, lineHeight: 1}}>{i + 1}</div>
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 32, lineHeight: 1.12, marginTop: 6}}>{w}</div>
          </div>
        ))}
      </div>
      <T x={60} y={990} size={36} weight={800} color={C.white}>Not investment advice.</T>
    </Slide>
  );
};
