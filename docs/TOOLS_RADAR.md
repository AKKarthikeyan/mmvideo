# Tools radar: AI-agent video tools, checked against what we already have (18 Nov 2026)

AK shared an X post (eluchocha, status 2122710958208438299) listing about 20 tools for making animated videos with AI
agents, plus a summary of it. **The post itself could not be read from the cloud session** (x.com answered HTTP 402),
so each tool below was checked at its own source instead: repo, docs or licence. Verdicts are ours.

**Bottom line:** most of the list is already in our stack. HyperFrames is HTML + GSAP + three.js; we run Remotion 4,
FFmpeg and MiniMax TTS; faster-whisper checks our voice tracks. Three things are worth adding, and none needs a new
renderer:
1. **WhisperX**, the day AK records his own narration: word-level timings let the picture follow a human voice the way
   it now follows the TTS timestamps. Hindi is supported; **Tamil is not** (see below).
2. **LottieFiles motion-design skill** (MIT): a reference for timing, easing and Disney's 12 principles. It is a checklist
   for our motion, not a library.
3. **Anatomy Reveal skill**: exploded and teardown views for The Inventor Desk, next to our own sample s08.

## What we already have (don't add these again)

| In the post | Our equivalent | Where |
| --- | --- | --- |
| GSAP | HyperFrames' clock and every sample | `hyperframes/shared/lib/gsap.min.js`, `hf.js` |
| Three.js | 3D samples (terrain, globe, exploded phone, seat map) | `hyperframes/samples/s02`, `s07`, `s08`, `s15` |
| Remotion | Vox engine, Case engine, carousels | `src/vx/`, `src/carousel/` |
| FFmpeg | every mux and render step | `scripts/*`, `hyperframes/tools/*` |
| Word-timed captions | TTS sentence timestamps (MiniMax `subtitle_enable`); faster-whisper check | `hyperframes/tools/il_act1_build.py` |

## Each tool, checked

| Tool | What it is | Licence / terms | Useful for | Verdict |
| --- | --- | --- | --- | --- |
| **LottieFiles motion-design-skill** (`github.com/lottiefiles/motion-design-skill`) | Agent skill: Disney's 12 principles adapted for screen, timing, easing, choreography; works with GSAP, CSS, Lottie | MIT | All channels: a motion checklist | **Add as a reference** (`npx skills add LottieFiles/motion-design-skill`). AK to approve installing third-party skills |
| **Remotion Skills** (`github.com/remotion-dev/skills`) | Official best-practice skills for agents writing Remotion | Skills free. **Remotion itself is free only for individuals and companies of up to 3 people; larger for-profits need a Company Licence** (remotion.pro/license; terms change in Remotion 5) | Moat & Margin's Vox and Case engines, carousels | Useful if we keep writing Remotion. **AK: check our headcount against the licence** |
| **Motion AI Kit** (`motiondivision/ai-kit`, `npx motion-ai`) | Skill + MCP server for Motion (formerly Framer Motion), CSS spring curves | Skill MIT; springs, examples and editor are paid (Motion+) | Web UI, not video | Skip: we don't use Framer Motion |
| **Hairline** (`lucasmarkes/hairline`) | React library of isometric line figures, with "create" and "adopt" agent skills | Not checked | Maybe Inventor Desk diagrams | Low: interactive web figures, not a video pipeline |
| **Anatomy Reveal** (`annnguyentt/anatomy-reveal-skill`) | Skill for exploded views, teardowns, product reveals | Not checked: read the LICENSE before use | **The Inventor Desk** | **Try once** against sample s08 |
| **WhisperX** (`m-bain/whisperx` 3.8.6) | Whisper transcription + wav2vec2 alignment for word-level timestamps | BSD-2 | Captions and timing for **human-voiced** narration on every channel | **Add when AK records.** Alignment languages, read from `alignment.py` in 3.8.6: English, **Hindi**, Telugu, Malayalam and 32 more. **No Tamil** model by default: a Tamil channel would need a community wav2vec2 model, tested on our audio first. Numbers and symbols ("2014", "₹13.60") get no word timing |
| **librosa** | Audio analysis: beat and tempo, to cut on the beat | ISC | Shorts with a music bed | Low: AK removed music from long videos (18 Nov) |
| **Openverse** (openverse.org) | Search engine for Creative Commons images and audio | Licence differs per item | Sound effects (stamp, locker door) | Only CC0 or CC BY items, never NC or ND (our channels are monetised); keep the attribution in the description. Test one Short first: AK found the music odd, so SFX need a listen |
| **Manim** (Manim Community) | Python engine for maths animation: equations, graphs, geometry | MIT | **UPSC Mains** (numbers in the Constitution, formulas), **Moat & Margin** (compounding, DCF, ratios) | Worth one test on a formula-heavy explainer; everything else stays in HyperFrames |
| **react-three-rapier** | Physics for react-three-fiber | MIT | Falling, stacking objects | Skip: we use plain three.js, not react-three-fiber |
| **react-postprocessing** | Bloom, film grain, depth of field for react-three-fiber | MIT | Cinematic 3D maps | Skip for now: three.js has its own post-processing if a 3D sample ever needs it |
| **three.quarks** | Particle system for three.js | MIT | Dust, sparks, smoke | Low |
| **Blender agents** (e.g. Blender MCP) | Agents driving Blender | Varies | Photoreal product shots | Skip: slow; AI-made realistic images need "illustrative" labels |
| **Tweakpane** | Live sliders for tuning parameters in the browser | MIT | Tuning a HyperFrames scene by eye | Optional dev convenience |

## Per channel

| Channel | Take from this list | Already covered by |
| --- | --- | --- |
| Moat & Margin | Remotion Skills (if the licence fits); Manim for compounding and DCF | Vox engine, Case engine, carousels |
| Indica Atlas | Nothing new; WhisperX for Hindi captions once human-voiced | HyperFrames maps, satellite, terrain, wind |
| UPSC Mains (Hindi) | WhisperX (Hindi alignment exists); Manim for numeric constitution explainers | Benchmark Short `um-parisiman` |
| India Ledger | WhisperX when AK narrates; motion-design skill as a checklist | The "Ledger" look, `il-gold-act1` |
| The Inventor Desk | Anatomy Reveal (trial); Hairline at most for diagrams | Samples s08 (exploded), s09 (patent), s11 (timeline) |
| Moat Atlas | Nothing new | Samples s01, s02, s07 |
| **The Inner Chariot** | Not in this repo yet. **AK: what is this channel about?** | — |

**Not in our checks:** the pasted summary says Remotion "could plug straight into DarwinMCP's output", and mentions an
Indica Atlas Tamil channel. Neither is in this repo; both are for AK to confirm.

## Sources (checked 18 Nov 2026)
- lottiefiles/motion-design-skill (GitHub; MIT per listing)
- remotion.dev/docs/ai/skills · github.com/remotion-dev/remotion LICENSE.md · remotion.dev/docs/license/faq
- motion.dev/docs/ai-kit · github.com/motiondivision/ai-kit
- whisperx 3.8.6 wheel from PyPI, `whisperx/alignment.py` (DEFAULT_ALIGN_MODELS_TORCH, DEFAULT_ALIGN_MODELS_HF)
- gsap.com/standard-license (free for commercial use since 30 Apr 2025, with a "prohibited use" clause for no-code tools
  that compete with Webflow; does not affect us)
- skillsmp.com/creators/lucasmarkes/hairline · typingmind.com/skills/annnguyentt-anatomy-reveal
