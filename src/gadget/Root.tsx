// The Inventor's Desk (everyday science Shorts; folders keep the old 'gadget' name): separate entry from src/Root.tsx, so no shared file changes.
// Render: scripts/gadget/gk_render.sh mivione
import React from "react";
import {Composition} from "remotion";
import {FPS, H, W} from "./kit";
import {MIVI_FRAMES, MiviShort} from "./mivione/Short";
import {RADIO_FRAMES, RadioShort} from "./radio/Short";
import {FRIDGE_FRAMES, FridgeShort} from "./fridge/Short";
import {LABGOLD_FRAMES, LabGoldShort} from "./labgold/Short";
import {NUCLEARCLOCK_FRAMES, NuclearClockShort} from "./nuclearclock/Short";
import {MICROWAVE_FRAMES, MicrowaveShort} from "./microwave/Short";
export const GadgetRoot: React.FC = () => (
  <>
    <Composition id="GK-microwave" component={MicrowaveShort} durationInFrames={MICROWAVE_FRAMES} fps={FPS} width={W} height={H}/>
    <Composition id="GK-nuclearclock" component={NuclearClockShort} durationInFrames={NUCLEARCLOCK_FRAMES} fps={FPS} width={W} height={H}/>
    <Composition id="GK-labgold" component={LabGoldShort} durationInFrames={LABGOLD_FRAMES} fps={FPS} width={W} height={H}/>
    <Composition id="GK-fridge" component={FridgeShort} durationInFrames={FRIDGE_FRAMES} fps={FPS} width={W} height={H}/>
    <Composition id="GK-radio" component={RadioShort} durationInFrames={RADIO_FRAMES} fps={FPS} width={W} height={H}/>
    <Composition id="GK-mivione" component={MiviShort} durationInFrames={MIVI_FRAMES} fps={FPS} width={W} height={H}/>
  </>
);
