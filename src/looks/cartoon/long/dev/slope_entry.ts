import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/slope";
registerRoot(makeRoot(Scene));
