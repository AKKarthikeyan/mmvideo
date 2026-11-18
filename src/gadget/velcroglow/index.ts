// Desk Glow style pilot: own entry, so no shared Root changes.
// Render: npx remotion render src/gadget/velcroglow/index.ts GK-velcroglow out/gadget/velcroglow/GK-velcroglow.raw.mp4
import React from "react";
import {Composition, registerRoot} from "remotion";
import {FPS, H, W} from "../kit";
import {VELCRO_FRAMES, VelcroGlowShort} from "./Short";

const Root: React.FC = () => React.createElement(Composition, {id: "GK-velcroglow", component: VelcroGlowShort, durationInFrames: VELCRO_FRAMES, fps: FPS, width: W, height: H});
registerRoot(Root);
