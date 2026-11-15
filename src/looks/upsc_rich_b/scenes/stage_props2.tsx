// Look B stage props for Part 2: three painted postcards on a line (Konkan in rain, Thar dunes, a Chennai shore under October cloud),
// a season report card with one empty tick box, and the faint glowing rain belt of Part 1 drifting along the top of the frame.
// No digits on any prop. Everything is a smooth function of f.
import React, {useMemo} from "react";
import {SANS, SERIF, clamp, eio, eo, lerp, prog, rng} from "../kit";
import {popK} from "./stage_ui";

export type PostcardWhich = "konkan" | "thar" | "chennai";
export const POSTCARDS: PostcardWhich[] = ["konkan", "thar", "chennai"];
export const PC_W = 300, PC_H = 208;

// ------------------------------------------------------------------------------------------------------------------ painted scenes (inner 276 x 184)
const KonkanArt: React.FC<{f: number}> = ({f}) => {
  const drops = useMemo(() => { const r = rng(12); return Array.from({length: 46}).map(() => ({x: r() * 300, y: r() * 200, v: 0.7 + r() * 0.7, l: 9 + r() * 12})); }, []);
  return (
    <g>
      <rect x="0" y="0" width="276" height="184" fill="url(#pc-kon-sky)"/>
      <g opacity="0.95"><ellipse cx="60" cy="26" rx="110" ry="24" fill="#56677a"/><ellipse cx="200" cy="16" rx="120" ry="26" fill="#47586c"/><ellipse cx="130" cy="44" rx="130" ry="18" fill="#6c7f90" opacity="0.8"/></g>
      <path d="M0,92 C30,70 62,66 96,84 C130,60 176,58 216,80 C240,70 262,74 276,82 L276,184 L0,184 Z" fill="#6b9a86" opacity="0.8"/>
      <rect x="0" y="100" width="276" height="26" fill="url(#pc-kon-sea)"/>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-20 + i * 10},${106 + i * 6} q20,-5 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0`} stroke="#e8f4f2" strokeWidth="1.6" fill="none" opacity="0.7" transform={`translate(${Math.sin(f / 18 + i) * 4} 0)`}/>)}
      <path d="M0,120 C40,112 90,118 130,126 C180,134 230,128 276,120 L276,184 L0,184 Z" fill="#3f7a46"/>
      <path d="M0,142 C50,130 110,140 160,148 C210,154 250,146 276,140 L276,184 L0,184 Z" fill="#2f6a3a"/>
      {/* a tiled house */}
      <g transform="translate(176 120)"><rect x="-26" y="-18" width="52" height="24" fill="#efe3c6" stroke="#a79672" strokeWidth="1"/><path d="M-34,-16 L0,-44 L34,-16 Z" fill="#b3532e" stroke="#6a2f1c" strokeWidth="1"/><rect x="-5" y="-12" width="10" height="18" fill="#5a4630"/></g>
      {/* coconut palms leaning in the wind */}
      {[[44, 150, 1.0, -1], [86, 156, 0.8, 1], [236, 152, 0.9, -1]].map(([x, y, s, d], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d={`M0,0 C${d * 4},-30 ${d * 12},-60 ${d * 30},-84`} stroke="#6b4a2e" strokeWidth="4.4" fill="none" strokeLinecap="round"/>
          <g transform={`translate(${d * 30} -84) rotate(${Math.sin(f / 9 + i) * 4})`}>{[-130, -90, -50, -10, 30, 70, 110, 150].map((a, k) => <path key={k} transform={`rotate(${a})`} d="M0,0 C14,-10 34,-8 46,8 C34,0 16,-1 0,3 Z" fill={k % 2 ? "#2d6a3a" : "#3b7e44"} stroke="#1b4526" strokeWidth="0.7"/>)}</g>
        </g>
      ))}
      <rect x="0" y="0" width="276" height="184" fill="#33485a" opacity="0.16"/>
      {drops.map((d, i) => { const y = ((d.y + f * 7 * d.v) % 230) - 24, x = (d.x - y * 0.28 + 400) % 300; return <path key={i} d={`M${x},${y} l-${d.l * 0.28},${d.l}`} stroke="#eaf3f8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>; })}
    </g>
  );
};
const TharArt: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x="0" y="0" width="276" height="184" fill="url(#pc-thar-sky)"/>
    <circle cx="208" cy="40" r="74" fill="url(#pc-thar-sun)"/><circle cx="208" cy="40" r="15" fill="#fffef0"/>
    <g opacity="0.45" filter="url(#pp-blur2)"><ellipse cx="60" cy="42" rx="46" ry="5" fill="#fff"/><ellipse cx="86" cy="52" rx="34" ry="4" fill="#fff"/></g>
    <path d="M0,104 C40,90 90,92 130,104 C176,96 226,92 276,102 L276,184 L0,184 Z" fill="#e6bb74"/>
    <path d="M0,116 C30,100 80,98 120,112 C160,128 210,112 276,106 L276,184 L0,184 Z" fill="#d79e55"/>
    <path d="M0,116 C30,100 80,98 120,112 C130,116 100,122 60,126 C30,128 10,124 0,126 Z" fill="#a86d34" opacity="0.55"/>
    <path d="M0,142 C60,120 130,130 190,148 C226,158 256,150 276,144 L276,184 L0,184 Z" fill="#c98943"/>
    <path d="M0,142 C60,120 130,130 150,138 C100,138 40,146 0,160 Z" fill="#8f5a28" opacity="0.5"/>
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${14 + i * 4},${150 + i * 7} q40,-6 80,0 t80,0 t90,0`} stroke="#f3d89a" strokeWidth="1.1" fill="none" opacity="0.6"/>)}
    {/* a khejri tree and a camel on the far crest */}
    <g transform="translate(64 108)"><path d="M0,0 L2,-26 M2,-22 L-12,-34 M2,-22 L14,-36" stroke="#5d4630" strokeWidth="2.4" fill="none"/>{[[-14, -36], [0, -42], [16, -38], [-4, -30]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill="#7c8c4c"/>)}</g>
    <g transform={`translate(${210 + Math.sin(f / 80) * 3} 112)`} fill="#5a3a22"><path d="M-18,0 L-18,-14 C-20,-20 -14,-26 -10,-20 C-6,-26 0,-20 2,-14 C8,-20 12,-24 14,-30 L18,-30 L16,-20 L14,0 L10,0 L10,-10 L-12,-10 L-14,0 Z"/></g>
    <g opacity="0.5">{[0, 1].map((i) => <path key={i} d={`M0,${102 + i * 4} ${Array.from({length: 14}).map((_, k) => `L${k * 20},${102 + i * 4 + 2 * Math.sin(f / 10 + k + i)}`).join(" ")}`} stroke="#fff6dc" strokeWidth="2" fill="none"/>)}</g>
  </g>
);
const ChennaiArt: React.FC<{f: number}> = ({f}) => {
  const rain = useMemo(() => { const r = rng(4); return Array.from({length: 30}).map(() => ({x: 150 + r() * 126, y: r() * 90, v: 0.6 + r() * 0.5})); }, []);
  return (
    <g>
      <rect x="0" y="0" width="276" height="184" fill="url(#pc-che-sky)"/>
      <g><ellipse cx="50" cy="20" rx="120" ry="30" fill="#3d4a5a"/><ellipse cx="190" cy="14" rx="120" ry="32" fill="#2f3b4b"/><ellipse cx="120" cy="50" rx="150" ry="22" fill="#566677"/><ellipse cx="250" cy="48" rx="70" ry="18" fill="#4a5a6b"/>
        <ellipse cx="10" cy="62" rx="80" ry="12" fill="#6c7d8d" opacity="0.8"/></g>
      <rect x="0" y="82" width="276" height="48" fill="url(#pc-che-sea)"/>
      <rect x="150" y="62" width="126" height="24" fill="#b7c5ce" opacity="0.5" filter="url(#pp-blur2)"/>
      {rain.map((d, i) => { const y = 54 + ((d.y + f * 3.4 * d.v) % 70), x = d.x - (y - 54) * 0.2; return <path key={i} d={`M${x},${y} l-3,12`} stroke="#d5e0e8" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>; })}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-20 + i * 14},${92 + i * 8} q20,-5 40,0 t40,0 t40,0 t40,0 t40,0 t40,0 t40,0`} stroke="#d9e8ea" strokeWidth={1 + i * 0.3} fill="none" opacity="0.6" transform={`translate(${Math.sin(f / 16 + i) * 5} 0)`}/>)}
      <path d="M0,130 C70,122 170,126 276,128 L276,184 L0,184 Z" fill="#cdb98a"/>
      <path d="M0,130 C70,122 170,126 276,128 L276,134 C170,132 70,128 0,136 Z" fill="#f4f1e6" opacity="0.8"/>
      <path d="M0,156 C80,148 170,156 276,150 L276,184 L0,184 Z" fill="#b9a374"/>
      {/* a lighthouse and a log catamaran on the sand */}
      <g transform="translate(222 130)"><path d="M-9,0 L-6,-56 L6,-56 L9,0 Z" fill="#efe9dc" stroke="#8a8272" strokeWidth="1"/><path d="M-7.5,-18 L7.5,-18 L8,-26 L-8,-26 Z M-6.5,-38 L6.5,-38 L7,-46 L-7,-46 Z" fill="#c24a32"/><rect x="-7" y="-64" width="14" height="8" fill="#3a3f46"/><path d="M-9,-64 L0,-74 L9,-64 Z" fill="#c24a32"/></g>
      <g transform="translate(86 150)"><path d="M-54,6 C-30,-2 30,-2 56,-2 L50,8 C20,12 -30,12 -56,10 Z" fill="#8a6540" stroke="#4a3320" strokeWidth="1.3"/><path d="M-46,2 L44,0 M-48,8 L48,5" stroke="#4a3320" strokeWidth="1" opacity="0.6"/><path d="M-12,0 L-6,-50 L20,-4 Z" fill="#e9dfc3" stroke="#8a7a55" strokeWidth="1"/><path d="M-6,-50 L-6,2" stroke="#4a3320" strokeWidth="1.8"/></g>
      {[[40, 52], [64, 40], [84, 56]].map(([x, y], i) => <path key={i} transform={`translate(${x + Math.sin(f / 30 + i) * 6} ${y + Math.sin(f / 12 + i) * 2})`} d={`M-7,0 Q-3,-5 0,0 Q3,-5 7,0`} stroke="#eef2f4" strokeWidth="1.6" fill="none"/>)}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------ postcards
export const PostcardDefs: React.FC = () => (
  <defs>
    <linearGradient id="pc-kon-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f6073"/><stop offset="1" stopColor="#a8b8c2"/></linearGradient>
    <linearGradient id="pc-kon-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6e8f9c"/><stop offset="1" stopColor="#47788a"/></linearGradient>
    <linearGradient id="pc-thar-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f86d6"/><stop offset="0.7" stopColor="#8cc7ee"/><stop offset="1" stopColor="#f6e6bd"/></linearGradient>
    <radialGradient id="pc-thar-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbe0"/><stop offset="0.4" stopColor="#fff0b0" stopOpacity="0.5"/><stop offset="1" stopColor="#fff0b0" stopOpacity="0"/></radialGradient>
    <linearGradient id="pc-che-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2e3b4a"/><stop offset="0.8" stopColor="#7d8e9c"/><stop offset="1" stopColor="#aebbc2"/></linearGradient>
    <linearGradient id="pc-che-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b8591"/><stop offset="1" stopColor="#3f6370"/></linearGradient>
    <linearGradient id="pc-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf4"/><stop offset="1" stopColor="#efe4c8"/></linearGradient>
    <radialGradient id="pc-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0.6" stopColor="#ffe29a" stopOpacity="0.85"/><stop offset="1" stopColor="#ffe29a" stopOpacity="0"/></radialGradient>
  </defs>
);

const Card: React.FC<{which: PostcardWhich; f: number; hl: boolean}> = ({which, f, hl}) => (
  <g>
    <rect x={-PC_W / 2 + 8} y={10} width={PC_W} height={PC_H} rx="9" fill="#3a2a22" opacity="0.28" filter="url(#pp-blur2)"/>
    <rect x={-PC_W / 2} y={0} width={PC_W} height={PC_H} rx="8" fill="url(#pc-paper)" stroke={hl ? "#d98a2c" : "#b9a77c"} strokeWidth={hl ? 3 : 1.6}/>
    <g transform={`translate(${-PC_W / 2 + 12} 12)`}>
      <clipPath id={`pc-clip-${which}`}><rect x="0" y="0" width="276" height="184" rx="3"/></clipPath>
      <g clipPath={`url(#pc-clip-${which})`}>
        {which === "konkan" && <KonkanArt f={f}/>}{which === "thar" && <TharArt f={f}/>}{which === "chennai" && <ChennaiArt f={f}/>}
        <rect x="0" y="0" width="276" height="184" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="6"/>
      </g>
      <rect x="0" y="0" width="276" height="184" rx="3" fill="none" stroke="#6b5a3a" strokeWidth="1.2" opacity="0.7"/>
    </g>
    {/* a stamp and a postmark, no lettering */}
    <g transform={`translate(${PC_W / 2 - 44} 36) rotate(5)`} opacity="0.92">
      <rect x="-19" y="-24" width="38" height="46" fill="#fff8e6" stroke="#b9503a" strokeWidth="2" strokeDasharray="3 2"/>
      <path d="M-11,14 L0,-14 L11,14 Z" fill="#c25a35" opacity="0.8"/><circle cx="0" cy="-8" r="5" fill="#e8b84a"/>
    </g>
    <g transform={`translate(${PC_W / 2 - 78} 44)`} opacity="0.55" fill="none" stroke="#3d4a6a" strokeWidth="1.6"><circle r="17"/><circle r="12"/><path d="M-34,-4 q9,-5 17,0 t17,0 M-34,6 q9,-5 17,0 t17,0"/></g>
  </g>
);

export const Postcards: React.FC<{x: number; y: number; s: number; f: number; cards: {which: PostcardWhich; t0: number; hl: boolean}[]}> = ({x, y, s, f, cards}) => {
  const SPAN = 400, anyHl = cards.some((c) => c.hl && f >= c.t0);
  const y0 = -150, x0 = -x / s - 80, x1 = SPAN * 1.5, sag = 36 + Math.sin(f / 50) * 2;
  const lineD = `M${x0},${y0 - 22} Q${(x0 + x1) / 2},${y0 + sag} ${x1},${y0 - 6}`;
  const lineY = (cx: number) => { const t = (cx - x0) / (x1 - x0), cy = y0 + sag; return (1 - t) * (1 - t) * (y0 - 22) + 2 * t * (1 - t) * cy + t * t * (y0 - 6); };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* the line: tied off the left of the frame, sagging, a bamboo pole at the right */}
      <path d={lineD} stroke="#3a2a20" strokeWidth="4.6" fill="none" opacity="0.2" transform="translate(0 8)" filter="url(#pp-blur2)"/>
      <path d={lineD} stroke="#d8c9a4" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d={lineD} stroke="#8a7647" strokeWidth="1.1" fill="none" strokeDasharray="5 4" opacity="0.8"/>
      <g transform={`translate(${x1} ${y0 - 6})`}><path d="M0,-10 L0,420" stroke="#8a6a44" strokeWidth="11" strokeLinecap="round"/><path d="M-3,-8 L-3,418" stroke="#c4a276" strokeWidth="3.4" opacity="0.8"/><circle r="9" fill="#8a6a44" stroke="#4a3320" strokeWidth="1.4"/><circle r="4" fill="#d8c9a4"/></g>
      {cards.map((c, i) => {
        if (f < c.t0) return null;
        const cx = (i - 1) * SPAN, k = popK(f, c.t0, 20), lift = c.hl ? eo(prog(f, c.t0, 18)) : 0;
        const swing = Math.sin(f / 30 + i * 1.9) * 1.7 + Math.sin(f / 13 + i) * 0.5 + (1 - clamp(k)) * 8, drop = (1 - clamp(k)) * -90;
        return (
          <g key={c.which} transform={`translate(${cx} ${lineY(cx) + 4 + drop - lift * 26}) rotate(${swing * (1 - lift * 0.6)}) scale(${(0.97 + 0.17 * lift) * clamp(k * 1.4)})`} opacity={(anyHl && !c.hl ? 0.78 : 1) * clamp(k * 2)}>
            {c.hl && <ellipse cx="0" cy={PC_H / 2} rx={PC_W * 0.78} ry={PC_H * 0.74} fill="url(#pc-glow)" opacity={lift * (0.7 + 0.3 * Math.sin(f / 11))}/>}
            <Card which={c.which} f={f} hl={c.hl}/>
            <g transform="translate(0 -4)"><rect x="-8" y="-14" width="16" height="38" rx="3" fill="#c79a5a" stroke="#6e4b25" strokeWidth="1.3"/><rect x="-8" y="-14" width="16" height="12" rx="3" fill="#dcb578" stroke="#6e4b25" strokeWidth="1.1"/><path d="M-8,6 H8" stroke="#6e4b25" strokeWidth="1.6"/><circle cx="0" cy="-8" r="2" fill="#8a8e92"/></g>
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------ report card
export const RC_W = 400, RC_H = 520;
const IconRow: React.FC<{kind: number; y: number; wv: number}> = ({kind, y, wv}) => (
  <g transform={`translate(0 ${y})`}>
    <circle cx="34" cy="0" r="21" fill="#e6f1f4" stroke="#7aa9bb" strokeWidth="1.6"/>
    {kind === 0 && <g><ellipse cx="30" cy="-2" rx="14" ry="8" fill="#9fb4c4"/><ellipse cx="38" cy="-5" rx="10" ry="7" fill="#c3d1dd"/>{[24, 32, 40].map((x, i) => <path key={i} d={`M${x},5 l-3,8`} stroke="#3f86b8" strokeWidth="2.2" strokeLinecap="round"/>)}</g>}
    {kind === 1 && <g><circle cx="34" cy="0" r="8" fill="#f2b632" stroke="#c07a12" strokeWidth="1.2"/>{Array.from({length: 8}).map((_, i) => <path key={i} d="M34,-13 v-5" stroke="#f2b632" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${i * 45} 34 0)`}/>)}</g>}
    {kind === 2 && <g stroke="#4c86a8" strokeWidth="2.4" fill="none" strokeLinecap="round"><path d="M20,-6 H42 q7,0 7,-6"/><path d="M20,2 H46 q7,0 7,6"/><path d="M24,10 H36"/></g>}
    {kind === 3 && <g><path d="M34,-12 C42,-2 44,2 44,6 A10,10 0 0 1 24,6 C24,2 26,-2 34,-12 Z" fill="#4e9bcf" stroke="#2c6a96" strokeWidth="1.4"/></g>}
    <rect x="72" y="-9" width={wv} height="8" rx="4" fill="#cdbf9f"/><rect x="72" y="4" width={wv * 0.6} height="6" rx="3" fill="#e1d5ba"/>
    <circle cx="326" cy="0" r="19" fill="none" stroke="#c4b48c" strokeWidth="1.8" strokeDasharray="4 4"/>
  </g>
);
export const ReportCard: React.FC<{x: number; y: number; s: number; f: number; boxText: string; t0: number}> = ({x, y, s, f, boxText, t0}) => {
  const appear = popK(f, 4, 22), a = eo(prog(f, t0, 26)), draw = eio(prog(f, t0, 22)), pulse = 0.5 + 0.5 * Math.sin(f / 10), bob = Math.sin(f / 36) * 3;
  const tick = 338;   // the verdict row sits here
  const pen = f >= t0 ? eo(prog(f, t0, 30)) : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s * clamp(appear)}) rotate(${-1.8 + Math.sin(f / 60) * 0.5}) translate(${-RC_W / 2} ${-RC_H / 2})`} opacity={clamp(appear * 2)}>
      <rect x="14" y="26" width={RC_W} height={RC_H} rx="18" fill="#3a2a22" opacity="0.3" filter="url(#pp-blur)"/>
      <rect x="0" y="0" width={RC_W} height={RC_H} rx="16" fill="url(#pc-paper)" stroke="#a89774" strokeWidth="2"/>
      <rect x="14" y="14" width={RC_W - 28} height={RC_H - 28} rx="10" fill="none" stroke="#c0492f" strokeWidth="1.4" opacity="0.55"/>
      {/* masthead */}
      <path d={`M0,16 a16,16 0 0 1 16,-16 H${RC_W - 16} a16,16 0 0 1 16,16 V86 H0 Z`} fill="#2f7d86" stroke="#1d4f58" strokeWidth="1.6"/>
      <text x={RC_W / 2} y="52" textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize="34" letterSpacing="4" fill="#fff4e0">SEASON REPORT</text>
      <text x={RC_W / 2} y="76" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="13" letterSpacing="5" fill="#bfe3e4">ALL OF INDIA</text>
            {[0, 1, 2, 3].map((i) => <IconRow key={i} kind={i} y={136 + i * 46} wv={[170, 140, 188, 120][i]}/>)}
      {/* the verdict row */}
      <path d={`M24,${tick - 40} H${RC_W - 24}`} stroke="#a89774" strokeWidth="1.4" strokeDasharray="6 5"/>
      <text x="36" y={tick + 4} fontFamily={SANS} fontWeight={800} fontSize="16" letterSpacing="4" fill="#8a7647">THE WHOLE SEASON</text>
      <g opacity={a}>
        <rect x="36" y={tick + 30} width="86" height="86" rx="10" fill="#fffdf4" stroke="#fff" strokeWidth="2"/>
        <path d={`M36,${tick + 40} q0,-10 10,-10 H112 q10,0 10,10 V${tick + 106} q0,10 -10,10 H46 q-10,0 -10,-10 Z`} fill="none" stroke="#2a3f55" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw}/>
        <text x="79" y={tick + 92} textAnchor="middle" fontFamily={SERIF} fontWeight={500} fontSize="64" fill="#d98a2c" opacity={0.28 + 0.4 * pulse}>?</text>
        <text x="140" y={tick + 84} fontFamily={SERIF} fontWeight={600} fontSize="46" letterSpacing="1" fill="#bd3a1e">{boxText}</text>
      </g>
      {f >= t0 && <g transform={`translate(${lerp(300, 156, eo(pen))} ${lerp(tick + 190, tick + 124, eo(pen)) + Math.sin(f / 7) * 1.5}) rotate(${lerp(32, 20, eo(pen))})`} opacity={clamp(pen * 2)}>
        <rect x="-8" y="-3.6" width="112" height="7.2" rx="3" fill="#e8b830" stroke="#8a6212" strokeWidth="1.2"/><path d="M-8,-3.6 l-24,3.6 l24,3.6 Z" fill="#f3d9a8" stroke="#8a6212" strokeWidth="1.2"/><path d="M-32,0 l6,0" stroke="#3b3b3b" strokeWidth="3"/><rect x="96" y="-3.6" width="14" height="7.2" rx="3" fill="#c0492f"/>
      </g>}
      <g transform={`translate(${RC_W - 40} -6)`}><path d="M0,0 v54 a10,10 0 0 0 20,0 v-48" fill="none" stroke="#9aa0a4" strokeWidth="3.2" strokeLinecap="round"/></g>
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------ the rain belt, faint, along the top
export const Belt: React.FC<{f: number; t0: number}> = ({f, t0}) => {
  const a = eo(prog(f, t0, 46)), pulse = 0.5 + 0.5 * Math.sin(f / 16);
  const puffs = useMemo(() => Array.from({length: 22}).map((_, i) => { const r = rng(200 + i); return {x: i * 120 + r() * 40, y: 56 + r() * 34, s: 0.9 + r() * 0.7, p: [0, 1, 2, 3, 4].map(() => ({dx: (r() - 0.5) * 90, dy: (r() - 0.5) * 12, r: 16 + r() * 18}))}; }), []);
  if (f < t0) return null;
  return (
    <g opacity={a * 0.72} style={{pointerEvents: "none"}}>
      <ellipse cx="960" cy="66" rx="1180" ry={84 + 6 * pulse} fill="#ff8f2a" opacity="0.32" filter="url(#pp-blur)"/>
      <ellipse cx="960" cy="66" rx="1100" ry={48 + 4 * pulse} fill="#ffc050" opacity="0.4" filter="url(#pp-blur)"/>
      <ellipse cx="960" cy="66" rx="1000" ry={24 + 3 * pulse} fill="#fff1b8" opacity="0.5" filter="url(#pp-blur2)"/>
      <g>
        {puffs.map((c, i) => { const x = ((c.x + f * 0.55) % 2640) - 360;
          return <g key={i} transform={`translate(${x} ${c.y + Math.sin(f / 40 + i) * 3}) scale(${c.s})`}>
            {c.p.map((q, k) => <ellipse key={`b${k}`} cx={q.dx} cy={q.dy + 7} rx={q.r} ry={q.r * 0.66} fill="#c7d3e4" opacity="0.9"/>)}
            {c.p.map((q, k) => <ellipse key={`t${k}`} cx={q.dx - 3} cy={q.dy - 2} rx={q.r * 0.9} ry={q.r * 0.58} fill="#fffaf0"/>)}
          </g>; })}
      </g>
    </g>
  );
};
