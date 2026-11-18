// The Inventor's Desk: the channel's "world" (AK, 24 Oct 2026). Rule zero: it must never delay or cover the opening hook.
// - DeskOpen sits BEHIND the hook art for the first ~1.5 s. Its drawer slides open with a warm glow, then the desk sinks
//   away. The hook headline and visual are untouched (they draw on top).
// - DeskShrink + DeskClose run in the silent tail after the voice ends: the last scene shrinks into the drawer, the drawer
//   shuts, and the desk is left with its label. That closing doubles as the loop back to frame 0.
import React from "react";
import {useCurrentFrame} from "remotion";
import {C, MONO, W, ease} from "./kit";

const WOOD = "#B9875A", WOOD_D = "#8A5F3C", WOOD_T = "#CFA172", DARK = "#2A1E14";
const DX = 380, DW = 320, DY = 1518, DH = 64, KX = 540, KY = 1550;   // drawer box and knob, page coordinates

const Desk: React.FC<{open: number; glow: number; label?: number}> = ({open, glow, label = 0}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <defs>
      <radialGradient id="deskglow" cx="50%" cy="100%" r="80%"><stop offset="0" stopColor="#FFE9A8" stopOpacity="0.9"/><stop offset="1" stopColor="#FFE9A8" stopOpacity="0"/></radialGradient>
    </defs>
    {glow > 0 && <path d={`M ${DX + 20} ${DY} L ${DX - 120} ${DY - 420} L ${DX + DW + 120} ${DY - 420} L ${DX + DW - 20} ${DY} Z`} fill="url(#deskglow)" opacity={glow}/>}
    <path d="M 70 1478 L 1010 1478 L 1040 1502 L 40 1502 Z" fill={WOOD_T} stroke={C.ink} strokeWidth={5}/>
    <rect x={50} y={1502} width={980} height={92} fill={WOOD} stroke={C.ink} strokeWidth={5}/>
    {[180, 900].map((x) => <line key={x} x1={x} y1={1508} x2={x} y2={1588} stroke={WOOD_D} strokeWidth={3}/>)}
    {/* drawer opening: dark cavity, then the drawer front pulled out toward the viewer */}
    <rect x={DX} y={DY} width={DW} height={DH} fill={DARK}/>
    <g transform={`translate(${KX},${DY + DH / 2 + 18 * open}) scale(${1 + 0.06 * open}) translate(${-KX},${-(DY + DH / 2)})`}>
      {open > 0.05 && <path d={`M ${DX + 6} ${DY} L ${DX + DW - 6} ${DY} L ${DX + DW - 14} ${DY - 22 * open} L ${DX + 14} ${DY - 22 * open} Z`} fill={WOOD_D} opacity={0.9}/>}
      <rect x={DX} y={DY} width={DW} height={DH} rx={6} fill={WOOD_T} stroke={C.ink} strokeWidth={5}/>
      <rect x={KX - 34} y={KY - 8} width={68} height={16} rx={8} fill="#E3C36A" stroke={C.ink} strokeWidth={3}/>
    </g>
    <text x={1010} y={1580} textAnchor="end" fontFamily={MONO} fontSize={20} fontWeight={600} letterSpacing={3} fill={WOOD_D} opacity={0.6 + 0.4 * label}>THE INVENTOR'S DESK</text>
  </svg>
);

/** behind the hook: drawer opens over frames 4-26, glow peaks then fades, desk sinks out by frame 50 */
export const DeskOpen: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr > 52) return null;
  const open = ease(fr, 4, 26), glow = ease(fr, 8, 22) * (1 - ease(fr, 26, 46)), sink = ease(fr, 34, 50);
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: 1920, transform: `translateY(${sink * 160}px)`, opacity: 1 - sink}}>
      <Desk open={open} glow={glow}/>
    </div>
  );
};

/** the final scene shrinks into the open drawer (from f0), fading as it goes */
export const DeskShrink: React.FC<{f0: number; children: React.ReactNode}> = ({f0, children}) => {
  const fr = useCurrentFrame(); const k = ease(fr, f0 + 6, f0 + 28);
  if (k <= 0) return <>{children}</>;
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: 1920, transformOrigin: `${KX}px ${DY + 10}px`, transform: `scale(${1 - 0.9 * k})`, opacity: 1 - ease(fr, f0 + 18, f0 + 30)}}>
      {children}
    </div>
  );
};

/** in front, during the silent tail: the desk rises, its drawer is open to receive the scene, then it shuts and the label lights */
export const DeskClose: React.FC<{f0: number}> = ({f0}) => {
  const fr = useCurrentFrame();
  if (fr < f0) return null;
  const rise = ease(fr, f0, f0 + 10), open = 1 - ease(fr, f0 + 28, f0 + 38), glow = ease(fr, f0 + 6, f0 + 18) * open;
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: 1920, transform: `translateY(${(1 - rise) * 160}px)`, opacity: rise}}>
      <Desk open={open} glow={glow} label={ease(fr, f0 + 34, f0 + 42)}/>
    </div>
  );
};
