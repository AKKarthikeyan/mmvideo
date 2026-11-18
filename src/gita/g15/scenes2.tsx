// Scenes for chapters 7-18, Meera (3-4), the close and the end card. Labels come only from T.D.labels (checked).
import React from "react";
import {AbsoluteFill, Easing, random} from "remotion";
import {DEVA, SANS, SERIF} from "../fonts";
import {BOW, BROWN, COOL, Defs, Diya, EASE, EMBER, Feather, Flute, GOLD, H, HORSE, IC, INK, Icon, INDIGO, LEAFGREEN, NIGHT, NightBG,
  PAPER, PaperBG, SAFFRON, SEAL, SlateBG, Stroke, TEAL, TT, W, WHEEL, circ, ip} from "../kit";
import {SL, SceneProps, phase} from "./scenes1";

const k = (b: string, i: number) => `${b}_${i}`;
const Caps: React.FC<{x: number; y: number; w?: number; o: number; color?: string; children: React.ReactNode; size?: number}> =
  ({x, y, w = 400, o, color = INK, children, size = 18}) => (
    <div style={{position: "absolute", left: x - w / 2, top: y, width: w, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: size,
      letterSpacing: 5, color, opacity: o}}>{children}</div>
  );

// verses per chapter (this edition), used by ch12 and ch18
const Bars: React.FC<{f: number; T: TT; at: number; hi: number[]; tone: "ink" | "light"}> = ({f, T, at, hi, tone}) => {
  const n = T.D.verse_counts; const x0 = 300, bw = 62, base = 780, sc = 5.6;
  const col = tone === "ink" ? INK : PAPER;
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <path d={`M ${x0 - 20} ${base} L ${x0 + 18 * 74} ${base}`} stroke={col} strokeWidth={2} opacity={0.5}/>
        {n.map((v, i) => {
          const h = v * sc * ip(f, at + i * 1.5, at + 14 + i * 1.5, 0, 1, EASE); const on = hi.includes(i + 1);
          return <g key={i}>
            <rect x={x0 + i * 74} y={base - h} width={bw} height={h} rx={6} fill={on ? SAFFRON : col} opacity={on ? 0.95 : 0.22}/>
            <text x={x0 + i * 74 + bw / 2} y={base + 34} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={20} fill={col} opacity={0.6}>{i + 1}</text>
            <text x={x0 + i * 74 + bw / 2} y={base - h - 14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={on ? 28 : 18}
              fill={on ? (tone === "ink" ? SEAL : SAFFRON) : col} opacity={(on ? 1 : 0.5) * ip(f, at + 16, at + 26)}>{v}</text>
          </g>;
        })}
      </svg>
      <Caps x={960} y={base + 70} w={1200} o={0.6 * ip(f, at + 10, at + 24)} color={col} size={16}>VERSES PER CHAPTER · THIS EDITION, 701 IN ALL</Caps>
    </>
  );
};

// ---------- chapter 7: the elements strung like gems on one thread
const GEM = ["#c0392b", "#e8e2d0", "#e07a3a", "#2e8b57", "#d4a017", "#cfe8f5", "#1f4fa0", "#a0522d"];
export const Ch7: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch7"; const c2 = k(b, 2), c3 = k(b, 3);
  const p2 = phase(f, T, b, 2, 3), p3 = phase(f, T, b, 3);
  const words = ["Earth", "water", "fire", "air", "space", "mind", "intellect", "ego"];
  const ids = ["bhumi", "apah", "anala", "vayu", "kham", "manah", "buddhi", "ahankara"];
  const icons = [IC.earth, IC.water, IC.fire, IC.air, IC.space, IC.mind, IC.intellect, IC.ego];
  const thread = "M 120 560 C 600 700 1320 700 1800 560";
  const pt = (t: number) => { const u = 1 - t; return [u * u * u * 120 + 3 * u * u * t * 600 + 3 * u * t * t * 1320 + t * t * t * 1800,
    u * u * u * 560 + 3 * u * u * t * 700 + 3 * u * t * t * 700 + t * t * t * 560]; };
  const life = T.at(c2, "Life itself");
  return (
    <PaperBG id="c7">
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c7"/>
          <Stroke d={thread} p={ip(f, T.s(c2), T.s(c2) + 24)} color={SEAL} w={3}/>
          {words.map((w, i) => {
            const t = T.at(c2, w); const [x, y] = pt(0.08 + i * 0.12);
            return <g key={w}>
              <g transform={`translate(${x} ${y}) scale(${ip(f, t - 4, t + 8, 0, 1, Easing.out(Easing.back(2)))})`}>
                <path d="M -26 -10 L 0 -34 L 26 -10 L 0 30 Z" fill={GEM[i]} stroke={INK} strokeWidth={2}/>
                <path d="M -26 -10 L 26 -10 M -10 -10 L 0 30 L 10 -10" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} fill="none"/>
              </g>
              <Icon d={icons[i]} x={x} y={y - 130} s={0.9} p={ip(f, t - 4, t + 14)} w={3}/>
            </g>;
          })}
          <g opacity={ip(f, life - 4, life + 12)}>
            <circle cx={960} cy={300} r={80} fill={SAFFRON} opacity={0.25} filter="url(#glow-c7)"/>
            <path d="M 922 286 L 960 240 L 998 286 L 960 350 Z" fill={SAFFRON} stroke={INK} strokeWidth={2.5}/>
            <path d={`M 960 350 L 960 ${pt(0.5)[1]}`} stroke={SEAL} strokeWidth={2} strokeDasharray="5 6"/>
          </g>
        </svg>
        {words.map((w, i) => { const [x, y] = pt(0.08 + i * 0.12);
          return <SL key={w} f={f} T={T} id={ids[i]} at={T.at(c2, w)} x={x} y={y + 50} size={24} w={190} cite={false}/>; })}
        <SL f={f} T={T} id="para" at={life} x={960} y={110} size={30} w={900}/>
        <Caps x={960} y={870} w={1200} o={0.6 * ip(f, T.s(c2) + 20, T.s(c2) + 34)} color={BROWN} size={15}>MY LOWER NATURE, EIGHTFOLD · GITA 7.4</Caps>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p3}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c7b"/>
          <Icon d={IC.water} x={480} y={440} s={2.4} p={ip(f, T.at(c3, "taste"), T.at(c3, "taste") + 16)} color={TEAL} w={4} fill={TEAL} fillO={0.15}/>
          <Icon d={IC.sun} x={900} y={430} s={2} p={ip(f, T.at(c3, "light of the sun"), T.at(c3, "light of the sun") + 16)} color={EMBER} w={4}/>
          <Icon d={IC.moon} x={1080} y={430} s={1.5} p={ip(f, T.at(c3, "the moon"), T.at(c3, "the moon") + 16)} color={INK} w={3.5} fill={GOLD} fillO={0.3}/>
        </svg>
        <div style={{position: "absolute", left: 1290, top: 300, width: 300, textAlign: "center", fontFamily: DEVA, fontSize: 200, color: SEAL, lineHeight: 1,
          opacity: ip(f, T.at(c3, "syllable Om"), T.at(c3, "syllable Om") + 14)}}>ॐ</div>
        <SL f={f} T={T} id="raso" at={T.at(c3, "taste")} x={480} y={600} size={28} w={420}/>
        <SL f={f} T={T} id="prabha" at={T.at(c3, "light of the sun")} x={990} y={600} size={28} w={480}/>
        <SL f={f} T={T} id="pranava" at={T.at(c3, "syllable Om")} x={1440} y={600} size={28} w={480}/>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 8: a heartbeat becomes a melody; remember, and fight
export const Ch8: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch8"; const c1 = k(b, 1), c2 = k(b, 2);
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const morph = ip(f, T.at(c1, "simplest practice") - 10, T.at(c1, "simplest practice") + 30, 0, 1, EASE);
  const pts = Array.from({length: 120}).map((_, i) => {
    const x = 100 + i * 10; const beat = i % 30;
    const ecg = beat === 12 ? -40 : beat === 13 ? 120 : beat === 14 ? -160 : beat === 15 ? 60 : 0;
    const mel = Math.sin(i / 6) * 50 + Math.sin(i / 2.7) * 14;
    return `${i ? "L" : "M"} ${x} ${480 + ecg * (1 - morph) + mel * morph}`;
  }).join(" ");
  return (
    <NightBG f={f} id="c8">
      <AbsoluteFill style={{opacity: p1}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c8"/>
          <path d={pts} stroke={SAFFRON} strokeWidth={14} fill="none" opacity={0.25} filter="url(#soft-c8)"/>
          <Stroke d={pts} p={ip(f, T.s(c1), T.s(c1) + 60)} color={morph > 0.5 ? SAFFRON : "#ff6b6b"} w={4}/>
          <Flute x={1330} y={480} len={460} p={morph}/>
        </svg>
        <SL f={f} T={T} id="antakale" at={T.at(c1, "very end")} x={700} y={160} tone="light" size={36} w={800}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <g transform="translate(700 470) scale(0.7)">
            <path d={BOW} stroke={PAPER} strokeWidth={11} fill="none"/><path d="M 6 -372 L 6 372" stroke={GOLD} strokeWidth={3}/>
          </g>
          <Feather x={1220} y={330} scale={0.62} rot={14}/>
        </svg>
        <SL f={f} T={T} id="anusmara" at={T.at(c2, "Remember, and")} x={1180} y={760} tone="light" size={34} w={500}/>
        <SL f={f} T={T} id="yudhya" at={T.at(c2, "do the work")} x={740} y={760} tone="light" size={34} w={500}/>
      </AbsoluteFill>
    </NightBG>
  );
};

// ---------- chapter 9: yoga-kshema; a leaf, a flower, a fruit, water
const BananaLeaf: React.FC<{p: number}> = ({p}) => (
  <g opacity={p}>
    <path d="M 260 600 C 400 470 1500 470 1680 560 C 1500 700 420 720 260 600 Z" fill="#4f8a3a"/>
    <path d="M 260 600 C 700 560 1300 560 1680 560" stroke="#a6d082" strokeWidth={5} fill="none"/>
    {Array.from({length: 26}).map((_, i) => { const x = 330 + i * 52; return <path key={i} d={`M ${x} ${590 - (i > 12 ? (i - 12) * 1.5 : 0)} C ${x + 20} 540 ${x + 34} 510 ${x + 44} 500 M ${x} 592 C ${x + 20} 640 ${x + 34} 670 ${x + 44} 680`} stroke="#79ad5e" strokeWidth={1.5} fill="none" opacity={0.7}/>; })}
  </g>
);
export const Ch9: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch9"; const c1 = k(b, 1), c2 = k(b, 2), c3 = k(b, 3);
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const lic = T.at(c1, "That line is the motto");
  const g = T.at(c2, "gentle");
  const items = [["patram", IC.leaf, LEAFGREEN], ["pushpam", IC.flower, SEAL], ["phalam", IC.fruit, EMBER], ["toyam", IC.kalash, "#8a6a35"]];
  return (
    <PaperBG id="c9">
      <AbsoluteFill style={{opacity: p1}}>
        <SL f={f} T={T} id="yogakshema" at={T.s(c1) + 6} x={960} y={300} size={56} w={1500} deva/>
        <div style={{position: "absolute", top: 650, width: W, textAlign: "center", opacity: ip(f, lic, lic + 12)}}>
          <div style={{display: "inline-block", border: `2px solid ${SEAL}`, borderRadius: 40, padding: "10px 30px", fontFamily: SANS, fontWeight: 700, fontSize: 22,
            letterSpacing: 3, color: SEAL}}>THE MOTTO OF LIC · LIFE INSURANCE CORPORATION OF INDIA</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <BananaLeaf p={ip(f, T.s(c2), T.s(c2) + 16)}/>
          {items.map(([id, d, col], i) => <Icon key={id as string} d={d as string} x={560 + i * 280} y={560} s={1.5} color={col as string} w={4}
            fill={col as string} fillO={0.25} p={ip(f, g + i * 6, g + 16 + i * 6)}/>)}
        </svg>
        {items.map(([id], i) => <SL key={id as string} f={f} T={T} id={id as string} at={g + 8 + i * 6} x={560 + i * 280} y={720} size={30} w={260} cite={false}/>)}
        <SL f={f} T={T} id="yatkaroshi" at={T.s(c3)} x={960} y={170} size={36} w={1500}/>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 10: the glories as a constellation
export const Ch10: React.FC<SceneProps> = ({f, T}) => {
  const c = k("ch10", 1);
  const stars: [string, string, string, number, number][] = [["Himalaya", "himalaya", IC.mountain, 340, 420], ["sacred fig", "ashvattha", IC.peepal, 700, 270],
    ["Ganga", "jahnavi", IC.river, 1060, 420], ["Margashirsha", "margashirsha", IC.calendar, 1400, 270], ["spring", "kusumakara", IC.blossom, 1640, 470]];
  return (
    <NightBG f={f} id="c10" glow="50% 30%">
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="c10"/>
        {Array.from({length: 90}).map((_, i) => <circle key={i} cx={random(`st${i}`) * W} cy={random(`sy${i}`) * 820} r={0.8 + random(`sr${i}`) * 1.6}
          fill={PAPER} opacity={0.2 + 0.4 * Math.abs(Math.sin(f / 30 + i))}/>)}
        {stars.slice(1).map(([w, , , x, y], i) => { const [, , , px, py] = stars[i]; const t = T.at(c, w);
          return <path key={w} d={`M ${px} ${py} L ${x} ${y}`} stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 8" opacity={0.6 * ip(f, t - 6, t + 6)}/>; })}
        {stars.map(([w, , d, x, y]) => { const t = T.at(c, w);
          return <g key={w}>
            <circle cx={x} cy={y} r={92} fill={SAFFRON} opacity={0.18 * ip(f, t - 4, t + 10)} filter="url(#glow-c10)"/>
            <circle cx={x} cy={y} r={80} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={ip(f, t - 4, t + 10)}/>
            <Icon d={d} x={x} y={y} s={1.15} color={PAPER} w={3} p={ip(f, t - 4, t + 18)}/>
          </g>; })}
      </svg>
      {stars.map(([w, id, , x, y]) => <SL key={id} f={f} T={T} id={id} at={T.at(c, w) + 4} x={x} y={y + 100} tone="light" size={26} w={580}/>)}
      <div style={{position: "absolute", top: 140, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 15, letterSpacing: 4, color: GOLD,
        opacity: 0.8 * ip(f, T.at(c, "where should I look"), T.at(c, "where should I look") + 12)}}>“WHERE SHOULD I LOOK FOR YOU?” · ARJUNA · GITA 10.17</div>
    </NightBG>
  );
};

// ---------- chapter 11: the summit
const Mandala: React.FC<{f: number; s: number; o: number}> = ({f, s, o}) => (
  <g transform={`translate(960 470) scale(${s})`} opacity={o}>
    <circle r={420} fill="url(#sun11)"/>
    <g transform={`rotate(${f * 0.15})`}>{Array.from({length: 32}).map((_, i) => <ellipse key={i} cx={0} cy={-300} rx={22} ry={78} fill="none" stroke={GOLD} strokeWidth={2}
      transform={`rotate(${i * 11.25})`} opacity={0.8}/>)}</g>
    <g transform={`rotate(${-f * 0.25})`}>{Array.from({length: 16}).map((_, i) => <path key={i} d="M 0 -210 L 34 -150 L -34 -150 Z" fill="none" stroke={SAFFRON} strokeWidth={2.5}
      transform={`rotate(${i * 22.5})`}/>)}</g>
    <g transform={`rotate(${f * 0.4})`}>{Array.from({length: 48}).map((_, i) => <circle key={i} cx={0} cy={-120 - (i % 3) * 14} r={3 + (i % 4)} fill={["#9fd3ff", PAPER, SAFFRON, "#ff9a7a"][i % 4]}
      transform={`rotate(${i * 7.5})`} opacity={0.9}/>)}</g>
    {[380, 340, 250, 170, 90].map((r, i) => <circle key={i} r={r} fill="none" stroke={i % 2 ? SAFFRON : GOLD} strokeWidth={i === 4 ? 4 : 1.5} opacity={0.7}/>)}
    {Array.from({length: 24}).map((_, i) => <path key={i} d={`M 0 -440 L 0 ${-560 - (i % 2) * 120}`} stroke="#ffe8b0" strokeWidth={2} transform={`rotate(${i * 15 + f * 0.1})`} opacity={0.5}/>)}
    <circle r={60} fill="#fff6dc"/>
  </g>
);
export const Ch11: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch11"; const c1 = k(b, 1), c2 = k(b, 2), c3 = k(b, 3), c4 = k(b, 4);
  const p12 = phase(f, T, b, 1, 3), p3 = phase(f, T, b, 3, 4), p4 = phase(f, T, b, 4);
  const eye = T.at(c2, "divine sight");
  const grow = ip(f, T.s(c3) - 10, T.s(c3) + 90, 0.2, 1.15, EASE);
  const riv = T.at(c3, "rivers rush"), opp = T.at(c3, "Oppenheimer");
  const fold = ip(f, T.s(c4) + 10, T.at(c4, "becomes himself"), 1, 0, EASE);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #1a1446 0%, #07081c 75%)`}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="c11"/>
        <defs><radialGradient id="sun11"><stop offset="0" stopColor="#fff2c4" stopOpacity={0.9}/><stop offset="0.4" stopColor={SAFFRON} stopOpacity={0.35}/><stop offset="1" stopColor={INDIGO} stopOpacity={0}/></radialGradient></defs>
        {Array.from({length: 140}).map((_, i) => <circle key={i} cx={random(`s11${i}`) * W} cy={random(`t11${i}`) * H} r={0.6 + random(`r11${i}`) * 1.4} fill={PAPER} opacity={0.15 + 0.3 * Math.abs(Math.sin(f / 40 + i))}/>)}
        <g opacity={p12}>
          <g transform="translate(960 800)"><circle cx={0} cy={-60} r={9} fill={PAPER}/><path d="M 0 -50 L -7 -10 L 7 -10 Z" fill={PAPER}/>
            <path d="M -16 -78 C 2 -66 2 -26 -16 -12" stroke={PAPER} strokeWidth={2.5} fill="none"/></g>
          <g opacity={ip(f, eye - 6, eye + 16)} transform="translate(960 420)">
            <circle r={160} fill={SAFFRON} opacity={0.2} filter="url(#glow-c11)"/>
            <g transform="translate(-150 -150) scale(3)"><path d={IC.eye} stroke={GOLD} strokeWidth={1.4} fill="none"/></g>
            <circle r={26} fill={GOLD} opacity={0.9}/>
          </g>
        </g>
        <g opacity={p3 + p4 * fold}>
          <Mandala f={f} s={grow * (p4 > 0.5 ? fold : 1)} o={1}/>
          {Array.from({length: 10}).map((_, i) => {
            const a = (i / 10) * Math.PI * 2; const x0 = 960 + Math.cos(a) * 1200, y0 = 470 + Math.sin(a) * 700;
            const d = `M ${x0} ${y0} Q ${960 + Math.cos(a + 0.5) * 500} ${470 + Math.sin(a + 0.5) * 300} 960 470`;
            return <Stroke key={i} d={d} p={ip(f, riv - 6 + i, riv + 30 + i)} color="#7fc7ff" w={3} opacity={0.6}/>;
          })}
        </g>
        <g opacity={p4 * (1 - fold)}>
          <Feather x={960} y={360} scale={0.5} rot={0} glint={0.6}/>
          <Flute x={700} y={720} len={520}/>
        </g>
      </svg>
      <div style={{opacity: p12}}><SL f={f} T={T} id="divyam" at={eye} x={960} y={150} tone="light" size={36} w={1000}/></div>
      <div style={{opacity: p3}}>
        <SL f={f} T={T} id="nantam" at={T.at(c3, "no beginning")} x={960} y={86} tone="light" size={32} w={1000} bg/>
        <SL f={f} T={T} id="nadinam" at={riv} x={960} y={770} tone="light" size={28} w={1000} bg/>
        <div style={{position: "absolute", left: 60, top: 300, width: 360, opacity: ip(f, opp, opp + 12), fontFamily: SANS}}>
          <div style={{fontWeight: 800, fontSize: 18, letterSpacing: 4, color: GOLD}}>J. ROBERT OPPENHEIMER</div>
          <div style={{fontSize: 20, color: PAPER, opacity: 0.8, marginTop: 8, lineHeight: 1.35}}>recalled verse 11.32 at the Trinity test, the first atomic explosion, 16 July 1945</div>
        </div>
      </div>
      <div style={{opacity: p4}}>
        <SL f={f} T={T} id="vasudeva" at={T.at(c4, "Vasudeva")} x={760} y={150} tone="light" size={36} w={500}/>
        <SL f={f} T={T} id="saumya" at={T.at(c4, "gently")} x={1160} y={150} tone="light" size={36} w={500}/>
      </div>
    </AbsoluteFill>
  );
};

// ---------- chapter 12: the two shortest chapters; form and formless
export const Ch12: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch12"; const c1 = k(b, 1), c2 = k(b, 2);
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const love = T.at(c2, "path of love");
  return (
    <PaperBG id="c12">
      <AbsoluteFill style={{opacity: p1}}><Bars f={f} T={T} at={T.s(c1)} hi={[12, 15]} tone="ink"/></AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c12"/>
          <g transform="translate(600 460)">
            <circle r={200} fill={SAFFRON} opacity={0.3 * ip(f, love, love + 16)} filter="url(#glow-c12)"/>
            {[-50, -25, 0, 25, 50].map((r, i) => <path key={i} d="M 0 90 C -45 30 -40 -60 0 -110 C 40 -60 45 30 0 90 Z" fill={["#e8a3b8", "#f0b9c8", "#f6c7d3", "#f0b9c8", "#e8a3b8"][i]}
              stroke="#b05a78" strokeWidth={2} transform={`rotate(${r} 0 90)`} opacity={ip(f, T.at(c2, "loves a form"), T.at(c2, "loves a form") + 14)}/>)}
          </g>
          <g transform="translate(1320 460)" opacity={ip(f, T.at(c2, "formless"), T.at(c2, "formless") + 14)}>
            {[160, 120, 80, 40].map((r, i) => <circle key={i} r={r} fill="none" stroke={BROWN} strokeWidth={1.5} strokeDasharray="3 9" opacity={0.6 - i * 0.1}/>)}
            <circle r={14} fill={BROWN} opacity={0.5}/>
          </g>
        </svg>
        <Caps x={600} y={720} o={ip(f, T.at(c2, "loves a form"), T.at(c2, "loves a form") + 14)}>A FORM</Caps>
        <SL f={f} T={T} id="avyakta" at={T.at(c2, "formless")} x={1320} y={700} size={30} w={560}/>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- Meera 3: the grandmother's prayer shelf
export const Meera3: React.FC<SceneProps> = ({f, T}) => {
  const c = "meera3_0"; const a = T.s(c);
  return (
    <SlateBG f={f} id="m3" warm={0.55}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="m3"/>
        <rect x={460} y={620} width={1000} height={26} rx={6} fill="#6b4a2a"/>
        <path d="M 520 646 L 540 720 M 1400 646 L 1380 720" stroke="#5a3d22" strokeWidth={10}/>
        <Icon d={IC.leaf} x={640} y={570} s={0.9} color={LEAFGREEN} w={3} fill={LEAFGREEN} fillO={0.4} p={ip(f, T.at(c, "A leaf"), T.at(c, "A leaf") + 14)}/>
        <Icon d={IC.flower} x={820} y={560} s={1} color="#e07a8a" w={3} fill="#e07a8a" fillO={0.35} p={ip(f, T.at(c, "a flower"), T.at(c, "a flower") + 14)}/>
        <Icon d={IC.kalash} x={1240} y={566} s={1} color="#c9a46a" w={3} fill="#c9a46a" fillO={0.3} p={ip(f, T.at(c, "little water"), T.at(c, "little water") + 14)}/>
        <Diya x={1030} y={618} s={0.8} f={f} p={ip(f, a, a + 16)} id="m3"/>
      </svg>
    </SlateBG>
  );
};

// ---------- chapter 13: the field and its knower
export const Ch13: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch13"; const c3 = k(b, 3); const p = phase(f, T, b, 3);
  const plots = [[300, 380, 560, 340, 620, 560, 330, 600], [600, 330, 980, 300, 1000, 540, 640, 560], [1020, 300, 1400, 330, 1380, 560, 1040, 540],
    [1430, 340, 1640, 380, 1620, 600, 1400, 560], [340, 640, 640, 590, 660, 820, 360, 840], [680, 590, 1000, 570, 1010, 810, 690, 820],
    [1050, 570, 1370, 590, 1380, 820, 1060, 810], [1410, 600, 1620, 640, 1600, 840, 1420, 820]];
  const know = T.at(c3, "knower"), every = T.at(c3, "every field");
  return (
    <PaperBG id="c13">
      <AbsoluteFill style={{opacity: p}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c13"/>
          <g filter="url(#ink-c13)">
            {plots.map((q, i) => {
              const d = `M ${q[0]} ${q[1]} L ${q[2]} ${q[3]} L ${q[4]} ${q[5]} L ${q[6]} ${q[7]} Z`;
              const rows = Array.from({length: 6}).map((_, r) => { const t = (r + 1) / 7;
                return `M ${q[0] + (q[6] - q[0]) * t + 12} ${q[1] + (q[7] - q[1]) * t} L ${q[2] + (q[4] - q[2]) * t - 12} ${q[3] + (q[5] - q[3]) * t}`; }).join(" ");
              return <g key={i}><Stroke d={d} p={ip(f, T.s(c3) + i * 3, T.s(c3) + 20 + i * 3)} w={3}/>
                <Stroke d={rows} p={ip(f, T.s(c3) + 10 + i * 3, T.s(c3) + 40 + i * 3)} w={1.5} color={LEAFGREEN} opacity={0.8}/></g>;
            })}
          </g>
          {plots.map((q, i) => { const cx = (q[0] + q[2] + q[4] + q[6]) / 4, cy = (q[1] + q[3] + q[5] + q[7]) / 4;
            return <g key={i} opacity={ip(f, every + i * 2, every + 10 + i * 2)}><circle cx={cx} cy={cy - 20} r={30} fill={SAFFRON} opacity={0.3} filter="url(#glow-c13)"/>
              <circle cx={cx} cy={cy - 20} r={8} fill={SAFFRON}/></g>; })}
          <g opacity={ip(f, know - 4, know + 12)}><circle cx={960} cy={170} r={60} fill={SAFFRON} opacity={0.3} filter="url(#glow-c13)"/>
            <g transform="translate(900 110) scale(1.2)"><path d={IC.eye} stroke={INK} strokeWidth={2.4} fill="none"/></g></g>
        </svg>
        <SL f={f} T={T} id="kshetra" at={T.s(c3) + 20} x={480} y={150} size={26} w={400}/>
        <SL f={f} T={T} id="kshetrajna" at={know} x={1400} y={110} size={26} w={600}/>
        <SL f={f} T={T} id="kshetrajnam" at={every} x={1400} y={200} size={22} w={760}/>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 14: guna = a strand; the three-strand rope
export const Ch14: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch14"; const c2 = k(b, 2); const p = phase(f, T, b, 2);
  const cols = ["#fbf6ea", "#c0392b", "#2b2118"]; const ids = ["sattva", "rajas", "tamas"]; const words = ["Sattva binds", "Rajas", "Tamas"];
  const strand = (ph: number) => Array.from({length: 161}).map((_, i) => `${i ? "L" : "M"} ${160 + i * 10} ${480 + Math.sin(i / 8 + ph) * 42}`).join(" ");
  const free = T.at(c2, "rises above");
  return (
    <PaperBG id="c14">
      <AbsoluteFill style={{opacity: p}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c14"/>
          {[0, 1, 2].map((i) => <g key={i}>
            <Stroke d={strand((i * 2 * Math.PI) / 3 + f / 40)} p={ip(f, T.s(c2) + i * 8, T.s(c2) + 50 + i * 8)} color={INK} w={22}/>
            <Stroke d={strand((i * 2 * Math.PI) / 3 + f / 40)} p={ip(f, T.s(c2) + i * 8, T.s(c2) + 50 + i * 8)} color={cols[i]} w={16}/>
          </g>)}
          <g opacity={ip(f, free, free + 14)} transform={`translate(960 ${ip(f, free, free + 40, 470, 300, EASE)})`}>
            <circle r={90} fill={SAFFRON} opacity={0.3} filter="url(#glow-c14)"/>
            <g transform="translate(-50 -60)"><path d={IC.person} stroke={SEAL} strokeWidth={4} fill="none"/></g>
          </g>
        </svg>
        {ids.map((id, i) => <SL key={id} f={f} T={T} id={id} at={T.at(c2, words[i])} x={480 + i * 480} y={620} size={34} w={420}/>)}
        <SL f={f} T={T} id="atitya" at={free} x={960} y={110} size={32} w={900}/>
        <Caps x={960} y={790} w={900} o={0.6 * ip(f, T.at(c2, "strand of rope"), T.at(c2, "strand of rope") + 12)} color={BROWN} size={15}>GUṆA: A STRAND, A QUALITY</Caps>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 15: the upside-down tree
const TREE = (() => {
  const br: string[] = []; const lv: [number, number, number][] = [];
  const grow = (x: number, y: number, a: number, len: number, d: number) => {
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    br.push(`M ${x} ${y} Q ${(x + x2) / 2 + Math.sin(a) * 12} ${(y + y2) / 2} ${x2} ${y2}`);
    if (d === 0) { lv.push([x2, y2, a]); return; }
    grow(x2, y2, a - 0.42, len * 0.72, d - 1); grow(x2, y2, a + 0.42, len * 0.72, d - 1);
  };
  grow(960, 330, Math.PI / 2, 150, 5);
  return {br, lv};
})();
export const Ch15: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch15"; const c1 = k(b, 1), c2 = k(b, 2);
  const a = T.s(c1); const axe = T.at(c2, "axe"), heart = T.at(c2, "hearts of all");
  const cut = ip(f, axe + 10, axe + 16);
  return (
    <NightBG f={f} id="c15" glow="50% 12%">
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="c15"/>
        <rect x={0} y={0} width={W} height={150} fill="url(#roots15)"/>
        <defs><linearGradient id="roots15" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity={0.5}/><stop offset="1" stopColor="#fff2c4" stopOpacity={0}/></linearGradient></defs>
        {Array.from({length: 7}).map((_, i) => { const dx = (i - 3) * 110, w1 = Math.sin(i * 1.7) * 30;
          return <g key={i}>
            <Stroke d={`M 960 330 C ${960 + dx * 0.2 + w1} 270 ${960 + dx * 0.7 - w1} 190 ${960 + dx} 60`} p={ip(f, a, a + 30)} color={GOLD} w={4 - Math.abs(i - 3) * 0.6}/>
            <Stroke d={`M ${960 + dx * 0.55} 200 C ${960 + dx * 0.55 + 40} 170 ${960 + dx * 0.55 + 30} 120 ${960 + dx * 0.55 + 70} 90`} p={ip(f, a + 10, a + 34)} color={GOLD} w={1.6}/>
            <Stroke d={`M ${960 + dx * 0.8} 140 C ${960 + dx * 0.8 - 30} 110 ${960 + dx * 0.8 - 20} 70 ${960 + dx * 0.8 - 50} 40`} p={ip(f, a + 14, a + 38)} color={GOLD} w={1.2}/>
          </g>; })}
        <g opacity={1 - 0.6 * cut} transform={`translate(0 ${cut * 30})`}>
          {TREE.br.map((d, i) => <Stroke key={i} d={d} p={ip(f, a + 6 + i * 0.3, a + 26 + i * 0.3)} color={PAPER} w={Math.max(1.5, 7 - Math.log2(i + 1) * 1.1)}/>)}
          {TREE.lv.map(([x, y, ang], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${(ang * 180) / Math.PI - 90})`} opacity={ip(f, a + 20 + i * 0.4, a + 32 + i * 0.4)}>
            <path d="M 0 0 C -10 10 -10 26 0 36 C 10 26 10 10 0 0 Z" fill={LEAFGREEN}/>
            <path d="M -3 14 L 3 14 M -4 20 L 4 20 M -3 26 L 3 26" stroke="#d7ecc2" strokeWidth={1}/>
          </g>)}
        </g>
        <g opacity={ip(f, axe - 4, axe + 6) * ip(f, axe + 30, axe + 40, 1, 0)} transform={`translate(1060 420) rotate(${ip(f, axe, axe + 12, -50, 10)})`}>
          <g transform="translate(-50 -50) scale(1.3)"><path d={IC.axe} stroke={GOLD} strokeWidth={3} fill="none"/></g></g>
        <g opacity={ip(f, heart - 4, heart + 12)}>
          <g transform="translate(860 640) scale(2)"><path d={IC.heart} stroke={SAFFRON} strokeWidth={1.6} fill="rgba(242,163,58,0.12)"/></g>
        </g>
      </svg>
      <svg width={W} height={H} style={{position: "absolute"}}><Defs id="c15d"/><Diya x={960} y={760} s={0.55} f={f} p={ip(f, heart, heart + 12)} id="c15d"/></svg>
      <SL f={f} T={T} id="urdhva" at={a + 4} x={420} y={200} tone="light" size={30} w={600}/>
      <SL f={f} T={T} id="chandamsi" at={a + 30} x={1500} y={200} tone="light" size={30} w={560}/>
      <SL f={f} T={T} id="asanga" at={axe} x={1460} y={560} tone="light" size={26} w={800}/>
      <SL f={f} T={T} id="hrdi" at={heart} x={460} y={700} tone="light" size={28} w={620}/>
    </NightBG>
  );
};

// ---------- chapter 16: two natures; three gates
export const Ch16: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch16"; const c1 = k(b, 1), c2 = k(b, 2);
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const L = [["abhayam", "Fearlessness"], ["satyam", "truth"], ["daya", "compassion"]], R = [["darpa", "Arrogance"], ["krodha16", "anger"], ["parushya", "harshness"]];
  return (
    <PaperBG id="c16">
      <AbsoluteFill style={{opacity: p1}}>
        <Caps x={560} y={180} o={ip(f, T.s(c1), T.s(c1) + 10)} color={TEAL} size={22}>DIVINE</Caps>
        <Caps x={1360} y={180} o={ip(f, T.at(c1, "Arrogance"), T.at(c1, "Arrogance") + 10)} color={SEAL} size={22}>DEMONIC</Caps>
        <svg width={W} height={H} style={{position: "absolute"}}><path d="M 960 200 L 960 800" stroke={BROWN} strokeWidth={2} opacity={0.35}/></svg>
        {L.map(([id, w], i) => <SL key={id} f={f} T={T} id={id} at={T.at(c1, w)} x={560} y={270 + i * 170} size={36} w={600}/>)}
        {R.map(([id, w], i) => <SL key={id} f={f} T={T} id={id} at={T.at(c1, w)} x={1360} y={270 + i * 170} size={36} w={600}/>)}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          {["kama", "krodha", "lobha"].map((id, i) => { const x = 560 + i * 400, t = T.s(c2) + 6 + i * 8;
            return <g key={id} opacity={ip(f, t, t + 10)} transform={`translate(${x} 440)`}>
              <rect x={-130} y={-150} width={260} height={260} rx={58} fill={INK}/>
              <path d="M -60 110 L -60 -20 C -60 -80 60 -80 60 -20 L 60 110 Z" fill="#000" stroke={SEAL} strokeWidth={4}/>
              <circle cx={110} cy={-130} r={34} fill="#e03131"/>
              <text x={110} y={-120} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} fill="#fff">{["99+", "12", "47"][i]}</text>
            </g>; })}
        </svg>
        {["kama", "krodha", "lobha"].map((id, i) => <SL key={id} f={f} T={T} id={id} at={T.s(c2) + 12 + i * 8} x={560 + i * 400} y={600} size={36} w={340}/>)}
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 17: three kinds of faith; Om Tat Sat
export const Ch17: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch17"; const c1 = k(b, 1), c2 = k(b, 2);
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const rows = ["Food", "worship", "discipline", "giving"]; const cols = ["#fbf6ea", "#c0392b", "#3a2a20"];
  return (
    <SlateBG f={f} id="c17">
      <AbsoluteFill style={{opacity: p1}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          {rows.map((r, i) => { const t = T.at(c1, r); return <g key={r} opacity={ip(f, t - 4, t + 10)}>
            <text x={720} y={300 + i * 120} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={24} letterSpacing={4} fill={PAPER} opacity={0.8}>{r.toUpperCase()}</text>
            {cols.map((c, j) => <circle key={j} cx={820 + j * 150} cy={292 + i * 120} r={30} fill={c} stroke={PAPER} strokeWidth={2}
              opacity={ip(f, T.at(c1, "three kinds") + j * 4, T.at(c1, "three kinds") + 10 + j * 4)}/>)}
          </g>; })}
          {["SATTVIC", "RAJASIC", "TAMASIC"].map((l, j) => <text key={l} x={820 + j * 150} y={220} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={15}
            letterSpacing={3} fill={PAPER} opacity={0.6 * ip(f, T.at(c1, "like the gunas"), T.at(c1, "like the gunas") + 10)}>{l}</text>)}
        </svg>
        <SL f={f} T={T} id="ahara" at={T.s(c1) + 4} x={960} y={110} tone="light" size={30} w={1000}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <SL f={f} T={T} id="omtatsat" at={T.s(c2) + 8} x={960} y={300} tone="light" size={64} w={1400} deva en={false}/>
      </AbsoluteFill>
    </SlateBG>
  );
};

// ---------- chapter 18: the longest chapter; letting go of the fruit; a choice; refuge
export const Ch18: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch18"; const c1 = k(b, 1), c2 = k(b, 2), c3 = k(b, 3), c4 = k(b, 4);
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2, 3), p3 = phase(f, T, b, 3, 4), p4 = phase(f, T, b, 4);
  const snap = T.at(c2, "attachment to its fruit"), own = T.at(c2, "better your own path"), hrd = T.at(c2, "heart of every being");
  const fl = ip(f, snap + 6, snap + 50, 0, 1, Easing.in(Easing.quad));
  return (
    <NightBG f={f} id="c18">
      <AbsoluteFill style={{opacity: p1}}><Bars f={f} T={T} at={T.s(c1)} hi={[18]} tone="light"/></AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c18"/>
          <g transform="translate(560 520)">
            <g transform="translate(-50 -60) scale(1.6)"><path d={IC.person} stroke={PAPER} strokeWidth={2.5} fill="none"/></g>
            {fl < 0.05 && <path d={`M 30 -20 Q 120 -40 200 -70`} stroke={GOLD} strokeWidth={2.5} fill="none"/>}
            <g transform={`translate(${200 + fl * 160} ${-70 - fl * 340}) rotate(${fl * 40})`} opacity={1 - fl * 0.8}>
              <g transform="translate(-40 -40) scale(0.8)"><path d={IC.fruit} stroke={EMBER} strokeWidth={4} fill="rgba(217,115,31,0.3)"/></g></g>
          </g>
          <g opacity={ip(f, hrd - 4, hrd + 12)} transform="translate(1380 520)">
            <g transform="translate(-100 -110) scale(2)"><path d={IC.heart} stroke={SAFFRON} strokeWidth={1.6} fill="rgba(242,163,58,0.12)"/></g>
          </g>
        </svg>
        <svg width={W} height={H} style={{position: "absolute"}}><Defs id="c18d"/><Diya x={1380} y={560} s={0.6} f={f} p={ip(f, hrd, hrd + 12)} id="c18d"/></svg>
        <SL f={f} T={T} id="tyaga" at={snap} x={560} y={760} tone="light" size={28} w={700}/>
        <div style={{opacity: ip(f, hrd - 10, hrd, 1, 0)}}><SL f={f} T={T} id="svadharma" at={own} x={1380} y={300} tone="light" size={32} w={500}/></div>
        <SL f={f} T={T} id="hrddeshe" at={hrd} x={1380} y={760} tone="light" size={26} w={700}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p3}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Stroke d="M 960 880 C 960 760 950 700 960 620" p={ip(f, T.s(c3), T.s(c3) + 20)} color={PAPER} w={10}/>
          <Stroke d="M 960 620 C 940 480 700 420 520 260" p={ip(f, T.s(c3) + 16, T.s(c3) + 46)} color={SAFFRON} w={8}/>
          <Stroke d="M 960 620 C 980 480 1220 420 1400 260" p={ip(f, T.s(c3) + 16, T.s(c3) + 46)} color={SAFFRON} w={8}/>
          {[520, 1400].map((x, i) => <circle key={i} cx={x} cy={260} r={40} fill={SAFFRON} opacity={0.35 * ip(f, T.s(c3) + 40, T.s(c3) + 56)}/>)}
        </svg>
        <SL f={f} T={T} id="yathecchasi" at={T.at(c3, "does not give")} x={960} y={110} tone="light" size={38} w={1000}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p4}}>
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, rgba(255,226,160,${0.55 * ip(f, T.s(c4), T.s(c4) + 40)}) 0%, transparent 45%)`}}/>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <g transform="translate(960 720) scale(0.5) translate(-900 -850)">
            {[0, 1].map((n) => <path key={n} d={HORSE} fill="#0b0816" transform={`translate(${1250 + n * 60} ${635 - n * 20})`}/>)}
            <path d="M 520 620 L 520 500 Q 525 470 565 470 L 800 470 C 860 470 900 420 915 370 L 940 372 L 930 620 Z" fill="#0b0816"/>
            <path d={WHEEL(700, 700, 150)} stroke="#0b0816" strokeWidth={14} fill="none"/>
          </g>
          <Feather x={960} y={300} scale={0.32} rot={0} p={ip(f, T.s(c4) + 10, T.s(c4) + 30)} glint={0.8}/>
        </svg>
      </AbsoluteFill>
    </NightBG>
  );
};

// ---------- close: Arjuna stands firm; the bow rises
export const Close1: React.FC<SceneProps> = ({f, T}) => {
  const c = "close1_0"; const up = T.at(c, "stands firm");
  const r = -ip(f, up - 6, up + 24, 74, 0, EASE);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 78%, ${EMBER} 0%, #7c3b43 30%, #3b2c5e 55%, ${NIGHT} 100%)`}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="cl"/>
        <g transform={`translate(1380 860) rotate(${r}) translate(0 -380)`}>
          <path d={BOW} stroke={SAFFRON} strokeWidth={22} fill="none" opacity={0.35} filter="url(#soft-cl)"/>
          <path d={BOW} stroke="#1a1020" strokeWidth={15} fill="none" strokeLinecap="round"/>
          <path d="M 6 -372 L 6 372" stroke="#e9d9b0" strokeWidth={2.4} opacity={0.8}/>
          <rect x={100} y={-44} width={26} height={88} rx={8} fill="#1a1020"/>
        </g>
        <rect x={0} y={860} width={W} height={220} fill="#140c1c"/>
        {Array.from({length: 24}).map((_, i) => <path key={i} d={`M ${i * 84} 872 l 42 -14 l 42 14`} stroke={EMBER} strokeWidth={2} fill="none" opacity={0.55}/>)}
      </svg>
      <SL f={f} T={T} id="kaccid" at={T.s(c) + 4} x={540} y={300} tone="light" size={36} w={900}/>
    </AbsoluteFill>
  );
};
export const Meera4: React.FC<SceneProps> = ({f, T}) => {
  const c = "meera4_0"; const a = T.s(c); const typ = T.at(c, "types her reply"), sent = T.at(c, "She chose");
  const dawn = ip(f, a, a + 60);
  return (
    <SlateBG f={f} id="m4" warm={0.6 * dawn}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <rect x={1250} y={110} width={520} height={560} fill={`rgba(255,190,120,${0.15 + 0.4 * dawn})`} stroke="#3b4a63" strokeWidth={6}/>
        <path d="M 1510 110 L 1510 670 M 1250 390 L 1770 390" stroke="#3b4a63" strokeWidth={5}/>
        <circle cx={1640} cy={570} r={70} fill="#ffd38a" opacity={0.6 * dawn}/>
        <path d="M 0 790 L 1920 790" stroke="#3b4a63" strokeWidth={4}/>
      </svg>
      <div style={{position: "absolute", left: 770, top: 70, width: 380, height: 700, borderRadius: 46, background: "#0d1118", border: "5px solid #3a4558",
        boxShadow: "0 0 60px rgba(255,200,140,0.25)", overflow: "hidden"}}>
        <div style={{position: "absolute", top: 80, width: 380, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 112, color: "#eef3fb"}}>6:00</div>
        <div style={{position: "absolute", left: 30, right: 30, top: 440, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.1)", opacity: ip(f, typ, typ + 8)}}>
          {[0, 1, 2].map((i) => <div key={i} style={{position: "absolute", left: 30 + i * 22, top: 24, width: 12, height: 12, borderRadius: 6, background: "#b7c3d6",
            opacity: f < sent ? 0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i)) : 0}}/>)}
        </div>
        <div style={{position: "absolute", right: 30, top: 540, padding: "10px 22px", borderRadius: 22, background: SAFFRON, fontFamily: SANS, fontWeight: 700, fontSize: 20,
          color: NIGHT, opacity: ip(f, sent, sent + 8)}}>Sent ✓</div>
      </div>
    </SlateBG>
  );
};

// ---------- end: Om Tat Sat, the full mala, next
export const End: React.FC<SceneProps> = ({f, T}) => {
  const c = "end_1"; const a = T.s(c);
  return (
    <NightBG f={f} id="end">
      <svg width={W} height={H} style={{position: "absolute"}}>
        {Array.from({length: 18}).map((_, i) => { const ang = -Math.PI / 2 + ((i + 1) / 19) * Math.PI * 2; const r = 210;
          return <circle key={i} cx={960 + Math.cos(ang) * r} cy={470 + Math.sin(ang) * r} r={13} fill={GOLD} opacity={ip(f, a + i * 2, a + 10 + i * 2)}/>; })}
        <circle cx={960} cy={470 - 210} r={17} fill={SAFFRON} opacity={ip(f, a + 40, a + 50)}/>
        <path d={circ(960, 470, 210)} stroke={GOLD} strokeWidth={1.5} fill="none" opacity={0.4 * ip(f, a, a + 20)}/>
      </svg>
      <SL f={f} T={T} id="omtatsat" at={a + 10} x={960} y={390} tone="light" size={46} w={800} deva en={false} cite={false}/>
      <div style={{position: "absolute", top: 760, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 8, color: SAFFRON,
        opacity: ip(f, T.at(c, "Next"), T.at(c, "Next") + 12)}}>NEXT · CHAPTER 2</div>
      <div style={{position: "absolute", top: 1000, width: W, textAlign: "center", fontFamily: SANS, fontSize: 17, color: PAPER, opacity: 0.45 * ip(f, a, a + 20)}}>
        Narration is synthetic · Illustrations drawn in code · Sanskrit text: sanskritdocuments.org · Translations: ours</div>
    </NightBG>
  );
};
