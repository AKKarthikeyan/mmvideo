// Rich, moving art for the explain-like-I'm-5 radio episode (AK 22-23 Oct 2026: rich motion and rich visuals, fill the screen).
// All drawn in code; everything keeps moving. Page coordinates (1080 x 1920) inside the Safe box; keep content above y 1600.
import React from "react";
import {C, Draw, HEAD, MONO, SERIF, W} from "../kit";

const HOT = "#E8563A", WARM = "#F2A03D", GOLD = "#E8C66A", SKY = "#CFE6F5", WATER = "#7DB8DE", WATER_D = "#3F86BC", GRASS = "#9CC98A", WOOD = "#A8714A";

/** expanding arcs (or full rings) from (cx, cy); t in seconds */
export const Waves2: React.FC<{cx: number; cy: number; t: number; maxR?: number; span?: number; n?: number; color?: string; o?: number; dir?: number; w?: number; dash?: boolean}> = ({cx, cy, t, maxR = 700, span = 42, n = 5, color = C.accent, o = 1, dir = 0, w = 8, dash}) => {
  const arcs = [];
  for (let k = 0; k < n; k++) {
    const r = ((t * 260 + (k * maxR) / n) % maxR) + 20, op = o * Math.max(0, 1 - r / maxR);
    if (span >= 180) { arcs.push(<circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={w} opacity={op} strokeDasharray={dash ? "18 16" : undefined}/>); continue; }
    const a0 = ((dir - span) * Math.PI) / 180, a1 = ((dir + span) * Math.PI) / 180;
    arcs.push(<path key={k} d={`M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" opacity={op} strokeDasharray={dash ? "18 16" : undefined}/>);
  }
  return <g>{arcs}</g>;
};

/** Bose's demonstration in colour: two rooms, blackboard, transmitter, two walls, a ringing bell, gunpowder with smoke */
export const Classroom: React.FC<{p: number; t: number; ring: number; burst: number; wallHi: number; dim?: number; o?: number}> = ({p, t, ring, burst, wallHi, dim = 0, o = 1}) => {
  const g = 1420, sway = Math.sin(t * 38) * 20 * ring;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <rect x={50} y={900} width={430} height={g - 900} fill="#F7E7CF"/>
      <rect x={650} y={900} width={380} height={g - 900} fill="#E7EEF3"/>
      <rect x={30} y={g} width={1020} height={36} rx={8} fill="#C9A27A"/>
      <rect x={90} y={940} width={260} height={150} rx={10} fill="#2F4A3A" stroke={WOOD} strokeWidth={10}/>
      <text x={220} y={1030} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={58} fill="#EDEFE6">1895</text>
      <Waves2 cx={300} cy={1265} t={t} maxR={720} n={6}/>
      {/* table + transmitter */}
      <rect x={110} y={1330} width={240} height={18} rx={6} fill={WOOD}/><rect x={130} y={1348} width={14} height={72} fill={WOOD}/><rect x={316} y={1348} width={14} height={72} fill={WOOD}/>
      <rect x={140} y={1222} width={130} height={108} rx={12} fill="#FFFFFF" stroke={C.ink} strokeWidth={6}/>
      <circle cx={180} cy={1276} r={18} fill={C.accent}/><rect x={210} y={1258} width={44} height={14} rx={4} fill={C.ink2}/>
      <path d="M 270 1240 L 340 1210 L 340 1320 L 270 1300 Z" fill={GOLD} stroke={C.ink} strokeWidth={6}/>
      {/* walls */}
      {[480, 610].map((x) => <rect key={x} x={x} y={880} width={42} height={g - 880} rx={6} fill={wallHi > 0.5 ? C.accent : "#8B7F74"} stroke={C.ink} strokeWidth={4}/>)}
      {[0, 1, 2, 3, 4].map((r) => [480, 610].map((x) => <line key={`${x}${r}`} x1={x} y1={940 + r * 100} x2={x + 42} y2={940 + r * 100} stroke={C.ink} strokeOpacity={0.25} strokeWidth={4}/>))}
      {/* bell */}
      {ring > 0 && <circle cx={850} cy={1150} r={130 + 10 * Math.sin(t * 20)} fill={GOLD} opacity={0.25}/>}
      <line x1={850} y1={1000} x2={850} y2={1060} stroke={C.ink} strokeWidth={8}/>
      <rect x={790} y={990} width={120} height={14} rx={6} fill={WOOD}/>
      <g transform={`translate(850,1060) rotate(${sway})`}>
        <path d="M -70 120 C -70 30 -50 0 0 0 C 50 0 70 30 70 120 L 90 140 L -90 140 Z" fill={GOLD} stroke={C.ink} strokeWidth={7}/>
        <path d="M -40 30 C -30 12 -10 8 6 8" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7}/>
        <circle cx={0} cy={156} r={16} fill={C.ink}/>
      </g>
      {ring > 0 && [0, 1].map((k) => <path key={k} d={`M ${960 + k * 30} ${1060 + k * 40} q 20 30 0 60`} fill="none" stroke={C.ink} strokeWidth={6} opacity={ring}/>)}
      {ring > 0 && [0, 1].map((k) => <path key={"l" + k} d={`M ${740 - k * 30} ${1060 + k * 40} q -20 30 0 60`} fill="none" stroke={C.ink} strokeWidth={6} opacity={ring}/>)}
      {/* gunpowder */}
      <path d="M 880 1410 Q 950 1430 1010 1410 L 1000 1392 L 890 1392 Z" fill={C.ink2}/>
      {burst > 0 && (
        <g>
          {[0, 1, 2, 3].map((k) => { const ph = Math.min(1, burst + k * 0.1); return <circle key={k} cx={930 + k * 20 - 30} cy={1350 - ph * 160 - k * 30} r={40 + ph * 40} fill="#B8B0A6" opacity={0.5 * (1 - ph * 0.6)}/>; })}
          <g transform={`translate(945, 1370) scale(${Math.min(1, burst * 2)})`} opacity={1 - Math.max(0, burst - 0.6)}>
            <polygon points="0,-110 26,-36 104,-60 50,0 110,48 30,36 0,110 -30,36 -110,48 -50,0 -104,-60 -26,-36" fill={WARM} stroke={C.ink} strokeWidth={6}/>
            <circle r={30} fill="#FFE08A"/>
          </g>
        </g>
      )}
      {dim > 0 && <g opacity={dim}>
        <Draw d="M 270 1490 L 900 1490 M 296 1470 L 270 1490 L 296 1510 M 874 1470 L 900 1490 L 874 1510" p={dim} stroke={C.accent} w={7} len={900}/>
        <text x={585} y={1555} textAnchor="middle" fontFamily={HEAD} fontSize={56} fill={C.accent}>2 WALLS</text>
      </g>}
    </svg>
  );
};

/** two houses far apart joined by a long wire over hills; a letter runs along it */
export const LongWire: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const poles = [250, 420, 590, 760], q = (t * 0.25) % 1, lx = 170 + q * 740;
  const House = ({x, c}: {x: number; c: string}) => (
    <g transform={`translate(${x},1300)`}><rect x={-70} y={-100} width={140} height={110} fill={c} stroke={C.ink} strokeWidth={6}/><path d="M -90 -96 L 0 -170 L 90 -96 Z" fill={HOT} stroke={C.ink} strokeWidth={6}/><rect x={-20} y={-50} width={40} height={60} fill={C.ink2}/></g>
  );
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <path d="M 40 1320 Q 260 1180 520 1300 Q 760 1190 1040 1310 L 1040 1500 L 40 1500 Z" fill={GRASS}/>
      <path d="M 40 1380 Q 300 1320 560 1390 Q 800 1330 1040 1400 L 1040 1500 L 40 1500 Z" fill="#7FB46E"/>
      <House x={150} c="#F7E7CF"/><House x={930} c="#E7EEF3"/>
      {poles.map((x, i) => <g key={x} opacity={Math.min(1, Math.max(0, p * 4 - i))}><line x1={x} y1={1060} x2={x} y2={1340} stroke={WOOD} strokeWidth={12}/><line x1={x - 40} y1={1080} x2={x + 40} y2={1080} stroke={WOOD} strokeWidth={9}/></g>)}
      <Draw d="M 200 1150 Q 225 1110 250 1080 Q 335 1120 420 1080 Q 505 1120 590 1080 Q 675 1120 760 1080 Q 835 1110 880 1150" p={p} w={5} len={1100}/>
      <g transform={`translate(${lx},${1092 + Math.sin(q * Math.PI * 8) * 12})`}><rect x={-26} y={-18} width={52} height={36} rx={4} fill={C.white} stroke={C.ink} strokeWidth={4}/><path d="M -26 -18 L 0 4 L 26 -18" fill="none" stroke={C.ink} strokeWidth={4}/></g>
    </svg>
  );
};

/** pebbles drop into a pond: ripples; then invisible (dashed) ripples fill the air around a radio */
export const Pond: React.FC<{p: number; t: number; air: number; o?: number}> = ({p, t, air, o = 1}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
    <ellipse cx={540} cy={1330} rx={460} ry={170} fill={WATER}/>
    <ellipse cx={540} cy={1330} rx={460} ry={170} fill="none" stroke={WATER_D} strokeWidth={8}/>
    {[0, 1, 2, 3].map((k) => { const ph = (t * 0.45 + k / 4) % 1; return <ellipse key={k} cx={540} cy={1330} rx={30 + ph * 420} ry={10 + ph * 150} fill="none" stroke="#fff" strokeWidth={6} opacity={(1 - ph) * 0.9}/>; })}
    {(() => { const ph = (t * 0.45) % 1; return ph < 0.2 ? <circle cx={540} cy={1330 - (0.2 - ph) * 1200} r={16} fill={C.ink2}/> : null; })()}
    {air > 0 && <g opacity={air}>
      <g transform="translate(540,960)"><rect x={-80} y={-50} width={160} height={110} rx={20} fill={GOLD} stroke={C.ink} strokeWidth={6}/><circle cx={-30} cy={5} r={28} fill="#fff" stroke={C.ink} strokeWidth={5}/><rect x={14} y={-20} width={46} height={22} rx={4} fill="#fff" stroke={C.ink} strokeWidth={4}/></g>
      <Waves2 cx={540} cy={960} t={t} maxR={420} span={180} n={4} color={C.accent} w={6} dash/>
      <text x={540} y={760} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={28} letterSpacing={4} fill={C.accent}>INVISIBLE WAVES</text>
    </g>}
  </svg>
);

/** Hertz's spark gap with glow, and a receiving loop that sparks when the wave arrives */
export const Spark2: React.FC<{p: number; t: number; rx: number; o?: number}> = ({p, t, rx, o = 1}) => {
  const fl = (Math.floor(t * 30) % 4) < 2;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <Waves2 cx={300} cy={1200} t={t} maxR={540} span={36}/>
      <circle cx={295} cy={1200} r={fl ? 70 : 50} fill="#FFE08A" opacity={0.45}/>
      <line x1={110} y1={1200} x2={270} y2={1200} stroke={C.ink} strokeWidth={10}/><line x1={320} y1={1200} x2={480} y2={1200} stroke={C.ink} strokeWidth={10}/>
      <circle cx={110} cy={1200} r={44} fill="#C9CDD3" stroke={C.ink} strokeWidth={6}/><circle cx={480} cy={1200} r={44} fill="#C9CDD3" stroke={C.ink} strokeWidth={6}/>
      <circle cx={268} cy={1200} r={16} fill={C.ink}/><circle cx={322} cy={1200} r={16} fill={C.ink}/>
      {fl && <path d="M 280 1200 L 292 1176 L 298 1222 L 312 1200" fill="none" stroke="#F2B418" strokeWidth={8}/>}
      <circle cx={850} cy={1200} r={130} fill="none" stroke={C.ink} strokeWidth={9} strokeDasharray="780 36" transform="rotate(-80 850 1200)"/>
      {rx > 0 && <circle cx={872} cy={1072} r={fl ? 40 : 26} fill="#FFE08A" opacity={0.6}/>}
      {rx > 0 && fl && <path d="M 862 1074 L 870 1058 L 876 1086 L 886 1070" fill="none" stroke="#F2B418" strokeWidth={7}/>}
      <text x={295} y={1310} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.mute}>SPARK</text>
      <text x={850} y={1380} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.mute}>CAUGHT HERE</text>
    </svg>
  );
};

/** England to Newfoundland over a moving sea; a kite lifts the receiving wire; three dots (Morse S) cross */
export const Ocean: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const ax = 900, ay = 1200, bx = 180, by = 1200, cyy = 860, s = (t * 0.45) % 1;
  const q = (u: number) => [(1 - u) * (1 - u) * ax + 2 * (1 - u) * u * 540 + u * u * bx, (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * cyy + u * u * by];
  const sea = (y: number, ph: number) => { const pts = []; for (let x = 60; x <= 1020; x += 20) pts.push(`${x},${y + 12 * Math.sin(x / 60 + ph)}`); return `M 60 1500 L ${pts.join(" L ")} L 1020 1500 Z`; };
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <path d={sea(1250, t * 2)} fill={WATER} opacity={0.6}/><path d={sea(1290, -t * 2.4)} fill={WATER_D} opacity={0.7}/>
      <path d="M 60 1260 Q 120 1150 260 1180 L 300 1260 Z" fill={GRASS} stroke={C.ink} strokeWidth={5}/>
      <path d="M 1020 1260 Q 960 1140 820 1170 L 790 1260 Z" fill={GRASS} stroke={C.ink} strokeWidth={5}/>
      <line x1={190} y1={1180} x2={250 + Math.sin(t) * 10} y2={930} stroke={C.ink} strokeWidth={3}/>
      <g transform={`translate(${250 + Math.sin(t) * 10},930) rotate(${Math.sin(t * 1.3) * 8})`}><path d="M 0 -50 L 36 0 L 0 50 L -36 0 Z" fill={HOT} stroke={C.ink} strokeWidth={5}/><path d="M 0 50 q 10 20 -6 40 q 14 10 0 30" fill="none" stroke={C.ink} strokeWidth={3}/></g>
      <rect x={890} y={1080} width={18} height={100} fill={C.ink2}/><path d="M 870 1080 L 899 1030 L 928 1080 Z" fill={C.ink2}/>
      <Draw d={`M ${ax} ${ay - 30} Q 540 ${cyy} ${bx} ${by - 30}`} p={Math.min(1, p * 1.3)} stroke={C.accent} w={7} len={1000}/>
      {[0, 0.05, 0.1].map((d, i) => { const [x, y] = q(Math.max(0, s - d)); return <g key={i}><circle cx={x} cy={y - 30} r={22} fill={C.accent} opacity={0.2}/><circle cx={x} cy={y - 30} r={12} fill={C.accent}/></g>; })}
      <text x={900} y={1340} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={26} letterSpacing={3} fill={C.white}>ENGLAND</text>
      <text x={190} y={1340} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={26} letterSpacing={3} fill={C.white}>NEWFOUNDLAND</text>
      <text x={540} y={1440} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={4} fill={C.white} opacity={0.9}>ATLANTIC OCEAN</text>
    </svg>
  );
};

/** radio tower over a city: electrons run up and down, waves fly over rooftops to a house where a radio plays music */
export const TowerCity: React.FC<{p: number; t: number; send: number; recv: number; o?: number}> = ({p, t, send, recv, o = 1}) => {
  const blink = Math.floor(t * 2) % 2 === 0;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      {/* skyline */}
      {[[60, 1240, 120], [190, 1180, 100], [300, 1280, 140], [460, 1200, 110], [580, 1260, 120], [710, 1220, 90]].map(([x, y, w], i) => (
        <g key={i}><rect x={x} y={y} width={w} height={1480 - y} fill={i % 2 ? "#D8DEE6" : "#E6E0D6"} stroke={C.ink} strokeOpacity={0.35} strokeWidth={4}/>
          {Array.from({length: 6}).map((_, k) => <rect key={k} x={x + 16 + (k % 2) * (w / 2 - 6)} y={y + 24 + Math.floor(k / 2) * 60} width={22} height={28} fill={(k + i + Math.floor(t)) % 3 ? "#F6E7A8" : "#BFC8D2"}/>)}</g>
      ))}
      <rect x={40} y={1480} width={1000} height={20} fill="#B9AFA3"/>
      {/* tower */}
      <g transform="translate(190,0)">
        <path d="M -70 1480 L -12 760 L 12 760 L 70 1480" fill="none" stroke={C.ink} strokeWidth={10}/>
        {Array.from({length: 9}).map((_, k) => { const y = 840 + k * 72, hw = 12 + (y - 760) / 720 * 58; return <path key={k} d={`M ${-hw} ${y} L ${hw} ${y + 72} M ${hw} ${y} L ${-hw} ${y + 72}`} stroke={C.ink} strokeWidth={4} opacity={0.6}/>; })}
        <circle cx={0} cy={745} r={14} fill={blink ? HOT : "#7A2C20"}/>{blink && <circle cx={0} cy={745} r={34} fill={HOT} opacity={0.25}/>}
        {[0, 1, 2, 3].map((k) => <g key={k}><circle cx={0} cy={1110 + Math.sin(t * 10 + k * 0.7) * 300} r={18} fill={C.accent} opacity={0.25 * send}/><circle cx={0} cy={1110 + Math.sin(t * 10 + k * 0.7) * 300} r={10} fill={C.accent} opacity={send}/></g>)}
      </g>
      {send > 0 && <Waves2 cx={190} cy={800} t={t} maxR={820} span={32} dir={14} n={6} o={send}/>}
      {/* house with radio */}
      <g transform="translate(900,1480)">
        <rect x={-110} y={-230} width={220} height={230} fill="#F7E7CF" stroke={C.ink} strokeWidth={6}/><path d="M -135 -226 L 0 -330 L 135 -226 Z" fill={HOT} stroke={C.ink} strokeWidth={6}/>
        <line x1={60} y1={-300} x2={60} y2={-420} stroke={C.ink} strokeWidth={6}/>
        {[0, 1].map((k) => <circle key={k} cx={60} cy={-360 + Math.sin(t * 10 + k) * 50} r={8} fill={C.accent} opacity={recv}/>)}
        <g transform="translate(0,-90)"><rect x={-70} y={-50} width={140} height={96} rx={18} fill={GOLD} stroke={C.ink} strokeWidth={6}/><circle cx={-24} cy={0} r={26} fill="#fff" stroke={C.ink} strokeWidth={5}/><rect x={14} y={-22} width={42} height={20} rx={4} fill="#fff" stroke={C.ink} strokeWidth={4}/></g>
      </g>
      {recv > 0 && [0, 1, 2].map((k) => { const ph = (t * 0.6 + k / 3) % 1; return <text key={k} x={850 - ph * 60 + k * 30} y={1300 - ph * 260} fontFamily={HEAD} fontSize={64} fill={C.accent} opacity={recv * (1 - ph)}>{k % 2 ? "♫" : "♪"}</text>; })}
    </svg>
  );
};

/** a radio with a big tuning knob; colourful station waves, one picked; speech bubbles of a noisy room */
export const Tuner: React.FC<{p: number; t: number; pick: number; o?: number}> = ({p, t, pick, o = 1}) => {
  const waves = [{c: HOT, f: 2.4, y: 860}, {c: "#4E9A5B", f: 3.6, y: 960}, {c: C.accent, f: 5.0, y: 1060}, {c: WARM, f: 7.0, y: 1160}];
  const chosen = 2, ang = -60 + 120 * pick;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      {waves.map((w, i) => {
        const pts = Array.from({length: 120}, (_, k) => `${80 + k * 7.5},${w.y + 34 * Math.sin(k / (12 / w.f) - t * 6)}`).join(" ");
        const on = i === chosen ? 1 : 1 - 0.75 * pick;
        return <polyline key={i} points={pts} fill="none" stroke={w.c} strokeWidth={i === chosen ? 10 : 7} opacity={on}/>;
      })}
      <g transform="translate(540,1400)">
        <rect x={-300} y={-140} width={600} height={260} rx={40} fill={GOLD} stroke={C.ink} strokeWidth={8}/>
        <rect x={-260} y={-110} width={300} height={80} rx={12} fill="#FFF8E6" stroke={C.ink} strokeWidth={5}/>
        {Array.from({length: 13}).map((_, k) => <line key={k} x1={-240 + k * 22} y1={-100} x2={-240 + k * 22} y2={k % 3 ? -80 : -70} stroke={C.ink} strokeWidth={3}/>)}
        <line x1={-240 + 264 * (0.2 + 0.5 * pick)} y1={-108} x2={-240 + 264 * (0.2 + 0.5 * pick)} y2={-32} stroke={HOT} strokeWidth={6}/>
        {Array.from({length: 4}).map((_, k) => <line key={k} x1={-250} y1={10 + k * 26} x2={40} y2={10 + k * 26} stroke={C.ink} strokeWidth={5} opacity={0.6}/>)}
        <g transform={`translate(170,0) rotate(${ang})`}><circle r={84} fill={C.ink2} stroke={C.ink} strokeWidth={6}/><circle r={60} fill="#5A524B"/><rect x={-8} y={-80} width={16} height={44} rx={8} fill={C.white}/></g>
      </g>
    </svg>
  );
};

/** a noisy room: many grey speech bubbles, one friend's bubble in colour */
export const NoisyRoom: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const bubbles = [[180, 900], [420, 860], [700, 900], [300, 1060], [600, 1050], [880, 1040], [200, 1220], [520, 1210], [820, 1220]];
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      {bubbles.map(([x, y], i) => {
        const me = i === 4, bob = Math.sin(t * 3 + i) * 8;
        return <g key={i} transform={`translate(${x},${y + bob}) scale(${me ? 1.3 : 0.9})`} opacity={me ? 1 : 0.5}>
          <path d="M -90 -50 Q -90 -80 -60 -80 L 60 -80 Q 90 -80 90 -50 L 90 10 Q 90 40 60 40 L -10 40 L -40 70 L -36 40 L -60 40 Q -90 40 -90 10 Z" fill={me ? C.accent : "#D6CEC2"} stroke={C.ink} strokeWidth={me ? 6 : 4}/>
          <text x={0} y={-6} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill={me ? C.white : C.ink2}>{me ? "HI!" : "blah"}</text>
        </g>;
      })}
      <text x={540} y={1400} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={4} fill={C.mute}>ANALOGY</text>
    </svg>
  );
};

/** jigsaw: four named pieces slide together, a fifth "many others" joins */
export const Jigsaw: React.FC<{p: number[]; o?: number}> = ({p, o = 1}) => {
  const names = ["MAXWELL", "HERTZ", "BOSE", "MARCONI", "+ MANY MORE"], cols = [C.accent, "#4E9A5B", HOT, WARM, "#8B7F74"];
  const home = [[300, 960], [580, 960], [300, 1220], [580, 1220], [440, 1440]], from = [[-300, 600], [1400, 600], [-300, 1500], [1400, 1500], [540, 2200]];
  const piece = "M -120 -100 L -20 -100 Q -20 -140 10 -140 Q 40 -140 40 -100 L 120 -100 L 120 -20 Q 160 -20 160 10 Q 160 40 120 40 L 120 120 L -120 120 Z";
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
      {names.map((n, i) => {
        const k = p[i] ?? 0, x = from[i][0] + (home[i][0] - from[i][0]) * k, y = from[i][1] + (home[i][1] - from[i][1]) * k;
        return <g key={n} transform={`translate(${x},${y}) rotate(${(1 - k) * (i % 2 ? 30 : -30)}) scale(${i === 4 ? 0.8 : 1})`} opacity={Math.min(1, k * 2)}>
          <path d={piece} fill={cols[i]} stroke={C.ink} strokeWidth={6}/>
          <text x={0} y={20} textAnchor="middle" fontFamily={HEAD} fontSize={i === 4 ? 34 : 40} fill={C.white}>{n}</text>
        </g>;
      })}
    </svg>
  );
};

/** an old valve radio set in a wooden cabinet, its dial glowing */
export const ValveRadio: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
    <ellipse cx={540} cy={1560} rx={330} ry={26} fill="#000" opacity={0.12}/>
    <path d="M 240 1550 L 240 1000 Q 240 820 540 820 Q 840 820 840 1000 L 840 1550 Z" fill={WOOD} stroke={C.ink} strokeWidth={8}/>
    <path d="M 300 1180 L 300 1010 Q 300 880 540 880 Q 780 880 780 1010 L 780 1180 Z" fill="#E9D9B8" stroke={C.ink} strokeWidth={6}/>
    {Array.from({length: 9}).map((_, k) => <line key={k} x1={330 + k * 52} y1={930} x2={330 + k * 52} y2={1170} stroke="#C8B38A" strokeWidth={8}/>)}
    <rect x={330} y={1230} width={420} height={90} rx={14} fill="#FFF3D0" stroke={C.ink} strokeWidth={5}/>
    <rect x={330} y={1230} width={420} height={90} rx={14} fill={WARM} opacity={0.2 + 0.15 * Math.sin(t * 3)}/>
    <line x1={360 + ((t * 40) % 360)} y1={1238} x2={360 + ((t * 40) % 360)} y2={1312} stroke={HOT} strokeWidth={5}/>
    {[400, 680].map((x) => <circle key={x} cx={x} cy={1430} r={46} fill="#5A3A24" stroke={C.ink} strokeWidth={5}/>)}
  </svg>
);

/** 100 little people (or homes); the first n filled */
export const Hundred: React.FC<{n: number; p: number; kind: "person" | "home"; o?: number}> = ({n, p, kind, o = 1}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
    {Array.from({length: 100}).map((_, i) => {
      const r = Math.floor(i / 10), c = i % 10, x = 150 + c * 86, y = 760 + r * 82, on = i < n && p * 100 > i;
      const fill = on ? C.accent : "#D6CEC2";
      return kind === "person"
        ? <g key={i} transform={`translate(${x},${y})`} opacity={Math.min(1, p * 3)}><circle cx={0} cy={-18} r={12} fill={fill}/><path d="M -18 26 Q -18 -2 0 -2 Q 18 -2 18 26 Z" fill={fill}/></g>
        : <g key={i} transform={`translate(${x},${y})`} opacity={Math.min(1, p * 3)}><path d="M -22 4 L 0 -20 L 22 4 L 16 4 L 16 26 L -16 26 L -16 4 Z" fill={fill}/></g>;
    })}
  </svg>
);
