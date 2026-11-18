// The Night Pharmacist: 60 s style test (16:9). Ep 1, Night 1, 1:07 am: coffee, the order book, the red foil.
// Motion-comic grammar under test: one face per panel, slow Ken Burns, cross-fades, Babu's phone-reel frame,
// subtitles (no speech bubbles), cinema bars, film grain. Red is reserved for the tramadol foil (bible section 9),
// so nothing drawn here is red. Timing comes from public/nightrx/styletest/data.json (scripts/nightrx/styletest.py).
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-400-italic.css";
import "@fontsource/inter/latin-600.css";
import React, {useEffect, useState} from "react";
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from "remotion";

export const FPS = 30, W = 1920, H = 1080;
type KB = [number, number, number];
type Clip = {src: string; from: number; rate: number};
type Shot = {p: string; kb?: [KB, KB]; clip?: Clip; mode?: "reel"; stamp?: string; card?: string; card2?: string; subTop?: boolean; start: number; end: number};
type Line = {key: string; who: string; voice: string; text: string; italic: boolean; start: number; dur: number};
type Sfx = {name: string; start: number; vol: number};
export type StyleData = {id: string; base?: string; fps: number; total: number; xf: number; shots: Shot[]; lines: Line[]; sfx: Sfx[]};

const NEON = "#5dffb0", SODIUM = "#ffb347", CREAM = "#f4ecd8", NIGHT = "#05090b";
const BAR = 70;                                   // cinema bars, about 2.1:1 inside 16:9
const COND = "'Oswald', 'Arial Narrow', sans-serif", SANS = "Inter, Helvetica, sans-serif";
const EASE = Easing.bezier(0.33, 0, 0.2, 1);
const ip = (f: number, a: number, b: number, x = 0, y = 1, easing?: (t: number) => number) =>
  interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing});
// base: "nightrx/styletest" (ink) or "nightrx/styletest_live" (live-action); voices and sound always come from nightrx/styletest.
const img = (base: string, p: string) => staticFile(`${base}/img/clean/${p}.jpeg`);
const a = (n: string) => staticFile(`nightrx/styletest/${n}`);

export const useOswald = () => {
  const [h] = useState(() => delayRender("oswald"));
  useEffect(() => {
    const f = new FontFace("Oswald", `url(${staticFile("fonts/Oswald-700.woff2")})`, {weight: "700"});
    f.load().then((x) => {document.fonts.add(x); return document.fonts.load("600 32px Inter");}).then(() => continueRender(h));
  }, [h]);
};

// One panel with a Ken Burns move: scale s0 -> s1 while the transform origin glides between the two focus points.
const Panel: React.FC<{s: Shot; f: number; base: string}> = ({s, f, base}) => {
  const [[s0, x0, y0], [s1, x1, y1]] = s.kb ?? [[1, .5, .5], [1.06, .5, .5]];
  const len = (s.end - s.start) * FPS;
  const t = ip(f, 0, len, 0, 1, Easing.inOut(Easing.sin));
  const sc = s0 + (s1 - s0) * t, ox = x0 + (x1 - x0) * t, oy = y0 + (y1 - y0) * t;
  const flicker = s.p === "p01" ? 1 + 0.05 * Math.sin(f * 0.9) * (random(`fl${Math.floor(f / 4)}`) > 0.8 ? 1 : 0.15) : 1;
  const full: React.CSSProperties = {position: "absolute", inset: 0, width: W, height: H, objectFit: "cover"};
  // Moving cut: the clip replaces the still; a slow 1.0 -> 1.03 drift keeps the frame alive without fighting the clip's own camera.
  const Pic: React.FC<{style: React.CSSProperties}> = ({style}) => s.clip
    ? <OffthreadVideo src={staticFile(`${base}/clip/${s.clip.src}`)} muted playbackRate={s.clip.rate}
        startFrom={Math.round(s.clip.from * FPS)} style={style}/>
    : <Img src={img(base, s.p)} style={style}/>;
  if (s.clip && s.mode !== "reel")
    return <Pic style={{...full, transformOrigin: `${ox * 100}% ${oy * 100}%`, transform: `scale(${1 + 0.03 * t})`}}/>;
  if (s.mode !== "reel")
    return <Img src={img(base, s.p)} style={{...full, transformOrigin: `${ox * 100}% ${oy * 100}%`, transform: `scale(${sc})`, filter: `brightness(${flicker})`}}/>;
  // Babu's reel: the same panel blurred behind, a 9:16 phone frame in front with a little hand-held drift.
  const pw = 470, ph = 836, dx = 6 * Math.sin(f / 23), dy = 5 * Math.cos(f / 31), rot = 1.2 * Math.sin(f / 40) - 1.5;
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <>
      <Img src={img(base, s.p)} style={{...full, filter: "blur(28px) brightness(0.45) saturate(0.8)", transform: "scale(1.15)"}}/>
      <div style={{position: "absolute", left: W / 2 - pw / 2 + dx, top: H / 2 - ph / 2 + dy, width: pw, height: ph, transform: `rotate(${rot}deg)`,
        borderRadius: 46, overflow: "hidden", border: "10px solid #111", boxShadow: "0 30px 80px rgba(0,0,0,.7)"}}>
        <Pic style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox * 100}% ${oy * 100}%`, transform: s.clip ? "none" : `scale(${sc})`}}/>
        <div style={{position: "absolute", top: 30, left: 26, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: CREAM, textShadow: "0 2px 6px #000"}}>
          <div style={{width: 15, height: 15, borderRadius: 8, background: CREAM, opacity: blink ? 1 : 0.25}}/> REC {s.stamp}
        </div>
        <div style={{position: "absolute", top: 64, left: 26, right: 26, fontFamily: SANS, fontSize: 19, color: CREAM, opacity: 0.85, textShadow: "0 2px 6px #000"}}>
          @babu.nightshift · Day 1 of investigating 🔍
        </div>
      </div>
    </>
  );
};

const Card: React.FC<{text: string; f: number; dur: number}> = ({text, f, dur}) => {
  const [big, small] = text.split("|");
  const o = ip(f, 12, 30) * ip(f, dur - 24, dur - 6, 1, 0);
  const shown = Math.floor(ip(f, 12, 40, 0, big.length));
  return (
    <div style={{position: "absolute", left: 120, bottom: BAR + 110, opacity: o}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 92, letterSpacing: 6, color: CREAM, textShadow: `0 0 24px ${NEON}88`}}>
        {big.slice(0, shown)}<span style={{opacity: shown < big.length ? 1 : 0}}>▌</span>
      </div>
      {small && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 9, color: SODIUM, marginTop: 6, opacity: ip(f, 44, 60)}}>{small}</div>}
    </div>
  );
};

const Stamp: React.FC<{text: string; f: number}> = ({text, f}) => (
  <div style={{position: "absolute", right: 90, top: BAR + 40, fontFamily: COND, fontWeight: 700, fontSize: 54, letterSpacing: 5, color: CREAM,
    opacity: ip(f, 20, 36) * 0.9, textShadow: `0 0 18px ${NEON}77`}}>{text}</div>
);

const EndCard: React.FC<{f: number}> = ({f}) => {
  const on = f < 20 ? (random(`e${f}`) > 0.5 ? 1 : 0.2) : 1;   // the neon strikes, stutters, holds
  return (
    <AbsoluteFill style={{background: NIGHT, alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 132, letterSpacing: 14, color: "#d9fff0", opacity: ip(f, 0, 6) * on,
        textShadow: `0 0 12px ${NEON}, 0 0 46px ${NEON}aa, 0 0 110px ${NEON}55`}}>THE NIGHT PHARMACIST</div>
      <div style={{fontFamily: SANS, fontSize: 28, letterSpacing: 6, color: CREAM, opacity: ip(f, 30, 50) * 0.7, marginTop: 26}}>
        WORKING TITLE · STYLE TEST · NOT FOR RELEASE
      </div>
    </AbsoluteFill>
  );
};

// top = true for inserts whose clue sits at the bottom of the frame (p08: the signature under the empty rows).
const Subtitle: React.FC<{l: Line; f: number; top: boolean}> = ({l, f, top}) => {
  const d = l.dur * FPS;
  const pos: React.CSSProperties = top ? {top: BAR + 24} : {bottom: BAR + 34};
  // soft dark backing under every line: the live p08 puts the subtitle on white paper
  const back = {background: "radial-gradient(ellipse at center, rgba(0,0,0,.62) 30%, rgba(0,0,0,0) 72%)", padding: "14px 0"};
  return (
    <div style={{position: "absolute", left: 140, right: 140, ...pos, ...back, textAlign: "center", opacity: ip(f, 0, 4) * ip(f, d - 1, d + 3, 1, 0),   // gone within the 0.18 s gap before the next line
      fontFamily: SANS, fontStyle: l.italic ? "italic" : "normal", fontSize: 44, lineHeight: 1.3, color: "#fffaf0",
      textShadow: "0 2px 4px #000, 0 0 18px rgba(0,0,0,.85)"}}>{l.text}</div>
  );
};

const Grain: React.FC<{f: number}> = ({f}) => (
  <svg width={W} height={H} style={{position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.22}}>
    <filter id={`g${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 6}/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width={W} height={H} filter={`url(#g${f % 6})`}/>
  </svg>
);

export const StyleTest: React.FC<{D: StyleData}> = ({D}) => {
  useOswald();
  const f = useCurrentFrame();
  const total = Math.ceil(D.total * FPS), XF = Math.round(D.xf * FPS);
  const fr = (s: number) => Math.round(s * FPS);
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      {D.shots.map((s, i) => {
        const from = fr(s.start), dur = fr(s.end) - from + (i < D.shots.length - 1 ? XF : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Shot s={s} first={i === 0} XF={XF} base={D.base ?? "nightrx/styletest"}/>
          </Sequence>
        );
      })}
      {/* vignette, bars, grain over everything */}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)"}}/>
      <Grain f={f}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: "#000"}}/>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, background: "#000"}}/>
      {D.lines.map((l) => (
        <Sequence key={l.key} from={fr(l.start)} durationInFrames={fr(l.dur) + 4}>
          <SubtitleAt l={l} top={!!D.shots.find((s) => s.start <= l.start && l.start < s.end && s.p !== "end" && l.start >= s.start + D.xf)?.subTop}/>
        </Sequence>
      ))}
      {/* sound: room tone throughout, the shift clock ticking under it, then each line and effect at its time */}
      <Audio src={a("sfx/room.wav")} loop volume={(x) => 0.32 * ip(x, 0, 20) * ip(x, total - 60, total - 10, 1, 0)}/>
      {Array.from({length: Math.floor(D.total) - 4}, (_, k) => (
        <Sequence key={`t${k}`} from={k * FPS + 6} durationInFrames={10}><Audio src={a("sfx/tick.wav")} volume={k < 5 ? 0.3 : 0.1}/></Sequence>
      ))}
      {D.lines.map((l) => <Sequence key={`v${l.key}`} from={fr(l.start)}><Audio src={a(`vo/${l.key}.wav`)}/></Sequence>)}
      {D.sfx.map((s, k) => <Sequence key={`s${k}`} from={fr(s.start)}><Audio src={a(`sfx/${s.name}.wav`)} volume={s.vol}/></Sequence>)}
    </AbsoluteFill>
  );
};

const Shot: React.FC<{s: Shot; first: boolean; XF: number; base: string}> = ({s, first, XF, base}) => {
  const f = useCurrentFrame();
  const len = Math.round((s.end - s.start) * FPS);
  const o = first ? ip(f, 0, 24) : ip(f, 0, XF, 0, 1, EASE);
  return (
    <AbsoluteFill style={{opacity: o}}>
      {s.p === "end" ? <EndCard f={f}/> : <Panel s={s} f={f} base={base}/>}
      {s.card && <Card text={s.card} f={f} dur={len}/>}
      {s.card2 && <Stamp text={s.card2} f={f}/>}
    </AbsoluteFill>
  );
};

const SubtitleAt: React.FC<{l: Line; top: boolean}> = ({l, top}) => <Subtitle l={l} f={useCurrentFrame()} top={top}/>;
