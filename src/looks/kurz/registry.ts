// KURZ look: scene kind -> component. One file per kind (see CONTRACT_KURZ.md); each builder edits only its own files.
import type React from "react";
import type {SceneProps} from "../cartoon/long/contract";
import {Scene as chapter} from "./chapter";
import {Scene as title} from "./title";
import {Scene as quote} from "./quote";
import {Scene as split} from "./split";
import {Scene as timeline} from "./timeline";
import {Scene as counter} from "./counter";
import {Scene as bars} from "./bars";
import {Scene as seasons} from "./seasons";
import {Scene as stage} from "./stage";
import {Scene as statement} from "./statement";
import {Scene as doc} from "./doc";
import {Scene as shareMap} from "./shareMap";
import {Scene as priceLine} from "./priceLine";

export const KURZ_SCENES: Record<string, React.FC<SceneProps>> = {stage, statement, doc, "share-map": shareMap, "price-line": priceLine, chapter, title, quote, split, timeline, counter, bars, seasons};
