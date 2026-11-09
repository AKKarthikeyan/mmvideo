// Shared hand-drawn art for the UPSC Mains brand (logos + banner). Look B: warm cream paper, deep teal, brick red, thin coloured outlines.
import React from "react";
import {rng} from "../kit";

export const C = {
  cream: "#fbf3df", cream2: "#f3e2bd", paper: "#fffaf0", teal: "#1d5c63", tealD: "#123c43", tealL: "#5f9ea0", brick: "#b5402a", brickD: "#8d2e1e",
  ochre: "#d9a24a", sage: "#8fb084", green: "#6f9a63", sea: "#9cc9cf", seaL: "#cfe6e6", ink: "#3b2a1e", brown: "#a07850",
};

/** smooth closed blob; same seed with a smaller r gives a nested contour */
export const blobPath = (cx: number, cy: number, r: number, seed: number, n = 11, jit = 0.5) => {
  const R = rng(seed); const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const rr = r * (1 - jit / 2 + jit * R()); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.82]); }
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).join(",")}`;
  for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); d += ` Q${pts[i].join(",")} ${m.join(",")}`; }
  return d + "Z";
};

/** an atlas relief panel (invented land, not a real country): sea, shelf, hypsometric layers, graticule. Draw inside a clip. */
export const Relief: React.FC<{id: string; x: number; y: number; w: number; h: number; seed?: number; detail?: number; labels?: boolean}> = ({id, x, y, w, h, seed = 3, detail = 1}) => {
  const cx = x + w * 0.5, cy = y + h * 0.5, r = Math.min(w, h) * 0.46;
  const lands = [[-0.18, -0.05, 1.0], [0.28, 0.12, 0.78], [0.02, 0.3, 0.6]];
  const layers = [[1.14, "#bfe0df"], [1.0, "#a9c98f"], [0.82, "#8fb57a"], [0.64, "#b8bd7a"], [0.46, "#d6b46c"], [0.28, "#c39a6a"], [0.13, "#e8dcc6"]];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sea)`}/>
      {lands.map(([dx, dy, s], k) => (
        <g key={k}>
          {layers.map(([sc, col], j) => (
            <path key={j} d={blobPath(cx + dx * w, cy + dy * h, r * s * (sc as number), seed + k * 17, 11, 0.55)} fill={col as string}
              stroke={j === 0 ? "#79b3b6" : "rgba(80,60,30,.35)"} strokeWidth={j === 0 ? 2.5 : 1.6 * detail}/>
          ))}
        </g>
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((t) => (<React.Fragment key={t}>
        <line x1={x + w * t} y1={y} x2={x + w * t} y2={y + h} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.4 * detail} strokeDasharray="6 8"/>
        <line x1={x} y1={y + h * t} x2={x + w} y2={y + h * t} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.4 * detail} strokeDasharray="6 8"/>
      </React.Fragment>))}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-shade)`}/>
    </g>
  );
};
export const ReliefDefs: React.FC<{id: string}> = ({id}) => (
  <>
    <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bfe0e2"/><stop offset="1" stopColor="#7fb5bd"/></linearGradient>
    <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6dc" stopOpacity=".42"/><stop offset=".55" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#3a2412" stopOpacity=".22"/></linearGradient>
  </>
);

export const Cloud: React.FC<{x: number; y: number; s?: number; rain?: boolean; id: string}> = ({x, y, s = 1, rain = false, id}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}-cl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset=".6" stopColor="#e6eef0"/><stop offset="1" stopColor="#9fb7c2"/></linearGradient>
    </defs>
    {rain && [-70, -35, 0, 35, 70, 105].map((dx, i) => (
      <line key={i} x1={dx} y1={52 + (i % 2) * 8} x2={dx - 16} y2={110 + (i % 3) * 10} stroke="#5a97b0" strokeWidth={5} strokeLinecap="round" opacity={0.85}/>
    ))}
    <path d="M-120,40 C-150,40 -150,0 -112,-4 C-110,-48 -52,-62 -30,-30 C-8,-72 62,-64 70,-18 C112,-30 146,6 118,40 Z" fill={`url(#${id}-cl)`} stroke="#6f8fa0" strokeWidth={3} strokeLinejoin="round"/>
    <path d="M-100,30 C-60,22 20,26 100,30" stroke="#8aa5b4" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round"/>
  </g>
);

export const Pencil: React.FC<{x: number; y: number; rot: number; len?: number; th?: number}> = ({x, y, rot, len = 330, th = 40}) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <ellipse cx={len / 2} cy={th * 0.9} rx={len / 2} ry={th * 0.28} fill="#3a2412" opacity={0.22}/>
    <rect x={0} y={-th / 2} width={len} height={th} rx={5} fill={C.brick} stroke={C.brickD} strokeWidth={3}/>
    <rect x={0} y={-th / 2} width={len} height={th * 0.28} rx={5} fill="#d8654a" opacity={0.75}/>
    <rect x={len - 4} y={-th / 2} width={34} height={th} fill="#c9a76a" stroke="#8d7040" strokeWidth={3}/>
    <path d={`M${len + 30},${-th / 2} L${len + 82},0 L${len + 30},${th / 2}Z`} fill="#efd9ae" stroke="#a5834a" strokeWidth={3} strokeLinejoin="round"/>
    <path d={`M${len + 68},${-th * 0.14} L${len + 82},0 L${len + 68},${th * 0.14}Z`} fill={C.tealD}/>
    <rect x={-26} y={-th / 2} width={30} height={th} rx={7} fill="#e9b5a8" stroke="#a5604f" strokeWidth={3}/>
    <rect x={2} y={-th / 2} width={10} height={th} fill="#c9ccd0"/>
  </g>
);

/** fine paper grain at any size */
export const Grain: React.FC<{w: number; h: number; id: string; k?: number; vignette?: number}> = ({w, h, id, k = 0.5, vignette = 0.28}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
    <defs>
      <filter id={`${id}-g`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/></filter>
      <radialGradient id={`${id}-v`} cx="50%" cy="50%" r="72%"><stop offset=".6" stopColor="#3a2412" stopOpacity="0"/><stop offset="1" stopColor="#3a2412" stopOpacity={vignette}/></radialGradient>
    </defs>
    <rect width={w} height={h} filter={`url(#${id}-g)`} opacity={k} style={{mixBlendMode: "soft-light"}}/>
    <rect width={w} height={h} fill={`url(#${id}-v)`}/>
  </svg>
);
