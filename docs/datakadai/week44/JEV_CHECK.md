# Jev check: are this week's titles million-view material?

Made by `scripts/datayt/jev_views_check.py` with TypeSafe `jev-1.13.0` (question set `c60cddf353`), 25 Oct 2026.

Jev reads the title only. It does not see the video, the thumbnail, the channel or the algorithm, so this is a
judgment of the wording, not a forecast of views. A new channel with no subscribers rarely reaches a million on
any title.

## Step 1: can Jev tell real hits from misses?

28 real Shorts from Think School, Finshots TV and Wint Wealth (views from vidIQ, 25 Oct 2026). Within each
channel, the top half by views is compared with the bottom half, so channel size does not decide it.

| Measure | Pairs ordered right (50 % = coin toss) |
| --- | --- |
| Jev score (weighted) | 58% of 66 |
| Jev's "a million views?" probability | 74% of 66 |
| curiosity alone | 64% |
| mass alone | 63% |
| stakes alone | 55% |
| surprise alone | 41% |
| clear alone | 33% |
| million alone | 74% |

| Channel | Title | Views | Jev score | Million? |
| --- | --- | --- | --- | --- |
| Finshots TV | India's Silver Crash Explained: From ₹1.9 Lakh to ₹1.56 Lakh in Days | 440,150 | 61.1 | 37% |
| Finshots TV | Why Bengaluru's ₹40,000 Crore Metro Didn't Fix Traffic | 328,347 | 59.2 | 37% |
| Finshots TV | Lenskart IPO: The High Valuation vs. Grey Market Hype! | 182,417 | 47.6 | 34% |
| Finshots TV | The Government's Smartest Tax Trick Yet | 175,136 | 67.8 | 34% |
| Finshots TV | Gold Hit ₹1 Lakh… But Jewellers Are Still Struggling | 12,684 | 64.4 | 37% |
| Finshots TV | This Sector Could Shock Everyone in 2026 | 8,969 | 53.4 | 27% |
| Finshots TV | Indians love Beer! | 8,830 | 45.0 | 20% |
| Finshots TV | India's Ethanol Masterplan backfired? | 6,412 | 55.2 | 29% |
| Finshots TV | Why are India's ultra-rich preferring Gurugram over Mumbai | 5,211 | 50.3 | 29% |
| Finshots TV | Trump Does it Again! | 4,204 | 36.7 | 21% |
| Think School | Using AI is no longer enough. You need to know how to BUILD with it. | 15,730,540 | 54.9 | 29% |
| Think School | Why Elon Musk Wants to Bomb Mars | 1,468,089 | 49.9 | 32% |
| Think School | 12 Years of BJP: Growth or Failure? | 1,083,447 | 55.8 | 34% |
| Think School | Ex-ISRO Scientist Reveals Space Secrets! | 1,056,170 | 56.2 | 40% |
| Think School | Comet's Secret Marketing Strategy | 37,633 | 43.3 | 23% |
| Think School | This Company Is Bringing Foreign Universities to India | 37,561 | 55.9 | 32% |
| Think School | Most Loneliness Happens in Joint Families | 35,450 | 78.7 | 33% |
| Think School | Get to $1 Million With Just 20 Clients! | 34,304 | 64.5 | 25% |
| Think School | This AI Cut Marketing Costs by 83% | 30,739 | 55.4 | 33% |
| Think School | This AI Helps Founders Scale Faster | 27,914 | 33.1 | 21% |
| Wint Wealth | Is Gold Savings Scheme the best way to invest in gold? | 7,669,604 | 61.7 | 33% |
| Wint Wealth | Is Being Employed Stupid? | 5,830,168 | 81.0 | 26% |
| Wint Wealth | How much money you need to RETIRE? | 3,310,060 | 70.7 | 44% |
| Wint Wealth | Countries to TRAVEL below 1.5 Lakh Budget | 1,861,380 | 59.0 | 41% |
| Wint Wealth | Indians SPENDING more than Americans? | 321,495 | 81.6 | 37% |
| Wint Wealth | Why are Zudio products cheap? | 295,651 | 61.9 | 43% |
| Wint Wealth | How to Choose a Mutual Fund | 130,938 | 46.2 | 26% |
| Wint Wealth | Cost of raising a child in Metro Cities? | 113,497 | 64.7 | 39% |

Lowest Jev score among the 8 real million-view titles: **49.9**.

## Step 2: this week's titles

| Day | Slot | Title | Jev score | Million? | Curiosity | Mass | Stakes | Surprise | Clear |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mon 26 | A | Indian Homes Hold 3× More Gold Than the US Government | **75.2** | 55% | 0.69 | 0.83 | 0.82 | 0.51 | 0.96 |
| Thu 29 | Long | India Is Running Out of Babies. Here's the Map. | **74.5** | 43% | 0.70 | 0.69 | 0.87 | 0.64 | 0.90 |
| Thu 29 | A | Diwali Gold: Indians Buy Less, Pay More | **69.6** | 35% | 0.58 | 0.83 | 0.78 | 0.59 | 0.69 |
| Wed 28 | A | India's Baby Map: One Region Now Below 1 Child per Woman | **66.9** | 40% | 0.65 | 0.66 | 0.73 | 0.60 | 0.74 |
| Sat 31 | Long | 10 Minutes vs DMart vs the Kirana Anna: Who's Winning? | **65.2** | 40% | 0.70 | 0.80 | 0.67 | 0.34 | 0.55 |
| Tue 27 | A | The ₹10 Cola War: Campa vs Coke and Pepsi | **60.6** | 39% | 0.50 | 0.74 | 0.57 | 0.58 | 0.71 |
| Fri 30 | A | 110 Crore Orders in 10 Minutes | **58.7** | 43% | 0.74 | 0.48 | 0.43 | 0.63 | 0.63 |
| Thu 29 | B vs02 (fallback) | Punjab vs Haryana: 5 Rounds of Money Data | **55.0** | 22% | 0.49 | 0.47 | 0.74 | 0.44 | 0.70 |
| Fri 30 | B vs06 | Gujarat vs Rajasthan: 5 Rounds on Women and Girls | **54.7** | 22% | 0.41 | 0.67 | 0.72 | 0.24 | 0.74 |
| Sat 31 | A | Which State Pays India's GST? | **54.1** | 23% | 0.56 | 0.44 | 0.56 | 0.67 | 0.48 |
| Wed 28 | B cn02 | Bank Loans vs State Output: Delhi at 153%, Top 5 | **52.6** | 20% | 0.58 | 0.33 | 0.60 | 0.72 | 0.40 |
| Sun 1 | A | UPI October Scorecard: Festive Record? | **48.5** | 25% | 0.52 | 0.52 | 0.57 | 0.40 | 0.25 |
| Sat 31 | B cn08 | Kerala or West Bengal? 4 Rounds of Higher or Lower | **47.8** | 26% | 0.48 | 0.54 | 0.49 | 0.22 | 0.69 |
| Tue 27 | B vs05 | Karnataka vs Tamil Nadu: 5 Rounds, Power and 5G | **46.9** | 22% | 0.37 | 0.47 | 0.69 | 0.45 | 0.36 |
| Mon 26 | B vs03 | Maharashtra vs Gujarat: 5 Rounds of Economy Data | **46.3** | 21% | 0.39 | 0.37 | 0.62 | 0.36 | 0.76 |
| Sun 1 | B vs07 | West Bengal vs Odisha: 5 Rounds of School and Health Data | **45.1** | 14% | 0.24 | 0.42 | 0.64 | 0.42 | 0.82 |

## Step 3: hook titles for the built state comparisons

Ranked by Jev's "Million?" judgment, the measure that held up in step 1. Best per Short in bold.

| Short | Title | Chars | Million? |
| --- | --- | --- | --- |
| vs03 | Maharashtra vs Gujarat: 5 Rounds of Economy Data *(current)* | 48 | 21% |
| vs03 | **Maharashtra vs Gujarat: Which Economy Wins? 5 Rounds** | 52 | 32% |
| vs03 | Gujarat Beats Maharashtra 3–2: Factories Decide It | 50 | 22% |
| vs03 | Gujarat's Factory Output per Person Is 2.4× Maharashtra's | 57 | 18% |
| vs05 | Karnataka vs Tamil Nadu: 5 Rounds, Power and 5G *(current)* | 47 | 22% |
| vs05 | **Karnataka Wins on 5G. Tamil Nadu Wins on Power. Who Wins?** | 57 | 26% |
| vs05 | Tamil Nadu Gets 25% More Power per Person Than Karnataka | 56 | 21% |
| vs05 | Tamil Nadu Beats Karnataka 3–2 on Power and 5G | 46 | 20% |
| vs02 | Punjab vs Haryana: 5 Rounds of Money Data *(current)* | 41 | 22% |
| vs02 | **Punjab vs Haryana: Who Wins on Money? 5 Rounds** | 46 | 27% |
| vs02 | Haryana Has 68% More Personal Loans per Person Than Punjab | 58 | 22% |
| vs02 | Punjab Beats Haryana 3–2 on Money. Haryana Borrows More | 55 | 17% |
| vs06 | Gujarat vs Rajasthan: 5 Rounds on Women and Girls *(current)* | 49 | 22% |
| vs06 | **Gujarat or Rajasthan: Where Do Women and Girls Do Better?** | 57 | 29% |
| vs06 | 88% vs 67%: Rajasthan Beats Gujarat on Period Protection | 56 | 25% |
| vs06 | Rajasthan Beats Gujarat 3–2 on Women and Girls | 46 | 21% |
| vs07 | West Bengal vs Odisha: 5 Rounds of School and Health Data *(current)* | 57 | 14% |
| vs07 | **Odisha Wins on Mothers. West Bengal Wins on Schools.** | 52 | 25% |
| vs07 | West Bengal or Odisha: Who Wins on Schools and Health? | 54 | 24% |
| vs07 | West Bengal Beats Odisha 3–2 on Schools and Health | 50 | 15% |
| cn02 | Bank Loans vs State Output: Delhi at 153%, Top 5 *(current)* | 48 | 20% |
| cn02 | **Which State Runs Most on Bank Loans? #1 Isn't Maharashtra** | 57 | 29% |
| cn02 | Delhi Owes Banks More Than Its Whole Year's Output | 50 | 26% |
| cn02 | Banks Have Lent Delhi 1.5× Its Yearly Output | 44 | 22% |
| cn08 | Kerala or West Bengal? 4 Rounds of Higher or Lower *(current)* | 50 | 26% |
| cn08 | **Can You Beat This India Quiz? 4 Rounds of Higher or Lower** | 57 | 33% |
| cn08 | Kerala or West Bengal? Most People Guess Wrong | 46 | 32% |
| cn08 | Kerala or West Bengal: Which Is More Crowded? | 45 | 23% |

## What it says (read this first)

- **Use the "Million?" column, not the Jev score.** Jev's own "a million views?" judgment put the hit above the miss in
  74 % of same-channel pairs. The weighted score managed 58 %, close to a coin toss, and "surprise" and "clear" alone
  were worse than chance. The probabilities are not calibrated: real million-view Shorts got 26 % to 44 %, misses
  20 % to 43 %. Read them as a ranking, not as odds.
- **7 of 16 titles land in the range of real million-view Shorts (35 % or more):** Gold 3× (55 %, higher than every
  real hit in the test), the baby-map long video (43 %), 110 crore orders (43 %), the baby-map Short (40 %), the
  quick-commerce long video (40 %), the cola war (39 %) and Diwali gold (35 %).
- **All seven built state comparisons land at the bottom (14 % to 26 %),** below every real million-view title and
  level with the misses. Their titles follow one formula ("X vs Y: 5 Rounds of ___ Data") with no open question or
  surprise in them. This is about the titles, not the videos: AK's 22 Oct note says state comparisons draw more views.
  The fix to test is a hook title that names the surprising round.
- **UPI scorecard (25 %) and GST map (23 %)** are weak too: "Scorecard" and "GST" read as jargon (clarity 0.25 and
  0.48).
- Small test: 28 titles from three channels. A brand-new channel rarely reaches a million on any title.

## Retitles (step 3), swapped in on 25 Oct

- Every Short got a better title than its "5 Rounds of ___ Data" one: +4 to +11 points on "Million?". Questions won
  in five of seven; titles that give away the result ("Gujarat Beats Maharashtra 3–2") scored lowest.
- The winners land at 25 % to 33 %: the low end of the range real million-view Shorts got (26 % to 44 %). Better,
  not yet as strong as the gold and baby-map titles. Gaps of a few points may be noise.
- Swapped in: vs03, vs05, vs02, vs06, vs07 and cn08 take the bold winner. **cn02 takes the runner-up**, "Delhi Owes
  Banks More Than Its Whole Year's Output" (26 %): the winner uses "#1", which `build_beats.py` bans in titles.
- Rejected though it scored 32 %: "Kerala or West Bengal? Most People Guess Wrong", a claim we cannot back.
- Changed: `yt_title` in `public/datayt/beats/configs/`, `ytTitle` in each `data.json`, `bank/scripts_index.json`,
  the post packs (old title kept in a note), the `captions.md` beside each video, `WEEK_PLAN.md`. cn08's post images
  were rendered again (it draws the title). `build_beats.py --check`: 7 passed. The videos do not show the title, so
  no video was rendered again.
