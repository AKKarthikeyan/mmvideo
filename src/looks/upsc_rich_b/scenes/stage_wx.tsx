// Look B weather and the opening Earth for the stage scene: rain, lightning, and the 1-second "globe-band" intro.
import React, {useMemo} from "react";
import {LAND} from "../../cartoon/long/scenes/globe_land";
import {W, H, clamp, rng} from "../kit";

/** Rain in front of everything: two depths of slanted streaks, a few splash rings are drawn by the sets themselves. */
export const Rain: React.FC<{f: number; heavy?: boolean}> = ({f, heavy}) => {
  const drops = useMemo(() => { const r = rng(heavy ? 91 : 17); return Array.from({length: heavy ? 300 : 150}).map(() => ({x: r() * 2400 - 200, y: r() * 1300, v: 0.75 + r() * 0.6, l: 0.5 + r() * 0.8, near: r() < 0.28})); }, [heavy]);
  const slant = heavy ? 0.34 : 0.2, speed = heavy ? 46 : 32;
  return (
    <g style={{pointerEvents: "none"}}>
      {heavy && <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="#2b3946" opacity="0.18"/>}
      {drops.map((d, i) => {
        const len = (d.near ? 78 : 44) * d.l * (heavy ? 1.25 : 1), y = ((d.y + f * speed * d.v) % 1300) - 110;
        const x0 = ((d.x - ((y + 110) * slant)) % 2400 + 2400) % 2400 - 200;
        return <path key={i} d={`M${x0},${y} l${-len * slant},${len}`} stroke={d.near ? "#f2f8fc" : "#dbe8f0"} strokeWidth={d.near ? 2.4 : 1.3} strokeLinecap="round" opacity={d.near ? 0.55 : 0.36}/>;
      })}
    </g>
  );
};

/** A fork of lightning and a sky flash about every 2.8 s (84 logical frames), at a new place each time. */
export const Lightning: React.FC<{f: number}> = ({f}) => {
  const n = Math.floor(f / 84), ph = f - n * 84;
  const flash = ph < 2.5 ? 1 : ph < 6 ? 0.35 : ph > 8 && ph < 10.5 ? 0.7 : ph > 10.5 && ph < 14 ? 0.2 : 0;
  const bolt = useMemo(() => {
    const r = rng(n * 7 + 3); let x = 240 + r() * 1100, y = -20; const pts: string[] = [`${x},${y}`], branch: string[] = [];
    while (y < 520) { y += 40 + r() * 50; x += (r() - 0.5) * 120; pts.push(`${x},${y}`); if (r() < 0.3) branch.push(`M${x},${y} l${(r() - 0.5) * 160},${60 + r() * 90}`); }
    return {d: "M" + pts.join(" L"), branch};
  }, [n]);
  if (flash <= 0) return null;
  return (
    <g style={{pointerEvents: "none"}}>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="#eaf1ff" opacity={flash * 0.42} style={{mixBlendMode: "screen"}}/>
      {ph < 8 && <g opacity={clamp(1.2 - ph / 8)}>
        <path d={bolt.d} fill="none" stroke="#bcd0ff" strokeWidth="16" opacity="0.4" strokeLinejoin="round"/>
        <path d={bolt.d} fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinejoin="round"/>
        {bolt.branch.map((b, i) => <path key={i} d={b} stroke="#ffffff" strokeWidth="2.6" fill="none"/>)}
      </g>}
    </g>
  );
};

// ---- the opening Earth ---------------------------------------------------------------------------------------------------------
const D2R = Math.PI / 180;
/** A lit sphere (Natural Earth land, India's official view) seen from above South Asia, with a white band of cloud along the equator. 30 logical frames. */
export const GlobeIntro: React.FC<{f: number}> = ({f}) => {
  const R = 360, cx = 960, cy = 520, sc = 0.93 + 0.07 * clamp(f / 18), lam0 = 62 + f * 0.9, phi0 = 14;
  const sp0 = Math.sin(phi0 * D2R), cp0 = Math.cos(phi0 * D2R);
  const pr = (lon: number, lat: number): [number, number] => {
    const l = (lon - lam0) * D2R, p = lat * D2R, x = Math.cos(p) * Math.sin(l), y = cp0 * Math.sin(p) - sp0 * Math.cos(p) * Math.cos(l), c = sp0 * Math.sin(p) + cp0 * Math.cos(p) * Math.cos(l);
    if (c >= 0) return [x * R, -y * R];
    const m = Math.hypot(x, y) || 1;
    return [(x / m) * R, (-y / m) * R];
  };
  const land = useMemo(() => LAND.map((ring) => { let d = ""; for (let i = 0; i < ring.length; i += 2) { const [x, y] = pr(ring[i], ring[i + 1]); d += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `; } return d + "Z"; }).join(" "), [lam0]); // eslint-disable-line
  const edge = (lat: number) => { const pts: string[] = []; for (let lo = lam0 - 90; lo <= lam0 + 90; lo += 6) { const w = Math.sin((lo - lam0) / 14 + f / 8) * 1.6; const [x, y] = pr(lo, lat + w); pts.push(`${x.toFixed(1)},${y.toFixed(1)}`); } return pts; };
  const up = edge(7), dn = edge(-7), bandD = `M${up.join(" L")} L${dn.reverse().join(" L")} Z`;
  const stars = useMemo(() => { const r = rng(5); return Array.from({length: 70}).map(() => ({x: r() * W, y: r() * H, r: 0.8 + r() * 2, o: 0.3 + r() * 0.6})); }, []);
  return (
    <g>
      <defs>
        <radialGradient id="gi-sea" cx="0.36" cy="0.3" r="0.9"><stop offset="0" stopColor="#4aa0d8"/><stop offset="0.55" stopColor="#1f6aa6"/><stop offset="1" stopColor="#0b2a55"/></radialGradient>
        <radialGradient id="gi-shade" cx="0.34" cy="0.3" r="0.85"><stop offset="0.55" stopColor="#0a1530" stopOpacity="0"/><stop offset="1" stopColor="#0a1530" stopOpacity="0.62"/></radialGradient>
        <radialGradient id="gi-atm" cx="0.5" cy="0.5" r="0.5"><stop offset="0.9" stopColor="#7dc4ff" stopOpacity="0.55"/><stop offset="1" stopColor="#7dc4ff" stopOpacity="0"/></radialGradient>
        <linearGradient id="gi-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070d1f"/><stop offset="1" stopColor="#10234a"/></linearGradient>
        <clipPath id="gi-clip"><circle r={R}/></clipPath>
        <filter id="gi-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="gi-glow" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="16"/></filter>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="url(#gi-bg)"/>
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o * (0.7 + 0.3 * Math.sin(f / 5 + i))}/>)}
      <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
        <circle r={R * 1.12} fill="url(#gi-atm)"/>
        <circle r={R} fill="url(#gi-sea)"/>
        <g clipPath="url(#gi-clip)">
          <path d={land} fill="#6fa55a" stroke="#c9d89a" strokeWidth="1.2" strokeLinejoin="round" opacity="0.96"/>
          <path d={land} fill="#3f6e3a" opacity="0.25" transform="translate(5 6)"/>
          <path d={bandD} fill="#ffffff" opacity="0.85" filter="url(#gi-glow)"/>
          <path d={bandD} fill="#ffffff" opacity="0.95" filter="url(#gi-soft)"/>
          <circle r={R} fill="url(#gi-shade)"/>
        </g>
        <circle r={R} fill="none" stroke="#a9d6ff" strokeWidth="2" opacity="0.5"/>
        <path d={`M${-R * 0.72},${-R * 0.56} Q${-R * 0.5},${-R * 0.82} ${-R * 0.14},${-R * 0.92}`} stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.28"/>
      </g>
    </g>
  );
};
