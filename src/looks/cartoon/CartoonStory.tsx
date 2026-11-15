// CARTOON (pilot for cw01, 28 Oct 2026): a flat 2D cartoon explainer. An original shopkeeper and bottle characters act out each
// beat on a kirana set; every number lands on a white badge or a price tag on the narrator's word (lockF), never before.
// Every word and number comes from data.json (L); only the story's beat order and the staging are written here.
// Pilot staging is for the cw01 cola story (hook, Campa, challengers, incumbents, reply, statement, end); other stories are not staged yet.
import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {BrandBug} from "../shared/BrandBug";
import {LookAudio} from "../shared/LookAudio";
import {shown} from "../shared/lock";
import type {LookBar, LookBeat, LookProps} from "../shared/types";
import {beatAt} from "../shared/useLookData";
import {Bottle, BottleBar, Fridge, Keeper, MiniBottle, Shop, STOCK, type Stock} from "./art";
import {C} from "./palette";
import {Badge, Bubble, Pill, RichLine, ROUND, SANS, Tag, Wipe, ease, easeIO, pop} from "./ui";
import cues from "../../../public/datayt/beats/cw01/mouth_cues.json";

const SAFE = {x0: 95, x1: 850, y0: 210, y1: 1480};

// The narrator's mouth shape at frame f (scripts/datayt/mouth_cues.py); the shopkeeper speaks the narration whenever he is on screen.
const mouthAt = (f: number): string => {
  const ln = cues.lines.find((l) => f >= l.f0 && f < l.f0 + l.shapes.length);
  return ln ? ln.shapes[f - ln.f0] : "X";
};

type Cam = {fx: number; fy: number; s0: number; s1: number};
// Scene: the stage (SVG art under a slow push-in) and the overlay (badges, pills, text) on top.
const Stage: React.FC<{f: number; a: number; b: number; cam: Cam; children: React.ReactNode}> = ({f, a, b, cam, children}) => {
  const s = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, a, b);
  return <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute", left: 0, top: 0}}>
    <g transform={`translate(${cam.fx} ${cam.fy}) scale(${s}) translate(${-cam.fx} ${-cam.fy})`}>{children}</g>
  </svg>;
};

// A pair of fridge shelves for the incumbents: reds and blues, one slot left empty.
const FRIDGE_ROWS: (Stock | null)[][] = [
  [STOCK.red, STOCK.blue, STOCK.red, STOCK.blue], [STOCK.blue, STOCK.red, STOCK.blue, STOCK.red],
  [STOCK.red, STOCK.blue, STOCK.red, STOCK.blue], [STOCK.blue, STOCK.red, STOCK.blue, null],
];

const Chip: React.FC<{text: string}> = ({text}) =>
  <div style={{position: "absolute", left: SAFE.x0, top: SAFE.y0 + 6, background: C.ink, color: C.white, borderRadius: 999, padding: "8px 26px", fontFamily: SANS, fontWeight: 900, fontSize: 26, letterSpacing: 3}}>{text}</div>;

const Source: React.FC<{text: string; on: boolean}> = ({text, on}) => !on ? null :
  <div style={{position: "absolute", left: SAFE.x0, top: SAFE.y1 - 50, width: 560, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 23, lineHeight: 1.22, color: C.ink, opacity: 0.9,
    background: "rgba(255,255,255,0.82)", borderRadius: 14, padding: "6px 12px"}}>{text}</div>;

// ---- scenes ---------------------------------------------------------------------------------------------------------------
type Sc = {a: number; b: number; node: (f: number) => React.ReactNode};

const hookText = (L: LookProps["L"], b: LookBeat, f: number) => {
  const lines = b.lines ?? [];
  return <div style={{position: "absolute", left: SAFE.x0, top: 290, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start"}}>
    {lines.map((ln, i) => <div key={i} style={{background: C.white, border: `7px solid ${C.ink}`, borderRadius: 30, padding: "8px 28px 12px", boxShadow: `0 8px 0 ${C.ink}`,
      transform: `translateX(${(1 - ease(f, b.f0 + i * 4, b.f0 + i * 4 + 10)) * -300}px)`}}>
      <RichLine text={ln} f={f} accent={C.red} locks={b.tokens} size={ln.length > 15 ? 76 : 88} color={C.ink}/></div>)}
  </div>;
};

const buildScenes = (L: LookProps["L"], B: LookProps["B"]): Sc[] => {
  const [h, c, ch, inc, rep, say, end] = L.beats;
  const sc: Sc[] = [];
  const src = (b: LookBeat, f: number) => <Source text={b.src} on={f >= b.lockF}/>;
  const chip = <Chip text={L.chip}/>;
  const bug = <div style={{position: "absolute", left: 0, top: 0}}><BrandBug B={B} on="light" size={30}/></div>;
  const chrome = (b: LookBeat, f: number, dark = false) => <>{!dark && chip}{!dark && src(b, f)}{bug}</>;

  // 1 hook, shop front: keeper presents the full fridge
  const h1 = h.f0 + 90;
  sc.push({a: h.f0, b: h1, node: (f) => <>
    <Stage f={f} a={h.f0} b={h1} cam={{fx: 700, fy: 900, s0: 1, s1: 1.07}}>
      <Shop/>
      <Fridge x={560} y={480} w={400} h={900} rows={FRIDGE_ROWS}/>
      <Keeper x={300} y={1420} h={690} f={f} pose="present" viseme={mouthAt(f)} look={1}/>
    </Stage>
    {hookText(L, h, f)}
    {chrome(h, f)}
  </>});
  // 2 hook, the crowned incumbents
  sc.push({a: h1, b: h.f1, node: (f) => <>
    <Stage f={f} a={h1} b={h.f1} cam={{fx: 540, fy: 1100, s0: 1, s1: 1.08}}>
      <Shop tint={C.sky2}/>
      <Bottle x={290} y={1420} h={700} liquid={STOCK.red.liquid} label={C.red} trim={C.redDark} cap={C.red} name="COKE" nameColor={C.redDark} expr="smug" arms="hip" crown f={f} seed={3} bob={4}/>
      <Bottle x={760} y={1420} h={700} liquid={STOCK.blue.liquid} label={C.blue} trim={C.blueDark} cap={C.blue} name="PEPSI" nameColor={C.blueDark} expr="smug" arms="hip" crown f={f} seed={5} bob={4} flip/>
    </Stage>
    <div style={{position: "absolute", left: SAFE.x0, top: 330}}><Badge n={h.hero} f={f} caption="of India's soft drinks" size={200} at={h1 + 4} accent={{kind: "underline", color: C.red}}/></div>
    {chrome(h, f)}
  </>});

  // 3 Campa arrives
  const c1 = c.f0 + 90, tagN = c.hero ?? c.big;
  const since = (c.text ?? "").match(/back since .*/i)?.[0].replace(/^./, (m) => m.toUpperCase()) ?? "";
  sc.push({a: c.f0, b: c1, node: (f) => <>
    <Stage f={f} a={c.f0} b={c1} cam={{fx: 540, fy: 1000, s0: 1.06, s1: 1}}>
      <Shop/>
      <Fridge x={620} y={480} w={380} h={900} rows={FRIDGE_ROWS}/>
      <Keeper x={330} y={1420} h={700} f={f} pose="lift" viseme={mouthAt(f)}/>
      <Bottle x={486} y={1010 + (1 - pop(f, c.f0 + 6)) * -500} h={250} liquid={C.orange} label={C.white} trim={C.orange} cap={C.orange} name="CAMPA" nameColor={C.orangeDark} expr="happy" arms="cheer" f={f} seed={9} tilt={-8}/>
    </Stage>
    {chrome(c, f)}
  </>});
  sc.push({a: c1, b: c.f1, node: (f) => <>
    <Stage f={f} a={c1} b={c.f1} cam={{fx: 540, fy: 1100, s0: 1, s1: 1.08}}>
      <Shop tint={C.sky2}/>
      <rect x={0} y={1370} width={1080} height={120} fill={C.floorDark} stroke={C.ink} strokeWidth={8}/>
      <rect x={0} y={1370} width={1080} height={30} fill={C.floor}/>
      <Bottle x={540} y={1380} h={760} liquid={C.orange} label={C.white} trim={C.orange} cap={C.orange} name="CAMPA" nameColor={C.orangeDark} expr="happy" arms="hip" f={f} seed={9} bob={5}/>
      {tagN && <Tag n={tagN} f={f} x={430} y={760} size={110}/>}
    </Stage>
    <div style={{position: "absolute", left: SAFE.x0, top: 290, width: SAFE.x1 - SAFE.x0}}>
      {shown(tagN, f) && <Pill text={since} f={f} at={(tagN?.lockF ?? c1) + 2} dot={C.orange} size={36}/>}
    </div>
    {c.sub && shown(tagN, f) && <div style={{position: "absolute", left: SAFE.x0, top: 1300, width: 600, background: C.white, border: `6px solid ${C.ink}`, borderRadius: 26, padding: "12px 22px", boxShadow: `0 8px 0 ${C.ink}`,
      fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.15, color: C.ink, opacity: ease(f, (tagN?.lockF ?? c1) + 6, (tagN?.lockF ?? c1) + 14)}}>{c.subShown}</div>}
    {chrome(c, f)}
  </>});

  // 4 challengers (bars)
  const chartScene = (b: LookBeat, a: number, z: number, o: {lo: string; hi: string; loDark: string; hiDark: string; down?: boolean; tag: string; stock: Stock; name: string; col: string}) => (f: number) => {
    const [cur, prev] = b.barsL as [LookBar, LookBar];
    const base = 1320, maxH = 640, g0 = a + 8;
    const hPrev = prev.frac * maxH * ease(f, g0, g0 + 16), hCurTarget = cur.frac * maxH;
    const hCur = o.down ? maxH * (1 - (1 - cur.frac) * ease(f, cur.num!.lockF - 4, cur.num!.lockF + 8)) * ease(f, g0 + 6, g0 + 22) : hCurTarget * ease(f, g0 + 10, g0 + 28);
    const topY = (hh: number) => base - hh;
    return <>
      <Stage f={f} a={a} b={z} cam={{fx: 475, fy: 900, s0: 1, s1: 1.05}}>
        <rect width={1080} height={1920} fill={C.sky}/>
        <rect x={SAFE.x0 - 20} y={520} width={SAFE.x1 - SAFE.x0 + 40} height={950} rx={46} fill={C.white} stroke={C.ink} strokeWidth={8}/>
        <line x1={SAFE.x0 + 10} y1={base} x2={SAFE.x1 - 10} y2={base} stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>
        <BottleBar x={285} yBase={base} w={200} h={Math.max(2, hPrev)} color={o.lo} dark={o.loDark}/>
        <BottleBar x={660} yBase={base} w={200} h={Math.max(2, hCur)} color={o.hi} dark={o.hiDark}/>
        <Bottle x={660} y={topY(hCur) + 4} h={220} liquid={o.stock.liquid} label={o.stock.label} trim={o.col} cap={o.stock.cap} name={o.name} nameColor={o.col} expr={o.down ? "worried" : "cheer"} arms={o.down ? "down" : "cheer"} sweat={o.down} f={f} seed={21} crown={o.down}/>
        {o.down && <g transform={`translate(${470} ${topY(maxH * 0.96) - 40})`} opacity={ease(f, cur.num!.lockF, cur.num!.lockF + 8)}>
          <path d="M 0 0 L 90 0 L 90 90 L 130 90 L 45 170 L -40 90 L 0 90 Z" fill={C.red} stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/></g>}
      </Stage>
      <div style={{position: "absolute", left: SAFE.x0, top: 290}}><Pill text={b.name ?? ""} f={f} at={a + 2} dot={o.col} size={36}/></div>
      {[[prev, 285, o.loDark], [cur, 660, o.hiDark]].map(([bar, cx, col], i) => {
        const r = bar as LookBar;
        return <div key={i} style={{position: "absolute", left: (cx as number) - 160, width: 320, top: 1344, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 32, color: C.ink,
          opacity: shown(r.num, f) ? 1 : 0}}>{r.name}</div>;
      })}
      <div style={{position: "absolute", left: 285 - 150, width: 300, top: topY(hPrev) - 190, display: "flex", justifyContent: "center"}}><Badge n={prev.num} f={f} color={o.loDark} size={96} rot={-3} accent={{kind: "underline", color: o.loDark, seed: 8}}/></div>
      <div style={{position: "absolute", left: 660 - 170, width: 340, top: topY(hCur) - 450, display: "flex", justifyContent: "center"}}><Badge n={cur.num} f={f} color={o.hiDark} size={118} rot={3} accent={{kind: "circle", color: o.hiDark, seed: o.down ? 3 : 5}}/></div>
      <div style={{position: "absolute", left: SAFE.x0, top: 1388, width: SAFE.x1 - SAFE.x0, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.ink, opacity: shown(cur.num, f) ? 1 : 0}}>{b.text}</div>
      {chrome(b, f)}
    </>;
  };
  sc.push({a: ch.f0, b: ch.f0 + 62, node: (f) => <>
    <Stage f={f} a={ch.f0} b={ch.f0 + 62} cam={{fx: 540, fy: 1000, s0: 1, s1: 1.07}}>
      <Shop tint={C.sky2}/>
      <Bottle x={330} y={1420} h={640} liquid={C.orange} label={C.white} trim={C.orange} cap={C.orange} name="CAMPA" nameColor={C.orangeDark} expr="cheer" arms="cheer" f={f} seed={9} bob={6}/>
      <Bottle x={760} y={1420} h={640} liquid={C.lime} label={C.white} trim={C.green} cap={C.green} name="ZEERA" nameColor={C.greenDark} expr="cheer" arms="cheer" f={f} seed={11} bob={6} flip/>
    </Stage>
    <div style={{position: "absolute", left: SAFE.x0, top: 290}}><Pill text={ch.kicker ?? ""} f={f} at={ch.f0 + 2} dot={C.orange} size={34}/></div>
    {chrome(ch, f)}
  </>});
  sc.push({a: ch.f0 + 62, b: ch.f1, node: chartScene(ch, ch.f0 + 62, ch.f1, {lo: "#BFD3E8", hi: C.orange, loDark: C.royalDark, hiDark: C.orangeDark, tag: "", stock: {liquid: C.orange, label: C.white, cap: C.orange}, name: "CAMPA", col: C.orangeDark})});

  // 5 incumbents fall
  sc.push({a: inc.f0, b: inc.f1, node: chartScene(inc, inc.f0, inc.f1, {lo: "#BFD3E8", hi: C.red, loDark: C.royalDark, hiDark: C.redDark, down: true, tag: "", stock: STOCK.red, name: "COKE", col: C.redDark})});

  // 6 the reply: their own tagged packs
  const rn = rep.hero ?? rep.big;
  sc.push({a: rep.f0, b: rep.f1, node: (f) => <>
    <Stage f={f} a={rep.f0} b={rep.f1} cam={{fx: 540, fy: 1100, s0: 1, s1: 1.07}}>
      <Shop/>
      <rect x={0} y={1370} width={1080} height={120} fill={C.floorDark} stroke={C.ink} strokeWidth={8}/>
      <rect x={0} y={1370} width={1080} height={30} fill={C.floor}/>
      <Bottle x={290} y={1380} h={560} liquid={STOCK.red.liquid} label={C.red} trim={C.redDark} cap={C.red} name="COKE" nameColor={C.redDark} expr="smug" arms="hold" f={f} seed={3} bob={4}/>
      <Bottle x={780} y={1380} h={560} liquid={STOCK.blue.liquid} label={C.blue} trim={C.blueDark} cap={C.blue} name="PEPSI" nameColor={C.blueDark} expr="smug" arms="hold" f={f} seed={5} bob={4} flip/>
      {rn && <><Tag n={rn} f={f} x={210} y={880} size={92}/><Tag n={rn} f={f} x={870} y={880} size={92} at={rn.lockF + 4}/></>}
    </Stage>
    <div style={{position: "absolute", left: SAFE.x0, top: 290}}><Pill text={rep.kicker ?? ""} f={f} at={rep.f0 + 2} dot={C.red} size={36}/></div>
    <div style={{position: "absolute", left: SAFE.x0, top: 392, width: 640, background: C.white, border: `6px solid ${C.ink}`, borderRadius: 26, padding: "12px 22px", boxShadow: `0 8px 0 ${C.ink}`,
      fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.15, color: C.ink, opacity: shown(rn, f) ? ease(f, (rn?.lockF ?? 0) + 6, (rn?.lockF ?? 0) + 14) : 0}}>{rep.text}</div>
    {chrome(rep, f)}
  </>});

  // 7 statement card
  const sn = say.hero;
  sc.push({a: say.f0, b: say.f1, node: (f) => <>
    <AbsoluteFill style={{background: C.royal}}/>
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <rect y={1160} width={1080} height={760} fill={C.royalDark}/>
      <rect y={1160} width={1080} height={12} fill={C.white} opacity={0.4}/>
      {[[200, "orange", C.orange, "CAMPA", C.orangeDark, C.white, C.orange], [540, "red", STOCK.red.liquid, "COKE", C.redDark, C.red, C.red], [880, "blue", STOCK.blue.liquid, "PEPSI", C.blueDark, C.blue, C.blue]].map(([x, k, liq, nm, nmc, lab, cap], i) =>
        <g key={String(k)}><Bottle x={x as number} y={1500 + Math.min(0, -60 * Math.sin(Math.max(0, f - (sn?.lockF ?? 0) - i * 3) / 4) * Math.exp(-(f - (sn?.lockF ?? 0)) / 14))} h={520} liquid={liq as string} label={lab as string} trim={nmc as string} cap={cap as string} name={nm as string} nameColor={nmc as string} expr="smug" arms="hip" f={f} seed={30 + i} bob={3}/></g>)}
      {sn && <>{[200, 540, 880].map((x, i) => <Tag key={x} n={sn} f={f} x={x} y={1040} size={70} at={sn.lockF + i * 3} swing={1.2}/>)}</>}
    </svg>
    <div style={{position: "absolute", left: SAFE.x0, top: 300, display: "flex", flexDirection: "column", gap: 6}}>
      {(say.lines ?? []).map((ln, i) => <div key={i} style={{transform: `translateX(${(1 - ease(f, say.f0 + i * 5, say.f0 + i * 5 + 10)) * -260}px)`, opacity: ease(f, say.f0 + i * 5, say.f0 + i * 5 + 6)}}>
        <RichLine text={ln} f={f} accent={C.yellow} locks={say.tokens} size={ln.length > 12 ? 112 : 128} color={C.white} mark={{kind: "circle", color: C.white, seed: 2}}/></div>)}
    </div>
    {bug}
  </>});

  // 8 end: the question
  sc.push({a: end.f0, b: end.f1, node: (f) => <>
    <Stage f={f} a={end.f0} b={end.f1} cam={{fx: 540, fy: 1100, s0: 1, s1: 1.05}}>
      <Shop/>
      <rect x={0} y={1370} width={1080} height={120} fill={C.floorDark} stroke={C.ink} strokeWidth={8}/>
      <rect x={0} y={1370} width={1080} height={30} fill={C.floor}/>
      <Keeper x={210} y={1390} h={620} f={f} pose="point" viseme={mouthAt(f)}/>
      <Bottle x={455} y={1380} h={330} liquid={C.orange} label={C.white} trim={C.orange} cap={C.orange} name="CAMPA" nameColor={C.orangeDark} expr="happy" arms="cheer" f={f} seed={9} bob={5}/>
      <Bottle x={620} y={1380} h={330} liquid={STOCK.red.liquid} label={C.red} trim={C.redDark} cap={C.red} name="COKE" nameColor={C.redDark} expr="happy" arms="cheer" f={f} seed={3} bob={5}/>
      <Bottle x={785} y={1380} h={330} liquid={STOCK.blue.liquid} label={C.blue} trim={C.blueDark} cap={C.blue} name="PEPSI" nameColor={C.blueDark} expr="happy" arms="cheer" f={f} seed={5} bob={5}/>
      <Bottle x={950} y={1380} h={330} liquid={C.cola} label={C.yellow} trim={C.gold} cap={C.ink} name="THUMS UP" nameColor={C.ink} expr="happy" arms="cheer" f={f} seed={7} bob={5}/>
    </Stage>
    <div style={{position: "absolute", left: SAFE.x0 + 40, top: 330}}><Bubble text={end.q ?? ""} f={f} at={end.f0 + 6} size={70}/></div>
    <div style={{position: "absolute", left: SAFE.x0, top: 640, width: 700, background: C.white, border: `6px solid ${C.ink}`, borderRadius: 26, padding: "12px 22px", boxShadow: `0 8px 0 ${C.ink}`,
      fontFamily: SANS, fontWeight: 800, fontSize: 36, lineHeight: 1.15, color: C.ink, opacity: ease(f, end.f0 + 24, end.f0 + 34)}}>{end.sub}</div>
    {chrome(end, f)}
  </>});
  return sc;
};

export const CartoonStory: React.FC<LookProps> = ({L, B}) => {
  const f = useCurrentFrame();
  const scenes = React.useMemo(() => buildScenes(L, B), [L, B]);
  const sc = scenes.find((s) => f >= s.a && f < s.b) ?? scenes[scenes.length - 1];
  const bounds = L.beats.slice(1).map((b) => b.f0);
  void beatAt;
  return <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
    {sc.node(f)}
    {bounds.map((at) => <Wipe key={at} f={f} at={at}/>)}
    <LookAudio L={L}/>
  </AbsoluteFill>;
};
void ROUND;
void MiniBottle;
