# Week 1 Shorts (26 Oct to 1 Nov 2026)

**Length (AK, 25 Oct 2026): 25 to 35 seconds, aim for 30** (about 65 to 80 words of voiceover), because retention
drops on longer Shorts. The number lands in the first 3 seconds. Every number shows its Trust Stamp and source on
screen. `[VERIFY]` and `[FILL]` must be cleared before recording.
Voice: human (English master, Hindi track recorded the same day).

Cut on 25 Oct to fit: the cola Short loses the shopkeeper-margin line (1977 moves to on-screen text), the gold Shorts lose their "why" lines to one
sentence each, the UPI Short loses the festival set-up. Every number kept is unchanged.

---

## Mon 26 Oct · Indian Homes Hold 3× More Gold Than the US Government (about 29 s)

> **Built 25 Oct as `gd01`** (33 s, voiced with the approved MiniMax voice via AK's Go account; text-led cut kept): config `public/datayt/beats/configs/gd01.json`, pack
> `docs/datakadai/posts/2026-10-26-gd01.md`. The built version replaces this table: the 36,000 t central-bank line is cut
> (no source found), US is 8,134 t from the US Treasury (30 Sep 2026), RBI 880.52 t from the RBI (end-March 2026), and the
> title is now "Indian Homes Hold 3× as Much Gold as the US Government" ("3× more" can be read as 4×).

- **Need:** Pocket, Moment (Dhanteras 6 Nov) · **Stamps:** 🟡 ESTIMATE (households), 🟢 OFFICIAL (central banks)
- **Visual:** gold bangle pile vs Fort Knox bars on a weighing scale (tharasu); counter ticks to 25,000 t.

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "America's government keeps about 8,000 tonnes of gold. Indian homes? About 25,000." | **8,133 t vs ~25,000 t** · scale tips to India |
| 3–8 s | "Not in the RBI. In almirahs, bank lockers and temple vaults." | Almirah, locker, temple icons; 🟡 ESTIMATE |
| 8–14 s | "The RBI holds about 880 tonnes. Families hold almost thirty times that." | RBI ~880 t bar vs 25,000 t bar |
| 14–21 s | "Every central bank in the world together: about 36,000. Indian homes hold over two-thirds of that." | World central banks 36,000 t; India homes 69 % of it |
| 21–26 s | "And Dhanteras is November 6. We're about to add more." | Calendar flip to 6 Nov |
| 26–29 s | "How much of your savings is gold? Comment a percentage." | Comment prompt |

- **Title:** Indian Homes Hold 3× More Gold Than the US Government
- **Sources:** World Gold Council estimate of Indian household and temple gold (~25,000 t); central bank holdings (US 8,133 t, RBI ~880 t, all central banks ~36,000 t) as reported by Khaleej Times from WGC data.
- **Notes:** say "about" and "estimate" for household gold; some estimates are higher when temples are counted separately.

---

## Tue 27 Oct · Kadai Wars S1E1 · The ₹10 Cola War: Campa vs Coke and Pepsi (about 29 s)

> **Built 25 Oct as `cw01`** (33 s, voiced with the approved MiniMax voice via AK's Go account; text-led cut kept): config `public/datayt/beats/configs/cw01.json`, pack
> `docs/datakadai/posts/2026-10-27-cw01.md`. The built version replaces this table: the ₹10 vs ₹20 hook is gone (Coca-Cola
> also sells 200 ml at ₹10), and the story is the NielsenIQ shares of all soft drinks: Coke and Pepsi 93 % → 85 %, Campa and
> Lahori Zeera about 7 % → almost 15 % (Jan–Sep 2024 → 2025), then the ₹10 packs.

- **Need:** Brands · **Stamps:** 🟡 ESTIMATE (share), 🟢 prices from packs
- **Visual:** two bottles on price tags; per-ml price comparison; share bar 7 % → 15 %.

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "₹10 for 200 ml. Coke and Pepsi: ₹20 for 250 ml." | Two price tags swing in |
| 3–7 s | "That's Campa. Reliance brought it back." | Campa vintage bottle → new bottle; "1977: filled the gap when Coca-Cola left" |
| 7–13 s | "Per 100 ml: ₹5 against ₹8. About 38 % cheaper." | ₹5 vs ₹8 per 100 ml (37.5 %) |
| 13–21 s | "Campa and Lahori Zeera doubled their share, 7 % to 15 %, in nine months." | Share bar 7 % → 15 %; 🟡 ESTIMATE · "Jan–Sep 2025" |
| 21–26 s | "Coke and Pepsi's reply: their own ₹10 packs." | ₹10 Coke, Pepsi, Thums Up packs |
| 26–29 s | "Which cola is in your fridge?" | Poll-style comment prompt |

- **Title:** The ₹10 Cola War: Campa vs Coke and Pepsi
- **Sources:** NielsenIQ figures shared by industry sources (Jan–Sep 2025) via Storyboard18 and Trak.in; pricing via Value Research and Agron.
- **[VERIFY]:** look for a 2026 share update before recording; if none, keep "Jan–Sep 2025" on screen. Confirm Reliance acquisition and relaunch dates before adding years. Name the market on screen (Campa plus Lahori Zeera is not only cola).

---

## Wed 28 Oct · Map of the Day S1E1 · India's Baby Map (NFHS-6) (about 30 s)

- **Need:** State · **Stamp:** 🟢 OFFICIAL · **Engine:** episode `tfr-nfhs6` (copy `tfr-nfhs5`, rebuild with NFHS-6 data)
- **Filled 25 Oct 2026** from our checked NFHS-6 file (`public/datayt/nfhs6/nfhs6_states.json`, indicator 18).
  Manipur is not in the file: show it blank with "not in NFHS-6 release". `[VERIFY: Manipur]`

| Time | Voiceover | On screen (engine scene) |
| --- | --- | --- |
| 0–3 s | "One part of India now has fewer than one child per woman." | Hook: **0.9** · Andaman and Nicobar |
| 3–9 s | "India's fertility rate is 2.0. Below 2.1, a population eventually shrinks." | Map fills, lowest to highest |
| 9–16 s | "Most children: Bihar, 2.7. Fewest: Andaman and Nicobar, 0.9, then Sikkim, 1.0." | Top 3 / bottom 3 |
| 16–23 s | "The twist: Meghalaya fell fast, 2.9 to 2.2. Jammu and Kashmir rose, 1.4 to 1.8." | Twist scene: two states, NFHS-5 → NFHS-6 |
| 23–27 s | "Why is your state where it is?" | Question |
| 27–29 s | "A new India map, every day." | End card |

- **Title:** India's Baby Map: One Region Now Below 1 Child per Woman
- **Before render:** `from_nfhs.py` (or hand-fill `data.csv`), write claims in `spec.json`, run `build_map.py`, remove `draft`.

---

## Thu 29 Oct · Release day · Diwali Gold: Indians Buy Less, Pay More (about 29 s)

- **Need:** Pocket, Moment · **Stamp:** 🟢 OFFICIAL (WGC compiles official trade and survey data; label it
  ESTIMATE if the figure is WGC's own modelling)
- **Plan A:** WGC Q3 2026 India report (expected ~29–30 Oct). Fill the brackets.
- **Plan B (if not out):** Q2 2026 figures below, labelled "April to June 2026".

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "Indians bought less gold this year, and still spent a record." | **−6 % tonnes · record ₹** |
| 3–11 s | "April to June: 131.4 tonnes, 6 % less. But the bill: a record ₹1.98 lakh crore." | Tonnes bar down, rupee bar up |
| 11–15 s | "Why? Each gram costs so much more." | Price line rising |
| 15–22 s | "Jewellery fell. Coins and bars rose 9 %, to 50.3 tonnes. Gold as savings, not just to wear." | Jewellery ↓, coins/bars ↑ |
| 22–26 s | "Dhanteras is November 6. Watch this number." | Calendar 6 Nov |
| 26–29 s | "Jewellery or coins: what does your family buy?" | Comment prompt |

- **Sources:** World Gold Council India Q2 2026 via Angel One, Deccan Herald (30 Jul 2026). Plan A: WGC Q3 2026.
- **Rule:** no "buy" or "sell" advice.

---

## Fri 30 Oct · Kadai Wars S1E2 · 110 Crore Orders in 10 Minutes (about 30 s)

- **Need:** Brands, Pocket · **Stamp:** 🔴 CLAIM (company filing) · teaser for Saturday's long video

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "Indians placed about 110 crore orders on 10-minute apps in one year." | Counter to 110 crore · "2024-25" |
| 3–6 s | "About 30 lakh orders a day." | Clock + order pings |
| 6–14 s | "Blinkit took about 45 %. Zepto 31 %. Instamart about 25 %, down from 34 %." | Share bars 44.5 % · 30.9 % · 24.6 %; Instamart 34 % → 24.6 % |
| 14–20 s | "Meanwhile DMart had its slowest growth in years. Brokers blamed the apps." | DMart growth line bending [UPDATE: latest quarter] |
| 20–27 s | "App, DMart or the kirana anna: who's winning? We went shopping. Full video tomorrow." | Three shop icons; "Sat 31 Oct" |
| 27–30 s | "Where did you buy milk this week?" | Comment prompt |

- **Sources:** Zepto updated draft prospectus (FY25 orders: Blinkit 489.9 mn, Zepto 340.3 mn, Instamart 270.2 mn) via Apparel Resources; DMart via BusinessWorld.
- **[VERIFY]:** check for FY26 order data in newer filings or company results and use it if available. Instamart's 34 % → 24.5 % comes from the article body; its headline says 21 %, so confirm against the filing.
- **Rechecked 25 Oct:** the three FY25 order counts add to 1,100.4 mn (110 crore, 30.1 lakh a day) and give shares of 44.5 %, 30.9 % and 24.6 %, so the article's 24.5 % is a rounding slip. Keep "2024-25" on screen: the data is a year old.

---

## Sat 31 Oct · Map of the Day S1E2 · Which State Pays India's GST? (about 28 s)

- **Need:** State, Pocket · **Stamp:** 🟢 OFFICIAL · **Engine:** new episode `gst-sep2026`
- **Data:** state-wise gross GST for September 2026 from the GST portal (released 1 Oct 2026). National gross:
  ₹2,03,521 crore, up 14.7 % (third month above ₹2 lakh crore).

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "[FILL: top state] paid more GST in September than [FILL: a striking comparison from the data]." | Hook number |
| 3–9 s | "India collected ₹2.04 lakh crore of GST in September. Here's where." | Map fills |
| 9–16 s | "Top 3: [FILL]. Bottom 3: [FILL]." | Ranks |
| 16–23 s | "The twist: [FILL, e.g. fastest growth vs last September]." | Twist |
| 23–28 s | "Does your state pay its share? Tell us." | Question |

- **Note:** GST is collected where goods are consumed or supplied; say "collected in", not "paid by the people of".
  Keep each `[FILL]` to one short sentence or the Short runs past 30 s.

---

## Sun 1 Nov · Release day · UPI October Scorecard: Festive Record? (about 30 s)

- **Need:** Pocket, Moment · **Stamp:** 🟢 OFFICIAL (NPCI) · publish by evening

| Time | Voiceover | On screen |
| --- | --- | --- |
| 0–3 s | "[FILL: October total] UPI payments in one month. [Record or not]." | Big number |
| 3–8 s | "September: 24.07 billion, about 80 crore a day. Then came the festivals." | Sept baseline bar |
| 8–15 s | "October: [FILL volume], [FILL value]. [FILL] crore a day." | October bar vs Sept, August record (24.51 bn) |
| 15–22 s | "PhonePe [FILL %]. Google Pay [FILL %]. Paytm [FILL %]." | App share bars |
| 22–27 s | "By December 31, no app should pass 30 %." | 30 % cap line over bars |
| 27–30 s | "Which app do you use most?" | Comment prompt |

- **Sources:** NPCI monthly statistics; September baseline via StartupTalky and FinTech BizNews; cap deadline via Angel One.
