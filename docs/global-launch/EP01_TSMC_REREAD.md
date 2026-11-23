# EP01 TSMC: independent re-read (7 Nov 2026)

Script read, not edited: `EP01_TSMC_SCRIPT.md`. Nothing voiced or rendered.

## Sources read myself
- MR = TSMC 3Q26 Quarterly Management Report, 15 Oct 2026, 7 pp: https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-10/f83780000ddc0c3b48e57a87eab6814c4ab35058/3Q26%20ManagementReport.pdf (fetched, then `pdftotext -layout`; copy in scratchpad `tsmc2/mr.pdf`).
- TR = TSMC 3Q26 earnings call transcript (company-published, LSEG layout), same host, `.../eba4fac72873bf546b669bd2b5d973df5c93215d/TSMC 3Q26 Transcript.pdf` (`pdftotext`; prepared remarks on pp.2-3). The official audio was not needed.
- 20-F FY2025 (SEC, tsm-20251231.htm): searched for "Apple": 0 hits. Customers appear only as unnamed shares (largest 19%, second 17% of 2025 revenue; ten largest 78%).
- The 6-K earnings release could not be re-fetched this run (SEC returned empty); every figure used is printed in MR/TR, so nothing depends on it.
- Apple name check: not in MR, TR, or the 20-F.

## Table
| Beat | Claim | What I read | Result | Suggested wording |
|---|---|---|---|---|
| w00, t63 | $51 of every $100 kept | MR p.1: net profit margin 51.1% (net income 763.06 / revenue 1,494.24) | Confirmed (this is NET margin, after tax) | "keeps about $51 of every $100 it sells, after tax" (say "profit" once so nobody hears gross margin) |
| w00 | "keeps half" | 51.1% | Confirmed | ok |
| w02 | $46.7 billion, Jul-Sep 2026 | MR p.1: US$46.72bn; TR p.2: "$46.7 billion" | Confirmed | ok |
| w02 | 15 Oct 2026 | MR p.1 date | Confirmed | ok |
| w02 | "Companies like Apple and Nvidia design chips. TSMC builds them." | Apple not named in MR, TR or 20-F. TR line 176: "all the AI players are working with TSMC" (unnamed). Nvidia is named only in Nvidia's own 10-K (earlier VERIFY) | Apple unsupported by any TSMC document; Nvidia supported only via Nvidia's filing | Safest keeping Apple: "Big names in phones and AI design chips. TSMC builds them." (no brand named, true per MR: smartphone 21%, HPC 68%). If AK insists on names: show them as "examples, not from TSMC's filings"; but spoken "Companies like Apple and Nvidia" reads as a claim. Nvidia alone is safe: "Companies like Nvidia design chips." |
| w00-w01 | Priya bakery | Made-up, labelled | n/a | ok |
| p10 | 68 / 21 / 11 | MR p.2: HPC 68, Smartphone 21, IoT 4 + Auto 4 + DCE 1 + Others 2 = 11 (sums to 100) | Confirmed numbers; LABEL corrected | "AI CHIP MAKERS" overstates. TSMC's line is High Performance Computing. TR l.898: TSMC's "AI accelerator" definition is narrow and excludes CPUs. Say "AI and data-centre chips (HPC)" or "high-performance computing, mostly AI and data centres". "Mostly" is our reading (TSMC gives no AI share of HPC here). Percent of net revenue (not wafers) |
| p11 | year ago 57, now 68 | MR p.2 platform table 3Q25 = 57% | Confirmed | ok; same label fix |
| k20 | year-ago $46 | MR p.1/p.3: net profit margin 3Q25 = 45.7% (printed) | Confirmed; "(our arithmetic)" not needed, it is printed | "about $46 a year ago" |
| k20 | not $10, not $25 | rhetorical | n/a | ok |
| k21 | cost to make chips $34 | 501.86/1494.24 = 33.6% (MR p.2) | Confirmed (about $34) | |
| k21 | running the company $8 | opex 116.43 = 7.8% (MR p.3) | Confirmed | |
| k21 | interest and other gains +$2 | non-operating +34.59 = 2.3%; other operating +0.50 = 0.03% (MR p.3) | Confirmed (about $2) | |
| k21 | tax $10 | 147.70 = 9.9% of sales (MR p.3; effective tax 16.2% of pre-tax) | Confirmed | |
| k21 | sums to $51 | Exact: 100 - 33.6 - 7.8 + 0.03 + 2.3 - 9.9 = 51.1 (net to parent 51.07). Rounded whole dollars 100-34-8+2-10 = 50 | Corrected: does not add up honestly as spoken | Say it with the rounding admitted: "Making the chips takes about $34. Running the company, about $8. Interest and other gains add about $2. Tax takes about $10. What is left is about $51. Rounded pieces, so it looks a dollar short." On screen: "KEPT $51 (51.1 exact)" and "pieces rounded". Or use one decimal: $33.6, $7.8, +$2.3, $9.9 -> $51.1 (adds to 51.1 within 0.03) |
| k22 | sales +50.9%, profit +68.7% | MR p.1 YoY: revenue 50.9%, net income 68.7% | Confirmed | Currency: both are in Taiwan dollars. In US dollars sales were +41.2% (MR p.1). Say "in Taiwan dollars" for both |
| k22 | "profit grew by two thirds" | 68.7% | Slightly weak | "by more than two thirds" |
| s40 | sales +17.6% vs Apr-Jun | MR p.1 QoQ 17.6% | Confirmed | |
| s40 | cost of making chips +22.4% | 501.86 / 410.07 = +22.4% (MR p.2) | Confirmed (our arithmetic; label it) | |
| s40 | profit +8.0% | MR p.1: net income 763.06 vs 706.56 = +8.0% | Confirmed | |
| s40 | NT$67bn "one-off gains" in Apr-Jun | MR p.3: Other gains/losses 67.43 in 2Q26 vs 1.42; MR says decrease "mainly due to the absence of disposal and mark-to-market gains on VIS shares" | Confirmed amount; "one-off" is our word | "a gain of about NT$67 billion in April to June, mostly from selling and revaluing shares in another chip firm, that did not repeat". Also 2Q26 had earthquake insurance claims (other operating 5.27 vs 0.50) |
| s40 | "margin slipped because costs grew faster than sales" | Cost of revenue +22.4% > sales +17.6% true. But opex +17.6% = sales; operating income +14.3%. TSMC itself says the gross margin fell "primarily due to margin dilution from the initial ramp-up of N2" (MR p.2; TR p.3). Net margin fell 55.6 -> 51.1 mostly from non-operating gains of 95.83 -> 34.59 | Corrected: stronger than source as a general cause | "Why did TSMC's margin slip? The cost of making chips rose 22.4% while sales rose 17.6%." (cost of revenue only). Do not say "costs" alone. Make clear s40 is net profit, s41 is gross margin |
| s41 | gross margin 67.7 -> 66.4 | MR p.1: 66.4% vs 67.7%, "1.3 percentage points lower" | Confirmed | "fell 1.3 points" |
| s42 | main reason: new 2nm chips earn less at first | TR p.3: "primarily due to the margin dilution from the initial ramp-up of our 2-nanometer technology"; MR p.2 same | Confirmed | ok |
| s42 | operating costs rose with research spending | MR p.3: opex +NT$17.45bn to 116.43; R&D 73.14 -> 88.98 (+15.84 of the +17.45). The call gives no reason for opex | Confirmed numbers; the link is MR table, not the call | "Operating costs also rose, mostly research (NT$89bn against NT$73bn)." Do not say TSMC said it on the call |
| s42 | "Next quarter it adds overseas fabs" | TR p.3: Q4 gross margin guide down 40 bp "primarily due to continued margin dilution from the steep ramp-up of 2nm ... as well as dilution from overseas fabs"; overseas fab dilution "closer to 2%" for 2026 | Corrected: overseas fabs are already running; Q4 guide cites their dilution | "Next quarter, 2-nanometre ramp-up and its overseas fabs weigh on margin again. Overseas fabs cost more: about 2 points of margin in 2026." |
| c30 | smaller nm = newer, harder | explainer | n/a (not a figure); "harder" is general knowledge | ok |
| c31 | 3nm 33, 5nm 28, 7nm 10, 2nm 8, older 21 | MR p.2 wafer revenue table: 8/33/28/10; 16/20nm 6, 28nm 6, 40/45 2, 65 4, 90nm-0.13um 1, >=0.15um 2 = 21 | Confirmed | These are shares of WAFER revenue, so say "Of every $100 of wafers TSMC sold" (not "chips"); on screen "WAFER REVENUE" |
| c32 | newest four = $79 | MR p.2: "advanced technologies (7nm and below) 79%" | Confirmed | ok |
| c32 | new factory costs billions, years to learn | MR p.5 capex US$13.84bn in 3Q26, 40.64bn YTD; TR: 2026 capex budget US$60-64bn (reiterated). No per-fab cost or years figure | Capex confirmed; per-fab cost and "years" unsupported, labelled OUR READING | "TSMC spent US$13.8 billion on equipment and plants in this one quarter." Keep "years to learn" as reading |
| g50 | Oct-Dec gross margin guide 65% to 67%; last 66.4 | TR p.3: "gross margin is expected to be between 65% and 67%" | Confirmed | ok |
| g50-g51 | "about the same, or a little lower"; mid below last quarter | TR p.3: "decrease by 40 basis points to 66% at the midpoint" | Confirmed | "TSMC itself guides down about 0.4 points at the midpoint". "Not a slide" is our reading |
| g51 | operating margin guide 56.5-58.5 vs 58.7 | TR p.3: 56.5% to 58.5%; MR p.1: 58.7% | Confirmed | ok |
| t62 | 2nm share $8; AI makers above two-thirds | MR p.2: 8%; HPC 68% | Confirmed | Relabel "AI makers" as in p10. 2nm 8% is of wafer revenue; HPC is of net revenue |
| t60-t61 | moat test, verdict | Our framework and reading, labelled | Not a sourced claim | keep "OUR READING" |
| t63 | recap: "chip-making costs grew faster" | see s40 | Corrected | "The slip? Chip-making cost grew faster than sales, as new 2-nanometre chips start low." |
| t63 | "Mostly AI chip makers" pays | see p10 | Label | "mostly high-performance computing, AI and data centres" |

## Counts
Rows checked: 36. Confirmed: 26 as written. Corrected or narrowed: 7 (k21 sum, s40 "costs grew faster", s42 "adds overseas fabs", p10 "AI chip makers" label, c31 "chips" vs wafers, k22 currency and "two thirds", t63 recap). Unsupported: 2 (Apple in w02; per-fab cost/"years" in c32, which is labelled as reading).

## Notes on Apple
No TSMC document names Apple (MR, TR, 20-F). The 20-F gives only anonymous shares. Apple's own filing does not name TSMC (earlier VERIFY). So Apple is a description, not a sourced fact. Safest unsourced-free wording: "Big names in phones and AI design chips. TSMC builds them."
