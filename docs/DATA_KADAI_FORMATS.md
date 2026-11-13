# Data Kadai: interesting ways to present a data story

AK asked on 13 Nov 2026 for the best way to present Data Kadai videos in interesting ways. This is the research and a
recommendation. Nothing here is built yet.

**Evidence used**
- Live YouTube data from vidIQ, pulled 13 Nov 2026: videos that got far more views than their channel normally gets
  ("breakout", shown as a multiple). Six searches, Shorts and long videos.
- Thumbnails of eight of those videos, to confirm what the format looks like. I did not watch the videos themselves.
- Published research on data videos and on how people take in numbers. I read abstracts and summaries, not full papers.

**Read the numbers with care.** Breakout lists show winners only; they say nothing about how many videos in the same
format failed. Treat each format below as a hypothesis to test, not a guarantee.

## 1. The short answer

The data stories that break out do not show a chart and explain it. They turn the number into something the viewer
can **guess, see at real size, find themselves in, or hear**. So the best way to present a Data Kadai video is:

1. **Ask the viewer to guess** before showing anything.
2. **Make the number physical**: coins, notes, the Moon, a cricket ground, days of work.
3. **Put the viewer on the map**: their state, their city, their pay.
4. **Reveal one twist**, with the source on screen.
5. **Loop.**

That is the Reveal Loop we already use (`SHORTS_FORMAT.md`), with three devices made compulsory. Section 4 lists eight
devices to choose from; section 5 says which three to pilot first.

## 2. What is breaking out right now

| Format | What it looks like | Live examples (views · breakout · channel size) |
| --- | --- | --- |
| **Data you can hear** | One line graph draws itself while a tone follows the value. Black screen, a title, a counter. | "If history had sound" 23.8M · 93× · 68K subs; part 2 5.8M · 20×; another channel 3.3M · 27× and 1.5M · 203× · 45K subs; "If life data graphs had sound" 3.7M · 22× · 57K subs |
| **As big as…** | A familiar thing used as the unit: "The Moon fits 5,346 Sikkims". | "Moon vs Rajasthan vs Maharashtra…" 513K · 13× · 3K subs; a second one 379K · 10× in six days; "size comparison of India vs Russia" 1.7M · 299× · 653 subs; "True Scale of Data Storage" 4.4M · 17× (long) |
| **Your state on the map** | States light up one by one on a relief map of India. | "Famous temples across Indian states" 3.5M · 77×; "Majestic temples state by state" 1.1M · 28×; "Famous crops of every Indian state" 868K · 32×; "Indian agriculture state-wise" 746K · 27× |
| **North vs South, state vs country** | Two sides compared number by number. | "North India vs South India: it's not about people" 405K · 211× · 7K subs; "Why is South India ahead of North India?" 309K · 198×; "India vs Vietnam, country comparison" 229K · 70× · 1.6K subs |
| **The map resized** | Countries swell or shrink to match a number. | "Countries resized by population on the world map" 393K · 310× · 9K subs; "The world if countries were sized by McDonald's locations" 211K · 46× · 3.5K subs |
| **The race and the line-up** | Bars overtake each other through the years; or people or things stand in a row by size. | "Who exported the most wheat? 1961–2026" 543K · 25×; "Timeline of Indian Prime Ministers" 7.1M · 664×; "Animal lifespans comparison" 6M · 727× |

Three things stand out.

- **Small channels are winning with format, not fame.** Most of these have under 100,000 subscribers, several under
  10,000.
- **The state-map Shorts carry almost no data.** They list "famous" things. A version with a real number per state,
  and its source, is a gap we can fill.
- **Sound is the newest device.** The "had sound" wave began in August 2026. Later parts from the same channels fall to
  1–5×, so the wave may already be passing.

## 3. What the research says

| Finding | Source | How sure |
| --- | --- | --- |
| People who **predict the data before seeing it** recall and understand it better than people who are just shown it. | Kim, Reinecke and Hullman, CHI 2017, "Explaining the Gap" (best paper award). Summaries quote gains of about 20–30%, measured in different ways. | Strong: a controlled study |
| Re-expressing a measurement **in familiar objects** helps people grasp it. Two ways: put it beside a familiar thing, or use the familiar thing as the unit. | Hullman and others, CHI 2018; an IEEE VIS 2013 paper on "concrete scales". | Strong: controlled studies |
| In data videos, **animation and pictographs** (one icon for a fixed number of things) each change how engaged viewers are. | Amini and others, AVI 2018, "Hooked on Data Videos". I could not read the per-factor results. | Medium |
| **Animated charts are enjoyed more but read less accurately** than still ones. Nobody has tested bar-chart races directly. | Secondary write-ups of a 2008 study and a Microsoft study; Built In, PolicyViz. | Medium: second-hand |
| Bars **built from figures, each standing for 1,000 people**, feel "bigger and weightier" than plain bars. | Neil Halloran on "The Fallen of World War II". | Maker's account, not a study |
| **Props everyone knows** (boxes, a washing machine) carry a statistic better than a slide. | Commentary on Hans Rosling's talks. | Opinion, not a study |

What follows from this: guess-first and familiar units have the best evidence. Motion wins attention but costs
accuracy, so every moving chart should **stop on a still frame with the number written out**.

## 4. Eight devices for Data Kadai

Each is a way to stage one number. A Short uses two or three. Example topics are ideas only; every number needs a
primary source before a script is written.

| # | Device | What the viewer does | We already have | Example topic |
| --- | --- | --- | --- | --- |
| 1 | **Guess first** | Picks an answer in the first three seconds; wrong guesses get struck out | The question mark on the pocket in `dk-pocket`; marker strokes in `paper.js` | "How much of India's exports is phones? 1%? 3%? 8%?" |
| 2 | **Familiar unit** | Sees the number as coins, ₹500 notes, days of work, cricket grounds | Coins in `mm-hundred`; `s12-scale`; the "Days of Work" and "In ₹500 Notes" series | "How many days of work is a new phone?" |
| 3 | **Your state lights up** | Waits for their own state | Atlas map engine, `s15-seatmap`, district shapes | One real number for every state, lit in rank order |
| 4 | **State as big as a country** | Is surprised by a pairing | Atlas and world maps | "Which country has as many people as your state?" |
| 5 | **Hear the data** | Hears the line rise and fall | Nothing yet: needs a tone track made in code | "If India's onion prices had sound" |
| 6 | **Resize the map** | Watches states swell or shrink | `s05-dots` regrouping is close; a circle-per-state version is a small build | "India if states were sized by what they export" |
| 7 | **One icon is N people** | Sees a crowd, not a bar | `s05-dots`; coins | "Out of 100 Indians, how many…" |
| 8 | **Two characters and a prop** | Follows a question and an answer | Anna and Thambi in `mm-hundred`; the paper desk in `dk-pocket` | Any "why" question, counted out on the shop counter |

**Race and line-up** are left out as a main device. The format is crowded with mass-made channels whose like rates are
0.2–0.4%, and YouTube's inauthentic-content policy targets templated uploads. Use a race only as one beat inside a
narrated story.

## 5. What I would pilot first

1. **Guess first + your state lights up.** The strongest research and the clearest gap. One sourced number per state,
   the viewer guesses the top state, the map lights up in rank order, the twist is the state nobody expects.
2. **State as big as a country.** The "Moon vs Rajasthan" Shorts show the appetite, on channels of 3,000 subscribers.
   Our version uses population or output, not just area, with the source on screen.
3. **Hear the data.** One trend-riding Short, made quickly, because the wave is recent and may not last. I cannot hear
   audio, so AK or someone else must check the sound before it is published.

Judge each pilot against the channel's own median, at 7 and 30 days: views, how many viewers stay to the end, and
shares. Three Shorts per device is the minimum to tell a format from a fluke.

## 6. What to avoid

- **A chart with a voice over it.** None of the breakouts look like this.
- **Lists of "famous" things per state** with no number. Popular, but not Data Kadai, and easy for anyone to copy.
- **North-versus-South as a fight.** The comparison draws views, and also draws anger. If we do it, each side gets its
  best number and its worst, with sources, and no verdict.
- **Motion with no still.** Always stop on the number.
- **A number without a unit the viewer owns.** If it cannot be said in coins, days, people or places, pick another
  number.

## 7. Limits of this research

- vidIQ's breakout score compares a video with its own channel's average, so a tiny channel can score very high on
  modest views.
- I confirmed formats from titles and thumbnails. YouTube blocks video downloads from this cloud session.
- The India in Pixels channel, the closest model for Data Kadai, could not be looked up by handle; its formats are not
  in this study.
- Study results come from lab tasks with still or interactive charts, not from Shorts. They show what helps people
  understand and remember, not what gets views.
