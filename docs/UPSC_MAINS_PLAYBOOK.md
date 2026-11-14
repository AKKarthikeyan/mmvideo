# UPSC Mains channel: growth with Shorts and long videos, and which visual fits which concept

**Draft for AK, 14 Nov 2026.** AK asked how to grow the UPSC Mains channel (Hindi; Geography, Economy and Polity) with
Shorts and long videos, and which visual formats explain exam concepts best. This builds on the Reveal Loop
([`SHORTS_FORMAT.md`](SHORTS_FORMAT.md)), the Shorts rules ([`SHORTS_RULES.md`](SHORTS_RULES.md)), the benchmark Short
`um-parisiman` ([`SHORTS_BENCHMARKS.md`](SHORTS_BENCHMARKS.md)) and the HyperFrames library (`hyperframes/README.md`).
Everything marked **AK's call** is a proposal, not a rule yet.

## 1. The one-line strategy

**Shorts find aspirants; long videos teach them to write; the Telegram group and paid products keep them.** Each layer
hands the viewer to the next one, and every piece ends on a question the next layer answers.

| Layer | Job | What we measure |
| --- | --- | --- |
| Shorts (3 a week) | Reach people who don't follow us, with one answer-ready fact | Chose-to-view %, shares, clicks to the Related video |
| Long videos (1–2 a week) | Turn a fact into a full Mains answer; build trust | Average view duration, subscribers per 1,000 views, Telegram joins |
| Weekly copy review | Show the method working on real aspirants' answers | Copies submitted per week, returning viewers |
| Telegram + free PDF | Own the relationship (YouTube can't take it away) | Joins per 1,000 views, PDF downloads |
| Paid (data pack, writing sprint) | Pay for the channel | Conversion from Telegram, refunds, complaints |

Why Shorts are for reach, not money: from 1 Feb 2027 a YPP channel needs **10M qualified Shorts views in 90 days** to earn
any Shorts revenue (SHORTS_RULES §8). A niche exam channel will rarely clear that. A Short earns its keep by sending
viewers to a long video and to Telegram.

## 2. Shorts: the Reveal Loop, adapted for an exam channel

The topic test stays (Familiar, Hidden, Send), read for this audience:

| Test | For the UPSC channel | Pass | Fail |
| --- | --- | --- | --- |
| **Familiar** | An aspirant **and** their parent recognise the subject in one second | लोक सभा की 543 सीटें, the monsoon, the Budget, ₹100 of tax, your state on a map | "Inter-State Council's 2nd meeting", "GVA deflator" |
| **Hidden** | One number, mechanism or correction a coaching note doesn't give | 27 lakh vs 17 lakh people per MP; the bill that fell 54 votes short | "Delimitation is important for federalism" |
| **Send** | Forwarded into a study group with "use this in GS-II" | A figure, an article number, a judgment line an answer can quote | A general summary |

The difference from our other channels: **the send line is "answer ammunition".** Aspirants forward Shorts into Telegram
and WhatsApp study groups when the Short gives them something they can write in an exam. So every UPSC Short ends with a
fact that fits in one line of a Mains answer, and the source on screen is one an examiner accepts (Constitution, ECI,
Census, Budget at a Glance, Economic Survey, IMD, PRS, the Supreme Court judgment).

### Three series, one per paper (AK's call)

The channel already has **आँकड़ों में संविधान** (Polity). Add one for Economy and one for Geography, so the three Shorts a
week cover GS-I, GS-II and GS-III. Series rules (SHORTS_FORMAT §6) apply: a series that doesn't beat the channel median
after 10 Shorts is retired.

| Paper | Series | The promise | Title template | Visual |
| --- | --- | --- | --- | --- |
| GS-II Polity | **आँकड़ों में संविधान** (running) | One constitutional fact, in numbers an answer can use | "लोक सभा की सीटें आज भी 1971 से तय हैं" | s15 seat map, s03 the article on the page, s11 amendment timeline |
| GS-III Economy | **आपका ₹100** (proposed) | Where ₹100 of the Union Budget, a tax or a subsidy goes | "सरकार के ₹100 में से ₹[x] ब्याज में" | s04 money breakdown, s12 scale, s05 dots |
| GS-I Geography | **नक्शा कुछ और कहता है** (proposed) | A map belief, corrected, with the exam fact | "भारत का दक्षिणी छोर कन्याकुमारी नहीं" | Map zoom (`ia-southtip`), s01 satellite, s02 terrain, s06 wind |

Example topics (every number **VERIFY** against the source named before building):

- **आपका ₹100:** "Of every ₹100 the Centre spends, about ₹20 goes on interest" (Budget at a Glance, "Rupee goes to";
  use the latest Budget). "Where the Centre's ₹100 comes from: almost a quarter is borrowed" (same table, "Rupee comes
  from"). Both are real, familiar, and quotable in a GS-III fiscal answer.
- **नक्शा कुछ और कहता है:** a Hindi script of the `ia-southtip` story (Indira Point, its own script and voice, not a
  dub, per O1); "the wettest place in India is not Cherrapunji" (IMD normals); the monsoon's normal onset over Kerala
  (IMD's normal date) shown on the s06 wind map.
- **आँकड़ों में संविधान:** the Governor's assent and the Supreme Court's 2025 rulings on timelines (judgment and
  Presidential reference opinion, quote the judgment line on s13); the Tenth Schedule in numbers.

### Timing with the exam year

| Window | Shorts lean to | Long videos lean to |
| --- | --- | --- |
| Feb–Mar | Budget and Economic Survey (आपका ₹100) | Budget and Survey, chapter by chapter, mapped to GS-III |
| Mar–May (Prelims season) | Facts that serve both Prelims and Mains | Static topics with PYQs; fewer Mains-only pieces |
| Jun–Aug (Prelims result to Mains) | Answer ammunition on all three papers, daily if we can keep quality | PYQ deconstruction, copy reviews, the writing sprint |
| Sep–Jan | News that lands in the syllabus (Census 2027, delimitation, monsoon, judgments) | Interdisciplinary issues, new PYQs the week the paper is out |

Check each year's dates against the UPSC calendar before planning; the windows above are typical, not fixed.

## 3. Long videos: five formats

Every long video starts from a PYQ or a syllabus line, and ends with an answer the viewer could write. Titles carry the
syllabus phrase and the PYQ year, because aspirants search by them ("GS-2 PYQ 2025 परिसीमन उत्तर").

| Format | Length | What happens | Why it grows the channel |
| --- | --- | --- | --- |
| **PYQ का पोस्टमार्टम** | 12–20 min | One Mains PYQ: the directive word, the demand of the question, the structure, then the answer built on screen with one diagram the viewer can draw | Search traffic for years; the clearest proof of method |
| **एक मुद्दा, तीन पेपर** | 15–25 min | One issue across GS-I, II and III (e.g. Himalayan glaciers: geography of retreat, Art. 262 and river disputes, hydropower and disaster finance) | Mains rewards linkages; few channels teach them visually |
| **कॉपी रिव्यू** (weekly) | 15–30 min, or live | Three real copies from Telegram, anonymised, marked on screen; one rewritten from about 4/10 to 6.5/10 | The highest-trust format in this niche; fills the Telegram group |
| **आँकड़ों से उत्तर** | 10–15 min | One data source (Budget, Survey, PLFS, NFHS, Census) turned into five answer-ready figures with the citation | Saved and re-watched before the exam; feeds the paid data pack |
| **Short का पूरा उत्तर** | 8–12 min | The long video behind a Short: same story, full answer, PYQs where it was asked | The Short's Related video; turns Short viewers into subscribers |

Rules for every long video:
1. **Chapters by answer part** (introduction, body points, way forward), so viewers can jump and the video ranks in search.
2. **The pinned comment and description link the Telegram group and the free PDF**; the PDF is the video's diagram and
   figures on one page.
3. **Every Short sets its Related video** (in desktop Studio, by hand: K3) to the long video that answers it. Build the long
   video first, or the Short has nowhere to send viewers.
4. **No talking head without a picture for more than 20 s.** The face builds trust; the picture carries the concept.

## 4. Which visual explains which kind of exam concept

The test for a visual on this channel: **does it show the mechanism, and can the viewer reduce it to a sketch they can
draw in 30 seconds in the exam?** Mains rewards a sketch map, flowchart or table inside the answer. So every premium
visual ends with its **exam version**: the same idea redrawn by hand (s14 notes style, Caveat/Virgil handwriting), as
simple as a pen can make it.

This follows well-tested learning research: pictures plus narration beat narration alone (multimedia principle), pointing
at what matters helps (signalling), cutting extras helps (coherence), short segments help (segmenting), and learners who
draw the diagram themselves remember more (learning by drawing). [Science; Mayer, *Multimedia Learning*; Fiorella and
Mayer, *Learning as a Generative Activity*]

| Concept type | Paper | Best visual | Library start | Exam version (what they draw) |
| --- | --- | --- | --- | --- |
| Location and "where" facts: corridors, ports, mineral belts, borders, extreme points | GS-I | Map that zooms on frame 1, pins landing on the spoken word | `shorts/ia-southtip`, `videos/` port map | Outline of India, 3–5 dots and labels |
| Processes in the atmosphere: monsoon, jet streams, cyclones, western disturbances | GS-I | Wind and flow map from real model data | s06 wind | Arrows on an outline, two labels |
| Landforms, rivers, glaciers, Himalayan hazards | GS-I, GS-III | 3D terrain flyover with river and pins | s02 terrain | Cross-section sketch |
| Change on the ground: delta erosion, mining, a dam, a city's growth, Great Nicobar | GS-I, GS-III | Satellite before/after wipe with a measured label | s01 satellite | Before/after boxes with one number |
| State-wise data: seats, fiscal transfers, TFR, groundwater, poverty | GS-I, II, III | 3D map of states as lit prisms | s15 seat map | Shaded map or a ranked table of top/bottom 3 |
| Constitutional text: an article, a proviso, a schedule | GS-II | The real page on a desk, push-in, highlighter | s03 desk | The article number and its key words, boxed |
| Judgments and committee lines | GS-II | Big-type quote with the original line below | s13 quote | The case name, year and one-line ratio |
| Evolution of a law or institution: amendments, basic structure, Panchayati Raj | GS-II | Fly-through timeline | s11 timeline | A five-point timeline |
| Where public money comes from and goes: Budget, subsidies, a tax | GS-III | Money breakdown with a zoom into the small pieces | s04 money | A bar split into 4–5 parts |
| Shares and structural change: urbanisation, workforce by sector, MSP coverage | GS-I, GS-III | 1,000 dots that regroup | s05 dots | A pie or 100-square grid |
| Big numbers made real: debt, fiscal deficit, subsidy bills | GS-III | Scale comparison with a log zoom-out | s12 scale | One line comparing it to something known |
| Trade, energy and diaspora flows | GS-II, GS-III | Globe with arcs and a ranked list | s07 globe | World outline with 3 arrows |
| Procedures and mechanisms: how a bill becomes law, monetary transmission, GST sharing | GS-II, GS-III | Flowchart that builds, then redraws as the exam sketch | s16 flow | The same flowchart, 5–7 boxes |
| Writing the answer itself | All | Hand-drawn notes over a real answer copy | s14 notes | The structure: intro, 3–4 points, way forward |

### Gaps in the library for this channel

Three kinds of concept had no sample. The first is now built. They come up in almost every GS-II and GS-III answer, so they are the next
samples to build (AK's call):

1. **Process flow:** built as sample 16 (`hyperframes/samples/s16-flow`, 14 Nov 2026): how an ordinary bill becomes
   law, in Hindi or English, ending as the hand-drawn exam version. Reuse it for how a repo rate change reaches a loan, or
   how GST revenue is shared.
2. **Linkage web:** one issue in the centre with GS-I, GS-II and GS-III spokes lighting up in turn, for the "एक मुद्दा,
   तीन पेपर" format.
3. **Side-by-side comparison:** two articles, committees, schemes or countries in a table that fills row by row
   (Art. 32 vs 226, Finance Commission vs GST Council). The table is the exam version.

### What not to do

- **No slideshow of bullet points read aloud.** It is the weakest teaching format and it is named in YouTube's
  inauthentic-content policy ("scrolling text with minimal or no narrative", O1).
- **No visual without a source on screen**, and anything illustrative labelled as illustrative (CLAUDE.md). For an exam
  channel this is also the product: aspirants copy our citations into answers.
- **No India map with community boundaries in a published video.** Replace with Survey of India boundaries
  (`hyperframes/README.md`). An exam channel showing a wrong border loses trust at once.
- **No cut-downs of long videos as Shorts** (SHORTS_RULES §2). Each Short is its own loop script.

## 5. First 90 days

| Weeks | Shorts | Long | Other |
| --- | --- | --- | --- |
| 1–2 | Publish `um-parisiman` once AK has re-voiced it with Maya and a native speaker has ear-checked it | Build its Related video: "परिसीमन: GS-II का पूरा उत्तर" (the PYQs, the 1971 freeze, the 2026 bill, one drawable map) | Open the Telegram group; one-page free PDF of the delimitation figures |
| 3–6 | 3 a week, one per series (आँकड़ों में संविधान, आपका ₹100, नक्शा कुछ और कहता है) | 1 PYQ का पोस्टमार्टम a week; the first कॉपी रिव्यू in week 4 | Ask for copies in every long video and in Telegram |
| 7–10 | Keep the series that beat the channel median; swap the weakest topic type | Add एक मुद्दा, तीन पेपर every other week | Build the linkage-web sample (the process flow is s16) |
| 11–13 | Hindi script of a proven Indica Atlas map story, as a नक्शा Short | आँकड़ों से उत्तर on the latest Budget or Survey | If Telegram passes about 2,000 active members, test the first paid item (the data pack) |

Read every Short at 48 hours against the channel's own median (SHORTS_RULES §7) and log it. Add two UPSC numbers to the
log: **clicks to the Related video** and **Telegram joins per 1,000 views**. Judge a series after 10 Shorts and a format
after 30, never after 3.

## 6. On the monetisation report AK shared (14 Nov 2026)

The report's direction fits this plan: Shorts and long videos build trust; the money is in low-priced data packs, a live
writing sprint, then subject courses and evaluated tests. Before acting on its numbers:

- **Competitor prices, platform fees and affiliate rates are third-party claims** from store pages, Reddit and blogs. Check
  each on the vendor's own page on the day we decide; fees and plans change often.
- **Its operating rules are the right ones and match ours:** publish the lecture calendar before selling a batch, cap
  enrolment to evaluator capacity, and never claim ranker numbers we can't prove. Our version: show anonymised before and
  after copies, as in the कॉपी रिव्यू format.
- **Affiliate links** (books, Audible) need a clear disclosure in the description and in the video when spoken about.
