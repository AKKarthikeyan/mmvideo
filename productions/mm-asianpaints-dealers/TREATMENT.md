# mm-asianpaints-dealers: TREATMENT (v1, 22 Nov 2026)

**Director (role 5), treatment only.** No style frames, no animatic, no render, no voice yet (dry run). Built on SCRIPT.md
DRAFT v1 (F1 Myth Flip, series The Catch, about 44 s, 10 beats). Facts and claim IDs are the script's and do not change
here; three wording/timing requests to the script writer are in `DIRECTOR_LOG.md` and STATUS "Blocked". Beat times below
are estimates (3.1 spoken words a second plus the script's pauses, with the requested changes); the real voice resets them.

**Kit: HyperFrames, Reveal Loop Shorts pipeline** (`hyperframes/shorts/`, `tools/shorts_build.py`, `shared/shorts.css`,
1080 × 1920). Vox+ is a 1920 × 1080 Remotion kit with no vertical Shorts path; HyperFrames has the build, voice timing
(`A("b4", "phrase")`), gate and mux steps already proven on three benchmark Shorts.
**Look: "The evidence desk".** HyperFrames `paper` theme (Moat & Margin tan). Every picture is a real page lying on one
desk under one lamp (ingredient: `samples/s03-desk`, restyled to vertical): lit page, push-in, yellow highlighter. One
quote card in big type with the original line below (`samples/s13-quote`). One dot field (`samples/s05-dots`) redrawn in
ink on the same paper. Red is reserved for the court: the red marker underline and the ALLEGATION stamp appear only on
the judgment. Type: Oswald captions, Plex mono source line, Playfair for the one quote card. Grain and a slow lamp drift
are always on. **Accent (proposal, AK decides):** highlighter yellow as Moat & Margin's Shorts accent, used as a yellow
box behind the key caption word, because the highlighter is the film's camera language; no M&M accent is defined yet.

On screen throughout, top band (clear of the bottom 20 % and right 12 %): "Educational research, not investment advice ·
not SEBI-registered" (SHORTS_RULES O5), and the source line of the current page in Plex mono.

---

## 1. Logline

Asian Paints says its dealer network is one of its strongest advantages; a rival that says it built 50,000 dealers with
its own tinting machines has taken the fight for the shop counter all the way into a court record, as an allegation, and
even the rival's own report says the counter is what a challenger must win.

## 2. Benchmark

| Benchmark | How we know it | What we take | What we don't |
| --- | --- | --- | --- |
| **`ma-tsmc`** (Moat Atlas, "This was empty Arizona desert in 2020", 35.1 s; `docs/SHORTS_BENCHMARKS.md`, `hyperframes/shorts/ma-tsmc/`) | Read the script, source table and page code. **Not watched:** its render is not in `out/hyperframes/` on the Mac Mini, and this session cannot play video | The Reveal Loop spine; a spoken "But here's the catch" turn at about two-thirds; one source line at the top that changes with the picture; the last frame equals the first so the replay is seamless; captions of 2–4 words in the lower-middle band | Its satellite look, night palette and orange accent; its globe; its female US voice |
| **NYT Visual Investigations** and **Joss Fong's black-hole video** (Vox), as described in `docs/DIRECTION_RESEARCH.md` §1 | Read about only (allowed by contract 05) | NYT: the evidence and the method are the picture; the document page is the proof on screen. Fong: hold the payoff back until the viewer understands why it matters; music starts and stops as attention cues | Their length, their footage, their music |

Our own benchmark is a rule break: DIRECTOR.md §3.2 asks for a benchmark that is "not our own", but SHORTS_FORMAT says to
start a Short by copying our nearest benchmark, and none exists for Moat & Margin (dry-run note).

## 3. Three ways to tell it

1. **Follow the dealer (mechanism first).** The incumbent's claim → how it sells (0.9 % to the top ten, so it is won shop
   by shop) → the rival builds its own dealers and machines → the machine turns up in a court record → the rival's own
   report says the counter is the prize. Uses every spine claim in order; each step is a page on the desk.
2. **The machine's journey (object first).** Open on the tinting machine everyone has stood next to; the rival shrank it
   to free the dealer's floor space [C014]; then it turns up in court. Most "Familiar" opener. **Lost:** there is no real
   picture of a tinting machine in any source (dossier, Visual material), so frame 1 would be a drawing labelled
   illustrative, and the hook would be about a machine, not the moat question the series promises.
3. **The court line first (mystery, told backwards).** Open on para 30(iii) of the judgment, then rewind to why.
   Strongest single frame (the packaging checklist's "frame 0 shows the most surprising picture"). **Lost:** it spends the
   reveal in the first second (STORY_ENGINE T9, DIRECTOR.md §5), and an allegation as the opening frame reads like an
   accusation before the guard rail can arrive (C031, SHORTS_RULES O6).

**Chosen: 1, carrying the best idea of 2.** The tinting machine is planted on the rival's page at b5 and paid off on the
court page at b6 by a match cut on the same two words, so the object story lives inside the mechanism story. It keeps the
reveal at about 60–70 % and keeps every allegation one beat away from its guard rail.

## 4. Visual anchors (one per act, all real documents unless labelled)

| Act (beats) | Anchor | Real source, page | Comes back |
| --- | --- | --- | --- |
| **A. The claim** (b1–b4) | Asian Paints' own sentence, highlighted: "The overall network strength remains one of our strongest competitive advantages." | S01 IAR 2025-26, MD & CEO's message, PDF p.17 (printed pp. 30–31) [C004]. The sentence breaks across two columns ("…one of our" / "strongest competitive advantages."): use a two-crop composite set as one strip, joined by the highlighter stroke, labelled with the page | At the loop (b10 → b1): the film ends on this exact frame |
| | Support: Grasim's line "The business continues to invest aggressively behind consumer awareness and channel engagement." as a torn clipping (b2) | S02 PDF p.12 (printed pp. 20–21) [C024], labelled GRASIM SAYS | — |
| | Support: the BRSR "Concentration of Sales" table, row a (99.0 %) and row c (0.9 %) | S01 PDF p.164 (printed p.324), BRSR Principle 9 [C002]. Crop to the FY 2025-26 column; row b (72,873 dealers/distributors) is defocused so no unspoken figure is legible (C001/C033 dropped on purpose, conflicts K1, K4) | The 0.9 % becomes the dot field (b4) |
| **B. The challenger** (b5) | Grasim's "Distribution: Painting a Pan-India Canvas" column, highlighted on "50,000 dealers" and "new-age compact tinting machines" | S02 Grasim IAR 2025-26, PDF p.30 (printed p.57) [C012, C013]. Crop below the Birla Opus logo artwork (no logos, packaging checklist 16) | The highlighted words "tinting machines" carry into Act C (match cut) |
| **C. The court** (b6–b8) | The judgment page, para 30(iii): "Directing its dealers to return/ not use or not install the tinting machines supplied by the Informant;" | S03 Bombay High Court, WP 2887/2025, PDF p.29 (page 29/40) [C028]; p.39 para 39 for "merely a prima facie opinion" [C031] and para 40 [C030]. Public court record; court's own upload stamp visible in the footer | The red ALLEGATION stamp stays on the page corner through b8 |
| **D. The echo** (b9–b10) | Grasim's Outlook box: "…a challenger with brand strength, capacity, and distribution depth…" | S02 PDF p.31 (printed p.59) [C025]. **Crop to the Outlook box's right column only:** the same spread holds the Key Performance Charts with the DISPUTED 42 % badge (C023) and a Dealers Meet photo (licence not cleared); neither may appear, even in a pull-back | — |
| | Asian Paints' "counter share" pull-quote: "systematically enhance our counter share across all geographies" | S01 PDF p.14, Chairman's letter, large blue pull-quote [C006]. Crop out the Chairman's portrait and the control-room photo | Whip pull-out lands on Act A's frame |

**Missing (say so, don't fake it):** no photo or footage of a tinting machine, dealer, shop counter or depot; no machine
counts for either company; no map of dealer density; the CCI's own order (only the court's account of it); no
company-cleared images. Nothing in this film is drawn except the dot field, which is labelled **ILLUSTRATIVE · 1 dot =
0.1 % of sales to dealers**. If AK wants a counter or machine, it is a drawing labelled "illustrative" and the voice never
describes a drawn detail as fact.

## 5. The reveal and the signature shot

- **Reveal: b7, about 26–31 s of about 44.2 s (59–70 %).** Held back until then: that the rival's machine is named in a
  court record, and what the allegation says. b5 shows the machine only as Grasim's sales claim, so the viewer files it as
  a product detail.
- **Signature shot (the only one): the word match cut, b5 → b6.** The highlighter has just finished on "compact tinting
  machines" on Grasim's glossy page. On the spoken "But", the page under the stroke swaps to the court's typed page, with
  the court's own words "the tinting machines" sitting exactly where Grasim's were and the yellow stroke unbroken. Then a
  slow pull-back shows whose page it is (case header, "29/40", the court's upload stamp), a 1.0 s silence (silence 2, the last before the reveal), and a push into
  item (iii) as the red underline draws and the ALLEGATION stamp lands on the musical peak. Same two words, two
  documents: sales brochure to court record, without a word of explanation.

## 6. Beat sheet

Emotion words from STORY_ENGINE T8's palette (wonder, worry, relief, delight, pride) plus plain ones where they fit better.

| Beat | Time (est.) | Said (short) | Seen (anchor's state) | Emotion | Link to next |
| --- | --- | --- | --- | --- | --- |
| b1 | 0.0–3.7 | AP calls its network one of its strongest advantages | AP p.17 strip, highlighter mid-stroke on frame 0; hook STILL A MOAT? | confidence (theirs) | **BUT** a rival is spending |
| b2 | 3.7–7.4 | Still a moat? A new rival says it invests aggressively | Same page; a torn clipping of Grasim's line drops over its lower half | curiosity | **THEREFORE** to judge it, look at how AP sells |
| b3 | 7.4–14.0 | Almost all sales to dealers; top ten under ₹1 in ₹100 | BRSR table: row a highlighted, then row c circled (0.9 %) | wonder (it's that spread out) | **THEREFORE** |
| b4 | 14.0–17.3 | So rivals must win them shop by shop | 0.9 % pulls out into 1,000 ink dots, 9 dark, the rest scattered; OUR READING · ILLUSTRATIVE; **silence 1** at its end | understanding | **THEREFORE** that's what the rival did |
| b5 | 17.3–22.3 | Grasim says Birla Opus has 50,000+ dealers, with compact tinting machines | Grasim p.30 slides over; highlight "50,000 dealers", then "compact tinting machines"; GRASIM SAYS | worry (for the incumbent) | **BUT** that machine is now in a court record |
| b6 | 22.3–26.2 | But that machine turned up in a court judgment | Match cut: same words, court page; pull back to case header; **silence 2** | surprise | **THEREFORE** what was alleged? |
| b7 | 26.2–31.0 | Grasim alleged AP directed dealers to return it, or not install it | Push into 30(iii); red underline; ALLEGATION stamp; "Informant = Grasim" tag | shock, held in check | **BUT** an allegation is not a finding |
| b8 | 31.0–36.0 | The competition regulator's probe order is merely a prima facie opinion, the court notes | Page turn to p.39; quote card "merely a prima facie opinion" over the original line; long hold, bed almost gone | caution (relief for the careful viewer) | **BUT** the court decided nothing, so who says what wins? |
| b9 | 36.0–40.7 | Still a moat? Even Grasim's report says challengers with distribution depth gain most | Grasim Outlook crop; highlight runs along "brand strength, capacity, and distribution depth" | recognition | **THEREFORE** |
| b10 | 40.7–44.2 | So the counter is still the prize. Which is why | AP "counter share" pull-quote; OUR READING; whip pull-out lands on b1's frame | resolution, loop | **THEREFORE** runs into b1 |

The script's b8 → b9 link reads "THEREFORE: so what decides it?". It is really a **but** (the court decided nothing, but
the rival's own report answers the question), and the cut should be played as a turn: the bed is almost gone under b8, then the opening pulse returns with the question.

## 7. Shot list

All shots are top-down on the one desk; the camera is a slow overhead rig. Moves used: pan, pull, push, rack focus, match
cut, hold, page turn, whip (seven kinds); never two push-ins in a row. Speed-up: b3–b5 (four picture changes in about
11 s). Slow-down: silence 2 after b6 and the b8 hold.

| Shot | Beat | Framing | Move | Dur. | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | b1 | Close insert: AP p.17 two-column strip, the sentence filling about 80 % of the width | Slow pan right following the highlighter across the column break; already moving on frame 0 | 3.7 s | Frame 1 is the subject: the company's own words are the claim the Short tests, and the stroke makes the viewer read the exact phrase that returns at the loop |
| 2 | b2 | Medium: the same page, clipping of Grasim p.12 line drops over the lower half | Small pull back; clipping drops with a paper slap | 3.7 s | The rival literally lands on the incumbent's claim; a new element on the spoken word keeps H4 without leaving the anchor; the page stays up about 7.4 s, enough for its 82-character sentence (DIRECTOR §5: 1.5 s + 1 s per 15 characters = about 7 s) |
| 3 | b3 | Close: BRSR table, FY 2025-26 column; row b defocused | Whip down the desk to the table, then rack focus row a → row c, marker circle on 0.9 % | 6.6 s | Show the method: the 0.9 % is a line in a Deloitte-assured table, not our estimate; the rack focus keeps 72,873 unreadable because it is not spoken |
| 4 | b4 | Wide: 1,000 ink dots fill the frame, 9 dark | Pull out from the circled 0.9 % into the field (zoom-into-a-number transition, reversed); hold 0.7 s in silence 1 | 3.3 s | Makes "shop by shop" visible: no handful of big dealers to buy; labelled our reading and illustrative |
| 5 | b5 | Medium to close: Grasim p.30 Distribution column | Paper slides over the dots; push in to "compact tinting machines" | 5.0 s | Plants the machine as Grasim's own sales claim, with GRASIM SAYS on screen, so the court page can pay it off |
| 6 | b6 | Close, then medium: court p.29 | **Match cut** on the highlighted words, then slow pull back to the header; hold in silence 2, 1.0 s | 3.9 s | The signature: one stroke, two documents; the pull-back answers "whose page is this?" before the voice does |
| 7 | b7 | Extreme close: para 30(iii) filling the width | Push in; red underline on "return/ not use or not install"; stamp | 4.8 s | The reveal is the court's exact words, big enough to read on a phone; the stamp says ALLEGATION in the same instant the voice says "alleged" |
| 8 | b8 | Medium: p.39 para 39, then the quote card in Playfair above the original line | Page turn; then **hold** (no camera move, lamp drift and grain only) | 5.0 s | The guard rail gets the film's longest still moment so it is felt, not rushed; the viewer breathes before the question returns |
| 9 | b9 | Close: Grasim Outlook box, right column only | Slow pan along the highlighted line, "distribution depth" boxed in the accent | 4.7 s | The rival's own report answers the series question; all three items shown because the voice names one (C025 note) |
| 10 | b10 | Close, then the b1 frame | AP "counter share" pull-quote; whip pull-out that lands exactly on shot 1's first frame | 3.5 s | Grounds the "counter" metaphor in the company's own phrase, then closes the picture loop so the replay is seamless |

**Builder must not change:** the crops that exclude C023's 42 % badge, the Dealers Meet photo, the Chairman's portrait,
the Birla Opus logo and row b of the BRSR table; GRASIM SAYS on every Birla Opus figure; ALLEGATION on the court page
through b8; OUR READING on b4 and b10; ILLUSTRATIVE on the dot field; no date for the CCI order on screen; no contractor
figure or growth rate anywhere.

## 8. Sound plan

Music: a code-made bed in four cues (as the benchmark Shorts' "quiet code-made pad", but cut by section), at or below
the Vox+ `MusicBed` duck level under the voice; licence line in a film `LICENSES.md`. Effects: the Vox+ CC0 set
(`src/voxplus/LICENSES.md`: paper, highlighter, circle, stamp, whoosh). Room tone: a soft desk-and-lamp air under every
shot.

| Section | Ambience | Effects tied to actions | Music state |
| --- | --- | --- | --- |
| A (b1–b4) | Desk room tone | Highlighter (b1), paper slap (b2), whoosh + marker circle (b3), dot ticks (b4, very low) | **Low**: a light, steady pulse; cuts on its beat. **Out** after "shop by shop": **silence 1, 0.7 s** (room tone only), the turn from the incumbent to the challenger |
| B (b5) | Same | Paper slide (lands on the end of silence 1), highlighter | **Rising**: a new cue, the pulse thickens under "tinting machines" |
| C1 (b6) | Room tone thins | The highlighter stroke's sound carries over the match cut (sound across a cut, 1 of 2) | **Out** after "court judgment": **silence 2, 1.0 s** (voice-free, room tone only), the last silence, just before the reveal (DIRECTOR §6) |
| C2 (b7) | — | Red marker, then the stamp | **Peak**: one low hit with the stamp, decaying under the voice |
| C3 (b8) | Room tone | Page turn | **Near-none** under the guard rail (sober; no effect except the page turn) |
| D (b9–b10) | Desk room tone | Highlighter; whip on the pull-out | **Low** again, the opening pulse returns so the loop seam matches; the pulse's first bar starts under b10 and continues into b1 (sound across a cut, 2 of 2) |

Mix: about −14 LUFS, voice always on top; check every row above is audible. Under 60 s, so no Content ID risk from our own
bed (H1).

## 9. Packaging

- **Title options (AK picks):** A "Asian Paints' strongest edge has a catch" (40 chars, series template) · B "A paint shop
  machine ended up in court" (38 chars). Both pass `package_check.py --channel moat --format short` (0 fail, 0 warn,
  22 Nov, not logged). Hook type: `claim-check`. Director's note: B pays off at b6–b7, 22–31 s in, which breaks the
  "pay the promise in the first 2 s" rule (STORY_ENGINE T16) unless frame 0 shows the machine; A is paid at frame 0 by the
  highlighted "strongest" line. Neither title says "moat"; that word lives in the hook overlay (double barrel).
- **Cover (Shorts frame picker):** frame 0, the highlighted "one of our strongest competitive advantages" strip with
  STILL A MOAT?. Not the court page: as a cover it would read as a verdict.
- **Shot in the opening that pays it off:** shot 1, frame 0.
- **Send line (script):** everyone has stood at that machine, and nobody knows it turned up in a court case.

## 10. Re-engagement points

A 44 s Short has no 3- and 6-minute marks. Their job is done by: the question spoken at about 3.7 s (b2), the turn
"But…" at about 22 s (b6), and the question echoed as the opening pulse returns at about 36 s (b9), each on a fresh picture.

---

## Director's self-check

- **Retell from the anchors, sound off?** Yes: the company's highlighted boast → the rival's clipping lands on it → the
  0.9 % becomes a field of dots → the rival's page lights "tinting machines" → the same words on a court page, stamped
  ALLEGATION → "merely a prima facie opinion" → the rival's own "distribution depth" → the company's "counter share" →
  back to the boast. A muted viewer gets the claim, the challenger, the court and the caveat.
- **Every beat linked by but or therefore?** Yes (§6). One fix: b8 → b9 is a "but", played as a turn (bed out under b8, pulse back on "Still a moat?").
- **Exactly one signature shot, reveal held back to it?** Yes: the word match cut (b5 → b6) leading into the reveal at
  b7; nothing about the court appears before 22 s.
- **What would confuse a first-time viewer, and the fix:**
  1. "The regulator" arrives in b8 with no introduction → wording request W2 ("The competition regulator's…") plus the
     caption "CCI · competition regulator".
  2. "Informant" on the court page → a white tag "Informant = Grasim (Birla Paints Division)" beside item (iii).
  3. Grasim vs Birla Opus → b5 already says "Grasim says its Birla Opus"; the source line reads "Grasim Industries (Birla
     Opus)".
  4. The allegation could be read as a finding → the ALLEGATION stamp lands with the word "alleged", and the guard rail
     follows within 5 s; the stamp stays on through b8.
  5. "The counter" (b10) is a metaphor → shown on Asian Paints' own "counter share" line, labelled OUR READING.
  6. Two different dealer counts → never shown together (K4); row b of the BRSR table is out of focus.
- **Open risks:** company report close-ups need AK's clearance (dossier, Visual material); S03 paragraphs to be compared
  with the court's own site before publishing (verify.md); the two lengthened pauses put the estimate at about 44.2 s,
  close to `shorts_check.py`'s 45 s warning (trim b3 first, as the script says).
