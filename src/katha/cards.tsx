// Verse and title cards for the Katha look: gold Sanskrit with a soft glow over a slow line-mandala, the transliteration in
// Cormorant italic, the English in Cormorant with key words in gold, ornamental rules with a lotus bud. Text comes from data.
import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, SA, EN, CAPS, Finish} from "./look";
import {clamp01} from "./geom";

const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
export const Mandala: React.FC<{cx: number; cy: number; R: number; rot: number; op: number}> = ({cx, cy, R, rot, op}) => (
  <g opacity={op} transform={`translate(${cx} ${cy}) rotate(${rot})`} fill="none" stroke={K.gold} strokeWidth={1.2}>
    {([[0.18, 8, 0.5], [0.34, 16, 0.42], [0.52, 24, 0.36], [0.72, 32, 0.3], [0.94, 48, 0.24]] as number[][]).map(([rr, k, h], j) => {
      const r = rr * R;
      return <g key={j}><circle r={r * (1 - h * 0.9)}/>{Array.from({length: k}, (_, i) =>
        <path key={i} d={`M 0 ${-r * (1 - h)} C ${r * h * 0.55} ${-r * (1 - h * 0.4)} ${r * h * 0.3} ${-r} 0 ${-r} C ${-r * h * 0.3} ${-r} ${-r * h * 0.55} ${-r * (1 - h * 0.4)} 0 ${-r * (1 - h)} Z`} transform={`rotate(${(i / k) * 360 + (j % 2 ? 180 / k : 0)})`}/>)}</g>;
    })}
    <circle r={R}/><circle r={R * 1.03} strokeDasharray="2 7"/>
  </g>
);
export const Rule: React.FC<{y: number; w: number; x?: number; op?: number}> = ({y, w, x = W / 2, op = 1}) => (
  <g opacity={op}>
    <rect x={x - w / 2} y={y - 0.75} width={w} height={1.5} fill="url(#k-fade-h)"/>
    <path d={`M ${x} ${y - 16} C ${x + 8} ${y - 8} ${x + 8} ${y + 2} ${x} ${y + 8} C ${x - 8} ${y + 2} ${x - 8} ${y - 8} ${x} ${y - 16} Z`} fill="url(#k-gold)"/>
    <path d={`M ${x} ${y + 6} C ${x + 14} ${y} ${x + 26} ${y - 4} ${x + 36} ${y - 2} C ${x + 26} ${y + 6} ${x + 14} ${y + 8} ${x} ${y + 6} Z M ${x} ${y + 6} C ${x - 14} ${y} ${x - 26} ${y - 4} ${x - 36} ${y - 2} C ${x - 26} ${y + 6} ${x - 14} ${y + 8} ${x} ${y + 6} Z`} fill="url(#k-gold)" opacity={0.85}/>
    {[-1, 1].map((s) => <circle key={s} cx={x + s * w * 0.21} cy={y} r={2.6} fill={K.gold}/>)}
  </g>
);
// Greedy wrap on an estimated glyph width.
export const wrap = (text: string, size: number, maxW: number, k = 0.44): string[] => {
  const out: string[] = []; let line = "";
  for (const w of String(text).split(/\s+/).filter(Boolean)) { const t = line ? `${line} ${w}` : w; if (t.length * size * k > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line);
  return out;
};
const roman = (n: number) => { const r: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; for (const [v, c] of r) while (n >= v) { s += c; n -= v; } return s; };
const DEVA_DIGITS = "०१२३४५६७८९";
export const devaNum = (n: number) => String(n).split("").map((d) => DEVA_DIGITS[+d]).join("");
// s: {ref "gita:2.47", sa [lines], tr [lines], en, src, hl [words], sa_hl [Sanskrit phrases], lines ["sa","tr","en"]}.
// enAt: the frame the English begins (its words light up as spoken, the hl words in gold). lines picks what the card
// shows (13.28 shows only the English: its Sanskrit numbering differs from the 700-verse editions). sa_hl lights a
// phrase of the Sanskrit a beat after it appears, the rest of the verse dimming a little around it.
export const VerseCard: React.FC<{s: any; n: number; enAt?: number; speakEnd?: number}> = ({s, n, enAt = 18, speakEnd}) => {
  const f = useCurrentFrame();
  const [ch, vs] = String(s.ref || "").replace(/^gita:/, "").split(".").map(Number);
  const show: string[] = Array.isArray(s.lines) && s.lines.length ? s.lines : ["sa", "tr", "en"];
  const sa: string[] = show.includes("sa") ? (s.sa || []).map((l: string) => l.replace(/।।\s*\d+\.\d+\s*।?\s*$/, "").replace(/।।[^।]*।।\s*$/, "॥").replace(/।।\s*$/, "॥").trim()).filter(Boolean) : [];
  const tr: string[] = show.includes("tr") ? s.tr || [] : [];
  const enText = show.includes("en") ? String(s.en || "") : "";
  const hl: string[] = (s.hl || []).map((w: string) => w.toLowerCase());
  const saHl: string[] = Array.isArray(s.sa_hl) ? s.sa_hl.map(String) : [];
  // fit: Sanskrit, transliteration, rule, English and source between y = 250 and y = 1010, shrinking together if needed
  let k = 1, saSize = 0, trSize = 0, enSize = 0, en: string[] = [], total = 0;
  const midRule = (sa.length || tr.length) && enText ? 86 : 30;
  for (let pass = 0; pass < 6; pass++) {
    saSize = (sa.some((l) => l.length > 38) ? 62 : 72) * k; trSize = 30 * k; enSize = (enText.length > 190 ? 44 : sa.length || tr.length ? 50 : 58) * k;
    en = enText ? wrap(enText, enSize, sa.length || tr.length ? 1400 : 1300) : [];
    total = sa.length * saSize * 1.3 + tr.length * trSize * 1.32 + midRule + en.length * enSize * 1.25 + 40;
    if (total <= 740 || k < 0.62) break; k *= 0.92;
  }
  const a0 = ease(f, 0, 24), a1 = ease(f, 10, 30), a2 = ease(f, sa.length || tr.length ? enAt : 14, 26);
  const hlOn = saHl.length ? ease(f, 40, 30) : 0;
  const words = en.join(" ").split(" "), end = speakEnd ?? n - 30;
  const lit = (gi: number) => clamp01((f - enAt - ((end - enAt) * gi) / Math.max(1, words.length)) / 12);
  let gi = 0;
  const yS = 250 + (740 - total) / 2 + saSize, yT = sa.length ? yS + (sa.length - 1) * saSize * 1.3 + trSize * 2.1 : 250 + (740 - total) / 2 + trSize;
  const yR2 = tr.length ? yT + (tr.length - 1) * trSize * 1.32 + 40 : sa.length ? yS + (sa.length - 1) * saSize * 1.3 + 44 : 250 + (740 - total) / 2;
  const yE = yR2 + (sa.length || tr.length ? 30 : 0) + enSize, ySrc = yE + (en.length - 1) * enSize * 1.25 + 56;
  // a Sanskrit line split into [text, lit] runs at the sa_hl phrases (whole words, so no vowel sign is cut off)
  const saRuns = (l: string): [string, boolean][] => {
    const out: [string, boolean][] = []; let rest = l;
    while (rest) {
      const hit = saHl.map((h) => [rest.indexOf(h), h] as [number, string]).filter(([i]) => i >= 0).sort((p, q) => p[0] - q[0])[0];
      if (!hit) { out.push([rest, false]); break; }
      if (hit[0] > 0) out.push([rest.slice(0, hit[0]), false]);
      out.push([hit[1], true]); rest = rest.slice(hit[0] + hit[1].length);
    }
    return out;
  };
  return (
    <g>
      <defs><radialGradient id="vc-bg" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stopColor="#2A1F4A"/><stop offset="0.55" stopColor={K.indigo}/><stop offset="1" stopColor={K.night}/></radialGradient>
        <radialGradient id="vc-glow"><stop offset="0" stopColor="#F2C46A" stopOpacity={0.22}/><stop offset="1" stopColor="#F2C46A" stopOpacity={0}/></radialGradient>
        <linearGradient id="vc-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFBEA"/><stop offset="0.5" stopColor="#FFE3A3"/><stop offset="1" stopColor="#E8B65A"/></linearGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#vc-bg)"/>
      <Mandala cx={W / 2} cy={H / 2} R={560} rot={7 + f * 0.02} op={0.1 * a0}/>
      <ellipse cx={W / 2} cy={H / 2 - 20} rx={800} ry={360} fill="url(#vc-glow)" opacity={a0}/>
      <g opacity={a0}>
        <text x={W / 2} y={170} textAnchor="middle" fontFamily={CAPS} fontSize={26} letterSpacing={8} fill="#D9B26A">{`BHAGAVAD GĪTĀ  ·  ${roman(ch || 0)} · ${vs || ""}`}</text>
        <Rule y={210} w={520}/>
      </g>
      <g opacity={a1} transform={`translate(0 ${(1 - a1) * 10})`}>
        {sa.map((l, i) => {
          const runs = saRuns(l), any = runs.some(([, h]) => h);
          return <g key={i}>
            <text x={W / 2} y={yS + i * saSize * 1.3} textAnchor="middle" fontFamily={SA} fontSize={saSize} fill="url(#k-gold)" filter="url(#k-soft)">
              {runs.map(([t, h], j) => <tspan key={j} opacity={h ? 1 : 1 - 0.38 * hlOn}>{t}</tspan>)}
            </text>
            {any && hlOn > 0 ? <text x={W / 2} y={yS + i * saSize * 1.3} textAnchor="middle" fontFamily={SA} fontSize={saSize} fill="url(#vc-hot)" filter="url(#k-soft)" opacity={hlOn}>
              {runs.map(([t, h], j) => <tspan key={j} fillOpacity={h ? 1 : 0}>{t}</tspan>)}
            </text> : null}
          </g>;
        })}
        {tr.map((l, i) => <text key={i} x={W / 2} y={yT + i * trSize * 1.32} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontWeight={500} fontSize={trSize} fill={K.parchment}>{l}</text>)}
        {(sa.length || tr.length) && en.length ? <Rule y={yR2} w={360}/> : null}
      </g>
      <g opacity={a2}>
        {en.map((l, i) => <text key={i} x={W / 2} y={yE + i * enSize * 1.25} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={enSize}>
          {l.split(" ").map((w, j) => { const g = gi++, on = lit(g), key = w.toLowerCase().replace(/[^a-z']/g, ""); const gold = hl.includes(key);
            return <tspan key={j} fill={gold ? K.gold : K.cream} opacity={0.35 + 0.65 * on}>{(j ? " " : "") + w}</tspan>; })}
        </text>)}
      </g>
      {s.src ? <text x={W / 2} y={Math.min(H - 60, ySrc)} textAnchor="middle" fontFamily={CAPS} fontSize={18} letterSpacing={5} fill="#8F7E5E" opacity={a2}>{String(s.src).toUpperCase()}</text> : null}
      <Finish f={f}/>
    </g>
  );
};
const NUMBER_WORDS = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN"];
// Chapter title: the chapter number in Devanagari, large and gold over a turning mandala; CHAPTER N; the English name; the
// Sanskrit name, and under it its transliteration in small capitals. The film's main title (chapter 0) puts the Sanskrit
// title in the mandala where a chapter has its numeral, then s.kicker (THE BHAGAVAD GITA: the transliteration's English
// form, so it is not repeated), the English name and s.line.
export const TitleCard: React.FC<{s: any; n: number}> = ({s, n}) => {
  const f = useCurrentFrame();
  const a = ease(f, 0, 30), b = ease(f, 14, 30), c = ease(f, 26, 30), d = ease(f, 40, 30), out = 1 - ease(f, n - 20, 20);
  const num = Number(s.chapter || 0), chap = num > 0 && num < 19;
  const main = !chap && !!s.sanskrit;                     // the main title: the Sanskrit takes the numeral's place
  const tl = String(s.transliteration || "");
  return (
    <g opacity={out}>
      <defs><radialGradient id="tc-bg" cx="0.5" cy="0.42" r="0.8"><stop offset="0" stopColor="#2B1E46"/><stop offset="0.6" stopColor={K.indigo}/><stop offset="1" stopColor={K.night}/></radialGradient></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#tc-bg)"/>
      <Mandala cx={W / 2} cy={420} R={330} rot={f * 0.05} op={0.18 * a}/>
      {chap ? <text x={W / 2} y={488} textAnchor="middle" fontFamily={SA} fontSize={300} fill="url(#k-gold)" filter="url(#k-bloom)" opacity={a}>{devaNum(num)}</text> : null}
      {main ? <text x={W / 2} y={462} textAnchor="middle" fontFamily={SA} fontSize={118} fill="url(#k-gold)" filter="url(#k-bloom)" opacity={a}>{s.sanskrit}</text> : null}
      <text x={W / 2} y={chap || main ? 650 : 520} textAnchor="middle" fontFamily={CAPS} fontSize={28} letterSpacing={12} fill="#D9B26A" opacity={b}>{s.kicker || (chap ? `CHAPTER ${NUMBER_WORDS[num]}` : "")}</text>
      <text x={W / 2} y={chap || main ? 740 : 620} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontWeight={500} fontSize={74} fill={K.cream} opacity={b}>{s.name || ""}</text>
      <Rule y={chap || main ? 790 : 670} w={420} op={c}/>
      {s.sanskrit && !main ? <text x={W / 2} y={chap ? 860 : 740} textAnchor="middle" fontFamily={SA} fontSize={44} fill="url(#k-gold)" opacity={c}>{s.sanskrit}</text> : null}
      {s.sanskrit && !main && tl ? <text x={W / 2} y={chap ? 902 : 782} textAnchor="middle" fontFamily={CAPS} fontSize={17} letterSpacing={7} fill="#B89A62" opacity={0.7 * d}>{tl.toUpperCase()}</text> : null}
      {main && s.line ? <text x={W / 2} y={856} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontWeight={500} fontSize={40} fill="#D9B26A" opacity={c}>{s.line}</text> : null}
      <Finish f={f}/>
    </g>
  );
};
