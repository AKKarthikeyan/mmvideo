# Audit (gate S5): 2021-PSIR1-5E (significance of the First Amendment, 1951)

Method: independent audit, 11 Nov 2026, following 2024-gs2-12/AUDIT.md. The Act and the four judgments were reopened at their saved local PDFs (Legislative Department's copy; Supreme Court's api.sci.gov.in copies saved earlier; no new request made to the Court). Page numbers are PDF page indices. Dates, benches and holdings compared against the judgments. Fixes applied in claims.csv; changed rows carry '[Audit 11 Nov 2026]'.

**Counts:** 16 rows: PASS 8, FIX 6 (-02, -04, -06, -08, -10, -11), FLAGGED 2 (-15, -16 NOT FOUND, correctly left).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| -01 | PASS | Act dated 18 June 1951; SOR New Delhi 10 May 1951, signed Jawaharlal Nehru (p.1). 'Provisional Parliament' is not in the Act text; row says so | - |
| -02 | FIX | Quote matches, but the SOR says 'last fifteen months of the working', the row said 'first fifteen months' | claim corrected |
| -03 | PASS | SOR p.1 matches; row says the SOR names no case | - |
| -04 | FIX | Text of Art 19(2) as substituted matches word for word; 'deemed always to have been enacted' matches. Page was p.3, is p.2. Sixteenth Amendment 1963 checked at the Constitution footnote 4 (POL03 source) | page corrected |
| -05 | PASS | Thappar p.4 (Sastri J.) quotes original cl.(2); 'new grounds' is labelled our inference | - |
| -06 | FIX | Art 19(6) text and 'beyond doubt' match; page was pp.1, 3, is pp.1-2 | page corrected |
| -07 | PASS | s.2 Art 15(4) p.2 matches; SOR says 15(3) 'amplified', row warns | - |
| -08 | FIX | 31A, 31B match (p.3); Ninth Schedule is pp.5-6, 13 entries recounted. Page was pp.3-5 | page corrected |
| -09 | PASS | 'dilatory litigation', last three years, SOR p.1 | - |
| -10 | FIX | Contents of ss.6-13 match; page was pp.5-6, is pp.4-5. The 341/342 gloss described the article, not the change (consultation with Governor or Rajpramukh only for Part A and B States) | page and gloss corrected |
| -11 | FIX | Champakam: 9 Apr 1951, seven judges (Kania CJ, Fazl Ali, Sastri, Mahajan, Mukherjea, S.R. Das, Bose), Communal G.O. void under Art 29(2) and Art 13, 'sacrosanct' p.5, DPSP subsidiary, 'Appeals dismissed' p.6: all match. The link of the case to Art 15(4) was not marked as our inference on the row | note added |
| -12 | PASS | Thappar: 26 May 1950; Sastri J. for Kania CJ, Mahajan, Mukherjea, Das JJ.; Fazl Ali J. separate and dissenting; s.9(1-A) wholly void; application allowed, order quashed (p.9). The SC header lists Fazl Ali first; the row explains. Link to the amendment marked as inference | - |
| -13 | PASS | Shankari Prasad: 5 Oct 1951; Sastri, Kania CJ, Mukherjea, S.R. Das, Aiyar; Act not ultra vires; Provisional Parliament competent under Art 368; 'law' in Art 13(2) excludes constitutional amendments; 'no opinion' on latter part of 31B; petitions dismissed with costs (p.13) | - |
| -14 | PASS | Coelho: 11 Jan 2007; nine judges; Sabharwal CJI; conclusions (i)-(vi) at pp.40-41; rights test and essence-of-right test (iv); 24 Apr 1973 (iii, v); earlier upheld laws not reopened (v). The SC header spells the case 'Goelho'. 24 April 1973 is the Kesavananda date as the Court itself states (line 403), so Waman Rao is not needed for the cut-off | - |
| -15 | FLAGGED | NOT FOUND, correctly kept; outcome and date not claimed | - |
| -16 | FLAGGED | NOT FOUND, correctly kept; 'five opposed' stays UNVERIFIED | - |

## Case-to-amendment links
Marked as our inference on -03, -05, -12, NOTES.md, and (after this audit) -11. Shankari Prasad (-13) decides on the Act directly, so no inference is needed. The SOR cites no case.

## NOTES.md coverage of POL ids
Cited ids exist: POL03-B05, D02, H05 (CONFIRMED, read at the Constitution as on 10 Sep 2026) support Art 15(4), Art 19(2) today and Art 31B. POL06-A07, A08, B03, B04 (CONFIRMED, Legislative Department). POL06-C01, C02, C04, F06 (CONFIRMED) are read only from Indian Kanoon mirrors, as NOTES.md says; use them for 'later course' only with that caveat. POL06-F07 is also a mirror. POL03-B05's Champakam link comes from Indra Sawhney, which was not opened.
