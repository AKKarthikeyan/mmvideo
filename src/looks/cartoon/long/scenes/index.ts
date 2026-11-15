// Registry: scene kind -> component. One file per kind; each builder edits only its own file.
import type React from "react";
import type {SceneProps} from "../contract";
import {Scene as stage} from "./stage";
import {Scene as replacement} from "./replacement";
import {Scene as tfrLine} from "./tfrLine";
import {Scene as map} from "./map";
import {Scene as slope} from "./slope";
import {Scene as multiples} from "./multiples";
import {Scene as scatter} from "./scatter";
import {Scene as statement} from "./statement";
import {Scene as title} from "./title";
import {Scene as end} from "./end";
import {Scene as priceLine} from "./priceLine";
import {Scene as shareMap} from "./shareMap";
import {Scene as doc} from "./doc";
import {Scene as globe} from "./globe";
import {Scene as windmap} from "./windmap";
import {Scene as analogy} from "./analogy";
import {Scene as notebook} from "./notebook";
import {Scene as sketch} from "./sketch";

export const SCENES: Record<string, React.FC<SceneProps>> = {stage, replacement, "tfr-line": tfrLine, map, slope, multiples, scatter, statement, title, end, "price-line": priceLine, "share-map": shareMap, doc, globe, windmap, analogy, notebook, sketch};
