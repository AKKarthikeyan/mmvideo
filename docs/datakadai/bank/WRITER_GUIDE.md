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
