// Look B, Part 2: an adult farmer for the stage scene, in the same style and line weight as the girl (../girl.tsx): side view facing left,
// feet at the origin, 600 units tall, realistic proportions (a head about 1/7.5 of the height), a pagri (turban), khadi shirt, dhoti.
// Poses: idle (looks up at the sky, one hand shading his brow) and sow (walks, broadcasting seed from a cloth pouch in a sweeping arm).
// Everything is a smooth function of f (the 60 fps film passes fractional frames).
import React, {useMemo} from "react";
import {clamp, eio, rng} from "../kit";

export type FarmerPose = "idle" | "sow";
export const FARMER_POSES: FarmerPose[] = ["idle", "sow"];
export const FARMER_H = 600;

const Tube: React.FC<{d: string; w: number; fill: string; line: string; hi?: string}> = ({d, w, fill, line, hi}) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={line} strokeWidth={w + 2.6}/>
    <path d={d} stroke={fill} strokeWidth={w}/>
    {hi && <path d={d} stroke={hi} strokeWidth={w * 0.26} transform={`translate(${-w * 0.2},-1)`} opacity={0.65}/>}
  </g>
);

const SKIN = {L: "#cf9966", M: "#ab6c42", D: "#7d4a2b", line: "#552f1c"};
const SHIRT_LINE = "#6d5a35";
const DIR = (a: number): [number, number] => [-Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)];   // 0 = straight down, positive = forward (left)

/** a hand: palm and four fingers pointing along -x, rotated `a` degrees clockwise. open = flat (shading the brow), cup = open palm up releasing seed. */
const HandF: React.FC<{x: number; y: number; a: number; kind: "flat" | "cup" | "relax" | "grip"}> = ({x, y, a, kind}) => {
  const fing = (ang: number, len: number, w: number, k = 0) => {
    const r = (ang * Math.PI) / 180, mx = -6 - Math.cos(r) * len * 0.55, my = -Math.sin(r) * len * 0.55 + k, ex = -6 - Math.cos(r) * len, ey = -Math.sin(r) * len + k * 1.8;
    return <Tube key={`${ang}-${len}`} d={`M-6,0 Q${mx},${my} ${ex},${ey}`} w={w} fill={SKIN.M} line={SKIN.line}/>;
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(1.28)`}>
      {kind === "flat" && <>{fing(-12, 27, 5.6)}{fing(-3, 31, 5.8)}{fing(6, 30, 5.6)}{fing(15, 24, 5.2)}
        <ellipse cx="-4" cy="0" rx="13" ry="10" fill={SKIN.M} stroke={SKIN.line} strokeWidth="1.3"/>
        <Tube d="M-3,-7 Q-14,-15 -22,-13" w={5.8} fill={SKIN.M} line={SKIN.line}/></>}
      {kind === "cup" && <>{fing(-24, 24, 5.6, -2)}{fing(-10, 29, 5.8, -2)}{fing(4, 28, 5.6, -1)}{fing(18, 22, 5.2)}
        <ellipse cx="-4" cy="0" rx="13" ry="10.5" fill={SKIN.M} stroke={SKIN.line} strokeWidth="1.3"/>
        <Tube d="M-3,-8 Q-14,-20 -24,-22" w={5.8} fill={SKIN.M} line={SKIN.line}/></>}
      {kind === "relax" && <>
        <ellipse cx="-4" cy="0" rx="11.5" ry="9" fill={SKIN.M} stroke={SKIN.line} strokeWidth="1.3"/>
        {fing(-8, 21, 5.2, 3)}{fing(0, 24, 5.4, 4)}{fing(8, 23, 5.2, 4)}{fing(16, 18, 4.8, 3)}</>}
      {kind === "grip" && <>
        <ellipse cx="-3" cy="0" rx="12" ry="10" fill={SKIN.M} stroke={SKIN.line} strokeWidth="1.3"/>
        <Tube d="M-8,-6 Q-18,-9 -20,0 Q-18,7 -8,6" w={5.4} fill={SKIN.M} line={SKIN.line}/><Tube d="M-6,-1 Q-15,-3 -16,2" w={5.2} fill={SKIN.D} line={SKIN.line}/></>}
    </g>
  );
};

/** the arm's joints for a swing angle: upper arm angle a1 from straight down (positive = forward), forearm angle a2 (same measure) */
const armJoints = (S: [number, number], a1: number, a2: number, lu = 118, lf = 104) => {
  const d1 = DIR(a1), d2 = DIR(a2), E: [number, number] = [S[0] + lu * d1[0], S[1] + lu * d1[1]];
  return {E, W: [E[0] + lf * d2[0], E[1] + lf * d2[1]] as [number, number], a2};
};
const SOW_P = 46, REL = 0.7, SEED_LIFE = 36, SEEDS = 30;

export const Farmer: React.FC<{f: number; id?: string; pose?: FarmerPose; talk?: boolean}> = ({f, id = "fm", pose = "idle", talk = false}) => {
  const sow = pose === "sow", idle = !sow;
  const breathe = 1 + 0.0032 * Math.sin(f / 15);
  const u = ((f / SOW_P) % 1 + 1) % 1;
  // sow: draw the arm back, a fast forward sweep (release at u = REL), a follow-through and the return
  const swingAt = (uu: number) => {
    const back = eio(clamp(uu / 0.46)), fwd = eio(clamp((uu - 0.46) / 0.24)), ret = eio(clamp((uu - REL) / (1 - REL)));
    const a1 = uu < 0.46 ? -6 - 28 * back : uu < REL ? -34 + 96 * fwd : 62 + 8 * Math.sin(Math.PI * ret) - 68 * ret;
    const a2 = uu < 0.46 ? a1 + 28 + 52 * back : uu < REL ? a1 + (1 - fwd) * 80 + 4 : a1 + 4 + 24 * ret;
    return {a1, a2, lean: -3 - 5 * (uu < 0.46 ? back : 1 - ret * 0.5) - 3 * fwd * (1 - ret)};
  };
  const swing = swingAt(u);
  const S: [number, number] = [-2, -470];
  const arm = armJoints(S, swing.a1, swing.a2);
  // idle: elbow out and up, the hand flat above the eyes
  const idleE: [number, number] = [-94, -498], idleW: [number, number] = [-52, -566];
  const E = sow ? arm.E : idleE, Wr = sow ? arm.W : idleW;
  const handA = sow ? clamp(swing.a2 - 90, -80, 70) : -6;
  const lean = sow ? swing.lean : 0.6 * Math.sin(f / 60);
  const headTilt = sow ? -5 + (u < 0.46 ? 0 : 3) : 17 + 1.6 * Math.sin(f / 48);
  const step = sow ? Math.sin((f / SOW_P) * Math.PI * 2) : 0;       // the walking sway (slow: he works in place on a long field)
  const blinkP = (f % 131) / 131, blink = blinkP > 0.95 && blinkP < 0.982 ? 1 - 0.9 * Math.sin((Math.PI * (blinkP - 0.95)) / 0.032) : 1;
  const squint = idle ? 0.62 : 1;
  const mouth = talk ? Math.max(0, Math.sin(f / 2.4) * Math.sin(f / 5.3 + 1)) : 0;
  const sway = idle ? 0.7 * Math.sin(f / 46) : 0.9 * Math.sin(f / 23);
  const clothSway = 2.2 * Math.sin(f / 26);

  // seeds in flight (sow): a fan thrown at the end of each sweep
  const seeds = useMemo(() => { const r = rng(61); return Array.from({length: SEEDS}).map(() => ({vx: -6.5 - r() * 6.5, vy: -3.6 - r() * 3.2, g: 0.62 + r() * 0.22, z: r(), s: 2.4 + r() * 1.6, da: r() * 6.28})); }, []);
  const rel = armJoints([-2, -470], swingAt(REL).a1, swingAt(REL).a2).W;
  const e = (((u - REL) % 1) + 1) % 1 * SOW_P;                       // frames since the last release

  return (
    <g transform={`rotate(${sway})`}>
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" x2="1"><stop offset="0" stopColor={SKIN.L}/><stop offset="0.55" stopColor={SKIN.M}/><stop offset="1" stopColor={SKIN.D}/></linearGradient>
        <linearGradient id={`${id}-shirt`} x1="0" x2="1"><stop offset="0" stopColor="#ead9a8"/><stop offset="0.6" stopColor="#c9b57f"/><stop offset="1" stopColor="#a58f5e"/></linearGradient>
        <linearGradient id={`${id}-shirtV`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.14"/><stop offset="0.5" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#3a2c10" stopOpacity="0.22"/></linearGradient>
        <linearGradient id={`${id}-dhoti`} x1="0" x2="1"><stop offset="0" stopColor="#fbf7ea"/><stop offset="0.6" stopColor="#e6dec8"/><stop offset="1" stopColor="#c4baa0"/></linearGradient>
        <linearGradient id={`${id}-turb`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ec6a3a"/><stop offset="0.55" stopColor="#c8401d"/><stop offset="1" stopColor="#8e2612"/></linearGradient>
        <linearGradient id={`${id}-bag`} x1="0" x2="1"><stop offset="0" stopColor="#efe4c6"/><stop offset="1" stopColor="#c2b186"/></linearGradient>
      </defs>

      {/* ---- legs (the weight shifts slowly; shaped calves, a stride when sowing) ---- */}
      {(() => {
        const nT = -6 + step * 4 - (sow ? 4 : 0), nB = -12 + step * 11 - (sow ? 14 : 0), fT = 18 - step * 4 + (sow ? 6 : 0), fB = 26 - step * 9 + (sow ? 16 : 0);
        const calf = (cT: number, cB: number, bulge: number) => `M${cT - 19},-196 C${cT - 21 - bulge},-150 ${cB - 15 - bulge * 0.6},-96 ${cB - 10},-26 L${cB + 10},-26 C${cB + 13},-96 ${cT + 24},-150 ${cT + 19},-196 Z`;
        const foot = (cB: number, fill: string) => <g>
          <path d={`M${cB - 11},-28 L${cB + 12},-28 L${cB + 14},-8 Q${cB + 8},3 ${cB - 8},3 L${cB - 36},3 Q${cB - 44},-5 ${cB - 30},-11 L${cB - 12},-17 Z`} fill={fill} stroke={SKIN.line} strokeWidth="1.3"/>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${cB - 38 + i * 6},-1 l1,-6`} stroke={SKIN.line} strokeWidth="1" opacity="0.5"/>)}
        </g>;
        return <g>
          <path d={calf(fT, fB, 3)} fill={SKIN.D} stroke={SKIN.line} strokeWidth="1.5"/>
          {foot(fB, SKIN.D)}
          <path d={calf(nT, nB, 5)} fill={`url(#${id}-skin)`} stroke={SKIN.line} strokeWidth="1.5"/>
          <path d={`M${nT - 10},-186 C${nT - 12},-150 ${nB - 8},-100 ${nB - 5},-40`} stroke={SKIN.L} strokeWidth="3.2" fill="none" opacity="0.5" strokeLinecap="round"/>
          <path d={`M${nT + 8},-150 C${nT + 10},-120 ${nB + 6},-90 ${nB + 6},-60`} stroke={SKIN.D} strokeWidth="1.6" fill="none" opacity="0.5"/>
          {foot(nB, `url(#${id}-skin)`)}
        </g>;
      })()}

      {/* ---- upper body, leaning from the hip ---- */}
      <g transform={`rotate(${lean} 0 -300)`}>
        {/* far arm, behind the body */}
        {sow ? (
          <Tube d={`M18,-462 Q26,-420 ${-10 + 6 * Math.sin(f / 30)},-360 L-26,-346`} w={22} fill={SKIN.D} line={SKIN.line}/>
        ) : (
          <g>
            <Tube d="M18,-462 Q30,-420 30,-380" w={24} fill={`url(#${id}-shirt)`} line={SHIRT_LINE}/>
            <Tube d="M30,-384 Q34,-340 28,-300" w={17} fill={SKIN.D} line={SKIN.line}/>
            <ellipse cx="27" cy="-290" rx="9" ry="14" fill={SKIN.D} stroke={SKIN.line} strokeWidth="1.4"/>
          </g>
        )}

        {/* pagri tail and gamcha end falling behind the shoulder */}
        <g transform={`rotate(${clothSway} 24 -500)`}>
          <path d="M22,-520 C42,-500 46,-440 40,-376 C34,-368 28,-372 26,-380 C30,-430 28,-480 16,-506 Z" fill={`url(#${id}-turb)`} stroke="#6f1d0e" strokeWidth="1.3"/>
          <path d="M30,-500 C36,-450 36,-410 34,-382" stroke="#f3a37e" strokeWidth="1.6" fill="none" opacity="0.6"/>
          <path d="M28,-388 l10,2 M28,-394 l10,2" stroke="#f3d7a8" strokeWidth="2" opacity="0.8"/>
        </g>

        {/* torso: khadi shirt (side view, a little round in the back) */}
        <g transform={`translate(0 -300) scale(1 ${breathe}) translate(0 300)`}>
          <path d="M-9,-512 C-8,-504 -9,-496 -12,-488 L16,-488 C15,-498 13,-506 12,-514 Z" fill={`url(#${id}-skin)`} stroke={SKIN.line} strokeWidth="1.3"/>
          <path d="M-30,-488 C-45,-450 -46,-396 -38,-352 C-36,-330 -35,-312 -34,-292 L38,-292 C38,-322 44,-362 44,-406 C44,-446 36,-474 20,-488 C6,-494 -14,-494 -30,-488 Z"
            fill={`url(#${id}-shirt)`} stroke={SHIRT_LINE} strokeWidth="1.5"/>
          <path d="M-30,-488 C-45,-450 -46,-396 -38,-352 C-36,-330 -35,-312 -34,-292 L38,-292 C38,-322 44,-362 44,-406 C44,-446 36,-474 20,-488 C6,-494 -14,-494 -30,-488 Z" fill={`url(#${id}-shirtV)`}/>
          {/* collar, placket, pocket, folds, patch */}
          <path d="M-14,-490 Q2,-478 18,-490" stroke="#8a7647" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-12,-486 Q-18,-440 -22,-330" stroke="#8a7647" strokeWidth="1.8" fill="none" opacity="0.8"/>
          {[-444, -424, -404, -384].map((y, i) => <circle key={i} cx={-17 - i * 0.6 + (i > 2 ? -1 : 0)} cy={y} r="2.1" fill="#6e5b35"/>)}
          <path d="M-33,-410 L-6,-410 L-6,-372 Q-20,-366 -33,-372 Z" fill="none" stroke="#8a7647" strokeWidth="1.4"/>
          {[[-12, -450, -30, -310], [14, -430, 24, -300], [30, -460, 38, -330]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2 - 4},${(y1 + y2) / 2} ${x2},${y2}`} stroke="#6d5a35" strokeWidth="1.3" fill="none" opacity="0.5"/>)}
          <path d="M18,-380 l12,-5 l-2,13 Z" fill="#9f6c43" opacity="0.8"/><path d="M20,-378 l8,-3" stroke="#e7d6a6" strokeWidth="1" strokeDasharray="2 2"/>
          <path d="M-34,-420 C-38,-390 -34,-352 -34,-330" stroke="#fbf0c8" strokeWidth="2.2" fill="none" opacity="0.5"/>
          <path d="M-35,-296 L40,-296 L40,-290 L-35,-290 Z" fill="#b9a46f" opacity="0.7"/>
        </g>

        {/* waist cloth (madder red) and the dhoti tucked up, kachha style: loose white cloth to mid-calf */}
        <path d="M-38,-318 L40,-318 L41,-296 L-39,-296 Z" fill={`url(#${id}-turb)`} stroke="#6f1d0e" strokeWidth="1.3"/>
        <path d="M-36,-314 Q0,-306 38,-314" stroke="#f3a37e" strokeWidth="1.4" fill="none" opacity="0.7"/>
        <path d="M30,-318 C44,-306 50,-292 46,-262 C42,-256 36,-262 36,-272 C38,-290 34,-304 26,-312 Z" fill={`url(#${id}-turb)`} stroke="#6f1d0e" strokeWidth="1.2"/>
        <g transform={`translate(${step * 3} 0)`}>
          <path d="M-40,-298 C-50,-262 -52,-214 -48,-172 C-30,-130 -4,-122 22,-128 C44,-132 52,-138 54,-142 C54,-216 50,-262 42,-298 Z"
            fill={`url(#${id}-dhoti)`} stroke="#a79d82" strokeWidth="1.4"/>
          <path d="M-40,-298 C-50,-262 -52,-214 -48,-172 C-30,-130 -4,-122 22,-128 C44,-132 52,-138 54,-142 C54,-216 50,-262 42,-298 Z" fill={`url(#${id}-shirtV)`} opacity="0.7"/>
          {[[-30, -290, -38, -140], [-10, -292, -14, -128], [8, -292, 10, -126], [26, -290, 34, -134]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2 + (i % 2 ? 5 : -5)},${(y1 + y2) / 2} ${x2},${y2}`} stroke="#9d9378" strokeWidth="1.5" fill="none" opacity="0.65"/>)}
          <path d="M-47,-146 C-30,-134 -4,-127 22,-132 C42,-135 51,-140 53,-145" stroke="#a79d82" strokeWidth="2" fill="none"/>
          <path d="M-46,-152 Q-20,-140 8,-140" stroke="#fffbee" strokeWidth="1.6" fill="none" opacity="0.8"/>
          <path d="M-8,-300 C-6,-262 -14,-210 -22,-160" stroke="#e8e0c8" strokeWidth="9" fill="none" opacity="0.45"/>
        </g>

        {/* seed pouch (sow): a cotton bag slung on a strap, the far hand holding its mouth */}
        {sow && <g>
          <path d="M16,-488 C-4,-440 -26,-380 -34,-338" stroke="#a89466" strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M16,-488 C-4,-440 -26,-380 -34,-338" stroke="#d7c692" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <g transform={`translate(-40 -318) rotate(${-3 + 4 * Math.sin(f / SOW_P * 6.283)})`}>
            <path d="M-34,0 C-40,40 -34,76 -6,82 C26,82 38,44 30,0 Z" fill={`url(#${id}-bag)`} stroke="#8a7647" strokeWidth="1.6"/>
            <path d="M-36,-2 Q-2,-16 32,-2 Q-2,8 -36,-2 Z" fill="#8c6a3c" stroke="#5e4424" strokeWidth="1.3"/>
            <path d="M-30,6 Q-2,22 26,6" stroke="#7a6aa0" strokeWidth="3" fill="none" opacity="0.8"/>
            <path d="M-24,38 C-22,56 -10,70 8,72" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5"/>
            {Array.from({length: 6}).map((_, i) => <ellipse key={i} cx={-24 + i * 10} cy={-3 + (i % 2) * 2} rx="2.6" ry="1.7" fill="#d7a64a" stroke="#8a5f1c" strokeWidth="0.6"/>)}
          </g>
          <HandF x={-40 + 3 * Math.sin(f / 30)} y={-326} a={-8} kind="grip"/>
        </g>}

        {/* ---- head: the girl's profile, grown up: a stubbled jaw, moustache, a pagri ---- */}
        <g transform={`rotate(${headTilt} 2 -492)`}>
          <g transform="translate(2 -508) scale(0.86) translate(-2 472)">
            <path d="M-22,-556 C-32,-548 -35,-536 -34,-528 L-35,-523 L-43,-510 L-36,-506 L-36,-500 Q-39,-497 -36,-494 Q-38,-490 -34,-489 Q-36,-480 -30,-476 Q-22,-470 -8,-472 L8,-486 C24,-500 34,-525 28,-545 C20,-562 -10,-566 -22,-556 Z"
              fill={`url(#${id}-skin)`} stroke={SKIN.line} strokeWidth="1.5" strokeLinejoin="round"/>
            {/* weathering: cheek, stubble, crow's feet, forehead lines */}
            <ellipse cx="-13" cy="-507" rx="12" ry="8" fill="#c9694a" opacity="0.2"/>
            <path d="M-31,-484 Q-14,-470 6,-484 L5,-498 Q-12,-488 -32,-492 Z" fill="#2a1d16" opacity="0.2"/>
            {Array.from({length: 14}).map((_, i) => <circle key={i} cx={-28 + (i % 7) * 5} cy={-484 + Math.floor(i / 7) * 5 + (i % 3)} r="0.7" fill="#2a1d16" opacity="0.5"/>)}
            <path d="M-17,-527 l7,-3 M-17,-523 l8,0 M-17,-519 l7,3" stroke={SKIN.line} strokeWidth="0.9" opacity="0.55" fill="none"/>
            <path d="M-26,-548 Q-14,-551 -2,-547 M-27,-553 Q-14,-556 0,-552" stroke={SKIN.line} strokeWidth="0.9" opacity="0.4" fill="none"/>
            <path d="M-31,-515 Q-26,-505 -24,-496" stroke={SKIN.line} strokeWidth="1" opacity="0.4" fill="none"/>
            {/* eye */}
            <g transform={`translate(0 -526) scale(1 ${blink * squint}) translate(0 526)`}>
              <path d="M-32,-526 Q-25,-533 -16,-526 Q-24,-521 -32,-526 Z" fill="#f5ecda" stroke="#3a1f12" strokeWidth="1"/>
              <circle cx={idle ? -26 : -27} cy={idle ? -527.5 : -526.4} r="3.4" fill="#26160d"/><circle cx="-27.4" cy={idle ? -528.6 : -527.4} r="1.1" fill="#fff"/>
            </g>
            <path d="M-33,-527.5 Q-25,-535 -15,-527.5" stroke="#1d0f08" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d={idle ? "M-37,-537 Q-25,-546 -12,-538" : "M-36,-538 Q-25,-544 -13,-537"} stroke="#3a3330" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* moustache and mouth */}
            <path d="M-39,-499 Q-33,-504.5 -24,-499.5 Q-16,-496 -8,-500 Q-17,-493 -27,-494 Q-34,-493 -39,-499 Z" fill="#2b2420" stroke="#14100d" strokeWidth="0.8"/>
            {mouth > 0.08
              ? <ellipse cx="-30" cy="-488" rx={4 + mouth} ry={1 + mouth * 3.4} fill="#4d1a14" stroke="#7a352c" strokeWidth="1"/>
              : <path d="M-35,-488 Q-30,-486.5 -25,-488.5" stroke="#6a2f26" strokeWidth="1.7" fill="none" strokeLinecap="round"/>}
            <path d="M-40,-509 q2,2 4.5,0" stroke={SKIN.line} strokeWidth="1" fill="none"/>
            {/* ear */}
            <path d="M3,-518 C-3,-518 -3,-503 3,-501 C9,-500 12,-506 10,-512 C9,-517 6,-518 3,-518 Z" fill={SKIN.M} stroke={SKIN.line} strokeWidth="1.2"/>
            <path d="M3,-512 q3,3 0,7" stroke={SKIN.line} strokeWidth="0.9" fill="none"/>
            {/* greying hair at the nape under the pagri */}
            <path d="M12,-520 C22,-514 28,-504 26,-490 C20,-494 14,-498 10,-506 Z" fill="#46403c" stroke="#1f1a17" strokeWidth="0.8"/>
            <path d="M16,-512 C20,-506 22,-500 22,-494" stroke="#9b958e" strokeWidth="1.2" fill="none" opacity="0.7"/>
            {/* the pagri: wound bands of madder-red cloth */}
            <path d="M-38,-536 C-42,-566 -10,-592 22,-580 C46,-568 48,-530 40,-496 C34,-506 22,-520 8,-528 C-8,-536 -24,-540 -38,-536 Z" fill={`url(#${id}-turb)`} stroke="#6f1d0e" strokeWidth="1.5" strokeLinejoin="round"/>
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-38 + i * 1.5},${-541 - i * 9} C${-12 - i * 2},${-546 - i * 10} ${22 + i * 2},${-540 - i * 9} ${42 - i * 3},${-512 - i * 3}`} stroke={i % 2 ? "#f6b690" : "#7a2010"} strokeWidth={i % 2 ? 1.5 : 1.7} fill="none" opacity="0.8"/>)}
            <path d="M-34,-545 C-32,-562 -14,-580 6,-584" stroke="#ffd6b8" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M-38,-536 C-30,-540 -18,-542 -6,-538 L-6,-532 C-18,-535 -30,-535 -38,-531 Z" fill="#f2e9d0" stroke="#a79d82" strokeWidth="0.9" opacity="0.9"/>
          </g>
        </g>

        {/* ---- near arm: a rolled khadi sleeve and a bare forearm ---- */}
        <g>
          <Tube d={`M${S[0]},${S[1]} Q${(S[0] + E[0]) / 2 - 2},${(S[1] + E[1]) / 2 + 10} ${E[0]},${E[1]}`} w={31} fill={`url(#${id}-shirt)`} line={SHIRT_LINE} hi="#fbf0c8"/>
          <Tube d={`M${E[0] + 1},${E[1]} Q${(E[0] + Wr[0]) / 2 + (idle ? 6 : 0)},${(E[1] + Wr[1]) / 2 - 4} ${Wr[0]},${Wr[1]}`} w={19} fill={`url(#${id}-skin)`} line={SKIN.line} hi={SKIN.L}/>
          {(() => { const dx = Wr[0] - E[0], dy = Wr[1] - E[1], n = Math.hypot(dx, dy) || 1, tx = E[0] + (dx / n) * 8, ty = E[1] + (dy / n) * 8;   // the rolled cuff
            return <path d={`M${tx - dy / n * 17},${ty + dx / n * 17} L${tx + dy / n * 17},${ty - dx / n * 17}`} stroke="#8a7647" strokeWidth="7" strokeLinecap="round" opacity="0.9"/>; })()}
          <HandF x={Wr[0]} y={Wr[1]} a={handA} kind={sow ? "cup" : "flat"}/>
        </g>
      </g>

      {/* ---- seeds in the air ---- */}
      {sow && seeds.map((s, i) => {
        const t = e - s.z * 3, life = SEED_LIFE;
        if (t < 0 || t > life) return null;
        const ground = -4 - s.z * 26, x = rel[0] + s.vx * t * 0.8, yy = rel[1] + s.vy * t + 0.5 * s.g * t * t, y = Math.min(yy, ground);
        const fade = clamp((life - t) / 6) * (yy > ground ? clamp(1 - (yy - ground) / 14) : 1);
        return <ellipse key={i} cx={x} cy={y} rx={s.s * 1.25} ry={s.s * 0.8} transform={`rotate(${(s.da + t * 24) * 57} ${x} ${y})`} fill="#d8a845" stroke="#8a5f1c" strokeWidth="0.7" opacity={fade}/>;
      })}
    </g>
  );
};
