# Moat Atlas · "Anthropic's IPO Filing: Must Its Lead Be Won Every 6 Months?" · Vox Motion+ long-form script + 3 Shorts (for approval)

Video id `atlas_ants1`. **Status: DRAFT 2. Step 1 (script + ledger) and step 2 (independent fact-check, `EP_ANTHROPIC_S1_REVIEW.md`) are done, and every review fix is applied here. Not voiced, not built.** Build (step 3) starts only after AK signs off.
Source: Anthropic, PBC Form S-1, filed with the US SEC on 26 Oct 2026 (preliminary; some figures are still blank). Saved on the Mini: `~/jev_full/research/anthropic_s1_20261026/anthropicpbc-sx1.htm` (md5 `2a2a5e21ab6e90a2f17ace8c67d16154`, 14,169,252 bytes, fetched 26 Oct 2026 from sec.gov) and its text `anthropicpbc-sx1.txt` (made by `h2t.py` in the same folder). Draft 1 is kept in the session scratchpad only.

**Bias note:** Claude, which Anthropic makes, wrote this script, and a Claude model did the step-2 check. The end card and description say so (e05).

## Title (keep 3 for Test & Compare)
1. **Anthropic IPO Filing: Must Its Lead Be Won Every 6 Months?** (58 characters)
2. Anthropic Spent $1.04 per $1 in H1 2026. Where's the Moat? (58 characters)
3. Anthropic's S-1: 80% of Revenue From Brand-New Models (52 characters)

Keyword: "anthropic ipo" (YouTube autocomplete, 26 Oct 2026: "anthropic ipo", "anthropic ai ipo"; "anthropic s1" also listed).
Thumbnail (Moat Atlas rule: one number, max 4 words): a paper $1 bill with a red marker "$1.04" price tag, small grey "H1 2026" under it. Words: "$1.04 TO EARN $1".

## Format decisions (AK to confirm)
- **Look:** Vox Motion+ (cream paper, real document pages with highlighter, charts on black, big serif numbers), with Moat Atlas branding at the start and end (globe-in-ring mark, GLOBAL end card) and the Moat Atlas rules: calendar periods on screen, US$ as filed, source + as-of on every figure, no persona, no advice.
- **Anchor chart:** the Moat Atlas Sankey (`GLOBAL-sankey`) in chapter 2, split by function (cost of revenue / R&D / sales and marketing / G&A → operating loss), as the Moat Atlas plan requires.
- **Voice:** MiniMax speech-2.6-hd, `English_Diligent_Man`, as in Moat Atlas EP01. **Open for AK:** this is an Indian-accent voice on a channel for US/UK/European viewers. AK decides whether to sample another MiniMax English male voice.
- **Key:** MiniMax Go key (MINIMAX_GO_API_KEY).
- **Left out on purpose:** IPO price, share count, valuation, buy/sell/hold words (AGENTS.md rule 6, the Moat Atlas no-advice rule); Run-Rate Revenue and the compute-commitment totals (blank in this draft of the S-1); the TCS comparison (that was the Data Kadai story).

## Size and checks
`atlas_ants1_check.py` (this folder) at 2.6 spoken words a second, plus 0.42 s between beats and 1.1 s at chapter cards. Results are under "Check results" at the end of the Beats section.

## The story in one breath
In the first half of 2026 Anthropic booked $16.3 billion of revenue (a year earlier, $1.2 billion) and spent $1.04 in operating costs for every $1. Odd fact: over 80% of last quarter's revenue came from models released in the six months to September. Big question: if most of what pays the bills is under six months old, what does Anthropic own that a rival can't copy? Follow the dollar: about 15¢ to serve customers, 60¢ to research (mostly compute for the next models), 23¢ to sales, 6¢ to run the company; compute in all, 55¢. The half-year hides a turn: a Jan-Mar loss of $1.7 billion, then an Apr-Jun operating profit of $974 million. A year earlier, $2.84 per $1. Adjusted margin 10% (leaves out ~13¢ of stock pay, and more stock pay is due at listing). The $80.7 billion net loss is mostly a $72.4 billion non-cash charge on notes that convert to shares. Who pays: 80¢ billed by usage; $100k+ customers 950 → 11,900; NRR ~900%; top five 21% (a quarter over nine months). Moat test: customers spend more (yes, net); can a rival copy it (the filing's own frontier quote; Google and OpenAI with more resources and compute; the company's loop); does it make money (half-year no, June quarter yes, adjusted yes). Our reading: a speed moat. But: growth expected to slow, 5-7% revenue from rule-breakers, holiday dips, take-or-pay commitments to 2045, safety delays, and control sits with a trust and the founders. Verdict and three numbers to watch.

## Curiosity map
| Loop | Opens | Paid |
|---|---|---|
| **BIG:** what does Anthropic own that a rival can't copy in six months? | c04 | m05-m08 (the loop, labelled as the company's claim, then our reading), e01-e02 |
| L1: why $1.04? | c02 | d02-d04 |
| L2: the turn hidden inside the half-year | d04 | d04 (Jan-Mar loss, Apr-Jun profit) |
| L3: why is the net loss $80.7 billion? | d08 | d08 |
| L4: is it hooked on a few giants? | p04 | p04 |
| L5: why do new models matter so much? | c03 | m02-m03 |
| L6: what could break it? | b01 | b02-b07 |

## Through-line props (Vox Motion+)
- **The dollar:** a paper $1 bill (code-drawn, not a real banknote image). A manila PriceTag "$1.04" in c02, flips to "$2.84" (a year earlier) in d05, back to "$1.04" in e02.
- **The sand timer** stamped "6 MONTHS" (code-drawn): set down in c03, turned over in m03 and again in e01.
- **Sticky note** "COPY IN 6 MONTHS?" pinned in c04, unpinned in e01.
- **Never:** Anthropic, Claude, Google, OpenAI, Amazon or Microsoft logos as hero images (names as text stickers only); photos of real people (no founders shown or named); share-price lines; invented headlines or outlet names; the SEC website as a picture.

## Corner chips
`S-1 · 26 OCT 2026 · p.N` (prospectus page as printed; to fill at build), `COMPANY'S MEASURE` (every adjusted figure), `COMPANY'S CLAIM`, `COMPANY'S ESTIMATE`, `OUR ARITHMETIC`, `OUR READING`, `ILLUSTRATION`. Every chart shows its calendar period (e.g. "Jan-Jun 2026") and "US$".

## Beats
Narration as the voice will read it, with numerals written as figures (as they'll appear in captions). The build spells them out for the voice.

### 0 · Cold open

**c01**
> In the first six months of 2026, Anthropic, the company behind the AI model Claude, booked $16.3 billion of revenue. In the same six months a year earlier, it booked $1.2 billion.

- *On screen:* BigNumber slam "$16.3B" on black, SubLine "REVENUE · JAN-JUN 2026"; a small bar "$1.2B · JAN-JUN 2025" rises beside it, dwarfed. Name sticker ANTHROPIC (text only). · *Chip:* S-1 · *Ledger:* 1, 2, 3

**c02**
> On October 26, it filed to list its shares in the US. And the filing shows what that growth cost. In operating costs, it spent $1.04 for every $1 of revenue.

- *On screen:* DocPage: S-1 cover excerpt, retyped "Anthropic, PBC" + "Form S-1", highlighter on the date. Cut to the paper $1 bill; a PriceTag drops on a string and flips to "$1.04". · *Chip:* S-1 · OUR ARITHMETIC (16,979 ÷ 16,286) · *Ledger:* 4, 5

**c03**
> Now the strange part. Over 80% of last quarter's revenue came from models released in the six months to September. Most of what pays the bills is at most half a year old.

- *On screen:* WhipPan to a DocPage excerpt, highlighter across "accounted for over 80% of our revenue". The sand timer "6 MONTHS" sets down; sand starts falling. · *Chip:* S-1 · JUL-SEP 2026 · *Ledger:* 6

**c04**
> So, our question: if most of what pays the bills is that new, what does Anthropic own that a rival can't copy? To answer it, we'll follow the dollar.

- *On screen:* sticky note "COPY IN 6 MONTHS?" pinned in the corner (stays until e01). The $1 bill slides to centre. Moat Atlas mark stamps the corner. · *Ledger:* none (question)

### 1 · What Anthropic sells

**w01**
> Anthropic sells Claude three ways. Developers build it into their own software. People and companies use its own apps. And it's sold through the clouds of Amazon, Google and Microsoft, which are also its main compute suppliers, and investors and customers too.

- *On screen:* IconDiagram: three paths into a box CLAUDE: code brackets (developers), phone (apps), three clouds with text stickers AMAZON / GOOGLE / MICROSOFT (text only); arrows back from the clouds labelled COMPUTE, INVESTMENT. · *Chip:* S-1 · "THREE WAYS" = OUR GROUPING · *Ledger:* 7, 41

**w02**
> Consultancies like Accenture and Deloitte also bring it to their clients. And its flagship tool at work is Claude Code, which the filing calls its coding agent.

- *On screen:* text stickers ACCENTURE, DELOITTE drop on the diagram; a black code window types a few lines (code-drawn, no product screenshot), sticker "CODING AGENT". · *Chip:* S-1 · *Ledger:* 8, 9

### 2 · Follow the dollar

**d01**
> Here's where each dollar of revenue went, from January to June 2026. Every figure comes from the company's filing, or simple arithmetic on it.

- *On screen:* ChapterCard "FOLLOW THE DOLLAR". The Moat Atlas Sankey on black builds from the left: one blue band REVENUE $16.3B. · *Chip:* S-1 · JAN-JUN 2026 · US$ · *Ledger:* 1

**d02**
> Only about 15 cents of each dollar was the direct cost of serving customers, mostly the computing that runs Claude when they use it. About 60 cents went to research and development, mostly computing to build the next models.

- *On screen:* Sankey: a thin orange band COST OF REVENUE $2.4B "15¢"; then the widest band RESEARCH AND DEVELOPMENT $9.7B "60¢". Icons: server rack (serving), flask + chip (building). · *Chip:* S-1 · OUR ARITHMETIC (2,380 ÷ 16,286; 9,741 ÷ 16,286) · *Ledger:* 10, 11

**d03**
> 23 cents went to sales and marketing, and 6 to running the company. Counted another way, compute across all of it took 55 cents of every dollar, much of it bought from those same cloud companies.

- *On screen:* Sankey: SALES AND MARKETING $3.8B "23¢", GENERAL AND ADMINISTRATIVE $1.1B "6¢". Then a yellow overlay strip runs across all four bands: "COMPUTE IN ALL: 55¢". · *Chip:* S-1 · OUR ARITHMETIC · *Ledger:* 12, 13, 41

**d04**
> Add it up and it comes to $1.04, so over the half-year it lost about 4 cents on every dollar, before interest and other items. But the half hides a turn. From January to March, it lost $1.7 billion. From April to June, it made an operating profit of $974 million.

- *On screen:* the Sankey outflows overshoot the inflow; a red sliver OPERATING LOSS $0.7B "−4¢". PriceTag "$1.04" swings in. Then ChartBuild on black: two quarterly bars, JAN-MAR 2026 −$1.7B (red, below zero), APR-JUN 2026 +$974M (yellow, above zero, marker circle). · *Chip:* S-1 · quarterly results table · *Ledger:* 14, 15

**d05**
> A year earlier, in the first half of 2025, it spent $2.84 for every dollar it earned. In one year, the loss on each dollar shrank from $1.84 to 4 cents.

- *On screen:* the PriceTag flips back to "$2.84", red stamp "JAN-JUN 2025". ChartBuild: operating margin −184% (Jan-Jun 2025) and −4% (Jan-Jun 2026). · *Chip:* S-1 · OUR ARITHMETIC (3,298 ÷ 1,163) · *Ledger:* 16, 17

**d06**
> On the company's own adjusted measure, which leaves out stock-based pay, about 13 cents per dollar, its operating margin was 10%. And a further stock-pay charge will be booked when the listing takes effect. The filing leaves that amount blank.

- *On screen:* BigNumber "10%", SubLine "ADJUSTED OPERATING MARGIN · COMPANY'S MEASURE"; beside it a struck-out tag "STOCK-BASED PAY 13¢ · NOT COUNTED". Then a blank tag "AT LISTING: $ ___" with a red marker circle. · *Chip:* COMPANY'S MEASURE · *Ledger:* 18, 19, 20

**d07**
> Cash from operations was positive too: $3.9 billion in those six months, helped by $1.1 billion of interest on its cash. A year before, $1.5 billion went out.

- *On screen:* two coin piles on paper: red pile sliding out "−$1.5B · JAN-JUN 2025", green pile sliding in "+$3.9B · JAN-JUN 2026", a small sticker on the green pile "INCL. $1.1B INTEREST INCOME". · *Chip:* S-1 · cash flow statement · *Ledger:* 21, 22

**d08**
> So why is the filing's net loss $80.7 billion? Because $72.4 billion of it is an accounting charge on its convertible notes, which rose in value as the company's value rose.

- *On screen:* waterfall on black starts: NET LOSS −$80.7B; the first add-back NOTE VALUE CHARGE +$72.4B climbs. · *Chip:* S-1 · *Ledger:* 23, 24

**d09**
> It isn't cash. The notes are set to turn into shares, so the cost shows up as more shares, not money out. On its own adjusted measure, net income was $2.7 billion.

- *On screen:* the waterfall continues: OTHER FAIR-VALUE ITEM +$8.7B (chip "ALSO NON-CASH"), STOCK PAY +$2.2B, OTHER +$0.1B; lands at ADJUSTED NET INCOME +$2.7B (green, chip COMPANY'S MEASURE). · *Chip:* S-1 · *Ledger:* 23, 24, 25, 26

**d10**
> And it isn't short of money. At the end of June, it held $112.4 billion in cash and $19.3 billion in short-term investments, from $141.1 billion raised so far.

- *On screen:* three PriceTags on strings: RAISED $141.1B / CASH $112.4B / SHORT-TERM INVESTMENTS $19.3B · JUN 30, 2026. · *Chip:* S-1 · *Ledger:* 27

### 3 · Who pays?

**p01**
> Who pays? 80 cents of each dollar is billed by usage, some of it under contracts with a minimum spend. The other 20 cents are subscriptions.

- *On screen:* the $1 bill tears into two strips, 80¢ BILLED BY USAGE / 20¢ SUBSCRIPTIONS (Moat Atlas mix bar style). · *Chip:* S-1 · JAN-JUN 2026 · OUR ARITHMETIC (13,064 ÷ 16,286) · *Ledger:* 28, 29

**p02**
> Customers paying over $100,000 a year jumped from more than 950 to more than 11,900 in twelve months. More than 1,900 now pay over a million dollars a year, and about 250 pay over ten million.

- *On screen:* Counter 950 → 11,900, SubLine "CUSTOMERS PAYING $100K+ A YEAR · SEP 2025 → SEP 2026"; then a three-step pyramid $100K+ 11,900 / $1M+ 1,900 / $10M+ 250. · *Chip:* S-1 · TRAILING 12 MONTHS · *Ledger:* 30, 31

**p03**
> Taken together, customers who paid in the September quarter of 2025, not counting its Pro and Max subscribers, paid about nine times as much a year later. The company calls this net revenue retention: about 900%.

- *On screen:* one small coin stack "JUL-SEP 2025" grows into a stack nine times taller "JUL-SEP 2026"; BigNumber "~900%", SubLine "NET REVENUE RETENTION · COMPANY'S MEASURE · EXCLUDES PRO AND MAX". · *Chip:* COMPANY'S MEASURE · *Ledger:* 32

**p04**
> Is it hooked on a few giants? Less than before. Its top five customers paid about 21% of revenue last quarter, down from about 36% in the March quarter. Over the first nine months, they were about a quarter, and many top customers can cut spending at any time.

- *On screen:* two PictogramGrids (100 squares): 36 red (JAN-MAR 2026) → 21 red (JUL-SEP 2026). Sticker "JAN-SEP 2026: ABOUT 25% · NO CUSTOMER OVER 10%". · *Chip:* S-1 · OUR ARITHMETIC (100 − 79; 100 − 64) · *Ledger:* 33, 34

**p05**
> The company argues there's room to grow. Over half the Fortune 500 pay it at least $100,000 a year, yet on average that's under a tenth of one percent of those listed companies' expenses.

- *On screen:* a long paper receipt "A LISTED FORTUNE 500 COMPANY'S EXPENSES" (ILLUSTRATION) unrolls; one tiny line at the bottom highlighted "CLAUDE: UNDER 0.1% · JUL-SEP 2026". · *Chip:* COMPANY'S CLAIM · *Ledger:* 35

### 4 · The moat test

**m01**
> Now the Moat Atlas moat test. Three questions. One: do customers spend more over time? Net of any who leave, yes. Two: can a rival copy what they're buying? Three: does it make money from them?

- *On screen:* ChapterCard "THE MOAT TEST". Three paper cards: 1 SPEND MORE? (green tick), 2 COPY?, 3 PROFIT?. · *Ledger:* 32

**m02**
> Question two is where the filing is frank: "Customers adopt and retain our technology based on whether our models are at the frontier of AI capability and maintaining that frontier position is essential to revenue generation."

- *On screen:* DocPage excerpt of that sentence, highlighter wipe, push-in. · *Chip:* S-1 · QUOTE · *Ledger:* 36

**m03**
> That's why new models matter so much. Models released in the six months to September brought in over 80% of last quarter's revenue. The company says each release also opens up new uses, and its latest top model cut customers' cost per task by about 40%.

- *On screen:* the sand timer turns over. PictogramGrid: 80+ squares fill yellow "MODELS RELEASED APR-SEP 2026", rest grey. Then a small tag "COST PER TASK −40% · OPUS 5.5 VS OPUS 5 · COMPANY'S CLAIM". · *Chip:* S-1 · *Ledger:* 6, 37, 38

**m04**
> It names Google and OpenAI as its main rivals, and says many competitors have "substantially greater financial, technical, and marketing resources" than it does, and their own or greater access to compute.

- *On screen:* text stickers GOOGLE and OPENAI (no logos) slide onto the paper beside ANTHROPIC; DocPage excerpt with the quote highlighted. · *Chip:* S-1 · QUOTE · *Ledger:* 39, 40

**m05**
> So what can't a rival copy quickly? The company says it has a loop. Compute trains a better model. A better model serves more customers. And serving customers teaches it what to build next.

- *On screen:* IconDiagram circle, arrows drawing round: CHIP → MODEL → CUSTOMERS → back to CHIP; sticker "COMPANY'S CLAIM". The sticky note "COPY IN 6 MONTHS?" wiggles. · *Chip:* COMPANY'S CLAIM · *Ledger:* 42

**m06**
> The company says the loop runs inside it too. Over 90% of the contributions to its own codebase in September 2026 were written by Claude. Since the end of 2024, its headcount grew over five times, and its quarterly revenue became 86 times larger.

- *On screen:* code window with lines tagged "CLAUDE" in yellow, counter "90%+ · SEP 2026". Then ChartBuild: HEADCOUNT ×5+ (Dec 2024 → Sep 2026), QUARTERLY REVENUE ×86 (Oct-Dec 2024 → Jul-Sep 2026), key bar yellow. · *Chip:* COMPANY'S CLAIM · *Ledger:* 43, 44

**m07**
> Three: does it make money from them? Over the half-year, on the standard accounts, not yet: minus 4 cents per dollar, though the June quarter was in profit. On its own adjusted measure, its operating margin was 10%.

- *On screen:* card 3 PROFIT? gets three stamps: "−4¢ · JAN-JUN" (red), "IN PROFIT · APR-JUN" (yellow), "10% · COMPANY'S MEASURE" (green). · *Chip:* S-1 · COMPANY'S MEASURE · *Ledger:* 14, 15, 18

**m08**
> Our reading: a speed moat, not a wall. A rival with enough compute can run the same loop, and the filing says some have more. So the lead has to be won again with every new model.

- *On screen:* a paper castle wall dissolves into a running track; the sand timer sits at the start line. Stamp "SPEED MOAT · OUR READING". · *Chip:* OUR READING · *Ledger:* 36, 40

### 5 · But...

**b01**
> But. Here are six things in the filing that a moat story could skip.

- *On screen:* PauseCard "BUT…" in red marker; six numbered index cards fan out. · *Ledger:* none

**b02**
> One: the company says its growth may not be sustainable, and expects its growth rate to decline, possibly sharply.

- *On screen:* card 1: DocPage excerpt "We expect our revenue growth rate to decline over time" highlighted. · *Chip:* S-1 · RISK FACTORS · *Ledger:* 45

**b03**
> Two: by its own estimate, about 5 to 7% of revenue in the first nine months of 2026 came from customers it later found breaking its usage rules. It expects that share to fall as it enforces its rules, and says that may reduce its revenue and growth.

- *On screen:* card 2: a strip of the $1 bill (5-7¢) torn off and pinned aside, sticker "USAGE-RULE BREAKERS · JAN-SEP 2026". · *Chip:* COMPANY'S ESTIMATE · *Ledger:* 46

**b04**
> Three: spending moves with the calendar. In the last two weeks of 2025, customer spending was about 20% lower than in the two weeks before.

- *On screen:* card 3: two side-by-side blocks on black, "DEC 6-19, 2025" and "DEC 20, 2025-JAN 2, 2026: ≈ −20%". · *Chip:* S-1 · *Ledger:* 47

**b05**
> Four: the bills are fixed and long. Some compute contracts oblige it to pay whether or not it uses the capacity, and its commitments run to 2045. The amounts are still blank in this draft.

- *On screen:* card 4: a paper tape measure of years unrolling 2026 → 2045; DocPage excerpt "regardless of actual utilization" highlighted; the blank "$ ." circled in red. · *Chip:* S-1 · PRELIMINARY · *Ledger:* 48, 49

**b06**
> Five: it has delayed the release of models for safety reasons before, and says such steps could slow its gains compared with rivals that don't take them.

- *On screen:* card 5: a paper calendar with a release date pushed back by a red arrow; sticker "DELAYED FOR SAFETY · COMPANY'S DISCLOSURE". · *Chip:* S-1 · *Ledger:* 50

**b07**
> Six: control. Anthropic is a public benefit corporation. A trust with no financial stake can elect most of the board, and a founders' share carries 50.1% of the votes. Together they can elect every director. People who buy the listed shares get a minority of the votes.

- *On screen:* card 6: paper org chart: LONG-TERM BENEFIT TRUST → "ELECTS A MAJORITY" → BOARD; FOUNDERS' SHARE "50.1% OF VOTES"; LISTED SHARES "MINORITY OF VOTES"; sticker "CONTROLLED COMPANY". · *Chip:* S-1 · *Ledger:* 51, 52, 53

### 6 · Verdict

**e01**
> So, back to our question. What does Anthropic own that a rival can't copy in six months? Not any one model. Over 80% of last quarter's revenue came from models released in the six months to September.

- *On screen:* the sticky note unpins and floats to the centre; the sand timer runs out and is turned over again. · *Chip:* OUR READING · *Ledger:* 6

**e02**
> Our reading: what it has is a loop. About 40 million smaller customers, people and organisations, more than 11,900 paying over $100,000 a year, and the compute that turns their money into the next model. A rival with enough compute can run a loop too.

- *On screen:* the loop diagram returns with stickers "≈40M CUSTOMERS UNDER $100K" and "11,900+ AT $100K+"; a second, grey loop labelled RIVAL draws beside it. · *Chip:* OUR READING · *Ledger:* 54, 30, 40

**e03**
> So, our verdict. Moat: a speed moat, won again with every release. Margin: about break-even over the half-year on the standard accounts, in profit in the June quarter, and 10% on its own adjusted measure.

- *On screen:* two verdict stamps slam: MOAT: SPEED MOAT and MARGIN: −4% JAN-JUN · PROFIT APR-JUN · 10% ADJUSTED. The PriceTag flips back to "$1.04". · *Chip:* OUR READING · *Ledger:* 14, 15, 18

**e04**
> Three numbers to watch in its next filing. Compute's share of each dollar: 55 cents in the first half. Revenue from models under six months old: over 80% last quarter. And the top five customers: about 21% last quarter.

- *On screen:* three index cards pinned in a row (55¢ · 80%+ · 21%), each with "NEXT FILING: ?". · *Chip:* OUR ARITHMETIC · *Ledger:* 13, 6, 33

**e05**
> Next, see how TSMC, the company that makes the chips AI runs on, earns its money.

- *On screen:* the GLOBAL end card: two video slots (TSMC breakdown + Shorts playlist) and subscribe; credit lines "Research: Moat & Margin research team · Narration: synthetic voice" and **"Script drafted with Claude, an AI model made by Anthropic, the company in this video. Every figure checked against the S-1."** (also in the description). · *Chip:* OUR ARITHMETIC · *Ledger:* 13, 6, 33

### Check results
`atlas_ants1_check.py`, 27 Oct 2026, on draft 2: **1,406 spoken words, 40 beats, about 9:27**; big question at about 0:38 (c04); the "But" turn at about 6:50 (72%); no beat over 20 s; all 55 ledger rows' anchors found in the saved S-1 text. Real length comes from the voice.

```
c01  0:01.1  12.3s  32 words
c02  0:13.8  11.9s  31 words
c03  0:26.2  12.7s  33 words
c04  0:39.3  11.2s  29 words
w01  0:52.0  16.2s  42 words
w02  1:08.5  10.4s  27 words
d01  1:20.4   9.2s  24 words
d02  1:30.1  15.0s  39 words
d03  1:45.5  13.8s  36 words
d04  1:59.8  19.6s  51 words
d05  2:19.8  11.9s  31 words
d06  2:32.2  15.4s  40 words
d07  2:48.0  10.8s  28 words
d08  2:59.1  11.9s  31 words
d09  3:11.5  12.3s  32 words
d10  3:24.2  11.2s  29 words
p01  3:36.9  10.0s  26 words
p02  3:47.3  13.8s  36 words
p03  4:01.6  13.8s  36 words
p04  4:15.8  18.8s  49 words
p05  4:35.1  13.1s  34 words
m01  4:49.7  13.8s  36 words
m02  5:04.0  13.8s  36 words
m03  5:18.2  17.7s  46 words
m04  5:36.3  12.3s  32 words
m05  5:49.1  13.1s  34 words
m06  6:02.6  16.9s  44 words
m07  6:19.9  14.6s  38 words
m08  6:35.0  14.2s  37 words
b01  6:50.7   5.4s  14 words
b02  6:56.5   7.3s  19 words
b03  7:04.2  18.5s  48 words
b04  7:23.1   9.6s  25 words
b05  7:33.2  13.5s  35 words
b06  7:47.0  10.4s  27 words
b07  7:57.8  18.1s  47 words
e01  8:17.4  14.2s  37 words
e02  8:32.1  17.3s  45 words
e03  8:49.8  13.5s  35 words
e04  9:03.7  15.0s  39 words
e05  9:19.1   6.2s  16 words
TOTAL 1406 words, 9:26.8
anchors not found: 0
```

## The 3 Shorts (cut from the film, 30-50 s each, 9:16, Moat Atlas Short rules: hook headline in frame 1, captions, last 3 s points to the long video)

**S1 · "Anthropic spent $1.04 for every $1"** (the $1 split: the `GLOBAL-short-split` coin grid built on 26 Oct, re-timed to the voice; the closing caption changes to the long-video pointer)
> In the first half of 2026, Anthropic spent $1.04 in operating costs for every $1 of revenue. 55 cents went to compute. 19 to people. 19 to sales and partners. 11 to everything else. A year earlier, it spent $2.84. And from April to June, it made an operating profit. The full breakdown is on Moat Atlas.
- Hook headline: "Anthropic spent $1.04 | for every $1 it earned". · *Ledger:* 4, 13, 55, 16, 15

**S2 · "80% of its revenue came from brand-new models"**
> Over 80% of Anthropic's revenue last quarter came from models released in the six months to September. Its filing says customers adopt and keep Claude based on whether its models are at the frontier. Our reading: that makes it a race, run again with every release. The full story is on Moat Atlas.
- Hook headline: "80% of its revenue: | models under 6 months old". Visual: sand timer + 100-square grid + the DocPage quote. · *Ledger:* 6, 36

**S3 · "The $80.7B loss that's mostly not cash"**
> The filing shows Anthropic's net loss for the first half of 2026: $80.7 billion. But $72.4 billion of that is an accounting charge on its convertible notes, which rose in value as the company did. It isn't cash. Its operations actually brought in $3.9 billion of cash. The full breakdown is on Moat Atlas.
- Hook headline: "The $80.7B loss | that's mostly not cash". Visual: the d08 waterfall in portrait (bars stacked vertically). · *Ledger:* 23, 24, 21

## Ledger
Every spoken fact and every on-screen figure, against the saved S-1 text (`[S]` = `anthropicpbc-sx1.txt`). "Anchor" is an exact substring of [S] after removing all whitespace and table pipes from both. Rows marked OURS are arithmetic on anchored lines. Line numbers (L) are in [S]; the step-2 review cites the same lines.

| # | Claim | Beats | Anchor in [S] | Note |
|---|---|---|---|---|
| 1 | Revenue Jan-Jun 2026 $16,286 m ("$16.3 billion") | c01 d01 | `Revenue $ 41 | $ 386 | $ 4,585 | $ 1,163 | $ 16,286` | |
| 2 | Revenue Jan-Jun 2025 $1,163 m ("$1.2 billion") | c01 | same row | |
| 3 | Anthropic is the company behind Claude | c01 | `Our frontier AI, Claude, is delivered to customers through our models, platform, and applications` | |
| 4 | Total operating expenses Jan-Jun 2026 $16,979 m → $1.04 per $1 | c02 d04 S1 | `Total operating expenses 592 | 3,366 | 12,645 | 3,298 | 16,979` | OURS: 1.0426 |
| 5 | Filed 26 Oct 2026; offering of Class A common stock | c02 | `offering of shares of Class A common stock of Anthropic, PBC` | Date from EDGAR |
| 6 | Models released in the six months to 30 Sep 2026 = over 80% of Jul-Sep 2026 revenue | c03 m03 e01 e04 S2 | `model versions released in the six months ended September 30, 2026 accounted for over 80% of our revenue for the three months ended September 30, 2026` | |
| 7 | Sold via its platform, its apps, and AWS, GCP, Azure | w01 | `Claude is accessible on all three major cloud platforms` | "Three ways" is our grouping |
| 8 | SIs such as Accenture, Deloitte | w02 | `Claude through SIs, such as Accenture, Deloitte, KPMG, and PwC` | |
| 9 | Claude Code is its coding agent | w02 | `Claude Code, our coding agent` | |
| 10 | Cost of revenue Jan-Jun 2026 $2,380 m (≈15¢); substantially all compute for customer-serving workloads | d02 | `Cost of revenue (1) $ 26 | $ 752 | $ 2,773 | $ 1,019 | $ 2,380` / `Substantially all of cost of revenue consists of compute and infrastructure costs associated with customer-serving workloads` | OURS: 14.6% |
| 11 | R&D $9,741 m (≈60¢); primarily compute for model development | d02 | `Research and development (2) 422 | 2,275 | 6,338 | 1,850 | 9,741` / `Research and development expenses primarily consist of compute and infrastructure costs associated with model development` | OURS: 59.8% |
| 12 | Sales and marketing $3,808 m (≈23¢); G&A $1,050 m (≈6¢) | d03 | `Sales and marketing (3) 76 | 163 | 911 | 239 | 3,808` / `General and administrative (4) 68 | 176 | 1,123 | 190 | 1,050` | OURS: 23.4%, 6.4% |
| 13 | Compute and infrastructure = 55% of revenue | d03 e04 S1 | `Compute and infrastructure 1,056 | 653 | 160 | 201 | 55` | % of revenue table |
| 14 | Operating margin Jan-Jun 2026 −4% | d04 m07 e03 | `Operating loss (1,344) | (772) | (176) | (184) | (4)` | |
| 15 | Quarterly: Jan-Mar 2026 operating loss $1,667 m on revenue $4,731 m; Apr-Jun 2026 operating income $974 m on $11,555 m | d04 m07 e03 S1 | `Operating income (loss) (935) | (1,200) | (3,089) | (2,836) | (1,667) | 974` / `$ 4,731 | $ 11,555` | "$1.7 billion" = 1,667 rounded |
| 16 | Jan-Jun 2025: opex $3,298 m on $1,163 m → $2.84 per $1 | d05 S1 | rows 4 + 1 | OURS: 2.836 |
| 17 | Operating margin Jan-Jun 2025 −184% (loss per $1 = $1.84) | d05 | row 14 | |
| 18 | Adjusted Operating Margin Jan-Jun 2026 10%; excludes stock-based compensation, non-cash charitable contributions, Bartz settlement | d06 m07 e03 | `Adjusted Operating Margin (1,273) % | (722) % | (106) % | (159) % | 10 %` / `We define Adjusted Operating Income (Loss) as operating loss excluding (i) stock-based compensation expense` | Company's measure |
| 19 | Stock-based compensation Jan-Jun 2026 $2,185 m (≈13¢ per $1) | d06 | `Stock-based compensation expense 29 | 192 | 1,165 | 286 | 2,185` | OURS: 13.4% |
| 20 | Further stock-pay charge for RSUs that vest when the registration statement becomes effective; amount blank | d06 | `Pro forma adjustment to record stock-based compensation expense related to RSUs for which the performance-based vesting condition will be satisfied upon the effectiveness of the registration statement` | |
| 21 | Operating cash flow +$3,929 m (Jan-Jun 2026) vs −$1,513 m (Jan-Jun 2025) | d07 S3 | `Operating activities $ (1,627) | $ (5,692) | $ (2,637) | $ (1,513) | $ 3,929` | |
| 22 | Interest income Jan-Jun 2026 $1,111 m | d07 | `Interest income 69 | 106 | 431 | 115 | 1,111` | |
| 23 | Net loss Jan-Jun 2026 $80.7 billion | d08 S3 | `and $80.7 billion for the six months ended June 30, 2026` | |
| 24 | $72.4 billion fair-value change, driven by the notes' higher value as the company's valuation rose; non-cash (added back in cash flow) | d08 S3 | `primarily driven by an increase in the fair value of our outstanding convertible promissory notes resulting from an increase in our enterprise valuation` | Non-cash add-back confirmed in step 2 (cash flow reconciliation, L19397-19430) |
| 25 | Notes convert into shares (Convertible Notes Conversion at the offering) | d08 | `Pro forma adjustment to eliminate the change in fair value recognized related to the Convertible Notes Conversion` | "set to turn into shares" |
| 26 | Adjusted Net Income Jan-Jun 2026 $2,671 m; mark-to-market item $8,720 m | d08 | `Adjusted Net Income (Loss) $ (457) | $ (2,683) | $ (4,448) | $ (1,741) | $ 2,671` / `Change in fair value of certain mark-to-market financial instruments — | — | 3 | — | 8,720` | Company's measure |
| 27 | Raised $141.1 billion; cash and equivalents $112.4 billion; short-term investments $19.3 billion (30 Jun 2026) | d10 | `raised an aggregate of $141.1 billion of capital and had cash and cash equivalents of $112.4 billion and short- term investments of $19.3 billion` | |
| 28 | Consumption-based $13,064 m (80%); subscription $3,222 m | p01 | `Consumption-based $ 39 | $ 288 | $ 3,796 | $ 983 | $ 13,064` / `Subscription-based 2 | 98 | 789 | 180 | 3,222` | OURS: 80.2% |
| 29 | Some enterprise contracts have minimum spend, booked mainly as consumption revenue | p01 | `A growing number of enterprise customers agree to non-cancelable annual or multi-year contracts with minimum spend commitments` | |
| 30 | $100k+ TTM customers: more than 950 → more than 11,900 | p02 e02 | `We had more than 11,900 customers with $100,000 or more of revenue on a TTM basis as of September 30, 2026, up from more than 950 as of September 30, 2025` | |
| 31 | More than 1,900 at $1m+; about 250 at $10m+ | p02 | `more than 1,900 customers with $1 million or more of revenue on a TTM basis and approximately 250 customers with $10 million or more of revenue on a TTM basis` | |
| 32 | NRR about 900% (30 Sep 2026); group ratio; base = quarter a year earlier; excludes Pro and Max; net of leavers | p03 m01 | `Net Revenue Retention of approximately 900% as of September 30, 2026` / `excluding subscribers to our Claude Pro and Max plans` / `The Base Period is the three months ending a year prior to the measurement date` | |
| 33 | Top five 21% of Jul-Sep 2026 revenue; 36% of Jan-Mar 2026 | p04 e04 | `Approximately 79% of our revenue came from customers outside of our top five customers for the three months ended September 30, 2026, up from approximately 64% for the three months ended March 31, 2026` | OURS |
| 34 | Top five about 25% of Jan-Sep 2026; no customer over 10%; many top customers can cut spending at any time | p04 | `our top five customers represented approximately 25% of our revenue for the nine months ended September 30, 2026` / `are able to reduce or in some cases cease spending at any time and for any reason` | |
| 35 | Over 50% of Fortune 500 are $100k+ customers; under 0.1% of their expenses on average (Jul-Sep 2026; listed companies only) | p05 | `Over 50% of the Fortune 500 and over 30% of the Global 2000 were customers with $100,000 or more of revenue` / `representing, on average, less than 0.1% of their total expenses` / `we include only Fortune 500 customers that are publicly traded` | Company's claim ("we believe") |
| 36 | Frontier quote (full sentence) | m02 m08 S2 | `Customers adopt and retain our technology based on whether our models are at the frontier of AI capability and maintaining that frontier position is essential to revenue generation` | Word for word |
| 37 | New releases open new uses | m03 | `As we have released successive versions of Claude models, we have continued to see revenue growth as new capabilities unlock additional use cases` | |
| 38 | Opus 5.5 cut customer cost per task about 40% vs Opus 5 | m03 | `Claude Opus 5.5 reduced customer costs per task by approximately 40% compared to Claude Opus 5` | Company's claim |
| 39 | Primary competitors Google and OpenAI | m04 | `Our primary competitors in this category include Alphabet Inc.` / `and OpenAI Group PBC (“OpenAI”)` | |
| 40 | Competitors' greater resources and compute access | m04 m08 e02 | `Many have substantially greater financial, technical, and marketing resources than we do, their own or greater access to sources of compute` | Word for word |
| 41 | Amazon, Google, Microsoft: compute suppliers, investment relationships, customers | w01 d03 | `We rely on a limited number of CSPs—Amazon.com, Inc.` / `some of which have strategic and investment relationships with us and are our customers` | "much of it bought from those same cloud companies" = our wording of the CSP reliance |
| 42 | The loop (company's claim) | m05 | `We operate an iterative cycle in which compute deployed to model development yields more capable and efficient models` / `serving our customers at scale generates feedback that informs research and model development` | Paraphrase, labelled COMPANY'S CLAIM |
| 43 | Over 90% of codebase contributions in Sep 2026 written by Claude | m06 | `Over 90% of the contributions to our codebase in September 2026 were written by Claude` | Company's claim |
| 44 | Headcount over five times; Jul-Sep 2026 revenue 86 times Oct-Dec 2024 | m06 | `our headcount grew over five times, while our revenue for the three months ended September 30, 2026 was 86 times our revenue for the three months ended December 31, 2024` | |
| 45 | Growth may not be sustainable; growth rate expected to decline, possibly significantly | b02 | `our revenue growth may not be sustainable, and our rate of growth may decrease` / `We expect our revenue growth rate to decline over time, and it may decline significantly and more rapidly than we anticipate` | |
| 46 | 5-7% of Jan-Sep 2026 revenue from usage-policy violators (estimate); expects decline; enforcement may reduce revenue and growth | b03 | `revenue from such customers represented approximately 5% to 7% of our revenue for the nine months ended September 30, 2026` / `We expect the percentage of revenue from customers using our` / `Our continued enforcement efforts may reduce our revenue, Run-Rate Revenue, and growth rates in future periods` | |
| 47 | Two weeks ended 2 Jan 2026 about 20% below the two weeks ended 19 Dec 2025 | b04 | `for the two weeks ended January 2, 2026, total customer spend declined by approximately 20% compared to the prior two weeks ended December 19, 2025` | |
| 48 | Take-or-pay: pay regardless of use; substantial fixed obligations | b05 | `obligate us to pay for resources regardless of actual utilization. These commitments represent substantial fixed obligations` | |
| 49 | Commitments to 2045; amounts blank | b05 | `substantially all of the remainder is expected to be incurred between 2031 and 2045` / `aggregate committed spend of more than $ .` | |
| 50 | Delayed model releases for safety (Mythos, Project Glasswing); could slow gains vs rivals | b06 | `In the past these measures have included delaying the release of models and limiting their initial availability` / `These measures could slow our capability gains relative to competitors that do not adopt` | |
| 51 | PBC; LTBT financially disinterested, generally can elect and remove a majority of the board | b07 | `a financially disinterested trust, which we refer to as the Long-Term Benefit Trust (the “LTBT”) and which generally has the power to elect and remove a majority of the authorized members of our board of directors` | |
| 52 | Founders' Class F: 50.1% of total voting power, no economic rights; LTBT + Founder LLC can elect all directors | b07 | `will be entitled to an aggregate number of votes that equals 50.1% of the total voting power` / `Collectively, the LTBT and the Founder LLC will have the ability to elect all members of our board of directors` | |
| 53 | Controlled company | b07 | `We are considered a “controlled company” within the meaning of the Nasdaq Global Select Market corporate governance requirements` | "listed shares get a minority of the votes" = OURS from row 52 |
| 54 | About 40 million customers each under $100k TTM (customer = prosumer or organisation that uses its products) | e02 | `was generated by approximately 40 million customers, each with less than $100,000 of revenue on a TTM basis` / `refers to a prosumer or an organization that uses our models, platform, or applications` | |
| 55 | Nature split for S1: personnel 19%, sales/marketing/partnerships 19%, other 11% of revenue | S1 | `Personnel 232 | 118 | 40 | 46 | 19` / `Sales, marketing, and partnerships 5 | 11 | 12 | 10 | 19` / `Other operating and administrative 151 | 90 | 31 | 26 | 11` | |
