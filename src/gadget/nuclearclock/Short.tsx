// The Inventor's Desk No. 004 "The Clock Inside an Atom", v2 (24 Oct 2026). AK on v1: "Good hook, after that the story
// moves faster than the audience can follow." v2 keeps the Nolan hook and the head/feet hairpin, but tells the clocks in one
// straight line (1707 → Harrison → atoms → the nucleus), one idea per beat, with a recap and a reminder of the hook.
// v1 is kept as Short_v1_fast.tsx.txt. Facts and sources: docs/inventors_desk/scripts/N2_nuclearclock.md.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Ambient, Aside, C, Cam, FPS, H, Head, Mono, Paper, Safe, Source, Spec, Tag, TopBar, W, Zoom, ease, lin, makeCues, useGKFonts, Timing} from "../kit";
import {DeskClose, DeskShrink} from "../desk";
import {Stamp} from "../labgold/art";
import {AtomDive, Dial, HeadFeet, MmLayers, PhoneSats, SeaWatch, StormSea, TwoLabs} from "./art";
import S from "./script.json";
import T from "./timing.json";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
const VOICED = !(T as {estimate?: boolean}).estimate;
export const NUCLEARCLOCK_FRAMES = cue.total + 45;
const CLOSE = cue.total;   // the voice has ended: the desk closes in the silent tail (never touches the hook)

// the audible clock: steady at sea, faster for atoms, fastest at the nucleus; steady again for the hairpin
const ticks = (a: number, b: number, perSec: number) => {
  const out: number[] = []; for (let f = a; f < b; f += Math.round(FPS / perSec)) out.push(f); return out;
};
const TICKS: [number, number][] = [
  ...ticks(0, at("b02"), 1).map((f) => [f, 0.22] as [number, number]),
  ...ticks(at("b03"), next("b05"), 1).map((f) => [f, 0.18] as [number, number]),
  ...ticks(at("b07", "Today"), next("b07"), 4).map((f) => [f, 0.14] as [number, number]),
  ...ticks(at("b10", "tiny core"), next("b10"), 8).map((f) => [f, 0.12] as [number, number]),
  ...ticks(at("b13"), NUCLEARCLOCK_FRAMES, 1).map((f) => [f, 0.22] as [number, number]),
];
const SFX: [number, string, number][] = [
  [at("b02", "go back"), "sfx_whoosh_deep_kinoton.wav", 0.3],
  [at("b04", "four British warships"), "sfx_whoosh_cartoony_branrainey.wav", 0.25],
  [at("b05", "five seconds"), "sfx_pop_conarb13.wav", 0.3],
  [at("b06", "The steadier"), "sfx_underline_stroke_zembacraftworks.wav", 0.35],
  [at("b11", "nuclear clock"), "sfx_thump_stamp_mpuffenbarger.wav", 0.5],
  [at("b13", "So yes"), "sfx_coin_ding_greenvwbeetle.wav", 0.3],
];

export const NuclearClockShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const e = (k: string, x: number | string = 0, d = 14) => ease(fr, at(k, x), at(k, x) + d);
  const src = fr < at("b02") ? "General relativity · JILA, Nature 602, 420 (2022)"
    : fr < at("b03") ? "Nature, 7 Oct 2026 (Schumm et al.; Ding et al.)"
    : fr < at("b05") ? "Scilly 1707 (accounts vary: 1,400–2,000 lost)"
    : fr < at("b06") ? "Harrison H4, 1761 trial: ~5 s in 81 days"
    : fr < at("b07") ? "" : fr < at("b08") ? "Atomic clocks · NPL" : fr < at("b09") ? "Light ≈ 30 cm per nanosecond · GPS"
    : fr < at("b10") ? "" : fr < at("b11") ? "Nature, 7 Oct 2026 (TU Wien; Tsinghua Univ.)"
    : fr < at("b12") ? "Nature press release, 8 Oct 2026"
    : fr < at("b13") ? "Bothwell et al., Nature 602, 420 (2022)" : "g·h/c² for 1.7 m over 80 years ≈ 470 ns";

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <Paper/>
      <Ambient tint={C.accent}/>
      <Safe>
        <DeskShrink f0={CLOSE}>
        {/* b01 the hook (pledge): on screen from frame 0 */}
        <Cam a={0} b={at("b02")} push={0.05}>
          <Head text={"Your head ages\n{faster} than\nyour feet"} f0={-20} y={270} size={112}/>
          <Zoom s={0.95} cx={540} cy={1180} dy={-20}><HeadFeet p={ease(fr, 0, 14)} t={t}/></Zoom>
          <Aside text="it's true." f0={at("b01", "But it's true")} y={640} size={80} color={C.accent}/>
        </Cam>

        {/* b02 a brand-new clock; rewind 300 years */}
        <Cam a={at("b02")} b={next("b02")} from="up">
          <Head text={"A brand-new\nkind of {clock}"} f0={at("b02") - 2} y={290} size={124}/>
          <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0}}>
            <g opacity={e("b02", 0, 12)}><Dial cx={540} cy={1130} r={260} a={fr < at("b02", "go back") ? t * 0.5 : t * 0.5 - (fr - at("b02", "go back")) / 6}/></g>
          </svg>
          <Tag text="Rewind 300 years" f0={at("b02", "go back")} x={300} y={1440} size={34} accent/>
        </Cam>

        {/* b03-b04 the sea, 1707: you need the exact time; the fleet is lost */}
        <Cam a={at("b03")} b={next("b04")} from="left" push={0.04}>
          <Spec big="1707" small="At sea, finding your place needs the exact time" f0={at("b03") - 2} y={290} size={190}/>
          <Zoom s={1.0} cx={540} cy={1200} dy={-30}><StormSea p={e("b03", 0, 14)} t={t} wreck={e("b04", "four British warships", 40)}/></Zoom>
          <Tag text="1,400+ sailors died" f0={at("b04", "fourteen hundred")} x={280} y={600} size={34} accent/>
        </Cam>

        {/* b05 Harrison's clock */}
        <Cam a={at("b05")} b={next("b05")} from="up">
          <Head text={"John Harrison,\na {carpenter}"} f0={at("b05") - 2} y={280} size={112}/>
          <Zoom s={0.85} cx={540} cy={1150} dy={-30}><SeaWatch p={e("b05", "a better clock", 12)} t={t}/></Zoom>
          <Tag text="−5 seconds in ~3 months" f0={at("b05", "five seconds")} x={230} y={1420} size={34} accent/>
        </Cam>

        {/* b06 the rule + recap: the steadier the tick, the better the clock */}
        <Cam a={at("b06")} b={next("b06")} from="left">
          <Aside text="the secret of every clock:" f0={at("b06") - 2} y={260} size={72}/>
          <Head text={"The steadier\nthe tick, the\n{better} the clock"} f0={at("b06", "The steadier")} y={360} size={94}/>
          <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0}}>
            <g opacity={e("b06", 0, 12)}><Dial cx={540} cy={1200} r={190} a={Math.floor(t * 2) / 120}/></g>
          </svg>
          <Mono text="tick · tick · tick" f0={at("b06", "ticks")} y={1440} align="center" color={C.ink} size={32}/>
        </Cam>

        {/* b07 then a swinging wheel, now an atom's wobble */}
        <Cam a={at("b07")} b={next("b07")} from="up">
          <Head text={"Then: a wheel\nNow: an {atom}"} f0={at("b07") - 2} y={280} size={112}/>
          <div style={{opacity: 1 - e("b07", "Today", 10)}}><Zoom s={0.7} cx={540} cy={1150} dy={0}><SeaWatch p={1} t={t}/></Zoom></div>
          <div style={{opacity: e("b07", "Today", 10)}}><Zoom s={0.85} cx={540} cy={1150} dy={0}><AtomDive p={1} t={t} jostle={0} zoom={0}/></Zoom></div>
          <Mono text="Billions of wobbles every second" f0={at("b07", "billions")} y={1440} align="center" color={C.accent} size={30}/>
        </Cam>

        {/* b08 your phone's map depends on them */}
        <Cam a={at("b08")} b={next("b08")} from="left">
          <Head text={"Your map needs\n{atomic} clocks"} f0={at("b08") - 2} y={280} size={108}/>
          <Zoom s={1.0} cx={540} cy={1150} dy={-30}><PhoneSats p={e("b08", 0, 14)} t={t} ruler={e("b08", "Off by", 30)}/></Zoom>
        </Cam>

        {/* b09 the weakness: outer parts get pushed around */}
        <Cam a={at("b09")} b={next("b09")} from="up">
          <Head text={"An atom's\n{weak} spot"} f0={at("b09") - 2} y={280} size={130}/>
          <Zoom s={0.9} cx={540} cy={1150} dy={0}><AtomDive p={1} t={t} jostle={e("b09", "pushed around", 10)} zoom={0}/></Zoom>
        </Cam>

        {/* b10 the new clocks listen to the core */}
        <Cam a={at("b10")} b={next("b10")} from="left">
          <Head text={"Listen to the\natom's {core}"} f0={at("b10") - 2} y={280} size={120}/>
          <Mono text="Vienna + Beijing · October 2026" f0={at("b10", "Vienna")} y={560} color={C.ink2}/>
          <div style={{opacity: 1 - e("b10", "tiny core", 10)}}><Zoom s={0.8} cx={540} cy={1150} dy={20}><TwoLabs p={e("b10", 0, 12)} t={t}/></Zoom></div>
          <div style={{opacity: e("b10", "tiny core", 10)}}><Zoom s={0.9} cx={540} cy={1150} dy={0}><AtomDive p={1} t={t} jostle={0} zoom={e("b10", "tiny core", 30)}/></Zoom></div>
          <Tag text="Better protected" f0={at("b10", "better protected")} x={330} y={1440} size={34} accent/>
        </Cam>

        {/* b11 where it stands */}
        <Cam a={at("b11")} b={next("b11")} from="up">
          <Head text={"A nuclear\n{clock}"} f0={at("b11") - 2} y={280} size={140}/>
          <Stamp text="PUBLISHED" p={ease(fr, at("b11", "nuclear clock"), at("b11", "nuclear clock") + 8)} x={150} y={640}/>
          <Mono text="Not yet better than the best atomic clocks" f0={at("b11", "not yet better")} y={980} color={C.ink} size={28}/>
          <Spec big="~10,000×" small="steadier, with more work" f0={at("b11", "ten thousand")} y={1080} size={150} align="center" color={C.accent}/>
        </Cam>

        {/* b12 reminder of the hook; clocks feel gravity */}
        <Cam a={at("b12")} b={next("b12")} from="left">
          <Aside text="remember your head and feet?" f0={at("b12") - 2} y={260} size={70}/>
          <Head text={"Clocks that\nfeel {gravity}"} f0={at("b12", "Clocks this good")} y={350} size={124}/>
          <Zoom s={1.0} cx={540} cy={1150} dy={0}><MmLayers p={e("b12", "Clocks this good", 14)} t={t}/></Zoom>
          <Mono text="Higher up, time runs faster" f0={at("b12", "Time runs faster")} y={1470} align="center" color={C.accent} size={30}/>
        </Cam>

        {/* b13 the hairpin: back to the head and feet; loops into b01 */}
        <Cam a={at("b13")} b={NUCLEARCLOCK_FRAMES + 20} push={0.03} from="up">
          <Head text={"Your head is\n{older} than\nyour feet"} f0={at("b13") - 2} y={270} size={118}/>
          <Zoom s={0.95} cx={540} cy={1180} dy={-20}><HeadFeet p={1} t={t}/></Zoom>
          <Mono text="By ~0.0000005 s over a lifetime" f0={at("b13", "half a millionth")} y={640} color={C.accent} size={30}/>
          <Mono text="What should we time next?" f0={at("b13", "half a millionth") + 24} y={1560} align="center" size={28} color={C.ink}/>
        </Cam>

        </DeskShrink>
        <DeskClose f0={CLOSE}/>
        <TopBar ep={S.ep} product={S.product} total={NUCLEARCLOCK_FRAMES} tag="No. "/>
        <Source text={src} o={src && fr < at("b13") + 20 && fr < CLOSE ? 1 : 0}/>
      </Safe>

      {VOICED && <Audio src={staticFile("gadget/nuclearclock/vo.wav")}/>}
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.08 * lin(f, 0, 15) * (1 - lin(f, NUCLEARCLOCK_FRAMES - 40, NUCLEARCLOCK_FRAMES - 2))}/>
      {TICKS.map(([f, v], i) => (
        <Sequence key={`t${i}`} from={Math.max(0, f)} durationInFrames={6}><Audio src={staticFile("gadget/nuclearclock/tick.wav")} volume={v}/></Sequence>
      ))}
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
