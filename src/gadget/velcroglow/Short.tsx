// The Inventor's Desk, style pilot P01 "The Sticky Dog That Invented Velcro" (27 Oct 2026). Desk Glow look (glow.tsx):
// Alps hook at dusk -> one continuous camera dive (dog -> fur -> burr -> tiny hooks -> one hook catching a loop) ->
// the idea (two strips) -> the name (VELours + CROchet) -> today, ending on the dog. Cues come from the aligned narration.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {FPS, H, HEAD, SERIF, W, makeCues, useGKFonts, Timing} from "../kit";
import timing from "./timing.json";
import script from "./script.json";
import {Big, Dive, G, Glow, GlowTop, Grain, Motes, Pill, Sky, Stars, Svg, Vignette, bob, clamp01, inOut, rnd, sm, usePopAt} from "./glow";
import {Burr, Person, Pup, blinkAt} from "./rig";

const T = timing as unknown as Timing & {estimate?: boolean};
const cue = makeCues(T); const at = cue.at;
const VOICED = !T.estimate;
export const VELCRO_FRAMES = cue.total + 45;

// scene changes (a few frames before the first word of the beat)
const S4 = at("b06") - 5, S5 = at("b07") - 5, S6 = at("b08") - 5;
// characters in the hook
const GROUND = 1400, DOGX = 560, DS = 1.35, GEOX = 175;
// zoom points: P0 = the burr on the dog's back (BURR_SPOTS[1], dog flipped), P1 = the hero hook's curl centre
const P0: [number, number] = [DOGX + 12 * DS, GROUND - 152 * DS];
const BURR_R = 220, K0 = BURR_R / (12 * DS);
const P1: [number, number] = [P0[0] - 22, P0[1] - 380];
const U1 = 22, U2 = 154, U3 = 385;

// ---------- the hook (a J turned over): local curl centre (0,0), radius 1, shaft along y = 1 towards -x; rotate -90 = shaft hangs down
const Hook: React.FC<{cx: number; cy: number; u: number; shaft?: number; flex?: number; dim?: number; color?: string}> = ({cx, cy, u, shaft = 17.3, flex = 0, dim = 1, color = G.mint}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${-90 + flex}) scale(${u})`} opacity={dim}>
    <path d={`M ${-shaft} 1 L 0 1`} stroke={G.burrLo} strokeWidth={0.5} strokeLinecap="round"/>
    <path d={`M ${-shaft} 1 L 0 1`} stroke={G.burrHi} strokeWidth={0.16} strokeLinecap="round" opacity={0.7} transform="translate(0 -0.1)"/>
    <path d="M 0 1 A 1 1 0 0 0 0 -1 A 1 1 0 0 0 -0.75 -0.66" stroke={color} strokeWidth={1.25} strokeLinecap="round" fill="none" opacity={0.14}/>
    <path d="M 0 1 A 1 1 0 0 0 0 -1 A 1 1 0 0 0 -0.75 -0.66" stroke={color} strokeWidth={0.45} strokeLinecap="round" fill="none"/>
    <path d="M 0.2 0.84 A 0.86 0.86 0 0 0 0.05 -0.86" stroke={G.cream} strokeWidth={0.09} strokeLinecap="round" fill="none" opacity={0.55}/>
  </g>
);

// ---------- level 0: the Alps at dusk, the dog and George
const ridge = (seed: number, base: number, amp: number, n: number) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = -150 + (i / n) * (W + 400);
    const y = i % 2 ? base - amp * (0.55 + 0.45 * rnd(i + seed)) : base - amp * 0.25 * rnd(i * 3 + seed);
    pts.push([x, y]);
  }
  return pts;
};
const Mountains: React.FC<{seed: number; base: number; amp: number; n: number; color: string; snow: number; dx: number}> = ({seed, base, amp, n, color, snow, dx}) => {
  const p = ridge(seed, base, amp, n);
  return (
    <g transform={`translate(${dx} 0)`}>
      <polygon points={[...p.map(([x, y]) => `${x},${y}`), `${W + 250},${H}`, `-150,${H}`].join(" ")} fill={color}/>
      {p.map(([x, y], i) => {
        if (i % 2 === 0 || i === p.length - 1) return null;
        const [lx, ly] = p[i - 1], [rx, ry] = p[i + 1], q = 0.26;
        const a = [x + (lx - x) * q, y + (ly - y) * q], b = [x + (rx - x) * q, y + (ry - y) * q];
        return <polygon key={i} points={`${x},${y} ${a[0]},${a[1]} ${(x + a[0]) / 2 + 6},${(y + a[1]) / 2 + 14} ${x},${y + (a[1] - y) * 0.7} ${(x + b[0]) / 2 - 4},${(y + b[1]) / 2 + 10} ${b[0]},${b[1]}`} fill={G.snow} opacity={snow}/>;
      })}
    </g>
  );
};
const Pine: React.FC<{x: number; y: number; h: number; o?: number}> = ({x, y, h, o = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-h * 0.04} y={-h * 0.12} width={h * 0.08} height={h * 0.14} fill="#0B2230"/>
    {[0, 1, 2].map((k) => {
      const w = h * (0.42 - k * 0.1), top = -h * (0.45 + k * 0.27), bot = -h * (0.1 + k * 0.27);
      return (
        <g key={k}>
          <polygon points={`0,${top} ${w},${bot} ${-w},${bot}`} fill="#0F3442"/>
          <polygon points={`0,${top} ${w},${bot} ${w * 0.35},${bot}`} fill="#1E5A64" opacity={0.75}/>
        </g>
      );
    })}
  </g>
);
const BurdockPlant: React.FC<{x: number; y: number; s: number; flip?: boolean}> = ({x, y, s, flip}) => {
  const f = useCurrentFrame(); const sway = bob(f, 3, 3.1, x);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${sway})`}>
      <path d="M0 0 C 6 -60 -4 -120 10 -190" stroke="#2C5A3E" strokeWidth={9} fill="none" strokeLinecap="round"/>
      <path d="M2 -40 C 50 -60 80 -40 96 -10 C 60 -6 20 -14 2 -40 Z" fill="#2F6B45"/>
      <path d="M4 -80 C -40 -110 -70 -90 -84 -60 C -50 -54 -14 -60 4 -80 Z" fill="#285E3C"/>
      {[[10, -190, 13], [-12, -168, 11], [28, -160, 10], [6, -150, 9]].map(([bx, by, r], k) => <g key={k} transform={`translate(${bx} ${by})`}><Burr r={r} seed={k + 30}/></g>)}
    </g>
  );
};

const Alps: React.FC = () => {
  const f = useCurrentFrame();
  const arrive = at("b01", "covered"), cling = at("b01", "cling");
  const wt = clamp01(f / arrive);
  const dogX = 1110 + (DOGX - 1110) * (1 - Math.pow(1 - wt, 2));
  const walking = f < arrive;
  const shake = sm(cling, cling + 4, f) * (1 - sm(cling + 26, cling + 34, f));
  const wonder = at("b02", "wondered");
  const reach = sm(wonder, wonder + 12, f);
  return (
    <AbsoluteFill>
      <Sky stops={[[0, G.night0], [0.3, G.indigo], [0.5, G.plum], [0.6, G.dusk], [0.7, G.horizon]]}/>
      <Svg>
        <Stars n={60} maxY={720} o={0.9}/>
        <Glow x={720} y={1060} r={620} color={G.horizon} o={0.75}/>
        <circle cx={720} cy={1030} r={78} fill={G.gold}/>
        <circle cx={720} cy={1030} r={60} fill={G.cream} opacity={0.6}/>
        <Mountains seed={2} base={1110} amp={380} n={9} color="#6A3F7E" snow={0.75} dx={-f * 0.05}/>
        <Mountains seed={9} base={1210} amp={300} n={11} color="#3D2C68" snow={0.55} dx={-f * 0.09}/>
        <path d={`M -100 1290 Q 250 1210 560 1265 Q 860 1310 1180 1240 L 1180 ${H} L -100 ${H} Z`} fill="#1F2D57"/>
        {[60, 140, 230, 820, 900, 990, 1050].map((x, k) => <Pine key={k} x={x - f * 0.12} y={1290 - (k % 3) * 14} h={150 + (k % 3) * 40}/>)}
        <Motes n={18} seed={5} color={G.gold} rise={10} size={0.8} o={0.8}/>
        <path d={`M -100 1360 Q 540 1320 1180 1365 L 1180 ${H} L -100 ${H} Z`} fill="#17324D"/>
        <path d="M 380 1920 Q 470 1560 560 1400 Q 620 1395 700 1400 Q 760 1600 980 1920 Z" fill="#20476A" opacity={0.6}/>
        <rect x={-100} y={1560} width={1300} height={400} fill="#0B1A2C" opacity={0.45}/>
        <Glow x={GEOX + 40} y={1240} r={420} color={G.amber} o={0.12}/>
        <g transform={`translate(${GEOX} ${GROUND}) scale(${DS})`}>
          <Person f={f} brow={f > wonder ? 1 : f > cling ? -0.6 : 0.2} mouth={f > wonder ? "o" : f > cling ? "flat" : "smile"} tilt={8 * reach} armR={-8 + 58 * reach} armL={8} look={0.6} blink={blinkAt(f, 88, 20)}/>
        </g>
        <g transform={`translate(${dogX} ${GROUND}) scale(${-DS} ${DS})`}>
          <Pup f={f} walk={walking ? f * 0.42 : null} shake={shake} wag={walking ? 0.2 : 0.7} look={0.4} blink={blinkAt(f, 110, 50)} earUp={0}/>
        </g>
        <BurdockPlant x={70} y={1720} s={1.5}/>
        <BurdockPlant x={1010} y={1760} s={1.7} flip/>
      </Svg>
    </AbsoluteFill>
  );
};

// ---------- level 1: fur close-up with one burr
const Fur: React.FC = () => {
  const f = useCurrentFrame();
  const strand = (k: number, front = false) => {
    const x0 = -1700 + k * 46 + rnd(k) * 30, sway = bob(f, 14, 3.4, k * 0.7);
    const w = front ? 30 + rnd(k + 4) * 16 : 40 + rnd(k + 2) * 30;
    const c = front ? G.chestnutHi : [G.chestnutLo, G.chestnut, "#A9472A"][k % 3];
    return (
      <g key={(front ? "f" : "b") + k}>
        <path d={`M ${x0 - 300} -1900 C ${x0 + 160 + sway} 500, ${x0 + 40 - sway} 1300, ${x0 + 560 + sway} 3900`} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" opacity={front ? 0.92 : 1}/>
        <path d={`M ${x0 - w * 0.2 - 300} -1900 C ${x0 + 150 + sway} 500, ${x0 + 30 - sway} 1300, ${x0 + 550 + sway} 3900`} stroke={G.chestnutHi} strokeWidth={w * 0.18} fill="none" strokeLinecap="round" opacity={0.45}/>
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <Sky stops={[[0, "#2A0F08"], [0.5, "#4A1B0E"], [1, "#2A0F08"]]} bleed={3000}/>
      <Svg>
        {Array.from({length: 96}, (_, k) => strand(k))}
        <rect x={-3000} y={-3000} width={W + 6000} height={H + 6000} fill="#1A0804" opacity={0.35}/>
        <Glow x={P0[0]} y={P0[1]} r={620} color={G.gold} o={0.4}/>
        <Hook cx={P1[0]} cy={P1[1]} u={U1}/>
        <g transform={`translate(${P0[0]} ${P0[1]}) rotate(${bob(f, 1.2, 4)})`}><Burr r={BURR_R} n={22} seed={3} hooks gap={-90}/></g>
        {[37, 43, 51].map((k) => strand(k, true))}
        <Motes n={14} seed={11} color={G.cream} rise={6} size={0.6} o={0.5}/>
      </Svg>
    </AbsoluteFill>
  );
};

// ---------- level 2: the microscopic world: hundreds of tiny hooks
const Micro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: -3000, top: -3000, right: -3000, bottom: -3000, background: `radial-gradient(circle at ${P1[0] + 3000}px ${P1[1] + 3000}px, #11485A 0px, #0A2236 700px, #050E1C 1400px)`}}/>
      <Svg>
        {Array.from({length: 14}, (_, k) => <circle key={k} cx={rnd(k + 70) * W} cy={(rnd(k + 71) * H + f * (0.3 + rnd(k) * 0.4)) % H} r={40 + rnd(k + 72) * 90} fill={k % 2 ? G.mint : G.gold} opacity={0.05}/>)}
        {Array.from({length: 150}, (_, k) => {
          const x = -1000 + rnd(k + 100) * (W + 2000), y = -1000 + rnd(k + 200) * (H + 2000), u = 9 + rnd(k + 300) * 14;
          if (Math.hypot(x - P1[0], y - P1[1]) < 260) return null;
          return <Hook key={k} cx={x} cy={y} u={u} shaft={5} flex={(rnd(k + 400) - 0.5) * 120 + bob(f, 6, 3, k)} dim={0.22 + rnd(k + 500) * 0.25}/>;
        })}
        {[[170, 1350, 64, -30], [930, 1290, 78, 25], [230, 470, 58, -45], [900, 420, 70, 35], [640, 1620, 52, 10]].map(([x, y, u, r], k) => (
          <Hook key={k} cx={x} cy={y} u={u} shaft={9} flex={r + bob(f, 4, 3.6, k)} dim={0.62}/>
        ))}
        <Glow x={P1[0]} y={P1[1]} r={360} color={G.mint} o={0.28}/>
        <Hook cx={P1[0]} cy={P1[1]} u={U2} flex={bob(f, 1.5, 3.2)}/>
      </Svg>
    </AbsoluteFill>
  );
};

// ---------- level 3: one hook catching a loop
const Catch: React.FC = () => {
  const f = useCurrentFrame();
  const r0 = at("b05", "anything"), r1 = at("b05", "loop|+0.5");
  const rise = inOut(clamp01((f - r0) / (r1 - r0)));
  const tug = f > r1 ? Math.max(0, Math.sin((f - r1) / 7)) * 46 : 0;
  const lx = P1[0], top = P1[1] - U3 * 0.775 + 34;   // the loop rests on the inside top of the curl
  const dy = (1 - rise) * 1300 + tug;
  const flex = -tug * 0.05;
  const loopD = `M ${lx - 115} 2100 C ${lx - 120} 1400, ${lx - 110} ${top + 50}, ${lx} ${top} C ${lx + 110} ${top + 50}, ${lx + 120} 1400, ${lx + 115} 2100`;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: -3000, top: -3000, right: -3000, bottom: -3000, background: `radial-gradient(circle at ${P1[0] + 3000}px ${P1[1] + 3000}px, #14506A 0px, #0A2236 700px, #050E1C 1400px)`}}/>
      <Svg>
        {Array.from({length: 10}, (_, k) => <circle key={k} cx={rnd(k + 90) * W} cy={(rnd(k + 91) * H - f * 0.5) % H + (f * 0.5 > rnd(k + 91) * H ? H : 0)} r={60 + rnd(k + 92) * 120} fill={k % 2 ? G.mint : G.coral} opacity={0.05}/>)}
        {Array.from({length: 26}, (_, k) => {
          const x = rnd(k + 600) * W, y = rnd(k + 700) * H;
          if (Math.hypot(x - P1[0], y - P1[1]) < 520) return null;
          return <Hook key={k} cx={x} cy={y} u={16 + rnd(k + 800) * 18} shaft={4} flex={(rnd(k + 900) - 0.5) * 140} dim={0.18}/>;
        })}
        <Glow x={P1[0]} y={P1[1]} r={700} color={G.mint} o={0.22}/>
        <g transform={`translate(0 ${dy})`}>
          <path d={loopD} stroke={G.coral} strokeWidth={96} fill="none" opacity={0.18}/>
          <path d={loopD} stroke={G.coral} strokeWidth={62} fill="none" strokeLinecap="round"/>
          <path d={loopD} stroke={G.rose} strokeWidth={14} fill="none" opacity={0.6} transform="translate(-12 -8)"/>
        </g>
        <Hook cx={P1[0]} cy={P1[1]} u={U3} flex={flex}/>
        {tug > 4 && <Glow x={lx} y={top - 20 + tug * 0.3} r={150} color={G.cream} o={0.25 + tug / 140}/>}
      </Svg>
    </AbsoluteFill>
  );
};

// the microscope lens over levels 1–2
const Lens: React.FC<{o: number}> = ({o}) => {
  if (o <= 0) return null;
  const cx = 554, cy = 930, r = 470;
  return (
    <Svg style={{opacity: o}}>
      <path d={`M0 0 H${W} V${H} H0 Z M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`} fill="#040A16" fillRule="evenodd" opacity={0.86}/>
      <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke={G.mint} strokeWidth={26} opacity={0.12}/>
      <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={G.mint} strokeWidth={6}/>
      {Array.from({length: 36}, (_, k) => {
        const a = (k / 36) * Math.PI * 2, L = k % 3 ? 14 : 30;
        return <line key={k} x1={cx + Math.cos(a) * (r + 18)} y1={cy + Math.sin(a) * (r + 18)} x2={cx + Math.cos(a) * (r + 18 + L)} y2={cy + Math.sin(a) * (r + 18 + L)} stroke={G.mint} strokeWidth={3} opacity={0.6}/>;
      })}
    </Svg>
  );
};

// fur / hair / threads: three small hook-and-loop insets
const Inset: React.FC<{x: number; y: number; f0: number; kind: "fur" | "hair" | "thread"; label: string}> = ({x, y, f0, kind, label}) => {
  const f = useCurrentFrame(); const pop = usePopAt()(f0);
  if (pop <= 0) return null;
  const col = kind === "fur" ? G.chestnutHi : kind === "hair" ? "#7A4B2E" : G.sky;
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <g transform={`translate(${x} ${y}) scale(${pop})`}>
          <circle r={128} fill="#081424" opacity={0.92}/>
          <circle r={128} fill="none" stroke={col} strokeWidth={6}/>
          {kind === "thread"
            ? [-60, -20, 20, 60].map((xx, k) => <path key={k} d={`M ${xx - 22} 120 C ${xx - 26} 40, ${xx + 26} 40, ${xx + 22} 120`} stroke={col} strokeWidth={12} fill="none"/>)
            : <path d={kind === "fur" ? "M -60 130 C -50 40, -20 0, 0 4 C 22 0, 50 40, 60 130" : "M -40 130 C -70 60, -20 -6, 4 2 C 40 10, 30 70, 50 130"} stroke={col} strokeWidth={16} fill="none" strokeLinecap="round"/>}
          <g transform={`translate(0 ${kind === "thread" ? 44 : 30}) rotate(${bob(f, 3, 1.4, x)})`}>
            <Hook cx={-4} cy={-44 + (kind === "thread" ? 4 : 0)} u={40} shaft={3}/>
          </g>
        </g>
      </svg>
      <Pill x={x} y={y + 172} text={label} f0={f0 + 3} color={col} size={34}/>
    </>
  );
};

// ---------- the idea: two strips
const Strip: React.FC<{x: number; y: number; kind: "hooks" | "loops"}> = ({x, y, kind}) => {
  const f = useCurrentFrame(); const w = 620, h = 60, hook = kind === "hooks";
  const body = hook ? G.deepTeal : "#9E3B35", hi = hook ? G.mint : G.coral;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={body}/>
      <rect x={-w / 2 + 10} y={hook ? -h / 2 + 8 : h / 2 - 16} width={w - 20} height={8} rx={4} fill={hi} opacity={0.6}/>
      {Array.from({length: 17}, (_, k) => {
        const xx = -w / 2 + 30 + k * 35;
        return hook
          ? <g key={k} transform={`translate(${xx} ${h / 2 + 2}) scale(1 -1) rotate(${bob(f, 3, 1.2, k)})`}><Hook cx={0} cy={-16} u={10} shaft={1.6}/></g>
          : <path key={k} d={`M ${xx - 12} ${-h / 2} C ${xx - 16} ${-h / 2 - 34}, ${xx + 16} ${-h / 2 - 34}, ${xx + 12} ${-h / 2}`} stroke={G.coral} strokeWidth={6} fill="none"/>;
      })}
    </g>
  );
};
const Idea: React.FC = () => {
  const f = useCurrentFrame();
  const wi = at("b06", "what if"), hk = at("b06", "hooks"), lp = at("b06", "loops"), press = at("b06", "loops|+0.35");
  const hx = -400 + (620 + 400) * inOut(clamp01((f - hk + 6) / 16)), lx = 1500 - (1500 - 620) * inOut(clamp01((f - lp + 6) / 16));
  const pr = inOut(clamp01((f - press) / 7));
  const bulb = usePopAt()(wi, 10, 150);
  return (
    <AbsoluteFill>
      <Sky stops={[[0, G.night0], [0.45, G.night1], [0.8, G.indigo], [1, G.plum]]}/>
      <Svg>
        <Stars n={30} maxY={600} o={0.5}/>
        <Glow x={560} y={780} r={720} color={G.amber} o={0.22}/>
        <rect x={0} y={1450} width={W} height={H - 1450} fill="#0A1426"/>
        <path d="M0 1450 H1080" stroke={G.mint} strokeWidth={3} opacity={0.25}/>
        <Motes n={14} seed={21} color={G.amber} rise={8} size={0.7} o={0.6}/>
        <g transform={`translate(${GEOX + 40} 1450) scale(1.3)`}>
          <Person f={f} armL={f > wi ? 150 : 10} armR={-8} brow={f > wi ? 1 : 0} mouth={f > wi ? "smile" : "flat"} look={0.5} blink={blinkAt(f, 80, 5)}/>
        </g>
        {bulb > 0 && (
          <g transform={`translate(${GEOX + 120} 850) scale(${bulb}) rotate(${bob(f, 4, 1.6)})`}>
            <Glow x={0} y={0} r={160} color={G.amber} o={0.6}/>
            <circle r={44} fill={G.gold}/><circle r={30} cx={-8} cy={-8} fill={G.cream} opacity={0.7}/>
            <rect x={-18} y={38} width={36} height={26} rx={6} fill="#8FA3B8"/>
          </g>
        )}
        {f > hk - 8 && <Strip x={hx} y={720 + pr * 62} kind="hooks"/>}
        {f > lp - 8 && <Strip x={lx} y={930 - pr * 66} kind="loops"/>}
        {pr > 0 && <Glow x={620} y={826} r={420} color={G.cream} o={0.5 * (1 - sm(press + 4, press + 20, f))}/>}
      </Svg>
      <Pill x={620} y={610} text="HOOKS" f0={hk} f1={press} color={G.mint} size={40}/>
      <Pill x={620} y={1040} text="LOOPS" f0={lp} f1={press} color={G.coral} size={40}/>
    </AbsoluteFill>
  );
};

// ---------- the name
const Name: React.FC = () => {
  const f = useCurrentFrame();
  const a = at("b07"), b = at("b07", "right"), v = at("b07", "Velcro"), vv = at("b07", "velvet"), hk = at("b07", "hook");
  const prog = clamp01((f - a) / (b - a));
  const ringO = 1 - sm(v - 8, v, f);
  const pop = usePopAt();
  const Card: React.FC<{y: number; f0: number; head: string; rest: string; meaning: string; color: string}> = ({y, f0, head, rest, meaning, color}) => {
    const p = pop(f0); if (p <= 0) return null;
    return (
      <div style={{position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p), display: "flex", alignItems: "baseline", gap: 26,
        padding: "22px 44px", borderRadius: 30, background: "rgba(8,17,32,0.8)", border: `4px solid ${color}`, boxShadow: `0 0 40px ${color}66`, whiteSpace: "nowrap"}}>
        <span style={{fontFamily: HEAD, fontSize: 76, color: G.cream, letterSpacing: 2}}><span style={{color}}>{head}</span>{rest}</span>
        <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: G.cream, opacity: 0.85}}>= {meaning}</span>
      </div>
    );
  };
  const vp = pop(v, 10, 130);
  return (
    <AbsoluteFill>
      <Sky stops={[[0, G.night0], [0.55, G.night1], [1, G.indigo]]}/>
      <Svg>
        <Stars n={50} maxY={H} seed={7} o={0.6}/>
        <Glow x={540} y={800} r={700} color={G.mint} o={0.16}/>
        <Motes n={16} seed={31} color={G.mint} rise={10} size={0.7} o={0.5}/>
        <g opacity={ringO} transform={`translate(540 800) scale(${1 - 0.2 * sm(v - 8, v, f)})`}>
          {Array.from({length: 10}, (_, k) => {
            const a0 = -90 + k * 36 + 3, a1 = a0 + 30, R = 250, on = prog * 10 > k + 0.5;
            const p = (d: number) => [Math.cos((d * Math.PI) / 180) * R, Math.sin((d * Math.PI) / 180) * R];
            const [x0, y0] = p(a0), [x1, y1] = p(a1);
            return <path key={k} d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} stroke={on ? G.mint : "rgba(255,244,220,0.15)"} strokeWidth={40} strokeLinecap="round" fill="none" style={{filter: on ? `drop-shadow(0 0 12px ${G.mint})` : undefined}}/>;
          })}
        </g>
      </Svg>
      {ringO > 0 && (
        <div style={{position: "absolute", left: 540, top: 800, transform: "translate(-50%, -50%)", textAlign: "center", opacity: ringO * clamp01((f - a) / 8), color: G.cream, fontFamily: HEAD}}>
          <div style={{fontSize: 40, letterSpacing: 6, opacity: 0.8}}>ABOUT</div>
          <div style={{fontSize: 190, lineHeight: 1, textShadow: `0 0 40px ${G.mint}88`}}>{Math.max(1, Math.round(prog * 10))}</div>
          <div style={{fontSize: 52, letterSpacing: 6}}>YEARS</div>
        </div>
      )}
      {vp > 0 && (
        <div style={{position: "absolute", left: 540, top: 720, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * vp})`, opacity: Math.min(1, vp), fontFamily: HEAD, fontSize: 200, letterSpacing: 6, whiteSpace: "nowrap", textShadow: "0 8px 0 rgba(0,0,0,0.3)"}}>
          <span style={{color: G.amber, textShadow: `0 0 50px ${G.amber}88`}}>VEL</span><span style={{color: G.mint, textShadow: `0 0 50px ${G.mint}88`}}>CRO</span>
        </div>
      )}
      <Pill x={540} y={900} text="FROM FRENCH" f0={at("b07", "French")} color={G.cream} size={32}/>
      <Card y={1080} f0={vv} head="VEL" rest="OURS" meaning="velvet" color={G.amber}/>
      <Card y={1260} f0={hk} head="CRO" rest="CHET" meaning="hook" color={G.mint}/>
    </AbsoluteFill>
  );
};

// ---------- today
const Shoe: React.FC = () => (
  <g>
    <path d="M -150 20 C -150 -40 -120 -80 -60 -86 C -20 -90 10 -60 40 -40 C 90 -10 150 -10 160 20 Z" fill={G.coral}/>
    <path d="M -140 -30 C -110 -70 -70 -78 -40 -76" stroke={G.rose} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7}/>
    <rect x={-160} y={18} width={326} height={34} rx={16} fill={G.cream}/>
    {[-70, -10].map((x) => <g key={x}><rect x={x} y={-84 + (x + 70) * 0.35} width={52} height={92} rx={12} fill={G.mint} transform={`rotate(-14 ${x} -40)`}/></g>)}
  </g>
);
const Bag: React.FC = () => (
  <g>
    <path d="M -50 -140 Q 0 -190 50 -140" stroke="#B07A24" strokeWidth={16} fill="none"/>
    <rect x={-110} y={-140} width={220} height={250} rx={60} fill={G.amber}/>
    <rect x={-90} y={-120} width={40} height={210} rx={20} fill={G.gold} opacity={0.6}/>
    <path d="M -110 -60 Q 0 -10 110 -60 L 110 -110 Q 110 -140 60 -140 L -60 -140 Q -110 -140 -110 -110 Z" fill="#E09A2E"/>
    <rect x={-26} y={-52} width={52} height={70} rx={12} fill={G.mint}/>
    <rect x={-70} y={30} width={140} height={60} rx={20} fill="#E09A2E"/>
  </g>
);
const Helmet: React.FC = () => (
  <g>
    <Glow x={0} y={0} r={240} color={G.sky} o={0.35}/>
    <circle r={120} fill={G.snow}/>
    <path d="M -96 -10 Q 0 -110 96 -10 Q 96 60 0 70 Q -96 60 -96 -10 Z" fill="#20345E"/>
    <path d="M -60 -40 Q -20 -80 30 -76" stroke={G.sky} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.8}/>
    <rect x={60} y={40} width={60} height={34} rx={8} fill={G.mint} transform="rotate(-25 90 57)"/>
    <rect x={-80} y={100} width={160} height={40} rx={18} fill="#C9D6EA"/>
  </g>
);
const Today: React.FC = () => {
  const f = useCurrentFrame(); const pop = usePopAt();
  const sh = at("b08", "shoes"), bg = at("b08", "bags"), as = at("b08", "astronauts"), th = at("b08", "All thanks");
  const fade = 1 - 0.65 * sm(th, th + 12, f);
  const dog = pop(th + 4, 11, 120);
  const item = (f0: number, x: number, y: number, s: number, node: React.ReactNode, k: number) => {
    const p = pop(f0); if (p <= 0) return null;
    return <g transform={`translate(${x} ${y + bob(f, 12, 3, k) - 40 * sm(th, th + 14, f)}) rotate(${bob(f, 5, 4, k)}) scale(${p * s})`} opacity={fade}>{node}</g>;
  };
  return (
    <AbsoluteFill>
      <Sky stops={[[0, G.night0], [0.6, "#0F2244"], [1, "#183463"]]}/>
      <Svg>
        <Stars n={110} maxY={H} seed={13}/>
        <Glow x={540} y={2560} r={1500} color={G.sky} o={0.55}/>
        <circle cx={540} cy={2560} r={1070} fill="#2E6CC9"/>
        <defs><clipPath id="vgEarth"><circle cx={540} cy={2560} r={1070}/></clipPath></defs>
        <path clipPath="url(#vgEarth)" d="M 60 1720 Q 300 1560 520 1600 Q 700 1640 820 1540 Q 900 1500 1000 1580 Q 1060 1700 1000 1900 Q 600 1820 300 1960 Q 100 1900 60 1720 Z" fill="#3FAE7A" opacity={0.85}/>
        <circle cx={540} cy={2560} r={1070} fill="none" stroke={G.sky} strokeWidth={10} opacity={0.6}/>
        <Motes n={12} seed={41} color={G.sky} rise={6} size={0.6} o={0.5}/>
        {item(sh, 270, 820, 1.05, <Shoe/>, 1)}
        {item(bg, 810, 800, 0.95, <Bag/>, 2)}
        {item(as, 540, 1060, 0.9, <Helmet/>, 3)}
        {dog > 0 && (
          <g transform={`translate(560 ${1498 + (1 - Math.min(1, dog)) * 300}) scale(${-1.25} 1.25)`}>
            <Pup f={f} wag={1} look={0.6} blink={f > th + 40 && f < th + 46 ? 1 : 0} happy earUp={0.3}/>
          </g>
        )}
      </Svg>
      <Pill x={270} y={980} text="SHOES" f0={sh + 2} f1={th + 6} color={G.coral} size={34}/>
      <Pill x={810} y={1000} text="BAGS" f0={bg + 2} f1={th + 6} color={G.amber} size={34}/>
      <Pill x={540} y={1240} text="SPACE GEAR" f0={as + 2} f1={th + 6} color={G.sky} size={34}/>
      <Big x={540} y={470} text="ONE VERY STICKY DOG" f0={at("b08", "sticky")} color={G.cream} size={72}/>
    </AbsoluteFill>
  );
};

// ---------- the Short
const Swap: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const f = useCurrentFrame();
  if (f < a - 1 || f > b + 8) return null;
  const inn = a <= 0 ? 1 : sm(a, a + 9, f), out = 1 - sm(b, b + 8, f);   // the hook is on screen from frame 0
  return <AbsoluteFill style={{opacity: Math.min(inn, out), transform: `scale(${1.06 - 0.06 * inn})`}}>{children}</AbsoluteFill>;
};

export const VelcroGlowShort: React.FC = () => {
  useGKFonts();
  const f = useCurrentFrame();
  const stages = [
    {f0: at("b03") + 2, f1: at("b03", "microscope|+0.6"), k: K0, p: P0, pre: {f0: 0, s: 1.12}},
    {f0: at("b04"), f1: at("b04", "hooks|+0.4"), k: U2 / U1, p: P1},
    {f0: at("b05"), f1: at("b05", "loop|+0.1"), k: U3 / U2, p: P1},
  ];
  const lensO = sm(at("b03", "microscope|-0.2"), at("b03", "microscope|+0.5"), f) * (1 - sm(at("b05") + 6, at("b05", "loop"), f));
  const insets = at("b05", "Fur");
  const sfx: [number, string, number][] = [
    [stages[0].f0 - 4, "sfx_whoosh_deep_kinoton.wav", 0.5], [stages[1].f0 - 4, "sfx_whoosh_deep_kinoton.wav", 0.4], [stages[2].f0 - 4, "sfx_whoosh_deep_kinoton.wav", 0.4],
    [at("b01", "burrs"), "sfx_pop_conarb13.wav", 0.35], [at("b02", "engineer"), "sfx_pop_conarb13.wav", 0.3], [at("b02", "why"), "sfx_pop_conarb13.wav", 0.3],
    [insets, "sfx_pop_conarb13.wav", 0.3], [at("b05", "hair"), "sfx_pop_conarb13.wav", 0.3], [at("b05", "threads"), "sfx_pop_conarb13.wav", 0.3],
    [S4 - 3, "sfx_whoosh_cartoony_branrainey.wav", 0.35], [at("b06", "what if"), "sfx_pop_conarb13.wav", 0.35],
    [at("b06", "hooks") - 6, "sfx_paper_slide_kingofgamers.wav", 0.3], [at("b06", "loops") - 6, "sfx_paper_slide_kingofgamers.wav", 0.3], [at("b06", "loops|+0.35"), "sfx_thump_stamp_mpuffenbarger.wav", 0.4],
    [S5 - 3, "sfx_whoosh_cartoony_branrainey.wav", 0.35], [at("b07", "Velcro"), "sfx_coin_ding_greenvwbeetle.wav", 0.35],
    [at("b07", "velvet"), "sfx_pop_conarb13.wav", 0.3], [at("b07", "hook"), "sfx_pop_conarb13.wav", 0.3],
    [S6 - 3, "sfx_whoosh_cartoony_branrainey.wav", 0.35], [at("b08", "shoes"), "sfx_pop_conarb13.wav", 0.3], [at("b08", "bags"), "sfx_pop_conarb13.wav", 0.3],
    [at("b08", "astronauts"), "sfx_pop_conarb13.wav", 0.3], [at("b08", "All thanks") + 4, "sfx_whoosh_cartoony_branrainey.wav", 0.3],
  ];
  return (
    <AbsoluteFill style={{background: G.night0}}>
      <Swap a={0} b={S4}>
        <Dive stages={stages} levels={[<Alps key="0"/>, <Fur key="1"/>, <Micro key="2"/>, <Catch key="3"/>]}/>
        <Lens o={lensO}/>
        {f >= insets && <AbsoluteFill style={{background: "#040A16", opacity: 0.45 * sm(insets - 4, insets + 6, f)}}/>}
        <Inset x={200} y={1390} f0={insets} kind="fur" label="FUR"/>
        <Inset x={540} y={1390} f0={at("b05", "hair")} kind="hair" label="HAIR"/>
        <Inset x={880} y={1390} f0={at("b05", "threads")} kind="thread" label="THREADS"/>
        <Pill x={830} y={1010} text="BURRS" f0={at("b01", "burrs")} f1={at("b02")} color={G.gold} size={42}/>
        <Pill x={330} y={690} text="GEORGE DE MESTRAL" f0={at("b02", "engineer")} f1={at("b03")} color={G.mint} size={38}/>
        <Pill x={330} y={760} text="ENGINEER" f0={at("b02", "engineer") + 6} f1={at("b03")} color={G.amber} size={28}/>
        <Big x={760} y={830} text="?" f0={at("b02", "why")} f1={at("b03")} color={G.gold} size={190}/>
        <Pill x={554} y={360} text="MICROSCOPE" f0={at("b03", "microscope")} f1={at("b04") + 4} color={G.mint} size={36}/>
        <Pill x={554} y={360} text="TINY HOOKS" f0={at("b04", "hooks")} f1={at("b05") + 4} color={G.mint} size={40}/>
        <Pill x={220} y={600} text="HOOK" f0={at("b05", "hook")} f1={insets} color={G.mint} size={40}/>
        <Pill x={300} y={1180} text="LOOP" f0={at("b05", "loop")} f1={insets} color={G.coral} size={40}/>
      </Swap>
      <Swap a={S4} b={S5}><Idea/></Swap>
      <Swap a={S5} b={S6}><Name/></Swap>
      <Swap a={S6} b={VELCRO_FRAMES + 20}><Today/></Swap>
      <Vignette o={0.5}/>
      <Grain o={0.08}/>
      <GlowTop product={script.product} total={VELCRO_FRAMES}/>
      {VOICED && <Audio src={staticFile("gadget/velcroglow/vo.wav")}/>}
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(fr) => 0.09 * Math.min(1, fr / 15) * (1 - sm(VELCRO_FRAMES - 40, VELCRO_FRAMES - 2, fr))}/>
      {sfx.map(([f0, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f0)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
