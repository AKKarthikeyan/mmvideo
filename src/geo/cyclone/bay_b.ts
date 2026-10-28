// CY02 variant B (27 Oct 2026): same script and beats as bay.ts, different visuals. Satellite-map overlays are replaced by drawn-in-code
// story cards: unit-dot pictures (b2-b4) and a funnel diagram (b5). The map returns for the hook and the close.
// Honesty tags: the 100-dot grids are "of every 100 storms" (62% each, claim C003, normalised); b3 dots are 2:1 (122 vs 50, C001; "about");
// b4 dots are 1 dot = 3,000 people so 100 dots = 300,000 (C010, "at least", illustrative); the funnel is an ANALOGY drawn to the ratio 492/1397 (C034).
import {Spec, C} from "../engine/GeoShort";
import {bay} from "./bay";

type P = [number, number];
const HEAD: P[] = [[86.2, 20.3], [92.4, 20.3], [92.4, 22.6], [86.2, 22.6]];   // head of the Bay (ARTISTIC outline, labelled approximate)

export const bayB: Spec = {
  ...bay, id: "cy02bay",
  layers: [
    {in: "b1", kind: "bigtext", text: "STRONGER?", sub: "no sign, storm for storm", color: C.white, size: 170, y: 250},
    {in: "b1", dt: 1.2, out: "b1", kind: "label", at: [87.5, 14.2], text: "BAY OF BENGAL", color: C.cyan, size: 56},
    // b2: of every 100 storms, 62 turn severe, in both seas (Arabian Sea on the left, as on the map)
    {in: "b2", dt: 0.1, out: "b2", kind: "panel", name: "dotgrid", props: {title: "Of every 100 cyclonic storms…", note: "turn severe · IMD, 1982–2024", gap: 40, r: 16,
      groups: [{label: "Arabian Sea", color: C.amber, total: 100, lit: 62, cols: 10}, {label: "Bay of Bengal", color: C.cyan, total: 100, lit: 62, cols: 10}]}},
    // b3: about twice as many (122 vs 50), then the deadliest on record
    {in: "b3", dt: 0.1, out: "b3", kind: "panel", name: "dotgrid", props: {title: "Cyclones since 1982: about 2 to 1", note: "122 vs 50 · IMD, 1982–2024 · one dot ≈ 12 storms", gap: 78, r: 30,
      groups: [{label: "Arabian Sea", color: C.amber, total: 4, lit: 4, cols: 4, tag: "50 storms"}, {label: "Bay of Bengal", color: C.cyan, total: 10, lit: 10, cols: 5, tag: "122 storms"}]}},
    // b4: 1970, 100 dots = 300,000 people
    {in: "b4", dt: 0.1, out: "b4", kind: "panel", name: "dotgrid", props: {title: "1970 · what is now Bangladesh", note: "300,000+ died · WMO estimate · 1 dot ≈ 3,000 people", gap: 40, r: 16,
      groups: [{label: "people died", color: C.red, total: 100, lit: 100, cols: 10, tag: "300,000+"}]}},
    // b5: the funnel
    {in: "b5", dt: 0.1, out: "b5", kind: "panel", name: "funnel"},
    // b6: where they land
    {in: "b6", dt: 0.1, kind: "fill", poly: HEAD, color: C.amber, alpha: 0.22, dashed: true},
    {in: "b6", dt: 0.3, out: "b6", kind: "label", at: [89.3, 23.1], text: "HEAD OF THE BAY", sub: "outline approximate", color: C.amber, size: 46},
    {in: "b6", dt: 0.1, kind: "bigtext", text: "WHERE THEY LAND", sub: "not how strong", color: C.white, size: 120, y: 250},
    // b7: the loop
    {in: "b7", kind: "bigtext", text: "STRONGER? NO", sub: "deadliest on record? yes", color: C.white, size: 120, y: 250},
  ],
};
