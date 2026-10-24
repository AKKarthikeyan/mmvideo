// The Inventor's Desk No. 003 "Lab-Made Gold" (first Now episode, 23 Oct 2026): the news is the hook and the "today",
// the 2,000-year backstory is the middle (docs/inventors_desk/STORY_FORMAT.md). Same shot grammar as 002: each beat is a Cam
// shot over the Ambient layer, every visual cued to a spoken phrase via timing.json. Facts and sources:
// docs/inventors_desk/scripts/N1_labgold.md. Until the narration is voiced, timing.json is an estimate and the Short is silent.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Ambient, Aside, C, Cam, FPS, H, Head, Mono, Paper, Safe, Source, Spec, Tag, TopBar, W, Zoom, ease, lin, makeCues, useGKFonts, Timing} from "../kit";
import {DeskClose, DeskShrink} from "../desk";
import {AtomHit, Decay, FewAtoms, Furnace, FusionRing, GoldBanana, GoldCube, LeadSkim, MixPot, NeutronHit, NewtonDesk, Nucleus, PeriodicPair, Piles, Stamp, ThermoBead, TwoRings} from "./art";
import S from "./script.json";
import T from "./timing.json";

const cue = makeCues(T as unknown as Timing);
const {at, next} = cue;
const VOICED = !(T as {estimate?: boolean}).estimate;
export const LABGOLD_FRAMES = cue.total + 45;
const CLOSE = cue.total;   // the voice has ended: the desk closes in the silent tail (never touches the hook)

const SFX: [number, string, number][] = [
  [at("b01", "real gold"), "sfx_coin_ding_greenvwbeetle.wav", 0.3],
  [at("b03") - 4, "sfx_whoosh_cartoony_branrainey.wav", 0.2],
  [at("b06", "nineteen nineteen"), "sfx_pop_conarb13.wav", 0.3],
  [at("b08", "specks"), "sfx_whoosh_deep_kinoton.wav", 0.25],
  [at("b10", "Mercury is eighty"), "sfx_pop_conarb13.wav", 0.3],
  [at("b12", "Mercury becomes gold"), "sfx_coin_ding_greenvwbeetle.wav", 0.35],
  [at("b13", "banana"), "sfx_pop_conarb13.wav", 0.3],
  [at("b14", "no one else"), "sfx_thump_stamp_mpuffenbarger.wav", 0.5],
];

export const LabGoldShort: React.FC = () => {
  useGKFonts();
  const fr = useCurrentFrame(); const t = fr / FPS;
  const e = (k: string, x: number | string = 0, d = 14) => ease(fr, at(k, x), at(k, x) + d);
  const src = fr < at("b03") ? "Marathon Fusion on X, 21 Oct 2026 · Euronews, 23 Oct 2026"
    : fr < at("b04") ? "World Gold Council, above-ground stocks, end of 2025"
    : fr < at("b05") ? "The Chymistry of Isaac Newton (Indiana Univ.) · Princeton UP"
    : fr < at("b06") ? "" : fr < at("b07") ? "Rutherford 1919 · Nobel Lindau · AIP"
    : fr < at("b08") ? "Sherr, Bainbridge & Anderson, Phys. Rev. 60, 473 (1941)"
    : fr < at("b09") ? "CERN / ALICE, 8 May 2025 · Phys. Rev. C 111"
    : fr < at("b11") ? "" : fr < at("b13") ? "Rutkowski, Harter & Parisi, arXiv 2507.13461 (2025)"
    : fr < at("b14") ? "arXiv 2507.13461, section 4.1.2 (company's own paper)"
    : fr < at("b15") ? "Marathon Fusion on X · not independently checked"
    : fr < at("b16") ? "arXiv 2507.13461 · World Gold Council, 2025 mine output" : "";

  return (
    <AbsoluteFill style={{width: W, height: H, overflow: "hidden"}}>
      <Paper/>
      <Ambient tint={C.accent}/>
      <Safe>
        <DeskShrink f0={CLOSE}>
        {/* b01 the hook: a mercury bead rolls out of a thermometer and turns gold (on screen from frame 0) */}
        <Cam a={0} b={at("b02")} push={0.05}>
          <Head text={"Mercury\ninto {gold}?"} f0={-20} y={280} size={150}/>
          <Mono text="October 2026 · a startup says it did it" f0={-10} y={590} color={C.ink2}/>
          <Zoom s={1.0} cx={540} cy={1250} dy={-60}><ThermoBead p={ease(fr, 0, 16)} roll={ease(fr, 12, at("b01", "real gold"))} gold={e("b01", "real gold", 20)} t={t}/></Zoom>
        </Cam>

        {/* b02 alchemists failed: the furnace */}
        <Cam a={at("b02")} b={next("b02")} from="up">
          <Head text={"Alchemists\nfailed for\n{2,000} years"} f0={at("b02") - 2} y={270} size={118}/>
          <Zoom s={0.85} cx={540} cy={1150} dy={-20}><Furnace p={e("b02", 0, 12)} t={t}/></Zoom>
          <Mono text="Some were tricksters" f0={at("b02", "tricksters")} y={645} color={C.ink2} size={30}/>
          <Aside text="the real thing?" f0={at("b02", "the real thing")} y={705} align="center" size={92} color={C.accent}/>
        </Cam>

        {/* b03 rare and never rusts: all gold ever mined as one cube */}
        <Cam a={at("b03")} b={next("b03")}>
          <Head text={"All the gold\never {mined}"} f0={at("b03") - 2} y={280} size={124}/>
          <Tag text="Never rusts" f0={at("b03", "never rusts")} x={64} y={560} size={32} accent/>
          <Tag text="Kept for generations" f0={at("b03", "families")} x={340} y={560} size={32}/>
          <Zoom s={1.0} cx={540} cy={1250} dy={-50}><GoldCube p={e("b03", "one cube", 26)} t={t}/></Zoom>
        </Cam>

        {/* b04 even Newton */}
        <Cam a={at("b04")} b={next("b04")} from="left">
          <Aside text="for centuries, people tried." f0={at("b04") - 2} y={270} size={76}/>
          <Head text={"Even Isaac\n{Newton}"} f0={at("b04", "Isaac Newton")} y={360} size={140}/>
          <Zoom s={1.05} cx={540} cy={1250} dy={-60}><NewtonDesk p={e("b04", 0, 12)} pages={e("b04", "Isaac Newton", 40)} t={t}/></Zoom>
          <Mono text="About 1 million words on alchemy" f0={at("b04", "Isaac Newton") + 10} y={1440} align="center" color={C.ink} size={30}/>
        </Cam>

        {/* b05 chemistry can't change metals */}
        <Cam a={at("b05")} b={next("b05")}>
          <Head text={"Chemistry\n{can't} change\none metal into\nanother"} f0={at("b05") - 2} y={270} size={104}/>
          <Zoom s={0.95} cx={540} cy={1300} dy={0}><MixPot p={e("b05", 0, 12)} t={t}/></Zoom>
        </Cam>

        {/* b06 Rutherford breaks into the atom */}
        <Cam a={at("b06")} b={next("b06")} from="up">
          <Spec big="1919" small="Ernest Rutherford breaks into the atom" f0={at("b06") - 2} y={290} size={210}/>
          <Zoom s={1.1} cx={560} cy={1150} dy={-40}><AtomHit p={e("b06", 0, 12)} hit={e("b06", "nineteen nineteen", 36)} t={t}/></Zoom>
        </Cam>

        {/* b07 Harvard 1941: a few atoms of radioactive gold */}
        <Cam a={at("b07")} b={next("b07")}>
          <Spec big="1941" small="Harvard: mercury hit with neutrons" f0={at("b07") - 2} y={290} size={210}/>
          <Zoom s={0.95} cx={540} cy={1160} dy={-20}><FewAtoms p={e("b07", 0, 12)} t={t}/></Zoom>
          <Tag text="A few atoms · radioactive" f0={at("b07", "radioactive gold")} x={250} y={1420} size={32} accent/>
        </Cam>

        {/* b08 LHC 2025: specks of gold from lead */}
        <Cam a={at("b08")} b={next("b08")} from="left">
          <Spec big="2025" small="Large Hadron Collider (CERN)" f0={at("b08") - 2} y={290} size={210}/>
          <Zoom s={1.0} cx={540} cy={1160} dy={-30}><LeadSkim p={e("b08", 0, 12)} skim={e("b08", "specks", 50)} t={t}/></Zoom>
          <Mono text="All of it: 29 trillionths of a gram (2015-18 runs)" f0={at("b08", "split second")} y={600} color={C.ink} size={26}/>
        </Cam>

        {/* b09 the secret: every element is a number */}
        <Cam a={at("b09")} b={next("b09")} from="up">
          <Aside text="the secret?" f0={at("b09") - 2} y={270} size={84}/>
          <Head text={"Every element\nis a {number}"} f0={at("b09", "a number")} y={370} size={106}/>
          <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0}}>
            <g opacity={e("b09", 0, 12)}><Nucleus cx={540} cy={1150} r={190} n={40} protons={0.42} t={t}/></g>
          </svg>
          <Mono text="Count the protons in the centre" f0={at("b09", "protons")} y={1450} align="center" color={C.ink} size={30}/>
        </Cam>

        {/* b10 gold 79, mercury 80: neighbours */}
        <Cam a={at("b10")} b={next("b10")}>
          <Head text={"Next-door\n{neighbours}"} f0={at("b10") - 2} y={300} size={130}/>
          <Zoom s={1.0} cx={540} cy={1130} dy={-40}><PeriodicPair p={ease(fr, at("b10"), at("b10", "Mercury is eighty") + 16)} t={t}/></Zoom>
        </Cam>

        {/* b11 fusion neutrons hit mercury */}
        <Cam a={at("b11")} b={next("b11")} from="left">
          <Head text={"Fast neutrons\nhit {mercury}"} f0={at("b11") - 2} y={280} size={104}/>
          <Zoom s={1.0} cx={540} cy={1150} dy={-50}><NeutronHit p={e("b11", 0, 12)} hit={e("b11", "knocks", 30)} t={t}/></Zoom>
          <Mono text="Fusion: squeezing atoms together, like the Sun" f0={at("b11") + 8} y={1420} align="center" size={24}/>
          <Mono text="Neutron: a tiny particle from an atom's centre" f0={at("b11", "neutrons") + 4} y={1462} align="center" size={24}/>
        </Cam>

        {/* b12 80 becomes 79: mercury becomes gold */}
        <Cam a={at("b12")} b={next("b12")} from="up">
          <Head text={"{80} → 79"} f0={at("b12", "Eighty becomes")} y={290} size={190} o={1 - e("b12", "Mercury becomes gold", 10)}/>
          <Head text={"{Gold}."} f0={at("b12", "Mercury becomes gold")} y={290} size={190}/>
          <Mono text="Within days: a proton turns into a neutron" f0={at("b12") + 4} y={520} color={C.ink2}/>
          <Zoom s={1.0} cx={540} cy={1150} dy={-30}><Decay p={e("b12", 0, 12)} change={e("b12", "Mercury becomes gold", 24)} t={t}/></Zoom>
        </Cam>

        {/* b13 the catch: radioactive, a banana, almost 18 years */}
        <Cam a={at("b13")} b={next("b13")} from="left">
          <Aside text="the catch:" f0={at("b13") - 2} y={260} size={84}/>
          <Head text={"Wait almost\n{18 years}"} f0={at("b13", "almost eighteen")} y={360} size={136}/>
          <Zoom s={0.95} cx={540} cy={1250} dy={-110}><GoldBanana p={e("b13", 0, 12)} years={17.7 * ease(fr, at("b13", "almost eighteen"), at("b13", "banana") + 20)} t={t}/></Zoom>
          <Tag text="Less radioactive than a banana" f0={at("b13", "banana")} x={170} y={1420} size={30} accent/>
          <Mono text="Gold made today: passes around 2044" f0={at("b13", "twenty forty four")} y={650} color={C.ink} size={30}/>
        </Cam>

        {/* b14 where it stands: CLAIMED */}
        <Cam a={at("b14")} b={next("b14")} from="up">
          <Head text={"Marathon says:\n{10×} CERN's\nrecord"} f0={at("b14") - 2} y={280} size={100}/>
          <Mono text="The old test: show us the gold" f0={at("b14", "show us the gold")} y={700} color={C.accent} size={34}/>
          <Mono text="How much gold?  Not shown" f0={at("b14", "how much")} y={790} color={C.ink} size={34}/>
          <Mono text="Checked by others?  Not yet" f0={at("b14", "no one else")} y={860} color={C.ink} size={34}/>
          <Stamp text="CLAIMED" p={ease(fr, at("b14", "no one else"), at("b14", "no one else") + 8)} x={230} y={1080}/>
        </Cam>

        {/* b15 scale: one plant vs the mines; no fusion plant sells power yet */}
        <Cam a={at("b15")} b={next("b15")}>
          <Head text={"A few tonnes\na {year}"} f0={at("b15") - 2} y={290} size={112}/>
          <Zoom s={1.0} cx={540} cy={1250} dy={-50}><Piles p={e("b15", 0, 24)} t={t}/></Zoom>
          <Tag text="No fusion plant sells power yet" f0={at("b15", "no fusion plant")} x={64} y={560} size={30} accent/>
        </Cam>

        {/* b16 callback: Newton's furnace vs fusion, then the choice: two identical rings, one mined, one made */}
        <Cam a={at("b16")} b={LABGOLD_FRAMES + 20} push={0.03} from="up">
          <div style={{opacity: 1 - e("b16", "Imagine", 10)}}>
            <div style={{position: "absolute", left: -250, top: 0, width: W, height: H}}><Zoom s={0.55} cx={540} cy={1180} dy={-40}><Furnace p={e("b16", 0, 12)} t={t}/></Zoom></div>
            <FusionRing p={e("b16", "fusion did it", 14)} t={t} cx={790} cy={1110} s={0.8}/>
            <Mono text="Furnace" f0={at("b16") + 6} x={200} y={1345} color={C.ink2}/>
            <Mono text="Fusion" f0={at("b16", "fusion did it") + 6} x={720} y={1345} color={C.ink2}/>
            <Head text={"Then: a furnace\nNow: {fusion}"} f0={at("b16") - 2} y={290} size={104}/>
          </div>
          <div style={{opacity: e("b16", "Imagine", 10)}}>
            <Head text={"Mined or\n{made}?"} f0={at("b16", "Imagine")} y={290} size={150}/>
            <Mono text="Identical, atom for atom" f0={at("b16", "identical atom")} y={620} color={C.ink2} size={30}/>
            <TwoRings p={e("b16", "Imagine", 30)} t={t}/>
            <Mono text="Which would you give? Tell us below" f0={at("b16", "Which would you")} y={1540} align="center" size={28} color={C.ink}/>
          </div>
        </Cam>

        </DeskShrink>
        <DeskClose f0={CLOSE}/>
        <TopBar ep={S.ep} product={S.product} total={LABGOLD_FRAMES} tag="No. "/>
        <Source text={src} o={src && fr < CLOSE ? 1 : 0}/>
      </Safe>

      {VOICED && <Audio src={staticFile("gadget/labgold/vo.wav")}/>}
      <Audio src={staticFile("voxplus/audio/music_06_curious_ambience_reg1n0ld.wav")} volume={(f) => 0.09 * lin(f, 0, 15) * (1 - lin(f, LABGOLD_FRAMES - 40, LABGOLD_FRAMES - 2))}/>
      {SFX.map(([f, n, v], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS * 3}><Audio src={staticFile(`voxplus/audio/${n}`)} volume={v}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
