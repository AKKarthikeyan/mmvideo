// ECO-16 Part 3, builder G1: `two-borrowers` mode "swapna" (b00). A small groundnut field in the plains: Swapna (adult woman farmer) and a moneylender at the field gate holding a few notes
// (no ledger, ever: NCERT says moneylenders keep no records). She takes the notes, the plants grow, then wilt (cf); a "land" tile lifts out of the field and goes to the moneylender (ld);
// at op a banner SAME TOOL . OPPOSITE RESULTS crosses the frame with two small thumbnails of the two stories; at q the question grows. Keys: sw, cf, ld, op, q.
import React from "react";
import {SERIF, W, H, clamp, eio, rng} from "../kit";
import {Tree, Adult, GDefs, E1Defs, F1Defs, Bundle, ShoeBox, Plate, Sun, Cloud, Hills, Palm, Sign, Badge, P2Card, elabs, armTo, handPos, path, ez, sm, arcP, mixn, type Look, type Arms, type AP} from "./analogy_g1_kit";

const SWAPNA: Look = {kind: "saree", accent: "#2f7a78", shirt: ["#d9b26a", "#a5782e"], hair: "#1a120d", skin: 2, female: true};
const LENDER: Look = {kind: "kurta", shirt: ["#f1ead6", "#bdb08a"], pants: "#efe6cf", hair: "#8a8a86", skin: 1, glasses: true, stache: true};

const HORIZON = 575;
const PLOT_X0 = 1066, PLOT_X1 = 1516, PLOT_Y0 = 598, PLOT_Y1 = 1016;     // the part of the field that gets sold
const C: [number, number] = [(PLOT_X0 + PLOT_X1) / 2, (PLOT_Y0 + PLOT_Y1) / 2];
const D: [number, number] = [1690, 600];                                // where the tile ends up (in the moneylender's hands)
const GX = 1572;                                                         // the gate
const LX = 1704, LY = 872, LH = 470;                                     // the moneylender
const ROWS = 6;

type PlantP = {x: number; y: number; s: number; delay: number; seed: number};
const PLANTS: PlantP[] = (() => {
  const out: PlantP[] = [], g = rng(77);
  for (let k = 0; k < ROWS; k++) {
    const t = k / (ROWS - 1), y = 640 + 360 * Math.pow(t, 1.25), pitch = 88 + 92 * t, s = 0.55 + 1.15 * t;
    for (let x = 90 + (k % 2) * pitch * 0.5; x < 1520; x += pitch) out.push({x: x + (g() - 0.5) * 10, y: y + (g() - 0.5) * 6, s, delay: g() * 0.55, seed: out.length});
  }
  return out;
})();

const Plant: React.FC<{p: PlantP; grow: number; wilt: number}> = ({p, grow, wilt}) => {
  const {x, y, s, seed} = p, w = clamp(wilt * 1.7 - p.delay), gk = 0.14 + 0.86 * grow, L = 40 * s * gk;
  const mix = clamp(w * 1.4);
  const c1 = `rgb(${Math.round(63 + (138 - 63) * mix)},${Math.round(138 + (122 - 138) * mix)},58)`;
  const c2 = `rgb(${Math.round(116 + (182 - 116) * mix)},${Math.round(192 + (160 - 192) * mix)},${Math.round(78 + (82 - 78) * mix)})`;
  const stems = [-1.5, -0.5, 0.5, 1.5];
  return (
    <g>
      <ellipse cx={x} cy={y + 2 * s} rx={26 * s * gk + 4} ry={6 * s} fill="#2a1808" opacity={0.2}/>
      <ellipse cx={x} cy={y} rx={14 * s} ry={4.5 * s} fill="#9a6a3c" opacity={0.9}/>
      {stems.map((q, i) => {
        const a = -Math.PI / 2 + q * 0.5 + Math.sin(seed + i) * 0.08, ex = x + Math.cos(a) * L + q * w * 12 * s, ey = y + Math.sin(a) * L + w * L * 0.78;
        const mx = (x + ex) / 2 + q * w * 4 * s, my = (y + ey) / 2 - w * 4 * s;
        const r = 11 * s * gk * (1 - 0.4 * w);
        return (
          <g key={i}>
            <path d={`M${x},${y} Q${mx},${my} ${ex},${ey}`} stroke="#4a6a2a" strokeWidth={2.2 * s} fill="none" strokeLinecap="round" opacity={1 - 0.4 * w}/>
            {[0.55, 0.82, 1].map((u, j) => {
              const lx = x + (ex - x) * u + (mx - (x + ex) / 2) * 2 * u * (1 - u), ly = y + (ey - y) * u + (my - (y + ey) / 2) * 2 * u * (1 - u), rot = (j % 2 ? 1 : -1) * 34 + w * 40 * (q > 0 ? 1 : -1);
              return <g key={j}><ellipse cx={lx - r * 0.5} cy={ly} rx={r * 0.9} ry={r * 0.55} fill={c1} transform={`rotate(${rot - 20} ${lx} ${ly})`}/>
                <ellipse cx={lx + r * 0.5} cy={ly} rx={r * 0.9} ry={r * 0.55} fill={c2} transform={`rotate(${rot + 20} ${lx} ${ly})`}/></g>;
            })}
          </g>
        );
      })}
      {grow > 0.85 && w < 0.3 && <g opacity={1 - w * 3}><circle cx={x - 8 * s} cy={y - 8 * s} r={3 * s} fill="#f6d046"/><circle cx={x + 10 * s} cy={y - 5 * s} r={2.6 * s} fill="#f6d046"/></g>}
    </g>
  );
};

const rowY = (k: number) => 640 + 360 * Math.pow(k / (ROWS - 1), 1.25);

const Soil: React.FC<{dry: number}> = ({dry}) => (
  <g>
    <rect x={-60} y={HORIZON} width={W + 120} height={H - HORIZON + 60} fill="url(#g1-soil)"/>
    <rect x={-60} y={HORIZON} width={W + 120} height={H - HORIZON + 60} fill="url(#g1-soildry)" opacity={dry}/>
    {Array.from({length: ROWS}, (_, k) => { const t = k / (ROWS - 1), y = rowY(k); return <g key={k}>
      <path d={`M-60,${y + 8 + 14 * t} H${W + 60}`} stroke="#5a3a1c" strokeWidth={6 + 8 * t} opacity={0.22}/>
      <path d={`M-60,${y + 2} H${W + 60}`} stroke="#d2a870" strokeWidth={2 + 2 * t} opacity={0.22}/></g>; })}
    {dry > 0.05 && Array.from({length: 22}, (_, i) => { const g = rng(i * 11 + 3), x = g() * W, y = 700 + g() * 340; return <path key={i} d={`M${x},${y} l${14 + g() * 24},${4 + g() * 8} l${6 + g() * 12},${-6 - g() * 8} M${x + 14},${y + 4} l${-6},${12}`} stroke="#6a4420" strokeWidth={2} fill="none" opacity={dry * 0.5}/>; })}
  </g>
);

const Fence: React.FC = () => (
  <g>
    {Array.from({length: 7}, (_, i) => { const t = i / 6, y = 618 + 380 * t, hh = 60 + 70 * t; return (i === 3 || i === 4) ? null : <g key={i}><rect x={1530 + 4 * t} y={y - hh} width={9 + 4 * t} height={hh} fill="#7a5632" stroke="#3a2412" strokeWidth={1.4}/>
      <rect x={1530 + 4 * t} y={y - hh} width={4 + 2 * t} height={hh} fill="#fff" opacity={0.14}/></g>; })}
    <g>
      {[GX - 56, GX + 56].map((x) => <rect key={x} x={x - 8} y={620} width={16} height={190} fill="#7a5632" stroke="#3a2412" strokeWidth={1.8}/>)}
      {[646, 700, 754].map((y) => <rect key={y} x={GX - 56} y={y} width={112} height={10} rx={2} fill="#9a6e3e" stroke="#3a2412" strokeWidth={1.6}/>)}
      <path d={`M${GX - 52},${760} L${GX + 52},${652}`} stroke="#8a5e34" strokeWidth={8} opacity={0.9}/>
    </g>
  </g>
);

const Thumb: React.FC<{cx: number; cy: number; w: number; h: number; a: number; children: React.ReactNode; name: string}> = ({cx, cy, w, h, a, children, name}) => {
  if (a <= 0.003) return null;
  const id = `g1th-${name}`;
  return (
    <g transform={`translate(${cx} ${cy + (1 - a) * 26}) scale(${0.88 + 0.12 * a})`} opacity={a} filter="url(#g1-sh)">
      <defs><clipPath id={id}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14}/></clipPath></defs>
      <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={h + 20} rx={20} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2.4}/>
      <g clipPath={`url(#${id})`}>{children}</g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="none" stroke="#fff3b8" strokeWidth={2} opacity={0.6}/>
      <Sign x={0} y={h / 2 + 52} text={name} size={24} w={name.length * 17 + 60}/>
    </g>
  );
};

export const SwapnaArt: React.FC<AP> = (p) => {
  const {f, at} = p, sw = at("sw"), cf = at("cf"), ld = at("ld"), op = at("op");
  // Swapna's day: takes the notes at the gate, walks into the field, hoes
  const rT = sw + 14, W0 = sw + 52, W1 = Math.max(W0 + 46, cf - 12);
  const SXk: [number, number, number][] = [[0, 1262, 0], [W0, 1262, 0], [W1, 940, 0]];
  const SX = path(SXk, f)[0];
  const walking = clamp(Math.abs(path(SXk, f + 1)[0] - path(SXk, f - 1)[0]) / 2 / 2.2);
  const SY = 972, SHt = 560;
  const grow = ez(f, W0 + 24, Math.max(30, cf - 8 - (W0 + 24)));
  const wilt = ez(f, cf, 64);
  const hoeing = sm(f, W1 + 4, 14) * (1 - sm(f, cf - 4, 12));
  const slump = ez(f, cf + 4, 40);
  // the notes: lender's hand -> Swapna's hand -> into her saree fold
  const meet = sm(f, rT, 14) * (1 - sm(f, W0 - 6, 14));
  const M2: [number, number] = [GX - 8, 706];
  const lTarget: [number, number] = [mixn(LX - 62, M2[0] + 22, meet), mixn(LY - 120, M2[1], meet)];
  const holdLd = sm(f, ld + 44, 18);
  const lArms: Arms = holdLd > 0.01
    ? {L: armTo(LX, LY, LH, "L", [D[0] - 98, D[1] + 10], holdLd), R: armTo(LX, LY, LH, "R", [D[0] + 98, D[1] + 10], holdLd)}
    : {L: armTo(LX, LY, LH, "L", lTarget, 0.35 + 0.65 * meet), R: [7, 16]};
  const lHand = handPos(LX, LY, LH, lArms, "L");
  const sTarget: [number, number] = [mixn(SX + 66, M2[0] - 2, meet), mixn(SY - 400, M2[1] + 4, meet)];
  const hoeT: [number, number] = [SX + 120 + Math.sin(f / 7) * 20, SY - 250 + Math.cos(f / 7) * 38 * hoeing];
  const sRArm = armTo(SX, SY, SHt, "R", hoeing > 0.01 ? [mixn(sTarget[0], hoeT[0], hoeing), mixn(sTarget[1], hoeT[1], hoeing)] : sTarget, Math.max(meet, hoeing));
  const sArms: Arms = {R: sRArm, L: [10 + slump * 6, 16 + slump * 10]};
  const sHand = handPos(SX, SY, SHt, sArms, "R");
  let bundle: [number, number] | null = [lHand[0] + 2, lHand[1] - 4], bK = 1;
  if (f >= rT + 10) {
    const u = clamp((f - (rT + 10)) / 18);
    bundle = [mixn(lHand[0], sHand[0], eio(u)), mixn(lHand[1], sHand[1], eio(u))];
    if (f > W0 + 6) bK = clamp(1 - (f - W0 - 6) / 12);
    if (bK <= 0.01) bundle = null;
  }
  if (holdLd > 0.01) bundle = null;
  const keep = holdLd < 0.01 && bundle === null ? [lHand[0] + 2, lHand[1] - 4] as [number, number] : null;
  // the tile
  const lift = ez(f, ld, 16), go = sm(f, ld + 14, 52);
  const tpos = arcP(C, D, 60, go), tk = mixn(1, 0.42, go), trot = -5 * go;
  const tileGone = f >= ld;
  const veil = ez(f, op - 4, 18) * 0.62;
  const th = ez(f, op + 18, 22), arrow = ez(f, op + 30, 20);
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-sky)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-skydry)" opacity={wilt * 0.9}/>
      <Sun x={1650} y={250} r={50 + wilt * 10} f={f} glow={0.9 + wilt * 0.3}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={160 + i * 640} y={150 + (i % 2) * 70} s={0.8} f={f} speed={0.1} seed={i + 2} a={0.8 * (1 - 0.7 * wilt)}/>)}
      <Hills id="g1sh1" base={520} amp={50} top="#b4cbe0" bottom="#d4dfdf" seed={1.3} wl={340}/>
      <Hills id="g1sh2" base={585} amp={36} top="#9fbf9a" bottom="#c4d4a4" seed={4.1} wl={270}/>
      <Palm x={250} y={612} s={0.95} f={f} seed={1}/><Palm x={380} y={606} s={0.78} f={f} seed={2} op={0.95}/><Palm x={1840} y={600} s={0.7} f={f} seed={5} op={0.9}/>
      {/* a hut at the field's edge */}
      <g transform="translate(560 612)">
        <ellipse cx={80} cy={4} rx={120} ry={10} fill="#2a1808" opacity={0.2}/>
        <rect x={0} y={-72} width={160} height={72} fill="#e2c694" stroke="#00000030" strokeWidth={1.4}/><rect x={0} y={-72} width={46} height={72} fill="#fff" opacity={0.12}/>
        <path d="M-18,-70 L80,-132 L178,-70 Z" fill="#a85a2e" stroke="#00000033" strokeWidth={1.6} strokeLinejoin="round"/>
        <rect x={62} y={-46} width={36} height={46} fill="#5a3c22" stroke="#2f1d0e" strokeWidth={1.4}/>
      </g>
      {[[640, 0.5, 3], [1150, 0.42, 5], [1330, 0.46, 7], [1470, 0.4, 9]].map(([x, k, sd]) => <Tree key={x} x={x} y={596} s={k} f={f} seed={sd} hue={wilt * -40}/>)}
      <rect x={-60} y={560} width={W + 120} height={44} fill="#7fa05a" opacity={0.85 - 0.5 * wilt}/>
      <Soil dry={wilt}/>
      {PLANTS.filter((q2) => q2.x < PLOT_X0).map((q2) => <Plant key={q2.seed} p={q2} grow={grow} wilt={wilt}/>)}
      {tileGone && <g>
        <rect x={PLOT_X0} y={PLOT_Y0} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} rx={4} fill="url(#g1-soildry)" opacity={lift}/>
        {Array.from({length: ROWS}, (_, k) => <path key={k} d={`M${PLOT_X0},${rowY(k) + 6} H${PLOT_X1}`} stroke="#8a6a3a" strokeWidth={4 + 5 * (k / (ROWS - 1))} opacity={0.4 * lift}/>)}
        <rect x={PLOT_X0} y={PLOT_Y0} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} rx={4} fill="none" stroke="#d9c9a0" strokeWidth={3} strokeDasharray="14 10" opacity={0.55 * lift}/>
      </g>}
      {!tileGone && PLANTS.filter((q2) => q2.x >= PLOT_X0).map((q2) => <Plant key={q2.seed} p={q2} grow={grow} wilt={wilt}/>)}
      <Fence/>
      <Adult x={LX} y={LY} h={LH} f={f} seed={71} look={LENDER} arms={lArms} hands={{L: meet > 0.5 ? "open" : "fist", R: "relax"}} lookX={-0.6} smile={0.15} nod={holdLd * 0.8}/>
      <Adult x={SX} y={SY} h={SHt} f={f} seed={72} look={SWAPNA} arms={sArms} hands={{R: hoeing > 0.2 ? "fist" : "open", L: "relax"}} lookX={meet > 0.3 ? 0.8 : 0.3 - slump} smile={0.5 - slump * 0.9} walkAmt={walking}
        headRot={slump * -6} nod={slump * 2.2} lean={slump * 2}
        held={{R: hoeing > 0.15 ? <g transform={`rotate(${-14 + Math.cos(f / 7) * 8 * hoeing})`}><rect x={-0.8} y={-34} width={1.6} height={44} fill="#8a5a30"/><path d="M-4,-34 L4,-34 L5,-28 L-5,-28 Z" fill="#6a6e76" stroke="#2a2c30" strokeWidth={0.4}/></g> : undefined}}/>
      {bundle && <Bundle x={bundle[0]} y={bundle[1]} s={0.9 * bK} rot={-6} op={bK}/>}
      {keep && <Bundle x={keep[0]} y={keep[1]} s={0.8} n={2} rot={-6} op={ez(p.f, W0 + 8, 12)}/>}
      {/* the tile in flight and in the lender's hands */}
      {tileGone && (
        <g transform={`translate(${tpos[0]} ${tpos[1] - lift * 18 * (1 - go)}) rotate(${trot}) scale(${tk}) translate(${-C[0]} ${-C[1]})`}>
          <defs><clipPath id="g1-tileclip"><rect x={PLOT_X0} y={PLOT_Y0} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} rx={18}/></clipPath></defs>
          <rect x={PLOT_X0 + 8} y={PLOT_Y0 + 26} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} rx={18} fill="#1c1006" opacity={0.28 * lift} filter="url(#ak-blur22)"/>
          <g clipPath="url(#g1-tileclip)">
            <rect x={PLOT_X0} y={PLOT_Y0} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} fill="url(#g1-soil)"/>
            <rect x={PLOT_X0} y={PLOT_Y0} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} fill="url(#g1-soildry)" opacity={wilt}/>
            {Array.from({length: ROWS}, (_, k) => <path key={k} d={`M${PLOT_X0},${rowY(k) + 8 + 14 * (k / (ROWS - 1))} H${PLOT_X1}`} stroke="#5a3a1c" strokeWidth={6 + 8 * (k / (ROWS - 1))} opacity={0.22}/>)}
            {PLANTS.filter((q2) => q2.x >= PLOT_X0).map((q2) => <Plant key={q2.seed} p={q2} grow={grow} wilt={wilt}/>)}
          </g>
          <rect x={PLOT_X0} y={PLOT_Y0} width={PLOT_X1 - PLOT_X0} height={PLOT_Y1 - PLOT_Y0} rx={18} fill="none" stroke="url(#f1-brass)" strokeWidth={10} opacity={lift}/>
          <rect x={PLOT_X0 + 8} y={PLOT_Y0 + 8} width={PLOT_X1 - PLOT_X0 - 16} height={PLOT_Y1 - PLOT_Y0 - 16} rx={12} fill="none" stroke="#fff3b8" strokeWidth={2} opacity={0.6 * lift}/>
          <Plate x={C[0]} y={PLOT_Y1 - 84} w={250} h={94} lines={["LAND"]} a={lift} size={52}/>
        </g>
      )}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#d9a850" opacity={0.1 * wilt}/>
      {/* the banner moment: a veil, the two stories as thumbnails, the same tool between them */}
      {veil > 0.005 && <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#2a2418" opacity={veil}/>}
      <Thumb cx={700} cy={440} w={400} h={250} a={th} name="SALIM">
        <rect x={-200} y={-125} width={400} height={250} fill="url(#g1-wall)"/>
        <rect x={-200} y={40} width={400} height={90} fill="url(#g1-floor)"/>
        {[[-110, 30], [-44, 30], [-77, -14], [-110, -58], [-44, -58]].map(([x, y], i) => <ShoeBox key={i} x={x} y={y} w={84} stripe={["#c0543a", "#2f78b8", "#d9a23a"][i % 3]}/>)}
        <g transform="translate(78 20)"><rect x={-70} y={-62} width={140} height={110} rx={8} fill="url(#g1-van)" stroke="#8a826e" strokeWidth={2}/><rect x={-58} y={-50} width={116} height={86} rx={8} fill="#201a14"/>
          {[[-30, 20], [14, 20], [-8, -14]].map(([x, y], i) => <ShoeBox key={i} x={x} y={y} w={44} stripe="#c0543a"/>)}</g>
        <Badge x={150} y={-84} ok s={1.1}/>
      </Thumb>
      <Thumb cx={1220} cy={440} w={400} h={250} a={th} name="SWAPNA">
        <rect x={-200} y={-125} width={400} height={250} fill="url(#g1-skydry)"/>
        <rect x={-200} y={-10} width={400} height={140} fill="url(#g1-soildry)"/>
        {[0, 1].map((i) => <g key={i} transform={`translate(${-150 + i * 96} 70)`}><Plant p={{x: 0, y: 0, s: 1, delay: 0, seed: i + 3}} grow={1} wilt={1}/></g>)}
        <g transform="translate(96 10)"><rect x={-84} y={-60} width={168} height={120} rx={12} fill="url(#g1-soildry)" stroke="#c9962c" strokeWidth={6}/><text x={0} y={16} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} letterSpacing="0.08em" fill="#5a3c0a">LAND</text></g>
      </Thumb>
      {arrow > 0.01 && (
        <g opacity={arrow} transform={`translate(960 440) scale(${0.7 + 0.3 * arrow})`} filter="url(#g1-sh-s)">
          <circle r={58} fill="#fff7e4" stroke="#b58a52" strokeWidth={3}/>
          <Bundle x={0} y={4} s={0.9} n={3}/>
        </g>
      )}
    </g>
  );
};

export const SwapnaLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p, op = L.op.at, q = L.q.at;
  const fadeOld = 1 - ez(f, op - 4, 14);
  const bx = mixn(-760, 960, ez(f, op, 26));
  const k = 0.62 + 0.38 * ez(f, q, 26), qa = ez(f, q, 14);
  return (
    <>
      <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, opacity: fadeOld}}>
        <P2Card cx={400} y={128} text={L.sw.text} f={f} at={L.sw.at} size={38} maxW={560} upper={false}/>
        <P2Card cx={900} y={128} text={L.cf.text} f={f} at={L.cf.at} size={38} maxW={560} upper={false} tone="cool"/>
        <P2Card cx={1400} y={128} text={L.ld.text} f={f} at={L.ld.at} size={38} maxW={520} upper={false}/>
      </div>
      <P2Card cx={bx} y={106} text={L.op.text} f={f} at={op} size={56} maxW={1300}/>
      <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${k})`, transformOrigin: "960px 760px", opacity: qa}}>
        <P2Card cx={960} y={690} text={L.q.text} f={f} at={q} size={62} maxW={1400} upper={false} tone="dark"/>
      </div>
    </>
  );
};
