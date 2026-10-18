// Global channel compositions (Oct 2026). Every chart takes --props={D}; the defaults are TSMC 3Q26 (public/global/tsmc-3q26/).
// The format menu and when to use each one: docs/global-launch/FORMATS.md.
import React from "react";
import {Composition, Series, Still} from "remotion";
import {GFPS, GlobalSankey, sankeyTotal} from "./GlobalSankey";
import {SankeyData} from "./sankey";
import {BRAND, GlobalAvatar, GlobalBanner, GlobalEndCard, GlobalThumb} from "./Brand";
import {GlobalGuide, GlobalMix, GlobalSplit, GlobalWaterfall, GuideData, MixData, SplitData, WaterfallData,
  guideTotal, mixTotal, splitTotal, waterfallTotal} from "./charts";
import tsmc from "../../public/global/tsmc-3q26/sankey.json";
import tsmcW from "../../public/global/tsmc-3q26/waterfall.json";
import tsmcS from "../../public/global/tsmc-3q26/split.json";
import tsmcM from "../../public/global/tsmc-3q26/mix.json";
import tsmcG from "../../public/global/tsmc-3q26/guide.json";

const DEF = tsmc as unknown as SankeyData;
const DW = tsmcW as unknown as WaterfallData, DS = tsmcS as unknown as SplitData, DM = tsmcM as unknown as MixData, DG = tsmcG as unknown as GuideData;

// Every chart template once, back to back, on its default data: the format menu as one video.
const REEL: [React.FC<any>, any, number][] = [
  [GlobalSankey, DEF, sankeyTotal(DEF)], [GlobalWaterfall, DW, waterfallTotal(DW)], [GlobalSplit, DS, splitTotal(DS)],
  [GlobalMix, DM, mixTotal(DM)], [GlobalGuide, DG, guideTotal(DG)]];
const Reel: React.FC = () => (
  <Series>{REEL.map(([C, D, n], i) => <Series.Sequence key={i} durationInFrames={n}><C D={D}/></Series.Sequence>)}</Series>
);

export const GlobalCompositions: React.FC = () => (
  <>
    <Composition id="GLOBAL-sankey" component={GlobalSankey as any} defaultProps={{D: DEF}} fps={GFPS} width={1920} height={1080}
      durationInFrames={sankeyTotal(DEF)} calculateMetadata={({props}: any) => ({durationInFrames: sankeyTotal(props.D)})}/>
    <Composition id="GLOBAL-waterfall" component={GlobalWaterfall as any} defaultProps={{D: DW}} fps={GFPS} width={1920} height={1080}
      durationInFrames={waterfallTotal(DW)} calculateMetadata={({props}: any) => ({durationInFrames: waterfallTotal(props.D)})}/>
    <Composition id="GLOBAL-split" component={GlobalSplit as any} defaultProps={{D: DS}} fps={GFPS} width={1920} height={1080}
      durationInFrames={splitTotal(DS)} calculateMetadata={({props}: any) => ({durationInFrames: splitTotal(props.D)})}/>
    <Composition id="GLOBAL-mix" component={GlobalMix as any} defaultProps={{D: DM}} fps={GFPS} width={1920} height={1080}
      durationInFrames={mixTotal(DM)} calculateMetadata={({props}: any) => ({durationInFrames: mixTotal(props.D)})}/>
    <Composition id="GLOBAL-guide" component={GlobalGuide as any} defaultProps={{D: DG}} fps={GFPS} width={1920} height={1080}
      durationInFrames={guideTotal(DG)} calculateMetadata={({props}: any) => ({durationInFrames: guideTotal(props.D)})}/>
    <Composition id="GLOBAL-reel" component={Reel} fps={GFPS} width={1920} height={1080} durationInFrames={REEL.reduce((a, r) => a + r[2], 0)}/>
    {/* Channel art: pass --props='{"name":"...","tagline":"..."}' once the name is chosen. */}
    <Still id="GLOBAL-banner" component={GlobalBanner as any} defaultProps={BRAND} width={2560} height={1440}/>
    <Still id="GLOBAL-avatar" component={GlobalAvatar} width={800} height={800}/>
    <Still id="GLOBAL-endcard" component={GlobalEndCard as any} defaultProps={BRAND} width={1920} height={1080}/>
    <Still id="GLOBAL-thumb" component={GlobalThumb as any} width={1280} height={720}
      defaultProps={{company: "TSMC", number: "51¢", numberSub: "of every dollar kept", line: "Q3 2026 breakdown",
        split: [{label: "kept", v: 51, kind: "keep"}, {label: "to make it", v: 33, kind: "spend"}, {label: "to run it", v: 8, kind: "spend"}, {label: "tax, net", v: 8, kind: "neutral"}]}}/>
  </>
);
