# Tools radar: AI-agent video tools, checked against what we already have (18 Nov 2026)

AK shared an X post (eluchocha, status 2122710958208438299) on tools for making animated videos with AI agents. x.com
would not serve the post to the cloud session (HTTP 402), so **AK pasted its 16 links**. Each repo below was checked on
GitHub (search API, 18 Nov 2026): stars, licence as GitHub detects it, last push. Verdicts are ours.

**Correction to the summary AK first received:** it listed Hairline, Anatomy Reveal and Openverse, but **none of these
are in the post's links**. The "Blender agent" in the post is Scenario's Blender plugin, a paid AI-generation service
(below). The summary also left out lottie-web, which the post includes.

**Bottom line:** most of the list is already in our stack. HyperFrames is HTML + GSAP + three.js; we run Remotion 4,
FFmpeg and MiniMax TTS; faster-whisper checks voice tracks. Worth adding:
1. **WhisperX**, when AK records his own narration: word-level timings let the picture follow a human voice. Hindi is
   supported; **Tamil is not** by default.
2. **LottieFiles motion-design-skill**, as a motion checklist (timing, easing, Disney's 12 principles).
3. **lottie-web**, to drop small ready-made animated icons (locker, coin, tick) into HyperFrames scenes. Each animation
   file carries its own licence.
4. **Manim**, tested once on a formula-heavy explainer (UPSC Mains, Moat & Margin).

## The 16 links, checked

| Repo | ★ | Licence (GitHub) | Last push | What it is | We already have | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | 3,332 | MIT | 17 Nov 2026 | Agent skill: timing, easing, choreography, Disney's 12 principles; works with GSAP, CSS, Lottie | — | **Add as a reference** (`npx skills add LottieFiles/motion-design-skill`), once AK approves third-party skills |
| [motiondivision/ai-kit](https://github.com/motiondivision/ai-kit) | 126 | none detected (docs say MIT) | 4 Nov 2026 | A Cursor/agent plugin for Motion (formerly Framer Motion); springs as CSS curves. Several features need paid Motion+ | — | Skip: we don't use Framer Motion |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | 7,480 | none detected | 18 Nov 2026 | Official Remotion best-practice skills for agents | Remotion 4 engines | Useful while we write Remotion (Moat & Margin). Check its licence file before installing |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | 74,063 | Remotion License (custom) | 18 Nov 2026 | Videos in React code | **Yes**: `src/vx/`, `src/carousel/` | Keep. **Free only for individuals and companies of up to 3 people; larger for-profits need a Company Licence** (remotion.pro/license). **AK: check our headcount** |
| [scenario-labs/blender-plugin](https://github.com/scenario-labs/blender-plugin) | 1,049 | GPL-3.0 | 13 Nov 2026 | Scenario's AI images, video, 3D and PBR materials inside Blender, plus a local agent; needs a Scenario account (paid service) | — | Skip: slow, paid, and AI-made realistic images need "illustrative" labels |
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | 118,822 | MIT | 18 Nov 2026 | 3D in the browser | **Yes**: HyperFrames samples s02, s07, s08, s15 | Keep |
| [pmndrs/react-three-rapier](https://github.com/pmndrs/react-three-rapier) | 1,677 | MIT | 12 Oct 2026 | Physics for react-three-fiber | — | Skip: we use plain three.js, not React |
| [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) | 1,653 | MIT | 21 Oct 2026 | Bloom, film grain, depth of field for react-three-fiber | — | Skip: three.js's own post-processing will do if a 3D scene needs it |
| [Alchemist0823/three.quarks](https://github.com/Alchemist0823/three.quarks) | 1,229 | MIT | 18 Nov 2026 | Particles and VFX for three.js | — | Low: only if a scene needs dust, sparks or smoke |
| [cocopon/tweakpane](https://github.com/cocopon/tweakpane) | 4,704 | MIT | 15 Mar 2026 | Live sliders for tuning values in the browser | — | Optional: a dev aid for tuning HyperFrames scenes by eye |
| [greensock/GSAP](https://github.com/greensock/GSAP) | 30,885 | GSAP Standard "No Charge" License | 4 Nov 2026 | Animation library | **Yes**: every HyperFrames project | Keep. Free for commercial use since 30 Apr 2025; the "prohibited use" clause covers no-code tools that compete with Webflow, not videos |
| [ManimCommunity/manim](https://github.com/ManimCommunity/manim) | 42,661 | MIT | 17 Nov 2026 | Python maths animation: equations, graphs, geometry | — | **Test once**: UPSC Mains numeric explainers; Moat & Margin compounding, DCF, ratios |
| [airbnb/lottie-web](https://github.com/airbnb/lottie-web) | 32,504 | MIT | 1 Sep 2025 (slower lately) | Plays After Effects / Lottie animations in the browser | — | **Useful**: drop ready-made animated icons into HyperFrames. Each animation from LottieFiles carries its own licence: check it is free for commercial use |
| [librosa/librosa](https://github.com/librosa/librosa) | 9,010 | ISC | 17 Nov 2026 | Audio analysis, including beat detection for cutting to music | — | Low: AK removed music from long videos (18 Nov 2026) |
| [m-bain/whisperX](https://github.com/m-bain/whisperX) | 25,454 | BSD-2-Clause | 12 Nov 2026 | Transcription with word-level timestamps and speaker labels | faster-whisper (checks only) | **Add when AK records.** Alignment languages in 3.8.6 (`alignment.py`): English, **Hindi**, Telugu, Malayalam and 32 more. **No Tamil** default model: a Tamil track needs a community wav2vec2 model, tested on our audio. Numbers and symbols ("2014", "₹13.60") get no word timing |
| [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg) | 67,525 | LGPL/GPL (depends on build) | 18 Nov 2026 | Encode, mux, convert | **Yes**: every render and mux | Keep |

## Per channel

| Channel | Take from this list | Already covered by |
| --- | --- | --- |
| Moat & Margin | Remotion Skills (if the Remotion licence fits); Manim for compounding and DCF | Vox engine, Case engine, carousels |
| Indica Atlas | Nothing new; WhisperX for Hindi captions once human-voiced | HyperFrames maps, satellite, terrain, wind |
| UPSC Mains (Hindi) | WhisperX (Hindi alignment exists); Manim for numeric constitution explainers | Benchmark Short `um-parisiman` |
| India Ledger | WhisperX when AK narrates; motion-design skill as a checklist; lottie-web for small animated props | The "Ledger" look, `il-gold-act1` |
| The Inventor Desk | lottie-web icons; Manim for mechanisms with geometry | Samples s08 (exploded), s09 (patent), s11 (timeline) |
| Moat Atlas | Nothing new | Samples s01, s02, s07 |
| **The Inner Chariot** | Not in this repo yet. **AK: what is this channel about?** | — |

**Not confirmed:** the summary also said Remotion "could plug straight into DarwinMCP's output". DarwinMCP is not in
this repo; AK to confirm.
