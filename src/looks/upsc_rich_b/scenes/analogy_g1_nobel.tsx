// ECO-16 Part 3, builder G1: `nobel-grameen` (b09). A village group at a table in a courtyard; in front, a brass prize plaque on a stand (names only, no faces, a plain gold disc, no medal copy):
// NOBEL PEACE PRIZE . 2006 . YUNUS AND GRAMEEN BANK (text read from the nb label). gb: the group; nb: the plaque rises; ef: arrows rise from the village ("from below");
// wm: a share badge "over 95%" (read from the wm label) beside a pictogram of women icons. Keys: gb, nb, ef, wm.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {GDefs, E1Defs, F1Defs, Seated, FlowArrow, Sign, P2Card, elabs, ez, sm, pop, pulse, mixn, type AP, type SeatLook} from "./analogy_g1_kit";
import {Courtyard} from "./analogy_g1_shg";

const SAREE: [string, string][] = [["#c0603d", "#8c3a22"], ["#2f7a78", "#1c4f4d"], ["#d9b26a", "#a5782e"], ["#7a4a8a", "#52305e"], ["#4d8a5a", "#2f5f3a"], ["#c9486a", "#8c2a48"], ["#3f6fa8", "#274a78"]];
const GROUP: {x: number; look: SeatLook; seed: number}[] = Array.from({length: 7}, (_, i) => {
  const sa = SAREE[(i * 3 + 1) % SAREE.length];
  return {x: 560 + i * 133, seed: 40 + i, look: {female: true, skin: (i * 2 + 1) % 4, top: sa, lower: sa[1], scarf: sa[0], hair: "#1a120d"}};
});
const TABLE_Y = 528;

const parsePlaque = (t: string): string[] => {
  const m = t.match(/^(.+?)\s+(\d{4})\s*[·|]\s*(.+)$/);
  return m ? [m[1], m[2], m[3]] : [t];
};
const parseShare = (t: string): string => (t.match(/over\s+\d+\s*%/i) ?? [""])[0];

export const NobelArt: React.FC<AP> = (p) => {
  const {f, dur, at, spec} = p, L = elabs(p), gb = at("gb"), nb = at("nb"), ef = at("ef"), wm = at("wm");
  const lines = parsePlaque(L.nb.text), share = parseShare(L.wm.text);
  const rise = sm(f, nb, 36), glow = pulse(f, nb + 6, 60);
  const arr = ez(f, ef, 46), wmA = pop(f, wm, 20);
  const icons = Array.from({length: 25}, (_, i) => i);
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <Courtyard f={f} dur={dur}/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#f4ead0" opacity={0.18}/>
      {/* the group at the table */}
      {GROUP.map((m, i) => { const a = pop(f, 6 + i * 5, 16); return (
        <g key={m.seed} opacity={clamp(a * 1.6)} transform={`translate(0 ${(1 - a) * 16})`}>
          <Seated x={m.x} y={TABLE_Y + 8} h={236} f={f} seed={m.seed} look={m.look} facing="front" raise={0} nod={Math.sin(f / 70 + i) * 1.2} sway={1.2}/>
        </g>); })}
      <g>
        <ellipse cx={960} cy={TABLE_Y + 100} rx={560} ry={22} fill="#2a1808" opacity={0.26}/>
        <rect x={470} y={TABLE_Y} width={980} height={24} rx={6} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/><rect x={470} y={TABLE_Y} width={980} height={5} fill="#fff" opacity={0.3}/>
        <path d={`M484,${TABLE_Y + 24} H1436 L1448,${TABLE_Y + 100} H472 Z`} fill="#e8d6aa" stroke="#a8946a" strokeWidth={1.6}/>
        {Array.from({length: 12}, (_, i) => <path key={i} d={`M${500 + i * 80},${TABLE_Y + 28} Q${506 + i * 80},${TABLE_Y + 62} ${500 + i * 80},${TABLE_Y + 98}`} stroke="#a8946a" strokeWidth={1.4} opacity={0.6}/>)}
        <rect x={472} y={TABLE_Y + 24} width={976} height={8} fill="#c9962c" opacity={0.7}/>
        {[640, 820, 1100, 1280].map((x, i) => <g key={x} transform={`translate(${x} ${TABLE_Y})`}><path d="M-12,0 L-10,-26 L10,-26 L12,0 Z" fill="url(#f2-steel)" stroke="#6f808b" strokeWidth={1.4}/><path d="M-8,-20 H8" stroke="#fff" strokeWidth={1.4} opacity={0.6}/></g>)}
      </g>
      {/* arrows that rise from the village (from below) */}
      {arr > 0.01 && [-1, 1].map((sd) => <FlowArrow key={sd} pts={[[960 + sd * 500, 880], [960 + sd * 580, 700], [960 + sd * 540, 520], [960 + sd * 470, 380]]} f={f} p={arr} w={22} c1="#2f9a78" c2="#7fd9b0" dark="#0e4a38" op={0.95}/>)}
      {/* the plaque stand rises into view */}
      <g transform={`translate(0 ${(1 - rise) * 300})`} opacity={clamp(rise * 2)}>
        <ellipse cx={960} cy={906} rx={470} ry={20} fill="#2a1808" opacity={0.32}/>
        {glow > 0.01 && <ellipse cx={960} cy={760} rx={560} ry={200} fill="url(#g1-spot)" opacity={glow * 0.9}/>}
        <path d="M640,880 L700,650 M1280,880 L1220,650" stroke="#4a3220" strokeWidth={18} strokeLinecap="round"/>
        <rect x={560} y={640} width={800} height={232} rx={14} fill="#3a2616" stroke="#1c1006" strokeWidth={3}/>
        <rect x={572} y={652} width={776} height={208} rx={8} fill="none" stroke="#8a5a30" strokeWidth={2}/>
        <rect x={600} y={668} width={720} height={176} rx={10} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={3}/>
        <rect x={612} y={680} width={696} height={152} rx={6} fill="none" stroke="#fff3b8" strokeWidth={1.8} opacity={0.7}/>
        {[[618, 686], [1302, 686], [618, 826], [1302, 826]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.6} fill="#7a5412" stroke="#fff3b8" strokeWidth={0.9}/>)}
        {lines.length === 3 ? (
          <g fontFamily={SERIF} fontWeight={700} fill="#3d2a08" textAnchor="middle">
            <text x={960} y={720} fontSize={34} letterSpacing="0.1em">{lines[0]}</text>
            <text x={960} y={786} fontSize={64} letterSpacing="0.14em">{lines[1]}</text>
            <text x={960} y={824} fontSize={28} letterSpacing="0.1em">{lines[2]}</text>
          </g>
        ) : <text x={960} y={766} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={36} fill="#3d2a08">{lines[0]}</text>}
        {/* a plain gold disc on the ledge: no portrait, no ribbon, no copied design */}
        <g transform="translate(1432 790)">
          <ellipse cx={0} cy={74} rx={74} ry={10} fill="#2a1808" opacity={0.3}/>
          <circle r={72} fill="#8a5a10" transform="translate(3 4)" opacity={0.5}/>
          <circle r={72} fill="url(#e1-gold)" stroke="#8a5a10" strokeWidth={3}/>
          <circle r={58} fill="none" stroke="#b9801a" strokeWidth={2.4}/><circle r={46} fill="none" stroke="#b9801a" strokeWidth={1.4} opacity={0.7}/>
          <path d="M-52,-30 Q-30,-62 14,-60" stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round"/>
        </g>
      </g>
      {/* the share badge and a pictogram of women icons (a few more than nineteen in every twenty) */}
      {wmA > 0.01 && (
        <g opacity={clamp(wmA * 1.4)}>
          <g transform={`translate(1722 ${520 - (1 - wmA) * 30}) scale(${0.7 + 0.3 * wmA})`} filter="url(#g1-sh)">
            <circle r={96} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={4}/><circle r={82} fill="#fff7e4" stroke="#b58a52" strokeWidth={2.4}/>
            <text x={0} y={12} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={32} fill="#8c2a48">{share}</text>
            <text x={0} y={46} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing="0.12em" fill="#5e2a0e">WOMEN</text>
          </g>
          <g transform="translate(1722 760)">
            {icons.map((i) => { const r = Math.floor(i / 5), c = i % 5, man = i === 24, a = pop(f, wm + 10 + i * 1.6, 14);
              return <g key={i} transform={`translate(${(c - 2) * 46} ${(r - 2) * 44 - (1 - a) * 8}) scale(${0.4 + 0.6 * a})`} opacity={clamp(a * 1.5)}>
                <circle cx={0} cy={-10} r={8} fill={man ? "#6f87a4" : "#c9486a"}/><path d="M-12,16 Q-12,0 0,0 Q12,0 12,16 Z" fill={man ? "#6f87a4" : "#c9486a"}/>
                {!man && <path d="M-9,-14 Q0,-26 9,-14" stroke="#1a120d" strokeWidth={3} fill="none"/>}</g>; })}
          </g>
        </g>
      )}
    </g>
  );
};

export const NobelLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={420} y={122} text={L.gb.text} f={f} at={L.gb.at} size={32} maxW={600} upper={false}/>
      <P2Card cx={960} y={122} text={L.ef.text} f={f} at={L.ef.at} size={30} maxW={460} upper={false} tone="green"/>
      <P2Card cx={1500} y={122} text={L.wm.text} f={f} at={L.wm.at} size={30} maxW={560} upper={false} tone="cool"/>
    </>
  );
};
