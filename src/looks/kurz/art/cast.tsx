// KURZ look, the cast (art builder, 29 Oct 2026): postmaster, vet, two farmers, trader, official and a crowd. Original figures drawn in
// code: capsule limbs, round heads, dot eyes, no mouth. Each body part has a lit half and a shade half (light from the upper left),
// and a small idle motion (breath, weight shift, head tilt, blink). Units: feet at y 0, standing height 1000, facing +x.
import React from "react";
import {Lit, P, ell, pulse, rng, rr, useArt} from "./base";

export type Who = "postmaster" | "vet" | "farmer" | "farmer2" | "trader" | "official";
export type Pose = "idle" | "present" | "refuse" | "raise";

type Look = {
  skin: string; hair: string; hairStyle: "short" | "part" | "cap" | "wrap" | "grey";
  top: "shirt" | "banian" | "coat" | "suit" | "khaki"; topC: string; sleeve: "half" | "full" | "none";
  lower: "trousers" | "dhoti" | "lungi"; lowerC: string; border?: string; shoes: string;
  stache?: string; specs?: boolean; towel?: string; bag?: boolean; steth?: boolean; ledger?: boolean; stripes?: string; tie?: string; folder?: boolean;
  belly?: number; inner?: string;
};

export const LOOKS: Record<Who, Look> = {
  postmaster: {skin: "#B07047", hair: "#1E1A2E", hairStyle: "cap", top: "khaki", topC: "#C9A86A", sleeve: "half", lower: "trousers", lowerC: "#B8965A",
    shoes: "#3B2A22", stache: "#1E1A2E", bag: true},
  vet: {skin: "#BC7C52", hair: "#232036", hairStyle: "part", top: "coat", topC: "#F2F4FA", sleeve: "full", lower: "trousers", lowerC: "#3A4060",
    shoes: "#2A2226", specs: true, steth: true, inner: "#7FA6D9"},
  farmer: {skin: "#9E6040", hair: "#1C1828", hairStyle: "short", top: "shirt", topC: "#F1E7D2", sleeve: "half", lower: "dhoti", lowerC: "#F6F1E4",
    border: "#D9822B", shoes: "#5A3A28", stache: "#1C1828", towel: "#D2553A"},
  farmer2: {skin: "#8F5636", hair: "#D8D2C8", hairStyle: "wrap", top: "banian", topC: "#F5F2EA", sleeve: "none", lower: "lungi", lowerC: "#2F6F8F",
    shoes: "#5A3A28", stache: "#D8D2C8", towel: "#E8C35E"},
  trader: {skin: "#B67650", hair: "#1E1A2E", hairStyle: "short", top: "shirt", topC: "#E7B4A6", sleeve: "half", lower: "trousers", lowerC: "#3C3350",
    shoes: "#2A2226", stache: "#1E1A2E", ledger: true, stripes: "#B9675E", belly: 1},
  official: {skin: "#B57A55", hair: "#9B98A8", hairStyle: "grey", top: "suit", topC: "#2C3556", sleeve: "full", lower: "trousers", lowerC: "#2C3556",
    shoes: "#17141E", specs: true, tie: "#8E2F3E", folder: true, inner: "#EEF1F8"},
};

// Arm: shoulder -> elbow -> wrist with absolute angles (0 = straight down, positive swings toward +x).
const arm = (sx: number, sy: number, a1: number, a2: number, l1 = 170, l2 = 160) => {
  const r1 = (a1 * Math.PI) / 180, r2 = (a2 * Math.PI) / 180;
  const ex = sx + Math.sin(r1) * l1, ey = sy + Math.cos(r1) * l1, wx = ex + Math.sin(r2) * l2, wy = ey + Math.cos(r2) * l2;
  return {ex, ey, wx, wy};
};

const Limb: React.FC<{x0: number; y0: number; x1: number; y1: number; w: number; c: string; sh: number}> = ({x0, y0, x1, y1, w, c, sh}) => {
  const {T} = useArt();
  return <g>
    <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={T(c)} strokeWidth={w} strokeLinecap="round"/>
    <line x1={x0 + sh * w * 0.24} y1={y0} x2={x1 + sh * w * 0.24} y2={y1} stroke={T(mixShade(c))} strokeWidth={w * 0.5} strokeLinecap="round" opacity={0.85}/>
  </g>;
};
const mixShade = (c: string) => {
  // local shade without importing to keep Limb cheap
  const n = parseInt(c.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, t = 0.28;
  const h = (v: number, w: number) => Math.round(v + (w - v) * t).toString(16).padStart(2, "0");
  return `#${h(r, 0x1B)}${h(g, 0x16)}${h(b, 0x50)}`;
};

export const Person: React.FC<{who: Who; look?: Partial<Look>; x: number; y: number; h: number; f: number; flip?: boolean; pose?: Pose; seed?: number; poseT?: number}> =
  ({who, look, x, y, h, f, flip, pose = "idle", seed = 0, poseT = 1}) => {
  const L: Look = {...LOOKS[who], ...look};
  const {T} = useArt();
  const sd = flip ? -1 : 1;                    // shade side in local coords, so the light stays on the screen's left
  const s = h / 1000;
  const breath = Math.sin(f / 38 + seed * 1.3) * 5, sway = Math.sin(f / 97 + seed * 2.1) * 0.7;
  const tilt = Math.sin(f / 71 + seed) * 2.4 + (pose === "refuse" ? -6 + Math.sin(f / 8 + seed) * 3.5 * poseT : 0);
  const blink = 1 - 0.92 * pulse(f, 157 + seed * 11, 2.4, seed * 37);
  const lean = pose === "refuse" ? -3 * poseT : pose === "present" ? 2 * poseT : 0;
  // arm angles
  const idleA = Math.sin(f / 53 + seed) * 3;
  let fa1 = 8 + idleA, fa2 = 14 + idleA, ba1 = -6 - idleA, ba2 = 2 - idleA;
  const ledgerFront = !!L.ledger && pose === "refuse";
  if (L.ledger && !ledgerFront) { ba1 = 16; ba2 = 96; }  // ledger tucked against the chest
  if (ledgerFront) { fa1 = 18; fa2 = 100; }
  if (L.folder) { ba1 = 10; ba2 = 80; }
  if (pose === "present") { const p = poseT; fa1 = fa1 + (68 - fa1) * p + Math.sin(f / 30 + seed) * 3 * p; fa2 = fa2 + (100 - fa2) * p + Math.sin(f / 26 + seed) * 5 * p; }
  if (pose === "raise") { const p = poseT; fa1 = fa1 + (150 - fa1) * p; fa2 = fa2 + (170 - fa2) * p + Math.sin(f / 9 + seed) * 6 * p; }
  if (pose === "refuse") { const p = poseT; ba1 = ba1 + (-78 - ba1) * p; ba2 = ba2 + (-150 - ba2) * p + Math.sin(f / 7 + seed) * 10 * p; }
  const sleeveC = L.top === "banian" ? L.skin : L.topC;
  const foreC = L.sleeve === "full" ? L.topC : L.skin;
  const SH = {fx: 58, fy: -770, bx: -44, by: -772};
  const fA = arm(SH.fx, SH.fy, fa1, fa2), bA = arm(SH.bx, SH.by, ba1, ba2);
  const torso = rr(-116, -812, 242, 376, 92);
  const coatD = rr(-124, -812, 262, 580, 76);
  const dhotiD = "M -100 -500 L 108 -500 L 126 -36 Q 12 -14 -114 -36 Z";
  const ArmDraw = ({A, sx, sy, back}: {A: ReturnType<typeof arm>; sx: number; sy: number; back?: boolean}) => {
    const k = back ? 0.22 : 0;
    const c1 = k ? mixShade(sleeveC) : sleeveC, c2 = k ? mixShade(foreC) : foreC, ch = k ? mixShade(L.skin) : L.skin;
    const sleeveEnd = L.sleeve === "half" ? {x: sx + (A.ex - sx) * 0.6, y: sy + (A.ey - sy) * 0.6} : {x: A.ex, y: A.ey};
    return <g>
      <Limb x0={sx} y0={sy} x1={A.ex} y1={A.ey} w={64} c={L.sleeve === "none" ? ch : (L.sleeve === "half" ? ch : c1)} sh={sd}/>
      {L.sleeve === "half" && <Limb x0={sx} y0={sy} x1={sleeveEnd.x} y1={sleeveEnd.y} w={78} c={c1} sh={sd}/>}
      <Limb x0={A.ex} y0={A.ey} x1={A.wx} y1={A.wy} w={58} c={L.sleeve === "full" ? c2 : ch} sh={sd}/>
      <circle cx={A.wx} cy={A.wy} r={30} fill={T(ch)}/>
      <circle cx={A.wx + 8 * sd} cy={A.wy + 6} r={18} fill={T(mixShade(ch))} opacity={0.5}/>
    </g>;
  };
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${sway + lean} 0 0)`}>
    {/* legs and feet */}
    <g>
      <Lit d={rr(-68, -480, 72, 460, 34)} c={shadeMix(L.lower === "trousers" ? L.lowerC : L.skin)} side={sd} cut={-28}/>
      <Lit d={rr(-6, -480, 72, 460, 34)} c={L.lower === "trousers" ? L.lowerC : L.skin} side={sd} cut={28}/>
      <Lit d={ell(-6, -16, 58, 22)} c={shadeMix(L.shoes)} side={sd} cut={10}/>
      <Lit d={ell(52, -16, 58, 22)} c={L.shoes} side={sd} cut={66}/>
    </g>
    {L.lower !== "trousers" && <g>
      <Lit d={dhotiD} c={L.lowerC} side={sd} cut={40} cy={-260} tilt={0.05} rim={6}/>
      {L.lower === "lungi" ? <g>{[-380, -300, -220, -140].map((yy) => <path key={yy} d={`M -110 ${yy} L 124 ${yy}`} stroke={T(shadeMix(L.lowerC))} strokeWidth={10} opacity={0.55}/>)}
        {[-60, 0, 60].map((xx) => <path key={xx} d={`M ${xx} -490 L ${xx + 4} -40`} stroke={T(shadeMix(L.lowerC))} strokeWidth={9} opacity={0.45}/>)}</g>
        : [-30, 30, 80].map((xx) => <path key={xx} d={`M ${xx} -470 Q ${xx + 6} -260 ${xx + 12} -50`} stroke={T(shadeMix(L.lowerC))} strokeWidth={6} fill="none" opacity={0.35}/>)}
      {L.border && <path d="M -112 -62 L 124 -62 L 126 -36 Q 12 -14 -114 -36 Z" fill={T(L.border)}/>}
    </g>}
    {/* upper body bobs with the breath */}
    <g transform={`translate(0 ${breath * 0.4})`}>
      <ArmDraw A={bA} sx={SH.bx} sy={SH.by} back/>
      {L.ledger && !ledgerFront && <g transform={`translate(${bA.wx - 10} ${bA.wy - 40}) rotate(-8)`}><Lit d={rr(-20, -70, 150, 110, 10)} c="#9E3B34" side={sd} cut={70}/><rect x={-14} y={-64} width={10} height={98} fill={T("#F3E6C8")}/></g>}
      {L.folder && <g transform={`translate(${bA.wx - 4} ${bA.wy - 30}) rotate(-6)`}><Lit d={rr(-10, -80, 130, 120, 8)} c="#C9A36A" side={sd} cut={60}/></g>}
      {L.top === "coat" ? <Lit d={coatD} c={L.topC} side={sd} cut={40} cy={-500} tilt={0.06} rim={7} k={0.22}/> : <Lit d={torso} c={L.top === "banian" ? L.topC : L.topC} side={sd} cut={34} cy={-620} rim={7} k={0.26}/>}
      {L.belly && <Lit d={ell(66, -560, 62, 96)} c={L.topC} side={sd} cut={80} k={0.26}/>}
      {L.top === "banian" && <path d="M -40 -812 Q 10 -700 70 -812 Z" fill={T(L.skin)}/>}
      {L.stripes && [-60, -20, 20, 60].map((xx) => <path key={xx} d={`M ${xx} -800 L ${xx} -450`} stroke={T(L.stripes!)} strokeWidth={7} opacity={0.5}/>)}
      {L.top === "coat" && <><path d="M 30 -810 L 70 -810 L 54 -640 Z" fill={T(L.inner!)}/><path d="M 52 -560 L 52 -260" stroke={T(mixShade(L.topC))} strokeWidth={5}/>
        <rect x={74} y={-560} width={36} height={50} rx={6} fill={T(mixShade(L.topC))} opacity={0.6}/></>}
      {L.top === "suit" && <><path d="M 14 -812 L 84 -812 L 52 -600 Z" fill={T(L.inner!)}/><path d="M 44 -790 L 60 -790 L 64 -640 L 52 -620 L 40 -640 Z" fill={T(L.tie!)}/>
        <path d="M 14 -812 L 52 -600 L 30 -560 L 0 -800 Z" fill={T(mixShade(L.topC))}/>
        <path d="M -40 -800 L -46 -620" stroke={T("#E8D6A0")} strokeWidth={6}/><rect x={-66} y={-622} width={42} height={56} rx={6} fill={T("#EDEFF5")}/></>}
      {L.top === "khaki" && <><rect x={-70} y={-720} width={56} height={60} rx={8} fill={T(mixShade(L.topC))} opacity={0.55}/><rect x={22} y={-720} width={56} height={60} rx={8} fill={T(mixShade(L.topC))} opacity={0.4}/>
        <rect x={-102} y={-478} width={214} height={30} fill={T("#5A3D28")}/>
        {[-760, -660, -560].map((yy) => <circle key={yy} cx={8} cy={yy} r={7} fill={T("#8A6A3A")}/>)}</>}
      {L.top === "shirt" && !L.stripes && <><path d="M 0 -812 L 40 -760 L 70 -812 Z" fill={T(shadeMix(L.topC))}/>{[-740, -660, -580].map((yy) => <circle key={yy} cx={30} cy={yy} r={6} fill={T(shadeMix(L.topC))}/>)}</>}
      {L.stripes && <rect x={50} y={-740} width={8} height={60} rx={3} fill={T("#2E5BAA")}/>}
      {L.bag && <><path d="M -80 -800 L -50 -808 L 96 -500 L 66 -490 Z" fill={T("#6A4630")}/>
        <Lit d={rr(30, -540, 120, 100, 18)} c="#7A5234" side={sd} cut={92}/><path d="M 30 -540 L 150 -540 L 150 -500 Q 90 -480 30 -500 Z" fill={T("#5E3E28")}/></>}
      {L.towel && <><Lit d="M -92 -812 Q -40 -840 30 -812 L 22 -740 L -20 -560 L -70 -560 L -52 -740 Z" c={L.towel} side={sd} cut={-10} rim={5}/>
        {[-640, -600].map((yy) => <path key={yy} d={`M -66 ${yy} L -22 ${yy}`} stroke={T(mixShade(L.towel!))} strokeWidth={8}/>)}</>}
      {ledgerFront && <g transform={`translate(${fA.wx - 60} ${fA.wy - 50}) rotate(-6)`}><Lit d={rr(-20, -70, 150, 110, 10)} c="#9E3B34" side={sd} cut={70}/><rect x={-14} y={-64} width={10} height={98} fill={T("#F3E6C8")}/></g>}
      <ArmDraw A={fA} sx={SH.fx} sy={SH.fy}/>
      {/* neck and head */}
      <g transform={`rotate(${tilt} 10 -820)`}>
        <rect x={-18} y={-850} width={50} height={50} fill={T(shadeMix(L.skin))}/>
        <Lit d={ell(12, -888, 90)} c={L.skin} side={sd} cut={40} cy={-888} rim={7} k={0.26}/>
        <Lit d={ell(-34, -880, 18, 22)} c={L.skin} side={sd} cut={-30} k={0.3}/>
        <P d={ell(98, -872, 14, 12)} c={shadeMix(L.skin)}/>
        {L.hairStyle === "short" && <P d="M -78 -880 Q -84 -992 14 -984 Q 96 -978 104 -908 Q 60 -942 8 -936 Q -32 -930 -42 -872 Z" c={L.hair}/>}
        {L.hairStyle === "part" && <><P d="M -80 -870 Q -86 -996 14 -986 Q 100 -982 106 -912 Q 30 -960 -10 -944 Q -40 -930 -44 -868 Z" c={L.hair}/><P d="M -70 -900 Q -60 -930 -40 -940 L -36 -900 Z" c="#8C889A"/></>}
        {L.hairStyle === "grey" && <P d="M -78 -870 Q -84 -990 14 -982 Q 96 -978 104 -914 Q 40 -950 0 -940 Q -36 -930 -42 -868 Z" c={L.hair}/>}
        {L.hairStyle === "cap" && <><P d="M -78 -874 Q -84 -940 -40 -950 L -40 -880 Z" c={L.hair}/>
          <Lit d={rr(-76, -1000, 170, 82, 30)} c={L.topC} side={sd} cut={30} rim={5}/><P d="M 70 -934 Q 120 -930 136 -910 L 70 -914 Z" c="#6A5230"/><rect x={-76} y={-936} width={170} height={16} fill={T("#6A5230")}/></>}
        {L.hairStyle === "wrap" && <><P d="M -78 -880 Q -84 -940 -40 -948 L -40 -880 Z" c={L.hair}/>
          <Lit d={ell(12, -962, 98, 46)} c={L.towel ?? "#E8C35E"} side={sd} cut={40} rim={5}/><path d="M -70 -980 Q 10 -930 96 -972" stroke={T(mixShade(L.towel ?? "#E8C35E"))} strokeWidth={8} fill="none"/></>}
        <ellipse cx={42} cy={-892} rx={8} ry={10 * blink} fill={T("#141026")}/>
        <ellipse cx={78} cy={-892} rx={8} ry={10 * blink} fill={T("#141026")}/>
        {L.stache && <P d="M 50 -850 Q 76 -866 104 -850 Q 78 -838 50 -850 Z" c={L.stache}/>}
        {L.specs && <g fill="none" stroke={T("#1A1726")} strokeWidth={5}><circle cx={42} cy={-892} r={19}/><circle cx={82} cy={-892} r={19}/><path d="M 61 -894 L 63 -894 M 23 -894 L -24 -896"/></g>}
      </g>
      {L.steth && <g fill="none" stroke={T("#22202E")} strokeWidth={9} strokeLinecap="round">
        <path d="M -10 -812 Q -26 -700 30 -660 Q 80 -700 76 -812"/><circle cx={30} cy={-640} r={16} fill={T("#B9BFCC")} strokeWidth={6}/></g>}
    </g>
  </g>;
};
const shadeMix = (c: string) => mixShade(c);

// A crowd for the meeting hall: three rows of people facing the blackboard, a few raising hands now and then.
export const Crowd: React.FC<{x: number; y: number; h: number; f: number; seed?: number; faceX?: number}> = ({x, y, h, f, seed = 0, faceX = 820}) => {
  const r = rng(40 + seed);
  const shirts = ["#F1E7D2", "#9CC3E6", "#E7B4A6", "#B8D8B0", "#F2D28A", "#E9E3F4", "#C9A86A", "#F5F2EA", "#A9B4E8"];
  const lowers: [string, "dhoti" | "lungi" | "trousers"][] = [["#F6F1E4", "dhoti"], ["#2F6F8F", "lungi"], ["#3C3350", "trousers"], ["#6B4A7A", "lungi"], ["#F6F1E4", "dhoti"]];
  const skins = ["#9E6040", "#8F5636", "#B07047", "#A86B45", "#BC7C52"];
  const towels = ["#D2553A", "#E8C35E", "#2EC4B6", undefined, undefined];
  const rows = [{n: 6, sc: 0.78, dy: -150, sp: 205, off: 0}, {n: 5, sc: 0.88, dy: -78, sp: 236, off: 0.5}, {n: 4, sc: 1, dy: 0, sp: 320, off: 0}];
  const people: React.ReactNode[] = [];
  let k = 0;
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const px = x + (i - (row.n - 1) / 2) * row.sp + (r() - 0.5) * 40, py = y + row.dy, ph = h * row.sc * (0.92 + r() * 0.12);
      const lw = lowers[Math.floor(r() * lowers.length)], hs = (["short", "short", "wrap", "grey", "part"] as const)[Math.floor(r() * 5)];
      const look: Partial<Look> = {skin: skins[Math.floor(r() * skins.length)], topC: shirts[Math.floor(r() * shirts.length)], top: r() < 0.25 ? "banian" : "shirt",
        sleeve: "half", lower: lw[1], lowerC: lw[0], border: lw[1] === "dhoti" ? "#C77A2E" : undefined, hairStyle: hs, hair: hs === "grey" ? "#B9B4C2" : "#1C1828",
        towel: towels[Math.floor(r() * towels.length)], stache: r() < 0.6 ? "#1C1828" : undefined, stripes: undefined, ledger: false, bag: false, steth: false, specs: r() < 0.15};
      if (look.top === "banian") { look.sleeve = "none"; look.topC = "#F5F2EA"; }
      const raise = ri < 2 && (k % 4 === 1);
      const rt = raise ? Math.min(1, 1.6 * pulse(f, 260 + k * 23, 40, k * 61)) : 0;
      people.push(<Person key={k} who="farmer" look={look} x={px} y={py} h={ph} f={f} seed={k + seed * 7} flip={px > faceX + 60} pose={rt > 0.02 ? "raise" : "idle"} poseT={rt}/>);
      k++;
    }
  });
  return <g>{people}</g>;
};
