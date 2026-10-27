# pp118 · India 118/0 in six overs: dossier (27 Oct 2026)

**AK's ask (27 Oct 2026):**
- "India 118/0 in 6 Overs: The Data Behind India's Fastest-Ever T20I Powerplay. Prepare video for tonight's posting with
  Title, Description, thumbnail."
- Then: "Write research and script as per our research."

**Rules:** `docs/datakadai/RESEARCH_RULES.md` v1. How a cricket match maps onto the tiers is in `search_log.md`:
- **Tier 1:** the boards (BCCI, NZC) and the ICC.
- **Named compiler:** ESPNcricinfo, which goes on screen.

## What the data says, in plain words
1. **The match.** In Wellington on 27 Oct 2026 (Hnry Stadium, 3rd T20I of five), New Zealand made 198 for 3 [C04, C16].
2. **India's powerplay.** India were 118 for 0 after the six-over powerplay [C01]. The overs went 26, 17, 21, 20, 16, 18
   [C02], and the first over went for 26 off Jacob Duffy [C03].
3. **The record.** ESPNcricinfo calls 118/0 "a T20I record" for a powerplay [C09]. The two marks below it were:
   - Romania's 116/0 (2021), from a chase that was already won after 5.4 overs [C10];
   - Australia's full powerplay of 113/1 (2024) [C11].
4. **Our finding (G7).** On the same ground, New Zealand's powerplay was 58 for 1 [C05]: India made double [C07].
   New Zealand were 113 after 11 overs and 123 after 12 [C06], so they needed 12 overs to pass what India made in six
   [C08]. No report we read carried this comparison (myths.md).
5. **The batters.** Abhishek Sharma made 113 off 38 [C12], with his hundred off 35 balls [C18]. Vaibhav Sooryavanshi
   made 45 off 19 [C13]. The stand was 133, and the first wicket fell in the 8th over [C15].
6. **The result.** India won by 6 wickets in 13.2 overs, with 40 balls to spare [C14], and lead the series 3-0 [C19].

**Not said anywhere, because no table supports it:**
- how many sixes and fours came inside the powerplay;
- that Duffy's over was the most expensive ever by a full member;
- India's earlier best powerplay;
- any "fastest ever" claim beyond what Cricinfo states.

## Script (as voiced, 31.4 s, MiniMax English_Diligent_Man)
| # | Time | Beat | Voice | On screen | Claims |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.0–5.8 s | spot | One hundred eighteen in six overs. No wicket. A T-twenty record. | 118/0 / in six overs. / A T20I record. | C01, C09 |
| 2 | 5.8–9.7 s | fact | Twenty-six came off the very first over. | OVER BY OVER · WELLINGTON · India · 26 runs off the very first over · Chasing 199 in Wellington. · bars: Over 1 26, Over 2 17, Over 3 21, Over 4 20, Over 5 16, Over 6 18 | C04, C02, C03 |
| 3 | 9.7–13.5 s | fact | New Zealand made fifty-eight. India made double. | AFTER SIX OVERS · Same ground · 58 New Zealand's powerplay, same ground · India's was double. · bars: India 118, New Zealand 58 | C05, C01, C07 |
| 4 | 13.5–17.4 s | fact | New Zealand needed twelve overs to get that far. | TO REACH 118 · Catch-up · 12 overs New Zealand took to pass India's 118 · bars: 11 overs 113, 12 overs 123 | C06, C08 |
| 5 | 17.4–21.3 s | fact | It beat Romania's one sixteen and Australia's one thirteen. | THE OLD MARKS · Record · 118 a T20I record for a powerplay · Romania's 116 was a chase won in 5.4 overs. · bars: India 2026 118, Romania 2021 116, Australia 2024 113 | C09, C10, C11 |
| 6 | 21.3–27.1 s | say | Abhishek hit one hundred thirteen. India won with forty balls left. | Abhishek: 113 off 38. / India won with / 40 balls to spare. · note: Sooryavanshi made 45 off 19. They put on 133 for the first wicket. | C12, C14, C13, C15 |
| 7 | 27.1–31.0 s | end | Can anyone beat this? Name the pair below. | Can anyone beat 118 in six overs? / Name the pair who could. | C01 |
Config: `public/datayt/beats/configs/pp118.json` (branch `datakadai/pp118`, worktree `mmvideo-dk-pp118`). Every figure
is read from `public/datayt/sources/cricket/nzind_t20i3_2026.json`. Every comparison in words is a money_test:
- the six overs sum to 118;
- India's 118 is double New Zealand's 58 (ratio 2.03);
- 113 < 118 ≤ 123;
- the target, 113 (38), 45 (19), 40 balls and the 133 stand.

## Gates
- **G1 Sourced: PASS.** Every number on screen or in the voice is a claim with a cell.
- **G2 Latest: PASS.** The match is complete and the result is final in both sources. Re-read before posting.
- **G3 Coverage: PASS.** Steps 1–9 are logged; steps 8 and 9 are noted as not applicable.
- **G4 Cross-check: PASS.**
  - The BCCI scorecard equals Cricinfo on every line.
  - The powerplay overs match on BCCI's chart for overs 1–4 and 6; the over-5 bar was not read.
  - The no-wicket fact follows from the fall of wickets (1-133 at 7.1 overs).
- **G5 No banned evidence: PASS.** Reports were read only for myths.md.
- **G6 Independent check: PENDING.** See verify.md (about 3 minutes, AK or a second agent).
- **G7 Fresh angle: PASS.** C07 and C08.
- **G8 Myths audited: PASS.** 9 claims, each with a verdict.
- **G9 Data tests: PASS.** `build_beats.py pp118 --check` passed, and the voiced build passed the house rules at 31.4 s.

**NOT CLEARED until G6 passes.**
