# Rimland — Indica Atlas long video (draft plan, 5 Nov 2026)

Status: script and storyboard for review. Nothing built or rendered yet. Every figure marked **VERIFY** must be
checked against a primary source before it goes on screen (repo rule: real data, source on screen, illustrative
things labelled).

**Working title:** The Ring Around the World's Biggest Landmass
**Length:** 8–10 min. **Theme:** `atlas` (dark). **Channel:** Indica Atlas.
**One-line argument:** Mackinder said the power sits in the middle of Eurasia. Spykman said it sits on the coast
around it, the Rimland. India is the Rimland's midpoint, and the Indian Ocean is in front of it.

## Script and scene plan

| # | Beat (narration gist) | Visual (sample to start from) | Data / source on screen |
| --- | --- | --- | --- |
| 1 | Hook: one landmass holds most of humanity and trade. Who controls its edges? | s07 globe, Eurasia highlighted | Population and GDP share of Eurasia — **VERIFY**, World Bank / UN WPP |
| 2 | 1904: Halford Mackinder's "Geographical Pivot of History". Heartland = the interior no navy can reach. | s11 timeline, first stop; s02 terrain for the steppe and mountain wall | Paper: Royal Geographical Society, 1904 |
| 3 | Mackinder's 1919 line: who rules East Europe commands the Heartland, who rules the Heartland commands the World-Island, who rules the World-Island commands the world. | s13 big quote, original wording below | Mackinder, *Democratic Ideals and Reality*, 1919 — check quote against the book |
| 4 | Nicholas Spykman's reply: the Rimland (Europe's coast, Middle East, South Asia, Southeast Asia, China's coast) has the people, the ports and the trade. | s07 globe, ring traced as arcs | Spykman, *The Geography of the Peace*, 1944. Ring outline is **illustrative**, label it |
| 5 | Spykman's line: who controls the Rimland rules Eurasia, and so the destinies of the world. | s13 quote | Same book, check wording |
| 6 | The Cold War as Rimland policy: containment, NATO 1949, SEATO 1954, Baghdad Pact 1955. | s11 timeline with pins on a map | Treaty dates — **VERIFY** against treaty texts |
| 7 | Where India sits: the middle of the southern Rimland, with a coastline and the Indian Ocean in front. | s15 prism map or s02 terrain, India highlighted | Coastline length and island territories — **VERIFY**, Survey of India / MHA. Use Survey of India boundaries, not the community map |
| 8 | The sea lanes: Hormuz, Bab-el-Mandeb, Malacca. Why the ocean matters more than the land border. | s06 wind and flow map for the monsoon route; s07 arcs for trade | Trade through each strait — **VERIFY**, EIA / UNCTAD. Crude imports by supplier needs commerce ministry data |
| 9 | Andaman and Nicobar: Indian territory at the mouth of Malacca. | s01 satellite before/after or s02 terrain | Sentinel-2 needs "Contains modified Copernicus Sentinel data <year>". Great Nicobar distance to Malacca — **VERIFY** |
| 10 | The other side: Chinese ports and bases around the Indian Ocean. Show what is confirmed vs reported vs contested. | s07 globe pins | Only confirmed bases (e.g. Djibouti, 2017). "String of Pearls" is a label from a 2005 consultancy report, not a Chinese policy. Say so on screen |
| 11 | Limits of the theory: air power, missiles, space, cyber and supply chains weaken geography. | s14 hand-drawn notes over a page | Opinion, label it as such |
| 12 | Close: for India the question is how to be a Rimland power with a long coastline and a land border it has to hold at the same time. End card. | s10 parallax or end card from `videos/_template` | None |

## Short cut (under 60 s)
Beats 1, 4, 7, then a one-line question: "Heartland or Rimland: where is India?" Use s07 globe throughout.

## Open items
- No narration, captions or voice-over built. Voice comes from the normal MiniMax TTS pipeline once the script is locked.
- Regional audio tracks (Tamil, Hindi) are optional after approval (`docs/AUDIO_TRACKS.md`).
- Moat & Margin rules about valuations do not apply here, but keep policy claims attributed, not asserted.
- Decide: strictly neutral on China and the US, or an explicit India-view. Default in this draft is neutral and attributed.

## Next steps once approved
1. Lock the script and verify every **VERIFY** item.
2. `python3 hyperframes/tools/hf.py sync`, copy the closest samples into new folders, change data and text.
3. `hf.py check`, `hf.py snap`, then render a silent draft to `out/hyperframes/`.
