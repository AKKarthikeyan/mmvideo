// asianpaintsq2 (30 Oct 2026): code-drawn props for the Asian Paints Q2 FY27 film. No brand, no logo, no product photo:
// a plain paint tin (cylinder, lid, handle, colour band, drip), a shelf of tins, a balance scale, a sealed envelope, a tap-and-basin icon,
// two glued swatch cards, a name sticker. Ticks (1/30 s) throughout; world px 1920 x 1080; everything inside x 140..1780, y 80..1000.
import React from "react";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr} from "./tokens";
import {PriceTag} from "./AsianPaintsKit";

export const TEAL = "#1F7A6D", GREEN = "#2E8B57";
const GREEN_TAG = "linear-gradient(160deg, #47B27A, #2E8B57 70%)";

/** plain paint tin (no brand): slides in from the left with a blur, drip runs down from the rim; optional green tag on a string */
export const PaintTin: React.FC<{f: number; at: number; x: number; y: number; s?: number; color?: string; tag?: string; tagAt?: number; enter?: boolean;
  tag2?: string; tag2At?: number; dim?: number}> =
  ({f, at, x, y, s = 1, color = TEAL, tag, tagAt, enter = true, tag2, tag2At, dim = 0}) => {
    if (f < at) return null;
    const k = enter ? outQuint(clamp01((f - at) / 14)) : 1;
    const drip = ease(f, at + 10, at + 40, inOut);
    const W0 = 400, H0 = 480;
    return (
      <>
        <div style={{position: "absolute", left: x - (W0 * s) / 2, top: y - (H0 * s) / 2, width: W0 * s, height: H0 * s, opacity: clamp01(k * 2) * (1 - dim * 0.5),
          transform: `translateX(${(1 - k) * -700}px)`, filter: k < 0.9 ? `blur(${((0.9 - k) * 14).toFixed(1)}px)` : dim > 0 ? `grayscale(${dim})` : undefined}}>
          <svg width={W0 * s} height={H0 * s} viewBox={`0 0 ${W0} ${H0}`} style={{overflow: "visible", filter: "drop-shadow(0 18px 24px rgba(30,20,10,0.28))"}}>
            <defs>
              <linearGradient id="apTinMetal" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#9C978E"/><stop offset="0.35" stopColor="#E9E5DC"/><stop offset="0.7" stopColor="#C9C3B7"/><stop offset="1" stopColor="#8E897F"/>
              </linearGradient>
            </defs>
            <path d="M 40 120 L 40 410 Q 200 460 360 410 L 360 120 Z" fill="url(#apTinMetal)" stroke={C.ink} strokeWidth={6}/>
            <path d="M 40 196 Q 200 236 360 196 L 360 340 Q 200 380 40 340 Z" fill={color} stroke={C.ink} strokeWidth={5}/>
            {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 60} y={262 + (i === 1 ? 8 : 4)} width={44} height={44} fill={["#F2C14E", "#F6F1E6", "#E0245E"][i]} stroke={C.ink} strokeWidth={4}/>)}
            <ellipse cx={200} cy={120} rx={160} ry={34} fill="#B9B2A4" stroke={C.ink} strokeWidth={6}/>
            <ellipse cx={200} cy={120} rx={128} ry={24} fill="none" stroke={C.ink} strokeWidth={3} opacity={0.5}/>
            <path d="M 46 150 Q 200 -50 354 150" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>
            <path d={`M 286 140 L 286 ${140 + 120 * drip} Q 296 ${152 + 120 * drip} 306 ${140 + 120 * drip} L 306 140`} fill={color} stroke={C.ink} strokeWidth={3}/>
          </svg>
        </div>
        {tag && tagAt != null ? <PriceTag f={f} at={tagAt} x={x + 250 * s} y={y - 250 * s} text={tag} size={60} bg={GREEN_TAG} color={C.white} string={70}/> : null}
        {tag2 && tag2At != null ? <PriceTag f={f} at={tag2At} x={x - 250 * s} y={y - 220 * s} text={tag2} size={56} string={60}/> : null}
      </>
    );
  };

/** a row of small tins on a plank (volume): n tins pop in one by one */
export const TinRow: React.FC<{f: number; at: number; n: number; x?: number; y?: number; per?: number; color?: string; gap?: number}> =
  ({f, at, n, x = 960, y = 560, per = 3, color = TEAL, gap = 150}) => {
    const x0 = x - ((n - 1) * gap) / 2;
    return (
      <>
        <div style={{position: "absolute", left: x0 - 110, top: y + 78, width: (n - 1) * gap + 220, height: 22, background: "#8C6A44", boxShadow: "0 10px 16px rgba(30,20,10,0.3)",
          opacity: ease(f, at - 4, at + 4)}}/>
        {Array.from({length: n}).map((_, i) => {
          const k = spr(f, at + i * per, 12, 200);
          if (f < at + i * per) return null;
          return <div key={i} style={{position: "absolute", left: x0 + i * gap - 60, top: y - 72, transform: `translateY(${(1 - k) * -220}px)`, opacity: clamp01(k * 3)}}>
            <svg width={120} height={150} viewBox="0 0 400 480"><path d="M 40 120 L 40 410 Q 200 460 360 410 L 360 120 Z" fill="#D8D3C9" stroke={C.ink} strokeWidth={14}/>
              <path d="M 40 196 Q 200 236 360 196 L 360 340 Q 200 380 40 340 Z" fill={color} stroke={C.ink} strokeWidth={12}/>
              <ellipse cx={200} cy={120} rx={160} ry={34} fill="#B9B2A4" stroke={C.ink} strokeWidth={14}/></svg>
          </div>;
        })}
      </>
    );
  };

/** a warehouse shelf (two planks) that fills with tins up to `n` of 14 slots */
export const TinShelf: React.FC<{f: number; at: number; n: number; fillAt?: number; x?: number; y?: number}> = ({f, at, n, fillAt, x = 960, y = 520}) => {
  if (f < at) return null;
  const fa = fillAt ?? at + 4, shown = Math.round(n * ease(f, fa, fa + 24, outCubic));
  const slots = Array.from({length: 14}).map((_, i) => ({row: Math.floor(i / 7), col: i % 7}));
  return (
    <div style={{position: "absolute", left: x - 560, top: y - 260, width: 1120, height: 520, opacity: ease(f, at, at + 6)}}>
      {[0, 1].map((r) => <div key={r} style={{position: "absolute", left: 0, top: 230 + r * 250, width: 1120, height: 24, background: "#8C6A44", boxShadow: "0 8px 14px rgba(30,20,10,0.3)"}}/>)}
      <div style={{position: "absolute", left: 0, top: -10, width: 22, height: 530, background: "#7A5C3A"}}/><div style={{position: "absolute", right: 0, top: -10, width: 22, height: 530, background: "#7A5C3A"}}/>
      {slots.slice(0, shown).map(({row, col}, i) => (
        <div key={i} style={{position: "absolute", left: 50 + col * 150, top: 70 + row * 250}}>
          <svg width={120} height={160} viewBox="0 0 400 480"><path d="M 40 120 L 40 410 Q 200 460 360 410 L 360 120 Z" fill="#D8D3C9" stroke={C.ink} strokeWidth={14}/>
            <path d="M 40 196 Q 200 236 360 196 L 360 340 Q 200 380 40 340 Z" fill={[TEAL, "#C9A227", "#B8432F"][i % 3]} stroke={C.ink} strokeWidth={12}/>
            <ellipse cx={200} cy={120} rx={160} ry={34} fill="#B9B2A4" stroke={C.ink} strokeWidth={14}/></svg>
        </div>))}
    </div>
  );
};

/** balance scale: VOLUME (a tin) on the left pan, MARGIN (coins) on the right; tips toward volume at `tipAt` */
export const Balance: React.FC<{f: number; at: number; tipAt: number; x?: number; y?: number; left?: string; right?: string}> =
  ({f, at, tipAt, x = 960, y = 420, left = "VOLUME", right = "MARGIN"}) => {
    if (f < at) return null;
    const p = ease(f, at, at + 10, outQuint), ang = -9 * ease(f, tipAt, tipAt + 22, inOut), L = 520, rad = (ang * Math.PI) / 180;
    const lx = x - L * Math.cos(rad), ly = y - L * Math.sin(rad), rx = x + L * Math.cos(rad), ry = y + L * Math.sin(rad);
    const pan = (cx: number, cy: number, kind: "tin" | "coin", label: string) => (
      <g>
        <line x1={cx} y1={cy} x2={cx - 120} y2={cy + 170} stroke={C.ink} strokeWidth={5}/><line x1={cx} y1={cy} x2={cx + 120} y2={cy + 170} stroke={C.ink} strokeWidth={5}/>
        <path d={`M ${cx - 160} ${cy + 170} Q ${cx} ${cy + 240} ${cx + 160} ${cy + 170} Z`} fill="#C9C3B7" stroke={C.ink} strokeWidth={6}/>
        {kind === "tin" ? <g transform={`translate(${cx - 55} ${cy + 60}) scale(0.28)`}><path d="M 40 120 L 40 410 Q 200 460 360 410 L 360 120 Z" fill="#D8D3C9" stroke={C.ink} strokeWidth={18}/>
          <path d="M 40 196 Q 200 236 360 196 L 360 340 Q 200 380 40 340 Z" fill={TEAL} stroke={C.ink} strokeWidth={14}/><ellipse cx={200} cy={120} rx={160} ry={34} fill="#B9B2A4" stroke={C.ink} strokeWidth={18}/></g>
          : [0, 1, 2].map((i) => <ellipse key={i} cx={cx} cy={cy + 150 - i * 22} rx={70} ry={18} fill="#E2C46C" stroke={C.ink} strokeWidth={5}/>)}
        <text x={cx} y={cy + 300} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={48} letterSpacing={3} fill={C.ink}>{label}</text>
      </g>
    );
    return (
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p}}>
        <path d={`M ${x} ${y} L ${x - 70} ${y + 470} L ${x + 70} ${y + 470} Z`} fill="#8C6A44" stroke={C.ink} strokeWidth={6}/>
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.ink} strokeWidth={14} strokeLinecap="round"/>
        <circle cx={x} cy={y} r={20} fill={C.markerRed} stroke={C.ink} strokeWidth={5}/>
        {pan(lx, ly, "tin", left)}{pan(rx, ry, "coin", right)}
      </svg>
    );
  };

/** a sealed paper envelope with a label and a red "?" wax seal */
export const Envelope: React.FC<{f: number; at: number; label: string; sub?: string; sealAt?: number; x?: number; y?: number}> =
  ({f, at, label, sub, sealAt, x = 960, y = 500}) => {
    if (f < at) return null;
    const k = spr(f, at, 12, 160), sk = sealAt != null ? spr(f, sealAt, 10, 220) : 0, W0 = 1100, H0 = 560;
    return (
      <div style={{position: "absolute", left: x - W0 / 2, top: y - H0 / 2, width: W0, height: H0, transform: `translateY(${(1 - k) * 500}px) rotate(-1.2deg)`, opacity: clamp01(k * 3)}}>
        <svg width={W0} height={H0} style={{position: "absolute", left: 0, top: 0, filter: "drop-shadow(0 18px 28px rgba(30,20,10,0.3))"}}>
          <rect x={0} y={0} width={W0} height={H0} fill="#EADBB8" stroke="#8C7A55" strokeWidth={4}/>
          <path d={`M 0 0 L ${W0 / 2} ${H0 * 0.55} L ${W0} 0`} fill="#E1CFA6" stroke="#8C7A55" strokeWidth={4}/>
          <path d={`M 0 ${H0} L ${W0 * 0.42} ${H0 * 0.48} M ${W0} ${H0} L ${W0 * 0.58} ${H0 * 0.48}`} stroke="#8C7A55" strokeWidth={3} fill="none"/>
        </svg>
        <div style={{position: "absolute", left: 0, right: 0, top: H0 * 0.66, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 50, color: C.ink, letterSpacing: 2}}>{label}</div>
        {sub ? <div style={{position: "absolute", left: 0, right: 0, top: H0 * 0.66 + 70, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.ink}}>{sub}</div> : null}
        {sealAt != null && f >= sealAt ? <div style={{position: "absolute", left: W0 / 2 - 80, top: H0 * 0.55 - 90, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #F0567F, #B81A48)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.3)", transform: `scale(${0.4 + 0.6 * sk})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.marker, fontSize: 120, color: C.white}}>?</div> : null}
      </div>
    );
  };

/** tap over a basin (bath fittings, an illustration) */
export const TapBasin: React.FC<{size?: number; color?: string}> = ({size = 200, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible", display: "block"}}>
    <g fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M 30 18 L 30 34 L 62 34 Q 70 34 70 42 L 70 46"/><path d="M 22 18 L 38 18"/><path d="M 70 52 L 70 58" strokeDasharray="3 5"/>
      <path d="M 10 62 L 90 62 Q 86 90 50 90 Q 14 90 10 62 Z"/>
    </g>
  </svg>
);
export const TapDisc: React.FC<{f: number; at: number; x: number; y: number; size?: number}> = ({f, at, x, y, size = 240}) => {
  if (f < at) return null;
  const k = spr(f, at, 10, 190);
  return <div style={{position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: C.white, transform: `scale(${0.4 + 0.6 * k})`,
    opacity: clamp01(k * 3), boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 14px 26px rgba(30,20,10,0.25)", display: "flex", alignItems: "center", justifyContent: "center"}}><TapBasin size={size * 0.62}/></div>;
};

/** two paint-swatch cards glued together (price + mix cannot be peeled apart) */
export const SwatchPair: React.FC<{f: number; at: number; a?: string; b?: string; x?: number; y?: number}> = ({f, at, a = "PRICE", b = "MIX", x = 1380, y = 520}) => {
  if (f < at) return null;
  const k = spr(f, at, 12, 170), k2 = spr(f, at + 6, 12, 170);
  const card = (txt: string, col: string, dx: number, rot: number, kk: number) => (
    <div style={{position: "absolute", left: x + dx - 150, top: y - 200, width: 300, height: 400, background: "#FBF8F1", transform: `rotate(${rot * kk}deg) translateY(${(1 - kk) * -300}px)`,
      opacity: clamp01(kk * 3), boxShadow: "0 4px 6px rgba(30,20,10,0.2), 0 16px 28px rgba(30,20,10,0.25)"}}>
      <div style={{position: "absolute", left: 24, right: 24, top: 24, height: 250, background: col}}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 52, letterSpacing: 3, color: C.ink}}>{txt}</div>
    </div>
  );
  return <>{card(a, "#E0A93B", -110, -6, k)}{card(b, TEAL, 110, 5, k2)}
    {f >= at + 14 ? <div style={{position: "absolute", left: x - 70, top: y - 60, width: 140, height: 46, background: "rgba(230,220,190,0.85)", transform: "rotate(-8deg)", opacity: ease(f, at + 14, at + 20)}}/> : null}</>;
};

/** a name sticker (text only, no photo): name on black tape, role underneath */
export const NameSticker: React.FC<{f: number; at: number; name: string; role: string; x?: number; y?: number}> = ({f, at, name, role, x = 960, y = 480}) => {
  if (f < at) return null;
  const k = spr(f, at, 11, 200), r = ease(f, at + 6, at + 16, outQuint);
  return (
    <>
      <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(-2deg) scale(${0.7 + 0.3 * k})`, opacity: clamp01(k * 3), background: C.ink, color: C.white,
        fontFamily: F.sans, fontWeight: 900, fontSize: 120, letterSpacing: 6, padding: "18px 44px", whiteSpace: "nowrap", boxShadow: "0 14px 26px rgba(0,0,0,0.3)"}}>{name}</div>
      <div style={{position: "absolute", left: x, top: y + 140, transform: "translate(-50%, -50%)", opacity: r, fontFamily: F.sans, fontWeight: 800, fontSize: 52, letterSpacing: 3,
        color: C.inkSoft, whiteSpace: "nowrap"}}>{role}</div>
    </>
  );
};

/** paper arrow from one point to another (cost rise -> price) */
export const PaperArrow: React.FC<{f: number; at: number; x1: number; y1: number; x2: number; y2: number; color?: string}> = ({f, at, x1, y1, x2, y2, color = C.markerRed}) => {
  const g = ease(f, at, at + 14, inOut);
  if (g <= 0) return null;
  const ex = x1 + (x2 - x1) * g, ey = y1 + (y2 - y1) * g, a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={14} strokeLinecap="round"/>
      {g > 0.95 ? <path d={`M ${ex - 40 * Math.cos(a - 0.5)} ${ey - 40 * Math.sin(a - 0.5)} L ${ex} ${ey} L ${ex - 40 * Math.cos(a + 0.5)} ${ey - 40 * Math.sin(a + 0.5)}`} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round"/> : null}
    </svg>
  );
};
