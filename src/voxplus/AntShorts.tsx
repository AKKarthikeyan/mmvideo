// ants1 Shorts (Moat Atlas, 27 Oct 2026): three 9:16 cut-downs of the long video, same Vox Motion+ pieces and the same S-1 excerpts.
// Script: docs/global-launch/EP_ANTHROPIC_S1_SCRIPT.md "The 3 Shorts" (approved 27 Oct). Narration: public/voxplus/ants1/vo/s?#_t.wav (Go key,
// English_Diligent_Man), timing in AntShortTiming.ts. Moat Atlas Short rules: hook headline in frame 1, burned captions, source on every figure,
// last seconds point to the long video. 30 fps, so a frame is a kit tick.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {MusicBed, SfxTrack, Cue} from "./Sound";
import {useVoxFonts} from "./fonts";
import {Finish, InkSurface} from "./Texture";
import {Paper, Stamp} from "./A01V4Parts";
import {C, F, clamp01, ease, inOut, outQuint, spr} from "./tokens";
import {Big, Doc, Lab, Receipt, Squares} from "./AntPieces";
import {PriceTag, QuoteCard} from "./AntKit";
import {AtlasMark, Bill, Coins, SandTimer} from "./AntProps";
import {CAP, DUR, SHORTS, WORDS} from "./AntShortTiming";
import {G} from "../global/theme";

export const SFPS = 30;
const T = (s: number) => Math.round(s * SFPS);
const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
/** frame (in the Short) where `phrase` starts inside beat k */
const useW = (sh: string) => (k: string, phrase?: string, off = 0): number => {
  const st = SHORTS[sh].start[k];
  if (!phrase) return T(st + off);
  const toks = norm(phrase).split(" "), ws = WORDS[k], flat: {t: string; i: number}[] = [];
  ws.forEach((w, i) => norm(w[0]).split(" ").filter(Boolean).forEach((t) => flat.push({t, i})));
  for (let i = 0; i + toks.length <= flat.length; i++)
    if (toks.every((t, j) => flat[i + j].t === t || (j === toks.length - 1 && flat[i + j].t.startsWith(t)))) return T(st + ws[flat[i].i][1] + off);
  throw new Error(`phrase not in ${k}: ${phrase}`);
};

// ---- captions: the approved script's words spread over the whisper word times, 2-4 words a chunk
type Chunk = {a: number; b: number; text: string};
const chunks = (sh: string): Chunk[] => {
  const out: Chunk[] = [];
  SHORTS[sh].keys.forEach((k) => {
    const ws = WORDS[k], words = CAP[k].split(" "), n = words.length, m = ws.length, st = SHORTS[sh].start[k];
    const tm = (i: number) => ws[Math.min(m - 1, Math.floor((i * m) / n))];
    let cur: string[] = [], a = 0;
    words.forEach((w, i) => {
      if (!cur.length) a = st + tm(i)[1];
      cur.push(w);
      const end = /[.,:?]$/.test(w) || cur.length >= 4 || i === n - 1;
      if (end) { out.push({a: T(a), b: T(st + tm(i)[2]) + 6, text: cur.join(" ")}); cur = []; }
    });
  });
  for (let i = 0; i < out.length - 1; i++) out[i].b = Math.min(out[i].b + 8, out[i + 1].a);
  return out;
};
const Captions: React.FC<{sh: string}> = ({sh}) => {
  const f = useCurrentFrame(), c = chunks(sh).find((x) => f >= x.a && f < x.b);
  if (!c) return null;
  const k = spr(f, c.a, 12, 220);
  return (
    <div style={{position: "absolute", left: 60, right: 60, top: 1450, display: "flex", justifyContent: "center"}}>
      <div style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 62, lineHeight: 1.15, padding: "16px 28px", textAlign: "center",
        transform: `scale(${0.85 + 0.15 * k})`, opacity: clamp01(k * 3), boxShadow: "0 10px 24px rgba(0,0,0,0.3)"}}>{c.text}</div>
    </div>
  );
};

// ---- hook headline (frame 1): big two-line tape at the top, then it settles smaller and stays
const Hook: React.FC<{lines: [string, string]}> = ({lines}) => {
  const f = useCurrentFrame(), s = 1 - 0.28 * ease(f, T(2.4), T(3.0), inOut);
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 110, transform: `scale(${s})`, transformOrigin: "50% 0", textAlign: "center"}}>
      {lines.map((l, i) => (
        <div key={i} style={{display: "inline-block", margin: "8px 40px", background: i ? C.highlight : C.ink, color: i ? C.ink : C.white, fontFamily: F.sans, fontWeight: 900,
          fontSize: 76, letterSpacing: 1, padding: "10px 26px", transform: `rotate(${i ? 1.5 : -1.5}deg)`}}>{l}</div>
      ))}
    </div>
  );
};
const Chip: React.FC<{text: string; y?: number; dark?: boolean}> = ({text, y = 1360, dark}) => (
  <div style={{position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: F.mono, fontSize: 26, letterSpacing: 1.5,
    color: dark ? "#BDB6A9" : C.inkSoft, textTransform: "uppercase"}}>{text}</div>
);
/** a scene that is on between frames a and b, sliding up in and fading out */
const Sc: React.FC<{a: number; b: number; children: (f: number) => React.ReactNode}> = ({a, b, children}) => {
  const f = useCurrentFrame();
  if (f < a - 1 || f > b + 8) return null;
  const k = ease(f, a, a + 10, outQuint), o = 1 - ease(f, b, b + 8);
  return <AbsoluteFill style={{opacity: o, transform: `translateY(${(1 - k) * 120}px)`}}>{children(f - a)}</AbsoluteFill>;
};
/** the last seconds: the pointer to the long video */
const Pointer: React.FC<{at: number; line: string}> = ({at, line}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = spr(f, at, 12, 160);
  return (
    <AbsoluteFill style={{background: G.bg, opacity: clamp01(k * 2)}}>
      <AtlasMark f={f - at} at={2} x={360} y={560} s={1.6}/>
      <div style={{position: "absolute", left: 80, right: 80, top: 820, textAlign: "center", fontFamily: F.serif, fontSize: 88, lineHeight: 1.1, color: "#E8ECF1"}}>{line}</div>
      <div style={{position: "absolute", left: 80, right: 80, top: 1120, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: "#8B95A3"}}>
        FULL VIDEO ON THE CHANNEL ↓</div>
      <div style={{position: "absolute", left: 60, right: 60, top: 1620, textAlign: "center", fontFamily: F.mono, fontSize: 22, color: "#8B95A3", lineHeight: 1.5}}>
        Script drafted with Claude, an AI model made by Anthropic, the company in this video. Every figure checked against the S-1. Narration: synthetic voice. Not investment advice.</div>
    </AbsoluteFill>
  );
};
const Voice: React.FC<{sh: string}> = ({sh}) => <>{SHORTS[sh].keys.map((k) => (
  <Sequence key={k} from={T(SHORTS[sh].start[k])} durationInFrames={T(DUR[k] + 0.3)} layout="none"><Audio src={staticFile("voxplus/ants1/vo/" + k + "_t.wav")}/></Sequence>))}</>;
const Bed: React.FC<{sh: string}> = ({sh}) => {
  const tot = T(SHORTS[sh].total), vo = SHORTS[sh].keys.map((k) => [T(SHORTS[sh].start[k]), T(SHORTS[sh].start[k] + DUR[k])] as [number, number]);
  return <MusicBed src="audio/music_06_curious_ambience_reg1n0ld.wav" total={tot} voice={vo} duck={0.15} open={0.3} startFrom={T(20)} fadeIn={T(0.6)} fadeOut={T(1.2)}/>;
};
const Shell: React.FC<{sh: string; hook: [string, string]; dark?: boolean; cues: Cue[]; pointer: string; children: React.ReactNode}> = ({sh, hook, dark, cues, pointer, children}) => {
  useVoxFonts();
  const f = useCurrentFrame(), last = SHORTS[sh].keys[SHORTS[sh].keys.length - 1];
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {dark ? <InkSurface glow={0.08}/> : <AbsoluteFill style={{transform: `scale(${1.2 + 0.04 * f / 900})`}}><Paper drift={f / 900}/></AbsoluteFill>}
      {children}
      <Hook lines={hook}/>
      <Pointer at={T(SHORTS[sh].start[last]) - 4} line={pointer}/>
      <Captions sh={sh}/>
      <Finish f={f} dark={dark}/>
      <Voice sh={sh}/><Bed sh={sh}/><SfxTrack cues={cues}/>
    </AbsoluteFill>
  );
};

// ======================= S1 · "Anthropic spent $1.04 for every $1" =======================
export const ShortA: React.FC = () => {
  const w = useW("a"), f = useCurrentFrame();
  const L = (t: number) => ({l: "", r: "", at: t});
  return (
    <Shell sh="a" hook={["ANTHROPIC SPENT $1.04", "FOR EVERY $1 IT EARNED"]} pointer="Where each dollar went: the full breakdown"
      cues={[[w("sa1", "a dollar and four"), "stamp", 0.5], [w("sa2"), "paper", 0.5], [w("sa3", "two dollars"), "pop", 0.5], [w("sa3", "April"), "stamp", 0.5]]}>
      <Sc a={0} b={w("sa2") - 6}>{(g) => <>
        <Bill f={g} at={0} x={540} y={900} w={920} rot={-3}/>
        <PriceTag f={g} at={w("sa1", "a dollar and four") - 12} x={700} y={560} text="$1.04" size={130}/>
        <Lab f={g} at={w("sa1", "operating costs")} text="operating costs per $1 of revenue" x={540} y={1180} size={34}/>
        <div style={{position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: C.inkSoft}}>JAN–JUN 2026 · OUR ARITHMETIC: 16,979 ÷ 16,286</div>
        <Chip text="Anthropic S-1 · filed 26 Oct 2026 · p.148 · US$"/>
      </>}</Sc>
      <Sc a={w("sa2") - 6} b={w("sa3") - 6}>{(g) => <>
        <Receipt f={g} x={540} y={500} w={900} s={1.12} head="EACH $1 OF REVENUE, JAN–JUN 2026" rot={-1.2} enterAt={0}
          lines={[{l: "COMPUTE", r: "55¢", at: w("sa2", "Fifty") - w("sa2") + 4}, {l: "PEOPLE", r: "19¢", at: w("sa2", "Nineteen to people") - w("sa2") + 4},
            {l: "SALES AND PARTNERS", r: "19¢", at: w("sa2", "Nineteen to sales") - w("sa2") + 4}, {l: "EVERYTHING ELSE", r: "11¢", at: w("sa2", "Eleven") - w("sa2") + 4},
            {l: "SPENT", r: "$1.04", at: w("sa2", "Eleven") - w("sa2") + 26, big: true, red: true}]}/>
        <Chip text="Anthropic S-1 · p.149 · costs by nature as % of revenue" y={1330}/>
      </>}</Sc>
      <Sc a={w("sa3") - 6} b={w("sa4") - 6}>{(g) => <>
        <PriceTag f={g} at={0} x={540} y={300} text="$2.84" size={150}/>
        <Stamp f={g} at={w("sa3", "two dollars") - w("sa3") + 10} text="JAN–JUN 2025" x={540} y={830} size={70} rot={-6}/>
        <Stamp f={g} at={w("sa3", "April") - w("sa3")} text="APR–JUN 2026: IN PROFIT" x={540} y={1080} size={52} rot={3} color="#1E7A4C"/>
        <Chip text="S-1 p.148 (our arithmetic 3,298 ÷ 1,163) · p.158: operating profit $974M" y={1330}/>
      </>}</Sc>
      {void f}
    </Shell>
  );
};

// ======================= S2 · "80% of its revenue came from brand-new models" =======================
export const ShortB: React.FC = () => {
  const w = useW("b");
  return (
    <Shell sh="b" hook={["80% OF ITS REVENUE:", "MODELS UNDER 6 MONTHS OLD"]} pointer="Must Anthropic's lead be won every six months?"
      cues={[[w("sb1", "eighty"), "ding", 0.5], [w("sb2"), "paper", 0.5], [w("sb2", "frontier"), "highlighter", 0.5], [w("sb3", "race"), "stamp", 0.6]]}>
      <Sc a={0} b={w("sb2") - 6}>{(g) => <>
        <Squares f={g} at={2} fill={80} x={540} y={820} cell={66} color={C.highlightPrint} per={0.35} dark={false}/>
        <Big f={g} at={w("sb1", "eighty") - 6} text="80%+" x={540} y={820} size={230} color={C.ink}/>
        <Lab f={g} at={w("sb1", "models released") - 2} text="from models released Apr–Sep 2026" x={540} y={1210} size={32}/>
        <Chip text="Anthropic S-1 · filed 26 Oct 2026 · p.144 · revenue, Jul–Sep 2026"/>
      </>}</Sc>
      <Sc a={w("sb2") - 6} b={w("sb3") - 6}>{(g) => <>
        <QuoteCard f={g} head="Anthropic S-1 · p.146" x={540} y={820} w={960} size={44} rot={-1}
          lines={["“Customers adopt and retain", "our technology based on", "whether our models are at", "the frontier of AI capability", "and maintaining that frontier", "position is essential to", "revenue generation.”"]}
          hl={[["the frontier of AI capability", w("sb2", "frontier") - w("sb2") - 4], ["revenue generation.”", w("sb2", "frontier") - w("sb2") + 14]]}/>
        <Chip text="Anthropic S-1 · p.146 · quote, word for word" y={1300}/>
      </>}</Sc>
      <Sc a={w("sb3") - 6} b={w("sb4") - 6}>{(g) => <>
        <SandTimer f={g} at={0} x={540} y={760} s={1.4} flips={[w("sb3", "run again") - w("sb3")]} run={200}/>
        <Stamp f={g} at={w("sb3", "race") - w("sb3") - 2} text="A RACE" x={540} y={1150} size={110} rot={-5}/>
        <Chip text="Our reading" y={1300}/>
      </>}</Sc>
    </Shell>
  );
};

// ======================= S3 · "The $80.7B loss that's mostly not cash" =======================
const PBridge: React.FC<{f: number; rows: {label: string; v: number; at: number; note?: string}[]}> = ({f, rows}) => {
  const X0 = 90, XW = 900, min = -85, max = 8, X = (v: number) => X0 + ((v - min) / (max - min)) * XW;
  let run = 0;
  return (
    <>
      <div style={{position: "absolute", left: X(0) - 2, top: 560, width: 4, height: 560, background: "rgba(255,255,255,0.7)"}}/>
      <div style={{position: "absolute", left: X(0), top: 520, transform: "translateX(-50%)", fontFamily: F.mono, fontSize: 24, color: "#CFC9BE"}}>$0</div>
      {rows.map((r, i) => {
        const a = i === 0 ? 0 : run, b = i === 0 ? r.v : run + r.v; run = b;
        if (f < r.at) return null;
        const g = ease(f, r.at, r.at + 18, outQuint), lo = Math.min(a, a + (b - a) * g), hi = Math.max(a, a + (b - a) * g), y = 600 + i * 260;
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: X0, top: y - 70, fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 1.5, color: "#E8E2D6"}}>{r.label}
              {r.note ? <span style={{fontFamily: F.mono, fontWeight: 400, fontSize: 26, color: "#9C968C"}}>{"  · " + r.note}</span> : null}</div>
            <div style={{position: "absolute", left: X(lo), top: y, width: Math.max(3, X(hi) - X(lo)), height: 120, background: i === 0 ? C.markerRed : i === 1 ? C.highlightPrint : "#2fa37a"}}/>
            <div style={{position: "absolute", left: (X(lo) + X(hi)) / 2, top: y + 60, transform: "translate(-50%,-50%)", fontFamily: F.sans, fontWeight: 900, fontSize: 64,
              color: i === 1 ? C.ink : C.white, opacity: clamp01(g * 2), whiteSpace: "nowrap"}}>{(r.v < 0 ? "–$" : "+$") + Math.abs(r.v).toFixed(1) + "B"}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};
export const ShortC: React.FC = () => {
  const w = useW("c");
  return (
    <Shell sh="c" hook={["THE $80.7B LOSS", "THAT'S MOSTLY NOT CASH"]} pointer="Follow Anthropic's dollar: the full breakdown"
      cues={[[w("sc1", "eighty point"), "highlighter", 0.5], [w("sc2", "seventy two"), "whoosh", 0.4], [w("sc3"), "stamp", 0.5], [w("sc3", "three point"), "ding", 0.5]]}>
      <Sc a={0} b={w("sc2") - 6}>{(g) => <>
        <QuoteCard f={g} head="Anthropic S-1 · p.64" x={540} y={720} w={960} size={42} rot={-1}
          lines={["“We have incurred net losses in", "each year since our founding, …", "and $80.7 billion for the six", "months ended June 30, 2026”"]}
          hl={[["$80.7 billion", w("sc1", "eighty point") - 4]]}/>
        <Big f={g} at={w("sc1", "eighty point") + 4} text="–$80.7B" x={540} y={1120} size={150} color={C.markerRed} rot={-3}/>
        <Chip text="Anthropic S-1 · filed 26 Oct 2026 · p.64 · net loss, Jan–Jun 2026" y={1300}/>
      </>}</Sc>
      <Sc a={w("sc2") - 6} b={w("sc3") - 6}>{(g) => <>
        <AbsoluteFill><InkSurface glow={0.08}/></AbsoluteFill>
        <PBridge f={g} rows={[{label: "NET LOSS", v: -80.7, at: 0}, {label: "NOTE VALUE CHARGE", v: 72.4, at: w("sc2", "seventy two") - w("sc2") - 4, note: "non-cash"}]}/>
        <Chip text="S-1 p.23 · change in fair value of convertible notes · US$" y={1300} dark/>
      </>}</Sc>
      <Sc a={w("sc3") - 6} b={w("sc4") - 6}>{(g) => <>
        <div style={{position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: F.serif, fontSize: 120, color: C.ink}}>
          It isn't <span style={{background: C.highlight, padding: "0 12px"}}>cash.</span></div>
        <Coins f={g} at={w("sc3", "Its operations") - w("sc3")} n={16} x={540} y={1150} tint="#7FBF7A" label="+$3.9B" sub="cash from operations · Jan–Jun 2026"/>
        <Chip text="Anthropic S-1 · p.169 · cash flow statement" y={1330}/>
      </>}</Sc>
    </Shell>
  );
};
void inOut; void Big;
