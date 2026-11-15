import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/replacement";
registerRoot(makeRoot(Scene));
