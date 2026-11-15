# Data Kadai premium looks: research and build spec (25 Oct 2026)

AK: "Map video can be use our existing Visual. But New Data based story should have new premiun 2-3 looks otherwise all vidoes looks Templated."
Workflow: 8 research angles (each independently verified), 4 designers, 3 judges, a design lead and a completeness critic (24 agents).
Prototype code and frames: `prototypes/` and `frames/` here. Full machine result: `workflow_result.json`.

## Scores (1-10)

| Look | Retention | Integrity | Feasibility |
| --- | --- | --- | --- |
| KADAI COUNTER | 7 | 6 | 5 |
| Kadai Diorama | 6 | 5 | 3 |
| Kadai Dispatch (newsroom / editorial look) | 5 | 8 | 7 |
| SLAB (Kadai Slab: kinetic poster type) | 6 | 7 | 8 |

## Kadai Slab (kinetic poster type) (`slab`, about 5.5 days)

Highest combined score (retention 6 + integrity 7 + feasibility 8 = 21 of 30). A full 999-frame prototype of both gd01 and cw01 already renders in 23.6-24.9 s with VideoToolbox at 10 Mbps (41.6 MB). It is the most legible look on a phone, and the cheapest to make daily because any money config maps onto it without per-story art beyond one textless plate. The idea that the number locks on the narrator's spoken word is the best retention device in all four proposals, and all three chosen looks now use it. The judges' objections were fixed in the spec rather than accepted. The full-narration poster stack is gone: each shot shows the number plus at most 4 anchor words. The empty lower half is gone: every shot has a lower-zone scale object. Weak plates are regenerated. Garbled mid-reel glyphs are replaced by glyph-free streaks. The 'ALL SOFT DRINKS = 100%' claim is removed. Role in the rotation: release-day numbers, records, single big numbers, 'X times' comparisons and fast Kadai Wars rounds.

**Mood.** Flat, loud, cinematic poster type, like a cinema title sequence crossed with a bazaar price board.

GROUND: full-bleed brand slabs that change on bar downbeats. Ink #1F1A17 is the default stage. Maroon #7A2340 is the reveal. Amber #C9822F is the hero-fact and challenger colour. Cream #F7F4EE appears only on the end card. Derived colours: deep maroon #4A1226 for shadows and ticket backs, and ray #6C1D38 for the starburst. There is no paper texture, no serif, no chart with title or axes, and no drawn object other than type-built scale shapes (bars, tiles and a share level).

TYPE:
- Anybody variable (wdth 50-150, always wght 900; its default instance is weight 100) for anchor words, name blocks and numbers. Lines are fitted to the 755 px safe width.
- IBM Plex Mono Bold for chips, provenance tickets and source lines.
- Oswald 700 only in the DATA KADAI brand bug.

TEXTURE: baked film grain (4 PNG tiles cycled every 4 frames, overlay blend at 14%) plus a CSS radial vignette at 28%. The only light comes from a baked 22-ray starburst (#7A2340/#6C1D38) behind reveal numbers, and from a textless plate seen inside two hero glyphs per Short.

ALLOWED CONTRAST PAIRS (tokens.json, tested in look_checks.py):
- cream/ink 15.7
- cream/maroon 8.93
- maroon/cream 8.93
- ink/amber 5.51
- amber/ink 5.51
- cream/#4A1226 about 13
- amber on maroon (3.14) only at 300 px or larger
- amber on cream never

SIZE FLOORS (frame px): hero 200, anchor words 96, labels 40, tickets and source 32.

HOW IT DIFFERS: unlike Counter it has no lit surfaces, no objects and no rubber stamps. Unlike Dispatch it has no newsprint, no serif and no titled charts. It is clearly different from the cream template and from the state-map look.

**Motion.** GRID: 124 BPM at 30 fps. A bar is 58.065 frames and a beat is 14.516 frames. Downbeat k of a beat is round(t0*30 + k*58.065). Everything is one composition with no TransitionSeries. Each shot starts on a bar downbeat, so the builder's t0/t1 never move.

1) SLAB CHANGES happen only on story-beat downbeats. The incoming shot is revealed by a clip-path inset wipe over 6 frames, Easing.inOut(cubic). Direction comes from the story's seeded variant sequence and never repeats twice running. The outgoing shot stays mounted underneath until the wipe ends.

2) SAME-SUBJECT EDIT on every internal bar downbeat: punch scale 1.06 to 1 over 6 frames (Easing.out(quad)), a 2-frame cream flash at 22%, and exactly one content swap (a ticket in, a label swapped, a bar growing).

3) WORDS: 1-4-word anchor groups slam in on 8ths: spring damping 14, stiffness 260, mass 0.6, from scale 1.35 and y -0.22em, with opacity 0 to 1 over 2 frames. Hook groups start at f-13, so frame 0 is already landed. Nothing fades in from blank.

4) NUMBERS (the Board): blank board tiles, one per digit, drop in on 8ths after the wipe. Each tile is a solid block with a 2 px hairline and no glyph. 8 frames before lockF each column becomes a glyph-free reel of 3 streaks with 10 px vertical CSS blur. Columns lock right to left, 3 frames apart, and the leftmost locks exactly on lockF. Each digit drops in from -0.35em (spring 14/420/0.4). During the reel the width axis stands up from wdth 150 to the landing value, with a per-frame scale clamp so the number never exceeds 755 px. At lock: a maroon misregistration ghost (18,12) decays to 0 over 8 frames, and the unit slides 50 to 0 px over lockF-2 to lockF+4. Static glyphs (₹, comma, decimal point, ×, %) never spin. Board throws if asked to draw a digit before lockF.

5) PLATE-IN-TYPE slams twice per Short, at hook frame 0 and at the say lock: spring 11/210/0.7 from 0.55, with the plate drifting up 50 px over 2 bars inside the glyphs.

6) STARBURST: the baked PNG rotates 0.4 degrees per frame behind ratio and say reveals.

7) LOOP SEAM: frames 987-999 wipe in the hook's slab colour from the left.

8) SFX (Kenney CC0; at most 4 cues per second; -18 dB under VO, -12 dB in gaps): slab wipe switch_00x, number lock tick_00x (one per number, at lockF), plate slam drop_00x, ticket click_00x, tiles a tick on every 6th tile.

**Beats.**

- **hook**: Frame px. The safe box for words and numbers is x 95-850, y 150-1540; slabs, grain and burst bleed full frame.

CHROME on every frame:
- 17 bar ticks at y 156-161, x 95-850, each about 38.8 px wide with 6 px gaps. A tick fills on its music bar's downbeat with a scaleY 1.8 to 1 pop.
- Chip in Plex Mono 32, colours inverted against the slab, y 172-214.
- Per-beat short source in Plex Mono 32 at y 222-258.
- Brand bug bottom-right: Mark 44 px plus Oswald 34 'DATA KADAI', right edge x 850, baseline y 1532.

ZONES: TOP y 290-560, HERO y 560-1180, LOWER y 1200-1500.

HOOK: the slab is the story's lead colour (maroon by default; the variant may set ink).
- TOP: the first anchor group (at most 4 words) from the hook line before the *hero* token, in Anybody 900, cream, fitted to 755 px with a 130 px cap.
- HERO: the *hero* token as PLATE-IN-TYPE, about 600 px tall. Digits are a CSS clip-path pointing at an SVG <text> clipPath and are filled with the story's QA-approved textless plate. Symbols (×, %, ₹) are solid cream. On top: a 7 px cream outline and a 22 px #4A1226 drop. Any qualifier word from the token (about, almost, over) sits as a Plex Mono 44 cream pill at the glyph's top-left.
- LOWER: the tail anchor group (at most 4 words), Anybody 900 cream, up to 2 lines, 110 px cap.
- Frame 0: plate spring started at f-10 (scale about 0.98, settled by f4); words slammed from f-13.
- At the narrator's number word (hook accent frame from word_times.py): an amber rough Underline under the hero (seed 3, strokeWidth 14, 10 frames).
- Bar 2 downbeat: punch plus flash.
- Once the hook VO has ended (vo.at + sec), LOWER swaps to provenance tickets, one per source, sliding in 7 frames apart.
- **fact**: Two or three bars.

TOP
- NAME BLOCK at y 300: the card's 'label' (1-4 words, uppercase) in Anybody 900 on a solid bar, fitted to 740 px with a 140 px cap. It wipes in left to right over frames +3 to +9. Colours: amber bar with ink type on ink slabs; ink bar with amber type on amber slabs; cream bar with maroon type on maroon slabs.
- Voiced cut: no kicker; the date moves into the provenance ticket. Text-led cut (vo empty): the card text replaces the name block as an Anybody line of 110 px or less.

HERO: the BOARD at x 95, width 755, height 520 or less, centred in y 560-1100. Blank tiles arrive on 8ths from +6. The number locks on lockF. The unit is set at 0.36×.

LOWER: the beat's device (from data.json 'device'):
- 'bar': the story's shared-scale bar (755 px = the largest same-unit value incl. the high estimate). Height 96 px at y 1220, growing 14 frames Easing.out(exp) on beat 2 of bar 1, so magnitude shows before the number. A hatched cream range band from lo to hi with a Plex 32 label 'RANGE lo-hi'. Earlier values of the same scale appear as dashed cream ghost bars with Plex 32 names above.
- 'inset': for a value under 4% of the scale. The sliver at true scale, then on bar 2 dashed connectors drawn with evolvePath over 10 frames to a framed box x 95-850, y 1340-1500, labelled 'ZOOMED IN' (Plex 32), holding that value's own sub-bars with Plex 32 labels inside.
- 'price': two equal-width Plex Mono price tickets on one rule (y 1300), comparing like with like from the table only.

PROVENANCE TICKET at lockF+15: a Plex Mono 32 cream ticket with ink text and a perforated left edge, e.g. 'ESTIMATE · WORLD GOLD COUNCIL · 2024'. It slides 40 to 0 px from the right and is never rotated or slammed.

OLD VALUE (card 'old'): the printed old value at 55% cream, about 260 px, crossed off by an amber rough-notation CrossedOff or StrikeThrough (strokeWidth 16, seed of 1 or more) over 12 frames before the Board starts.

The collision guard throws if a ticket overlaps a label, a number or the level box.
- **ratio**: Two bars. Maroon slab with the baked starburst rotating, centred (540, 700).

TOP: Plex 36 cream 'A ÷ B' names, typed 3 characters per frame from +3.

HERO: the ratio token slams at lockF. Qualifier pill (ABOUT) plus cream Anybody 900, about 480 px tall, solid cream. Plates are reserved for hook and say.

LOWER, unit tiling at the story's shared scale:
- An amber A bar (with its range hatch, if any) at y 1220.
- At +4 the first cream B tile, frac_B × 755 wide, with 'B ×1' inside in Plex 32 ink.
- Further B tiles stamp in end to end on successive beats (spring 12/320/0.5 from scale 1.25), one per whole unit of the rounded ratio.
- The real remainder stays visible, and the tile ends are shown landing inside the range band.

BAR 2: punch toward the tile ends, plus an amber rough Bracket along the range band labelled 'ESTIMATE RANGE' (Plex 32).
- **share**: THE SHARE LEVEL, built only from data.json 'share'.

BOX: 755 px wide, 6 px cream border, height 560-840 depending on the zone. Header above it in Plex 32: 'REPORTED SHARES · <PERIOD>'. Never '= 100%'.

FILL
- Incumbents in maroon from the top, labelled inside with Plex 36 cream names.
- Challengers in amber from the floor, with a 6 px cream level line.
- Labels use the source's printed qualifier, e.g. '~7%' and 'ALMOST 15%'.
- If the reported parts sum below 100, the builder adds a steel-grey 'OTHERS' band with its value.
- If they sum to exactly 100 and carry printed qualifiers, the seam is feathered by 2 px and a Plex 32 note under the box reads 'Rounded shares, as reported'.

MOVE: the level moves to the new share over the 8 frames before lockF, Easing.out(cubic), never past the true value. The period label in the header flips AT lockF. 'WAS ~7% · JAN-SEP 2024' in Plex 32 sits just above the new level.

WORD TICKET: a tested word ticket such as 'DOUBLED' (money_test 1.9-2.3) arrives at lockF+15, collision-guarded.
- **say**: Two or three bars. It echoes the hook's composition with the new value, so the ending loops back to the opening.

BAR 1: wipe up to ink or amber, whichever differs from the previous slab. TOP: the takeaway anchor groups slam on 8ths. LOWER: the proof object, built at the shared scale.

BAR 2: on lockF the slab wipes to maroon with the starburst, and the hero token arrives as PLATE-IN-TYPE (same plate as the hook; digits filled, symbols solid). Its qualifier sits as a Plex 60 pill, e.g. 'OVER'.

PROOF TILES (for 'N×' claims): N tiles of the small value drop into an outline of the big value, one every 2 frames, with a tick on every 6th. Caption in Plex 32 (e.g. 'HOMES + TEMPLES, IN RBI-SIZED PIECES'). The uncovered remainder stays visible, and a dashed tick marks the low estimate.

BAR 3: a note ticket in Plex 34 on a #4A1226 box at y 1420-1500, carrying the caution line.
- **end**: Two bars plus the 12-frame loop tail. A wipe up to the only cream slab in the video.

TEXT
- The question as a maroon Anybody stack: block 820 px tall or less, from y 300.
- The final word is set as cream type on a maroon block (never amber on cream).
- end.sub in Plex 44 ink.
- 'Comment below.' in Plex 50 maroon with a block cursor that toggles every beat.
- The config's source_lines (2-3 lines) in Plex 32 ink at y 1250-1420.

CHROME: the brand bug as on every frame.

LOOP: frames 987-999 wipe in the hook's slab colour from the left.

**Gold storyboard.** gd01 in SLAB. 999 frames, 17 bars. Shared scale: 755 px = 25,537 t. In px: 25,000 = 739.1; 23,537 = 695.9; 8,133.53 = 240.5; 880.52 = 26.0; 680.05 = 20.1.

Lock frames come from word_times.py on the current VO: homes f174, US f348, ratio f421, RBI f567, say f755; hook accent f32. They are recomputed if the hook and say are re-voiced as 'homes and temples'.

1) HOOK, f0-116 (2 bars). Maroon slab.
- TOP: 'HOMES + TEMPLES HOLD' (cream, fitted, about 118 px).
- HERO: Plex 44 pill 'ABOUT'; '3' at about 600 px filled with gd01-plate-v2 (bangles and coins); '×' solid cream with cream outline and #4A1226 drop. Landed at f0; plate drifts up 50 px to f116.
- LOWER: 'THE US / GOVERNMENT'S GOLD' (cream, 2 lines, 110 px cap).
- Chrome: chip 'GOLD · ESTIMATE'; source 'WGC estimate · US Treasury · RBI'.
- f0: drop_00x.
- f32 ('three'): amber Underline under '3×' (seed 3).
- f58: punch and flash.
- f92 (VO ended): LOWER swaps to tickets 'ESTIMATE · WORLD GOLD COUNCIL' (f92) and 'OFFICIAL · US TREASURY' (f99).

2) HOMES + TEMPLES, f116-290 (3 bars). Wipe up to amber, f116-122.
- NAME BLOCK 'HOMES + TEMPLES': ink bar, amber type, f119-125.
- Board: 5 blank ink tiles plus a static comma drop in on 8ths, f123-160.
- LOWER: ink bar grows to 739 px at y 1220, f131-145, labelled 'HOMES + TEMPLES' above in Plex 32. Hatched cream range band x 791-850, with 'RANGE 23,537-25,537 t' below at y 1330, f150.
- Reel f166-174; columns lock f162/165/168/171/174, so '25,000' lands on 'twenty-five' at f174; ' t' slides in; maroon ghost decays f174-182; tick_00x.
- f189: ticket 'ESTIMATE · WORLD GOLD COUNCIL · 2024' at y 1390.
- f232: punch and flash. Text-led cut: 'OF GOLD IN HOMES AND TEMPLES' replaces the name block.
- Settled from f278.

3) US GOVERNMENT, f290-406 (2 bars). Wipe left to ink.
- NAME BLOCK 'US GOVERNMENT': amber bar, ink type.
- Tiles f297-330. LOWER: the homes bar becomes a dashed cream ghost (739 px, 'HOMES + TEMPLES'), and the cream US bar grows to 240.5 px at y 1340, f305-319 ('US GOVERNMENT' above, '8,134 t' inside in Plex 32 ink).
- Lock f348: '8,134 t' in cream.
- f363: ticket 'OFFICIAL · US TREASURY · 30 SEP 2026 · TONNES: OUR CONVERSION' (2 lines) at y 1430.

4) RATIO, f406-523. Wipe down to maroon with the starburst.
- TOP: Plex 36 'HOMES + TEMPLES ÷ US GOVERNMENT', typed from f409.
- LOWER: amber homes bar 739 px with range hatch at y 1220. US cream tile 1 (240.5 px, 'US ×1') at f410.
- Lock f421 ('three'): 'ABOUT 3×' slams in cream, about 480 px.
- Tile 2 at f421, tile 3 at f435. The tiles end at x 816.5, inside the range band (x 790.9-850), 17.6 px short of the 25,000 end.
- f465: punch toward the tile ends; amber Bracket on the range band with 'ESTIMATE RANGE' (Plex 32).

5) THE RBI, f523-697 (3 bars). Wipe right to amber.
- NAME BLOCK 'THE RBI': ink bar, amber type. Tiles '880.52' f529-560.
- LOWER: shared-scale ink homes bar 739 px at y 1180, with the maroon RBI sliver (26 px) at y 1290 labelled 'RBI'.
- Lock f567: '880.52 t' in ink.
- f581: dashed connectors (f581-591) to a 'ZOOMED IN' box (y 1340-1500) holding 'RBI 880.52 t' (755 px) and 'HELD IN INDIA 680.05 t' (583 px), labels inside.
- f596: ticket 'OFFICIAL · RBI HALF-YEARLY REPORT · END-MARCH 2026' under the name block.
- f639: punch onto the zoom box.

6) SAY, f697-871 (3 bars).
- f697: wipe up to ink. 'HOMES + TEMPLES HOLD' slams in groups at f700, f707, f714, f722. LOWER: the homes bar outline (cream line, ink fill, 739 px) at y 1240 with the amber RBI sliver beneath.
- f740: Plex 60 pill 'OVER'.
- f755 (lock, 'twenty-five'): wipe up to maroon with the starburst; '25×' plate-in-type slams (digits filled with the gold plate, '×' solid), about 520 px; 'THE RBI'S GOLD.' in cream, 110 px or less, under the hero.
- f760-808: 25 amber RBI-sized tiles (26.0 px each) drop into the homes outline every 2 frames, with a tick every 6th tile. Caption 'HOMES + TEMPLES, IN RBI-SIZED PIECES'. 88 px stays uncovered, and a dashed cream tick at x 790.9 (low estimate) shows 45 px uncovered even at the low end.
- f813: note ticket 'Dhanteras is 6 November. Household gold is an estimate.'

7) END, f871-987, hold to 999. Wipe up to cream.
- 'HOW MUCH OF YOUR / SAVINGS IS GOLD?' maroon stack, with 'GOLD?' as cream on a maroon block.
- 'Comment below.' in Plex 50 maroon with cursor.
- Sources in Plex 32 ink: 'World Gold Council estimate (2024), as reported' / 'US Treasury gold reserve, 30 Sep 2026' / 'RBI half-yearly report, end-March 2026'.
- f987-999: maroon wipe from the left (loop seam to f0).

**Cola storyboard.** cw01 in SLAB. 999 frames.

Locks: Campa f261, challengers f435, Coke + Pepsi f581, reply f697, say f828; hook accent f37.

Incumbents are maroon or ink; challengers are amber. No red or blue, no logos, no bottle silhouettes.

1) HOOK, f0-174 (3 bars). Maroon slab.
- TOP: 'COKE + PEPSI HELD'.
- HERO: '93%' plate-in-type, digits filled with cw01-plate-v2 (dark cola, bubbles), '%' solid cream.
- LOWER: 'OF INDIA'S / SOFT DRINKS' plus a Plex 32 ticket 'JAN-SEP 2024 · AS REPORTED'.
- Chrome source: 'NielsenIQ via ET Retail · Jan-Sep 2024'.
- f37 ('ninety'): amber Underline.
- f58: punch and flash.
- f116: wipe down to ink. The SHARE LEVEL opens over f116-124: box y 620-1460, header 'REPORTED SHARES · JAN-SEP 2024'; maroon 93% with 'COCA-COLA + PEPSICO' inside; amber floor band '~7% · CAMPA + LAHORI ZEERA'; note 'Rounded shares, as reported' at y 1475. The hero moves to TOP as a solid cream '93%' at 260 px.

2) CAMPA, f174-348 (3 bars). Wipe up to amber.
- NAME BLOCK 'CAMPA': ink bar, amber type. Board: static '₹' plus 2 blank tiles, f180-220.
- Lock f261 ('ten'): '₹10' in ink.
- LOWER: 'FOR 200 ML' in Anybody ink (110 px cap; 200 is in free_numbers).
- f276: ticket 'AS REPORTED · GLOBALDATA · MARCH 2023'.
- f290: punch. Text-led cut: 'back since March 2023' and 'Reliance bought the old brand in August 2022.'

3) CHALLENGERS, f348-523 (3 bars). Wipe down to ink.
- NAME BLOCK 'CAMPA + LAHORI ZEERA': amber bar, ink type.
- Share level in its 2024 state (box y 900-1460, amber '~7%'). HERO above it: an 'ALMOST' pill plus 2 blank tiles and a static '%'.
- f427-435: the amber level rises from 7% to 15%, no overshoot.
- Lock f435 ('fifteen'): '15%' in cream, and the header flips to 'JAN-SEP 2025'; 'WAS ~7% · JAN-SEP 2024' sits above the level.
- f450: 'DOUBLED' ticket (tested 15/7 = 2.14).
- f465: punch onto the level, plus ticket 'AS REPORTED · NIELSENIQ VIA ET RETAIL'.

4) COKE + PEPSI, f523-639. Wipe left to maroon.
- NAME BLOCK 'COKE + PEPSI': cream bar, maroon type.
- Old '93%' at 55% cream (260 px) with 'JAN-SEP 2024'; amber CrossedOff f537-549 (seed 4).
- Lock f581 ('eighty-five'): '85%' in cream.
- LOWER: share bars on a % scale (755 = 100): 'JAN-SEP 2024 · 93%' (#4A1226, 702 px) at f590 and 'JAN-SEP 2025 · 85%' (cream, 642 px) at f597; note 'Rounded shares, as reported'.

5) REPLY, f639-755. Wipe right to ink.
- NAME BLOCK 'THE REPLY': amber bar, ink type.
- Old '₹12+' (55% cream) with amber StrikeThrough f655-667 (seed 5).
- Lock f697: '₹10' in cream.
- LOWER: two equal tickets on one rule: 'CAMPA · 200 ML · ₹10' (amber) and 'COKE / PEPSI · NEW PACK · ₹10' (cream, no ml because the size is not reported).
- f712: ticket 'AS REPORTED · STORYBOARD18 · NOV 2025'.

6) SAY, f755-871 (2 bars).
- f755: wipe up to amber. 'THE COLA WAR' (f758-772) and 'IS NOW FOUGHT AT' (f780-800) in ink. LOWER: the two equal ₹10 tickets echo on one level rule.
- f813: wipe up to maroon with the starburst; blank '₹' tiles.
- Lock f828 ('ten'): '₹10' plate-in-type ('₹' solid cream, '10' filled with cola) slams.

7) END, f871-987, hold to 999. Wipe up to cream.
- 'WHICH IS IN / YOUR FRIDGE?', with 'FRIDGE?' as cream on a maroon block.
- Plex 44 'Campa, Coke, Pepsi or Thums Up?' and 'Comment below.' with cursor.
- Sources: 'NielsenIQ via ET Retail (Storyboard18, 25 Nov 2025)' / 'GlobalData, March 2023'.
- f987-999: maroon loop seam.

**Dependencies.**

- remotion 4.0.529: change '^4.0.529' to the exact '4.0.529' (already installed; latest is 4.0.538). Remotion License.
- @remotion/cli 4.0.529: pin exactly. Remotion License.
- @remotion/effects 4.0.529 (npm i --save-exact). Remotion License (npm says UNLICENSED). Used ONLY in the LOOK-BAKE stills (starburst, white-noise), rendered with --gl=angle by bake_looks.py. No video render needs GL.
- @remotion/rough-notation 4.0.529 (npm i --save-exact). MIT. Uses Underline, CrossedOff, StrikeThrough and Bracket with seed of 1 or more. Its dependency roughjs 4.6.6 is already installed.
- @remotion/paths 4.0.529 (npm i --save-exact). MIT. Today it is only transitive; evolvePath is used for the inset connectors.
- No @remotion/transitions, @remotion/layout-utils, @remotion/google-fonts, three or Lottie.

**Assets.**

- Anybody[wdth,wght].ttf from github.com/google/fonts/ofl/anybody: SIL OFL 1.1. Verified wdth 50-150, wght 100-900, ₹ U+20B9, ×, tnum.
- IBMPlexMono-Bold.ttf from github.com/google/fonts/ofl/ibmplexmono: SIL OFL 1.1. Verified ₹, ×, all digits 600 units wide.
- Oswald-700.woff2 (already in public/fonts): SIL OFL 1.1, wordmark only. OFL.txt to be added beside it.
- Kenney Interface Sounds 1.0 (switch_00x, tick_00x, drop_00x, click_00x): CC0 1.0, no credit required; .ogg plus License.txt committed.
- Kenney Casino Audio 1.1 (chips-stack-3 for the say proof): CC0 1.0.
- gd01-plate-v2.png and cw01-plate-v2.png: textless plates from MiniMax image-01 (1152x2048) or gemini-2.5-flash-image on AK's keys, under each provider's terms. QA-approved at glyph scale.
- Baked slab-burst.png and grain-0..3.png: own work, made with @remotion/effects (Remotion License).

**AI art.** Textless AI art appears only as the fill inside the digits of two hero tokens per Short: the hook hero and the say hero ('3×' and '25×' for gold; '93%' and '₹10' for cola). It is seen through a code-drawn SVG text clipPath. Symbols are solid cream, so the glyph that carries the value is always code-drawn from data.json.

The current covers fail at glyph scale (the gd01 plate shows a deity-like medallion, and the cola plate reads as pale cream), so both are regenerated with MiniMax image-01 at width 1152, height 2048. covers.py drops aspect_ratio, which otherwise overrides width and height.

The new 'plate' prompt asks for a dense, colour-rich texture filling the centre 60% of the frame:
- Gold: plain gold bangles, coins and bars only. No pendants, medallions, faces, figures, idols, religious motifs, text or logos.
- Cola: dark cola liquid with rising bubbles and condensation. No bottle shapes, labels or brand colours.

plate_qa.py renders each plate inside the actual glyph at 100% and records sign-off. The build refuses an unapproved plate. A plate never sits behind running text, a map or a number that is not a glyph.

## Kadai Counter (tactile objects on a lit counter) (`counter`, about 7.5 days)

Highest retention score (7). Its proof frames are the only ones that already read as objects, not charts: gold bars stack on velvet, the US pile is copied three times, caps flip in a crate, tags swing on thread and a bill prints. That makes scale literal (the benchmark's best-performing faceless format) with satisfying, ASMR-style physics, and real material textures without AI.

It is also the hardest of the three to turn into a template, because surfaces and unit objects change by story.

Its integrity and feasibility gaps were code problems, all fixed in this spec:
- partial units drawn at full height, now true fractional height everywhere;
- hero values set as rubber stamps, now cards and tags, with stamps kept for provenance;
- beer-like bottles, now upright clear glass;
- costly WebGL surfaces, now baked once to images;
- gold-and-cola-only objects, now a registry with topic-neutral fallbacks.

Combined score 18; Diorama (14) is rejected, so Counter owns the object space alone. Role: gold and money stories, Kadai Wars brand battles, prices and 'what ₹X buys'.

**Mood.** A lit tabletop of real materials in a kadai. Surfaces are baked once with @remotion/effects and then moved as images.

SURFACES
(1) Jeweller's velvet tray, for gold and money.
- Back wall: radial gradient #5A3426 to #2A1C18 to #140E0C above a horizon at y 1250, with an optional blurred AI back-wall plate at 40%.
- Velvet: #5C1830 with burlap (amount .32, size 3, seed 4, color #24060F) and vignette (.55).
- A 5 px brass lip, #6E4D1F to #E3BC6A to #8A6326.
(2) Kirana teak counter, for brands and prices.
- Top-down: 8 planks of #835030/#7B4A2A, each a stretched contour-lines grain with 7 px seams.
- Eye-level: a teak counter front below y 1300 and a plaster wall with two shelf shadows above.
(3) Kraft ledger pad, for release-day figures: paper with colorFront #D9BE94 and colorBack #B8956A.

LIGHT
- One warm key light from the top-left, shared by every object.
- Contact shadow at (+26, +8), blur 14, #0A0003 at 60%, plus a skewed cast shadow at slope 0.55, 28%.
- Baked grain tiles at 18% overlay, held 3 frames.

THE RULE: every number IS an object (a true-height unit pile, a crate of caps, a bottle) or sits ON one (a cream tag on maroon thread, a cream or ink card, a thermal bill).

MATERIALS, all drawn in code
- Oblique gold bars: top face #FFEBB5 to #E0A23C, front face #EDB24A to #7E4813, end face #8E5317 to #5A300C, with a 1.8 px #FFF3CF edge highlight.
- Crown caps with 21 crimps: incumbents ink #2A2523; challengers #E39A3B with a 3 px cream rim at 1.12× scale; steel #8A8580 for 'others'.
- Upright, stubby, clear-glass 200 ml bottles: cola #3B1F14, an air gap, seeded bubbles, two highlights, a house-colour cap, no label and no contour.
- A steel vault tray, a brass loupe and a brass unit key.
- A thermal bill with a zigzag edge.
- Rubber stamps, used ONLY for provenance, always on cream paper: OFFICIAL #2F5A56, ESTIMATE #9A5B12, AS REPORTED #7A2340.
- The Data Kadai tea glass as a prop, with steam.

TYPE
- Bricolage Grotesque variable (wght 800, wdth 75-82, opsz 96, tnum on) for heroes and claims.
- Space Mono Bold for tags, the bill, the source chit and unit keys.
- Oswald only in the brand bug.

CONTRAST: ink/cream 15.7, maroon/cream 8.93, amber on ink cards 5.51, cream on the dark wall about 14, #3A2A20 on kraft about 10. Amber never on cream.

SIZE FLOORS (frame px): card hero 200, tag hero 150, claims 56, labels 40, chit and source 32.

HOW IT DIFFERS: no flat colour slabs (Slab) and no newsprint charts (Dispatch).

**Motion.** GRID: shared, with story beats of 2-3 bars.

CAMERA: the voxplus camAt and CameraRig code, AK's own from /Volumes/DarwinSSD/MMVideo/src/voxplus, ported to 1080x1920. On each internal bar line it makes exactly one same-subject edit:
- a punch, 1.00 to 1.12-1.6 over 10 frames, easeInOut;
- a crane of 300 px over 14 frames;
- a pull-back to 0.6 with a 6 px rack blur;
- or a 200 px pan.
Directional blur follows camera speed, capped at 40 px. A ±1 px noise2D drift keeps held frames from freezing.

STOP-MOTION: object physics run on twos (frame floored to even). Camera, type, tags and cards run on ones.

ENTRANCES ARE PHYSICAL, never fades:
- Drop: 9-frame gravity fall from -260 px, squash 1.06/0.90, spring 9/260/0.6, ±5 px seeded jitter, and a 3-4 px camera dip on heavy landings.
- Tag: springs in (12/200), then a 7° swing decaying with tau 14 frames.
- Card: slams from scale 1.4 to 1 (spring 14/320).
- Bill: feeds from 35% to 100% height over 24 frames, one printed line every 6 frames.
- Cap flip: scaleX follows cos over 6 frames, the colour swaps edge-on, 3-frame stagger.
- Bottle: slides along the counter and stops with a clink.

NUMBER REVEALS: a tag flip, card slam or bill line, fired exactly at lockF. A change is shown by a CrossedOff on the old card (maroon, 5 px, 8 frames, seed 1 or more), then the new card slams on top, offset (+40, +30). There are no count-ups.

CUTS between story beats: one timeline with overlapping Sequences, the midpoint on the bar line, no TransitionSeries, never the same cut twice running.
- Counter-slide whip: x ±1080 over 8 frames with 40 px blur.
- Paper-over: a kraft sheet slides over in 10 frames.
- Drop cut: a hard cut with the next object already mid-fall, plus a 3 px shake.
- Match zoom: an object scales ×8 into its twin in the next beat.

SFX: Kenney CC0, one cue per event, at most 5 per second, -16 dB under VO.
- chips-stack on every 3rd bar landing; chips-collide for block copies; chips-handle for tray bars.
- glass_00x clinks for bottles.
- click_00x on every 2nd cap flip.
- tick_00x per bill line.
- metalClick for the loupe and tray.
- drop_00x for stamps.
- cloth and bookFlip for whips and paper-over.

**Beats.**

- **hook**: Frame 0 is the payoff about 70% built; the last 1-3 objects land between f0 and f6.

LAYOUT (frame px; words and numbers inside x 95-850, y 150-1540)
- SOURCE CHIT at x 95, y 150, height 60: kraft #E9DCC2, tape, rotated -1.2°, Space Mono Bold 32 #3A2A20 reading 'SOURCE · ' plus the beat's src.
- BRAND BUG on an ink pill at the top right, x 600-850, y 150-206: Mark 40 plus Oswald 32 in cream.
- CLAIM LINE 1: Bricolage 800 wdth 80, 66 px, cream on dark surfaces or ink on light ones, at x 95, y 228. Settled on frame 0.
- HERO CARD (not a stamp): a cream card at x 95-520, y 300-560, rotated -3°. It holds the qualifier in Space Mono 40 maroon and the hero in Bricolage 800 wdth 75 at 220 px maroon. Already landed on frame 0 (slammed at f-6).
- CLAIM LINE 2: Bricolage 800, 56 px, at x 545-850, y 320-520.
- OBJECT ZONE: y 640-1420, base line at y 1420.
- LABEL PILLS: Space Mono 40 on ink pills at y 1440.
- BRASS KEY: the unit key at y 1478-1530.

TIMING
- f30: provenance stamp on the relevant card.
- At the narrator's number word: a dashed cream measuring line (evolvePath, 12 frames) between the two compared objects.
- Bar 2: punch 1.0 to 1.18 onto the difference.
- **pile**: A true-height unit pile. The builder picks the unit so the largest value in the story is 18-26 units (gold: 1 BAR = 1,000 t, 30 px per layer, bar face 300 px wide).

TRUE HEIGHT
- floor(v) full layers, plus one thin slab q × 30 px tall, where q is the fractional part.
- Example: 8.134 bars = 8 layers plus a 4.0 px slab, drawn with a dashed ghost of the missing part of that layer.
- Test: pixel height = v / per × 30 within 0.5 px.

MOTION
- Bar k lands at f0+8+2k, on twos.
- Last landing: thunk plus a 3 px dip.

NUMBER (at lockF)
- A jeweller's tag swings in on maroon thread tied to the top bar: x 140-720, y 236-486, rotated -3°.
- Kicker: card label in Space Mono 34 maroon.
- Number: Bricolage 800 wdth 82, 150 px, ink, tnum.
- At lockF+15 a provenance stamp lands on the tag corner.

BAR 3
- Crane up 300 px to the top.
- For estimates: an amber 4 px bracket from low to high units on the tower's right edge, with Space Mono 36 pills for the low and high values on ink, and a dashed ghost of the high end.
- The brass key slides in.

LOWER THIRD: tower base, contact shadows, the label pill and the key.

VARIANT FOR A SECOND PILE IN THE SAME STORY: a top-down vault tray (bars laid flat in rows of 4, the fraction shown as a bar cut to q of its length). This varies the middle of the story.
- **ratio**: A wide, eye-level shot at the same 30 px per layer.

MOTION
- The big tower stands left (cx 300) with its range bracket.
- Copies of the small pile drop as solid true-height blocks onto one another at cx 640, 7 frames apart: squash 0.94, chips-collide, 4 px dip.
- At lockF the cream hero card slams in, e.g. 'ABOUT 3×'.
- Space Mono 34 brackets ×1/×2/×3 draw on the copies over 12 frames.
- Bar 2: punch 1.0 to 1.6 onto the two tops, held for the rest of the beat, so the real gap and the bracket are the frame.

TESTS: copies = floor or round of the tested ratio; the copy stack top must lie inside the estimate bracket; the gap is drawn from the data, never rounded away.
- **rack**: Tiny against huge, at the SAME px-per-unit.

- The small value is drawn as a single fractional piece (e.g. 0.88 of a layer = 26.4 px thick).
- It drops at cx 640 with a heavy thunk.
- The big tower stands at left, blurred 4 px, at the same scale.
- At lockF the tag swings in, tied to the piece.
- Bar 2: a derived headline in Bricolage 800, 92 px, cream at y 300 (tested in money_tests).

BAR 3: a brass loupe (r 230, rim #E2C077 to #A47A33) slides over the piece. Its rim is labelled 'ZOOMED IN' in Space Mono 32. Inside, the piece is magnified with a hairline splitting it at the sub-share, and a Space Mono 40 pill gives the sub-value. Nothing outside the loupe is rescaled.
- **crate**: A top-down crate for shares.

GEOMETRY: 700×700 at x 125-825, y 640-1340, dark #3B3532 to #241F1D. It has 10×10 wells of 62 px at a 70 px pitch.

UNITS: 1 CAP = 1 POINT OF REPORTED SHARE. Integer shares only (tested).

CAPS
- Incumbent caps in ink.
- Challenger caps in #E39A3B with a cream rim at 1.12×, filling from the bottom-right.
- If reported parts sum below 100, the gap is shown as steel caps labelled 'OTHERS'.

TEXT
- Share card at x 95, y 250, rotated -2°. Incumbents: cream card with an ink number. Challengers: ink card with an amber number. Bricolage 800 at 200-220 px.
- Group name in Bricolage 56 cream beside the card.
- Period chip in Space Mono 32 on kraft.
- Brass key: '1 CAP = 1 POINT OF SHARE' / 'ROUNDED, AS REPORTED'.

FIRST BUILD (hook): rows drop from scale 1.25 to 1 on twos, 2 frames per row, with a rattle per row.

EMPHASIS: punch to at least 1.6× on the changed caps, held a full bar.
- **shift**: The crate holds over from the previous beat.

- The changed caps flip one every 3 frames, finishing by lockF.
- At lockF-6 a CrossedOff strikes the old card.
- At lockF the new card slams on top, offset (+40, +30) and rotated +3°.
- The period chip flips at lockF.
- No in-between value is ever shown.
- Bar 3: punch 1.6 onto the changed caps, which pulse once with a 3 px cream outline.
- **tag**: Price fact, eye-level counter.

THE BOTTLE: one upright stubby clear-glass 200 ml bottle.
- Body 150×380, neck 46 wide, crown cap 70 wide in the side's house colour.
- Cola #3B1F14 filled to 82%, an 18 px air gap, 8 seeded bubbles rising, two white highlight strokes.
- No label, no contour.
- It slides in along the counter (base y 1300) and stops with a clink.

THE TAG: at lockF a cream price tag on maroon thread around the neck flips over (rotateY 180 to 0, 8 frames).
- Kicker: Space Mono 34 maroon.
- Price: Bricolage 800 wdth 78, 200 px, ink.

OLD PRICES: a grey tag (Space Mono 56, #7A6F66) in the table's printed form, e.g. '₹12+', crossed off before the new tag.

UNKNOWN PACK SIZE: if the table has no size for an item, it is drawn as a dashed outline of an unspecified pack (rounded rectangle, no neck, no size cue), never as a 200 ml twin.

LOWER THIRD: the counter front, plus the next beat's object entering from the bottom edge.
- **say**: The beat starts with the proof object: for an 'over N×' claim, N copies of the small piece at true height stack beside the big tower in pairs on twos. The stack visibly falls short of even the low estimate.

At lockF the cream hero card slams.

BAR 3: a tilt down (8 frames) to a top-down view of THE KADAI BILL.
- Thermal paper, baked, 700 px wide at x 120-820, with a zigzag bottom edge.
- It feeds over 24 frames.
- At most 4 printed lines, each name in Space Mono 40 with its value in Space Mono 44 right-aligned on the line below.
- A dashed rule.
- A TOTAL row: a Space Mono 44 lead word, then the hero printed in Bricolage 800 wdth 78 at 200-220 px in maroon.
- A small provenance stamp on the bill corner.
- A Space Mono 34 footer carrying the caution line.
- A printer tick per line.
- **end**: - The bill tears off along its zigzag (10 frames, paper sound), revealing the tea-glass prop: the Mark redrawn at 220 px with glass highlights and noise2D steam, sitting under the same key light at x 560-780, y 1080-1380.
- A cream chit tucked under the glass carries the question (Bricolage 800, 76 px, ink, x 120-760, y 620-900) and the sub (Space Mono 44 maroon).
- A kraft source card at y 1150-1460 holds the full sources in Space Mono 32 ink.
- At bar 2: punch 1.0 to 1.06.
- The last 24 frames ease the camera back to the hook framing, with its objects ghosted at 20%, for the loop.

**Gold storyboard.** gd01 in COUNTER. Surface: velvet.

Scale: 1 BAR = 1,000 t at 30 px per layer. Homes and temples 750 px; low estimate 706.1; high 766.1; US 244.0 (8 layers plus a 4.0 px slab); 3 × US = 732.0; RBI 26.4; 25 × RBI 660.4. Base y 1420.

Locks: homes f174, US f348, ratio f421, RBI f567, say f755.

1) HOOK, f0-116. Wide, eye-level.
- Homes-and-temples tower (25 layers, cx 300, top y 670) and US tower (cx 640, top y 1176). The US tower's 8th bar and 4 px slab land at f0-6 (tink).
- 'HOMES + TEMPLES HOLD' (66 px cream, y 228).
- Cream card 'ABOUT' / '3×' (220 px maroon), landed.
- 'THE US / GOVERNMENT'S / GOLD' (56 px cream).
- Amber bracket at 23.54-25.54 layers (y 714-654) with an 'EST. RANGE' pill.
- Pills at y 1440: 'HOMES + TEMPLES · 25,000 t' and 'US GOVT · 8,134 t'. Key '1 BAR = 1,000 t'. Chit 'SOURCE · WGC estimate · US Treasury'.
- f30: ESTIMATE stamp on the hero card.
- f32 ('three'): dashed measuring line from the US top to the homes tower.
- f58: punch 1.0 to 1.18 onto the tops.

2) HOMES + TEMPLES, f116-290. Drop cut to a close shot (s 1.25).
- 25 bars land at f124-172 on twos; chips-stack every 3rd; thunk and dip at f172.
- Lock f174: the jeweller's tag swings in on maroon thread: 'HOMES + TEMPLES' / '25,000 t' (150 px).
- f189: stamp 'ESTIMATE · WGC' on the tag.
- f232: crane up 300 px. The amber bracket draws, with pills '23,537 t' and '25,537 t' and a dashed ghost of the high end.
- f240: brass key slides in.

3) US GOVERNMENT, f290-406. Whip to a top-down steel vault tray on velvet.
- 8 bars in 2 rows of 4 (scale-drop f296-326, chips-handle), plus one bar cut to 13.4% of its length with a dashed ghost of the rest.
- Lock f348: tag 'US GOVERNMENT · 30 SEP 2026' / '8,134 t'.
- f363: stamp 'OFFICIAL · US TREASURY', plus a kraft chip 'TONNES: OUR CONVERSION'.
- f378: punch onto the cut bar.

4) RATIO, f406-523. Match cut to wide, eye-level.
- Homes tower with its bracket. US copies drop as true-height blocks at f408, f415 and f422 (chips-collide, 4 px dip). The stack tops at y 688 against homes at y 670: an 18 px gap, inside the bracket (y 654-714).
- Lock f421: card 'ABOUT 3×' slams.
- f430-442: ×1/×2/×3 brackets.
- Pills: 'HOMES + TEMPLES 25,000 t', 'US GOVT × 3'.
- f465: punch 1.6 onto the tops, held to f523.

5) THE RBI, f523-697. Drop cut.
- One piece 26.4 px thick (88.05% of a layer) lands at cx 640 at f529 (thunk). The homes tower is blurred at left, same scale.
- Lock f567: tag 'THE RBI · END-MARCH 2026' / '880.52 t'.
- f581: headline 'LESS THAN ONE BAR' (92 px cream; tested 880.52 < 1,000).
- f582: stamp 'OFFICIAL · RBI'.
- f639: brass loupe 'ZOOMED IN' over the piece, with a hairline at 77.2% and the pill 'IN INDIA 680.05 t'.
- f660: amber Highlight on the pill.

6) SAY, f697-871. Wide.
- 25 RBI pieces stack in pairs on twos, f700-750, at cx 640. The stack reaches 660 px (top y 760), short of the low-estimate tick at y 714. Pill 'RBI × 25'.
- 'HOMES + TEMPLES HOLD' (66 px) slams at f700.
- Lock f755: card 'OVER 25×' slams; 'THE RBI'S GOLD.' (56 px).
- f784: punch 1.3 onto the gap.
- f813: tilt down to top-down velvet. The bill feeds f816-840: 'DATA KADAI · GOLD' / 'HOMES + TEMPLES (EST.)' 25,000 t / 'RBI' 880.52 t / dashed rule / 'HOLD' + 'OVER 25×' printed at 200 px maroon (f846).
- f852: ESTIMATE stamp. Footer: 'Dhanteras is 6 November. Household gold is an estimate.'

7) END, f871-987, hold to 999.
- The bill tears (f871-881) to reveal the steaming tea glass.
- Chit: 'How much of your savings is gold?' / 'Comment below.'
- Kraft source card: 'World Gold Council estimate (2024), as reported · US Treasury gold reserve, 30 Sep 2026 (tonnes our conversion) · RBI half-yearly report, end-March 2026'.
- f929: punch 1.06.
- f975-999: camera eases to the hook framing with the towers ghosted at 20%.

**Cola storyboard.** cw01 in COUNTER. Surfaces: teak top-down and kirana eye-level.

Locks: Campa f261, challengers f435, Coke + Pepsi f581, reply f697, say f828; hook accent f37.

1) HOOK, f0-174. Top-down crate on teak.
- 93 ink caps and 7 challenger caps (bottom-right). The last 3 rows drop at f0-4 (rattle).
- Cream card '93%' (ink, 220 px), landed.
- 'COKE + PEPSI HELD' (56 px cream).
- 'OF INDIA'S SOFT DRINKS' (Space Mono 40 on an ink pill).
- Period chip 'JAN-SEP 2024 · AS REPORTED'. Key '1 CAP = 1 POINT OF SHARE' / 'ROUNDED, AS REPORTED'. Chit 'SOURCE · NielsenIQ via ET Retail'.
- f37: maroon Circle round '93%'.
- f58: punch 1.6 onto the 7 challenger caps, held to f116; maroon Circle round them at f62-74.
- f116: pull back; ink card '~7%' (amber) labelled 'CAMPA + LAHORI ZEERA'.
- f130: AS REPORTED stamp on the 93% card.

2) CAMPA, f174-348. Whip to eye-level kirana counter.
- An upright clear 200 ml bottle with an amber cap slides in at f180-192 (clink).
- Lock f261: the tag flips: 'CAMPA · 200 ml' / '₹10' (200 px).
- f276: stamp 'AS REPORTED · GLOBALDATA'.
- f290: punch 1.2; maroon Circle round '₹10'.
- f320-340: the crate edge slides in at the bottom. Text-led cut: chit 'Back since March 2023 · Reliance bought the old brand in August 2022.'

3) CHALLENGERS, f348-523. Match zoom: the Campa cap scales ×8 into a crate cap.
- Ink card '~7%' (amber), 'CAMPA + LAHORI ZEERA', chip 'JAN-SEP 2024'.
- f408-429: 8 ink caps (indices 85-92) flip to amber, with a click on every 2nd.
- f429: CrossedOff on '~7%'.
- Lock f435: ink card 'ALMOST' / '15%' slams, offset; the chip flips to 'JAN-SEP 2025'.
- f450: cream tag 'DOUBLED' (tested 2.14).
- f465: punch 1.6 onto the 15 caps, held; caps pulse.
- f480: AS REPORTED stamp.

4) COKE + PEPSI, f523-639. Pan 200 px to the ink side.
- Cream card '93%' (f526), CrossedOff f537-549.
- Lock f581: cream card '85%' slams; 'COKE + PEPSI · JAN-SEP 2025'; the 8 changed caps pulse.
- f600: pull back to the whole crate, with the key 'REPORTED SHARES, ROUNDED'.

5) REPLY, f639-755. Whip to the counter.
- Campa bottle at left, with its ₹10 tag.
- At right: a dashed outline of an unspecified pack, with a grey tag '₹12+' crossed off at f655-665.
- Lock f697: a cream tag 'COKE / PEPSI · NEW PACK' / '₹10' flips on.
- f712: stamp 'AS REPORTED · STORYBOARD18'.

6) SAY, f755-871. Paper-over to the top-down bill on teak, feeding f760-784.
- 'DATA KADAI · SOFT DRINKS' / 'CAMPA 200 ml' ₹10 / 'COKE / PEPSI NEW PACK' ₹10 / 'EARLIER' ₹12+ (crossed) / dashed rule / 'NOW FOUGHT AT'.
- Lock f828: hero '₹10' printed at 220 px maroon.
- f840: AS REPORTED stamp. Footer: 'NielsenIQ figures as cited by industry sources.'

7) END, f871-987, hold to 999.
- The bill tears to reveal the tea glass on teak, with the crate edge at the top.
- Chit: 'Which is in your fridge?' / 'Campa, Coke, Pepsi or Thums Up?' / 'Comment below.'
- Source card: 'NielsenIQ via ET Retail (Storyboard18, 25 Nov 2025) · GlobalData, March 2023'.
- f975-999: pan back to the hook crate.

**Dependencies.**

- remotion 4.0.529 and @remotion/cli 4.0.529, pinned exactly (shared).
- @remotion/effects 4.0.529, exact: Remotion License. Used only in the bake for burlap, vignette, contour-lines, paper, white-noise, tint and radial-progressive-blur. No GL at video render.
- @remotion/rough-notation 4.0.529, exact: MIT. CrossedOff, Circle and Highlight, with seed of 1 or more.
- @remotion/paths 4.0.529, exact: MIT. evolvePath for measuring lines and threads.
- @remotion/noise 4.0.529, exact: MIT. Uses simplex-noise 4.0.1, for steam and camera breathing.
- No @remotion/transitions: cuts are overlapping Sequences. No three, Lottie or icon packs: every object is drawn in code.

**Assets.**

- BricolageGrotesque[opsz,wdth,wght].ttf from github.com/google/fonts/ofl/bricolagegrotesque: SIL OFL 1.1. Verified ₹, ×, tnum, wdth 75-100, wght 200-800.
- SpaceMono-Bold.ttf from github.com/google/fonts/ofl/spacemono: SIL OFL 1.1. Verified ₹, ×, all digits 612 units wide.
- Kenney Casino Audio 1.1 (chips-stack-1..6, chips-collide-1..4, chips-handle-1..6): CC0 1.0.
- Kenney Interface Sounds 1.0 (glass_001-006, tick_00x, click_00x, drop_00x): CC0 1.0.
- Kenney RPG Audio 1.0 (metalClick, handleCoins, bookFlip1-3, cloth1-4): CC0 1.0.
- voxplus camera code from /Volumes/DarwinSSD/MMVideo/src/voxplus (Camera.tsx): AK's own code.
- Baked surfaces and bill paper: own work, made with @remotion/effects under the Remotion License.
- Optional wall plates: MiniMax image-01 or gemini-2.5-flash-image, textless, blurred, under each provider's terms.

**AI art.** Optional, atmosphere only; the look works with none (the proofs used none).

At most one textless back-wall plate per eye-level story:
- gd01: 'empty Indian jewellery-shop back wall, out-of-focus empty glass cabinets and brass fittings, warm tungsten bokeh'.
- cw01: 'empty kirana shop back wall, plain shelves, warm light'.
Both prompts add: 'no people, no jewellery, no goods, no packaging, no deities or religious symbols, no text, no logos, 9:16'. Generate with MiniMax image-01 at 1152x2048.

Baking: tint toward #2A1C18, radial-progressive-blur, and an 8 px rack blur. The plate is shown at 35-50% opacity behind the wall gradient with 0.6 parallax, so any glyph the model invents stays unreadable. It still passes plate_qa.py before use.

Top-down teak and velvet need no plate.

Never AI-drawn: bars, caps, crates, bottles, packs, tags, cards, bills, stamps, the tea glass, currency, maps, or anything that carries a value or a word.

Covers for Counter Shorts are rendered from the Short's own hook settle frame, so the thumbnail is exactly what the video shows.

## Kadai Dispatch (newsprint chart desk) (`dispatch`, about 4.5 days)

Highest integrity score (8) and second-highest combined (20). The rotation needs one look where an honest chart is the truthful form: official release-day data (GDP, CPI, GST, UPI, RBI tables), trends with periods, share shifts and price revisions.

The retention judge's concerns are fixed:
- the persistent multi-row ledger is replaced by ONE comparison object per beat, with all rows together only in the ratio desk;
- illegible halftone plates become framed, captioned colour illustrations;
- frame 0 carries hero plus image;
- labels are at least 44 px;
- decks appear only in the text-led cut;
- each story gets a tile or scale moment;
- hero figures INK in on the narrator's word.

It is distinct from Slab and Counter because newsprint paper is the dominant ground in every beat. Colour appears only as a top fold band or the ink takeaway page. Type is serif and grotesque with no mono, and provenance uses editorial flags rather than stamps or tickets. Cheapest after Slab, reusing the shared foundation and its prototype.

**Mood.** A printed Indian financial daily, in colour.

GROUND: every frame is newsprint, baked once with @remotion/effects paper(): colorBack #EEE8DC, colorFront #E3DACB, amount 0.32, contrast 0.2, fibre 0.35, folds 0.18, seeded per beat, static within a beat. Colour appears only as:
- a top FOLD band (y 0 to 560-760) in maroon (home side or lead), ink (incumbents or official) or amber (challengers), baked as paper in those tones;
- the ink 'Takeaway' page.

TYPE
- Noto Serif Display variable. Hero figures: wght 860, wdth 66-72, tabular digits 559 units wide. Headlines: wght 560, wdth 87.5.
- Schibsted Grotesk. Kickers: 800, tracking 0.12em. Labels: 700 with its default proportional figures (its tabular figures render as '25 , 000'). Footnotes and source: 500.
- Oswald 700 only in the DATA KADAI masthead.
- No mono, no stamps, no halftone, no count-ups.

MATERIALS
- Masthead double rule: 4 px plus 1.5 px.
- A tea-glass notch: a 34 px maroon Mark glyph on a 3 px ink chart rule over a 40×8 amber notch. This replaces any newspaper red-tab chart mark.
- Hatched estimate bands.
- Editorial provenance FLAGS: a 2 px ruled box with a hatched left strip, Schibsted 800 32 px in ink or #8A5414.
- One framed colour illustration per Short, with an 'ILLUSTRATION' caption.
- A maroon editor's pencil (rough-notation).

CONTRAST (tokens.json, tested)
- ink/newsprint 14.13
- maroon/newsprint 8.04
- #8A5414/newsprint 5.12
- #4A433E/newsprint 7.96
- cream/maroon 8.93
- cream/ink 15.7
- ink/amber 5.51
- amber text on newsprint never; amber on maroon only at 200 px or more

SIZE FLOORS (frame px): hero 200, headline 64, labels 44, footnotes and source 34.

**Motion.** GRID: shared.

THREE ENTRANCE VERBS
- WIPE: clip inset from the right, 6-8 frames, easeOutCubic. For rules, bands, flags and bars.
- SET: each word rises out of its own mask, 8 frames, 3-frame stagger. For headlines.
- INK: hero figures only, fired exactly at lockF. Clip wipe over 7 frames, weight 220 to 860 over 10 frames, scale 0.94 to 1.

OBJECT FIRST: on beat 2 of each fact beat the chart object grows (14 frames, easeInOutCubic) to show magnitude. Then the voice and the INK figure land together, with the value label appearing inside the bar.

SECTION CUTS on story-beat downbeats; the outgoing Sequence overlaps by 15 frames; no TransitionSeries:
- FOLD: the band edge tweens over 15 frames, easeInOutCubic (760 to 600, 600 to 0, 0 to 600).
- COLOUR WIPE: the band colour sweeps left to right over 8 frames.
- PAGE: the ink takeaway page slides in from the right edge over 10 frames.

CAMERA: content layer only. A push from 1.000 to 1.025 across the beat toward its focus. On each internal bar downbeat, a 3-frame +3% punch and a 3-frame cream flash at 14%. Baked paper grounds stay locked, which keeps bitrate low.

EDITOR'S MARKS: Underline, Circle, Highlight, CrossedOff or Bracket. Maroon on newsprint; amber on maroon or ink. strokeWidth 6-10, drawn over 12-16 frames, seed of 1 or more. At most one per beat.

FRAME RULES: the last 12 frames of every beat are settled.

SFX (Kenney CC0)
- bookFlip1-3, rotating, on FOLD and PAGE cuts, at -14 dB.
- pluck_00x on INK.
- tick_00x on every 6th tile.
- Nothing on marks.

**Beats.**

- **hook**: FRONT PAGE.

BAND: the lead colour from config, y 0-760 (or a newsprint page with a right-hand share column for share stories).

MASTHEAD at y 150-212: 'DATA KADAI' in Oswald 40 on the left; the chip in Schibsted 700, 32 px, tracking 0.14em, right-aligned at x 850. Double rule at y 212 and y 221.

HEADLINE: the hook lines SET in Noto Serif Display 560, 76 px (fitted to 755 px), cream on the band. The hero token INKs in at the largest size that fits 755 px, capped at 330 px. Its qualifier word is set small in Schibsted 800 at 0.3em; units at 0.4em. Amber on maroon is allowed only at 200 px or more.

BELOW THE BAND: a framed colour illustration at x 95-850, y 800-1380. 2 px ink frame. The plate is baked with linear-gradient-tint and vignette, with a slow push from 1.04 to 1.10 on the plate only. Caption 'ILLUSTRATION' in Schibsted 600, 34 px, #4A433E, at y 1392.

SOURCE LINE: a 1.5 px rule at y 1466, then 'Source:' plus the beat's src in Schibsted 500, 34 px.

TIMING
- Frame 0 is rendered 8 frames into the reveal: hero plus image are on screen.
- Narrator's number word: amber rough Underline under the hero.
- Bar 2: punch, and the editorial flag WIPEs in at the band's bottom-right.
- **fact**: FOLD BAND, y 0-600, in the series colour.
- Kicker (the card label, plus date or period) at y 236: Schibsted 800, 38 px, cream (amber on ink, ink on amber).
- Hero at y 290: Noto Serif Display, wdth 68, final weight 860, fitted to 755 px and 240 px or less. It INKs at lockF.

ONE CHART OBJECT on newsprint (by 'device'). Header at y 680: tea-glass notch, 3 px rule, title in Schibsted 600, 40 px.
- 'bar': this beat's value as one thick bar (755 px = the largest same-unit value, high estimate included), 120-180 px tall at y 780-960. Previous values of the story appear as dashed ghost bars, never as solid extra rows. The label sits inside the bar in Schibsted 700, 44-56 px, cream, right-aligned. Estimates get a hatched band from low to high, with 'RANGE lo-hi' at 34 px in #8A5414.
- 'inset': the sliver at true scale, then dashed connectors (evolvePath) to a magnified box labelled 'ZOOMED IN'.
- 'share': two 100% columns (before and after periods). Labels use the printed qualifiers. Footnote: 'Two groups' reported shares, rounded; other brands not reported separately.'
- 'price': the old price (printed form, e.g. '₹12+') at 150 px, 75% opacity, with a CrossedOff; the new price INKs; ledger rows below (name ... price, 52 px, leader dots), comparing only what the table states.

LOWER STRIP, y 1220-1440: the editorial flag (e.g. 'ESTIMATE · WORLD GOLD COUNCIL · 2024'), plus either a cropped window of the same illustration with its caption, or the inset box.

TEXT-LED CUT ONLY: the deck (card text) in serif 58 px under the band, and the sub as a 34 px footnote.
- **ratio**: CHART DESK: the only beat where all rows sit together.

PAGE
- The fold retracts from 600 to 0 over 12 frames, leaving a full newsprint page. The masthead turns ink.
- Chart head at y 268 (tea-glass notch, title).
- Hero ratio INKs at lockF at y 330: Noto 300 px maroon, with its qualifier word at 0.3em in Schibsted.

ROWS
- A bar with its range hatch at y 760, and B bar at y 900, on the story scale.
- Hatched ghost copies of B slide end to end, one per beat, 10 frames each, easeInOutCubic.
- A maroon dashed line marks A's end. The honest remainder stays visible; the copy ends land inside the range band.
- Legend at y 1080: a hatched swatch and 'one more <B> worth', Schibsted 40.

BAR 2: an amber rough Bracket around the copies.
- **say**: THE TAKEAWAY.

PAGE: the ink page (baked ink paper) slides in from the right over 10 frames, with bookFlip.

TEXT
- The tea-glass notch plus 'THE TAKEAWAY' in Schibsted 800, 34 px, amber, at y 244.
- The so.lines in Noto 560, 96 px, cream.
- The starred hero INKs at lockF in amber, 270 px, with its qualifier at 0.3em.

PROOF STRIP (y 1010): the claim at the shared scale. For 'over N×': N amber tiles drop into a cream-outlined box of the big value, one every 2 frames, with a tick on every 6th tile. A dashed cream tick marks the low estimate. Caption in Schibsted 40 cream.

FOR EQUAL-PRICE CLAIMS: two bars on one level rule, the challenger in amber and the incumbent in ink with a 3 px cream outline, labelled per pack.

NOTE: so.note in Schibsted 500, 34 px, cream at 85%, at y 1200.
- **end**: LETTERS PAGE.

- Newsprint, with the hook's band colour returning as a 420 px band. The hook's hero is ghosted at 6% for the loop.
- The question in Noto 640, wdth 80, 108 px, ink, set word by word, at most 3 lines from y 460.
- end.sub in Schibsted 600, 48 px, #4A433E.
- 'Comment below.' in Schibsted 700, 52 px, maroon.
- source_lines in Schibsted 500, 34 px, ink, at y 1200-1420.
- Brand lockup: Mark 96 plus Oswald 64 'DATA KADAI' with 'KADAI' in amber.
- The last 12 frames hold still.

**Gold storyboard.** gd01 in DISPATCH. Scale: 755 px = 25,537 t (25,000 = 739.1 px, 8,133.53 = 240.5, 880.52 = 26.0, 680.05 = 20.1, 23,537 at x 790.9).

Locks: homes f174, US f348, ratio f421, RBI f567, say f755; hook accent f32.

1) FRONT PAGE, f0-116. Maroon band y 0-760 (seed 11).
- Masthead cream; chip 'GOLD · ESTIMATE'.
- 'Homes and temples hold' (serif 76, cream). Hero 'about 3×': 'about' in Schibsted 0.3em, '3' in Noto 860 at 330 px amber, '×' at 0.4em. Then 'the US government's gold' (64 px).
- Framed illustration (gd01-plate-v2-graded: bangles and coins) at y 800-1380, caption 'ILLUSTRATION'.
- Source: 'WGC estimate · US Treasury · RBI'.
- f32: amber Underline under '3×'.
- f58: punch; flag 'ESTIMATE · WORLD GOLD COUNCIL' wipes in.

2) HOMES + TEMPLES, f116-290.
- FOLD 760 to 600 (bookFlip1). Kicker 'HOMES + TEMPLES · ESTIMATE'.
- Chart head 'Gold held, tonnes' at y 680. f131-145: the maroon bar grows to 739 px, 160 px tall, at y 800. f150: hatched amber band x 791-850, with 'RANGE 23,537-25,537 t' at 34 px #8A5414.
- Lock f174: '25,000 t' INKs (about 236 px, cream) and '25,000 t' appears inside the bar (56 px cream).
- f189: flag 'ESTIMATE · WORLD GOLD COUNCIL · 2024' at y 1230.
- f232: illustration crop window at y 1280-1440 with its caption; punch.

3) US GOVERNMENT, f290-406.
- COLOUR WIPE maroon to ink (bookFlip2). Amber kicker 'US GOVERNMENT · 30 SEP 2026'.
- The homes bar becomes a dashed ghost (739 px) labelled 'HOMES + TEMPLES'. f305-319: the ink US bar grows to 240.5 px at y 1000, labelled 'US GOVERNMENT' (44 px).
- Lock f348: '8,134 t' INKs, and '8,134 t' appears at the bar end.
- f363: flag 'OFFICIAL · US TREASURY · TONNES: OUR CONVERSION' (2 lines).

4) CHART DESK, f406-523.
- FOLD 600 to 0; the masthead turns ink. Head 'Homes and temples vs the US' at y 268.
- Lock f421: 'about 3×' INKs (maroon, 300 px).
- Rows: homes 739 px with the range band at y 760; US 240.5 px at y 900.
- f435 and f450: hatched US ghost copies slide to x 335.5-576 and 576-816.5 (switch sound). The copies end inside the range band; the maroon dashed homes end is at x 834.
- Legend 'one more US government's worth'.
- f465: amber Bracket.

5) THE RBI, f523-697.
- Maroon band folds down to 600 (bookFlip3). Kicker 'THE RBI · END-MARCH 2026'.
- Dashed homes ghost; the maroon RBI sliver (26 px) at y 1000, at f538.
- Lock f567: '880.52 t' INKs.
- f581: dashed connectors to a 'ZOOMED IN' box at y 1080-1300: 'RBI 880.52 t' (755 px) and 'HELD IN INDIA 680.05 t' (583 px), labels inside at 44 px.
- f610: maroon Highlight on 'HELD IN INDIA 680.05 t'.
- f639: flag 'OFFICIAL · RBI HALF-YEARLY REPORT'.

6) TAKEAWAY, f697-871.
- The ink page slides in. 'THE TAKEAWAY'. 'Homes and temples hold' (96 cream).
- Lock f755: 'over' plus '25×' INKs (270 px amber); 'the RBI's gold.'
- f760-808: 25 amber tiles of 26.0 px fill a 739 px cream-outlined 'HOMES + TEMPLES' box at y 1010. 88 px stays ink, and a dashed tick at 695.9 px shows 45 px uncovered at the low estimate. Caption 'Homes and temples, in RBI-sized pieces'.
- f813: amber Underline. Note: 'Dhanteras is 6 November. Household gold is an estimate.'

7) LETTERS PAGE, f871-999.
- Maroon 420 px band, with '3×' ghosted at 6%.
- 'How much of your savings is gold?' (108 px ink). 'Comment below.' (maroon).
- Sources: 'World Gold Council estimate (2024), as reported · US Treasury, 30 Sep 2026 · RBI, end-March 2026'.
- Brand lockup. Hold f987-999.

**Cola storyboard.** cw01 in DISPATCH. Incumbents ink, challengers amber, newsprint lead.

Locks: Campa f261, challengers f435, Coke + Pepsi f581, reply f697, say f828; hook accent f37.

1) FRONT PAGE, f0-174. Newsprint page; masthead ink; chip 'SOFT DRINKS'.
- Left column x 95-655: 'Coke and Pepsi held' (serif 76, 2 lines); '93%' (Noto 860, wdth 64, 300 px, ink); 'of India's soft drinks' (64 px).
- Right: a share column x 700-850, y 262-1300. Ink 965 px over amber 73 px, labelled '~7%' (44 px, #8A5414) and 'JAN-SEP 2024' (34 px).
- Framed illustration (cw01-plate-v2-graded) at x 95-655, y 960-1380, caption 'ILLUSTRATION'.
- Source: 'NielsenIQ via ET Retail (Storyboard18, Nov 2025)'.
- f37: maroon Circle round '93%'.
- f58: punch.
- f116: maroon Circle round the amber segment (seed 6); flag 'AS REPORTED'.

2) CAMPA, f174-348. Amber band folds down to 600 (bookFlip1). Ink kicker 'THE ₹10 BOTTLE · 2023'.
- Lock f261: '₹10' INKs (ink on amber, 300 px).
- Ledger row at y 760: 'CAMPA · 200 ml ........ ₹10' (52 px).
- f276: flag 'AS REPORTED · GLOBALDATA, MAR 2023'.
- f290: illustration crop window at y 1100-1420, captioned. Text-led cut: deck and sub.

3) CHALLENGERS, f348-523. Amber band stays; kicker 'CAMPA + LAHORI ZEERA'.
- Share columns at y 700-1260 (560 px = 100%): the 2024 column x 230-370 draws at f363 (ink 521 over amber 39, label '~7%'); the 2025 column x 560-700 grows f421-435 (ink 476 over amber 84).
- Lock f435: 'almost 15%' INKs ('almost' at 0.3em plus 260 px serif), and the amber label 'ALMOST 15%' appears. Ink labels stay hidden until the next beat.
- f437-449: dashed slope.
- Footnote: 'Two groups' reported shares, rounded; other brands not reported separately.'
- f450: flag 'AS REPORTED · NIELSENIQ VIA ET RETAIL'.
- f465: maroon Circle.

4) COKE + PEPSI, f523-639.
- COLOUR WIPE amber to ink. Amber kicker 'COCA-COLA + PEPSICO'.
- Same columns; the amber segments re-hatch #C9BFAF. '93%' appears on the left at f530.
- Lock f581: '85%' INKs (cream), with the right label '85%'.
- f595: maroon Bracket on the 2025 ink segment.

5) REPLY, f639-755. Ink band; kicker 'THE REPLY'.
- '₹12+' (serif 500, 150 px, cream at 75%) with an amber CrossedOff at f655-665 (seed 2).
- Lock f697: '₹10' INKs at 300 px cream.
- Ledger rows: 'CAMPA · 200 ml ........ ₹10' and 'COKE / PEPSI · NEW PACK ........ ₹10' (no ml).
- f712: flag 'AS REPORTED · STORYBOARD18'.

6) TAKEAWAY, f755-871. Ink page.
- 'The cola war is now fought' (96 cream).
- Lock f828: 'at' plus '₹10' INKs in amber.
- Proof at y 1100: two equal bars on one level rule. 'CAMPA ₹10' in amber; 'COKE / PEPSI NEW PACK ₹10' in ink with a 3 px cream outline; '(per pack)' in 34 px.
- Note: 'NielsenIQ figures as cited by industry sources. Shares are of all soft drinks.'

7) LETTERS PAGE, f871-999.
- Newsprint, with the hook's share column ghosted at 8%.
- 'Which is in your fridge?' (108 px ink). 'Campa, Coke, Pepsi or Thums Up?' (48 px #4A433E). 'Comment below.'
- Sources: 'NielsenIQ via ET Retail (Storyboard18, 25 Nov 2025) · GlobalData, March 2023'.
- Lockup. Hold.

**Dependencies.**

- remotion 4.0.529 and @remotion/cli 4.0.529, pinned exactly (shared).
- @remotion/effects 4.0.529, exact: Remotion License. Bake only: paper() grounds, plus linear-gradient-tint and vignette grading of plates. No halftone, and no HtmlInCanvas.
- @remotion/rough-notation 4.0.529, exact: MIT.
- @remotion/paths 4.0.529, exact: MIT (evolvePath connectors).
- No @remotion/transitions, layout-utils or google-fonts.

**Assets.**

- NotoSerifDisplay[wdth,wght].ttf from github.com/google/fonts/ofl/notoserifdisplay: SIL OFL 1.1. Verified ₹, ×, tnum, tabular digits 559 units wide, wdth 62.5-100, wght 100-900. File is 1.84 MB.
- SchibstedGrotesk[wght].ttf from github.com/google/fonts/ofl/schibstedgrotesk: SIL OFL 1.1. Verified ₹, ×, pnum by default.
- Oswald-700.woff2 (existing, OFL): masthead only.
- Kenney RPG Audio 1.0 (bookFlip1-3) and Interface Sounds 1.0 (pluck_00x, tick_00x): CC0 1.0.
- Graded plates: the same QA-approved textless plates as Slab, baked with tint and vignette (own work under the Remotion License for the bake; provider terms for the source image).
- Baked paper grounds: own work.

**AI art.** At most two framed, captioned illustrations per Short, never behind a number, label or source line.

The first reuses the story's QA-approved textless plate (gd01-plate-v2, cw01-plate-v2), graded at bake with linear-gradient-tint (dusk cream to maroon at low strength) and vignette. There is NO halftone, which read as mush on a phone.

Plates are generated by MiniMax image-01 at 1152x2048 with the 'one object, centred in the lower 60%, plain background' rule, so they read at window size.

Every window carries the caption 'ILLUSTRATION' (34 px). AI art in a newspaper layout must never pass as press photography.

No maps, flags, logos, contour bottles, people, currency or religious imagery. plate_qa.py checks each plate at window scale.

Every word, number, bar, column, flag and mark is drawn in code.

## Integration

1) HOW A CONFIG PICKS A LOOK. Money configs (public/datayt/beats/configs/<id>.json) gain an optional top-level field "look": "slab" | "counter" | "dispatch".
- Leaving it out keeps today's BeatStory exactly.
- build_beats.py refuses "look" on any type other than "money", so map and state-comparison Shorts can never take one.

Look options:
- slab: optional "variant" {plate, layout, wipes, device}; otherwise seeded from the id.
- counter: "surface" (velvet | teak | kraft) and "unit_object" {kind: gold_bar | crown_cap | bottle200 | coin | box | token | tag, per, key}.
- dispatch: "lead" (maroon | newsprint | ink).

Shared new fields:
- "plate": a QA-approved textless plate path.
- "source_lines": full sources for the end card.

Per card:
- "label": 1-4 anchor words.
- "prov": {kind: OFFICIAL | ESTIMATE | AS REPORTED, by, when}.
- "src": the per-beat short source.
- "range": {lo: item, hi: item}.
- "device": bar | inset | share | price | tiles.
- "old": {item, printed}.
- "proof": {kind: tiles, unit: item, of: item}.
- "legend".

Qualifiers come only from the source table's "printed" field ('roughly 7%' becomes '~7%'; 'almost 15%' becomes 'ALMOST 15%') or from a money_test range ('about 3×' needs a test with both min and max).

2) WHAT build_beats.py MUST ADD (money branch, only when look is set)
- (a) beats[0] becomes {"kind": "hook", lines, hero token, vo, plate} with no 'spot' and no geo; facts carry no geo 'India'. house_rules accepts kinds[0] == 'hook' when cfg.look is set; every other rule still applies (12-word hook, 8-word lines, 13-word VO, banned words, title).
- (b) data.json gains: look, lookOpts, sources, and per beat label, hero {text, prefix, unit, qual}, prov, src, range {lo, hi, loV, hiV}, scale key, rows (name, label, v, role: home | incumbent | challenger | ref), share {periods, parts, printed, seam | others}, old, proof, units, plus lock (s) and lockF (frame). lock and lockF are written by scripts/datayt/word_times.py: a character-position estimate snapped to the first quarter-beat grid point at or after onset-3 frames; whisper.cpp word timings replace it once approved. text and sub are kept for the text-led cut.
- (c) New tests in scripts/datayt/look_checks.py, called by build_beats.py:
  - every on-screen string and number is a checked value, a free_number, a printed qualifier or config text; unit keys ('1 BAR = 1,000 t'), tile counts and derived headlines must be in free_numbers or money_tests;
  - share parts come from matching periods and sum to 100 or less (an OTHERS part is added when below 100; a 'rounded, as reported' seam when exactly 100 with qualifiers);
  - same-unit values only on one scale; inset required under 4% of the scale; tile proof refused when tiles would be under 20 px;
  - Counter true-height: px = v / per × layer within 0.5 px; unit chosen so the largest value is 18-26 units;
  - 20 characters per second per text slot, and 4 words or fewer per voiced-cut label;
  - contrast of every text/ground pair from each look's tokens.json;
  - plate exists and has a QA record;
  - lockF lies inside [t0, t1 - 12 frames];
  - look rotation against docs/datakadai/ops/looks_log.csv: fail if the last two uploads used this look, and fail a Slab whose variant matches the previous Slab on 3 or more of 4 axes.
- (d) beatData.ts generation is unchanged.

3) HOW THE LOOK IS DISPATCHED. BeatStory.tsx is NOT edited. src/datayt/DataVideos.tsx changes one expression in the two BEATS maps: component = LOOKS[d.look] ?? BeatStory, for DATA-<id> and DATA-<id>-text, and adds <LookBakeStills/>.
- Composition ids, durations (Math.ceil(total*30)), 1080x1920 and 30 fps stay identical, so week_pack, scene_frames.py, post_assets.py and BeatPosts keep working.
- The text-led test still works: each look reads textLed = D.vo.length === 0 and only then shows decks and subs.
- Covers for look Shorts: Covers.tsx renders the Short's own hook settle frame plus the code-drawn headline, so the thumbnail promises what the video shows.

4) WHAT STAYS SHARED ACROSS ALL THREE LOOKS (src/datayt/looks/shared)
- Timing: the builder's 124 BPM bar grid and t0/t1 (2-3 bars per beat), unchanged; lockF on the narrator's number word; last 12 frames of each beat settled for scene_frames.py (t1 - 0.4 s).
- Audio: LookAudio copies BeatStory's music duck (0.14 under VO) and VO Sequences; the Sfx cue table per look, at most 4-5 cues per second, ducked.
- Captions: captions.md, yt_title and the post pack are unchanged; no burned-in word captions in the voiced cut.
- Safe area: SAFE_BOX x 95-850, y 150-1540 in frame px for every word and number, enforced by useLayoutGuard, which also throws on collisions, an empty lower zone and text below role minimums. Backgrounds bleed full frame.
- Brand: the Mark plus Oswald 700 'DATA KADAI' bug on every frame.
- Source: a per-beat short source line (32-34 px) on every frame, and the full source_lines on the end card in every look.
- Plates: the shared Plate component with QA gate and fallback.
- Grain: baked tiles.
- Fonts: loaded by FontFace with delayRender and a ₹ probe.
- Measurement: a one-time DOM measurement of data.json strings.

5) RENDERING
- @remotion/effects is used ONLY by LOOK-BAKE-* stills, rendered by scripts/datayt/bake_looks.py with `npx remotion still ... --gl=angle`. Results are written once to public/datayt/looks/bake/*.jpg|png, hash-tracked and committed.
- No video or post render needs WebGL. No remotion.config.ts is added. Map Shorts keep today's default GL and `--crf=18`. Studio is unaffected.
- Look Shorts render with `npx remotion render src/index.ts DATA-<id> short.mp4 --hardware-acceleration=if-possible --video-bitrate=10M` (no --crf: crf silently turns VideoToolbox off), and the same for DATA-<id>-text.
- render_posts.mjs gets bundle({symlinkPublicDir: true}) only.
- Renders are serialised, one at a time.

6) PACKAGES: exact pins remotion 4.0.529 and @remotion/cli 4.0.529. Add --save-exact @remotion/effects@4.0.529, @remotion/rough-notation@4.0.529, @remotion/paths@4.0.529 and @remotion/noise@4.0.529. React stays 19.3.0. No @remotion/transitions, three, google-fonts, layout-utils or Lottie.

7) ROTATION AND ROUTING. Suggested routing:
- Counter: gold, money and wealth stories, Kadai Wars brand battles, 'what ₹X buys'.
- Dispatch: official release-day tables, trends with periods, share shifts, price revisions.
- Slab: records, single big numbers, 'X times' hooks, fast rounds.
The same story type may use another look to respect the 2-in-a-row cap. Map and state stories stay on BeatStory.

8) BUILD ORDER AND ACCEPTANCE
- Shared foundation plus Slab first (5.5 days), then Counter (7.5), then Dispatch (4.5).
- Each look's first build renders full gd01 and cw01 with audio, plus scene_frames stills, for AK's review.
- Targets: 60 s or less render and 45 MB or less at 10 Mbps.
- No look ships until AK approves the frames and the rule change in section 2(a).

## Rejected

- **Kadai Diorama (whole look)**: Lowest combined score (retention 6, integrity 5, feasibility 3 = 14).
- There is no prototype at all.
- Every story needs an authored world of 3-5 rooms, matching AI plates and often new props, which does not map onto the money config and breaks the daily cadence.
- It carries the highest AI-plate risk (lettering, idols, flags, perspective fighting the floor line).
- Several devices imply unsourced facts: a level tharasu and twin 200 ml bottles imply equal pack sizes; 'empty shelves' editorialises the RBI; the almirah implies all 25,000 t sits in homes.
- It proposed DK-<id>-diorama ids that break post_pack.
- Its object vocabulary overlaps Counter.
Its best ideas (true-height units with a legend, camera crane and pull-back, hook echo) are grafted into Counter and Slab.
- **Dispatch's persistent multi-row ledger chart and halftone news plates**: The ledger is the 'chart shown as video' pattern the benchmark ranks lowest, and puts 7-8 elements on screen. 8-10 px halftone dots turn plates into illegible dot fields on a phone. Replaced by one comparison object per beat and framed, captioned colour illustrations.
- **Counter's hero rubber stamps and ceil-layer ISOTYPE piles**: A hero value slammed as a stamp looks certified, which is misleading for estimates. Partial units drawn at full layer height made 3 × US look as tall as homes (and 9-layer copies would be taller), the opposite of the data. Replaced by cards, tags and bill lines for heroes, stamps for provenance only, and true fractional height.
- **Slab's 'ALL SOFT DRINKS = 100%' market glass and 16th-note word slams**: The source never says the two groups are the whole market (7 and 15 are 'roughly' and 'almost'). 16th-note slams of whole narration lines duplicated the voice and risked fatigue. Replaced by 'REPORTED SHARES' with printed qualifiers, an OTHERS rule, and 4 words or fewer on 8ths.
- **Count-up tweens and real-digit rolling numbers (Remotion Number Counter, Remocn number-wheel, number-flow, react-countup, react-slot-counter)**: They show values that are not in the source table (the prototype caught a readable '84%' on the way to 15%). number-flow and the slot counters run on wall-clock time, and number-wheel formats en-US (123,456). Replaced by glyph-free reels, tag flips, card slams and INK, all locked on the spoken word.
- **@remotion/transitions shader presentations, HtmlInCanvas and TransitionSeries**: On 4.0.529 an HtmlInCanvas scene under a shader transition hangs the render (28 s delayRender timeout). TransitionSeries also shortens the timeline and breaks the 124 BPM t0/t1 grid. All cuts are overlapping Sequences in one timeline, and effects are baked to images.
- **@remotion/three / React Three Fiber 3D props**: Heavy (about 22 MB of three.js) and GPU-bound. The ThreeCanvas camera prop is not frame-deterministic across concurrency without a custom rig. 3D alone does not win in the benchmark. Code-drawn 2.5D objects in Counter give the object feel at near-zero cost.
- **A global --gl=angle via remotion.config.ts**: It would shift anti-aliasing on the untouched map look, and Studio and post renders would all need WebGL. Baking every effect once confines WebGL to bake_looks.py.
- **The Economist-style red tab chart mark, and Coke-red vs Pepsi-blue colour coding**: Borrowed trade dress that weakens Data Kadai's own identity, and brand colours that read as trade dress. Replaced by the tea-glass notch, and by house colours: incumbents ink or maroon, challengers amber.
- **@remotion/sfx ding, vine-boom and meme sounds; Mixkit, Sonniss and LottieFiles assets in the repo**: Not free-licensed, or off-brand for a credibility-led channel, or not redistributable in a public repo. Only Kenney CC0 audio is vendored.
- **Paper Shaders (@paper-design/shaders-react) and the Remocn shader-* backgrounds**: 0.0.x API churn, WebGL at render time, and frame accuracy not proven after first paint. Baked @remotion/effects textures cover the same need deterministically.
- **@remotion/google-fonts**: 68 MB, and it fetches from Google at render time on an offline-capable Mac Mini. Fonts are vendored TTFs from google/fonts with OFL.txt alongside.

## Resource shortlist

| Name | Use | Licence |
| --- | --- | --- |
| [@remotion/effects 4.0.529](https://www.remotion.dev/docs/effects) | Bake-only textures: paper (Dispatch grounds, Counter kraft and bill), burlap + vignette (Counter velvet), contour-lines (Counter teak), white-noise (grain tiles), starburst (Slab), tint, linear-gradient-tint and radial-progressive-blur (plate grading) | Remotion License (npm UNLICENSED); free for an individual or a company of up to 3 people |
| [@remotion/rough-notation 4.0.529](https://www.remotion.dev/docs/rough-notation/api) | Editor's marks in all looks: Underline, Circle, Highlight, CrossedOff, StrikeThrough, Bracket, Box; seed 1 or more | MIT |
| [@remotion/paths 4.0.529](https://www.remotion.dev/docs/paths/) | evolvePath for inset connectors, measuring lines and tag threads | MIT |
| [@remotion/noise 4.0.529](https://www.remotion.dev/docs/noise) | Counter tea-glass steam and the ±1 px camera breathing | MIT |
| [Anybody variable font](https://github.com/google/fonts/tree/main/ofl/anybody) | Slab display type and stand-up numbers (wdth 50-150, wght 900) | SIL OFL 1.1 |
| [IBM Plex Mono Bold](https://github.com/google/fonts/tree/main/ofl/ibmplexmono) | Slab chips, provenance tickets and source lines | SIL OFL 1.1 |
| [Bricolage Grotesque variable](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque) | Counter heroes and claims (tnum, wdth 75-100) | SIL OFL 1.1 |
| [Space Mono Bold](https://github.com/google/fonts/tree/main/ofl/spacemono) | Counter tags, Kadai Bill, source chit and unit keys | SIL OFL 1.1 |
| [Noto Serif Display variable](https://github.com/google/fonts/tree/main/ofl/notoserifdisplay) | Dispatch hero figures (tabular) and headlines | SIL OFL 1.1 |
| [Schibsted Grotesk variable](https://github.com/google/fonts/tree/main/ofl/schibstedgrotesk) | Dispatch kickers, labels, flags and footnotes | SIL OFL 1.1 |
| [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) | switch, tick, click, drop, glass and pluck cues across the looks | CC0 1.0 |
| [Kenney Casino Audio](https://kenney.nl/assets/casino-audio) | Counter chips-stack, chips-collide and chips-handle for bar landings and copies; Slab say proof | CC0 1.0 |
| [Kenney RPG Audio](https://kenney.nl/assets/rpg-audio) | bookFlip (Dispatch folds, Counter paper-over), metalClick, handleCoins, cloth | CC0 1.0 |
| [MMVideo voxplus kit (Camera.tsx, Transitions.tsx, Sound.tsx)](file:///Volumes/DarwinSSD/MMVideo/src/voxplus/README.md) | Counter camera rig, directional blur and cut choreography, ported to 1080x1920 on the same Remotion 4.0.529 and React 19.3 | AK's own code |
| [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | Choreography reference only (misregistration hit, crash-zoom punch, paper-title-card); re-implemented, no code or audio copied | Apache-2.0 (code); bundled audio not cleared |
| [@remotion/install-whisper-cpp 4.0.529 + whisper.cpp base.en model](https://www.remotion.dev/docs/install-whisper-cpp) | Optional: word timestamps for exact lock frames on the narrator's number word (replaces the character-position estimate) | MIT (package and whisper.cpp; Whisper weights MIT). Needs AK's approval to download about 150 MB |
| [GitHub Unwrapped](https://github.com/remotion-dev/github-unwrapped) | Reference for 'one look system, many data-driven stories' and for premium coming from art direction rather than 3D; read for patterns only (pinned to 4.0.240) | MIT code; its audio is not reusable |

## Completeness critic

- COVERAGE (biggest gap): the devices are designed around gd01 and cw01 only. The 4 other money configs already in the repo do not map onto them. fm02 has negative values (−0.63%), a '9 of 11' tally and 3 year bars. fm03 has '75.44 crore' and −28%. fm04 has '₹1.13 lakh cr', '10 years' and a 22.95 lakh count. fm05 has a ₹50,000 rule threshold and a 'quotes' field. The Board's static glyph set (₹ , . × %) has no − or + and no lakh/crore unit handling. useLayoutGuard throws when the lower zone is empty, and most of these cards have no bar, ratio, share or price device. As written, those Shorts fail to build.
- COVERAGE: no look designs a trend or time-series line, a ranking of 3 or more entries, a count or tally, a threshold or rule, or a quote/'proof slip' beat. Dispatch's stated job is release-day tables and trends, yet it has no line device. Kadai Wars has no multi-round scoreboard or round beat, and no release-day storyboard exists. The text-led cut has no per-look storyboard either.
- COVERAGE: the 'basket' type covers national item prices (fs01-fs04, fm01 Jan Dhan). It gets the same all-India blob hook and geo 'India' fact cards (build_beats.py line 705/716), so it has the same templated problem. But 'look' is allowed on 'money' only, so these national stories keep the old template.
- INTEGRATION BUG: src/datayt/BeatPosts.tsx imports BeatStory directly and renders it inside Frame. So ig/01.png… carousel slides and x.png would show the OLD cream template for look Shorts. BeatPosts is missing from files_to_create, and the claim 'BeatPosts keep working' is wrong. The Measurer and layout guard will also measure inside a scale() transform there.
- UNVERIFIED CORE DEVICE: word_times.py does not exist, and the vo_*.mp3.json sidecars hold no timing. The lock frames in both storyboards (f32, f174, f755…) match a characters-over-duration estimate, not speech. A colon pause ('Homes and temples: about twenty-five…') can shift onset by about 0.3 s, so the number could land before it is spoken. Check against the mp3s locally (energy onset or forced alignment), and check whether MiniMax T2A returns subtitle timestamps, before whisper is needed.
- UNVERIFIED PROTOTYPE CLAIM: the '23.6-24.9 s render' prototype (scratchpad/kin, 731 lines) has no Audio, no clipPath plate-in-type, no grain, no tickets, guards or SFX, and it still has the rejected '100%' glass. The post-fix Slab's render cost and file size are unmeasured. Also unverified: CSS clip-path:url(#svgText) on an HTML element, with Anybody wdth/wght inside an SVG clipPath, rendered deterministically across concurrency. Effort (5.5 days for about 40 files plus 5 scripts) looks optimistic.
- INTEGRITY: holdings_2026.json says 'No WGC primary document found… AK to confirm before posting'. The 25,000 t figure comes from 2019/2026 press reports, and the range comes from Deccan Chronicle citing WGC. Yet the tickets and stamps read 'ESTIMATE · WORLD GOLD COUNCIL · 2024' / 'ESTIMATE · WGC', which implies a primary source. They should read 'WGC ESTIMATE, AS REPORTED', and no look should ship gd01 until AK confirms the source. The say line also compares a 2024 estimate with March 2026 RBI holdings; neither storyboard flags the date mismatch.
- HARD-RULE RISK: the gold plate prompt asks for 'bangles, coins and bars', and Dispatch's gold illustration has coins too. The assets research warned never to have AI generate currency. Coins tend to come out with pseudo-script, ₹ marks, emblems or Lakshmi faces. Use 'plain unmarked discs' or drop coins. Separately, filling hero digits with AI texture is a new reading of 'AI only as textless background/props' and needs AK's explicit OK.
- INTEGRITY: in cw01, 93+7 and 85+15 sum to exactly 100. So the Slab share box, the Counter 100-cap crate and the Dispatch 100% columns all still look completely full, which shows the two groups as the whole market whatever the header says. Dispatch's footnote 'other brands not reported separately' is not in the source table. Counter draws exactly 7 and 15 caps for 'roughly 7%' and 'almost 15%', which is false precision. cw01's Dispatch note 'Shares are of all soft drinks' contradicts the spec's own integrity fix.
- SELF-CONTRADICTION: the storyboards break the spec's own checks. (a) 20 cps: 'OFFICIAL · US TREASURY · 30 SEP 2026 · TONNES: OUR CONVERSION' (about 60 characters) appears at f363 in a beat that ends at f406 (1.4 s, about 28 characters allowed), and the cola reply ticket is the same. (b) Collision: the brand bug (about x 626-850, y 1488-1532) overlaps the ZOOMED IN box (y 1340-1500) and the 'Rounded shares' note at y 1475. (c) Slab changes only on story-beat downbeats, but cw01 wipes at f116 and the say beat wipes to maroon at bar 2. (d) '8,134 t' is printed inside the US bar at f305-319, before lockF f348, which spoils the lock that Board enforces.
- STILL TEMPLATED: inside each look every fact beat uses one skeleton. Slab is name block / board / lower bar. Dispatch is fold / kicker / hero / chart / flag. Every Slab hook and say is a centred plate-in-type, and every end card in all three looks is question + 'Comment below.' + sources. The seeded axes only move placement and wipes. The research's own advice (several opening and ending styles per story, the hook and say archetype varied per story) is not applied. All stories keep the same 7-beat arc.
- ROTATION GAP: Slab ships alone first (5.5 days) while the rule fails 'the last two uploads used this look'. So every third national Short either falls back to the templated BeatStory or is blocked. looks_log.csv is appended at post-pack time, but AK posts by hand and reorders week packs (9 Shorts in week 1). Rotation must be checked against the posting calendar, not build order. The spec also does not say whether BeatStory counts as a look.
- CONTRAST NOT COVERED BY look_checks: plate-filled glyphs are not tested. Cola-filled '93%', '₹10' and '10' digits (dark brown) sit on maroon or ink slabs, so legibility rests on a 7 px outline. In Counter, ink caps #2A2523 on the #3B3532-#241F1D crate are about 1.2:1, so the 93-cap majority is nearly invisible. Contrast on textured velvet or teak cannot be checked against flat tokens.
- FONT BUG: Noto Serif Display (Dispatch hero figures) has no U+2212 minus; I checked the cmap. The repo's data uses '−0.63%' and '−28%', so those signs fall back to another face. Anybody's default digits are proportional (763-885 units), so Board and Stack must turn tnum on explicitly; the spec does not say this.
- BRAND/PALETTE: PREFERENCES.md fixes Oswald 700 for headlines and Inter for body. The looks move Oswald to the bug only and add 6 families, which changes a fixed brand rule (PREFERENCES must be updated). Off-palette colours conflict with 'palette limited to brand tokens': Slab's steel-grey OTHERS band; Counter's teal #2F5A56, #9A5B12, steel caps and #E39A3B; Dispatch's #8A5414 and #4A433E.
- AK'S PRIOR VERDICTS NOT CONSULTED: Styles.tsx records 'AK 27 Sep: Isometric and Kolam dropped' and keeps Collage, Broadsheet, Swiss, Riso and Comic. Counter's oblique 2.5D bars and vault tray come close to the dropped isometric style, so show AK a still before 7.5 days of work. The AK-approved ResultNapkin, Compare.scale (tharasu, named for Kadai Wars in DATA_KADAI_PLAN) and Growth.stacks are not reused; Counter rebuilds piles from scratch.
- CROSS-POSTING: only the YouTube safe area (150/380/230/95) is designed. Instagram Reels' top header and the bottom caption/CTA overlay are taller. The chip and source line (y 172-258), the LOWER zone (y 1200-1500) and the brand bug may be covered on Reels, which puts the 'source on screen' rule at risk there. This was not checked.
- AUDIO: music_shorts.make already adds hits and ticks at every beat t0 (build_beats.py line 903). The Slab switch_00x on every wipe will double up on those cues, and the 'at most 4 cues per second' budget ignores music hits. Music stays one generator at 124 BPM for all looks, so looks differ in SFX but not in their music bed.
- LICENCE NOT VERIFIED: nobody read the MiniMax image-01 or Gemini 2.5 Flash Image output terms (commercial use, ownership, redistribution). The plates are committed (public/datayt/covers is tracked) to github.com/AKKarthikeyan/mmvideo, which research found publicly reachable. PREFERENCES requires the description to say how the video was made, and it mentions only AI voice, not AI-generated art. No decision is recorded on YouTube's altered-content label or Instagram's AI info label.
- FEASIBILITY: the plate fallback is a solid cream glyph, but the build fails without a QA'd plate, so the fallback never runs. Hot release-day Shorts cannot wait for plate generation plus AK sign-off; allow a no-plate variant. Also, gemini-2.5-flash-image cannot output 1152x2048 (only aspect ratios, 768x1344 at 9:16), so 'MiniMax or Gemini' is not interchangeable.
- FEASIBILITY: the layout, collision, lower-zone and digit-before-lockF guards throw at render time. That only covers frames actually rendered, and it fails late in the nightly pipeline and in Studio. Run them as a build-time still or QA pass. There is also a write conflict: word_times.py writes lock/lockF into data.json, and build_beats.py rewrites that file.
- RE-VOICE CASCADE: the storyboards tie lockF to bar downbeats (say wipe at f755 = lock). The proposed 'homes and temples' re-voice moves 'three' from f32 to about f50 and 'twenty-five' to about f769, so the say choreography breaks, not just the numbers. Frame count is also off by one: the composition is ceil(33.303×30) = 1000 frames (0-999), not 999.
- RESEARCH NOT USED: retention research advised carrying an object across beats (Heer and Robertson staging), but Slab hard-wipes the ground every beat. Unused options: d3-voronoi-treemap or d3-hierarchy for 3+ share parts; the Kurzgesagt-style instrument/gauge and 'Kadai calculator' for price and rule stories; the 'proof slip' for config quotes; the Instagram cross-post constraint. Only Slab has an A/B plan, and there is none for attributing 'Stayed to watch' across 3 rotating looks.

BLOCKERS, to fix before any build:
(1) The devices cover only gd01 and cw01. fm02 to fm05 (negatives, tallies, durations, lakh crore, rules, quotes) and the 5 basket stories cannot be expressed, and the lower-zone guard would throw on them.
(2) BeatPosts.tsx hard-imports BeatStory, so every look Short's Instagram carousel and X image would still show the old template.
(3) The lock-on-the-word device, the main retention idea in all three looks, rests on a character-position estimate. word_times.py does not exist and the VO has no timing data.
(4) gd01's household-gold source is unconfirmed (the source table itself says AK must confirm), yet the tickets present it as a WGC estimate.

HIGH:
- The gold plate prompt includes coins, despite the warning against AI-generated currency.
- In cw01 the share visuals still look 100% full, and Counter draws false-precision caps.
- The storyboards break the spec's own 20 cps, collision, slab-change and digit-before-lock rules.
- The within-look skeleton and the end card are identical every time, so videos will still read as templated.
- The rotation rule is unworkable while Slab ships alone.

MEDIUM:
- Plate-filled cola digits and Counter's ink caps on the dark crate have poor contrast, and look_checks does not test either.
- Noto Serif Display has no minus sign.
- Off-palette colours, and the change to the fixed font setting in PREFERENCES.md.
- Instagram safe zones were not checked.
- Music hits will double up with the new SFX.
- AI image output terms and AI-art disclosure are unverified.
- The plate fallback contradicts the build rule, which blocks hot release-day Shorts.

LOW:
- 1000 vs 999 frames.
- Counter's 2.5D style is close to the isometric style AK dropped.
- Unused research ideas: staging across beats, voronoi shares, gauge or calculator devices.
- Render-time guards should run as build-time checks.

Verified OK: all 9 baked effects exist in @remotion/effects 4.0.529. Anybody (wdth 50-150, default wght 100, tnum), IBM Plex Mono, Bricolage and Schibsted all have ₹ and ×. The gold scale arithmetic (739.1 / 240.5 / 26.0 px; 3 × US ends at x 816.5, inside the band) and the cw01 bar timings (hook 3 bars, total 33.303 s) match data.json.

## Open questions

- gd01 wording: every integrity judge requires 'homes and temples', because the 25,000 t estimate includes about 4,000 t of temple and trust gold. They also require 'about 3×' (2.89× at the low estimate). Proposed changes: hook lines become 'Homes and temples hold' / '*about 3×* the US' / 'government's gold'; hook VO becomes 'Indian homes and temples hold about three times the US government's gold.'; say VO becomes 'Indian homes and temples hold over twenty-five times the RBI's gold.'; title becomes 'Indian Homes and Temples Hold 3× the US Government's Gold'. Approve, and re-voice those two MiniMax lines? Also: gd01 is planned for Mon 26 Oct in the current look. Post it as is, or hold it for a new look?
- cw01 VO: the screen will say 'ALMOST 15%' (the source says 'almost 15%'). Should the VO also change to 'almost fifteen percent'?
- Rule change: build_beats.py currently fails any money Short whose hook is not the 'spot' India map. Approve that national money stories with a 'look' open on a code-drawn hook instead, with no geo 'India' silhouette? Map and state stories are unchanged.
- Fonts: approve Anybody and IBM Plex Mono (Slab), Bricolage Grotesque and Space Mono (Counter), and Noto Serif Display and Schibsted Grotesk (Dispatch), alongside the Oswald wordmark. All are OFL, verified to have ₹ and ×, and would be committed with OFL.txt.
- Downloads: approve fetching the 6 font TTFs from github.com/google/fonts and the three Kenney zips (Interface Sounds, Casino Audio, RPG Audio; CC0; a few MB). Optionally approve @remotion/install-whisper-cpp plus the base.en model (about 150 MB) for exact word timings.
- Plates: approve regenerating gd01 and cw01 plates with MiniMax image-01 at 1152x2048 (small API cost). The current gd01 cover shows a deity-like pendant that becomes legible at glyph scale. Who signs off plate_qa: AK, or the agent with AK spot-checks?
- Remotion License: confirm Data Kadai is an individual or a team of 3 or fewer, so @remotion/effects (bake only) stays free.
- Build order and first stories: start with Slab (cheapest, prototype exists), then Counter, then Dispatch? Should the gd01 and cw01 reference renders be released as re-cuts, or used for review only?
- Optional map-look fix: the map look's ₹ is a fallback glyph (Oswald-700.woff2 is the latin-only subset), and its 'Inter' renders as Helvetica Neue. A one-line latin-ext @font-face would fix the ₹ but touches BeatStory. Do it, or leave the map look strictly as is?
- Encoding: approve VideoToolbox H.264 at 10 Mbps (no crf) for look Shorts, about 42 MB per 33 s, while map Shorts stay on x264 crf 18?
