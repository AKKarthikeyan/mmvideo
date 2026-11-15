# Long-form cartoon video: contract (28 Oct 2026)

Video: **"India Is Running Out of Babies. Here's the Map."** (Data Kadai long-form, Infographics Show-style cartoon look, 8-10 min,
1920x1080, 30 fps). Script: `docs/datakadai/week44/LONG_baby_map.md` (its [VERIFY] items are being resolved; the verified narration lands in
`docs/datakadai/longform/babies/SCRIPT_VERIFIED.md`). Draft only: no voice yet (MiniMax voice runs 06:45-22:10 IST and AK has not signed off
the script), timings are estimated from word counts.

## Files
- `contract.ts`: types and the 1920x1080 SAFE box. `figs.ts`: `fig({t,state,s})` reads `public/datayt/long/babies/figures.json`.
- `scenes/<kind>.tsx`: one file per scene kind, each exports `Scene: React.FC<SceneProps>`. `scenes/index.ts` is the registry. **Each builder edits only
  its own file(s)** (and may add helper files named `scenes/<kind>_*.tsx`). Never edit another kind's file, index.ts, contract.ts, LongCartoon.tsx,
  art.tsx or ui.tsx; ask for a change in your report instead. Keep your file compiling at all times (write a temp file, then move it).
- `cast.tsx` (Actor), `icons.tsx` (Icon), `sets.tsx` (Set): shared drawing libraries with FIXED APIs (below), each owned by one builder.
- `LongCartoon.tsx`: the engine. `LongCompositions.tsx`: `LONG-scene` (one scene) and `LONG-babies-cartoon` (all). `dev/devRoot.tsx`: isolated test root.
- Reuse the pilot kit: `../palette.ts` (C colours), `../art.tsx` (Keeper = "uncle", Bottle, Mouth, Fridge...), `../ui.tsx` (pop, ease, Badge, Pill, Bubble, Inked, ROUND and SANS font stacks).

## The look (match the pilot in src/looks/cartoon/CartoonStory.tsx)
Flat 2D vector cartoon, 8 px ink outlines (#17203A), flat fills from `C`, dot eyes, mitten hands, no gradients on characters, white rounded
badges with a hard offset shadow, blue (`C.royal`) statement cards, pop-in with overshoot (`pop()`), slow push-in camera, a recurring
"uncle" host. Everything is SVG or CSS drawn in code. No photos, no AI art, no logos. Numbers are drawn in `ROUND` (LK Bricolage 800).
Text and numbers stay inside SAFE (x 96-1824, y 64-1016); in draft mode a caption strip covers y 936-1016, so keep key content above y 920.
Brand bug is top right (engine). Scenes run 4-8 seconds; something is always moving (idle bob, blink, slow camera, draw-on lines).

## The number rule (non-negotiable)
Every figure printed comes from `fig()` (never typed), and is drawn only from `at(key)` (a local frame), never before. A scene's spec names each
revealed item with a `key`; the storyboard's `reveals` lists `{key, word}` and the timeline builder turns `word` into a frame. Use
`const t = at(key); if (f < t) draw the glyph-free shape (an empty badge outline, a growing bar) else draw the number`.
Bars, lines and dots may grow before the number shows, but the digits wait. Definitional constants (the replacement level 2.1) are allowed as
spec constants `{const: 2.1}` and are still revealed by key. A missing figure must make the render throw. No share-price, no advice, no politics,
no mocking any state or community. Map: Manipur is not in the NFHS-6 release; draw it blank (hatched) with the note "not in NFHS-6 release".
Disputed borders: use the map as the existing `StateMap` does (public/datayt/india/geo.json); take no side.

## Fixed library APIs (SVG <g> in the 1920x1080 frame)
- `Actor` (cast.tsx): `<Actor who x y h f pose flip mouth seed/>`; `who`: "uncle"|"mother"|"father"|"grandmother"|"girl"|"boy"|"baby"|"teacher"; (x, y) = middle of the feet line; h = height in px; pose "idle"|"present"|"point"|"cheer"|"worried"; mouth = Rhubarb shape letter A-H or X (see ../art.tsx Mouth).
- `Icon` (icons.tsx): `<Icon name x y s f/>` centred on (x, y); s = 1 is about 120 px across; names: book, school, hospital, house, ring, rupee, calendar, pram, clock, heart, tree, scale, egg, hen.
- `Set` (sets.tsx, owned by the stage builder): `<Set set f/>`; sets: home, school, street, clinic, village, city, void.

## Scene kinds and specs
All specs may also carry `camera?: {fx, fy, s0, s1}` (push-in over the scene) and `notes?: string`. Positions are in the 1920x1080 frame. A FigRef is `{t, state, s?}`.

1. **stage**: an illustrated scene. `{set, actors: [{id, who, x, y, h, pose?, flip?, enter?: key}], props?: [{icon, x, y, s, enter?: key}], badges?: [{key, ref?: FigRef, text?: string, prefix?, suffix?, caption?: string, x, y, size?, accent?: "underline"|"circle"}], pills?: [{text, x, y, key?}], bubble?: {who: actorId, text, x, y}, mouth?: boolean}`. A badge with `ref` prints `fig(ref)`, revealed at `at(key)`; `text` is for words. `y` is the feet line for actors, `h` the height in px. `enter` keys pop an actor/prop in at `at(enter)` (no number involved: the timeline builder resolves them like any reveal). `mouth: true` lets the uncle's mouth talk (draft: a gentle talk loop). The stage builder may add optional fields (e.g. `seed`, `tail`, `size`, `dot`, `color`, `rot`); it must report them exactly.
2. **replacement**: the 2.1 explainer: two parent figures; arrows to two child figures plus a small extra fraction; the 2.1 line. `{parents: 2, children: 2, extra: {const: 0.1, key}, line: {const: 2.1, key, label: "replacement level"}}`.
3. **tfr-line**: line chart of the national fertility rate by survey with the 2.1 replacement line. `{points: [{survey: "nfhs3"|"nfhs4"|"nfhs5"|"nfhs6", state: "India", key}], line: {const: 2.1, key}, years?: {nfhs3: "2005-06", ...}, cross?: key}`. A survey with no verified figure is omitted from the points.
4. **map**: 16:9 India state map. `{metric: "tfr6"|"tfr_change", mode: "scale"|"threshold"|"risers", threshold?: 2.1, highlight?: string[], labelStates?: string[], lists?: {lowest?: number, highest?: number, key}, blank?: ["Manipur"], title?: string}`. Colours from `C`; every state's value from `fig`. Legend and "above / below replacement" labels. Label-lists print numbers only after their key.
5. **slope**: `{items: [{state, surveys: ("nfhs4"|"nfhs5"|"nfhs6")[], key}], title?, sub?}` slope lines for a few states. Surveys with no figure are skipped, never guessed.
6. **multiples**: small multiples, one mini line chart per state, survey points. `{states: string[], surveys: [...], key}`.
7. **scatter**: `{x: "school10"|"marriage18", y: "tfr6", label: string[], trend: true, corr: {ref: FigRef, key}, caption?: string, prev?: {ref, key}}`. One dot per state/UT (all states present in figures.json, India excluded); labelled dots only for `label`. "Pattern, not proof" caption.
8. **statement**: solid-blue card with big white text. `{lines: string[], accent?: string[] (words in yellow), mascot?: boolean}`.
9. **title**: opening title card with the uncle and a headline. `{title, sub?, chip?}`.
10. **end**: closing scene: the uncle asks the question, source list, subscribe prompt, "next video" box (empty frame; end-screen elements are added in YouTube). `{question, sources: string[], next?: string}`.

11. **price-line** (Namakkal): `{series, y0, y1, ystep, drawKey?, drawn?, band?: {value: "max", key, label?}, marks: [{key, ref, at, caption?, side?, decimals?, prefix?, suffix?, color?}], title?, source, actor?}`. Type `PriceLineSpec` in `scenes/nk_kit.tsx`.
12. **share-map** (Namakkal): `{states: [{state, key, ref, bx, by, color?, caption?, decimals?, suffix?}], lit?: [{state, key?, color?}], pin?: {name, key, label}, zoom?: {u, v, s}, title?, source}`. Type `ShareMapSpec`.
13. **doc** (Namakkal): `{org, doc, quote, quoteKey, credit, creditKey?, label, actor?}`. The page is drawn and `label` says so on screen. Type `DocSpec`.

## Checks every builder must pass
1. Render stills of your kind with `LONG-scene` at several frames (before / at / after each reveal), look at each image, and fix what is wrong: text outside SAFE, overlaps, number before its `at`, unreadable type, empty areas, flicker.
2. Throw (render fails) if a figure is missing; never silently skip or invent a number.
3. Report: files you wrote, the spec fields you actually support (exact), any change you need elsewhere, and which stills you checked.

## As built (29 Oct 2026): the source of truth is the exported spec type in each scene file

The sections above were the brief. Where a builder added or renamed fields, the code wins; `scripts/datayt/long_validate.py` warns about fields it does not know (29 warnings on the babies storyboard, all of them the fields below).
- **map**: `MapSpec` in `scenes/map_geo.ts`. Reveal keys are named `fillKey`, `legendKey`, `highlightKey`, `riserKey`, `noteKey`; `highlight` is a state list or "above"|"below"|"at"|"risers"; `missing` (default Manipur) replaces `blank`; lists use `lists.low/high/show` and `lowKey/highKey`; modes scale|threshold|risers with `riseMin`, `waveFrames`.
- **stage**: adds `badges[].decimals|const|prefix|suffix|color|rot`, `actors[].seed|look|talk`, `props[].front|shadow`, `bubble.key|size|tail`, `pills[].dot|size`. Anchors: badge x,y = centre; pill x,y = top-left; bubble x,y = tail tip. Overlays are clamped into SAFE.
- **replacement** and **tfr-line**: the contract-shaped versions (`replacement_a.tsx`, `tfrLine_a.tsx`) were promoted on 29 Oct; the other copy's versions are kept in `_alt/`. tfr-line adds `crossNote`, `title`, `decimals`.
- **slope**: `SlopeSpec` in `scenes/slope.tsx` (`items[].name`, `hero`, `heroKey`, `heroLabel`, `decimals`, `t`). **multiples**: `MultiplesSpec` (`minChange`, `stagger`, `change`, `title`, `sub`, per-state `key`). **scatter**: `ScatterSpec` (`trendKey`, `source`, `xDecimals`, `prev.label`). **statement**, **title**, **end**: `StatementSpec`, `TitleSpec` (`icons`, `key`, `accent`), `EndSpec` (`subscribe`, `next`).
- **Duplicated versions kept for comparison (not wired in):** `scenes/stage_b.tsx`, `cast_b*.tsx` (+ `cast_kids|men|uncle|women.tsx` if present), `scenes/scatter_v2.tsx`, `scenes/_alt`-style `*_other_copy.tsx` under `../_alt/`. The live cast is `cast.tsx` -> `cast_people.tsx` + `cast_kit.tsx`.
- **Engine**: statement and end scenes switch the brand bug to its light-on-dark colours. Missing reveal keys throw; there is no default.
