// Shared pieces for scenes 07-09 of "Jio's Size Advantage Has a Catch" (AK brief, 20 Oct 2026). Original artwork in code.
// devices.tsx is untouched: PricePhone wraps the shared RechargePhone and adds a generic price element on top of it.
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {Layer, CamKey, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, V, clamp01, ease, inOut, lin, outCubic, outQuint, spr} from "./kit/tokens";
import {ENTITY, EntityTag, RechargePhone} from "./devices";
import {Img} from "remotion";

/** Standard shot frame without the random intro move: paper, camera layer, chips, finish. */
export const Frame: React.FC<{f: number; d: number; cam?: CamKey[]; chip?: string; chip2?: string; children?: React.ReactNode; over?: React.ReactNode}> =
  ({f, d, cam, chip, chip2, children, over}) => {
    const c = camAt(f, cam ?? [[0, 1.0, 960, 540], [d, 1.02, 960, 540]]);
    return (
      <AbsoluteFill>
        <Layer cam={c} depth={0.85}><Paper drift={f / Math.max(1, d)}/></Layer>
        <Layer cam={c}>{children}</Layer>
        {over}
        {chip ? <SourceTag f={f} at={0} text={chip}/> : null}
        {chip2 ? <SourceTag f={f} at={0} text={chip2} pos="bl"/> : null}
        <Finish f={f}/>
      </AbsoluteFill>
    );
  };

/** Two-line display copy: small caps line over a large line. */
export const Headline: React.FC<{f: number; at: number; a?: string; b: string; x?: number; y?: number; align?: "left" | "center"; size?: number; color?: string}> =
  ({f, at, a, b, x = 960, y = 120, align = "center", size = 56, color = C.ink}) => {
    const p = ease(f, at, at + 10, outCubic);
    if (p <= 0) return null;
    return (
      <div style={{position: "absolute", left: align === "center" ? x - 900 : x, top: y, width: 1800, textAlign: align, opacity: p, transform: `translateY(${(1 - p) * 24}px)`,
        lineHeight: 1.1}}>
        {a ? <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: Math.min(34, size * 0.62), letterSpacing: 3, color: C.grey, marginBottom: 6}}>{a}</div> : null}
        <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: size, letterSpacing: 0.5, color}}>{b}</div>
      </div>
    );
  };

/** Neutral paper card with an optional small caps role line and a sub line. */
export const NodeCard: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; role?: string; name: string; sub?: string; size?: number;
  strong?: boolean; ghost?: boolean; glow?: number; rename?: {at: number; to: string}}> =
  ({f, at, x, y, w, h, role, name, sub, size = 44, strong, ghost, glow = 0, rename}) => {
    const e = spr(f, at, 13, 170);
    if (e <= 0.001) return null;
    const nm = rename && f >= rename.at ? rename.to : name;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: clamp01(e * 2), transform: `scale(${0.85 + 0.15 * e})`,
        background: ghost ? "rgba(251,248,242,0.35)" : C.white, border: `${strong ? 5 : 3}px ${ghost ? "dashed" : "solid"} ${ghost ? C.grey : C.ink}`, borderRadius: 14,
        boxShadow: ghost ? undefined : `0 3px 5px rgba(30,20,10,0.14), 0 14px 26px rgba(30,20,10,0.16), 0 0 0 ${10 * glow}px rgba(47,127,122,${0.35 * glow})`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 14px"}}>
        {role ? <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 22, letterSpacing: 2.5, color: C.teal, marginBottom: 6}}>{role}</div> : null}
        <div style={{fontFamily: size >= 48 ? F.serif : F.sans, fontWeight: size >= 48 ? 400 : 800, fontSize: size, color: ghost ? C.grey : C.ink, lineHeight: 1.05}}>{nm}</div>
        {sub ? <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: C.grey, marginTop: 8, lineHeight: 1.15}}>{sub}</div> : null}
      </div>
    );
  };

/** Straight link between two world points drawn from `at`; solid teal = distribution, dashed ink = infrastructure service. Optional label on the midpoint. */
export const Link: React.FC<{f: number; at: number; from: [number, number]; to: [number, number]; kind: "dist" | "infra"; label?: string; labelAt?: number; dim?: boolean}> =
  ({f, at, from, to, kind, label, labelAt, dim}) => {
    const p = ease(f, at, at + 14, outQuint);
    if (p <= 0) return null;
    const [x0, y0] = from, [x1, y1] = to, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const col = kind === "dist" ? C.teal : C.ink;
    const la = ease(f, labelAt ?? at + 8, (labelAt ?? at + 8) + 8, outCubic);
    return (
      <>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={col} strokeWidth={kind === "dist" ? 9 : 6} strokeLinecap="round"
            strokeDasharray={kind === "dist" ? undefined : "4 14"} opacity={dim ? 0.35 : 0.95}/>
        </svg>
        {label ? <div style={{position: "absolute", left: mx, top: my - 40, transform: "translate(-50%, -50%)", opacity: la, fontFamily: F.sans, fontWeight: 800, fontSize: 22, letterSpacing: 1,
          color: col, background: C.paper, padding: "3px 10px", whiteSpace: "nowrap"}}>{label}</div> : null}
      </>
    );
  };

// =====================================================================================================
// Relationship map (scenes 08 end, 09). World coordinates. Every element appears at its own tick (undefined = not drawn).
// All nodes share ONE neutral style: links show commercial arrangements, not ownership.
// =====================================================================================================
export const MAP = {phone: [150, 560] as [number, number], rrl: [430, 560] as [number, number], rjil: [960, 560] as [number, number],
  sdil: [1500, 400] as [number, number], jdf: [1500, 720] as [number, number]};
export type MapT = {phone?: number; dist?: number; distName?: number; rjil?: number; ghostInfra?: number; sdil?: number; jdf?: number; legend?: number; scope?: number;
  glow?: number; phoneOn?: boolean};
export const RelMap: React.FC<{f: number; t: MapT; hl?: "dist" | "infra" | null; sub?: boolean}> = ({f, t, hl = null, sub = true}) => {
  const g = (k: "dist" | "infra") => (hl === k ? 1 : 0);
  return (
    <>
      {t.rjil != null ? <NodeCard f={f} at={t.rjil} x={MAP.rjil[0]} y={MAP.rjil[1]} w={400} h={170} name="Jio telecom" sub="RJIL · licensed entity" strong size={50}/> : null}
      {t.dist != null ? <>
        <Link f={f} at={t.dist} from={[MAP.phone[0] + 75, MAP.phone[1]]} to={[MAP.rrl[0] - 150, MAP.rrl[1]]} kind="dist"/>
        <Link f={f} at={t.dist + 6} from={[MAP.rrl[0] + 150, MAP.rrl[1]]} to={[MAP.rjil[0] - 200, MAP.rjil[1]]} kind="dist" label="Distribution" labelAt={t.dist + 14}/>
        <NodeCard f={f} at={t.dist + 2} x={MAP.rrl[0]} y={MAP.rrl[1]} w={300} h={150} role={t.distName != null && f >= t.distName ? "DISTRIBUTION" : undefined}
          name="Distribution" size={42}
          rename={t.distName != null ? {at: t.distName, to: "Reliance Retail"} : undefined} glow={g("dist")}/>
      </> : null}
      {t.ghostInfra != null ? <>
        {t.sdil == null || f < t.sdil ? <NodeCard f={f} at={t.ghostInfra} x={MAP.sdil[0]} y={MAP.sdil[1]} w={400} h={130} name="Infrastructure" ghost size={38}/> : null}
        {t.jdf == null || f < t.jdf ? <NodeCard f={f} at={t.ghostInfra + 5} x={MAP.jdf[0]} y={MAP.jdf[1]} w={400} h={130} name="Infrastructure" ghost size={38}/> : null}
        <Link f={f} at={t.ghostInfra + 8} from={[MAP.rjil[0] + 200, MAP.rjil[1] - 20]} to={[MAP.sdil[0] - 200, MAP.sdil[1]]} kind="infra"/>
        <Link f={f} at={t.ghostInfra + 12} from={[MAP.rjil[0] + 200, MAP.rjil[1] + 20]} to={[MAP.jdf[0] - 200, MAP.jdf[1]]} kind="infra"/>
      </> : null}
      {t.sdil != null ? <>
        <Link f={f} at={t.sdil + 4} from={[MAP.rjil[0] + 200, MAP.rjil[1] - 20]} to={[MAP.sdil[0] - 200, MAP.sdil[1]]} kind="infra"/>
        <NodeCard f={f} at={t.sdil} x={MAP.sdil[0]} y={MAP.sdil[1]} w={400} h={170} role="TOWER PARTNER" name="Summit Digitel" size={42}
          sub={sub ? "174,451 of 360,537 towers · 30 Jun 2026" : undefined} glow={g("infra")}/>
      </> : null}
      {t.jdf != null ? <>
        <Link f={f} at={t.jdf + 4} from={[MAP.rjil[0] + 200, MAP.rjil[1] + 20]} to={[MAP.jdf[0] - 200, MAP.jdf[1]]} kind="infra"/>
        <NodeCard f={f} at={t.jdf} x={MAP.jdf[0]} y={MAP.jdf[1]} w={400} h={170} role="FIBRE PARTNER" name="Jio Digital Fibre" size={42}
          sub={sub ? "~98% of optic fibre need · excl. last mile" : undefined} glow={g("infra")}/>
      </> : null}
      {t.phone != null ? <PricePhone f={f} x={MAP.phone[0]} y={MAP.phone[1]} s={0.26} enterAt={t.phone} changeAt={-100} showAt={-100}/> : null}
      {t.scope != null ? <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <rect x={MAP.rjil[0] - 250} y={MAP.rjil[1] - 130} width={500} height={260} rx={22} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="18 12"
          opacity={ease(f, t.scope, t.scope + 12)} />
      </svg> : null}
      {t.scope != null ? <div style={{position: "absolute", left: MAP.rjil[0], top: MAP.rjil[1] - 168, transform: "translate(-50%, -50%)", opacity: ease(f, t.scope + 6, t.scope + 16),
        fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: C.ink, background: C.paper, padding: "2px 12px", whiteSpace: "nowrap"}}>ASSETS INSIDE ONE COMPANY</div> : null}
      {t.legend != null ? <Legend f={f} at={t.legend}/> : null}
    </>
  );
};

export const Legend: React.FC<{f: number; at: number; x?: number; y?: number}> = ({f, at, x = 130, y = 900}) => {
  const p = ease(f, at, at + 12, outCubic);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, opacity: p, display: "flex", alignItems: "center", gap: 44, fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.ink}}>
      <span style={{display: "flex", alignItems: "center", gap: 14}}><svg width={90} height={14}><line x1={4} y1={7} x2={86} y2={7} stroke={C.teal} strokeWidth={9} strokeLinecap="round"/></svg>Distribution link</span>
      <span style={{display: "flex", alignItems: "center", gap: 14}}><svg width={90} height={14}><line x1={4} y1={7} x2={86} y2={7} stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 14"/></svg>Infrastructure service link</span>
      <span style={{color: C.grey, fontWeight: 600}}>Links show agreements, not ownership</span>
    </div>
  );
};

// =====================================================================================================
// Generic price on the shared recharge phone (scene 07 end, 08 end). Not an actual plan: "₹ X" becomes "₹ X ▲".
// The phone is drawn upright (rot 0) so the overlay lines up with the phone's own layout (520 x 1040 local px).
// =====================================================================================================
export const PricePhone: React.FC<{f: number; x: number; y: number; s: number; enterAt?: number; changeAt: number; showAt?: number; label?: string}> =
  ({f, x, y, s, enterAt = -30, changeAt, showAt = enterAt, label = "Mobile data pack"}) => {
    const a = ease(f, showAt, showAt + 10, outCubic);
    const k = ease(f, changeAt, changeAt + 8, outCubic), n = spr(f, changeAt + 4, 9, 220);
    const L = (lx: number, ly: number) => ({left: x + (lx - 260) * s, top: y + (ly - 520) * s});
    return (
      <>
        <RechargePhone f={f} x={x} y={y} s={s} enterAt={enterAt} rot={0} label={label}/>
        <div style={{position: "absolute", ...L(260, 610), transform: "translate(-50%, -50%)", opacity: a, whiteSpace: "nowrap", textAlign: "center"}}>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 28 * s, letterSpacing: 3, color: C.grey}}>PRICE</div>
          <div style={{position: "relative", display: "inline-block", fontFamily: F.serif, fontWeight: 400, fontSize: 110 * s, color: k > 0.5 ? C.grey : C.ink, lineHeight: 1.1,
            opacity: k > 0.5 ? 0.55 : 1}}>
            ₹ X
            {k > 0 ? <span style={{position: "absolute", left: -10 * s, right: -10 * s, top: "54%", height: 10 * s, background: C.rust, transformOrigin: "0 50%", transform: `scaleX(${k})`}}/> : null}
          </div>
          {n > 0.01 ? <div style={{marginTop: 4 * s, fontFamily: F.serif, fontWeight: 400, fontSize: 120 * s, color: C.ink, lineHeight: 1.1, transform: `scale(${0.6 + 0.4 * n})`, opacity: clamp01(n * 2)}}>
            ₹ X <span style={{color: C.teal}}>▲</span></div> : null}
        </div>
      </>
    );
  };

// =====================================================================================================
// Scene 08: shared time axis (FY24 | FY25 | FY26 with quarter ticks) and three aligned panels. Values are exactly those printed
// in the RHP KPI table (p.131 / p.136): ARPU and churn are exit-quarter figures (drawn at the Q4 end of each year),
// net customer additions are full-year bars. No line is drawn between years (no interpolation).
// =====================================================================================================
export const TX0 = 520, TW = 413.3;
export const colX = (i: number, frac: number) => TX0 + TW * (i + frac);
export const Q2FY25 = colX(1, 0.375);
export const ARPU = [181.7, 206.2, 214.0], CHURN = [1.52, 1.81, 1.67], NET = [{v: 4.25, t: "4.25 crore"}, {v: 0.64, t: "64 lakh"}, {v: 3.62, t: "3.62 crore"}];
export const FY = ["FY24", "FY25", "FY26"];

export const TimeAxis: React.FC<{f: number; at: number; y: number; markAt?: number; markLabel?: boolean; lineTo?: number}> = ({f, at, y, markAt, markLabel = true, lineTo}) => {
  const p = ease(f, at, at + 14, outQuint), m = markAt != null ? spr(f, markAt, 12, 170) : 0;
  if (p <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <g opacity={p}>
        {FY.map((l, i) => (
          <g key={l}>
            <rect x={colX(i, 0)} y={y - 46} width={TW - 4} height={40} fill={i === 1 ? "rgba(169,216,207,0.55)" : "rgba(36,34,31,0.07)"}/>
            <text x={colX(i, 0.5)} y={y - 16} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={30} fill={C.ink}>{l}</text>
            {[0, 1, 2, 3].map((q) => <g key={q}>
              <line x1={colX(i, q / 4)} x2={colX(i, q / 4)} y1={y} y2={y + 14} stroke={C.grey} strokeWidth={2}/>
              <text x={colX(i, (q + 0.5) / 4)} y={y + 30} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={20} fill={C.grey}>Q{q + 1}</text></g>)}
          </g>
        ))}
        <line x1={TX0} x2={TX0 + TW * 3 - 4} y1={y} y2={y} stroke={C.grey} strokeWidth={3}/>
      </g>
      {m > 0 ? <g opacity={clamp01(m * 2)}>
        <line x1={Q2FY25} x2={Q2FY25} y1={y - 8} y2={lineTo ?? y + 40} stroke={C.rust} strokeWidth={6} strokeDasharray="14 9"/>
        <circle cx={Q2FY25} cy={y} r={14 * m} fill={C.rust}/>
        {markLabel ? <g transform={`translate(${Q2FY25} ${y - 62})`}>
          <rect x={-190} y={-34} width={380} height={52} fill={C.rust}/>
          <text x={0} y={4} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={30} letterSpacing={1} fill={C.white}>Q2 FY25 · TARIFF INCREASE</text>
        </g> : null}
      </g> : null}
    </svg>
  );
};

type PK = "a" | "b" | "c";
const META: Record<PK, {title: string; unit: string; period: string; color: string; max: number; vals: number[]; text: string[]; exitQ: boolean}> = {
  a: {title: "REVENUE PER USER", unit: "ARPU · ₹ per month", period: "EXIT QUARTER", color: C.teal, max: 250, vals: ARPU, text: ARPU.map((v) => "₹" + v.toFixed(1)), exitQ: true},
  b: {title: "CUSTOMER RESPONSE", unit: "Monthly churn · %", period: "EXIT QUARTER", color: C.ink, max: 2.5, vals: CHURN, text: CHURN.map((v) => v.toFixed(2) + "%"), exitQ: true},
  c: {title: "CUSTOMER RESPONSE", unit: "Net customer additions", period: "FULL YEAR", color: C.ink, max: 5, vals: NET.map((n) => n.v), text: NET.map((n) => n.t), exitQ: false},
};
export const PANEL_TOP = {a: 345, b: 533, c: 721};
/** One aligned panel. mode "full": big, alone (title, entity + EXIT QUARTER / FULL YEAR tag, large bars). mode "mini": one of three stacked panels.
 *  `at` = tick when it starts drawing (use a large negative number for "already complete"). `out` = tick when it fades (full mode sequence). */
export const ResponsePanel: React.FC<{f: number; k: PK; at: number; mode?: "full" | "mini"; ring?: number; out?: number}> = ({f, k, at, mode = "mini", ring = 0, out}) => {
  const M = META[k], full = mode === "full";
  const fade = out != null ? 1 - ease(f, out, out + 8) : 1;
  const e0 = ease(f, at, at + 8, outCubic) * fade;
  if (e0 <= 0.01) return null;
  const top = PANEL_TOP[k];
  const base = full ? 850 : top + 176, maxH = full ? 380 : 96;
  const bw = M.exitQ ? (full ? 150 : 64) : (full ? 300 : 240);
  const vf = full ? 62 : 30;
  return (
    <>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible", opacity: e0}}>
        {!full ? <rect x={TX0 - 12} y={top - 4} width={TW * 3 + 20} height={184} fill="none" stroke={C.teal} strokeWidth={6 * ring} rx={8}/> : null}
        <line x1={TX0} x2={TX0 + TW * 3 - 4} y1={base} y2={base} stroke={C.grey} strokeWidth={3}/>
        {M.vals.map((v, i) => {
          const p = ease(f, at + 4 + i * 8, at + 22 + i * 8, outQuint), h = (v / M.max) * maxH * p, cx = colX(i, M.exitQ ? 0.875 : 0.5);
          return (
            <g key={i}>
              <rect x={cx - bw / 2} y={base - h} width={bw} height={h} fill={M.color}/>
              <text x={cx} y={base - h - 14} textAnchor="middle" fontFamily={full ? F.serif : F.sans} fontWeight={full ? 400 : 800} fontSize={vf} fill={C.ink} stroke={C.paper} strokeWidth={9}
                paintOrder="stroke" opacity={clamp01((p - 0.5) * 2)}>{M.text[i]}</text>
            </g>
          );
        })}
      </svg>
      <div style={{opacity: e0}}>
        <div style={{position: "absolute", left: 60, top: full ? 290 : top - 4, fontFamily: F.serif, fontWeight: 400, fontSize: full ? 46 : 34, color: C.ink, whiteSpace: "nowrap"}}>{M.title}</div>
        <div style={{position: "absolute", left: 60, top: full ? 346 : top + 44, fontFamily: F.sans, fontWeight: 600, fontSize: full ? 28 : 22, color: C.grey, whiteSpace: "nowrap"}}>{M.unit}</div>
        <EntityTag f={f} at={at} text={ENTITY.rjil} period={M.period} x={full ? 60 : 440} y={full ? 410 : top + 14} size={full ? 26 : 20}/>
      </div>
    </>
  );
};
export const TariffTag: React.FC<{f: number; at: number; y?: number}> = ({f, at, y = 200}) => {
  const p = spr(f, at, 12, 170);
  if (p <= 0.01) return null;
  return <div style={{position: "absolute", left: Q2FY25 - 250, top: y, width: 500, height: 46, background: C.rust, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 1,
    whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01(p * 2), transform: `scale(${0.8 + 0.2 * p})`}}>Q2 FY25 · TARIFF INCREASE</div>;
};

// =====================================================================================================
// Scene 09 end: the frame of the next chart (scene 10): axis, units and the two year slots only. No bars, no figures here.
// =====================================================================================================
export const CapexFrame: React.FC<{f: number; at: number; x?: number; y?: number}> = ({f, at, x = 960, y = 560}) => {
  const p = ease(f, at, at + 22, outQuint);
  if (p <= 0) return null;
  const W0 = 1100, H0 = 560, base = 470;
  return (
    <div style={{position: "absolute", left: x - W0 / 2, top: y - H0 / 2 + (1 - p) * 700, width: W0, height: H0, opacity: clamp01(p * 2)}}>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 52, color: C.ink, letterSpacing: 1}}>CASH CAPEX / REVENUE</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey, marginTop: 4}}>Share of revenue, %</div>
      <svg width={W0} height={H0} style={{position: "absolute", left: 0, top: 0}}>
        {[0, 20, 40, 60].map((v) => <g key={v}>
          <line x1={110} x2={W0 - 20} y1={base - v * 5.4} y2={base - v * 5.4} stroke={v === 0 ? C.ink : "rgba(36,34,31,0.2)"} strokeWidth={v === 0 ? 4 : 2}/>
          <text x={90} y={base - v * 5.4 + 8} textAnchor="end" fontFamily={F.sans} fontWeight={600} fontSize={26} fill={C.grey}>{v}%</text></g>)}
        {["FY24", "FY26"].map((l, i) => <text key={l} x={330 + i * 440} y={base + 50} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={36} fill={C.ink}>{l}</text>)}
      </svg>
    </div>
  );
};

/**
 * Magnified inset (scene 07): the departing dots of one grid fly into a zoom box where they are drawn large, with "about N" big beneath.
 * Dot positions replicate DotGrid's seeded choice (same seed, same prefix), so each dot leaves from where it lit up.
 */
export const Departures: React.FC<{f: number; gx: number; gy: number; cell: number; hi: number; boxX: number; boxY: number; at: number; flyAt: number; seed?: string; word: string; cols?: number}> =
  ({f, gx, gy, cell, hi, boxX, boxY, at, flyAt, seed = "dots", word, cols = 40}) => {
    const rows = 1000 / cols;
    const order = React.useMemo(() => Array.from({length: 1000}, (_, i) => i).sort((a, b) => random(seed + a) - random(seed + b)).slice(0, hi), [seed, hi]);
    const bw = 270, bh = 400, e = spr(f, at, 13, 170);
    if (e <= 0.001) return null;
    const R = 20, pitch = 50, cnt = ease(f, flyAt + 12, flyAt + 22, outCubic);
    const slot = (k: number): [number, number] => [boxX + 10 + R + (k % 5) * pitch + 15, boxY + 70 + R + Math.floor(k / 5) * pitch];
    return (
      <>
        <div style={{position: "absolute", left: boxX, top: boxY, width: bw, height: bh, background: C.white, border: `4px solid ${C.ink}`, borderRadius: 14, opacity: clamp01(e * 2),
          transform: `scale(${0.9 + 0.1 * e})`, boxShadow: "0 3px 5px rgba(30,20,10,0.16), 0 16px 30px rgba(30,20,10,0.2)"}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 16, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.grey}}>LEFT IN A MONTH</div>
          <div style={{position: "absolute", left: 0, right: 0, top: 292, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 62, color: C.ink, lineHeight: 1, opacity: cnt,
            transform: `scale(${0.8 + 0.2 * cnt})`}}>{word}</div>
          <div style={{position: "absolute", left: 0, right: 0, top: 362, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 21, letterSpacing: 1.5, color: C.ink, opacity: cnt}}>PER 1,000</div>
        </div>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {order.map((idx, k) => {
            const [sx, sy] = slot(k);
            const x0 = gx - (cols * cell) / 2 + (idx % cols) * cell + cell / 2, y0 = gy - (rows * cell) / 2 + Math.floor(idx / cols) * cell + cell / 2;
            const t = ease(f, flyAt + k * 1.2, flyAt + k * 1.2 + 22, inOut);
            const x = x0 + (sx - x0) * t, y = y0 + (sy - y0) * t - Math.sin(Math.PI * t) * 40;
            return <g key={k}>
              <circle cx={sx} cy={sy} r={R} fill="none" stroke={C.grey} strokeWidth={2} strokeDasharray="4 5" opacity={clamp01(e) * (1 - t)}/>
              {f >= flyAt + k * 1.2 - 1 ? <circle cx={x} cy={y} r={cell * 0.32 + (R - cell * 0.32) * t} fill={C.rust}/> : null}
            </g>;
          })}
        </svg>
      </>
    );
  };

/** Full-screen photo with a slow push and an optional big label (serif, on a dark gradient). Photo credit goes in the shot's chip. */
export const PhotoFull: React.FC<{f: number; d: number; src: string; label?: string; labelAt?: number; fx?: number; fy?: number; s0?: number; s1?: number}> =
  ({f, d, src, label, labelAt = 6, fx = 50, fy = 50, s0 = 1.02, s1 = 1.12}) => {
    const s = s0 + (s1 - s0) * clamp01(f / Math.max(1, d));
    const p = ease(f, labelAt, labelAt + 12, outCubic);
    return (
      <AbsoluteFill style={{background: C.ink}}>
        <Img src={V(src)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx}% ${fy}%`, transform: `scale(${s})`, transformOrigin: `${fx}% ${Math.min(fy, 88)}%`}}/>
        <AbsoluteFill style={{background: "linear-gradient(to top, rgba(14,14,14,0.55) 0%, rgba(14,14,14,0) 38%)"}}/>
        {label ? <div style={{position: "absolute", left: 90, top: 740, fontFamily: F.serif, fontWeight: 400, fontSize: 132, color: C.white, opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
          textShadow: "0 4px 24px rgba(0,0,0,0.5)", letterSpacing: 1}}>{label}</div> : null}
      </AbsoluteFill>
    );
  };

export {lin, inOut};
