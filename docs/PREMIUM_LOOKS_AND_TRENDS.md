# Premium explainer looks, "explain like I'm 5", and riding trends

AK asked on 11 Nov 2026 how we can make Vox-style and other premium, rich-looking cartoon explainers in an
"explain like I'm 5" format, and how to ride trends. This is the research and a plan. Two pieces are now built
(section 7): a pilot of look B and the first version of the trend-desk script.

**Evidence.**
- Live YouTube data from vidIQ on 11 Nov 2026.
- Creators' own interviews and process pages.
- Platform policy pages.

Vendor blogs are marked "vendor"; anything from one weak source is marked "unverified".

## 1. What the research says

**How the premium looks are really made**

| Look | How it is made | Source |
| --- | --- | --- |
| **Vox** | • After Effects with Photoshop and Illustrator; one producer makes a video largely alone in 4–6 weeks.<br>• The pitch is a headline plus the visual evidence for each point; animation is "number nine on that list".<br>• No B-roll and no decorative transitions; the voice-over is rewritten to refer to what is on screen ("perfect correspondence"). | Sam Ellis, Estelle Caswell, Joss Fong, Joe Posner (storybench.org/?p=12232; schoolofmotion.com/blog/estelle-caswell-vox-podcast; theopennotebook.com 7 Jan 2020) |
| **The paper feel** (reconstructions, not Vox's own account) | • Graphics stepped at 12 fps inside a 24 fps edit, while camera moves stay smooth.<br>• Scanned torn paper and rough-edged cut-outs.<br>• Five or six textures cycled two or three times a second.<br>• Flat layers at different depths.<br>• Edge-only chromatic aberration.<br>• Yellow #fff200 on ink #131313. | premiumbeat.com/blog/replicating-vox-motion-graphic; storybench.org/?p=22821 |
| **Vox maps** | A label-free base map, with latitude, longitude, zoom, bearing and pitch keyframed. Country highlights come from Natural Earth; labels are parented to the map. | Johnny Harris tutorial (youtube.com/watch?v=GsojLuJpe_0) |
| **Kurzgesagt** | • 1,200+ hours a video and about 200 panels drawn in Illustrator.<br>• Scenes are split into hundreds of parts and rigged, so something small is always moving.<br>• Voice-over is recorded first and animation timed to it.<br>• Rounded shapes, no outlines, saturated colour on deep navy; bespoke music. | kurzgesagt.org/youtube; youtube.com/watch?v=uFk0mgljtns |
| **TED-Ed** | 800–900 words, "simple and direct"; animation replaces narration wherever it can. | edsurge.com, 16 Aug 2018 |
| **Cleo Abram** | A three-column script (ears, eyes, sources); the key visual is found before writing. | videoconsortium.org/mag/episode-8-cleo-abram |
| **Sound** | Vox uses APM library music, minimal, with nothing in the voice's pitch range, re-cut about every 20 seconds. Kurzgesagt uses a bespoke score per video. No primary source supports whooshes or paper sounds. | Fong; Kurzgesagt |

What makes any of them feel premium is the same thing: **every picture is evidence or a metaphor for the sentence
being said**, a small fixed palette, real typography, and restraint.

**Which animated explainer formats are working now** (vidIQ, 11 Nov 2026)

| Format | Example | Result | Note |
| --- | --- | --- | --- |
| 3D "how it works", one question, 30–45 s | Zack D. Films | 29.6M subscribers; Shorts at 8–67M views | The strongest evidence. Human 3D artists. |
| 3D "You just invented X", low-poly toy look | Odd Tilt | 30 → 200K subscribers in 30 days | The viewer is the protagonist. |
| Hand-drawn 2D character, one idea | NarrArty | 2.5M on one Short at 164K subscribers | Closest to "premium cartoon ELI5". |
| Simple round-head characters in richly lit scenes | ConChaser, Day One Films | 1.6M and 1.9M on long videos from 22K and 95K subscribers | "What if" and morality tales. |
| Explainer duo: one explains, one asks | Popden (India) | 605K in a week at 1.6K subscribers: "Ramayana Explained for Americans" | Explaining to an outsider is ELI5 done for adults. |
| "Why does X happen" with a recurring character | The Love and Louie Show | 6.8M in 4 days at 21K subscribers | Kids-coded; about 0.5 % engagement against 2–5 % for Zack D. |
| Paper-collage news explainer | Sky News Explains | 748K, 10× the channel's usual | The Vox look still works for news. |

**Fading or being removed:**
- Fully AI-generated story cartoons and talking-object videos.
- A Tamil animated-facts channel with 1.49M subscribers went from 1,002 videos to 23 between 20 Oct and 5 Nov 2026 (cause
  unverified).
- "BrainPOP Used AI Art" reached about 810K views; we read the title as criticism of AI art in education.
- On 31 Jul 2026 Kurzgesagt said YouTube's detector wrongly flagged its human-made videos as AI slop. So the flat-vector
  look with a calm narrator is the profile that gets flagged; we should not clone it.

**Riding trends**
- News-peg videos reach about 99 % of their 30-day views by day 7; education videos reach about 86 % (ytgrowth.io,
  18,423 videos, small sample).
- YouTube pushes "authoritative" news sources on breaking queries, so a small channel does not win the breaking search.
  The Shorts feed "may tune up on the recency of content" (YouTube Help).
- TLDR News (11 staff, about 3 videos a day) avoids breaking news. It publishes a clear explainer about 48 hours in, under
  a durable question as the title (pressgazette.co.uk).
- Older videos resurface when their topic trends, so an evergreen library also benefits (YouTube's Beaupré, via Search
  Engine Journal).
- Trending in India on 7–10 Nov 2026: airfares, the Agniveer reform, the Arunachal border, a Perplexity case study.
  Almost all were talking heads or news desks. **None of the ones we saw was a premium animated explainer.**

## 2. Three looks we can build

We already own most of look A. Look B is the new one. Look C has the strongest evidence and the highest build cost.

| | A. Paper desk (our Vox look) | B. Cut-out cartoon (ELI5) | C. Toy world (3D) |
| --- | --- | --- | --- |
| **Reads as** | A reporter's desk: documents, maps, torn paper, marker | A storybook: two characters and one metaphor | A miniature model you can look inside |
| **Best for** | Moat & Margin, Moat Atlas, news explainers | Data Kadai, UPSC Mains, any "why does X happen" | The Inventor Desk, "how it works" |
| **We have** | VoxEngine torn cards and strips; document clips; samples s03-desk, s13-quote, s14-notes; the atlas map engine | Illustration kit (`illustration-library/`, `src/vx/illus`); parallax sample s10; MiniMax image-01 | three.js seat map; sample s08-exploded |
| **To add** | Stepping on twos for graphics; texture cycling; depth layers; marker highlights timed to the voice | A style bible, two original characters as layered parts, a code rig, 12 fps stepping, grain | A small prop library, toy materials, tilt-shift depth of field |
| **Cost per Short** | About zero | $3–10 in images (our arithmetic from vendor prices) | About zero; modelling time is the cost |
| **Main risk** | Looks like Vox if we copy the yellow; use our own palette | Stiff motion; AI-art backlash if it looks generated | Crowded niche; slower to make |

**Recommendation:** build **B** first as a pilot, with **A** for the evidence beats inside it. Take **C** later for The
Inventor Desk.

**Rules that keep B premium, not "AI slop"**
1. **Style bible before any image:**
   - five named colours;
   - one line weight, or no outlines;
   - flat fills with subtle grain;
   - bold silhouettes built from basic shapes;
   - no photographic texture.
2. **Two original characters**, used in every video of the series: one explains, one asks the child's question. Design
   them ourselves. Do not resemble Kurzgesagt's birds, countryballs or any existing character.
3. **AI makes parts, code makes the film.**
   - Generate each character and prop as separate layers from a fixed reference sheet.
   - Rig and animate them in Remotion or GSAP.
   - Step character motion at 12 fps and keep camera moves smooth.
4. **All type, labels and numbers are set in code**, never generated inside an image.
5. **One metaphor per video**, chosen at the sketch stage and carried to the end.
6. **Evidence beats stay real.** When a number or document appears, cut to look A with the source on screen (CLAUDE.md).
   Cartoon scenes carry an on-screen "illustration" label.
7. **A human voice if we can.** The cartoon look and a synthetic voice together are the profile YouTube's detector flags.
   This is the Short where a human narrator matters most.

**Tools for B**
- **Today:** only MiniMax image-01 is wired in (`scripts/gen_images.py`).
- **Candidates, each needing AK's decision and a key:**
  - Recraft V4 for real SVG paths: about $0.08 an image, paid plan for commercial use (secondary source).
  - Nano Banana Pro or gpt-image-2 with a reference sheet for consistent characters: about $0.05–0.21 an image.
- **Avoid fully AI-generated video.** It costs $315–750 per finished minute (vendor), and it is the profile being removed.

## 3. "Explain like I'm 5" script rules

1. **Start with the difficulty, then the answer.** "I wanted people to understand why this is so difficult before they saw
   the result" (Fong).
2. **A useful simplification, written down.** Kurzgesagt calls it "lies to children" and lists every simplification in a
   sources document. We do the same in the description.
3. **One metaphor, carried through.** Characters stand for abstract things: the RBI is a tap, inflation is a leak.
4. **Show, don't name.** Put the thing on screen instead of listing it (TED-Ed).
5. **The asker voices the viewer.** Explaining to an outsider ("…for Americans", "…to a 5-year-old") gives permission to be
   simple without talking down to adults.
6. **A 12-year-old's words**, numbers the way people say them, and every term defined on screen in three words
   (SHORTS_FORMAT.md, section 3).
7. **Have someone mark "I was confused here"** before the build (Fong's practice).

## 4. The trend desk

**Daily routine** (the researcher's proposal; adjust the times)

| Time | Step |
| --- | --- |
| 08:30 | A script polls the feeds below; one manual look at X and YouTube. |
| 08:45 | Shortlist five topics; run the 10-minute check on the top three. |
| 09:15 | One owner decides go or no-go. |
| 09:15–10:00 | Verify against primary documents; fill the source sheet. |
| 10:00–14:00 | Write the Short as its own loop script, build from our looks, run `scripts/shorts_check.py`, publish. |
| 18:00 | Second sweep. If the topic is still rising, start the 3–6 minute version for the next day. |
| Weekly | Compare 7-day and 30-day views of trend videos against evergreen ones. |

**Feeds a script can poll** (each returned HTTP 200 from the cloud container on 11 Nov 2026)
- Google Trends, Trending Now, India: `https://trends.google.com/trending/rss?geo=IN`
- Google News, India: `https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en`
- RBI press releases: `https://www.rbi.org.in/pressreleases_rss.xml`
- SEBI: `https://www.sebi.gov.in/sebirss.xml`
- PIB: `https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3`
- Reddit r/india, top of the day: `https://www.reddit.com/r/india/top/.rss?t=day`
- vidIQ (connected to the cloud session, 5 credits a call): trending videos by views per hour, and outliers against a
  channel's average.

**The 10-minute check.** Score each 0–2:
1. **Slope:** in Trending Now and on at least two other signals.
2. **Fit:** belongs to one of our series.
3. **Gap:** fewer than three good explainers in our language in the last 48 hours.
4. **Shelf life:** the question will still be asked in 30 days, or the event recurs.
5. **Edge:** we hold a primary document, number or map nobody has shown.

**Go only if all four hold:**
- The score is 7 or more, with no zero on fit.
- Two primary sources are in hand.
- No red flag: a named person accused, speculation on a pending case, a stock's recent prices, a poll within 48 hours.
- The Short can ship within 24 hours.

**Always pair the trend with an evergreen question.** The title is the durable question ("How does the RBI set the repo
rate?"). The news peg goes in the first line and the cover. The Short carries the peg; the long video explains the
mechanism.

## 5. Risks to design around

- **Inauthentic content (YouTube).** Templated, mass-produced AI content loses monetisation channel-wide. Recurring
  characters are fine when each video has "a distinct storyline, focus, or concept" (support.google.com/youtube/answer/1311392).
- **AI disclosure.** YouTube does not require a label for non-realistic AI content. India's amended IT Rules (in force
  20 Feb 2026) require labels on realistic synthetic content (secondary).
- **"Made for kids".** A cartoon style alone is not the test, but kids-coded topics and characters raise the risk. Our
  characters and topics must read as adult: money, maps, law. Mark every upload "not made for kids".
- **SEBI.** A May 2026 circular, effective 1 Jul 2026, is reported to set a 30-day lag on price data in educational
  content and to bar security-specific calls by unregistered educators (secondary; the circular itself was not read).
  **Verify it, then update rule O5 in SHORTS_RULES.md, which still says three months.**
- **Copyright.** Own graphics, public documents and licensed photos are safe. Short news clips may be fair dealing in
  India, but the cases are unsettled (ANI v Mohak Mangal was pending at last report).
- **Defamation and contempt.** No named accusations and no comment on a pending case beyond what the record says.
- **Style copying.** A general look is not protected; specific characters, artwork, footage, music and logos are (US
  Copyright Office FAQ; Indian law not checked). We take the principles, not the characters or the palette.

## 6. Not verified

- Process details for Think School, Mohak Mangal, StudyIQ, Polymatter, Wendover and RealLifeLore: no primary source found.
- Flicker and drift of AI image-to-video on flat cartoon art: no test found.
- Hours per video for the code-animated cartoon route: our estimate is 2–4 days of setup, then 4–8 hours a Short.
- Hindi-versus-English performance of animated explainers: vidIQ does not index Hindi Shorts.
- Commercial-use terms of the image models: secondary sources only. Read the terms before buying.

## 7. Built so far (11 Nov 2026)

**The look B pilot: `hyperframes/shorts/dk-hundred/`** (Data Kadai, series "Kadai Kanakku": "You pay ₹100 at DMart.
DMart keeps ₹5.62").
- Two original characters, drawn as vector shapes in the page, no generated images: Anna the shopkeeper explains,
  Thambi the customer asks. Reuse them for every Kadai Kanakku Short; they are the series' faces.
- Style bible, in the page's CSS: paper `#f3ead7`, ink `#1d1a16`, teal `#0e7c66`, marigold `#f2a71b`, brick `#c8431f`,
  wood `#c9965b`. Flat fills, no outlines, hard paper shadows, paper grain. Characters and props move at 12 frames a
  second; type and counters move smoothly.
- One metaphor: ₹100 becomes a hundred one-rupee coins, and the coins leave for labelled trays. The number of coins
  left counts down on the board, and the reveal lands in the same spot.
- The evidence beat cuts to a paper card with the reported sales figure and its source. The disclaimer and the source
  line stay on screen throughout.
- Script: ten short turns, the child asks and the shopkeeper answers, about 100 words, a loop ending.
  `shorts_build.py` now takes a speaker per beat (fourth item of the beat) and a `cast` of voice tweaks per speaker.
- Voice: MiniMax has one Indian-accent English voice, so both characters use it at different pitch. This is the
  weakest part of the pilot. Record two people, or two local voices, before publishing.
- Build: `shorts_build.py story dk-hundred`, `verify`, `check`, `hf.py render dk-hundred`, `mux`, `kit`.

**The trend desk script: `scripts/trend_desk.py`.** Run it at 08:30 and 18:00. It polls the feeds in section 4, counts
signals for each trending search, guesses the channel, marks red flags, lists the day's RBI, SEBI and PIB releases,
and writes `out/trend/<date>.md`. It fills only slope and fit; the owner scores gap, shelf life and edge and applies
the go rule. Limits found on the first run: Reddit refused the request (HTTP 429) from the cloud, and trends in
Indian languages match only through a short keyword list.
