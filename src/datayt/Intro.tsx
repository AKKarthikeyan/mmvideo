// Data Kadai channel intro: two findings from built Shorts, the logo, the promise, the day themes, the end card.
// Two cuts from one file: the Short (1080x1920) and the long cut (1920x1080, `wide`), which puts the words on the left and the picture on the right.
// Scenes, cues and both findings come from public/datayt/intro/data.json (scripts/datayt/build_intro.py). The name comes from BRAND.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import data from "../../public/datayt/intro/data.json";
import {P} from "./IndiaShort";
import {BRAND, Mark} from "./Brand";

const FPS = 30;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Scene = {kind: string; t0: number; t1: number; cues: number[]};
type Find = {name: string; big: string; text: string; source: string; income?: string};
type IntroData = {total: number; scenes: Scene[]; vo: {file: string; at: number; sec: number}[]; up: Find; bihar: Find; themes: string[]; tables: string[]};
export const INTRO = data as unknown as IntroData;
type G = {name: string; d: string; lx: number; ly: number};
const STATES = geo.states as G[];
const GEO = Object.fromEntries(STATES.map((g) => [g.name, g]));
const [NAME_A, NAME_B] = BRAND.name.toUpperCase().split(" ");

// The frame: the long cut has a 90 px margin and two columns, words in the left one (810 wide), the picture from x = 960.
const Wide = React.createContext(false);
const useWide = () => React.useContext(Wide);
const WM = 90, WCOL = 810, WRIGHT = 960, WRW = 870;

const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const pop = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: 170}});
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const fit = (text: string, max: number, width: number, ratio = 0.5) => Math.min(max, width / (Math.max(1, text.replace(/\*/g, "").length) * ratio));
const mix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16), q = Math.max(0, Math.min(1, p));
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * q).toString(16).padStart(2, "0")).join("");
};

const Wordmark: React.FC<{size: number}> = ({size}) => (
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: size, letterSpacing: size * 0.02, color: P.ink, lineHeight: 1, whiteSpace: "nowrap"}}>
    {NAME_A} <span style={{color: P.gold}}>{NAME_B}</span>
  </div>
);

// Headline lines, each kept on one line. Short: at the top, each line as large as it fits. Long cut: in the left column, one size
// for the block, centred on the frame's height unless `wtop` places it.
const Head: React.FC<{lines: string[]; f0: number; max?: number; top?: number; wtop?: number}> = ({lines, f0, max = 132, top = 160, wtop}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  const even = Math.min(...lines.map((l) => fit(l, max, WCOL)));
  return <div style={{position: "absolute", left: wide ? WM : 60, width: wide ? WCOL : 960, top: wide ? wtop ?? (1080 - lines.length * even * 1.04) / 2 - 40 : top}}>
    {lines.map((l, i) => {
      const q = pop(f, f0 - 10 + i * 5);      // the first lines are already there on the scene's first frame
      return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: wide ? even : fit(l, max, 960), lineHeight: 1.04, color: P.ink, whiteSpace: "nowrap",
        opacity: Math.min(1, q * 1.4), transform: `translateY(${(1 - q) * 40}px)`}}><Rich text={l} acc={P.gold}/></div>;
    })}
  </div>;
};

// India's outline in its own strip (below the headline in the Short, the right column in the long cut): no headline reaches the map.
const useMap = () => {
  const wide = useWide();
  const top = wide ? 60 : 730, h = wide ? 960 : 880, S = h / geo.h;
  return {top, h, S, x: wide ? 1920 - WM - geo.w * S : (1080 - geo.w * S) / 2};
};
type Lit = {name: string; color: string; at: number};
const FindMap: React.FC<{lit: Lit[]; scan?: [number, number]}> = ({lit, scan}) => {
  const f = useCurrentFrame();
  const M = useMap();
  // before the reveal a tint hops from state to state, so the map is moving while the question is asked
  const hop = scan && f >= scan[0] && f < scan[1] ? Math.floor((f - scan[0]) / 3) : -1;
  const order = [...STATES].sort((a, b) => Number(!!lit.find((l) => l.name === a.name)) - Number(!!lit.find((l) => l.name === b.name)));
  return <svg width={geo.w * M.S} height={M.h} style={{position: "absolute", left: M.x, top: M.top, overflow: "visible"}}>
    <g transform={`scale(${M.S})`}>
      {order.map((g) => {
        const on = lit.find((l) => l.name === g.name);
        const p = on ? pop(f, on.at) : 0;
        const sc = on && f >= on.at ? 1 + 0.08 * Math.sin(Math.min(1, p) * Math.PI) : 1;
        const hopOn = hop >= 0 && STATES.indexOf(g) === (hop * 7) % STATES.length;
        const fill = on ? mix(P.empty, on.color, p * 1.5) : hopOn ? mix(P.empty, P.cyan, 0.55) : P.empty;
        return <g key={g.name} transform={`translate(${g.lx},${g.ly}) scale(${sc}) translate(${-g.lx},${-g.ly})`}>
          <path d={g.d} fillRule="evenodd" fill={fill} stroke={P.ink} strokeOpacity={on && f >= on.at ? 1 : 0.4} strokeWidth={on && f >= on.at ? 2.4 : 1.1} strokeLinejoin="round"/>
        </g>;
      })}
    </g>
  </svg>;
};

// The figure for one state, pinned to it on the map.
const Callout: React.FC<{d: Find; at: number; below?: boolean}> = ({d, at, below = false}) => {
  const f = useCurrentFrame();
  const M = useMap();
  if (f < at) return null;
  const g = GEO[d.name], p = pop(f, at);
  const x = M.x + g.lx * M.S, y = M.top + g.ly * M.S;
  return <div style={{position: "absolute", left: x, top: below ? y + 44 : y - 44, transform: `translate(-50%, ${below ? 0 : -100}%) scale(${0.6 + 0.4 * p})`,
    transformOrigin: below ? "50% 0%" : "50% 100%", opacity: Math.min(1, p * 1.6)}}>
    <svg width={44} height={24} style={{position: "absolute", left: "50%", marginLeft: -22, ...(below ? {top: -22} : {bottom: -22})}}>
      <path d={below ? "M0 24 L22 0 L44 24 Z" : "M0 0 L22 24 L44 0 Z"} fill={P.gold}/>
    </svg>
    <div style={{background: P.gold, borderRadius: 18, padding: "16px 30px 20px", textAlign: "center", whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(31,26,23,0.25)"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: P.bg, opacity: 0.85}}>{d.name.toUpperCase()}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 112, lineHeight: 1.05, color: "#FFFFFF"}}>{d.big}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.bg}}>{d.text}</div>
    </div>
  </div>;
};

const Source: React.FC<{text: string; at: number}> = ({text, at}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  return <div style={{position: "absolute", fontFamily: SANS, fontSize: 22, lineHeight: 1.3, color: P.mute, opacity: ease(f, at, at + 8),
    ...(wide ? {left: WM, width: 760, top: 880} : {left: 60, right: 330, top: 1630})}}>{text}</div>;
};

type SP = {D: IntroData; s: Scene; f0: number};

const Tease: React.FC<SP> = ({D, s, f0}) => {
  const at = F(s.cues[1]);
  return <AbsoluteFill>
    <Head lines={["*One state* grows", "nearly *half* of", "India's sugarcane."]} f0={f0}/>
    <FindMap lit={[{name: D.up.name, color: P.gold, at}]} scan={[f0, at]}/>
    <Callout d={D.up} at={at}/>
    <Source text={D.up.source} at={at}/>
  </AbsoluteFill>;
};

const Second: React.FC<SP> = ({D, f0}) => (
  <AbsoluteFill>
    <Head lines={["*Bihar:* lowest", "income per person.", "*5G* in 96 of", "100 villages."]} f0={f0}/>
    <FindMap lit={[{name: D.up.name, color: mix(P.empty, P.cyan, 0.7), at: -99}, {name: D.bihar.name, color: P.gold, at: f0 - 6}]}/>
    <Callout d={D.bihar} at={f0 + 14} below/>
    <Source text={D.bihar.source} at={f0 + 14}/>
  </AbsoluteFill>
);

// A wall of table cells, one row per publisher; three cells open to show the figures just seen.
const Tables: React.FC<SP> = ({D, s, f0}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  const open = F(s.cues[1]);
  const cols = 6, gap = 14, rw = wide ? WRW : 960, cw = (rw - gap * (cols - 1)) / cols;
  const shown: Record<string, string> = {"0-4": D.bihar.income ?? "", "1-2": D.up.big, "3-3": D.bihar.big};
  const sub = "You just have to open them.";
  return <AbsoluteFill>
    <Head lines={["India's official", "tables are *full of*", "*numbers* like these."]} f0={f0} max={112} wtop={250}/>
    <div style={{position: "absolute", fontFamily: COND, fontWeight: 700, color: P.cyan, whiteSpace: "nowrap", opacity: Math.min(1, pop(f, open) * 1.4),
      transform: `translateY(${(1 - pop(f, open)) * 30}px)`, ...(wide ? {left: WM, top: 560, fontSize: fit(sub, 84, WCOL, 0.46)} : {left: 60, top: 548, fontSize: 84})}}>{sub}</div>
    {D.tables.map((name, r) => <div key={name} style={{position: "absolute", left: wide ? WRIGHT : 60, top: (wide ? 110 : 712) + r * 124, width: rw,
      opacity: ease(f, f0 + 2 + r * 3, f0 + 10 + r * 3)}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 27, color: P.mute, whiteSpace: "nowrap"}}>{name}</div>
      <div style={{display: "flex", gap, marginTop: 8}}>
        {Array.from({length: cols}, (_, c) => {
          const v = shown[`${r}-${c}`];
          const p = v ? pop(f, open + 4 + r * 5) : 0;
          return <div key={c} style={{width: cw, height: 60, borderRadius: 10, background: v ? mix(P.empty, P.gold, p * 1.5) : P.empty, display: "flex", alignItems: "center",
            justifyContent: "center", transform: `scale(${v ? 1 + 0.12 * Math.sin(Math.min(1, p) * Math.PI) : 1})`}}>
            {v && f >= open + 4 + r * 5
              ? <div style={{fontFamily: COND, fontWeight: 700, fontSize: wide ? 34 : 38, color: "#FFFFFF", opacity: Math.min(1, p * 1.6)}}>{v}</div>
              : <div style={{width: 46 + ((r * 5 + c * 11) % 5) * 12, height: 8, borderRadius: 4, background: P.line, opacity: 0.7}}/>}
          </div>;
        })}
      </div>
    </div>)}
  </AbsoluteFill>;
};

// The mark drawn in order: the glass, the three bars rising, the steam.
const AnimMark: React.FC<{size: number; at: number}> = ({size, at}) => {
  const f = useCurrentFrame();
  const g = ease(f, at, at + 14);
  const bars = [{x: 31, h: 18, c: P.cyan, o: 0.6}, {x: 45, h: 28, c: P.cyan, o: 1}, {x: 59, h: 38, c: P.gold, o: 1}];
  const s1 = ease(f, at + 26, at + 40), s2 = ease(f, at + 32, at + 44);
  const sway = Math.sin((f - at) / 9) * 1.2;
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible"}}>
    <path d="M18 34 L82 34 L75 92 Q74 96 70 96 L30 96 Q26 96 25 92 Z" fill="none" stroke={P.cyan} strokeWidth="4.5" strokeLinejoin="round"
          pathLength={1} strokeDasharray={g < 1 ? 1 : undefined} strokeDashoffset={g < 1 ? 1 - g : undefined} opacity={g > 0 ? 1 : 0}/>
    <line x1="21" y1="46" x2={21 + 58 * g} y2="46" stroke={P.cyan} strokeWidth="2.5" opacity={0.5 * g}/>
    {bars.map((b, i) => {
      const h = b.h * Math.max(0, pop(f, at + 10 + i * 5));
      return <rect key={b.x} x={b.x} y={88 - h} width="10" height={h} rx="2.5" fill={b.c} opacity={b.o}/>;
    })}
    <g transform={`translate(${sway},0)`}>
      <path d="M58 26 Q53 19 58 13 Q63 7 58 2" fill="none" stroke={P.gold} strokeWidth="4" strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - s1} opacity={s1 > 0 ? 1 : 0}/>
      <path d="M70 26 Q66 20 70 15" fill="none" stroke={P.gold} strokeWidth="3.5" strokeLinecap="round" pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - s2} opacity={s2 > 0 ? 0.7 : 0}/>
    </g>
  </svg>;
};

// Cues: "We do." (the mark draws), the name in the Tamil voice (the wordmark lands), what it means, the tagline.
const Logo: React.FC<SP> = ({s, f0}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  const word = F(s.cues[1]), means = F(s.cues[2]), serve = F(s.cues[3]);
  const L = wide ? {mark: 300, markTop: 44, word: 150, wordTop: 366, box: 80, boxTop: 556, tag: 96, tagTop: 716, subTop: 858, sub: 40}
                 : {mark: 460, markTop: 290, word: 176, wordTop: 800, box: 100, boxTop: 1050, tag: 118, tagTop: 1262, subTop: 1540, sub: 44};
  const box: React.CSSProperties = {fontFamily: COND, fontWeight: 700, fontSize: L.box, lineHeight: 1, padding: "10px 32px 14px", borderRadius: 16};
  const tag = BRAND.tagline.split(". ");      // "India's numbers, served fresh" + "From official sources."
  const [t1, t2] = tag[0].split(", ");
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 0, right: 0, top: L.markTop, display: "flex", justifyContent: "center"}}><AnimMark size={L.mark} at={f0}/></div>
    <div style={{position: "absolute", left: 0, right: 0, top: L.wordTop, display: "flex", justifyContent: "center", opacity: Math.min(1, pop(f, word) * 1.4),
      transform: `scale(${0.8 + 0.2 * pop(f, word)})`}}><Wordmark size={L.word}/></div>
    <div style={{position: "absolute", left: 0, right: 0, top: L.boxTop, display: "flex", justifyContent: "center", alignItems: "center", gap: 28,
      opacity: Math.min(1, pop(f, means) * 1.4), transform: `translateY(${(1 - pop(f, means)) * 30}px)`}}>
      <div style={{...box, color: P.gold, border: `6px solid ${P.gold}`}}>{NAME_B}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: L.box - 4, color: P.mute}}>=</div>
      <div style={{...box, color: P.bg, background: P.cyan, border: `6px solid ${P.cyan}`}}>SHOP</div>
    </div>
    <div style={{position: "absolute", left: 60, right: 60, top: L.tagTop, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: L.tag, lineHeight: 1.06, color: P.ink,
      opacity: Math.min(1, pop(f, serve) * 1.4), transform: `translateY(${(1 - pop(f, serve)) * 30}px)`}}>
      {t1},{wide ? " " : <br/>}<span style={{color: P.gold}}>{t2}.</span>
    </div>
    <div style={{position: "absolute", left: 60, right: 60, top: L.subTop, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: L.sub, color: P.mute,
      opacity: ease(f, serve + 24, serve + 34)}}>{tag[1]}</div>
  </AbsoluteFill>;
};

const Promise_: React.FC<SP> = ({s, f0}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  const c0 = F(s.cues[0]);
  const items = [{t: "From official sources", sub: "Ministries, the RBI, Parliament answers, national surveys", at: c0 + 38},
                 {t: "Named on screen", sub: "The publisher and the year, on every video", at: c0 + 78}];
  const chip = c0 + 98, tw = wide ? 700 : 780;
  return <AbsoluteFill>
    <Head lines={["*A new number*", "every day."]} f0={f0} max={150} top={170} wtop={190}/>
    {items.map((it, i) => {
      const p = pop(f, it.at), tick = ease(f, it.at + 4, it.at + 14);
      return <div key={it.t} style={{position: "absolute", left: wide ? WRIGHT : 60, top: (wide ? 290 : 640) + i * 290, display: "flex", gap: 34, alignItems: "center",
        opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -50}px)`}}>
        <svg width={130} height={130} viewBox="0 0 100 100" style={{flexShrink: 0}}>
          <circle cx="50" cy="50" r="46" fill={P.cyan}/>
          <path d="M28 52 L44 68 L74 34" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
                strokeDashoffset={1 - tick} opacity={tick > 0 ? 1 : 0}/>
        </svg>
        <div>
          <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(it.t, 88, tw), lineHeight: 1.05, color: P.ink, whiteSpace: "nowrap"}}>{it.t}</div>
          <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: P.mute, marginTop: 10, width: tw}}>{it.sub}</div>
        </div>
      </div>;
    })}
    {/* the source line as it sits at the top of a Short (px01) */}
    <div style={{position: "absolute", left: wide ? WM : 60, top: wide ? 610 : 1270, opacity: ease(f, chip, chip + 10), transform: `translateY(${(1 - ease(f, chip, chip + 10)) * 20}px)`}}>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.mute}}>Like this, at the top of every video:</div>
      <div style={{display: "flex", gap: 20, alignItems: "center", marginTop: 22, background: P.bg2, border: `2px solid ${P.line}`, borderRadius: 18, padding: "26px 30px"}}>
        <div style={{background: P.cyan, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 4, padding: "10px 22px", borderRadius: 10, whiteSpace: "nowrap"}}>DATA PARADOX</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 38, color: P.ink, opacity: 0.75, whiteSpace: "nowrap"}}>DoT · 28 Feb 2026</div>
      </div>
    </div>
  </AbsoluteFill>;
};

// The day themes as items on a shelf.
const Shelf: React.FC<SP> = ({D, f0}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  const L = wide ? {left: WRIGHT, width: WRW, top: 96, pitch: 128, h: 96, fs: 56} : {left: 60, width: 960, top: 560, pitch: 140, h: 108, fs: 62};
  return <AbsoluteFill>
    <Head lines={["What's on", "the *shelf*"]} f0={f0} max={150} top={170}/>
    {D.themes.map((t, i) => {
      const p = pop(f, f0 + 6 + i * 5);
      return <div key={t} style={{position: "absolute", left: L.left, width: L.width, top: L.top + i * L.pitch}}>
        <div style={{display: "inline-flex", alignItems: "center", height: L.h, padding: "0 34px", borderRadius: 14, background: i % 2 ? P.cyan : P.gold, color: P.bg,
          fontFamily: COND, fontWeight: 700, fontSize: L.fs, letterSpacing: 1.5, whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5),
          transform: `translateX(${(1 - p) * -60}px)`}}>{t.toUpperCase()}</div>
        <div style={{height: 4, background: P.line, borderRadius: 2, marginTop: 10, opacity: 0.8 * ease(f, f0 + 2 + i * 5, f0 + 12 + i * 5)}}/>
      </div>;
    })}
  </AbsoluteFill>;
};

const End: React.FC<SP> = ({f0}) => {
  const f = useCurrentFrame();
  const wide = useWide();
  const p = pop(f, f0);
  return <AbsoluteFill style={{alignItems: "center", justifyContent: "center", flexDirection: "column", gap: wide ? 30 : 40, padding: 80}}>
    <div style={{transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 1.5)}}><Mark size={wide ? 230 : 260}/></div>
    <div style={{opacity: ease(f, f0 + 4, f0 + 12)}}><Wordmark size={116}/></div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 104, color: P.ink, textAlign: "center", lineHeight: 1.05, opacity: Math.min(1, pop(f, f0 + 10) * 1.4),
      transform: `translateY(${(1 - pop(f, f0 + 10)) * 30}px)`}}>Where does <span style={{color: P.gold}}>your</span>{wide ? " " : <br/>}state rank?</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 44, color: P.cyan, opacity: ease(f, f0 + 22, f0 + 32)}}>Comment below · Follow for more</div>
  </AbsoluteFill>;
};

const KINDS: Record<string, React.FC<SP>> = {tease: Tease, second: Second, tables: Tables, logo: Logo, promise: Promise_, shelf: Shelf, end: End};
const SIGNED = ["promise", "shelf"];      // scenes that carry the small wordmark; before the logo scene the name is held back

const musicVol = (D: IntroData, fr: number) => {
  const t = fr / FPS;
  const near = Math.min(...D.vo.map((v) => t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};

export const Intro: React.FC<{wide?: boolean}> = ({wide = false}) => {
  const D = INTRO;
  const f = useCurrentFrame();
  const s = D.scenes.find((x) => f >= F(x.t0) && f < F(x.t1)) ?? D.scenes[D.scenes.length - 1];
  const K = KINDS[s.kind];
  const f0 = F(s.t0);
  const cut = 1 + 0.04 * Math.max(0, 1 - (f - f0) / 7);
  return <Wide.Provider value={wide}>
    <AbsoluteFill style={{background: P.bg}}>
      <VoxFonts/>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>
      <AbsoluteFill style={{transform: `scale(${cut})`}}>{K ? <K D={D} s={s} f0={f0}/> : null}</AbsoluteFill>
      <div style={{position: "absolute", left: 0, top: 0, height: 12, width: `${100 * f / F(D.total)}%`, background: P.gold}}/>
      {SIGNED.includes(s.kind) && <div style={{position: "absolute", right: wide ? WM : 60, bottom: 50, display: "flex", alignItems: "center", gap: 10, opacity: 0.9}}>
        <Mark size={40}/>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 32, color: P.ink}}>{NAME_A} <span style={{color: P.gold}}>{NAME_B}</span></div>
      </div>}
      <Audio src={staticFile("datayt/intro/music.wav")} volume={(fr) => musicVol(D, fr)}/>
      {D.vo.map((v) => <Sequence key={v.file} from={F(v.at)}><Audio src={staticFile(`datayt/intro/${v.file}`)}/></Sequence>)}
    </AbsoluteFill>
  </Wide.Provider>;
};
