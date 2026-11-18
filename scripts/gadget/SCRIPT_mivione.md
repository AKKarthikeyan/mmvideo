# GK001 — "An Indian Earbuds Brand Just Made a Phone" (Mivi One 5G)

Built 21 Oct 2026. First episode of a tech-launch Shorts series for India, modelled on the format of
youtube.com/@TechyorNot/shorts (AK liked it, 21 Oct 2026: "This video format is good... Can we make one?"; AK picked
"Tech launches, India" over Moat & Margin or Data Kadai).

**Our version of the format (not a copy of their look):** one product, ~75 s, the picture changes on every phrase,
the product is drawn in code and stays on screen between beats, warm paper + heavy black capitals + one cobalt accent,
italic serif asides, mono labels, episode tag + progress bar, a source line at the bottom of every spec beat, and a
question at the end ("Worth it, or not?") for comments.

**Settled by AK (21 Oct 2026, after watching this draft):** "Format works. Keep the name Gadget Kadai and the sign-off,
and plan the next episodes." Series name **Gadget Kadai** (tags GK001, GK002...), sign-off **"Worth it, or not?"**.
Accent stays cobalt #2348E0. Voice is the house voice (MiniMax English_Diligent_Man); whisper hears "Mivi" as "Miwi".
Next episodes: `scripts/gadget/EPISODES.md`.

## Files (Mac Mini, /Volumes/DarwinSSD/MMVideo)
- Script data: `src/gadget/mivione/script.json` (spoken lines, pauses, reading holds)
- Voice: `scripts/gadget/gk_voice.py` -> `public/gadget/mivione/vo_raw.mp3` (one continuous MiniMax read)
- Timing: `scripts/gadget/gk_align.py` (mlx-whisper + difflib onto the script; trims gaps to 0.28 s; adds holds)
  -> `public/gadget/mivione/vo.wav`, `src/gadget/mivione/timing.json`
- Film: `src/gadget/` (kit.tsx look, phone.tsx drawn phone, props.tsx line art, mivione/Short.tsx beats), entry
  `src/gadget/index.ts`, composition `GK-mivione` (1080x1920, 30 fps)
- Render: `scripts/gadget/gk_render.sh mivione [draft]` -> `out/gadget/mivione/GK-mivione.mp4` (-14 LUFS) + `_phone.mp4`
- Music/SFX: existing CC0 files in `public/voxplus/audio` (see `sfx_sources.json`)

## Script (as spoken)
| Beat | Narration | On screen |
|---|---|---|
| b01 | Mivi, the Indian earbuds brand, just made its first phone. | AN INDIAN EARBUDS BRAND (from frame 1), earbuds line art -> JUST MADE A PHONE., green phone rises |
| b02 | And it's made in Hyderabad. | made in HYDERABAD., Charminar line art, pin, 17.38° N · 78.49° E |
| b03 | This is the Mivi One 5G. | MIVI ONE 5G, tag MIVI'S FIRST PHONE |
| b04 | Here's the interesting part. It runs plain Android 16. | aside, phone flips to its clean home screen, PLAIN ANDROID 16 |
| b05 | No bloatware. And Mivi promises two big updates, all the way to Android 18. | NO BLOATWARE., grey app tiles crossed out and fall; UP TO ANDROID 18, ladder 16 -> 17 -> 18 |
| b06 | And yes, an earbuds company kept the headphone jack. | bottom edge of the phone, ring on the jack, 3.5MM HEADPHONE JACK, USB-C label |
| b07 | Inside, there's a Snapdragon 4 Gen 2, built on a 4 nanometre process. | dark: chip with traces, SNAPDRAGON 4 GEN 2, 4NM · 2× A78 + 6× A55 |
| b08 | A 6,000 mAh battery, in a body just 9.15 millimetres thin. | battery fills, count to 6,000; side view with arrows, 9.15MM · 210 g |
| b09 | And the charger is still in the box. | box opens, 18W two-pin charger rises, CHARGER INCLUDED, "yes, still." |
| b10 | The main camera is a 50 megapixel Samsung ISOCELL sensor, with an f/1.8 lens. | camera island close-up with slow push-in, 50MP, tag f/1.8 LENS |
| b11 | But there's a catch. | "but there's a" CATCH. |
| b12 | The 6.75 inch screen is an HD+ LCD. That's 720p, at 450 nits. | diagonal on the screen, 6.75"; HD+ LCD · 1600 × 720 · 120 Hz; pixel grid 720P; sun, 450 NITS |
| b13 | And charging tops out at 18 watts. | screen turns to a slow charge, 18W MAX · USB PD |
| b14 | Mivi is also betting on service. 500-plus service centres, and free pickup and drop across 19,000-plus pin codes. | BETTING ON SERVICE; 500 dots (one per centre); pickup -> fix -> drop loop; 19,000+ |
| b15 | It starts at ₹13,999 on Flipkart, with 128 GB in every model, in five colours. | price sticker, three variant cards, five phones fan out in the five colours |
| b16 | So Mivi took a budget phone, cleared out the junk apps, kept the headphone jack, and built it in Hyderabad. | THE FORMULA: BUDGET PHONE, − JUNK APPS, + 3.5 MM JACK, HYDERABAD-MADE, ₹13,999 |
| b17 | Worth it, or not? | WORTH IT, switch flipping, "or not?", Gadget Kadai · tell us in the comments |

## Fact ledger (checked 21 Oct 2026)
Primary: Mivi's product page https://www.mivi.in/mivi-one ("More Specs" panel). Note: the page carries the line
"Figures to be updated", so re-check the page on the day of publishing.

| Claim | Value | Source |
|---|---|---|
| Made in | Hyderabad, India | mivi.in/mivi-one (page title "made in Hyderabad"; spec "Made in Hyderabad, India") |
| Mivi's first phone | debut smartphone | secondary: 91mobiles, GSMArena, nokiamob (25 Sep 2026: "Mivi enters the smartphone market"); Mivi's page does not say "first" |
| Software | stock Android 16, two OS upgrades, "Guaranteed upgrade to Android 18", "No bloatware" | mivi.in |
| Headphone jack | 3.5 mm, plus USB Type-C | mivi.in (Ports) |
| Chip | Snapdragon 4 Gen 2, 4 nm, 2× 2.2 GHz + 6× 2.0 GHz (2× Cortex-A78 + 6× Cortex-A55) | mivi.in |
| Battery | 6,000 mAh | mivi.in |
| Thickness, weight | 9.15 mm, 210 g | mivi.in |
| Charging | 18 W USB PD, charger in the box | mivi.in |
| Main camera | 50 MP Samsung ISOCELL, f/1.8, PDAF | mivi.in |
| Display | 6.75-inch (6.745") HD+ in-cell LCD, 1600 × 720, 120 Hz | mivi.in |
| Brightness | 450 nits (the page does not say peak or typical) | mivi.in |
| Service | 500+ service centres in India; free pickup & drop across 19,000+ pin codes | mivi.in (Mivi Care+) |
| Storage | 128 GB in every variant; RAM 4 / 6 / 8 GB | mivi.in |
| Colours | Blue, Pink, Green, Burgundy, Navy Blue (five) | mivi.in |
| Price | ₹13,999 (4+128), ₹15,999 (6+128), ₹16,999 (8+128) | Flipkart listing linked from mivi.in, seen 21 Oct 2026. Launch list price was ₹14,999 / 15,999 / 16,999 (GSMArena, FoneArena). Prices move: re-check before publishing |

Not claimed on purpose: no comparison with other phones, no "best", no performance or camera-quality judgement,
no "no ads" (Mivi's page says "no bloatware", not "no ads").

## Visual sources
The phone, earbuds, Charminar, chip, box and charger are drawn in code (generic shapes; the phone follows the
Mivi One's look: pill camera island with two lenses, flat sides, five colours). No Mivi photos or logos are used.
Fonts: Archivo Black and Instrument Serif (SIL OFL, licences in `public/gadget/fonts`), IBM Plex Mono, Inter.
