# Look B, GEO-04 Part 1 ("Why Do Some Volcanoes Ooze and Others Explode?"): new `analogy` variants (contract, 10 Nov 2026)

Read `CONTRACT_B.md` first: the look, the rules and the checks there all apply unchanged (rich daylight illustration, depth layers, warm
light, thin coloured outlines, paper grain, realistic people, Newsreader serif for headlines, Schibsted sans for labels, warm paper cards,
`Frame` from `scenes/analogy_kit.tsx`). Read two finished builder files for the entry shape (`scenes/analogy_e1.tsx` and one of its helpers,
`scenes/analogy_e1_barter.tsx`). The monsoon and money films must still render unchanged.

**This film is physical geography.** The viewer is a UPSC aspirant or a curious 12-year-old: every picture must make one idea obvious
without the narration, never show more than the narration and the claims say, and be **geologically correct** (rules below). A scene may be
simple, never thin: atlas-relief land, depth-tinted sea, layered rock with texture, glowing magma with soft light, drifting ash and steam.

## The film
- Compositions `LONG-geo04-p1-B` (30 fps, for stills) and `LONG-geo04-p1-B60` (60 fps) in the entry `src/looks/upsc_rich_b/films_index.tsx`
  (player `RichLong.tsx`). Storyboard `public/datayt/long/upsc/geo04-p1/storyboard.json` (38 scenes; each has `visual`: follow it), timeline
  `.../geo04-p1/timeline.json` (estimated now; the measured voice replaces it later, so motion must be a function of `f`, `dur` and `at(key)`,
  never of fixed frame numbers). Built by `scripts/upsc/geo04_p1_storyboard.py`. Never edit them.
- Find your scenes: `python3 -c "import json;[print(s['id'],s['spec'].get('which'),s['spec'].get('mode'),s['visual']) for s in json.load(open('public/datayt/long/upsc/geo04-p1/timeline.json'))['scenes'] if s['kind']=='analogy']"`
- The narration is each scene's `vo`; the script is `/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/GEO-04/SCRIPT_P1.md`. Read the beat before drawing.
- Spec: `{which, mode?, chip, limit, labels: [{text|lab, key}]}`. Fill your record (`scenes/analogy_v1.tsx`, `_v2`, `_v3`): replace the
  placeholder entries with `{Art, Labels, bg}`; keep the record's name and every `which` key. Art in helper files `scenes/analogy_v1_*.tsx`
  (etc.). Never edit another builder's files, `analogy.tsx`, `analogy_kit.tsx`, `kit.tsx`, `map.tsx`, `girl.tsx`, the storyboard or the timeline.

## Numbers and labels
- A label is `{text, key}` (print as given) or `{lab, key}` (print `lab(lab)` from `src/looks/cartoon/long/figs.ts`; keys `g4_*`). Support both.
  Never type a figure in a component; figures come only from labels.
- Every label appears only from `at(key)` (use `LabelCard` or your own card in the look); before that draw nothing. Place labels in clear
  space, never over the key part of the drawing, inside x 96-1824 and y 64-920, clear of the brand area top right (x > 1560, y < 118).
- `chip` and `limit` are drawn by `Frame`.

## Geological accuracy (check every drawing against these)
- Magma is underground (chamber, conduit); lava is on the surface. The vent is the opening; the cone is built around it.
- Shield volcano: very broad, low, gentle slopes (a few degrees), built of many thin lava sheets. Composite (strato) volcano: steep, tall cone,
  alternating layers of lava and ash, a summit crater. Cinder cone: small, steep, made of loose cinders, one vent. Caldera: a wide collapse
  hollow far bigger than a crater, here with a lake. Flood basalt: flat, stacked sheets like a staircase of plateaus (no cone).
  Mid-ocean ridge: a long split in the sea floor, lava welling up into rounded pillows, plates moving apart on both sides.
- Eruption products: bombs (big lumps) fall near the vent; ash (fine) rises high and drifts farthest downwind; the gas plume is mostly white steam.
- Pyroclastic flow: a ground-hugging grey cloud racing down the flank (not a lava river).
- Intrusive forms in one crust cut-away: batholith = very large, deep, irregular granite body; laccolith = a dome with a flat base, fed by
  a pipe from below, pushing the layers above into a dome; lapolith = a saucer (concave up) body; phacolith = a lens sitting along the crest
  or trough of folded layers; sill = a near-horizontal sheet between layers; dyke = a near-vertical wall cutting across layers.
- Subduction: the denser ocean plate dips under the continental plate at a deep trench; the volcano stands inland of the trench, above where
  the sinking plate is deep. Ridge: plates move apart, magma rises in the gap. Arrows show plate motion.
- Hotspot: a fixed plume in the mantle under a moving plate; the youngest island is over the plume, older islands are carried away, lower and
  more worn; the plate moves, the plume stays.
- World map: the Natural Earth country outlines, India's official view (`/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson`,
  public domain; prepare a simplified projected path file with a script under `scripts/upsc/` and a JSON in `public/datayt/long/upsc/`).
  Centre on the Pacific. **India must appear whole** wherever it is on the map (no crop of Ladakh, Jammu and Kashmir, the Andaman and
  Nicobar Islands or Lakshadweep). The Ring of Fire is a schematic glowing band along the Pacific rim (the scene's chip says ILLUSTRATION);
  mark only named volcanoes at their real positions (Mauna Loa, Fuji, St Helens, Pinatubo, Parícutin), no invented dots. No plate boundaries
  are drawn on the world map (no licensed data); the slice scenes show plates.
- No photos, no AI art, no logos. No real person's face. People: `girl.tsx` and the kit's `Person`.

## Group V1 (owns `analogy_v1*.tsx`): cut-aways and what comes out
- `volcano-hook`: `mode:"mauna"` (s001) dusk on a broad shield, a red lava river sliding gently down, glow on low cloud; labels `ml`, `gl`.
  `mode:"pinatubo"` (s002) a towering ash column over green tropical hills, then (second half of the scene) a small globe dimming under a thin
  veil; labels `pt`, `cl`.
- `cutaway`: `mode:"vent"` (s006) an atlas-relief mountain cut open, vent and cone highlighted; labels `df`, `vt`. `mode:"magma"` (s007) the same
  cut-away, a glowing magma chamber deep below (label `mg`), a red flow on the slope (label `lv`), the ground line glowing; `nc` a small note card; `ex` a bold card.
- `eruption-products`: `mode:"list"` (s008) an eruption with five labelled zones (`p1`-`p5`) lighting up in turn; `mode:"spread"` (s010) bombs
  falling close, ash drifting far downwind, a tall white steam plume; labels `bn`, `af`, `wv`.
- `pot-lid` (s011): a kitchen, a steel pot on a gas flame, the lid rattling, puffs at its rim; labels `pb`, `q`.
- `fizzy`: `mode:"jugs"` (s012) water pouring with small bubbles popping beside thick porridge holding big bubbles that burst; labels `rn`, `th`, `vs`.
  `mode:"bottle"` (s013) the girl (from `girl.tsx`, read-only) shakes a bottle with her thumb on top, lifts it, foam bursts; label `fz`.
  `mode:"limit"` (s014) a rising magma column in a cut-away with bubbles appearing and growing as it climbs, a depth gauge falling; label `gp`.

## Group V2 (owns `analogy_v2*.tsx`): the volcano types
- `shield`: `mode:"dome"` (s015) a wide low dome, thin lava sheets layered like pages, the girl at its foot for scale; labels `sh`, `ml`.
  `mode:"steam"` (s016) the shoreline of the shield: sea water meets the vent and a white steam jet bursts; label `wt`.
- `composite`: `mode:"cone"` (s017) a steep cone cut open, alternating lava and ash stripes; labels `ly`, `cv`, `ex`. `mode:"flow"` (s018) a grey
  pyroclastic cloud racing down the flank; labels `pf`, `t8`.
- `five-types` (s019-s022): five cards on a desk (dome, steep cone, hollow with a lake, stacked sheets, sea-floor crack). `mode:"all"` shows all
  five, the first two get ticks; label `f5`. `mode:"caldera"` the caldera card grows to fill most of the frame and animates the collapse and the
  lake; labels `cd`, `cl`. `mode:"flood"` the flood basalt card grows: sheet after sheet spreading; label `fb`. `mode:"ridge"` the ridge card
  grows: the glowing crack, pillow lava, plates moving apart; labels `mr`, `q3`.
- `cinder-cone` (s023): a ploughed field with a farmer and oxen (kit `Person`), a smoking mound growing to a tall black cone over a time-lapse of
  seasons (trees bare, green, bare); labels `cc`, `pr`.
- `ferry-island` (s038): the girl on a ferry deck looking at a lone smoking island in a blue sea; label `nx`.

## Group V3 (owns `analogy_v3*.tsx`): underground and the map
- `intrusive` (s025-s028): one crust cut-away with sedimentary layers and folds. `mode:"rocks"` two rock samples under a lens: fine-grained
  (volcanic) and coarse crystals (plutonic); labels `vr`, `pr`. `mode:"batholith"` the big granite body deep below; the layers above wear away over
  a fast clock until its top shows as grey domed hills; labels `if`, `bt`, `er`. `mode:"all"` all forms drawn in, each lighting up at its key:
  `la`, `lp`, `ph`, `si`, `dk`. `mode:"deccan"` the dyke glows as a vertical wall feeding stacked lava sheets above; labels `wm`, `dt`.
- `subduction` (s029, s031, s036): a slice of the Earth. `mode:"both"` the ocean plate sinking under a continent at a trench with a composite
  volcano inland, and across the ocean a ridge pulling apart; labels `pe` (both edges glow), `sk`, `pt`. `mode:"join"` the same slice: a steep sticky
  cone over the sinking plate, runny lava welling at the ridge; labels `sc`, `rb`. `mode:"summary"` the slice smaller with a small bottle icon and a
  small world icon beside it; labels `rb`, `st`.
- `plates-map` (s030, s032): the Pacific-centred world map. `mode:"ring"` the schematic glowing band around the Pacific rim; named volcanoes
  as small markers; labels `mh`, `nc`, `rf`. `mode:"hawaii"` the same map; a question mark drops onto Hawaii, far inside the plate, with a
  dashed measure line to the nearest rim; label `hw`.
- `hotspot` (s033): a cut-away: a plume of heat rising from deep under a moving plate; islands form one by one over it and slide away on the
  plate like a conveyor; older islands lower and worn; labels `jw` (with the plume), `pm` (the plate-motion arrow), `ka` (on the oldest island).

## Checks (each builder, for each of its scenes)
Render stills at start, middle and end: `npx remotion still src/looks/upsc_rich_b/films_index.tsx LONG-geo04-p1-B out/upsc/geo04/<which>_<scene>_<frame>.png --frame=<frame> --scale=0.5`
(frames from `timeline.json`: a scene runs from `from` to `from + dur`), open each with the Read tool and fix what is wrong: anything below the
monsoon film's richness, a geology error (the list above), text outside the box or over the drawing, overlaps, a label before its reveal,
unreadable type, a cropped India. Then render one 2-second stretch of one scene at 60 fps (`LONG-geo04-p1-B60 --frames=a-b`) for smooth motion.
Report the files you wrote and anything you could not do.
