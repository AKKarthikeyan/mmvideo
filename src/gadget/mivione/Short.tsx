// GK001 "An Indian Earbuds Brand Just Made a Phone" (Mivi One 5G), 21 Oct 2026. Every visual is cued to a spoken phrase
// through timing.json (scripts/gadget/gk_align.py). Figures: Mivi spec page (mivi.in/mivi-one) and Flipkart price on 21 Oct
// 2026; ledger in scripts/gadget/SCRIPT_mivione.md.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Aside, C, Draw, FPS, H, Head, Mono, Paper, PriceTag, Source, Spec, Tag, TopBar, Toggle, W, ease, lin, makeCues, usePop, useGKFonts, win, Timing} from "../kit";
import {Key, PState, Phone, PHONE, Tone, phoneAt} from "../phone";
import {Battery, BoxCharger, Charminar, Chip, Earbuds, Pin, PixelGrid, ServiceLoop, Sun} from "../props";
import S from "./script.json";
import T from "./timing.json";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
export const MIVI_FRAMES = cue.total + 45;

const TONES: Record<string, Tone> = {
  green: {name: "green", light: "#C4E3AE", mid: "#7DAE66", dark: "#2E5226"},
  blue: {name: "blue", light: "#CFE2F6", mid: "#86AEDC", dark: "#2E4F84"},
  pink: {name: "pink", light: "#F8D3DC", mid: "#E39AAE", dark: "#9A4A62"},
  burgundy: {name: "burgundy", light: "#C46A80", mid: "#7E2643", dark: "#3C0F1E"},
  navy: {name: "navy", light: "#7C8DB2", mid: "#33456E", dark: "#121B33"},
};
const BASE: PState = {x: 540, y: 2400, s: 0.95, r: -6, view: "back", tone: TONES.green, o: 0, screen: "home", level: 0};
const KEYS: Key[] = [
  {f: at("b01", "first phone") - 10, o: 1, y: 1230, d: 18},
  {f: at("b02", "made"), x: 770, y: 1270, s: 0.62, r: 8, d: 12},
  {f: at("b03") - 2, x: 540, y: 1180, s: 1.1, r: -8, d: 14},
  {f: at("b04", "It runs"), view: "front", r: 0, s: 1.0, y: 1220, d: 16},
  {f: at("b05", "two big"), x: 330, s: 0.8, y: 1230, d: 14},
  {f: at("b06") - 4, view: "bottom", x: 540, y: 1180, s: 2.2, r: 0, d: 16},
  {f: at("b07") - 4, y: 2700, o: 0, d: 12},
  {f: at("b08", "in a body") - 4, view: "side", x: 540, y: 1250, s: 1.0, r: 0, o: 1, d: 16},
  {f: at("b09") - 2, x: -300, o: 0, d: 12},
  {f: at("b10") - 6, view: "back", x: 758, y: 1798, s: 2.4, r: 0, o: 1, d: 18},
  {f: at("b10", "Samsung"), x: 777, y: 1852, s: 2.6, d: 90},   // slow push-in, camera island stays put
  {f: at("b11") - 2, y: 2900, o: 0, d: 10},
  {f: at("b12") - 2, view: "front", screen: "home", x: 540, y: 1250, s: 1.0, r: 0, o: 1, d: 16},
  {f: at("b13") - 2, screen: "charge", level: 0.12, d: 8},
  {f: at("b13", "tops out"), level: 0.3, d: 70},
  {f: at("b14", "Five hundred") - 4, y: 2700, o: 0, d: 12},
  {f: at("b15") - 4, view: "back", screen: "home", x: 540, y: 1270, s: 0.92, r: -6, o: 1, d: 16},
  {f: at("b15", "five colours") - 2, o: 0, d: 6},
  {f: at("b16") - 2, view: "front", x: 330, y: 1200, s: 0.78, r: 0, o: 1, d: 14},
  {f: at("b17") - 2, y: 2700, o: 0, d: 12},
];
const SRC_SPEC = "Specs · mivi.in/mivi-one", SRC_PRICE = "Price · Flipkart, 21 Oct 2026";
const sfx = (n: string) => staticFile(`voxplus/audio/${n}`);
const SFX: [number, string, number][] = [
  [at("b01", "first phone") - 10, "sfx_whoosh_cartoony_branrainey.wav", 0.3],
  [at("b04", "It runs"), "sfx_paper_slide_kingofgamers.wav", 0.35],
  [at("b05") - 6, "sfx_pop_conarb13.wav", 0.25],
  [at("b06", "headphone jack"), "sfx_marker_circle_elliottklein.wav", 0.45],
  [at("b07") - 4, "sfx_whoosh_deep_kinoton.wav", 0.3],
  [at("b09", "charger"), "sfx_pop_conarb13.wav", 0.3],
  [at("b10", "fifty megapixel"), "sfx_shutter_click_cabledmess.wav", 0.45],
  [at("b11", "catch"), "sfx_thump_stamp_mpuffenbarger.wav", 0.55],
  [at("b15", "thirteen thousand"), "sfx_coin_ding_greenvwbeetle.wav", 0.4],
  [at("b16", "cleared out"), "sfx_pop_conarb13.wav", 0.2],
  [at("b16", "kept the"), "sfx_pop_conarb13.wav", 0.2],
  [at("b16", "built it"), "sfx_pop_conarb13.wav", 0.2],
];
const Rs: React.FC<{v: string}> = ({v}) => <><span style={{fontFamily: "Inter", fontWeight: 900}}>₹</span>{v}</>;

export const MiviShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const pop = usePop();
  const w = (a: number, b: number, out = 6) => win(fr, a, b, out);
  const dark = ease(fr, at("b07") - 6, at("b07") + 6) - ease(fr, at("b08") - 6, at("b08") + 6);
  const ph = phoneAt(KEYS, fr, BASE);

  // b05 junk tiles around the phone: pop, get crossed, fall away
  const tiles = [[200, 880], [880, 940], [170, 1250], [905, 1300], [230, 1580], [860, 1620]];
  const t0 = at("b05") - 6, tx = t0 + 14, tf = t0 + 22;
  // b08 battery fill and count
  const bfill = ease(fr, at("b08", "six thousand"), at("b08", "battery") + 10);
  // b15 five colours fan
  const fanA = at("b15", "five colours") - 2;
  // b17 toggle flips
  const ta = at("b17") + 6; const tk = Math.max(0, fr - ta); const flipN = Math.floor(tk / 14); const flipP = ease(tk % 14, 0, 8);
  const tog = fr < ta ? 0 : flipN % 2 === 0 ? flipP : 1 - flipP;

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <Paper dark={dark}/>
      <Phone st={ph}/>

      {/* b01 earbuds -> phone */}
      <Earbuds p={ease(fr, 0, 30)} x={ease(fr, at("b01", "just made"), at("b01", "just made") + 16, 540, -280)} y={1180} s={1.2} o={1 - lin(fr, at("b01", "just made") + 4, at("b01", "just made") + 16)}/>
      {/* hook on screen from the first frame (AK 13 Oct: the opening must be the strongest moment) */}
      <Head text={"An Indian\n{earbuds}\nbrand"} f0={-20} y={300} size={124} o={w(0, at("b01", "just made") - 2)}/>
      <Mono text="An Indian earbuds brand" f0={at("b01", "just made")} y={262} o={w(at("b01", "just made"), at("b02"))} color={C.ink2}/>
      <Head text={"Just made\na {phone}."} f0={at("b01", "just made")} y={320} size={132} o={w(at("b01", "just made"), at("b02"))}/>

      {/* b02 Hyderabad */}
      <Charminar p={ease(fr, at("b02") - 2, at("b02") + 26)} x={330} y={1240} s={0.95} o={w(at("b02") - 2, next("b02"))}/>
      <Pin p={ease(fr, at("b02", "Hyderabad"), at("b02", "Hyderabad") + 10)} x={330} y={1020} s={0.8} o={w(at("b02"), next("b02"))}/>
      <Aside text="made in" f0={at("b02", "made")} y={262} size={84} o={w(at("b02") - 2, next("b02"))}/>
      <Head text="{Hyderabad}." f0={at("b02", "Hyderabad") - 2} y={350} size={128} o={w(at("b02") - 2, next("b02"))}/>
      <Mono text="17.38° N · 78.49° E" f0={at("b02", "Hyderabad")} y={1560} o={w(at("b02"), next("b02"))}/>

      {/* b03 name */}
      <Head text={"Mivi\none {5G}"} f0={at("b03", "Mivi") - 2} y={300} size={150} o={w(at("b03") - 2, next("b03"))}/>
      <Tag text="Mivi's first phone" f0={at("b03", "Mivi") + 4} x={64} y={612} size={28} o={w(at("b03"), next("b03"))}/>

      {/* b04 plain Android */}
      <Aside text="here's the interesting part" f0={at("b04") - 2} y={262} size={74} o={w(at("b04") - 2, next("b04"))}/>
      <Head text={"Plain\nAndroid {16}"} f0={at("b04", "plain")} y={360} size={130} o={w(at("b04"), next("b04"))}/>

      {/* b05 no bloatware, then the update ladder */}
      <Head text={"No\n{bloatware}."} f0={at("b05") - 4} y={300} size={130} o={w(at("b05") - 4, at("b05", "two big") - 4)}/>
      {fr >= t0 && fr < tf + 40 && tiles.map(([x, y], i) => {
        const p = pop(t0 + i * 2); const fall = Math.max(0, fr - tf - i); const xP = ease(fr, tx + i, tx + i + 6);
        return (
          <div key={i} style={{position: "absolute", left: x - 60, top: y - 60 + fall * fall * 1.6, width: 120, height: 120, transform: `scale(${p}) rotate(${(i % 2 ? 1 : -1) * fall * 2}deg)`, opacity: 1 - lin(fall, 18, 30)}}>
            <div style={{width: 120, height: 120, borderRadius: 32, background: "#D9D2C7", border: `5px solid ${C.mute}`, boxSizing: "border-box"}}/>
            <svg width={120} height={120} style={{position: "absolute", left: 0, top: 0}}><Draw d="M 28 28 L 92 92 M 92 28 L 28 92" p={xP} stroke={C.accent} w={12} len={100}/></svg>
          </div>
        );
      })}
      <Head text={"Up to\nAndroid {18}"} f0={at("b05", "two big")} y={300} size={124} o={w(at("b05", "two big"), next("b05"))}/>
      <Mono text="Two OS upgrades · per Mivi" f0={at("b05", "promises")} y={560} o={w(at("b05", "two big"), next("b05"))}/>
      {fr > at("b05", "two big") - 2 && fr < next("b05") + 8 && (() => {
        const a = at("b05", "two big"), b = at("b05", "Android eighteen");
        const lp = ease(fr, a, b + 4), o = w(a, next("b05"));
        const nodes: [string, number, string][] = [["16", 1460, "now"], ["17", 1180, ""], ["18", 900, "promised"]];
        return (
          <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
            <line x1={760} y1={1460} x2={760} y2={900} stroke={C.line} strokeWidth={10}/>
            <line x1={760} y1={1460} x2={760} y2={1460 - 560 * lp} stroke={C.ink} strokeWidth={10}/>
            {nodes.map(([n, y, l], i) => {
              const on = i === 0 ? 1 : lp >= (i === 1 ? 0.5 : 0.98) ? 1 : 0; const last = i === 2;
              return (
                <g key={n} opacity={i === 0 ? 1 : 0.35 + 0.65 * on}>
                  <circle cx={760} cy={y} r={56} fill={last && on ? C.accent : on ? C.ink : C.paper} stroke={last && on ? C.accent : C.ink} strokeWidth={8}/>
                  <text x={760} y={y + 17} textAnchor="middle" fontFamily="GKHead" fontSize={48} fill={on ? C.white : C.ink}>{n}</text>
                  {l && <text x={836} y={y + 10} fontFamily="'IBM Plex Mono'" fontWeight={600} fontSize={26} letterSpacing={3} fill={last ? C.accent : C.mute}>{l.toUpperCase()}</text>}
                </g>
              );
            })}
          </svg>
        );
      })()}

      {/* b06 headphone jack */}
      <Aside text="and yes," f0={at("b06") - 2} y={262} size={84} o={w(at("b06") - 2, next("b06"))}/>
      <Head text={"Headphone\n{jack}."} f0={at("b06", "kept")} y={360} size={120} o={w(at("b06"), next("b06"))}/>
      {fr > at("b06", "earbuds") - 2 && fr < next("b06") + 8 && (
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: w(at("b06", "earbuds"), next("b06"))}}>
          <Draw d="M 263 1112 A 68 68 0 1 1 262.9 1112" p={ease(fr, at("b06", "earbuds"), at("b06", "earbuds") + 14)} stroke={C.accent} w={10} len={440}/>
          <Draw d="M 263 1250 L 263 1400" p={ease(fr, at("b06", "kept") - 4, at("b06", "kept") + 4)} stroke={C.accent} w={6} len={160}/>
        </svg>
      )}
      <Spec big="3.5MM" small="Headphone jack" f0={at("b06", "kept")} x={190} y={1420} size={150} o={w(at("b06", "kept"), next("b06"))}/>
      <Mono text="USB-C" f0={at("b06", "earbuds") + 6} x={500} y={1230} size={24} o={w(at("b06", "earbuds"), next("b06"))}/>

      {/* b07 chip, dark */}
      <Mono text="Inside" f0={at("b07") - 2} y={262} color="#9A948C" o={w(at("b07") - 2, next("b07"))}/>
      <Head text={"Snapdragon\n{4 Gen 2}"} f0={at("b07", "Snapdragon")} y={320} size={108} color="#EDE8E0" o={w(at("b07"), next("b07"))}/>
      <Chip p={ease(fr, at("b07") + 2, at("b07") + 50)} x={540} y={1080} label={["SNAPDRAGON", "4 GEN 2"]} o={w(at("b07"), next("b07")) * lin(fr, at("b07"), at("b07") + 8)}/>
      <Spec big="4NM" small="Process · 2× A78 + 6× A55" f0={at("b07", "four nanometre")} y={1400} size={180} color="#EDE8E0" o={w(at("b07"), next("b07"))}/>

      {/* b08 battery, then thin */}
      <Battery fill={bfill} x={140} y={860} o={w(at("b08") + 2, at("b08", "in a body") - 2) * lin(fr, at("b08") + 2, at("b08") + 8)}/>
      <Spec big={(Math.round((6000 * bfill) / 50) * 50).toLocaleString("en-IN")} small="mAh battery" f0={at("b08") + 2} y={300} size={230} o={w(at("b08") + 2, at("b08", "nine point") - 2)}/>
      <Spec big="9.15MM" small="Thin · 210 g" f0={at("b08", "nine point")} y={300} size={200} o={w(at("b08", "nine point"), next("b08"))}/>
      {fr > at("b08", "in a body") + 6 && fr < next("b08") + 8 && (() => {
        const a = at("b08", "in a body") + 10, p = ease(fr, a, a + 12);
        return (
          <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: w(a, next("b08"))}}>
            <Draw d="M 330 1250 L 496 1250 M 470 1226 L 496 1250 L 470 1274" p={p} stroke={C.accent} w={8} len={260}/>
            <Draw d="M 750 1250 L 584 1250 M 610 1226 L 584 1250 L 610 1274" p={p} stroke={C.accent} w={8} len={260}/>
          </svg>
        );
      })()}

      {/* b09 charger in the box */}
      <BoxCharger p={ease(fr, at("b09") - 2, at("b09") + 12)} q={ease(fr, at("b09", "charger"), at("b09", "charger") + 20)} x={540} y={1180} o={w(at("b09") - 2, next("b09"))}/>
      <Head text={"Charger\n{included}"} f0={at("b09") - 2} y={300} size={124} o={w(at("b09") - 2, next("b09"))}/>
      <Aside text="yes, still." f0={at("b09", "charger")} y={560} size={90} o={w(at("b09"), next("b09"))}/>

      {/* b10 camera */}
      <Mono text="Main camera" f0={at("b10") - 2} y={262} o={w(at("b10") - 2, next("b10"))}/>
      <Spec big="50MP" small="Samsung ISOCELL sensor" f0={at("b10", "fifty megapixel")} y={320} size={230} o={w(at("b10"), next("b10"))}/>
      <Tag text="f/1.8 lens" f0={at("b10", "f one point eight")} x={690} y={980} accent o={w(at("b10"), next("b10"))}/>

      {/* b11 the catch */}
      <Aside text="but there's a" f0={at("b11") - 2} y={760} size={120} align="center" o={w(at("b11") - 2, next("b11"))}/>
      <Head text="{Catch}." f0={at("b11", "catch") - 2} y={880} size={230} align="center" o={w(at("b11"), next("b11"))}/>

      {/* b12 screen */}
      <Spec big='6.75"' small="Inch screen" f0={at("b12", "six point") } y={300} size={220} o={w(at("b12") - 2, at("b12", "HD plus") - 2)}/>
      {fr > at("b12", "six point") && fr < next("b12") + 8 && (
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: w(at("b12", "six point"), at("b12", "That's") )}}>
          <Draw d="M 372 1652 L 708 848" p={ease(fr, at("b12", "six point"), at("b12", "six point") + 16)} stroke={C.accent} w={8} len={900}/>
          <circle cx={372} cy={1652} r={12} fill={C.accent} opacity={lin(fr, at("b12", "six point"), at("b12", "six point") + 4)}/>
          <circle cx={708} cy={848} r={12} fill={C.accent} opacity={lin(fr, at("b12", "six point") + 12, at("b12", "six point") + 16)}/>
        </svg>
      )}
      <Head text="HD+ {LCD}" f0={at("b12", "HD plus")} y={300} size={150} o={w(at("b12", "HD plus"), at("b12", "four hundred") - 2)}/>
      <Mono text="1600 × 720 · 120 Hz" f0={at("b12", "HD plus") + 6} y={470} o={w(at("b12", "HD plus"), at("b12", "four hundred") - 2)}/>
      <PixelGrid p={ease(fr, at("b12", "seven twenty"), at("b12", "seven twenty") + 18)} x={590} y={880} size={360} o={w(at("b12", "seven twenty"), next("b12")) * lin(fr, at("b12", "seven twenty"), at("b12", "seven twenty") + 4)}/>
      <Tag text="720p" f0={at("b12", "seven twenty") + 4} x={600} y={820} accent o={w(at("b12", "seven twenty"), next("b12"))}/>
      <Sun p={ease(fr, at("b12", "four hundred"), at("b12", "four hundred") + 14)} x={190} y={1500} s={0.8} o={w(at("b12", "four hundred"), next("b12"))}/>
      <Spec big="450" small="Nits · brightness" f0={at("b12", "four hundred")} y={300} size={230} o={w(at("b12", "four hundred"), next("b12"))}/>

      {/* b13 charging */}
      <Mono text="Charging" f0={at("b13") - 2} y={262} o={w(at("b13") - 2, next("b13"))}/>
      <Spec big="18W" small="Max · USB PD" f0={at("b13", "tops out")} y={320} size={240} o={w(at("b13"), next("b13"))}/>

      {/* b14 service */}
      <Head text={"Betting on\n{service}"} f0={at("b14") - 2} y={300} size={124} o={w(at("b14") - 2, at("b14", "Five hundred") - 2)}/>
      <Spec big="500+" small="Service centres in India" f0={at("b14", "Five hundred")} y={300} size={230} o={w(at("b14", "Five hundred"), at("b14", "nineteen") - 2)}/>
      <Spec big="19,000+" small="Pin codes · free pickup & drop" f0={at("b14", "nineteen")} y={300} size={190} o={w(at("b14", "nineteen"), next("b14"))}/>
      {fr > at("b14", "Five hundred") - 2 && fr < at("b14", "free pickup") + 10 && (() => {
        const a = at("b14", "Five hundred"), o = w(a, at("b14", "free pickup"), 8); const cells = [];
        for (let i = 0; i < 500; i++) {
          const r = Math.floor(i / 25), c = i % 25; const on = fr - a > (i / 500) * 36;
          cells.push(<circle key={i} cx={198 + c * 28.5} cy={860 + r * 30} r={9} fill={on ? C.ink : C.line}/>);
        }
        return <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: o}}>{cells}<text x={540} y={1520} textAnchor="middle" fontFamily="'IBM Plex Mono'" fontWeight={500} fontSize={24} letterSpacing={3} fill={C.mute}>ONE DOT = ONE SERVICE CENTRE</text></svg>;
      })()}
      <ServiceLoop p={ease(fr, at("b14", "free pickup") - 2, at("b14", "free pickup") + 28)} t={(fr - at("b14", "free pickup")) / 75} x={540} y={1160} o={w(at("b14", "free pickup") - 2, next("b14")) * lin(fr, at("b14", "free pickup") - 2, at("b14", "free pickup") + 6)}/>

      {/* b15 price, variants, colours */}
      <PriceTag text={<Rs v="13,999"/>} f0={at("b15", "thirteen thousand")} x={110} y={270} size={130} o={w(at("b15", "thirteen thousand"), next("b15"))}/>
      <Mono text="on Flipkart · 4 GB + 128 GB" f0={at("b15", "on Flipkart")} y={500} o={w(at("b15", "on Flipkart"), next("b15"))}/>
      <Mono text="128 GB storage · every model" f0={at("b15", "a hundred") } y={582} color={C.ink} size={24} o={w(at("b15", "a hundred"), next("b15"))}/>
      {[["4 GB RAM", "13,999"], ["6 GB RAM", "15,999"], ["8 GB RAM", "16,999"]].map(([r, p], i) => {
        const f0 = at("b15", "a hundred") + 4 + i * 4; const q = pop(f0);
        return (
          <div key={r} style={{position: "absolute", left: 64 + i * 322, top: 630, width: 296, height: 150, borderRadius: 22, background: C.white, border: `4px solid ${i === 0 ? C.accent : C.line}`, boxSizing: "border-box", padding: "18px 22px", opacity: w(f0, next("b15")) * Math.min(1, q * 2), transform: `translateY(${(1 - q) * 30}px)`}}>
            <div style={{fontFamily: "'IBM Plex Mono'", fontWeight: 600, fontSize: 22, letterSpacing: 2, color: C.mute}}>{r}</div>
            <div style={{fontFamily: "GKHead, Inter", fontSize: 60, color: i === 0 ? C.accent : C.ink, marginTop: 10, letterSpacing: -1}}><Rs v={p}/></div>
          </div>
        );
      })}
      {fr > fanA && fr < next("b15") + 8 && ["green", "blue", "pink", "burgundy", "navy"].map((k, i) => {
        const q = pop(fanA + i * 3, 13, 150); const o = w(fanA, next("b15"));
        const st: PState = {...BASE, view: "back", tone: TONES[k], x: 540 + (i - 2) * 175 * q, y: 1300 + Math.abs(i - 2) * 34, s: 0.5, r: (i - 2) * 9 * q, o: o * Math.min(1, q * 2)};
        return <Phone key={k} st={st} id={`fan${k}`}/>;
      })}
      <Mono text="Green · Blue · Pink · Burgundy · Navy blue" f0={fanA + 10} y={1600} align="center" size={24} o={w(fanA, next("b15"))}/>

      {/* b16 the formula */}
      <Mono text="So, basically" f0={at("b16") - 2} y={262} color={C.accent} o={w(at("b16") - 2, next("b16"))}/>
      <Head text={"The\n{formula}"} f0={at("b16") - 2} y={320} size={130} o={w(at("b16") - 2, next("b16"))}/>
      <Tag text="Budget phone" f0={at("b16", "budget phone")} x={540} y={860} size={34} o={w(at("b16"), next("b16"))}/>
      <Tag text="− Junk apps" f0={at("b16", "cleared out")} x={540} y={975} size={34} o={w(at("b16"), next("b16"))}/>
      <Tag text="+ 3.5 mm jack" f0={at("b16", "kept the")} x={540} y={1090} size={34} o={w(at("b16"), next("b16"))}/>
      <Tag text="Hyderabad-made" f0={at("b16", "built it")} x={540} y={1205} size={34} accent o={w(at("b16"), next("b16"))}/>
      <PriceTag text={<Rs v="13,999"/>} f0={at("b16", "Hyderabad") + 4} x={560} y={1340} size={88} rot={-4} o={w(at("b16", "Hyderabad"), next("b16"))}/>

      {/* b17 sign-off */}
      <Head text="Worth it" f0={at("b17") - 2} y={700} size={170} align="center" o={w(at("b17") - 2, MIVI_FRAMES)}/>
      {fr > at("b17") && <div style={{opacity: lin(fr, at("b17"), at("b17") + 8)}}><Toggle on={tog} x={440} y={910} w={200}/></div>}
      <Aside text="or not?" f0={at("b17", "or not")} y={1060} size={130} align="center" o={w(at("b17"), MIVI_FRAMES)}/>
      <Mono text="Gadget Kadai · tell us in the comments" f0={at("b17", "or not") + 10} y={1340} align="center" size={24} o={w(at("b17"), MIVI_FRAMES)}/>

      <TopBar ep={S.ep} product={S.product} total={MIVI_FRAMES} dark={dark}/>
      <Source text={fr < at("b14") ? SRC_SPEC : fr < at("b15") ? "Service · mivi.in (Mivi Care+)" : SRC_PRICE} o={fr > at("b03") && fr < at("b17") ? 1 : 0} dark={dark > 0.5}/>

      <Audio src={staticFile("gadget/mivione/vo.wav")}/>
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.09 * lin(f, 0, 15) * (1 - lin(f, MIVI_FRAMES - 40, MIVI_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={sfx(n)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
