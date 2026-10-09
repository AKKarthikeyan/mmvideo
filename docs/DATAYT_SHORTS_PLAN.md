# Data YT: NFHS-6 Shorts plan (Shorts only, no long videos)

Data: `public/datayt/nfhs6/nfhs6_states.json` holds 101 indicators × 36 (India, 28 states, 8 UTs), as urban, rural,
total and the NFHS-5 total: 3,518 of 3,636 cells. The missing ones are mostly suppressed (`*`) vaccine and diet cells in
small UTs. It was built from the PDF's text layer for 23 states and OCR for 13 image-only states. I checked the OCR on
316 cells against hand reads and the OpenCity CSVs and found 0 errors. The rest were read by eye.
Scored candidates: `public/datayt/nfhs6/shorts_catalog.csv` (from `scripts/datayt/nfhs6_shorts.py`).

## How many Shorts are possible

| Angle | Raw combinations |
| --- | --- |
| One fact: state × indicator × 4 views (level, village vs city, 2019-21 → 2023-24, vs India) | 14,544 |
| Rankings: 101 indicators × 6 lists (top 10, bottom 10, risers, fallers, South, North-East) | 606 |
| State vs state: 595 pairs × 101 indicators | 60,095 |
| Paradox: state × any 2 indicators | 176,750 |
| Women vs men: 10 paired indicators × 36 | 360 |
| **Total** | **≈ 2.5 lakh** |

Almost all of these are boring (a 2-point gap, a vaccine sub-dose). After scoring for surprise (how far the state is from
everyone else, how big the change is, how relatable the topic is, whether rivals are involved):
- **851** pass the bar for a usable Short
- **91** are strong (score 8+)
- **50** below are the ones worth making first. That's one a day for 7 weeks.

## Shorts formula (every video, 25-35 s, chase music at 150 BPM)

1. **0-1.5 s, hook:** a shocking number or a direct question on screen in the first frame. No logo, no intro.
2. **1.5-20 s, build:** countdown, race or split screen, with a new element every beat so nothing sits still.
3. **20-28 s, reveal:** the #1 / the answer, with a hit on the beat.
4. **28-32 s, loop:** end on a question that sends people back to the first frame, plus "Comment your state".

---

## The 50

### Series 1: Guess the State (quiz, 3 options + timer)
1. **"In one Indian state, women own the land."** Meghalaya: 65.3% of homes have a woman owning house or land. India 18.8%, next best Kerala 34.3%.
2. **"1 in 4 women here drink alcohol."** Arunachal Pradesh 23.2%. India 1.1%.
3. **"3 out of 4 men here use tobacco."** Mizoram 73.6%. India 36.3%.
4. **"Here, 6 in 10 women use tobacco."** Mizoram 61.0% women. India 8.4%.
5. **"The state where the average family has 1 child."** Sikkim fertility rate 1.0. Bihar 2.7.
6. **"Where men actually get sterilised."** Telangana 3.6%, 7× India's 0.5%.
7. **"9 in 10 private-hospital births here are C-sections."** J&K 90.0%. India 54.1%.
8. **"3 in 10 men here marry before 21."** Bihar 29.6%. Kerala 1.7%.

### Series 2: Top 10 countdown
9. **Where men drink the most:** Arunachal 50.5, Telangana 43.9, Sikkim 42.2 … Gujarat 5.2 last.
10. **India's sugar capital:** high blood sugar in men. Goa 32.1, Kerala 31.9, Puducherry 28.8.
11. **"Half the women here are overweight":** Puducherry 51.3%, AP 47.9, Sikkim 47.5. India 30.7.
12. **Child marriage top 10, and #1 isn't Bihar:** West Bengal 36.4%, Bihar 34.6, Tripura 34.0.
13. **Teen mothers:** Tripura 18.0% of girls aged 15-19, West Bengal 16.6. India 6.7.
14. **India's C-section capital:** Telangana 62.2% of all births, AP 52.2, Sikkim 51.1. Meghalaya 6.4.
15. **Spousal violence, with a South state at #2:** Bihar 36.1, Telangana 30.8, UP 28.5.
16. **India's oldest states:** Kerala 20.7% aged 60+, Goa 17.2, Himachal 16.4.
17. **Women with their own phone:** Sikkim 91.6% … Chhattisgarh 47.8%.

### Series 3: Then vs now (2019-21 → 2023-24)
18. **Women online doubled in 4 years:** India 33.3% → 64.3%.
19. **Biggest fall in India:** Karnataka spousal violence 44.4% → 14.1%. Kerala went the other way: 9.8 → 17.7.
20. **13.8% → 96.3%:** J&K homes with health insurance.
21. **Bihar men online:** 35.4% → 78.1%.
22. **India got heavier:** overweight women 24.0 → 30.7%. 32 states got worse.
23. **Diabetes is coming:** men with high sugar 15.6 → 20.9%. 28 states got worse.
24. **Goa stopped drinking?** Men 36.8% → 22.4%.
25. **Sikkim's C-section boom:** 32.8% → 51.1%.
26. **TN lost health cover while India gained it:** TN 66.5 → 61.1, India 41.0 → 60.2.

### Series 4: State vs state (split screen)
27. **TN vs Gujarat, men who drink:** 23.5% vs 5.2%.
28. **Telangana vs Andhra, same people, double the drinking:** 43.9% vs 23.3%.
29. **Kerala vs West Bengal, child brides:** 2.9% vs 36.4%.
30. **TN vs Gujarat, men married before 21:** 3.7% vs 24.3%.
31. **Bihar has prohibition, UP doesn't:** men who drink 16.5% vs 18.7%.
32. **Delhi vs Maharashtra, women on tobacco:** 1.7% vs 8.8%.
33. **Kerala vs TN, diabetes risk (women):** 28.9% vs 25.2%.

### Series 5: Paradox
34. **Kerala:** #1 for men online, and #1 for diabetic women (28.9%).
35. **Sikkim:** #1 for women with their own phone, and #1 for high blood pressure (32.0% women, 36.6% men).
36. **Goa:** #1 for women online (94.0%), and #1 for men with high sugar (32.1%).
37. **West Bengal:** 95.3% of women have a bank account, yet it's #1 for child marriage.
38. **Tamil Nadu:** #2 for women paid for work (48.0%), but spousal violence (28.5%) is above India's 22.3%.

### Series 6: Women vs men
39. **"Women are heavier than men in 26 of 35 states":** overweight women > men almost everywhere. TN 44.2 vs 38.8.
40. **Arunachal, where the drinking gap is smallest:** women 23.2% vs men 50.5%.
41. **"In 2 states, women are more online than men"** (reveal both).

### Series 7: South India league (TN highlighted)
42. **Child marriage:** AP 25.1% … Kerala 2.9%.
43. **Women who drink:** Telangana 7.1% … Puducherry 0.2%.
44. **C-sections:** Telangana 62.2, AP 52.2, TN 46.9 …
45. **Diabetes risk:** Kerala, Puducherry, TN, AP …
46. **Men who drink:** Telangana 43.9, TN 23.5, AP 23.3, Puducherry 22.8, Kerala 22.7, Karnataka 15.6.

### Series 8: Tamil Nadu special
47. **TN village vs city:** men drink 26.7% in villages vs 19.7% in cities.
48. **TN's biggest win:** rotavirus vaccine 66.4% → 87.4%, and stunting 25.0 → 20.7.
49. **TN's warning sign:** women with high sugar 20.7% → 25.2%.
50. **TN's 5 records:** #2 for women paid for work, 3rd-lowest for men married before 21 (3.7%), 44.2% of women overweight, 46.9% C-sections, 23.5% of men drink.

## Notes
- Lakshadweep is excluded from rankings because the sample is tiny. Small UTs (Chandigarh, Puducherry, DNH&DD, Ladakh,
  A&N) are kept but scored lower.
- Cells shown as `(x)` are based on only 25-49 people, and `*` cells are suppressed. Neither is used for a #1 claim.
- Always say "NFHS-6 (2023-24)" on screen, plus "men/women age 15+" or "15-49" exactly as the indicator states.
- District Shorts (TN map style) need the NFHS-6 district fact sheets, which aren't in this PDF.
