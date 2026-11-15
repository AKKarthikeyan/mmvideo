// ECO-16 Part 3, builder G3: `plan-steps-3`. mode "recap": a trail through a valley with three sign boards (PART 1 money bar, PART 2 ledger, PART 3 a question), a student walks it.
// mode "steps": a notebook page with four handwritten steps ticking in turn, a Prelims tag, and the three-stop path with PART 3 lighting.
// Every word is a spec label (printed from at(key)); the bar in the PART 1 board is drawn from fig(e16_m3).
import React from "react";
import {fig} from "../../cartoon/long/figs";
import {Sun, Cloud, Hills, Tree} from "./analogy_kit";
import {Adult} from "./analogy_e1_kit";
import {path as kpath, px as kpx, walkOf} from "./analogy_f1_kit";
import {DeskBG, NotePage, Ink, Pencil, inkFront, inkW} from "./analogy_f3_kit";
import {G3Defs, HangTag, MiniBank, elabs, parts, numbered, E, SANS, SERIF, W, H, eo, prog, lerp, clamp, type AP} from "./analogy_g3_kit";

const STOP = [340, 960, 1580];
const roadY = (x: number) => 846 + 18 * Math.sin(x / 170);
/** keyframes with strictly increasing times */
const mono = (ks: [number, number][]): [number, number][] => { const o: [number, number][] = []; for (const [t, x] of ks) o.push([o.length ? Math.max(t, o[o.length - 1][0] + 2) : t, x]); return o; };

const Tick: React.FC<{x: number; y: number; k: number; s?: number; c?: string; w?: number}> = ({x, y, k, s = 1, c = "#1f8a4c", w = 9}) => (
  <path d={`M${x},${y} l${17 * s},${19 * s} l${32 * s},${-42 * s}`} fill="none" stroke={c} strokeWidth={w * s} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - k)}/>
);

/** the trail: a wavy road with a lit stretch up to litX */
const Trail: React.FC<{f: number; litX: number; wd?: number}> = ({f, litX, wd = 54}) => {
  const pts = Array.from({length: 52}, (_, i) => -40 + i * 40).map((x) => `${x},${roadY(x).toFixed(1)}`).join(" L");
  return (
    <g>
      <defs><clipPath id="g3p-lit"><rect x={-60} y={640} width={Math.max(1, litX + 60)} height={400}/></clipPath></defs>
      <path d={`M${pts}`} fill="none" stroke="#5e3c1e" strokeWidth={wd + 4} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} transform="translate(0 8)"/>
      <path d={`M${pts}`} fill="none" stroke="#7a5630" strokeWidth={wd + 2} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${pts}`} fill="none" stroke="#ead6a8" strokeWidth={wd - 8} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M${pts}`} fill="none" stroke="#fff6dc" strokeWidth={4} strokeLinecap="round" strokeDasharray="4 22" opacity={0.8}/>
      <g clipPath="url(#g3p-lit)">
        <path d={`M${pts}`} fill="none" stroke="#ffd36a" strokeWidth={wd - 8} strokeLinecap="round" strokeLinejoin="round" opacity={0.78} filter="url(#e3-glow-s)"/>
        <path d={`M${pts}`} fill="none" stroke="#fff0b0" strokeWidth={8} strokeLinecap="round" strokeDasharray="6 20" strokeDashoffset={-f * 1.4}/>
      </g>
    </g>
  );
};

/** a numbered disc on the road */
const Disc: React.FC<{x: number; n: string; lit: number; done: number; f: number}> = ({x, n, lit, done, f}) => {
  const y = roadY(x);
  return (
    <g>
      {lit > 0.01 ? <circle cx={x} cy={y} r={92} fill="url(#ak-sunglow)" opacity={lit * (0.8 + 0.2 * Math.sin(f / 8))}/> : null}
      <ellipse cx={x} cy={y + 30} rx={58} ry={12} fill="#2a1808" opacity={0.35}/>
      <circle cx={x} cy={y} r={38} fill={lit > 0.05 ? "#ffd36a" : done > 0.05 ? "#9bc59a" : "#b3a283"} stroke="#6a4a10" strokeWidth={4}/>
      <circle cx={x} cy={y} r={30} fill="none" stroke="#fff6dc" strokeWidth={1.6} opacity={0.6}/>
      <text x={x} y={y + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={42} fill="#4a2f0a" opacity={done > 0.5 ? 0.35 : 1}>{n}</text>
      {done > 0.01 ? <Tick x={x - 20} y={y + 2} k={done} s={1.0} w={9}/> : null}
    </g>
  );
};

// ---- recap ---------------------------------------------------------------------------------------------------------------------
const Board: React.FC<{cx: number; top: number; w: number; h: number; a: number; lit: number; f: number; head?: string; sub?: string; tick?: number; children?: React.ReactNode; id: string}> =
  ({cx, top, w, h, a, lit, f, head, sub, tick = 0, children, id}) => {
  const ghost = 0.2, vis = ghost + (1 - ghost) * a, rise = (1 - a) * 22, x = cx - w / 2;
  const y0 = roadY(cx);
  return (
    <g>
      {/* two posts */}
      {[x + 60, x + w - 60].map((px, i) => <g key={i} opacity={vis}><rect x={px - 9} y={top + h - 10} width={18} height={y0 - top - h + 10} fill="#7a5630" stroke="#4e361c" strokeWidth={2}/><rect x={px - 9} y={top + h - 10} width={6} height={y0 - top - h + 10} fill="#fff" opacity={0.18}/></g>)}
      <g transform={`translate(0 ${rise})`} opacity={vis}>
        {lit > 0.01 ? <ellipse cx={cx} cy={top + h / 2} rx={w * 0.78} ry={h * 0.7} fill="url(#ak-sunglow)" opacity={lit * (0.7 + 0.15 * Math.sin(f / 10))}/> : null}
        <g filter="url(#e3-sh)">
          <rect x={x} y={top} width={w} height={h} rx={24} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={4}/>
          <rect x={x + 14} y={top + 14} width={w - 28} height={h - 28} rx={14} fill="url(#f1-paper)" stroke="#8a6a2a" strokeWidth={2.4}/>
        </g>
        {[[x + 12, top + 12], [x + w - 12, top + 12], [x + 12, top + h - 12], [x + w - 12, top + h - 12]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={6} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.6}/>)}
        <g opacity={clamp(a * 1.4)}>
          {head ? <text x={cx} y={top + 62} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} letterSpacing={9} fill="#9a5a14">{head}</text> : null}
          {sub ? <text x={cx} y={top + 106} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={38} fill="#5e2a0e">{sub}</text> : null}
          {head ? <path d={`M${x + 60},${top + 124} H${x + w - 60}`} stroke="#c9922a" strokeWidth={2} opacity={0.6}/> : null}
          <g transform={`translate(${x} ${top})`} clipPath={`url(#${id})`}>{children}</g>
        </g>
        {tick > 0.01 ? (
          <g>
            <circle cx={x + w - 8} cy={top + 8} r={34} fill="#e4f3dc" stroke="#2f8a50" strokeWidth={5}/>
            <Tick x={x + w - 26} y={top + 10} k={tick} s={0.7} w={10}/>
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** PART 1: the money bar in miniature (widths from fig e16_m3) */
const MiniMoneyBar: React.FC<{f: number; at: number}> = ({f, at}) => {
  const cash = fig({t: "e16_m3", state: "India", s: "cash"}).value, dep = fig({t: "e16_m3", state: "India", s: "dep"}).value, tot = cash + dep;
  const BW = 410, cw = BW * (cash / tot) * eo(prog(f, at + 10, 26)), dw = BW * (dep / tot) * eo(prog(f, at + 26, 44));
  const x0 = 45, y0 = 250, bh = 112;
  return (
    <g>
      <ellipse cx={250} cy={y0 + bh + 18} rx={230} ry={14} fill="#2a1808" opacity={0.22} filter="url(#ak-blur8)"/>
      <rect x={x0 - 6} y={y0 - 6} width={BW + 12} height={bh + 12} rx={14} fill="#fffdf3" stroke="#8e7a52" strokeWidth={2.4}/>
      <rect x={x0} y={y0} width={cw} height={bh} rx={cw > 10 ? 9 : 0} fill="#e8a52e" stroke="#8a5a10" strokeWidth={2}/>
      <rect x={x0 + cw} y={y0} width={dw} height={bh} fill="#3a82c0" stroke="#1d4f7c" strokeWidth={2}/>
      {dw > 50 ? Array.from({length: 12}, (_, i) => { const cx = x0 + cw + 22 + i * ((dw - 44) / 11); return <rect key={i} x={cx - 6} y={y0 + 12} width={12} height={bh - 24} rx={2} fill="#a6d0ee" opacity={0.55 * clamp((dw - 44) / 200)}/>; }) : null}
      {cw > 20 ? <g transform={`translate(${x0 + cw / 2} ${y0 + bh / 2})`} opacity={clamp(cw / 40)}><circle r={15} fill="#fff1b8" stroke="#8a5a10" strokeWidth={2}/><circle r={9} fill="none" stroke="#b9831f" strokeWidth={1.4}/></g> : null}
      <g opacity={eo(prog(f, at + 20, 20))}>
        <g transform={`translate(${x0 + 30} ${y0 - 18})`}><circle r={0.1}/></g>
        <MiniBank x={x0 + cw + dw * 0.55} y={y0 - 16} w={84} h={100}/>
        <g transform={`translate(${x0 + cw / 2} ${y0 - 24})`}><ellipse cy={10} rx={20} ry={5} fill="#2a1808" opacity={0.25}/><circle r={16} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2}/><circle r={10} fill="none" stroke="#b9831f" strokeWidth={1.4}/></g>
      </g>
    </g>
  );
};

/** PART 2: an open ledger with a new block growing out of the seam */
const MiniLedger: React.FC<{f: number; at: number}> = ({f, at}) => {
  const g = eo(prog(f, at + 18, 46)), dep = eo(prog(f, at + 8, 20));
  return (
    <g transform="translate(250 322) scale(1.12)">
      <ellipse cx={0} cy={44} rx={210} ry={16} fill="#2a1808" opacity={0.25} filter="url(#ak-blur8)"/>
      <path d="M-200,34 L-188,-96 L-4,-84 L-4,42 Z" fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4}/>
      <path d="M200,34 L188,-96 L4,-84 L4,42 Z" fill="#f6efdc" stroke="#b8a074" strokeWidth={2.4}/>
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><path d={`M-176,${-70 + i * 24} L-18,${-62 + i * 24}`} stroke="#8a7a58" strokeWidth={1.8} opacity={0.5}/><path d={`M176,${-70 + i * 24} L18,${-62 + i * 24}`} stroke="#8a7a58" strokeWidth={1.8} opacity={0.5}/></g>)}
      <path d="M-206,40 L206,40 L196,50 L-196,50 Z" fill="#8c2a1c" stroke="#4a1208" strokeWidth={2}/>
      <path d="M0,-86 V44" stroke="#8a7a58" strokeWidth={3} opacity={0.7}/>
      {/* left page: the deposit block and a small reserve block */}
      <g opacity={dep}>
        <rect x={-150} y={-60 + (1 - dep) * 30} width={64} height={96} rx={6} fill="#3a82c0" stroke="#1d4f7c" strokeWidth={2}/>
        <rect x={-76} y={14} width={50} height={22} rx={5} fill="#e8a52e" stroke="#8a5a10" strokeWidth={2}/>
      </g>
      {/* right page: a new block grows */}
      <rect x={52} y={36 - 110 * g} width={78} height={110 * g} rx={7} fill="#2f9a6a" stroke="#14603e" strokeWidth={2.2}/>
      <rect x={58} y={40 - 110 * g} width={20} height={Math.max(0, 110 * g - 8)} rx={4} fill="#fff" opacity={0.18}/>
      {g > 0.1 ? <path d={`M10,${0} Q30,${-16} 48,${34 - 110 * g * 0.5}`} fill="none" stroke="#fff6dc" strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={0.7 * (1 - g)}/> : null}
    </g>
  );
};

/** PART 3: a question and three chips */
const QuestionPanel: React.FC<{f: number; at: number; chips: string[]}> = ({f, at, chips}) => {
  const pulse = 1 + 0.05 * Math.sin(f / 7);
  return (
    <g>
      <g transform={`translate(112 214) scale(${pulse})`}>
        <circle r={92} fill="#ffe9b0" opacity={0.6}/>
        <text y={62} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={176} fill="#d8682a">?</text>
      </g>
      {chips.map((c, i) => {
        const a = eo(prog(f, at + 12 + i * 26, 18)), w = 262;
        return (
          <g key={i} opacity={a} transform={`translate(${206} ${96 + i * 96 + (1 - a) * 16})`}>
            <rect x={0} y={0} width={w} height={72} rx={36} fill="#fff4d2" stroke="#c9822e" strokeWidth={3}/>
            <circle cx={34} cy={36} r={12} fill="#d8682a"/>
            <text x={62} y={47} fontFamily={SANS} fontWeight={800} fontSize={30} fill="#5e2a0e">{c}</text>
          </g>
        );
      })}
    </g>
  );
};

export const PlanRecapArt: React.FC<AP> = (p) => {
  const {f, dur} = p, L = elabs(p), t1 = L.p1.at, t2 = L.p2.at, t3 = L.q.at;
  const ks = mono([[0, -80], [Math.max(8, t1 - 30), STOP[0] - 150], [t1 + 46, STOP[0] - 150], [t2 - 26, STOP[1] - 150], [t2 + 46, STOP[1] - 150], [t3 - 26, STOP[2] - 150]]);
  const wx = kpx(ks, f), wk = walkOf(ks, f), wy = roadY(wx) + 22;
  const litX = wx + 70;
  const p1 = parts(L.p1.text), p2 = parts(L.p2.text), qs = parts(L.q.text);
  const aa = [E(f, t1, 24), E(f, t2, 24), E(f, t3, 24)];
  const dn1 = E(f, t1 + 44, 18), dn2 = E(f, t2 + 44, 18);
  const TOP = 226, BW = 500, BH = 420;
  return (
    <g>
      <G3Defs/>
      <defs>{["g3pc1", "g3pc2"].map((id) => <clipPath key={id} id={id}><rect x={14} y={128} width={BW - 28} height={BH - 142} rx={10}/></clipPath>)}<clipPath id="g3pc3"><rect x={14} y={14} width={BW - 28} height={BH - 28} rx={10}/></clipPath></defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g3-sky)"/>
      <Sun x={1560} y={168} r={56} f={f}/>
      <Cloud x={200} y={150} s={0.9} f={f} seed={2}/><Cloud x={900} y={110} s={0.7} f={f} seed={5} a={0.8}/>
      <Hills id="g3ph1" base={560} amp={70} top="#b8cbd9" bottom="#d3dcd6" seed={1.2} wl={300}/>
      <Hills id="g3ph2" base={650} amp={56} top="#93b894" bottom="#c4d2a0" seed={3.1} wl={240}/>
      <Hills id="g3ph3" base={760} amp={36} top="#7fa862" bottom="#9cc067" seed={5.4} wl={180}/>
      <rect x={-60} y={800} width={W + 120} height={H - 800 + 60} fill="url(#g3-grass)"/>
      {[[110, 740, 0.42], [1830, 730, 0.46], [640, 700, 0.3], [1270, 704, 0.3]].map(([x, y, s], i) => <Tree key={i} x={x} y={y} s={s} f={f} seed={i + 3}/>)}
      <Trail f={f} litX={litX}/>
      <Disc x={STOP[0]} n="1" lit={0} done={dn1} f={f}/>
      <Disc x={STOP[1]} n="2" lit={0} done={dn2} f={f}/>
      <Disc x={STOP[2]} n="3" lit={aa[2]} done={0} f={f}/>
      <Board id="g3pc1" cx={STOP[0]} top={TOP} w={BW} h={BH} a={aa[0]} lit={0} f={f} head={p1[0]} sub={p1[1]} tick={dn1}><MiniMoneyBar f={f} at={t1}/></Board>
      <Board id="g3pc2" cx={STOP[1]} top={TOP} w={BW} h={BH} a={aa[1]} lit={0} f={f} head={p2[0]} sub={p2[1]} tick={dn2}><MiniLedger f={f} at={t2}/></Board>
      <Board id="g3pc3" cx={STOP[2]} top={TOP} w={BW} h={BH} a={aa[2]} lit={aa[2]} f={f}><QuestionPanel f={f} at={t3} chips={qs}/></Board>
      {/* the student walks the trail */}
      <Adult x={wx} y={wy} h={260} f={f} seed={77} look={{kind: "plain", female: true, shirt: ["#4f8f9a", "#2f5f6a"], pants: "#31405a", hair: "#1a120d", skin: 2}} walkAmt={wk} lookX={0.4} smile={0.7} arms={{R: [10, 70]}}
        held={{R: <g transform="translate(0 -1) rotate(-12)"><rect x={-4.4} y={-6} width={9} height={12} rx={1} fill="#5e3c78" stroke="#3a2250" strokeWidth={0.5}/><rect x={-3.4} y={-5} width={7} height={10} fill="#fffdf3"/></g>}}/>
    </g>
  );
};

// ---- steps ---------------------------------------------------------------------------------------------------------------------
const PG = {x: 250, y: 64, w: 1420, h: 520, pitch: 92, first: 124};

export const PlanSteps3Art: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 24));
  const keys = ["s1", "s2", "s3", "s4"];
  const SZ = 54;
  const ws = keys.map((k, i) => { const [n, txt] = numbered(L[k].text); return {k, n, txt, y: PG.y + PG.first + i * PG.pitch - 8, start: L[k].at, len: 34}; });
  // the pencil follows the writing front
  let pxx = PG.x + PG.w - 330, pyy = PG.y + PG.h - 56, rot = -14;
  for (const w of ws) {
    const inn = eo(prog(f, w.start - 14, 14)), out = eo(prog(f, w.start + w.len, 22)), m = inn * (1 - out);
    if (m <= 0) continue;
    pxx = lerp(pxx, inkFront(PG.x + 250, w.txt, SZ, f, w.start, w.len) + 4, m); pyy = lerp(pyy, w.y + 8, m); rot = lerp(rot, -44, m);
  }
  // the path with three stops
  const tPq = L.pq.at, t3 = L.p3.at, lit3 = eo(prog(f, t3, 36));
  const litX = lerp(STOP[1] + 40, STOP[2] + 20, lit3);
  const PS = [330, 960, 1590];
  const roadW = (x: number) => 872 + 14 * Math.sin(x / 170);
  const bd = eo(prog(f, t3, 22));
  const pageA = a0;
  return (
    <g>
      <G3Defs/>
      <DeskBG f={f} id="g3st" mug={false}/>
      <NotePage x={PG.x} y={PG.y} w={PG.w} h={PG.h} a={pageA} pitch={PG.pitch} first={PG.first}/>
      <g opacity={pageA}>
        {ws.map((w, i) => {
          const pop = eo(prog(f, w.start - 6, 12)), tk = eo(prog(f, w.start + w.len + 4, 16));
          return (
            <g key={w.k}>
              <g opacity={0.3 + 0.7 * pop} transform={`translate(${PG.x + 150} ${w.y - 50})`}>
                <rect x={0} y={0} width={68} height={68} rx={12} fill="#fffdf6" stroke="#7a5a3a" strokeWidth={4}/>
                <text x={34} y={50} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={46} fill="#1f3a78" opacity={0.85 - 0.5 * tk}>{w.n}</text>
              </g>
              <Tick x={PG.x + 160} y={w.y - 12} k={tk} s={1.05}/>
              <Ink id={`g3st-${w.k}`} x={PG.x + 250} y={w.y} text={w.txt} size={SZ} f={f} start={w.start} len={w.len} maxW={inkW(w.txt, SZ) + 30}/>
            </g>
          );
        })}
      </g>
      <Pencil x={pxx} y={pyy} rot={rot}/>
      {/* the Prelims tag hangs from the page */}
      <HangTag x={1330} y={PG.y + PG.h + 4} w={500} h={96} text={L.pq.text} a={eo(prog(f, tPq, 18))} size={34} f={f} rot={-4}/>
      {/* the trail */}
      <g opacity={a0}>
        {(() => {
          const pts = Array.from({length: 51}, (_, i) => 130 + i * 36).map((x) => `${x},${roadW(x).toFixed(1)}`).join(" L");
          return (
            <g>
              <defs><clipPath id="g3st-lit"><rect x={0} y={700} width={Math.max(1, litX)} height={300}/></clipPath></defs>
              <path d={`M${pts}`} fill="none" stroke="#6e4a26" strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} transform="translate(0 7)"/>
              <path d={`M${pts}`} fill="none" stroke="#7a5630" strokeWidth={48} strokeLinecap="round" strokeLinejoin="round"/>
              <path d={`M${pts}`} fill="none" stroke="#e8d3a2" strokeWidth={38} strokeLinecap="round" strokeLinejoin="round"/>
              <g clipPath="url(#g3st-lit)">
                <path d={`M${pts}`} fill="none" stroke="#ffd36a" strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} filter="url(#e3-glow-s)"/>
                <path d={`M${pts}`} fill="none" stroke="#fff0b0" strokeWidth={7} strokeLinecap="round" strokeDasharray="6 20" strokeDashoffset={-f * 1.4}/>
              </g>
            </g>
          );
        })()}
        {PS.map((x, i) => {
          const y = roadW(x), done = i < 2 ? eo(prog(f, 14 + i * 12, 20)) : 0, lit = i === 2 ? lit3 : 0;
          return (
            <g key={i}>
              {lit > 0.01 ? <circle cx={x} cy={y} r={84} fill="url(#ak-sunglow)" opacity={lit * (0.8 + 0.2 * Math.sin(f / 8))}/> : null}
              <ellipse cx={x} cy={y + 26} rx={52} ry={11} fill="#2a1808" opacity={0.35}/>
              <circle cx={x} cy={y} r={33} fill={lit > 0.05 ? "#ffd36a" : done > 0.05 ? "#9bc59a" : "#b3a283"} stroke="#6a4a10" strokeWidth={4}/>
              <text x={x} y={y + 13} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={38} fill="#4a2f0a" opacity={done > 0.5 ? 0.35 : 1}>{i + 1}</text>
              {done > 0.01 ? <Tick x={x - 18} y={y + 2} k={done} s={0.9} w={9}/> : null}
            </g>
          );
        })}
        {/* the PART 3 of 3 board */}
        <g opacity={0.2 + 0.8 * bd} transform={`translate(0 ${(1 - bd) * 18})`}>
          <rect x={PS[2] - 8} y={780} width={16} height={Math.max(8, roadW(PS[2]) - 36 - 780)} fill="#7a5630" stroke="#4e361c" strokeWidth={2}/>
          {bd > 0.01 ? <ellipse cx={PS[2]} cy={750} rx={330} ry={86} fill="url(#ak-sunglow)" opacity={bd * 0.7}/> : null}
          <g filter="url(#e3-sh)">
            <rect x={PS[2] - 230} y={680} width={460} height={106} rx={20} fill="#fff1c4" stroke="#c9922a" strokeWidth={4}/>
            <rect x={PS[2] - 218} y={692} width={436} height={82} rx={12} fill="none" stroke="#e6b24a" strokeWidth={1.8}/>
          </g>
          <text x={PS[2]} y={746} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} letterSpacing={7} fill="#8a4a08" opacity={bd}>{L.p3.text}</text>
        </g>
      </g>
    </g>
  );
};

export const PlanSteps3Labels: React.FC<AP> = () => null;
