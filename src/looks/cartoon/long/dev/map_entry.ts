import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/map";
registerRoot(makeRoot(Scene));
