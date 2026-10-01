// Channel intro: old black-and-white film (drawn) → sepia archive (drawn) → colour floods in → Vox collage today.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from "remotion";
import beatsRaw from "../../public/intro/beats.json";
import zee from "../../public/vx/zee/data.json";
import mdr from "../../public/vx/mdr/data.json";
import irdai from "../../public/vx/irdai/data.json";
import pb from "../../public/vx/pb/data.json";
import {C, COND, TYPE, Drift, Stage, Stamp, Strip, Tape, TornCard, TypeLabel, VoxDefs, VoxFonts} from "../voxkit";
import {HDraw, HWrite, sh, INK} from "../handkit";
import rough from "roughjs/bin/rough";
const rg = rough.generator();
const rp = (d: string, o: any = {}) => rg.path(d, {roughness: 1.1, bowing: 1, stroke: INK, strokeWidth: 5, seed: 5, ...o});
const PAPER = "#efe8d8";

type Beat = {key: string; era: string; say: string; cap: string; sec: number};
const beats = beatsRaw as Beat[];
export const IFPS = 30;
const LEADER = 50;
const frames = beats.map((b) => Math.ceil((b.sec + 0.6) * IFPS));
const starts = frames.reduce<number[]>((a, n, i) => [...a, i ? a[i - 1] + frames[i - 1] : LEADER], []);
export const introTotal = LEADER + frames.reduce((a, b) => a + b, 0) + 20;

const T = (b: Beat) => (p: string, off = 0) => {
  const i = b.say.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * IFPS * i / b.say.length) + off;
};
const CLIPS: Record<string, {id: string; w: number; h: number; hl: number[][]}> = {};
for (const D of [zee, mdr, irdai, pb] as any[]) for (const [k, v] of Object.entries(D.clips)) CLIPS[k] = {id: D.id, ...(v as any)};

// ---------- film look ----------
const SEPIA = [0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131, 0, 0, 0, 0, 0, 1, 0];
const GREY = [0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0, 0, 0, 1, 0];
const ID = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
const mix = (a: number[], b: number[], p: number) => a.map((v, i) => v * (1 - p) + b[i] * p).join(" ");
const rnd = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

const Film: React.FC<{tone: number[]; children: React.ReactNode; strength?: number}> = ({tone, children, strength = 1}) => {
  const f = useCurrentFrame();
  const flick = 0.04 + 0.05 * rnd(Math.floor(f / 2));
  const scratches = [0, 1, 2].map((k) => ({x: rnd(Math.floor(f / 3) * 7 + k) * 1920, on: rnd(f * 3 + k) > 0.55}));
  const jitter = (rnd(f) - 0.5) * 3 * strength;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute"}}>
      <defs>
        <filter id="tone"><feColorMatrix type="matrix" values={tone.join(" ")}/></filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12}/>
          <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0.35 0"/>
        </filter>
        <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="55%" stopColor="#000" stopOpacity="0"/><stop offset="100%" stopColor="#000" stopOpacity={0.55 * strength}/></radialGradient>
      </defs>
      <g filter="url(#tone)" transform={`translate(0 ${jitter})`}>
        <rect width={1920} height={1080} fill="#efe8d8"/>
        {children}
      </g>
      <rect width={1920} height={1080} filter="url(#grain)" opacity={strength}/>
      {scratches.map((s, i) => s.on && strength > 0.3 ? <line key={i} x1={s.x} y1={0} x2={s.x + 6} y2={1080} stroke="#fff" strokeWidth={1.5} opacity={0.35}/> : null)}
      <rect width={1920} height={1080} fill="#fff" opacity={flick * strength}/>
      <rect width={1920} height={1080} fill="url(#vig)"/>
    </svg>
  );
};

// ---------- scenes ----------
const Leader: React.FC = () => {
  const f = useCurrentFrame(); const n = 3 - Math.floor(f / 16); const p = (f % 16) / 16;
  const a = p * Math.PI * 2;
  return (
    <Film tone={GREY}>
      <circle cx={960} cy={540} r={330} fill="none" stroke={INK} strokeWidth={6}/>
      <circle cx={960} cy={540} r={260} fill="none" stroke={INK} strokeWidth={3}/>
      <line x1={600} y1={540} x2={1320} y2={540} stroke={INK} strokeWidth={3}/><line x1={960} y1={180} x2={960} y2={900} stroke={INK} strokeWidth={3}/>
      <path d={`M 960 540 L 960 ${540 - 330} A 330 330 0 ${a > Math.PI ? 1 : 0} 1 ${960 + 330 * Math.sin(a)} ${540 - 330 * Math.cos(a)} Z`} fill={INK} opacity={0.25}/>
      {n > 0 && <text x={960} y={620} fontFamily={COND} fontWeight={700} fontSize={260} textAnchor="middle" fill={INK}>{n}</text>}
    </Film>
  );
};

const Castle: React.FC<{b: Beat}> = ({b}) => {
  const t = T(b);
  const m0 = t("measured by its moat", -4);
  const tower = (x: number) => [sh.rect(x, 380, 150, 380, {strokeWidth: 6, fill: PAPER, fillStyle: "solid"}), ...[0, 1, 2].map((k) => sh.rect(x + k * 55, 345, 40, 38, {strokeWidth: 5, seed: 30 + x + k, fill: PAPER, fillStyle: "solid"}))];
  const ripples = [[300, 880], [470, 905], [640, 918], [1280, 918], [1450, 905], [1620, 880], [260, 790], [1660, 790], [380, 700], [1540, 700]];
  return (
    <Film tone={GREY}>
      {/* far bank / horizon */}
      <HDraw shape={sh.line(80, 640, 1840, 640, {strokeWidth: 4, seed: 3})} start={2} dur={14}/>
      {/* the moat: water ring (outer bank filled with water, island drawn over it) */}
      <HDraw shape={sh.ellipse(960, 790, 1640, 300, {strokeWidth: 7, seed: 77, fill: INK, fillStyle: "hachure", hachureGap: 11, fillWeight: 1.6, hachureAngle: -8})} start={m0} dur={28}/>
      <HDraw shape={sh.ellipse(960, 772, 860, 120, {strokeWidth: 6, seed: 78, fill: PAPER, fillStyle: "solid"})} start={m0 + 8} dur={20} hand={false}/>
      {ripples.map(([x, y], k) => <HDraw key={`w${k}`} shape={rp(`M ${x - 45} ${y} q 22 -12 45 0 t 45 0`, {stroke: PAPER, strokeWidth: 4, seed: 90 + k})} start={m0 + 24 + k * 2} dur={6} hand={false}/>)}
      {/* castle on the island */}
      {tower(620).map((s2, i) => <HDraw key={`a${i}`} shape={s2} start={8 + i * 3} dur={12} hand={i === 0}/>)}
      <HDraw shape={sh.rect(770, 470, 380, 290, {strokeWidth: 6, fill: PAPER, fillStyle: "solid"})} start={20} dur={16}/>
      {[0, 1, 2, 3, 4].map((k) => <HDraw key={`b${k}`} shape={sh.rect(780 + k * 75, 436, 45, 36, {strokeWidth: 5, seed: 50 + k, fill: PAPER, fillStyle: "solid"})} start={30 + k * 2} dur={8} hand={false}/>)}
      {tower(1150).map((s2, i) => <HDraw key={`c${i}`} shape={s2} start={36 + i * 3} dur={12} hand={i === 0}/>)}
      <HDraw shape={sh.arc(960, 760, 150, 200, Math.PI, 2 * Math.PI, {strokeWidth: 6})} start={48} dur={12}/>
      <HDraw shape={sh.line(695, 345, 695, 250, {strokeWidth: 4})} start={54} dur={6} hand={false}/>
      <HDraw shape={sh.line(695, 250, 770, 272, {strokeWidth: 4, seed: 71})} start={58} dur={4} hand={false}/>
      <HDraw shape={sh.line(770, 272, 695, 294, {strokeWidth: 4, seed: 72})} start={61} dur={4} hand={false}/>
      {/* drawbridge across the moat */}
      <HDraw shape={rp("M 895 772 L 1025 772 L 1070 948 L 850 948 Z", {fill: PAPER, fillStyle: "solid", strokeWidth: 5, seed: 81})} start={t("A wide moat", -8)} dur={12}/>
      {[0, 1, 2, 3, 4].map((k) => <HDraw key={`p${k}`} shape={sh.line(890 - k * 9, 802 + k * 30, 1030 + k * 9, 802 + k * 30, {strokeWidth: 3, seed: 110 + k})} start={t("A wide moat", 4 + k * 2)} dur={4} hand={false}/>)}
      <HDraw shape={sh.line(900, 690, 858, 940, {strokeWidth: 3, seed: 120})} start={t("A wide moat", 16)} dur={6} hand={false}/>
      <HDraw shape={sh.line(1020, 690, 1062, 940, {strokeWidth: 3, seed: 121})} start={t("A wide moat", 18)} dur={6} hand={false}/>
      {/* labels */}
      <HWrite x={1360} y={300} start={t("Walls could")} size={62}>walls</HWrite>
      <HDraw shape={sh.line(1350, 320, 1290, 420, {strokeWidth: 4})} start={t("Walls could", 16)} dur={8} hand={false}/>
      <HWrite x={60} y={560} start={t("A wide moat")} size={72}>the moat</HWrite>
      <HDraw shape={sh.line(200, 585, 250, 750, {strokeWidth: 4})} start={t("A wide moat", 18)} dur={8} hand={false}/>
      <text x={1840} y={80} fontFamily={TYPE} fontSize={30} textAnchor="end" fill={INK} opacity={0.7}>ca. the Middle Ages</text>
    </Film>
  );
};

const Stick: React.FC<{x: number; start: number; seed: number}> = ({x, start, seed}) => (
  <g>
    <HDraw shape={sh.circle(x, 640, 50, {strokeWidth: 5, seed})} start={start} dur={6} hand={false}/>
    <HDraw shape={sh.line(x, 665, x, 760, {strokeWidth: 5, seed: seed + 1})} start={start + 4} dur={5} hand={false}/>
    <HDraw shape={sh.line(x, 690, x - 35, 730, {strokeWidth: 5, seed: seed + 2})} start={start + 7} dur={4} hand={false}/>
    <HDraw shape={sh.line(x, 690, x + 35, 720, {strokeWidth: 5, seed: seed + 3})} start={start + 7} dur={4} hand={false}/>
    <HDraw shape={sh.line(x, 760, x - 28, 830, {strokeWidth: 5, seed: seed + 4})} start={start + 10} dur={4} hand={false}/>
    <HDraw shape={sh.line(x, 760, x + 28, 830, {strokeWidth: 5, seed: seed + 5})} start={start + 10} dur={4} hand={false}/>
  </g>
);
const scallop = (cx: number, cy: number, rx: number, ry: number, n: number, bump: number) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a0 = Math.PI + (i / n) * Math.PI;
    const x = cx + rx * Math.cos(a0), y = cy + ry * Math.sin(a0);
    if (i === 0) { d += `M ${x} ${y}`; continue; }
    const am = Math.PI + ((i - 0.5) / n) * Math.PI;
    const bb = bump * (0.6 + 0.9 * rnd(i * 3.7));
    const qx = cx + (rx + bb) * Math.cos(am), qy = cy + (ry + bb) * Math.sin(am);
    d += ` Q ${qx} ${qy} ${x} ${y}`;
  }
  // leafy underside back to the start
  for (let i = 1; i <= n; i++) {
    const x0 = cx + rx - (i / n) * 2 * rx, xm = x0 + rx / n;
    d += ` Q ${xm} ${cy + 55} ${x0} ${cy + (i % 2 ? 18 : 6)}`;
  }
  return d + " Z";
};
const Banyan: React.FC<{b: Beat}> = ({b}) => {
  const t = T(b); const f = useCurrentFrame();
  const roots: [number, number, boolean][] = [];
  for (let x = 250; x <= 1690; x += 58) { if (x > 850 && x < 1080) continue; const pillar = [308, 772, 1120, 1642].some((p) => Math.abs(p - x) < 30); roots.push([x, pillar ? 840 : 560 + Math.round(rnd(x) * 230), pillar]); }
  const slips: [number, number][] = [[560, 655], [1250, 645], [1440, 665]];
  return (
    <Film tone={SEPIA}>
      <HDraw shape={sh.line(100, 840, 1820, 840, {strokeWidth: 5})} start={0} dur={14}/>
      {/* canopy: very wide and low, bumpy */}
      <HDraw shape={rp(scallop(960, 440, 780, 250, 18, 46), {strokeWidth: 6, seed: 21, fill: INK, fillStyle: "hachure", hachureGap: 16, fillWeight: 1.3, hachureAngle: 30})} start={6} dur={34}/>
      {/* flared trunk */}
      <HDraw shape={rp("M 870 840 C 900 760 915 600 925 470 L 1000 470 C 1010 600 1025 760 1060 840 Z", {strokeWidth: 7, seed: 31, fill: PAPER, fillStyle: "solid"})} start={18} dur={16}/>
      <HDraw shape={rp("M 800 840 Q 860 820 880 780", {strokeWidth: 5, seed: 36})} start={30} dur={6} hand={false}/>
      <HDraw shape={rp("M 1130 840 Q 1070 820 1050 780", {strokeWidth: 5, seed: 37})} start={32} dur={6} hand={false}/>
      {[0, 1, 2].map((k) => <HDraw key={`g${k}`} shape={rp(`M ${930 + k * 22} 820 C ${935 + k * 20} 700 ${940 + k * 18} 600 ${945 + k * 15} 500`, {strokeWidth: 2.5, seed: 33 + k})} start={30 + k * 3} dur={8} hand={false}/>)}
      {/* long horizontal branches */}
      <HDraw shape={rp("M 930 520 C 820 450 640 510 470 470 S 300 500 240 490", {strokeWidth: 9, seed: 41})} start={32} dur={12}/>
      <HDraw shape={rp("M 995 520 C 1120 450 1300 510 1460 475 S 1620 500 1690 492", {strokeWidth: 9, seed: 42})} start={36} dur={12}/>
      {/* aerial roots: pillar roots reach the ground, others hang */}
      {roots.map(([x, y2, pillar], k) => (
        <g key={`r${k}`}>
          <HDraw shape={rp(`M ${x} 500 C ${x + 8} ${500 + (y2 - 500) * 0.4} ${x - 6} ${500 + (y2 - 500) * 0.7} ${x + 4} ${y2}`, {strokeWidth: pillar ? 6 : 2.2, seed: 50 + k})} start={44 + k * 2} dur={10} hand={false}/>
          {pillar && <HDraw shape={rp(`M ${x + 30} 500 C ${x + 38} 620 ${x + 24} 740 ${x + 36} ${y2}`, {strokeWidth: 6, seed: 60 + k})} start={46 + k * 2} dur={10} hand={false}/>}
          {pillar && <HDraw shape={rp(`M ${x - 12} ${y2} Q ${x + 16} ${y2 - 30} ${x + 48} ${y2}`, {strokeWidth: 4, seed: 65 + k})} start={52 + k * 2} dur={6} hand={false}/>}
          {!pillar && <HDraw shape={rp(`M ${x + 20} 500 C ${x + 24} 540 ${x + 16} 580 ${x + 22} ${500 + (y2 - 500) * 0.55}`, {strokeWidth: 1.6, seed: 70 + k})} start={48 + k * 2} dur={8} hand={false}/>}
        </g>
      ))}
      {[520, 700, 1220, 1400].map((x, i) => <Stick key={x} x={x} start={t("buying shares", -10 + i * 6)} seed={60 + i * 10}/>)}
      {slips.map(([x, y], k) => (
        <g key={`s${k}`}>
          <HDraw shape={sh.rect(x, y, 120, 72, {strokeWidth: 4, seed: 80 + k, fill: PAPER, fillStyle: "solid"})} start={t("buying shares", 14 + k * 5)} dur={8} hand={k === 0}/>
          {f > t("buying shares", 22 + k * 5) && <text x={x + 60} y={y + 46} fontFamily={TYPE} fontSize={24} textAnchor="middle" fill={INK}>SHARE</text>}
        </g>
      ))}
      <HWrite x={960} y={110} start={t("eighteen")} size={72} anchor="middle">Bombay, 1875 · under the banyan tree</HWrite>
      {f > t("India's first") && (
        <g>
          <rect x={560} y={870} width={800} height={110} fill={PAPER} stroke={INK} strokeWidth={4}/>
          <rect x={575} y={883} width={770} height={84} fill="none" stroke={INK} strokeWidth={2}/>
          <text x={960} y={940} fontFamily={TYPE} fontSize={42} textAnchor="middle" fill={INK}>INDIA'S FIRST STOCK EXCHANGE</text>
        </g>
      )}
    </Film>
  );
};

const BizMoat: React.FC<{b: Beat}> = ({b}) => {
  const t = T(b);
  const arrow = (x1: number, y1: number, x2: number, y2: number, st: number, seed: number) => (
    <g>
      <HDraw shape={sh.line(x1, y1, x2, y2, {strokeWidth: 5, seed})} start={st} dur={10}/>
      <HDraw shape={sh.line(x2, y2, x2 + (x1 < x2 ? -30 : 30), y2 - 22, {strokeWidth: 5, seed: seed + 1})} start={st + 10} dur={4} hand={false}/>
      <HDraw shape={sh.line(x2, y2, x2 + (x1 < x2 ? -30 : 30), y2 + 22, {strokeWidth: 5, seed: seed + 2})} start={st + 10} dur={4} hand={false}/>
    </g>
  );
  return (
    <Film tone={SEPIA} strength={0.8}>
      {/* small castle, left */}
      <HDraw shape={sh.rect(140, 460, 220, 170, {strokeWidth: 5, seed: 3})} start={0} dur={10}/>
      <HDraw shape={sh.rect(120, 410, 70, 220, {strokeWidth: 5, seed: 4})} start={6} dur={8} hand={false}/>
      <HDraw shape={sh.rect(310, 410, 70, 220, {strokeWidth: 5, seed: 5})} start={10} dur={8} hand={false}/>
      <HDraw shape={sh.ellipse(250, 650, 420, 80, {strokeWidth: 5, seed: 6})} start={14} dur={10} hand={false}/>
      <HWrite x={420} y={560} start={t("castle builders")} size={56}>→ same idea →</HWrite>
      {/* business, centre-right */}
      <HDraw shape={sh.rect(900, 470, 520, 250, {strokeWidth: 6, seed: 7})} start={t("A great business", -6)} dur={14}/>
      {[0, 1, 2, 3].map((k) => <HDraw key={k} shape={sh.line(900 + k * 130, 470, 965 + k * 130, 400, {strokeWidth: 5, seed: 8 + k})} start={t("A great business", 6 + k * 3)} dur={6} hand={false}/>)}
      {[0, 1, 2, 3].map((k) => <HDraw key={`r${k}`} shape={sh.line(965 + k * 130, 400, 1030 + k * 130, 470, {strokeWidth: 5, seed: 18 + k})} start={t("A great business", 8 + k * 3)} dur={6} hand={false}/>)}
      <HDraw shape={sh.rect(1300, 300, 60, 170, {strokeWidth: 5, seed: 30})} start={t("A great business", 20)} dur={8} hand={false}/>
      <HWrite x={1030} y={640} start={t("A great business", 16)} size={60}>BUSINESS</HWrite>
      <HDraw shape={sh.ellipse(1160, 720, 1000, 200, {strokeWidth: 7, seed: 41})} start={t("needs a moat")} dur={22}/>
      {arrow(560, 880, 700, 790, t("competitors"), 50)}
      {arrow(1780, 880, 1660, 800, t("competitors", 6), 60)}
      <HWrite x={420} y={960} start={t("time")} size={50}>time</HWrite>
      <HWrite x={700} y={1010} start={t("money")} size={50}>money</HWrite>
      <HWrite x={1600} y={990} start={t("intent")} size={50}>intent</HWrite>
      <HWrite x={640} y={200} start={t("an advantage")} size={58}>an advantage competitors cannot copy</HWrite>
    </Film>
  );
};

const ClipCard: React.FC<{k: string; x: number; y: number; w: number; start: number; rot: number; hl?: number}> = ({k, x, y, w, start, rot, hl}) => {
  const c = CLIPS[k]; const pad = 18; const ih = w * c.h / c.w; const f = useCurrentFrame();
  const p = hl === undefined ? 0 : Math.max(0, Math.min(1, (f - hl) / 10));
  return (
    <TornCard x={x} y={y} w={w + pad * 2} h={ih + pad * 2} start={start} fill="#fff" rot={rot}>
      <image href={staticFile(`vx/${c.id}/clips/${k}.png`)} x={pad} y={pad} width={w} height={ih}/>
      {p > 0 && c.hl.map(([hx, hy, hw, hh], i) => <rect key={i} x={pad + hx * w} y={pad + hy * ih} width={hw * w * p} height={hh * ih} fill={C.mustard} opacity={0.45} style={{mixBlendMode: "multiply"}}/>)}
      <Tape x={-24} y={-20} rot={-12} w={110}/>
    </TornCard>
  );
};

const Shift: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const t = T(b); const f = useCurrentFrame();
  const wipe = interpolate(f, [8, 44], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
  const edge = Array.from({length: 23}, (_, i) => `${wipe * 2100 - 90 + (rnd(i) - 0.5) * 60},${i * 50}`).join(" ");
  return (
    <AbsoluteFill>
      <Film tone={mix(SEPIA, ID, 0).split(" ").map(Number)} strength={0.8}>
        <HDraw shape={sh.rect(900, 470, 520, 250, {strokeWidth: 6, seed: 7})} start={-100} dur={1}/>
        <HDraw shape={sh.ellipse(1160, 720, 1000, 200, {strokeWidth: 7, seed: 41})} start={-100} dur={1}/>
        <HWrite x={1030} y={640} start={-100} size={60}>BUSINESS</HWrite>
      </Film>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute"}}>
        <VoxDefs/>
        <clipPath id="wipe"><polygon points={`0,0 ${edge} 0,1080`}/></clipPath>
        <g clipPath="url(#wipe)">
          <Stage w={1920} h={1080}/>
          <Drift frames={n} cx={960} cy={540}>
            <Strip x={960} y={150} start={10} text="TODAY: THE EVIDENCE IS IN THE FILINGS" size={64}/>
            <ClipCard k="npci_example" x={90} y={290} w={760} start={t("results")} rot={-3}/>
            <ClipCard k="pb_third" x={1030} y={280} w={800} start={t("transcripts")} rot={2}/>
            <ClipCard k="zl_petition" x={150} y={600} w={720} start={t("court orders")} rot={1.5}/>
            <ClipCard k="irdai_unwound" x={1050} y={600} w={700} start={t("disclosures")} rot={-2}/>
            <Strip x={300} y={255} start={t("results")} text="RESULTS" size={44}/>
            <Strip x={1260} y={245} start={t("transcripts")} text="TRANSCRIPTS" size={44}/>
            <Strip x={360} y={555} start={t("court orders")} text="COURT ORDERS" size={44} fill={C.red} color={C.white}/>
            <Strip x={1270} y={555} start={t("disclosures")} text="DISCLOSURES" size={44}/>
          </Drift>
        </g>
        {wipe > 0 && wipe < 1 && <polyline points={edge} fill="none" stroke="#fff" strokeWidth={10} opacity={0.8}/>}
      </svg>
    </AbsoluteFill>
  );
};

const Vox: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute"}}>
    <VoxDefs/><Stage w={1920} h={1080}/><Drift frames={n} cx={960} cy={540}>{children}</Drift>
  </svg>
);
const Reads: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const t = T(b);
  return (
    <Vox n={n}>
      <Strip x={960} y={170} start={0} text="MOAT & MARGIN READS THEM" size={72}/>
      <ClipCard k="zl_impair" x={200} y={330} w={1480} start={4} rot={-1} hl={t("Every figure")}/>
      <Stamp x={1250} y={800} start={t("checked against", 4)} text="CHECKED AGAINST THE SOURCE" size={62} rot={-5}/>
    </Vox>
  );
};
const DIMS = ["NETWORK EFFECTS", "SWITCHING COSTS", "COST ADVANTAGE", "PRICE DISCRETION", "INTANGIBLES", "EFFICIENT SCALE", "COUNTER-POSITIONING"];
const Score: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const t = T(b);
  const s0 = t("seven mechanisms", -6);
  return (
    <Vox n={n}>
      <Strip x={960} y={150} start={0} text="MOATSCORE · SEVEN MECHANISMS" size={68}/>
      {DIMS.map((d, i) => {
        const row = i < 4 ? 0 : 1, col = i < 4 ? i : i - 4, perRow = row ? 3 : 4, w = 380;
        const x = 960 - (perRow * w + (perRow - 1) * 30) / 2 + col * (w + 30);
        return (
          <TornCard key={d} x={x} y={260 + row * 250} w={w} h={200} start={s0 + i * 9} fill={i === 0 ? C.mustard : C.white} rot={[-2, 1, -1, 2][i % 4]}>
            <text x={w / 2} y={70} fontFamily={COND} fontWeight={700} fontSize={48} textAnchor="middle" fill={C.red}>{`D${i + 1}`}</text>
            <text x={w / 2} y={140} fontFamily={COND} fontWeight={700} fontSize={Math.min(44, 340 / (d.length * 0.5))} textAnchor="middle" fill={C.ink}>{d}</text>
          </TornCard>
        );
      })}
      <Strip x={960} y={880} start={t("More than five")} text="500+ INDIAN COMPANIES SCORED" size={70} fill={C.red} color={C.white} rot={-1}/>
    </Vox>
  );
};
const Formats: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const t = T(b);
  const cards: [string, string, string][] = [["DAILY", "FILING DIGEST", "Daily Filing"], ["DEEP", "DIVES", "Deep dives"], ["LONG", "VIDEOS", "and videos"], ["SHORT", "EXPLAINERS", "explain what"]];
  return (
    <Vox n={n}>
      {cards.map(([a, c, ph], i) => (
        <TornCard key={a} x={130 + i * 430} y={250} w={380} h={330} start={t(ph)} fill={i === 0 ? C.mustard : C.white} rot={[-2, 1.5, -1, 2][i]}>
          <text x={190} y={140} fontFamily={COND} fontWeight={700} fontSize={80} textAnchor="middle" fill={C.ink}>{a}</text>
          <text x={190} y={230} fontFamily={COND} fontWeight={700} fontSize={Math.min(58, 330 / (c.length * 0.5))} textAnchor="middle" fill={C.red}>{c}</text>
        </TornCard>
      ))}
      <Strip x={700} y={760} start={t("for the moat")} text="THE MOAT" size={96}/>
      <Strip x={1240} y={860} start={t("for the margin")} text="THE MARGIN" size={96} fill={C.red} color={C.white} rot={-1}/>
    </Vox>
  );
};
const Logo: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const t = T(b);
  return (
    <Vox n={n}>
      <Strip x={960} y={360} start={0} text="MOAT & MARGIN" size={170}/>
      <Strip x={960} y={560} start={t("Research from")} text="RESEARCH FROM THE FILINGS" size={72} fill={C.red} color={C.white} rot={-1}/>
      <TypeLabel x={560} y={760} start={t("educational")} text="Educational research, not investment advice." size={36} cps={3}/>
      <TypeLabel x={560} y={850} start={t("educational", 30)} text="Not a SEBI-registered Research Analyst." size={36} cps={3}/>
      <TypeLabel x={560} y={940} start={t("educational", 60)} text="moatmarginresearch.com" size={36} cps={3}/>
    </Vox>
  );
};

const Captions: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame();
  const parts = b.cap.match(/.+?(?:[.!?:](?=\s|$)|$)/g)!.map((s) => s.trim()).filter(Boolean);
  const tot = parts.reduce((a, s) => a + s.length, 0); const v = b.sec * IFPS;
  let acc = 0, cur = parts[0];
  for (const s of parts) { acc += s.length; cur = s; if (f < acc / tot * v) break; }
  return (
    <div style={{position: "absolute", left: 160, right: 160, bottom: 40, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.8)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 38, lineHeight: 1.4, padding: "6px 16px", borderRadius: 8}}>{cur}</span>
    </div>
  );
};

export const ChannelIntro: React.FC = () => (
  <AbsoluteFill style={{background: "#efe8d8"}}>
    <VoxFonts/>
    <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
    <Audio src={staticFile("intro/music.wav")}/>
    <Sequence from={0} durationInFrames={LEADER}><AbsoluteFill><Leader/></AbsoluteFill></Sequence>
    {beats.map((b, i) => {
      const n = frames[i] + (i === beats.length - 1 ? 20 : 0);
      const body = b.key === "c1" ? <Castle b={b}/> : b.key === "c2" ? <Banyan b={b}/> : b.key === "c3" ? <BizMoat b={b}/> :
        b.key === "c4" ? <Shift b={b} n={n}/> : b.key === "c5" ? <Reads b={b} n={n}/> : b.key === "c6" ? <Score b={b} n={n}/> :
        b.key === "c7" ? <Formats b={b} n={n}/> : <Logo b={b} n={n}/>;
      return (
        <Sequence key={b.key} from={starts[i]} durationInFrames={n}>
          <AbsoluteFill>{body}</AbsoluteFill>
          {b.key !== "c8" && <Captions b={b}/>}
          <Audio src={staticFile(`intro/${b.key}.mp3`)}/>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
