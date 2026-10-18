# Global channel: launch plan

Drafted 18 Oct 2026. The research behind it is `reports/Global data video channel scan.md` on the `research/global-channel-scan` branch.

**Niche:** where the money in AI and chips actually goes. Nvidia, TSMC, ASML, Samsung, SK Hynix, the cloud companies that buy the servers, and the Asian suppliers Western viewers rarely see. Every video is built from the companies' filings.

**Audience:** English-speaking investors in the US, UK and Europe. Indian viewers are welcome, but they aren't the target, because ad revenue per view is roughly 8 to 20 times lower in India.

**Voice:** MiniMax text-to-speech for now, under the rules in section 3.

## 1. Name shortlist

| Name | Why it works | Risk |
|---|---|---|
| **Flowsheet** (preview art uses this) | Sankey "flows" plus the financial "sheet". Short, ownable, and works beyond chips | Sounds like a spreadsheet tool |
| **Profit Pools** | A finance term for who captures the profit along a value chain, which is exactly the "follow the dollar" format | Bain uses the term in consulting |
| **Wafer to Wallet** | Covers the whole AI chain from the chip to the consumer. Memorable and alliterative | Locks the channel to chips |
| Who Gets Paid | A question-led title that's easy to put in thumbnails | Generic; hard to search for |
| Silicon Ledger | Chips plus filings; sounds serious | Long; "ledger" suggests crypto |
| The Dollar Trail | Plain English and global | Likely already taken |
| Margin Map | Neutral, and it echoes Moat & Margin | Close to the Indian brand |

I couldn't check whether any of these are available. Before choosing, check the YouTube handle, the `.com` domain, the X/LinkedIn handles, and a quick USPTO and EUIPO trademark search. Once a name is chosen, re-render the art with:

```
npx remotion still src/index.ts GLOBAL-banner out/global/banner.png --props='{"name":"<Name>","tagline":"Where the money in AI and chips actually goes"}'
```

`GLOBAL-endcard` takes the same props. `GLOBAL-avatar` has no text.

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

From 1 Feb 2027, new channels need 8,000 watch hours in 365 days plus 1,000 subscribers. Reaching the old 4,000-hour bar before then isn't realistic for a new channel, so plan for 8,000 hours, which is about 120K views at 4 minutes watched per view. Earnings dates below are the companies' usual timing. **Confirm each one on the company's investor relations calendar.**

| Week of | Publish | Prep |
|---|---|---|
| 19 Oct | — | Pick the name; set up the channel (section 5); check every TSMC figure against the 3Q26 management report |
| 26 Oct | Trailer; **Ep 1: TSMC Q3 2026, "51 cents of every dollar"**; 3 Shorts | Samsung and SK Hynix Q3 results are usually late October; collect them for Ep 4 |
| 2 Nov | **Ep 2: Follow the dollar: who profits when a cloud company buys one AI server** | Mark modelled splits as estimates on screen |
| 9 Nov | **Ep 3: ASML, the monopoly behind every advanced chip** | Nvidia data ready the night before results |
| 16 Nov | **Ep 4: Nvidia results breakdown** (results expected around 17–18 Nov; confirm) | Biggest search week of the quarter: publish within 48 h |
| 23 Nov | **Ep 5: How AI memory flipped Samsung vs. SK Hynix** | — |
| 30 Nov | **Ep 6: What it would really cost India to build a TSMC** | — |
| 7 Dec – 4 Jan | Eps 7–10: evergreen deep dives (e.g. Broadcom, Arm's royalty model, the hyperscaler capex race, Taiwan risk in numbers) | Holiday lull: bank the evergreen videos |
| 11 Jan | **Ep 11: TSMC Q4 2026** (usually mid-January) | 12-video checkpoint (section 6) |
| 18 Jan – 1 Feb | Ep 12+: ASML Q4, then big-tech capex results (usually late Jan / early Feb) | Re-plan the mix from checkpoint results |

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
> Where the money in AI and chips actually goes. We read the filings of Nvidia, TSMC, ASML, Samsung, SK Hynix and the companies that buy their chips, and show every dollar on one chart: where it comes from, who spends it, who keeps it. Every figure is sourced on screen, and the data is free to download. Research by the Moat & Margin team. Information, not investment advice.

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
