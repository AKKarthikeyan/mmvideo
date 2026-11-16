// Scenes for the Surasamharam film (17 Nov 2026), in the Gita film's look. Rule 5 as extended by AK on 16 Nov 2026:
// Murugan is a faceless backlit silhouette known by the vel, the peacock and the rooster banner.
//   suraTree    the mango tree in the sea; s.phase "before" (the tree whole, the vel raised) | "after" (split; the birds)
//   suraMurugan Murugan with the vel, the peacock beside him, the rooster on his banner
//   suraArun    Arun awake at night, lit only by his phone
import React from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H, SoftGlow} from "../look";
import {SceneP, push, Frame} from "../stage";
import {Sky, Dust, Haze, LightFlash} from "../sky";
import {Flame, Diya} from "../fire";
import {Rimmed, Item} from "../sil";
import {mango, reeds} from "../flora";
import {smooth, rnd, band, Pt} from "../geom";
import {murugan, vel, peacock, rooster, seatedMan, surapadman, man, woman, child, kneeling, gopuram} from "../murugan";
import {CAPS, EN} from "../look";

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
  const after = s.phase === "after", throwing = s.phase === "throw";
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
      {throwing ? (() => {
        const u = Math.min(1, Math.max(0, (f - 20) / Math.max(1, n * 0.5))), x0 = mx + 80, y0 = my - 270, x1 = TX, y1 = HOR - 120;
        const vx = x0 + (x1 - x0) * u, vy = y0 + (y1 - y0) * u, ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90;
        return <g>
          <path d={`M ${x0} ${y0} L ${vx} ${vy}`} stroke="#FFF1CF" strokeWidth={5} opacity={0.55}/>
          <SoftGlow x={vx} y={vy} r={150} c0="#FFFFFF" c1="#FFD38A" peak={0.9} k={3}/>
          <g transform={`translate(${vx} ${vy}) rotate(${ang}) translate(0 120)`}>{vel(0, 0, 150, 0.9).map((d, i) => <path key={i} d={d} fill="#FFF6DC"/>)}</g>
          <LightFlash p={(f - n * 0.55) / (n * 0.9)} x={TX} y={HOR - 200} r={1500}/>
        </g>;
      })() : null}
      {after ? <LightFlash p={0.5 + f / 44} x={TX} y={HOR - 200} r={1500}/> : null}
      <Rimmed paths={murugan(after || throwing ? "thrown" : "hold", 0.5, f)} transform={`translate(${mx} ${my - 62}) scale(${-ms} ${ms})`} light={[-(sun[0] - mx), sun[1] - 700]} w={4 / ms}/>
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
      {s.figure !== false ? <g>
        <circle cx={840} cy={GY - 330} r={170} fill="url(#k-halo)" opacity={0.5 + 0.08 * Math.sin(f / 45)}/>
        <Rimmed paths={murugan("hold", 0.5, f)} transform={`translate(840 ${GY - 22}) scale(-1.02 1.02)`} light={[-L(840)[0], L(840)[1]]} w={4}/>
      </g> : null}
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


// ---------- Arun's story: rooms in lamplight ----------
// A window onto a sky, with a grille. The sky is drawn in the window's own box.
const Window: React.FC<{x: number; y: number; w: number; h: number; mood: "dusk" | "dawn" | "night" | "gold"; f: number; id: string; cols?: number; sunAt?: [number, number]}> = ({x, y, w, h, mood, f, id, cols = 4, sunAt = [0.6, 0.8]}) => (
  <g>
    <defs><clipPath id={`${id}wc`}><rect x={x} y={y} width={w} height={h}/></clipPath></defs>
    <g clipPath={`url(#${id}wc)`}><g transform={`translate(${x} ${y}) scale(${w / W} ${h / H})`}><Sky mood={mood} sun={[W * sunAt[0], H * sunAt[1]]} sunR={150} f={f} rays={0.5} id={id}/></g></g>
    <path d={`M ${x - 14} ${y - 14} H ${x + w + 14} V ${y + h + 14} H ${x - 14} Z M ${x} ${y} V ${y + h} H ${x + w} V ${y} Z`} fill="#07050F" fillRule="evenodd"/>
    {Array.from({length: cols - 1}, (_, i) => <rect key={i} x={x + (w * (i + 1)) / cols - 3} y={y} width={6} height={h} fill="#07050F"/>)}
    <rect x={x} y={y + h * 0.5 - 3} width={w} height={6} fill="#07050F"/>
  </g>
);
const Room: React.FC<{floor: number; id: string; c0?: string; c1?: string}> = ({floor, id, c0 = "#120B1E", c1 = "#22142C"}) => (
  <g>
    <defs><linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c0}/><stop offset="1" stopColor={c1}/></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#${id}wall)`}/>
    <rect x={0} y={floor} width={W} height={H - floor} fill="#07040D"/>
  </g>
);
const sheetD = (q: number[][]) => `M ${q.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;

// Beat 1: the office at dusk. The manager's arm out; the others turned away; Arun still.
const SuraOffice: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), FL = 900, sun: [number, number] = [1000, 560];
  const desk = (x: number, w: number) => [`M ${x} ${FL - 150} H ${x + w} V ${FL - 134} H ${x + w - 14} V ${FL} H ${x + w - 30} V ${FL - 134} H ${x + 30} V ${FL} H ${x + 14} V ${FL - 134} H ${x} Z`,
    `M ${x + w * 0.3} ${FL - 250} h ${w * 0.4} v 78 h ${-w * 0.16} v 22 h ${w * 0.08} v 6 h ${-w * 0.24} v -6 h ${w * 0.08} v -22 h ${-w * 0.16} Z`];
  const back = (x: number) => [smooth([[x - 26, FL - 300], [x - 20, FL - 326], [x, FL - 334], [x + 20, FL - 326], [x + 26, FL - 300], [x + 14, FL - 280], [x - 14, FL - 280]]),
    smooth([[x - 56, FL - 150, "c"], [x - 54, FL - 240], [x - 30, FL - 272], [x + 30, FL - 272], [x + 54, FL - 240], [x + 56, FL - 150, "c"]], {wind: "cw"}), `M ${x - 62} ${FL - 230} h 124 v 230 h -16 v -90 h -92 v 90 h -16 Z`];
  const L = (x: number): [number, number] => [sun[0] - x, sun[1] - 620];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={880} cy={600}>
      <Room floor={FL} id="of"/>
      <Window x={330} y={150} w={1260} h={520} mood="dusk" f={f} id="of" cols={6} sunAt={[0.53, 0.78]}/>
      <SoftGlow x={sun[0]} y={620} r={900} ry={520} c0="#FFD9A0" c1="#C2553A" peak={0.3}/>
      <Rimmed paths={[...desk(120, 300), ...back(270), ...desk(1500, 300), ...back(1650)]} light={[0, -1]} w={3} fill="#0E0816"/>
      <Rimmed paths={man("down", 1)} transform={`translate(760 ${FL}) scale(-1.12 1.12)`} light={[-L(760)[0], L(760)[1]]} w={3.6}/>
      <Rimmed paths={man("point", 0)} transform={`translate(1190 ${FL}) scale(1.22)`} light={L(1190)} w={3.4}/>
      <Dust f={f} sun={sun} n={90} y0={200} y1={860}/>
    </Frame>
  );
};
// Beat 2: the door. The child holds the drawing up; then it goes down. s.phase "up" | "down" (default: by time).
const SuraDoor: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), FL = 900, door: [number, number] = [470, 560];
  const down = s.phase ? s.phase === "down" : f > n * 0.56;
  const kid = child(down ? "down" : "up"), ks = 1.3, kx = 1120;
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={900} cy={620}>
      <Room floor={FL} id="dr"/>
      {/* the open door: the lit passage behind Arun */}
      <defs><linearGradient id="dr-door" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE2A6"/><stop offset="1" stopColor="#E89A4A"/></linearGradient></defs>
      <rect x={330} y={250} width={290} height={650} fill="url(#dr-door)"/>
      <SoftGlow x={door[0]} y={600} r={900} ry={640} c0="#FFE2A6" c1="#C2553A" peak={0.42}/>
      <SoftGlow x={720} y={FL + 10} r={620} ry={60} c0="#FFE2A6" c1="#C2553A" peak={0.3}/>
      <path d={`M 306 226 H 644 V 900 H 620 V 250 H 330 V 900 H 306 Z`} fill="#07050F"/>
      <Rimmed paths={man("bag", down ? 0.8 : 0.4)} transform={`translate(520 ${FL}) scale(-1.2 1.2)`} light={[0.2, -0.3]} point={[-40, -260]} w={3.4}/>
      <Rimmed paths={kid.paths} transform={`translate(${kx} ${FL}) scale(${ks})`} light={[-1, -0.2]} w={3.2}/>
      {kid.sheet ? <g transform={`translate(${kx} ${FL}) scale(${ks})`}><path d={sheetD(kid.sheet)} fill="#F3E6C8" opacity={down ? 0.6 : 0.95}/>
        {!down ? <path d="M -100 -250 q 14 -22 30 -6 q 14 14 26 -8 M -92 -268 l 8 -10 M -70 -244 q 10 8 22 2" fill="none" stroke="#3B6C8A" strokeWidth={3} strokeLinecap="round"/> : null}</g> : null}
      {/* a table and a lamp unlit, a home at evening */}
      <Rimmed paths={[`M 1420 ${FL - 190} H 1760 V ${FL - 172} H 1744 V ${FL} H 1726 V ${FL - 172} H 1454 V ${FL} H 1436 V ${FL - 172} H 1420 Z`, `M 1560 ${FL - 190} h 60 l -10 -60 h -40 Z`]} light={[-1, -0.3]} w={3} fill="#0E0816"/>
      <Dust f={f} sun={door} n={70} y0={260} y1={880}/>
    </Frame>
  );
};
// Beat 6: Surapadman on a height, the worlds small below him.
const SuraKing: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), sun: [number, number] = [620, 700];
  const ridge = (y: number, amp: number, seed: number) => { const pts: Pt[] = [[-60, H + 40, "c"], [-60, y, "c"]]; for (let i = 0; i <= 12; i++) pts.push([-60 + (i * (W + 120)) / 12, y - amp * rnd(i, seed)]); pts.push([W + 60, H + 40, "c"]); return smooth(pts, {wind: "cw"}); };
  const small = s.small === true;   // beat 15: the same figure, small, inside a sleeper's outline
  if (small) {
    const m = seatedMan(), sc = 2.5, ox = 1010, oy = 1010;
    return (
      <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={960} cy={600}>
        <rect width={W} height={H} fill="#0A0716"/>
        <SoftGlow x={960} y={560} r={900} c0="#3A2A5C" c1="#140F2C" peak={0.7}/>
        <Rimmed paths={m.paths} transform={`translate(${ox} ${oy}) scale(${sc})`} light={[-1, -0.5]} w={4 / sc} fill="#241838" rim="#8FA6E0"/>
        <SoftGlow x={990} y={500} r={210} c0="#FFD38A" c1="#C2553A" peak={0.75}/>
        <Rimmed paths={surapadman(0.4, f)} transform={`translate(1000 620) scale(0.5)`} light={[-1, -0.6]} w={7}/>
        <Rimmed paths={mango({x: 0, y: 0, h: 150, seed: 8, t: f, detail: 0.5})} transform="translate(1090 622)" light={[-1, -0.6]} w={2.5}/>
      </Frame>
    );
  }
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={1300} cy={500}>
      <Sky mood="dusk" sun={sun} f={f} rays={0.5} id="kg"/>
      <path d={ridge(760, 60, 2)} fill="#3A2244" opacity={0.9}/>
      <path d={ridge(840, 70, 5)} fill="#2A1630"/>
      {/* the worlds below: far lamps in rows, and small bowed figures on a ledge */}
      {Array.from({length: 70}, (_, i) => <circle key={i} cx={80 + rnd(i, 1) * 1000} cy={800 + rnd(i, 2) * 150} r={1.4 + rnd(i, 3) * 1.6} fill="#FFD38A" opacity={0.35 + 0.5 * rnd(i, 4)}/>)}
      <Rimmed paths={[ridge(930, 50, 9)]} light={[-1, -0.4]} w={3} fill="#150B1C"/>
      {Array.from({length: 7}, (_, i) => <Rimmed key={i} paths={man("down", 1)} transform={`translate(${230 + i * 84} ${918 + 8 * rnd(i, 6)}) scale(-0.2 0.2)`} light={[-1, -0.5]} w={10}/>)}
      <Rimmed paths={[smooth([[1040, H + 40, "c"], [1080, 760], [1160, 640], [1260, 600], [1420, 596], [1560, 610], [1700, 600], [1990, 560], [1990, H + 40, "c"]], {wind: "cw"})]} light={[-1, -0.5]} w={4} fill="#0B0612"/>
      <Rimmed paths={surapadman(0.6, f)} transform={`translate(1400 598) scale(1.06)`} light={[-1, -0.25]} w={4}/>
      <Dust f={f} sun={sun} n={120} y0={300}/>
    </Frame>
  );
};
// Beat 7: six flames on the lake become one light; then the vel is given. s.phase "flames" | "vel" (default: by time).
const SuraBirth: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), HOR = 640, moon: [number, number] = [1420, 300];
  const t = f / Math.max(1, n), given = s.phase ? s.phase === "vel" : t > 0.5;
  const u = s.phase === "flames" ? 0.35 : Math.min(1, t / 0.42), cx = 960, cy = HOR + 130;
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={960} cy={640}>
      <Sky mood="night" sun={moon} sunR={54} f={f} rays={0.15} horizon={HOR} id="bi"/>
      <Sea y={HOR} sunX={given ? 960 : cx} f={f} id="bi" top="#3A2A5C" glint="#FFE2B0" k={0.9}/>
      {given ? <g>
        <SoftGlow x={960} y={600} r={520} c0="#FFE9B0" c1="#F0A04B" peak={0.6}/>
        <Rimmed paths={[smooth([[300, H + 40, "c"], [360, 900], [700, 868], [1200, 866], [1560, 900], [1640, H + 40, "c"]], {wind: "cw"})]} light={[0, -1]} w={3} fill="#0B0612"/>
        <Rimmed paths={woman(true)} transform={`translate(1130 872) scale(1.25)`} light={[-1, -0.3]} point={[-140, -250]} w={3.2}/>
        <Rimmed paths={murugan("thrown", 0.3, f)} transform={`translate(790 872) scale(-0.74 0.74)`} light={[1, -0.3]} w={5}/>
        <SoftGlow x={955} y={520} r={190} c0="#FFFFFF" c1="#FFD38A" peak={0.85} k={3}/>
        <g transform="translate(955 872)">{vel(0, 0, 330, 1.25).map((d, i) => <path key={i} d={d} fill="#FFF3D2"/>)}</g>
      </g> : Array.from({length: 6}, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.3, R = 520 * (1 - u) + 14, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.22 - 20 * (1 - u);
        return <Flame key={i} x={x} y={y} h={70 + 30 * u} f={f} seed={i} calm={0.7} halo={1.1}/>;
      })}
      <Rimmed paths={[...reeds({x: 140, y: 1040, h: 330, seed: 3, t: f}), ...reeds({x: 1790, y: 1050, h: 380, seed: 7, t: f})]} light={[given ? 0 : (cx - 960), -1]} w={2.5} fill="#08040C"/>
      <LightFlash p={s.phase ? 0 : (t - 0.38) / 0.24} x={960} y={600} r={1500}/>
    </Frame>
  );
};
// Beat 8: the war across six days: two hosts on a shore, six lamps lit one by one.
const SuraWar: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), HOR = 600, sun: [number, number] = [960, 570];
  const host = (x0: number, x1: number, y: number, k: number, seed: number) => {
    const P: string[] = []; const c = Math.round((x1 - x0) / (16 * k));
    for (let i = 0; i < c; i++) { const x = x0 + ((x1 - x0) * i) / c + rnd(i, seed) * 6, h = (34 + rnd(i, seed + 1) * 10) * k;
      P.push(`M ${x - 5 * k} ${y} L ${x - 6 * k} ${y - h * 0.62} L ${x - 3 * k} ${y - h * 0.7} A ${4.6 * k} ${4.6 * k} 0 1 1 ${x + 3 * k} ${y - h * 0.7} L ${x + 6 * k} ${y - h * 0.62} L ${x + 5 * k} ${y} Z`);
      if (i % 3 === 0) { const lean = (rnd(i, seed + 2) - 0.5) * 10 * k; P.push(`M ${x + 8 * k} ${y - h * 0.2} L ${x + 8 * k + lean} ${y - h * 2.1} L ${x + 10.5 * k + lean} ${y - h * 2.1} L ${x + 10.5 * k} ${y - h * 0.2} Z`); } }
    return P.join(" ");
  };
  const lit = (i: number) => Math.max(0, Math.min(1, (f - (20 + (i * (n - 70)) / 6)) / 18));
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={960} cy={640}>
      <Sky mood="dusk" sun={sun} f={f} rays={0.4} horizon={HOR} id="wr"/>
      <Sea y={HOR} sunX={sun[0]} f={f} id="wr" k={0.8}/>
      <path d={smooth([[-60, H + 40, "c"], [-60, 700], [400, 676], [960, 690], [1500, 672], [1980, 700], [1980, H + 40, "c"]], {wind: "cw"})} fill="#1A0F22"/>
      <Rimmed paths={[host(40, 820, 716, 1, 1), host(1100, 1880, 716, 1, 4)]} light={[0, -1]} w={2} fill="#221430"/>
      <Rimmed paths={[host(-20, 760, 786, 1.5, 7), host(1160, 1940, 786, 1.5, 9)]} light={[0, -1]} w={2.5}/>
      <Haze y={700} h={120} color="#E58A4A" op={0.22}/>
      <path d={smooth([[-60, H + 40, "c"], [-60, 900], [500, 880], [960, 892], [1420, 880], [1980, 900], [1980, H + 40, "c"]], {wind: "cw"})} fill="#08040C"/>
      {Array.from({length: 6}, (_, i) => <Diya key={i} x={460 + i * 200} y={930} s={1.5} f={f} seed={i} lit={lit(i)} flame={lit(i) > 0.05}/>)}
      <Dust f={f} sun={sun} n={110} y0={300}/>
    </Frame>
  );
};
// Beat 14: Tiruchendur shore at dawn: the temple tower, the crowd, the sea.
const SuraShore: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), HOR = 620, sun: [number, number] = [1340, 600];
  const crowd = (y: number, k: number, seed: number) => { const P: string[] = []; for (let x = -20; x < W + 20; x += 15 * k) { const j = rnd(x, seed), h = (30 + j * 12) * k, xx = x + j * 5;
    P.push(`M ${xx - 6 * k} ${y + 40} L ${xx - 7 * k} ${y - h * 0.55} L ${xx - 3 * k} ${y - h * 0.68} A ${4.8 * k} ${4.8 * k} 0 1 1 ${xx + 3 * k} ${y - h * 0.68} L ${xx + 7 * k} ${y - h * 0.55} L ${xx + 6 * k} ${y + 40} Z`);
    } return P.join(" "); };
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={900} cy={600}>
      <Sky mood="dawn" sun={sun} f={f} rays={0.5} horizon={HOR} id="sh"/>
      <Sea y={HOR} sunX={sun[0]} f={f} id="sh" top="#C98A78" glint="#FFF0CC" k={1.1}/>
      <path d={smooth([[-60, H + 40, "c"], [-60, 640], [300, 650], [700, 690], [1100, 760], [1500, 860], [1980, 960], [1980, H + 40, "c"]], {wind: "cw"})} fill="#2A1A34"/>
      <Rimmed paths={gopuram(360, 668, 250)} light={[1, -0.15]} w={3.5} fill="#1C1026"/>
      <Rimmed paths={[`M 60 668 H 700 V 640 H 60 Z`, ...gopuram(640, 668, 90, 5)]} light={[1, -0.15]} w={2.5} fill="#1C1026"/>
      <Haze y={690} h={110} color="#FFC890" op={0.25}/>
      <Rimmed paths={[crowd(790, 1.2, 2)]} light={[1, -0.3]} w={2} fill="#1E1228"/>
      <Rimmed paths={[crowd(880, 1.8, 5)]} light={[1, -0.3]} w={2.5} fill="#150B1E"/>
      <Rimmed paths={[crowd(1010, 2.8, 8)]} light={[1, -0.3]} w={3}/>
      <Dust f={f} sun={sun} n={120} y0={300}/>
    </Frame>
  );
};
// Beat 17: morning. Arun on one knee beside his son; the drawing lifted again.
const SuraMorning: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), FL = 900, sun: [number, number] = [520, 520];
  const kid = child("up"), ks = 1.45, kx = 820;
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={960} cy={640}>
      <Room floor={FL} id="mo" c0="#2A1C38" c1="#4A2B4C"/>
      <Window x={250} y={170} w={560} h={470} mood="dawn" f={f} id="mo" cols={4} sunAt={[0.5, 0.74]}/>
      <SoftGlow x={sun[0]} y={560} r={1100} ry={700} c0="#FFE6B8" c1="#E3967A" peak={0.5}/>
      <path d={`M 250 ${FL} L 480 ${FL} L 1500 ${H} L 700 ${H} Z`} fill="#FFE2A6" opacity={0.1}/>
      <Rimmed paths={kid.paths} transform={`translate(${kx} ${FL}) scale(${-ks} ${ks})`} light={[1, -0.3]} w={3}/>
      <g transform={`translate(${kx} ${FL}) scale(${-ks} ${ks})`}><path d={sheetD(kid.sheet as number[][])} fill="#F6EAD0"/>
        <path d="M -100 -250 q 14 -22 30 -6 q 14 14 26 -8 M -92 -268 l 8 -10 M -70 -244 q 10 8 22 2" fill="none" stroke="#3B6C8A" strokeWidth={3} strokeLinecap="round"/></g>
      <Rimmed paths={kneeling()} transform={`translate(1200 ${FL}) scale(1.5)`} light={[-1, -0.3]} w={2.8}/>
      <Dust f={f} sun={sun} n={110} y0={200} y1={900}/>
    </Frame>
  );
};
// Beat 18: the drawing, seen at last: a child's peacock in crayon.
const SuraDrawing: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const wob = (i: number) => (rnd(i, 11) - 0.5) * 9;
  const stroke = (pts: number[][], col: string, w = 9, k = 0) => <path d={smooth(pts.map(([x, y], i) => [x + wob(i + k), y + wob(i + k + 40)] as Pt), {closed: false})} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.86}/>;
  const draw = Math.min(1, f / 40);
  return (
    <Frame f={f} zoom={push(f, n, 1.02, 1.1)} cx={960} cy={520}>
      <defs><linearGradient id="dw-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7C58E"/><stop offset="1" stopColor="#7D4A62"/></linearGradient></defs>
      <rect width={W} height={H} fill="url(#dw-bg)"/>
      <SoftGlow x={420} y={200} r={1200} c0="#FFF0C8" c1="#F7C58E" peak={0.6}/>
      <g transform="translate(960 520) rotate(-4)" opacity={draw}>
        <rect x={-470} y={-330} width={940} height={660} fill="#2A1630" opacity={0.25} transform="translate(14 18)"/>
        <rect x={-470} y={-330} width={940} height={660} fill="#FBF3DF"/>
        {/* the fan: big loops of green and blue; the body; legs; a sun; grass */}
        {Array.from({length: 9}, (_, i) => { const a = Math.PI * (1.08 - (1.16 * i) / 8), x = Math.cos(a) * 250, y = -30 - Math.sin(a) * 230;
          return <g key={i}>{stroke([[0, 30], [x * 0.5, y * 0.5 + 10], [x, y]], i % 2 ? "#2E8B6A" : "#2C6FA8", 12, i * 7)}<circle cx={x + wob(i)} cy={y + wob(i + 3)} r={20} fill="none" stroke="#E0872E" strokeWidth={8}/><circle cx={x + wob(i)} cy={y + wob(i + 3)} r={7} fill="#2C3E8C"/></g>; })}
        {stroke([[-50, 60], [-60, 20], [-20, -10], [30, 10], [50, 60], [10, 100], [-40, 90], [-50, 60]], "#2C6FA8", 14, 90)}
        {stroke([[-30, 0], [-50, -50], [-36, -96]], "#2C6FA8", 13, 120)}
        <circle cx={-38} cy={-108} r={17} fill="none" stroke="#2C6FA8" strokeWidth={11}/>
        {stroke([[-54, -106], [-84, -98], [-56, -92]], "#E0872E", 8, 130)}
        {[-20, 20].map((x, i) => <g key={i}>{stroke([[x, 100], [x - 2, 170], [x - 22, 186]], "#C0562E", 8, 150 + i * 9)}{stroke([[x - 2, 170], [x + 18, 186]], "#C0562E", 8, 170 + i * 9)}</g>)}
        {stroke([[-420, 230], [-300, 214], [-180, 232], [-40, 216], [120, 234], [280, 214], [420, 230]], "#3F9B5A", 11, 200)}
        <circle cx={340} cy={-230} r={44} fill="none" stroke="#F0A62E" strokeWidth={11}/>
        {Array.from({length: 8}, (_, i) => { const a = (i / 8) * Math.PI * 2; return <path key={i} d={`M ${340 + Math.cos(a) * 62} ${-230 + Math.sin(a) * 62} L ${340 + Math.cos(a) * 88} ${-230 + Math.sin(a) * 88}`} stroke="#F0A62E" strokeWidth={9} strokeLinecap="round"/>; })}
      </g>
      {/* two small hands at the lower corners */}
      <Rimmed paths={[smooth([[380, H + 40, "c"], [400, 960], [450, 880], [520, 850], [560, 880], [540, 960], [520, H + 40, "c"]], {wind: "cw"}), smooth([[1400, H + 40, "c"], [1380, 960], [1400, 880], [1470, 850], [1520, 880], [1540, 960], [1540, H + 40, "c"]], {wind: "cw"})]} light={[-1, -0.6]} w={4}/>
    </Frame>
  );
};
// A verse card whose text is not set yet. Rule 2 (nobody types a verse by hand): the lines come from a checked edition
// through the corpus. Until then the card names the source and says so.
const SuraVerse: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), o = Math.min(1, f / 24);
  return (
    <Frame f={f} zoom={1}>
      <rect width={W} height={H} fill="#0A0716"/>
      <SoftGlow x={960} y={520} r={900} c0="#3A2244" c1="#140F2C" peak={0.8}/>
      <g opacity={o}>
        <text x={960} y={330} textAnchor="middle" fontFamily={CAPS} fontSize={30} letterSpacing={8} fill="#D9B26A">{String(s.kicker || "").toUpperCase()}</text>
        <rect x={660} y={372} width={600} height={1.5} fill="url(#k-fade-h)"/>
        <rect x={420} y={430} width={1080} height={250} fill="none" stroke="#B8862F" strokeWidth={1.5} strokeDasharray="10 10" opacity={0.7}/>
        <text x={960} y={540} textAnchor="middle" fontFamily={CAPS} fontSize={34} letterSpacing={6} fill="#FFE3A3">{String(s.pending || "VERSE TEXT TO BE SET")}</text>
        <text x={960} y={600} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontSize={34} fill="#C9B48A">{String(s.note || "")}</text>
        <text x={960} y={770} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontSize={40} fill="#F4EBDA">{String(s.gist || "")}</text>
        <text x={960} y={830} textAnchor="middle" fontFamily={CAPS} fontSize={24} letterSpacing={5} fill="#D9B26A">{String(s.src || "").toUpperCase()}</text>
      </g>
    </Frame>
  );
};
// The end card: the title, the sources, the disclosure.
const SuraEnd: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), lines: string[] = Array.isArray(s.lines) ? s.lines : [];
  return (
    <Frame f={f} zoom={1}>
      <Sky mood="night" sun={null} f={f} rays={0} id="en"/>
      <Diya x={900} y={250} s={2.2} f={f} seed={2}/>
      <text x={960} y={400} textAnchor="middle" fontFamily={CAPS} fontSize={60} letterSpacing={6} fill="url(#k-gold)">{String(s.title || "").toUpperCase()}</text>
      <text x={960} y={456} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontSize={38} fill="#F4EBDA">{String(s.subtitle || "")}</text>
      <rect x={660} y={490} width={600} height={1.5} fill="url(#k-fade-h)"/>
      {lines.map((l, i) => <text key={i} x={960} y={548 + i * 42} textAnchor="middle" fontFamily={EN} fontSize={28} fill="#C9B48A" opacity={Math.min(1, Math.max(0, (f - 14 - i * 6) / 16))}>{l}</text>)}
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {suraTree: SuraTree, suraMurugan: SuraMurugan, suraArun: SuraArun, suraOffice: SuraOffice, suraDoor: SuraDoor, suraKing: SuraKing,
  suraBirth: SuraBirth, suraWar: SuraWar, suraShore: SuraShore, suraMorning: SuraMorning, suraDrawing: SuraDrawing, suraVerse: SuraVerse, suraEnd: SuraEnd};
