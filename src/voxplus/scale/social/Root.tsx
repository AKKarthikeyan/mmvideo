// Separate entry for the social stills of "Jio's Size Advantage Has a Catch" (does not touch the film's Root).
// Render: npx remotion still src/voxplus/scale/social/index.ts SOC-S1 out/voxplus/scale/publish/carousel/slide_01.png  (SOC-S1 .. SOC-S10)
//         npx remotion still src/voxplus/scale/social/index.ts SOC-X out/voxplus/scale/publish/x_post_jio_five_moats.png
import React from "react";
import {Still} from "remotion";
import {S1, S2, S3, S4, S5, S6, S7, S8, S9, S10} from "./Carousel";
import {XImage} from "./XImage";
import {CH, CW} from "./common";

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
export const SocialRoot: React.FC = () => (
  <>
    {SLIDES.map((S, i) => <Still key={i} id={`SOC-S${i + 1}`} component={S} width={CW} height={CH}/>)}
    <Still id="SOC-X" component={XImage} width={1600} height={900}/>
  </>
);
