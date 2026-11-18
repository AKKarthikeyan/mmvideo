// Treatment B: painted plates + motion. Two MiniMax image-01 plates (one warm storybook style, no text) are split into
// depth layers with feathered masks and pushed with a parallax camera; shops are painted sprites cut from two more plates;
// water glints, light, coins, numbers and labels are code-drawn on top in the plates' palette.
import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {B1, B2, FONT, Grain, H, KineticNumber, Label, M1, MBlur, NUM, Vignette, W, inOut, lin, outQuint, particles, spr, wave} from "./common";

const est = staticFile("premium/b/establish.jpeg"), stage = staticFile("premium/b/stage.jpeg");
const shopA = staticFile("premium/b/shop_a.png"), shopB = staticFile("premium/b/shop_b.png");
const BROWN = "#4A2A12", CREAM = "#FFF6E2";

const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <radialGradient id="pb-ao" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2A1A08" stopOpacity="0.5"/><stop offset="1" stopColor="#2A1A08" stopOpacity="0"/></radialGradient>
      <radialGradient id="pb-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF1C4" stopOpacity="0.9"/><stop offset="1" stopColor="#FFD98A" stopOpacity="0"/></radialGradient>
      <linearGradient id="pb-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0"/><stop offset="0.5" stopColor="#FFFBEA" stopOpacity="0.55"/><stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/></linearGradient>
      <linearGradient id="pb-coinSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FBE19A"/><stop offset="0.25" stopColor="#EFC35E"/><stop offset="0.65" stopColor="#D49A3A"/><stop offset="1" stopColor="#9C6526"/>
      </linearGradient>
      <radialGradient id="pb-coinTop" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#FFF0BE"/><stop offset="0.55" stopColor="#F2C764"/><stop offset="1" stopColor="#D29A3E"/></radialGradient>
      <linearGradient id="pb-plinth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#EADBC0"/><stop offset="0.6" stopColor="#CDB590"/><stop offset="1" stopColor="#9E8461"/></linearGradient>
      <linearGradient id="pb-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FD6CF"/><stop offset="0.5" stopColor="#3E9DA0"/><stop offset="1" stopColor="#246C74"/></linearGradient>
      <linearGradient id="pb-wcol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A6E6DD"/><stop offset="0.45" stopColor="#4FB0AE"/><stop offset="1" stopColor="#24707A"/></linearGradient>
      <linearGradient id="pb-bank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F1D9A2"/><stop offset="1" stopColor="#C99E62"/></linearGradient>
      <clipPath id="pb-waterclip">
        <ellipse cx={330} cy={690} rx={300} ry={128}/><ellipse cx={1600} cy={680} rx={285} ry={120}/>
        <rect x={520} y={712} width={330} height={100} rx={40}/><rect x={1110} y={705} width={300} height={95} rx={40}/>
      </clipPath>
    </defs>
  </svg>
);
const Plate: React.FC<{src: string; scale: number; tx: number; ty: number; fx: number; fy: number; mask?: string}> = ({src, scale, tx, ty, fx, fy, mask}) => (
  <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: `${fx}px ${fy}px`, WebkitMaskImage: mask, maskImage: mask}}>
    <Img src={src} style={{width: W, height: H}}/>
  </AbsoluteFill>
);
const Cam: React.FC<{scale: number; tx: number; ty: number; fx: number; fy: number; children: React.ReactNode}> = ({scale, tx, ty, fx, fy, children}) => (
  <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: `${fx}px ${fy}px`}}>{children}</AbsoluteFill>
);
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", overflow: "visible"}}>{children}</svg>;

// A four-point painted glint.
const Glint: React.FC<{x: number; y: number; r: number; o: number}> = ({x, y, r, o}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d={`M 0 ${-r} Q 1.2 -1.2 ${r} 0 Q 1.2 1.2 0 ${r} Q -1.2 1.2 ${-r} 0 Q -1.2 -1.2 0 ${-r} Z`} fill="#FFFDF0"/>
    <circle r={r * 0.5} fill="#FFFFFF" opacity={0.5}/>
  </g>
);
const Bird: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => {
  const w = Math.sin(f * 0.42) * 9;
  return <path d={`M ${x - 16 * s} ${y + w * s * 0.6} Q ${x - 7 * s} ${y - 4 * s} ${x} ${y + 3 * s} Q ${x + 7 * s} ${y - 4 * s} ${x + 16 * s} ${y + w * s * 0.6}`} fill="none" stroke="#5B4632" strokeWidth={3.2 * s} strokeLinecap="round" opacity={0.65}/>;
};
// Painted shop sprite with a soft contact shadow; o = opacity, s = scale (sprite is 540 px wide at s = 1).
const Sprite: React.FC<{src: string; x: number; y: number; w: number; h: number; s: number; o?: number; hue?: number}> = ({src, x, y, w, h, s, o = 1, hue = 0}) => (
  <>
    <div style={{position: "absolute", left: x - w * s * 0.62, top: y - h * s * 0.08, width: w * s * 1.24, height: h * s * 0.16, borderRadius: "50%",
      background: "radial-gradient(closest-side, rgba(40,25,8,0.45), rgba(40,25,8,0))", opacity: o}}/>
    <Img src={src} style={{position: "absolute", left: x - (w * s) / 2, top: y - h * s, width: w * s, height: h * s, opacity: o,
      filter: hue ? `hue-rotate(${hue}deg) saturate(0.85)` : undefined}}/>
  </>
);

// ---------- Moment 1 ----------
const Moment1: React.FC<{f: number}> = ({f}) => {
  const p = lin(f, 0, M1, 0, 1, inOut);
  const sc = 1 + 0.11 * p, tx = -18 * p, ty = -6 * p, FX = 960, FY = 520;
  const glints = particles("bglint", 46);
  const motes = particles("bmote", 34);
  const A = 380, ROW = 880, copies = [[600, 880, 0.33], [250, 1010, 0.4], [500, 1010, 0.4]];
  const SA = 0.33, SB = 0.36;
  const moatO = lin(f, B1.moat, B1.moat + 24, 0, 1);
  return (
    <AbsoluteFill>
      <Plate src={est} scale={sc} tx={tx} ty={ty} fx={FX} fy={FY}/>
      <Cam scale={sc} tx={tx} ty={ty} fx={FX} fy={FY}>
        <Svg>
          {/* glints and a slow travelling sheen on the painted water */}
          <g clipPath="url(#pb-waterclip)">
            <rect x={-400 + ((f * 9) % 2600)} y={500} width={380} height={400} fill="url(#pb-sheen)" transform={`skewX(-28)`} opacity={0.28}/>
            {glints.map((g, i) => {
              const left = g.s < 0.5, x = left ? 60 + g.x * 760 : 1110 + g.x * 760, y = 570 + g.y * 260;
              return <Glint key={i} x={x} y={y} r={5 + g.r * 9} o={Math.max(0, Math.sin(f * 0.11 + g.p * 3)) ** 3 * 0.95}/>;
            })}
            {/* ripples spreading under the word MOAT */}
            {f >= B1.moat ? [0, 1, 2].map((i) => {
              const k = ((f - B1.moat) / 50 + i / 3) % 1;
              return <ellipse key={i} cx={1560} cy={690} rx={120 + 260 * k} ry={22 + 48 * k} fill="none" stroke="#FFFDF0" strokeWidth={3} opacity={(1 - k) * 0.6 * moatO}/>;
            }) : null}
          </g>
          {[0, 1, 2].map((i) => <Bird key={i} x={1250 + i * 54 - f * 1.3} y={210 + (i % 2) * 24} f={f + i * 6}/>)}
          {f >= B1.alone ? <circle cx={1560} cy={ROW - 80} r={200} fill="url(#pb-glow)" opacity={lin(f, B1.alone, B1.alone + 20, 0, 0.7)}/> : null}
          {B1.copy.map((st, i) => f >= st && f < st + 24 ? particles("bpuff" + i, 10).map((q, j) => {
            const k = (f - st) / 24;
            return <circle key={i + "-" + j} cx={A + Math.cos(q.p) * 110 * k} cy={ROW - 60 + Math.sin(q.p) * 55 * k} r={(14 + q.r * 14) * (1 - k * 0.5)} fill="#FFF8E8" opacity={(1 - k) * 0.75}/>;
          }) : null)}
        </Svg>
        {f >= B1.moat ? <MBlur f={f} render={(t) => (
          <div style={{position: "absolute", left: 1560, top: 640, transform: "translate(-50%, -50%)", display: "flex", gap: 4}}>
            {"MOAT".split("").map((ch, i) => {
              const s = spr(t, B1.moat + i * 4, 10, 150);
              return <span key={i} style={{display: "inline-block", fontFamily: FONT, fontWeight: 800, fontSize: 100, color: CREAM, letterSpacing: 8,
                transform: `translateY(${(1 - s) * 60}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)`, opacity: Math.min(1, s * 1.8),
                textShadow: "0 4px 0 #8A5A2B, 0 12px 26px rgba(40,22,6,0.5)"}}>{ch}</span>;
            })}
          </div>)}/> : null}
      </Cam>
      {/* painted shops: one gets copied three times (back row, then the front row), one stays alone */}
      <Cam scale={sc} tx={tx} ty={ty} fx={FX} fy={FY}>
        {f >= B1.shops ? <Sprite src={shopA} x={A} y={ROW} w={540} h={470} s={SA * (0.4 + 0.6 * spr(f, B1.shops, 12, 140))}/> : null}
        {copies.map((c, i) => {
          const st = B1.copy[i]; if (f < st) return null;
          const s = spr(f, st, 12, 130);
          return <Sprite key={i} src={shopA} x={A + (c[0] - A) * s} y={ROW + (c[1] - ROW) * s - Math.sin(Math.min(1, s) * Math.PI) * 40} w={540} h={470}
            s={(SA + (c[2] - SA) * s) * (0.5 + 0.5 * s)} o={lin(f, st, st + 8, 0, 1)}/>;
        })}
        {f >= B1.shops + 8 ? <Sprite src={shopB} x={1560} y={ROW} w={596} h={508} s={SB * (0.4 + 0.6 * spr(f, B1.shops + 8, 12, 140))}/> : null}
      </Cam>
      {/* near foreground: painted grass blades and flowers, out of focus, moving faster than the plate */}
      <AbsoluteFill style={{transform: `translate(${tx * 1.8}px, 0) scale(${1 + 0.2 * p})`, transformOrigin: `${FX}px ${FY}px`, filter: "blur(5px)"}}>
        <Svg>
          {particles("bfg", 46).map((q, i) => {
            const left = i % 2 === 0, x = left ? -40 + q.x * 330 : 1630 + q.x * 330, h = 120 + q.r * 170, sw = Math.sin(f * 0.05 + q.p) * 10;
            return <path key={i} d={`M ${x} 1100 Q ${x + 6 + sw * 0.5} ${1090 - h * 0.6} ${x + 14 + sw} ${1090 - h}`} stroke={q.s > 0.5 ? "#7A9A2E" : "#A9B83A"} strokeWidth={10 + q.s * 8} strokeLinecap="round" fill="none" opacity={0.9}/>;
          })}
          {particles("bfl", 8).map((q, i) => <circle key={i} cx={(i % 2 ? 1680 : 30) + q.x * 220} cy={950 + q.y * 90} r={10 + q.r * 8} fill={q.s > 0.5 ? "#F2C14E" : "#E9846B"} opacity={0.9}/>)}
        </Svg>
      </AbsoluteFill>
      <AbsoluteFill>
        <Svg>{motes.map((m, i) => <circle key={i} cx={(m.x * 2100 + f * (0.3 + m.s)) % 2100 - 90} cy={120 + m.y * 800 + Math.sin(f * 0.05 + m.p) * 14} r={1.6 + m.r * 3.2} fill="#FFF3C8" opacity={0.25 + 0.45 * Math.abs(Math.sin(f * 0.05 + m.p))}/>)}</Svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: "radial-gradient(ellipse 50% 45% at 72% 18%, rgba(255,236,180,0.35), rgba(255,236,180,0) 70%)", mixBlendMode: "screen"}}/>
      {/* golden bloom into moment 2 */}
      {f > 222 ? <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%, #FFF7E2 0%, #FFE9B8 60%, #F6D49A 100%)", opacity: lin(f, 222, M1, 0, 1, inOut)}}/> : null}
    </AbsoluteFill>
  );
};

// ---------- Moment 2 ----------
const K = 11, BASE = 842, GX = 700, RX = 1220, CR = 112, CRY = 30;
const stackH = (t: number, start: number, v: number) => v * K * lin(t, start, start + 34, 0, 1, outQuint);
const CoinStack: React.FC<{cx: number; h: number}> = ({cx, h}) => {
  if (h <= 0.5) return null;
  const top = BASE - h, n = Math.floor(h / K);
  return (
    <g>
      <path d={`M ${cx - CR} ${top} L ${cx - CR} ${BASE} A ${CR} ${CRY} 0 0 0 ${cx + CR} ${BASE} L ${cx + CR} ${top} Z`} fill="url(#pb-coinSide)"/>
      {Array.from({length: n}).map((_, i) => {
        const y = BASE - (i + 1) * K; if (y <= top + 2) return null;
        return <path key={i} d={`M ${cx - CR} ${y} A ${CR} ${CRY} 0 0 0 ${cx + CR} ${y}`} fill="none" stroke="#7E4E1A" strokeWidth={1.4} opacity={0.32}/>;
      })}
      <rect x={cx - CR * 0.62} y={top} width={CR * 0.22} height={h} fill="#FFF8DC" opacity={0.32}/>
      <rect x={cx + CR * 0.55} y={top} width={CR * 0.3} height={h} fill="#6B3E12" opacity={0.12}/>
      <ellipse cx={cx} cy={top} rx={CR} ry={CRY} fill="url(#pb-coinTop)"/>
      <ellipse cx={cx} cy={top} rx={CR - 12} ry={CRY - 4} fill="none" stroke="#B9822F" strokeWidth={2} opacity={0.5}/>
    </g>
  );
};
const Plinth: React.FC<{cx: number}> = ({cx}) => (
  <g>
    <ellipse cx={cx - 50} cy={BASE + 64} rx={240} ry={34} fill="url(#pb-ao)"/>
    <path d={`M ${cx - 150} ${BASE + 4} L ${cx - 150} ${BASE + 52} A 150 40 0 0 0 ${cx + 150} ${BASE + 52} L ${cx + 150} ${BASE + 4} Z`} fill="url(#pb-plinth)"/>
    <ellipse cx={cx} cy={BASE + 4} rx={150} ry={40} fill="#F1E4CC"/>
  </g>
);
const BigNum: React.FC<{t: number; start: number; to: number; x: number; y: number}> = ({t, start, to, x, y}) => {
  const s = spr(t, start, 12, 140), v = to * lin(t, start, start + 34, 0, 1, outQuint);
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`, fontFamily: FONT, fontWeight: 800, fontSize: 88,
    color: BROWN, fontVariantNumeric: "tabular-nums", letterSpacing: -2, whiteSpace: "nowrap", textShadow: "0 0 22px rgba(255,246,220,0.9), 0 2px 0 rgba(255,246,220,0.8)", opacity: Math.min(1, s * 2), lineHeight: 1}}>₹{v.toFixed(2)}</div>;
};

const Moment2: React.FC<{f: number}> = ({f}) => {
  const p = lin(f, 0, 240, 0, 1, inOut), sc = 1.02 + 0.05 * p, tx = -14 * p, FX = 960, FY = 600;
  const gTop = BASE - NUM.geico * K, rTop = BASE - NUM.rivals * K;
  const fill = lin(f, B2.fill, B2.fill + 26, 0, 1, inOut), drain = lin(f, B2.drain, B2.drain + 30, 0, 1, inOut), ring = lin(f, B2.ring, B2.ring + 34, 0, 1, outQuint);
  const wTop = rTop + 6 + (gTop - rTop - 6) * (1 - fill + drain * fill);
  const motes = particles("bm2", 30);
  return (
    <AbsoluteFill>
      <Plate src={stage} scale={sc} tx={tx} ty={0} fx={FX} fy={FY}/>
      <Cam scale={sc} tx={tx} ty={0} fx={FX} fy={FY}>
        <Svg>
          {[0, 1].map((i) => <Bird key={i} x={300 + i * 50 + f * 1.1} y={300 + i * 20} f={f + i * 8} s={0.8}/>)}
          {ring > 0 ? <g>
            <ellipse cx={GX} cy={BASE + 52} rx={150 + 150 * ring} ry={40 + 34 * ring} fill="url(#pb-bank)"/>
            <ellipse cx={GX} cy={BASE + 52} rx={145 + 132 * ring} ry={38 + 28 * ring} fill="url(#pb-water)"/>
            {particles("bring", 14).map((q, i) => <Glint key={i} x={GX - 240 * ring + q.x * 480 * ring} y={BASE + 30 + q.y * 50 * ring} r={4 + q.r * 6} o={ring * Math.max(0, Math.sin(f * 0.12 + q.p * 3)) ** 3}/>)}
          </g> : null}
          <Plinth cx={GX}/><Plinth cx={RX}/>
          <CoinStack cx={GX} h={stackH(f, B2.geico, NUM.geico)}/>
          <CoinStack cx={RX} h={stackH(f, B2.rivals, NUM.rivals)}/>
          {f >= B2.line ? <line x1={RX + CR} y1={rTop} x2={RX + CR - (RX - GX + CR * 2 + 40) * lin(f, B2.line, B2.line + 16, 0, 1)} y2={rTop}
            stroke="#7A4E25" strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" opacity={0.8 * (1 - drain)}/> : null}
          {f >= B2.fill ? <g opacity={1 - drain}>
            <path d={`M ${GX - CR} ${rTop} L ${GX - CR} ${gTop} A ${CR} ${CRY} 0 0 0 ${GX + CR} ${gTop} L ${GX + CR} ${rTop}`} fill="#FFFFFF" fillOpacity={0.18} stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={2}/>
            <ellipse cx={GX} cy={rTop} rx={CR} ry={CRY} fill="none" stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={2}/>
          </g> : null}
          {f >= B2.fill && wTop < gTop - 1 ? <g>
            <path d={`M ${GX - CR} ${wTop} L ${GX - CR} ${gTop} A ${CR} ${CRY} 0 0 0 ${GX + CR} ${gTop} L ${GX + CR} ${wTop} Z`} fill="url(#pb-wcol)" opacity={0.93}/>
            <ellipse cx={GX} cy={wTop} rx={CR} ry={CRY} fill="#B5EDE4"/>
            <path d={wave(GX - CR + 10, GX + CR - 10, wTop, 3, 60, f * 0.3)} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.7}/>
          </g> : null}
          {drain > 0 && drain < 1 ? [-1, 1].map((sd) => (
            <path key={sd} d={`M ${GX + sd * (CR - 6)} ${wTop + 6} Q ${GX + sd * (CR + 40)} ${wTop + 40} ${GX + sd * (CR + 60)} ${BASE + 40}`} stroke="#6CC3BC" strokeWidth={14 * (1 - drain * 0.5)} fill="none" strokeLinecap="round" opacity={0.85}/>
          )) : null}
          {f >= B2.ring + 22 ? (() => {
            const s = spr(f, B2.ring + 22, 10, 160), fl = Math.sin(f * 0.2) * 6;
            return <g transform={`translate(${GX} ${gTop}) scale(${s})`}>
              <line x1={0} y1={0} x2={0} y2={-90} stroke="#5A3A2A" strokeWidth={5}/>
              <path d={`M 0 -90 Q 26 ${-96 + fl} 56 ${-84 - fl} L 52 ${-60 - fl} Q 26 ${-68 + fl} 0 -62 Z`} fill="#C8452F"/>
            </g>;
          })() : null}
        </Svg>
        <Label f={f} start={B2.geico - 4} x={GX} y={BASE + 152} text="GEICO" size={40} color={BROWN} weight={800} bg="rgba(255,246,226,0.92)" spacing={2} border="2px solid #C9A46A"/>
        <Label f={f} start={B2.rivals - 4} x={RX} y={BASE + 152} text="Many rivals" size={40} color={BROWN} weight={800} bg="rgba(255,246,226,0.92)" spacing={1} border="2px solid #C9A46A"/>
        <MBlur f={f} render={(t) => {
          if (t < B2.geico) return null;
          const mv = lin(t, B2.fill - 8, B2.fill + 14, 0, 1, inOut);
          return <BigNum t={t} start={B2.geico} to={NUM.geico} x={GX - mv * (CR + 190)} y={BASE - stackH(t, B2.geico, NUM.geico) - 80 + mv * 140}/>;
        }}/>
        <MBlur f={f} render={(t) => t < B2.rivals ? null : <BigNum t={t} start={B2.rivals} to={NUM.rivals} x={RX} y={BASE - stackH(t, B2.rivals, NUM.rivals) - 80}/>}/>
        <AbsoluteFill style={{transform: `translate(${-drain * (CR + 34 + 410)}px, ${drain * (BASE - (rTop + gTop) / 2 - 18)}px) scale(${1 - drain * 0.15})`, transformOrigin: `${GX + CR + 34}px ${(rTop + gTop) / 2}px`}}>
          <KineticNumber f={f} start={B2.gap} to={NUM.gap} x={GX + CR + 34} y={(rTop + gTop) / 2 + 8} size={112} color="#1F6B70" align="left" dur={18}
            shadow="0 0 22px rgba(255,248,226,0.95), 0 2px 0 rgba(255,248,226,0.9)"/>
        </AbsoluteFill>
        <Label f={f} start={B2.ring + 16} x={GX - 250} y={BASE + 112} text="Moat" size={44} color={CREAM} weight={800} bg="#2F7F84" spacing={3}/>
      </Cam>
      <Plate src={stage} scale={1.02 + 0.08 * p} tx={tx * 1.5} ty={0} fx={FX} fy={FY} mask="linear-gradient(to bottom, rgba(0,0,0,0) 96%, rgba(0,0,0,1) 100%)"/>
      <AbsoluteFill>
        <Svg>{motes.map((m, i) => <circle key={i} cx={(m.x * 2000 + f * (0.3 + m.s)) % 2000 - 40} cy={120 + m.y * 760 + Math.sin(f * 0.05 + m.p) * 14} r={1.6 + m.r * 3} fill="#FFF3C8" opacity={0.3 + 0.4 * Math.abs(Math.sin(f * 0.05 + m.p))}/>)}</Svg>
      </AbsoluteFill>
      <Label f={f} start={B2.paid} x={960} y={78} text="Of every" size={36} color={BROWN} weight={600} spacing={1} shadow="0 0 16px rgba(255,246,220,0.9)"/>
      <KineticNumber f={f} start={B2.paid + 4} to={NUM.paid} from={NUM.paid} x={960} y={150} size={92} color={BROWN} dur={1} shadow="0 0 22px rgba(255,246,220,0.95)"/>
      {f < 16 ? <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%, #FFF7E2 0%, #FFE9B8 60%, #F6D49A 100%)", opacity: lin(f, 0, 16, 1, 0, inOut)}}/> : null}
    </AbsoluteFill>
  );
};

export const PremiumB: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#F6D49A", overflow: "hidden"}}>
      <Defs/>
      {frame < M1 ? <Moment1 f={frame}/> : <Moment2 f={frame - M1}/>}
      <Vignette strength={0.3} color="60,35,10"/>
      <Grain f={frame} opacity={0.08} blend="soft-light"/>
    </AbsoluteFill>
  );
};
