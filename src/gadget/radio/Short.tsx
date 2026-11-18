// The Inventor's Desk No. 001 "The Radio", v2 (23 Oct 2026): explain like I'm 5, rich motion and rich visuals, fills the screen
// inside the Shorts safe area. Each beat is a Cam shot over an Ambient layer; every visual is cued to a spoken phrase via
// timing.json (scripts/gadget/gk_align.py). Facts and sources: scripts/gadget/SCRIPT_radio.md. v1 script: script_v1_grownup.json.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Ambient, Aside, C, Cam, FPS, H, Head, Mono, Paper, Safe, Source, Spec, Tag, TopBar, W, ease, lin, makeCues, useGKFonts, win, Timing} from "../kit";
import {PatentPage, Portrait} from "./art";
import {Classroom, Hundred, Jigsaw, LongWire, NoisyRoom, Ocean, Pond, Spark2, TowerCity, Tuner, ValveRadio} from "./art2";
import S from "./script.json";
import T from "./timing.json";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
export const RADIO_FRAMES = cue.total + 45;

const SFX: [number, string, number][] = [
  [at("b01", "bell ring"), "sfx_coin_ding_greenvwbeetle.wav", 0.45],
  [at("b02", "gunpowder"), "sfx_thump_stamp_mpuffenbarger.wav", 0.5],
  [at("b03") - 4, "sfx_paper_slide_kingofgamers.wav", 0.3],
  [at("b05") - 4, "sfx_whoosh_cartoony_branrainey.wav", 0.25],
  [at("b06", "spark"), "sfx_shutter_click_cabledmess.wav", 0.35],
  [at("b08", "patent"), "sfx_thump_stamp_mpuffenbarger.wav", 0.4],
  [at("b09") - 4, "sfx_whoosh_deep_kinoton.wav", 0.3],
  [at("b13", "Nobody"), "sfx_thump_stamp_mpuffenbarger.wav", 0.45],
  [at("b13", "Maxwell"), "sfx_pop_conarb13.wav", 0.2], [at("b13", "Hertz"), "sfx_pop_conarb13.wav", 0.2],
  [at("b13", "Bose"), "sfx_pop_conarb13.wav", 0.2], [at("b13", "Marconi"), "sfx_pop_conarb13.wav", 0.2],
  [at("b15", "only about five"), "sfx_pop_conarb13.wav", 0.3],
];

export const RadioShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const w = (a: number, b: number, out = 4) => win(fr, a, b, out);
  const src = fr < at("b04") ? "IEEE Milestone · Bose, Presidency College, Calcutta, 1895"
    : fr < at("b06") ? "" : fr < at("b07") ? "Maxwell, Phil. Trans. 1865 · IEEE Milestone, Hertz 1886-88"
    : fr < at("b08") ? "IEEE Milestone · Bose, 1895" : fr < at("b09") ? "US patent 586,193 · IEEE Milestone, Signal Hill 1901"
    : fr < at("b13") ? "NASA · radio waves" : fr < at("b14") ? "IEEE Milestones" : fr < at("b15") ? "Prasar Bharati"
    : "Prasar Bharati · NFHS-5 (2019-21)";
  const ringing = fr >= at("b01", "bell ring") && fr < at("b01", "bell ring") + 50 ? 1 : 0;

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <Paper/>
      <Ambient/>
      <Safe>
        {/* b01-b02 the Calcutta classroom */}
        <Cam a={0} b={at("b03")} push={0.06}>
          <Classroom p={ease(fr, 0, 18)} t={t} ring={ringing} burst={fr >= at("b02", "gunpowder") ? ease(fr, at("b02", "gunpowder"), at("b02", "gunpowder") + 40) : 0}
            wallHi={fr >= at("b02", "two walls") ? 1 : 0}/>
          <Head text="{1895}" f0={-20} y={290} size={210} o={w(0, at("b02") - 2)}/>
          <Mono text="A classroom in Calcutta" f0={-10} y={500} color={C.ink2} o={w(0, at("b02") - 2)}/>
          <Tag text="No wire!" f0={at("b01", "With no wire")} x={64} y={570} size={36} accent o={w(at("b01", "With no wire"), at("b02") - 2)}/>
          <Head text={"Gunpowder,\n{too}!"} f0={at("b02") - 2} y={300} size={140} o={w(at("b02") - 2, at("b03"))}/>
          <Tag text="Through two walls" f0={at("b02", "two walls")} x={64} y={600} size={36} accent o={w(at("b02", "two walls"), at("b03"))}/>
        </Cam>

        {/* b03 Bose */}
        <Cam a={at("b03")} b={next("b03")} from="up">
          <Head text={"Jagadish\nChandra {Bose}"} f0={at("b03") - 2} y={280} size={100}/>
          <Portrait src="gadget/radio/bose_geddes1920.jpg" p={ease(fr, at("b03"), at("b03") + 14)} x={250} y={600} w={580} credit="Portrait reproduced in Geddes, 1920 · public domain"/>
          <Tag text="His trick is in every radio" f0={at("b03", "his trick")} x={170} y={1440} size={34} accent/>
        </Cam>

        {/* b04 a long, long wire */}
        <Cam a={at("b04")} b={next("b04")} from="left">
          <Aside text="before that," f0={at("b04") - 2} y={270} size={84}/>
          <Head text={"A long, long\n{wire}"} f0={at("b04", "needed")} y={360} size={130}/>
          <LongWire p={ease(fr, at("b04"), at("b04") + 30)} t={t}/>
        </Cam>

        {/* b05 invisible waves, like ripples */}
        <Cam a={at("b05")} b={next("b05")}>
          <Head text={"Invisible\n{waves}"} f0={at("b05") - 2} y={290} size={140}/>
          <Pond p={ease(fr, at("b05"), at("b05") + 12)} t={t} air={ease(fr, at("b05", "cant see") - 4, at("b05", "cant see") + 12)}/>
          <Tag text="Like ripples in a pond" f0={at("b05", "ripples")} x={180} y={1530} size={34} accent/>
        </Cam>

        {/* b06 Maxwell, then Hertz */}
        <Cam a={at("b06")} b={next("b06")} from="up">
          <Spec big="1865" small="Maxwell: these waves must exist" f0={at("b06") - 2} y={290} size={210} o={w(at("b06") - 2, at("b06", "eighteen eighty six") - 2)}/>
          <Spec big="1886" small="Hertz makes them with a spark" f0={at("b06", "eighteen eighty six")} y={290} size={210} o={w(at("b06", "eighteen eighty six"), next("b06"))}/>
          <Spark2 p={ease(fr, at("b06"), at("b06") + 14)} t={t} rx={fr > at("b06", "spark") ? 1 : 0}/>
        </Cam>

        {/* b07 Bose: through two walls */}
        <Cam a={at("b07")} b={next("b07")}>
          <Head text={"Through\ntwo {walls}"} f0={at("b07") - 2} y={290} size={140}/>
          <Classroom p={ease(fr, at("b07"), at("b07") + 10)} t={t} ring={1} burst={0} wallHi={1} dim={ease(fr, at("b07", "two walls"), at("b07", "two walls") + 14)}/>
        </Cam>

        {/* b08 Marconi: patent, then across the ocean */}
        <Cam a={at("b08")} b={at("b08", "nineteen oh one")}>
          <Spec big="1896" small="Marconi files his wireless patent" f0={at("b08") - 2} y={290} size={210}/>
          <PatentPage src="gadget/radio/marconi_US586193_p1.png" p={ease(fr, at("b08", "Marconi"), at("b08", "Marconi") + 16)} x={220} y={600} w={640} label="US 586,193 · 1897"/>
        </Cam>
        <Cam a={at("b08", "nineteen oh one")} b={next("b08")} from="up">
          <Spec big="1901" small="He said he heard a signal" f0={at("b08", "nineteen oh one")} y={290} size={210}/>
          <Ocean p={ease(fr, at("b08", "nineteen oh one"), at("b08", "nineteen oh one") + 20)} t={t}/>
          <Mono text="Morse 'S' = · · ·" f0={at("b08", "signal")} y={1540} align="center" color={C.ink}/>
        </Cam>

        {/* b09-b11 how it works: tower, waves, your radio */}
        <Cam a={at("b09")} b={next("b11")} push={0.04} from="up">
          <Aside text="so how does it work?" f0={at("b09") - 2} y={270} size={80} o={w(at("b09") - 2, at("b10") - 2)}/>
          <Head text={"A metal rod\n{shakes}"} f0={at("b09", "A tall")} y={360} size={130} o={w(at("b09"), at("b10") - 2)}/>
          <Head text={"Waves fly\nout {fast}"} f0={at("b10") - 2} y={290} size={130} o={w(at("b10") - 2, at("b11") - 2)}/>
          <Head text={"Your radio\nmakes {sound}"} f0={at("b11") - 2} y={290} size={130} o={w(at("b11") - 2, next("b11"))}/>
          <TowerCity p={ease(fr, at("b09"), at("b09") + 14)} t={t} send={ease(fr, at("b09", "shakes"), at("b09", "shakes") + 10)} recv={ease(fr, at("b11", "At your radio"), at("b11", "At your radio") + 12)}/>
        </Cam>

        {/* b12 tuning, then the noisy room */}
        <Cam a={at("b12")} b={at("b12", "like hearing")} from="left">
          <Head text={"Turn the knob,\npick {one}"} f0={at("b12") - 2} y={290} size={116}/>
          <Tuner p={ease(fr, at("b12"), at("b12") + 12)} t={t} pick={ease(fr, at("b12", "Turning the knob"), at("b12", "Turning the knob") + 30)}/>
        </Cam>
        <Cam a={at("b12", "like hearing")} b={next("b12")}>
          <Head text={"One friend\nin a {noisy} room"} f0={at("b12", "like hearing")} y={290} size={116}/>
          <NoisyRoom p={ease(fr, at("b12", "like hearing"), at("b12", "like hearing") + 10)} t={t}/>
        </Cam>

        {/* b13 nobody did it alone: jigsaw */}
        <Cam a={at("b13")} b={next("b13")} from="up">
          <Aside text="here's the surprise:" f0={at("b13") - 2} y={270} size={80}/>
          <Head text={"Nobody did\nit {alone}"} f0={at("b13", "Nobody")} y={360} size={130}/>
          <Jigsaw p={["Maxwell", "Hertz", "Bose", "Marconi", "many others"].map((ph, i) => ease(fr, Math.min(at("b13", ph), at("b13", "Nobody") + 8 + i * 10), Math.min(at("b13", ph), at("b13", "Nobody") + 8 + i * 10) + 14))}/>
        </Cam>

        {/* b14 India on air */}
        <Cam a={at("b14")} b={next("b14")}>
          <Spec big="1923" small="Radio Club of Bombay goes on air" f0={at("b14") - 2} y={290} size={210} o={w(at("b14") - 2, at("b14", "All India Radio") - 2)}/>
          <Spec big="1936" small="The name All India Radio" f0={at("b14", "All India Radio")} y={290} size={210} o={w(at("b14", "All India Radio"), next("b14"))}/>
          <ValveRadio p={ease(fr, at("b14"), at("b14") + 14)} t={t}/>
        </Cam>

        {/* b15 today */}
        <Cam a={at("b15")} b={at("b15", "only about five")} from="up">
          <Spec big="99 in 100" small="Indians within AIR's signal" f0={at("b15") - 2} y={290} size={190}/>
          <Hundred n={99} p={ease(fr, at("b15"), at("b15") + 30)} kind="person"/>
        </Cam>
        <Cam a={at("b15", "only about five")} b={next("b15")}>
          <Spec big="5 in 100" small="homes have a radio set (4.9%)" f0={at("b15", "only about five")} y={290} size={190}/>
          <Hundred n={5} p={ease(fr, at("b15", "only about five"), at("b15", "only about five") + 20)} kind="home"/>
          <Mono text="2005-06: 30.9% · 2019-21: 4.9%" f0={at("b15", "radio set")} y={1600 - 70} align="center"/>
        </Cam>

        {/* b16 sign-off */}
        <Cam a={at("b16")} b={RADIO_FRAMES + 20} push={0.03} from="up">
          <Head text={"Now you\n{know}."} f0={at("b16") - 2} y={720} size={170} align="center"/>
          <Mono text="What should we explain next?" f0={at("b16") + 10} y={1100} align="center" size={30} color={C.ink}/>
          <Mono text="The Inventor's Desk" f0={at("b16") + 16} y={1190} align="center" size={34} color={C.accent}/>
        </Cam>

        <TopBar ep={S.ep} product={S.product} total={RADIO_FRAMES} tag="No. "/>
        <Source text={src} o={src && fr < at("b16") ? 1 : 0}/>
      </Safe>

      <Audio src={staticFile("gadget/radio/vo.wav")}/>
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.09 * lin(f, 0, 15) * (1 - lin(f, RADIO_FRAMES - 40, RADIO_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
