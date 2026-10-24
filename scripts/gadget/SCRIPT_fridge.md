# The Inventor's Desk No. 002 — The Fridge

Built 22 Oct 2026 ("Yes, make No. 002, the fridge episode"). First episode written to AK's rule "explain me like I am 5".
Layout: inside the Shorts safe box (`SAFE` in kit.tsx: 30 + 0.88x, 150 + 0.88y; AK: no empty space, margin in the same
paper colour, no border). Output `out/gadget/fridge/TheInventorsDesk-002-fridge.mp4` (+ `_phone`). Composition `GK-fridge`.

## Fact ledger (checked 22 Oct 2026; research in CHANNEL_PLAN.md)
| Line (simple wording) | What the source says | Source |
|---|---|---|
| 1833: a ship carried "a mountain of ice" from America to Calcutta | Ship Tuscany sailed 12 May 1833 from Boston with 180 tons of ice | Tudor's diary, quoted in S. Bean, "Cold Mine", American Heritage (1991) (secondary, quoting primaries) |
| The trip took four months; more than half was still ice | Arrived 10 Sep 1833 "with one hundred tons of ice" (100 of 180 = 56%) | Capt. Littlefield's record, same article |
| Wet hand + blowing feels cold; drying water takes heat away | Evaporation takes heat energy | ASME landmark brochure (Perkins); Cullen 1756 |
| 1755: a teacher in Scotland, William Cullen, made ice by letting a liquid dry up really fast | Professor of Medicine, Glasgow; ether evaporated under an air pump froze the surrounding water; read 1 May 1755, printed 1756 | Cullen, *Essays and Observations Physical and Literary* vol. 2, Edinburgh 1756, pp. 145-156 |
| 1834: Jacob Perkins patented a machine that did this again and again, in a loop | First working closed-cycle vapour-compression device, GB patent 6662 (1834); built by John Hague | ASME landmark brochure (2020) |
| Liquid in thin pipes dries up into a gas and grabs heat; a pump squeezes it hot; heat leaves at the back and it turns back to liquid | Evaporator, compressor, condenser, expansion valve | Boston University physics notes (cooling/fridge); MIT 2.972 |
| A fridge doesn't make cold, it carries heat out; that's why the back is warm | Heat dumped = heat removed + motor work (W + Qc = Qh) | Boston University physics notes |
| Einstein helped invent a fridge; the 1930 patent had no squeezing pump | US 1,781,541 "Refrigeration", Einstein & Szilard, granted 11 Nov 1930; no compressor or mechanical pump in the text | Google Patents (patent text read) |
| Godrej says it made the first Indian fridge in 1958 | Company claim | Godrej Enterprises press release |
| About 38 in every 100 homes have a fridge (cities 63, villages 25) | 37.9% of households, urban 63.4%, rural 25.2% (2019-21) | NFHS-5 India report, Table 2.11 |

**Simplifications, deliberately honest:** "dries up" = evaporates/boils; "a pump that squeezes" = compressor; "teacher" =
professor; bucket-and-boat is labelled ANALOGY on screen. **Not said:** "Einstein's fridge had no moving parts"; the
"family killed by a leak" story; "Cullen 1748"; "Perkins invented the fridge"; "Tudor brought India its first ice";
Godrej "first" without "Godrej says". **Recheck before publishing:** NFHS-6 (2023-24) may have a newer fridge figure.

## Visual sources
- Perkins machine: Frederick Bramwell's drawing, *Scientific American*, 20 Jan 1883 (Commons, public domain).
- Einstein-Szilard US 1,781,541 drawing sheet 1 (patent image, public domain).
- Everything else drawn in code (`src/gadget/fridge/art.tsx`). Music/SFX: CC0 files in `public/voxplus/audio`.
