// ECO-16 Part 2, builder F3: `two-views` (the textbook card and the staff-article card face to face, neither drawn as the winner) and
// `limits-balance` (a loan counter with three weights pressing on it, a dial above, a plaque and a cut tether). Words come from spec labels, shown from at(key).
import React from "react";
import {SANS, SERIF, H, eo} from "../kit";
import {lerp, prog, type AP} from "./analogy_kit";
import {Arrow, Cross, Coin, ECard, F3Defs, Gauge, Hall, PaperCard, Plaque, Quest, Weight, WordBlock, elabs, wrapText, Shade, Spot, CoinHeap} from "./analogy_f3_kit";

// ---- two-views --------------------------------------------------------------------------------------------------------------------
const LC = {x: 130, y: 205, w: 740, h: 520}, RC = {x: 1050, y: 205, w: 740, h: 520};

const BookIcon: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = "#3a78b8"}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-44,-24 Q-22,-34 0,-22 Q22,-34 44,-24 V26 Q22,16 0,28 Q-22,16 -44,26 Z" fill="#fffaf0" stroke={c} strokeWidth={3.4} strokeLinejoin="round"/>
    <path d="M0,-22 V28" stroke={c} strokeWidth={3}/>
    {[-10, 4, 18].map((yy, i) => <g key={i}><path d={`M-36,${yy - 2} Q-20,${yy - 8} -8,${yy - 2}`} stroke={c} strokeWidth={2} fill="none" opacity={0.6}/><path d={`M8,${yy - 2} Q20,${yy - 8} 36,${yy - 2}`} stroke={c} strokeWidth={2} fill="none" opacity={0.6}/></g>)}
  </g>
);
const PaperIcon: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = "#2f8a62"}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-30} width={80} height={60} rx={5} fill="#fffaf0" stroke={c} strokeWidth={3.4}/>
    <rect x={-32} y={-22} width={36} height={14} rx={2} fill={c} opacity={0.75}/>
    {[-2, 8, 18].map((yy, i) => <path key={i} d={`M-32,${yy} H${i === 2 ? 4 : 32}`} stroke={c} strokeWidth={2.4} opacity={0.6} strokeLinecap="round"/>)}
    <rect x={10} y={-22} width={22} height={22} rx={2} fill="none" stroke={c} strokeWidth={2} opacity={0.6}/>
  </g>
);

const Pill: React.FC<{x: number; y: number; w: number; text: string; fill: string; edge: string; a?: number}> = ({x, y, w, text, fill, edge, a = 1}) => (
  <g opacity={a}>
    <rect x={x} y={y} width={w} height={48} rx={14} fill={fill} stroke={edge} strokeWidth={2.4}/>
    <text x={x + w / 2} y={y + 33} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={25} fill="#fff" stroke="rgba(30,15,5,.3)" strokeWidth={0.6} paintOrder="stroke">{text}</text>
  </g>
);

export const TwoViewsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 26));
  const tb = L.tb.at, bo = L.bo.at, mc = L.mc.at, nm = L.nm.at, qb = L.qb.at;
  const [tbHead, tbSub] = L.tb.text.split(": ");
  const sl = (1 - a0) * 130;
  const tbA = eo(prog(f, tb, 16)), boA = eo(prog(f, bo + 6, 18)), mcA = eo(prog(f, mc, 18)), qbA = eo(prog(f, qb, 16));
  const lines = wrapText(L.mc.text, 24);
  const BLU = "#3a78b8", GRN = "#2f9a6a";
  const blk = (t0: number) => eo(prog(f, t0, 14));
  return (
    <g>
      <F3Defs/>
      <Hall f={f} deskY={880} id="f3tv" tone="cool" winX={[330, 960, 1590]}/>
      <Spot id="f3tv-sp" cx={960} cy={470} rx={900} ry={420} a={0.4}/>
      {/* the textbook card */}
      <g transform={`translate(${-sl} 0)`}>
        <PaperCard x={LC.x} y={LC.y} w={LC.w} h={LC.h} tint={BLU} rot={2.2} a={a0}>
          <g opacity={tbA}>
            <BookIcon x={84} y={96} s={1.3}/>
            <text x={150} y={110} fontFamily={SERIF} fontWeight={800} fontSize={58} letterSpacing={3} fill="#2c2418">{tbHead}</text>
            <text x={150} y={156} fontFamily={SANS} fontWeight={700} fontSize={30} fill="#5a4a34">{tbSub}</text>
          </g>
          <WordBlock x={36} y={220} w={188} h={190} text="reserves" fill="#b9892f" edge="#6c4a16" a={blk(tb + 18)} size={34} icon={<g><Coin x={130} y={290} r={28}/><Coin x={104} y={316} r={22}/></g>}/>
          <WordBlock x={276} y={220} w={188} h={190} text="loans" fill="#d1692e" edge="#7c3412" a={blk(tb + 50)} size={34} icon={<g><Coin x={370} y={292} r={30}/></g>}/>
          <WordBlock x={516} y={220} w={188} h={190} text="deposits" fill="#3a82c0" edge="#1d4f7c" a={blk(tb + 82)} size={34} icon={<g><rect x={582} y={262} width={56} height={70} rx={5} fill="#fff" opacity={0.85} stroke="#1d4f7c" strokeWidth={2.4}/><path d="M592,282 H628 M592,298 H628 M592,314 H616" stroke="#1d4f7c" strokeWidth={2.4} opacity={0.7}/></g>}/>
          <Arrow x0={232} x1={268} y={315} p={eo(prog(f, tb + 36, 12))} c="#c9822e" w={9}/>
          <Arrow x0={472} x1={508} y={315} p={eo(prog(f, tb + 68, 12))} c="#c9822e" w={9}/>
          {[0, 1, 2].map((i) => <text key={i} x={130 + i * 240} y={456} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={34} fill="#8e7a52" opacity={blk(tb + 18 + i * 32)}>{i + 1}</text>)}
        </PaperCard>
      </g>
      {/* the staff-article card */}
      <g transform={`translate(${sl} 0)`}>
        <PaperCard x={RC.x} y={RC.y} w={RC.w} h={RC.h} tint={GRN} rot={-2.2} a={a0}>
          <g opacity={boA}>
            <PaperIcon x={84} y={96} s={1.35}/>
            <text x={150} y={112} fontFamily={SERIF} fontWeight={800} fontSize={54} letterSpacing={3} fill="#2c2418">STAFF ARTICLE</text>
          </g>
          <g opacity={mcA}>
            {lines.map((t, i) => <text key={i} x={40} y={188 + i * 40} fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={33} fill="#1f4a3a">{t}</text>)}
          </g>
          <WordBlock x={120} y={262} w={200} h={130} text="loans" fill="#d1692e" edge="#7c3412" a={blk(mc + 16)} size={34} icon={<Coin x={220} y={310} r={24}/>}/>
          <WordBlock x={420} y={262} w={200} h={130} text="deposits" fill="#3a82c0" edge="#1d4f7c" a={blk(mc + 46)} size={34} icon={<g><rect x={500} y={274} width={50} height={56} rx={5} fill="#fff" opacity={0.85} stroke="#1d4f7c" strokeWidth={2.4}/><path d="M510,290 H540 M510,303 H540 M510,316 H530" stroke="#1d4f7c" strokeWidth={2.4} opacity={0.7}/></g>}/>
          <Arrow x0={328} x1={412} y={327} p={eo(prog(f, mc + 32, 14))} c="#c9822e" w={10}/>
          {/* the two crossed-out ideas */}
          <g opacity={eo(prog(f, nm, 14))}>
            <Pill x={26} y={436} w={128} text="deposits" fill="#3a82c0" edge="#1d4f7c"/>
            <Arrow x0={162} x1={226} y={460} c="#9c8a6a" w={8}/>
            <Pill x={234} y={436} w={104} text="loans" fill="#d1692e" edge="#7c3412"/>
            <Pill x={384} y={436} w={134} text="reserves" fill="#b9892f" edge="#6c4a16"/>
            <Arrow x0={526} x1={560} y={460} c="#9c8a6a" w={8}/><Arrow x0={548} x1={582} y={460} c="#9c8a6a" w={8}/>
            <Pill x={590} y={436} w={128} text="deposits" fill="#3a82c0" edge="#1d4f7c"/>
          </g>
          <Cross x={194} y={460} s={0.9} p={eo(prog(f, nm + 22, 18))}/>
          <Cross x={556} y={460} s={0.9} p={eo(prog(f, nm + 40, 18))}/>
        </PaperCard>
      </g>
      <Plaque x={1420} y={150} w={780} text={L.bo.text} f={f} at={bo} size={28}/>
      {/* the quarterly-bulletin tag, a hanging brass-edged label under the staff card */}
      {qbA > 0.001 && (
        <g transform={`translate(1420 ${770 - (1 - qbA) * 16})`} opacity={qbA} filter="url(#e3-sh-s)">
          <path d="M-80,-42 L-54,-28 M80,-42 L54,-28" stroke="#8e7a52" strokeWidth={3}/>
          <rect x={-360} y={-28} width={720} height={52} rx={12} fill="#fff7e4" stroke="#b58a52" strokeWidth={2.4}/>
          <text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={27} fill="#5e2a0e">{L.qb.text}</text>
        </g>
      )}
      {/* a neutral question between the two cards */}
      <Quest x={960} y={470} s={0.78} a={eo(prog(f, 40, 24)) * 0.9} f={f} c="#c9822e"/>
    </g>
  );
};
export const TwoViewsLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <ECard cx={960} y={806} text={L.nm.text} f={p.f} at={L.nm.at} size={34} maxW={1500} upper={false}/>;
};

// ---- limits-balance ---------------------------------------------------------------------------------------------------------------
const CT = {x0: 590, x1: 1430, top: 628, floor: 880};
const WX = [740, 1010, 1280], PLX = 1010, PLW = 780;

const Spring: React.FC<{x: number; y0: number; y1: number; w?: number; turns?: number}> = ({x, y0, y1, w = 46, turns = 7}) => {
  const pts: string[] = [];
  for (let i = 0; i <= turns * 2; i++) pts.push(`${(x + (i % 2 ? w / 2 : -w / 2)).toFixed(1)},${(y0 + ((y1 - y0) * i) / (turns * 2)).toFixed(1)}`);
  const d = `M${x},${y0} L${pts.join(" L")} L${x},${y1}`;
  return <g><path d={d} stroke="#3d2a10" strokeWidth={11} fill="none" strokeLinejoin="round" strokeLinecap="round"/><path d={d} stroke="url(#e2-brass)" strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round"/></g>;
};

export const LimitsBalanceArt: React.FC<{f: number; dur: number; spec: any; at: (k: string) => number}> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 24));
  const wk = [L.pf, L.ru, L.dm];
  // each weight falls from above at its key; the plate dips as each one lands and bounces a little
  const fall = (t0: number) => { const d = prog(f, t0, 15); return {off: 460 * (1 - d * d), landed: eo(prog(f, t0 + 12, 8)), bounce: f > t0 + 15 ? Math.sin((f - t0 - 15) * 0.55) * Math.exp(-(f - t0 - 15) / 9) : 0}; };
  const fs = wk.map((l) => fall(l.at));
  const Lc = fs.reduce((a, b) => a + b.landed / 3, 0), bounce = fs.reduce((a, b) => a + b.bounce, 0);
  const yP = 506 + 48 * Lc + 5 * bounce;
  const exA = eo(prog(f, L.ex.at, 18)), irA = eo(prog(f, L.ir.at, 22)), bbA = eo(prog(f, L.bb.at, 20));
  const [bh, ...br] = L.bb.text.split(" · ");
  const ang = lerp(-70, 12, eo(prog(f, L.ir.at + 6, 40))) + Math.sin(f / 7) * 1.6 * irA;
  const sw = Math.sin(f / 18) * 5;
  return (
    <g>
      <F3Defs/>
      <Hall f={f} deskY={CT.floor} id="f3lb" tone="warm" winX={[250, 1010, 1760]}/>
      <Spot id="f3lb-sp" cx={1010} cy={520} rx={760} ry={420} a={0.4}/>
      {/* the loan counter */}
      <g opacity={a0}>
        <Shade x={1010} y={CT.floor - 2} rx={470} ry={16} o={0.35}/>
        <defs><linearGradient id="f3lb-ct" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9915a"/><stop offset="1" stopColor="#6c3f1d"/></linearGradient></defs>
        <rect x={CT.x0} y={CT.top} width={CT.x1 - CT.x0} height={CT.floor - CT.top} rx={6} fill="url(#f3lb-ct)" stroke="#4a2a10" strokeWidth={3}/>
        <rect x={CT.x0 - 14} y={CT.top - 20} width={CT.x1 - CT.x0 + 28} height={26} rx={8} fill="#e2b87a" stroke="#7c5226" strokeWidth={3}/>
        <rect x={CT.x0 - 14} y={CT.top - 20} width={CT.x1 - CT.x0 + 28} height={7} rx={3} fill="#fff1c4" opacity={0.55}/>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={CT.x0 + 40 + i * 205} y={CT.top + 36} width={175} height={150} rx={8} fill="#8e5a2c" stroke="#4a2a10" strokeWidth={2.4} opacity={0.9}/>)}
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${CT.x0 + 52 + i * 205},${CT.top + 48} h150 v126 h-150 Z`} fill="none" stroke="#e8c690" strokeWidth={1.6} opacity={0.5}/>)}
        <rect x={880} y={CT.top + 66} width={260} height={54} rx={10} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>
        <text x={1010} y={CT.top + 105} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={38} letterSpacing={6} fill="#4a2f0a">LOANS</text>
      </g>
      {/* three springs and the plate */}
      <g opacity={a0}>
        {[PLX - 300, PLX, PLX + 300].map((sx, i) => <Spring key={i} x={sx} y0={yP + 26} y1={CT.top - 22} turns={6}/>)}
        <rect x={PLX - PLW / 2 + 8} y={yP + 12} width={PLW} height={34} rx={9} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
        <rect x={PLX - PLW / 2} y={yP} width={PLW} height={28} rx={8} fill="url(#f3-iron)" stroke="#3d444c" strokeWidth={3}/>
        <rect x={PLX - PLW / 2 + 6} y={yP + 3} width={PLW - 12} height={7} rx={3} fill="#fff" opacity={0.4}/>
      </g>
      {/* the weights */}
      {[{l: L.pf, lines: ["PROFIT"], tint: ["#3f8a63", "#1f4f38"]}, {l: L.ru, lines: ["RULES"], tint: ["#4c6fb0", "#26407a"]}, {l: L.dm, lines: ["DEMAND AND", "PORTFOLIO", "CHOICES"], tint: ["#b8643a", "#6e3216"]}].map((w, i) => {
        const o = fs[i].off;
        if (f < w.l.at) return null;
        return <Weight key={i} x={WX[i]} y={yP + 2 - o} w={250} h={230} lines={w.lines} tint={w.tint as [string, string]} size={w.lines.length > 1 ? 24 : 34}/>;
      })}
      {/* the plaque */}
      {bbA > 0.001 && (
        <g transform={`translate(610 ${140 + (1 - bbA) * -26})`} opacity={bbA}>
          <rect x={-470 + 8} y={-70 + 14} width={940} height={140} rx={14} fill="#2a1808" opacity={0.3}/>
          <rect x={-470} y={-70} width={940} height={140} rx={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3.4}/>
          <rect x={-458} y={-58} width={916} height={116} rx={9} fill="none" stroke="#6c4a16" strokeWidth={1.8} opacity={0.7}/>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <g key={k} transform={`translate(${i * 440} ${j * 48})`}><circle r={6} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.4}/><path d="M-3.5,-3.5 L3.5,3.5" stroke="#6c4a16" strokeWidth={1.4}/></g>)}
          <text x={0} y={-4} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} letterSpacing={8} fill="#fff1bd" opacity={0.7} transform="translate(0 2)">{bh}</text>
          <text x={0} y={-4} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} letterSpacing={8} fill="#4a2f0a">{bh}</text>
          <text x={0} y={40} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={31} letterSpacing={3} fill="#4a2f0a">{br.join(" · ")}</text>
        </g>
      )}
      {/* the reserves crate and the cut tether */}
      {exA > 0.001 && (
        <g opacity={exA}>
          <Shade x={300} y={CT.floor - 14} rx={150} ry={14} o={0.35}/>
          <rect x={196} y={724} width={216} height={140} rx={8} fill="#a87a44" stroke="#5a3a18" strokeWidth={3}/>
          {[0, 1, 2].map((i) => <rect key={i} x={196} y={736 + i * 40} width={216} height={6} fill="#5a3a18" opacity={0.35}/>)}
          <rect x={196} y={724} width={216} height={22} rx={6} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
          <rect x={190} y={724} width={14} height={140} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/><rect x={404} y={724} width={14} height={140} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
          <CoinHeap x={304} y={724} n={10} r={24} seed={4}/>
          {/* the chain: its two halves hang apart */}
          {[0, 1, 2, 3].map((i) => <ellipse key={`a${i}`} cx={426 + i * 26 + sw * 0.1 * i} cy={782 + i * 1.5 + Math.sin(f / 14 + i) * 1.5} rx={15} ry={8.5} fill="none" stroke="#6a5a42" strokeWidth={5} transform={`rotate(${i % 2 ? 0 : 90} ${426 + i * 26} ${782 + i * 1.5})`}/>)}
          {[0, 1, 2].map((i) => <ellipse key={`b${i}`} cx={CT.x0 - 18 - i * 26 - sw * 0.1 * i} cy={770 + Math.sin(f / 13 + i) * 1.5} rx={15} ry={8.5} fill="none" stroke="#6a5a42" strokeWidth={5} transform={`rotate(${i % 2 ? 90 : 0} ${CT.x0 - 18 - i * 26} 770)`}/>)}
          <Cross x={(426 + 3 * 26 + CT.x0 - 18 - 2 * 26) / 2 + 2} y={776} s={0.7} p={eo(prog(f, L.ex.at + 14, 18))}/>
        </g>
      )}
      {/* the interest-rate dial and its linkage to the plate */}
      {irA > 0.001 && (
        <g opacity={irA}>
          <path d={`M1560,506 C1560,540 1500,550 1420,${yP + 14}`} stroke="#3d2a10" strokeWidth={16} fill="none" strokeLinecap="round"/>
          <path d={`M1560,506 C1560,540 1500,550 1420,${yP + 14}`} stroke="url(#e2-brass)" strokeWidth={10} fill="none" strokeLinecap="round"/>
          <path d={`M1560,506 C1560,540 1500,550 1420,${yP + 14}`} stroke="#fff6c8" strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray="2 24" strokeDashoffset={-f * 1.2} opacity={0.8}/>
          <circle cx={1432} cy={yP + 14} r={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
          <Gauge x={1560} y={400} r={108} ang={ang} glow={0.5 + 0.2 * Math.sin(f / 10)} zones={false}/>
        </g>
      )}
    </g>
  );
};
export const LimitsBalanceLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <ECard cx={352} y={462} text={L.ex.text} f={p.f} at={L.ex.at} size={30} maxW={500} upper={false}/>
      <ECard cx={1560} y={128} text={L.ir.text} f={p.f} at={L.ir.at} size={28} maxW={520} upper={false} tone="cool"/>
    </>
  );
};
export { H };
