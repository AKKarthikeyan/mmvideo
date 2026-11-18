# W3-07 Konkan Railway: independent verification (G6)

G6: PASS

Checker: independent G6 run, 8 Nov 2026 (lite mode). All spine claims C01-C08 pass; two wording fixes advised below (not FAILs).

| Claim | Check | Result |
|---|---|---|
| C01 (spine) | RS 11 Aug 1969 starred Q 464: saved copy and live PDF byte-identical; all 3 quotes present; answerer is "Minister of Railways (Dr Ram Subhag Singh)": "Rs. 60 crores ... present difficult ways and means position ... meagre resources for priority projects ... not possible to consider ... at present" | PASS |
| C02 (spine) | RS 27 Jun 1980 U1171 live PDF identical to saved; quotes present (OCR "kmi."/"tQ" as noted). KRCL "Beginning" live page: Dandavate/Apta-Roha, Mar 1986 | PASS |
| C03 (spine) | Live KRCL The Beginning: "July 19, 1990" and "September 15, 1990" present | PASS |
| C04 (spine) | KRCL "by no means realistic" live; Sida "unrealistically optimistic, and probably chosen at least partly for political reasons" in OCR line 3434; Sida PDF live = saved | PASS |
| C05 (spine) | Annual report / Introduction quotes found in saved copies (digit by digit) | PASS |
| C06 (spine) | Live KRCL Salient Features: 738.941, 84.496, Karbude, 2286, 2065.8 all present | PASS |
| C07 (spine) | Sida summary quote matches saved OCR exactly | PASS |
| C08 (spine) | Three Sida quotes found in OCR (nine soft soil tunnels; biggest cost increase; chairman's "not been done (successfully) anywhere"), attributed to the chairman | PASS |
| method | `python3 -I distance_and_arithmetic.py <ne_10m_populated_places_simple.geojson>` output identical to the saved output (718 km, 2690 days = 7.36 y, 11.4%, 8.1 km/tunnel, 9-10x). Units and years consistent; 4.5 y target and 7.28 y alternative both disclosed | PASS |
| non-spine C10 | Sida: "impossible to raise 10 billion ... within the Indian Railways budgetary framework"; the same passage says "billion rupees", so Rs is right | PASS |
| non-spine C09, C11, C12 | quotes found in saved KRCL copies | PASS |
| statuses | VERIFIED-P / CORROBORATED use fits; C09 correctly marked builder self-description; no tier-X source | PASS |
| myths.md | M1 Unverifiable, M2/M3 Embellished match the evidence | PASS |

## Wording risks (advise fixing before script)
1. Dossier section 0 honest wording "The line India kept saying it couldn't afford" and "For decades the answer was 'not now'": the record holds ONE dated refusal (11 Aug 1969), and work on Apta-Roha was begun by Jun 1980. "Kept saying" and "for decades" overstate. Safer: "In 1969 the government told Parliament it couldn't afford it 'at present'."
2. Sida's "impossible" (C10) is about raising Rs 10 billion inside the Railways budget in 1990, a different thing from the 1969 refusal; do not merge them into one continuous "money said no" story.
3. "Built in about seven years once a company was set up to raise the money": the corporation was set up partly for finance (C10) but "to raise the money" is Sida's reasoning, so attribute it. Also the first 62 km (1980-86) was already built before KRCL.
4. "No one said it could not be built" must not be asserted as fact: only "no named person/report/date found in the three sources".

## research_check.py
Run with --lite before this file was written: G6 was the only FAIL (pending). Re-run after this file.
