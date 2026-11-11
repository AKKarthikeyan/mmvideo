// GEO-04 Part 1, builder V2: `shield`. mode "dome" (s015): a broad low dome built from nested thin lava sheets, the girl at its foot for scale.
// mode "steam" (s016): the shoreline of a shield, sea water seeps to the vent and a white steam jet bursts.
import React from "react";
import {W, eo, rng} from "../kit";
import {Cloud, Sun, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Girl} from "../girl";
import {V2Defs, SkyBox, Plume, Ballistic, Glow, Strata, curve, pts, under, bandPath, ease, mix, type XY} from "./analogy_v2_kit";

const CX = 960, YB = 800, HT = 340, HW = 1350, N = 15;
const SC = (k: number) => (k === 0 ? 1 : 0.915 - (k - 1) * 0.056);
const domeFn = (s: number) => (x: number) => { const d = Math.abs(x - CX) / (HW * s); return YB - HT * s * Math.pow(Math.max(0, 1 - d * d), 1.05); };
const SHEET = ["#3e312d", "#5d4339", "#463631", "#6b4c3d"];

const DomeArt: React.FC<AP> = ({f, dur}) => {
  const top = domeFn(1), gap = Math.max(10, (dur * 0.5) / N), rnd = rng(15);
  const layers = Array.from({length: N}, (_, k) => k);
  const tLast = 14 + (N - 1) * gap, flow = ease(f, tLast - gap * 3, 40);
  const sumY = top(CX);
  const speck = Array.from({length: 46}, () => { const x = 120 + rnd() * 1680; return {x, y: top(x) + 5 + rnd() * 12, w: 14 + rnd() * 30, o: 0.15 + rnd() * 0.25}; });
  const flowPts: XY[] = curve((x) => top(x) + 1, CX + 20, CX + 760, 16);
  return (
    <g>
      <V2Defs/>
      <defs>
        <linearGradient id="v2sd-skin" gradientUnits="userSpaceOnUse" x1="0" y1={sumY} x2="0" y2={YB}><stop offset="0" stopColor="#4a3f42"/><stop offset="0.55" stopColor="#5d5648"/><stop offset="1" stopColor="#6f8f4c"/></linearGradient>
        <linearGradient id="v2sd-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a6050"/><stop offset="1" stopColor="#2c211d"/></linearGradient>
        <clipPath id="v2sd-clip"><rect x={-80} y={0} width={W + 160} height={YB + 2}/></clipPath>
      </defs>
      <SkyBox id="v2sd" top="#5f9fd2" mid="#b6d7e6" bot="#f7e8c8" y1={YB}/>
      <Sun x={1500} y={210} r={46} f={f} glow={0.8}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={80 + i * 640} y={170 + (i % 2) * 120} s={0.95 - i * 0.1} f={f} speed={0.16} seed={i + 5} a={0.8}/>)}
      {/* far pale hill line, then a low cloud bank for depth */}
      <path d={under((x) => 640 - 28 * Math.sin(x / 260 + 1) - 14 * Math.sin(x / 97), -60, W + 60, YB, 24)} fill="#b9cde0" opacity={0.7}/>
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 560 + f * 0.25) % 2300) - 200} cy={620 + (i % 2) * 40} rx={260} ry={26} fill="#fff" opacity={0.5} style={{filter: "blur(10px)"}}/>)}
      {/* ground slab with older strata */}
      <g>
        <path d={`M-80,${YB} L${W + 80},${YB} L${W + 80},1100 L-80,1100 Z`} fill="url(#v2sd-rock)"/>
        <Strata id="v2sd-st" x0={-80} x1={W + 80} y0={YB + 2} y1={1100} seed={4} gap={44}/>
        <rect x={-80} y={YB} width={W + 160} height={5} fill="#d9b887" opacity={0.8}/>
      </g>
      {/* the dome: nested sheets, small and old first, big and new last (painted big first) */}
      <g clipPath="url(#v2sd-clip)">
        {layers.map((k) => {
          const s = SC(k), t0 = 14 + (N - 1 - k) * gap, u = eo(prog(f, t0, 24)), set = prog(f, t0 + 8, 50);
          if (u <= 0.003) return null;
          const fn = domeFn(s), d = under(fn, CX - HW * s - 4, CX + HW * s + 4, YB, 14);
          return (
            <g key={k} opacity={Math.min(1, u * 1.6)} transform={`translate(${CX} ${YB}) scale(${mix(0.62, 1, u)} ${mix(0.18, 1, u)}) translate(${-CX} ${-YB})`}>
              <path d={d} fill={k === 0 ? "url(#v2sd-skin)" : SHEET[k % SHEET.length]}/>
              <path d={pts(curve(fn, CX - HW * s, CX + HW * s, 14))} fill="none" stroke="#e8b98e" strokeWidth={1.6} opacity={0.5}/>
              <path d={pts(curve(fn, CX - HW * s, CX + HW * s, 14))} fill="none" stroke="#ff7a28" strokeWidth={4} opacity={(1 - set) * 0.8} style={{filter: "drop-shadow(0 0 6px #ff7a28)"}}/>
            </g>
          );
        })}
        {/* ropy lava texture on the skin */}
        {speck.map((s, i) => <path key={i} d={`M${s.x},${s.y} q${s.w * 0.5},-4 ${s.w},0`} stroke="#e8c9a0" strokeWidth={1.4} fill="none" opacity={s.o * eo(prog(f, tLast, 30))}/>)}
        {/* feeder pipe from the deep magma to the summit pit */}
        <g opacity={flow}>
          <rect x={CX - 8} y={sumY + 6} width={16} height={1100 - sumY} rx={8} fill="#2a1410"/>
          <rect x={CX - 4} y={sumY + 8} width={8} height={1100 - sumY} rx={6} fill="url(#v2-lavaV)" opacity={0.9}/>
        </g>
      </g>
      <Glow x={CX} y={1090} r={420} a={0.7 * flow}/>
      {/* summit pit with a glowing lava lake and a slow flow down the right flank */}
      <g opacity={flow}>
        <Glow x={CX} y={sumY - 6} r={110} a={0.8 + 0.1 * Math.sin(f / 6)}/>
        <ellipse cx={CX} cy={sumY + 4} rx={50} ry={9} fill="#2a1410"/>
        <ellipse cx={CX} cy={sumY + 3} rx={40} ry={6} fill="url(#v2-lavaV)"/>
        <path d={pts(flowPts)} fill="none" stroke="#ff8a2a" strokeWidth={14} opacity={0.35} style={{filter: "blur(5px)"}}/>
        <path d={pts(flowPts)} fill="none" stroke="#3a1c14" strokeWidth={8} strokeLinecap="round"/>
        <path d={pts(flowPts)} fill="none" stroke="#ffb040" strokeWidth={4.5} strokeLinecap="round" strokeDasharray="30 18" strokeDashoffset={-f * 1.6}/>
        <path d={pts(flowPts)} fill="none" stroke="#fff0b0" strokeWidth={1.6} strokeLinecap="round" strokeDasharray="12 36" strokeDashoffset={-f * 2.1}/>
        <Plume x={CX} y={sumY - 6} f={f} n={8} rise={120} drift={60} r0={14} r1={44} kind="W" period={130} a={0.5} seed={3} sway={6}/>
      </g>
      {/* the girl, tiny, at the foot of the left flank */}
      {(() => { const gx = 250, gy = top(gx) + 6; return (
        <g transform={`translate(${gx} ${gy})`}>
          <ellipse cx={0} cy={2} rx={30} ry={5} fill="#1c120c" opacity={0.4}/>
          <g transform="scale(-0.19 0.19) rotate(-4)"><Girl f={f} id="v2sd-g" pose="idle"/></g>
        </g>); })()}
    </g>
  );
};

// ---- steam -------------------------------------------------------------------------------------------------------------------------
const surf = (x: number) => x >= 760 ? 620 - 150 * (1 - Math.exp(-(x - 760) / 700)) : 620 + 285 * Math.pow((760 - x) / 820, 1.25);
const VX = 1180;
const SteamArt: React.FC<AP> = ({f, dur}) => {
  const vy = surf(VX), s0 = 36, burst = eo(prog(f, s0, 14)), pulse = 0.5 + 0.5 * Math.sin(f / 5);
  const crack: XY[] = [[704, 646], [780, 700], [850, 742], [930, 748], [1010, 790], [1100, 806], [VX - 4, 826]];
  const cd = pts(crack);
  const wave = (x: number) => 620 + 3.4 * Math.sin(x / 38 + f / 9) + 2 * Math.sin(x / 17 - f / 6);
  const wv = Array.from({length: 7}, (_, i) => i);
  const bandOffs = [0, 34, 70, 100, 140, 170, 210, 240, 285];
  const flash = 1 - eo(prog(f, s0, 16));
  const jetH = 150 + 260 * eo(prog(f, s0, 20));
  return (
    <g>
      <V2Defs/>
      <defs>
        <linearGradient id="v2st-sea" gradientUnits="userSpaceOnUse" x1="0" y1="620" x2="0" y2="900"><stop offset="0" stopColor="#6cc3dc"/><stop offset="0.5" stopColor="#2f86b3"/><stop offset="1" stopColor="#14507c"/></linearGradient>
        <linearGradient id="v2st-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b5446"/><stop offset="1" stopColor="#26191a"/></linearGradient>
        <linearGradient id="v2st-jet" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0.95"/><stop offset="1" stopColor="#e6eef8" stopOpacity="0"/></linearGradient>
      </defs>
      <SkyBox id="v2st" top="#5c9fd3" mid="#b8d9e6" bot="#f7e8c8" y1={640}/>
      <Sun x={1490} y={200} r={46} f={f} glow={0.7}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={60 + i * 680} y={150 + (i % 2) * 110} s={0.9 - i * 0.08} f={f} speed={0.15} seed={i + 9} a={0.75}/>)}
      <path d={under((x) => 590 - 24 * Math.sin(x / 300 + 2) - 10 * Math.sin(x / 80), -60, W + 60, 640, 24)} fill="#b9cde0" opacity={0.65}/>
      {/* rock body, cut open: bands follow the surface */}
      <path d={under(surf, -80, W + 80, 1100, 14)} fill="url(#v2st-rock)"/>
      {bandOffs.slice(0, -1).map((o, i) => (
        <g key={i}>
          <path d={bandPath((x) => surf(x) + o, (x) => surf(x) + bandOffs[i + 1], -80, W + 80, 20)} fill={["#4b3a34", "#6a4d40", "#52403a", "#765543"][i % 4]} opacity={0.92}/>
          <path d={pts(curve((x) => surf(x) + bandOffs[i + 1], -80, W + 80, 20))} fill="none" stroke="#e3b88c" strokeWidth={1.2} opacity={0.3}/>
        </g>
      ))}
      <path d={pts(curve(surf, 760, W + 80, 14))} fill="none" stroke="#8a9a5c" strokeWidth={7} opacity={0.9}/>
      <path d={pts(curve(surf, 760, W + 80, 14))} fill="none" stroke="#e8d7a0" strokeWidth={1.6} opacity={0.5} transform="translate(0 -3)"/>
      {/* the sea over the sea floor */}
      <g>
        <path d={`M-80,620 ${pts(curve(wave, -80, 760, 16)).replace("M", "L")} ${pts(curve(surf, -80, 760, 16).reverse()).replace("M", "L")} Z`} fill="url(#v2st-sea)"/>
        {wv.map((i) => <path key={i} d={`M${60 + i * 105},${652 + (i % 3) * 20} l60,${-4 + (i % 2) * 8}`} stroke="#d4f0f8" strokeWidth={2} opacity={0.3} strokeLinecap="round"/>)}
        {[0, 1, 2, 3].map((i) => { const x = 130 + i * 160; return <path key={i} d={`M${x},620 L${x + 60},620 L${x + 150},900 L${x + 40},900 Z`} fill="#fff" opacity={0.07 + 0.03 * Math.sin(f / 30 + i)}/>; })}
        <path d={pts(curve(wave, -80, 762, 14))} fill="none" stroke="#e8fbff" strokeWidth={3.4} opacity={0.9}/>
        {Array.from({length: 8}, (_, i) => { const u = ((f / 70) + i * 0.137) % 1, bx = 120 + i * 80; return <circle key={i} cx={bx + Math.sin(u * 9 + i) * 8} cy={surf(bx) - 10 - u * (surf(bx) - 640)} r={3 + (i % 3)} fill="none" stroke="#e6fbff" strokeWidth={1.4} opacity={0.5 * (1 - u)}/>; })}
      </g>
      {/* the crack carrying sea water into the vent */}
      <path d={cd} fill="none" stroke="#1a0f0d" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={cd} fill="none" stroke="#3a8cc0" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={cd} fill="none" stroke="#d6f4ff" strokeWidth={3} strokeLinecap="round" strokeDasharray="14 22" strokeDashoffset={-f * 1.4}/>
      {/* vent and magma */}
      <Glow x={VX} y={1060} r={460} a={0.75}/>
      <rect x={VX - 15} y={vy + 2} width={30} height={1100 - vy} rx={7} fill="#2a1410"/>
      <rect x={VX - 9} y={vy + 6} width={18} height={1100 - vy} rx={6} fill="url(#v2-lavaV)"/>
      <Glow x={VX - 4} y={826} r={90} a={0.5 + 0.4 * burst * pulse}/>
      {/* steam jet */}
      {burst > 0.01 && (
        <g>
          <Glow x={VX} y={vy - 30} r={170 * flash + 40} a={0.8 * (flash + 0.2)}/>
          <path d={`M${VX - 12},${vy + 4} Q${VX - 22 - 6 * pulse},${vy - jetH * 0.5} ${VX - 12},${vy - jetH} L${VX + 12},${vy - jetH} Q${VX + 22 + 6 * pulse},${vy - jetH * 0.5} ${VX + 12},${vy + 4} Z`} fill="url(#v2st-jet)" opacity={0.85} style={{filter: "blur(5px)"}}/>
          <Plume x={VX} y={vy - 6} f={f} n={26} rise={440} drift={150} r0={44} r1={140} kind="W" period={64} start={s0} seed={11} sway={16}/>
          <Plume x={VX} y={vy - 6} f={f} n={12} rise={300} drift={-90} r0={32} r1={96} kind="W" period={52} start={s0 + 10} seed={12} sway={12} a={0.8}/>
          <Ballistic x={VX} y={vy - 8} f={f} n={9} vx={26} vy={38} g={3} period={54} start={s0} color="#3a2b27" r={7} seed={5} glow={false}/>
        </g>
      )}
    </g>
  );
};

export const ShieldArt: React.FC<AP> = (p) => ((p.spec as any).mode === "steam" ? <SteamArt {...p}/> : <DomeArt {...p}/>);
export const ShieldLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), steam = (p.spec as any).mode === "steam";
  if (steam) return <>{L[0] && <P2Card cx={500} y={84} text={L[0].text} f={p.f} at={L[0].at} size={40} maxW={780} upper={false}/>}</>;
  return (
    <>
      {L[0] && <P2Card cx={960} y={76} text={L[0].text} f={p.f} at={L[0].at} size={38} maxW={1200}/>}
      {L[1] && <P2Card cx={1500} y={330} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={560} upper={false}/>}
    </>
  );
};
