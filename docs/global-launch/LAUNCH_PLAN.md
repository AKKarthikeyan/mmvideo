# Moat Atlas: launch plan

Drafted 18 Oct 2026. The research behind it is `reports/Global data video channel scan.md` on the `research/global-channel-scan` branch.

**Niche:** how the world's great companies actually make their money. Every kind of company is in scope: consumer brands, platforms, banks, healthcare, carmakers, energy and tech. AI and chips are one theme, not the channel, and Asian and Indian companies are told for Western viewers. Every video is built from the companies' filings. The channel's identity comes from the method (follow the dollar, sourced on screen), not from one sector.

**Audience:** English-speaking investors in the US, UK and Europe. Indian viewers are welcome, but they aren't the target, because ad revenue per view is roughly 8 to 20 times lower in India.

**Voice:** MiniMax text-to-speech for now, under the rules in section 3.

## 1. Name: Moat Atlas (chosen 18 Oct 2026)

- **Tagline:** "The business behind the ticker, mapped from the filings".
- **Flagship series:** Follow the Dollar.
- **Why this name:** it ties to Moat & Margin (cross-promotion, and MoatSCORE can go global later), and "Atlas" says the coverage is global. Searches found no existing show using the exact name.
- **Before the handle is claimed:** check `@MoatAtlas`, the `.com` domain and the X handle, and run a USPTO / EUIPO trademark search. VanEck runs an ETF with the ticker MOAT; worth a glance, though "Moat Atlas" is a different mark.
- **Art:** `GLOBAL-banner`, `GLOBAL-avatar` and `GLOBAL-endcard` all carry the name. The mark is a globe inside a blue ring (the moat); the wordmark is MOAT in bold, ATLAS in regular.
- **Content plan:** `CONTENT_PLAN.md`.

## 2. Formats

| Format | Length | Cadence | Built with |
|---|---|---|---|
| **Earnings breakdown**: a narrated Sankey plus guidance vs. expectations, a peer drawn at the same scale, and what the share price had already assumed | 8–12 min | Within 48 h of each covered result | `GLOBAL-sankey` + Vox scenes |
| **Follow the dollar**: one Sankey across companies (e.g. cloud capex → Nvidia → TSMC → ASML → SK Hynix) | 15–20 min | Twice a month, evergreen | `GLOBAL-sankey` with the companies as columns |
| **Shorts**: one chart each, as a trailer for a long video | 30–50 s | 3 a week | Cut from the long video |
| Bar chart races | 20 s segments inside stories only | — | Never as a standalone video |

The full chart kit is in `FORMATS.md`: Sankey, waterfall and profit bridge, the $1 split, the mix bar and the guidance range are built; trend, peer, value-chain and teardown formats are planned. Use 3–4 formats per episode.

Rules for every video:
- Calendar quarters on screen (fiscal quarter in small print).
- Filed currency in grey, with the exchange rate stated.
- Source and "as of" date in the footer.
- Data downloadable from the description.

## 3. Synthetic-voice rules (YouTube monetisation policy, July 2026)

YouTube does not pay out on AI personas presented as human experts giving finance advice, or on template videos "with little variation from video to video". Enforcement covers the whole channel.

1. **No persona.** No named host, no avatar, no "I/me as an analyst". The narrator is a voice, not a character.
2. **No advice.** No buy, sell, target price or allocation, ever. The script says what the filings show and what to watch.
3. **Credit the humans.** The end card already carries "Research and script: Moat & Margin research team · Narration: synthetic voice". Use the same line in every description.
4. **Every video has its own argument.** It opens on a question specific to that company, has at least one scene built for that story, and reuses no script structure word for word. The Sankey is the anchor of the video, not the whole video.
5. **Disclosure.** YouTube's altered-or-synthetic checkbox exempts animated content, so it isn't required for a synthetic voice over animated charts. Revisit this if the voice is ever cloned from a real person.
6. **Review point.** At the 12-video checkpoint (section 6), test a human-narrated version of one flagship video. The research found that the explainer channels still growing fast all have human expert voices.

## 4. Calendar to the 1 Feb 2027 Partner Program change

From 1 Feb 2027, new channels need 8,000 watch hours in 365 days plus 1,000 subscribers. Reaching the old 4,000-hour bar before then isn't realistic for a new channel, so plan for 8,000 hours, which is about 120K views at 4 minutes watched per view.

The week-by-week slate lives in **`CONTENT_PLAN.md`**: trailer and TSMC on 27 Oct, then Netflix, Visa, Nvidia, Ferrari vs Toyota, Starbucks, Novo vs Lilly, Costco, Reliance, the 2026 roundup, LVMH and JPMorgan on 12 Jan. In the week of 19 Oct, before launch:
- set up the channel (section 5);
- check every TSMC figure against the 3Q26 management report;
- confirm the November earnings dates.

## 5. Channel setup checklist

- [ ] Brand Account under the Moat & Margin Google account, with 2FA, and a second owner added.
- [ ] Handle, name, avatar (`GLOBAL-avatar`), banner (`GLOBAL-banner`), and the avatar as the watermark.
- [ ] About text (below), with links to the newsletter / data page and Moat & Margin.
- [ ] Upload defaults: category Education, language English, the description template below, and comments on.
- [ ] Playlists: Earnings breakdowns · Follow the dollar · Chips explained · Shorts.
- [ ] An end-screen template matching the `GLOBAL-endcard` slots (two videos plus subscribe).
- [ ] An email list (Substack or Beehiiv) for data downloads, so the audience is owned before YouTube pays anything.
- [ ] Turn on multi-language audio later (dubbing). Uploading your own dubbed tracks is open to everyone, and auto-dubbing covers 27 languages.

**About text (draft):**
> The business behind the ticker. We read the filings of the world's great companies (Netflix, Visa, Nvidia, Costco, Toyota, LVMH, JPMorgan and more) and show every dollar on one chart: where it comes from, who spends it, who keeps it. Every figure is sourced on screen, and the data is free to download. Research by the Moat & Margin team. Information, not investment advice.

**Description template:**
```
<One sentence: the question this video answers.>

Chapters
00:00 ...

Sources (all figures as of <date>)
- <Company> <quarter> earnings release / management report: <link>
- Exchange rate: <rate and basis>
Data for this video: <link>

Research and script: Moat & Margin research team. Narration: synthetic voice.
Information, not investment advice.
```

## 6. Per-video workflow and quality checks

1. **Data.** Copy `public/global/tsmc-3q26/sankey.json` and enter the figures in the currency the company files in. Mark each node with a status:
   - `check`: not yet read off the filing;
   - `verified`: read off the filing;
   - `derived`: calculated from filed lines.

   The render refuses to start if any node's inflow and outflow differ, and the DRAFT tag stays on every frame until no node is `check`.
2. **Script.** Written by a person and run through the rules in section 3. Every number spoken must match a number on screen.
3. **Render and QA.** Check:
   - calendar vs. fiscal quarter;
   - currency and exchange rate;
   - source and "as of" date;
   - captions;
   - thumbnail shows one number and no more than four words.
4. **Publish.** Pin a comment with the sources. Cut 3 Shorts from the long video and schedule them across the week.

## 7. Checkpoint after 12 long videos (about mid-January)

Compare earnings breakdowns against follow-the-dollar videos on click-through rate, average view duration and returning viewers. Ignore subscriber count for now.

My working targets (these are not industry benchmarks): click-through rate of at least 5%, and at least 40% average view duration on a 10-minute video. Put more effort into whichever format wins. If neither gets near the targets by video 12, change the topic or the voice before changing the visuals.

## 8. Not yet checked

- Name availability (handle, domain, trademark).
- Exact earnings dates.
- All TSMC 3Q26 figures. They came from search excerpts of TSMC's release because the filing PDFs couldn't be opened from this environment. The platform split (HPC 68%, etc.) comes from the App Economy Insights graphic.
- The full text of YouTube's monetisation policy page (1311392).
