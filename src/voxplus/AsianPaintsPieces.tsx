// asianpaintsq2 (30 Oct 2026): copy of MarutiPieces.tsx for the Asian Paints Q2 FY27 film; only imports and the chip texts changed.
// kotakq2 shared pieces (24 Oct 2026): copy of SwiggyPieces.tsx (adds truck/bus/pickup/ship/car/safe/handshake/scale/tyre/steel icons); originally EternalPieces.tsx (receipt, icons, Doc, Bars, Rs, Counter, Squares) plus
// code-drawn icons, real letter excerpts (Doc), signed bar chart on black, store counter, square grid, risk meter, chain.
// TIME: every f / at / dur is in ticks (1/30 s), read with useTicks(); positions are world px (1920 x 1080).
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {Icon, IconName, Paper, camI} from "./A01V4Parts";
import {Cam, CamKey, Layer} from "./Camera";
import {camAt} from "./Camera";
import {StickerLabel} from "./Collage";
import {DocPage, docRectCentre} from "./DocPage";
import {MarkerCircle, MarkerStrike, Rect} from "./Marker";
import {Finish, InkSurface} from "./Texture";
import {C, F, clamp01, ease, inOut, outBack, outCubic, outQuint, shake, spr, step} from "./tokens";
import {DOCS} from "./AsianPaintsDocs";

/**
 * In-shot "beat moves" (motion gate, 22 Oct): besides the kit's opening settle (camI), every shot gets a camera move about
 * every 2.2 s: a 1 s push (+16%), a lateral glide (260 px) or a pull-out (-12%), chosen per shot and alternating, so the
 * film has steady in-shot motion without whip-pan noise. Moves accumulate gently and stay inside the paper bleed.
 */
export const beatMove = (f: number, d: number, seed: string, cam: Cam, glide = true, amp = 1): Cam => {
  const every = 60, first = 30, dur = 18;
  let s = cam.s, x = cam.x, y = cam.y, side = random("bs" + seed) < 0.5 ? -1 : 1;
  const pat = glide ? ["g", "p", "g", "o"] : ["p", "o"];
  const k0 = Math.floor(random("bk" + seed) * pat.length);
  for (let i = 0, t0 = first; t0 < d - 10; i++, t0 += every) {
    const m = ease(f, t0, t0 + dur, inOut);
    if (m <= 0) break;
    const kind = pat[(k0 + i) % pat.length];
    if (kind === "p") s *= 1 + 0.15 * amp * m;   // kotakq2: gentler than swiggyq2 (0.22 / 0.18 / 270 px) so edges stay in frame
    else if (kind === "o") s *= 1 - 0.11 * amp * m;
    else { x += side * 160 * m / s; y += (random("by" + seed + i) - 0.5) * 120 * m / s; side = -side; }
  }
  return {...cam, s, x, y};
};
/**
 * marutiq2 v2 (28 Oct, after AK: "frames go out, can't read"): the camera never glides or zooms in on text any more. Every shot is still for its first
 * 55% (at least 1.4 s), then ONE gentle move (push to +3.5% or pull to -3%) over the rest of the shot, which ends under the next transition. All content
 * is laid out inside x 140..1780, y 80..1000 so even the +3.5% push keeps it inside the 5% safe area (96 px / 54 px).
 */
export const calmCam = (f: number, d: number, seed: string, amp = 1): Cam => {
  const m0 = Math.max(42, d * 0.55), push = random("cc" + seed) < 0.6;
  const e = d - m0 > 14 ? ease(f, m0, d, inOut) : 0;
  return {s: 1 + (push ? 0.035 : -0.03) * amp * e, x: 960, y: 540};
};
/** content arrives after the transition (v2 motion: it moves between reads, never while a number is being read; settled by tick 23 = 0.77 s after the shot starts) */
export const EnterGroup: React.FC<{f: number; seed: string; children?: React.ReactNode}> = ({f, seed, children}) => {
  const e = 1 - outCubic(clamp01((f - 8) / 17)), k = Math.floor(random("eg" + seed) * 4);
  const dx = k === 0 ? -520 * e : k === 1 ? 520 * e : 0, dy = k === 2 ? 330 * e : k === 3 ? -280 * e : 0;
  return <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(${1 + 0.12 * e})`, opacity: clamp01((f - 3) / 5)}}>{children}</AbsoluteFill>;
};
/** source chip (30 px mono, wraps to two lines); sits on the 5% safe margin */
export const Chip: React.FC<{f: number; text: string; dark?: boolean; pos?: "tl" | "bl"}> = ({f, text, dark, pos = "tl"}) => {
  const o = ease(f, 0, 8, outQuint);
  if (o <= 0) return null;
  const place: React.CSSProperties = pos === "tl" ? {left: 96, top: 54} : {left: 96, bottom: 54};
  return (
    <div style={{position: "absolute", ...place, maxWidth: 1480, opacity: o, display: "flex", alignItems: "center", gap: 12, fontFamily: F.mono, fontWeight: 600, fontSize: 28,
      lineHeight: 1.2, letterSpacing: 1, color: dark ? "#E6E0D4" : "#2A2622", textTransform: "uppercase", background: dark ? "rgba(14,14,14,0.82)" : "rgba(246,242,233,0.95)",
      padding: "8px 16px 7px 14px", boxShadow: dark ? undefined : "0 2px 6px rgba(30,20,10,0.15)"}}>
      <div style={{flex: "none", width: 12, height: 12, background: C.highlight, boxShadow: dark ? undefined : "0 0 0 1.5px rgba(0,0,0,0.25)"}}/>
      <div>{text}</div>
    </div>
  );
};
export const Desk: React.FC<{f: number; d: number; cam?: CamKey[]; tone?: "cream" | "kraft" | "ink"; chip?: string; chip2?: string; children?: React.ReactNode; over?: React.ReactNode}> =
  ({f, d, tone = "cream", chip, chip2, children, over}) => {
    const seed = (chip ?? "") + d + tone;
    const c = calmCam(f, d, seed);
    return (
      <AbsoluteFill>
        <Layer cam={c} depth={0.85}><Paper tone={tone === "kraft" ? "kraft" : "cream"} drift={f / Math.max(1, d)}/></Layer>
        <EnterGroup f={f} seed={seed}><Layer cam={c}>{children}</Layer></EnterGroup>
        {over}
        {chip ? <Chip f={f} text={chip}/> : null}
        {chip2 ? <Chip f={f} text={chip2} pos="bl"/> : null}
        <Finish f={f}/>
      </AbsoluteFill>
    );
  };
export const DECK = (p: string) => `Deck · 29 Oct 2026 · slide ${p}`;
export const RESULTS = (p: string) => `Results · 29 Oct 2026 · p.${p}`;
export const RELEASE = (p: string) => `Press release · 29 Oct 2026 · p.${p} of 4`;
export const CALLN = "Call notice · 29 Oct 2026";
export const STANDALONE = "Standalone";
export const DECOR = "Decorative Business (India)";

// ---------------------------------------------------------------------------------------------------
// headline (4 words max): black tape label that pops
// ---------------------------------------------------------------------------------------------------
export const Head: React.FC<{f: number; at: number; text: string; x?: number; y?: number; size?: number; rot?: number; light?: boolean}> =
  ({f, at, text, x = 960, y = 930, size = 66, rot = -2, light}) => (
    <StickerLabel f={f} text={text} x={x} y={Math.min(y, 820)} size={Math.max(size, 66)} rot={rot} dark={!light} enter={{at, mode: "pop", rot0: -8}}/>
  );

// ---------------------------------------------------------------------------------------------------
// black chart frame with a slow camera drift
// ---------------------------------------------------------------------------------------------------
export const Black: React.FC<{f: number; d: number; chip?: string; chip2?: string; children?: React.ReactNode; pull?: boolean}> = ({f, d, chip, chip2, children, pull}) => {
  const c = calmCam(f, d, "blk" + (chip ?? "") + d, 0.6);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <EnterGroup f={f} seed={"b" + (chip ?? "") + d}><Layer cam={c}>{children}</Layer></EnterGroup>
      {chip ? <Chip f={f} text={chip} dark/> : null}
      {chip2 ? <Chip f={f} text={chip2} dark pos="bl"/> : null}
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// the receipt: a till roll that prints line by line; last line = BLINKIT MARGIN ₹0.90 (company's adjusted EBITDA measure)
// ---------------------------------------------------------------------------------------------------
export type RLine = {l: string; r?: string; at: number; big?: boolean; red?: boolean};
export const Receipt: React.FC<{f: number; x: number; y: number; w?: number; lines: RLine[]; head?: string; circleAt?: number; qAt?: number;
  rot?: number; s?: number; enterAt?: number; flickerAt?: number}> =
  ({f, x, y, w = 720, lines, head = "ORDER SLIP", circleAt, qAt, rot = -2, s = 1, enterAt = 0, flickerAt}) => {
    if (f < enterAt) return null;
    const ent = outQuint(clamp01((f - enterAt) / 12));
    const lh = 78, top = 130, h = top + lines.length * lh + 70; s = s * 1.3; y = Math.min(y, 40);
    const jag = Array.from({length: 25}).map((_, i) => `${100 - (i / 24) * 100}% ${i % 2 ? h - 18 : h}px`).join(", ");
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y, width: w, transform: `scale(${s}) translateY(${(1 - ent) * 700}px) rotate(${rot}deg)`,
        transformOrigin: "50% 0", filter: ent < 0.95 ? `blur(${(1 - ent) * 10}px)` : undefined}}>
        <div style={{position: "relative", width: w, height: h, background: "linear-gradient(180deg, #FFFEFA, #F4EFE4)",
          clipPath: `polygon(0 0, 100% 0, ${jag})`, filter: "drop-shadow(0 18px 30px rgba(30,20,10,0.25))", fontFamily: F.mono, color: "#1F1C18"}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 34, textAlign: "center", fontWeight: 700, fontSize: 34, letterSpacing: 6}}>{head}</div>
          <div style={{position: "absolute", left: 34, right: 34, top: 94, borderTop: "3px dashed #8C877F"}}/>
          {lines.map((ln, i) => {
            const p = ease(f, ln.at, ln.at + 6, outCubic);
            if (p <= 0 || (!ln.l && !ln.r)) return null;
            const fl = flickerAt != null && i === lines.length - 1 && f >= flickerAt ? (step(f, 3) % 6 < 3 ? 1 : 0.3) : 1;
            const big = ln.big;
            return (
              <div key={i} style={{position: "absolute", left: 40, right: 40, top: top + i * lh, display: "flex", justifyContent: "space-between",
                alignItems: "baseline", opacity: p * fl, fontSize: big ? 38 : 30, fontWeight: big ? 700 : 500, color: ln.red ? C.markerRed : "#1F1C18",
                borderTop: big ? "4px solid #1F1C18" : undefined, paddingTop: big ? 14 : 0, clipPath: `inset(-20px ${(1 - p) * 100}% -20px 0)`, whiteSpace: "nowrap"}}>
                <span>{ln.l}</span><span style={{fontFamily: F.sans, fontWeight: 800, fontSize: big ? 52 : 34}}>{ln.r}</span>
              </div>
            );
          })}
        </div>
        {circleAt != null ? (
          <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            <MarkerCircle f={f} at={circleAt} rect={[w - 260, top + (lines.length - 1) * lh + 4, 230, 70]} width={9}/>
          </svg>
        ) : null}
        {qAt != null && f >= qAt ? <div style={{position: "absolute", left: w + 10, top: 20, fontFamily: F.marker, fontSize: 200, color: C.markerRed,
          transform: `rotate(10deg) scale(${spr(f, qAt, 10, 200)})`}}>?</div> : null}
      </div>
    );
  };
export const SLIP = (t0: number, t1: number, t2: number): RLine[] => [
  {l: "ORDERS, AFTER DISCOUNTS", r: "₹100.00", at: t0},
  {l: "", r: "", at: t1},
  {l: "BLINKIT MARGIN", r: "₹0.90", at: t2, big: true},
];

// ---------------------------------------------------------------------------------------------------
// the shopping agent: a black arrow cursor (code-drawn), with a tap pulse
// ---------------------------------------------------------------------------------------------------
export const Cursor: React.FC<{f: number; x: number; y: number; s?: number; at?: number; tapAt?: number; rot?: number; label?: string; frozen?: boolean}> =
  ({f, x, y, s = 1, at = 0, tapAt, rot = -8, label, frozen}) => {
    if (f < at) return null;
    const k = spr(f, at, 12, 170);
    const tap = tapAt != null && f >= tapAt ? Math.exp(-(f - tapAt) / 5) * Math.sin((f - tapAt) * 0.9) : 0;
    const ring = tapAt != null && f >= tapAt ? clamp01((f - tapAt) / 14) : 0;
    const bob = frozen ? 0 : Math.sin(f * 0.12) * 6;
    return (
      <div style={{position: "absolute", left: x, top: y + bob, transform: `rotate(${rot}deg) scale(${s * (0.5 + 0.5 * k) * (1 - 0.12 * tap)})`, opacity: clamp01(k * 3),
        transformOrigin: "0 0", filter: frozen ? "grayscale(1) brightness(1.4)" : undefined}}>
        {ring > 0 && ring < 1 ? <div style={{position: "absolute", left: -60 * ring, top: -60 * ring, width: 120 * ring, height: 120 * ring, borderRadius: "50%",
          border: `6px solid ${C.markerRed}`, opacity: 1 - ring}}/> : null}
        <svg width={110} height={160} viewBox="0 0 110 160" style={{overflow: "visible", filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35))"}}>
          <path d="M 4 4 L 4 128 L 34 100 L 54 150 L 76 140 L 56 92 L 98 92 Z" fill={C.ink} stroke={C.white} strokeWidth={7} strokeLinejoin="round"/>
        </svg>
        {label ? <div style={{position: "absolute", left: 90, top: 120, fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2, background: C.ink,
          color: C.white, padding: "6px 12px", whiteSpace: "nowrap", transform: `rotate(${-rot}deg)`}}>{label}</div> : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// extra icons (code-drawn, ink on paper): scooter, shelf, pot, bag, cart, ticket, table, menu, bowl, watch, store
// ---------------------------------------------------------------------------------------------------
export type XIcon = "globe" | "piggy" | "passport" | "scissors" | "magnifier" | "jar" | "scooter" | "shelf" | "pot" | "bag" | "cart" | "ticket" | "table" | "menu" | "bowl" | "watch" | "store" | "shield" | "repeat" | "box" | "truck" | "bus" | "pickup" | "ship" | "car" | "safe" | "handshake" | "scale" | "tyre" | "steel";
export const XI: React.FC<{name: XIcon | IconName; size?: number; color?: string; sw?: number; fill?: string}> = ({name, size = 120, color = C.ink, sw = 7, fill = "none"}) => {
  const P = {fill, stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  const g = (() => {
    switch (name) {
      case "scooter": return <><circle cx={22} cy={74} r={12} {...P}/><circle cx={80} cy={74} r={12} {...P}/><path d="M 22 74 L 46 74 L 60 50 L 74 50 L 80 74 M 60 50 L 54 30 L 66 30" {...P}/><rect x={10} y={40} width={28} height={22} {...P}/></>;
      case "globe": return <><circle cx={50} cy={50} r={38} {...P}/><path d="M 12 50 L 88 50 M 50 12 Q 24 50 50 88 Q 76 50 50 12" {...P}/></>;
      case "piggy": return <><path d="M 16 56 Q 16 32 46 32 L 66 32 Q 86 34 86 54 Q 86 72 70 76 L 70 88 L 56 88 L 56 78 L 40 78 L 40 88 L 26 88 L 26 74 Q 16 68 16 56 Z" {...P}/><path d="M 44 22 L 58 22" {...P}/></>;
      case "passport": return <><rect x={22} y={8} width={56} height={84} rx={5} {...P}/><circle cx={50} cy={42} r={16} {...P}/><path d="M 34 42 L 66 42 M 50 26 Q 40 42 50 58 M 50 26 Q 60 42 50 58 M 34 76 L 66 76" {...P}/></>;
      case "scissors": return <><circle cx={26} cy={26} r={11} {...P}/><circle cx={26} cy={74} r={11} {...P}/><path d="M 35 32 L 90 70 M 35 68 L 90 30" {...P}/></>;
      case "magnifier": return <><circle cx={42} cy={42} r={28} {...P}/><path d="M 62 62 L 90 90" {...P}/></>;
      case "jar": return <><path d="M 24 24 L 76 24 L 80 34 L 80 88 L 20 88 L 20 34 Z M 28 14 L 72 14" {...P}/></>;
      case "shelf": return <><path d="M 12 10 L 12 90 M 88 10 L 88 90 M 12 36 L 88 36 M 12 62 L 88 62 M 12 88 L 88 88" {...P}/><rect x={20} y={18} width={14} height={16} {...P}/><rect x={42} y={22} width={14} height={12} {...P}/><rect x={62} y={44} width={16} height={16} {...P}/><rect x={24} y={70} width={20} height={16} {...P}/></>;
      case "pot": return <><path d="M 16 40 L 84 40 L 78 84 L 22 84 Z" {...P}/><path d="M 8 40 L 92 40 M 40 26 Q 44 16 40 8 M 58 26 Q 62 16 58 8" {...P}/></>;
      case "bag": return <><path d="M 20 34 L 80 34 L 86 90 L 14 90 Z" {...P}/><path d="M 36 34 Q 36 12 50 12 Q 64 12 64 34" {...P}/></>;
      case "cart": return <><path d="M 6 16 L 20 16 L 30 66 L 82 66 L 92 30 L 24 30" {...P}/><circle cx={36} cy={82} r={7} {...P}/><circle cx={76} cy={82} r={7} {...P}/></>;
      case "ticket": return <><path d="M 8 28 L 92 28 L 92 44 Q 82 50 92 56 L 92 72 L 8 72 L 8 56 Q 18 50 8 44 Z" {...P}/><path d="M 64 30 L 64 70" {...P} strokeDasharray="5 6"/></>;
      case "table": return <><path d="M 8 42 L 92 42 M 20 42 L 20 86 M 80 42 L 80 86" {...P}/><path d="M 30 42 L 30 26 L 44 26 L 44 42 M 58 42 L 58 26 L 72 26 L 72 42" {...P}/></>;
      case "menu": return <><rect x={22} y={8} width={56} height={84} rx={4} {...P}/><path d="M 34 28 L 66 28 M 34 44 L 66 44 M 34 60 L 66 60 M 34 76 L 54 76" {...P}/></>;
      case "bowl": return <><path d="M 10 46 L 90 46 Q 86 84 50 86 Q 14 84 10 46 Z" {...P}/><path d="M 34 36 Q 38 26 34 18 M 54 36 Q 58 26 54 18" {...P}/></>;
      case "watch": return <><circle cx={50} cy={54} r={34} {...P}/><path d="M 50 54 L 50 34 M 50 54 L 64 62 M 42 10 L 58 10 M 50 10 L 50 20" {...P}/></>;
      case "store": return <><path d="M 10 40 L 18 14 L 82 14 L 90 40 Z" {...P}/><path d="M 16 40 L 16 88 L 84 88 L 84 40 M 40 88 L 40 60 L 60 60 L 60 88" {...P}/></>;
      case "shield": return <path d="M 50 8 L 86 22 L 86 50 Q 86 78 50 94 Q 14 78 14 50 L 14 22 Z" {...P}/>;
      case "repeat": return <><path d="M 20 50 Q 20 22 50 22 L 76 22 M 66 12 L 78 22 L 66 32 M 80 50 Q 80 78 50 78 L 24 78 M 34 68 L 22 78 L 34 88" {...P}/></>;
      case "box": return <><path d="M 10 30 L 50 12 L 90 30 L 90 76 L 50 94 L 10 76 Z M 10 30 L 50 48 L 90 30 M 50 48 L 50 94" {...P}/></>;
      case "truck": return <><path d="M 4 30 L 60 30 L 60 72 L 4 72 Z M 60 44 L 80 44 L 94 60 L 94 72 L 60 72" {...P}/><circle cx={22} cy={78} r={9} {...P}/><circle cx={78} cy={78} r={9} {...P}/></>;
      case "bus": return <><rect x={6} y={18} width={88} height={56} rx={8} {...P}/><path d="M 6 46 L 94 46 M 28 18 L 28 46 M 50 18 L 50 46 M 72 18 L 72 46" {...P}/><circle cx={26} cy={80} r={8} {...P}/><circle cx={74} cy={80} r={8} {...P}/></>;
      case "pickup": return <><path d="M 4 50 L 40 50 L 40 30 L 66 30 L 80 50 L 96 54 L 96 72 L 4 72 Z" {...P}/><circle cx={24} cy={76} r={9} {...P}/><circle cx={76} cy={76} r={9} {...P}/></>;
      case "ship": return <><path d="M 8 60 L 92 60 L 80 84 L 20 84 Z M 24 60 L 24 36 L 70 36 L 70 60 M 38 36 L 38 22 L 54 22 L 54 36" {...P}/><path d="M 4 92 Q 20 86 34 92 Q 50 98 64 92 Q 80 86 96 92" {...P}/></>;
      case "car": return <><path d="M 6 66 L 6 52 L 22 48 L 34 30 L 66 30 L 80 48 L 94 52 L 94 66 Z" {...P}/><circle cx={26} cy={70} r={9} {...P}/><circle cx={74} cy={70} r={9} {...P}/></>;
      case "safe": return <><rect x={10} y={10} width={80} height={80} rx={6} {...P}/><circle cx={50} cy={50} r={18} {...P}/><path d="M 50 32 L 50 40 M 68 50 L 60 50 M 50 68 L 50 60 M 32 50 L 40 50 M 18 26 L 18 74" {...P}/></>;
      case "handshake": return <><path d="M 4 40 L 22 30 L 42 36 L 58 30 L 78 30 L 96 40 M 22 30 L 22 62 L 40 78 L 52 70 L 62 78 L 78 62 L 78 30 M 42 36 L 34 48 Q 42 54 52 44 L 64 54" {...P}/></>;
      case "scale": return <><path d="M 50 10 L 50 88 M 30 88 L 70 88 M 14 28 L 86 28 M 14 28 L 4 56 L 24 56 Z M 86 28 L 76 56 L 96 56 Z" {...P}/></>;
      case "tyre": return <><circle cx={50} cy={50} r={40} {...P}/><circle cx={50} cy={50} r={18} {...P}/><path d="M 50 10 L 50 32 M 50 68 L 50 90 M 10 50 L 32 50 M 68 50 L 90 50 M 22 22 L 37 37 M 63 63 L 78 78 M 78 22 L 63 37 M 37 63 L 22 78" {...P}/></>;
      case "steel": return <><path d="M 10 34 L 70 34 L 90 22 L 30 22 Z M 10 34 L 10 50 L 70 50 L 70 34 M 70 50 L 90 38 L 90 22 M 10 62 L 70 62 L 90 50 M 10 62 L 10 78 L 70 78 L 70 62 M 70 78 L 90 66 L 90 50" {...P}/></>;
      default: return null;
    }
  })();
  if (!g) return <Icon name={name as IconName} size={size} color={color} sw={sw} fill={fill}/>;
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible", display: "block"}}>{g}</svg>;
};

/** icon on a white disc that pops in */
export const Disc: React.FC<{f: number; at: number; name: XIcon | IconName; x: number; y: number; size?: number; bg?: string; color?: string; rot?: number; dim?: number}> =
  ({f, at, name, x, y, size = 170, bg = C.white, color = C.ink, rot = 0, dim = 0}) => {
    if (f < at) return null;
    const k = spr(f, at, 10, 190);
    return (
      <div style={{position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: bg,
        transform: `rotate(${rot - 14 * (1 - k)}deg) scale(${0.4 + 0.6 * k})`, opacity: clamp01(k * 3) * (1 - dim * 0.6), filter: dim > 0 ? `grayscale(${dim})` : undefined,
        boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 14px 26px rgba(30,20,10,0.25)", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <XI name={name} size={size * 0.6} color={color}/>
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// business card (paper card, icon, name sticker)
// ---------------------------------------------------------------------------------------------------
export const BizCard: React.FC<{f: number; at: number; x: number; y: number; name: string; icon: XIcon | IconName; rot?: number; strikeAt?: number;
  dim?: number; lift?: number; sub?: string; w?: number; tint?: string}> =
  ({f, at, x, y, name, icon, rot = 0, strikeAt, dim = 0, lift = 0, sub, w = 330, tint = "#FBF8F1"}) => {
    if (f < at) return null;
    const k = spr(f, at, 12, 160), ff = step(f, 2);
    const h = w * 1.2;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2 - lift, width: w, height: h, background: tint, opacity: clamp01(k * 3) * (1 - dim * 0.55),
        transform: `translateY(${(1 - k) * -260}px) rotate(${rot + (1 - k) * 12}deg)`, boxShadow: `0 ${4 + lift * 0.1}px 6px rgba(30,20,10,0.18), 0 ${18 + lift * 0.2}px 34px rgba(30,20,10,0.26)`,
        filter: dim > 0 ? `grayscale(${dim})` : undefined}}>
        <div style={{position: "absolute", left: 0, right: 0, top: h * 0.16, display: "flex", justifyContent: "center", transform: `rotate(${Math.sin(ff * 0.05) * 2}deg)`}}>
          <XI name={icon} size={w * 0.5}/></div>
        <div style={{position: "absolute", left: 0, right: 0, top: h * 0.66, textAlign: "center"}}>
          <span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: w * 0.105, letterSpacing: 2, padding: "8px 14px"}}>{name}</span></div>
        {sub ? <div style={{position: "absolute", left: 0, right: 0, top: h * 0.83, textAlign: "center", fontFamily: F.mono, fontSize: w * 0.065, color: C.inkSoft}}>{sub}</div> : null}
        {strikeAt != null ? (
          <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            <MarkerStrike f={f} at={strikeAt} rect={[-20, h * 0.45, w + 40, 20]} width={14}/>
          </svg>
        ) : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// real letter excerpt (cut from the NSE PDF by scripts/voxplus/eternalq2_shot.py)
// ---------------------------------------------------------------------------------------------------
export type DocName = keyof typeof DOCS;
/** kotakq2: world point of a phrase on a Doc placed at (x, y, width, rot), for aiming the camera at it */
export const aimAt = (name: DocName, phrase: string, x = 960, y = 520, width = 1500, rot = -0.8) =>
  docRectCentre({x, y, width, imgW: DOCS[name].w, imgH: DOCS[name].h, rot}, docRects(name, phrase)[0]);
export const docRects = (name: DocName, phrase: string): Rect[] => {
  const r = (DOCS[name].rects as Record<string, number[][]>)[phrase];
  if (!r) throw new Error(`no rect ${String(name)}: ${phrase}`);
  return r as Rect[];
};
export const Doc: React.FC<{f: number; name: DocName; x?: number; y?: number; width?: number; rot?: number; hl?: [string, number][]; circle?: [string, number][];
  enterAt?: number; mode?: "slide-up" | "slide-right" | "slide-left" | "drop" | "flip"; stack?: number; focus?: [string, number]}> =
  ({f, name, x = 960, y = 520, width = 1500, rot = -0.8, hl = [], circle = [], enterAt = 0, mode = "slide-up", stack = 2, focus}) => {
    const d = DOCS[name];
    return (
      <DocPage f={f} src={`kotakq2/docs/${String(name)}.png`} imgW={d.w} imgH={d.h} x={x} y={y} width={width} rot={rot} stack={stack} margin={0.06}
        enter={{at: enterAt, mode}} highlights={hl.map(([p, at]) => ({rects: docRects(name, p), at, dur: 14}))}
        circles={circle.map(([p, at]) => ({rect: docRects(name, p)[0], at}))}
        focus={focus ? {rect: docRects(name, focus[0])[0], at: focus[1]} : undefined}/>
    );
  };

// ---------------------------------------------------------------------------------------------------
// retyped table rows (for scanned results pages and the image annexure): mono rows on a paper card
// ---------------------------------------------------------------------------------------------------
export const RowsCard: React.FC<{f: number; head: string; rows: {l: string; v: string; hl?: number; red?: boolean}[]; x?: number; y?: number; w?: number; enterAt?: number; rot?: number}> =
  ({f, head, rows, x = 960, y = 520, w = 1300, enterAt = 0, rot = -0.6}) => {
    if (f < enterAt) return null;
    w = Math.min(Math.max(w, 1400), 1560); rot = rot * 0.3;
    const p = outQuint(clamp01((f - enterAt) / 12));
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - 60 - rows.length * 45, width: w, transform: `translateY(${(1 - p) * 900}px) rotate(${rot}deg)`,
        background: "#FBF8F1", boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)", padding: "34px 56px 40px"}}>
        <div style={{fontFamily: F.mono, fontSize: 30, letterSpacing: 2, color: C.inkSoft, textTransform: "uppercase", marginBottom: 24}}>{head}</div>
        {rows.map((r, i) => {
          const h = r.hl != null ? ease(f, r.hl, r.hl + 12, inOut) : 0;
          return (
            <div key={i} style={{display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', Courier, monospace", fontWeight: 700, fontSize: 52,
              lineHeight: 1.6, color: r.red ? C.markerRed : "#1A1714", borderBottom: "2px dotted #BDB5A6",
              backgroundImage: `linear-gradient(90deg, ${C.highlight}, ${C.highlight})`, backgroundRepeat: "no-repeat", backgroundSize: `${h * 100}% 70%`, backgroundPosition: "0 60%"}}>
              <span>{r.l}</span><span>{r.v}</span>
            </div>
          );
        })}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// signed bar chart on black (bars below zero in red), values from the ledger only
// ---------------------------------------------------------------------------------------------------
export const Bars: React.FC<{f: number; title: string; source: string; bars: {label: string; v: number; txt: string; at: number; key?: boolean; sub?: string}[];
  max: number; min?: number; box?: {x: number; y: number; w: number; h: number}; bw?: number}> =
  ({f, title, source, bars, max, min = 0, box = {x: 460, y: 300, w: 1000, h: 560}, bw = 260}) => {
    const range = max - min, zeroY = box.y + (max / range) * box.h, k = box.h / range;
    const tp = ease(f, 0, 12, outQuint), slot = box.w / bars.length;
    return (
      <>
        <div style={{position: "absolute", left: 210, top: 120, fontFamily: F.serif, fontSize: 76, color: C.white, opacity: tp, transform: `translateY(${(1 - tp) * 30}px)`}}>{title}</div>
        <div style={{position: "absolute", left: 214, top: 220, fontFamily: F.mono, fontSize: 30, color: "#CFC9BE", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
        <div style={{position: "absolute", left: box.x - 40, top: zeroY - 2, width: box.w + 80, height: 4, background: "rgba(255,255,255,0.75)"}}/>
        {bars.map((b, i) => {
          const g = ease(f, b.at, b.at + 26, (t) => 1 - Math.pow(1 - t, 4));
          const cx = box.x + slot * (i + 0.5), hgt = Math.abs(b.v) * k * g, neg = b.v < 0;
          const lp = ease(f, b.at - 4, b.at + 6, outQuint);
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx - bw / 2, top: neg ? zeroY : zeroY - hgt, width: bw, height: Math.max(3, hgt),
                background: neg ? C.markerRed : b.key ? C.highlightPrint : C.chartBlue}}/>
              <div style={{position: "absolute", left: cx, top: neg ? zeroY - 50 : zeroY + 50, transform: "translate(-50%, -50%)", opacity: lp, fontFamily: F.sans,
                fontWeight: 800, fontSize: 40, color: "#E6E0D4", whiteSpace: "nowrap", letterSpacing: 1}}>{b.label}</div>
              {g > 0.05 ? <div style={{position: "absolute", left: cx, top: neg ? zeroY + hgt + 60 : zeroY - hgt - 60, transform: "translate(-50%, -50%)",
                fontFamily: F.sans, fontWeight: 800, fontSize: b.key ? 76 : 64, color: neg ? "#FF8FA8" : b.key ? C.highlightPrint : C.white, whiteSpace: "nowrap", opacity: clamp01(g * 2)}}>{b.txt}</div> : null}
              {b.sub && g > 0.5 ? <div style={{position: "absolute", left: cx, top: neg ? zeroY + hgt + 120 : zeroY - hgt - 118, transform: "translate(-50%, -50%)",
                fontFamily: F.mono, fontSize: 24, color: "#9C968C", letterSpacing: 2, whiteSpace: "nowrap"}}>{b.sub}</div> : null}
            </React.Fragment>
          );
        })}
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------
// big rupee number (₹ in Inter: DM Serif has no ₹ glyph)
// ---------------------------------------------------------------------------------------------------
export const Rs: React.FC<{f: number; at: number; v: number; x: number; y: number; size?: number; color?: string; suf?: string; pre?: string; dur?: number; dec?: number; sign?: string}> =
  ({f, at, v, x, y, size = 200, color = C.ink, suf = " cr", pre = "₹", dur = 26, dec = 0, sign = ""}) => {
    if (f < at) return null;
    const s = spr(f, at, 11, 200), val = v * ease(f, at, at + dur, (t) => 1 - Math.pow(1 - t, 4));
    const sh = shake(f, at + 5, 7, "rs" + v + x);
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) scale(${1.4 - 0.4 * s})`, opacity: clamp01(s * 3),
        filter: s < 0.8 ? `blur(${((0.8 - s) * 16).toFixed(1)}px)` : undefined, whiteSpace: "nowrap", color, lineHeight: 1, fontVariantNumeric: "tabular-nums"}}>
        <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: size * 0.8}}>{sign}{pre}</span>
        <span style={{fontFamily: F.serif, fontSize: size}}>{val.toLocaleString("en-IN", {minimumFractionDigits: dec, maximumFractionDigits: dec})}</span>
        <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: size * 0.42}}>{suf}</span>
      </div>
    );
  };

/** Plain big serif text (numbers without ₹, percentages). */
export const Big: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number}> =
  ({f, at, text, x, y, size = 200, color = C.ink, rot = 0}) => {
    if (f < at) return null;
    const s = spr(f, at, 11, 200);
    return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.4 - 0.4 * s})`, opacity: clamp01(s * 3),
      filter: s < 0.8 ? `blur(${((0.8 - s) * 16).toFixed(1)}px)` : undefined, fontFamily: F.serif, fontSize: size, color, lineHeight: 1, whiteSpace: "nowrap"}}>{text}</div>;
  };

/** Small caps label. */
export const Lab: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; anchor?: "c" | "l"}> =
  ({f, at, text, x, y, size = 34, color = C.inkSoft, anchor = "c"}) => {
    size = Math.max(size, 46); y = Math.min(y, 860);
    const p = ease(f, at, at + 10, outQuint);
    if (p <= 0) return null;
    return <div style={{position: "absolute", left: x, top: y + (1 - p) * 18, transform: anchor === "c" ? "translate(-50%, -50%)" : "translate(0, -50%)", opacity: p,
      fontFamily: F.sans, fontWeight: 800, fontSize: size, color, letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase"}}>{text}</div>;
  };

// ---------------------------------------------------------------------------------------------------
// store counter (odometer on a paper card)
// ---------------------------------------------------------------------------------------------------
export const Counter: React.FC<{f: number; keys: [number, number][]; x: number; y: number; size?: number; pre?: string; label?: string; dark?: boolean}> =
  ({f, keys, x, y, size = 190, pre = "", label, dark}) => {
    let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
      if (f >= t0) v = v0 + (v1 - v0) * ease(f, t0 + (i === 1 ? 0 : 0), t1, inOut);
    }
    const digits = Math.round(v).toLocaleString("en-IN");
    return (
      <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", textAlign: "center"}}>
        <div style={{display: "inline-flex", gap: 8, background: dark ? "#1C1A17" : C.ink, padding: "18px 28px", boxShadow: "0 16px 30px rgba(0,0,0,0.3)"}}>
          {(pre + digits).split("").map((ch, i) => (
            <div key={i} style={{fontFamily: F.serif, fontSize: size, lineHeight: 1, color: C.white, minWidth: ch === "," ? size * 0.2 : size * 0.56, textAlign: "center",
              background: ch === "," ? "none" : "#2A2723", padding: "6px 4px", fontVariantNumeric: "tabular-nums"}}>{ch}</div>
          ))}
        </div>
        {label ? <div style={{marginTop: 18, fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: dark ? "#CFC9BE" : C.inkSoft}}>{label}</div> : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// 100-square grid (one square = ₹1, or one percent); fill can be fractional
// ---------------------------------------------------------------------------------------------------
export const Squares: React.FC<{f: number; at: number; fill: number; x?: number; y?: number; cell?: number; color?: string; base?: string; per?: number;
  red?: number; redAt?: number; dark?: boolean}> =
  ({f, at, fill, x = 960, y = 540, cell = 62, color = C.highlightPrint, base, per = 0.6, red = 0, redAt = 0, dark = true}) => {
    const w = cell * 10;
    const b = base ?? (dark ? "rgba(255,255,255,0.16)" : "rgba(14,14,14,0.12)");
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - w / 2, width: w, height: w}}>
        {Array.from({length: 100}).map((_, i) => {
          const col = i % 10, row = Math.floor(i / 10);
          const pop = spr(f, at + (row + col) * 0.5, 12, 220);
          const on = clamp01((f - at - 12 - i * per) / 4);
          const part = clamp01(fill - i) * on;
          const isRed = red > 0 && i >= 100 - red;
          const rp = isRed ? clamp01((f - redAt) / 6) : 0;
          return (
            <div key={i} style={{position: "absolute", left: col * cell + 4, top: row * cell + 4, width: cell - 8, height: cell - 8, background: b, transform: `scale(${pop})`}}>
              {part > 0 ? <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${part * 100}%`, background: color}}/> : null}
              {rp > 0 ? <div style={{position: "absolute", inset: 0, background: C.markerRed, opacity: rp}}/> : null}
            </div>
          );
        })}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// risk meter on black: LOW / MEDIUM / HIGH bands
// ---------------------------------------------------------------------------------------------------
export const RiskMeter: React.FC<{f: number; at: number; y?: number}> = ({f, at, y = 640}) => {
  const bands = [{t: "LOW", c: "#2E8B57"}, {t: "MEDIUM", c: "#C9A227"}, {t: "HIGH", c: C.markerRed}];
  return (
    <>
      {bands.map((b, i) => {
        const p = ease(f, at + i * 4, at + i * 4 + 12, outQuint);
        return (
          <div key={i} style={{position: "absolute", left: 240 + i * 490, top: y, width: 470, height: 120, background: b.c, opacity: 0.85 * p,
            transform: `scaleX(${p})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.sans, fontWeight: 900, fontSize: 52, letterSpacing: 6, color: C.white}}>{b.t}</div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// chain of icons linked by string (kitchen -> rider -> dark store -> inventory)
// ---------------------------------------------------------------------------------------------------
export const Chain: React.FC<{f: number; at: number; items: {icon: XIcon | IconName; label: string}[]; y?: number; x0?: number; x1?: number; per?: number; taut?: number}> =
  ({f, at, items, y = 520, x0 = 330, x1 = 1590, per = 7, taut = 0}) => {
    const n = items.length, xs = items.map((_, i) => x0 + ((x1 - x0) * i) / (n - 1));
    return (
      <>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {xs.slice(0, -1).map((x, i) => {
            const p = ease(f, at + i * per + 6, at + i * per + 16, outCubic);
            const sag = 40 * (1 - taut) + 4 * Math.sin(f * 0.15 + i);
            return <path key={i} d={`M ${x + 95} ${y} Q ${(x + xs[i + 1]) / 2} ${y + sag} ${xs[i + 1] - 95} ${y}`} fill="none" stroke="#B8432F" strokeWidth={7}
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>;
          })}
        </svg>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <Disc f={f} at={at + i * per} name={it.icon} x={xs[i]} y={y} size={180}/>
            <Lab f={f} at={at + i * per + 4} text={it.label} x={xs[i]} y={y + 140} size={32}/>
          </React.Fragment>
        ))}
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------
// India outline dots (illustration only: never real store locations)
// ---------------------------------------------------------------------------------------------------
export const randDots = (seed: string, n: number, box: [number, number, number, number]) =>
  Array.from({length: n}).map((_, i) => [box[0] + random(seed + "x" + i) * box[2], box[1] + random(seed + "y" + i) * box[3]] as [number, number]);

export {outBack};
