G6: PASS

## Round 3 (13 Nov 2026)

Confirmed: o075 narration, captions ("all-India average" / "over one month") and the drop_mandi description (period not stated) now match B-C24; ch 6 title is "Cheap, then dear"; the o070 pin is Jaipur (in the Dar et al. list; the one remaining Chandigarh is the o047 rail route, which PIB lists). o031 reads "A clock of about six months". Advisory only: storyboard o025 title still says "A six-month clock" (approximate, not wrong). No FIX left.

---

## Round 2 (script v2 + storyboard.json + figures.json, 13 Nov 2026)

Round 1's 15 fixes are all in v2 and read correctly. Checked only what changed, plus every on-screen string. Three items still need FIX; G6 becomes PASS when they are changed.

| Item | Verdict | Reason | Suggested wording |
|---|---|---|---|
| o075 (narration) and storyboard o075 captions "in one month" / "in the same month" | FIX | PIB (B02) gives the 39% fall in the all-India weighted average modal price with no period; only the retail 10% is "over the past one month". The same PIB sentence says current mandi prices were still above the same period of earlier years. figures.json meta.on_claims drop_mandi ("over the month to 21 Mar 2025") repeats the error. | In March twenty twenty-five, as the new crop came in, the government said mandi prices across India had fallen thirty-nine percent. Shop prices fell ten percent over the month. Captions: "mandi prices" (no period), "shop prices, over one month". Fix the drop_mandi description. |
| Storyboard o072 title "Too cheap, too dear" | FIX | "Too cheap" is the same unsupported framing fixed in round 1 (no claim on farm costs or farmer income). | "Cheap, then dear" |
| Storyboard o070 pins | FIX | Chandigarh is not among the 28 centres (Dar et al. footnote 15 lists Amritsar, Delhi, Hisar, Kanpur, Karnal, Lucknow, Ludhiana, Mandi, Shimla, Ahmedabad, Bhopal, Indore, Jaipur, Jodhpur, Mumbai, Nagpur, Panjim, Rajkot, Bhubaneswar, Cuttack, Guwahati, Kolkata, Patna, Ernakulam, Bangalore, Chennai, Hyderabad, Vijayawada). The other 11 pins are in the list. | Replace Chandigarh with Amritsar or Jaipur. |
| o036, o076 (farmer's choice) | PASS | Explicit inference from B-C22 ("tend to fall", prices rise as stocks deplete) and A-C24 (heap shrinks); hedged by "tend to" and "hope". Not a sourced claim about what farmers do. | |
| o031 "A six-month clock", chapter title | PASS (advisory) | ICAR: rabi harvest end March to May, stock lasts to October-November: about five to eight months. "About six months" is safer, but the figure is approximate, not wrong. | |
| o047 "more than seven times the year before" | PASS | 88,000 / 12,000 = 7.33 (both "around/nearly"). | |
| o015 China "edges just ahead" | PASS | FAO 2024: China 24.284 Mt vs India 24.267 Mt (E-flagged for China). | |
| o071 "trade held in a few hands" | PASS (advisory) | Matches the paper's premise; the collusion link is omitted but the hedge "only suggestive" is kept. | |
| o078 | PASS | B-C23 (Lok Sabha answer): buffer stocks "to tackle the volatility in prices". | |
| o080 | PASS | Logic of a ban; B-C10 gives the stated aim. | |
| o082-o086 montage, ch 6 last line | PASS | Only repeats cited claims; no new facts. | |
| Storyboard source strings | PASS | Charaka "1949 translation" is on the wisdomlib page; "PIB, 22 Mar 2025" is B02's date; "customs notices not searched" matches B-C16; the NHB 2016-17 vintage is shown on the season slices (advisory: slices show 65.4% rabi next to ICAR's "about 60%"; the source line names both). |
| figures.json values | PASS | All values re-checked against claims (incl. UP 765.95/44.58 and TN 416.78/43.38 in A01); claim mapping correct except the drop_mandi description above. |

---

# G6 independent verification, ON01 Onion Paradox (verifier, 13 Nov 2026), script v1

Method: every claim cited by the script (about 55 claims, all spine ones included) had every `quote` searched as a substring in the saved source copy (script, after whitespace normalisation): 0 not found. Each quote was then read against the claim and the beat. Live re-opens: six PIB pages (2303587, 1985229, 2114060, 2093755, 2241379, 2271770) re-fetched and the numbers re-found (14/86 rakes, Rs 37.87, 2.00 LMT, 307.37/307.67/242.67, Rs 1330/qtl, 4.7 LMT, Rs 2,833, 8 Dec to 31 Mar). DGFT's PDF host returns 403, so notices were read from the saved copies and the saved list pages (B15/B16). Arithmetic re-done: state shares (MH 49.39% area, 44.03% production; MP 14.43; KA 8.37; top-3 = 20,576.83 = 66.83%), 1,547,940 / 30,737,000 = 5.04%, 1330/100 = 13.3, 470,000, haversine from the saved Nominatim coordinates (Delhi 988.7, Chennai 1015.2, Kolkata 1487.0, Guwahati 1910.2, Nashik 49.0 km, all match distances_A.txt), FAO India 30.208 Mt vs China 24.300 Mt for 2023 (India first), Bangladesh first by quantity in FY23-24 (724,492) and FY24-25. Non-spine claims cited were all re-read (more than one in three). Findings: sources and arithmetic hold. The problems are in the wording of 14 beats (overstated, a hedge dropped, or a fact with no claim).

G6 becomes PASS when the FIX wordings (or equivalents) go into scripts/indica_atlas_v1.json and the beats are re-checked.

## Beats

| Beat | Verdict | Reason | Suggested wording |
|---|---|---|---|
| o001 | FIX | "near Nashik" is in no claim; A-C19 only gives April as rabi harvest. A-C04 supports Maharashtra. | April, in Maharashtra, in western India. A farmer pulls up an onion. |
| o002-o004 | PASS | B-C02 (ban 8 Dec 2023), B-C10 (govt: availability for domestic consumers at affordable prices), B-C22 (PSF 2015 guidelines, onion and potato). | |
| o005 | FIX | "too cheap for the family who grows it" is unsupported: no claim on farm costs or farmer income, and PIB (B-C24) says March 2025 mandi prices were above the same weeks of earlier years. B-C22 supports only the harvest-fall / stock-depletion rise. | So the same bulb can be cheap in the market at harvest, and dearer in the shops months later. Within one crop year. |
| o006, o008, o012, o015, o022, o053 | PASS | Framing or question; no checkable fact. | |
| o007 | PASS | Sources named are the ones used. | |
| o009 | PASS | C-C21 verse 27.175 quote exact ("good adjuvant for food"). Text not dated, and "old" is all the line says. | |
| o010 | FIX | Source is a Jain community website (jainworld.com), not a Jain text; it says "many Jains ... avoid anything grown underground ... unnecessary death of the whole plant", "pulling up a root" is our gloss. C-C18 itself says UPGRADE NEEDED. | A Jain community website explains that anything grown underground, onion included, means the death of the whole plant and many tiny lives in the soil. So many Jains avoid it, some more strictly than others. |
| o011 | PASS | "In some Hindu traditions" fits C-C15/16 (a review citing Desika's Ahara Niyama; Sanskrit not read). Hedge is enough. | |
| o013 | PASS | A-C02 final 30.767 Mt ("nearly thirty-one"); A-C01 3rd advance 30.789 also fits. | |
| o014 | FIX | A-C32 is FAO "onions and shallots, dry", not all onions. FAO's 2024 data (matches India's 2023-24) has China 24.284 Mt just ahead of India 24.267, which the line omits; the 2023 claim is true but selective. | By the count of the UN's food agency, India grew more dry onions than any other country in twenty twenty-three. In its twenty twenty-four figures, China edges ahead. |
| o016-o018 | PASS | 44.0%, 49.4% ("almost half"), 66.8% all re-computed. Maharashtra shares are 3rd advance estimates; final total differs by 0.02 Mt. | |
| o019 | PASS | MP 20.4 and Gujarat 23.4 t/ha vs Maharashtra 13.9; A-C04 area share backs "plants so much". | |
| o020 | PASS | "India eats onions everywhere" is common framing, not a figure. | |
| o021 | FIX | A-C28 says Lasalgaon (in Nashik district) is a source market and key mandi. No claim says Nashik is "the heart" of Maharashtra's onion output. | And in that state, Nashik district holds Lasalgaon, a market the government calls a key mandi. |
| o023-o025 | PASS | A-C19 (NHB 2016-17 table 1.1 seasons and months). Vintage is 2017; no figures from it are narrated. | |
| o026 | PASS | ICAR page says "60%"; "about" and "ICAR says" are right. | |
| o027 | FIX | ICAR says rabi reaches markets March to June; harvest end March to May. That is months, not "a few weeks". | So most of the year's onions arrive in a few months of spring. And they have to last. |
| o028 | PASS | Ventilated stores: A-C24 and NHRDF conventional structures. | |
| o029 | FIX | NHRDF says temperature and humidity affect weight loss, respiration, sprouting, rotting; "heat and damp" is not in it (it says 10-15 C breaks dormancy). | And a stored onion is still alive. It breathes and loses water. Temperature and humidity decide how fast it rots or sprouts. |
| o030 | PASS | ICAR: "30-40% of the crop gets lost during the storage". | |
| o031 | PASS | Table "Total loss (%)" after 120 days: ventilated 54.89. Advisory: the page promotes ICAR's own patented design and gives no trial year, so "in its own trial" is better as "in an ICAR trial". | |
| o032 | PASS | "sprouting immediately after removal from cold storage" quoted; cold 5.00% vs 54.89% loss. | |
| o033, o034 | PASS | A-C22 gap Oct-Dec; B-C10 delayed kharif cited by the government. | |
| o035 | PASS | A-C28. | |
| o036, o037 | PASS | L-C01: APMC home page has no "largest" claim (re-grepped). Wording "we did not find" is correct. | |
| o038 | PASS | 989 / 1487 / 1910 km re-computed; "about / nearly / about" fit. Straight-line is said. | |
| o039, o040 | PASS | PIB 26 Aug 2026 (re-opened live): 14 rakes, ~12,000 MT, five cities in 2024-25; 86 rakes, ~88,000 MT, 16 cities in 2025-26. | |
| o041 | FIX | PIB says the Rs 35 sale "is to be launched" (not begun). The Rs 37.87 is an "All-India Average Monthly Retail Price as on 26.08.2026", not "that week". Rs 35 was also used Sept-Dec 2024 (B08). | In August twenty twenty-six the government announced it would sell onions it had bought and stored at thirty-five rupees a kilo. Its own monthly average retail price, as of the twenty-sixth, was about thirty-eight. |
| o042 | PASS | Fair summary of B-C18/19. | |
| o043 | PASS | 1,547,940 t (APEDA page 15,47,940.11 and portal sum agree); FY2025-26 may be provisional. | |
| o044 | PASS | Malaysia 298k, UAE 296k, Sri Lanka 271k, Nepal 158k, Bangladesh 87k are the top five by quantity. | |
| o045 | PASS | 5.04%; export year (FY) and crop year (2nd advance) differ slightly, "about" covers it. | |
| o046, o047 | PASS | Notif. 42/2023 (28 Oct, MEP $800); 49/2023 (8 Dec). | |
| o048 | PASS | B-C03 permission "at their Government's request"; 50,000 MT Bangladesh. Note OCR date garbled; APEDA list gives 1 Mar 2024. | |
| o049 | PASS | 10/2024-25 of 4 May 2024: MEP $550; PIB B08: 40% duty from 4 May. | |
| o050 | PASS | 28/2024-25 of 13 Sep 2024 (MEP removed); PIB B08 duty 20% from 13 Sep; B02 duty nil from 1 Apr 2025. | |
| o051 | FIX | B-C16 is absence evidence: DGFT's list (first page, to 10 Nov 2026) and APEDA's mirror show no onion notice after 13 Sep 2024. "Since" is unclear, and CBIC customs notices were not searched. | In the government's trade-notice lists, which we checked up to November twenty twenty-six, no onion notice appears after September twenty twenty-four. We did not search the customs duty notices one by one. |
| o052 | PASS | 724,492 t (FY23-24, first by quantity), 86,688 t (FY25-26); "does not say why" honours the B-C14 note. | |
| o054 | PASS | Framing; the 1998 story is hedged in o058. | |
| o055 | PASS | Business Standard 17 Aug 1998 (period newspaper, P3): minister "directed the commerce secretary to impose a temporary ban"; imports considered. "Ordered" is slightly stronger than "directed"; consider "directed". | |
| o056 | PASS | Dar et al: assembly election "later that year". No exact poll date is claimed. | |
| o057 | PASS | ECI 1993: BJP 49/70; ECI 1998: INC 52, BJP 15. | |
| o058 | FIX | The paper does not itself say onions defeated the BJP: it says "it is argued that" the defeat was "partly due to a spike in vegetable prices, especially onions", and that "most accounts" blame onions. Also the authors are one economist and two political scientists, not "three economists". | A study by three researchers notes that the defeat is often put down, partly, to onion prices. But an election has many causes, and no record we read can measure the onion's share. So the third thing you may have heard is only half true. |
| o059 | PASS | 16 items, 28 cities, 1993-2012, onion only. | |
| o060 | FIX | The authors' explanation is incumbents colluding with a few large onion traders (trader cartels), called "suggestive"; "a trade concentrated in a few markets" drops the collusion. | The authors suggest governments may collude with a few big traders. They call that evidence only suggestive. |
| o061 | FIX | Same issue as o005: "too cheap" for the farmer is unsupported. | So, back to the question from the start. How can the onion swing from cheap at harvest to dear in the shops within one year? |
| o062 | FIX | "floods the markets in a few weeks": see o027. | In spring, the rabi harvest floods the markets over a few months. The price fund's own rules say a steep fall at harvest time is normal. |
| o063 | FIX | B-C24 is one day, 21 March 2025, and a modal price; the same PIB text says mandi prices were above the same period of earlier years and fell 39% in a month. "Usual price in March" drops that. | On twenty-first March twenty twenty-five, the most common price at Lasalgaon's auction was one thousand three hundred and thirty rupees a quintal, about thirteen rupees a kilo. The government said that was down thirty-nine percent in a month. |
| o064 | PASS | "Loses weight" is in NHRDF; "every week" is a mild extrapolation. | |
| o065 | PASS | B-C22 plus B-C10; inference ("pays") is flagged by "if". | |
| o066 | PASS | 4.7 LMT = 470,000 t (Rabi-2024), "about" fine. | |
| o067 | FIX | States who gains and loses from each tool; no claim supports it, and it is analysis, not record. | Each tool pulls two ways. What helps the family can hurt the farmer, and what helps the farmer can cost the family. (or cut the line) |
| o068-o069 | PASS | Montage of earlier cited claims. | |
| o070 | FIX | "a field near Nashik" repeats the o001 gap. | ... one onion pulled from a field in Maharashtra in April lands in a pan in a city kitchen. |
| o071 | PASS | Conclusion. | |

## Claims changed or needing metadata fixes

| Claim | Change | Why |
|---|---|---|
| A-C16 | Changed in claims.jsonl and claims_A.jsonl: 20577.06 -> 20576.83 th t; top-4 75.0% -> 75.1%; top-5 80.1% -> 80.2% | Re-added: 13558.00 + 4443.22 + 2575.61 = 20576.83; 66.8% unchanged. |
| A-C32 | Suggest adding to the claim: item is "dry" onions; FAO 2024 has China ahead (already in notes) | Needed for o014 wording. |
| B-C16 | Keep spine true but note scope: list pages only, CBIC notices not searched | o051 wording. |
| B-C24 | Add to notes: PIB says mandi prices were above corresponding level of previous years | Needed for o063. |
| B-C25 | Locator: "All-India Average Monthly Retail Price as on 26.08.2026" | o041 ("that week" is wrong). |
| B-C19 | Quote: "is to be launched" (not yet begun) | o041. |
| C-C10 | Add: "it is argued" and "most accounts" are the authors reporting others; own words "partly due to a spike in vegetable prices" | o058. |
| C-C06 / C-C08 | Authors: one economist (Dar, GWU), two political scientists (Gupta, Verma, UC Berkeley) | o058 "economists". |
| C-C18 | Source is a Jain community website, P4 | o010. |
| Missing claims | A claim for "Nashik district is the heart of onion output" does not exist; none needed if o021 is reworded | o021. |
