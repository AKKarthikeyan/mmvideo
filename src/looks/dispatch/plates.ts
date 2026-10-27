// Which textless plates Dispatch may show as a framed, captioned illustration, and how to crop them into its windows.
// Dispatch's rule (LOOKS_SPEC.md, Kadai Dispatch, AI art): no people, currency or religious imagery, checked at window
// scale. The plate is never behind a number, a label or the source line, and the look works without one.
//
// datayt/covers/gd01-gemini.png is REFUSED: at window scale the two medallions on the jewellery read as a deity figure, and
// the coins carry emblems like currency (the completeness critic flagged the same plate at glyph scale). gd01 renders with
// no art until a new plate is approved; then add it here.
export type PlateUse = {ok: boolean; why: string; focusY: number; zoom: number};

const PLATES: Record<string, PlateUse> = {
  "datayt/covers/gd01-gemini.png": {ok: false, why: "deity-like medallions and currency-like coins readable at window scale", focusY: 0.72, zoom: 1},
  "datayt/covers/cw01-gemini.png": {ok: true, why: "plain unlabelled bottles, no contour shape, no text, no logo", focusY: 0.6, zoom: 1.05},
};

// A plate not listed here has not been looked at at window scale, so it is not shown.
export const plateUse = (plate: string | null): PlateUse | null => {
  if (!plate) return null;
  const u = PLATES[plate];
  return u && u.ok ? u : null;
};
