# Data Kadai script writer's guide (from the reviews of 11 Oct 2026)

A script is one config file for `examples/build_beats.py`. The builder recomputes every number and stops if a check
fails, so the config must name its data exactly and carry a test for every spoken or printed comparison.

## Before writing
1. Open the table (`../public/datayt/sources/rbi_handbook/T###.json`: `{title, unit, columns, notes, states}`; the
   all-India row is the key "India"). Recompute the lead yourself with `python3 -I`.
2. Use the latest column in which the state rows add up to at least 95% of the India row. If the latest is thinner,
   use the year before and say which year (the 2024-25 exports column was only 88% complete).
3. The pattern must have held in each of the last three columns. If it flips between years, drop the lead.
4. Thin lead: a gap under 1 point of the all-India total, or under 3% relative, is "level". Never build on it.
5. Read the table's notes: provisional (P), "includes Telangana until 2013-14", estimates, different years per state.
   Whatever applies goes on screen in a few words.
6. Reject size effects: a big state being first on a total is not a story unless its share is far above its usual
   share (compare with its share of total foodgrains, T062, or of milk, T091) or far above the next state.

## The one claim
One claim per Short. The hook is that claim in at most 12 words, with the place and the surprise both in it.
Do not open on a date, a definition or a caveat.

## Wording rules that reviewers enforced
- Say what the table counts: "produces", "grows", "has", never "feeds", "eats", "best", "worst", "No. 1".
- Totals are totals: say "state totals, not per person" somewhere on screen.
- No cause and no motive unless the source states it. "The table shows how much, not why."
- No "today" or "now" for a past year; say the year. Mark provisional figures.
- No brand names, no mockery of a state, no politics, no policy, no group of people blamed.
- A sensitive subject is framed around the group of states, never one state alone.
- Each script needs one sentence that is our own finding: a ratio, a share compared with the state's usual share,
  area against yield for a crop (production T058-T066, area T067-T079, yield T080-T088), or growth multiples.
  It must be computed from the tables and carried as a test.

## Voice and screen
- Voice lines: at most 13 words each; one or two sentences. The narrator takes about 0.4 s a word.
- Spell years for the voice: "twenty twenty-four twenty-five", not "2024-25". Numbers in words.
- Screen lines: at most 8 words a line; `*word*` marks the accent colour. Period and unit appear on screen.
- Target 35 to 40 seconds: six or seven beats.

## Config
Copy the schema of the example for the type exactly (`examples/sh01.json` share, `rc01.json` race, `px01.json`
paradox, `hl01.json` pick, `gw01.json` over) and read the matching branch of `build_beats.py` for what each key does.
- Data specs: `{"rbi": [table number, "exact column name"]}`; share of India: `{"share": spec}`; ratio of two specs.
- Every spoken comparison ("nearly half", "almost double", "about a third") has an entry under "tests" (or "says" in
  a pick round) with a numeric range that the phrase honestly covers.
- Title: at most 60 characters, claiming only what the video shows.

## House rules the builder enforces (added 11 Oct 2026, from VIDEO_TEMPLATES_AND_YT_RULES.md)
A script in the bank stops in `build_beats.py --check` if it breaks one of these, before anything is voiced:
- The hook is on the map: the place lit on the India outline, with the surprise, in the first frame. At most 12 words
  on screen. A share script opens this way with `"open": "map"` (the state is named at once; there is no reveal beat).
- Three to five beats between the hook and the map, one thing on screen at a time, each with its unit and period.
- The story closes on every state's number on the map, then a last card with one question and the source.
- Screen lines at most 8 words; voice lines at most 13 words, numbers and years spelled out (`5G` is allowed).
- None of: today, currently, right now, best, worst, No. 1, #1, number one, truth, reality, secret, exposed, shocking,
  backward, failed.
- The title is at most 60 characters and every number in it appears on screen.
- The source chip names the publisher and the period. At least one computed finding is carried as a test.
- Built length 25 to 35 seconds, aim for 30 (25 Oct 2026, AK: "Shorts are maximum 25-35 sec" because longer Shorts lose retention). At this tempo a beat lasts at least 3.9 s, so a Short
  holds seven or eight beats, and each voice line must fit one beat (about 3.3 s, eight or nine words).
A game (`pick`) and a place story keep their own openings and endings.

## Two more types
- `then`: one number at two dates (example `new/tn02.json`; two survey rounds: `new/tn03.json`). With `"table"`,
  `"from"`, `"to"` the builder also tests the years around both dates: the start must not be a dip or spike against
  the two years before it, the change must be there in each of the last three years, and the figure must not have
  fallen back from a recent peak. A state split between the two dates (Andhra Pradesh and Telangana in 2014, Jammu
  and Kashmir and Ladakh in 2019) is left blank on the map of changes and must be named in the map note.
  Never print or say "now": each figure sits under its own period.
- `race` with `"stack": {"n": 1}`: a handover told without the stack (example `new/rc02.json`). The new leader must be
  ahead of the next state by at least 1 point of the all-India total and 3%, and must have led for three years.

## Freshness, from the first reviews
Animal husbandry tables (milk, eggs, meat, wool) in our Handbook copy stop at 2023-24; the Ministry's Basic Animal
Husbandry Statistics 2025 has 2024-25. Do not voice a script on those tables until the newer year has been read.
Crop tables: the 2024-25 column is the Ministry's final estimate (released 21 Nov 2025); 2025-26 exists only as
advance estimates. Say "final estimates" in the source line.


## One state, one fact (`fact`)
The same cards as a paradox with one measure: the place lit on the map with the fact, the state's figure with the
country or the next state for scale, one more card that adds a number (the other end of the ranking, or the same
state in the earlier survey), a card of our own reading under `so`, then every state on the map. Copy the schema of
`beats/configs/px02.json` and set `"type": "fact"`. A `"claim": "highest"` or `"lowest"` needs a clear lead: at least
3% and, for a percentage, at least one point over the next state, or the builder stops.

## What the week-one reviews caught (12 Oct 2026): do not repeat these
1. Rounding words. "Nearly twelve" for 11.6 and "three-fifths" for 63.6 were rejected. Say the number, or use a word
   whose honest range you put in the test.
2. Ranks. "2nd" was rejected because the third state was 0.95 points behind. A rank needs the same clear gap to its
   neighbour as a lead does; otherwise say "top three" or "among".
3. A low starting year. If the start is below the year before it, print that earlier figure on a card.
4. Say what the table counts, in the first frame and the title: output not "rice", "have ever used the internet" not
   "online", "any member covered" not "covered", "available" not "used", "rural", "men", "per person".
5. Put the year in the first frame when the figure is specific to that year. No present tense about a past year.
6. On a map of changes, say that a lower share can come with more of the thing, and give the map a `key`.
7. Read the table notes on the all-India row. A pooled average of the reporting states is not "India".
8. Each beat adds a new number. Do not voice the same fact on two cards.
9. Compare like with like on a card: two states on one measure, or one state on two measures.
10. The closing question must invite a real answer and fit two lines: at most seven words.
11. Hook: at most 12 words on screen in three short lines (about 28 characters a line), and a voice line of about ten
    words, so the hook beat stays under six seconds.
12. Do not put two Shorts with the same opening line in one week. Vary the hook: a rank, a multiple, two figures.
13. Fair to the state named: lead with what rose or what is highest; give the comparison without "only" or "but".
14. Freshness. Do not build on milk, eggs, meat or wool (tables 90 to 94): a newer edition exists. Crop tables: the
    2024-25 column is the final estimate; say "final estimates" in `source_short`. NFHS-6 figures came from the fact
    sheets; list the exact cells for a person to re-read in the PDF.
15. Run `python3 scripts/datayt/build_beats.py --check <id>` from the repo folder until it passes. It runs the number
    tests and the house rules and estimates the length (25 to 35 seconds; aim for 27 to 32).

## Lok Sabha answers as a source
- The state tables parsed from answers are in `public/datayt/sources/loksabha/tables/s<N>.json`: each has `id`, `ministry`,
  `subject`, `date`, `url`, `title_lines`, `header_lines`, `rows` ({state: [values]}) and `total`. Code parsed them and does
  not know what a column means. Read the answer's own text before using a table: what was asked, what each column counts,
  the unit, the period, the footnotes, whether the rows are the whole country and whether a total row is printed.
- Data spec: `{"ls": ["<table id>", <column number from 0>]}`. Add `"sum": true` only when the answer prints no total and the
  rows cover every state and UT. For a state's share of the all-India figure on a fact card or the map, add `"as": "share"`.
- Look for a newer answer on the same subject with `python3 scripts/datayt/ls_find.py <words>` and use the newest one that
  has the table.
- Say whose figure it is and when: `source_short` is "Ministry of X · Lok Sabha answer, <date>", and the period is the one
  the table states. A count kept by a ministry (registered, sanctioned, reported by states) is said as that, not as a census.
- Scheme tables (funds released, beneficiaries, posts, projects sanctioned) are not stories. Use answers that count something
  a viewer can picture.

## What the week-three frame check caught (13 Oct 2026)
1. `source` is what the last card prints, in small type under the map. It holds ten lines: at most 590 characters;
   aim for 450.
   Give the publisher, the document and its date, the table, the period and the one caveat that matters. The full
   reference, with row counts and cross-checks, goes in the post pack's `source`, not on the card. The builder now
   refuses a longer one.
2. The figure beside a bar has a narrow column: at most nine characters. A bar unit such as " million ha" wrapped
   onto three lines. Give the bars `"unit": ""` and say the unit in the line under them ("Bars in million hectares.").
3. Game rounds: do not speak the year in the question. "Foreign tourist visits in twenty twenty-four. Rajasthan or
   West Bengal?" took 4.9 seconds and pushed the Short to 48.8 seconds. The year is on the card; say "Foreign tourist
   visits: Rajasthan or West Bengal?". Spoken years run about a second longer than the estimate allows.
4. Accents (`*like this*`) now colour the meaning line of a fact card too. Before, the asterisks were printed.
5. Lines of a statement card should be close in length. One line twice as long as the others shrinks to small type.
6. A map of counts prints whole numbers. Give `"dec": 1` in `map` only if the figures really have a decimal.

## Themed days (AK, 13 Oct 2026)
Every week has 14 Shorts, two a day, and every day keeps to one theme. Two of the seven days carry finance data.
The themes and the posting order are in `public/datayt/bank/themes.json`; `python3 scripts/datayt/week_plan.py` checks
the plan and writes `docs/datakadai/ops/PLAN.md`.

| Day | Theme | What it covers |
| --- | --- | --- |
| 1 | Money (finance) | banks, loans, deposits, savings, pensions |
| 2 | Farm and food | crops, yields, fish, livestock, land |
| 3 | Women | women's work, pay, phones, internet, property |
| 4 | Economy (finance) | state income and output, prices, wages, state budgets, exports |
| 5 | Power and connections | electricity, renewables, telecom, water |
| 6 | School and health | schooling, children's health, hospitals, the body |
| 7 | Know your states | a game, a place story, or what a state is known for |

A script is written for one theme. The two Shorts of a day must differ in format, state and measure.

## Rates built from two tables (finance days)
Totals of money are size effects: Maharashtra has the most deposits because it is large and has Mumbai. Tell a rate.
The builder builds one from two tables, state by state, wherever a data spec goes:
- `{"ratio": [spec, spec], "scale": 100}`: the first over the second, for example personal loans as a share of all
  bank credit: `{"ratio": [{"rbi": [159, "2025"]}, {"rbi": [156, "2025"]}], "scale": 100}`. The all-India figure is the
  ratio of the two India rows when both tables print one.
- `{"add": [spec, spec, ...]}` and `{"minus": [spec, spec]}`: a sum (women plus men) or a gap.
- A two-level column is named in full: `{"rbi": [180, "2024-25 | Female"]}`.
Rules for these figures:
1. Say what the two things are, in the first frame and the title ("of every 100 rupees of bank loans...").
2. Units: bank tables are in ₹ crore, state accounts in ₹ lakh. A ratio of crore to lakh needs `"scale": 10000` for per cent.
3. Bank figures are scheduled commercial banks at end-March; say so in the source line. A deposit is counted where the
   branch is, not where the saver lives.
4. State budgets: use a year of accounts. "RE" and "BE" columns are estimates and must be named as such if used.
5. Money over time is not adjusted for prices. Compare states within one year, or compare shares and ratios across
   years; do not tell a rupee amount "rose" over ten years.
6. Debt, deficits, taxes and pensions are facts about a budget. No judgement of a state or its government, no cause.
7. "Income" is state output per person: output booked in the state, not what residents earn.

## What the themed round caught (13 Oct 2026)
1. Bank credit, Table 156, is by place of sanction to 2018 and by place of utilisation from 2019. Do not divide a
   sector table (157 to 159) by it across that break. Credit used in a state is Table 154 times Table 155.
2. The men's NFHS-5 column for "ever used the internet" (indicator 15, col 3) in `nfhs6_states.json` disagrees with
   NFHS-5's own sheets (India 51.2 in the file, 57.1 published). Do not build on it until it is re-read. The women's
   column matched.
3. Newer editions that are out and not on the drive: the Annual Survey of Industries 2024-25 (30 Sep 2026: factory
   tables 116 to 131), SRS abridged life tables 2020-24 (May 2026: Table 7), RBI's State Finances with 2023-24
   accounts (Jan 2026: Tables 164 to 178 stop at 2022-23 accounts).
4. Exports, Table 181: the 2024-25 state rows cover 88% of the India figure, so a 2024-25 share is too low. Say so.
5. A sector's share of state output can jump in one year (Uttarakhand and Bihar construction, 2022-23). Print the mid
   years; a rise that sits in one step is not a ten-year story.
6. A fact card with bars and a caption holds about 95 characters of meaning text (four lines). A statement card's
   lines should be close in length; digits and % signs run wide.
7. A then-and-now card can show its change in the measure's own unit: `"delta": "units", "delta_unit": " years"`.
8. Spoken length: a card voice with three clauses of figures takes a four-bar beat. One figure, one comparison.


## Week four: Markets, and tables from other publishers (AK, 13 Oct 2026)
AK asked for "more of Market and Money datas" in week four. That week carries its own themes: Money on two days, the new
theme **Markets** (share-market investors, mutual funds, state bonds) on two days, Economy, Farm and food, Know your
states. A week's own themes are listed under `"themes"` in its entry in `themes.json`; the standing seven are unchanged.
- Any state table from another publisher is saved in the Handbook's shape under `public/datayt/sources/<folder>/` and
  read with `{"tbl": ["<folder>/<file without .json>", "exact column name"]}`. A then-and-now script on such a table
  sets `"table": "<folder>/<file>"`. The table's `notes` say what is counted, the page and the as-on date: read them.
- Market tables: `markets/nse_*.json` (National Stock Exchange, Market Pulse) and `markets/amfi_*.json` (Association of
  Mutual Funds in India). Population: `population/projected.json` (National Commission on Population projections from
  the 2011 Census). A per-person rate built on it prints "projected population" and the source on the card.
- An investor is counted where the account is registered, a fund's assets where the investor's address is, a deposit
  where the bank office is. Say which, on the card.
- No advice and no forecast: never "should invest", "safe", "returns", "will rise". Count people and rupees; say the period.

## What week four caught (13 Oct 2026)
1. A card heading (`kicker`) holds 33 characters. A longer one wraps and its second line runs into the state's outline; the
   builder now stops on it. Put the period in the card text or the source chip, not the heading.
2. Rupee amounts on a card: `"unit": "₹"` prints Indian grouping and no decimal (₹3,08,909). With `"unit": ""` the same
   figure printed as 308,909.1.
3. The last card's source text sits under the map note. With a three-line note and a map legend it holds about 430
   characters, not 590. A long list (blank states) belongs in the post pack.
4. A card with four bars pushes its small caption down beside the channel name: keep that caption under 35 characters.
5. `--check` used to skip `"tests"` for fact and paradox scripts. It runs them now; a script that "passed" before
   13 Oct 2026 was only tested on its `"checks"`.
6. Name the second-placed state from the full ranking, never from memory (an editor found Telangana named where
   Maharashtra was second).
7. When a table covers one scheme's units or one kind of bank, say so in the hook and the title ("STP units",
   "public-sector bank gold loans", "regional rural banks").
8. A publisher can relabel its states or categories (AMFI: state list March 2026, scheme categories August 2026; NSE: two
   states' rows swapped in two issues). Read at least two editions before comparing a state across time.
9. A live web page as a source: save the table with the date and time read, and never voice a line a later update
   will contradict ("no other state reached twenty thousand").
10. A per-person figure uses `population/projected.json` (the July 2020 edition) and prints "projected population".

## The evergreen bank (AK, 14 Oct 2026)
`docs/datakadai/bank/EVERGREEN.md` lists facts that rest on something slow (geography, a census, a count of things built
or notified rarely, a date in a law), each read at the publisher, ranked by Jev. Their tables are in
`public/datayt/sources/evergreen/` and are read with `{"tbl": ["evergreen/<table>", "<column>"]}`. A fact there is a checked
lead: write the script to this guide, carry the fact's `caution` and `stays_true` into the card and the pack, and re-read
the publisher if the as-on date is more than six months old.
- Census 2011 figures say "Census 2011" on screen; the next census's results are expected from 2027.
- The 2025 coastline figures were recalculated: say "recalculated", never "grew".
- Forest cover is tree canopy of every kind (plantations and orchards included): say "forest cover", not "forest".
- Facts from one table tell one story: one per fortnight.

## What week five caught (14 Oct 2026)
1. The map's sub line (under its title) holds one line of about 58 characters once `{india}` is filled in. Two ran to
   two lines ("% of investors, gender disclosed · …", "colleges ÷ universities, AISHE-registered · …"). Put the
   qualifier in the map note.
2. The 165-character limit on a map note is a ceiling, not a target: a note of long words (state names, brackets) took four
   lines at 162 characters and met the source text on the last card. Aim for about 140.
3. A fact card's small caption runs beside the channel name when it takes two lines: keep it to one (about 50
   characters). "1 lakh = 100,000. End-March 2025." is enough; the source line carries the rest.
4. A table row the map cannot place (Census 2011 prints Dadra and Nagar Haveli, and Daman and Diu, as two rows) goes in
   the map's `"drop"` list, and the map note must name it; the builder checks both. No zero-term workarounds.
5. A question-style hook ("More bank offices per person: more women banked?") is new outside the games: it waits for AK.
6. Two Shorts from one survey round (NFHS-6 ran three times in week five) can share a week, not a day, and each must
   name its own row.

## What the festival round caught (16 Oct 2026)
1. An all-India item story uses the `basket` type: `{"item": [table, code, column], "item_name": "..."}` reads one row of MoSPI's item table, and the builder checks the row's own name. Any figure typed into a card, the reading, the hook or the title must be one the story reads, or the build stops.
2. Name the item as MoSPI names it. "Gold /diamond /platinum jewellery" is not the price of gold; "Motor car and jeep" is cars, not "a car"; MoSPI's "Coconut" fell while "Green coconut" rose, so show both or say which.
3. A price Short posted around a festival must say its period in the hook and title ("in a year", "since last September") and "provisional" in the top bar, or viewers read it as this week's prices. Never "festival prices" for September data.
4. Map a group or division by state, not a single item: MoSPI cautions that state-level item indices can rest on thin samples. Put the caution in the source line.
5. MoSPI's bus-and-coach figure covers commuting fares only; it does not fit a travel-home story.
6. A quote from a publisher (UNESCO) is checked word for word against a saved copy (`"quotes"` in a `place` script); headings use the publisher's own name for the thing.
7. The plain `end` card prints asterisks literally; use emphasis only on a `mapend` question.
