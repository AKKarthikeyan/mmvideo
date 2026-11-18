// P02 antimatter trap, night look: own entry (like velcroglow), so no shared Root changes.
// Draft: npx remotion render src/gadget/antimattertrap/index.ts GK-antimattertrap out/gadget/antimattertrap/draft.mp4 --scale=0.5 --concurrency=6 --crf=24
// Final: scripts/gadget/gk_render_p02.sh  (after voicing: gk_voice.py, then gk_align.py)
import React from "react";
import {Composition, registerRoot} from "remotion";
import {FPS, H, W} from "../kit";
import {ANTIMATTERTRAP_FRAMES, AntimatterTrapShort} from "./Short";

const Root: React.FC = () => React.createElement(Composition, {id: "GK-antimattertrap", component: AntimatterTrapShort, durationInFrames: ANTIMATTERTRAP_FRAMES, fps: FPS, width: W, height: H});
registerRoot(Root);
