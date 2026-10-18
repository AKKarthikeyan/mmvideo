// Global channel compositions (Oct 2026). GLOBAL-sankey takes --props={D} (a SankeyData); the default is TSMC 3Q26.
import React from "react";
import {Composition, Still} from "remotion";
import {GFPS, GlobalSankey, sankeyTotal} from "./GlobalSankey";
import {SankeyData} from "./sankey";
import {BRAND, GlobalAvatar, GlobalBanner, GlobalEndCard, GlobalThumb} from "./Brand";
import tsmc from "../../public/global/tsmc-3q26/sankey.json";

const DEF = tsmc as unknown as SankeyData;

export const GlobalCompositions: React.FC = () => (
  <>
    <Composition id="GLOBAL-sankey" component={GlobalSankey as any} defaultProps={{D: DEF}} fps={GFPS} width={1920} height={1080}
      durationInFrames={sankeyTotal(DEF)} calculateMetadata={({props}: any) => ({durationInFrames: sankeyTotal(props.D)})}/>
    {/* Channel art: pass --props='{"name":"...","tagline":"..."}' once the name is chosen. */}
    <Still id="GLOBAL-banner" component={GlobalBanner as any} defaultProps={BRAND} width={2560} height={1440}/>
    <Still id="GLOBAL-avatar" component={GlobalAvatar} width={800} height={800}/>
    <Still id="GLOBAL-endcard" component={GlobalEndCard as any} defaultProps={BRAND} width={1920} height={1080}/>
    <Still id="GLOBAL-thumb" component={GlobalThumb as any} width={1280} height={720}
      defaultProps={{company: "TSMC", number: "51¢", numberSub: "of every dollar kept", line: "Q3 2026 breakdown",
        split: [{label: "kept", v: 51, kind: "keep"}, {label: "to make it", v: 34, kind: "spend"}, {label: "to run it", v: 8, kind: "spend"}, {label: "tax, net", v: 7, kind: "amber"}]}}/>
  </>
);
