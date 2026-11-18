// A02 b15-b31: gate four (IEX), gate five (CDSL), the hinges, the checklist, the verdict, end card. Plan: production/A02/video/SCENE_PLAN.md (+ checker fixes).
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp} from "./A01V4Parts";
import {MWords as Words} from "./AsianPaintsMore";
import {C, F, ease, outQuint} from "./tokens";
import {H0, MZ, PU, PUSH, S, W, WD, WL, WR} from "./A02Cue";
import {Bars, Big, Black, Desk, Disc, Head, Lab, RowsCard, Rs} from "./AsianPaintsPieces";
import {QuoteCard, SansBig} from "./AsianPaintsKit";
import {StickyNote} from "./A01V4Parts";
import {mk, Buses, Checklist, CastleRow, Clients, Coconut, Crowd, EndCard, HingeUp, Lockers, Pool, REG, CUST, ShareLocker, Shops} from "./A02Props";
import {ARTICLE, ARITH, GateCard, MADE, OURREAD} from "./A02S1";
import {PriceTag} from "./AsianPaintsKit";

const NOW = -999;
const ALL = [NOW, NOW, NOW, NOW, NOW];
// ---- b15 gate four: IEX
const b15card = mk((f, a, d) => <GateCard f={f} d={d} label="GATE 4" q="Can a crowd be a moat?" icon="crowd"/>);
const b15a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · IEX, 26 Jul 2026"}>
    <CastleRow f={f} at={-30} names={NOW} lit={[NOW, NOW, NOW, a("b15", 0), null]}/>
  </Desk>));
const b15b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · IEX, 26 Jul 2026"}>
    <Disc f={f} at={2} name="bolt" x={960} y={400} size={290}/>
    <Head f={f} at={a("b15", "auctions") - 3} text="POWER AUCTIONS" x={960} y={780} size={90}/>
  </Desk>));
const b15c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · IEX, 26 Jul 2026"}>
    <Disc f={f} at={2} name="bolt" x={560} y={400} size={250}/>
    <Disc f={f} at={a("b15", "Two rivals") + 2} name="shop" x={960} y={400} size={250} dim={0.5}/>
    <Disc f={f} at={a("b15", "Two rivals") + 8} name="shop" x={1360} y={400} size={250} dim={0.5}/>
    <Stamp f={f} at={a("b15", "same licence") - 3} text="SAME LICENCE" x={960} y={760} size={96} rot={-4}/>
  </Desk>));
// ---- b16 market share
const b16a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"IEX · analyst meet · 24 Jul 2026 · p.7"}>
    <Big f={f} at={a("b16", "eighty") - 4} text="80–85%" x={960} y={440} size={330} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("b16", "eighty") + 8} text="MARKET SHARE" x={960} y={690} size={60}/>
  </Desk>));
const b16b = mk((f, a, d) => <Words f={f} d={d} text="Why can't rivals win?" at={1} mark={["win?"]} markAt={a("b16", "So why") + 6} size={140}/>);
// ---- b17 the crowd (made-up example, then the article's facts)
const b17a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}><Crowd f={f} at={0} flowAt={a("b17", "One is packed") - 6}/></Desk>));
const b17b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}><Crowd f={f} at={-60} flowAt={-60} arrowsAt={a("b17", "Sellers go") + 2}/></Desk>));
const b17c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · The Market That Became Too Successful"}><Crowd f={f} at={-60} flowAt={-60} boltAt={a("b17", "missed") - 4}/></Desk>));
const b17d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · The Market That Became Too Successful"}><Crowd f={f} at={-60} flowAt={-60} screenAt={a("b17", "copy the technology") - 4}/></Desk>));
const b17e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · The Market That Became Too Successful"}><Crowd f={f} at={-60} flowAt={-60} screenAt={-60} stampAt={a("b17", "overnight") - 4}/></Desk>));
// ---- b18 seventeen years
const b18a = mk((f, a, d) => <Words f={f} d={d} text="How long would a rival need?" at={1} mark={["rival"]} markAt={a("b18", "rival") + 2} size={130}/>);
const b18b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"IEX · FY26 earnings call · p.12"}>
    <Disc f={f} at={2} name="person" x={960} y={380} size={250}/>
    <Head f={f} at={a("b18", "replicate") - 3} text="COULD RIVALS COPY IT?" x={960} y={760} size={78}/>
  </Desk>));
const b18c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"IEX · FY26 earnings call · p.12 · SN Goel"}>
    <QuoteCard f={f} head="Earnings call · p.12 · SN Goel" lines={["“They had 17 years to replicate this.”"]} hl={[["17 years", a("b18", "seventeen") - 4]]} w={1500} size={84} y={500}/>
  </Desk>));
const b18d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"IEX · FY26 earnings call · p.12"}>
    <Rs f={f} at={2} v={17} x={960} y={470} size={400} pre="" suf="" dur={30}/>
    <Lab f={f} at={10} text="YEARS" x={960} y={730} size={90}/>
  </Desk>));
// ---- b19 gate five: CDSL
const b19card = mk((f, a, d) => <GateCard f={f} d={d} label="GATE 5" q="Can a licence be a moat?" icon="stamp"/>);
const b19a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Wide-moat stocks, 9 Aug 2026"}>
    <CastleRow f={f} at={-30} names={NOW} lit={[NOW, NOW, NOW, NOW, a("b19", 0)]}/>
  </Desk>));
const b19b = mk((f, a, d) => <Words f={f} d={d} text="Who sets the price?" at={1} mark={["price?"]} markAt={a("b19", "who sets") + 6} size={150}/>);
const b19c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Wide-moat stocks, 9 Aug 2026"}><Lockers f={f} at={0} tagsAt={a("b19", "CDSL|-0.2")}/></Desk>));
const b19d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Our plain definition"}>
    <ShareLocker f={f} at={0}/>
    <Head f={f} at={a("b19", "locker") - 3} text="DEMAT = SHARE LOCKER" x={960} y={880} size={72}/>
  </Desk>));
// ---- b20 the licence
const b20a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Wide-moat stocks, 9 Aug 2026"}>
    <Disc f={f} at={2} name="stamp" x={960} y={400} size={280}/>
    <Head f={f} at={a("b20", "licence") - 3} text="NO LICENCES HANDED OUT" x={960} y={780} size={74}/>
  </Desk>));
const b20b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={MADE}><Buses f={f} at={0} thirdAt={a("b20", "third") - 4}/></Desk>));
const b20c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Wide-moat stocks, 9 Aug 2026"}>
    <Disc f={f} at={2} name="crowd" x={960} y={400} size={280}/>
    <Head f={f} at={a("b20", "textbook") - 3} text="CROWD EFFECT TOO" x={960} y={780} size={90}/>
  </Desk>));
// ---- b21 the fee cut
const b21a = mk((f, a, d) => <Words f={f} d={d} text="Now the strange part." at={1} mark={["strange"]} markAt={a("b21", "strange") + 2} size={140}/>);
const b21b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · 9 Aug 2026"}>
    <Disc f={f} at={2} name="stamp" x={960} y={400} size={280}/>
    <Head f={f} at={a("b21", "SEBI") - 3} text="SEBI CUT A FEE" x={960} y={780} size={90}/>
  </Desk>));
const b21c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · 9 Aug 2026 · KYC fees"}>
    <RowsCard f={f} head="KYC fees" rows={[{l: "CREATE A RECORD", v: "₹20 → ₹5", hl: a("b21", "twenty rupees") - 3, red: true}, {l: "FETCH ONE", v: "₹35 → ₹28", hl: a("b21", "fetching") - 3, red: true}]} w={1400} y={500}/>
  </Desk>));
const b21d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Our plain definition"}>
    <Disc f={f} at={2} name="doc" x={960} y={400} size={280}/>
    <Head f={f} at={a("b21", "identity") - 3} text="KYC = ID CHECK" x={960} y={780} size={96}/>
  </Desk>));
// ---- b22 revenue up, profit down
const b22a = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARTICLE + " · 9 Aug 2026 · CDSL's KYC subsidiary"} chip2="Compared with a year earlier">
    <Bars f={f} title="KYC subsidiary" source="Our article · versus a year earlier" max={30} min={-10} box={{x: 460, y: 300, w: 1000, h: 520}}
      bars={[{label: "REVENUE", v: 22, txt: "+22%", at: a("b22", "twenty-two") - 2}, {label: "PROFIT BEFORE TAX", v: -4, txt: "−4%", at: a("b22", "four percent") - 2, key: true}]}/>
  </Black>));
const b22b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · 9 Aug 2026"}>
    <Disc f={f} at={2} name="lock" x={960} y={400} size={280}/>
    <Head f={f} at={a("b22", "reason") - 3} text="NOT THE COMPANY'S CALL" x={960} y={780} size={76}/>
  </Desk>));
const b22c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Disc f={f} at={-20} name="lock" x={960} y={400} size={280}/>
    <Stamp f={f} at={a("b22", "keeps rivals") - 4} text="KEEPS RIVALS OUT" x={960} y={730} size={80} rot={-4}/>
    <Stamp f={f} at={a("b22", "regulator") - 4} text="NOT THE REGULATOR" x={960} y={870} size={64} rot={3} color={REG}/>
  </Desk>));
// ---- b23 the hinges
const b23card = mk((f, a, d) => <GateCard f={f} d={d} label="THE HINGES" q="Who holds the hinge?" icon="lock"/>);
const b23a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · 9 Aug 2026"} chip2={OURREAD}>
    <HingeUp f={f} at={0} gate="GATE 5" owner="r" ownerAt={a("b23", "regulator") - 2} table={["KYC FEE TABLE", "WRITTEN BY SEBI"]} penAt={a("b23", "SEBI writes|-0.1") - 2}/>
  </Desk>));
const b23b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <HingeUp f={f} at={0} gate="GATE 4" owner="r" ownerAt={4} label="THE DRAFT RULES"/>
  </Desk>));
// ---- b24 the draft rules
const b24a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"CERC draft rules · Apr 2026 · our IEX article"}>
    <Disc f={f} at={2} name="doc" x={960} y={400} size={280}/>
    <Head f={f} at={a("b24", "draft rules") - 3} text="DRAFT RULES" x={960} y={780} size={100}/>
  </Desk>));
const b24b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"CERC draft rules · our IEX article"}><Pool f={f} at={0} flowAt={a("b24", "pool") - 4}/></Desk>));
const b24c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · IEX"}>
    <Pool f={f} at={-40} flowAt={-40}/>
    <Head f={f} at={a("b24", "customer relationships") - 3} text="IEX KEEPS ITS CUSTOMERS" x={960} y={170} size={62}/>
  </Desk>));
const b24d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · The Market That Became Too Successful"}>
    <Pool f={f} at={-40} flowAt={-40} crowdAt={a("b24", "common property") - 20}/>
    <Head f={f} at={a("b24", "crowd itself") - 3} text="THE CROWD IS SHARED" x={960} y={170} size={66}/>
  </Desk>));
const b24e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"IEX annual report FY2025-26 · our reading of it"}>
    <Disc f={f} at={2} name="doc" x={960} y={400} size={260}/>
    <Head f={f} at={a("b24", "minimal") - 3} text="IMPACT: MINIMAL" x={960} y={760} size={96}/>
  </Desk>));
const b24f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · IEX, updated 5 Oct 2026"}>
    <Stamp f={f} at={a("b24", "not so sure") - 3} text="OUR ARTICLE: NOT SO SURE" x={960} y={430} size={78} rot={-3}/>
    <Stamp f={f} at={a("b24", "not final") - 4} text="NOT FINAL · 5 OCT 2026" x={960} y={700} size={84} rot={3} color={REG}/>
  </Desk>));
// ---- b25-b27 the other three hinges
const CL = (a: (k: string, x?: number | string) => number, n: number) => [
  {t: "GATE 5 · SEBI WRITES THE FEE", at: -30, tick: -20, reg: true}, {t: "GATE 4 · THE DRAFT RULES", at: -30, tick: -20, reg: true},
  {t: "GATE 1 · COCONUT GETS DEARER", at: -30, tick: n >= 1 ? a("b25", "Falling costs") : undefined},
  {t: "GATE 2 · DO NEW STORES FILL?", at: -30, tick: n >= 2 ? a("b26", "If the new") : undefined},
  {t: "GATE 3 · THE NEXT CONTRACT", at: -30, tick: undefined}];
const b25a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Checklist f={f} at={0} y={540} items={[{t: "GATE 5 · THE FEE TABLE", at: 4, tick: 12, reg: true}, {t: "GATE 4 · THE DRAFT RULES", at: 8, tick: 18, reg: true}, {t: "GATE 1 · COCONUT?", at: a("b25", "Gate one") - 4}]}/>
  </Desk>));
const b25b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico, 5 Aug 2026"}>
    <Coconut f={f} at={2} x={620} y={470} s={1.5}/>
    <PriceTag f={f} at={a("b25", "dearer") - 14} x={1250} y={150} text="COPRA ▲" size={92} q={a("b25", "Can Marico") + 2}/>
    <Head f={f} at={a("b25", "take price back") - 3} text="TAKE PRICE BACK?" x={960} y={830} size={80}/>
  </Desk>));
const b25c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Marico: one quarter's disclosures"}>
    <Disc f={f} at={2} name="calendar" x={960} y={400} size={280}/>
    <Head f={f} at={a("b25", "one quarter") - 3} text="ONE QUARTER" x={960} y={780} size={100}/>
  </Desk>));
const b26a = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARTICLE + " · DMart Q2, 11 Oct 2026 · stores added"}>
    <Bars f={f} title="Stores added" source="Each year to March · our DMart article" max={100} min={0} box={{x: 380, y: 300, w: 1160, h: 500}} bw={150}
      bars={[{label: "FY22", v: 50, txt: "50", at: 10}, {label: "FY23", v: 40, txt: "40", at: 16}, {label: "FY24", v: 41, txt: "41", at: 22}, {label: "FY25", v: 50, txt: "50", at: 28},
        {label: "FY26", v: 85, txt: "85", at: a("b26", "eighty-five") - 2, key: true}]}/>
  </Black>));
const b26b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · DMart Q2, 11 Oct 2026"}>
    <Disc f={f} at={2} name="shop" x={960} y={400} size={260}/>
    <Head f={f} at={a("b26", "square foot") - 3} text="SALES PER SQ FT: DIPPED" x={960} y={760} size={70}/>
  </Desk>));
const b26c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD + " · the article's condition"}>
    <Shops f={f} at={0} ghostFrom={4} ifAt={a("b26", "If the new") - 2}/>
  </Desk>));
const b27a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Wide-moat stocks, 9 Aug 2026"}>
    <Clients f={f} at={0} dotAt={a("b27", "not the ones") - 4}/>
  </Desk>));
const b27b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · TCS Q2, 9 Oct 2026 · bear case"}>
    <Disc f={f} at={2} name="gear" x={960} y={400} size={260}/>
    <Head f={f} at={a("b27", "AI may") - 3} text="AI MAY SHRINK OLD WORK" x={960} y={760} size={74}/>
  </Desk>));
// ---- b28 the verdict
const b28card = mk((f, a, d) => <GateCard f={f} d={d} label="THE VERDICT" q="Are all five holding?" icon="castle"/>);
const b28a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · Why Moat?"}>
    <Disc f={f} at={2} name="castle" x={960} y={400} size={260}/>
    <Head f={f} at={a("b28", "rivals try") - 3} text="RIVALS TRY AND FAIL" x={960} y={760} size={84}/>
  </Desk>));
const b28b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"Our articles · 26 Jul to 11 Oct 2026"}><CastleRow f={f} at={-20} names={NOW} lit={[a("b28", "In our articles"), a("b28", "In our articles") + 4, a("b28", "In our articles") + 8, a("b28", "In our articles") + 12, a("b28", "In our articles") + 16]}/></Desk>));
const b28c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARTICLE + " · IEX"}><CastleRow f={f} at={-40} names={NOW} lit={ALL} marks={[{g: 3, kind: "stamp", at: a("b28", "Only gate four") + 6, text: "RIVALS TRIED"}]}/></Desk>));
const b28d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD + " · one quarter of evidence"}><CastleRow f={f} at={-40} names={NOW} lit={ALL} marks={[{g: 0, kind: "crack", at: a("b28", "Gate one rests") + 2}]}/></Desk>));
const b28e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD + " · CDSL, 9 Aug 2026"}><CastleRow f={f} at={-40} names={NOW} lit={ALL} marks={[{g: 0, kind: "crack", at: -40}, {g: 4, kind: "pen", at: a("b28", "profit that stays") - 4}]}/></Desk>));
// ---- b29 two questions
const b29a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}><CastleRow f={f} at={-20} names={NOW} lit={ALL} hinges={{at: a("b29", "first three"), kinds: ["c", "c", "c", "r", "r"], legend: a("b29", "last two") - 4}}/></Desk>));
const b29b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Head f={f} at={a("b29", "Where is the gate") - 3} text="WHERE IS THE GATE?" x={960} y={400} size={96}/>
    <Head f={f} at={a("b29", "who holds") - 3} text="WHO HOLDS THE HINGE?" x={960} y={640} size={96} rot={2}/>
  </Desk>));
// ---- b30, b31
const b30a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={"More on Moat & Margin"}>
    {["PARACHUTE", "DMART", "TCS", "IEX"].map((n, i) => (
      <Head key={n} f={f} at={a("b30", ["Parachute", "DMart", "TCS", "IEX"][i]) - 3} text={n + " · OWN VIDEO LATER"} x={960} y={250 + i * 140} size={66} rot={i % 2 ? 1.5 : -1.5}/>))}
    <Disc f={f} at={a("b30", "Four") + 2} name="locker" x={1640} y={820} size={120}/>
  </Desk>));
const b31a = mk((f, a, d) => <EndCard f={f} d={d}/>);

export const SHOTS2: Shot[] = [
  S("b15", -0.85, PU, b15card), S("b15", 0.4, MZ, b15a), S("b15", "The Indian Energy", WR, b15b), S("b15", "Two rivals", PU, b15c),
  S("b16", 0, WL, b16a), S("b16", "So why can't", H0, b16b),
  S("b17", 0, WD, b17a), S("b17", "Sellers go", PU, b17b), S("b17", "A missed", WL, b17c), S("b17", "A rival can copy", PU, b17d), S("b17", "It cannot copy", H0, b17e),
  S("b18", 0, H0, b18a), S("b18", "An analyst", PU, b18b), S("b18", "S N Goel", WR, b18c), S("b18", "They had", MZ, b18d),
  S("b19", -0.85, PU, b19card), S("b19", 0.4, MZ, b19a), S("b19", "But watch", H0, b19b), S("b19", "It belongs", WR, b19c), S("b19", "A demat account", PU, b19d),
  S("b20", 0, WL, b20a), S("b20", "Made-up", WD, b20b), S("b20", "Our article calls", PU, b20c),
  S("b21", 0, H0, b21a), S("b21", "Our article of", PU, b21b), S("b21", "The fee for creating", WR, b21c), S("b21", "KYC is just", PU, b21d),
  S("b22", 0, WL, b22a), S("b22", "Our article's reason", PU, b22b), S("b22", "Our reading", WR, b22c),
  S("b23", -0.85, PU, b23card), S("b23", 0.4, MZ, b23a), S("b23", "The other is", WL, b23b),
  S("b24", 0, WD, b24a), S("b24", "They would pool", PU, b24b), S("b24", "IEX would keep", WR, b24c), S("b24", "But our article", PU, b24d), S("b24", "IEX's twenty", WL, b24e), S("b24", "Our article is not", PU, b24f),
  S("b25", 0, WR, b25a), S("b25", "Gate one's hinge", PU, b25b), S("b25", "Falling costs", WL, b25c),
  S("b26", 0, WD, b26a), S("b26", "Sales for each", PU, b26b), S("b26", "If the new", WR, b26c),
  S("b27", 0, PU, b27a), S("b27", "And our TCS", WL, b27b),
  S("b28", -0.85, PU, b28card), S("b28", 0.4, MZ, b28a), S("b28", "In our articles", WR, b28b), S("b28", "Only gate four", PU, b28c), S("b28", "Gate one rests", WL, b28d), S("b28", "And a gate", PU, b28e),
  S("b29", 0, WD, b29a), S("b29", "So when anyone", PU, b29b),
  S("b30", 0, WR, b30a), S("b31", 0, PU, b31a),
];
export const CUES2: SCue[] = [
  [W("b15", -0.85), "paper", 0.6], [W("b15", 0.4), "ding", 0.4], [W("b15", "Two rivals"), "stamp", 0.5], [W("b16", 0), "whoosh", 0.4],
  [W("b17", 0), "whoosh", 0.4], [W("b17", "A missed"), "whoosh", 0.4], [W("b17", "It cannot copy"), "stamp", 0.6],
  [W("b18", "S N Goel"), "paper", 0.4], [W("b18", "They had"), "ding", 0.5], [W("b19", -0.85), "paper", 0.6], [W("b19", 0.4), "ding", 0.4], [W("b19", "It belongs"), "whoosh", 0.4],
  [W("b20", "Made-up"), "whoosh", 0.4], [W("b21", "The fee for creating"), "highlighter", 0.4], [W("b22", 0), "whoosh", 0.4], [W("b22", "Our reading"), "stamp", 0.6],
  [W("b23", -0.85), "paper", 0.6], [W("b23", 0.4), "pop", 0.4], [W("b24", "They would pool"), "whoosh", 0.4], [W("b24", "Our article is not"), "stamp", 0.6],
  [W("b25", 0), "paper", 0.4], [W("b26", 0), "whoosh", 0.4], [W("b28", -0.85), "paper", 0.6], [W("b28", "Only gate four"), "stamp", 0.6], [W("b28", "Gate one rests"), "circle", 0.5],
  [W("b29", 0), "whoosh", 0.4], [W("b30", 0), "paper", 0.4], [W("b31", 0), "paper", 0.5],
];
