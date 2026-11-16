// ManuscriptVerse (16 Nov 2026, from INNER_CHARIOT_NORTH_STAR.md section 5): the channel's signature verse card. A palm
// leaf in lamplight; the Devanagari writes itself on the leaf in brown ink; a vermilion seal stamps the reference; the
// transliteration, then the English, light up word by word; and the translator's name is shown LARGE, because naming the
// public-domain translator on screen is what no competitor does. Adapted from the palm-leaf card of the 15-minute
// "Gita in Ink" video (MMVideo/src/gita/g15/overlays.tsx, 27 Oct 2026), redrawn in the Katha look (Tiro Devanagari,
// Cormorant, Cinzel; gradients only, no turbulence or large blur filters, so long renders don't drop tiles).
// Two layouts: "wide" (1920 x 1080, long videos) and "tall" (1080 x 1920, Shorts; text kept inside SHORT_SAFE).
// Props come from scripts/katha/verse_props.py, which fills every text field from scripts/dharma/corpus.py: nobody types a
// verse by hand (house rule 2). An English-only card (Griffith's Ramayana, Ganguli) leaves sa and tr empty.
import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from "remotion";
import {K, SA, EN, CAPS, Finish, KathaDefs} from "./look";
import {rnd} from "./geom";

export type MVerse = {
  book: string;             // "BHAGAVAD GITA", "VALMIKI'S RAMAYANA"
  num: string;              // "6.34", "II.11"
  sa?: string[];            // Devanagari lines (cleaned: no speaker tag, no verse marker)
  tr?: string[];            // transliteration lines
  en: string;               // the English exactly as the translator wrote it
  translator: string;       // "AFTER SHRI PUROHIT SWAMI, 1935"
  note?: string;            // small line under the translator, e.g. "EDITED TEXT"
  speaker?: string;         // "ARJUNA", "KRISHNA", "SITA" (shown as "<NAME> SAID")
  speakerSa?: string;       // "अर्जुन उवाच"
  hl?: string[];            // English words to light in gold
};
// YouTube Shorts covers the top (search, title), the right rail (like, comment, share) and the bottom (caption, music).
// Everything that must be read sits inside this box (1080 x 1920 frame).
export const SHORT_SAFE = {left: 70, right: 1080 - 150, top: 230, bottom: 1920 - 430};

const ip = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const INKC = "#3b2412", SEAL = "#a8321c", CORD = "#9c2f1e";

// The leaf outline: long, with rounded, slightly pinched ends.
const leafD = (L: number, R: number, top: number, bot: number) => {
  const mid = (top + bot) / 2, e = Math.min(190, (R - L) * 0.16), c = Math.min(70, e * 0.37);
  return `M ${L} ${mid} C ${L} ${top + 42} ${L + c} ${top + 4} ${L + e} ${top} L ${R - e} ${top} C ${R - c} ${top + 4} ${R} ${top + 42} ${R} ${mid} ` +
    `C ${R} ${bot - 42} ${R - c} ${bot - 4} ${R - e} ${bot} L ${L + e} ${bot} C ${L + c} ${bot - 4} ${L} ${bot - 42} ${L} ${mid} Z`;
};
// Greedy wrap on an estimated glyph width (Cormorant italic ~0.42 em a character).
const wrap = (text: string, size: number, maxW: number, k = 0.42): string[] => {
  const out: string[] = []; let line = "";
  for (const w of text.split(/\s+/).filter(Boolean)) { const t = line ? `${line} ${w}` : w; if (t.length * size * k > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line);
  return out;
};

export const ManuscriptVerse: React.FC<{v: MVerse; layout?: "wide" | "tall"; at?: number; enAt?: number; enEnd?: number; out?: number; finish?: boolean}> =
  ({v, layout = "wide", at = 0, enAt, enEnd, out, finish = true}) => {
  const f = useCurrentFrame() - at;
  const tall = layout === "tall";
  const FW = tall ? 1080 : 1920, FH = tall ? 1920 : 1080;
  // the verse closes with a double danda (the corpus marker "।।6.34।।" is stripped upstream)
  const sa = (v.sa || []).map((l, i, a) => (i === a.length - 1 && !/॥\s*$/.test(l) ? `${l.replace(/[।\s]+$/, "")} ॥` : l)), tr = v.tr || [];
  // geometry
  // tall frames centre on the safe box (YouTube's right rail covers x > 930), not on the frame
  const cx = tall ? (SHORT_SAFE.left + SHORT_SAFE.right) / 2 : FW / 2;
  const L = tall ? cx - 425 : 230, R = tall ? cx + 425 : 1690;
  const saSize = tall ? (sa.some((l) => l.length > 26) ? 44 : 50) : (sa.some((l) => l.length > 40) ? 50 : 58);
  const saLines = tall ? sa.flatMap((l) => (l.length > 30 ? splitHalf(l) : [l])) : sa;
  const lh = saSize * 1.55;
  const leafH = sa.length ? Math.max(tall ? 300 : 250, saLines.length * lh + 110) : 0;
  const top = tall ? 420 : (sa.length > 2 ? 170 : 220), bot = top + leafH, mid = (top + bot) / 2;
  const trSize = tall ? 30 : 32, enSize = tall ? 44 : (v.en.length > 170 ? 42 : 48);
  const enW = tall ? R - L - 70 : 1440;
  const en = wrap(`“${v.en}”`, enSize, enW);
  const trTop = sa.length ? bot + 34 : top;
  const enTop = trTop + (tr.length ? tr.length * trSize * 1.5 + 30 : 0);
  // timing: the leaf in (0-18), the seal (14), Devanagari line by line, then transliteration, then the English
  const lineDur = 26, w0 = 20;
  const trAt = w0 + saLines.length * lineDur + 4;
  const e0 = enAt ?? (sa.length ? trAt + 18 : 16), e1 = enEnd ?? e0 + Math.max(60, v.en.split(" ").length * 9);
  const fadeOut = out !== undefined ? ip(f, out - at, out - at + 12, 1, 0) : 1;
  const a0 = ip(f, 0, 18) * fadeOut;
  const stamp = spring({frame: f - 14, fps: 30, config: {damping: 11, stiffness: 160}});
  const words = en.join(" ").split(" "); let acc = 0; const total = en.join(" ").length;
  const hl = (v.hl || []).map((w) => w.toLowerCase());
  const tTop = enTop + en.length * enSize * 1.3 + (tall ? 40 : 34);
  const transY = tall ? Math.min(tTop, SHORT_SAFE.bottom - 90) : Math.min(tTop, 975);
  return (
    <AbsoluteFill style={{opacity: a0}}>
      {/* the lamplit ground */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at 50% ${tall ? "34%" : "38%"}, #2A1F4A 0%, ${K.indigo} 55%, ${K.night} 100%)`}}/>
      <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`} style={{position: "absolute"}}>
        <KathaDefs/>
        <defs>
          <linearGradient id="mv-leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2E2B4"/><stop offset="0.55" stopColor="#E3CB92"/><stop offset="1" stopColor="#CDB074"/></linearGradient>
          <radialGradient id="mv-lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFD38A" stopOpacity={0.28}/><stop offset="1" stopColor="#FFD38A" stopOpacity={0}/></radialGradient>
        </defs>
        {sa.length ? <g transform={`translate(0 ${(1 - ip(f, 0, 18)) * 22})`}>
          <ellipse cx={cx} cy={mid} rx={(R - L) * 0.62} ry={leafH * 1.1} fill="url(#mv-lamp)"/>
          <path d={leafD(L, R, top, bot)} fill="#000" opacity={0.4} transform="translate(0 16)"/>
          <path d={leafD(L, R, top, bot)} fill="url(#mv-leaf)"/>
          {/* fibres of the leaf, and two ruled lines */}
          {Array.from({length: Math.floor((bot - top - 20) / 15)}).map((_, i) => {
            const y = top + 14 + i * 15, j = rnd(i * 7 + 3);
            return <path key={i} d={`M ${L + 50 + j * 50} ${y} C ${L + (R - L) * 0.35} ${y - 3 + j * 6} ${L + (R - L) * 0.7} ${y + 3} ${R - 50 - rnd(i * 5 + 1) * 50} ${y + 1}`}
              stroke="#A98A4C" strokeWidth={1} opacity={0.22 + 0.12 * j} fill="none"/>;
          })}
          <path d={`M ${L + 130} ${top + 30} L ${R - 130} ${top + 30} M ${L + 130} ${bot - 28} L ${R - 130} ${bot - 28}`} stroke="#8A6A35" strokeWidth={1.4} opacity={0.45}/>
          {/* the string holes and the cord */}
          {[L + 58, R - 58].map((x) => <circle key={x} cx={x} cy={mid} r={9} fill="#2A1C10"/>)}
          <path d={`M ${L + 58} ${mid} C ${L + 42} ${mid + 85} ${L + 16} ${mid + 175} ${L - 24} ${mid + 275}`} stroke={CORD} strokeWidth={4} fill="none" strokeLinecap="round"
            strokeDasharray={320} strokeDashoffset={320 * (1 - ip(f, 2, 24))}/>
        </g> : null}
      </svg>
      {/* speaker */}
      {v.speaker ? <div style={{position: "absolute", left: L + (tall ? 10 : 40), top: (sa.length ? top : enTop) - (tall ? 76 : 70), display: "flex", alignItems: "baseline", gap: 16, opacity: ip(f, 8, 22)}}>
        {v.speakerSa ? <span style={{fontFamily: SA, fontSize: tall ? 40 : 36, color: K.gold}}>{v.speakerSa}</span> : null}
        <span style={{fontFamily: CAPS, fontWeight: 600, fontSize: tall ? 22 : 20, letterSpacing: 5, color: K.cream, opacity: 0.8}}>{v.speaker} SAID</span>
      </div> : null}
      {/* the seal: book and verse */}
      <div style={{position: "absolute", left: tall ? R - 262 : R - 250, top: (sa.length ? top : enTop) - (tall ? 110 : 96),
        transform: `rotate(-6deg) scale(${1.5 - 0.5 * stamp})`, transformOrigin: "50% 50%", opacity: Math.min(1, Math.max(0, stamp) * 1.4),
        border: `4px double ${SEAL}`, borderRadius: 10, padding: "6px 20px", color: SEAL, textAlign: "center", background: "rgba(242,232,208,0.95)"}}>
        <div style={{fontFamily: CAPS, fontWeight: 700, fontSize: tall ? 20 : 19, letterSpacing: 3}}>{v.book}</div>
        <div style={{fontFamily: EN, fontWeight: 700, fontSize: tall ? 58 : 54, lineHeight: 1}}>{v.num}</div>
      </div>
      {/* the Devanagari writes itself, line by line, in brown ink on the leaf */}
      {saLines.map((ln, i) => {
        const p = ip(f, w0 + i * lineDur, w0 + (i + 1) * lineDur - 2), x = -8 + p * 116;
        const m = `linear-gradient(90deg, #000 ${x - 8}%, transparent ${x}%)`;
        return <div key={i} style={{position: "absolute", left: L, width: R - L, top: mid - (saLines.length * lh) / 2 + i * lh + saSize * 0.18, textAlign: "center",
          fontFamily: SA, fontSize: saSize, lineHeight: `${lh}px`, color: INKC, WebkitMaskImage: m, maskImage: m}}>{ln}</div>;
      })}
      {/* transliteration */}
      {tr.length ? <div style={{position: "absolute", left: L, width: R - L, top: trTop, textAlign: "center", fontFamily: EN, fontStyle: "italic", fontWeight: 500,
        fontSize: trSize, lineHeight: 1.5, color: K.parchment, opacity: 0.9 * ip(f, trAt, trAt + 14)}}>{tr.map((l, i) => <div key={i}>{l}</div>)}</div> : null}
      {/* the English, word by word */}
      <div style={{position: "absolute", left: cx - enW / 2, width: enW, top: enTop, textAlign: "center", fontFamily: EN, fontStyle: "italic", fontWeight: 600,
        fontSize: enSize, lineHeight: 1.3, color: K.cream, opacity: ip(f, e0 - 8, e0 + 4)}}>
        {words.map((w, i) => {
          const t = e0 + ((e1 - e0) * acc) / Math.max(1, total); acc += w.length + 1;
          const gold = hl.includes(w.toLowerCase().replace(/[^a-z']/g, ""));
          return <span key={i} style={{opacity: 0.36 + 0.64 * ip(f, t - 2, t + 6), color: gold ? K.gold : undefined}}>{w}{i < words.length - 1 ? " " : ""}</span>;
        })}
      </div>
      {/* the translator, large: our signature */}
      <div style={{position: "absolute", left: cx - 460, width: 920, top: transY, textAlign: "center", opacity: ip(f, e0, e0 + 16)}}>
        <div style={{display: "inline-block", borderTop: `1.5px solid ${K.goldDk}`, paddingTop: 12}}>
          <div style={{fontFamily: CAPS, fontWeight: 600, fontSize: tall ? 30 : 30, letterSpacing: 4, color: K.gold}}>{v.translator}</div>
          {v.note ? <div style={{fontFamily: CAPS, fontSize: tall ? 18 : 17, letterSpacing: 4, color: "#B89A62", marginTop: 6}}>{v.note}</div> : null}
        </div>
      </div>
      {finish ? <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`} style={{position: "absolute"}}><KathaDefs/><Finish f={f + at} w={FW} h={FH}/></svg> : null}
    </AbsoluteFill>
  );
};
// Split a long Devanagari line at the word nearest its middle (Shorts are narrow).
const splitHalf = (l: string): string[] => {
  const ws = l.split(" "); if (ws.length < 2) return [l];
  let best = 1, bd = 1e9, acc = 0;
  for (let i = 1; i < ws.length; i++) { acc += ws[i - 1].length + 1; const d = Math.abs(acc - l.length / 2); if (d < bd) { bd = d; best = i; } }
  return [ws.slice(0, best).join(" "), ws.slice(best).join(" ")];
};
