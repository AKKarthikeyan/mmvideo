# Shorts and Reels rules, all channels

**AK asked for these on 10 Nov 2026**, starting from a Gemini deep-research report. Every claim in that report was checked
against primary sources; the verdicts are in [`SHORTS_FACTCHECK.md`](SHORTS_FACTCHECK.md). The rules apply to Moat & Margin,
Moat Atlas, Indica Atlas, Data Kadai and The Inventor Desk, on YouTube Shorts and Instagram Reels.

**What to make, and how, is in [`SHORTS_FORMAT.md`](SHORTS_FORMAT.md) (the Reveal Loop), built on our own study of
5,538 Shorts in our genres ([`SHORTS_STUDY.md`](SHORTS_STUDY.md)).** This file holds the rules every Short must meet.

Each rule carries its basis: **[Official]** YouTube or Instagram says so · **[Data]** a large published dataset (vendor
studies, directional) · **[Science]** peer-reviewed research · **[House]** AK's formula or our own results · **[Judgement]**
our call, to revisit with our numbers.

## 0. The 1M goal, honestly

No rule set makes every Short reach 1M. In the largest recent dataset (vidIQ, July 2026, 367k new channels) the median Short
had about 1.3k views after 30 days and 21% reached 10k. Nobody publishes the share that reaches 1M; it is well under 1% of
uploads. Even big channels in our niches hit 1M on a minority of uploads. **[Data]**

So 1M is the target for **every** Short, and the system is built to raise the hit rate, Short by Short:

1. Every Short is built to the rules below and passes `scripts/shorts_check.py` before it is rendered.
2. Every Short is read at 48 hours (section 7) and the lesson goes into the next one.
3. Each channel tracks three hit rates over its last 20 Shorts: share over **10k**, over **100k**, over **1M**. A rule
   change is judged by whether these move, never by one Short.
4. A format is judged after 30 or more uploads, not 3. **[Data]**

Since 31 Mar 2025 a public Shorts view counts on the first frame, replays included (from 24 Aug 2026, all formats). "1M" is
therefore easier to reach than it was, and it is not what pays: YouTube pays on **engaged views**. We report both. **[Official]**

## 1. What gets a Short to 1M: topic first

Packaging and editing raise the hit rate. The size of the audience who cares about the topic sets the ceiling. **[Judgement]**

- **T1 Broad subject, specific finding.** Lead with names an ordinary Indian viewer knows (Maruti, Tata, DMart, UPI, gold,
  rail, monsoon, phones, a state, a city). A small-cap only works when the finding itself is a shock.
- **T2 One idea per Short.** One surprising number or one turn, said in one line. If it needs a second idea, make two Shorts. **[House]**
- **T3 The viewer must care within one line.** Their money, their city, their phone, their bill, something they use every day.
- **T4 Every topic gets a one-line "why would a stranger send this to a friend?"** before scripting. Sends are Instagram's
  strongest signal for reaching people who don't follow us. **[Official]** No good answer, no Short.

## 2. Hard rules: `shorts_check.py` fails the Short

Run `python3 scripts/shorts_check.py <id>` after the build (`--all --summary` for every Short). **Fix every FAIL before rendering.**

| Rule | What | Basis |
| --- | --- | --- |
| H1 | Length 15–60 s. Never over 60 s with any music or clip that Content ID could claim: over 1 min, a claim blocks the Short worldwide. | [Official] |
| H2 | The voice starts on frame 1. No dead air, no logo, no title card first. | [Official] hook in the first seconds |
| H3 | Hook text on screen by 0.5 s. First spoken sentence ends by 4 s, in 14 words or fewer. | [Official], [Data] first 1.5–3 s decide |
| H4 | The picture changes at least every 4 s: a new scene, or a new element landing on the spoken word. | [Data], [Science] cuts trigger orienting |
| H5 | Pace 130–200 words a minute. | [House] |
| H6 | One idea: at most 10 beats and 140 words. | [House] |

What the gate found on 10 Nov 2026: **80 of our 88 Shorts fail**, 78 of them on H4. They are cut-downs that lift 2–4
long-video beats of 12–20 s each, so one picture sits for 15 s. The eight that pass are all in AK's loop format
(`autoq2s`, `dmartq2s`, `fcnrs`, `jewels`, `persistents`, `shyams`, `tcsq2s`).
**Rule: no more cut-downs. Every Short is written as its own script in the loop format (`K(...)` kinetic beats plus `T(...)`
evidence beats, `loop=True`), from the same verified numbers as the long video.** **[House]**

## 3. The beat structure (24–38 s default; the full beat sheet is in SHORTS_FORMAT.md)

Built on AK's Shorts formula of 1 Oct 2026. Sentence = scene.

Frame 1 is the subject itself, never text on a plain background (S8 in `shorts_check.py`; study finding 5).

| Time | Job | How |
| --- | --- | --- |
| 0–2 s | **Stop the thumb** | One line with a concrete number or contrast, and the same words big on screen. The visual is already moving on frame 1 (counter running, map zooming, document sliding in). |
| 2–8 s | **Open the loop** | A question the viewer now needs answered: "So is Bajaj losing?" The answer is held back. |
| 8–25 s | **Evidence, one hit every 3–6 s** | Each beat answers a small question and opens the next ("Here's what most people miss.", "But look inside that number."). Real document, real chart, source line on screen. |
| last 20–30 % | **The turn** | The payoff beats the expectation the hook set: the number flips, or the obvious reading turns out wrong. |
| last line | **Loop back** | The last line runs into the first ("…which matters more? Because" → "TVS grew 24%…"). No end card, no "subscribe", no "thanks for watching". |

- **S-length** 24–38 s for objects, money splits and single numbers; 45–60 s for maps and geopolitics, only when every
  extra beat is a new picture and a new turn. Winners in our study: Zack D. Films 24–38 s, Hoyos about 34 s,
  RealLifeLore and Johnny Harris 50–60 s. **[Data]** `shorts_check.py` warns outside 20–45 s; a map Short up to 60 s may
  keep that WARN with the reason in the script comment.
- **S-question** an open question by 8 s. **[Science]** curiosity is an information gap (Loewenstein 1994).
- **S-turn** the last 30 % holds a number, a "but", or the reveal. **[Science]** reward prediction error: a surprise registers, a
  predictable payoff does not. **[Judgement]** as an editing rule.
- **S-loop** `loop=True` and the last line ends on a connector. No platform confirms loops are rewarded; replays do count as
  views. **[House]**
- **S-hold** aim for a picture change every 3 s.

## 4. Picture, captions, sound

- **P1 Captions burned in**, big and in the safe area, word groups of 2–5, the key number in the accent colour.
  Many people watch with the sound off. **[Official]**
- **P2 Related cuts, not random cuts.** Cut on the spoken word, and keep each new picture tied to what is being said.
  Related cuts hold attention and memory; unrelated cuts cost both (Lang 1993, 2000). Pace without randomness. **[Science]**
- **P3 Safe area.** Keep text out of the bottom ~20 % (caption and buttons) and the right ~12 % (like/share rail), on both
  platforms.
- **P4 Source on screen** on every evidence beat (CLAUDE.md). Anything illustrative is labelled on screen as illustrative.
- **P5 Sound.** Our own or licensed music only, ducked under the voice, and no copyright-claimable track in any Short over 60 s.
- **P6 Premium visuals.** For a map, satellite, scale, document or money beat, start from the matching HyperFrames sample
  (`hyperframes/README.md`). A visual nobody else has is our moat against "templated" and lookalike Shorts.

## 5. Originality, AI and policy (the risks that can cost a channel)

- **O1 YouTube inauthentic-content policy (15 Jul 2025)** is judged **channel-wide** and decides monetisation. It names
  "templated storylines", "image slideshows or scrolling text with minimal or no narrative", and "AI-generated content made
  with generic or unoriginal templates giving the impression of mass production". Since 1 Oct 2026, Shorts ranking also
  favours originals over re-uploads and template-based bulk edits. **[Official]** So:
  - every Short has its own script, its own finding and its own analysis, never a template filled with new numbers;
  - videos built from one generator (for example `hyperframes/videos/` export stories) need a distinct story, scene order and
    narration each; never publish a batch that differs only in the commodity name;
  - the TTS reads only our own script, never someone else's text read out ("readings of other materials" is named).
- **O2 AI disclosure.** YouTube requires the "altered or synthetic" label only for **realistic** synthetic people, events or
  places, and for AI music. Our TTS narrator, charts and animation don't need it. Any AI picture of a real place, person or
  event that could pass as real does need it, and it also carries an on-screen "illustrative" label. **[Official]**
- **O3 Instagram originality.** No other app's watermark (our own logo is fine). Don't repost our own Reel as a new Reel.
  Instagram demotes reposts and aggregators, photos and carousels included since 30 Apr 2026. **[Official]**
- **O4 No re-uploading a Short to re-roll it.** YouTube treats it as possible spam. A new edit counts as new only if the
  hook, script and pictures are actually new. **[Official]**
- **O5 Finance (Moat & Margin, and any money topic on the other channels).** No price data from the last three months used
  to suggest where a price goes. No buy, sell or target language. Disclaimer on screen ("Educational research, not
  investment advice · not SEBI-registered"; the loop engine adds it). Our own calculations carry "our arithmetic". SEBI
  circular, 29 Jan 2025. **[Official]**
- **O6 No bait.** The hook must be paid off in the Short. YouTube weighs viewer satisfaction, and a hook that lies trains
  the audience to swipe. We build curiosity and payoff, not compulsion: the addiction studies in the Gemini report describe
  harms to viewers, not methods for us. **[Official] [Judgement]**

## 6. Packaging and posting

- **K1 Title** at most 50 characters, the hook in different words, with the name and the number: "TVS +24%, Bajaj +1.8%:
  same quarter".
- **K2 Hashtags** 0–2, only where they name the topic. Shorts with hashtags averaged ~10% fewer views (Metricool 2026,
  correlation). **[Data]**
- **K3 YouTube Related video**: every Short links to its long video or the closest one, set by hand in desktop Studio.
  The API can't set it. **[Official]**
- **K4 Instagram**: post natively from a clean master (no YouTube marks). Use **Trial Reels** (shown to non-followers
  first) to test a second hook on the same story when the topic is big. Reel captions can't carry clickable links: point to
  the bio. **[Official]**
- **K5 Cadence** 2–5 Shorts a week per channel. YouTube says posting volume is neither rewarded nor penalised;
  2–4 a week had the best views per post (Metricool). Quality over count. **[Official] [Data]**
- **K6 Language.** Hindi and regional languages were ~85% of India's short-video consumption in 2022 (EY). English Shorts
  reach the smallest slice of India. Auto-dubbing (all creators since Feb 2026) is not confirmed for Shorts: check one in
  Studio → Languages before relying on it. Native Hindi and Tamil Shorts (a separate script and voice, not a dub) are the
  biggest untested lever for reach. **AK's call** whether they are new uploads on our channels or separate channels. **[Data] [Judgement]**

## 7. The 48-hour read

At 48 hours (not hour one), compare each Short with the **median of that channel's last 10 Shorts**. YouTube publishes no
"viewed vs swiped" threshold (the 60 % / 70 % figures are creator lore from a 2023 sample), so the benchmark is our own median.

| Pattern | Diagnosis | Fix in the next Short |
| --- | --- | --- |
| "Chose to view" below our median, good retention | The hook failed; the story was fine | Lead with the payoff number or the moving visual on frame 1; cut setup |
| "Chose to view" good, retention drops early | The middle stalled | Find the second it drops; cut the slow beat; open a new question there |
| Good to the end, few replays or shares | The payoff was predictable | A sharper turn in the last 30 %; a tighter loop line |
| Many views, few engaged views | Viewers bail in the first seconds | Remove the mismatch between the first frame and the first line |
| Strong Short, no lift to the long video | No bridge | Set the Related video; end on the question the long video answers |

Log each Short in the channel's sheet: date, id, length, hook line, structure, views, engaged views, chose-to-view %, APV,
shares, subscribers, the diagnosis, and the change made in the next one.

## 8. Channel notes

| Channel | Topics that travel | Hook pattern | Visual |
| --- | --- | --- | --- |
| **Moat & Margin** | Household names and filing surprises: one company's number vs a rival's, a deal vs its own plan, a record with a catch | "X grew 24%. Y? 1.8." · "Signed for ₹50,000 crore. Its own plan? ₹9,500." | The filing itself (clip), counters, league tables; source line always; O5 disclaimer |
| **Moat Atlas** | Places and infrastructure changing: airports, ports, plants, mines, cities, seen from space | "This was farmland in 2018." | Satellite before/after (s01), terrain (s02); first frame already wiping |
| **Indica Atlas** | India's geography and trade: where things grow, leave and go; rivers, monsoon, borders | "Two-thirds of India's chicken exports leave from two ports." | Map already zooming on frame 1; exit-port map; wind map (s06) |
| **Data Kadai** | Everyday numbers at a scale that shocks: prices, exports, population, cities | "₹1 lakh crore in ₹500 notes reaches 200 km." | Scale zoom (s12), dot regroup (s05), money breakdown (s04) |
| **The Inventor Desk** | The story behind an everyday object: an accident, a rival, a lost patent | "The man who invented this never earned a rupee from it." | Patent drawing (s13), exploded object (s08), timeline (s11); AI pictures labelled "illustrative" |

From 1 Feb 2027, an existing YPP channel needs **10M qualified Shorts views in the last 90 days** to earn any Shorts revenue,
and a new channel needs 20M Shorts views (or 8,000 watch hours) to join. Five channels split five ways may each miss that
line. **AK's call** whether to concentrate Shorts on fewer channels. **[Official]**

## 9. Checklist before a Short is rendered

1. Topic passes T1–T4, and the send-to-a-friend line is written in the script comment.
2. Native loop script, one idea, every number verified, a source on every evidence beat.
3. `python3 scripts/shorts_check.py <id>`: no FAIL; each WARN fixed or its reason written in the script comment.
4. The O1–O6 policy checks pass; finance Shorts carry the disclaimer.
5. Title at most 50 characters, 0–2 hashtags, Related video set, clean Instagram master.
6. A 48-hour read is due in the log.
