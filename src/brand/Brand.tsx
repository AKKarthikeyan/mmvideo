// Indica Atlas brand (renamed from Monsoon Atlas 25 Oct 2026; mark unchanged from 20 Oct): logo mark, wordmark lock-up
// and YouTube banner, all drawn in code.
// Globe coastlines: Natural Earth 10m (India point of view), simplified. Banner imagery: NASA Blue Marble.
import React, {useEffect, useState} from "react";
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from "remotion";
import {geoArea, geoGraticule10, geoOrthographic, geoPath} from "d3-geo";

export const B = {deep: "#06202C", teal: "#0C3D52", sea: "#11597A", land: "#2E9E78", india: "#3DBE8C", amber: "#FFB020", cyan: "#3DD9FF", cream: "#F7F1E3"};
const FONT = "Oswald, Impact, 'Arial Narrow', sans-serif";
const Fonts = () => <style>{`@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}`}</style>;

function useWorld() {
  const [w, setW] = useState<any>(null);
  const [h] = useState(() => delayRender("world"));
  useEffect(() => {
    fetch(staticFile("brand/world.json")).then((r) => r.json()).then((fc) => {
      // d3 wants clockwise outer rings; flip any ring that came out "inside-out"
      for (const f of fc.features) for (const poly of f.geometry.coordinates)
        if (geoArea({type: "Polygon", coordinates: poly} as any) > 2 * Math.PI) poly[0].reverse();
      setW(fc); continueRender(h);
    });
  }, [h]);
  return w;
}

// ---------- the mark: India-facing globe + monsoon wind arrow + rain ----------
export const Mark: React.FC<{size: number; ring?: boolean}> = ({size, ring = true}) => {
  const world = useWorld();
  const S = size, R = S * 0.39, cx = S * 0.5, cy = S * 0.5, k = S / 800;
  if (!world) return <div style={{width: S, height: S}}/>;
  const proj = geoOrthographic().rotate([-79, -17]).scale(R).translate([cx, cy]).clipAngle(90);
  const path = geoPath(proj);
  const P = (lon: number, lat: number) => proj([lon, lat]) as [number, number];
  // south-west monsoon: from the southern Indian Ocean, across the Arabian Sea, onto India's west coast
  const wind: [number, number][] = [P(47, -13), P(56, -8), P(63, -0.5), P(66.6, 8.5), P(67.6, 15.2)];
  const cr = (pts: [number, number][]) => {   // Catmull-Rom -> cubic Bezier
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  };
  const arrow = cr(wind);
  const [ex, ey] = wind[wind.length - 1], [px, py] = wind[wind.length - 2];
  const ang = Math.atan2(ey - py, ex - px), ah = 42 * k;
  const head = `${ex + ah * Math.cos(ang)},${ey + ah * Math.sin(ang)} ${ex + ah * 0.9 * Math.cos(ang + 2.4)},${ey + ah * 0.9 * Math.sin(ang + 2.4)} ${ex + ah * 0.9 * Math.cos(ang - 2.4)},${ey + ah * 0.9 * Math.sin(ang - 2.4)}`;
  // rain over the Western Ghats, central India and the north-east
  const rain = [[74.4, 18.5], [75.3, 15.2], [76.3, 12.3], [77.2, 9.6], [91.5, 26.4], [93.6, 26.9]].map(([lo, la]) => P(lo, la));
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor={B.teal}/><stop offset="100%" stopColor={B.deep}/></radialGradient>
        <radialGradient id="sea" cx="40%" cy="35%" r="75%"><stop offset="0%" stopColor="#1A7BA3"/><stop offset="100%" stopColor="#0B3A52"/></radialGradient>
        <linearGradient id="arr" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FF8A00"/><stop offset="100%" stopColor={B.amber}/></linearGradient>
        <clipPath id="disc"><circle cx={cx} cy={cy} r={R}/></clipPath>
      </defs>
      <circle cx={S / 2} cy={S / 2} r={S / 2} fill="url(#bg)"/>
      {ring && <circle cx={S / 2} cy={S / 2} r={S / 2 - 10 * k} fill="none" stroke={B.amber} strokeOpacity={0.55} strokeWidth={6 * k}/>}
      <circle cx={cx} cy={cy} r={R} fill="url(#sea)"/>
      <g clipPath="url(#disc)">
        <path d={path(geoGraticule10()) ?? ""} fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={1.4 * k}/>
        {world.features.map((f: any, i: number) => <path key={i} d={path(f) ?? ""} fill={f.properties.iso === "IND" ? B.cream : B.land} stroke={f.properties.iso === "IND" ? "#fff" : "none"} strokeWidth={2.4 * k}/>)}
        <circle cx={cx - R * 0.35} cy={cy - R * 0.4} r={R * 1.1} fill="#fff" opacity={0.05}/>
        {rain.map(([x, y], i) => <line key={i} x1={x + 9 * k} y1={y - 24 * k} x2={x - 4 * k} y2={y + 8 * k} stroke="#1FA4D8" strokeWidth={8 * k} strokeLinecap="round"/>)}
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={B.cream} strokeOpacity={0.85} strokeWidth={4 * k}/>
      <path d={arrow} fill="none" stroke={B.deep} strokeWidth={50 * k} strokeLinecap="round" opacity={0.55}/>
      <path d={arrow} fill="none" stroke="url(#arr)" strokeWidth={34 * k} strokeLinecap="round"/>
      <path d={arrow} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={6 * k} strokeLinecap="round" strokeDasharray={`${36 * k} ${54 * k}`}/>
      <polygon points={head} fill={B.amber} stroke={B.deep} strokeWidth={4 * k} strokeLinejoin="round"/>
    </svg>
  );
};

export const Wordmark: React.FC<{h: number; color?: string}> = ({h, color = "#fff"}) => (
  <div style={{fontFamily: FONT, fontWeight: 700, lineHeight: 0.92, color}}>
    <div style={{fontSize: h * 0.58, letterSpacing: h * 0.035}}>INDICA</div>
    <div style={{fontSize: h * 0.42, letterSpacing: h * 0.198, color: B.amber, marginLeft: h * 0.01}}>ATLAS</div>
  </div>
);

// ---------- stills ----------
export const LogoStill: React.FC = () => <AbsoluteFill style={{background: "transparent"}}><Fonts/><Mark size={800}/></AbsoluteFill>;

export const LockupStill: React.FC = () => (
  <AbsoluteFill style={{background: B.deep, flexDirection: "row", alignItems: "center", padding: "0 70px", gap: 50}}>
    <Fonts/><Mark size={420}/><Wordmark h={300}/>
  </AbsoluteFill>
);

export const WatermarkStill: React.FC = () => <AbsoluteFill style={{background: "transparent"}}><Fonts/><Mark size={150}/></AbsoluteFill>;

// Banner: 2560 x 1440. YouTube's safe area (visible on every device) is the central 1546 x 423.
const ROUTES: [number, number][][] = [
  [[76.2, 10.0], [65, 11.5], [52, 12.8], [45.0, 12.8]],     // Malabar coast to Aden
  [[76.2, 10.0], [62, 2], [48, -4], [40.0, -6.0]],           // to East Africa
  [[72.2, 22.3], [65, 23.8], [58.4, 23.6]],                  // Gujarat to Oman
  [[80.3, 13.1], [88, 9], [95.5, 6.0], [100.3, 3.0], [104, 1.3]],   // Coromandel to Malacca
];
export const BannerStill: React.FC<{guides?: boolean}> = ({guides = false}) => {
  const W = 2560, H = 1440, L0 = 38, L1 = 112, B1 = 30, ppd = W / (L1 - L0);
  const B0 = B1 - H / ppd;
  const xy = (lon: number, lat: number) => [(lon - L0) * ppd, (B1 - lat) * ppd];
  // asia.jpg covers 40..150E, -25..75N at 40 px/deg
  const imgW = 110 * ppd, imgH = 100 * ppd, imgX = (40 - L0) * ppd, imgY = (B1 - 75) * ppd;
  const line = (pts: [number, number][]) => "M" + pts.map(([a, b]) => xy(a, b).join(",")).join("L");
  const sx = (W - 1546) / 2, sy = (H - 423) / 2;
  return (
    <AbsoluteFill style={{background: B.deep, overflow: "hidden"}}>
      <Fonts/>
      <Img src={staticFile("geo/_shared/asia.jpg")} style={{position: "absolute", left: imgX, top: imgY, width: imgW, height: imgH, filter: "saturate(1.1) brightness(0.8)"}}/>
      <AbsoluteFill style={{background: `linear-gradient(90deg, ${B.deep}F2 0%, ${B.deep}B0 30%, ${B.deep}55 60%, ${B.deep}99 100%)`}}/>
      <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
        {ROUTES.map((r, i) => <path key={i} d={line(r)} fill="none" stroke={B.amber} strokeWidth={7} strokeDasharray="4 18" strokeLinecap="round" opacity={0.7}/>)}
        {ROUTES.map((r, i) => { const [x, y] = xy(...r[r.length - 1]); return <circle key={i} cx={x} cy={y} r={11} fill={B.amber}/>; })}
        {[[[50, -8], [62, 4], [70, 14]], [[58, -12], [72, 0], [80, 8]], [[78, -12], [86, 0], [90, 12]]].map((p, i) =>
          <path key={"w" + i} d={line(p as [number, number][])} fill="none" stroke={B.cyan} strokeWidth={10} strokeLinecap="round" opacity={0.28}/>)}
        <text x={xy(60, -12.5)[0]} y={xy(60, -12.5)[1]} fill={B.cyan} opacity={0.75} fontFamily={FONT} fontWeight={700} fontSize={34} letterSpacing={4}>MONSOON WINDS</text>
        <text x={xy(40.5, -9.5)[0]} y={xy(40.5, -9.5)[1]} fill={B.amber} opacity={0.9} fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing={3}>OLD MONSOON TRADE ROUTES</text>
      </svg>
      <div style={{position: "absolute", left: sx - 220, top: sy - 160, width: 1546 + 440, height: 423 + 320,
        background: `radial-gradient(ellipse at center, ${B.deep}F0 0%, ${B.deep}C8 45%, ${B.deep}00 72%)`}}/>
      {/* safe-area content: kept well inside 1546 x 423, because phones still crop the edges of that box (AK, 25 Oct 2026) */}
      <div style={{position: "absolute", left: sx, top: sy, width: 1546, height: 423, display: "flex", alignItems: "center", justifyContent: "center", gap: 36}}>
        <Mark size={300}/>
        <div>
          <Wordmark h={215}/>
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, color: B.cream, letterSpacing: 3, marginTop: 14}}>
            MAPS · HISTORY · <span style={{color: B.amber}}>INDIA</span> AND THE WORLD
          </div>
        </div>
      </div>
      {guides && <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
        <rect x={sx} y={sy} width={1546} height={423} fill="none" stroke="#f0f" strokeWidth={6} strokeDasharray="20 12"/>
        <rect x={(W - 1855) / 2} y={(H - 423) / 2} width={1855} height={423} fill="none" stroke="#0f0" strokeWidth={4} strokeDasharray="10 10"/>
        <rect x={(W - 1235) / 2} y={(H - 338) / 2} width={1235} height={338} fill="none" stroke="#ff0" strokeWidth={4} strokeDasharray="6 8"/>
        <text x={sx + 10} y={sy - 16} fill="#f0f" fontSize={34} fontFamily="Helvetica">safe area, all devices (1546 × 423)</text>
        <text x={20} y={50} fill="#fff" fontSize={34} fontFamily="Helvetica">TV shows the full 2560 × 1440; desktop shows the middle band</text>
      </svg>}
    </AbsoluteFill>
  );
};
