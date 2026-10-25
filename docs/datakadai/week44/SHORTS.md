# Week 1 Shorts (26 Oct to 1 Nov 2026)

Each script is 40 to 55 seconds of voiceover (about 120 to 140 words). The number lands in the first 3 seconds.
Every number shows its Trust Stamp and source on screen. `[VERIFY]` and `[FILL]` must be cleared before recording.
Voice: human (English master, Hindi track recorded the same day).

---

## Mon 26 Oct · Indian Homes Hold 3× More Gold Than the US Government

- **Need:** Pocket, Moment (Dhanteras 6 Nov) · **Stamps:** 🟡 ESTIMATE (households), 🟢 OFFICIAL (central banks)
- **Visual:** gold bangle pile vs Fort Knox bars on a weighing scale (tharasu); counter ticks to 25,000 t.

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "America's government keeps about 8,000 tonnes of gold. Indian homes? About 25,000." | **8,133 t vs ~25,000 t** · scale tips to India |
| 3–12 s | "That isn't the RBI. That's almirahs, bank lockers and temple vaults." | Almirah, locker, temple icons; 🟡 ESTIMATE |
| 12–22 s | "The RBI itself holds about 880 tonnes. Indian families hold almost thirty times that." | RBI ~880 t bar vs 25,000 t bar |
| 22–34 s | "Add up every central bank in the world and you get about 36,000 tonnes. Indian households alone hold more than two-thirds of that." | World central banks 36,000 t; India homes 69 % of it |
| 34–44 s | "And Dhanteras is on November 6. We're about to add more." | Calendar flip to 6 Nov |
| 44–50 s | "How much of your family's savings is in gold? Comment a percentage." | Comment prompt |

- **Title:** Indian Homes Hold 3× More Gold Than the US Government
- **Sources:** World Gold Council estimate of Indian household and temple gold (~25,000 t); central bank holdings (US 8,133 t, RBI ~880 t, all central banks ~36,000 t) as reported by Khaleej Times from WGC data.
- **Notes:** say "about" and "estimate" for household gold; some estimates are higher when temples are counted separately.

---

## Tue 27 Oct · Kadai Wars S1E1 · The ₹10 Cola War: Campa vs Coke and Pepsi

- **Need:** Brands · **Stamps:** 🟡 ESTIMATE (share), 🟢 prices from packs
- **Visual:** two bottles on price tags; per-ml price comparison; share bar 7 % → 15 %.

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "₹10 for 200 ml. Coke and Pepsi charge ₹20 for 250 ml. Guess who's winning." | Two price tags swing in |
| 3–12 s | "In 1977 Coca-Cola left India, and an Indian cola called Campa filled the gap. Then it faded away." | 1977 stamp; Campa vintage bottle |
| 12–20 s | "Now Reliance has brought it back. Per 100 ml, Campa costs ₹5. Coke and Pepsi cost ₹8. That's about 38 % cheaper." | ₹5 vs ₹8 per 100 ml (37.5 %) |
| 20–28 s | "It pays shopkeepers more too: a 6 to 8 % margin, against 3.5 to 5 % from the big two." | Margin bars |
| 28–38 s | "Result? Campa and Lahori Zeera doubled their share of the market, from about 7 % to about 15 % in nine months." | Share bar 7 % → 15 %; 🟡 ESTIMATE |
| 38–46 s | "Coke and Pepsi's answer: their own ₹10 packs. The cola war is back." | ₹10 Coke, Pepsi, Thums Up packs |
| 46–52 s | "Which cola is in your fridge? Campa, Coke, Pepsi or Thums Up?" | Poll-style comment prompt |

- **Title:** The ₹10 Cola War: Campa vs Coke and Pepsi
- **Sources:** NielsenIQ figures shared by industry sources (Jan–Sep 2025) via Storyboard18 and Trak.in; pricing and margins via Value Research and Agron.
- **[VERIFY]:** look for a 2026 share update before recording; if none, say "in the first nine months of 2025" on screen. Confirm Reliance acquisition and relaunch dates before adding years.

---

## Wed 28 Oct · Map of the Day S1E1 · India's Baby Map (NFHS-6)

- **Need:** State · **Stamp:** 🟢 OFFICIAL · **Engine:** episode `tfr-nfhs6` (copy `tfr-nfhs5`, rebuild with NFHS-6 data)
- **Filled 25 Oct 2026** from our checked NFHS-6 file (`public/datayt/nfhs6/nfhs6_states.json`, indicator 18).
  Manipur is not in the file: show it blank with "not in NFHS-6 release". `[VERIFY: Manipur]`

| Time | Voiceover | On screen (engine scene) |
| --- | --- | --- |
| 0–3 s | "One part of India now has fewer than one child per woman." | Hook: **0.9** · Andaman and Nicobar |
| 3–10 s | "India's fertility rate is 2.0. Below 2.1, a population eventually starts to shrink." | Map fills, lowest to highest |
| 10–17 s | "Most children: Bihar, 2.7. Fewest: Andaman and Nicobar, 0.9, then Sikkim, 1.0." | Top 3 / bottom 3 |
| 17–24 s | "The twist: Meghalaya fell from 2.9 to 2.2 in a few years. But Jammu and Kashmir went up, from 1.4 to 1.8." | Twist scene: two states, NFHS-5 → NFHS-6 |
| 24–28 s | "Why is your state where it is? Tell us below." | Question |
| 28–30 s | "A new India map, every day." | End card |

- **Title:** India's Baby Map: One Region Now Below 1 Child per Woman
- **Before render:** `from_nfhs.py` (or hand-fill `data.csv`), write claims in `spec.json`, run `build_map.py`, remove `draft`.

---

## Thu 29 Oct · Release day · Diwali Gold: Indians Buy Less, Pay More

- **Need:** Pocket, Moment · **Stamp:** 🟢 OFFICIAL (WGC compiles official trade and survey data; label it
  ESTIMATE if the figure is WGC's own modelling)
- **Plan A:** WGC Q3 2026 India report (expected ~29–30 Oct). Fill the brackets.
- **Plan B (if not out):** Q2 2026 figures below, labelled "April to June 2026".

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "Indians bought less gold this year, and still spent a record amount." | **−6 % tonnes · record ₹** |
| 3–14 s | "From April to June, India bought 131.4 tonnes, 6 % less than a year ago. But the bill hit a record ₹1.98 lakh crore." | Tonnes bar down, rupee bar up |
| 14–24 s | "Why? Prices. Each gram costs so much more that less gold still means more money." | Price line rising |
| 24–34 s | "Jewellery fell. But coins and bars rose 9 %, to 50.3 tonnes. Indians are buying gold as savings, not just to wear." | Jewellery ↓, coins/bars ↑ |
| 34–44 s | "With Dhanteras on November 6, watch this number." | Calendar 6 Nov |
| 44–50 s | "Jewellery or coins: what does your family buy?" | Comment prompt |

- **Sources:** World Gold Council India Q2 2026 via Angel One, Deccan Herald (30 Jul 2026). Plan A: WGC Q3 2026.
- **Rule:** no "buy" or "sell" advice.

---

## Fri 30 Oct · Kadai Wars S1E2 · 110 Crore Orders in 10 Minutes

- **Need:** Brands, Pocket · **Stamp:** 🔴 CLAIM (company filing) · teaser for Saturday's long video

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "Indians placed about 110 crore orders on 10-minute apps in a single year." | Counter to 110 crore · "2024-25" |
| 3–10 s | "That's around 30 lakh orders every single day." | Clock + order pings |
| 10–22 s | "Blinkit had about 45 % of those orders. Zepto 31 %. Swiggy Instamart about 25 %, down from 34 % two years earlier." | Share bars 44.5 % · 30.9 % · 24.6 %; Instamart 34 % → 24.6 % |
| 22–34 s | "Meanwhile DMart, India's favourite supermarket, saw its slowest growth in years. Brokers blamed the 10-minute apps." | DMart growth line bending [UPDATE: latest quarter] |
| 34–44 s | "So who's really winning: the app, DMart, or the kirana anna downstairs? We tested it with real shopping bills. Full video tomorrow." | Three shop icons; "Sat 31 Oct" |
| 44–48 s | "Where did you buy milk this week?" | Comment prompt |

- **Sources:** Zepto updated draft prospectus (FY25 orders: Blinkit 489.9 mn, Zepto 340.3 mn, Instamart 270.2 mn) via Apparel Resources; DMart via BusinessWorld.
- **[VERIFY]:** check for FY26 order data in newer filings or company results and use it if available. Instamart's 34 % → 24.5 % comes from the article body; its headline says 21 %, so confirm against the filing.
- **Rechecked 25 Oct:** the three FY25 order counts add to 1,100.4 mn (110 crore, 30.1 lakh a day) and give shares of 44.5 %, 30.9 % and 24.6 %, so the article's 24.5 % is a rounding slip. Keep "2024-25" on screen: the data is a year old.

---

## Sat 31 Oct · Map of the Day S1E2 · Which State Pays India's GST?

- **Need:** State, Pocket · **Stamp:** 🟢 OFFICIAL · **Engine:** new episode `gst-sep2026`
- **Data:** state-wise gross GST for September 2026 from the GST portal (released 1 Oct 2026). National gross:
  ₹2,03,521 crore, up 14.7 % (third month above ₹2 lakh crore).

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "[FILL: top state] paid more GST in September than [FILL: a striking comparison from the data]." | Hook number |
| 3–10 s | "India collected ₹2.04 lakh crore of GST in September. Here's where it came from." | Map fills |
| 10–17 s | "Top 3: [FILL]. Bottom 3: [FILL]." | Ranks |
| 17–24 s | "The twist: [FILL, e.g. fastest growth vs last September]." | Twist |
| 24–28 s | "Does your state pay its share? Tell us." | Question |

- **Note:** GST is collected where goods are consumed or supplied; say "collected in", not "paid by the people of".

---

## Sun 1 Nov · Release day · UPI October Scorecard: Festive Record?

- **Need:** Pocket, Moment · **Stamp:** 🟢 OFFICIAL (NPCI) · publish by evening

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "[FILL: October total] UPI payments in one month. [Record or not]." | Big number |
| 3–12 s | "In September India made 24.07 billion UPI payments, about 80 crore a day. October had Navratri and Dussehra shopping. Here's what happened." | Sept baseline bar |
| 12–24 s | "October: [FILL volume], [FILL value]. That's [FILL] crore payments a day." | October bar vs Sept, August record (24.51 bn) |
| 24–36 s | "Who handled them? PhonePe [FILL %], Google Pay [FILL %], Paytm [FILL %]." | App share bars |
| 36–46 s | "And a deadline is coming: by December 31, 2026, no app is supposed to exceed 30 %." | 30 % cap line over bars |
| 46–50 s | "Which app do you use most?" | Comment prompt |

- **Sources:** NPCI monthly statistics; September baseline via StartupTalky and FinTech BizNews; cap deadline via Angel One.
