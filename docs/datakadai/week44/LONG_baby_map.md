# Long video · Thu 29 Oct 2026 · Map Deep Dive

# India Is Running Out of Babies. Here's the Map.

- **Length:** 10 to 12 min (about 1,400 words of voiceover) · 16:9 · Hindi track
- **Needs:** State (my state vs India), Moment (NFHS-6 came out in June 2026)
- **Stamp:** 🟢 OFFICIAL throughout (NFHS, MoHFW / IIPS)
- **Data status (25 Oct 2026):** NFHS-6 values now come from our checked copy of the IIPS state fact sheets,
  `public/datayt/nfhs6/nfhs6_states.json` (indicator 18, total fertility rate; read 9 Oct 2026). NFHS-4 and NFHS-5
  values are checked against the NFHS-5 fact-sheet data (github.com/pratapvardhan/NFHS-5, CC BY 4.0).
- **Manipur is not in our NFHS-6 file**, so every NFHS-6 count below is out of 35 states and UTs, not 36.
  `[VERIFY: is Manipur's NFHS-6 fact sheet published? If yes, add it and recount.]`
- **The NFHS-6 data changed the story.** The old draft said Nagaland and Jammu and Kashmir were the fastest falls. In
  NFHS-6 both went back up (Nagaland 1.7 → 2.0, J&K 1.4 → 1.8), and 16 of 35 states and UTs rose. Acts 4 and 6 are
  rewritten around that. Lines changed on 25 Oct are marked ✎.
- **Our own analysis (original data):** across the 35 states and UTs in NFHS-6, states where more women finished 10+
  years of school have lower fertility (correlation −0.36); states with more child marriage have higher fertility
  (+0.29). Both links are weaker than in NFHS-5 (−0.50 and +0.45).

## Three openings for Test & Compare

**A · Number first:** "In 2015, a woman in Bihar had 3.4 children on average. Today it's 2.7. Across most
of India, families are now smaller than the size needed to keep the population steady." ✎

**B · Question first:** "Is India running out of babies? The answer depends on which state you live in, and the
map is more surprising than you'd think."

**C · Story first:** "Your grandmother probably had five or six children. Your mother, maybe two or three. And you?
The data says India just crossed a line it may never cross back."

## Script

### Act 1 · The magic number: 2.1 (0:30 to 2:00)

**VO:** "Demographers watch one number: the total fertility rate. It's the average number of children a woman would
have in her lifetime at today's rates.
The magic line is 2.1. Two children replace the two parents. The extra 0.1 covers children who don't survive to
adulthood. Stay below 2.1 for long enough, and a population eventually stops growing, then shrinks."

**ON SCREEN:** two parent icons → two child icons + a small "0.1"; the 2.1 line drawn across the screen.

### Act 2 · India crosses the line (2:00 to 3:30)

**VO:** "In NFHS-4, in 2015-16, India's fertility rate was 2.2. Just above the line.
In NFHS-5, in 2019-21, it fell to 2.0. For the first time in the survey's history, India was below replacement.
And NFHS-6, from 2023-24, released this June: 2.0 again. India has stayed below the line." ✎

**ON SCREEN:** line chart NFHS-3 `[VERIFY: 2.7, from the NFHS-3 national report]` → NFHS-4 2.2 → NFHS-5 2.0 →
NFHS-6 2.0, the 2.1 line crossing.

**VO:** "But India isn't one number. It's 36 states and union territories, and they are living in different
demographic worlds."

### Act 3 · The map: two Indias (3:30 to 5:30)

**VO:** "Here is NFHS-6, state by state. 30 of the 35 states and union territories in the survey are now at or below
2.1. ✎
The lowest: Andaman and Nicobar, 0.9, the only part of India below one child per woman, then Sikkim, 1.0.
The highest: Bihar, 2.7, then Jharkhand, Meghalaya, Uttar Pradesh and Lakshadweep, all at 2.2." ✎

**ON SCREEN:** Map of the Day engine, 16:9 version (`DK-MAP-tfr-nfhs6-wide`), fill lowest to highest; top and
bottom lists. Manipur shown blank with the note "not in NFHS-6 release". ✎

**VO:** "Notice the pattern. Almost all of the south, the west and the hill states are well below the line. The
places still above it are Bihar, Jharkhand and Uttar Pradesh in the heartland, Meghalaya in the north-east, and the
islands of Lakshadweep. Madhya Pradesh and Rajasthan sit right on the line, at 2.1." ✎

**ON SCREEN:** highlight the above-2.1 states; label "above replacement" vs "below replacement".

### Act 4 · The fastest falls (5:30 to 7:00) ✎

**VO:** "Some states changed astonishingly fast. In just the few years between NFHS-5 and NFHS-6, Meghalaya fell
from 2.9 to 2.2. Andaman and Nicobar fell from 1.3 to 0.9. Bihar, still India's highest, fell from 3.0 to 2.7.
Arunachal Pradesh, Assam and Mizoram each dropped by 0.3.
Bihar has come a long way: 3.4 in 2015-16, 2.7 today."

**ON SCREEN:** slope chart NFHS-4 → NFHS-5 → NFHS-6 for Meghalaya, Bihar, Andaman and Nicobar, Assam.
*(NFHS-4 values for Meghalaya, Assam and Andaman and Nicobar are not in the checked table below:
`[VERIFY: add them from the NFHS-5 fact-sheet CSV, or show only NFHS-5 → NFHS-6 for those three]`.)*

### Act 5 · What goes with fewer babies? Our analysis (7:00 to 9:00) ✎

**VO:** "So what do low-fertility states have in common? We ran the numbers on all 35 states and union territories in
NFHS-6.
Where more women finished at least ten years of school, fertility tends to be lower. Where more girls marry before 18,
it tends to be higher. In Kerala, 87 % of women have ten or more years of schooling, and 3 % of young women married
before 18. In Bihar, it's 33 % and 35 %.
A word of caution: this is a pattern, not proof that one causes the other. Income, cities, health care and jobs
all move together. And the pattern is weaker than it was five years ago, which tells us schooling alone no longer
explains the map."

**ON SCREEN:** scatter plot, each dot a state: x = women with 10+ years of schooling, y = fertility rate; trend line;
Kerala and Bihar labelled; "Correlation: −0.36 (NFHS-5: −0.50)" and "Pattern, not proof" caption. Second scatter for
child marriage (+0.29; NFHS-5: +0.45).

### Act 6 · The twist (9:00 to 10:00) ✎

**VO:** "Here's what almost nobody expected. Between NFHS-4 and NFHS-5, only two states saw fertility go up: Kerala
and Tamil Nadu.
In NFHS-6, fertility went up in 16 of 35 states and union territories. Jammu and Kashmir went from 1.4 to 1.8.
Nagaland, which had fallen a full child per woman, went back up from 1.7 to 2.0. Goa and Ladakh went from 1.3 to 1.6.
And the two states that went low first? Kerala held at 1.8. Tamil Nadu slipped back to 1.7.
Is India's fall bottoming out? One survey can't tell us. The next one will."

**ON SCREEN:** risers pulsing on the map; small multiples with three survey points each for J&K, Nagaland, Kerala,
Tamil Nadu.
*Rule: only call a change a "rise" on screen when it is 0.3 or more. Rises of 0.1 (eight states) are within survey
error; say "about the same". Leave out Lakshadweep (1.4 → 2.2) and Chandigarh (1.4 → 1.8) from the spoken list: very
small samples.* `[VERIFY: check the standard errors in the NFHS-6 state reports before using "went up" for J&K and
Nagaland]`

### Act 7 · So what? (10:00 to 11:00)

**VO:** "Why does this matter to you? Fewer children today means fewer young workers in twenty years and more older
people to support. States that went low first will face that sooner. States still above the line will provide
more of India's future workforce.
Where does your state sit, and does that match what you see in your own family? Tell us in the comments.
Every number is in the Data Receipt below. And there's a new India map every day on Data Kadai."

**END SCREEN:** Saturday's quick-commerce long video + subscribe.

## Checked figures used (total fertility rate)

| State | NFHS-4 (2015-16) | NFHS-5 (2019-21) | NFHS-6 (2023-24) |
| --- | --- | --- | --- |
| India | 2.2 | 2.0 | 2.0 |
| Bihar | 3.4 | 3.0 | 2.7 |
| Meghalaya | `[VERIFY]` | 2.9 | 2.2 |
| Uttar Pradesh | | 2.4 | 2.2 |
| Jharkhand | | 2.3 | 2.2 |
| Lakshadweep | | 1.4 | 2.2 |
| Nagaland | 2.7 | 1.7 | 2.0 |
| Jammu & Kashmir | 2.0 | 1.4 | 1.8 |
| Chhattisgarh | 2.2 | 1.8 | 1.9 |
| Kerala | 1.6 | 1.8 | 1.8 |
| Tamil Nadu | 1.7 | 1.8 | 1.7 |
| Goa | | 1.3 | 1.6 |
| Ladakh | (part of J&K) | 1.3 | 1.6 |
| Sikkim | 1.2 | 1.1 | 1.0 |
| Andaman & Nicobar | `[VERIFY]` | 1.3 | 0.9 |

NFHS-6 schooling and marriage: Kerala 86.6 % women with 10+ years of school, 2.9 % of women 20-24 married before 18;
Bihar 33.1 % and 34.6 %; India 46.4 % and 20.1 %. Correlations across 35 states/UTs: −0.36 (schooling vs fertility),
+0.29 (child marriage vs fertility). NFHS-5 for comparison: −0.50 and +0.45 across 36.

Direction of change NFHS-5 → NFHS-6: 16 up, 12 down, 7 the same (35 states and UTs).

## Description sources

- NFHS-5 and NFHS-6 state fact sheets, Ministry of Health and Family Welfare and IIPS (rchiips.org/nfhs)
- NFHS-5 data in CSV: github.com/pratapvardhan/NFHS-5 (CC BY 4.0)
- Map: DataMeet India (CC BY 4.0), boundaries as per Government of India
