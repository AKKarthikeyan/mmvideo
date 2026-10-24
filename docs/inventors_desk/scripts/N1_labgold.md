# N1 · Lab-Made Gold: The 2,000-Year Dream (Ep 003, Now) · APPROVED by AK 23 Oct, with the three trims and hook A

- **Status (23 Oct, 22:32):** voiced, at AK's instruction after the 22:10 MiniMax cutoff ("I accept the risk to the night jobs"). Aligned and rendered: `out/gadget/labgold/GK-labgold.mp4` (1080x1920, 98.5 s, -14.1 LUFS) plus `_phone.mp4`. The read runs 96.9 s after tightening, longer than the 85 s target. Transcript check: every difference is a number or spelling format, except "beat" heard as "beats" (likely the s-sound running into "CERN's"). Not published.
- **Trims applied:** b05 "They failed for one reason." cut; Seaborg beat cut; the mine figure is on screen only (b15). Beats renumbered b01–b16. The beat table below still shows the pre-trim numbering.
- **Length:** 274 words, about 89–93 s estimated. The real length comes from the voiced read.
- **Voice:** English_Diligent_Man. **Audience:** curious 12-year-old + parent, global. **Claim rung:** CLAIMED.
- **To finish (Mini, after 06:45 IST):**
  1. `zsh -lic 'python3 scripts/gadget/gk_voice.py src/gadget/labgold/script.json'`
  2. `~/jev_full/.stt-venv/bin/python scripts/gadget/gk_align.py src/gadget/labgold/script.json` (writes the real timing.json, which switches the voice track on)
  3. `zsh scripts/gadget/gk_render.sh labgold`

## Hook options (choose one; option A is in the draft)
- **A. Scene (in draft):** "Mercury. The silver liquid in old thermometers. In October 2026, a startup said it had turned it into real gold."
- **B. Newton first:** "Isaac Newton tried to make gold for decades. In October 2026, a startup said it finally had, from mercury." (Newton's alchemy is better documented as decades-long study than as "trying to make gold", so A is safer.)
- **C. Number first:** "Gold costs over four thousand dollars an ounce. A startup says it can make it from mercury." (Dated by the price; weaker after six months.)

## Script by beat

| Beat | Key | Voice | On screen / art | Source footer |
|---|---|---|---|---|
| **0 Hook** | b01 | Mercury. The silver liquid in old thermometers. In October twenty twenty six, a startup said it had turned it into real gold. | A thermometer bead of mercury rolls out and turns gold | Marathon Fusion on X, 21 Oct 2026 |
| | b02 | Alchemists failed at this for nearly two thousand years. So how? | An alchemist's furnace, smoke; the question as a caption | — |
| **1 Problem** | b03 | Gold is rare, and it never rusts. Every bit ever mined would fit in one cube, about twenty two metres across. | A gold cube beside a 7-storey building for scale | World Gold Council, end-2025 stocks |
| | b04 | For centuries, people tried to make it. Even Isaac Newton. | Newton at a desk, flasks; caption "~1 million words on alchemy" | Chymistry of Isaac Newton project |
| **2 Chase** | b05 | They failed for one reason. Chemistry can't turn one metal into another. | Metals mixing in a pot and staying themselves | — |
| | b06 | That takes breaking into the atom, which Ernest Rutherford first did in nineteen nineteen. | A particle hits an atom's centre; a piece flies off | Rutherford 1919 · Nobel Prize outreach |
| | b07 | In nineteen forty one, Harvard scientists hit mercury with neutrons, and got a few atoms of radioactive gold. | A few glowing gold dots; NYT-style headline "Radium-Gold" | Sherr, Bainbridge & Anderson, Phys. Rev. 60, 473 (1941) |
| | b08 | In nineteen eighty, Glenn Seaborg made gold from bismuth. His estimate: over a quadrillion dollars an ounce. | A price tag with a ridiculous row of zeros | Seaborg to AP, 1980 (via Sci. Am.) |
| | b09 | In twenty twenty five, the Large Hadron Collider team showed it makes specks of gold from lead, gone in a split second. | Two lead nuclei skim past each other; 3 protons pop off; caption "29 trillionths of a gram" | CERN / ALICE, 8 May 2025 |
| **3 Reveal** | b10 | The secret? Every element is a number: the protons in the centre of its atoms. | An atom's centre with protons counting up | — |
| | b11 | Gold is seventy nine. Mercury is eighty. Next-door neighbours. | Periodic table zooms to Au 79 / Hg 80 side by side | — |
| | b12 | Fusion fires fast neutrons into mercury. Each hit knocks a neutron out, and the atom turns unstable. | A neutron arrives, two leave; the atom wobbles | Rutkowski, Harter & Parisi, arXiv 2507.13461 |
| | b13 | Within days, a proton turns into a neutron. Eighty becomes seventy nine. Mercury becomes gold. | The counter ticks 80 → 79; the atom turns gold | Hg-197 half-life 64.1 h (same paper) |
| **4 Twist** | b14 | The catch: some of the fresh gold is radioactive. The company's own paper says it must wait almost eighteen years to be less radioactive than a banana. | A gold bar and a banana on a scale; a calendar flips 18 years | arXiv 2507.13461 §4.1.2 |
| **5 Today** | b15 | Marathon says it beat CERN's gold record by ten times. It hasn't said how much gold, and no one else has checked yet. | **CLAIMED** stamp (stamp SFX) | Marathon on X; Euronews 23 Oct 2026 |
| | b16 | A big fusion plant might make a few tonnes a year. Mines dig up about three thousand seven hundred. And no fusion plant sells power yet. | A tiny gold pile beside a mountain-sized one | arXiv 2507.13461 · World Gold Council 2025 |
| **6 Callback** | b17 | Newton chased gold with a furnace. Now someone says they've made it with fusion. If gold can be made, would it still feel like gold? | The b04 Newton drawing beside a fusion reactor; the question as a caption | — |

## Fact table (each claim checked on 23 Oct 2026)

| # | Claim in script | Verified fact | Source | Confidence |
|---|---|---|---|---|
| 1 | October 2026 startup claim | Marathon Fusion posted on X on 21 Oct 2026: "turning mercury into real, stable gold, beating CERN's record by a factor of 10". The work was done "last month". No amount, purity or data released; not independently checked. | Euronews 23 Oct 2026; Gadget Review; Startup Fortune | High (that the claim was made) |
| 2 | Nearly 2,000 years of alchemy | Western alchemy began in Hellenistic Egypt around the 1st century AD. Zosimos (~300 AD) is the first well-documented alchemist. | Science History Institute; Wikipedia | High |
| 3 | All mined gold in a ~22 m cube | ~220,000 t above ground at end of 2025; cube ~22–22.5 m per side | World Gold Council Gold Hub | High |
| 4 | Gold never rusts | Gold doesn't corrode or tarnish | Standard chemistry | High |
| 5 | Newton and alchemy | About 1 million words of alchemical manuscripts | Chymistry of Isaac Newton (Indiana); Princeton UP | High |
| 6 | Rutherford first broke into the atom in 1919 | 1919: first artificial nuclear reaction (alpha particles on nitrogen). Blackett, in Rutherford's lab, showed in 1925 that the product was oxygen. **The script avoids the oxygen claim on purpose.** | Nobel Lindau; AIP | High as worded |
| 7 | Harvard 1941, mercury → a few atoms of radioactive gold | Sherr, Bainbridge, Anderson, "Transmutation of Mercury by Fast Neutrons", Phys. Rev. 60, 473 (1941) | APS; Wikipedia (Chrysopoeia) | High |
| 8 | Seaborg 1980, bismuth → gold, > $1 quadrillion/oz | Seaborg's own estimate to AP; Bevalac at Berkeley | Scientific American; Wikipedia | High (it's his estimate, and the script says so) |
| 9 | LHC specks of gold from lead, a split second | Announced 8 May 2025. Near-miss lead collisions knock out 3 protons (82 → 79). ~86 billion gold nuclei = 29 pg in Run 2 (2015–18). The nuclei break apart a fraction of a second later. | CERN press release | High |
| 10 | Gold 79, mercury 80 | Atomic numbers | Periodic table | Certain |
| 11 | Neutron knocks a neutron out | (n,2n) on Hg-198 with 14 MeV D-T fusion neutrons gives Hg-197 | arXiv 2507.13461 | High (simplified) |
| 12 | Within days, proton → neutron, Hg → Au | Hg-197 decays by electron capture to stable Au-197; half-life 64.1 h | arXiv 2507.13461 | High |
| 13 | ~18 years to be less radioactive than a banana | Paper: 6.8 yr to reach the lowest waste class; 13.7 yr to need no radioactive label; **17.7 yr** below one banana's activity (the strictest test). The paper calls its mercury assumption conservative. | arXiv 2507.13461 §4.1.2 | High (company's own figure) |
| 14 | "Beat CERN's record by ten times" | The company's words. Coverage reads it as a production *rate*, not a total. | Euronews; Gadget Review | High as worded |
| 15 | A few tonnes a year per big plant | Paper: ~2 t per GW (thermal) per year; its 1.5 GW simulated plant made 2,909 kg in a year. Press figure "~5 t per GW of electricity" matches at ~40% efficiency. | arXiv 2507.13461; Euronews | High (simulation, not a working plant) |
| 16 | Mines ~3,700 t a year | 3,672 t mined in 2025 | World Gold Council via Euronews | High |
| 17 | No fusion plant sells power yet | No commercial fusion electricity anywhere | Euronews | High |

## Flags for AK
1. **The Newton callback (b17) simplifies.** "Newton chased gold with a furnace": his alchemy aimed at the philosopher's stone, and turning metals into gold was part of that goal. Fair for a Short, but you may prefer "Newton chased it with a furnace".
2. **The banana figure is the strictest of the paper's three standards.** The script says "almost eighteen years ... less radioactive than a banana", which is exactly what the paper says. Gentler versions: 13.7 yr (no radioactive label needed) or 6.8 yr (lowest waste class).
3. **The press's "5 tonnes per gigawatt" isn't used.** The script says "a few tonnes" to avoid the thermal-vs-electric confusion in the coverage.
4. **This breaks the format's "one technical word" rule.** The topic needs proton, neutron and fusion. *Proton* is explained in b10. *Neutron* and *fusion* get a short on-screen label in the art ("neutron: a tiny particle from the atom's centre", "fusion: squeezing atoms together, like the Sun") rather than more voice time.
5. **The question lands at ~10 s, not 6.** b01 runs about 7 s, so "So how?" comes at about 10 s. Hook B would reach the question sooner.
6. **The claim may change.** If Marathon publishes data or someone repeats the result, update b15 and the stamp (CLAIMED → PUBLISHED).

## Trims if you want ~85 s
- Cut b05's first sentence ("They failed for one reason.").
- Cut b08 (Seaborg). This loses the quadrillion joke but keeps the chase intact.
- b16: drop "Mines dig up about three thousand seven hundred" and keep the number on screen only.

## Sources
- Marathon claim: https://www.euronews.com/2026/10/23/could-lab-made-gold-crash-prices-like-diamonds-us-start-up-says-it-turned-mercury-into-gol ; https://www.gadgetreview.com/marathon-fusion-claims-mercury-to-gold-transmutation-without-disclosing-key-data ; https://startupfortune.com/marathon-fusion-says-it-turned-mercury-into-gold-no-proof-yet/
- Marathon preprint: https://arxiv.org/abs/2507.13461
- CERN / ALICE: http://home.cern/alice-detects-conversion-lead-gold-lhc
- Harvard 1941: https://journals.aps.org/pr/issues/60/7 ; https://en.wikipedia.org/wiki/Chrysopoeia
- Seaborg: https://www.scientificamerican.com/article/fact-or-fiction-lead-can-be-turned-into-gold/ ; https://en.wikipedia.org/wiki/Synthesis_of_precious_metals
- Rutherford / Blackett: https://mediatheque.lindau-nobel.org/laureates/blackett/research-profile ; https://web.lemoyne.edu/Giunta/classicalcs/ruthblacknote.html
- Alchemy origins: https://www.sciencehistory.org/distillations/magazine/the-secrets-of-alchemy
- Newton: https://press.princeton.edu/node/5578 ; https://zmescience.com/science/physics/isaac-newtons-transcribed-a-million-words-alchemy-manuscript
- Gold stocks: https://www.gold.org/goldhub/data/above-ground-stocks
