# Data Kadai: Phase 0 kit (prepared 9 Oct 2026, production ON HOLD)

## 1. Name and domains

**Chosen: Data Kadai** (AK, 9 Oct 2026). The project covers more than state comparisons (economy, markets, companies,
trends, India vs the world), so a broad master brand beats "India Statewise". "Kadai" = shop (Tamil): a "data
tea-shop", warm and local. **Language: English only at launch (AK, 9 Oct 2026); Tamil comes later as a second
channel or track.** Tagline: *India's numbers, served fresh.* (In Hindi "kadhai" is a
wok; the tagline and logo carry the meaning.)
History: IndianData (taken) → India Charted (dropped: reads as Chartered Accountant) → India Statewise (too narrow;
kept as a series name) → **Data Kadai**.

Checked 9 Oct 2026 (registry RDAP: Verisign .com, NIXI .in; YouTube @handle page; 404 = free):

| Asset | Status | Use |
| --- | --- | --- |
| datakadai.com | free | Main site |
| datakadai.in | free | Redirect to .com |
| YouTube @DataKadai | free | Main channel |
| datakadai.com / .in | free | Protective buy; could later host a state-rankings data site |
| Instagram @datakadai | check by hand (needs login) | |

**Buy now:** datakadai.com + datakadai.in (main), datakadai.com + .in (protection).

Brand structure: **Data Kadai** = channel, site, newsletter, logo. Series chips inside it: STATEWISE · GUESS THE STATE ·
MAPPED · RANKED · STATE vs STATE · THEN vs NOW · INDIA vs WORLD · MARKETS · TAMIL NADU SPECIAL.

Trademark: search IP India for "Data Kadai" (classes 41, 9, 16, 35). It's distinctive, so it's easier to protect than
"India Statewise"; file once there's traction (Phase 2).

## 2. Accounts to create (AK)

- [ ] Google account for the brand, kept separate from personal and Moat & Margin; 2-step verification on
- [ ] YouTube channel @DataKadai: profile, banner, About text (below), links to the site and Instagram
- [ ] Instagram @datakadai, Facebook page, X @DataKadai, Threads, LinkedIn page (claim the names even if idle)
- [ ] Email: hello@datakadai.com (forwarding is enough at first)
- [ ] Newsletter tool account (Phase 2)

## 3. Brand kit (rendered, in `mmvideo`)

Compositions in `src/datayt/Brand.tsx`. Render with `npx remotion still src/index.ts <id> out/datayt/brand/<id>.png`.

| Asset | Composition | Size |
| --- | --- | --- |
| Profile picture (circle-safe) | `DK-profile` | 800×800 |
| Logo (mark + wordmark + tagline) | `DK-logo` | 2400×800 |
| YouTube banner (key content in the 1546×423 safe area) | `DK-banner` | 2560×1440 |
| Series title chips | `DK-chips` | 1080×1080 |
| Shorts end card | `DK-endcard` | 1080×1920 |

- **Mark:** a tea-kadai glass (cutting-chai tumbler) holding three rising bars, steam rising from the gold bar. No India
  outline in the logo, because the outline is legally sensitive.
- **Palette (decided 9 Oct 2026):** brand palette **A, Kadai Chai**, used for the logo, banner, chips, background and
  default map: ground #F7F4EE, ink #1F1A17, accent maroon #7A2340, second accent amber #C9822F, map bands #DA996A →
  #C67447 → #AD512F → #8C352A → #662125. Daily Shorts and chart posts **rotate map palettes in posting order
  A → E (Saffron Kumkum) → D (Indigo Ink) → C (Monsoon Teal) → O (Original reference map)**, then repeat, so
  consecutive posts never share a look. A story can pin one with `"palette": "E"`. A, E, D and C pass the dataviz
  ordinal checks; O is AK's original reference ramp (its lightest band is faint, so it relies on map outlines). All
  palettes are defined in `scripts/datayt/build_india_shorts.py` (PALETTES).
- **Type:** Oswald 700 (headlines, numbers), Inter (labels, body).
- **Music:** original code-composed 124 BPM score per Short (`scripts/datayt/music_shorts.py`); never third-party tracks.

## 3b. Logo (final, AK 9 Oct 2026)

**Primary logo** = tea-glass mark (amber glass and bars, maroon tallest bar and steam) + "DATA KADAI" wordmark
(KADAI in maroon) on the cream ground. Files from `src/datayt/Brand.tsx`: `DK-logo` (2400x800, with tagline),
`DK-profile` (800², mark only, for YouTube/Instagram/X profile pictures), `DK-banner`. The other variants on
`DK-logo-sheet` (reversed, one-colour) are for dark posts and print only. The Tamil lockup (`DK-logo-ta`) is parked
until Tamil launches.

## 4. Channel copy

**About (YouTube, about 820 characters; final, 9 Oct 2026):**
```
India's numbers, served fresh.

Every day, Data Kadai turns official Indian data into one map or chart you can understand in 30 seconds. Which state drinks the most? Where do women own the land? Who is getting heavier? Where is India changing fastest?

What you'll find here:
• Guess the State: a quiz, then the map reveals the answer
• Ranked and Mapped: every state, side by side
• Then vs Now: how India has changed
• India vs World: where we stand

Every number comes from an official source, named on screen: NFHS, Census, RBI, MoSPI, NPCI and more. No opinions dressed up as data. No stock tips or investment advice.

New Shorts every day. Comment your state; we read every one.

Business and sponsorships: hello@datakadai.com
```
**Channel keywords:** data kadai, india data, india map, indian states, state ranking, NFHS, india statistics, data
visualization, guess the state, india vs world, indian economy, shorts

**Short title formula** (≤ 60 characters, question or shock, state names in it):
`Which state's women own the land? 🗺️ #Shorts` · `Arunachal women drink 21× India's rate` ·
`Tamil Nadu vs Gujarat: who drinks more?`

**Description template:**
```
{one-line finding with the number}
Source: {survey/agency}, {year}, {table/indicator name}. {link to source}
Where does your state rank? Comment below 👇
#DataKadai #India #{state} #{topic} #IndiaData #Shorts
```

**Pinned comment template:** `Source: {source}, {indicator exactly as published}. Values are state averages for {age
group}. Full ranking on datakadai.com (from Phase 2). Which state should we map next?`

**Hashtag sets:** core `#DataKadai #IndiaData #Shorts` · health `#NFHS #HealthIndia` · state `#TamilNadu #Kerala …` ·
money (Phase 3) `#IndianEconomy #Investing101`.

## 5. Posting rhythm (from launch)

- 1 Short a day at 7:30 pm IST (Mon-Sat), the weekly 5-Question Quiz on Sunday.
- Same file to Instagram Reels and Facebook, 30 minutes later.
- Every Sunday: fill `docs/datakadai/analytics_log.csv` and review the top 5 and bottom 5 Shorts by % viewed.

## 6. Sponsor one-pager (draft for Phase 1 end)

> **Data Kadai** · India, in charts. Daily data Shorts in English, built from official sources.
> **Audience:** {subs} subscribers, {avg views} average views per Short, {avg % viewed}% average viewed, top states {…}.
> **Formats:** "This map is presented by {brand}" (logo on the end card + pinned comment), sponsored series of 4
> Shorts, newsletter slot (Phase 2).
> **Fits:** exam prep (TNPSC/UPSC GK), edtech, insurance, SaaS, consumer brands.
> **Not offered:** stock or fund recommendations; content that changes the data.
> **Contact:** hello@datakadai.com

## 7. Phase 0 checklist

| Item | Owner | Status |
| --- | --- | --- |
| Name shortlist + availability check | Claude | Done (above) |
| Choose final name | AK | Done: Data Kadai |
| Buy domains, create accounts, check Instagram handle | AK | Open |
| Brand kit (profile, logo, banner, chips, end card) | Claude | Done, awaiting AK review |
| Channel copy, title/description/pinned templates | Claude | Done (above) |
| Analytics log template | Claude | Done: `docs/datakadai/analytics_log.csv` |
| Map Reveal template (answer last), Quiz, Top 10 | Claude | Next |
| 3 test Shorts for AK review | Claude | After the templates; no publishing |
| 30 Shorts banked | Claude | Only after AK's go |
| Request NFHS-6 district fact sheets | AK/Claude | Open |
| Trademark search | AK | Open |
