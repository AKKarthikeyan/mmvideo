# Look B, ECO-16 Part 2 ("Where Does a Bank's Loan Money Come From?"): new `analogy` variants (contract, 5 Nov 2026)

**Read `CONTRACT_B_ECO1.md` first, and treat every rule in it as binding here too** (the look, the number and label rules, event keys, accuracy
rules, no copied currency or logos or faces, adults in the realistic style, the checks). Read `CONTRACT_B.md` and `CONTRACT_B_P2.md` for the look,
and the finished Part 1 builder files (`scenes/analogy_e1*.tsx`, `analogy_e2*.tsx`, `analogy_e3*.tsx`) for the entry shape and parts you may import
(read only; do not edit them). Part 1 of this film and both monsoon films must still render unchanged.

## The film
- Compositions `LONG-eco16-p2-B` (30 fps, for stills) and `LONG-eco16-p2-B60` (60 fps). Storyboard `public/datayt/long/upsc/eco16-p2/storyboard.json`
  (28 scenes; each has `visual`, a one-line art note: follow it), timeline `.../eco16-p2/timeline.json` (estimated now; replaced by the measured voice
  timing later, so motion is a function of `f`, `dur` and `at(key)`). Never edit them. Built by `scripts/upsc/eco16_p2_storyboard.py`.
- Find your scenes: `python3 -c "import json;[print(s['id'],s['spec'].get('which') or s['kind'],s['visual']) for s in json.load(open('public/datayt/long/upsc/eco16-p2/timeline.json'))['scenes']]"`
- The narration is in each scene's `vo`; the full script is `/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/ECO-16/SCRIPT_P2.md`
  (the rendered form may be regenerated: read the beat for each scene so the picture follows the words).
- Fill your record: `scenes/analogy_f1.tsx` (F1), `analogy_f2.tsx` (F2), `analogy_f3.tsx` (F3): replace the placeholder entries with `{Art, Labels, bg}`;
  keep every `which` key. Helper files `analogy_f1_*.tsx` etc. Edit nothing else (not `analogy.tsx`, the registry, `kit.tsx`, `analogy_kit.tsx`, the
  storyboard, the timeline, `figures.json`; ask in the report).
- Numbers: tables `e16_p2` (dep 100, keep 20, loan 80, total 180), `e16_lala` (gold 100, lent 25, receipts 125, kg), `e16_rounds` (rr 20, r0 100,
  r1 80, r2 64, total 500, reserves 100, loans 400, mult 5), `e16_mult` (plain 33.33, cdr 0.1496, full 6.40, crr 3.0), `e16_crr` (c45 4.5, c425 4.25, c4 4.0, c375 3.75,
  c35 3.5, c325 3.25, c3 3.0, slr 18.0), `e16_ins` (lakh 5), `e16_spread` (lend 200, rl 5, rd 2, earn 10, cost 4, gap 6, savings 2.5). Use `fig({t:"e16_p2", state:"India", s:"loan"})`
  style reads for every amount that sets a size, a height, a count or a printed value; label items `{lab:"e16_h80"}` read `lab()`. Text items in the storyboard
  (`{text, key}`) print as given. All counts and heights come from the tables, never typed.
- Event keys: a key named in the storyboard's `reveals` but not in `labels` does not exist in the specs here; every reveal key is also a label key in this film.

## Group F1: people and story scenes (owns `analogy_f1*.tsx`)
- `deposit-hook` (b00; the hook, make it striking; ref `e16_p2`): a bank counter, atlas painted, with a clerk and a customer; the customer slides a generic
  hundred-rupee note across; at `d1` an account bar for the customer rises to the `dep` value (label `e16_h100`); at `k` a small reserve block of `keep` splits off (label `e16_h20`);
  at `l` a second bar for a borrower grows to `loan` out of the same vault (label `e16_h80`); at `t` a counter above the two bars adds up to `total` (label `e16_h180`) while a big
  question mark pulses between them. The question must feel unresolved: do not show where the 80 comes from.
- `goldsmith` (3 scenes, same village set, an Indian village market at warm light): `mode:"receipts"` (b02a): Lala the goldsmith in his shop (scales, a safe, small gold
  bars), villagers handing over bars and getting paper receipts; at `rm` receipts pass from hand to hand at a market stall (the receipts are the money); labels `nl` (a signboard), `gb`, `rc`, `rm`.
  `mode:"lend"` (b02b; ref `e16_lala`): Ramu (a farmer) asks for a loan; Lala looks at the quiet village and decides; Lala hands Ramu a bar; Ramu pays Ali with it; Ali leaves it with
  Lala for a fresh receipt; a pile of receipts in circulation counts up from `gold` to `receipts` (label `e16_l125` appears at `t125`); labels `rk`, `na`, `al`, `t125`. The receipt
  must appear only when Ali re-deposits, not when Lala lends. `mode:"moral"` (b02c, chip NCERT'S STORY): the counter with a faint glow around the new receipts; a thought bubble `tt` with
  a question; a stamp `mu` A MADE-UP STORY lands; a plain bank building fades in behind with the label `mb`.
- `queue-calm` (b03): two panels side by side: left, a long worried queue at the goldsmith's door with Lala wiping his brow (label `q`); right, a calm village staying home (label `nw`);
  a tag `kp` and a confidence meter `cf` that rises as the right panel plays. The queue is a "what if", not a happening: draw it a little ghosted.
- `part3-street` (b20): a street at warm light: a moneylender's low table with a ledger on one side, a plain bank counter with a queue of one on the other, a phone tap at a cart in the
  middle; three question cards `wg`, `pp`, `lo` appear in turn (who gets a loan, at what price, who is left out); at `p3` a frame appears with PART 3. No mocking of any person or group.

## Group F2: a bank's books and the arithmetic (owns `analogy_f2*.tsx`)
- `ledger` (2 scenes): a brass-and-paper two-sided ledger on a desk. `mode:"start"` (b04): left side ASSETS (a RESERVES slot and an empty LOANS slot), right side LIABILITIES (a DEPOSITS slot);
  labels `bs`, `as`, `li`, `rv`, `st` (the label `e16_h100`: a 100 block sits in reserves and the same 100 in deposits, `dep`). `mode:"loan"` (b05): at `nd` a new block of `loan` appears on the
  deposits side labelled with the borrower's name (`bn`); the loans slot fills with a matching block; the original `dep` block stays; at `ms` a counter above the ledger ticks from `dep` to
  `total`; label `t` is the `e16_h180` card. Do not draw reserves changing: NCERT's text does not say.
- `vault-crr` (b06): a bank vault door with a big dial (CRR); behind a glass panel the deposit bar is shaded with a fixed fraction labelled RESERVE (`sh`); labels `cr`, `nd` (a small card),
  `bk` (a plain RBI building with an arrow: a balance with the Reserve Bank), `lg` (a hand-stop sign: STOP OVER-LENDING).
- `rounds-stairs` (b07; ref `e16_rounds`): a staircase of coin stacks, atlas painted: step 0 is the first deposit (`r0`, the `r0` value, drawn differently from the loans), then loans `r1`, `r2`, shrinking by the
  same fraction in a fading row (a few more steps, unlabelled, the ratio from the table); a running total of deposits on the side climbs toward `total` and settles there; a pie at the end splits
  `reserves` and `loans`; label `rr` is the 20% badge; label `tot` the closing card. Heights follow the table values and the geometric ratio `r1 ÷ r0`.
- `gear-multiplier` (3 scenes; refs `e16_rounds`, `e16_mult`): brass gears on a workbench. `mode:"plain"` (b08): a small gear labelled RESERVES · 100 turns a big gear labelled DEPOSITS · 500 (gear ratio from the
  table); badge `mm` MONEY MULTIPLIER = 5; the formula card `fm` 1 ÷ r slides in. `mode:"leak"` (b09a): the same gears; coins roll off the big gear into a wallet (`lk`); a card `cd`; the IGNOU formula card `fm`.
  `mode:"toy"` (b09b; limit set): a readout dial: at `c33` it shows the plain multiplier `plain` (printed 33) for the 3% CRR; at `c64` it drops to `full` (printed 6.4) as the leak is drawn; at `toy` a stamp
  TOY CEILING · NOT FORECASTS lands. Printed values from `fig`/`lab`; dated captions are the storyboard text.
- `crr-timeline` (2 scenes; ref `e16_crr`): `mode` default (b10a): a horizontal dated timeline with a round CRR dial: a small note at the left `n5` (NCERT Class 10 line), the dial reads `c45` until mid-December 2024
  (`c45` card), turns to `c4` at the end of that month (`c4` card), pauses, then clicks `c375`, `c35`, `c325`, `c3` across September to November 2025 (the `cuts` card), ending at `c3` with the `c3` card, in the order of the
  narration (keys `n5`, `c3`, `c45`, `c4`, `cuts` appear in the order the storyboard's reveals give; keep the dial's motion in the same order). `mode:"slr"` (b10b): a second vault door SLR, open to show cash, gold bars and
  government-bond folders; labels `sl`, `la`, `mn` (the `slr` value printed as 18%).
- `rbi-panel` (b11): a control panel with five dials in two groups, QUANTITATIVE (CRR, bank rate, open market operations) and QUALITATIVE (moral suasion, margin requirement, drawn as dials with a small "e.g." tag);
  at `up` the CRR dial turns up and a small money bar beside it shrinks, banks' lending arrows shorten; labels `up`, `qn`, `ql`.
- `omo` (b12): a bond certificate passes from a dealer to a plain RBI building (`om`, `bu`); a cheque flies back and lands in a bank's reserve bar, which rises; the reverse trade (`se`) makes it fall; at `ll` a
  lifebuoy tag appears on the RBI building: LENDER OF LAST RESORT.

## Group F3: the plan, the debate and the wrap (owns `analogy_f3*.tsx`)
- `plan-steps` (2 scenes): `mode:"questions"` (b01a): a notebook page (like the exam notebook's paper) with last time's finding at the top (`pr`) and two questions handwritten in turn (`q1`, `q2`).
  `mode:"steps"` (b01b): four numbered boxes tick in turn (`s1`, `s2`, `s3`, `s4`); a three-stop path beneath: PART 1 (done, dim tick), PART 2 (lit, `p2`), PART 3 (dim).
- `two-views` (b13): two big cards face to face: TEXTBOOK (`tb`: reserves → loans → deposits as three small blocks in a line) and a STAFF ARTICLE card (loans → deposits); a brass plaque BANK OF ENGLAND STAFF · 2014 (UK) (`bo`);
  at `mc` the staff card's first line appears; at `nm` two crossed-out arrows (not simply lending out deposits, not multiplying up reserves); at `qb` a small tag "an article in the Bank's Quarterly Bulletin".
  Neutral: no card is drawn as the winner.
- `limits-balance` (b14): a loan counter with three weights pressing on it, PROFIT (`pf`), RULES (`ru`), DEMAND AND PORTFOLIO CHOICES (`dm`); above them a dial INTEREST RATE POLICY (`ir`); a brass plaque BUNDESBANK · MONTHLY REPORT
  · APRIL 2017 · EURO AREA (`bb`); `ex` a card "not tied to excess reserves". Do not name any bank or country other than the plaque.
- `reserve-world` (2 scenes): `mode` default (b15a): a wall of reserve-ratio dials, one set to ZERO labelled US (`us`: 26 March 2020); two textbooks on a shelf NCERT and IGNOU (`mt`), a small tag "still teach the multiplier".
  `mode:"mix"` (b15b): two toolboxes labelled EXOGENOUS (`ex`) and ENDOGENOUS (`en`) with a bridge; a mixing dial in the middle (`mx`: more likely a mix); a notebook tag `nv` NAME THE VIEW.
- `depression-lines` (b16; chip ILLUSTRATION): a sketch chart with no axis numbers: a line for MONEY falling and a line for the BASE rising (a widening gap), drawn from the narration's words (about −35% and about +20% as
  labels `mo`, `bs`; the drawn slopes keep the same sign and a plausible ratio, not exact); two small vignettes at the bottom: a queue at a bank door (`pm`) and a vault of unused cash (`xr`); `us` a title card; `fs` a name plaque
  FRIEDMAN AND SCHWARTZ, AMONG OTHERS. No faces.
- `deposit-insurance` (b17): a passbook under a clear umbrella labelled DICGC (`di`); a coin stack marked 5 LAKH (`cap`; value from `e16_ins`) slides under it; `pi` principal + interest together; `pr` the bank pays the premium
  (a small arrow from a bank building to the umbrella); a second panel at the right with the earlier queue ghosted and the card `aim` (stated aim: public confidence, particularly for the small depositor). Do not imply the insurance
  stops a run.
- `spread` (b18; ref `e16_spread`): two stacks of the same `lend` rupees side by side: the left leaves the bank and comes back with a stack of `earn` (label `ln`); the right comes in from a depositor and costs `cost` (label `dp`); the gap `gap`
  glows in the bank's till (label `ea`, "before its own costs"); `sp` the term card SPREAD; `sr` a small note with the savings rate `savings` (3 Nov 2026).

## Checks
As in `CONTRACT_B_ECO1.md`: stills of each scene at start, middle and end with `npx remotion still src/index.ts LONG-eco16-p2-B out/upsc/eco16p2/<scene>_<frame>.png --frame=<global frame> --scale=0.5` (global frame = the scene's `from` + a local frame),
open each PNG with the Read tool and fix: richness below the sample scenes, text outside x 96-1824 / y 64-920, overlaps, a label before its reveal, unreadable type, a picture that claims more than its narration. Also one Part 1 monsoon still
(`LONG-geo07-p1-B`) and one ECO-16 Part 1 still (`LONG-eco16-p1-B`) that use a file you touched, to prove nothing else changed. Do not render the whole film. Report: files changed, scenes checked, anything you could not do, any storyboard word or
reveal you need changed.
