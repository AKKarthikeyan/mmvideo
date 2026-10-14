// Channel intro in the napkin-math style, 16:9 (13 Oct 2026). AK-approved script; narration built by scripts/hand_intro.py.
// The tea stalls are a made-up example. DMart: Q2 FY27 results filed 10 Oct 2026 (revenue +18.4%, profit after tax +7.6%).
// Unlike the vertical napkin Shorts, a page here can span several beats, so the sum builds up on one napkin.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import beats from "../../public/hand/introN/beats.json";
import {HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";

export const NIFPS = 30;
const PAD = 0.15, W = 1920, H = 1080, GREY = "#555";
type B = {key: string; text: string; sec: number};
const BS = beats as B[];
const TAIL = 1.5;   // the last page holds this long after the last word
const FR = BS.map((b, i) => Math.ceil((b.sec + PAD + (i === BS.length - 1 ? TAIL : 0)) * NIFPS));
const FROM = FR.map((_, i) => FR.slice(0, i).reduce((a, b) => a + b, 0));
export const napIntroTotal = FR.reduce((a, b) => a + b, 0);
const idx = (k: string) => { const i = BS.findIndex((b) => b.key === k); if (i < 0) throw new Error(`no beat ${k}`); return i; };
// Frame, counted from the start of the page that opens with beat `first`, at which `phrase` of beat `key` is spoken.
const mk = (first: string) => (key: string, phrase?: string, off = 0) => {
  const i = idx(key), b = BS[i], base = FROM[i] - FROM[idx(first)];
  if (!phrase) return base + off;
  const p = b.text.toLowerCase().indexOf(phrase.toLowerCase());
  if (p < 0) throw new Error(`phrase not in ${key}: ${phrase}`);
  return base + Math.round(b.sec * NIFPS * p / b.text.length) + off;
};

const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>{children}</svg>
);
const Napkin: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -1.2}) => (
  <g transform={`rotate(${rot} 960 510)`}>
    <rect x={240} y={110} width={1440} height={800} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 13}, (_, i) => <line key={i} x1={240} y1={170 + i * 60} x2={1680} y2={170 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);
// Static text, on the page from its first frame.
const S: React.FC<{x?: number; y: number; size?: number; color?: string; mid?: boolean; children: string}> = ({x = 960, y, size = 64, color = INK, mid = true, children}) => (
  <HWrite x={x} y={y} start={-12} dur={8} size={size} color={color} anchor={mid ? "middle" : "start"} hand={false}>{children}</HWrite>
);
// A tea stall: an awning with its name over a counter.
const Stall: React.FC<{cx: number; y: number; start: number; name: string}> = ({cx, y, start, name}) => (
  <>
    <HDraw shape={sh.rect(cx - 110, y, 220, 54, {stroke: INK, strokeWidth: 5, seed: cx, fill: "rgba(217,72,15,0.16)", fillStyle: "hachure"})} start={start} dur={10}/>
    <HDraw shape={sh.rect(cx - 90, y + 54, 180, 80, {stroke: INK, strokeWidth: 5, seed: cx + 1})} start={start + 6} dur={10} hand={false}/>
    <HWrite x={cx} y={y + 40} start={start + 10} dur={8} size={36} anchor="middle" hand={false}>{name}</HWrite>
  </>
);
// A queue of stick customers, heads at height y.
const Queue: React.FC<{x: number; y: number; n: number; start: number}> = ({x, y, n, start}) => (
  <>{Array.from({length: n}, (_, i) => (
    <React.Fragment key={i}>
      <HDraw shape={sh.circle(x + i * 50, y, 34, {strokeWidth: 4, seed: 40 + i})} start={start + i * 4} dur={5} hand={false}/>
      <HDraw shape={sh.line(x + i * 50, y + 17, x + i * 50, y + 62, {strokeWidth: 4, seed: 50 + i})} start={start + i * 4 + 3} dur={4} hand={false}/>
    </React.Fragment>
  ))}</>
);
const Tick: React.FC<{x: number; y: number; start: number}> = ({x, y, start}) => (
  <>
    <HDraw shape={sh.line(x, y - 20, x + 22, y + 4, {stroke: GREEN, strokeWidth: 10, seed: 71})} start={start} dur={4} hand={false}/>
    <HDraw shape={sh.line(x + 22, y + 4, x + 66, y - 52, {stroke: GREEN, strokeWidth: 10, seed: 72})} start={start + 4} dur={5} hand={false}/>
  </>
);

// ---- page 1 (i1 to i6): the sum builds on one napkin ----
const P1: React.FC = () => { const at = mk("i1"); const A = 620, Bx = 1240; return (
  <Canvas><Napkin>
    <S x={266} y={148} size={28} color={GREY} mid={false}>a made-up example</S>
    <Stall cx={A} y={160} start={2} name="TEA · A"/>
    <Stall cx={Bx} y={160} start={16} name="TEA · B"/>
    <HWrite x={A} y={400} start={at("i1", "ten rupees")} size={96} anchor="middle">₹10</HWrite>
    <HWrite x={Bx} y={400} start={at("i1", "fifteen")} size={96} anchor="middle">₹15</HWrite>
    <Queue x={1378} y={230} n={4} start={at("i1", "has the queue")}/>
    <HWrite x={A} y={500} start={at("i2", "eight rupees")} size={72} anchor="middle" color={GREY}>− ₹8</HWrite>
    <HWrite x={Bx} y={500} start={at("i2", "eight rupees", 10)} size={72} anchor="middle" color={GREY}>− ₹8</HWrite>
    <HDraw shape={sh.line(500, 530, 740, 530, {strokeWidth: 6, seed: 21})} start={at("i3")} dur={8} hand={false}/>
    <HDraw shape={sh.line(1120, 530, 1360, 530, {strokeWidth: 6, seed: 22})} start={at("i3", undefined, 4)} dur={8} hand={false}/>
    <HWrite x={A} y={640} start={at("i3", "two rupees")} size={110} anchor="middle" color={RED}>= ₹2</HWrite>
    <HWrite x={Bx} y={640} start={at("i3", "seven")} size={110} anchor="middle" color={GREEN}>= ₹7</HWrite>
    <HWrite x={A} y={775} start={at("i4", "four hundred")} size={54} anchor="middle" color={RED}>× 200 = ₹400</HWrite>
    <HWrite x={Bx} y={775} start={at("i4", "fourteen hundred")} size={54} anchor="middle" color={GREEN}>× 200 = ₹1,400</HWrite>
    <HWrite x={930} y={855} start={at("i4", "two hundred cups")} dur={8} size={38} anchor="middle" color={GREY} hand={false}>at 200 cups a day</HWrite>
    <HDraw shape={sh.ellipse(A, 605, 310, 150, {stroke: BLUE, strokeWidth: 7, seed: 31})} start={at("i5", "keeps")} dur={10}/>
    <HDraw shape={sh.ellipse(Bx, 605, 310, 150, {stroke: BLUE, strokeWidth: 7, seed: 32})} start={at("i5", "keeps", 10)} dur={10}/>
    <HWrite x={930} y={628} start={at("i5", "its margin")} size={70} anchor="middle" color={BLUE}>MARGIN</HWrite>
    <HDraw shape={sh.line(1358, 304, 1550, 304, {stroke: RED, strokeWidth: 7, seed: 33})} start={at("i6", "the queue")} dur={8}/>
    <HDraw shape={sh.ellipse(1338, 233, 540, 206, {stroke: BLUE, strokeWidth: 8, seed: 34})} start={at("i6", "does not walk")} dur={16}/>
    <HWrite x={895} y={258} start={at("i6", "That is")} size={80} anchor="middle" color={BLUE}>MOAT</HWrite>
    <HDraw shape={sh.line(1006, 232, 1060, 232, {stroke: BLUE, strokeWidth: 7, seed: 35})} start={at("i6", "That is", 14)} dur={5} hand={false}/>
  </Napkin></Canvas>
);};
// ---- page 2 (i7): what a moat can be ----
const P2: React.FC = () => { const at = mk("i7"); return (
  <Canvas>
    <Stall cx={480} y={370} start={-40} name="TEA · B"/>
    <Queue x={640} y={440} n={4} start={-40}/>
    <HDraw shape={sh.ellipse(590, 440, 700, 320, {stroke: BLUE, strokeWidth: 8, seed: 61})} start={-40} dur={10} hand={false}/>
    <S x={590} y={700} size={80} color={BLUE}>MOAT</S>
    <HWrite x={990} y={360} start={at("i7", "the taste")} size={84}>the taste?</HWrite>
    <HWrite x={990} y={500} start={at("i7", "thirty years")} size={72}>30 years of trust?</HWrite>
    <HDraw shape={sh.line(985, 560, 1780, 560, {strokeWidth: 7, seed: 62})} start={at("i7", "Whatever")} dur={10}/>
    <HWrite x={990} y={700} start={at("i7", "next door")} size={84} color={RED}>can't be copied.</HWrite>
  </Canvas>
);};
// ---- page 3 (i8): the name ----
const P3: React.FC = () => { const at = mk("i8"); return (
  <Canvas>
    <S y={250} size={56} color={GREY}>our name · our whole job</S>
    <HWrite x={960} y={500} start={at("i8", "our name")} size={170} anchor="middle" dur={30}>{"MOAT & MARGIN"}</HWrite>
    <HDraw shape={sh.line(300, 540, 1620, 540, {strokeWidth: 8, seed: 63})} start={at("i8", "our whole job", 4)} dur={8} hand={false}/>
    <HWrite x={490} y={650} start={at("i8", "Moat and Margin", -10)} dur={10} size={46} anchor="middle" color={BLUE}>what keeps rivals out</HWrite>
    <HWrite x={1330} y={650} start={at("i8", "Moat and Margin", 5)} dur={10} size={46} anchor="middle" color={GREEN}>what a business keeps</HWrite>
  </Canvas>
);};
// ---- page 4 (i9): a day of filings, and the few that matter ----
const PICK = [3, 13, 17];
const P4: React.FC = () => { const at = mk("i9"); const x0 = 385, ys = [200, 360, 520]; return (
  <Canvas><Napkin rot={1}>
    <S y={166} size={38} color={GREY}>one working day · hundreds of filings</S>
    {Array.from({length: 24}, (_, i) => (
      <HDraw key={i} shape={sh.rect(x0 + (i % 8) * 150, ys[Math.floor(i / 8)], 100, 120, {strokeWidth: 4, seed: 100 + i, fill: "rgba(0,0,0,0.10)", fillStyle: "hachure"})}
             start={at("i9", "companies file") + i} dur={6} hand={false}/>
    ))}
    {PICK.map((i, k) => (
      <HDraw key={i} shape={sh.ellipse(x0 + (i % 8) * 150 + 50, ys[Math.floor(i / 8)] + 60, 170, 180, {stroke: RED, strokeWidth: 8, seed: 130 + k})}
             start={at("i9", "We pick out") + k * 8} dur={8}/>
    ))}
    <HWrite x={960} y={800} start={at("i9", "the few")} size={84} anchor="middle" color={RED}>the few that matter</HWrite>
  </Napkin></Canvas>
);};
// ---- page 5 (i10): the same sum on a real company ----
const P5: React.FC = () => { const at = mk("i10"); return (
  <Canvas><Napkin>
    <S y={178} size={44} color={GREY}>the same sum, on a real company</S>
    <HWrite x={300} y={255} start={at("i10", "D Mart sold", -4)} dur={8} size={36} color={GREY} hand={false}>DMart · Q2 FY27 · results filed 10 Oct 2026</HWrite>
    <HWrite x={330} y={420} start={at("i10", "D Mart sold")} size={90}>sales</HWrite>
    <HWrite x={760} y={420} start={at("i10", "eighteen percent")} size={140} color={GREEN}>+18.4%</HWrite>
    <HWrite x={330} y={610} start={at("i10", "Its profit")} size={90}>profit</HWrite>
    <HWrite x={760} y={610} start={at("i10", "under eight")} size={140} color={RED}>+7.6%</HWrite>
    <HDraw shape={sh.line(300, 672, 1380, 672, {strokeWidth: 7, seed: 64})} start={at("i10", "We went")} dur={10}/>
    <HWrite x={960} y={840} start={at("i10", "found out why")} size={160} anchor="middle" color={BLUE}>why?</HWrite>
  </Napkin></Canvas>
);};
// ---- page 6 (i11): what we do not do, and what we do ----
const P6: React.FC = () => { const at = mk("i11"); return (
  <Canvas>
    <HWrite x={380} y={340} start={2} dur={10} size={150}>tips</HWrite>
    <HDraw shape={sh.line(360, 300, 790, 286, {stroke: RED, strokeWidth: 12, seed: 65})} start={14} dur={6}/>
    <HWrite x={980} y={340} start={at("i11", "No targets")} dur={12} size={150}>targets</HWrite>
    <HDraw shape={sh.line(960, 300, 1660, 286, {stroke: RED, strokeWidth: 12, seed: 66})} start={at("i11", "No targets", 14)} dur={6}/>
    <Tick x={430} y={540} start={at("i11", "the numbers", 10)}/>
    <HWrite x={540} y={550} start={at("i11", "the numbers")} size={84}>the numbers</HWrite>
    <Tick x={430} y={680} start={at("i11", "plain words", 10)}/>
    <HWrite x={540} y={690} start={at("i11", "plain words")} size={84}>in plain words</HWrite>
    <Tick x={430} y={820} start={at("i11", "the document", 10)}/>
    <HWrite x={540} y={830} start={at("i11", "the document")} size={84} color={BLUE}>with the document linked</HWrite>
  </Canvas>
);};
// ---- page 7 (i12): the close ----
const P7: React.FC = () => { const at = mk("i12"); return (
  <Canvas>
    <HWrite x={960} y={240} start={2} dur={30} size={76} anchor="middle">once you can read a business,</HWrite>
    <HWrite x={960} y={360} start={at("i12", "you see it")} size={84} anchor="middle" color={BLUE}>you see it everywhere.</HWrite>
    <Stall cx={500} y={500} start={at("i12", "Even at")} name="TEA"/>
    <Queue x={660} y={570} n={4} start={at("i12", "tea stall")}/>
    <HDraw shape={sh.rect(1020, 500, 620, 150, {stroke: RED, strokeWidth: 8, seed: 67, fill: "rgba(217,72,15,0.18)", fillStyle: "hachure"})} start={at("i12", "Subscribe", -6)} dur={12}/>
    <HWrite x={1330} y={608} start={at("i12", "Subscribe")} size={96} anchor="middle" color={RED}>SUBSCRIBE</HWrite>
    <HWrite x={1330} y={760} start={at("i12", "Subscribe", 18)} dur={22} size={56} anchor="middle">@moatmarginresearch</HWrite>
  </Canvas>
);};

const PAGES: {first: string; last: string; C: React.FC}[] = [
  {first: "i1", last: "i6", C: P1}, {first: "i7", last: "i7", C: P2}, {first: "i8", last: "i8", C: P3}, {first: "i9", last: "i9", C: P4},
  {first: "i10", last: "i10", C: P5}, {first: "i11", last: "i11", C: P6}, {first: "i12", last: "i12", C: P7}];

// Captions for muted viewing: the beat's sentences, one at a time, under the napkin.
const Cap: React.FC<{text: string; frames: number}> = ({text, frames}) => {
  const f = useCurrentFrame();
  const parts = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  const total = parts.reduce((a, s) => a + s.length, 0);
  let acc = 0, cur = parts[0];
  for (const s of parts) { const end = (acc + s.length) / total * frames; if (f < end) { cur = s; break; } acc += s.length; cur = s; }
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 72, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.78)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 34, lineHeight: 1.4, padding: "6px 14px", borderRadius: 8}}>{cur}</span>
    </div>
  );
};
const Furniture: React.FC = () => (
  <Canvas>
    <g transform="rotate(-4 200 70)">
      <rect x={40} y={28} width={330} height={84} fill="#ffe066" stroke="#e0b800" strokeWidth={2}/>
      <text x={205} y={86} fontFamily={HANDFONT} fontSize={44} textAnchor="middle" fill={INK}>napkin math</text>
    </g>
    <text x={1880} y={72} fontFamily={HANDFONT} fontSize={36} textAnchor="end" fill={INK}>Moat &amp; Margin</text>
    <text x={960} y={1042} fontFamily={HANDFONT} fontSize={26} textAnchor="middle" fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>
    <text x={960} y={1068} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={18} textAnchor="middle" fill={INK} opacity={0.6}>Educational research, not investment advice · not SEBI-registered</text>
  </Canvas>
);

export const NapkinIntro: React.FC = () => (
  <AbsoluteFill style={{background: PAPER}}>
    <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
    {PAGES.map((p) => {
      const a = idx(p.first), z = idx(p.last), dur = FR.slice(a, z + 1).reduce((x, y) => x + y, 0);
      return <Sequence key={p.first} from={FROM[a]} durationInFrames={dur}><AbsoluteFill><p.C/></AbsoluteFill></Sequence>;
    })}
    {BS.map((b, i) => (
      <Sequence key={b.key} from={FROM[i]} durationInFrames={FR[i]}>
        <Cap text={b.text.replace(/D Mart/g, "DMart")} frames={Math.ceil((b.sec + PAD) * NIFPS)}/>
        <Audio src={staticFile(`hand/introN/${b.key}.mp3`)}/>
      </Sequence>
    ))}
    <Furniture/>
  </AbsoluteFill>
);
