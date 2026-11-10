// Indica Atlas — the empire map on parchment: inked coast, drawn rivers,
// stippled terrain, an empire spreading from its capital, a year counter and a scale bar.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { merge } from "topojson-client";
import countries50 from "world-atlas/countries-50m.json";
import { brands, W, H } from "../brand/tokens";
import { Paper, DrawPath, Stipple } from "../lib/draw";
import { fitMercator, pathOf, ringPath } from "../lib/geo";

const b = brands.indica;

type LonLat = [number, number];
export type EmpireProps = {
  title: string;
  empire: string;
  capital: { label: string; lonlat: LonLat };
  fromYear: number; // negative = BCE
  toYear: number;
  extent: LonLat[];
  rivers: { label: string; line: LonLat[] }[];
  note: string;
};

// APPROXIMATE outline, for motion design only — swap in a sourced shapefile.
export const empireDefaults: EmpireProps = {
  title: "The Mauryan Expansion",
  empire: "Maurya",
  capital: { label: "Pataliputra", lonlat: [85.14, 25.6] },
  fromYear: -321,
  toYear: -250,
  extent: [
    [61.5, 35], [66, 37], [71.5, 36.8], [75, 35.5], [78.5, 32.5], [80.5, 29.5], [84.5, 27.5], [88.5, 26.5],
    [90, 23.5], [88, 21.5], [86.5, 20], [84, 18], [81, 16], [78.5, 13.5], [76, 12.5], [74.5, 13.5],
    [73.2, 17], [72.8, 20.5], [70, 21], [68, 23.5], [66, 25.5], [62, 26], [61, 30],
  ],
  rivers: [
    { label: "Indus", line: [[77.5, 34.2], [74.5, 35.6], [72.2, 33.9], [71.5, 31], [70.3, 29], [68.9, 27.7], [68.3, 25.4], [67.6, 24]] },
    { label: "Ganga", line: [[78.2, 30.2], [78.9, 29.3], [80.3, 26.45], [81.85, 25.43], [83, 25.3], [85.1, 25.6], [87.3, 25.2], [88.2, 24.2], [88.6, 22.4]] },
    { label: "Godavari", line: [[73.8, 20], [75.3, 19.6], [77.3, 19.1], [79.9, 18.8], [81.3, 17.3], [82.2, 16.6]] },
  ],
  note: "Extent approximate · after Ashoka's inscriptions",
};

// Merge modern countries into one landmass so no anachronistic borders appear.
const SUB = ["356", "586", "050", "524", "064", "144", "004"];
const topo = countries50 as any;
const land = merge(
  topo,
  topo.objects.countries.geometries.filter((g: any) => SUB.includes(String(g.id))),
);
const MAP = { x: 660, y: 40, w: 1220, h: 1000 };
const proj = fitMercator(land as any, MAP.w, MAP.h, 20);
const landD = pathOf(proj)(land as any) ?? "";

const fmtYear = (y: number) => (y < 0 ? `${Math.round(-y)} BCE` : `${Math.round(y)} CE`);

export const IndicaEmpireMap: React.FC<EmpireProps> = (p) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const spread = interpolate(frame, [120, 260], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const year = interpolate(spread, [0, 1], [p.fromYear, p.toYear]);
  const [cx, cy] = proj(p.capital.lonlat)!;
  const extentD = ringPath(proj, p.extent);

  // scale bar: 500 km at ~22°N
  const kmPx = (() => {
    const a = proj([78, 22])!;
    const bb = proj([78 + 500 / (111.32 * Math.cos((22 * Math.PI) / 180)), 22])!;
    return bb[0] - a[0];
  })();

  return (
    <AbsoluteFill style={{ fontFamily: b.heading, color: b.ink }}>
      <Paper color={b.parchment} grain={0.3} vignette={0.32} seed={4} />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <clipPath id="spread">
            <circle cx={cx} cy={cy} r={spread * 1100} />
          </clipPath>
          <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="10" stroke={b.terracotta} strokeWidth="2.2" opacity="0.55" />
          </pattern>
          <clipPath id="land">
            <path d={landD} />
          </clipPath>
        </defs>
        <g transform={`translate(${MAP.x} ${MAP.y})`}>
          {/* terrain stipple only inside land */}
          <g clipPath="url(#land)" opacity={interpolate(frame, [60, 100], [0, 1], clamp)}>
            <Stipple x={0} y={0} w={MAP.w} h={MAP.h * 0.35} count={1400} color={b.ink} seed="hima" r={1.3} opacity={0.35} />
            <Stipple x={0} y={MAP.h * 0.5} w={MAP.w} h={MAP.h * 0.5} count={500} color={b.ink} seed="deccan" r={1.1} opacity={0.22} />
          </g>
          {/* empire: hatched + washed, revealed radially from the capital */}
          <g clipPath="url(#spread)">
            <g clipPath="url(#land)">
              <path d={extentD} fill={b.terracotta} opacity={0.22} />
              <path d={extentD} fill="url(#hatch)" />
            </g>
            <path d={extentD} fill="none" stroke={b.terracotta} strokeWidth={3} strokeDasharray="10 7" />
          </g>
          {/* coast in ink */}
          <DrawPath d={landD} start={0} duration={90} stroke={b.ink} width={2.2} />
          {/* rivers */}
          {p.rivers.map((r, i) => (
            <DrawPath key={r.label} d={ringPath(proj, r.line, false)} start={70 + i * 15} duration={45} stroke={b.river} width={3} />
          ))}
          {/* capital */}
          <g opacity={interpolate(frame, [110, 125], [0, 1], clamp)}>
            <circle cx={cx} cy={cy} r={12} fill="none" stroke={b.indigo} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={5} fill={b.indigo} />
          </g>
          {/* compass */}
          <g transform={`translate(${MAP.w - 120} ${MAP.h - 170})`} opacity={interpolate(frame, [20, 50], [0, 1], clamp)}>
            <path d="M0,-60 L12,0 L0,60 L-12,0 Z" fill={b.ink} opacity={0.8} />
            <path d="M-60,0 L0,-10 L60,0 L0,10 Z" fill={b.ink} opacity={0.35} />
            <text y={-72} textAnchor="middle" fontSize={30} fill={b.ink} fontFamily={b.label}>N</text>
          </g>
        </g>
      </svg>

      {/* labels */}
      {p.rivers.map((r, i) => {
        const mid = r.line[Math.floor(r.line.length / 2)];
        const [x, y] = proj(mid)!;
        return (
          <div key={r.label} style={{ position: "absolute", left: MAP.x + x + 10, top: MAP.y + y - 8, fontStyle: "italic", fontSize: 28, color: b.river, opacity: interpolate(frame, [100 + i * 15, 115 + i * 15], [0, 1], clamp) }}>
            {r.label}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: MAP.x + cx + 20, top: MAP.y + cy - 40, fontSize: 34, fontWeight: 700, color: b.indigo, opacity: interpolate(frame, [115, 130], [0, 1], clamp) }}>
        {p.capital.label}
      </div>

      {/* left column: title, year, note, scale */}
      <div style={{ position: "absolute", left: 90, top: 110, width: 560 }}>
        <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: b.terracotta }}>Indica Atlas</div>
        <div style={{ fontSize: 84, lineHeight: 1, fontWeight: 600, marginTop: 14 }}>{p.title}</div>
        <div style={{ width: 120, height: 3, background: b.ink, margin: "36px 0" }} />
        <div style={{ fontSize: 150, fontWeight: 700, color: b.indigo, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {fmtYear(year)}
        </div>
        <div style={{ fontSize: 30, marginTop: 20, fontStyle: "italic", opacity: 0.8 }}>{p.note}</div>
      </div>
      <div style={{ position: "absolute", left: 90, bottom: 90 }}>
        <div style={{ display: "flex" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: kmPx / 4, height: 10, background: i % 2 ? b.parchment : b.ink, border: `2px solid ${b.ink}` }} />
          ))}
        </div>
        <div style={{ fontSize: 24, marginTop: 8 }}>0 — 500 km</div>
      </div>
    </AbsoluteFill>
  );
};
