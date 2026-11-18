// The Inventor's Desk No. 002 "The Fridge" (AK 22 Oct 2026: explain like I'm 5; rich motion and rich visuals; fill the screen).
// Each beat is a Cam shot (slides in, pushes in, slides out) over an Ambient particle layer; every visual is cued to a spoken
// phrase via timing.json; all content sits inside the Shorts safe area. Facts and sources: scripts/gadget/SCRIPT_fridge.md.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Ambient, Aside, C, Cam, FPS, H, Head, Mono, Paper, Safe, Source, Spec, Tag, TopBar, W, Zoom, ease, lin, makeCues, useGKFonts, win, Timing} from "../kit";
import {HundredDots, PatentPage} from "../radio/art";
import {BucketBoat, CullenFlask, DryingDrop, FridgeFront, FridgeLoop, IceShip, MeltCubes, WarmBack, WetHand} from "./art";
import S from "./script.json";
import T from "./timing.json";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
export const FRIDGE_FRAMES = cue.total + 45;

const SFX: [number, string, number][] = [
  [at("b01", "a ship"), "sfx_whoosh_deep_kinoton.wav", 0.3],
  [at("b02") - 4, "sfx_whoosh_cartoony_branrainey.wav", 0.2],
  [at("b04", "blow on it"), "sfx_whoosh_cartoony_branrainey.wav", 0.35],
  [at("b06") - 4, "sfx_whoosh_cartoony_branrainey.wav", 0.2],
  [at("b07", "patented"), "sfx_paper_slide_kingofgamers.wav", 0.35],
  [at("b08") - 4, "sfx_whoosh_deep_kinoton.wav", 0.25],
  [at("b11", "doesn't make cold"), "sfx_thump_stamp_mpuffenbarger.wav", 0.5],
  [at("b13", "Einstein"), "sfx_paper_slide_kingofgamers.wav", 0.35],
  [at("b14", "thirty eight"), "sfx_pop_conarb13.wav", 0.3],
];

export const FridgeShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const w = (a: number, b: number, out = 4) => win(fr, a, b, out);
  const src = fr < at("b03") ? "Tudor's diary & Capt. Littlefield, via American Heritage (1991)"
    : fr < at("b06") ? "" : fr < at("b07") ? "Cullen, Essays and Observations, Edinburgh 1756"
    : fr < at("b08") ? "Perkins, GB patent 6662 (1834) · ASME · drawing: Sci. American 1883"
    : fr < at("b13") ? "Boston University physics notes · MIT 2.972" : fr < at("b14") ? "US patent 1,781,541 (Einstein & Szilard, 1930)"
    : "Godrej press release · NFHS-5 (2019-21), Table 2.11";
  const step = fr < at("b08") ? 0 : fr < at("b09") ? 1 : fr < at("b10") ? 2 : fr < at("b11") ? 3 : 4;

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <Paper/>
      <Ambient/>
      <Safe>
        {/* b01 the ice ship */}
        <Cam a={0} b={at("b02")} push={0.05}>
          <Zoom s={1.0} cx={540} cy={1200} dy={-40}><IceShip p={ease(fr, at("b01", "a ship") - 10, at("b01") + 240, 0, 1)} draw={ease(fr, 0, 30)} t={t}/></Zoom>
          <Head text="{1833}" f0={-20} y={290} size={210}/>
          <Mono text="No fridges. Just ice, by ship." f0={-10} y={500} color={C.ink2}/>
          <Tag text="A mountain of ice" f0={at("b01", "mountain")} x={64} y={570} size={32} accent/>
        </Cam>

        {/* b02 melting cubes */}
        <Cam a={at("b02")} b={next("b02")} from="up">
          <Spec big="4 months" small="at sea" f0={at("b02") - 2} y={290} size={190}/>
          <Zoom s={1.4} cx={540} cy={1150} dy={-40}><MeltCubes p={ease(fr, at("b02"), at("b02") + 10)} melt={ease(fr, at("b02", "more than half"), at("b02", "more than half") + 30)} t={t}/></Zoom>
          <Tag text="More than half still ice!" f0={at("b02", "more than half") + 10} x={250} y={1470} size={32} accent/>
        </Cam>

        {/* b03 the question */}
        <Cam a={at("b03")} b={next("b03")}>
          <Head text={"How does a\nfridge keep\nfood {cold}?"} f0={at("b03") - 2} y={280} size={116}/>
          <Zoom s={0.9} cx={540} cy={1170} dy={-20}><FridgeFront p={ease(fr, at("b03"), at("b03") + 14)} t={t}/></Zoom>
        </Cam>

        {/* b04 wet hand */}
        <Cam a={at("b04")} b={next("b04")} from="left">
          <Aside text="first, try this:" f0={at("b04") - 2} y={270} size={84}/>
          <Head text={"Wet hand.\n{Blow}."} f0={at("b04", "Wet")} y={370} size={140}/>
          <Zoom s={1.25} cx={560} cy={1180} dy={-40}><WetHand p={ease(fr, at("b04", "Wet") - 4, at("b04", "Wet") + 10)} blow={ease(fr, at("b04", "blow on it"), at("b04", "blow on it") + 12)} t={t}/></Zoom>
        </Cam>

        {/* b05 drying drop */}
        <Cam a={at("b05")} b={next("b05")}>
          <Head text={"Drying water\ntakes heat\n{away}"} f0={at("b05") - 2} y={280} size={116}/>
          <Zoom s={1.4} cx={540} cy={1150} dy={-30}><DryingDrop p={ease(fr, at("b05"), at("b05") + 10)} dry={ease(fr, at("b05", "dries up"), at("b05", "dries up") + 60)} t={t}/></Zoom>
          <Tag text="The whole secret of a fridge" f0={at("b05", "whole secret")} x={160} y={1480} size={32} accent/>
        </Cam>

        {/* b06 Cullen */}
        <Cam a={at("b06")} b={next("b06")} from="up">
          <Spec big="1755" small="William Cullen, a teacher in Scotland" f0={at("b06") - 2} y={290} size={210}/>
          <Zoom s={1.25} cx={540} cy={1150} dy={-50}><CullenFlask p={ease(fr, at("b06"), at("b06") + 12)} freeze={ease(fr, at("b06", "made ice"), at("b06", "made ice") + 50)} t={t}/></Zoom>
        </Cam>

        {/* b07 Perkins */}
        <Cam a={at("b07")} b={next("b07")}>
          <Spec big="1834" small="Jacob Perkins: the same trick, in a loop" f0={at("b07") - 2} y={290} size={210}/>
          <PatentPage src="gadget/fridge/perkins_bramwell1883.jpg" p={ease(fr, at("b07", "patented"), at("b07", "patented") + 16)} x={110} y={640} w={860} label="Patent 1834 · drawn 1883" rot={-2}/>
          <Tag text="Grandfather of your fridge" f0={at("b07", "grandfather")} x={200} y={1480} size={34} accent/>
        </Cam>

        {/* b08-b10 how it works: one shot, the loop lights up step by step */}
        <Cam a={at("b08")} b={next("b10")} push={0.04} from="up">
          <Head text={"1. It dries up,\ngrabs {heat}"} f0={at("b08") - 2} y={290} size={110} o={w(at("b08") - 2, at("b09") - 2)}/>
          <Head text={"2. Squeeze it,\nit gets {hot}"} f0={at("b09") - 2} y={290} size={110} o={w(at("b09") - 2, at("b10") - 2)}/>
          <Head text={"3. Heat goes\nout the {back}"} f0={at("b10") - 2} y={290} size={110} o={w(at("b10") - 2, next("b10"))}/>
          <Zoom s={1.0} cx={520} cy={1200} dy={-60}><FridgeLoop p={ease(fr, at("b08"), at("b08") + 14)} t={t} step={step}/></Zoom>
          <Mono text="Round and round it goes" f0={at("b10", "Round and round")} y={1555} align="center" color={C.ink} size={30}/>
        </Cam>

        {/* b11 the funny part */}
        <Cam a={at("b11")} b={next("b11")} from="left">
          <Aside text="here's the funny part:" f0={at("b11") - 2} y={270} size={80}/>
          <Head text={"It doesn't\nmake cold.\nIt moves {heat}."} f0={at("b11", "doesn't make cold")} y={360} size={112}/>
          <Zoom s={1.12} cx={480} cy={1320} dy={-120}><BucketBoat p={ease(fr, at("b11", "doesn't make cold"), at("b11", "doesn't make cold") + 14)} t={t}/></Zoom>
        </Cam>

        {/* b12 warm back */}
        <Cam a={at("b12")} b={next("b12")}>
          <Head text={"That's why the\nback is {warm}"} f0={at("b12") - 2} y={290} size={112}/>
          <Zoom s={1.0} cx={540} cy={1180} dy={-60}><WarmBack p={ease(fr, at("b12"), at("b12") + 12)} t={t}/></Zoom>
          <Head text="{Warm}!" f0={at("b12", "feels warm")} y={1430} size={110} align="center"/>
        </Cam>

        {/* b13 Einstein */}
        <Cam a={at("b13")} b={next("b13")} from="up">
          <Head text={"Einstein's\n{fridge}"} f0={at("b13") - 2} y={290} size={140}/>
          <PatentPage src="gadget/fridge/einstein_US1781541_p1.png" p={ease(fr, at("b13") + 4, at("b13") + 20)} x={220} y={640} w={640} label="US 1,781,541 · 1930"/>
          <Tag text="No squeezing pump!" f0={at("b13", "no squeezing")} x={240} y={1430} size={36} accent/>
          <Mono text="With Leo Szilard" f0={at("b13", "patent")} x={560} y={1520}/>
        </Cam>

        {/* b14 India */}
        <Cam a={at("b14")} b={at("b14", "Today")}>
          <Spec big="1958" small="Godrej says: the first Indian fridge" f0={at("b14") - 2} y={290} size={210}/>
          <Zoom s={0.9} cx={540} cy={1170} dy={-20}><FridgeFront q={false} p={ease(fr, at("b14"), at("b14") + 12)} t={t}/></Zoom>
          <Tag text="Made in India" f0={at("b14", "first Indian")} x={380} y={1470} size={34} accent/>
        </Cam>
        <Cam a={at("b14", "Today")} b={next("b14")} from="up">
          <Spec big="38 in 100" small="Indian homes have a fridge" f0={at("b14", "Today")} y={290} size={190}/>
          <Zoom s={1.25} cx={540} cy={1060}><HundredDots n={38} p={ease(fr, at("b14", "Today"), at("b14", "Today") + 24) * 4} x={240} y={760}/></Zoom>
          <Mono text="Cities 63 · villages 25 (2019-21)" f0={at("b14", "every hundred")} y={1500} align="center"/>
        </Cam>

        {/* b15 sign-off */}
        <Cam a={at("b15")} b={FRIDGE_FRAMES + 20} push={0.03} from="up">
          <Head text={"Now you\n{know}."} f0={at("b15") - 2} y={720} size={170} align="center"/>
          <Mono text="What should we explain next?" f0={at("b15") + 10} y={1100} align="center" size={30} color={C.ink}/>
          <Mono text="The Inventor's Desk" f0={at("b15") + 16} y={1190} align="center" size={34} color={C.accent}/>
        </Cam>

        <TopBar ep={S.ep} product={S.product} total={FRIDGE_FRAMES} tag="No. "/>
        <Source text={src} o={src && fr < at("b15") ? 1 : 0}/>
      </Safe>

      <Audio src={staticFile("gadget/fridge/vo.wav")}/>
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.09 * lin(f, 0, 15) * (1 - lin(f, FRIDGE_FRAMES - 40, FRIDGE_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
