G6: PASS. All 8 spine claims (C01-C08) pass on independent re-check (15 Nov 2026, Shorts Lite). Saved copies only (no live re-fetch; the quotes sit in official documents already saved verbatim). method/gauge_numbers.py re-run with `python3 -I`, diffed against the saved output: identical. Wording fixes below; none touches a spine claim.

# W4-06 Indian Railways track gauges: independent verification (G6, Shorts Lite)

Verifier: a separate Claude Code session. Every spine quote searched in the saved text of sources/ with whitespace normalised: all found exactly.

| Claim | Result | Evidence |
|---|---|---|
| C01 | PASS | S01 para 19.7: "classified by Gauges as Broad (1.676m.), Meter (1.000m) and Narrow (0.762m. & 0.610m)" = 3 classes, 4 widths. S02 box: "Narrow Gauge- 0.76 metre and 0.6 metre". Re-run: 1.676/0.610 = 2.75; 1,676-610 = 1,066 mm |
| C02 | PASS | S02 (15 Apr 2026): "has the following categories of track:" with Broad, Metre, Narrow in the present tense, and "Standard Gauge - 1.43 metre" |
| C03 | PASS | S02: "In 1871, metre gauge was officially adopted as the second standard gauge in India, following the earlier use of the 5 ft 6 inches (1.6 metre) broad gauge for the first railway lines"; "gauges even narrower than the metre gauge were used" |
| C04 | PASS | S01 File B: "63,974 km of route length as on 31st march 2010 ,which include 54,257 km of Broad Gauge (BG)", "7180 km of Meter Gauge (MG) and 2537 km of Narrow Gauge (NG)". Sum re-run: 63,974, diff 0 |
| C05 | PASS | Re-run: BG 84.8%, non-broad 9,717 km (15.2%), MG 1 km in 8.9, NG 1 km in 25.2. Labelled our calculation |
| C06 | PASS | S03 (Ministry of Railways, Feb 2007): "Unigauge was launched on April 1, 1992 to develop the backward regions", "over 13000 km of metre gauge and narrow gauge have been converted", "one country, one gauge". See wording fix 3 on the stated purpose |
| C07 | PASS | S01: "from about 72 % in 2002-03 to 88% in 2013-14" and "forming 88.4% of the route, accounted for 99.9% of the freight output" |
| C08 | PASS with a date caveat | S02: "out of the total 70,142 broad gauge route kilometers". Re-run: +15,885 km (+29%) on 54,257. See wording fix 4 |

## Three or four widths
The pitch's "three" is wrong as a count of widths, right as a count of classes. S01 lists four widths in three classes (1.676, 1.000, 0.762, 0.610 m). S02 (2026) lists five widths, adding standard gauge 1.43 m (use of it not described, correctly not named). So "four" is right for S01's official classification, "five" for the 2026 list. Pick one source and name it on screen.

## Non-spine and statuses
- C09, C12, C13 PASS (quotes found). C10 and C11 UNVERIFIED, correctly excluded. Spine statuses honest; no tier-X source is cited.
- Reveal Loop numbers: 1,676/1,000/762/610 and 2.75x, 1,066 mm (C01); 1 km in 8.9 and 1 in 25 (C05); 1 in 6.6 = 63,974/9,717 (C05 arithmetic, not printed in the method output but correct). Each traces to a passing claim. "Right?" belief commonness is flagged as not shown; keep that flag. Hedges (2026 share missing, C11) stay hedged.
- Safe-to-say list: one year and one basis per comparison holds (2010 route km for C04/C05; 2002-03 to 2013-14 share for C07).

## Wording risks (fixes, none blocking)
1. Beat 2 "four widths": say "four widths in the Railways' own classification (MoSPI)" or add that the 2026 Government text also lists standard gauge, 1.43 m. Do not claim "only four".
2. Mixed bases: the 2010 route km (C04/C05), the 2013-14 share (C07) and the March 2026 broad km (C08) are three years. Never put C07's 88% and C05's 84.8% in one line as a trend; 72% -> 88% is S01's own wording about "lines"/route share.
3. C06: S03 says Unigauge aimed "to develop the backward regions and to connect important places with broad gauge", not in words "to convert". Say "Unigauge, launched 1 April 1992, had converted over 13,000 km by 2007 (Ministry's figure)". Keep 13,000 km as "by 2007", credited to the Ministry.
4. C08: 70,142 km is printed in the electrification paragraph; the "March 2026" date belongs to the nearby 69,873 km. Say "70,142 route km of broad gauge, per the April 2026 backgrounder", not "as of March 2026". Do not compare it with 2010 as pure conversion (new lines included).
5. Use 1.676 m, not S02's rounded 1.6 m; "5 ft 6 in" is fine. 0.76 vs 0.762: show 762 mm.
6. Do not say "once ran" or imply the others are gone; do not give a 2026 share or metre/narrow km (C11).
