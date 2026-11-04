# Handoff: Moat Snippets (written 4 Nov 2026)

Branch `claude/moat-atlas-asian-paints-short`. No pull request is open yet.

## What exists
- **Series:** Moat Snippets, a Moat Atlas series. Ten under-30-second scripts (Apple x5, Visa/Mastercard x5) in `final/FINAL_SCRIPTS.md`.
  Every claim, its source and its status is in `final/VERIFICATION_LOG.md`. Three claims were dropped as unverified (CIRP 87%, Apple $10B stockpile, TSMC 2nm +50%).
- **Video built so far:** only A1 (Apple, the lock): `hyperframes/samples/s18-snippet-a1/`. Other HyperFrames samples from this work: `s16-short-moat`
  (Asian Paints, plain version) and `s17-short-apple` (Apple Q4 2026 results, richer motion; scripts in its `SCRIPT.md`).
- **Tool:** `scripts/moat_snippets/voice.py` makes the voice, word timing and final mux (see `scripts/moat_snippets/README.md`, "Producing a snippet").

## Decisions already made (AK)
- Moat Atlas is **US English**. MiniMax default voice: `English_CaptivatingStoryteller` (US male storyteller; AK picked it 4 Nov 2026 from six US male samples). Reads slowly: use `--speed` about 1.15 to stay under 30 s.
- Style: analogy, curiosity hook, dark humour aimed at companies and situations (never people), closing question. Real data with the source on screen; illustrative drawings labelled.
- Every video ends on: "Educational research, not investment advice · not SEBI-registered".

## Next steps
1. Add `MINIMAX_API_KEY` to the cloud environment (environment menu, then Edit, then Network secrets or an environment variable). Then run
   `python3 scripts/moat_snippets/voice.py A1`, re-render (`python3 hyperframes/tools/hf.py render 18`) and `--mux`. Listen to the voice; try other US English MiniMax voices.
   The current A1 video uses a Kokoro stand-in voice (`--engine kokoro`; model files are not in git, see the voice.py docstring).
2. A1 and A2 are voiced (4 Nov 2026, MiniMax `English_CaptivatingStoryteller`, `--speed 1.15`; voice 28.2 s and 25.6 s), rendered and muxed:
   `out/hyperframes/moat-snippet-a1.mp4` (32.7 s) and `moat-snippet-a2.mp4` (30.1 s), about -17.5 LUFS. A2's scene is `hyperframes/samples/s18-snippet-a2/`.
   Next: A3 onwards, in the order in `FINAL_SCRIPTS.md` (copy `s18-snippet-a2`). End-card hold is 4.0 s (voice.py, A1, A2).
   The HyperFrames renderer needs ffmpeg with the `setparams` filter; Remotion's bundled ffmpeg lacks it (a static build from `pip install imageio-ffmpeg` works).
3. Close the open verification items at the bottom of `final/VERIFICATION_LOG.md` (NPCI page, Visa 10-Q legal note, Apple call transcript from Apple's own site).
4. Add a music bed (`--music`). Optionally port the richer motion from `s17`/`s18` into the Asian Paints short (`s16`).
5. Possible later topic: Anthropic's IPO. Blocked on reading the S-1: SEC blocks anonymous downloads and needs a declared user agent; AK has not given one.

## Known gotchas
- Pushes sometimes fail once with a generic "remote rejected" error; retrying after a few seconds works.
- Run `python3 hyperframes/tools/hf.py sync` before check/render. Renders and `*.mp3` are not in git (`out/`, `.gitignore`).
- `voice.py` sets the sample's `data-duration` from the voice length; re-render after changing the voice.
