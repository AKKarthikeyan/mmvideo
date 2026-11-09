import React from "react";
import {AbsoluteFill} from "remotion";
import {Fonts, SERIF, SANS, PaperFinish, rng} from "../kit";
import {C, Relief, ReliefDefs, Cloud, Pencil} from "./art";
import {Logo1Art, Logo2Art} from "./logos";

export const BW = 2560, BH = 1440;
// YouTube safe area: 1546 x 423, centred
export const SAFE = {x: (BW - 1546) / 2, y: (BH - 423) / 2, w: 1546, h: 423};

const ridge = (y: number, amp: number, seed: number, step = 160) => {
  const R = rng(seed); let d = `M-40,${BH}L-40,${y}`;
  for (let x = -40; x <= BW + 160; x += step) d += ` Q${x + step / 2},${y - amp * (0.3 + R())} ${x + step},${y + (R() - 0.5) * amp * 0.5}`;
  return d + `L${BW + 160},${BH}Z`;
};

export const Banner: React.FC = () => {
  const sx = SAFE.x, sy = SAFE.y;
  return (
    <Fonts><AbsoluteFill style={{background: C.cream}}>
      <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{position: "absolute"}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfe5e8"/><stop offset=".45" stopColor="#eaf0e4"/><stop offset=".62" stopColor="#fbefd0"/></linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff6d0" stopOpacity="1"/><stop offset=".25" stopColor="#ffeab0" stopOpacity=".7"/><stop offset="1" stopColor="#ffe3a0" stopOpacity="0"/></radialGradient>
          <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9b27c"/><stop offset=".25" stopColor="#c99a62"/><stop offset="1" stopColor="#a67a48"/></linearGradient>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3c4" stopOpacity=".55"/><stop offset="1" stopColor="#fff3c4" stopOpacity="0"/></linearGradient>
          <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf6"/><stop offset="1" stopColor="#fbefd2"/></linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22"/></filter>
          <filter id="soft2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
          <clipPath id="atL"><path d="M0,0 L1,0 L1,1 L0,1Z"/></clipPath>
          <clipPath id="pg1"><rect x={0} y={0} width={470} height={560} rx={6}/></clipPath>
          <clipPath id="pg2"><rect x={0} y={0} width={470} height={560} rx={6}/></clipPath>
          <clipPath id="nbr"><rect x={0} y={0} width={420} height={540} rx={8}/></clipPath>
          <ReliefDefs id="rA"/><ReliefDefs id="rB"/><ReliefDefs id="rC"/>
        </defs>

        {/* sky */}
        <rect width={BW} height={BH} fill="url(#sky)"/>
        <circle cx={330} cy={260} r={520} fill="url(#sun)"/>
        {/* window light shafts */}
        <path d="M0,0 L520,0 L1500,1100 L560,1100Z" fill="url(#beam)" opacity={0.6}/>
        <path d="M620,0 L900,0 L1900,1100 L1500,1100Z" fill="url(#beam)" opacity={0.35}/>

        {/* far haze clouds */}
        <g opacity={0.55} filter="url(#soft2)"><Cloud id="hz1" x={900} y={250} s={1.5}/><Cloud id="hz2" x={1700} y={170} s={1.1}/></g>
        {/* far ridges: paler and bluer far away */}
        <circle cx={330} cy={250} r={86} fill="#ffe7a0" opacity={1}/><circle cx={330} cy={250} r={86} fill="none" stroke="#f0c56a" strokeWidth={3}/>
        <path d={ridge(640, 90, 5)} fill="#b7d2d6" stroke="#8fb4bb" strokeWidth={3}/>
        <path d={ridge(700, 100, 9)} fill="#9fc4c0" stroke="#7aa9a6" strokeWidth={3}/>
        <path d={ridge(760, 120, 14)} fill="#86b08f" stroke="#5f8c6c" strokeWidth={3}/>
        <path d={ridge(820, 100, 21)} fill="#6f9a63" stroke="#4f7a47" strokeWidth={3}/>
        {Array.from({length: 46}, (_, i) => { const R = rng(100 + i); const x = R() * BW, y = 800 + R() * 56, r = 16 + R() * 18; return (
          <g key={i}><rect x={x - 3} y={y} width={6} height={r * 0.9} fill="#5a4630"/><circle cx={x} cy={y} r={r} fill={i % 3 ? "#5c8a55" : "#7da661"} stroke="#3f6a40" strokeWidth={2.5}/><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.5} fill="#a9c97c" opacity={0.55}/></g>); })}
        {Array.from({length: 26}, (_, i) => { const R = rng(300 + i); const x = 1900 + R() * 560, y = 430 + R() * 380; return <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 70} stroke="#5a97b0" strokeWidth={4} strokeLinecap="round" opacity={0.55}/>; })}
        {[[760, 330, 1], [840, 380, 0.7], [1010, 300, 0.8]].map(([x, y, k], i) => <path key={i} d={`M${x - 28 * k},${y} Q${x - 14 * k},${y - 22 * k} ${x},${y} Q${x + 14 * k},${y - 22 * k} ${x + 28 * k},${y}`} fill="none" stroke="#3b2f2c" strokeWidth={4} strokeLinecap="round" opacity={0.7}/>)}
        {/* monsoon cloud, top right, raining on the ridges */}
        <Cloud id="mc" x={2150} y={300} s={2.5} rain/>
        <Cloud id="mc2" x={1850} y={420} s={1.2}/>
        <Cloud id="mc3" x={430} y={380} s={1.2}/>

        {/* desk */}
        <rect x={0} y={860} width={BW} height={BH - 860} fill="url(#desk)"/>
        <rect x={0} y={856} width={BW} height={10} fill="#efd3a2"/>
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M0,${900 + i * 62} C700,${890 + i * 62} 1700,${916 + i * 62} ${BW},${900 + i * 62}`} stroke="#8a6234" strokeWidth={2} opacity={0.22} fill="none"/>)}

        {/* open atlas, left, bleeding off the edge */}
        <g transform="translate(-170,880) rotate(-4)">
          <ellipse cx={560} cy={590} rx={640} ry={46} fill="#3a2412" opacity={0.3} filter="url(#soft2)"/>
          <rect x={-14} y={22} width={1000} height={560} rx={14} fill={C.tealD} stroke="#0c2a30" strokeWidth={5}/>
          <g transform="translate(10,10)">
            <rect width={470} height={560} rx={6} fill="#fffaf0" stroke="#b08a52" strokeWidth={3}/>
            <g clipPath="url(#pg1)"><Relief id="rA" x={28} y={34} w={414} h={492} seed={4} detail={1.6}/></g>
            <rect x={28} y={34} width={414} height={492} fill="none" stroke="#b08a52" strokeWidth={2}/>
          </g>
          <g transform="translate(490,10)">
            <rect width={470} height={560} rx={6} fill="#fffaf0" stroke="#b08a52" strokeWidth={3}/>
            <g clipPath="url(#pg2)"><Relief id="rB" x={28} y={34} w={414} h={492} seed={12} detail={1.6}/></g>
            <rect x={28} y={34} width={414} height={492} fill="none" stroke="#b08a52" strokeWidth={2}/>
          </g>
          <rect x={480} y={10} width={20} height={560} fill="#3a2412" opacity={0.25}/>
        </g>

        {/* notebook + pencil, right */}
        <g transform="translate(2020,900) rotate(5)">
          <ellipse cx={230} cy={560} rx={290} ry={40} fill="#3a2412" opacity={0.3} filter="url(#soft2)"/>
          <rect x={-10} y={10} width={460} height={560} rx={14} fill={C.brickD} stroke="#5e1c10" strokeWidth={5}/>
          <rect x={6} y={4} width={420} height={540} rx={8} fill="#fffaf0" stroke="#b08a52" strokeWidth={3}/>
          {Array.from({length: 11}, (_, i) => <line key={i} x1={36} y1={70 + i * 42} x2={400} y2={70 + i * 42} stroke={C.tealL} strokeWidth={4} opacity={0.7}/>)}
          <line x1={78} y1={20} x2={78} y2={530} stroke={C.brick} strokeWidth={3} opacity={0.55}/>
        </g>
        <Pencil x={2010} y={1260} rot={-24} len={420} th={44}/>

        {/* desk objects, below the card */}
        <g transform="translate(1000,1180)">
          <ellipse cx={0} cy={120} rx={120} ry={24} fill="#3a2412" opacity={0.3} filter="url(#soft2)"/>
          <path d="M-70,0 L70,0 L56,110 Q0,128 -56,110Z" fill="#f4ead3" stroke={C.brick} strokeWidth={5}/>
          <path d="M-66,34 L66,34" stroke={C.brick} strokeWidth={5}/><path d="M-62,70 L62,70" stroke={C.brick} strokeWidth={5}/>
          <path d="M70,24 C120,20 120,84 62,84" fill="none" stroke={C.brick} strokeWidth={9} strokeLinecap="round"/>
          <ellipse cx={0} cy={0} rx={70} ry={14} fill="#8a4a2a" stroke={C.brickD} strokeWidth={4}/>
          <path d="M-20,-20 C-40,-60 0,-80 -16,-120 M20,-20 C0,-60 40,-80 24,-120" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6}/>
        </g>
        <g transform="translate(1500,1300) scale(0.5)"><circle cx={400} cy={400} r={400} fill="#3a2412" opacity={0.28} transform="translate(0,40) scale(1,0.96)" filter="url(#soft2)"/><circle cx={400} cy={400} r={390} fill="#f6e7c0" stroke={C.teal} strokeWidth={14}/><Logo2Art id="cm" mono={false}/></g>
        <g transform="translate(1260,1262) rotate(-8)"><rect width={150} height={150} rx={6} fill="#ffe08a" stroke="#c99a30" strokeWidth={3}/><path d="M24,48 L126,48 M24,80 L112,80 M24,112 L96,112" stroke="#8a6a1a" strokeWidth={5} strokeLinecap="round"/></g>
        <g transform="translate(1780,1130)"><path d="M0,0 L120,0 L106,150 L14,150Z" fill="#c9895a" stroke="#8a5430" strokeWidth={4}/>{[[30,-70,-12,C.brick],[60,-100,0,C.teal],[90,-80,10,C.ochre],[48,-60,-4,C.green]].map(([x,y,r,c],i)=>(<rect key={i} x={(x as number)-6} y={(y as number)} width={12} height={90} rx={4} fill={c as string} transform={`rotate(${r} ${x} ${y+90})`}/>))}</g>

        {/* paper card behind the safe area */}
        <g>
          <rect x={sx - 70} y={sy - 44 + 28} width={SAFE.w + 140} height={SAFE.h + 88} rx={34} fill="#3a2412" opacity={0.35} filter="url(#soft)"/>
          <rect x={sx - 70} y={sy - 44} width={SAFE.w + 140} height={SAFE.h + 88} rx={34} fill="url(#card)" stroke="#c9a15f" strokeWidth={3}/>
          <rect x={sx - 52} y={sy - 26} width={SAFE.w + 104} height={SAFE.h + 52} rx={24} fill="none" stroke={C.tealL} strokeWidth={2} opacity={0.6}/>
        </g>

        {/* key art, inside the safe area */}
        <g transform={`translate(${sx + 2},${sy + 6}) scale(0.42)`}>
          <defs><clipPath id="disc"><circle cx={400} cy={400} r={372}/></clipPath><radialGradient id="dbg" cx="38%" cy="30%" r="85%"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#f0dcb2"/></radialGradient></defs>
          <circle cx={400} cy={400} r={380} fill="#3a2412" opacity={0.18} transform="translate(8,14)" filter="url(#soft2)"/>
          <circle cx={400} cy={400} r={372} fill="url(#dbg)"/>
          <circle cx={400} cy={400} r={372} fill="none" stroke={C.teal} strokeWidth={10}/>
          <circle cx={400} cy={400} r={354} fill="none" stroke={C.brick} strokeWidth={3} opacity={0.7}/>
          <g transform="translate(400,420) scale(0.92) translate(-400,-420)"><Logo1Art id="bn"/></g>
        </g>
      </svg>

      {/* text, inside the safe area */}
      <div style={{position: "absolute", left: sx + 390, top: sy + 34, width: SAFE.w - 390, height: SAFE.h - 16}}>
        <div style={{display: "flex", alignItems: "baseline", gap: 20, lineHeight: 1, marginTop: 0, whiteSpace: "nowrap"}}>
          <span style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 66, color: C.brick}}>The</span>
          <span style={{fontFamily: SERIF, fontWeight: 700, fontSize: 152, color: "#154853", letterSpacing: -3, textShadow: "0 3px 0 rgba(255,255,255,.7)"}}>UPSC Mains</span>
        </div>
        <div style={{height: 5, width: 240, background: C.brick, borderRadius: 3, marginTop: 14}}/>
        <div id="tag" style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 42, color: "#2c2a26", marginTop: 20, whiteSpace: "nowrap"}}>
          As simple as a child can follow, as deep as the exam demands.
        </div>
      </div>
      <div style={{position: "absolute", left: sx + 28, top: sy + SAFE.h - 50, width: SAFE.w - 56, display: "flex", justifyContent: "center", borderTop: "2px solid rgba(29,92,99,.35)", paddingTop: 12}}>
        <span id="foot" style={{fontFamily: SANS, fontWeight: 600, fontSize: 25, letterSpacing: "0.05em", color: "#4a3a2c", whiteSpace: "nowrap"}}>
          Polity · History · Geography · Economics · Agriculture · Independent, not affiliated with UPSC
        </span>
      </div>

      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(1.33333)", transformOrigin: "0 0"}}><PaperFinish id="bf" grain={0.45} vignette={0.3}/></div>
    </AbsoluteFill></Fonts>
  );
};
