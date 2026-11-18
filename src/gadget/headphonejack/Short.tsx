// The Inventor's Desk, Claim Check: "The Headphone Jack Is Older Than Radio" (P03, 28 Oct 2026), night look (AK's pick).
// Script: script.json (from script_v1.json). Research: docs/inventors_desk/research/P03-headphone-jack. Own entry (index.ts).
// Silent until voiced (timing.json estimate); scripts/gadget/gk_night.sh headphonejack voices, aligns and renders.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {FPS, Safe, W, H, ease, makeCues, useGKFonts, Timing} from "../kit";
import T from "./timing.json";
import {Bar, Bg, Desk, DeskClose, GlobalDefs, KHead, Pill, Shot, Shrink, Source, K, lin} from "../antimattertrap/look";
import {HookScene, JamScene, OperatorScene, RadioScene, TelegraphScene, TimelineScene} from "./art";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
const VOICED = !(T as {estimate?: boolean}).estimate;
export const HEADPHONEJACK_FRAMES = cue.total + 45;
const CLOSE = cue.total;

const SFX: [number, string, number][] = [
  [at("b01", "older than radio"), "sfx_coin_ding_greenvwbeetle.wav", 0.18],
  [at("b02", "wedge pushed"), "sfx_whoosh_deep_kinoton.wav", 0.2],
  [at("b02", "to break"), "sfx_pop_conarb13.wav", 0.22],
  [at("b03", "borrowed it"), "sfx_paper_slide_kingofgamers.wav", 0.2],
  [at("b03", "plain round plug"), "sfx_pop_conarb13.wav", 0.25],
  [at("b04", "into jacks"), "sfx_pop_conarb13.wav", 0.28],
  [at("b05", "nearly twenty"), "sfx_coin_ding_greenvwbeetle.wav", 0.3],
  [at("b06", "In nineteen"), "sfx_thump_stamp_mpuffenbarger.wav", 0.35],
  [at("b06", "wired earbuds"), "sfx_pop_conarb13.wav", 0.25],
  [at("b07", "Which old part"), "sfx_whoosh_cartoony_branrainey.wav", 0.2],
];

export const HeadphoneJackShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const src = fr < at("b02") ? "The Operator, vol. 7 (1877)"
    : fr < at("b03") ? "Prescott, Electricity and the Electric Telegraph (1878)"
    : fr < at("b04") ? "US Patents 234,192 (Jones) and 293,198 (Scribner), filed 1879"
    : fr < at("b05") ? "New York Times, 11 Jun 1899; Western Electric catalogue, 1908"
    : fr < at("b06") ? "Marconi, GB patent 12,039, filed 2 Jun 1896 (register)"
    : fr < at("b07") ? "IEC 60130-8:1969" : "";
  // the b03 headline "Telephones borrowed it" leaves just before the wedge-versus-round-plug headline
  const butOut = ease(fr, at("b03", "But the wedge") - 10, at("b03", "But the wedge") - 2);
  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <GlobalDefs/>
      <Bg glowY={1000}/>
      <Desk/>
      <Shrink f0={CLOSE}>
        <Safe>
          {/* b01 hook: on screen from frame 0 */}
          <Shot a={0} b={at("b02")} first push={0.05}>
            <KHead lines={["{1877}", "A TELEGRAPH", "DESK"]} f0={-30} y={64} size={112}/>
            <HookScene fr={fr} t={t} capF={at("b01", "headphones")}/>
          </Shot>

          {/* b02 the telegraph spring-jack */}
          <Shot a={at("b02")} b={next("b02")} from="left" push={0.04}>
            <KHead lines={["It began on", "a {telegraph}", "desk"]} f0={at("b02", "telegraph desk") - 12} y={64} size={92}/>
            <TelegraphScene fr={fr} t={t} wedgeF={at("b02", "wedge pushed")} nameF={at("b02", "as a")}/>
          </Shot>

          {/* b03 the wedge versus the round plug */}
          <Shot a={at("b03")} b={next("b03")} from="right" push={0.04}>
            <div style={{opacity: 1 - butOut, transform: `translateY(${-30 * butOut}px)`}}>
              <KHead lines={["Telephones", "{borrowed} it"]} f0={at("b03") + 4} y={64} size={112}/>
            </div>
            <KHead lines={["Wedge →", "{round plug}"]} f0={at("b03", "But the wedge") - 8} y={64} size={112}/>
            <JamScene fr={fr} t={t} jamF={at("b03") + 14} roundF={at("b03", "plain round plug") - 18} patentF={at("b03", "borrowed it")}/>
          </Shot>

          {/* b04 the operator's headset */}
          <Shot a={at("b04")} b={next("b04")} from="up" push={0.04}>
            <KHead lines={["Operators", "{plug in}"]} f0={at("b04") + 6} y={64} size={112}/>
            <OperatorScene fr={fr} t={t} plugF={at("b04", "head receivers")} cardF={at("b04", "into jacks")}/>
          </Shot>

          {/* b05 the payoff: nineteen years */}
          <Shot a={at("b05")} b={next("b05")} from="right" push={0.03}>
            <KHead lines={["{Radio} came", "later"]} f0={at("b05", "Marconi's radio")} y={64} size={112}/>
            <TimelineScene fr={fr} t={t} f1877={at("b05")} f1896={at("b05", "eighteen")} gapF={at("b05", "nearly twenty")} fTicks={at("b05", "nearly twenty") + 20}/>
          </Shot>

          {/* b06 the twist: radio came back for it */}
          <Shot a={at("b06")} b={next("b06")} from="left" push={0.04}>
            <KHead lines={["Radio came", "{back for it}"]} f0={at("b06", "radio came back") - 4} y={64} size={104}/>
            <RadioScene fr={fr} t={t} yearF={at("b06", "In nineteen")} sizeF={at("b06", "described the")} plugF={at("b06", "wired earbuds") - 16}/>
          </Shot>

          {/* b07 the echo: the hook picture again, crossed with 1969, and a question */}
          <Shot a={at("b07")} b={cue.total + 60} from="up" push={0.04}>
            <KHead lines={["Which old part", "is in your", "{pocket?}"]} f0={at("b07", "Which old part") - 2} y={64} size={104}/>
            <HookScene fr={fr} t={t} cards cardF={at("b07", "then written")}/>
          </Shot>
        </Safe>
      </Shrink>
      <DeskClose f0={CLOSE}/>
      <Bar total={HEADPHONEJACK_FRAMES} label="The headphone jack"/>
      <Source text={src} o={src && fr < CLOSE ? 1 : 0}/>

      {VOICED && <Audio src={staticFile("gadget/headphonejack/vo.wav")}/>}
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.08 * lin(f, 0, 15) * (1 - lin(f, HEADPHONEJACK_FRAMES - 40, HEADPHONEJACK_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
