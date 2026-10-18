# Global channel: chart formats

The Sankey is one tool in the kit, not the whole channel. Each format below answers a different question about the money, and an episode uses three or four of them. All of them share the frame (header, period chip, DRAFT tag, caption bar, source footer) and the colour roles:
- blue: money in;
- green: money kept;
- orange: money spent;
- grey: other.

The three data hues pass the dataviz validator against all pairs on the dark ground, for colour-blind and normal vision. Text is always in ink, never in a series colour.

## Built (render now, data as JSON props)

| Composition | Question it answers | Best for | Check before render |
|---|---|---|---|
| `GLOBAL-sankey` | Where did every dollar go, all at once? | The anchor of an earnings video; "follow the dollar" across companies | Every node's inflow equals its outflow |
| `GLOBAL-waterfall` | How does revenue step down to profit, and which step is biggest? It doubles as a year-on-year **profit bridge** (start = last year's profit, steps = drivers, end = this year's) | The "following the dollar" section; explaining why profit changed | Start + steps = end |
| `GLOBAL-split` | Of one dollar, how many cents went where? (100 coins) | The cold open, Shorts, thumbnails. The most shareable frame | Parts add up to the whole; cents rounded so they total exactly 100 |
| `GLOBAL-mix` | What is the business made of? (one stacked bar, ordered blue ramp) | Process-node mix, product or segment mix, customer tiers | Shares add up to 100; at most 5 parts, with the rest folded into "Other" |
| `GLOBAL-guide` | What does the company expect next, against what it just did? | The guidance section of every earnings video; also beat/miss against consensus | Every value sits on the shared axis, and low ≤ high |
| `GLOBAL-reel` | All five, back to back | Previewing the kit | — |

Every figure carries a `status`:
- `check`: not yet checked;
- `verified`: read off the filing;
- `derived`: arithmetic on filed lines.

The DRAFT tag stays on every frame until nothing is marked `check`.

## Shorts (1080x1920)

`GLOBAL-split`, `GLOBAL-mix` and `GLOBAL-guide` switch to a portrait layout when the frame is taller than it is wide:
- a hook headline above the chart (`hook`, with "|" for line breaks);
- captions wrapped to two lines;
- the source footer above the Shorts title overlay;
- nothing important under the action buttons on the right.

The Sankey and the waterfall stay 16:9 only, because they're too dense for a phone.

`GLOBAL-short-split`, `GLOBAL-short-mix` and `GLOBAL-short-guide` are the three launch-week TSMC Shorts:
- They reuse the long video's data files, so a figure is corrected in one place.
- The hook and closing line for each Short come from `public/global/<id>/shorts.json`.
- Their beats run 30% slower than in the long video.
- Each ends with a 3-second line pointing to the long video.

## Planned (built when the first episode that needs one is scripted)

| Format | Question | Data it needs |
|---|---|---|
| **Trend line + mix shift** (100% stacked area) | How did the mix change over 8 quarters? E.g. high-performance computing (HPC) overtaking smartphones | 8+ quarters from the management reports |
| **Peer dumbbell / margin ladder** | How does one metric compare across companies, and how did each move year on year? (gross margin: TSMC, Nvidia, ASML, Samsung) | Same-period figures for each peer, drawn to one scale |
| **Value-chain map** | Who sells to whom, and how much? A network diagram for when flows aren't strictly in layers | Segment disclosures plus customer concentration; estimates labelled on screen |
| **Unit teardown stack** | What is inside the price of one AI server, one GPU, one wafer? | Third-party teardown estimates, always labelled "estimate" |
| **Bump chart** | Who ranked where, year by year? (market cap, revenue) | Annual ranks. This replaces bar chart races: rank changes read cleanly with no template look |
| **Indexed lines** (one axis, 100 = start) | Is AI capex growing faster than the revenue it buys? (cloud capex vs Nvidia data-centre revenue) | Quarterly series. Never a dual axis |
| **Geography map** | Where do the customers sit? (US, China, Taiwan exposure) | Revenue by region |
| **KPI tile row** | The 5-second headline: revenue, margin, earnings per share, each with its Y/Y change | Headline figures only |

## How an earnings episode uses them

| Section | Format |
|---|---|
| Cold open | `GLOBAL-split` (51¢ of every dollar kept) |
| Where the revenue comes from | `GLOBAL-sankey`, segments column |
| What the business is made of | `GLOBAL-mix` (process nodes) |
| Following the dollar | `GLOBAL-sankey` full reveal, or `GLOBAL-waterfall` |
| Why profit changed | `GLOBAL-waterfall` as a profit bridge (needs last year's figures) |
| What comes next | `GLOBAL-guide` |
| Thumbnail | `GLOBAL-thumb` with the split bar |

Changing the format from section to section is also what keeps each video from looking like a template, which YouTube's July 2026 inauthentic-content rules penalise.
