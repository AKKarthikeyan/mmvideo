# Data Kadai story queue

The daily routine takes the first story whose status is `queued`. Built-in configs live in
`scripts/datayt/build_india_shorts.py`; new ones go in `public/datayt/shorts/configs/<id>.json`. dk-planner keeps at
least 14 stories queued, picking from `docs/DATAYT_SHORTS_PLAN.md` and `public/datayt/nfhs6/shorts_catalog.csv`.

| # | id | Story (hook) | Indicator | Answer | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | gts01 | In one state, 2 in 3 homes have a woman who owns a house or land | 10 | Meghalaya | drafted (2026-10-09) |
| 2 | gts02 | In one state, nearly 1 in 4 women drink alcohol | 100 | Arunachal Pradesh | queued |
| 3 | gts03 | In one state, nearly 3 in 4 men use tobacco | 99 | Mizoram | queued |
| 4 | gts05 | Of 28 states, in one the average woman has just 1 child | 18 | Sikkim | queued |
| 5 | gts06 | The state where men get sterilised | 24 | Telangana | queued |
| 6 | gts07 | 9 in 10 private-hospital births here are C-sections | 39 | Jammu and Kashmir | queued |
| 7 | gts08 | 3 in 10 men here marry before 21 | 17 | Bihar | queued |
| 8 | gts04 | Here, 6 in 10 women use tobacco | 98 | Mizoram | queued |
| 9 | gts09 | Child-marriage #1 isn't Bihar. Guess it | 16 | West Bengal | queued (config to write) |
| 10 | gts10 | 6 in 10 births here are C-sections. Guess the state | 38 | Telangana | queued (config to write) |
| 11 | gts11 | India's sugar capital: 1 in 3 men | 83 | Goa | hold (Goa 32.1% vs Kerala 31.9%: 0.2-pt gap too thin for a #1 claim) |
| 12 | gts12 | Half the women here are overweight | 76 | Puducherry | queued (config to write; UT, check wording) |
| 13 | gts13 | Teen mothers: 18% of girls here | 19 | Tripura | queued (config to write) |
| 14 | gts14 | The state with India's oldest population | 3 | Kerala | queued (config to write) |
| 15 | gts15 | Only 6 in 10 babies here are born in a health facility | 35 (lowest) | Nagaland | queued (config to write; decoys Bihar, Jharkhand) |
| 16 | gts16 | In one state, fewer than half of women have ever used the internet | 14 (lowest) | Tripura | drafted (2026-10-10; hot: satellite-internet news; decoys Bihar, Odisha) |
| 17 | px01 | Bihar: lowest income per person, 5G in 96 of 100 villages (Data Paradox, idea S003) | DoT 5G villages; RBI T019 | n/a | drafted (2026-10-11; beat template `paradox`) |
| 18 | sh01 | Uttar Pradesh grows nearly half of India's sugarcane (Share of India, idea SG08) | RBI T065, T078, T087, T062, T091 | n/a | drafted (2026-10-11; beat template `share`; narrated and text-led cuts) |
| 19 | rc01 | Andhra Pradesh: more fish than any 3 other states combined (Then vs Now, idea S032) | RBI T093 | n/a | drafted (2026-10-11; beat template `race`; script reviewed before voicing) |
| 20 | hl01 | Gujarat or Rajasthan: which produces more milk? 4 rounds (game, idea S008) | RBI T091, T058, T092, T181 | n/a | drafted (2026-10-11; beat template `pick`; a test of the game format) |
| 21 | gw01 | In 3 states, more groundwater is taken out than goes back in (idea S006) | Central Ground Water Board 2025, via Lok Sabha reply | n/a | drafted (2026-10-11; beat template `over`; needs AK's sign-off on wording; narrated and text-led cuts) |
| 22 | pl01 | How Goa became part of India: 1947 to 1987 (place story, idea S015) | Acts, Gazette 1967, treaty 1974 | n/a | drafted (2026-10-11; beat template `place`; sources read first) |
| 23 | tn02 | Telangana: 10th in Rice in 2014-15, Top Three in 2024-25 | RBI T058 | n/a | drafted (2026-10-12; beat template `then`; script reviewed before voicing; week one) |
| 24 | tn03 | Andhra Pradesh: Women Who Used the Internet, 21% to 64% | NFHS-6 fact sheets, indicator 14 | n/a | drafted (2026-10-12; beat template `then`; script reviewed before voicing; week one) |
| 25 | rc02 | Rajasthan Has Led India in Oilseed Output Since 2020-21 | RBI T063 | n/a | drafted (2026-10-12; beat template `race`; script reviewed before voicing; week one) |
| 26 | px02 | Kerala, Maharashtra: Same Income, 2x Rural Construction Wage | RBI T112, T019 | n/a | drafted (2026-10-12; beat template `paradox`; script reviewed before voicing; week one) |
| 27 | px03 | Sikkim vs Goa: Same Income, 4x the Electricity Available | RBI T138, T019 | n/a | drafted (2026-10-12; beat template `paradox`; script reviewed before voicing; week one) |
| 28 | sh02 | Maharashtra: 36% of India's Cotton Area, 25% of the Crop | RBI T077, T064 | n/a | drafted (2026-10-12; beat template `share`; script reviewed before voicing; week one) |
| 29 | tn05 | Chhattisgarh Grew 60% More Rice per Hectare in 10 Years | RBI T080 | n/a | drafted (2026-10-12; beat template `then`; script reviewed before voicing; week one) |
| 30 | fa04 | Telangana 2023-24: 53% of Women Paid in Cash for Work | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week two) |
| 31 | tn07 | Gujarat: Share of India's Pulses Crop, 3% to 8% in 10 Years | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; week two) |
| 32 | fa03 | Punjab: Highest Foodgrain Yield, 18% Above Haryana, 2024-25 | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week two) |
| 33 | px05 | Women With Own Phone: Meghalaya 81%, Madhya Pradesh 48.5% | see pack | n/a | drafted (2026-10-13; beat template `paradox`; script reviewed and fixed before voicing; week two) |
| 34 | tn06 | Bihar: Electricity Available per Person Doubled in 10 Years | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; week two) |
| 35 | fa02 | Rural Kerala 2023-24: 85% of Women Had 10+ Years of School | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week two) |
| 36 | tn09 | West Bengal: Women's Own Bank Accounts Up 19 Points | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; week two) |
| 37 | fa05 | Andhra Pradesh: Bank Loans Used Were 157% of Deposits, 2025 | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week two) |
| 38 | px04 | Power Available per Person: Chhattisgarh 1.9x West Bengal | see pack | n/a | drafted (2026-10-13; beat template `paradox`; script reviewed and fixed before voicing; banked for a later week) |
| 39 | tn10 | Odisha: Women With 10+ Years of School Up 11 Points | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; banked for a later week) |
| 40 | fa10 | Rajasthan Made 1 in 3 Units of India's Solar Electricity | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week three) |
| 41 | tn12 | Karnataka: Real Output per Person Up 2.1 Times in 12 Years | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; week three) |
| 42 | fa06 | Assam: 41% of India's Handloom Weavers, 2019-20 Census | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week three) |
| 43 | px07 | Share of Women at Work: Tamil Nadu 1.8x Haryana, Same Income | see pack | n/a | drafted (2026-10-13; beat template `paradox`; script reviewed and fixed before voicing; week three) |
| 44 | tn14 | Madhya Pradesh: Cropped Area Up 30% on 3% More Farmland | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; week three) |
| 45 | hl02 | Rajasthan or West Bengal: Foreign Tourist Visits? 4 Rounds | see pack | n/a | drafted (2026-10-13; beat template `pick`; script reviewed and fixed before voicing; week three) |
| 46 | fa09 | Tamil Nadu: Highest Textile Export Value 5 Years Running | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week three) |
| 47 | fa08 | Maharashtra Had 1.7x Karnataka's Recognised Start-ups, 2026 | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; week three) |
| 48 | fa07 | Madhya Pradesh: 3.7 Million Tonnes of Spices, Next State 1.4 | see pack | n/a | drafted (2026-10-13; beat template `fact`; script reviewed and fixed before voicing; banked) |
| 49 | tn11 | Rajasthan: 30% of India's New Installed Renewable Capacity | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; banked) |
| 50 | tn13 | Odisha: Women 15+ Usually at Work, 18% to 48% in 6 Years | see pack | n/a | drafted (2026-10-13; beat template `then`; script reviewed and fixed before voicing; banked) |
| 51 | px08 | Men With 10+ Years of School: Himachal 76%, Andhra 59.5% | see pack | n/a | drafted (2026-10-13; beat template `paradox`; script reviewed and fixed before voicing; banked) |
| 52 | tn15 | Telangana: Personal Loans 19% to 42% of Bank Loans, 2015-25 | see pack | n/a | drafted (2026-10-13; beat template `then`; Money day; script reviewed and fixed before voicing) |
| 53 | fa11 | Maharashtra: Loans Approved ₹98, Used ₹86 per ₹100 Deposited | see pack | n/a | drafted (2026-10-13; beat template `fact`; Money day; script reviewed and fixed before voicing) |
| 54 | tn16 | Assam: Loans per ₹100 of Deposits, ₹37 to ₹66 in 10 Years | see pack | n/a | drafted (2026-10-13; beat template `then`; Money day; script reviewed and fixed before voicing) |
| 55 | px09 | Tamil Nadu: More Bank Offices. Karnataka: 29% More Deposits | see pack | n/a | drafted (2026-10-13; beat template `paradox`; Money day; script reviewed and fixed before voicing) |
| 56 | fa12 | Delhi: Highest Deposits per Bank Office, ₹520 Crore, 2025 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Money day; script reviewed and fixed before voicing) |
| 57 | tn17 | Gujarat: Goods Export Share Level With Maharashtra, Then 2x | see pack | n/a | drafted (2026-10-13; beat template `then`; Economy day; script reviewed and fixed before voicing) |
| 58 | fa14 | Delhi: Own Taxes Paid 98% of Day-to-Day Spending, 2022-23 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Economy day; script reviewed and fixed before voicing) |
| 59 | fa13 | Madhya Pradesh: Crops Made 31% of State Output, 2023-24 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Economy day; script reviewed and fixed before voicing) |
| 60 | tn22 | Rural Karnataka Men: Farm Labour Pay Hit 94% of Construction | see pack | n/a | drafted (2026-10-13; beat template `then`; Economy day; script reviewed and fixed before voicing) |
| 61 | tn20 | Uttarakhand: Babies Born in a Health Facility Up 5.7 Points | see pack | n/a | drafted (2026-10-13; beat template `then`; School and health day; script reviewed and fixed before voicing) |
| 62 | fa15 | Kerala: Share Aged 60+ Matches Share Under 15, 2023-24 | see pack | n/a | drafted (2026-10-13; beat template `fact`; School and health day; script reviewed and fixed before voicing) |
| 63 | tn23 | Jharkhand: Mothers With 4+ Pregnancy Check-ups Up 20 Points | see pack | n/a | drafted (2026-10-13; beat template `then`; School and health day; script reviewed and fixed before voicing) |
| 64 | fa17 | Himachal: About 2 in 3 Women Worked or Sought Work, 2023-24 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Women day; script reviewed and fixed before voicing) |
| 65 | px37 | Delhi: Women Hold 57% of Mudra Loans, 19% of the Money | see pack | n/a | drafted (2026-10-13; beat template `paradox`; Money day; script reviewed and fixed before voicing; week four) |
| 66 | fa35 | Tamil Nadu: 5% of People, 36% of Public Bank Gold Loans | see pack | n/a | drafted (2026-10-13; beat template `fact`; Money day; script reviewed and fixed before voicing; week four) |
| 67 | px52 | Gujarat vs Uttar Pradesh: Fewer Registered, More Who Traded | see pack | n/a | drafted (2026-10-13; beat template `paradox`; Markets day; script reviewed and fixed before voicing; week four) |
| 68 | fa55 | Maharashtra: ₹60 in Mutual Funds per ₹100 in Bank Deposits | see pack | n/a | drafted (2026-10-13; beat template `fact`; Markets day; script reviewed and fixed before voicing; week four) |
| 69 | fa40 | Haryana: GST Collected Was 9.2% of State Output, 2024-25 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Economy day; script reviewed and fixed before voicing; week four) |
| 70 | tn41 | Tamil Nadu's Share of India's FDI Equity: 3.9% to 8.0% | see pack | n/a | drafted (2026-10-13; beat template `then`; Economy day; script reviewed and fixed before voicing; week four) |
| 71 | fa30 | Mizoram: 33% of Bank Deposits in Regional Rural Banks, 2025 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Money day; script reviewed and fixed before voicing; week four) |
| 72 | tn36 | Odisha: Women's Share of Atal Pension Enrolments, 36% to 67% | see pack | n/a | drafted (2026-10-13; beat template `then`; Money day; script reviewed and fixed before voicing; week four) |
| 73 | fa50 | Delhi: 25 Registered Investors per 100 Projected Population | see pack | n/a | drafted (2026-10-13; beat template `fact`; Markets day; script reviewed and fixed before voicing; week four) |
| 74 | tn51 | Assam: Registered Investors Up 13.3 Times Since March 2020 | see pack | n/a | drafted (2026-10-13; beat template `then`; Markets day; script reviewed and fixed before voicing; week four) |
| 75 | px46 | Karnataka vs Tamil Nadu: 381 vs 371 STP Units, 6x Exports | see pack | n/a | drafted (2026-10-13; beat template `paradox`; Know your states day; script reviewed and fixed before voicing; week four) |
| 76 | fa48 | Himachal: 26.5% of India's Large-Hydro Electricity, 2024-25 | see pack | n/a | drafted (2026-10-13; beat template `fact`; Know your states day; script reviewed and fixed before voicing; week four) |
| 77 | px61 | Gujarat Has 49% More Bank Offices per Person Than Jharkhand | see pack | n/a | drafted (2026-10-14; beat template `paradox`; Money day; script reviewed and fixed before voicing; week five) |
| 78 | tn60 | Bank Deposits in Haryana: 2.5% to 3.8% of India's, 2015-25 | see pack | n/a | drafted (2026-10-14; beat template `then`; Money day; script reviewed and fixed before voicing; week five) |
| 79 | tn66 | Karnataka: Wives With a Say in All 3 Decisions, 83% to 89% | see pack | n/a | drafted (2026-10-14; beat template `then`; Women day; script reviewed and fixed before voicing; week five) |
| 80 | px67 | Rajasthan Women: 52% in Labour Force, 21% of NSE Investors | see pack | n/a | drafted (2026-10-14; beat template `paradox`; Women day; script reviewed and fixed before voicing; week five) |
| 81 | tn71 | Odisha: Men's Rural Construction Wage, 72% to 89% of India's | see pack | n/a | drafted (2026-10-14; beat template `then`; Economy day; script reviewed and fixed before voicing; week five) |
| 82 | px72 | Telangana: 3× Kerala's Registered Co-ops, 7% More People | see pack | n/a | drafted (2026-10-14; beat template `paradox`; Economy day; script reviewed and fixed before voicing; week five) |
| 83 | fa76 | Madhya Pradesh: 21 of Every 100 Specified Dams, Apr 2025 | see pack | n/a | drafted (2026-10-14; beat template `fact`; Power and connections day; script reviewed and fixed before voicing; week five) |
| 84 | tn81 | Uttar Pradesh: 1-Year-Olds Fully Vaccinated Up 11.5 Points | see pack | n/a | drafted (2026-10-14; beat template `then`; School and health day; script reviewed and fixed before voicing; week five) |
| 85 | px82 | Rajasthan Has 2x Gujarat's Colleges per University, 2023-24 | see pack | n/a | drafted (2026-10-14; beat template `paradox`; School and health day; script reviewed and fixed before voicing; week five) |
| 86 | fa85 | Goa: Over Half Said They Knew 3+ Languages, Census 2011 | see pack | n/a | drafted (2026-10-14; beat template `fact`; Know your states day; script reviewed and fixed before voicing; week five) |
| 87 | tn86 | West Bengal's Coastline: 157.5 km Old, 721 km Recalculated | see pack | n/a | drafted (2026-10-14; beat template `then`; Know your states day; script reviewed and fixed before voicing; week five) |

Checked 2026-10-09 by dk-planner against `public/datayt/nfhs6/nfhs6_states.json` (total column, India and Lakshadweep excluded, no `*`/`( )` cells at #1). Hooks for gts01, gts02, gts03 and gts10 reworded to match the numbers.
