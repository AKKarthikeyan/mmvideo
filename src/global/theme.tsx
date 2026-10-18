// Global channel look (Oct 2026): dark ink ground, green for money kept, coral for money spent, one amber accent.
// Deliberately distinct from the Moat & Margin tan Vox collage so the two channels never read as the same feed.
import React from "react";
import {staticFile} from "remotion";

export const G = {
  bg: "#0E1116", panel: "#161B22", line: "#2A313C", ink: "#E8ECF1", dim: "#8B95A3",
  rev: "#5B8DEF", keep: "#3FB97F", spend: "#E8664E", neutral: "#9AA5B4", amber: "#F2B544",
};
export const SANS = "Oswald, 'Arial Narrow', sans-serif";

export const GlobalFonts: React.FC = () => (
  <style>{`
    @font-face{font-family:Oswald;font-weight:400;src:url(${staticFile("fonts/Oswald-400.woff2")}) format("woff2");}
    @font-face{font-family:Oswald;font-weight:500;src:url(${staticFile("fonts/Oswald-500.woff2")}) format("woff2");}
    @font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}
  `}</style>
);

// The mark: three bands splitting off one bar, the Sankey in miniature.
export const Mark: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={0} y={0} width={22} height={120} rx={3} fill={G.rev}/>
    <path d="M 22 0 C 70 0, 70 -10, 118 -10 L 118 50 C 70 50, 70 60, 22 60 Z" fill={G.keep} opacity={0.9}/>
    <path d="M 22 60 C 70 60, 70 80, 118 80 L 118 108 C 70 108, 70 92, 22 92 Z" fill={G.spend} opacity={0.9}/>
    <path d="M 22 92 C 70 92, 70 122, 118 122 L 118 138 C 70 138, 70 120, 22 120 Z" fill={G.amber} opacity={0.9}/>
  </g>
);
