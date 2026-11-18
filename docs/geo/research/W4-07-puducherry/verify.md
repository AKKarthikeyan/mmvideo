G6: PASS. All 8 spine claims (C01-C08) pass independent re-check on 15 Nov 2026; one status label and a few wording points are noted below (none touches a spine claim).

# W4-07 Puducherry: independent verification (G6, Shorts Lite)

Verifier: separate Claude Code session, did not do the research. Live pages re-fetched (HTTP 200: py.gov.in/about-puducherry, py.gov.in/history, statistics.py.gov.in/overview-puducherry-2013) and every quote searched for in my own fresh copy AND the saved copy. Script re-run with `python3 -I`; output identical (diff clean) to saved output.

| Claim | Result | Evidence |
|---|---|---|
| C01 four establishments scattered | PASS | exact words in live+saved About page body |
| C02 bounded by Tamil Nadu on three sides | PASS | exact, About page |
| C03 Mahe surrounded by Kerala | PASS | exact ("on the Western Ghats" included), About page |
| C04 Yanam adjoins East Godavari, AP | PASS | exact, About page |
| C05 Karaikal about 130 km south | PASS | exact; hedge "about" kept |
| C06 de facto 1 Nov 1954; "officially" 1963 | PASS | exact in History (and About); History says 1963 after French Parliament ratification |
| C07 two districts, Puducherry district holds three regions | PASS | exact, Overview 2013 page |
| C08 distances 113/468/592/911 km | PASS | re-run reproduces all; haversine R=6371.0088; same units/basis for every figure |

## Coordinates (OSM town points)
- Natural Earth file has only Puducherry (79.83, 11.934994, matches script). Karaikal, Mahe, Yanam are NOT in it, so no NE cross-check is possible; no official-page coordinates are on the saved pages either.
- Saved Nominatim JSON: Karaikal = place=town way (bbox +/-0.015 deg, about 2 km), display name "Karaikal, Karaikal Taluk, Puducherry"; Mahe = place=town node, "Mahe, Mahe Taluk, Puducherry"; Yanam = place=town node, "Yanam, Yanam Taluk, Puducherry". Each point lies inside its town's own bounding box and the right taluk of the UT.
- Sensitivity: moving each point to the corner of its town bbox (worst case) shifts the quoted distances by at most 2 km (Puducherry-Karaikal), 5 km (Puducherry-Mahe), 6 km (Puducherry-Yanam) and 12 km (Mahe-Yanam, 1.3% of 911). Say "about 910 km" or "over 900 km" rather than a precise 911.

## Other checks
- Statuses: C01-C07 VERIFIED-P (P2 govt pages, authors describing their own territory) fair. C08 is labelled CORROBORATED but rests on one computation from one coordinate set; the honest label is "our measurement" (type=measurement). Not a spine failure, but fix the label to VERIFIED-S/own-measurement if the checker allows.
- Dossier "Reveal Loop material" numbers: 79.830/11.935 (NE, matches); Karaikal 79.838/10.916, Mahe 75.536/11.702, Yanam 82.211/16.739 (match OSM saved); 911 km and 113 km (C08); five languages (S01 About page; no claim ID, quote verified live; add a claim C09 or drop); "four pieces", "three states" (C01-C05).
- Angle 2 ("Mahe nearer Kerala's towns than to capital"): the source gives only 70 km to Calicut Airport; 468 km capital is C08. Wording "nearer to Kerala's towns" is looser than the claim: say "70 km from Calicut Airport (official page)".
- myths M1-M3 consistent with claims; M2 cites S03 for "own legislature": the About page ("Union Territory with legislature") supports it, not the C07 quote; fine but cite S01.

## Wording risks (borders, internal)
- "Four pieces, 911 km apart" (hook/send line) is loose: 911 km is only the widest pair (Mahe-Yanam). Say "up to 911 km apart".
- "Three states": pieces are located in/beside Tamil Nadu, Kerala, Andhra Pradesh but belong to the UT; Yanam only "adjoins" AP. Keep "scattered across three states"/"beside", never "in three states" unqualified.
- Belief ("Puducherry is one place") is unevidenced (dossier admits it); do not say "most people think".
- 1954 is de facto only; do not state a de jure year beyond the page's "1963 officially".
- Pins and measured lines only, no borders: good.
