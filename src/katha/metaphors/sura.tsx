// Scenes for the Surasamharam film (17 Nov 2026), in the Gita film's look. Rule 5 as extended by AK on 16 Nov 2026:
// Murugan is a faceless backlit silhouette known by the vel, the peacock and the rooster banner.
//   suraTree    the mango tree in the sea; s.phase "before" (the tree whole, the vel raised) | "after" (split; the birds)
//   suraMurugan Murugan with the vel, the peacock beside him, the rooster on his banner
//   suraArun    Arun awake at night, lit only by his phone
import React from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H, SoftGlow} from "../look";
import {SceneP, push, Frame} from "../stage";
import {Sky, Dust, Haze} from "../sky";
import {Rimmed, Item} from "../sil";
import {mango} from "../flora";
import {smooth, rnd, band, Pt} from "../geom";
import {murugan, vel, peacock, rooster, seatedMan} from "../murugan";

// The sea below the horizon: a dark body, a path of light under the sun, glints that drift.
const Sea: React.FC<{y: number; sunX: number; f: number; id: string; top?: string; glint?: string; k?: number}> = ({y, sunX, f, id, top = "#5A2F4E", glint = "#FFD9A0", k = 1}) => (
  <g>
    <defs>
      <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="0.25" stopColor="#2A1838"/><stop offset="1" stopColor="#0A0612"/></linearGradient>
      <radialGradient id={`${id}path`}><stop offset="0" stopColor={glint} stopOpacity={0.55}/><stop offset="0.5" stopColor={glint} stopOpacity={0.16}/><stop offset="1" stopColor={glint} stopOpacity={0}/></radialGradient>
    </defs>
    <rect x={-100} y={y} width={W + 200} height={H - y + 100} fill={`url(#${id}sea)`}/>
    <ellipse cx={sunX} cy={y + 6} rx={520} ry={(H - y) * 0.95} fill={`url(#${id}path)`} opacity={k}/>
    {Array.from({length: 150}, (_, i) => {
      const d = Math.pow(rnd(i, 3), 1.6), yy = y + 6 + d * (H - y - 10), spread = 120 + d * 900;
      const xx = sunX + (rnd(i, 5) - 0.5) * 2 * spread + Math.sin(f / 50 + i) * 6, len = (14 + 70 * d) * (0.6 + rnd(i, 7));
      const near = 1 - Math.min(1, Math.abs(xx - sunX) / spread), o = (0.12 + 0.5 * near) * (0.6 + 0.4 * Math.sin(f / 22 + i * 1.7)) * k;
      return <ellipse key={i} cx={xx} cy={yy} rx={len} ry={1 + d * 2.2} fill={glint} opacity={Math.max(0, o)}/>;
    })}
  </g>
);
// A rocky shore in the near corner.
const shore = (x0: number, x1: number, y: number, seed: number, rise = 60): string => {
  const pts: Pt[] = [[x0, H + 40, "c"], [x0, y + 10, "c"]];
  const n = 9;
  for (let i = 0; i <= n; i++) { const u = i / n; pts.push([x0 + (x1 - x0) * u, y - rise * Math.sin(u * Math.PI * 0.62) * (0.75 + 0.5 * rnd(i, seed)) + u * u * 90]); }
  pts.push([x1 + 60, H + 40, "c"]);
  return smooth(pts, {wind: "cw"});
};

const SuraTree: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const after = s.phase === "after";
  const HOR = 690, TX = 1150, sun: [number, number] = after ? [TX, 560] : [1290, 610];
  const tree = mango({x: 0, y: 0, h: 800, seed: 8, t: f, detail: 1.15});
  const light = (x: number, y: number): [number, number] => [sun[0] - x, sun[1] - y];
  const mx = 300, my = 968, ms = 0.62;
  const half = (side: -1 | 1) => (
    <g transform={`translate(${TX + side * 70} ${HOR + 74}) rotate(${side * 23})`}>
      <g clipPath={`url(#st-${side > 0 ? "r" : "l"})`}><Rimmed paths={tree} light={[-side, -0.25]} w={5} rim="#FFE2A6"/></g>
    </g>
  );
  const pk = peacock(true, f), rk = rooster(f);
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.04)} cx={TX} cy={560}>
      <defs>
        <clipPath id="st-l"><rect x={-900} y={-1000} width={900} height={1100}/></clipPath>
        <clipPath id="st-r"><rect x={0} y={-1000} width={900} height={1100}/></clipPath>
        <radialGradient id="st-shade"><stop offset="0" stopColor="#07040D" stopOpacity={0.7}/><stop offset="0.6" stopColor="#07040D" stopOpacity={0.4}/><stop offset="1" stopColor="#07040D" stopOpacity={0}/></radialGradient>
        <linearGradient id="st-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF4DC" stopOpacity={0}/><stop offset="0.5" stopColor="#FFF4DC" stopOpacity={0.95}/><stop offset="1" stopColor="#FFF4DC" stopOpacity={0}/></linearGradient>
      </defs>
      <Sky mood={after ? "gold" : "dusk"} sun={sun} sunR={after ? 70 : 84} f={f} rays={after ? 0.9 : 0.45} horizon={HOR} id="st"/>
      <Sea y={HOR} sunX={sun[0]} f={f} id="st" top={after ? "#B0683E" : "#5A2F4E"} k={after ? 1.2 : 0.9}/>
      <Haze y={HOR} h={70} color={after ? "#FFD98E" : "#E58A4A"} op={0.3}/>
      {after ? (
        <g>
          {/* the light that came through: a column where the trunk stood, and the vel's path across the water */}
          <SoftGlow x={TX} y={330} r={640} ry={640} c0="#FFF6E0" c1="#FFC870" peak={0.95} k={1.8}/>
          <rect x={TX - 60} y={-40} width={120} height={HOR + 110} fill="url(#st-beam)" opacity={0.55}/>
          {half(-1)}{half(1)}
          {/* the vel stands where the trunk stood; the two birds rise in the light between the halves */}
          <Rimmed paths={vel(0, 0, 250, 1.5)} transform={`translate(${TX} ${HOR + 80})`} light={[0, -1]} w={3} fill="#2A1630" rim="#FFFFFF"/>
          <Rimmed paths={rk} transform={`translate(${TX - 150} 330) scale(0.6)`} light={[1, -0.2]} w={5} fill="#241330"/>
          <Rimmed paths={[...pk.body, ...pk.eyes.map((d) => ({d, fill: "#4E7FA6", rim: false}) as Item)]} transform={`translate(${TX + 170} 300) scale(-0.5 0.5)`} light={[1, -0.2]} w={5} fill="#241330"/>
        </g>
      ) : (
        <g>
          <Rimmed paths={tree} transform={`translate(${TX} ${HOR + 74})`} light={light(TX, 300)} w={5}/>
          {/* the tree's shadow on the water */}
          <ellipse cx={TX - 60} cy={HOR + 150} rx={760} ry={150} fill="url(#st-shade)"/>
        </g>
      )}
      {/* where the trunk meets the sea */}
      <ellipse cx={TX} cy={HOR + 76} rx={after ? 200 : 150} ry={10} fill={after ? "#FFE9B8" : "#FFD9A0"} opacity={after ? 0.7 : 0.35}/>
      <Rimmed paths={[shore(-60, 760, 930, 4, 70)]} light={light(300, 900)} w={4} fill="#0B0612"/>
      <Rimmed paths={murugan(after ? "thrown" : "hold", 0.5, f)} transform={`translate(${mx} ${my - 62}) scale(${-ms} ${ms})`} light={[-(sun[0] - mx), sun[1] - 700]} w={4 / ms}/>
      <Dust f={f} sun={sun} n={120} y0={200} y1={680}/>
    </Frame>
  );
};

const SuraMurugan: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const sun: [number, number] = [1010, 640], GY = 880;
  const pk = peacock(false, f);
  const L = (x: number): [number, number] => [sun[0] - x, sun[1] - 620];
  // the banner: a pole, a pennant lit through by the sun, the rooster on it
  const px = 560, ptop = 250;
  const wave = (u: number) => Math.sin(f / 24 + u * 5) * 10 * u;
  const top = (u: number) => ptop + 8 + wave(u) + 30 * u * u, bot = (u: number) => ptop + 190 - 40 * u + wave(u) + 30 * u * u;
  const pen: Pt[] = [[px, top(0), "c"]];
  for (let i = 1; i < 10; i++) pen.push([px - 300 * (i / 10), top(i / 10)]);
  pen.push([px - 300, top(1), "c"], [px - 236, (top(0.9) + bot(0.9)) / 2, "c"], [px - 300, bot(1), "c"]);
  for (let i = 9; i > 0; i--) pen.push([px - 300 * (i / 10), bot(i / 10)]);
  pen.push([px, bot(0), "c"]);
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={900} cy={600}>
      <Sky mood={s.mood || "dusk"} sun={sun} f={f} rays={0.6} id="sm"/>
      <Rimmed paths={[smooth([[-80, H + 40, "c"], [-80, GY + 40], [300, GY - 6], [760, GY - 30], [1200, GY - 22], [1700, GY + 14], [2000, GY + 50], [2000, H + 40, "c"]], {wind: "cw"})]} light={[0, -1]} w={3} fill="#0E0816"/>
      <Haze y={GY - 20} h={90} color="#E58A4A" op={0.25}/>
      <Rimmed paths={[`M ${px - 5} ${GY - 10} L ${px - 4} ${ptop - 30} L ${px + 4} ${ptop - 30} L ${px + 5} ${GY - 10} Z`, `M ${px + 10} ${ptop - 38} a 10 10 0 1 0 -20 0 a 10 10 0 1 0 20 0 Z`]} light={L(px)} w={3}/>
      <path d={smooth(pen)} fill="#B4472F" opacity={0.92}/>
      <path d={smooth(pen)} fill="none" stroke="#FFD38A" strokeWidth={2.5} opacity={0.8}/>
      <Rimmed paths={rooster(f)} transform={`translate(${px - 104} ${ptop + 162 + wave(0.4)}) scale(0.52)`} light={[-L(px)[0], L(px)[1]]} w={5} fill="#1A0D1C"/>
      <circle cx={840} cy={GY - 330} r={170} fill="url(#k-halo)" opacity={0.5 + 0.08 * Math.sin(f / 45)}/>
      <Rimmed paths={murugan("hold", 0.5, f)} transform={`translate(840 ${GY - 22}) scale(-1.02 1.02)`} light={[-L(840)[0], L(840)[1]]} w={4}/>
      <Rimmed paths={[...pk.body, ...pk.eyes.map((d) => ({d, fill: "#3B5C7A", rim: false}) as Item)]} transform={`translate(1230 ${GY - 14}) scale(0.95)`} light={L(1230)} w={4}/>
      <Dust f={f} sun={sun} n={160} y0={300}/>
    </Frame>
  );
};

const SuraArun: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const FL = 900, ax = 900, sc = 1.25;
  const man = seatedMan(), ph: [number, number] = [ax + man.phone[0] * sc, FL + man.phone[1] * sc];
  const COOL = "#D6E4FF";
  // what scrolls past in the light: a house, a rising step, a plane (drawn, never words)
  const icons = [
    "M -22 16 L -22 -4 L 0 -24 L 22 -4 L 22 16 Z M -6 16 L -6 2 L 6 2 L 6 16",
    "M -24 16 L -24 6 L -8 6 L -8 -6 L 8 -6 L 8 -18 L 24 -18 M 14 -26 L 24 -18 L 16 -8",
    "M -26 6 L 22 -8 L 28 -6 L 4 8 L -4 22 L -8 22 L -6 10 L -22 12 Z",
  ];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={ph[0]} cy={ph[1]} vig={1.1}>
      <defs>
        <linearGradient id="ar-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0A0716"/><stop offset="1" stopColor="#130D22"/></linearGradient>
        <linearGradient id="ar-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E0C27"/><stop offset="0.6" stopColor="#1D1842"/><stop offset="1" stopColor="#56304F"/></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ar-wall)"/>
      {/* the window: night sky, a warm moon, the grille */}
      <rect x={1330} y={170} width={360} height={440} fill="url(#ar-win)"/>
      {Array.from({length: 26}, (_, i) => <circle key={i} cx={1340 + rnd(i, 1) * 340} cy={180 + rnd(i, 2) * 330} r={0.8 + rnd(i, 3) * 1.2} fill="#FFE9C0" opacity={0.35 + 0.4 * rnd(i, 4)}/>)}
      <SoftGlow x={1590} y={290} r={120} c0="#FFE9B0" c1="#F0A04B" peak={0.5}/>
      <circle cx={1590} cy={290} r={26} fill="#FFE8B8"/>
      <path d={`M 1318 158 H 1702 V 622 H 1318 Z M 1330 170 V 610 H 1690 V 170 Z`} fill="#07050F" fillRule="evenodd"/>
      {[1420, 1510, 1600].map((x) => <rect key={x} x={x - 3} y={170} width={6} height={440} fill="#07050F"/>)}
      <rect x={1330} y={386} width={360} height={6} fill="#07050F"/>
      {/* floor */}
      <rect x={0} y={FL} width={W} height={H - FL} fill="#06040C"/>
      {/* the phone's light on the air, the wall and the floor */}
      <SoftGlow x={ph[0]} y={ph[1]} r={620} c0={COOL} c1="#4A62B0" peak={0.34} k={2.6}/>
      <SoftGlow x={ph[0] - 40} y={FL + 6} r={420} ry={40} c0={COOL} c1="#4A62B0" peak={0.22}/>
      {/* the bed: frame, mattress, the sleeper under the sheet, the headboard */}
      <Rimmed point={ph} light={[-1, -0.4]} w={3.5} rim={COOL} fill="#0C0817" paths={[
        `M ${ax - 70} ${FL - 150} H 1640 V ${FL - 96} H ${ax - 70} Z`,
        `M ${ax - 60} ${FL - 96} H 1630 V ${FL - 40} H ${ax - 60} Z`,
        `M ${ax - 50} ${FL - 40} h 26 V ${FL} h -26 Z`, `M 1596 ${FL - 40} h 26 V ${FL} h -26 Z`,
        `M 1632 ${FL - 330} H 1672 V ${FL} H 1632 Z`,
        smooth([[1040, FL - 150, "c"], [1090, FL - 196], [1200, FL - 214], [1330, FL - 204], [1440, FL - 222], [1520, FL - 236], [1580, FL - 218], [1618, FL - 150, "c"]], {wind: "cw"}),
        smooth([[1500, FL - 150, "c"], [1516, FL - 178], [1570, FL - 186], [1622, FL - 172], [1626, FL - 150, "c"]], {wind: "cw"}),
      ]}/>
      <Rimmed paths={man.paths} transform={`translate(${ax} ${FL}) scale(${sc})`} point={man.phone} light={[-1, 0]} w={4 / sc} rim={COOL} glow={0.5}/>
      {/* the phone */}
      <g transform={`translate(${ph[0]} ${ph[1]}) rotate(-62)`}><rect x={-20} y={-5} width={40} height={10} rx={3} fill="#F4F8FF"/></g>
      <SoftGlow x={ph[0]} y={ph[1]} r={90} c0="#FFFFFF" c1={COOL} peak={0.9} k={3.4}/>
      {icons.map((d, i) => {
        const u = (((f / 150) + i / 3) % 1), y = ph[1] - 70 - u * 260, o = Math.sin(Math.PI * u);
        return <path key={i} d={d} transform={`translate(${ph[0] - 60 - i * 6 + Math.sin(u * 5 + i) * 10} ${y}) scale(${1.1 + 0.5 * u})`} fill="none" stroke={COOL} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" opacity={0.75 * o}/>;
      })}
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {suraTree: SuraTree, suraMurugan: SuraMurugan, suraArun: SuraArun};
