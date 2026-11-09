# GEO-04 P1 script: independent fact audit (gate S5), 3 Nov 2026

Auditor opened each cited passage in `sources/` (txt). Script not edited. Rows = every `say` sentence (s1, s2...) and each `cap`.
Files: kegy203 = NCERT XI Fundamentals ch.3 (printed pp.23-25); kegy204 = NCERT XI ch.4 (pp.29-30); iest102 = NCERT G9 pp.15-16; volc_text / volc_types = USGS "Volcanoes" (Tilling 1997); DTE = usgs/dynamic_tectonics, dynamic_hotspots; fs002 / fs113 = USGS fact sheets 002-97 / 113-97.
Conversions checked: 13,677 ft = 4,168.7 m OK ("more than four thousand"); 1,500 F = 815.6 C ("about eight hundred" rounds down 16 C: say "over eight hundred"); 1,200 ft = 365.8 m (say "three hundred and sixty" vs caption "~366": mismatch).

**Totals: 124 rows. PASS 90 · FIX 31 · FAIL 3.**

## b00
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 Mauna Loa, largest active volcano, lava usually gentle | FIX | volc_text l.205-206 ("world's largest active volcano", 1997 text); l.582-583 "generally non-explosive Hawaiian shield volcanoes". Superlative stated as our fact, no source named (rule 6) | "On Hawaii's Mauna Loa, which USGS calls the largest active volcano on Earth, lava usually pours out gently." |
| s2 broad mountain, gentle slopes | PASS | volc_text l.194-196 | |
| s3 1991 Pinatubo exploded | PASS | volc_text l.337-338; fs113 | |
| s4 gas high, whole world cooled | PASS | fs113 l.97-99 | |
| s5 global temps fell ~0.5 C over next two years | FIX | fs113 l.97-99: "global temperatures ... (1991 through 1993) by about 1 F (0.5 C)". But DTE l.234-236 says cooling "in some regions by as much as 0.5 C": two USGS texts differ in scope, and the ledger CONFLICT (V060) is not shown | "USGS says global temperatures dropped by about half a degree Celsius, from 1991 to 1993." |
| s6 both are openings...; the question | PASS | V001 | |
| cap "world ~0.5 C cooler, 1991-93 (USGS)" | FIX | same as s5 | "global temperatures about 0.5 C lower, 1991-93 (USGS FS 113-97)" |

## b01
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 exam asks about this | PASS | 2024_prelims_gs1-03 OCR | |
| s2 "asked which of four things come out" | FIX | OCR l.70-77: "How many of the above are products of volcanic eruptions?" options one/two/three/all four | "the Prelims paper asked how many of four things come out of a volcano." |
| s3-s4 plan | PASS | structure only | |
| s5-s6 one volcano won't fit; keep an eye on Hawaii | PASS | DTE hotspots l.1-5 (Hawaii 3,200 km from boundary) | |
| cap | PASS | OCR paper page 3 | |

## b02 (all PASS)
s1 word; s2 NCERT definition (kegy203 p.23 "gases, ashes and/or molten rock"); s3 vent itself (volc_text l.70-71); s4 usually the cone (l.68-70 "most commonly a conical hill"); s5 magma below/lava above (l.82-83); s6 Class 11 "starts moving towards the crust ... lava" (kegy203 p.23); s7 exam advice (ours, fine); cap PASS. 8 PASS.

## b03
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 NCERT lists lava flows, pyroclastic debris, bombs, ash and dust, gases ("broken rock called" gloss ours, harmless) | PASS | kegy203 p.23 | |
| s2 gases named | PASS | kegy203 p.23 | |
| s3 list 2024 question tested | PASS | OCR vs p.23 | |
| s4 by NCERT's list all four come out | PASS | OCR; p.23 | |
| s5 key not read, answer ours | PASS | V006 note | |
| s6 biggest lumps (bombs) land near vent; finest ash travels farthest | FIX | fs002 l.12 (bombs "usually fall back within 2 miles"; "wind carries the smallest ash the farthest"). Single source (V007). Placed before "USGS adds", a listener hears it as NCERT | "USGS says the biggest lumps, the bombs, usually land within about three kilometres of the vent. The finest ash rises high and travels farthest." (2 miles = 3.2 km, ours) |
| s7 more than nine-tenths of gas is water vapour | FIX | fs002 l.15 only; fs002-97 is marked superseded; fs2018-3075 landing page does not repeat it (V005 note). Both sides named, good | "An older USGS fact sheet adds a gas the textbook leaves out: more than nine-tenths of volcanic gas is plain water vapour." |
| cap USGS >90% | FIX | same | add "(older USGS sheet)" |

## b04
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 list doesn't tell why | PASS | | |
| s2 pot boiling, lid rattles | PASS (as our picture) | everyday | |
| s3 "An older NCERT book for Class 7 uses that very picture" | FAIL | gess203 pp.12-13: the lid-shaking activity illustrates EARTHQUAKES ("In the same manner, the earth vibrates when an earthquake occurs"), not volcano pressure. V069 note also says the book may be superseded and is unchecked | delete the sentence |
| s4 "Pressure builds underneath, looking for a way out" (as NCERT's point) | FAIL | not in gess203. Gas pressure is in volc_text l.120-123 (USGS) | "Steam pushes up under the lid. That is our picture, not a textbook's." |
| s5 "A volcano is a lid on a very hot pot" | FIX | stated as fact; it is an analogy | "A volcano is a bit like that lid on a hot pot." (chip ANALOGY stays) |
| cap "NCERT Class VII: the boiling pot and its rattling lid" | FAIL | same as s3 | "everyday picture: a pot with its lid rattling (our analogy)" |
Remove V069 from b04's claims.

## b05 (all PASS)
Evidence volc_text l.116-127 and DTE l.203-212: thin fluid lava, gases may escape easily (s2); thick pasty highly viscous, gases build pressure and escape with explosive violence (s3); "viscous" (s4); carbonated-drink analogy, thumb, shake, remove thumb, "miniature explosion of gas and liquid" (s5-s7). The limit (s8-s9) is ours but USGS supports it: l.118-119 "as they rise ... confining pressures are reduced and the dissolved gases are liberated". s1 PASS, cap PASS. Optional: s2 "can let" (USGS says "may escape easily"). 10 PASS.

## b06 (all PASS)
s1 PASS; s2 runny basalt spreads widely (volc_text l.197-199); s3 broad, gentle (l.194-196); s4 Mauna Loa largest of the shield volcanoes (l.205); s5 "more than four thousand metres" = 13,677 ft (l.206), conversion correct; s6 NCERT explosive only if water enters vent (kegy203 p.24; "one exception" is our gloss, acceptable); cap PASS. 7 PASS.

## b07
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 "sticky lava cannot travel far" | FIX | no source says this of composite volcanoes. USGS "too viscous to flow any great distance" (volc_text l.214-215) is about lava DOMES. NCERT p.24: cooler, more viscous lava; lava and ash accumulate "in the vicinity of the vent openings" | "But stickier lava and ash pile up close to the vent, in layers." (drop s1's "cannot travel far") |
| s2 piles up near vent, layers, ash | PASS | kegy203 p.24; volc_text l.159-160 | |
| s3 steep cone, composite or stratovolcano | PASS | l.157-160 | |
| s4 Fuji, St Helens, Pinatubo | PASS | volc_text l.162-164; DTE l.203-204 | |
| s5 "the ones that often explode" | PASS | kegy203 p.24 "often result in explosive eruptions" | |
| s6 pyroclastic flow avalanche of hot ash, rock, gas | PASS | fs002 l.21 | |
| s7 "USGS says it can reach about eight hundred degrees Celsius" | FIX | fs002 l.21 says "as hot as 1,500 F"; 800 C is our conversion (815.6 C) and rounds down | "USGS says as hot as fifteen hundred degrees Fahrenheit. That is over eight hundred Celsius." |
| cap "~800 C" | FIX | same | "up to 1,500 F (over 800 C, our conversion)" |

## b08
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 NCERT names five kinds | PASS | kegy203 p.23 | |
| s2 shield and composite | PASS | | |
| s3 caldera: empties chamber, top falls in | PASS | volc_types l.66-69 (drained lava, top collapsed); kegy203 p.24 | |
| s4 Crater Lake, ~6,800 years ago | PASS | volc_types l.66; volc_text l.181 | |
| s5 flood basalt, many flows, hundreds of km | PASS | kegy203 p.24 | |
| s6 mid-ocean ridge, lava under the sea | PASS | kegy203 p.24 | |
| s7 "USGS says about three-quarters of all lava erupted ... comes out under the oceans" | FIX | DTE l.198-201 and l.300-302: "scientists have estimated", unseen; no deep eruption observed "live" (l.302-305). One publication only (V018) | "USGS says scientists estimate that about three-quarters of the lava erupted on Earth comes out unseen under the oceans, mostly along these ridges." |
| cap "~3/4 ... (USGS)" | FIX | same | "~3/4 of erupted lava, an estimate: under the sea (USGS)" |

## b09
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 USGS counts the simplest kind, cinder cone | PASS | volc_types l.7 | |
| s2 1943, "farmer's field", Mexico, Paricutin | PASS | volc_types l.17 "on a farm near the village of Paricutin" (say "a farm") | |
| s3 "nine years ... about three hundred and sixty metres" | FIX | volc_types l.20, 26, 32 (1,200 ft; 9 years). 1,200 ft = 365.8 m; say and cap disagree. Single source (V015) | "USGS says that in nine years of eruptions it grew to about three hundred and sixty-six metres." |
| s4 magma that never reaches the surface? | PASS | loop | |
| cap "~366 m" | FIX | match say; add "one source" for reviewer | |

## b10
s1 volcanic v plutonic (kegy203 p.24) PASS; s2 slow cooling, coarser (volc_text l.109-111, USGS, not NCERT; ok) PASS; s3 "intrusive forms" PASS; s5 seen after erosion (kegy203 p.25) PASS; cap PASS.
| s4 "The biggest is a batholith: the cooled magma chamber itself, turned to granite" | FIX | kegy203 p.25: "A large body ... large domes ... cooled portion of magma chambers ... granitic bodies". "Biggest" (compared with other forms) and "chamber itself" are not stated | "One huge kind is the batholith: the cooled part of a magma chamber, a body of granite deep in the crust." |

## b11 (NCERT-only, R1 reviewer flag stands)
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 laccolith: dome, flat base, pipe from below | PASS | kegy203 p.25 | |
| s2 lapolith saucer | PASS | p.25 | |
| s3 phacolith wavy, in folded rock | PASS | p.25 | |
| s4 "A sill is a near-flat sheet between layers" | FIX | p.25: near-horizontal bodies are sheet (thin) or sill (thick); "between layers" not said | "A sill is a thick, near-flat body." |
| s5 dyke: wall, filled a crack, almost upright | PASS | p.25 | |
| s6 commonest in western Maharashtra | PASS | p.25 | |
| s7 "It says they fed the lava of the Deccan Traps" | FIX | p.25 "These are considered the feeders" | "It says they are considered the feeders of the Deccan Traps." |
| cap "...fed the Deccan Traps" | FIX | same | "...considered feeders of the Deccan Traps" |

## b12 (all PASS)
s1 volc_text l.434-435 (most of the world's active volcanoes along or near plate boundaries); s2 iest102 p.15 l.156-158; s3 iest102 p.15 l.159-161; s4 DTE l.12-13 (most active zone); s5 volc_text l.399 "more than half encircle the Pacific" (1997 text, add year on screen); s6 kegy204 pp.29-30 "rim of fire", iest102 p.16 "Ring of Fire"; cap PASS. 7 PASS.

## b13
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 switch and map join | PASS | framing | |
| s2 "USGS says most volcanoes above the sea stand near boundaries where plates meet" | FIX | DTE l.197-199: "most of the world's active above-sea volcanoes ... near convergent plate boundaries where subduction is occurring" | "USGS says most active volcanoes above the sea stand near boundaries where one plate sinks beneath another." |
| s3 St Helens, Pinatubo composite cones | PASS | DTE l.203-204 (the only place plate type is tied to cone type) | |
| s4 ridges pour out runny basalt | PASS | volc_text l.421-423 (basaltic volcanoes at ridges), l.197-198 (basalt fluid); NCERT p.24 | |
| cap "where plates meet: composite cones" | FIX | implies every meeting point | "where a plate sinks: composite cones (St Helens, Pinatubo)" |

## b14
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 remember Hawaii | PASS | | |
| s2 >3,200 km from nearest boundary | PASS | dynamic_hotspots l.4-5 | |
| s3 J. Tuzo Wilson, 1963, hotspot | PASS | l.12-14 | |
| s4 fixed hot region melts rock beneath Pacific plate | PASS | l.19-25 (Wilson's hypothesis; fine as "suggested an answer") | |
| s5 plate drifts, new island, old carried away | PASS | l.26-33 | |
| s6 "Kauai ... has rocks about five and a half million years old" | FIX | l.36-38: the OLDEST volcanic rocks on Kauai are about 5.5 Ma | "Kauai, far along the chain, has volcanic rocks as old as about five and a half million years." |
| s7 "A hotspot may also lie behind India's Deccan Traps, though that is debated" | FIX | V028 CONFLICT. Sen 2001 (l.196-201) links Deccan to Reunion plume; "considerable debate" there is about where plumes rise from (core-mantle boundary or elsewhere), not whether the link exists. The opposing view was never read | "Many geologists link India's Deccan Traps to the hotspot now under Reunion Island. How such plumes rise is still debated (Sen, 2001). We follow that story in part two." |
| s8 part two | PASS | | |
| cap "Kauai's rocks ~5.5 million years old" | FIX | same as s6 | "Kauai's oldest rocks ~5.5 million years" |

## b15
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 "It comes down to the lava. And the lava comes down to the place." | FIX | sources tie place to lava only for subduction cones (DTE l.203-206), ridge basalt (volc_text l.421-428) and Hawaii; not general (intra-continental hotspots can be explosive; not in sources, but nothing supports a universal rule) | "It comes down to the lava. And in these examples, the lava goes with the place." Cap: "the lava decides the blast; the place often decides the lava" |
| s2 runny basalt lets gas slip out | PASS | | |
| s3 "pours quietly at hotspots like Hawaii, and along the ocean ridges" | FIX | "quietly" for ridges unsupported (DTE l.302-305: no deep submarine eruption has been observed live); "hotspots" generalises from Hawaii | "It builds Hawaii's broad shields, and it pours out along the ocean ridges." |
| s4 sticky lava traps gas | PASS | | |
| s5 "builds steep composite cones where plates meet, like St Helens and Pinatubo" | FIX | DTE l.203: subduction-zone volcanoes | "...where one plate sinks beneath another, like St Helens and Pinatubo." |
| s6 magma underground, lava erupted | PASS | | |
| s7 thin lava gently; thick explodes | PASS | | |
| s8 NCERT five types | PASS | | |
| s9 intrusive forms list | PASS | kegy203 p.25 | |
| s10 "Most volcanoes sit near plate boundaries" | FIX | USGS says most ACTIVE volcanoes | "Most active volcanoes sit near plate boundaries." |
| s11 more than half the active ones ring the Pacific | PASS | volc_text l.399 | |
| s12 "Hotspots, like Hawaii's, build volcanoes far from any boundary" | FIX | DTE: Hawaii is an exception; not all hotspots lie far from boundaries (not supported either way) | "A hotspot, like Hawaii's, can build volcanoes far from any boundary." |
| cap | FIX | see s1 | |

## b16
| sentence | verdict | evidence | rewording |
|---|---|---|---|
| s1 "India's only active volcano, the lava that became the Deccan, eruptions that changed the world's weather" | FIX | V043 note: "only active" is a status at publication dates; GVP (V047) blocked, live position unchecked. Deccan: kegy203 pp.24-25 PASS. Weather: fs113 PASS | "In part two: Barren Island, which NCERT calls India's only active volcano, the lava that became the Deccan, and eruptions that changed the world's weather." |
| cap | PASS | | |

## Cross-cutting
1. FAIL rows are all b04 (V069). The Class VII activity is about earthquakes; drop NCERT attribution and V069 from b04 and the claims list.
2. Single-source facts spoken without attribution: V007 (b03), V015 (b09), V018 (b08, also on screen). Name USGS in speech; keep them on the S4 list.
3. Conflict handling: V005 named both sides (OK, but source superseded); V060 scope conflict (global v some regions) not shown; V028 debate named loosely.
4. No claim behind: plate-type to lava-type link in b13/b15 is partly in DTE (subduction = composite) and volc_text (ridge = basalt); "hotspots pour quietly" and "ridges pour quietly" have none.
5. UPSC answer key: not used; b03 says answer is ours (OK). Older Class VII book: used in b04 (FAIL).
6. 1997 USGS figures (Mauna Loa height, "more than half") are dated; show year on screen (rule 2).
