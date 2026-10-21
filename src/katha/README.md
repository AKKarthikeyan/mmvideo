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

## Files
| File | What |
|---|---|
| `look.tsx` | `K` palette, `W H FPS`, fonts (`SA` Tiro Devanagari Sanskrit, `EN` Cormorant Garamond, `CAPS` Cinzel), `KathaDefs` (gradients `k-gold`, `k-fade-h`, `k-halo`; text glows `k-soft`, `k-bloom` for cards only), `Finish` (grain texture + vignette) |
| `geom.ts` | `smooth(points)` Catmull-Rom outline (a point `[x, y, "c"]` is a sharp corner), `ribbon(pts, w0, w1)` tapered band, `sampleCubics`, `streamer(x0, y0, len, w0, w1, phase, amp, dir)` waving cloth, `rnd`, `lerp`, `clamp01` |
| `stage.tsx` | `SceneP` ({s, n}), `Frame` (full-frame svg with defs, a zoom/push and the finish), `push(f, n, from, to)`, `Flock` (birds crossing), `Foreground` (out-of-focus grass and spears) |
| `sky.tsx` | `Sky` (mood "dusk" / "dawn" / "night" / "gold", sun position and size, god rays, clouds, stars), `Dust` (motes in the light), `Haze`, `Clouds` |
| `field.tsx` | `Armies`, `NearArmies`, `Ground`, `armyPath` |
| `sil.tsx` | `Rimmed` (rim-lit silhouette from path items `{d, t, fill}`), `Bird` (flamingo, stork, parrot in flight, drawn in code), `horseItem` (gallop and standing idle traced from the CC0 Quaternius horse), `CYCLES`, `frameOf` |
| `figures.ts` | `krishnaTeach(w, t)`, `krishnaDrive`, `arjuna("despair" / "listen" / "resolve")`, `gandiva`, `ratha`, `wheel`: path lists, standing on y = 0, ~400 units tall |
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
      {/* ... silhouettes with <Rimmed paths={[...]} light={[dx, dy]}/>, glows with url(#k-halo), <Dust/> ... */}
    </Frame>
  );
};
export const SCENES = {lamp: Lamp};
```
`n` is the beat length in frames (the scene must look right at any frame from 0 to n). Captions sit at the bottom
(y > 930) and the lamps row at the top (y < 110): keep the subject between.

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
