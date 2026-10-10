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
import {ShyamNapkin, nTotal, NFPS} from "./hand/ShyamNapkin";
import {HalNapkin, halTotal, HFPS2} from "./hand/HalNapkin";
import {VogNapkin, vogTotal, VFPS} from "./hand/VogNapkin";
import {BankNapkin, bkTotal, BK, BFPS} from "./hand/BankNapkins";
import {BankNapkin2, bkTotal2, BK2, BFPS2} from "./hand/BankNapkins2";

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
    <Composition id="HAND-shyam" component={ShyamNapkin} durationInFrames={nTotal} fps={NFPS} width={1080} height={1920}/>
    <Composition id="HAND-hal" component={HalNapkin} durationInFrames={halTotal} fps={HFPS2} width={1080} height={1920}/>
    <Composition id="HAND-vog" component={VogNapkin} durationInFrames={vogTotal} fps={VFPS} width={1080} height={1920}/>
    <Composition id="HAND-bka" component={BankNapkin as any} defaultProps={{sid: "bka", label: "Bank of Baroda · Q2"}} durationInFrames={bkTotal(BK.bka)} fps={BFPS} width={1080} height={1920}/>
    <Composition id="HAND-bkb" component={BankNapkin as any} defaultProps={{sid: "bkb", label: "Bandhan Bank · Q2"}} durationInFrames={bkTotal(BK.bkb)} fps={BFPS} width={1080} height={1920}/>
    <Composition id="HAND-bkc" component={BankNapkin as any} defaultProps={{sid: "bkc", label: "Ujjivan SFB · Q2"}} durationInFrames={bkTotal(BK.bkc)} fps={BFPS} width={1080} height={1920}/>
    <Composition id="HAND-bkd" component={BankNapkin2 as any} defaultProps={{sid: "bkd", label: "Bank of Baroda · Q2"}} durationInFrames={bkTotal2(BK2.bkd)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bke" component={BankNapkin2 as any} defaultProps={{sid: "bke", label: "Union Bank · Q2"}} durationInFrames={bkTotal2(BK2.bke)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkf" component={BankNapkin2 as any} defaultProps={{sid: "bkf", label: "Bank of India · Q2"}} durationInFrames={bkTotal2(BK2.bkf)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkg" component={BankNapkin2 as any} defaultProps={{sid: "bkg", label: "CSB + Dhanlaxmi · Q2"}} durationInFrames={bkTotal2(BK2.bkg)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkh" component={BankNapkin2 as any} defaultProps={{sid: "bkh", label: "ESAF SFB · Q2"}} durationInFrames={bkTotal2(BK2.bkh)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bki" component={BankNapkin2 as any} defaultProps={{sid: "bki", label: "Equitas SFB · Q2"}} durationInFrames={bkTotal2(BK2.bki)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkj" component={BankNapkin2 as any} defaultProps={{sid: "bkj", label: "J&K Bank · Q2"}} durationInFrames={bkTotal2(BK2.bkj)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkk" component={BankNapkin2 as any} defaultProps={{sid: "bkk", label: "AU SFB · Q2"}} durationInFrames={bkTotal2(BK2.bkk)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkl" component={BankNapkin2 as any} defaultProps={{sid: "bkl", label: "Tamilnad Mercantile · Q2"}} durationInFrames={bkTotal2(BK2.bkl)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkm" component={BankNapkin2 as any} defaultProps={{sid: "bkm", label: "Canara + PNB · Q2"}} durationInFrames={bkTotal2(BK2.bkm)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkn" component={BankNapkin2 as any} defaultProps={{sid: "bkn", label: "Karnataka Bank · Q2"}} durationInFrames={bkTotal2(BK2.bkn)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bko" component={BankNapkin2 as any} defaultProps={{sid: "bko", label: "22 banks · Q2"}} durationInFrames={bkTotal2(BK2.bko)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkp" component={BankNapkin2 as any} defaultProps={{sid: "bkp", label: "Suryoday SFB · Q2"}} durationInFrames={bkTotal2(BK2.bkp)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkq" component={BankNapkin2 as any} defaultProps={{sid: "bkq", label: "Angel One · commodity"}} durationInFrames={bkTotal2(BK2.bkq)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkr" component={BankNapkin2 as any} defaultProps={{sid: "bkr", label: "Angel One · commodity"}} durationInFrames={bkTotal2(BK2.bkr)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bks" component={BankNapkin2 as any} defaultProps={{sid: "bks", label: "Jewellers vs gold"}} durationInFrames={bkTotal2(BK2.bks)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bkt" component={BankNapkin2 as any} defaultProps={{sid: "bkt", label: "TCS Q2"}} durationInFrames={bkTotal2(BK2.bkt)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="HAND-bku" component={BankNapkin2 as any} defaultProps={{sid: "bku", label: "Persistent · Nagarro"}} durationInFrames={bkTotal2(BK2.bku)} fps={BFPS2} width={1080} height={1920}/>
    <Composition id="ChannelIntro" component={ChannelIntro} durationInFrames={introTotal} fps={IFPS} width={1920} height={1080}/>
  </>
);
