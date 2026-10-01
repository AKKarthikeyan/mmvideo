// Registry: "The Letter" series in the Vox template (AK 30 Sep 2026: "Use VOX template for all").
// Data from scripts/build_vx_letters.py (scripts/vx_letters.py). Kept apart from Videos.tsx (daily filings videos).
import React from "react";
import {Composition, Still} from "remotion";
import {CodeSceneStills} from "./scenes/CodeScenes";
import {FPS, VData, VoxLong, VoxShort, VoxThumbG, longLayout, shortLayout} from "./VoxEngine";
import l47 from "../../public/vx/l47-destination/data.json";
import l48 from "../../public/vx/l48-nomad-letters/data.json";
import l49 from "../../public/vx/l49-refused-to-sell/data.json";
import l50 from "../../public/vx/l50-look-expensive/data.json";
import mf001 from "../../public/vx/mf001-geico/data.json";
import mf002 from "../../public/vx/mf002-sees/data.json";
import mf003 from "../../public/vx/mf003-textile/data.json";
import mf004 from "../../public/vx/mf004-amex/data.json";
import * as CE from "./CaseEngine";
import {CaseThumbStills, PhotoThumbStills} from "./scenes/CaseThumbs";

const ALL = [l47, l48, l49, l50] as unknown as VData[];

// YouTube Guide thumbnails: 3 variants per video for Test & Compare (dark ground, real document, badge, <=3 words)
const THUMBG: Record<string, {words: string; badge: string; badgeSub: string; clip: string}[]> = {
  "l47-destination": [
    {words: "Where it ends", badge: "$1→$16", badgeSub: "18 YEARS|OR 22?", clip: "n47_1622"},
    {words: "Sold too early", badge: "£2.50", badgeSub: "SOLD AT|90p", clip: "n47_stage"},
    {words: "Same destination", badge: "+80%", badgeSub: "ORDER|DOESN'T MATTER", clip: "n47_order"},
  ],
  "l48-nomad-letters": [
    {words: "No fees", badge: "0", badgeSub: "NO PERFORMANCE|NO FEES", clip: "n48_nofees"},
    {words: "Won't sell you", badge: "1%", badgeSub: "FEE CAP|OUT OF POCKET", clip: "n48_hawaii"},
    {words: "The renters", badge: "51", badgeSub: "DAYS|AVERAGE HOLD", clip: "n48_renters"},
  ],
  "l49-refused-to-sell": [
    {words: "Didn't sell", badge: "2×", badgeSub: "AMAZON|DOUBLED", clip: "n49_highfive"},
    {words: "Invisible mistake", badge: "₹800", badgeSub: "MISSED|NOT RECORDED", clip: "n49_unrecorded"},
    {words: "Start at 100%", badge: "1/6", badgeSub: "OF THE FUND|IN AMAZON", clip: "n49_hundred"},
  ],
  "l50-look-expensive": [
    {words: "Still cheap?", badge: "1,500×", badgeSub: "EARNINGS|WAL-MART 1972", clip: "n50_150"},
    {words: "Cheap for decades", badge: "10%", badgeSub: "A YEAR|FOR DECADES", clip: "n50_chart"},
    {words: "No value?", badge: "$26", badgeSub: "AMAZON|2006", clip: "n50_novalue"},
  ],
};

const CASES = [mf001, mf002, mf003, mf004] as unknown as VData[];
const CASE_THUMBG: Record<string, {words: string; badge: string; badgeSub: string; clip: string}[]> = {
  "mf001-geico": [
    {words: "Died twice?", badge: "−95%", badgeSub: "GEICO STOCK|1970s", clip: "g04_reserve"},
    {words: "The Saturday knock", badge: "1951", badgeSub: "A LOCKED|DOOR", clip: "g95_door"},
    {words: "Inside job", badge: "4%→1.8%", badgeSub: "MARKET|SHARE", clip: "g04_reserve"},
  ],
};
const CaseCompositions: React.FC = () => (
  <>
    {CASES.map((D) => (
      <React.Fragment key={D.id}>
        <Composition id={`VX-${D.id}-long`} component={CE.VoxLong as any} defaultProps={{D}} durationInFrames={CE.longLayout(D).total} fps={FPS} width={1920} height={1080}/>
        {D.shorts.map((_, i) => (
          <Composition key={i} id={`VX-${D.id}-short${i + 1}`} component={CE.VoxShort as any} defaultProps={{D, idx: i}} durationInFrames={CE.shortLayout(D, i).total} fps={FPS} width={1080} height={1920}/>
        ))}
        {(CASE_THUMBG[D.id] || []).map((t, i) => <Still key={`g${i}`} id={`VX-${D.id}-thumbG${i + 1}`} component={CE.VoxThumbG as any} defaultProps={{D, ...t}} width={1280} height={720}/>)}
      </React.Fragment>
    ))}
  </>
);

export const LetterVxCompositions: React.FC = () => (
  <>
    <CodeSceneStills/>
    <CaseCompositions/>
    <CaseThumbStills/>
    <PhotoThumbStills/>
    {ALL.map((D) => (
      <React.Fragment key={D.id}>
        <Composition id={`VX-${D.id}-long`} component={VoxLong as any} defaultProps={{D}} durationInFrames={longLayout(D).total} fps={FPS} width={1920} height={1080}/>
        {D.shorts.map((_, i) => (
          <Composition key={i} id={`VX-${D.id}-short${i + 1}`} component={VoxShort as any} defaultProps={{D, idx: i}} durationInFrames={shortLayout(D, i).total} fps={FPS} width={1080} height={1920}/>
        ))}
        {(THUMBG[D.id] || []).map((t, i) => <Still key={`g${i}`} id={`VX-${D.id}-thumbG${i + 1}`} component={VoxThumbG as any} defaultProps={{D, ...t}} width={1280} height={720}/>)}
      </React.Fragment>
    ))}
  </>
);
