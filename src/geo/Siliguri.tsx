// GeoTales pilot (20 Oct 2026): "The Chicken's Neck", Siliguri Corridor Short, 1080x1920.
// Satellite globe (NASA Blue Marble, inverse orthographic on canvas) hands off to a flat regional map
// with vector overlays (Natural Earth, India point of view). Facts: scripts/geo/siliguri.py.
import React, {useEffect, useMemo, useRef, useState} from "react";
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from "remotion";

export const FPS = 30;
export const W = 1080, H = 1920;
const GAP = 0.12;                       // seconds between beats
const END_HOLD = 1.2;                   // hold the last frame after the voice ends, so the Short never cuts mid-breath
const LAT0 = 26.5, COS0 = Math.cos(LAT0 * Math.PI / 180);
const FONT = "Oswald, Impact, 'Arial Narrow', sans-serif";
const AMBER = "#FFB020", RED = "#FF3B30", GREEN = "#2ECC71", CYAN = "#3DD9FF";

type Beat = {key: string; say: string; cap: string; scene: string; sec: number; audio: string};
export type GeoData = {beats: Beat[]};
type Geo = {box: number[]; wide: number[]; countries: Record<string, number[][][]>; indiaGlobe: number[][][];
  states: Record<string, number[][][]>; ne: string[]; gap: {km: number; a: number[]; b: number[]}; places: Record<string, number[]>};

export const layout = (D: GeoData) => {
  let t = 0;
  const beats = D.beats.map((b) => { const s = t; t += b.sec + GAP; return {...b, start: s, end: s + b.sec}; });
  return {beats, total: Math.ceil((t + END_HOLD) * FPS)};
};

// ---------- camera ----------
type Cam = {lon: number; lat: number; span: number};      // span = degrees of longitude across the frame
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const GLOBE_END = 1.6;                                    // seconds: globe -> flat hand-off
const HANDOFF: Cam = {lon: 88.9, lat: 26.2, span: 10};    // small span: orthographic ~= flat, so the switch is invisible
const MAPFILTER = "saturate(1.15) contrast(1.05)";
const Vignette: React.FC = () => <AbsoluteFill style={{background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)"}}/>;

function camera(t: number, B: ReturnType<typeof layout>["beats"]): Cam {
  const s = (k: string) => B.find((b) => b.scene === k)!.start;
  const keys: [number, Cam][] = [
    [GLOBE_END, HANDOFF],
    [s("neck") - 0.4, {lon: 88.9, lat: 26.3, span: 7.5}],
    [s("neck") + 1.1, {lon: 88.27, lat: 26.63, span: 1.7}],
    [s("neighbours") + 0.2, {lon: 88.27, lat: 26.63, span: 1.7}],
    [s("neighbours") + 1.2, {lon: 88.5, lat: 26.9, span: 6}],
    [s("chumbi") + 0.1, {lon: 88.5, lat: 26.9, span: 6}],
    [s("chumbi") + 1.2, {lon: 88.75, lat: 27.05, span: 3}],
    [s("doklam") + 0.1, {lon: 88.75, lat: 27.05, span: 3}],
    [s("doklam") + 1.4, {lon: 88.9, lat: 27.25, span: 1.25}],
    [s("partition") + 0.1, {lon: 88.85, lat: 27.15, span: 1.6}],
    [s("partition") + 1.6, {lon: 89.2, lat: 24.8, span: 10}],
    [s("traffic") + 0.1, {lon: 89.2, lat: 24.8, span: 10}],
    [s("traffic") + 1.0, {lon: 89.4, lat: 26.3, span: 9}],
    [s("loop") + 0.1, {lon: 89.4, lat: 26.3, span: 9}],
    [s("loop") + 2.3, {lon: 88.27, lat: 26.63, span: 2.2}],
  ];
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, c1] = keys[i], [t0, c0] = keys[i - 1];
    if (t <= t1) {
      const u = ease(Math.max(0, Math.min(1, (t - t0) / (t1 - t0))));
      return {lon: c0.lon + (c1.lon - c0.lon) * u, lat: c0.lat + (c1.lat - c0.lat) * u,
        span: Math.exp(Math.log(c0.span) + (Math.log(c1.span) - Math.log(c0.span)) * u)};
    }
  }
  return keys[keys.length - 1][1];
}
const scaleOf = (c: Cam) => W / (c.span * COS0);          // screen px per degree of latitude
const toScreen = (c: Cam, lon: number, lat: number) => {
  const s = scaleOf(c);
  return [W / 2 + (lon - c.lon) * COS0 * s, H / 2 - (lat - c.lat) * s];
};

// ---------- data loading ----------
type Tex = {w: number; h: number; px: Uint8ClampedArray};
async function loadTex(src: string): Promise<Tex> {
  const img = new Image(); img.src = src; await img.decode();
  const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
  const g = cv.getContext("2d")!; g.drawImage(img, 0, 0);
  return {w: img.width, h: img.height, px: g.getImageData(0, 0, img.width, img.height).data};
}
function useAssets() {
  const [A, setA] = useState<{geo: Geo; world: Tex; region: Tex} | null>(null);   // region = wide.jpg texture
  const [h] = useState(() => delayRender("geo assets"));
  useEffect(() => {
    Promise.all([fetch(staticFile("geo/siliguri/geo.json")).then((r) => r.json()),
      loadTex(staticFile("geo/siliguri/world.jpg")), loadTex(staticFile("geo/siliguri/wide.jpg"))])
      .then(([geo, world, region]) => { setA({geo, world, region}); continueRender(h); });
  }, [h]);
  return A;
}

// ---------- globe (inverse orthographic, satellite texture) ----------
const Globe: React.FC<{A: {geo: Geo; world: Tex; region: Tex}; t: number; neO: number}> = ({A, t, neO}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const u = ease(Math.min(1, t / GLOBE_END));
  const lon0 = 74 + (HANDOFF.lon - 74) * u, lat0 = 14 + (HANDOFF.lat - 14) * u;
  const Rend = scaleOf(HANDOFF) * 180 / Math.PI;
  const R = Math.exp(Math.log(470) + (Math.log(Rend) - Math.log(470)) * u);
  useEffect(() => {
    const cv = ref.current!; const g = cv.getContext("2d")!;
    const img = g.createImageData(W, H); const o = img.data;
    const {world, region, geo} = A; const [L0, L1, B0, B1] = geo.wide;
    const l0 = lon0 * Math.PI / 180, p0 = lat0 * Math.PI / 180, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
    const cx = W / 2, cy = H / 2;
    for (let y = 0; y < H; y++) {
      const py = (cy - y) / R;
      for (let x = 0; x < W; x++) {
        const px = (x - cx) / R; const rr = px * px + py * py; const i = (y * W + x) * 4;
        if (rr > 1) {   // space + thin atmosphere
          const d = Math.sqrt(rr) - 1; const glow = d < 0.06 ? (1 - d / 0.06) * 0.55 : 0;
          o[i] = 4 + 60 * glow; o[i + 1] = 8 + 120 * glow; o[i + 2] = 20 + 255 * glow; o[i + 3] = 255; continue;
        }
        const rho = Math.sqrt(rr); const c = Math.asin(rho); const sc = Math.sin(c), cc = Math.cos(c);
        const lat = rho === 0 ? p0 : Math.asin(cc * sp0 + (py * sc * cp0) / rho);
        const lon = l0 + Math.atan2(px * sc, rho * cc * cp0 - py * sc * sp0);
        let la = lat * 180 / Math.PI, lo = lon * 180 / Math.PI; lo = ((lo + 540) % 360) - 180;
        let j: number, T: Tex;
        if (lo > L0 && lo < L1 && la > B0 && la < B1) {
          T = region; j = (Math.floor((B1 - la) / (B1 - B0) * T.h) * T.w + Math.floor((lo - L0) / (L1 - L0) * T.w)) * 4;
        } else {
          T = world; j = (Math.min(T.h - 1, Math.floor((90 - la) / 180 * T.h)) * T.w + Math.min(T.w - 1, Math.floor((lo + 180) / 360 * T.w))) * 4;
        }
        const shade = 1 - 0.45 * (1 - cc) * (1 - u);      // limb darkening, gone by the hand-off
        o[i] = T.px[j] * shade; o[i + 1] = T.px[j + 1] * shade; o[i + 2] = T.px[j + 2] * shade; o[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    // Borders drawn exactly like the flat map's SVG (same rings, widths, colours), forward orthographic, front side only
    g.lineJoin = "round";
    const draw = (rings: number[][][], fill: string | null, stroke: string, lw: number) => {
      for (const ring of rings) {
        g.beginPath(); let ok = true;
        ring.forEach(([lo, la], k) => {
          const l = lo * Math.PI / 180 - l0, p = la * Math.PI / 180;
          if (sp0 * Math.sin(p) + cp0 * Math.cos(p) * Math.cos(l) < 0) ok = false;
          const X = cx + R * Math.cos(p) * Math.sin(l), Y = cy - R * (cp0 * Math.sin(p) - sp0 * Math.cos(p) * Math.cos(l));
          k ? g.lineTo(X, Y) : g.moveTo(X, Y);
        });
        if (!ok) continue;
        g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } g.strokeStyle = stroke; g.lineWidth = lw; g.stroke();
      }
    };
    const detail = R > 1500;                  // full 10m borders once zoomed in, coarse outline for the whole-Earth view
    if (detail) for (const k of Object.keys(geo.countries)) if (k !== "IND") draw(geo.countries[k], null, "rgba(255,255,255,0.55)", 2);
    if (neO > 0) for (const n of geo.ne) draw(geo.states[n], `rgba(255,176,32,${0.38 * neO})`, `rgba(255,176,32,${neO})`, 3);
    draw(detail ? geo.countries.IND : geo.indiaGlobe, null, "#fff", 4.5);
  }, [A, lon0, lat0, R, neO]);
  return <canvas ref={ref} width={W} height={H} style={{position: "absolute", inset: 0, filter: MAPFILTER}}/>;
};

// ---------- flat map ----------
const ringsToPath = (rings: number[][][]) =>
  rings.map((r) => "M" + r.map(([lo, la]) => `${(lo * COS0).toFixed(4)},${(-la).toFixed(4)}`).join("L") + "Z").join("");

const Label: React.FC<{c: Cam; at: number[]; text: string; o: number; size?: number; color?: string; dy?: number; sub?: string}> =
  ({c, at, text, o, size = 64, color = "#fff", dy = 0, sub}) => {
    if (o <= 0) return null;
    const [x, y] = toScreen(c, at[0], at[1]);
    return (
      <div style={{position: "absolute", left: x, top: y + dy, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * o})`, opacity: o,
        fontFamily: FONT, fontWeight: 700, fontSize: size, color, textAlign: "center", whiteSpace: "nowrap", lineHeight: 1.05,
        textShadow: "0 0 3px #000, 0 4px 14px rgba(0,0,0,0.9), 0 0 2px #000"}}>
        {text}{sub && <div style={{fontSize: size * 0.48, color: "#fff", opacity: 0.92}}>{sub}</div>}
      </div>
    );
  };

const win = (t: number, a: number, b: number, fade = 0.3) =>
  Math.max(0, Math.min(1, (t - a) / fade, (b - t) / fade));

export const Siliguri: React.FC<{D: GeoData}> = ({D}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const L = useMemo(() => layout(D), [D]); const B = L.beats;
  const A = useAssets();
  const paths = useMemo(() => {
    if (!A) return null;
    const g = A.geo; const p: Record<string, string> = {};
    for (const k of Object.keys(g.countries)) p[k] = ringsToPath(g.countries[k]);
    p.NE = g.ne.map((n) => ringsToPath(g.states[n])).join("");
    p.WB = ringsToPath(g.states["West Bengal"]);
    return p;
  }, [A]);
  if (!A || !paths) return <AbsoluteFill style={{background: "#05080f"}}/>;
  const G = A.geo;
  const at = (k: string) => B.find((b) => b.scene === k)!;
  const cur = B.find((b) => t >= b.start && t < b.end + GAP) ?? B[B.length - 1];
  const lt = t - cur.start;                                // time within current beat
  const c = camera(t, B);
  const s = scaleOf(c); const [Xc, Yc] = [c.lon * COS0, -c.lat];
  const sw = (px: number) => px / s;                        // stroke width in degree units
  const box = (bb: number[]) => { const [x, y] = toScreen(c, bb[0], bb[3]); return {position: "absolute" as const, left: x, top: y, width: (bb[1] - bb[0]) * COS0 * s, height: (bb[3] - bb[2]) * s}; };
  const flatO = interpolate(t, [GLOBE_END - 0.05, GLOBE_END + 0.15], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  // scene windows
  const b = (k: string) => at(k);
  const neO = Math.max(win(t, 0.9, b("neck").start + 0.6), win(t, b("traffic").start + 0.4, b("traffic").end + 0.3)) ;
  const gapO = Math.max(win(t, b("globe").start + 2.2, b("neighbours").end), win(t, b("loop").start + 1.6, L.total / FPS + 1));
  const nb = b("neighbours");
  const npO = win(t, nb.start + 0.05, b("partition").start), bdO = win(t, nb.start + 0.35 * nb.sec, b("partition").start), btO = win(t, nb.start + 0.7 * nb.sec, b("doklam").end);
  const cnO = win(t, b("chumbi").start, b("doklam").end);
  const dk = b("doklam"), so = b("standoff"), pt = b("partition"), tr = b("traffic"), lp = b("loop");
  const roadU = interpolate(t, [dk.start + 1.4, dk.end], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const day = Math.round(interpolate(t, [so.start + 0.3, so.end - 0.4], [1, 73], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const epO = win(t, pt.start + 1.6, tr.start + 0.2);
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);

  // corridor ruler
  const [ax, ay] = toScreen(c, G.gap.a[0], G.gap.a[1]); const [bx, by] = toScreen(c, G.gap.b[0], G.gap.b[1]);
  const rulerU = interpolate(t, [b("neck").start + 1.0, b("neck").start + 1.8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  // schematic traffic route (illustrative, not a real alignment)
  const route = [[84.0, 25.7], [86.6, 25.9], [88.15, 26.55], [88.6, 26.7], [89.9, 26.45], [91.75, 26.14]];
  const routeD = "M" + route.map(([lo, la]) => `${lo * COS0},${-la}`).join("L");

  return (
    <AbsoluteFill style={{background: "#05080f", overflow: "hidden"}}>
      <style>{`@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}`}</style>
      {t < GLOBE_END + 0.2 && <><Globe A={A} t={t} neO={neO}/><Vignette/></>}
      <AbsoluteFill style={{opacity: flatO}}>
        <AbsoluteFill style={{filter: MAPFILTER}}>
          <img src={staticFile("geo/siliguri/wide.jpg")} style={box(G.wide)}/>
          {c.span < 9 && <img src={staticFile("geo/siliguri/region.jpg")} style={{...box(G.box), WebkitMaskImage: "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent), linear-gradient(transparent, #000 4%, #000 96%, transparent)", WebkitMaskComposite: "source-in"}}/>}
        </AbsoluteFill>
        <Vignette/>
        <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
          <g transform={`matrix(${s},0,0,${s},${W / 2 - Xc * s},${H / 2 - Yc * s})`} strokeLinejoin="round">
            {/* every border, thin */}
            {Object.keys(paths).filter((k) => k.length === 3).map((k) =>
              <path key={k} d={paths[k]} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={sw(2)}/>)}
            <path d={paths.NPL} fill={`rgba(61,217,255,${0.32 * npO})`} stroke={CYAN} strokeOpacity={npO} strokeWidth={sw(4)}/>
            <path d={paths.BGD} fill={`rgba(46,204,113,${0.32 * Math.max(bdO, epO)})`} stroke={GREEN} strokeOpacity={Math.max(bdO, epO)} strokeWidth={sw(4)}/>
            <path d={paths.BTN} fill={`rgba(255,149,0,${0.32 * btO})`} stroke="#FF9500" strokeOpacity={btO} strokeWidth={sw(4)}/>
            <path d={paths.CHN} fill={`rgba(255,59,48,${0.30 * cnO})`} stroke={RED} strokeOpacity={cnO} strokeWidth={sw(4)}/>
            <path d={paths.NE} fill={`rgba(255,176,32,${0.38 * neO})`} stroke={AMBER} strokeOpacity={neO} strokeWidth={sw(3)}/>
            <path d={paths.WB} fill="none" stroke="#fff" strokeOpacity={epO} strokeWidth={sw(4)} strokeDasharray={`${sw(14)} ${sw(10)}`}/>
            <path d={paths.IND} fill="none" stroke="#fff" strokeWidth={sw(4.5)}/>
            {/* traffic: dots flowing through the gap */}
            {(() => {
              const o = win(t, tr.start + 0.5, tr.end + 0.2); if (o <= 0) return null;
              return <g opacity={o}>
                <path d={routeD} fill="none" stroke={AMBER} strokeWidth={sw(7)} strokeOpacity={0.35} strokeLinecap="round"/>
                <path d={routeD} fill="none" stroke="#fff" strokeWidth={sw(9)} strokeLinecap="round"
                  strokeDasharray={`${sw(2)} ${sw(34)}`} strokeDashoffset={-sw(t * 260)}/>
              </g>;
            })()}
          </g>
        </svg>

        {/* corridor ruler */}
        {gapO > 0 && rulerU > 0 && (
          <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: gapO}}>
            <circle cx={(ax + bx) / 2} cy={(ay + by) / 2} r={Math.max(40, Math.hypot(bx - ax, by - ay) * 0.75) * (1 + 0.08 * pulse)} fill="none" stroke={AMBER} strokeWidth={5} opacity={0.8}/>
            <line x1={ax} y1={ay} x2={ax + (bx - ax) * rulerU} y2={ay + (by - ay) * rulerU} stroke="#fff" strokeWidth={7} strokeLinecap="round"/>
            <circle cx={ax} cy={ay} r={11} fill="#fff"/>{rulerU > 0.98 && <circle cx={bx} cy={by} r={11} fill="#fff"/>}
          </svg>
        )}
        <Label c={c} at={[(G.gap.a[0] + G.gap.b[0]) / 2, (G.gap.a[1] + G.gap.b[1]) / 2]} dy={c.span < 3 ? 120 : 70} text="20–22 km"
          o={gapO * rulerU} size={c.span < 3 ? 84 : 56} color={AMBER}/>

        {/* labels */}
        <Label c={c} at={[90.6, 25.3]} text="NORTHEAST INDIA" sub="8 states · 45 million people*" o={neO * win(t, 1.6, 99)} size={62} color={AMBER}/>
        <Label c={c} at={[78.5 + 4, 25.2]} text="INDIA" o={Math.max(win(t, 1.6, b("neck").start + 0.4), win(t, tr.start + 0.5, tr.end))} size={70}/>
        <Label c={c} at={[87.55, 27.05]} text="🇳🇵 NEPAL" o={npO} size={c.span < 3 ? 70 : 60} color={CYAN}/>
        <Label c={c} at={[88.85, 25.85]} text="🇧🇩 BANGLADESH" o={bdO} size={60} color={GREEN}/>
        <Label c={c} at={[90.45, 27.45]} text="🇧🇹 BHUTAN" o={btO} size={60} color="#FF9500"/>
        <Label c={c} at={[88.95, 27.85]} text="🇨🇳 CHINA" sub="Chumbi Valley" o={cnO} size={62} color={RED}/>
        <Label c={c} at={[88.43, 26.71]} text="● Siliguri" o={win(t, b("neck").start + 1.4, nb.start + 0.3)} size={46} dy={-60}/>
        {/* Chumbi arrow */}
        {(() => {
          const ch = b("chumbi"); const o = win(t, ch.start + 0.9, dk.start + 1.2); if (o <= 0) return null;
          const [x0, y0] = toScreen(c, 88.95, 27.6); const [x1, y1] = toScreen(c, 88.5, 26.85);
          const u = interpolate(t, [ch.start + 0.9, ch.end], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
          const xe = x0 + (x1 - x0) * u, ye = y0 + (y1 - y0) * u; const ang = Math.atan2(y1 - y0, x1 - x0);
          return <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}>
            <line x1={x0} y1={y0} x2={xe} y2={ye} stroke={RED} strokeWidth={14} strokeLinecap="round"/>
            <polygon points={`${xe + 34 * Math.cos(ang)},${ye + 34 * Math.sin(ang)} ${xe + 26 * Math.cos(ang + 2.2)},${ye + 26 * Math.sin(ang + 2.2)} ${xe + 26 * Math.cos(ang - 2.2)},${ye + 26 * Math.sin(ang - 2.2)}`} fill={RED}/>
          </svg>;
        })()}
        {/* Doklam road (illustrative) + standoff */}
        {(() => {
          const o = win(t, dk.start + 1.2, so.end + 0.2); if (o <= 0) return null;
          const [x0, y0] = toScreen(c, 88.97, 27.36); const [x1, y1] = toScreen(c, 88.93, 27.29);
          return <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}>
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * roadU} y2={y0 + (y1 - y0) * roadU} stroke="#fff" strokeWidth={12} strokeDasharray="22 12"/>
            <circle cx={x1} cy={y1} r={18 + 6 * pulse} fill={RED} stroke="#fff" strokeWidth={5}/>
          </svg>;
        })()}
        <Label c={c} at={[88.93, 27.29]} text="DOKLAM" sub="Bhutan–China disputed · road illustrative" o={win(t, dk.start + 1.0, so.end + 0.2)} size={70} dy={150}/>
        {(() => {
          const o = win(t, so.start + 0.1, so.end + 0.2); if (o <= 0) return null;
          const [x, y] = toScreen(c, 88.93, 27.29);
          return <>
            {[[-1, CYAN, "🇮🇳"], [1, RED, "🇨🇳"]].map(([d, col, fl]: any) => {
              const k = spring({frame: f - Math.round((so.start + 0.2) * FPS), fps: FPS, config: {damping: 12}});
              return <div key={d} style={{position: "absolute", left: x + d * (260 - 120 * k), top: y + 40 * d, transform: "translate(-50%,-50%)", opacity: o,
                fontSize: 96, filter: `drop-shadow(0 0 10px ${col})`}}>{fl}</div>;
            })}
            <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 700, color: "#fff",
              textShadow: "0 4px 18px #000"}}>
              <div style={{fontSize: 70, letterSpacing: 4}}>STANDOFF · DAY</div>
              <div style={{fontSize: 230, lineHeight: 1, color: day === 73 ? RED : "#fff"}}>{day}</div>
              <div style={{fontSize: 40, opacity: 0.9}}>16 June – 28 August 2017</div>
            </div>
          </>;
        })()}
        {/* Partition */}
        <Label c={c} at={[90.2, 23.9]} text="EAST PAKISTAN" sub="1947 → Bangladesh since 1971" o={epO} size={66} color={GREEN}/>
        <Label c={c} at={[87.6, 23.2]} text="BENGAL" sub="split in 1947" o={epO} size={56}/>
        {(() => {
          const o = win(t, pt.start + 0.9, pt.end); if (o <= 0) return null;
          const k = spring({frame: f - Math.round((pt.start + 0.9) * FPS), fps: FPS, config: {damping: 10, mass: 0.6}});
          return <div style={{position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: o, transform: `scale(${2 - k}) rotate(-6deg)`,
            fontFamily: FONT, fontWeight: 700, fontSize: 200, color: "#fff", WebkitTextStroke: "6px #000", textShadow: "0 8px 30px #000"}}>1947</div>;
        })()}
        <Label c={c} at={[86.3, 26.75]} text="ROAD + RAIL" sub="schematic route" o={win(t, tr.start + 0.8, tr.end + 0.2)} size={58} color={AMBER}/>
      </AbsoluteFill>

      {/* hook number (first beat) */}
      {(() => {
        const g = at("globe"); const o = win(t, 0.05, g.end, 0.15); if (o <= 0) return null;
        const n = Math.round(interpolate(t, [0.1, 1.4], [0, 45], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)}));
        return <div style={{position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 700, color: "#fff",
          textShadow: "0 6px 24px #000, 0 0 4px #000"}}>
          <div style={{fontSize: 210, lineHeight: 1, color: AMBER}}>{n} MILLION</div>
          <div style={{fontSize: 64}}>INDIANS · ONE THIN STRIP</div>
        </div>;
      })()}
      {/* engagement prompt */}
      {(() => {
        const o = win(t, lp.start + 0.2, 999); if (o <= 0) return null;
        return <div style={{position: "absolute", left: 60, right: 60, top: 260, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 700, fontSize: 68,
          color: "#fff", background: "rgba(0,0,0,0.55)", borderRadius: 24, padding: "22px 26px"}}>Should India build a second route? 👇</div>;
      })()}

      <div style={{position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", pointerEvents: "none"}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#fff", background: "rgba(0,0,0,0.45)", borderRadius: 999,
          padding: "8px 26px", border: "2px solid rgba(255,176,32,0.8)", textShadow: "0 1px 3px #000"}}>
          <span style={{color: "#FFB020"}}>◉</span> INDICA ATLAS
        </div>
      </div>
      {/* captions */}
      {(() => {
        const words = cur.cap.split(" "); const n = Math.min(words.length, Math.floor((lt / Math.max(0.5, cur.sec * 0.85)) * words.length) + 1);
        return <div style={{position: "absolute", left: 50, right: 50, top: 1380, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 76,
          lineHeight: 1.12, color: "#fff", WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 6px 18px rgba(0,0,0,0.85)"}}>
          {words.map((w, i) => <span key={i} style={{opacity: i < n ? 1 : 0, color: i === n - 1 ? AMBER : "#fff"}}>{w} </span>)}
        </div>;
      })()}
      <div style={{position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 24,
        color: "rgba(255,255,255,0.75)", textShadow: "0 1px 3px #000"}}>
        Imagery: NASA Blue Marble · Borders: Natural Earth (India view) · *Census 2011
      </div>

      {B.map((bt) => (
        <Sequence key={bt.key} from={Math.round(bt.start * FPS)} durationInFrames={Math.ceil(bt.sec * FPS) + 2}>
          <Audio src={staticFile(`geo/siliguri/${bt.audio}`)}/>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
