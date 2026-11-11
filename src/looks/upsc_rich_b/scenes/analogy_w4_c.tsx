// POL-03 Part 2, builder W4: `emergency-door` (s015), `stadium-wage` (s016), `mine-school` (s017).
import React from "react";
import {SANS, SERIF, W, H, eo, eio} from "../kit";
import {prog, Cloud, Hills, Person, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {A, bez, keyed, Glow, mixN, type KL} from "./analogy_w4_kit";

const none: KL = {text: "", at: 1e9};

// ---------------------------------------------------------------- emergency-door ----------------------------------------------------------
const SmallDoor: React.FC<{x: number; n: string; a: number; f: number}> = ({x, n, a, f}) => {
  const open = eio(a), pulse = 0.7 + 0.3 * Math.sin(f / 14 + x);
  return (
    <g>
      <rect x={x - 66} y={470} width={132} height={250} rx={4} fill="#4a3a2a" stroke="#2a1c10" strokeWidth={3}/>
      <path d={`M${x - 56},720 V520 a56,56 0 0 1 112,0 V720 Z`} fill="#2a1c10"/>
      <Glow x={x} y={640} r={160 * open} c="255,214,120" a={0.9 * pulse}/>
      <path d={`M${x - 56},720 V520 a56,56 0 0 1 112,0 V720 Z`} fill="#ffe9a8" opacity={open * 0.88}/>
      <path d={`M${x - 56},720 L${x - 56 - 40 * open},740 V500 L${x - 56},520 Z`} fill="#8a5a30" stroke="#3f2814" strokeWidth={2} opacity={0.95}/>
      <path d={`M${x + 56},720 L${x + 56 + 40 * open},740 V500 L${x + 56},520 Z`} fill="#6a4426" stroke="#3f2814" strokeWidth={2} opacity={0.95}/>
      <g opacity={a} transform={`translate(${x} 440)`}>
        <rect x={-46} y={-30} width={92} height={56} rx={8} fill="#2a2f55" stroke="#f0c660" strokeWidth={3}/>
        <text x={0} y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={42} fill="#ffe7a8">{n}</text>
      </g>
    </g>
  );
};

export const EmergencyDoorArt: React.FC<AP> = (p) => {
  const {f} = p, K = keyed(p), c = (k: string) => K[k] ?? none, id = "w4e";
  const em = c("em").at, bar = eio(prog(f, em, 26)), ns = A(f, c("ns").at, 24), adm = A(f, c("adm").at, 20);
  const shake = Math.sin(f * 1.3) * (1 - bar) * 3 * (prog(f, em, 26) > 0 && prog(f, em, 26) < 1 ? 1 : 0);
  const pcols = [480, 600, 1320, 1440];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5b6a8c"/><stop offset="0.55" stopColor="#c9a58a"/><stop offset="1" stopColor="#f0c78a"/></linearGradient>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e8dcc0"/><stop offset="0.6" stopColor="#d2c29e"/><stop offset="1" stopColor="#a89a78"/></linearGradient>
        <linearGradient id={`${id}-col`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f4ead0"/><stop offset="0.5" stopColor="#e2d4b0"/><stop offset="1" stopColor="#a89874"/></linearGradient>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d84a2a"/><stop offset="1" stopColor="#8c2214"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-sky)`}/>
      <Glow x={960} y={720} r={760} c="255,200,120" a={0.6}/>
      {[0, 1, 2, 3].map((i) => <Cloud key={i} x={-100 + i * 560} y={150 + (i % 2) * 70} s={1.1} f={f} speed={0.16} seed={i + 11} a={0.5}/>)}
      <Hills id={`${id}-h`} base={780} amp={70} top="#8a8fb0" bottom="#b9a98e" seed={2.1}/>
      {/* ground and steps */}
      <rect x={-60} y={800} width={W + 120} height={H} fill="#b7a07a"/>
      <rect x={330} y={742} width={1260} height={30} fill="#d8c8a2" stroke="#8a7a58" strokeWidth={2}/>
      <rect x={300} y={772} width={1320} height={30} fill="#cdbb94" stroke="#8a7a58" strokeWidth={2}/>
      <rect x={270} y={802} width={1380} height={32} fill="#c2af88" stroke="#8a7a58" strokeWidth={2}/>
      {/* facade */}
      <rect x={380} y={300} width={1160} height={442} fill={`url(#${id}-wall)`} stroke="#8a7a58" strokeWidth={3} style={{filter: "drop-shadow(0 18px 18px rgba(40,22,8,.35))"}}/>
      {Array.from({length: 8}).map((_, i) => <path key={i} d={`M380,${340 + i * 52} H1540`} stroke="#a89a78" strokeWidth={1.6} opacity={0.45}/>)}
      {/* plain pediment */}
      <path d="M350,300 L960,168 L1570,300 Z" fill="#e6d8b4" stroke="#8a7a58" strokeWidth={3}/>
      <path d="M420,288 L960,186 L1500,288 Z" fill="#d6c6a0" opacity={0.75}/>
      <rect x={350} y={300} width={1220} height={34} fill="#d8c8a2" stroke="#8a7a58" strokeWidth={3}/>
      {/* columns */}
      {pcols.map((x) => (
        <g key={x}>
          <rect x={x - 38} y={334} width={76} height={408} fill={`url(#${id}-col)`} stroke="#8a7a58" strokeWidth={2}/>
          {[-18, 0, 18].map((d) => <path key={d} d={`M${x + d},340 V736`} stroke="#8a7a58" strokeWidth={1.4} opacity={0.35}/>)}
          <rect x={x - 48} y={326} width={96} height={20} fill="#e6d8b4" stroke="#8a7a58" strokeWidth={2}/><rect x={x - 48} y={730} width={96} height={16} fill="#e6d8b4" stroke="#8a7a58" strokeWidth={2}/>
        </g>
      ))}
      {/* the big door, half shut: two leaves with light in the gap */}
      <g>
        <rect x={810} y={362} width={300} height={380} rx={4} fill="#2a1c10" stroke="#3f2814" strokeWidth={4}/>
        <path d="M820,742 V420 a140,140 0 0 1 280,0 V742 Z" fill="#ffe0a0"/>
        <Glow x={960} y={600} r={220} c="255,214,120" a={0.7}/>
        <path d="M820,742 L880,730 V400 L820,420 Z" fill="#8a5a30" stroke="#3f2814" strokeWidth={2}/>
        <path d="M1100,742 L1040,730 V400 L1100,420 Z" fill="#6a4426" stroke="#3f2814" strokeWidth={2}/>
        <path d="M880,730 L938,742 V404 L880,400 Z" fill="#7a4e2a" stroke="#3f2814" strokeWidth={2}/>
        <path d="M1040,730 L982,742 V404 L1040,400 Z" fill="#5a3a20" stroke="#3f2814" strokeWidth={2}/>
        {[0, 1, 2].map((i) => <path key={i} d={`M886,${470 + i * 84} H934 M986,${470 + i * 84} H1034`} stroke="#2a1c10" strokeWidth={2} opacity={0.6}/>)}
      </g>
      {/* the EMERGENCY bar drops across both leaves */}
      <g opacity={bar > 0.002 ? 1 : 0} transform={`translate(${shake} ${-(1 - bar) * 260})`}>
        <g transform="rotate(-4 960 546)" style={{filter: "drop-shadow(0 10px 8px rgba(30,10,4,.55))"}}>
          <rect x={770} y={520} width={380} height={58} rx={8} fill={`url(#${id}-bar)`} stroke="#4a0e06" strokeWidth={3}/>
          <rect x={774} y={524} width={372} height={14} rx={6} fill="#ff9a7a" opacity={0.4}/>
          {[782, 1138].map((x) => <circle key={x} cx={x} cy={549} r={6} fill="#3a0a04"/>)}
          <text x={960} y={563} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} letterSpacing="0.2em" fill="#fff0e0">EMERGENCY</text>
          <rect x={758} y={500} width={30} height={100} rx={4} fill="#3a3a44" stroke="#14141a" strokeWidth={2}/><rect x={1132} y={500} width={30} height={100} rx={4} fill="#3a3a44" stroke="#14141a" strokeWidth={2}/>
        </g>
      </g>
      {/* the two small doors that stay open */}
      <SmallDoor x={710} n="20" a={ns} f={f}/>
      <SmallDoor x={1210} n="21" a={ns} f={f}/>
      {/* old ruling, overruled: a closed dusty book with a bar, only at its key */}
      {adm > 0.002 && (
        <g opacity={adm} transform={`translate(1710 700) rotate(-6) scale(${0.8 + 0.2 * adm})`} style={{filter: "drop-shadow(0 10px 8px rgba(30,16,4,.4))"}}>
          <rect x={-60} y={-80} width={120} height={160} rx={6} fill="#6a3a2a" stroke="#2a1008" strokeWidth={3}/><rect x={-46} y={-62} width={92} height={36} rx={3} fill="#e8d8b0"/>
          <path d="M-36,-48 H36 M-36,-38 H20" stroke="#6a5a40" strokeWidth={3}/>
          <path d="M-96,-6 L96,-6" stroke="#b3281a" strokeWidth={14} strokeLinecap="round" transform="rotate(-24)" opacity={0.92}/>
        </g>
      )}
    </g>
  );
};
export const EmergencyDoorLabels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={500} y={60} text={c("em").text} f={p.f} at={c("em").at} size={38} maxW={600} tone="warm"/>
      <P2Card cx={1390} y={134} text={c("ns").text} f={p.f} at={c("ns").at} size={32} maxW={560} upper={false} tone="green"/>
      <P2Card cx={960} y={832} text={c("adm").text} f={p.f} at={c("adm").at} size={32} maxW={1400} upper={false} tone="cool"/>
    </>
  );
};

// ---------------------------------------------------------------- stadium-wage ------------------------------------------------------------
const Crane: React.FC<{x: number; f: number}> = ({x, f}) => {
  const sw = Math.sin(f / 60) * 40, load = 280 + Math.sin(f / 40) * 30;
  return (
    <g transform={`translate(${x} 700)`}>
      <path d="M-14,0 V-420 M14,0 V-420" stroke="#d8902a" strokeWidth={6}/>
      {Array.from({length: 14}).map((_, i) => <path key={i} d={i % 2 ? `M-14,${-i * 30} L14,${-(i + 1) * 30}` : `M14,${-i * 30} L-14,${-(i + 1) * 30}`} stroke="#d8902a" strokeWidth={3}/>)}
      <g transform="translate(0 -420)">
        <path d="M-230,0 H260" stroke="#d8902a" strokeWidth={8}/><path d="M-230,0 L0,-50 L260,0 M0,-50 V0" stroke="#d8902a" strokeWidth={4} fill="none"/>
        <rect x={190} y={-4} width={50} height={26} fill="#555" stroke="#2a2a30" strokeWidth={2}/>
        <path d={`M${-120 + sw},0 V${load}`} stroke="#3a3a40" strokeWidth={3}/>
        <g transform={`translate(${-120 + sw} ${load})`}><rect x={-44} y={0} width={88} height={34} fill="#9a9a96" stroke="#3a3a40" strokeWidth={2.4}/><path d="M-44,10 H44 M-44,22 H44" stroke="#5a5a56" strokeWidth={2}/></g>
      </g>
    </g>
  );
};

export const StadiumWageArt: React.FC<AP> = (p) => {
  const {f, dur} = p, K = keyed(p), c = (k: string) => K[k] ?? none, id = "w4s";
  const pu = c("pu").at, pc = c("pc").at;
  const slip = A(f, pu, 20), line = eio(prog(f, pu + 14, 30)), notice = eio(prog(f, pc, 60));
  const crowd = [0, 1, 2, 3, 4, 5];
  const q = (t: number, a: [number, number], b: [number, number], c2: [number, number]) => bez(a, b, c2, t);
  const n1 = q(notice, [1560, 380], [1560, 480], [1460, 560]), n2 = q(notice, [1560, 380], [1700, 480], [1720, 540]);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9b878"/><stop offset="0.6" stopColor="#f5d6a2"/><stop offset="1" stopColor="#f7e6c0"/></linearGradient>
        <linearGradient id={`${id}-conc`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d8cfbe"/><stop offset="1" stopColor="#a99e8a"/></linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8a070"/><stop offset="1" stopColor="#8a6238"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-sky)`}/>
      <Glow x={1500} y={260} r={420} c="255,214,140" a={0.8}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={60 + i * 700} y={190 + (i % 2) * 80} s={1} f={f} speed={0.12} seed={i + 20} a={0.45}/>)}
      <Hills id={`${id}-h1`} base={650} amp={50} top="#d6b88e" bottom="#d8c09a" seed={2.4}/>
      {/* the stadium bowl, left half poured, right half still rebar and scaffold */}
      <g>
        <ellipse cx={960} cy={650} rx={470} ry={46} fill="#2a1808" opacity={0.2}/>
        <path d="M500,640 L560,380 Q960,330 1360,380 L1420,640 Z" fill={`url(#${id}-conc)`} stroke="#7a6c54" strokeWidth={3}/>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${518 + i * 14},${620 - i * 62} Q960,${582 - i * 62} ${1402 - i * 14},${620 - i * 62}`} stroke="#8a7e66" strokeWidth={2.4} fill="none" opacity={0.55}/>)}
        {/* unfinished right part: scaffold */}
        <path d="M960,330 Q1180,340 1360,380 L1420,640 H960 Z" fill="#f7e6c0" opacity={0.92}/>
        {Array.from({length: 11}).map((_, i) => { const x = 980 + i * 40; return <path key={i} d={`M${x},640 V${430 - (i * 4)}`} stroke="#6a5a3a" strokeWidth={3}/>; })}
        {[470, 520, 570, 620].map((y) => <path key={y} d={`M960,${y} H1410`} stroke="#6a5a3a" strokeWidth={3}/>)}
        {Array.from({length: 10}).map((_, i) => <path key={i} d={`M${980 + i * 40},${i % 2 ? 470 : 520} l40,${i % 2 ? 50 : -50}`} stroke="#8a7a58" strokeWidth={2} opacity={0.7}/>)}
        <path d="M960,330 V640" stroke="#7a6c54" strokeWidth={3} strokeDasharray="8 6"/>
        {/* arches in the finished part */}
        {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${540 + i * 60},640 v-60 a16,16 0 0 1 32,0 v60 Z`} fill="#8a7e66" opacity={0.55}/>)}
      </g>
      <Crane x={1480} f={f}/>
      {/* ground, bricks */}
      <rect x={-60} y={700} width={W + 120} height={H} fill={`url(#${id}-ground)`}/>
      <path d="M-60,700 Q480,690 960,702 T2000,698" stroke="#e6c898" strokeWidth={5} fill="none" opacity={0.7}/>
      {Array.from({length: 5}).map((_, i) => <g key={i} transform={`translate(${170 + i * 22} ${718 - i * 3})`}><rect width={60} height={22} fill="#b5502c" stroke="#6a2a14" strokeWidth={1.6}/></g>)}
      {/* workers carrying loads, generic, walking along the base */}
      {crowd.map((i) => { const x = ((i * 140 + f * 0.9) % 800) + 500; return <Person key={i} x={x} y={690 + (i % 2) * 22} h={106 + (i % 3) * 6} f={f} seed={40 + i} walk ph={i * 7}/>; })}
      {/* wage slip against the minimum line */}
      <g opacity={slip} transform={`translate(0 ${(1 - slip) * 30})`}>
        <g transform="translate(110 330) rotate(-3)" style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.36))"}}>
          <rect width={340} height={270} rx={6} fill="#fffdf2" stroke="#c9b98f" strokeWidth={2}/>
          <text x={170} y={42} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={28} letterSpacing="0.12em" fill="#3a2a14">WAGE SLIP</text>
          <path d="M26,58 H314" stroke="#3a2a14" strokeWidth={1.8}/>
          {[0, 1].map((i) => <path key={i} d={`M30,${84 + i * 20} H${i ? 210 : 280}`} stroke="#8b7d62" strokeWidth={3} strokeLinecap="round" opacity={0.6}/>)}
          {/* bar and the minimum line */}
          <rect x={30} y={146} width={280} height={30} rx={6} fill="#efe5c8" stroke="#c9b98f" strokeWidth={1.5}/>
          <rect x={30} y={146} width={100 * line + 6} height={30} rx={6} fill="#d8682a"/>
          <path d="M240,130 V196" stroke="#2f9a4a" strokeWidth={5} strokeDasharray="8 5"/>
          <text x={240} y={222} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.12em" fill="#2f7a3a">MINIMUM</text>
          <text x={80} y={222} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.12em" fill="#b4501c">PAID</text>
          <path d="M138,162 H236" stroke="#b3281a" strokeWidth={4} strokeLinecap="round" strokeDasharray="4 8" opacity={line}/>
        </g>
      </g>
      {/* two offices receiving the same notice */}
      <g opacity={A(f, pc - 20, 24)}>
        <g transform="translate(1330 640)">
          <path d="M-20,0 V-90 L120,-130 L260,-90 V0 Z" fill="#b8a888" stroke="#6a5a3a" strokeWidth={2.4}/>
          <path d="M-30,-86 L120,-134 L270,-86" stroke="#7a6a4a" strokeWidth={6} fill="none"/>
          <rect x={40} y={-70} width={50} height={70} fill="#6a4a2a"/><rect x={120} y={-70} width={50} height={36} fill="#9fc4e0" stroke="#4a6a8a" strokeWidth={2}/><rect x={190} y={-70} width={50} height={36} fill="#9fc4e0" stroke="#4a6a8a" strokeWidth={2}/>
          <rect x={30} y={-122} width={180} height={30} rx={4} fill="#3a2a14"/><text x={120} y={-101} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.14em" fill="#f6e8c6">CONTRACTOR</text>
        </g>
        <g transform="translate(1620 640)">
          <rect x={0} y={-150} width={210} height={150} fill="#e8dcc0" stroke="#8a7a58" strokeWidth={2.4}/>
          <path d="M-10,-150 H220 L105,-200 Z" fill="#d6c6a0" stroke="#8a7a58" strokeWidth={2.4}/>
          {[24, 76, 128, 168].map((x) => <rect key={x} x={x} y={-130} width={22} height={90} fill="#c9b98f" stroke="#8a7a58" strokeWidth={1.5}/>)}
          <rect x={80} y={-60} width={50} height={60} fill="#6a4a2a"/>
          <rect x={30} y={-186} width={150} height={26} rx={4} fill="#2a2f55"/><text x={105} y={-168} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={16} letterSpacing="0.14em" fill="#ffe7a8">GOVERNMENT</text>
        </g>
        {/* the court's notice, one copy to each */}
        {notice > 0.01 && notice < 0.999 && [n1, n2].map((pt, i) => <g key={i} transform={`translate(${pt[0]} ${pt[1]}) rotate(${(i ? 18 : -18) * (1 - notice)})`}><rect x={-28} y={-20} width={56} height={40} rx={3} fill="#fffdf2" stroke="#c9b98f" strokeWidth={2} style={{filter: "drop-shadow(0 6px 5px rgba(40,22,8,.35))"}}/><path d="M-18,-8 H18 M-18,2 H8" stroke="#8b7d62" strokeWidth={3}/><rect x={10} y={4} width={12} height={10} rx={2} fill="#b3281a" opacity={0.8}/></g>)}
        {notice >= 0.999 && [[1460, 560], [1720, 540]].map((pt, i) => <g key={i} transform={`translate(${pt[0]} ${pt[1] - 4})`}><rect x={-28} y={-20} width={56} height={40} rx={3} fill="#fffdf2" stroke="#c9b98f" strokeWidth={2}/><path d="M-18,-8 H18 M-18,2 H8" stroke="#8b7d62" strokeWidth={3}/><rect x={10} y={4} width={12} height={10} rx={2} fill="#b3281a" opacity={0.8}/></g>)}
        {/* the court: a scroll above */}
        <g transform="translate(1560 360)" opacity={A(f, pc - 10, 18)}>
          <circle r={52} fill="#fffaf0" stroke="#c9a46a" strokeWidth={3}/>
          <path d="M0,-30 V26 M-14,28 H14 M-32,-18 H32" stroke="#5a3a1a" strokeWidth={4} strokeLinecap="round"/>
          <path d="M-32,-18 L-42,6 H-22 Z M32,-18 L22,6 H42 Z" fill="#c79a3c" stroke="#5a3a1a" strokeWidth={3} strokeLinejoin="round"/>
        </g>
      </g>
      {/* 1982 warm haze */}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="rgba(220,150,70,0.12)"/>
    </g>
  );
};
export const StadiumWageLabels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={620} y={60} text={c("a23").text} f={p.f} at={c("a23").at} size={40} maxW={1040} upper={false}/>
      <P2Card cx={620} y={176} text={c("ag").text} f={p.f} at={c("ag").at} size={30} maxW={600} upper={false} tone="cool"/>
      <P2Card cx={380} y={690} text={c("pu").text} f={p.f} at={c("pu").at} size={30} maxW={540} upper={false}/>
      <P2Card cx={1560} y={700} text={c("pc").text} f={p.f} at={c("pc").at} size={32} maxW={480} upper={false} tone="green"/>
    </>
  );
};

// ---------------------------------------------------------------- mine-school -------------------------------------------------------------
const Pick: React.FC<{x: number; y: number; r: number; s?: number}> = ({x, y, r, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-6} y={-120} width={12} height={240} rx={5} fill="#8a5a30" stroke="#3f2814" strokeWidth={2}/>
    <path d="M-80,-118 Q0,-160 80,-118 Q0,-136 -80,-118 Z" fill="#7a7a84" stroke="#2a2a30" strokeWidth={2.4}/>
    <path d="M-80,-118 L-96,-110 M80,-118 L96,-110" stroke="#2a2a30" strokeWidth={3} strokeLinecap="round"/>
  </g>
);
const Bag: React.FC<{x: number; y: number; s?: number; r?: number}> = ({x, y, s = 1, r = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} style={{filter: "drop-shadow(0 10px 8px rgba(30,16,4,.4))"}}>
    <path d="M-52,-20 Q-52,-110 0,-110 Q52,-110 52,-20 V50 Q52,64 38,64 H-38 Q-52,64 -52,50 Z" fill="#d83a3a" stroke="#6a1414" strokeWidth={3}/>
    <path d="M-52,-20 Q-52,-110 0,-110 Q52,-110 52,-20 Q0,-50 -52,-20 Z" fill="#ff7a6a" opacity={0.5}/>
    <rect x={-36} y={0} width={72} height={46} rx={8} fill="#b02a2a" stroke="#6a1414" strokeWidth={2.4}/><path d="M-26,18 H26" stroke="#f0c660" strokeWidth={4} strokeLinecap="round"/>
    <path d="M-24,-108 Q0,-134 24,-108" fill="none" stroke="#6a1414" strokeWidth={6} strokeLinecap="round"/>
    <rect x={-30} y={-92} width={60} height={30} rx={6} fill="#f6e8c6" stroke="#8a6a38" strokeWidth={2}/><path d="M-20,-80 H20 M-20,-72 H10" stroke="#8a6a38" strokeWidth={3}/>
    <path d="M52,10 L84,-20 L96,-6 L58,34 Z" fill="#2f78b8" stroke="#173a5c" strokeWidth={2} opacity={0.0}/>
  </g>
);
const Bucket: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={4} rx={64} ry={10} fill="#2a1808" opacity={0.3}/>
    <path d="M-50,-90 H50 L40,0 H-40 Z" fill="#7a7a84" stroke="#2a2a30" strokeWidth={3}/>
    <path d="M-50,-90 H50 L48,-72 H-48 Z" fill="#a8a8b0" stroke="#2a2a30" strokeWidth={2}/>
    <path d="M-48,-90 Q0,-150 48,-90" fill="none" stroke="#2a2a30" strokeWidth={4}/>
  </g>
);
const Machine: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
  <g transform={`translate(${x} ${y})`} style={{filter: "drop-shadow(0 12px 10px rgba(30,16,4,.4))"}}>
    <ellipse cx={0} cy={6} rx={190} ry={14} fill="#2a1808" opacity={0.3}/>
    <rect x={-170} y={-110} width={250} height={100} rx={46} fill="#e8e4da" stroke="#5a5e68" strokeWidth={3}/>
    <rect x={-166} y={-106} width={242} height={30} rx={14} fill="#fff" opacity={0.5}/>
    <path d="M-120,-110 V-10 M-60,-110 V-10 M0,-110 V-10" stroke="#9a9ea8" strokeWidth={2} opacity={0.5}/>
    <path d="M90,-96 H150 L172,-50 V-10 H90 Z" fill="#2f78b8" stroke="#173a5c" strokeWidth={3}/><path d="M104,-84 H142 L158,-54 H104 Z" fill="#cfe6fa" stroke="#173a5c" strokeWidth={2}/>
    <rect x={-170} y={-18} width={342} height={16} rx={4} fill="#3a3f4a"/>
    {[-112, 112].map((cx) => <g key={cx}><circle cx={cx} cy={-4} r={30} fill="#23262e" stroke="#0e1018" strokeWidth={3}/><circle cx={cx} cy={-4} r={12} fill="#9a9ea8"/></g>)}
    <path d="M-170,-60 Q-220,-60 -230,-10 Q-236,24 -270,28" fill="none" stroke="#3a3f4a" strokeWidth={14} strokeLinecap="round"/>
    <path d="M-170,-60 Q-220,-60 -230,-10 Q-236,24 -270,28" fill="none" stroke="#5a6070" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 24" strokeDashoffset={-f * 2}/>
    <rect x={-140} y={-130} width={110} height={18} rx={4} fill="#2f9a4a"/>
  </g>
);

export const MineSchoolArt: React.FC<AP> = (p) => {
  const {f, dur} = p, K = keyed(p), c = (k: string) => K[k] ?? none, id = "w4m";
  const a24 = Math.min(c("a24").at, dur - 120), ms = Math.min(c("ms").at, dur - 50);
  const sw = eio(prog(f, a24, 40)), bagDrop = eio(prog(f, a24 + 10, 34)), dd = 34, sw2 = eio(prog(f, ms, dd)), mdr = eio(prog(f, ms + 4, dd + 8));
  const bounce = Math.abs(Math.sin(prog(f, a24 + 40, 50) * Math.PI * 2)) * (1 - prog(f, a24 + 40, 50)) * 16;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb4e0"/><stop offset="1" stopColor="#f6e8c6"/></linearGradient>
        <linearGradient id={`${id}-rock`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a88a66"/><stop offset="1" stopColor="#6a523a"/></linearGradient>
        <clipPath id={`${id}-L`}><rect x={110} y={270} width={800} height={590} rx={24}/></clipPath>
        <clipPath id={`${id}-R`}><rect x={1010} y={270} width={800} height={590} rx={24}/></clipPath>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#e7d8b6"/>
      {/* left panel: a mine entrance */}
      <g clipPath={`url(#${id}-L)`}>
        <rect x={100} y={260} width={820} height={610} fill={`url(#${id}-sky)`}/>
        <Cloud x={170} y={340} s={0.7} f={f} speed={0.1} seed={31} a={0.8}/>
        <Hills id={`${id}-hl`} base={560} amp={60} top="#b4cbe0" bottom="#d4dfdf" seed={0.7}/>
        <path d="M100,860 V430 Q300,370 520,400 Q760,420 920,470 V860 Z" fill={`url(#${id}-rock)`} stroke="#4a3822" strokeWidth={3}/>
        {Array.from({length: 9}).map((_, i) => <path key={i} d={`M${130 + i * 90},${430 + (i % 3) * 40} q30,40 10,90 q-20,30 0,70`} stroke="#4a3822" strokeWidth={2.4} fill="none" opacity={0.35}/>)}
        <path d="M280,760 V560 a110,110 0 0 1 220,0 V760 Z" fill="#14100c"/>
        <path d="M262,770 V552 a128,128 0 0 1 256,0 V770 H494 V560 a104,104 0 0 0 -208,0 V770 Z" fill="#8a5a30" stroke="#3f2814" strokeWidth={3}/>
        <rect x={250} y={436} width={280} height={30} rx={4} fill="#8a5a30" stroke="#3f2814" strokeWidth={3} opacity={0}/>
        <rect x={100} y={760} width={820} height={110} fill="#8a6a42"/><path d="M100,764 H920" stroke="#c8a070" strokeWidth={5} opacity={0.7}/>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${330 + i * 70},770 L${300 + i * 120},850`} stroke="#4a3822" strokeWidth={5} opacity={0.6}/>)}
        <path d="M280,790 L180,860 M500,790 L640,860" stroke="#7a7a84" strokeWidth={6}/>
        {/* the pick leaves, the school bag arrives */}
        <g transform={`translate(${sw * -420} ${sw * 20})`} opacity={1 - sw}><Pick x={640} y={640} r={14 - sw * 40}/></g>
        {bagDrop > 0.002 && <g opacity={eo(prog(f, a24 + 10, 12))}><Bag x={640} y={mixN(240, 700, bagDrop) - bounce} s={1.25} r={(1 - bagDrop) * -24}/></g>}
        {sw > 0.5 && <Glow x={640} y={680} r={200 * sw} c="255,230,150" a={0.6 * (0.7 + 0.3 * Math.sin(f / 12))}/>}
      </g>
      <rect x={110} y={270} width={800} height={590} rx={24} fill="none" stroke="#fffaf0" strokeWidth={10}/>
      {/* right panel: a street drain */}
      <g clipPath={`url(#${id}-R)`}>
        <rect x={1000} y={260} width={820} height={610} fill={`url(#${id}-sky)`}/>
        <Cloud x={1100} y={330} s={0.7} f={f} speed={0.1} seed={37} a={0.8}/>
        <Hills id={`${id}-hr`} base={520} amp={50} top="#b4cbe0" bottom="#d4dfdf" seed={2.2}/>
        {/* town row */}
        {[[1030, 360, 150, 200, "#e0b88a"], [1200, 330, 130, 230, "#c0603d"], [1350, 380, 170, 180, "#9fc4e0"], [1540, 340, 140, 220, "#e8dcc4"], [1700, 370, 130, 190, "#d9b26a"]].map(([x, y, w, h, col], i) => (
          <g key={i}><rect x={x as number} y={y as number} width={w as number} height={h as number} fill={col as string} stroke="#6a5a3a" strokeWidth={2.4}/>{[0, 1].map((r) => [0, 1].map((cc) => <rect key={`${r}${cc}`} x={(x as number) + 22 + cc * ((w as number) / 2 - 8)} y={(y as number) + 28 + r * 56} width={26} height={34} fill="#f6e8c6" stroke="#6a5a3a" strokeWidth={1.6}/>))}</g>
        ))}
        <rect x={1000} y={560} width={820} height={310} fill="#b5a68a"/>
        <path d="M1000,640 H1820" stroke="#8a7a58" strokeWidth={3} opacity={0.6}/>
        {[1060, 1260, 1460, 1660].map((x) => <path key={x} d={`M${x},830 h90`} stroke="#fffaf0" strokeWidth={8} strokeLinecap="round" opacity={0.7}/>)}
        <g transform="translate(1100 580)"><rect x={-5} y={-190} width={10} height={190} fill="#4a4e58"/><path d="M-5,-190 q40,-4 56,24" stroke="#4a4e58" strokeWidth={8} fill="none"/><ellipse cx={52} cy={-160} rx={20} ry={8} fill="#ffe7a8" stroke="#4a4e58" strokeWidth={3}/></g>
        {/* manhole */}
        <ellipse cx={1330} cy={760} rx={96} ry={22} fill="#14100c" stroke="#4a4e58" strokeWidth={6}/><ellipse cx={1330} cy={756} rx={80} ry={16} fill="#050403"/>
        {/* the bucket leaves, the machine arrives */}
        <g transform={`translate(${sw2 * -420} 0)`} opacity={1 - sw2}><Bucket x={1530} y={770}/></g>
        <g transform={`translate(${(1 - mdr) * 560} 0)`} opacity={eo(prog(f, ms + 4, 10))}><Machine x={1530} y={780} f={f}/></g>
        {sw2 > 0.5 && <Glow x={1530} y={680} r={260 * sw2} c="255,230,150" a={0.4}/>}
      </g>
      <rect x={1010} y={270} width={800} height={590} rx={24} fill="none" stroke="#fffaf0" strokeWidth={10}/>
    </g>
  );
};
export const MineSchoolLabels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={510} y={64} text={c("a24").text} f={p.f} at={c("a24").at} size={36} maxW={760} upper={false}/>
      <P2Card cx={1400} y={130} text={c("ms").text} f={p.f} at={c("ms").at} size={32} maxW={780} upper={false} tone="cool"/>
    </>
  );
};
