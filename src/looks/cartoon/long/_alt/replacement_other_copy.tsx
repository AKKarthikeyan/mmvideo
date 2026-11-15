// Scene kind "replacement": why 2.1 is the magic number. Two parents (pictograms) are replaced by two children, plus a sliver of a
// third child (the extra 0.1), and the 2.1 line is drawn right across the screen. The people are drawn here in flat cartoon style
// (cast.tsx is not used). 2, 2, 0.1 and 2.1 are the numbers of the definition itself, not survey figures, so they are constants;
// each is printed only from the reveal frame of its key.
//
// spec = {
//   parents?: string   // reveal key of the two parents and the "2 parents" tile            default "parents"
//   kids?:    string   // reveal key of the two children and the "2 children" tile           default "kids"
//   extra?:   string   // reveal key of the "+" and the sliver of a child with "0.1"        default "extra"
//   line?:    string   // reveal key of the 2.1 line sweeping across the screen and its badge default "line"
//   below?:   string   // OPTIONAL reveal key of the "stay below it ..." note; nothing is drawn without it
//   kicker?: string = "THE MAGIC NUMBER";  parentsLabel? = "parents";  kidsLabel? = "children";  extraLabel? = "extra";
//   extraNote?: string  // optional small note under the 0.1 tile (e.g. "covers children who don't survive to adulthood"); none by default
//   lineLabel? = "replacement";  belowText? = "Stay below it long enough and the population shrinks"
// }
// Keys may come in any order of the narration; the arrow between parents and children shows once both groups are on screen.
import React from "react";
import {random} from "remotion";
import {C} from "../../palette";
import {Badge, Num, Pill, ROUND, SANS, ease, pop} from "../../ui";
import {shown} from "../../../shared/lock";
import type {LookNum} from "../../../shared/types";
import {H, W, type SceneProps} from "../contract";

const PARENTS = 2, KIDS = 2, EXTRA = 0.1;
const REPL = KIDS + EXTRA;   // 2.1

export type ReplacementSpec = {
  parents?: string; kids?: string; extra?: string; line?: string; below?: string;
  kicker?: string; parentsLabel?: string; kidsLabel?: string; extraLabel?: string; extraNote?: string; lineLabel?: string; belowText?: string;
};

const mkNum = (text: string, value: number, lockF: number): LookNum => ({
  text, qual: "", sign: "", prefix: "", digits: text, unit: "", value, scale: 1, grouping: "none",
  decimals: (text.split(".")[1] ?? "").length, glyphs: [...text], role: "big", lockF, spokenF: lockF, lockHow: "spoken",
});

// ---- people ---------------------------------------------------------------------------------------------------------------
type Kind = "mother" | "father" | "girl" | "boy";
const KIND: Record<Kind, {adult: boolean; H: number; skin: string; top: string; bottom: string; hair: string}> = {
  mother: {adult: true, H: 424, skin: C.skin, top: C.red, bottom: C.red, hair: C.brown},
  father: {adult: true, H: 396, skin: C.skinDark, top: C.royal, bottom: C.royalDark, hair: C.moustache},
  girl: {adult: false, H: 306, skin: C.skin, top: C.orange, bottom: C.orange, hair: C.brown},
  boy: {adult: false, H: 306, skin: C.skinDark, top: C.green, bottom: C.royalDark, hair: C.moustache},
};
const blinkAt = (f: number, seed: number) => {
  const p = 96 + Math.floor(random(`pb${seed}`) * 40), k = (f + Math.floor(random(`po${seed}`) * p)) % p;
  return k < 4;
};
const GHOST = "rgba(255,255,255,0.72)";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type ArmCfg = {sx: number; sy: number; cx: number; cy: number; ex: number; ey: number; ucx: number; ucy: number; uex: number; uey: number; w: number; hand: number};
const ADULT_ARM: ArmCfg = {sx: 56, sy: -240, cx: 96, cy: -204, ex: 90, ey: -148, ucx: 118, ucy: -290, uex: 106, uey: -352, w: 30, hand: 21};
const KID_ARM: ArmCfg = {sx: 38, sy: -172, cx: 70, cy: -146, ex: 64, ey: -106, ucx: 96, ucy: -210, uex: 92, uey: -268, w: 22, hand: 16};

const Body: React.FC<{kind: Kind; f: number; seed: number; ghost: boolean; up: number; tint?: string}> = ({kind, f, seed, ghost: ghostIn, up, tint}) => {
  const K = KIND[kind], blink = blinkAt(f, seed), solid = !!tint, ghost = ghostIn || solid;   // ghost: no face, arms or details; tint: a solid colour instead of the dashed outline
  const ST = ghostIn ? {stroke: C.ink, strokeWidth: 7, strokeDasharray: "15 11", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, opacity: 0.8}
    : {stroke: C.ink, strokeWidth: 8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  const P = (fill: string) => ({fill: tint ?? (ghostIn ? GHOST : fill), ...ST});
  const arm = (side: -1 | 1, a: ArmCfg, col: string, u: number) => {
    if (ghost) return null;
    const wave = Math.sin(f / 2.3 + seed) * 9 * u;
    const ex = side * lerp(a.ex, a.uex, u) + wave * side, ey = lerp(a.ey, a.uey, u) + Math.cos(f / 2.3 + seed) * 5 * u, cx = side * lerp(a.cx, a.ucx, u), cy = lerp(a.cy, a.ucy, u);
    const d = `M ${side * a.sx} ${a.sy} Q ${cx} ${cy} ${ex} ${ey}`;
    return <g key={side}>
      <path d={d} fill="none" stroke={C.ink} strokeWidth={a.w + 16} strokeLinecap="round"/>
      <path d={d} fill="none" stroke={col} strokeWidth={a.w} strokeLinecap="round"/>
      <circle cx={ex} cy={ey} r={a.hand} fill={K.skin} stroke={C.ink} strokeWidth={7}/>
    </g>;
  };
  // face: dot eyes, little brows on the adults, a smile (open grin on the children while they cheer)
  const face = (cy: number, dx: number, er: number, my: number, mw: number, sm: number, brows: boolean) => ghost ? null : <g>
    <ellipse cx={-dx - 16} cy={cy + 26} rx={13} ry={8} fill={C.red} opacity={0.22}/><ellipse cx={dx + 16} cy={cy + 26} rx={13} ry={8} fill={C.red} opacity={0.22}/>
    {blink ? <g stroke={C.ink} strokeWidth={6} strokeLinecap="round"><line x1={-dx - er} y1={cy} x2={-dx + er} y2={cy}/><line x1={dx - er} y1={cy} x2={dx + er} y2={cy}/></g>
      : <g><circle cx={-dx} cy={cy} r={er} fill={C.ink}/><circle cx={dx} cy={cy} r={er} fill={C.ink}/>
        <circle cx={-dx - 2.5} cy={cy - 3} r={er * 0.3} fill={C.white}/><circle cx={dx - 2.5} cy={cy - 3} r={er * 0.3} fill={C.white}/></g>}
    {brows && <g stroke={C.ink} strokeWidth={6} strokeLinecap="round"><line x1={-dx - 12} y1={cy - 24} x2={-dx + 10} y2={cy - 28}/><line x1={dx + 12} y1={cy - 24} x2={dx - 10} y2={cy - 28}/></g>}
    {up > 0.3 ? <path d={`M ${-mw} ${my - 4} Q 0 ${my + sm * 2.4} ${mw} ${my - 4} Z`} fill={C.redDark} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
      : <path d={`M ${-mw} ${my} Q 0 ${my + sm} ${mw} ${my}`} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>}
  </g>;

  if (K.adult) {
    const mother = kind === "mother";
    return <g>
      {mother && <>
        <circle cx={0} cy={-398} r={27} {...P(K.hair)}/>
        <path d="M -68 -326 Q -74 -394 0 -396 Q 74 -394 68 -326 L 78 -230 Q 0 -208 -78 -230 Z" {...P(K.hair)}/>
      </>}
      {mother ? <>
        <rect x={-38} y={-96} width={30} height={86} rx={12} {...P(K.skin)}/><rect x={8} y={-96} width={30} height={86} rx={12} {...P(K.skin)}/>
        <ellipse cx={-28} cy={-8} rx={34} ry={14} {...P(C.cola)}/><ellipse cx={28} cy={-8} rx={34} ry={14} {...P(C.cola)}/>
        <path d="M -52 -262 Q 0 -280 52 -262 L 98 -80 Q 0 -62 -98 -80 Z" {...P(K.top)}/>
        {!ghost && <path d="M -64 -198 Q 0 -184 64 -198" fill="none" stroke={C.yellow} strokeWidth={13} strokeLinecap="round"/>}
      </> : <>
        <rect x={-52} y={-134} width={46} height={124} rx={16} {...P(K.bottom)}/><rect x={6} y={-134} width={46} height={124} rx={16} {...P(K.bottom)}/>
        <ellipse cx={-31} cy={-8} rx={38} ry={15} {...P(C.cola)}/><ellipse cx={31} cy={-8} rx={38} ry={15} {...P(C.cola)}/>
        <rect x={-62} y={-266} width={124} height={150} rx={38} {...P(K.top)}/>
        {!ghost && <><path d="M -24 -264 L 0 -234 L 24 -264 Z" fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
          <line x1={0} y1={-234} x2={0} y2={-126} stroke={C.ink} strokeWidth={5} strokeLinecap="round"/>
          {[-208, -178, -148].map((y) => <circle key={y} cx={0} cy={y} r={5} fill={C.white} stroke={C.ink} strokeWidth={3}/>)}</>}
      </>}
      {arm(-1, ADULT_ARM, K.top, 0)}{arm(1, ADULT_ARM, K.top, up)}
      {!mother && <><circle cx={-64} cy={-318} r={14} {...P(K.skin)}/><circle cx={64} cy={-318} r={14} {...P(K.skin)}/></>}
      <circle cx={0} cy={-322} r={64} {...P(K.skin)}/>
      {mother ? <path d="M -64 -330 Q -60 -392 0 -394 Q 60 -392 64 -330 Q 34 -364 0 -360 Q -34 -364 -64 -330 Z" {...P(K.hair)}/>
        : <path d="M -64 -328 Q -68 -396 0 -396 Q 68 -396 64 -328 Q 44 -358 0 -356 Q -44 -358 -64 -328 Z" {...P(K.hair)}/>}
      {!mother && !ghost && <path d="M -32 -298 Q -14 -318 0 -305 Q 14 -318 32 -298 Q 14 -288 0 -296 Q -14 -288 -32 -298 Z" fill={C.moustache} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>}
      {face(-326, 24, 8, mother ? -292 : -280, 22, 16, true)}
    </g>;
  }
  const girl = kind === "girl";
  return <g>
    {girl && <><circle cx={-78} cy={-244} r={25} {...P(K.hair)}/><circle cx={78} cy={-244} r={25} {...P(K.hair)}/></>}
    {girl ? <>
      <rect x={-27} y={-74} width={23} height={64} rx={10} {...P(K.skin)}/><rect x={4} y={-74} width={23} height={64} rx={10} {...P(K.skin)}/>
      <ellipse cx={-15} cy={-8} rx={26} ry={12} {...P(C.cola)}/><ellipse cx={15} cy={-8} rx={26} ry={12} {...P(C.cola)}/>
      <path d="M -40 -186 Q 0 -200 40 -186 L 72 -68 Q 0 -52 -72 -68 Z" {...P(K.top)}/>
      {!ghost && <path d="M -52 -122 Q 0 -108 52 -122" fill="none" stroke={C.yellow} strokeWidth={11} strokeLinecap="round"/>}
    </> : <>
      <rect x={-34} y={-70} width={26} height={60} rx={10} {...P(K.skin)}/><rect x={8} y={-70} width={26} height={60} rx={10} {...P(K.skin)}/>
      <ellipse cx={-20} cy={-8} rx={30} ry={13} {...P(C.cola)}/><ellipse cx={20} cy={-8} rx={30} ry={13} {...P(C.cola)}/>
      <rect x={-46} y={-102} width={92} height={46} rx={14} {...P(K.bottom)}/>
      <rect x={-46} y={-196} width={92} height={104} rx={26} {...P(K.top)}/>
    </>}
    {arm(-1, KID_ARM, K.top, up)}{arm(1, KID_ARM, K.top, up)}
    <circle cx={0} cy={-242} r={60} {...P(K.skin)}/>
    {girl ? <path d="M -60 -250 Q -58 -308 0 -308 Q 58 -308 60 -250 Q 30 -276 0 -272 Q -30 -276 -60 -250 Z" {...P(K.hair)}/>
      : <path d="M -60 -250 Q -62 -306 -12 -304 Q 4 -322 22 -304 Q 62 -302 60 -250 Q 32 -278 0 -274 Q -32 -278 -60 -250 Z" {...P(K.hair)}/>}
    {face(-246, 22, 7.5, -214, 20, 15, false)}
  </g>;
};

// A person popping in at frame `at` with a squash-and-stretch, a short cheer, then a slow idle breath. `ghost` draws the dashed outline of a
// child and fills only the bottom `slice` of its height in colour: a tenth of a child.
const Person: React.FC<{kind: Kind; x: number; y: number; h: number; f: number; at: number; seed?: number; ghost?: boolean; slice?: number}> = ({kind, x, y, h, f, at, seed = 1, ghost, slice}) => {
  const t = pop(f, at, 170);
  if (t <= 0.001) return null;
  const K = KIND[kind], s = h / K.H;
  const sx = Math.min(1.35, Math.max(0.8, 1 + (1 - t) * 0.4)), sy = t * (1 + 0.012 * Math.sin((f - at) / 8 + seed));
  const up = ease(f, at + 3, at + 9) * (1 - ease(f, at + 30, at + 50));
  const id = `slice-${kind}-${Math.round(x)}`;
  return <g transform={`translate(${x} ${y}) scale(${sx * s} ${sy * s})`}>
    <ellipse cx={0} cy={4} rx={K.adult ? 112 : 84} ry={15} fill={C.shadow}/>
    {slice ? <>
      <Body kind={kind} f={f} seed={seed} ghost up={0}/>
      <clipPath id={id}><rect x={-160} y={-K.H * slice} width={320} height={K.H * slice + 30}/></clipPath>
      <g clipPath={`url(#${id})`}><Body kind={kind} f={f} seed={seed} ghost={false} up={0} tint={C.yellow}/></g>
    </> : <Body kind={kind} f={f} seed={seed} ghost={!!ghost} up={up}/>}
  </g>;
};

// ---- labels -----------------------------------------------------------------------------------------------------------------
const Tile: React.FC<{n: LookNum; word: string; f: number; x: number; y: number; color: string; rot?: number}> = ({n, word, f, x, y, color, rot = -2}) => {
  if (!shown(n, f)) return null;
  const t = pop(f, n.lockF, 190);
  if (t <= 0.001) return null;
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, 0) scale(${t}) rotate(${rot}deg)`, transformOrigin: "50% 0%", display: "flex", alignItems: "baseline", gap: 14,
    background: C.white, border: `8px solid ${C.ink}`, borderRadius: 40, padding: "6px 34px 10px", boxShadow: `0 10px 0 ${C.ink}`, whiteSpace: "nowrap"}}>
    <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: 96, lineHeight: 1, color, letterSpacing: -2, fontFeatureSettings: "'lnum' 1"}}><Num n={n} f={f} where="replacement tile"/></span>
    <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.ink}}>{word}</span>
  </div>;
};

const Cloud: React.FC<{x: number; y: number; s: number; f: number; sp: number}> = ({x, y, s, f, sp}) =>
  <g transform={`translate(${((x + f * sp + 300) % (W + 600)) - 300} ${y}) scale(${s})`} fill={C.white} opacity={0.8}>
    <ellipse cx={0} cy={0} rx={100} ry={30}/><circle cx={-34} cy={-22} r={36}/><circle cx={22} cy={-34} r={44}/><circle cx={64} cy={-14} r={30}/>
  </g>;

export const Scene: React.FC<SceneProps<ReplacementSpec>> = ({f, dur, spec, at}) => {
  const kP = at(spec.parents ?? "parents"), kK = at(spec.kids ?? "kids"), kE = at(spec.extra ?? "extra"), kL = at(spec.line ?? "line");
  const kB = spec.below ? at(spec.below) : -1;
  const FY = 480, HORIZON = 456, LINE_Y = 770;
  const nP = mkNum(String(PARENTS), PARENTS, kP), nK = mkNum(String(KIDS), KIDS, kK), nE = mkNum(EXTRA.toFixed(1), EXTRA, kE), nR = mkNum(REPL.toFixed(1), REPL, kL);
  const camS = 1 + 0.025 * ease(f, 0, Math.max(60, dur));
  const lineP = ease(f, kL, kL + 18);
  const arrowAt = Math.max(kP, kK) + 3, plusAt = kE;
  const arrowT = pop(f, arrowAt, 170), plusT = pop(f, plusAt, 190);
  const AX = 360, BX = 940, CX = 1380;   // group centres: parents, children, the extra
  return <div style={{position: "absolute", inset: 0, background: C.sky, overflow: "hidden"}}>
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${camS})`, transformOrigin: "50% 50%"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
        <defs><clipPath id="rp-line"><rect x={0} y={0} width={W * lineP} height={H}/></clipPath></defs>
        <Cloud x={560} y={190} s={1.2} f={f} sp={0.22}/><Cloud x={1280} y={110} s={0.9} f={f} sp={0.16}/><Cloud x={1650} y={300} s={1.1} f={f} sp={0.28}/><Cloud x={80} y={330} s={0.8} f={f} sp={0.12}/>
        {/* ground */}
        <rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill={C.wall}/>
        <rect x={0} y={HORIZON} width={W} height={26} fill={C.wallLow}/>
        <line x1={0} x2={W} y1={HORIZON} y2={HORIZON} stroke={C.ink} strokeWidth={8}/>
        {[AX, BX, CX].map((x) => <ellipse key={x} cx={x} cy={FY + 6} rx={x === BX ? 210 : 200} ry={26} fill={C.wallLow}/>)}
        {/* parents */}
        <Person kind="mother" x={AX - 92} y={FY} h={316} f={f} at={kP} seed={1}/>
        <Person kind="father" x={AX + 92} y={FY} h={308} f={f} at={kP + 3} seed={2}/>
        {/* the arrow: parents are replaced by */}
        {arrowT > 0.001 && <g transform={`translate(${(AX + BX) / 2 - 10} 320) scale(${arrowT})`}>
          <path d="M -64 -28 L 8 -28 L 8 -62 L 72 0 L 8 62 L 8 28 L -64 28 Z" fill={C.yellow} stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/></g>}
        {/* the two children */}
        <Person kind="girl" x={BX - 76} y={FY} h={244} f={f} at={kK} seed={3}/>
        <Person kind="boy" x={BX + 76} y={FY} h={244} f={f} at={kK + 3} seed={4}/>
        {/* + a tenth of a child */}
        {plusT > 0.001 && <g transform={`translate(${(BX + CX) / 2 - 10} 352) scale(${plusT})`} fill={C.ink}>
          <rect x={-50} y={-14} width={100} height={28} rx={12}/><rect x={-14} y={-50} width={28} height={100} rx={12}/></g>}
        <Person kind="girl" x={CX} y={FY} h={244} f={f} at={kE + 2} seed={5} ghost slice={EXTRA}/>
        {/* the 2.1 line, drawn across the screen */}
        <g clipPath="url(#rp-line)">
          <line x1={-30} x2={W + 30} y1={LINE_Y} y2={LINE_Y} stroke={C.ink} strokeWidth={26} strokeLinecap="round" strokeDasharray="44 26" strokeDashoffset={-f * 1.2}/>
          <line x1={-30} x2={W + 30} y1={LINE_Y} y2={LINE_Y} stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeDasharray="44 26" strokeDashoffset={-f * 1.2}/>
        </g>
      </svg>

      <Tile n={nP} word={spec.parentsLabel ?? "parents"} f={f} x={AX} y={FY + 36} color={C.royal}/>
      <Tile n={nK} word={spec.kidsLabel ?? "children"} f={f} x={BX} y={FY + 36} color={C.orangeDark} rot={2}/>
      <Tile n={nE} word={spec.extraLabel ?? "extra"} f={f} x={CX} y={FY + 36} color={C.redDark}/>
      {spec.extraNote && shown(nE, f) && <div style={{position: "absolute", left: CX + 150, top: FY - 250, width: 290, textAlign: "left", fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.16, color: C.ink,
        background: C.white, border: `6px solid ${C.ink}`, borderRadius: 24, padding: "10px 22px 12px", boxShadow: `0 8px 0 ${C.ink}`, transform: `scale(${pop(f, kE + 8, 200)}) rotate(2deg)`, transformOrigin: "0% 100%"}}>{spec.extraNote}</div>}

      {/* the 2.1 badge on the line, with its name */}
      <div style={{position: "absolute", left: 1540, top: LINE_Y, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 26}}>
        <div style={{opacity: ease(f, kL + 10, kL + 18), transform: `scale(${pop(f, kL + 10, 200)}) rotate(-2deg)`, transformOrigin: "100% 50%", background: C.white, border: `7px solid ${C.ink}`, borderRadius: 999, padding: "8px 34px 10px",
          boxShadow: `0 8px 0 ${C.ink}`, fontFamily: SANS, fontWeight: 900, fontSize: 38, color: C.ink, whiteSpace: "nowrap", letterSpacing: 0.5}}>{spec.lineLabel ?? "replacement"}</div>
        <Badge n={nR} f={f} color={C.redDark} size={150} rot={2} at={kL + 6}/>
      </div>

      {spec.below && f >= kB && <div style={{position: "absolute", left: 96, top: LINE_Y + 46, display: "flex", alignItems: "center", gap: 20, transform: `scale(${pop(f, kB, 200)})`, transformOrigin: "0% 50%"}}>
        <svg width={64} height={72} viewBox="0 0 64 72"><path d="M 10 2 L 54 2 L 54 32 L 62 32 L 32 70 L 2 32 L 10 32 Z" fill={C.red} stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/></svg>
        <div style={{background: C.white, border: `7px solid ${C.ink}`, borderRadius: 30, padding: "8px 28px 10px", boxShadow: `0 8px 0 ${C.ink}`, fontFamily: ROUND, fontWeight: 800, fontSize: 38, color: C.ink, whiteSpace: "nowrap", letterSpacing: -0.5}}>{spec.belowText ?? "Stay below it long enough and the population shrinks"}</div>
      </div>}
    </div>
    <div style={{position: "absolute", left: 96, top: 60}}><Pill text={spec.kicker ?? "THE MAGIC NUMBER"} f={f} at={2} dot={C.red} size={34}/></div>
  </div>;
};
