// The Inventor's Desk No. 005 "The Chocolate Bar That Invented the Microwave" (Evergreen, 24 Oct 2026). Bhagyaraj heart
// (an ordinary hero), Nolan skeleton (pledge/turn/prestige; the chocolate as a hairpin loop) and the followable pacing AK
// confirmed with No. 004 v2. AK: "make the visuals richer": layered scenes with secondary motion (art.tsx).
// Facts and sources: docs/inventors_desk/scripts/E1_microwave.md. Silent until voiced (timing.json estimate).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Ambient, Aside, C, Cam, FPS, H, Head, Mono, Paper, Safe, Source, Spec, Strike, Tag, TopBar, W, Zoom, ease, lin, makeCues, useGKFonts, Timing} from "../kit";
import {DeskClose, DeskShrink} from "../desk";
import {Hundred} from "../radio/art2";
import {ChocSpots, KitchenMicrowave, LabScene, MillBooks, MoleculeField, OneMolecule, Popcorn, PotatoCut, Radarange, RadarScene, TurntableOut, WaveStrip} from "./art";
import S from "./script.json";
import T from "./timing.json";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
const VOICED = !(T as {estimate?: boolean}).estimate;
export const MICROWAVE_FRAMES = cue.total + 45;
const CLOSE = cue.total;   // the voice has ended: the desk closes in the silent tail (never touches the hook)

// popcorn pops are spread across the pop animation; the oven "ding" lands on the kitchen shot and the ending
const POP0 = at("b05", "popped");
const SFX: [number, string, number][] = [
  [at("b01", "something strange"), "sfx_whoosh_cartoony_branrainey.wav", 0.2],
  [at("b02", "no fire"), "sfx_coin_ding_greenvwbeetle.wav", 0.3],
  [at("b04", "enemy planes"), "sfx_whoosh_deep_kinoton.wav", 0.25],
  ...[0, 5, 9, 14, 17, 22, 26, 31].map((d, i) => [POP0 + d, "sfx_pop_conarb13.wav", 0.18 + (i % 3) * 0.05] as [number, string, number]),
  [at("b06", "patented"), "sfx_paper_slide_kingofgamers.wav", 0.3],
  [at("b10", "inside out"), "sfx_thump_stamp_mpuffenbarger.wav", 0.35],
  [at("b12", "speed of light"), "sfx_coin_ding_greenvwbeetle.wav", 0.35],
  [at("b13", "one melted chocolate bar"), "sfx_pop_conarb13.wav", 0.25],
];

export const MicrowaveShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const e = (k: string, x: number | string = 0, d = 14) => ease(fr, at(k, x), at(k, x) + d);
  const src = fr < at("b02") ? "Lemelson-MIT · patent filed 8 Oct 1945 (History.com)"
    : fr < at("b03") ? "" : fr < at("b06") ? "Lemelson-MIT, Percy Spencer"
    : fr < at("b07") ? "Radarange, 1947: ~6 ft, ~750 lb (Lemelson-MIT)"
    : fr < at("b10") ? "Dielectric heating · W. Texas A&M, Science Questions"
    : fr < at("b11") ? "Microwaves penetrate a short depth; the rest is conduction"
    : fr < at("b13") ? "Classroom experiment · RUG ScienceLinx"
    : "US EIA, RECS 2020 (118.65 m of 123.53 m homes)";

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <Paper/>
      <Ambient tint={C.accent}/>
      <Safe>
        <DeskShrink f0={CLOSE}>
        {/* b01 the hook: 1945, the lab, the melting chocolate (on screen from frame 0) */}
        <Cam a={0} b={at("b02")} push={0.06}>
          <Spec big="1945" small="A radar lab, USA" f0={-20} y={250} size={200}/>
          <Zoom s={1.0 + 0.1 * e("b01", "chocolate bar", 30)} cx={430} cy={1150} dy={-60}>
            <LabScene p={ease(fr, 0, 14)} t={t} melt={e("b01", "has melted", 24)} look={e("b01", "something strange", 16)}/>
          </Zoom>
          <Tag text="His chocolate bar melted" f0={at("b01", "has melted")} x={120} y={560} size={34} accent/>
        </Cam>

        {/* b02 the question: a box with no fire */}
        <Cam a={at("b02")} b={next("b02")} from="up">
          <Head text={"No fire.\nSo how does it\n{cook}?"} f0={at("b02", "So how") - 2} y={270} size={116}/>
          <Zoom s={0.95} cx={540} cy={1200} dy={0}><KitchenMicrowave p={e("b02", 0, 14)} t={t} ding={e("b02", "no fire", 6)}/></Zoom>
        </Cam>

        {/* b03 the hero: left school at 12, taught himself */}
        <Cam a={at("b03")} b={next("b03")} from="left">
          <Head text={"Percy\n{Spencer}"} f0={at("b03", "Percy Spencer") - 2} y={270} size={150}/>
          <Zoom s={1.0} cx={540} cy={1250} dy={-60}><MillBooks p={e("b03", 0, 14)} t={t} books={e("b03", "taught himself", 50)}/></Zoom>
          <Tag text="Left school at 12" f0={at("b03", "left school at twelve")} x={64} y={580} size={32} accent/>
          <Tag text="Self-taught" f0={at("b03", "taught himself")} x={500} y={580} size={32}/>
        </Cam>

        {/* b04 magnetrons: radar sends invisible waves to spot planes */}
        <Cam a={at("b04")} b={next("b04")} from="up" push={0.05}>
          <Head text={"He built\n{magnetrons}"} f0={at("b04") - 2} y={280} size={130}/>
          <Zoom s={1.0} cx={540} cy={1150} dy={-20}><RadarScene p={e("b04", 0, 14)} t={t} inset={e("b04", "invisible waves", 16)}/></Zoom>
          <Mono text="Radar's wave-maker" f0={at("b04", "That's the part")} y={560} color={C.ink2} size={30}/>
        </Cam>

        {/* b05 the turn: kernels near the machine pop */}
        <Cam a={at("b05")} b={next("b05")} from="left">
          <Aside text="he got curious…" f0={at("b05") - 2} y={260} size={84}/>
          <Head text={"{Pop}."} f0={POP0} y={360} size={200}/>
          <Zoom s={1.0} cx={540} cy={1230} dy={-40}><Popcorn p={e("b05", 0, 12)} t={t} pop={ease(fr, POP0 - 6, POP0 + 50, 0, 1)}/></Zoom>
        </Cam>

        {/* b06 patent; the first oven, 1947, taller than a person */}
        <Cam a={at("b06")} b={next("b06")} from="up">
          <Head text={"The first oven:\n{taller} than you"} f0={at("b06", "Their first oven") - 2} y={270} size={96}/>
          <Zoom s={0.95} cx={540} cy={1150} dy={20}><Radarange p={e("b06", 0, 14)} t={t}/></Zoom>
          <Tag text="Restaurants · ships" f0={at("b06", "restaurants")} x={600} y={620} size={30}/>
        </Cam>

        {/* b07 what's the trick: microwaves are short radio waves */}
        <Cam a={at("b07")} b={next("b07")} from="left">
          <Aside text="so what's the trick?" f0={at("b07") - 2} y={260} size={80}/>
          <Head text={"Short waves:\n{microwaves}"} f0={at("b07", "much shorter")} y={350} size={116}/>
          <WaveStrip p={e("b07", 0, 40)} t={t}/>
        </Cam>

        {/* b08 water: a plus end and a minus end */}
        <Cam a={at("b08")} b={next("b08")} from="up">
          <Head text={"Food is full\nof {water}"} f0={at("b08") - 2} y={280} size={128}/>
          <Zoom s={1.0} cx={540} cy={1140} dy={0}><OneMolecule p={e("b08", 0, 14)} t={t}/></Zoom>
          <Tag text="+ end · − end" f0={at("b08", "plus end")} x={360} y={600} size={36} accent/>
        </Cam>

        {/* b09 the waves flip them billions of times a second: heat (answers b02) */}
        <Cam a={at("b09")} b={next("b09")} from="left" push={0.05}>
          <Head text={"Flip, flip, flip\n= {heat}"} f0={at("b09") - 2} y={280} size={112}/>
          <MoleculeField p={e("b09", 0, 12)} t={t} flip={ease(fr, at("b09", "flipping"), at("b09", "makes heat") + 10)}/>
          <Mono text="Billions of times every second" f0={at("b09", "billions")} y={1495} align="center" color={C.accent} size={30}/>
        </Cam>

        {/* b10 the twist: not inside-out */}
        <Cam a={at("b10")} b={next("b10")} from="up">
          <Strike label="MYTH" text="Cooks inside-out" f0={at("b10", "inside out")} y={270}/>
          <Head text={"Outside {first}"} f0={at("b10", "few centimetres") - 2} y={430} size={116}/>
          <Zoom s={0.95} cx={540} cy={1160} dy={10}><PotatoCut p={e("b10", 0, 14)} t={t} heat={ease(fr, at("b10", "few centimetres"), next("b10") - 10)}/></Zoom>
        </Cam>

        {/* b11 reminder + try-it: out with the turntable, in with the chocolate */}
        <Cam a={at("b11")} b={next("b11")} from="left">
          <Aside text="remember the chocolate?" f0={at("b11") - 2} y={260} size={80}/>
          <Head text={"Try {this}"} f0={at("b11", "Try this")} y={360} size={150}/>
          <Zoom s={0.95} cx={540} cy={1160} dy={0}><TurntableOut p={e("b11", 0, 12)} t={t} lift={e("b11", "Take out the turntable", 30)} bar={e("b11", "chocolate bar", 16)}/></Zoom>
        </Cam>

        {/* b12 the prestige: melted spots → the speed of light */}
        <Cam a={at("b12")} b={next("b12")} from="up" push={0.04}>
          <Head text={"Chocolate =\nspeed of {light}"} f0={at("b12", "speed of light") - 2} y={270} size={112}/>
          <Zoom s={1.0} cx={540} cy={1150} dy={0}><ChocSpots p={1} t={t} melt={e("b12", 0, 30)} ruler={e("b12", "Measure the gap", 24)}/></Zoom>
          <Mono text="6 cm × 2 × 2.45 GHz ≈ 300,000 km/s" f0={at("b12", "one simple sum")} y={1500} align="center" color={C.ink} size={28}/>
        </Cam>

        {/* b13 today + hairpin back to the chocolate + the comment question */}
        <Cam a={at("b13")} b={MICROWAVE_FRAMES + 20} push={0.03} from="left">
          <div style={{opacity: 1 - e("b13", "It all started", 10)}}>
            <Spec big="96 in 100" small="US homes have a microwave" f0={at("b13") - 2} y={280} size={170}/>
            <Hundred n={96} p={e("b13", "ninety six", 30)} kind="home"/>
          </div>
          <div style={{opacity: e("b13", "It all started", 10)}}>
            <Head text={"It began with\n{one} chocolate bar"} f0={at("b13", "It all started")} y={280} size={90}/>
            <Zoom s={0.9} cx={540} cy={1150} dy={0}><ChocSpots p={1} t={t} melt={1} ruler={0}/></Zoom>
            <Mono text="What would you have tested first?" f0={at("b13", "What would you")} y={1480} align="center" color={C.accent} size={30}/>
          </div>
        </Cam>

        </DeskShrink>
        <DeskClose f0={CLOSE}/>
        <TopBar ep={S.ep} product={S.product} total={MICROWAVE_FRAMES} tag="No. "/>
        <Source text={src} o={src && fr < CLOSE ? 1 : 0}/>
      </Safe>

      {VOICED && <Audio src={staticFile("gadget/microwave/vo.wav")}/>}
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.08 * lin(f, 0, 15) * (1 - lin(f, MICROWAVE_FRAMES - 40, MICROWAVE_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
