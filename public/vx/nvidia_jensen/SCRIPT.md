# Will NVIDIA Survive Without JENSEN? Explained Like You're 5

**Final script, Vox Plus format** · Channel: Moat Atlas · Facts as of 9 Nov 2026 · 38 beats · 929 spoken words · about 6:37 at 150 words a minute (re-time after the voice is built)

## Format rules (Vox Plus)

- **Engine:** Vox engine (`src/vx/VoxEngine.tsx`), 16:9 long video plus 9:16 Shorts from the same beats. Each beat below names its engine scene type.
- **Look:** voxkit paper palette (tan, ink, red, mustard), torn cards, tape, stamps and red string; real documents and photos, cut out and collaged.
- **Hero moments from HyperFrames:** the timeline (s11), the money breakdown (s04) and the dot chart (s05), rendered as clips and placed in their beats.
- **Analogy beats** (restaurant, castle, house move) are drawn in the illustration kit and labelled ILLUSTRATIVE on screen.
- **Every number** carries its source on screen (the Source column). Say "alleged" and "reported"; never "spy charge".
- **Photos** come from `public/vx/nvidia_jensen/img/` (credits in `CREDITS.md`). The `pic` scene reads `public/vx/nvidia_jensen/pics/<name>.png`, so convert the chosen JPGs into `pics/` when building. Put each photo's short credit on screen while it shows.
- **Never shown:** any picture of the woman named in reports; any face edited to mock; the words SPY or CHARGED in a title or thumbnail.

## Chapters (for the description)

- 0:00 Cold open
- 0:25 What happened
- 1:30 Why Jensen matters
- 2:38 The moat test
- 2:53 Check 1: the recipe
- 3:34 Check 2: the diners
- 4:21 Check 3: a second chef
- 5:04 Has this happened before?
- 5:35 The answer
- 6:25 Sources

## Beats

VO is written for the voice: numbers are spelled out, as the engine's `say` field expects. On-screen text uses numerals.

### Cold open (0:00)

**n00 · 0:00** · scene: `pic (heading "CES 2025 · LAS VEGAS") → counter to 4.5, prefix "$", suffix " TRILLION"`

> This man runs one of the most valuable companies in the world. On Friday, NVIDIA was worth about four and a half trillion dollars.

- **On screen:** Strips: NVIDIA · ≈ $4.5 TRILLION (6 NOV CLOSE)
- **Visual:** jensen/ces2025_keynote_wide.jpg (slow push-in on Jensen on stage)
- **Source on screen:** Market value: CNBC / Yahoo Finance, 6 Nov 2026 close

**n01 · 0:10** · scene: `kinetic (kicker "8 NOV 2026")`

> This weekend, its board opened an investigation into him. Nobody has charged him with anything. But it raised one big question.

- **On screen:** Kinetic: A BOARD INVESTIGATION. / NO CHARGES. / ONE BIG QUESTION.
- **Visual:** jensen/portrait_2023.jpg as torn-card cut-out behind the type
- **Source on screen:** NVIDIA board statement, 8 Nov 2026

**n02 · 0:19** · scene: `title (red)`

> Will NVIDIA survive without Jensen Huang? Let's explain it like you're five.

- **On screen:** WILL NVIDIA SURVIVE WITHOUT JENSEN?  (stamp: EXPLAINED LIKE YOU'RE 5)

### What happened (0:25)

**n10 · 0:25** · scene: `title`

> Chapter one. What happened.

- **On screen:** WHAT HAPPENED

**n11 · 0:28** · scene: `cards ×3, one per sentence`

> At the end of October, the New York Times reported that American officials believe someone close to Jensen was working for Chinese intelligence. On Sunday, Jensen told his staff he had been unfaithful to his wife. The same day, NVIDIA's board said independent directors, with outside lawyers, would investigate.

- **On screen:** Cards: THE REPORT (NYT, end Oct) · THE MEMO (8 Nov) · THE PROBE (independent directors + outside counsel)
- **Visual:** Headline cut-outs (type only; no photo of the woman named in reports)
- **Source on screen:** The New York Times (Oct 2026); CNN, CNBC, NPR, 8 Nov 2026

**n12 · 0:48** · scene: `strips + stamps`

> Three things matter. The board says it has no reason to believe NVIDIA's secrets or America's national security were compromised. China calls the spy claims groundless speculation. And NVIDIA says Jensen will stay on as boss during the investigation.

- **On screen:** Stamps: BOARD: NO SIGN SECRETS WERE COMPROMISED · CHINA: "GROUNDLESS SPECULATION" · STILL CEO
- **Visual:** jensen/gesturing.jpg (pic, darkened)
- **Source on screen:** NVIDIA board statement via CNBC, 8 Nov; China's government via CNN, 8 Nov

**n13 · 1:04** · scene: `bars (2 rows) + stamp`

> So this is a question mark, not a verdict. But markets hate question marks. On Monday morning, before trading began, NVIDIA's shares were down about five percent. Since the first report, they've fallen about thirteen percent.

- **On screen:** Bars: FRI CLOSE $186.64 · MON PRE-MARKET ≈ $176   Stamp: −13% SINCE 28 OCT
- **Source on screen:** CNBC, Yahoo Finance, 9 Nov 2026. UPDATE: use Monday's close at render

**n14 · 1:19** · scene: `kinetic`

> For a company this big, every one percent is worth about forty five billion dollars. So people are asking: how much of NVIDIA is just Jensen?

- **On screen:** Kinetic: 1% ≈ $45 BILLION   (small: our arithmetic: 1% of $4.5 trillion)
- **Source on screen:** Our calculation from the 6 Nov market value

### Why Jensen matters (1:30)

**n20 · 1:30** · scene: `title`

> Chapter two. Why Jensen matters.

- **On screen:** WHY JENSEN MATTERS

**n21 · 1:34** · scene: `pic (heading "1993")`

> Think of NVIDIA as a restaurant. In nineteen ninety three, Jensen and two friends, Chris Malachowsky and Curtis Priem, planned it over coffee at a Denny's in San Jose.

- **On screen:** Strips: 1993 · A DENNY'S IN SAN JOSE · 3 FOUNDERS   Label: ILLUSTRATIVE: A DENNY'S, NOT THE ORIGINAL
- **Visual:** `story/dennys_restaurant.jpg`
- **Source on screen:** NVIDIA 10-K FY2026 (incorporated April 1993); Denny's story: see checklist item 6

**n22 · 1:46** · scene: `cards ×3`

> Jensen has been the head chef since day one. Thirty three years.

- **On screen:** Cards: CO-FOUNDED 1993 · CEO SINCE DAY ONE · 33 YEARS
- **Visual:** jensen/computex_2010.jpg as cut-out
- **Source on screen:** NVIDIA 10-K FY2026, executive officers

**n23 · 1:51** · scene: `timeline (HyperFrames s11 fly-through for the hero version)`

> For years, the kitchen made one dish: graphics chips for video games. Its first chip came out in nineteen ninety five.

- **On screen:** Timeline: 1995 NV1 → 1999 GeForce 256 → …
- **Visual:** gpu/nv1_1995_chip.jpg, gpu/riva128_chip.jpg; gpu/geforce256_card.jpg when fetched
- **Source on screen:** Chip photos: FritzchensFritz (CC0)

**n24 · 2:00** · scene: `pic (heading "GTC 2010")`

> Then Jensen made a strange bet. He said the same chips could also do maths, huge amounts of maths, all at the same time. In two thousand six, NVIDIA introduced software called CUDA, so programmers could use the chips that way.

- **On screen:** Strips: THE BET · CHIPS THAT DO MATHS · 2006: CUDA
- **Visual:** `jensen/gtc2010_cpu_gpu_slide.jpg`
- **Source on screen:** Photo: chang_sen, CC BY 2.0

**n25 · 2:17** · scene: `timeline (show=2, add the two events)`

> In twenty twelve, researchers trained a famous AI program called AlexNet on two NVIDIA gaming cards. It turned out AI needs exactly that kind of maths.

- **On screen:** Timeline adds: 2006 CUDA → 2012 ALEXNET ON 2 NVIDIA GPUs → 2023–26 AI BOOM
- **Visual:** gpu/gtx1080ti_die.jpg as background texture
- **Source on screen:** Krizhevsky, Sutskever & Hinton, ImageNet paper (NeurIPS 2012)

**n26 · 2:28** · scene: `kinetic`

> So when people say Jensen is NVIDIA, this is what they mean. He didn't just run the kitchen. He picked the menu, twice.

- **On screen:** Kinetic: HE DIDN'T JUST RUN THE KITCHEN. / HE PICKED THE MENU. TWICE.
- **Visual:** jensen/gtc2010_keynote.jpg (dim, behind)

### The moat test (2:38)

**n30 · 2:38** · scene: `title`

> Chapter three. The moat test.

- **On screen:** THE MOAT TEST

**n31 · 2:41** · scene: `castle (illustration kit)`

> If the famous chef leaves, does the restaurant survive? We'll check three things. Is the recipe written down? Are the diners stuck? And is there a second chef?

- **On screen:** Castle with 3 blank shields: RECIPE WRITTEN DOWN? · DINERS STUCK? · A SECOND CHEF?   Label: ILLUSTRATIVE

### Check 1: the recipe (2:53)

**n40 · 2:53** · scene: `cards ×2 (hero version: HyperFrames s04 money breakdown)`

> Check one. Is the recipe written down? Last year, NVIDIA sold about two hundred and sixteen billion dollars of chips and systems, up sixty five percent. It kept about one hundred and twenty billion as profit.

- **On screen:** Cards: REVENUE $215.9B (+65%) · NET INCOME $120.1B   Heading: FISCAL YEAR TO JAN 2026
- **Source on screen:** NVIDIA 10-K FY2026

**n41 · 3:08** · scene: `cards ×3`

> And the recipe isn't only in Jensen's head. NVIDIA has about forty two thousand people. Thirty one thousand of them work on research and development. Last year, fewer than four in every hundred left.

- **On screen:** Cards: 42,000 STAFF · 31,000 IN R&D · 3.7% LEFT IN FY2026
- **Visual:** datacenter/titan_supercomputer.jpg (pic, darkened)
- **Source on screen:** NVIDIA 10-K FY2026, human capital

**n42 · 3:22** · scene: `kinetic`

> NVIDIA has also announced its next chips years in advance. A chef can leave on a Monday. A chip roadmap doesn't change on a Monday.

- **On screen:** Kinetic: A CHEF CAN LEAVE ON A MONDAY. / A ROADMAP DOESN'T.
- **Visual:** jensen/ces2025_blackwell.jpg (dim, behind)
- **Source on screen:** NVIDIA GTC keynotes (published roadmap)

**n43 · 3:32** · scene: `castle (show=1)`

> Check one: mostly yes.

- **On screen:** Shield 1 ✓ MOSTLY YES

### Check 2: the diners (3:34)

**n50 · 3:34** · scene: `HyperFrames s05 dot chart (rendered clip, dropped in as a clip beat)`

> Check two. Are the diners stuck? About six million programmers have learned CUDA, and their code is written for NVIDIA chips.

- **On screen:** Dots: 600 dots, 1 dot = 10,000 developers → ≈ 6 MILLION
- **Source on screen:** NVIDIA Developer Forum, "20 Years of CUDA" (GTC 2026)

**n51 · 3:43** · scene: `clip (10-K Item 1, Business) → strips`

> NVIDIA's annual report says CUDA runs on all NVIDIA chips. Moving all that code to another company's chips is like moving your whole house to a new city. It's possible, but slow and expensive.

- **On screen:** Clip highlight: "CUDA development platform that runs on all NVIDIA GPUs"   Label on the house: ILLUSTRATIVE
- **Source on screen:** NVIDIA 10-K FY2026, Item 1

**n52 · 3:57** · scene: `kinetic`

> And customers don't buy because they like Jensen. They buy because their software already runs on these chips.

- **On screen:** Kinetic: THEY BUY THE CHIPS, / NOT THE CHEF.
- **Visual:** datacenter/tesla_gpu_cluster.jpg (dim, behind)

**n53 · 4:05** · scene: `bars (2 rows) + stamp`

> But here's the warning sign. Just two customers made up more than a third of NVIDIA's sales last year: one at twenty two percent, another at fourteen. NVIDIA doesn't name them.

- **On screen:** Bars: CUSTOMER A 22% · CUSTOMER B 14%   Stamp: 36% FROM TWO BUYERS
- **Source on screen:** NVIDIA 10-K FY2026, MD&A (direct customers)

**n54 · 4:18** · scene: `castle (show=2)`

> Check two: yes, with a warning.

- **On screen:** Shield 2 ✓ YES · ⚠ CONCENTRATION

### Check 3: a second chef (4:21)

**n60 · 4:21** · scene: `table`

> Check three. Is there a second chef? NVIDIA's annual report names five executive officers. Jensen is one of them, and he has run the company since the start.

- **On screen:** Table (heading: AS LISTED IN THE 10-K, FEB 2026): HUANG · President & CEO (since 1993) / KRESS · CFO (since 2013) / PURI · Worldwide Field Ops / SHOQUIST · Operations / TETER · General Counsel
- **Visual:** No faces of the other executives
- **Source on screen:** NVIDIA 10-K FY2026, executive officers

**n61 · 4:33** · scene: `clip (10-K p.23, Item 1A risk factors)`

> And the same report carries a warning. It says NVIDIA is highly dependent on its longstanding executive team, and that failing to plan succession could hurt its long-term success.

- **On screen:** Clip highlight: "highly dependent on the services of our longstanding executive team" · "succession planning"
- **Visual:** Crop from the 10-K PDF (sources/)
- **Source on screen:** NVIDIA 10-K FY2026, Item 1A, p.23

**n62 · 4:45** · scene: `pic + strips`

> What it doesn't do is name a successor. There's no public number two. Jensen has said he has around sixty people reporting straight to him. That's how he likes to run things. It also means there's no obvious next in line.

- **On screen:** Strips: NO PUBLIC SUCCESSOR · ≈ 60 DIRECT REPORTS
- **Visual:** `jensen/ceo_flickr.jpg`
- **Source on screen:** VERIFY: cite Huang's own interview for the 60 figure; successor: 10-K and Bloomberg

**n63 · 5:02** · scene: `castle (show=3)`

> Check three: not clear.

- **On screen:** Shield 3 ⚠ NOT CLEAR (shield cracks)

### Has this happened before? (5:04)

**n70 · 5:04** · scene: `title`

> Chapter four. Has this happened before?

- **On screen:** HAS THIS HAPPENED BEFORE?

**n71 · 5:08** · scene: `duo (illustration kit) or two-line chart`

> Famous founders have stepped back before. In twenty eleven, Steve Jobs handed Apple to Tim Cook, and Apple grew far bigger. In two thousand, Bill Gates handed Microsoft's top job to Steve Ballmer. Microsoft's share price then took about sixteen years to get back to its old high.

- **On screen:** Duo: APPLE after Aug 2011 (rising) vs MICROSOFT after Jan 2000 (flat), indexed share-price lines
- **Visual:** founders/steve_jobs_2010.jpg, tim_cook_2026.jpg, bill_gates_2025.jpg, steve_ballmer_2014.jpg when fetched
- **Source on screen:** DATA TO PULL: monthly share prices (cite the provider on screen). VERIFY the Microsoft recovery year (2016)

**n72 · 5:27** · scene: `kinetic`

> Same story, very different endings. The difference was whether the next boss made the next big bet.

- **On screen:** Kinetic: SAME STORY. / DIFFERENT ENDINGS.

### The answer (5:35)

**n80 · 5:35** · scene: `title`

> Chapter five. The answer, like you're five.

- **On screen:** THE ANSWER

**n81 · 5:39** · scene: `castle (all shields) → kinetic`

> So, will NVIDIA survive without Jensen? Yes. The recipe is written down, and the diners are stuck with the menu. But surviving isn't the same as winning. Jensen's real job was picking the next dish before anyone knew they were hungry for it. That's the hardest thing to replace.

- **On screen:** Castle: ✓ RECIPE · ✓ DINERS (⚠) · ⚠ SECOND CHEF → Kinetic: SURVIVING ≠ WINNING

**n82 · 5:59** · scene: `hand`

> Here's what to watch. The board's findings, which have no deadline. NVIDIA's results on the seventeenth of November. A briefing that members of Congress have asked Jensen to attend on the eighteenth. And whether NVIDIA names a successor.

- **On screen:** Hand "Watch:" BOARD FINDINGS (NO DEADLINE) · 17 NOV: Q3 RESULTS · 18 NOV: HOUSE BRIEFING REQUEST · A NAMED SUCCESSOR?
- **Source on screen:** NVIDIA (results date, 28 Oct release); House committee letter via Yahoo / Reuters, 9 Nov

**n83 · 6:15** · scene: `strips`

> And remember: nothing has been proven, no one has been charged, and Jensen is still the boss. We'll update this video when the investigation ends.

- **On screen:** Strips: NOT PROVEN · NO CHARGES · STILL CEO
- **Visual:** jensen/portrait_2023.jpg (pic)

### Sources (6:25)

**n90 · 6:25** · scene: `sources → end`

> All our sources are on screen and in the description. This video is for education. It is not investment advice. If it helped, subscribe to Moat Atlas.

- **On screen:** Sources list · Disclaimer: Education, not investment advice. Allegations are unproven; no charges filed. Facts as of 9 Nov 2026.

## Shorts (9:16, cut from the same beats)

| Short | Beats | Hook line |
| --- | --- | --- |
| Why NVIDIA's customers can't leave | n50, n51, n52, n53 | "Six million programmers can't easily leave NVIDIA. Here's why." |
| NVIDIA's own warning about succession | n60, n61, n62 | "NVIDIA's annual report already warned about this." |
| The two bets that built NVIDIA | n23, n24, n25, n26 | "In 1993 they planned it at a Denny's. Then came the strange bet." |

## Thumbnail and title

- **Title:** Will NVIDIA Survive Without JENSEN? Explained Like You're 5
- **Thumbnail:** an empty black leather jacket on a chair, a green chip glowing on the seat, a big red "?" stamp. Text: WITHOUT JENSEN? No SPY, no CHARGED, no photo of the woman named in reports.

## Before recording

1. **UPDATE n13:** put Monday 9 Nov's closing price in place of the pre-market figure, and re-check the −13% figure.
2. **VERIFY n62:** find Huang's own interview for "about sixty direct reports", or cut the line (the beat works without it).
3. **VERIFY n71:** pull monthly share prices for Apple (from Aug 2011) and Microsoft (from Jan 2000), cite the provider on screen, and confirm Microsoft regained its 1999 high in 2016.
4. **Crop the clips** from the 10-K PDF: Item 1A p.23 (succession wording, n61) and Item 1 ("runs on all NVIDIA GPUs", n51).
5. **Fetch the pending photos** (`python3 scripts/fetch_pics.py public/vx/nvidia_jensen/img`). Every beat already has a fallback from the 22 photos on hand.
6. **Source the Denny's story (n21)** with NVIDIA's or Denny's own account (Denny's marked the booth in 2023), and show it on screen.
7. **Re-check the news** the morning you publish: the board probe, the 17 Nov results and the 18 Nov briefing may have moved.

## Sources (description)

- NVIDIA Form 10-K, fiscal year ended 25 Jan 2026 (filed 25 Feb 2026): revenue, net income, customers, staff, executive officers, Item 1A risk factors. https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- CNN, 8 Nov 2026: https://www.cnn.com/2026/11/08/business/nvidia-investigation-ceo-jensen-huang
- CNBC, 8 Nov 2026: https://www.cnbc.com/2026/11/08/nvidia-jensen-huang-investigation-china-spy.html
- CNBC, 9 Nov 2026 (shares): https://www.cnbc.com/2026/11/09/nvidia-jensen-huang-chinese-spy-investigation.html
- NPR, 8 Nov 2026: https://www.npr.org/2026/11/08/nx-s1-6034036/nvidia-launches-investigation-into-ceos-alleged-relationship-with-chinese-spy
- Yahoo Finance, 9 Nov 2026 (Friday close, pre-market, House briefing request): https://finance.yahoo.com/markets/stocks/articles/nvidia-shares-fall-more-4-111021784.html
- Yahoo Finance, "Jensen Huang just handed Wall Street its first $4.5 trillion CEO scandal": https://finance.yahoo.com/markets/article/jensen-huang-just-handed-wall-street-its-first-45-trillion-ceo-scandal-094803359.html
- NVIDIA Developer Forum, "20 Years of CUDA": https://forums.developer.nvidia.com/t/20-years-of-cuda-honoring-the-architects-of-the-accelerated-age/364654
- Krizhevsky, Sutskever, Hinton, "ImageNet Classification with Deep Convolutional Neural Networks", NeurIPS 2012 (trained on two GTX 580 GPUs).
- Photo credits: paste the attribution lines from `public/vx/nvidia_jensen/img/CREDITS.md` for every photo used.
