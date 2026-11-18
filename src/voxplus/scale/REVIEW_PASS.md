# Review pass (20 Oct 2026, AK + external reviewer): read with BRIEF.md

AK watched draft 2. An external review found the explanation strong but the evidence too small and dense on a phone, and some
transitions passing through empty frames. Fix your scenes as below. The narration is FINAL except scene 01 (new opening,
already voiced). Beat timing was regenerated, so cue only by beat + phrase.

## LOOK CHANGED: original VoxPlus again (AK)
`src/voxplus/scale/kit/` is now the ORIGINAL VoxPlus kit (as in A01 "What Is a Moat?"): DM Serif Display for big type,
Vox yellow highlighter (C.highlight / C.highlightPrint), black ink, cream paper, IBM Plex Mono source chips. `C.teal` now maps to
Vox wall blue and `C.rust` to marker red, so existing code still works. Big Inter-800 type (48 px and up) was converted to F.serif
automatically; check your scenes still look right (serif headlines and numbers, Inter only for labels and stickers). The rupee sign in
F.serif renders through the Inter fallback, which is fine.

## Rules for this pass
1. EVIDENCE BIG ENOUGH FOR A PHONE: any document excerpt must be readable at 720p. Show the page or table briefly (2 s at most)
   for provenance, then crop or zoom so the highlighted line fills at least 60% of the frame width. Never ask viewers to read a
   document and a chart at the same time: one dominant image per moment.
2. ONE DOMINANT IMAGE: when comparing quantities, the chart is full size and centred; supporting items are small or gone.
3. ENTITY LABELS: put `EntityTag` (devices.tsx; texts in `ENTITY`) directly beside every figure, e.g. RJIL · TELECOM COMPANY | FY26,
   AIRTEL · INDIA MOBILE | FY26, JIO PLATFORMS · CONSOLIDATED | FY26, with "EXIT QUARTER" or "FULL YEAR" in `period` where it applies.
4. NO EMPTY FRAMES: at a cut, the incoming shot must show a meaningful element from its first frame (enter at 0 or earlier), or keep
   the outgoing element on screen until the next one lands. No shot may show only background for more than about 0.25 s.
5. Keep the reading holds short: the film's pauses were removed; let the chart finish, but don't add silence.
6. Visual variety at story turns: a full-screen photo (MEDIA.md, never BY-SA) or a full-screen chart where the story turns.

Checks are as in BRIEF.md: tsc clean, and stills for every shot. Also check stills 0.1 s after each of your cuts for empty frames.
Report as before, listing every review point you fixed.
