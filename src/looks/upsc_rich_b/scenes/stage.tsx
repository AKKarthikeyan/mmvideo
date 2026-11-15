// Look B "stage" scene (UPSC monsoon film): a rich illustrated set under a slow camera, the girl, props, number cards, pills and one speech bubble.
// Same spec fields as the cartoon storyboard (src/looks/cartoon/long/scenes/stage.tsx, CONTRACT_UPSC.md); drawn in look B (see ../CONTRACT_B.md).
// Reveal rule: number cards, pills with a key and the bubble are drawn only from at(key); props/actors with `enter` pop in at at(enter).
import React from "react";
import {AbsoluteFill} from "remotion";
import {SAFE, type FigRef, type SceneProps} from "../../cartoon/long/contract";
import {fig, lab} from "../../cartoon/long/figs";
import {Girl, GIRL_POSES, type GirlPose} from "../girl";
import {H, PaperFinish, Pill, W, clamp, eio, eo, lerp, prog} from "../kit";
import {Bubble, NumberCard, SERIF_FONT, bubbleBox, numberCardBox, popK, textW, toneFor} from "./stage_ui";
import {PropDefs, Book, Bucket, CAL_H, CAL_W, Calendar, Thermometer} from "./stage_props";
import {ROOF_GRADE, RoofBack, type TimeName} from "./stage_roof";
import {HomeSet, StreetSet, VoidSet} from "./stage_sets";
import {BeachSet, HimalayaSet} from "./stage_sets2";
import {FieldSet} from "./stage_field";
import {FARMER_H, FARMER_POSES, Farmer, type FarmerPose} from "./stage_farmer";
import {Belt, POSTCARDS, PostcardDefs, Postcards, ReportCard, type PostcardWhich} from "./stage_props2";
import {GlobeIntro, Lightning, Rain} from "./stage_wx";

const SETS = ["home", "street", "void", "rooftop", "beach", "himalaya", "field"] as const;
type SetName = (typeof SETS)[number];
const TIMES: TimeName[] = ["may", "july", "noon", "burst"];
const ICONS = ["bucket", "thermometer", "calendar", "book", "postcards", "reportcard"] as const;

export type StageActor = {id: string; who: string; x: number; y: number; h: number; pose?: string; flip?: boolean; enter?: string; talk?: boolean};
export type StageProp = {icon: (typeof ICONS)[number]; x: number; y: number; s: number; enter?: string; state?: "empty" | "filling" | "full"; level?: "high" | "mid"; glow?: boolean; hl?: boolean; front?: boolean;
  cards?: {which: PostcardWhich; key?: string; hl?: boolean}[]; box?: string; key?: string};
export type StageBadge = {key: string; ref?: FigRef; const?: number; text?: string; prefix?: string; suffix?: string; caption?: string; x: number; y: number; size?: number; decimals?: number; lab?: string};
export type StagePill = {text?: string; lab?: string; x: number; y: number; key?: string};
export type StageBubble = {who?: string; text?: string; lab?: string; x?: number; y?: number; key?: string; size?: number};
export type StageSpec = {set: SetName; actors?: StageActor[]; props?: StageProp[]; badges?: StageBadge[]; pills?: StagePill[]; bubble?: StageBubble;
  time?: TimeName; rain?: boolean | "spells"; thunder?: boolean; intro?: "globe-band"; sky?: "clouds"; belt?: {key: string}};

const INTRO_F = 30, KEY_BOTTOM = 920, BUG = {x0: 1560, y1: 118};
const LEVEL = {high: 0.84, mid: 0.58};
const ACTOR_GRADE: Record<TimeName, string> = {may: "none", noon: "none", july: "saturate(0.86) brightness(0.96)", burst: "saturate(0.7) brightness(0.8)"};

const place = (cx: number, cy: number, w: number, h: number): [number, number] => {
  const x = Math.min(SAFE.x1 - w / 2, Math.max(SAFE.x0 + w / 2, cx));
  let y = Math.min(KEY_BOTTOM - h / 2, Math.max(SAFE.y0 + h / 2, cy));
  if (x + w / 2 > BUG.x0 && y - h / 2 < BUG.y1) y = Math.min(KEY_BOTTOM - h / 2, BUG.y1 + 8 + h / 2);
  return [x, y];
};

export const Scene: React.FC<SceneProps<StageSpec>> = ({f, dur, spec, at}) => {
  if (!SETS.includes(spec.set)) throw new Error(`stage: unknown set "${spec.set}" (known: ${SETS.join(", ")})`);
  const actors = spec.actors ?? [], props = spec.props ?? [], badges = spec.badges ?? [], pills = spec.pills ?? [], bub = spec.bubble, time = spec.time;
  if (time !== undefined && !TIMES.includes(time)) throw new Error(`stage: unknown time "${time}" (known: ${TIMES.join(", ")})`);
  if (spec.intro !== undefined && spec.intro !== "globe-band") throw new Error(`stage: unknown intro "${spec.intro}"`);
  if (spec.sky !== undefined && spec.sky !== "clouds") throw new Error(`stage: unknown sky "${spec.sky}" (known: clouds)`);
  if (spec.rain !== undefined && typeof spec.rain !== "boolean" && spec.rain !== "spells") throw new Error(`stage: unknown rain "${spec.rain}" (known: true, "spells")`);
  const ids: string[] = [];
  actors.forEach((a) => {
    if (a.who !== "girl" && a.who !== "farmer") throw new Error(`stage (look B): unknown actor "${a.who}" (known: girl, farmer)`);
    if (ids.includes(a.id)) throw new Error(`stage: duplicate actor id "${a.id}"`);
    const poses = a.who === "farmer" ? (FARMER_POSES as string[]) : (GIRL_POSES as string[]);
    if (a.pose !== undefined && !poses.includes(a.pose)) throw new Error(`stage: unknown pose "${a.pose}" for ${a.who} (known: ${poses.join(", ")})`);
    ids.push(a.id);
  });
  props.forEach((p) => { if (!ICONS.includes(p.icon)) throw new Error(`stage: unknown icon "${p.icon}" (known: ${ICONS.join(", ")})`); });
  const words = (o: {text?: string; lab?: string}, what: string): string => {
    if ((o.text === undefined) === (o.lab === undefined)) throw new Error(`stage: ${what} needs exactly one of text or lab`);
    return o.lab !== undefined ? lab(o.lab) : (o.text as string);
  };
  const speaker = bub ? (bub.who === undefined ? actors[0] : actors.find((a) => a.id === bub.who)) : undefined;
  if (bub && !speaker) throw new Error(`stage: bubble.who "${bub.who}" is not an actor id`);

  // ask for every key on every frame, so an unknown key throws even where nothing shows yet
  const enterOf = (k?: string) => (k ? at(k) : 0);
  const bubAt = bub ? (bub.key ? at(bub.key) : Math.max(8, (speaker?.enter ? at(speaker.enter) : 0) + 14)) : 0;
  const pillAt = pills.map((p, i) => (p.key ? at(p.key) : (spec.intro ? INTRO_F : 0) + 4 + i * 4));
  const actorAt = actors.map((a) => enterOf(a.enter)), propAt = props.map((p) => enterOf(p.enter));
  const safeAt = (k?: string): number => { if (!k) return 0; try { return at(k); } catch { return Infinity; } };   // a postcard whose key this scene never reveals stays off the line
  const rcAt = props.map((p) => (p.icon === "reportcard" ? at(p.key ?? (() => { throw new Error("stage: reportcard needs a key"); })()) : 0));
  const pcAt = props.map((p) => (p.icon === "postcards" ? (p.cards ?? []).map((c) => safeAt(c.key)) : []));
  const beltAt = spec.belt ? at(spec.belt.key) : 0;
  props.forEach((p) => { if (p.icon === "postcards") (p.cards ?? []).forEach((c) => { if (!POSTCARDS.includes(c.which)) throw new Error(`stage: unknown postcard "${c.which}" (known: ${POSTCARDS.join(", ")})`); }); });
  const pillText = pills.map((p) => words(p, "pill"));
  const bubText = bub ? words(bub, "bubble") : "";
  const upsc = badges.some((b) => b.ref?.t.startsWith("u7_"));
  const cards = badges.map((b, i) => {
    const t0 = at(b.key), dec = b.decimals ?? 1, prefix = b.prefix ?? "", suffix = b.suffix ?? "";
    const btext = b.lab !== undefined ? lab(b.lab) : b.text;
    if ([b.ref, b.const !== undefined ? 1 : undefined, btext].filter((v) => v !== undefined).length !== 1) throw new Error(`stage: badge "${b.key}" needs exactly one of ref, const, text or lab`);
    const size = Math.min(b.size ?? 150, 170), unit = suffix.startsWith(" ") ? suffix.trim() : suffix;
    if (btext !== undefined) {   // words instead of a number
      let sz = Math.min(size, 72); const tw = textW(btext, SERIF_FONT(600), sz); if (tw > 780) sz = Math.floor((sz * 780) / tw);   // long words shrink to a card under about 860 px
      const bx = numberCardBox(btext, "", sz, b.caption), [cx, cy] = place(b.x, b.y, bx.w, bx.h);
      return {b, t0, cx, cy, bx, words: btext, value: 0, dec, prefix, suffix, unit: "", size: sz, i};
    }
    const value = b.ref ? fig(b.ref, dec).value : (b.const as number), bx = numberCardBox(prefix + value.toFixed(dec), unit, size, b.caption), [cx, cy] = place(b.x, b.y, bx.w, bx.h);
    return {b, t0, cx, cy, bx, words: undefined as string | undefined, value, dec, prefix, suffix, unit, size, i};
  });

  // words badges that would overlap an earlier badge slide right (Part 2 puts two of them side by side)
  cards.forEach((c, i) => { if (c.words === undefined) return;
    if (props.some((p) => p.icon === "bucket") && c.cy + c.bx.h / 2 > 770) c.cy = 770 - c.bx.h / 2;   // keep a words badge off the bucket's rim
    for (let j = 0; j < i; j++) { const o = cards[j]; if (o.words === undefined) continue;
      const ov = Math.abs(c.cy - o.cy) < (c.bx.h + o.bx.h) / 2 && c.cx - c.bx.w / 2 < o.cx + o.bx.w / 2 + 24 && c.cx + c.bx.w / 2 > o.cx - o.bx.w / 2;
      if (ov) c.cx = Math.min(SAFE.x1 - c.bx.w / 2, o.cx + o.bx.w / 2 + 24 + c.bx.w / 2); }
  });

  // the Earth with a cloud band: the first second, then a cut to the set (the narration starts on the set)
  if (spec.intro === "globe-band" && f < INTRO_F) {
    return <AbsoluteFill style={{background: "#070d1f"}}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}><GlobeIntro f={f}/></svg></AbsoluteFill>;
  }
  const g = spec.intro ? f - INTRO_F : f, t = clamp(g / Math.max(1, dur - (spec.intro ? INTRO_F : 0)));
  // rain "spells": a downpour for the first part, then sun (the break). The break begins just before the "BREAK" pill; the bucket keeps its level.
  const spells = spec.rain === "spells";
  const breakAt = !spells ? 0 : (() => { const i = pills.findIndex((p) => p.key && /break/i.test(p.text ?? "")); return i >= 0 ? Math.max(30, pillAt[i] - 20) : dur * 0.6; })();
  const wet = spells ? g < breakAt : !!spec.rain, rainAmt = spells ? 1 - eo(prog(g, breakAt, 18)) : 1;
  const flash = spells ? clamp(prog(g, breakAt - 10, 10)) * (1 - eo(prog(g, breakAt, 36))) : 0;
  const grade: TimeName = spells ? (wet ? "july" : "noon") : (time ?? (spec.set === "field" && spec.sky === "clouds" ? "july" : "may"));

  // camera: a slow push-in and a gentle drift; the parallax inside the sets follows camX
  const camX = lerp(-16, 16, t), camY = lerp(4, -4, t), zoom = 1.02 + 0.03 * eio(t);
  const dx = Math.sin(g / 90) * 3, dy = Math.cos(g / 120) * 2.5;

  const popAbout = (x: number, y: number, p: number) => `translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`;
  const order = actors.map((a, i) => ({a, i})).sort((p, q) => p.a.y - q.a.y || p.i - q.i);

  const propNode = (p: StageProp, i: number) => {
    const t0 = propAt[i], k = p.enter ? popK(g, t0, 16) : 1;
    if (g < t0 || k <= 0.001) return null;
    let x = p.x;
    if (p.icon === "calendar") {   // keep clear of the number cards
      const w = (CAL_W * p.s) / 3;
      cards.forEach((c) => { const left = c.cx - c.bx.w / 2; if (x + w / 2 > left - 44 && x - w / 2 < c.cx + c.bx.w / 2 && Math.abs(p.y - c.cy) < (CAL_H * p.s) / 6 + c.bx.h / 2) x = Math.min(x, left - 44 - w / 2); });
    }
    const body = (() => {
      switch (p.icon) {
        case "bucket": {
          const level = p.state === "full" ? 1 : p.state === "filling" ? lerp(0.04, 0.92, eio(prog(g, 10, Math.max(20, (spells ? breakAt : dur) - 40)))) : 0;
          return <Bucket x={p.x} y={p.y} s={p.s} f={g} level={level} rain={spells ? rainAmt > 0.5 : !!spec.rain}/>;
        }
        case "thermometer": {
          const target = LEVEL[p.level ?? "high"], from = p.level === "mid" ? LEVEL.high : 0.24;
          return <Thermometer x={p.x} y={p.y} s={p.s} f={g} level={lerp(from, target, eio(prog(g, 12, 70)))}/>;
        }
        case "calendar": return <Calendar x={x} y={p.y} s={p.s} f={g} hl={p.hl ?? upsc} t0={t0}/>;
        case "book": return <Book x={p.x} y={p.y} s={p.s} f={g} glow={p.glow}/>;
        case "postcards": return <Postcards x={p.x} y={p.y} s={p.s} f={g} cards={(p.cards ?? []).map((c, k) => ({which: c.which, t0: pcAt[i][k], hl: !!c.hl}))}/>;
        case "reportcard": return <ReportCard x={p.x} y={p.y} s={p.s} f={g} boxText={p.box ?? ""} t0={rcAt[i]}/>;
      }
    })();
    return <g key={`p${i}`} transform={p.enter ? popAbout(x, p.y, k) : undefined}>{body}</g>;
  };

  const sunny = grade === "may" || grade === "noon";
  const shadow = (a: StageActor) => <ellipse key={`sh${a.id}`} cx={a.x + (sunny ? a.h * 0.16 : 0)} cy={a.y + 4} rx={a.h * (sunny ? 0.3 : 0.22)} ry={a.h * 0.028} fill="#2e2a52" opacity={sunny ? 0.3 : 0.24} filter="url(#pp-blur)"/>;
  const roof = spec.set === "rooftop";
  const setGrade = roof ? ROOF_GRADE[grade] : (time === "july" || time === "burst" ? ROOF_GRADE[time] : {mul: "#fff", mulA: 0, filter: "none"});
  const mouthOn = (a: StageActor) => a.talk || (bub !== undefined && a.id === speaker?.id && g >= bubAt);

  // bubble placement: the tail tip is (bub.x, bub.y); the body sits above it
  let bubbleNode: React.ReactNode = null;
  if (bub && speaker) {
    const bb = bubbleBox(bubText, bub.size ?? 60);
    const tx = bub.x ?? speaker.x - speaker.h * 0.05, ty = (bub.y ?? speaker.y - speaker.h * 1.05) - (speaker.pose === "cheer" ? 24 : 0);
    const left = Math.min(SAFE.x1 - bb.w, Math.max(SAFE.x0, tx - bb.w * 0.62));
    let top = Math.max(SAFE.y0, ty - 40 - bb.h - 26);
    if (left + bb.w > BUG.x0 && top < BUG.y1) top = BUG.y1 + 8;
    bubbleNode = <Bubble f={g} at={bubAt} tx={tx} ty={ty} lines={bb.lines} w={bb.w} h={bb.h} px={bb.px} left={left} top={top}/>;
  }

  return (
    <AbsoluteFill style={{background: "#EFE6D2", opacity: eo(prog(f, 0, 6))}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <PropDefs/><PostcardDefs/>
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540) translate(${dx} ${dy})`}>
          <g style={{filter: setGrade.filter}}>
            {roof && <RoofBack f={g} time={grade} rain={spells ? wet : !!spec.rain} camX={camX} camY={camY}/>}
            {spec.set === "home" && <HomeSet f={g} camX={camX}/>}
            {spec.set === "street" && <StreetSet f={g} camX={camX}/>}
            {spec.set === "void" && <VoidSet f={g} camX={camX}/>}
            {spec.set === "beach" && <BeachSet f={g} camX={camX}/>}
            {spec.set === "himalaya" && <HimalayaSet f={g} dur={dur} camX={camX}/>}
            {spec.set === "field" && <FieldSet f={g} dur={dur} camX={camX} sky={spec.sky}/>}
            {!roof && setGrade.mulA > 0 && <rect x="-100" y="-100" width={W + 200} height={H + 200} fill={setGrade.mul} opacity={setGrade.mulA} style={{mixBlendMode: "multiply"}}/>}
          </g>
          {props.map((p, i) => !p.front && propNode(p, i))}
          {actors.map(shadow)}
          <g style={{filter: ACTOR_GRADE[grade]}}>
            {order.map(({a, i}) => {
              const t0 = actorAt[i], k = a.enter ? popK(g, t0, 16) : 1;
              if (g < t0 || k <= 0.001) return null;
              if (a.who === "farmer") return <g key={a.id} transform={popAbout(a.x, a.y, k)}><g transform={`translate(${a.x} ${a.y}) scale(${(a.flip ? -1 : 1) * (a.h / FARMER_H)} ${a.h / FARMER_H})`}><Farmer f={g} id={`f${i}`} pose={(a.pose ?? "idle") as FarmerPose} talk={mouthOn(a)}/></g></g>;
              const raw = (a.pose ?? "idle") as GirlPose, pose: GirlPose = raw === "idle" && sunny && roof ? "shade" : raw;
              return <g key={a.id} transform={popAbout(a.x, a.y, k)}><g transform={`translate(${a.x} ${a.y}) scale(${(a.flip ? -1 : 1) * (a.h / 560)} ${a.h / 560})`}><Girl f={g} id={`g${i}`} pose={pose} talk={mouthOn(a)}/></g></g>;
            })}
          </g>
          {props.map((p, i) => p.front && propNode(p, i))}
          {spec.belt && <Belt f={g} t0={beltAt}/>}
          {spells && rainAmt > 0.01 && <g opacity={rainAmt}><Rain f={g} heavy/></g>}
          {!spells && spec.rain && <Rain f={g} heavy={time === "burst"}/>}
          {flash > 0.01 && <rect x="-100" y="-100" width={W + 200} height={H + 200} fill="#fff3cc" opacity={0.62 * flash} style={{mixBlendMode: "screen"}}/>}
          {spec.thunder && <Lightning f={g}/>}
        </g>
      </svg>
      <PaperFinish id="stpf" grain={0.5} vignette={time === "burst" ? 0.5 : 0.36}/>
      {pills.map((p, i) => (f >= pillAt[i] ? <Pill key={i} x={p.x} y={p.y} text={pillText[i]} a={eo(prog(f, pillAt[i], 14))}/> : null))}
      {cards.map((c) => <NumberCard key={c.i} f={f} at={c.t0} x={c.cx} y={c.cy} w={c.bx.w} h={c.bx.h} value={c.value} decimals={c.dec} prefix={c.prefix} suffix={c.suffix} unit={c.unit}
        words={c.words} size={c.size} caption={c.b.caption} tone={toneFor(c.suffix, c.i)}/>)}
      {bubbleNode}
    </AbsoluteFill>
  );
};
