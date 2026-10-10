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
import autoq2 from "../../public/vx/autoq2/data.json";
import autoq2s from "../../public/vx/autoq2s/data.json";
import shyam from "../../public/vx/shyam/data.json";
import shyams from "../../public/vx/shyams/data.json";
import ceos from "../../public/vx/ceos/data.json";
import banksq2 from "../../public/vx/banksq2/data.json";
import jlrs from "../../public/vx/jlrs/data.json";
import fcnr from "../../public/vx/fcnr/data.json";
import fcnrs from "../../public/vx/fcnrs/data.json";
import angelone from "../../public/vx/angelone/data.json";
import angelones from "../../public/vx/angelones/data.json";
import jewels from "../../public/vx/jewels/data.json";
import tcsq2 from "../../public/vx/tcsq2/data.json";
import tcsq2s from "../../public/vx/tcsq2s/data.json";
import persistent from "../../public/vx/persistent/data.json";
import persistents from "../../public/vx/persistents/data.json";

const ALL = [zee, mdr, irdai, pb, anupam, welspun, adani, kpigreen, autoq2, autoq2s, shyam, shyams, ceos, banksq2, jlrs, fcnr, fcnrs, angelone, angelones, jewels, tcsq2, tcsq2s, persistent, persistents] as unknown as VData[];
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
  autoq2: [
    {kicker: "AUTO SALES · Q2 FY27", big: "+40%", bigSub: "TATA MOTORS PV · Q2 GROWTH", stamp: "TATA ON TOP", clip: "aq_t_tata", clipMeta: {"w": 1448, "h": 156, "hl": [[0.6076, 0.3819, 0.0853, 0.2901], [0.8766, 0.3819, 0.0569, 0.2898]]}},
    {kicker: "AUTO SALES · SEPTEMBER 2026", big: "−12%", bigSub: "BAJAJ · TWO-WHEELERS IN INDIA", stamp: "TVS: +17%", clip: "aq_t_bajaj", clipMeta: {"w": 932, "h": 236, "hl": [[0.8621, 0.5702, 0.0571, 0.1388]]}},
    {kicker: "AUTO SALES · Q2 FY27", big: "+0.9%", bigSub: "ESCORTS · LAST ON GROWTH", stamp: "TOP MOAT?", clip: "aq_t_escorts", clipMeta: {"w": 1551, "h": 129, "hl": [[0.6318, 0.3902, 0.0493, 0.3098]]}},
  ],
  fcnr: [
    {kicker: "IDFC FIRST BANK · Q2 FY27", big: "₹24,885 CR", bigSub: "LENT, THEN BOOKED AS DEPOSITS", stamp: "THE LOOP", clip: "fc_idfc"},
    {kicker: "HDFC BANK · FCNR(B)", big: "$11.5 BN", bigSub: "RAISED IN THE RBI WINDOW", stamp: "BORROWED?", clip: "fc_hdfc"},
    {kicker: "AXIS BANK · FCNR(B)", big: "$10.62 BN", bigSub: "~87% MATCHED BY LOANS", stamp: "THE LOOP", clip: "fc_axis"},
  ],
  banksq2: [
    {kicker: "UNION BANK · Q2 FY27", big: "6.87%", bigSub: "DEPOSIT GROWTH · LOANS +18.53%", stamp: "THE GAP", clip: "bk_union"},
    {kicker: "J&K BANK · CASA RATIO", big: "−388 BPS", bigSub: "CHEAP DEPOSITS · ONE YEAR", stamp: "SLIPPING", clip: "bk_jk"},
    {kicker: "UJJIVAN SFB · LOAN BOOK", big: "+32.1%", bigSub: "#1 OF 22 BANKS ON LOAN GROWTH", stamp: "TOO FAST?", clip: "bk_ujjivan"},
  ],
  shyam: [
    {kicker: "SHYAM METALICS · MoU", big: "₹50,000 CR", bigSub: "ONE STEEL PLANT · CHANDRAPUR", stamp: "NON-BINDING", clip: "sm_invest"},
    {kicker: "SHYAM METALICS", big: "₹9,500 CR", bigSub: "ITS OWN 4–5 YEAR CAPEX PLAN", stamp: "WHO PAYS?", clip: "sm_capex"},
    {kicker: "SHYAM METALICS · MoU", big: "9 MTPA", bigSub: "GREENFIELD STEEL · VIDARBHA", stamp: "ON PAPER", clip: "sm_purpose"},
  ],
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
