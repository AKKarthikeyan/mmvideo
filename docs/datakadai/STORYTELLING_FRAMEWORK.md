# Data Kadai: data storytelling framework and the 7 story types

Written 11 Oct 2026 from three talks AK chose as reference. What the speakers said is marked by source; the combined
framework and the list of seven types are our own synthesis for Data Kadai, not something any of the talks states.

| Ref | Talk | Speakers | Link |
| --- | --- | --- | --- |
| VC1 | Numbers to Narratives, Part 1 (the why), 25 Sep 2025 | Jeff Desjardins, Lindsay Christensen (Visual Capitalist), April Rudin | https://youtu.be/9wF_ejAI22I |
| VC2 | Numbers to Narratives, Part 2 (the how), 25 Sep 2025 | same | https://youtu.be/li7Nh5tA7Zs |
| SWD | Storytelling with Data, Talks at Google, 11 Nov 2015 | Cole Nussbaumer Knaflic | https://youtu.be/8EMW7io4rSI |

## What the talks teach

**Visual Capitalist (VC1, VC2)**
- A data story needs three things together: the data, the visual and the narrative. Any two without the third is weaker
  (their Lego picture: bricks, sorted bricks, arranged bricks, and only then a house).
- The two currencies online are attention and trust, an idea they credit to Seth Godin. You can trade one for the other,
  and trading trust for clicks is the expensive mistake. Data storytelling is the rare format that earns both.
- Trust comes from showing rather than telling: visible sources, neutral headlines, no spin, no selling.
- Right-size the piece. Long infographics belonged to the desktop era; now one insight per visual, made in a day. A
  short piece is the trailer that sends people to the full report.
- Six techniques from their own work: make something worth exploring; use colour to tell the story; create an "aha"
  moment (unexpected value); have one clear takeaway and point at it; paint a picture by being literal; be memorable.

**Cole Nussbaumer Knaflic (SWD)**
- Start with context: who the audience is and what you want them to know or do, before making any chart.
- Exploring data and explaining data are different jobs. Show the audience only the explained result.
- Her lessons in order: understand the context, choose an appropriate visual, eliminate clutter, focus attention,
  think like a designer, tell a story.
- People see before they think. Colour, size and position pull the eye in a fraction of a second, so use them
  sparingly and on purpose: push detail to the background and make the one point pop.
- Facts on a slide are forgotten; a story with a plot, a twist and an ending is remembered, and repetition moves it
  into long-term memory. End with a clear call to action.

## The framework we will use: the KADAI check

One pass, in this order, for every Short, chart post and caption. The first two steps happen before any design.

| Step | Question | Rule for Data Kadai | From |
| --- | --- | --- | --- |
| **K**now the viewer and the one point | Who is this for, and what single sentence should they repeat tomorrow? | Write that sentence first. If it needs "and", it is two Shorts. | SWD context; VC2 clear takeaway |
| **A**ha number | What will surprise them? | Lead with the unexpected figure or gap, not the topic. No surprise, no Short. | VC2 aha moment |
| **D**irect the eye | Where should they look in the first second? | One accent colour on the answer; everything else muted. Strip anything that is not data. Text never sits on the map. | SWD clutter and attention; VC2 colour |
| **A**rc | What is the plot, the twist and the ending? | Hook (0-3 s) → build → reveal or twist → what it means → question back to the viewer. Say the key number twice. | SWD story and repetition |
| **I**ntegrity | Would the publisher of the data agree with every word? | Original source named, period and unit stated, neutral wording, no #1 claim on a thin lead, nothing implied that the data does not show. | VC1 attention and trust; VC2 show, not tell |

Why this one: Knaflic's lessons are the best method for building a single clear visual, and Visual Capitalist's
attention-and-trust idea is the best test of whether that visual deserves to be published. KADAI keeps both and is
short enough to run on a daily Short. If a draft fails K or I, it is not made; if it fails A, D or A, it is reworked.

## The 7 types of data story

Each type answers a different question. Pick the type from the shape of the data, then the template. Examples use
numbers already in the repo; each must be re-checked against its source before use.

| # | Type | The question it answers | Use when the data has | Example | Template |
| --- | --- | --- | --- | --- | --- |
| 1 | **The Outlier** | Who is nothing like the rest? | One value far from all others | Homes where a woman owns a house or land: Meghalaya 65.3%, India 18.8% (NFHS-6) | Guess the State (built) |
| 2 | **The Ranking** | Who is first, who is last? | A clear order with real gaps between places | Villages with no mobile signal: Odisha 1,177, Arunachal Pradesh 1,176, Madhya Pradesh 930 (DoT, Feb 2026) | Ranking: league table of every state (built) |
| 3 | **The Change** | What moved, and how fast? | Two or more points in time | Women who have used the internet, India: 33.3% → 64.3% in four years (NFHS-5 to NFHS-6) | Change: before-and-after for every state (built) |
| 4 | **The Face-off** | Which of two is ahead, and by how much? | Two comparable things: states, sexes, village and city | Men who have used the internet 80.5%, women 64.3% (NFHS-6) | Face-off: two bars, then the gap for every state (built) |
| 5 | **The Map** | Where is it concentrated? | A value for every state, with a regional pattern | Five states hold 4,903 of India's 8,748 uncovered villages | Mapped (built) |
| 6 | **The Breakdown** | What is the whole made of? | Parts that add up to a total | How India gets to work: two-wheeler 42.6%, walking 28.3%, bus 6.7%, car 3.0% (NSO travel survey) | Breakdown: 100-square grid (built) |
| 7 | **The Myth-buster** | What does everyone believe that the data does not support? | A result that contradicts a common assumption, or two facts that seem to clash | Highest share of women married before 18 is West Bengal (36.4%), not Bihar (34.6%) (NFHS-6) | Myth-buster: the usual guess, then the full league table (built) |

Two tools that work inside any type, both from VC2:
- **Scale made literal.** Turn a number into something a person can picture: "1 in 5 villages in Arunachal Pradesh",
  not "19.6%".
- **Worth exploring.** A dense chart post (every state labelled) to go with the Short, for viewers who want to find
  their own state.

## How to choose

1. Is one value wildly different? → Outlier.
2. Is there a time series? → Change.
3. Does it contradict what people assume? → Myth-buster (strongest for sharing, but the Integrity check is strictest here).
4. Do the parts add to a whole? → Breakdown.
5. Is it two things head to head? → Face-off.
6. Is there a value for every state? → Map if the pattern is regional, Ranking if the order is the story.

Rotate types through the week so the channel does not look templated (AK's rule, 10 Oct 2026).

## Templates (built 11 Oct 2026)
All seven types now have a template. Types 2, 3, 4, 6 and 7 share one file, `src/datayt/DataStory.tsx`, built by
`scripts/datayt/build_story.py` from one config per story in `public/datayt/stories/configs/`. Sample stories:
`rank01` (unemployment rate, PLFS 2025), `chg01` (women online, NFHS-5 to NFHS-6), `face01` (women vs men online),
`brk01` (how India gets to work), `myth01` (men who drink: not Goa). Every one shows all states or all parts, and
keeps the header, chart and caption in separate strips. The builder refuses a #1 claim with a lead under 1 point and
a "myth" answer that is actually in the top three.
