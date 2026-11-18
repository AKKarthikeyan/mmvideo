# X1 "Why Tamil Nadu gets winter monsoon rain": research dossier (4 Nov 2026, Shorts lite mode)

**Status: NOT CLEARED until verify.md says G6: PASS.** Sources: three IMD documents only (S01 IMD Chennai NE-monsoon report 2025, S02 IMD NEMSOF-2026 outlook of 1 Oct 2026, S03 IMD Chennai report 2023). All saved in `sources/` (local only).
- research_check.py `--lite --script script_v1.json` result is in the final report and in `verify.md`.

## Verdict on the premise
The pitch is mostly true but loose in two places, and the honest words are narrower.
- True: the northeast monsoon (October to December) is Tamil Nadu's chief rainy season, 48% (442.8 mm) of an annual 921.4 mm [C001, C007]; IMD says Tamil Nadu is a rain-shadow region in the southwest monsoon [C003]; winds reverse to north-easterly after the summer monsoon withdraws [C004, C011]; Bay of Bengal systems moving west add rain [C006].
- Loose: "dry in summer" is overstated, since IMD's 2023 report has June-September at about 36% (328.5 mm) of the year [C008]; "most of its rain" is wrong, since 48% is under half [C001]; "the Western Ghats cause it" is not stated in any of the three IMD documents [myths M3]; "winds reverse over the Bay of Bengal" is not what IMD says [C004].
- Dropped: Cyclone Murasu, "summer 2026 ended with a 20% deficit" and the "70-year wetting study": none appears in an IMD document we hold.

## The real story, in plain words
India's summer monsoon (June to September) brings about 75% of the country's yearly rain [C002]. Tamil Nadu, IMD says, sits in a rain shadow then [C003]. After that monsoon withdraws [C011], low-level winds over the south swing from south-westerly to north-easterly [C004], and the north-east monsoon sets in (normal onset over coastal Tamil Nadu: 20 October) [C005]. Low-pressure systems born over the Bay of Bengal and moving west or north-west add much of the rain [C006]. The result for the Tamil Nadu subdivision is 48% of the year's rain between October and December [C001]: its chief rainy season [C007].

## Fresh angles (gate G7)
G7: PASS. Verified facts that popular versions leave out or get wrong (myths.md lists what they say):
1. **IMD's own 2025 report misprints the summer share.** It says Tamil Nadu's normal June-September rain is "about 47% (428.9 mm)", but 428.9 mm is the 2025 actual October-December rain in its own Table-4, while IMD's 2023 report says about 36% (328.5 mm) [C008, C009; conflicts.md K1]. Popular explainers either call Tamil Nadu "dry" in summer or repeat the wrong figure.
2. **The winter monsoon is a "small-scale" monsoon with a big job.** IMD calls it confined to parts of southern peninsular India [S01 Background, not a spine claim] yet it brings Tamil Nadu 48% of its rain, and the same season is the main cyclone season for the North Indian Ocean [S01 Background: "primary cyclone season"; usable as a follow-up Short].
3. **The "normal" list in IMD's 2025 report is wrong in its Background paragraph** (it prints the 2025 actuals) [conflicts.md K2]: only the Table-4 normal (442.8 mm) is safe to quote.

## Hook and twist candidates (for AK to choose)
- Hook A (used in the script, F10 Paradox): "Forty-eight per cent of Tamil Nadu's yearly rain falls after the summer monsoon withdraws." [C001, C011]
- Hook B (needs a second source for the summer share, so not used): contrast India's summer monsoon with Tamil Nadu's own summer share [C002, C008].
- Twist for a follow-up Short: IMD's printed summer share contradicts itself between reports [C008, C009].

## Map and visual notes
- House outline: Natural Earth admin-0 and admin-1, India point of view (`public/geo/_shared/geo.json`). No disputed border is the subject; India's outline is drawn by the engine as standard.
- Fill Tamil Nadu state. Caption "IMD" because IMD's "Tamil Nadu" subdivision also includes Puducherry and Karaikal.
- Wind and storm arrows are illustrative and labelled so. No Western Ghats line is drawn (IMD names no cause). Do not show a rainfall map.

## What a 9-beat 85-100 word Short could safely say (verified one-sentence facts)
1. About 75% of India's yearly rain falls in the June-September southwest monsoon. [C002]
2. Tamil Nadu normally gets 48% (442.8 mm) of its 921.4 mm in October to December. [C001]
3. IMD calls Tamil Nadu a rain-shadow region during the southwest monsoon. [C003]
4. The northeast monsoon follows the withdrawal of the southwest monsoon. [C011]
5. Low-level winds reverse from south-westerly to north-easterly. [C004]
6. Normal onset of the northeast monsoon over coastal Tamil Nadu is 20 October. [C005]
7. Bay of Bengal low-pressure systems moving west or north-west contribute significantly to its rain. [C006]
8. October to December is Tamil Nadu's chief rainy season. [C007]
9. (angle) IMD's 2023 report puts Tamil Nadu's normal June-September rain at about 36% (328.5 mm) of the year. [C008]
10. (2026) IMD expects a normal October-December season over South Peninsular India (88-112% of LPA). [C010]

## Artistic-licence notes
- Arrows for the wind reversal and storm path: illustrative; labelled "illustrative" on screen.
- Fill colours (cyan, orange, green) mark the story's phases, not data classes.
