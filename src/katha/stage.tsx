// The stage every Katha scene is built on (21 Oct 2026): the full-frame SVG with the shared defs, a slow camera push,
// film grain and vignette on top; plus two common layers, a flock of birds and an out-of-focus foreground.
// 22 Oct 2026 (film engine pass): Frame takes vig / grain for the finish and an overlay slot outside the push, and Label
// is the one rule for words on screen (Devanagari first, English in small caps, one place, revealed on cue).
import React from "react";
import {interpolate} from "remotion";
import {W, H, KathaDefs, Finish, SA, CAPS} from "./look";
import {Bird} from "./sil";
import {rnd} from "./geom";

export type SceneP = {s: any; n: number};
export const push = (f: number, n: number, from = 1, to = 1.05) => interpolate(f, [0, Math.max(1, n)], [from, to], {extrapolateRight: "clamp"});
// children: the shot (inside the push). overlay: what must not move with the camera (words, a Label); it sits above the
// shot and under the grain. vig / grain: the finish (vig 1 = the house vignette; lower it when a bright light sits at the
// frame's edge so the corner does not go muddy; grain 0.06 = the house grain).
export const Frame: React.FC<{children: React.ReactNode; f: number; zoom?: number; cx?: number; cy?: number; vig?: number; grain?: number; overlay?: React.ReactNode}> =
  ({children, f, zoom = 1, cx = W / 2, cy = H / 2, vig = 1, grain = 0.06, overlay}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
    <KathaDefs/>
    <g transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}>{children}</g>
    {overlay ? <g>{overlay}</g> : null}
    <Finish f={f} vig={vig} grain={grain}/>
  </svg>
);

// ---------- Label: the one rule for words on screen ----------
// The Devanagari comes first, in Tiro Devanagari Sanskrit, gold; under it a short rule and the English (or the
// transliteration) in small letter-spaced Cinzel capitals. One style, one place (LABEL: upper left, under the lamps row
// and clear of the captions), revealed only on cue: at frame `at` a soft edge of light wipes the Devanagari in from the
// left, the English follows 12 frames later; both fade away over the 12 frames before `until`. Put it in Frame's overlay
// slot (or any unzoomed layer) so the camera push never scales it. x / y / anchor move it only to tag a thing in the shot.
// hl: a fragment of the Devanagari to light (widened to whole syllables so no vowel sign is cut from its consonant).
// ink "dark": deep indigo letters for a frame that is nearly white (the thousand suns).
export const LABEL = {x: 112, y: 206, size: 46, gap: 38};
const DEVA_MARK = /[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962\u0963\u200C\u200D]/;
const VIRAMA = "\u094D";
// Split a Devanagari string into [text, lit] runs around every occurrence of hl, widened to whole aksharas.
export const devaRuns = (text: string, hl?: string): [string, boolean][] => {
  if (!hl || !text.includes(hl)) return [[text, false]];
  const lit = new Array(text.length).fill(false);
  for (let i = text.indexOf(hl); i >= 0; i = text.indexOf(hl, i + 1)) {
    let a = i, b = i + hl.length;                              // [a, b)
    while (a > 0 && (DEVA_MARK.test(text[a]) || text[a - 1] === VIRAMA)) a--;
    while (b < text.length && (DEVA_MARK.test(text[b]) || text[b - 1] === VIRAMA)) b++;
    for (let k = a; k < b; k++) lit[k] = true;
  }
  const out: [string, boolean][] = [];
  for (let k = 0; k < text.length; k++) { if (out.length && out[out.length - 1][1] === lit[k]) out[out.length - 1][0] += text[k]; else out.push([text[k], lit[k]]); }
  return out;
};
const hashId = (t: string) => { let h = 2166136261; for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619); return `lb${(h >>> 0).toString(36)}`; };
export const Label: React.FC<{sa?: string; en?: string; f: number; at?: number; until?: number; hl?: string; x?: number; y?: number; anchor?: "start" | "middle" | "end"; ink?: "light" | "dark"; size?: number}> =
  ({sa = "", en = "", f, at = 0, until = 1e9, hl, x = LABEL.x, y = LABEL.y, anchor = "start", ink = "light", size = LABEL.size}) => {
  if (!sa && !en) return null;
  const cl = (v: number) => Math.max(0, Math.min(1, v));
  const out = 1 - cl((f - (until - 12)) / 12);
  const w1 = cl((f - at) / 26), w2 = cl((f - at - 12) / 22);
  if (w1 <= 0 || out <= 0) return null;
  const id = hashId(`${sa}|${en}|${x}|${y}`);
  const enSize = Math.round(size * 0.34), enY = sa ? y + LABEL.gap : y, ruleY = y + LABEL.gap * 0.42;
  // the Devanagari's width, roughly (for the wipe and the rule): Tiro runs ~0.5 em a character
  const wSa = Math.max(120, sa.length * size * 0.5), wEn = en.length * enSize * 0.95, wMax = Math.max(wSa, wEn);
  const x0 = anchor === "start" ? x : anchor === "middle" ? x - wMax / 2 : x - wMax;
  const edge = (u: number) => x0 - 20 + (wMax + 160) * u;     // the wipe's soft edge, left to right (past the end at u = 1)
  const dark = ink === "dark";
  const fillSa = dark ? "#1B1446" : `url(#${id}g)`, glow = dark ? "#FFF8E6" : "#F2C46A", enCol = dark ? "#2A2058" : "#D9B26A";
  const ease = (u: number) => u * u * (3 - 2 * u);
  const runs = devaRuns(sa, hl), hasHl = runs.some(([, l]) => l);
  const ruleX = anchor === "start" ? x : anchor === "middle" ? x - 60 : x - 120;
  return (
    <g opacity={out}>
      <defs>
        <radialGradient id={`${id}p`}><stop offset="0" stopColor={dark ? "#FFF8EA" : "#07050F"} stopOpacity={dark ? 0.35 : 0.5}/><stop offset="0.6" stopColor={dark ? "#FFF8EA" : "#07050F"} stopOpacity={dark ? 0.16 : 0.24}/><stop offset="1" stopColor={dark ? "#FFF8EA" : "#07050F"} stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF0C2"/><stop offset="0.5" stopColor="#F2C46A"/><stop offset="1" stopColor="#C8963F"/></linearGradient>
        <linearGradient id={`${id}w`} gradientUnits="userSpaceOnUse" x1={edge(ease(w1)) - 60} y1={0} x2={edge(ease(w1)) + 10} y2={0}><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#000"/></linearGradient>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={x0 - 120} y={y - size * 1.5} width={wMax + 320} height={size * 2.4}><rect x={x0 - 120} y={y - size * 1.5} width={wMax + 320} height={size * 2.4} fill={`url(#${id}w)`}/></mask>
      </defs>
      {/* a soft pool of shade (or, for dark ink, of light) behind the words, so a busy shot never swallows them */}
      <ellipse cx={x0 + wMax / 2} cy={(sa ? y - size * 0.3 : y) + (en ? LABEL.gap * 0.5 : 0)} rx={wMax / 2 + 90} ry={size * 0.9 + (en ? 30 : 0)} fill={`url(#${id}p)`} opacity={ease(w1)}/>
      {sa ? <g mask={`url(#${id}m)`}>
        <text x={x} y={y} textAnchor={anchor} fontFamily={SA} fontSize={size} fill="none" stroke={glow} strokeWidth={9} strokeLinejoin="round" opacity={dark ? 0.35 : 0.07}>{sa}</text>
        <text x={x} y={y} textAnchor={anchor} fontFamily={SA} fontSize={size} fill={fillSa}>
          {runs.map(([t, l], i) => <tspan key={i} opacity={hasHl && !l ? 0.62 : 1} fill={l && !dark ? "#FFF3D2" : undefined}>{t}</tspan>)}
        </text>
        {/* a breath of light along the leading edge while it writes */}
        {w1 < 1 ? <rect x={edge(ease(w1)) - 26} y={y - size * 1.05} width={26} height={size * 1.4} fill={dark ? "#FFFFFF" : "#FFE3A3"} opacity={0.18 * Math.sin(Math.PI * w1)}/> : null}
      </g> : null}
      {sa && en ? <rect x={ruleX} y={ruleY - 0.5} width={120 * ease(w2)} height={1} fill={enCol} opacity={0.55 * w2}/> : null}
      {en ? <text x={x} y={enY + enSize * 0.75 + 4} textAnchor={anchor} fontFamily={CAPS} fontSize={enSize} letterSpacing={enSize * 0.32} fill={enCol} opacity={0.85 * w2}>{en.toUpperCase()}</text> : null}
    </g>
  );
};
// Birds crossing the sky in a loose line (storks at dusk, parrots by day).
export const Flock: React.FC<{f: number; kind?: "stork" | "flamingo" | "parrot"; count?: number; y?: number; scale?: number; light: [number, number]; seed?: number}> =
  ({f, kind = "stork", count = 5, y = 260, scale = 0.45, light, seed = 0}) => (
  <g>{Array.from({length: count}, (_, i) => {
    const sp = 1.1 + (i % 3) * 0.12, x = ((f * sp * 1.6 + i * 140 + seed * 400) % (W + 600)) - 300, yy = y + Math.sin(i * 1.7 + seed) * 46 + i * 12;
    return <Bird key={i} kind={kind} x={x} y={yy} scale={scale * (0.8 + (i % 4) * 0.08)} f={f} speed={0.9 + (i % 3) * 0.1} phase={i * 0.23} light={light} fill="#2A1A36"/>;
  })}</g>
);
// A dark foreground ridge with grass, broken spears and arrows, out of focus: depth for the shot.
export const Foreground: React.FC<{f: number; y?: number; side?: "both" | "left" | "right"; blurPx?: number}> = ({f, y = 1000, side = "both", blurPx = 4}) => {
  const parts: string[] = [];
  const tuft = (x: number, yy: number, h: number, i: number) => { for (let k = 0; k < 7; k++) { const a = -1.2 + k * 0.4 + Math.sin(f / 30 + i + k) * 0.05, L = h * (0.6 + rnd(i * 7 + k, 3) * 0.6); parts.push(`M ${x - 3 + k} ${yy} Q ${x + Math.cos(a - 1.57) * L * 0.3 + k} ${yy - L * 0.6} ${x + Math.sin(a) * L} ${yy - L} Q ${x + Math.cos(a - 1.57) * L * 0.3 + k + 3} ${yy - L * 0.55} ${x + 4 + k} ${yy} Z`); } };
  const spear = (x: number, yy: number, L: number, ang: number) => { const r = (ang * Math.PI) / 180, ex = x + Math.sin(r) * L, ey = yy - Math.cos(r) * L; parts.push(`M ${x - 3} ${yy} L ${ex - 2} ${ey} L ${ex + 2} ${ey} L ${x + 3} ${yy} Z`); };
  const L = side !== "right", R = side !== "left";
  if (L) { parts.push(`M -40 ${y - 30} C 200 ${y - 60} 420 ${y - 40} 620 ${y + 10} L 620 1100 L -40 1100 Z`); for (let i = 0; i < 9; i++) tuft(20 + i * 62, y - 34 + i * 4.5, 40 + rnd(i, 5) * 40, i); spear(160, y - 40, 230, -14); spear(300, y - 42, 150, 22); spear(470, y - 20, 120, -32); }
  if (R) { parts.push(`M 1300 ${y + 14} C 1500 ${y - 40} 1720 ${y - 64} 1960 ${y - 36} L 1960 1100 L 1300 1100 Z`); for (let i = 0; i < 9; i++) tuft(1360 + i * 64, y - 10 - i * 5, 40 + rnd(i, 6) * 40, i + 20); spear(1700, y - 54, 260, 12); spear(1560, y - 40, 140, -26); spear(1840, y - 58, 180, 30); }
  return <g opacity={blurPx ? 0.96 : 1}>{parts.map((d, i) => <path key={i} d={d} fill="#08040C"/>)}</g>;
};
