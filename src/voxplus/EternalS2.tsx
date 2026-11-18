// eternalq2 chapter 2 "Why does ninety paise matter?" (q01-q09).
import React from "react";
import {random} from "remotion";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Ring, SP, Shot, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {MapRoute, useGeo} from "./MapRoute";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, step, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./EternalCue";
import {Desk, Big, Black, Counter, Cursor, Disc, Doc, Head, Lab, LETTER, Receipt, XI} from "./EternalPieces";

const MEASURE = "Company's measure: adjusted EBITDA";

const q01card: React.FC<SP> = () => {
  const f = useTicks();
  return <ChapterQ f={f} d={90} n={2} q="Why does ninety paise matter?" icon="coin"/>;
};
// stairs: Blinkit adjusted EBITDA as % of NOV, the five quarters in the letter's annexure table (p.15)
const STEPS: [string, number][] = [["Q2 FY26", -1.3], ["Q3 FY26", 0.0], ["Q4 FY26", 0.3], ["Q1 FY27", 0.6], ["Q2 FY27", 0.9]];
const q01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t6 = a("q01", "six quarters");
  const zero = 640, k = 170;
  return (
    <Black f={f} d={d} chip={LETTER("8, 15")} chip2={MEASURE + " · % of order value"}>
      <div style={{position: "absolute", left: 120, top: 92, fontFamily: F.serif, fontSize: 80, color: C.white}}>Blinkit's margin</div>
      <div style={{position: "absolute", left: 300, top: zero - 2, width: 1340, height: 4, background: "rgba(255,255,255,0.6)"}}/>
      <Lab f={f} at={0} text="0%" x={250} y={zero} color="#9C968C" size={28}/>
      {STEPS.map(([q, v], i) => {
        const g = ease(f, 2 + i * 7, 2 + i * 7 + 14, outCubic), x = 360 + i * 260, y = zero - v * k;
        return (
          <React.Fragment key={q}>
            <div style={{position: "absolute", left: x, top: Math.min(y, zero), width: 220, height: Math.max(4, Math.abs(v * k)) * g, background: v < 0 ? C.markerRed : i === 4 ? C.highlightPrint : C.chartBlue,
              transformOrigin: v < 0 ? "50% 0" : "50% 100%"}}/>
            <Lab f={f} at={2 + i * 7} text={(v > 0 ? "+" : "") + v.toFixed(1) + "%"} x={x + 110} y={v < 0 ? zero + v * -k + 50 : y - 50} color={i === 4 ? C.highlightPrint : C.white} size={44}/>
            <Lab f={f} at={2 + i * 7} text={q} x={x + 110} y={940} color="#9C968C" size={26}/>
          </React.Fragment>
        );
      })}
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d={`M 470 ${zero + 1.3 * k} ` + STEPS.slice(1).map(([, v], i) => `L ${470 + (i + 1) * 260} ${zero - v * k}`).join(" ")} fill="none" stroke={C.highlight}
          strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 10, 40, inOut)}/>
      </svg>
      <Head f={f} at={t6} text="SIX IN A ROW" x={1520} y={250} rot={3} light/>
      <Lab f={f} at={t6 + 6} text="the letter's count" x={1520} y={330} color="#CFC9BE" size={28}/>
    </Black>
  );
};
const q02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 520], [d, 1.1, 900, 500]]} chip={LETTER("12")} chip2="Company's claim">
      <Receipt f={f} x={760} y={150} enterAt={0} head="BLINKIT" lines={[{l: "ORDERS", r: "₹100.00", at: 3}, {l: "", r: "", at: 5}, {l: "MARGIN NOW", r: "₹0.90", at: 7, big: true}]} rot={-2}/>
      <Head f={f} at={a("q02", "grown up")} text="GROWN UP BLINKIT" x={1420} y={420} rot={3}/>
    </Desk>
  );
};
const q02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const five = a("q02", "five percent");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 860, 470]]} chip={LETTER("12")} chip2="Company's claim">
      <Doc f={f} name="mature" x={960} y={480} width={1500} hl={[["Our mature cities already operate at over 5% Adjusted EBITDA margin.", a("q02", "Our mature")]]}/>
      <StickerLabel f={f} text="MATURE CITIES: OVER 5%" x={1300} y={820} size={58} rot={-3} dark enter={{at: five, mode: "pop", rot0: -10}}/>
    </Desk>
  );
};
const q03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("12")} chip2={MEASURE}>
      <Ring f={f} x={760} y={520} r={250} from={0} to={70} at={a("q03", "seventy") - 6} label="OF BLINKIT'S ORDER VALUE"/>
      <Head f={f} at={a("q03", "in profit")} text="70% IN PROFIT" x={1450} y={500} rot={3} light/>
      <Lab f={f} at={a("q03", "in profit") + 6} text="cities, on that measure" x={1450} y={590} color="#CFC9BE" size={30}/>
    </Black>
  );
};
// density: orders crowd round one store
const q04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const ff = step(f, 2);
  const n = Math.min(60, Math.floor(2 + ff * 0.9));
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 540], [d, 0.95, 960, 540]]} chip="Illustration">
      <Disc f={f} at={0} name="store" x={960} y={540} size={230}/>
      {Array.from({length: n}).map((_, i) => {
        const ang = random("da" + i) * Math.PI * 2, r = 180 + random("dr" + i) * 330 * (1 - 0.5 * ease(f, 0, d));
        const p = spr(f, i / 0.9, 12, 200);
        return <div key={i} style={{position: "absolute", left: 960 + Math.cos(ang) * r - 14, top: 540 + Math.sin(ang) * r * 0.75 - 14, width: 28, height: 28, borderRadius: "50%",
          background: C.markerRed, transform: `scale(${p})`}}/>;
      })}
      <Lab f={f} at={8} text="orders near one store" x={960} y={950}/>
    </Desk>
  );
};
const q04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Density." at={0} mark={["Density."]} markAt={6} size={230}/>;
};
const q04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 520]]} chip={LETTER("9")}>
      <Doc f={f} name="density" x={960} y={520} width={1560} hl={[["As density builds, our cost to serve each order falls", a("q04", "As density")]]}/>
    </Desk>
  );
};
const q05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const speed = 1 + 3 * ease(f, 0, d, inOut);
  const sh = 1 - 0.45 * ease(f, a("q05", "busier") - 10, a("q05", "busier") + 10);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 560], [d, 1.0, 960, 540]]} chip="Our reading" chip2="Illustration">
      <Disc f={f} at={0} name="shelf" x={500} y={500} size={250}/>
      <Disc f={f} at={4} name="scooter" x={1420} y={500} size={250}/>
      {Array.from({length: 8}).map((_, i) => {
        const ph = ((f * 0.012 * speed + i / 8) % 1);
        return <div key={i} style={{position: "absolute", left: 640 + ph * 640 - 16, top: 484 - Math.sin(ph * Math.PI) * 90, width: 32, height: 32, borderRadius: 6, background: C.markerRed, opacity: f > 6 ? 1 : 0}}/>;
      })}
      <div style={{position: "absolute", left: 960, top: 800, transform: `translate(-50%, -50%) scale(${sh})`, background: "#F2DDA8", padding: "18px 34px",
        fontFamily: F.sans, fontWeight: 900, fontSize: 44, boxShadow: "0 10px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap"}}>COST PER ORDER</div>
      <Head f={f} at={a("q05", "more orders")} text="SAME SHELF, MORE ORDERS" x={960} y={190} rot={-2} size={56}/>
    </Desk>
  );
};
const StoreGrid: React.FC<{f: number; at: number; n: number; per?: number}> = ({f, at, n, per = 0.12}) => (
  <div style={{position: "absolute", left: 1180, top: 300, width: 600, height: 500}}>
    {Array.from({length: n}).map((_, i) => {
      const p = spr(f, at + i * per, 12, 220);
      return <div key={i} style={{position: "absolute", left: (i % 20) * 30, top: Math.floor(i / 20) * 30, width: 24, height: 24, transform: `scale(${p})`}}>
        <XI name="store" size={24} sw={10}/></div>;
    })}
  </div>
);
const q06a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("q06", "Three hundred");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip={LETTER("8")}>
      <Head f={f} at={2} text="HOW FAST?" x={960} y={200} rot={-2}/>
      <Counter f={f} keys={[[0, 0], [t, 0], [t + 26, 308]]} x={960} y={540} pre="+" label="NET NEW STORES, Q2 FY27"/>
    </Desk>
  );
};
const q06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("q06", "Two thousand");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 900, 540], [d, 1.05, 960, 540]]} chip={LETTER("8")}>
      <Counter f={f} keys={[[0, 0], [t + 24, 2751]]} x={600} y={540} label="BLINKIT STORES, 30 SEP 2026"/>
      <StoreGrid f={f} at={0} n={120}/>
      <Lab f={f} at={10} text="illustration, not to scale" x={1480} y={850} size={24}/>
    </Desk>
  );
};
const q06c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("q06", "It now expects");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 560]]} chip={LETTER("11")} chip2="Company's plan">
      <Doc f={f} name="stores" x={960} y={500} width={1560} hl={[["We now expect to cross 3,500 stores by March 2027", t + 4]]} circle={[["3,000 stores by March 2027", 2]]}/>
      <Head f={f} at={a("q06", "three thousand five") } text="3,500+ BY MARCH" x={1360} y={860}/>
    </Desk>
  );
};
const q06d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const x0 = 300, x1 = 1620, prog = ease(f, 4, d - 10, inOut);
  return (
    <Black f={f} d={d} chip="Our arithmetic: 3,500 − 2,751 ≈ 750" chip2="30 Sep 2026 to 31 Mar 2027">
      <div style={{position: "absolute", left: x0, top: 700, width: x1 - x0, height: 6, background: "rgba(255,255,255,0.5)"}}/>
      <Lab f={f} at={0} text="Sep 2026" x={x0} y={760} color="#CFC9BE"/>
      <Lab f={f} at={0} text="Mar 2027" x={x1} y={760} color="#CFC9BE"/>
      {Array.from({length: 75}).map((_, i) => {
        const ti = 4 + i * 0.55, p = spr(f, ti, 12, 200);
        if (f < ti) return null;
        return <div key={i} style={{position: "absolute", left: x0 + (i / 74) * (x1 - x0) - 9, top: 660 - (i % 5) * 26, transform: `translateY(${(1 - p) * -200}px)`}}>
          <XI name="store" size={18} sw={12} color={C.highlightPrint}/></div>;
      })}
      <div style={{position: "absolute", left: x0 + prog * (x1 - x0) - 4, top: 640, width: 8, height: 120, background: C.markerRed}}/>
      <Big f={f} at={a("q06b", "seven hundred") - 4} text="~750" x={960} y={380} size={210} color={C.white}/>
      <Lab f={f} at={a("q06b", "six months")} text="more stores in six months" x={960} y={520} color="#CFC9BE"/>
      <Lab f={f} at={2} text="one icon = 10 stores" x={1620} y={860} color="#9C968C" size={24}/>
    </Black>
  );
};
const q07a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Small towns?" at={0} mark={["towns?"]} markAt={8} size={200}/>;
};
const SMALL: [number, number][] = [[75.8, 26.9], [80.9, 26.8], [73.0, 19.9], [78.0, 27.2], [85.3, 23.3], [83.0, 25.3], [76.3, 10.0], [79.1, 21.1], [75.3, 19.9], [74.2, 16.7], [81.6, 21.2], [77.4, 23.2]];
const METRO: [number, number][] = [[77.2, 28.6], [72.9, 19.1], [77.6, 13.0], [88.4, 22.6], [80.3, 13.1], [78.5, 17.4]];
const q07b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const geo = useGeo();
  return (
    <Desk f={f} d={d} cam={[[0, 0.75, 960, 560], [22, 1.0, 960, 540, outCubic], [d, 1.04, 960, 540]]} chip={LETTER("11")} chip2="Illustration: dots are not store locations">
      <MapRoute f={f} geo={geo} credit={false} inkAt={-30}
        pins={[...METRO.map(([lon, lat], i) => ({lon, lat, at: 4 + i * 2, color: C.ink})), ...SMALL.map(([lon, lat], i) => ({lon, lat, at: a("q07", "smaller cities") + i * 1.5, color: C.markerRed}))]}/>
      <Head f={f} at={a("q07", "newer categories")} text="SMALLER CITIES NEXT" x={1500} y={880} size={52}/>
    </Desk>
  );
};
const Lane: React.FC<{f: number; at: number; y: number; label: string; dur: number}> = ({f, at, y, label, dur}) => {
  const p = ease(f, at, at + dur, inOut);
  return (
    <>
      <div style={{position: "absolute", left: 420, top: y, width: 1200, height: 8, background: "rgba(14,14,14,0.25)"}}/>
      <div style={{position: "absolute", left: 420, top: y - 4, width: 1200 * p, height: 16, background: C.markerRed}}/>
      <div style={{position: "absolute", left: 420 + 1200 * p - 60, top: y - 140}}><Disc f={f} at={at - 4} name="store" x={60} y={60} size={120}/></div>
      <Lab f={f} at={at - 4} text={label} x={260} y={y} anchor="c" size={34}/>
      <Lab f={f} at={at} text={Math.round(1000 * p).toLocaleString("en-IN") + " / day"} x={1760} y={y} size={36}/>
    </>
  );
};
const q07c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = 6, dd = Math.max(30, a("q07", "about as fast") - 6);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("11")} chip2="Company's claim · illustration">
      <Lane f={f} at={t} y={420} label="METRO" dur={dd}/>
      <Lane f={f} at={t + 2} y={720} label="SMALLER CITY" dur={dd}/>
      <Head f={f} at={a("q07", "about as fast")} text="ABOUT AS FAST" x={960} y={180}/>
      <Lab f={f} at={t} text="new store: orders a day" x={960} y={900} size={28}/>
    </Desk>
  );
};
const q07d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const g = ease(f, 4, 20, outCubic);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.06, 960, 520]]} chip={LETTER("11")} chip2="Company's claim: average order 85-90% of metro size">
      <div style={{position: "absolute", left: 620 - 210, top: 760 - 420 * g, transformOrigin: "50% 100%"}}><XI name="bag" size={420}/></div>
      <div style={{position: "absolute", left: 1300 - 184, top: 760 - 368 * g}}><XI name="bag" size={368} color={C.markerRed}/></div>
      <Lab f={f} at={6} text="METRO" x={620} y={830}/>
      <Lab f={f} at={10} text="SMALLER CITY" x={1300} y={830}/>
      <Big f={f} at={a("q07", "eighty five")} text="85–90%" x={1300} y={300} size={130} color={C.markerRed}/>
      <Head f={f} at={a("q07", "metro size")} text="SMALL TOWNS, BIG BASKETS" x={960} y={960} size={50}/>
    </Desk>
  );
};
const q08a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const dip = ease(f, a("q08", "pull margins") - 4, a("q08", "first months"), inOut);
  const pts = Array.from({length: 13}).map((_, i) => [260 + i * 115, 560 - i * 12 + (i >= 6 && i <= 8 ? dip * 90 * Math.sin(((i - 6) / 2) * Math.PI) : 0)] as [number, number]);
  const draw = ease(f, 0, 30, inOut);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.05, 960, 540]]} chip={LETTER("11")} chip2="Illustration · no figures">
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d={"M " + pts.map((p) => p.join(" ")).join(" L ")} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
      </svg>
      <Disc f={f} at={a("q08", "New stores")} name="store" x={1060} y={820} size={150}/>
      <div style={{position: "absolute", left: 1056, top: 580 + dip * 80, width: 6, height: 160 - dip * 80, background: C.markerRed, opacity: f > a("q08", "New stores") ? 1 : 0}}/>
      <Lab f={f} at={4} text="margin (illustration)" x={300} y={480} anchor="l"/>
      <Head f={f} at={0} text="THE COST" x={1500} y={220}/>
    </Desk>
  );
};
const q08b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 560]]} chip={LETTER("11")} chip2="Company's expectation">
      <Doc f={f} name="newstores" x={960} y={520} width={1560} hl={[["New stores weigh on margins", 2], ["more than offset that", a("q08", "more than make")]]}/>
    </Desk>
  );
};
const q09a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tap = (f % 24) < 4 ? 1 : 0;
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 540], [d, 1.0, 960, 540]]} chip="Illustration">
      <Disc f={f} at={0} name="phone" x={960} y={520} size={360}/>
      <div style={{position: "absolute", left: 1010, top: 600 - tap * 20, width: 90, height: 150, borderRadius: 45, background: "#C99B78", border: "5px solid #6B4E2A", transform: "rotate(-20deg)"}}/>
      <Lab f={f} at={6} text="people open the app" x={960} y={850}/>
    </Desk>
  );
};
const q09b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("q09", "computer");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Illustration">
      <Disc f={f} at={-10} name="phone" x={960} y={520} size={360}/>
      <Cursor f={f} x={1400 - 360 * ease(f, t, t + 14, outQuint)} y={560} at={t - 2} tapAt={t + 16} label="AI AGENT"/>
      <Head f={f} at={a("q09", "instead") } text="WHAT IF?" x={960} y={180}/>
    </Desk>
  );
};

export const SHOTS2: Shot[] = [
  S("q01", -0.85, PU, q01card), S("q01", "Because of", WD, q01b),
  S("q02", 0, PU, q02a), S("q02", "Quote", WL, q02b),
  S("q03", 0, WD, q03a),
  S("q04", 0, PU, q04a), S("q04", "density|-0.15", PUSH(960, 540), q04b), S("q04", "Quote", PU, q04c),
  S("q05", 0, WR, q05a),
  S("q06", 0, PU, q06a), S("q06", "Two thousand", WL, q06b), S("q06", "It now expects", PU, q06c),
  S("q06b", 0, WD, q06d),
  S("q07", 0, H0, q07a), S("q07", "Most new stores", WU, q07b), S("q07", "In smaller cities", WL, q07c), S("q07", "with average", PU, q07d),
  S("q08", 0, WR, q08a), S("q08", "It expects", PU, q08b),
  S("q09", 0, WD, q09a), S("q09", "What if", WR, q09b),
];
export const CUES2: SCue[] = [
  [W("q01", -0.85), "paper", 0.6], [W("q01", "six quarters"), "pop", 0.6], [W("q02", "Our mature"), "highlighter", 0.5], [W("q02", "five percent"), "pop", 0.6],
  [W("q03", "seventy"), "ding", 0.5], [W("q04", "density|-0.15"), "whooshDeep", 0.7], [W("q04", "As density"), "highlighter", 0.5],
  [W("q06", "Three hundred"), "ding", 0.6], [W("q06", "It now expects"), "highlighter", 0.5], [W("q06b", 0), "whoosh", 0.5],
  [W("q07", "Most new stores"), "whoosh", 0.5], [W("q07", "eighty five"), "stamp", 0.5], [W("q08", 0), "paper", 0.5],
  [W("q09", "What if"), "whoosh", 0.6], [W("q09", "instead"), "click", 0.7],
];
