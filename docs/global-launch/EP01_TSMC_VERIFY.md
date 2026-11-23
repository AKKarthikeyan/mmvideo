# Moat Atlas EP01 (TSMC): primary-source verification (6 Nov 2026)

Script checked: `EP01_TSMC_SCRIPT.md` (not edited). Nothing voiced, rendered or published.

## Sources actually opened (all read as text this run)
| Short name | Document | URL | How read |
|---|---|---|---|
| MR | TSMC 3Q26 Quarterly Management Report, 15 Oct 2026 (7 pp) | https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-10/f83780000ddc0c3b48e57a87eab6814c4ab35058/3Q26%20ManagementReport.pdf | PDF via WebFetch, `pdftotext` |
| TR | TSMC 3Q26 earnings call transcript, 15 Oct 2026 (published by TSMC; LSEG layout) | https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-10/eba4fac72873bf546b669bd2b5d973df5c93215d/TSMC%203Q26%20Transcript.pdf | PDF via WebFetch, `pdftotext` |
| ER | TSMC 3Q26 earnings release (Form 6-K, Ex. 99.1, filed 15 Oct 2026) | https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000726/a3q26e_withguidancexfinal.htm | HTML, curl |
| 20-F | TSMC Form 20-F FY2025, filed 16 Apr 2026 | https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm | HTML, curl |
| NVDA 10-K | Nvidia 10-K FY2026 (year to 25 Jan 2026), filed 25 Feb 2026 | https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm | HTML, curl |
| AAPL 10-K | Apple 10-K FY2026 (year to 26 Sep 2026), filed 3 Nov 2026 | https://www.sec.gov/Archives/edgar/data/320193/000032019326000026/aapl-20260926.htm | HTML, curl |

Not openable: the investor.tsmc.com and tsmc.com PDF links return HTTP 403 to curl (bot block). They were read through WebFetch instead, so nothing is unread. The SEC page numbers of HTML filings are not fixed, so section names are given for those. The 3Q26 slide deck on SEC is images only and was not read; the platform split was read in the Management Report text instead (no third-party graphic is needed any more).

## Headline findings
1. **Everything numeric in the script that comes from the 3Q26 release is correct, with two exceptions below** (tax "$8" and the framing of "profit grew only 8.0%").
2. **Corrected: tax is about $10, not $8** (k21). See the arithmetic.
3. **Framing issue in s40:** the 8.0% is net income. It is held down mainly by one-offs in 2Q26 (NT$67.43bn "other gains", disposal and mark-to-market gains on VIS shares, and earthquake insurance claims). Operating income grew 14.3% and gross profit 15.4%, against sales +17.6%. "Costs grew faster than sales" is true of cost of revenue (+22.4%) but not of all costs (opex +17.6%, same as sales).
4. **Apple is not named as a TSMC customer in any primary document opened.** The 20-F anonymises customers (Customer A etc.). Apple's own 10-K does not name TSMC. **Nvidia is named** as a user of TSMC in Nvidia's own 10-K. Reword w02 (suggestion below).
5. "AI chip makers" is our label for TSMC's platform line **High Performance Computing (HPC)**. TSMC's own definition of HPC is broader than AI (the call discusses AI accelerators, CPUs and networking inside HPC). Label it "HPC (AI and data-centre chips)" or "mostly AI" and keep it as our reading.

## Arithmetic (NT$ billion, MR p.1-3)
- Net revenue 1,494.24. US$46.72bn (MR p.1; ER para 3). Script "$46.7 billion" OK.
- Cost of revenue 501.86 = 33.6% of sales. Opex 116.43 = 7.8%. Other operating +0.50 (0.03%). Operating income 876.45 = 58.7% (check: 100 - 33.6 - 7.8 + 0.03 = 58.7).
- Non-operating items +34.59 = +2.3% of sales (net interest income 31.66). Pre-tax 911.04 = 61.0%.
- Income tax 147.70 = **9.9%** of sales (effective tax rate 16.2% of pre-tax). Net income 763.06 = **51.1%** = $51 of every $100 (net profit margin, MR p.1). Chain: 100 - 33.6 - 7.8 + 0.03 + 2.3 - 9.9 = 51.1.
- Note: the $51 is the **net profit margin**, not the gross margin. Gross margin is 66.4% (so "$66 left after making the chips"). The script's wording (k20/k21 "kept") is right for net margin; it must never be called gross margin.
- Year ago: net margin 45.7% (MR p.1; script "about $46" OK).
- QoQ: revenue +17.6%; net income +8.0%; gross profit +15.4%; cost of revenue 501.86/410.07 = +22.4%; opex +17.6%; operating income +14.3%.
- Platform shares 68+21+4+4+1+2 = 100. Node shares 8+33+28+10+6+6+2+4+1+2 = 100. Newest four 8+33+28+10 = 79 (matches TSMC's "advanced technologies 79%"); older = 21.
- Guide midpoints: gross margin 66.0% vs 66.4% = -0.4 pt (TR p.3 says the same); operating margin midpoint 57.5% vs 58.7%.

## Claims table
| ID | Claim | Script value | Source and page | Status |
|---|---|---|---|---|
| w00 | Net profit kept per $100 sales | $51 | MR p.1 (net profit margin 51.1%); ER para 4 | Verified (net, not gross) |
| w00 | TSMC makes chips others design | pure-play foundry | ER "About TSMC": "pioneered the pure-play foundry business model" | Verified |
| w02 | Revenue Jul-Sep 2026 | $46.7 billion | MR p.1 (US$46.72bn); ER para 3 | Verified |
| w02 | Results date | 15 Oct 2026 | MR p.1; ER dateline | Verified |
| w02 | Nvidia is a TSMC customer | named | Nvidia 10-K FY2026, Item 1 (supply chain): "We utilize foundries, such as ... TSMC" | Verified (from Nvidia's own filing) |
| w02 | Apple is a TSMC customer | named | Not named in TSMC 20-F (customers shown as Customer A/B), TR, MR, ER; Apple 10-K says only "outsourcing partners ... Taiwan" | **Unverifiable in primary docs** |
| p10 | HPC share | $68 | MR p.2 platform table; TR p.3 | Verified (label "AI chip makers" is our paraphrase of HPC) |
| p10 | Smartphone share | $21 | MR p.2 | Verified |
| p10 | Everything else | $11 | MR p.2 (IoT 4 + Auto 4 + DCE 1 + Others 2 = 11) | Verified |
| p11 | Year-ago HPC share | $57 | MR p.2 (3Q25 column: 57%) | Verified |
| k20 | Year-ago net margin | about $46 | MR p.1 (45.7%) | Verified |
| k21 | Cost of revenue | $33 | 501.86/1494.24 = 33.6%. MR p.2 | Verified (rounds to $34; say "about $34" or keep "about $33"; 33.6 is nearer $34) |
| k21 | Operating expenses | $8 | MR p.3 (7.8%) | Verified |
| k21 | Tax | $8 | 147.70/1494.24 = 9.9% (MR p.3) | **Corrected: about $10** |
| k21 | Interest/other income | "tax is after interest income" | Non-operating +34.59 = +$2.3 (MR p.3) | Verified; add "plus about $2 of interest and other gains" so $33.6+$7.8+$9.9 = $51.3 less $2.3 = $49 sums to $51 |
| k22 | Sales growth YoY | +50.9% | MR p.1; ER para 2 | Verified |
| k22 | Profit growth YoY | +68.7% (TWD) | MR p.1; ER para 2 (net income and EPS both +68.7%) | Verified |
| c30 | N2/N3 are named by nanometre; smaller = newer | explainer | General explainer, not a figure | Not a sourced figure (no claim to verify) |
| c31 | 3nm share of wafer revenue | $33 | MR p.2; ER para 4 | Verified |
| c31 | 5nm | $28 | same | Verified |
| c31 | 7nm | $10 | same | Verified |
| c31 | 2nm | $8 | same (3Q25: 0%, 2Q26: 3%) | Verified |
| c31 | Older sizes | $21 | MR p.2 (6+6+2+4+1+2 = 21) | Verified |
| c31 | "of every $100 of chips sold" | wafer revenue | These are shares of **wafer revenue** (MR p.2 header), not total net revenue | Verified; say "wafers" if precise |
| c32 | Newest four | $79 | MR p.2 and ER para 4 ("advanced technologies ... 79%") | Verified |
| c32 | New fab costs billions; years to learn | "OUR READING" | TSMC capex US$13.84bn in 3Q26 (MR p.5), US$40.64bn year to date (MR p.5). "Years to learn" has no figure in these documents | Capex verified; "years" is our reading, keep labelled |
| s40 | Sales QoQ | +17.6% | MR p.1; ER para 2 | Verified |
| s40 | Profit QoQ | +8.0% | MR p.1 (net income) | Verified, but see framing issue 3 (add that 2Q26 had NT$67.43bn of one-off gains, MR p.3 II-3) |
| s40 | "Costs grew faster than sales" | claim | Cost of revenue +22.4%; opex +17.6%; operating income +14.3% | **Partly corrected**: true for cost of revenue only |
| s41 | Gross margin 2Q26 | 67.7% | MR p.1-2 | Verified |
| s41 | Gross margin 3Q26 | 66.4% | MR p.1-2; ER para 5 | Verified |
| g50 | Q4 gross margin guide | 65% to 67% | ER guidance bullets; TR p.3 | Verified |
| g50 | Last quarter | 66.4% | MR p.1 | Verified |
| g51 | Midpoint "a little below" | 66.0% vs 66.4% | TR p.3 ("decrease by 40 basis points to 66% at the midpoint") | Verified |
| g51 | Operating margin guide | 56.5% to 58.5% vs 58.7% | ER guidance; MR p.1 | Verified |
| t62 | 2nm share $8 today | $8 | MR p.2 | Verified |
| t62 | AI makers above two-thirds | 68% now | MR p.2 | Verified (HPC) |
| w00 etc. | "Factory keeps half" | $51 | Net margin 51.1% | Verified |

Counts: 31 figures/claims verified, 2 corrected (tax $8 -> $10; "costs grew faster" narrowed), 1 unverifiable (Apple named), 3 label or reading notes (HPC = "AI chip makers", wafer revenue vs sales, "years to learn").

## s42: reasons for the margin dip, from TSMC's call (TR p.3, CFO Wendell Huang's prepared remarks; MR p.2)
Paraphrased; quote only the short phrase if needed.
1. **The 3Q26 gross margin fell 1.3 points (to 66.4%) mainly because the first ramp of 2-nanometre chips earns less at first** ("margin dilution from the initial ramp-up of N2"). TSMC's own report says the same (MR p.2 gross profit analysis).
2. **Operating costs rose too:** operating expenses up NT$17.45bn to NT$116.43bn (R&D up from 73.14 to 88.98, MR p.3), and 2Q26 had earthquake insurance claims that did not repeat (MR p.3).
3. **Looking ahead, TSMC names two more pressures for 4Q:** the steep 2nm ramp continues, and its overseas fabs cost more to run (about 2 points of dilution for the full year 2026, expected to widen to 3 to 4 points over the next few years as more US fabs ramp). TSMC says cost improvement (productivity, capacity optimisation across nodes) partly offsets this.

Suggested s42 text (needs AK's approval; kept to about 7-10 s): "What made costs grow? On its call, TSMC gave one main reason for the dip: its new 2-nanometre chips earn less at first. And operating costs rose with research spending. Next quarter it adds overseas fabs, which cost more to run."
Suggested on-screen list: "TSMC's reasons: 1. New 2nm chips ramping (earn less at first). 2. Research costs up (R&D NT$89bn vs NT$73bn). 3. Overseas fabs cost more (about 2 points of margin in 2026)."
Reason 3 is a 2026-wide and Q4 point, not the cause of the Q3 dip; label it "and next quarter" on screen. Reason 2 is from the MR (operating margin), not the call: the call says the gross margin dip is "primarily" the 2nm ramp.

## Customers (point 3)
- TSMC 20-F FY2025 (Item 3 risk factor on customer concentration; notes, "Major customers representing at least 10% of net revenue"): ten largest customers = about 78% of 2025 net revenue; largest customer 19%; second largest 17%. **Customers are not named** (Customer A etc.).
- Nvidia 10-K FY2026 (filed 25 Feb 2026), business/supply section: names TSMC (and Samsung) as foundries used to produce its wafers. So "Nvidia is a TSMC customer" is supported by Nvidia's own filing.
- Apple 10-K FY2026: no mention of TSMC; says manufacturing is done by "outsourcing partners" in Taiwan and other countries. **Not confirmed.**
- Suggestion for w02: "Companies like Nvidia design chips" or "Big chip designers, like Nvidia". Do not name Apple unless AK accepts a non-primary source (the rules ban news). Also the 20-F says its two largest customers are 19% and 17% of revenue: a verifiable concentration fact for the moat discussion (and a risk).

## Other notes for AK
- All figures are in the 3Q26 release dated 15 Oct 2026; nothing newer was found in the SEC index at 6 Nov 2026 other than the 8 Oct and 22 Oct 6-Ks (monthly revenue, not read).
- Moat-test verdict (t61) remains our reading, as labelled.
- Search log (searches done): TSMC investor page via WebFetch (links found); direct curl of investor.tsmc.com/tsmc.com/pr.tsmc.com PDFs (403 on all); SEC EDGAR submissions index for TSMC (found 6-K and 20-F); SEC 6-K read; 20-F read; Nvidia and Apple 10-K grep for TSMC. No news or blog source used.
