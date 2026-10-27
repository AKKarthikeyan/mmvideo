// Shared scene pieces: the context every device gets, the world layer (surfaces + objects under the camera), the hook's
// claim lines and hero card, and the beat's kicker sign. Words never go in the world layer.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {LookBrand} from "../brands/types";
import {fitCss, fitFont, fitLines, fitSize, measure} from "../shared/fit";
import {shown} from "../shared/lock";
import {plain} from "../shared/text";
import type {LookBeat, LookData, LookNum} from "../shared/types";
import {baseCam, camCss, type Cam} from "./camera";
import {assertContrast, rgba, textOn, type Mat} from "./materials";
import {clamp01, flip} from "./motion";
import type {BeatPlan, Plan} from "./plan";
import {Card, GatedLine, Num, SAFE, Sign, UnitKey, W_SAFE, gateText} from "./props";
import {EyeLevel, STAGE} from "./surfaces";

export type Ctx = {L: LookData; B: LookBrand; P: Plan; M: Mat; b: LookBeat; p: BeatPlan; f: number; hook: boolean};

export const World: React.FC<{ctx: Ctx; cam: Cam; children?: React.ReactNode; blur?: number}> = ({ctx, cam, children, blur = 0}) =>
  <AbsoluteFill style={{transform: camCss(cam), transformOrigin: "0 0", filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
    <EyeLevel M={ctx.M} surface={ctx.P.surface} seed={ctx.L.seed}/>
    {children}
  </AbsoluteFill>;

// x centres for n objects across the safe width
export const slots = (n: number, x0 = SAFE.x0 + 40, x1 = SAFE.x1 - 40) => Array.from({length: n}, (_, i) => x0 + (x1 - x0) * (i + 0.5) / n);

// The kicker of a fact beat on a kraft sign at the top (from kickerF: a kicker holding a digit waits for the lock).
// With a unit key, the sign shares its row with the brass key at the right (the key slides in from its own frame).
export const KickerSign: React.FC<{ctx: Ctx; y?: number; unitKey?: {text: string; at: number}}> = ({ctx, y = 290, unitKey}) => {
  const {b, p, f, B, M} = ctx;
  const kf = fitFont(B.f.mono, 0.06);
  const ks = unitKey ? fitSize(unitKey.text, kf, 300, 26, 18) : 0;
  const kw = unitKey ? measure(unitKey.text, kf, ks) + 36 : 0;
  return <>
    {b.kicker && f >= p.kickerF && <Sign B={B} M={M} text={b.kicker} x={SAFE.x0} y={y} maxW={W_SAFE - (kw ? kw + 24 : 0)}/>}
    {unitKey && f >= unitKey.at && <UnitKey B={B} M={M} text={unitKey.text} x={SAFE.x1 - kw} y={y + 4} vis={clamp01((f - unitKey.at) / 5)} dx={(1 - clamp01((f - unitKey.at) / 8)) * 40}/>}
  </>;
};

// The fact's text line (on a paper strip): its numbers are gated by their own locks.
export const factText = (b: LookBeat) => ({text: b.text ?? "", nums: b.textNums});

// ---------------------------------------------------------------- hook text: claim lines and the hero card
export type HookLayout = {bottom: number; render: (f: number) => React.ReactNode};

const splitHook = (lines: string[], hero: LookNum | null) => {
  const full = lines.join(" ");
  if (!hero) return {a: full, b: ""};
  const star = `*${hero.text}*`;
  let i = full.indexOf(star), len = star.length;
  if (i < 0) { i = full.indexOf(hero.text); len = hero.text.length; }
  if (i < 0) return {a: full, b: ""};
  return {a: full.slice(0, i).trim(), b: full.slice(i + len).trim()};
};

// Greedy wrap, then the narrowest width that keeps the same number of lines (no lone last word).
const balanced = (text: string, font: ReturnType<typeof fitFont>, size: number, width: number, lines: string[]) => {
  if (lines.length < 2) return lines;
  let best = lines;
  for (let w = width - 10; w >= width * 0.5; w -= 10) {
    const t = wrapText(text, font, size, w);
    if (t.length !== lines.length) break;
    best = t;
  }
  return best;
};
const wrapText = (text: string, font: ReturnType<typeof fitFont>, size: number, width: number) => {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const nx = cur ? `${cur} ${w}` : w;
    if (cur && measure(nx, font, size) > width) { out.push(cur); cur = w; } else cur = nx;
  }
  if (cur) out.push(cur);
  return out;
};

// mode "card": the hero on a cream card between the claim lines; "flip": the hero is on the flip stand below the first
// claim line (no card), and the rest of the claim follows under the stand; no hero: the whole claim as a headline.
export const hookLayout = (ctx: Ctx, mode: "card" | "flip" = "card"): HookLayout & {standTop: number; standH: number} => {
  const {b, B, M} = ctx;
  const disp = fitFont(B.f.display), hero = fitFont(B.f.hero), mono = fitFont(B.f.mono);
  const lines = b.lines ?? [];
  const sp = splitHook(lines, b.hero);
  const a = sp.a.replace(/[,;]\s*$/, ""), rest = sp.b.replace(/^[,.;:]+\s*/, "");
  const nums = [...b.tokens.map((t) => t.num).filter((n): n is LookNum => !!n && n !== b.hero), ...b.lineNums];
  const ink = assertContrast(B.c.paper, M.wall, 60, "hook claim"), acc = B.c.accent2Light;
  assertContrast(acc, M.wall, 44, "hook emphasis");
  const blank = rgba(B.c.paper, 0.22);
  const h = b.hero;
  const y0 = 292;
  const A0 = a ? fitLines(plain(a), disp, W_SAFE, h ? 2 : 4, h ? 76 : 88, 44) : {size: 0, lines: [] as string[]};
  const A = {size: A0.size, lines: balanced(plain(a), disp, A0.size, W_SAFE, A0.lines)};
  const aTop = y0;
  const aLh = Math.round(A.size * 1.04);
  let y = y0 + A.lines.length * aLh + (A.lines.length ? 22 : 0);
  // hero card
  const card = mode === "card" && !!h;
  const hs = card ? fitSize(h!.text.slice(h!.qual.length), hero, W_SAFE - 90, 210, 90) : 0;
  const qs = card && h!.qual ? 34 : 0;
  const cardW = card ? Math.min(W_SAFE, measure(h!.text.slice(h!.qual.length), hero, hs) + 80) : 0;
  const cardH = card ? Math.round(hs * 0.96 + 50 + (qs ? qs + 8 : 0)) : 0;
  const cardTop = y;
  const beside = card && cardW <= 440;
  // flip: the stand sits under the first claim, the rest of the claim under the stand
  const nCards = h ? h.digits.replace(/[^0-9]/g, "").length + (h.sign + h.prefix ? 1 : 0) : 0;
  const cw = Math.min(150, Math.floor((W_SAFE - 40 - (nCards - 1) * 10) / Math.max(1, nCards)));
  const standTop = y + 46, standH = mode === "flip" && h ? Math.round(cw * 1.45) + (h.unit.trim() ? 130 : 30) : 0;
  const bx = beside ? SAFE.x0 + cardW + 34 : SAFE.x0, bw = SAFE.x1 - bx;
  const B0 = rest ? fitLines(plain(rest), disp, bw, beside ? 4 : 2, beside ? 60 : 68, 36) : {size: 0, lines: [] as string[]};
  const Bl = {size: B0.size, lines: balanced(plain(rest), disp, B0.size, bw, B0.lines)};
  const bLh = Math.round(Bl.size * 1.06);
  const bTop = mode === "flip" ? standTop + standH + 20 : beside ? cardTop + Math.max(0, (cardH - Bl.lines.length * bLh) / 2) : cardTop + cardH + 24;
  const bottom = mode === "flip" ? standTop - 46 : Math.max(card ? cardTop + cardH : y - 22, bTop + Bl.lines.length * bLh);
  // star marks per wrapped line: re-split the original text by words
  const starWords = (src: string) => {
    let on = false;
    return src.split(/\s+/).filter(Boolean).map((w) => { const s0 = w.startsWith("*"); if (s0) on = true; const hot = on; if (w.replace(/[.,;:!?)]+$/, "").endsWith("*")) on = false; return {w: w.replace(/\*/g, ""), hot}; });
  };
  const rewrap = (src: string, wrapped: string[]) => {
    const ws = starWords(src);
    let k = 0;
    return wrapped.map((ln) => {
      const n = ln.split(/\s+/).filter(Boolean).length;
      const part = ws.slice(k, k + n); k += n;
      let out = "", on = false;
      part.forEach((p, j) => { if (p.hot && !on) { out += (j ? " " : "") + "*"; on = true; } else if (!p.hot && on) { out += "* "; on = false; } else if (j) out += " "; out += p.w; });
      return on ? out + "*" : out;
    });
  };
  const aLines = rewrap(a, A.lines), bLines = rewrap(rest, Bl.lines);
  return {bottom, standTop, standH, render: (f) => {
    const fl = h ? flip(f, h.lockF, 8) : {deg: 0, front: true};
    return <>
      <div style={{position: "absolute", left: SAFE.x0, top: aTop, width: W_SAFE, textShadow: `0 3px 12px ${rgba(B.c.ink, 0.6)}`}}>
        {aLines.map((l, i) => <GatedLine key={i} line={l} nums={nums} f={f} font={disp} size={A.size} ink={ink} acc={acc} blank={blank}/>)}
      </div>
      {card && <div style={{position: "absolute", left: SAFE.x0, top: cardTop, width: cardW, height: cardH, transformOrigin: "50% 50%",
        transform: `perspective(1600px) rotate(-3deg) rotateY(${fl.deg}deg)`}}>
        <Card M={M} x={0} y={0} w={cardW} h={cardH} rot={0} bg={fl.front ? B.c.paper : M.kraft}>
          {fl.front ? <div style={{position: "absolute", left: 40, top: 22}}>
            {h!.qual && <div style={{...fitCss(mono, qs), color: assertContrast(B.c.accent, B.c.paper, qs, "hook qualifier"), lineHeight: 1, marginBottom: 8}}>{h!.qual.trim().toUpperCase()}</div>}
            <Num n={{...h!, text: h!.text.slice(h!.qual.length)}} f={f} font={hero} size={hs} color={assertContrast(B.c.ink, B.c.paper, hs, "hook hero")} blank={rgba(B.c.ink, 0.15)} where="hook card"/>
          </div> : <div style={{position: "absolute", inset: 18, border: `3px dashed ${M.kraftDark}`, borderRadius: 4, transform: "scaleX(-1)"}}/>}
        </Card>
      </div>}
      {bLines.length > 0 && <div style={{position: "absolute", left: bx, top: bTop, width: bw, textShadow: `0 3px 12px ${rgba(B.c.ink, 0.6)}`}}>
        {bLines.map((l, i) => <GatedLine key={i} line={l} nums={nums} f={f} font={disp} size={Bl.size} ink={ink} acc={acc} blank={blank} lh={1.06}/>)}
      </div>}
    </>;
  }};
};

// The camera framing for a hook: the stage pulled back so the tallest object sits under the hook text.
export const hookCam = (textBottom: number, objH: number): Cam => {
  const room = STAGE.base - (textBottom + 46);
  const s = Math.max(0.5, Math.min(1.35, room / Math.max(1, objH)));
  return baseCam(s);
};

// A text strip on paper (the fact's text), gated by its numbers.
export const TextStrip: React.FC<{ctx: Ctx; x: number; y: number; w: number; at: number; size?: number; bg?: string; lines?: number}> = ({ctx, x, y, w, at, size = 34, bg, lines = 2}) => {
  const {b, f, B, M} = ctx;
  const t = b.text ?? "";
  if (!t || f < at) return null;
  const font = fitFont(B.f.body);
  const L2 = fitLines(t, font, w - 8, lines, size, 22);
  const vis = clamp01((f - at) / 4);
  const ground = bg ?? M.paper;
  const ink = textOn(B, ground, L2.size, "text strip");
  return <div style={{position: "absolute", left: x, top: y, width: w, opacity: vis}}>
    {L2.lines.map((l, i) => <GatedLine key={i} line={l} nums={b.textNums} f={f} font={font} size={L2.size} ink={ink} acc={ink} blank={rgba(ink, 0.2)} lh={1.18}/>)}
  </div>;
};

export const gated = (s: string, f: number, at: number) => gateText(s, f, at);
export const isShown = shown;
export {fitCss, fitFont, fitSize, measure};

// The card's sub in the text-led cut (no narration), on a small kraft note; its digits wait for the beat's lock.
export const SubNote: React.FC<{ctx: Ctx; x: number; y: number; w: number}> = ({ctx, x, y, w}) => {
  const {L, b, f, B, M} = ctx;
  if (!L.textLed || !b.subShown || f < b.lockF + 6) return null;
  const font = fitFont(B.f.body);
  const S = fitLines(b.subShown, font, w - 28, 3, 26, 18);
  return <div style={{position: "absolute", left: x, top: y, width: w, padding: "10px 14px", background: M.kraft, transform: "rotate(-1deg)", boxShadow: `5px 8px 12px ${rgba(M.shadow, 0.45)}`}}>
    {S.lines.map((l, i) => <div key={i} style={{...fitCss(font, S.size), fontWeight: 500, color: assertContrast(B.c.ink, M.kraft, S.size, "sub note"), lineHeight: 1.25}}>{l}</div>)}
  </div>;
};
