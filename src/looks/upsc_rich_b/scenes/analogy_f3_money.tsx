// ECO-16 Part 2, builder F3: `deposit-insurance` (a passbook under a clear umbrella, a coin stack sized from e16_ins, the premium arrow, a ghosted queue and the stated aim; the picture never shows
// the cover stopping a run) and `spread` (two same-sized stacks of lent rupees; the coin counts in the till come from e16_spread: earn, cost, gap). Words from spec labels, at(key).
import React from "react";
import {fig} from "../../cartoon/long/figs";
import {SANS, SERIF, eo, eio} from "../kit";
import {lerp, prog, FlowArrow, type AP} from "./analogy_kit";
import {Brace, Bundle, Classical, Coin, CoinHeap, ECard, F3Defs, Hall, Person, Shade, Specks, Tag, elabs} from "./analogy_f3_kit";

// ---- shared small parts -----------------------------------------------------------------------------------------------------------
const CoinStack: React.FC<{x: number; y: number; n: number; rx?: number; thick?: number; a?: number}> = ({x, y, n, rx = 62, thick = 22, a = 1}) => (
  <g opacity={a}>
    <ellipse cx={x + 10} cy={y + 4} rx={rx * 1.1} ry={13} fill="#2a1808" opacity={0.34} filter="url(#ak-blur8)"/>
    {Array.from({length: n}, (_, i) => {
      const yb = y - i * thick;
      return (
        <g key={i}>
          <path d={`M${x - rx},${yb - thick} V${yb} A${rx},${rx * 0.3} 0 0 0 ${x + rx},${yb} V${yb - thick} Z`} fill="url(#e2-gold)" stroke="#8c5f18" strokeWidth={2}/>
          <path d={`M${x + rx * 0.3},${yb - thick + 4} V${yb + 2} A${rx},${rx * 0.3} 0 0 0 ${x + rx},${yb} V${yb - thick} Z`} fill="#000" opacity={0.16}/>
          {Array.from({length: 7}, (_, k) => <path key={k} d={`M${x - rx + 12 + k * (rx * 2 - 24) / 6},${yb - thick + 4} V${yb - 2}`} stroke="#8c5f18" strokeWidth={1.2} opacity={0.45}/>)}
        </g>
      );
    })}
    <ellipse cx={x} cy={y - n * thick} rx={rx} ry={rx * 0.3} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2.4}/>
    <ellipse cx={x} cy={y - n * thick} rx={rx * 0.74} ry={rx * 0.2} fill="none" stroke="#b9831f" strokeWidth={1.6} opacity={0.8}/>
  </g>
);

const Slab: React.FC<{x: number; y: number; w: number; h: number; d?: number; c: [string, string, string]; glow?: number; a?: number}> = ({x, y, w, h, d = 40, c, glow = 0, a = 1}) => {
  if (a <= 0.002) return null;
  return (
    <g opacity={a}>
      {glow > 0.01 && <ellipse cx={x + d / 2} cy={y - h / 2} rx={w * 0.75} ry={34} fill="url(#ak-sunglow)" opacity={glow}/>}
      <polygon points={`${x + w / 2},${y} ${x + w / 2 + d},${y - d * 0.5} ${x + w / 2 + d},${y - h - d * 0.5} ${x + w / 2},${y - h}`} fill={c[2]} stroke={c[1]} strokeWidth={1.6}/>
      <polygon points={`${x - w / 2},${y - h} ${x + w / 2},${y - h} ${x + w / 2 + d},${y - h - d * 0.5} ${x - w / 2 + d},${y - h - d * 0.5}`} fill="#fff" opacity={0.5} stroke={c[1]} strokeWidth={1.6}/>
      <polygon points={`${x - w / 2},${y - h} ${x + w / 2},${y - h} ${x + w / 2 + d},${y - h - d * 0.5} ${x - w / 2 + d},${y - h - d * 0.5}`} fill={c[0]} opacity={0.75}/>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={c[0]} stroke={c[1]} strokeWidth={2}/>
    </g>
  );
};

// ---- deposit-insurance ------------------------------------------------------------------------------------------------------------
const UM = {cx: 553, hw: 300, top: 247, rim: 455};

export const DepositInsuranceArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 26));
  const lakh = fig({t: "e16_ins", state: "India", s: "lakh"}), n = Math.round(lakh.value);
  const diA = eo(prog(f, L.di.at, 22)), capK = eio(prog(f, L.cap.at, 38)), piA = eo(prog(f, L.pi.at, 18)), prK = eo(prog(f, L.pr.at, 40)), aimA = eo(prog(f, L.aim.at, 24));
  const [diH, ...diR] = L.di.text.split(" · ");
  const rib = Array.from({length: 6}, (_, i) => UM.cx - UM.hw + (i * UM.hw * 2) / 5);
  const scal = Array.from({length: 5}, (_, i) => `Q${UM.cx + UM.hw - i * (UM.hw * 2) / 5 - UM.hw / 5},${UM.rim + 30} ${UM.cx + UM.hw - (i + 1) * (UM.hw * 2) / 5},${UM.rim}`).join(" ");
  const dome = `M${UM.cx - UM.hw},${UM.rim} Q${UM.cx - UM.hw},${UM.top + 12} ${UM.cx},${UM.top} Q${UM.cx + UM.hw},${UM.top + 12} ${UM.cx + UM.hw},${UM.rim} ${scal} Z`;
  const bob = Math.sin(f / 30) * 2;
  const sx = lerp(950, 700, capK), stackA = eo(prog(f, L.cap.at, 12));
  const stackTop = 790 - n * 22;
  const qa = aimA * 0.3;
  return (
    <g>
      <F3Defs/>
      <Hall f={f} deskY={800} id="f3di" tone="warm" winX={[200, 700, 1180, 1700]}/>
      {/* the umbrella: a clear canopy on a brass stand */}
      <g opacity={diA} transform={`translate(0 ${bob})`}>
        <Shade x={UM.cx} y={792} rx={80} ry={13} o={0.36}/>
        <ellipse cx={UM.cx} cy={788} rx={62} ry={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>
        <rect x={UM.cx - 7} y={UM.top} width={14} height={544} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
      </g>
      {/* the passbook */}
      <g opacity={a0}>
        <Shade x={440} y={792} rx={100} ry={12} o={0.36}/>
        <g transform="rotate(-4 440 790)">
          <rect x={364} y={590} width={168} height={202} rx={8} fill="#1d4a78" stroke="#10304f" strokeWidth={3}/>
          <rect x={364} y={590} width={168} height={202} rx={8} fill="url(#f3-glass)" opacity={0.25}/>
          <rect x={364} y={590} width={22} height={202} rx={6} fill="#0f2f50" opacity={0.7}/>
          <rect x={522} y={600} width={10} height={182} fill="#f6efe0" opacity={0.8}/>
          <rect x={398} y={628} width={112} height={56} rx={6} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
          <text x={454} y={665} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={17} letterSpacing={1.5} fill="#4a2f0a">PASSBOOK</text>
          {[0, 1, 2].map((i) => <path key={i} d={`M404,${712 + i * 20} H${500 - (i % 2) * 24}`} stroke="#f0d78c" strokeWidth={3} strokeLinecap="round" opacity={0.7}/>)}
          <path d="M498,590 V640 L488,630 L478,640 V590" fill="#d6432b" opacity={0.9}/>
        </g>
      </g>
      {/* the coin stack slides under the canopy */}
      {f >= L.cap.at && (
        <g>
          <CoinStack x={sx} y={790} n={n} a={stackA}/>
          <Tag x={sx} y={790 - (n * 22) / 2 + 8} text={`₹${lakh.value.toFixed(0)} LAKH`} a={stackA} size={22} fill="#fff7e4" ink="#5e2a0e" edge="#b58a52"/>
          {piA > 0.01 && <Brace x={sx + 84} y0={stackTop - 14} y1={786} dir={1} p={piA} c="#8a5a10" w={5}/>}
        </g>
      )}
      <g opacity={diA}>
        {/* the clear canopy, drawn over the stack so it really sits under it */}
        <path d={dome} fill="#dff0f8" opacity={0.3} stroke="none"/>
        <path d={dome} fill="url(#f3-glass)" opacity={0.7}/>
        {rib.map((x, i) => <path key={i} d={`M${UM.cx},${UM.top} Q${(x + UM.cx) / 2 + (x - UM.cx) * 0.18},${UM.top + 90} ${x},${UM.rim}`} fill="none" stroke="#8aa6b6" strokeWidth={4} opacity={0.75}/>)}
        <path d={dome} fill="none" stroke="#6f93a8" strokeWidth={5} strokeLinejoin="round"/>
        {rib.map((x, i) => <circle key={i} cx={x} cy={UM.rim + 2} r={7} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.6}/>)}
        <circle cx={UM.cx} cy={UM.top - 6} r={13} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
        <path d={`M${UM.cx - 230},${UM.rim - 100} Q${UM.cx - 180},${UM.top + 40} ${UM.cx - 60},${UM.top + 26}`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55}/>
      </g>
      {/* plaque with the cover's name */}
      {diA > 0.001 && (
        <g transform={`translate(${UM.cx} ${128 + (1 - diA) * -26})`} opacity={diA}>
          <rect x={-320 + 6} y={-58 + 12} width={640} height={118} rx={12} fill="#2a1808" opacity={0.3}/>
          <rect x={-320} y={-58} width={640} height={118} rx={12} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
          <rect x={-310} y={-48} width={620} height={98} rx={7} fill="none" stroke="#6c4a16" strokeWidth={1.6} opacity={0.7}/>
          <text y={2} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={44} letterSpacing={4} fill="#fff1bd" opacity={0.7} transform="translate(0 2)">{diH}</text>
          <text y={2} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={44} letterSpacing={4} fill="#4a2f0a">{diH}</text>
          <text y={38} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} letterSpacing={6} fill="#4a2f0a">{diR.join(" · ")}</text>
        </g>
      )}
      {/* the street panel: the bank and, later, the queue drawn faint */}
      <g opacity={a0}>
        <defs>
          <clipPath id="f3di-pc"><rect x={1060} y={190} width={764} height={590} rx={20}/></clipPath>
          <linearGradient id="f3di-ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9d6ea"/><stop offset="0.7" stopColor="#f0eddb"/><stop offset="1" stopColor="#f8ead0"/></linearGradient>
        </defs>
        <rect x={1070} y={204} width={764} height={590} rx={20} fill="#2a1808" opacity={0.3} filter="url(#e3-glow)"/>
        <g clipPath="url(#f3di-pc)">
          <rect x={1060} y={190} width={764} height={590} fill="url(#f3di-ps)"/>
          {Array.from({length: 7}, (_, i) => <rect key={i} x={1070 + i * 112} y={470 - ((i * 47) % 90)} width={84} height={300} fill={i % 2 ? "#b9c9d8" : "#c6c4d2"} opacity={0.5}/>)}
          <rect x={1060} y={700} width={764} height={90} fill="#d4bd90"/><rect x={1060} y={700} width={764} height={6} fill="#f6e6c4"/>
          <Classical x={1590} y={716} w={340} h={320} text="BANK" id="f3di-bk" cols={6} textSize={30}/>
          <rect x={1560} y={594} width={56} height={118} rx={28} fill="#4a2f1a" opacity={0.85}/>
          {/* a faint queue and one calm saver with a passbook, shown with the stated aim */}
          <g opacity={qa / 0.3 * 0.34}>
            {[0, 1, 2, 3, 4, 5].map((i) => <Person key={i} x={1300 + i * 46} y={730 + (i % 2) * 4} h={206 - (i % 2) * 6} f={f} seed={50 + i} ph={i * 3} op={1}/>)}
            <rect x={1250} y={470} width={330} height={270} fill="#f4efe0" opacity={0.0}/>
          </g>
          <g opacity={aimA}>
            <Person x={1160} y={742} h={246} f={f} seed={9}/>
            <g transform="translate(1210 600) rotate(-8)"><rect x={-22} y={-30} width={44} height={60} rx={4} fill="#1d4a78" stroke="#10304f" strokeWidth={2.4}/><rect x={-14} y={-18} width={28} height={14} rx={2} fill="url(#e2-brass)"/></g>
          </g>
        </g>
        <rect x={1060} y={190} width={764} height={590} rx={20} fill="none" stroke="#bda46c" strokeWidth={3}/>
      </g>
      {/* the premium flows from the bank to the canopy */}
      <FlowArrow pts={[[1420, 500], [1180, 366], [900, 440]]} f={f} p={prK} w={20} c1="#c9822e" c2="#f5d08a"/>
      {prK > 0.1 && <g opacity={eo(prK * 2)}><Coin x={1428} y={496} r={24}/></g>}
      <Specks f={f} n={10} seed={2} c="#fff6d0" x0={250} x1={860} y0={300} y1={760}/>
    </g>
  );
};
export const DepositInsuranceLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <ECard cx={553} y={806} text={L.cap.text} f={p.f} at={L.cap.at} size={30} maxW={780} upper={false}/>
      <ECard cx={748} y={500} text={L.pi.text} f={p.f} at={L.pi.at} size={26} maxW={330} upper={false} tone="cool"/>
      <ECard cx={1320} y={100} text={L.pr.text} f={p.f} at={L.pr.at} size={30} maxW={640} upper={false}/>
      <ECard cx={1442} y={800} text={L.aim.text} f={p.f} at={L.aim.at} size={26} maxW={740} upper={false} tone="green"/>
    </>
  );
};

// ---- spread -----------------------------------------------------------------------------------------------------------------------
const K = 1.2;                    // px per rupee for the two big stacks (the same scale for lent, earned and owed)
const BASE = 782, SW = 150;

export const SpreadArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 26));
  const lend = fig({t: "e16_spread", state: "India", s: "lend"}).value, earn = fig({t: "e16_spread", state: "India", s: "earn"}).value;
  const cost = fig({t: "e16_spread", state: "India", s: "cost"}).value;
  const H1 = lend * K, he = earn * K, hc = cost * K;
  const spT = L.sp.at, dpT = L.dp.at, lnT = L.ln.at, eaT = L.ea.at;
  // left stack: out to the borrower and back, coming home with the earned slab on top
  const out = eio(prog(f, lnT, 30)), back = eio(prog(f, lnT + 64, 30));
  const lx = 520 - 150 * (out - back), lHop = -16 * Math.sin(Math.PI * clampU(out - back));
  const slabA = eo(prog(f, lnT + 92, 14));
  // right stack: in from the depositor
  const rx = lerp(1636, 1400, eio(prog(f, dpT, 36)));
  const redA = eo(prog(f, dpT + 38, 14));
  // the till: earn coins come in, cost coins leave, gap coins stay
  const inK = eo(prog(f, eaT, 34)), nIn = Math.floor(earn * inK + 1e-6);
  const gone = (j: number) => eio(prog(f, eaT + 56 + j * 7, 34));
  const nOut = Array.from({length: Math.round(cost)}, (_, j) => (gone(j) > 0.02 ? 1 : 0)).reduce((a: number, b: number) => a + b, 0);
  const heap = Math.max(0, nIn - nOut);
  const glowK = eo(prog(f, eaT + 56 + cost * 7 + 34, 24));
  const slabFly = eio(prog(f, eaT - 6, 34));
  const redFly = eo(prog(f, eaT + 54, 18));
  const goldStay = slabA * (1 - eo(prog(f, eaT - 6, 6)));
  const goldY = lerp(BASE - H1 - 6, 650, slabFly), goldX = lerp(520, 960, slabFly);
  return (
    <g>
      <F3Defs/>
      <Hall f={f} deskY={800} id="f3sp" tone="cool" winX={[330, 960, 1590]}/>
      {/* people at the two ends */}
      <g opacity={a0}>
        <g transform="translate(150 0) scale(0.8) translate(0 150)"><rect x={-90} y={BASE - 150} width={160} height={150} fill="#f0d9a8" stroke="#8a6a32" strokeWidth={3}/><path d="M-102,632 L-10,572 L82,632 Z" fill="#b5503a" stroke="#6e2a1a" strokeWidth={3}/><rect x={-30} y={BASE - 100} width={36} height={100} rx={3} fill="#7a4a24"/></g>
        <Person x={226} y={BASE + 8} h={282} f={f} seed={12}/>
        <Person x={1810} y={BASE + 8} h={282} f={f} seed={3} flip/>
      </g>
      {/* a clerk behind the till */}
      <g opacity={a0}><Person x={860} y={668} h={200} f={f} seed={27}/></g>
      {/* the till */}
      <g opacity={a0}>
        <Shade x={960} y={BASE + 6} rx={230} ry={16} o={0.4}/>
        <path d={`M790,628 L1130,628 L1160,${BASE - 30} L760,${BASE - 30} Z`} fill="#2a1d12" stroke="#4a2a10" strokeWidth={3}/>
        {[0, 1, 2].map((i) => <rect key={i} x={800 + i * 112} y={640} width={104} height={42} rx={5} fill="#3d2a1a" opacity={0.8}/>)}
        <rect x={760} y={BASE - 34} width={400} height={70} rx={8} fill="url(#e2-wood)" stroke="#4a2a10" strokeWidth={3}/>
        <rect x={776} y={BASE - 22} width={368} height={46} rx={6} fill="none" stroke="#e8c690" strokeWidth={2} opacity={0.6}/>
        <rect x={926} y={BASE - 14} width={68} height={22} rx={10} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
        {glowK > 0.01 && <ellipse cx={960} cy={650} rx={150} ry={90} fill="url(#ak-sunglow)" opacity={glowK * (0.7 + 0.25 * Math.sin(f / 9))}/>}
        <CoinHeap x={960} y={690} n={heap} r={34} seed={6}/>
      </g>
      {/* coins that leave the till toward the depositor (the cost) */}
      {Array.from({length: Math.round(cost)}, (_, j) => {
        const g = gone(j);
        if (g <= 0.01 || g >= 0.999) return null;
        const x = lerp(990, 1690, g), y = lerp(640, 600, g) - 120 * Math.sin(Math.PI * g);
        return <Coin key={j} x={x} y={y} r={32} spin={g * 8} op={1 - g * 0.5}/>;
      })}
      {/* the loan goes out and comes back; the deposit comes in */}
      <FlowArrow pts={[[440, 420], [350, 390], [270, 424]]} f={f} p={out * (1 - back)} w={18} c1="#3a82c0" c2="#a9d1ee"/>
      <FlowArrow pts={[[270, 468], [355, 496], [440, 466]]} f={f} p={back} w={18} c1="#e2a42c" c2="#f9de92" op={1}/>
      <FlowArrow pts={[[1730, 420], [1640, 392], [1560, 424]]} f={f} p={eo(prog(f, dpT, 30))} w={18} c1="#3a9a62" c2="#a9e4c0"/>
      {/* the left stack */}
      <g opacity={a0} transform={`translate(${lx - 520} ${lHop})`}>
        <Shade x={520 + 20} y={BASE + 4} rx={110} ry={13} o={0.36}/>
        <Bundle x={520} y={BASE} w={SW} h={H1} d={40}/>
        <Slab x={520} y={BASE - H1} w={SW} h={he * slabA} d={40} c={["#f2c24a", "#9a6a10", "#c99020"]} glow={0.7 * slabA} a={goldStay}/>
      </g>
      {/* the right stack */}
      <g opacity={a0}>
        <Shade x={rx + 20} y={BASE + 4} rx={110} ry={13} o={0.36}/>
        <Bundle x={rx} y={BASE} w={SW} h={H1} d={40}/>
        <Slab x={rx} y={BASE - H1} w={SW} h={hc} d={40} c={["#e8705a", "#8a2a1a", "#b8402c"]} glow={0.7 * redA} a={redA * (1 - redFly)}/>
      </g>
      {/* the gold slab flies to the till */}
      {slabFly > 0.001 && slabFly < 0.999 && (
        <g opacity={1 - eo(prog(f, eaT + 18, 18))}><Slab x={goldX} y={goldY} w={SW * (1 - 0.5 * slabFly)} h={he} d={40 * (1 - 0.5 * slabFly)} c={["#f2c24a", "#9a6a10", "#c99020"]} glow={0.6}/></g>
      )}
      {/* a brass rule between the stacks marks the same lent sum */}
      <g opacity={eo(prog(f, spT, 20)) * 0.9}>
        <path d={`M${520 + SW / 2 + 60},${BASE - H1} H${rx - SW / 2 - 20}`} stroke="#8a5a10" strokeWidth={3} strokeDasharray="4 12" opacity={0.7} strokeLinecap="round"/>
      </g>
      <Specks f={f} n={10} seed={8} c="#fff6d0" x0={400} x1={1500} y0={260} y1={760}/>
      {/* value tags drawn from the table */}
      <Tag x={lx} y={BASE - H1 - 56 + lHop} text={`₹${lend.toFixed(0)}`} a={a0} size={30} fill="#fff7e4" ink="#2a5a2a" edge="#6b8a52"/>
      <Tag x={rx} y={BASE - H1 - 56} text={`₹${lend.toFixed(0)}`} a={a0} size={30} fill="#fff7e4" ink="#2a5a2a" edge="#6b8a52"/>
    </g>
  );
};
const clampU = (x: number) => Math.max(0, Math.min(1, x));
export const SpreadLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <ECard cx={960} y={62} text={L.sp.text} f={p.f} at={L.sp.at} size={40} maxW={1300} upper={false} tone="dark"/>
      <ECard cx={520} y={810} text={L.ln.text} f={p.f} at={L.ln.at} size={28} maxW={600} upper={false}/>
      <ECard cx={1400} y={810} text={L.dp.text} f={p.f} at={L.dp.at} size={28} maxW={600} upper={false}/>
      <ECard cx={960} y={450} text={L.ea.text} f={p.f} at={L.ea.at} size={30} maxW={500} upper={false} tone="green"/>
      <ECard cx={1450} y={170} text={L.sr.text} f={p.f} at={L.sr.at} size={26} maxW={560} upper={false} tone="cool"/>
    </>
  );
};
export { eio };
