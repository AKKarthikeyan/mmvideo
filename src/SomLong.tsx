// Long-form pilot (16:9): Som Distilleries, "The Licence Was the Business". Vox collage + 3 hand-drawn moments.
// Every figure is from the verified article (published 27 Sep 2026) and its NSE source filings; clippings are real PDF crops.
import React from "react";
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import beatsRaw from "../public/long/beats.json";
import clipsRaw from "../public/long/clips/clips.json";
import {C, COND, TYPE, Counter, Drift, HalftoneCutout, Pin, RedString, Stage, Stamp, Strip, Tape, TornCard, TypeLabel, VoxDefs, VoxFonts} from "./voxkit";
import {HDraw, HWrite, sh, RED as HRED} from "./handkit";

export type Beat = {ch: number; key: string; text: string; sec: number; cap: string; cues: string[]};
export const beats = beatsRaw as Beat[];
const clips = clipsRaw as Record<string, {w: number; h: number; hl: number[][]}>;

export const LFPS = 30;
export const LW = 1920, LH = 1080;
const isTitle = (b: Beat) => b.ch > 0 && b.ch < 7 && b.key.endsWith("0");
export const lBeatFrames = beats.map((b) => Math.ceil((b.sec + (isTitle(b) ? 1.1 : 0.5)) * LFPS));
export const lStarts = lBeatFrames.reduce<number[]>((a, n, i) => [...a, i ? a[i - 1] + lBeatFrames[i - 1] : 0], []);
export const lTotal = lBeatFrames.reduce((a, b) => a + b, 0);

export const CHAPTERS = ["Cold open", "Seven months, in the filings", "What the licence was worth", "Why other plants couldn't fill the gap",
  "What held up", "The bear case", "Why it matters, what to watch", "Sources"];
const TITLE_LINES: Record<number, [string, string]> = {
  1: ["SEVEN MONTHS,", "IN THE FILINGS"], 2: ["WHAT THE LICENCE", "WAS WORTH"], 3: ["WHY OTHER PLANTS", "COULDN'T FILL THE GAP"],
  4: ["WHAT", "HELD UP"], 5: ["THE BEAR CASE,", "TAKEN SERIOUSLY"], 6: ["WHY IT MATTERS,", "WHAT TO WATCH"],
};

// Frame at which a phrase is spoken in a beat (proportional to its position in the narration). Throws on a typo.
export type TFn = (phrase: string, off?: number) => number;
export const makeT = (b: Beat): TFn => (phrase, off = 0) => {
  const i = b.text.toLowerCase().indexOf(phrase.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${phrase}`);
  return Math.round(b.sec * LFPS * i / b.text.length) + off;
};
type SP = {n: number; T: TFn};

const Svg: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => (
  <svg width={LW} height={LH} viewBox={`0 0 ${LW} ${LH}`} style={{position: "absolute"}}>
    <VoxDefs/><Stage w={LW} h={LH}/><Drift frames={frames} cx={960} cy={540}>{children}</Drift>
  </svg>
);
const At: React.FC<{a: number; b?: number; children: React.ReactNode}> = ({a, b = 1e9, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};
export const HighlightBand: React.FC<{x: number; y: number; w: number; h: number; start: number}> = ({x, y, w, h, start}) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (f - start) / 10));
  return p > 0 ? <rect x={x} y={y} width={w * p} height={h} fill={C.mustard} opacity={0.45} style={{mixBlendMode: "multiply"}}/> : null;
};
// A real PDF clipping, taped down, with mustard highlight bands (never underlines) on the quoted words.
export const Clip: React.FC<{name: string; x: number; y: number; w: number; start: number; hlAt?: number[]; rot?: number}> =
  ({name, x, y, w, start, hlAt, rot = -1}) => {
  const c = clips[name]; const pad = 22; const ih = w * c.h / c.w;
  return (
    <TornCard x={x} y={y} w={w + pad * 2} h={ih + pad * 2} start={start} fill="#ffffff" rot={rot}>
      <image href={staticFile(`long/clips/${name}.png`)} x={pad} y={pad} width={w} height={ih}/>
      {c.hl.map(([hx, hy, hw, hh], i) => (
        <HighlightBand key={i} x={pad + hx * w} y={pad + hy * ih} w={hw * w} h={hh * ih} start={hlAt?.[i] ?? hlAt?.[0] ?? start + 14 + i * 6}/>
      ))}
      <Tape x={-30} y={-24} rot={-14} w={130}/>
      <Tape x={w + pad * 2 - 100} y={-20} rot={12} w={130}/>
    </TornCard>
  );
};
export const Big: React.FC<{x: number; y: number; text: string; size?: number; color?: string; anchor?: "start" | "middle" | "end"; font?: string}> =
  ({x, y, text, size = 60, color = C.ink, anchor = "middle", font = COND}) =>
  <text x={x} y={y} fontFamily={font} fontWeight={font === COND ? 700 : 400} fontSize={size} textAnchor={anchor} fill={color}>{text}</text>;
export const Card: React.FC<{x: number; y: number; w: number; h: number; start: number; fill?: string; rot?: number; lines: [string, number, string?, string?][]}> =
  ({x, y, w, h, start, fill = C.white, rot = 0, lines}) => (
  <TornCard x={x} y={y} w={w} h={h} start={start} fill={fill} rot={rot}>
    {lines.map(([t, yy, col, font], i) => {
      const base = font === "type" ? 30 : (i === 0 ? 40 : 84);
      const size = Math.min(base, (w - 60) / (Math.max(1, t.length) * (font === "type" ? 0.62 : 0.5)));
      return <Big key={i} x={w / 2} y={yy} text={t} size={size} color={col ?? C.ink} font={font === "type" ? TYPE : COND}/>;
    })}
  </TornCard>
);

// ---------- chapter furniture ----------
const ChapterCard: React.FC<{ch: number; n: number}> = ({ch, n}) => (
  <Svg frames={n}>
    <Big x={430} y={760} text={String(ch)} size={560} color={C.mustard}/>
    <TypeLabel x={760} y={330} start={0} text={`CHAPTER ${ch}`} size={40} cps={3}/>
    <Strip x={1200} y={500} start={4} text={TITLE_LINES[ch][0]} size={88}/>
    <Strip x={1200} y={650} start={12} text={TITLE_LINES[ch][1]} size={88} fill={ch === 5 ? C.red : C.white} color={ch === 5 ? C.white : C.ink}/>
  </Svg>
);

// ---------- chapter 1: the timeline ----------
const EV: [string, string][] = [["5 FEB", "LICENCE SUSPENDED"], ["2 JUN", "“ROUGHLY 50%”"], ["18–19 JUN", "RENEWAL REJECTED"],
  ["27 JUN", "BBB+ → BBB"], ["30 JUN", "SUBS BBB → BBB-"], ["20 AUG", "BB+"]];
const evX = (i: number) => 170 + i * (1580 / 6);
const Timeline: React.FC<{at: number[]}> = ({at}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <g>
      <line x1={120} y1={175} x2={1800} y2={175} stroke={C.ink} strokeWidth={5}/>
      <circle cx={evX(6)} cy={175} r={16} fill={C.tan} stroke={C.gray} strokeWidth={4} strokeDasharray="6 5"/>
      <Big x={evX(6)} y={135} text="24 SEP" size={32} color={C.gray}/>
      <Big x={evX(6)} y={230} text="RENEWAL ORDERED" size={24} color={C.gray}/>
      {at.map((a, i) => {
        if (f < a) return null;
        const s = a < 0 ? 1 : spring({frame: f - a, fps, config: {damping: 10, stiffness: 170}});
        return (
          <g key={i} transform={`translate(${evX(i)} 175) scale(${0.4 + 0.6 * s}) translate(${-evX(i)} -175)`}>
            <circle cx={evX(i)} cy={175} r={16} fill={C.red} stroke={C.ink} strokeWidth={3}/>
            <Big x={evX(i)} y={135} text={EV[i][0]} size={32}/>
            <Big x={evX(i)} y={230} text={EV[i][1]} size={24}/>
          </g>
        );
      })}
    </g>
  );
};
const Ch1: React.FC<{n: number; at: number[]; children?: React.ReactNode}> = ({n, at, children}) => (
  <Svg frames={n}><Timeline at={at}/>{children}</Svg>
);

// ---------- scenes ----------
const FACTORY = "M 0 300 L 0 150 L 110 90 L 110 150 L 220 90 L 220 150 L 330 90 L 330 20 L 380 20 L 380 150 L 470 150 L 470 300 Z";

const S: Record<string, React.FC<SP>> = {
  b00: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={960} y={170} start={0} text="24 SEPTEMBER 2026" size={70}/>
      <Clip name="court" x={190} y={300} w={1500} start={6} hlAt={[T("renew all"), T("fifteen days")]}/>
      <TypeLabel x={250} y={720} start={30} text="HIGH COURT JUDGMENT INTIMATION · NSE · 26 SEP 2026" size={30} cps={3}/>
      <Stamp x={1480} y={800} start={T("fifteen days", 8)} text="RENEW IN 15 DAYS" size={56} rot={-6}/>
    </Svg>
  ),
  b01: ({n, T}) => (
    <Svg frames={n}>
      <At a={0} b={T("And the company")}>
        <HalftoneCutout d={FACTORY} start={0} x={720} y={330}/>
        <Strip x={960} y={200} start={2} text="BHOPAL BREWERY" size={72}/>
        <Stamp x={1000} y={560} start={T("shut since", 4)} text="SHUT SINCE FEBRUARY" size={62} rot={-7}/>
      </At>
      <At a={T("And the company")}>
        <Strip x={960} y={200} start={T("And the company")} text="WHAT THE LICENCE WAS WORTH" size={72}/>
        <Strip x={960} y={420} start={T("about half")} text="≈ HALF ITS VOLUME" size={80} rot={-1}/>
        <Strip x={960} y={590} start={T("half its quarterly")} text="≈ HALF ITS QUARTERLY INCOME" size={80} rot={1}/>
        <Strip x={960} y={760} start={T("and its investment")} text="ITS INVESTMENT-GRADE RATING" size={80} fill={C.red} color={C.white} rot={-1}/>
      </At>
    </Svg>
  ),
  // Hand-drawn moment 1: seven months on a sketched line.
  b02: ({n, T}) => (
    <Svg frames={n}>
      <TornCard x={200} y={140} w={1520} h={680} start={0} fill={C.paper} rot={-0.6}>
        <HWrite x={760} y={130} start={4} size={66} anchor="middle">Som Distilleries</HWrite>
        <HDraw shape={sh.line(140, 360, 1380, 360, {strokeWidth: 5})} start={T("seven months", -6)} dur={34}/>
        <HDraw shape={sh.circle(140, 360, 34, {fill: HRED, fillStyle: "solid"})} start={T("seven months", -6)} dur={8} hand={false}/>
        <HDraw shape={sh.circle(1380, 360, 34, {stroke: "#2b8a3e", strokeWidth: 5})} start={T("seven months", 26)} dur={10} hand={false}/>
        <HWrite x={140} y={450} start={T("seven months", -2)} size={46} anchor="middle" hand={false}>Feb</HWrite>
        <HWrite x={1380} y={450} start={T("seven months", 28)} size={46} anchor="middle" hand={false}>Sep</HWrite>
        <HWrite x={760} y={300} start={T("seven months", 8)} size={72} color={HRED} anchor="middle">7 months</HWrite>
        <HWrite x={760} y={590} start={T("told only")} size={48} anchor="middle">told only from its own filings</HWrite>
      </TornCard>
    </Svg>
  ),
  b11: ({n, T}) => (
    <Ch1 n={n} at={[T("suspended")]}>
      <Clip name="suspend" x={210} y={420} w={1450} start={10} hlAt={[T("suspended", 6)]}/>
      <TypeLabel x={260} y={700} start={24} text="PRESS RELEASE · 5 FEB 2026 · NSE" size={30} cps={3}/>
    </Ch1>
  ),
  b12: ({n, T}) => (
    <Ch1 n={n} at={[-1]}>
      <Card x={140} y={380} w={520} h={320} start={T("case from")} rot={-2} lines={[["THE CASE", 90], ["FROM 2012", 210]]}/>
      <Card x={700} y={400} w={520} h={320} start={T("not a party")} rot={1.5} lines={[["COMPANY SAYS", 90], ["NOT A PARTY", 210]]}/>
      <Card x={1260} y={380} w={520} h={320} start={T("stayed")} rot={-1} fill={C.mustard} lines={[["HIGH COURT, INDORE", 90], ["STAYED ON APPEAL", 200, C.ink]]}/>
    </Ch1>
  ),
  b13: ({n, T}) => (
    <Ch1 n={n} at={[-1, T("second of June")]}>
      <TornCard x={260} y={360} w={1400} h={290} start={T("roughly")} fill={C.white} rot={-1}>
        <Big x={700} y={185} text={"“roughly 50% of our volume”"} size={92} font={TYPE}/>
      </TornCard>
      <TypeLabel x={320} y={740} start={T("roughly", 10)} text="Q4 FY26 EARNINGS CALL · 2 JUN 2026" size={30} cps={3}/>
      <Stamp x={1450} y={790} start={T("assumed")} text="ASSUMED RESTART: JUNE" size={48} rot={-5}/>
    </Ch1>
  ),
  b14: ({n, T}) => (
    <Ch1 n={n} at={[-1, -1, T("eighteenth")]}>
      <Clip name="reject" x={210} y={430} w={1450} start={T("eighteenth")} hlAt={[T("was rejected")]}/>
      <Stamp x={1480} y={770} start={T("was rejected", 6)} text="REJECTED" size={80} rot={-8}/>
    </Ch1>
  ),
  b15: ({n, T}) => (
    <Ch1 n={n} at={[-1, -1, -1, T("twenty seventh"), T("thirtieth")]}>
      <Card x={230} y={370} w={680} h={420} start={T("twenty seventh")} rot={-1.5}
        lines={[["INFOMERICS · THE COMPANY", 80], ["BBB+ → BBB", 250], ["27 JUN 2026", 350, C.gray, "type"]]}/>
      <Card x={1010} y={370} w={680} h={420} start={T("thirtieth")} rot={1.5}
        lines={[["ICRA · TWO SUBSIDIARIES", 80], ["BBB → BBB-", 250], ["30 JUN 2026", 350, C.gray, "type"]]}/>
    </Ch1>
  ),
  b16: ({n, T}) => (
    <Ch1 n={n} at={[-1, -1, -1, -1, -1, T("twentieth")]}>
      <Clip name="bbplus" x={210} y={400} w={1450} start={T("twentieth")} hlAt={[T("double B plus"), T("double B plus", 8)]}/>
      <Stamp x={960} y={760} start={T("below investment")} text="BELOW INVESTMENT GRADE" size={66} rot={-4}/>
    </Ch1>
  ),
  b21: ({n, T}) => (
    <Svg frames={n}>
      <TypeLabel x={90} y={330} start={0} text="Q1 FY27" size={34} cps={3}/>
      <TypeLabel x={90} y={410} start={6} text="APR–JUN 2026" size={30} cps={3}/>
      <Strip x={260} y={540} start={T("shut for")} text="PLANT SHUT" size={48} fill={C.red} color={C.white}/>
      <Strip x={260} y={620} start={T("whole three")} text="ALL QUARTER" size={48} fill={C.red} color={C.white}/>
      <Clip name="results" x={500} y={150} w={1000} start={4} rot={0.8} hlAt={[T("June quarter"), T("June quarter", 4), T("June quarter", 8), T("June quarter", 12), T("June quarter", 16), T("June quarter", 20)]}/>
      <TypeLabel x={560} y={860} start={20} text="Q1 FY27 INVESTOR PRESENTATION · NSE" size={28} cps={3}/>
    </Svg>
  ),
  b22: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={960} y={170} start={0} text="TOTAL INCOME · APR–JUN QUARTER" size={66}/>
      <At a={T("from five")}>
        <Big x={560} y={560} text="₹530.1 CR" size={150} color={C.gray}/>
        <TypeLabel x={440} y={660} start={T("from five")} text="Q1 FY26" size={34} cps={3}/>
      </At>
      <Counter x={1360} y={560} start={T("fell to")} from={530.1} to={268.8} dur={36} decimals={1} prefix="₹" suffix=" CR" size={170} color={C.red}/>
      <TypeLabel x={1260} y={660} start={T("fell to")} text="Q1 FY27" size={34} cps={3}/>
      <Stamp x={960} y={820} start={T("a year earlier")} text="DOWN 49%" size={74} rot={-5}/>
    </Svg>
  ),
  b23: ({n, T}) => (
    <Svg frames={n}>
      {([["EBITDA", "₹72.1 CR", 15.2, "EBITDA", 150], ["PROFIT AFTER TAX", "₹42.1 CR", 1.6, "Profit after", 720], ["VOLUME", "45.79 LAKH CASES", -48, "Volume", 1290]] as const).map(([t, was, now, ph, x], i) => (
        <TornCard key={i} x={x} y={200} w={480} h={560} start={T(ph)} fill={i === 2 ? C.mustard : C.white} rot={[-1.5, 1, -1][i]}>
          <Big x={240} y={90} text={t} size={46}/>
          <Big x={240} y={200} text={i === 2 ? "Q1 FY27" : `WAS ${was}`} size={i === 2 ? 40 : 48} color={i === 2 ? C.ink : C.gray}/>
          {i < 2
            ? <Counter x={240} y={400} start={T(ph, 10)} from={i ? 42.1 : 72.1} to={now} dur={30} decimals={1} prefix="₹" size={150} color={C.red}/>
            : <Counter x={240} y={400} start={T(ph, 10)} from={0} to={-48} dur={24} suffix="%" size={170} color={C.red}/>}
          <Big x={240} y={490} text={i < 2 ? "CRORE" : "45.79 LAKH CASES"} size={40}/>
        </TornCard>
      ))}
    </Svg>
  ),
  b24: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={960} y={200} start={0} text="HOW MUCH REVENUE DID THE CLOSURE COST?" size={62}/>
      <Clip name="lost250" x={290} y={360} w={1300} start={T("management answered", -4)} hlAt={[T("I think")]}/>
      <TypeLabel x={340} y={700} start={T("I think")} text="Q1 FY27 EARNINGS CALL · 13 AUG 2026" size={30} cps={3}/>
      <Stamp x={1380} y={800} start={T("revenue.", -8)} text="≈ ₹250 CR LOST" size={60} rot={-5}/>
    </Svg>
  ),
  b25: ({n, T}) => (
    <Svg frames={n}>
      <Clip name="idle" x={290} y={130} w={1300} start={0} hlAt={[T("close to six")]}/>
      <Card x={250} y={470} w={660} h={360} start={T("close to six")} fill={C.mustard} rot={-1.5}
        lines={[["THE IDLE PLANT STILL COSTS", 80], ["₹6–7 CR", 220], ["PER QUARTER", 300, C.ink, "type"]]}/>
      <Card x={1010} y={470} w={660} h={360} start={T("About twenty five")} rot={1.5}
        lines={[["FINISHED GOODS IN THE PLANT", 80], ["≈ ₹25 CR", 220], ["STUCK", 300, C.red, "type"]]}/>
    </Svg>
  ),
  b26: ({n, T}) => {
    const rows: [string, number, string][] = [["BHOPAL", 15.2, "Fifteen point two"], ["HASSAN", 14.0, "fourteen million"], ["ODISHA", 9.0, "nine million"], ["UTTAR PRADESH", 10, "ten million"]];
    return (
      <Svg frames={n}>
        <Strip x={960} y={150} start={0} text="BEER CAPACITY · MILLION CASES A YEAR" size={58}/>
        {rows.map(([name, v, ph], i) => <Bar key={i} y={300 + i * 150} name={name} v={v} start={T(ph)} red={i === 0}/>)}
        <Stamp x={1560} y={250} start={T("Fifteen point two", 30)} text="LARGEST" size={50} rot={-8}/>
      </Svg>
    );
  },
  b31: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={960} y={150} start={0} text="WHY NOT SHIP IN FROM ELSEWHERE?" size={70}/>
      <Card x={1160} y={380} w={600} h={300} start={0} fill={C.white} rot={1.5} lines={[["MADHYA PRADESH", 90], ["BHOPAL", 220, C.red]]}/>
      {([["HASSAN", 300], ["ODISHA", 520], ["UTTAR PRADESH", 740]] as const).map(([t, y], i) => (
        <g key={t}>
          <Card x={150} y={y - 60} w={460} h={150} start={T("other breweries", i * 5)} rot={[-2, 1, -1][i]} lines={[["", 0], [t, 110]]}/>
          <Pin x={590} y={y} start={T("other breweries", 6 + i * 5)}/>
          <RedString pts={[[590, y - 40], [1170, 530]]} start={T("It did look")}/>
        </g>
      ))}
    </Svg>
  ),
  b32: ({n, T}) => (
    <Svg frames={n}>
      <Clip name="importfee" x={190} y={200} w={1500} start={0} hlAt={[T("is exorbitant"), T("loss")]}/>
      <TypeLabel x={250} y={650} start={10} text="Q1 FY27 EARNINGS CALL · 13 AUG 2026" size={30} cps={3}/>
      <Stamp x={640} y={810} start={T("at a loss")} text="AT A LOSS" size={90} rot={-6}/>
      <Stamp x={1300} y={830} start={T("import fee")} text="IMPORT FEES" size={90} rot={5}/>
    </Svg>
  ),
  // Hand-drawn moment 2: two states, a toll gate between them.
  b33: ({n, T}) => (
    <Svg frames={n}>
      <TornCard x={160} y={110} w={1600} h={740} start={0} fill={C.paper} rot={0.5}>
        <HDraw shape={sh.rect(80, 200, 400, 300)} start={T("economics", -10)} dur={18}/>
        <HWrite x={280} y={370} start={T("economics", 6)} size={46} anchor="middle" hand={false}>another state</HWrite>
        <HDraw shape={sh.rect(1120, 200, 400, 300)} start={T("economics", 14)} dur={18}/>
        <HWrite x={1320} y={350} start={T("economics", 30)} size={46} anchor="middle" hand={false}>Madhya</HWrite>
        <HWrite x={1320} y={410} start={T("economics", 30)} size={46} anchor="middle" hand={false}>Pradesh</HWrite>
        <HDraw shape={sh.line(490, 350, 1100, 350, {strokeWidth: 5})} start={T("move")} dur={16}/>
        <HDraw shape={sh.line(1100, 350, 1060, 320, {strokeWidth: 5})} start={T("move", 16)} dur={5} hand={false}/>
        <HDraw shape={sh.line(1100, 350, 1060, 380, {strokeWidth: 5})} start={T("move", 18)} dur={5} hand={false}/>
        <HDraw shape={sh.line(795, 230, 795, 470, {stroke: HRED, strokeWidth: 9})} start={T("charges heavily")} dur={12}/>
        <HWrite x={795} y={190} start={T("charges heavily", 10)} size={52} color={HRED} anchor="middle">import fee</HWrite>
        <HWrite x={800} y={640} start={T("Each state")} size={50} anchor="middle">make · move · sell: the state decides</HWrite>
      </TornCard>
    </Svg>
  ),
  b34: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={960} y={380} start={0} text="A LICENSED LOCAL PLANT = REAL ADVANTAGE" size={72}/>
      <Strip x={960} y={600} start={T("And it can")} text="ONE STATE ORDER CAN SWITCH IT OFF" size={72} fill={C.red} color={C.white} rot={-1}/>
    </Svg>
  ),
  b41: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={480} y={150} start={0} text="UTILISATION · Q1" size={58}/>
      <Gauge x={230} label="HASSAN" pct={60} start={T("sixty")}/>
      <Gauge x={560} label="ODISHA" pct={70} start={T("seventy")}/>
      <Strip x={1400} y={150} start={T("case sales")} text="CASE SALES GROWTH" size={58}/>
      <Card x={1050} y={270} w={700} h={260} start={T("thirty")} rot={-1.5} lines={[["KARNATAKA", 80], ["ABOUT +30%", 200, C.red]]}/>
      <Card x={1050} y={580} w={700} h={260} start={T("close to forty")} rot={1.5} lines={[["ODISHA", 80], ["CLOSE TO +40%", 200, C.red]]}/>
    </Svg>
  ),
  b42: ({n, T}) => (
    <Svg frames={n}>
      <Card x={160} y={220} w={800} h={520} start={0} rot={-1.2}
        lines={[["NEW UTTAR PRADESH BREWERY", 90], ["≈ ₹300 CR", 270], ["NO NEW EXTERNAL DEBT", 400, C.ink, "type"]]}/>
      <Stamp x={560} y={820} start={T("started commercial")} text="IN PRODUCTION" size={60} rot={-5}/>
      <Counter x={1440} y={540} start={T("Gross debt")} from={0} to={0.31} dur={26} decimals={2} suffix="x" size={240}/>
      <TypeLabel x={1150} y={680} start={T("Gross debt", 6)} text="GROSS DEBT / EQUITY · JUNE" size={32} cps={3}/>
    </Svg>
  ),
  b43: ({n, T}) => (
    <Svg frames={n}>
      <TornCard x={410} y={150} w={1100} h={680} start={0} fill={C.paper} rot={-0.8}>
        <Big x={550} y={110} text="5 SEP 2026 · BOARD APPROVAL" size={34} font={TYPE}/>
        <Big x={550} y={200} text="PROMOTER WARRANTS" size={64}/>
        <At a={T("worth about")}><Big x={550} y={380} text="≈ ₹25 CR" size={170} color={C.red}/></At>
        <At a={T("seventy seven")}><Big x={550} y={500} text="AT ₹77.81 EACH" size={72}/></At>
        <At a={T("Deepak Arora", -6)}><Big x={550} y={600} text="TO DEEPAK ARORA, PROMOTER" size={40} font={TYPE}/></At>
      </TornCard>
      <Pin x={960} y={190} start={4}/>
    </Svg>
  ),
  b51: ({n, T}) => (
    <Bear n={n} cur={0} at={0}>
      <Big x={1440} y={330} text="COURT DEADLINE" size={44}/>
      <At a={T("fifteen days")}><Big x={1440} y={520} text="≈ 9 OCT" size={170} color={C.red}/></At>
      <Stamp x={1440} y={720} start={T("None of")} text="RESTART DATE: NOT STATED" size={44} rot={-5}/>
    </Bear>
  ),
  b52: ({n, T}) => (
    <Bear n={n} cur={1} at={0}>
      <Big x={1440} y={500} text="APPEAL?" size={190}/>
      <Stamp x={1440} y={700} start={T("do not say")} text="NOT STATED" size={70} rot={-6}/>
    </Bear>
  ),
  b53: ({n, T}) => (
    <Bear n={n} cur={2} at={0}>
      <TypeLabel x={1040} y={230} start={T("investor")} text="AUGUST CALL · MANAGEMENT" size={32} cps={3}/>
      <TornCard x={1000} y={290} w={860} h={260} start={T("Management agreed", -4)} fill={C.white} rot={-1.5}>
        <Big x={430} y={115} text={"\u201CIt is a long haul."} size={62} font={TYPE}/>
        <Big x={430} y={200} text={"It is not easy.\u201D"} size={62} font={TYPE}/>
      </TornCard>
      <Clip name="longhaul" x={1010} y={610} w={820} start={T("Management agreed", 10)} rot={1} hlAt={[T("long haul", -6)]}/>
    </Bear>
  ),
  b54: ({n, T}) => (
    <Bear n={n} cur={3} at={0}>
      <Card x={1080} y={200} w={700} h={330} start={2} rot={-1.5} lines={[["INFOMERICS · LONG-TERM RATING", 80], ["BB+", 240, C.red]]}/>
      <Clip name="bbplus" x={1000} y={600} w={840} start={T("Infomerics")} rot={1} hlAt={[T("double B plus"), T("double B plus", 6)]}/>
      <Stamp x={1640} y={560} start={T("August")} text="20 AUG 2026" size={44} rot={-6}/>
    </Bear>
  ),
  b55: ({n, T}) => (
    <Bear n={n} cur={4} at={0}>
      <Card x={1020} y={300} w={400} h={170} start={T("Karnataka")} rot={-2} lines={[["", 0], ["KARNATAKA", 120]]}/>
      <Card x={1450} y={330} w={400} h={170} start={T("Odisha")} rot={2} lines={[["", 0], ["ODISHA", 120]]}/>
      <Pin x={1220} y={320} start={T("Karnataka", 4)}/>
      <Pin x={1650} y={350} start={T("Odisha", 4)}/>
      <TypeLabel x={1060} y={640} start={T("same kind")} text="SAME KIND OF LICENCE" size={36} cps={3}/>
      <TypeLabel x={1060} y={720} start={T("same kind", 24)} text="THAT BHOPAL LOST" size={36} cps={3}/>
    </Bear>
  ),
  b61: ({n, T}) => (
    <Svg frames={n}>
      <Card x={660} y={110} w={600} h={180} start={0} rot={-1} lines={[["", 0], ["THE LICENCE", 125]]}/>
      <RedString pts={[[860, 290], [560, 440]]} start={T("the moat")}/>
      <RedString pts={[[1060, 290], [1360, 440]]} start={T("biggest")}/>
      <Card x={240} y={430} w={640} h={300} start={T("the moat")} rot={-2} fill={C.mustard} lines={[["", 0], ["THE MOAT", 190]]}/>
      <Card x={1040} y={430} w={640} h={300} start={T("biggest")} rot={2} lines={[["", 0], ["THE BIGGEST RISK", 190, C.red]]}/>
      <Stamp x={560} y={790} start={T("restores")} text="RESTORED" size={60} rot={-6}/>
      <Stamp x={1360} y={790} start={T("does not remove")} text="STILL THERE" size={60} rot={5}/>
    </Svg>
  ),
  // Hand-drawn moment 3: the watch list, ticked off as it is read.
  b62: ({n, T}) => {
    const items: [string, string][] = [["The renewal (due ~9 Oct)", "actual renewal"], ["First quarter with Bhopal back", "first quarter"],
      ["Any appeal by the state", "Any appeal"], ["Do the ratings recover?", "ratings recover"]];
    return (
      <Svg frames={n}>
        <TornCard x={330} y={90} w={1260} h={800} start={0} fill={C.paper} rot={-0.8}>
          <HWrite x={110} y={140} start={2} size={76} color={HRED}>Watch:</HWrite>
          {items.map(([t, ph], i) => (
            <g key={i}>
              <HDraw shape={sh.rect(110, 215 + i * 140, 60, 60, {seed: 20 + i})} start={T(ph, -8)} dur={8}/>
              <HWrite x={210} y={265 + i * 140} start={T(ph)} size={54} hand={false}>{t}</HWrite>
            </g>
          ))}
        </TornCard>
      </Svg>
    );
  },
  b63: ({n, T}) => (
    <Svg frames={n}>
      <TypeLabel x={560} y={220} start={0} text="JUNE GUIDANCE · SALES" size={38} cps={3}/>
      <At a={T("fourteen hundred", -4)}><Big x={960} y={470} text="≈ ₹1,400 CR" size={200}/></At>
      <Strip x={960} y={630} start={T("assumed")} text="ASSUMED 9 MONTHS OF BHOPAL" size={70}/>
      <Stamp x={960} y={820} start={T("already been lost", -4)} text="THAT TIME IS ALREADY LOST" size={64} rot={-4}/>
    </Svg>
  ),
  b70: ({n}) => {
    const src = ["[J] High Court judgment intimation · 26 Sep 2026", "[F] Licence suspension · 5 Feb 2026", "[Q4] Q4 FY26 earnings call · 2 Jun 2026",
      "[R] Licence rejection · 19 Jun 2026", "[I1] Infomerics rating · 27 Jun 2026", "[I2] ICRA ratings of subsidiaries · 30 Jun 2026",
      "[P] Q1 FY27 investor presentation · 12 Aug 2026", "[Q1] Q1 FY27 earnings call · 13 Aug 2026", "[I3] Infomerics rating · 20 Aug 2026",
      "[W] Promoter warrants · 5 Sep 2026"];
    return (
      <Svg frames={n}>
        <Strip x={960} y={120} start={0} text="SOURCES · SOM DISTILLERIES' OWN FILINGS ON NSE" size={56}/>
        {src.map((s, i) => <TypeLabel key={i} x={420} y={250 + i * 64} start={6 + i * 6} text={s} size={28} cps={5}/>)}
      </Svg>
    );
  },
  b71: ({n}) => (
    <Svg frames={n}>
      <Strip x={960} y={300} start={0} text="MOAT & MARGIN" size={120}/>
      <TypeLabel x={440} y={540} start={10} text="Educational research, not investment advice." size={36} cps={3}/>
      <TypeLabel x={440} y={630} start={50} text="Not a SEBI-registered Research Analyst or Investment Adviser." size={36} cps={3}/>
      <TypeLabel x={440} y={720} start={110} text="moatmarginresearch.com" size={36} cps={3}/>
    </Svg>
  ),
};

const Bar: React.FC<{y: number; name: string; v: number; start: number; red?: boolean}> = ({y, name, v, start, red}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = f < start ? 0 : spring({frame: f - start, fps, config: {damping: 16, stiffness: 120}});
  return (
    <g>
      <Big x={470} y={y + 55} text={name} size={52} anchor="end"/>
      <rect x={510} y={y} width={v * 75 * s} height={80} fill={red ? C.red : C.ink}/>
      {s > 0.9 && <Big x={530 + v * 75} y={y + 58} text={v.toFixed(1)} size={56} anchor="start" color={red ? C.red : C.ink}/>}
    </g>
  );
};
const Gauge: React.FC<{x: number; label: string; pct: number; start: number}> = ({x, label, pct, start}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = f < start ? 0 : spring({frame: f - start, fps, config: {damping: 16, stiffness: 110}});
  const H = 520, top = 250;
  return (
    <g>
      <rect x={x} y={top} width={200} height={H} fill={C.white} stroke={C.ink} strokeWidth={5}/>
      <rect x={x} y={top + H * (1 - pct / 100 * s)} width={200} height={H * pct / 100 * s} fill={C.mustard}/>
      <Big x={x + 100} y={top + H + 70} text={label} size={50}/>
      {s > 0.5 && <Big x={x + 100} y={top + H * (1 - pct / 100) - 20} text={`~${pct}%`} size={64}/>}
    </g>
  );
};
const BEAR = ["RENEWAL ORDER ≠ RUNNING PLANT", "THE STATE MAY NOT BE FINISHED", "LOST DRINKERS MAY NOT RETURN FAST",
  "RATINGS STILL BELOW INVESTMENT GRADE", "SAME LICENCE RISK, OTHER STATES"];
const Bear: React.FC<{n: number; cur: number; at: number; children?: React.ReactNode}> = ({n, cur, at, children}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <Svg frames={n}>
      {BEAR.slice(0, cur + 1).map((t, i) => {
        const s = i < cur ? 1 : spring({frame: f - at, fps, config: {damping: 12, stiffness: 160}});
        const on = i === cur;
        return (
          <g key={i} transform={`translate(${(1 - s) * -400} 0)`}>
            <rect x={70} y={170 + i * 140} width={880} height={100} fill={on ? C.red : C.white} style={{filter: "url(#vshadow)"}}/>
            <Big x={120} y={238 + i * 140} text={String(i + 1)} size={60} color={on ? C.white : C.gray} anchor="middle"/>
            <Big x={170} y={236 + i * 140} text={t} size={44} color={on ? C.white : C.ink} anchor="start"/>
          </g>
        );
      })}
      {children}
    </Svg>
  );
};

// Captions for muted viewing: short cues timed across the voiced part of the beat.
export const cueTimes = (b: Beat) => {
  const v = b.sec * LFPS, tot = b.cues.reduce((a, c) => a + c.length, 0);
  let acc = 0;
  return b.cues.map((c) => { const a = Math.round(acc / tot * v); acc += c.length; return {text: c, a, b: Math.round(acc / tot * v)}; });
};
const Captions16: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  const ts = cueTimes(b);
  const cur = ts.find((t) => f < t.b) ?? ts[ts.length - 1];
  return (
    <div style={{position: "absolute", left: 160, right: 160, bottom: 44, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.8)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: 40, lineHeight: 1.35, padding: "6px 16px", borderRadius: 8}}>{cur.text}</span>
    </div>
  );
};

// Top rail (chapter progress) and chapter tag, on the absolute timeline.
const chStart = CHAPTERS.map((_, c) => lStarts[beats.findIndex((b) => b.ch === c)]);
const Furniture: React.FC = () => {
  const f = useCurrentFrame();
  const ch = chStart.reduce((a, s, i) => (f >= s ? i : a), 0);
  const i = lStarts.reduce((a, s, k) => (f >= s ? k : a), 0);
  const showTag = ch > 0 && ch < 7 && !isTitle(beats[i]);
  return (
    <svg width={LW} height={LH} style={{position: "absolute"}}>
      {CHAPTERS.map((_, c) => {
        const a = chStart[c], b = c + 1 < CHAPTERS.length ? chStart[c + 1] : lTotal;
        const x0 = a / lTotal * LW, x1 = b / lTotal * LW, p = Math.max(0, Math.min(1, (f - a) / (b - a)));
        return <g key={c}><rect x={x0 + 2} y={0} width={x1 - x0 - 4} height={10} fill="#00000022"/><rect x={x0 + 2} y={0} width={(x1 - x0 - 4) * p} height={10} fill={c === ch ? C.red : C.ink}/></g>;
      })}
      {showTag && (
        <g>
          <rect x={36} y={30} width={CHAPTERS[ch].length * 15 + 110} height={44} fill={C.ink}/>
          <text x={52} y={61} fontFamily={TYPE} fontSize={24} fill={C.white}>{`CH ${ch} · ${CHAPTERS[ch].toUpperCase()}`}</text>
        </g>
      )}
      <text x={1880} y={62} fontFamily={TYPE} fontSize={24} fill={C.ink} opacity={0.6} textAnchor="end">Moat &amp; Margin · from the filings</text>
    </svg>
  );
};

export const SomLong: React.FC = () => (
  <AbsoluteFill style={{background: C.tan}}>
    <VoxFonts/>
    <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
    {beats.map((b, i) => {
      const n = lBeatFrames[i];
      const Scene = isTitle(b) ? ((p: SP) => <ChapterCard ch={b.ch} n={p.n}/>) : S[b.key];
      return (
        <Sequence key={b.key} from={lStarts[i]} durationInFrames={n}>
          <AbsoluteFill><Scene n={n} T={makeT(b)}/></AbsoluteFill>
          {b.key !== "b71" && <Captions16 b={b} n={n}/>}
          <Audio src={staticFile(`long/${b.key}.mp3`)}/>
        </Sequence>
      );
    })}
    <Furniture/>
  </AbsoluteFill>
);
