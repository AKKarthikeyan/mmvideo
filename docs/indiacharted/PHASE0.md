# India Charted: Phase 0 kit (prepared 9 Oct 2026, production ON HOLD)

## 1. Name and domains

"IndianData" is taken (indiandata.com and indiandata.in are both registered; @indiandata exists on YouTube).
Checked 9 Oct 2026: domains via registry RDAP (Verisign for .com, NIXI for .in); 404 = not registered. YouTube via
the public @handle page; 404 = no channel with that handle. Instagram needs a login to check, so verify it by hand.

| Name | .com | .in | YouTube @handle | Notes |
| --- | --- | --- | --- | --- |
| **India Charted** (recommended) | free | free | free | Clear, works for maps, rankings and money ("India Charted: SIP flows"); no existing data brand found under this name |
| Charted India | free | free | free | Same idea; "India" first reads better in search |
| The India Chart | free | free | free | Good but longer; "the" is weak in handles |
| India Plotted | free | free | free | Fine, a little technical |
| StatBharat | free | free | free | Strong in the Hindi belt, less so for a Tamil-first audience |
| Sankhya India | free | free | free | "Sankhya" = number (Sanskrit); distinctive but needs explaining |
| Mapped India / India Ranked / India By Numbers / Ranked India | free | free | **taken** | YouTube handle already used |
| IndianData / India In Data / India Mapped / India Charts / Data Katha | taken | taken | — | Domains registered |

Availability changes daily. **Buy the domains as soon as you choose:** indiacharted.com + indiacharted.in (also grab
chartedindia.com/.in as defensive buys if cheap).

Trademark: search IP India (ipindiaonline.gov.in, public search) for "India Charted" in classes 41 (education and
entertainment), 9 (downloadable media), 16 (printed matter, posters) and 35 (advertising). File a TM application once
the channel shows traction (Phase 2).

## 2. Accounts to create (AK)

- [ ] Google account for the brand, kept separate from personal and Moat & Margin; 2-step verification on
- [ ] YouTube channel @IndiaCharted: profile, banner, About text (below), links to the site and Instagram
- [ ] Instagram @indiacharted, Facebook page, X @IndiaCharted, Threads, LinkedIn page (claim the names even if idle)
- [ ] Email: hello@indiacharted.com (forwarding is enough at first)
- [ ] Newsletter tool account (Phase 2)

## 3. Brand kit (rendered, in `mmvideo`)

Compositions in `src/datayt/Brand.tsx`. Render with `npx remotion still src/index.ts <id> out/datayt/brand/<id>.png`.

| Asset | Composition | Size |
| --- | --- | --- |
| Profile picture (circle-safe) | `IC-profile` | 800×800 |
| Logo (mark + wordmark + tagline) | `IC-logo` | 2400×800 |
| YouTube banner (key content in the 1546×423 safe area) | `IC-banner` | 2560×1440 |
| Series title chips | `IC-chips` | 1080×1080 |
| Shorts end card | `IC-endcard` | 1080×1920 |

- **Mark:** three rising bars, the tallest gold with a data dot, so it also reads as an "i". No India outline in the
  logo, because the outline is legally sensitive.
- **Palette:** navy #0B1020 / #131A30, text #F5F7FF, muted #8C95AD, gold #FFC15E (answer, highlight), cyan #33D1FF (accent).
  Map bands: #26306B → #5A3D9E → #A8429A → #EE5D6C → #FFC15E.
- **Type:** Oswald 700 (headlines, numbers), Inter (labels, body).
- **Music:** original code-composed 124 BPM score per Short (`scripts/datayt/music_shorts.py`); never third-party tracks.

## 4. Channel copy

**About (YouTube, about 900 characters):**
> India, in charts. Every day we turn official Indian data into one map or chart you can understand in 30 seconds:
> which state drinks the most, where women own land, who's getting heavier, where India is changing fastest.
> Every number comes from an official source, shown on screen: NFHS, Census, RBI, MoSPI, NPCI and more. No opinions
> dressed up as data, no stock tips.
> New Shorts daily, in Tamil and English. Comment your state; we read every one.
> Business: hello@indiacharted.com

**Short title formula** (≤ 60 characters, question or shock, state names in it):
`Which state's women own the land? 🗺️ #Shorts` · `Arunachal women drink 21× India's rate` ·
`Tamil Nadu vs Gujarat: who drinks more?`

**Description template:**
```
{one-line finding with the number}
Source: {survey/agency}, {year}, {table/indicator name}. {link to source}
Where does your state rank? Comment below 👇
#IndiaCharted #India #{state} #{topic} #IndiaData #Shorts
```

**Pinned comment template:** `Source: {source}, {indicator exactly as published}. Values are state averages for {age
group}. Full ranking on indiacharted.com (from Phase 2). Which state should we map next?`

**Hashtag sets:** core `#IndiaCharted #IndiaData #Shorts` · health `#NFHS #HealthIndia` · state `#TamilNadu #Kerala …` ·
money (Phase 3) `#IndianEconomy #Investing101`.

## 5. Posting rhythm (from launch)

- 1 Short a day at 7:30 pm IST (Mon-Sat), the weekly 5-Question Quiz on Sunday.
- Same file to Instagram Reels and Facebook, 30 minutes later.
- Every Sunday: fill `docs/indiacharted/analytics_log.csv` and review the top 5 and bottom 5 Shorts by % viewed.

## 6. Sponsor one-pager (draft for Phase 1 end)

> **India Charted** · India, in charts. Daily data Shorts in Tamil and English, built from official sources.
> **Audience:** {subs} subscribers, {avg views} average views per Short, {avg % viewed}% average viewed, top states {…}.
> **Formats:** "This map is presented by {brand}" (logo on the end card + pinned comment), sponsored series of 4
> Shorts, newsletter slot (Phase 2).
> **Fits:** exam prep (TNPSC/UPSC GK), edtech, insurance, SaaS, consumer brands.
> **Not offered:** stock or fund recommendations; content that changes the data.
> **Contact:** hello@indiacharted.com

## 7. Phase 0 checklist

| Item | Owner | Status |
| --- | --- | --- |
| Name shortlist + availability check | Claude | Done (above) |
| Choose final name | AK | Open |
| Buy domains, create accounts, check Instagram handle | AK | Open |
| Brand kit (profile, logo, banner, chips, end card) | Claude | Done, awaiting AK review |
| Channel copy, title/description/pinned templates | Claude | Done (above) |
| Analytics log template | Claude | Done: `docs/indiacharted/analytics_log.csv` |
| Map Reveal template (answer last), Quiz, Top 10 | Claude | Next |
| 3 test Shorts for AK review | Claude | After the templates; no publishing |
| 30 Shorts banked | Claude | Only after AK's go |
| Request NFHS-6 district fact sheets | AK/Claude | Open |
| Trademark search | AK | Open |
