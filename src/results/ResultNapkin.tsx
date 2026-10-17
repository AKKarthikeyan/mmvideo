// Result Engine Shorts in the Napkin Math format (AK, 13 Oct 2026: "Use Napkin Math for Result Shorts from now onwards").
// The props-driven twin of src/hand/BankNapkins2.tsx: same paper, label, stamps, verdict and loop, drawn with the hand kit.
// There each Short's scenes are written out in code; here the Result Engine (DarwinWiki resultengine/napkin.py) lays every
// beat out as a list of elements and passes it as --props={D, label}, so a new company result needs no code.
// Audio is read from <public-dir>/vx/<D.id>/<beat>.mp3, as for the other result compositions.
// Since 16 Oct 2026 the engine also draws three other shapes of Short with the same kit (resultengine/formats.py): a sector
// scoreboard, where each ₹100 of revenue went, and a figure's streak as a line. They need three more element kinds (bar,
// seg, dot), and the yellow sticker names the format (prop `sticker`, "napkin math" by default).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";

export const NFPS = 30;
const PAD = 0.15;
const GOLD = "#b8860b", AMBER = "#e67700", GREY = "#555";
const COL: Record<string, string> = {ink: INK, red: RED, blue: BLUE, green: GREEN, grey: GREY, gold: GOLD, amber: AMBER};
const FILL: Record<string, string> = {[GREEN]: "rgba(43,138,62,0.18)", [RED]: "rgba(217,72,15,0.18)", [BLUE]: "rgba(28,100,184,0.18)",
  [AMBER]: "rgba(230,119,0,0.18)"};

// bar: a hatched box (an outline with fill false); seg: a line from (x1, y1) to (x2, y2); dot: a filled circle of radius r.
type El = {k: "w" | "rule" | "ring" | "verdict" | "loop" | "bar" | "seg" | "dot"; t?: string; x?: number; y?: number; size?: number; color?: string;
  anchor?: "start" | "middle"; at?: string; off?: number; frac?: number; fixed?: boolean; hand?: boolean; dur?: number;
  x1?: number; x2?: number; y1?: number; y2?: number; w?: number; h?: number; r?: number; sw?: number; fill?: boolean; op?: number;
  pick?: "GOOD" | "WATCH" | "CONCERN"; q?: boolean};
type NScene = {type: "napkin"; tag?: {t: string; color?: string} | null; paper?: boolean; rot?: number; tail?: number; els: El[]};
type NBeat = {key: string; say: string; cap: string; sec: number; cues?: string[]; scene: NScene};
export type NData = {id: string; beats: NBeat[]};

export const NEMPTY: NData = {id: "r-empty", beats: [{key: "e0", say: "", cap: "", sec: 1, cues: [""], scene: {type: "napkin", els: []}}]};
const beatFrames = (b: NBeat) => Math.ceil((b.sec + PAD + (b.scene?.tail ?? 0)) * NFPS);
export const napkinTotal = (D: NData) => D.beats.reduce((a, b) => a + beatFrames(b), 0);

// When an element starts: on a phrase of the voice line, at a share of the line, or before the first frame.
const startOf = (b: NBeat, e: El) => {
  if (e.fixed) return -9;
  let s = 0;
  if (e.at) {
    const i = b.say.toLowerCase().indexOf(e.at.toLowerCase());
    if (i < 0) throw new Error(`phrase not in ${b.key}: ${e.at}`);
    s = Math.round(b.sec * NFPS * i / b.say.length);
  } else if (e.frac != null) s = Math.round(b.sec * NFPS * e.frac);
  return s + (e.off ?? 0);
};

const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);
const Sheet: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -2}) => (
  <g transform={`rotate(${rot} 540 930)`}>
    <rect x={80} y={360} width={920} height={1170} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 18}, (_, i) => <line key={i} x1={80} y1={440 + i * 60} x2={1000} y2={440 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);
// The stamp above the sheet, on screen from the beat's first frame. Its box grows with the word.
const Tag: React.FC<{t: string; color?: string}> = ({t, color = RED}) => {
  const w = Math.max(240, Math.min(900, t.length * 54 * 0.62 + 90));
  return (
    <g transform="rotate(-3 540 290)">
      <rect x={540 - w / 2} y={238} width={w} height={92} fill="#fffef6" opacity={0.9}/>
      <HDraw shape={sh.rect(540 - w / 2, 238, w, 92, {stroke: color, strokeWidth: 6, seed: t.length + 3})} start={-9} dur={6} hand={false}/>
      <HWrite x={540} y={304} start={-9} dur={6} size={54} anchor="middle" color={color} hand={false}>{t}</HWrite>
    </g>
  );
};
const VCOL: Record<string, string> = {GOOD: GREEN, WATCH: AMBER, CONCERN: RED};
// q: the verdict is provisional (a first read; the quality check has not run), so the chosen word carries a question mark.
const Verdict: React.FC<{pick: "GOOD" | "WATCH" | "CONCERN"; start: number; y?: number; q?: boolean}> = ({pick, start, y = 690, q = false}) => {
  const xs = [90, 400, 710], w = 280, h = 120;
  const i = ["GOOD", "WATCH", "CONCERN"].indexOf(pick); const px = xs[i] - (pick === "GOOD" ? 45 : 0), pc = VCOL[pick];  // GOOD's tick stays clear of the word VERDICT
  return (
    <>
      <g transform={`rotate(-4 540 ${y})`}>
        <HWrite x={540} y={y} start={start} dur={6} size={60} anchor="middle" color={INK} hand={false}>VERDICT</HWrite>
      </g>
      {["GOOD", "WATCH", "CONCERN"].map((o, k) => (
        <React.Fragment key={o}>
          <HDraw shape={sh.rect(xs[k], y + 40, w, h, {stroke: VCOL[o], strokeWidth: o === pick ? 10 : 4, seed: 70 + k,
            fill: o === pick ? FILL[VCOL[o]] : undefined, fillStyle: "hachure"})} start={start + 2 + k * 2} dur={8} hand={false}/>
          <HWrite x={xs[k] + w / 2} y={y + 122} start={start + 4 + k * 2} dur={6} size={o === pick ? (q ? 48 : 54) : 44} anchor="middle" color={VCOL[o]} hand={false}>{o === pick && q ? `${o}?` : o}</HWrite>
        </React.Fragment>
      ))}
      <HDraw shape={sh.line(px + w - 80, y + 30, px + w - 45, y + 70, {stroke: pc, strokeWidth: 12, seed: 81})} start={start + 14} dur={5}/>
      <HDraw shape={sh.line(px + w - 45, y + 70, px + w + 15, y - 20, {stroke: pc, strokeWidth: 12, seed: 82})} start={start + 19} dur={6}/>
      <HWrite x={540} y={y + 232} start={start + 8} dur={6} size={34} anchor="middle" color={GREY} hand={false}>a verdict on the filing, not on the stock</HWrite>
    </>
  );
};
const Loop: React.FC<{start: number}> = ({start}) => (
  <>
    <HDraw shape={sh.arc(540, 1330, 420, 230, Math.PI * 0.1, Math.PI * 1.75, {stroke: BLUE, strokeWidth: 7, seed: 99})} start={start} dur={16}/>
    <HWrite x={540} y={1350} start={start + 6} size={54} anchor="middle" color={BLUE}>back to the napkin</HWrite>
  </>
);

const Draw: React.FC<{b: NBeat; e: El; i: number}> = ({b, e, i}) => {
  const start = startOf(b, e);
  const color = COL[e.color ?? "ink"] ?? INK;
  if (e.k === "w") {
    return <HWrite x={e.x ?? 540} y={e.y ?? 600} start={start} size={e.size ?? 64} color={color} anchor={e.anchor ?? "start"}
      hand={e.hand ?? true} dur={e.fixed ? 8 : e.dur}>{e.t ?? ""}</HWrite>;
  }
  const d = (n: number) => (e.fixed ? 8 : e.dur ?? n);  // a fixed shape is complete by the first frame, as fixed writing is
  if (e.k === "rule") return <HDraw shape={sh.line(e.x1 ?? 120, e.y ?? 850, e.x2 ?? 960, e.y ?? 850, {strokeWidth: 7, seed: 21 + i})} start={start} dur={d(10)}/>;
  if (e.k === "ring") return <HDraw shape={sh.ellipse(e.x ?? 540, e.y ?? 800, e.w ?? 600, e.h ?? 250, {stroke: color, strokeWidth: 8, seed: 11 + i})} start={start} dur={d(12)} hand={!e.fixed}/>;
  if (e.k === "bar") {
    const box = sh.rect(e.x ?? 140, e.y ?? 600, e.w ?? 100, e.h ?? 40, e.fill === false ? {stroke: color, strokeWidth: 4, seed: 31 + i}
      : {stroke: color, strokeWidth: 3, seed: 31 + i, fill: color, fillStyle: "hachure", hachureGap: 9, fillWeight: 3, hachureAngle: -41});
    return <g opacity={e.op ?? 1}><HDraw shape={box} start={start} dur={d(10)} hand={false}/></g>;
  }
  if (e.k === "seg") return <HDraw shape={sh.line(e.x1 ?? 0, e.y1 ?? 0, e.x2 ?? 0, e.y2 ?? 0, {stroke: color, strokeWidth: e.sw ?? 4, seed: 41 + i})} start={start} dur={d(8)} hand={false}/>;
  if (e.k === "dot") return <HDraw shape={sh.circle(e.x ?? 540, e.y ?? 800, (e.r ?? 12) * 2, {stroke: color, strokeWidth: 3, fill: color, fillStyle: "solid", seed: 51 + i})} start={start} dur={d(6)} hand={false}/>;
  if (e.k === "verdict") return <Verdict pick={e.pick ?? "WATCH"} q={e.q} y={e.y ?? 900} start={start}/>;
  if (e.k === "loop") return <Loop start={start}/>;
  return null;
};

const Scene: React.FC<{b: NBeat}> = ({b}) => {
  const s = b.scene;
  const drawn = s.els.map((e, i) => <Draw key={i} b={b} e={e} i={i}/>);
  // Stamps, the verdict and the loop sit on the ground; writing sits on the sheet when there is one.
  const onSheet = s.paper ? drawn.filter((_, i) => !["verdict", "loop"].includes(s.els[i].k)) : [];
  const onGround = s.paper ? drawn.filter((_, i) => ["verdict", "loop"].includes(s.els[i].k)) : drawn;
  return (
    <Canvas>
      {s.tag ? <Tag t={s.tag.t} color={COL[s.tag.color ?? "red"] ?? RED}/> : null}
      {s.paper ? <Sheet rot={s.rot ?? -2}>{onSheet}</Sheet> : null}
      {onGround}
    </Canvas>
  );
};

// Captions for muted viewing: the engine's own caption cues (numerals, never split inside a decimal), one at a time.
const NapCaptions: React.FC<{cues: string[]; frames: number}> = ({cues, frames}) => {
  const f = useCurrentFrame();
  const total = cues.reduce((a, s) => a + s.length, 0) || 1;
  let acc = 0, cur = cues[0] ?? "";
  for (const s of cues) { acc += s.length; cur = s; if (f < acc / total * frames) break; }
  if (!cur) return null;
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 150, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.72)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: 36, lineHeight: 1.4, padding: "6px 14px", borderRadius: 8, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{cur}</span>
    </div>
  );
};

const Furniture: React.FC<{label: string; sticker?: string}> = ({label, sticker = "napkin math"}) => {
  const fs = sticker.length <= 11 ? 52 : 44, sw = Math.max(420, sticker.length * fs * 0.6 + 60);  // the sticker grows with its words
  const room = 920 - sw;  // the label beside it gives way: it is written smaller rather than run into the sticker
  return (
  <Canvas>
    <g transform="rotate(-4 220 150)">
      <rect x={60} y={90} width={sw} height={110} fill="#ffe066" stroke="#e0b800" strokeWidth={2}/>
      <text x={60 + sw / 2} y={163} fontFamily={HANDFONT} fontSize={fs} textAnchor="middle" fill={INK}>{sticker}</text>
    </g>
    <text x={1010} y={160} fontFamily={HANDFONT} fontSize={Math.max(24, Math.min(40, Math.min(500, room) / Math.max(8, label.length) / 0.6))} textAnchor="end" fill={INK}>{label}</text>
    <text x={540} y={1858} fontFamily={HANDFONT} fontSize={30} textAnchor="middle" fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>
    <text x={540} y={1896} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={22} textAnchor="middle" fill={INK} opacity={0.6}>Educational research, not investment advice · not SEBI-registered</text>
  </Canvas>
  );
};

export const ResultNapkin: React.FC<{D: NData; label: string; sticker?: string}> = ({D, label, sticker}) => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {D.beats.map((b) => {
        const fr = beatFrames(b);
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={fr}>
            <AbsoluteFill><Scene b={b}/></AbsoluteFill>
            <NapCaptions cues={b.cues ?? [b.cap]} frames={Math.ceil(b.sec * NFPS)}/>
            {b.say ? <Audio src={staticFile(`vx/${D.id}/${b.key}.mp3`)}/> : null}
          </Sequence>
        );
        from += fr;
        return el;
      })}
      <Furniture label={label} sticker={sticker}/>
    </AbsoluteFill>
  );
};
