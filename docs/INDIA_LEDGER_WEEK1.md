# India Ledger: week 1 plan (19–26 Nov 2026)

**AK, 18 Nov 2026:** one long video and five Shorts this week. Two Shorts tell the long video's story as native Reveal
Loops (never clips), and three stand on their own. The long video follows the five-act Data Paradox
([`INDIA_LEDGER_PLAN.md`](INDIA_LEDGER_PLAN.md) section 2). Every Short follows the Reveal Loop
([`SHORTS_FORMAT.md`](SHORTS_FORMAT.md)) and passes `python3 scripts/shorts_check.py <id>` before it is rendered.

**"Data is the backbone, the story is the muscle" (AK, 18 Nov).** Every number in the episode comes out of
`python3 scripts/india_ledger_gold.py`, which holds the typed-in figures with their sources, does all our arithmetic, and
states its assumptions. Change a number there and nowhere else.

## 1. Why this story (the topic test)

Household gold ("Indians own 31,000 tonnes") has been done everywhere. This episode is about the **bet the government made
on that gold, and lost**. That story has not been told with the numbers.

| Test | Pass? | Why |
| --- | --- | --- |
| Familiar | Yes | Every family has gold and an opinion on it; "your mother's gold" is recognised in one second |
| Hidden | Yes | Almost nobody knows that the government sold gold it never owned, or that it owes ₹1.64 lakh crore on it |
| Send | Yes | To the family group ("Amma was right"), and by every gold-bond holder ("we're on the winning side") |
| **Paradox** | Yes | The same rise in the gold price made families richer and the government poorer |
| **Suspense** | Yes | "How do you lose money on gold that only goes up?" can't be answered from the hook; the answer lands at about 6 minutes |
| **Why now** | Yes | The payouts have started (D26), ₹80,000 crore can be called in at the holders' choice (D27), the 1 Feb 2027 Budget must provide for the wave ahead (D28), and a third attempt to mobilise household gold is on the table (D29) |

## 2. The data backbone (checked 18 Nov 2026)

Status: **✓P** primary source read · **✓S** secondary report of a primary source · **≈** our estimate, with its assumptions on screen · **VERIFY** still to check

| # | Fact | Number | Status | Source |
| --- | --- | --- | --- | --- |
| D1 | The bonds and the deposit scheme launched together | 5 Nov 2015, New Delhi: the PM launched three schemes that day (Gold Monetisation Scheme, Sovereign Gold Bonds, India Gold Coins) | ✓P | PIB, Ministry of Finance, 5 Nov 2015 19:27 IST (relid 130260), read 18 Nov 2026 |
| D2 | Bonds are a government loan, not gold | Issued under the Government Securities Act, 2006 | ✓S | Wikipedia; RBI SGB page |
| D3 | The proceeds went into government borrowing; no gold was bought | — | ✓ | Confirmed by AK, 18 Nov 2026 |
| D4 | Bond terms | 2.5% a year (2.75% on the first), 8 years, exit after 5, redeemed at the IBJA 999 price | ✓S | RBI; Wikipedia |
| D5 | Total issued | 67 tranches, Nov 2015 – Feb 2024: 146.96 t for ₹72,274 crore | ✓S | RBI Annual Report 2023–24; MoF reply in Rajya Sabha |
| D6 | First tranche | Issued ₹2,684/g, redeemed ₹6,132/g (30 Nov 2023); RBI: 12.9% a year | ✓P / ✓S | RBI press release 2023–24/1359; Outlook Money |
| D7 | What a normal government loan cost that month | 7.75% (10-year bond, Nov 2015 average) | ✓S | FRED series INDIRLTLT01STM |
| D8 | Still outstanding | At most 122.8 t: 24 tranches (24.19 t) have matured and been repaid. The reported 125.3 t (Free Press Journal, Oct 2026) is stale | ✓S + ≈ | Tranche table `data/india_ledger/sgb_tranches.csv`; our arithmetic |
| D9 | Owed today | ₹1.64 lakh crore at ₹13,345/g, RBI's redemption price for 19 Nov 2026 (press release of 18 Nov 2026; was ₹1.72 lakh crore at ₹14,024/g on 13 Nov) | ≈ | our arithmetic; re-run with RBI's latest redemption price on the build day |
| D10 | Sensitivity | Every ₹1,000 on the price of a gram adds ₹12,277 crore | ≈ | our arithmetic |
| D11 | The real extra cost (vs borrowing normally) | **≈ ₹97,900 crore** at ₹13,345/g (₹73,300 crore at ₹11,345; ₹1.22 lakh crore at ₹15,345); ≈ ₹690 per Indian (142.6 crore people, MoHFW projection for 2026). Already paid: ₹11,087 crore on the 24 matured tranches. Matured bonds cost the government about 16.5% a year, against 7.1% on normal bonds | ≈ ✓ | Bond-by-bond model in `scripts/india_ledger_gold.py` (checked 18 Nov 2026): 67 tranches, totals match RBI; normal-bond rate = 10-year G-sec yield of each issue month (FRED). Not counted: tax-free gains and the ₹50/g online discount (both raise the cost), early redemptions at lower prices (lower it). Population cleared 18 Nov 2026 |
| D12 | Already paid to FY 2024–25 | ₹11,801 crore in redemptions, ₹6,055 crore in interest | ✓S | MoF, as reported |
| D13 | The reserve fund for redemptions | Covers about half of the outstanding bonds (Apr 2025) | ✓S | Business Today |
| D14 | The government's own verdict | "Fairly high-cost borrowing"; gold imports did not fall as expected (Ajay Seth, Economic Affairs Secretary, Feb 2025); no new issues since Feb 2024 | ✓S | ThePrint; Wikipedia |
| D15 | The fair counterpoint | Bonds saved about $3.3 bn of imports in FY 2023–24 | ✓S | Business Standard, Mar 2024 |
| D16 | Plan A, the deposit scheme | 31,164 kg to Nov 2024 from 5,693 depositors = 0.10% of household gold | ✓S | MoF statement, 25 Mar 2025 |
| D17 | Why deposits failed | Deposited jewellery is melted after the purity test; it comes back only as gold, never as the piece | ✓P | RBI FAQ on the Gold Monetisation Scheme |
| D18 | India imports the deposit scheme's 9 years in | 15.8 days (721 t in FY 2025–26) | ✓P + ≈ | DGCIS; our arithmetic |
| D19 | India's own mines | 1,627 kg in 2024–25 (1,583 kg in 2023–24) = 1 g mined for every 443 g imported | ✓P + ≈ | Ministry of Mines, Monthly Summary for April 2025 (dated 30 May 2025), table 2.1 "Gold (total)", source IBM; our arithmetic. Not the gold Hindalco refines from imported copper concentrate. The Ministry's Annual Report 2024–25 gives 1,431 kg of primary gold (an earlier, narrower count) |
| D20 | Gold is India's second-biggest import | ₹6.39 lakh crore, 9.4% of all imports (FY 2025–26); 86% more money for 18% fewer tonnes than FY 2021–22 | ✓P + ≈ | DGCIS; our arithmetic |
| D21 | Where it lands, where it comes from | Delhi airport 35.6%, Mumbai airport 24.0%, Chennai FTWZ 14.0%, GIFT SEZ 7.4% · Switzerland 27.9%, UAE 21.3%, Peru 11.0%, Ghana 8.4% (22 entry points) | ✓P + ≈ | DGCIS; our arithmetic. **Cleared 18 Nov:** imports are "by and large, credited to the country of consignment" (DGCIS metadata, trade-analytics.commerce.gov.in, Metadata_Final_TIA.pdf). Say "arrives from" or "shipped from", never "mined in" |
| D22 | Families pawn instead | Bank loans against gold jewellery ₹5,52,261 crore on 31 Jul 2026, +88.1% y-o-y (₹2,93,568 crore on 25 Jul 2025). The May 2026 +105% was never read at RBI: cut | ✓P | RBI Bulletin Sep 2026, Current Statistics, p. 119 (sectoral deployment of bank credit). Footnote 4: one bank moved some farm loans into this line in May 2024, before both dates, so the y-o-y is not inflated by it. RBI says growth slowed again by Sep 2026 (press release 2026-27/1412) |
| D23 | Gold isn't a sure thing | Mumbai, ₹ per 10 g, yearly average: ₹30,164 (2012-13), ₹29,190, ₹27,415, ₹26,534 (2015-16), ₹29,665, ₹29,300, ₹31,193 (2018-19). It fell for three years before the first bond and barely moved for three after | ✓P | RBI Handbook of Statistics on Indian Economy 2019, Table 39 (RBI compiles it from IBJA and newspaper prices) |
| D24 | Household gold | 31,000 t (estimates 23,000–34,600) | ✓P | WGC "Swarnim Udaan 2047", 4 Aug 2026 |
| D25 | Tax rule | From the 2026 Budget, gains are tax-free only for bonds bought at issue and held to maturity | ✓S | Wikipedia; Business Today |
| D26 | **Why now:** the bill is arriving | 13 Nov 2026: SGB 2018-19 Series III paid out at ₹14,024/g, sold at ₹3,183 (+341%, 4.4×; +348% for online buyers, who paid ₹3,133) | ✓P | RBI press release; RBI tranche data |
| D27 | **Why now:** holders can call it in | 32 tranches (59.8 t) are past 5 years and can be cashed at any redemption window: ₹79,835 crore at ₹13,345/g (19 Nov 2026) | ≈ | tranche table; our arithmetic |
| D28 | **Why now:** the wave ahead | Final maturities at today's price: FY 2028–29 ₹45,370 crore; FY 2029–30 ₹37,914 crore; FY 2031–32 ₹62,177 crore. The 1 Feb 2027 Budget must provide for it | ≈ | tranche table; our arithmetic |
| D29 | **Why now:** a third try is proposed | WGC's "Swarnim Udaan 2047" (4 Aug 2026) proposes mobilising 10–15% of household gold and a National Gold Board | ✓S | WGC press release; Business Today |

## 3. The long video (≈ 10 min, ≈ 1,400 words)

**Title (48 characters):** How Do You Lose Money on Gold That Only Went Up?
**Alternative (54):** The Government Bet Against Your Mother's Gold. It Lost
**Thumbnail:** a rising gold line ending in a red loss stamp, a bangle beside it; text "GOLD 5× ↑ · GOVT LOST" (4 words, readable on a phone).
**One question, asked in the first 3 seconds:** how do you lose money on gold that only went up?
"Only went up" is the hook's framing: over the bonds' life (2015–2026) gold rose 5.2×, with dips on the way. Act 5 says so
(gold was flat 2012–18, and fell after the July 2024 duty cut), so the hook never misleads (rule O6).

| Act | Time | Beat (the turn that ends it) | Data | Picture |
| --- | --- | --- | --- | --- |
| **1. The paradox** | 0:00–0:45 | Script below. Ends on the question. | D1, D9, D17 | Frame 1: a mother's bangle, then a bond certificate sliding over it |
| **2. The trap** | 0:45–2:30 | The headline everyone shares: "Gold bonds gave investors 300%!" Turn it round: every rupee of that was paid by someone. The first tranche: ₹2,684 → ₹6,132, 12.9% a year, when a normal government loan cost 7.75%. **But** why did the government need paper gold at all? | D6, D7 | Document close-up (s03) of RBI's redemption notice; two interest-rate bars |
| **3. The mechanism** | 2:30–6:30 | **(a) The problem:** India mines 1 gram for every 443 it buys; gold is its second-biggest import, paid in dollars. Our map of the 22 entry points. **So** the government tried two plans on the same day in 2015. **(b) Plan A, borrow the real gold:** 31 tonnes in 9 years from 5,693 depositors, what India imports in 16 days. **Because** deposited jewellery is melted. You get back a bar, never your mother's bangle. **(c) Plan B, sell paper gold:** 67 tranches, 147 tonnes, ₹72,274 crore. **And here is the catch:** **the government sold gold it never owned.** It was a loan. The rupees were spent like any borrowing, with a promise to repay at whatever gold costs on the day. That is a bet that gold won't rise much. Gold went from ₹26,840 to about ₹1.40 lakh per 10 g: 5.2×. Amma held the real thing and won both ways. | D2–D5, D16–D21 | Flow map (s07) of imports; timeline (s11) with Plan A's 9-year crawl vs the 16-day counter; money breakdown (s04) of a bond: "your ₹ → the budget → the promise" |
| **4. Your wallet** | 6:30–8:30 | **The bill:** about 123 tonnes still out, ₹1.64 lakh crore owed; every ₹1,000 on a gram adds ₹12,277 crore. The bonds already repaid cost about 16.5% a year, more than double a normal loan's 7.1%. A reserve fund covers about half. **Who pays:** the budget, so every taxpayer. **Who gains:** bondholders, tax-free if they bought at issue and hold to maturity. **And families now?** They pawn, not sell: bank gold loans grew 88% in a year, to about ₹5.5 lakh crore (Jul 2026). The government's own verdict: costly borrowing, imports didn't fall. | D8–D10, D12–D14, D22, D25 | Scale (s12): the ₹12,277 crore per ₹1,000 counter; dot chart (s05): who paid, who gained |
| **5. What the numbers hide** | 8:30–9:30 | (1) **Owing isn't losing.** Part of the ₹1.64 lakh crore is just the money it borrowed, and it paid only 2.5% interest instead of about 7%. Our bond-by-bond estimate of the real extra cost: close to ₹1 lakh crore (₹97,900 crore), about ₹690 per Indian, at today's price. It rises or falls by ₹12,000 crore with every ₹1,000 on a gram. (2) **It wasn't useless:** one estimate says it saved $3.3 bn of imports in a single year. (3) **It looked safe in 2015:** gold had fallen for three years (RBI Handbook, Table 39). (4) The bill moves every day with the price. Then the loop: "If you hold a gold bond, you won this bet. If you pay tax, you're on both sides. So who was right about gold? Because in 2015…" | D11, D15, D23 | Document close-up of the script's assumptions; the bill counter ticking with the price |

Rules: a "but", "so" or "and here's the catch" every 60–90 s; the source on screen for every number; "our arithmetic" or
"our estimate" on every computed figure; non-partisan (the scheme had a real goal and a real counterpoint, D15);
finance rules (O5): no buy or sell language, no price forecast, disclaimer on screen.

### Act 1, word for word (0:00–0:45)

```
How do you lose money on gold that only went up?
The Government of India found a way.
In 2015, it made a bet against your mother.
It asked her to hand over her gold. She said no.
So it sold her paper gold instead.
Today, it owes about one point six lakh crore rupees on it.
Not because anyone stole it. Not because gold crashed.
Gold went up. That's exactly why it lost.
And this isn't history. Last week it paid back 4.4 times the price on one batch of these bonds,
and holders can call in about eighty thousand crore more whenever they like.
To see how, start with a number almost nobody has seen:
the gram of gold India digs out of its own ground, for every 443 it buys.
```

## 4. The five Shorts

Series note: Shorts 1, 2 and 5 don't fit India Ledger's three series (Days of Work, In ₹500 Notes, In Your Pocket).
**AK's call:** add a fourth series for episode Shorts ("Doesn't Add Up": two numbers that shouldn't fit together), or run
them unlabelled.

### Short 1 · from the long video · "How do you lose money on gold?" (≈ 29 s, 86 words)
Data: D2, D3, D8–D10. Visual: frame 1 is a gold-bond certificate with a counter already running.
```
[0.0]  How do you lose money on gold that only went up?   GOLD 5× ↑ · LOST?
[3.0]  Ask the government. It owes one point six
       lakh crore rupees on it.                             ₹1.64 LAKH CRORE OWED
[6.8]  Not stolen. Not a crash.                            (wrong guesses struck out)
[8.4]  In 2015 it sold paper gold: bonds that pay you
       whatever gold is worth later.                        PAPER GOLD
[12.8] But it never bought the gold.                       NO GOLD BOUGHT
[14.6] It spent the money, like any loan.
[16.4] Then gold went up about five times.                ×5.0
[19.2] So every bond is paid back at today's price, and
       every thousand rupees on a gram adds twelve
       thousand crore.                                      +₹1,000/g = +₹12,277 CR
[25.8] It bet gold wouldn't rise. That's the answer to     → loops to "How do you lose money…"
SOURCE: RBI tranche data · bill at ₹13,345/g (RBI, 19 Nov 2026): our arithmetic · not investment advice
SEND LINE: gold-bond holders and taxpayers both want to know who's paying.
```

### Short 2 · from the long video · "31 tonnes in 9 years" (≈ 30 s, 84 words)
Data: D16–D18. Visual: frame 1 is a bangle dropping into a deposit box; then two counters.
```
[0.0]  In 2015, the government asked Indian families
       to lend it their gold.                              LEND US YOUR GOLD
[3.4]  Nine years later, how much had it collected?        9 YEARS → ?
[5.6]  Not a thousand tonnes. Not a hundred.               (wrong guesses struck out)
[7.6]  Thirty one tonnes. From fewer than six thousand
       depositors.                                          31 TONNES · 5,693
[11.8] India imports that much gold in about sixteen days. 16 DAYS
[15.6] Why so little?                                      WHY?
[17.0] Deposit your bangle, and it's melted.
       You get back gold, never the bangle.                 MELTED
[22.0] So families said no. And that's why, in 2015,       → loops to "In 2015, the government asked…"
SOURCE: Ministry of Finance, Mar 2025 · RBI FAQ · DGCIS FY 2025–26 · 16 days: our arithmetic
SEND LINE: every mother would refuse to melt her bangle; now they know why the scheme failed.
```

### Short 3 · on its own · In Your Pocket · "India exports ₹3 lakh crore of this" (≈ 30 s)
Ready: the script is the worked example in SHORTS_FORMAT section 7, and its data is verified
(`hyperframes/videos/dk-phones/story.js`, DGCIS FY 2025–26). Build it first.

### Short 4 · on its own · In Your Pocket · "₹10 bottle vs Coke and Pepsi: 93% to 85%" (≈ 27 s, 78 words)
Data: NielsenIQ via Storyboard18 and Trak.in, Jan–Sep 2024 vs Jan–Sep 2025 (second-hand: NielsenIQ declined to comment).
**VERIFY** whether a 2026 reading exists; if it does, use it and change the dates. It also seeds episode 2.
```
[0.0]  For decades, two companies sold almost every
       soft drink in India.                                 COKE + PEPSI
[3.6]  Ninety three percent of the market.                 93%
[5.6]  Then came a ten rupee bottle.                       ₹10
[7.6]  Campa, from Reliance. And Lahori, a jeera drink.
[10.8] In one year, the two of them doubled.
       Seven percent, to nearly fifteen.                    7% → 15%
[15.4] Coke and Pepsi? Down to eighty five.                85%
[18.2] Most of the fight was at one price. Ten rupees.     ₹10
[21.4] So the giants launched ten rupee packs.
       Something they never needed, because                 → loops to "For decades, two companies…"
SOURCE: NielsenIQ, Jan–Sep 2024 vs Jan–Sep 2025, as reported by Storyboard18
SEND LINE: everyone has seen Campa in the shop; nobody knows it moved the market.
```

### Short 5 · on its own · "India's ₹45,000 crore meat export isn't chicken" (≈ 26 s, 75 words)
Data: DGCIS FY 2025–26, already in the repo (`hyperframes/videos/dk-buffalo/story.js`; poultry from
`hyperframes/videos/ia-poultry/story.js`). 16× is our arithmetic.
**AK's call:** buffalo meat is a legal export but a sensitive topic. Swap for another product from the same DGCIS data
if you prefer.
```
[0.0]  India sells forty five thousand crore rupees
       of meat abroad every year.                           ₹45,196 CR
[3.6]  Most people guess chicken. It isn't.                NOT CHICKEN
[5.8]  Chicken is under three thousand crore.
       This is sixteen times that.                          16×
[9.8]  It's buffalo meat. Up thirty one percent in a year. +31%
[13.2] And most of it isn't cleared at a port.             NOT A PORT
[15.4] More than half is cleared at inland depots
       in Uttar Pradesh: Dadri and Kanpur.                  54% · UP (map)
[20.4] The biggest buyer? Vietnam.                         VIETNAM 18%
[23.0] From UP to Vietnam. And that's why                  → loops to "India sells…"
SOURCE: DGCIS principal commodity × port × country, FY 2025–26 · 16×: our arithmetic
SEND LINE: almost everyone guesses chicken.
```

**Kept for later weeks** (checked, not used this week):
- "Your gold bangle's passport" (Peru and Ghana to a Delhi runway; D21 cleared: DGCIS records the country of consignment, so say "shipped from", never "mined in");
- household gold as an 11.7 m cube vs a 63,000 km stack of ₹500 notes;
- "How many days of work is 10 g of gold?" (needs the PLFS wage tables);
- "Indian homes hold 35× the RBI's gold".

## 5. The calendar

| Day | Make | Publish |
| --- | --- | --- |
| Thu 19 Nov | Channel: rename to India Ledger, handle @IndiaLedgerOfficial, banner and description. Check Studio → Languages. Clear D21–D23 and the population figure in D11. Write the long script from section 3. | — |
| Fri 20 Nov | Build Short 3. Long video: the visuals. | **Short 3** · phones |
| Sat 21 Nov | Build Short 4. Long video: the visuals. | **Short 4** · the ₹10 bottle |
| Sun 22 Nov | Long video: re-run `india_ledger_gold.py` with RBI's latest redemption price, voice, Hindi track draft, render, thumbnail. Build Shorts 1 and 5. | — |
| Mon 23 Nov | Final check of the long video against section 2 (every number, its status and its on-screen source). | **Long video** |
| Tue 24 Nov | Set its Related video to the long video. | **Short 1** · how do you lose money on gold |
| Wed 25 Nov | — | **Short 5** · buffalo meat |
| Thu 26 Nov | Set its Related video to the long video. | **Short 2** · 31 tonnes in 9 years |

## 6. Before anything is published

1. Every VERIFY in section 2 is cleared, or the line that uses it is cut. D3 and D11 are cleared (18 Nov). D11 moves with the gold price: re-run the script and
   update every on-screen figure from its output on the build day.
2. Each Short: `shorts_check.py` shows no FAIL; the title is at most 50 characters; 0–2 hashtags.
3. Long video: sources on screen in every act; Act 5 is in; disclaimer on screen; English captions uploaded.
4. Narrator: until AK decides on a human voice, use the MiniMax voice, and run `shorts_build.py verify` after every voiced build.
5. Related video set by hand in desktop Studio for Shorts 1 and 2.
6. Log every upload for the 48-hour and 7-day reads.
