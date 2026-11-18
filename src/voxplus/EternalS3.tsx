// eternalq2 chapter 3 "Can a computer shop around it?" (a01-a10; a08 was cut in review).
import React from "react";
import {random} from "remotion";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, step, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./EternalCue";
import {Desk, Black, Chain, Cursor, Disc, Doc, Head, Lab, LETTER, RiskMeter, Squares, XI} from "./EternalPieces";

const a01card: React.FC<SP> = () => {
  const f = useTicks();
  return <ChapterQ f={f} d={90} n={3} q="Can a computer shop around it?" icon="phone"/>;
};
/** numbered paper tabs 1 2 3; `lift` = index that rises */
const Tabs: React.FC<{f: number; lift: number; at: number}> = ({f, lift, at}) => (
  <>
    {[0, 1, 2].map((i) => {
      const up = i === lift ? ease(f, at, at + 12, outQuint) : 0, done = i < lift;
      return (
        <div key={i} style={{position: "absolute", left: 420 + i * 400, top: 380 - up * 120, width: 280, height: 340, background: i === lift ? "#FFFCF2" : "#EFE7D6",
          boxShadow: `0 ${8 + up * 20}px ${18 + up * 30}px rgba(30,20,10,${0.2 + up * 0.15})`, transform: `rotate(${(i - 1) * 3 - up * 3}deg) scale(${1 + 0.1 * up})`,
          opacity: done ? 0.45 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 220, color: i === lift ? C.markerRed : C.ink}}>
          {i + 1}
        </div>
      );
    })}
  </>
);
const a01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("a01", "cut out");
  const cut = ease(f, t - 4, t + 8, inOut);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={LETTER("6")} chip2="The view the letter answers">
      <Disc f={f} at={2} name="store" x={1400} y={520} size={240}/>
      <Lab f={f} at={6} text="platform" x={1400} y={700}/>
      <Cursor f={f} x={420} y={420} at={0} label="AI AGENT"/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 560 520 L 1270 520" stroke={C.ink} strokeWidth={8} strokeDasharray="22 14"/>
        {cut > 0 ? <path d={`M ${915 - 40 * cut} ${440} L ${915 + 40 * cut} 600 M ${915 + 40 * cut} 440 L ${915 - 40 * cut} 600`} stroke={C.markerRed} strokeWidth={14} strokeLinecap="round"/> : null}
      </svg>
      <Head f={f} at={a("a01", "AI agents")} text="THE OLD STORY" x={960} y={220}/>
      <Lab f={f} at={t} text="platforms cut out?" x={915} y={680} color={C.markerRed}/>
    </Desk>
  );
};
const a01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 860, 470]]} chip={LETTER("6")}>
      <Doc f={f} name="narrative" x={960} y={520} width={1560} hl={[["agents will become the default commerce interface", 0], ["simplistic", a("a01", "simplistic")]]}
        circle={[["simplistic", a("a01", "simplistic") + 6]]}/>
    </Desk>
  );
};
const a02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.04, 760, 540]]} chip={LETTER("6-7")}>
      <Tabs f={f} lift={0} at={a("a02", "One")}/>
      <Head f={f} at={a("a02", "chore")} text="A CHORE?" x={960} y={860}/>
    </Desk>
  );
};
const a02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("6")} chip2="Company's consumer surveys">
      <Squares f={f} at={0} fill={65} x={760} y={540} cell={76} per={0.3}/>
      <StickerLabel f={f} text="65%+" x={1520} y={430} size={130} rot={-3} enter={{at: a("a02", "sixty five"), mode: "drop"}}/>
      <Lab f={f} at={a("a02", "exploratory")} text="of Zomato app opens" x={1520} y={590} color="#CFC9BE"/>
      <Lab f={f} at={a("a02", "exploratory") + 4} text="are exploring" x={1520} y={640} color={C.highlightPrint}/>
    </Black>
  );
};
const a03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("a03", "twelve");
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("6")} chip2="Company's survey · illustration">
      {Array.from({length: 12}).map((_, i) => {
        const at = 2 + i * Math.max(1, (t - 2) / 12), p = spr(step(f, 2), at, 12, 180);
        if (f < at) return null;
        const ang = -50 + i * 9;
        return <div key={i} style={{position: "absolute", left: 960 - 90, top: 620 - 260, width: 180, height: 260, transformOrigin: "50% 120%",
          transform: `rotate(${ang * p}deg) scale(${0.6 + 0.4 * p})`, background: "#FFFCF2", boxShadow: "0 6px 14px rgba(30,20,10,0.25)", display: "flex", justifyContent: "center", paddingTop: 20}}>
          <XI name="menu" size={140}/></div>;
      })}
      <StickerLabel f={f} text="12 MENUS" x={960} y={860} size={80} rot={-2} dark enter={{at: t, mode: "pop"}}/>
    </Desk>
  );
};
const a03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const pal = ["#E5A15C", "#C8553D", "#F2D06B", "#8DB255", "#D98E73", "#B5651D", "#EBC28E"];
  return (
    <Desk f={f} d={d} cam={[[0, 0.92, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("6")} chip2="Company's survey · illustration">
      {Array.from({length: 104}).map((_, i) => {
        const col = i % 13, row = Math.floor(i / 13), at = i * 0.35, p = spr(f, at, 12, 220);
        return <div key={i} style={{position: "absolute", left: 230 + col * 112, top: 120 + row * 100, width: 96, height: 84, background: pal[i % 7], borderRadius: 14,
          transform: `scale(${p}) rotate(${(random("ft" + i) - 0.5) * 8}deg)`, boxShadow: "0 3px 6px rgba(0,0,0,0.2)"}}>
          <div style={{position: "absolute", left: 22, top: 18, width: 52, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.5)"}}/></div>;
      })}
      <StickerLabel f={f} text="100+ FOOD IMAGES" x={960} y={540} size={84} rot={-3} dark enter={{at: a("a03", "a hundred"), mode: "drop"}}/>
    </Desk>
  );
};
const a03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 500]]} chip={LETTER("6")}>
      <Doc f={f} name="exploratory" x={960} y={480} width={1560} hl={[["12 menus and over 100 food images", 2]]}/>
      <Cursor f={f} x={1500} y={760} at={4} tapAt={14} label="AI AGENT"/>
      <Head f={f} at={a("a03", "hard for an agent")} text="HARD FOR AGENTS" x={760} y={880}/>
    </Desk>
  );
};
const a04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("6")}>
      <Disc f={f} at={2} name="cart" x={820} y={520} size={260}/>
      <Disc f={f} at={a("a04", "repeat")} name="repeat" x={1120} y={520} size={200} bg={C.highlight}/>
      <Head f={f} at={a("a04", "one chore")} text="ONE CHORE" x={960} y={820}/>
    </Desk>
  );
};
const a04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 560]]} chip={LETTER("6")} chip2="Company's claim · unit not given">
      <Doc f={f} name="reorder" x={960} y={500} width={1560} hl={[["repeat orders or restocking is indeed a type of shopping that is tedious", 0], ["reordered carts are in low single digits on Zomato, as well as on Blinkit", a("a04", "reordered")]]}/>
      <StickerLabel f={f} text="UNIT NOT GIVEN" x={1500} y={870} size={44} rot={3} enter={{at: a("a04", "single digits"), mode: "pop"}}/>
    </Desk>
  );
};
const a05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.04, 1160, 540]]} chip={LETTER("6")}>
      <Tabs f={f} lift={1} at={2}/>
      <Head f={f} at={a("a05", "exists without")} text="EXISTS WITHOUT IT?" x={960} y={860}/>
    </Desk>
  );
};
const a05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("a05", "exists without District");
  const p = ease(f, t, t + 30, inOut);
  const cx = 300 + 1220 * p, cy = 640 - Math.sin(p * Math.PI) * 420;
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip={LETTER("6")} chip2="Company's view · illustration">
      <Disc f={f} at={2} name="table" x={1520} y={420} size={220}/>
      <Disc f={f} at={a("a05", "concert") - 6} name="ticket" x={1520} y={720} size={220}/>
      <StickerLabel f={f} text="DISTRICT" x={960} y={640} size={80} rot={-2} dark enter={{at: 0, mode: "pop"}}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 340 640 Q 930 -120 1420 420" fill="none" stroke={C.markerRed} strokeWidth={8} strokeDasharray="20 14" pathLength={1} strokeDashoffset={0}
          style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}/>
      </svg>
      <Cursor f={f} x={cx} y={cy} at={0} label="AI AGENT"/>
      <Lab f={f} at={t + 20} text="goes direct" x={960} y={260} color={C.markerRed}/>
    </Desk>
  );
};
const a05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 500]]} chip={LETTER("6")}>
      <Doc f={f} name="district" x={960} y={500} width={1560} hl={[["A restaurant table or a non exclusive", 0], ["concert ticket on District exists independently of our platform", a("a05", "exclusively") - 8]]}/>
      <Head f={f} at={a("a05", "exclusively")} text="NON EXCLUSIVE" x={1300} y={820}/>
    </Desk>
  );
};
const a06a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("6-7")}>
      <Disc f={f} at={0} name="bag" x={720} y={520} size={300}/>
      <Disc f={f} at={a("a06", "groceries")} name="watch" x={1220} y={520} size={240} bg={C.highlight}/>
      <StickerLabel f={f} text="10 MIN" x={1220} y={720} size={64} rot={3} dark enter={{at: a("a06", "in ten"), mode: "pop"}}/>
      <Head f={f} at={a("a06", "does not")} text="WITHIN MINUTES" x={960} y={200}/>
    </Desk>
  );
};
const CHAIN = [{icon: "pot" as const, label: "RESTAURANT KITCHEN"}, {icon: "scooter" as const, label: "RIDER"}, {icon: "store" as const, label: "DARK STORE"}, {icon: "shelf" as const, label: "INVENTORY"}];
const a06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tries = a("a06", "each step");
  const bump = tries > 0 ? Math.exp(-Math.max(0, f - tries - 10) / 6) * Math.sin(Math.max(0, f - tries - 10) * 0.8) * 30 : 0;
  const cx = 300 + 500 * ease(f, tries, tries + 10, outCubic);
  return (
    <Desk f={f} d={d} cam={[[0, 0.95, 960, 540], [d, 1.03, 960, 540]]} chip={LETTER("6-7")} chip2="Company's view">
      <Chain f={f} at={a("a06", "restaurant kitchens") - 4} items={CHAIN} per={Math.max(6, (a("a06", "inventory") - a("a06", "restaurant kitchens")) / 3)} taut={ease(f, tries, tries + 8)}/>
      <Cursor f={f} x={cx + bump} y={330} at={tries - 4} label="AI AGENT"/>
      <Head f={f} at={tries + 12} text="NO PLATFORM, NO MEAL" x={960} y={880} size={56}/>
    </Desk>
  );
};
const a07a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const m = a("a07", "A missing"), sp = a("a07", "A spilled");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [m, 1.0, 960, 560], [d, 1.05, 1300, 540, inOut]]} chip={LETTER("7")}>
      <Tabs f={f} lift={2} at={2}/>
      <Head f={f} at={a("a07", "fix it")} text="WHO FIXES IT?" x={960} y={180}/>
      {f >= m ? (
        <div style={{position: "absolute", left: 1650, top: 420}}>
          <Disc f={f} at={m} name="bag" x={0} y={0} size={220}/>
          <div style={{position: "absolute", left: 130, top: -60, width: 90, height: 90, border: `6px dashed ${C.markerRed}`, borderRadius: 12, opacity: ease(f, m + 4, m + 10)}}/>
          <div style={{position: "absolute", left: -120, top: 200, transform: `rotate(${-40 * ease(f, sp, sp + 10, outCubic)}deg)`, opacity: f >= sp ? 1 : 0}}><XI name="bowl" size={200}/></div>
        </div>
      ) : null}
    </Desk>
  );
};
const a07b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 540]]} chip={LETTER("7")}>
      <Doc f={f} name="outcome" x={960} y={520} width={1560} hl={[["An agent can place an order, but it cannot own the outcome", a("a07", "An agent can")]]}/>
    </Desk>
  );
};
const a09a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={LETTER("6")} chip2="Company's view">
      <Doc f={f} name="lowrisk" x={960} y={500} width={1560} hl={[["Blinkit and Zomato sit in the low-risk zone against the threat of agentic", a("a09", "Blinkit and Zomato")]]}/>
      <Head f={f} at={0} text="THE VERDICT" x={420} y={160} rot={-3}/>
    </Desk>
  );
};
const a09b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const ds = a("a09", "medium");
  const dx = 1150 + 360 * ease(f, ds, ds + 16, inOut);
  return (
    <Black f={f} d={d} chip={LETTER("6")} chip2="Company's view, not ours">
      <div style={{position: "absolute", left: 120, top: 92, fontFamily: F.serif, fontSize: 80, color: C.white}}>Risk from shopping agents</div>
      <RiskMeter f={f} at={0} y={600}/>
      <StickerLabel f={f} text="BLINKIT" x={350} y={520} size={46} rot={-3} enter={{at: 4, mode: "drop"}}/>
      <StickerLabel f={f} text="ZOMATO" x={610} y={500} size={46} rot={3} enter={{at: 8, mode: "drop"}}/>
      <div style={{position: "absolute", left: 0, top: 0, transform: `translateX(${dx - 960}px)`}}>
        <StickerLabel f={f} text="DISTRICT" x={960} y={820} size={54} rot={-2} dark enter={{at: a("a09", "District") - 4, mode: "drop"}}/>
      </div>
      <Lab f={f} at={ds + 8} text="medium to high" x={1450} y={940} color="#CFC9BE"/>
    </Black>
  );
};
const a10a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const draw = ease(f, 4, 30, inOut);
  return (
    <Desk f={f} d={d} cam={[[0, 0.9, 960, 560], [d, 0.97, 960, 540]]} chip={LETTER("7-8")} chip2="Company's view">
      <Chain f={f} at={-40} items={CHAIN} taut={1}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 160 800 L 160 260 L 260 260 L 260 200 L 360 200 L 360 260 L 1560 260 L 1560 200 L 1660 200 L 1660 260 L 1760 260 L 1760 800 Z" fill="none" stroke={C.ink}
          strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
        <path d="M 110 860 Q 960 960 1810 860" fill="none" stroke={C.mapWater} strokeWidth={36} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 20, 40)}/>
      </svg>
      <Head f={f} at={a("a10", "moat")} text="WHERE IS THE MOAT?" x={960} y={120} size={56}/>
    </Desk>
  );
};
const a10b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 1000, 520]]} chip={LETTER("7")} chip2="Company's view">
      <Doc f={f} name="moats" x={960} y={500} width={1500} hl={[["Agents will weaken content moats and strengthen supply chain moats", a("a10", "Agents will")]]}/>
      <Head f={f} at={a("a10", "supply chain")} text="SUPPLY CHAIN MOAT" x={1300} y={860}/>
    </Desk>
  );
};

export const SHOTS3: Shot[] = [
  S("a01", -0.85, PU, a01card), S("a01", "AI agents", WL, a01b), S("a01", "The letter calls", PU, a01c),
  S("a02", 0, WD, a02a), S("a02", "Its surveys", WU, a02b),
  S("a03", 0, PU, a03a), S("a03", "over a hundred", WR, a03b), S("a03", "That kind", PU, a03c),
  S("a04", 0, WL, a04a), S("a04", "Yet reordered", PU, a04b),
  S("a05", 0, WD, a05a), S("a05", "A restaurant table", WR, a05b), S("a05", "So does", PU, a05c),
  S("a06", 0, WL, a06a), S("a06", "It takes", WR, a06b),
  S("a07", 0, WD, a07a), S("a07", "Quote", PU, a07b),
  S("a09", 0, WU, a09a), S("a09", "District, it says", WD, a09b),
  S("a10", 0, PUSH(960, 520), a10a), S("a10", "Quote", PU, a10b),
];
export const CUES3: SCue[] = [
  [W("a01", -0.85), "paper", 0.6], [W("a01", "cut out"), "stamp", 0.4], [W("a01", "simplistic"), "circle", 0.6], [W("a02", "One"), "paper", 0.5],
  [W("a02", "sixty five"), "stamp", 0.5], [W("a03", "twelve"), "pop", 0.6], [W("a03", "a hundred"), "stamp", 0.5], [W("a04", "repeat"), "pop", 0.5],
  [W("a04", "reordered"), "highlighter", 0.5], [W("a05", "Two"), "paper", 0.5], [W("a05", "exists without District"), "whoosh", 0.5],
  [W("a06", "in ten"), "pop", 0.6], [W("a06", "each step"), "stamp", 0.4], [W("a07", "Three"), "paper", 0.5], [W("a07", "An agent can"), "highlighter", 0.5],
  [W("a09", "District, it says"), "whoosh", 0.5], [W("a10", "supply chain"), "highlighter", 0.5],
];
