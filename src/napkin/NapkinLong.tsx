// Napkin-math LONG video template (AK 8 Oct 2026: "today video ... Napkin math template, identical to VOX").
// Renders the same beats as the Vox engine (scripts/vx_scripts.py -> public/vx/<id>/data.json): same narration, timing,
// chapters, clips and scene types, drawn as hand-written napkin math on paper (handkit: Rough.js strokes + Virgil handwriting).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";
import {FPS, VData, Beat, beatFrames, longLayout} from "../vx/VoxEngine";

export const NW = 1920, NH = 1080;
const GREY = "#6c757d", MUSTARD = "#f1c40f";
type TFn = (x: any, off?: number) => number;
const makeT = (b: Beat): TFn => (x, off = 0) => {
  if (typeof x === "number") return x + off;
  const [p, o] = String(x).split("|");
  const i = b.say.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * FPS * i / b.say.length) + (o ? parseInt(o, 10) : 0) + off;
};
const seedOf = (k: string) => k.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
// Font size that keeps handwriting inside maxW (HWrite's width estimate is len * size * 0.62).
// Writing duration that finishes before the beat ends (n = beat frames).
const lim = (n: number, st: number, len: number) => Math.max(6, Math.min(10 + len * 1.3, 45, n - st - 8));
const fit = (t: string, size: number, maxW: number) => Math.min(size, Math.floor(maxW / (Math.max(1, t.length) * 0.62)));

type SP = {s: any; T: TFn; b: Beat; D: VData; n: number};
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={NW} height={NH} viewBox={`0 0 ${NW} ${NH}`} style={{position: "absolute"}}>{children}</svg>
);
const Heading: React.FC<{text?: string; seed: number}> = ({text, seed}) => !text ? null : (
  <>
    <HWrite x={960} y={140} start={0} size={fit(text, 46, 1700)} anchor="middle" color={GREY} hand={false} dur={10}>{text}</HWrite>
    <HDraw shape={sh.line(560, 168, 1360, 168, {strokeWidth: 3, stroke: GREY, seed})} start={4} dur={10} hand={false}/>
  </>
);

// ---------- scenes ----------
const Title: React.FC<SP> = ({s, b, D}) => {
  const lines: string[] = s.lines || [];
  return (
    <Svg>
      <HWrite x={560} y={640} start={0} size={360} color={RED} anchor="middle" dur={12}>{String(b.ch)}</HWrite>
      <HWrite x={1180} y={360} start={4} size={40} color={GREY} anchor="middle" hand={false}>{`chapter ${b.ch}`}</HWrite>
      {lines.map((t, i) => <HWrite key={i} x={1180} y={500 + i * 130} start={8 + i * 10} size={fit(t, 110, 900)} anchor="middle">{t.toLowerCase()}</HWrite>)}
      <HDraw shape={sh.line(780, 500 + lines.length * 130 - 60, 1580, 500 + lines.length * 130 - 70, {strokeWidth: 6, stroke: RED, seed: seedOf(b.key)})} start={20} dur={12}/>
    </Svg>
  );
};

const Cards: React.FC<SP> = ({s, T, b, n}) => {
  const cards: any[] = s.cards || []; const cn = cards.length;
  const w = Math.min(420, (1700 - (cn - 1) * 40) / cn), gap = 40, x0 = (NW - (cn * w + (cn - 1) * gap)) / 2, y = 300, h = 380;
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      {cards.map((c, i) => {
        const x = x0 + i * (w + gap), st = T(c.at ?? 0);
        const col = c.fill === "mustard" ? RED : INK;
        return <g key={i}>
          <HDraw shape={sh.rect(x, y, w, h, {seed: seedOf(b.key) + i, stroke: c.fill === "mustard" ? RED : INK, strokeWidth: 4})} start={st} dur={14} hand={false}/>
          <HWrite x={x + w / 2} y={y + 80} start={st + 4} size={fit(String(c.top || ""), 34, w - 40)} anchor="middle" color={GREY} hand={false}>{String(c.top || "").toLowerCase()}</HWrite>
          <HWrite x={x + w / 2} y={y + 230} start={st + 8} size={fit(String(c.big), 110, w - 40)} anchor="middle" color={col} dur={lim(n, st + 8, String(c.big).length)}>{String(c.big)}</HWrite>
          {c.sub && <HWrite x={x + w / 2} y={y + 320} start={st + 14} size={fit(String(c.sub), 28, w - 40)} anchor="middle" color={GREY} hand={false}>{String(c.sub).toLowerCase()}</HWrite>}
        </g>;
      })}
    </Svg>
  );
};

const Strips: React.FC<SP> = ({s, T, b, n}) => {
  const items: any[] = s.items || []; const cn = items.length;
  const gap = cn > 3 ? 120 : 150, y0 = 540 - ((cn - 1) * gap) / 2 + 20;
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      {items.map((it, i) => {
        const t = String(it.text).toLowerCase(), size = fit(t, 84, 1600), st = T(it.at ?? 0), y = y0 + i * gap;
        const w = t.length * size * 0.62;
        return <g key={i}>
          <HWrite x={960} y={y} start={st} size={size} anchor="middle" color={it.red ? RED : INK} dur={lim(n, st, t.length)}>{t}</HWrite>
          {it.red && <HDraw shape={sh.line(960 - w / 2, y + 22, 960 + w / 2, y + 16, {stroke: RED, strokeWidth: 5, seed: seedOf(b.key) + i})} start={st + 10} dur={10} hand={false}/>}
        </g>;
      })}
    </Svg>
  );
};

const Counter: React.FC<SP> = ({s, T, b, n}) => {
  const st = T(s.at ?? 0);
  const v = Number(s.to).toFixed(s.decimals ?? 0) + (s.suffix || "");
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      <HWrite x={960} y={600} start={st} size={300} anchor="middle" color={RED} dur={Math.min(14, lim(n, st, 4))}>{v}</HWrite>
      <HDraw shape={sh.ellipse(960, 510, 820, 360, {stroke: RED, strokeWidth: 6, seed: seedOf(b.key)})} start={st + 14} dur={14}/>
      {s.sub && <HWrite x={960} y={810} start={Math.min(st + 18, n - 20)} size={fit(s.sub, 40, 1500)} anchor="middle" color={GREY} hand={false} dur={10}>{String(s.sub).toLowerCase()}</HWrite>}
    </Svg>
  );
};

const Bars: React.FC<SP> = ({s, T, b}) => {
  const rows: any[] = s.rows || []; const n = rows.length;
  const max = Math.max(...rows.map((r) => r.v)), gap = Math.min(140, 620 / n), y0 = 300;
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      {rows.map((r, i) => {
        const st = T(r.at ?? 0), y = y0 + i * gap, bw = Math.max(8, 820 * r.v / max), red = r.red || i === n - 1 && s.lastRed;
        return <g key={i}>
          <HWrite x={180} y={y + 45} start={st} size={fit(String(r.name), 46, 440)} anchor="start" color={INK} hand={false} dur={8}>{String(r.name).toLowerCase()}</HWrite>
          <HDraw shape={sh.rect(660, y, bw, gap * 0.6, {fill: red ? RED : BLUE, fillStyle: "hachure", hachureGap: 9, stroke: red ? RED : BLUE, seed: seedOf(b.key) + i})} start={st + 2} dur={14} hand={false}/>
          <HWrite x={660 + bw + 24} y={y + 50} start={st + 12} size={52} color={red ? RED : INK}>{String(r.label)}</HWrite>
        </g>;
      })}
    </Svg>
  );
};
const Table: React.FC<SP> = ({s, T, b, n}) => {
  const cols: string[] = s.cols || []; const rows: any[] = s.rows || []; const nc = cols.length;
  const x0 = 220, w = 1480, first = nc > 2 ? 640 : 900, rest = (w - first) / Math.max(1, nc - 1);
  const cx = (j: number) => (j === 0 ? x0 + 10 : x0 + first + (j - 1) * rest + rest / 2);
  const rh = Math.min(110, 560 / Math.max(1, rows.length)), y0 = 330;
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      {cols.map((c, j) => c && <HWrite key={j} x={cx(j)} y={y0 - 30} start={0} size={36} anchor={j === 0 ? "start" : "middle"} color={GREY} hand={false} dur={8}>{c.toLowerCase()}</HWrite>)}
      <HDraw shape={sh.line(x0, y0, x0 + w, y0, {strokeWidth: 4, seed: seedOf(b.key)})} start={2} dur={12} hand={false}/>
      {rows.map((r, i) => {
        const st = T(r.at ?? 0), y = y0 + (i + 1) * rh;
        return <g key={i}>
          {(r.cells as string[]).map((c, j) => c && <HWrite key={j} x={cx(j)} y={y - rh * 0.3} start={st + j * 5} size={fit(c, j === 0 ? 50 : 58, j === 0 ? first - 30 : rest - 20)} anchor={j === 0 ? "start" : "middle"} color={j === 0 ? INK : (String(c).includes("−") ? RED : BLUE)} dur={lim(n, st + j * 5, String(c).length)}>{c}</HWrite>)}
          <HDraw shape={sh.line(x0, y, x0 + w, y, {strokeWidth: 2, stroke: "#ced4da", seed: seedOf(b.key) + i + 1})} start={st} dur={8} hand={false}/>
        </g>;
      })}
    </Svg>
  );
};

const List: React.FC<SP> = ({s, T, b, n}) => {
  const items: any[] = s.items || []; const start = s.start ?? 1; const gap = Math.min(125, 620 / Math.max(1, items.length));
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      {items.map((it, i) => {
        const st = T(it.at ?? 0), y = 300 + i * gap, t = String(it.text).toLowerCase();
        return <g key={i}>
          <HWrite x={260} y={y} start={st} size={70} color={RED} anchor="middle" hand={false} dur={6}>{String(start + i)}</HWrite>
          <HDraw shape={sh.circle(260, y - 24, 90, {stroke: RED, strokeWidth: 3, seed: seedOf(b.key) + i})} start={st} dur={8} hand={false}/>
          <HWrite x={340} y={y} start={st + 4} size={fit(t, 56, 1400)} dur={lim(n, st + 4, t.length)}>{t}</HWrite>
        </g>;
      })}
    </Svg>
  );
};

const Hand: React.FC<SP> = ({s, T, b, n}) => {
  const items: any[] = s.items || []; const gap = Math.min(130, 520 / Math.max(1, items.length));
  return (
    <Svg>
      <HWrite x={360} y={250} start={0} size={80} color={RED}>{String(s.title || "")}</HWrite>
      {items.map((it, i) => {
        const st = T(it.at ?? 0), y = 400 + i * gap;
        return <g key={i}>
          <HDraw shape={sh.rect(360, y - 50, 56, 56, {strokeWidth: 3, seed: seedOf(b.key) + i})} start={st} dur={8} hand={false}/>
          <HDraw shape={sh.line(370, y - 22, 384, y - 2, {stroke: GREEN, strokeWidth: 5, seed: 3 + i})} start={st + 6} dur={4} hand={false}/>
          <HDraw shape={sh.line(384, y - 2, 412, y - 46, {stroke: GREEN, strokeWidth: 5, seed: 4 + i})} start={st + 9} dur={5} hand={false}/>
          <HWrite x={450} y={y} start={st + 2} size={fit(String(it.text), 62, 1300)} dur={lim(n, st + 2, String(it.text).length)}>{String(it.text)}</HWrite>
        </g>;
      })}
    </Svg>
  );
};

const Scores: React.FC<SP> = ({s, b}) => {
  const rows: any[] = s.rows || []; const gap = Math.min(120, 520 / Math.max(1, rows.length));
  return (
    <Svg>
      <HWrite x={960} y={180} start={0} size={70} anchor="middle" color={RED}>moatscore</HWrite>
      {rows.map(([name, v]: [string, number], i: number) => {
        const st = 10 + i * 12, y = 330 + i * gap, bw = 700 * (v / 10);
        return <g key={i}>
          <HWrite x={300} y={y + 40} start={st} size={fit(name, 54, 560)} hand={false} dur={8}>{name}</HWrite>
          <HDraw shape={sh.rect(880, y, bw, gap * 0.55, {fill: v >= 5.5 ? GREEN : MUSTARD, fillStyle: "hachure", hachureGap: 9, stroke: INK, seed: seedOf(b.key) + i})} start={st + 2} dur={14} hand={false}/>
          <HWrite x={880 + bw + 24} y={y + 45} start={st + 12} size={56}>{v.toFixed(2)}</HWrite>
        </g>;
      })}
      {s.note && <HWrite x={960} y={330 + rows.length * gap + 80} start={30} size={fit(s.note, 30, 1600)} anchor="middle" color={GREY} hand={false}>{String(s.note).toLowerCase()}</HWrite>}
    </Svg>
  );
};

const Clip: React.FC<SP> = ({s, T, D, b, n}) => {
  const c = D.clips[s.clip]; const f = useCurrentFrame();
  const w = Math.min(1500, 520 * c.w / c.h), ih = w * c.h / c.w, pad = 22;
  const x = (NW - w - pad * 2) / 2, y = Math.max(230, 470 - (ih + pad * 2) / 2);
  const hl0 = T((s.hl || [0])[0]); const p = Math.max(0, Math.min(1, (f - hl0) / 12));
  const st: any = (s.stamps || [])[0];
  const sy = Math.min(860, y + ih + pad * 2 + 110);
  return (
    <Svg>
      <Heading text={s.heading} seed={seedOf(b.key)}/>
      <g transform={`rotate(-0.8 ${x + w / 2} ${y + ih / 2})`}>
        <rect x={x} y={y} width={w + pad * 2} height={ih + pad * 2} fill="#ffffff" stroke="#adb5bd" strokeWidth={2}/>
        <image href={staticFile(`vx/${D.id}/clips/${s.clip}.png`)} x={x + pad} y={y + pad} width={w} height={ih}/>
        {c.hl.map(([hx, hy, hw, hh], i) => <rect key={i} x={x + pad + hx * w} y={y + pad + hy * ih} width={hw * w * p} height={hh * ih} fill={MUSTARD} opacity={0.45} style={{mixBlendMode: "multiply"}}/>)}
        <rect x={x - 20} y={y - 18} width={120} height={34} fill="#fff3bf" opacity={0.85} transform={`rotate(-12 ${x + 40} ${y})`}/>
        <rect x={x + w - 60} y={y - 16} width={120} height={34} fill="#fff3bf" opacity={0.85} transform={`rotate(10 ${x + w} ${y})`}/>
      </g>
      {st && <>
        <HWrite x={960} y={sy} start={T(st.at ?? 0)} size={fit(String(st.text).toLowerCase(), 70, 1500)} anchor="middle" color={RED} dur={lim(n, T(st.at ?? 0), String(st.text).length)}>{String(st.text).toLowerCase()}</HWrite>
        <HDraw shape={sh.ellipse(960, sy - 22, Math.min(1600, String(st.text).length * fit(String(st.text).toLowerCase(), 70, 1500) * 0.62 + 120), 120, {stroke: RED, strokeWidth: 5, seed: seedOf(b.key)})} start={T(st.at ?? 0) + 12} dur={14}/>
      </>}
    </Svg>
  );
};

const Sources: React.FC<SP> = ({s}) => (
  <Svg>
    <HWrite x={960} y={180} start={0} size={66} anchor="middle" color={RED}>sources · primary documents</HWrite>
    {(s.items || []).map((t: string, i: number) => <HWrite key={i} x={300} y={320 + i * 95} start={8 + i * 10} size={fit(t, 46, 1400)} hand={false}>{`· ${t}`}</HWrite>)}
  </Svg>
);
const End: React.FC<SP> = ({b}) => (
  <Svg>
    <HWrite x={960} y={460} start={0} size={130} anchor="middle">moat &amp; margin</HWrite>
    <HDraw shape={sh.line(560, 500, 1360, 494, {stroke: RED, strokeWidth: 7, seed: seedOf(b.key)})} start={14} dur={12}/>
    <HWrite x={960} y={620} start={20} size={56} anchor="middle" color={BLUE}>moatmarginresearch.com</HWrite>
  </Svg>
);

const SCENES: Record<string, React.FC<SP>> = {title: Title, cards: Cards, strips: Strips, counter: Counter, bars: Bars, table: Table,
  list: List, hand: Hand, scores: Scores, clip: Clip, sources: Sources, end: End};

// ---------- furniture ----------
const NCaptions: React.FC<{cues: string[]; frames: number}> = ({cues, frames}) => {
  const f = useCurrentFrame();
  const total = cues.reduce((a, c) => a + c.length, 0) || 1;
  let acc = 0, cur = cues[0] || "";
  for (const c of cues) { const end = (acc + c.length) / total * frames; cur = c; if (f < end) break; acc += c.length; }
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 110, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.8)", color: INK, fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 36,
        lineHeight: 1.4, padding: "6px 14px", borderRadius: 8}}>{cur}</span>
    </div>
  );
};

const Furniture: React.FC<{D: VData; ch: number}> = ({D, ch}) => (
  <>
    <div style={{position: "absolute", left: 50, top: 34, transform: "rotate(-4deg)", background: "#ffe066", border: "2px solid #e0b800",
      padding: "8px 26px", fontFamily: HANDFONT, fontSize: 40, color: INK}}>napkin math</div>
    <div style={{position: "absolute", right: 60, top: 44, fontFamily: HANDFONT, fontSize: 34, color: GREY}}>{D.chapters[ch] ? `${ch > 0 && ch < D.chapters.length - 1 ? ch + " · " : ""}${D.chapters[ch].toLowerCase()}` : ""}</div>
    <div style={{position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: HANDFONT, fontSize: 24, color: GREY}}>
      Moat &amp; Margin · from the filings</div>
  </>
);

const BeatSeq: React.FC<{D: VData; b: Beat; from: number; n: number}> = ({D, b, from, n}) => {
  const T = makeT(b); const S = SCENES[b.scene.type] || Strips;
  return (
    <Sequence from={from} durationInFrames={n}>
      <AbsoluteFill style={{background: PAPER}}>
        <S s={b.scene} T={T} b={b} D={D} n={n}/>
        <Furniture D={D} ch={b.ch}/>
        {b.scene.type !== "title" && b.scene.type !== "end" && <NCaptions cues={b.cues && b.cues.length ? b.cues : [b.cap || b.say]} frames={Math.round(b.sec * FPS)}/>}
      </AbsoluteFill>
      <Audio src={staticFile(`vx/${D.id}/${b.key}.mp3`)}/>
    </Sequence>
  );
};

export const napkinLayout = (D: VData) => longLayout(D);
export const NapkinLong: React.FC<{D: VData}> = ({D}) => {
  const {frames, starts} = longLayout(D);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      {D.beats.map((b, i) => <BeatSeq key={b.key} D={D} b={b} from={starts[i]} n={frames[i]}/>)}
    </AbsoluteFill>
  );
};
export {beatFrames};
