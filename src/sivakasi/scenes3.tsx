import React from "react";
import {AbsoluteFill} from "remotion";
import {C, W, H, FPS, Sky, Sparks, Icon, IconName, MONO, SANS, clamp, lerp, prog, easeIO, easeOut, easeIn, sp, rnd, sec, bounceH} from "./kit";
import {SceneProps, Skyline} from "./scenes1";
import {Person} from "./scenes2";

const mix = (a: string, b: string, t: number) => { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return "#" + pa.map((x, i) => Math.round(lerp(x, pb[i], clamp(t))).toString(16).padStart(2, "0")).join(""); };

// ---------- a match is struck: friction sparks, ignition, the flame turns red then green, then it grows into a sparkler ----------
export const BengalLight: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const T = sec(f), strike = prog(f, 20, 70, easeIO), ig = 66, lit = f > ig, since = Math.max(0, f - ig);
  const col = since < 90 ? mix("#FF9A3D", "#FF3B4E", since / 90) : mix("#FF3B4E", "#4ADE80", (since - 90) / 120), spark = prog(f, dur * 0.62, dur * 0.7, easeOut), big = prog(f, dur * 0.82, dur * 0.9, easeOut);
  const mx = lerp(640, 1180, strike), my = lerp(640, 560, strike) - (lit ? prog(f, ig, ig + 60, easeOut) * 40 : 0), tilt = lerp(-14, -32, strike);
  const fl = (s: number) => Math.sin(f / 3.1 + s) * 0.08 + Math.sin(f / 1.7 + s * 2) * 0.05;
  return <AbsoluteFill><Sky f={f} top="#05061A" mid="#0F0D32" bot="#2A1445" stars={30} /><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><radialGradient id="bl-g"><stop offset="0" stopColor={col} stopOpacity="0.7" /><stop offset="1" stopColor={col} stopOpacity="0" /></radialGradient></defs>
    {lit && <circle cx={mx} cy={my - 130} r={380 + 30 * fl(1)} fill="url(#bl-g)" opacity={0.85} />}
    <g transform="translate(960 800)"><rect x={-300} y={0} width={600} height={170} rx={16} fill="#B8451F" stroke="#FFD9A0" strokeWidth={6} /><rect x={-300} y={0} width={600} height={46} fill="#3A1B10" /></g>
    <g transform={`translate(${mx} ${my}) rotate(${tilt})`}><rect x={-10} y={-20} width={20} height={260} rx={6} fill="#E5C58A" /><ellipse cx={0} cy={-26} rx={24} ry={34} fill={lit ? "#2A1810" : C.red} />
      {lit && <g transform={`translate(0 -52) scale(${1 + big * 0.1})`}><path d={`M0 ${-150 * (1 + fl(0))} C ${60} ${-70} ${70} ${-10} 0 24 C ${-70} ${-10} ${-60} ${-70} 0 ${-150 * (1 + fl(0))} Z`} fill={col} opacity={0.95} /><path d={`M0 ${-90 * (1 + fl(2))} C 34 -50 38 -10 0 12 C -38 -10 -34 -50 0 ${-90 * (1 + fl(2))} Z`} fill="#FFF3D0" opacity={0.9} /></g>}</g>
    <Sparks f={f} b={{x: mx, y: 820, t0: 40 / FPS, n: 24, speed: 520, g: 1400, k: 1.2, life: 0.8, colors: ["#FFE9A0", "#FFB84D", "#fff"], size: 2.8, seed: 3, spread: 1.3, angle: -2.2}} />
    {spark > 0 && <g opacity={spark}>{[0, 1, 2, 3, 4, 5].map((i) => <Sparks key={i} f={f} b={{x: mx, y: my - 190, t0: (dur * 0.62 + i * 6) / FPS, n: 16, speed: 240, g: 360, k: 2.4, life: 1.0, colors: [col, "#fff", C.gold], size: 2.6, seed: 10 + i}} />)}</g>}
    {big > 0 && <Sparks f={f} b={{x: mx, y: 330, t0: (dur * 0.84) / FPS, n: 120, speed: 560, g: 340, k: 1.4, life: 2.4, colors: [col, "#fff", C.gold, C.red], size: 3.6, seed: 77, trail: 0.09}} />}
  </svg></AbsoluteFill>;
};

// ---------- a chain of linked ideas: each link lights when its beat arrives; an energy pulse runs along the lit links ----------
export const Chain: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const icons: IconName[] = p.icons ?? ["match", "flame", "press", "firework"], litAt: number[] = p.litAt ?? icons.map((_, i) => i), n = icons.length, x0 = 330, gap = (W - 2 * x0) / (n - 1), y = p.y ?? 540;
  const lf = litAt.map((b, i) => (b < 0 ? 9999 : (spans[Math.min(b, spans.length - 1)]?.s ?? 0) + 6 + i * (p.stagger ?? 0))), T = sec(f);
  return <AbsoluteFill><Sky f={f} top="#070A24" mid="#141B4D" bot="#2A1A58" stars={70} /><svg width={W} height={H} style={{position: "absolute"}}>
    {icons.slice(1).map((_, i) => { const a = x0 + i * gap, b = a + gap, k = prog(f, lf[i + 1] - 30, lf[i + 1], easeIO), on = f > lf[i];
      return <g key={i}><line x1={a + 90} y1={y} x2={b - 90} y2={y} stroke={C.steel} strokeWidth={6} strokeDasharray="3 14" strokeLinecap="round" opacity={0.45} />
        <line x1={a + 90} y1={y} x2={lerp(a + 90, b - 90, k)} y2={y} stroke={C.gold} strokeWidth={8} strokeLinecap="round" opacity={on ? 1 : 0} />
        {on && k > 0 && k < 1 && <circle cx={lerp(a + 90, b - 90, k)} cy={y} r={14} fill="#fff" opacity={0.9} />}</g>; })}
    {icons.map((ic, i) => { const x = x0 + i * gap, s = sp(f, lf[i], 9, 160), on = f > lf[i], ring = prog(f, lf[i], lf[i] + 36, easeOut);
      return <g key={i} transform={`translate(${x} ${y})`}><circle r={104} fill={on ? "#1A2160" : "#0C1030"} stroke={on ? C.gold : C.steel} strokeWidth={5} opacity={on ? 1 : 0.55} />
        {on && ring < 1 && <circle r={104 + ring * 120} fill="none" stroke={C.gold} strokeWidth={5 * (1 - ring)} opacity={1 - ring} />}
        <g transform={`scale(${on ? 0.55 + 0.45 * s : 0.8})`} opacity={on ? 1 : 0.5}><Icon n={ic} s={120} color={on ? C.cream : C.steel} lit={on ? 1 : 0} /></g></g>; })}
  </svg></AbsoluteFill>;
};

// ---------- dominoes: each falls under constant angular acceleration and starts the next on impact (a chain reaction) ----------
export const Dominoes: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const icons: IconName[] = p.icons ?? ["match", "hand", "flame", "press", "ship", "factory", "firework"], n = icons.length, h = 250, wid = 90, gap = 150, x0 = 960 - ((n - 1) * gap) / 2, base = 780;
  const alpha = 36, thetaHit = Math.atan2(gap - 20, h), start = (spans[p.startAt ?? 0]?.s ?? 20) / FPS + 0.3;
  const th = (i: number) => { let t0 = start; for (let j = 0; j < i; j++) t0 += Math.sqrt((2 * thetaHit) / alpha); const t = sec(f) - t0; return t < 0 ? 0 : Math.min(1.5, 0.5 * alpha * t * t * (i === n - 1 ? 1 : 1)); };
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#1D2260" bot="#4A2A70" stars={60} /><svg width={W} height={H} style={{position: "absolute"}}>
    <rect y={base} width={W} height={H - base} fill="#0B0E2A" /><line x1={0} y1={base} x2={W} y2={base} stroke={C.steel} strokeWidth={3} opacity={0.6} />
    {icons.map((ic, i) => { const a = Math.min(th(i), thetaHit + 1.15), x = x0 + i * gap; return <g key={i} transform={`translate(${x + wid / 2} ${base}) rotate(${(a * 180) / Math.PI})`}><rect x={-wid} y={-h} width={wid} height={h} rx={10} fill={a > 0.05 ? "#1F2A78" : "#242E86"} stroke={C.gold} strokeWidth={4} />
      <g transform={`translate(${-wid / 2} ${-h / 2})`}><Icon n={ic} s={70} color={C.cream} lit={a > 0.05 ? 1 : 0} /></g></g>; })}
    {icons.map((_, i) => th(i) > 0 && th(i) < 0.12 ? <Sparks key={i} f={f} b={{x: x0 + i * gap + 40, y: base - 6, t0: sec(f), n: 8, speed: 180, g: 700, k: 2, life: 0.4, colors: [C.gold, "#fff"], size: 2.4, seed: i, spread: 1.6, angle: -1.57}} /> : null)}
  </svg></AbsoluteFill>;
};

// ---------- sun and drought: a time-lapse. On the left a field fails; on the right paper tubes dry in the same sun ----------
export const SunDrying: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const k = prog(f, 0, dur, (t: number) => t), sunA = lerp(0.16, 0.84, k) * Math.PI, sx = lerp(260, 1660, k), sy = 840 - Math.sin(sunA) * 640, elev = Math.max(0.16, Math.sin(sunA)), dry = prog(f, dur * 0.25, dur * 0.95, easeIO);
  const pan = p.pan === false ? 0 : -prog(f, dur * 0.2, dur * 0.7, easeIO) * 700, sky = mix("#F59E5B", "#5DA8E8", clamp(Math.sin(sunA) * 1.6)), sky2 = mix("#FBD38D", "#BFE3FF", clamp(Math.sin(sunA) * 1.4));
  const lenS = 60 / Math.tan(Math.max(0.2, elev * 1.2)), dirS = sx < 960 ? 1 : -1, wilt = prog(f, 20, dur * 0.7, easeIO), T = sec(f);
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="sd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky} /><stop offset="1" stopColor={sky2} /></linearGradient><radialGradient id="sd-sun"><stop offset="0" stopColor="#FFF6D0" /><stop offset="0.3" stopColor="#FFD479" stopOpacity="0.9" /><stop offset="1" stopColor="#FFD479" stopOpacity="0" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#sd-sky)" /><circle cx={sx} cy={sy} r={260} fill="url(#sd-sun)" /><circle cx={sx} cy={sy} r={64} fill="#FFF3C4" />
    <g transform={`translate(${pan} 0)`}>
      <rect x={-200} y={800} width={3000} height={400} fill={mix("#7A4F2B", "#C58A4A", dry)} />
      {Array.from({length: 38}, (_, i) => <path key={i} d={`M${-100 + i * 60} 850 l${20 + (i % 3) * 8} ${34 + (i % 4) * 10} l${-12} ${24}`} stroke="#3A2013" strokeWidth={2.4} fill="none" opacity={0.2 + 0.6 * dry} />)}
      {Array.from({length: 14}, (_, i) => { const x = -60 + i * 90, bend = wilt * (0.6 + (i % 3) * 0.25); return <g key={i} transform={`translate(${x} 830) rotate(${bend * 55})`}><path d="M0 0 V-120" stroke={mix("#5BD17A", "#B9A055", wilt)} strokeWidth={8} strokeLinecap="round" /><path d={`M0 -90 q${40 * (1 - wilt)} -30 ${70 * (1 - wilt * 0.8)} -10`} stroke={mix("#5BD17A", "#B9A055", wilt)} strokeWidth={8} fill="none" strokeLinecap="round" /></g>; })}
      {Array.from({length: 4}, (_, row) => Array.from({length: 11}, (_, i) => { const x = 1340 + i * 118 + row * 22, y = 860 + row * 42, ct = mix("#4A3226", "#E7C48C", clamp(dry * 1.4 - row * 0.05));
        return <g key={row + "_" + i}><polygon points={`${x},${y + 6} ${x + 60},${y + 6} ${x + 60 + dirS * lenS},${y + 22} ${x + dirS * lenS},${y + 22}`} fill="#000" opacity={0.26} /><rect x={x} y={y - 54} width={60} height={60} rx={8} fill={ct} stroke="#8A5A2B" strokeWidth={3} /><ellipse cx={x + 30} cy={y - 54} rx={30} ry={10} fill={mix("#2A1A12", "#F2D7A6", clamp(dry * 1.4 - row * 0.05))} /></g>; }))}
      {Array.from({length: 10}, (_, i) => <path key={i} d={`M${1340 + i * 130} ${780 - (T * 40 + i * 25) % 130} q10 -14 0 -28 t0 -28`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.18 * dry} />)}
    </g></svg></AbsoluteFill>;
};

// ---------- the press and the year: rollers turn at one surface speed, paper feeds through; then 52 weeks fill with print jobs ----------
export const PressYear: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const T = sec(f), w = T * 3.6, grid = prog(f, dur * (p.gridAt ?? 0.45), dur * 0.8, easeIO), pos = prog(f, 0, 40, easeOut), cam = -grid * 0;
  const cols = ["#E5484D", "#F2B33D", "#4FD6C4", "#5B8DEF", "#C58BFF", "#4ADE80"], sheetX = (i: number) => ((T * 260 + i * 330) % 1500) - 200;
  const rIn = 90;
  return <AbsoluteFill><Sky f={f} top="#0A1038" mid="#17206B" bot="#2E2070" stars={40} /><svg width={W} height={H} style={{position: "absolute"}}>
    <g opacity={1 - grid * 0.85} transform={`translate(0 ${-grid * 120})`}>
      <rect x={380} y={380} width={1160} height={360} rx={30} fill="#232B80" stroke="#0A1038" strokeWidth={8} />
      <g transform="translate(960 560)"><circle r={rIn} fill="#3B49B8" stroke="#0A1038" strokeWidth={6} /><circle r={rIn - 14} fill="none" stroke="#7F90FF" strokeWidth={4} strokeDasharray="12 18" strokeDashoffset={-w * rIn * 0.2} /><g transform={`rotate(${w * 57.3})`}><line x1={0} y1={0} x2={rIn - 10} y2={0} stroke="#FFF" strokeWidth={6} /></g></g>
      <g transform="translate(760 700)"><circle r={60} fill="#3B49B8" stroke="#0A1038" strokeWidth={6} /><g transform={`rotate(${-w * 57.3 * rIn / 60})`}><line x1={0} y1={0} x2={50} y2={0} stroke="#FFF" strokeWidth={5} /></g></g>
      <g transform="translate(1160 700)"><circle r={60} fill="#3B49B8" stroke="#0A1038" strokeWidth={6} /><g transform={`rotate(${-w * 57.3 * rIn / 60})`}><line x1={0} y1={0} x2={50} y2={0} stroke="#FFF" strokeWidth={5} /></g></g>
      {Array.from({length: 5}, (_, i) => { const x = sheetX(i); return <g key={i} transform={`translate(${x} 780)`}><rect width={170} height={110} rx={6} fill="#FFF7E4" /><rect x={14} y={14} width={142} height={82} rx={4} fill={cols[i % 6]} opacity={clamp((x - 700) / 300)} /></g>; })}
    </g>
    <g opacity={grid} transform={`translate(168 340)`}>
      {Array.from({length: 12}, (_, m) => Array.from({length: 4}, (_, wk) => { const idx = m * 4 + wk, t0 = 0.04 * ((m * 7 + wk * 3) % 20), g = clamp((grid - 0.1 - t0) * 3), s = (m === 9 && wk === 2); const fire = s ? sp(f, dur * 0.55, 8, 200) : 0;
        return <rect key={idx} x={m * 132} y={wk * 98} width={118} height={84} rx={10} fill={s ? C.red : cols[idx % 6]} opacity={0.2 + 0.78 * g} transform={s ? `translate(59 42) scale(${1 + 0.1 * fire}) translate(-59 -42)` : undefined} />; }))}
      <rect x={9 * 132 - 8} y={2 * 98 - 8} width={134} height={100} rx={14} fill="none" stroke={C.gold} strokeWidth={6} opacity={grid} />
    </g>
  </svg></AbsoluteFill>;
};

// ---------- a licence is stamped: the stamp falls under gravity, lands with a squash, the frame shakes and settles ----------
export const Licence: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const hit = Math.round((spans[p.hitAt ?? 0]?.s ?? 60) + 30), t = sec(f - hit), after = f - hit, shake = after > 0 ? Math.exp(-after * 0.09) * Math.cos(after * 0.9) * 14 : 0;
  const slide = sp(f, 4, 18, 90), drop = f < hit - 28 ? 900 : Math.max(0, 900 - 0.5 * 5200 * Math.pow(sec(f - (hit - 28)), 2)) , squash = after > 0 ? 1 - 0.18 * Math.exp(-after * 0.25) : 1;
  const fact = (spans[p.factAt ?? 99]?.s ?? 99999);
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#1B2064" bot="#3A2468" stars={30} /><svg width={W} height={H} style={{position: "absolute"}}><g transform={`translate(${shake} ${shake * 0.6})`}>
    <g transform={`translate(${lerp(-900, 700, slide)} 160)`}><rect width={520} height={680} rx={14} fill="#F6EBD4" />{Array.from({length: 9}, (_, i) => <rect key={i} x={50} y={70 + i * 56} width={i % 3 === 2 ? 240 : 420} height={14} rx={7} fill="#B8A98A" />)}
      {after > 0 && <g transform="translate(260 520) rotate(-12)" opacity={0.95}><circle r={110} fill="none" stroke={C.red} strokeWidth={14} /><circle r={84} fill="none" stroke={C.red} strokeWidth={5} /><path d="M-48 4 l30 32 l70 -64" stroke={C.red} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}</g>
    <g transform={`translate(960 ${290 - drop}) scale(1 ${squash})`}><rect x={-70} y={-220} width={140} height={120} rx={20} fill="#6E402B" /><rect x={-24} y={-100} width={48} height={90} fill="#8A5A3A" /><rect x={-110} y={-12} width={220} height={36} rx={10} fill="#3A2013" /></g>
    {after > 0 && after < 30 && <circle cx={960} cy={520} r={after * 14} fill="none" stroke="#fff" strokeWidth={5 * (1 - after / 30)} opacity={0.8 * (1 - after / 30)} />}
    {fact < 99999 && [0, 1, 2].map((i) => { const s = sp(f, fact + i * 18, 11, 150); return <g key={i} transform={`translate(${620 + i * 340} ${940 - 170 * s}) scale(${s})`} opacity={s > 0.01 ? 1 : 0}><Icon n="factory" s={190} color={C.cream} lit={1} /></g>; })}
  </g></svg></AbsoluteFill>;
};

// ---------- bars: grow with spring when their beat arrives; the numbers sit in fixed boxes and only the digits change ----------
export const Bars: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const bars: {label: string; v: number; at: number; plus?: boolean}[] = p.bars ?? [], vmax = p.vmax ?? 1100, base = 860, top = 260;
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#162068" bot="#2A2468" stars={30} /><svg width={W} height={H} style={{position: "absolute"}}>
    <line x1={260} y1={base} x2={1660} y2={base} stroke={C.steel} strokeWidth={4} opacity={0.7} />
    {bars.map((b, i) => { const s0 = (spans[b.at]?.s ?? 0) + 4, s = sp(f, s0, 15, 70, 1.3), h = (b.v / vmax) * (base - top) * s, x = 420 + i * 340, shown = Math.round(b.v * clamp((f - s0) / 36)), grow = f > s0;
      return <g key={i}>{grow && <rect x={x} y={base - Math.max(h, 6)} width={190} height={Math.max(h, 6)} rx={12} fill={`url(#bar${i % 2})`} />}
        {grow && <text x={x + 95} y={base - Math.max(h, 6) - 22} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={74} fill={C.cream} style={{fontVariantNumeric: "tabular-nums"}} textRendering="geometricPrecision">{shown.toLocaleString("en-US")}{b.plus && clamp((f - s0) / 36) >= 1 ? "+" : ""}</text>}
        <text x={x + 95} y={base + 66} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill={C.gold} letterSpacing="0.1em" textRendering="geometricPrecision" opacity={grow ? 1 : 0.35}>{b.label}</text></g>; })}
    <defs>{[0, 1].map((i) => <linearGradient key={i} id={`bar${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={i ? C.flame : C.gold} /><stop offset="1" stopColor={i ? "#8A2A5A" : "#C2552A"} /></linearGradient>)}</defs>
  </svg></AbsoluteFill>;
};

// ---------- coins fall under gravity and heap up; the counter shows only digits changing ----------
export const Money: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const target = p.target ?? 6000, r = rnd(31), N = 150, pile: number[] = new Array(40).fill(0), coins: JSX.Element[] = [];
  const start = (spans[p.startAt ?? 0]?.s ?? 0) / FPS, rate = (dur / FPS - 1.2) / N;
  for (let i = 0; i < N; i++) {
    const t0 = start + i * rate * 0.8, x = 960 + (r() + r() + r() - 1.5) * 360, bi = Math.floor(clamp(x / 48, 0, 39)), y0 = H - 120 - pile[bi] * 13;
    pile[bi] = Math.min(pile[bi] + 0.6, 12); if (bi > 0) pile[bi - 1] += 0.15; if (bi < 39) pile[bi + 1] += 0.15;
    const t = sec(f) - t0; if (t < 0) continue; const hh = bounceH(t, 900, 2800, 0.32), y = y0 - hh;
    coins.push(<g key={i} transform={`translate(${x} ${y}) rotate(${(1 - clamp(hh / 900)) * 20 + i * 7 * 0})`}><ellipse rx={30} ry={11} fill={C.gold} stroke="#B8801F" strokeWidth={3} /><ellipse rx={18} ry={6} fill="none" stroke="#B8801F" strokeWidth={2} /></g>);
  }
  const val = Math.round(target * clamp((sec(f) - start) / ((dur / FPS - start) * 0.85)));
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#1B2064" bot="#3A2468" stars={30} /><svg width={W} height={H} style={{position: "absolute"}}>
    <rect y={H - 120} width={W} height={120} fill="#0B0E2A" />{coins}
    <text x={960} y={330} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={210} fill={C.cream} textRendering="geometricPrecision" style={{fontVariantNumeric: "tabular-nums"}}>₹{val.toLocaleString("en-US")}</text>
    <text x={960} y={420} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={56} fill={C.gold} letterSpacing="0.2em" textRendering="geometricPrecision">CRORE A YEAR</text>
  </svg></AbsoluteFill>;
};
