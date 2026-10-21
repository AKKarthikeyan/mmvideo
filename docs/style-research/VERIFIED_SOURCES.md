# Verified sources for the channel style

Every source below was found by a search agent and then checked by a second agent that tried to refute it.
The checker read the LICENSE file in the repository or package itself and tested that the files download from our container.
A source is **kept** only when the licence allows commercial use and the files are reachable.
The ranked recommendation is in [STYLE_RESEARCH_GITHUB.md](../STYLE_RESEARCH_GITHUB.md).

## Indian art styles, patterns and fonts

### Kept

- **Mithila: Tree of Life (seeded Madhubani-inspired tree generator)** (starphazed/mithila-tree-of-life)
  - Licence: MIT, from /LICENSE (standard 21-line MIT text with no added clauses). docs/LICENSING.md and package.json ('license': 'MIT', 'private': true) agree. THIRD_PARTY_NOTICES.md: Mulberry32 and FNV-1a are CC0.
  - Credit: none in the video. Keep the MIT notice 'Copyright (c) 2026 starphazed' and THIRD_PARTY_NOTICES.md in our source tree next to any ported modules.
  - Watch out: None bundled. THIRD_PARTY_NOTICES: 'The application has no bundled third-party runtime packages, fonts or image assets.' Reference paintings, including Ranjan Paswan's 'Tree of life with Krishna', are linked in docs/REFERENCES.md and not bundled. No figure or deity drawing is in dist/js: the only motif families are lotus, peacock and fish, plus small perched birds.
  - Reachable: git ls-remote https://github.com/starphazed/mithila-tree-of-life HEAD -> b8611a51 (refs/heads/main). raw LICENSE, README.md, docs/LICENSING.md, THIRD_PARTY_NOTICES.md and package.json -> 200. Shallow clone OK (4.3 MB, last commit 2026-10-17). dist/js has 20 ES modules, 125,551 bytes. Not on npm.
  - Verdict: Claim holds. The MIT licence is confirmed from the repository files, it is reachable, and the quality is the best in this angle. It is limited to tree compositions with one repeated layout, so treat it as the tree, verse-border and title-card engine, not a whole visual system.
- **{Shan, Shui}* procedural ink-landscape engine** (LingDong-/shan-shui-inf)
  - Licence: MIT, from /LICENSE (standard text). The README has no other licence terms.
  - Credit: none (keep the MIT notice in source if code is ported)
  - Watch out: index.html line 89 has a Perlin noise block marked '//https://raw.githubusercontent.com/processing/p5.js/master/src/math/noise.js'. p5.js is LGPL-2.1 (npm view p5 license -> 'LGPL-2.1'). Rendered video frames are not a distribution of that code, but when porting, replace the noise with our own or an MIT/ISC implementation so our TS source stays clean. No image or font assets.
  - Reachable: git ls-remote https://github.com/LingDong-/shan-shui-inf HEAD -> 9f754d2b (master). raw LICENSE and README -> 200. Shallow clone has index.html (126 KB) and screenshots/screen001.jpg and screen002.jpg. Last commit 2018-12-10.
  - Verdict: The licence is verified and the files are reachable. The technique is premium and fits the river, empty-Kurukshetra and establishing-shot scenes. Keep it as an engine to re-skin, not to use as is. Replace the p5.js-derived noise when porting.
- **Muggula Prastaram: kolam/muggu enumeration and SVG stroke renderer** (saahily/muggula-prastaram (npm @muggula-prastaram/core and @muggula-prastaram/render))
  - Licence: MIT, from the repo /LICENSE and from package/LICENSE inside both npm tarballs. The README '## License' section says 'MIT'.
  - Credit: none
  - Watch out: none. The npm tarballs contain only dist JS, .d.ts files, README and LICENSE. The render package's only dependency is core.
  - Reachable: git ls-remote https://github.com/saahily/muggula-prastaram HEAD -> 581e4e7e (main). npm view: both packages are 0.2.1, MIT, modified 2026-07-23. npm pack and extraction of both succeeded. Shallow clone has packages/core/src (TS) with tests and CI workflow.
  - Verdict: The claim holds. The licence is verified, it is a TS library on npm, and it is the best Remotion fit for title cards and line-drawing transitions. It is ornament only, not illustration.
- **Kolam-Maker (sikku kolam generator with powder texture)** (evoluteur/kolam-maker (npm kolam-maker 1.0.0))
  - Licence: MIT, from /LICENSE and from package/LICENSE in the npm tarball. The README says 'Kolam-Maker is open source at GitHub with MIT license.'
  - Credit: none
  - Watch out: css/themes/*/bg0.png and spirals.png come from the same author's omg-themes (synced by scripts/sync-omg-themes.sh). They are UI only and not needed.
  - Reachable: git ls-remote https://github.com/evoluteur/kolam-maker HEAD -> 826cb2f4 (main). npm view kolam-maker -> 1.0.0, MIT, modified 2026-10-04. npm pack succeeded. The tarball is the whole web app (index.html, sw.js, js/kolam.js of 612 lines, css), not a library.
  - Verdict: The licence is verified and it is reachable. Keep it as secondary to Muggula: copy the powder filter and earth palettes, not the app code.
- **Tiro Devanagari Sanskrit / Hindi** (npm:@fontsource/tiro-devanagari-sanskrit and @fontsource/tiro-devanagari-hindi (upstream TiroTypeworks/Indigo))
  - Licence: OFL 1.1, from package/LICENSE in the npm tarball and from the upstream Indigo /LICENSES.txt and /source/OFL.txt.
  - Credit: none
  - Watch out: Indigo LICENSES.txt: 'The contents of the \third-party folder are NOT licensed for any use outside of the Indigo repo.' This does not affect the Fontsource woff2 files.
  - Reachable: npm view: both packages are 5.3.0, OFL-1.1. npm pack succeeded. The files are devanagari, latin and latin-ext subsets at 400 normal and 400 italic only, with no bold. 400.css devanagari unicode-range includes U+1CD0-1CF9 and U+A8E0-A8FF. git ls-remote TiroTypeworks/Indigo HEAD -> bb6971bd. The upstream tree has no compiled fonts (the README says builds are on the Releases page).
  - Verdict: Verified OFL and reachable offline from npm. It is the best verse-card text face.
- **Devanagari display and body faces via Fontsource (Rozha One, Eczar, Gotu, Amita, Noto Serif Devanagari, Sahitya, Martel; avoid Yatra One and Kalam)** (npm:@fontsource/rozha-one, @fontsource/eczar, @fontsource/gotu, @fontsource/amita, @fontsource-variable/noto-serif-devanagari, @fontsource/sahitya, @fontsource/martel)
  - Licence: OFL 1.1. I read package/LICENSE inside the tarballs for rozha-one, eczar, gotu and noto-serif-devanagari (variable). The others are OFL-1.1 by npm view.
  - Credit: none
  - Reachable: npm view returned version 5.3.0 and license OFL-1.1 for rozha-one, eczar, gotu, amita, noto-serif-devanagari (variable), sahitya, martel, yatra-one, kalam, cormorant-garamond and eb-garamond. npm pack and extraction succeeded for rozha-one (3 woff2), eczar (25), gotu (4) and noto-serif-devanagari variable (9).
  - Verdict: Licences are confirmed from the package files and the packages are reachable.
- **Shobhika (Devanagari for scholars, Vedic accents)** (Sandhi-IITBombay/Shobhika)
  - Licence: OFL 1.1, from /OFL.txt in the repo. The OTFs in the release zip embed the OFL 1.1 string in their name table.
  - Credit: none
  - Reachable: The searcher's 'blocked' claim is refuted. The releases HTML page and api.github.com return 403, but the direct asset URL works: curl -L https://github.com/Sandhi-IITBombay/Shobhika/releases/download/v1.05/Shobhika-1.05.zip -> 200, 524,752 bytes, a valid zip (sha256 5590e88e...a9f438) containing Shobhika-1.05/Shobhika-Regular.otf (368,156 B) and Shobhika-Bold.otf (350,680 B). git ls-remote shows tags v1.03 to v1.05. It is not on npm.
  - Verdict: Licence verified and the files are reachable after all, through the direct release-asset URL. Pin that URL and the sha256. Useful as the bold or Vedic-accent fallback next to Tiro, which has no bold.

### Dropped

- **Nonflowers (procedural gongbi botanical paintings)** (LingDong-/nonflowers). The licence is fine, but it serves none of the required scenes without writing a new plant grammar, and its idiom is Chinese. Use it as a technique reference for translucent petals and paper grain at most, not as a channel asset.
- **@vibzart/sri-yantra** (vibzart/sri-yantra (npm @vibzart/sri-yantra)). Rejected: the provenance of the coordinates is unclear (possibly CC BY-SA), the packaging is sloppy, the output is buggy, and the theology is off-scope. If a yantra beat is ever needed, compute our own construction (about 100 lines).
- **Islamic-Patterns (girih/star lattice generator)** (evoluteur/islamic-patterns). The licence is fine, but Indo-Islamic star geometry fits none of the listed Gita or Upanishad scenes and risks misreading as Islamic art in a Hindu-scripture context. A square-grid floral jali is better coded ourselves.
- **Pahari Scroll** (bhattji007/pahari-scroll). No licence means all rights reserved. It could serve as a technique reference only if the author grants a licence.
- **Scrawl / Motifs** (Uttambakori/scrawl). Confirmed unlicensed and a commercial product.
- **Fourier Border Studio** (JishanAich/bordergen). Confirmed unlicensed. Re-derive the Fourier-motif idea ourselves if wanted.
- **KALA: Warli x Kalamkari palampore** (krishkavin7512/Kala-Indian-Art). Confirmed all rights reserved.
- **Sanatan procedural Dravidian temple** (mani-4444/temple-3d). Confirmed unlicensed.
- **Unlimited Indonesian Art** (mukhayyar/unlimited-indonesian-art). The licence is fine, but the visible output is crude and sparse, and the subject is Javanese. Its only value is as a basic seeded-SVG-scroll template, which shan-shui-inf provides better.
- **EZ-Tree** (dgreenheck/ez-tree (npm @dgreenheck/ez-tree)). The licence is fine but the visual language clashes with every direction in this angle. Reconsider only if the channel deliberately chooses a 3D look.
- **@yantrakit/vedic-icons (REJECT)** (npm:@yantrakit/vedic-icons (yantrakitinc/package.yantrakit.vedic-icons)). Rejection confirmed: the MIT label is laundered from Flaticon, and the set contains deity icons.

### Found by the checker

The checker added these and checked their licences the same way. Each note says whether it recommends the source.

- Annapurna SIL (Devanagari text face with a real bold weight), npm @fontsource/annapurna-sil 5.3.0 (upstream silnrsi/font-annapurna). Licence is OFL 1.1, read from package/LICENSE: 'Copyright (c) 2007-2023 by SIL International ... licensed under the SIL Open Font License, Version 1.1.' npm pack succeeded and the package ships devanagari, latin and latin-ext subsets at 400 and 700. Its devanagari unicode-range includes U+1CD0-1CF9 and U+A8E0-A8FF, but I did not verify the actual Vedic glyph coverage. It is plainer than Tiro, so it is a dependable bold or fallback for verse cards and Hindi-track titles.
- Smithsonian Open Access, National Museum of Asian Art / Freer-Sackler Indian paintings (Mughal, Pahari, Rajput), metadata repo Smithsonian/OpenAccess. The repo LICENSE is 'CC0 1.0 Universal', and the record I sampled ('Lovers on a terrace with three musicians') has usage.access 'CC0'. The images are NOT on GitHub, and ids.si.edu is blocked by the proxy. They ARE reachable from the AWS open-data bucket: curl -sI https://smithsonian-open-access.s3-us-west-2.amazonaws.com/media/fs/FS-F1907.232_002.jpg -> 200, and ?list-type=2&prefix=media/fs/ listing works. Metadata shards are at metadata/edan/nmaa/00.txt to ff.txt (about 115 KB each). Caveats: files are huge (80-140 MB JPEG, 240-380 MB TIFF), and most Indian paintings show deities and faces, which breaks the house rules. Use only crops of landscape, architecture, animals, textiles and borders, slow-panned. This probably overlaps with the museum angle. No credit is required; a courtesy credit would be 'National Museum of Asian Art, Smithsonian (CC0)'.
- Checked and NOT recommended, listed for completeness: evoluteur/mandala-maker and evoluteur/sacred-geometry (both MIT, LICENSE 'Copyright (c) 2026 Olivier Giulieri', git ls-remote OK). Mandala-maker presets are flat pink, gold and blue fills that look like clip-art. Sacred-geometry is generic New Age (vesica piscis, flower of life, Metatron's cube) in thin gold on navy. It is trivial to code ourselves and not specific to Vedanta.

## Illustration and icon libraries

### Kept

- **PhyloPic silhouette snapshot (phylopic-tools)** (eweitz/phylopic-tools)
  - Licence: There is no LICENSE file in the repo (raw .../master/LICENSE returns 404), so query.py and download.py cannot be reused. The images carry per-image licences in images_metadata.json, which I downloaded and parsed: 1,991 rows, by-sa 653, by 458, zero 457, mark 210, by-nc 140, by-nc-sa 73. That matches the claim exactly. The README says you can filter with '--license "zero,mark"'. The 'by' rows do not record a CC version.
  - Credit: For each 'by' image used: "Silhouette: <credit field> via PhyloPic, CC BY". Example: "Przewalski's horse silhouette by Mercedes Yrayzoz (vectorized by T. Michael Keesey) via PhyloPic, CC BY". The zero and mark rows need no credit.
  - Watch out: Every image has its own licence. 213 rows are NC (by-nc and by-nc-sa) and must be excluded, and 653 by-sa rows should also be avoided. The repo has no licence for its code.
  - Reachable: git ls-remote returned HEAD 09c0243 (last commit 2017-03-20). A blobless clone lists 1,980 SVGs. curl raw .../images/bos-primigenius-indicus.svg returned 200 (15 KB). 15 metadata rows have no SVG file, including anatidae, anserinae, charadriidae and erithacus.
  - Verdict: The licence is confirmed per image, as long as the whitelist is limited to 'zero', 'mark' and (with credit) 'by'. One correction to the searcher: 'Corvus corax' is CC-BY (Derek Bakken and T. Michael Keesey). The CC0 raven is the separate file 'corvus-(corax)' by Steven Traver. Other licences I confirmed: zebu bos-primigenius-indicus is zero (T. Michael Keesey), columba-livia is zero (Steven Traver), anser is zero (Ferran Sayol), equus-+-orohippus is zero, equus-+-mesohippus is mark (Heinrich Harder), and equus-ferus-przewalskii is by. These are the best anatomically credible, faceless, single-colour shapes in this angle, and they suit a shadow-play look. The horses are weak: a stocky Przewalski and prehistoric-looking equids. Expect to hand-build or source a noble horse for the chariot.
- **Noto Emoji monochrome (variable font)** (google/fonts (ofl/notoemoji/NotoEmoji[wght].ttf))
  - Licence: ofl/notoemoji/OFL.txt reads 'Copyright 2013 Google LLC. This Font Software is licensed under the SIL Open Font License, Version 1.1.' METADATA.pb has license: "OFL" and filename "NotoEmoji[wght].ttf".
  - Credit: none (an optional 'Noto Emoji, SIL OFL 1.1' credit is courteous)
  - Reachable: curl raw.githubusercontent.com/google/fonts/main/ofl/notoemoji/NotoEmoji%5Bwght%5D.ttf returned 200, 1,982,596 bytes.
  - Verdict: The licence is clean, and rendering the glyphs into video is ordinary font use under OFL. Extracted outlines used as artwork are also fine, because OFL only restricts redistributing the font itself. Use it for accent stamps only, and whitelist the glyphs. The diya (1FA94), lotus (1FAB7), Hindu temple (1F6D5), Om and solid meditator (1F9D8) are good. The bird, snake and horse are cartoonish with a cute look and should not be used. The salt glyph is a shaker.
- **Tabler Icons + Lucide (stroke-based line icons)** (npm:@tabler/icons (3.49.0, MIT) + npm:lucide-static (1.61.0, ISC))
  - Licence: The tarball LICENSE files read 'MIT License Copyright (c) 2020-2026 Paweł Kuna' (Tabler) and 'ISC License Copyright (c) 2026 Lucide Icons and Contributors' (Lucide). Each Lucide SVG header carries '@license lucide-static v1.61.0 - ISC'.
  - Credit: none
  - Reachable: npm view gave @tabler/icons 3.49.0 MIT and lucide-static 1.61.0 ISC. npm pack worked for both. The SVGs have fill='none' stroke='currentColor' stroke-width='2', so they are true strokes.
  - Verdict: This is the right source for hairline draw-on ornaments on title and verse cards, because the strokes can be animated. The searcher missed that Tabler has outline/om.svg and outline/yoga.svg, alongside horse, candle, campfire, flame, bowl and feather. Lucide confirmed: bird, tree-deciduous, flame, shell, moon-star, sunrise, sunset, mountain, sparkles and leaf. Use them as small symbols only. At full frame they still look like app icons.
- **Phosphor Icons core** (npm:@phosphor-icons/core (2.1.1))
  - Licence: The tarball LICENSE reads 'MIT License Copyright (c) 2023 Phosphor Icons'.
  - Credit: none
  - Reachable: npm view gave 2.1.1 MIT. npm pack worked. assets/ has bold, duotone, fill, light, regular and thin, with 1,512 SVGs per weight.
  - Verdict: The licence is confirmed. I also confirmed the searcher's technical caveat: flower-lotus-thin.svg is '<svg ... fill="currentColor"><path d=...>', an outlined filled path rather than a stroke, so it cannot be animated as a draw-on line. Useful for small static glyphs (flower-lotus, horse, hands-praying, moon-stars). It overlaps heavily with Tabler, so pick one line family to keep the look consistent.
- **Font Awesome Free (icons)** (npm:@fortawesome/fontawesome-free (7.3.1))
  - Licence: The tarball LICENSE.txt says '# Icons: CC BY 4.0 License ... applies to all icons packaged as SVG and JS file types', with fonts under SIL OFL 1.1 (Reserved Font Name 'Font Awesome') and code under MIT. npm license field: '(CC-BY-4.0 AND OFL-1.1 AND MIT)'.
  - Credit: "Icons: Font Awesome Free by Fonticons, Inc. (fontawesome.com), CC BY 4.0"
  - Watch out: The SVG icons are CC BY 4.0, the font files OFL 1.1 and the JS/CSS MIT.
  - Reachable: npm view gave 7.3.1. npm pack worked. svgs/solid contains gopuram.svg, om.svg, dharmachakra.svg, lotus.svg, spa.svg, horse.svg, dove.svg, person-praying.svg and hands-praying.svg.
  - Verdict: Only gopuram, om and dharmachakra are worth having, because no other clean-licensed set has a South Indian gopuram. Use them as stamped motifs or tiny accents. The shapes are chunky and logo-like, and the SVG icons need a CC BY 4.0 credit.
- **Material Symbols (SVG packages)** (npm:@material-symbols/svg-400 (0.48.1))
  - Licence: The tarball LICENSE is 'Apache License Version 2.0, January 2004'. npm license is Apache-2.0.
  - Credit: none
  - Reachable: npm view gave 0.48.1 Apache-2.0, published 2026-10-21. npm pack worked. outlined/ has temple_hindu.svg, self_improvement.svg, spa.svg and candle.svg, each with a -fill variant, plus rounded/ and sharp/ folders.
  - Verdict: The licence is clean. temple_hindu and self_improvement (a faceless meditator) fill small-glyph gaps. They are unmistakably Google UI, so use them for markers only.
- **lindenmayer (2D L-system generator)** (npm:lindenmayer (1.5.4) / github nylki/lindenmayer)
  - Licence: The LICENSE in nylki/lindenmayer (master and main) reads 'The MIT License (MIT) Copyright (c) 2015-2016 Tom Brewe'. npm license is MIT.
  - Credit: none
  - Reachable: npm view gave 1.5.4 MIT, last published 2022-06-19. git ls-remote returned HEAD 94939c5, last commit 2024-07-03. Not executed.
  - Verdict: The licence is confirmed. It is a pure-JS, seeded rule engine, so trees, roots, and the inverted ashvattha are generated in our own style rather than imported. Quality depends entirely on our rules and the tapered-stroke renderer. Out-of-the-box examples look like textbook fractals.
- **EZ-Tree (procedural 3D trees for three.js)** (npm:@dgreenheck/ez-tree (1.1.0) / github dgreenheck/ez-tree)
  - Licence: The LICENSE reads 'MIT License Copyright (c) 2024 Daniel Greenheck', and npm says MIT. On GitHub HEAD (2026-07-16), src/app/public/textures/LICENSE.md says the bark textures come from ambientcg.com under CC0 1.0. It also says 'The leaf textures in leaves/ ... are licensed under the project's own license', which is the author's own claim with no stated origin.
  - Credit: none (optional courtesy: 'Bark textures: ambientCG, CC0')
  - Watch out: npm 1.1.0 bark textures and the leaf PNGs have no stated source. The demo-app font dumbeldor.ttf and the audio are of unknown licence, so do not use src/app/*.
  - Reachable: npm view gave 1.1.0 MIT, published 2026-01-15, with peerDependency three>=0.167. npm pack worked (93 files). git ls-remote returned HEAD dcf309b. Not executed.
  - Verdict: Keep it only if the channel adopts @remotion/three, which needs WebGL (ANGLE or SwiftShader) in the headless render. The geometry code is MIT, and for a silhouette render you need only the geometry and a leaf alpha map. Caveat that refutes part of the claim: the npm 1.1.0 tarball ships different bark textures (src/lib/assets/bark/birch/oak/pine/willow_*.jpg) with no provenance note. It also ships the demo app's src/app/public/dumbeldor.ttf, a font of unknown licence, and ambience.mp3. Use the GitHub HEAD textures, which have a documented CC0 source, or no textures, and never ship anything from src/app. The presets are Western species only (ash, aspen, oak, pine, bush), so there are no banyan aerial roots without custom work.

### Dropped

- **game-icons.net** (game-icons/icons (also npm:@iconify-json/game-icons 1.2.4)). The licence is fine, but the look is wrong. These are chunky fantasy-RPG stamps. The chariot (cathelineau) and tarot chariot are crude pictograms, tree-roots is a cartoon stump, and lorc/meditation has a mask-like face. The set would undercut the move away from 'childish', and each icon used adds an author credit. Phosphor, Tabler, Font Awesome and Material cover the same symbols more cleanly.
- **Noto Color Emoji 2D SVG + Noto 3D PNG set** (googlefonts/noto-emoji). The licence is OK (Apache for the 2D SVGs, OFL for the rest), but the look is wrong. Glossy, saturated emoji with smiling faces on people (the 1F9D8 meditator has a face) read as kids' edtech or stickers. The salt is a shaker. It does not fit a calm philosophy channel and breaks the faceless rule for people.
- **Microsoft Fluent Emoji** (microsoft/fluentui-emoji). The licence is confirmed MIT, but the style is wrong: toy-like Teams-sticker emoji, people with faces, 3D PNGs limited to 256px, and genie and angel figures in the set. It would reinforce the 'childish' complaint.
- **vintageart: public-domain ornaments traced to SVG** (WelshPixie/vintageart). The licence is clean, but the content is off-theme: Victorian Western seed-catalogue and Art Nouveau ornament, some with publisher text baked in. Too sparse and too European for an Indian scripture channel. At most a source of engraving texture.
- **Twemoji (maintained fork)** (jdecked/twemoji). The licence is fine with a credit, but this is flat, childish emoji with faces on people, which is exactly the look the owner is rejecting.
- **OpenMoji** (hfg-gmuend/openmoji). BY-SA allows commercial use, but ShareAlike would bind any adapted version of the art, and SA is not on the house whitelist. The look (thick black outline with flat fill) is also the one already rejected.
- **Open Peeps (npm builder and DiceBear style)** (npm:@opeepsfun/open-peeps (1.0.6) / github opeepsfun/open-peeps; npm:@dicebear/open-peeps (9.4.2)). The artwork is CC0, confirmed through DiceBear's LICENSE. But the style is casual startup doodle with drawn faces and Western streetwear, the wrong register and close to the rejected look.
- **unDraw (via wrappers and mirrors)** (npm:react-undraw-illustrations (2.0.3) / github cuuupid/undraw-illustrations). The licence chain is unreliable because the mirror relabels third-party art as MIT. The look is also corporate SaaS clip-art with no relevant subjects.
- **Kenney asset mirror** (ETdoFresh/kenney.nl). CC0 is fine, but this is candy-coloured casual-game art in the wrong tone. At most a source of neutral cloud shapes.
- **Kannada Icons (Karnataka heritage set)** (maguireharry/kannada-icons). An MIT label over AI-generated rasters and remakes of film and song posters cannot be trusted. The poster rights belong to third parties, and the AI imagery conflicts with house policy. The vectors are cruder than the current kit, and there is a deity and idol risk in the temple packs.
- **CC-lineart (ink + watercolour SVG recipe)** (aa2246740/CC-lineart). The licence is fine, but the motifs (mug, book, lightbulb) are irrelevant. The thick wobbly ink outline is the rejected look. Only the idea of an feTurbulence watercolour wash is worth reimplementing ourselves, and that needs no dependency.

### Found by the checker

The checker added these and checked their licences the same way. Each note says whether it recommends the source.

- ofrohn/d3-celestial (npm d3-celestial 0.7.35), BSD-3-Clause. LICENSE: 'Copyright (c) 2015, Olaf Frohn', standard BSD-3 text. It provides real sky data to build night-sky scenes in our own style: data/stars.6.json has 5,044 stars to magnitude 6 keyed by Hipparcos number with magnitude and B-V colour (for star tint), data/mw.json has 5 nested Milky Way outline polygons, plus constellation lines and boundaries. Project with d3-geo and draw in SVG or canvas inside Remotion. Tested: git ls-remote OK (last commit 2022-07-05), raw stars.6.json, mw.json and starnames.json all downloaded. Suggested credit: 'Star data: d3-celestial (c) Olaf Frohn, BSD-3-Clause'.
- nvkelso/natural-earth-vector, public domain. LICENSE.md: 'Everything here is public domain ... No permission is needed to use Natural Earth. Crediting the authors is unnecessary.' Use it for locator and journey maps (Kurukshetra, Ganga and Yamuna, pilgrimage rivers) drawn in our own style. Tested: raw geojson/ne_10m_rivers_lake_centerlines.geojson returned 200 (7.3 MB) and ne_50m_admin_0_countries.geojson returned 200. IMPORTANT for the India audience: use India's point-of-view boundaries in geojson/ne_10m_admin_0_countries_ind.geojson (present in the repo), or show no national borders at all. The default world file shows de facto borders that differ from India's official map.
- Devanagari display and text fonts from google/fonts, all with ofl/<family>/OFL.txt returning 200 and METADATA.pb license "OFL": Tiro Devanagari Sanskrit (ofl/tirodevanagarisanskrit, upright and italic, designed for Sanskrit), Noto Serif Devanagari (variable wdth/wght), Eczar (variable), Rozha One, Gotu, Martel, Yatra One, Amita. Also on npm, e.g. @fontsource/tiro-devanagari-sanskrit 5.3.0 and @fontsource/eczar 5.3.0, both OFL-1.1. For verse and title cards, good Devanagari type will do more for a 'professional' look than any icon set. Credit: none required.
- WARNING, a trap rather than a candidate: the three.js repo (MIT) ships examples/models/gltf/Horse.glb (raw returned 200, 181 KB), Flamingo.glb, Parrot.glb and Stork.glb, credited 'model by mirada from rome'. dataarts/3-dreams-of-black deploy/files/models/LICENSE.txt states: '3D assets and textures for ROME "3 Dreams of Black" ... are licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0'. These animated animals are NonCommercial and must not be used, despite three.js's MIT licence.

## Painterly and cinematic rendering

### Kept

- **p5.brush (standalone WebGL2 build)** (acamposuribe/p5.brush (npm:p5.brush))
  - Licence: MIT. Read from raw.githubusercontent.com/acamposuribe/p5.brush/main/LICENSE.md. package.json on GitHub (2.2.4) and npm (2.2.3) both say MIT. The README's License section says the same.
  - Credit: none
  - Watch out: npm lists p5 ^2.2 as a peerDependency, and p5 is LGPL-2.1. npm 7+ installs peer dependencies automatically, so p5 will land in node_modules. The standalone dist/brush.esm.js has no imports, so it does not load p5, and LGPL does not reach rendered video. The runtime dependency simplex-noise is MIT. The only image is example/brush_tips/brush.jpg, which has no separate licence and is not needed.
  - Reachable: git ls-remote: HEAD is main at 43ac6d5. curl raw LICENSE.md, README.md and package.json all returned 200. `npm pack p5.brush@2.2.3` worked. The dist has `export{... seed as V, noiseSeed as W, render as oe, load as I ...}`, has `preserveDrawingBuffer:!0`, and its only use of Math.random is the default seed (`let H=U(O(Math.random()))`). That confirms brush.seed() and brush.noiseSeed() must be called before every frame.
  - Verdict: Licence confirmed (MIT), reachable from npm and GitHub, and the seed API is in the standalone build. It is the strongest natural-media engine in this list. Bake painted layers to PNG rather than painting them live on SwiftShader.
- **Watercolorizer** (32bitkid/watercolorizer (npm:@watercolorizer/watercolorizer))
  - Licence: ISC. The repo root has no LICENSE (404), but libs/watercolorizer/LICENSE.txt exists, and the npm 2.2.0 tarball ships LICENSE.txt with the same text. package.json says "license": "ISC".
  - Credit: none
  - Watch out: The README's example images are hosted off-repo on j.holmes.codes, which is probably blocked here. They are recreations of Sierra adventure-game art and are not licensed for reuse. The dependencies (@4bitlabs/vec2 ISC, @watercolorizer/convolution ISC, simplify-ts MIT) are all permissive.
  - Reachable: git ls-remote: HEAD is main at 3e64601. curl raw libs/watercolorizer/LICENSE.txt returned 200 (root LICENSE was 404). `npm pack @watercolorizer/watercolorizer@2.2.0` contains LICENSE.txt. npm view: ISC, modified 2026-08-01.
  - Verdict: Licence confirmed from the package's own LICENSE.txt. Pure geometry with an injectable random function, so it is deterministic. Cheap SVG output. Best value per effort for soft washes.
- **Paper Shaders** (paper-design/shaders (npm:@paper-design/shaders, @paper-design/shaders-react))
  - Licence: Apache-2.0, but ONLY from version 0.0.77 on. The LICENSE at raw.githubusercontent.com/paper-design/shaders/main/LICENSE is Apache 2.0, and the README states commercial use in videos without visible attribution. The 0.0.82 tarball contains the Apache LICENSE and a NOTICE file. I checked the npm licence field for the last 30 versions: 0.0.58 to 0.0.76 say 'SEE LICENSE IN ...', and the 0.0.76 tarball's LICENSE is the 'PolyForm Shield License 1.0.0'. 0.0.77 to 0.0.82 say Apache-2.0.
  - Credit: none in the video. Keep LICENSE and NOTICE ('Paper Shaders / Copyright 2026 Paper') only if we redistribute the shader code itself.
  - Watch out: Older versions use a different licence: 0.0.73 to 0.0.76 ship the PolyForm Shield 1.0.0 licence, and 0.0.47 to 0.0.72 point their licence field at whatever LICENSE is on main (a later live check of the tarballs found MIT in 0.0.46 to 0.0.72). Pin exactly 0.0.82, or at least 0.0.77, and never accept a caret range that could resolve older. The noise texture is embedded in dist/get-shader-noise-texture.js and covered by the package licence.
  - Reachable: git ls-remote: HEAD is main at 71be015. curl raw LICENSE and README returned 200. `npm pack @paper-design/shaders@0.0.82` and `@0.0.76` both worked; I compared their LICENSE files. The dist includes god-rays, grain-gradient, paper-texture, water, halftone-dots, halftone-cmyk, voronoi, warp, waves, perlin-noise, simplex-noise, smoke-ring and others. shader-mount.d.ts has `frame?: number`.
  - Verdict: Licence confirmed, with one trap the searcher missed: versions 0.0.73 to 0.0.76 are PolyForm Shield, and earlier ones point at the current LICENSE on main. With an exact pin of 0.0.82 it is safe, and the frame prop makes it deterministic.
- **@remotion/effects** (npm:@remotion/effects (remotion-dev/remotion/packages/effects))
  - Licence: packages/effects/package.json on GitHub main (4.0.537) and the npm 4.0.529 tarball both say "license": "UNLICENSED", and the tarball has no LICENSE file. The governing terms are therefore the Remotion License in the repo root (raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md). packages/effects/THIRD_PARTY_LICENSES.md shows four shaders adapted from EffectCraft under MIT.
  - Credit: none
  - Watch out: Four shaders are adapted from EffectCraft under MIT: Fractal Noise, Turbulent Displace, Lens Blur and Bevel Alpha ('Copyright (c) 2026 ArtCraft Team and the EffectCraft contributors'). I could not verify the claim that paper() comes from Paper Shaders: the third-party file names only EffectCraft, and the dist/esm/paper.mjs file has no provenance note. The root LICENSE.md also says the licence will 'slightly change' in Remotion 5.0.
  - Reachable: git ls-remote remotion-dev/remotion: HEAD is main at b17f522. curl raw packages/effects/package.json, README.md, THIRD_PARTY_LICENSES.md and the root LICENSE.md all returned 200. `npm pack @remotion/effects@4.0.529` worked, which matches the installed remotion 4.0.529 in our node_modules. npm lists 82 versions, from 4.0.455 to 4.0.537. The dist includes paper, roughen-edges, glow, light-leak, burlap, speckle, emboss, duotone, vignette and others.
  - Verdict: These are not new licence terms: they are the same Remotion License the project already depends on through remotion core. That is commercial-OK for an individual or a company of up to 3 employees, and a larger company needs a Company License for core anyway. Flag this condition to the owner, but it adds no new risk.
  - Later decision: the art director left it out. Gradients and baked textures cover its looks, and its canvas effect needs Chrome 148 while our Chromium is 141.
- **Remotion MIT helpers: @remotion/noise, @remotion/paths, @remotion/motion-blur** (npm:@remotion/noise, npm:@remotion/paths, npm:@remotion/motion-blur (remotion-dev/remotion/packages/*))
  - Licence: MIT, from package.json on GitHub main and in the npm 4.0.529 tarballs. packages/paths/LICENSE.md exists and is MIT ('Copyright (c) 2023 JonnyBurger'). packages/noise/LICENSE.md and packages/motion-blur/LICENSE.md return 404, and the noise and motion-blur tarballs carry no LICENSE file, only the package.json field.
  - Credit: none
  - Watch out: @remotion/noise depends on remotion core (Remotion License, already in use) and simplex-noise 4.0.1 (MIT).
  - Reachable: `npm pack @remotion/noise@4.0.529` and `@remotion/motion-blur@4.0.529` worked. npm view shows 4.0.537 with licence MIT for all three. @remotion/paths is already installed in our node_modules.
  - Verdict: MIT confirmed, already partly installed, deterministic and nearly free to run.
- **@remotion/three + three.js + pmndrs postprocessing** (npm:@remotion/three, npm:three (mrdoob/three.js), npm:postprocessing (pmndrs/postprocessing), npm:@react-three/postprocessing (pmndrs/react-postprocessing))
  - Licence: three.js: raw dev/LICENSE is MIT. postprocessing: raw main/LICENSE.md is zlib. react-postprocessing: raw master/LICENSE is MIT. @remotion/three: MIT in package.json and in the 4.0.529 tarball, with no LICENSE file. @react-three/fiber: MIT per npm.
  - Credit: none (zlib asks only that altered source be marked and the notice be kept in source distributions)
  - Watch out: Models and textures under three.js examples/ carry assorted licences, so do not copy assets from there. zlib clause 3: keep the notice in any redistributed source.
  - Reachable: curl raw mrdoob/three.js/dev/LICENSE, pmndrs/postprocessing/main/LICENSE.md and pmndrs/react-postprocessing/master/LICENSE all returned 200. git ls-remote pmndrs/postprocessing: main at 9cf03cf. npm view: three 0.186.1 MIT, postprocessing 6.39.5 Zlib, @react-three/postprocessing 3.2.1 MIT, @react-three/fiber 9.8.2 MIT. `npm pack @remotion/three@4.0.529` worked.
  - Verdict: All licences confirmed and permissive. Keep it as the optional 3D route, used sparingly and baked. Do not make it the primary style.
- **MIT GLSL building blocks (to replace LYGIA)** (stegu/webgl-noise; mattdesl/glsl-film-grain (npm:glsl-film-grain); Erkaman/glsl-godrays (npm:glsl-godrays); stackgl/glsl-halftone (npm:glsl-halftone))
  - Licence: webgl-noise: raw master/LICENSE is MIT (Ashima Arts 2011, Stefan Gustavson 2011-2016). glsl-film-grain: raw master/LICENSE.md is MIT (Matt DesLauriers 2015). glsl-godrays: raw master/LICENSE is MIT text but names no copyright holder. glsl-halftone: raw master/LICENSE.md is MIT (stackgl 2015). Their npm dependencies glsl-noise and glsl-aastep are MIT.
  - Credit: none
  - Watch out: glsl-godrays' LICENSE names no holder (it is still an MIT grant from the publisher). Warning for anyone extending this set: Shadertoy's default licence is CC BY-NC-SA 3.0, so never port a Shadertoy shader unless its author states a permissive licence.
  - Reachable: git ls-remote returned HEAD master for all four (22434e0, 4eea024, 5574bf2, 46120a3). curl raw LICENSE files returned 200 (glsl-halftone's LICENSE without .md was 404; LICENSE.md was 200). npm view: glsl-film-grain 1.0.4 MIT, glsl-godrays 1.0.2 MIT, glsl-halftone 1.0.4 MIT, glsl-noise 0.0.0 MIT.
  - Verdict: Licences confirmed from each repo. They are pure functions, so deterministic. Use them in one custom pass, with grain applied to everything.
- **PixiJS filters (as MIT shader source to port)** (pixijs/filters (npm:pixi-filters))
  - Licence: MIT. Read from raw.githubusercontent.com/pixijs/filters/main/LICENSE. npm pixi-filters 6.1.5 also says MIT.
  - Credit: none
  - Watch out: src/godray/GodrayFilter.ts credits Alain Galvan ('originally by Alain Galvan', a CodePen link). It ships under pixi's MIT. Note that GodrayFilter is a Perlin-noise light-shaft overlay, not occlusion-based volumetric light.
  - Reachable: git ls-remote: HEAD is main at e9d1ca9. curl raw LICENSE returned 200. A blob-less clone listed src/ with godray, advanced-bloom, old-film, cross-hatch, dot, tilt-shift, kawase-blur, simple-lightmap and 30 others, each with .frag and .wgsl.
  - Verdict: Licence confirmed. Useful as MIT source to port. Do not add Pixi as a second renderer.
- **spectral.js (pigment colour mixing); mixbox REJECTED** (rvanwijnen/spectral.js (npm:spectral.js); scrtwpns/mixbox (npm:mixbox))
  - Licence: spectral.js: MIT, from raw LICENSE on the default branch '3.0.0' and the LICENSE in the npm 3.0.0 tarball. mixbox: raw master/LICENSE says CC BY-NC 4.0, and npm says 'CC-BY-NC-4.0'.
  - Credit: none
  - Watch out: mixbox is NC: never install it.
  - Reachable: git ls-remote: spectral.js HEAD is branch 3.0.0 at bb2b05c; mixbox is master at a1bdb75. curl raw LICENSE returned 200 for both. `npm pack spectral.js@3.0.0` worked.
  - Verdict: spectral.js is MIT, verified in the repo and the tarball. The mixbox rejection is correct.
- **{Shan, Shui}* procedural ink landscape** (LingDong-/shan-shui-inf)
  - Licence: MIT, from raw master/LICENSE.
  - Credit: none
  - Watch out: None. The repo holds only index.html, LICENSE, README and two screenshots.
  - Reachable: git ls-remote: HEAD is master at 9f754d2. curl raw LICENSE and README returned 200. A blob-less clone shows index.html (126 KB), last commit 2018-12-10. I downloaded screenshots/screen001.jpg (6000x1608) and looked at it.
  - Verdict: Licence confirmed. Keep it ONLY as MIT technique and code reference for misty mountains, trees and water, recoloured and reshaped. Do not use its output as the channel look. It also patches the global Math.random, so port it to a local PRNG.
- **spite/sketch (cross-hatching and engraving NPR shaders)** (spite/sketch)
  - Licence: MIT for code, from raw master/LICENSE. The README credits outside assets separately.
  - Credit: none, if only our own port of the shader code is used
  - Watch out: Do not reuse three assets: the paper textures ('from https://maxpacks.com/paperpack', terms unknown), the Lee Perry head scan (I-R Entertainment Ltd., its own licence) and Suzanne (Blender). third_party/ holds vendored three.js, OrbitControls, OBJLoader, MarchingCubes, perlin.js, guspira.js and Maf.js, each under its own licence.
  - Reachable: git ls-remote: HEAD is master at eaf9b4a. curl raw LICENSE and README returned 200. A blob-less clone listed about 30 snapshots and the third_party/ folder. I downloaded snapshots/gallery.jpg and looked at it.
  - Verdict: Code licence confirmed. Keep as a reference for porting hatching shaders into 3D plates, excluding all bundled textures and models. Heavy on SwiftShader, so bake.
- **Paper.js + paperjs-offset (cut-paper geometry)** (paperjs/paper.js (npm:paper); glenzli/paperjs-offset (npm:paperjs-offset))
  - Licence: paper.js: raw develop/LICENSE.txt is MIT (Jürg Lehni and Jonathan Puckey). paperjs-offset: raw master/LICENSE is MIT. npm also says MIT for both.
  - Credit: none
  - Reachable: git ls-remote: paper.js HEAD is develop at dfb6882; paperjs-offset is master at 8c0dfe3. curl raw licences returned 200. npm view: paper is now 0.15.0 (the searcher said 0.14.0), paperjs-offset 2.2.2.
  - Verdict: Licences confirmed. Needed if we choose a cut-paper or stencil look.
- **d3-delaunay (Voronoi for stained glass and mosaics)** (d3/d3-delaunay (npm:d3-delaunay))
  - Licence: ISC, from raw main/LICENSE (Observable 2018-2021, Mapbox 2021). npm also says ISC.
  - Credit: none
  - Watch out: Dependency delaunator is ISC, and its dependency robust-predicates is Unlicense.
  - Reachable: git ls-remote: HEAD is main at afbeebf. curl raw LICENSE returned 200. npm view: d3-delaunay 6.0.4 ISC.
  - Verdict: Licence confirmed and the cost is negligible.
- **Palette sources: riso-colors, @thi.ng/color-palettes, chromotome** (mattdesl/riso-colors (npm:riso-colors); npm:@thi.ng/color-palettes (source on codeberg); kgolid/chromotome (npm:chromotome))
  - Licence: riso-colors: raw master/LICENSE.md is MIT (Matt DesLauriers 2017). @thi.ng/color-palettes: the npm tarball's LICENSE is Apache 2.0 (codeberg cannot be reached from here). chromotome: raw master/LICENSE is MIT (Kjetil Midtgarden Golid 2019), but its npm description says 'for personal use'.
  - Credit: none
  - Watch out: chromotome's palette files are named after other artists (cako, ducci, exposito, judson, jung, kovecses, ranganath, rohlfs, tsuchimochi...) and its npm text says 'for personal use', so skip it. riso-colors values come from stencil.wiki, and Pantone names are trademarks. Colour values themselves are not protectable.
  - Reachable: git ls-remote: riso-colors master at 9080a64; chromotome master at 33cfcb0. curl raw licences returned 200. `npm pack @thi.ng/color-palettes` worked (LICENSE Apache-2.0).
  - Verdict: Keep riso-colors and @thi.ng/color-palettes. Drop chromotome because of the personal-use wording and palettes taken from named artists.
- **SVG filter recipes (feTurbulence paper, ink bleed, glow) written in-house** (No package; our own code. Technique references: MDN and Codrops. Gist pqoqubbw/983bc453255e28eb04749bc347c38401 has no licence.)
  - Licence: Our own code, so nothing to verify. The gist states no licence, so it is all rights reserved by default and must not be copied.
  - Credit: none
  - Watch out: Do not paste code from the unlicensed gist or from Codrops demo zips. Write the filters from the spec.
  - Reachable: No fetch needed; it is a web standard. I relied on the searcher's benchmark files from the research session (not kept) and did not re-run them.
  - Verdict: No licence risk as long as we write the filters ourselves.

### Dropped

- **@remotion/skia (React Native Skia on CanvasKit)** (npm:@remotion/skia + npm:@shopify/react-native-skia (Shopify/react-native-skia) + npm:canvaskit-wasm). The licence is fine, but there is no reason to add it: everything it would give is already covered by kept items. Revisit only if live per-frame displacement of vector art becomes the core look.
- **LYGIA shader library (REJECT unless sponsored)** (patriciogonzalezvivo/lygia (npm:lygia)). Rejection confirmed: non-commercial plus a 30-day trial. Commercial rights require GitHub sponsorship, a merged contribution or a paid licence. Take MIT originals instead (stegu, mattdesl, and the GarrettGunnell Kuwahara below).
- **inkwash (procedural ink-wash renderer)** (chinatian2000-png/inkwash). The licence is technically MIT, but there is no named holder, the author is anonymous, the project is three weeks old, and its own README rates the output 6/10, which matches what I saw. Not professional enough to build on. Read its README for the lessons only.
- **engrave (tone map to engraving or stipple)** (fbourke/engrave-drawing). The licence is fine, but the look is plotter scribble, it needs a tone source we do not have (no photos of deities, and 3D would have to be built first), and tens of thousands of paths per plate are impractical to animate. Not a style foundation.
- **Rough.js (already installed)** (rough-stuff/rough (npm:roughjs)). Licence fine, but wrong for this brief. Use it at most as faint construction lines in diagram callouts, never as a rendering style. Remove it from the painterly shortlist.

### Found by the checker

The checker added these and checked their licences the same way. Each note says whether it recommends the source.

- LingDong-/nonflowers. MIT (raw master/LICENSE: 'MIT License / Copyright (c) 2018 Lingdong Huang'). git ls-remote: HEAD master. Procedural Gongbi-style botanical painting on canvas: layered translucent petals, soft tapered stems and leaves, paper grain, with no outside assets. I looked at screenshots/screen01.jpg: calm and refined, far above clip-art. It is the best MIT reference found for painting a lotus, peepal leaves and the fruit tree in the two-birds scene. Caveats: Chinese Gongbi idiom, a single 41 KB main.js from 2018, and it overrides the global Math.random with a seedable PRNG (main.js lines 77-78), so port that to a local PRNG. The bundled fonts/MaterialIcons-Regular.ttf is only for its UI and is not needed.
- steveruizok/perfect-freehand (npm:perfect-freehand 1.2.3). MIT (raw main/LICENSE: 'MIT License / Copyright (c) 2021 Stephen Ruiz Ltd'; the npm tarball also has the LICENSE). Turns a list of points into a variable-width, tapered, pressure-shaped outline polygon. A pure function with no Math.random, so it is deterministic and cheap in SVG. This directly fixes the uniform thick black outline behind the '2nd grade' look, replacing it with brush-pen line weight that swells and tapers. It also pairs with evolvePath for ink that draws itself.
- GarrettGunnell/Post-Processing. MIT (raw main/LICENSE.md: 'MIT License / Copyright (c) 2022 Garrett Gunnell'). git ls-remote: HEAD main. Assets/Kuwahara Filter/ holds basic, generalized and anisotropic Kuwahara shaders (Unity HLSL). Anisotropic Kuwahara is the standard painterly oil and gouache post-process, and this is the MIT replacement for LYGIA's licence-blocked kuwahara. It is Unity-specific, so it must be ported to a GLSL pass, it is heavy on SwiftShader, and it should be applied once to baked plates. The README says the effects are 'not production ready'.
- PavelDoGreat/WebGL-Fluid-Simulation. MIT (raw master/LICENSE: 'MIT License / Copyright (c) 2017 Pavel Dobryakov'). git ls-remote: HEAD master. GPU dye-advection fluid with bloom and sunrays, for ink or salt dissolving in water and incense smoke. Caveats: it is a time-stepped simulation with Math.random splats and wall-clock dt, so it must be run in order with a fixed dt and seeded splats, then baked to a PNG sequence before compositing, because Remotion renders frames out of order. The default look is neon, so restrict the palette. Ignore its app badges and promo images.

## 3D models and rendering

### Kept

- **Quaternius Ultimate Animated Animal Pack horse (repacked GLB in wild-mustang)** (stepanMiller/wild-mustang (public/assets/characters/horse.glb))
  - Licence: CC0 1.0 for the model. Read in public/assets/licenses/quaternius-animals-license.txt, the GLB's asset.copyright and public/assets/licenses/characters.json ('license': 'CC0-1.0', 'attributionRequired': false). The repo's LICENSE is MIT (Copyright (c) 2026 Wild Mustang Contributors), and that covers the added Trot clip and blaze.
  - Credit: none (optional: 'Horse model by Quaternius, CC0')
  - Watch out: The Trot clip and the blaze primitive (material Veter_Blaze) were added by the repo and fall under its MIT licence. If we redistribute the GLB in our own repo, keep the MIT notice; a rendered video needs no notice. Alternatively, drop the Veter_Blaze primitive and the Trot clip, which leaves pure CC0.
  - Reachable: git ls-remote: HEAD 6bd97a716ab6. A blobless clone plus git show extracted horse.glb at 761,596 bytes; its sha256 591007f3...508d3 matches shippingSha256 in characters.json. curl -sI raw.githubusercontent.com/stepanMiller/wild-mustang/main/public/assets/characters/horse.glb returned HTTP/2 200.
  - Verdict: Licence confirmed from the files in the repo, the file is reachable from the container, and it is the best rigged CC0 horse we have. Gita imagery calls for white horses, and the flat materials make the recolour trivial.
- **Quaternius Universal Animation Library (faceless mannequin and clips)** (J-Ponzo/gltf-universal-animation-library (glTF/AnimationLibrary_Godot_Standard.gltf + .bin); tilakpatell/tilakverse-assets (quaternius/universal-animation-library/Unreal-Godot/UAL1.glb, quaternius/universal-animation-library-2/Unreal-Godot/UAL2.glb))
  - Licence: CC0 1.0. J-Ponzo/LICENSE is the full CC0 1.0 Universal legal code, and its README says 'This pack is licensed under CC0 1.0'. In tilakverse, quaternius/universal-animation-library/License.txt and universal-animation-library-2/License.txt both say 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication'.
  - Credit: none
  - Watch out: None on licence grounds. UAL1 and UAL2 are Quaternius's paid 'Source' tier, mirrored by a third party. CC0 makes that redistribution legal, but supporting Quaternius on Patreon would be the decent thing to do.
  - Reachable: git ls-remote on both repos: J-Ponzo HEAD e24c23cf, tilakverse HEAD 85064399. Raw range request on the J-Ponzo .gltf: HTTP 206. curl -sI on raw UAL1.glb: HTTP/2 200, content-length 21,378,992. UAL2.glb: 200, 20,717,364. The tilakverse repo has no .gitattributes, so no LFS.
  - Verdict: Licence confirmed and files reachable. It is the only faceless rig I found with sitting, ground-sit, driving, lantern, lying-down and bow clips. The mesh needs costume or silhouette treatment before it can appear on screen. Use @gltf-transform/cli (MIT) to cut the 21 MB GLBs down to the clips we need.
- **Quaternius Stylized Nature MegaKit (source version)** (tilakpatell/tilakverse-assets (quaternius/stylized-nature-megakit/glTF/*.gltf + Blends/textures/*.png))
  - Licence: CC0 1.0, from quaternius/stylized-nature-megakit/License_Source.txt. The repo README adds: 'Every pack under quaternius/ is CC0 1.0'.
  - Credit: none
  - Watch out: The paid Source tier is mirrored by a third party, which CC0 permits. The same repo also holds a sketchfab/star-wars folder under CC BY / CC BY-NC-SA; never take anything from it.
  - Reachable: curl -sI on raw .../stylized-nature-megakit/glTF/TwistedTree_1.gltf: HTTP/2 200. License_Source.txt: 200. A blobless ls-tree lists 116 .gltf files.
  - Verdict: Licence confirmed, files reachable, and it is the best free nature set available. It needs a heavy palette grade and should be used only for background and ground cover, not for the culturally specific hero trees.
- **EZ-Tree procedural tree generator** (dgreenheck/ez-tree (npm @dgreenheck/ez-tree 1.1.0))
  - Licence: MIT. LICENSE at the repo root reads 'Copyright (c) 2024 Daniel Greenheck'. npm view gives license MIT, version 1.1.0.
  - Credit: none
  - Watch out: The npm 1.1.0 tarball bundles src/lib/assets/bark/{birch,oak,pine,willow}_*_1k.jpg and leaves/*_color.png with no provenance file. GitHub HEAD is v2.0.0 (2026-07-16, not published on npm). It removed bundled textures from the library. Its src/app/public/textures/LICENSE.md says the demo bark comes from ambientcg.com under CC0 and that the leaf textures fall under the project's MIT licence. Those demo textures are Git LFS (per .gitattributes), so the anonymous git lane cannot fetch them. Use the generator geometry with our own leaf cards and toon materials. Do not render 1.1.0's bundled bark JPGs, because their source is undocumented.
  - Reachable: git ls-remote: HEAD dcf309bd. npm pack @dgreenheck/ez-tree@1.1.0 worked; its tar listing shows the bundled textures. LICENSE and textures/LICENSE.md were read via git show on a blobless clone.
  - Verdict: The code licence is confirmed and the package is reachable. It is the right tool for the inverted ashvattha and for unique trees. Override every texture with our own.
- **@remotion/three + @react-three/fiber + three (render path)** (npm:@remotion/three, npm:@react-three/fiber 9.8.2, npm:three (latest 0.186.1; the probe uses ^0.180.0))
  - Licence: npm view: @remotion/three MIT (its tarball has no LICENSE file), @react-three/fiber MIT, three MIT. remotion itself is 'SEE LICENSE IN LICENSE.md', and that LICENSE.md, read from the remotion@4.0.537 tarball, is the Remotion two-tier licence.
  - Credit: none
  - Watch out: Remotion is free only for individuals and for companies of up to 3 employees; a larger company needs a paid licence, which matters for a monetised channel. Four more limits: (1) @remotion/three peer-depends on an exact remotion version (latest 4.0.537), so pin it to the project's remotion. (2) three's Water and Water2 need normal-map JPGs from three.js examples/textures. Those files are not in the npm package and their provenance is unclear, so generate water normals procedurally. (3) three-good-godrays caps three at <=0.182.0. (4) Do not ship any three.js example models: Horse, Flamingo and others are NC, and media in that repo is generally unlicensed.
  - Reachable: npm view for every package succeeded. The probe's render logs (research session, not kept; code in docs/style-research/probe/Probe.tsx.txt) ended 'Rendered 1/1' and 'Encoded 60/60 ... out/probe.mp4'.
  - Verdict: Verified, reachable, MIT. Confirm which Remotion licence tier applies to the channel owner.
- **@react-three/drei** (npm:@react-three/drei 10.7.9 (pmndrs/drei))
  - Licence: MIT. The tarball's LICENSE reads 'MIT License Copyright (c) 2020 react-spring'.
  - Credit: none
  - Watch out: Text and Text3D use troika-three-text (MIT). Its README claims kerning, ligatures and Arabic joining but not Indic shaping, and it loads fallback Unicode fonts from jsDelivr, which is blocked here. Devanagari verse text in 3D would mis-shape (matra reordering, conjuncts), so keep verse cards as HTML/SVG layers in Remotion. Environment presets also fetch HDRIs from a CDN.
  - Reachable: npm view: 10.7.9 MIT. npm pack succeeded.
  - Verdict: Licence confirmed. Useful for outlines, stars, motes and transmission glass. Do not use it for Devanagari text.
- **@pmndrs/assets (Poly Haven HDRIs, Inter font, matcaps)** (npm:@pmndrs/assets 1.7.0 (github pmndrs/assets))
  - Licence: The tarball's LICENSE is the CC0 1.0 Universal legal code, and npm view gives CC0-1.0. The README says the HDRIs are 'A selection of Polyhaven HDRIs, resized to 512x512 and converted to EXR'; Poly Haven content is CC0. For the matcaps, the README defers to emmelleppi/matcaps, whose README licence section disclaims authorship.
  - Credit: none (Poly Haven is CC0)
  - Watch out: The package-level CC0 cannot be trusted for matcaps/*.webp, so exclude them. Inter is under OFL. Use only hdri/*.exr.js (apartment, bridge, city, dawn, esplanade, forest, hall, lab, lobby, night, park, sky, studio, sunrise, sunset, venice, warehouse, workshop) and the fonts.
  - Reachable: npm pack @pmndrs/assets@1.7.0 produced a 13,774,995-byte tarball, and its listing contains the 18 hdri/*.exr.js modules. git ls-remote pmndrs/assets: HEAD d8709a9b.
  - Verdict: Keep it for the HDRI lighting only and exclude the matcaps.
- **Surface-ID / depth-normal post-process outlines** (OmarShehata/webgl-outlines)
  - Licence: MIT, from the LICENSE file read via raw (HTTP 200).
  - Credit: none (keep the MIT notice in the source file if code is copied)
  - Watch out: The demo models are not covered. Per the README, threejs/public/Tugboat.glb is 'Boat model by Google Poly' (CC-BY at best, with an unconfirmed author). Use only CustomOutlinePass.js and FindSurfaces.js.
  - Reachable: git ls-remote: HEAD 42e21034. A blobless clone lists threejs/src/CustomOutlinePass.js, FindSurfaces.js and threejs-outlines-minimal/.
  - Verdict: Licence confirmed. The best route to an ink-line 3D look that continues the channel's current inked style.
- **postprocessing + @react-three/postprocessing + n8ao** (npm:postprocessing 6.39.5, npm:@react-three/postprocessing 3.2.1, npm:n8ao 2.0.1)
  - Licence: From each tarball's LICENSE file: postprocessing is zlib-style ('Copyright © 2015 Raoul van Rüschen'), @react-three/postprocessing is MIT ('Copyright (c) 2020 react-spring'), and n8ao's LICENSE file is CC0 1.0 Universal even though its npm field says ISC. All of these are permissive.
  - Credit: none
  - Reachable: npm view and npm pack succeeded for all three.
  - Verdict: Licences confirmed. The grade, grain, vignette and bloom passes are what make 3D read as calm and premium.
- **three-good-godrays** (npm:three-good-godrays 0.12.1 (ameobea/three-good-godrays))
  - Licence: Zlib-style, from LICENSE read via raw. The npm license field is empty.
  - Credit: none
  - Reachable: git ls-remote: HEAD 70ad1c41. raw LICENSE: 200. npm view: 0.12.1, peerDependencies three '>= 0.125.0 <= 0.182.0', postprocessing ^6.33.4.
  - Verdict: Licence confirmed, but optional. Pin three at 0.182 or lower if we use it, or fake the shafts with gradient cones.

### Dropped

- **Quaternius Farm Animals pack (2018 horse, FBX)** (tilakpatell/tilakverse-assets (quaternius/farm-animals/FBX/Horse.fbx)). The licence is fine, but the asset is redundant and below the quality bar. Use it only if a cow or sheep is ever needed, and even then expect a toy look.
- **three.js example animals Horse.glb, Flamingo.glb, Parrot.glb, Stork.glb (REJECT)** (mrdoob/three.js examples/models/gltf (origin dataarts/3-dreams-of-black)). The NonCommercial and ShareAlike terms are confirmed. Never use these models or anything derived from them on a monetised channel.
- **THREE.Fire (raymarched volumetric fire)** (mattatz/THREE.Fire). The licence is fine, but it is stale and the wrong look for a stylised diya. A small teardrop billboard shader we write ourselves is simpler and more consistent with the style.
- **KayKit packs by Kay Lousberg** (KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0). The licence is fine, but the style is wrong, and the faces break the faceless rule.
- **Kenney 3D kits** (KenneyNL/Starter-Kit-3D-Platformer). Wrong style, and the useful packs cannot be reached from here.
- **Polygonal Mind CC0 collections (ToxSam registry)** (ToxSam/cc0-models-Polygonal-Mind). The licence is fine, but the quality is too low for hero or background use.
- **Vimana Grammar (procedural South Indian temple)** (purplefaucet/temple_project). No licence. Use it only as a reading list for proportion rules.

### Found by the checker

The checker added these and checked their licences the same way. Each note says whether it recommends the source.

- UAL2 Bow clips (Bow_Aim_Down/Neutral/Up, Bow_Notch, Bow_RapidShoot_Loop, Bow_Shoot) plus the Female Mannequin are in tilakpatell/tilakverse-assets quaternius/universal-animation-library-2 (CC0 per License.txt; UAL2.glb raw 200). They give a faceless archer silhouette for Kurukshetra, and a female figure for meditation and 2 a.m. scenes, without new sources.
- @takram/three-atmosphere 0.19.1 (github takram-design-engineering/three-geospatial). MIT: root LICENSE reads 'The MIT License (MIT) Copyright (c) 2024 Shota Matsuda', and the README says 'MIT, except where indicated otherwise'. Its stars.bin is built from the Yale Bright Star Catalog. It gives a physically based dawn and dusk sky and a real star field (you could set it for Kurukshetra's latitude), and its peers (three >=0.170, r3f >=9, react >=19, postprocessing) match our stack. Untested under SwiftShader; it needs half-float buffers and precomputed textures. Skip its sibling @takram/three-clouds, because volumetric clouds are too heavy for a CPU renderer.
- three-custom-shader-material 6.4.0 (npm; LICENSE 'MIT License Copyright (c) 2024 Faraz Shaikh'). It extends MeshToonMaterial or MeshStandardMaterial with custom GLSL while keeping lighting and skinning, which is the clean way to build painterly ramps, hatching, or a single house shader across horses, mannequins and trees.
- martinRenou/threejs-caustics. Code is BSD-3-Clause (LICENSE.txt: 'Copyright (c) 2020 Martin Renou ... Redistribution and use in source and binary forms, with or without modification, are permitted'). It is a reference for water caustics in the salt-in-water bowl and the lotus pond. Do not reuse its demo assets (TropicalSunnyDay skybox, WhiteShark.obj, rock.obj, plant.obj), which have no provenance.
- @gltf-transform/cli 4.5.1 (npm, MIT). It is the tool for cutting UAL1/UAL2 (21 MB each) down to the clips we use, and for repacking the CC0 GLBs into project assets.
- REJECTED, for the record. mani-4444/temple-3d is a polished procedural Dravidian temple GLB (public/models/temple.glb, about 1.55 MB), and its README says 'Temple model and poster: original work for this project', but the repo has no LICENSE file, so all rights are reserved and we cannot use it. pmndrs/market-assets has no repo licence file; its info.json files use a numeric 'license: 1' with no mapping in the repo, and the models are mostly Kenney food props.

## Public-domain museum art

### Kept

- **The Met Open Access images on Google Cloud Storage (gcs-public-data--met)** (https://storage.googleapis.com/gcs-public-data--met/<ObjectID>/0.jpg (index: github.com/metmuseum/openaccess))
  - Licence: CC0 1.0. In the downloaded 74726/0.jpg, the embedded XMP reads dc:rights = https://creativecommons.org/publicdomain/zero/1.0/. Every object.json I fetched (45734, 37863, 451314, 38010, 287267, 37841 and others) carries "isOasc": true. Copyrighted Met works are absent from the bucket: 488221 (Picasso) and 489970 both return 404, which fits a CC0-only bucket. The Met's policy covers the images; the repo README says images are not part of the CSV dataset.
  - Credit: none (optional: 'The Metropolitan Museum of Art, Open Access (CC0)'; do not use Met trademarks or imply endorsement)
  - Watch out: None in the bucket. The isOasc flag is a 2017 snapshot, so cross-check every ID against the current MetObjects.csv 'Is Public Domain' = True before shipping.
  - Reachable: curl -sI .../45734/0.jpg returned HTTP/2 200 image/jpeg (last-modified 2017-03-21). The JSON listing API storage/v1/b/gcs-public-data--met/o?prefix=74726/ works. Random sample of 120 South-Asian 2D public-domain IDs from the current CSV: 93 returned 206 and 27 returned 404 (77.5%, matching the searcher's 902/1159). Sizes of the 93: median 2.48 MB, p10 396 KB, 6 under 300 KB. images.metmuseum.org and collectionapi.metmuseum.org return 000 (blocked).
  - Verdict: The licence is confirmed from the files themselves and the files are reachable. This is the strongest single pool. Two conditions: (1) the bucket is an unmaintained 2017 Google public-dataset copy, so mirror the chosen files into our own repo now; (2) filter by current CSV 'Is Public Domain' and inspect each image for deities. The faceless rule cannot be met with this material, so the owner must decide whether historical figurative art is allowed.
- **metmuseum/openaccess (MetObjects.csv index)** (metmuseum/openaccess)
  - Licence: README.md (master): CC0, with the CC0 legal code in LICENSE (master/LICENSE, 'CC0 1.0 Universal').
  - Credit: none (the Met asks for attribution as a courtesy; we must not misrepresent the data or imply endorsement, and must mark modified data as modified)
  - Watch out: The CSV includes identifying data for works still under copyright: always filter on 'Is Public Domain' = True.
  - Reachable: git ls-remote returned HEAD 06ad104b. raw.githubusercontent gives only the LFS pointer (size 340770716). media.githubusercontent.com/media/metmuseum/openaccess/master/MetObjects.csv returned 200 and streamed in full: 502,949 rows, 260,409 public domain. My South-Asian filter (India/Pakistan/Bangladesh/Nepal) found 3,655 rows, with 637 Paintings and 452 Codices, consistent with the searcher's 638 and 441.
  - Verdict: This is the only practical way to pick IDs and to produce captions from data. The licence is confirmed and the CSV is reachable through the LFS media host.
- **Smithsonian Open Access on AWS: National Museum of Asian Art (Freer/Sackler) Indian paintings** (https://smithsonian-open-access.s3-us-west-2.amazonaws.com (metadata/edan/nmaa/*.txt, media/fs/<idsId>.jpg))
  - Licence: Smithsonian/OpenAccess README points to the S3 bucket, and its LICENSE is the CC0 1.0 legal code. Per item: in all 4,719 NMAA records I downloaded, every media item (8,581 of 8,581) has usage.access = 'CC0'.
  - Credit: none (optional: 'National Museum of Asian Art, Smithsonian Institution, CC0')
  - Watch out: None found; the bucket holds only CC0 media. Smithsonian trademarks may not be used.
  - Reachable: S3 ListObjectsV2 on prefix metadata/edan/nmaa/ works (files dated 2026-10-19). All 256 files downloaded: 27 MB, 4,719 records, 194 India-related on my broader keyword filter. HEAD returned 200 for FS-6876_08 (1.6 MB), FS-5858_01, FS-5814_07, FS-6915_05, FS-F1907.611_001 (52.6 MB), FS-8146_01 (12.7 MB) and FS-S2018.1.39_001crop (18.9 MB). ids.si.edu and api.si.edu return 000 (blocked).
  - Verdict: The CC0 licence is confirmed per media item and the files are reachable. Excellent quality, but this is a supplement, not a whole channel. Every folio needs a deity check, including the Vasanta Vilasa.
- **Smithsonian Open Access on AWS: Cooper Hewitt Indian holdings (Daniell Oriental Scenery aquatints, chintz/palampores, snake-handled lamp)** (https://smithsonian-open-access.s3-us-west-2.amazonaws.com (metadata/edan/chndm/, media/chsdm/<idsId>.jpg))
  - Licence: Refutation of the GitHub source: the cooperhewitt/collection README states its CC0 covers the data only ('images are not included ... and are not covered by the same license'), and master/LICENSE returns 404 (the CC0 text sits inside the README). The images' CC0 comes from the Smithsonian EDAN records instead: in all 605 India-related chndm records I streamed, 968 of 968 media items carry usage.access = 'CC0'.
  - Credit: none (optional: 'Cooper Hewitt, Smithsonian Design Museum, CC0')
  - Watch out: Do not rely on the GitHub repo for image rights; use only media whose EDAN usage.access is CC0.
  - Reachable: git ls-remote cooperhewitt/collection returned HEAD 4272b8f. Streamed all 256 chndm metadata files with grep: 605 India-related records, 80 titled 'Oriental Scenery'. Downloaded with 200: Gaya sacred trees (7660x5716, 33.6 MB), Great Pagoda Tanjore (7706x5616), Fakeer's Rock in the Ganges (7507x5639), Sculptured Rocks at Mavalipuram (7706x5626), a palampore (6986x9912, 52 MB) and the oil lamp with snake handle (2593x2054).
  - Verdict: The licence is confirmed per media item through EDAN, not through the GitHub repo. The files are reachable, very high resolution and low in deity risk.
- **The Met's 19th-century photographs of India (Tripe, Murray, Benares ghats)** (https://storage.googleapis.com/gcs-public-data--met/<id>/0.jpg)
  - Licence: CC0, the same evidence as the Met bucket: object.json for 287267, 264518, 264569 and 287641 is "isOasc": true.
  - Credit: none
  - Reachable: HEAD returned 200 for 287267 (1.5 MB), 264518, 264569 and 287641; 286323 returned 404, as the searcher said. Downloaded 264518 (2832x2206) and 287267 (3061x2359).
  - Verdict: The licence is confirmed and the files are reachable. Use them only as archival B-roll. Avoid cremation and 1857 massacre sites.
- **Manuscript folios for verse cards (Met palm leaves and Jain Kalpasutra; Freer Vasanta Vilasa and Prajnaparamita)** (Met GCS 74847, 74858, 37995, 37838-37843; Smithsonian S3 media/fs FS-6915_05, FS-6919_04/05)
  - Licence: CC0. Met object.json isOasc true for all 10 IDs; Smithsonian EDAN usage.access CC0 on fsg_F1932.24 (Vasanta Vilasa).
  - Credit: none
  - Reachable: HEAD returned 200 for 74847, 74858, 37995 and 37838-37843 on GCS. FS-6915_05 returned 200 on S3. Downloaded and measured: 74858 (4000x566), 37995 (3883x526), 37841 (4000x1870) and FS-6915_05 (2239x3000).
  - Verdict: The licence is confirmed and the files are reachable. Keep only the text-only palm leaves as verse-card grounds. Treat the Jain pages and the Vasanta Vilasa as deity-bearing and exclude them under the house rule.
- **rembg (background removal)** (danielgatis/rembg (PyPI rembg))
  - Licence: LICENSE.txt (main): MIT. PyPI 2.0.85 lists the licence as MIT.
  - Credit: none
  - Watch out: Critical: the DEFAULT model, bria-rmbg (RMBG-2.0), is not licensed for commercial use. Always pass -m explicitly with u2net or u2netp (U-2-Net, Apache-2.0, LICENSE verified), isnet-general-use (xuebinqin/DIS, Apache-2.0 LICENSE.md verified) or birefnet-general (ZhengPeng7/BiRefNet, MIT, verified). Avoid the withoutbg cloud backend.
  - Reachable: PyPI JSON returned version 2.0.85 MIT. Release assets u2net.onnx, isnet-general-use.onnx and BiRefNet-general-epoch_244.onnx each returned 206 through release-assets.githubusercontent.com.
  - Verdict: MIT tool. The searcher missed that its default model is commercial-restricted, so pin the model to u2net, isnet-general-use or birefnet-general in the build script.
- **MiDaS (monocular depth)** (isl-org/MiDaS)
  - Licence: LICENSE (master): MIT, Copyright (c) 2019 Intel ISL. The README's 'License' section says MIT.
  - Credit: none
  - Watch out: The weights are published as release assets of the MIT repo. Their backbones (BEiT, Swin) are MIT or Apache upstream. Runtime dependencies are PyTorch (BSD) and timm (Apache-2.0).
  - Reachable: git ls-remote returned HEAD 4545977. Release assets v3_1/dpt_swin2_tiny_256.pt, v2_1/midas_v21_small_256.pt, v3_1/dpt_beit_large_512.pt and v3/dpt_hybrid_384.pt each returned 206. npm @remotion/three 4.0.537 is MIT.
  - Verdict: MIT, and the weights are reachable. A build-time depth tool for gentle 2.5D moves on the Daniell plates and the photographs.
- **sharp (build-time crop and grade)** (npm:sharp (lovell/sharp))
  - Licence: lovell/sharp LICENSE (main): Apache License 2.0. npm view sharp returns 0.35.5, Apache-2.0.
  - Credit: none
  - Watch out: The prebuilt libvips binary @img/sharp-libvips-linux-x64 1.3.4 is LGPL-3.0-or-later. That is fine for build-time use, and we do not redistribute it.
  - Reachable: npm view sharp version license returned 0.35.5 Apache-2.0. npm view @img/sharp-libvips-linux-x64 returned 1.3.4 LGPL-3.0-or-later.
  - Verdict: Permissive and reachable. The LGPL libvips binary is only a build tool.

### Dropped

- **Razmnama folios at the Met** (Met GCS 451314-451318). The licence is fine, but only 2 of the 5 are high-resolution, and both probably contain Krishna or other divine figures. Under the no-deity rule, use at most a cropped detail of horses and a chariot from 451314, after a visual check. This set cannot be a pillar for the Kurukshetra scenes.
- **ClevelandMuseumArt/openaccess** (ClevelandMuseumArt/openaccess). The licence is fine, but the images are unreachable here. It is usable only if the owner downloads files outside the container and commits them.
- **art-institute-of-chicago/api-data** (art-institute-of-chicago/api-data). Metadata only, and the images are blocked.
- **Smithsonian/OpenAccess GitHub repository** (Smithsonian/OpenAccess). Nothing to fetch here. The S3 candidates above supersede it; it is useful only as documentation.
- **Blocked public-domain image hosts** (Wikimedia, BL IIIF, OPenn, Met image and API servers, Smithsonian IDS and API, LoC, Wellcome, IA, NYPL, Rijksmuseum, NGA, Hugging Face). Unreachable from the container.
- **GitHub and Hugging Face 'Indian art' ML datasets (SanskritiX and others)** (HninLaeKhaing/SanskritiX). No images, unknown rights, and thumbnail resolution.
- **DepthFlow (reference only)** (BrokenSource/DepthFlow). AGPL-3.0 is not on the house's approved list. Use it only as a design reference and re-implement the effect in @remotion/three.

### Found by the checker

The checker added these and checked their licences the same way. Each note says whether it recommends the source.

- Biodiversity Heritage Library open data on AWS: S3 bucket bhl-open-data (us-east-2), with JPGs at https://bhl-open-data.s3.us-east-2.amazonaws.com/jpg/<BarCode>/<BarCode>_NNNN.jpg and JP2 under images/. Licence: the bucket LICENSE.md says the project is US public domain plus CC0, but each item has its own licence in data/item.txt.gz (CopyrightStatus and LicenseType). Use only items marked 'Public domain', 'NOT_IN_COPYRIGHT' or 'Not in copyright'. About 38k items are CC BY-NC-SA and must be excluded. Verified example: Roxburgh, Plants of the Coast of Coromandel (1795-1820), v.1, barcode mobot31753000666229, CopyrightStatus 'Public domain. The BHL considers that this work is no longer under copyright protection.' It has 144 pages, and the plates are 4075x5957 hand-coloured botanical engravings that I downloaded and viewed: museum-grade, calm, deity-free and faceless. The same route covers Wight's Icones plantarum Indiae Orientalis (1840) and Jerdon's Birds of India (1862). Fits lotus, peepal and banyan leaves, birds, and title-card ornament. Crop the Latin captions.
- Met GCS bucket (CC0, same evidence as above): East-Asian lotus and water paintings for the lotus-in-water beats. 36437 'Lotus and waterbirds' (Yuan, 1777x3722), 49236 'Lotus Leaves and Water Reeds' (3944x1821), 49143 Bada Shanren 'Birds in a lotus pond' (3891x1840) and 77196 'Egrets in a Lotus Pond' (Japan, 1606x3703) all returned 200 and were viewed: very calm and premium ink and colour work. Caveats: they are culturally Chinese or Japanese, they carry inscriptions that must be cropped, 41486 is only 950x2000, and works the Met added after 2017 (e.g. 754013) are missing from the bucket (404).
- NOT recommended, noted for completeness: the PD12M bucket (https://pd12m.s3.us-west-2.amazonaws.com, images/ and mds/ shards) is reachable. However, its search index is Hugging Face parquet, which is blocked here, and the per-sample metadata carries only source_org (mostly 'Wikimedia Commons'), not a licence. Per-image rights therefore cannot be verified from the bucket itself, so keep=false.

## Styles of successful channels

### Kept

- **sumi (tengubyte): ink brush, ink-wash and ink-transition effects** (tengubyte/sumi)
  - Licence: MIT, from /LICENSE ('MIT License, Copyright (c) 2026 TenguByte') and package.json "license": "MIT". README '## License' section limits this to the code.
  - Credit: none (MIT; keep the copyright notice in the vendored source)
  - Watch out: Everything under site/ is excluded: site/public/art/*.webp (scene, sansui, enso, brush-band, tengu) belongs to TenguByte with no licence granted, and site/src/kanji/*.svg is KanjiVG under CC BY-SA 3.0. src/ contains no images, fonts or data, and I found no third-party shader references (no Shadertoy, Ashima or Quilez credits).
  - Reachable: git ls-remote: HEAD e2994552 on main, tag v0.12.0 present (24 tag refs). A shallow clone worked (2.0 MB). curl -sI on raw LICENSE returned 200. npm view @tengubyte/sumi returned E404, so it is not on npm. The README's install line is 'npm install github:tengubyte/sumi#v0.12.0', which runs a prepare/build script; vendoring src/core avoids that.
  - Verdict: The licence holds for src/. Do not copy site/ assets. It is the strongest code-only route to an ink-and-paper look, but its quality is unproven until we render a test in headless Chromium with --gl=angle or swangle (software GL will be slow at 1080p). It is a single-author project at v0.12, so pin the commit.
- **{Shan, Shui}* procedural ink landscape scroll** (LingDong-/shan-shui-inf)
  - Licence: MIT, from /LICENSE on master ('MIT License, Copyright (c) 2018 Lingdong Huang').
  - Credit: none
  - Watch out: None. It is a single 126 KB index.html with no external resources: the only url() is a generated canvas texture.
  - Reachable: git ls-remote: master 9f754d2b. Shallow clone worked (9 MB). curl on raw master/LICENSE returned 200.
  - Verdict: The licence is clean and the quality is real. Use it as an algorithm source for ridge texture strokes, wash layering and mist; do not use it as-is. Porting it and swapping in Indian forms is substantial work.
- **Paper Shaders (god rays, grain gradient, paper texture, water, mesh gradient)** (npm:@paper-design/shaders-react (github paper-design/shaders))
  - Licence: Apache-2.0, from /LICENSE, packages/shaders/LICENSE and packages/shaders-react/LICENSE (all identical), and the npm tarball LICENSE. There is also a root NOTICE file.
  - Credit: Not legally required for rendered video: the Apache NOTICE duty applies when redistributing the software. Optional courtesy line: 'Shaders: Paper Shaders (Apache-2.0), shaders.paper.design'.
  - Watch out: perlin-noise.ts says 'Original algorithm: https://www.shadertoy.com/view/NlSGDz'. Shadertoy's default licence is CC BY-NC-SA, and this source states none, so do not use perlin-noise. voronoi.ts is from Shadertoy ldl3W8, and neuro-noise.ts is from a tweet by zozuar, so skip both. The shaders we want (god-rays, grain-gradient, paper-texture, water, mesh-gradient) cite no third-party source. A 128x128 noise PNG is embedded as a data URI in get-shader-noise-texture.ts and is part of the Apache-licensed repo.
  - Reachable: npm view @paper-design/shaders-react and @paper-design/shaders both returned 0.0.82, Apache-2.0, modified 2026-10-21. git ls-remote: main 71be0157. Shallow clone worked (12 MB). Raw LICENSE returned 200.
  - Verdict: Verified: Apache-2.0, deterministic frame control works, reachable on npm. Avoid perlin-noise, voronoi and neuro-noise because of their outside origins. Pin 0.0.82 exactly.
- **p5.brush: natural-media brushes, watercolour fill, hatching** (npm:p5.brush (github acamposuribe/p5.brush))
  - Licence: MIT, from /LICENSE.md ('MIT License, Copyright (c) 2023-2026 Alejandro Campos Uribe') and the npm tarball LICENSE.md. The README '## License' section says MIT too.
  - Credit: none
  - Watch out: Colour mixing is credited to spectral.js (rvanwijnen/spectral.js, whose LICENSE reads 'MIT License, Copyright (c) 2025 Ronald van Wijnen'). p5.js itself is LGPL-2.1 and is only needed for the p5 build. example/brush_tips/brush.jpg is an example asset with no separate notice; do not ship it.
  - Reachable: npm view p5.brush returned 2.2.3, MIT, modified 2026-09-20. git ls-remote: main 43ac6d5a. Shallow clone worked (27 MB). Raw LICENSE.md returned 200; raw /LICENSE returned 404, because the file is LICENSE.md.
  - Verdict: The licence is verified. Use it as an offline plate painter with a seeded standalone build. The aesthetic payoff is unproven and depends entirely on our own compositions.
- **Kolam-Maker (single-line sikku kolam generator)** (evoluteur/kolam-maker)
  - Licence: MIT, from /LICENSE ('MIT License, Copyright (c) 2026 Olivier Giulieri'). The README says 'open source ... with MIT license'.
  - Credit: none
  - Watch out: index.html loads the Overpass font from Google Fonts and a Google Analytics tag. Neither matters if we port js/kolam.js, which is 612 lines.
  - Reachable: git ls-remote: main 826cb2f4. Shallow clone worked (772 KB). Raw LICENSE returned 200.
  - Verdict: The licence is clean, the output is good, and it is culturally on-target with no deity. Strong pick for chapter cards, borders and transitions.
- **EZ-Tree procedural 3D tree generator** (npm:@dgreenheck/ez-tree (github dgreenheck/ez-tree))
  - Licence: MIT, from /LICENSE ('MIT License, Copyright (c) 2024 Daniel Greenheck') and the npm tarball LICENSE. Textures are covered by src/app/public/textures/LICENSE.md.
  - Credit: none
  - Watch out: Bark textures are ambientCG CC0. The leaf textures (oak, ash, aspen, pine) are MIT. The demo-app models in src/app/public/models (flower_*.glb, rock*.glb, grass.glb) and ground textures carry no source or licence note, so do not use them.
  - Reachable: npm view @dgreenheck/ez-tree returned 1.1.0, MIT. git ls-remote: main dcf309bd. Shallow clone worked (9.8 MB). Raw LICENSE returned 200.
  - Verdict: Verified. Useful for backlit tree silhouettes; not usable as a lit 3D 'game asset' look.
- **postprocessing (pmndrs): GodRays, Bloom, Vignette, Noise** (npm:postprocessing (github pmndrs/postprocessing))
  - Licence: Zlib, from /LICENSE.md ('Copyright © 2015 Raoul van Rüschen. This software is provided as-is...') and the npm tarball LICENSE.md.
  - Credit: none
  - Watch out: none found
  - Reachable: npm view postprocessing returned 6.39.5, Zlib. @react-three/postprocessing returned 3.2.1, MIT. git ls-remote: main 9cf03cff. curl on raw src/effects/GodRaysEffect.js and LICENSE.md returned 200.
  - Verdict: Verified and reachable. The look depends on restraint.
- **Fontsource Devanagari and Latin serif stack (Tiro Devanagari Sanskrit, Noto Serif Devanagari, Cormorant Garamond, EB Garamond, Marcellus)** (npm:@fontsource/tiro-devanagari-sanskrit (+ noto-serif-devanagari, cormorant-garamond, eb-garamond, marcellus))
  - Licence: OFL-1.1, read from each npm tarball's package/LICENSE. Tiro: 'Copyright 2020 The Indigo Project Authors (https://github.com/TiroTypeworks/Indigo) ... licensed under the SIL Open Font License, Version 1.1'. The Noto Project, Cormorant Project and EB Garamond Project files say the same. Marcellus is OFL with the Reserved Font Name 'Marcellus'.
  - Credit: none (OFL does not require on-screen credit)
  - Watch out: Marcellus has a Reserved Font Name. That matters only if we modify and redistribute the font file, not when we render text.
  - Reachable: npm view returned 5.3.0, OFL-1.1 for all five. Downloaded the tarballs with curl and listed their contents.
  - Verdict: Verified. This is the right typographic base for verse cards. Note there is no bold Tiro, so use Noto Serif Devanagari for weight contrast.
- **Nonflowers: procedural gongbi botanical painting** (LingDong-/nonflowers)
  - Licence: MIT, from /LICENSE on master ('MIT License, Copyright (c) 2018 Lingdong Huang').
  - Credit: none
  - Watch out: fonts/MaterialIcons-Regular.ttf is Google's Material Icons (Apache-2.0) and is used only for the UI buttons. We do not need it.
  - Reachable: git ls-remote: master 03b653d2. Shallow clone worked (2.4 MB). Raw LICENSE returned 200.
  - Verdict: The licence is clean and the quality is high. Use it as a technique source for petal shading and paper, and write our own lotus geometry.
- **perfect-freehand: pressure-sensitive variable-width strokes** (npm:perfect-freehand (github steveruizok/perfect-freehand))
  - Licence: MIT, from github /LICENSE ('MIT License, Copyright (c) 2021 Stephen Ruiz Ltd') and the npm tarball LICENSE.
  - Credit: none
  - Reachable: npm view returned 1.2.3, MIT, modified 2026-02-01. git ls-remote returned HEAD 176e00f2. Raw LICENSE returned 200.
  - Verdict: Verified. The cheapest fix for the uniform-marker outline.
- **flubber: shape-to-shape morphing** (npm:flubber (github veltman/flubber))
  - Licence: MIT, from github /LICENSE ('MIT License, Copyright (c) 2017 Noah Veltman') and the npm tarball LICENSE.
  - Credit: none
  - Reachable: npm view returned 0.4.2, MIT, modified 2022-06-18. git ls-remote returned HEAD 0cadadf3. Raw LICENSE returned 200.
  - Verdict: Verified. Fits the rope-to-snake and salt-to-water morphs.
- **Remotion first-party: @remotion/paths, noise, three, shapes** (npm:@remotion/paths (+ @remotion/noise, @remotion/three, @remotion/shapes))
  - Licence: paths and shapes ship LICENSE.md ('Copyright (c) 2023 JonnyBurger. Permission is hereby granted, free of charge...' = MIT) in both the tarball and github packages/*/LICENSE.md. noise and three ship NO licence file in the tarball or in github packages/noise and packages/three; only package.json says "license": "MIT". @remotion/transitions is "UNLICENSED" and remotion core is 'SEE LICENSE IN LICENSE.md'.
  - Credit: none
  - Watch out: Remotion core and @remotion/transitions are under the Remotion License, which needs a paid company licence for organisations above its small-team threshold. The project already depends on core, so this is a pre-existing condition, not a new one.
  - Reachable: npm view returned 4.0.537 for all (modified 2026-10-19). Raw github packages/{paths,shapes}/LICENSE.md returned 200; packages/{noise,three}/LICENSE* returned 404.
  - Verdict: Verified, with the minor caveat that noise and three declare MIT in package.json only.
- **d3-celestial star data** (ofrohn/d3-celestial)
  - Licence: BSD-3-Clause, from /LICENSE ('Copyright (c) 2015, Olaf Frohn. All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided...'). readme.md says 'Released under BSD License'.
  - Credit: Star positions: d3-celestial © 2015 Olaf Frohn (BSD-3-Clause), from the XHIP Hipparcos compilation
  - Watch out: stars.6.json (5,044 stars, from XHIP/Hipparcos) is factual and safe. mw.json, the Milky Way outlines ol1 to ol5, is converted from Jose R. Vieira's 'Milky Way Outline Catalog' (skymap.com), whose own terms are not stated in the repo, so its licence is unclear. Generate the Milky Way band procedurally instead.
  - Reachable: npm view d3-celestial returned 0.7.35, BSD-3-Clause. git ls-remote: master 7e720a3d. Shallow clone worked (59 MB). Raw LICENSE returned 200. Parsed stars.6.json locally.
  - Verdict: Verified for the star catalogue. Skip mw.json.
- **@pmndrs/assets: HDRIs, matcaps, normals, textures** (npm:@pmndrs/assets (github pmndrs/assets))
  - Licence: The package-level LICENSE is CC0 1.0 (github /LICENSE and the npm tarball). The README traces the sources: HDRIs are 'A selection of Polyhaven HDRIs' (Poly Haven is CC0). Matcaps say 'refer to emmelleppi/matcaps', a fork of nidorx/matcaps, whose README licence section says the matcaps 'were obtained from various websites' and 'it was not possible to maintain the relationship for the original authors'. emmelleppi/normal-maps has no LICENSE file (404).
  - Credit: none for the HDRIs
  - Watch out: The CC0 label on the package does not cure the provenance of its contents. matcaps/* (284 files): origin unknown, scraped from ZBrushCentral, Pixologic and BadKing, so do NOT use. normals/*: no source or licence, so do NOT use. fonts/inter_*: Inter is OFL, not CC0. textures/react.png, three.png and pmndrs.png are project logos. models/: bunny, suzi, pmndrs. hdri/*.exr (Poly Haven, CC0) is the only safe part.
  - Reachable: npm view returned 1.7.0, CC0-1.0, modified 2026-10-16. git ls-remote: main d8709a9b. Shallow clone worked (159 MB). Raw LICENSE returned 200. Raw nidorx/matcaps and emmelleppi/matcaps README returned 200; their LICENSE files returned 404.
  - Verdict: Keep the HDRIs only. This refutes the searcher's key use case, brass diya and conch matcaps: the matcaps have unknown authorship and must not be used. Make brass and shell materials with MeshPhysicalMaterial and an HDRI instead.

### Dropped

- **Sacred-Geometry generator** (evoluteur/sacred-geometry). The licence is fine, but the repo adds nothing we cannot write in an hour, and the imagery is off-message for a Gita channel. Write a small in-house module for concentric circles, lotus petal rings and yantra-style squares instead.
- **Sri-Yantra builder** (evoluteur/sri-yantra). The data carries share-alike, and the theology conflicts with the no-deity rule (it is the yantra of Tripura Sundari). If the owner ever wants a yantra, compute our own coordinates from the published constraint equations.
- **vintageart: public-domain ornaments traced to SVG** (WelshPixie/vintageart). The licence is fine, but the style clashes with Indian scripture and the set is inconsistent. Not worth the 396 MB clone.
- **Rough.js** (npm:roughjs (github rough-stuff/rough)). I agree with the searcher: licensed, but it pushes toward the '2nd grade drawing' look the owner rejected.
- **LYGIA shader library** (npm:lygia (github patriciogonzalezvivo/lygia)). Confirmed non-commercial without sponsorship. Correctly rejected.
- **Inkblade living-ink PixiJS demo** (jpcpais01/Inkblade). Confirmed: no licence. Use it as a technique reference only; copy nothing.

### Found by the checker

The checker added these and checked their licences the same way. Each note says whether it recommends the source.

- Tegaki: handwriting animation for any font, including correctly shaped Devanagari. Repo gkurt/tegaki, npm 'tegaki' 1.1.0. MIT per /LICENSE ('MIT License, Copyright (c) 2026 Gokhan Kurt') and npm view. Bundled font data is OFL-1.1 per packages/renderer/FONTS-LICENSE.md, including Tillana for Devanagari; Hershey Script carries its own permissive terms. Verified by a shallow clone, last commit 2026-10-11. There is a Remotion example (examples/remotion/src/Root.tsx) using time={{mode:'controlled', value: progress, unit:'progress'}}, so it is frame-deterministic. The CLI shapes text with HarfBuzz WASM, and the generator accepts a local TTF/OTF ('--font-file'), so a Tiro Devanagari Sanskrit bundle could be built. The generator needs Bun, and npm 'tegaki-generator' is a stale 0.0.1, so build it from the repo. Caveat: Devanagari stroke order is heuristic, not traditional. This is the best fit for shlokas that write themselves on screen.
- harfbuzzjs: HarfBuzz text shaping in WASM. Repo harfbuzz/harfbuzzjs, npm 'harfbuzzjs' 1.6.3. MIT per raw main/LICENSE ('Copyright (c) 2019-2026 The harfbuzzjs project authors. Permission is hereby granted, free of charge...'). Needed if we brush-reveal Devanagari glyph outlines ourselves with sumi strokesFromSvg or perfect-freehand: opentype.js (MIT, 2.0.0) does not reliably shape Indic conjuncts and reph, while harfbuzzjs returns correct glyph IDs and positions to pull outlines from the font.
- Watercolorizer: Tyler-Hobbs-style layered-polygon watercolour. Repo 32bitkid/watercolorizer, npm '@watercolorizer/watercolorizer' 2.2.0. ISC per libs/watercolorizer/LICENSE.txt (raw 200) and the npm tarball LICENSE.txt ('Copyright (c) 2024, J. Holmes. Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted'). CPU-only, outputs polygon layers we can render as SVG, and takes a 'random' option (verified in dist/watercolorizer.d.ts), so it can be seeded for determinism. Good for soft saffron dawns, river and lotus-pond washes behind ink line. Its example images are hosted off-GitHub (j.holmes.codes), so I could not see them.
- @react-three/drei: three.js helpers. Repo pmndrs/drei, npm '@react-three/drei' 10.7.9. MIT per raw master/LICENSE ('MIT License, Copyright (c) 2020 react-spring'). Its Outlines component gives inked edges on 3D silhouettes (chariot, tree); Stars, Sparkles and Cloud provide night-sky and dust layers inside @remotion/three. Animated parts must be driven from useCurrentFrame, not the R3F clock.

