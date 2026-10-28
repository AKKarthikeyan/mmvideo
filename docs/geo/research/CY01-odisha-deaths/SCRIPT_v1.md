# CY01 · Odisha cyclone deaths · script v1 (27 Oct 2026)

**Status: DRAFT for AK's review. Not voiced, not rendered, not posted.** Machine-readable copy: `script_v1.json`
(`python3 docs/inventors_desk/scripts/research_check.py docs/geo/research/CY01-odisha-deaths --script docs/geo/research/CY01-odisha-deaths/script_v1.json` passes).
Research: `dossier.md`, cleared by G6 round 2 (`verify.md`).

**Working title (AK's):** How Odisha cut cyclone deaths from ~10,000 to under 100
**Format:** F10 Paradox (Then-and-Now flavour). None of the 12 Indica Atlas engines (G1–G12) fits cleanly; G8 Then vs Now is the nearest. AK may want to name this engine.
**Length:** 93 spoken words, about 30–32 s at Week 1's pace (2.9–3.4 words a second, measured on whole videos). Check the rendered length; trim if over 35 s.

## Script

| # | Move | Spoken line (numbers in words) | On-screen keywords | Claims |
|---|---|---|---|---|
| b1 | M1 Hook | In nineteen ninety-nine, one cyclone killed almost ten thousand people in Odisha. | Odisha, 1999: 9,887 dead | C001, C002 |
| b2 | M2 Ground | Most drowned, as the sea surged far inland. | Most deaths: the sea surge | C005, C006 |
| b3 | M3 Push | Two months later, Odisha set up its own disaster authority. | Dec 1999: disaster authority set up | C001, C011 |
| b4 | M3 Push | It built hundreds of cyclone shelters. | Hundreds of cyclone shelters | C026, C040, C041 |
| b5 | M3 Push | In twenty thirteen, Phailin struck, the strongest to hit India since. | 2013: Phailin | C013, C014 |
| b6 | M3 Push | The order: zero casualties. Nearly a million people were moved out of its way. | Order: ZERO CASUALTY · 9.84 lakh moved | C018, C020 |
| b7 | M4 Turn (peak, about 22 s) | Twenty-one died in the storm. | Phailin: 21 dead | C014, C015 |
| b8 | M5 Echo | Almost ten thousand, then twenty-one. But the floods that followed killed more than the storm. | 9,887 → 21 · floods killed more | C002, C015, C016 |
| b9 | M5 Echo | Odisha outran the sea. Can it outrun the floods? | Outran the sea. The floods? | C016 |

Pauses: 0.3–0.5 s after each fact, 0.7 s before and after b7, 1 s hold on b9 (the loop).

**Retell in three sentences (S11):** In 1999 the sea killed almost ten thousand in Odisha. The state built shelters and ordered zero casualties, so when the strongest storm since hit in 2013, nearly a million moved and twenty-one died. But the floods afterwards killed more than the storm, so the next test is the water.

## Why this shape (S2)
- **Research signal:** two true facts that clash (9,887 dead vs 21 for the strongest storm since), plus a verified hidden factor (an authority, shelters, and moving people).
- **Honest by design:** "weaker storm" is never claimed. IMD's own reports disagree on the 1999 wind (K15), so the script says only "the strongest to hit India since" (C014). The comparison's fairness (pressure and surge, not wind) sits in the claim notes for the pinned comment.
- **The floods line is the fresh angle (G7):** the usual "Odisha model" story stops at the number 21. C016 says the floods that followed killed more than the storm, and C032 (Titli) shows what still goes wrong.

## Story gates (S1–S13) and Shorts gates (SH1–SH11)

| Gate | Result | Note |
|---|---|---|
| S1 Facts | PASS | `research_check.py --script`: every line carries claim IDs; no hedged or unverified claim is narrated |
| S2 Format | PASS | F10 Paradox; signal above |
| S3 Question / SH1 | PASS | Implied by 4.6 s: "how did it stop?" The title card carries the promise; the first line pays it with the 9,887 |
| S4 Prime | PASS | M1–M2 give the stake before the question; globe shows Odisha on India's east coast (picture, not voice) |
| S5 Resolve / SH9 | PASS | M5 repeats M1's "almost ten thousand", then "twenty-one"; the new question (floods) is the comment prompt |
| S6 Peak | PASS | b7 at about 22 s of 32 |
| S7 End | PASS | Callback to M1, then a closing question |
| S8 Screen text | PASS | Keywords and numbers only |
| S9 Numbers / SH7 | WATCH | Three distinct numbers (about ten thousand, a million, twenty-one) plus the quoted order "zero". The Shorts Engine ceiling for exactly 30 s is 2. At 93 words (AK's 85–100 range, above the Engine's 65–80) this sits between the 30 s and 45 s tiers. If AK wants it strict, drop "Nearly a million" from the voice and keep "9.84 lakh" on screen |
| S10 Hedges | PASS | No hedged claim is used (C008, C009, C010, C059, C046 left out) |
| S11 Retell | PASS | Three sentences above |
| S12 Audience | PASS | No "mysterious India", no side-taking, no names, no party or minister credited. Global viewer: "Odisha" is located on the globe; "lakh" is paired with "nearly a million" |
| S13 Review | DONE | Notes below |
| SH2 Words | PASS | 93 (AK 85–100) |
| SH3 One "but" | PASS | One "But" (b8). b5 and b6 are "then/so" steps |
| SH4 But/so | PASS | b2 because of b1; b3 so; b4 so; b5 test; b6 so; b7 result; b8 but |
| SH5 / SH6 | PASS | Setting by globe and state outline; jumps carry "Two months later" and "In twenty thirteen" |
| SH8 Plant/payoff | PASS | "the sea" (b2) pays off in b9; "almost ten thousand" (b1) in b8; shelters (b4) and the order (b6) in b7 |
| SH10 Stands alone | PASS | |
| SH11 Audio | n/a | Under 60 s |

### S13 notes
**Bhagyaraj pass (heart, plants and payoffs).**
- *No invented person.* Nonfiction rule: find a real vow instead. The real one is the Collectors' order "to ensure ZERO casualty" (C020), now in b6. It is the vow that makes b7 land. The twist is that "zero casualty" is an order, not a record: Phailin killed 21, and only the much weaker Dana (2024) reached zero (C037).
- *Plants:* sea (b2) → "outran the sea" (b9); shelters (b4) → the 21 (b7); ten thousand (b1) → b8.
- *Cut:* village sirens (C043), the weakest link in the chain. Not lost: it is a seed for a follow-up Short.
- *Not done:* a named person or a quote. None of the research gives one that is safe to dramatise, and the Titli dead are listed by name in the source, so no names are shown.

**Nolan pass (structure and the turn).**
- *Hairpin:* b8 rewinds to b1's "almost ten thousand" before the new fact. b9 closes on the sea from b2.
- *Pledge → turn → prestige:* pledge = almost ten thousand dead to the sea; turn = 21 despite the strongest storm since; prestige = the floods killed more than the storm. The floods are a fair-play surprise only if the picture plants water early: show floodwater or rain bands in the b2 and b5 map shots (artistic, tagged).
- *Followability:* one idea per beat, linear order, no cross-cutting.
- *Risk:* b7 is only four words. Do not rush it: hold the "21" on screen for the full pause.

## Visual brief (for the scene spec; engine `src/geo`, premium theme)
- **Map:** the Odisha coast on the globe-to-map hand-off, official India outline only. No borders drawn beyond the state outline (C049 notes).
- **Pins (C049):** 1999 "near Paradip" (use the IMD track point, not a landfall point); Phailin 19.20N 84.90E near Gopalpur. Highlight Jagatsinghpur for the 8,119 (C003, C048) only if there is room; it is not in the voice.
- **Counters:** 9,887 → 21 on one shared bar so the drop is felt (T15). Show 9.84 lakh as a dot swarm moving inland, not a number alone.
- **Artist tags:** storm tracks, floodwater, and the shelter icons are `artistic`; they must follow the IMD tables and never imply a shelter count for a specific storm.
- **Safe zones:** nothing under the caption bar or the right-hand buttons.
- **Credit line (pinned comment, not voiced):** the Odisha government and OSDMA, IMD, and the people who moved; no Chief Minister or party.

## Open items for AK (nothing here blocks the draft)
1. **Taste:** the engine name, the closing question, and whether to keep three numbers (S9 above).
2. **Timing:** IMD's 27 Oct 2026 release warns of VSCS "Arnab" for Andhra Pradesh and south Odisha on 28 Oct (C052). Do not post while that storm is live.
3. **Voice:** MiniMax `English_Diligent_Man`, speed 1, daytime window 06:45–22:10 IST. "Phailin" (said "pie-LEEN") and "Odisha" have no verified pronunciation source yet; listen before approving. Not run: nothing has been voiced.
4. **Evidence gaps that stay hedged and out of the script:** the 1999 evacuation and shelter numbers (one paper only); Fani deaths by cause; Gajapati's terrain.
5. **Minor ledger fixes from the verifier (non-blocking):** C026 and C037 → VERIFIED-P; C059 locator "sec. 5"; "952 hPa an hour or two before landfall" wording in the dossier. Not applied, so the ledger the verifier signed stays untouched.
6. **YouTube:** narration is an AI voice. Set "Altered or synthetic content: Yes".

## Build status (27 Oct 2026, 23:30 IST)
- **Not voiced, not rendered.** The voice window (06:45–22:10 IST) was closed. Run `scripts/geo/run_cy01.sh` from the repo root on the Mini in the window: it voices (MiniMax `English_Diligent_Man`, via `zsh -lic`), checks the length, renders to `out/geo/cyclone/cy01odisha.mp4`, and builds a frame sheet. It refuses outside the window and never posts.
- **Built:** beats `scripts/geo/cyclone.py`; scene `src/geo/cyclone/odisha.ts` (registered in `src/geo/GeoRoot.tsx` as `GEO-cy01odisha`). Engine change: `bars` values now print with a thousands separator (`GeoShort.tsx`).
- **Preview frames** were rendered from ESTIMATED timings and fixed for overlaps. `public/geo/cy01odisha/data.json` is a placeholder (marked) that voicing overwrites. After voicing, re-check b6: "ZERO CASUALTY" leaves 2.8 s before the end of b6, tuned to the estimate.
