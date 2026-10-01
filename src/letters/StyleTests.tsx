// Four 10-second 16:9 style tests for fund-letter videos, all on verified Nomad (Nick Sleep) content:
// ST-Doc16 (16 mm documentary cold open), ST-Data (editorial data viz), ST-Kinetic (kinetic typography), ST-Line (single line).
// Ideas taken from the animasyon-stil-katalogu catalogue (no licence, so nothing copied; all rebuilt here).
import React from "react";
import {AbsoluteFill, Audio, Composition, Img, random, staticFile, useCurrentFrame, interpolate, Easing} from "remotion";
import {svgPathProperties} from "svg-path-properties";
import p147 from "../../public/letters/tests/p147.json";

const FPS = 30, N = 300;
const SERIF = "'Iowan Old Style', Charter, Georgia, serif";
const P = {paper: "#F1E9D8", ink: "#1E1A15", blue: "#234E7D", red: "#B3342A", gray: "#7A7266", hl: "#E9C46A"};
const ease = Easing.inOut(Easing.cubic);
const pr = (f: number, a: number, d: number, e = ease) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});

// ---------- 1. 16 mm documentary ----------
export const Film: React.FC<{children: React.ReactNode; overlay?: React.ReactNode}> = ({children, overlay}) => {
  const f = useCurrentFrame();
  const flick = 0.88 + 0.12 * random(`fl${f}`);
  const wx = (random(`wx${f}`) - 0.5) * 3, wy = (random(`wy${f}`) - 0.5) * 3;
  const scratches = Array.from({length: 3}, (_, i) => random(`s${i}${Math.floor(f / 3)}`) > 0.55 ? random(`sx${i}${Math.floor(f / 3)}`) * 1920 : -10);
  return (
    <AbsoluteFill style={{background: "#0d0c0a"}}>
      <AbsoluteFill style={{transform: `translate(${wx}px,${wy}px)`, opacity: flick, filter: "grayscale(1) sepia(0.25) contrast(1.15)"}}>{children}</AbsoluteFill>
      {overlay && <AbsoluteFill style={{transform: `translate(${wx}px,${wy}px)`, opacity: flick}}>{overlay}</AbsoluteFill>}
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <filter id="g16"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed={f % 12}/>
            <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0.22 0"/></filter>
          <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="0.55" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity="0.85"/></radialGradient>
        </defs>
        <rect width={1920} height={1080} filter="url(#g16)"/>
        {scratches.map((x, i) => <line key={i} x1={x} y1={0} x2={x + 6} y2={1080} stroke="#eee" strokeWidth={1.2} opacity={0.35}/>)}
        {random(`dust${f}`) > 0.8 && <circle cx={random(`dx${f}`) * 1920} cy={random(`dy${f}`) * 1080} r={3 + random(`dr${f}`) * 5} fill="#ddd" opacity={0.5}/>}
        <rect width={1920} height={1080} fill="url(#vig)"/>
      </svg>
    </AbsoluteFill>
  );
};
const Doc16: React.FC = () => {
  const f = useCurrentFrame();
  const title = f < 110;
  const t1 = pr(f, 8, 20), t2 = pr(f, 30, 20), t3 = pr(f, 55, 20), out = 1 - pr(f, 96, 12);
  // page: fit height, then push in on the -45.3% cell
  const ph = 1080 * 1.05, pw = ph * p147.aspect;
  const [hx, hy, hw, hh] = p147.hit;
  const z = interpolate(f, [115, 250], [1, 3.1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
  const cx = (hx + hw / 2) * pw, cy = (hy + hh / 2) * ph;
  const k = pr(f, 115, 135);
  const tx = 960 - (pw / 2 + (cx - pw / 2) * k) , ty = 540 - (ph / 2 + (cy - ph / 2) * k);
  const ring = pr(f, 232, 26, Easing.out(Easing.cubic));
  const rC = 2 * Math.PI * 1; void rC;
  return (
    <Film>
      {title ? (
        <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: out}}>
          <div style={{position: "absolute", inset: 90, border: "3px solid #ddd", opacity: t1}}/>
          <div style={{position: "absolute", inset: 104, border: "1px solid #ddd", opacity: t1}}/>
          <div style={{fontFamily: SERIF, color: "#eee", fontSize: 30, letterSpacing: 14, opacity: t1}}>THE NOMAD LETTERS</div>
          <div style={{fontFamily: SERIF, color: "#fff", fontSize: 130, marginTop: 30, opacity: t2}}>December 2008</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", color: "#ddd", fontSize: 40, marginTop: 30, opacity: t3}}>A letter written in the worst year</div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{opacity: pr(f, 110, 10)}}>
          <div style={{position: "absolute", left: 0, top: 0, width: pw, height: ph, transformOrigin: `${cx}px ${cy}px`,
            transform: `translate(${tx}px, ${ty}px) scale(${z})`}}>
            <Img src={staticFile("letters/tests/p147.png")} style={{width: pw, height: ph}}/>
            <svg width={pw} height={ph} style={{position: "absolute", left: 0, top: 0}}>
              <ellipse cx={cx} cy={cy} rx={hw * pw * 0.8} ry={hh * ph * 0.78} fill="none" stroke="#111" strokeWidth={2.2}
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring}/>
            </svg>
          </div>
        </AbsoluteFill>
      )}
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, padding: "22px 120px", background: "rgba(10,10,8,0.82)", fontFamily: SERIF, fontStyle: "italic", color: "#ddd", fontSize: 26, opacity: f > 130 ? 1 : 0}}>
        Nomad Investment Partnership, annual letter for the period ended 31 Dec 2008 · p.147 · unaudited, before fees</div>
    </Film>
  );
};

// ---------- 2. Editorial data viz ----------
const YEARS: [string, number, number][] = [["2001*", 10.1, 3.6], ["2002", 1.3, -19.9], ["2003", 79.6, 33.1], ["2004", 22.1, 14.7],
  ["2005", 9.2, 9.5], ["2006", 13.6, 20.1], ["2007", 21.2, 9.0], ["2008", -45.3, -40.7]];
const Data: React.FC = () => {
  const f = useCurrentFrame();
  const x0 = 200, y0 = 650, sc = 4.0, gw = 165, bw = 58;
  const hd = pr(f, 0, 14), leg = pr(f, 10, 12);
  const fin = pr(f, 205, 40, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: "#FAF7F0"}}>
      <div style={{position: "absolute", left: 200, top: 70, opacity: hd}}>
        <div style={{fontFamily: SERIF, fontSize: 24, letterSpacing: 5, color: P.red, fontWeight: 700}}>NOMAD INVESTMENT PARTNERSHIP · CALENDAR-YEAR RESULTS</div>
        <div style={{fontFamily: SERIF, fontSize: 64, fontWeight: 700, color: P.ink, marginTop: 10}}>Eight years, and one very bad one</div>
        <div style={{display: "flex", gap: 40, marginTop: 16, fontFamily: SERIF, fontSize: 28, color: P.ink, opacity: leg}}>
          <span><span style={{display: "inline-block", width: 22, height: 22, background: P.red, marginRight: 10}}/>Nomad (before fees)</span>
          <span><span style={{display: "inline-block", width: 22, height: 22, background: "#9A948A", marginRight: 10}}/>MSCI World Index (net) US$</span>
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        {[-40, 0, 40, 80].map((v) => <g key={v}>
          <line x1={x0 - 20} x2={x0 + gw * 8 + 10} y1={y0 - v * sc} y2={y0 - v * sc} stroke={v === 0 ? P.ink : "#d8d2c4"} strokeWidth={v === 0 ? 2.5 : 1.2}/>
          <text x={x0 - 34} y={y0 - v * sc + 9} textAnchor="end" fontFamily={SERIF} fontSize={24} fill={P.gray}>{v > 0 ? "+" : ""}{v}%</text></g>)}
        {YEARS.map(([y, a, b], i) => {
          const p = pr(f, 22 + i * 16, 22, Easing.out(Easing.cubic));
          const gx = x0 + i * gw + 20;
          const bar = (v: number, x: number, c: string) => <rect x={x} y={v >= 0 ? y0 - v * sc * p : y0} width={bw} height={Math.abs(v) * sc * p} fill={c}/>;
          const last = i === 7;
          return <g key={y}>
            {bar(a, gx, P.red)}{bar(b, gx + bw + 6, "#9A948A")}
            <text x={gx + bw} y={y0 + 250} textAnchor="middle" fontFamily={SERIF} fontSize={26} fill={P.ink}>{y}</text>
            <text x={gx + bw / 2} y={a >= 0 ? y0 - a * sc * p - 12 : y0 + Math.abs(a) * sc * p + 32} textAnchor="middle" fontFamily={SERIF} fontSize={last ? 30 : 22}
              fontWeight={last ? 700 : 400} fill={P.red} opacity={p}>{a > 0 ? "+" : "−"}{Math.abs(a).toFixed(1)}</text>
          </g>;
        })}
        <text x={x0} y={y0 + 285} fontFamily={SERIF} fontSize={20} fill={P.gray} fontStyle="italic">* 2001 from inception, 10 Sept 2001</text>
      </svg>
      <div style={{position: "absolute", left: 1555, top: 330, width: 330, opacity: fin, transform: `translateY(${(1 - fin) * 30}px)`,
        borderLeft: `5px solid ${P.red}`, paddingLeft: 26}}>
        <div style={{fontFamily: SERIF, fontSize: 24, letterSpacing: 3, color: P.gray}}>SINCE INCEPTION</div>
        <div style={{fontFamily: SERIF, fontSize: 64, fontWeight: 700, color: P.red, lineHeight: 1.1}}>+{(101.1 * fin).toFixed(1)}%</div>
        <div style={{fontFamily: SERIF, fontSize: 30, color: P.ink}}>vs +{(7.7 * fin).toFixed(1)}% for the index</div>
      </div>
      <div style={{position: "absolute", left: 200, bottom: 50, fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: P.gray}}>
        Source: Nomad annual letter, period ended 31 Dec 2008, p.147. As printed: unaudited, cumulative, before fees.</div>
    </AbsoluteFill>
  );
};

// ---------- 3. Kinetic typography ----------
const WORDS: {w: string; at: number; size: number; style?: React.CSSProperties}[] = [
  {w: "For these", at: 10, size: 64, style: {fontStyle: "italic", color: P.gray}},
  {w: "high street", at: 34, size: 120, style: {fontWeight: 700}},
  {w: "competitors", at: 58, size: 120, style: {fontWeight: 700}},
  {w: "the game", at: 110, size: 150, style: {fontStyle: "italic"}},
  {w: "is", at: 136, size: 150, style: {fontStyle: "italic"}},
  {w: "over.", at: 160, size: 260, style: {fontWeight: 700, color: P.red}},
];
const Kinetic: React.FC = () => {
  const f = useCurrentFrame();
  const phase2 = f >= 104;
  const shown = WORDS.filter((w) => (phase2 ? w.at >= 104 : w.at < 104));
  const clear = phase2 ? 1 : 1 - pr(f, 92, 10);
  const src = pr(f, 215, 16);
  return (
    <AbsoluteFill style={{background: P.paper, alignItems: "center", justifyContent: "center"}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", opacity: clear}}>
        {(phase2 ? [shown] : shown.map((w) => [w])).map((row, ri) => (
          <div key={ri} style={{display: "flex", alignItems: "baseline", gap: 40}}>
            {row.map((w) => {
              const p = pr(f, w.at, 9, Easing.out(Easing.back(1.6)));
              const punch = w.w === "over." ? 1 + 0.06 * Math.sin(Math.min(1, pr(f, w.at, 14)) * Math.PI) : 1;
              return <span key={w.w} style={{fontFamily: SERIF, fontSize: w.size, lineHeight: 1.05, color: P.ink, ...w.style, opacity: p,
                display: "inline-block", transform: `translateY(${(1 - p) * 40}px) scale(${punch})`}}>{w.w}</span>;
            })}
          </div>))}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 140, textAlign: "center", opacity: src}}>
        <div style={{width: 120, height: 3, background: P.blue, margin: "0 auto 22px"}}/>
        <div style={{fontFamily: SERIF, fontSize: 32, color: P.blue}}>Nick Sleep, on Amazon's high-street rivals</div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: P.gray, marginTop: 8}}>Nomad letter, period ended 31 Dec 2008 · p.151</div>
      </div>
      <Audio src={staticFile("letters/tick.wav")} volume={0.35} endAt={N}/>
    </AbsoluteFill>
  );
};

// ---------- 4. Single line ----------
// One unbroken stroke: enters left, draws the loop (savings -> prices -> buy more -> scale), leaves the loop,
// becomes a light bulb, and exits right. Labels only appear once the line has passed them.
const LOOP_C = [640, 520], LR = 190;
const D = [
  "M -20 820 C 200 820 260 760 360 700",
  `C 420 660 450 560 ${LOOP_C[0] - LR} ${LOOP_C[1]}`,
  `A ${LR} ${LR} 0 1 1 ${LOOP_C[0] - LR + 0.1} ${LOOP_C[1] + 1}`,
  `C 470 700 700 820 980 820 C 1160 820 1240 760 1270 700`,
  "C 1180 640 1150 520 1200 440 C 1250 360 1400 360 1450 440 C 1500 520 1470 640 1380 700",
  "C 1370 740 1370 760 1370 780 L 1280 780 L 1280 800 L 1370 800 L 1370 820 L 1290 820",
  "C 1500 830 1700 820 1960 820",
].join(" ");
const props = new svgPathProperties(D);
const LEN = props.getTotalLength();
const LABELS = [
  {t: "Scale savings", x: 640, y: 290, at: 0.22},
  {t: "Lower prices", x: 855, y: 530, at: 0.3, a: "start"},
  {t: "Customers buy more", x: 640, y: 532, at: 0.38},
  {t: "Greater scale", x: 425, y: 470, at: 0.46, a: "end"},
  {t: "…and a million little actions", x: 1330, y: 300, at: 0.75},
];
const Line: React.FC = () => {
  const f = useCurrentFrame();
  const p = pr(f, 6, 230, Easing.inOut(Easing.sin));
  const tip = props.getPointAtLength(Math.max(0.01, p * LEN));
  const glow = pr(f, 225, 20);
  return (
    <AbsoluteFill style={{background: P.paper}}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs><radialGradient id="bulbglow"><stop offset="0" stopColor="#FFE9A0" stopOpacity="0.9"/><stop offset="1" stopColor="#FFE9A0" stopOpacity="0"/></radialGradient></defs>
        <circle cx={1325} cy={540} r={260} fill="url(#bulbglow)" opacity={glow}/>
        <path d={D} fill="none" stroke={P.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)}/>
        {p < 1 && <circle cx={tip.x} cy={tip.y} r={7} fill={P.red}/>}
        {LABELS.map((l) => {
          const o = pr(f, 6 + l.at * 230, 14);
          return <text key={l.t} x={l.x} y={l.y} textAnchor={(l as any).a ?? "middle"} fontFamily={SERIF} fontSize={l.at > 0.7 ? 38 : 34}
            fontStyle={l.at > 0.7 ? "italic" : "normal"} fill={l.at > 0.7 ? P.blue : P.ink} opacity={o}>{l.t}</text>;
        })}
      </svg>
      <div style={{position: "absolute", left: 120, bottom: 60, fontFamily: SERIF, fontStyle: "italic", fontSize: 24, color: P.gray, opacity: pr(f, 240, 14)}}>
        Nomad letters: scale economics shared (31 Dec 2008, p.151) · “a million little actions” (30 Jun 2010, p.175)</div>
    </AbsoluteFill>
  );
};

export const StyleTestCompositions: React.FC = () => (
  <>
    <Composition id="ST-Doc16" component={Doc16} durationInFrames={N} fps={FPS} width={1920} height={1080}/>
    <Composition id="ST-Data" component={Data} durationInFrames={N} fps={FPS} width={1920} height={1080}/>
    <Composition id="ST-Kinetic" component={Kinetic} durationInFrames={N} fps={FPS} width={1920} height={1080}/>
    <Composition id="ST-Line" component={Line} durationInFrames={N} fps={FPS} width={1920} height={1080}/>
  </>
);
