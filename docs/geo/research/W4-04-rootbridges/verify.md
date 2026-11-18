G6: PASS. All 8 spine claims (C001-C008) re-checked against both the saved copies and fresh live fetches; every quote is present word for word, and the script output reproduces exactly. Three small residuals (below) touch no spine claim.

# W4-04 Root bridges: independent verification (G6, Shorts lite mode), 14 Nov 2026

Verifier: separate Claude Code session; did not do the research. Sources re-opened: S01 live (nature.com, HTTP 200, text extracted fresh) and S02 live (whc.unesco.org: curl got the Cloudflare check, which I did not bypass; the built-in browser pane loaded the page normally, so the live text was read there). Saved copies in sources/ also checked.

| Claim | Source / locator | Result | Evidence |
|---|---|---|---|
| C001 | S01 Abstract; S02 Desc. para 2 | PASS | Both quotes found live (S01 "which are grown with aerial roots of Ficus elastica"; S02 "India rubber tree-based bridge construction near Cherrapunji"). Two independent owners. |
| C002 | S02 Desc. para 1; S01 Discussion | PASS | "Grown by indigenous Khasi tribal communities" and "In the Khasi and Jaintia Hills of Meghalaya, inhabitants of isolated villages have devised..." found live. |
| C003 | S01 Abstract; S02 Desc. para 2 | PASS | "...adaptive secondary growth and their capacity to form a mechanically stable structure via inosculations" and "Validating their increasing strength and ingenious use of root inosculation" found. |
| C004 | S01 Abstract; Results | PASS | "display a length of 2 to 52.7 m"; "58 of 73 measured lengths, or almost 80%, are shorter than 20 m" found. Script finds 72 lengths and 55 under 20 m (see residual 1). |
| C005 | S01 Abstract; Fig. 6 caption | PASS | "Some bridges are several hundreds of years old"; caption (b): residents' statement, Nongriat #6 "estimated to be ca. 200 years old". Hedged correctly. |
| C006 | S01 Discussion; Table S1 | PASS | Both Discussion quotes found ("growth time of already 66 years"; "data do not allow for a statement on the time needed"). Table S1 (live docx byte-identical to the saved copy) row 50 Siej age 66; footnote "Ages ... refer to ... 2017/2018", so start about 1951-52 is correct. |
| C007 | S02 header | PASS | "Date of Submission: 17/02/2022", "Submitted by: Permanent Delegation of India to UNESCO" found live; it is the Tentative List, not the World Heritage List. |
| C008 | S02 Criterion (vi) | PASS | Full sentence found verbatim live. Single State Party source, attributed in the dossier. |
| C009 (non-spine) | S01 Results | PASS | "68 of the 71 geo-located bridges are located in the rainforest valleys" found. |

## Measurements
method/rootbridge_numbers.py re-run with `python3 -I method/rootbridge_numbers.py <folder>`: output identical to the saved output. Lengths 52.7 m (#37 Rangthylliang 12), 71 geolocated, 66-year Siej, 52.7/7 = 7.5, 41.2 km W-E, 17.3 km S-N, 21.0 km Nongriat to Rangthylliang 12, 72 UNESCO rows: all reproduce. The 7 m "typical" is Fig. 1's caption ("Ummonoi ... 7 meters, is a typical example of a mature living root bridge"). Definitions are consistent: ages as of 2017/2018; the two datasets (Table S1 vs UNESCO village list) are kept separate in the dossier.

## Statuses, myths, safe-to-say
Statuses honest (VERIFIED-P for numbers stated in the primary; CORROBORATED needs two independent owners and has them). No tier-X source in claims. Myths M1-M3 verdicts match the evidence (the 72-entry vs "more than 75" difference confirmed on the live page). Every safe-to-say line 1-10 carries a claim ID that passes.

## Licence of the two figures (checked on the article page itself)
The page's "Rights and permissions" says: "This article is licensed under a Creative Commons Attribution 4.0 International License", and that images and other third-party material are included in that licence "unless indicated otherwise in a credit line". The Figure 1 and Figure 6 captions carry no credit line; the photos are the authors' own (Rogers/Middleton field work). Both image URLs return HTTP 200. Result: CC BY 4.0 confirmed. Credit "Ludwig et al. 2019, Scientific Reports, CC BY 4.0", state that the image is cropped, and link the licence. Note the article text-page statement is for the whole article; no per-figure exception found.

## Residuals (none blocks)
1. C004 note: our parse finds 55 lengths under 20 m of 72; the paper says 58 of 73. A single lost row cannot explain 3 fewer, so the paper's 58 is used as the paper's own statement and not reproduced by us. Keep the claim attributed to the paper ("scientists counted"); do not present 58 as our count.
2. Dossier hook "planted around 1951" is our back-calculation (66 years minus 2017/2018) of a bridge the paper says was started by people now living; keep the screen line "our measurement" and say "around".
3. Reveal Loop belief ("a bridge is something you build") is uncited, as the dossier itself says. "Grown and tended" is the more exact wording than "grown, not built".

## Wording scan
No disputed claim stated as fact. "Wettest region" correctly excluded. "Several hundred years" and "about 200" hedged. Belief about the childless elder must stay "India's UNESCO file says".
