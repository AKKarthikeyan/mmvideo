# The Katha kit: the premium look for the Gita film

AK (21 Oct 2026): the flat ink-outline illustrations read as "2nd grade drawing"; the Gita film must look **premium, rich,
poetic**. The Katha kit answers with **silhouettes in light**: deep indigo, saffron and gold skies, figures and animals as
dark shapes rimmed with light, drifting dust, slow camera push-ins, film grain, gold Sanskrit. Reference stills:
`docs/katha/ref-chariot.png`, `ref-field.png`, `ref-verse.png`, `ref-title.png`.

## Rules (non-negotiable)
- **Krishna and Arjuna appear only as backlit silhouettes** from `figures.ts` (no face, no features, no colour fill).
  Krishna's cosmic form (Gita 11) is shown **only as light**, never as a figure. No other deity is drawn at all.
- No image model, no photographs. Everything is code-drawn or traced from the licensed models in `sil/`.
- Every word on screen comes from the scene's props (`s`), never hard-coded in a scene.
- Deterministic: no `Math.random`, no `Date`. Use `rnd(i, salt)` from `geom.ts`. Animate only from `useCurrentFrame()`.
- Calm motion: slow drifts, breathing light, slow push-ins. Nothing bounces or pops.
- Never pure black or flat clip-art colour: silhouettes are `K.sil` (#160C1E) or tints of it; light is warm gold.

## Files
| File | What |
|---|---|
| `look.tsx` | `K` palette, `W H FPS`, fonts (`SA` Tiro Devanagari Sanskrit, `EN` Cormorant Garamond, `CAPS` Cinzel), `KathaDefs` (gradients `k-gold`, `k-fade-h`, `k-halo`; filters `k-soft`, `k-bloom`, `blur(s)` for s in 1.5 4 8 14 30 60), `Finish` (grain + vignette) |
| `geom.ts` | `smooth(points)` Catmull-Rom outline (a point `[x, y, "c"]` is a sharp corner), `ribbon(pts, w0, w1)` tapered band, `sampleCubics`, `streamer(x0, y0, len, w0, w1, phase, amp, dir)` waving cloth, `rnd`, `lerp`, `clamp01` |
| `stage.tsx` | `SceneP` ({s, n}), `Frame` (full-frame svg with defs, a zoom/push and the finish), `push(f, n, from, to)`, `Flock` (birds crossing), `Foreground` (out-of-focus grass and spears) |
| `sky.tsx` | `Sky` (mood "dusk" / "dawn" / "night" / "gold", sun position and size, god rays, clouds, stars), `Dust` (motes in the light), `Haze`, `Clouds` |
| `field.tsx` | `Armies`, `NearArmies`, `Ground`, `armyPath` |
| `sil.tsx` | `Rimmed` (rim-lit silhouette from path items `{d, t, fill}`), `Bird` (traced flamingo, stork, parrot in flight), `horseItem` (traced gallop), `CYCLES`, `frameOf` |
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
Horse and bird silhouettes are traced (`scripts/katha/trace_glb.py`) from models by Mirada in *3 Dreams of Black* (ro.me,
Google Data Arts, 2011; repository states Apache License 2.0), as shipped in the three.js repository. Fonts: Tiro
Devanagari Sanskrit, Cormorant Garamond, Cinzel (SIL OFL 1.1, via Fontsource).
