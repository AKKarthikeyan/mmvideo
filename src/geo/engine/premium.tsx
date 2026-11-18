// "Premium" overlay theme for GeoShort (AK 25 Oct 2026: "except the map nothing looks premium").
// Editorial documentary look: DM Serif Display headlines that wipe in, Inter labels in glass pills, pulsing pins,
// IBM Plex Mono for figures, karaoke captions showing the whole line, film grain. Opt in with Spec.theme = "premium".
import React from "react";
import {interpolate, spring, staticFile, Easing} from "remotion";

export const PC = {ink: "#0B0F17", cream: "#F4ECDD", amber: "#F2B33D", teal: "#5ED6CC", red: "#E5484D", green: "#4ADE80"};
export const SERIF = "'DM Serif Display', Georgia, serif";
export const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'IBM Plex Mono', Menlo, monospace";
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const glass = {background: "rgba(11,15,23,0.66)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(244,236,221,0.18)", boxShadow: "0 10px 40px rgba(0,0,0,0.45)"};
const halo = "0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)";

export const PFonts: React.FC = () => <style>{[
  ["Inter", 500, "inter-latin-500-normal"], ["Inter", 600, "inter-latin-600-normal"], ["Inter", 700, "inter-latin-700-normal"],
  ["Inter", 800, "inter-latin-800-normal"], ["DM Serif Display", 400, "dm-serif-display-latin-400-normal"], ["IBM Plex Mono", 600, "ibm-plex-mono-latin-600-normal"],
].map(([fam, w, file]) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(${staticFile(`fonts/${file}.woff2`)}) format("woff2");}`).join("")}</style>;

// map colours from the specs are bright UI colours; soften them into the premium palette
export const pcol = (c?: string) => !c ? PC.cream : ({"#FFB020": PC.amber, "#3DD9FF": PC.teal, "#FFFFFF": PC.cream, "#fff": PC.cream, "#FF3B30": PC.red, "#2ECC71": PC.green} as Record<string, string>)[c] ?? c;
const isNum = (s: string) => /\d/.test(s) && s.replace(/[^\d]/g, "").length >= s.replace(/\s/g, "").length * 0.4;

// ---------- map label: small caps, tracked, no box (boxes only for pins) ----------
export const PLabel: React.FC<{x: number; y: number; o: number; text: string; sub?: string; color?: string; size?: number}> = ({x, y, o, text, sub, color, size = 50}) => {
  if (o <= 0) return null;
  const fs = Math.max(26, Math.min(44, size * 0.72));
  const mono = isNum(text);
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - o) * 10}px)`, opacity: o, textAlign: "center", whiteSpace: "nowrap"}}>
    <div style={{fontFamily: mono ? MONO : SANS, fontWeight: mono ? 600 : 800, fontSize: fs, letterSpacing: mono ? "0.02em" : "0.14em", textTransform: "uppercase",
      color: pcol(color), textShadow: halo}}>{text}</div>
    {sub && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: fs * 0.62, letterSpacing: "0.08em", color: PC.cream, opacity: 0.85, marginTop: 4, textShadow: halo}}>{sub}</div>}
  </div>;
};

// ---------- pin: dot + white ring + pulse, label in a glass pill on a leader line ----------
export const PPin: React.FC<{x: number; y: number; o: number; age: number; text?: string; color?: string; dy?: number}> = ({x, y, o, age, text, color, dy = -62}) => {
  if (o <= 0) return null;
  const c = pcol(color); const k = Math.min(1, age / 0.35);
  const u = Math.min(1, age / 0.5), drop = u >= 1 ? 0 : -46 * (1 - u) * Math.cos(u * Math.PI * 2.2) * (1 - u);
  const pulse = (age % 1.6) / 1.6;
  const up = dy < 0; const lead = Math.max(26, Math.abs(dy) - 34);
  return <>
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o, pointerEvents: "none"}}>
      <circle cx={x} cy={y} r={14 + 38 * pulse} fill="none" stroke={c} strokeWidth={3} opacity={(1 - pulse) * 0.7}/>
      <circle cx={x} cy={y + drop} r={13 * k} fill={c} stroke={PC.cream} strokeWidth={4}/>
      {text && <line x1={x} y1={y + (up ? -16 : 16)} x2={x} y2={y + (up ? -16 - lead * k : 16 + lead * k)} stroke={PC.cream} strokeWidth={2.5} opacity={0.8}/>}
    </svg>
    {text && <div style={{position: "absolute", left: x, top: y + (up ? -16 - lead : 16 + lead), transform: `translate(-50%, ${up ? "-100%" : "0"}) scale(${0.9 + 0.1 * k})`,
      opacity: o * k, ...glass, borderRadius: 14, padding: "10px 20px", whiteSpace: "nowrap", borderLeft: `5px solid ${c}`}}>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", textTransform: "uppercase", color: PC.cream}}>{text}</span>
    </div>}
  </>;
};

// ---------- ruler: thin line, end ticks, mono distance pill ----------
export const PRuler: React.FC<{ax: number; ay: number; bx: number; by: number; k: number; o: number; text: string; color?: string; dy?: number}> = ({ax, ay, bx, by, k, o, text, color, dy = -60}) => {
  const c = pcol(color ?? "#FFB020"); const ex = ax + (bx - ax) * k, ey = ay + (by - ay) * k;
  const ang = Math.atan2(by - ay, bx - ax), nx = -Math.sin(ang) * 16, ny = Math.cos(ang) * 16;
  return <>
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o}}>
      <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="rgba(0,0,0,0.5)" strokeWidth={9} strokeLinecap="round"/>
      <line x1={ax} y1={ay} x2={ex} y2={ey} stroke={c} strokeWidth={4} strokeLinecap="round" strokeDasharray="14 10"/>
      <line x1={ax - nx} y1={ay - ny} x2={ax + nx} y2={ay + ny} stroke={c} strokeWidth={4}/>
      {k > 0.98 && <line x1={bx - nx} y1={by - ny} x2={bx + nx} y2={by + ny} stroke={c} strokeWidth={4}/>}
    </svg>
    {text && k > 0.5 && <div style={{position: "absolute", left: (ax + bx) / 2, top: (ay + by) / 2 + dy, transform: "translate(-50%,-50%)", opacity: o, ...glass,
      borderRadius: 999, padding: "8px 22px", fontFamily: MONO, fontWeight: 600, fontSize: 38, color: c, whiteSpace: "nowrap"}}>{text}</div>}
  </>;
};

// ---------- headline: accent rule + serif title that wipes up + tracked caps sub ----------
export const PBig: React.FC<{o: number; age: number; text: string; sub?: string; color?: string; y?: number; size?: number; stamp?: boolean}> = ({o, age, text, sub, color, y = 240, size = 150, stamp}) => {
  if (o <= 0) return null;
  const k = ease(Math.min(1, age / 0.55)), k2 = ease(Math.max(0, Math.min(1, (age - 0.2) / 0.5)));
  const mono = isNum(text) && text.length <= 14;
  const fs = Math.min(mono ? 150 : 132, size * (mono ? 1.0 : 0.92)) * (text.length > 16 ? Math.max(0.62, 16 / text.length) : 1);
  const c = color ? pcol(color) : PC.cream;
  return <div style={{position: "absolute", left: 50, right: 50, top: y - 20, textAlign: "center", opacity: o}}>
    <div style={{width: 90 * k, height: 6, background: stamp ? PC.red : PC.amber, margin: "0 auto 18px", borderRadius: 3}}/>
    <div style={{overflow: "hidden", paddingBottom: 8}}>
      <div style={{fontFamily: mono ? MONO : SERIF, fontWeight: mono ? 600 : 400, fontSize: fs, lineHeight: 1.02,
        color: c === PC.amber && !mono ? PC.cream : c, letterSpacing: mono ? "-0.02em" : "0", textShadow: "0 6px 30px rgba(0,0,0,0.75)"}}>
        {Array.from(text).map((ch, i) => { const q = ease(Math.max(0, Math.min(1, (age - i * 0.028) / 0.45)));
          return <span key={i} style={{display: "inline-block", whiteSpace: "pre", opacity: q, transform: `translateY(${(1 - q) * 60}%) rotate(${(1 - q) * 6}deg)`,
            filter: `blur(${(1 - q) * 6}px)`}}>{ch}</span>; })}</div>
    </div>
    {sub && <div style={{opacity: k2, transform: `translateY(${(1 - k2) * 14}px)`, fontFamily: SANS, fontWeight: 700, fontSize: Math.max(30, Math.min(40, fs * 0.3)),
      letterSpacing: "0.16em", textTransform: "uppercase", color: PC.amber, marginTop: 10, textShadow: halo}}>{sub}</div>}
  </div>;
};

// ---------- counter: big mono figure, tracked caps label ----------
export const PCounter: React.FC<{o: number; text: string; label?: string; y?: number; color?: string; size?: number; prog?: number}> = ({o, text, label, y = 240, color, size = 200, prog = 1}) =>
  o <= 0 ? null : <div style={{position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: o, filter: `blur(${(1 - prog) * 3}px)`}}>
    <div style={{width: 240, height: 6, background: "rgba(244,236,221,0.2)", margin: "0 auto 16px", borderRadius: 3, overflow: "hidden"}}>
      <div style={{width: `${prog * 100}%`, height: "100%", background: PC.amber, boxShadow: `0 0 10px ${PC.amber}`}}/></div>
    <div style={{fontFamily: MONO, fontWeight: 600, fontSize: Math.min(170, size * 0.85) * (text.length > 9 ? 9 / text.length : 1), lineHeight: 1, color: color ? pcol(color) : PC.cream,
      letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", textShadow: "0 6px 30px rgba(0,0,0,0.75)"}}>{text}</div>
    {label && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: "0.16em", textTransform: "uppercase", color: PC.amber, marginTop: 14, textShadow: halo}}>{label}</div>}
  </div>;

// ---------- glass card + premium panels ----------
export const PCard: React.FC<{o: number; children: React.ReactNode; top?: number; h?: number}> = ({o, children, top = 300, h}) =>
  <div style={{position: "absolute", left: 70, right: 70, top, height: h, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, ...glass, borderRadius: 28, overflow: "hidden"}}>{children}</div>;
export const PTimeline: React.FC<{o: number; u: number; props: any}> = ({o, u, props}) => {
  const items: {y: string; t: string}[] = props.items;
  return <PCard o={o}><div style={{padding: "46px 50px 30px"}}>
    {items.map((it, i) => { const k = ease(Math.max(0, Math.min(1, u * items.length * 1.3 - i))); return k <= 0 ? null :
      <div key={i} style={{display: "flex", gap: 28, alignItems: "baseline", marginBottom: 30, opacity: k, transform: `translateX(${(1 - k) * 40}px)`, borderLeft: `5px solid ${PC.amber}`, paddingLeft: 24}}>
        <span style={{fontFamily: MONO, fontWeight: 600, fontSize: 50, color: PC.amber, minWidth: 250, whiteSpace: "nowrap"}}>{it.y}</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: PC.cream, lineHeight: 1.2}}>{it.t}</span></div>; })}
  </div></PCard>;
};
export const PTiles: React.FC<{o: number; u: number; props: any}> = ({o, u, props}) => {
  const words: string[] = props.words;
  return <PCard o={o} top={340}><div style={{display: "flex", flexDirection: "column", gap: 22, padding: 46}}>
    {words.map((w, i) => { const k = ease(Math.max(0, Math.min(1, u * words.length * 1.2 - i))); return k <= 0 ? null :
      <div key={i} style={{display: "flex", alignItems: "center", gap: 24, opacity: k, transform: `translateY(${(1 - k) * 24}px)`}}>
        <span style={{fontFamily: MONO, fontWeight: 600, fontSize: 40, color: PC.ink, background: PC.amber, borderRadius: 12, padding: "4px 16px"}}>{String(i + 1).padStart(2, "0")}</span>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, color: PC.cream, letterSpacing: "0.02em"}}>{w.replace(/\s*→\s*$/, "")}</span></div>; })}
  </div></PCard>;
};

// ---------- chrome: channel tag, karaoke captions, question card, credit, grain ----------
export const PTag: React.FC = () => <div style={{position: "absolute", left: 0, right: 0, top: 92, display: "flex", justifyContent: "center"}}>
  <div style={{...glass, borderRadius: 999, padding: "9px 24px", display: "flex", alignItems: "center", gap: 12}}>
    <div style={{width: 12, height: 12, borderRadius: 6, background: PC.amber, boxShadow: `0 0 12px ${PC.amber}`}}/>
    <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.28em", color: PC.cream}}>INDICA ATLAS</span>
  </div></div>;

export const PCaption: React.FC<{words: string[]; nW: number; age: number}> = ({words, nW, age}) => {
  const k = ease(Math.min(1, age / 0.25));
  return <div style={{position: "absolute", left: 60, right: 60, top: 1370, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
    <div style={{display: "inline", fontFamily: SANS, fontWeight: 800, fontSize: 62, lineHeight: 1.28, letterSpacing: "-0.01em"}}>
      {words.map((w, i) => <span key={i} style={{color: i < nW - 1 ? PC.cream : i === nW - 1 ? PC.ink : "rgba(244,236,221,0.42)",
        background: i === nW - 1 ? PC.amber : "transparent", borderRadius: 10, padding: i === nW - 1 ? "0 10px" : "0 2px",
        textShadow: i === nW - 1 ? "none" : halo, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{w}{" "}</span>)}
    </div></div>;
};

export const PQuestion: React.FC<{o: number; text: string}> = ({o, text}) => o <= 0 ? null :
  <div style={{position: "absolute", left: 70, right: 70, top: 1160, opacity: o, transform: `translateY(${(1 - o) * 20}px)`, ...glass, borderRadius: 24,
    padding: "20px 28px", textAlign: "center", borderTop: `4px solid ${PC.amber}`}}>
    <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: PC.cream, lineHeight: 1.25}}>{text}</span></div>;

export const PCredit: React.FC<{text: string}> = ({text}) => <div style={{position: "absolute", left: 60, right: 60, bottom: 60, textAlign: "center",
  fontFamily: SANS, fontWeight: 500, fontSize: 20, lineHeight: 1.35, color: "rgba(244,236,221,0.6)", textShadow: "0 1px 3px #000"}}>{text}</div>;

export const PScrims: React.FC = () => <>
  <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 560, background: "linear-gradient(180deg, rgba(5,8,15,0.55), rgba(5,8,15,0))"}}/>
  <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 720, background: "linear-gradient(0deg, rgba(5,8,15,0.78), rgba(5,8,15,0))"}}/>
</>;

export const Grain: React.FC<{f: number}> = ({f}) => <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none"}}>
  <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 30} stitchTiles="stitch"/></filter>
  <rect width="100%" height="100%" filter="url(#gr)"/></svg>;

export const pv = (v: number, prefix = "", suffix = "") => `${prefix}${Math.round(v).toLocaleString("en-US")}${suffix}`;
export {interpolate, spring};
