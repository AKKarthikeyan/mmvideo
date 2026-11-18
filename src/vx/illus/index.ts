// Illustrated scene types for the Vox engine (see kit.tsx). Each file owns a group of scene types.
import React from "react";
import {SP} from "./kit";
import {SCENES_MONEY} from "./Money";
import {SCENES_GROWTH} from "./Growth";
import {SCENES_COMPARE} from "./Compare";
import {SCENES_WORLD} from "./World";
import {SCENES_STORY} from "./Story";
import {SCENES_SHOP} from "./Shop";
import {SCENES_BRIDGE} from "./Bridge";
export const ILLUS: Record<string, React.FC<SP>> = {...SCENES_MONEY, ...SCENES_GROWTH, ...SCENES_COMPARE, ...SCENES_WORLD, ...SCENES_STORY, ...SCENES_SHOP, ...SCENES_BRIDGE};
