// The Bhagavad Gita, all 18 chapters, in about 15 minutes (1920 x 1080). Data: public/gita/g15/data.json
// (scripts/gita/build_gita15.py). Scenes are keyed by beat; overlays (titles, movements, verse cards, captions, mala) come from the cues.
import React, {useMemo} from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {useGitaFonts} from "../fonts";
import {FPS, G15Data, NIGHT, TT, ip, timing} from "../kit";
import {AlsoCited, Captions, ChapterTag, ChapterTitle, Mala, MovementCard, Theme, VerseCard, captionChunks, isTitleCue, refPhrase} from "./overlays";
import {BowSlips, Ch1, Ch2, Ch3, Ch4, Ch5, Ch6, Dawn, Map, Meera1, Meera2, Reins, SceneProps, Title, bowLand} from "./scenes1";
import {Ch7, Ch8, Ch9, Ch10, Ch11, Ch12, Ch13, Ch14, Ch15, Ch16, Ch17, Ch18, Close1, End, Meera3, Meera4} from "./scenes2";

const SCENES: Record<string, [React.FC<SceneProps>, Theme]> = {
  open1: [Dawn, "night"], open2: [BowSlips, "night"], open3: [Reins, "night"], meera1: [Meera1, "slate"], title: [Title, "night"], map: [Map, "night"],
  ch1: [Ch1, "night"], ch2: [Ch2, "paper"], ch3: [Ch3, "paper"], ch4: [Ch4, "night"], ch5: [Ch5, "night"], ch6: [Ch6, "night"], meera2: [Meera2, "slate"],
  ch7: [Ch7, "paper"], ch8: [Ch8, "night"], ch9: [Ch9, "paper"], ch10: [Ch10, "night"], ch11: [Ch11, "night"], ch12: [Ch12, "paper"], meera3: [Meera3, "slate"],
  ch13: [Ch13, "paper"], ch14: [Ch14, "paper"], ch15: [Ch15, "night"], ch16: [Ch16, "paper"], ch17: [Ch17, "slate"], ch18: [Ch18, "night"],
  close1: [Close1, "night"], meera4: [Meera4, "slate"], end: [End, "night"],
};
const NOCAP = new Set(["open2_0", "ch2_1"]);              // the scene itself shows these words
const MOVE: Record<string, number | "all"> = {map_0: "all", ch7_0: 1, ch13_0: 2};
const FADE = 14;

const SceneLayer: React.FC<{from: number; T: TT; C: React.FC<SceneProps>; first: boolean}> = ({from, T, C, first}) => {
  const lf = useCurrentFrame();
  return <AbsoluteFill style={{opacity: first ? 1 : ip(lf, 0, FADE)}}><C f={lf + from} T={T}/></AbsoluteFill>;
};
const Abs: React.FC<{from: number; children: (f: number) => React.ReactNode}> = ({from, children}) => {
  const lf = useCurrentFrame(); return <>{children(lf + from)}</>;
};
const Furniture: React.FC<{T: TT; chunks: ReturnType<typeof captionChunks>}> = ({T, chunks}) => {
  const f = useCurrentFrame();
  const beats = T.D.beats;
  let bi = 0; beats.forEach((b, i) => { if (b.start * FPS <= f) bi = i; });       // the beat on screen
  const B = beats[bi]; const theme = SCENES[B.key][1];
  let chapter = 0; beats.slice(0, bi + 1).forEach((b) => { if (b.chapter) chapter = b.chapter; });
  if (bi > beats.findIndex((b) => b.key === "ch18")) chapter = 19;                  // after chapter 18 every bead is lit
  const hideMala = B.key === "end" && f >= T.s("end_1") - 10;
  const inOverlay = T.D.cues.some((c) => (isTitleCue(c) && f >= T.s(c.key) - 4 && f <= T.e(c.key) + 32)
    || (c.card && c.kind === "say" && f >= T.at(c.key, refPhrase(c)) - 4 && f <= T.e(c.key + "v") + 38)
    || (MOVE[c.key] !== undefined && f >= T.s(c.key) - 4 && f <= T.e(c.key) + 28));
  return (
    <>
      {!inOverlay && <Captions f={f} chunks={chunks}/>}
      {B.chapter && !inOverlay && <ChapterTag f={f} ch={B.chapter} T={T} theme={theme} a={B.start * FPS}/>}
      {!inOverlay && <AlsoCited f={f} refs={B.refs} theme={theme} a={B.start * FPS} b={B.end * FPS}/>}
      {!hideMala && <Mala f={f} chapter={chapter} from={T.s("map_0")} theme={inOverlay ? "night" : theme}/>}
    </>
  );
};

// tanpura bed: ducked under every line, dropped for each verse card's silence
const useBed = (T: TT) => useMemo(() => {
  const speech = T.D.cues.map((c) => [c.start * FPS, (c.start + c.dur) * FPS]);
  const quiet = T.D.cues.filter((c) => c.card && c.kind === "say").map((c) => [T.e(c.key), T.s(c.key + "v")]);
  return (f: number) => {
    let w = 0;
    for (const [s, e] of speech) { const d = f < s ? s - f : f > e ? f - e : 0; if (d < 10) w = Math.max(w, 1 - d / 10); }
    let q = 0;
    for (const [s, e] of quiet) q = Math.max(q, ip(f, s, s + 8) * ip(f, e - 10, e, 1, 0));
    return ip(f, 0, 40, 0, 0.14) * ip(f, T.total - 60, T.total, 1, 0) * (1 - 0.6 * w) * (1 - 0.8 * q);
  };
}, [T]);

export const G15: React.FC<{D: G15Data}> = ({D}) => {
  useGitaFonts();
  const T = useMemo(() => timing(D), [D]);
  const chunks = useMemo(() => captionChunks(T).filter((c) => !D.cues.some((q) => NOCAP.has(q.key) && c.a >= q.start * FPS - 1 && c.a <= (q.start + q.dur) * FPS)), [T, D]);
  const bed = useBed(T);
  const a = (n: string) => staticFile(`gita/g15/${n}`);
  const starts = D.beats.map((b, i) => (i === 0 ? 0 : Math.round(b.start * FPS) - 10));
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      {D.beats.map((b, i) => {
        const from = starts[i], to = i + 1 < D.beats.length ? starts[i + 1] + FADE : T.total;
        return <Sequence key={b.key} from={from} durationInFrames={to - from}><SceneLayer from={from} T={T} C={SCENES[b.key][0]} first={i === 0}/></Sequence>;
      })}
      {D.cues.filter(isTitleCue).map((c) => {
        const from = T.s(c.key) - 6; const ch = D.beats.find((b) => b.key === c.beat)!.chapter!;
        return <Sequence key={`t${c.key}`} from={from} durationInFrames={T.e(c.key) - from + 40}><Abs from={from}>{(f) => <ChapterTitle f={f} c={c} T={T} ch={ch}/>}</Abs></Sequence>;
      })}
      {D.cues.filter((c) => MOVE[c.key] !== undefined).map((c) => {
        const from = T.s(c.key) - 6;
        return <Sequence key={`m${c.key}`} from={from} durationInFrames={T.e(c.key) - from + 36}><Abs from={from}>{(f) => <MovementCard f={f} c={c} T={T} which={MOVE[c.key]}/>}</Abs></Sequence>;
      })}
      {D.cues.filter((c) => c.card && c.kind === "say").map((c) => {
        const from = T.at(c.key, refPhrase(c)) - 6;
        return <Sequence key={`v${c.key}`} from={from} durationInFrames={T.e(c.key + "v") - from + 46}><Abs from={from}>{(f) => <VerseCard f={f} c={c} T={T}/>}</Abs></Sequence>;
      })}
      <Furniture T={T} chunks={chunks}/>
      <Audio src={a("tanpura.wav")} loop volume={bed}/>
      <Sequence from={0}><Audio src={a("conch.wav")} volume={0.2}/></Sequence>
      <Sequence from={bowLand(T)}><Audio src={a("thud.wav")} volume={0.6}/></Sequence>
      {D.cues.filter((c) => MOVE[c.key] !== undefined).map((c) => <Sequence key={`ms${c.key}`} from={T.s(c.key) - 10}><Audio src={a("conch.wav")} volume={0.1}/></Sequence>)}
      {D.cues.filter((c) => c.card && c.kind === "say").map((c) => <Sequence key={`b${c.key}`} from={T.e(c.key) + 2}><Audio src={a("bell.wav")} volume={0.32}/></Sequence>)}
      {D.cues.map((c) => <Sequence key={c.key} from={Math.round(c.start * FPS)}><Audio src={a(`a/${c.key}.wav`)}/></Sequence>)}
    </AbsoluteFill>
  );
};
