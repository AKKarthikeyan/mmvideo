# Look B, POL-03 Parts 1-2 (Fundamental Rights): new `analogy` variants (contract, 10 Nov 2026)

Read `CONTRACT_B.md` first: the look, the rules and the checks there all apply unchanged. Read `CONTRACT_B_GEO04.md` for the builder
workflow (records, helper files, labels, stills), and one finished builder file for the entry shape (`scenes/analogy_e1.tsx` and
`scenes/analogy_e1_barter.tsx`). Every other film must still render unchanged.

**This film is the Constitution in daily life.** Viewers: a UPSC aspirant, a curious 12-year-old, a parent. Every picture makes one legal idea
obvious without the narration, never shows more than the narration and the claims say, and stays neutral on contested ground.

## The films
- Compositions `LONG-pol03-p1-B` / `-B60` and `LONG-pol03-p2-B` / `-B60` in `src/looks/upsc_rich_b/films_index.tsx` (player `RichLong.tsx`).
- Storyboards `public/datayt/long/upsc/pol03-p1/storyboard.json` (24 scenes) and `.../pol03-p2/storyboard.json` (20 scenes); each scene's
  `visual` is the art note: follow it. Timelines beside them are estimated; motion must depend only on `f`, `dur` and `at(key)`. Never edit them.
- Scripts: `/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/POL-03/SCRIPT_P1.md` and `SCRIPT_P2.md`. Read each beat before drawing.
- Spec `{which, mode?, chip, limit, labels: [{text|lab, key}]}`; labels `{lab}` print `lab(key)` (keys `f3_*`). Labels only from `at(key)`.
  Article numbers and years in plain-text labels are fine; never type any other figure.
- Your record: `scenes/analogy_w1.tsx` ... `_w4.tsx`; art in `scenes/analogy_w<N>_*.tsx` only. Never edit another builder's files or shared files.

## Rules for this subject (check every drawing)
- **Neutral and respectful.** No party symbols, flags of parties, slogans or politicians. No real person's face: judges, petitioners and
  public figures appear only as name plaques, robed silhouettes with no features, or empty chairs. Ordinary people are generic and varied
  (`girl.tsx`, the kit's `Person`), never a caricature of any caste, religion, region or community; no community is labelled by look or dress.
- Courts and Parliament: generic classical buildings, no emblem or logo copies (a plain pediment is fine; no Ashoka lion capital, no wheel
  copied from the flag). Documents (orders, passports, reports) are generic papers with a title line; no real seal, no real signature.
- Reservation scenes show the law and the record only: bars, scales, chairs, papers. No crowds of protesters, no dramatisation.
- Untouchability (Art. 17): show the abolition, a broken chain or an open well and many hands; never a scene of abuse.
- Prison and police scenes: calm and factual, no violence, no handcuff close-ups.
- Judges' splits: majority chairs and dissent chairs are labelled by count only (the labels carry the numbers).

## Group W1 (owns `analogy_w1*.tsx`), Part 1 opening
- `ghat-steps`: `mode:"dawn"` (P1 s001) river steps at dawn, people of every kind walking down to the water; `a1` a small plaque, `pl` the list of
  places written along a step. `mode:"open"` (P1 s014) the same steps by day, open to all; then a women's seat on a bus and a school ramp appear at
  the side; labels `a15`, `pl`, `wr` (a small 'as we read it' note), `wc`.
- `balance`: a brass balance scale on a desk. `mode:"wobble"` (P1 s003) EQUALITY pan (`eq`) vs RESERVATION pan (`rs`), wobbling.
  `mode:"steady"` (P1 s016) a paper clause slides into the EQUALITY pan and the scale steadies; labels `c4`, `ar`, `nv`, `f4`.
  `mode:"balanced"` (P1 s022) the scale level, the limits written on its base; labels `pp`, `lm`.
- `series-path` (P1 s004 `part1`; P2 s003 `part2`, s020 `part3`): a three-stop path across a landscape, stops labelled `p1`, `p2`, `p3`; the stop of
  the mode glows, the others dim.
- `wants-rights` (P1 s005): the girl's notebook with two columns WANTS (`wn`) and RIGHTS (`rt`); a phone slides into WANTS, a public well into
  RIGHTS; `jc` heads the page; `cs` a note at the bottom.
- `bill-glass` (P1 s006): a scroll unrolls into a book labelled PART III (`p3`); a vote counter pushes towards it and stops at a glass wall
  (`mj`); a courthouse door opens (`ct`); `br` a note card.
- `state-buildings` (P1 s007): a skyline of generic public buildings lighting up one by one under a roof label THE STATE (`st`); `ls` lists
  them; a public-sector corporation building joins the row (`ah`).
- `rulebook` (P1 s008): a thick rulebook, pages labelled ORDINANCE, RULE, NOTIFICATION, CUSTOM fanning out (`lw`); one page that crosses a right
  greys out and gets a VOID stamp (`vd`); `a13` a title tab.

## Group W2 (owns `analogy_w2*.tsx`), Part 1 equality and reservation
- `frame-crane` (P1 s010): the Constitution as a building; a crane swaps bricks (`am`, `a4`), but a glowing inner frame cannot be touched (`ks`,
  `bs`).
- `two-circles` (P1 s011): two circles, EVERY PERSON (`ep`) and inside it CITIZENS (`ci`), article numbers dropping into each; `nc` a corrected note.
- `judge-scale` (P1 s012): a scale with two generic figures of different rank on the same pan (an official, a domestic worker: no faces of real
  people), then two queues treated alike; labels `a14`, `eb`, `ep`.
- `three-cards` (P1 s015): three cards: a job notice open to all (`a16`); a broken chain across a village well with many hands (`a17`, `lw`); a
  crossed-out title scroll beside a military medal and a degree (`a18`).
- `runners` (P1 s017): two runners at different starting lines on a track; a ramp lifts one to the line; a small balance labelled EFFICIENCY;
  labels `uq`, `a46`, `a335`. No caste or community marks on the runners.
- `mandal-desk` (P1 s018): a report on a desk (`mr`); an order stamped with its year (`c27`); a court plaque (`is`); a family pyramid with its
  well-off top shaded out (`cl`).
- `vacancy-bar`: a long bar of a year's vacancies. `mode:"half"` (P1 s019) a bright line at the half mark; coloured blocks fill up to it; a block
  that tries to go above is stopped; labels `r5`, `hf`, `jp`. `mode:"ews"` (P1 s020) a 10% block sits above the half line (`ew`); five empty
  judges' chairs, three green and two amber (`sp`, `ds`); `mh` a quote card; `ar` the arithmetic card. Block widths to scale from the figures
  named in the labels (15, 7.5, 27, 10 parts of 100).
- `sc-tree` (P1 s021): a tree whose trunk is a list card, branching into groups, each branch with a small data chart (`sc`); a court plaque (`dv`,
  `s61`); a separate scroll labelled ONE JUDGE'S OPINION with three signature lines (`gj`); a small promotion ladder (`pr`).

## Group W3 (owns `analogy_w3*.tsx`), Part 2 opening and liberty
- `prison-gate`: `mode:"tease"` (P1 s024) a prison gate in grey light, its lock glinting; `nx`. `mode:"closed"` (P2 s001) the same gate, a
  calendar's pages flying past for decades; `ns`, `ml`. `mode:"open"` (P2 s018) the gate opens onto daylight; `mg`, `pt`.
- `six-doors`: `mode:"open"` (P2 s004) six doors in a row, each opening on its scene (a speaker, a peaceful gathering, a union meeting, a train, a new
  home, a shop); `a19`, `d1`-`d6`. `mode:"gates"` (P2 s005) each door gets a small gate with a sign of its limits; `rr`, `sp`, `mv`.
- `phone-66a` (P2 s006): a phone with a post; a law-book page labelled 66A tears out and falls; `ss`, `sd`.
- `court-shields` (P2 s007): a warm courtroom; three shields appear in front of a generic accused, one per protection; `a20`, `s1`-`s3`.
- `glass-boxes`: `mode:"boxes"` (P2 s008) rights as separate glass boxes on a shelf; a stamped rulebook alone opens the liberty box; `a21`,
  `gp`, `nc`, `oe`. `mode:"web"` (P2 s009) a passport stamped IMPOUNDED (`pi`); seven empty judges' chairs, six together and one apart (`mg`, `dj`);
  the boxes melt into one connected web (`ov`); `t14`.
- `privacy-search` (P2 s010): a search box over the Constitution's text, 'privacy', 0 results (`z`); then nine empty chairs on a bench (`nj`);
  `pv` the holding.

## Group W4 (owns `analogy_w4*.tsx`), Part 2 the widening and the safeguards
- `three-gates` (P2 s011): a phone, a bank card and a health app glow; three gates LAW (`g1`), LEGITIMATE AIM (`g2`), PROPORTION (`g3`) stand before
  them; `lo` a small plaque; `dt` a data note; `dp` a law card.
- `tree-21` (P2 s012): a tree from a seed labelled ARTICLE 21, branches EDUCATION (`ed`, with `nc` a small note), LIVELIHOOD (`lv`), WATER AND AIR (`wa`).
- `police-desk` (P2 s013): a calm police-station desk: an arrest memo signed and witnessed (`dk`), a clock (`h24`), a phone call to a relative;
  `a22`, `gr`.
- `detention-calendar` (P2 s014): a calendar marked at three months with three robed, faceless figures (an Advisory Board) (`m3`); a second
  calendar marked two months behind glass labelled NOT IN FORCE (`m2`); `pd`.
- `emergency-door` (P2 s015): a courthouse door half shut by a bar labelled EMERGENCY (`em`); two small doors marked 20 and 21 stay open (`ns`);
  `adm` a card.
- `stadium-wage` (P2 s016): a stadium under construction, 1982 light; a wage slip below a minimum line (`pu`); a contractor's office receiving the
  same notice as a government office (`pc`); `a23`, `ag`.
- `mine-school` (P2 s017): a school bag replaces a pick at a mine entrance (`a24`); a sanitation machine replaces a bucket (`ms`).

## Checks
As in `CONTRACT_B_GEO04.md`: stills at start, middle and end of each scene
(`npx remotion still src/looks/upsc_rich_b/films_index.tsx LONG-pol03-p1-B out/upsc/pol03/<which>_<scene>_<frame>.png --frame=<f> --scale=0.5`,
or `LONG-pol03-p2-B` for Part 2), viewed with the Read tool, fixed; one 2-second stretch at 60 fps. Report files written and anything imperfect.
