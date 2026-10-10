// Q2 bank napkin Shorts, set 2 (4 Oct 2026). Indian-accent narrator, loop endings.
// Storyline: hook → CLUE 1 → CLUE 2 → THE TWIST → VERDICT stamp (GOOD/WATCH/CONCERN, on the filing, not the stock) → loop.
// bkd BoB · bke Union · bkf BoI · bkg CSB+Dhanlaxmi · bkh ESAF · bki Equitas · bkj J&K · bkk AU.
// Figures: each bank's Q2 FY27 business update on NSE (1–3 Oct 2026). "our maths" marks our arithmetic on filed figures.
// Fact sheet: out/vx/bank-q2-forensic-scripts-v2.md
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import bkd from "../../public/hand/bkd/beats.json";
import bke from "../../public/hand/bke/beats.json";
import bkf from "../../public/hand/bkf/beats.json";
import bkg from "../../public/hand/bkg/beats.json";
import bkh from "../../public/hand/bkh/beats.json";
import bki from "../../public/hand/bki/beats.json";
import bkj from "../../public/hand/bkj/beats.json";
import bkk from "../../public/hand/bkk/beats.json";
import bkl from "../../public/hand/bkl/beats.json";
import bkm from "../../public/hand/bkm/beats.json";
import bkn from "../../public/hand/bkn/beats.json";
import bko from "../../public/hand/bko/beats.json";
import bkp from "../../public/hand/bkp/beats.json";
import bkq from "../../public/hand/bkq/beats.json";
import bkr from "../../public/hand/bkr/beats.json";
import bks from "../../public/hand/bks/beats.json";
import bkt from "../../public/hand/bkt/beats.json";
import {Captions, HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";

export const BFPS2 = 30;
const PAD = 0.15;
type B = {key: string; text: string; sec: number};
const frames = (bs: B[]) => bs.map((b) => Math.ceil((b.sec + PAD) * BFPS2));
export const bkTotal2 = (bs: B[]) => frames(bs).reduce((a, b) => a + b, 0);
export const BK2 = {bkd, bke, bkf, bkg, bkh, bki, bkj, bkk, bkl, bkm, bkn, bko, bkp, bkq, bkr, bks, bkt} as Record<string, B[]>;

const GOLD = "#b8860b", AMBER = "#e67700", GREY = "#555";
const FILL: Record<string, string> = {[GREEN]: "rgba(43,138,62,0.18)", [RED]: "rgba(217,72,15,0.18)", [BLUE]: "rgba(28,100,184,0.18)",
  [GOLD]: "rgba(201,151,0,0.25)", [AMBER]: "rgba(230,119,0,0.18)", [INK]: "rgba(0,0,0,0.08)"};

const atOf = (b: B) => (p: string, off = 0) => {
  const i = b.text.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * BFPS2 * i / b.text.length) + off;
};
type SceneP = {b: B};
const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);
const Napkin: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -2}) => (
  <g transform={`rotate(${rot} 540 930)`}>
    <rect x={80} y={360} width={920} height={1170} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 18}, (_, i) => <line key={i} x1={80} y1={440 + i * 60} x2={1000} y2={440 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);
// Stamp tag for CLUE 1 / CLUE 2 / THE TWIST, on screen from the beat's first frame.
const Tag: React.FC<{t: string; color?: string}> = ({t, color = RED}) => (
  <g transform="rotate(-3 540 290)">
    <rect x={370} y={238} width={340} height={92} fill="#fffef6" opacity={0.9}/>
    <HDraw shape={sh.rect(370, 238, 340, 92, {stroke: color, strokeWidth: 6, seed: t.length + 3})} start={-9} dur={6} hand={false}/>
    <HWrite x={540} y={304} start={-9} dur={6} size={54} anchor="middle" color={color} hand={false}>{t}</HWrite>
  </g>
);
// Static text visible from frame 1 (hooks).
const T: React.FC<{x?: number; y: number; size?: number; color?: string; mid?: boolean; children: string}> = ({x = 540, y, size = 64, color = INK, mid = true, children}) => (
  <HWrite x={x} y={y} start={-9} dur={8} size={size} color={color} anchor={mid ? "middle" : "start"} hand={false}>{children}</HWrite>
);
// Horizontal bar with a label row above it.
const Bar: React.FC<{y: number; val: number; max: number; color: string; start: number; label: string; v: string; seed?: number}> =
  ({y, val, max, color, start, label, v, seed = 1}) => (
  <>
    <HWrite x={150} y={y - 22} start={start} size={50} color={color}>{label}</HWrite>
    <HDraw shape={sh.rect(150, y, Math.max(10, val / max * 760), 96, {stroke: color, strokeWidth: 6, seed, fill: FILL[color], fillStyle: "hachure"})} start={start} dur={14}/>
    <HWrite x={Math.min(150 + Math.max(10, val / max * 760) + 24, 1040 - v.length * 62 * 0.62)} y={Math.min(150 + Math.max(10, val / max * 760) + 24, 1040 - v.length * 62 * 0.62) < 150 + val / max * 760 ? y - 22 : y + 72} start={start + 8} size={62} color={color}>{v}</HWrite>
  </>
);
const VCOL: Record<string, string> = {GOOD: GREEN, WATCH: AMBER, CONCERN: RED};
const Verdict: React.FC<{pick: "GOOD" | "WATCH" | "CONCERN"; start: number; y?: number; q?: boolean}> = ({pick, start, y = 690, q = false}) => {
  const xs = [90, 400, 710], w = 280, h = 120;
  const i = ["GOOD", "WATCH", "CONCERN"].indexOf(pick); const px = xs[i], pc = VCOL[pick];
  return (
    <>
      <g transform={`rotate(-4 540 ${y})`}>
        <HWrite x={540} y={y} start={start} dur={6} size={60} anchor="middle" color={INK} hand={false}>VERDICT</HWrite>
      </g>
      {["GOOD", "WATCH", "CONCERN"].map((o, k) => (
        <React.Fragment key={o}>
          <HDraw shape={sh.rect(xs[k], y + 40, w, h, {stroke: VCOL[o], strokeWidth: o === pick ? 10 : 4, seed: 70 + k,
            fill: o === pick ? FILL[VCOL[o]] : undefined, fillStyle: "hachure"})} start={start + 2 + k * 2} dur={8} hand={false}/>
          <HWrite x={xs[k] + w / 2} y={y + 122} start={start + 4 + k * 2} dur={6} size={o === pick ? 54 : 44} anchor="middle" color={VCOL[o]} hand={false}>{o}</HWrite>
        </React.Fragment>
      ))}
      <HDraw shape={sh.line(px + w - 80, y + 30, px + w - 45, y + 70, {stroke: pc, strokeWidth: 12, seed: 81})} start={start + 14} dur={5}/>
      <HDraw shape={sh.line(px + w - 45, y + 70, px + w + 15, y - 20, {stroke: pc, strokeWidth: 12, seed: 82})} start={start + 19} dur={6}/>
      {q ? <HWrite x={px + w + 18} y={y + 150} start={start + 24} size={100} color={pc}>?</HWrite> : null}
      <HWrite x={540} y={y + 232} start={start + 8} dur={6} size={34} anchor="middle" color={GREY} hand={false}>a verdict on the filing, not on the stock</HWrite>
    </>
  );
};
const Loop: React.FC<{start: number}> = ({start}) => (
  <>
    <HDraw shape={sh.arc(540, 1330, 420, 230, Math.PI * 0.1, Math.PI * 1.75, {stroke: BLUE, strokeWidth: 7, seed: 99})} start={start} dur={16}/>
    <HWrite x={540} y={1350} start={start + 6} size={54} anchor="middle" color={BLUE}>back to the napkin</HWrite>
  </>
);
const Note: React.FC<{y: number; start: number; children: string; x?: number}> = ({y, start, children, x = 540}) => (
  <HWrite x={x} y={y} start={start} dur={8} size={36} anchor="middle" color={GREY} hand={false}>{children}</HWrite>
);

// ---------------- bkd: Bank of Baroda (v2) ----------------
const D1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={480} size={92}>Bank of Baroda</T>
    <T y={650} size={62}>its savers:</T>
    <T y={790} size={130} color={BLUE}>INDIA</T>
    <T y={960} size={62}>fastest-growing borrowers:</T>
    <T y={1130} size={130} color={RED}>ABROAD</T>
    <HDraw shape={sh.ellipse(540, 1090, 560, 200, {stroke: RED, strokeWidth: 8, seed: 11})} start={at("aren't")} dur={12}/>
  </Canvas>
);};
const D2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>in India · one year · ₹ crore</HWrite>
    <HWrite x={140} y={660} start={at("deposits")} size={60}>deposits</HWrite>
    <HWrite x={560} y={660} start={at("deposits", 4)} size={76} color={GREEN}>+2,16,398</HWrite>
    <HWrite x={140} y={800} start={at("deposits", 12)} size={60}>loans</HWrite>
    <HWrite x={560} y={800} start={at("deposits", 16)} size={76}>−1,41,425</HWrite>
    <HDraw shape={sh.line(120, 850, 960, 850, {strokeWidth: 7, seed: 21})} start={at("seventy five")} dur={10}/>
    <HWrite x={140} y={1010} start={at("seventy five", 4)} size={70} color={BLUE}>spare</HWrite>
    <HWrite x={480} y={1010} start={at("seventy five", 8)} size={120} color={BLUE} dur={16}>+74,973</HWrite>
    <HWrite x={140} y={1120} start={at("more than loans")} dur={8} size={38} color={GREY} hand={false}>domestic figures as filed · gap is our maths</HWrite>
  </Napkin></Canvas>
);};
const D3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/><Napkin rot={1.5}>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>abroad · one year · ₹ crore</HWrite>
    <HWrite x={140} y={660} start={at("loans grew")} size={60}>loans</HWrite>
    <HWrite x={560} y={660} start={at("loans grew", 4)} size={76} color={RED}>+92,163</HWrite>
    <HWrite x={140} y={800} start={at("loans grew", 12)} size={60}>deposits</HWrite>
    <HWrite x={560} y={800} start={at("loans grew", 16)} size={76}>−34,852</HWrite>
    <HDraw shape={sh.line(120, 850, 960, 850, {strokeWidth: 7, seed: 22})} start={at("fifty seven")} dur={10}/>
    <HWrite x={140} y={1010} start={at("fifty seven", 4)} size={70} color={RED}>short</HWrite>
    <HWrite x={480} y={1010} start={at("fifty seven", 8)} size={120} color={RED} dur={16}>57,311</HWrite>
    <HWrite x={140} y={1120} start={at("more than deposits")} dur={8} size={38} color={GREY} hand={false}>our maths: global − domestic</HWrite>
  </Napkin></Canvas>
);};
const D4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={480} start={0} size={64} anchor="middle">overseas loans are</HWrite>
    <HWrite x={290} y={720} start={at("a fifth")} size={150} anchor="middle" color={BLUE}>21.5%</HWrite>
    <HWrite x={290} y={810} start={at("a fifth", 4)} size={50} anchor="middle">of the book</HWrite>
    <HWrite x={540} y={960} start={at("but forty")} size={100} anchor="middle">→</HWrite>
    <HWrite x={790} y={1160} start={at("forty percent")} size={150} anchor="middle" color={RED}>39.5%</HWrite>
    <HWrite x={790} y={1250} start={at("forty percent", 4)} size={50} anchor="middle">of the growth</HWrite>
    <HDraw shape={sh.ellipse(790, 1175, 460, 320, {stroke: RED, strokeWidth: 7, seed: 41})} start={at("of the growth")} dur={12}/>
    <Note y={1400} start={at("of the growth")}>our maths on Baroda's filed figures</Note>
  </Canvas>
);};
const D5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={470} start={0} size={90} anchor="middle" color={RED}>bad?</HWrite>
    <HWrite x={540} y={580} start={at("Not by itself")} size={70} anchor="middle">not by itself.</HWrite>
    <HDraw shape={sh.ellipse(540, 975, 860, 420, {stroke: BLUE, strokeWidth: 10, seed: 51})} start={at("The moat")} dur={16}/>
    <HDraw shape={sh.rect(330, 830, 420, 250, {strokeWidth: 6, seed: 52})} start={at("The moat", 6)} dur={12}/>
    <HWrite x={540} y={710} start={at("moat is at home")} size={60} anchor="middle" color={BLUE}>the moat</HWrite>
    <HWrite x={540} y={930} start={at("Indians")} size={52} anchor="middle">India deposits</HWrite>
    <HWrite x={540} y={1030} start={at("Indians", 6)} size={80} anchor="middle" color={GREEN}>+17.0%</HWrite>
    <HWrite x={540} y={1260} start={at("than it lends")} size={52} anchor="middle">India loans +13.5%</HWrite>
    <Note y={1340} start={at("than it lends")}>domestic deposits vs domestic advances · filed</Note>
  </Canvas>
);};
const D6: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={66} anchor="middle" color={BLUE}>abroad: who borrows?</HWrite>
    <HWrite x={540} y={560} start={at("what do they pay")} size={66} anchor="middle" color={BLUE}>what do they pay?</HWrite>
    <Verdict pick="WATCH" start={at("Who borrows")}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bke: Union Bank ----------------
const E1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={480} size={92}>Union Bank</T>
    <T y={620} size={64}>lent</T>
    <T y={850} size={240} color={RED}>₹213</T>
    <T y={990} size={70}>for every ₹100 it raised</T>
    <HDraw shape={sh.ellipse(540, 780, 640, 280, {stroke: RED, strokeWidth: 8, seed: 12})} start={at("every hundred")} dur={12}/>
    <HWrite x={540} y={1160} start={at("raised")} size={58} anchor="middle" color={BLUE}>highest of 22 banks</HWrite>
  </Canvas>
);};
const E2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>growth in one year · ₹ crore</HWrite>
    <Bar y={660} val={180723} max={180723} color={RED} start={at("loans grew")} label="loans" v="" seed={13}/>
    <HWrite x={420} y={638} start={at("one lakh")} size={70} color={RED}>+1,80,723</HWrite>
    <Bar y={960} val={84836} max={180723} color={BLUE} start={at("Deposits grew")} label="deposits" v="+84,836" seed={14}/>
    <Note y={1200} start={at("eighty five")}>global, as filed</Note>
  </Napkin></Canvas>
);};
const E3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={470} start={0} size={58} anchor="middle">it skipped the costly deposits</HWrite>
    <Bar y={700} val={3.1} max={20} color={RED} start={at("Fixed deposits")} label="fixed deposits*" v="+3.1%" seed={15}/>
    <Bar y={1000} val={14.66} max={20} color={GREEN} start={at("Cheap CASA")} label="CASA (cheap)" v="+14.7%" seed={16}/>
    <Note y={1250} start={at("Cheap CASA")}>*term deposits = domestic deposits − CASA · our maths</Note>
  </Canvas>
);};
const E4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={480} start={0} size={66} anchor="middle" color={GREEN}>cheaper money ✓</HWrite>
    <HWrite x={540} y={580} start={at("not enough")} size={66} anchor="middle" color={RED}>not enough of it ✗</HWrite>
    <HWrite x={540} y={780} start={at("loan to deposit")} size={56} anchor="middle">loan-to-deposit ratio</HWrite>
    <HWrite x={270} y={960} start={at("seventy seven")} size={140} anchor="middle">77%</HWrite>
    <HWrite x={540} y={950} start={at("to eighty")} size={100} anchor="middle">→</HWrite>
    <HWrite x={810} y={960} start={at("eighty four")} size={140} anchor="middle" color={RED}>84%</HWrite>
    <Note y={1060} start={at("eighty four")}>domestic CD ratio · filed · Sep 25 → Sep 26</Note>
  </Canvas>
);};
const E5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={62} anchor="middle" color={RED}>smart funding, thinner cushion</HWrite>
    <HWrite x={540} y={560} start={at("Can deposits")} size={64} anchor="middle" color={BLUE}>can deposits catch up?</HWrite>
    <Verdict pick="WATCH" start={at("Smart")+4}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkf: Bank of India ----------------
const F1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={480} size={92}>Bank of India</T>
    <T y={740} size={136} color={GREEN}>+₹75,255 Cr</T>
    <T y={860} size={70}>deposits in 90 days</T>
    <HDraw shape={sh.ellipse(540, 690, 900, 260, {stroke: GREEN, strokeWidth: 8, seed: 17})} start={at("ninety days")} dur={12}/>
    <Note y={980} start={0}>India deposits, 30 Jun → 30 Sep 2026 · filed</Note>
  </Canvas>
);};
const F2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/>
    <HWrite x={540} y={760} start={at("forty four")} size={240} anchor="middle" color={GREEN}>44%</HWrite>
    <HWrite x={540} y={870} start={at("whole year")} size={56} anchor="middle">of the whole year's deposit growth</HWrite>
    <HDraw shape={sh.rect(150, 960, 780, 110, {strokeWidth: 5, seed: 18})} start={at("whole year")} dur={10}/>
    <HDraw shape={sh.rect(150 + 780 * 0.558, 960, 780 * 0.442, 110, {stroke: GREEN, strokeWidth: 6, seed: 19, fill: FILL[GREEN], fillStyle: "hachure"})} start={at("in one quarter")} dur={12}/>
    <HWrite x={540} y={1190} start={at("in one quarter")} size={70} anchor="middle" color={RED}>in one quarter</HWrite>
    <Note y={1280} start={at("in one quarter")}>our maths: ₹75,255 ÷ ₹1,70,120 Cr (India deposits)</Note>
  </Canvas>
);};
const F3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>India · Jun → Sep 2026 · ₹ crore</HWrite>
    <HWrite x={140} y={680} start={0} size={60}>deposits in</HWrite>
    <HWrite x={560} y={680} start={0} size={80} color={GREEN}>+75,255</HWrite>
    <HWrite x={140} y={840} start={at("lent only")} size={60}>loans out</HWrite>
    <HWrite x={560} y={840} start={at("twenty nine")} size={80} color={BLUE}>+29,252</HWrite>
    <HDraw shape={sh.ellipse(700, 815, 380, 130, {stroke: BLUE, strokeWidth: 6, seed: 20})} start={at("in India")} dur={10}/>
    <Note y={1000} start={at("twenty nine")}>domestic deposits and gross advances · filed</Note>
  </Napkin></Canvas>
);};
const F4: React.FC<SceneP> = ({b}) => { const at = atOf(b); const t0 = at("fastest");
  const rows: [string, string][] = [["Bank of India", "21.60%"], ["Bank of Baroda", "16.75%"], ["UCO", "14.05%"], ["Canara", "13.13%"],
    ["Punjab & Sind", "12.98%"], ["Indian Bank", "12.4%"], ["PNB", "9.90%"], ["Union", "6.87%"]];
  return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={450} start={0} size={52} anchor="middle">loan-to-deposit ratio (India)</HWrite>
    <HWrite x={290} y={600} start={at("eighty two")} size={120} anchor="middle">82%</HWrite>
    <HWrite x={540} y={590} start={at("to seventy")} size={90} anchor="middle">→</HWrite>
    <HWrite x={790} y={600} start={at("seventy eight")} size={120} anchor="middle" color={GREEN}>78%</HWrite>
    <Note y={670} start={at("seventy eight")}>our maths: domestic advances ÷ domestic deposits</Note>
    <HWrite x={540} y={800} start={t0} size={50} anchor="middle" color={BLUE}>deposit growth · 8 govt banks reported</HWrite>
    {rows.map(([n, v], k) => (
      <React.Fragment key={n}>
        <HWrite x={200} y={890 + k * 70} start={t0 + 4 + k * 3} dur={6} size={k === 0 ? 52 : 44} color={k === 0 ? GREEN : INK} hand={false}>{n}</HWrite>
        <HWrite x={700} y={890 + k * 70} start={t0 + 4 + k * 3} dur={6} size={k === 0 ? 52 : 44} color={k === 0 ? GREEN : INK} hand={false}>{v}</HWrite>
      </React.Fragment>
    ))}
    <HDraw shape={sh.rect(170, 840, 760, 72, {stroke: GREEN, strokeWidth: 6, seed: 23})} start={t0 + 30} dur={10}/>
    <Note y={1460} start={t0 + 6}>global deposits, YoY, as filed</Note>
  </Canvas>
);};
const F5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={64} anchor="middle" color={GREEN}>plenty of fuel to lend</HWrite>
    <HWrite x={540} y={560} start={at("will this money")} size={58} anchor="middle" color={BLUE}>will it stay after quarter-end?</HWrite>
    <Verdict pick="GOOD" q start={at("Plenty")+6}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkg: CSB + Dhanlaxmi ----------------
const G1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={80}>Thrissur, Kerala</T>
    <T y={590} size={58}>2 banks · about 100 years old</T>
    <T y={760} size={64}>turning into</T>
    <T y={930} size={120} color={GOLD}>GOLD-LOAN</T>
    <T y={1070} size={120} color={GOLD}>BANKS</T>
    {[0, 1, 2].map((k) => <HDraw key={k} shape={sh.circle(380 + k * 160, 1240, 120, {stroke: GOLD, strokeWidth: 6, seed: 30 + k, fill: FILL[GOLD], fillStyle: "hachure"})} start={at("gold loan banks") + k * 4} dur={8}/>)}
  </Canvas>
);};
const GoldShare: React.FC<{b: B; name: string; from: number; to: number; pFrom: string; pTo: string; note: string}> = ({b, name, from, to, pFrom, pTo, note}) => { const at = atOf(b); return (
  <>
    <HWrite x={540} y={450} start={0} size={84} anchor="middle">{name}</HWrite>
    <HWrite x={540} y={545} start={0} size={50} anchor="middle" color={GREY}>gold loans, % of all loans</HWrite>
    <Bar y={760} val={to} max={60} color={GOLD} start={at(pTo)} label="now" v={`${to}%`} seed={33}/>
    <Bar y={1060} val={from} max={60} color={INK} start={at(pFrom)} label="a year ago" v={`${from}%`} seed={34}/>
    <Note y={1300} start={at(pTo)}>{note}</Note>
  </>
);};
const G2: React.FC<SceneP> = ({b}) => (<Canvas><Tag t="CLUE 1"/>
  <GoldShare b={b} name="CSB Bank" from={47.4} to={52.6} pTo="fifty three" pFrom="forty seven" note="our maths · excludes gold-secured receivables"/></Canvas>);
const G3: React.FC<SceneP> = ({b}) => (<Canvas><Tag t="CLUE 2"/>
  <GoldShare b={b} name="Dhanlaxmi Bank" from={34.1} to={42.8} pTo="Forty three" pFrom="thirty four" note="our maths: gold loans ÷ gross advances, as filed"/></Canvas>);
const G4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/><Napkin>
    <HWrite x={140} y={500} start={0} size={50} color={GREY}>Dhanlaxmi · 1-year loan growth · ₹ cr</HWrite>
    <HWrite x={140} y={660} start={at("gold and")} size={60} color={GOLD}>gold loans</HWrite>
    <HWrite x={640} y={660} start={at("gold and", 4)} size={76} color={GOLD}>+2,376</HWrite>
    <HWrite x={140} y={800} start={at("small business")} size={60}>MSME</HWrite>
    <HWrite x={640} y={800} start={at("small business", 4)} size={76}>+672</HWrite>
    <HWrite x={140} y={940} start={at("whole book")} size={60}>whole book</HWrite>
    <HWrite x={640} y={940} start={at("whole book", 4)} size={76}>+2,907</HWrite>
    <HDraw shape={sh.line(120, 990, 960, 990, {strokeWidth: 7, seed: 35})} start={at("Everything else")} dur={8}/>
    <HWrite x={140} y={1130} start={at("Everything else")} size={60} color={RED}>everything else</HWrite>
    <HWrite x={640} y={1130} start={at("shrank")} size={100} color={RED}>−141</HWrite>
    <Note y={1230} start={at("shrank")}>filed figures · the −141 is our maths</Note>
  </Napkin></Canvas>
);};
const G5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={60} anchor="middle" color={GREEN}>secured, so safe today ✓</HWrite>
    <HWrite x={540} y={560} start={at("one bet")} size={64} anchor="middle" color={RED}>one bet, one metal</HWrite>
    <Verdict pick="WATCH" start={at("one bet") + 4}/>
    <HWrite x={540} y={1060} start={at("What if")} size={56} anchor="middle" color={GOLD}>what if gold prices fall?</HWrite>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkh: ESAF SFB ----------------
const H1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={480} size={66}>ESAF Small Finance Bank</T>
    <T y={760} size={220} color={RED}>₹625 Cr</T>
    <T y={890} size={70}>written off in 3 months</T>
    <HDraw shape={sh.ellipse(540, 690, 760, 280, {stroke: RED, strokeWidth: 8, seed: 40})} start={at("three months")} dur={12}/>
    <Note y={1010} start={0}>technical write-off, Q2 FY27 · filed</Note>
  </Canvas>
);};
const H2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin rot={1.5}>
    <HWrite x={140} y={520} start={0} size={56} color={GREY}>the bank's own explanation:</HWrite>
    <HWrite x={140} y={660} start={at("Without")} size={60}>without the write-off,</HWrite>
    <HWrite x={140} y={760} start={at("Without", 6)} size={60}>loan growth would be</HWrite>
    <HWrite x={140} y={930} start={at("twenty eight")} size={130} color={GREEN}>28.32%</HWrite>
    <HWrite x={140} y={1080} start={at("not twenty five")} size={80}>not 25.05%</HWrite>
    <HDraw shape={sh.line(130, 1060, 560, 1060, {stroke: RED, strokeWidth: 6, seed: 42})} start={at("not twenty five", 10)} dur={8}/>
    <Note y={1200} start={at("not twenty five")}>ESAF's Q2 business update</Note>
  </Napkin></Canvas>
);};
const H3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={470} start={0} size={90} anchor="middle" color={RED}>flip it</HWrite>
    <HWrite x={540} y={640} start={at("two point six")} size={64} anchor="middle">₹625 ÷ ₹23,931 Cr</HWrite>
    <HWrite x={540} y={860} start={at("two point six", 8)} size={220} anchor="middle" color={RED}>2.6%</HWrite>
    <HWrite x={540} y={980} start={at("entire loan book")} size={62} anchor="middle">of the entire loan book</HWrite>
    <HWrite x={540} y={1100} start={at("off the books")} size={62} anchor="middle" color={RED}>off the books in one quarter</HWrite>
    <Note y={1200} start={at("two point six")}>our maths on filed figures</Note>
  </Canvas>
);};
const H4: React.FC<SceneP> = ({b}) => { const at = atOf(b); const base = 1280; return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={450} start={0} size={56} anchor="middle">written off in Q2</HWrite>
    <HDraw shape={sh.rect(220, base - 640, 240, 640, {stroke: RED, strokeWidth: 7, seed: 43, fill: FILL[RED], fillStyle: "hachure"})} start={0} dur={14}/>
    <HWrite x={340} y={base - 670} start={4} size={70} anchor="middle" color={RED}>₹625 Cr</HWrite>
    <HWrite x={340} y={base + 70} start={4} size={54} anchor="middle">ESAF</HWrite>
    <HDraw shape={sh.rect(620, base - 44, 240, 44, {stroke: GREEN, strokeWidth: 7, seed: 44, fill: FILL[GREEN], fillStyle: "hachure"})} start={at("forty three")} dur={10}/>
    <HWrite x={740} y={base - 80} start={at("forty three")} size={70} anchor="middle" color={GREEN}>₹43 Cr</HWrite>
    <HWrite x={740} y={base + 70} start={at("Ujjivan")} size={54} anchor="middle">Ujjivan</HWrite>
    <HWrite x={740} y={base + 130} start={at("twice the size")} size={42} anchor="middle" color={GREY}>(1.9× ESAF's book)</HWrite>
    <Note y={base + 210} start={at("forty three")}>as filed · write-off definitions may differ</Note>
  </Canvas>
);};
const H5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={66} anchor="middle" color={GREEN}>clean-up?</HWrite>
    <HWrite x={540} y={560} start={at("warning sign")} size={66} anchor="middle" color={RED}>or warning sign?</HWrite>
    <Verdict pick="CONCERN" start={at("results will")}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bki: Equitas SFB ----------------
const I1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={480} size={90}>microfinance</T>
    <T y={680} size={80} color={RED}>peers: pulling back ↓</T>
    <T y={880} size={110} color={GREEN}>Equitas:</T>
    <T y={1020} size={110} color={GREEN}>walking in ↑</T>
    <HDraw shape={sh.ellipse(540, 930, 860, 340, {stroke: GREEN, strokeWidth: 8, seed: 45})} start={at("walking in")} dur={12}/>
  </Canvas>
);};
const I2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin>
    <HWrite x={140} y={530} start={at("Ujjivan")} size={60}>Ujjivan · group loans</HWrite>
    <HWrite x={140} y={670} start={at("thirty four")} size={100} color={RED}>38% → 34%</HWrite>
    <HWrite x={140} y={760} start={at("of its book")} size={46} color={GREY}>of its book · our maths</HWrite>
    <HWrite x={140} y={920} start={at("E S A F")} size={60}>ESAF · micro loans</HWrite>
    <HWrite x={140} y={1060} start={at("shrank")} size={100} color={RED}>−4.6%</HWrite>
    <HWrite x={140} y={1150} start={at("this quarter")} size={46} color={GREY}>Jun → Sep 2026 · filed</HWrite>
  </Napkin></Canvas>
);};
const I3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={470} start={0} size={58} anchor="middle">Equitas · microfinance & micro loans</HWrite>
    <HWrite x={540} y={770} start={at("seventy percent")} size={240} anchor="middle" color={GREEN}>+70%</HWrite>
    <HWrite x={540} y={900} start={at("in a year")} size={60} anchor="middle">₹3,392 → ₹5,752 Cr</HWrite>
    <HWrite x={540} y={1010} start={at("removing")} size={50} anchor="middle" color={BLUE}>excluding ₹579 Cr of loans it bought</HWrite>
    <Note y={1110} start={at("removing")}>our maths, using the bank's own footnote</Note>
  </Canvas>
);};
const I4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={470} start={0} size={64} anchor="middle">the fuel is costly</HWrite>
    <Bar y={720} val={19.03} max={22} color={BLUE} start={at("total deposits")} label="total deposits" v="+19%" seed={46}/>
    <Bar y={1020} val={1.04} max={22} color={RED} start={at("Cheap CASA")} label="CASA (cheapest)" v="−1%" seed={47}/>
    <Note y={1240} start={at("rose nineteen")}>YoY, filed · CASA ratio 31% → 26%</Note>
  </Canvas>
);};
const I5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={66} anchor="middle">brave contrarian?</HWrite>
    <HWrite x={540} y={560} start={at("or early")} size={62} anchor="middle" color={BLUE}>or early to a recovery?</HWrite>
    <Verdict pick="WATCH" start={at("or early") + 4}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkj: J&K Bank ----------------
const J1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={92}>J&K Bank</T>
    <T y={580} size={58}>a moat most banks would envy</T>
    <HDraw shape={sh.ellipse(540, 860, 820, 420, {stroke: BLUE, strokeWidth: 10, seed: 50})} start={-9} dur={8} hand={false}/>
    <T y={900} size={190} color={BLUE}>42%</T>
    <T y={1150} size={56}>of deposits are cheap CASA</T>
  </Canvas>
);};
const J2: React.FC<SceneP> = ({b}) => (
  <Canvas><Tag t="CLUE 1"/>
    <HWrite x={540} y={560} start={0} dur={6} size={64} anchor="middle" hand={false}>a year ago</HWrite>
    <HWrite x={540} y={780} start={0} dur={8} size={180} anchor="middle" hand={false}>45.9%</HWrite>
    <HWrite x={540} y={1000} start={8} dur={8} size={130} anchor="middle" color={RED} hand={false}>→ 42.0%</HWrite>
    <Note y={1100} start={8}>CASA ratio · −388 bps · filed</Note>
  </Canvas>
);
const J3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>one year · ₹ crore</HWrite>
    <HWrite x={140} y={660} start={at("New deposits")} size={60}>new deposits</HWrite>
    <HWrite x={600} y={660} start={at("twenty four")} size={80}>+24,766</HWrite>
    <HWrite x={140} y={800} start={at("Cheap CASA")} size={60} color={BLUE}>from CASA</HWrite>
    <HWrite x={600} y={800} start={at("four and a half")} size={80} color={BLUE}>+4,503</HWrite>
    <HDraw shape={sh.line(120, 850, 960, 850, {strokeWidth: 7, seed: 53})} start={at("four and a half", 8)} dur={8}/>
    <HWrite x={140} y={1000} start={at("four and a half", 12)} size={70} color={BLUE}>₹18 of every ₹100</HWrite>
    <Note y={1100} start={at("four and a half", 12)}>filed figures · split is our maths</Note>
  </Napkin></Canvas>
);};
const J4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={700} start={at("eighty two")} size={180} anchor="middle" color={RED}>₹82</HWrite>
    <HWrite x={540} y={810} start={at("eighty two", 4)} size={58} anchor="middle">of every ₹100 of new deposits</HWrite>
    <HWrite x={540} y={900} start={at("costlier")} size={58} anchor="middle" color={RED}>from costlier term deposits</HWrite>
    <HWrite x={540} y={1100} start={at("Loans grew")} size={72} anchor="middle">loans +23.7%</HWrite>
    <HWrite x={540} y={1200} start={at("needed the money")} size={56} anchor="middle" color={GREY}>so it needed the money</HWrite>
    <Note y={1290} start={at("eighty two")}>our maths on filed figures</Note>
  </Canvas>
);};
const J5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={64} anchor="middle" color={GREEN}>the moat: still wide</HWrite>
    <HWrite x={540} y={560} start={at("getting thinner")} size={64} anchor="middle" color={RED}>but getting thinner</HWrite>
    <Verdict pick="WATCH" start={at("getting thinner") + 4}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkk: AU SFB ----------------
const K1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={96} color={RED}>13 of 22 banks</T>
    <T y={570} size={58}>lent more than they raised</T>
    {Array.from({length: 22}, (_, k) => {
      const cx = 160 + (k % 11) * 76, cy = 760 + Math.floor(k / 11) * 110, red = k < 13, au = k === 21;
      return <HDraw key={k} shape={sh.circle(cx, cy, 58, {stroke: au ? GREEN : red ? RED : "#999", strokeWidth: 5, seed: 60 + k,
        fill: au ? FILL[GREEN] : red ? FILL[RED] : undefined, fillStyle: "solid"})} start={-9} dur={8} hand={false}/>;
    })}
    <HDraw shape={sh.circle(160 + 10 * 76, 870, 120, {stroke: GREEN, strokeWidth: 8, seed: 90})} start={at("did the opposite")} dur={10}/>
    <HWrite x={540} y={1080} start={at("A U")} size={90} anchor="middle" color={GREEN}>AU SFB: the opposite</HWrite>
  </Canvas>
);};
const K2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>growth in one year · ₹ crore</HWrite>
    <Bar y={680} val={32765} max={37951} color={BLUE} start={at("Loans grew")} label="loans" v="+32,765" seed={91}/>
    <Bar y={980} val={37951} max={37951} color={GREEN} start={at("Deposits grew")} label="deposits" v="" seed={92}/>
    <HWrite x={460} y={958} start={at("thirty eight")} size={66} color={GREEN}>+37,951</HWrite>
    <HWrite x={140} y={1200} start={at("thirty eight", 10)} size={60}>₹86 lent per ₹100 raised</HWrite>
    <Note y={1270} start={at("thirty eight", 10)}>filed figures · ratio is our maths</Note>
  </Napkin></Canvas>
);};
const K3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <Bar y={620} val={29.1} max={34} color={GREEN} start={at("Cheap CASA")} label="CASA (cheap)" v="+29.1%" seed={93}/>
    <Bar y={900} val={28.6} max={34} color={BLUE} start={at("total deposits")} label="total deposits" v="+28.6%" seed={94}/>
    <HWrite x={540} y={1150} start={at("CASA ratio")} size={58} anchor="middle">CASA ratio</HWrite>
    <HWrite x={540} y={1290} start={at("twenty nine and a half")} size={110} anchor="middle" color={GREEN}>29.4% → 29.5%</HWrite>
    <Note y={1370} start={at("held")}>Sep 2025 → Sep 2026 · filed</Note>
  </Canvas>
);};
const K4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={480} start={0} size={58} anchor="middle">headline loan growth</HWrite>
    <HWrite x={540} y={660} start={at("twenty eight")} size={150} anchor="middle">27.9%</HWrite>
    <HWrite x={540} y={780} start={at("selling fewer")} size={52} anchor="middle" color={RED}>helped by selling fewer loans</HWrite>
    <HWrite x={540} y={860} start={at("selling fewer", 6)} size={42} anchor="middle" color={GREY}>sold-down book ₹5,352 → ₹3,480 Cr</HWrite>
    <HWrite x={540} y={1000} start={at("full portfolio")} size={58} anchor="middle">full portfolio</HWrite>
    <HWrite x={540} y={1170} start={at("twenty five")} size={150} anchor="middle" color={BLUE}>25.1%</HWrite>
    <Note y={1260} start={at("twenty five")}>all figures as filed</Note>
  </Canvas>
);};
const K5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={70} anchor="middle" color={GREEN}>a deposit engine</HWrite>
    <HWrite x={540} y={560} start={at("keeping pace")} size={64} anchor="middle">keeping pace</HWrite>
    <Verdict pick="GOOD" start={at("keeping pace") + 2}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkl: Tamilnad Mercantile Bank ----------------
const L1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={64}>this bank is</T>
    <T y={640} size={140}>105 years old</T>
    <T y={800} size={64}>growing like a</T>
    <T y={990} size={160} color={RED}>STARTUP</T>
    <HDraw shape={sh.ellipse(540, 930, 780, 230, {stroke: RED, strokeWidth: 8, seed: 101})} start={at("startup")} dur={12}/>
    <Note y={1110} start={0}>incorporated 1921 · from its filing letterhead</Note>
  </Canvas>
);};
const L2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/>
    <HWrite x={540} y={440} start={at("Tamilnad")} size={64} anchor="middle">Tamilnad Mercantile Bank</HWrite>
    <HWrite x={540} y={520} start={at("Tamilnad", 4)} size={44} anchor="middle" color={GREY}>loan growth, of 22 banks</HWrite>
    <Bar y={680} val={32.12} max={36} color={INK} start={at("only two")} label="Ujjivan SFB" v="32.1%" seed={102}/>
    <Bar y={880} val={29.58} max={36} color={INK} start={at("only two", 6)} label="Equitas SFB" v="29.6%" seed={103}/>
    <Bar y={1080} val={29.37} max={36} color={GREEN} start={at("loans grew")} label="TMB" v="29.4%" seed={104}/>
    <HDraw shape={sh.ellipse(540, 1100, 980, 220, {stroke: GREEN, strokeWidth: 7, seed: 105})} start={at("grew faster")} dur={10}/>
    <Note y={1300} start={at("only two")}>YoY to 30 Sep 2026, as filed</Note>
  </Canvas>
);};
const L3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={520} start={0} size={64} anchor="middle">to fund it, deposits</HWrite>
    <HWrite x={540} y={780} start={at("twenty five")} size={220} anchor="middle" color={BLUE}>+25.5%</HWrite>
    <HWrite x={540} y={900} start={at("twenty five", 6)} size={60} anchor="middle">+₹14,125 Cr in a year</HWrite>
    <Note y={1000} start={at("twenty five", 6)}>₹55,421 → ₹69,546 Cr · filed</Note>
  </Canvas>
);};
const L4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={450} start={0} size={52} anchor="middle">of every ₹100 of new deposits</HWrite>
    <HWrite x={300} y={680} start={at("Eighty two")} size={170} anchor="middle" color={RED}>₹82</HWrite>
    <HWrite x={300} y={770} start={at("term deposits")} size={46} anchor="middle" color={RED}>term (costlier)</HWrite>
    <HWrite x={790} y={680} start={at("term deposits", 6)} size={120} anchor="middle" color={GREEN}>₹18</HWrite>
    <HWrite x={790} y={770} start={at("term deposits", 8)} size={46} anchor="middle" color={GREEN}>CASA (cheap)</HWrite>
    <HWrite x={540} y={960} start={at("Cheap CASA")} size={56} anchor="middle">CASA share of deposits</HWrite>
    <HWrite x={540} y={1120} start={at("twenty seven")} size={120} anchor="middle">27.4% → 25.3%</HWrite>
    <Note y={1210} start={at("twenty seven")}>our maths on filed figures · Sep 2025 → Sep 2026</Note>
  </Canvas>
);};
const L5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={64} anchor="middle" color={GREEN}>fast growth ✓</HWrite>
    <HWrite x={540} y={560} start={at("pricier")} size={64} anchor="middle" color={RED}>pricier fuel</HWrite>
    <Verdict pick="WATCH" start={at("pricier") + 4}/>
    <HWrite x={540} y={1060} start={at("Can it")} size={56} anchor="middle" color={BLUE}>can it keep both?</HWrite>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkm: Canara + PNB ----------------
const M1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={460} size={52} color={GREY}>in India · one year</T>
    <T x={290} y={620} size={50}>Bank of Baroda</T>
    <T x={790} y={620} size={50}>Canara Bank</T>
    <HDraw shape={sh.line(540, 560, 540, 1000, {strokeWidth: 4, seed: 110})} start={-9} dur={8} hand={false}/>
    <T x={290} y={800} size={80} color={GREEN}>deposits</T>
    <T x={290} y={900} size={52}>grew faster</T>
    <T x={290} y={980} size={52}>than loans</T>
    <HWrite x={790} y={800} start={at("did the opposite")} size={80} anchor="middle" color={RED}>loans</HWrite>
    <HWrite x={790} y={900} start={at("did the opposite", 4)} size={52} anchor="middle">grew faster</HWrite>
    <HWrite x={790} y={980} start={at("did the opposite", 8)} size={52} anchor="middle">than deposits</HWrite>
    <HWrite x={540} y={1180} start={at("Canara Bank")} size={80} anchor="middle" color={RED}>the opposite</HWrite>
  </Canvas>
);};
const M2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>Canara · India · 1 year · ₹ crore</HWrite>
    <HWrite x={140} y={660} start={at("loans in India")} size={60}>loans</HWrite>
    <HWrite x={520} y={660} start={at("seventeen")} size={76} color={RED}>+1,82,005</HWrite>
    <HWrite x={140} y={800} start={at("deposits in India")} size={60}>deposits</HWrite>
    <HWrite x={520} y={800} start={at("grew eleven")} size={76}>−1,52,870</HWrite>
    <HDraw shape={sh.line(120, 850, 960, 850, {strokeWidth: 7, seed: 111})} start={at("Loans outran")} dur={8}/>
    <HWrite x={140} y={1010} start={at("Loans outran")} size={70} color={RED}>gap</HWrite>
    <HWrite x={480} y={1010} start={at("twenty nine")} size={120} color={RED} dur={16}>29,135</HWrite>
    <HWrite x={140} y={1120} start={at("twenty nine")} dur={8} size={38} color={GREY} hand={false}>+16.8% vs +11.0%, filed · gap: our maths</HWrite>
  </Napkin></Canvas>
);};
const M3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={480} start={0} size={70} anchor="middle">PNB · overseas loans</HWrite>
    <HWrite x={540} y={760} start={at("sixty three")} size={230} anchor="middle" color={RED}>+63%</HWrite>
    <HWrite x={540} y={890} start={at("sixty three", 4)} size={60} anchor="middle">₹51,707 → ₹84,110 Cr</HWrite>
    <Note y={990} start={at("sixty three", 4)}>our maths: global − domestic advances, as filed</Note>
  </Canvas>
);};
const M4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={460} start={0} size={48} anchor="middle">PNB abroad: ₹ lent per ₹100 held</HWrite>
    <HWrite x={540} y={760} start={at("a hundred and twenty nine")} size={230} anchor="middle" color={RED}>₹129</HWrite>
    <HWrite x={540} y={870} start={at("abroad for every")} size={56} anchor="middle">now</HWrite>
    <HWrite x={540} y={1060} start={at("A year ago")} dur={12} size={100} anchor="middle">a year ago: ₹97</HWrite>
    <Note y={1160} start={at("ninety seven")}>our maths: overseas = global − domestic</Note>
  </Canvas>
);};
const M5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={64} anchor="middle">two banks, two gaps</HWrite>
    <HWrite x={540} y={560} start={at("How will")} size={62} anchor="middle" color={BLUE}>how will they fill them?</HWrite>
    <Verdict pick="WATCH" start={at("How will") + 4}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkn: Karnataka Bank ----------------
const N1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={54} color={GREY}>₹ lent per ₹100 raised · 22 banks</T>
    <T x={140} y={680} size={80} mid={false}>#1 Union Bank</T>
    <T x={780} y={680} size={100} mid={false} color={RED}>₹213</T>
    <T x={140} y={900} size={80} mid={false}>#2</T>
    <HWrite x={330} y={900} start={at("number two")} size={100} color={RED}>?</HWrite>
    <HDraw shape={sh.ellipse(540, 870, 900, 190, {stroke: RED, strokeWidth: 8, seed: 120})} start={at("Meet")} dur={12}/>
  </Canvas>
);};
const N2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color={GREY}>Karnataka Bank · one year · ₹ crore</HWrite>
    <HWrite x={140} y={660} start={at("loans grew")} size={60}>loans</HWrite>
    <HWrite x={560} y={660} start={at("eighteen")} size={76} color={RED}>+18,370</HWrite>
    <HWrite x={140} y={800} start={at("Deposits")} size={60}>deposits</HWrite>
    <HWrite x={560} y={800} start={at("twelve")} size={76}>+12,321</HWrite>
    <HDraw shape={sh.line(120, 850, 960, 850, {strokeWidth: 7, seed: 121})} start={at("A hundred")} dur={8}/>
    <HWrite x={140} y={1010} start={at("A hundred")} size={110} color={RED} dur={14}>₹149</HWrite>
    <HWrite x={480} y={1010} start={at("for every hundred")} size={60} color={RED}>per ₹100</HWrite>
    <HWrite x={140} y={1120} start={at("for every hundred")} dur={8} size={38} color={GREY} hand={false}>filed figures · ratio is our maths</HWrite>
  </Napkin></Canvas>
);};
const N3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={560} start={0} size={60} anchor="middle">loan-to-deposit ratio</HWrite>
    <HWrite x={270} y={780} start={at("seventy two")} size={150} anchor="middle">72%</HWrite>
    <HWrite x={540} y={770} start={at("to eighty")} size={100} anchor="middle">→</HWrite>
    <HWrite x={810} y={780} start={at("eighty")} size={150} anchor="middle" color={RED}>80%</HWrite>
    <Note y={880} start={at("eighty")}>our maths: advances ÷ deposits · Sep 25 → Sep 26</Note>
  </Canvas>
);};
const N4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={470} start={0} size={64} anchor="middle" color={GREEN}>the cheap money held up</HWrite>
    <Bar y={700} val={14.88} max={19} color={GREEN} start={at("CASA grew")} label="CASA (cheap)" v="+14.9%" seed={122}/>
    <Bar y={1000} val={11.98} max={19} color={BLUE} start={at("faster than")} label="total deposits" v="+12.0%" seed={123}/>
    <Note y={1240} start={at("faster than")}>YoY, filed · CASA ratio 31.0% → 31.8%</Note>
  </Canvas>
);};
const N5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={60} anchor="middle" color={GREEN}>growing fast, funding well</HWrite>
    <HWrite x={540} y={560} start={at("cushion")} size={62} anchor="middle" color={RED}>but the cushion is thinning</HWrite>
    <Verdict pick="WATCH" start={at("cushion") + 4}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bko: 22-bank roundup ----------------
const RT: [string, string][] = [["Union", "213"], ["Karnataka", "149"], ["Equitas", "138"], ["UCO", "133"], ["Bandhan", "125"], ["Capital SFB", "122"],
  ["Punjab & Sind", "116"], ["Canara", "113"], ["PNB", "108"], ["Karur Vysya", "107"], ["Indian Bank", "107"], ["CSB", "106"], ["J&K", "103"],
  ["TMB", "98"], ["Ujjivan", "97"], ["Bank of Baroda", "93"], ["ESAF", "86"], ["AU SFB", "86"], ["Dhanlaxmi", "84"], ["South Indian", "80"],
  ["Bank of India", "79"], ["IDBI", "79"]];
const RY = (i: number) => 470 + i * 46;
const Table: React.FC<{when: (i: number) => number | null; line?: number | null; circles?: number | null}> = ({when, line = null, circles = null}) => (
  <>
    <HWrite x={540} y={400} start={-9} dur={6} size={42} anchor="middle" color={GREY} hand={false}>₹ lent per ₹100 of new deposits · 1 year</HWrite>
    {RT.map(([n, v], i) => { const s = when(i); if (s === null) return null; const c = i < 3 ? RED : i > 19 ? GREEN : INK; return (
      <React.Fragment key={n}>
        <HWrite x={150} y={RY(i)} start={s} dur={5} size={36} color={GREY} hand={false}>{String(i + 1)}</HWrite>
        <HWrite x={230} y={RY(i)} start={s} dur={5} size={42} color={c} hand={false}>{n}</HWrite>
        <HWrite x={800} y={RY(i)} start={s} dur={5} size={44} color={c} hand={false}>{`₹${v}`}</HWrite>
      </React.Fragment>
    );})}
    {line !== null ? <>
      <HDraw shape={sh.line(120, RY(12) + 16, 960, RY(12) + 16, {stroke: RED, strokeWidth: 6, seed: 130})} start={line} dur={10}/>
      <HWrite x={960} y={RY(12) + 8} start={line + 6} dur={6} size={30} color={RED} hand={false}>₹100</HWrite>
    </> : null}
    {circles !== null ? <>
      <HDraw shape={sh.rect(120, RY(0) - 40, 840, 3 * 46 + 6, {stroke: RED, strokeWidth: 5, seed: 131})} start={circles} dur={8}/>
      <HDraw shape={sh.rect(120, RY(20) - 40, 840, 2 * 46 + 6, {stroke: GREEN, strokeWidth: 5, seed: 132})} start={circles + 4} dur={8}/>
    </> : null}
  </>
);
const O1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={520} size={150}>22 banks</T>
    <T y={680} size={80} color={BLUE}>1 question</T>
    <HWrite x={540} y={880} start={at("For every")} size={66} anchor="middle">for every ₹100 of new deposits,</HWrite>
    <HWrite x={540} y={990} start={at("how much")} size={80} anchor="middle" color={RED}>how much did they lend?</HWrite>
  </Canvas>
);};
const O2: React.FC<SceneP> = ({b}) => { const at = atOf(b); const ph = ["Union", "Karnataka", "Equitas"]; return (
  <Canvas><Tag t="CLUE 1"/><Table when={(i) => i < 3 ? at(ph[i]) : null}/></Canvas>
);};
const O3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/><Table when={(i) => i < 3 ? -9 : i >= 20 ? at(i === 20 ? "Bank of India" : "IDBI") : null}/></Canvas>
);};
const O4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <Table when={(i) => (i < 3 || i >= 20) ? -9 : 2 + (i - 3)} line={at("lent more")}/>
    <HWrite x={540} y={1530} start={at("lent more")} size={54} anchor="middle" color={RED}>13 above the line · 9 below</HWrite>
  </Canvas>
);};
const O5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <Table when={() => -9} line={-9} circles={0}/>
    <HWrite x={540} y={1520} start={0} size={60} anchor="middle" color={BLUE}>find your bank · pause</HWrite>
    <HWrite x={540} y={1595} start={at("Back to the napkin")} size={42} anchor="middle" color={BLUE}>↺ back to the napkin</HWrite>
  </Canvas>
);};

// ---------------- bkp: Suryoday SFB (6 Oct 2026; filing 5 Oct; write-off added back is our estimate) ----------------
const P1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={72}>Suryoday SFB · bad loans</T>
    <T x={250} y={760} size={150}>6.5%</T>
    <T y={745} size={100}>→</T>
    <T x={830} y={760} size={150} color={GREEN}>2.9%</T>
    <T y={920} size={72} color={RED}>in 90 days</T>
    <HDraw shape={sh.ellipse(830, 705, 380, 210, {stroke: GREEN, strokeWidth: 8, seed: 140})} start={at("more than half")} dur={12}/>
    <Note y={1030} start={0}>GNPA ratio, June → September 2026 · filed</Note>
  </Canvas>
);};
const P2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/>
    <HWrite x={540} y={480} start={at("Suryoday")} size={64} anchor="middle">Suryoday Small Finance Bank</HWrite>
    <HWrite x={540} y={570} start={at("Bad loans")} size={50} anchor="middle" color={GREY}>gross NPA ratio</HWrite>
    <Bar y={760} val={6.5} max={8} color={INK} start={at("six point five")} label="June 2026" v="6.5%" seed={141}/>
    <Bar y={1060} val={2.9} max={8} color={GREEN} start={at("Two point nine")} label="September 2026" v="2.9%" seed={142}/>
    <Note y={1300} start={at("Two point nine")}>filed · a year ago it was 9.3%</Note>
  </Canvas>
);};
const P3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={520} start={0} size={60} anchor="middle">same quarter, written off</HWrite>
    <HWrite x={540} y={800} start={at("five hundred")} size={210} anchor="middle" color={RED}>₹591 Cr</HWrite>
    <HWrite x={540} y={930} start={at("five hundred", 10)} dur={12} size={56} anchor="middle">"after considering a write-off"</HWrite>
    <Note y={1030} start={at("of loans")}>the bank's own words, Q2 update</Note>
  </Canvas>
);};
const P4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/><Napkin>
    <HWrite x={140} y={500} start={0} size={50} color={GREY}>put the write-off back · ₹ crore</HWrite>
    <HWrite x={140} y={650} start={at("Put the")} size={58}>bad loans</HWrite>
    <HWrite x={560} y={650} start={at("Put the", 4)} size={70}>438 + 591</HWrite>
    <HWrite x={140} y={790} start={at("write off back")} size={58}>loan book</HWrite>
    <HWrite x={560} y={790} start={at("write off back", 4)} size={70}>14,972 + 591</HWrite>
    <HDraw shape={sh.line(120, 840, 960, 840, {strokeWidth: 7, seed: 143})} start={at("about six")} dur={8}/>
    <HWrite x={140} y={1010} start={at("about six")} size={70} color={RED}>≈</HWrite>
    <HWrite x={260} y={1010} start={at("six point six")} size={140} color={RED} dur={14}>6.6%</HWrite>
    <HWrite x={140} y={1130} start={at("Right where")} size={56}>right where it was in June</HWrite>
    <HWrite x={140} y={1210} start={at("Right where")} dur={8} size={34} color={GREY} hand={false}>our estimate: write-off assumed all bad loans</HWrite>
  </Napkin></Canvas>
);};
const P5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={58} anchor="middle" color={RED}>provisions cover just 31%</HWrite>
    <HWrite x={540} y={560} start={at("Cleaner book")} size={60} anchor="middle" color={BLUE}>cleaner book, or cleaner number?</HWrite>
    <Verdict pick="WATCH" start={at("Cleaner book") + 4}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkq: Angel One commodity share (7 Oct 2026; filing 6 Oct; implied market is our arithmetic) ----------------
const Q1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={68}>Angel One · commodity</T>
    <T x={290} y={740} size={110} color={GREEN}>×2</T>
    <T x={290} y={850} size={46} color={GREY}>turnover</T>
    <T x={790} y={740} size={110} color={RED}>−21 pts</T>
    <T x={790} y={850} size={46} color={GREY}>market share</T>
    <HDraw shape={sh.ellipse(790, 700, 400, 200, {stroke: RED, strokeWidth: 8, seed: 150})} start={at("twenty one points")} dur={12}/>
    <Note y={1030} start={0}>Q2 FY27 vs Q2 FY26 · Angel One's own filing</Note>
  </Canvas>
);};
const Q2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 1"/>
    <HWrite x={540} y={480} start={at("Today")} size={58} anchor="middle">Q2 FY27 · commodity, per day</HWrite>
    <HWrite x={540} y={720} start={at("Two thousand")} size={150} anchor="middle">₹2,438 bn</HWrite>
    <HWrite x={540} y={900} start={at("Forty four")} size={110} anchor="middle" color={RED}>= 44.0% share</HWrite>
    <Note y={1030} start={at("Forty four")}>filed, 6 Oct 2026</Note>
  </Canvas>
);};
const Q3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE 2"/>
    <HWrite x={540} y={480} start={0} size={58} anchor="middle">a year ago · Q2 FY26</HWrite>
    <HWrite x={540} y={720} start={at("eleven eighty")} size={150} anchor="middle">₹1,187 bn</HWrite>
    <HWrite x={540} y={900} start={at("Sixty five")} size={110} anchor="middle" color={GREEN}>= 65.1% share</HWrite>
    <Note y={1030} start={at("Sixty five")}>same filing, year-ago column</Note>
  </Canvas>
);};
const Q4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/><Napkin>
    <HWrite x={140} y={500} start={0} size={50} color={GREY}>market = turnover ÷ share · ₹ bn/day</HWrite>
    <HWrite x={140} y={650} start={at("Divide")} size={58}>then</HWrite>
    <HWrite x={330} y={650} start={at("Divide", 4)} size={52}>1,187 ÷ 0.651 ≈ 1,823</HWrite>
    <HWrite x={140} y={790} start={at("eighteen hundred")} size={58}>now</HWrite>
    <HWrite x={330} y={790} start={at("eighteen hundred", 4)} size={52}>2,438 ÷ 0.440 ≈ 5,541</HWrite>
    <HDraw shape={sh.line(120, 840, 960, 840, {strokeWidth: 7, seed: 151})} start={at("It tripled")} dur={8}/>
    <HWrite x={140} y={1000} start={at("It tripled")} size={96} color={RED} dur={12}>market ×3.0</HWrite>
    <HWrite x={140} y={1120} start={at("It tripled", 8)} size={80}>Angel One ×2.05</HWrite>
    <HWrite x={140} y={1210} start={at("It tripled", 12)} dur={8} size={34} color={GREY} hand={false}>our arithmetic: assumes the same market base</HWrite>
  </Napkin></Canvas>
);};
const Q5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={460} start={0} size={56} anchor="middle" color={GREEN}>F&amp;O share held: 21.7% → 22.1%</HWrite>
    <HWrite x={540} y={560} start={at("New commodity")} size={56} anchor="middle" color={BLUE}>new commodity traders: elsewhere</HWrite>
    <Verdict pick="WATCH" start={at("went elsewhere")}/>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkr: Angel One Short, napkin version of the Vox Short (same seven lines; 7 Oct 2026) ----------------
const R1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={68}>Angel One · commodity</T>
    <HWrite x={540} y={760} start={at("doubled")} size={230} anchor="middle" color={GREEN}>×2</HWrite>
    <HDraw shape={sh.ellipse(540, 740, 430, 230, {stroke: GREEN, strokeWidth: 8, seed: 160})} start={at("doubled")} dur={12}/>
    <Note y={1060} start={at("doubled")}>commodity trading, Q2 FY27 vs Q2 FY26</Note>
  </Canvas>
);};
const R2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="BUT"/>
    <HWrite x={540} y={520} start={at("market share")} size={60} anchor="middle" color={GREY}>market share</HWrite>
    <HWrite x={540} y={780} start={at("forty one point seven")} size={200} anchor="middle" color={RED}>41.7%</HWrite>
    <HDraw shape={sh.line(160, 900, 920, 900, {strokeWidth: 7, seed: 161})} start={at("forty one point seven")} dur={8}/>
    <Note y={1000} start={at("forty one point seven")}>September 2026 · Angel One's own filing</Note>
  </Canvas>
);};
const R3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST"/>
    <HWrite x={540} y={500} start={at("How")} size={62} anchor="middle">how?</HWrite>
    <HWrite x={260} y={740} start={at("tripled")} size={120} color={BLUE}>×3</HWrite>
    <HWrite x={260} y={830} start={at("tripled")} size={46} color={GREY}>the market</HWrite>
    <HWrite x={800} y={740} start={at("only doubled")} size={120} color={GREEN}>×2</HWrite>
    <HWrite x={800} y={830} start={at("only doubled")} size={46} color={GREY}>Angel One</HWrite>
    <Note y={960} start={at("tripled")}>our arithmetic: turnover ÷ share</Note>
  </Canvas>
);};
const R4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={480} start={at("twenty one")} size={58} anchor="middle" color={GREY}>2021</HWrite>
    <HWrite x={540} y={620} start={at("twenty eight percent")} size={150} anchor="middle">27.8%</HWrite>
    <HDraw shape={sh.line(120, 720, 960, 720, {strokeWidth: 6, seed: 162})} start={at("built that")} dur={8}/>
    <HWrite x={540} y={860} start={at("sixty seven point six")} size={58} anchor="middle" color={GREY}>peak, Aug 2025</HWrite>
    <HWrite x={540} y={1000} start={at("sixty seven point six")} size={150} anchor="middle" color={RED}>67.6%</HWrite>
  </Canvas>
);};
const R5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={560} start={at("two thirds")} size={160} anchor="middle" color={RED}>~2/3</HWrite>
    <HWrite x={540} y={740} start={at("two thirds")} size={56} anchor="middle">of the climb is gone</HWrite>
    <Note y={860} start={at("two thirds")}>our arithmetic: (67.6 − 41.7) ÷ (67.6 − 27.8)</Note>
    <Verdict pick="CONCERN" start={at("is gone")} y={1000}/>
  </Canvas>
);};
const R6: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE CORE" color={GREEN}/>
    <HWrite x={540} y={520} start={at("futures and options")} size={58} anchor="middle">futures and options</HWrite>
    <HWrite x={540} y={760} start={at("twenty two")} size={170} anchor="middle" color={GREEN}>22.1%</HWrite>
    <HWrite x={540} y={920} start={at("twenty two")} size={50} anchor="middle" color={GREY}>held · 21.7% a year ago</HWrite>
  </Canvas>
);};
const R7: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={560} start={at("losing the new")} size={62} anchor="middle" color={BLUE}>losing the new traders</HWrite>
    <HWrite x={540} y={700} start={at("not the old")} size={62} anchor="middle" color={INK}>not the old ones.</HWrite>
    <Loop start={at("Because")}/>
  </Canvas>
);};

// ---------------- bks: Jewellers vs gold, napkin twin of the Vox Short (same seven lines; 8 Oct 2026) ----------------
const S1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={64}>India's jewellers · Q2</T>
    <HWrite x={540} y={760} start={at("twenty nine")} size={210} anchor="middle" color={GREEN}>+29%</HWrite>
    <HWrite x={540} y={880} start={at("up to")} size={50} anchor="middle" color={GREY}>up to</HWrite>
    <Note y={1020} start={at("twenty nine")}>Senco 29% · PC Jeweller ~28% · Kalyan ~26%</Note>
  </Canvas>
);};
const S2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="BUT"/>
    <HWrite x={540} y={520} start={at("Gold prices")} size={64} anchor="middle" color={GREY}>gold price</HWrite>
    <HWrite x={540} y={780} start={at("twenty eight")} size={210} anchor="middle" color={RED}>+28%</HWrite>
    <Note y={960} start={at("twenty eight")}>Senco's figure · Q2 average, year on year</Note>
  </Canvas>
);};
const S3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE MATH"/><Napkin>
    <HWrite x={140} y={600} start={at("same grams")} size={80}>same grams</HWrite>
    <HWrite x={140} y={760} start={at("higher prices")} size={80} color={RED}>× gold +28%</HWrite>
    <HDraw shape={sh.line(120, 820, 960, 820, {strokeWidth: 7, seed: 170})} start={at("higher prices", 8)} dur={8}/>
    <HWrite x={140} y={960} start={at("higher prices", 12)} size={80}>= revenue +28%</HWrite>
  </Napkin></Canvas>
);};
const S4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE"/>
    <HWrite x={540} y={500} start={at("Existing stores")} size={58} anchor="middle">existing stores grew</HWrite>
    <HWrite x={300} y={720} start={at("less than")} size={110} anchor="middle" color={BLUE}>~20%</HWrite>
    <HWrite x={300} y={810} start={at("less than")} size={42} anchor="middle" color={GREY}>Kalyan</HWrite>
    <HWrite x={780} y={720} start={at("less than")} size={110} anchor="middle" color={BLUE}>19%</HWrite>
    <HWrite x={780} y={810} start={at("less than")} size={42} anchor="middle" color={GREY}>Senco</HWrite>
    <HWrite x={540} y={960} start={at("less than", 4)} dur={14} size={70} anchor="middle" color={RED}>{"< gold +28%"}</HWrite>
  </Canvas>
);};
const S5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE TWIST" color={GREEN}/>
    <HWrite x={540} y={520} start={at("actually growing")} size={60} anchor="middle">what's actually growing?</HWrite>
    <HWrite x={540} y={700} start={at("Diamonds")} size={110} anchor="middle" color={GREEN}>diamonds</HWrite>
    <HWrite x={540} y={860} start={at("Seven percent")} size={90} anchor="middle" color={GREEN}>+7% by volume</HWrite>
    <Note y={980} start={at("Seven percent")}>Senco · value +31%</Note>
  </Canvas>
);};
const S6: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={480} start={0} size={58} anchor="middle" color={GREY}>last year · Q2 FY26</HWrite>
    <HWrite x={540} y={660} start={at("forty three")} size={130} anchor="middle" color={RED}>gold +43%</HWrite>
    <HWrite x={540} y={840} start={at("Senco grew")} size={130} anchor="middle" color={BLUE}>Senco +6.5%</HWrite>
  </Canvas>
);};
const S7: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={560} start={at("is it demand")} size={80} anchor="middle" color={BLUE}>demand?</HWrite>
    <HWrite x={540} y={720} start={at("price of gold")} size={70} anchor="middle" color={RED}>or the price of gold?</HWrite>
    <Verdict pick="WATCH" start={at("price of gold", 6)} y={900}/>
    <Loop start={at("Because")}/>
  </Canvas>
);};

// ---------------- bkt: TCS Q2, napkin twin of the Vox Short (same seven lines; 9 Oct 2026) ----------------
const TC1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <T y={470} size={64}>TCS · Q2 FY27 revenue</T>
    <HWrite x={540} y={760} start={at("eleven percent")} size={210} anchor="middle" color={GREEN}>+11%</HWrite>
    <Note y={960} start={at("eleven percent")}>in rupees · year on year (+11.2%)</Note>
  </Canvas>
);};
const TC2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="BUT"/><Napkin>
    <HWrite x={140} y={600} start={0} size={80}>+11.2% in rupees</HWrite>
    <HWrite x={140} y={760} start={at("weaker rupee")} size={80} color={RED}>− weaker rupee</HWrite>
    <HDraw shape={sh.line(120, 820, 960, 820, {strokeWidth: 7, seed: 171})} start={at("two point eight")} dur={8}/>
    <HWrite x={140} y={960} start={at("two point eight", 6)} size={96} color={BLUE}>= +2.8%</HWrite>
  </Napkin></Canvas>
);};
const TC3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={520} start={at("A I revenue")} size={70} anchor="middle" color={GREY}>AI revenue</HWrite>
    <HWrite x={540} y={760} start={at("three point one")} size={190} anchor="middle" color={GREEN}>$3.1 bn</HWrite>
    <Note y={940} start={at("a year")}>annualised · over 10% of revenue</Note>
  </Canvas>
);};
const TC4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE MATH"/><Napkin>
    <HWrite x={140} y={600} start={0} size={80}>9 months ago: $1.8 bn</HWrite>
    <HWrite x={140} y={760} start={at("seventy percent")} size={80}>now: $3.1 bn</HWrite>
    <HDraw shape={sh.line(120, 820, 960, 820, {strokeWidth: 7, seed: 172})} start={at("seventy percent", 6)} dur={8}/>
    <HWrite x={140} y={960} start={at("nine months")} size={96} color={GREEN}>≈ +70%</HWrite>
  </Napkin></Canvas>
);};
const TC5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="CLUE"/>
    <HWrite x={300} y={680} start={0} size={110} anchor="middle" color={GREEN}>AI ≈ +70%</HWrite>
    <HWrite x={780} y={680} start={at("total revenue")} size={110} anchor="middle" color={RED}>all +2.8%</HWrite>
    <HWrite x={540} y={900} start={at("barely move")} size={80} anchor="middle">why?</HWrite>
  </Canvas>
);};
const TC6: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Tag t="THE CEO" color={RED}/>
    <HWrite x={540} y={600} start={at("there is")} size={70} anchor="middle">“there is a</HWrite>
    <HWrite x={540} y={760} start={at("deflation")} size={120} anchor="middle" color={RED}>deflation”</HWrite>
    <Note y={940} start={at("productivity")}>“…because of the productivity benefit” · call, 8 Oct</Note>
  </Canvas>
);};
const TC7: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={560} start={at("growing T C S")} size={80} anchor="middle" color={GREEN}>AI growing TCS?</HWrite>
    <HWrite x={540} y={720} start={at("shrinking it")} size={80} anchor="middle" color={RED}>or shrinking it?</HWrite>
    <Verdict pick="WATCH" start={at("shrinking it", 6)} y={900}/>
    <Loop start={at("Because")}/>
  </Canvas>
);};

const SCENES: Record<string, React.FC<SceneP>> = {
  d1: D1, d2: D2, d3: D3, d4: D4, d5: D5, d6: D6, e1: E1, e2: E2, e3: E3, e4: E4, e5: E5,
  f1: F1, f2: F2, f3: F3, f4: F4, f5: F5, g1: G1, g2: G2, g3: G3, g4: G4, g5: G5,
  h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, i1: I1, i2: I2, i3: I3, i4: I4, i5: I5,
  j1: J1, j2: J2, j3: J3, j4: J4, j5: J5, k1: K1, k2: K2, k3: K3, k4: K4, k5: K5,
  l1: L1, l2: L2, l3: L3, l4: L4, l5: L5, m1: M1, m2: M2, m3: M3, m4: M4, m5: M5,
  n1: N1, n2: N2, n3: N3, n4: N4, n5: N5, o1: O1, o2: O2, o3: O3, o4: O4, o5: O5,
  p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, r1: R1, r2: R2, r3: R3, r4: R4, r5: R5, r6: R6, r7: R7, s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, t1: TC1, t2: TC2, t3: TC3, t4: TC4, t5: TC5, t6: TC6, t7: TC7};

const Furniture: React.FC<{label: string}> = ({label}) => (
  <Canvas>
    <g transform="rotate(-4 220 150)">
      <rect x={60} y={90} width={420} height={110} fill="#ffe066" stroke="#e0b800" strokeWidth={2}/>
      <text x={270} y={163} fontFamily={HANDFONT} fontSize={52} textAnchor="middle" fill={INK}>napkin math</text>
    </g>
    <text x={1010} y={160} fontFamily={HANDFONT} fontSize={40} textAnchor="end" fill={INK}>{label}</text>
    <text x={540} y={1858} fontFamily={HANDFONT} fontSize={30} textAnchor="middle" fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>
    <text x={540} y={1896} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={22} textAnchor="middle" fill={INK} opacity={0.6}>Educational research, not investment advice · not SEBI-registered</text>
  </Canvas>
);

export const BankNapkin2: React.FC<{sid: string; label: string}> = ({sid, label}) => {
  const bs = BK2[sid]; const fr = frames(bs);
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {bs.map((b, i) => {
        const Scene = SCENES[b.key];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={fr[i]}>
            <AbsoluteFill><Scene b={b}/></AbsoluteFill>
            <Captions text={b.text.replace(/\b[A-Z](?: [A-Z])+\b/g, (m) => m.replace(/ /g, ""))} frames={fr[i]}/>
            <Audio src={staticFile(`hand/${sid}/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += fr[i];
        return el;
      })}
      <Furniture label={label}/>
    </AbsoluteFill>
  );
};
