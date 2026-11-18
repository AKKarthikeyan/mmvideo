// Flow Build (7 Oct 2026): one diagram that builds up as the narration plays: an icon draws on, an arrow runs to the
// next, labels and numbers pop in, until the whole flow is on screen. Idea from DistilBook's explainer formats; rebuilt
// here in code (no copied art). Five skins: navyred, ivorygold, flatvector, sketch, iso.
// Data: public/flow/<id>/data.json from scripts/build_flow.py (scripts/flow_scripts.py). Every label and number comes
// from the data; nothing factual is hard-coded here.
import React from "react";
import {AbsoluteFill, Audio, Composition, Easing, Sequence, Still, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import rough from "roughjs/bin/rough";
import {VoxFonts} from "../voxkit";
import {HANDFONT} from "../handkit";
import {ICONS, Prim, Role} from "./icons";
import UBI100 from "../../public/flow/ubi100/data.json";

const FPS = 30, W = 1920, H = 1080;
const FrameCtx = React.createContext<number | null>(null);
const useF = () => { const o = React.useContext(FrameCtx); const f = useCurrentFrame(); return o ?? f; };
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const spr = (f: number, s: number, cfg = {damping: 13, stiffness: 140, mass: 0.8}) => f < s ? 0 : spring({frame: f - s, fps: FPS, config: cfg});
const gen = rough.generator();
const SANS = "'Helvetica Neue', Arial, sans-serif", SERIF = "Georgia, 'Times New Roman', serif", COND = "Oswald, Impact, sans-serif";

// ---------- skins ----------
type Skin = {
  id: string; name: string; bg: string; texture: "dots" | "paper" | "none" | "ruled" | "grad";
  ink: string; accent: string; light: string; fillc: string; solid: string; hot: string;
  mode: "line" | "flat" | "rough" | "iso"; frame: "circle" | "ring2" | "ground" | "rough" | "tile";
  tFont: string; tSize: number; tWeight: number; tSpace: number; tColor: string;
  nFont: string; nSize: number; nColor: string; sFont: string; sSize: number; sColor: string; sStyle?: string;
  edge: {color: string; width: number; style: "straight" | "curve" | "dash" | "rough"; head: "arrow" | "diamond" | "dot"};
  lab: {bg: string; color: string; font: string; size: number; italic?: boolean};
  textDy: number;
};
export const SKINS: Record<string, Skin> = {
  navyred: {id: "navyred", name: "Navy & Red Editorial", bg: "#F6F6F3", texture: "dots", ink: "#1B2A4A", accent: "#C8102E", light: "#DCE3EE", fillc: "#FFFFFF", solid: "#1B2A4A", hot: "#C8102E",
    mode: "line", frame: "circle", tFont: SANS, tSize: 28, tWeight: 800, tSpace: 1, tColor: "#1B2A4A", nFont: SANS, nSize: 54, nColor: "#C8102E", sFont: SANS, sSize: 20, sColor: "#5A6478",
    edge: {color: "#1B2A4A", width: 4, style: "straight", head: "arrow"}, lab: {bg: "#C8102E", color: "#FFFFFF", font: SANS, size: 22}, textDy: 0},
  ivorygold: {id: "ivorygold", name: "Ivory Navy Gold", bg: "#F5EFE0", texture: "paper", ink: "#14213D", accent: "#C9A227", light: "#E8DFC4", fillc: "#FBF8EF", solid: "#14213D", hot: "#A61B1B",
    mode: "line", frame: "ring2", tFont: SERIF, tSize: 26, tWeight: 700, tSpace: 3, tColor: "#14213D", nFont: SERIF, nSize: 56, nColor: "#9C7A12", sFont: SERIF, sSize: 21, sColor: "#5B5240", sStyle: "italic",
    edge: {color: "#C9A227", width: 2.5, style: "curve", head: "diamond"}, lab: {bg: "transparent", color: "#9C7A12", font: SERIF, size: 25, italic: true}, textDy: 0},
  flatvector: {id: "flatvector", name: "Editorial Flat Vector", bg: "#FAF6EE", texture: "none", ink: "#1F3A5F", accent: "#F28C28", light: "#A9CBEA", fillc: "#1F3A5F", solid: "#1F3A5F", hot: "#E04F2F",
    mode: "flat", frame: "ground", tFont: SANS, tSize: 26, tWeight: 700, tSpace: 0.5, tColor: "#1F3A5F", nFont: COND, nSize: 72, nColor: "#1F3A5F", sFont: SANS, sSize: 20, sColor: "#6B7A8F",
    edge: {color: "#9AA3AE", width: 3, style: "dash", head: "arrow"}, lab: {bg: "transparent", color: "#F28C28", font: COND, size: 32}, textDy: 0},
  sketch: {id: "sketch", name: "Sketch Notebook", bg: "#FDFCF8", texture: "ruled", ink: "#1F4E9C", accent: "#F4B183", light: "#BFD9F2", fillc: "#E3F0FB", solid: "#1F4E9C", hot: "#C0392B",
    mode: "rough", frame: "rough", tFont: HANDFONT, tSize: 30, tWeight: 400, tSpace: 0, tColor: "#1F4E9C", nFont: HANDFONT, nSize: 52, nColor: "#C0392B", sFont: HANDFONT, sSize: 22, sColor: "#41618F",
    edge: {color: "#1F4E9C", width: 2.5, style: "rough", head: "arrow"}, lab: {bg: "transparent", color: "#C0392B", font: HANDFONT, size: 28}, textDy: 0},
  iso: {id: "iso", name: "Isometric", bg: "linear-gradient(180deg,#F5F7FC,#E8ECF7)", texture: "grad", ink: "#2B2F45", accent: "#9B6BF2", light: "#C7D2FE", fillc: "#4F6BED", solid: "#3A4CC9", hot: "#E5484D",
    mode: "iso", frame: "tile", tFont: SANS, tSize: 24, tWeight: 700, tSpace: 0.5, tColor: "#2B2F45", nFont: SANS, nSize: 50, nColor: "#4F6BED", sFont: SANS, sSize: 19, sColor: "#6B7090",
    edge: {color: "#8892B0", width: 2.5, style: "straight", head: "dot"}, lab: {bg: "#FFFFFF", color: "#4F6BED", font: SANS, size: 22}, textDy: 34},
};
export const SKIN_IDS = Object.keys(SKINS);

const roleFill = (s: Skin, r: Role) => r === "line" ? "none" : r === "accent" ? s.accent : r === "light" ? s.light : r === "solid" ? s.solid : s.fillc;

// ---------- icon ----------
const Icon: React.FC<{name: string; s: Skin; p: number; size?: number; seed?: number}> = ({name, s, p, size = 120, seed = 1}) => {
  const prims: Prim[] = ICONS[name];
  const k = size / 100;
  const roughPaths = React.useMemo(() => s.mode !== "rough" ? null : prims.map((q, i) => gen.toPaths(gen.path(q.d, {
    stroke: s.ink, strokeWidth: 2.2 / k, roughness: 1.4, seed: seed * 10 + i,
    fill: q.role === "line" ? undefined : roleFill(s, q.role), fillStyle: q.role === "solid" ? "solid" : "hachure", hachureGap: 5, fillWeight: 1.2 / k}))), [name, s.id, seed]);
  if (p <= 0) return null;
  const fillOp = Math.max(0, Math.min(1, (p - 0.45) / 0.4));
  const strokeW = s.mode === "line" ? 4.6 / k : s.mode === "flat" || s.mode === "iso" ? 2 / k : 2.2 / k;
  const strokeOf = (r: Role) => s.mode === "line" ? s.ink : s.mode === "iso" ? (r === "line" ? "#FFFFFF" : roleFill(s, r)) : r === "line" ? s.ink : roleFill(s, r);
  const body = (dx = 0, dy = 0, shadow = false) => (
    <g transform={`translate(${dx} ${dy})`}>
      {prims.map((q, i) => {
        const fill = roleFill(s, q.role);
        return <path key={i} d={q.d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p / 0.6)}
          fill={fill === "none" ? "none" : shadow ? "#1d2350" : fill} fillOpacity={fill === "none" ? 0 : shadow ? 0.18 * fillOp : fillOp}
          stroke={shadow ? "none" : q.role === "line" && s.mode !== "line" ? (s.mode === "iso" ? "#FFFFFF" : s.ink) : strokeOf(q.role)}
          strokeWidth={q.role === "line" ? strokeW * 1.6 : strokeW} strokeLinejoin="round" strokeLinecap="round"/>;
      })}
    </g>);
  return (
    <g transform={`scale(${k}) translate(-50 -50)`}>
      {s.mode === "rough" ? roughPaths!.map((ps, i) => <g key={i}>{ps.map((q: any, j: number) =>
        <path key={j} d={q.d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, p / 0.7)}
          fill={q.fill && q.fill !== "none" ? q.fill : "none"} fillOpacity={fillOp} stroke={q.stroke} strokeWidth={q.strokeWidth} strokeLinecap="round"/>)}</g>)
        : <>{s.mode === "iso" && body(5, 5, true)}{body()}</>}
    </g>
  );
};

// ---------- node frame ----------
const Frame: React.FC<{s: Skin; p: number; seed: number}> = ({s, p, seed}) => {
  const rc = React.useMemo(() => s.frame === "rough" ? gen.toPaths(gen.circle(0, 0, 186, {stroke: s.ink, strokeWidth: 2.2, roughness: 1.2, seed, fill: s.fillc, fillStyle: "solid"})) : null, [s.id, seed]);
  if (p <= 0) return null;
  const sc = 0.6 + 0.4 * p;
  if (s.frame === "circle") return <circle r={88 * sc} fill="#FFFFFF" stroke={s.ink} strokeWidth={3.5} opacity={Math.min(1, p * 2)}/>;
  if (s.frame === "ring2") return <g opacity={Math.min(1, p * 2)}><circle r={90 * sc} fill={s.fillc} stroke={s.accent} strokeWidth={3}/><circle r={81 * sc} fill="none" stroke={s.accent} strokeWidth={1}/></g>;
  if (s.frame === "ground") return <ellipse cx={0} cy={72} rx={86 * sc} ry={13} fill="#1F3A5F" opacity={0.1 * p}/>;
  if (s.frame === "rough") return <g opacity={Math.min(1, p * 2)}>{rc!.map((q: any, i: number) => <path key={i} d={q.d} fill={q.fill && q.fill !== "none" ? q.fill : "none"} stroke={q.stroke} strokeWidth={q.strokeWidth}/>)}</g>;
  // isometric tile under the icon
  const hw = 112 * sc, hh = 64 * sc, th = 24, cy = 64;
  return (
    <g opacity={Math.min(1, p * 2)}>
      <ellipse cx={0} cy={cy + th + 30} rx={hw * 0.95} ry={hh * 0.55} fill="#1d2350" opacity={0.08}/>
      <polygon points={`${-hw},${cy} 0,${cy + hh} 0,${cy + hh + th} ${-hw},${cy + th}`} fill="#D5DBEE"/>
      <polygon points={`${hw},${cy} 0,${cy + hh} 0,${cy + hh + th} ${hw},${cy + th}`} fill="#C2CBE5"/>
      <polygon points={`0,${cy - hh} ${hw},${cy} 0,${cy + hh} ${-hw},${cy}`} fill="#FFFFFF"/>
    </g>
  );
};

// ---------- number count-up ----------
const countText = (num: string, p: number) => {
  const m = num.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return num;
  const raw = m[2].replace(/,/g, ""), dec = raw.includes(".") ? raw.split(".")[1].length : 0;
  return `${m[1]}${(parseFloat(raw) * p).toFixed(dec)}${m[3]}`;
};

// ---------- timeline helpers ----------
type B = any;
const beatFrames = (b: B) => Math.ceil((b.sec + 0.3) * FPS);
const timeline = (D: any) => {
  let t = 15; const st: Record<string, number> = {};
  D.beats.forEach((b: B) => { st[b.key] = t; t += beatFrames(b); });
  const at = (ref: string, off = 0) => {
    const [k, ph] = ref.split("|"); const b = D.beats.find((x: B) => x.key === k);
    const i = b.say.toLowerCase().indexOf(ph.toLowerCase()); if (i < 0) throw new Error(`phrase not in ${k}: ${ph}`);
    return st[k] + Math.round(b.sec * FPS * i / b.say.length) + off;
  };
  return {st, at, total: t + 75};
};

// ---------- a node ----------
const Node: React.FC<{n: any; s: Skin; t: number; hot: number; seed: number}> = ({n, s, t, hot, seed}) => {
  const f = useF();
  if (f < t) return null;
  const pf = ease(f, t, 16), pi = ease(f, t + 4, 26), pt = spr(f, t + 14), pn = ease(f, t + 18, 22);
  const lines: string[] = String(n.title).split("\n");
  const ty = (s.frame === "tile" ? 150 : 128) + s.textDy;
  const iconY = s.frame === "tile" ? -12 : -6;
  const ring = hot > 0 ? <circle r={104 + 6 * Math.sin(f / 5)} fill="none" stroke={s.hot} strokeWidth={5} opacity={hot}/> : null;
  if (n.kind === "panel") {
    const pw = 500, ph = 280, max = Math.max(...n.rows.map((r: any) => r.v));
    return (
      <g transform={`translate(${n.x} ${n.y + 20})`} opacity={Math.min(1, pf * 1.5)}>
        <rect x={-pw / 2} y={-ph / 2} width={pw} height={ph} rx={s.mode === "rough" ? 6 : 18} fill={s.mode === "iso" ? "#FFFFFF" : s.mode === "line" ? (s.id === "ivorygold" ? s.fillc : "#FFFFFF") : s.mode === "rough" ? s.fillc : "#FFFFFF"}
          stroke={hot > 0 ? s.hot : s.mode === "flat" ? "none" : s.ink} strokeWidth={hot > 0 ? 4 : 2} style={{filter: s.mode === "flat" || s.mode === "iso" ? "drop-shadow(0 8px 14px rgba(20,30,60,0.12))" : undefined}}/>
        <text x={-pw / 2 + 28} y={-ph / 2 + 46} fontFamily={s.tFont} fontSize={s.tSize * 0.9} fontWeight={s.tWeight} letterSpacing={s.tSpace} fill={s.tColor}>{n.title}</text>
        {n.rows.map((r: any, i: number) => { const y = -ph / 2 + 92 + i * 62, L = 260 * (r.v / max) * ease(f, t + 10 + i * 8, 22);
          const c = r.hi ? s.hot : s.mode === "flat" ? s.light : s.mode === "iso" ? s.fillc : s.ink;
          return <g key={r.name}>
            <text x={-pw / 2 + 28} y={y + 24} fontFamily={s.sFont} fontSize={s.sSize + 4} fontWeight={700} fill={s.tColor}>{r.name}</text>
            <rect x={-pw / 2 + 130} y={y} width={L} height={32} rx={s.mode === "rough" ? 2 : 6} fill={c} opacity={r.hi ? 1 : 0.85}/>
            <text x={-pw / 2 + 140 + L} y={y + 25} fontFamily={s.nFont} fontSize={s.sSize + 8} fontWeight={700} fill={r.hi ? s.hot : s.tColor} opacity={ease(f, t + 26 + i * 8, 8)}>{r.label}</text>
          </g>; })}
      </g>
    );
  }
  return (
    <g transform={`translate(${n.x} ${n.y})`}>
      {ring}
      <Frame s={s} p={pf} seed={seed}/>
      <g transform={`translate(0 ${iconY})`}><Icon name={n.icon} s={s} p={pi} seed={seed}/></g>
      <g opacity={pt} transform={`translate(0 ${(1 - pt) * 14})`}>
        {lines.map((l, i) => <text key={i} x={0} y={ty + i * (s.tSize + 4)} textAnchor="middle" fontFamily={s.tFont} fontSize={s.tSize} fontWeight={s.tWeight} letterSpacing={s.tSpace} fill={s.tColor}>{l}</text>)}
      </g>
      {n.num && f >= t + 18 && <text x={0} y={ty + lines.length * (s.tSize + 4) + s.nSize * 0.86} textAnchor="middle" fontFamily={s.nFont} fontSize={s.nSize} fontWeight={800} fill={s.nColor}>{countText(n.num, pn)}</text>}
      {n.sub && <text x={0} y={ty + lines.length * (s.tSize + 4) + (n.num ? s.nSize * 0.86 + s.sSize + 8 : s.sSize + 4)} textAnchor="middle" fontFamily={s.sFont} fontSize={s.sSize} fontStyle={s.sStyle} fill={s.sColor} opacity={ease(f, t + 26, 10)}>{n.sub}</text>}
    </g>
  );
};

// ---------- an edge ----------
const Edge: React.FC<{e: any; a: any; b: any; s: Skin; t: number; hot: number; seed: number}> = ({e, a, b, s, t, hot, seed}) => {
  const f = useF();
  // same column: a U-turn around the right side, clear of the node text
  const vertical = Math.abs(a.x - b.x) < 5, R = s.frame === "tile" ? 122 : 104, U = 105;
  const x1 = vertical ? a.x + R : a.x + Math.sign(b.x - a.x) * 112, y1 = a.y;
  const x2 = vertical ? b.x + R : b.x - Math.sign(b.x - a.x) * 112, y2 = b.y;
  const bend = s.edge.style === "curve" || s.edge.style === "dash" ? -46 : 0;
  const mx = vertical ? x2 + U : (x1 + x2) / 2, my = vertical ? y2 : (y1 + y2) / 2 + bend;
  const d = vertical ? `M ${x1} ${y1} C ${x1 + U} ${y1} ${x2 + U} ${y2} ${x2} ${y2}` : `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const rp = React.useMemo(() => s.edge.style === "rough" ? gen.toPaths(gen.path(d, {stroke: s.edge.color, strokeWidth: s.edge.width, roughness: 1.3, seed, bowing: 1})) : null, [s.id, d, seed]);
  if (f < t) return null;
  const p = ease(f, t, 16), col = hot > 0 ? s.hot : s.edge.color, w = s.edge.width + (hot > 0 ? 2 + Math.sin(f / 4) : 0);
  const ang = Math.atan2(y2 - my, x2 - mx);
  const head = p > 0.95 ? (s.edge.head === "arrow" ? <polygon points="0,0 -18,-9 -18,9" fill={hot > 0 ? s.hot : s.id === "navyred" ? s.accent : col} transform={`translate(${x2} ${y2}) rotate(${ang * 180 / Math.PI})`}/>
    : s.edge.head === "diamond" ? <polygon points="0,0 -9,-7 -18,0 -9,7" fill={col} transform={`translate(${x2} ${y2}) rotate(${ang * 180 / Math.PI})`}/>
    : <circle cx={x2} cy={y2} r={7} fill={col}/>) : null;
  const lx = vertical ? x1 + 28 : (x1 + x2) / 2, ly = vertical ? (y1 + y2) / 2 + 8 : (y1 + y2) / 2 + bend / 2 - 26;
  const lo = e.label ? ease(f, t + 12, 10) : 0;
  return (
    <g>
      {rp ? rp.map((q: any, i: number) => <path key={i} d={q.d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" stroke={hot > 0 ? s.hot : q.stroke} strokeWidth={w}/>)
        : <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" pathLength={1}
            strokeDasharray={s.edge.style === "dash" && p >= 1 ? "0.012 0.012" : "1 1"} strokeDashoffset={s.edge.style === "dash" && p >= 1 ? -f / 400 : 1 - p}/>}
      {head}
      {lo > 0 && (() => { const tw = e.label.length * s.lab.size * 0.62 + 28; return <g opacity={lo}>
        {s.lab.bg !== "transparent" && <rect x={lx - tw / 2} y={ly - s.lab.size - 4} width={tw} height={s.lab.size + 18} rx={(s.lab.size + 18) / 2} fill={hot > 0 && s.lab.bg !== "#FFFFFF" ? s.hot : s.lab.bg}
          style={{filter: s.mode === "iso" ? "drop-shadow(0 4px 8px rgba(20,30,60,0.15))" : undefined}}/>}
        <text x={lx} y={ly} textAnchor={vertical ? "start" : "middle"} fontFamily={s.lab.font} fontSize={s.lab.size} fontWeight={700} fontStyle={s.lab.italic ? "italic" : undefined} fill={s.lab.color}>{e.label}</text></g>; })()}
    </g>
  );
};

// ---------- background ----------
const Background: React.FC<{s: Skin}> = ({s}) => (
  <AbsoluteFill style={{background: s.bg}}>
    <svg width={W} height={H}>
      {s.texture === "dots" && Array.from({length: 48 * 27}, (_, i) => <circle key={i} cx={(i % 48) * 40 + 20} cy={Math.floor(i / 48) * 40 + 20} r={1.6} fill={s.ink} opacity={0.12}/>)}
      {s.texture === "ruled" && <>{Array.from({length: 30}, (_, i) => <line key={i} x1={0} y1={60 + i * 36} x2={W} y2={60 + i * 36} stroke="#BBD2EE" strokeWidth={1.2}/>)}<line x1={110} y1={0} x2={110} y2={H} stroke="#F1A3A3" strokeWidth={2}/></>}
      {s.texture === "paper" && <><defs><filter id="pn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.15  0 0 0 0.10 0"/></filter></defs><rect width={W} height={H} filter="url(#pn)"/>
        <rect x={28} y={28} width={W - 56} height={H - 56} fill="none" stroke={s.accent} strokeWidth={1.5} opacity={0.6}/></>}
    </svg>
  </AbsoluteFill>
);

const Captions: React.FC<{D: any; tl: any; s: Skin}> = ({D, tl, s}) => {
  const f = useF();
  const b = D.beats.find((x: B) => f >= tl.st[x.key] && f < tl.st[x.key] + beatFrames(x)); if (!b) return null;
  const lf = f - tl.st[b.key]; const tot = b.cues.reduce((a: number, c: string) => a + c.length, 0);
  let acc = 0, cur = b.cues[0];
  for (const c of b.cues) { cur = c; if (lf < (acc + c.length) / tot * b.sec * FPS) break; acc += c.length; }
  return <div style={{position: "absolute", left: 200, right: 200, bottom: 44, textAlign: "center"}}>
    <span style={{background: s.id === "ivorygold" ? "rgba(20,33,61,0.86)" : "rgba(27,32,48,0.82)", color: "#FFFFFF", fontFamily: SANS, fontSize: 36, lineHeight: 1.35, padding: "6px 16px", borderRadius: 8,
      boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{cur}</span></div>;
};

// ---------- the scene ----------
export const FlowScene: React.FC<{D: any; skin: string; audio?: boolean}> = ({D, skin, audio}) => {
  const f = useF(); const s = SKINS[skin]; const tl = timeline(D);
  const byId: Record<string, any> = Object.fromEntries(D.nodes.map((n: any) => [n.id, n]));
  const nodeT: Record<string, number> = Object.fromEntries(D.nodes.map((n: any) => [n.id, tl.at(n.at)]));
  const th = tl.at(D.highlight.at); const hot = f >= th ? ease(f, th, 12) : 0;
  const zoom = interpolate(f, [0, tl.total], [1.035, 1.0], clamp);
  const headFont = s.id === "sketch" ? HANDFONT : s.id === "ivorygold" ? SERIF : s.id === "flatvector" ? COND : SANS;
  return (
    <AbsoluteFill>
      <VoxFonts/>
      <Background s={s}/>
      <div style={{position: "absolute", left: s.id === "sketch" ? 140 : 60, top: 38, fontFamily: headFont, fontWeight: 700, fontSize: s.id === "flatvector" ? 40 : 30, letterSpacing: s.id === "ivorygold" ? 4 : 1, color: s.tColor, opacity: ease(f, 0, 15)}}>
        {D.title}{s.id === "navyred" && <div style={{width: 120, height: 5, background: s.accent, marginTop: 10}}/>}</div>
      <div style={{position: "absolute", right: 60, top: 44, fontFamily: headFont, fontSize: 22, color: s.tColor, opacity: 0.6}}>Moat &amp; Margin</div>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: "50% 45%"}}>
        <svg width={W} height={H}>
          {D.edges.map((e: any, i: number) => <Edge key={e.id} e={e} a={byId[e.a]} b={byId[e.b]} s={s} t={nodeT[e.b] - 12} seed={i + 21}
            hot={D.highlight.edges.includes(e.id) ? hot : 0}/>)}
          {D.nodes.map((n: any, i: number) => <Node key={n.id} n={n} s={s} t={nodeT[n.id]} seed={i + 3} hot={D.highlight.nodes.includes(n.id) && n.kind !== "panel" ? hot : n.kind === "panel" ? hot : 0}/>)}
        </svg>
      </AbsoluteFill>
      <div style={{position: "absolute", left: 60, bottom: 12, fontFamily: SANS, fontSize: 15, color: s.tColor, opacity: 0.55}}>{D.source}</div>
      <Captions D={D} tl={tl} s={s}/>
      {audio && D.beats.filter((b: B) => b.voiced).map((b: B) => <Sequence key={b.key} from={tl.st[b.key]} durationInFrames={beatFrames(b)}><Audio src={staticFile(`flow/${D.id}/${b.key}.mp3`)}/></Sequence>)}
    </AbsoluteFill>
  );
};

// Review sheet: each skin at mid-build and at the end, two per row.
const FlowSheet: React.FC<{D: any}> = ({D}) => {
  const tl = timeline(D); const frames = [Math.round(tl.at("f5|Bad loans") + 40), tl.total - 10];
  return (
    <AbsoluteFill style={{background: "#222"}}>
      {SKIN_IDS.map((sk, r) => frames.map((fr, c) => (
        <div key={`${sk}${c}`} style={{position: "absolute", left: c * 960, top: r * 570, width: 960, height: 570}}>
          <div style={{width: W, height: H, transform: "scale(0.5)", transformOrigin: "0 0", position: "absolute", overflow: "hidden"}}>
            <FrameCtx.Provider value={fr}><FlowScene D={D} skin={sk}/></FrameCtx.Provider>
          </div>
          <div style={{position: "absolute", top: 544, left: 8, fontFamily: "monospace", fontSize: 18, color: "#ddd"}}>{`${SKINS[sk].name} · ${c ? "end" : "mid"}`}</div>
        </div>)))}
    </AbsoluteFill>
  );
};

const FLOWS: any[] = [UBI100];
export const FlowCompositions: React.FC = () => (<>
  {FLOWS.map(D => SKIN_IDS.map(sk => (
    <Composition key={`${D.id}-${sk}`} id={`FLOW-${D.id}-${sk}`} component={() => <FlowScene D={D} skin={sk} audio/>} durationInFrames={timeline(D).total} fps={FPS} width={W} height={H}/>)))}
  {FLOWS.map(D => <Still key={`${D.id}-sheet`} id={`FLOW-${D.id}-sheet`} component={() => <FlowSheet D={D}/>} width={1920} height={570 * SKIN_IDS.length}/>)}
</>);
