// Line illustrations for the gadget Shorts, all drawn in code. Each takes progress values (0..1) so beats can animate them.
import React from "react";
import {C, Draw, HEAD, MONO} from "./kit";

/** pair of stem earbuds, drawn as line art */
export const Earbuds: React.FC<{p: number; x: number; y: number; s?: number; o?: number}> = ({p, x, y, s = 1, o = 1}) => {
  const bud = "M 0 0 C -60 0 -78 70 -40 104 C -22 120 -6 118 6 110 L 18 300 C 19 318 44 318 45 300 L 40 96 C 52 70 46 0 0 0 Z";
  return (
    <svg width={520} height={420} style={{position: "absolute", left: x - 260 * s, top: y - 210 * s, transform: `scale(${s})`, transformOrigin: "top left", opacity: o, overflow: "visible"}}>
      <g transform="translate(150,40) rotate(10)"><Draw d={bud} p={p} w={7} len={900}/><circle cx="-8" cy="52" r="20" fill="none" stroke={C.ink} strokeWidth="6" opacity={p}/></g>
      <g transform="translate(370,40) rotate(-10) scale(-1,1)"><Draw d={bud} p={Math.max(0, p * 1.2 - 0.2)} w={7} len={900}/><circle cx="-8" cy="52" r="20" fill="none" stroke={C.ink} strokeWidth="6" opacity={p}/></g>
    </svg>
  );
};

/** Charminar outline (simplified): four minarets, central arch, drawn on with p */
export const Charminar: React.FC<{p: number; x: number; y: number; s?: number; o?: number; color?: string}> = ({p, x, y, s = 1, o = 1, color = C.ink}) => {
  const mins = [20, 120, 380, 480];
  const minaret = (cx: number) => `M ${cx - 16} 520 L ${cx - 16} 120 M ${cx + 16} 520 L ${cx + 16} 120 M ${cx - 24} 330 L ${cx + 24} 330 M ${cx - 24} 220 L ${cx + 24} 220 M ${cx - 16} 120 Q ${cx} 70 ${cx + 16} 120 M ${cx} 82 L ${cx} 58`;
  return (
    <svg width={500} height={540} style={{position: "absolute", left: x - 250 * s, top: y - 270 * s, transform: `scale(${s})`, transformOrigin: "top left", opacity: o, overflow: "visible"}}>
      {mins.map((cx, i) => <Draw key={i} d={minaret(cx)} p={Math.min(1, Math.max(0, p * 1.4 - i * 0.1))} w={6} len={1400} stroke={color}/>)}
      <Draw d="M 36 520 L 464 520 M 36 380 L 464 380 M 136 520 L 136 300 L 364 300 L 364 520" p={p} w={6} len={1600} stroke={color}/>
      <Draw d="M 180 520 L 180 420 Q 250 330 320 420 L 320 520" p={Math.max(0, p * 1.3 - 0.3)} w={6} len={600} stroke={C.accent}/>
      <Draw d="M 136 300 L 136 250 L 364 250 L 364 300" p={Math.max(0, p * 1.3 - 0.3)} w={6} len={700} stroke={color}/>
    </svg>
  );
};

/** map pin that drops in */
export const Pin: React.FC<{p: number; x: number; y: number; s?: number; o?: number}> = ({p, x, y, s = 1, o = 1}) => (
  <svg width={120} height={170} style={{position: "absolute", left: x - 60 * s, top: y - 170 * s - (1 - p) * 300, transform: `scale(${s})`, transformOrigin: "top left", opacity: o * Math.min(1, p * 3), overflow: "visible"}}>
    <ellipse cx="60" cy="166" rx={26 * p} ry={6 * p} fill="#000" opacity="0.18"/>
    <path d="M 60 162 C 60 162 10 96 10 58 A 50 50 0 0 1 110 58 C 110 96 60 162 60 162 Z" fill={C.accent}/>
    <circle cx="60" cy="58" r="20" fill={C.paper}/>
  </svg>
);

/** generic chip with pins and traces running out; label inside */
export const Chip: React.FC<{p: number; x: number; y: number; label: string[]; s?: number; o?: number}> = ({p, x, y, label, s = 1, o = 1}) => {
  const sz = 380, h = sz / 2;
  const traces: string[] = [];
  for (let i = 0; i < 6; i++) {
    const t = -h + 50 + i * 56;
    traces.push(`M ${-h} ${t} L ${-h - 80} ${t} L ${-h - 130} ${t + (i % 2 ? 40 : -40)} L ${-h - 330} ${t + (i % 2 ? 40 : -40)}`);
    traces.push(`M ${h} ${t} L ${h + 80} ${t} L ${h + 130} ${t + (i % 2 ? -40 : 40)} L ${h + 330} ${t + (i % 2 ? -40 : 40)}`);
  }
  return (
    <svg width={1200} height={900} style={{position: "absolute", left: x - 600, top: y - 450, transform: `scale(${s})`, opacity: o, overflow: "visible"}}>
      <g transform="translate(600,450)">
        {traces.map((d, i) => <Draw key={i} d={d} p={Math.max(0, Math.min(1, p * 1.5 - (i % 6) * 0.06))} w={4} len={600} stroke={i % 3 ? "#3A3D48" : C.accent}/>)}
        {Array.from({length: 9}).map((_, i) => (
          <g key={i}>
            <rect x={-h + 30 + i * 38} y={-h - 22} width="14" height="22" fill="#6B6F7C"/><rect x={-h + 30 + i * 38} y={h} width="14" height="22" fill="#6B6F7C"/>
            <rect x={-h - 22} y={-h + 30 + i * 38} width="22" height="14" fill="#6B6F7C"/><rect x={h} y={-h + 30 + i * 38} width="22" height="14" fill="#6B6F7C"/>
          </g>
        ))}
        <rect x={-h} y={-h} width={sz} height={sz} rx="30" fill="#1C1D22" stroke="#4A4D5A" strokeWidth="4"/>
        <rect x={-h + 26} y={-h + 26} width={sz - 52} height={sz - 52} rx="18" fill="none" stroke={C.accent} strokeOpacity="0.6" strokeWidth="3"/>
        {label.map((l, i) => (
          <text key={i} x="0" y={-20 + i * 62} textAnchor="middle" fontFamily={i === 0 ? MONO : HEAD} fontSize={i === 0 ? 28 : 56} letterSpacing={i === 0 ? 4 : -1} fill={i === 0 ? "#9AA0B4" : "#EDE8E0"}>{l}</text>
        ))}
      </g>
    </svg>
  );
};

/** horizontal battery, fill 0..1 */
export const Battery: React.FC<{fill: number; x: number; y: number; w?: number; o?: number}> = ({fill, x, y, w = 760, o = 1}) => {
  const h = w * 0.36;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w + 40, height: h, opacity: o}}>
      <div style={{position: "absolute", left: 0, top: 0, width: w, height: h, border: `10px solid ${C.ink}`, borderRadius: 44, boxSizing: "border-box"}}/>
      <div style={{position: "absolute", left: w + 6, top: h * 0.32, width: 28, height: h * 0.36, background: C.ink, borderRadius: "0 12px 12px 0"}}/>
      <div style={{position: "absolute", left: 24, top: 24, height: h - 48, width: (w - 48) * fill, background: C.accent, borderRadius: 24}}/>
    </div>
  );
};

/** retail box whose flaps open (p) and a two-pin charger that rises out (q) */
export const BoxCharger: React.FC<{p: number; q: number; x: number; y: number; o?: number}> = ({p, q, x, y, o = 1}) => (
  <svg width={700} height={900} style={{position: "absolute", left: x - 350, top: y - 450, opacity: o, overflow: "visible"}}>
    <g transform={`translate(350, ${560 - 330 * q})`}>
      <rect x="-110" y="-140" width="220" height="250" rx="34" fill={C.white} stroke={C.ink} strokeWidth="7"/>
      <rect x="-40" y="60" width="80" height="22" rx="11" fill={C.ink}/>
      <rect x="-50" y="-210" width="22" height="78" rx="10" fill="#B9B3A9" stroke={C.ink} strokeWidth="5"/>
      <rect x="28" y="-210" width="22" height="78" rx="10" fill="#B9B3A9" stroke={C.ink} strokeWidth="5"/>
      <text x="0" y="-30" textAnchor="middle" fontFamily={MONO} fontSize="26" fontWeight="600" letterSpacing="3" fill={C.ink2}>18W</text>
    </g>
    <g transform="translate(350,600)">
      <g transform={`rotate(${-150 * p}, -250, 0)`}><rect x="-250" y="-12" width="250" height="24" rx="6" fill={C.paper2} stroke={C.ink} strokeWidth="6"/></g>
      <g transform={`rotate(${150 * p}, 250, 0)`}><rect x="0" y="-12" width="250" height="24" rx="6" fill={C.paper2} stroke={C.ink} strokeWidth="6"/></g>
      <rect x="-250" y="0" width="500" height="290" rx="14" fill={C.paper2} stroke={C.ink} strokeWidth="7"/>
      <text x="0" y="160" textAnchor="middle" fontFamily={HEAD} fontSize="44" fill={C.ink} letterSpacing="-1">IN THE BOX</text>
    </g>
  </svg>
);

/** square of pixels: shows a low-res grid zoom */
export const PixelGrid: React.FC<{p: number; x: number; y: number; n?: number; size?: number; o?: number}> = ({p, x, y, n = 9, size = 420, o = 1}) => {
  const c = size / n; const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const k = (i * 7 + j * 3) % 5; const vis = p * n * 2 - (i + j) > 0;
    cells.push(<rect key={`${i}-${j}`} x={j * c + 3} y={i * c + 3} width={c - 6} height={c - 6} rx="4" fill={[C.accent, "#5E7BEA", C.ink2, "#9DB0F2", C.mute][k]} opacity={vis ? 0.9 : 0}/>);
  }
  return <svg width={size} height={size} style={{position: "absolute", left: x, top: y, opacity: o, border: `6px solid ${C.ink}`, borderRadius: 18, background: C.white}}>{cells}</svg>;
};

/** sun with rays for brightness */
export const Sun: React.FC<{p: number; x: number; y: number; s?: number; o?: number}> = ({p, x, y, s = 1, o = 1}) => (
  <svg width={300} height={300} style={{position: "absolute", left: x - 150 * s, top: y - 150 * s, transform: `scale(${s})`, transformOrigin: "top left", opacity: o, overflow: "visible"}}>
    <circle cx="150" cy="150" r={56 * p} fill={C.accent}/>
    {Array.from({length: 12}).map((_, i) => {
      const a = (i / 12) * Math.PI * 2, r0 = 82, r1 = 82 + 44 * p;
      return <line key={i} x1={150 + Math.cos(a) * r0} y1={150 + Math.sin(a) * r0} x2={150 + Math.cos(a) * r1} y2={150 + Math.sin(a) * r1} stroke={C.ink} strokeWidth="9" strokeLinecap="round" opacity={p}/>;
    })}
  </svg>
);

/** pickup -> repair -> drop loop with a phone icon travelling round it */
export const ServiceLoop: React.FC<{p: number; t: number; x: number; y: number; o?: number}> = ({p, t, x, y, o = 1}) => {
  const R = 230; const nodes = [["PICK UP", -90], ["FIX", 30], ["DROP", 150]] as const;
  const a = (t % 1) * Math.PI * 2 - Math.PI / 2;
  return (
    <svg width={760} height={640} style={{position: "absolute", left: x - 380, top: y - 320, opacity: o, overflow: "visible"}}>
      <g transform="translate(380,320)">
        <circle r={R} fill="none" stroke={C.line} strokeWidth="10"/>
        <circle r={R} fill="none" stroke={C.ink} strokeWidth="10" strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - p)} transform="rotate(-90)" strokeLinecap="round"/>
        {nodes.map(([l, deg], i) => {
          const r = (deg * Math.PI) / 180; const nx = Math.cos(r) * R, ny = Math.sin(r) * R;
          return (
            <g key={i} opacity={Math.min(1, Math.max(0, p * 3 - i))}>
              <circle cx={nx} cy={ny} r="34" fill={C.paper} stroke={C.ink} strokeWidth="8"/>
              <text x={nx} y={ny + (deg === -90 ? -58 : 82)} textAnchor="middle" fontFamily={MONO} fontWeight="600" fontSize="28" letterSpacing="3" fill={C.ink}>{l}</text>
            </g>
          );
        })}
        <g transform={`translate(${Math.cos(a) * R}, ${Math.sin(a) * R})`} opacity={p}>
          <rect x="-18" y="-32" width="36" height="64" rx="9" fill={C.accent} stroke={C.ink} strokeWidth="4"/>
        </g>
      </g>
    </svg>
  );
};

/** wired earphone plug (3.5 mm) coming up from below, tip at (x, y) */
export const Plug: React.FC<{p: number; x: number; y: number; s?: number}> = ({p, x, y, s = 1}) => (
  <svg width={120} height={900} style={{position: "absolute", left: x - 60 * s, top: y + (1 - p) * 500, transform: `scale(${s})`, transformOrigin: "top left", opacity: Math.min(1, p * 4), overflow: "visible"}}>
    <rect x="52" y="0" width="16" height="70" rx="5" fill="#C9CDD3" stroke={C.ink} strokeWidth="3"/>
    <rect x="52" y="22" width="16" height="5" fill={C.ink}/><rect x="52" y="42" width="16" height="5" fill={C.ink}/>
    <rect x="34" y="70" width="52" height="150" rx="16" fill={C.ink}/>
    <path d="M 60 220 C 60 400 20 520 60 900" fill="none" stroke={C.ink} strokeWidth="10"/>
  </svg>
);
