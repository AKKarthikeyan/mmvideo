import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/tfrLine";
registerRoot(makeRoot(Scene));
