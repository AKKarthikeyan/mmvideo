// Look B scene kinds: the same kinds and spec fields as the cartoon storyboard (CONTRACT_UPSC.md), drawn in look B.
import type React from "react";
import type {SceneProps} from "../cartoon/long/contract";
import {Scene as stage} from "./scenes/stage";
import {Scene as title} from "./scenes/title";
import {Scene as windmap} from "./scenes/windmap";
import {Scene as statement} from "./scenes/statement";
import {Scene as notebook} from "./scenes/notebook";
import {Scene as analogy} from "./scenes/analogy";
import {Scene as globe} from "./scenes/globe";
import {Scene as sketch} from "./scenes/sketch";
export const RICH_SCENES: Record<string, React.FC<SceneProps>> = {stage, title, windmap, statement, notebook, analogy, globe, sketch};
