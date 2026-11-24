# Karthigai Deepam: 15-second ink Short (`kd-deepam`)

**AK, 24 Nov 2026.** A 15 s vertical Short in a hand-inked animation look: bold brush lines, hard black shadows and fast
cinematic shots. The colours are blue, black and red, and yellow is kept for the deepam and fire only. The theme is the
Thiruvannamalai Maha Deepam and Shiva as the light without beginning or end. **Channel: not chosen yet (AK's call).**

Everything below runs on the **Mac Mini** (CLAUDE.md: no media is made in cloud sessions). The cloud session wrote the
script and the tools, and it tested the grade and cut on synthetic test patterns only.

## Script (Reveal Loop; `S["kd-deepam"]` in `hyperframes/tools/shorts_build.py`)

| Beat | Voice | Picture (`scripts/deepam/film.py`) |
| --- | --- | --- |
| b1 | A whole mountain becomes a lamp. | k1: Arunachala at night, the summit fire flares, red gopurams below, push-in |
| b2 | Why this hill? | k2: devotees from behind, joined hands raised, clay lamps |
| b3 | Brahma flew up as a swan. | k3: the swan climbs beside an endless pillar of fire |
| b4 | Vishnu dug down as a boar. | k4: the boar tears down through black earth and red rock |
| b5 | To find where the fire ends. | k5: low angle up the pillar into the stars |
| b6 | Neither could. / Shiva has no end. | k5 continues / k6: Shiva emerges from the fire, hand in abhaya mudra |
| b7 | That fire? It's this hill. / So every Karthigai, in Thiruvannamalai, | k7: the fire settles into the hill / k1 played backwards, ending on frame 1 |

The last line runs back into the first: "…in Thiruvannamalai, a whole mountain becomes a lamp." The last frame is the
first frame, so the loop has no visible cut.

- **Send line:** Tamil families forward it on Deepam day. Everyone knows the lamp on the hill; few can say why that hill.
- **On screen, all the way through:** "KARTHIGAI DEEPAM · THIRUVANNAMALAI" and "Illustration · the legend of the pillar
  of fire (Shiva Purana; Arunachala Mahatmyam)". The story is told as legend. No date or number is claimed, so the Short
  can be reposted in later years. The ink style is not realistic, so YouTube's "altered or synthetic" label is not needed
  (SHORTS_RULES O2), but the on-screen "Illustration" label stays.
- **Gate:** `shorts_check.py` passes with no FAIL. S1 warns (under 20 s) because AK asked for 15 s. The timings are
  estimates until the voice is built. **The voiced length must be at least 15.0 s (H1).** If it comes out shorter, set
  the voice speed lower or add a word to b2 ("So why this hill?").
- **Title** (42 characters): "The hill that is a flame: Karthigai Deepam". English voice (`en-IN`). A native Tamil
  version would reach further (SHORTS_RULES K6) and needs a Tamil voice and a Tamil font: AK's call.

## Look

- Seven 6-second clips: a MiniMax image-01 still (1080 × 1920) is animated with Hailuo-02 image-to-video, as in the
  Night Pharmacist pipeline.
- Each clip is then **graded onto a fixed 8-colour palette**: black, three blues, two reds and two yellows, with no
  dithering. The grade gives flat ink fills, removes any colour the model drifts into, and makes shots generated
  separately match.
- Paper grain (moving each frame) and a soft vignette go on top.
- The prompts say yellow is for fire only. Check the stills for stray yellow (skin, clothes) before making the clips.
- Night Pharmacist lesson: Hailuo can drift toward a 3D or clay look by the end of a clip. Each beat uses only 1–3 s from
  near the start of its clip. If a shot still drifts, regenerate only that shot.

## Steps (Mac Mini)

```bash
git pull
python3 hyperframes/tools/shorts_build.py story kd-deepam      # voice (MiniMax, 06:45-22:10 IST) + real timings
python3 hyperframes/tools/shorts_build.py verify kd-deepam     # optional: check that "Thiruvannamalai" is said right
python3 hyperframes/tools/shorts_build.py check kd-deepam      # must show no FAIL (length >= 15.0 s)
zsh -lic 'python3 scripts/deepam/film.py img'                  # 7 stills -> public/deepam/img/  (look at them first)
zsh -lic 'python3 scripts/deepam/film.py clip'                 # 7 clips (costs money; DEEPAM_RES=768P is cheaper)
python3 scripts/deepam/film.py grade
python3 scripts/deepam/film.py cut                             # -> out/hyperframes/kd-deepam.mp4 (picture only)
python3 hyperframes/tools/shorts_build.py mux kd-deepam        # + voice + our own music bed -> kd-deepam-final.mp4
```

To redo one shot, delete its still or clip and run `img k6` / `clip k6`, then `grade k6` and `cut`. The cut points come
from the voiced timings in `hyperframes/shorts/kd-deepam/story.js`, so run `cut` again after any re-voice. Every number
of seconds a beat takes from a clip is set in `PLAN` in `film.py`. `cut` stops with a message if a beat needs more than a
6 s clip has.

`kd-deepam` has no HyperFrames `index.html`. `hf.py` now skips Shorts folders without one, so `hf.py render shorts`
is not affected.
