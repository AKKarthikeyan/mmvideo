// Shared pieces for scenes 03 and 04 ("Jio's Size Advantage Has a Catch"), review pass 20 Oct 2026 (original VoxPlus look).
// One dominant image per moment: the EBITDA-per-customer bars are full size with EntityTags; the 100 rupee units; the accounting
// bridge in two FULL-SIZE stages (₹100 -> ~₹50, then ~₹50 -> ~₹20.5) plus a combined summary and its small card.
import React from "react";
import {MarkerCircle} from "./kit/Marker";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr} from "./kit/tokens";
import {ENTITY, EntityTag} from "./devices";

export const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: F.serif, fontWeight: 400, fontSize: size, ...extra});

// =====================================================================================================
// small page caption under a document
// =====================================================================================================
export const PageCap: React.FC<{f: number; at?: number; x: number; y: number; text: string; size?: number}> = ({f, at = -30, x, y, text, size = 24}) => {
  const p = ease(f, at, at + 10, outQuint);
  if (p <= 0) return null;
  return <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: p, whiteSpace: "nowrap", fontFamily: F.mono, fontWeight: 500, fontSize: size, letterSpacing: 1.5,
    color: C.inkSoft, background: "rgba(246,242,233,0.94)", padding: "6px 14px", boxShadow: "0 2px 6px rgba(30,20,10,0.15)"}}>{text}</div>;
};

export const BasisTag: React.FC<{f: number; at: number; x: number; y: number; text: string; size?: number}> = ({f, at, x, y, text, size = 28}) => {
  const p = ease(f, at, at + 10, outQuint);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - p) * 16}px)`, opacity: p, whiteSpace: "nowrap",
      fontFamily: F.sans, fontWeight: 800, fontSize: size, color: C.teal, border: `3px solid ${C.teal}`, padding: "7px 18px 5px", background: C.white, letterSpacing: 0.5}}>{text}</div>
  );
};

// =====================================================================================================
// EBITDA per customer per month (our calculations): the dominant image. Equal-width, zero-based bars on one scale;
// each bar appears on its spoken number; EntityTags directly under the bars.
// =====================================================================================================
export const JX = 660, AX = 1260, BW = 330, BASE = 760, K = 2.55;   // world px
export const ChartTitle: React.FC<{f: number; at?: number}> = ({f, at = -20}) => {
  const p = ease(f, at, at + 12, outQuint);
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
      <div style={serif(54, {color: C.ink, letterSpacing: 1})}>ESTIMATED EBITDA / CUSTOMER / MONTH · FY26</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.inkSoft, marginTop: 8, letterSpacing: 1}}>₹ per customer per month · EBITDA ÷ average customers ÷ 12 · our calculations</div>
    </div>
  );
};

export const EbitdaChart: React.FC<{f: number; jioAt: number; airAt: number; diffAt?: number; braceAt?: number; catchAt?: number}> =
  ({f, jioAt, airAt, diffAt = 1e6, braceAt = 1e6, catchAt = 1e6}) => {
    const jp = ease(f, jioAt, jioAt + 26, outQuint), ap = ease(f, airAt, airAt + 26, outQuint);
    const yJ = BASE - 119 * K, yA = BASE - 154 * K, bx = AX + BW / 2 + 40;
    const dp = ease(f, diffAt, diffAt + 14, outCubic), bp = ease(f, braceAt, braceAt + 12, outCubic);
    const cp = ease(f, catchAt, catchAt + 8), pulse = f > catchAt ? 1 + 0.05 * Math.sin(Math.min(1, (f - catchAt) / 20) * Math.PI) : 1;
    const ty = BASE + 56;
    return (
      <>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={430} x2={1500} y1={BASE} y2={BASE} stroke={C.ink} strokeWidth={4}/>
          <text x={412} y={BASE + 9} textAnchor="end" fontFamily={F.sans} fontWeight={800} fontSize={28} fill={C.inkSoft}>₹0</text>
          <rect x={JX - BW / 2} y={BASE - 119 * K * jp} width={BW} height={119 * K * jp} fill={C.teal}/>
          <rect x={AX - BW / 2} y={BASE - 154 * K * ap} width={BW} height={154 * K * ap} fill={C.ink}/>
          {jp > 0.02 ? <text x={JX} y={BASE - 119 * K * jp - 20} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={116} fill={C.teal}
            opacity={clamp01(jp * 3)}>₹{Math.round(119 * jp)}</text> : null}
          {ap > 0.02 ? <text x={AX} y={BASE - 154 * K * ap - 20} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={116} fill={C.ink}
            opacity={clamp01(ap * 3)}>₹{Math.round(154 * ap)}</text> : null}
          {dp > 0 ? <line x1={JX + BW / 2} x2={JX + BW / 2 + (bx - JX - BW / 2) * dp} y1={yJ} y2={yJ} stroke={C.rust} strokeWidth={4} strokeDasharray="12 9"/> : null}
          {bp > 0 ? <>
            <path d={`M ${bx - 14} ${yJ} H ${bx} V ${yJ + (yA - yJ) * bp} H ${bx - 14}`} fill="none" stroke={C.rust} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
            <text x={bx + 22} y={(yJ + yA) / 2 + 28} fontFamily={F.serif} fontWeight={400} fontSize={84} fill={C.rust} opacity={clamp01((bp - 0.4) * 2)}>~₹35</text>
          </> : null}
          {cp > 0 ? <>
            <MarkerCircle f={f} at={catchAt} rect={[JX - 285, ty - 26, 570, 52]} dur={16} seed="cj" width={7} padX={0.04} padY={0.2}/>
            <MarkerCircle f={f} at={catchAt + 8} rect={[AX - 275, ty - 26, 550, 52]} dur={16} seed="ca" width={7} padX={0.04} padY={0.2}/>
          </> : null}
        </svg>
        <EntityTag f={f} at={-30} text={ENTITY.rjil} period="FY26" x={JX} y={ty} anchor="center" size={26}/>
        <EntityTag f={f} at={airAt - 8} text={ENTITY.airtelMob} period="FY26" x={AX} y={ty} anchor="center" size={26}/>
        {/* scope note: visible with the comparison from the first frame; solid rust on "catch" */}
        <div style={{position: "absolute", left: 960, top: BASE + 158, transform: `translate(-50%, -50%) scale(${pulse})`, whiteSpace: "nowrap",
          fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 1, padding: "8px 28px 6px",
          background: cp > 0.5 ? C.rust : C.white, color: cp > 0.5 ? C.white : C.rust, border: `4px solid ${C.rust}`,
          boxShadow: cp > 0.5 ? "0 0 0 8px rgba(224,36,94,0.18)" : "0 4px 10px rgba(0,0,0,0.12)"}}>Different business scopes</div>
      </>
    );
  };

// =====================================================================================================
// 100 equal rupee units (10 x 10): outlines from the first frame, units fill row by row
// =====================================================================================================
export const GX = 800, GY = 520, UC = 62, UG = 10;
export const UnitGrid: React.FC<{f: number; ghostAt: number; fillAt: number; fillDur?: number}> = ({f, ghostAt, fillAt, fillDur = 36}) => {
  const gp = ease(f, ghostAt, ghostAt + 14, outCubic);
  if (gp <= 0) return null;
  const tot = 10 * UC + 9 * UG, x0 = GX - tot / 2, y0 = GY - tot / 2;
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {Array.from({length: 100}, (_, i) => {
        const cx = x0 + (i % 10) * (UC + UG), cy = y0 + Math.floor(i / 10) * (UC + UG);
        const t = fillAt + (i / 100) * fillDur, p = spr(f, t, 14, 190);
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={UC} height={UC} fill="none" stroke={C.grey} strokeWidth={2} opacity={gp * 0.8}/>
            {p > 0.01 ? <g transform={`translate(${cx + UC / 2} ${cy + UC / 2}) scale(${p})`}>
              <rect x={-UC / 2} y={-UC / 2} width={UC} height={UC} fill={C.teal}/>
              <text x={0} y={10} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={30} fill={C.white}>₹</text>
            </g> : null}
          </g>
        );
      })}
    </svg>
  );
};

/** Right-hand labels beside the 100 units: the entity change and the rupee figure, with the EntityTag. */
export const GridLabels: React.FC<{f: number; chipAt: number; numAt: number; revAt: number}> = ({f, chipAt, numAt, revAt}) => {
  const cp = ease(f, chipAt, chipAt + 12, outQuint), np = spr(f, numAt, 12, 180), rp = ease(f, revAt, revAt + 10, outQuint);
  return (
    <>
      <EntityTag f={f} at={-30} text={ENTITY.jioPlat} period="FY26" x={1555} y={330} anchor="center" size={26}/>
      <div style={{position: "absolute", left: 1530, top: 245, transform: `translate(-50%, -50%) translateY(${(1 - cp) * 20}px)`, opacity: cp, whiteSpace: "nowrap", textAlign: "center"}}>
        <div style={{display: "inline-block", fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.grey, border: `3px dashed ${C.grey}`, padding: "6px 20px 4px"}}>not the RJIL telecom company</div>
      </div>
      <div style={{position: "absolute", left: 1530, top: 540, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * np})`, opacity: np > 0.01 ? clamp01(np * 2) : 0, ...serif(200, {color: C.ink, lineHeight: 1}),
        whiteSpace: "nowrap"}}>₹100</div>
      <div style={{position: "absolute", left: 1530, top: 670, transform: `translate(-50%, -50%) translateY(${(1 - rp) * 14}px)`, opacity: rp, fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.inkSoft,
        letterSpacing: 2, whiteSpace: "nowrap"}}>OF FY26 REVENUE</div>
      <div style={{position: "absolute", left: 800, top: 905, transform: "translate(-50%, -50%)", opacity: ease(f, numAt + 20, numAt + 32), fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.inkSoft, whiteSpace: "nowrap"}}>
        Each unit = ₹1 of revenue</div>
    </>
  );
};

// =====================================================================================================
// accounting bridge: two FULL-SIZE stages on charcoal (local variant of devices.tsx Bridge)
// =====================================================================================================
export type BStep = {lab: string[]; v: number; at: number; total?: boolean; text: string; sub?: string; col?: string};
export type BLayout = {x0: number; x1: number; base: number; top: number; max: number; val: number; lab: number};
export const L1: BLayout = {x0: 150, x1: 1770, base: 810, top: 440, max: 100, val: 80, lab: 34};
export const L2: BLayout = {x0: 130, x1: 1790, base: 810, top: 440, max: 55, val: 68, lab: 30};
const LABEL_COL = "#D8D2C6";
export const StageBridge: React.FC<{f: number; steps: BStep[]; lay: BLayout; emph?: number; emphAt?: number}> = ({f, steps, lay, emph, emphAt = 0}) => {
  const n = steps.length, slot = (lay.x1 - lay.x0) / n, bw = slot * 0.62, k = (lay.base - lay.top) / lay.max;
  let run = 0;
  const bars = steps.map((s) => {
    const from = s.total ? 0 : run, to = s.total ? s.v : run + s.v;
    run = to;
    return {s, lo: Math.min(from, to), hi: Math.max(from, to), level: to};
  });
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <line x1={lay.x0 - 20} x2={lay.x1} y1={lay.base} y2={lay.base} stroke={C.grey} strokeWidth={3}/>
      {bars.map(({s, lo, hi}, i) => {
        const p = ease(f, s.at, s.at + 18, outQuint);
        if (p <= 0) return null;
        const cx = lay.x0 + slot * (i + 0.5), yTop = lay.base - hi * k, yBot = lay.base - lo * k, h = (yBot - yTop) * p;
        const fall = s.v < 0 && !s.total;
        const col = s.col ?? (s.total ? C.white : fall ? C.rust : C.highlightPrint);
        const y = fall ? yTop : yBot - h;
        const ly = i > 0 ? lay.base - bars[i - 1].level * k : 0;
        const op = clamp01((p - 0.5) * 2);
        const em = emph === i ? ease(f, emphAt, emphAt + 10) : 0;
        return (
          <g key={i}>
            {i > 0 ? <line x1={cx - slot + bw / 2} x2={cx - bw / 2} y1={ly} y2={ly} stroke={C.grey} strokeWidth={2} strokeDasharray="6 6" opacity={p}/> : null}
            <rect x={cx - bw / 2} y={y} width={bw} height={Math.max(0, h)} fill={col}/>
            {em > 0 ? <rect x={cx - bw / 2 - 8} y={y - 8} width={bw + 16} height={Math.max(0, h) + 16} fill="none" stroke={C.highlightPrint} strokeWidth={5 * em} opacity={em}/> : null}
            <text x={cx} y={fall || !s.total ? yBot + lay.val * 0.8 : yTop - 20} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={lay.val} fill={C.white} opacity={op}>{s.text}</text>
            {s.sub ? <text x={cx} y={yBot + lay.val * 0.8 + 38} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={26} fill={LABEL_COL} opacity={op}>{s.sub}</text> : null}
            {s.lab.map((l, j) => <text key={j} x={cx} y={lay.base + 52 + j * (lay.lab + 8)} textAnchor="middle" fontFamily={F.sans} fontWeight={s.total ? 800 : 600} fontSize={lay.lab}
              fill={s.total ? C.white : LABEL_COL} opacity={op}>{l}</text>)}
          </g>
        );
      })}
    </svg>
  );
};

/** Stage 1: ₹100 -> ~₹50 (t(i) = start tick of step i). */
export const stage1Steps = (t: (i: number) => number): BStep[] => [
  {lab: ["Revenue"], v: 100, at: t(0), total: true, text: "₹100"},
  {lab: ["Network", "incl. rent"], v: -26.1, at: t(1), text: "−₹26"},
  {lab: ["Licence &", "spectrum"], v: -8.0, at: t(2), text: "−₹8"},
  {lab: ["Staff, selling,", "other"], v: -15.9, at: t(3), text: "−₹16", sub: "4.5 + 3.1 + 1.1 + 7.2"},
  {lab: ["EBITDA excl.", "other income"], v: 50.0, at: t(4), total: true, text: "~₹50"},
];
/** Stage 2: ~₹50 -> ~₹20.5. */
export const stage2Steps = (t: (i: number) => number): BStep[] => [
  {lab: ["EBITDA excl.", "other income"], v: 50.0, at: t(0), total: true, text: "~₹50"},
  {lab: ["Depreciation,", "amortisation"], v: -18.6, at: t(1), text: "−₹18.6"},
  {lab: ["Finance", "costs"], v: -5.9, at: t(2), text: "−₹5.9"},
  {lab: ["Tax"], v: -7.0, at: t(3), text: "−₹7.0"},
  {lab: ["Other", "income"], v: 2.0, at: t(4), text: "+₹2.0"},
  {lab: ["Net profit"], v: 20.5, at: t(5), total: true, text: "~₹20.5", col: C.highlightPrint},
];

/** Heading for a stage: EntityTag, "PER ₹100 OF REVENUE", the big "from -> to" and its caption. `toAt` brings in the second number. */
export const StageHead: React.FC<{f: number; from: string; to: string; cap: string; toAt: number; note?: string}> = ({f, from, to, cap, toAt, note}) => {
  const tp = ease(f, toAt, toAt + 10, outQuint);
  return (
    <>
      <EntityTag f={f} at={-30} text={ENTITY.jioPlat} period="FY26" x={130} y={130} size={26} dark/>
      <div style={{position: "absolute", left: 800, top: 130, transform: "translate(0, -50%)", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: LABEL_COL, letterSpacing: 2}}>PER ₹100 OF REVENUE</div>
      <div style={{position: "absolute", right: 130, top: 130, transform: "translate(0, -50%)", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: LABEL_COL, letterSpacing: 1}}>approximate; our calculation</div>
      <div style={{position: "absolute", left: 130, top: 178, display: "flex", alignItems: "baseline", gap: 26, ...serif(84, {color: C.white, lineHeight: 1}), whiteSpace: "nowrap"}}>
        <span>{from}</span><span style={{color: C.grey}}>→</span><span style={{opacity: tp, color: C.highlightPrint}}>{to}</span>
      </div>
      <div style={{position: "absolute", left: 130, top: 270, fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: LABEL_COL, letterSpacing: 2, whiteSpace: "nowrap"}}>{cap}</div>
      {note ? <div style={{position: "absolute", right: 130, top: 274, fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: LABEL_COL, whiteSpace: "nowrap"}}>{note}</div> : null}
    </>
  );
};

// =====================================================================================================
// combined summary (₹100 -> ~₹50 -> ~₹20.5): full size, then a small legible card
// =====================================================================================================
const SUM: {n: string; cap: string; col: string}[] = [
  {n: "₹100", cap: "REVENUE", col: C.white}, {n: "~₹50", cap: "EBITDA EXCLUDING OTHER INCOME", col: C.white}, {n: "~₹20.5", cap: "NET PROFIT", col: C.highlightPrint},
];
export const SummaryBig: React.FC<{f: number; at: number[]}> = ({f, at}) => (
  <>
    <EntityTag f={f} at={-30} text={ENTITY.jioPlat} period="FY26" x={130} y={130} size={26} dark/>
    <div style={{position: "absolute", right: 130, top: 130, transform: "translate(0, -50%)", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: LABEL_COL, letterSpacing: 1}}>per ₹100 of revenue · approximate; our calculation</div>
    {SUM.map((q, i) => {
      const p = spr(f, at[i], 12, 170), x = [330, 960, 1590][i];
      return (
        <React.Fragment key={q.n}>
          {i > 0 ? <div style={{position: "absolute", left: x - 315, top: 470, transform: "translate(-50%, -50%)", opacity: ease(f, at[i] - 4, at[i] + 6), ...serif(110, {color: C.grey})}}>→</div> : null}
          <div style={{position: "absolute", left: x, top: 470, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: clamp01(p * 2), textAlign: "center", whiteSpace: "nowrap"}}>
            <div style={serif(170, {color: q.col, lineHeight: 1})}>{q.n}</div>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: LABEL_COL, letterSpacing: 2, marginTop: 18}}>{q.cap}</div>
          </div>
        </React.Fragment>
      );
    })}
  </>
);

/** Small legible card version (charcoal), top-left x/y = card corner. */
export const SummaryCard: React.FC<{f: number; at: number; x: number; y: number}> = ({f, at, x, y}) => {
  const e = spr(f, at, 13, 150);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 540, boxSizing: "border-box", padding: "22px 30px 26px", background: C.ink, transform: `translateX(${(1 - e) * -620}px) rotate(-1deg)`, opacity: clamp01(e * 2),
      boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 18px 34px rgba(30,20,10,0.3)"}}>
      <EntityTag f={f} at={at - 30} text={ENTITY.jioPlat} period="FY26" x={30} y={26} size={19} dark/>
      <div style={{marginTop: 34}}>
        {SUM.map((q, i) => (
          <div key={q.n} style={{display: "flex", alignItems: "center", gap: 18, marginTop: i ? 6 : 0}}>
            <span style={serif(64, {color: q.col, minWidth: 190, lineHeight: 1.1})}>{q.n}</span>
            <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, color: LABEL_COL, letterSpacing: 1.5}}>{i === 1 ? "EBITDA EXCL. OTHER INCOME" : q.cap}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {inOut};
