// Look B props for the stage scene: bucket (empty / filling / full), thermometer (high / mid), year calendar (June to September lit), open book (glow).
// All drawn in code. No digits on any prop: a thermometer or bucket never prints a figure; numbers only come from fig() cards.
import React from "react";
import {SANS, SERIF, clamp, eio, eo, lerp, prog, rng} from "../kit";

export const PropDefs: React.FC = () => (
  <defs>
    <linearGradient id="pp-board" x1="0" x2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#e8dcc4"/></linearGradient>
    <linearGradient id="pp-mer" x1="0" x2="1"><stop offset="0" stopColor="#f0604a"/><stop offset="1" stopColor="#b8281a"/></linearGradient>
    <linearGradient id="pp-bkt" x1="0" x2="1"><stop offset="0" stopColor="#f08a5a"/><stop offset="0.6" stopColor="#d4502f"/><stop offset="1" stopColor="#a63520"/></linearGradient>
    <linearGradient id="pp-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fc1ea"/><stop offset="1" stopColor="#2d7fb8"/></linearGradient>
    <radialGradient id="pp-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2b8" stopOpacity="0.95"/><stop offset="0.4" stopColor="#ffd98a" stopOpacity="0.5"/><stop offset="1" stopColor="#ffd98a" stopOpacity="0"/></radialGradient>
    <linearGradient id="pp-page" x1="0" x2="1"><stop offset="0" stopColor="#fff9ea"/><stop offset="1" stopColor="#efe2c4"/></linearGradient>
    <linearGradient id="pp-cover" x1="0" x2="1"><stop offset="0" stopColor="#2f7d86"/><stop offset="1" stopColor="#1d4f58"/></linearGradient>
    <filter id="pp-blur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="pp-blur2" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>
);

/** The bucket: feet at (x, y). level 0..1 fills it (seen through the open top); full overflows a little. */
export const Bucket: React.FC<{x: number; y: number; s: number; f: number; level: number; rain?: boolean}> = ({x, y, s, f, level, rain}) => {
  const shift = (1 - level) * 20, full = level > 0.97;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * 0.92})`}>
      <ellipse cx="14" cy="4" rx="64" ry="12" fill="#4a4678" opacity="0.28" filter="url(#pp-blur)"/>
      <path d="M-40,-92 C-46,-60 -34,-22 -28,-2 L28,-2 C34,-22 46,-60 40,-92 Z" fill="url(#pp-bkt)" stroke="#8a2c1d" strokeWidth="1.3"/>
      <path d="M-36,-84 C-36,-60 -26,-26 -22,-6" stroke="#ffd0a6" strokeWidth="3" opacity="0.6" fill="none"/>
      {[-60, -36, -14].map((yy, i) => <path key={i} d={`M-${41 - i * 2.5},${yy} Q0,${yy + 6} ${41 - i * 2.5},${yy}`} stroke="#8a2c1d" strokeWidth="1.1" fill="none" opacity="0.5"/>)}
      <ellipse cx="0" cy="-92" rx="41" ry="11" fill="#2a1612" stroke="#f1d9c6" strokeWidth="4.5"/>
      <clipPath id="pp-bk-open"><ellipse cx="0" cy="-88" rx="35" ry="7.5"/></clipPath>
      <ellipse cx="0" cy="-88" rx="35" ry="7.5" fill="#46302a"/>
      <g clipPath="url(#pp-bk-open)">
        {level > 0.02 && <ellipse cx="0" cy={-88 + shift} rx="36" ry="8" fill="url(#pp-water)"/>}
        {level > 0.02 && <path d={`M-24,${-89 + shift} q10,-3 22,0`} stroke="#e8f6ff" strokeWidth="1.4" fill="none" opacity="0.8"/>}
        {level > 0.2 && rain && [0, 1, 2].map((k) => { const t = (f / 18 + k / 3) % 1; return <ellipse key={k} cx={(k - 1) * 14} cy={-88 + shift} rx={t * 22} ry={t * 5} fill="none" stroke="#f1f7fa" strokeWidth="1.2" opacity={(1 - t) * 0.9}/>; })}
      </g>
      {full && <>
        <path d="M-10,-83 C-8,-74 -12,-62 -10,-50" stroke="#6bb4e0" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8"/>
        <path d="M-10,-83 C-8,-74 -12,-62 -10,-50" stroke="#e8f6ff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9"/>
        {[0, 1].map((k) => { const t = (f / 16 + k * 0.5) % 1; return <circle key={k} cx={-10 - t * 3} cy={-50 + t * 40} r={2.6 - t} fill="#6bb4e0" opacity={1 - t}/>; })}
      </>}
      <path d="M-40,-96 C-44,-148 44,-148 40,-96" stroke="#9aa0a4" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <path d="M-38,-104 C-40,-136 -10,-146 4,-143" stroke="#e4e8ea" strokeWidth="1.2" fill="none"/>
      <rect x="-47" y="-100" width="7" height="9" rx="2" fill="#6b7075"/><rect x="40" y="-100" width="7" height="9" rx="2" fill="#6b7075"/>
    </g>
  );
};

/** A wall thermometer board, centre (x, y), no numerals (only tick marks). level 0..1 sets the mercury. */
export const Thermometer: React.FC<{x: number; y: number; s: number; level: number; f: number}> = ({x, y, s, level}) => {
  const top = -175, bot = 150, tubeTop = top + 58, tubeBot = bot - 62, tl = tubeBot - tubeTop, mer = tubeBot - tl * level;
  return (
    <g transform={`translate(${x} ${y + 12 * s * 0.5}) scale(${s / 2})`}>
      <rect x={-56 + 6} y={top + 8} width={112} height={bot - top} rx="14" fill="#3a2a22" opacity="0.25" filter="url(#pp-blur2)"/>
      <rect x={-56} y={top} width={112} height={bot - top} rx="14" fill="url(#pp-board)" stroke="#8c7a63" strokeWidth="2"/>
      <rect x={-50} y={top + 6} width={100} height={bot - top - 12} rx="10" fill="none" stroke="#c63f2f" strokeWidth="1.2" opacity="0.6"/>
      {[[-40, 18], [40, 18], [-40, bot - top - 18], [40, bot - top - 18]].map(([ox, oy], i) => <g key={i}><circle cx={ox} cy={top + oy} r="4.2" fill="#a8a29a" stroke="#6a655e"/><path d={`M${ox - 2.4},${top + oy - 0.8} l4.8,1.6`} stroke="#5b564f" strokeWidth="1"/></g>)}
      <text x={0} y={top + 44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="17" letterSpacing="2" fill="#7a2a1d">{"°C"}</text>
      {Array.from({length: 26}).map((_, i) => { const yy = tubeBot - (tl * i) / 25, maj = i % 5 === 0; return <g key={i}><path d={`M12,${yy} h${maj ? 15 : 8}`} stroke="#4b3e34" strokeWidth={maj ? 1.8 : 1}/><path d={`M-12,${yy} h${maj ? -15 : -8}`} stroke="#4b3e34" strokeWidth={maj ? 1.8 : 1}/></g>; })}
      <rect x={-6} y={tubeTop - 6} width={12} height={tl + 12} rx="6" fill="#fdfaf2" stroke="#8d8579" strokeWidth="1.4"/>
      <circle cx={0} cy={tubeBot + 20} r="19" fill="#fdfaf2" stroke="#8d8579" strokeWidth="1.4"/>
      <circle cx={0} cy={tubeBot + 20} r="14.5" fill="url(#pp-mer)"/>
      <rect x={-3.4} y={mer} width="6.8" height={tubeBot + 14 - mer} fill="url(#pp-mer)"/>
      <ellipse cx={0} cy={mer} rx="3.4" ry="2" fill="#e2503c"/>
      <rect x={-4.6} y={tubeTop - 2} width="2.4" height={tl} rx="1.2" fill="#fff" opacity="0.75"/>
      <circle cx={-6} cy={tubeBot + 14} r="4.4" fill="#fff" opacity="0.7"/>
    </g>
  );
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const CAL_W = 520, CAL_H = 400;
/** A wall-year calendar (no day numbers, only month names), centre (x, y). hl lights June to September one by one. */
export const Calendar: React.FC<{x: number; y: number; s: number; f: number; hl: boolean; t0: number}> = ({x, y, s, f, hl, t0}) => {
  const sc = s / 3, cw = 112, ch = 86, gx = 12, gy = 14, ox = (CAL_W - (4 * cw + 3 * gx)) / 2, oy = 92;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc}) translate(${-CAL_W / 2} ${-CAL_H / 2})`}>
      <rect x="10" y="22" width={CAL_W} height={CAL_H} rx="18" fill="#4a4678" opacity="0.25" filter="url(#pp-blur)"/>
      <rect x="0" y="12" width={CAL_W} height={CAL_H - 12} rx="16" fill="url(#pp-board)" stroke="#a08c6c" strokeWidth="2"/>
      <path d={`M0,28 a16,16 0 0 1 16,-16 H${CAL_W - 16} a16,16 0 0 1 16,16 V74 H0 Z`} fill="#c0492f" stroke="#7f2d1b" strokeWidth="1.6"/>
      <text x={CAL_W / 2} y="58" textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize="34" letterSpacing="3" fill="#fff4e0">THE YEAR</text>
      {[70, 170, 260, 350, 450].map((rx) => <g key={rx}><rect x={rx - 7} y="2" width="14" height="24" rx="6" fill="#d8d2c4" stroke="#6a655e" strokeWidth="1.2"/><circle cx={rx} cy="18" r="4" fill="#4b463e"/></g>)}
      {MONTHS.map((m, i) => {
        const cx = ox + (i % 4) * (cw + gx), cy = oy + Math.floor(i / 4) * (ch + gy), lit = hl && i >= 5 && i <= 8;
        const a = lit ? eo(prog(f, t0 + 10 + (i - 5) * 10, 14)) : 0;
        return (
          <g key={m}>
            <rect x={cx} y={cy} width={cw} height={ch} rx="10" fill="#fffdf6" stroke="#cdbf9f" strokeWidth="1.3"/>
            {lit && <rect x={cx} y={cy} width={cw} height={ch} rx="10" fill="#bfe0f4" stroke="#2f7fb6" strokeWidth="2.4" opacity={a}/>}
            {Array.from({length: 3}).map((_, r) => <path key={r} d={`M${cx + 14},${cy + 44 + r * 11} H${cx + cw - 14}`} stroke={lit ? "#5aa3cf" : "#e3d8bf"} strokeWidth="2" strokeLinecap="round"/>)}
            <text x={cx + cw / 2} y={cy + 30} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="22" letterSpacing="2.4" fill={lit ? lerpColor(a) : "#8a7a5c"}>{m}</text>
            {lit && a > 0.2 && <path d={`M${cx + cw - 22},${cy + 8} q-7,11 0,15 q7,-4 0,-15 Z`} fill="#2f7fb6" opacity={a * 0.9} transform={`translate(0 ${Math.sin(f / 12 + i) * 1.5})`}/>}
          </g>
        );
      })}
    </g>
  );
};
const lerpColor = (a: number) => (a > 0.5 ? "#14507c" : "#8a7a5c");

/** An open book hovering, bobbing; glow adds a pulsing golden halo with sparks. Centre (x, y), s = size (s 2 is about 520 wide). */
export const Book: React.FC<{x: number; y: number; s: number; f: number; glow?: boolean}> = ({x, y, s, f, glow}) => {
  const turn = (f % 100) / 100, flipping = turn > 0.7, fp = clamp((turn - 0.7) / 0.28), ang = eio(fp);
  const pulse = 0.7 + 0.3 * Math.sin(f / 9);
  const sparks = React.useMemo(() => { const r = rng(7); return Array.from({length: 22}).map(() => ({a: r() * 6.28, d: 160 + r() * 200, ph: r() * 6.28, sp: 0.6 + r() * 0.8})); }, []);
  const bob = Math.sin(f / 22) * 7;
  return (
    <g>
      <ellipse cx={x} cy={y + 92 * s + 56} rx={150 * s * (1 - bob * 0.004)} ry={16} fill="#3a2a22" opacity="0.28" filter="url(#pp-blur)"/>
      <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
        {glow && <g>
          <circle cx="0" cy="0" r={400 + 50 * pulse} fill="url(#pp-halo)" opacity={0.7 + 0.3 * pulse}/>
          {sparks.map((p, i) => { const t = (f * 0.011 * p.sp + p.ph) % 1; return <path key={i} transform={`translate(${Math.cos(p.a) * p.d * (0.6 + t * 0.5)} ${Math.sin(p.a) * p.d * 0.7 * (0.6 + t * 0.5) - t * 30}) scale(${1 - t})`} d="M0,-11 L3,-3 L11,0 L3,3 L0,11 L-3,3 L-11,0 L-3,-3 Z" fill="#ffe27a" opacity={0.9 * (1 - t)}/>; })}
        </g>}
        {/* cover, page blocks, spine */}
        <path d="M-136,-76 C-70,-96 -26,-88 0,-70 C26,-88 70,-96 136,-76 L142,82 C74,64 28,72 0,92 C-28,72 -74,64 -142,82 Z" fill="url(#pp-cover)" stroke="#12373e" strokeWidth="2"/>
        <path d="M-128,-74 C-66,-92 -26,-84 -2,-66 L-2,84 C-28,66 -70,60 -130,76 Z" fill="url(#pp-page)" stroke="#a89774" strokeWidth="1.4"/>
        <path d="M128,-74 C66,-92 26,-84 2,-66 L2,84 C28,66 70,60 130,76 Z" fill="url(#pp-page)" stroke="#a89774" strokeWidth="1.4"/>
        <path d="M-128,-74 C-66,-92 -26,-84 -2,-66" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
        {/* lines of text as soft bars (no words) */}
        {Array.from({length: 9}).map((_, i) => <path key={`l${i}`} d={`M${-112 + i * 0.8},${-48 + i * 13.5} C${-80},${-58 + i * 13.5} ${-40},${-52 + i * 13.5} ${-14},${-40 + i * 13.5 - (i % 4) * 5}`} stroke="#9c8a68" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity="0.55"/>)}
        {Array.from({length: 9}).map((_, i) => <path key={`r${i}`} d={`M${14},${-40 + i * 13.5} C${40},${-52 + i * 13.5} ${80},${-58 + i * 13.5} ${112 - (i % 3) * 14},${-48 + i * 13.5}`} stroke="#9c8a68" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity="0.55"/>)}
        <rect x="46" y="-30" width="62" height="40" rx="5" fill="#cfe6f3" stroke="#6aa4c4" strokeWidth="1.4" opacity="0.9"/>
        <path d="M54,-6 q10,-14 20,-4 t22,-2" stroke="#2f7fb6" strokeWidth="2.4" fill="none"/>
        {/* a page turning */}
        {flipping && <g transform={`scale(${Math.cos(ang * Math.PI)} 1)`}>
          <path d="M2,-66 C26,-84 66,-92 128,-74 L130,76 C70,60 28,66 2,84 Z" fill="url(#pp-page)" stroke="#a89774" strokeWidth="1.2"/>
          {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${18},${-40 + i * 15} H${100 - (i % 3) * 12}`} stroke="#9c8a68" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>)}
        </g>}
        <path d="M-2,-66 V84" stroke="#8a7650" strokeWidth="2.4"/>
        <path d="M30,92 v34 l8,-8 l8,8 v-38" fill="#c0492f" stroke="#7f2d1b" strokeWidth="1.2"/>
      </g>
    </g>
  );
};
