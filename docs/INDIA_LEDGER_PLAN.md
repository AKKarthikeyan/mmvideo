# India Ledger: growth plan (draft for AK, 18 Nov 2026)

**Name (AK, 18 Nov 2026):** Data Kadai becomes **India Ledger**, handle **@IndiaLedgerOfficial**. The channel makes
videos for all of India, not only Tamil Nadu, and "Kadai" means nothing to most viewers outside it. Internal ids keep the
old name: the `kadai` theme and the `dk-` video folders in `hyperframes/`.

Built from the playbook AK shared on 18 Nov 2026, after a claim-by-claim check
([`INDIA_LEDGER_FACTCHECK.md`](INDIA_LEDGER_FACTCHECK.md)). Where the playbook and our measured rules disagree, the rules win
and the reason is given. Shorts still follow [`SHORTS_FORMAT.md`](SHORTS_FORMAT.md) and [`SHORTS_RULES.md`](SHORTS_RULES.md)
in full. Decisions that are AK's are listed at the end.

## 1. What changes

| From the playbook | Adopted? | How |
| --- | --- | --- |
| Make long videos the main product (8–12 min), with Shorts feeding them | **Yes** | Long videos are where the channel's research depth pays, and the only realistic YPP route (section 4). |
| 5-act "Data Paradox" structure for long videos | **Yes** | Section 2. |
| Retire "5 rounds, 1 point each" | **Yes** | It is a templated storyline (O1) and fails "one Short, one idea" (T2). No new uploads in it. |
| Wallet-and-career framing of macro data | **Yes** | It is our topic test (Familiar, Hidden, Send) under another name. |
| Strip survey codes from titles; keep sources on screen and in the description | **Yes** | Titles at most 70 characters for long videos and 50 for Shorts (K1). The playbook's own examples are 113–147 characters and can't be used. |
| Two Shorts **cut from** each long episode | **No** | Clipped Shorts are the worst format in our study (0.1–1.1% of subscribers per Short). Instead: two **native** Reveal Loop Shorts per episode, written as their own scripts from the same verified numbers. |
| End each Short on a cliffhanger | **No** | O6: the Short pays off its own hook. After the reveal, the loop line can raise the question the long video answers, and the Related video points to it (K3). |
| Replace the AI voice with AK's own voice | **Test first** | The evidence is about 7% fewer shares, from one study. Run the 10-vs-10 test from SHORTS_FORMAT section 5 on India Ledger. Long videos are where a human voice matters most (minutes, not seconds), so start the human voice there if AK is willing. |
| Extra audio tracks on one URL (multi-language audio) | **Yes, once access is confirmed** | English stays the original audio. Hindi is the first extra track (the largest audience), then Tamil; `scripts/audio_tracks.py` builds both (AUDIO_TRACKS.md). First check Studio → Languages on the channel: YouTube still lists the feature as reaching "a subset of creators". |
| Race to qualify for YPP before 1 Feb 2027 | **No** | It needs about 48,000 long-form views and 1,000 subscribers in 75 days, from under 100 views an upload. Plan for the 8,000-hour bar (section 4). |
| Sponsorships, data licensing, a toolkit course, members-only datasets | **Later** | Section 5. None of the playbook's price figures are verified; don't quote them in a pitch. |

## 2. The long video: five acts (8–12 min)

| Act | Time | Job | Picture (start from the HyperFrames sample) |
| --- | --- | --- | --- |
| 1. The paradox | 0:00–0:45 | Two verified numbers that contradict what the viewer assumes, said in the first 10 seconds. No history, no channel intro. | The subject on frame 1: the gold, the bottle, the map (s01, s04, s12) |
| 2. The headline number | 0:45–2:30 | The single figure news reports quote, and why it misleads. | Dot chart (s05) or money breakdown (s04) |
| 3. The mechanism | 2:30–6:30 | A second and third dataset that explain it. Progressive reveal: axes, then the national line, a pause to guess, then the focal states land. | 3D data map (s15), flow map (s07), timeline (s11) |
| 4. What it means for you | 6:30–8:30 | Jobs, prices, savings, a business decision. | Scale comparison (s12), money breakdown (s04) |
| 5. What the numbers hide | 8:30–9:30 | Our signature segment: the method's limits, said on screen ("installed capacity is not electricity generated"). | Document close-up (s03) of the source table |

Rules carried over: every number has its source on screen, computed numbers say "our arithmetic", illustrations are
labelled "illustrative" (CLAUDE.md). Grey for context, one accent colour for the one or two focal states.
Each episode needs its own structure inside the acts. The same five scenes with new numbers would be the template the
policy names (O1).

## 3. The first four episodes

The playbook proposed re-making four existing Shorts as long videos. Scored on our topic test:

| Episode | Familiar | Hidden | Send | Working title (at most 70 characters) |
| --- | --- | --- | --- | --- |
| Household gold vs the US government's gold | Yes: every family | Yes: 3× | Yes | Indian Homes Hold 3× the US Government's Gold. Why? |
| Campa's ₹10 bottle vs Coke and Pepsi | Yes: everyone buys cola | Yes: 93% → 85% in a year | Yes | Coke and Pepsi Went From 93% to 85%. Meet the ₹10 Bottle |
| More women working in Tamil Nadu than Haryana, at the same income | Yes: a north–south contrast most viewers have an opinion on | Yes | Yes, in both regions | Same Income, Opposite Lives: Why Tamil Nadu's Women Work |
| India's factory states: Tamil Nadu has the most, Maharashtra and Gujarat add more value | Partly | Yes | Viewers in all three states | India's Most Factories Are in Tamil Nadu. So Why Is It 3rd? |
| *(playbook's 4th)* Karnataka vs Tamil Nadu software exports | Weak: "STP units" means nothing to most viewers | Yes: 6× | Partly | Same Tech Parks, 6× the Exports: Karnataka vs Tamil Nadu |

**Recommendation:** the first four are gold, Campa, women at work and factories. Software exports follow if the factories
episode does well.
Before scripting: re-pull every number from the primary table, and fix every date range (for example, Campa's numbers are
Jan–Sep 2024 against Jan–Sep 2025, NielsenIQ "as reported by Storyboard18").

## 4. Cadence and the YPP target

- **Each week:** one long video and two native Reveal Loop Shorts on the same story, each Short linked to it as its Related
  video. The channel's three Shorts series continue (Days of Work, In ₹500 Notes, In Your Pocket).
  If a long video every week is too much production, publish one every two weeks and keep two Shorts a week (K5).
- **Target:** 1,000 subscribers and 8,000 long-form watch hours in 365 days. At 50% of a 10-minute video watched, that is
  about 96,000 long-form views in a year, roughly 2,000 a week (our arithmetic). The 500-subscriber tier (3,000 hours) unlocks
  memberships and fan funding first.
- **Shorts revenue** needs 10M qualified Shorts views every 90 days even after joining (from 1 Feb 2027). Shorts here are for
  reach and subscribers, not income.
- **Measure:** the 48-hour read for Shorts (SHORTS_RULES section 7). For long videos at 7 days: click-through, average view
  duration and the share of traffic from our own Shorts. Compare each one with the channel's own median.

## 5. Revenue beyond ads (once there's an audience)

In order, each at a milestone the channel can measure:
1. **Memberships with the cleaned tables** (CSV and charts from each episode), at the 500-subscriber tier.
2. **Sponsorships** from fintech and education brands, once the median long video reaches about 5,000 views. Price on
   offers we actually receive, not the playbook's rate card.
3. **Data and visualisation work** for brands, research groups and media, with the episodes as the portfolio.
   The India in Pixels–Coca-Cola licence the playbook cites is unverified; don't use it as a reference.
4. **A course or toolkit** ("Finding and charting India's official data") at 10,000+ subscribers.

## 6. Promotion

Post each episode's key chart as a static image with its source on r/india, r/IndiaSpeaks, the subreddits of the states in the story, and LinkedIn, with the
link in a comment where the subreddit's rules allow it. A chart image is not a repost of our Short (O3).

## 7. AK's calls

1. **Narrator.** AK's own voice for long videos (English; Hindi and Tamil tracks from a native voice)? And run the 10-vs-10 voice test on Shorts?
2. **Cadence.** A long video every week or every two weeks?
3. **First four episodes.** Gold, Campa, women at work, factories (recommended), or the playbook's four with software exports?
4. **The old Shorts.** Leave the "5 rounds" Shorts up, or make them private? Private is the cleaner channel-wide signal under
   the policy (O1), but it loses their small view counts. Don't delete and re-upload (O4).
5. **Languages.** Hindi and Tamil audio tracks on the English uploads only, or also native Hindi Shorts (K6)?
6. **Shorts across five channels** (SHORTS_RULES section 8): from 1 Feb 2027, each channel needs 10M Shorts views every
   90 days for Shorts revenue. Does India Ledger keep two Shorts a week, or put that effort into long videos?
