// Indica Atlas cyclone Shorts (27 Oct 2026): one file per Short.
import {Spec} from "../engine/GeoShort";
import {odisha} from "./odisha";
import {bay} from "./bay";
import {bayB} from "./bay_b";

export const SPECSC: Record<string, Spec> = {cy01odisha: odisha, cy02bay: bayB, "cy02bay-a": bay}   // cy02bay = story cards (AK kept B, 28 Oct 2026); cy02bay-a = satellite overlays, kept for reference;
