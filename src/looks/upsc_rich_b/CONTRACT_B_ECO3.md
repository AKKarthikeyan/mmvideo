# Look B, ECO-16 Part 3 ("Who Gets a Loan? And How Does Your Money Move?"): new `analogy` variants (contract, 6 Nov 2026)

**Read `CONTRACT_B_ECO1.md` and `CONTRACT_B_ECO2.md` first and treat every rule in them as binding here** (the look, the number and label rules, event keys,
accuracy rules, no copied currency or logos or faces, adults in the realistic style, name plaques with names only, the checks). Read `CONTRACT_B.md` and
`CONTRACT_B_P2.md` for the look, and the finished builder files of Parts 1 and 2 (`scenes/analogy_e*.tsx`, `analogy_f*.tsx`: read only) for the entry shape and
parts you may import (people, shop and street props, ledgers, bars, plaques, balances, notebook paper). Parts 1 and 2 of this film, and both monsoon films, must still render unchanged.

## The film
- Compositions `LONG-eco16-p3-B` (30 fps, for stills) and `LONG-eco16-p3-B60` (60 fps). Storyboard `public/datayt/long/upsc/eco16-p3/storyboard.json`
  (27 scenes; each has `visual`, a one-line art note: follow it), timeline `.../eco16-p3/timeline.json` (estimated now; replaced by the measured voice timing
  later, so motion is a function of `f`, `dur` and `at(key)`). Never edit them. Built by `scripts/upsc/eco16_p3_storyboard.py`.
- Find your scenes: `python3 -c "import json;[print(s['id'],s['spec'].get('which') or s['kind'],s['spec'].get('mode',''),s['visual']) for s in json.load(open('public/datayt/long/upsc/eco16-p3/timeline.json'))['scenes']]"`
- The narration is in each scene's `vo`; the full script is `/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/ECO-16/SCRIPT_P3.md` (regenerate it with
  `python3 scripts/upsc/script_tool.py research/upsc/ECO-16/script_p3.py --wpm 161` from `/Volumes/DarwinSSD/DataKadai/mmvideo-dk` if missing). Read the beat for each scene so the picture follows the words.
- Fill your record: `scenes/analogy_g1.tsx` (G1), `analogy_g2.tsx` (G2), `analogy_g3.tsx` (G3): replace the placeholder entries with `{Art, Labels, bg}`; keep every `which` key.
  Helper files `analogy_g1_*.tsx` etc. Edit nothing else (not `analogy.tsx`, the registry, `kit.tsx`, `analogy_kit.tsx`, the storyboard, the timeline, `figures.json`; ask in the report).
- Numbers: tables `e16_debt` (rf 66, ri 34, uf 87, ui 13: percent of outstanding cash debt, rural and urban), `e16_graph` (banks 51, coop 10, otherf 5, formal 66, mlender 23, relatives 7, otheri 3, landlords 1, informal 34),
  `e16_jd` (accounts 59.09 crore, women 55.7, rural 77.8), `e16_upi` (upi_cr 2271.6, avg 1273, ratio 534, rtgs_cr 3.19, rtgs_avg_lakh 72, cheque_lakh 425.55, upi_lakh 227160.66), `e16_shg` (savings 144.22 lakh, credit 77.41 lakh),
  `e16_comp` (p 1000, r 6, y 12, final 2012.20). Read them with `fig({t, state:"India", s})`; every bar length, count and printed value that comes from a table is read from it. Text items in the storyboard
  (`{text, key}`) print as given (including figures in captions). Every reveal key is also a label key in this film.
- NCERT facts the pictures must respect (Class 10 ch.3 and Class 7): moneylenders **keep no records**: never draw a ledger on a moneylender's table; SHG members each save a small amount; banks lend to such groups even without collateral because
  the group is responsible for repayment (do not draw group collateral); the formal sector figures are institutional agencies.

## Group G1: people and story scenes (owns `analogy_g1*.tsx`)
- `two-borrowers` (2 scenes; the hook, make it striking): `mode:"salim"`: a shoe workshop, Salim (adult, apron) and workers stitching, stacked shoe boxes, a trader's van at the door; a big order sheet; the boxes load into the van;
  money moves back to the trader at the end (repaid) while a profit tag glows (labels `sl`, `od`, `pf`). `mode:"swapna"`: a small field of groundnut, Swapna (adult woman farmer) in the field, a moneylender at the gate holding a few notes
  (no ledger); the plants wilt (the crop fails, `cf`); a "land" tile separates from the field and goes to the moneylender (`ld`); at `op` a banner SAME TOOL · OPPOSITE RESULTS crosses the frame with two small thumbnails of the two stories; at `q`
  the question grows.
- `supervision` (b06): left, a bank counter, a clipboard-holding RBI official's desk with a minimum-cash gauge (`cb`) and a reports tray (`rp`: three small tags how much, to whom, at what rate); right, a moneylender's low table with a few notes
  and an empty chair, nothing written down (label `is`); labels `fs`, `cb`, `rp`, `is`.
- `shg-circle` (2 scenes): `mode:"group"` (b08a): a circle of 15 to 20 people (women and men, varied) on a floor mat in a village courtyard, a savings box and a passbook at the centre; coins drop in on a regular beat; at `el` a bank officer arrives
  with a file marked GROUP LOAN; labels `sg`, `mb`, `sv`, `el`, `gp`. `mode:"numbers"` (b08b; ref `e16_shg`): two stacks of small group icons side by side, the larger for savings-linked (`savings`), the smaller for credit-linked (`credit`);
  labels `nb`, `sl`, `cl`; heights follow the table.
- `nobel-grameen` (b09): a brass prize plaque NOBEL PEACE PRIZE · 2006 · YUNUS AND GRAMEEN BANK (names only, no faces, no medal copy: a plain disc), a village group at a table in a courtyard behind it; at `wm` a share badge "over 95%" (text from the
  label) with a group of women icons; labels `gb`, `nb`, `ef`, `wm`.
- `payment-modes` (b13): a counter with a withdrawal slip and notes (`ca`), an ATM with a debit card (`ca`), a cheque on a clipboard with a clock beside it (`ch`), a PoS machine and a phone with a QR code (`el`), each lighting in turn; `hm` title.
- `upi-chain` (b14): a shop with a QR code card and a phone; a four-box chain of icons PAYER'S APP, PAYER'S BANK, NPCI (a lock for the PIN check: `nc`), RECEIVER'S BANK with a flowing coin; `up` the title card, `np` a badge, `qr` the code; `pa`, `pb`, `rb` highlight in turn.
- `fraud` (b16): a phone showing an incoming message with a link and a red cross (`lk`), a hand covers an OTP box (`sh`), a stranger silhouette (no face) at a distance, a helpline card 1930 glows (`hl`); `fr` the headline.
- `part-wrap` (b19): three panels fade in in a row, the finale of the series: Part 1 the money bar (cash a thin slice, deposits the rest; `p1`), Part 2 the ledger with a new block growing (`p2`), Part 3 the two fields of Salim and Swapna (`p3`, `ss`); at `rs` a balance tips between RISK and SUPPORT in the last panel.

## Group G2: bars, tables and diagrams (owns `analogy_g2*.tsx`)
- `credit-terms` (b02): a loan agreement on a desk; `cr` a header; two small cards `ls`, `bp`; then four stamped boxes light in turn: `ir` INTEREST RATE, `dc` DOCUMENTS, `mr` MODE OF REPAYMENT, `co` COLLATERAL (a small house and a tractor beside it with a
  padlock); `tc` the term card TERMS OF CREDIT.
- `debt-bars` (2 scenes; ref `e16_debt`): `mode:"kinds"` (b04a): two columns FORMAL (a bank and a cooperative icon; `fm`) and INFORMAL (a moneylender, a trader, an employer, relatives and friends; `if`). `mode:"bars"` (b04b): two long horizontal bars RURAL and URBAN,
  each split into institutional (formal) and non-institutional in the table's proportions (rural `rf`/`ri`, urban `uf`/`ui`); `sv` a source card (NSO · NSS 77th round · debt on 30 Jun 2018), `rr`, `ur` the bar labels; printed values from the table.
- `graph-trap` (b05; ref `e16_graph`): a textbook page card with the sentence "formal lenders meet only about half" underlined in red (`tx`), a bar-graph card whose formal slices (banks, cooperative, other formal) stack to the `formal` value and the informal
  slices to `informal` (`gr`); a stamp BOTH ARE IN NCERT (`bt`); a notebook tag USE THE GRAPH, NAME THE SURVEY (`sv`). The stacked formal slices must add to 66 exactly as the table gives them.
- `jan-dhan` (b10; ref `e16_jd`): a row of passbooks growing into a wall (the count of the wall's blocks is illustrative, labelled with `ac`); two split bars: the women's share of account holders (`wm`, value `women`) and the rural and semi-urban share
  of accounts (`ru`, value `rural`); `pm` the title card; `mf` a small source note. No flags, no leaders, no faces.
- `accounts` (2 scenes): default (b12a): three passbooks fan out: SAVINGS (`sa`), CURRENT (`cu`), FIXED DEPOSIT (`fd`), each with a small icon (interest, business, a clock). `mode:"compound"` (b12b; ref `e16_comp`): a seedling of coins on a desk
  grows year by year, a year counter ticks from 1 to `y`; the pile reaches the `final` value (height follows `final ÷ p`); labels `cm`, `p`, `yr`, `fv`.
- `upi-compare` (2 scenes; ref `e16_upi`): `mode:"upi"` (b15a): a vast strip of tiny coins fills the frame (`up`); an average tag `av` (value `avg`); a source note `sr` (provisional). `mode:"compare"` (b15b; limit set): three horizontal strips: UPI (a vast
  strip of tiny coins), CHEQUES (a thin strip; the UPI to cheque ratio is `ratio`: a ratio badge `rt` 534 : 1), RTGS (a few very large blocks, `rg`: counts `rtgs_cr`, average `rtgs_avg_lakh`). The strips are not to scale (the `limit` line says so): draw them as a schematic.

## Group G3: stories, ladder, institutions and the exam question (owns `analogy_g3*.tsx`)
- `plan-steps-3` (2 scenes): `mode:"recap"` (b01a): a three-stop path: PART 1 and PART 2 done (each with a tiny version of its key picture: a money bar; a ledger), PART 3 lit with a question card; labels `p1`, `p2`, `q`. `mode:"steps"` (b01b): a notebook page with four numbered
  boxes ticking in turn (`s1`..`s4`), a Prelims tag (`pq`) and PART 3 of 3 lighting on the path (`p3`).
- `debt-trap` (b03): Swapna's field in two seasons, side by side: a thin harvest with a moneylender at the gate (no ledger) and a small safety net stretched under the field in the second panel; a balance tips from RISK to SUPPORT; labels `ri`, `dg` (a growing coin stack),
  `dt` (the term card DEBT TRAP), `rs`.
- `access-ladder` (b07): a ladder leaning on a bank counter; the top rungs are crowded with figures (richer households, `rh`), the lowest rung stays empty with a padlock marked COLLATERAL (`ac`); at `pd` a group of figures stands at the foot, depending on a moneylender's
  table (informal sources); at `gs` a wider ladder is drawn beside the first: a much greater share for the poor. Neutral: no mocking of any person or group.
- `institutions` (b11): three small buildings in a row: a post office with a savings certificate in the window (`po`, `ns`), NABARD with a field and a village tile (`nb`), the RBI with a line of banks' doors leading to it (`rb`).
- `syndicated` (2 scenes): `mode:"question"` (b17a): an exam-paper sheet with two statement cards, I (`s1`) and II (`s2`), and the header PRELIMS 2024 · GS I · Q52 (`q`); no answer shown. `mode:"answer"` (b17b): a big loan drawn as a pie of several banks' shares around one borrower
  (`bg`); a credit-line gauge and a lump-sum block both labelled SYNDICATED (`cl`); a BIS tag for risk sharing (`bq`); at `ans` a stamp BY OUR REASONING lands over "I correct · II not · option C"; at `nk` a small tag UPSC'S OWN KEY: NOT READ. Do not make the stamp look official.

## Checks
As in `CONTRACT_B_ECO1.md` and `CONTRACT_B_ECO2.md`: stills of each scene at start, middle and end with `npx remotion still src/index.ts LONG-eco16-p3-B out/upsc/eco16p3/<scene>_<frame>.png --frame=<global frame> --scale=0.5`
(global frame = the scene's `from` + a local frame), open each PNG with the Read tool and fix: richness below the sample scenes, text outside x 96-1824 / y 64-920, overlaps, a label before its reveal, unreadable type, a picture that claims more than its
narration or contradicts NCERT (no moneylender's ledger). Also one Part 1 monsoon still (`LONG-geo07-p1-B`), one ECO-16 Part 1 still (`LONG-eco16-p1-B`) and one Part 2 still (`LONG-eco16-p2-B`) that use a file you touched. Do not render the whole film.
Report: files changed, scenes checked, anything you could not do, any storyboard word or reveal you need changed.
