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
import {Banner} from "./banner/Banner";
import {ChannelIntro, introTotal, IFPS} from "./intro/ChannelIntro";

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
    <Still id="YTBanner" component={Banner} width={2560} height={1440}/>
    <Composition id="ChannelIntro" component={ChannelIntro} durationInFrames={introTotal} fps={IFPS} width={1920} height={1080}/>
  </>
);
