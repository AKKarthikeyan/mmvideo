# Data Kadai: open tools for a flat cartoon-explainer look

Researched 28 Oct 2026. A researcher read each licence at the publisher, and a second one re-checked it. Pages came through a summarising fetch tool, so re-read the raw LICENSE file before you copy any code into the repo. Nothing was cloned, downloaded or run.

## 1. Bottom line

1. **No ready kit exists.** No GitHub kit gives this look (puppet characters, speech bubbles, bar props, maps) under a clear free licence.
2. **Only small parts exist.** Rhubarb handles lip sync. Rough.js and `@remotion/rough-notation` give hand-drawn accents. d3-geo handles map projection. `@remotion/lottie` plays outside animations. All are permissive.
3. **Open character art is the wrong shape.** Open Peeps, Open Doodles, Humaaans and Kenney are CC0 or close. They are static or outlined people, not rigged puppets with mitten hands.
4. **Best route:** keep the SVG-in-code Remotion look and draw our own mascot rig. Add Rhubarb for mouth timing and rough-notation for accents. Draw our own sets, wipe and icon charts.
5. **Two licence worries.** Remotion's free tier stops at 3 people, contractors included. Our India map data (DataMeet) is not cleanly cleared, and our `build_geo.py` already uses it.

## 2. What The Infographics Show is publicly known to use

- **Tools (snippet only):** A search result quotes the channel's own "about" text. It names Adobe Audition for voice, Illustrator for vector art and After Effects for animation. We could not open the channel's about page, so this is a snippet, not a primary read.
- **Templates (unverified):** One blog (anideos.com) says they also use After Effects templates from Envato Elements. That is secondary and unverified.
- **History:** Wikipedia says Andrej Preston has produced the videos since 2011. It says nothing about tools.
- **Not found:**
  - Any source naming Adobe Animate, Toon Boom, Moho, Vyond, Powtoon or Duik for this channel.
  - Any public confirmation of puppet rigs. They are very likely, but unconfirmed.
  - Any tutorial for this exact style.
- **Not searched:** We did not look for their frames, characters or scripts, as instructed.

**What it means:**
- The look comes from hand-built vector parts, rigs and keyframes (Illustrator and After Effects). Our Remotion SVG rig is the same idea in code.
- There is no hidden open tool to find.
- Rubber-hose limbs exist as features in Cavalry, RubberHose and Duik. Those are paid or non-web tools, so we write a small two-bone IK helper ourselves.

## 3. Recommended picks

### Verdict "use" (survived the skeptic)

| Need | Pick | Licence | Attribution | Use it for |
|---|---|---|---|---|
| Lip sync | [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) | MIT (Daniel Wolf). Bundled parts are Boost, BSD, MIT and WTFPL. GitHub shows "Other" only because the file lists many parts. | None in videos. Keep the MIT notice and third-party notices only if we redistribute the binary. | Turn the MiniMax voice into timed mouth cues (A to H, X) as JSON. It is a build step on the Mini. Input must be WAV or OGG, so convert MP3 first. English only. Tamil words need the `phonetic` recogniser or a held neutral mouth. Apple Silicon support is unconfirmed, so test on the Mini. Last release April 2025. Do not reuse its sample mouth art. |
| Playing outside animations | [@remotion/lottie with lottie-web](https://www.remotion.dev/docs/lottie/lottie) | lottie-web is MIT. `@remotion/lottie` is under the Remotion License, with no separate licence. | None in videos. Keep "Copyright (c) 2015 Bodymovin" if we redistribute lottie-web. | Play Lottie JSON frame-locked, as vector SVG. Only for files we make ourselves or that carry CC0, MIT or CC BY. Every Lottie file has its own licence. |
| Hand-drawn accents | [@remotion/rough-notation](https://www.remotion.dev/docs/rough-notation/api) | MIT, declared in `package.json` and on the docs page. It needs `remotion`. | None. | Circle, underline, box, bracket, highlight and crossed-off around big-number badges, name plates and pills. **Already installed in our repo at 4.0.529.** Frame-safe via `progress` and `seed`. |
| Hand-drawn shapes | [Rough.js](https://github.com/rough-stuff/rough) | MIT (Preet Shihn). Its four small dependencies are MIT. | None in videos. Keep the notice if we bundle the source. | Wobbly outlines and scribble fills. Use a fixed seed per shape, or frames will flicker. Dormant since Nov 2023. Its look is sketchy, so use it for accents, not characters. |
| Map projection | [d3-geo](https://github.com/d3/d3-geo), with topojson-client (ISC) and optionally react-simple-maps (MIT) | d3-geo is ISC plus an MIT notice for the Karney algorithms. GitHub shows "Other". | None in videos. Keep the notices if we redistribute the source. | Turn GeoJSON into SVG paths inside a component. **This is code only. Map data is not cleared (see section 4).** Last commit March 2024. |

**Groups with no cleared pick:**
- **Characters:** none. See the "maybe" list.
- **Props and backgrounds:** none.
- **Transitions:** none. Remotion's own `@remotion/transitions` is unclear (section 4).
- **Sound effects:** none. Leads:
  - FireAmun's five CC0 clips come from Kenney via soundcn. The second hop (Kenney's page for those clips) was not read.
  - Freesound CC0 sounds need no credit, but CC-BY ones do.
  - Mixkit and Pixabay SFX are unverified because the terms could not be read.
- **Full engines:** Remotion is what we already use. The rest are "maybe" or reference only.

### Verdict "maybe" (not refuted, with the open question)

Six more "maybe" items were refuted by the skeptic. They are in section 4 with what would unlock them.

**Characters**

| Pick | Licence | Open question |
|---|---|---|
| [Open Peeps](https://www.openpeeps.com/) | CC0, confirmed on the author's site, his Gumroad listing and the DiceBear LICENSE. | Style fit. These are outlined hand-drawn people, mostly whole poses, with no rigged limbs. Fine for crowds, guests and name-plate faces. Take the SVGs from the site or Gumroad, not Blush (Blush terms not read). |
| [Open Doodles](https://www.opendoodles.com/) | CC0 | Sketchy ink style in static poses. Spot art only. Download from the site, not Blush. Do not take assets from the Dropbox Templates or Website Example folders. |
| [Humaaans](https://www.humaaans.com/) | The author's site and Gumroad say CC0. The 2019 mirror [Calinou/humaaans](https://github.com/Calinou/humaaans) says CC BY 4.0. | Which one applies? Both allow commercial use, so credit Pablo Stanley anyway. The people are static corporate-style figures. Do not install `react-humaaans` (React 16, dead). |
| [Notion Avatar parts](https://github.com/Mayandev/notion-avatar), art by Felix Wong | Code is MIT. Art is CC0 per the repo and site. **Not read at source in the main pass.** The skeptic then read the designer's studio FAQ at abstractlab.co, which says CC0. The Gumroad listing has no licence text and says "not intended for NFT use". | Keep a dated screenshot of the designer's FAQ. The art is head-only, black outline, no fill. Use only `public/avatar/part`. Do not use Notion's name. |
| [DiceBear](https://www.dicebear.com/licenses/) | Library is MIT. 42 styles are CC0, 14 are CC BY 4.0, 1 is MIT. 4 are unclear (Avataaars and Bottts). | Heads and busts only. Use only CC0 styles and log each by name. Lorelei's CC0 rests on DiceBear's word alone. Prefer Open Peeps or Notionists. Use the local npm library, never the hosted API (section 4). |
| [Bean Heads](https://github.com/RobertBroersma/beanheads) | MIT | Heads only. The library has not changed since March 2024. Unset props use `Math.random()`, so set every prop. The author asks that you not resell the icons. A BEANHEADS trademark application exists, so do not name our assets that. Leave the shirt logos off. |
| [Kenney Toon Characters 1](https://opengameart.org/content/toon-characters-1) | CC0 | Nobody has seen the zip or the art. The vector format is unconfirmed and the cast is game-style. Download on the Air (needs your OK) and check the art and the licence file inside. Credit is optional. Do not use Kenney's logo. |
| [Noto Emoji](https://github.com/googlefonts/noto-emoji) and [Fluent UI Emoji](https://github.com/microsoft/fluentui-emoji) | Noto SVG art is Apache-2.0 per `2D/svg/LICENSE`. The repo-root LICENSE is OFL-1.1 and the README is stale. Fluent is MIT. | Icons, not characters. Use for small people and prop icons in unit-charts. Which Noto file governs? Use only 2D SVG, not 3D PNGs. Keep the notices if we commit the files. Prefix SVG ids to avoid clashes. |

**Rigs and mouths**

| Pick | Licence | Open question |
|---|---|---|
| [OpenMascot](https://github.com/jbraunschweiger/openmascot) | MIT, code and art | Created 15 Oct 2026, 2 stars. The mascots are animals. Art provenance is unstated and many commits show an AI author. It has no seek, so frames must be pre-baked for Remotion. Take the rig-format idea only. |
| [shining-rig](https://github.com/Buer2333/shining-rig) | MIT | Raster PNG cutouts, pinned to Remotion 4.0.440. Created 21 Oct 2026, no releases. Reference only. Skip `tools/track.py` because its model-weight licence is unread. |
| [remotion-dev-video-kit (FireAmun)](https://github.com/FireAmun/remotion-dev-video-kit) | Code is MIT. Sounds are CC0. The head art in `public/character/rig` **must not ship**. | One commit, 16 Oct 2026. Use it as a technique source for the joint hierarchy, loudness-driven mouth switching and blinks. Keep the MIT notice on any ported code. |
| [PUP](https://github.com/henrywhuang/pup) | Code is MIT. All art is reserved. | Experimental, 5 weeks old, 1 star, installs from git. Reference for the SVG rig plus `motion.json` idea only. |
| [lip-sync-engine](https://github.com/biolimbo/lip-sync-engine) | MIT | WebAssembly build of Rhubarb. Browser-first with no documented Node path. Stale since Oct 2025. Use the Rhubarb CLI instead. |
| [Rive](https://github.com/rive-app/rive-wasm) | Runtimes are MIT. `@remotion/rive` is under the Remotion License. Marketplace files are CC BY 4.0. | The editor is closed. Free-plan exports show a Rive splash screen, likely baked in. Cadet is $17 per seat per month, or $108 per year. `@remotion/rive` cannot drive mouth shapes. Only worth it if you want an external rig editor. |
| [Theatre.js](https://github.com/theatre-js/theatre) | Core is Apache-2.0. Studio is AGPL-3.0. | A keyframe editor with no Remotion bridge and no release since May 2024. Never ship Studio or `@theatre/browser-bundles`. |

**Props, chart helpers, transitions and engines**

| Pick | Licence | Open question |
|---|---|---|
| [@remotion/rounded-text-box](https://www.remotion.dev/docs/rounded-text-box) (and `@remotion/captions`) | MIT per `package.json`. No LICENSE text file ships. | Only draws a hugging outline around multi-line text (pills, plates). Pin to 4.0.529. Not the look itself. |
| [Remocn](https://github.com/Remocn/remocn) | MIT | A generic motion library with no characters or maps. Cherry-pick transitions, captions and chart helpers. Skip the animated icons (no Lucide ISC notice). Shader items need Apache-2.0 `@paper-design/shaders-react`. Keep the MIT notice because our repo is public. |
| [opus-motion-library](https://github.com/GovinduSasanka/opus-motion-library) | MIT | One week old, one author, "reverse-engineered from sample videos" (the author's words). Motion counts conflict (109, 424, 415). Check each file header before copying. Do not use its demo images, audio or CC BY 4.0 data. |
| [claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit) | MIT code | Four transitions (clockWipe, checkerboard, pixelate, zoomBlur) could be copied with the MIT notice. Its template pins React 18. The AI models it calls have their own terms. Skip the Digital Samba branding. |
| [roughViz](https://github.com/jwilber/roughViz) | MIT | Dormant since Nov 2023. No seed option found, so frames would flicker. Use Rough.js directly. Do not copy its embedded fonts. |
| [HyperFrames](https://github.com/heygen-com/hyperframes) | Apache-2.0 | A rival HTML renderer. Reference only for ideas (hand-drawn boil, callouts, ink-bleed reveals). Six assets have unconfirmed origin. The walking mascot's Lottie file has no stated author. |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | MIT for core, 2d and ui. The ffmpeg exporter is GPLv3 on main. | Draws to canvas, not SVG. No headless render. No release since Feb 2025. A GPL move was proposed in 2024 and postponed. Reference for timeline and tween style. |
| [Revideo](https://github.com/midrender/revideo) | MIT | Replaces Remotion rather than plugging in. Sends anonymous telemetry unless `DISABLE_TELEMETRY=true`. Only if we ever leave Remotion. |

## 4. Licence traps

### Conditions on tools we already use

- **Remotion License.** Free for an individual, a for-profit with up to 3 employees, or a non-profit. Commercial video is allowed.
  - Headcount includes part-time staff and contractors, and adds up if others work on the same codebase.
  - At 4 or more people a Company License is needed. Creators costs $25 per seat per month. Automators costs $0.01 per render with a $100 monthly minimum. Enterprise starts at $500 a month.
  - **AK should confirm which group the channel falls into.**
  - Remotion 5.0 will change the licence. Stay on 4.0.x and re-read it before upgrading.
  - It does not cover codec patents (H.264, AAC). That is an existing issue for the whole pipeline.
  - The v5.0 Terms say Remotion puts no restrictions on the videos it makes.

### Do not use as-is (the six the skeptic refuted)

| Item | Problem | What would unlock it |
|---|---|---|
| [@remotion/transitions](https://www.remotion.dev/docs/transitions/presentations/custom) | npm metadata says `UNLICENSED` in every version checked. No LICENSE file in the package. Remotion clearly intends its own licence to apply, but it is not written there. Not installed in our repo. | Ask Remotion to confirm. Or write our own wipe from MIT `@remotion/shapes` and `@remotion/paths`. |
| [chart.xkcd](https://github.com/timqian/chart.xkcd) | Code is MIT. The built-in font is CC BY-NC 3.0, confirmed in the font's own name table. It is injected into every chart and no option turns it off. | Copy only the wobble filter idea. Do not ship its dist file. |
| [DataMeet maps](https://github.com/datameet/maps) (**already used by our `build_geo.py`**) | The repo contradicts itself: CC BY 4.0 in the README, CC BY 2.5 India on the project site, CC BY-SA 2.5 before Jan 2021. Its States layer was scraped from the Election Commission's site. Survey of India's copyright policy requires written permission to reproduce its website material. The repo's last commit was May 2022. | AK decides. Options: pin a commit and use only States/Admin2 or `india-composite` (CC0 upstream per HDX). Or redraw the outline from a clearly licensed source. Or get written permission from Survey of India. |
| [Natural Earth](https://github.com/nvkelso/natural-earth-vector) | Public domain by the authors' declaration. The maintainer said in 2009 that the assurance is stated for the US only, and that three admin-1 columns depend on GADM, which forbids commercial use. No resolution found. Its default borders also do not follow the Survey of India outline. | Use geometry and names only. Drop `type_en`, `validfr`, `validto` and `gadm_level`. Check borders against Survey of India. |
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) | No LICENSE file ever. Only a README sentence saying MIT, with no copyright holder. Issue #3 asking for a real LICENSE is open. Three files hotlink Unsplash and Pexels photos. | A real LICENSE file merged. Until then, reference only. |
| [RenderComp rigging guide](https://rendercomp.com/blog/character-animation-remotion-guide/) | The article has no licence and says it is AI-drafted. Its code snippets are not licensed for copying. | Re-implement the technique ourselves. |

### Share-alike, non-commercial or copyleft

- **[OpenMoji](https://github.com/hfg-gmuend/openmoji):** art is CC BY-SA 4.0. Excluded by our rule.
- **DataMeet `india-soi.geojson` and `india-osm.geojson`:** share-alike (CC BY-SA 2.5, ODbL).
- **mickeykedia/India-Maps:** CC BY-NC-SA 3.0 per search results (not opened).
- **[anything2explainer](https://github.com/Vincentwei1021/anything2explainer):** PolyForm Noncommercial 1.0.0 (read on the repo page). The same author's video-talkcraft and other "skill" repos show no clear licence.
- **udit-001/india-maps-data:** README says "personal usage".
- **api.dicebear.com** (the hosted service): free for non-commercial use only.
- **FLUX klein-9B and Qwen-Image-2.1** (opt-in models in the video toolkit): non-commercial or research only.
- **Rive Student plan:** non-commercial.
- **[OpenMontage](https://github.com/calesthio/OpenMontage) and OpenChatCut:** AGPL-3.0. Ideas only, no code.
- **Samarth-2561/india-svg-map:** GPL-3.0.

### Paid, restricted or unclear

- **Spine:** every user of a product built with the runtimes needs their own Spine Editor licence.
- **unDraw:** forbids packs, redistribution, scraping and AI/ML use. A few hand-downloaded pieces are fine. Do not vendor a bulk copy.
- **Illlustrations.co:** only the legacy CC0 packs are free. Premium assets bar public repos, and our repo is public.
- **Envato, Adobe Stock and Mixkit ink packs:** paid stock or Premiere/After Effects templates.
- **Avataaars and Bottts** (and Neutral variants): "free for personal and commercial use" on the artist's own terms. We could not read them.
- **frycz/skeleton-rig:** no licence stated.
- **Tanmay53 India geojson:** Apache-2.0 file, but the data's original owner is not stated.
- **datta07/INDIAN-SHAPEFILES and gautamdoulani/India:** no licence shown.
- **MoneyPrinterTurbo:** bundled songs and fonts (Microsoft YaHei, STHeiti) have no licence.
- **Storyset, Blush, Vecteezy and Freepik free tiers:** terms not read, and they normally need attribution.
- **Free SFX packs on itch.io and Gumroad with no licence statement, and Mixkit and Pixabay SFX:** unverified.
- **Lottie files:** each has its own licence. LottieFiles' Simple License says modified files must stay under the same licence.

### Usable with credit (not traps)

- DiceBear's CC BY 4.0 styles.
- Rive Marketplace files (CC BY 4.0).
- game-icons.net (CC BY 3.0). These are black-and-white game glyphs, so not shortlisted.
- OpenGameArt "Slide whistle down" (CC BY 3.0, not CC0).

### Skipped for fit, not licence

- DragonBonesJS: a Pixi bitmap-skeleton player. Its editor and sample art licences are unverified.
- wawa-lipsync: live-browser only, so no per-frame render.
- Manim: Python and Cairo, outputs MP4.
- short-video-maker: stock-footage pipeline, stale since 2025.

## 5. Honest gaps (we must draw these ourselves)

- **The whole look.** No Remotion kit ships flat puppet characters, speech bubbles, bar props and maps together.
- **A rigged full-body flat character** (separate mitten hands, jaw, dot eyes) under a clear free licence. Kenney is the closest, but unseen. Open Peeps is CC0 but whole figures.
- **Rubber-hose limbs and IK.** RigLab (MIT) exists but is 15 days old, has 0 stars and has no player package. We write a small two-bone IK helper.
- **Speech bubbles and callouts.** The only MIT React one is from 2017. Remotion's `@remotion/shapes` has a Callout (MIT per the standalone page). We did not open its licence file.
- **Pictogram and unit-chart icon arrays** (bottles, dollar stacks, people). Nothing maintained and clearly licensed. Build a grid of SVG `<use>` icons driven by `spring()`.
- **Indian kirana shops, streets, autos and bus stands.** Only paid or restrictive stock turned up. Server rooms and factories are also empty.
- **A liquid or ink slash wipe.** No polished open asset. Draw it as an SVG clip path or mask.
- **Particle bursts driven by frame number.** `canvas-confetti` (ISC) and `tsParticles` (MIT) are safe to use but run on a clock, not on frames. Write a small burst with Remotion's `random()`.
- **A cleanly licensed India state outline.** See DataMeet and Natural Earth above. Two leads were not examined: geoBoundaries (CC BY 4.0) and urbanmorph/geodata (per-layer licences).
- **Verified CC0 whoosh, pop and stinger sounds.**
- **Remotion map examples** use MapLibre tiles with their own licences. A flat d3-geo map avoids that.

## 6. Recommended plan for Data Kadai

Build on the Remotion SVG pilot. Draw the art, borrow only techniques. The new look applies to new videos only unless you ask for a rebuild.

1. **Cheapest first: hand-drawn accents.** `@remotion/rough-notation` is already installed. Add a Circle or Underline around one big-number badge in the pilot. Use a fixed seed. Change the seed every couple of frames for a "boiling line" feel. No new install, no cost.
2. **Settle the map data (your decision).**
   - Log the DataMeet provenance risk.
   - Pin `build_geo.py` to a commit instead of `master`.
   - Use only States/Admin2 or `india-composite`.
   - Fix the credit line: add the dataset name and links, and do not print "as per Government of India" until it is verified.
   - Decide whether to redraw the outline or ask Survey of India.
3. **Original mascot rig, drawn by us.**
   - **Structure:**
     - Build parts as nested SVG groups with pivot points, driven by a pose object.
     - Put mitten hands and dot eyes in the parts.
     - Add idle breathing and seeded blinks every 3 to 5 seconds.
     - Add the two-bone IK helper for arms.
   - **Look:** Offer 2 or 3 mascot sketches. The look is your taste call.
   - **References:** Use FireAmun, PUP, OpenMascot and shining-rig for technique only. Use Open Peeps and Kenney only for pose and part breakdown. No art copied, so no licence ties the mascot.
4. **Lip sync.**
   - Convert the MiniMax voice to WAV with ffmpeg.
   - Run Rhubarb once per beat with the script text, in the same build step as mlx-whisper.
   - Draw 6 to 9 of our own mouth shapes and switch them by frame.
   - Hold a neutral mouth on Sarvam Tamil words, or try the `phonetic` recogniser.
   - Test the macOS build on the Mini first.
5. **Indian sets.** Draw layered flat scenes in code: kirana shop, street, auto, bus stand. Use Fluent and Noto emoji as small icons if needed, with notices kept.
6. **Chart devices.** Build the bottle and dollar-stack icon arrays, big-number counters, name plates and pills. Draw the white speech bubble as an SVG path with a tail. Read the `@remotion/shapes` licence file before using its Callout.
7. **Ink slash wipe.**
   - **Build:**
     - Draw it as an SVG clip path on the entering scene.
     - Sequence the overlapping scenes ourselves, or use only MIT `@remotion/shapes` and `@remotion/paths`.
     - Skip `@remotion/transitions` until Remotion confirms its licence.
   - **Rules:** Keep scenes at 2.5 to 4 seconds and wipes short. A custom transition overlaps its neighbours and cannot be longer than either scene.
8. **Sound effects and a licence log.**
   - Collect 5 to 10 whoosh, pop and click sounds. Use Freesound's CC0 filter only.
   - Check Kenney's own licence page before using FireAmun's five clips.
   - Keep one file listing each asset's source URL, licence and the date read.

**For AK to confirm:**
- Remotion headcount (3 or fewer including contractors, or a Company License).
- The map-data route.
- The mascot look.