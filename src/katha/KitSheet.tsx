// The Katha kit sheet (22 Oct 2026): every flora, architecture, flame and diya piece in the Lamplight style, rim-lit
// against a dusk sky and labelled small (Devanagari first, English in small letter-spaced capitals), plus the four sky
// moods with the warm moon. Registered as the Still "KATHA-kit". page: "all" (the overview, default), "flora", "arch",
// "plants", "fire", "sky" (one group large), "one" with kind = a piece's name (that piece large and small, for close checking);
// t: the moment (frame) the sway and flicker are drawn at. One light per panel: every rim faces that panel's sun.
import React from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H, SA, CAPS, KathaDefs, Finish, SoftGlow} from "./look";
import {Sky, Mood, MOODS} from "./sky";
import {Rimmed, Item} from "./sil";
import {peepal, banyan, neem, palmyra, coconut, khejri, deodar, reeds, rice, paddy, lotusLeaf, lotusBud, lotusFlower} from "./flora";
import {temple, shrine, cuspedArch, pillar, niche, ghat, ledge} from "./arch";
import {Flame, Fire, Diya} from "./fire";

type V2 = [number, number];
const towards = (sun: V2, x: number, y: number): V2 => [sun[0] - x, sun[1] - y];
const Label: React.FC<{x: number; y: number; sa: string; en: string; s?: number; anchor?: "start" | "middle"}> = ({x, y, sa, en, s = 1, anchor = "middle"}) => (
  <g textAnchor={anchor}>
    <text x={x} y={y} fontFamily={SA} fontSize={17 * s} fill={K.gold} opacity={0.95}>{sa}</text>
    <text x={x} y={y + 16 * s} fontFamily={CAPS} fontSize={10 * s} letterSpacing={3 * s} fill={K.goldLt} opacity={0.72}>{en}</text>
  </g>
);
// a viewport: children are drawn in the panel's own 0..w x 0..h coordinates (vb: a crop of a full 1920 x 1080 frame)
const Panel: React.FC<{x: number; y: number; w: number; h: number; vb?: string; children: React.ReactNode}> = ({x, y, w, h, vb, children}) => (
  <svg x={x} y={y} width={w} height={h} viewBox={vb ?? `0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" overflow="hidden">{children}</svg>
);
const Ground: React.FC<{y: number; h: number; id: string; c0?: string; c1?: string}> = ({y, h, id, c0 = "#2A1630", c1 = "#0B0712"}) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c0}/><stop offset="1" stopColor={c1}/></linearGradient></defs>
    <rect x={-10} y={y} width={W + 20} height={h} fill={`url(#${id})`}/>
  </g>
);
// still water from x0 to x1 below the line y: the sky's warm band mirrored, a few slow glints
const Water: React.FC<{x0: number; x1: number; y: number; h: number; id: string; f: number; sunX?: number}> = ({x0, x1, y, h, id, f, sunX}) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C8693E"/><stop offset="0.12" stopColor="#6A2F4E"/><stop offset="0.5" stopColor="#140C24"/></linearGradient></defs>
    <rect x={x0} y={y} width={x1 - x0} height={h} fill={`url(#${id})`}/>
    {Array.from({length: 9}, (_, i) => {
      const yy = y + 4 + i * i * 0.9 + i * 2, w = (x1 - x0) * (0.08 + 0.05 * ((i * 7) % 5)), cx = (sunX ?? (x0 + x1) / 2) + Math.sin(f / 40 + i * 2.1) * 12 + (((i * 37) % 9) - 4) * (x1 - x0) * 0.04;
      return <rect key={i} x={cx - w / 2} y={yy} width={w} height={1.2} fill="#FFD9A0" opacity={0.32 - i * 0.03}/>;
    })}
  </g>
);
const Rule: React.FC<{y: number}> = ({y}) => <rect x={0} y={y - 1} width={W} height={2} fill="url(#k-fade-h)" opacity={0.5}/>;

// ---------- the trees ----------
const TREES: [string, string, (x: number, y: number, h: number, f: number) => Item[], number, number][] = [
  ["पीपल", "PEEPAL", (x, y, h, f) => peepal({x, y, h, seed: 3, t: f, wind: 0.15}), 150, 300],
  ["बरगद", "BANYAN", (x, y, h, f) => banyan({x, y, h, seed: 2, t: f, wind: 0.1}), 470, 150],
  ["नीम", "NEEM", (x, y, h, f) => neem({x, y, h, seed: 5, t: f, wind: 0.1}), 790, 270],
  ["ताड़", "PALMYRA", (x, y, h, f) => palmyra({x, y, h, seed: 4, t: f, wind: 0.2}), 1005, 360],
  ["नारियल", "COCONUT", (x, y, h, f) => coconut({x, y, h, seed: 8, t: f, wind: 0.2}), 1190, 330],
  ["खेजड़ी", "KHEJRI", (x, y, h, f) => khejri({x, y, h, seed: 6, t: f, wind: 0.1}), 1460, 240],
  ["देवदार", "DEODAR", (x, y, h, f) => deodar({x, y, h, seed: 7, t: f, wind: 0.1}), 1730, 340],
];
const TreeRow: React.FC<{f: number; gy: number; k?: number}> = ({f, gy, k = 1}) => {
  const sun: V2 = [890, gy - 30], X = (x: number) => (x - 960) * k + 960;
  return (
    <g>
      <Sky mood="dusk" sun={sun} sunR={28} f={f} rays={0.3} horizon={gy} id="kt" clouds={0.7}/>
      <Ground y={gy} h={1200} id="kgt"/>
      {TREES.map(([, en, fn, x, h]) => <Rimmed key={en} paths={fn(X(x), gy, h * k, f)} light={towards(sun, X(x), gy - h * k * 0.55)} w={2.4 * Math.sqrt(k)}/>)}
      {TREES.map(([sa, en, , x]) => <Label key={en} x={X(x)} y={gy + 40 * k} sa={sa} en={en} s={Math.sqrt(k)}/>)}
    </g>
  );
};

// the trees large, in two rows (page "flora")
const TreeBig: React.FC<{f: number; gy: number; row: number}> = ({f, gy, row}) => {
  const sun: V2 = row ? [1560, gy - 24] : [560, gy - 24];
  const R0: [number, number, number][] = [[0, 270, 420], [1, 830, 205], [2, 1330, 380], [3, 1700, 430]];
  const R1: [number, number, number][] = [[4, 260, 430], [5, 760, 320], [6, 1200, 440]];
  const list = row ? R1 : R0;
  return (
    <g>
      <Sky mood={row ? "dusk" : "gold"} sun={sun} sunR={26} f={f} rays={0.3} horizon={gy} id={`kb${row}`} clouds={0.6}/>
      <Ground y={gy} h={1200} id={`kgb${row}`}/>
      {list.map(([i, x, h]) => <Rimmed key={i} paths={TREES[i][2](x, gy, h, f)} light={towards(sun, x, gy - h * 0.55)} w={3}/>)}
      {row ? <g>
        <Rimmed paths={reeds({x: 1500, y: gy, h: 160, seed: 2, t: f, wind: 0.3})} light={towards(sun, 1500, gy - 60)} w={2}/>
        <Rimmed paths={paddy({x0: 1620, x1: 1880, y: gy, h: 90, seed: 4, t: f, wind: 0.2})} light={towards(sun, 1750, gy - 30)} w={1.8}/>
        <Label x={1500} y={gy + 40} sa="काश" en="KANS GRASS" s={1.2}/>
        <Label x={1750} y={gy + 40} sa="धान" en="RICE" s={1.2}/>
      </g> : null}
      {list.map(([i, x]) => <Label key={i} x={x} y={gy + 40} sa={TREES[i][0]} en={TREES[i][1]} s={1.2}/>)}
    </g>
  );
};

// ---------- the architecture ----------
const ArchRow: React.FC<{f: number; gy: number; k?: number}> = ({f, gy, k = 1}) => {
  const sun: V2 = [1015, gy - 36], X = (x: number) => (x - 960) * k + 960;
  const wy = gy + 6;   // the river's surface at the ghat
  const T = temple({x: X(150), y: gy, w: 52 * k, porch: 1, spires: 1, t: f, wind: 0.6});
  const Sh = shrine({x: X(420), y: gy, h: 150 * k, flag: true, t: f, wind: 0.6});
  const A = cuspedArch({x: X(625), y: gy, w: 165 * k, h: 195 * k, lobes: 7});
  const P = pillar({x: X(810), y: gy, h: 200 * k});
  const N = niche({x: X(990), y: gy - 54 * k, w: 62 * k, h: 92 * k, wall: [X(905), gy - 236 * k, X(1075), gy]});
  const G = ghat({x0: X(1140), y0: gy - 130 * k, x1: X(1420), y1: wy + 2, n: 15, seed: 3, bottom: wy + 3});
  const Lg = ledge({x0: X(1490), x1: X(1620), y: gy - 96 * k, h: 30 * k, seed: 2, wall: 66 * k});
  const Gf = ghat({x0: X(1690), y0: gy - 100 * k, x1: X(1890), y1: wy + 2, n: 12, seed: 5, view: "front"});
  const GfS = shrine({x: X(1790), y: gy - 100 * k, h: 92 * k, flag: true, t: f, wind: 0.6});
  const pieces: [Item[], number, string, string][] = [
    [T, X(205), "शिखर मन्दिर", "NAGARA TEMPLE"], [Sh, X(420), "देवकुलिका", "SHRINE"], [A, X(625), "तोरण", "CUSPED ARCH"],
    [P, X(810), "स्तम्भ", "PILLAR"], [N, X(990), "देवकोष्ठ", "NICHE"], [G, X(1290), "घाट", "GHAT STEPS"], [Lg, X(1555), "कपोत", "LEDGE"], [[...Gf, ...GfS], X(1790), "घाट", "FROM THE RIVER"],
  ];
  return (
    <g>
      <Sky mood="gold" sun={sun} sunR={24} f={f} rays={0.26} horizon={gy} id="ka" clouds={0.5} stars={0}/>
      <Ground y={gy} h={1200} id="kga"/>
      <Water x0={X(1300)} x1={W + 10} y={wy} h={400} id="kwa" f={f} sunX={X(1600)}/>
      {/* the niche's lit back and the shrine's lamp show through their openings */}
      <SoftGlow x={X(990)} y={gy - 90 * k} r={64 * k} c0="#FFE2A8" c1="#E07A3A" peak={0.9}/>
      <SoftGlow x={X(420)} y={gy - 26 * k} r={30 * k} c0="#FFE2A8" c1="#E07A3A" peak={0.9}/>
      <SoftGlow x={X(1790)} y={gy - 113 * k} r={14 * k} c0="#FFE2A8" c1="#E07A3A" peak={0.9}/>
      {pieces.map(([it, x, , en]) => <Rimmed key={en} paths={it} light={towards(sun, x, sun[1] + 70 * k)} w={2.2 * Math.sqrt(k)}/>)}
      <Diya x={X(1545)} y={gy - 96 * k} s={0.55 * k} f={f} seed={7} halo={0.7}/>
      {pieces.map(([, x, sa, en]) => <Label key={en} x={x} y={gy + 42 * k} sa={sa} en={en} s={Math.sqrt(k)}/>)}
    </g>
  );
};

// ---------- the plants at the water's edge ----------
const PlantRow: React.FC<{f: number; w: number; gy: number; k?: number}> = ({f, w, gy, k = 1}) => {
  const sun: V2 = [w * 0.62, gy - 18 * k], wx0 = w * 0.42;
  return (
    <g>
      <Sky mood="dusk" sun={sun} sunR={16 * k} f={f} rays={0.2} horizon={gy} id="kp" clouds={0.5} band={0.5}/>
      <Water x0={wx0 - 60} x1={w + 10} y={gy} h={600} id="kwp" f={f} sunX={sun[0]}/>
      <defs><linearGradient id="kgp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A1630"/><stop offset="1" stopColor="#0B0712"/></linearGradient></defs>
      <path d={`M -10 ${gy} L ${wx0 - 30} ${gy} C ${wx0 + 10} ${gy + 4} ${wx0 + 30} ${gy + 30} ${wx0 + 10} ${gy + 600} L -10 ${gy + 600} Z`} fill="url(#kgp)"/>
      <Rimmed paths={reeds({x: w * 0.1, y: gy, h: 120 * k, seed: 2, t: f, wind: 0.3})} light={towards(sun, w * 0.1, gy - 50 * k)} w={1.8}/>
      <Rimmed paths={paddy({x0: w * 0.2, x1: w * 0.36, y: gy, h: 64 * k, seed: 4, t: f, wind: 0.2})} light={towards(sun, w * 0.28, gy - 30 * k)} w={1.5}/>
      <Rimmed paths={[...lotusLeaf({x: w * 0.55, y: gy, r: 30 * k, seed: 1, t: f}), ...lotusBud({x: w * 0.62, y: gy, h: 86 * k, seed: 2, t: f}), ...lotusFlower({x: w * 0.7, y: gy, h: 66 * k, seed: 3, t: f}),
        ...lotusLeaf({x: w * 0.79, y: gy, r: 24 * k, seed: 4, t: f, tilt: 0.15}), ...lotusLeaf({x: w * 0.87, y: gy, r: 26 * k, seed: 5, raised: false, t: f})]} light={towards(sun, w * 0.7, gy - 40 * k)} w={1.8}/>
      <Label x={w * 0.1} y={gy + 36 * k} sa="काश" en="KANS GRASS"/>
      <Label x={w * 0.28} y={gy + 36 * k} sa="धान" en="RICE"/>
      <Label x={w * 0.7} y={gy + 36 * k} sa="कमल" en="LOTUS"/>
    </g>
  );
};

// ---------- the fire ----------
const FireRow: React.FC<{f: number; w: number; h: number; k?: number}> = ({f, w, h, k = 1}) => {
  const gy = h * 0.66;
  return (
    <g>
      <defs><linearGradient id="kfr-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B0716"/><stop offset="0.7" stopColor="#1A0F24"/><stop offset="1" stopColor="#120A16"/></linearGradient></defs>
      <rect x={0} y={0} width={w} height={h} fill="url(#kfr-bg)"/>
      <rect x={0} y={gy} width={w} height={h - gy} fill="#0E0812"/>
      <Flame x={w * 0.1} y={gy - 6 * k} h={64 * k} f={f} seed={1} calm={1}/>
      <Flame x={w * 0.28} y={gy - 6 * k} h={64 * k} f={f} seed={2} calm={0.15} wind={0.2}/>
      <Diya x={w * 0.47} y={gy} s={1.25 * k} f={f} seed={3}/>
      <Diya x={w * 0.68} y={gy} s={1.0 * k} f={f} seed={4} lit={0} flame={false} flip/>
      <Fire x={w * 0.88} y={gy - 4} w={48 * k} h={92 * k} f={f} seed={5}/>
      <Label x={w * 0.1} y={gy + 30 * k} sa="शान्त ज्योति" en="STILL" s={Math.sqrt(k)}/>
      <Label x={w * 0.28} y={gy + 30 * k} sa="चञ्चल ज्योति" en="RESTLESS" s={Math.sqrt(k)}/>
      <Label x={w * 0.5} y={gy + 30 * k} sa="दीप" en="DIYA" s={Math.sqrt(k)}/>
      <Label x={w * 0.68} y={gy + 30 * k} sa="दीप" en="UNLIT" s={Math.sqrt(k)}/>
      <Label x={w * 0.88} y={gy + 30 * k} sa="अग्नि" en="FIRE" s={Math.sqrt(k)}/>
    </g>
  );
};

// ---------- the skies ----------
const SA_M: Record<Mood, string> = {dusk: "सन्ध्या", dawn: "उषा", night: "रात्रि", gold: "स्वर्ण"};
const SkyCard: React.FC<{mood: Mood; f: number}> = ({mood, f}) => {
  const hz = 820, sun: V2 = mood === "night" ? [1240, 520] : mood === "dawn" ? [700, 800] : [1000, 790];
  return (
    <g>
      <Sky mood={mood} sun={sun} sunR={mood === "night" ? 70 : 80} f={f} rays={mood === "night" ? 0 : 0.4} horizon={hz} id={`ks${mood}`}/>
      <rect x={-10} y={hz} width={W + 20} height={H} fill="#0E0812"/>
      <Rimmed paths={temple({x: 560, y: hz, w: 110, porch: 1, spires: 1, t: f})} light={towards(sun, 600, 600)} w={4}/>
      <Rimmed paths={palmyra({x: 1500, y: hz, h: 420, seed: 4, t: f})} light={towards(sun, 1500, 600)} w={4}/>
      <Rimmed paths={coconut({x: 1680, y: hz, h: 360, seed: 9, t: f})} light={towards(sun, 1680, 600)} w={4}/>
    </g>
  );
};
// the four moods in a grid of cols columns; each card shows the band round the horizon of a full frame
const SkyGrid: React.FC<{f: number; x: number; y: number; w: number; cols: number; ch: number; label?: boolean}> = ({f, x, y, w, cols, ch, label = true}) => {
  const gap = 10, cw = (w - gap * (cols - 1)) / cols, vbh = (W * ch) / cw;
  return (
    <g>
      {MOODS.map((m, i) => {
        const cx = x + (i % cols) * (cw + gap), cy = y + Math.floor(i / cols) * (ch + gap);
        return (
          <g key={m}>
            <Panel x={cx} y={cy} w={cw} h={ch} vb={`0 ${Math.max(0, 820 - vbh * 0.72)} ${W} ${vbh}`}><SkyCard mood={m} f={f}/></Panel>
            <rect x={cx} y={cy} width={cw} height={ch} fill="none" stroke={K.goldDk} strokeWidth={1} opacity={0.55}/>
            {label ? <Label x={cx + 14} y={cy + ch - 26 * Math.max(1, ch / 200)} sa={SA_M[m]} en={m.toUpperCase()} anchor="start" s={Math.max(1, ch / 200)}/> : null}
          </g>
        );
      })}
    </g>
  );
};

// One piece large (and small beside it) for close checking: page "one", kind = a flora or architecture name.
const ONE: Record<string, (x: number, y: number, h: number, f: number) => Item[]> = {
  peepal: (x, y, h, f) => peepal({x, y, h, seed: 3, t: f, wind: 0.15}),
  banyan: (x, y, h, f) => banyan({x, y, h: h * 0.62, seed: 2, t: f, wind: 0.1}),
  neem: (x, y, h, f) => neem({x, y, h, seed: 5, t: f, wind: 0.1}),
  palmyra: (x, y, h, f) => palmyra({x, y, h, seed: 4, t: f, wind: 0.2}),
  coconut: (x, y, h, f) => coconut({x, y, h, seed: 8, t: f, wind: 0.2}),
  khejri: (x, y, h, f) => khejri({x, y, h: h * 0.75, seed: 6, t: f, wind: 0.1}),
  deodar: (x, y, h, f) => deodar({x, y, h, seed: 7, t: f, wind: 0.1}),
  reeds: (x, y, h, f) => reeds({x, y, h: h * 0.5, seed: 2, t: f, wind: 0.3}),
  rice: (x, y, h, f) => [...rice({x, y, h: h * 0.4, seed: 4, t: f, wind: 0.2}), ...paddy({x0: x + h * 0.3, x1: x + h * 0.9, y, h: h * 0.25, seed: 5, t: f})],
  lotus: (x, y, h, f) => [...lotusLeaf({x: x - h * 0.2, y, r: h * 0.16, seed: 1, t: f}), ...lotusBud({x: x + h * 0.05, y, h: h * 0.45, seed: 2, t: f}), ...lotusFlower({x: x - h * 0.45, y, h: h * 0.38, seed: 3, t: f}), ...lotusLeaf({x: x + h * 0.3, y, r: h * 0.13, seed: 4, raised: false, t: f})],
  temple: (x, y, h, f) => temple({x: x - h * 0.1, y, w: h / 3.9, porch: 1, spires: 1, t: f, wind: 0.6}),
  temple0: (x, y, h, f) => temple({x, y, w: h / 3.9, porch: 0, spires: 2, t: f, wind: -0.6}),
  shrine: (x, y, h, f) => shrine({x, y, h: h * 0.8, flag: true, t: f, wind: 0.5}),
  arch: (x, y, h) => cuspedArch({x, y, w: h * 0.85, h}),
  pillar: (x, y, h) => pillar({x, y, h}),
  niche: (x, y, h) => niche({x, y: y - h * 0.3, w: h * 0.3, h: h * 0.42, wall: [x - h * 0.5, y - h * 1.0, x + h * 0.5, y]}),
  ghat: (x, y, h) => [...ghat({x0: x - h * 0.8, y0: y - h * 0.45, x1: x + h * 0.2, y1: y, n: 18, seed: 3}), ...ghat({x0: x + h * 0.3, y0: y - h * 0.5, x1: x + h * 1.1, y1: y, n: 16, seed: 4, view: "front"})],
  ledge: (x, y, h) => ledge({x0: x - h * 0.6, x1: x + h * 0.6, y: y - h * 0.5, h: h * 0.14, seed: 2, wall: h * 0.36}),
};
const OnePage: React.FC<{kind: string; f: number; clip?: boolean}> = ({kind, f, clip = false}) => {
  const gy = 900, sun: V2 = [700, 860], fn = ONE[kind] || ONE.peepal, big = fn(820, gy, 760, f), small = fn(1640, gy, 200, f);
  const glowAt = kind === "niche" ? [820, gy - 330] : kind === "shrine" ? [820, gy - 120] : null;
  return (
    <g>
      <Sky mood="dusk" sun={sun} sunR={36} f={f} rays={0.3} horizon={gy} id="k1" clouds={0.7}/>
      <Ground y={gy} h={200} id="kg1"/>
      {glowAt ? <SoftGlow x={glowAt[0]} y={glowAt[1]} r={260} c0="#FFE2A8" c1="#E07A3A" peak={0.9}/> : null}
      <Rimmed paths={big} light={towards(sun, 820, gy - 380)} w={3} clip={clip}/>
      <Rimmed paths={small} light={towards(sun, 1640, gy - 100)} w={2} clip={clip}/>
      <Label x={960} y={1010} sa={kind} en={kind.toUpperCase()} s={1.4}/>
    </g>
  );
};
export const KitSheet: React.FC<{page?: string; t?: number; kind?: string; clip?: boolean}> = ({page = "all", t = 40, kind = "peepal", clip}) => {
  const f = useCurrentFrame() + t;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
      <KathaDefs/>
      <rect x={0} y={0} width={W} height={H} fill={K.night}/>
      {page === "one" ? <OnePage kind={kind} f={f} clip={clip}/> : null}
      {/* flora / arch: the overview's row drawn in a full frame and shown in two halves, each enlarged (the pieces at the
          same size relative to each other as in the overview); plants: the water's edge, enlarged */}
      {page === "flora" ? <g>
        <Panel x={0} y={0} w={W} h={540}><TreeBig f={f} gy={455} row={0}/></Panel>
        <Panel x={0} y={540} w={W} h={540}><TreeBig f={f} gy={455} row={1}/></Panel>
      </g> : null}
      {page === "plants" ? <Panel x={0} y={0} w={W} h={H} vb="0 0 560 315"><PlantRow f={f} w={560} gy={210}/></Panel> : null}
      {page === "arch" ? <g>
        <Panel x={0} y={0} w={W} h={540} vb="0 560 1080 304"><ArchRow f={f} gy={800}/></Panel>
        <Panel x={0} y={540} w={W} h={540} vb="840 560 1080 304"><ArchRow f={f} gy={800}/></Panel>
      </g> : null}
      {page === "fire" ? <Panel x={0} y={0} w={W} h={H}><FireRow f={f} w={W} h={H} k={2.6}/></Panel> : null}
      {page === "sky" ? <SkyGrid f={f} x={60} y={120} w={W - 120} cols={2} ch={410}/> : null}
      {page === "all" ? <g>
        <Panel x={0} y={0} w={W} h={470}><TreeRow f={f} gy={378}/></Panel>
        <Rule y={471}/>
        <Panel x={0} y={472} w={W} h={318}><ArchRow f={f} gy={250}/></Panel>
        <Rule y={791}/>
        <Panel x={0} y={792} w={560} h={288}><PlantRow f={f} w={560} gy={190}/></Panel>
        <Panel x={562} y={792} w={640} h={288}><FireRow f={f} w={640} h={288} k={0.8}/></Panel>
        <rect x={1204} y={792} width={W - 1204} height={288} fill="#0B0716"/>
        <SkyGrid f={f} x={1214} y={802} w={W - 1224} cols={2} ch={133}/>
      </g> : null}
      <Finish f={f} grain={0.05} vig={0.45}/>
    </svg>
  );
};
