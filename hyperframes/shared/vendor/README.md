# Optional libraries (AK, 18 Nov 2026: "we will use when needed")

These are **not** copied into projects by `hf.py sync`, so a project only carries them when it needs them. Copy the file
into the project's `assets/lib/` (or `hf.py sync` it by hand) and load it as shown. Versions are pinned; all are MIT.

| Library | Version | File | What for | Load |
| --- | --- | --- | --- | --- |
| [Tweakpane](https://github.com/cocopon/tweakpane) | 4.0.5 | `tweakpane/tweakpane.min.js` | Live sliders to tune a scene's numbers by eye while building it. **Remove before rendering** | ES module: `import {Pane} from "./assets/lib/tweakpane.min.js"` |
| [three.quarks](https://github.com/Alchemist0823/three.quarks) | 0.18.0 | `three.quarks/three.quarks.esm.min.js` | Particles and VFX in three.js scenes (dust, sparks, smoke). Needs three r182+; HyperFrames ships r184 | ES module, with an import map that points `"three"` at `assets/lib/three.module.min.js` |
| [lottie-web](https://github.com/airbnb/lottie-web) | 5.13.0 | `lottie/lottie.min.js` | Play a Lottie (`.json`) animation inside a HyperFrames scene, seeked frame by frame | `<script src="assets/lib/lottie.min.js">`; see sample `s16-lottie` |

Rules:
- Render-safe use: drive Lottie with `anim.goToAndStop(frame, true)` from `H.render(t)`, never `play()`. The renderer
  seeks frames out of order.
- Particle systems must be seeded and advanced from `t`, not from wall-clock time, for the same reason.
- A Lottie file from LottieFiles or elsewhere carries its own licence: use only ones free for commercial use, and note
  the source in the scene's comment. Our own animations (like `s16-lottie`) need no credit.
