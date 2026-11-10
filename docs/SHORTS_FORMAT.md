# The Reveal Loop: our blockbuster Shorts format

**AK, 10 Nov 2026.** This is the one format every Short on every channel is built in. It comes from our study of 5,538
Shorts on 28 channels in our genres ([`SHORTS_STUDY.md`](SHORTS_STUDY.md)), from creators who average 10M+ views per Short,
and from the checked platform facts in [`SHORTS_RULES.md`](SHORTS_RULES.md). Those rules and `scripts/shorts_check.py` still
apply. This document says what to make and how.

**The format in one line: open on something the viewer already knows, show the thing they don't, in pictures, and end on a
line that runs back into the first.**

## 1. The topic test (before any script)

Our study found topic is the lever. A channel's best Short gets about 25× its median; title wording adds at most 1.3×.
Every Short must pass all three tests. One "no" and it is not a Short; it may be a long video.

| Test | Question | Pass | Fail |
| --- | --- | --- | --- |
| **Familiar** | Would a 15-year-old in Madurai or Kanpur recognise the subject in one second, with the sound off? | DMart, a Bajaj bike, your phone, a ₹500 note, a plug, Chennai, the monsoon | "AMC distributor commissions", "MoU", "M&HCV", a company most people haven't heard of |
| **Hidden** | Is there one number, mechanism or correction they don't know and can't guess? | "DMart keeps ₹5.62 of your ₹100." · "Bajaj sells more bikes abroad than in India." | "Revenue grew 12 %." (expected) · "The order is complex." (no answer) |
| **Send** | Would someone forward it with "did you know this?" | They'd tell a friend at tea | Only an investor would care |

A company filing passes when the filing is the hidden answer to something familiar. Don't make "Shyam Metalics signed a
₹50,000 crore MoU." Make "Their own plan is ₹9,500 crore. They just signed for five times that." It's better still if the
viewer meets the product before they meet the company name.

## 2. The beat sheet (RL-30: 24–38 s, 65–100 words)

| Time | Beat | What happens | Checked by |
| --- | --- | --- | --- |
| **0.0–1.5 s** | **Visual hook** | Frame 1 is the subject itself, full-frame and already moving: the ₹100 note being cut, the satellite image wiping, the map zooming, the plug pushing in. Overlay of 3–6 words that make sense on mute. The voice names the subject and opens the gap in one line of 12 words or fewer. Picture, words and overlay say **one** thing. | H2, H3, S8 |
| **1.5–5 s** | **Foreshadow** | Close off the obvious guess ("Not thirty. Not twenty.") or raise the stakes. The viewer now has a question. | S2 |
| **5–22 s** | **But / therefore chain** | 3–4 steps toward the answer. Each step is a new picture (every 2–3 s, cut on the spoken word) and ends with a turn: "But…", "So…", "And here's the catch." Never "and then". One number per step at most. | H4, S6 |
| **22–32 s** | **Reveal** | The answer, as the biggest visual moment: the counter landing, the wipe completing, the zoom into the last ₹5.62. It must beat what the viewer guessed at 0:05. | S4 |
| **last 1–2 s** | **Loop line** | A last line that grammatically runs into the first. Cut hard, with no end card, no "subscribe" and no "follow for more". | S3 |

Length by genre:
- **24–38 s** for objects, money splits and single numbers (Zack D. Films 24–38 s; Hoyos's best about 34 s).
- **45–60 s** for maps and geopolitics, but only when every extra beat is a new picture and a new turn (RealLifeLore and
  Johnny Harris winners run 50–60 s).
- Never over 60 s with any music.

## 3. Writing the script

1. **Write the last line first**, then the first line it loops into, then the middle.
2. **One subject, one question, one answer.** Two ideas make two Shorts.
3. **Read-aloud level of a 12-year-old.** Short words, short sentences, numbers said the way people say them ("almost
   eighty six rupees", "five and a half times"). Define any term on screen in three words, or don't use it.
4. **Indian units, viewer's scale.** Rupees, crore and lakh; "per ₹100 you spend"; "days of work"; "the length of Chennai to
   Madurai". Convert big numbers to something the viewer can picture.
5. **Turns, not lists.** Each beat ends on "but", "so", "and that's the catch", or a question.
6. **Every number is verified, with its source on screen.** "Our arithmetic" goes on anything we computed. Anything
   illustrative is labelled "illustrative" on screen (CLAUDE.md).
7. **Mark the loop** in the script with `loop=True`. The last beat ends on a connector (`Because`, `that`, a comma).
8. **The send line.** Write it in the script comment: "People forward this because ____."

## 4. The picture

- **Frame 1 is never text on a plain background.** It is the subject itself: a HyperFrames sample (satellite, map, money,
  scale, exploded object, patent drawing), a real document filling the frame, a real photo with depth, or a counter
  already running over the real picture. In our study, none of the top Shorts' cover images opened on plain text.
- **Full-frame.** One subject that fills the frame. No small chart floating in white space.
- **Captions** of 2–4 words each, burned in the middle-lower third (about 60–72 % of the height), the key number in the
  channel's accent colour. They must clear the bottom ~20 % and right ~12 % UI.
- **Source line** small at the top, from the beat it applies to.
- **Cuts land on the spoken word or the music beat**, and each cut relates to the line being said. Related cuts hold
  attention; random ones cost it.
- **One accent colour per channel**, the same on every Short, so the feed learns our look.

## 5. Sound and voice

- **Voice from frame 1.** Our own music bed, low under the voice, with cuts on its beat. No trending tracks: the voice
  carries the Short, and claimable music blocks anything over 60 s.
- **AI voice costs about 7 % of shares** in the only large study (21,541 TikTok videos). Shares are what reach
  non-followers on Instagram. **Test:** for one channel, voice 10 Shorts with a human narrator and 10 with our TTS in the
  same format, then compare shares per 1,000 views. If the human voice wins clearly, flagship Shorts get a human voice.
  AK's call on who narrates.

## 6. Series: the recurring promise

Winners repeat a named promise; viewers learn what they'll get, and the label goes in the title. Each channel runs 2–3
series, all in the Reveal Loop.

| Channel | Series | The promise | Title template |
| --- | --- | --- | --- |
| **Moat & Margin** | **Follow the ₹100** | Where your ₹100 goes inside a brand you use | "You spend ₹100 at [brand]. It keeps ₹[x]" |
| | **Same Quarter** | Two rivals, same three months, opposite results | "[A] +24%, [B] +1.8%: same quarter" |
| | **The Catch** | A record or big number with a catch in the filing | "[Company]'s record month has a catch" |
| **Moat Atlas** | **From Orbit** | The same place from space, then and now | "This was open land in 2018" |
| | **Megabuild** | A giant Indian project in one verb | "India is [verb]ing a [thing]" |
| **Indica Atlas** | **Not Where You Think** | A map belief, corrected | "[Place] is WAY further [x] than you think" |
| | **Leaves From** | Where an everyday Indian product leaves the country, and who buys it | "Two-thirds of India's [x] leaves from two ports" |
| **Data Kadai** | **Days of Work** | A price measured in days of an average wage | "How many days of work is a [thing]?" |
| | **In ₹500 Notes** | A big number made physical | "₹[x] in ₹500 notes reaches [distance]" |
| | **In Your Pocket** | India's trade story told through an object you own | "India exports ₹3 lakh crore of this" |
| **The Inventor Desk** | **Why It's Shaped Like That** | The hidden reason behind an everyday Indian object | "Why the third pin on your plug is bigger" |
| | **Patent Files** | The original drawing of something you use, drawn on screen | "The first [x] looked like this" |

Titles are at most 50 characters and carry the name plus the number or claim, with 0–2 hashtags (rules K1–K2). An emoji is
optional: in our study it made no difference.

## 7. Five worked scripts

Each one passes the topic test. The numbers come from data already verified in this repo, unless marked **VERIFY** (we
don't have the source yet: confirm before building). All of them are drafts for AK.

**Moat & Margin · Follow the ₹100 · "You spend ₹100 at DMart. It keeps ₹5.62"** (≈ 28 s, 74 words)
Data: DMart results 10 Oct 2026, Jul–Sep 2026; split is our arithmetic (`hyperframes/samples/s04-money`).
Visual: s04 money breakdown, the ₹100 note already being cut on frame 1.
```
[0.0] You spend a hundred rupees at DMart.                 ₹100 AT DMART
[1.9] How much does DMart keep?                             DMART KEEPS?
[3.4] Not thirty. Not twenty.                               (wrong guesses struck out)
[5.0] Almost eighty six rupees goes straight back,
      to pay for the goods.                                 GOODS ≈ ₹86  (the big slab slides off)
[9.6] Then staff. Rent. Power. Wear and tear. Interest.     (each piece peels off on its word)
[14.5] So what's left?                                      WHAT'S LEFT?
[16.0] Five rupees, sixty two paise. Before income tax.     zoom into the last sliver · ₹5.62 counter
[20.5] That's how thin the margin is at India's biggest
       supermarket chain by revenue... VERIFY "biggest" or cut the clause
[24.0] And it makes that on every hundred rupees that       → loops to "You spend a hundred rupees at DMart."
SOURCE: DMart results, 10 Oct 2026 · split is our arithmetic · Educational research, not investment advice
SEND LINE: everyone shops at DMart and guesses far too high.
```

**Data Kadai · In Your Pocket · "India exports ₹3 lakh crore of this"** (≈ 30 s, 76 words)
Data: DGCIS via Vonter/india-export-import, FY 2025–26 (`hyperframes/videos/dk-phones/story.js`).
Visual: a phone sliding out of a pocket onto the all-India map, then the exit-port map and the destination arcs.
```
[0.0] India now exports three lakh crore rupees of this.    ₹3 LAKH CRORE
[2.6] It's in your pocket.                                   (phone fills the frame)
[3.8] Phones and telecom gear.
[5.2] Four years ago? Fifty five thousand crore.              FY22 ₹55,126 CR (counter runs up)
[8.4] That's five and a half times bigger.                    5.5×
[10.6] And most of it doesn't go by ship.                     NOT BY SHIP
[12.6] Sixty nine percent flies out of just two airports:
       Chennai and Bengaluru.                                 69% · map lights two airports
[17.6] Who buys it? The USA alone takes fifty eight percent.  USA 58% (arc)
[21.8] Made here, flown from the south, sold in America.
[24.8] Because                                              → loops to "India now exports…"
SOURCE: DGCIS principal commodity data, FY 2025–26 (ODbL mirror Vonter/india-export-import)
SEND LINE: people assume India imports its phones.
```

**Indica Atlas · Leaves From · "Two-thirds of India's poultry exports leave from two ports"** (≈ 27 s, 70 words)
Data: DGCIS, FY 2025–26 (`hyperframes/videos/ia-poultry/story.js`).
Visual: the all-India map already zooming to the south-west coast on frame 1.
```
[0.0] India's poultry exports nearly doubled in one year.   +96% IN A YEAR
[2.8] Guess which port ships the most. Not Mumbai.           NOT MUMBAI (pin on Mumbai fades)
[5.6] Kochi. Forty percent.                                  KOCHI 40%
[7.6] Then Thoothukudi. Twenty six.                          THOOTHUKUDI 26%
[9.8] Two southern ports. Two thirds of it.                  66%
[12.4] Where does it go? The UAE alone takes thirty seven percent.   UAE 37% (arc)
[16.8] Two thousand eight hundred and ten crore rupees, up from fourteen thirty.   ₹2,810 CR ← ₹1,430 CR
[21.6] So next time someone says India's food leaves from Mumbai, show them this.
[25.4] Because                                              → loops to "India's poultry exports…"
SOURCE: DGCIS principal commodity × port × country, FY 2025–26
SEND LINE: Kerala and Tamil Nadu viewers send it to prove their port matters.
```

**Moat Atlas · From Orbit · "This was open land in 2018"** (≈ 20 s; extend only with verified facts)
Data: Copernicus Sentinel-2, Jan 2018 and Jan 2026 (`hyperframes/samples/s01-satellite`).
Visual: s01 wipe, full-frame, starting on 2018.
```
[0.0] In 2018, this was open land outside Mumbai.            JAN 2018
[2.6] Watch.                                                  (wipe begins)
[3.4] January 2026. An international airport.                 JAN 2026
[6.2] That runway alone? About three point seven kilometres.  ≈ 3.7 KM (measured line draws)
[9.6] VERIFY and add 1–2 beats: opening date, passenger capacity, project cost (sources: CIDCO, the operator)
[16.0] Eight years. From open land to this. And in 2018,     → loops to "this was open land…"
SOURCE: Contains modified Copernicus Sentinel data 2018, 2026 · runway length measured on the image (our measurement)
SEND LINE: Mumbai viewers who have flown from it.
```

**The Inventor Desk · Why It's Shaped Like That · "Why the third pin on your plug is bigger"** (≈ 28 s)
Data: **VERIFY all of it** against IS 1293:2019 (BIS) before building. This is the structure, not checked facts.
Visual: s08 exploded-object style, the 3-pin plug pushing into a socket on frame 1, in slow motion.
```
[0.0] Every Indian plug has one pin that's bigger than the other two.   WHY IS THIS PIN BIGGER?
[3.2] It's not for strength.                                   NOT STRENGTH
[4.6] It's the earth pin. And it's longer, so it goes in first,
      and comes out last.                                       (slow-motion insert, earth pin touches first)
[10.0] Why first? If something inside your iron goes wrong,
       the current has somewhere safe to go before you touch it.   (current path glows to earth)
[16.4] And in many sockets, that big pin is the key:
       it opens the shutters for the other two.                  (shutter slides open)  VERIFY
[22.0] So the biggest pin carries no power at all. It's there so  → loops to "every Indian plug…"
SOURCE: Bureau of Indian Standards, IS 1293:2019 · VERIFY clause numbers · animation is illustrative
SEND LINE: everyone has wondered, nobody knows.
```

## 8. Before you publish a Reveal Loop

1. The topic test passes (Familiar, Hidden, Send), and the send line is in the script comment.
2. The beat sheet is followed: the visual is on frame 1, the obvious guess is closed off by 5 s, every step is a turn,
   the reveal beats the guess, and the last line loops.
3. `python3 scripts/shorts_check.py <id>` shows no FAIL, and no WARN on S8 (text-only opener).
4. The series label is in the title. It is at most 50 characters, with 0–2 hashtags.
5. Every number is sourced on screen. Finance Shorts carry the disclaimer. **VERIFY** lines are cleared.
6. After 48 hours, read it against the series' own median (SHORTS_RULES section 7). A series that doesn't beat the channel
   median after 10 Shorts is retired, and a new series takes its slot.
