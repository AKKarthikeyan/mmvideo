// Overlays that run across the whole 15-minute video: chapter title cards, movement cards, the palm-leaf verse card,
// captions (OUR NOTE lines in the roman note style), the 18-bead japa mala, the chapter tag and the "also cited" chips.
import React from "react";
import {AbsoluteFill, random, spring} from "remotion";
import {DEVA, SANS, SERIF} from "../fonts";
import {Card, Cue, Defs, EASE, FPS, GOLD, H, INDIGO, INK, NIGHT, NOTE, PAPER, SAFFRON, SEAL, Stroke, TT, W, ip} from "../kit";

export type Theme = "night" | "paper" | "slate";
export const MOVEMENTS = [
  {n: "I", en: "ACTION", deva: "कर्म", iast: "karma", ch: [1, 6]},
  {n: "II", en: "DEVOTION", deva: "भक्ति", iast: "bhakti", ch: [7, 12]},
  {n: "III", en: "KNOWLEDGE", deva: "ज्ञान", iast: "jñāna", ch: [13, 18]},
];
const movementOf = (ch: number) => MOVEMENTS.find((m) => ch >= m.ch[0] && ch <= m.ch[1])!;
const SPEAKER: Record<string, string> = {Krishna: "श्रीभगवानुवाच", Arjuna: "अर्जुन उवाच", Sanjaya: "सञ्जय उवाच", Dhritarashtra: "धृतराष्ट्र उवाच"};
const SPEAKER_EN: Record<string, string> = {Krishna: "KRISHNA SAID", Arjuna: "ARJUNA SAID", Sanjaya: "SANJAYA SAID", Dhritarashtra: "DHRITARASHTRA SAID"};

export const isTitleCue = (c: Cue) => c.kind === "say" && !c.card && c.text.startsWith("Chapter ") && (c.text.match(/\./g) || []).length === 2;
// the spoken reference that ends a card cue ("Verse forty-seven.", "Chapter two, verse ten.", "And at the centre, verse three.")
export const REF_RE = /(Chapter [a-z-]+, verse [a-z-]+\.|Verses? [a-z- ]+\.|verse [a-z-]+\.)$/;
export const refPhrase = (c: Cue) => { const m = c.text.match(REF_RE); if (!m) throw new Error(`no reference in ${c.key}`); return m[1]; };

// ---------- chapter title card
const Frame: React.FC<{p: number}> = ({p}) => {
  const d = "M 120 90 L 1800 90 L 1800 990 L 120 990 Z M 140 110 L 1780 110 L 1780 970 L 140 970 Z";
  const corners = [[140, 110, 1], [1780, 110, -1], [140, 970, 1], [1780, 970, -1]].map(([x, y, sx], i) => {
    const sy = y < 500 ? 1 : -1;
    return `M ${x} ${y + sy * 60} C ${x + sx * 10} ${y + sy * 20} ${x + sx * 20} ${y + sy * 10} ${x + sx * 60} ${y} M ${x + sx * 18} ${y + sy * 18} m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0`;
  }).join(" ");
  return <g><Stroke d={d} p={p} color={GOLD} w={1.6} opacity={0.6}/><Stroke d={corners} p={p} color={GOLD} w={2} opacity={0.8}/></g>;
};
export const ChapterTitle: React.FC<{f: number; c: Cue; T: TT; ch: number}> = ({f, c, T, ch}) => {
  const a = T.s(c.key), b = T.e(c.key) + 22;
  const C = T.D.chapters[String(ch)]; const mv = movementOf(ch);
  const o = ip(f, a - 4, a + 8) * ip(f, b, b + 10, 1, 0);
  const wipe = ip(f, a + 2, a + 26);
  const m = `linear-gradient(90deg, #000 ${-8 + wipe * 116 - 8}%, transparent ${-8 + wipe * 116}%)`;
  const long = C.deva.length > 14;
  return (
    <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse at 50% 45%, ${INDIGO} 0%, ${NIGHT} 80%)`}}>
      <svg width={W} height={H} style={{position: "absolute"}}><Frame p={ip(f, a, a + 30, 0, 1, EASE)}/></svg>
      <div style={{position: "absolute", top: 200, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22,
        letterSpacing: 8, color: GOLD, opacity: 0.9}}>{mv.n} · {mv.en}</div>
      <div style={{position: "absolute", top: 250, width: W, textAlign: "center", fontFamily: DEVA, fontSize: 40, color: SAFFRON}}>{C.ordinal}</div>
      <div style={{position: "absolute", top: 320, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26,
        letterSpacing: 10, color: PAPER, opacity: 0.7}}>CHAPTER {ch}</div>
      <div style={{position: "absolute", top: long ? 390 : 375, width: W, textAlign: "center", fontFamily: DEVA, fontSize: long ? 92 : 112,
        color: PAPER, WebkitMaskImage: m, maskImage: m}}>{C.deva}</div>
      <div style={{position: "absolute", top: 560, width: W, textAlign: "center", fontFamily: SANS, fontStyle: "italic", fontSize: 38,
        color: PAPER, opacity: 0.75 * ip(f, a + 16, a + 28)}}>{C.iast}</div>
      <div style={{position: "absolute", top: 640, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 60, color: PAPER,
        opacity: ip(f, a + 10, a + 22), transform: `translateY(${ip(f, a + 10, a + 24, 14, 0, EASE)}px)`}}>{C.en}</div>
    </AbsoluteFill>
  );
};

// ---------- movement card (map shows all three; ch7 and ch13 open movements II and III)
export const MovementCard: React.FC<{f: number; c: Cue; T: TT; which: number | "all"}> = ({f, c, T, which}) => {
  const a = T.s(c.key), b = T.e(c.key) + 18;
  const o = ip(f, a - 4, a + 8) * ip(f, b, b + 10, 1, 0);
  const show = which === "all" ? [0, 1, 2] : [which];
  return (
    <AbsoluteFill style={{opacity: o, background: `radial-gradient(ellipse at 50% 45%, ${INDIGO} 0%, ${NIGHT} 80%)`}}>
      <div style={{position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 140}}>
        {show.map((i, k) => {
          const M = MOVEMENTS[i]; const at = which === "all" ? T.at(c.key, ["action", "devotion", "knowledge"][i]) : a + 4;
          const p = ip(f, at - 4, at + 10);
          return (
            <div key={i} style={{textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)`, width: which === "all" ? 420 : 900}}>
              <div style={{fontFamily: SERIF, fontSize: which === "all" ? 120 : 180, color: GOLD, lineHeight: 1}}>{M.n}</div>
              <div style={{fontFamily: DEVA, fontSize: which === "all" ? 70 : 110, color: PAPER, marginTop: 10}}>{M.deva}</div>
              <div style={{fontFamily: SANS, fontStyle: "italic", fontSize: 30, color: PAPER, opacity: 0.7}}>{M.iast}</div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: which === "all" ? 30 : 40, letterSpacing: 8, color: SAFFRON, marginTop: 18}}>{M.en}</div>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: PAPER, opacity: 0.6, marginTop: 10}}>
                CHAPTERS {M.ch[0]}–{M.ch[1]}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- the verse card: speaker, palm leaf, Devanagari writes itself, IAST, English read word by word, source seal
const leafD = (L: number, R: number, top: number, bot: number) => {
  const mid = (top + bot) / 2;
  return `M ${L} ${mid} C ${L} ${top + 42} ${L + 70} ${top + 4} ${L + 190} ${top} L ${R - 190} ${top} C ${R - 70} ${top + 4} ${R} ${top + 42} ${R} ${mid} ` +
    `C ${R} ${bot - 42} ${R - 70} ${bot - 4} ${R - 190} ${bot} L ${L + 190} ${bot} C ${L + 70} ${bot - 4} ${L} ${bot - 42} ${L} ${mid} Z`;
};
export const VerseCard: React.FC<{f: number; c: Cue; T: TT}> = ({f, c, T}) => {
  const keys = c.card!.split("+"); const cards: Card[] = keys.map((k) => T.D.cards[k]);
  const deva = cards.flatMap((x) => x.deva), iast = cards.flatMap((x) => x.iast);
  const four = deva.length > 2;
  const inA = T.at(c.key, refPhrase(c)) - 4, refE = T.e(c.key), enK = c.key + "v", enS = T.s(enK), enE = T.e(enK);
  const out = enE + 28;
  const o = ip(f, inA, inA + 10) * ip(f, out, out + 10, 1, 0);
  const lineDur = Math.max(18, (enS - refE - 22) / deva.length);
  const w0 = refE + 6;
  const iastAt = w0 + lineDur * deva.length - 4;
  const top = four ? 160 : 230, bot = four ? 560 : 490, L = 230, R = 1690, mid = (top + bot) / 2;
  const fs = four ? 48 : 56, lh = four ? 84 : 92;
  const stamp = spring({frame: f - (inA + 10), fps: FPS, config: {damping: 11, stiffness: 160}});
  const ref = keys.length > 1 ? `${keys[0]}–${keys[1].split(".")[1]}` : keys[0];
  const sp = cards[0].speaker;
  const en = c.card && T.cue(enK).text;
  const words = en!.split(" "); let acc = 0;
  const iastTop = bot + 26, enTop = iastTop + (four ? 4 * 44 : 2 * 50) + 28;
  const glosses = ["Translation: ours", ...cards.map((x) => x.gloss).filter(Boolean)].join("  ·  ");
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: "rgba(8,10,32,0.9)", backdropFilter: "blur(8px)"}}/>
      <AbsoluteFill style={{transform: `translateY(${(1 - ip(f, inA, inA + 18, 0, 1, EASE)) * 26}px)`}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="vc"/>
          <defs><linearGradient id="leafg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0dfb0"/><stop offset="1" stopColor="#d4b878"/></linearGradient></defs>
          <path d={leafD(L, R, top, bot)} fill="#000" opacity={0.35} transform="translate(0 14)" filter="url(#soft-vc)"/>
          <path d={leafD(L, R, top, bot)} fill="url(#leafg)" filter="url(#ink-vc)"/>
          {Array.from({length: Math.round((bot - top) / 17)}).map((_, i) => (
            <path key={i} d={`M ${290 + random(`fa${i}`) * 60} ${top + 16 + i * 17} C 700 ${top + 12 + i * 17 + random(`fb${i}`) * 6} 1200 ${top + 18 + i * 17} ${1640 - random(`fc${i}`) * 60} ${top + 16 + i * 17}`}
              stroke="#b0904f" strokeWidth={1} opacity={0.26} fill="none"/>
          ))}
          <path d={`M 380 ${top + 32} L 1540 ${top + 32} M 380 ${bot - 28} L 1540 ${bot - 28}`} stroke="#8a6a35" strokeWidth={1.4} opacity={0.5}/>
          <circle cx={288} cy={mid} r={9} fill="#2a1c10"/><circle cx={1632} cy={mid} r={9} fill="#2a1c10"/>
          <Stroke d={`M 288 ${mid} C 272 ${mid + 85} 246 ${mid + 175} 206 ${mid + 275}`} p={ip(f, inA, inA + 20)} color="#9c2f1e" w={4}/>
        </svg>
        <div style={{position: "absolute", left: 270, top: top - 64, display: "flex", alignItems: "baseline", gap: 18}}>
          <span style={{fontFamily: DEVA, fontSize: 34, color: SAFFRON}}>{SPEAKER[sp]}</span>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: 4, color: PAPER, opacity: 0.65}}>{SPEAKER_EN[sp]}</span>
        </div>
        {deva.map((ln, i) => {
          const p = ip(f, w0 + i * lineDur, w0 + (i + 1) * lineDur - 2); const x = -8 + p * 116;
          const m = `linear-gradient(90deg, #000 ${x - 8}%, transparent ${x}%)`;
          return <div key={i} style={{position: "absolute", left: 0, width: W, top: mid - (deva.length * lh) / 2 + i * lh + (four ? 10 : 6), textAlign: "center",
            fontFamily: DEVA, fontSize: fs, color: "#3b2412", WebkitMaskImage: m, maskImage: m}}>{ln}</div>;
        })}
        <div style={{position: "absolute", left: 1450, top: top - 92, transform: `rotate(-7deg) scale(${1.6 - 0.6 * stamp})`,
          opacity: Math.min(1, stamp * 1.4), border: `4px double ${SEAL}`, borderRadius: 10, padding: "8px 22px",
          color: SEAL, textAlign: "center", background: "rgba(242,232,208,0.94)"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 21, letterSpacing: 4}}>BHAGAVAD GITA</div>
          <div style={{fontFamily: SERIF, fontSize: 56, lineHeight: 1}}>{ref}</div>
        </div>
        <div style={{position: "absolute", top: iastTop, width: W, textAlign: "center", fontFamily: SANS, fontStyle: "italic",
          fontSize: four ? 29 : 33, lineHeight: four ? "44px" : "50px", color: PAPER, opacity: 0.85 * ip(f, iastAt, iastAt + 12)}}>
          {iast.map((ln, i) => <div key={i}>{ln}</div>)}
        </div>
        <div style={{position: "absolute", top: enTop, left: 210, width: 1500, textAlign: "center", fontFamily: SERIF, fontStyle: "italic",
          fontSize: four ? 42 : 48, lineHeight: 1.28, color: PAPER, opacity: ip(f, enS - 6, enS + 6)}}>
          “{words.map((w, i) => {
            const t = enS + ((T.cue(enK).dur * FPS) * acc) / en!.length; acc += w.length + 1;
            return <span key={i} style={{opacity: 0.38 + 0.62 * ip(f, t - 2, t + 5)}}>{w}{i < words.length - 1 ? " " : ""}</span>;
          })}”
        </div>
        <div style={{position: "absolute", top: 985, width: W, textAlign: "center", fontFamily: SANS, fontSize: 21, letterSpacing: 1,
          color: PAPER, opacity: 0.55 * ip(f, enS, enS + 14)}}>{glosses}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- captions: narration in plain sans; OUR NOTE lines in the roman note card. Hidden under cards and title cards.
type Chunk = {text: string; a: number; b: number; note: boolean};
export const captionChunks = (T: TT): Chunk[] => {
  const out: Chunk[] = [];
  for (const c of T.D.cues) {
    if (c.kind !== "say" || isTitleCue(c)) continue;
    let text = c.text; const full = c.text.length;
    if (c.card) text = text.replace(REF_RE, "").trim();
    if (!text) continue;
    if (c.card) text = text.replace(/[,;:]$/, "…");
    const parts: string[] = [];
    // sentences end at . ? ! followed by a space, but not after a single-letter initial ("J. Robert")
    const sents: string[] = []; let st = 0;
    for (let i = 0; i < text.length; i++) {
      if (".?!".includes(text[i]) && (i === text.length - 1 || text[i + 1] === " ") && !/(^|\s)[A-Z]$/.test(text.slice(Math.max(0, i - 2), i))) {
        sents.push(text.slice(st, i + 1)); st = i + 1;
      }
    }
    if (st < text.length) sents.push(text.slice(st));
    for (const s of sents) {
      let s2 = s.trim(); if (!s2) continue;
      while (s2.length > 74) {
        const comma = s2.lastIndexOf(", ", 62);
        let sp = s2.lastIndexOf(" ", 62);                       // never break just before a name ("J. Robert Oppenheimer")
        while (sp > 22 && /[A-Z]/.test(s2[sp + 1])) sp = s2.lastIndexOf(" ", sp - 1);
        const cut = comma > 22 ? comma + 1 : sp > 22 ? sp : s2.lastIndexOf(" ", 62);
        parts.push(s2.slice(0, cut).trim()); s2 = s2.slice(cut).trim();
      }
      parts.push(s2);
    }
    let pos = 0;
    for (const p of parts) {
      const q = p.endsWith("…") ? p.slice(0, -1) : p;
      const i = c.text.indexOf(q, pos); pos = i + q.length;
      const a = Math.round((c.start + (c.dur * i) / full) * FPS), b = Math.round((c.start + (c.dur * pos) / full) * FPS) + 6;
      out.push({text: p, a, b, note: c.note});
    }
  }
  for (let i = 0; i < out.length - 1; i++) out[i].b = Math.min(out[i].b, out[i + 1].a);
  return out;
};
export const Captions: React.FC<{f: number; chunks: Chunk[]}> = ({f, chunks}) => {
  let c: Chunk | undefined; for (const x of chunks) if (x.a <= f) c = x;     // the chunk that started most recently
  if (!c || f > c.b + 6) return null;
  const o = ip(f, c.a, c.a + 4) * ip(f, c.b, c.b + 6, 1, 0);
  return (
    <div style={{position: "absolute", bottom: 92, width: W, display: "flex", justifyContent: "center", opacity: o}}>
      {c.note ? (
        <div style={{maxWidth: 1460, background: "#fbf6ea", borderLeft: `7px solid ${NOTE}`, borderRadius: 6, padding: "10px 26px 12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 15, letterSpacing: 4, color: NOTE}}>OUR NOTE</div>
          <div style={{fontFamily: SERIF, fontSize: 38, color: INK, lineHeight: 1.22}}>{c.text}</div>
        </div>
      ) : (
        <div style={{maxWidth: 1460, background: "rgba(10,10,24,0.78)", borderRadius: 12, padding: "8px 24px", fontFamily: SANS,
          fontWeight: 600, fontSize: 35, color: PAPER, lineHeight: 1.3, textAlign: "center"}}>{c.text}</div>
      )}
    </div>
  );
};

// ---------- japa mala progress: 18 beads in 6 · 6 · 6 with a meru (guru) bead and tassel; one bead lights per chapter
export const Mala: React.FC<{f: number; chapter: number; from: number; theme: Theme}> = ({f, chapter, from, theme}) => {
  const o = ip(f, from, from + 20);
  const gap = 30, grp = 26, x0 = W / 2 - (17 * gap + 2 * grp) / 2, y = 1040;
  const xs = Array.from({length: 18}).map((_, i) => x0 + i * gap + Math.floor(i / 6) * grp);
  const thread = theme === "paper" ? "rgba(43,33,24,0.45)" : "rgba(242,232,208,0.35)";
  const pulse = 0.6 + 0.4 * Math.sin(f / 8);
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}>
      <path d={`M ${xs[0] - 20} ${y} L ${xs[17] + 24} ${y}`} stroke={thread} strokeWidth={1.5}/>
      {xs.map((x, i) => {
        const n = i + 1; const past = n < chapter, cur = n === chapter;
        return <g key={i}>
          {cur && <circle cx={x} cy={y} r={14} fill={SAFFRON} opacity={0.35 * pulse}/>}
          <circle cx={x} cy={y} r={cur ? 8.5 : 7} fill={cur ? SAFFRON : past ? GOLD : "none"}
            stroke={past || cur ? "none" : thread} strokeWidth={1.5}/>
        </g>;
      })}
      <circle cx={xs[17] + 30} cy={y} r={9} fill={past18(chapter) ? GOLD : "none"} stroke={thread} strokeWidth={1.5}/>
      <path d={`M ${xs[17] + 39} ${y} C ${xs[17] + 52} ${y + 4} ${xs[17] + 58} ${y + 10} ${xs[17] + 60} ${y + 22}`} stroke={SEAL} strokeWidth={3} fill="none" opacity={0.8}/>
    </svg>
  );
};
const past18 = (ch: number) => ch > 18;

// ---------- small text furniture
export const ChapterTag: React.FC<{f: number; ch: number; T: TT; theme: Theme; a: number}> = ({f, ch, T, theme, a}) => {
  const C = T.D.chapters[String(ch)];
  const col = theme === "paper" ? INK : PAPER;
  return <div style={{position: "absolute", left: 60, top: 42, fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: 4,
    color: col, opacity: 0.55 * ip(f, a, a + 12)}}>CHAPTER {ch} <span style={{fontFamily: DEVA, letterSpacing: 0, fontSize: 22}}>· {C.deva}</span></div>;
};
export const AlsoCited: React.FC<{f: number; refs: string[]; theme: Theme; a: number; b: number}> = ({f, refs, theme, a, b}) => {
  if (!refs.length) return null;
  const col = theme === "paper" ? INK : PAPER;
  return <div style={{position: "absolute", right: 60, top: 42, fontFamily: SANS, fontWeight: 600, fontSize: 16, letterSpacing: 2,
    color: col, opacity: 0.5 * ip(f, a + 20, a + 34) * ip(f, b - 10, b, 1, 0), textAlign: "right"}}>
    ALSO CITED · {refs.map((r) => r.replace("-", "–")).join("  ·  ")}</div>;
};
