// P03 headphone jack, night look: own entry (like antimattertrap and velcroglow), so no shared Root changes.
// Draft: npx remotion render src/gadget/headphonejack/index.ts GK-headphonejack out/gadget/headphonejack/draft.mp4 --scale=0.5 --concurrency=6 --crf=24
// Final: scripts/gadget/gk_night.sh headphonejack   (after the script is approved: voices in the 06:45-22:10 IST window, aligns, renders)
import React from "react";
import {Composition, registerRoot} from "remotion";
import {FPS, H, W} from "../kit";
import {HEADPHONEJACK_FRAMES, HeadphoneJackShort} from "./Short";

const Root: React.FC = () => React.createElement(Composition, {id: "GK-headphonejack", component: HeadphoneJackShort, durationInFrames: HEADPHONEJACK_FRAMES, fps: FPS, width: W, height: H});
registerRoot(Root);
