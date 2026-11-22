# mm-asianpaints-dealers: DIRECTOR_LOG

Decisions and why, newest first. Director = role 5 (contract `agents/contracts/05_director.md`). Facts and claim IDs are
never changed here.

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
