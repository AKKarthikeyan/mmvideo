# SP01 Spruce Pine quartz: brief for research agents (11 Nov 2026)

Film: Indica Atlas long explainer (10-12 min) on Spruce Pine, North Carolina high-purity quartz and the chip supply chain.
Rules: /Volumes/DarwinSSD/MMVideo/docs/geo/RESEARCH_RULES.md (read sections 0, 1, 4, 6, 7 first). Key points:
- Nothing from memory. Every fact comes from a document you opened in this run, with the exact words copied.
- PRIMARY sources only as evidence: the company's own pages/press releases/annual reports (Sibelco, The Quartz Corp, CSX, wafer makers),
  government (NOAA/NHC/NWS, USGS, NC Geological Survey, US Census, NCDOT, Town of Spruce Pine, SEC filings), the owner of a number
  (WSTS, SIA, SEMI), peer-reviewed papers reporting their own measurements, original papers.
- BANNED as evidence: news sites (Forbes, TechTarget, Wired, NPR, local TV), market-research vendors (Meticulous, Persistence, MRFR),
  Wikipedia, blogs, YouTube, books retelling. You may read them ONLY to find the primary they cite, and to list popular claims.
- A company is an interested party about its own importance: record its claim as "the company says".
- If a claim cannot be found at a primary source, mark it UNVERIFIED (or SECONDARY-ONLY with the citation chain). Never guess.
- Conflicts between sources: record every version; do not silently pick one.
- Legal access only. No CAPTCHA or paywall bypass. If a page blocks you, log it and try the publisher's PDF or another primary.

For each source used as evidence: save a local text copy to sources/<SRC>_<slug>.txt (the relevant page text, with URL and access date on
the first lines). Use your own source-id prefix (given in your task) so agents do not collide.

Write three files in this folder (replace X with your letter):
- claims_X.jsonl : one JSON per line: {"id","claim","type"(place/distance/date/event/number/name/quote/visual),"spine"(true/false),
  "status"(VERIFIED-P / CORROBORATED / SECONDARY-ONLY / RECOLLECTION / DISPUTED / UNVERIFIED / CONTRADICTED),
  "evidence":[{"src","locator","quote","quote_lang":"en","translation":""}],"method":"","notes":""}
  The quote must be an exact substring of your saved local copy (a script re-finds it).
- sources_X.jsonl : {"src","tier"(P1..P5, S, X),"kind","title","creator","created","accessed":"2026-11-11","url","archive_url":"","local_file","language":"en","origin"}
- search_log_X.md : every search and URL tried, including the ones that failed or found nothing; and a section "Popular claims tested"
  with a verdict for each brief claim you were given (Confirmed / Contradicted / Embellished / Unverifiable) and the corrected wording.
Final reply to the lead: under 400 words: the verdict table for your brief claims (claim -> verdict -> corrected value -> source id),
surprises, and anything you could not open.
