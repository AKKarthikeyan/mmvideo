import React from "react";
import {AbsoluteFill} from "remotion";
import {C, W, H, FPS, Sky, Sparks, Icon, IconName, MONO, SANS, clamp, lerp, prog, easeIO, easeOut, easeIn, sp, rnd, sec} from "./kit";
import {SceneProps, Skyline} from "./scenes1";
import {Person} from "./scenes2";

// ---------- winter haze thickens over a city; the sun dims ----------
export const Haze: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f), k = prog(f, 10, dur - 20, easeIO), r = rnd(2);
  const puffs = Array.from({length: 40}, (_, i) => ({x: r() * W, y: 300 + r() * 560, s: 120 + r() * 220, v: 14 + r() * 26, a: 0.05 + r() * 0.1}));
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A3A7A" /><stop offset="1" stopColor="#D9A66A" /></linearGradient><radialGradient id="hz-s"><stop offset="0" stopColor="#FFF0C8" /><stop offset="1" stopColor="#FFD479" stopOpacity="0" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#hz)" /><circle cx={1400} cy={420} r={220} fill="url(#hz-s)" opacity={1 - k * 0.75} /><circle cx={1400} cy={420} r={54} fill="#FFF3C4" opacity={1 - k * 0.85} />
    <Skyline y={900} color={mixc(k)} lights={0} f={f} />
    {puffs.map((p, i) => <circle key={i} cx={((p.x + p.v * T) % (W + 400)) - 200} cy={p.y + 18 * Math.sin(T * 0.6 + i)} r={p.s} fill="#9C8A78" opacity={p.a * k * 3.2} />)}
    <rect width={W} height={H} fill="#8E7A66" opacity={k * 0.28} />
  </svg></AbsoluteFill>;
};
const mixc = (k: number) => { const a = [5, 7, 26], b = [64, 54, 60]; return "rgb(" + a.map((x, i) => Math.round(lerp(x, b[i], k))).join(",") + ")"; };

// ---------- a court: columns, a gavel swung under gravity, a ring of force, the order appears ----------
export const CourtGavel: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const hit = Math.round((spans[p.hitAt ?? 0]?.s ?? 40) + 36), after = f - hit, wind = hit - 26;
  const ang = f < wind ? -52 : f < hit ? lerp(-52, 8, ((f - wind) / 26) ** 2) : 8 * Math.exp(-after * 0.35) * Math.cos(after * 0.9), shake = after > 0 ? Math.exp(-after * 0.1) * Math.cos(after) * 10 : 0;
  return <AbsoluteFill><Sky f={f} top="#0B1040" mid="#1C2370" bot="#4B2A78" stars={40} /><svg width={W} height={H} style={{position: "absolute"}}><g transform={`translate(${shake} 0)`}>
    <path d="M300 300 L960 120 L1620 300 Z" fill="#E6D8B8" stroke="#8A7A58" strokeWidth={5} /><rect x={300} y={300} width={1320} height={44} fill="#D1C29F" />
    {Array.from({length: 6}, (_, i) => <rect key={i} x={360 + i * 220} y={344} width={90} height={420} fill="#EFE3C4" stroke="#8A7A58" strokeWidth={4} />)}
    <rect x={280} y={764} width={1360} height={40} fill="#C9BA96" /><rect x={240} y={804} width={1440} height={40} fill="#B8A984" />
    <g transform="translate(960 880)"><rect x={-230} y={-26} width={460} height={26} rx={8} fill="#5A3A24" /><g transform={`translate(60 -26) rotate(${ang})`}><rect x={-12} y={-250} width={24} height={250} rx={8} fill="#7A4B2B" /><rect x={-96} y={-290} width={192} height={74} rx={16} fill="#4A2C1E" /></g></g>
    {after > 0 && after < 36 && <circle cx={1020} cy={860} r={after * 16} fill="none" stroke="#fff" strokeWidth={6 * (1 - after / 36)} opacity={0.7 * (1 - after / 36)} />}
    <g transform={`translate(${W - 520} ${lerp(1120, 520, sp(f, hit + 24, 18, 90))})`}><rect width={340} height={430} rx={12} fill="#F6EBD4" />{Array.from({length: 7}, (_, i) => <rect key={i} x={36} y={50 + i * 46} width={i % 3 === 2 ? 150 : 268} height={12} rx={6} fill="#B8A98A" />)}</g>
  </g></svg></AbsoluteFill>;
};

// ---------- an old burst versus a green one: soot hangs in the air, mist droplets catch it and it falls out ----------
export const GreenBurst: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const base = 1.0, cyc = 4.8, c = Math.max(0, Math.floor((sec(f) - base) / cyc)), t0 = base + c * cyc, T = sec(f), r = rnd(8 + c), soot = (x: number, mist: boolean) => Array.from({length: 120}, (_, i) => { const a = r() * 6.28, sp0 = 60 + r() * 170, t = T - t0; if (t < 0) return null;
    const k = mist ? 0.9 : 0.5, g = mist ? 140 : 14, vx = Math.cos(a) * sp0, vy = Math.sin(a) * sp0, d = (1 - Math.exp(-k * t)) / k, y = 440 + (g / k) * t + (vy - g / k) * d, xx = x + vx * d, life = mist ? 2.8 : 6;
    return t < life ? <circle key={i} cx={xx} cy={y} r={7 + r() * 10} fill="#3B3B46" opacity={0.5 * (1 - t / life)} /> : null; });
  const drops = Array.from({length: 70}, (_, i) => { const a = r() * 6.28, sp0 = 80 + r() * 200, t = T - t0; if (t < 0) return null; const d = (1 - Math.exp(-1.1 * t)) / 1.1; return t < 2.6 ? <circle key={i} cx={1440 + Math.cos(a) * sp0 * d} cy={440 + Math.sin(a) * sp0 * d + 40 * t * t} r={3.4} fill={C.mist} opacity={0.8 * (1 - t / 2.6)} /> : null; });
  const barK = prog(f, dur * 0.55, dur * 0.85, easeOut);
  return <AbsoluteFill><Sky f={f} top="#070B22" mid="#12195A" bot="#2A1A58" stars={50} /><svg width={W} height={H} style={{position: "absolute"}}>
    <line x1={960} y1={140} x2={960} y2={900} stroke={C.steel} strokeWidth={3} opacity={0.4} strokeDasharray="6 12" />
    {[480, 1440].map((x, i) => <g key={i}><Sparks f={f} b={{x, y: 440, t0, n: 80, speed: 330, g: 300, k: 1.4, life: 2.4, colors: i ? [C.leaf, "#C9FFD9", "#fff"] : [C.gold, C.flame, "#fff"], size: 3.2, seed: 5 + i + c * 7}} /></g>)}
    {soot(480, false)}{soot(1440, true)}{drops}
    {[480, 1440].map((x, i) => <g key={i} transform={`translate(${x} 960)`}><rect x={-130} y={-180} width={260} height={30} rx={8} fill="#1A2160" />{<rect x={-130} y={-180} width={260 * (i ? 0.7 : 1) * barK} height={30} rx={8} fill={i ? C.leaf : C.flame} />}</g>)}
    <g transform="translate(480 130)"><g transform="scale(0.8)"><Icon n="factory" s={100} color={C.flame} lit={0} /></g></g><g transform="translate(1440 130)"><g transform="scale(0.8)"><Icon n="drop" s={100} color={C.mist} lit={1} /></g></g>
  </svg></AbsoluteFill>;
};

// ---------- days tear off a calendar toward Deepavali; a QR block builds; a time slot arc opens ----------
export const DeepavaliCal: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const n = 9, step = (dur - 60) / n, T = sec(f), qrAt = (spans[p.qrAt ?? 1]?.s ?? dur * 0.4), slotAt = (spans[p.slotAt ?? 2]?.s ?? dur * 0.7), r = rnd(12);
  const page = (i: number) => { const t = clamp((f - 20 - i * step) / (step * 0.8)); return 1 - 0; };
  const qr = Array.from({length: 49}, (_, i) => ({x: i % 7, y: Math.floor(i / 7), on: r() < 0.5}));
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#251A5E" bot="#6B2F72" stars={50} /><svg width={W} height={H} style={{position: "absolute"}}>
    <g transform="translate(520 200)"><rect width={420} height={520} rx={22} fill="#F6EBD4" /><rect width={420} height={110} rx={22} fill={C.red} />
      {Array.from({length: n}, (_, i) => { const tt = (f - 20 - i * step) / FPS, day = 31 - i; if (tt > 1.6) return null;
        const lift = tt < 0 ? 0 : tt, px = lift * 520, py = -lift * 760 + 0.5 * 2600 * lift * lift, rot = lift * 160, a = tt < 0 ? 1 : Math.max(0, 1 - lift / 1.5);
        return <g key={i} transform={`translate(${px} ${110 + py}) rotate(${rot} 210 200)`} opacity={a}><rect x={0} y={0} width={420} height={410} rx={14} fill="#FFF7E6" stroke="#E7D9B8" strokeWidth={2} /><text x={210} y={290} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={230} fill="#2A1810" textRendering="geometricPrecision" style={{fontVariantNumeric: "tabular-nums"}}>{String(day).padStart(2, "0")}</text></g>; }).reverse()}</g>
    <g transform={`translate(1130 230) scale(${sp(f, qrAt, 12, 120)})`}><rect width={360} height={360} rx={16} fill="#fff" />{qr.map((q, i) => q.on || (q.x % 6 === 0 && q.y % 6 === 0) ? <rect key={i} x={26 + q.x * 44} y={26 + q.y * 44} width={40} height={40} fill="#0A0F34" /> : null)}
      <rect x={10} y={10 + ((T * 160) % 340)} width={340} height={6} fill={C.leaf} opacity={0.8} /></g>
    <g transform="translate(1310 700)"><circle r={130} fill="#10173D" stroke={C.steel} strokeWidth={6} />{f > slotAt && <path d={`M0 0 L0 -130 A130 130 0 0 1 ${Math.sin(clamp((f - slotAt) / 40) * 1.6) * 130} ${-Math.cos(clamp((f - slotAt) / 40) * 1.6) * 130} Z`} fill={C.gold} opacity={0.9} />}
      <line x1={0} y1={0} x2={0} y2={-100} stroke="#fff" strokeWidth={6} strokeLinecap="round" /><line x1={0} y1={0} x2={70} y2={0} stroke="#fff" strokeWidth={6} strokeLinecap="round" transform={`rotate(${T * 20})`} /></g>
    {f > dur - 90 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${700 + i * 90} 800)`} opacity={prog(f, dur - 90 + i * 8, dur - 60 + i * 8, easeOut)}><Icon n="flame" s={70} color={C.gold} lit={1} /></g>)}
  </svg></AbsoluteFill>;
};

// ---------- workers leave a factory gate at dusk ----------
export const Gate: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f), r = rnd(5), crowd = Array.from({length: 22}, (_, i) => ({x0: r() * 2600, y: 780 + r() * 120, sp: 80 + r() * 50, s: 1.2 + r() * 0.7, c: ["#E8DCC0", "#C5584B", "#D9A441", "#5A7FB8", "#2E7A55"][i % 5], ph: r() * 6}));
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A2D6B" /><stop offset="0.6" stopColor="#E0715A" /><stop offset="1" stopColor="#F6B567" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#gt)" /><circle cx={1500} cy={560} r={120} fill="#FFD9A0" opacity={0.85} />
    <Skyline y={700} color="#2A1B3F" lights={0.6} f={f} /><rect y={900} width={W} height={180} fill="#2A1B2A" />
    <g transform="translate(1180 520)"><rect x={-40} y={0} width={60} height={380} fill="#1A1228" /><rect x={420} y={0} width={60} height={380} fill="#1A1228" /><rect x={-60} y={-24} width={560} height={50} rx={10} fill="#1A1228" />{[0, 1].map((i) => <rect key={i} x={-4 + i * 440} y={40} width={40} height={30} fill={C.gold} opacity={0.9} />)}</g>
    {crowd.map((c, i) => { const x = W + 100 - ((c.x0 + c.sp * T) % (W + 600)) + 100; return <Person key={i} x={x} y={c.y} s={c.s} color={c.c} phase={T * 6 + c.ph} walk={1} flip skin="#C98F58" />; })}
  </svg></AbsoluteFill>;
};

// ---------- a shed floor plan: 12 places, then more people arrive than the plan allows ----------
export const FloorPlan: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const capAt = (spans[p.capAt ?? 0]?.s ?? 20), overAt = (spans[p.overAt ?? 1]?.s ?? dur * 0.5), r = rnd(6);
  const slots = Array.from({length: 12}, (_, i) => ({x: 640 + (i % 4) * 170, y: 400 + Math.floor(i / 4) * 150})), extra = Array.from({length: 38}, (_, i) => ({x: 560 + r() * 840, y: 330 + r() * 460, d: i * 5}));
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#141C58" bot="#26205E" stars={20} /><svg width={W} height={H} style={{position: "absolute"}}>
    <rect x={480} y={260} width={960} height={620} rx={14} fill="#10173D" stroke={C.steel} strokeWidth={6} /><rect x={900} y={870} width={120} height={22} fill="#10173D" />
    {slots.map((s, i) => { const k = sp(f, capAt + i * 4, 14, 150); return <g key={i} transform={`translate(${s.x} ${s.y}) scale(${k})`}><circle r={46} fill="none" stroke={C.leaf} strokeWidth={5} opacity={0.9} /><circle cy={-10} r={14} fill={C.leaf} /><path d="M-22 26 a22 22 0 0 1 44 0 Z" fill={C.leaf} /></g>; })}
    {extra.map((e, i) => { const k = sp(f, overAt + e.d, 16, 100); const y0 = lerp(940, e.y, k); return k > 0.02 ? <g key={i} transform={`translate(${e.x} ${y0}) scale(0.62)`} opacity={0.92}><circle cy={-12} r={13} fill={C.red} /><path d="M-22 26 a22 22 0 0 1 44 0 Z" fill={C.red} /></g> : null; })}
  </svg></AbsoluteFill>;
};

// ---------- twenty-five small lamps, steady ----------
export const Memorial: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f);
  return <AbsoluteFill><Sky f={f} top="#04050F" mid="#0A0C26" bot="#161236" stars={25} /><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><radialGradient id="mm"><stop offset="0" stopColor="#FFB84D" stopOpacity="0.6" /><stop offset="1" stopColor="#FFB84D" stopOpacity="0" /></radialGradient></defs>
    {Array.from({length: 25}, (_, i) => { const x = 960 + ((i % 5) - 2) * 150, y = 470 + (Math.floor(i / 5) - 2) * 130, s = sp(f, 12 + i * 5, 20, 80), fl = 1 + 0.04 * Math.sin(T * 3 + i * 1.3);
      return <g key={i} transform={`translate(${x} ${y})`} opacity={s}><circle r={64} fill="url(#mm)" /><ellipse cy={22} rx={34} ry={12} fill="#7A4B2B" /><path d="M-34 22 a34 12 0 0 0 68 0 Z" fill="#5A3620" /><path d={`M0 ${-40 * fl} C 12 -16 14 0 0 12 C -14 0 -12 -16 0 ${-40 * fl} Z`} fill={C.amber} /></g>; })}
  </svg></AbsoluteFill>;
};

// ---------- attendance: a scanner pulses; people are recognised one by one ----------
export const Attend: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f);
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#141C58" bot="#26205E" stars={20} /><svg width={W} height={H} style={{position: "absolute"}}>
    <g transform="translate(960 400)"><rect x={-150} y={-190} width={300} height={380} rx={34} fill="#10173D" stroke={C.steel} strokeWidth={6} />
      {[40, 70, 100, 130].map((r, i) => <path key={i} d={`M${-r} 40 a${r} ${r} 0 0 1 ${2 * r} 0`} stroke={C.teal} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.5 + 0.45 * Math.sin(T * 4 - i)} />)}
      <line x1={-120} y1={-150 + ((T * 220) % 300)} x2={120} y2={-150 + ((T * 220) % 300)} stroke={C.leaf} strokeWidth={5} opacity={0.8} /></g>
    {Array.from({length: 10}, (_, i) => { const x = 360 + i * 134, s = sp(f, 20 + i * 12, 14, 130), ok = f > 40 + i * 12 + 18; return <g key={i} transform={`translate(${x} 820) scale(${s})`}><circle cy={-14} r={22} fill={ok ? C.leaf : C.steel} /><path d="M-36 40 a36 36 0 0 1 72 0 Z" fill={ok ? C.leaf : C.steel} /><circle cy={74} r={10} fill={ok ? C.leaf : "none"} stroke={C.leaf} strokeWidth={3} /></g>; })}
  </svg></AbsoluteFill>;
};

// ---------- three factories rise with spring ----------
export const ThreeFactories: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const names = ["NATIONAL", "STANDARD", "KALISWARI"], T = sec(f);
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#1B2064" bot="#4A2A70" stars={50} /><svg width={W} height={H} style={{position: "absolute"}}>
    <rect y={820} width={W} height={260} fill="#0B0E2A" />
    {names.map((n, i) => { const s = sp(f, 16 + i * 26, 12, 140), x = 520 + i * 440; return <g key={i} transform={`translate(${x} ${820}) scale(1 ${s})`}><rect x={-150} y={-260} width={300} height={260} fill="#1F2A78" stroke={C.gold} strokeWidth={5} /><path d="M-150 -260 l75 -60 v60 l75 -60 v60 l75 -60 v60" fill="#1F2A78" stroke={C.gold} strokeWidth={5} /><rect x={90} y={-440} width={34} height={190} fill="#1F2A78" stroke={C.gold} strokeWidth={5} />
      {[0, 1, 2].map((k) => <rect key={k} x={-110 + k * 82} y={-170} width={52} height={52} fill={C.gold} opacity={0.85} />)}</g>; })}
    {names.map((n, i) => <text key={i} x={520 + i * 440} y={900} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} letterSpacing="0.16em" fill={C.cream} textRendering="geometricPrecision" opacity={prog(f, 30 + i * 26, 50 + i * 26, easeOut)}>{n}</text>)}
  </svg></AbsoluteFill>;
};

// ---------- the end: a town under distant fireworks, one match burning in the foreground ----------
export const Ember: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const T = sec(f), fl = (s: number) => Math.sin(f / 3.1 + s) * 0.08 + Math.sin(f / 1.7 + s * 2) * 0.05, zoom = prog(f, 0, dur, easeIO);
  return <AbsoluteFill><Sky f={f} top={C.ink} mid="#0F1446" bot="#3A1D58" stars={110} /><svg width={W} height={H} style={{position: "absolute"}}>
    {[0, 1, 2].map((i) => <Sparks key={i} f={f} b={{x: 360 + i * 520, y: 360 + (i % 2) * 90, t0: 0.4 + i * 1.7, n: 80, speed: 340, g: 320, k: 1.5, life: 3, colors: [[C.gold, "#fff"], [C.red, "#FFB3BD"], [C.teal, "#fff"]][i], size: 3, seed: 90 + i}} />)}
    <Skyline y={940} f={f} />
    <g transform={`translate(1240 ${lerp(720, 640, zoom)}) rotate(-6)`}><rect x={-10} y={0} width={20} height={380} rx={6} fill="#E5C58A" /><ellipse cx={0} cy={-6} rx={24} ry={32} fill="#2A1810" />
      <circle cy={-130} r={240} fill="url(#em-g)" opacity={0.7} /><g transform="translate(0 -30)"><path d={`M0 ${-160 * (1 + fl(0))} C 60 -80 66 -10 0 24 C -66 -10 -60 -80 0 ${-160 * (1 + fl(0))} Z`} fill={C.flame} /><path d={`M0 ${-96 * (1 + fl(2))} C 34 -56 38 -14 0 10 C -38 -14 -34 -56 0 ${-96 * (1 + fl(2))} Z`} fill="#FFF3D0" /></g></g>
    <defs><radialGradient id="em-g"><stop offset="0" stopColor={C.amber} stopOpacity="0.6" /><stop offset="1" stopColor={C.amber} stopOpacity="0" /></radialGradient></defs>
  </svg></AbsoluteFill>;
};
