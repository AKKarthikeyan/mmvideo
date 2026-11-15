// ECO-16 Part 2, builder F1: `queue-calm` (b03). Two panels side by side. Left: a "what if" (drawn ghosted): a long worried queue at the goldsmith's door and Lala wiping his brow.
// Right: a calm village that stays home, and a confidence meter that rises once its label (cf) appears. Events are the label keys q, nw, kp, cf.
import React from "react";
import {SANS, SERIF, clamp} from "../kit";
import {prog, Cloud, Hills, Sun, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Adult, E1Defs, type Arms, type Look} from "./analogy_e1_kit";
import {Receipt, House, Palm, F1Defs, E, win, armTo, blend, type P} from "./analogy_f1_kit";

const PW = 840, PH = 620, PYT = 214, PXL = 96, PXR = 984, HOR = 330;
const LALA: Look = {kind: "kurta", shirt: ["#efe3c6", "#b9a77c"], pants: "#efe6cf", hair: "#8a8a86", skin: 1, glasses: true, stache: true};
const Q: Look[] = [
  {kind: "saree", accent: "#b23a48", female: true, skin: 3, shirt: ["#d98a8a", "#a65a5a"], hair: "#1a120d"},
  {kind: "pagri", accent: "#c8401d", shirt: ["#eee2c0", "#bfae86"], pants: "#efe6cf", skin: 2, stache: true, hair: "#2a1c14"},
  {kind: "plain", shirt: ["#7fa58a", "#4d7358"], pants: "#5a4a3a", skin: 0, hair: "#2b1d14"},
  {kind: "saree", accent: "#2f7a8a", female: true, skin: 3, shirt: ["#8fb5c0", "#4d7a86"], hair: "#1a120d"},
  {kind: "gamcha", shirt: ["#6c8fb5", "#41607f"], pants: "#3a3f52", skin: 1, stache: true, hair: "#1a120d"},
  {kind: "plain", shirt: ["#d9b26a", "#a5782e"], pants: "#3d4658", skin: 2, hair: "#1a120d", stache: true},
  {kind: "saree", accent: "#7a4a9a", female: true, skin: 1, shirt: ["#b89ac4", "#7a5a88"], hair: "#241812"},
];
const CALM: Look[] = [
  {kind: "saree", accent: "#c0603d", female: true, skin: 3, shirt: ["#e0a070", "#a86a3a"], hair: "#1a120d"},
  {kind: "gamcha", shirt: ["#7fa58a", "#4d7358"], pants: "#efe6cf", skin: 2, stache: true, hair: "#2b1d14"},
  {kind: "saree", accent: "#2f7a8a", female: true, skin: 1, shirt: ["#8fb5c0", "#4d7a86"], hair: "#241812"},
];

const Panel: React.FC<{id: string; x: number; dashed?: boolean; a: number; children: React.ReactNode}> = ({id, x, dashed, a, children}) => (
  <g transform={`translate(${x} ${PYT})`}>
    <defs><clipPath id={`${id}-c`}><rect x={0} y={0} width={PW} height={PH} rx={22}/></clipPath></defs>
    <rect x={6} y={10} width={PW} height={PH} rx={22} fill="#000" opacity={0.25 * a}/>
    <g clipPath={`url(#${id}-c)`} opacity={a}>{children}</g>
    <rect x={0} y={0} width={PW} height={PH} rx={22} fill="none" stroke={dashed ? "#8a6a46" : "url(#f1-brass)"} strokeWidth={dashed ? 4 : 6} strokeDasharray={dashed ? "16 11" : undefined} opacity={dashed ? 0.8 : a}/>
  </g>
);

const Ground: React.FC<{y0: number}> = ({y0}) => (
  <g>
    <rect x={-20} y={y0} width={PW + 40} height={PH - y0 + 20} fill="url(#e1-ground)"/>
    <rect x={-20} y={y0} width={PW + 40} height={14} fill="#f0dcb4" opacity={0.7}/>
    {Array.from({length: 5}, (_, i) => <path key={i} d={`M-20,${y0 + 40 + i * i * 9 + i * 18} L${PW + 20},${y0 + 40 + i * i * 9 + i * 18}`} stroke="#6a4a2a" strokeWidth={1.2} opacity={0.16}/>)}
  </g>
);

const Shop: React.FC<{x: number; f: number; lala: React.ReactNode; counterTop: number}> = ({x, f, lala, counterTop}) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={0} y={96} width={330} height={HOR - 96 + 90} fill="url(#f1-plaster)" stroke="#00000030" strokeWidth={1.6}/>
    <path d="M-16,102 L346,102 L300,22 L30,22 Z" fill="#b4562e" stroke="#00000033" strokeWidth={1.6} strokeLinejoin="round"/>
    {[0.2, 0.4, 0.6, 0.8].map((u, i) => <path key={i} d={`M${-16 + 362 * u},102 L${30 + 270 * u},22`} stroke="#00000030" strokeWidth={1.2}/>)}
    <rect x={30} y={150} width={270} height={290} fill="#3a2a1c"/>
    <rect x={30} y={150} width={270} height={290} fill="url(#f1-lamp)" opacity={0.25}/>
    {[0, 1].map((r) => <rect key={r} x={44} y={210 + r * 84} width={240} height={8} fill="#8a5a30"/>)}
    {Array.from({length: 7}, (_, i) => <rect key={i} x={54 + i * 34} y={186 + (i % 2) * 6} width={20} height={26} rx={4} fill={["#e8b84a", "#c0603d", "#7fa58a", "#e8dcc4"][i % 4]} opacity={0.85}/>)}
    {lala}
    <rect x={14} y={counterTop} width={302} height={20} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={20} y={counterTop + 20} width={290} height={120} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={14} y={counterTop} width={302} height={4} fill="#fff" opacity={0.3}/>
    <rect x={92} y={96} width={146} height={30} rx={4} fill="#2a3a5c" stroke="#d9b45a" strokeWidth={2}/>
    <text x={165} y={118} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.22em" fill="#f6e3a8">GOLDSMITH</text>
  </g>
);

/** the ghosted "what if": a worried queue grows from the shop door, Lala wipes his brow */
const WhatIf: React.FC<{f: number; q: number}> = ({f, q}) => {
  const LXp = 170, LFt = 548, LHp = 290;
  const wipe = E(f, q + 8, 24);
  const tgt: P = [LXp + 8 + Math.sin(f / 3.2) * 9, 286 + Math.sin(f / 2.3) * 4];
  const arms: Arms = {R: armTo(LXp, LFt, LHp, "R", tgt, wipe * 0.95), L: [5, 8]};
  const lala = <Adult x={LXp} y={LFt} h={LHp} f={f} seed={61} look={LALA} arms={arms} hands={{R: "open"}} lookX={0.6} smile={0.4 - 1.3 * wipe} />;
  const slots = [[395, 596, 350], [490, 572, 318], [575, 554, 292], [650, 540, 270], [716, 528, 252], [772, 520, 238], [820, 514, 226]];
  return (
    <g>
      <rect x={0} y={0} width={PW} height={PH} fill="url(#e1-sky)"/>
      <Hills id="f1qh" base={330} amp={34} top="#b9cbdd" bottom="#d6dfe0" seed={2.7} wl={250} bottomY={PH}/>
      <Palm x={720} y={HOR + 10} s={0.6} f={f} seed={4} op={0.9}/>
      <Ground y0={HOR}/>
      <Shop x={20} f={f} lala={lala} counterTop={380}/>
      {[...slots].map((s, i) => ({s, i})).reverse().map(({s, i}) => {
        const start = q + i * 9, u = E(f, start, 38), a = clamp((f - start) / 10);
        if (a <= 0) return null;
        const x = s[0] + 280 * (1 - u), wk = clamp(Math.abs(1 - u) > 0.02 && u < 0.98 ? 1 : 0);
        return <Adult key={i} x={x} y={s[1]} h={s[2]} f={f} seed={70 + i} look={Q[i]} arms={{R: [28 + Math.sin(f / 7 + i) * 4, 78]}} hands={{R: "open"}} lookX={-0.8} walkAmt={wk} lean={-3} op={a} smile={-0.9}
          held={{R: <g transform="translate(2 -1) rotate(-10)"><Receipt s={0.19}/></g>}}/>;
      })}
      {wipe > 0.2 && [0, 1, 2].map((i) => { const u = ((f * 0.03 + i * 0.33) % 1); return <ellipse key={i} cx={LXp + 3 + i * 4} cy={LFt - 0.9 * LHp + 8 + u * 22} rx={2.2} ry={3.4} fill="#7fb8e0" opacity={0.8 * (1 - u) * wipe}/>; })}
    </g>
  );
};

const Meter: React.FC<{f: number; at: number; text: string}> = ({f, at, text}) => {
  const a = E(f, at, 14), lvl = 0.84 * E(f, at + 8, 66);
  if (a <= 0.01) return null;
  const x = 748, top = 90, hgt = 430;
  return (
    <g opacity={a}>
      <rect x={x - 28} y={top - 20} width={56} height={hgt + 40} rx={26} fill="#000" opacity={0.28} transform="translate(4 6)"/>
      <rect x={x - 28} y={top - 20} width={56} height={hgt + 40} rx={26} fill="#fffaf0" stroke="url(#f1-brass)" strokeWidth={5}/>
      <rect x={x - 17} y={top} width={34} height={hgt} rx={17} fill="#dfe8ec" stroke="#8aa8bc" strokeWidth={1.6}/>
      <clipPath id="f1-mc"><rect x={x - 17} y={top} width={34} height={hgt} rx={17}/></clipPath>
      <g clipPath="url(#f1-mc)">
        <rect x={x - 17} y={top + hgt * (1 - lvl)} width={34} height={hgt * lvl + 4} fill="#38a85a"/>
        <rect x={x - 17} y={top + hgt * (1 - lvl)} width={34} height={7} fill="#8ae0a0"/>
        <rect x={x - 11} y={top + hgt * (1 - lvl)} width={7} height={hgt * lvl} fill="#fff" opacity={0.3}/>
      </g>
      {[0.2, 0.4, 0.6, 0.8].map((u) => <path key={u} d={`M${x + 17},${top + hgt * u} h12`} stroke="#8a6a46" strokeWidth={2}/>)}
      <text x={x} y={top + hgt + 52} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.16em" fill="#2f6a3a">{text}</text>
    </g>
  );
};

const Calm: React.FC<{f: number; cf: number; cfText: string}> = ({f, cf, cfText}) => {
  const sweep = Math.sin(f / 7);
  const chat = Math.sin(f / 3.4) * Math.sin(f / 7.7 + 1);
  return (
    <g>
      <rect x={0} y={0} width={PW} height={PH} fill="url(#e1-sky)"/>
      <Sun x={660} y={96} r={34} f={f} glow={0.8}/>
      <Cloud x={160} y={80} s={0.55} f={f} speed={0.1} seed={3} a={0.75}/>
      <Hills id="f1ch" base={340} amp={34} top="#b9cbdd" bottom="#d6dfe0" seed={3.4} wl={260} bottomY={PH}/>
      <Palm x={430} y={HOR + 20} s={0.62} f={f} seed={5} op={0.92}/><Palm x={30} y={HOR + 30} s={0.5} f={f} seed={6} op={0.9}/>
      <House x={40} y={HOR + 70} w={210} h={150} wall="#e8cf9f" roof="#b4562e" glow={1}/>
      <House x={300} y={HOR + 40} w={170} h={120} wall="#d9b08a" roof="#9a4228" glow={1}/>
      <House x={520} y={HOR + 60} w={190} h={140} wall="#ead9b0" roof="#a64a2a" glow={1}/>
      <Ground y0={HOR + 74}/>
      {/* a well */}
      <g transform="translate(372 450)"><ellipse cx={0} cy={12} rx={54} ry={10} fill="#2a1808" opacity={0.25}/><rect x={-40} y={-30} width={80} height={44} rx={6} fill="#b6a98f" stroke="#7a6c52" strokeWidth={2}/><ellipse cx={0} cy={-30} rx={40} ry={9} fill="#3a4a58"/><path d="M-36,-30 V-96 M36,-30 V-96 M-42,-96 H42" stroke="#6a4228" strokeWidth={7} strokeLinecap="round"/><path d="M0,-96 V-58" stroke="#3a2a1c" strokeWidth={2.4}/><path d="M-9,-58 H9 L7,-44 H-7 Z" fill="#8a5a30" stroke="#3a2412" strokeWidth={1.4}/></g>
      {/* the sweeping woman, two neighbours chatting, a man with a bundle */}
      <Adult x={160} y={580} h={310} f={f} seed={81} look={CALM[0]} arms={{R: [22 + sweep * 8, 40 + sweep * 10], L: [26, 30]}} hands={{R: "fist", L: "fist"}} lookX={0.4 * sweep} smile={0.7}
        held={{R: <g transform={`rotate(${-12 + sweep * 6}) translate(0 -2)`}><path d="M0,0 L2,44" stroke="#8a5a2c" strokeWidth={1.4}/><path d="M-5,44 L9,44 L11,56 L-7,56 Z" fill="#d9b45a" stroke="#8a5f12" strokeWidth={0.6}/></g>}}/>
      <Adult x={480} y={598} h={330} f={f} seed={82} look={CALM[1]} arms={{R: [26 + chat * 10, 56], L: [8, 12]}} hands={{R: "open"}} lookX={0.6} smile={0.8} talk={chat > 0.05}/>
      <Adult x={576} y={596} h={326} f={f} seed={83} look={CALM[2]} arms={{R: [6, 10], L: [24 - chat * 8, 50]}} hands={{L: "open"}} lookX={-0.6} smile={0.8} talk={chat < -0.05}/>
      {/* a hen or two on the ground, easy and unhurried */}
      {[0, 1].map((i) => <g key={i} transform={`translate(${270 + i * 40 + Math.sin(f / 30 + i) * 6} ${604 + i * 8})`}><ellipse cx={0} cy={0} rx={12} ry={8} fill={i ? "#c0603d" : "#e8dcc4"}/><circle cx={9} cy={-6} r={4.4} fill={i ? "#c0603d" : "#e8dcc4"}/><path d="M13,-6 l5,1" stroke="#e8b84a" strokeWidth={2}/><circle cx={11} cy={-7} r={1} fill="#222"/></g>)}
      <Meter f={f} at={cf} text={cfText}/>
    </g>
  );
};

export const QueueArt: React.FC<AP> = (p) => {
  const {f, at} = p, L = rlabs(p);
  const q = at("q"), nw = at("nw"), cf = at("cf");
  const rp = E(f, nw - 24, 30);
  return (
    <g>
      <F1Defs/><E1Defs/>
      <rect x={-60} y={-60} width={2040} height={1200} fill="#E9DEC3"/>
      <rect x={-60} y={-60} width={2040} height={1200} fill="url(#f1-lamp)" opacity={0.18}/>
      <Panel id="f1ql" x={PXL} dashed a={1}><g style={{filter: "grayscale(0.4)"}} opacity={0.62}><WhatIf f={f} q={q}/></g></Panel>
      <rect x={PXR} y={PYT} width={PW} height={PH} rx={22} fill="none" stroke="#8a6a46" strokeWidth={3} strokeDasharray="6 12" opacity={0.35 * (1 - rp)}/>
      <Panel id="f1qr" x={PXR} a={rp}><Calm f={f} cf={cf} cfText={L[3]?.text ?? ""}/></Panel>
    </g>
  );
};

export const QueueLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={PXL + PW / 2} y={76} text={L[0].text} f={p.f} at={L[0].at} size={34} maxW={800}/>}
      {L[1] && <P2Card cx={PXR + PW / 2} y={76} text={L[1].text} f={p.f} at={L[1].at} size={30} maxW={800} upper={false} tone="green"/>}
      {L[2] && <P2Card cx={PXR + PW / 2} y={844} text={L[2].text} f={p.f} at={L[2].at} size={28} maxW={800} upper={false}/>}
    </>
  );
};
