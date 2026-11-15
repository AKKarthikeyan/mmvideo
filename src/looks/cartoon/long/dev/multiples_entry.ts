import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/multiples";
registerRoot(makeRoot(Scene));
