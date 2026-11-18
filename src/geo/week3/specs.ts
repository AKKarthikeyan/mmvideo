// Indica Atlas Week 3 (8 Nov 2026): one file per Short. Beats: scripts/geo/week3.py (W3-01/02/05) and scripts/geo/w3_<name>.py (the rest).
import {Spec} from "../engine/GeoShort";
import {up} from "./up";
import {ww1} from "./ww1";
import {rajasthan} from "./rajasthan";
import {baarle} from "./baarle";
import {myson} from "./myson";
import {kumbh} from "./kumbh";
import {konkan} from "./konkan";
import {kochi} from "./kochi";
import {mumbai} from "./mumbai";
import {kerala} from "./kerala";
import {colachel} from "./colachel";
import {thar} from "./thar";
import {states} from "./states";
import {shapequiz} from "./shapequiz";

export const SPECS3: Record<string, Spec> = {w3up: up, w3ww1: ww1, w3rajasthan: rajasthan, w3baarle: baarle, w3myson: myson, w3kumbh: kumbh, w3konkan: konkan, w3kochi: kochi, w3mumbai: mumbai, w3kerala: kerala, w3colachel: colachel, w3thar: thar, w3states: states, w3shapes: shapequiz};
