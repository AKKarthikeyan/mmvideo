# N1 Lab-Made Gold: Bhagyaraj-method review (Mode B), 23 Oct 2026

This is the first test of the `bhagyaraj-storytelling` skill, run against the voiced 16-beat script (`src/gadget/labgold/script.json`). **Nothing is changed in the Short.** Any fix needs re-voicing.

| # | Tool | Score | Evidence | Fix |
|---|---|---|---|---|
| 1 | Paper first | 2 | The story narrates cleanly start to finish | — |
| 2 | Real seed + "Is it wrong if…?" question | 1 | The question only arrives at the end (b16 "would it still feel like gold?") | Plant it in b02 (Fix 2) |
| 3 | Stay current | 2 | The October 2026 claim is the hook | — |
| 4 | Ordinary hero | 0 | The cast is famous scientists and a company; no ordinary person | Bring in the viewer's own gold (Fix 1) |
| 5 | Other drives the story | 1 | Marathon drives the news, but passively | — |
| 6 | No villain needed | 2 | The pressure is physics itself: chemistry can't do it | — |
| 7 | Impossible domestic choice | 0 | Nobody has to choose | "Identical gold, but made: would you swap?" (Fix 1) |
| 8 | Vow / deadline | 1 | The 17.7-year wait is a real clock, but it shows up late and abstract | Turn it into a date: ~2044 (Fix 3) |
| 9 | Lie/secret, audience in on it | 1 | "Hasn't said how much gold": a real secret, used once | Mirror it with the alchemists' reputation as cheats (Fix 2) |
| 10 | Plant and payoff | 2 | Newton (b04 → b16), the thermometer bead (b01 → b12), "radioactive" (b07 → b13) | — |
| 11 | Humour is the story | 1 | The banana carries the twist, and it's the only joke | Add a second plot-moving laugh (optional) |
| 12 | Mirror | 0 | — | Ask the viewer to judge the startup the way history judged alchemists (Fix 2) |
| 13 | Object decides | 2 | The bead turning gold; the gold-vs-banana scale | — |
| 14 | Surprise route, honour values | 2 | "Real, but radioactive" is the twist; the honest CLAIMED stamp | — |
| 15 | Joy in a sad story | 2 | The tone stays playful through the caveats | — |

## Three highest-leverage fixes (written as lines)

**Fix 1: an ordinary person plus an impossible choice (tools 4, 7).**
- b03, now: "Gold is rare, and it never rusts."
- b03, new: "Gold is rare, and it never rusts. That's why families keep it for generations."
- b16, new ending: "Imagine two gold rings, identical atom for atom. One was dug from the ground, one was made in a reactor. Which one would you give to someone you love?"

This hands the viewer a domestic choice, and that question is what gets people commenting.

**Fix 2: plant the question and close with the mirror (tools 2, 9, 12).**
- b02, new: "Alchemists tried this for nearly two thousand years. Many were called cheats. So is this startup a cheat, or a scientist?"
- b14, keep, and stamp CLAIMED on: "…and no one else has checked yet." Then add: "For now, history's answer is: show us."

Now the viewer judges the startup with the same suspicion history gave alchemists, and the CLAIMED stamp becomes the verdict.

**Fix 3: make the clock concrete (tool 8).**
- b13, new: "The company's own paper says fresh lab gold must wait almost eighteen years, until it's less radioactive than a banana. Gold made today couldn't go on sale until about 2044."

A date the viewer can picture works better than a span of years. The arithmetic is 2026 + 17.7 ≈ 2044, using the paper's strictest standard; check the wording before use.

**Cost:** three edited beats, roughly the same word count. It needs a fresh MiniMax read (within 06:45–22:10) and a re-render. If you want to use the alchemists' tricks (hollow rods, gilded nails), fact-check them first.

## Applied (23 Oct, ~23:30, AK: "Apply the three Bhagyaraj fixes…")
- **Script v2** is in `src/gadget/labgold/script.json`. The voiced v1 is kept as `script_v1_voiced1023.json`.
- **Fix 2 wording changed for safety:** the script no longer asks whether "this startup [is] a cheat". It says alchemists "turned out to be tricksters", and the mirror is now "Alchemists faced one test: show us the gold." This avoids implying that a real company may be cheating. (Executed fake gold-makers: Bragadino in Munich, 1591; Honauer in Stuttgart, 1597.)
- **Fix 3 wording:** "Gold made today would pass that test around 2044". It's tied to the paper's banana standard, not to "can't be sold".
- **Offsets:** b06 is now "Physics can. In 1919, Ernest Rutherford broke into the atom." b16 is tightened.
- **Length:** 311 words, estimated ~106–110 s (v1 was 98.5 s). Over the original 85 s target.
- **New visuals:** a "tricksters / the real thing?" line in b02, a "Kept for generations" tag, the 2044 line, "the old test" line, and the closing two-rings "Mined or made?" shot. Checked on a silent draft.
- **Re-voice and render:** scheduled task `labgold-revoice-render`, 24 Oct 06:50 IST (Auto mode). It keeps the v1 render in `out/gadget/labgold/old/`.
- **Done early (23 Oct, 23:25–23:35)** at AK's instruction ("complete the voice and render"), during the night jobs' MiniMax window. v2 is voiced (raw 119.8 s, tight 111.1 s) and rendered as `out/gadget/labgold/GK-labgold.mp4` (112.7 s, -14.1 LUFS) plus `_phone.mp4`. The v1 render is kept in `out/gadget/labgold/old/`.
- **Transcript check:** the differences are number formats and homophones (mined/"mind", made/"maid"). One possible slip: "Alchemists faced" heard as "Alchemist faced". Listen at about 1:27.
- **Scheduled task** `labgold-revoice-render` is disabled. Not published.
- **FINAL (AK, 23 Oct):** "Keep the 112-second version as final." GK-labgold.mp4 (112.7 s) is the final cut. Not published.
