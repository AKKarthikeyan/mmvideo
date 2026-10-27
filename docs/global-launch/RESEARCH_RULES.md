# Moat Atlas: research rules (v1, 27 Oct 2026)

**What this is:** the conditions every Moat Atlas video (earnings breakdown, Follow the Dollar, Atlas Entry, Shorts) must meet before a script or chart JSON is written. It is written to be the brief for a research AI agent, word for word. LAUNCH_PLAN.md, CONTENT_PLAN.md and FORMATS.md decide the format. This file decides **what the filings really say**. If they conflict on a fact, this file wins.

**AK's goal (27 Oct 2026):** no video that retells what every finance channel already said about a company. Every story comes from deep research in the company's own filings. Leave no stone unturned, and don't stop at 3–4 sources. Primary sources first; secondary only when the primary can't be reached, and never an analyst's, journalist's or YouTuber's interpretation.

**MUST** = a hard rule; breaking it fails the research. **NEVER** = forbidden. **SHOULD** = expected; if skipped, write down why.

---

## Rule 0: nothing comes from memory
0.1 The agent's background knowledge is **not a source**. It may suggest which filing to open, and NEVER supplies a figure.
0.2 Every figure MUST be read off the filing document itself during this run (not a search excerpt, not a summary, not a chart someone else made), with the document, page, and item or note number recorded. *Lesson from EP01 TSMC: figures taken from search excerpts and an App Economy Insights graphic had to be flagged as unverified.*
0.3 A figure that can't be read at source is marked `check` (FORMATS.md) and is NEVER voiced as fact.

---

## 1. Source tiers

### Tier P: primary
- **P1 · The company's own filings:** 10-K, 10-Q, 20-F, 6-K, 8-K, 40-F, S-1/F-1, proxy (DEF 14A); annual and interim reports filed with home regulators (Japan EDINET yuho, Taiwan MOPS, Korea DART, India BSE/NSE and MCA, EU national registers, UK Companies House); the audited financial statements and their notes.
- **P2 · The company's own words outside filings:** earnings releases, investor presentations, shareholder letters, and earnings-call transcripts **published by the company**. These are labelled **management says**: they are claims, not audited facts.
- **P3 · Regulators and courts:** SEC comment letters, competition-authority decisions, court rulings, sector regulators' statistics (FCC, FDA, central banks, telecom regulators), patent records.
- **P4 · The owner of a number:** for market size or industry data, the body that collects it (government statistics, industry associations' own reports, central-bank FX rates for conversions). A research firm's press release (Gartner, IDC, Counterpoint) is used only with the firm named on screen, as a claim.
- **P5 · Exchange data:** share counts, listing documents.

### Tier S: secondary (only when the primary can't be reached)
Scholarly work (peer-reviewed finance or strategy papers, Harvard or university case studies that cite filings) and books with footnotes. Used first as a **map to the filings they cite**. As evidence only as `S → cites [filing]`. NEVER take their verdict on the moat.

### Tier X: banned as evidence
- Sell-side and buy-side research notes, rating-agency commentary used as "what it means"
- Seeking Alpha, Motley Fool, Substack and Medium posts
- Financial news articles (they may point to a filing; read the filing)
- Infographic accounts (App Economy Insights and the like)
- Data aggregators (Macrotrends, Statista, Yahoo/Google Finance tables, Koyfin screens); use them to find the period, then read the filing
- YouTube finance channels, podcasts, AI answers, Wikipedia

---

## 2. Search coverage: the stones to turn
Log every search, including the ones that found nothing (`search_log.md`):
1. **The latest annual and interim filings,** and confirm nothing newer has been filed (EDGAR / the home regulator's index). Record the filing date and period end.
2. **The notes,** not just the face of the statements: segment note, revenue disaggregation, leases, stock-based compensation, related parties, commitments, contingencies and subsequent events.
3. **MD&A and risk factors:** what management says drove the numbers, and what it says could break the business (said as "management says").
4. **Restatements and recasts:** a later filing that recast segments or restated a prior year. Use the latest recast figures for comparisons, and say so.
5. **Five years of history** from the filings themselves (or each filing's comparatives), so a trend is never built from one year.
6. **Home-language filings** for non-US companies (Japanese yuho, Chinese MOPS, Korean DART). Where the English version is a convenience translation, check key figures against the original.
7. **The proxy and ownership:** voting control, dual-class structure, related-party deals.
8. **Peers, read the same way:** every peer figure on a chart is read from the peer's own filing for the same period basis (calendar-quarter alignment as LAUNCH_PLAN says).
9. **Regulators and courts:** open antitrust or regulatory cases that bear on the moat.
10. **FX:** the rate source and date (central bank or the filing's own convenience rate), stated on screen as LAUNCH_PLAN says.
11. **The company's origin or history story,** if told: run the Inventor's Desk rules on it (`docs/inventors_desk/RESEARCH_RULES.md`). Founding myths are tested, not repeated.

---

## 3. When research may stop
Research stops only when **all** of these are true:
- every figure on a chart or in the voice is read off a filing (or labelled `check` and kept out of the voice);
- the section 2 steps are logged;
- the last three documents opened added no new figure, caveat or contradiction;
- an earnings breakdown has also read the release, the 10-Q/6-K **and** the call transcript;
- the gates in section 9 pass.

---

## 4. Claims
4.1 One figure or fact per claim, in `claims.jsonl`: `id`, `claim`, `value`, `unit`, `currency`, `period` (fiscal and calendar), `basis` (GAAP / IFRS / non-GAAP with the reconciliation location), `doc`, `locator` (page, item, note, line), `quote`, `status`, `derived_formula` (if computed), `notes`.
4.2 **Statuses** (FORMATS.md roles plus the research rules):
- **verified:** read off a filing.
- **derived:** computed in a script from verified figures, with the formula recorded.
- **management says:** P2, attributed in the voice.
- **disputed:** sources or periods conflict; said as such or cut.
- **check:** not yet read at source; never voiced.
4.3 **Spine claims** (every number voiced, every bar or flow on a chart, the moat verdict's evidence) MUST be verified or derived.
4.4 **Non-GAAP:** always say it is non-GAAP, and keep the GAAP figure and the reconciliation location in the ledger.
4.5 **Moat claims need evidence, not adjectives:** retention, renewal, pricing, market share, switching costs, network effects or scale cost advantages, each backed by a disclosed figure or a regulator's finding. A management claim of a moat is "management says". Our verdict is ours and is labelled as analysis. **No advice** (no buy, sell, target or allocation).
4.6 **Interested-party flag:** when the researcher has a link to the subject (for example, Claude researching Anthropic), record it in the dossier. An independent reviewer is then mandatory (the Anthropic S-1 precedent: an independent review raised 7 MUST FIX items).

---

## 5. The popular reading is quarantined
News, analyst and YouTube takes on the same results may be skimmed **only** to list their claims ("record quarter", "losing share", "AI winner"). Each one goes into `myths.md` with a verdict backed by filing figures. Nothing from them enters the script.

## 6. Conflicts
Record every version. Ranking: an audited filing beats an unaudited release; the latest recast beats the original; the company's own filing beats a third party; a research firm's estimate is weakest. If it can't be settled, it is disputed and is not voiced as fact.

## 7. Honesty and access
Legal access only (EDGAR, regulators, company IR sites). Respect EDGAR's fair-access rules: declare a User-Agent, and stay under 10 requests a second. No paywall tricks. Save each filing used (PDF or HTML) with its accession number. Quotes in the ledger stay short; the script retells in our words.

## 8. Output
`docs/global-launch/research/<id>/`: `dossier.md` (the business in plain words with claim IDs, the moat evidence, what to watch), `claims.jsonl`, `sources.jsonl`, `search_log.md`, `myths.md`, `conflicts.md`, `open_questions.md`, `verify.md`, `sources/`. The chart JSON marks every figure `verified` / `derived` / `check`, as FORMATS.md requires.

## 9. Gates: all must pass before scripting
- **G1 Sourced:** every figure has a document and locator.
- **G2 Spine:** every voiced or charted figure is verified or derived.
- **G3 Coverage:** section 2 is logged.
- **G4 Saturation.**
- **G5 No banned evidence.**
- **G6 Independent verification:** a separate checker re-reads every voiced figure and one in three of the charted ones at source, and re-runs every derived formula. It is mandatory when 4.6 applies.
- **G7 Fresh angle:** at least **2 verified findings from the filings that the mainstream coverage of the same results missed** (a note disclosure, a segment shift, a cost line, a voting-control fact). This is the reason for the video.
- **G8 Myths audited.**
- **G9 No advice:** no buy, sell, target or allocation language, and "Information, not investment advice" is present (LAUNCH_PLAN).

Each script line carries its claim IDs (`"claims": [...]`). The pinned sources comment lists filings with accession numbers.
