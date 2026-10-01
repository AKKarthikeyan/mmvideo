// Pilot: Som Distilleries (Moat & Margin article of 26 Sep 2026), 1080x1920 hand-drawn explainer.
// Every line of narration and every figure comes from the published, verified article.
import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from "remotion";
import beats from "../public/pilot/beats.json";
import {Draw, DrawMany, Fade, Hand, INK, PAPER, RED, BLUE, GREEN, HAND, s} from "./sketch";

export const FPS = 30;
const PAD = 0.7;                                          // pause after each beat, seconds
export const beatFrames = beats.map((b) => Math.ceil((b.sec + PAD) * FPS));
export const totalFrames = beatFrames.reduce((a, b) => a + b, 0);

const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);

const Brand: React.FC = () => (
  <g>
    <text x={60} y={1860} fontFamily={HAND} fontSize={40} fill={INK} opacity={0.75}>Moat &amp; Margin</text>
    <text x={1020} y={1860} fontFamily={HAND} fontSize={30} fill={INK} opacity={0.55} textAnchor="end">from the filings</text>
  </g>
);

// 1. Hook: a brewery, a padlock, "to ONE licence"
const Hook: React.FC = () => (
  <Canvas>
    <Hand x={540} y={230} start={2} size={92} anchor="middle">Som Distilleries</Hand>
    <Hand x={540} y={330} start={14} size={56} anchor="middle" color={RED}>lost half its business</Hand>
    {/* brewery */}
    <DrawMany start={20} each={7} shapes={[
      s.rect(270, 700, 540, 380, {seed: 21}),
      s.poly([[250, 700], [540, 520], [830, 700]], {seed: 22}),
      s.rect(660, 470, 70, 160, {seed: 23}),
      s.rect(460, 880, 160, 200, {seed: 24}),
      s.rect(320, 760, 110, 90, {seed: 25}), s.rect(650, 760, 110, 90, {seed: 26}),
    ]}/>
    <Hand x={540} y={1150} start={40} size={48} anchor="middle">Bhopal brewery</Hand>
    {/* padlock */}
    <DrawMany start={62} each={6} shapes={[
      s.rect(470, 950, 140, 110, {stroke: RED, strokeWidth: 6, seed: 31, fill: "rgba(217,72,15,0.18)", fillStyle: "solid"}),
      s.arc(540, 952, 96, 130, Math.PI, 2 * Math.PI, {stroke: RED, strokeWidth: 7, seed: 32}),
    ]}/>
    <Hand x={540} y={1400} start={112} size={70} anchor="middle">not to a rival...</Hand>
    {/* licence card with an X */}
    <Hand x={540} y={1540} start={140} size={84} anchor="middle" color={RED}>to ONE licence</Hand>
    <DrawMany start={150} each={6} shapes={[
      s.rect(330, 1600, 420, 160, {seed: 41}),
      s.line(370, 1650, 700, 1650, {seed: 42, strokeWidth: 3}), s.line(370, 1700, 620, 1700, {seed: 43, strokeWidth: 3}),
      ...[s.line(300, 1580, 780, 1780, {stroke: RED, strokeWidth: 7, seed: 44}), s.line(780, 1580, 300, 1780, {stroke: RED, strokeWidth: 7, seed: 45})],
    ]}/>
    <Brand/>
  </Canvas>
);

// 2. Timeline: Feb suspended, Jun rejected, three rating cuts, BB+
const Timeline: React.FC = () => {
  const items: [string, string, string, number][] = [
    ["5 Feb", "licence suspended", INK, 12],
    ["18 Jun", "renewal rejected", INK, 90],
    ["27 & 30 Jun", "group ratings cut", RED, 170],
    ["20 Aug", "BB+: below inv. grade", RED, 230],
  ];
  return (
    <Canvas>
      <Hand x={540} y={230} start={0} size={80} anchor="middle">Seven months</Hand>
      <Draw shape={s.line(250, 360, 250, 1560, {seed: 51, strokeWidth: 5})} start={4} dur={40}/>
      {items.map(([d, t, c, st], i) => {
        const y = 440 + i * 320;
        return (
          <g key={i}>
            <Draw shape={s.ellipse(250, y, 44, 44, {seed: 60 + i, fill: c === RED ? RED : INK, fillStyle: "solid", stroke: c})} start={st} dur={10}/>
            <Hand x={310} y={y - 10} start={st + 4} size={52} color={c}>{d}</Hand>
            <Hand x={310} y={y + 70} start={st + 12} size={60} color={c}>{t}</Hand>
          </g>
        );
      })}
      <Brand/>
    </Canvas>
  );
};

// 3. What the licence was worth: two bars, then management's quote
const Worth: React.FC = () => {
  const f = useCurrentFrame();
  const grow = (st: number, h: number) => interpolate(f, [st, st + 24], [0, h], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const hA = grow(40, 700), hB = grow(150, 355);             // 530.1 vs 268.8 crore, to scale
  return (
    <Canvas>
      <Hand x={540} y={220} start={0} size={72} anchor="middle">Total income, June quarter</Hand>
      <Draw shape={s.line(120, 1300, 960, 1300, {seed: 71, strokeWidth: 5})} start={20} dur={16}/>
      <Draw shape={s.rect(220, 1300 - 700, 240, 700, {seed: 72, fill: "rgba(28,100,184,0.25)", fillStyle: "hachure", stroke: BLUE})} start={40} dur={26}/>
      <rect x={220} y={1300 - hA} width={0} height={0}/>
      <Hand x={340} y={560} start={60} size={60} anchor="middle" color={BLUE}>₹530 cr</Hand>
      <Hand x={340} y={1370} start={64} size={48} anchor="middle">a year ago</Hand>
      <Draw shape={s.rect(620, 1300 - 355, 240, 355, {seed: 73, fill: "rgba(217,72,15,0.25)", fillStyle: "hachure", stroke: RED})} start={150} dur={24}/>
      <rect x={620} y={1300 - hB} width={0} height={0}/>
      <Hand x={740} y={915} start={170} size={60} anchor="middle" color={RED}>₹269 cr</Hand>
      <Hand x={740} y={1370} start={174} size={48} anchor="middle">plant shut</Hand>
      {/* speech bubble with management's words */}
      <Draw shape={s.rect(50, 1450, 980, 260, {seed: 74, strokeWidth: 4})} start={260} dur={18}/>
      <Draw shape={s.poly([[700, 1450], [760, 1395], [800, 1450]], {seed: 75})} start={270} dur={10}/>
      <Hand x={540} y={1560} start={278} size={43} anchor="middle">"we lost about INR250 crores of revenue"</Hand>
      <Hand x={540} y={1650} start={305} size={38} anchor="middle">— management, Q1 FY27 call, 13 Aug 2026</Hand>
      <Brand/>
    </Canvas>
  );
};

// 4. Why other plants could not fill the gap: import fees make it a loss
const Why: React.FC = () => (
  <Canvas>
    <Hand x={540} y={220} start={0} size={70} anchor="middle">Why not ship beer in?</Hand>
    {([["Karnataka", 190, 480], ["Odisha", 190, 780], ["Uttar Pradesh", 190, 1080]] as [string, number, number][]).map(([n, x, y], i) => (
      <g key={n}>
        <Draw shape={s.rect(x - 160, y - 80, 370, 140, {seed: 80 + i})} start={10 + i * 8} dur={14}/>
        <Hand x={x + 25} y={y + 5} start={16 + i * 8} size={40} anchor="middle">{n}</Hand>
        <DrawMany start={50 + i * 6} each={5} shapes={s.arrow(x + 215, y - 10, 600, 780, {seed: 90 + i})}/>
      </g>
    ))}
    <Draw shape={s.rect(640, 660, 360, 240, {seed: 95, strokeWidth: 6})} start={40} dur={16}/>
    <Hand x={820} y={775} start={46} size={52} anchor="middle">Madhya</Hand>
    <Hand x={820} y={840} start={52} size={52} anchor="middle">Pradesh</Hand>
    {/* toll gate */}
    <DrawMany start={90} each={6} shapes={[
      s.rect(560, 560, 30, 440, {stroke: RED, seed: 96, fill: RED, fillStyle: "solid"}),
    ]}/>
    <Hand x={575} y={1060} start={96} size={46} anchor="middle" color={RED}>import fees</Hand>
    <Hand x={540} y={1330} start={120} size={64} anchor="middle" color={RED}>= "it will be at a loss"</Hand>
    <Fade start={170}>
      <Draw shape={s.rect(60, 1460, 960, 190, {seed: 97, stroke: GREEN, strokeWidth: 6})} start={170} dur={16}/>
      <Hand x={540} y={1580} start={180} size={62} anchor="middle" color={GREEN}>the licence IS the moat</Hand>
    </Fade>
    <Brand/>
  </Canvas>
);

// 5. Proof: the actual filing page, lines circled and highlighted
const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const slide = interpolate(f, [0, 18], [180, 0], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const op = interpolate(f, [0, 12], [0, 1], {extrapolateRight: "clamp"});
  // page 612x792 pt shown 900 px wide => 1.4706 px/pt; placed at x=90, y=230
  const k = 900 / 612, X = (pt: number) => 90 + pt * k, Y = (pt: number) => 230 + pt * k;
  const hl = interpolate(f, [70, 110], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 90, top: 230 + slide, width: 900, opacity: op,
        boxShadow: "0 12px 40px rgba(0,0,0,0.18)"}}>
        <Img src={staticFile("pilot/filing-1.png")} style={{width: 900, display: "block"}}/>
      </div>
      <Canvas>
        <Hand x={540} y={150} start={4} size={64} anchor="middle">The company's own filing</Hand>
        <rect x={X(90)} y={Y(534)} width={(X(520) - X(90)) * hl} height={Y(560) - Y(534)} fill="#ffe066" opacity={0.45}/>
        <Draw shape={s.ellipse((X(90) + X(522)) / 2, (Y(529) + Y(559)) / 2, X(530) - X(80), (Y(560) - Y(528)) * 2.1,
          {stroke: RED, strokeWidth: 7, seed: 101, roughness: 2})} start={110} dur={22}/>
        <Hand x={540} y={1610} start={140} size={58} anchor="middle" color={RED}>renew within 15 days</Hand>
        <Hand x={540} y={1690} start={160} size={38} anchor="middle">NSE filing, 26 Sep 2026</Hand>
        <Hand x={540} y={1745} start={170} size={38} anchor="middle">High Court order of 24 Sep 2026</Hand>
      </Canvas>
    </AbsoluteFill>
  );
};

// 6. Bear case
const Bear: React.FC = () => {
  const rows: [string, string, number][] = [
    ["Restart date?", "not stated", 40],
    ["State appeal?", "not stated", 110],
    ["Rating", "still BB+", 190],
  ];
  return (
    <Canvas>
      <Hand x={540} y={230} start={0} size={72} anchor="middle">An order is not</Hand>
      <Hand x={540} y={320} start={10} size={72} anchor="middle" color={RED}>a running plant</Hand>
      {rows.map(([q, a, st], i) => {
        const y = 620 + i * 330;
        return (
          <g key={q}>
            <Draw shape={s.rect(120, y - 90, 90, 90, {seed: 110 + i})} start={st} dur={10}/>
            <Hand x={165} y={y - 20} start={st + 6} size={70} anchor="middle" color={RED}>?</Hand>
            <Hand x={260} y={y - 25} start={st + 8} size={62}>{q}</Hand>
            <Hand x={260} y={y + 55} start={st + 20} size={52} color={RED}>{a}</Hand>
          </g>
        );
      })}
      <Brand/>
    </Canvas>
  );
};

// 7. Close: disclaimer
const Close: React.FC = () => (
  <Canvas>
    <Hand x={540} y={560} start={0} size={96} anchor="middle">Moat &amp; Margin</Hand>
    <Draw shape={s.line(260, 610, 820, 610, {seed: 121, strokeWidth: 5})} start={10} dur={16}/>
    <Hand x={540} y={820} start={24} size={50} anchor="middle">Educational research,</Hand>
    <Hand x={540} y={890} start={34} size={50} anchor="middle">not investment advice.</Hand>
    <Hand x={540} y={1010} start={60} size={46} anchor="middle">Not a SEBI-registered</Hand>
    <Hand x={540} y={1070} start={70} size={46} anchor="middle">Research Analyst or Investment Adviser.</Hand>
    <Hand x={540} y={1250} start={110} size={44} anchor="middle">Every fact: the company's own filings.</Hand>
    <Hand x={540} y={1320} start={130} size={40} anchor="middle">Full article + sources: moatmarginresearch.com</Hand>
  </Canvas>
);

const SCENES: Record<string, React.FC> = {hook: Hook, timeline: Timeline, worth: Worth, why: Why, proof: Proof, bear: Bear, close: Close};

export const SomPilot: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {beats.map((b, i) => {
        const Scene = SCENES[b.key];
        const seq = <Sequence key={b.key} from={from} durationInFrames={beatFrames[i]}>
          <AbsoluteFill><Scene/></AbsoluteFill>
          <Audio src={staticFile(`pilot/${b.key}.wav`)}/>
        </Sequence>;
        from += beatFrames[i];
        return seq;
      })}
    </AbsoluteFill>
  );
};
