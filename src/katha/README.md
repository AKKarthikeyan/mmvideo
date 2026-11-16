# The Katha kit: the premium look for the Gita film

AK (21 Oct 2026): the flat ink-outline illustrations read as "2nd grade drawing"; the Gita film must look **premium, rich,
poetic**. The Katha kit answers with **silhouettes in light**: deep indigo, saffron and gold skies, figures and animals as
dark shapes rimmed with light, drifting dust, slow camera push-ins, film grain, gold Sanskrit. Reference stills:
`docs/katha/ref-chariot.png`, `ref-field.png`, `ref-verse.png`, `ref-title.png`.

## Rules (non-negotiable)
- **Krishna and Arjuna appear only as backlit silhouettes** from `figures.ts` (no face, no features, no colour fill).
  Krishna's cosmic form (Gita 11) is shown **only as light**, never as a figure. No other deity is drawn at all.
- No image model, no photographs. Everything is code-drawn or traced from CC0 models (`sil/LICENSES.md`).
- Every word on screen comes from the scene's props (`s`), never hard-coded in a scene.
- Deterministic: no `Math.random`, no `Date`. Use `rnd(i, salt)` from `geom.ts`. Animate only from `useCurrentFrame()`.
- Calm motion: slow drifts, breathing light, slow push-ins. Nothing bounces or pops.
- **No SVG blur filters for light, haze, smoke or glow; use gradients.** Long software renders dropped black tiles when
  scenes stacked large `feGaussianBlur` / `feTurbulence` filters. Soft light is a `radialGradient` whose stops fade to
  opacity 0; haze is a `linearGradient`; the grain is a texture (`Finish`). At most one small blur, on a small element.
- Never pure black or flat clip-art colour: silhouettes are `K.sil` (#160C1E) or tints of it; light is warm gold.

## Art direction rules (22 Oct 2026, after the art director's pass)
- **Indian flora only**: peepal, banyan, neem, palmyra, coconut, khejri, deodar, kans grass, rice, lotus from `flora.tsx`.
  No savanna acacias, umbrella pines, generic lollipop trees.
- **One Indian architectural vocabulary**: the Nagara temple and its parts from `arch.tsx` (shikhara with amalaka,
  kalasha and flag; shrine; cusped arch; carved pillar; devakoshta niche; ghat steps; moulded ledge). No European
  fireplace niches, no Mughal pointed arches, no boxy towers with grid windows.
- **One flame model**: every flame is `Flame` (or `Fire`, built of it, or `Diya`'s) from `fire.tsx`: white core, faint
  blue root, translucent licks, one glow falloff. No scene draws its own flame.
- **The moon is warm ivory-gold** (`Sky` default); night skies keep a warm amber band on the horizon, so indigo, plum and
  amber carry through the film. `moon="cool"` exists only for a deliberate exception.
- **One light per shot**: every `Rimmed` in a scene takes its light from the same source (a direction, or `point` for a
  lamp in the middle of the frame). Never rim both sides of a shape.
- **No ghosts**: a solid object never fades to a translucent ghost. Change things behind light or mist (`LightFlash`,
  `MistWipe` in `sky.tsx`, swap while the cover is over 0.9) or break them apart (fragments that drift off, each solid).
  Glows, mist, smoke and light itself may fade.
- **Every beat lands on an image**: the last second of a beat holds a composed subject (a lamp, a figure, a tree, a
  temple), never empty sky.
- **Human anchors**: in key beats the human figure (Krishna, Arjuna, a seeker) stands at least 18-20% of the frame's
  height (195-215 px of 1080).
- **Words on screen**: one rule, one style: Devanagari first (Tiro Devanagari Sanskrit, gold), English under it in small
  letter-spaced Cinzel capitals; revealed only on cue; drawn in `Frame`'s `overlay` slot so the camera push never scales
  it. Use `Label` from `stage.tsx`; scenes do not set their own type.

## Files
| File | What |
|---|---|
| `look.tsx` | `K` palette, `W H FPS`, fonts (`SA` Tiro Devanagari Sanskrit, `EN` Cormorant Garamond, `CAPS` Cinzel), `KathaDefs` (gradients `k-gold`, `k-fade-h`, `k-halo` and `k-halo-soft` with a Gaussian-like falloff; text glows `k-soft`, `k-bloom` for cards only; two small blurs `k-b1_5`, `k-b4`), `softStops(c0, peak, c1, k)` (the one glow falloff, as gradient stops), `SoftGlow` (an ellipse of soft light), `mixHex`, `blur(s)` (clamps to the small blurs), `Finish` (grain texture + vignette) |
| `geom.ts` | `smooth(points, closed or {closed, t, wind})` Catmull-Rom outline (a point `[x, y, "c"]` is a sharp corner; `{closed: false}` leaves it open; `wind` turns it), `polyD`, `ribbon(pts, w0, w1, pw, wind?)` tapered band, `band(pts, w0, w1, pw, tip)` smooth tapered band always wound clockwise, `crPoints(pts, per, closed?)` points along the open Catmull-Rom curve, `cumLen`, `atLen(pts, s)` (point and heading at arc length s), `resample`, `area`, `orient`, `sampleCubics`, `streamer`, `wob` (smooth deterministic noise), `place`, `rnd`, `lerp`, `clamp01` |
| `flora.tsx` | Indian trees and plants as `Rimmed` path items: `peepal`, `banyan`, `neem`, `palmyra`, `coconut`, `khejri`, `deodar` (all `({x, y, h, seed, wind, t, detail, fill, back})`), `reeds` (kans grass), `rice`, `paddy({x0, x1, y, h})`, `lotusLeaf({x, y, r, raised})`, `lotusBud`, `lotusFlower` |
| `arch.tsx` | Nagara architecture as `Rimmed` path items with named anchor points (`piece.at`): `temple({x, y, w, porch, spires, flag})`, `shrine({x, y, h})`, `cuspedArch({x, y, w, h, lobes})`, `pillar({x, y, h})`, `niche({x, y, w, h, wall})`, `ghat({x0, y0, x1, y1, n, view: "side" or "front", landing})`, `ledge({x0, x1, y, h, wall})`; parts `spire`, `amalaka`, `kalasha`, `pillarHalf`; tints `RELIEF`, `RELIEF_LT` |
| `fire.tsx` | the one flame model: `Flame({x, y, h, f, seed, calm, wind, b, halo, licks, blue})`, `Fire` (a bed of the same flames), `Diya({x, y, s, f, lit, flame, flip})` and `diyaWick`, `flicker`, `flameOutline` |
| `KitSheet.tsx` | the Still `KATHA-kit`: every piece above in the Lamplight style (pages `all`, `flora`, `plants`, `arch`, `fire`, `sky`, `one` with `kind`) |
| `stage.tsx` | `SceneP` ({s, n}), `Frame` (full-frame svg with defs, a zoom/push, an `overlay` slot outside the push for words, `vig` / `grain` for the finish), `push(f, n, from, to)`, `Label` (the words-on-screen rule), `Flock` (birds crossing), `Foreground` (out-of-focus grass and spears) |
| `sky.tsx` | `Sky` (mood "dusk" / "dawn" / "night" / "gold"; sun or warm moon, or `sun={null}` for none; `disc`, `glow`, `moon: "warm" or "cool"`, `horizon` y, `band` (the warm horizon band), cloud `bands`; god rays, clouds behind the disc, stars), `skyStops`, `sunColors`, `MOODS`, `Dust` (motes in the light), `Haze`, `Clouds` (per-instance gradient ids), `MistWipe`, `LightFlash`, `mistCover` |
| `field.tsx` | `Armies`, `NearArmies`, `Army` (rows on a soft mound, no hard base), `armyBase`, `Ground`, `armyPath` |
| `sil.tsx` | `Rimmed` (rim-lit silhouette from path items `{d, t, fill, c, rim, rw}`; `light` direction or `point`; `glow` without filters), `Bird` (flamingo, stork, parrot in flight, drawn in code), `horseItem` (gallop and standing idle traced from the CC0 Quaternius horse), `CYCLES`, `frameOf` |
| `figures.ts` | `krishnaTeach(w, t)`, `krishnaDrive`, `arjuna("despair" / "listen" / "resolve")`, `gandiva`, `ratha`, `wheel`, `mukuta(x, y, s, tall)` (the crown): path lists, standing on y = 0, ~400 units tall |
| `cards.tsx` | `VerseCard`, `TitleCard`, `Mandala`, `Rule` (gold rule with a lotus bud), `wrap`, `devaNum` |
| `scenes.tsx` | `field`, `chariot`, `verse`, `title`; `metaphor` (by `s.kind`), `light`, `sanjaya`, `end` dispatch to `metaphors/` |
| `metaphors/*.tsx` | one file per family; each exports `SCENES: Record<kind, React.FC<SceneP>>` |
| `Film.tsx` | the film engine (dissolves, captions, the eighteen lamps, music) |

## A scene
```tsx
const Lamp: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  return (
    <Frame f={f} zoom={push(f, n)}>
      <Sky mood={s.mood || "night"} sun={[960, 900]} sunR={40} f={f} rays={0} id="lamp"/>
      {/* ... silhouettes with <Rimmed paths={peepal({...})} light={[dx, dy]}/>, flames with <Flame/> or <Diya/>,
          glows with <SoftGlow/> or url(#k-halo), <Dust/> ... */}
    </Frame>
  );
};
export const SCENES = {lamp: Lamp};
```
`n` is the beat length in frames (the scene must look right at any frame from 0 to n). Captions sit at the bottom
(y > 930) and the lamps row at the top (y < 110): keep the subject between.

## Rimmed: light, winding, rim width
- How it works: the items are drawn in the rim colour, then again in their fill nudged `w` away from the light, which
  leaves a crescent of light on the side facing it. No clip and no filter.
- `light` is a direction **in the Rimmed's own coordinates** (inside its `transform`): a mirrored transform mirrors the
  light, so pass `[-lx, ly]` for a shape drawn with `scale(-1 1)`. Item transforms (`t`) do not turn the light.
- `point={[x, y]}`: the light is a point (a lamp in the hall); each item turns its rim towards it (its centre is `c` if
  given, else estimated from the path). One light per shot either way.
- Winding: inside one item (one path string with many subpaths), overlapping subpaths of opposite winding cancel and cut
  holes. Build joined shapes with `smooth(pts, {wind: "cw"})`, `band()`, `ribbon(..., "cw")` or `polyD(pts, true, "cw")`;
  cut a deliberate hole (a doorway, a niche) with `"ccw"`. Separate items always union.
- Per item: `rim: false` draws an item flat (carved relief, courses, a lighter tint inside the body); `rw` scales its rim
  (0.4 to 0.6 for leaves and leaflets that would otherwise turn all gold).
- `glow`: a bloom of the rim colour on the lit side only, from a few wider faint offset copies (no blur filter).

## Trees, buildings, fire (the kit pieces)
- Trees stand on `(x, y)` and are `h` tall (the banyan's crown is about 2.2 h wide, the khejri's about 0.9 h); `wind`
  (-1..1) leans them, `t` (the frame) sways them gently; `detail` scales the leaf count. Broadleaf crowns are clumps in
  the species' envelope with holes of sky and a branch skeleton that shows through; clumps behind are `SIL_BACK`.
- Temple proportions (Nagara, after the Odishan rekha deul): wall : tower : crown about 1 : 1.8 : 0.5; the shikhara rises
  almost straight and curves in to about half its base, beaded at each storey; the amalaka overhangs the neck; height to
  the finial about 3.3 w (w = the sanctum wall), to the flag about 3.9 w. Openings are real holes: draw the lamp's glow
  or the lit back of a niche behind the Rimmed. `piece.at` gives the door, the lamp, the top, the flag.
- `Flame`: `calm` 1 = a windless lamp (Gita 6.19), 0 = restless; `b` dims it (0 = out); `halo` is its light on the world
  (set 0 when a scene draws one shared glow). `Diya` is clay in the dark, its rim, belly petals and foot lit from its own
  flame; `lit={0} flame={false}` for an unlit lamp; `diyaWick()` gives the flame's root.
- Skies: `horizon` puts the bright band and the warm horizon band on a given y (a sea at 550); `sun={null}` draws no
  disc or glow; clouds always sit behind the disc.

## The kit sheet
```
npx remotion still /tmp/kb KATHA-kit kit.png --props='{"page":"all"}' --browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing
```
Pages: `all` (everything), `flora`, `plants`, `arch`, `fire`, `sky`, and `one` with `"kind": "peepal"` (or banyan, neem,
palmyra, coconut, khejri, deodar, reeds, rice, lotus, temple, temple0, shrine, arch, pillar, niche, ghat, ledge).

## Render a still
```
npx remotion bundle src/index.ts --out-dir /tmp/kb --public-dir public
npx remotion still /tmp/kb KATHA-dev out.png --props='{"scene":{"type":"metaphor","kind":"lamp"},"sec":8}' --frame=120 \
  --browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing
```

## Credits
Horses: traced (`scripts/katha/trace_glb.py`) from the horse in Quaternius's Ultimate Animated Animal Pack, CC0 1.0, as
repacked in github.com/stepanMiller/wild-mustang. The repo's own additions (a face-blaze mesh and a Trot clip, under its
MIT licence) are not used. Birds: drawn in code (`scripts/katha/birds.py`), with no outside model. Details and licence
texts: `sil/LICENSES.md`. Fonts: Tiro Devanagari Sanskrit, Cormorant Garamond, Cinzel (SIL OFL 1.1, via Fontsource).

Until 21 Oct 2026 the horses and birds were traced from the three.js example models from *3 Dreams of Black* (ro.me). Their
repository's README says Apache 2.0, but that covers the code only; the models are CC BY-NC-SA 3.0, which is
non-commercial, so they were replaced. `scripts/katha/build_film.py` checks the `credit` field of every `sil/*.json` on each
build and prints a BLOCKER line if any source is not CC0 or drawn in code.
