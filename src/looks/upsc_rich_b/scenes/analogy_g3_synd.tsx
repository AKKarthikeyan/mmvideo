// ECO-16 Part 3, builder G3: `syndicated`. mode "question" (b17a): an exam paper on a desk, a header (q) and two statements (s1, s2) that print themselves; no answer, no options marked.
// mode "answer" (b17b): a board with one borrower in a ring of banks' shares (bq the BIS note, bg the ring splitting into shares), a credit-line gauge and a lump-sum block both tagged SYNDICATED (cl),
// then a handwritten line in a notebook and a rubber stamp BY OUR REASONING (ans) that is clearly our own note, not an official key, and a small tag UPSC'S OWN KEY: NOT READ (nk) beside a closed folder.
import React from "react";
import {ECard, DeskBG, NotePage, Ink, Pencil, Gauge, Specks, wrapText, inkW} from "./analogy_f3_kit";
import {Stamp, GoldBar} from "./analogy_f1_kit";
import {G3Defs, MiniBank, HangTag, elabs, parts, numbered, E, SANS, SERIF, W, H, eo, prog, lerp, clamp, type AP} from "./analogy_g3_kit";
import {Coin} from "./analogy_f3_kit";

// ---- question --------------------------------------------------------------------------------------------------------------------
const PP = {x: 420, y: 80, w: 1080, h: 820};

/** printed text that wipes in left to right, one clip per line */
const Printed: React.FC<{id: string; x: number; y: number; lines: string[]; size: number; f: number; at: number; len?: number; color?: string; weight?: number}> = ({id, x, y, lines, size, f, at, len = 40, color = "#1d1a16", weight = 500}) => {
  if (f < at) return null;
  return (
    <g>
      {lines.map((t, i) => {
        const k = eo(prog(f, at + i * (len * 0.7), len)), w = (t.length * size * 0.5 + 20) * k;
        return (
          <g key={i}>
            <defs><clipPath id={`${id}${i}`}><rect x={x - 6} y={y + i * size * 1.3 - size} width={Math.max(0.1, w)} height={size * 1.4}/></clipPath></defs>
            <g clipPath={`url(#${id}${i})`}><text x={x} y={y + i * size * 1.3} fontFamily={SERIF} fontWeight={weight} fontSize={size} fill={color}>{t}</text></g>
          </g>
        );
      })}
    </g>
  );
};

const QuestionArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = E(f, 0, 24);
  const st = [{k: "s1", y: 330}, {k: "s2", y: 540}];
  const SX = PP.x + 150, SW = 880, TX = PP.x + 200;
  // the pencil rests, then points at each statement as it prints
  const pxx = PP.x + PP.w - 20, pyy = PP.y + PP.h - 70 + Math.sin(f / 40) * 2, rot = -62;
  const hdA = E(f, L.q.at, 24);
  const slots = (a: number) => lerp(0.35, 1, a);
  return (
    <g>
      <G3Defs/>
      <DeskBG f={f} id="g3qd" mug={false}/>
      <g opacity={a0} transform={`translate(0 ${(1 - a0) * 30}) rotate(-0.6 ${PP.x + PP.w / 2} ${PP.y + PP.h / 2})`}>
        <rect x={PP.x + 14} y={PP.y + 26} width={PP.w} height={PP.h} rx={8} fill="#2a1808" opacity={0.36} filter="url(#e3-glow)"/>
        <rect x={PP.x} y={PP.y} width={PP.w} height={PP.h} rx={6} fill="url(#f3-paper)" stroke="#cbb88a" strokeWidth={2}/>
        <path d={`M${PP.x + PP.w - 60},${PP.y} L${PP.x + PP.w},${PP.y + 60} L${PP.x + PP.w - 60},${PP.y + 60} Z`} fill="#e8dcc0" opacity={0.0}/>
        {/* header */}
        <rect x={PP.x + 40} y={PP.y + 40} width={PP.w - 80} height={92} fill="none" stroke="#2a2620" strokeWidth={3.4} opacity={slots(hdA)}/>
        <rect x={PP.x + 48} y={PP.y + 48} width={PP.w - 96} height={76} fill="none" stroke="#2a2620" strokeWidth={1.2} opacity={slots(hdA)}/>
        <g opacity={hdA}>
          <text x={PP.x + PP.w / 2} y={PP.y + 102} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={42} letterSpacing={5} fill="#1d1a16">{L.q.text}</text>
        </g>
        {/* the stem: faint lines (the instruction text is not part of the label, so it stays as plain bars) */}
        {[0, 1].map((i) => <rect key={i} x={PP.x + 60} y={PP.y + 168 + i * 34} width={i ? 640 : 900} height={14} rx={7} fill="#cfc6b2"/>)}
        {/* the statements */}
        {st.map(({k, y}) => {
          const [n, txt] = numbered(L[k].text), at = L[k].at, a = E(f, at - 4, 14);
          const lines = wrapText(txt, 36);
          return (
            <g key={k}>
              <rect x={PP.x + 60} y={y - 6} width={PP.w - 120} height={170} rx={10} fill={`rgba(255,238,200,${0.35 * a})`} stroke="#bda46c" strokeWidth={2} strokeDasharray={a > 0.5 ? "0" : "10 8"} opacity={slots(a)}/>
              <g opacity={slots(a)}>
                <circle cx={PP.x + 120} cy={y + 80} r={38} fill="none" stroke="#2a2620" strokeWidth={3}/>
                <text x={PP.x + 120} y={y + 92} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={n.length > 1 ? 34 : 40} fill="#1d1a16" opacity={a}>{n}</text>
              </g>
              <Printed id={`g3pq-${k}`} x={TX} y={y + 66} lines={lines} size={46} f={f} at={at} len={34}/>
            </g>
          );
        })}
        {/* the four option lines of the paper: plain grey bars, nothing marked */}
        {[0, 1, 2, 3].map((i) => <g key={i} opacity={0.8}><circle cx={PP.x + 100} cy={PP.y + 700 + i * 28} r={9} fill="none" stroke="#b9ad92" strokeWidth={2}/><rect x={PP.x + 128} y={PP.y + 694 + i * 28} width={160 + (i % 2) * 120} height={12} rx={6} fill="#d8cfba"/></g>)}
      </g>
      {/* a paper clip, an eraser */}
      <g transform={`translate(${PP.x + 118} ${PP.y - 12}) rotate(-8)`} opacity={a0}><path d="M0,0 V56 Q0,76 14,76 Q28,76 28,56 V12 Q28,0 18,0 Q8,0 8,12 V50" stroke="#8a95a0" strokeWidth={5} fill="none" strokeLinecap="round"/></g>
      <g transform="translate(1640 760) rotate(-12)" opacity={a0}><rect x={-44} y={-22} width={88} height={44} rx={8} fill="#e9e1cf" stroke="#9a8a68" strokeWidth={2.4}/><rect x={-44} y={-22} width={36} height={44} rx={8} fill="#6a8fb5"/></g>
      <Pencil x={pxx} y={pyy} rot={rot}/>
    </g>
  );
};

// ---- answer ----------------------------------------------------------------------------------------------------------------------
const BOARD = {x: 96, y: 64, w: 1728, h: 650};
const PC = {x: 540, y: 448}, R1 = 185, R0 = 98, RI = 222;
const COLS: [string, string][] = [["#3a82c0", "#1d4f7c"], ["#2f9a8a", "#17625a"], ["#e8a52e", "#8a5a10"], ["#9a6fa0", "#5e3c78"], ["#6aa04a", "#3a6a24"]];
const SIZES = [100, 70, 60, 70, 60];                // illustrative shares of a group loan: unequal parts of one whole

const ang2 = (a: number) => (a * Math.PI) / 180;
const wedge = (a0: number, a1: number, r1: number, r0: number) => {
  const p = (a: number, r: number) => `${(PC.x + r * Math.cos(ang2(a))).toFixed(1)},${(PC.y + r * Math.sin(ang2(a))).toFixed(1)}`;
  const big = a1 - a0 > 180 ? 1 : 0;
  if (a1 - a0 >= 359.9) return `M${p(a0, r1)} A${r1},${r1} 0 1 1 ${p(a0 + 180, r1)} A${r1},${r1} 0 1 1 ${p(a0 + 360, r1)} L${p(a0 + 360, r0)} A${r0},${r0} 0 1 0 ${p(a0 + 180, r0)} A${r0},${r0} 0 1 0 ${p(a0, r0)} Z`;
  return `M${p(a0, r1)} A${r1},${r1} 0 ${big} 1 ${p(a1, r1)} L${p(a1, r0)} A${r0},${r0} 0 ${big} 0 ${p(a0, r0)} Z`;
};

const Factory: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={44} rx={62} ry={9} fill="#2a1808" opacity={0.28}/>
    <rect x={-52} y={-8} width={104} height={52} fill="#d9c9a8" stroke="#8a7a58" strokeWidth={2.4}/>
    <path d="M-52,-8 L-52,-30 L-26,-8 L-26,-30 L0,-8 L0,-30 L26,-8 L26,-30 L52,-8 Z" fill="#b8a888" stroke="#8a7a58" strokeWidth={2}/>
    <rect x={30} y={-58} width={16} height={40} fill="#a5503a" stroke="#6e2a1c" strokeWidth={2}/>
    {[0, 1, 2].map((i) => <rect key={i} x={-38 + i * 30} y={8} width={20} height={18} fill="#8fb4cc" stroke="#4a6074" strokeWidth={1.6}/>)}
    <rect x={-8} y={24} width={20} height={20} fill="#5a3a22"/>
    {[0, 1, 2].map((i) => { const u = (f * 0.014 + i / 3) % 1; return <ellipse key={i} cx={38 + u * 22} cy={-64 - u * 52} rx={10 + u * 14} ry={7 + u * 9} fill="#fff" opacity={0.6 * (1 - u)}/>; })}
  </g>
);

const AnswerArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), bq = L.bq.at, bg = L.bg.at, cl = L.cl.at, ans = L.ans.at, nk = L.nk.at;
  const a0 = E(f, 0, 24);
  // ---- the ring: one lender holds the whole loan until bg, then it is cut into shares ----
  const A0 = 180 - SIZES[0] / 2, cum = SIZES.reduce<number[]>((o, s, i) => { o.push((o[i] ?? 0) + s); return o; }, [0]);
  const bk = [0, 1, 2, 3, 4].map((i) => E(f, bg + i * 9, 34));
  const B = Array.from({length: 6}, (_, i) => i === 0 ? A0 : i === 5 ? A0 + 360 : lerp(A0 + 360, A0 + cum[i], bk[i]));
  const ex = (i: number) => { const mid = ang2((B[i] + B[i + 1]) / 2); return [Math.cos(mid) * 12 * bk[Math.max(1, i)] , Math.sin(mid) * 12 * bk[Math.max(1, i)]]; };
  const mids = SIZES.map((s, i) => A0 + cum[i] + s / 2);
  // ---- the notebook strip ----
  const nbA = E(f, ans - 40, 34);
  const NP = {x: 250, y: 726, w: 1100, h: 192};
  const rest = parts(L.ans.text).slice(1).join(" · "), head = parts(L.ans.text)[0];
  const SZ = 58, wr = ans + 6;
  const tipX = NP.x + 150 + inkW(rest, SZ) * eo(prog(f, wr, 40));
  const pm = E(f, wr - 24, 22) * (1 - E(f, wr + 44, 26));
  const pen = {x: lerp(2010, tipX + 4, pm), y: lerp(930, NP.y + 148, pm), rot: -30};
  const nkA = E(f, nk, 20);
  const gaugeA = E(f, cl, 26), blockA = E(f, cl + 14, 26);
  const parts2 = L.cl.text.split(/\s+and\s+/i);
  return (
    <g>
      <G3Defs/>
      <DeskBG f={f} id="g3ad" mug={false}/>
      {/* the board */}
      <g opacity={a0}>
        <rect x={BOARD.x + 12} y={BOARD.y + 24} width={BOARD.w} height={BOARD.h} rx={26} fill="#2a1808" opacity={0.34} filter="url(#e3-glow)"/>
        <rect x={BOARD.x - 12} y={BOARD.y - 12} width={BOARD.w + 24} height={BOARD.h + 24} rx={30} fill="#7a5630" stroke="#4e361c" strokeWidth={3}/>
        <rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx={20} fill="url(#f3-paper)" stroke="#cbb88a" strokeWidth={2}/>
        {Array.from({length: 17}, (_, i) => <path key={`v${i}`} d={`M${BOARD.x + 40 + i * 102},${BOARD.y + 14} V${BOARD.y + BOARD.h - 14}`} stroke="#bcd0e0" strokeWidth={1} opacity={0.5}/>)}
        {Array.from({length: 7}, (_, i) => <path key={`h${i}`} d={`M${BOARD.x + 14},${BOARD.y + 50 + i * 94} H${BOARD.x + BOARD.w - 14}`} stroke="#bcd0e0" strokeWidth={1} opacity={0.5}/>)}
        {[[BOARD.x + 30, BOARD.y + 30], [BOARD.x + BOARD.w - 30, BOARD.y + 30], [BOARD.x + 30, BOARD.y + BOARD.h - 30], [BOARD.x + BOARD.w - 30, BOARD.y + BOARD.h - 30]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={11} fill="#c63f2f" stroke="#7a1d12" strokeWidth={2}/><circle cx={x - 3} cy={y - 3} r={3.4} fill="#fff" opacity={0.6}/></g>)}
      </g>
      {/* the ring of shares around one borrower */}
      <g opacity={a0}>
        <ellipse cx={PC.x + 8} cy={PC.y + R1 + 26} rx={R1 * 0.9} ry={20} fill="#2a1808" opacity={0.2} filter="url(#ak-blur8)"/>
        <circle cx={PC.x} cy={PC.y} r={R0 + 6} fill="#fffdf3" stroke="#8e7a52" strokeWidth={3}/>
        <circle cx={PC.x} cy={PC.y} r={R0 - 6} fill="url(#ak-sunglow)" opacity={0.5}/>
        {SIZES.map((_, i) => {
          const [dx, dy] = ex(i);
          if (B[i + 1] - B[i] < 0.5) return null;
          return <path key={i} d={wedge(B[i], B[i + 1], R1, R0)} fill={COLS[i][0]} stroke={COLS[i][1]} strokeWidth={3} strokeLinejoin="round" transform={`translate(${dx} ${dy})`} filter="url(#e3-sh-s)"/>;
        })}
        <path d={`M${PC.x - R1 * 0.7},${PC.y - R1 * 0.62} A${R1 * 0.95},${R1 * 0.95} 0 0 1 ${PC.x + R1 * 0.2},${PC.y - R1 * 0.95}`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.35}/>
        <Factory x={PC.x} y={PC.y - 8} s={1.0} f={f}/>
        {/* the lenders: one before bg, five after */}
        {mids.map((m, i) => {
          const a = i === 0 ? 1 : bk[i], x = PC.x + Math.cos(ang2(m)) * RI, y = PC.y + Math.sin(ang2(m)) * RI + 34;
          return (
            <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 16})`}>
              <MiniBank x={x} y={y + 6} w={74} h={84} door={i === 0 ? 0 : 0.5 * bk[i]} f={f} tone={[["#e6dac0", "#bfae8a"], ["#dfe6d8", "#a9b39c"], ["#e8dcc4", "#bfae8a"], ["#e0dae8", "#aaa2b8"], ["#e6e2c8", "#b3ad8a"]][i] as [string, string]}/>
              <circle cx={x} cy={y - 84} r={7} fill={COLS[i][0]} stroke={COLS[i][1]} strokeWidth={2}/>
            </g>
          );
        })}
        {/* a little money from every lender to the borrower once the loan is shared */}
        {bk[4] > 0.6 ? mids.map((m, i) => { const u = ((f * 0.014 + i / 5) % 1), x0 = PC.x + Math.cos(ang2(m)) * (RI - 28), y0 = PC.y + Math.sin(ang2(m)) * (RI - 28) + 6, x1 = PC.x + Math.cos(ang2(m)) * (R0 - 14), y1 = PC.y + Math.sin(ang2(m)) * (R0 - 14);
          return <Coin key={i} x={lerp(x0, x1, u)} y={lerp(y0, y1, u)} r={9} spin={f / 5 + i} op={Math.min(1, u * 6, (1 - u) * 6) * bk[4]}/>; }) : null}
      </g>
      {/* the BIS pin (bq): a small plate pinned beside the ring */}
      <HangTag x={980} y={BOARD.y + 24} w={150} h={74} text={((/[A-Z]{2,}/.exec(L.bq.text) ?? [""])[0])} a={E(f, bq, 18)} size={34} f={f} rot={4} edge="#2f4a8a" ink="#1d2f5c" sub=""/>
      {/* the credit line and the lump sum (cl) */}
      <g opacity={0.14 * (1 - gaugeA)}><circle cx={1250} cy={438} r={105} fill="none" stroke="#6a5a3a" strokeWidth={4} strokeDasharray="10 12"/><rect x={1500} y={388} width={240} height={110} rx={14} fill="none" stroke="#6a5a3a" strokeWidth={4} strokeDasharray="10 12"/></g>
      <g opacity={gaugeA} transform={`translate(0 ${(1 - gaugeA) * 24})`}>
        <rect x={1120} y={540} width={260} height={46} rx={10} fill="#9a6a3a" stroke="#5e3c1e" strokeWidth={3}/>
        <rect x={1120} y={540} width={260} height={10} rx={5} fill="#d8aa72" opacity={0.7}/>
        <Gauge x={1250} y={438} r={104} ang={46 * Math.sin(f / 44)} glow={0.35}/>
        <HangTag x={1250} y={BOARD.y + 150} w={250} h={64} text="SYNDICATED" a={1} size={28} f={f} rot={-2} edge="#2f4a8a" ink="#1d2f5c"/>
        <text x={1250} y={620} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} fill="#5e2a0e">{parts2[0]}</text>
      </g>
      <g opacity={blockA} transform={`translate(0 ${(1 - blockA) * 24})`}>
        <rect x={1480} y={540} width={280} height={46} rx={10} fill="#9a6a3a" stroke="#5e3c1e" strokeWidth={3}/>
        <rect x={1480} y={540} width={280} height={10} rx={5} fill="#d8aa72" opacity={0.7}/>
        <g transform="translate(1620 534)"><GoldBar s={2.9} glow={0.4}/></g>
        <HangTag x={1620} y={BOARD.y + 150} w={250} h={64} text="SYNDICATED" a={1} size={28} f={f} rot={2} edge="#2f4a8a" ink="#1d2f5c"/>
        <text x={1620} y={620} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} fill="#5e2a0e">{parts2[1] ?? ""}</text>
      </g>
      {/* ---- the notebook strip with our own line, the stamp, and the key we did not read ---- */}
      <g opacity={nbA} transform={`translate(0 ${(1 - nbA) * 70})`}>
        <NotePage x={NP.x} y={NP.y} w={NP.w} h={NP.h} pitch={64} first={104}/>
        <Ink id="g3ad-ans" x={NP.x + 150} y={NP.y + 140} text={rest} size={SZ} f={f} start={wr} len={40} maxW={inkW(rest, SZ) + 30}/>
      </g>
      <Pencil x={pen.x} y={pen.y} rot={pen.rot}/>
      <Stamp x={NP.x + 800} y={NP.y + 58} text={head} f={f} at={ans + 56} rot={-5} size={36} col="#2f4a8a"/>
      <g opacity={nkA} transform={`translate(0 ${(1 - nkA) * 20})`}>
        <g transform="translate(1640 905) scale(0.6)">
          <ellipse cx={4} cy={4} rx={110} ry={12} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
          <path d="M-100,0 V-112 Q-100,-124 -88,-124 H-30 L-14,-140 H90 Q102,-140 102,-128 V0 Z" fill="#a9a08c" stroke="#6e6652" strokeWidth={3}/>
          <rect x={-100} y={-104} width={202} height={104} rx={6} fill="#c3baa4" stroke="#6e6652" strokeWidth={3}/>
          <path d="M-100,-60 H102" stroke="#6e6652" strokeWidth={2} opacity={0.5}/>
          <path d="M-4,-104 V0" stroke="#8a2a22" strokeWidth={9} opacity={0.8}/>
          <path d="M-14,-52 H6" stroke="#6e6652" strokeWidth={4} strokeLinecap="round"/>
        </g>
      </g>
      <Specks f={f} n={10} seed={11} y0={100} y1={700}/>
    </g>
  );
};

export const SyndicatedArt: React.FC<AP> = (p) => ((p.spec as any).mode === "answer" ? <AnswerArt {...p}/> : <QuestionArt {...p}/>);

export const SyndicatedLabels: React.FC<AP> = (p) => {
  if ((p.spec as any).mode !== "answer") return null;
  const L = elabs(p), f = p.f;
  return (
    <>
      <ECard cx={540} y={78} text={L.bq.text} f={f} at={L.bq.at} size={30} maxW={600} upper={false} tone="cool"/>
      <ECard cx={1460} y={78} text={L.bg.text} f={f} at={L.bg.at} size={30} maxW={640} upper={false}/>
      <ECard cx={1600} y={740} text={L.nk.text} f={f} at={L.nk.at} size={26} maxW={420} upper={false} tone="warm"/>
    </>
  );
};
