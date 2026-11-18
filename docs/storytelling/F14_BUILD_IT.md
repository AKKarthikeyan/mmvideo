# F14 · Build It: "Congratulations, you have built…" (draft v1, 15 Nov 2026)

Proposed 14th format for the Story Engine. Not yet merged into `STORY_ENGINE.md` or `SHORTS_ENGINE.md`; waits for AK's word after the first test.

Source of the pattern: a 65-second Short on Rani ki Vav that AK shared on 15 Nov 2026. We reuse the structure only. Models, look, wording and music are our own.

## Format card
- **Engine:** curiosity (what are we building?) plus a steady run of small payoffs.
- **Needs:**
  - a built thing (monument, dam, tool, machine) whose parts each exist to fix a real, verified problem;
  - 4 to 6 such problem-and-fix pairs that follow one from the other;
  - one human reason (who wanted it, and why);
  - 2 or 3 verified numbers for the end;
  - a name most viewers will know or want to know.
- **Short beats:**
  1. "If you…" opening: one action the viewer can picture, ending in the simplest version of the thing.
  2. Chain, 4 to 6 rounds: **But** (problem) → **So you** (fix) → **This is a** (name of the part).
  3. The human round: one "But" is about a person, not physics.
  4. Numbers: size, depth, count.
  5. Reframe: one line that makes the odd shape make sense.
  6. "Add a…" list: two or three small true details, quick.
  7. "Congratulations. You have built ___." The name appears here for the first time.
- **Channels:** Indica Atlas (monuments, dams, forts, stepwells, city plans), Inventor's Desk (a machine built from its problems).
- **Trap:** the chain must be the real reason each part exists. If the research only shows that a part exists, not why, it cannot be a "But / So" round. A neat invented cause is the popular version and stays quarantined.

## Rules
| # | Rule |
|---|---|
| B1 | The viewer is "you" from the first word to the last. No "they built". |
| B2 | The name of the thing is not said, shown or put in the first caption until the last beat. The title and thumbnail may tease, not tell. |
| B3 | One problem per round, one fix per round, one new term per round. |
| B4 | Each round runs 7 to 9 seconds. A round that needs more is two rounds or is cut. |
| B5 | The same three words open each step every time: But, So, This is. The repeat is the rhythm. |
| B6 | Every problem is drawn (arrow, dashed line, slide, crack), not only spoken. |
| B7 | Every fix is shown being built, piece by piece, while the line is spoken. |
| B8 | Every "This is a…" gets the same look: scene dims, the part glows, a label appears. |
| B9 | One scene for the whole video. It only grows. The camera moves; it does not cut away, except once for the human round. |
| B10 | Numbers count up on screen (ruler, level markers, year counter). At most three numbers. |
| B11 | The last line plus title card take 4 to 5 seconds, with place and date under the name. |

## Timing and words
- Length: 50 to 65 seconds. This is longer than the 15 to 35 second loop rule (1 Oct); the format needs at least four rounds, so it sits in the 30 to 60 second band of the Shorts Engine. AK to confirm the exception.
- Words: 125 to 150 at our voice speed. The reference ran about 150 words in 65 seconds.
- Captions: two or three words at a time, lower third, the new term in the accent colour.

| Time | Beat |
|---|---|
| 0–5 s | "If you…" opening |
| 5–40 s | 4 or 5 rounds of But / So / This is (one is the human round) |
| 40–47 s | Numbers |
| 47–53 s | Reframe |
| 53–60 s | "Add a…" list |
| 60–65 s | Congratulations + name card |

## Research needs (on top of the Indica rules)
- Each round is a spine claim: the problem, the fix and the term all need a source that states the **purpose** of the part.
- Every on-screen number is a measurement under G2.
- Shorts rule still applies: 2 to 3 original sources.

## Visual build
The reference uses a 3D cutaway. Our stack is Remotion with Rough.js. Two ways to do it:
1. **Hand-drawn cutaway (recommended for the test):** a 2D cross-section that grows layer by layer in our own ink style. Fits the current kit and looks like us, not like the reference.
2. **3D cutaway:** needs a new toolchain (Blender or Three.js in Remotion). Only worth it if the test Short does well.

## Gate (add to the Shorts gate)
- [ ] Name held back until the last beat (B2).
- [ ] Every round has a sourced purpose, not just a sourced part.
- [ ] Each round has a drawn problem, a built fix and a label.
- [ ] No more than three numbers.
- [ ] Words within 125 to 150.
