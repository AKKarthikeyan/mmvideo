# Look B, ECO-16 Part 1 ("Only 13% of India's Money Is Cash. So What Is the Rest?"): new `analogy` variants (contract, 4 Nov 2026)

Read `CONTRACT_B.md` first: the look, the rules and the checks there all apply unchanged (rich daylight illustration, depth layers, warm light,
thin coloured outlines, paper grain, realistic adults, Newsreader serif for headlines and big numbers, Schibsted sans for labels, cards in warm
paper, `Frame` from `scenes/analogy_kit.tsx`). Also read `CONTRACT_B_P2.md` and two finished builder files (`scenes/analogy_p2b.tsx` and
`scenes/analogy_p2b_jars.tsx`): they show the entry shape. Part 1 and Part 2 of the monsoon film must still render unchanged.

**This film is economics, not weather.** The viewer is a UPSC aspirant or a curious 12-year-old: every picture must make one idea obvious
without the narration, and must never show more than the narration and the script claim. If a picture would imply something the script does
not say, change the picture. Clarity and quality come first; a scene may be simple, never thin.

## The film
- Compositions `LONG-eco16-p1-B` (30 fps, for stills) and `LONG-eco16-p1-B60` (60 fps, the real one). Player `RichLong.tsx`.
- Storyboard `public/datayt/long/upsc/eco16-p1/storyboard.json` (37 scenes; each has `visual`, a one-line art note: follow it), timeline
  `public/datayt/long/upsc/eco16-p1/timeline.json` (estimated; the measured voice timing replaces it later, so motion must be a function of
  `f`, `dur` and `at(key)`, never of fixed frame numbers). Built by `scripts/upsc/eco16_p1_storyboard.py`. Never edit them.
- Find your scenes: `python3 -c "import json;[print(s['id'],s['spec'].get('which') or s['kind'],s['visual']) for s in json.load(open('public/datayt/long/upsc/eco16-p1/timeline.json'))['scenes']]"`
- The narration of every scene is in `vo`; the full script is `/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/ECO-16/SCRIPT_P1.md`. Read the
  scene's beat there before drawing, so the picture follows the words.
- Each scene is the `analogy` kind: spec `{which, chip, limit, labels: [{text|lab, key}], ref?, mode?}`. Fill the record of your group in
  `scenes/analogy_e1.tsx` (E1), `analogy_e2.tsx` (E2) or `analogy_e3.tsx` (E3): replace the placeholder entries with `{Art, Labels, bg}`; keep the
  record's name and every `which` key. Put art in helper files named `scenes/analogy_e1_*.tsx` (etc.). Never edit another builder's files,
  `analogy.tsx`, the registry, `kit.tsx`, `analogy_kit.tsx` (import from it; ask in your report if it needs a change), the storyboard or the timeline.

## Numbers and labels
- Text quantities come from `lab(key)` (`src/looks/cartoon/long/figs.ts`): the keys `e16_*` in `public/datayt/long/upsc/figures.json` (table
  `u7_labels`). A label item is `{text, key}` (print as given) or `{lab, key}` (print `lab(lab)`): support both everywhere.
- Numbers drawn as bars, heights or prices come from `fig({t, state, s})`: `e16_m3` ("India": cash 12.97, dd 11.11, td 75.55, oth 0.38, m1 24.07, dep 87.03,
  percent of M3, 31 Jul 2026), `e16_price` ("India": pen 10, pencil 2, ratio 5, rupees), `e16_bond` ("India": r5 109.29, r6 107.33), `e16_cdr` ("India": paise
  14.96, about 15 paise of cash per rupee of deposits). Never type a figure in a component: a bar's length is its table value; a printed value is
  its label. Years in plain text items (for example "1911") come from the storyboard and are allowed.
- Every keyed item (`labels[].key`, and the event keys named per scene below) appears only from `at(key)`; before that draw nothing or a faint
  outline. A key that the scene does not list in `labels` but the storyboard's `reveals` names is an **event key**: the brief for that scene says
  what happens at it. A missing key must throw (the `at` helper does).
- `chip` is a small pill, top left, for the whole scene; `limit` is shown as "Where the picture stops: ...": `Frame` does both.

## Rules for accuracy of pictures
- Analogies are labelled (`chip` "OUR PICTURE" where the storyboard sets it) and the `limit` line is drawn where the storyboard sets it.
- Widths and heights that mean amounts are drawn to scale from the figures (the M3 bar especially: notes 12.97 percent is wider than demand
  deposits 11.11 percent; the 0.38 percent hairline is visible but thin).
- No rupee notes or coins copied from real currency: draw generic notes (a plain coloured rectangle with a simple border, a portrait-free
  oval, the word RUPEES or the sign ₹ is fine), generic coins (a disc with a rim), no national emblem copy: a plain star or wheel-less disc.
  The RBI is drawn as a plain classical building with the word RESERVE BANK; no logo copy.
- No share-price charts, no buy or sell advice. The bond picture is a certificate on a seesaw, nothing more.
- No real person's face. Portrait plaques for Keynes, Fisher, Pigou, Friedman are **name plaques only** (serif name and year on a brass plate); no faces.
- Adults are drawn in the same realistic style as `girl.tsx` (see the adult people in `analogy_kit.tsx` and `stage_farmer.tsx`): realistic
  proportions, no big heads, no dot eyes. Indian street and market settings: vendors, awnings, hand carts, auto-rickshaws in the distance.
- India is not on a map in this film.

## Group E1: people and street scenes (owns `analogy_e1*.tsx`)
- `phone-pay` (2 scenes). `mode:"start"` (b00): a market street, a fruit cart (stall with fruit, awning, a QR code card on the cart), a customer
  with a phone and the fruit seller, soft morning light, background stalls, a distant auto-rickshaw drifting. Event keys: `tap` = the customer taps the phone at the QR
  code, a soft ring of light and a chime pulse, and two small account bars float up beside the phone and the cart (the customer's bar shrinks a little,
  the seller's grows by the same block); `nn` = a dotted circle appears around the customer's empty hands and the seller's open palm with the tag "NO NOTE".
  Labels: `fc` is a small signboard at the cart. `mode:"end"` (b22): the same street seen from a little closer, the phone and the two account
  bars large; event `bm` is a label under the bars: a balance block glides from the customer's bar into the seller's bar while the label shows.
- `barter` (2 scenes). `mode:"stuck"`: an open-air market lane: a shoe-maker (apron, a pair of shoes in hand, a stall of shoes) and a wheat farmer
  (a few wheat sacks, a plough leaning against the stall); the farmer shakes his head and points to the plough; the shoe-maker holds out the shoes
  and shrugs; a thought bubble over the farmer shows a plough with a tick, and over the shoe-maker wheat with a tick; a crossed-out pair of
  shoes beside the farmer. Labels `ex` (a small card) and `sw`. `mode:"coin"`: the same lane; a gold coin appears and floats between them; the
  farmer's head-shake turns into a nod; arrows close the gap. Labels `dc` (a large serif card, the term), `gb`, `mo` (a badge MONEY on the coin).
- `medium-exchange` (1): the shoe-maker hands the shoes to a buyer, receives the coin; walks to the farmer and hands that same coin over, receiving
  a sack of wheat; the coin glows along its path (a faint trail). Label `j1` is the term card JOB 1.
- `velocity-street` (1; chip OUR PICTURE; limit set): a street seen side-on, one blue-and-orange generic note travelling with a glowing trail from a
  customer to the fruit seller, then to a milkman (steel milk cans on a cycle), then to a bus conductor (khaki, ticket bag); a small counter 1, 2, 3
  ticks at each handover; labels `n0` (the note, at the left), `n1`, `n2`, `n3` appear above each person. The counter's digits are plain tick marks or
  numerals drawn from the scene (they count handovers, they are not data); they are allowed.
- `legal-tender` (1): inside a small shop, a customer offers a generic note, the shopkeeper tries to push it back, and a red hand-stop shape appears
  over his palm; the note is accepted; labels `lt` (big serif), `cr`, `rf`; event/label `q` is a small question mark floating to one side (a plant,
  it returns in `not-tender`).
- `cheque` (1): a customer writes a cheque (a paper with a pay line, a signature scribble, a bank name plate); two account bars side by side; as
  the cheque is handed over, a block rises out of the customer's bar and settles in the shopkeeper's bar. Labels `ch`, `dd`, `pd`.
- `not-tender` (1): the same shop: the shopkeeper nods at the cheque but his hand can wave it away; two stamps appear side by side: DEPOSIT = MONEY
  (green) and NOT LEGAL TENDER (amber), flipping in like badges. Labels `rf`, `dm`, `nt`.

## Group E2: demand-side diagrams (owns `analogy_e2*.tsx`)
- `unit-shelf` (1; ref `e16_price`): a stationery shelf: a pen with a tag (label `pe`) and a pencil with a tag (`pc`); on a balance, one pen on the left pan
  and five pencils lining up on the right until level (the count is the table `ratio`); label `p5` is the equation tag; `j2` the term card JOB 2.
- `shrinking-basket` (1): a jar of coins on a shelf (the same coins every year); a year dial or a calendar flipping; beside it a shopping basket that
  holds fewer items each year as price tags on a few items climb (use plain items: a bag of rice, a loaf, a bottle of oil; no figures); label `j3` the term card JOB 3;
  `pp` a small card explaining purchasing power.
- `asset-shelf`: `mode:"stable"` (b05): a card with NCERT's line (label `st`); a gold bar, a plot of land (a small field tile) and a bond certificate
  stand on a shelf, each with a small padlock that clicks on when its label appears (`ag`, `al`, `ab`); `cv` a small tag "may not be easily converted".
  `mode:"friedman"` (b13, chip PER IGNOU): a shelf of five assets in a row: cash (a wallet), a bond certificate, a share certificate, physical goods
  (a bag and a lamp) and human wealth (a tool kit and a book); a hand weighs each in turn on a small balance; labels `fr` (a brass name plaque
  FRIEDMAN), `as` (a card), `bd`, `sh`, `pg`, `hw` (names under each asset), `st` (a small tag).
- `wallet-idle` (1): a trouser pocket or open wallet with one coin; a clock ticks; a flat line beside it: nothing grows; label `wi`.
- `sliders` (1): a desk with two sliders: INCOME (`in`), INTEREST RATE (`ir`) and a wallet at the centre (label `dm` is the title card DEMAND FOR
  MONEY). Move INCOME up: the wallet grows fatter; move INTEREST RATE up: coins hop from the wallet into a bank passbook.
- `three-jars` (1; chip OUR PICTURE): three jars on a table: SHOPPING (a basket), BAD DAY (an umbrella), WAITING (a bond certificate and a small clock);
  each gets a coin dropped in when its label appears (`j1`, `j2`, `j3`); a brass name plaque `k` (KEYNES · 1936); a bracket over all three
  (`lp` LIQUIDITY PREFERENCE).
- `bond-seesaw` (1; ref `e16_bond`): a bond certificate on a seesaw against a rate dial; dial up: the certificate sinks; two price tags `b5`
  (at 5%) and `b6` (at 6%) show the two printed values, the second lower (print the labels; the seesaw's tilt follows the ratio of the two values);
  `bp` is the headline card.
- `rate-crowd` (1): two panels. Top: HIGH RATE (`hi`): a crowd of small people walks to a BOND counter (`bb` tag); bottom: LOW RATE (`lo`): the crowd walks away
  from the counter back to wallets (`sb` tag); at the end a headline `fl` with an arrow that shows speculative demand for money falling as the rate rises.
- `liquidity-tank` (1; limit set): a transparent tank labelled `ir` (INTEREST RATE) with the water at the floor; a pump pours coins into a wallet
  basin beside it; the coins pool in the basin; the tank's level does not move; `ex` a thought bubble "everyone expects it to rise"; `sit` the coins
  sitting; `lt` the term card LIQUIDITY TRAP.
- `formula-card` (1, mode "velocity"): a large serif card with three lines appearing in turn: VELOCITY OF CIRCULATION (`vc`), Md = k · T (`kt`), v = 1 ÷ k (`v`,
  from `e16_vk`); a small coin looping around the card for the "times a unit of money changes hands" idea.
- `fisher-scale` (2). `mode:"level"` (b11 first): a brass balance with MONEY × SPEED on the left pan (two small blocks, a coin pile and a spinning arrow)
  and PRICES × TRADE on the right (price tags and a cart of goods); level; name plaque `fi` FISHER · 1911; formula card `ig` (from `e16_fisher`); `eq` the term
  card. `mode:"double"` (b11 second): the left pan's coins double and the right pan's price tags double, staying level; flag `fx` TRADE FIXED · SPEED STEADY;
  label `db` (from `e16_x2`); at `fl` the flag wobbles and the scale tilts loosely (the link loosens).
- `cambridge-k` (1): a wallet beside a salary slip; a dial shows the share kept as cash (a quarter shown as a pie, no digits needed); four hands pass a
  note along (the velocity picture, small); the dial shrinks as an interest-rate arrow climbs; labels `cb`, `sh`, `k` (`e16_ck`), `pg` (the plaque `e16_p1950`).

## Group E3: supply, measures and the money bar (owns `analogy_e3*.tsx`)
- `split-bar` (1; ref `e16_m3`; mode "hook"; the b00 hook, make it striking): a very wide horizontal bar spanning the frame on a dark navy slab, representing all of
  India's money (M3); the bar fills in two parts: a thin bright block of notes and coins at the left (width = `cash`), a long block of bank deposits
  (width = `dep`); small coin and note icons on the first, a bank's building facade pattern on the second; labels `cap` (a title card), `lc`, `ld`.
- `plan-path` (1): a notebook page (like the exam notebook's paper) with three numbered boxes `w1`, `w2`, `w3` ticking in turn; below, a three-stop path: PART 1 (lit;
  label `p1`), PART 2 (`p2`), PART 3 (`p3`), the dim ones lighting a little as they are named.
- `press-mint` (1): the left half: a printing press behind a glass wall (a plain machine with rollers), a generic note emerging, a plain classical building
  with RESERVE BANK on it; the right half: a mint stamping a coin (a stamping press and a coin tray), a plain building GOVERNMENT OF INDIA; labels `rb`, `s2`
  (`e16_s22`), `co`, `cn` (`e16_coin`).
- `fiat-note` (1): a generic banknote under a lamp; a hand lifts a guarantee stamp off it and the note's colour drains to grey; the stamp is set back and the colour
  returns; labels `nv`, `gu`, `fm` (a term tag FIAT MONEY).
- `promise-note` (1): a generic note close up with a plain strip of text "I PROMISE TO PAY THE BEARER" glowing; the glow follows the note hand to hand across the frame and
  returns to a plain RBI building; labels `pr`, `ob`, `s6` (`e16_s26`).
- `deposit-money` (1): an account balance bar with a bank card; an arrow shows withdrawing on demand; next to it a stack of cash; then a join: a plus sign between
  CURRENCY (cash) and DEPOSITS (account bar): NCERT's "currency plus deposits"; labels `bk`, `dm`, `cd`.
- `m-measures` (1): M1 is a wide base block (cash with the public + demand deposits); two branches rise from it: M2 (adds post office savings; a small post-box
  icon) and M3 (adds time deposits; a fixed-deposit certificate icon); M4 stands above M3 (adds post office deposits). Do not draw a four-step ladder. A bracket
  over M1-M2 (`nr` NARROW MONEY) and over M3-M4 (`br` BROAD MONEY). M3 glows at `mc`. Labels `nc` (a small card), `m1`, `m3`, `m2` (and `m4`).
- `m3-bar` (1; ref `e16_m3`; mode "split"; the payoff of the video, the most important picture): one tall standing bar on a table fills from the bottom in
  segments from the table values, to scale: cash with the public (`c`, 12.97), demand deposits (`d`, 11.11, thinner than cash), time deposits (`t`, 75.55, the huge
  block) and a hairline of other RBI deposits (`o`, 0.38, thin but visible); `cap` is the title card; `q` is a bracket over cash plus demand deposits
  (24.07, a quarter) with the label. Segment labels sit to the right with leader lines; keep every label legible.
- `base-tower` (1): a small stone base labelled RESERVE MONEY (`hp` carries the term card HIGH-POWERED MONEY) with a tall tower of deposits rising beside it (not on it: do not claim the
  base supports the tower); a pulsing question mark at the tower's foot; `ba` a small tag; `rb` a plaque (`e16_1935`).
- `paise-bar` (1; ref `e16_cdr`): a rupee's worth of deposits drawn as a long block, beside it a short stack of coins sized to the `paise` value (about 15 paise per rupee);
  label `fp` (`e16_paise`); `dp` a card; at `q` the question HOW DOES CREDIT CREATION WORK? grows large (the end of the beat).
- `part2-seam` (1): the account bar from `phone-pay` end, large; its base shows a faint seam that opens and a new block grows out of it; at `p2` a frame appears around the
  scene: PART 2; labels `wd`, `p2`, `lm`.
- Not yours: the 2 statement scenes and the notebook scene (existing kinds, already built).

## Checks (every builder)
Run stills of each of your scenes at start, middle and end:
`npx remotion still src/index.ts LONG-eco16-p1-B out/upsc/eco16/<scene>_<frame>.png --frame=<global frame> --scale=0.5`
(global frame = the scene's `from` + a local frame), open each PNG with the Read tool, and fix what is wrong: richness below the sample scenes, text
outside x 96-1824 / y 64-920, overlaps, a label before its reveal, unreadable type, a picture that claims more than its narration. Also render one Part 1
monsoon still (`LONG-geo07-p1-B`) that uses a file you touched, to prove nothing else changed. Do not render the whole film. Do not run any other
Remotion render at the same time as another builder if the machine is struggling: stills are small. Report: files changed, scenes checked, anything
you could not do or any storyboard word or reveal you need changed.
