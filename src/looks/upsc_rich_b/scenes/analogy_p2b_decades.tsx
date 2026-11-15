// Look B analogy art for Part 2: `decades` (a vertical ruler with the old and new normal marks; with `strip`, a long strip of wetter and drier decades).
// Marks from fig(u7_lpa: old, new) in mm -> cm. The strip is an illustration (the ILLUSTRATION chip comes from the spec).
import React from "react";
import {SANS, SERIF, W, H, eio, eo} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

const BG: React.FC<{id: string}> = ({id}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3e9d2"/><stop offset="1" stopColor="#e2d1aa"/></linearGradient>
      <radialGradient id={`${id}-lamp`} cx="0.4" cy="0.4" r="0.7"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.8"/><stop offset="1" stopColor="#fff6d8" stopOpacity="0"/></radialGradient>
      <pattern id={`${id}-grid`} width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48,0 H0 V48" fill="none" stroke="#b8a678" strokeWidth="1" opacity="0.32"/></pattern>
    </defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-bg)`}/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-grid)`}/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-lamp)`}/>
  </g>
);

// ---- ruler with two marks ---------------------------------------------------------------------------------------------------
const RuleArt: React.FC<AP> = (p) => {
  const {f} = p, L = rlabs(p), old = fig({t: "u7_lpa", state: "India", s: "old"}), nw = fig({t: "u7_lpa", state: "India", s: "new"});
  const oldCm = old.value / 10, newCm = nw.value / 10, pad = 1.5, hiCm = oldCm + pad, loCm = newCm - pad;
  const yTop = 120, yBot = 860, ppc = (yBot - yTop) / (hiCm - loCm), yOf = (cm: number) => yTop + (hiCm - cm) * ppc;
  const RX = 620, RW = 150, tNew = L[0]?.at ?? 50, mv = eio(prog(f, tNew - 4, 36));
  const yOld = yOf(oldCm), yNew = yOf(newCm), yCur = yOld + (yNew - yOld) * mv;
  const a0 = eo(prog(f, 8, 20));
  const ticks: number[] = [];
  for (let t = Math.ceil(loCm * 10); t <= Math.floor(hiCm * 10); t++) ticks.push(t);
  return (
    <g>
      <BG id="dcr"/>
      <defs>
        <linearGradient id="dcr-wood" x1="0" x2="1"><stop offset="0" stopColor="#f6dc94"/><stop offset="0.6" stopColor="#e2b862"/><stop offset="1" stopColor="#c5933f"/></linearGradient>
      </defs>
      <g opacity={a0}>
        <rect x={RX - RW / 2 + 14} y={yTop - 20 + 12} width={RW} height={yBot - yTop + 50} rx={12} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
        <rect x={RX - RW / 2} y={yTop - 20} width={RW} height={yBot - yTop + 50} rx={12} fill="url(#dcr-wood)" stroke="#8e6a2c" strokeWidth={2.6}/>
        <rect x={RX - RW / 2 + 6} y={yTop - 14} width={7} height={yBot - yTop + 38} rx={3} fill="#fff6cf" opacity={0.6}/>
        {ticks.map((t) => {
          const y = yOf(t / 10), cm = t % 10 === 0, half = t % 5 === 0;
          return <g key={t}><path d={`M${RX + RW / 2},${y} h${cm ? -64 : half ? -44 : -26}`} stroke="#5a4020" strokeWidth={cm ? 3.2 : half ? 2.2 : 1.4} strokeLinecap="round"/>
            {cm && <text x={RX - RW / 2 + 18} y={y + 9} fontFamily={SANS} fontWeight={800} fontSize={26} fill="#5a4020">{t / 10}</text>}</g>;
        })}
        <text x={RX} y={yBot + 22} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="3" fill="#7a2a1d">cm</text>
      </g>
      {/* old mark */}
      <g opacity={a0}>
        <path d={`M${RX - RW / 2 - 20},${yOld} H${RX + RW / 2 + 70}`} stroke="#6a7686" strokeWidth={5} strokeDasharray="12 8" strokeLinecap="round"/>
        <g transform={`translate(${RX + RW / 2 + 90} ${yOld - 54})`}>
          <rect x={0} y={0} width={300} height={108} rx={16} fill="#fff7e4" stroke="#8a97a8" strokeWidth={2.5} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.3))"}}/>
          <text x={22} y={32} fontFamily={SANS} fontWeight={800} fontSize={18} letterSpacing="4" fill="#6a7686">OLD NORMAL</text>
          <text x={22} y={86} fontFamily={SERIF} fontWeight={700} fontSize={56} fill="#44505e">{(old.value / 10).toFixed(1)}</text>
          <text x={176} y={86} fontFamily={SANS} fontWeight={800} fontSize={26} fill="#6a7686">cm</text>
        </g>
      </g>
      {/* new mark slides down from the old one */}
      {mv > 0.001 && (
        <g>
          <path d={`M${RX - RW / 2 - 20},${yCur} H${RX + RW / 2 + 70}`} stroke="#c63f2f" strokeWidth={7} strokeLinecap="round" style={{filter: "drop-shadow(0 4px 4px rgba(60,20,10,.35))"}}/>
          <polygon points={`${RX - RW / 2 - 20},${yCur} ${RX - RW / 2 - 52},${yCur - 16} ${RX - RW / 2 - 52},${yCur + 16}`} fill="#c63f2f"/>
          <g transform={`translate(${RX + RW / 2 + 90} ${yCur - 54})`} opacity={eo(prog(f, tNew, 16))}>
            <rect x={0} y={0} width={300} height={108} rx={16} fill="#fff1e8" stroke="#c63f2f" strokeWidth={3} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.3))"}}/>
            <text x={22} y={32} fontFamily={SANS} fontWeight={800} fontSize={18} letterSpacing="4" fill="#c63f2f">NEW</text>
            <text x={22} y={86} fontFamily={SERIF} fontWeight={700} fontSize={56} fill="#7a2a1d">{(nw.value / 10).toFixed(1)}</text>
            <text x={176} y={86} fontFamily={SANS} fontWeight={800} fontSize={26} fill="#a8503a">cm</text>
          </g>
        </g>
      )}
      {/* the drop bracket */}
      {mv > 0.02 && (
        <g opacity={eo(prog(f, tNew + 6, 20))}>
          <path d={`M${RX + RW / 2 + 430},${yOld} V${yCur - 18}`} stroke="#c63f2f" strokeWidth={5} strokeLinecap="round"/>
          <polygon points={`${RX + RW / 2 + 430},${yCur} ${RX + RW / 2 + 414},${yCur - 26} ${RX + RW / 2 + 446},${yCur - 26}`} fill="#c63f2f"/>
          <path d={`M${RX + RW / 2 + 400},${yOld} h60`} stroke="#6a7686" strokeWidth={3}/>
        </g>
      )}
      <text x={RX} y={yTop - 36} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={19} letterSpacing="3" fill="#7a5a30" opacity={0.85 * a0}>RULER ZOOMED IN</text>
    </g>
  );
};
const RuleLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return <>{L[0] && <P2Card cx={1500} y={470} text={L[0].text} f={p.f} at={L[0].at} size={50} tone="dark" maxW={560}/>}</>;
};

// ---- strip of decades -------------------------------------------------------------------------------------------------------
// illustrative departures (-1..1) per decade, wetter above 0, drier below; the last run is the long dry phase
const PAT = [0.35, 0.8, 0.45, -0.3, -0.7, -0.15, 0.55, 0.85, 0.3, -0.45, 0.4, 0.7, -0.2, -0.55, -0.4, -0.65, -0.3, -0.5];
const DRY_FROM = 13;
const StripArt: React.FC<AP> = (p) => {
  const {f} = p, L = rlabs(p);
  const n = PAT.length, x0 = 130, cw = (W - 2 * x0) / n, yT = 330, yB = 640, yM = (yT + yB) / 2, amp = 130;
  const wipe = eio(prog(f, 6, 70)), reach = x0 + (W - 2 * x0) * wipe;
  const pts = PAT.map((v, i) => [x0 + (i + 0.5) * cw, yM - v * amp] as [number, number]);
  let d = `M${x0},${yM - PAT[0] * amp}`;
  pts.forEach((q, i) => { const pv = i ? pts[i - 1] : [x0, q[1]]; const mx = (pv[0] + q[0]) / 2; d += ` C${mx},${pv[1]} ${mx},${q[1]} ${q[0]},${q[1]}`; });
  d += ` L${W - x0},${pts[n - 1][1]}`;
  const tDp = L[1]?.at ?? 100, tSx = L[2]?.at ?? 160, dryX0 = x0 + DRY_FROM * cw;
  return (
    <g>
      <BG id="dcs"/>
      <defs>
        <clipPath id="dcs-reveal"><rect x={x0 - 10} y={yT - 120} width={reach - x0 + 10} height={yB - yT + 240}/></clipPath>
        <linearGradient id="dcs-wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f86c8" stopOpacity="0.8"/><stop offset="1" stopColor="#8fcbea" stopOpacity="0.5"/></linearGradient>
        <linearGradient id="dcs-dry" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#b8803a" stopOpacity="0.85"/><stop offset="1" stopColor="#ecd196" stopOpacity="0.5"/></linearGradient>
      </defs>
      <rect x={x0 - 14} y={yT - 40} width={W - 2 * x0 + 28} height={yB - yT + 80} rx={22} fill="#fffaf0" opacity={0.7} stroke="#b58a52" strokeWidth={2} style={{filter: "drop-shadow(0 18px 18px rgba(60,34,12,.3))"}}/>
      <g clipPath="url(#dcs-reveal)">
        {PAT.map((v, i) => {
          const x = x0 + i * cw;
          return <g key={i}>
            <rect x={x} y={yT - 30} width={cw} height={yB - yT + 60} fill={v >= 0 ? "#b9dcf0" : "#ecd9a8"} opacity={0.28 + Math.abs(v) * 0.5}/>
            <path d={`M${x},${yM} H${x + cw}`} stroke="none"/>
            <path d={`M${x + cw},${yT - 30} V${yB + 30}`} stroke="#b8a678" strokeWidth={1.4} opacity={0.5}/>
          </g>;
        })}
        {/* filled wet and dry areas against the middle line */}
        <path d={d} fill="none" stroke="#1d3c5e" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" style={{filter: "drop-shadow(0 5px 5px rgba(20,30,50,.35))"}}/>
        <path d={`M${x0},${yM} H${W - x0}`} stroke="#7a5a30" strokeWidth={2.5} strokeDasharray="10 8"/>
        {pts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={7} fill={PAT[i] >= 0 ? "#2f86c8" : "#b8803a"} stroke="#fff" strokeWidth={3}/>)}
      </g>
      {/* wetter / drier tags */}
      <text x={x0 + 18} y={yT - 6} fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="4" fill="#2a6fa6">WETTER</text>
      <text x={x0 + 18} y={yB + 24} fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="4" fill="#9a6428">DRIER</text>
      {/* the long dry phase */}
      <g opacity={eo(prog(f, tDp, 20))}>
        <rect x={dryX0} y={yT - 30} width={W - x0 - dryX0} height={yB - yT + 60} rx={6} fill="#d9a85a" opacity={0.22}/>
        <path d={`M${dryX0},${yB + 52} H${W - x0} M${dryX0},${yB + 40} V${yB + 64} M${W - x0},${yB + 40} V${yB + 64}`} stroke="#9a6428" strokeWidth={5} strokeLinecap="round" fill="none"/>
      </g>
      {/* the fall */}
      <g opacity={eo(prog(f, tSx, 20))}>
        <path d={`M${dryX0 + 30},${pts[DRY_FROM][1] - 62} L${W - x0 - 70},${pts[n - 1][1] - 38}`} stroke="#c63f2f" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 12"/>
        <polygon points={`${W - x0 - 70},${pts[n - 1][1] - 38} ${W - x0 - 100},${pts[n - 1][1] - 64} ${W - x0 - 96},${pts[n - 1][1] - 28}`} fill="#c63f2f"/>
      </g>
    </g>
  );
};
const StripLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), x0 = 130, cw = (W - 2 * x0) / PAT.length, dryMid = x0 + (DRY_FROM + (PAT.length - DRY_FROM) / 2) * cw;
  return <>
    {L[0] && <P2Card cx={820} y={104} text={L[0].text} f={p.f} at={L[0].at} size={40} maxW={900}/>}
    {L[1] && <P2Card cx={dryMid - 10} y={742} text={L[1].text} f={p.f} at={L[1].at} size={30} upper={false} tone="warm" maxW={520}/>}
    {L[2] && <P2Card cx={dryMid - 20} y={190} text={L[2].text} f={p.f} at={L[2].at} size={34} upper={false} tone="dark" maxW={560}/>}
    {L[3] && <P2Card cx={620} y={742} text={L[3].text} f={p.f} at={L[3].at} size={30} tone="green" maxW={900}/>}
  </>;
};

export const DecadesArt: React.FC<AP> = (p) => ((p.spec as any).strip ? <StripArt {...p}/> : <RuleArt {...p}/>);
export const DecadesLabels: React.FC<AP> = (p) => ((p.spec as any).strip ? <StripLabels {...p}/> : <RuleLabels {...p}/>);
void H;
