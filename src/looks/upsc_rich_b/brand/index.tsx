// The UPSC Mains channel art in look B. Compositions: LOGO-1, LOGO-2, LOGO-3 (800 x 800), BANNER (2560 x 1440).
// Render: scripts in out/upsc/brand (see npx remotion still src/looks/upsc_rich_b/brand/index.tsx LOGO-1 out/upsc/brand/logo1.png).
import React from "react";
import {Composition, registerRoot} from "remotion";
import {Logo1, Logo2, Logo3} from "./logos";
import {Banner, BW, BH} from "./Banner";

const Root: React.FC = () => (
  <>
    <Composition id="LOGO-1" component={Logo1} durationInFrames={1} fps={30} width={800} height={800}/>
    <Composition id="LOGO-2" component={Logo2} durationInFrames={1} fps={30} width={800} height={800}/>
    <Composition id="LOGO-3" component={Logo3} durationInFrames={1} fps={30} width={800} height={800}/>
    <Composition id="BANNER" component={Banner} durationInFrames={1} fps={30} width={BW} height={BH}/>
  </>
);
registerRoot(Root);
