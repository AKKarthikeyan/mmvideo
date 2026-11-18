// A02 b01-b14: hook, the castle, gate one (Marico), gate two (DMart), gate three (TCS). Plan: contentengine/moat60/production/A02/video/SCENE_PLAN.md.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SCue} from "./A01V4Cold";
import {Icon, IconName, Paper, Shot, Stamp, StickyNote} from "./A01V4Parts";
import {MWords as Words} from "./AsianPaintsMore";
import {Finish} from "./Texture";
import {C, F, ease, outQuint, clamp01} from "./tokens";
import {H0, MZ, PU, PUSH, S, W, WD, WL, WR} from "./A02Cue";
import {Big, Chip, Desk, Disc, Head, Lab, RowsCard} from "./AsianPaintsPieces";
import {CoinGrid, PriceTag, QuoteCard, SansBig} from "./AsianPaintsKit";
import {Balance} from "./AsianPaintsProps";
import {mk, Checklist, CastleRow, Coconut, Contract, HingeUp, Jars, WeekPick, REG, CUST} from "./A02Props";

export const OURREAD = "Our reading", ARTICLE = "Our article", MADE = "Made-up example", ARITH = "Our arithmetic";
const NOW = -999;

/** chapter card: GATE n, a question people search, yellow underline (copy of MChapterQ with a custom label) */
export const GateCard: React.FC<{f: number; d: number; label: string; q: string; icon?: IconName}> = ({f, d, label, q, icon = "castle"}) => {
  const k = ease(f, 0, 12, outQuint), w = ease(f, 5, 19, outQuint), u = ease(f, 20, 32, outQuint);
  return (
    <AbsoluteFill>
      <Paper drift={f / d}/>
      <AbsoluteFill style={{opacity: 0.1}}>
        {Array.from({length: 32}).map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8);
          return <div key={i} style={{position: "absolute", left: 60 + col * 250 + (row % 2) * 125 - f * 0.7, top: 70 + row * 260}}><Icon name={icon} size={110} color={C.ink}/></div>;
        })}
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 48, letterSpacing: 8, color: C.markerRed, opacity: k}}>{label}</div>
      <div style={{position: "absolute", left: 160, right: 160, top: 400, height: 330, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: q.length > 20 ? 122 : 150, lineHeight: 1.06, color: C.ink, transform: `translateY(${(1 - w) * 330}px)`}}>{q}</div>
      </div>
      <div style={{position: "absolute", left: 960 - 360, top: 760, width: 720, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%", mixBlendMode: "multiply"}}/>
      <Finish f={f}/>
    </AbsoluteFill>);
};

// ---- b01 hook: savings handed back across a counter
const b01a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico"}>
    <div style={{position: "absolute", left: 180, top: 640, width: 1560, height: 60, background: "#8A5A2B", border: `6px solid ${C.ink}`}}/>
    <div style={{position: "absolute", left: 180, top: 700, width: 1560, height: 250, background: "#B27B3E", border: `6px solid ${C.ink}`, borderTop: "none"}}/>
    <Disc f={f} at={0} name="bottle" x={520} y={470} size={260}/>
    {[0, 1, 2, 3].map((i) => {
      const p = ease(f, 14 + i * 5, 14 + i * 5 + 30, outQuint);
      return <div key={i} style={{position: "absolute", left: 720 + 420 * p, top: 600 - 40 * Math.sin(p * Math.PI), width: 60, height: 60, borderRadius: "50%", background: "#E2B13C", border: `5px solid ${C.ink}`, opacity: clamp01(p * 4)}}/>;
    })}
    <Disc f={f} at={20} name="person" x={1400} y={470} size={260}/>
    <Head f={f} at={a("b01", "savings") - 3} text="SAVINGS BACK?" x={960} y={800} size={84}/>
  </Desk>));
// ---- b02 the castle idea
const b02a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Why Moat?"}>
    <Disc f={f} at={2} name="shop" x={560} y={470} size={250}/>
    <Disc f={f} at={a("b02", "copy") - 6} name="shop" x={960} y={470} size={250} dim={0.3}/>
    <Disc f={f} at={a("b02", "copy") + 2} name="shop" x={1360} y={470} size={250} dim={0.3}/>
    <Head f={f} at={a("b02", "Rivals rush") + 2} text="RIVALS COPY" x={960} y={780} size={88}/>
  </Desk>));
const b02b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Why Moat?"}>
    <Disc f={f} at={2} name="castle" x={960} y={430} size={330}/>
    <div style={{position: "absolute", left: 540, top: 640, width: 840, height: 90, borderRadius: 45, background: "#9FC3D6", border: `6px solid ${C.ink}`, opacity: ease(f, 8, 20, outQuint)}}/>
    <Head f={f} at={a("b02", "moat") - 3} text="A MOAT" x={960} y={820} size={96}/>
  </Desk>));
const b02c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Our picture"}>
    <CastleRow f={f} at={0}/>
    <Head f={f} at={a("b02", "five gates") - 3} text="5 GATES" x={960} y={170} size={92}/>
  </Desk>));
const b02d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Our picture"}>
    <CastleRow f={f} at={-30} dim/>
    <StickyNote f={f} at={a("b02", "simple cut") - 10} text="OUR SIMPLE CUT" x={960} y={170}/>
  </Desk>));
// ---- b03 five companies, five hinges
const b03a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Five Indian companies"}>
    <CastleRow f={f} at={-30} names={a("b03", "At each gate")}/>
  </Desk>));
const b03b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Our picture"}>
    <HingeUp f={f} at={0} gate="GATE" label="THE HINGE: THE WEAK SPOT" />
  </Desk>));
const b03c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <CastleRow f={f} at={-30} names={NOW} hinges={{at: 2, kinds: ["n", "n", "n", "r", "r"], pulse: [3, 4]}}/>
  </Desk>));
const b03d = mk((f, a, d) => <Words f={f} d={d} text="Which two?" at={1} mark={["two?"]} markAt={a("b03", "Which two") + 2} size={170}/>);
// ---- b04 gate one: Marico
const b04card = mk((f, a, d) => <GateCard f={f} d={d} label="GATE 1" q="Can a brand be a moat?" icon="bottle"/>);
const b04a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico, 5 Aug 2026"}>
    <CastleRow f={f} at={-30} names={NOW} lit={[a("b04", 0), null, null, null, null]}/>
  </Desk>));
const b04b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Marico · investor presentation · 4 Aug 2026"}>
    <Disc f={f} at={2} name="bottle" x={960} y={400} size={300}/>
    <Head f={f} at={a("b04", "Parachute") - 3} text="PARACHUTE RIGIDS" x={960} y={760} size={84}/>
  </Desk>));
const b04c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico"}>
    <Coconut f={f} at={2} x={620} y={470} s={1.5}/>
    <PriceTag f={f} at={a("b04", "cheaper") - 14} x={1250} y={160} text="COPRA ▼" size={92}/>
    <Head f={f} at={a("b04", "cheaper") - 2} text="COPRA CHEAPER" x={960} y={820} size={80}/>
  </Desk>));
const b04d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico"}>
    <Jars f={f} at={0} passAt={a("b04", "passed")}/>
  </Desk>));
const b04e = mk((f, a, d) => <Words f={f} d={d} text="Did sales suffer?" at={1} mark={["suffer?"]} markAt={a("b04", "Did its sales") + 4} size={150}/>);
// ---- b05 the company's own sentence
const b05a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Marico · investor presentation · 4 Aug 2026 · p.34"}>
    <QuoteCard f={f} head="Investor presentation · p.34" lines={["“…selective price actions to pass on value to consumers.”"]} hl={[["selective price actions", a("b05", "selective") - 4]]} w={1500} size={68} y={500}/>
  </Desk>));
const b05b = mk((f, a, d) => <Words f={f} d={d} text="Selective. Not everything." at={1} mark={["Selective."]} markAt={a("b05", "Selective. Not|+0.3") + 2} size={130}/>);
// ---- b06 volume and revenue
const b06a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Marico · investor presentation · 4 Aug 2026"}>
    <Big f={f} at={a("b06", "ten percent") - 4} text="+10%" x={960} y={450} size={300} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("b06", "ten percent") + 6} text="VOLUME · HOW MUCH WAS SOLD" x={960} y={690} size={52}/>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{position: "absolute", left: 480 + i * 140, top: 800, opacity: ease(f, 6 + i * 3, 14 + i * 3, outQuint)}}><Icon name="bottle" size={110}/></div>)}
  </Desk>));
const b06b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Marico · investor presentation · 4 Aug 2026"}>
    <Big f={f} at={a("b06", "twenty-three") - 4} text="+23%" x={960} y={450} size={300} color={C.ink} rot={2}/>
    <Lab f={f} at={a("b06", "twenty-three") + 6} text="REVENUE · MONEY IN" x={960} y={690} size={52}/>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{position: "absolute", left: 480 + i * 140, top: 800, opacity: ease(f, 6 + i * 3, 14 + i * 3, outQuint)}}><Icon name="coin" size={110}/></div>)}
  </Desk>));
const b06c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD + " · from the two figures"}>
    <Big f={f} at={-20} text="+10%" x={600} y={420} size={230} color={C.ink}/>
    <Big f={f} at={-20} text="+23%" x={1320} y={420} size={230} color={C.ink}/>
    <Lab f={f} at={-20} text="VOLUME" x={600} y={600} size={46}/><Lab f={f} at={-20} text="REVENUE" x={1320} y={600} size={46}/>
    <Head f={f} at={a("b06", "price growth") - 3} text="PRICE GROWTH SLOWED" x={960} y={780} size={76}/>
  </Desk>));
const b06d = mk((f, a, d) => <Words f={f} d={d} text="Why keep buying?" at={1} mark={["buying?"]} markAt={a("b06", "So why") + 4} size={150}/>);
// ---- b07 the brand habit
const b07a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Wide-moat stocks, 9 Aug 2026"} chip2={OURREAD}>
    <Disc f={f} at={2} name="badge" x={960} y={420} size={300}/>
    <Head f={f} at={a("b07", "brand") - 3} text="A BRAND HOLDS THEM" x={960} y={780} size={80}/>
  </Desk>));
const b07b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}>
    <WeekPick f={f} at={0} weekAts={[a("b07", "same biscuit") - 6, a("b07", "every week") - 4, a("b07", "every week") + 10, a("b07", "without") - 2]}/>
  </Desk>));
const b07c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE + " · then our article"}>
    <WeekPick f={f} at={-60} weekAts={[-60, -50, -40, -30]}/>
    <Stamp f={f} at={a("b07", "brand moat") - 4} text="BRAND MOAT" x={960} y={880} size={92} rot={-4}/>
  </Desk>));
const b07d = mk((f, a, d) => <Words f={f} d={d} text="So why hand savings back?" at={1} mark={["back?"]} markAt={a("b07", "So why") + 6} size={130}/>);
// ---- b08 price both ways
const b08a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico, 5 Aug 2026"}>
    <PriceTag f={f} at={0} x={960} y={150 + 200 * ease(f, a("b08", "give price") - 4, a("b08", "give price") + 26, outQuint)} text="PRICE ▼" size={96}/>
    <Disc f={f} at={4} name="bottle" x={540} y={560} size={220}/><Disc f={f} at={6} name="person" x={1380} y={560} size={220}/>
    <Head f={f} at={a("b08", "costs fall") - 3} text="COSTS FALL" x={960} y={850} size={78}/>
  </Desk>));
const b08b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico, 5 Aug 2026"}>
    <PriceTag f={f} at={-20} x={960} y={350 - 200 * ease(f, a("b08", "raise price") - 2, a("b08", "raise price") + 26, outQuint)} text="PRICE ▲" size={96}/>
    <Disc f={f} at={-20} name="bottle" x={540} y={560} size={220}/><Disc f={f} at={-20} name="person" x={1380} y={560} size={220}/>
    <Head f={f} at={a("b08", "costs rise") - 3} text="COSTS RISE" x={960} y={850} size={78}/>
  </Desk>));
const b08c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico, 5 Aug 2026"}>
    <Disc f={f} at={2} name="person" x={960} y={400} size={280}/>
    <Stamp f={f} at={a("b08", "fair") - 4} text="FAIR" x={960} y={760} size={150} rot={-5} color="#2E8B57"/>
  </Desk>));
const b08d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico, 5 Aug 2026"}>
    <PriceTag f={f} at={0} x={620} y={300} text="PRICE ▼" size={86} dim={0.4}/>
    <PriceTag f={f} at={a("b08", "next price") - 8} x={1300} y={150} text="NEXT TIME" size={86}/>
    <Head f={f} at={a("b08", "easier") - 3} text="EASIER TO ACCEPT" x={960} y={830} size={76}/>
  </Desk>));
// ---- b09 gate two: DMart
const b09card = mk((f, a, d) => <GateCard f={f} d={d} label="GATE 2" q="Can a low price be a moat?" icon="shop"/>);
const b09a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · DMart Q2, 11 Oct 2026"}>
    <CastleRow f={f} at={-30} names={NOW} lit={[NOW, a("b09", 0), null, null, null]}/>
  </Desk>));
const b09b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH + " · 804 ÷ 19,206"} chip2="September quarter 2026">
    <CoinGrid f={f} at={2} ink={4.19} inkAt={a("b09", "four rupees") - 20} x={560} y={540} instant={false}/>
    <SansBig f={f} at={a("b09", "four rupees") - 3} text="₹4" x={1340} y={400} size={240} color={C.ink}/>
    <Lab f={f} at={a("b09", "hundred rupees") - 2} text="of every ₹100 sold" x={1340} y={600} size={50}/>
  </Desk>));
const b09c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · DMart Q2, 11 Oct 2026"}>
    <Disc f={f} at={2} name="shop" x={960} y={400} size={280}/>
    <Head f={f} at={a("b09", "by design") - 3} text="THIN ON PURPOSE" x={960} y={780} size={88}/>
  </Desk>));
// ---- b10 why thin is a strength
const b10a = mk((f, a, d) => <Words f={f} d={d} text="Why is thin a strength?" at={1} mark={["strength?"]} markAt={a("b10", "Why is thin") + 8} size={130}/>);
const b10b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · DMart Q2, 11 Oct 2026"}>
    <Disc f={f} at={2} name="tag" x={960} y={400} size={280}/>
    <Head f={f} at={a("b10", "lowest everyday") - 3} text="LOWEST EVERYDAY PRICE" x={960} y={780} size={76}/>
  </Desk>));
const b10c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · the condition for the promise"}>
    <Balance f={f} at={0} tipAt={9999} left="THE PROMISE" right="LOWEST COSTS" y={420}/>
    <Head f={f} at={a("b10", "only if") - 3} text="ONLY IF COSTS ARE LOWEST" x={960} y={850} size={66}/>
  </Desk>));
const b10d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Balance f={f} at={-20} tipAt={a("b10", "higher costs")} left="RIVAL'S PRICE" right="RIVAL'S COST" y={420}/>
    <Head f={f} at={a("b10", "below") - 3} text="BELOW ITS OWN COST" x={960} y={850} size={74}/>
  </Desk>));
// ---- b11 gate three: TCS
const b11card = mk((f, a, d) => <GateCard f={f} d={d} label="GATE 3" q="Can a lock be a moat?" icon="lock"/>);
const b11a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · TCS Q2, 9 Oct 2026"}>
    <CastleRow f={f} at={-30} names={NOW} lit={[NOW, NOW, a("b11", 0), null, null]}/>
  </Desk>));
const b11b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · TCS Q2, 9 Oct 2026"}>
    <PriceTag f={f} at={a("b11", "price tag") - 6} x={960} y={150} text="₹1 lakh" size={150} q={a("b11", "typo") + 2}/>
  </Desk>));
// ---- b12 what TCS is buying
const b12a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"TCS notice to the stock exchange · 1 Oct 2026"}>
    <Disc f={f} at={2} name="gear" x={960} y={400} size={280}/>
    <Head f={f} at={a("b12", "technology") - 3} text="TCS RUNS TECH" x={960} y={780} size={90}/>
  </Desk>));
const b12b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"TCS notice to the stock exchange · 1 Oct 2026"} chip2={ARTICLE + " · TCS Q2, 9 Oct 2026"}>
    <RowsCard f={f} head="The Best Buy deal" rows={[{l: "BEST BUY INDIA CENTRE", v: "", hl: a("b12", "Best Buy's") - 3}, {l: "ABOUT 450 PEOPLE", v: "", hl: a("b12", "four hundred") - 3},
      {l: "PRICE", v: "₹1 LAKH", hl: a("b12", "one lakh") - 3}, {l: "NOTICE", v: "1 OCT 2026", hl: a("b12", "first of October") - 3}]} w={1400} y={520}/>
  </Desk>));
const b12c = mk((f, a, d) => <Words f={f} d={d} text="Buying what?" at={1} mark={["what?"]} markAt={a("b12", "really buying") + 2} size={180}/>);
// ---- b13 the contract is the prize
const b13a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · TCS Q2, 9 Oct 2026"}>
    <Contract f={f} at={0} wrapAt={a("b13", "multi-year") - 4} tagShrinkAt={a("b13", "multi-year") + 20}/>
  </Desk>));
const b13b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · a pattern"}>
    <Disc f={f} at={2} name="handshake" x={960} y={400} size={280}/>
    <Head f={f} at={a("b13", "pattern") - 3} text="A PATTERN" x={960} y={780} size={96}/>
  </Desk>));
const b13c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · TCS Q2, 9 Oct 2026"}>
    <Contract f={f} at={-40} wrapAt={-40} tagShrinkAt={-40}/>
    <Head f={f} at={a("b13", "sit inside") - 3} text="PEOPLE AND SYSTEMS INSIDE" x={960} y={850} size={62}/>
  </Desk>));
const b13d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Contract f={f} at={-40} wrapAt={-40} tagShrinkAt={-40}/>
    <Head f={f} at={a("b13", "price is small") - 3} text="SMALL PRICE. BIG PRIZE." x={960} y={850} size={76}/>
  </Desk>));
// ---- b14 the lock
const b14a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · TCS Q2, 9 Oct 2026"}>
    <Disc f={f} at={2} name="lock" x={960} y={400} size={300}/>
    <Head f={f} at={a("b14", "lock") - 3} text="A LOCK" x={960} y={780} size={110}/>
  </Desk>));
const b14b = mk((f, a, d) => <Words f={f} d={d} text="Why so hard to leave?" at={1} mark={["leave?"]} markAt={a("b14", "so hard") + 4} size={130}/>);
import {SalaryAcct} from "./A02Props";
const b14c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}>
    <SalaryAcct f={f} at={0} billsAt={[a("b14", "rent") - 4, a("b14", "EMI") - 4, a("b14", "light bill") - 4]}/>
  </Desk>));
const b14d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}>
    <SalaryAcct f={f} at={-40} billsAt={[-40, -40, -40]} hesitateAt={a("b14", "easy") - 10}/>
  </Desk>));
const b14e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}>
    <SalaryAcct f={f} at={-40} billsAt={[-40, -40, -40]} redAt={a("b14", "everything") - 2}/>
    <Head f={f} at={a("b14", "pain") - 3} text="THE PAIN" x={960} y={880} size={80}/>
  </Desk>));

export const SHOTS1: Shot[] = [
  S("b01", 0, H0, b01a),
  S("b02", 0, WL, b02a), S("b02", "A few", PU, b02b), S("b02", "Today", WR, b02c), S("b02", "Experts", H0, b02d),
  S("b03", 0, WD, b03a), S("b03", "Every gate also", PU, b03b), S("b03", "For two of the five", WL, b03c), S("b03", "Which two", H0, b03d),
  S("b04", -0.85, PU, b04card), S("b04", 0.4, MZ, b04a), S("b04", "Marico's oldest", WR, b04b), S("b04", "Copra", PU, b04c), S("b04", "Marico could", WL, b04d), S("b04", "Did its sales", H0, b04e),
  S("b05", 0, PU, b05a), S("b05", "Selective. Not", H0, b05b),
  S("b06", 0, WR, b06a), S("b06", "Revenue grew twenty", PU, b06b), S("b06", "Revenue grew faster", WL, b06c), S("b06", "So why", H0, b06d),
  S("b07", 0, PU, b07a), S("b07", "Made-up", WD, b07b), S("b07", "That habit", H0, b07c), S("b07", "So why hand", H0, b07d),
  S("b08", 0, WL, b08a), S("b08", "It can raise", PU, b08b), S("b08", "Shoppers read", WR, b08c), S("b08", "The giveback", PU, b08d),
  S("b09", -0.85, PU, b09card), S("b09", 0.4, MZ, b09a), S("b09", "In the September", WR, b09b), S("b09", "Our article says", PU, b09c),
  S("b10", 0, H0, b10a), S("b10", "DMart's promise", PU, b10b), S("b10", "Our article says", WL, b10c), S("b10", "Our reading", PU, b10d),
  S("b11", -0.85, PU, b11card), S("b11", 0.4, MZ, b11a), S("b11", "And it starts", WD, b11b),
  S("b12", 0, WR, b12a), S("b12", "On the first", PU, b12b), S("b12", "So what", H0, b12c),
  S("b13", 0, PU, b13a), S("b13", "Our article calls", WL, b13b), S("b13", "That feeds", PU, b13c), S("b13", "Our reading", WR, b13d),
  S("b14", 0, PU, b14a), S("b14", "So why is leaving", H0, b14b), S("b14", "Made-up", WD, b14c), S("b14", "Moving the account", PU, b14d), S("b14", "Moving everything", WL, b14e),
];
export const CUES1: SCue[] = [
  [W("b01", 0), "pop", 0.4], [W("b02", 0), "whoosh", 0.4], [W("b02", "A few"), "paper", 0.5], [W("b02", "Today"), "whooshDeep", 0.4], [W("b03", "At each gate"), "pop", 0.4], [W("b03", "For two of the five"), "whoosh", 0.4],
  [W("b04", -0.85), "paper", 0.6], [W("b04", 0.4), "ding", 0.4], [W("b04", "Copra"), "pop", 0.4], [W("b05", 0), "paper", 0.5], [W("b05", "selective"), "highlighter", 0.4],
  [W("b06", 0), "whoosh", 0.4], [W("b06", "Revenue grew twenty"), "paper", 0.4], [W("b07", "Made-up"), "whoosh", 0.4], [W("b07", "That habit"), "stamp", 0.6],
  [W("b08", "Shoppers read"), "stamp", 0.5], [W("b09", -0.85), "paper", 0.6], [W("b09", 0.4), "ding", 0.4], [W("b09", "In the September"), "whoosh", 0.4],
  [W("b10", "DMart's promise"), "paper", 0.4], [W("b11", -0.85), "paper", 0.6], [W("b11", 0.4), "ding", 0.4], [W("b11", "And it starts"), "whoosh", 0.4],
  [W("b12", "On the first"), "paper", 0.4], [W("b13", 0), "paper", 0.4], [W("b14", "Made-up"), "whoosh", 0.4], [W("b14", "Moving everything"), "pop", 0.4],
];
