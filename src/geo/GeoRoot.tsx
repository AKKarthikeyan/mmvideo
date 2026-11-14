import React from "react";
import {Composition, Still} from "remotion";
import {Thumb, Poster} from "./week2/art";
import {Siliguri, layout, FPS, W, H, GeoData} from "./Siliguri";
import siliguri from "../../public/geo/siliguri/data.json";
import {GeoShort, layout as glayout, GeoData as GD} from "./engine/GeoShort";
import {SPECS} from "./week1/specs";
import chenab from "../../public/geo/chenab/data.json";
import indiatime from "../../public/geo/indiatime/data.json";
import brahmaputra from "../../public/geo/brahmaputra/data.json";
import princely from "../../public/geo/princely/data.json";
import andaman from "../../public/geo/andaman/data.json";
import himalaya from "../../public/geo/himalaya/data.json";
import malacca from "../../public/geo/malacca/data.json";
import chinatime from "../../public/geo/chinatime/data.json";
import languages from "../../public/geo/languages/data.json";
import enclaves from "../../public/geo/enclaves/data.json";
import monsoon from "../../public/geo/monsoon/data.json";
import hyderabad from "../../public/geo/hyderabad/data.json";
import islamabad from "../../public/geo/islamabad/data.json";

import {SPECS2} from "./week2/specs";
import {SPECS3} from "./week3/specs";
import w3_up from "../../public/geo/w3up/data.json";
import w3_ww1 from "../../public/geo/w3ww1/data.json";
import w3_rajasthan from "../../public/geo/w3rajasthan/data.json";
import w3_baarle from "../../public/geo/w3baarle/data.json";
import w3_myson from "../../public/geo/w3myson/data.json";
import w3_kumbh from "../../public/geo/w3kumbh/data.json";
import w3_konkan from "../../public/geo/w3konkan/data.json";
import w3_kochi from "../../public/geo/w3kochi/data.json";
import w3_mumbai from "../../public/geo/w3mumbai/data.json";
import w3_kerala from "../../public/geo/w3kerala/data.json";
import w3_colachel from "../../public/geo/w3colachel/data.json";
import w3_thar from "../../public/geo/w3thar/data.json";
import w3_states from "../../public/geo/w3states/data.json";
import w3_shapes from "../../public/geo/w3shapes/data.json";
import {SPECSC} from "./cyclone/specs";
import {SPECSL} from "./lac/specs";
import l_galwan from "../../public/geo/cy03lac/data.json";
import c_odisha from "../../public/geo/cy01odisha/data.json";
import c_bay from "../../public/geo/cy02bay/data.json";
import w2_minicoy from "../../public/geo/minicoy/data.json";
import w2_austria from "../../public/geo/austria/data.json";
import w2_kuttanad from "../../public/geo/kuttanad/data.json";
import w2_sikhpolice from "../../public/geo/sikhpolice/data.json";
import w2_seazone from "../../public/geo/seazone/data.json";
import w2_nainsingh from "../../public/geo/nainsingh/data.json";
import w2_thumba from "../../public/geo/thumba/data.json";
import w2_zanzibar from "../../public/geo/zanzibar/data.json";
import w2_barmer from "../../public/geo/barmer/data.json";
import w2_berenike from "../../public/geo/berenike/data.json";
import w2_panipat from "../../public/geo/panipat/data.json";
import w2_bhitarkanika from "../../public/geo/bhitarkanika/data.json";
import w2_thibaw from "../../public/geo/thibaw/data.json";
import w2_narcondam from "../../public/geo/narcondam/data.json";

const WEEK2: Record<string, unknown> = {minicoy: w2_minicoy, austria: w2_austria, kuttanad: w2_kuttanad, sikhpolice: w2_sikhpolice, seazone: w2_seazone, nainsingh: w2_nainsingh, thumba: w2_thumba, zanzibar: w2_zanzibar, barmer: w2_barmer, berenike: w2_berenike, panipat: w2_panipat, bhitarkanika: w2_bhitarkanika, thibaw: w2_thibaw, narcondam: w2_narcondam};
const WEEK3: Record<string, unknown> = {w3up: w3_up, w3ww1: w3_ww1, w3rajasthan: w3_rajasthan, w3baarle: w3_baarle, w3myson: w3_myson, w3kumbh: w3_kumbh, w3konkan: w3_konkan, w3kochi: w3_kochi, w3mumbai: w3_mumbai, w3kerala: w3_kerala, w3colachel: w3_colachel, w3thar: w3_thar, w3states: w3_states, w3shapes: w3_shapes};   // Week 3 (8-9 Nov 2026)
const CYCLONE: Record<string, unknown> = {cy01odisha: c_odisha, cy02bay: c_bay, "cy02bay-a": c_bay};
const LAC: Record<string, unknown> = {cy03lac: l_galwan};
const ART_IDS = ["cy01odisha", "cy02bay"];   // cyclone Shorts with thumbnail art
const WEEK1: Record<string, unknown> = {chenab, indiatime, brahmaputra, princely, andaman, himalaya, malacca, chinatime, languages, enclaves, monsoon, hyderabad, islamabad};

export const GeoRoot: React.FC = () => (
  <>
    <Composition id="GEO-siliguri" component={Siliguri as any} defaultProps={{D: siliguri as GeoData}}
      durationInFrames={layout(siliguri as GeoData).total} fps={FPS} width={W} height={H}/>
    {Object.entries(WEEK1).map(([id, d]) => (
      <Composition key={id} id={`GEO-${id}`} component={GeoShort as any} defaultProps={{D: d as GD, S: SPECS[id]}}
        durationInFrames={glayout(d as GD).total} fps={FPS} width={W} height={H}/>
    ))}
    {Object.entries(WEEK2).map(([id, d]) => (
      <Composition key={id} id={`GEO-${id}`} component={GeoShort as any} defaultProps={{D: d as GD, S: SPECS2[id]}}
        durationInFrames={glayout(d as GD).total} fps={FPS} width={W} height={H}/>
    ))}
    {Object.entries(WEEK3).map(([id, d]) => (
      <Composition key={id} id={`GEO-${id}`} component={GeoShort as any} defaultProps={{D: d as GD, S: SPECS3[id]}}
        durationInFrames={glayout(d as GD).total} fps={FPS} width={W} height={H}/>
    ))}
    {Object.entries(CYCLONE).map(([id, d]) => (
      <Composition key={id} id={`GEO-${id}`} component={GeoShort as any} defaultProps={{D: d as GD, S: SPECSC[id]}}
        durationInFrames={glayout(d as GD).total} fps={FPS} width={W} height={H}/>
    ))}
    {Object.entries(LAC).map(([id, d]) => (
      <Composition key={id} id={`GEO-${id}`} component={GeoShort as any} defaultProps={{D: d as GD, S: SPECSL[id]}}
        durationInFrames={glayout(d as GD).total} fps={FPS} width={W} height={H}/>
    ))}
    {Object.keys(CYCLONE).filter((id) => ART_IDS.includes(id)).map((id) => <Still key={"ct" + id} id={`THUMB-${id}`} component={Thumb as any} defaultProps={{id}} width={1080} height={1920}/>)}
    {Object.keys(WEEK2).map((id) => <Still key={"t" + id} id={`THUMB-${id}`} component={Thumb as any} defaultProps={{id}} width={1080} height={1920}/>)}
    {Object.keys(WEEK2).map((id) => <Still key={"p" + id} id={`POSTER-${id}`} component={Poster as any} defaultProps={{id}} width={1080} height={1080}/>)}
  </>
);
