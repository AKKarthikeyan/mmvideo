// POL-03 Part 2, builder W4: `police-desk` (s013) and `detention-calendar` (s014).
import React from "react";
import {SANS, SERIF, W, H, eo, eio} from "../kit";
import {prog, Person, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {A, keyed, Glow, Robed, Sheet, type KL} from "./analogy_w4_kit";

const none: KL = {text: "", at: 1e9};

// ---------------------------------------------------------------- police-desk (flat lay on the desk) --------------------------------------
const Sig: React.FC<{d: string; a: number; len?: number}> = ({d, a, len = 160}) => (
  <path d={d} fill="none" stroke="#1d3a8a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a}/>
);

export const PoliceDeskArt: React.FC<AP> = (p) => {
  const {f} = p, K = keyed(p), c = (k: string) => K[k] ?? none, id = "w4p";
  const dk = A(f, c("dk").at, 18), h24 = c("h24").at;
  const sweep = eio(prog(f, h24, 90)), ring = A(f, h24, 20);
  const sig1 = eio(prog(f, c("dk").at + 14, 34)), sig2 = eio(prog(f, c("dk").at + 40, 34)), stamp = A(f, c("dk").at + 70, 12);
  const call = c("dk").at + 40, callA = A(f, call, 16), wave = (f - call);
  const ang = -90 + 360 * sweep;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b98450"/><stop offset="1" stopColor="#8a5a30"/></linearGradient>
        <radialGradient id={`${id}-lamp`} cx="0.35" cy="0.3" r="0.9"><stop offset="0" stopColor="rgba(255,240,190,0.55)"/><stop offset="1" stopColor="rgba(255,240,190,0)"/></radialGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf2"/><stop offset="1" stopColor="#e6dcc0"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-wood)`}/>
      {Array.from({length: 14}).map((_, i) => <path key={i} d={`M-60,${i * 82 - 20} Q480,${i * 82 - 34 + (i % 3) * 10} 960,${i * 82 - 18} T${W + 60},${i * 82 - 24}`} stroke="#6a4020" strokeWidth={2} fill="none" opacity={0.35}/>)}
      <rect x={0} y={0} width={W} height={H} fill={`url(#${id}-lamp)`}/>
      {/* green blotter */}
      <rect x={380} y={236} width={640} height={690} rx={14} fill="#365a48" stroke="#22382c" strokeWidth={4} style={{filter: "drop-shadow(0 14px 14px rgba(30,16,4,.4))"}}/>
      <rect x={394} y={250} width={612} height={662} rx={8} fill="none" stroke="#6a9a80" strokeWidth={1.5} opacity={0.5}/>
      {/* clipboard + memo of arrest */}
      <g transform="translate(700 590) rotate(-2)" opacity={dk}>
        <rect x={-246} y={-290} width={492} height={600} rx={14} fill="#7a5230" stroke="#3f2814" strokeWidth={3} style={{filter: "drop-shadow(0 14px 12px rgba(30,16,4,.45))"}}/>
        <rect x={-70} y={-310} width={140} height={44} rx={10} fill="#b9bcc4" stroke="#5a5e68" strokeWidth={3}/>
        <Sheet x={-214} y={-252} w={428} h={540} title="MEMO OF ARREST" lines={7} tsize={30} id={`${id}-paper`}/>
        <g transform="translate(-170 90)">
          <text x={0} y={0} fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.14em" fill="#6a5a40">ARRESTED PERSON</text>
          <path d="M0,50 H170" stroke="#3a2a14" strokeWidth={2}/><Sig d="M6,40 q16,-34 28,-4 q10,22 24,-12 q10,-22 22,2 q10,16 30,-8 q10,-10 24,4" a={sig1}/>
          <text x={220} y={0} fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.14em" fill="#6a5a40">WITNESS</text>
          <path d="M220,50 H386" stroke="#3a2a14" strokeWidth={2}/><Sig d="M228,42 q18,-34 24,-2 q8,18 22,-14 q12,-18 22,6 q10,14 32,-12 q10,-8 22,6" a={sig2}/>
        </g>
        <g transform="translate(-170 214)">
          <text x={0} y={0} fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.14em" fill="#6a5a40">RELATIVE OR FRIEND TOLD</text>
          <g transform="translate(330 -6)" opacity={stamp}><rect x={-4} y={-30} width={78} height={44} rx={6} fill="none" stroke="#b3281a" strokeWidth={4}/><path d="M12,-8 l12,12 l30,-30" stroke="#b3281a" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>
        </g>
      </g>
      {/* pen */}
      <g transform="translate(1010 770) rotate(-62)" opacity={dk}><rect x={-6} y={-90} width={12} height={160} rx={6} fill="#1d3a8a" stroke="#0e1e4a" strokeWidth={2}/><path d="M-6,70 L6,70 L0,94 Z" fill="#c0c4cc"/><rect x={-6} y={-90} width={12} height={20} rx={6} fill="#d8b24a"/></g>
      {/* desk clock, 24-hour face, face-on */}
      <g transform="translate(1250 350)">
        <ellipse cx={8} cy={146} rx={150} ry={16} fill="#2a1808" opacity={0.28}/>
        <circle r={150} fill="#3a2a1c" stroke="#1a1008" strokeWidth={3} style={{filter: "drop-shadow(0 14px 12px rgba(30,16,4,.45))"}}/>
        <circle r={134} fill={`url(#${id}-face)`} stroke="#c9b98f" strokeWidth={3}/>
        {Array.from({length: 24}).map((_, i) => { const a = (i * 15 - 90) * Math.PI / 180, r1 = i % 6 === 0 ? 100 : 112; return <path key={i} d={`M${Math.cos(a) * r1},${Math.sin(a) * r1} L${Math.cos(a) * 124},${Math.sin(a) * 124}`} stroke="#3a2a14" strokeWidth={i % 6 === 0 ? 5 : 2.5} strokeLinecap="round"/>; })}
        {/* the full round is the 24 hours: a sector fills as the hand sweeps */}
        {sweep > 0.004 && <path d={`M0,0 L0,-110 A110,110 0 ${sweep > 0.5 ? 1 : 0} 1 ${Math.cos((ang) * Math.PI / 180) * 110},${Math.sin((ang) * Math.PI / 180) * 110} Z`} fill="#d8682a" opacity={0.28}/>}
        <g transform={`rotate(${ang + 90})`}><path d="M0,14 V-104" stroke="#b3281a" strokeWidth={6} strokeLinecap="round"/><circle r={9} fill="#b3281a"/></g>
        <circle r={4} fill="#fff"/>
        <circle r={150} fill="none" stroke="#d8682a" strokeWidth={6} opacity={ring * 0.8 * (0.6 + 0.4 * Math.sin(f / 10))} />
      </g>
      {/* desk phone with a handset and sound waves */}
      <g transform="translate(1170 760)" opacity={callA}>
        <ellipse cx={0} cy={50} rx={190} ry={16} fill="#2a1808" opacity={0.28}/>
        <path d="M-150,10 Q-150,-20 -110,-24 H110 Q150,-20 150,10 L130,50 H-130 Z" fill="#2a2f3a" stroke="#0e1018" strokeWidth={3}/>
        <path d="M-130,-18 H130" stroke="#5a6070" strokeWidth={3}/>
        {Array.from({length: 9}).map((_, i) => <circle key={i} cx={-24 + (i % 3) * 24} cy={-4 + Math.floor(i / 3) * 16} r={6} fill="#c9ccd4" opacity={0.9}/>)}
        <g transform="translate(0 -52) rotate(-4)"><path d="M-130,-8 Q-130,-30 -100,-30 H100 Q130,-30 130,-8 V6 H72 V-8 H-72 V6 H-130 Z" fill="#3a404e" stroke="#0e1018" strokeWidth={3}/><path d="M-120,-22 H120" stroke="#8a90a0" strokeWidth={3} opacity={0.6}/></g>
        <path d="M-150,16 q-60,40 -10,70 q60,30 0,-10" fill="none" stroke="#14161e" strokeWidth={5} strokeLinecap="round" opacity={0.8}/>
        {[0, 1, 2].map((i) => { const u = ((wave * 0.03 + i / 3) % 1 + 1) % 1; return <path key={i} d={`M${150 + u * 130},${-70 - u * 10} q${16 + u * 10},${40} 0,${80}`} fill="none" stroke="#d8682a" strokeWidth={5} strokeLinecap="round" opacity={(1 - u) * 0.9 * callA}/>; })}
      </g>
      {/* the relative at the other end of the line, in a round window */}
      <g opacity={A(f, call + 22, 18)} transform={`translate(1600 560) scale(${0.8 + 0.2 * A(f, call + 22, 18)})`}>
        <circle r={140} fill="#d6e6f0" stroke="#fffaf0" strokeWidth={8} style={{filter: "drop-shadow(0 14px 12px rgba(30,16,4,.4))"}}/>
        <clipPath id={`${id}-rel`}><circle r={134}/></clipPath>
        <g clipPath={`url(#${id}-rel)`}>
          <rect x={-140} y={-140} width={280} height={170} fill="#cfe2ee"/><rect x={-140} y={30} width={280} height={120} fill="#c4a070"/>
          <path d="M-140,30 H140" stroke="#8a6a3a" strokeWidth={3}/>
          <Person x={0} y={134} h={230} f={f} seed={7}/>
        </g>
        <path d="M-70,128 L-120,190 L-30,150" fill="#fffaf0" stroke="#fffaf0" strokeWidth={6} strokeLinejoin="round"/>
      </g>
    </g>
  );
};
export const PoliceDeskLabels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={620} y={60} text={c("a22").text} f={p.f} at={c("a22").at} size={46} maxW={600}/>
      <P2Card cx={1060} y={50} text={c("gr").text} f={p.f} at={c("gr").at} size={28} maxW={0 + 440} upper={false} tone="cool"/>
      <P2Card cx={1250} y={520} text={c("h24").text} f={p.f} at={c("h24").at} size={34} maxW={520} upper={false}/>
      <P2Card cx={1625} y={760} text={c("dk").text} f={p.f} at={c("dk").at} size={28} maxW={400} upper={false} tone="green"/>
    </>
  );
};

// ---------------------------------------------------------------- detention-calendar ----------------------------------------------------
const Month: React.FC<{x: number; y: number; w: number; h: number; col: string; rot?: number; id: string; marks?: number[]; dim?: boolean}> = ({x, y, w, h, col, rot = 0, id, marks = [], dim}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} style={{filter: "drop-shadow(0 10px 8px rgba(30,16,4,.36))"}}>
    <rect width={w} height={h} rx={6} fill="#fffdf4" stroke="#c9b98f" strokeWidth={2}/>
    <rect width={w} height={h * 0.2} rx={6} fill={col}/><rect y={h * 0.12} width={w} height={h * 0.08} fill={col}/>
    <rect x={w * 0.5 - 40} y={h * 0.045} width={80} height={h * 0.07} rx={4} fill="#fff" opacity={0.7}/>
    {[0.2, 0.8].map((u, i) => <circle key={i} cx={w * u} cy={-2} r={6} fill="#8a8e98" stroke="#4a4e58" strokeWidth={2}/>)}
    {Array.from({length: 35}).map((_, i) => { const cx = w * (0.1 + 0.8 * ((i % 7) + 0.5) / 7), cy = h * (0.3 + 0.64 * (Math.floor(i / 7) + 0.5) / 5); return <rect key={i} x={cx - w * 0.045} y={cy - h * 0.045} width={w * 0.09} height={h * 0.09} rx={3} fill={marks.includes(i) ? col : "#e6dcc0"} opacity={marks.includes(i) ? 0.9 : dim ? 0.5 : 0.75}/>; })}
  </g>
);

export const DetentionArt: React.FC<AP> = (p) => {
  const {f} = p, K = keyed(p), c = (k: string) => K[k] ?? none, id = "w4d";
  const m3 = c("m3").at, m2 = c("m2").at;
  const pg = [0, 1, 2].map((i) => A(f, m3 + i * 10, 18));
  const fig = [0, 1, 2].map((i) => A(f, m3 + 30 + i * 8, 20));
  const ring = A(f, m3 + 40, 24), glass = A(f, m2, 22), stamp = A(f, m2 + 16, 14);
  const bar = A(f, m3 + 20, 40);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c9a8"/><stop offset="1" stopColor="#b9a47e"/></linearGradient>
        <linearGradient id={`${id}-pan`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a5a30"/><stop offset="0.5" stopColor="#a8723e"/><stop offset="1" stopColor="#7a4c26"/></linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="rgba(200,230,250,0.5)"/><stop offset="0.5" stopColor="rgba(180,215,240,0.18)"/><stop offset="1" stopColor="rgba(220,240,255,0.42)"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-wall)`}/>
      {/* panelled wall */}
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={20 + i * 280} y={250} width={240} height={470} rx={6} fill="none" stroke="#8a7248" strokeWidth={3} opacity={0.35}/>)}
      <rect x={-60} y={720} width={W + 120} height={H} fill="#6a4426"/>
      <rect x={-60} y={716} width={W + 120} height={10} fill="#c99a62"/>
      {Array.from({length: 6}).map((_, i) => <path key={i} d={`M-60,${760 + i * 62} H${W + 60}`} stroke="#4a2c14" strokeWidth={2} opacity={0.4}/>)}
      <Glow x={960} y={250} r={620} c="255,236,180" a={0.55}/>
      {/* left: the calendar and the Advisory Board */}
      <g>
        <rect x={150} y={260} width={620} height={410} rx={10} fill="#e6d9b8" opacity={0.0}/>
        <g opacity={pg[0]} transform={`translate(0 ${(1 - pg[0]) * -30})`}><Month x={176} y={322} w={250} h={262} col="#2f78b8" id={`${id}a`} rot={-4} marks={[8, 9, 10, 11, 12]}/></g>
        <g opacity={pg[1]} transform={`translate(0 ${(1 - pg[1]) * -30})`}><Month x={326} y={298} w={250} h={262} col="#d8682a" id={`${id}b`} rot={0} marks={[0, 1, 2, 3, 4, 5, 6]}/></g>
        <g opacity={pg[2]} transform={`translate(0 ${(1 - pg[2]) * -30})`}><Month x={476} y={322} w={250} h={262} col="#2f9a4a" id={`${id}c`} rot={4} marks={[14, 15, 16, 17, 18]}/></g>
        {/* the bracket over the three pages */}
        <g opacity={ring}>
          <path d="M190,284 Q460,246 724,288" fill="none" stroke="#b3281a" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bar}/>
          {[0, 1, 2].map((i) => <circle key={i} cx={330 + i * 130} cy={262 - (i === 1 ? 14 : 0)} r={11} fill="#b3281a"/>)}
        </g>
      </g>
      {/* bench and three robed, faceless figures */}
      <g>
        {[0, 1, 2].map((i) => <Robed key={i} x={300 + i * 170} y={768 - (1 - fig[i]) * 40} h={178} op={fig[i]} f={f} seed={i * 2}/>)}
        <rect x={190} y={700} width={560} height={100} rx={8} fill={`url(#${id}-pan)`} stroke="#3f2814" strokeWidth={3} style={{filter: "drop-shadow(0 12px 10px rgba(30,16,4,.4))"}}/>
        <rect x={180} y={690} width={580} height={20} rx={6} fill="#d8a868" stroke="#7a4c26" strokeWidth={2}/>
        {[0, 1, 2].map((i) => <rect key={i} x={250 + i * 170} y={728} width={100} height={32} rx={4} fill="#c79a3c" stroke="#7a5518" strokeWidth={2} opacity={fig[i]}/>)}
      </g>
      {/* right: second calendar behind glass */}
      <g>
        <ellipse cx={1440} cy={720} rx={250} ry={22} fill="#2a1808" opacity={0.3}/>
        <rect x={1220} y={640} width={440} height={80} rx={6} fill={`url(#${id}-pan)`} stroke="#3f2814" strokeWidth={3}/>
        <rect x={1240} y={300} width={400} height={350} rx={10} fill="#f2ecde" opacity={0.0}/>
        <g opacity={glass}>
          <Month x={1260} y={344} w={190} h={250} col="#8a8e98" id={`${id}d`} rot={-3} dim/>
          <Month x={1380} y={330} w={190} h={250} col="#8a8e98" id={`${id}e`} rot={2} dim marks={[3, 4, 5]}/>
        </g>
        {/* glass case */}
        <g opacity={glass}>
          <rect x={1226} y={290} width={428} height={360} rx={12} fill={`url(#${id}-glass)`} stroke="#b9d6ea" strokeWidth={5}/>
          <rect x={1226} y={290} width={428} height={360} rx={12} fill="none" stroke="#6a5a38" strokeWidth={9} opacity={0.75}/>
          <path d="M1260,300 L1380,300 L1290,640 L1250,640 Z" fill="#fff" opacity={0.22}/>
          <path d="M1470,300 L1500,300 L1420,640 L1400,640 Z" fill="#fff" opacity={0.14}/>
          <circle cx={1440} cy={650} r={13} fill="#c79a3c" stroke="#7a5518" strokeWidth={3}/><rect x={1432} y={652} width={16} height={22} rx={3} fill="#c79a3c" stroke="#7a5518" strokeWidth={2}/>
        </g>
        <g opacity={stamp} transform={`translate(1440 ${460}) rotate(-10) scale(${1.35 - 0.35 * stamp})`}>
          <rect x={-170} y={-36} width={340} height={72} rx={8} fill="rgba(255,250,240,0.55)" stroke="#b3281a" strokeWidth={6}/>
          <rect x={-160} y={-27} width={320} height={54} rx={4} fill="none" stroke="#b3281a" strokeWidth={2}/>
          <text x={0} y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={42} letterSpacing="0.08em" fill="#b3281a">NOT IN FORCE</text>
        </g>
      </g>
    </g>
  );
};
export const DetentionLabels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={960} y={40} text={c("pd").text} f={p.f} at={c("pd").at} size={46} maxW={900}/>
      <P2Card cx={470} y={150} text={c("m3").text} f={p.f} at={c("m3").at} size={34} maxW={620} upper={false}/>
      <P2Card cx={1440} y={150} text={c("m2").text} f={p.f} at={c("m2").at} size={34} maxW={560} upper={false} tone="cool"/>
    </>
  );
};
