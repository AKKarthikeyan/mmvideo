// Scene kind "end": the closing scene. The uncle asks the closing question in a speech bubble, a subscribe button rings its bell, the sources are
// listed small and legible on a board in front of him, and an empty rounded frame waits at the right: YouTube puts its "next video" end-screen
// element there, so nothing is drawn inside it. No link or domain is printed anywhere (a source that holds one makes the render throw).
import React from "react";
import {Keeper} from "../../art";
import {C} from "../../palette";
import {SANS, ROUND, ease, pop} from "../../ui";
import {measure, wrap} from "../../../shared/fit";
import {SAFE, type SceneProps} from "../contract";
import {Chip, Doodles, Push, ROUND_FONT, SpeechBubble, assertNoTypedNumbers, layout, parseLine, visemeAt, type Cam} from "./statement_kit";

export type EndSpec = {
  question: string;                                 // the closing question, asked in the uncle's speech bubble
  sources: string[];                                // one citation per entry (publisher and release), no URLs or domains
  next?: string;                                    // one line under the empty frame: the next video's title
  subscribe?: string;                               // the subscribe button's text (default "SUBSCRIBE")
  mouth?: boolean;                                  // the uncle talks (default true)
  camera?: Cam; notes?: string;
};

const SRC_FONT: any = {family: SANS, weight: 700, tnum: false};
const FRAME = {x: 1100, y: 178, w: 724, h: 407};   // the empty 16:9 frame (end-screen space)
const PANEL_BOTTOM = 914;
const DOMAIN = /https?:\/\/|www\.|\b[a-z0-9-]+\.(?:org|com|in|gov|net|co|io|edu|info|dev|app)\b/i;

export const Scene: React.FC<SceneProps<EndSpec>> = ({f, dur, spec}) => {
  if (!spec || typeof spec.question !== "string" || !spec.question.trim()) throw new Error("end: spec.question must be a non-empty string");
  if (!Array.isArray(spec.sources) || !spec.sources.length) throw new Error("end: spec.sources must list at least one source");
  if (/[{}*]/.test(spec.question)) throw new Error("end: the question is plain words (no figure tokens or stars)");
  assertNoTypedNumbers(spec.question, "end question");
  spec.sources.forEach((s) => { if (DOMAIN.test(s)) throw new Error(`end: source "${s}" prints a link or domain; name the publisher instead`); });
  if (spec.next && DOMAIN.test(spec.next)) throw new Error(`end: next "${spec.next}" prints a link or domain`);

  // ---- the question, in the bubble
  const qUnits = parseLine(spec.question, [], new Set(), "end question");
  let qSize = 62, qRows = layout([qUnits], qSize, 480, true);
  for (; qSize > 40; qSize -= 2) { qRows = layout([qUnits], qSize, 480, true); if (qRows.length * qSize * 1.12 <= 330) break; }
  if (qRows.length * qSize * 1.12 > 330) throw new Error(`end: the question is too long for the bubble (${spec.question.length} characters); shorten it`);
  const qLines = qRows.map((r) => r.chunks.map((c) => c.units.map((u) => u.text).join("")).join(" "));
  const qW = Math.max(300, Math.max(...qLines.map((l) => measure(l, ROUND_FONT, qSize))) + 84), qH = qLines.length * qSize * 1.12 + 56;
  const BX = 470, BY = 150;

  // ---- the sources board: up to two columns, text 28 -> 22 px, at most five lines a column
  const cols = spec.sources.length <= 2 ? 1 : 2, per = Math.ceil(spec.sources.length / cols);
  const colW = cols === 2 ? 770 : 1500;
  let sSize = 28, colLines: string[][][] = [];
  for (; sSize >= 22; sSize--) {
    colLines = Array.from({length: cols}, (_, c) => spec.sources.slice(c * per, (c + 1) * per).map((s) => wrap(s, SRC_FONT, sSize, colW)));
    if (Math.max(...colLines.map((c) => c.reduce((a, e) => a + e.length, 0))) <= 5) break;
  }
  if (sSize < 22) throw new Error("end: the sources do not fit the board at 22 px (shorten them: at most 5 lines a column)");
  const lineH = sSize * 1.24, boardLines = Math.max(...colLines.map((c) => c.reduce((a, e) => a + e.length, 0)));
  const boardH = 34 + boardLines * lineH + (boardLines > 1 ? 6 : 0) + 16, boardTop = PANEL_BOTTOM - boardH;

  const talk = spec.mouth === false ? "X" : visemeAt(f, 5, 10, dur - 20);
  const fr = pop(f, 16, 170), dash = -f * 0.7;
  const subT = pop(f, 34, 170), press = f >= 70 && f < 78 ? 1 - 0.07 * Math.sin(((f - 70) / 8) * Math.PI) : 1, ring = f >= 70 ? (f - 70) / 26 : 0;
  const ring_ = (t: number) => (t < 0 ? 0 : Math.sin(t / 2.6) * 16 * Math.exp(-t / 22)), bell = ring_(f - 34) + ring_(f - 70);
  const BTN = {w: 500, h: 96}, bx = BX + qW / 2 - BTN.w / 2, by = Math.max(BY + qH + 56, 600);
  let nextSize = 40, nextLines = spec.next ? wrap(spec.next, ROUND_FONT, nextSize, FRAME.w) : [];
  if (nextLines.length > 2) { nextSize = 34; nextLines = wrap(spec.next!, ROUND_FONT, nextSize, FRAME.w); }
  if (nextLines.length > 2) throw new Error(`end: next "${spec.next}" is too long (two lines of ${FRAME.w}px at most)`);

  return <div style={{position: "absolute", inset: 0, background: C.royal, overflow: "hidden"}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <rect x={-40} y={924} width={2000} height={200} fill={C.royalDark}/>
      <rect x={-40} y={924} width={2000} height={10} fill={C.white} opacity={0.4}/>
      <Push f={f} dur={dur} cam={spec.camera} dflt={{fx: 700, fy: 500, s0: 1, s1: 1.035}}>
        <Doodles f={f} seed="en" n={8} colors={[C.blue, C.royalDark]} area={[[500, 56, 1380, 100], [96, 80, 420, 240]]}/>
        <g transform={`translate(0 ${(1 - pop(f, 0, 140)) * 500})`}>
          <Keeper x={270} y={850} h={640} f={f} pose="point" viseme={talk} look={1}/>
        </g>
        <SpeechBubble lines={qLines} size={qSize} x={BX} y={BY} w={qW} h={qH} tx={400} ty={BY + qH * 0.62} f={f} at={8}/>
      </Push>
      <g transform={`translate(${FRAME.x + FRAME.w / 2} ${FRAME.y + FRAME.h / 2}) scale(${fr}) translate(${-(FRAME.x + FRAME.w / 2)} ${-(FRAME.y + FRAME.h / 2)})`}>
        <rect x={FRAME.x} y={FRAME.y + 10} width={FRAME.w} height={FRAME.h} rx={40} fill={C.ink}/>
        <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={40} fill={C.royalDark}/>
        <rect x={FRAME.x + 10} y={FRAME.y + 10} width={FRAME.w - 20} height={FRAME.h - 20} rx={32} fill="none" stroke={C.white} strokeWidth={7} strokeDasharray="30 20" strokeDashoffset={dash} strokeLinecap="round" opacity={0.8}/>
      </g>
    </svg>
    <div style={{position: "absolute", left: FRAME.x, top: FRAME.y - 66}}><Chip text="NEXT VIDEO" f={f} at={14} size={28} bg={C.yellow} fg={C.ink}/></div>
    {nextLines.length > 0 && <div style={{position: "absolute", left: FRAME.x, top: FRAME.y + FRAME.h + 22, width: FRAME.w, textAlign: "center", fontFamily: ROUND, fontWeight: 800, fontSize: nextSize, lineHeight: 1.1, letterSpacing: "-0.01em", color: C.white,
      opacity: ease(f, 26, 36), transform: `translateY(${(1 - ease(f, 26, 36)) * 16}px)`}}>{nextLines.map((l, i) => <div key={i}>{l}</div>)}</div>}

    <div style={{position: "absolute", left: bx, top: by, width: BTN.w, height: BTN.h, transform: `scale(${subT * press})`, transformOrigin: "50% 50%"}}>
      {ring > 0 && ring < 1 && <div style={{position: "absolute", inset: -ring * 40, borderRadius: 999, border: `6px solid ${C.white}`, opacity: 1 - ring}}/>}
      <div style={{position: "absolute", inset: 0, background: C.red, border: `8px solid ${C.ink}`, borderRadius: 999, boxShadow: `0 10px 0 ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 22}}>
        <svg width={58} height={58} viewBox="0 0 60 60" style={{transform: `rotate(${bell}deg)`, transformOrigin: "50% 10%"}}>
          <path d="M 30 6 C 17 6 12 17 12 28 L 12 38 L 6 46 L 54 46 L 48 38 L 48 28 C 48 17 43 6 30 6 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
          <path d="M 22 50 Q 30 60 38 50 Z" fill={C.yellow} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
        </svg>
        <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: 54, letterSpacing: 2, color: C.white, textShadow: `0 4px 0 ${C.redDark}`}}>{spec.subscribe ?? "SUBSCRIBE"}</span>
      </div>
    </div>

    <div style={{position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: boardTop, height: boardH, background: C.white, border: `8px solid ${C.ink}`, borderRadius: 30, boxShadow: `0 10px 0 ${C.ink}`,
      transform: `translateY(${(1 - ease(f, 24, 36)) * 140}px)`, opacity: ease(f, 24, 32), boxSizing: "border-box", padding: "30px 30px 0", display: "flex", gap: 40}}>
      <div style={{position: "absolute", left: 28, top: -26}}><Chip text="SOURCES" f={f} at={28} size={24}/></div>
      {colLines.map((col, ci) => <div key={ci} style={{flex: 1, display: "flex", flexDirection: "column", gap: 0}}>
        {col.map((ent, ei) => <div key={ei} style={{display: "flex", gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: sSize, lineHeight: `${lineH}px`, color: C.ink}}>
          <span style={{flex: "none", width: 10, height: 10, borderRadius: 5, background: C.royal, marginTop: lineH / 2 - 5}}/>
          <div>{ent.map((l, li) => <div key={li}>{l}</div>)}</div>
        </div>)}
      </div>)}
    </div>
  </div>;
};
