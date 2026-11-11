import React from "react";
import {Composition, Still} from "remotion";
import {SomPilot, totalFrames, FPS} from "./SomPilot";
import {TemplateStills} from "./Templates";
import {StyleStills} from "./Styles";
import {HandSample, hTotal, HFPS} from "./HandSample";
import {VoxNuvama, vTotal, VFPS} from "./VoxNuvama";
import {SomLong, lTotal, LFPS} from "./SomLong";
import {SomVertical, SomThumb, vcTotal} from "./SomVertical";
import {VxCompositions} from "./vx/Videos";
import {LetterCompositions} from "./letters/LetterShorts";
import {StyleTestCompositions} from "./letters/StyleTests";
import {SleepLongCompositions} from "./letters/SleepLong";
import {LetterVxCompositions} from "./vx/LetterVideos";
import {ExplainerCompositions} from "./explainer/MoatExplainer";
import {MoatVerticalComposition} from "./explainer/MoatVertical";
import {CarouselCompositions} from "./carousel/Carousels";
import {NapkinCompositions} from "./napkin/NapkinVideos";
import {Banner} from "./banner/Banner";
import {ChannelIntro, introTotal, IFPS} from "./intro/ChannelIntro";
import {ShyamNapkin, nTotal} from "./hand/ShyamNapkin";
import {HalNapkin, halTotal} from "./hand/HalNapkin";
import {VogNapkin, vogTotal} from "./hand/VogNapkin";
import {BankNapkin, BK} from "./hand/BankNapkins";
import {BankNapkin2, BK2} from "./hand/BankNapkins2";
import {HAND_FPS, handTotal} from "./handkit";
import {NapkinIntro, napIntroTotal, NIFPS} from "./hand/IntroNapkin";
import {IllusDev, IllusIcon} from "./vx/illus/Dev";
import {IllusThumb} from "./vx/illus/Thumb";

// Napkin Shorts on the two bank templates (bka-bkc: BankNapkins.tsx; the rest: BankNapkins2.tsx). To add one: a row here,
// its drawing in BankNapkins2.tsx and its lines in scripts/hand.py.
const NAPKIN_SHORTS: [string, string][] = [
  ["bka", "Bank of Baroda · Q2"], ["bkb", "Bandhan Bank · Q2"], ["bkc", "Ujjivan SFB · Q2"], ["bkd", "Bank of Baroda · Q2"],
  ["bke", "Union Bank · Q2"], ["bkf", "Bank of India · Q2"], ["bkg", "CSB + Dhanlaxmi · Q2"], ["bkh", "ESAF SFB · Q2"],
  ["bki", "Equitas SFB · Q2"], ["bkj", "J&K Bank · Q2"], ["bkk", "AU SFB · Q2"], ["bkl", "Tamilnad Mercantile · Q2"],
  ["bkm", "Canara + PNB · Q2"], ["bkn", "Karnataka Bank · Q2"], ["bko", "22 banks · Q2"], ["bkp", "Suryoday SFB · Q2"],
  ["bkq", "Angel One · commodity"], ["bkr", "Angel One · commodity"], ["bks", "Jewellers vs gold"], ["bkt", "TCS Q2"],
  ["bku", "Persistent · Nagarro"], ["bkv", "DMart Q2"], ["bkw", "ICICI Pru AMC"], ["bkx", "Den · GTPL"],
  ["bky", "ICICI Lombard"],
];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SomPilot" component={SomPilot} durationInFrames={totalFrames} fps={FPS} width={1080} height={1920}/>
    <TemplateStills/>
    <StyleStills/>
    <Composition id="VoxNuvama" component={VoxNuvama} durationInFrames={vTotal} fps={VFPS} width={1080} height={1920}/>
    <Composition id="HandSample" component={HandSample} durationInFrames={hTotal} fps={HFPS} width={1080} height={1920}/>
    <Composition id="SomLong" component={SomLong} durationInFrames={lTotal} fps={LFPS} width={1920} height={1080}/>
    <Composition id="SomVertical" component={SomVertical} durationInFrames={vcTotal} fps={LFPS} width={1080} height={1920}/>
    <Still id="SomThumb" component={SomThumb} width={1280} height={720}/>
    <VxCompositions/>
    <LetterCompositions/>
    <StyleTestCompositions/>
    <SleepLongCompositions/>
    <LetterVxCompositions/>
    <ExplainerCompositions/>
    <MoatVerticalComposition/>
    <CarouselCompositions/>
    <NapkinCompositions/>
    <Still id="YTBanner" component={Banner} width={2560} height={1440}/>
    <Composition id="HAND-shyam" component={ShyamNapkin} durationInFrames={nTotal} fps={HAND_FPS} width={1080} height={1920}/>
    <Composition id="HAND-hal" component={HalNapkin} durationInFrames={halTotal} fps={HAND_FPS} width={1080} height={1920}/>
    <Composition id="HAND-vog" component={VogNapkin} durationInFrames={vogTotal} fps={HAND_FPS} width={1080} height={1920}/>
    {NAPKIN_SHORTS.map(([sid, label]) => {
      const first = sid in BK;
      return <Composition key={sid} id={`HAND-${sid}`} component={(first ? BankNapkin : BankNapkin2) as any} defaultProps={{sid, label}}
        durationInFrames={handTotal(first ? BK[sid as keyof typeof BK] : BK2[sid])} fps={HAND_FPS} width={1080} height={1920}/>;
    })}
    <Composition id="HAND-intro" component={NapkinIntro} durationInFrames={napIntroTotal} fps={NIFPS} width={1920} height={1080}/>
    <Composition id="ILLUS-dev" component={IllusDev as any} defaultProps={{scene: {type: "kitdemo"}, say: "", sec: 8}} durationInFrames={1800} fps={30} width={1920} height={1080}/>
    <Composition id="ILLUS-icon" component={IllusIcon as any} defaultProps={{name: "store"}} durationInFrames={1} fps={30} width={512} height={512}/>
    <Composition id="ILLUS-thumb" component={IllusThumb as any} defaultProps={{v: 1}} durationInFrames={1} fps={30} width={1280} height={720}/>
    <Composition id="ChannelIntro" component={ChannelIntro} durationInFrames={introTotal} fps={IFPS} width={1920} height={1080}/>
  </>
);
