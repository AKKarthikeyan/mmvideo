// Inventor's Desk, "night" look for P02 (AK chose it on 27 Oct 2026 after the three samples in sample.tsx):
// flat vector shapes on a deep navy gradient, glowing light, soft shadows, our own palette (brand cobalt, lamp amber, field cyan,
// paper cream). A Kurzgesagt-inspired genre look with no borrowed characters, logo or palette. Finished episodes keep the paper look.
import React from "react";
import {AbsoluteFill, Easing, useCurrentFrame} from "remotion";
import {FPS, H, HEAD, MONO, W, ease, lin, usePop} from "../kit";

export const K = {
  n0: "#0A1128", n1: "#142252", n2: "#1D3377", cobalt: "#2348E0", cobalt2: "#1B38B4", cyan: "#52D9F2", amber: "#FFB43B",
  hot: "#FF7A2F", coral: "#FF5C7A", steel: "#93A5D4", steelD: "#3B4C86", cream: "#F2EEE7", ink: "#121A3A", mute: "#8896C2",
};
export const DESK_TOP = 1385;               // frame y of the tabletop edge
export const DRAWER = {x: 540, y: 1500};    // frame coordinates of the drawer centre (the closing shrinks into it)

/** one hidden svg holding every gradient, so each scene can reference url(#...) */
export const GlobalDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <radialGradient id="pglow"><stop offset="0" stopColor={K.amber} stopOpacity="0.55"/><stop offset="1" stopColor={K.amber} stopOpacity="0"/></radialGradient>
      <radialGradient id="pcore" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FFF3C4"/><stop offset="0.45" stopColor={K.amber}/><stop offset="1" stopColor={K.hot}/></radialGradient>
      <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2C3C78"/><stop offset="0.5" stopColor="#4A5E9F"/><stop offset="1" stopColor="#26356B"/></linearGradient>
      <linearGradient id="coil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A6BFF"/><stop offset="1" stopColor={K.cobalt2}/></linearGradient>
      <linearGradient id="step" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A78FF"/><stop offset="1" stopColor={K.cobalt2}/></linearGradient>
      <linearGradient id="fieldfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.cyan} stopOpacity="0"/><stop offset="0.5" stopColor={K.cyan} stopOpacity="0.55"/><stop offset="1" stopColor={K.cyan} stopOpacity="0"/></linearGradient>
      <linearGradient id="deskg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B4468"/><stop offset="1" stopColor="#2A1A44"/></linearGradient>
      <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.amber} stopOpacity="0.32"/><stop offset="1" stopColor={K.amber} stopOpacity="0"/></linearGradient>
      <radialGradient id="bgglow"><stop offset="0" stopColor={K.cobalt} stopOpacity="0.5"/><stop offset="1" stopColor={K.cobalt} stopOpacity="0"/></radialGradient>
      <radialGradient id="eglow"><stop offset="0" stopColor={K.cyan} stopOpacity="0.5"/><stop offset="1" stopColor={K.cyan} stopOpacity="0"/></radialGradient>
      <radialGradient id="ecore" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#E9FBFF"/><stop offset="0.5" stopColor={K.cyan}/><stop offset="1" stopColor="#2B8FD6"/></radialGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={K.cyan} stopOpacity="0.22"/><stop offset="1" stopColor={K.cyan} stopOpacity="0.06"/></linearGradient>
    </defs>
  </svg>
);

/** night gradient, a slow blue glow, twinkling dust that drifts (never a border, never plain) */
export const Bg: React.FC<{glowY?: number}> = ({glowY = 1000}) => {
  const t = useCurrentFrame() / FPS;
  const span = H * 0.8;
  const dots = Array.from({length: 70}, (_, k) => {
    const r = Math.abs(Math.sin(k * 91.7)), q = Math.abs(Math.sin(k * 53.3)), s = Math.abs(Math.sin(k * 17.1));
    const x = (r * W + t * (4 + 9 * s)) % W;
    const y = (((q * span - t * (3 + 6 * r)) % span) + span) % span;
    const tw = 0.6 + 0.4 * Math.sin(t * (1 + 2 * s) + k);
    return <circle key={k} cx={x} cy={y} r={1.6 + 3.2 * s} fill={k % 5 === 0 ? K.amber : K.cyan} opacity={(0.1 + 0.32 * s) * tw}/>;
  });
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${K.n0} 0%, ${K.n1} 55%, ${K.n2} 100%)`}}>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <circle cx={540} cy={glowY} r={620 + 20 * Math.sin(t * 0.7)} fill="url(#bgglow)"/>
        <circle cx={-90} cy={430} r={330} fill="#16296B" opacity={0.5}/>
        <circle cx={1160} cy={1160} r={430} fill="#112259" opacity={0.55}/>
        {dots}
      </svg>
    </AbsoluteFill>
  );
};

/** the channel's desk in this look: dusky tabletop with a lit edge, the desk lamp (the mark), and a drawer front. Frame coordinates. */
export const Desk: React.FC = () => {
  const t = useCurrentFrame() / FPS; const top = DESK_TOP;
  const flick = 0.92 + 0.08 * Math.sin(t * 2.1);
  return (
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <polygon points={`776,${top - 176} 832,${top - 130} 905,${top + 130} 470,${top + 130}`} fill="url(#cone)" opacity={flick}/>
      <rect x={0} y={top} width={W} height={H - top} fill="url(#deskg)"/>
      <rect x={0} y={top} width={W} height={9} fill={K.amber} opacity={0.8}/>
      <DrawerFront shift={0}/>
      <ellipse cx={940} cy={top + 4} rx={78} ry={13} fill="#1B1233"/>
      <path d={`M 940 ${top} L 912 ${top - 118} L 862 ${top - 214}`} stroke="#C9CFE6" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx={912} cy={top - 118} r={13} fill="#E7EAF6"/>
      <polygon points={`872,${top - 262} 916,${top - 222} 832,${top - 130} 776,${top - 176}`} fill={K.cream}/>
      <polygon points={`776,${top - 176} 832,${top - 130} 822,${top - 120} 764,${top - 168}`} fill={K.amber}/>
      <circle cx={796} cy={top - 150} r={26} fill={K.amber} opacity={0.55 * flick}/>
    </svg>
  );
};
const DrawerFront: React.FC<{shift: number}> = ({shift}) => (
  <g transform={`translate(0 ${shift})`}>
    <rect x={DRAWER.x - 160} y={DRAWER.y - 34} width={320} height={68} rx={10} fill="#4D3262" stroke="#2A1A44" strokeWidth={4}/>
    <rect x={DRAWER.x - 150} y={DRAWER.y - 26} width={300} height={5} rx={2} fill="#6B4A86" opacity={0.7}/>
    <rect x={DRAWER.x - 30} y={DRAWER.y - 8} width={60} height={16} rx={8} fill={K.amber}/>
  </g>
);

/** closing, like the paper-look desk: the drawer opens with a warm glow, the scene shrinks into it, the drawer shuts, the label lights */
export const DeskClose: React.FC<{f0: number}> = ({f0}) => {
  const fr = useCurrentFrame();
  if (fr < f0) return null;
  const open = ease(fr, f0, f0 + 10) * (1 - ease(fr, f0 + 28, f0 + 38)), glow = open, label = ease(fr, f0 + 34, f0 + 42);
  return (
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <path d={`M ${DRAWER.x - 140} ${DRAWER.y - 30} L ${DRAWER.x - 300} ${DRAWER.y - 330} L ${DRAWER.x + 300} ${DRAWER.y - 330} L ${DRAWER.x + 140} ${DRAWER.y - 30} Z`} fill={K.amber} opacity={0.35 * glow}/>
      <rect x={DRAWER.x - 160} y={DRAWER.y - 34} width={320} height={68} rx={10} fill="#0F0A1E" opacity={open > 0.02 ? 1 : 0}/>
      <DrawerFront shift={26 * open}/>
      <text x={1030} y={1690} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={26} letterSpacing={4} fill={K.amber} opacity={0.45 + 0.55 * label}>THE INVENTOR’S DESK</text>
    </svg>
  );
};
/** the last scene shrinks into the drawer (frame-coordinate wrapper; put the Safe-wrapped scene inside) */
export const Shrink: React.FC<{f0: number; children: React.ReactNode}> = ({f0, children}) => {
  const fr = useCurrentFrame(); const k = ease(fr, f0 + 6, f0 + 28);
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${DRAWER.x}px ${DRAWER.y}px`, transform: `scale(${1 - 0.9 * k})`, opacity: 1 - ease(fr, f0 + 18, f0 + 30)}}>{children}</div>
  );
};

export const Bar: React.FC<{total: number; label?: string}> = ({total, label = "Antimatter trap"}) => {
  const fr = useCurrentFrame(); const s = Math.floor(fr / FPS);
  return (
    <div style={{position: "absolute", left: 64, right: 64, top: 86, fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: K.cream, textTransform: "uppercase"}}>
      <div style={{display: "flex", alignItems: "center", gap: 16}}>
        <span style={{background: K.cobalt, color: "#fff", padding: "4px 12px", borderRadius: 6, fontWeight: 600}}>Claim check</span>
        <span style={{fontWeight: 500}}>{label}</span>
        <span style={{marginLeft: "auto", color: K.mute}}>{`00:${String(s).padStart(2, "0")}`}</span>
      </div>
      <div style={{marginTop: 18, height: 4, background: "#26335F", borderRadius: 2}}>
        <div style={{width: `${Math.min(100, (fr / total) * 100)}%`, height: 4, background: K.amber, borderRadius: 2}}/>
      </div>
    </div>
  );
};
export const Source: React.FC<{text: string; o: number}> = ({text, o}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 1590, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: K.cream, opacity: 0.8 * o, textTransform: "uppercase"}}>{text}</div>
);

/** headline in page coordinates (inside Safe): words rise one by one; {braces} are amber. f0 may be negative so the hook is on screen from frame 0 */
export const KHead: React.FC<{lines: string[]; f0: number; y: number; size?: number; x?: number; stagger?: number}> = ({lines, f0, y, size = 104, x = 44, stagger = 3}) => {
  const pop = usePop(); let n = 0;
  return (
    <div style={{position: "absolute", left: x, top: y, fontFamily: HEAD, fontSize: size, lineHeight: 0.96, letterSpacing: -1, color: "#fff", textTransform: "uppercase", textShadow: "0 6px 0 rgba(5,10,40,0.45)"}}>
      {lines.map((ln, i) => (
        <div key={i} style={{whiteSpace: "nowrap"}}>
          {ln.split(" ").map((w, j) => {
            const hot = w.startsWith("{") || (w.endsWith("}") && ln.includes("{")); const p = pop(f0 + stagger * n++, 13, 190);
            return (
              <span key={j} style={{display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: "0.22em", paddingBottom: "0.08em"}}>
                <span style={{display: "inline-block", color: hot ? K.amber : undefined, transform: `translateY(${(1 - p) * 110}%)`}}>{w.replace(/[{}]/g, "")}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** a pill that pops in at frame f0 */
export const Pill: React.FC<{x: number; y: number; w?: number; text: string; f0: number; bg?: string; color?: string; size?: number; dashed?: boolean; rot?: number; shake?: number}> = ({x, y, w, text, f0, bg = K.cream, color = K.ink, size = 26, dashed, rot = 0, shake = 0}) => {
  const pop = usePop(); const p = pop(f0, 12, 200);
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, boxSizing: "border-box", opacity: Math.min(1, p * 2.5), transform: `translateX(${shake}px) rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "left center",
      background: dashed ? "transparent" : bg, color, border: dashed ? `4px dashed ${color}` : undefined, fontFamily: MONO, fontWeight: 600, fontSize: size, letterSpacing: 2,
      padding: `${size * 0.32}px ${size * 0.8}px`, borderRadius: 999, textTransform: "uppercase", whiteSpace: "nowrap", textAlign: "center", boxShadow: dashed ? undefined : "0 10px 24px rgba(3,8,30,0.4)"}}>{text}</div>
  );
};

/** the positron: a glowing amber ball with a plus sign; `ghost` is a faded passing twin */
export const Positron: React.FC<{x: number; y: number; r?: number; ghost?: boolean; pulse?: number}> = ({x, y, r = 26, ghost, pulse = 0}) => (
  <g transform={`translate(${x},${y})`} opacity={ghost ? 0.4 : 1}>
    <circle r={r * (3.4 + 0.25 * pulse)} fill="url(#pglow)"/>
    <circle r={r * 1.9} fill={K.amber} opacity={0.2}/>
    <circle r={r} fill="url(#pcore)"/>
    <circle cx={-r * 0.32} cy={-r * 0.36} r={r * 0.27} fill="#fff" opacity={0.85}/>
    <path d={`M ${-r * 0.42} ${r * 0.1} H ${r * 0.42} M 0 ${-r * 0.32} V ${r * 0.52}`} stroke="#7A3300" strokeWidth={r * 0.17} strokeLinecap="round" opacity={0.7}/>
  </g>
);

/** the trap, flat: steel vessel, two cobalt coils, dark chamber with field lines that flow, caps. Local coordinates, centre 0,0, 500 x 760. */
export const Trap: React.FC<{cx: number; cy: number; s: number; t: number; o?: number; children?: React.ReactNode}> = ({cx, cy, s, t, o = 1, children}) => (
  <g transform={`translate(${cx},${cy}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={396} rx={300} ry={24} fill="#000" opacity={0.38}/>
    <rect x={-250} y={-380} width={500} height={760} rx={120} fill="url(#steel)"/>
    <rect x={-270} y={-150} width={540} height={74} rx={37} fill="url(#coil)"/>
    <rect x={-270} y={76} width={540} height={74} rx={37} fill="url(#coil)"/>
    <rect x={-190} y={-322} width={380} height={644} rx={84} fill="#060B1F"/>
    <clipPath id="chamber"><rect x={-190} y={-322} width={380} height={644} rx={84}/></clipPath>
    <g clipPath="url(#chamber)">
      {[-140, -70, 0, 70, 140].map((x0) => (
        <path key={x0} d={`M ${x0} -330 C ${x0 * 1.3} -120 ${x0 * 1.3} 120 ${x0} 330`} stroke="url(#fieldfade)" strokeWidth={5} fill="none" strokeDasharray="16 22" strokeDashoffset={-t * 46}/>
      ))}
      <polygon points="-175,-300 -118,-300 -175,-110" fill="#fff" opacity={0.06}/>
    </g>
    <rect x={-190} y={-322} width={380} height={644} rx={84} fill="none" stroke={K.cyan} strokeOpacity={0.45} strokeWidth={5}/>
    <rect x={-120} y={-304} width={240} height={32} rx={16} fill={K.steel}/>
    <rect x={-120} y={272} width={240} height={32} rx={16} fill={K.steel}/>
    {children}
  </g>
);
export const Bob: React.FC<{x: number; y: number; o?: number}> = ({x, y, o = 1}) => (
  <g transform={`translate(${x},${y})`} fill={K.cream} opacity={0.65 * o}>
    <polygon points="0,-88 14,-66 -14,-66"/>
    <polygon points="0,88 14,66 -14,66"/>
  </g>
);
/** the dot's axial bob: it never touches the caps */
export const bob = (t: number, amp = 46, period = 2.6, ph = 0) => amp * Math.sin((2 * Math.PI * t) / period + ph);

/** pet-style name tag on a short string, swinging. text "" draws an empty tag with a "?" */
export const NameTag: React.FC<{text: string; t: number; drop: number; x?: number; y?: number}> = ({text, t, drop, x = 0, y = 40}) => {
  const sw = 7 * Math.sin(t * 2.4) * (1 - drop * 0.35);
  const fall = (1 - drop) * -120;
  return (
    <g transform={`translate(${x},${y + fall}) rotate(${sw} 0 0)`} opacity={Math.min(1, drop * 3)}>
      <path d="M 0 0 C 6 30 -4 50 0 70" stroke={K.cream} strokeWidth={4} fill="none"/>
      <circle cx={0} cy={72} r={9} fill="none" stroke={K.cream} strokeWidth={4}/>
      <rect x={-132} y={80} width={264} height={78} rx={39} fill={K.cream}/>
      <rect x={-122} y={90} width={244} height={58} rx={29} fill="none" stroke={K.coral} strokeWidth={3} strokeDasharray="6 8"/>
      <text x={0} y={text ? 130 : 135} textAnchor="middle" fontFamily={HEAD} fontSize={text ? 36 : 44} fill={K.ink} letterSpacing={2}>{text || "?"}</text>
    </g>
  );
};
export const clampN = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export {ease, lin};

/** one shot, like the kit's Cam, except `first` skips the entrance so the hook is fully on screen from frame 0 */
export const Shot: React.FC<{a: number; b: number; from?: "right" | "left" | "up"; push?: number; first?: boolean; children: React.ReactNode}> = ({a, b, from = "right", push = 0.06, first, children}) => {
  const fr = useCurrentFrame();
  if (fr < a - 1 || fr > b) return null;
  const i = first ? 1 : ease(fr, a - 1, a + 12), o = ease(fr, b - 8, b, 0, 1, Easing.bezier(0.55, 0, 0.75, 0.3));
  const d = 160, sx = from === "right" ? 1 : from === "left" ? -1 : 0, sy = from === "up" ? 1 : 0;
  const x = sx * ((1 - i) * d - o * d), y = sy * ((1 - i) * d - o * d * 0.6);
  const s = 1 + push * lin(fr, a, b) + (first ? 0 : (1 - i) * 0.04);
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, opacity: Math.min(i * 1.4, 1) * (1 - o), transformOrigin: "540px 1080px", transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${(1 - i) * sx * 1.2}deg)`}}>
      {children}
    </div>
  );
};
/** a short rise-and-fall, 0 -> 1 -> 0, for highlight pulses */
export const bump = (fr: number, a: number, up = 6, down = 16) => ease(fr, a, a + up) * (1 - ease(fr, a + up, a + up + down));
/** an electron: cyan ball with a minus sign */
export const Electron: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 17}) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r * 3} fill="url(#eglow)"/>
    <circle r={r} fill="url(#ecore)"/>
    <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.26} fill="#fff" opacity={0.85}/>
    <path d={`M ${-r * 0.42} ${r * 0.08} H ${r * 0.42}`} stroke="#0B3F78" strokeWidth={r * 0.17} strokeLinecap="round" opacity={0.75}/>
  </g>
);
