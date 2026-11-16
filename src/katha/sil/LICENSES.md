# Sources of the silhouettes in this folder

Each JSON file also names its source in its `credit` field. `scripts/katha/build_film.py` reads those fields on every
build and refuses to clear a film if any source is not CC0 or drawn in code.

| File | What | Source | Licence |
|---|---|---|---|
| `horse.json` | Gallop, 36 frames, the 0.6 s clip played over 1.2 s | Horse from Quaternius's Ultimate Animated Animal Pack, as repacked in [stepanMiller/wild-mustang](https://github.com/stepanMiller/wild-mustang) `public/assets/characters/horse.glb` (sha256 `591007f3…508d3`), clip `Gallop` | CC0 1.0, see `LICENSE-quaternius.txt` |
| `horse_stand.json` | Standing idle, 24 frames over 3.33 s | The same model, clip `Idle` | CC0 1.0 |
| `stork.json`, `flamingo.json`, `parrot.json` | Wingbeat cycles | Drawn in code by `scripts/katha/birds.py`; no outside model | Ours |

The wild-mustang repository is MIT-licensed and adds a face-blaze mesh (material `Veter_Blaze`) and a `Trot` clip to the
Quaternius model. The tracer skips the blaze and we use only Quaternius's own clips, so these silhouettes derive from CC0
material only. Credit is not required; descriptions may say "Horse model by Quaternius (CC0)".

The model itself is not kept in git. `python3 scripts/katha/trace_glb.py --fetch` downloads it with both licence files
and checks its sha256.

History: until 21 Oct 2026 these files were traced from the three.js example models from *3 Dreams of Black* (ro.me),
which are CC BY-NC-SA 3.0, non-commercial. They were replaced; see `docs/STYLE_RESEARCH_GITHUB.md`.
