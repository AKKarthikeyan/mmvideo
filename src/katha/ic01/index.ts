// IC-01 scenes (The Lakshman Rekha Isn't in Valmiki's Ramayana): scene {type: "ic01", kind: "<name>"} picks one by kind.
import {SCENES as hut} from "./hut";
import {SCENES as road} from "./road";
export const IC01 = {...hut, ...road};
