// Line art for the radio episode, drawn in code: radio waves, Bose's two rooms, telegraph wire, spark gap, antenna,
// tuning dial, AM/FM waves, Atlantic crossing.
import React from "react";
import {Img, staticFile} from "remotion";
import {C, Draw, FPS, HEAD, MONO, W} from "../kit";

/** expanding arcs travelling right from (cx, cy); t in seconds */
export const Waves: React.FC<{cx: number; cy: number; t: number; maxR?: number; span?: number; n?: number; color?: string; o?: number; dir?: number}> = ({cx, cy, t, maxR = 700, span = 42, n = 5, color = C.accent, o = 1, dir = 0}) => {
  const arcs = [];
  for (let k = 0; k < n; k++) {
    const r = ((t * 260 + (k * maxR) / n) % maxR) + 20;
    const op = o * Math.max(0, 1 - r / maxR);
    if (span >= 180) { arcs.push(<circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={7} opacity={op}/>); continue; }
    const a0 = ((dir - span) * Math.PI) / 180, a1 = ((dir + span) * Math.PI) / 180;
    const d = `M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`;
    arcs.push(<path key={k} d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" opacity={op}/>);
  }
  return <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>{arcs}</svg>;
};

/** Bose's demonstration: transmitter, two walls, bell (shake 0..1), gunpowder burst (0..1) */
export const Rooms: React.FC<{p: number; t: number; shake: number; burst: number; wallHi: number; dim?: number; o?: number}> = ({p, t, shake, burst, wallHi, dim = 0, o = 1}) => {
  const g = 1360;
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: 1920, opacity: o}}>
      <Waves cx={230} cy={1215} t={t} maxR={720} o={p}/>
      <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        <Draw d={`M 60 ${g} L 1020 ${g}`} p={p} w={6} len={1000}/>
        {/* transmitter: box + horn */}
        <g opacity={p}>
          <rect x={110} y={1180} width={120} height={90} rx={10} fill={C.white} stroke={C.ink} strokeWidth={6}/>
          <path d="M 230 1195 L 300 1165 L 300 1265 L 230 1235 Z" fill={C.paper2} stroke={C.ink} strokeWidth={6}/>
          <rect x={150} y={1270} width={40} height={90} fill="none" stroke={C.ink} strokeWidth={6}/>
          <text x={170} y={1410} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={2} fill={C.mute}>TRANSMITTER</text>
        </g>
        {/* two walls */}
        {[470, 590].map((x, i) => (
          <rect key={x} x={x} y={980} width={34} height={g - 980} fill={wallHi > 0.5 ? C.accent : C.ink2} opacity={p * (0.85 + 0.15 * wallHi)} rx={4}/>
        ))}
        {/* bell */}
        <g transform={`translate(860, 1150) rotate(${Math.sin(t * 40) * 18 * shake})`} opacity={p}>
          <line x1={0} y1={-90} x2={0} y2={-60} stroke={C.ink} strokeWidth={6}/>
          <path d="M -55 40 C -55 -20 -40 -60 0 -60 C 40 -60 55 -20 55 40 L 70 55 L -70 55 Z" fill="#E8C66A" stroke={C.ink} strokeWidth={6}/>
          <circle cx={0} cy={68} r={12} fill={C.ink}/>
        </g>
        <line x1={860} y1={1060} x2={860} y2={g} stroke={C.ink} strokeWidth={5} opacity={p * 0.5} strokeDasharray="10 10"/>
        {/* gunpowder dish + burst */}
        <g opacity={p}>
          <path d="M 900 1350 Q 960 1365 1010 1350 L 1000 1335 L 910 1335 Z" fill={C.ink2}/>
          {burst > 0 && (
            <g transform={`translate(955, 1320) scale(${burst})`} opacity={1 - Math.max(0, burst - 0.7) / 0.3 * 0.6}>
              <polygon points="0,-90 22,-30 85,-50 40,0 90,40 25,30 0,90 -25,30 -90,40 -40,0 -85,-50 -22,-30" fill="#F28C28" stroke={C.ink} strokeWidth={5}/>
              <circle r={22} fill="#FFE08A"/>
            </g>
          )}
        </g>
        {dim > 0 && (
          <g opacity={dim}>
            <Draw d={`M 230 ${g + 60} L 940 ${g + 60} M 255 ${g + 40} L 230 ${g + 60} L 255 ${g + 80} M 915 ${g + 40} L 940 ${g + 60} L 915 ${g + 80}`} p={dim} stroke={C.accent} w={6} len={900}/>
            <text x={585} y={g + 120} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill={C.accent}>23 M</text>
          </g>
        )}
      </svg>
    </div>
  );
};

/** telegraph poles with a wire and dots running along it */
export const Telegraph: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const poles = [140, 400, 660, 920];
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
      {poles.map((x, i) => (
        <g key={x} opacity={Math.min(1, Math.max(0, p * 4 - i))}>
          <line x1={x} y1={1000} x2={x} y2={1420} stroke={C.ink} strokeWidth={10}/>
          <line x1={x - 50} y1={1030} x2={x + 50} y2={1030} stroke={C.ink} strokeWidth={8}/>
        </g>
      ))}
      <Draw d="M 90 1030 Q 270 1080 400 1030 Q 530 1080 660 1030 Q 790 1080 970 1030" p={p} w={5} len={1100}/>
      {[0, 1, 2].map((k) => {
        const x = 90 + (((t * 300 + k * 140) % 880));
        return <circle key={k} cx={x} cy={1048} r={10} fill={C.accent} opacity={p}/>;
      })}
    </svg>
  );
};

/** a travelling sine wave (electric) with a second, flatter one (magnetic) */
export const EMWave: React.FC<{p: number; t: number; y: number; o?: number}> = ({p, t, y, o = 1}) => {
  const pts = (amp: number, ph: number) => Array.from({length: 120}, (_, i) => {
    const x = 80 + i * 7.6; return `${x},${y + amp * Math.sin(i / 9 - t * 6 + ph)}`;
  }).join(" ");
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
      <line x1={80} y1={y} x2={80 + 920 * p} y2={y} stroke={C.line} strokeWidth={4}/>
      <g clipPath="url(#emclip)">
        <defs><clipPath id="emclip"><rect x={0} y={0} width={80 + 920 * p} height={1920}/></clipPath></defs>
        <polyline points={pts(150, 0)} fill="none" stroke={C.ink} strokeWidth={8}/>
        <polyline points={pts(60, 0)} fill="none" stroke={C.accent} strokeWidth={8} opacity={0.9}/>
      </g>
      <text x={90} y={y - 175} fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink} opacity={p}>ELECTRIC</text>
      <text x={90} y={y + 110} fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.accent} opacity={p}>MAGNETIC</text>
    </svg>
  );
};

/** Hertz: spark-gap transmitter (left) and loop receiver (right) whose gap sparks when the wave arrives */
export const SparkGap: React.FC<{p: number; t: number; rx: number; o?: number}> = ({p, t, rx, o = 1}) => {
  const flick = (Math.floor(t * FPS) % 4) < 2;
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: 1920, opacity: o}}>
      <Waves cx={300} cy={1150} t={t} maxR={520} o={p} span={35}/>
      <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        <g opacity={p}>
          <line x1={110} y1={1150} x2={270} y2={1150} stroke={C.ink} strokeWidth={8}/>
          <circle cx={110} cy={1150} r={34} fill={C.white} stroke={C.ink} strokeWidth={6}/>
          <circle cx={270} cy={1150} r={14} fill={C.ink}/>
          <circle cx={320} cy={1150} r={14} fill={C.ink}/>
          <line x1={320} y1={1150} x2={480} y2={1150} stroke={C.ink} strokeWidth={8}/>
          <circle cx={480} cy={1150} r={34} fill={C.white} stroke={C.ink} strokeWidth={6}/>
          {flick && <path d="M 280 1150 L 292 1132 L 298 1166 L 310 1150" fill="none" stroke="#F2B418" strokeWidth={6}/>}
          <text x={295} y={1240} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={2} fill={C.mute}>SPARK</text>
        </g>
        <g opacity={p}>
          <circle cx={840} cy={1150} r={110} fill="none" stroke={C.ink} strokeWidth={7} strokeDasharray="660 30" transform="rotate(-80 840 1150)"/>
          {rx > 0 && flick && <path d="M 858 1040 L 866 1028 L 872 1052 L 880 1040" fill="none" stroke="#F2B418" strokeWidth={6}/>}
          <text x={840} y={1310} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={2} fill={C.mute}>RECEIVER</text>
        </g>
      </svg>
    </div>
  );
};

/** a patent page sliding in, with its number stamped */
export const PatentPage: React.FC<{src: string; p: number; x: number; y: number; w: number; label: string; o?: number; rot?: number}> = ({src, p, x, y, w, label, o = 1, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y + (1 - p) * 600, width: w, opacity: o * Math.min(1, p * 2), transform: `rotate(${rot * p}deg)`}}>
    <div style={{background: "#FBF8F1", padding: 18, boxShadow: "0 30px 60px rgba(40,30,20,0.25)", border: `2px solid ${C.line}`}}>
      <Img src={staticFile(src)} style={{width: "100%", display: "block", mixBlendMode: "multiply"}}/>
    </div>
    <div style={{position: "absolute", right: -20, top: 40, transform: "rotate(8deg)", border: `5px solid ${C.accent}`, color: C.accent, fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 2, padding: "8px 14px", background: "rgba(255,255,255,0.85)"}}>{label}</div>
  </div>
);

/** portrait in a frame with a small credit */
export const Portrait: React.FC<{src: string; p: number; x: number; y: number; w: number; credit: string; o?: number}> = ({src, p, x, y, w, credit, o = 1}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, opacity: o * p, transform: `scale(${0.92 + 0.08 * p})`}}>
    <div style={{background: C.white, padding: 16, boxShadow: "0 30px 60px rgba(40,30,20,0.25)"}}>
      <Img src={staticFile(src)} style={{width: "100%", display: "block", filter: "sepia(0.35) contrast(1.05)"}}/>
    </div>
    <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: C.mute, marginTop: 12, textTransform: "uppercase"}}>{credit}</div>
  </div>
);

/** antenna mast with electrons running up and down */
export const Antenna: React.FC<{x: number; y0: number; y1: number; t: number; p: number; amp?: number; label: string; o?: number}> = ({x, y0, y1, t, p, amp = 1, label, o = 1}) => {
  const mid = (y0 + y1) / 2, half = (y1 - y0) / 2 - 20;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <line x1={x} y1={y0} x2={x} y2={y1} stroke={C.ink} strokeWidth={10}/>
      <path d={`M ${x - 60} ${y1} L ${x} ${y1 - 80} L ${x + 60} ${y1}`} fill="none" stroke={C.ink} strokeWidth={8}/>
      {[0, 1, 2].map((k) => <circle key={k} cx={x} cy={mid + Math.sin(t * 9 + k * 0.6) * half * amp * (1 - k * 0.25)} r={14} fill={C.accent} stroke={C.white} strokeWidth={3}/>)}
      <text x={x} y={y1 + 50} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={2} fill={C.mute}>{label}</text>
    </svg>
  );
};

/** small radio set */
export const RadioSet: React.FC<{x: number; y: number; p: number; o?: number}> = ({x, y, p, o = 1}) => (
  <svg width={300} height={260} style={{position: "absolute", left: x - 150, top: y - 130, opacity: o * p, overflow: "visible"}}>
    <rect x={20} y={60} width={260} height={170} rx={28} fill="#E8C66A" stroke={C.ink} strokeWidth={7}/>
    <circle cx={95} cy={145} r={52} fill={C.white} stroke={C.ink} strokeWidth={6}/>
    {[0, 1, 2, 3].map((i) => <line key={i} x1={60} y1={118 + i * 18} x2={130} y2={118 + i * 18} stroke={C.ink} strokeWidth={4}/>)}
    <rect x={165} y={100} width={90} height={36} rx={6} fill={C.white} stroke={C.ink} strokeWidth={5}/>
    <circle cx={210} cy={185} r={20} fill={C.ink}/>
  </svg>
);

/** AM and FM wave rows */
export const AMFM: React.FC<{p: number; t: number; y: number; o?: number}> = ({p, t, y, o = 1}) => {
  const am = Array.from({length: 160}, (_, i) => { const x = 80 + i * 5.7; const env = 40 + 50 * (0.5 + 0.5 * Math.sin(i / 22 - t * 2)); return `${x},${y + env * Math.sin(i / 2.2 - t * 8)}`; }).join(" ");
  let ph = -t * 8; const fmPts: string[] = [];
  for (let i = 0; i < 320; i++) { ph += 0.28 + 0.2 * Math.sin(i / 45 - t * 1.5); fmPts.push(`${80 + i * 2.85},${y + 330 + 70 * Math.sin(ph)}`); }
  const fm = fmPts.join(" ");
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <text x={80} y={y - 120} fontFamily={HEAD} fontSize={52} fill={C.ink}>AM</text>
      <text x={200} y={y - 120} fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.mute}>CHANGES STRENGTH</text>
      <polyline points={am} fill="none" stroke={C.ink} strokeWidth={6}/>
      <text x={80} y={y + 210} fontFamily={HEAD} fontSize={52} fill={C.accent}>FM</text>
      <text x={200} y={y + 210} fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.mute}>CHANGES FREQUENCY</text>
      <polyline points={fm} fill="none" stroke={C.accent} strokeWidth={6}/>
    </svg>
  );
};

/** tuning scale with a needle at position 0..1 */
export const Dial: React.FC<{v: number; y: number; p: number; o?: number}> = ({v, y, p, o = 1}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
    <rect x={80} y={y} width={920} height={120} rx={20} fill={C.white} stroke={C.ink} strokeWidth={6}/>
    {Array.from({length: 41}).map((_, i) => <line key={i} x1={110 + i * 21.5} y1={y + 20} x2={110 + i * 21.5} y2={y + (i % 5 ? 50 : 70)} stroke={C.ink} strokeWidth={3}/>)}
    {["88", "92", "96", "100", "104", "108"].map((s, i) => <text key={s} x={110 + i * 172} y={y + 104} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={C.mute}>{s}</text>)}
    <line x1={110 + 860 * v} y1={y + 8} x2={110 + 860 * v} y2={y + 112} stroke={C.accent} strokeWidth={8}/>
  </svg>
);

/** England to Newfoundland arc with a travelling "S" (three dots) */
export const Atlantic: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const ax = 860, ay = 1180, bx = 200, by = 1180, cy = 860;
  const q = (s: number) => [(1 - s) * (1 - s) * ax + 2 * (1 - s) * s * 530 + s * s * bx, (1 - s) * (1 - s) * ay + 2 * (1 - s) * s * cy + s * s * by];
  const s = (t * 0.45) % 1;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
      <Draw d={`M ${ax} ${ay} Q 530 ${cy} ${bx} ${by}`} p={p} stroke={C.accent} w={6} len={900}/>
      <circle cx={ax} cy={ay} r={18} fill={C.ink} opacity={p}/><circle cx={bx} cy={by} r={18} fill={C.ink} opacity={p}/>
      <text x={ax} y={ay + 60} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink} opacity={p}>POLDHU, ENGLAND</text>
      <text x={bx} y={by + 60} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={2} fill={C.ink} opacity={p}>NEWFOUNDLAND</text>
      <text x={530} y={1300} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={3} fill={C.mute} opacity={p}>ATLANTIC OCEAN</text>
      {p > 0.9 && [0, 0.05, 0.1].map((d, i) => { const [x, y] = q(Math.max(0, s - d)); return <circle key={i} cx={x} cy={y} r={11} fill={C.accent}/>; })}
    </svg>
  );
};

/** 10 x 10 homes, the first n filled */
export const HundredDots: React.FC<{n: number; p: number; x: number; y: number; o?: number}> = ({n, p, x, y, o = 1}) => (
  <svg width={600} height={600} style={{position: "absolute", left: x, top: y, opacity: o}}>
    {Array.from({length: 100}).map((_, i) => {
      const r = Math.floor(i / 10), c = i % 10, on = i < n && p > 0.3 + i * 0.1;
      return <circle key={i} cx={30 + c * 60} cy={30 + r * 60} r={20} fill={on ? C.accent : C.line} opacity={Math.min(1, p * 2)}/>;
    })}
  </svg>
);
