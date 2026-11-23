// ants1 bespoke props (Moat Atlas, Anthropic S-1, 27 Oct 2026). All code-drawn: no logos, no real banknote, no photos.
// The $1 bill (generic paper note), the "6 MONTHS" sand timer, the follow-the-dollar Sankey (Moat Atlas colours on black),
// a code window, the loop diagram, the control chart, a three-step pyramid, coin stacks, the Moat Atlas corner mark and end card.
// TIME: ticks (1/30 s) like the rest of the kit; positions are world px (1920 x 1080).
import React from "react";
import {AbsoluteFill} from "remotion";
import {G, Mark, SANS, Wordmark, GlobalFonts} from "../global/theme";
import {Finish} from "./Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr} from "./tokens";
import {Lab, XI, XIcon} from "./AntPieces";
import {IconName} from "./A01V4Parts";

// ---------------------------------------------------------------------------------------------------
// the $1 bill: a generic pale-green paper note. `parts` tears it into vertical strips at splitAt.
// ---------------------------------------------------------------------------------------------------
export type BillPart = {frac: number; label?: string; tint?: string; drop?: boolean};
export const Bill: React.FC<{f: number; at: number; x?: number; y?: number; w?: number; rot?: number; parts?: BillPart[]; splitAt?: number; gap?: number; label?: string}> =
  ({f, at, x = 960, y = 540, w = 900, rot = -3, parts, splitAt = 1e9, gap = 70, label}) => {
    if (f < at) return null;
    const k = spr(f, at, 13, 150), h = w * 0.43, sp = ease(f, splitAt, splitAt + 18, outCubic);
    const face = (clipL: number, clipR: number) => (
      <div style={{position: "absolute", inset: 0, clipPath: `inset(0 ${100 - clipR * 100}% 0 ${clipL * 100}%)`}}>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(160deg,#E4EBD3,#CBD8B4 55%,#BFCFA6)", borderRadius: 10,
          boxShadow: "inset 0 0 0 10px #F4F2E6, inset 0 0 0 16px #8FA27A"}}/>
        <div style={{position: "absolute", left: w * 0.33, top: h * 0.16, width: w * 0.34, height: h * 0.68, borderRadius: "50%", border: "8px solid #6E8460",
          background: "radial-gradient(circle,#DCE6C8,#C3D2A9)", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.serif, fontSize: h * 0.42, color: "#3E5233"}}>$1</div>
        {[[0.07, 0.2], [0.85, 0.2], [0.07, 0.7], [0.85, 0.7]].map(([px, py], i) => (
          <div key={i} style={{position: "absolute", left: w * px, top: h * py, fontFamily: F.serif, fontSize: h * 0.2, color: "#3E5233"}}>1</div>))}
        <div style={{position: "absolute", left: 0, right: 0, top: h * 0.86, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: h * 0.06,
          letterSpacing: 8, color: "#55694A"}}>ONE DOLLAR · ILLUSTRATION</div>
      </div>
    );
    let acc = 0;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateY(${(1 - k) * 500}px) rotate(${rot}deg)`,
        filter: "drop-shadow(0 16px 24px rgba(30,20,10,0.3))"}}>
        {!parts || sp <= 0 ? face(0, 1) : parts.map((p, i) => {
          const a = acc; acc += p.frac;
          const off = (i - (parts.length - 1) / 2) * gap * sp, dy = p.drop ? 160 * sp : 0, rr = p.drop ? 8 * sp : (i - (parts.length - 1) / 2) * 2 * sp;
          return (
            <div key={i} style={{position: "absolute", inset: 0, transform: `translate(${off}px, ${dy}px) rotate(${rr}deg)`}}>
              {face(a, acc)}
              {p.tint ? <div style={{position: "absolute", left: `${a * 100}%`, width: `${p.frac * 100}%`, top: 0, bottom: 0, background: p.tint, opacity: 0.45 * sp, borderRadius: 6}}/> : null}
              {p.label ? <div style={{position: "absolute", left: `${(a + p.frac / 2) * 100}%`, top: h + 50, transform: "translateX(-50%)", opacity: sp, whiteSpace: "nowrap",
                fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: C.ink, textAlign: "center"}}>{p.label}</div> : null}
            </div>
          );
        })}
        {label ? <div style={{position: "absolute", left: 0, right: 0, top: -70, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: C.inkSoft}}>{label}</div> : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// sand timer stamped "6 MONTHS": sand runs over `run` ticks after each (re)start; flips turn it over
// ---------------------------------------------------------------------------------------------------
export const SandTimer: React.FC<{f: number; at: number; x?: number; y?: number; s?: number; flips?: number[]; run?: number; label?: string; dark?: boolean}> =
  ({f, at, x = 1500, y = 560, s = 1, flips = [], run = 300, label = "6 MONTHS", dark}) => {
    if (f < at) return null;
    const k = spr(f, at, 12, 160);
    let rot = 0, t0 = at + 6;
    flips.forEach((fl) => { if (f >= fl) { rot += 180 * ease(f, fl, fl + 18, inOut); t0 = fl + 18; } });
    const flipping = flips.some((fl) => f >= fl && f < fl + 18);
    const lvl = flipping ? 0 : clamp01((f - t0) / run);   // share of sand already fallen
    const W0 = 240, H0 = 380, ink = dark ? "#E8E2D6" : C.ink;
    const top = 1 - lvl, bot = lvl;
    return (
      <div style={{position: "absolute", left: x - W0 / 2 * s, top: y - H0 / 2 * s, width: W0 * s, height: H0 * s, transform: `translateY(${(1 - k) * -400}px) rotate(${rot}deg)`, opacity: clamp01(k * 3)}}>
        <svg width={W0 * s} height={H0 * s} viewBox="0 0 240 380" style={{overflow: "visible", filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.3))"}}>
          <rect x={10} y={0} width={220} height={26} rx={6} fill="#8A5A34"/><rect x={10} y={354} width={220} height={26} rx={6} fill="#8A5A34"/>
          <path d="M 40 26 L 200 26 Q 200 130 128 190 Q 200 250 200 354 L 40 354 Q 40 250 112 190 Q 40 130 40 26 Z" fill="rgba(235,245,250,0.55)" stroke={ink} strokeWidth={6}/>
          {/* top sand: a triangle shrinking toward the neck */}
          {!flipping && top > 0.01 ? <path d={`M ${120 - 70 * top} ${170 - 120 * top} L ${120 + 70 * top} ${170 - 120 * top} L 120 186 Z`} fill="#D9A441"/> : null}
          {!flipping && lvl > 0 && lvl < 1 ? <line x1={120} y1={190} x2={120} y2={350} stroke="#D9A441" strokeWidth={4}/> : null}
          {!flipping && bot > 0.01 ? <path d={`M 50 352 L 190 352 L ${120 + 60 * (1 - bot)} ${352 - 120 * bot} L ${120 - 60 * (1 - bot)} ${352 - 120 * bot} Z`} fill="#D9A441"/> : null}
        </svg>
        <div style={{position: "absolute", left: "50%", top: H0 * s * 0.5, transform: `translate(-50%,-50%) rotate(${-rot}deg)`, background: C.ink, color: C.white, fontFamily: F.sans,
          fontWeight: 900, fontSize: 30 * s, letterSpacing: 2, padding: `${6 * s}px ${12 * s}px`, whiteSpace: "nowrap"}}>{label}</div>
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// follow-the-dollar Sankey on black (Moat Atlas colours): revenue (blue) + funding gap (red) on the left,
// split by function on the right. Values in US$ millions as filed; labels in cents per dollar of revenue.
// ---------------------------------------------------------------------------------------------------
export type SkOut = {id: string; label: string; v: number; cents: string; at: number; color?: string};
export const DollarSankey: React.FC<{f: number; revAt: number; rev: number; revLabel: string; outs: SkOut[]; gap?: {v: number; label: string; at: number};
  overlay?: {at: number; text: string}; focus?: string[]; scale?: number; title?: string; source?: string}> =
  ({f, revAt, rev, revLabel, outs, gap, overlay, focus, scale = 0.034, title, source}) => {
    const X0 = 340, NW = 46, X1 = 1120, Y0 = 300, PAD = 30;
    const total = outs.reduce((a, o) => a + o.v, 0);
    const lh = rev * scale, gh = gap ? gap.v * scale : 0;
    const leftH = lh + gh, rightH = total * scale + PAD * (outs.length - 1);
    const ly0 = Y0 + (rightH - leftH) / 2;
    const rp = ease(f, revAt, revAt + 16, outQuint), gp = gap ? ease(f, gap.at, gap.at + 14, outQuint) : 0;
    let srcY = ly0, dstY = Y0;
    const lit = (id: string) => !focus || focus.includes(id) ? 1 : 0.28;
    const tp = ease(f, 0, 12, outQuint);
    return (
      <>
        {title ? <div style={{position: "absolute", left: 120, top: 110, fontFamily: F.serif, fontSize: 60, color: C.white, opacity: tp}}>{title}</div> : null}
        {source ? <div style={{position: "absolute", left: 124, top: 190, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div> : null}
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <rect x={X0} y={ly0} width={NW} height={lh * rp} fill={G.rev}/>
          {gap && gp > 0 ? <rect x={X0} y={ly0 + lh} width={NW} height={gh * gp} fill={C.markerRed}/> : null}
          {outs.map((o) => {
            const h = o.v * scale, p = ease(f, o.at, o.at + 20, inOut);
            const sy = srcY, dy = dstY; srcY += h; dstY += h + PAD;
            if (p <= 0) return null;
            const xa = X0 + NW, xb = X0 + NW + (X1 - X0 - NW) * p, mx = (xa + X1) / 2;
            const col = o.color ?? G.spend;
            const d = `M ${xa} ${sy} C ${mx} ${sy}, ${mx} ${dy}, ${X1} ${dy} L ${X1} ${dy + h} C ${mx} ${dy + h}, ${mx} ${sy + h}, ${xa} ${sy + h} Z`;
            return (
              <g key={o.id} opacity={lit(o.id)}>
                <clipPath id={"sk" + o.id}><rect x={xa} y={0} width={xb - xa} height={1080}/></clipPath>
                <path d={d} fill={col} opacity={0.55} clipPath={`url(#sk${o.id})`}/>
                {p > 0.95 ? <rect x={X1} y={dy} width={NW} height={h} fill={col}/> : null}
              </g>
            );
          })}
        </svg>
        {rp > 0 ? <div style={{position: "absolute", left: X0 - 24, top: ly0 + lh / 2, transform: "translate(-100%,-50%)", textAlign: "right", opacity: rp}}>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: "#CFC9BE"}}>REVENUE</div>
          <div style={{fontFamily: F.serif, fontSize: 84, color: C.white, lineHeight: 1}}>{revLabel}</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: G.rev}}>= 100¢</div>
        </div> : null}
        {gap && gp > 0 ? <div style={{position: "absolute", left: X0 - 24, top: ly0 + lh + gh / 2 + 30, transform: "translate(-100%,-50%)", textAlign: "right", opacity: gp,
          fontFamily: F.sans, fontWeight: 900, fontSize: 30, color: "#FF8FA8", whiteSpace: "nowrap"}}>{gap.label}</div> : null}
        {(() => {
          let yy = Y0;
          return outs.map((o) => {
            const h = o.v * scale, cy = yy + h / 2; yy += h + PAD;
            const p = ease(f, o.at + 14, o.at + 24, outQuint);
            if (p <= 0) return null;
            return (
              <div key={o.id} style={{position: "absolute", left: X1 + NW + 26, top: cy, transform: `translate(${(1 - p) * 20}px,-50%)`, opacity: p * lit(o.id), whiteSpace: "nowrap",
                display: "flex", alignItems: "baseline", gap: 18}}>
                <span style={{fontFamily: F.serif, fontSize: 70, color: o.color === C.markerRed ? "#FF8FA8" : C.highlightPrint, lineHeight: 1}}>{o.cents}</span>
                <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 26, letterSpacing: 1.5, color: "#E8E2D6"}}>{o.label}</span>
              </div>
            );
          });
        })()}
        {overlay && f >= overlay.at ? (() => {
          const p = ease(f, overlay.at, overlay.at + 16, inOut);
          return <div style={{position: "absolute", left: X0 - 20, top: Y0 + rightH + 40, width: (X1 + NW - X0 + 40) * p, height: 74, background: C.highlight, display: "flex",
            alignItems: "center", paddingLeft: 26, overflow: "hidden", whiteSpace: "nowrap", fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: C.ink}}>{overlay.text}</div>;
        })() : null}
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------
// code window (code-drawn, no product screenshot): lines type in; tagged lines get a yellow CLAUDE chip
// ---------------------------------------------------------------------------------------------------
export const CodeWindow: React.FC<{f: number; at: number; lines: string[]; x?: number; y?: number; w?: number; tagAt?: number; tagged?: number[]; title?: string; rot?: number}> =
  ({f, at, lines, x = 960, y = 520, w = 1100, tagAt, tagged = [], title = "terminal", rot = -1.5}) => {
    if (f < at) return null;
    const k = spr(f, at, 13, 160), lh = 58, h = 90 + lines.length * lh + 40;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateY(${(1 - k) * 600}px) rotate(${rot}deg)`, background: "#15171C",
        borderRadius: 16, boxShadow: "0 24px 50px rgba(0,0,0,0.4)", overflow: "hidden"}}>
        <div style={{height: 56, background: "#23262D", display: "flex", alignItems: "center", gap: 14, paddingLeft: 24}}>
          {["#E0245E", "#E8B341", "#4CB36C"].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c}}/>)}
          <div style={{marginLeft: 20, fontFamily: F.mono, fontSize: 22, color: "#8C93A0"}}>{title}</div>
        </div>
        {lines.map((l, i) => {
          const t0 = at + 8 + i * 7, n = Math.floor(clamp01((f - t0) / 10) * l.length);
          const tg = tagAt != null && tagged.includes(i) ? ease(f, tagAt + i * 2, tagAt + i * 2 + 8, outQuint) : 0;
          return (
            <div key={i} style={{position: "absolute", left: 30, top: 90 + i * lh, right: 30, display: "flex", alignItems: "center", gap: 20, whiteSpace: "pre",
              fontFamily: F.mono, fontSize: 32, color: i % 3 === 0 ? "#9CDCFE" : i % 3 === 1 ? "#CE9178" : "#DCDCAA"}}>
              <span style={{color: "#555B66", width: 40, textAlign: "right"}}>{i + 1}</span><span>{l.slice(0, n)}</span>
              {tg > 0 ? <span style={{marginLeft: "auto", background: C.highlightPrint, color: C.ink, fontFamily: F.sans, fontWeight: 900, fontSize: 22, letterSpacing: 2,
                padding: "4px 12px", transform: `scale(${0.6 + 0.4 * tg})`, opacity: tg}}>CLAUDE</span> : null}
            </div>
          );
        })}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// loop diagram: nodes on a circle, arrows draw round one by one; optional grey rival loop beside it
// ---------------------------------------------------------------------------------------------------
export const Loop: React.FC<{f: number; at: number; nodes: {icon: XIcon | IconName; label: string; at?: number}[]; x?: number; y?: number; r?: number; grey?: boolean; spin?: number;
  per?: number; title?: string}> =
  ({f, at, nodes, x = 960, y = 540, r = 300, grey, spin = 0, per = 20, title}) => {
    if (f < at) return null;
    const n = nodes.length, ang = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n + spin * f * 0.002;
    const col = grey ? "#A39C90" : C.markerRed;
    return (
      <>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {nodes.map((nd, i) => {
            const t = (nd.at ?? at + i * per) + 6, p = ease(f, t, t + 16, inOut);
            if (p <= 0) return null;
            const a0 = ang(i) + 0.42, a1 = ang(i) + (2 * Math.PI) / n - 0.42, am = a0 + (a1 - a0) * p;
            const ex = x + r * Math.cos(am), ey = y + r * Math.sin(am);
            const big = (a1 - a0) > Math.PI ? 1 : 0;
            return (
              <g key={i}>
                <path d={`M ${x + r * Math.cos(a0)} ${y + r * Math.sin(a0)} A ${r} ${r} 0 ${big} 1 ${ex} ${ey}`} fill="none" stroke={col} strokeWidth={10} strokeLinecap="round"/>
                {p > 0.9 ? <path d={`M ${ex} ${ey} l ${-22 * Math.cos(am - 0.9)} ${-22 * Math.sin(am - 0.9)} M ${ex} ${ey} l ${-22 * Math.cos(am + 0.6 + Math.PI / 2)} ${-22 * Math.sin(am + 0.6 + Math.PI / 2)}`}
                  stroke={col} strokeWidth={10} strokeLinecap="round"/> : null}
              </g>
            );
          })}
        </svg>
        {nodes.map((nd, i) => {
          const t = nd.at ?? at + i * per, cx = x + r * Math.cos(ang(i)), cy = y + r * Math.sin(ang(i));
          if (f < t) return null;
          const k = spr(f, t, 10, 190);
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx - 85, top: cy - 85, width: 170, height: 170, borderRadius: "50%", background: grey ? "#D9D3C7" : C.white,
                transform: `scale(${0.4 + 0.6 * k})`, opacity: clamp01(k * 3), boxShadow: "0 12px 24px rgba(30,20,10,0.25)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <XI name={nd.icon} size={100} color={grey ? "#6E675C" : C.ink}/></div>
              <Lab f={f} at={t + 4} text={nd.label} x={cx} y={cy + 125} size={30} color={grey ? "#6E675C" : C.inkSoft}/>
            </React.Fragment>
          );
        })}
        {title ? <Lab f={f} at={at} text={title} x={x} y={y} size={36} color={grey ? "#6E675C" : C.ink}/> : null}
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------
// control chart (b07): trust and founders' share above the board; listed shares below with a minority of votes
// ---------------------------------------------------------------------------------------------------
const Box: React.FC<{f: number; at: number; x: number; y: number; w: number; text: string; sub?: string; dark?: boolean; red?: boolean}> = ({f, at, x, y, w, text, sub, dark, red}) => {
  if (f < at) return null;
  const k = spr(f, at, 12, 170);
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - 70, width: w, height: 140, background: dark ? C.ink : red ? "#FBE3E9" : "#FBF8F1", color: dark ? C.white : C.ink,
      transform: `translateY(${(1 - k) * -120}px) rotate(${(1 - k) * 6}deg)`, opacity: clamp01(k * 3), boxShadow: "0 3px 4px rgba(30,20,10,0.18), 0 16px 30px rgba(30,20,10,0.24)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center"}}>
      <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 32, letterSpacing: 2}}>{text}</div>
      {sub ? <div style={{marginTop: 8, fontFamily: F.mono, fontSize: 24, color: dark ? "#CFC9BE" : C.markerRed}}>{sub}</div> : null}
    </div>
  );
};
export const Control: React.FC<{f: number; trustAt: number; founderAt: number; boardAt: number; allAt: number; listedAt: number}> = ({f, trustAt, founderAt, boardAt, allAt, listedAt}) => {
  const arrow = (x1: number, y1: number, x2: number, y2: number, at: number, col = C.ink) => {
    const p = ease(f, at, at + 14, inOut);
    if (p <= 0) return null;
    const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
    return <g><line x1={x1} y1={y1} x2={ex} y2={ey} stroke={col} strokeWidth={8} strokeLinecap="round"/>
      {p > 0.95 ? <path d={`M ${x2 - 18} ${y2 - 24} L ${x2} ${y2} L ${x2 + 18} ${y2 - 24}`} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round"/> : null}</g>;
  };
  return (
    <>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {arrow(600, 300, 860, 450, trustAt + 14)}{arrow(1320, 300, 1060, 450, founderAt + 14)}{arrow(960, 760, 960, 600, listedAt + 14, "#A39C90")}
      </svg>
      <Box f={f} at={trustAt} x={600} y={230} w={600} text="LONG-TERM BENEFIT TRUST" sub="no financial stake · elects most of the board"/>
      <Box f={f} at={founderAt} x={1320} y={230} w={540} text="FOUNDERS' SHARE (CLASS F)" sub="50.1% of the votes"/>
      <Box f={f} at={boardAt} x={960} y={530} w={420} text="THE BOARD" dark/>
      {f >= allAt ? <div style={{position: "absolute", left: 735, top: 530, transform: `translate(-100%, -50%) scale(${spr(f, allAt, 10, 200)})`, transformOrigin: "100% 50%", fontFamily: F.marker, fontSize: 40,
        color: C.markerRed, whiteSpace: "nowrap"}}>together: every director →</div> : null}
      <Box f={f} at={listedAt} x={960} y={830} w={700} text="PEOPLE WHO BUY LISTED SHARES" sub="a minority of the votes" red/>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// three-step pyramid (customers by yearly spend)
// ---------------------------------------------------------------------------------------------------
export const Pyramid: React.FC<{f: number; tiers: {label: string; v: string; at: number}[]; x?: number; y?: number}> = ({f, tiers, x = 960, y = 560}) => (
  <>{tiers.map((t, i) => {
    const w = 1100 - i * 300, k = spr(f, t.at, 12, 170), yy = y + 170 - i * 170;
    if (f < t.at) return null;
    return (
      <div key={i} style={{position: "absolute", left: x - w / 2, top: yy - 75, width: w, height: 150, background: i === 2 ? C.ink : i === 1 ? "#3A3631" : "#6C655B",
        transform: `translateY(${(1 - k) * -200}px)`, opacity: clamp01(k * 3), display: "flex", alignItems: "center", justifyContent: "center", gap: 30, color: C.white,
        boxShadow: "0 12px 24px rgba(30,20,10,0.25)"}}>
        <span style={{fontFamily: F.serif, fontSize: 84, color: C.highlightPrint}}>{t.v}</span>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2}}>{t.label}</span>
      </div>
    );
  })}</>
);

// ---------------------------------------------------------------------------------------------------
// coin stack that grows to `n` coins
// ---------------------------------------------------------------------------------------------------
export const Coins: React.FC<{f: number; at: number; n: number; x: number; y: number; dur?: number; tint?: string; label?: string; sub?: string; out?: number}> =
  ({f, at, n, x, y, dur = 30, tint = "#D9A441", label, sub, out}) => {
    if (f < at) return null;
    const shown = Math.max(1, Math.round(n * ease(f, at, at + dur, outCubic)));
    const ox = out != null ? -600 * ease(f, out, out + 20, inOut) : 0;
    return (
      <div style={{position: "absolute", left: x + ox, top: y, opacity: out != null ? 1 - ease(f, out + 10, out + 20) : 1}}>
        {Array.from({length: shown}).map((_, i) => (
          <div key={i} style={{position: "absolute", left: -90 + Math.sin(i * 1.7) * 4, top: -i * 22, width: 180, height: 44, borderRadius: "50%", background: tint,
            border: "4px solid rgba(60,40,10,0.55)", boxShadow: "0 3px 0 rgba(60,40,10,0.4)"}}/>
        ))}
        {label ? <div style={{position: "absolute", left: 0, top: 70, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: F.sans, fontWeight: 900, fontSize: 40, color: C.ink}}>{label}</div> : null}
        {sub ? <div style={{position: "absolute", left: 0, top: 124, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: F.mono, fontSize: 24, color: C.inkSoft}}>{sub}</div> : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// index card with a number and a title (the six "But" cards, the three "watch" cards, the moat-test cards)
// ---------------------------------------------------------------------------------------------------
export const IdxCard: React.FC<{f: number; at: number; x: number; y: number; n?: string; title: string; big?: string; sub?: string; rot?: number; w?: number; tick?: number; mark?: string; markColor?: string; dim?: number}> =
  ({f, at, x, y, n, title, big, sub, rot = 0, w = 420, tick, mark, markColor = C.markerRed, dim = 0}) => {
    if (f < at) return null;
    const k = spr(f, at, 12, 160), h = w * 0.78;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: "#FBF8F1", opacity: clamp01(k * 3) * (1 - dim * 0.5),
        transform: `translateY(${(1 - k) * 300}px) rotate(${rot + (1 - k) * 10}deg)`, boxShadow: "0 3px 4px rgba(30,20,10,0.18), 0 16px 30px rgba(30,20,10,0.24)",
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0 46px, rgba(70,110,170,0.18) 46px 48px)", backgroundPosition: "0 70px"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 58, height: 3, background: "rgba(224,36,94,0.45)"}}/>
        {n ? <div style={{position: "absolute", left: 22, top: 6, fontFamily: F.serif, fontSize: 44, color: C.markerRed}}>{n}</div> : null}
        <div style={{position: "absolute", left: n ? 74 : 22, right: 16, top: 14, fontFamily: F.sans, fontWeight: 900, fontSize: w * 0.062, letterSpacing: 1.5, color: C.ink, whiteSpace: "nowrap"}}>{title}</div>
        {big ? <div style={{position: "absolute", left: 0, right: 0, top: h * 0.36, textAlign: "center", fontFamily: F.serif, fontSize: w * 0.22, color: C.ink}}>{big}</div> : null}
        {sub ? <div style={{position: "absolute", left: 12, right: 12, top: h * 0.76, textAlign: "center", fontFamily: F.mono, fontSize: w * 0.05, color: C.inkSoft}}>{sub}</div> : null}
        {tick != null && f >= tick ? <div style={{position: "absolute", right: 24, bottom: 10, fontFamily: F.marker, fontSize: w * 0.3, color: "#2E8B57",
          transform: `scale(${spr(f, tick, 10, 200)})`}}>✓</div> : null}
        {mark ? <div style={{position: "absolute", left: 0, right: 0, top: h * 0.42, textAlign: "center", fontFamily: F.marker, fontSize: w * 0.16, color: markColor}}>{mark}</div> : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// Moat Atlas corner mark (stamps in) and the end card (dark Moat Atlas ground, two end-screen slots, credits + bias note)
// ---------------------------------------------------------------------------------------------------
export const AtlasMark: React.FC<{f: number; at: number; x?: number; y?: number; s?: number}> = ({f, at, x = 1700, y = 900, s = 1.4}) => {
  if (f < at) return null;
  const k = spr(f, at, 9, 260);
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible", opacity: clamp01(k * 3)}}>
      <GlobalFonts/>
      <g transform={`translate(${x} ${y}) scale(${2 - k}) rotate(${-8 * k})`}>
        <rect x={-30} y={-30} width={360} height={110} rx={10} fill={G.bg}/>
        <Mark x={-20} y={-22} s={0.78}/>
        <Wordmark x={92} y={46} size={40}/>
      </g>
    </svg>
  );
};
export const AtlasEnd: React.FC<{f: number; next: string}> = ({f, next}) => {
  const k = ease(f, 0, 14, outQuint);
  return (
    <AbsoluteFill style={{background: G.bg, opacity: k}}>
      <GlobalFonts/>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Mark x={110} y={90} s={0.8}/>
        <Wordmark x={230} y={170} size={72}/>
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x={110 + i * 860} y={290} width={800} height={450} rx={14} fill={G.panel} stroke={G.line} strokeWidth={3} strokeDasharray="14 10"/>
            <text x={510 + i * 860} y={530} textAnchor="middle" fontFamily={SANS} fontSize={34} fill={G.dim}>{i ? "BEST FOR VIEWER" : next}</text>
          </g>
        ))}
        <text x={110} y={830} fontFamily={SANS} fontSize={30} fill={G.dim}>Research and script: Moat &amp; Margin research team · Narration: synthetic voice</text>
        <text x={110} y={875} fontFamily={SANS} fontSize={30} fill={G.ink}>Script drafted with Claude, an AI model made by Anthropic, the company in this video. Every figure checked against the S-1.</text>
        <text x={110} y={920} fontFamily={SANS} fontSize={30} fill={G.dim}>Information, not investment advice. Source: Anthropic, PBC Form S-1 (preliminary), filed 26 Oct 2026. Figures in US$.</text>
      </svg>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// horizontal bridge on black (d08/d09): net loss -> add-backs -> adjusted net income, US$ billions
// ---------------------------------------------------------------------------------------------------
export const HBridge: React.FC<{f: number; title: string; source: string; rows: {label: string; v: number; at: number; kind?: "start" | "total"; note?: string}[]; min: number; max: number}> =
  ({f, title, source, rows, min, max}) => {
    const tp = ease(f, 0, 12, outQuint), X0 = 540, XW = 1100, X = (v: number) => X0 + ((v - min) / (max - min)) * XW, y0 = 340, rh = 100;
    let run = 0;
    const bars = rows.map((r) => {
      if (r.kind === "start") { run = r.v; return {...r, a: 0, b: r.v}; }
      if (r.kind === "total") return {...r, a: 0, b: r.v};
      const a = run; run += r.v; return {...r, a, b: run};
    });
    const fmt = (v: number) => (v < 0 ? "–" : "+") + "$" + Math.abs(v).toFixed(1) + "B";
    return (
      <>
        <div style={{position: "absolute", left: 120, top: 110, fontFamily: F.serif, fontSize: 60, color: C.white, opacity: tp}}>{title}</div>
        <div style={{position: "absolute", left: 124, top: 190, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
        <div style={{position: "absolute", left: X(0) - 2, top: y0 - 30, width: 4, height: rows.length * rh + 40, background: "rgba(255,255,255,0.7)"}}/>
        <div style={{position: "absolute", left: X(0), top: y0 - 62, transform: "translateX(-50%)", fontFamily: F.mono, fontSize: 24, color: "#CFC9BE"}}>$0</div>
        {bars.map((b, i) => {
          if (f < b.at) return null;
          const g = ease(f, b.at, b.at + 18, outCubic), y = y0 + i * rh;
          const lo = Math.min(b.a, b.a + (b.b - b.a) * g), hi = Math.max(b.a, b.a + (b.b - b.a) * g);
          const col = b.kind === "start" ? C.markerRed : b.kind === "total" ? "#2fa37a" : C.highlightPrint;
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: 120, top: y + 12, width: X0 - 160, textAlign: "right", fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 1.5,
                color: "#E8E2D6", opacity: clamp01(g * 3), whiteSpace: "nowrap"}}>{b.label}</div>
              {b.note ? <div style={{position: "absolute", left: 120, top: y + 52, width: X0 - 160, textAlign: "right", fontFamily: F.mono, fontSize: 20, color: "#9C968C", opacity: clamp01(g * 3)}}>{b.note}</div> : null}
              <div style={{position: "absolute", left: X(lo), top: y, width: Math.max(3, X(hi) - X(lo)), height: rh - 34, background: col}}/>
              {i > 0 && b.kind !== "total" ? <div style={{position: "absolute", left: X(b.a) - 1, top: y - 34, width: 2, height: 34, borderLeft: "3px dashed rgba(255,255,255,0.4)"}}/> : null}
              <div style={{position: "absolute", left: b.kind === "start" ? (X(lo) + X(hi)) / 2 : X(hi) + 20, top: y + (rh - 34) / 2, transform: b.kind === "start" ? "translate(-50%,-50%)" : "translate(0,-50%)",
                fontFamily: F.sans, fontWeight: 900, fontSize: 44, color: b.kind === "start" ? C.white : b.kind === "total" ? "#7FD8B0" : C.highlightPrint, whiteSpace: "nowrap", opacity: clamp01(g * 2)}}>
                {fmt(b.v)}</div>
            </React.Fragment>
          );
        })}
      </>
    );
  };
