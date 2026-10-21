// Illustrated scene types for the Vox engine (see kit.tsx). Each file owns a group of scene types.
import React from "react";
import {SP, ICONS} from "./kit";
import {SCENES_MONEY} from "./Money";
import {SCENES_GROWTH} from "./Growth";
import {SCENES_COMPARE} from "./Compare";
import {SCENES_WORLD} from "./World";
import {SCENES_DHARMA, DHARMA_ICONS} from "./Dharma";
export const ILLUS: Record<string, React.FC<SP>> = {...SCENES_MONEY, ...SCENES_GROWTH, ...SCENES_COMPARE, ...SCENES_WORLD, ...SCENES_DHARMA};
// The dharma icons join the kit's, so `icon: "diya"` works in every scene and in ILLUS-icon.
Object.assign(ICONS, DHARMA_ICONS);
