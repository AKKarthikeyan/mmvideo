// Illustrated scene types for the Vox engine (see kit.tsx). Each file owns a group of scene types.
import React from "react";
import {SP} from "./kit";
import {SCENES_MONEY} from "./Money";
import {SCENES_GROWTH} from "./Growth";
import {SCENES_COMPARE} from "./Compare";
import {SCENES_WORLD} from "./World";
export const ILLUS: Record<string, React.FC<SP>> = {...SCENES_MONEY, ...SCENES_GROWTH, ...SCENES_COMPARE, ...SCENES_WORLD};
