// Scene kind "notebook" (UPSC monsoon film, 2 Nov 2026): an open lined notebook filling most of the frame, the kid small at one side. Each line is
// handwritten on (a pen-front reveal with a pencil riding the front) from its at(key); `strike` is already written at the top and is struck through
// in red at at(strike.key). Spec: {who, lines: [{text, key}], strike?: {text, key}}. Text only; no figure is printed here (so no fig() / lab()).
// Hand font: Virgil (public/fonts/Virgil-Regular.woff2, OFL), loaded with a FontFace under delayRender so a still never paints the fallback.
import React from "react";
import {cancelRender, continueRender, delayRender, staticFile} from "remotion";
import {C} from "../../palette";
import {ease, easeIO, pop} from "../../ui";
import {Actor, WHO, type Who} from "../cast";
import {H, W, type SceneProps} from "../contract";

export type NotebookSpec = {who: Who; lines: {text: string; key: string}[]; strike?: {text: string; key: string}; notes?: string};

const HAND = "Virgil, 'Segoe Print', 'Comic Sans MS', sans-serif";
const PEN = "#1B3FA0", RED = C.red;
let fontP: Promise<void> | null = null, fontOk = false;
const loadHand = (): Promise<void> => (fontP ??= new FontFace("Virgil", `url(${staticFile("fonts/Virgil-Regular.woff2")})`).load().then((ff) => { document.fonts.add(ff); fontOk = true; }));
const useHand = (): boolean => {
  const [ready, setReady] = React.useState(fontOk);
  const [h] = React.useState(() => (fontOk ? null : delayRender("notebook: Virgil font")));
  React.useEffect(() => {
    if (fontOk) { if (h !== null) continueRender(h); return; }
    loadHand().then(() => { setReady(true); if (h !== null) continueRender(h); }, (e) => cancelRender(e));
  }, [h]);
  return ready || fontOk;
};

// Greedy word wrap with the real font (canvas measure; the font is loaded before the first real paint, so every frame wraps the same way).
const ctx = (() => { try { return document.createElement("canvas").getContext("2d"); } catch { return null; } })();
const widthOf = (t: string, px: number) => { if (!ctx) return t.length * px * 0.56; ctx.font = `${px}px Virgil`; return ctx.measureText(t).width; };
const wrapText = (t: string, px: number, max: number): string[] => {
  const out: string[] = []; let cur = "";
  for (const w of t.split(" ")) { const next = cur ? `${cur} ${w}` : w; if (cur && widthOf(next, px) > max) { out.push(cur); cur = w; } else cur = next; }
  if (cur) out.push(cur);
  return out;
};

const PAGE = {x: 120, y: 112, w: 1450, h: 806};          // the page (ends at y 918, above the caption strip)
const TEXT_X = PAGE.x + 190, TEXT_MAX = PAGE.w - 190 - 70;
const TOP = PAGE.y + 118;                                // first baseline

type Row = {text: string; y: number; t0: number; t1: number};

export const Scene: React.FC<SceneProps<NotebookSpec>> = ({f, dur, spec, at}) => {
  const ready = useHand();
  if (!WHO.includes(spec.who)) throw new Error(`notebook: unknown who "${spec.who}" (known: ${WHO.join(", ")})`);
  if (!spec.lines?.length) throw new Error("notebook: needs at least one line");
  const sk = spec.strike, skAt = sk ? at(sk.key) : 0;
  const times = spec.lines.map((l) => at(l.key));

  // font size: the biggest (80 down to 36 px) at which every wrapped line fits on the page
  let size = 80, rows: string[][] = [];
  if (ready) {
    for (; size >= 36; size -= 2) {
      rows = spec.lines.map((l) => wrapText(l.text, size, TEXT_MAX * 0.86));   // margin: the hand font can render wider than measured
      const n = rows.reduce((a, r) => a + r.length, 0) + (sk ? 1 : 0);
      if (n * size * 1.46 + size * 0.34 * (spec.lines.length - 1) <= PAGE.h - 118 - 70) break;
    }
  }
  const pitch = size * 1.46;

  // layout: the struck line first, then each line's wrapped rows; a line is written over the time to the next key (16 to 78 frames)
  const layout: Row[] = [];
  let y = TOP + (sk ? pitch : 0);
  spec.lines.forEach((_, i) => {
    const rs = rows[i] ?? [], chars = rs.reduce((a, r) => a + r.length, 0) || 1;
    const span = Math.min(78, Math.max(16, Math.min(i + 1 < times.length ? times[i + 1] - times[i] - 6 : 66, dur - 6 - times[i])));
    let acc = 0;
    rs.forEach((text, k) => { layout.push({text, y: y + k * pitch, t0: times[i] + (span * acc) / chars, t1: times[i] + (span * (acc + text.length)) / chars}); acc += text.length; });
    y += rs.length * pitch + size * 0.34;
  });

  const active = layout.find((r) => f >= r.t0 && f <= r.t1 + 6);
  const stamp = pop(f, 0, 140), push = 1 + 0.03 * easeIO(f, 0, dur);
  const cx = PAGE.x + PAGE.w / 2, cy = PAGE.y + PAGE.h / 2;

  const rowText = (r: Row, i: number) => {
    if (f < r.t0) return null;
    const w = widthOf(r.text, size), k = ease(f, r.t0, Math.max(r.t0 + 4, r.t1), 0, 1);
    return <g key={i}>
      <clipPath id={`nb-clip-${i}`}><rect x={TEXT_X - 6} y={r.y - size * 1.05} width={k >= 1 ? 2000 : Math.max(0, w * k * 1.25) + 10} height={size * 1.5}/></clipPath>
      <text x={TEXT_X} y={r.y} fontFamily={HAND} fontSize={size} fill={PEN} clipPath={`url(#nb-clip-${i})`} style={{letterSpacing: 0.4}}>{r.text}</text>
    </g>;
  };

  const strikeW = sk ? widthOf(sk.text, size) : 0;
  const pencilAt = active ? {x: TEXT_X + widthOf(active.text, size) * ease(f, active.t0, Math.max(active.t0 + 4, active.t1), 0, 1), y: active.y} : null;
  const wob = Math.sin(f * 1.7) * 2.2;

  return <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: C.floor}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
      {/* desk */}
      <rect x={0} y={0} width={W} height={H} fill="#D9A566"/>
      {Array.from({length: 9}, (_, i) => <line key={i} x1={0} x2={W} y1={i * 130 + 40} y2={i * 130 + 40} stroke="#BE8A4F" strokeWidth={6}/>)}
      {Array.from({length: 7}, (_, i) => <line key={i} x1={i * 290 + 140} x2={i * 290 + 134} y1={(i % 2) * 130 + 40} y2={(i % 2) * 130 + 170} stroke="#BE8A4F" strokeWidth={5}/>)}
      <g transform={`translate(${cx} ${cy}) scale(${push}) translate(${-cx} ${-cy})`}>
        <g transform={`translate(${cx} ${cy}) scale(${0.9 + 0.1 * Math.min(1.06, stamp)}) rotate(-1.1) translate(${-cx} ${-cy})`}>
          {/* notebook: cover edge, page, spiral, margin, ruled lines */}
          <rect x={PAGE.x - 40} y={PAGE.y - 22} width={PAGE.w + 76} height={PAGE.h + 58} rx={36} fill={C.royalDark} stroke={C.ink} strokeWidth={8}/>
          <rect x={PAGE.x + 14} y={PAGE.y + 22} width={PAGE.w} height={PAGE.h} rx={22} fill="#EFE7D2" stroke={C.ink} strokeWidth={5}/>
          <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={22} fill="#FFFDF4" stroke={C.ink} strokeWidth={8}/>
          {Array.from({length: Math.floor((PAGE.y + PAGE.h - 26 - (TOP + 12 - pitch)) / pitch) + 1}, (_, i) => { const yy = TOP + 12 - pitch + i * pitch; return <line key={i} x1={PAGE.x + 20} x2={PAGE.x + PAGE.w - 24} y1={yy} y2={yy} stroke="#BFD7F0" strokeWidth={4}/>; })}
          <line x1={PAGE.x + 150} x2={PAGE.x + 150} y1={PAGE.y + 8} y2={PAGE.y + PAGE.h - 8} stroke="#F0A0A0" strokeWidth={5}/>
          {Array.from({length: 11}, (_, i) => { const yy = PAGE.y + 60 + i * 70; return <g key={i}><circle cx={PAGE.x + 52} cy={yy} r={14} fill="#2A3355" stroke={C.ink} strokeWidth={4}/>
            <path d={`M ${PAGE.x - 22} ${yy - 7} Q ${PAGE.x + 20} ${yy - 22} ${PAGE.x + 60} ${yy - 4}`} fill="none" stroke="#C7D0E0" strokeWidth={10} strokeLinecap="round"/>
            <path d={`M ${PAGE.x - 22} ${yy - 7} Q ${PAGE.x + 20} ${yy - 22} ${PAGE.x + 60} ${yy - 4}`} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={0.7}/></g>; })}
          {/* the struck line: written already, struck through in red at its key */}
          {sk && <g>
            <text x={TEXT_X} y={TOP} fontFamily={HAND} fontSize={size} fill={PEN} style={{letterSpacing: 0.4}}>{sk.text}</text>
            {f >= skAt && (() => { const k = ease(f, skAt, skAt + 10, 0, 1), x1 = TEXT_X - 14, x2 = TEXT_X + strikeW + 14, yy = TOP - size * 0.3;
              return <path d={`M ${x1} ${yy + 4} Q ${(x1 + x2) / 2} ${yy - 12} ${x1 + (x2 - x1) * k} ${yy + 2 - 10 * k}`} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round"/>; })()}
          </g>}
          {layout.map(rowText)}
          {/* the pencil, tip on the writing front */}
          {pencilAt && <g transform={`translate(${pencilAt.x + 6} ${pencilAt.y - 10 + wob}) rotate(-38)`}>
            <path d="M 0 0 L 34 -13 L 34 13 Z" fill="#F3D9A8" stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/>
            <path d="M 0 0 L 12 -5 L 12 5 Z" fill={C.ink}/>
            <rect x={34} y={-13} width={110} height={26} fill={C.yellow} stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/>
            <line x1={34} x2={144} y1={-4} y2={-4} stroke={C.orange} strokeWidth={4}/>
            <rect x={144} y={-13} width={20} height={26} fill="#9DB7D3" stroke={C.ink} strokeWidth={6}/>
            <path d="M 164 -13 L 192 -13 Q 202 0 192 13 L 164 13 Z" fill="#F29CB0" stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/>
          </g>}
        </g>
        {/* the kid, small, at the side */}
        <Actor who={spec.who} x={1700} y={940} h={430} f={f} pose={active ? "point" : "present"} mouth="X" seed={5}/>
      </g>
    </svg>
  </div>;
};
