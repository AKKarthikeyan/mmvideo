import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/stage_b";
registerRoot(makeRoot(Scene));
