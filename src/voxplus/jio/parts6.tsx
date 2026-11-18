// Jio film chapter 6 ("The moat test") helpers: the recurring WALLS SCORECARD, bars on black, rupee tags, a timeline strip,
// dot grids, a typed slip, and the real-document table (rects come from scripts run on the RHP PDF, see DOCS).
// All times are TICKS (1/30 s), local to the shot (use useAt in ch6.tsx).
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {C, F, H, V, W, clamp01, ease, inOut, outCubic, outQuint, shake, spr} from "../tokens";
import {MarkerCircle} from "../Marker";
import {Cam, Layer} from "../Camera";
import {DocPage} from "../DocPage";
import {Finish, InkSurface} from "../Texture";
import {SourceTag} from "../Cards";
import {Paper} from "../A01V4Parts";

// =====================================================================================================
// real documents (public/voxplus/jio/docs/ch6_*.png + rects in image px, from the RHP PDF)
// =====================================================================================================
export const DOCS: Record<string, {src: string; w: number; h: number; r: Record<string, number[][]>}> = {
  adds: {src: "jio/docs/ch6_adds.png", w: 1569, h: 531, r: {"832,441": [[348, 333, 70, 32]], "484,774": [[348, 488, 70, 32]], "Additions/Adjustments": [[35, 178, 200, 32], [35, 333, 200, 32], [35, 488, 200, 32]], "Spectrum": [[311, 13, 90, 32]]}},
  inspect: {src: "jio/docs/ch6_inspect.png", w: 1425, h: 1704, r: {"MATERIAL CONTRACTS AND DOCUMENTS FOR INSPECTION": [[232, 78, 900, 33]], "Material Documents": [[6, 1072, 254, 33]], "Material Contracts to the Issue": [[6, 448, 384, 33]]}},
  kpi: {src: "jio/docs/ch6_kpi.png", w: 1440, h: 522, r: {"Data Traffic": [[37, 247, 132, 30]], "241.4": [[985, 247, 61, 30]], "Net Customer Addition": [[37, 182, 253, 30]], "Monthly Churn (For exit": [[37, 374, 268, 30]], "1.67%": [[976, 390, 70, 30]], "ARPU (For exit quarter)": [[37, 214, 265, 30]], "206.2": [[1171, 214, 61, 30]], "181.7": [[1339, 214, 61, 30]], "36.2": [[999, 182, 47, 30]], "6.4": [[1198, 182, 34, 30]], "42.5": [[1353, 182, 47, 30]], "1.81%": [[1162, 390, 70, 30]], "1.52%": [[1330, 390, 70, 30]]}},
  kpi2: {src: "jio/docs/ch6_kpi2.png", w: 1440, h: 300, r: {"Return on Average Capital": [[37, 201, 290, 30]], "Employed": [[37, 232, 111, 30]], "10.76%": [[963, 216, 83, 30]], "12.83%": [[1317, 216, 83, 30]], "Net Leverage": [[37, 168, 146, 30]], "0.36x": [[985, 168, 61, 30]], "# of times": [[408, 168, 108, 30]]}},
  rrl: {src: "jio/docs/ch6_rrl.png", w: 1398, h: 266, r: {"sole distributor of our pre-paid connectivity services": [[532, 17, 666, 33], [1192, 151, 187, 33], [18, 185, 463, 33]], "Reliance Retail Limited": [[18, 17, 300, 33]]}},
  spec: {src: "jio/docs/ch6_spec.png", w: 1399, h: 188, r: {"only operator in India to have spectrum in low-band": [[284, -5, 673, 33]], "700MHz band can provide deep indoor 5G coverage": [[1264, 29, 114, 33], [18, 64, 523, 33]], "26GHz band enables the company to deploy fixed wireless": [[656, 64, 716, 33]], "access at high capacity": [[18, 98, 269, 33]]}},
  spectab: {src: "jio/docs/ch6_spectab.png", w: 1356, h: 468, r: {"26 GHz": [[622, 431, 89, 32]], "1,000.0 MHz": [[1137, 431, 151, 32]], "700 MHz (Paired)*": [[555, 122, 221, 32], [555, 465, 221, 32]], "2,300 MHz": [[601, 328, 130, 32]], "2030": [[921, 293, 57, 32]], "Andhra Pradesh": [[21, 276, 183, 32]], "1,200 MHz": [[317, 276, 130, 32]], "20.0 MHz": [[1164, 293, 116, 32]]}},
  tariff: {src: "jio/docs/ch6_tariff.png", w: 1398, h: 227, r: {"implemented a tariff increase": [[411, 107, 353, 33]], "which resulted in an increase in ARPU": [[1195, 107, 184, 33], [18, 142, 282, 33]], "higher customer churn": [[892, 142, 269, 33]], "lower growth in our Total Customer Base": [[1302, 142, 76, 33], [18, 176, 424, 33]], "which resulted in an": [[1195, 107, 184, 33], [18, 142, 59, 33]], "increase in ARPU": [[84, 142, 216, 33]], "lower": [[554, 38, 68, 33], [1302, 142, 68, 33]], "growth in our Total Customer Base": [[18, 176, 424, 33]]}},
  terminate: {src: "jio/docs/ch6_terminate.png", w: 1398, h: 188, r: {"does not have the right to terminate the MSA and the FUA": [[18, 73, 697, 33]]}},
  towers: {src: "jio/docs/ch6_towers.png", w: 1398, h: 344, r: {"360,537 Network Towers": [[602, 155, 307, 33]], "174,451 Network Towers are owned by Summit Digitel Infrastructure Limited": [[1275, 155, 104, 33], [18, 190, 915, 33]], "(approximately 98%)": [[462, 259, 255, 33]], "Jio Digital Fibre Private Limited": [[576, 224, 396, 33]]}},
};

/** DocPage props for one of the ch6 crops: pass x, y, width. */
export const dp = (k: keyof typeof DOCS, x: number, y: number, width: number, rot = 0) => ({src: DOCS[k].src, imgW: DOCS[k].w, imgH: DOCS[k].h, x, y, width, rot});
/** line rects of a phrase (image px) */
export const R = (k: keyof typeof DOCS, phrase: string, only?: number): [number, number, number, number][] => {
  const rs = DOCS[k].r[phrase];
  if (!rs) throw new Error("no rect " + k + " / " + phrase);
  return (only == null ? rs : [rs[only]]) as [number, number, number, number][];
};

// =====================================================================================================
// the WALLS SCORECARD: a typed, ruled card with marker ticks and rubber stamps
// =====================================================================================================
export type Verdict = "STRONG" | "PARTIAL" | "BORDERLINE" | "DEPENDENCY";
export const VC: Record<Verdict, string> = {STRONG: "#1F3BD6", PARTIAL: "#A15C00", BORDERLINE: "#C2006B", DEPENDENCY: "#D01846"};
export const WALLS = ["COST", "SPECTRUM", "CUSTOMERS STAY", "PRICING", "DISTRIBUTION", "RETURNS"];
export type RowSpec = {open?: number; v?: Verdict; vAt?: number; ghost?: boolean};

const StampMark: React.FC<{f: number; at: number; text: string; color: string; x: number; y: number; size?: number; rot?: number; ghost?: boolean}> =
  ({f, at, text, color, x, y, size = 46, rot = -5, ghost}) => {
    const live = f >= at;
    if (!live && !ghost) return null;
    const s = live ? spr(f, at, 9, 260) : 1, sh = live ? shake(f, at + 2, 8, "st" + text + x + y) : {x: 0, y: 0};
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${live ? 2.2 - 1.2 * s : 1})`,
        opacity: live ? clamp01(s * 3) * 0.92 : 0.2, fontFamily: F.sans, fontWeight: 900, fontSize: size, letterSpacing: size * 0.07, lineHeight: 1, color,
        border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.12, padding: `${size * 0.14}px ${size * 0.26}px ${size * 0.1}px`, mixBlendMode: "multiply", whiteSpace: "nowrap"}}>{text}</div>
    );
  };

/**
 * Card is 780 x 760 at s = 1, centred on (x, y). Rows open (yellow highlighter wipe on the wall name), then a verdict
 * stamps on the right with a marker tick in the box. `ghost` rows show their stamp faintly before it slams (the recap).
 */
export const ScoreCard: React.FC<{f: number; x: number; y: number; s?: number; rot?: number; enter: number; exit?: number; rows: RowSpec[]; names?: string[];
  title?: string; from?: "bottom" | "right" | "left"; flash?: number}> =
  ({f, x, y, s = 1, rot = -2, enter, exit, rows, names = WALLS, title = "WALLS SCORECARD", from = "bottom", flash}) => {
    if (f < enter) return null;
    const p = outQuint(clamp01((f - enter) / 14)), q = exit != null ? clamp01((f - exit) / 10) : 0;
    if (q >= 1) return null;
    const [fx, fy] = from === "bottom" ? [0, 1100] : from === "right" ? [1500, 200] : [-1500, 200];
    const k = 1 - p, o = q * q * q;
    const dx = fx * k + (exit != null ? (from === "bottom" ? 0 : fx) * o : 0), dy = fy * k + (exit != null && from === "bottom" ? 1100 * o : 0);
    const blur = p < 1 ? 16 * k : q > 0 ? 14 * Math.sin(Math.PI * q) : 0;
    const rowH = 96, y0 = 158;
    return (
      <div style={{position: "absolute", left: x - 390, top: y - 380, width: 780, height: 760, transform: `translate(${dx}px, ${dy}px) rotate(${rot + k * 6}deg) scale(${s})`,
        transformOrigin: "50% 50%", filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>
        <div style={{position: "absolute", inset: 0, background: `url(${V("tex/paper.jpg")}) #FBF8F1`, backgroundSize: "1024px", boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 24px 46px rgba(30,20,10,0.34)"}}>
          <div style={{position: "absolute", inset: 0, background: "#FFFCF5", opacity: 0.5}}/>
          {/* ruled lines + red margin rule (an index card / ledger sheet) */}
          <div style={{position: "absolute", left: 0, right: 0, top: y0 - 10, height: 6 * rowH + 20, background: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 ${rowH - 2}px, rgba(55,85,170,0.32) ${rowH - 2}px ${rowH}px)`, transform: "translateY(10px)"}}/>
          <div style={{position: "absolute", left: 98, top: 0, bottom: 0, width: 3, background: "rgba(224,36,94,0.5)"}}/>
          <div style={{position: "absolute", left: 40, top: 28, fontFamily: F.mono, fontWeight: 700, fontSize: 40, letterSpacing: 5, color: C.ink}}>{title}</div>
          <div style={{position: "absolute", left: 40, top: 84, fontFamily: F.mono, fontSize: 21, letterSpacing: 3, color: C.grey}}>JIO · OUR READING</div>
          <div style={{position: "absolute", left: 28, right: 28, top: y0 - 14, height: 4, background: C.ink}}/>
          {names.map((nm, i) => {
            const r = rows[i] ?? {};
            const op = r.open != null ? ease(f, r.open, r.open + 12, inOut) : 0;
            const vOn = r.v != null && r.vAt != null && f >= r.vAt;
            const tick = r.vAt != null ? ease(f, r.vAt + 4, r.vAt + 12, outCubic) : 0;
            const live = r.open != null && f >= r.open;
            const top = y0 + i * rowH;
            const dim = live || vOn || r.ghost ? 1 : 0.5;
            return (
              <React.Fragment key={i}>
                {i === 5 ? <div style={{position: "absolute", left: 28, right: 28, top: top - 6, height: 3, background: C.ink, opacity: 0.8}}/> : null}
                <div style={{position: "absolute", left: 38, top: top + 22, width: 46, height: 46, border: `4px solid ${C.ink}`, borderRadius: 6, background: "#FFFDF8", opacity: dim}}/>
                <svg width={90} height={90} style={{position: "absolute", left: 20, top: top + 4, overflow: "visible", opacity: 1}}>
                  <path d="M 14 46 L 34 68 L 78 14" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick}/>
                </svg>
                <div style={{position: "absolute", left: 120, top: top + 20, height: 52, display: "flex", alignItems: "center", opacity: dim}}>
                  <div style={{position: "absolute", left: -8, right: -8, top: 8, bottom: 2, background: C.highlight, transform: `scaleX(${op})`, transformOrigin: "0 50%", mixBlendMode: "multiply"}}/>
                  <span style={{position: "relative", fontFamily: F.mono, fontWeight: 700, fontSize: 31, letterSpacing: 1, color: C.ink, whiteSpace: "nowrap"}}>
                    <span style={{fontFamily: F.marker, color: C.markerRed, marginRight: 12, fontWeight: 400}}>{i + 1}</span>{nm}</span>
                </div>
                {r.v ? <StampMark f={f} at={r.vAt ?? 99999} text={r.v} color={VC[r.v]} x={640} y={top + 46} size={r.v === "DEPENDENCY" || r.v === "BORDERLINE" ? 34 : 40} rot={-4 + (i % 3) * 3} ghost={r.ghost}/> : null}
                {live && !r.v && i === 5 ? <div style={{position: "absolute", left: 560, top: top + 10, fontFamily: F.marker, fontSize: 70, color: C.markerRed, transform: "rotate(-6deg)",
                  opacity: ease(f, r.open ?? 0, (r.open ?? 0) + 8)}}>?</div> : null}
              </React.Fragment>
            );
          })}
          {flash != null && f >= flash ? <div style={{position: "absolute", inset: 0, background: "#fff", opacity: 0.5 * Math.exp(-(f - flash) / 4)}}/> : null}
        </div>
      </div>
    );
  };

// =====================================================================================================
// bars on black (per-bar timing; the key bar turns Vox yellow). Honest scale: bars share one `max`.
// =====================================================================================================
export type BarItem = {label: string; value: number; text: string; at: number; key?: boolean; dec?: number; color?: string; dim?: boolean};
export const Bars: React.FC<{f: number; items: BarItem[]; max: number; box: {x: number; y: number; w: number; h: number}; dir?: "h" | "v"; dur?: number;
  title?: string; titleAt?: number; labelSize?: number; valSize?: number; grid?: boolean}> =
  ({f, items, max, box, dir = "h", dur = 30, title, titleAt = 0, labelSize = 36, valSize = 84, grid = true}) => {
    const n = items.length, tp = ease(f, titleAt, titleAt + 12, outQuint);
    const axis = ease(f, titleAt, titleAt + 20, outCubic);
    return (
      <>
        {title ? <div style={{position: "absolute", left: box.x - 20, top: 96, fontFamily: F.serif, fontSize: 92, color: C.white, opacity: tp, transform: `translateY(${(1 - tp) * 26}px)`, whiteSpace: "nowrap"}}>{title}</div> : null}
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {dir === "h" ? (
            <>
              {grid ? [0.25, 0.5, 0.75, 1].map((g, i) => <line key={i} x1={box.x + box.w * g} x2={box.x + box.w * g} y1={box.y - 10} y2={box.y + (box.h) * axis} stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeDasharray="6 10"/>) : null}
              <line x1={box.x} x2={box.x} y1={box.y - 10} y2={box.y + box.h * axis} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
            </>
          ) : (
            <>
              {grid ? [0.25, 0.5, 0.75, 1].map((g, i) => <line key={i} x1={box.x} x2={box.x + box.w * axis} y1={box.y + box.h - box.h * g} y2={box.y + box.h - box.h * g} stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeDasharray="6 10"/>) : null}
              <line x1={box.x} x2={box.x + box.w * axis} y1={box.y + box.h} y2={box.y + box.h} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
            </>
          )}
          {items.map((b, i) => {
            const g = ease(f, b.at, b.at + dur, (t) => 1 - Math.pow(1 - t, 4));
            if (g <= 0) return null;
            const fill = b.color ?? (b.key ? C.highlightPrint : C.chartBlue);
            if (dir === "h") {
              const rh = box.h / n, th = Math.min(150, rh * 0.58), cy = box.y + rh * (i + 0.5);
              return <rect key={i} x={box.x} y={cy - th / 2} width={Math.max(3, (b.value / max) * box.w * g)} height={th} fill={fill} opacity={b.dim ? 0.55 : 1}/>;
            }
            const sl = box.w / n, bw = Math.min(250, sl * 0.5), cx = box.x + sl * (i + 0.5), h = (b.value / max) * box.h * g;
            return <rect key={i} x={cx - bw / 2} y={box.y + box.h - h} width={bw} height={Math.max(3, h)} fill={fill} opacity={b.dim ? 0.55 : 1}/>;
          })}
        </svg>
        {items.map((b, i) => {
          const g = ease(f, b.at, b.at + dur, (t) => 1 - Math.pow(1 - t, 4));
          const lp = ease(f, b.at - 4, b.at + 6, outQuint), pop = b.key ? spr(f, b.at + dur, 10, 220) : 0;
          const txt = g > 0.985 ? b.text : (b.value * g).toFixed(b.dec ?? 0);
          const col = b.key ? C.highlightPrint : C.white;
          if (dir === "h") {
            const rh = box.h / n, cy = box.y + rh * (i + 0.5), end = box.x + (b.value / max) * box.w * g;
            return (
              <React.Fragment key={i}>
                <div style={{position: "absolute", right: W - box.x + 34, top: cy, transform: `translateY(-50%) translateX(${(1 - lp) * -16}px)`, opacity: lp, fontFamily: F.sans, fontWeight: 700, fontSize: labelSize,
                  color: b.key ? C.white : "#CFC9BE", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", textAlign: "right"}}>{b.label}</div>
                {g > 0 ? <div style={{position: "absolute", left: end + 26, top: cy, transform: `translateY(-50%) scale(${1 + 0.16 * pop * (1 - clamp01((f - b.at - dur - 8) / 10))})`, transformOrigin: "0 50%",
                  fontFamily: F.serif, fontSize: b.key ? valSize * 1.1 : valSize, color: col, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>{txt}</div> : null}
              </React.Fragment>
            );
          }
          const sl = box.w / n, cx = box.x + sl * (i + 0.5), h = (b.value / max) * box.h * g;
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx, top: box.y + box.h + 52, transform: `translate(-50%, -50%) translateY(${(1 - lp) * 14}px)`, opacity: lp, fontFamily: F.sans, fontWeight: 700, fontSize: labelSize,
                color: b.key ? C.white : "#CFC9BE", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap"}}>{b.label}</div>
              {g > 0 ? <div style={{position: "absolute", left: cx, top: box.y + box.h - h - 62, transform: `translate(-50%, -50%) scale(${1 + 0.16 * pop * (1 - clamp01((f - b.at - dur - 8) / 10))})`,
                fontFamily: F.serif, fontSize: b.key ? valSize * 1.1 : valSize, color: col, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>{txt}</div> : null}
            </React.Fragment>
          );
        })}
      </>
    );
  };

// =====================================================================================================
// rupee tag: manila tag on a string, the number counts up (₹ in Inter, the number in the serif)
// =====================================================================================================
export const RTag: React.FC<{f: number; at: number; x: number; y: number; to: number; dec?: number; countAt?: number; dur?: number; size?: number; string?: number; pre?: string; color?: string}> =
  ({f, at, x, y, to, dec = 2, countAt, dur = 24, size = 150, string = 300, pre = "₹", color = "#2A1C0E"}) => {
    if (f < at) return null;
    const drop = 1 - spr(f, at, 12, 150);
    const ang = 11 * Math.exp(-(f - at) / 16) * Math.cos((f - at) * 0.25) + 1.0 * Math.sin(f * 0.05 + x);
    const ca = countAt ?? at + 6, v = to * ease(f, ca, ca + dur, (t) => 1 - Math.pow(1 - t, 4));
    const txt = (f >= ca + dur ? to : v).toFixed(dec);
    const w = (String(to.toFixed(dec)).length * 0.52 + 1.7) * size, h = size * 1.75;
    return (
      <div style={{position: "absolute", left: x, top: y - drop * 800, transform: `rotate(${ang}deg)`, transformOrigin: "0 0"}}>
        <div style={{position: "absolute", left: -2, top: 0, width: 4, height: string, background: "linear-gradient(90deg,#8A7A60,#C8B994,#8A7A60)"}}/>
        <div style={{position: "absolute", left: -w / 2, top: string - 14, width: w, height: h, filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.35))"}}>
          <div style={{position: "absolute", inset: 0, clipPath: "polygon(9% 0, 91% 0, 100% 24%, 100% 100%, 0 100%, 0 24%)", background: "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)"}}/>
          <div style={{position: "absolute", left: w / 2 - 14, top: 8, width: 28, height: 28, borderRadius: "50%", background: "#C9A85E", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.35)"}}/>
          <div style={{position: "absolute", left: w / 2 - 7, top: 15, width: 14, height: 14, borderRadius: "50%", background: "#3B2B18"}}/>
          <div style={{position: "absolute", left: 0, right: 0, top: size * 0.4, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", color, lineHeight: 1, whiteSpace: "nowrap"}}>
            <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.78, marginRight: size * 0.04}}>{pre}</span>
            <span style={{fontFamily: F.serif, fontSize: size, letterSpacing: -2, fontVariantNumeric: "tabular-nums"}}>{txt}</span>
          </div>
        </div>
      </div>
    );
  };

// =====================================================================================================
// typed paper slip (adding-machine tape / worksheet): lines type out one after another
// =====================================================================================================
export const Slip: React.FC<{f: number; x: number; y: number; w?: number; rot?: number; lines: {t: string; at: number; bold?: boolean; color?: string; tick?: number}[]; head?: string; size?: number; enter?: number}> =
  ({f, x, y, w = 640, rot = -2, lines, head, size = 40, enter = 0}) => {
    if (f < enter) return null;
    const p = outQuint(clamp01((f - enter) / 12));
    const lh = size * 1.7;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - (lines.length * lh + 120) / 2, width: w, transform: `translateY(${(1 - p) * 700}px) rotate(${rot}deg)`, opacity: p > 0 ? 1 : 0}}>
        <div style={{background: "#FBF8F1", padding: "34px 40px 40px", boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 18px 36px rgba(30,20,10,0.28)", clipPath: "polygon(0 0, 100% 0, 100% 97%, 96% 100%, 92% 97%, 88% 100%, 84% 97%, 80% 100%, 76% 97%, 72% 100%, 68% 97%, 64% 100%, 60% 97%, 56% 100%, 52% 97%, 48% 100%, 44% 97%, 40% 100%, 36% 97%, 32% 100%, 28% 97%, 24% 100%, 20% 97%, 16% 100%, 12% 97%, 8% 100%, 4% 97%, 0 100%)"}}>
          {head ? <div style={{fontFamily: F.mono, fontSize: size * 0.55, letterSpacing: 3, color: C.grey, marginBottom: size * 0.5}}>{head}</div> : null}
          {lines.map((l, i) => {
            const n = Math.max(0, Math.min(l.t.length, Math.floor((f - l.at) / 1.3)));
            const t = l.tick != null ? ease(f, l.tick, l.tick + 8, outCubic) : 0;
            return (
              <div key={i} style={{position: "relative", height: lh, fontFamily: "'Courier New', Courier, monospace", fontWeight: 700, fontSize: size, color: l.color ?? "#1A1714", whiteSpace: "pre"}}>
                {l.t.slice(0, n)}
                {l.tick != null ? <svg width={80} height={80} style={{position: "absolute", right: -10, top: -6, overflow: "visible"}}>
                  <path d="M 8 42 L 28 62 L 72 8" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t}/></svg> : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

// =====================================================================================================
// timeline strip on paper (2026..2042), a red pointer that scrubs, pins with sticker labels
// =====================================================================================================
export const TimeStrip: React.FC<{f: number; at: number; from: number; to: number; moveAt: number; moveDur?: number; y: number; x0: number; x1: number; y0?: number; y1?: number;
  pins: {year: number; at: number; label: string; dy: number; dark?: boolean}[]; marked?: number[]}> =
  ({f, at, from, to, moveAt, moveDur = 24, y, x0, x1, y0 = 2026, y1 = 2042, pins, marked = []}) => {
    const ent = ease(f, at, at + 12, outQuint);
    if (ent <= 0) return null;
    const xOf = (yr: number) => x0 + ((yr - y0) / (y1 - y0)) * (x1 - x0);
    const pos = xOf(from) + (xOf(to) - xOf(from)) * ease(f, moveAt, moveAt + moveDur, inOut);
    const years = Array.from({length: y1 - y0 + 1}, (_, i) => y0 + i);
    return (
      <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateY(${(1 - ent) * 260}px)`, opacity: ent}}>
        <div style={{position: "absolute", left: x0 - 80, top: y - 74, width: x1 - x0 + 160, height: 160, background: "#FBF8F1", boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 14px 30px rgba(30,20,10,0.22)", transform: "rotate(-0.4deg)"}}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={x0 - 30} x2={x1 + 30} y1={y} y2={y} stroke={C.ink} strokeWidth={4}/>
          {years.map((yr) => <line key={yr} x1={xOf(yr)} x2={xOf(yr)} y1={y - (marked.includes(yr) ? 20 : 11)} y2={y + (marked.includes(yr) ? 20 : 11)} stroke={C.ink} strokeWidth={marked.includes(yr) ? 6 : 3}/>)}
          {pins.map((p, i) => {
            const k = ease(f, p.at, p.at + 8, outCubic);
            if (k <= 0) return null;
            return <line key={i} x1={xOf(p.year)} x2={xOf(p.year)} y1={y} y2={y - Math.abs(p.dy) * k * 0.9} stroke={C.markerRed} strokeWidth={6} strokeLinecap="round"/>;
          })}
          <path d={`M ${pos - 20} ${y - 52} L ${pos + 20} ${y - 52} L ${pos} ${y - 20} Z`} fill={C.markerRed}/>
        </svg>
        {years.map((yr) => <div key={yr} style={{position: "absolute", left: xOf(yr), top: y + 42, transform: "translate(-50%, -50%)", fontFamily: F.mono, fontSize: 25, color: marked.includes(yr) ? C.ink : C.grey, fontWeight: marked.includes(yr) ? 700 : 400}}>{yr}</div>)}
        {pins.map((p, i) => {
          const k = spr(f, p.at + 4, 10, 200);
          if (k <= 0) return null;
          return <div key={i} style={{position: "absolute", left: xOf(p.year), top: y - Math.abs(p.dy) - 28, transform: `translate(-50%, -50%) scale(${0.5 + 0.5 * k}) rotate(${i % 2 ? 2 : -2}deg)`, opacity: clamp01(k * 3),
            background: p.dark ? C.ink : C.white, color: p.dark ? C.white : C.ink, fontFamily: F.sans, fontWeight: 900, fontSize: 40, textTransform: "uppercase", padding: "9px 18px 7px", lineHeight: 1, whiteSpace: "nowrap",
            boxShadow: "0 2px 3px rgba(0,0,0,0.18), 0 10px 22px rgba(0,0,0,0.22)"}}>{p.label}</div>;
        })}
      </div>
    );
  };

// =====================================================================================================
// 100 dots (10 x 10): the first `n` turn red one after another
// =====================================================================================================
export const DotGrid: React.FC<{f: number; x: number; y: number; n: number; at: number; cell?: number; color?: string; each?: number; enter?: number}> =
  ({f, x, y, n, at, cell = 58, color = C.markerRed, each = 0.7, enter = 0}) => {
    const e = ease(f, enter, enter + 12, outQuint);
    if (e <= 0) return null;
    const w = 10 * cell;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - w / 2 + (1 - e) * 40, width: w, height: w, opacity: e}}>
        {Array.from({length: 100}).map((_, i) => {
          const col = i % 10, row = Math.floor(i / 10), on = i < n && f >= at + i * each;
          const pop = on ? spr(f, at + i * each, 10, 220) : 0;
          return <div key={i} style={{position: "absolute", left: col * cell + cell * 0.14, top: row * cell + cell * 0.14, width: cell * 0.72, height: cell * 0.72, borderRadius: "50%",
            background: on ? color : "rgba(14,14,14,0.07)", border: `3px solid ${on ? color : "rgba(14,14,14,0.3)"}`, transform: `scale(${on ? 0.7 + 0.3 * pop : 1})`}}/>;
        })}
      </div>
    );
  };

// =====================================================================================================
// small helpers
// =====================================================================================================
/** Black ground (ink surface) for chart/number shots with the chip. */
export const Ink: React.FC<{f: number; d: number; cam?: Cam; chip?: string; children?: React.ReactNode; over?: React.ReactNode; glow?: number}> = ({f, d, cam, chip, children, over, glow = 0.08}) => {
  const c = cam ?? {s: 1 + 0.04 * ease(f, 0, d, (t) => t), x: 960, y: 540};
  return (
    <AbsoluteFill>
      <InkSurface glow={glow}/>
      <Layer cam={c}>{children}</Layer>
      {over}
      {chip ? <SourceTag f={f} at={0} text={chip} dark/> : null}
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
/** Paper ground with a real camera layer (for shots that need custom cameras). */
export const PaperShot: React.FC<{f: number; d: number; cam: Cam; tone?: "cream" | "kraft"; chip?: string; children?: React.ReactNode; over?: React.ReactNode}> = ({f, d, cam, tone = "cream", chip, children, over}) => (
  <AbsoluteFill>
    <Layer cam={cam} depth={0.85}><Paper tone={tone} drift={f / Math.max(1, d)}/></Layer>
    <Layer cam={cam}>{children}</Layer>
    {over}
    {chip ? <SourceTag f={f} at={0} text={chip}/> : null}
    <Finish f={f}/>
  </AbsoluteFill>
);
export {DocPage, MarkerCircle, random};
