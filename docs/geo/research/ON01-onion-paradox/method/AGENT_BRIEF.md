# ON01 The Onion Paradox: brief for research agents (12 Nov 2026)

Film: Indica Atlas long explainer (10-11 min), Kurz look: why one vegetable has so much power over India
(concentrated production map, three harvests and risky storage, farm-to-city chain, export policy, 1998 Delhi, farmer-consumer paradox).
AK's input brief: method/input_deep_research_report.md (an AI report: its figures are CLAIMS TO TEST, never evidence).
Rules: /Volumes/DarwinSSD/MMVideo/docs/geo/RESEARCH_RULES.md (read sections 0, 1, 4, 6, 7 first). Key points:
- Nothing from memory. Every fact comes from a document you opened in this run, with the exact words (or table values) copied.
- PRIMARY sources only as evidence: Government of India (DA&FW / agriwelfare.gov.in, Agricultural Statistics at a Glance, IASRI,
  ICAR / ICAR-DOGR / NHRDF, APEDA, DGFT notifications, CBIC/Finance Ministry notifications, Department of Consumer Affairs,
  PIB releases, Lok Sabha / Rajya Sabha answers and debates (eparlib.sansad.in), Election Commission of India reports,
  Maharashtra Agriculture Dept, Lasalgaon APMC), data owners (data.gov.in, AGMARKNET, UN Comtrade, FAO), peer-reviewed papers
  reporting their own measurements/analysis, religious texts or scholarly editions for the culture claims.
- BANNED as evidence: news sites, market-research vendors, Wikipedia, blogs, YouTube, AI answers. Read them ONLY to find the
  primary they cite, or to list popular claims. (A newspaper from 1998 itself is a period record, P3, usable for "what was reported".)
- PIB often refuses plain fetches: try the PIB URL, then the ministry's own site; if blocked, log it as BLOCKED with the URL so the lead
  can read it in a browser. Never bypass a CAPTCHA or paywall.
- An interested party (a ministry about its own scheme) is recorded as "the ministry says".
- If a claim cannot be found at a primary source, mark it UNVERIFIED (or SECONDARY-ONLY with the citation chain). Never guess.
- Conflicts between sources (e.g. advance estimates that differ): record every version with its vintage; do not silently pick one.

For each source used as evidence: save a local text copy to sources/<SRC>_<slug>.txt (the relevant page text, or the table rows,
with URL and access date on the first lines). PDFs: save the PDF as sources/<SRC>_<slug>.pdf AND the extracted text of the pages used
as .txt (use `pdftotext -layout -f N -l N` or python). Use your own source-id prefix (given in your task) so agents do not collide.

Write three files in /Volumes/DarwinSSD/MMVideo/docs/geo/research/ON01-onion-paradox/ (replace X with your letter):
- claims_X.jsonl : one JSON per line: {"id","claim","type"(place/distance/date/event/number/name/quote/visual),"spine"(true/false),
  "status"(VERIFIED-P / CORROBORATED / SECONDARY-ONLY / RECOLLECTION / DISPUTED / UNVERIFIED / CONTRADICTED),
  "evidence":[{"src","locator","quote","quote_lang":"en","translation":""}],"method":"","notes":""}
  Claim ids: X-C01, X-C02, ... The quote must be an exact substring of your saved local copy (a script re-finds it).
- sources_X.jsonl : {"src","tier"(P1..P5, S, X),"kind","title","creator","created","accessed":"2026-11-12","url","archive_url":"","local_file","language":"en","origin"}
- search_log_X.md : every search and URL tried, including ones that failed or found nothing; and a section "Popular claims tested"
  with a verdict for each brief claim you were given (Confirmed / Contradicted / Embellished / Unverifiable) and the corrected wording.
Final reply to the lead: under 400 words: the verdict table for your brief claims (claim -> verdict -> corrected value -> source id),
surprises (facts other videos miss), and anything you could not open (with URLs).
