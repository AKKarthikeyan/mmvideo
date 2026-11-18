// Jio film chapter 8 (The verdict): helpers of my own: flying sticky note, MoatOS verdict sheet, score ruler, two-line margin chart,
// bars across zero, typed index card, yellow sticky notes, watch-list card, sources page, end card.
// All times are ticks (1/30 s) local to the shot, like the rest of the kit.
import React from "react";
import {AbsoluteFill} from "remotion";
import {MarkerCircle} from "../Marker";
import {Stamp} from "../A01V4Parts";
import {C, F, V, clamp01, ease, inCubic, inOut, outCubic, outQuint, shake, spr, W, H} from "../tokens";

/** the rupee sign set in Inter (DM Serif Display has no U+20B9) */
export const Rs: React.FC<{size: number; color?: string; weight?: number}> = ({size, color, weight = 600}) =>
  <span style={{fontFamily: F.sans, fontWeight: weight, fontSize: size * 0.8, color, marginRight: size * 0.02}}>₹</span>;

const typed = (s: string, f: number, at: number, cps = 1.3) => s.slice(0, Math.max(0, Math.floor((f - at) / cps)));
const PAPER_BG = `url(${V("tex/paper.jpg")}) #FBF8F1`;

// ---------------------------------------------------------------------------------------------------------------
// sticky note that flies in from the top-right corner (where chapter 1 pinned it) to the middle of the desk
// ---------------------------------------------------------------------------------------------------------------
export const FlyNote: React.FC<{f: number; at: number; text: string; from?: [number, number]; to?: [number, number]; size?: number; away?: number}> =
  ({f, at, text, from = [1690, 170], to = [960, 600], size = 150, away}) => {
    if (f < at) return null;
    const p = ease(f, at, at + 26, outQuint);
    const x = from[0] + (to[0] - from[0]) * p;
    let y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 140;
    let o = clamp01((f - at) / 4);
    if (away != null && f >= away) {
      const u = ease(f, away, away + 16, inCubic);
      y -= 700 * u; o *= 1 - ease(f, away + 8, away + 16);
    }
    const sc = 0.5 + 0.5 * p + (f > at + 26 ? 0.06 * Math.exp(-(f - at - 26) / 8) * Math.sin((f - at) * 0.5) : 0);
    const rot = 5 - 8 * p;
    if (o <= 0.01) return null;
    return (
      <div style={{position: "absolute", left: x, top: y, width: size * 2.5, padding: `${size * 0.3}px ${size * 0.1}px ${size * 0.28}px`, textAlign: "center",
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`, opacity: o, background: "linear-gradient(170deg, #FFF36B, #FBE54A)",
        boxShadow: "0 4px 4px rgba(0,0,0,0.18), 0 26px 40px rgba(0,0,0,0.28)", fontFamily: F.marker, fontSize: size, color: C.ink, lineHeight: 1, whiteSpace: "nowrap"}}>
        <div style={{position: "absolute", left: "50%", top: -size * 0.13, width: size * 0.5, height: size * 0.24, background: "rgba(230,220,190,0.85)", transform: "translateX(-50%) rotate(-4deg)"}}/>
        {text}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------------------
// MoatOS verdict sheet (real-paper card): header, score, NARROW stamp, WALLS and LIMITS columns ticked in as said
// ---------------------------------------------------------------------------------------------------------------
export const SHEET = {x: 960, y: 520, w: 1740, h: 860};
const SL = SHEET.x - SHEET.w / 2, ST = SHEET.y - SHEET.h / 2;     // world position of the sheet's top-left corner
export const COL_X = [SL + 90, SL + 960];                           // left edge of the WALLS and LIMITS columns (world)
export const ROW_Y = (i: number) => ST + 548 + i * 92;               // world y of item i
export const WALLS: [string, string][] = [["Scale", ""], ["Lowest cost per GB", ""], ["Lowest churn", ""], ["Exclusive 700 MHz", ""]];
export const LIMITS: [string, string][] = [["Similar spectrum", "outside 26 GHz"], ["Less EBITDA per customer", ""], ["Lower returns", ""], ["One related distributor", ""]];
const NEVER = 1e9;

const Tick: React.FC<{f: number; at: number; x: number; y: number; kind: "tick" | "cross"; size?: number}> = ({f, at, x, y, kind, size = 62}) => {
  const p = ease(f, at, at + 9, outCubic);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible"}}>
      <rect x={4} y={10} width={48} height={48} rx={5} fill="none" stroke={C.inkSoft} strokeWidth={4} opacity={0.5}/>
      {kind === "tick"
        ? <path d="M 12 36 L 28 52 L 62 6" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>
        : <path d="M 14 20 L 46 52 M 46 20 L 14 52" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>}
    </svg>
  );
};

export const VerdictSheet: React.FC<{f: number; stampAt?: number; scoreAt?: number; hlAt?: number; walls?: number[]; limits?: number[]; enterAt?: number; scoreOn?: boolean}> =
  ({f, stampAt = NEVER, scoreAt = NEVER, hlAt = NEVER, walls = [], limits = [], enterAt = 0, scoreOn = true}) => {
    const k = spr(f, enterAt, 13, 150);
    if (f < enterAt) return null;
    const hl = ease(f, hlAt, hlAt + 14, inOut);
    const scoreP = ease(f, scoreAt, scoreAt + 34, (t) => 1 - Math.pow(1 - t, 4));
    const sc = 4.87 * scoreP;
    const col = (x: number, title: string, items: [string, string][], times: number[], kind: "tick" | "cross") => (
      <>
        <div style={{position: "absolute", left: x - SL, top: 380, fontFamily: F.serif, fontSize: 74, color: C.ink, letterSpacing: 4}}>{title}</div>
        <div style={{position: "absolute", left: x - SL, top: 468, width: 740, height: 5, background: C.ink, opacity: 0.8}}/>
        {items.map(([t, sub], i) => {
          const at = times[i] ?? NEVER, p = ease(f, at, at + 14, outCubic), y = ROW_Y(i) - ST;
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: x - SL, top: y + 38, width: 740, height: 2, background: "rgba(14,14,14,0.18)"}}/>
              {f >= at ? <Tick f={f} at={at + 2} x={x - SL + 31} y={y} kind={kind}/> : <div style={{position: "absolute", left: x - SL, top: y - 31, width: 62, height: 62}}>
                <svg width={62} height={62} viewBox="0 0 64 64"><rect x={4} y={10} width={48} height={48} rx={5} fill="none" stroke={C.inkSoft} strokeWidth={4} opacity={0.3}/></svg></div>}
              <div style={{position: "absolute", left: x - SL + 92, top: y - 34, opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 14}px)`, whiteSpace: "nowrap"}}>
                <span style={{fontFamily: F.serif, fontSize: 50, lineHeight: 1.1, color: C.ink, backgroundImage: kind === "tick" ? `linear-gradient(90deg, ${C.highlight}, ${C.highlight})` : undefined,
                  backgroundRepeat: "no-repeat", backgroundSize: `${(ease(f, at + 2, at + 16, inOut) * 100).toFixed(1)}% 58%`, backgroundPosition: "0 82%",
                  textDecoration: kind === "cross" && p > 0.9 ? "underline" : undefined, textDecorationColor: C.markerRed, textDecorationThickness: 4, textUnderlineOffset: 8}}>{t}</span>
                {sub ? <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: C.grey, marginLeft: 16, letterSpacing: 0.5}}>{sub}</span> : null}
              </div>
            </React.Fragment>
          );
        })}
      </>
    );
    return (
      <div style={{position: "absolute", left: SL, top: ST, width: SHEET.w, height: SHEET.h, transform: `translateY(${(1 - k) * -90}px) rotate(${-0.6 * k}deg) scale(${1.05 - 0.05 * k})`,
        opacity: clamp01(k * 3), transformOrigin: "50% 50%"}}>
        {/* second sheet behind */}
        <div style={{position: "absolute", inset: 0, transform: "translate(14px, 12px) rotate(1.3deg)", background: C.paperDeep, filter: "brightness(0.93)", boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}/>
        <div style={{position: "absolute", inset: 0, background: PAPER_BG, backgroundSize: "1024px", boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)"}}>
          <div style={{position: "absolute", inset: 0, background: "#FFFCF5", opacity: 0.5}}/>
          {/* header strip */}
          <div style={{position: "absolute", left: 90, top: 56, fontFamily: F.mono, fontSize: 28, letterSpacing: 3, color: C.inkSoft, textTransform: "uppercase"}}>
            <span style={{backgroundImage: `linear-gradient(90deg, ${C.highlight}, ${C.highlight})`, backgroundRepeat: "no-repeat", backgroundSize: `${(hl * 100).toFixed(1)}% 78%`,
              backgroundPosition: "0 85%", padding: "0 4px"}}>Moat &amp; Margin · MoatOS 6.0</span> · 19 Oct 2026
          </div>
          <div style={{position: "absolute", left: 90, top: 104, fontFamily: F.serif, fontSize: 76, color: C.ink, lineHeight: 1}}>Jio Platforms · moat verdict</div>
          <div style={{position: "absolute", left: 90, right: 90, top: 200, height: 3, background: C.ink, opacity: 0.7}}/>
          {/* score */}
          <div style={{position: "absolute", left: 90, top: 218, fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.grey}}>MOAT SCORE</div>
          {scoreOn ? <div style={{position: "absolute", left: 86, top: 232, fontFamily: F.serif, fontSize: 150, lineHeight: 1.05, color: C.ink, fontVariantNumeric: "tabular-nums",
            opacity: scoreP > 0 ? 1 : 0}}>
            {sc.toFixed(2)}<span style={{fontSize: 70, color: C.grey}}>/10</span></div> : null}
          {col(COL_X[0], "WALLS", WALLS, walls, "tick")}
          {col(COL_X[1], "LIMITS", LIMITS, limits, "cross")}
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10), rgba(0,0,0,0) 40%, rgba(60,40,20,0.08))", pointerEvents: "none"}}/>
        </div>
        <Stamp f={f} at={stampAt} text="NARROW" x={1330} y={290} size={150} rot={-7}/>
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------------------
// ruler 4.5 to 5.5 with the three scoring passes
// ---------------------------------------------------------------------------------------------------------------
const RX0 = 260, RX1 = 1660, RY = 560;
const rx = (v: number) => RX0 + ((v - 4.5) / 1.0) * (RX1 - RX0);
export const PassRuler: React.FC<{f: number; at: number; pins: {v: number; at: number; labelAt: number; key?: boolean}[]; bandAt: number; bandDur?: number; ink?: string}> = ({f, at, pins, bandAt, bandDur = 26, ink = C.ink}) => {
  const ap = ease(f, at, at + 22, outCubic), bp = ease(f, bandAt, bandAt + bandDur, inOut);
  const lo = Math.min(...pins.map((p) => p.v)), hi = Math.max(...pins.map((p) => p.v));
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {/* band between the lowest and the highest pass */}
        <g style={{mixBlendMode: "multiply"}}>
          <rect x={rx(lo)} y={RY - 70} width={(rx(hi) - rx(lo)) * bp} height={140} fill={C.highlight} opacity={0.95}/>
        </g>
        <line x1={RX0} x2={RX0 + (RX1 - RX0) * ap} y1={RY} y2={RY} stroke={ink} strokeWidth={6} strokeLinecap="round"/>
        {Array.from({length: 11}).map((_, i) => {
          const x = RX0 + (i * (RX1 - RX0)) / 10;
          if ((x - RX0) > (RX1 - RX0) * ap) return null;
          return <g key={i}><line x1={x} x2={x} y1={RY - (i % 5 === 0 ? 30 : 18)} y2={RY + (i % 5 === 0 ? 30 : 18)} stroke={ink} strokeWidth={i % 5 === 0 ? 5 : 3}/>
            <text x={x} y={RY + 92} textAnchor="middle" fontFamily={F.mono} fontSize={30} fill={C.inkSoft}>{(4.5 + i / 10).toFixed(1)}</text></g>;
        })}
      </svg>
      {pins.map((p, i) => {
        const s = spr(f, p.at, 10, 220);
        if (s <= 0) return null;
        const x = rx(p.v);
        const lp = ease(f, p.labelAt, p.labelAt + 10, outQuint);
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: x - 26, top: RY - 26 - (1 - s) * 220, width: 52, height: 52, borderRadius: "50%", background: p.key ? C.markerRed : C.ink,
              boxShadow: "0 6px 12px rgba(0,0,0,0.3)", opacity: clamp01(s * 3), border: `6px solid ${C.paper}`}}/>
            {lp > 0 ? <div style={{position: "absolute", left: x, top: RY - 150 - (p.key ? 20 : 0), transform: `translate(-50%, -50%) translateY(${(1 - lp) * 20}px)`, opacity: lp,
              fontFamily: F.serif, fontSize: p.key ? 120 : 98, color: p.key ? C.markerRed : C.ink, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>{p.v.toFixed(2)}</div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// two-line margin chart on black (FY24 -> FY26), 0..35 % scale
// ---------------------------------------------------------------------------------------------------------------
export type Line2 = {name: string; v0: number; v1: number; at: number; dur?: number; l0: number; l1: number; color: string; above?: boolean};
const CB = {x: 430, y: 300, w: 1040, h: 520}, CMAX = 35;
const cy = (v: number) => CB.y + CB.h - (v / CMAX) * CB.h;
export const TwoLines: React.FC<{f: number; at: number; title: string; sub: string; lines: Line2[]; nameAt?: Record<string, number>}> = ({f, at, title, sub, lines, nameAt = {}}) => {
  const tp = ease(f, at, at + 12, outQuint), ap = ease(f, at + 4, at + 24, outCubic);
  return (
    <>
      <div style={{position: "absolute", left: CB.x - 30, top: 96, opacity: tp, transform: `translateY(${(1 - tp) * 26}px)`, fontFamily: F.serif, fontSize: 88, color: C.white, lineHeight: 1}}>{title}</div>
      <div style={{position: "absolute", left: CB.x - 26, top: 200, opacity: tp, fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: "#9C968C", textTransform: "uppercase"}}>{sub}</div>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {[0, 10, 20, 30].map((g) => (
          <g key={g}>
            <line x1={CB.x - 40} x2={CB.x - 40 + (CB.w + 80) * ap} y1={cy(g)} y2={cy(g)} stroke={g === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.16)"} strokeWidth={g === 0 ? 3 : 2} strokeDasharray={g === 0 ? undefined : "6 10"}/>
            <text x={CB.x - 62} y={cy(g) + 9} textAnchor="end" fontFamily={F.sans} fontWeight={600} fontSize={26} fill="#9C968C" opacity={ap}>{g}%</text>
          </g>
        ))}
        <text x={CB.x} y={cy(0) + 56} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={34} fill="#CFC9BE" opacity={ap}>FY24</text>
        <text x={CB.x + CB.w} y={cy(0) + 56} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={34} fill="#CFC9BE" opacity={ap}>FY26</text>
        {lines.map((l, i) => {
          const p = ease(f, l.at, l.at + (l.dur ?? 60), (t) => t);
          if (p <= 0) return null;
          const x0 = CB.x, x1 = CB.x + CB.w, y0 = cy(l.v0), y1 = cy(l.v1);
          const ex = x0 + (x1 - x0) * p, ey = y0 + (y1 - y0) * p;
          return (
            <g key={i}>
              <line x1={x0} y1={y0} x2={ex} y2={ey} stroke={l.color} strokeWidth={11} strokeLinecap="round"/>
              <circle cx={x0} cy={y0} r={15} fill={l.color}/>
              {p > 0.97 ? <circle cx={x1} cy={y1} r={15 + 6 * Math.max(0, 1 - (f - l.at - (l.dur ?? 60)) / 8)} fill={l.color}/> : <circle cx={ex} cy={ey} r={9} fill={l.color}/>}
            </g>
          );
        })}
      </svg>
      {lines.map((l, i) => {
        const o0 = ease(f, l.l0, l.l0 + 10, outQuint), o1 = ease(f, l.l1, l.l1 + 10, outQuint);
        const dy = l.above ? -62 : 64;
        const lab = (v: number, x: number, y: number, o: number, big: boolean) => o > 0 ? (
          <div key={x} style={{position: "absolute", left: x, top: y + dy + (1 - o) * 14, transform: "translate(-50%, -50%)", opacity: o, fontFamily: F.serif, fontSize: big ? 78 : 68,
            color: l.color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>{v.toFixed(1)}%</div>) : null;
        const nm = nameAt[l.name] ?? l.at;
        const np = ease(f, nm, nm + 10, outQuint);
        return (
          <React.Fragment key={i}>
            {lab(l.v0, CB.x, cy(l.v0), o0, false)}
            {lab(l.v1, CB.x + CB.w, cy(l.v1), o1, true)}
            {np > 0 ? <div style={{position: "absolute", left: CB.x + CB.w + 56, top: cy(l.v1) + (l.above ? -34 : 34), transform: "translateY(-50%)", opacity: np, fontFamily: F.sans, fontWeight: 800,
              fontSize: 34, letterSpacing: 2, color: l.color, textTransform: "uppercase", whiteSpace: "nowrap"}}>{l.name}</div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// bars across zero (FY24 below the line, FY26 above)
// ---------------------------------------------------------------------------------------------------------------
const ZB = {x: 380, w: 1160, y0: 585, per: 0.0102};   // zero line y, px per crore
export type ZBar = {label: string; value: number; at: number; dur?: number; labelAt: number; key?: boolean; x: number};
export const ZeroBars: React.FC<{f: number; at: number; title: string; source: string; bars: ZBar[]; circleAt?: number}> = ({f, at, title, source, bars, circleAt}) => {
  const tp = ease(f, at, at + 12, outQuint), ap = ease(f, at + 4, at + 24, outCubic);
  const bw = 270;
  return (
    <>
      <div style={{position: "absolute", left: ZB.x - 20, top: 92, opacity: tp, transform: `translateY(${(1 - tp) * 26}px)`, fontFamily: F.serif, fontSize: 84, color: C.white, lineHeight: 1}}>{title}</div>
      <div style={{position: "absolute", left: ZB.x - 16, top: 196, opacity: tp, fontFamily: F.mono, fontSize: 23, letterSpacing: 3, color: "#9C968C", textTransform: "uppercase"}}>{source}</div>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={ZB.x - 30} x2={ZB.x - 30 + (ZB.w + 60) * ap} y1={ZB.y0} y2={ZB.y0} stroke="rgba(255,255,255,0.85)" strokeWidth={4}/>
        <text x={ZB.x - 44} y={ZB.y0 + 10} textAnchor="end" fontFamily={F.sans} fontWeight={600} fontSize={28} fill="#9C968C" opacity={ap}>0</text>
        {bars.map((b, i) => {
          const g = ease(f, b.at, b.at + (b.dur ?? 34), (t) => 1 - Math.pow(1 - t, 4));
          if (g <= 0) return null;
          const hgt = Math.abs(b.value) * ZB.per * g;
          const y = b.value >= 0 ? ZB.y0 - hgt : ZB.y0;
          return <rect key={i} x={b.x - bw / 2} y={y} width={bw} height={Math.max(3, hgt)} fill={b.key ? C.highlightPrint : C.markerRed}/>;
        })}
        {circleAt != null ? (() => {
          const b = bars.find((q) => q.key)!;
          const top = ZB.y0 - b.value * ZB.per;
          return <MarkerCircle f={f} at={circleAt} rect={[b.x - bw / 2 - 40, top - 168, bw + 80, 206]} dur={16} color={C.markerRed} width={8} padX={0.1} padY={0.2}/>;
        })() : null}
      </svg>
      {bars.map((b, i) => {
        const g = ease(f, b.at, b.at + (b.dur ?? 34), (t) => 1 - Math.pow(1 - t, 4));
        const lp = ease(f, b.labelAt, b.labelAt + 10, outQuint);
        const top = b.value >= 0 ? ZB.y0 - b.value * ZB.per * g : ZB.y0 + Math.abs(b.value) * ZB.per * g;
        const v = Math.round(Math.abs(b.value) * g);
        return (
          <React.Fragment key={i}>
            {lp > 0 ? <div style={{position: "absolute", left: b.x, top: b.value >= 0 ? ZB.y0 - 340 : ZB.y0 + 340, transform: "translate(-50%, -50%)", opacity: lp, fontFamily: F.sans, fontWeight: 700,
              fontSize: 34, color: "#CFC9BE", letterSpacing: 2, textTransform: "uppercase"}}>{b.label}</div> : null}
            {g > 0 ? <div style={{position: "absolute", left: b.x, top: top + (b.value >= 0 ? -68 : 68), transform: "translate(-50%, -50%)", whiteSpace: "nowrap", color: b.key ? C.highlightPrint : C.white,
              fontFamily: F.serif, fontSize: 86, lineHeight: 1, fontVariantNumeric: "tabular-nums"}}>
              {b.value < 0 ? "−" : "+"}<Rs size={86}/>{v.toLocaleString("en-IN")}<span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: "#B9B2A6", marginLeft: 12, letterSpacing: 1}}>crore</span></div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// typed index card (what we know)
// ---------------------------------------------------------------------------------------------------------------
export type CardItem = {text: string; at: number; emph?: {text: string; at: number; hlAt: number}};
export const IndexCard: React.FC<{f: number; x: number; y: number; w?: number; h?: number; rot?: number; title: string; titleAt: number; items: CardItem[]; enterAt?: number; circleAt?: number}> =
  ({f, x, y, w = 1180, h = 760, rot = -1.6, title, titleAt, items, enterAt = 0, circleAt}) => {
    if (f < enterAt) return null;
    const k = outQuint(clamp01((f - enterAt) / 12));
    const rowY = (i: number) => 250 + i * 128;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateY(${(1 - k) * 700}px) rotate(${rot + (1 - k) * 6}deg)`, filter: k < 0.95 ? `blur(${(1 - k) * 10}px)` : undefined}}>
        <div style={{position: "absolute", inset: 0, transform: "translate(12px, 10px) rotate(1.4deg)", background: C.paperDeep, filter: "brightness(0.92)", boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}/>
        <div style={{position: "absolute", inset: 0, background: PAPER_BG, backgroundSize: "1024px", boxShadow: "0 2px 3px rgba(30,20,10,0.2), 0 18px 36px rgba(30,20,10,0.28)", overflow: "hidden"}}>
          <div style={{position: "absolute", inset: 0, background: "#FFFDF6", opacity: 0.6}}/>
          {Array.from({length: 7}).map((_, i) => <div key={i} style={{position: "absolute", left: 0, right: 0, top: 200 + i * 128, height: 3, background: "rgba(80,120,200,0.32)"}}/>)}
          <div style={{position: "absolute", left: 0, right: 0, top: 168, height: 5, background: C.markerRed, opacity: 0.75}}/>
          <div style={{position: "absolute", left: 112, top: 0, bottom: 0, width: 4, background: "rgba(224,36,94,0.4)"}}/>
          <div style={{position: "absolute", left: 150, top: 40, fontFamily: F.marker, fontSize: 96, color: C.ink, lineHeight: 1.1}}>{typed(title, f, titleAt, 1.6)}</div>
          {items.map((it, i) => {
            const t = typed(it.text, f, it.at);
            const e = it.emph;
            const eT = e ? typed(e.text, f, e.at, 2) : "";
            const hp = e ? ease(f, e.hlAt, e.hlAt + 14, inOut) : 0;
            return (
              <div key={i} style={{position: "absolute", left: 150, top: rowY(i) - 64, whiteSpace: "nowrap", fontFamily: F.mono, fontWeight: 600, fontSize: 52, color: "#1A1714", letterSpacing: -0.5}}>
                {t}{e ? <span style={{marginLeft: 16, padding: "0 8px", backgroundImage: `linear-gradient(90deg, ${C.highlight}, ${C.highlight})`, backgroundRepeat: "no-repeat",
                  backgroundSize: `${(hp * 100).toFixed(1)}% 80%`, backgroundPosition: "0 80%", fontWeight: 800}}>{eT}</span> : null}
              </div>
            );
          })}
          {circleAt != null ? <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            <MarkerCircle f={f} at={circleAt} rect={[w - 360, rowY(3) - 52, 300, 92]} dur={16} color={C.markerRed} width={7} padX={0.1} padY={0.2}/></svg> : null}
        </div>
        {/* tape */}
        <div style={{position: "absolute", left: w / 2 - 110, top: -24, width: 220, height: 50, background: "rgba(230,220,190,0.82)", transform: "rotate(-2deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)"}}/>
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------------------
// yellow sticky note with marker handwriting (what we don't know)
// ---------------------------------------------------------------------------------------------------------------
export const Sticky: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; rot?: number; text: string; size?: number; q?: boolean}> =
  ({f, at, x, y, w = 470, h = 470, rot = -3, text, size = 76, q = true}) => {
    if (f < at) return null;
    const s = spr(f, at, 10, 240), sh = shake(f, at + 3, 8, "st" + text);
    const wp = ease(f, at + 5, at + 26, (t) => t);
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, width: w, height: h, transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * 8}deg) scale(${1.45 - 0.45 * s})`, opacity: clamp01(s * 3),
        background: "linear-gradient(170deg, #FFF36B, #FBE54A 65%, #F3D93E)", boxShadow: "0 4px 4px rgba(0,0,0,0.18), 0 26px 40px rgba(0,0,0,0.26)"}}>
        <div style={{position: "absolute", left: "50%", top: -14, width: 150, height: 34, background: "rgba(230,220,190,0.85)", transform: "translateX(-50%) rotate(-3deg)"}}/>
        {q ? <div style={{position: "absolute", right: 22, bottom: 4, fontFamily: F.marker, fontSize: 170, color: C.markerRed, opacity: 0.85 * ease(f, at + 18, at + 28), lineHeight: 1}}>?</div> : null}
        <div style={{position: "absolute", left: 34, right: 34, top: 44, fontFamily: F.marker, fontSize: size, lineHeight: 1.12, color: C.ink, clipPath: `inset(-10% ${((1 - wp) * 100).toFixed(1)}% -10% -4%)`}}>{text}</div>
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------------------
// watch-list card with checkboxes ticked in marker as said
// ---------------------------------------------------------------------------------------------------------------
export type WatchItem = {text: string; sub?: string; node?: React.ReactNode; at: number; tickAt: number};
export const WatchCard: React.FC<{f: number; x: number; y: number; w?: number; h?: number; rot?: number; items: WatchItem[]; enterAt?: number; hlAt?: number}> =
  ({f, x, y, w = 1440, h = 800, rot = 1, items, enterAt = 0, hlAt = 6}) => {
    if (f < enterAt) return null;
    const k = outQuint(clamp01((f - enterAt) / 12));
    const u = ease(f, hlAt, hlAt + 16, inOut);
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateY(${(1 - k) * -800}px) rotate(${rot - (1 - k) * 5}deg)`, filter: k < 0.95 ? `blur(${(1 - k) * 10}px)` : undefined}}>
        <div style={{position: "absolute", inset: 0, transform: "translate(14px, 12px) rotate(-1.2deg)", background: C.paperDeep, filter: "brightness(0.92)", boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}/>
        <div style={{position: "absolute", inset: 0, background: PAPER_BG, backgroundSize: "1024px", boxShadow: "0 2px 3px rgba(30,20,10,0.2), 0 18px 36px rgba(30,20,10,0.28)", overflow: "hidden"}}>
          <div style={{position: "absolute", inset: 0, background: "#FFFDF6", opacity: 0.55}}/>
          <div style={{position: "absolute", left: 90, top: 56, fontFamily: F.serif, fontSize: 112, color: C.ink, lineHeight: 1}}>Watch list</div>
          <div style={{position: "absolute", left: 90, top: 176, width: 520 * u, height: 20, background: C.highlight, mixBlendMode: "multiply"}}/>
          {items.map((it, i) => {
            const yy = 290 + i * 130, p = ease(f, it.at, it.at + 12, outCubic);
            return (
              <React.Fragment key={i}>
                <div style={{position: "absolute", left: 90, right: 90, top: yy + 62, height: 2, background: "rgba(14,14,14,0.16)"}}/>
                <div style={{position: "absolute", left: 90, top: yy - 28, width: 70, height: 70, border: `7px solid ${C.ink}`, borderRadius: 10, background: "#FBF8F1"}}/>
                {f >= it.tickAt ? <svg width={110} height={110} viewBox="0 0 64 64" style={{position: "absolute", left: 76, top: yy - 52, overflow: "visible"}}>
                  <path d="M 12 36 L 28 52 L 62 6" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
                    strokeDashoffset={1 - ease(f, it.tickAt, it.tickAt + 9, outCubic)}/></svg> : null}
                <div style={{position: "absolute", left: 210, top: yy - 44, whiteSpace: "nowrap", opacity: clamp01(p * 2), transform: `translateX(${(1 - p) * 40}px)`}}>
                  <span style={{fontFamily: F.serif, fontSize: 60, color: C.ink, lineHeight: 1.1}}>{it.node ?? it.text}</span>
                  {it.sub ? <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey, marginLeft: 22}}>{it.sub}</span> : null}
                </div>
              </React.Fragment>
            );
          })}
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10), rgba(0,0,0,0) 40%, rgba(60,40,20,0.08))", pointerEvents: "none"}}/>
        </div>
        <div style={{position: "absolute", left: w / 2 - 120, top: -26, width: 240, height: 52, background: "rgba(230,220,190,0.84)", transform: "rotate(1.5deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.12)"}}/>
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------------------
// typed sources page
// ---------------------------------------------------------------------------------------------------------------
export type SrcLine = {text: string; at: number; hl?: number};
export const SourcesPage: React.FC<{f: number; lines: SrcLine[]; x?: number; y?: number; w?: number; noteAt: number}> = ({f, lines, x = 960, y = 540, w = 1560, noteAt}) => {
  const k = outQuint(clamp01(f / 12));
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - 420, width: w, transform: `translateY(${(1 - k) * 600}px) rotate(-0.6deg)`}}>
      {[2, 1].map((j) => <div key={j} style={{position: "absolute", inset: 0, transform: `translate(${j * 10}px, ${j * 8}px) rotate(${(j % 2 ? 1 : -1) * (0.7 + j * 0.5)}deg)`, background: C.paperDeep,
        filter: `brightness(${1 - j * 0.06})`, boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}/>)}
      <div style={{position: "relative", background: PAPER_BG, backgroundSize: "1024px", padding: "70px 90px 80px", boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)"}}>
        <div style={{position: "absolute", inset: 0, background: "#FFFCF5", opacity: 0.5}}/>
        <div style={{position: "relative", fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.grey, textTransform: "uppercase"}}>Moat &amp; Margin · Jio IPO review</div>
        <div style={{position: "relative", fontFamily: F.serif, fontSize: 118, color: C.ink, lineHeight: 1.05, marginTop: 6, marginBottom: 34}}>Sources</div>
        {lines.map((l, i) => {
          const p = ease(f, l.at, l.at + 12, outQuint);
          const hp = l.hl != null ? ease(f, l.hl, l.hl + 16, inOut) : 0;
          return (
            <div key={i} style={{position: "relative", display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 26, opacity: p, transform: `translateX(${(1 - p) * 50}px)`}}>
              <div style={{width: 16, height: 16, marginTop: 20, background: C.ink, flex: "none"}}/>
              <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#1F1B17"}}>
                <span style={{backgroundImage: `linear-gradient(90deg, ${C.highlight}, ${C.highlight})`, backgroundRepeat: "no-repeat", backgroundSize: `${(hp * 100).toFixed(1)}% 82%`, backgroundPosition: "0 78%"}}>{l.text}</span>
              </div>
            </div>
          );
        })}
        <div style={{position: "absolute", right: 70, bottom: 26, fontFamily: F.marker, fontSize: 56, color: C.markerRed, transform: "rotate(-3deg)", whiteSpace: "nowrap",
          clipPath: `inset(-20% ${((1 - ease(f, noteAt, noteAt + 14, (t) => t)) * 100).toFixed(1)}% -20% -4%)`}}>links in the description</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// end card
// ---------------------------------------------------------------------------------------------------------------
export const EndCard: React.FC<{f: number; d: number}> = ({f, d}) => {
  const b = ease(f, 0, 16, outQuint), u = ease(f, 14, 34, inOut), s = ease(f, 22, 36, outQuint);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.04 * ease(f, 0, d, (t) => t)})`}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 360, height: 230, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: 210, lineHeight: 1.1, color: C.ink, transform: `translateY(${(1 - b) * 230}px)`}}>Moat &amp; Margin</div>
      </div>
      <div style={{position: "absolute", left: 960 - 560, top: 600, width: 1120, height: 20, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%", mixBlendMode: "multiply"}}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 668, textAlign: "center", fontFamily: F.mono, fontWeight: 500, fontSize: 58, letterSpacing: 3, color: C.inkSoft,
        opacity: s, transform: `translateY(${(1 - s) * 20}px)`}}>moatmarginresearch.com</div>
    </AbsoluteFill>
  );
};
