// Vox engine: data-driven Vox-collage videos (16:9 long-form and 9:16 shorts) from public/vx/<id>/data.json.
// Every scene lays itself out for the current composition size; timings come from phrases in the narration.
import React from "react";
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from "remotion";
import {C, COND, TYPE, Drift, Pin, Stage, Stamp, Strip, Tape, TornCard, TypeLabel, VoxDefs, VoxFonts} from "../voxkit";
import {HDraw, HWrite, sh, RED as HRED} from "../handkit";

export const FPS = 30;
export type Beat = {ch: number; key: string; say: string; cap: string; sec: number; cues: string[]; scene: any};
export type VData = {id: string; title: string; chapters: string[]; shorts: {title: string; beats: string[]; hook?: string; loop?: boolean}[];
  timelines: Record<string, string[][]>; beats: Beat[]; clips: Record<string, {w: number; h: number; hl: number[][]}>};

const isTitle = (b: Beat) => b.scene.type === "title";
export const beatFrames = (b: Beat) => Math.ceil((b.sec + (isTitle(b) ? 1.1 : 0.5)) * FPS);

// ---------- timing ----------
type TFn = (x: any, off?: number) => number;
const makeT = (b: Beat): TFn => (x, off = 0) => {
  if (typeof x === "number") return x + off;
  const [p, o] = String(x).split("|");
  const i = b.say.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * FPS * i / b.say.length) + (o ? parseInt(o, 10) : 0) + off;
};

// ---------- layout ----------
const useL = () => {
  const {width: W, height: H} = useVideoConfig();
  const land = W > H;
  return {W, H, land, cx: W / 2, top: land ? 150 : 330, bot: land ? 880 : 1480, cw: land ? 1640 : 980};
};
const fit = (text: string, size: number, maxW: number, k = 0.52) => Math.min(size, maxW / (Math.max(1, text.length) * k + 0.8));
const fmtIN = (v: number, d = 0) => {
  const [i, f] = v.toFixed(d).split(".");
  const last3 = i.slice(-3), rest = i.slice(0, -3);
  const s = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return f ? `${s}.${f}` : s;
};
const fillOf = (f?: string) => f === "mustard" ? C.mustard : f === "red" ? C.red : C.white;

const Big: React.FC<{x: number; y: number; text: string; size: number; color?: string; anchor?: "start" | "middle" | "end"; font?: string}> =
  ({x, y, text, size, color = C.ink, anchor = "middle", font = COND}) =>
  <text x={x} y={y} fontFamily={font} fontWeight={font === COND ? 700 : 400} fontSize={size} textAnchor={anchor} fill={color}>{text}</text>;

const Svg: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => {
  const {W, H} = useL();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
      <VoxDefs/><Stage w={W} h={H}/><Drift frames={n} cx={W / 2} cy={H / 2}>{children}</Drift>
    </svg>
  );
};
const Heading: React.FC<{text?: string}> = ({text}) => {
  const L = useL();
  if (!text) return null;
  return <Strip x={L.cx} y={L.top + (L.land ? 10 : 0)} start={0} text={text} size={fit(text, L.land ? 60 : 56, L.cw)}/>;
};
const Stamps: React.FC<{s: any; T: TFn; y?: number}> = ({s, T, y}) => {
  const L = useL();
  return <>{(s.stamps || []).map((st: any, i: number) => {
    const size = fit(st.text, L.land ? 62 : 58, L.cw - 120, 0.56);
    const yy = st.y ?? y ?? (L.land ? L.bot - 40 - i * 110 : 1330 - i * 130);
    const sw = st.text.length * size * 0.55 + 70;
    const x = st.x ?? (L.land ? Math.max(sw / 2 + 60, Math.min(L.W - 520, L.W - 70 - sw / 2)) : L.cx);
    return <Stamp key={i} x={x} y={yy} start={T(st.at)} text={st.text} size={size} rot={i % 2 ? 5 : -6}/>;
  })}</>;
};
const HighlightBand: React.FC<{x: number; y: number; w: number; h: number; start: number}> = ({x, y, w, h, start}) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (f - start) / 10));
  return p > 0 ? <rect x={x} y={y} width={w * p} height={h} fill={C.mustard} opacity={0.45} style={{mixBlendMode: "multiply"}}/> : null;
};
const wrap = (text: string, max: number) => {
  const out: string[] = []; let cur = "";
  for (const w of text.split(" ")) { if ((cur + " " + w).trim().length > max) { out.push(cur.trim()); cur = w; } else cur += " " + w; }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

// ---------- scenes ----------
type SP = {s: any; n: number; T: TFn; b: Beat; D: VData};

const Title: React.FC<SP> = ({s, n, b}) => {
  const L = useL();
  const lines: string[] = s.lines;
  return (
    <Svg n={n}>
      {L.land ? <>
        <Big x={430} y={760} text={String(b.ch)} size={560} color={C.mustard}/>
        <TypeLabel x={760} y={330} start={0} text={`CHAPTER ${b.ch}`} size={40} cps={3}/>
        {lines.map((t, i) => <Strip key={i} x={1200} y={500 + i * 150} start={4 + i * 8} text={t} size={fit(t, 88, 1300)} fill={i === 1 && s.red ? C.red : C.white} color={i === 1 && s.red ? C.white : C.ink}/>)}
      </> : <>
        <Big x={540} y={900} text={String(b.ch)} size={520} color={C.mustard}/>
        <TypeLabel x={380} y={1010} start={0} text={`CHAPTER ${b.ch}`} size={40} cps={3}/>
        {lines.map((t, i) => <Strip key={i} x={540} y={1160 + i * 140} start={4 + i * 8} text={t} size={fit(t, 80, 960)}/>)}
      </>}
    </Svg>
  );
};

const Strips: React.FC<SP> = ({s, n, T}) => {
  const L = useL();
  const k = s.items.length; const gap = L.land ? 165 : 190;
  const y0 = (L.top + L.bot) / 2 - ((k - 1) * gap) / 2 + (s.heading ? 60 : 0);
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      {s.items.map((it: any, i: number) => (
        <Strip key={i} x={L.cx} y={y0 + i * gap} start={T(it.at)} text={it.text} size={fit(it.text, L.land ? 84 : 76, L.cw)}
          fill={it.red ? C.red : C.white} color={it.red ? C.white : C.ink} rot={[-1, 1, -0.5, 0.8][i % 4]}/>
      ))}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};

const NumCounter: React.FC<{x: number; y: number; start: number; to: number; decimals?: number; prefix?: string; suffix?: string; size: number; color?: string}> =
  ({x, y, start, to, decimals = 0, prefix = "", suffix = "", size, color = C.red}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = interpolate(f, [start, start + 30], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  return <Big x={x} y={y} text={`${prefix}${fmtIN(to * p, decimals)}${suffix}`} size={size} color={color}/>;
};
const Counter: React.FC<SP> = ({s, n, T}) => {
  const L = useL();
  const txt = `${s.prefix || ""}${fmtIN(s.to, s.decimals || 0)}${s.suffix || ""}`;
  const size = fit(txt, L.land ? 260 : 230, L.cw, 0.5);
  const y = L.land ? 600 : 960;
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      <NumCounter x={L.cx} y={y} start={T(s.at)} to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} size={size}/>
      {s.sub && <Strip x={L.cx} y={y + (L.land ? 120 : 140)} start={T(s.at, 20)} text={s.sub} size={fit(s.sub, 44, L.cw)}/>}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};

const Cards: React.FC<SP> = ({s, n, T}) => {
  const L = useL();
  const k = s.cards.length;
  let boxes: {x: number; y: number; w: number; h: number}[];
  if (L.land) {
    const w = Math.min(560, (1700 - (k - 1) * 50) / k), h = 400, x0 = L.cx - (k * w + (k - 1) * 50) / 2;
    boxes = s.cards.map((_: any, i: number) => ({x: x0 + i * (w + 50), y: s.heading ? 300 : 260, w, h}));
  } else {
    const h = 280, gap = 50, y0 = (L.top + L.bot) / 2 - (k * h + (k - 1) * gap) / 2 + 40;
    boxes = s.cards.map((_: any, i: number) => ({x: 90, y: y0 + i * (h + gap), w: 900, h}));
  }
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      {s.cards.map((c: any, i: number) => {
        const bx = boxes[i];
        return (
          <TornCard key={i} x={bx.x} y={bx.y} w={bx.w} h={bx.h} start={T(c.at)} fill={fillOf(c.fill)} rot={[-1.5, 1.2, -1][i % 3]}>
            <Big x={bx.w / 2} y={bx.h * 0.25} text={c.top} size={fit(c.top, 38, bx.w - 50)}/>
            <Big x={bx.w / 2} y={bx.h * (c.sub ? 0.6 : 0.68)} text={c.big} size={fit(c.big, L.land ? 110 : 100, bx.w - 50, 0.5)} color={c.fill === "mustard" ? C.ink : C.red}/>
            {c.sub && <Big x={bx.w / 2} y={bx.h * 0.85} text={c.sub} size={fit(c.sub, 30, bx.w - 50, 0.62)} font={TYPE}/>}
          </TornCard>
        );
      })}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};

const Clip: React.FC<SP> = ({s, n, T, D}) => {
  const L = useL();
  const c = D.clips[s.clip]; const pad = 22;
  const hl0 = T((s.hl || [0])[0]);
  if (L.land && c.w / c.h < 5.5) {
    const w = Math.min(1640, 640 * c.w / c.h); const ih = w * c.h / c.w;
    const x = (L.W - w - pad * 2) / 2;
    const y = Math.max(260, 540 - (ih + pad * 2) / 2);
    return (
      <Svg n={n}>
        <Heading text={s.heading}/>
        <TornCard x={x} y={y} w={w + pad * 2} h={ih + pad * 2} start={2} fill="#ffffff" rot={-0.8}>
          <image href={staticFile(`vx/${D.id}/clips/${s.clip}.png`)} x={pad} y={pad} width={w} height={ih}/>
          {c.hl.map(([hx, hy, hw, hh], i) => <HighlightBand key={i} x={pad + hx * w} y={pad + hy * ih} w={hw * w} h={hh * ih} start={hl0 + i * 8}/>)}
          <Tape x={-30} y={-24} rot={-14} w={130}/><Tape x={w + pad * 2 - 100} y={-20} rot={12} w={130}/>
        </TornCard>
        <Stamps s={s} T={T} y={Math.min(L.bot, y + ih + pad * 2 + 90)}/>
      </Svg>
    );
  }
  // Portrait: the quoted words set large (exact source text), with the real clipping below as proof.
  const q: string = (c as any).quote || "";
  const lines = wrap(`“${q}…”`.replace(/^“(.)/, (m, ch) => "“…" + ch).replace("……", "…"), L.land ? 46 : 28);
  const fs = L.land ? 54 : 50, lh = L.land ? 70 : 66, qh = lines.length * lh + 70, qw = L.land ? 1560 : 980, qx = (L.W - qw) / 2, qy = L.land ? 230 : 440;
  const w = L.land ? Math.min(1500, 300 * c.w / c.h) : 1000, ih = w * c.h / c.w, cy = qy + qh + (L.land ? 40 : 60);
  const f = useCurrentFrame(); const p = Math.max(0, Math.min(1, (f - hl0) / 14));
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      <TornCard x={qx} y={qy} w={qw} h={qh} start={2} fill={C.white} rot={-1}>
        {lines.map((t, i) => <g key={i}>
          <rect x={40} y={46 + i * lh} width={Math.min(1, Math.max(0, p * lines.length - i)) * (t.length * fs * 0.6)} height={lh - 12} fill={C.mustard} opacity={0.5}/>
          <text x={46} y={46 + i * lh + fs * 0.92} fontFamily={TYPE} fontSize={fs} fill={C.ink}>{t}</text>
        </g>)}
      </TornCard>
      <TornCard x={(L.W - w - pad * 2) / 2} y={cy} w={w + pad * 2} h={ih + pad * 2} start={10} fill="#ffffff" rot={0.8}>
        <image href={staticFile(`vx/${D.id}/clips/${s.clip}.png`)} x={pad} y={pad} width={w} height={ih}/>
        {c.hl.map(([bx, by, bw, bh], i) => <HighlightBand key={i} x={pad + bx * w} y={pad + by * ih} w={bw * w} h={bh * ih} start={hl0 + i * 8}/>)}
        <Tape x={-30} y={-24} rot={-14} w={130}/>
      </TornCard>
      <Stamps s={s} T={T} y={Math.min(L.land ? 880 : 1330, cy + ih + pad * 2 + (L.land ? 80 : 110))}/>
    </Svg>
  );
};

const Quote: React.FC<SP> = ({s, n, T}) => {
  const L = useL();
  const size = L.land ? 60 : 54; const lines = wrap(s.text, L.land ? 42 : 30);
  const w = L.land ? 1560 : 980, lh = size * 1.35, h = lines.length * lh + 140;
  const x = (L.W - w) / 2, y = (L.top + L.bot) / 2 - h / 2;
  return (
    <Svg n={n}>
      <TornCard x={x} y={y} w={w} h={h} start={T(s.at, -6)} fill={C.white} rot={-1}>
        {lines.map((t, i) => <Big key={i} x={w / 2} y={90 + i * lh} text={t} size={size} font={TYPE}/>)}
      </TornCard>
      <TypeLabel x={x + 30} y={y + h + 80} start={T(s.at, 10)} text={s.who} size={L.land ? 30 : 26} cps={3}/>
      <Stamps s={s} T={T} y={Math.min(L.land ? 880 : 1360, y + h + (L.land ? 190 : 220))}/>
    </Svg>
  );
};

const Table: React.FC<SP> = ({s, n, T}) => {
  const L = useL();
  const cols: string[] = s.cols; const k = cols.length;
  const w = L.land ? 1500 : 1000; const x0 = (L.W - w) / 2;
  const fs = L.land ? 44 : 34; const rh = L.land ? 110 : 120;
  const cw = k === 2 ? [0.6, 0.4] : [0.46, 0.27, 0.27];
  const h = rh * (s.rows.length + 1) + 60; const y0 = (L.top + L.bot) / 2 - h / 2 + 40;
  const cx = (j: number) => cw.slice(0, j).reduce((a, v) => a + v, 0) * w;
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      <TornCard x={x0} y={y0} w={w} h={h} start={0} fill={C.paper} rot={-0.4}>
        {cols.map((c, j) => <Big key={j} x={cx(j) + 30} y={75} text={c} size={fit(c, fs * 0.8, cw[j] * w - 40)} anchor="start" color={C.gray}/>)}
        <line x1={20} y1={100} x2={w - 20} y2={100} stroke={C.ink} strokeWidth={3}/>
      </TornCard>
      {s.rows.map((r: any, i: number) => (
        <RowIn key={i} start={T(r.at)}>
          {r.cells.map((t: string, j: number) => (
            <Big key={j} x={x0 + cx(j) + 30} y={y0 + 100 + rh * (i + 0.72)} text={t} size={fit(t, j === 0 ? fs : fs * 1.25, cw[j] * w - 40, j === 0 ? 0.48 : 0.52)}
              anchor="start" color={j === 0 ? C.ink : C.red} font={COND}/>
          ))}
        </RowIn>
      ))}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};
const RowIn: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const sp = spring({frame: f - start, fps, config: {damping: 14, stiffness: 160}});
  return <g transform={`translate(${(1 - sp) * -60} 0)`} opacity={Math.min(1, sp * 1.5)}>{children}</g>;
};

const Bars: React.FC<SP> = ({s, n, T}) => {
  const L = useL(); const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const rows = s.rows; const max = Math.max(...rows.map((r: any) => r.v));
  const k = rows.length;
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      {rows.map((r: any, i: number) => {
        const st = T(r.at);
        const sp = f < st ? 0 : (st < 0 ? 1 : spring({frame: f - st, fps, config: {damping: 16, stiffness: 120}}));
        if (L.land) {
          const y = 300 + i * Math.min(150, 540 / k); const bw = 880 * r.v / max;
          return <g key={i}>
            <Big x={640} y={y + 52} text={r.name} size={fit(r.name, 44, 600)} anchor="end"/>
            <rect x={680} y={y} width={Math.max(4, bw * sp)} height={78} fill={r.red ? C.red : C.ink}/>
            {sp > 0.85 && <Big x={700 + bw} y={y + 56} text={r.label ?? String(r.v)} size={52} anchor="start" color={r.red ? C.red : C.ink}/>}
          </g>;
        }
        const y = 520 + i * Math.min(230, 900 / k); const bw = 640 * r.v / max;
        return <g key={i}>
          <Big x={90} y={y} text={r.name} size={fit(r.name, 42, 900)} anchor="start"/>
          <rect x={90} y={y + 22} width={Math.max(4, bw * sp)} height={80} fill={r.red ? C.red : C.ink}/>
          {sp > 0.85 && <Big x={110 + bw} y={y + 82} text={r.label ?? String(r.v)} size={52} anchor="start" color={r.red ? C.red : C.ink}/>}
        </g>;
      })}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};

const Timeline: React.FC<SP> = ({s, n, T, D}) => {
  const L = useL(); const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const ev = D.timelines[s.events]; const k = ev.length;
  const at = ev.map((_, i) => i < s.show ? -1 : (i - s.show < (s.add || []).length ? T(s.add[i - s.show]) : 1e9));
  const dot = (i: number, x: number, y: number, children: React.ReactNode) => {
    if (f < at[i]) return (
      <g key={i}><circle cx={x} cy={y} r={14} fill={C.tan} stroke={C.gray} strokeWidth={3} strokeDasharray="5 5"/></g>);
    const sp = at[i] < 0 ? 1 : spring({frame: f - at[i], fps, config: {damping: 10, stiffness: 170}});
    return <g key={i} transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * sp}) translate(${-x} ${-y})`}>
      <circle cx={x} cy={y} r={16} fill={C.red} stroke={C.ink} strokeWidth={3}/>{children}</g>;
  };
  if (L.land) {
    const X = (i: number) => 150 + i * (1620 / (k - 1)), y = 520;
    return (
      <Svg n={n}>
        <line x1={110} y1={y} x2={1810} y2={y} stroke={C.ink} strokeWidth={5}/>
        {ev.map(([d, t], i) => dot(i, X(i), y, <>
          <Big x={X(i)} y={y - (i % 2 ? 150 : 60)} text={d} size={40}/>
          <Big x={X(i)} y={y + (i % 2 ? 165 : 85)} text={t} size={fit(t, 32, 400)}/>
          <line x1={X(i)} y1={y + (i % 2 ? 20 : 20)} x2={X(i)} y2={y + (i % 2 ? 125 : 50)} stroke={C.gray} strokeWidth={2}/>
        </>))}
        <Stamps s={s} T={T} y={840}/>
      </Svg>
    );
  }
  const Y = (i: number) => 400 + i * (1050 / (k - 1)), x = 200;
  return (
    <Svg n={n}>
      <line x1={x} y1={370} x2={x} y2={1480} stroke={C.ink} strokeWidth={5}/>
      {ev.map(([d, t], i) => dot(i, x, Y(i), <>
        <Big x={x + 40} y={Y(i) - 4} text={d} size={36} anchor="start"/>
        <Big x={x + 40} y={Y(i) + 40} text={t} size={fit(t, 34, 780)} anchor="start" color={C.red}/>
      </>))}
      <Stamps s={s} T={T} y={1560}/>
    </Svg>
  );
};

const List: React.FC<SP> = ({s, n, T}) => {
  const L = useL(); const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const items = s.items; const k = items.length;
  const times = items.map((it: any) => T(it.at));
  const cur = times.reduce((a: number, t: number, i: number) => (f >= t ? i : a), -1);
  const w = L.land ? 1500 : 980, x0 = (L.W - w) / 2, rh = L.land ? Math.min(120, 600 / k) : 150;
  const y0 = (L.top + L.bot) / 2 - (k * rh) / 2 + (L.land ? 50 : 60);
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      {items.map((it: any, i: number) => {
        if (f < times[i]) return null;
        const sp = spring({frame: f - times[i], fps, config: {damping: 12, stiffness: 160}});
        const on = i === cur;
        return <g key={i} transform={`translate(${(1 - sp) * -500} 0)`}>
          <rect x={x0} y={y0 + i * rh} width={w} height={rh - 22} fill={on ? C.red : C.white} style={{filter: "url(#vshadow)"}}/>
          <Big x={x0 + 55} y={y0 + i * rh + (rh - 22) * 0.7} text={String(i + 1)} size={(rh - 22) * 0.6} color={on ? C.white : C.gray}/>
          <Big x={x0 + 110} y={y0 + i * rh + (rh - 22) * 0.68} text={it.text} size={fit(it.text, (rh - 22) * 0.5, w - 150)} anchor="start" color={on ? C.white : C.ink}/>
        </g>;
      })}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};

const Hand: React.FC<SP> = ({s, n, T}) => {
  const L = useL();
  const w = L.land ? 1260 : 980, h = L.land ? 800 : 1060, x = (L.W - w) / 2, y = L.land ? 110 : 380;
  const fs = L.land ? 54 : 48, rs = L.land ? 140 : 190;
  return (
    <Svg n={n}>
      <TornCard x={x} y={y} w={w} h={h} start={0} fill={C.paper} rot={-0.8}>
        <HWrite x={90} y={140} start={2} size={76} color={HRED}>{s.title}</HWrite>
        {s.items.map((it: any, i: number) => (
          <g key={i}>
            <HDraw shape={sh.rect(90, 215 + i * rs, 60, 60, {seed: 20 + i})} start={T(it.at, -8)} dur={8}/>
            <HWrite x={190} y={265 + i * rs} start={T(it.at)} size={fit(it.text, fs, w - 240, 0.5)} hand={false}>{it.text}</HWrite>
          </g>
        ))}
      </TornCard>
    </Svg>
  );
};

const Scores: React.FC<SP> = ({s, n, T}) => {
  const L = useL(); const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const rows: [string, number][] = s.rows; const k = rows.length;
  const w = L.land ? (s.listing ? 900 : 1500) : 980, x0 = L.land ? (s.listing ? 110 : (L.W - w) / 2) : 50;
  const rh = L.land ? Math.min(88, 590 / k) : Math.min(110, (s.listing ? 420 : 1000) / k);
  const y0 = L.land ? 230 : 420;
  return (
    <Svg n={n}>
      <Strip x={L.cx} y={L.top} start={0} text="MOATSCORE" size={L.land ? 70 : 64}/>
      {rows.map(([name, sc], i) => {
        const st = 8 + i * 6; if (f < st) return null;
        const sp = spring({frame: f - st, fps, config: {damping: 16, stiffness: 140}});
        const y = y0 + i * rh; const bw = (w - 470) * (sc / 10);
        return <g key={i}>
          <Big x={x0 + 20} y={y + rh * 0.66} text={name} size={fit(name, Math.max(34, rh * 0.52), 400, 0.5)} anchor="start"/>
          <rect x={x0 + 430} y={y + rh * 0.18} width={bw * sp} height={rh * 0.56} fill={sc >= 6 ? C.ink : sc >= 5.5 ? C.gray : C.mustard}/>
          <Big x={x0 + 450 + bw} y={y + rh * 0.66} text={sc.toFixed(2)} size={rh * 0.5} anchor="start" color={C.red}/>
        </g>;
      })}
      {s.listing && (L.land ?
        s.listing.map((it: any, i: number) => <At key={i} a={T(it.at)}><Strip x={1440} y={330 + i * 140} start={T(it.at)} text={it.text} size={fit(it.text, 46, 760)} fill={i === 0 ? C.red : C.white} color={i === 0 ? C.white : C.ink}/></At>)
        : s.listing.map((it: any, i: number) => <At key={i} a={T(it.at)}><Strip x={540} y={760 + i * 150} start={T(it.at)} text={it.text} size={fit(it.text, 46, 960)} fill={i === 0 ? C.red : C.white} color={i === 0 ? C.white : C.ink}/></At>))}
      <TypeLabel x={L.land ? 120 : 70} y={L.land ? 880 : 1500} start={20} text={s.note} size={L.land ? 26 : 24} cps={4}/>
    </Svg>
  );
};
const At: React.FC<{a: number; children: React.ReactNode}> = ({a, children}) => useCurrentFrame() >= a ? <>{children}</> : null;

const Sources: React.FC<SP> = ({s, n}) => {
  const L = useL();
  return (
    <Svg n={n}>
      <Strip x={L.cx} y={L.top - 20} start={0} text="SOURCES · PRIMARY DOCUMENTS" size={L.land ? 60 : 52}/>
      {s.items.map((t: string, i: number) => (
        <TypeLabel key={i} x={L.land ? 300 : 70} y={(L.land ? 260 : 460) + i * (L.land ? 72 : 110)} start={6 + i * 6} text={t} size={fit(t, L.land ? 30 : 26, L.land ? 1300 : 900, 0.62)} cps={5}/>
      ))}
    </Svg>
  );
};

// plain (AK, 3 Oct 2026): long videos without notes or warnings — brand + site only; the disclaimer lives in the description.
const End: React.FC<SP> = ({s, n}) => {
  const L = useL();
  const lines = s.plain ? ["moatmarginresearch.com"] : ["Educational research, not investment advice.", "Not a SEBI-registered Research Analyst", "or Investment Adviser.", "moatmarginresearch.com"];
  return (
    <Svg n={n}>
      <Strip x={L.cx} y={L.land ? 300 : 700} start={0} text="MOAT & MARGIN" size={L.land ? 120 : 100}/>
      {lines.map((t, i) => <TypeLabel key={i} x={L.land ? 440 : 80} y={(L.land ? 520 : 960) + i * 90} start={10 + i * 25} text={t} size={L.land ? 36 : 34} cps={3}/>)}
    </Svg>
  );
};


// kinetic typography (from the "What is a moat?" explainer, made data-driven): each line arrives word by word
// when its phrase is spoken; words listed in em (letters/digits only, upper case) are red. Optional kicker above.
const Kinetic: React.FC<SP> = ({s, n, T}) => {
  const L = useL(); const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const lines: {t: string; at: any; em?: string[]; size?: number}[] = s.lines;
  const maxW = L.land ? 1640 : 960, cap = L.land ? 150 : 124;
  return (
    <AbsoluteFill>
      <Svg n={n}><g/></Svg>
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", flexDirection: "column", padding: L.land ? "0 140px 70px" : "0 60px 340px"}}>
        {s.kicker && <div style={{fontFamily: TYPE, fontSize: L.land ? 34 : 32, color: C.ink, opacity: 0.75, marginBottom: 26, letterSpacing: 2}}>{s.kicker}</div>}
        {lines.map((ln, li) => {
          const size = ln.size ?? Math.min(cap, maxW / (Math.max(1, ln.t.length) * 0.5));
          const s0 = T(ln.at);
          return (
            <div key={li} style={{display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: "center", lineHeight: 1.08, maxWidth: maxW}}>
              {ln.t.split(" ").map((w, i) => {
                const st = s0 + i * 4;
                const sp = spring({frame: f - st, fps, config: {damping: 11, stiffness: 170}});
                const em = (ln.em || []).some((e) => w.replace(/[^A-Z0-9&₹]/gi, "").toUpperCase() === e);
                return <span key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: em ? size * 1.12 : size, color: em ? C.red : C.ink,
                  opacity: f >= st ? 1 : 0, display: "inline-block", transform: `translateY(${(1 - sp) * 50}px) scale(${0.8 + 0.2 * sp})`}}>{w}</span>;
              })}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// League-table race (Q2 scoreboards, 1 Oct 2026): rows land in reveal order with their bars, then re-sort into rank
// order at `sortAt`; the leader turns mustard and gets the stamp. rows: {name, v (growth %), vol?, at}.
const League: React.FC<SP> = ({s, n, T}) => {
  const L = useL(); const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const rows: any[] = s.rows; const k = rows.length;
  const times = rows.map((r) => T(r.at));
  const sortT = s.sortAt ? T(s.sortAt) : 1e9;
  const order = rows.map((_, i) => i).sort((a, b) => rows[b].v - rows[a].v);
  const rank = rows.map((_, i) => order.indexOf(i));
  const sp = f < sortT ? 0 : spring({frame: f - sortT, fps, config: {damping: 15, stiffness: 110}});
  const maxV = Math.max(...rows.map((r) => Math.abs(r.v)), 1);
  const land = L.land;
  const rh = land ? Math.min(130, 620 / k) : Math.min(300, 1000 / k);
  const y0 = land ? 250 : 470;
  const nameW = land ? 470 : 900, barX = land ? 640 : 90, barMax = land ? 820 : 640;
  return (
    <Svg n={n}>
      <Heading text={s.heading}/>
      {rows.map((r, i) => {
        if (f < times[i]) return null;
        const g = spring({frame: f - times[i], fps, config: {damping: 16, stiffness: 120}});
        const pos = i + (rank[i] - i) * sp;
        const y = y0 + pos * rh;
        const lead = sp > 0.6 && rank[i] === 0;
        const bw = Math.max(6, barMax * Math.abs(r.v) / maxV) * g;
        const lab = `${r.v >= 0 ? "+" : "−"}${Math.abs(r.v).toFixed(1)}%`;
        const barY = land ? y + rh * 0.12 : y + rh * 0.36, barH = land ? rh * 0.62 : rh * 0.42;
        return <g key={i}>
          {sp > 0.6 && <Big x={land ? 70 : 60} y={land ? y + rh * 0.62 : y + rh * 0.3} text={`#${rank[i] + 1}`} size={land ? rh * 0.42 : rh * 0.22} color={lead ? C.red : C.gray} anchor="start"/>}
          <Big x={land ? 140 + nameW - 20 : (sp > 0.6 ? 150 : 90)} y={land ? y + rh * (r.vol ? 0.46 : 0.55) : y + rh * 0.28} text={r.name} size={fit(r.name, land ? rh * 0.34 : rh * 0.22, land ? nameW - 40 : nameW - 160, 0.5)} anchor={land ? "end" : "start"}/>
          {r.vol && g > 0.85 && <Big x={land ? 140 + nameW - 20 : 990} y={land ? y + rh * 0.76 : y + rh * 0.28} text={r.vol} size={land ? rh * 0.2 : rh * 0.16} anchor="end" color={C.gray}/>}
          <rect x={barX} y={barY} width={bw} height={barH} fill={lead ? C.mustard : r.v < 0 ? C.red : C.ink} style={{filter: "url(#vshadow)"}}/>
          {g > 0.85 && <Big x={barX + bw + 22} y={barY + barH * 0.74} text={lab} size={barH * 0.72} anchor="start" color={r.v < 0 ? C.red : C.ink}/>}
        </g>;
      })}
      {s.stamp && f >= sortT + 12 && <Stamp x={land ? 1500 : 540} y={land ? y0 + k * rh + 60 : y0 + k * rh + 90} start={sortT + 12} text={s.stamp} size={fit(s.stamp, land ? 64 : 56, land ? 420 : 520, 0.56)} rot={-8}/>}
      {s.note && <TypeLabel x={land ? 120 : 70} y={land ? 940 : 1520} start={10} text={s.note} size={land ? 26 : 24} cps={4}/>}
      <Stamps s={s} T={T}/>
    </Svg>
  );
};

const SCENES: Record<string, React.FC<SP>> = {title: Title, strips: Strips, counter: Counter, cards: Cards, clip: Clip, quote: Quote,
  table: Table, bars: Bars, timeline: Timeline, list: List, hand: Hand, scores: Scores, sources: Sources, end: End, league: League, kinetic: Kinetic};

// ---------- captions & furniture ----------
const cueTimes = (b: Beat) => {
  const v = b.sec * FPS, tot = b.cues.reduce((a, c) => a + c.length, 0);
  let acc = 0;
  return b.cues.map((c) => { const a = Math.round(acc / tot * v); acc += c.length; return {text: c, a, b: Math.round(acc / tot * v)}; });
};
const Captions: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const L = useL();
  const ts = cueTimes(b); const cur = ts.find((t) => f < t.b) ?? ts[ts.length - 1];
  return (
    <div style={{position: "absolute", left: L.land ? 160 : 60, right: L.land ? 160 : 60, bottom: L.land ? 44 : 300, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.82)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: L.land ? 40 : 42, lineHeight: 1.4, padding: "6px 16px", borderRadius: 8, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{cur.text}</span>
    </div>
  );
};
const Furniture: React.FC<{D: VData; beats: Beat[]; starts: number[]; total: number}> = ({D, beats, starts, total}) => {
  const f = useCurrentFrame();
  const chStart = D.chapters.map((_, c) => { const i = beats.findIndex((b) => b.ch === c); return i < 0 ? total : starts[i]; });
  const ch = chStart.reduce((a, s, i) => (f >= s ? i : a), 0);
  const i = starts.reduce((a, s, k) => (f >= s ? k : a), 0);
  const showTag = ch > 0 && ch < D.chapters.length - 1 && !isTitle(beats[i]);
  return (
    <svg width={1920} height={1080} style={{position: "absolute"}}>
      {D.chapters.map((_, c) => {
        const a = chStart[c], b = c + 1 < D.chapters.length ? chStart[c + 1] : total;
        const x0 = a / total * 1920, x1 = b / total * 1920, p = Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a)));
        return <g key={c}><rect x={x0 + 2} y={0} width={Math.max(0, x1 - x0 - 4)} height={10} fill="#00000022"/><rect x={x0 + 2} y={0} width={Math.max(0, (x1 - x0 - 4) * p)} height={10} fill={c === ch ? C.red : C.ink}/></g>;
      })}
      {showTag && <g><rect x={36} y={30} width={D.chapters[ch].length * 15 + 110} height={44} fill={C.ink}/>
        <text x={52} y={61} fontFamily={TYPE} fontSize={24} fill={C.white}>{`CH ${ch} · ${D.chapters[ch].toUpperCase()}`}</text></g>}
      <text x={1880} y={62} fontFamily={TYPE} fontSize={24} fill={C.ink} opacity={0.6} textAnchor="end">Moat &amp; Margin · from the filings</text>
    </svg>
  );
};

const Fonts: React.FC = () => <><VoxFonts/><style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style></>;

const BeatSeq: React.FC<{D: VData; b: Beat; from: number; n: number; captions?: boolean}> = ({D, b, from, n, captions = true}) => {
  const Scene = SCENES[b.scene.type];
  return (
    <Sequence from={from} durationInFrames={n}>
      <AbsoluteFill><Scene s={b.scene} n={n} T={makeT(b)} b={b} D={D}/></AbsoluteFill>
      {captions && b.scene.type !== "end" && !b.scene.nocap && <Captions b={b}/>}
      <Audio src={staticFile(`vx/${D.id}/${b.key}.mp3`)}/>
    </Sequence>
  );
};

// ---------- compositions ----------
export const longLayout = (D: VData) => {
  const frames = D.beats.map(beatFrames);
  const starts = frames.reduce<number[]>((a, n, i) => [...a, i ? a[i - 1] + frames[i - 1] : 0], []);
  return {frames, starts, total: frames.reduce((a, b) => a + b, 0)};
};
export const VoxLong: React.FC<{D: VData}> = ({D}) => {
  const {frames, starts, total} = longLayout(D);
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <Fonts/>
      {D.beats.map((b, i) => <BeatSeq key={b.key} D={D} b={b} from={starts[i]} n={frames[i]}/>)}
      <Furniture D={D} beats={D.beats} starts={starts} total={total}/>
    </AbsoluteFill>
  );
};

const SHORT_END = 4 * FPS;
// YouTube Guide (AK, 30 Sep 2026): Shorts with a `hook` get the hook on screen from frame 1 and a short 2 s end card (loop-friendly).
// Loop Shorts (AK's Shorts formula, 1 Oct 2026): no end card, tight 0.12 s gaps, last line runs back into the first.
const shortEnd = (D: VData, idx: number) => (D.shorts[idx].loop ? 0 : D.shorts[idx].hook ? 2 * FPS : SHORT_END);
export const shortLayout = (D: VData, idx: number) => {
  const bs = D.shorts[idx].beats.map((k) => D.beats.find((b) => b.key === k)!);
  const frames = bs.map((b) => Math.ceil((b.sec + (D.shorts[idx].loop ? 0.12 : 0.35)) * FPS));
  return {bs, frames, total: frames.reduce((a, b) => a + b, 0) + shortEnd(D, idx)};
};
const ShortHook: React.FC<{text: string; n: number}> = ({text, n}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [n - 8, n], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const lines = text.toUpperCase().split("|");
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", opacity: o}}>
      <rect x={40} y={200} width={1000} height={80 + lines.length * 110} fill={C.ink} rx={8}/>
      {lines.map((l, i) => <text key={i} x={540} y={300 + i * 110} fontFamily={COND} fontWeight={700} fontSize={Math.min(96, 1800 / Math.max(8, l.length))} textAnchor="middle" fill={i === lines.length - 1 ? C.mustard : C.white}>{l}</text>)}
    </svg>
  );
};
const ShortEndLoop: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>
    <VoxDefs/><Stage w={1080} h={1920}/>
    <rect x={60} y={560} width={960} height={170} fill={C.ink} rx={8}/>
    <text x={540} y={675} fontFamily={COND} fontWeight={700} fontSize={76} textAnchor="middle" fill={C.mustard}>FULL VIDEO: LINKED BELOW</text>
    <Strip x={540} y={860} start={0} text="MOAT & MARGIN" size={96}/>
    <TypeLabel x={110} y={1060} start={0} text="Educational research, not investment advice." size={30} cps={40}/>
    <TypeLabel x={110} y={1150} start={0} text="Not a SEBI-registered Research Analyst." size={30} cps={40}/>
  </svg>
);
const ShortEnd: React.FC<{title: string}> = ({title}) => {
  const n = SHORT_END;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>
      <VoxDefs/><Stage w={1080} h={1920}/>
      <Strip x={540} y={640} start={0} text="FULL STORY · LONG VIDEO" size={70} fill={C.red} color={C.white}/>
      <Strip x={540} y={800} start={4} text="MOAT & MARGIN" size={96}/>
      <TypeLabel x={110} y={1010} start={10} text="Every figure from primary documents." size={30} cps={4}/>
      <TypeLabel x={110} y={1100} start={20} text="Educational research, not investment advice." size={30} cps={4}/>
      <TypeLabel x={110} y={1190} start={30} text="Not a SEBI-registered Research Analyst." size={30} cps={4}/>
    </svg>
  );
};
export const VoxShort: React.FC<{D: VData; idx: number}> = ({D, idx}) => {
  const {bs, frames} = shortLayout(D, idx);
  let from = 0;
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <Fonts/>
      {bs.map((b, i) => { const el = <BeatSeq key={b.key} D={D} b={b} from={from} n={frames[i]}/>; from += frames[i]; return el; })}
      {D.shorts[idx].loop ? null : D.shorts[idx].hook ? <Sequence from={from} durationInFrames={shortEnd(D, idx)}><AbsoluteFill><ShortEndLoop/></AbsoluteFill></Sequence>
        : <Sequence from={from} durationInFrames={SHORT_END}><AbsoluteFill><ShortEnd title={D.shorts[idx].title}/></AbsoluteFill></Sequence>}
      {D.shorts[idx].hook && !D.shorts[idx].loop && <Sequence from={0} durationInFrames={Math.min(frames[0], 3 * FPS)}><AbsoluteFill><ShortHook text={D.shorts[idx].hook!} n={Math.min(frames[0], 3 * FPS)}/></AbsoluteFill></Sequence>}
      <svg width={1080} height={1920} style={{position: "absolute"}}>
        <text x={540} y={140} fontFamily={COND} fontWeight={700} fontSize={40} textAnchor="middle" fill={C.ink}>{D.shorts[idx].title.toUpperCase()}</text>
        <text x={540} y={1860} fontFamily={TYPE} fontSize={26} fill={C.ink} opacity={0.6} textAnchor="middle">Moat &amp; Margin · from the filings</text>
        {D.shorts[idx].loop && <text x={540} y={1898} fontFamily={TYPE} fontSize={22} fill={C.ink} opacity={0.6} textAnchor="middle">Educational research, not investment advice · not SEBI-registered</text>}
      </svg>
    </AbsoluteFill>
  );
};

// YouTube Guide thumbnail (AK, 30 Sep 2026): dark ground (not red-and-white), real document left 2/3, badge right 1/3, <=3 words.
export const VoxThumbG: React.FC<{D: VData; words: string; badge: string; badgeSub: string; clip: string; accent?: string}> = ({D, words, badge, badgeSub, clip, accent}) => {
  const c = D.clips[clip]; const A = accent || C.mustard;
  const iw = 780, ih = 400;  // fixed box; the clip is zoomed to fill it (slice) so the filing text reads large
  return (
    <AbsoluteFill style={{background: "#15171c"}}>
      <Fonts/>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
        <VoxDefs/>
        <g transform={`translate(40 ${360 - ih / 2 - 40}) rotate(-2)`}>
          <rect x={0} y={0} width={iw + 40} height={ih + 40} fill="#f7f3ea" style={{filter: "url(#vshadow)"}}/>
          <svg x={20} y={20} width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`}><image href={staticFile(`vx/${D.id}/clips/${clip}.png`)} x={0} y={0} width={iw} height={ih} preserveAspectRatio="xMinYMid slice"/></svg>
        </g>
        <text x={60} y={660} fontFamily={COND} fontWeight={700} fontSize={Math.min(110, 1500 / Math.max(6, words.length))} fill={A}>{words.toUpperCase()}</text>
        <g transform="translate(900 110)">
          <rect x={0} y={0} width={340} height={420} rx={24} fill={A}/>
          <text x={170} y={230} fontFamily={COND} fontWeight={700} fontSize={Math.min(150, 560 / Math.max(3, badge.length))} textAnchor="middle" fill="#15171c">{badge}</text>
          {badgeSub.split("|").map((l, i) => <text key={i} x={170} y={320 + i * 48} fontFamily={COND} fontWeight={700} fontSize={40} textAnchor="middle" fill="#15171c">{l}</text>)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const VoxThumb: React.FC<{D: VData; lines: [string, string]; stamp: string; clip?: string}> = ({D, lines, stamp, clip}) => {
  const c = clip ? D.clips[clip] : null;
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <Fonts/>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
        <VoxDefs/><Stage w={1280} h={720}/>
        {c && <g transform="translate(560 410) rotate(2)">
          <rect x={0} y={0} width={680} height={680 * c.h / c.w + 40} fill="#fff" style={{filter: "url(#vtorn) url(#vshadow)"}}/>
          <image href={staticFile(`vx/${D.id}/clips/${clip}.png`)} x={20} y={20} width={640} height={640 * c.h / c.w}/>
        </g>}
        <Strip x={430} y={150} start={-100} text={lines[0]} size={fit(lines[0], 110, 820)}/>
        <Strip x={430} y={300} start={-100} text={lines[1]} size={fit(lines[1], 90, 820)} fill={C.red} color={C.white} rot={-1.5}/>
        <Stamp x={300} y={560} start={-100} text={stamp} size={fit(stamp, 66, 520, 0.56)} rot={-8}/>
      </svg>
    </AbsoluteFill>
  );
};

// Vox-format thumbnail (AK, 1 Oct 2026): the video's own look — tan paper, torn cards, red stamp, a zoomed filing clip
// with the highlighter on the cited words. One huge number is the focal point; <=3 stamp words; readable at 160 px.
export const VoxThumbV: React.FC<{D: VData; kicker: string; big: string; bigSub: string; stamp: string; clip: string; clipMeta?: {w: number; h: number; hl: number[][]}}> =
  ({D, kicker, big, bigSub, stamp, clip, clipMeta}) => {
  const c = clipMeta || D.clips[clip];
  const bw = 600;                                  // clip box width; height follows the crop
  const hl = c.hl[0];
  const hx = (Math.min(...c.hl.map((q) => q[0])) + Math.max(...c.hl.map((q) => q[0] + q[2]))) / 2 * c.w, hy = (Math.min(...c.hl.map((q) => q[1])) + Math.max(...c.hl.map((q) => q[1] + q[3]))) / 2 * c.h;
  const span = (Math.max(...c.hl.map((q) => q[0] + q[2])) - Math.min(...c.hl.map((q) => q[0]))) * c.w;
  const cw = Math.min(c.w, Math.max(span * (span > c.w * 0.3 ? 1.12 : 2.4), c.w * 0.42));
  let ch = c.h, bh = bw * ch / cw;
  if (bh > 360) { bh = 360; ch = cw * bh / bw; }
  const vx = Math.max(0, Math.min(c.w - cw, hx - cw / 2)), vy = Math.max(0, Math.min(c.h - ch, hy - ch / 2));
  const gy = 300 - bh / 2;
  const bigSize = Math.min(230, 600 / (big.length * 0.5 + 0.4));
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <Fonts/>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
        <VoxDefs/><Stage w={1280} h={720}/>
        {/* filing clipping, zoomed onto the highlighted words */}
        <g transform={`translate(650 ${gy}) rotate(3)`}>
          <rect x={0} y={0} width={bw + 40} height={bh + 40} fill="#fff" style={{filter: "url(#vtorn) url(#vshadow)"}}/>
          <svg x={20} y={20} width={bw} height={bh} viewBox={`${vx} ${vy} ${cw} ${ch}`} preserveAspectRatio="xMidYMid slice">
            <image href={staticFile(`vx/${D.id}/clips/${clip}.png`)} x={0} y={0} width={c.w} height={c.h}/>
            {c.hl.map((b, i) => <rect key={i} x={b[0] * c.w} y={b[1] * c.h} width={b[2] * c.w} height={b[3] * c.h} fill={C.mustard} opacity={0.45} style={{mixBlendMode: "multiply"}}/>)}
          </svg>
          <rect x={bw / 2 - 60} y={-18} width={120} height={36} fill={C.paper} opacity={0.8} transform="rotate(-4)"/>
        </g>
        {/* kicker */}
        <Strip x={250} y={82} start={-100} text={kicker} size={fit(kicker, 46, 440)} fill={C.ink} color={C.white} rot={-1}/>
        {/* the number */}
        <g transform="translate(40 150) rotate(-3)">
          <rect x={0} y={0} width={640} height={340} fill={C.white} style={{filter: "url(#vtorn) url(#vshadow)"}}/>
          <text x={320} y={170 + bigSize * 0.33} fontFamily={COND} fontWeight={700} fontSize={bigSize} textAnchor="middle" fill={C.red}>{big}</text>
        </g>
        <Strip x={350} y={530} start={-100} text={bigSub} size={fit(bigSub, 48, 600)} rot={1}/>
        {/* verdict stamp */}
        <Stamp x={930} y={600} start={-100} text={stamp} size={fit(stamp, 84, 560, 0.56)} rot={-7}/>
      </svg>
    </AbsoluteFill>
  );
};
