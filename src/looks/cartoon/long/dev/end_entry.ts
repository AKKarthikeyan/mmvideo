import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/end";
registerRoot(makeRoot(Scene));
