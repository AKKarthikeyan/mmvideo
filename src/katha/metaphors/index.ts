// Registry of the Katha metaphor scenes: scene {type: "metaphor", kind: "<name>"} picks one by kind; the script's free
// wording is mapped to these names by scripts/katha/build_film.py (KIND_MAP). Also serves the "light", "sanjaya" and
// "end" scene types (registered under those names in cosmos.tsx and hall.tsx).
import {SCENES as flame} from "./flame";
import {SCENES as water} from "./water";
import {SCENES as threads} from "./threads";
import {SCENES as paths} from "./paths";
import {SCENES as cosmos} from "./cosmos";
import {SCENES as hall} from "./hall";
export const METAPHORS = {...flame, ...water, ...threads, ...paths, ...cosmos, ...hall};
