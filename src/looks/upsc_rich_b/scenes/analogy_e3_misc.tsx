// ECO-16 Part 1, builder E3: `plan-path` (the notebook plan and the three-part path), `m-measures` (M1 base with two branches, M4 above M3, brackets),
// `base-tower` (reserve money beside a tower of deposits), `paise-bar` (cash against a rupee of deposits, to scale) and `part2-seam` (a seam opens, a new block grows, PART 2).
// Bar lengths come from fig(e16_cdr); nothing is typed. Motion is a function of f and at(key).
import React from "react";
import {SANS, SERIF, W, H, eio, eo, rng} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {FlowArrow, prog, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {BalanceBar, Brace, Coin, CoinEdge, Counter, Defs, Plaza, Quest, Specks, Spot, Tag, elabs} from "./analogy_e3_kit";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---- plan-path ------------------------------------------------------------------------------------------------------------------
const PGX = 300, PGY = 66, PGW = 1320, PGH = 478;
const ROADY = (x: number) => 818 + 26 * Math.sin(x / 150);
const STOPX = [380, 960, 1540];

export const PlanPathArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 24));
  const keys = ["w1", "w2", "w3"], pk = ["p1", "p2", "p3"];
  const lit = [eo(prog(f, L.p1.at, 26)), 0.62 * eo(prog(f, L.p2.at, 26)), 0.62 * eo(prog(f, L.p3.at, 26))];
  const roadPts = Array.from({length: 41}, (_, i) => 160 + i * 40).map((x) => `${x},${ROADY(x).toFixed(1)}`);
  const litX = lerp(160, STOPX[0], lit[0]) + (STOPX[1] - STOPX[0]) * (lit[1] / 0.62) + (STOPX[2] - STOPX[1]) * (lit[2] / 0.62);
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="pp-desk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9b784"/><stop offset="0.6" stopColor="#bd8f58"/><stop offset="1" stopColor="#8f6234"/></linearGradient>
        <linearGradient id="pp-page" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf3"/><stop offset="1" stopColor="#f4ead0"/></linearGradient>
        <linearGradient id="pp-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0dcae"/><stop offset="1" stopColor="#d2b67e"/></linearGradient>
        <clipPath id="pp-lit"><rect x={0} y={600} width={Math.max(1, litX)} height={300}/></clipPath>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#pp-desk)"/>
      {Array.from({length: 17}, (_, i) => <path key={i} d={`M-60,${i * 66 - 20} Q960,${i * 66 - 34 + (i % 3) * 10} 1980,${i * 66 - 10}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.3}/>)}
      <Spot id="pp-sp" cx={900} cy={400} rx={1000} ry={620} a={0.5}/>
      {/* the notebook page */}
      <g opacity={a0} transform={`translate(0 ${(1 - a0) * 30})`}>
        <rect x={PGX + 14} y={PGY + 22} width={PGW} height={PGH} rx={16} fill="#2a1808" opacity={0.34} filter="url(#e3-glow)"/>
        <rect x={PGX - 12} y={PGY - 10} width={PGW + 24} height={PGH + 20} rx={20} fill="#5e3c78" stroke="#3a2250" strokeWidth={3}/>
        <rect x={PGX} y={PGY} width={PGW} height={PGH} rx={12} fill="url(#pp-page)" stroke="#cbb88a" strokeWidth={1.6}/>
        {Array.from({length: 10}, (_, i) => <path key={i} d={`M${PGX + 20},${PGY + 70 + i * 44} H${PGX + PGW - 20}`} stroke="#b9cde0" strokeWidth={1.4} opacity={0.6}/>)}
        <path d={`M${PGX + 116},${PGY + 8} V${PGY + PGH - 8}`} stroke="#e29a8a" strokeWidth={2.4} opacity={0.7}/>
        {Array.from({length: 9}, (_, i) => <g key={i} transform={`translate(${PGX + 36} ${PGY + 40 + i * 50})`}><circle r={11} fill="#cdb98c" stroke="#8e7a52" strokeWidth={1.4}/><path d="M-30,0 H22" stroke="#9aa6b2" strokeWidth={5} strokeLinecap="round"/></g>)}
        {keys.map((k, i) => {
          const cy = PGY + 126 + i * 118, t = L[k].at, wipe = eo(prog(f, t, 30)), tick = eo(prog(f, t + 12, 16)), by = cy - 34;
          return (
            <g key={k}>
              <defs><clipPath id={`pp-w${i}`}><rect x={PGX + 232} y={cy - 50} width={Math.max(0.1, 1020 * wipe)} height={100}/></clipPath></defs>
              <rect x={PGX + 150} y={by} width={68} height={68} rx={12} fill="#fffdf6" stroke="#7a5a3a" strokeWidth={4}/>
              <text x={PGX + 184} y={by + 47} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill="#b9a98a" opacity={1 - tick}>{i + 1}</text>
              <path d={`M${PGX + 160},${by + 36} l17,19 l32,-42`} fill="none" stroke="#1f8a4c" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - tick)} opacity={0.95}/>
              <g clipPath={`url(#pp-w${i})`}>
                <text x={PGX + 240} y={cy + 16} fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={56} fill="#1f3a78">{L[k].text}</text>
                <path d={`M${PGX + 238},${cy + 34} q300,10 ${L[k].text.length * 21},-2`} stroke="#1f3a78" strokeWidth={2.4} fill="none" opacity={0.35} strokeLinecap="round"/>
              </g>
            </g>
          );
        })}
        {/* a pencil resting on the page */}
        <g transform={`translate(${PGX + PGW - 250} ${PGY + PGH - 60}) rotate(-14)`} filter="url(#e3-sh-s)">
          <rect x={0} y={-12} width={230} height={24} rx={4} fill="#f2c22a" stroke="#9a7410" strokeWidth={2}/>
          <rect x={0} y={-12} width={230} height={7} fill="#fff0a0" opacity={0.6}/>
          <path d="M230,-12 L292,0 L230,12 Z" fill="#f2d9a8" stroke="#9a7410" strokeWidth={2}/><path d="M270,-4 L292,0 L270,4 Z" fill="#3a2a1c"/>
          <rect x={-34} y={-12} width={34} height={24} rx={6} fill="#e08a8a" stroke="#8a3a3a" strokeWidth={2}/><rect x={-4} y={-12} width={8} height={24} fill="#c8c8d0"/>
        </g>
      </g>
      {/* the path with its three stops */}
      <g opacity={a0}>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#6e4a26" strokeWidth={58} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} transform="translate(0 7)"/>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#7a5630" strokeWidth={56} strokeLinecap="round" strokeLinejoin="round"/>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="url(#pp-road)" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round"/>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#fff6dc" strokeWidth={4} strokeLinecap="round" strokeDasharray="4 22" opacity={0.8}/>
        <g clipPath="url(#pp-lit)"><path d={`M${roadPts.join(" L")}`} fill="none" stroke="#ffd36a" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} filter="url(#e3-glow-s)"/><path d={`M${roadPts.join(" L")}`} fill="none" stroke="#fff0b0" strokeWidth={8} strokeLinecap="round" strokeDasharray="6 20" strokeDashoffset={-f * 1.4}/></g>
        {STOPX.map((x, i) => {
          const y = ROADY(x), l = lit[i], t = L[pk[i]].at, a = eo(prog(f, t, 18));
          const [head, ...rest] = L[pk[i]].text.split(" · ");
          return (
            <g key={i}>
              {l > 0.01 && <circle cx={x} cy={y} r={78} fill="url(#ak-sunglow)" opacity={l * (0.8 + 0.2 * Math.sin(f / 8 + i))}/>}
              <ellipse cx={x} cy={y + 24} rx={52} ry={12} fill="#2a1808" opacity={0.35}/>
              <circle cx={x} cy={y} r={34} fill={l > 0.01 ? "#ffd36a" : "#a8977a"} stroke="#6a4a10" strokeWidth={4} opacity={0.5 + 0.5 * Math.max(l, 0.2)}/>
              <circle cx={x} cy={y} r={34} fill="#fff7d8" opacity={l * 0.7}/>
              <circle cx={x} cy={y} r={14} fill="#7a5630" opacity={0.7 + l * 0.2}/>
              <g opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
                <rect x={x - 5} y={y - 100} width={10} height={70} fill="#7a5630" stroke="#4e361c" strokeWidth={2}/>
                <g filter="url(#e3-sh-s)">
                  <rect x={x - 220} y={y - 224} width={440} height={128} rx={18} fill={l > 0.9 ? "#fff1c4" : "#efe4cc"} stroke={l > 0.9 ? "#c9922a" : "#a8977a"} strokeWidth={4}/>
                  <rect x={x - 208} y={y - 212} width={416} height={104} rx={11} fill="none" stroke={l > 0.9 ? "#e6b24a" : "#c8b99a"} strokeWidth={1.6}/>
                  <text x={x} y={y - 160} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} letterSpacing={8} fill={l > 0.9 ? "#8a4a08" : "#6a5a44"}>{head}</text>
                  <text x={x} y={y - 120} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={32} fill={l > 0.9 ? "#5e2a0e" : "#5a4a3a"}>{rest.join(" · ")}</text>
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
export const NoLabels: React.FC<AP> = () => null;

// ---- m-measures -----------------------------------------------------------------------------------------------------------------
const DXm = 28, DYm = -22;
const PostBox: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-20} y={-24} width={40} height={50} rx={6} fill="#d23a30" stroke="#7a1810" strokeWidth={2.4}/>
    <path d="M-22,-24 Q0,-44 22,-24 Z" fill="#b82a22" stroke="#7a1810" strokeWidth={2.4}/>
    <rect x={-12} y={-12} width={24} height={7} rx={3.5} fill="#3a0c08"/>
    <rect x={-12} y={4} width={24} height={14} fill="#fff" opacity={0.2}/>
  </g>
);
const FdCert: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(-5)`}>
    <rect x={-28} y={-20} width={56} height={42} rx={4} fill="#fff7e4" stroke="#8a5a14" strokeWidth={2.4}/>
    <path d="M-20,-8 h26 M-20,0 h20 M-20,8 h26" stroke="#8a5a14" strokeWidth={2.2}/>
    <circle cx={16} cy={8} r={9} fill="#d8401f" stroke="#7a1810" strokeWidth={2}/>
  </g>
);
type BlockP = {id: string; x: number; y: number; w: number; h: number; c1: string; c2: string; side: string; top: string; g: number; text: string; ink: string; icon: React.ReactNode; size?: number; tx?: number};
const Block: React.FC<BlockP> = ({id, x, y, w, h, c1, c2, side, top, g, text, ink, icon, size = 30, tx = 92}) => {
  if (g <= 0.002) return null;
  const hh = h * g, yt = y + h - hh;
  return (
    <g filter="url(#e3-sh)">
      <defs><linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1}/><stop offset="1" stopColor={c2}/></linearGradient></defs>
      <path d={`M${x + w},${yt} L${x + w + DXm},${yt + DYm} V${y + h + DYm} L${x + w},${y + h} Z`} fill={side} stroke={side} strokeWidth={1}/>
      <path d={`M${x},${yt} L${x + DXm},${yt + DYm} H${x + w + DXm} L${x + w},${yt} Z`} fill={top} stroke={side} strokeWidth={1.4}/>
      <rect x={x} y={yt} width={w} height={hh} rx={3} fill={`url(#${id}-g)`} stroke={side} strokeWidth={2}/>
      <rect x={x} y={yt} width={w} height={Math.min(8, hh)} fill="#fff" opacity={0.3}/>
      <g opacity={eo(prog(g, 0.8, 0.2))}>
        <g transform={`translate(${x + 48} ${y + h / 2})`}>{icon}</g>
        <text x={x + tx} y={y + h / 2 + size * 0.34} fontFamily={SERIF} fontWeight={700} fontSize={size} fill={ink}>{text}</text>
      </g>
    </g>
  );
};

export const MMeasuresArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p, {m4: () => p.at("m2") + 26});
  const gB = eo(prog(f, L.m1.at, 34)), g3 = eo(prog(f, L.m3.at, 40)), g2 = eo(prog(f, L.m2.at, 40)), g4 = eo(prog(f, L.m4.at, 40));
  const nr = eo(prog(f, L.nr.at, 26)), br = eo(prog(f, L.br.at, 26)), mc = eo(prog(f, L.mc.at, 26)), pulse = mc * (0.55 + 0.45 * Math.sin(f / 6));
  const X0 = 400, XM = 975, XR = 1520;
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="mm-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ecd4"/><stop offset="1" stopColor="#e6d4ac"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#mm-bg)"/>
      <Spot id="mm-sp" cx={960} cy={440} rx={900} ry={520} a={0.55}/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${-60},${150 + i * 100} H${W + 60}`} stroke="#b8a678" strokeWidth={1.2} opacity={0.18}/>)}
      <Counter id="mm" y0={832}/>
      <ellipse cx={960} cy={822} rx={760} ry={24} fill="#2a1808" opacity={0.3} filter="url(#e3-glow-s)"/>
      {/* M3 glows when NCERT calls it the most commonly used */}
      {mc > 0.01 && <g opacity={mc}>
        <rect x={XM - 18} y={462} width={XR - XM + DXm + 36} height={180} rx={24} fill="#ffd36a" opacity={0.55 * (0.6 + 0.4 * pulse)} filter="url(#e3-glow)"/>
      </g>}
      <Block id="mm4" x={XM} y={296} w={XR - XM} h={160} c1="#a894dc" c2="#6a50ac" side="#473486" top="#d6c9f4" g={g4} text={L.m4.text} ink="#fff" icon={<PostBox x={0} y={0}/>} size={29}/>
      <Block id="mm3" x={XM} y={470} w={XR - XM} h={160} c1="#f8c35a" c2="#d98a22" side="#9a5a12" top="#ffe6a8" g={g3} text={L.m3.text} ink="#4a2606" icon={<FdCert x={0} y={0}/>} size={31}/>
      <Block id="mm2" x={X0} y={470} w={XM - X0 - 30} h={160} c1="#7fcdb4" c2="#35957c" side="#1f6655" top="#bdeede" g={g2} text={L.m2.text} ink="#fff" icon={<PostBox x={0} y={0}/>} size={29}/>
      <Block id="mm1" x={X0} y={644} w={XR - X0} h={150} c1="#58a0dc" c2="#2862a0" side="#17406b" top="#a8d2f2" g={gB} text={L.m1.text} ink="#fff" icon={<g><Coin id="mm1c" r={22}/><rect x={14} y={-4} width={30} height={26} rx={3} fill="#fff7e4" stroke="#8a5a14" strokeWidth={2}/><path d="M20,4 h18 M20,11 h14" stroke="#8a5a14" strokeWidth={2}/></g>} size={32} tx={120}/>
      {mc > 0.3 && <rect x={XM} y={470} width={XR - XM} height={160} rx={3} fill="none" stroke="#fff6c8" strokeWidth={5} opacity={pulse * 0.9}/>}
      {/* brackets: narrow on the left (M1 + M2), broad on the right (M3 + M4) */}
      <Brace x={X0 - 28} y0={470} y1={794} dir={-1} c="#4a2a14" w={6} p={nr} amp={26}/>
      <Brace x={XR + DXm + 28} y0={296 + DYm} y1={794 + DYm} dir={1} c="#4a2a14" w={6} p={br} amp={26}/>
      <g opacity={nr} transform={`translate(${X0 - 210 + (1 - nr) * 14} 632)`}><text textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={40} fill="#3a2a5e" letterSpacing={2}><tspan x={0} dy={0}>NARROW</tspan><tspan x={0} dy={46}>MONEY</tspan></text></g>
      <g opacity={br} transform={`translate(${XR + DXm + 210 - (1 - br) * 14} 536)`}><text textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={40} fill="#8a4a08" letterSpacing={2}><tspan x={0} dy={0}>BROAD</tspan><tspan x={0} dy={46}>MONEY</tspan></text></g>
      {/* the pointer from the badge to M3 */}
      <FlowArrow pts={[[900, 408], [950, 470], [966, 540]]} f={f} p={mc} w={12} c1="#f2b84a" c2="#ffe9a0" dark="#9a5a10"/>
    </g>
  );
};
export const MMeasuresLabels: React.FC<AP> = (p) => {
  const L = elabs(p, {m4: () => p.at("m2") + 26});
  return <>
    <P2Card cx={620} y={76} text={L.nc.text} f={p.f} at={L.nc.at} size={40} upper={false} maxW={800}/>
    <P2Card cx={650} y={340} text={L.mc.text} f={p.f} at={L.mc.at} size={34} upper={false} tone="green" maxW={500}/>
  </>;
};

// ---- base-tower -----------------------------------------------------------------------------------------------------------------
const GR = 800, BX = 330, BWd = 390, BHt = 190, DXb = 52, DYb = -34;
const TXc = 1080, TWd = 270, TFloors = 12, FLH = 52;

export const BaseTowerArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), th = eo(prog(f, 4, 80)), hpg = eo(prog(f, L.hp.at, 30)), ba = eo(prog(f, L.ba.at, 18)), r = rng(21);
  const stones: {x: number; y: number; w: number; t: number}[] = [];
  for (let row = 0; row < 4; row++) { let x = BX - (row % 2 ? 60 : 0); while (x < BX + BWd) { const w = 90 + r() * 70; stones.push({x, y: GR - BHt + row * (BHt / 4), w, t: r()}); x += w; } }
  const TH = TFloors * FLH, Ty = GR - TH, shown = TH * th;
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="bt-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7fb0d6"/><stop offset="1" stopColor="#32608f"/></linearGradient>
        <linearGradient id="bt-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c5580"/><stop offset="1" stopColor="#1a3a5e"/></linearGradient>
        <linearGradient id="bt-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9cdb2"/><stop offset="1" stopColor="#b5a687"/></linearGradient>
        <clipPath id="bt-clip"><rect x={TXc - TWd / 2 - 4} y={GR - shown} width={TWd + DXb + 20} height={shown + 4}/></clipPath>
      </defs>
      <Plaza id="bt" ground={GR} f={f}/>
      <Spot id="bt-sp" cx={760} cy={620} rx={560} ry={360} a={0.45}/>
      {/* the stone base */}
      <g filter="url(#e3-sh)">
        <path d={`M${BX + BWd},${GR} L${BX + BWd + DXb},${GR + DYb} V${GR - BHt + DYb} L${BX + BWd},${GR - BHt} Z`} fill="#8f7f62" stroke="#5e5038" strokeWidth={2}/>
        <path d={`M${BX},${GR - BHt} L${BX + DXb},${GR - BHt + DYb} H${BX + BWd + DXb} L${BX + BWd},${GR - BHt} Z`} fill="#e6dcc4" stroke="#7a6a4c" strokeWidth={2}/>
        <rect x={BX} y={GR - BHt} width={BWd} height={BHt} fill="url(#bt-stone)" stroke="#6a5a40" strokeWidth={2.4}/>
        <g clipPath="url(#bt-sc)">
          <defs><clipPath id="bt-sc"><rect x={BX} y={GR - BHt} width={BWd} height={BHt}/></clipPath></defs>
          {stones.map((s, i) => <rect key={i} x={s.x + 2} y={s.y + 2} width={s.w - 4} height={BHt / 4 - 4} rx={5} fill={s.t > 0.5 ? "#d8cbae" : "#c9bb9a"} stroke="#8e7e60" strokeWidth={1.8} opacity={0.9}/>)}
        </g>
        <rect x={BX} y={GR - BHt} width={BWd} height={10} fill="#fff" opacity={0.25}/>
      </g>
      {hpg > 0.01 && <rect x={BX + 20} y={GR - BHt + 52} width={BWd - 40} height={60} rx={20} fill="#ffd36a" opacity={0.6 * hpg} filter="url(#e3-glow)"/>}
      <text x={BX + BWd / 2} y={GR - BHt + 102} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={36} letterSpacing={3} fill={hpg > 0.5 ? "#7a3a06" : "#7a6a4a"} stroke={hpg > 0.5 ? "#ffe9a0" : "#efe3c8"} strokeWidth={1.6} paintOrder="stroke">RESERVE MONEY</text>
      {/* the tower of deposits, beside the base, not on it */}
      <g clipPath="url(#bt-clip)" filter="url(#e3-sh)">
        <path d={`M${TXc + TWd / 2},${GR} L${TXc + TWd / 2 + DXb * 0.9},${GR + DYb * 0.9} V${Ty + DYb * 0.9} L${TXc + TWd / 2},${Ty} Z`} fill="url(#bt-side)" stroke="#16304e" strokeWidth={2}/>
        <rect x={TXc - TWd / 2} y={Ty} width={TWd} height={TH} fill="url(#bt-glass)" stroke="#16304e" strokeWidth={2.4}/>
        {Array.from({length: TFloors}, (_, i) => {
          const y = GR - (i + 1) * FLH, rr = rng(i * 7 + 3);
          return <g key={i}>
            <path d={`M${TXc - TWd / 2},${y} H${TXc + TWd / 2}`} stroke="#16304e" strokeWidth={2.4} opacity={0.8}/>
            {[0, 1, 2].map((k) => { const lit = rr() > 0.18, bw = 20 + rr() * 34; return <g key={k}><rect x={TXc - TWd / 2 + 14 + k * 82} y={y + 8} width={70} height={FLH - 18} rx={4} fill={lit ? "#cfe6f6" : "#7fa6c8"} opacity={lit ? 0.85 : 0.5} stroke="#16304e" strokeWidth={1.2}/>{lit && <rect x={TXc - TWd / 2 + 20 + k * 82} y={y + 15} width={bw} height={8} rx={4} fill="#2c6aa8"/>}{lit && <rect x={TXc - TWd / 2 + 20 + k * 82} y={y + 27} width={bw * 0.6} height={6} rx={3} fill="#e8a23a"/>}</g>; })}
          </g>;
        })}
        <path d={`M${TXc - TWd / 2 - 16},${Ty} H${TXc + TWd / 2 + 16} L${TXc + TWd / 2 - 20},${Ty - 54} H${TXc - TWd / 2 + 20} Z`} fill="#2c5580" stroke="#16304e" strokeWidth={2.4}/>
        <path d={`M${TXc},${Ty - 54} V${Ty - 112}`} stroke="#16304e" strokeWidth={4}/>
        <circle cx={TXc} cy={Ty - 116} r={7} fill="#e8503a"/>
        <rect x={TXc - TWd / 2 + 8} y={Ty + 4} width={14} height={TH - 8} rx={7} fill="#fff" opacity={0.28}/>
      </g>
      <Tag x={TXc} y={Ty - 28} text="DEPOSITS" a={eo(prog(th, 0.85, 0.15))} size={20} fill="#e6c46a" ink="#4a3008" edge="#8a6414"/>
      {/* leader from the term card, plaque, question mark */}
      <path d={`M${BX + BWd / 2},288 V${GR - BHt - 40}`} stroke="#c9922a" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 12" opacity={hpg}/>
      <Quest x={850} y={730} s={0.9} a={ba} f={f}/>
      <Tag x={BX + BWd / 2} y={GR - 38} text={L.rb.text} a={eo(prog(f, L.rb.at, 18))} size={22} fill="#e6c46a" ink="#4a3008" edge="#8a6414"/>
    </g>
  );
};
export const BaseTowerLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <>
    <P2Card cx={BX + BWd / 2} y={118} text={L.hp.text} f={p.f} at={L.hp.at} size={32} upper={false} tone="warm" maxW={620}/>
    <P2Card cx={BX + BWd / 2} y={822} text={L.ba.text} f={p.f} at={L.ba.at} size={30} upper={false} tone="green" maxW={500}/>
  </>;
};

// ---- paise-bar ------------------------------------------------------------------------------------------------------------------
const PX0 = 170, PBW = 1230, PY0 = 400, PH = 180, DXp = 44, DYp = -30;

export const PaiseBarArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), pa = fig({t: "e16_cdr", state: "India", s: "paise"}).value;
  const gB = eo(prog(f, 0, 40)), tfp = L.fp.at, tdp = L.dp.at, dpg = eo(prog(f, tdp, 24));
  const rollLen = (PBW * pa) / 100, n = Math.max(2, Math.round(rollLen / 14)), ct = rollLen / n, RX0 = PX0 + PBW + DXp + 56, RCY = PY0 + PH / 2 + 4, CD = 118;
  const tq = L.q.at;
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="pb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ecd4"/><stop offset="1" stopColor="#e8d6ae"/></linearGradient>
        <linearGradient id="pb-dep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3fd0c4"/><stop offset="0.55" stopColor="#1d9aa6"/><stop offset="1" stopColor="#11607f"/></linearGradient>
        <pattern id="pb-fac" x={PX0} y={PY0} width={150} height={PH} patternUnits="userSpaceOnUse">
          <path d="M16,52 L75,22 L134,52 Z" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.34)" strokeWidth="2"/>
          <rect x={16} y={55} width={118} height={8} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="1.6"/>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={24 + i * 29} y={67} width={13} height={78} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="1.6"/>)}
          <rect x={8} y={149} width={134} height={8} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="1.6"/>
        </pattern>
        <linearGradient id="pb-shine" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset="0.5" stopColor="#fff" stopOpacity="0.3"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
        <clipPath id="pb-clip"><rect x={PX0} y={PY0} width={PBW} height={PH} rx={4}/></clipPath>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#pb-wall)"/>
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${200 + i * 300} 100)`} opacity={0.5}><path d="M-80,400 V120 A80,80 0 0 1 80,120 V400 Z" fill="#cfe2ea" stroke="#b79a68" strokeWidth={4}/><path d="M0,40 V400 M-80,250 H80" stroke="#b79a68" strokeWidth={3}/></g>)}
      <Spot id="pb-sp" cx={900} cy={420} rx={1000} ry={480} a={0.5}/>
      <Counter id="pb" y0={612}/>
      <Specks f={f} n={14} seed={13} c="#fff3c8" y0={140} y1={600}/>
      {/* the long block: a rupee's worth of deposits */}
      <g opacity={gB} transform={`translate(0 ${(1 - gB) * 24})`}>
        <ellipse cx={PX0 + PBW / 2 + 30} cy={PY0 + PH + 18} rx={PBW * 0.54} ry={20} fill="#2a1808" opacity={0.35} filter="url(#e3-glow-s)"/>
        <path d={`M${PX0 + PBW},${PY0} L${PX0 + PBW + DXp},${PY0 + DYp} V${PY0 + PH + DYp} L${PX0 + PBW},${PY0 + PH} Z`} fill="#0b4a66" stroke="#073850" strokeWidth={2}/>
        <path d={`M${PX0},${PY0} L${PX0 + DXp},${PY0 + DYp} H${PX0 + PBW + DXp} L${PX0 + PBW},${PY0} Z`} fill="#8fe6df" stroke="#0b4a66" strokeWidth={2}/>
        <rect x={PX0} y={PY0} width={PBW} height={PH} fill="url(#pb-dep)" stroke="#073850" strokeWidth={2.4}/>
        <g clipPath="url(#pb-clip)"><rect x={PX0} y={PY0} width={PBW} height={PH} fill="url(#pb-fac)"/><rect x={PX0 + ((f * 7) % (PBW + 400)) - 260} y={PY0} width={200} height={PH} fill="url(#pb-shine)" transform="skewX(-16)"/></g>
        <rect x={PX0} y={PY0} width={PBW} height={10} fill="#fff" opacity={0.32}/>
        {dpg > 0.01 && <rect x={PX0 - 8} y={PY0 - 8} width={PBW + 16} height={PH + 16} rx={8} fill="none" stroke="#fff2b8" strokeWidth={6} opacity={dpg * (0.6 + 0.3 * Math.sin(f / 8))} filter="url(#e3-glow-s)"/>}
        <g opacity={dpg}><text x={PX0 + PBW / 2} y={PY0 + PH / 2 + 30} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={92} letterSpacing={10} fill="#fff9e8" stroke="#0b4a66" strokeWidth={2.6} paintOrder="stroke">DEPOSITS</text></g>
      </g>
      {/* the short roll of coins, laid down at the same scale */}
      <ellipse cx={RX0 + rollLen / 2} cy={RCY + CD / 2 + 8} rx={rollLen * 0.7} ry={13} fill="#2a1808" opacity={0.35} filter="url(#e3-glow-s)"/>
      {Array.from({length: n}, (_, i) => {
        const u = eo(prog(f, tfp + i * 2.4, 16)); if (u <= 0.01) return null;
        return <g key={i} transform={`translate(0 ${-(1 - u) * 140})`} opacity={Math.min(1, u * 3)}><CoinEdge x={RX0 + i * ct} y={RCY} t={ct + 0.6} d={CD}/></g>;
      })}
      {/* scale lines under the block and the roll */}
      <g opacity={eo(prog(f, tfp + 30, 20))} stroke="#7a4a18" strokeWidth={4} strokeLinecap="round" fill="none">
        <path d={`M${PX0},${PY0 + PH + 40} V${PY0 + PH + 54} H${PX0 + PBW} V${PY0 + PH + 40}`}/>
        <path d={`M${RX0},${PY0 + PH + 40} V${PY0 + PH + 54} H${RX0 + rollLen} V${PY0 + PH + 40}`}/>
      </g>
    </g>
  );
};
export const PaiseBarLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p, tq = L.q.at, u = eo(prog(f, tq, 30)), s = 0.55 + 0.45 * u + Math.sin(Math.min(1, prog(f, tq, 30)) * Math.PI) * 0.06;
  return <>
    <P2Card cx={PX0 + PBW / 2} y={120} text={L.dp.text} f={f} at={L.dp.at} size={42} upper={false} tone="green" maxW={900}/>
    <P2Card cx={960} y={650} text={L.fp.text} f={f} at={L.fp.at} size={36} upper={false} maxW={1300}/>
    {u > 0.002 && <div style={{position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "960px 820px", opacity: u}}><P2Card cx={960} y={756} text={L.q.text} f={f} at={tq - 30} size={58} maxW={1560}/></div>}
  </>;
};

// ---- part2-seam -----------------------------------------------------------------------------------------------------------------
const SBX = 700, SBASE = 832, SBW = 300, SBH = 430;

export const Part2SeamArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), tw = L.wd.at, tp = L.p2.at, tl = L.lm.at;
  const gap = 34 * eio(prog(f, tw + 8, 40)), rise = eio(prog(f, tw + 56, Math.max(70, tl - tw - 56))), pf = eo(prog(f, tp, 30));
  const SX0 = 880, SW = 300, nbh = 350 * rise, nby = SBASE - nbh, per = 2 * (W - 96 + H - 96), glow = eo(prog(gap, 0, 12));
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="sm-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12224a"/><stop offset="0.6" stopColor="#1c2c5c"/><stop offset="1" stopColor="#0c1330"/></linearGradient>
        <linearGradient id="sm-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5c96"/><stop offset="1" stopColor="#2c3c72"/></linearGradient>
        <linearGradient id="sm-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#26356a"/><stop offset="1" stopColor="#141d46"/></linearGradient>
        <linearGradient id="sm-new" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8ff0b8"/><stop offset="1" stopColor="#1f9a62"/></linearGradient>
        <linearGradient id="sm-ray" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffe3a0" stopOpacity="0.7"/><stop offset="1" stopColor="#ffe3a0" stopOpacity="0"/></linearGradient>
        <linearGradient id="sm-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0b0"/><stop offset="0.5" stopColor="#e0a83a"/><stop offset="1" stopColor="#9a6a14"/></linearGradient>
        <clipPath id="sm-emerge"><rect x={SX0 - 60} y={0} width={SW + 180} height={SBASE}/></clipPath>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#sm-bg)"/>
      <Spot id="sm-sp" cx={960} cy={420} rx={900} ry={520} c="#ffd98a" a={0.3}/>
      {Array.from({length: 22}, (_, i) => { const r2 = rng(i * 13 + 5), hh = 160 + r2() * 260, x = i * 92 - 30, bw = 70 + r2() * 20; return <g key={i} opacity={0.9}><rect x={x} y={SBASE - 30 - hh} width={bw} height={hh + 4} fill={i % 3 ? "#1a2a58" : "#22346a"}/>{Array.from({length: Math.floor(hh / 42)}, (_, k) => r2() > 0.45 ? <rect key={k} x={x + 12 + (k % 2) * 24} y={SBASE - 30 - hh + 16 + k * 42} width={16} height={12} fill="#ffd98a" opacity={0.5 + 0.3 * Math.sin(f / 30 + i + k)}/> : null)}</g>; })}
      <Specks f={f} n={30} seed={7} c="#ffe3a0" y0={120} y1={800}/>
      {/* the plinth: a top face with a faint seam, and its front */}
      <ellipse cx={960} cy={SBASE + 76} rx={680} ry={24} fill="#02040e" opacity={0.55} filter="url(#e3-glow-s)"/>
      <rect x={380} y={SBASE - 34} width={1160} height={68} rx={6} fill="url(#sm-top)" stroke="#6e86d6" strokeWidth={2.4}/>
      <rect x={380} y={SBASE + 34} width={1160} height={44} fill="url(#sm-front)" stroke="#4e63b0" strokeWidth={2.4}/>
      <rect x={380} y={SBASE - 34} width={1160} height={6} fill="#a9bcf3" opacity={0.5}/>
      <path d={`M${SX0},${SBASE} H${SX0 + SW}`} stroke="#c9d6ff" strokeWidth={2.4} strokeDasharray="14 9" strokeLinecap="round" opacity={0.5 * (1 - glow)}/>
      {/* the old account bar, large */}
      <BalanceBar id="smb" x={SBX} y={SBASE} w={SBW} h={SBH} level={0.74} f={f} a={1}/>
      {/* the seam opens: a lit slit, light spills up, a green block grows out of it */}
      {gap > 0.4 && <g>
        <path d={`M${SX0 + 20},${SBASE - gap / 2} L${SX0 - 10},${SBASE - 330} H${SX0 + SW + 10} L${SX0 + SW - 20},${SBASE - gap / 2} Z`} fill="url(#sm-ray)" opacity={glow * (0.55 + 0.15 * Math.sin(f / 8))}/>
        <rect x={SX0} y={SBASE - gap / 2} width={SW} height={gap} rx={Math.min(8, gap / 2)} fill="#050c24" stroke="#c9d6ff" strokeWidth={2.4}/>
        <rect x={SX0 + 14} y={SBASE - gap * 0.2} width={SW - 28} height={Math.max(2, gap * 0.4)} rx={gap * 0.2} fill="#fff1b8" filter="url(#e3-glow-s)" opacity={0.9}/>
      </g>}
      {nbh > 1 && <g clipPath="url(#sm-emerge)" filter="url(#e3-sh)">
        <path d={`M${SX0 + SW},${SBASE} L${SX0 + SW + 40},${SBASE - 26} V${nby - 26} L${SX0 + SW},${nby} Z`} fill="#147a4c" stroke="#0c5232" strokeWidth={2}/>
        <path d={`M${SX0},${nby} L${SX0 + 40},${nby - 26} H${SX0 + SW + 40} L${SX0 + SW},${nby} Z`} fill="#c8fbe0" stroke="#0c5232" strokeWidth={2}/>
        <rect x={SX0} y={nby} width={SW} height={nbh} fill="url(#sm-new)" stroke="#0c5232" strokeWidth={2.6}/>
        <rect x={SX0} y={nby} width={SW} height={Math.min(9, nbh)} fill="#fff" opacity={0.4}/>
        {Array.from({length: Math.floor(nbh / 34)}, (_, i) => <path key={i} d={`M${SX0},${SBASE - 34 - i * 34} H${SX0 + SW}`} stroke="#fff" strokeWidth={1.6} opacity={0.22}/>)}
        <rect x={SX0 - 6} y={nby - 6} width={SW + 12} height={Math.min(40, nbh) + 6} rx={6} fill="#fff6c0" opacity={0.3 * (0.6 + 0.4 * Math.sin(f / 7))} filter="url(#e3-glow-s)"/>
      </g>}
      {gap > 0.4 && <rect x={SX0 - 2} y={SBASE} width={SW + 4} height={gap / 2} fill="#050c24" opacity={0.92}/>}
      {f >= tl && <Quest x={SX0 + SW / 2 + 20} y={nby - 90} s={0.8} a={eo(prog(f, tl, 18))} f={f} c="#ffd36a"/>}
      {/* the frame that closes round the scene at PART 2 */}
      {pf > 0.002 && <g opacity={pf}>
        <rect x={48} y={48} width={W - 96} height={H - 96} rx={26} fill="none" stroke="url(#sm-frame)" strokeWidth={9} strokeDasharray={per} strokeDashoffset={per * (1 - pf)}/>
        <rect x={68} y={68} width={W - 136} height={H - 136} rx={16} fill="none" stroke="#ffe9a8" strokeWidth={2.2} opacity={0.7}/>
        {[[48, 48, 1, 1], [W - 48, 48, -1, 1], [48, H - 48, 1, -1], [W - 48, H - 48, -1, -1]].map(([x, y, sx, sy], i) => <path key={i} d="M0,0 h58 M0,0 v58 M16,16 h30 M16,16 v30" stroke="#ffe9a8" strokeWidth={5} strokeLinecap="round" fill="none" transform={`translate(${x} ${y}) scale(${sx} ${sy})`}/>)}
      </g>}
    </g>
  );
};
export const Part2SeamLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <>
    <P2Card cx={960} y={64} text={L.p2.text} f={p.f} at={L.p2.at} size={52} tone="dark" maxW={600}/>
    <P2Card cx={560} y={196} text={L.wd.text} f={p.f} at={L.wd.at} size={36} upper={false} tone="dark" maxW={560}/>
    <P2Card cx={1400} y={196} text={L.lm.text} f={p.f} at={L.lm.at} size={36} upper={false} tone="dark" maxW={560}/>
  </>;
};
