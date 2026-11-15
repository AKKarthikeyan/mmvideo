import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/replacement_a";
registerRoot(makeRoot(Scene));
