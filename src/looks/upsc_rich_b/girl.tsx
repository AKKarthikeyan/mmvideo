// A girl of about twelve, drawn in code, side view facing left, one hand shading her eyes. Feet at the origin, 560 units tall.
import React from "react";

const Tube: React.FC<{d: string; w: number; fill: string; line: string; hi?: string}> = ({d, w, fill, line, hi}) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={line} strokeWidth={w + 2.6}/>
    <path d={d} stroke={fill} strokeWidth={w}/>
    {hi && <path d={d} stroke={hi} strokeWidth={w * 0.28} transform={`translate(${-w * 0.2},-1)`} opacity={0.7}/>}
  </g>
);

export type GirlPose = "shade" | "idle" | "present" | "point" | "cheer" | "worried" | "write";
export const GIRL_POSES: GirlPose[] = ["shade", "idle", "present", "point", "cheer", "worried", "write"];

// A hand whose fingers point along -x (she faces left); `a` rotates it clockwise in degrees (0 = left, 90 = up, -90 = down).
const Hand: React.FC<{x: number; y: number; a: number; kind: "open" | "point" | "fist" | "relax" | "grip"; skin: string; line: string; hi: string; spread?: number}> = ({x, y, a, kind, skin, line, hi, spread = 0}) => {
  const fing = (ang: number, len: number, w: number, k = 0) => {
    const r = (ang * Math.PI) / 180, bx = -6, by = 0, mx = bx - Math.cos(r) * len * 0.55, my = by - Math.sin(r) * len * 0.55 + k;
    const ex = bx - Math.cos(r) * len, ey = by - Math.sin(r) * len + k * 1.8;
    return <Tube key={`${ang}-${len}`} d={`M${bx},${by} Q${mx},${my} ${ex},${ey}`} w={w} fill={skin} line={line}/>;
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(1.22)`}>
      {kind === "open" && <>
        {fing(-18 - spread, 25, 5.4, -1)}{fing(-6 - spread * 0.4, 29, 5.6)}{fing(6 + spread * 0.4, 28, 5.4)}{fing(18 + spread, 22, 5)}
        <ellipse cx="-4" cy="0" rx="13" ry="10" fill={skin} stroke={line} strokeWidth="1.3"/>
        <Tube d="M-3,-7 Q-14,-17 -24,-17" w={5.6} fill={skin} line={line}/>
        <path d="M-8,-3 q6,3 12,0" stroke={hi} strokeWidth="1.2" fill="none" opacity="0.6"/>
      </>}
      {kind === "point" && <>
        <ellipse cx="-2" cy="1" rx="11" ry="9.5" fill={skin} stroke={line} strokeWidth="1.3"/>
        <Tube d="M-8,-3 Q-24,-4 -40,-3" w={5.6} fill={skin} line={line}/>
        {[3, 7, 11].map((o) => <path key={o} d={`M-12,${o - 2} q-6,2 -9,${o > 5 ? 2 : 0}`} stroke={line} strokeWidth="1.3" fill="none"/>)}
        <Tube d="M-2,-7 Q-10,-12 -16,-8" w={5.4} fill={skin} line={line}/>
      </>}
      {(kind === "fist" || kind === "grip") && <>
        <ellipse cx="-3" cy="0" rx="12" ry="10" fill={skin} stroke={line} strokeWidth="1.3"/>
        {[-6, -1, 4].map((o) => <path key={o} d={`M-10,${o} q-3,3 0,6`} stroke={line} strokeWidth="1.2" fill="none"/>)}
        <ellipse cx="-12" cy="-7" rx="6" ry="4" fill={skin} stroke={line} strokeWidth="1.2"/>
      </>}
      {kind === "relax" && <>
        <ellipse cx="-4" cy="0" rx="11" ry="8.5" fill={skin} stroke={line} strokeWidth="1.3"/>
        {fing(-10, 20, 5, 3)}{fing(-2, 23, 5.2, 4)}{fing(7, 22, 5, 4)}{fing(15, 17, 4.6, 3)}
        <Tube d="M-5,-6 Q-12,-10 -17,-4" w={5.2} fill={skin} line={line}/>
      </>}
    </g>
  );
};

// Arm joints for the near arm in each pose: shoulder s, elbow e, wrist w, hand angle a (degrees) and hand kind.
type ArmDef = {e: [number, number]; w: [number, number]; a: number; kind: "open" | "point" | "fist" | "relax" | "grip"};
const NEAR: Record<Exclude<GirlPose, "shade">, ArmDef> = {
  idle: {e: [-22, -376], w: [-28, -322], a: -90, kind: "relax"},
  present: {e: [-54, -394], w: [-116, -406], a: 6, kind: "open"},
  point: {e: [-46, -426], w: [-120, -470], a: 24, kind: "point"},
  cheer: {e: [-60, -478], w: [-78, -556], a: 98, kind: "open"},
  worried: {e: [-40, -398], w: [-34, -450], a: 70, kind: "fist"},
  write: {e: [-46, -398], w: [-104, -374], a: 14, kind: "grip"},
};

export const Girl: React.FC<{f: number; id?: string; pose?: GirlPose; talk?: boolean}> = ({f, id = "g", pose = "shade", talk = false}) => {
  const breathe = 1 + 0.0035 * Math.sin(f / 14);
  const tiltBase = {shade: -3, idle: -1, present: -1.5, point: -5, cheer: -7, worried: 5, write: 9}[pose];
  const headTilt = tiltBase + 2.2 * Math.sin(f / 52);
  const hop = pose === "cheer" ? -Math.abs(Math.sin(f / 7.5)) * 16 : 0;
  const sway = pose === "cheer" ? 1.4 * Math.sin(f / 15) : 0.5 * Math.sin(f / 44);
  const blinkP = (f % 118) / 118, blink = blinkP > 0.955 && blinkP < 0.985 ? 1 - 0.9 * Math.sin((Math.PI * (blinkP - 0.955)) / 0.03) : 1;
  const mouthOpen = talk ? Math.max(0, Math.sin(f / 2.3) * Math.sin(f / 5.1 + 1)) : 0;
  const worried = pose === "worried";
  const braidSway = 2.2 * Math.sin(f / 31 + 1);
  const handLift = 1.6 * Math.sin(f / 40);
  const skinL = "#d29a6c", skinM = "#b57a50", skinD = "#8a5634", skinLine = "#6e3f26";
  const teal1 = "#47a3a6", teal2 = "#2a7078", tealLine = "#1c4a52";
  const cream1 = "#f3ead6", cream2 = "#cdbfa2";
  const nd = pose === "shade" ? null : NEAR[pose];
  const farUp = pose === "cheer";
  return (
    <g transform={`translate(0 ${hop}) rotate(${sway})`}>
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" x2="1"><stop offset="0" stopColor={skinL}/><stop offset="0.55" stopColor={skinM}/><stop offset="1" stopColor={skinD}/></linearGradient>
        <linearGradient id={`${id}-kurta`} x1="0" x2="1"><stop offset="0" stopColor={teal1}/><stop offset="0.6" stopColor={teal2}/><stop offset="1" stopColor="#1d4f58"/></linearGradient>
        <linearGradient id={`${id}-kurtaV`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.16"/><stop offset="0.5" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#0b2a30" stopOpacity="0.2"/></linearGradient>
        <linearGradient id={`${id}-salwar`} x1="0" x2="1"><stop offset="0" stopColor={cream1}/><stop offset="1" stopColor={cream2}/></linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" x2="1"><stop offset="0" stopColor="#4b3629"/><stop offset="0.5" stopColor="#241912"/><stop offset="1" stopColor="#15100c"/></linearGradient>
      </defs>
      {/* far arm, hanging */}
      {farUp ? (
        <g>
          <Tube d="M26,-438 Q50,-470 54,-496" w={20} fill={`url(#${id}-kurta)`} line={tealLine}/>
          <Tube d="M54,-494 Q62,-532 58,-562" w={14} fill={skinD} line={skinLine}/>
          <Hand x={58} y={-566} a={92} kind="open" skin={skinD} line={skinLine} hi={skinM}/>
        </g>
      ) : (
        <g>
          <Tube d="M26,-438 Q36,-400 34,-372" w={20} fill={`url(#${id}-kurta)`} line={tealLine}/>
          <Tube d="M34,-376 Q34,-336 29,-300" w={14} fill={skinD} line={skinLine}/>
          <ellipse cx="29" cy="-290" rx="8" ry="13" fill={skinD} stroke={skinLine} strokeWidth="1.4"/>
        </g>
      )}
      {/* legs: far then near */}
      <g>
        <path d="M-2,-262 L30,-262 C30,-190 24,-110 22,-34 L2,-34 C2,-110 -2,-190 -2,-262 Z" fill="#d9ccb0" stroke="#9f8f70" strokeWidth="1.3"/>
        <path d="M-22,-262 L14,-262 C14,-190 6,-110 4,-34 L-18,-34 C-18,-110 -22,-190 -22,-262 Z" fill={`url(#${id}-salwar)`} stroke="#a89a7c" strokeWidth="1.3"/>
        {[-150, -112, -78].map((y, i) => <path key={i} d={`M-18,${y} q10,5 20,2`} stroke="#b8a888" strokeWidth="1.3" fill="none" opacity="0.7"/>)}
        {/* ankle gathers */}
        {[-52, -46, -40].map((y, i) => <path key={i} d={`M-18,${y} q11,4 22,0`} stroke="#9f8f70" strokeWidth="1.2" fill="none"/>)}
        {/* feet in simple sandals */}
        <path d="M2,-34 L22,-34 L24,-12 Q22,-4 14,-3 L-4,-3 Q-6,-14 2,-20 Z" fill={skinD} stroke={skinLine} strokeWidth="1.3"/>
        <path d="M-18,-34 L4,-34 L6,-16 Q4,-6 -4,-5 L-36,-5 Q-46,-6 -44,-14 Q-34,-18 -24,-22 Z" fill={`url(#${id}-skin)`} stroke={skinLine} strokeWidth="1.3"/>
        <path d="M-47,-5 L10,-5 L10,2 Q8,4 0,4 L-44,4 Q-50,3 -47,-5 Z" fill="#6b4630" stroke="#3f2818" strokeWidth="1.2"/>
        <path d="M-30,-22 L-6,-8" stroke="#a5683c" strokeWidth="3.4" strokeLinecap="round"/>
      </g>
      {/* braid, drawn behind the torso edge */}
      <g transform={`rotate(${braidSway} 30 -478)`}>
        {Array.from({length: 13}).map((_, i) => {
          const t = i / 12, x = 36 + 9 * Math.sin(t * 3.1) * 0.5 + 6 * t, y = -480 + 190 * t;
          return <ellipse key={i} cx={x} cy={y} rx={10.5 - 3.2 * t} ry={11} fill={i % 2 ? "#1c140f" : "#2d211a"} stroke="#0e0906" strokeWidth="1" transform={`rotate(${i % 2 ? 24 : -24} ${x} ${y})`}/>;
        })}
        <path d="M30,-470 Q44,-400 42,-300" stroke="#5a4333" strokeWidth="1.6" fill="none" opacity="0.6"/>
        <ellipse cx="42" cy="-296" rx="7" ry="5" fill="#c9372f" stroke="#7d1d19" strokeWidth="1"/>
        <path d="M38,-292 q4,24 0,34 M46,-292 q4,22 3,30" stroke="#1c140f" strokeWidth="4" fill="none" strokeLinecap="round"/>
      </g>
      {/* torso + kurta */}
      <g transform={`scale(1 ${breathe})`}>
        <path d="M-8,-482 C-6,-470 -8,-456 -11,-446 L14,-446 C12,-458 11,-470 10,-482 Z" fill={`url(#${id}-skin)`} stroke={skinLine} strokeWidth="1.2"/><path d="M-9,-470 Q2,-460 12,-470 L12,-446 L-11,-446 Z" fill={skinD} opacity="0.45"/>
        <path d="M-36,-446 C-47,-420 -44,-372 -38,-332 C-47,-292 -56,-244 -58,-203 L58,-203 C56,-242 50,-290 42,-332 C42,-372 46,-420 34,-446 C16,-440 -14,-440 -36,-446 Z"
          fill={`url(#${id}-kurta)`} stroke={tealLine} strokeWidth="1.4"/>
        <path d="M-36,-446 C-47,-420 -44,-372 -38,-332 C-47,-292 -56,-244 -58,-203 L58,-203 C56,-242 50,-290 42,-332 C42,-372 46,-420 34,-446 C16,-440 -14,-440 -36,-446 Z" fill={`url(#${id}-kurtaV)`}/>
        {/* neckline + yoke embroidery */}
        <path d="M-14,-446 Q0,-432 15,-446" stroke="#f0c75a" strokeWidth="2.4" fill="none"/>
        <path d="M-20,-440 Q0,-418 22,-440" stroke="#f0c75a" strokeWidth="1.3" fill="none" strokeDasharray="3 4" opacity="0.9"/>
        {/* hem band */}
        <path d="M-54,-203 L54,-203 L53,-214 C20,-208 -20,-208 -53,-214 Z" fill="#e9b640" stroke="#9a6b16" strokeWidth="1.1"/>
        <path d="M-52,-210 C-20,-204 20,-204 52,-210" stroke="#fff3c9" strokeWidth="1" fill="none" strokeDasharray="4 3"/>
        {/* soft folds */}
        {[[-22, -330, -34, -215], [2, -318, 6, -214], [24, -326, 34, -215]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2 - 3},${(y1 + y2) / 2} ${x2},${y2}`} stroke="#164048" strokeWidth="1.3" fill="none" opacity="0.5"/>)}
        <path d="M-30,-400 C-34,-360 -30,-340 -33,-322" stroke="#8fd5d3" strokeWidth="2.2" fill="none" opacity="0.5"/>
      </g>
      {/* head */}
      <g transform={`rotate(${headTilt} 2 -468)`}>
        <g transform="translate(2 -520) scale(0.92) translate(-2 520)">
          <path d="M-22,-556 C-32,-548 -35,-536 -34,-528 L-35,-523 L-43,-510 L-36,-506 L-36,-500 Q-39,-497 -36,-494 Q-38,-490 -34,-489 Q-36,-480 -30,-476 Q-22,-470 -8,-472 L8,-486 C24,-500 34,-525 28,-545 C20,-562 -10,-566 -22,-556 Z"
            fill={`url(#${id}-skin)`} stroke={skinLine} strokeWidth="1.4" strokeLinejoin="round"/>
          <ellipse cx="-13" cy="-505" rx="11" ry="7" fill="#d9704f" opacity="0.28"/>
          {/* eye, brow */}
          <g transform={`translate(0 -526) scale(1 ${blink}) translate(0 526)`}>
            <path d="M-31,-526 Q-25,-532 -17,-526 Q-24,-521.5 -31,-526 Z" fill="#fbf4ea" stroke="#3a1f12" strokeWidth="0.9"/>
            <circle cx="-26.5" cy="-526.2" r="3.3" fill="#2b1810"/><circle cx="-27.6" cy="-527.2" r="1.1" fill="#fff"/>
          </g>
          <path d="M-32,-527 Q-25,-534 -16,-527" stroke="#1d0f08" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d={worried ? "M-36,-534 Q-25,-545 -14,-540" : pose === "cheer" ? "M-35,-540 Q-25,-546 -14,-539" : "M-35,-537 Q-25,-543 -14,-536"} stroke="#2a190f" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          {mouthOpen > 0.08
            ? <ellipse cx="-31" cy="-493" rx={3.6 + mouthOpen * 1.4} ry={1 + mouthOpen * 4.2} fill="#5a1d17" stroke="#8a3d34" strokeWidth="1"/>
            : <path d={worried ? "M-36,-492 Q-31,-495 -26,-492" : pose === "cheer" ? "M-37,-495 Q-31,-488 -25,-495" : "M-36,-494 Q-31,-492 -26,-494"} stroke="#8a3d34" strokeWidth="1.8" fill="none" strokeLinecap="round"/>}
          <path d="M-39.5,-509 q2,2 4,0" stroke={skinLine} strokeWidth="1" fill="none"/>
          {/* tiny bindi */}
          <circle cx="-30" cy="-538" r="1.2" fill="#b4302a" opacity="0"/>
          {/* ear + stud */}
          <path d="M3,-518 C-3,-518 -3,-503 3,-501 C9,-500 12,-506 10,-512 C9,-517 6,-518 3,-518 Z" fill={skinM} stroke={skinLine} strokeWidth="1.2"/>
          <circle cx="4" cy="-499" r="2.4" fill="#e8b84a" stroke="#8e6516" strokeWidth="0.8"/>
          {/* hair */}
          <path d="M-34,-541 C-33,-560 -10,-570 12,-562 C34,-554 42,-526 36,-500 C34,-488 30,-478 26,-470 C22,-480 20,-492 14,-500 C12,-510 8,-524 -2,-534 C-12,-540 -24,-542 -34,-541 Z"
            fill={`url(#${id}-hair)`} stroke="#0e0906" strokeWidth="1.2"/>
          <path d="M-22,-557 C-6,-566 14,-562 27,-548" stroke="#7a5a44" strokeWidth="1.6" fill="none" opacity="0.8"/>
          <path d="M-8,-560 C0,-548 6,-536 10,-516" stroke="#0e0906" strokeWidth="1" fill="none" opacity="0.7"/>
          <ellipse cx="30" cy="-480" rx="9" ry="6" fill="#c9372f" stroke="#7d1d19" strokeWidth="1"/>
        </g>
      </g>
      {/* near arm */}
      {pose === "shade" ? (
        <g transform={`translate(0 ${handLift})`}>
          <Tube d="M-2,-436 Q-34,-430 -64,-452" w={25} fill={`url(#${id}-kurta)`} line={tealLine} hi="#8fd5d3"/>
          <Tube d="M-62,-452 Q-72,-500 -42,-536" w={15.5} fill={skinM} line={skinLine} hi={skinL}/>
          <path d="M-66,-478 q8,6 14,-2" stroke="#e9b640" strokeWidth="2.6" fill="none"/>
          <path d="M-62,-468 q8,6 16,-2" stroke="#e9b640" strokeWidth="2.6" fill="none"/>
          <path d="M-52,-534 C-52,-548 -34,-556 -16,-550 C-14,-544 -20,-540 -36,-538 C-44,-536 -48,-532 -52,-534 Z" fill={skinM} stroke={skinLine} strokeWidth="1.3" transform="rotate(-8 -34 -544)"/>
          <path d="M-46,-540 Q-30,-548 -18,-546" stroke={skinD} strokeWidth="1" fill="none" opacity="0.7"/>
        </g>
      ) : nd && (
        <g transform={`translate(0 ${handLift * 0.6})`}>
          {worried && <Hand x={-28} y={-446} a={62} kind="fist" skin={skinD} line={skinLine} hi={skinM}/>}
          <Tube d={`M-2,-436 Q${(-2 + nd.e[0]) / 2 - 4},${(-436 + nd.e[1]) / 2 + 12} ${nd.e[0]},${nd.e[1]}`} w={25} fill={`url(#${id}-kurta)`} line={tealLine} hi="#8fd5d3"/>
          <Tube d={`M${nd.e[0] + 2},${nd.e[1]} Q${(nd.e[0] + nd.w[0]) / 2},${(nd.e[1] + nd.w[1]) / 2 - 6} ${nd.w[0]},${nd.w[1]}`} w={15.5} fill={skinM} line={skinLine} hi={skinL}/>
          <path d={`M${nd.e[0] - 2},${nd.e[1] + 6} l6,-14`} stroke="#e9b640" strokeWidth="2.6" fill="none" opacity="0.9"/>
          {pose === "write" && <g transform={`translate(${nd.w[0]} ${nd.w[1]}) rotate(-62)`}><rect x="-8" y="-3" width="62" height="6" rx="2" fill="#e8b830" stroke="#8a6212" strokeWidth="1"/><path d="M-8,-3 l-12,3 l12,3 Z" fill="#f3d9a8" stroke="#8a6212" strokeWidth="1"/><path d="M-20,0 l4,0" stroke="#3b3b3b" strokeWidth="2"/></g>}
          <Hand x={nd.w[0]} y={nd.w[1]} a={nd.a} kind={nd.kind} skin={skinM} line={skinLine} hi={skinL} spread={pose === "cheer" ? 8 : 0}/>
        </g>
      )}
    </g>
  );
};
