# Moat Snippets

A Moat Atlas series: one moat (or one crack in a moat) per vertical short, under 30 seconds, with a curiosity hook, an analogy, a dark joke
(aimed at companies and situations, never people) and a closing question. Not investment advice · not SEBI-registered.

**Use the files in `final/`:** `FINAL_SCRIPTS.md` (ten voiceovers, on-screen captions, source lines, visuals, post captions) and
`VERIFICATION_LOG.md` (every claim, how it was checked, what is still open). The first-round drafts were removed because they contained claims
that failed verification (an 87% CIRP figure, a $10B stockpile, a 50% TSMC price rise); they are in git history only.

Format: about 2.8 spoken words a second (80 words at most). Visuals start from `hyperframes/samples/s16-short-moat` and `s17-short-apple`.

## Producing a snippet
1. `python3 hyperframes/tools/hf.py sync`
2. Voice and timing: `python3 scripts/moat_snippets/voice.py A1` (MiniMax, needs `MINIMAX_API_KEY`; `--voice` picks the narrator),
   or your own take with `--audio take.mp3`, or `--engine piper` for a scratch voice. This writes `vo.mp3` and `timing.js` and sets the video length.
3. `python3 hyperframes/tools/hf.py check 18` then `snap` and `render` (silent MP4 to `out/hyperframes/`).
4. `python3 scripts/moat_snippets/voice.py A1 --mux [--music bed.mp3]` writes `out/hyperframes/moat-snippet-a1.mp4`.
5. Sound effects: `python3 scripts/moat_snippets/sfx.py A1` (needs numpy) mixes code-made effects under the voice and rewrites the same file.
   Each snippet has a cue sheet in `sfx.py` keyed to the scene's word anchors; `--dry` prints it. A new snippet needs its own `cues_<id>` function.
The scenes follow the voiceover's word times, so a new voice needs no re-editing, only steps 2 to 4. A1 and A2 are built as video so far.
