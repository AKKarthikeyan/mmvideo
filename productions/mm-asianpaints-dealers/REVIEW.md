# mm-asianpaints-dealers: REVIEW (reviewer, role 7, 23 Nov 2026)

Fresh session on the Mac Mini over `ssh mini-ts`; did not build the film. Judged
`out/productions/mm-asianpaints-dealers/mm-asianpaints-dealers-final.mp4` (45.00 s, 1080x1920, 30 fps, mono 48 kHz)
from: a contact sheet (one frame every 2 s), 0.2 s strips around all nine cuts, the match cut (21.8-24.4 s), the reveal
(26.0-31.4 s) and the loop seam (43.8 s -> 0.2 s); my own mlx-whisper transcript with word timings (large-v3-turbo on the
full mix, large-v3 and turbo on the last line); ffmpeg ebur128; RMS per 0.1 s around the silences. I **cannot watch at
speed or hear**: feeling, rhythm and the mix by ear are left to AK as questions.

**Totals: 1 must fix · 9 should fix · 5 questions for AK.**

## Measured
- Duration 45.00 s (container); voice ends 44.98 s. Integrated **-14.1 LUFS**, true peak **-1.5 dBFS**, LRA 2.4 LU.
- Silence 1: about 16.3-16.95 s at about -42 dBFS RMS (0.65 s). Silence 2: about 26.4-27.3 s at about -48 dBFS (0.9 s).
  Both voice-free, room tone only.
- Transcript (turbo, full mix) matches script.json word for word except numerals ("10", "1 rupee in 100", "50,000") and
  "Grassom" for Grasim (prob 0.32-0.39) and **"price" for "prize"** (see S1/Q1).

## 1. Story
- Links hold: claim (b1) -> rival spending (b2) -> how AP sells (b3-b4) -> rival's dealers and machines (b5) -> **But** court
  (b6-b7) -> guard rail (b8) -> rival's own outlook (b9) -> counter (b10) -> loop to b1. Question "Still a moat?" on screen
  at 0 s and spoken at 3.3 s. Reveal (allegation text + stamp) lands at 27.8 s = 62 %. Ending is a callback/loop, no admin.
- **Q2 (question for AK), 23.3-31.9 s:** "that machine" (b5's *compact* tinting machines, Grasim IAR as of Mar 2026) is
  joined to "the tinting machines supplied by the Informant" in a Dec 2024 representation (C028). The sources do not say
  they are the same model. Fact-checker and director passed it; I read it as a fair shorthand, not an error, but AK should
  OK it. Safer wording if wanted: "But Grasim's tinting machines turned up in a court judgment."

## 2. First-time viewer (from the transcript)
- 4.3 s "A new rival": who? Named only on screen (GRASIM SAYS); voice names Grasim at 17 s. Acceptable.
- 22.2 s "tinting machines": never said what they are (the paint-shop colour mixer). The send line depends on viewers
  recognising it. Should fix S8 below (on-screen gloss).
- 32.1 s "probe order", "prima facie": first mention of a probe; the CCI tag helps. OK.
- 42.1 s "the counter is still the prize": the metaphor is the weakest line, and if heard as "price" it makes no sense or
  suggests pricing (S1).

## 3. Picture
- One look throughout (desk, real pages, yellow highlighter, red only on the court page). Frame 0 already moving.
- Bottom 12 % / bottom 20 %: no overlay or text there in any sampled frame; only blurred page/background art (court page,
  Grasim blue box) reaches the bottom edge, which the builder treated as allowed. Right 12 % below the middle: no text.
- No empty frame at any cut except a brief dip at 32.16 s (S6).
- **S2 (should fix), 27.4-32.1 s:** caption "ALLEGATION **ONLY**": "ONLY" is white outline text on the white court page,
  weak contrast at phone size; it is the qualifier that matters. Same for "IN A" at 23.6-27.3 s. Put both on the caption
  plate (or dark text) when the background is a white page.
- **S3 (should fix), 7.1-14.0 s:** BRSR table crop is a thin strip (about 18 % of frame height); its row labels are tiny at
  phone size and every figure is (correctly) blurred, so the "how we know" moment shows no number. Two captions stack
  ("TOP 10 DEALERS: UNDER ₹1 IN ₹100" over "THE TEN BIGGEST") from about 11.4 s. Fix: push in on the two highlighted row
  labels; drop the duplicate lower caption once the upper one lands.
- **S4 (should fix), hold times (DIRECTOR §5):** Grasim clipping (b2, ~95 chars) is up 3.8 s (rule about 7.8 s); court para
  (iii) (~95 chars) readable 27.8-32.1 s = 4.3 s; AP pull-quote highlight (~60 chars) 42.1-45.0 s = 2.9 s (needs ~5.5 s).
  The voice paraphrases each, so the caption carries it; either accept (Shorts exception, dry-run note) or defocus the
  non-highlighted text so the eye reads only the stroke.
- **S5 (should fix), 37.1-45.0 s:** the full Grasim Outlook paragraph and the full Chairman paragraph are sharp (40-70 words
  each) while the voice says something else: screen text competes with narration (STORY_ENGINE T10). Defocus all but
  the highlighted phrase, as on the court page.
- **S6 (should fix), 32.16 s:** the b7->b8 transition passes through a near-empty dark frame (faded stamp and tag only).
  Use a page turn straight onto p.39.

## 4. Flatness list (DIRECTOR §8)
- Every sentence its own picture: not found (b1-b2 and b6-b7 share a page; 8 pictures in 45 s).
- Reveal too early: not found (62 %).
- Three charts in a row: not found.
- One speed / loudness / bed: loudness range is narrow (LRA 2.4 LU) as expected for a voiced Short; whether the four music
  cues and the peak are audible I cannot judge (Q3).
- Finished chart held in silence with nothing moving: silence 1 sits on the dot field; stills at 16.0-16.9 s look the same
  (no visible drift at this scale). Q3.
- Transition through an empty frame: found once, 32.16 s (S6).
- Ending is admin: not found. **S7 (should fix), 44.97 s -> 0 s:** the loop seam is a hard cut from the "counter share"
  page to b1's page; the treatment's whip pull-out landing on shot 1's first frame is not there. Also the last word "why"
  ends at 44.98 s against a 45.00 s file: check it is not clipped (add 0.1 s tail or start b1's highlighter under it).

## 5. Sound
- Two silences present (measured above), the last just before the reveal. Voice on top at -14.1 LUFS, TP -1.5 dBFS:
  meets "about -14".
- Sound-plan rows (highlighter, paper slap, whoosh, dot ticks, stamp + peak hit, page turn, whip, pulse across the loop):
  not checked by ear. **Q3 (AK):** on one listen, are the stamp/peak at about 27.8 s, the bed drop under b8 and the pulse
  return at 37.1 s audible, and is anything busy under the voice?
- **S1 (should fix) / Q1 (AK), 43.50-43.86 s, "prize":** turbo on the full mix hears **"price"** (prob 0.58) and on a 2 s
  clip "price" (0.85); turbo on a 7 s clip and large-v3 on both clips hear **"prize"** (0.72-0.95). So the models split
  3-2 for "prize"; the final z is weak. AK's ear decides. If it sounds like "price": re-voice the line, or change the word
  (e.g. "So the counter is still what they're fighting for"), since "price" in a finance Short could also read as a
  pricing claim.

## 6. Evidence
- Every on-screen number matches the ledger: "₹1 in ₹100" / "TOP 10" = C002 (0.9 %); "50,000+" = C012; dot field 9 of
  1,000 dark = 0.9 %, labelled ILLUSTRATIVE and OUR READING. No DISPUTED figure (C023 42 % badge) appears; BRSR row b
  (72,873/75,793) is blurred; Grasim p.12/p.30 other figures (11,500 towns, 146 depots) blurred; no CCI order date.
- "Grasim says" on every Grasim figure: yes (50,000+ caption and GRASIM SAYS tag at b5; GRASIM SAYS tag at b2 and b9).
- ALLEGATION label vs text: para 30(iii) first becomes readable at about 27.8 s, the same frame the stamp lands; the
  caption "ALLEGATION ONLY" is up from 27.4 s and "alleged" is spoken at 27.84 s. Label is never later than the text.
  The stamp stays through b8 (32.2-37.1 s). Pass.
- "Our reading" lines (b4, b10) carry OUR READING on screen from their first frame. Pass.
- Source line present in every sampled frame, and page references match the ledger locators (MD & CEO pp. 30-31; BRSR
  p. 324; Grasim pp. 20-21 / p. 57 / p. 59; judgment p. 29 and p. 39 of 40; Chairman's letter pp. 24-25).
- **M1 (must fix), 7.12 s and 17.02 s: numbers on screen before they are spoken** (DIRECTOR §7; contract 07 check 6).
  - b5: caption "**50,000+** DEALERS · GRASIM SAYS" and the highlighted "over 50,000" on the page appear at 17.0-17.2 s;
    "fifty thousand" is spoken at 19.62 s (2.6 s early).
  - b3: caption "THE **TEN** BIGGEST" appears at 7.12 s; "ten" is spoken at 11.34 s (4.2 s early), while the voice is still
    on "almost all to dealers and distributors".
  - Fix: cue the 50,000 caption and highlight to the "over fifty" cue already in story.js `ev`; give b3's first sentence
    its own caption (e.g. "Almost all to dealers") and land "The ten biggest" on "The ten". ("UNDER ₹1 IN ₹100" lands
    at about 11.4 s, ~1 s before "under one rupee"; acceptable, but cue it to "under" in the same pass.)
- **S9 (should fix, research/script), ledger:** `claims.jsonl` has no `self_claim` field on any claim (COMMON.md §2 v1.1
  postdates it). Add `self_claim: "Grasim"` (C012, C013, C024, C025) and `"Asian Paints"` (C002, C004, C006, C008).
  Narration then has two unlabelled self-claims: b2 "A new rival says" (Grasim named on screen only) and b3 "Asian Paints
  sells almost all..." (BRSR, audited, shown as Asian Paints' page). **Q4 (AK):** is the on-screen GRASIM SAYS /
  company source line enough for these two, or must the voice name them? Narration is locked, so I did not mark it
  must-fix.
- Minor (part of S3): caption says "TOP 10 DEALERS"; the ledger metric is "dealers/distributors". The voice said "dealers
  and distributors" a second earlier, so I accept it.
- **S8 (should fix), 21.7-27.3 s:** add a small on-screen gloss for "tinting machine" ("the shop's colour-mixing machine"),
  labelled as our explainer, so a first-time viewer gets the object the send line relies on.

## 7. Packaging
- Frame 0 carries the hook: the highlighted "network strength remains one of our strongest competitive advantages", already
  mid-stroke, with STILL A MOAT? and the disclaimer; the court is not shown before 23.3 s. Pays off title A at frame 0.
- Length 45.00 s: inside SHORTS_RULES H1 (15-60 s); exactly on shorts_check's 45 s warning edge (builder logged WARN).
  H3: first sentence ends at 3.0 s, 10 words. H5: 120 words in 45 s = 160 wpm. H6: 10 beats, 120 words.
- **Q5 (AK):** title A or B (unchosen, script.json).

## Re-check after the fix round
Re-extract frames at 7.1-12 s and 17-20 s (M1), the 27-32 s captions (S2), 32.0-32.4 s (S6) and the loop seam (S7);
re-transcribe 42-45 s if b10 is re-voiced; re-measure LUFS if the mix changes.
