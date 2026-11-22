# Vox craft and 2.5D storytelling: what we add, what we skip (21 Nov 2026)

AK shared a long brief, "Creating Vox-Style Explainers and Six-Channel Storytelling Blueprints", and asked whether we
can improve our Vox-style and 2.5D vector storytelling. This note checks the brief against what the repo already does,
keeps what is new, flags what conflicts with AK's standing decisions, and says what was built.

**Short answer:** most of the brief is already in our system. The Story Engine (`STORY_ENGINE.md`, 16 rules from
`EVIDENCE.md`) covers the cognitive science, and the Vox Motion+ kit (`src/voxplus/`) covers highlights, collage, stepped
paper motion, camera moves and sound. There were two real gaps, and both now have tools:

1. **No check on a script's picture-and-voice pairing before animation.** The brief's best point (from Estelle
   Caswell's Vox process) is to lock the script and its visuals together before animating. Nothing checked that.
   → `scripts/av_check.py` (section 2).
2. **2.5D depth was guessed per layer.** `Camera.tsx` gives each layer its own parallax factor, so parallax, blur and
   shadow could disagree. → `src/voxplus/Depth.tsx`: one camera and one light drive every depth cue (section 3).

---

## 1. The brief against the repo

| Brief says | We already have | Action |
| --- | --- | --- |
| Lock the narration and its visual metaphor before animating; two-column A/V script | The PICTURE / SCREEN / VO / SRC format (`INDIA_LEDGER_EP1_SCRIPT.md`) | **New gate:** `av_check.py` |
| Every line has a visual job; cut lines without one | T10, T12 (weed and signal) | `av_check.py` flags dwell over 40 s and pictures with more than two actions |
| 2–6-word labels, never the spoken sentence on screen | T10; kit rule "at most 4 words per element" | `av_check.py` enforces it (FAIL above 8 words; FAIL when the screen repeats 5+ spoken words) |
| 12 fps "on twos" for graphics, smooth camera | `step()`, `enter.stepped` in Collage | `onTwos()` in Depth.tsx; frame-rate note in section 4 |
| One hero element, about 70% of the frame's weight | T12 "one highlight colour per frame" | Adopted as a **[craft]** rule in section 3 (practitioner rule of thumb, not research) |
| Persistent map canvas, add one layer per beat | MapRoute, HyperFrames s02/s06/s15, Indica Atlas playbook | Nothing new |
| Purposeful transitions; 3D push across cuts | `whip`, `pushThrough`, `matchZoom`; camera rule "no 3 push-ins in a row" | `av_check.py` warns on the third push-in |
| Pre-training card for jargon | T11; `PauseCard` | Nothing new |
| Segment into 3–4 chapters | T6, `ChapterCard` | `av_check.py` warns outside 3–6 chapters for 8–12 min |
| Knaflic: no gridlines, grey + one highlight + one alert colour | ChartBuild (key bar in yellow) | Nothing new; the three-colour rule is already how ChartBuild works |
| Source on screen for every number | CLAUDE.md rule; SourceTag; ledger in `structure_check.py` | `av_check.py` FAILs a SCREEN number in a scene with no SRC |
| Six distinct channel looks, not one template | Separate looks exist | Vox is for Moat & Margin and India Ledger only (section 5) |
| India map compliance | Natural Earth India POV; "check every India map by eye" | Keep. Add to the eye check: **Andaman & Nicobar and Lakshadweep are on the map** |

## 2. The A/V gate (`scripts/av_check.py`)

Run it on the script **before** any picture is built, and again after rewrites:

```sh
python3 scripts/av_check.py docs/INDIA_LEDGER_EP1_SCRIPT.md          # exit 1 if any FAIL
python3 scripts/av_check.py <script.md> --wps 2.9                    # runtime at MiniMax speed
```

It reads our block format: `## ACT n · Title`, then `**PICTURE:**`, `**SCREEN:**` (elements split by ` · `), `**SRC:**`,
`**VO:**`. A scene starts at each PICTURE. Text in (brackets) on a SCREEN line counts as a direction, not screen text.
The rules and their sources are in the script's docstring.

**First run, gold episode script** (already voiced and rendered, so this is a check on the render, not a rewrite):
3 FAIL, 13 WARN, 1,229 spoken words found (the script header estimates ≈1,400).
- FAIL: "GOLD 5× ↑" in the cold open (and the callback) has no source in that scene; the 5× source appears in Act 3.
  Check the render shows a SRC on frame 1.
- FAIL: "INDIA IMPORTS THIS IN 16 DAYS" has no SRC (it is our arithmetic from DGCIS; say so on screen).
- WARN: four scenes run 49–92 s of narration with one PICTURE line (Act 2 flow map, Act 4 scale, Act 4 dot chart, Act 5
  assumptions). The render may already change pictures inside them; the script should say how.
- WARN: several 5–8-word labels ("PAY ₹ TODAY → GET GOLD'S PRICE LATER + 2.5% A YEAR"). Shorten in future scripts.

The gate checks form, not truth. Facts still go through RESEARCH_RULES and the ledger.

## 3. 2.5D depth (`src/voxplus/Depth.tsx`)

**The model.** Flat planes sit at a height `z` above the desk (0 = the subject; positive = nearer the lens). One
camera (`cam3At(t, keys)`: x, y, distance d, yaw, pitch, roll, focus, aperture, haze) looks at them. From `z` alone each
plane gets its scale, parallax, depth-of-field blur and haze, so the depth cues cannot contradict each other.

| Part | What it does | Use it for |
| --- | --- | --- |
| `Stage`, `Plane` | Perspective stack; orbit (yaw/pitch) shifts planes about the focus plane | Any collage, map or desk shot with 3–5 layers |
| `LIGHT`, `liftShadow`, `Lifted` | One key light; shadow offset and softness grow with lift | Every cut-out. A shadow that is the same at every height reads as flat |
| `liftArc` | Pick up, travel, land with one bounce | Placing a label or photo onto the board (anticipation, arc, follow-through) |
| `Hinge` | A card folds up about one edge, shadow longest mid-fold | Flaps, pop-up reveals, the "lift the flap" answer |
| `onTwos` | Holds a pose for 2 ticks | Paper and marker motion while the camera stays smooth |
| `drift` | Slow seeded float, a few px | Long holds (4–10 s) so the frame is never frozen |
| `Boil` | 1–2 px hand-cut wobble on edges | Paper edges and drawings, **never** text or numbers |
| `project` | Where a point on a plane lands on screen | Pinning a screen-space label to a moving piece |

**Rules [craft]:**
- 3 to 5 planes per shot. One hero on the focus plane takes most of the frame's visual weight, with at most two or
  three supporting pieces.
- Text the viewer must read sits on the focus plane or nearer. Sources and captions sit outside the `Stage`: they never
  move or blur.
- Yaw and pitch within about 6°, roll within 2°. Beyond that the flat cards show their edges.
- Rack focus only to move attention to the next thing the voice names (signalling, T12). Not as decoration.
- The camera is smooth; hand-made things step. Never step the camera.

**Sample:** `VOXPLUS-depth` (8 s, `src/voxplus/DepthDemo.tsx`): the loom story from A01 (Berkshire 1985 letter, "$26
each"; Draper looms photo, HAER/LoC, public domain), with a dolly-in and orbit, a pick-up-and-place label, a hinged flap
on the near plane, a rack focus and a hold with drift. **Not rendered yet** (renders run on the Mac Mini):

```sh
npx remotion still src/index.ts VOXPLUS-depth out/voxplus/depth_150.png --frame=150
npx remotion render src/index.ts VOXPLUS-depth out/voxplus/depth.mp4
```

Type-checked against Remotion 4.0.529 in the cloud session; look at frames 0, 80, 120 and 200 before using it in a film.

## 4. Where the brief conflicts with standing decisions

- **Music beds.** The brief's music levels (music 15–20 dB under speech, a high-pass filter at 80–120 Hz, ducking
  release of 0.5 s or more) only matter where there is music. AK removed music from long videos on 18 Nov 2026
  (`TOOLS_RADAR.md`; the gold script says "no music under the narration"). The −16 LUFS target matches what we already
  ship. Keep paper and marker SFX sparse, about one every 10 s (Sound.tsx rule).
- **150 words a minute.** Our MiniMax voice measures 2.9 words a second, about 174 a minute (`structure_check.py`).
  The study in `docs/geo/research/GEOGRAPHY_YOUTUBE_LANDSCAPE_2026-11-05.md` puts top long-form creators at a median of
  179 (164–191). Don't slow every channel to 150. Slow down on dense data beats; hold the frame
  rather than the voice (T13: a 0.4–0.6 s pause after each key fact).
- **12 fps on a 24 fps timeline.** Our films run at 30 or 60 fps. On twos at 30 fps is 15 fps (`step(t, 2)`), which is
  what the kit uses. True 12 fps works only at 60 fps (5-frame holds). Don't use a 2.5-tick step at 30 fps: it gives an
  uneven 2-3 cadence that reads as judder.
- **Buying After Effects, GEOlayers or Cavalry.** HyperFrames and Remotion already cover the maps, terrain, collage and
  charts. A timeline tool would start a second pipeline that the agents cannot run. Skip unless one specific shot needs it.
- **Numbers in the brief that we have not checked:** "mid-rolls lift RPM by 40–60%", RPM ranges, "median effect size
  1.35 across 13 tests". Don't plan on them. The YPP change (8,000 hours or 20M Shorts views from 1 Feb 2027) is
  confirmed in `INDIA_LEDGER_FACTCHECK.md`.

## 5. Which channels use Vox (AK, 22 Nov 2026)

**Vox is used on Moat & Margin and India Ledger only.** The A/V gate, the depth kit and this note apply to those two.
The other channels (Indica Atlas, UPSC Mains, The Inner Chariot, The Inventor's Desk) keep their own looks and are not
moved to Vox; the brief's per-channel Vox suggestions for them are not adopted.

The two Vox channels must still not look like one template:

| Channel | Ground and material | Motion grammar | Depth use | Pace |
| --- | --- | --- | --- | --- |
| Moat & Margin | Tan paper desk, real filing pages, yellow highlighter (voxplus) | Push into the footnote, marker circle, stepped cut-outs | Document on z 0, clippings at −200, labels lifted | Brisk; hold 4–6 s on the key number |
| India Ledger | Ruled ledger paper, red margin, audit stamp (`il-gold-act1`) | Ledger rows that total, stamp slams, running tab | Shallow: 2–3 planes; the ledger stays readable | Conversational, family-warm |

## 6. Next steps (suggested; AK to choose)

1. Done (AK, 21–22 Nov 2026): `av_check.py` is a CLAUDE.md rule for Moat & Margin and India Ledger long scripts.
2. On the Mac Mini: render `VOXPLUS-depth` stills, judge the depth look, then use `Stage`/`Plane` in the next Moat &
   Margin collage scene in place of the hand-set `Layer depth` values.
3. Write the next Moat & Margin script in the PICTURE / SCREEN / VO / SRC blocks so the gate can read it.
