# What 1M+ Shorts in our genres actually do (study, 10 Nov 2026)

AK asked for more research behind the Shorts format. This is our own measurement, not a summary of other people's advice.
The format built from it is [`SHORTS_FORMAT.md`](SHORTS_FORMAT.md). The general rules are in [`SHORTS_RULES.md`](SHORTS_RULES.md).

## Method

- **Sample:** the public Shorts tab of 45 channels in our genres. 28 had readable Shorts tabs and 30+ Shorts, giving
  **5,538 Shorts** with titles and view counts. The genres:
  - Indian finance and business (Think School, Labour Law Advisor, Warikoo, Pranjal Kamra, CA Rachana Ranade, Finance With Sharan)
  - global money (How Money Works, Graham Stephan, Economics Explained, CNBC, Business Insider)
  - maps and geopolitics (RealLifeLore, Johnny Harris, Geography Now, The B1M, Dhruv Rathee, Kurzgesagt)
  - data and facts (FactTechz, Abhi and Niyu, Madan Gowri, Mr.GK, Infographics Show, Vox, Veritasium)
  - how-things-work and invention stories (Zack D. Films, Steve Mould, Real Engineering, Insider Science)
- **Collection:** `scripts/shorts_study/` (`pull.sh`, `analyze.py`) pulls the last 250 Shorts per channel and repeats every
  number below. YouTube blocks video and caption downloads from the cloud container with a bot check, so this study uses
  titles, view counts and the public cover images only. We did not get past that check.
  To rerun, or to run it on our own channels (add them to `channels.txt` as `category|handle`):
  `cd scripts/shorts_study && mkdir -p raw && ./pull.sh && python3 analyze.py --examples`.
- **Comparison:** each channel is compared with itself. Its top-quartile Shorts are set against its bottom-quartile ones,
  and log views are regressed on title features with channel fixed effects. That separates what a Short does from how big
  its channel is.
- **Limits:**
  - The channels are well known, so this shows what winners do, not how often anyone wins.
  - The newest Shorts have had less time to collect views.
  - View counts are YouTube's rounded figures, counted from the first frame since 31 Mar 2025.

## Findings

**1. Format beats channel size.** Channel median views per Short range from 13k to 11M. Measured against subscribers:

| Channel type | Examples | Median views per Short, as a share of subscribers | Shorts reaching 1M |
| --- | --- | --- | --- |
| Native Shorts: made for the feed, one idea, visual first | Steve Mould, Zack D. Films, Veritasium, Mr.GK | 17–36 % | 54–100 % |
| Mixed | Johnny Harris, FactTechz, Labour Law Advisor, Warikoo | 4–9 % | 13–83 % |
| Clips cut from long videos, talking heads, promotions | CNBC, Vox, Business Insider, Think School, CA Rachana Ranade | 0.1–1.1 % | 0–5 % |

Vox, CNBC and Business Insider have 4–13M subscribers each, and 2–13 % of their Shorts reach 100k. Zack D. Films reached
1M on all 250 of the Shorts we pulled. This is the strongest evidence behind our "no cut-downs" rule.

**2. Within a channel, the topic is the lever. Title wording barely matters.**
- A channel's best Short gets **about 25× its own median** (median across channels).
- The strongest title features move views only **1.1–1.3×**:
  - "why/how" ×1.18
  - "vs"/comparison ×1.29
  - an all-caps word ×1.26
  - India named ×1.21
  - number ×1.10
- An emoji, "you", a question mark and title length make no measurable difference.
- Whether a title starts with "How/Why" helps some channels (Pranjal ×3.4, Steve Mould ×2.2) and hurts others
  (Labour Law Advisor ×0.44, Real Engineering ×0.47).

**Don't spend time polishing titles. Spend it choosing topics.**

**3. What top Shorts are about.** Reading each channel's top 6 against its bottom 3 shows the same pattern:

- **The topic is something the viewer already knows, holding a mechanism, number or fact they don't.**
  - Everyday things:
    - "How Electrical Outlets Work" (72M)
    - "How To Get Water Out Of Your Ear" (50M)
    - "Why Hotels Have 12 Pm checkout?" (11M)
    - "Here's why JFK airport throws away 120 pounds of food daily" (19M)
    - "Can water solve a maze" (29M)
  - Price translated into a viewer's terms: "iPhone 17 Pro AFFORD karne ke liye kitne DIN kaam karna padega?!" (6M), "Thar vs Rolex" (2.9M)
  - Corrections of a belief: "Why Canada is WAY Further South Than You Think" (3.7M)
  - A giant project in one verb: "Japan Is Hollowing Out a MOUNTAIN" (12M)
- **Flops are inside-baseball, abstract, or about the channel itself.**
  - "Distribution Is The Biggest Startup Moat" (21k)
  - "Why Is The Wall Street Journal Trying To Become an Ecommerce Platform?" (34k)
  - "How Options Contracts Were First Created" (39k)
  - announcements, event promos, podcast clips (14–60k)
  - On the same channel, the familiar topic beats the niche one by 20–100×.

**This is our biggest risk.** Most of our Moat & Margin Shorts are about company filings: the inside-baseball type that flops.
The fix is not to drop filings. It is to start every filing Short from what the viewer already knows (the shop, the bike,
the phone, their ₹100) and use the filing as the hidden answer.

**4. Series labels recur among winners.**
- Labour Law Advisor numbers every Short (#LLAShorts 1567) and runs "Tutorial Tuesdays".
- Mr.GK has "Wow Facts by Jr.GK".
- Madan Gowri posts day-by-day updates on one case.
- Zack D. Films has "(Patent Pending)".
- Warikoo repeats "…Ab Kitni VALUE hain?!".

A fixed promise, repeated, teaches the audience what they will get.

**5. The opening picture.** We looked at the cover images of the top two Shorts on 16 channels (19 images loaded):
- One striking real picture fills the frame:
  - a satellite map with a glowing border
  - water filling a maze
  - a tunnel machine
  - a demolition seen from above
- Short overlay text sits in the middle or lower third.
- Indian finance winners are mostly face-led; the faceless winners are entirely visual.
- **None opens on text over a plain background**, which is how most of our loop Shorts open today.

**6. Language.** Warikoo's Hinglish-titled Shorts have 2.3× the median of his English ones, though the Hinglish ones are
also his best series, so the effect is mixed up with format. Hindi and regional languages were about 85 % of India's
short-video viewing (EY, 2022). The top Tamil explainers (Madan Gowri, Mr.GK) work in Tamil, one topic at a time.

## What practitioners say (sourced)

- **Open on the visual, then explain.** "We try to always start with the visual." Hafu Go, about 15–20M views per Short.
  tubetalk.buzzsprout.com/271511/episodes/19164652
- **The hook must make sense with the sound off.** Write the last line first. Use a 5th-grade reading level, and define
  words like "profit" on screen. Jenny Hoyos, about 10M views per Short. Her best run about 34 s, and cutting 1 s from an
  ending raised retention from 83 % to 88 %. creatorscience.com/podcast/jenny-hoyos/
- **Picture, words and overlay text name one subject and raise one question.** Keep 5–10 proven hook templates (Kallaway).
- **Zack D. Films:**
  - 24–38 s
  - no intro and no call to action
  - endings that cut abruptly or loop
  - one fixed title grammar (How… 33 %, The… 22 %, Why… 12 %)
  - an emoji on every title
- **Instagram:** "a well-timed cut synced to a beat drop keeps people watching". High saves with low shares means "valuable
  but not shareable". socialmediatoday.com/news/instagram-shares-tips-on-video-creation/827172/
- **Length:** map and geopolitics winners run 50–60 s (RealLifeLore, Johnny Harris). Galloway's 2023 sample found Shorts
  watched for more than 50 s averaged 4.1M views. Object and fact Shorts win at 24–38 s.
- **AI voice:** in a study of 21,541 TikTok videos, an AI voice cut likes 5.4 %, comments 5.2 % and shares 7.4 %. The
  penalty was worst in the build-up (ICIS 2023, aisel.aisnet.org/icis2023/user_behav/user_behav/24). A second study found
  AI voice helped new creators produce more without a penalty. No public creator A/B test exists.
- **Nothing found to support** whooshes or sound effects on cuts, punch-in zooms, or "pattern interrupts" as retention
  drivers. They are not rules.
