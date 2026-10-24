// Scenes for the cold open, Meera (1-2), the title and chapters 1-6. Each scene gets the absolute frame f and timing T.
// Sanskrit labels come only from T.D.labels (checked against the corpus by scripts/gita/gita15.py check).
import React from "react";
import {AbsoluteFill, Easing, random} from "remotion";
import {DEVA, SANS, SERIF} from "../fonts";
import {BOW, BOX, BROWN, COOL, Defs, Diya, DUSK, EASE, ELEPHANT, EMBER, Feather, GOLD, H, HORSE, IC, INK, Icon, INDIGO, Kin, LEAFGREEN,
  NIGHT, NightBG, NOTE, PAPER, PaperBG, POLE, SAFFRON, SEAL, SLATE2, SlateBG, Stroke, TEAL, TT, W, WHEEL, circ, flag, ip} from "../kit";

export type SceneProps = {f: number; T: TT};
const k = (b: string, i: number) => `${b}_${i}`;
// phase visibility: from cue i (minus lead) to cue j (exclusive), crossfading
export const phase = (f: number, T: TT, b: string, i: number, j?: number, lead = 8) => {
  const a = T.s(k(b, i)) - lead; const z = j === undefined ? T.beat(b).end * 30 + 30 : T.s(k(b, j)) - lead;
  return ip(f, a, a + 12) * ip(f, z, z + 12, 1, 0);
};

// Sanskrit label: IAST italic + English + citation. tone "ink" on paper, "light" on night/slate.
export const SL: React.FC<{f: number; T: TT; id: string; at: number; x: number; y: number; tone?: "ink" | "light"; size?: number;
  align?: "left" | "center" | "right"; w?: number; deva?: boolean; cite?: boolean; en?: boolean; bg?: boolean}> =
  ({f, T, id, at, x, y, tone = "ink", size = 30, align = "center", w = 700, deva, cite = true, en = true, bg}) => {
    const L = T.D.labels[id]; if (!L) throw new Error(`no label ${id}`);
    const main = tone === "ink" ? INK : PAPER, sub = tone === "ink" ? BROWN : GOLD;
    const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    const o = ip(f, at, at + 10);
    return (
      <div style={{position: "absolute", left, top: y, width: w, textAlign: align, opacity: o, transform: `translateY(${(1 - o) * 10}px)`,
        ...(bg ? {background: "rgba(7,8,28,0.82)", borderRadius: 14, padding: "10px 0 12px"} : {})}}>
        {deva && L.deva && <div style={{fontFamily: DEVA, fontSize: size * 1.5, color: main, lineHeight: 1.3}}>{L.deva}</div>}
        <div style={{fontFamily: SANS, fontStyle: "italic", fontSize: size, color: main, lineHeight: 1.25}}>{L.show}</div>
        {(en || cite) && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size * 0.56, letterSpacing: 3, color: sub, marginTop: 6, textTransform: "uppercase"}}>
          {en && L.en}{en && L.en && cite ? "  ·  " : ""}{cite && `Gita ${L.v}`}</div>}
      </div>
    );
  };

// ---------- open1: dawn over Kurukshetra
const Army: React.FC<{x0: number; x1: number; y: number; s: number; color: string; seed: string; f: number; dir: 1 | -1; elephants?: boolean}> =
  ({x0, x1, y, s, color, seed, f, dir, elephants = true}) => {
    const els: React.ReactNode[] = []; let i = 0;
    for (let x = x0; x < x1; x += 24 * s + random(`${seed}g${i}`) * 10 * s, i++) {
      const r = random(`${seed}${i}`); const yy = y + (random(`${seed}j${i}`) - 0.5) * 8 * s;
      if (elephants && r < 0.06 && s < 1.2) {
        els.push(<path key={`e${i}`} d={ELEPHANT} fill={color} transform={`translate(${x} ${yy - 40 * s}) scale(${s * 0.55 * dir} ${s * 0.55})`}/>); x += 60 * s; continue;
      }
      els.push(<rect key={`b${i}`} x={x - 5 * s} y={yy - 34 * s} width={10 * s} height={34 * s} rx={4 * s} fill={color}/>);
      els.push(<circle key={`h${i}`} cx={x} cy={yy - 40 * s} r={6 * s} fill={color}/>);
      els.push(<line key={`s${i}`} x1={x + 6 * s} y1={yy - 16 * s} x2={x + (8 + dir * 4) * s} y2={yy - (95 + r * 30) * s} stroke={color} strokeWidth={1.6 * s}/>);
      if (r > 0.86) {
        const top = yy - 150 * s, w = Math.sin(f / 8 + i) * 6 * s;
        els.push(<line key={`p${i}`} x1={x} y1={yy - 30 * s} x2={x} y2={top} stroke={color} strokeWidth={2 * s}/>);
        els.push(<path key={`f${i}`} d={`M ${x} ${top} Q ${x + dir * 22 * s} ${top + 8 * s + w} ${x + dir * 44 * s} ${top + 12 * s + w} Q ${x + dir * 22 * s} ${top + 18 * s + w} ${x} ${top + 26 * s} Z`} fill={color}/>);
      } else if (r > 0.8) {
        els.push(<path key={`u${i}`} d={`M ${x - 26 * s} ${yy - 120 * s} Q ${x} ${yy - 150 * s} ${x + 26 * s} ${yy - 120 * s} Z M ${x} ${yy - 120 * s} L ${x} ${yy - 40 * s}`} fill={color} stroke={color} strokeWidth={2 * s}/>);
      }
    }
    return <g>{els}</g>;
  };
const SmallChariot: React.FC<{f: number; shake: number; color: string; x?: number; y?: number; s?: number; seated?: number}> =
  ({f, shake, color, x = 960, y = 762, s = 0.34, seated = 0}) => {
    const jx = (random(`jx${f}`) - 0.5) * 3 * shake, jy = (random(`jy${f}`) - 0.5) * 2 * shake;
    return (
      <g transform={`translate(${x} ${y}) scale(${s}) translate(-900 -850)`}>
        {[0, 1].map((n) => <path key={n} d={HORSE} fill={color} transform={`translate(${1250 + n * 60} ${635 - n * 20})`}/>)}
        <path d={POLE} stroke={color} strokeWidth={12} fill="none"/>
        <path d={BOX} fill={color}/>
        <path d={WHEEL(700, 700, 150)} stroke={color} strokeWidth={14} fill="none"/>
        <path d="M 540 470 L 540 210" stroke={color} strokeWidth={10}/>
        <path d={flag(f)} fill={color}/>
        <g transform={`translate(${jx} ${jy + seated * 110})`}>
          <circle cx={640} cy={330} r={26} fill={color}/>
          <path d="M 640 356 L 626 480 L 656 480 Z" fill={color}/>
          {seated < 0.5 && <path d="M 600 200 C 660 260 660 420 600 480" stroke={color} strokeWidth={9} fill="none"/>}
        </g>
        <circle cx={890} cy={360} r={22} fill={color}/>
        <path d="M 890 380 L 876 480 L 904 480 Z" fill={color}/>
      </g>
    );
  };
export const Dawn: React.FC<SceneProps & {b?: string}> = ({f, T, b = "open1"}) => {
  const B = T.beat(b); const a = B.start * 30, z = B.end * 30;
  const cam = ip(f, a, z, 1, 1.32, Easing.inOut(Easing.quad));
  const sunY = ip(f, a, z, 700, 622), glow = ip(f, a, z, 0.45, 0.95);
  const shake = ip(f, T.at(k(b, 1), "hands begin to shake"), T.at(k(b, 1), "hands begin to shake") + 18);
  const sil = "#170f26";
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${NIGHT} 0%, ${DUSK} 45%, #b9634a 62%, #2a1b36 62.5%, #140d22 100%)`}}>
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: "960px 720px"}}>
        <svg width={W} height={H}>
          <Defs id="dawn"/>
          <circle cx={960} cy={sunY} r={240} fill={SAFFRON} opacity={glow * 0.5} filter="url(#glow-dawn)"/>
          <circle cx={960} cy={sunY} r={64} fill="#f9cf7a" opacity={0.95}/>
          <rect x={0} y={672} width={W} height={H} fill="#1d1430"/>
          <path d="M 0 676 C 200 640 360 660 520 644 C 700 628 820 660 960 650 C 1120 640 1260 626 1420 648 C 1600 668 1760 640 1920 652 L 1920 690 L 0 690 Z" fill="#2c1f3f"/>
          <Army x0={30} x1={800} y={700} s={0.7} color="#3a2a4c" seed="la" f={f} dir={1}/>
          <Army x0={1130} x1={1900} y={700} s={0.7} color="#3a2a4c" seed="ra" f={f} dir={-1}/>
          <Army x0={-20} x1={760} y={760} s={1.0} color="#271a37" seed="lb" f={f} dir={1}/>
          <Army x0={1170} x1={1960} y={760} s={1.0} color="#271a37" seed="rb" f={f} dir={-1}/>
          <SmallChariot f={f} shake={shake} color={sil}/>
          <Army x0={-60} x1={700} y={860} s={1.45} color={sil} seed="lc" f={f} dir={1}/>
          <Army x0={1230} x1={2000} y={860} s={1.45} color={sil} seed="rc" f={f} dir={-1}/>
          <rect x={0} y={860} width={W} height={300} fill={sil}/>
        </svg>
      </AbsoluteFill>
      <div style={{opacity: ip(f, a + 150, a + 170, 1, 0)}}><SL f={f} T={T} id="conch" at={a + 6} x={960} y={150} tone="light" size={26} deva/></div>
    </AbsoluteFill>
  );
};

// ---------- open2: the bow slips
export const bowLand = (T: TT) => T.at("open2_0", "slips") + 4 + 16;
export const BowSlips: React.FC<SceneProps> = ({f, T}) => {
  const fall = T.at("open2_0", "slips") + 4, land = fall + 16;
  const r = -ip(f, fall, land, 0, 74, Easing.in(Easing.quad)) + (f > land ? Math.exp(-(f - land) / 4) * Math.sin((f - land) / 1.6) * 4 : 0);
  const shake = f < fall ? (random(`bs${f}`) - 0.5) * 4 : 0;
  const quote = T.at("open2_0", "I will not fight");
  const dim = ip(f, quote - 6, quote + 6, 1, 0.32);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 78% 78%, ${EMBER} 0%, #7c3b43 30%, ${DUSK} 55%, ${NIGHT} 100%)`}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="bow"/>
        <g transform={`translate(1780 860) rotate(${r}) translate(${shake} -380)`}>
          <path d={BOW} stroke={SAFFRON} strokeWidth={22} fill="none" opacity={0.35} filter="url(#soft-bow)"/>
          <path d={BOW} stroke="#1a1020" strokeWidth={15} fill="none" strokeLinecap="round"/>
          <path d="M 6 -372 L 6 372" stroke="#e9d9b0" strokeWidth={2.4} opacity={0.8}/>
          <rect x={100} y={-44} width={26} height={88} rx={8} fill="#1a1020"/>
        </g>
        <rect x={0} y={860} width={W} height={220} fill="#140c1c"/>
        {Array.from({length: 24}).map((_, i) => <path key={i} d={`M ${i * 84} 872 l 42 -14 l 42 14`} stroke={EMBER} strokeWidth={2} fill="none" opacity={0.55}/>)}
        <rect x={0} y={856} width={W} height={4} fill={SAFFRON} opacity={0.5}/>
      </svg>
      <Kin f={f} at={T.s("open2_0")} x={150} y={250} size={70} color={PAPER}><span style={{opacity: dim}}>His mouth goes dry.</span></Kin>
      <Kin f={f} at={T.at("open2_0", "His bow")} x={150} y={345} size={70} color={PAPER}><span style={{opacity: dim}}>His bow slips from his hand.</span></Kin>
      <Kin f={f} at={quote} x={150} y={560} size={112} italic>“I will not fight.”</Kin>
      <Kin f={f} at={quote + 8} x={156} y={700} size={26} color={SAFFRON} font={SANS} weight={800}>
        <span style={{letterSpacing: 3}}>ARJUNA · GITA 2.9</span></Kin>
      <div style={{position: "absolute", left: 150, top: 790, fontFamily: SANS, fontSize: 22, letterSpacing: 2, color: PAPER,
        opacity: 0.55 * ip(f, T.s("open2_0") + 6, T.s("open2_0") + 18)}}>Bhagavad Gita 1.29–30 · 1.47 · 2.9</div>
    </AbsoluteFill>
  );
};

// ---------- open3: the reins, the feather, the smile
export const Reins: React.FC<SceneProps> = ({f, T}) => {
  const p = ip(f, T.s("open3_0"), T.s("open3_0") + 34, 0, 1, EASE);
  const who = T.at("open3_0", "Shri Krishna"); const smile = T.at("open3_0", "smiles");
  const sw = Math.sin(f / 22) * 10;
  const bloom = ip(f, smile, smile + 26, 0, 1, EASE);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 85% 30%, #a1563f 0%, ${DUSK} 38%, ${NIGHT} 100%)`}}>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 55% 45%, rgba(242,163,58,0.55) 0%, transparent 60%)", opacity: bloom}}/>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="reins"/>
        {[0, 1].map((n) => {
          const d = `M -60 ${930 + n * 40} C 500 ${760 + sw} 1200 ${520 + n * 50 - sw} 1990 ${350 + n * 90}`;
          return <g key={n}><Stroke d={d} p={p} color="#3a2214" w={15}/><Stroke d={d} p={p} color="#c98a3c" w={8} opacity={0.9 + 0.1 * bloom}/></g>;
        })}
        <Feather x={430} y={300} p={ip(f, who - 8, who + 16, 0, 1, EASE)} glint={bloom}/>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Meera (modern thread): ink line art on cool slate, a phone at 1:47
const Window: React.FC<{f: number; dawn?: number}> = ({f, dawn = 0}) => (
  <g>
    <rect x={1250} y={110} width={520} height={560} fill={dawn > 0 ? `rgba(255,190,120,${0.15 + 0.35 * dawn})` : "#0b1220"} stroke="#3b4a63" strokeWidth={6}/>
    <path d="M 1510 110 L 1510 670 M 1250 390 L 1770 390" stroke="#3b4a63" strokeWidth={5}/>
    <g opacity={1 - dawn}><Icon d={IC.moon} x={1660} y={210} s={0.9} color={COOL} w={2.5} fill={COOL} fillO={0.25}/></g>
    {Array.from({length: 14}).map((_, i) => <rect key={i} x={1270 + (i * 37) % 480} y={560 + (i * 13) % 90} width={8} height={12}
      fill="#ffd38a" opacity={(1 - dawn) * (0.3 + 0.4 * Math.abs(Math.sin(i + f / 90)))}/>)}
    <path d="M 1250 600 L 1300 560 L 1340 590 L 1400 540 L 1460 585 L 1520 550 L 1580 590 L 1650 545 L 1770 590 L 1770 670 L 1250 670 Z" fill="#0f1828" opacity={0.9}/>
  </g>
);
const Phone: React.FC<{f: number; x: number; y: number; shake: number; children?: React.ReactNode; glow?: number; down?: boolean}> =
  ({f, x, y, shake, children, glow = 1, down}) => {
    const jx = (random(`px${Math.floor(f / 2)}`) - 0.5) * 5 * shake, jy = (random(`py${Math.floor(f / 2)}`) - 0.5) * 4 * shake;
    return (
      <div style={{position: "absolute", left: x + jx, top: y + jy, width: 380, height: 700, borderRadius: 46, background: down ? "#1b222e" : "#0d1118",
        border: "5px solid #3a4558", boxShadow: down ? "0 10px 30px rgba(0,0,0,0.5)" : `0 0 ${80 * glow}px rgba(140,190,255,${0.25 * glow})`, overflow: "hidden"}}>
        {!down && <div style={{position: "absolute", top: 16, left: 150, width: 80, height: 22, borderRadius: 11, background: "#000"}}/>}
        {children}
      </div>
    );
  };
const Mail: React.FC<{f: number; at: number; y: number; title: string; sub: string; tag: string; tagColor: string}> = ({f, at, y, title, sub, tag, tagColor}) => (
  <div style={{position: "absolute", left: 18, top: y, width: 334, padding: "14px 16px", borderRadius: 18, background: "rgba(255,255,255,0.1)",
    opacity: ip(f, at, at + 8), transform: `translateY(${ip(f, at, at + 12, 16, 0, EASE)}px)`}}>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, color: "#eef3fb"}}>{title}</div>
    <div style={{fontFamily: SANS, fontSize: 17, color: "#b7c3d6", marginTop: 4}}>{sub}</div>
    <div style={{display: "inline-block", marginTop: 10, padding: "3px 10px", borderRadius: 8, background: tagColor, fontFamily: SANS, fontWeight: 800,
      fontSize: 13, letterSpacing: 2, color: "#0d1118"}}>{tag}</div>
  </div>
);
const Lamp: React.FC<{x: number; glow: number}> = ({x, glow}) => (
  <g>
    <defs><radialGradient id={`cone${x}`} cx="50%" cy="0%" r="100%"><stop offset="0" stopColor="#ffd9a0" stopOpacity={0.38 * glow}/><stop offset="1" stopColor="#ffd9a0" stopOpacity={0}/></radialGradient></defs>
    <path d={`M ${x + 70} 498 L ${x - 120} 790 L ${x + 330} 790 L ${x + 170} 498 Z`} fill={`url(#cone${x})`}/>
    <ellipse cx={x} cy={786} rx={70} ry={10} fill="#2a3447" stroke="#56667f" strokeWidth={3}/>
    <path d={`M ${x} 780 L ${x + 20} 610 L ${x + 110} 470`} stroke="#56667f" strokeWidth={7} fill="none" strokeLinecap="round"/>
    <circle cx={x + 20} cy={610} r={8} fill="#56667f"/>
    <path d={`M ${x + 60} 470 L ${x + 180} 440 L ${x + 200} 500 L ${x + 50} 520 Z`} fill="#3a4a63" stroke="#6b7c96" strokeWidth={3}/>
    <ellipse cx={x + 122} cy={506} rx={70} ry={10} fill="#ffe2b0" opacity={0.6 * glow}/>
  </g>
);
export const Meera1: React.FC<SceneProps> = ({f, T}) => {
  const c = "meera1_0"; const a = T.s(c);
  const shake = ip(f, T.at(c, "hands are shaking"), T.at(c, "hands are shaking") + 10);
  return (
    <SlateBG f={f} id="m1">
      <svg width={W} height={H} style={{position: "absolute"}}><Window f={f}/>
        <path d="M 0 790 L 1920 790" stroke="#3b4a63" strokeWidth={4}/>
        <Lamp x={300} glow={0.8}/>
      </svg>
      <Phone f={f} x={770} y={70} shake={shake}>
        <div style={{position: "absolute", top: 80, width: 380, textAlign: "center", fontFamily: SANS, fontWeight: 300, fontSize: 112, color: "#eef3fb",
          letterSpacing: -2, opacity: ip(f, a, a + 10)}}>1:47</div>
        <div style={{position: "absolute", top: 220, width: 380, textAlign: "center", fontFamily: SANS, fontSize: 20, color: "#b7c3d6"}}>2 new emails</div>
        <Mail f={f} at={T.at(c, "One is the safe")} y={290} title="Offer letter: full-time role" sub="Family group · 23 new messages" tag="SAFE" tagColor="#b7c3d6"/>
        <Mail f={f} at={T.at(c, "The other is")} y={440} title="Your application: accepted" sub="The path she actually wants" tag="HERS" tagColor={SAFFRON}/>
        <div style={{position: "absolute", top: 610, width: 380, textAlign: "center", fontFamily: SANS, fontSize: 17, color: "#8b98ad",
          opacity: ip(f, T.at(c, "reply by morning"), T.at(c, "reply by morning") + 10)}}>Reply by 9:00 a.m.</div>
      </Phone>
      <div style={{position: "absolute", left: 60, top: 820, fontFamily: SANS, fontSize: 18, letterSpacing: 1, color: "#8b98ad", opacity: ip(f, a + 10, a + 24)}}>
        Meera is an illustration, not a real person.</div>
    </SlateBG>
  );
};
export const Meera2: React.FC<SceneProps> = ({f, T}) => {
  const c = "meera2_0"; const a = T.s(c);
  const flick = ip(f, a, T.at(c, "for the first time"), 1, 0);
  const lamp = 0.85 + 0.15 * Math.sin(f / 1.7) * flick;
  return (
    <SlateBG f={f} id="m2" warm={0.25 * lamp}>
      <svg width={W} height={H} style={{position: "absolute"}}><Window f={f}/>
        <path d="M 0 790 L 1920 790" stroke="#3b4a63" strokeWidth={4}/>
        <Lamp x={420} glow={lamp}/>
        <g transform={`translate(860 ${ip(f, a, a + 20, 700, 742, EASE)}) rotate(${ip(f, a, a + 20, -18, 0, EASE)})`}>
          <rect x={0} y={0} width={340} height={40} rx={14} fill="#1b222e" stroke="#3a4558" strokeWidth={4}/>
          <rect x={250} y={10} width={60} height={20} rx={8} fill="#2a3242"/>
        </g>
      </svg>
    </SlateBG>
  );
};

// ---------- title: the Gita inside the Mahabharata's sixth book
export const Title: React.FC<SceneProps> = ({f, T}) => {
  const c = "title_0"; const a = T.s(c);
  const v = T.at(c, "seven hundred"), ch = T.at(c, "eighteen chapters"), bk = T.at(c, "sixth book");
  const x0 = 492;
  return (
    <NightBG f={f} id="title">
      <div style={{position: "absolute", top: 140, width: W, textAlign: "center", fontFamily: DEVA, fontSize: 74, color: GOLD, opacity: ip(f, a, a + 14)}}>श्रीमद्भगवद्गीता</div>
      <div style={{position: "absolute", top: 240, width: W, textAlign: "center", fontFamily: SERIF, fontSize: 132, color: PAPER,
        opacity: ip(f, a + 6, a + 20), transform: `translateY(${ip(f, a + 6, a + 22, 16, 0, EASE)}px)`}}>The Bhagavad Gita</div>
      <div style={{position: "absolute", top: 430, width: W, display: "flex", justifyContent: "center", gap: 90, fontFamily: SANS}}>
        {[["700", "verses*", v], ["18", "chapters", ch], ["6 of 18", "books of the Mahabharata", bk]].map(([n, l, t], i) => (
          <div key={i} style={{textAlign: "center", opacity: ip(f, t as number, (t as number) + 10)}}>
            <div style={{fontFamily: SERIF, fontSize: 64, color: SAFFRON}}>{n}</div>
            <div style={{fontWeight: 700, fontSize: 18, letterSpacing: 4, color: PAPER, opacity: 0.7, textTransform: "uppercase"}}>{l}</div>
          </div>))}
      </div>
      <svg width={W} height={H} style={{position: "absolute"}}>
        {Array.from({length: 18}).map((_, i) => {
          const sel = i === 5; const lift = sel ? ip(f, bk + 6, bk + 24, 0, -40, EASE) : 0;
          const o = ip(f, bk - 10 + i * 1.5, bk + i * 1.5);
          return <g key={i} opacity={o}>
            <rect x={x0 + i * 52} y={700 + lift} width={44} height={120} rx={4} fill={sel ? SAFFRON : ["#2b3160", "#3a2c52", "#4a3a2a"][i % 3]}
              stroke={sel ? "#ffe0a3" : "#56608f"} strokeWidth={1.5}/>
            <path d={`M ${x0 + i * 52 + 8} ${722 + lift} L ${x0 + i * 52 + 36} ${722 + lift} M ${x0 + i * 52 + 8} ${798 + lift} L ${x0 + i * 52 + 36} ${798 + lift}`} stroke={sel ? NIGHT : "#8a93c2"} strokeWidth={1.5} opacity={0.6}/>
          </g>;
        })}
        <path d={`M ${x0 - 20} 822 L ${x0 + 18 * 52 + 12} 822`} stroke={GOLD} strokeWidth={3} opacity={ip(f, bk - 10, bk)}/>
      </svg>
      <div style={{position: "absolute", left: x0 + 5 * 52 - 128, top: 578, width: 300, textAlign: "center", opacity: ip(f, bk + 16, bk + 28)}}>
        <div style={{fontFamily: DEVA, fontSize: 30, color: PAPER, lineHeight: 1.1}}>भीष्मपर्व <span style={{fontFamily: SANS, fontStyle: "italic", fontSize: 19, color: GOLD}}>bhīṣma-parva</span></div>
      </div>
      <div style={{position: "absolute", left: 0, top: 846, width: W, textAlign: "center", fontFamily: SANS, fontSize: 17, color: PAPER, opacity: 0.5 * ip(f, v, v + 10)}}>
        * 700 in most editions. Ours has 701: it counts Arjuna's opening question in chapter 13 as a verse.</div>
    </NightBG>
  );
};
export const Map: React.FC<SceneProps> = ({f}) => <NightBG f={f} id="map"/>;

// ---------- chapter 1: what Arjuna sees across the field (1.26)
export const Ch1: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch1"; const s1 = T.s(k(b, 1)), brk = T.at(k(b, 1), "And he breaks");
  const ids = ["acaryan", "pitamahan", "bhratrn", "sakhin", "pitrn", "matulan", "putran", "pautran"];
  const shake = ip(f, brk, brk + 10);
  return (
    <NightBG f={f} id="c1" glow="70% 70%">
      <svg width={W} height={H} style={{position: "absolute"}}>
        <rect x={0} y={700} width={W} height={400} fill="#120d22"/>
        <g transform={`translate(${(random(`c1x${f}`) - 0.5) * 4 * shake} 0)`}>
          <Army x0={980} x1={1960} y={740} s={1.2} color="#2a1f3f" seed="c1a" f={f} dir={-1} elephants={false}/>
          <Army x0={1040} x1={1960} y={690} s={0.8} color="#3a2a52" seed="c1b" f={f} dir={-1}/>
        </g>
        <SmallChariot f={f} shake={shake} color="#0b0816" x={420} y={860} s={0.62} seated={ip(f, brk, brk + 30)}/>
      </svg>
      {ids.map((id, i) => {
        const t = s1 + 10 + i * Math.max(4, (brk - s1 - 20) / 8);
        const x = 1080 + (i % 4) * 200, y = 230 + Math.floor(i / 4) * 150;
        return <div key={id} style={{opacity: ip(f, brk + 30, brk + 60, 1, 0.45)}}>
          <SL f={f} T={T} id={id} at={t} x={x} y={y} tone="light" size={28} w={200} cite={false}/></div>;
      })}
      <div style={{position: "absolute", left: 1080, top: 520, width: 800, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 15,
        letterSpacing: 3, color: GOLD, opacity: 0.8 * ip(f, s1 + 20, s1 + 34)}}>WHAT ARJUNA SAW · GITA 1.26</div>
    </NightBG>
  );
};

// ---------- chapter 2: surrender, the self, the arrow, the steady mind
export const Ch2: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch2";
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2, 3), p3 = phase(f, T, b, 3, 4), p4 = phase(f, T, b, 4, 5), p5 = phase(f, T, b, 5);
  const c2 = k(b, 2); const nb = T.at(c2, "never born"), off = T.at(c2, "throw off"), on = T.at(c2, "put on new");
  const fly = T.at(k(b, 3), "most famous");
  const ax = ip(f, fly, fly + 26, 0, 1, Easing.in(Easing.quad));
  return (
    <PaperBG id="c2">
      <AbsoluteFill style={{opacity: p1}}>
        <SL f={f} T={T} id="shishya" at={T.s(k(b, 1)) + 4} x={960} y={250} size={40} w={1500} en={false} cite={false}/>
        <Kin f={f} at={T.at(k(b, 1), "I am your")} x={960} y={360} size={76} italic color={INK} align="center" w={1600}>
          “{T.D.labels.shishya.en}.”</Kin>
        <Kin f={f} at={T.at(k(b, 1), "I am your") + 8} x={960} y={560} size={24} color={SEAL} align="center" font={SANS} weight={800}>
          <span style={{letterSpacing: 4}}>ARJUNA · GITA 2.7</span></Kin>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c2"/>
          <g filter="url(#ink-c2)">
            <Stroke d={`${circ(620, 250, 58)} M 470 820 C 470 560 520 380 620 380 C 720 380 770 560 770 820`} p={ip(f, T.s(c2), T.s(c2) + 30)} w={5}/>
            <g opacity={ip(f, off, off + 24, 1, 0)} transform={`translate(0 ${ip(f, off, off + 30, 0, 160, Easing.in(Easing.quad))})`}>
              <path d="M 500 420 C 560 470 680 470 740 420 L 760 700 C 690 730 560 730 480 700 Z" fill={BROWN} opacity={0.22 * ip(f, T.s(c2) + 16, T.s(c2) + 26)}/>
              <Stroke d="M 500 420 C 560 470 680 470 740 420 L 760 700 C 690 730 560 730 480 700 Z M 490 700 L 486 730 M 520 708 L 518 744 M 560 712 L 556 740 M 700 712 L 704 742 M 740 704 L 746 736" p={ip(f, T.s(c2), T.s(c2) + 24)} color={BROWN} w={4}/>
            </g>
            <path d="M 500 420 C 560 470 680 470 740 420 L 760 700 C 690 730 560 730 480 700 Z" fill={SEAL} opacity={0.22 * ip(f, on + 22, on + 34)}/>
            <Stroke d="M 500 420 C 560 470 680 470 740 420 L 760 700 C 690 730 560 730 480 700 Z" p={ip(f, on, on + 30)} color={SEAL} w={5}/>
          </g>
          <circle cx={620} cy={500} r={46} fill={SAFFRON} opacity={0.3 * ip(f, nb, nb + 14)} filter="url(#glow-c2)"/>
        </svg>
        <svg width={W} height={H} style={{position: "absolute"}}><Defs id="c2d"/><Diya x={620} y={530} s={0.6} f={f} p={ip(f, nb, nb + 14)} id="c2d"/></svg>
        <SL f={f} T={T} id="najayate" at={nb} x={1340} y={300} size={34} w={900}/>
        <SL f={f} T={T} id="vasamsi" at={off} x={1340} y={520} size={34} w={900}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: Math.max(p3, p4)}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <g transform="translate(420 470) scale(0.62)">
            <path d={BOW} stroke={INK} strokeWidth={12} fill="none"/>
            <path d={`M 6 -372 L ${6 - 60 * (1 - ax)} 0 L 6 372`} stroke={BROWN} strokeWidth={3} fill="none"/>
          </g>
          <g transform={`translate(${380 + ax * (p4 > 0.5 ? 760 : 1700)} 470)`}>
            <path d="M -40 0 L 220 0 M 200 -14 L 228 0 L 200 14 M -40 0 L -58 -14 M -40 0 L -58 14 M -26 0 L -44 -14 M -26 0 L -44 14" stroke={INK} strokeWidth={5} fill="none"/>
            {ax > 0.05 && <path d="M -120 -20 L -60 -20 M -150 0 L -70 0 M -120 20 L -60 20" stroke={BROWN} strokeWidth={3} opacity={0.5}/>}
          </g>
          <g opacity={p4}>
            {[90, 66, 42, 18].map((r, i) => <circle key={i} cx={1680} cy={470} r={r} fill="none" stroke={SEAL} strokeWidth={4} strokeDasharray="10 10" opacity={0.45}/>)}
          </g>
        </svg>
        <div style={{position: "absolute", left: 300, top: 760, width: 260, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: INK, opacity: p4}}>ACTION</div>
        <div style={{position: "absolute", left: 1560, top: 600, width: 240, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: SEAL, opacity: p4 * 0.8}}>FRUIT</div>
        <div style={{position: "absolute", left: 300, top: 800, width: 260, textAlign: "center", fontFamily: SANS, fontSize: 18, letterSpacing: 2, color: BROWN, opacity: p4}}>yours</div>
        <div style={{position: "absolute", left: 1560, top: 640, width: 240, textAlign: "center", fontFamily: SANS, fontSize: 18, letterSpacing: 2, color: BROWN, opacity: p4}}>not yours to hold</div>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p5}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <g filter="url(#ink-c2)">
            <Stroke d="M 200 560 L 1720 560" p={ip(f, T.s(k(b, 5)), T.s(k(b, 5)) + 30)} w={3}/>
            <Stroke d="M 520 560 L 760 300 L 860 400 L 980 250 L 1240 560" p={ip(f, T.s(k(b, 5)) + 8, T.s(k(b, 5)) + 40)} w={4}/>
            <Stroke d="M 520 560 L 760 820 L 860 720 L 980 870 L 1240 560" p={ip(f, T.s(k(b, 5)) + 20, T.s(k(b, 5)) + 52)} w={3} color={BROWN} opacity={0.45}/>
            {[600, 640, 690].map((y, i) => <Stroke key={i} d={`M ${360 + i * 40} ${y} L ${700 - i * 30} ${y} M ${1100 + i * 30} ${y} L ${1500 - i * 40} ${y}`} p={ip(f, T.s(k(b, 5)) + 30, T.s(k(b, 5)) + 50)} w={2} color={BROWN} opacity={0.4}/>)}
          </g>
        </svg>
        <SL f={f} T={T} id="sthita" at={T.s(k(b, 5)) + 16} x={960} y={140} size={40} w={900}/>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 3: offering, example, your own path
const Fig: React.FC<{x: number; y: number; s?: number; arm?: number; color?: string; p?: number}> = ({x, y, s = 1, arm = 0, color = INK, p = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={p}>
    <circle cx={0} cy={-150} r={24} fill="none" stroke={color} strokeWidth={5}/>
    <path d="M 0 -124 L 0 -40 M 0 -40 L -26 40 M 0 -40 L 26 40" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round"/>
    <path d={`M 0 -106 L -40 -70 M 0 -106 L ${40 * Math.cos(-arm * 2.2)} ${-106 + 40 * Math.sin(-arm * 2.2) + 36 * (1 - arm)}`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round"/>
  </g>
);
export const Ch3: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch3"; const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2, 3), p3 = phase(f, T, b, 3);
  const off = T.at(k(b, 1), "act as an offering"); const lead = T.at(k(b, 2), "Whatever the best");
  const scroll = (f - T.s(k(b, 3))) * 3;
  return (
    <PaperBG id="c3">
      <AbsoluteFill style={{opacity: p1}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c3"/>
          <g filter="url(#ink-c3)">
            <Stroke d="M 660 600 L 1260 600 L 1220 650 L 1170 650 L 1135 700 L 1085 700 L 1055 760 L 865 760 L 835 700 L 785 700 L 750 650 L 700 650 Z M 700 650 L 1220 650 M 785 700 L 1135 700" p={ip(f, T.s(k(b, 1)), T.s(k(b, 1)) + 40)} w={4.5}/>
          </g>
          <g opacity={ip(f, T.s(k(b, 1)) + 30, T.s(k(b, 1)) + 44)}>
            <circle cx={960} cy={470} r={150} fill={SAFFRON} opacity={0.12 + 0.18 * ip(f, off - 20, off)} filter="url(#glow-c3)"/>
            <g transform={`translate(960 ${600}) scale(${(1.1 + 1.2 * ip(f, off - 20, off)) * (1 + 0.04 * Math.sin(f / 4))} ${(1.3 + 1.3 * ip(f, off - 20, off)) * (1 + 0.05 * Math.sin(f / 3))}) translate(-50 -88)`}>
              <path d={IC.fire} fill={SAFFRON} stroke={EMBER} strokeWidth={1.5}/>
            </g>
          </g>
        </svg>
        <SL f={f} T={T} id="yajna" at={off} x={960} y={150} size={38} w={1000}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Fig x={560} y={720} s={1.5} arm={ip(f, lead, lead + 12)} color={SEAL}/>
          {[0, 1, 2, 3, 4].map((i) => <Fig key={i} x={880 + i * 190} y={720} s={1.05} arm={ip(f, lead + 16 + i * 7, lead + 28 + i * 7)} color={INK} p={ip(f, T.s(k(b, 2)), T.s(k(b, 2)) + 12)}/>)}
          <path d="M 300 790 L 1820 790" stroke={BROWN} strokeWidth={2} opacity={0.4}/>
        </svg>
        <SL f={f} T={T} id="yadyad" at={lead} x={960} y={150} size={38} w={1500}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p3}}>
        <div style={{position: "absolute", left: 260, top: 150, width: 520, height: 620, overflow: "hidden", borderRadius: 26,
          border: `3px solid ${BROWN}`, background: "rgba(43,33,24,0.05)"}}>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} style={{position: "absolute", left: 24, top: 24 + i * 250 - (scroll % 500), width: 472, height: 226, borderRadius: 16,
              background: `linear-gradient(135deg, ${["#f2b6a0", "#a6c8e6", "#f0d48a", "#b9e0b0"][i % 4]}, #fff8ea)`, opacity: 0.85}}>
              <div style={{position: "absolute", left: 16, bottom: 14, fontFamily: SANS, fontWeight: 700, fontSize: 18, color: INK}}>♥ {(i * 37 + 12) % 97}k</div>
            </div>))}
        </div>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Stroke d="M 1340 820 C 1300 700 1440 640 1400 520 C 1360 400 1480 340 1460 200" p={ip(f, T.s(k(b, 3)) + 10, T.s(k(b, 3)) + 50)} color={SEAL} w={7}/>
          {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={1345 + (i % 2) * 70 + Math.sin(i) * 20} cy={780 - i * 105} rx={12} ry={20} fill={SAFFRON}
            opacity={ip(f, T.s(k(b, 3)) + 30 + i * 6, T.s(k(b, 3)) + 40 + i * 6) * 0.8}/>)}
        </svg>
        <SL f={f} T={T} id="paradharma" at={T.s(k(b, 3)) + 6} x={520} y={800} size={30} w={600}/>
        <SL f={f} T={T} id="svadharma" at={T.s(k(b, 3)) + 30} x={1420} y={800} size={30} w={600}/>
      </AbsoluteFill>
    </PaperBG>
  );
};

// ---------- chapter 4: the lineage, the promise, the fire of knowledge
export const Ch4: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch4"; const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const c1 = k(b, 1); const tV = T.at(c1, "Vivasvan"), tM = T.at(c1, "Manu"), tI = T.at(c1, "Ikshvaku");
  const pts = [[260, 430], [700, 430], [1130, 430], [1560, 430]];
  const flameAt = (f < tM ? ip(f, tV - 10, tV, 0, 1) : f < tI ? 1 + ip(f, tM - 10, tM) : 2 + ip(f, tI - 10, tI));
  const seg = Math.min(2.999, flameAt); const si = Math.floor(seg); const tt = seg - si;
  const fx = pts[si][0] + (pts[si + 1][0] - pts[si][0]) * tt, fy = 270 - Math.sin(tt * Math.PI) * 60;
  const c2 = k(b, 2); const bow = T.s(c2), fire = T.at(c2, "blazing fire"), ash = T.at(c2, "to ash");
  return (
    <NightBG f={f} id="c4">
      <AbsoluteFill style={{opacity: p1}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c4"/>
          <Feather x={260} y={400} scale={0.38} rot={10} p={ip(f, T.s(c1), T.s(c1) + 14)}/>
          {pts.slice(1).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={110} fill="none" stroke={GOLD} strokeWidth={2.5} opacity={ip(f, [tV, tM, tI][i] - 14, [tV, tM, tI][i])}/>)}
          <Icon d={IC.sun} x={700} y={430} s={1.5} color={SAFFRON} w={4} p={ip(f, tV - 10, tV + 14)}/>
          <Icon d={IC.person} x={1130} y={436} s={1.4} color={PAPER} w={3.5} p={ip(f, tM - 10, tM + 14)}/>
          <Icon d={IC.person} x={1560} y={436} s={1.4} color={PAPER} w={3.5} p={ip(f, tI - 10, tI + 14)}/>
          <path d="M 1528 380 L 1536 356 L 1548 372 L 1560 350 L 1572 372 L 1584 356 L 1592 380 Z" fill={GOLD} opacity={ip(f, tI, tI + 10)}/>
          {pts.slice(0, 3).map(([x], i) => <path key={i} d={`M ${x} 270 Q ${(x + pts[i + 1][0]) / 2} 150 ${pts[i + 1][0]} 270`} stroke={GOLD}
            strokeWidth={1.5} strokeDasharray="6 8" fill="none" opacity={0.5 * ip(f, [tV, tM, tI][i] - 14, [tV, tM, tI][i])}/>)}
          {flameAt > 0 && <g transform={`translate(${fx} ${fy}) scale(0.55) translate(-50 -86)`}><path d={IC.fire} fill={SAFFRON} opacity={0.95}/></g>}
        </svg>
        <SL f={f} T={T} id="vivasvan" at={tV} x={700} y={570} tone="light" size={30} w={360} cite={false}/>
        <SL f={f} T={T} id="manu" at={tM} x={1130} y={570} tone="light" size={30} w={360} cite={false}/>
        <SL f={f} T={T} id="ikshvaku" at={tI} x={1560} y={570} tone="light" size={30} w={420} cite={false}/>
        <div style={{position: "absolute", top: 120, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 16, letterSpacing: 4, color: GOLD,
          opacity: 0.85 * ip(f, tV, tV + 12)}}>THE LINEAGE OF THIS YOGA · GITA 4.1</div>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c4b"/>
          {["bow", "ask", "serve"].map((l, i) => {
            const t = T.at(c2, ["Bow down", "ask questions", "serve"][i]);
            return <g key={l} opacity={ip(f, t - 4, t + 8)} transform={`translate(${280 + i * 210} 300)`}>
              <circle cx={0} cy={0} r={78} fill="none" stroke={GOLD} strokeWidth={2}/>
              {i === 0 && <path d="M -10 -40 a 12 12 0 1 0 0.1 0 M -6 -26 C 10 -10 30 -4 36 10 M 4 -14 L -20 40 M -20 40 L -40 44" stroke={PAPER} strokeWidth={4} fill="none" strokeLinecap="round"/>}
              {i === 1 && <text x={0} y={30} textAnchor="middle" fontFamily={SERIF} fontSize={90} fill={PAPER}>?</text>}
              {i === 2 && <g transform="translate(-40 -44) scale(0.8)"><path d={IC.kalash} stroke={PAPER} strokeWidth={4} fill="none"/></g>}
              <text x={0} y={120} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} letterSpacing={4} fill={PAPER} opacity={0.75}>{l.toUpperCase()}</text>
            </g>;
          })}
          <g transform="translate(1380 560)">
            {[[-110, 20, 12], [-90, -6, -14], [-100, 10, 0]].map(([x, y, r], i) => (
              <rect key={i} x={x} y={y} width={220} height={34} rx={17} transform={`rotate(${r})`} fill={i === 2 ? "#6b3f1e" : "#7a4a24"}
                opacity={ip(f, ash, ash + 30, 1, 0)}/>))}
            {Array.from({length: 40}).map((_, i) => <circle key={i} cx={(random(`ash${i}`) - 0.5) * 240} cy={30 + random(`ashy${i}`) * 20} r={2 + random(`ashr${i}`) * 3}
              fill="#9a9a9a" opacity={ip(f, ash + 10, ash + 30) * 0.8}/>)}
            <circle cx={0} cy={-80} r={140} fill={SAFFRON} opacity={0.3 * ip(f, fire, fire + 12) * ip(f, ash + 20, ash + 40, 1, 0.3)} filter="url(#glow-c4b)"/>
            <g opacity={ip(f, fire, fire + 10) * ip(f, ash + 20, ash + 40, 1, 0)} transform={`scale(${2.4 + 0.1 * Math.sin(f / 3)} ${2.8 + 0.15 * Math.sin(f / 2.4)}) translate(-50 -86)`}>
              <path d={IC.fire} fill={SAFFRON} stroke={EMBER} strokeWidth={1}/></g>
          </g>
        </svg>
        <SL f={f} T={T} id="pranipata" at={bow} x={490} y={470} tone="light" size={28} w={700}/>
        <SL f={f} T={T} id="jnanagni" at={fire} x={1380} y={680} tone="light" size={28} w={760}/>
      </AbsoluteFill>
    </NightBG>
  );
};

// ---------- chapter 5: the lotus leaf, and the same light in all
export const Ch5: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch5"; const c1 = k(b, 1); const lotus = T.at(c1, "Picture a lotus");
  const p1 = phase(f, T, b, 1, 2), p2 = phase(f, T, b, 2);
  const roll = ip(f, lotus + 10, lotus + 70, 0, 1, Easing.inOut(Easing.quad));
  const dx = 640 + roll * 760, dy = 520 + Math.sin(roll * Math.PI) * -30 + (roll > 0.92 ? (roll - 0.92) * 900 : 0);
  const c2 = k(b, 2); const ids = ["scholar", "cow", "elephant", "dog", "person"]; const words = ["scholar", "cow", "an elephant", "a dog", "the person"];
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #134048 0%, #0a1f2a 60%, ${NIGHT} 100%)`}}>
      <AbsoluteFill style={{opacity: p1 * ip(f, lotus - 14, lotus)}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c5"/>
          {[0, 1, 2].map((i) => <ellipse key={i} cx={960} cy={560} rx={560 + i * 140 + ((f / 2) % 140)} ry={130 + i * 34} fill="none" stroke={COOL} strokeWidth={1.2} opacity={0.12}/>)}
          <defs><radialGradient id="lg" cx="45%" cy="40%"><stop offset="0" stopColor="#7fb05a"/><stop offset="1" stopColor="#3f7030"/></radialGradient></defs>
          <path d="M 960 540 L 1400 520 C 1380 640 1150 700 960 700 C 700 700 520 640 520 560 C 520 470 720 420 960 420 C 1180 420 1370 450 1400 520 Z" fill="url(#lg)"/>
          {Array.from({length: 14}).map((_, i) => { const a = Math.PI * (0.05 + (i / 13) * 1.9); return <path key={i} d={`M 960 545 L ${960 + Math.cos(a) * 420} ${545 + Math.sin(a) * 130}`} stroke="#a6d082" strokeWidth={1.6} opacity={0.5}/>; })}
          <g transform="translate(1560 470)">
            {[-40, -20, 0, 20, 40].map((r, i) => <path key={i} d="M 0 60 C -30 20 -26 -40 0 -70 C 26 -40 30 20 0 60 Z" fill={["#e8a3b8", "#f0b9c8", "#f6c7d3", "#f0b9c8", "#e8a3b8"][i]} stroke="#c97a92" strokeWidth={1.5} transform={`rotate(${r} 0 60)`}/>)}
          </g>
          <g transform={`translate(${dx} ${dy})`} opacity={roll < 1 ? 1 : 0}>
            <ellipse cx={0} cy={0} rx={26} ry={22} fill="#dfeffc" opacity={0.9}/>
            <ellipse cx={-8} cy={-8} rx={7} ry={5} fill="#fff"/>
            <ellipse cx={0} cy={22} rx={24} ry={5} fill="#000" opacity={0.2}/>
          </g>
        </svg>
        <SL f={f} T={T} id="padma" at={lotus} x={960} y={150} tone="light" size={36} w={1000}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c5b"/>
          {ids.map((id, i) => {
            const t = T.at(c2, words[i]); const x = 320 + i * 320;
            return <g key={id}>
              <Icon d={(IC as any)[id]} x={x} y={560} s={2.2} color={PAPER} w={3.5} p={ip(f, t - 6, t + 16)}/>
              <Diya x={x} y={420} s={0.45} f={f + i * 7} p={ip(f, T.at(c2, "same self") + i * 4, T.at(c2, "same self") + 12 + i * 4)} id="c5b"/>
            </g>;
          })}
        </svg>
        <SL f={f} T={T} id="samadarshi" at={T.at(c2, "same self")} x={960} y={160} tone="light" size={38} w={1000}/>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- chapter 6: balance, the wind, the lamp that does not flicker
const Scale: React.FC<{x: number; y: number; tilt: number; left: React.ReactNode; right: React.ReactNode; p: number}> = ({x, y, tilt, left, right, p}) => (
  <g transform={`translate(${x} ${y})`} opacity={p}>
    <path d="M 0 0 L 0 260 M -80 260 L 80 260" stroke={PAPER} strokeWidth={5}/>
    <circle cx={0} cy={0} r={9} fill={GOLD}/>
    <g transform={`rotate(${tilt})`}>
      <path d="M -200 0 L 200 0" stroke={PAPER} strokeWidth={5}/>
      {[-200, 200].map((px, i) => <g key={i} transform={`translate(${px} 0) rotate(${-tilt})`}>
        <path d="M 0 0 L -60 110 M 0 0 L 60 110 M -80 110 Q 0 150 80 110 Z" stroke={PAPER} strokeWidth={3} fill="rgba(242,232,208,0.08)"/>
        <g transform="translate(0 92)">{i ? right : left}</g>
      </g>)}
    </g>
  </g>
);
export const Ch6: React.FC<SceneProps> = ({f, T}) => {
  const b = "ch6"; const p2 = phase(f, T, b, 2, 3), p3 = phase(f, T, b, 3);
  const c2 = k(b, 2); const bal = T.at(c2, "It is balance"); const tilt = 16 * Math.sin(f / 9) * ip(f, bal, bal + 20, 1, 0);
  const c3 = k(b, 3); const wind = T.at(c3, "restless"), prac = T.at(c3, "By practice"), go = T.at(c3, "letting go"), still = T.at(c3, "windless");
  const calm = ip(f, prac, still, 0, 1);
  const bowl = (n: number) => <g>{Array.from({length: n}).map((_, i) => <path key={i} d={`M ${-30 + i * 22 - (n - 1) * 0} ${-i * 14} q 18 18 36 0 z`} fill={GOLD} opacity={0.9} transform={`translate(${-(n - 1) * 6} 0)`}/>)}</g>;
  const moon = (n: number) => <g>{Array.from({length: n}).map((_, i) => <path key={i} d="M 6 -18 A 16 16 0 1 0 16 10 A 13 13 0 1 1 6 -18 Z" fill={COOL} transform={`translate(${-14 + i * 22} ${-i * 6})`}/>)}</g>;
  return (
    <NightBG f={f} id="c6">
      <AbsoluteFill style={{opacity: p2}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Scale x={560} y={300} tilt={tilt} left={bowl(3)} right={bowl(1)} p={ip(f, T.s(c2), T.s(c2) + 14)}/>
          <Scale x={1360} y={300} tilt={-tilt * 0.8} left={moon(3)} right={moon(1)} p={ip(f, T.at(c2, "sleeps"), T.at(c2, "sleeps") + 14)}/>
        </svg>
        <div style={{position: "absolute", left: 360, top: 600, width: 400, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: 5, color: PAPER, opacity: 0.7 * ip(f, T.s(c2) + 10, T.s(c2) + 22)}}>FOOD</div>
        <div style={{position: "absolute", left: 1160, top: 600, width: 400, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: 5, color: PAPER, opacity: 0.7 * ip(f, T.at(c2, "sleeps"), T.at(c2, "sleeps") + 14)}}>SLEEP</div>
        <SL f={f} T={T} id="yukta" at={bal} x={960} y={140} tone="light" size={38} w={900}/>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: p3}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="c6b"/>
          {Array.from({length: 6}).map((_, i) => {
            const x = ((f - wind) * 14 + i * 330) % 2200 - 200;
            return <path key={i} d={`M ${x} ${300 + i * 70} c 60 -20 120 20 180 0 c 40 -14 60 -40 30 -50`} stroke={COOL} strokeWidth={3} fill="none"
              opacity={0.5 * ip(f, wind, wind + 12) * (1 - calm)}/>;
          })}
          <Diya x={960} y={680} s={2.2} f={f} still={calm} id="c6b"/>
        </svg>
        <SL f={f} T={T} id="cancala" at={wind} x={420} y={180} tone="light" size={32} w={560}/>
        <SL f={f} T={T} id="abhyasa" at={prac} x={1500} y={180} tone="light" size={32} w={420}/>
        <SL f={f} T={T} id="vairagya" at={go} x={1500} y={300} tone="light" size={32} w={420}/>
        <SL f={f} T={T} id="dipa" at={still} x={960} y={110} tone="light" size={34} w={1100}/>
      </AbsoluteFill>
    </NightBG>
  );
};
