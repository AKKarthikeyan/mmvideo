# mm-asianpaints-dealers: DIRECTOR_LOG

Decisions and why, newest first. Director = role 5 (contract `agents/contracts/05_director.md`). Facts and claim IDs are
never changed here.

## 23 Nov 2026: Builder fix round 2 (M1 finished)

b5: a blur patch (backdrop blur about half a line high, over a light page tint) now covers "over 50,000" on Grasim pp. 20-21
until "fifty" is spoken (19.60 s, measured), then it clears in 0.12 s while the highlight runs over the words (0.6 s).
Nothing else changed. Stills `out/productions/mm-asianpaints-dealers/stills_fix2/` 17.2 s (page still under the dot
field), 19.0 s (number unreadable) and 19.8 s (sharp, being highlighted) checked. shorts_check 0 FAIL, hf.py check 0 errors,
-14.1 LUFS, TP -1.5 dBFS. Same final path.

## 23 Nov 2026: Builder fix round 1 (REVIEW.md M1 + small should-fixes); voice unchanged

Word starts measured on voice.wav (mlx-whisper turbo, word timestamps): "ten" 11.34 s, "under" 12.34 s, "over" 19.28 s,
"fifty" 19.62 s. The char-proportional estimate was about 0.5 s early, so these cues are set from the measurement
(`CUES` in build_film.py, written into story.js; valid for the current clips only).
- **M1 b3:** caption split: "ALMOST ALL TO DEALERS" from 7.12 s, "THE TEN BIGGEST" from 11.32 s (was 7.12 s). Callout
  "TOP 10 DEALERS: UNDER ₹1 IN ₹100" from 12.36 s, on "under" (was about 11.4 s).
- **M1 b5:** caption "BIRLA OPUS · GRASIM SAYS" from 17.02 s, "50,000+ DEALERS · GRASIM SAYS" from 19.60 s (was 17.02 s);
  the highlight on "over 50,000" starts on "over" at 19.30 s (was 17.7 s). **Left open:** the unhighlighted page line
  "over 50,000 dealers" is still sharp from 17.1 s (the crop keeps it); fixing that means re-cutting the crop
  (make_crops.py), which is not a timing fix: director/AK.
- **S3 (part):** the lower caption no longer doubles the callout's number; the crop push-in is not done (new framing).
- **S2:** dark caption plate behind the band while a white court page is behind it (b6 to b8 start), so "IN A" and
  "ONLY" read.
- **S6:** p.39 now fades in under the outgoing court page (from t8 -0.25 s): no dark frame at the b7 -> b8 cut. The
  Informant tag now leaves 0.2 s earlier.
- **Not done (not small timing/position fixes):** S4/S5 defocus of unhighlighted page text, S7 whip pull-out (and the
  0.1 s tail would push the cut past 45 s; the last word ends 0.02 s before the file ends, the clip keeps 45 ms of tail),
  S8 on-screen gloss for "tinting machine", S9 ledger field, S1 "prize" (AK's ear; no re-voice by instruction).
Checks after the round: shorts_check 0 FAIL (WARN S3, S6, S7 as before); hf.py check 0 errors (one contrast warning at
32.48 s on a fading tag's small text); -14.1 LUFS, TP -1.5 dBFS; stills `out/productions/mm-asianpaints-dealers/stills_fix1/`
(8.0, 11.25, 11.45, 12.25, 12.5, 18.0, 19.5, 19.75, 25.0, 29.0, 32.16 s) and `contact_sheet_fix1.png`: no number in a
caption before its word.

## 22 Nov 2026, about 22:50 IST: Builder (role 6), voiced build handed over (Claude Code over `ssh mini-ts`, Mac Mini)

AK: "Do it Now" (outside the 06:45-22:10 MiniMax window). MiniMax answered on the first try; no retries, no other provider.
Narration, facts and shot order unchanged. Source: `hyperframes/shorts/mm-asianpaints-dealers/build_film.py` (voice from
script.json `say` with English_Diligent_Man through `shorts_build.py`'s own tts/pcm, keeps each beat's pause), `pauses.json`.

**Timing changes (small, logged per the director's note):**
- Voiced with script.json pauses the cut was **47.97 s**. Trimmed b3's pause first (0.5 -> 0.10 s), then every other
  non-silence pause (b1, b2, b5, b7, b8, b9) to 0.10 s and b10 (the loop line) to 0 s so it runs straight into b1.
  **The two silences are untouched: b4 0.7 s, b6 1.0 s.** Result **44.97 s**. b3's visual not cut.
- b10 voiced four times: whisper heard the first take as "still the price"; take 2 is the only one a model heard as
  "prize" (large-v3: prize 0.81; turbo still says price). Take 2 used. **AK to ear-check "prize" in b10.**
- Labels moved to land no later than the text they label: GRASIM SAYS now fades in with the b2 clipping (t2+0.2), the b5
  pages (t5) and the b9 Outlook (t9); OUR READING with the dot field (t4+0.1) and the b10 page (t10); the court page's
  para 30(iii) focus pull now starts with the ALLEGATION stamp at "alleged" -0.05 s (was 0.3 s before the stamp, so the
  allegation was half-legible unlabelled). "'The counter' = our word" label from t10+0.25 (was +0.5; hf check line_unread).

**Sound (TREATMENT section 8):** code-made pulse bed (ours, no licence) in cues: low b1-b4, out for silence 1
(16.38-17.08 s), rising b5-b6, out for silence 2 (26.47-27.47 s), one low hit with the stamp (27.9 s), near-none under b8,
low again from b9 into the loop. Room tone = code-made filtered noise. Effects, all CC0 (src/voxplus/LICENSES.md,
Freesound): sfx_underline_stroke_zembacraftworks.wav (highlighter, b1/b3/b5/b7/b9/b10), sfx_paper_slide_kingofgamers.wav
(b2 slap, b5 slide, b8 page turn), sfx_thump_stamp_mpuffenbarger.wav (b7 stamp), sfx_whoosh_deep_kinoton.wav (b3),
sfx_pop_conarb13.wav (b4 dots, very low). Not built: the b10 whip sound, because index.html has no whip pull-out (b10
fades to the counter-share page; the loop seam is a cut to frame 0). Nobody has listened to any of it (ssh session).
Loudness: gentle compressor + two-pass loudnorm -> **-14.1 LUFS, true peak -1.5 dBFS**.

**Checks:** `hf.py check` 0 errors (8 craft warnings: 22 px disclaimer, some source lines under their read floor,
two 3.1-3.3 s still stretches in b7/b8 which are the planned holds). `shorts_check.py --file check.json`: 0 FAIL; WARN S3
(ends "which is why": the gate's connector list lacks "why"), S6 (3.7 s hold in b3), S7 (first sentence ends 3.2 s).
32 stills (`out/productions/mm-asianpaints-dealers/stills/`, contact sheet beside the render): no empty frame; no
unspoken or DISPUTED figure legible (99.0 %, 0.9 %, 72,873, 11,500, 146, the 42 % badge all out of frame or defocused);
nothing but blurred page paper in the bottom 12 % (b6 wipe and the b7 court close-up run to the bottom edge: document
pixels only, illegible). Reviewer: "ONLY" in the b7 caption is white on the white court page, weak.

## 22 Nov 2026, 22:34 IST: AK approved the key-frame board with two fixes; narration LOCKED

**AK's words (relayed by the coordinator, 22 Nov 2026):** "Approve with fixes". Time of AK's approval not given; logged
here at 22:34 IST. **AK did not answer the three review questions** (bored? confused? does the reveal land?); they stay
unanswered and the treatment is not changed on their account.

**Fix 1, b3 (done):** the caption "TOP 10: 0.9%" is gone (no figure is spoken in b3); the board caption now reads "THE
TEN BIGGEST" (spoken words) and the callout "TOP 10 DEALERS: UNDER ₹1 IN ₹100" stays. On the BRSR crop every figure,
99.0 % and 0.9 % included, is now defocused; only the two row labels and "FY 2025-26" are sharp, and the marker ring is
removed. Same rule carried to b4: the dot-field legend no longer shows "0.9%" or "1 dot = 0.1%" ("dark dots = the top 10
dealers' share", "ILLUSTRATIVE · light dots = every other dealer").
**Fix 2, b5 (done):** the dealer count is now shown from C012's own passage, Grasim pp. 20-21 (PDF p.12): "Birla Opus
expanded its distribution network to over 50,000 dealers" sharp, "11,500 towns" and "146 depots" defocused. p. 57 keeps
only C013's line ("with dealers armed with new-age compact tinting machines"), which the match cut needs; its "50,000
dealers" line is no longer shown. Source line: "... top: pp. 20-21 · below: p. 57". (For the record: claims.jsonl also
lists p.57's "market presence of 50,000 dealers" as a second evidence for C012; not used, per AK's first choice.)
Re-checked by eye: b3, b4, b5, the match cut and the rebuilt board. Stills, style frames, `out/productions/mm-asianpaints-dealers/keyframes/board.png` and
`board.pdf` rebuilt (board v2).

**Narration locked** as SCRIPT.md / script.json stand now (W1, W2, T1 applied). For the script writer, not a wording
change: script.json b3 `caption` still says "Top 10: 0.9%"; the build uses "The ten biggest" (AK fix 1). Next: voicing
(MiniMax window from 06:45 IST), then voiced timings replace the estimates in story.js.

## 22 Nov 2026, late: style frames and key-frame board v1 (Claude Code over `ssh mini-ts`, Mac Mini)

AK tonight: go ahead with the build; document pictures cleared by COMMON.md section 11 with my crop rules; highlighter
yellow as the **working** accent, labelled "proposed, AK to confirm". No voice (MiniMax window closed after 22:10 IST), no
render, nothing published, nothing committed.

**Made (sources text only, images under `out/`, not in git):**
- Film folder `hyperframes/shorts/mm-asianpaints-dealers/`: `index.html` (the page, built on `shared/lib/shorts.js` like
  the benchmark Shorts), `story.js` (ESTIMATED timings from TREATMENT section 6, `voiced: false`), `make_crops.py`,
  `make_story.py`, `make_board.py`. `assets/img` is a symlink to `out/productions/mm-asianpaints-dealers/crops/` so the company pages stay out of git.
- 12 page crops (`out/productions/mm-asianpaints-dealers/crops/`, PyMuPDF at 4-12x zoom): every word not in the crop's `keep` list is defocused (blur about
  one line high, pulled 30 % toward the page colour). Checked by eye at full size: 72,873, 11,500, 146, 6,000, 10,000 crore,
  FY 2026-27, the court footer dates and the other allegations (i), (ii), (iv)-(vi) cannot be read.
- Stills with `hf.py snap` at 0.04, 3.0, 6.4, 12.6, 16.4, 21.6, 22.45, 25.2, 30, 35, 39.8, 43.4 s.
- Style frames `out/productions/mm-asianpaints-dealers/style/`: `style_1_frame0_hook.png`, `style_2_matchcut.png`, `style_3_court_reveal.png`.
- Board `out/productions/mm-asianpaints-dealers/keyframes/`: 12 PNGs (frame 0, b1-b10, plus the match cut), `board.png` (two columns, line and claim IDs
  under each) and `board.pdf` (cover with the three questions, then one still per page, for a phone).

**Decisions:**
1. **b6 changed from the treatment (shot 6), for the allegation rule:** during b6 only the matched words "the tinting
   machines", the case header and "29/40" are sharp; para 30(iii) is defocused until b7, when a rack focus to the same page
   brings it in on "alleged" with the ALLEGATION stamp. Why: as written, the allegation would have been readable for about
   4 s with no ALLEGATION label. Same page, same crop box, so the move is a focus pull, not a cut. TREATMENT.md to be
   updated after AK's review.
2. **Court footer defocused** (upload/download dates and the stenographer's name), against the treatment's "court's
   upload stamp visible": no unspoken figure on screen wins; the source line carries the case number, judgment date and
   page.
3. **Match cut** built as a 0.4 s left-to-right wipe along the stroke: the court page is scaled so "tinting machines" sits
   on Grasim's words at the same height. Style frame 2 is the mid-wipe frame ("the tintin|g machines").
4. **b3 callout** "TOP 10 DEALERS: UNDER ₹1 IN ₹100" (the spoken comparison) instead of a second "0.9%", which the
   caption already shows. BRSR crop narrowed to the Metrics and FY 2025-26 columns (x 140-496 pt).
5. **b8** quote card attribution: "Bombay High Court, para 39, quoting the Supreme Court on CCI probe orders (CCI v.
   Bharti Airtel)"; tag "CCI = Competition Commission of India, the competition regulator". The ALLEGATION stamp moves to
   the page corner and stays to the end of b8 (treatment).
6. **b10** label "'The counter' = our word, from Asian Paints' 'counter share'" beside OUR READING.
7. **Safe area used:** the stricter of the two (shorts.css): no overlay text below y 1536 or, below the middle, right of
   x 950; nothing above y 96. Captions sit in y 1296-1486. Only document pixels (blurred) run past these lines.

**Risks seen (for AK and the reviewer):**
- **99.0 % is legible on b3** (row a, highlighted) while the voice says "almost all". It is C002's own figure, but not
  spoken as a number. Either say "ninety-nine percent" (script writer) or defocus the cell (builder). AK's call.
- **b5 shows Grasim p.57 "50,000 dealers"** while the voice says "over fifty thousand", whose quote and locator (C012)
  are on p.20-21 ("over 50,000 dealers ... 11,500 towns ... 146 depots"). Same number, but the picture is C013's page.
  Fix options: caption already says "50,000+"; or show the p.20-21 line instead (it carries unspoken 11,500 and 146 to
  defocus).
- **b8:** "merely a prima facie opinion" is the Supreme Court's wording, quoted by the High Court (C031). The voice says
  "the court notes"; the card says who said it.
- **b7:** the page header "WP-2887-2025-J.doc" runs off the right edge at this zoom (document, not overlay).

**Three questions for AK's review** (on the board's cover):
1. Bored? b3 (table) and b4 (dots) spend about 10 s on Asian Paints' own numbers before the rival arrives. Do they hold
   you, or should b3 be trimmed?
2. Confused? On b8, is it clear that "merely a prima facie opinion" describes the regulator's probe order (the court
   quoting the Supreme Court), not Grasim's allegation?
3. Does the reveal land? Does the match cut make you lean in before the ALLEGATION stamp at b7, or does b6's blurred court
   page feel like a stall?

Narration still NOT locked: waits for AK's answers on the board, then a voiced timing pass.

## 22 Nov 2026: treatment v1 (dry run, treatment only; Claude Code over `ssh mini-ts`, files on the Mac Mini)

**Requests to the script writer (wording and timing only; SCRIPT.md not touched; also in STATUS "Blocked"):**
- **W1, b6:** "But that machine has ended up in a court judgment." → "But that machine turned up in a court judgment."
  Why: one word shorter, lands harder on the signature match cut, and matches the script's own send line. Claims C027,
  C028 unchanged.
- **W2, b8:** "The regulator's probe order, the court notes, is merely a prima facie opinion." → "The competition
  regulator's probe order, the court notes, is merely a prima facie opinion." Why: first-time-viewer check; "the
  regulator" has not been introduced, and after b6 a viewer may think the court ordered the probe. Quote stays word for
  word; C030, C031 unchanged. I did not ask for "has only ordered a probe": that would state the case's current stage,
  which no source gives after 11 Sep 2025.
- **T1, pauses in script.json:** b4 0.5 → 0.7 s (silence 1, the turn from incumbent to challenger) and b6 0.6 → 1.0 s
  (silence 2, the hold just before the reveal). Why: DIRECTOR.md §6 needs two planned silences, the last one just before
  the reveal. Net effect with W1/W2: about +0.6 s, estimate about 44.2 s. If the voiced cut passes 45 s, trim b3 first
  (the script's own note), not the silences.

**Decisions:**
1. **Kit: HyperFrames, not Vox+.** Vox+ is 1920 × 1080 Remotion with no vertical Shorts path; HyperFrames has the Reveal
   Loop pipeline (`shorts_build.py`, phrase-timed pages, gate, mux) used by all benchmark Shorts.
2. **Look: "The evidence desk"** (paper theme, real pages under one lamp, yellow highlighter; red only for the court).
   Why: our only real visual material is documents (dossier, Visual material), and the series promise is "a catch in the
   filing". One look, three samples restyled to it (s03 desk, s13 quote, s05 dots).
3. **Accent proposed, not chosen:** highlighter yellow. No Moat & Margin accent exists although SHORTS_FORMAT §4 wants
   one per channel. AK's call.
4. **Benchmark:** `ma-tsmc` for structure (read, not watched: render not on the Mac Mini, and this session cannot play
   video), plus NYT Visual Investigations and Fong's black-hole video as read about in DIRECTION_RESEARCH. Not a
   non-our-own film watched in full, as DIRECTOR.md asks (dry-run note).
5. **Telling: "follow the dealer" (mechanism first)**, with the object story folded in through the b5 → b6 match cut.
   Rejected "machine first" (no real machine picture; frame 1 would be a drawing) and "court line first" (spends the
   reveal at frame 0; an allegation as the opener reads as an accusation).
6. **Signature shot: the word match cut** from Grasim's "compact tinting machines" (S02 p.30) to the court's "the
   tinting machines supplied by the Informant" (S03 p.29, para 30(iii)), one unbroken highlighter stroke. Reveal at b7,
   about 59–70 % through.
7. **b10's "counter"** is shown on Asian Paints' own "counter share" pull-quote (S01 p.14, C006, already a b10 claim)
   instead of a drawn shop counter: the metaphor is grounded in the company's phrase and needs no illustration.
8. **Crops that carry the fact rules (builder must not change):** Grasim p.31 cropped to the Outlook box's right column,
   because the same spread shows the DISPUTED 42 % contractors badge (C023) and a Dealers Meet photo; BRSR row b
   (72,873 / 75,793) defocused, because the dealer-count fall is dropped on purpose (K1, K4) and DIRECTOR §7 allows a
   number on screen only when spoken; no CCI order date anywhere (C027); GRASIM SAYS on every Birla Opus figure;
   ALLEGATION stamp on the court page through b8; logos and portraits cropped out.
9. **Script's b8 → b9 link** is played as a "but" (the court decided nothing; the rival's report answers), not the
   "therefore" written in the script. No wording change needed; noted for the script writer.
10. **Sound:** four code-made music cues (low, rising, peak, low), two silences (after b4 and after b6, the last just before the reveal), one peak on the ALLEGATION stamp,
    two sound-across-cut moments, Vox+ CC0 effects. Within DIRECTOR.md §6 for a Short.
11. **Packaging:** both of the script's titles pass `package_check.py` (not logged). Noted for AK that title B's promise
    ("ended up in court") is paid only at 22–31 s.
12. **Not done tonight (by instruction):** style frames, animatic, voice. The animatic needs the Mac Mini render and AK's
    review; narration is **not** locked.

**For AK before any build:** clearance to show close-ups of the two companies' annual reports (dossier says "check with
AK"); the whole Short is built from them.
