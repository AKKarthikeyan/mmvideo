// Indica Atlas — "drawn and animated" monument, print-illustration style:
// pen linework builds the temple bottom→top, then watercolour washes, hatching,
// stippled ground, palms, tiny people and birds. Fully procedural (no images).
// Form is a generic South-Indian vimana (stepped pyramidal tower), not a copy of any artwork.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { brands, W, H } from "../brand/tokens";
import { Paper, Rough, Stipple, DrawPath } from "../lib/draw";

const b = brands.indica;
const CX = W / 2;
const GROUND = 880;

export type MonumentProps = { caption: string; sub: string; tiers: number };
export const monumentDefaults: MonumentProps = {
  caption: "The Great Vimana",
  sub: "Granite, 11th century CE · Thanjavur",
  tiers: 13,
};

type Tier = { x: number; y: number; w: number; h: number };

const buildTiers = (n: number): Tier[] => {
  const tiers: Tier[] = [];
  let y = 640;
  for (let i = 0; i < n; i++) {
    const w = 430 * (1 - i * 0.058);
    const h = 34 * (1 - i * 0.025);
    y -= h;
    tiers.push({ x: CX - w / 2, y, w, h });
  }
  return tiers;
};

export const IndicaMonumentSketch: React.FC<MonumentProps> = ({ caption, sub, tiers: n }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const tiers = buildTiers(n);
  const top = tiers[tiers.length - 1];
  const ink = { stroke: b.ink, strokeWidth: 1.8, roughness: 0.9, bowing: 0.6 };
  const wash = (s: number) => interpolate(frame, [s, s + 30], [0, 1], clamp);

  // Draw schedule (frames)
  const T = { ground: 0, plinth: 10, walls: 25, tiers: 55, dome: 55 + n * 6, palms: 70, wash: 150, people: 175, text: 190 };

  return (
    <AbsoluteFill style={{ fontFamily: b.heading }}>
      <Paper color="#F3EAD6" grain={0.34} vignette={0.12} seed={9} />

      <svg width={W} height={H} style={{ position: "absolute", mixBlendMode: "multiply" }}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E9C9A0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#F3EAD6" stopOpacity="0" />
          </linearGradient>
          <filter id="bleed">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={3} />
            <feDisplacementMap in="SourceGraphic" scale="9" />
          </filter>
        </defs>

        {/* sky wash */}
        <rect x={0} y={0} width={W} height={620} fill="url(#sky)" opacity={wash(T.wash - 40)} />
        {/* ground */}
        <Rough shape={{ kind: "line", x1: 120, y1: GROUND, x2: W - 120, y2: GROUND + 4 }} start={T.ground} duration={20} options={{ ...ink, seed: 1 }} />
        <g opacity={wash(T.ground + 20)}>
          <Stipple x={140} y={GROUND + 10} w={W - 280} h={140} count={900} color={b.ink} seed="sand" r={1.1} opacity={0.35} />
        </g>

        {/* washes (painted under the ink, with bleed) */}
        <g filter="url(#bleed)" opacity={wash(T.wash)}>
          <rect x={CX - 300} y={790} width={600} height={90} fill={b.parchmentDark} />
          <rect x={CX - 230} y={640} width={460} height={150} fill="#D9B98A" />
          {tiers.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} fill={i % 2 ? "#CFA36B" : "#D8B37E"} />
          ))}
          <ellipse cx={CX} cy={top.y - 40} rx={top.w * 0.62} ry={52} fill={b.ochre} />
        </g>

        {/* plinth + walls */}
        <Rough shape={{ kind: "rect", x: CX - 300, y: 790, w: 600, h: 90 }} start={T.plinth} duration={16} options={{ ...ink, seed: 2 }} />
        <Rough shape={{ kind: "rect", x: CX - 230, y: 640, w: 460, h: 150 }} start={T.walls} duration={18} options={{ ...ink, seed: 3 }} />
        {/* pilasters + niches on the wall */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = CX - 210 + i * 52;
          return (
            <React.Fragment key={i}>
              <DrawPath d={`M${x},648 L${x},784`} start={T.walls + 14 + i * 2} duration={8} stroke={b.ink} width={1.4} />
              {i % 2 === 1 && (
                <Rough shape={{ kind: "rect", x: x - 14, y: 680, w: 28, h: 62 }} start={T.walls + 22 + i * 2} duration={8} options={{ ...ink, seed: 50 + i, strokeWidth: 1.3 }} />
              )}
            </React.Fragment>
          );
        })}

        {/* tiers, bottom → top, with right-side hatching for light from the left */}
        {tiers.map((t, i) => (
          <g key={i}>
            <Rough shape={{ kind: "rect", x: t.x, y: t.y, w: t.w, h: t.h }} start={T.tiers + i * 6} duration={10} options={{ ...ink, seed: 100 + i }} />
            {/* miniature shrine marks along each tier */}
            {Array.from({ length: Math.max(3, Math.floor(t.w / 46)) }, (_, k) => {
              const count = Math.max(3, Math.floor(t.w / 46));
              const x = t.x + ((k + 0.5) * t.w) / count;
              return (
                <DrawPath key={k} d={`M${x - 7},${t.y + t.h - 3} L${x - 7},${t.y + 9} Q${x},${t.y + 2} ${x + 7},${t.y + 9} L${x + 7},${t.y + t.h - 3}`} start={T.tiers + i * 6 + 6} duration={8} stroke={b.ink} width={1.1} />
              );
            })}
            <Rough
              shape={{ kind: "rect", x: t.x + t.w * 0.68, y: t.y + 2, w: t.w * 0.32 - 2, h: t.h - 4 }}
              start={T.wash + 10 + i * 2}
              duration={10}
              options={{ seed: 200 + i, stroke: "none", fill: b.terracotta, fillStyle: "hachure", hachureGap: 6, fillWeight: 1, hachureAngle: 60, roughness: 1.2 }}
            />
          </g>
        ))}

        {/* dome + finial */}
        <Rough shape={{ kind: "path", d: `M${CX - top.w * 0.62},${top.y} Q${CX},${top.y - 120} ${CX + top.w * 0.62},${top.y} Z` }} start={T.dome} duration={14} options={{ ...ink, seed: 300 }} />
        <DrawPath d={`M${CX},${top.y - 60} L${CX},${top.y - 120} M${CX - 10},${top.y - 92} Q${CX},${top.y - 132} ${CX + 10},${top.y - 92}`} start={T.dome + 12} duration={10} stroke={b.ink} width={2.2} />

        {/* palms either side */}
        {[
          { x: 420, h: 360, lean: -40, s: 0 },
          { x: 560, h: 280, lean: 25, s: 1 },
          { x: 1370, h: 320, lean: -20, s: 2 },
          { x: 1520, h: 390, lean: 45, s: 3 },
        ].map((p) => (
          <Palm key={p.s} {...p} start={T.palms + p.s * 10} washStart={T.wash + 5} />
        ))}

        {/* tiny people */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 650 + random(`px${i}`) * 620;
          const y = GROUND + 30 + random(`py${i}`) * 60;
          const c = [b.indigo, b.terracotta, "#F2F0EA", b.ochre][i % 4];
          return (
            <g key={i} opacity={wash(T.people + i * 3)} transform={`translate(${x} ${y}) scale(${0.85 + random(`ps${i}`) * 0.3})`}>
              <circle cx={0} cy={-34} r={4.5} fill={b.ink} />
              <path d="M-6,-28 L6,-28 L8,0 L-8,0 Z" fill={c} stroke={b.ink} strokeWidth={0.8} />
              <path d="M-4,0 L-4,8 M4,0 L4,8" stroke={b.ink} strokeWidth={1.4} />
            </g>
          );
        })}

        {/* birds drift */}
        {Array.from({ length: 5 }, (_, i) => {
          const bx = 1200 + i * 60 + frame * 0.6;
          const by = 200 + random(`by${i}`) * 90 + Math.sin(frame / 10 + i) * 4;
          const flap = 6 + Math.sin(frame / 4 + i * 2) * 4;
          return (
            <path key={i} d={`M${bx - 10},${by - flap} Q${bx - 4},${by - 2} ${bx},${by} Q${bx + 4},${by - 2} ${bx + 10},${by - flap}`} stroke={b.ink} strokeWidth={1.6} fill="none" opacity={wash(T.text)} />
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: 120, bottom: 70, color: b.ink, opacity: wash(T.text) }}>
        <div style={{ fontSize: 64, fontWeight: 600 }}>{caption}</div>
        <div style={{ fontSize: 30, fontStyle: "italic", opacity: 0.75 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

const Palm: React.FC<{ x: number; h: number; lean: number; s: number; start: number; washStart: number }> = ({ x, h, lean, s, start, washStart }) => {
  const frame = useCurrentFrame();
  const topX = x + lean;
  const topY = GROUND - h;
  const sway = Math.sin(frame / 25 + s) * 3;
  const trunk = `M${x},${GROUND} Q${x + lean * 0.2},${GROUND - h * 0.5} ${topX},${topY}`;
  const fronds = Array.from({ length: 7 }, (_, i) => {
    const a = -Math.PI + (i / 6) * Math.PI + (random(`f${s}${i}`) - 0.5) * 0.3;
    const len = 110 + random(`fl${s}${i}`) * 40;
    const ex = topX + Math.cos(a) * len + sway;
    const ey = topY + Math.sin(a) * len * 0.55 + 40;
    return `M${topX},${topY} Q${topX + Math.cos(a) * len * 0.5},${topY + Math.sin(a) * len * 0.5 - 30} ${ex},${ey}`;
  });
  const leaf = interpolate(frame, [washStart, washStart + 30], [0, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <DrawPath d={trunk} start={start} duration={20} stroke={brands.indica.ink} width={4} />
      {fronds.map((d, i) => (
        <React.Fragment key={i}>
          <path d={d} stroke="#5E7A3A" strokeWidth={16} fill="none" strokeLinecap="round" opacity={leaf} />
          <DrawPath d={d} start={start + 18 + i * 2} duration={10} stroke={brands.indica.ink} width={1.6} />
        </React.Fragment>
      ))}
    </g>
  );
};
