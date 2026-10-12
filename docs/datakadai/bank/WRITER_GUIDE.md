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
- Built length 30 to 45 seconds.
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
    tests and the house rules and estimates the length (30 to 45 seconds; aim for 35 to 41).
