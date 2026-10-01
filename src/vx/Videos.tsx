// Registry: the four long-form Vox videos of 28 Sep 2026, their shorts and thumbnails.
import React from "react";
import {Composition, Still} from "remotion";
import {FPS, VData, VoxLong, VoxShort, VoxThumb, VoxThumbG, VoxThumbV, longLayout, shortLayout} from "./VoxEngine";
import zee from "../../public/vx/zee/data.json";
import mdr from "../../public/vx/mdr/data.json";
import irdai from "../../public/vx/irdai/data.json";
import pb from "../../public/vx/pb/data.json";
import anupam from "../../public/vx/anupam/data.json";
import welspun from "../../public/vx/welspun/data.json";
import adani from "../../public/vx/adani/data.json";
import kpigreen from "../../public/vx/kpigreen/data.json";

const ALL = [zee, mdr, irdai, pb, anupam, welspun, adani, kpigreen] as unknown as VData[];
const THUMB: Record<string, {lines: [string, string]; stamp: string; clip?: string}> = {
  zee: {lines: ["ZEE LEARN", "THE GUARANTEE COMES DUE"], stamp: "₹818 CR DEMANDED", clip: "zl_petition"},
  mdr: {lines: ["UPI GETS A PRICE", "0.4% ABOVE ₹2,000"], stamp: "MARGIN ≠ MOAT", clip: "npci_example"},
  irdai: {lines: ["IRDAI'S RESET", "WHO KEEPS THE MOAT?"], stamp: "COMMISSION CAPS", clip: "irdai_unwound"},
  pb: {lines: ["POLICYBAZAAR", "AFTER THE CAP"], stamp: "GI REVENUE: ⅓ TO 40%", clip: "pb_third"},
  anupam: {lines: ["ANUPAM BUYS BLISS", "THE ₹1 OPTION"], stamp: "48.2% FOR ₹299 A SHARE", clip: "anu_option"},
  adani: {lines: ["ADANI SEBI CASE", "SETTLED FOR ₹37 LAKH"], stamp: "CLEAN CHIT?", clip: "ada_noadmit"},
  kpigreen: {lines: ["KPI GREEN BUYS WIND", "₹2,410 CR IN CASH"], stamp: "WHO PAYS?", clip: "kpi_ev"},
  welspun: {lines: ["WELSPUN'S ORDER BOOK", "MOVED TO ARKANSAS"], stamp: "₹25,350 CR → ₹45,000 CR", clip: "wel_protect"},
};

// YouTube Guide thumbnails (3 variants per long video for Test & Compare)
const THUMBG: Record<string, {words: string; badge: string; badgeSub: string; clip: string}[]> = {
  adani: [
    {words: "Clean chit?", badge: "₹37L", badgeSub: "PER COMPANY|SEBI ORDER", clip: "ada_noadmit"},
    {words: "6-year case", badge: "₹1.48 CR", badgeSub: "4 ADANI COS|SETTLED", clip: "ada_mps"},
    {words: "Not covered", badge: "18", badgeSub: "APPLICANTS|ONLY", clip: "ada_various"},
  ],
  kpigreen: [
    {words: "All in cash", badge: "₹2,410 CR", badgeSub: "ENTERPRISE|VALUE", clip: "kpi_ev"},
    {words: "Out-earns KPI?", badge: "₹277 CR", badgeSub: "TARGETS' FY25|TURNOVER", clip: "kpi_seci"},
    {words: "Debt not stated", badge: "3:1", badgeSub: "CFO'S COMFORT|LEVERAGE", clip: "kpi_debt"},
  ],
};

// Vox-format thumbnails (same look as the video). clipMeta is inlined for clips not used by any beat (data.json is rebuilt).
const THUMBV: Record<string, any[]> = {
  kpigreen: [
    {kicker: "KPI GREEN ENERGY", big: "₹2,410 CR", bigSub: "ENTERPRISE VALUE · ALL CASH", stamp: "FUNDED HOW?", clip: "kpi_ev"},
    {kicker: "KPI GREEN ENERGY", big: "₹277 CR", bigSub: "THE TWO WIND FARMS · FY25", stamp: "OUT-EARNS KPI?", clip: "kpi_turn", clipMeta: {"w": 1148, "h": 399, "hl": [[0.6718, 0.2942, 0.1008, 0.1168], [0.6718, 0.8003, 0.1008, 0.1168]]}},
    {kicker: "KPI GREEN ENERGY", big: "3:1", bigSub: "CFO'S LEVERAGE COMFORT", stamp: "DEBT NOT STATED", clip: "kpi_debt"},
  ],
};

export const VxCompositions: React.FC = () => (
  <>
    {ALL.map((D) => (
      <React.Fragment key={D.id}>
        <Composition id={`VX-${D.id}-long`} component={VoxLong as any} defaultProps={{D}} durationInFrames={longLayout(D).total} fps={FPS} width={1920} height={1080}/>
        {D.shorts.map((_, i) => (
          <Composition key={i} id={`VX-${D.id}-short${i + 1}`} component={VoxShort as any} defaultProps={{D, idx: i}} durationInFrames={shortLayout(D, i).total} fps={FPS} width={1080} height={1920}/>
        ))}
        {(THUMBG[D.id] || []).map((t, i) => <Still key={`g${i}`} id={`VX-${D.id}-thumbG${i + 1}`} component={VoxThumbG as any} defaultProps={{D, ...t}} width={1280} height={720}/>)}
        {(THUMBV[D.id] || []).map((t, i) => <Still key={`v${i}`} id={`VX-${D.id}-thumbV${i + 1}`} component={VoxThumbV as any} defaultProps={{D, ...t}} width={1280} height={720}/>)}
        <Still id={`VX-${D.id}-thumb`} component={VoxThumb as any} defaultProps={{D, ...THUMB[D.id]}} width={1280} height={720}/>
      </React.Fragment>
    ))}
  </>
);
