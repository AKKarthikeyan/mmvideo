# Vox Motion+ licences (18 Oct 2026)

Everything the kit and the demo reel use, with its licence and where it came from. Media must stay usable in a monetised
YouTube video: public domain, CC0, CC BY (credit recorded), code-drawn, or our own primary documents as short excerpts.
Re-check a source page before upload if anything changes.

## npm packages added (exact versions; nothing existing was upgraded; backups: package.json.bak1018_voxplus, package-lock.json.bak1018_voxplus)

| Package | Version | Licence | Use |
|---|---|---|---|
| @remotion/transitions | 4.0.529 | Remotion License (same terms as `remotion` itself, already in use; the `cube()` presentation is paid and is not used) | TransitionSeries, fade/slide/wipe |
| @remotion/motion-blur | 4.0.529 | MIT | available for CameraMotionBlur/Trail (the kit uses its own SVG directional blur by default: cheaper) |
| @remotion/noise | 4.0.529 | MIT (pulls simplex-noise 4.0.1, MIT) | available for organic drift |
| @remotion/shapes | 4.0.529 | MIT | available for shape helpers |
| d3-geo | 3.1.1 | ISC (pulls d3-array 3.2.4 ISC, internmap 2.0.3 ISC) | map projection and paths |
| @fontsource/dm-serif-display | 5.3.0 | font: SIL OFL 1.1 | headline serif |
| @fontsource/inter | 5.3.0 | font: SIL OFL 1.1 | sans: stickers, labels |
| @fontsource/ibm-plex-mono | 5.3.0 | font: SIL OFL 1.1 | source lines |
| @fontsource/permanent-marker | 5.3.0 | font: Apache 2.0 | marker handwriting |

Fonts are embedded in rendered video only (no font files are redistributed), which both licences allow.

## Images

| File (public/voxplus/) | What | Source | Licence | Credit line |
|---|---|---|---|---|
| media/loom_draper_1987.jpg (from src_dl/draper_looms_1987.jpg) | Draper looms, Bamberg Cotton Mill, Bamberg, South Carolina, 1987 | Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Draper_looms.jpg ; Library of Congress Prints and Photographs, HAER, digital ID hhh.sc0770 | Public domain (US federal government work, Historic American Engineering Record) | "Jack E. Boucher, HAER / Library of Congress" (courtesy, not required) |
| media/looms_radcliffe_1912.jpg (from src_dl/northrop_radcliffe_1912.png) | Electrically-driven Northrop looms, C.W.S. Radcliffe weaving shed, 1912 | Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Electrically-Driven_Northrop_Looms_at_the_C.W.S._Radcliffe_Weaving_Shed_(1912).png (from "The story of the C.W.S.", 1913, via archive.org) | Public domain (published 1913) | none required |
| media/candy_box_sticker.png (from src_dl/white_box_chocolates.jpg) | A plain white box of milk chocolates (no logo or brand visible in the frame; cut out and stickered by tools/prep_media.py) | Wikimedia Commons, https://commons.wikimedia.org/wiki/File:White-Box-of-Chocolates.jpg , by Evan-Amos, 2011 | CC0 1.0 | none required ("Evan-Amos, CC0" courtesy) |
| src_dl/laborsaving_looms_1907.jpg | downloaded, NOT used (trade-show booth with company signage) | Wikimedia Commons, Draper catalogue 1907 | No known copyright restrictions | n/a |
| docs/bh1985_looms.png, docs/bh1986_moat.png | Short excerpts of Berkshire Hathaway's 1985 and 1986 Chairman's letters | Rendered by tools/letter_shot.py from the official pages https://www.berkshirehathaway.com/letters/1985.html and /1986.html (these years are published as HTML, not PDF; only 2004+ letters are PDFs). Text untouched; a typewriter monospace face is set for the browser's default monospace. | Berkshire Hathaway copyright ("copyrighted material reproduced with permission" on the letters page). Used as a short highlighted excerpt with commentary (fair dealing / fair use), credited on screen. | "Berkshire Hathaway · 1985 letter" on screen |
| map/south_asia_ind.geojson | Country shapes, India point of view (India's official boundary) | Natural Earth 10m admin 0 countries, India POV, v5.1.1, https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries_ind.zip | Public domain | "Map: Natural Earth (India view)" (courtesy) |
| tex/paper.jpg, tex/paper_dark.jpg, tex/grain.png | Paper and grain tiles | Drawn in code (tools/prep_media.py) | ours | none |

## Audio (public/voxplus/audio/; all CC0 1.0, each licence checked on the Freesound page: the page links only to creativecommons.org/publicdomain/zero/1.0)

| File | Title / creator | Landing page | Use |
|---|---|---|---|
| sfx_paper_slide_kingofgamers.wav | "Paper slide" / Kingofgamers_cz | https://freesound.org/people/Kingofgamers_cz/sounds/352914/ | `paper` |
| sfx_underline_stroke_zembacraftworks.wav | "Underlining Stroke on Paper" / zembacraftworks | https://freesound.org/people/zembacraftworks/sounds/428338/ | `highlighter` |
| sfx_marker_circle_elliottklein.wav | "Sharpie marker drawing circle 01.wav" / elliott.klein | https://freesound.org/people/elliott.klein/sounds/321137/ | `circle` |
| sfx_thump_stamp_mpuffenbarger.wav | "Thump.mp3" / mpuffenbarger | https://freesound.org/people/mpuffenbarger/sounds/683031/ | `stamp` |
| sfx_shutter_click_cabledmess.wav | "Camera shutter analogue film SLR 1/4 01" / cabled_mess | https://freesound.org/people/cabled_mess/sounds/338220/ | `click` |
| sfx_whoosh_cartoony_branrainey.wav | "Cartoony whooshes" / BranRainey | https://freesound.org/people/BranRainey/sounds/142348 | `whoosh` (copied from premium/a01v3/audio, licence row there) |
| sfx_whoosh_deep_kinoton.wav | "Deep Whoosh #1" / Kinoton | https://freesound.org/people/Kinoton/sounds/351256 | `whooshDeep` (copied) |
| sfx_pop_conarb13.wav | "Pop Sound" / ConarB13 | https://freesound.org/people/ConarB13/sounds/401542 | `pop` (copied) |
| sfx_coin_ding_greenvwbeetle.wav | "Ding 1" / greenvwbeetle | https://freesound.org/people/greenvwbeetle/sounds/241288 | `ding` (copied) |
| music_06_curious_ambience_reg1n0ld.wav | "Curious Ambience.wav" / Reg1n0ld | https://freesound.org/people/Reg1n0ld/sounds/503244/ | TEMP music bed of the demo reel (copied) |
| music_07_strings_with_percussion_buythefield.wav | "Strings with Percussion.wav" / BuytheField | https://freesound.org/people/BuytheField/sounds/476808/ | spare bed (copied) |

Raw downloads (MP3 previews) sit next to the WAVs; `sfx_sources.json` holds the Openverse ids and URLs. No attribution is
legally required for CC0. Optional description line: "Sound effects and music: CC0 via Freesound.org (Kingofgamers_cz,
zembacraftworks, elliott.klein, mpuffenbarger, cabled_mess, BranRainey, Kinoton, ConarB13, greenvwbeetle, Reg1n0ld)."
Nobody has listened to the new SFX yet; AK or a human must listen before use. YouTube Content ID can still flag CC
material someone else registered: upload unlisted first.

## Code reused (read-only copies, no files edited)
- Camera keyframing and parallax layer: pattern from src/premium/a01v3/kit.tsx (camAt / Layer).
- Music ducking curve: src/premium/a01v3/Cold.tsx (`musicVol`).
- Grain tile approach: src/premium/common.tsx (`Grain`), re-drawn in code here.
