// Indica Atlas border Shorts (28 Oct 2026): one file per Short. SENSITIVE: see galwan.ts for the map rules.
import {Spec} from "../engine/GeoShort";
import {galwan} from "./galwan";

export const SPECSL: Record<string, Spec> = {cy03lac: galwan};
