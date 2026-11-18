# The Inventor's Desk: story format (outline v1, 23 Oct 2026)

**Audience:** global. Write for a curious 12-year-old and the parent watching beside them. General audience, not "made for kids".
**AK's spine:** Necessity → Path to invention → How it works → Current data.
**Length:** about 90 s, one Short, like 001 and 002.

**Two episode types, one spine** (added 23 Oct): **Evergreen** episodes ("how was it invented?") and **Now** episodes, a current science or tech story told through its invention backstory. Both use the same seven beats. See "Now episodes" below.

## Channel identity (AK, 24 Oct 2026, after COMPETITOR_STUDY.md). Rule zero: nothing may delay or cover the opening hook.
1. **Titles and first frames:** honest "double barrel". The title and the first-frame headline create tension and never repeat each other. Legit-bait, never a clicktrap.
2. **The Desk:**
   - **Closing (every episode):** in the last ~1.5 s, after the voice ends, the final scene shrinks into the drawer and it shuts (`DeskShrink` + `DeskClose`, src/gadget/desk.tsx). That closing is also the loop back to the start.
   - **Opening (new episodes only, designed in):** tested 24 Oct as an overlay behind the existing hooks of 003–005. It crowded their bottom labels and the source line, so it was removed there. For new episodes, draw the hook scene *standing on* the desk, so the desk is part of the hook visual from frame 0 rather than an overlay. Never delay the hook line.
3. **Series names, where they fit:** **Happy Accidents** (inventions from mistakes) and **Claim Check** (news episodes, with the claim stamp as the verdict). The series name goes in the title and the top bar. Episodes that don't fit stay plain "The Inventor's Desk No. N".
4. **Proof moment:** one safe, simple try-it beat when the topic allows ("TRY IT · with a grown-up"). Never force one.

## The idea in one line
AK's spine works as a list of facts. To make it a story, put a **question** at the front and a **callback** at the end, and make each part *cause* the next one ("but… so…") rather than just follow it ("and then…").

## Seven beats

| # | Beat (AK's part) | Time | Job | Device |
|---|---|---|---|---|
| 0 | **The Hook** | 0–6 s | Drop the viewer into one strange, vivid moment and open a question | A scene, never a date. "A ship full of ice sails 25,000 km…" |
| 1 | **The Problem** (Necessity) | 6–20 s | Make them *feel* life without the thing | One person, one cost: rotting food, a lost ship, a ruined print run |
| 2 | **The Chase** (Path) | 20–45 s | Real people trying, failing, getting lucky | At most 2–3 characters. Each beat ends in a **but** (the try fails, the idea gets laughed at, an accident happens) |
| 3 | **The Reveal** (How it works) | 45–70 s | The "aha": open the box one layer at a time | One analogy + one thing to try or notice at home. At most one technical word, explained in the same breath |
| 4 | **The Twist** | 70–78 s | The fact that flips what they assumed | "A fridge doesn't make cold." "Nobody invented radio alone." |
| 5 | **Today** (Current data) | 78–88 s | How big it is now, in human terms | One or two numbers, each turned into a picture ("one for every four people"). Plus one thing still unsolved |
| 6 | **The Callback** | 88–95 s | Close the loop the hook opened | Return to the opening image. End on a question people want to answer in the comments |

## Rules for each beat

**0 · Hook**
- Open on a moment that would make a parent say "wait, really?": an action, a place, an object.
- State or imply the **episode question** within the first 6 s, e.g. "How does a box stay cold in a hot kitchen?" The Reveal must answer it.
- No title card, no "Hi, welcome", no date as the first word.

**1 · Problem (Necessity)**
- Show the old way and what it cost: time, money, health, danger.
- Keep it specific and sensory: "milk turned sour by noon", not "food spoilage was a problem".
- End on the stakes: why someone *had* to solve this.

**2 · Chase (Path to invention)**
- Tell it as a relay race. Each runner hands the next a piece.
- Each step has a **try → but → so** shape. Keep failures, rivalries and accidents; drop dates that don't move the story.
- Credit honestly. Where priority is disputed, say so ("Marconi *said* he heard…"). Include inventors from anywhere when it's true (Bose for radio, Yoshino for batteries), never as national point-scoring.
- At most three named people. A cast list is not a story.

**3 · Reveal (How it works)**
- Build it up in layers: the one big idea → the parts → the loop it runs.
- **One analogy per episode** (a bucket bailing a boat, ripples in a pond). Don't stack analogies.
- **One try-it or notice-it moment**, phrased for a 12-year-old: "Wet the back of your hand and blow on it", not "Feels cold, right?"
- At most one technical word, defined as it is said: "an antenna, a metal rod that…".
- Answer the hook's question here, out loud.

**4 · Twist**
- A short line that resets the viewer's mental model. This is the line people quote or share.
- It must be true without needing a footnote. If it needs a footnote, cut it.

**5 · Today (Current data)**
- Use global sources only: IEA, ITU, World Bank, UN, industry bodies, company filings. Print the source on screen, as in 001 and 002.
- One or two numbers, each turned into a picture. Round honestly ("about", "more than").
- Add one forward note: the problem still unsolved or what's coming next (fridges use about X% of world electricity; new coolants…).

**6 · Callback**
- Bring back the opening image (the ice ship, the bell in the next room).
- Close with a question that invites a comment and ties back to the episode ("What would you have kept cold first?"). Comments are on, since this isn't "made for kids".
- Drop "Now you know." The callback does that job and lets the Short loop.

## Pacing rules (AK, 24 Oct: "good hook, after that the story moves faster than the audience can follow")
- Strong hook, then slow down. Tell one strand at a time, with signposts.
- One new idea and at most one number per beat; about 6–8 numbers per Short. Extra numbers go on screen or get cut.
- Name a technical word once and explain it in the same breath. Don't stack terms.
- Add a one-line recap before the turn.
- Put a 0.4–0.6 s pause or hold after each key fact.
- If the hook's payoff is more than about 60 s away, remind the viewer of it halfway.
- Test: can a 12-year-old retell it in three sentences after one viewing?

## Tone checklist (12-year-old + parent)
- [ ] Would a parent find any line babyish? Cut it.
- [ ] Would a 12-year-old stumble on any word? Explain it or swap it.
- [ ] Numbers in words for the voice, metric units, comparisons that work worldwide (football pitches, not acres or bighas).
- [ ] No country-specific money or references unless the story happens there.
- [ ] Every claim can be sourced, and disputed claims are worded as disputed.
- [ ] Does each beat cause the next? Read it aloud with "but" and "so" between the beats.

## Worked example: 002 Fridge, re-outlined (same art, beats regrouped)

| Beat | Outline |
|---|---|
| 0 Hook | 1833: a ship carries a mountain of ice from Boston to Calcutta, four months across the equator, and more than half of it arrives still frozen. *Question: why go to all that trouble, and how did we stop needing to?* |
| 1 Problem | Before cold, food lasted days. Ice was cut from frozen lakes and shipped around the world, a luxury that melted on the way. |
| 2 Chase | Cullen (1755) makes ice by letting a liquid evaporate fast, **but** only as a one-off party trick → **so** Perkins (1834) patents a machine that repeats it in a loop → a century later, even Einstein co-patents a fridge with no pump (1930). |
| 3 Reveal | Try it: wet the back of your hand and blow on it. Evaporating liquid carries heat away. Inside the fridge a liquid evaporates in thin pipes and takes heat from the food. A pump squeezes the gas, which makes it hot. The coils at the back give that heat to the room. Round and round. *Answers the hook.* |
| 4 Twist | A fridge doesn't make cold. It moves heat out of the box, like bailing water out of a boat. That's why the back is warm. |
| 5 Today | [Source needed: IEA or similar, number of household fridges worldwide and their share of electricity use]. Plus one unsolved problem (coolant gases that warm the planet). |
| 6 Callback | Back to the ice ship: "Tudor shipped a mountain of ice around the world. Your kitchen makes it overnight. What would you have kept cold first?" |

001 Radio fits the same way. Hook: a bell rings in another room, through two walls (Bose, 1895). Chase: Maxwell → Hertz → Bose → Marconi. Reveal: ripples in a pond. Twist: nobody invented radio alone. Today: global reach [source]. Callback: the bell.

## Evergreen slate (global; replaces the India-specific slate in GAP_ANALYSIS.md)
Every hook and fact below is **still to verify** before scripting.

| # | Product | Necessity hook | Chase twist | Reveal analogy / try-it |
|---|---|---|---|---|
| 1 | Microwave oven | A cold lunch, a radar lab | A radar engineer (Percy Spencer) notices something in his pocket melting | Water molecules jiggling like a crowd in a stadium |
| 2 | Air conditioner | A printing plant where the paper kept warping | Willis Carrier (1902) built it for paper, not people | Same heat-moving loop as the fridge, plus drying the air |
| 3 | Barcode | Shops checking out by hand | An idea drawn in beach sand, from Morse code; first scan a pack of gum (1974) | Morse code stretched into stripes |
| 4 | GPS | Ships and planes getting lost | Scientists tracking Sputnik (1957) realised they could flip the maths | Clocks in space shouting the time |
| 5 | Velcro | Fiddly fasteners | A walk with a dog, burrs stuck to the fur | Hooks and loops under a magnifier |
| 6 | Sticky notes | Bookmarks that fall out | A "failed" weak glue, rescued years later | Glue that grips but lets go |
| 7 | Lithium-ion battery | Phones the size of bricks | Three scientists, three continents, one Nobel (2019) | Ions as commuters shuttling between two cities |
| 8 | Touchscreen | Air traffic controllers needing speed | An early touchscreen built for air traffic control (1960s) | Your finger steals a little charge |
| 9 | Optical fibre | Copper cables full of noise | Light bent down a glass thread; Kapany and Kao | Light bouncing down a mirror-walled corridor |
| 10 | USB | A tangle of different plugs | Ajay Bhatt's team at Intel set out to replace them all | One shared language for every device |
| 11 | Pressure cooker | Food that wouldn't soften high in the mountains | Papin's "bone digester" (1679) nearly exploded, so he invented the safety valve | Trapping steam raises the boiling point |
| 12 | Clay fridge | Food spoiling where there's no electricity | A pot inside a pot (Mohammed Bah Abba, Nigeria) and Mitticool (India) | The same "wet hand" trick as 002, no plug needed |

---

# Now episodes: current science and tech, told as invention stories

**The mix:** the news supplies the **Hook** and **Today**. The invention backstory fills the **Problem → Chase → Reveal** middle. News channels can't tell the backstory, and history channels miss the news. Doing both is the gap.

## How the seven beats change for a Now episode

| Beat | Evergreen | Now |
|---|---|---|
| 0 Hook | A strange scene from history | **The headline as a scene**: "In October 2026, a small company said it had turned mercury into gold." |
| 1 Problem | Life before the product | **Why people wanted this for so long**: the old dream or need behind the headline |
| 2 Chase | A relay of inventors | **The road to the headline**: the earlier tries that made it possible, ending at today's team |
| 3 Reveal | How it works | How *the new thing* works, in one analogy |
| 4 Twist | A surprising fact | **The catch**: the honest limit (cost, scale, safety, not yet proven) |
| 5 Today | Current numbers | **Where it really stands**: one claim-ladder stamp (below) + one number for scale |
| 6 Callback | Back to the opening image | Same, plus a question that asks for an opinion ("Would made gold still feel like gold?") |

## Rules for Now episodes
1. **The claim ladder, stamped on screen.** Every Now episode says how far along the news really is: **CLAIMED** (press release or social post) → **PUBLISHED** (peer-reviewed paper) → **REPEATED** (another team confirmed it) → **ON SALE**. Use the stamp SFX already in the kit. The voice says the same: "says", "reports", "hasn't been checked by others yet".
2. **The backstory takes at least 40% of the runtime.** If a headline has no real backstory, it's news, not an Inventor's Desk episode. Skip it.
3. **Words that last six months.** Say "In October 2026", never "this week" or "just now". Shorts get viewed for months.
4. **Hype check before scripting.** Would the scientists themselves call the hook overstated? (Same rule as Moat & Margin: never bend the facts for a hook.)
5. **Speed.** Publish within about 3–10 days of the news while it's searched, but never skip the fact check to be first.
6. **Pair it with an evergreen episode.** Every Now episode links to an evergreen one (lab-grown gold → lab-grown diamonds; nuclear clock → how clocks got accurate). This builds a binge path and keeps old Shorts alive.
7. **Health topics** (drugs, diets): explain the science and the history only. No advice, no "should you take it". Add an on-screen line: "Not medical advice."

## Mix and cadence
- **Ratio:** about 1 Now for every 2 Evergreen. Evergreen is the backbone and a ready buffer. Now episodes ride the news.
- **Weekly scan** (Monday): Nature and Science press releases, NASA/ESA, big launches, and set-piece events (Nobel week in October, CES in January, the Apple/Google events). Choose with three tests:
  - **Wow:** would a parent say "wait, really?"
  - **Backstory:** is there a real invention road behind it?
  - **Six months:** will the Short still be true and interesting in April?

## Worked example: Lab-grown gold (Now, top pick: the news broke on 21 Oct 2026)

| Beat | Outline |
|---|---|
| 0 Hook | October 2026: a San Francisco startup, Marathon Fusion, says it turned mercury, the liquid metal in old thermometers, into real gold. |
| 1 Problem | People have tried to make gold for about 2,000 years. Alchemists boiled, burned and mixed everything, because gold is rare and never rusts. |
| 2 Chase | Alchemy failed: **chemistry can't change one element into another**, but physics can. Rutherford (1919) first changed one element into another (nitrogen into oxygen) → Harvard physicists (1941) made gold from mercury, but radioactive and in tiny amounts → Seaborg (1980) made gold from bismuth, and it cost far more than the gold → CERN (2025): about 29 trillionths of a gram from lead collisions → Marathon (2026) claims a route using fusion neutrons. |
| 3 Reveal | What an element *is* comes down to one number: how many protons sit in the centre of each atom. Gold has 79; mercury has 80. Fire a neutron into the right kind of mercury atom, and it becomes unstable and decays into gold. Analogy: changing one number in a recipe turns it into a different dish. |
| 4 Twist | The alchemists' dream is real, but the new gold is radioactive at first. It would need roughly 7–17 years of storage before anyone could sell it. |
| 5 Today | Stamp: **CLAIMED** (not yet independently checked). For scale: mines produced about 3,672 tonnes of gold in 2025 (World Gold Council). Marathon's reactor today makes about 1 kilowatt of fusion power; its own study says one *gigawatt* plant might make about 5 tonnes a year, and no fusion plant sells power yet. |
| 6 Callback | Back to the alchemist at the furnace. "It took 2,000 years and a fusion reactor. If gold could be made in a lab, would it still feel like gold?" Pair with: *Lab-grown diamonds* (below). |

**Verify before scripting:** the Rutherford, Harvard 1941 and Seaborg 1980 details; which mercury isotope and decay path; the World Gold Council 2025 figure; Marathon's exact wording.

## Now slate (current as of 23 Oct 2026, with the claim rung for each)

| # | Topic | The news | Backstory (Problem → Chase) | Catch / Twist | Rung | Pairs with |
|---|---|---|---|---|---|---|
| N1 | **Lab-grown gold** | Marathon Fusion's mercury-to-gold claim, 21 Oct 2026 | 2,000 years of alchemy → atom smashers | Radioactive; tiny amounts; unverified | CLAIMED | N2 |
| N2 | **Lab-grown diamonds** | Natural 1-carat prices roughly halved since 2021; De Beers pausing its Venetia mine | Diamonds made by squeezing carbon in 1950s labs → today's growers | Lab stones fell ~74% in price (2020–24); "forever" got cheaper | ON SALE | N1 |
| N3 | **The first nuclear clocks** | Vienna and Beijing teams, Nature, Oct 2026 | Sundials → pendulums → quartz → atomic clocks (the clocks behind GPS) | Not yet better than atomic clocks; could be ~10,000× more stable | PUBLISHED | Evergreen: GPS |
| N4 | **Light switches for the brain** (Nobel Medicine 2026, optogenetics) | Deisseroth, Hegemann, Nagel | Pond algae that swim toward light → borrow their light-sensing protein → switch nerve cells on with light | Mostly a research tool for now, not a treatment | PUBLISHED, Nobel | — |
| N5 | **A telescope made of ice** (Nobel Physics 2026, IceCube) | Francis Halzen | "Ghost particles" predicted in 1930 → a cubic kilometre of Antarctic ice watching for flashes | Trillions pass through you every second; it catches a tiny few | PUBLISHED, Nobel | — |
| N6 | **The longest drive on another world** | Perseverance passed Opportunity's 45.16 km record, 11 Oct 2026 | Sojourner (1997) → Spirit/Opportunity → a rover that drives itself | Messages take minutes, so AutoNav did 90%+ of the driving | PUBLISHED (NASA) | Evergreen: self-driving / GPS |
| N7 | **The weight-loss pill** | FDA approved orforglipron (Foundayo), 1 Apr 2026 | A lizard's venom (Gila monster) → injected drugs → a pill | GI side effects, warnings; not medical advice | ON SALE (US) | — |
| N8 | **AI glasses** | Shipments up 263% in H1 2026 (Counterpoint) | Google Glass (2013) flopped → why glasses are back | Privacy: a camera on everyone's face | ON SALE | Evergreen: touchscreen |
| N9 | **Solid-state batteries** | 2026 pilot lines (Toyota, Chinese makers) | Why phone batteries can catch fire → a battery with no liquid inside | 2026 is pilot-scale; mass cars ~2027–30 | CLAIMED / pilot | Evergreen: lithium-ion |
| N10 | **A robot butler for $20,000** | 1X NEO pre-orders for 2026 US delivery | The word "robot" comes from a 1920 play → factory arms → walking helpers | Deliveries unconfirmed; Tesla's Optimus mostly "for learning" | CLAIMED | — |
| N11 | **Around the Moon without stopping** (Artemis II, Apr 2026) | First crew to the Moon in 54 years | The free-return path that saved Apollo 13 | No landing, by design | DONE | — |
| Hold | Quantum error correction | Atom Computing, June 2026 | — | Too abstract for the audience for now; revisit with a strong analogy | — | — |

**Suggested first five** (one Now leading, then the rhythm):
1. N1 Lab-grown gold (time-sensitive)
2. Evergreen: Microwave
3. N3 Nuclear clocks
4. Evergreen: GPS
5. N2 Lab-grown diamonds

## Sources for the Now slate
- Lab-grown gold: https://www.euronews.com/2026/10/23/could-lab-made-gold-crash-prices-like-diamonds-us-start-up-says-it-turned-mercury-into-gol ; https://beincrypto.com/marathon-fusion-mercury-gold-price-impact/
- Diamonds: https://finance.yahoo.com/markets/commodities/articles/price-diamonds-crashes-lowest-level-181700046.html ; https://rapaport.com/?p=20700
- Nuclear clocks: https://www.natureasia.com/en/info/press-releases/detail/9455 ; https://www.sciencealert.com/?p=204990
- Nobel 2026: https://www.khaleejtimes.com/world/henri-kagan-kenso-soai-win-2026-nobel-chemistry-prize?amp=1 ; https://www.dailymaverick.co.za/article/2026-10-06-francis-halzen-wins-2026-nobel-prize-in-physics.md ; https://vajiramandravi.com/current-affairs/2026/10/13/
- Perseverance: https://www.space.com/perseverance-distance-record-mars ; https://petapixel.com/2026/10/13/nasa-perseverance-mars-rover-sets-new-record-for-off-world-distance-driven/
- Orforglipron: https://www.drugtopics.com/view/fda-approves-orforglipron-for-chronic-weight-management
- AI glasses: https://9to5mac.com/2026/09/21/report-ai-glasses-shipments-surged-263-in-h1-2026-as-apple-prepares-to-enter-the-market/
- Solid-state: https://insideevs.com/news/732940/japan-toyota-solid-state-production/
- 1X NEO / Optimus: https://humanoid.guide/home-humanoid-robots-advance-as-tesla-1x-agility-scale-up/
- Artemis II: https://en.wikipedia.org/wiki/Artemis_II
- Quantum: https://app.dealroom.co/news/feed/atom-computing-achieves-quantum-error-correction-with-toric-code-using-neutral-atoms
