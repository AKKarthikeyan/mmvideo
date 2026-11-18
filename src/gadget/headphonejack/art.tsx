// P03 "The Headphone Jack Is Older Than Radio": one animated scene per beat, in the night look (../antimattertrap/look.tsx).
// Page coordinates, inside Safe. `fr` is the composition frame, `t` seconds; cue frames come from the aligned narration (Short.tsx).
// Facts are in docs/inventors_desk/research/P03-headphone-jack; anything the artist had to invent is marked ARTISTIC in script_v1.json.
import React from "react";
import {FPS, HEAD, MONO, SERIF, W, H, ease, lin, usePop} from "../kit";
import {Card} from "../antimattertrap/art";
import {K, Pill, bump} from "../antimattertrap/look";

/** a 3.5 mm style plug, tip to the right at the origin: strain relief, sleeve, ring, tip, with insulating bands */
export const Plug: React.FC<{x: number; y: number; s?: number; o?: number}> = ({x, y, s = 1, o = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <rect x={-250} y={-22} width={60} height={44} rx={14} fill="#1B2350"/>
    <rect x={-196} y={-28} width={112} height={56} rx={10} fill="#CBD5F0"/>
    <rect x={-196} y={-28} width={112} height={12} rx={6} fill="#fff" opacity={0.45}/>
    <rect x={-84} y={-20} width={16} height={40} fill="#26335F"/>
    <rect x={-68} y={-20} width={38} height={40} fill="#B9C6EA"/>
    <rect x={-30} y={-20} width={14} height={40} fill="#26335F"/>
    <path d="M -16 -18 H 14 A 18 18 0 0 1 14 18 H -16 Z" fill="#E7EDFB"/>
    <rect x={-16} y={-18} width={30} height={7} fill="#fff" opacity={0.5}/>
  </g>
);
/** a side-on cut of a socket, opening to the left at the origin; contacts light when `lit` is 1 */
export const Socket: React.FC<{x: number; y: number; s?: number; lit?: number}> = ({x, y, s = 1, lit = 0}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={0} y={-92} width={300} height={184} rx={30} fill="url(#steel)"/>
    <rect x={-6} y={-36} width={250} height={72} rx={12} fill="#060B1F"/>
    {[70, 130, 190].map((cx) => (
      <g key={cx}>
        <rect x={cx - 14} y={-36} width={28} height={12} rx={5} fill={lit ? K.amber : K.steel}/>
        <rect x={cx - 14} y={24} width={28} height={12} rx={5} fill={lit ? K.amber : K.steel}/>
      </g>
    ))}
    {lit > 0 && <rect x={-6} y={-36} width={250} height={72} rx={12} fill="none" stroke={K.cyan} strokeWidth={5} opacity={lit}/>}
  </g>
);
const cableTo = (x: number, y: number, fromX: number, fromY: number, t: number) =>
  `M ${x - 250} ${y} C ${x - 380} ${y + 20 * Math.sin(t * 1.5)} ${fromX + 120} ${fromY - 30} ${fromX} ${fromY}`;

/** b01 and b07: the earbud plug sliding into a jack; `cards` shows the year cards of the echo */
export const HookScene: React.FC<{fr: number; t: number; capF?: number; cards?: boolean; cardF?: number}> = ({fr, t, capF, cards, cardF = 0}) => {
  const u = 0.5 + 0.5 * Math.sin(t * 1.7 - 1.2);
  const e = Math.min(1, Math.max(0, (u - 0.18) / 0.62));
  const px = 330 + 190 * e, jx = 480, jy = 1060;
  const lit = e > 0.96 ? 1 : 0;
  const pop = usePop(); const p = pop(cardF, 12, 200);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
       <g transform="translate(560 900) scale(1.35) translate(-600 -1060)">
        <path d={cableTo(px, jy, -20, 1180, t)} stroke="#CBD5F0" strokeWidth={9} fill="none" strokeLinecap="round"/>
        <Plug x={px} y={jy}/>
        <Socket x={jx} y={jy} lit={lit}/>
        {lit > 0 && [0, 1, 2].map((k) => <circle key={k} cx={560 + k * 60 + 10 * Math.sin(t * 9 + k)} cy={jy} r={7} fill={K.cyan} opacity={0.8}/>)}
       </g>
      </svg>
      {capF !== undefined && (
        <div style={{position: "absolute", left: 300, top: 1080, fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: K.cream, opacity: 0.85 * ease(fr, capF, capF + 10), textTransform: "uppercase"}}>the jack in your pocket</div>
      )}
      {cards && (
        <>
          <div style={{position: "absolute", left: 80, top: 470, opacity: Math.min(1, p * 2.4), transform: `rotate(${-4 + (1 - p) * 6}deg) scale(${0.7 + 0.3 * p})`}}>
            <div style={{background: K.cream, borderRadius: 24, padding: "14px 34px", boxShadow: "0 16px 32px rgba(3,8,30,0.5)", position: "relative"}}>
              <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: "#5D678F"}}>TELEGRAPH DESK</div>
              <div style={{fontFamily: HEAD, fontSize: 96, color: K.ink, letterSpacing: -2, lineHeight: 1.05}}>1877</div>
            </div>
          </div>
          <div style={{position: "absolute", left: 600, top: 470, opacity: Math.min(1, p * 2.4), transform: `rotate(${4 - (1 - p) * 6}deg) scale(${0.7 + 0.3 * p})`}}>
            <div style={{background: K.cyan, borderRadius: 24, padding: "14px 34px", boxShadow: "0 16px 32px rgba(3,8,30,0.5)"}}>
              <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: "#0B3F78"}}>RADIO STANDARD</div>
              <div style={{fontFamily: HEAD, fontSize: 96, color: K.ink, letterSpacing: -2, lineHeight: 1.05}}>1969</div>
            </div>
          </div>
          <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
            <path d="M 400 620 C 480 700 560 700 640 620" stroke={K.amber} strokeWidth={6} strokeDasharray="3 14" strokeLinecap="round" fill="none" opacity={p}/>
            <polygon points="650,612 618,606 626,634" fill={K.amber} opacity={p}/>
          </svg>
        </>
      )}
    </>
  );
};

/** b02: the 1877 telegraph spring-jack: two spring strips touching; a wedge pushed between them breaks the line */
export const TelegraphScene: React.FC<{fr: number; t: number; wedgeF: number; nameF: number}> = ({fr, t, wedgeF, nameF}) => {
  const e = ease(fr, wedgeF, wedgeF + 24), ang = 6 * e;
  const tipY = 620 + e * 290;
  const open = e > 0.5;
  const dots = Array.from({length: 9}, (_, k) => {
    let x = 120 + ((t * 150 + k * 95) % 840);
    if (open) { x = 120 + ((k * 95) % 400); if (x > 500) return null; }
    else if (x > 527 && x < 553) x = 560;
    return <circle key={k} cx={x} cy={660} r={7} fill={K.cyan} opacity={open ? 0.35 : 0.95}/>;
  });
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
       <g transform="translate(540 905) scale(1.12) translate(-540 -712)">
        <rect x={90} y={600} width={880} height={430} rx={34} fill="#14123A" stroke="#3B4C86" strokeWidth={4} opacity={0.9}/>
        <path d="M 120 660 H 527" stroke={K.cyan} strokeWidth={10} strokeLinecap="round" opacity={0.9}/>
        <path d="M 553 660 H 960" stroke={K.cyan} strokeWidth={10} strokeLinecap="round" opacity={open ? 0.22 : 0.9}/>
        {dots}
        <g transform={`rotate(${-ang} 527 660)`}><rect x={514} y={660} width={26} height={270} rx={10} fill="#C99A4A"/><rect x={514} y={660} width={9} height={270} rx={4} fill="#F0CE85" opacity={0.7}/></g>
        <g transform={`rotate(${ang} 553 660)`}><rect x={540} y={660} width={26} height={270} rx={10} fill="#C99A4A"/><rect x={557} y={660} width={9} height={270} rx={4} fill="#9A6F2E" opacity={0.7}/></g>
        <path d={`M 525 ${tipY - 150} L 505 465`} stroke={K.amber} strokeWidth={6} fill="none"/>
        <path d={`M 555 ${tipY - 150} L 575 465`} stroke={K.amber} strokeWidth={6} fill="none"/>
        <polygon points={`540,${tipY} 505,${tipY - 150} 575,${tipY - 150}`} fill={K.cream}/>
        <polygon points={`540,${tipY} 540,${tipY - 150} 575,${tipY - 150}`} fill="#fff" opacity={0.25}/>
        <rect x={430} y={395} width={220} height={70} rx={16} fill="#26335F" stroke={K.amber} strokeWidth={4}/>
        <text x={540} y={440} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={26} letterSpacing={4} fill={K.amber}>SOUNDER</text>
        <text x={120} y={632} fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={3} fill={K.cream}>LINE</text>
        <text x={960} y={632} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={3} fill={K.cream}>LINE</text>
        <text x={540} y={1000} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={3} fill={K.cream} opacity={0.8}>TWO BRASS PINS</text>
       </g>
      </svg>
      <Pill x={44} y={350} text="Spring-jack" f0={nameF} bg={K.amber} color={K.ink} size={30}/>
      <Pill x={690} y={770} text="Line broken" f0={wedgeF + 14} bg={K.coral} color="#fff" size={26}/>
    </>
  );
};

/** b03: the wedge fits one way; the round plug fits any way (face-on silhouettes, drawn after the patents' words) */
export const JamScene: React.FC<{fr: number; t: number; jamF: number; roundF: number; patentF: number}> = ({fr, t, jamF, roundF, patentF}) => {
  const a = 125 * Math.sin(t * 1.3), fits = Math.abs(a) < 9;
  const rot = (t * 70) % 360;
  const tri = (cx: number, cy: number, r: number, rotate: number, fill: string, stroke?: string) => {
    const pts = [0, 120, 240].map((d) => `${cx + r * Math.sin(((d + rotate) * Math.PI) / 180)},${cy - r * Math.cos(((d + rotate) * Math.PI) / 180)}`).join(" ");
    return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={stroke ? 6 : 0} strokeLinejoin="round"/>;
  };
  const showL = ease(fr, jamF, jamF + 12), showR = ease(fr, roundF, roundF + 12);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
       <g transform="translate(0 90)">
        <g opacity={showL}>
          <rect x={60} y={500} width={440} height={470} rx={34} fill="#0E173C" stroke="#3B4C86" strokeWidth={4}/>
          {tri(280, 760, 150, 0, "#060B1F", K.cyan)}
          {tri(280, 760, 126, a, fits ? K.cream : "#9AA8D2")}
          <circle cx={440} cy={560} r={34} fill={fits ? "#2FBF71" : K.coral}/>
          <text x={440} y={573} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#fff">{fits ? "✓" : "✕"}</text>
          <text x={280} y={546} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#fff">WEDGE</text>
          <text x={280} y={940} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={24} letterSpacing={3} fill={K.cream}>ONE WAY ONLY</text>
        </g>
        <g opacity={showR}>
          <rect x={580} y={500} width={440} height={470} rx={34} fill="#0E173C" stroke="#3B4C86" strokeWidth={4}/>
          <circle cx={800} cy={760} r={150} fill="#060B1F" stroke={K.cyan} strokeWidth={6}/>
          <circle cx={800} cy={760} r={126} fill={K.cream}/>
          <path d={`M 800 760 L ${800 + 108 * Math.sin((rot * Math.PI) / 180)} ${760 - 108 * Math.cos((rot * Math.PI) / 180)}`} stroke={K.coral} strokeWidth={14} strokeLinecap="round"/>
          <circle cx={800} cy={760} r={14} fill={K.ink}/>
          <circle cx={986} cy={556} r={30} fill="#2FBF71"/>
          <text x={986} y={569} textAnchor="middle" fontFamily={HEAD} fontSize={40} fill="#fff">✓</text>
          <text x={776} y={546} textAnchor="middle" fontFamily={HEAD} fontSize={44} fill="#fff">ROUND PLUG</text>
          <text x={800} y={940} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={24} letterSpacing={3} fill={K.cream}>ANY WAY</text>
        </g>
       </g>
      </svg>
      <Pill x={60} y={1110} text="Telephone exchanges · 1879" f0={patentF} bg={K.amber} color={K.ink} size={26}/>
      <Pill x={60} y={1190} text="Jones US 234,192 · Scribner US 293,198" f0={patentF + 6} size={22}/>
    </>
  );
};

/** b04: an operator, a head receiver on a band, and a cord ending in a plug that goes into a jack */
export const OperatorScene: React.FC<{fr: number; t: number; plugF: number; cardF: number}> = ({fr, t, plugF, cardF}) => {
  const e = ease(fr, plugF, plugF + 22);
  const pxx = 560 + 263 * e, pyy = 1030 + (810 - 1030) * e;
  const bobY = 4 * Math.sin(t * 2);
  const jacks = [0, 1, 2, 3].flatMap((c) => [0, 1, 2].map((r) => ({c, r})));
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <rect x={610} y={640} width={400} height={330} rx={26} fill="#2A1A44" stroke="#6B4468" strokeWidth={5}/>
        {jacks.map(({c, r}) => {
          const cx = 670 + c * 100, cy = 710 + r * 100;
          const hit = c === 2 && r === 1;
          return <g key={`${c}${r}`}><circle cx={cx} cy={cy} r={30} fill="#060B1F" stroke={hit && e > 0.95 ? K.cyan : K.steel} strokeWidth={5}/><circle cx={cx} cy={cy} r={11} fill={hit && e > 0.95 ? K.amber : "#1B2350"}/></g>;
        })}
        <text x={810} y={1010} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={3} fill={K.cream} opacity={0.85}>SWITCHBOARD</text>
        {/* operator */}
        <g transform={`translate(0 ${bobY})`}>
          <path d="M 80 1130 C 90 990 170 940 260 940 C 350 940 430 990 440 1130 Z" fill="#3C58C8"/>
          <rect x={232} y={880} width={56} height={70} rx={20} fill="#E9B98D"/>
          <circle cx={260} cy={800} r={100} fill="#E9B98D"/>
          <path d="M 160 800 C 150 690 220 650 270 654 C 340 656 372 720 360 800 C 330 740 260 728 160 800 Z" fill="#2A1A44"/>
          <circle cx={348} cy={668} r={34} fill="#2A1A44"/>
          <path d="M 168 780 C 176 690 340 690 352 780" stroke={K.steel} strokeWidth={14} fill="none" strokeLinecap="round"/>
          <circle cx={168} cy={800} r={36} fill={K.steel} stroke="#26335F" strokeWidth={6}/>
          <circle cx={290} cy={810} r={8} fill="#2A1A44"/>
          <path d="M 276 846 Q 296 862 318 840" stroke="#B5654A" strokeWidth={7} fill="none" strokeLinecap="round"/>
        </g>
        <path d={`M 160 ${810 + bobY} C 80 900 140 1030 330 1040 C 440 1048 ${pxx - 120} ${pyy + 20} ${pxx - 30} ${pyy}`} stroke="#CBD5F0" strokeWidth={8} fill="none" strokeLinecap="round"/>
        <Plug x={pxx + 28} y={pyy} s={0.62}/>
      </svg>
      <Pill x={44} y={350} text="1899 · New York Times" f0={plugF - 20} bg={K.amber} color={K.ink} size={27}/>
      <Card x={60} y={1190} w={470} f0={cardF} rot={-2}>
        <div style={{background: K.cream, borderRadius: 22, padding: "12px 22px", boxShadow: "0 14px 28px rgba(3,8,30,0.5)"}}>
          <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 20, letterSpacing: 2, color: "#5D678F", textTransform: "uppercase"}}>Western Electric catalogue, 1908</div>
          <div style={{fontFamily: HEAD, fontSize: 40, color: K.ink, lineHeight: 1.05}}>PLUG No. 85</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: K.ink}}>“Operator’s head telephone” · 3 conductors · $1.50</div>
        </div>
      </Card>
    </>
  );
};

/** b05: 1877 and 1896 on one line; the gap lights up and 1899 and 1879 sit on it as ticks */
export const TimelineScene: React.FC<{fr: number; t: number; f1877: number; f1896: number; gapF: number; fTicks: number}> = ({fr, t, f1877, f1896, gapF, fTicks}) => {
  const x = (yr: number) => 110 + (yr - 1877) * 36.4;
  const y0 = 1000;
  const g = ease(fr, gapF, gapF + 24);
  const o = (f: number) => ease(fr, f, f + 10);
  const mark = (yr: number, col: string, r: number, f: number) => <circle cx={x(yr)} cy={y0} r={r * o(f)} fill={col} stroke="#0A1128" strokeWidth={5}/>;
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <rect x={80} y={y0 - 8} width={850} height={16} rx={8} fill="#26335F"/>
        <rect x={x(1877)} y={y0 - 8} width={(x(1896) - x(1877)) * g} height={16} rx={8} fill={K.amber}/>
        {mark(1877, K.amber, 26, f1877)}
        {mark(1896, K.cyan, 26, f1896)}
        {mark(1879, K.cream, 15, fTicks)}
        {mark(1899, K.cream, 15, fTicks + 8)}
        <g opacity={o(f1877)}>
          <text x={x(1877)} y={y0 - 70} textAnchor="start" fontFamily={HEAD} fontSize={64} fill={K.amber}>1877</text>
          <text x={x(1877)} y={y0 - 36} fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={2} fill={K.cream}>SPRING-JACK</text>
        </g>
        <g opacity={o(f1896)}>
          <text x={x(1896)} y={y0 - 70} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill={K.cyan}>1896</text>
          <text x={x(1896)} y={y0 - 36} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={2} fill={K.cream}>RADIO PATENT</text>
        </g>
        <g opacity={o(fTicks)}>
          <text x={x(1879)} y={y0 + 64} textAnchor="start" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={2} fill={K.cream}>1879 ROUND PLUG</text>
        </g>
        <g opacity={o(fTicks + 8)}>
          <text x={x(1899)} y={y0 + 108} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={2} fill={K.cream}>1899 HEADSET IN A JACK</text>
        </g>
        {g > 0.02 && <path d={`M ${x(1877)} ${y0 - 150} V ${y0 - 180} H ${x(1877) + (x(1896) - x(1877)) * g} V ${y0 - 150}`} stroke={K.amber} strokeWidth={6} fill="none" strokeLinejoin="round"/>}
      </svg>
      <div style={{position: "absolute", left: 80, top: y0 - 330, width: 850, textAlign: "center", fontFamily: HEAD, fontSize: 130, color: K.amber, lineHeight: 0.9, opacity: g, transform: `scale(${0.85 + 0.15 * g})`, textShadow: "0 6px 0 rgba(5,10,40,0.45)"}}>
        19 YEARS
        <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: K.cream, textShadow: "none", marginTop: 10}}>1896 − 1877 (our arithmetic)</div>
      </div>
    </>
  );
};

/** b06: radio comes back for the jack: a radio set, a small socket cut into its side, an IEC label, the earbud plug sliding in */
export const RadioScene: React.FC<{fr: number; t: number; yearF: number; sizeF: number; plugF: number}> = ({fr, t, yearF, sizeF, plugF}) => {
  const e = ease(fr, plugF, plugF + 24);
  const waves = [0, 1, 2].map((k) => ({r: 40 + ((t * 60 + k * 40) % 120), k}));
  const grille = Array.from({length: 6}, (_, r) => Array.from({length: 7}, (_, c) => <circle key={`${r}${c}`} cx={640 + c * 42} cy={770 + r * 44} r={8} fill="#0E1A66" opacity={0.8}/>));
  const px = 170 + 330 * e;
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {waves.map(({r, k}) => <path key={k} d={`M ${880 - r * 0.7} ${520 - r} A ${r} ${r} 0 0 1 ${880 + r * 0.7} ${520 - r}`} stroke={K.cyan} strokeWidth={5} fill="none" opacity={Math.max(0, 1 - r / 160)}/>)}
        <line x1={830} y1={610} x2={880} y2={520} stroke="#CBD5F0" strokeWidth={8} strokeLinecap="round"/>
        <rect x={300} y={590} width={660} height={460} rx={44} fill="url(#coil)"/>
        <rect x={300} y={590} width={660} height={16} rx={8} fill="#fff" opacity={0.2}/>
        <circle cx={800} cy={668} r={52} fill="#0A1128" stroke={K.cream} strokeWidth={6}/>
        <path d={`M 800 668 L ${800 + 38 * Math.sin(t * 0.8)} ${668 - 38 * Math.cos(t * 0.8)}`} stroke={K.coral} strokeWidth={7} strokeLinecap="round"/>
        <circle cx={660} cy={668} r={26} fill="#CBD5F0"/><circle cx={920} cy={668} r={0} fill="#CBD5F0"/>
        {grille}
        <path d={`M ${px - 195} 820 C ${px - 300} 860 -40 960 -60 1100`} stroke="#CBD5F0" strokeWidth={9} fill="none" strokeLinecap="round"/>
        <Socket x={300} y={820} s={0.9} lit={e > 0.96 ? 1 : 0}/>
        <Plug x={px} y={820} s={0.78}/>
      </svg>
      <Pill x={110} y={1090} text="IEC 60130-8 · 1969" f0={yearF} bg={K.amber} color={K.ink} size={26}/>
      <Pill x={470} y={1086} text="3.5 mm" f0={sizeF} bg={K.cyan} color={K.ink} size={32}/>
      <div style={{position: "absolute", left: 114, top: 1166, fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: K.cream, opacity: 0.85 * ease(fr, yearF + 6, yearF + 16), textTransform: "uppercase"}}>audio circuits in radio receivers</div>
    </>
  );
};
