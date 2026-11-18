# "Airtel's Moat: Price, Mix or Convergence?": shared brief for scene builders (6 Nov 2026)

Owner: AK (Moat & Margin). Script with PICTURE / SCREEN / EDIT per scene (READ IT FIRST, incl. "Visual system and asset brief" and
"Source and calculation handoff"): `/Volumes/DarwinSSD/MMVideo/scripts/voxplus/SCRIPT_airtel_convergence_moat_6nov.md`. Where this brief and
the script differ, the script wins. Narration is FINAL once voiced (never change words). Until then `airtelTiming.ts` is PROVISIONAL
(estimated from word counts; its header says so): build and still-check against it, expect cuts to move after the voice, so always cut
on spoken words (`S(beat, "phrase|-0.2", ...)`), never on fixed seconds.

Work on the Mac Mini. Repo /Volumes/DarwinSSD/MMVideo (Remotion 4). Node needs `export PATH=/opt/homebrew/bin:$PATH`; system python with
fitz/PIL is `/usr/bin/python3`. Do not voice (MiniMax window 06:45-22:10 IST, voice is run by the lead), do not publish, never print a key.

## Look (binding; same as the Jio film)
Themed VoxPlus kit in `src/voxplus/airtel/kit/` (copy of the scale kit: Vox palette tokens, ONE sans, Inter 800 + 600). Import kit
pieces ONLY from `./kit/...`. Palette tokens: C.paper, C.ink, C.teal, C.rust, C.highlight, C.grey, C.white (use tokens, never raw hex).
No Vox branding, no serif, no logos (brand names as plain text), no paragraphs on screen. Direct labels, zero-based bars and lines,
explicit units / periods / entity scopes, no invented intermediate points. Document shots = real report page -> crop -> highlight, never
a fabricated page. Restrained motion; hold finished charts so they can be read (5-8 s). About one SFX per 10 s. Label schematics "Illustration".
Management statements are always labelled MANAGEMENT SAYS; our arithmetic is always labelled "our arithmetic". Neutral tone: no sirens,
no verdict words beyond the script's stamps. No IPO details, share price, valuation, buy/sell/hold, no moat rating.

## Files you own (one builder per scene group)
- Builder A: scenes 01-04. Builder B: scenes 05-08. Builder C: scenes 09-11.
- Only your `src/voxplus/airtel/scNN.tsx` (keep exports `SHOTSNN: Shot[]` and `CUESNN: SCue[]`; replace the placeholder shot), optional
  `src/voxplus/airtel/partsNN.tsx`, and assets `public/voxplus/airtel/docs/scNN_*`. Do not edit devices.tsx, devices_airtel.tsx, cue.tsx,
  Film.tsx, Root.tsx, Thumb.tsx, airtelTiming.ts, kit/, other scenes, src/Root.tsx, the ledger, scripts, or git. Need a device change? Make a
  local variant in your partsNN.tsx and say so in your report.

## Recurring devices
`devices_airtel.tsx` (new, parameterised; every value comes from the caller): `SuspectCards` (PRICE / MIX / CONVERGENCE, active card, stamp
per card: slides in blank in 01, centre in 02, stamps NOT SEPARABLE etc. in 04, 05, 07, all return in 11), `BillCard` (generic bill, amount
ticks `from` -> `to`, tap Paid; 01 and 11), `QuoteCard` (transcript crop + speaker + MANAGEMENT SAYS; 04, 06, 08), `LineChart` (zero-based,
direct labels, ring on highlighted points; 03, 07, 08), `PairBars` (zero-based labelled bars; 03, 05, 07, 09, 10).
`devices.tsx` (copy of the scale set): `DotGrid` (1,000 dots, 05), `RechargePhone`, `CashCalendar`, `Bridge`, `Network`, `EntityTag` (entity/period chip).
The same SuspectCards position/props must repeat across scenes so the cards read as one object.

## Timing API: `cue.tsx` (identical to the scale film)
`S(beat, x, tr, Component, id?)`: shot cuts in at beat start + x (seconds, or a spoken phrase, "phrase|-0.2" offsets). Beats are paragraphs
`sNNpK` (see ORDER / SAY / WORDS in airtelTiming.ts). Inside a shot: `const f = useTicks(), a = useAt(s0); a("s03p2", "two hundred and thirty three")`
= local tick (30/s) when the phrase is spoken. Cue numbers, highlights and stamps to the words that say them. Transitions H0, WL/WR/WU/WD, PU/PL,
MZ, PUSH(x,y). SFX in CUESNN as `[W(beat, phrase), name, gain]`. Shots of all scenes merge and sort by cut time; a shot runs until the next
cut, so your first shot cuts at the scene's first beat (x = 0).

## Figures (hard rule)
Every figure on screen must equal its row in `scripts/ledger/airtelconv.csv` (or the script's SCREEN line for the same claim) and appear ONLY
when it is spoken (cue it with `a(beat, phrase)`). A figure not in the script or ledger stays out. Our calculations are labelled.
Do not edit the ledger; `checked_by` / `checked_on` are AK's. No finalize step runs before AK signs every row.

## Document shots
`/usr/bin/python3 scripts/voxplus/airtel_docshots.py --list` (PDFs in `/Volumes/DarwinSSD/Moat and Margin/01 Videos/Airtel convergence moat/raw/`), then
`/usr/bin/python3 scripts/voxplus/airtel_docshots.py PDFNAMEPART "phrase" --out scNN_name [--page N] [--nth K] [--before 80] [--after 60]` writes
`public/voxplus/airtel/docs/scNN_name.png` (+ .json with highlight rects). Page numbers per claim are in the ledger (PDF page = printed + 2 in
the Quarterly Report; check by eye). Look at every crop. Show with `<DocPage f src="airtel/docs/NAME.png" imgW imgH x y width highlights=[...]/>`
(kit/DocPage; src relative to public/voxplus/) or `QuoteCard src="airtel/docs/NAME.png"`.

## Check your work (required)
Stills: `node scripts/voxplus/airtel_stills.mjs out/voxplus/airtel_qa/scNN s05p1@0.5 s05p1@4.0 s05p2@power ...` (beat@seconds or beat@first-word).
Batch ALL specs in ONE call (each call bundles ~1 min). Open every jpeg and fix overlaps, cut-off text, empty frames, unreadable numbers, counts
not finished before the next cut, anything in the bottom 12% (subtitle zone). tsc is not installed in MMVideo, so renders/stills are the real
check. Report briefly: shots per beat (cut, on screen, source chip), assets used, stills checked, open issues.
