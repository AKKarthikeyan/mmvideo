# Data Kadai: channel plan and production rules

Data Kadai is an India-wide data channel. Titles get the click; **data is the product**. Every rule below exists to
keep every number on screen true, sourced and current.

## 1. Publishing plan

### Phase 1: months 1 to 3 (learn what works)

| Slot | Per week | What |
| --- | --- | --- |
| Shorts | 7 (daily) | Mon, Thu: release-day data Short. Tue, Fri: **Kadai Wars** episode. Wed, Sat: **India Map of the Day**. Sun: best clip from the week's long video. |
| Map of the Day | 3 to 4 (inside the Shorts) | One standard India map, one surprise per map. Goes daily once a 60-map backlog is ready. |
| Long video | 2 | One data story (Kadai Wars, brand battle, 10 to 14 min) and one **Map Deep Dive** (the week's best map explained, 8 to 12 min). |
| Documentary | 1 a month | 20 to 25 min for connected-TV viewers (over half of Indian TV watch time is on videos 21 min or longer). |

About 9 to 10 uploads a week.

### Phase 2: month 4 onwards (scale on evidence)

Judge by **Engaged Views, retention and returning viewers** in YouTube Analytics, never the public view count: since
24 Aug 2026 a long-form view counts from the first frame, but earnings still use engaged views.

- Long videos hold viewers well: go to 3 a week.
- Map Shorts lead: make maps daily and add a monthly "State Rankings" long video.
- More output comes from more people (researchers, fact-checkers, editors), never from skipping checks.

## 2. Data rules (non-negotiable)

1. **Trust Stamp on every number.** 🟢 OFFICIAL = government or regulator (NPCI, TRAI, DGCA, RBI, MoSPI, NFHS).
   🟡 ESTIMATE = analysts or market research (Nielsen, Redseer, brokerages). 🔴 CLAIM = a company's or lobby
   group's own number. The engine draws the stamp; the data file must declare it.
2. **Source on every chart:** publisher, dataset, year, date checked. Shown on screen, not only in the description.
3. **Latest data only.** Before scripting, check that a newer release has not replaced the dataset (for example,
   NFHS-6 fact sheets replaced NFHS-5 in June 2026). Older data is allowed only when the story is the change over time.
4. **Data Receipt.** Every video links a public sheet with every number, its source link and the date checked.
5. **Corrections.** A wrong number gets a pinned correction comment the same day; serious errors get the video
   re-uploaded or a correction card added.
6. **Machine-checked claims.** Map episodes list their claims (top state, count below a threshold, which states
   rose) in `spec.json`; `build_map.py` refuses to build if the data does not back them.
7. **Official India map only.** Every map uses `public/datakadai/geo/india.json`, built from DataMeet boundaries
   that follow the Government of India's claimed boundary (all of J&K, Ladakh incl. Gilgit-Baltistan and Aksai Chin,
   all of Arunachal). `build_geo.py` refuses to write a map that fails these checks. Never use another map file.

## 3. YouTube policy and features

- **Inauthentic content rule** (channel-level, demonetises mass-produced templated content with generic AI voices):
  every episode needs original analysis, a human voice or clear human creative direction, and a varied hook. The map
  template gives a consistent look; the story, voice and hook must change every time.
- **Test & Compare:** make 3 openings per long video (number-first, question-first, story-first) and let YouTube's
  hook test pick the winner. Test titles and thumbnails too.
- **Shorts seasons and episodes** (rolling out since 23 Sept 2026): publish Map of the Day, Kadai Wars and the
  release-day Shorts as seasons.
- **Multi-language audio:** upload our own Hindi, Tamil and Telugu tracks (`scripts/audio_tracks.py`) instead of
  relying on auto-dubbing.
- Follow on X: @YouTubeCreators, @YouTubeInsider, @YouTubeLiaison, @TeamYouTube, @YouTubeIndia.

## 4. Release-day calendar (first to visualise official data)

| Data | Publisher | Roughly when | Short |
| --- | --- | --- | --- |
| UPI app shares | NPCI | Start of month | UPI Scorecard |
| Auto sales | SIAM and company releases | Start of month | India's best-selling vehicles |
| GST collections | Finance Ministry | Start of month | The economy's pulse |
| Inflation (CPI) | MoSPI | Mid-month | Your thali got costlier by... |
| Airline share | DGCA | Mid-month | IndiGo's share this month |
| Telecom subscribers | TRAI | Monthly | Jio vs Airtel vs Vi |
| EV registrations | Vahan dashboard | Daily or monthly | EV race |

## 5. Map of the Day: how to make one

1. Pick a dataset with values for all 36 states and UTs (NFHS, PLFS, RBI Handbook of State Statistics, MoSPI,
   Vahan, DGCA). Check that it is the latest release.
2. Create `public/datakadai/maps/<id>/data.csv` (`id,value[,prev]`, ids as in `india.json`) and
   `public/datakadai/maps/<id>/spec.json` (text, scale, source, stamp, claims). Copy an existing episode.
3. `python3 scripts/datakadai/build_map.py <id>`: validates the data and claims and writes `episode.json`.
4. Register the id in `src/datakadai/DataKadaiVideos.tsx`, check it in Remotion Studio, render:
   `npx remotion render src/index.ts DK-MAP-<id>-short out/datakadai/<id>-short.mp4`
   (also `-wide` for 16:9 and `npx remotion still src/index.ts DK-MAP-<id>-thumb out/datakadai/<id>-thumb.png`).
5. Record a human voiceover, put it at `public/datakadai/maps/<id>/voice.mp3` and set `"audio"` in `spec.json`.
6. Publish with the Data Receipt sheet linked and the source in the description.

An episode with `"draft"` set in `spec.json` renders with a DRAFT watermark and must not be uploaded.

## 6. Pre-upload checklist

- [ ] Latest release of the dataset, and the source and date checked are on screen
- [ ] Trust Stamp matches the source type
- [ ] `build_map.py` (or the episode's checks) passed; no `draft` flag
- [ ] Every number in the voiceover matches the data file
- [ ] Hook is different from the last 5 uploads
- [ ] Human voiceover or clear human creative input
- [ ] Data Receipt sheet linked; description carries the source links
- [ ] Short safe zones: nothing important in the bottom 15 % or the right-hand icon column

## 7. Engine roadmap

| Piece | Status |
| --- | --- |
| Official India map data with boundary checks (`scripts/datakadai/build_geo.py`) | Done |
| Map of the Day: 9:16 Short, 16:9 and thumbnail, Trust Stamp, source bar, draft watermark | Done |
| Map episode builder with machine-checked claims (`scripts/datakadai/build_map.py`) | Done |
| Release-day scorecard Short (share bars, month-on-month change) | Next |
| Kadai Wars battle template (share race, price tags, weighing scale) | Next |
| Long-form scenes: shop intro, receipt summary, shutter outro | Later |
