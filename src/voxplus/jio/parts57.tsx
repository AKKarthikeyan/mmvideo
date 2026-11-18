// Jio film chapters 5 and 7: local helpers (20 Oct 2026). Rupee-safe type (₹ in Inter), bars on black, a hanging tag that
// carries ₹, a paper checklist with marker ticks, and a chapter card that fits long words.
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {camAt, CamKey, Layer} from "../Camera";
import {SourceTag} from "../Cards";
import {Finish, InkSurface, PaperSurface} from "../Texture";
import {StickerLabel} from "../Collage";
import {C, clamp01, ease, F, inOut, lin, outCubic, outQuint, shake, spr} from "../tokens";

/** Serif text where every ₹ is set in Inter (DM Serif Display has no ₹ glyph). */
export const RsNum: React.FC<{text: string; size: number; color?: string; style?: React.CSSProperties}> = ({text, size, color = C.white, style}) => {
  const parts = text.split("₹");
  return (
    <span style={{fontFamily: F.serif, fontSize: size, color, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02, whiteSpace: "nowrap", ...style}}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: size * 0.78, marginRight: size * 0.03, letterSpacing: 0}}>₹</span> : null}{p}
        </React.Fragment>
      ))}
    </span>
  );
};

/** Black shot frame with a camera over a 1920x1080 world. */
export const Black: React.FC<{f: number; cam: CamKey[]; chip?: string; chip2?: string; glow?: number; over?: React.ReactNode; children?: React.ReactNode}> =
  ({f, cam, chip, chip2, glow = 0.08, over, children}) => {
    const c = camAt(f, cam);
    return (
      <AbsoluteFill>
        <InkSurface glow={glow}/>
        <Layer cam={c}>{children}</Layer>
        {over}
        {chip ? <SourceTag f={f} at={0} text={chip} dark/> : null}
        {chip2 ? <SourceTag f={f} at={0} text={chip2} dark pos="bl"/> : null}
        <Finish f={f} dark/>
      </AbsoluteFill>
    );
  };

export type BarSpec = {cx: number; v: number; at: number; dur?: number; color: string; label?: string; fmt?: (n: number) => string; size?: number; key?: boolean};
/** Bars on black (honest scale: height = v * k). Values count up while the bar grows, label under the baseline. */
export const BarsBlack: React.FC<{f: number; bars: BarSpec[]; base: number; k: number; bw?: number; axis?: [number, number]; axisAt?: number}> =
  ({f, bars, base, k, bw = 190, axis, axisAt = 0}) => {
    const ax = ease(f, axisAt, axisAt + 16, outCubic);
    return (
      <>
        {axis ? <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={axis[0]} x2={axis[0] + (axis[1] - axis[0]) * ax} y1={base} y2={base} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/></svg> : null}
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {bars.map((b, i) => {
            const g = lin(f, b.at, b.at + (b.dur ?? 30), 0, 1, (t) => 1 - Math.pow(1 - t, 4));
            if (g <= 0) return null;
            const h = Math.max(3, b.v * k * g);
            return <rect key={i} x={b.cx - bw / 2} y={base - h} width={bw} height={h} fill={b.color}/>;
          })}
        </svg>
        {bars.map((b, i) => {
          const dur = b.dur ?? 30;
          const g = lin(f, b.at, b.at + dur, 0, 1, (t) => 1 - Math.pow(1 - t, 4));
          const lp = ease(f, b.at - 4, b.at + 8, outQuint);
          const pop = spr(f, b.at + dur, 10, 220);
          const sz = b.size ?? 84;
          const fmt = b.fmt ?? ((n: number) => "₹" + Math.round(n));
          const h = Math.max(3, b.v * k * g);
          return (
            <React.Fragment key={i}>
              {b.label ? <div style={{position: "absolute", left: b.cx, top: base + 46, transform: `translate(-50%, -50%) translateY(${(1 - lp) * 14}px)`, opacity: lp,
                fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: "#CFC9BE", whiteSpace: "nowrap", letterSpacing: 2, textTransform: "uppercase"}}>{b.label}</div> : null}
              {g > 0 ? <div style={{position: "absolute", left: b.cx, top: base - h - sz * 0.7, transform: `translate(-50%, -50%) scale(${1 + 0.1 * pop * (1 - clamp01((f - b.at - dur - 8) / 10))})`}}>
                <RsNum text={fmt(b.v * g)} size={sz} color={b.key ? C.highlightPrint : C.white}/></div> : null}
            </React.Fragment>
          );
        })}
      </>
    );
  };

/** Group heading over bars. */
export const GroupName: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string}> = ({f, at, text, x, y, size = 84, color = C.white}) => {
  const p = ease(f, at, at + 12, outQuint);
  if (p <= 0) return null;
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - p) * 30}px)`, opacity: p, fontFamily: F.serif, fontSize: size,
    color, whiteSpace: "nowrap", lineHeight: 1}}>{text}</div>;
};

/** Small grey mono line (units, scope). */
export const Mono: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; align?: "left" | "center"; color?: string}> =
  ({f, at, text, x, y, size = 26, align = "left", color = "#9C968C"}) => {
    const p = ease(f, at, at + 12, outQuint);
    if (p <= 0) return null;
    return <div style={{position: "absolute", left: x, top: y, transform: `translate(${align === "center" ? "-50%" : "0"}, -50%)`, opacity: p, fontFamily: F.mono, fontWeight: 500,
      fontSize: size, color, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap"}}>{text}</div>;
  };

/** Hanging manila tag whose value can contain ₹ (set in Inter). Swings in, then keeps a small sway. */
export const TagRs: React.FC<{f: number; enterAt: number; x: number; y: number; text: string; scale?: number; string?: number; slam?: boolean; color?: string}> =
  ({f, enterAt, x, y, text, scale = 1, string = 230, slam, color = "#2A1C0E"}) => {
    if (f < enterAt) return null;
    const tw = 360 * scale, th = 210 * scale;
    const drop = 1 - spr(f, enterAt, 12, 150);
    const ang = 22 * Math.exp(-(f - enterAt) / 18) * Math.cos((f - enterAt) * 0.22) + 1.2 * Math.sin(f * 0.05 + x);
    const s = slam ? spr(f, enterAt, 9, 260) : 1;
    const sh = slam ? shake(f, enterAt + 2, 9, "tg" + text) : {x: 0, y: 0};
    const fs = (text.length > 5 ? 112 : 132) * scale;
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y - drop * 700 + sh.y, width: 0, height: 0, transform: `rotate(${ang}deg)`, transformOrigin: "0 0"}}>
        <div style={{position: "absolute", left: -2, top: 0, width: 4, height: string, background: "linear-gradient(90deg,#8A7A60,#C8B994,#8A7A60)", borderRadius: 2}}/>
        <div style={{position: "absolute", left: -tw / 2, top: string - 18 * scale, width: tw, height: th}}>
          <div style={{position: "absolute", inset: 0, clipPath: "polygon(16% 0, 84% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)",
            background: "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)", filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35))"}}>
            <div style={{position: "absolute", inset: 10 * scale, clipPath: "polygon(15% 0, 85% 0, 100% 21%, 100% 100%, 0 100%, 0 21%)", border: `${2 * scale}px dashed rgba(120,80,30,0.35)`}}/>
          </div>
          <div style={{position: "absolute", left: tw / 2 - 17 * scale, top: 6 * scale, width: 34 * scale, height: 34 * scale, borderRadius: "50%", background: "#C9A85E",
            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.35)"}}/>
          <div style={{position: "absolute", left: tw / 2 - 8 * scale, top: 15 * scale, width: 16 * scale, height: 16 * scale, borderRadius: "50%", background: "#3B2B18"}}/>
          <div style={{position: "absolute", left: 0, right: 0, top: 46 * scale, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center",
            transform: slam ? `scale(${2.0 - 1.0 * s})` : undefined, opacity: slam ? clamp01(s * 3) : 1}}>
            <RsNum text={text} size={fs} color={color}/>
          </div>
        </div>
      </div>
    );
  };

/** Paper checklist: title in marker, items typed in marker, a hand-drawn tick after each. */
export const Checklist: React.FC<{f: number; x: number; y: number; w?: number; title: string; titleAt: number; rot?: number; rows?: number;
  items: {text: string; at: number; tickAt: number}[]}> = ({f, x, y, w = 1180, title, titleAt, rot = -1.2, rows, items}) => {
  const n = rows ?? items.length, rowH = 150, head = 190, h = head + n * rowH + 50;
  const tp = ease(f, titleAt, titleAt + 14, outQuint);
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`}}>
      <div style={{position: "absolute", inset: 0, background: "#FBF8F1", boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 22px 44px rgba(30,20,10,0.32)",
        backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 ${rowH - 3}px, rgba(70,110,170,0.28) ${rowH - 3}px ${rowH}px)`, backgroundPosition: `0 ${head - 10}px`}}/>
      <div style={{position: "absolute", left: 104, top: 0, bottom: 0, width: 3, background: "rgba(224,36,94,0.35)"}}/>
      <div style={{position: "absolute", left: 56, top: 38, fontFamily: F.serif, fontSize: 84, color: C.ink, opacity: tp, transform: `translateY(${(1 - tp) * 24}px)`, whiteSpace: "nowrap"}}>{title}</div>
      {items.map((it, i) => {
        const wp = ease(f, it.at, it.at + 14, (t) => t);
        const tk = ease(f, it.tickAt, it.tickAt + 8, outCubic);
        const top = head + i * rowH;
        return (
          <React.Fragment key={i}>
            {wp > 0 ? <div style={{position: "absolute", left: 140, top: top + 8, fontFamily: F.marker, fontSize: 82, color: C.ink, whiteSpace: "nowrap", lineHeight: 1.1,
              clipPath: `inset(-10% ${((1 - wp) * 100).toFixed(1)}% -10% -4%)`}}>{it.text}</div> : null}
            {wp > 0 ? <svg width={80} height={80} style={{position: "absolute", left: 38, top: top + 18, overflow: "visible"}}>
              <rect x={4} y={4} width={64} height={64} fill="none" stroke={C.ink} strokeWidth={5} rx={4}/>
              {tk > 0 ? <path d="M 12 38 L 32 58 L 78 -10" fill="none" stroke={C.markerRed} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tk}/> : null}
            </svg> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Chapter card (A01 look: cream, red "Chapter N:", huge serif word, yellow underline) sized so long titles fit. */
export const ChapterCardFit: React.FC<{f: number; n: number; word: string; kicker?: string}> = ({f, n, word, kicker}) => {
  const k = ease(f, 0, 12, outQuint), w = ease(f, 6, 20, outQuint), u = ease(f, 22, 34, inOut);
  const size = Math.min(230, Math.floor(1560 / (word.length * 0.5)));
  const uw = Math.min(900, word.length * size * 0.42);
  return (
    <AbsoluteFill>
      <PaperSurface drift={clamp01(f / 90)}/>
      <AbsoluteFill style={{opacity: 0.11}}>
        {Array.from({length: 40}).map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8), kind = Math.floor(random("ci" + i) * 3);
          return <div key={i} style={{position: "absolute", left: 120 + col * 240 + (row % 2) * 120 - f * 0.8, top: 120 + row * 210 + Math.sin(f * 0.04 + i) * 6, width: 70, height: 70,
            border: `5px solid ${C.ink}`, borderRadius: kind === 0 ? "50%" : kind === 1 ? 8 : "50% 50% 8px 8px", transform: `rotate(${random("cr" + i) * 30 - 15}deg)`}}/>;
        })}
      </AbsoluteFill>
      {kicker ? <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 46, color: C.inkSoft,
        opacity: k}}>{kicker}</div> : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 452, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: C.markerRed,
        textTransform: "uppercase", opacity: k}}>Chapter {n}:</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 510, height: 260, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: size, lineHeight: 1.12, color: C.ink, transform: `translateY(${(1 - w) * 260}px)`, paddingTop: (230 - size) * 0.3}}>{word}</div>
      </div>
      <div style={{position: "absolute", left: 960 - uw / 2, top: 782, width: uw, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%", mixBlendMode: "multiply"}}/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

/** StickerLabel slide-in helper (same grammar as A01's `label`). */
export const lab = (f: number, at: number, text: string, x: number, y: number, o: {dark?: boolean; size?: number; rot?: number; bg?: string; color?: string; pop?: boolean} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 62} dark={o.dark ?? true} rot={o.rot ?? -1.5} bg={o.bg} color={o.color}
    enter={o.pop ? {at, mode: "pop", rot0: -10} : {at, mode: "slide", from: [0, 320], dur: 9}}/>;
