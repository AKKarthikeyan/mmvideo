// Template sample (5 Oct 2026): one long video that uses all seven new templates, built on scripts/tpl_sample.py.
// Templates (ideas from the awesome-opus5-5-videos collection, rebuilt in our engine; no code or assets copied):
//   dive     Filing Dive: one continuous zoom from 25 filings to one page, one table, two lines, with a scale ruler
//   words    Load-Bearing Words: the sentence is the structure (LOANS is the load, DEPOSITS the floor)
//   pour     The Pour: a glass of new loans, filled by a jug of new deposits; the rest is hatched
//   rupee    Follow the Rupee: a coin character walks through the bank
//   notebook Pencil Data Notebook: hand-drawn dumbbell chart of 25 banks, slight chromatic aberration
//   morph    One-Shape Morph: one card that never cuts, each state a number
//   build    Build Log: deposit towers drawn as blueprints, then built floor by floor with slammed dates
// Plus kinetic (spine and re-hooks), ledger3 (known / unknown / watch) and end. Every number on screen comes from the
// script's scene params or data.json (ledger-checked), never hard-coded here.
import React from "react";
import {AbsoluteFill, Audio, Composition, Easing, Img, Sequence, Still, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import rough from "roughjs/bin/rough";
import {C, COND, TYPE, VoxDefs, VoxFonts} from "../voxkit";
import {HANDFONT} from "../handkit";
import D from "../../public/tpl/tplsample/data.json";

const FPS = 30, W = 1920, H = 1080;
type B = any;
const BEATS: B[] = (D as any).beats;
const beatFrames = (b: B, last = false) => Math.ceil((b.sec + 0.35 + (b.scene.hold || 0)) * FPS) + (last ? 45 : 0);
const at = (b: B, p?: string, off = 0) => {
  if (!p) return 0;
  const i = b.say.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * FPS * i / b.say.length) + off;
};
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const spr = (f: number, s: number, cfg = {damping: 14, stiffness: 120, mass: 0.9}) => f < s ? 0 : spring({frame: f - s, fps: FPS, config: cfg});
const num = (s: string) => parseFloat(s.replace(/[^\d.]/g, ""));
const gen = rough.generator();
// frame override for the contact sheet (Freeze does not advance frames inside a one-frame Still)
const FrameCtx = React.createContext<number | null>(null);
const useF = () => { const o = React.useContext(FrameCtx); const f = useCurrentFrame(); return o ?? f; };
const PAPER = "#F4E9D5", DEEP = "#102820", GOLD = "#F2B544", CREAM = "#FBF8F1";

// ---------- shared chrome ----------
const Caption: React.FC<{b: B; dark?: boolean}> = ({b, dark}) => {
  const f = useF();
  const cues: string[] = b.cues; const tot = cues.reduce((a, c) => a + c.length, 0);
  let acc = 0, cur = cues[0];
  for (const c of cues) { cur = c; if (f < (acc + c.length) / tot * b.sec * FPS) break; acc += c.length; }
  return (
    <div style={{position: "absolute", left: 180, right: 180, bottom: 40, textAlign: "center"}}>
      <span style={{background: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.88)", color: dark ? "#fff" : "#1d1d1f",
        fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 38, lineHeight: 1.35, padding: "6px 16px", borderRadius: 8,
        boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{cur}</span>
    </div>
  );
};
const Chrome: React.FC<{ch: number; dark?: boolean}> = ({ch, dark}) => {
  const col = dark ? PAPER : C.ink;
  return (<>
    <div style={{position: "absolute", left: 48, top: 30, fontFamily: TYPE, fontSize: 24, color: col, opacity: 0.85}}>{`CH ${ch} · ${(D as any).chapters[ch].toUpperCase()}`}</div>
    <div style={{position: "absolute", right: 48, top: 30, fontFamily: TYPE, fontSize: 24, color: col, opacity: 0.6}}>Moat &amp; Margin · from the filings</div>
  </>);
};
const Grain: React.FC<{fill: string}> = ({fill}) => (
  <svg width={W} height={H} style={{position: "absolute"}}><VoxDefs/><rect width={W} height={H} fill={fill}/><rect width={W} height={H} filter="url(#vgrain)" opacity={0.6}/></svg>
);
const StampBox: React.FC<{text: string; x: number; y: number; start: number; rot?: number; size?: number; color?: string}> =
  ({text, x, y, start, rot = -9, size = 78, color = C.red}) => {
  const f = useF(); if (f < start) return null;
  const s = spr(f, start, {damping: 12, stiffness: 200, mass: 0.7});
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * s})`, opacity: Math.min(1, s * 1.6),
    border: `7px solid ${color}`, color, fontFamily: COND, fontWeight: 700, fontSize: size, padding: "4px 26px", letterSpacing: 3, whiteSpace: "nowrap", background: "rgba(255,255,255,0.12)"}}>{text}</div>;
};
// rough path drawn on over `dur` frames
const RDraw: React.FC<{shape: any; start: number; dur?: number}> = ({shape, start, dur = 14}) => {
  const f = useF(); const p = start <= -999 ? 1 : ease(f, start, dur); if (p <= 0) return null;
  return <g>{gen.toPaths(shape).map((q: any, i: number) => <path key={i} d={q.d} pathLength={1} fill={q.fill && q.fill !== "none" ? q.fill : "none"} fillOpacity={p}
    stroke={q.stroke} strokeWidth={q.strokeWidth} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round"/>)}</g>;
};

// ---------- 1. Filing Dive ----------
const page = (D as any).page;
const TW = 300, TH = TW * page.h / page.w, GAP = 44;
const syms: string[] = (() => { const s = (D as any).banks.map((b: any) => b.sym).filter((x: string) => x !== "UNIONBANK"); s.splice(12, 0, "UNIONBANK"); return s; })();
const tilePos = (i: number) => ({x: (i % 5) * (TW + GAP), y: Math.floor(i / 5) * (TH + GAP)});
const U = tilePos(12);
const rowRect = (k: string) => { const r = page.rows[k]; return {x: U.x + r[0] * TW, y: U.y + r[1] * TH, w: r[2] * TW, h: r[3] * TH}; };
const CAM = (() => {
  const gw = 5 * TW + 4 * GAP, gh = 5 * TH + 4 * GAP;
  const t = page.table, tx = U.x + t[0] * TW, ty = U.y + t[1] * TH, tw = t[2] * TW, th = t[3] * TH;
  const a = rowRect("adv"), d = rowRect("dep");
  return [
    {s: Math.min(1700 / gw, 860 / gh), cx: gw / 2, cy: gh / 2},
    {s: 840 / TH, cx: U.x + TW / 2, cy: U.y + TH / 2},
    {s: Math.min(1480 / tw, 760 / th), cx: tx + tw / 2, cy: ty + th / 2},
    {s: Math.min(1500 / a.w, 260 / (d.y + d.h - a.y)), cx: a.x + a.w / 2, cy: (a.y + d.y + d.h) / 2},
  ];
})();
const camAt = (L: number) => {
  const i = Math.max(0, Math.min(2, Math.floor(L))), t = Math.max(0, Math.min(1, L - i)), A = CAM[i], Bc = CAM[i + 1];
  const s = A.s * Math.pow(Bc.s / A.s, t), u = Math.abs(Bc.s - A.s) < 1e-6 ? t : (s - A.s) / (Bc.s - A.s);
  return {s, cx: A.cx + (Bc.cx - A.cx) * u, cy: A.cy + (Bc.cy - A.cy) * u};
};
const RULER = ["25 FILINGS", "1 PAGE", "1 TABLE", "2 LINES"];
const Dive: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene; const st = sc.stages.map((s: any) => ({...s, t: at(b, s.at)}));
  let L = st[0].level, prev = st[0].level;
  st.slice(1).forEach((s: any) => { L += (s.level - prev) * ease(f, s.t, 30); prev = s.level; });
  const cur = [...st].reverse().find((s: any) => f >= s.t) ?? st[0];
  const cam = camAt(L), CY = 470, CX = W / 2 - 140 * Math.min(1, Math.max(0, L - 1));
  const tb = page.table, ar = rowRect("adv"), dr = rowRect("dep");
  const spot = L > 2.5 ? {x: ar.x - 4, y: ar.y - 3, w: ar.w + 8, h: dr.y + dr.h - ar.y + 6, o: Math.min(1, (L - 2.5) * 2)} : {x: U.x + tb[0] * TW, y: U.y + tb[1] * TH, w: tb[2] * TW, h: tb[3] * TH, o: Math.max(0, Math.min(1, (L - 1.5) * 2))};
  const firstHl: Record<string, number> = {};
  st.forEach((s: any) => (s.hl || []).forEach((k: string) => { if (!(k in firstHl)) firstHl[k] = s.t; }));
  const hlOn = (k: string) => (cur.hl || []).includes(k) ? ease(f, firstHl[k], 10) : 0;
  return (
    <AbsoluteFill>
      <Grain fill={C.tan}/>
      <div style={{position: "absolute", left: 0, top: 0, transformOrigin: "0 0",
        transform: `translate(${CX - cam.cx * cam.s}px, ${CY - cam.cy * cam.s}px) scale(${cam.s})`}}>
        {syms.map((sym, i) => { const p = tilePos(i); const u = sym === "UNIONBANK";
          return <div key={sym} style={{position: "absolute", left: p.x, top: p.y, width: TW, height: TH, background: "#fdfbf6", boxShadow: "6px 9px 14px rgba(43,33,18,0.35)", overflow: "hidden"}}>
            {u ? <Img src={staticFile("tpl/tplsample/page.png")} style={{width: TW, height: TH}}/> : <>
              <div style={{fontFamily: TYPE, fontSize: 22, padding: "16px 18px 8px", color: C.ink}}>{sym}</div>
              {Array.from({length: 14}, (_, k) => <div key={k} style={{margin: "10px 18px", height: 7, width: `${55 + ((k * 37 + i * 11) % 40)}%`, background: "#cfc8b8"}}/>)}
            </>}
          </div>; })}
        {["adv", "dep"].map(k => { const r = rowRect(k); const o = hlOn(k);
          return o > 0 ? <div key={k} style={{position: "absolute", left: r.x, top: r.y, width: r.w * o, height: r.h, background: C.mustard, opacity: 0.45, mixBlendMode: "multiply"}}/> : null; })}
        {spot.o > 0 && [[-5000, -5000, 10000, spot.y + 5000], [-5000, spot.y + spot.h, 10000, 5000], [-5000, spot.y, spot.x + 5000, spot.h], [spot.x + spot.w, spot.y, 5000, spot.h]].map(([x, y, w, h], i) =>
          <div key={`s${i}`} style={{position: "absolute", left: x, top: y, width: w, height: h, background: "#1a1a1a", opacity: 0.55 * spot.o}}/>)}
      </div>
      {/* ruler */}
      <div style={{position: "absolute", right: 40, top: 150, width: 250, height: 640, background: "rgba(26,26,26,0.78)", borderRadius: 10}}>
        <div style={{position: "absolute", right: 34, top: 40, bottom: 40, width: 4, background: PAPER, opacity: 0.6}}/>
        {RULER.map((r, i) => <div key={r} style={{position: "absolute", right: 52, top: 40 + i * (560 / 3) - 14, fontFamily: TYPE, fontSize: 22,
          color: Math.abs(L - i) < 0.5 ? GOLD : PAPER, opacity: Math.abs(L - i) < 0.5 ? 1 : 0.55}}>{r}</div>)}
        <div style={{position: "absolute", right: 26, top: 40 + L * (560 / 3) - 10, width: 20, height: 20, borderRadius: 10, background: C.red}}/>
      </div>
      <div style={{position: "absolute", left: 48, top: 76, background: C.white, padding: "6px 16px", fontFamily: TYPE, fontSize: 28, color: C.ink, boxShadow: "3px 4px 0 rgba(0,0,0,0.25)"}}>{cur.label}</div>
      {cur.q && <StampBox text={cur.q} x={1240} y={790} start={cur.t + 8}/>}
      {st.filter((s: any) => s.big).map((s: any, i: number) => f >= s.t ? (() => { const r = rowRect(s.big.row);
        const y = CY + (r.y + r.h / 2 - cam.cy) * cam.s; const sp = spr(f, s.t + 6);
        return <div key={i} style={{position: "absolute", left: 140, top: s.big.row === "adv" ? y - 170 : y + 60, opacity: sp, transform: `translateY(${(1 - sp) * 40}px)`,
          background: C.white, padding: "10px 26px", fontFamily: COND, fontWeight: 700, fontSize: 64, color: C.ink, boxShadow: "6px 8px 0 rgba(0,0,0,0.3)"}}>{s.big.text}</div>; })() : null)}
    </AbsoluteFill>
  );
};

// ---------- 2. Load-Bearing Words ----------
const Words: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene;
  const g = spr(f, at(b, sc.grow_at)), tl = sc.tilt_at ? spr(f, at(b, sc.tilt_at), {damping: 9, stiffness: 90, mass: 1}) : 0, cush = sc.cushion_at ? ease(f, at(b, sc.cushion_at), 14) : 0;
  const enter = spr(f, 4), casa = sc.casa_at ? ease(f, at(b, sc.casa_at), 14) : 0;
  const tilt = 5.5 * tl, load = sc.tilt_at ? 1 + 0.42 * g : 1, floor = sc.tilt_at ? 1 + 0.12 * g : 1;
  const line = sc.recall ? "What we know." : "Deposits are the floor that loans stand on.";
  return (
    <AbsoluteFill style={{background: DEEP}}>
      <div style={{position: "absolute", top: 110, width: W, textAlign: "center", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 46, color: PAPER, opacity: enter}}>{line}</div>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <g transform={`rotate(${tilt} 660 700)`}>
          <text x={960} y={640} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={150} fill={GOLD}
            transform={`translate(960 640) scale(${load}) translate(-960 -640)`} opacity={enter}>{sc.load}</text>
          <rect x={700} y={652} width={520} height={10} fill={GOLD} opacity={enter}/>
          <text x={960} y={800} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={150} letterSpacing={10}
            fill={casa > 0 ? "none" : PAPER} stroke={PAPER} strokeWidth={casa > 0 ? 3 : 0}
            transform={`translate(960 800) scale(${floor} 1) translate(-960 -800)`}>{sc.floor}</text>
          {casa > 0 && <text x={960} y={800} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={150} letterSpacing={10} fill={GOLD} opacity={casa * 0.85}
            transform={`translate(960 800) scale(${floor} 1) translate(-960 -800)`}>{sc.floor}</text>}
        </g>
        <rect x={650} y={812} width={14} height={110} fill={PAPER} opacity={0.7}/><rect x={1256} y={812} width={14} height={110} fill={PAPER} opacity={0.7}/>
        <text x={1480} y={470} fontFamily={COND} fontWeight={700} fontSize={64} fill={GOLD} opacity={g}>{sc.loadg}</text>
        <text x={1480} y={760} fontFamily={COND} fontWeight={700} fontSize={64} fill={PAPER} opacity={g}>{sc.floorg}</text>
        {cush > 0 && <g opacity={cush}>
          {[[560, 752], [1220, 752]].map(([x, w]) => <rect key={x} x={x} y={672} width={140} height={14} fill={C.red}/>)}
          <text x={630} y={705 - 30} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.red}>UNLENT</text>
          <text x={1290} y={705 - 30} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.red}>UNLENT</text>
          <text x={960} y={900} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={GOLD}>ROOM AT THE EDGES</text></g>}
        {casa > 0 && <text x={960} y={880} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={GOLD} opacity={casa}>CHEAPER MIX</text>}
      </svg>
      {sc.recall && <StampBox text={sc.recall.text} x={360} y={420} start={at(b, sc.recall.at)} rot={-7} size={90}/>}
    </AbsoluteFill>
  );
};

// ---------- 3. The Pour ----------
const GL = {x: 1010, y: 200, top: 440, bot: 330, h: 640};
const glassPts = `${GL.x},${GL.y} ${GL.x + GL.top},${GL.y} ${GL.x + (GL.top + GL.bot) / 2},${GL.y + GL.h} ${GL.x + (GL.top - GL.bot) / 2},${GL.y + GL.h}`;
const Pour: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene;
  const tg = at(b, sc.glass_at), tp = at(b, sc.pour_at), tr = at(b, sc.rest_at);
  const glassIn = spr(f, tg), tilt = ease(f, tp, 18) * (1 - ease(f, tp + 95, 15)), fill = sc.fill * ease(f, tp + 14, 80), rest = ease(f, tr, 22);
  const level = GL.y + GL.h - fill * GL.h, wave = Math.sin(f / 5) * 6 * (fill > 0 && fill < sc.fill ? 1 : 0.3);
  const streaming = f > tp + 14 && f < tp + 100;
  return (
    <AbsoluteFill style={{background: CREAM}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <defs>
          <clipPath id="glass"><polygon points={glassPts}/></clipPath>
          <pattern id="hatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="#fbe9e6"/><rect width="7" height="22" fill={C.red} opacity={0.55}/></pattern>
        </defs>
        <g opacity={glassIn}>
          <g clipPath="url(#glass)">
            {rest > 0 && <rect x={GL.x} y={GL.y + (level - GL.y) * (1 - rest)} width={GL.top} height={(level - GL.y) * rest} fill="url(#hatch)"/>}
            <path d={`M ${GL.x - 20} ${level} Q ${GL.x + 110} ${level - wave} ${GL.x + 220} ${level} T ${GL.x + 460} ${level} V ${GL.y + GL.h + 10} H ${GL.x - 20} Z`} fill={C.mustard}/>
          </g>
          <polygon points={glassPts} fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
          <line x1={GL.x + GL.top - 40} y1={GL.y + GL.h / 2} x2={GL.x + GL.top + 6} y2={GL.y + GL.h / 2} stroke={C.ink} strokeWidth={4}/>
          <text x={GL.x + GL.top + 16} y={GL.y + GL.h / 2 + 10} fontFamily={TYPE} fontSize={28} fill={C.ink}>HALF</text>
        </g>
        <g transform={`translate(380 250) rotate(${tilt * 62} 120 60)`}>
          <path d="M 20 0 H 220 L 250 20 L 220 30 V 190 Q 220 220 190 220 H 50 Q 20 220 20 190 Z" fill={C.white} stroke={C.ink} strokeWidth={6}/>
          <rect x={20} y={60} width={200} height={130} fill={C.mustard}/>
        </g>
        {streaming && <path d={`M 640 ${290} Q 760 ${300} 860 ${380} T ${GL.x + GL.top / 2} ${level}`} fill="none" stroke={C.mustard} strokeWidth={16} strokeLinecap="round"/>}
      </svg>
      <div style={{position: "absolute", left: 260, top: 500, opacity: ease(f, tp - 4, 10), fontFamily: COND, fontWeight: 700, fontSize: 52, color: C.ink, background: C.mustard, padding: "6px 18px"}}>{sc.jug}</div>
      <div style={{position: "absolute", left: 1490, top: 160, opacity: glassIn, fontFamily: COND, fontWeight: 700, fontSize: 52, color: C.white, background: C.ink, padding: "6px 18px", maxWidth: 400}}>{sc.glass}</div>
      {rest > 0 && <div style={{position: "absolute", left: 1490, top: 360, opacity: rest, fontFamily: COND, fontWeight: 700, fontSize: 46, color: C.red, maxWidth: 400, lineHeight: 1.1}}>{sc.rest}<div style={{fontSize: 150}}>?</div></div>}
    </AbsoluteFill>
  );
};

// ---------- 4. Follow the Rupee ----------
const Coin: React.FC<{x: number; y: number; r?: number; text: string; walk?: boolean; face?: "happy" | "puzzled"; fill?: string; o?: number}> =
  ({x, y, r = 72, text, walk, face = "happy", fill = C.mustard, o = 1}) => {
  const f = useF(); const bob = walk ? Math.abs(Math.sin(f / 4)) * 12 : 0; const leg = walk ? Math.sin(f / 4) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y - bob})`} opacity={o}>
      <line x1={-20} y1={r - 6} x2={-20 - leg} y2={r + 40} stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
      <line x1={20} y1={r - 6} x2={20 + leg} y2={r + 40} stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
      <circle r={r} fill={fill} stroke="#8a6414" strokeWidth={8}/><circle r={r - 14} fill="none" stroke="#8a6414" strokeWidth={3} opacity={0.6}/>
      <ellipse cx={-22} cy={-24} rx={8} ry={face === "puzzled" ? 6 : 11} fill={C.ink}/><ellipse cx={22} cy={-24} rx={8} ry={11} fill={C.ink}/>
      {face === "happy" ? <path d="M -24 26 Q 0 44 24 26" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>
        : <path d="M -20 32 Q 0 24 20 34" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>}
      <text y={8} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={r * 0.5} fill={C.ink} opacity={0.85}>{text}</text>
    </g>
  );
};
const Bank: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <polygon points="-260,-250 0,-360 260,-250" fill={C.white} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
    <text y={-276} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={46} fill={C.ink}>UNION BANK</text>
    <rect x={-240} y={-250} width={480} height={26} fill={C.ink}/>
    {[-180, -60, 60, 180].map(cx => <rect key={cx} x={cx - 22} y={-224} width={44} height={214} fill={C.white} stroke={C.ink} strokeWidth={5}/>)}
    <rect x={-270} y={-10} width={540} height={30} fill={C.ink}/>
  </g>
);
const Rupee: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene; const GROUND = 760;
  if (sc.step === "split") {
    const tw = at(b, sc.at.walk), to = at(b, sc.at.out), tc = at(b, sc.at.covered), tother = at(b, sc.at.other);
    const wx = interpolate(f, [Math.max(0, tw - 30), tw + 30], [-120, 560], clamp), gone = ease(f, to - 6, 10);
    const out = spr(f, to), out2 = spr(f, to + 8);
    return (
      <AbsoluteFill style={{background: "#F6EFE0"}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <rect y={GROUND + 40} width={W} height={6} fill={C.ink} opacity={0.5}/>
          <Bank x={960} y={GROUND + 40}/>
          <Coin x={wx} y={GROUND - 70} text={sc.coin} walk={f < tw + 30} o={1 - gone}/>
          {f < to && <text x={wx} y={GROUND - 190} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink} opacity={ease(f, tw - 20, 10) * (1 - gone)}>NEW DEPOSITS</text>}
          <Coin x={1290 + 60 * out} y={GROUND - 70} text={sc.coin} o={out}/>
          <Coin x={1500 + 80 * out2} y={GROUND - 82} r={84} text={sc.other} face="puzzled" fill="#d9cfb8" o={out2}/>
          {f >= to && <g opacity={out}><path d={`M 1260 ${GROUND - 220} H 1680 M 1260 ${GROUND - 220} v 20 M 1680 ${GROUND - 220} v 20`} stroke={C.ink} strokeWidth={5} fill="none"/>
            <text x={1470} y={GROUND - 240} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={56} fill={C.ink}>{sc.total}</text></g>}
        </svg>
        {f >= tc && <div style={{position: "absolute", left: 1290, top: GROUND + 40, transform: "translateX(-50%)", opacity: ease(f, tc, 8), fontFamily: COND, fontWeight: 700, fontSize: 40, color: C.white, background: "#2b8a3e", padding: "2px 14px"}}>COVERED</div>}
        {f >= tother && <div style={{position: "absolute", left: 1580, top: GROUND + 40, transform: "translateX(-50%)", opacity: ease(f, tother, 8), fontFamily: COND, fontWeight: 700, fontSize: 40, color: C.white, background: C.red, padding: "2px 14px", whiteSpace: "nowrap"}}>FROM SOMEWHERE ELSE?</div>}
      </AbsoluteFill>
    );
  }
  const doors = sc.doors.map((d: any, i: number) => ({...d, x: 560 + i * 420, t: at(b, d.at)}));
  const seen = [...doors].reverse().find((d: any) => f >= d.t);
  const cx = interpolate(f, [0, 20], [260, 260], clamp) + (seen ? spr(f, seen.t) * (seen.x - 260) : 0);
  return (
    <AbsoluteFill style={{background: "#F6EFE0"}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <rect y={GROUND + 40} width={W} height={6} fill={C.ink} opacity={0.5}/>
        {doors.map((d: any) => { const o = spr(f, d.t);
          const lit = sc.lit === doors.indexOf(d) && f >= at(b, sc.stamp.at) - 20;
          return <g key={d.text} opacity={0.25 + 0.75 * o}>
            <rect x={d.x - 110} y={GROUND - 380} width={220} height={420} rx={10} fill={lit ? C.mustard : o > 0.5 ? C.white : "#e6dcc6"} stroke={C.ink} strokeWidth={7}/>
            <circle cx={d.x + 70} cy={GROUND - 160} r={10} fill={C.ink}/>
            <text x={d.x} y={GROUND - 410} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={44} fill={C.ink}>{d.text}</text></g>; })}
        <Coin x={cx} y={GROUND - 82} r={84} text={sc.other} face="puzzled" fill="#d9cfb8" walk={!!seen && f < seen.t + 20}/>
      </svg>
      <StampBox text={sc.stamp.text} x={1400} y={250} start={at(b, sc.stamp.at)} rot={-6} size={90}/>
    </AbsoluteFill>
  );
};

// ---------- 5. Pencil Data Notebook ----------
const NB = {x0: 600, px: 24, y0: 205, dy: 27.5};
const NotebookLdr: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene; const banks: any[] = [...(D as any).banks].sort((p, q) => q.ldr26 - p.ldr26);
  const first = sc.step === "ldr_all"; const t0 = first ? at(b, sc.draw_at) : -999;
  const xOf = (v: number) => 600 + (v - 65) * 30, yOf = (i: number) => NB.y0 + i * NB.dy;
  const ui = banks.findIndex(x => x.sym === "UNIONBANK"), u = banks[ui];
  const lower = banks.filter(x => x.ldr25 < u.ldr25).length, higher = banks.filter(x => x.ldr26 > u.ldr26).length;
  const rise = (u.ldr26 - u.ldr25).toFixed(1);
  const Note: React.FC<{x: number; y: number; t: number; children: React.ReactNode; color?: string; size?: number}> = ({x, y, t, children, color = C.red, size = 28}) =>
    f >= t ? <text x={x} y={y} fontFamily={HANDFONT} fontSize={size} fill={color} opacity={ease(f, t, 10)}>{children}</text> : null;
  return (
    <AbsoluteFill style={{background: "#FAF7EE"}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        {Array.from({length: 65}, (_, i) => <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={H} stroke="#cfe0ef" strokeWidth={i % 5 ? 1 : 2}/>)}
        {Array.from({length: 37}, (_, i) => <line key={`h${i}`} x1={0} y1={i * 30} x2={W} y2={i * 30} stroke="#cfe0ef" strokeWidth={i % 5 ? 1 : 2}/>)}
      </svg>
      <svg width={W} height={H} style={{position: "absolute", filter: "drop-shadow(-2px 0 0 rgba(230,40,40,0.35)) drop-shadow(2px 0 0 rgba(0,170,230,0.35))"}}>
        <text x={110} y={120} fontFamily={HANDFONT} fontSize={38} fill={C.ink}>Loans ÷ deposits, 25 banks (our arithmetic on filed totals)</text>
        <text x={1440} y={78} fontFamily={HANDFONT} fontSize={26} fill="#1c64b8">○ Sep 2025</text><text x={1620} y={78} fontFamily={HANDFONT} fontSize={26} fill={C.red}>● Sep 2026</text>
        {[70, 80, 90, 100].map(v => <g key={v}><line x1={xOf(v)} y1={180} x2={xOf(v)} y2={yOf(24) + 12} stroke="#9aa8b5" strokeWidth={1.5} strokeDasharray="4 6"/>
          <text x={xOf(v)} y={176} textAnchor="middle" fontFamily={HANDFONT} fontSize={22} fill="#556">{`${v}%`}</text></g>)}
        {banks.map((k, i) => { const t = first ? t0 + i * 4 : -999; const y = yOf(i); const o = first ? ease(f, t, 8) : 1; const hi = i === ui;
          return <g key={k.sym}>
            <text x={580} y={y + 8} textAnchor="end" fontFamily={HANDFONT} fontSize={22} fill={hi ? C.red : C.ink} opacity={o}>{k.name}</text>
            <RDraw shape={gen.line(xOf(k.ldr25), y, xOf(k.ldr26), y, {roughness: 1.2, stroke: hi ? C.red : "#555", strokeWidth: hi ? 5 : 3, seed: i + 3})} start={t} dur={12}/>
            {o > 0 && <><circle cx={xOf(k.ldr25)} cy={y} r={8} fill="#FAF7EE" stroke="#1c64b8" strokeWidth={3} opacity={o}/><circle cx={xOf(k.ldr26)} cy={y} r={8} fill={C.red} opacity={o}/></>}
          </g>; })}
        {first && <><RDraw shape={gen.ellipse((xOf(u.ldr25) + xOf(u.ldr26)) / 2, yOf(ui), xOf(u.ldr26) - xOf(u.ldr25) + 80, 40, {stroke: C.red, strokeWidth: 4, seed: 6})} start={at(b, sc.rise_at)} dur={12}/>
          <Note x={1668} y={yOf(ui) + 10} t={at(b, sc.rise_at) + 6}>{`+${rise} pts, the most`}</Note></>}
        {!first && <>
          <RDraw shape={gen.circle(xOf(u.ldr25), yOf(ui), 40, {stroke: "#1c64b8", strokeWidth: 4, seed: 7})} start={at(b, sc.low_at)} dur={12}/>
          <Note x={1668} y={300} t={at(b, sc.low_at)} color="#1c64b8">{`a year ago: ${u.ldr25}%`}</Note>
          <Note x={1668} y={340} t={at(b, sc.low_at) + 8} color="#1c64b8" size={26}>{`${lower} banks lower`}</Note>
          <RDraw shape={gen.circle(xOf(u.ldr26), yOf(ui), 40, {stroke: C.red, strokeWidth: 4, seed: 8})} start={at(b, sc.now_at)} dur={12}/>
          <Note x={1668} y={420} t={at(b, sc.now_at)}>{`now: ${u.ldr26}%`}</Note>
          <Note x={1668} y={460} t={at(b, sc.now_at) + 8} size={26}>{`${higher} banks higher`}</Note>
          <Note x={1668} y={560} t={at(b, sc.mid_at)} color={C.ink} size={34}>middle of the pack</Note></>}
      </svg>
    </AbsoluteFill>
  );
};
const Notebook: React.FC<{b: B}> = ({b}) => {
  if (String(b.scene.step).startsWith("ldr")) return <NotebookLdr b={b}/>;
  const f = useF(); const sc = b.scene; const banks: any[] = (D as any).banks;
  const first = sc.step === "all";
  const t0 = first ? at(b, sc.draw_at) : -999;
  const xOf = (v: number) => NB.x0 + v * NB.px, yOf = (i: number) => NB.y0 + i * NB.dy;
  const ui = banks.findIndex(x => x.sym === "UNIONBANK"), ki = banks.findIndex(x => x.sym === "KTKBANK"), si = banks.findIndex(x => x.sym === "SOUTHBANK");
  const Note: React.FC<{x: number; y: number; t: number; children: React.ReactNode; color?: string; size?: number}> = ({x, y, t, children, color = C.red, size = 34}) =>
    f >= t ? <text x={x} y={y} fontFamily={HANDFONT} fontSize={size} fill={color} opacity={ease(f, t, 10)}>{children}</text> : null;
  return (
    <AbsoluteFill style={{background: "#FAF7EE"}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        {Array.from({length: 65}, (_, i) => <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={H} stroke="#cfe0ef" strokeWidth={i % 5 ? 1 : 2}/>)}
        {Array.from({length: 37}, (_, i) => <line key={`h${i}`} x1={0} y1={i * 30} x2={W} y2={i * 30} stroke="#cfe0ef" strokeWidth={i % 5 ? 1 : 2}/>)}
      </svg>
      <svg width={W} height={H} style={{position: "absolute", filter: "drop-shadow(-2px 0 0 rgba(230,40,40,0.35)) drop-shadow(2px 0 0 rgba(0,170,230,0.35))"}}>
        <text x={110} y={120} fontFamily={HANDFONT} fontSize={40} fill={C.ink}>Loan growth vs deposit growth, 25 banks (YoY, 30 Sep)</text>
        <text x={1500} y={170} fontFamily={HANDFONT} fontSize={26} fill="#1c64b8">○ deposits</text><text x={1680} y={170} fontFamily={HANDFONT} fontSize={26} fill={C.red}>● loans</text>
        {[0, 10, 20, 30, 40].map(v => <g key={v}><line x1={xOf(v)} y1={180} x2={xOf(v)} y2={yOf(24) + 12} stroke="#9aa8b5" strokeWidth={1.5} strokeDasharray="4 6"/>
          <text x={xOf(v)} y={176} textAnchor="middle" fontFamily={HANDFONT} fontSize={22} fill="#556">{`${v}%`}</text></g>)}
        {banks.map((k, i) => { const t = first ? t0 + i * 4 : -999; const y = yOf(i); const o = first ? ease(f, t, 8) : 1;
          const hi = (i === ui && !first) || (i === si && sc.step === "sib");
          return <g key={k.sym}>
            <text x={NB.x0 - 20} y={y + 8} textAnchor="end" fontFamily={HANDFONT} fontSize={22} fill={hi ? C.red : C.ink} opacity={o}>{k.name}</text>
            <RDraw shape={gen.line(xOf(k.dep), y, xOf(k.adv), y, {roughness: 1.2, stroke: k.gap > 0 ? "#555" : "#1c64b8", strokeWidth: 3, seed: i + 3})} start={t} dur={12}/>
            {o > 0 && <><circle cx={xOf(k.dep)} cy={y} r={8} fill="#FAF7EE" stroke="#1c64b8" strokeWidth={3} opacity={o}/><circle cx={xOf(k.adv)} cy={y} r={8} fill={C.red} opacity={o}/></>}
          </g>; })}
        {first && <><Note x={1590} y={500} t={at(b, sc.count_at)} size={64}>{`${banks.filter(x => x.gap > 0).length} of ${banks.length}`}</Note><Note x={1590} y={548} t={at(b, sc.count_at) + 6} color={C.ink} size={28}>loans grew faster</Note>
          {f >= at(b, sc.count_at) && <RDraw shape={gen.ellipse(1690, 480, 260, 110, {stroke: C.red, strokeWidth: 4, roughness: 1.6, seed: 4})} start={at(b, sc.count_at) + 4} dur={14}/>}</>}
        {sc.step === "union" && <>
          <RDraw shape={gen.circle(xOf(banks[ui].dep), yOf(ui), 46, {stroke: C.red, strokeWidth: 4, seed: 6})} start={at(b, sc.slow_at)} dur={12}/>
          <Note x={1590} y={300} t={at(b, sc.slow_at)} size={30}>{`slowest deposits: ${banks[ui].dep}%`}</Note>
          <RDraw shape={gen.line(xOf(banks[ui].dep), yOf(ui) - 18, xOf(banks[ui].adv), yOf(ui) - 18, {stroke: C.red, strokeWidth: 5, seed: 8})} start={at(b, sc.gap_at)} dur={12}/>
          <Note x={1590} y={350} t={at(b, sc.gap_at)} size={30}>{`gap: ${banks[ui].gap} pts (#${ui + 1})`}</Note>
          <RDraw shape={gen.ellipse((xOf(banks[ki].dep) + xOf(banks[ki].adv)) / 2, yOf(ki), xOf(banks[ki].adv) - xOf(banks[ki].dep) + 70, 34, {stroke: C.ink, strokeWidth: 3, seed: 9})} start={at(b, sc.ktk_at)} dur={12}/>
          <Note x={1590} y={400} t={at(b, sc.ktk_at)} color={C.ink} size={30}>{`Karnataka: ${banks[ki].gap} pts (#${ki + 1})`}</Note></>}
        {sc.step === "sib" && <>
          <RDraw shape={gen.ellipse(xOf(banks[si].adv), yOf(si), 90, 40, {stroke: C.red, strokeWidth: 4, seed: 12})} start={at(b, sc.sib_at)} dur={12}/>
          <Note x={1590} y={yOf(si) + 10} t={at(b, sc.sib_at) + 6} size={30}>{`${banks[si].adv}% vs ${banks[si].dep}%`}</Note></>}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- 6. One-Shape Morph ----------
type MS = any;
const geomOf = (s: MS) => s.kind === "gauge" ? {w: 1560, h: 330, r: 36} : s.kind === "bars" ? {w: 1000, h: 600, r: 40} : s.kind === "arrow" ? {w: 300, h: 560, r: 150}
  : s.kind === "dot" ? {w: 40, h: 40, r: 20} : {w: Math.max(700, s.text.length * 52 + 160), h: 200, r: 100};
const MORPH_BEATS = BEATS.filter(b => b.scene.tpl === "morph");
const prevMorphState = (b: B): MS => { const i = MORPH_BEATS.indexOf(b); if (i <= 0) return {kind: "dot"}; const s = MORPH_BEATS[i - 1].scene.states; return s[s.length - 1]; };
const Morph: React.FC<{b: B}> = ({b}) => {
  const f = useF();
  const states = [{...prevMorphState(b), t: -999}, ...b.scene.states.map((s: MS) => ({...s, t: at(b, s.at)}))];
  let g = geomOf(states[0]); let fillCol = states[0].accent ? C.red : C.ink;
  states.slice(1).forEach((s: MS) => { const p = spr(f, s.t, {damping: 15, stiffness: 110, mass: 0.9}); const n = geomOf(s);
    g = {w: g.w + (n.w - g.w) * p, h: g.h + (n.h - g.h) * p, r: g.r + (n.r - g.r) * p}; if (p > 0.5) fillCol = s.accent ? C.red : C.ink; });
  const ci = states.reduce((a: number, s: MS, i: number) => f >= s.t ? i : a, 0); const cur = states[ci];
  const enter = ci === 0 ? 1 : ease(f, cur.t + 7, 9); const blur = (1 - enter) * 10;
  const cx = 960, cy = 470;
  let content: React.ReactNode = null;
  if (cur.kind === "label" || cur.kind === "dot") content = cur.text ? <div style={{fontFamily: COND, fontWeight: 700, fontSize: 82, color: C.white, letterSpacing: 2}}>{cur.text}</div> : null;
  if (cur.kind === "gauge") { const v = cur.from_v !== undefined ? cur.from_v + (cur.v - cur.from_v) * ease(f, cur.t + 6, 36) : cur.v;
    content = <div style={{width: g.w - 120, color: C.white}}>
      <div style={{fontFamily: TYPE, fontSize: 30, opacity: 0.8}}>{cur.label}</div>
      <div style={{display: "flex", alignItems: "center", gap: 40, marginTop: 12}}>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 120, width: 420}}>{`${v.toFixed(2)}%`}</div>
        <div style={{flex: 1, height: 44, background: "#444", borderRadius: 22, position: "relative"}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${v}%`, background: C.mustard, borderRadius: 22}}/>
          {cur.from_v !== undefined && <div style={{position: "absolute", left: `${cur.from_v}%`, top: -14, bottom: -14, width: 5, background: C.white}}/>}
        </div></div></div>; }
  if (cur.kind === "bars") { const p = ease(f, cur.t + 8, 30);
    content = <div style={{display: "flex", gap: 120, alignItems: "flex-end", height: g.h - 90}}>
      {[[cur.a, cur.la, C.red], [cur.b, cur.lb, C.mustard]].map(([v, l, c]: any) => <div key={l} style={{textAlign: "center", color: C.white}}>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 70}}>{`${(v * p).toFixed(2)}%`}</div>
        <div style={{width: 200, height: v * 60 * p, background: c, margin: "0 auto"}}/>
        <div style={{fontFamily: TYPE, fontSize: 26, marginTop: 14}}>{l}</div></div>)}</div>; }
  if (cur.kind === "arrow") content = <svg width={200} height={400}><path d="M 100 20 L 180 140 H 130 V 380 H 70 V 140 H 20 Z" fill={C.white}/></svg>;
  return (
    <AbsoluteFill style={{background: "#E9E6E1"}}>
      <div style={{position: "absolute", left: cx - g.w / 2, top: cy - g.h / 2, width: g.w, height: g.h, borderRadius: g.r, background: fillCol,
        boxShadow: "0 24px 50px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
        <div style={{opacity: enter, filter: `blur(${blur}px)`}}>{content}</div>
      </div>
      {cur.kind === "arrow" && <div style={{position: "absolute", left: cx + 200, top: cy - 50, fontFamily: COND, fontWeight: 700, fontSize: 90, color: C.ink, opacity: enter}}>{cur.text}</div>}
    </AbsoluteFill>
  );
};

// ---------- 7. Build Log ----------
const Build: React.FC<{b: B}> = ({b}) => {
  // Each tower = deposits in India; bottom = lent (loans), top = the unlent cushion. Built from blueprint outlines.
  const f = useF(); const sc = b.scene; const step = sc.step;
  const dep = sc.dep.map(num), adv = sc.adv.map(num); const k = 600 / Math.max(...dep); const GROUND = 860, TWD = 300, xs = [560, 1060];
  const T = (p?: string, off = 0) => p ? at(b, p, off) : -999;
  const show = [1, step === "y1" ? 0 : 1];
  const outline = [step === "y1" ? ease(f, T(sc.y1_at), 24) : 1, step === "y2" ? ease(f, T(sc.y2_at), 24) : show[1]];
  const advOn = [step === "y1" ? ease(f, T(sc.adv_at), 18) : 1, step === "y2" ? ease(f, T(sc.y2_at, 24), 18) : show[1]];
  const poolOn = [step === "y1" ? ease(f, T(sc.pool_at), 16) : 1, step === "y2" ? ease(f, T(sc.pool_at), 16) : show[1]];
  const yearT = [step === "y1" ? T(sc.y1_at, 10) : -999, step === "y2" ? T(sc.y2_at, 10) : -999];
  const dropOn = step === "y1" ? 0 : step === "y2" ? ease(f, T(sc.drop_at), 12) : 1;
  const resOn = step === "reserve" ? ease(f, T(sc.res_at), 20) : 0;
  return (
    <AbsoluteFill style={{background: "#F2EEE4"}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <defs><pattern id="cush" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill={C.mustard}/><rect width="5" height="18" fill="#b8862a"/></pattern>
          <linearGradient id="resg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#1c64b8" stopOpacity="0.55"/><stop offset="1" stopColor="#1c64b8" stopOpacity="0"/></linearGradient></defs>
        {Array.from({length: 49}, (_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="#d8d1c2" strokeWidth={1}/>)}
        {Array.from({length: 28}, (_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="#d8d1c2" strokeWidth={1}/>)}
        <rect x={380} y={GROUND} width={1160} height={6} fill={C.ink}/>
        {xs.map((x, i) => { if (!show[i]) return null; const hd = dep[i] * k, ha = adv[i] * k, hp = hd - ha;
          return <g key={i}>
            <rect x={x} y={GROUND - hd} width={TWD} height={hd} fill="none" stroke="#1c64b8" strokeWidth={4} strokeDasharray="14 10" opacity={0.8 * outline[i]}/>
            <rect x={x} y={GROUND - ha * advOn[i]} width={TWD} height={ha * advOn[i]} fill="#5c6b78"/>
            <rect x={x} y={GROUND - ha - hp * poolOn[i]} width={TWD} height={hp * poolOn[i]} fill="url(#cush)"/>
            {resOn > 0 && <rect x={x} y={GROUND - ha - hp} width={TWD} height={hp} fill="url(#resg)" opacity={resOn}/>}
            {advOn[i] > 0.9 && <><text x={x + TWD / 2} y={GROUND - ha / 2 - 10} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={36} fill={C.white}>LENT</text>
              <text x={x + TWD / 2} y={GROUND - ha / 2 + 28} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.white}>{sc.adv[i]}</text></>}
            {poolOn[i] > 0.9 && <text x={x + TWD / 2} y={GROUND - ha - hp / 2 + 10} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={26} fill={C.ink}>{`NOT LENT ${sc.pool[i]}`}</text>}
            {outline[i] > 0.9 && <text x={x + TWD / 2} y={GROUND + 44} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.ink}>{`DEPOSITS ${sc.dep[i]}`}</text>}
          </g>; })}
      </svg>
      {["30 SEP 2025", "30 SEP 2026"].map((y, i) => show[i] ? <StampBox key={y} text={y} x={xs[i] + TWD / 2} y={GROUND - dep[i] * k - 60} start={yearT[i]} rot={i ? 4 : -4} size={50} color={C.ink}/> : null)}
      {dropOn > 0 && sc.drop && <div style={{position: "absolute", left: xs[1] + TWD + 40, top: GROUND - dep[1] * k + 40, opacity: dropOn, fontFamily: COND, fontWeight: 700, fontSize: 60, color: C.white, background: C.red, padding: "2px 18px"}}>{`CUSHION ${sc.drop}`}</div>}
      {dropOn > 0 && !sc.drop && step === "reserve" && null}
      {resOn > 0 && <div style={{position: "absolute", left: xs[1] + TWD + 40, top: GROUND - dep[1] * k + 150, opacity: resOn, width: 380, fontFamily: TYPE, fontSize: 30, color: "#1c64b8", lineHeight: 1.3}}>PART MUST BE HELD AS RESERVES BY RULE · SIZE NOT ON THIS PAGE</div>}
      {step === "reserve" && <StampBox text="NOT ON THIS PAGE" x={1350} y={180} start={T(sc.stamp_at)} rot={-6} size={70}/>}
    </AbsoluteFill>
  );
};

// ---------- kinetic, ledger3, end ----------
const Kinetic: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {sc.lines.map((l: string, i: number) => { const s = spr(f, at(b, sc.at[i]), {damping: 12, stiffness: 170, mass: 0.8});
        return <div key={l} style={{position: "absolute", left: 0, right: 0, top: 280 + i * 170, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 140,
          color: i ? C.red : C.white, letterSpacing: 4, opacity: s, transform: `scale(${1.6 - 0.6 * s})`}}>{l}</div>; })}
      {sc.note && f >= at(b, sc.note.at) && (() => { const s = spr(f, at(b, sc.note.at));
        return <div style={{position: "absolute", left: 1330, top: 640, width: 480, padding: "26px 30px", background: C.mustard, transform: `rotate(-4deg) translateY(${(1 - s) * -200}px)`, opacity: s, boxShadow: "8px 10px 0 rgba(0,0,0,0.4)"}}>
          <div style={{fontFamily: COND, fontWeight: 700, fontSize: 64, color: C.ink}}>{sc.note.text}</div>
          <div style={{fontFamily: TYPE, fontSize: 24, color: C.ink, marginTop: 6}}>{sc.note.sub}</div>
          <div style={{position: "absolute", left: 230, top: -14, width: 28, height: 28, borderRadius: 14, background: C.red}}/></div>; })()}
    </AbsoluteFill>
  );
};
const ROWS = [["known", "WE KNOW"], ["unknown", "WE DON'T KNOW"], ["monitor", "WATCH"]];
const Ledger3: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {ROWS.map(([k, label], i) => { const on = k === sc.row; const y = 190 + i * 230;
        return <div key={k}>
          <div style={{position: "absolute", left: 120, top: y, width: 560, fontFamily: COND, fontWeight: 700, fontSize: 70, color: on ? C.red : C.ink, opacity: on ? 1 : 0.3}}>{label}</div>
          <div style={{position: "absolute", left: 120, top: y + 110, width: 1680, height: 4, background: C.ink, opacity: 0.25}}/>
          {k === "known" && <div style={{position: "absolute", left: 720, top: y + 6, fontFamily: COND, fontWeight: 700, fontSize: 70, color: "#2b8a3e", opacity: 0.6}}>✓</div>}
          {on && <div style={{position: "absolute", left: 720, top: y - 6, width: 1100, display: "flex", flexWrap: "wrap", gap: 18}}>
            {sc.items.map((it: any) => { const t = at(b, it.at); const s = spr(f, t);
              return f >= t ? <div key={it.text} style={{background: C.white, padding: "6px 18px", fontFamily: TYPE, fontSize: 36, color: C.ink, boxShadow: "3px 4px 0 rgba(0,0,0,0.25)",
                opacity: s, transform: `translateY(${(1 - s) * 30}px) rotate(${(it.text.length % 3) - 1}deg)`}}>{it.text}</div> : null; })}</div>}
        </div>; })}
    </AbsoluteFill>
  );
};
const End: React.FC<{b: B}> = ({b}) => {
  const f = useF(); const sc = b.scene; const s = spr(f, at(b, sc.at));
  return (
    <AbsoluteFill style={{background: C.ink, alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: TYPE, fontSize: 34, color: C.mustard, letterSpacing: 4, opacity: s}}>NEXT</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 86, color: C.white, textAlign: "center", maxWidth: 1400, lineHeight: 1.1, marginTop: 18, opacity: s, transform: `scale(${1.1 - 0.1 * s})`}}>{sc.next}</div>
      <div style={{position: "absolute", bottom: 150, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 52, color: C.white}}>MOAT &amp; MARGIN
        <div style={{fontFamily: TYPE, fontWeight: 400, fontSize: 30, color: C.mustard}}>moatmarginresearch.com</div></div>
    </AbsoluteFill>
  );
};

// ---------- assembly ----------
const SCENES: Record<string, React.FC<{b: B}>> = {dive: Dive, words: Words, pour: Pour, rupee: Rupee, notebook: Notebook, morph: Morph, build: Build, kinetic: Kinetic, ledger3: Ledger3, end: End};
const DARK = new Set(["words", "kinetic", "end"]);
const BeatView: React.FC<{b: B; audio?: boolean}> = ({b, audio}) => {
  const S = SCENES[b.scene.tpl];
  return (
    <AbsoluteFill>
      <VoxFonts/>
      <S b={b}/>
      {b.scene.tpl !== "end" && <Chrome ch={b.ch} dark={DARK.has(b.scene.tpl)}/>}
      <Caption b={b} dark={DARK.has(b.scene.tpl)}/>
      {audio && <Audio src={staticFile(`tpl/tplsample/${b.key}.mp3`)}/>}
    </AbsoluteFill>
  );
};
const starts = (() => { let t = 0; return BEATS.map((b, i) => { const s = t; t += beatFrames(b, i === BEATS.length - 1); return s; }); })();
export const tplTotal = starts[starts.length - 1] + beatFrames(BEATS[BEATS.length - 1], true);
export const TplSample: React.FC = () => (
  <AbsoluteFill style={{background: "#000"}}>
    {BEATS.map((b, i) => <Sequence key={b.key} from={starts[i]} durationInFrames={beatFrames(b, i === BEATS.length - 1)}><BeatView b={b} audio/></Sequence>)}
  </AbsoluteFill>
);
// Contact sheet: one still per beat (frame at 70% of the narration), tiled 4 across, for review before the full render.
const SHEET_COLS = 4, CELL_W = 480, CELL_H = 270;
export const TplSheet: React.FC = () => (
  <AbsoluteFill style={{background: "#222"}}>
    {BEATS.map((b, i) => (
      <div key={b.key} style={{position: "absolute", left: (i % SHEET_COLS) * CELL_W, top: Math.floor(i / SHEET_COLS) * (CELL_H + 30), width: CELL_W, height: CELL_H + 30}}>
        <div style={{width: W, height: H, transform: `scale(${CELL_W / W})`, transformOrigin: "0 0", position: "absolute", overflow: "hidden"}}>
          <FrameCtx.Provider value={Math.round(b.sec * FPS * 0.7)}><BeatView b={b}/></FrameCtx.Provider>
        </div>
        <div style={{position: "absolute", top: CELL_H, left: 6, fontFamily: "monospace", fontSize: 18, color: "#ddd"}}>{`${b.key} · ${b.scene.tpl}`}</div>
      </div>))}
  </AbsoluteFill>
);
export const TplCompositions: React.FC = () => (<>
  <Composition id="TPL-sample-long" component={TplSample} durationInFrames={tplTotal} fps={FPS} width={W} height={H}/>
  <Still id="TPL-sample-sheet" component={TplSheet} width={SHEET_COLS * CELL_W} height={Math.ceil(BEATS.length / SHEET_COLS) * (CELL_H + 30)}/>
</>);
