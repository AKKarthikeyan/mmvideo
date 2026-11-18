// The Inventor's Desk, Claim Check: "Physicists Caged a Single Antimatter Particle for Months" (P02, 27 Oct 2026).
// Script: script.json (from script_v1.json; claims and reviews are in script_v1.json). Research: docs/inventors_desk/research/P02-antimatter-trap.
// Look: the night look in look.tsx (AK chose it on 27 Oct 2026 from sample.tsx). Own entry (index.ts), no shared Root changes.
// Silent until voiced (timing.json estimate); gk_voice.py then gk_align.py write the real timing.json and vo.wav.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {FPS, Safe, W, H, makeCues, useGKFonts, Timing} from "../kit";
import T from "./timing.json";
import {Bar, Bg, Desk, DeskClose, GlobalDefs, KHead, Pill, Shot, Shrink, Source, K, ease, lin} from "./look";
import {BoardScene, GaugeScene, PriscillaScene, StairsScene, StampScene, TrapScene, WallsScene} from "./art";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
const VOICED = !(T as {estimate?: boolean}).estimate;
export const ANTIMATTERTRAP_FRAMES = cue.total + 45;
const CLOSE = cue.total;   // the voice has ended: the drawer opens and the scene shrinks into it (never touches the hook)

const SFX: [number, string, number][] = [
  [at("b01", "October"), "sfx_paper_slide_kingofgamers.wav", 0.22],
  [at("b01", "a positron"), "sfx_coin_ding_greenvwbeetle.wav", 0.22],
  [at("b02", "no walls"), "sfx_whoosh_deep_kinoton.wav", 0.2],
  [at("b03", "In nineteen"), "sfx_paper_slide_kingofgamers.wav", 0.2],
  [at("b03", "a magnet"), "sfx_whoosh_deep_kinoton.wav", 0.2],
  [at("b04", "built a trap"), "sfx_pop_conarb13.wav", 0.25],
  [at("b04", "named it"), "sfx_coin_ding_greenvwbeetle.wav", 0.22],
  [at("b05", "announced"), "sfx_paper_slide_kingofgamers.wav", 0.28],
  [at("b05", "named Priscilla"), "sfx_pop_conarb13.wav", 0.3],
  [at("b05", "three months"), "sfx_coin_ding_greenvwbeetle.wav", 0.3],
  [at("b06", "nudge it"), "sfx_whoosh_cartoony_branrainey.wav", 0.25],
  [at("b06", "absolute zero"), "sfx_coin_ding_greenvwbeetle.wav", 0.2],
  [at("b07", "published"), "sfx_thump_stamp_mpuffenbarger.wav", 0.5],
  [at("b07", "not done"), "sfx_pop_conarb13.wav", 0.22],
  [at("b08", "Priscilla had"), "sfx_pop_conarb13.wav", 0.25],
];

export const AntimatterTrapShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const src = fr < at("b02") ? "Myers et al., Phys. Rev. Lett. 137, 173001 (2026)"
    : fr < at("b03") ? "Gabrielse, Scientific American, Oct 2026"
    : fr < at("b04") ? "US Patent 2,197,079 (Penning, Philips)"
    : fr < at("b05") ? "Dehmelt, Physica Scripta T22 (1988); Am. J. Phys. 58 (1990)"
    : fr < at("b06") ? "Dehmelt, Physica Scripta T22 (1988)"
    : fr < at("b08") ? "Myers et al., Phys. Rev. Lett. 137, 173001 (2026)" : "";
  // the headline of b06 leaves just before the stamp lands on b07
  const hOut = ease(fr, at("b07", "published") - 12, at("b07", "published") - 2);

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <GlobalDefs/>
      <Bg glowY={1000}/>
      <Desk/>
      <Shrink f0={CLOSE}>
        <Safe>
          {/* b01 hook: on screen from frame 0, standing on the desk */}
          <Shot a={0} b={at("b02")} first push={0.05}>
            <KHead lines={["It {vanishes}", "if it touches", "anything."]} f0={-30} y={64}/>
            <TrapScene fr={fr} t={t} calF0={at("b01", "October")} labelF0={at("b01", "a positron")}/>
          </Shot>

          {/* b02 a container with no walls */}
          <Shot a={at("b02")} b={next("b02")} from="left" push={0.05}>
            <KHead lines={["A container", "with {no walls}"]} f0={at("b02", "container") - 1} y={64} size={100}/>
            <WallsScene fr={fr} t={t} wallsF={at("b02", "no walls")} magF={at("b02", "Magnetic")} elecF={at("b02", "electric")} midF={at("b02", "in the middle")} nothF={at("b02", "touching nothing")}/>
          </Shot>

          {/* b03 1936: a vacuum gauge */}
          <Shot a={at("b03")} b={next("b03")} from="right" push={0.04}>
            <KHead lines={["One ancestor:", "a {vacuum gauge}"]} f0={at("b03", "vacuum gauge") - 14} y={64} size={96}/>
            <Pill x={44} y={330} text="1936 · Eindhoven" f0={at("b03", "In nineteen")} bg={K.amber} color={K.ink} size={30}/>
            <Pill x={44} y={410} text="Frans Penning · Philips" f0={at("b03", "Frans Penning")} size={26}/>
            <GaugeScene fr={fr} t={t} magF={at("b03", "a magnet")} measF={at("b03", "to measure")} airF={at("b03", "air")}/>
          </Shot>

          {/* b04 decades later: the dot on the blackboard, the trap */}
          <Shot a={at("b04")} b={next("b04")} from="up" push={0.04}>
            <KHead lines={["How do you hold", "{one electron}", "still?"]} f0={at("b04", "Dehmelt wrote")} y={64} size={84}/>
            <Pill x={44} y={346} text="Decades later · Seattle" f0={at("b04", "Decades later")} bg={K.amber} color={K.ink} size={27}/>
            <BoardScene fr={fr} t={t} boardF={at("b04", "Dehmelt wrote")} typeF={at("b04", "wondered how")} moveF={at("b04", "built a trap")} nameF={at("b04", "named it")}/>
          </Shot>

          {/* b05 the turn: Priscilla */}
          <Shot a={at("b05")} b={next("b05")} from="right" push={0.05}>
            <KHead lines={["But it’s", "{not} a first."]} f0={at("b05", "But holding") + 2} y={64} size={116}/>
            <PriscillaScene fr={fr} t={t} twinF={at("b05", "But holding")} datF={at("b05", "Dehmelt’s lab")} quoteF={at("b05", "announced")} tagF={at("b05", "named Priscilla")} threeF={at("b05", "three months")}/>
          </Shot>

          {/* b06 + b07: what is new, and where the claim stands (one shot: the staircase stays) */}
          <Shot a={at("b06")} b={next("b07")} from="up" push={0.03}>
            <div style={{opacity: 1 - hOut, transform: `translateY(${-30 * hOut}px)`}}>
              <KHead lines={["So what’s", "{new}?"]} f0={at("b06", "So what is new") - 2} y={64} size={116}/>
            </div>
            <StairsScene fr={fr} t={t} showF={at("b06", "So what is new") + 10} coldF={at("b06", "absolute zero")} nudgeF={at("b06", "nudge it")} backF={at("b06", "at a time")} ladderF={at("b07")}/>
            <StampScene fr={fr} pubF={at("b07", "published")} testF={at("b07", "The big test")} notF={at("b07", "not done")}/>
          </Shot>

          {/* b08 the echo: the hook picture again, now with a name tag and a question */}
          <Shot a={at("b08")} b={cue.total + 60} from="left" push={0.04}>
            <KHead lines={["What would", "you call", "{this one?}"]} f0={at("b08", "What would you") - 2} y={64}/>
            <TrapScene fr={fr} t={t} tagF0={at("b08", "Priscilla had")} tagText={fr < at("b08", "What would you") + 6 ? "PRISCILLA" : ""} tagKey={at("b08", "What would you") + 2}/>
          </Shot>
        </Safe>
      </Shrink>
      <DeskClose f0={CLOSE}/>
      <Bar total={ANTIMATTERTRAP_FRAMES}/>
      <Source text={src} o={src && fr < CLOSE ? 1 : 0}/>

      {VOICED && <Audio src={staticFile("gadget/antimattertrap/vo.wav")}/>}
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.08 * lin(f, 0, 15) * (1 - lin(f, ANTIMATTERTRAP_FRAMES - 40, ANTIMATTERTRAP_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
