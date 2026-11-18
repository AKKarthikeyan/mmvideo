# India Ledger: week 1 plan (19–26 Nov 2026)

**AK, 18 Nov 2026:** one long video and five Shorts this week. Two Shorts tell the long video's story as native Reveal
Loops (never clips), and three stand on their own. Formats: the long video follows the five-act Data Paradox
([`INDIA_LEDGER_PLAN.md`](INDIA_LEDGER_PLAN.md) section 2). Every Short follows the Reveal Loop
([`SHORTS_FORMAT.md`](SHORTS_FORMAT.md)) and passes `python3 scripts/shorts_check.py <id>` before it is rendered.

**The topic: gold, but not "how much gold Indian homes hold".** AK, 18 Nov: that number has been in every post and video
already. Our video tells what happens to that gold, and to the gold still arriving, from data nobody has put side by side:
- our own cut of the DGCIS import data (where India's gold comes from, and where it lands);
- the government's two failed schemes to borrow it;
- the doubling of gold loans.

Numbers marked **VERIFY** have no primary source in hand yet. Pull them from the source named, or cut the line.
Everything else was checked or computed on 18 Nov 2026 (sources at the end).

## 1. The calendar

| Day | Make | Publish |
| --- | --- | --- |
| Thu 19 Nov | Channel: rename to India Ledger, handle @IndiaLedgerOfficial, banner and description ("India's economy, in charts, from the official data"). Check Studio → Languages for multi-language audio. Clear the VERIFY list for the long video. Write the long script. | — |
| Fri 20 Nov | Build Short 3 (its numbers are already verified in the repo). Long video: the visuals. | **Short 3** · phones |
| Sat 21 Nov | Build Short 4. Long video: the visuals. | **Short 4** · the ₹10 bottle |
| Sun 22 Nov | Long video: voice, Hindi track draft (`scripts/audio_tracks.py`), render, thumbnail. Build Shorts 1 and 5. | — |
| Mon 23 Nov | Final check of the long video (every source on screen, Act 5 present). | **Long video** |
| Tue 24 Nov | Set its Related video to the long video. | **Short 1** · 16 days vs 9 years |
| Wed 25 Nov | — | **Short 5** · buffalo meat |
| Thu 26 Nov | Set its Related video to the long video. | **Short 2** · your bangle's passport |

The two episode Shorts go out **after** the long video, because a Related video can only point at a public video.
Publish at the same time each day. Read every Short at 48 hours and the long video at 7 days
(INDIA_LEDGER_PLAN section 4).

## 2. The long video (≈ 10 min, ≈ 1,400 words)

**Title (60 characters):** India Imports in 16 Days What Its Gold Scheme Got in 9 Years
**Alternative (57):** Indians Won't Deposit Their Gold. But They'll Pawn It. Why?
**Thumbnail:** a bangle on a pawn counter beside a sealed government deposit slip, with "16 DAYS vs 9 YEARS".
**The question:** India keeps buying gold it already has more than enough of. Why won't families lend it to the
government, when they will pawn it to a bank, and who pays for that?

### What's new in this video (data nobody has put side by side)

| Finding | Number | Source |
| --- | --- | --- |
| The gold deposit scheme (2015–2025) collected almost nothing | 31,164 kg in 9 years, from 5,693 depositors | Finance Ministry, 25 Mar 2025 |
| India imports that much gold in about 16 days | 721 t imported in FY 2025–26 → 31.2 t ≈ 15.8 days | DGCIS, our arithmetic |
| India paid 86% more for 18% less gold | FY 2021–22: 879 t for ₹3.44 lakh crore → FY 2025–26: 721 t for ₹6.39 lakh crore (₹39 lakh → ₹89 lakh a kg) | DGCIS, our arithmetic |
| Gold is India's second-biggest import, after crude oil | ₹6.39 lakh crore, 9.4% of all imports | DGCIS, our arithmetic |
| Where it lands | Delhi airport 35.6%, Mumbai airport 24.0%, Chennai free-trade warehouse 14.0%, GIFT City SEZ 7.4%, Chennai airport 6.3% | DGCIS, our arithmetic |
| Where it comes from | Switzerland 27.9%, UAE 21.3%, Peru 11.0%, Ghana 8.4%, South Africa 4.3% | DGCIS, our arithmetic (**VERIFY** whether DGCIS import country means origin or consignment) |
| Families are pawning it instead | Bank loans against gold jewellery: about ₹5.1 lakh crore, +105% in a year (May 2026); NBFC gold loans ₹3.41 lakh crore, +69% (June 2026) | RBI sectoral credit, as reported (**VERIFY** on the RBI release; part of the bank jump may be a reclassification) |
| The government's "paper gold" became a bill | Sovereign Gold Bonds: about 132 t outstanding; liability ₹1.1–1.5 lakh crore as prices rose; new issues stopped | RBI and MoF, as reported (**VERIFY** the latest figure on the RBI release) |
| The gold that isn't counted | Customs seized 2,600 kg of smuggled gold in FY 2024–25 (DRI alone: 1,073 kg); sea routes on the Tamil Nadu coast named | DRI, Smuggling in India 2024–25 |

### The five acts

| Act | Time | Beat | Picture (HyperFrames) |
| --- | --- | --- | --- |
| 1. The paradox | 0:00–0:45 | "In 2015 the government asked Indian families to deposit their idle gold. Nine years later it had 31 tonnes, from 5,693 depositors. India imports that much in about sixteen days." Then the question: families won't deposit their gold, but gold loans just doubled. Why pawn it and not deposit it? | Timeline (s11): nine years crawling up to 31 t; then a 16-day counter racing to the same mark |
| 2. The headline number | 0:45–2:30 | Every report says Indians sit on 31,000 tonnes of **idle** gold (WGC). But it isn't idle. Banks' gold loans doubled in a year to about ₹5.1 lakh crore, and NBFC gold loans rose too. The gold is working as collateral, just not for the government. | Money breakdown (s04): the "idle" pile splitting into pledged gold |
| 3. The mechanism | 2:30–6:30 | (a) **The new gold:** 721 t a year, our map from Swiss refineries, UAE, Peruvian and Ghanaian mines to Delhi and Mumbai airports, Chennai's free-trade warehouse and GIFT City. Paying 86% more for 18% less. (b) **Why deposits failed:** deposited jewellery is assessed and melted (**VERIFY** in the GMS rules), so a family's bangle never comes back; a pawned bangle does. The share of jewellery in India's gold demand (**VERIFY**, WGC Gold Demand Trends). (c) **Paper gold:** Sovereign Gold Bonds worked for buyers, and that is the problem. Gold rose, the government owes the difference, and new issues stopped. Each with a guess-then-reveal. | Flow map (s07) of the imports; globe (s09) for the countries; document close-up (s03) of the scheme notice |
| 4. What it means for you | 6:30–8:30 | For a family: a gold loan against the same bangle, the loan-to-value cap (**VERIFY** the current RBI rule) and what happens when the price falls. For the country: ₹6.39 lakh crore a year of gold imports, second only to oil, paid in dollars. The leak: 2,600 kg seized in a year, and the Gulf price gap behind it. | Scale (s12); flow map of seizure points |
| 5. What the numbers hide | 8:30–9:30 | DGCIS counts declared imports, not smuggled gold. The "31,000 tonnes" is an estimate (others run from 23,000 to 34,600). Part of the gold-loan jump may be reclassification. The scheme figures run to Nov 2024. Then the open part: "Which airport does your city's gold land at?" Show the map of all 22 entry points. | Document close-up; all-India port map |

Rules: re-hook every 60–90 s with a "but" or "so"; sources on screen in every act; anything computed says "our
arithmetic"; illustrations are labelled "illustrative". Finance topic, so: no buy or sell language, no price forecast,
and the disclaimer on screen (rule O5).

**The numbers can be rebuilt:** `out/hyperframes/cache/export-import.parquet`, commodity `GOLD`, `Type == "Import"`,
FY = April to March. The same file `hyperframes/tools/export_videos.py` reads, so `pyarrow` must be installed.

## 3. The five Shorts

Series note: Shorts 1 and 5 don't fit India Ledger's three series as they stand. **AK's call:** add a fourth series for
episode Shorts ("Doesn't Add Up": two numbers that shouldn't fit together), or run them unlabelled.

### Short 1 · from the long video · "India's gold scheme: 9 years. Imports: 16 days" (≈ 27 s, 78 words)
Data: Finance Ministry (31,164 kg, 5,693 depositors, to Nov 2024); DGCIS FY 2025–26 (721 t); 15.8 days is our arithmetic.
Visual: frame 1 is a gold bangle dropping into a government deposit box; then a year-by-year counter.
```
[0.0]  In 2015, the government asked Indian families
       to lend it their gold.                              LEND US YOUR GOLD
[3.4]  Nine years later, how much had it collected?        9 YEARS → ?
[5.6]  Not a thousand tonnes. Not a hundred.               (wrong guesses struck out)
[7.6]  Thirty one tonnes. From fewer than six thousand
       depositors.                                          31 TONNES · 5,693
[11.8] Now watch India's imports.                          (a second counter starts)
[13.4] Seven hundred and twenty one tonnes a year.         721 T / YEAR
[16.4] So India buys thirty one tonnes in about
       sixteen days.                                        16 DAYS
[19.8] Families won't deposit their gold. But they'll
       pawn it. And that's why, in 2015,                    → loops to "In 2015, the government asked…"
SOURCE: Ministry of Finance, Mar 2025 · DGCIS FY 2025–26 · 16 days: our arithmetic
SEND LINE: everyone's mother has gold; nobody knew the government asked for it and got almost none.
```

### Short 2 · from the long video · In Your Pocket · "Your gold bangle's passport" (≈ 28 s, 80 words)
Data: DGCIS FY 2025–26, our arithmetic. **VERIFY** whether DGCIS import "country" is origin or consignment before using
the word "mined", and that Switzerland has no commercial gold mines.
Visual: frame 1 is a bangle with a passport stamp landing on it; then the globe and the arcs.
```
[0.0]  The gold in your bangle probably has a passport.    YOUR BANGLE'S PASSPORT
[3.0]  India mines almost none of its gold.
       So where does it come from?                          WHERE FROM?
[6.4]  Switzerland, twenty eight percent.
       A country with no gold mines.                        SWITZERLAND 28%
[10.4] It refines it. Then the UAE, twenty one.            UAE 21%
[13.4] Then the surprise: Peru, eleven. Ghana, eight.      PERU 11% · GHANA 8%
[17.4] And it lands mostly at one airport. Delhi.
       Thirty six percent.                                  DELHI AIR 36%
[21.8] From an Andes mine to a Delhi runway to your wrist.
       That's why                                           → loops to "The gold in your bangle…"
SOURCE: DGCIS principal commodity × country × port, FY 2025–26 · shares: our arithmetic
SEND LINE: nobody thinks their jewellery came from Peru.
```
"India mines almost none" needs a source: **VERIFY** India's annual mine output (Ministry of Mines / IBM yearbook).

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
**AK's call:** buffalo meat is a legal export but a sensitive topic, and it fits none of the three series.
Swap for another product from the same DGCIS data if you prefer.
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

**Kept for later weeks** (checked, not used this week): household gold as an 11.7 m cube vs a 63,000 km stack of ₹500
notes (In ₹500 Notes); "How many days of work is 10 g of gold?" (Days of Work, needs PLFS wage tables);
"Indian homes hold 35× the RBI's gold".

## 4. Before anything is published

1. Every VERIFY is cleared or the line is cut.
2. Each Short: `shorts_check.py` shows no FAIL; the title is at most 50 characters; 0–2 hashtags.
3. Long video: sources on screen in every act; Act 5 is in; disclaimer on screen; English captions uploaded.
4. Narrator: until AK decides on a human voice, use the MiniMax voice, and run `shorts_build.py verify` after every voiced build.
5. Related video set by hand in desktop Studio for Shorts 1 and 2.
6. Log every upload for the 48-hour and 7-day reads.

## Sources checked on 18 Nov 2026

- DGCIS Foreign Trade Data Dissemination Portal via github.com/Vonter/india-export-import (ODbL), data to May 2026:
  commodity GOLD, imports by FY, port and country (our arithmetic)
- Ministry of Finance statement on the Gold Monetisation Scheme, 25 Mar 2025: 31,164 kg to Nov 2024, 5,693 depositors —
  reported by Business Today, The Tribune, India TV
- WGC "Swarnim Udaan 2047", 4 Aug 2026: 31,000 t held by households — gold.org
- RBI sectoral credit (as reported): bank gold loans ≈ ₹5.1 lakh crore, May 2026, +105.5%; NBFC ₹3.41 lakh crore, June 2026
- Sovereign Gold Bonds: ≈ 132 t outstanding, liability ₹1.12–1.5 lakh crore (IIFL, The Wire, PolicyCircle)
- DRI, Smuggling in India 2024–25: 1,073 kg (DRI), 2,600 kg (all Customs) — dri.nic.in
- Campa: Storyboard18 (Nov 2025), Trak.in
