# Data YT: NFHS-6 (2023-24) notes

Source: IIPS 2026, *National Family Health Survey (NFHS-6), 2023-24: India and State/UT Fact Sheets* (182 pages,
released 29 May 2026). Official link: nfhsiips.in (its TLS certificate fails from the cloud sandbox); an identical
copy is mirrored on data.opencity.in (dataset `nfhs-6-2023-24`).

What it contains: 101 key indicators for India, 28 states and 8 UTs (no Manipur), urban / rural / total, with the NFHS-5
total for comparison. **No district tables.** District estimates come in separate district fact sheets, so the TN
district map (incl. Thiruvarur's exact figure) cannot be checked against this PDF.

Extracted data:
- `public/datayt/nfhs6/states_tobacco_alcohol.json`: indicators 98-101 (tobacco and alcohol, age 15+) for all 36
  entries. 13 state pages are image-only in the PDF and were read from the page images.
- `public/datayt/nfhs6/tn_key_indicators.csv`: all 101 Tamil Nadu indicators (opencity CSV, spot-checked against p.117).

## Alcohol, men age 15+ (NFHS-6 total; NFHS-5 in brackets)

India 18.9 (18.7). Tamil Nadu **23.5** (25.3): urban 19.7, rural 26.7; women 0.3. TN ranks 14th of 35 states/UTs.

Top: Arunachal 50.5, Telangana 43.9, Sikkim 42.2, Chhattisgarh 38.3, Jharkhand 33.6, A&N 32.0, Himachal 30.2,
Tripura 29.5, Meghalaya 28.3, Uttarakhand 27.2.
Bottom: Lakshadweep 0.6, Gujarat 5.2, J&K 7.3, Rajasthan 10.7, Maharashtra 12.2, Karnataka 15.6, West Bengal 16.0,
Delhi 16.1, Bihar 16.5 (prohibition state), Haryana 17.5.
South: Telangana 43.9, TN 23.5, AP 23.3, Puducherry 22.8, Kerala 22.7, Karnataka 15.6.
Biggest moves: Goa 36.8 → 22.4, A&N 38.8 → 32.0, Delhi 21.6 → 16.1, Ladakh 23.5 → 18.4; up: UP 14.5 → 18.7,
Chhattisgarh 34.7 → 38.3, Kerala 19.9 → 22.7, Chandigarh 18.6 → 21.6.
Women: Arunachal 23.2, Sikkim 19.9, Telangana 7.1, Tripura 6.0, Chhattisgarh 5.7, Jharkhand 5.5; India 1.1.

## Tobacco, men age 15+

India 36.3 (38.0). TN 17.7 (20.0). Highest: Mizoram 73.6, Meghalaya 57.8, A&N 52.1, Tripura 52.1, Arunachal 51.4.
Tripura women 47.7%. Ladakh men 35.5 → 18.9.

## Tamil Nadu: biggest changes since NFHS-5

Rotavirus vaccine (3 doses) 66.4 → 87.4; pre-school attendance 46.1 → 65.3; women ever used internet 46.9 → 59.5;
spousal violence 38.1 → 28.5; stunting 25.0 → 20.7; women overweight/obese 40.5 → 44.2; high blood sugar,
men 22.1 → 26.7 and women 20.7 → 25.2; first-trimester check-up 77.4 → 71.2; health-insurance cover 66.5 → 61.1.

Caution: several news reports misquote figures (one gave TN 13.7%, which is Madhya Pradesh's urban value).
Always cite from the tables above.
