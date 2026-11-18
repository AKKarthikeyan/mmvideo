// A02 "How do 5 Indian companies keep rivals out?" (4 Nov 2026): new code-drawn pieces for the castle with five gates, the hinge close-up, the crowd lanes,
// the draft-rules pool, the salary account, bus permits, the checklist and the end card. Vox Motion+ palette (tokens.ts). TIME: ticks (1/30 s), world px 1920x1080.
// Everything stays inside x 140..1780, y 80..1000 (5% safe area).
import React from "react";
import {AbsoluteFill} from "remotion";
import {Paper} from "./A01V4Parts";
import {Disc, XI, Cursor} from "./AsianPaintsPieces";
import {Stamp} from "./A01V4Parts";
import {Finish} from "./Texture";
import {SP} from "./A01V4Parts";
import {useAt} from "./A02Cue";
import {useTicks} from "./tokens";
import {C, F, H, W, clamp01, ease, inOut, outBack, outCubic, outQuint, spr} from "./tokens";

export const CUST = "#1F3BD6", REG = "#E6007E", GOLD = "#FFE81A", WALL = "#D9CDB4", WALLD = "#B9AC91", MOAT = "#9FC3D6", BROWN = "#6B4A2B";
export const GATES = [
  {n: "MARICO", icon: "bottle"}, {n: "DMART", icon: "shop"}, {n: "TCS", icon: "gear"}, {n: "IEX", icon: "bolt"}, {n: "CDSL", icon: "locker"},
] as const;

export const Pen: React.FC<{size?: number}> = ({size = 150}) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><path d="M 78 8 L 92 22 L 40 74 L 20 80 L 26 60 Z" fill="#FBF8F1" stroke="#0E0E0E" strokeWidth={5} strokeLinejoin="round"/>
    <path d="M 26 60 L 40 74 L 20 80 Z" fill={REG}/><path d="M 78 8 L 92 22" stroke={REG} strokeWidth={10}/></svg>
);
const GX = [330, 645, 960, 1275, 1590];

// ---------------------------------------------------------------------------------------------------
// the castle: wall with five gates, moat water, badges, hinges, marks
// ---------------------------------------------------------------------------------------------------
export type CastleProps = {
  f: number; at?: number;
  lit?: (number | null)[];                       // tick when gate i lights (null = unlit)
  names?: number | null;                         // tick when the five name badges pop (staggered); null = empty slots
  hinges?: {at: number; kinds: ("c" | "r" | "n")[]; pulse?: number[]; legend?: number};   // n = neutral grey
  marks?: {g: number; kind: "crack" | "pen" | "stamp"; at: number; text?: string}[];
  dim?: boolean; y?: number; num?: boolean;
};
export const CastleRow: React.FC<CastleProps> = ({f, at = 0, lit = [null, null, null, null, null], names = null, hinges, marks = [], dim, y = 0, num = true}) => {
  if (f < at) return null;
  const k = ease(f, at, at + 14, outQuint), wave = (i: number) => Math.sin(f * 0.11 + i * 0.9) * 6;
  return (
    <AbsoluteFill style={{opacity: k * (dim ? 0.55 : 1), transform: `translateY(${(1 - k) * 60 + y}px)`}}>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <rect x={150} y={840} width={1620} height={130} rx={20} fill={MOAT}/>
        {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${190 + i * 230} ${905 + wave(i)} q 40 -26 80 0 t 80 0`} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.7}/>)}
        <rect x={150} y={300} width={1620} height={545} fill={WALL}/>
        {Array.from({length: 14}).map((_, i) => <rect key={i} x={150 + i * 124} y={252} width={72} height={52} fill={WALL}/>)}
        <rect x={150} y={826} width={1620} height={20} fill={WALLD}/>
        {Array.from({length: 5}).map((_, i) => <line key={i} x1={150} x2={1770} y1={420 + i * 0} y2={420} stroke="none"/>)}
      </svg>
      {GATES.map((g, i) => {
        const x = GX[i], lt = lit[i], on = lt != null && f >= lt;
        const glow = on ? ease(f, lt as number, (lt as number) + 12, outQuint) : 0;
        const nm = names != null ? ease(f, names + i * 5, names + i * 5 + 8, outQuint) : 0;
        const showBadge = on || nm > 0;
        const hk = hinges ? hinges.kinds[i] : null, hv = hinges ? ease(f, hinges.at + i * 3, hinges.at + i * 3 + 8, outQuint) : 0;
        const pulse = hinges?.pulse?.includes(i) ? 0.5 + 0.5 * Math.sin(f * 0.35) : 0;
        const col = hk === "c" ? CUST : hk === "r" ? REG : "#7C746A";
        return (
          <React.Fragment key={i}>
            {num ? <div style={{position: "absolute", left: x - 100, width: 200, top: 318, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.inkSoft}}>GATE {i + 1}</div> : null}
            <div style={{position: "absolute", left: x - 78, top: 354, width: 156, height: 156, borderRadius: "50%", border: showBadge ? "none" : `5px dashed ${WALLD}`, background: showBadge ? C.white : "transparent",
              boxShadow: showBadge ? "0 3px 4px rgba(30,20,10,0.2), 0 12px 22px rgba(30,20,10,0.25)" : undefined, transform: `scale(${showBadge ? 0.6 + 0.4 * Math.max(glow, nm) : 1})`,
              display: "flex", alignItems: "center", justifyContent: "center", opacity: showBadge ? Math.max(glow, nm) : 1}}>
              {showBadge ? <XI name={g.icon as never} size={96}/> : null}
            </div>
            {showBadge ? <div style={{position: "absolute", left: x - 110, width: 220, top: 520, textAlign: "center", opacity: Math.max(glow, nm)}}>
              <span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 36, letterSpacing: 3, padding: "6px 16px"}}>{g.n}</span></div> : null}
            <div style={{position: "absolute", left: x - 95, top: 600, width: 190, height: 226, borderRadius: "95px 95px 0 0", background: on ? GOLD : BROWN,
              boxShadow: on ? `0 0 ${40 * glow}px ${GOLD}` : "inset 0 0 30px rgba(0,0,0,0.5)", border: `6px solid ${C.ink}`, borderBottom: "none"}}>
              {!on ? Array.from({length: 4}).map((_, j) => <div key={j} style={{position: "absolute", left: 14 + j * 40, top: 80, width: 4, height: 140, background: "rgba(0,0,0,0.35)"}}/>) : null}
            </div>
            {hinges && hv > 0 ? (
              <div style={{position: "absolute", left: x - 95 - 18, top: 700, width: 36, height: 36, borderRadius: "50%", background: pulse > 0 ? REG : col, border: `4px solid ${C.white}`,
                transform: `scale(${hv * (1 + 0.35 * pulse)})`, boxShadow: `0 0 ${14 + 26 * pulse}px ${pulse > 0 ? REG : col}`}}/>
            ) : null}
          </React.Fragment>
        );
      })}
      {marks.map((m, i) => {
        if (f < m.at) return null;
        const x = GX[m.g], s = spr(f, m.at, 10, 200);
        if (m.kind === "crack") return <svg key={i} width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
          <path d={`M ${x - 40} 600 l 22 50 l -26 40 l 30 60 l -18 40`} fill="none" stroke={C.markerRed} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={400} strokeDashoffset={400 * (1 - ease(f, m.at, m.at + 14, outCubic))}/></svg>;
        if (m.kind === "pen") return <div key={i} style={{position: "absolute", left: x + 30, top: 640 - (1 - s) * 80, transform: `rotate(-30deg) scale(${0.5 + 0.5 * s})`, opacity: clamp01(s * 3)}}>
          <Pen size={150}/></div>;
        return <Stamp key={i} f={f} at={m.at} text={m.text ?? "RIVALS TRIED"} x={x} y={640} size={44} rot={-8}/>;
      })}
      {hinges?.legend != null && f >= hinges.legend ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", gap: 70, opacity: ease(f, hinges.legend, hinges.legend + 10, outQuint),
          fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 2}}>
          <span><span style={{display: "inline-block", width: 28, height: 28, borderRadius: "50%", background: CUST, marginRight: 14}}/>CUSTOMERS HOLD IT</span>
          <span><span style={{display: "inline-block", width: 28, height: 28, borderRadius: "50%", background: REG, marginRight: 14}}/>REGULATOR HOLDS IT</span>
        </div>) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// HINGE close-up (new scene 1): one gate door, glowing hinge, who holds it
// ---------------------------------------------------------------------------------------------------
export const HingeUp: React.FC<{f: number; at?: number; gate: string; owner?: "c" | "r" | null; ownerAt?: number; label?: string; table?: string[]; penAt?: number; x?: number}> =
  ({f, at = 0, gate, owner = null, ownerAt = 0, label, table, penAt, x = 1000}) => {
    if (f < at) return null;
    const k = spr(f, at, 12, 160), col = owner === "r" ? REG : owner === "c" ? CUST : "#E0A100";
    const g = 0.5 + 0.5 * Math.sin(f * 0.3), ov = ease(f, ownerAt, ownerAt + 10, outQuint);
    return (
      <AbsoluteFill style={{opacity: clamp01(k * 3)}}>
        <div style={{position: "absolute", left: x - 230, top: 200, width: 460, height: 650, borderRadius: "230px 230px 0 0", background: GOLD, border: `10px solid ${C.ink}`, borderBottom: "none",
          boxShadow: "0 18px 40px rgba(30,20,10,0.35)", transform: `scale(${0.8 + 0.2 * k})`}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 56, letterSpacing: 5, color: C.ink}}>{gate}</div>
        </div>
        <div style={{position: "absolute", left: x - 230 - 6, top: 410, width: 70, height: 70, borderRadius: "50%", background: col, border: `8px solid ${C.white}`,
          boxShadow: `0 0 ${30 + 40 * g}px ${col}`, transform: "translate(-50%,-50%) translateX(34px)"}}/>
        <div style={{position: "absolute", left: x - 230 - 6, top: 600, width: 70, height: 70, borderRadius: "50%", background: col, border: `8px solid ${C.white}`,
          boxShadow: `0 0 ${30 + 40 * g}px ${col}`, transform: "translate(-50%,-50%) translateX(34px)"}}/>
        {owner ? (
          <div style={{position: "absolute", left: 150, top: 330, width: 330, opacity: ov, transform: `translateX(${(1 - ov) * -60}px)`, textAlign: "center"}}>
            <Disc f={f} at={ownerAt} name={owner === "r" ? "stamp" : "crowd"} x={165} y={90} size={190} bg={C.white}/>
            <div style={{marginTop: 210, fontFamily: F.sans, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: col, lineHeight: 1.15}}>{owner === "r" ? "A REGULATOR HOLDS IT" : "CUSTOMERS HOLD IT"}</div>
          </div>) : null}
        {label ? <div style={{position: "absolute", left: x + 270, top: 260, width: 440, fontFamily: F.serif, fontSize: 72, lineHeight: 1.05, color: C.ink}}>{label}</div> : null}
        {table ? (
          <div style={{position: "absolute", left: x + 270, top: 470, width: 470, background: "#FBF8F1", boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)", padding: "20px 28px",
            opacity: ease(f, at + 14, at + 24, outQuint)}}>
            {table.map((t, i) => <div key={i} style={{fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 40, lineHeight: 1.5, borderBottom: "2px dotted #BDB5A6", color: C.ink}}>{t}</div>)}
            {penAt != null && f >= penAt ? <div style={{position: "absolute", right: -30, top: -70, transform: `rotate(-25deg) translateY(${(1 - spr(f, penAt, 12, 170)) * -80}px)`}}><Pen size={170}/></div> : null}
          </div>) : null}
      </AbsoluteFill>
    );
  };

// ---------------------------------------------------------------------------------------------------
// CROWD (new scene 2): two market lanes, one packed, one bare
// ---------------------------------------------------------------------------------------------------
const Person: React.FC<{x: number; y: number; c: string; s?: number; o?: number}> = ({x, y, c, s = 1, o = 1}) => (
  <div style={{position: "absolute", left: x - 22 * s, top: y - 62 * s, width: 44 * s, height: 90 * s, opacity: o}}>
    <div style={{position: "absolute", left: 6 * s, top: 0, width: 32 * s, height: 32 * s, borderRadius: "50%", background: c}}/>
    <div style={{position: "absolute", left: 0, top: 36 * s, width: 44 * s, height: 54 * s, borderRadius: `${22 * s}px ${22 * s}px 6px 6px`, background: c}}/>
  </div>);
export const Crowd: React.FC<{f: number; at?: number; flowAt?: number; arrowsAt?: number; boltAt?: number; screenAt?: number; stampAt?: number}> =
  ({f, at = 0, flowAt = 14, arrowsAt, boltAt, screenAt, stampAt}) => {
    if (f < at) return null;
    const k = ease(f, at, at + 12, outQuint), cols = ["#1F3BD6", "#E0245E", "#2E8B57", "#E2B13C", "#6B4E9B", "#2E8C8A"];
    return (
      <AbsoluteFill style={{opacity: k}}>
        <div style={{position: "absolute", left: 150, top: 250, width: 800, height: 640, background: "#EFE6CF", border: `6px solid ${C.ink}`}}/>
        <div style={{position: "absolute", left: 970, top: 250, width: 800, height: 640, background: "#EFE6CF", border: `6px dashed ${C.grey}`}}/>
        <div style={{position: "absolute", left: 150, top: 262, width: 800, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 4}}>PACKED</div>
        <div style={{position: "absolute", left: 970, top: 262, width: 800, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 4, color: C.grey}}>EMPTY</div>
        {Array.from({length: 18}).map((_, i) => {
          const tx = 210 + (i % 6) * 120, ty = 450 + Math.floor(i / 6) * 120, t0 = flowAt + i * 2;
          const p = ease(f, t0, t0 + 18, outCubic), sx = i % 2 ? 1900 : 0;
          return <Person key={i} x={sx + (tx - sx) * p} y={ty + Math.sin((f + i * 5) * 0.2) * 4} c={cols[i % 6]} o={clamp01(p * 3)}/>;
        })}
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: "absolute", left: 1030 + i * 180, top: 330, width: 130, height: 60, background: "#C9BFA6", borderRadius: 4}}/>)}
        {screenAt != null && f >= screenAt ? (
          <div style={{position: "absolute", left: 1370 - 120, top: 560, transform: `scale(${spr(f, screenAt, 10, 180)})`, opacity: 1}}>
            <div style={{width: 240, height: 160, background: "linear-gradient(135deg,#7FD7FF,#2A7FFF)", border: `8px solid ${C.ink}`, borderRadius: 10, boxShadow: "0 0 40px #7FD7FF"}}/>
            <div style={{width: 60, height: 36, background: C.ink, margin: "0 auto"}}/><div style={{width: 140, height: 12, background: C.ink, margin: "0 auto"}}/>
            <div style={{textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 34, marginTop: 14, color: C.inkSoft, letterSpacing: 2}}>RIVAL'S NEW SCREEN</div>
          </div>) : null}
        {arrowsAt != null && f >= arrowsAt ? (
          <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: ease(f, arrowsAt, arrowsAt + 10, outQuint)}}>
            <defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={C.markerRed}/></marker></defs>
            <path d="M 420 930 C 520 980 640 980 740 930" fill="none" stroke={C.markerRed} strokeWidth={9} markerEnd="url(#ah)"/>
            <path d="M 740 235 C 640 190 520 190 420 235" fill="none" stroke={C.markerRed} strokeWidth={9} markerEnd="url(#ah)"/>
          </svg>) : null}
        {boltAt != null && f >= boltAt ? (
          <div style={{position: "absolute", left: 1370, top: 560}}>
            <div style={{position: "absolute", left: -330, top: -40, width: 660, background: "#FBF8F1", border: `5px solid ${C.ink}`, padding: "14px 30px", fontFamily: F.sans, fontWeight: 900, fontSize: 44, textAlign: "center", boxShadow: "0 12px 24px rgba(0,0,0,0.25)"}}>TOMORROW</div>
            <div style={{position: "absolute", left: -60, top: -230 + 250 * ease(f, boltAt, boltAt + 18, outCubic) - 160 * ease(f, boltAt + 22, boltAt + 40, inOut), opacity: 1 - ease(f, boltAt + 26, boltAt + 40, inOut)}}>
              <XI name="bolt" size={120} color="#E0A100"/></div>
            <div style={{position: "absolute", left: -330, top: 70, width: 660, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 48, color: C.markerRed, letterSpacing: 3, opacity: ease(f, boltAt + 30, boltAt + 40, outQuint)}}>NOT STORED</div>
          </div>) : null}
        {stampAt != null ? <Stamp f={f} at={stampAt} text="NO CROWD" x={1370} y={830} size={70} rot={-5}/> : null}
      </AbsoluteFill>
    );
  };

// ---------------------------------------------------------------------------------------------------
// POOL: draft rules pool the bids of every exchange; the crowd gathers in the shared pool
// ---------------------------------------------------------------------------------------------------
export const Pool: React.FC<{f: number; at?: number; flowAt?: number; crowdAt?: number}> = ({f, at = 0, flowAt = 14, crowdAt}) => {
  if (f < at) return null;
  const k = ease(f, at, at + 12, outQuint), xs = [480, 960, 1440], cm = crowdAt != null ? ease(f, crowdAt, crowdAt + 40, inOut) : 0;
  return (
    <AbsoluteFill style={{opacity: k}}>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {xs.map((x, i) => <path key={i} d={`M ${x - 110} 330 L ${x + 110} 330 L ${960 + 60} 640 L ${960 - 60} 640 Z`} fill="rgba(31,59,214,0.14)" stroke={i === 1 ? CUST : C.grey} strokeWidth={6}/>)}
        <ellipse cx={960} cy={800} rx={420} ry={120} fill={MOAT} stroke={C.ink} strokeWidth={6}/>
        {Array.from({length: 18}).map((_, i) => {
          const x0 = xs[i % 3] + ((i * 37) % 120) - 60, p = clamp01(((f - flowAt) * 0.03 + i / 18) % 1), x = x0 + (960 - x0) * p, y = 340 + (700 - 340) * p;
          return f > flowAt ? <circle key={i} cx={x} cy={y} r={11} fill={C.markerRed} opacity={0.9}/> : null;
        })}
      </svg>
      {xs.map((x, i) => <Disc key={i} f={f} at={at + 2 + i * 3} name={i === 1 ? "bolt" : "shop"} x={x} y={260} size={130} dim={i === 1 ? 0 : 0.5}/>)}
      <div style={{position: "absolute", left: 960 - 260, width: 520, top: 770, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 52, letterSpacing: 4, color: C.ink}}>GRID-INDIA</div>
      <div style={{position: "absolute", left: 960 - 260, width: 520, top: 850, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: C.inkSoft}}>ONE PRICE · ONE OPERATOR</div>
      {crowdAt != null ? [0, 1, 2, 3, 4, 5].map((i) => <Person key={i} x={xs[1] - 120 + i * 48 + (960 - xs[1]) * 0 + (700 - 0) * 0 + (cm * (i * 30 - 80))} y={330 + cm * 430} c="#1F3BD6" s={0.8} o={cm > 0 ? 1 : 0}/>) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// SALARY ACCOUNT (made-up example): bills hang off one account
// ---------------------------------------------------------------------------------------------------
export const SalaryAcct: React.FC<{f: number; at?: number; billsAt?: number[]; hesitateAt?: number; redAt?: number}> = ({f, at = 0, billsAt = [10, 16, 22], hesitateAt, redAt}) => {
  if (f < at) return null;
  const k = spr(f, at, 12, 160), red = redAt != null ? ease(f, redAt, redAt + 12, outQuint) : 0, col = red > 0.5 ? C.markerRed : C.ink;
  const bills = [{t: "RENT", x: 360, y: 760}, {t: "EMI", x: 960, y: 800}, {t: "LIGHT BILL", x: 1560, y: 760}];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {bills.map((b, i) => <line key={i} x1={960} y1={420} x2={b.x} y2={b.y - 70} stroke={col} strokeWidth={8} strokeDasharray="14 10" opacity={ease(f, at + billsAt[i], at + billsAt[i] + 10, outQuint)}/>)}
      </svg>
      <div style={{position: "absolute", left: 960 - 330, top: 270, width: 660, height: 200, background: "#FBF8F1", boxShadow: "0 4px 8px rgba(30,20,10,0.2), 0 18px 34px rgba(30,20,10,0.28)", textAlign: "center",
        transform: `scale(${0.7 + 0.3 * k})`, opacity: clamp01(k * 3), border: red > 0 ? `8px solid ${C.markerRed}` : "none"}}>
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 60, letterSpacing: 3, marginTop: 36}}>SALARY ACCOUNT</div>
        <div style={{fontFamily: F.mono, fontSize: 34, color: C.inkSoft, marginTop: 10}}>XXXX XXXX 0042</div>
      </div>
      {bills.map((b, i) => {
        const p = ease(f, at + billsAt[i] + 4, at + billsAt[i] + 16, outBack);
        return <div key={i} style={{position: "absolute", left: b.x - 190, top: b.y - 70, width: 380, height: 140, background: red > 0.5 ? "#FFD6DE" : "#FBF8F1", boxShadow: "0 3px 5px rgba(30,20,10,0.2), 0 14px 26px rgba(30,20,10,0.25)",
          textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 52, lineHeight: "140px", transform: `scale(${p})`, opacity: clamp01(p * 3), color: C.ink}}>{b.t}</div>;
      })}
      {hesitateAt != null ? (
        <>
          <div style={{position: "absolute", left: 1330, top: 330, width: 330, height: 90, background: CUST, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 34, letterSpacing: 2, textAlign: "center",
            lineHeight: "90px", borderRadius: 12, opacity: ease(f, hesitateAt, hesitateAt + 8, outQuint)}}>CHANGE ACCOUNT</div>
          <Cursor f={f} x={1470} y={420} at={hesitateAt} s={1.1}/>
        </>) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// BUSES (made-up example): two permits, the third bus waits at a closed gate
// ---------------------------------------------------------------------------------------------------
const Bus: React.FC<{x: number; y: number; c: string; permit?: boolean; dim?: boolean}> = ({x, y, c, permit, dim}) => (
  <div style={{position: "absolute", left: x - 190, top: y - 110, width: 380, height: 220, opacity: dim ? 0.55 : 1}}>
    <div style={{position: "absolute", left: 0, top: 0, width: 380, height: 170, background: c, borderRadius: 24, border: `6px solid ${C.ink}`}}/>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: "absolute", left: 24 + i * 86, top: 24, width: 66, height: 60, background: "#DDEFF7", border: `4px solid ${C.ink}`}}/>)}
    <div style={{position: "absolute", left: 50, top: 150, width: 70, height: 70, borderRadius: "50%", background: C.ink}}/><div style={{position: "absolute", left: 260, top: 150, width: 70, height: 70, borderRadius: "50%", background: C.ink}}/>
    {permit ? <div style={{position: "absolute", left: 100, top: 96, border: `5px solid #2E8B57`, color: "#2E8B57", fontFamily: F.sans, fontWeight: 900, fontSize: 36, padding: "0 12px", background: "rgba(255,255,255,0.8)", transform: "rotate(-4deg)"}}>PERMIT</div> : null}
  </div>);
export const Buses: React.FC<{f: number; at?: number; thirdAt: number}> = ({f, at = 0, thirdAt}) => {
  if (f < at) return null;
  const p1 = ease(f, at, at + 14, outQuint), p3 = ease(f, thirdAt, thirdAt + 16, outQuint), bar = ease(f, thirdAt + 10, thirdAt + 22, outBack);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 150, right: 150, top: 700, height: 24, background: C.ink}}/>
      <div style={{opacity: p1, transform: `translateX(${(1 - p1) * -700}px)`}}><Bus x={500} y={560} c="#E2B13C" permit/><Bus x={1010} y={560} c="#2E8C8A" permit/></div>
      <div style={{opacity: p3, transform: `translateX(${(1 - p3) * 600}px)`}}><Bus x={1560} y={560} c="#9A948A" dim/></div>
      <div style={{position: "absolute", left: 1330, top: 340 + (1 - bar) * -100, width: 14, height: 380, background: C.markerRed, opacity: bar}}/>
      <div style={{position: "absolute", left: 1210, width: 540, top: 780, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 56, letterSpacing: 3, color: C.markerRed, opacity: bar}}>NO PERMIT, NO BUS</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// small props: checklist, coconut, week picks, jars, contract, locker row, store fronts
// ---------------------------------------------------------------------------------------------------
export const Checklist: React.FC<{f: number; at?: number; items: {t: string; at: number; tick?: number; reg?: boolean}[]; x?: number; y?: number}> = ({f, at = 0, items, x = 960, y = 540}) => {
  if (f < at) return null;
  const p = outQuint(clamp01((f - at) / 12));
  return (
    <div style={{position: "absolute", left: x - 640, top: y - 60 - items.length * 62, width: 1280, background: "#FBF8F1", padding: "34px 56px", boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)",
      transform: `translateY(${(1 - p) * 700}px)`}}>
      {items.map((it, i) => {
        const o = ease(f, it.at, it.at + 8, outQuint), tk = it.tick != null ? ease(f, it.tick, it.tick + 8, outBack) : 0;
        return (
          <div key={i} style={{display: "flex", alignItems: "center", gap: 28, height: 124, borderBottom: "2px dotted #BDB5A6", opacity: o}}>
            <div style={{width: 64, height: 64, border: `6px solid ${C.ink}`, position: "relative", flex: "none"}}>
              {tk > 0 ? <svg width={64} height={64} style={{position: "absolute", left: -6, top: -6}}><path d="M 10 34 L 28 52 L 62 8" fill="none" stroke={it.reg ? REG : "#2E8B57"} strokeWidth={10} strokeDasharray={90} strokeDashoffset={90 * (1 - tk)}/></svg> : null}
            </div>
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: 1}}>{it.t}</div>
          </div>);
      })}
    </div>);
};
export const Coconut: React.FC<{f: number; at: number; x: number; y: number; s?: number}> = ({f, at, x, y, s = 1}) => {
  if (f < at) return null;
  const k = spr(f, at, 10, 180);
  return <div style={{position: "absolute", left: x - 90 * s, top: y - 90 * s, width: 180 * s, height: 180 * s, borderRadius: "50%", background: "#5B3A1E", border: `6px solid ${C.ink}`, transform: `scale(${k})`, opacity: clamp01(k * 3)}}>
    {[[50, 56], [102, 56], [76, 100]].map(([a, b], i) => <div key={i} style={{position: "absolute", left: a * s, top: b * s, width: 26 * s, height: 26 * s, borderRadius: "50%", background: "#2A180A"}}/>)}</div>;
};
export const WeekPick: React.FC<{f: number; at?: number; weekAts: number[]}> = ({f, at = 0, weekAts}) => {
  if (f < at) return null;
  const cols = ["#E0245E", "#2E8B57", "#E2B13C"];
  return (
    <AbsoluteFill>
      {weekAts.map((w, i) => {
        const p = ease(f, w, w + 12, outBack), x = 330 + i * 420, tk = ease(f, w + 8, w + 18, outBack);
        return (
          <div key={i} style={{position: "absolute", left: x - 180, top: 270, width: 360, height: 560, background: "#FBF8F1", boxShadow: "0 4px 8px rgba(30,20,10,0.2), 0 18px 34px rgba(30,20,10,0.26)", transform: `translateY(${(1 - p) * -500}px) rotate(${(i - 1.5) * 1.5}deg)`, opacity: clamp01(p * 3)}}>
            <div style={{background: C.markerRed, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 44, letterSpacing: 4, textAlign: "center", padding: "10px 0"}}>WEEK {i + 1}</div>
            {cols.map((c, j) => <div key={j} style={{position: "absolute", left: 40 + j * 100, top: 190, width: 82, height: 110, background: c, border: `5px solid ${C.ink}`, opacity: j === 1 ? 1 : 0.4}}/>)}
            <svg width={360} height={200} style={{position: "absolute", left: 0, top: 330}}><path d="M 120 100 L 160 140 L 240 30" fill="none" stroke="#2E8B57" strokeWidth={16} strokeDasharray={200} strokeDashoffset={200 * (1 - tk)}/></svg>
          </div>);
      })}
    </AbsoluteFill>);
};
export const Jars: React.FC<{f: number; at?: number; passAt: number}> = ({f, at = 0, passAt}) => {
  if (f < at) return null;
  const k = ease(f, at, at + 12, outQuint), pass = ease(f, passAt, passAt + 30, inOut);
  const jar = (x: number, label: string, n: number, c: string) => (
    <div style={{position: "absolute", left: x - 200, top: 330, width: 400, height: 460, opacity: k}}>
      <div style={{position: "absolute", inset: 0, border: `8px solid ${C.ink}`, borderRadius: "30px 30px 60px 60px", background: "rgba(255,255,255,0.5)"}}/>
      {Array.from({length: n}).map((_, i) => <div key={i} style={{position: "absolute", left: 50 + (i % 4) * 78, top: 360 - Math.floor(i / 4) * 66, width: 64, height: 64, borderRadius: "50%", background: c, border: `4px solid ${C.ink}`}}/>)}
      <div style={{position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 48, letterSpacing: 3}}>{label}</div>
    </div>);
  return <AbsoluteFill>{jar(560, "KEEP", 8 - Math.round(4 * pass), "#E2B13C")}{jar(1360, "PASS ON", Math.round(4 * pass), "#E2B13C")}</AbsoluteFill>;
};
export const Contract: React.FC<{f: number; at?: number; wrapAt: number; tagShrinkAt: number}> = ({f, at = 0, wrapAt, tagShrinkAt}) => {
  if (f < at) return null;
  const k = ease(f, at, at + 10, outQuint), w = ease(f, wrapAt, wrapAt + 30, inOut), sh = ease(f, tagShrinkAt, tagShrinkAt + 20, inOut);
  return (
    <AbsoluteFill style={{opacity: k}}>
      {Array.from({length: 9}).map((_, i) => <Person key={i} x={420 + i * 135} y={620} c={i % 2 ? "#1F3BD6" : "#2E8C8A"} s={1.3}/>)}
      <div style={{position: "absolute", left: 960 - 640, top: 330, width: 1280, height: 120 + 330 * w, background: "#FBF8F1", border: `6px solid ${C.ink}`, boxShadow: "0 18px 34px rgba(30,20,10,0.3)", opacity: 0.55 + 0.4 * (1 - w), overflow: "hidden"}}>
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 50, letterSpacing: 4, textAlign: "center", marginTop: 22}}>MULTI-YEAR AGREEMENT</div>
        {[0, 1, 2].map((i) => <div key={i} style={{height: 8, background: "rgba(40,30,20,0.3)", margin: "28px 90px"}}/>)}
      </div>
      <div style={{position: "absolute", left: 1480, top: 270 + 40 * sh, transform: `scale(${1 - 0.45 * sh})`, transformOrigin: "50% 0", background: "#F2DDA8", border: `5px solid ${C.ink}`, padding: "8px 26px", fontFamily: F.sans, fontWeight: 900, fontSize: 56}}>₹1 LAKH</div>
    </AbsoluteFill>);
};
export const Lockers: React.FC<{f: number; at?: number; tagsAt: number}> = ({f, at = 0, tagsAt}) => {
  if (f < at) return null;
  const k = ease(f, at, at + 12, outQuint), t = ease(f, tagsAt, tagsAt + 10, outQuint);
  return (
    <AbsoluteFill style={{opacity: k}}>
      {Array.from({length: 24}).map((_, i) => <div key={i} style={{position: "absolute", left: 300 + (i % 8) * 170, top: 400 + Math.floor(i / 8) * 150, width: 150, height: 130, background: "#8FA1AC", border: `5px solid ${C.ink}`}}>
        <div style={{position: "absolute", right: 18, top: 54, width: 16, height: 16, borderRadius: "50%", background: C.ink}}/></div>)}
      {["CDSL", "NSDL"].map((n, i) => <div key={n} style={{position: "absolute", left: 640 + i * 640 - 140, width: 280, top: 270, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * -40}px)`}}>
        <span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 56, letterSpacing: 4, padding: "6px 24px"}}>{n}</span></div>)}
    </AbsoluteFill>);
};
export const ShareLocker: React.FC<{f: number; at?: number}> = ({f, at = 0}) => {
  if (f < at) return null;
  const k = spr(f, at, 12, 160), d = ease(f, at + 14, at + 30, outQuint);
  return (
    <AbsoluteFill style={{opacity: clamp01(k * 3)}}>
      <div style={{position: "absolute", left: 960 - 190, top: 280, width: 380, height: 520, background: "#8FA1AC", border: `8px solid ${C.ink}`, transform: `scale(${0.8 + 0.2 * k})`}}>
        <div style={{position: "absolute", right: 36, top: 220, width: 30, height: 30, borderRadius: "50%", background: C.ink}}/>
        <div style={{position: "absolute", left: 50, top: 90 + (1 - d) * 120, width: 280, height: 200, background: "#FBF8F1", border: `5px solid ${C.ink}`, fontFamily: F.sans, fontWeight: 900, fontSize: 40, textAlign: "center", lineHeight: "200px", opacity: d}}>YOUR SHARES</div>
      </div>
    </AbsoluteFill>);
};
export const Shops: React.FC<{f: number; at?: number; ghostFrom?: number; ifAt?: number}> = ({f, at = 0, ghostFrom = 5, ifAt}) => {
  if (f < at) return null;
  return (
    <AbsoluteFill>
      {Array.from({length: 9}).map((_, i) => {
        const p = ease(f, at + i * 3, at + i * 3 + 10, outBack), ghost = i >= ghostFrom;
        return <div key={i} style={{position: "absolute", left: 220 + i * 170 - 70, top: 420, width: 140, height: 190, opacity: clamp01(p * 3) * (ghost ? 0.55 : 1), transform: `scale(${p})`, border: ghost ? `6px dashed ${C.grey}` : "none", borderRadius: 10}}>
          <XI name="store" size={130} color={ghost ? C.grey : C.ink}/></div>;
      })}
      {ifAt != null ? <div style={{position: "absolute", left: 220 + ghostFrom * 170 - 100, width: (9 - ghostFrom) * 170 + 40, top: 650, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 56, color: C.markerRed, letterSpacing: 3, opacity: ease(f, ifAt, ifAt + 10, outQuint)}}>NEW STORES: DO THEY FILL?</div> : null}
    </AbsoluteFill>);
};
export const Clients: React.FC<{f: number; at?: number; dotAt: number}> = ({f, at = 0, dotAt}) => {
  if (f < at) return null;
  const k = ease(f, at, at + 12, outQuint), d = ease(f, dotAt, dotAt + 10, outQuint);
  return (
    <AbsoluteFill style={{opacity: k}}>
      <div style={{position: "absolute", left: 200, top: 360, width: 760, height: 420, border: `8px solid ${C.ink}`, borderRadius: 30, background: "rgba(255,255,255,0.45)"}}/>
      {Array.from({length: 5}).map((_, i) => <Person key={i} x={300 + i * 130} y={600} c="#1F3BD6" s={1.4}/>)}
      <div style={{position: "absolute", left: 200, width: 760, top: 300, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 3}}>LOCK: CLIENTS INSIDE</div>
      <div style={{position: "absolute", left: 1060, top: 360, width: 660, height: 420, border: `8px dashed ${C.grey}`, borderRadius: 30, opacity: d}}/>
      <div style={{position: "absolute", left: 1060, width: 660, top: 530, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 48, color: C.grey, opacity: d, letterSpacing: 3}}>NEXT CONTRACT?</div>
    </AbsoluteFill>);
};
export const EndCard: React.FC<{f: number; d: number}> = ({f, d}) => {
  const a = ease(f, 4, 16, outQuint), b = ease(f, 12, 24, outQuint), s = ease(f, 30, 40, outBack);
  return (
    <AbsoluteFill>
      <Paper drift={f / d}/>
      {[{t: "WHAT IS PRICING POWER?", s: "NEXT", p: a, x: 520, c: "#FFE81A"}, {t: "GREAT, GOOD, GRUESOME", s: "ALSO WATCH", p: b, x: 1400, c: "#1F3BD6"}].map((c, i) => (
        <div key={i} style={{position: "absolute", left: c.x - 340, top: 250 + (1 - c.p) * 300, width: 680, height: 382, background: c.c, border: `8px solid ${C.ink}`, boxShadow: "0 18px 34px rgba(30,20,10,0.35)", opacity: c.p,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: i ? C.white : C.ink}}>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4}}>{c.s}</div>
          <div style={{fontFamily: F.serif, fontSize: 82, lineHeight: 1.05, textAlign: "center", padding: "0 30px"}}>{c.t}</div>
        </div>))}
      <div style={{position: "absolute", left: 960 - 250, top: 740, width: 500, height: 110, background: C.markerRed, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 60, letterSpacing: 4, textAlign: "center",
        lineHeight: "110px", borderRadius: 14, transform: `scale(${s})`, opacity: clamp01(s * 2)}}>SUBSCRIBE</div>
      <Finish f={f}/>
    </AbsoluteFill>);
};

export const mk = (render: (f: number, a: (k: string, x?: number | string) => number, d: number, s0: number) => React.ReactNode): React.FC<SP> =>
  ({s0, d}) => {
    const f = useTicks(), a = useAt(s0);
    return <>{render(f, a, d, s0)}</>;
  };
