# The three benchmark Shorts (10 Nov 2026)

AK asked for one benchmark Short each for **Indica Atlas (English, India)**, **UPSC Mains (Hindi)** and **Moat Atlas
(English, US)**, built in the Reveal Loop ([`SHORTS_FORMAT.md`](SHORTS_FORMAT.md)). These are the reference for every
later Short on those channels: copy the nearest one and change the story.

| Id | Channel · series | Title | Length | Picture |
| --- | --- | --- | --- | --- |
| `ia-southtip` | Indica Atlas · Not Where You Think | Kanyakumari is NOT India's southern tip | 30.6 s | One continuous zoom, from the map of India to the coast of Great Nicobar |
| `um-parisiman` | UPSC Mains (Hindi) · आँकड़ों में संविधान | लोक सभा की सीटें आज भी 1971 से तय हैं | 39.4 s | 3D seat map, people-per-MP dots, freeze timeline, the April 2026 vote |
| `ma-tsmc` | Moat Atlas · From Orbit | This was empty Arizona desert in 2020 | 35.1 s | Satellite before/after wipe, investment ladder, globe |

**Status (10 Nov 2026): voiced with MiniMax, timed to the voice, rendered and muxed** to
`out/hyperframes/<id>-final.mp4` (not in git). All three pass the Shorts gate with no FAIL, and each ends on its opening
frame. Still to do before publishing:
- **AK listens to all three.** The session that built them cannot hear. It checked every line by transcription
  (`shorts_build.py verify`): the English lines match the script word for word, and the Hindi lines match in content.
- **A native speaker ear-checks the Hindi** (pronunciation of चौरासीवें, "चाहिए थे तीन सौ बावन", and the pace), as in
  `AUDIO_TRACKS.md`.
- **The music bed** is a quiet code-made pad at about −26 dB under the voice; swap it for the channel's own bed if there
  is one.

## Build

```sh
python3 hyperframes/tools/shorts_build.py story all     # voice each beat (MiniMax), write story.js timings and check.json
python3 hyperframes/tools/shorts_build.py verify all    # transcribe each voiced beat and print it under the script line
python3 hyperframes/tools/hf.py sync shorts
python3 hyperframes/tools/shorts_build.py check all     # the Shorts gate (scripts/shorts_check.py)
python3 hyperframes/tools/hf.py check ia-southtip       # HyperFrames lint, layout and contrast
python3 hyperframes/tools/hf.py render ia-southtip      # -> out/hyperframes/ia-southtip.mp4 (silent picture)
python3 hyperframes/tools/shorts_build.py mux ia-southtip   # -> out/hyperframes/ia-southtip-final.mp4 (voice + quiet pad)
```

- **Voice key:** `MINIMAX_API_KEY` in the environment (on the Mac), or a key the cloud session's proxy adds to
  `api.minimax.io`. `--no-tts` builds with estimated timings.
- **The voice is not deterministic.** On the first build one Hindi beat came back with its sentence said twice (9.9 s
  for a 4.3 s line). The tool now voices a beat again when it is far slower than the others for its text, cuts pauses
  over 0.42 s to 0.3 s, and `verify` prints what was actually said. Run `verify` after every voiced build.
- **Scripts** live in `hyperframes/tools/shorts_build.py` (`S[...]`): each beat is a list of (what the voice says, the 2–4
  word caption). The page (`hyperframes/shorts/<id>/index.html`) hangs every picture change on a spoken phrase with
  `A("b4", "phrase")`, so the picture follows the voice whatever its length. If you reword a line, update the phrases the
  page uses, or the page will not load.
- **Shared pieces:** `hyperframes/shared/shorts.css` (1080 × 1920 layout, caption band, safe areas),
  `shared/lib/shorts.js` (clock, captions, phrase timing), `tools/atlas_base.py` (shaded terrain base maps).
- **Render time** on the cloud container: about 10–20 minutes a Short.

## `ia-southtip` · Indica Atlas

**Topic test.** Familiar: every Indian learnt "Kanyakumari, the southern tip". Hidden: the real tip is 1,800 km away and
eleven times closer to Indonesia. Send: "did you know Kanyakumari isn't the southern tip?"

**Script** (voice: `English_Diligent_Man`)
> This is Kanyakumari. The southern tip of India. Right? · Not quite. · It's the tip of the mainland. · The real southern
> tip is eighteen hundred kilometres away. Past Sri Lanka, across the Bay of Bengal. · This is Indira Point, on Great
> Nicobar Island. · From here, Indonesia is just a hundred and sixty kilometres away. Eleven times closer than
> Kanyakumari. · In two thousand four, the earthquake sank this coast by about four metres. Its lighthouse still stands. ·
> So the next time someone points to the bottom of the map and says, → *(loops to "This is Kanyakumari…")*

| On screen | Value | Source |
| --- | --- | --- |
| Mainland's southern limit | 8°4′N | NCERT Class 9 Geography, ch. 1; Incredible India: "the southernmost tip of the mainland of India" |
| Indira Point | 6°45.2′N, 93°49.6′E, Great Nicobar | DGLL (Directorate General of Lighthouses and Lightships) lighthouse record |
| To Kanyakumari | ≈ 1,800 km (1,800.6 km) | Great-circle distance, our measurement (lighthouse to 8.078°N, 77.55°E) |
| To Indonesia (Rondo Island) | ≈ 160 km (160.9 km) | Great-circle, our measurement; Rondo base point TD.177, 06°04′30″N 95°06′45″E (Indonesia PP 38/2002) |
| 11× | 1,800.6 ÷ 160.9 = 11.2 | Our arithmetic |
| Coast sank ≈ 4.25 m, 26 Dec 2004 | 4.25 m | DGLL: "Tsunami reduced the height of Indira Point by 4.25 meters"; Bilham (2005): 4.25 ± 0.2 m |
| Lighthouse still stands | unmanned, solar | DGLL |
| Terrain | shaded relief | AWS Terrain Tiles (Terrarium), `tools/atlas_base.py`; no borders are drawn |
| Satellite | 11 Jan 2026 | Contains modified Copernicus Sentinel data 2026 (`S2B_46NEN_20260111_0_L2A`) |

Not used on purpose: the "145 km / 80 nautical miles" figure found online (uncited, too low), and NCERT's "submerged"
(the lighthouse stands).

## `um-parisiman` · UPSC Mains (Hindi)

**Topic test.** Familiar: लोक सभा की 543 सीटें. Hidden: the split still rests on the 1971 census, one Rajasthan MP stands for
27 lakh people against under 17 lakh in Kerala, and the bill to change it fell in April 2026. Send: an answer-ready set of
figures for GS-II.

**Script** (voice: `hindi_male_1_v2`)
> लोक सभा की सीटें आज भी इकहत्तर की जनगणना से तय हैं। · तब से आबादी दोगुनी से ज़्यादा हो चुकी है। · नतीजा? राजस्थान में एक सांसद
> औसतन सत्ताईस लाख लोगों का प्रतिनिधि है। · केरल में, सत्रह लाख से भी कम। · यह रोक इसलिए लगी थी कि राज्य जनसंख्या स्थिर करने पर ज़ोर
> दें। · चौरासीवें संशोधन ने इसे दो हज़ार छब्बीस के बाद की पहली जनगणना तक बढ़ा दिया। · अप्रैल दो हज़ार छब्बीस में इसे बदलने वाला विधेयक
> लोक सभा में गिर गया। चाहिए थे तीन सौ बावन वोट, मिले दो सौ अट्ठानवे। · अब नज़र जनगणना दो हज़ार सत्ताईस पर है। और तब तक, →
> *(loops to "लोक सभा की सीटें आज भी…")*

| On screen | Value | Source |
| --- | --- | --- |
| Seats frozen on the 1971 census | Art. 82, third proviso; Art. 81(3) | Constitution of India |
| 543 seats; Rajasthan 25, Kerala 20 | | Election Commission of India (seat table read from a secondary list: ECI's site refused the fetch) |
| Population 54.8 crore (1971) → 121.1 crore (2011) | 548,160 thousand; 1,210,854,977 | Registrar General (Economic Survey 2004-05, Table 9.7); Census 2011 |
| "दोगुनी से ज़्यादा", 2.2× | 121.1 ÷ 54.8 = 2.21 | Our arithmetic |
| Rajasthan 27.4 lakh per MP | 68,548,437 ÷ 25 = 27.42 lakh | Census 2011 ÷ seats, our arithmetic (highest among states with 10+ seats) |
| Kerala 16.7 lakh per MP | 33,406,061 ÷ 20 = 16.70 lakh | Same (lowest among states with 10+ seats) |
| Why the freeze | "as a motivational measure to enable the State Government to pursue the agenda for population stabilisation" | Statement of Objects and Reasons, Constitution (Ninety-first Amendment) Bill, 2000 (became the 84th Amendment Act) |
| 1976: freeze begins | 42nd Amendment Act, 1976 | The 84th SOR: "inserted by the Constitution (Forty-second Amendment) Act, 1976 as a measure to boost family planning norms" |
| "वर्ष 2026 के पश्चात् की गई पहली जनगणना" | Art. 82, as amended by the 84th Amendment Act, 2001 | Official Hindi wording, from the Statement of Objects of the 131st Amendment Bill, 2026 |
| 131st Amendment Bill fell, 17 Apr 2026 | 298 for, 230 against, 352 needed of 528 present and voting | PRS Legislative Research bill track; press reports |
| The bill's proposal: at most 850 seats | 815 from states + 35 from Union territories | PRS Legislative Research bill track, Constitution (131st Amendment) Bill, 2026 |
| "54 वोट कम" | 352 − 298 | Our arithmetic |
| Census 2027 | reference date 1 March 2027 | Notification of 16 Jun 2025 |
| Map | state outlines | `india-maps-data` (community data, unverified), as in sample s15 |

**Re-check before publishing.** The law is in motion: Parliament could take up a revised bill at short notice. The Short
carries "स्थिति: 10 नवंबर 2026" on its last source line; update that date and the facts if anything has changed. The tone is
neutral and exam-style: it states what the Constitution says and what happened in the House, and takes no side.

## `ma-tsmc` · Moat Atlas

**Topic test.** Familiar: the iPhone. Hidden: its chips are now made on what was bare Arizona desert six years ago, a
plan that grew from $12 billion to $265 billion. Send: the before/after itself.

**Script** (voice: `English_captivating_female1`)
> In twenty twenty, this was empty Arizona desert. · Watch. · A warehouse? A data center? No. · This is where Apple now gets
> chips for the iPhone. Over a hundred million chips this year. · The builder is TSMC, from Taiwan. Its plan here started at
> twelve billion dollars. Now it's two hundred sixty-five billion. · Why here? In twenty nineteen, ninety-two percent of the
> world's most advanced chip capacity sat on one island. · But here's the catch. The newest chips are still made in Taiwan.
> Arizona's next fab starts in twenty twenty-seven. · And six years ago? → *(loops to "In twenty twenty, this was empty…")*

| On screen | Value | Source |
| --- | --- | --- |
| Before / after | 27 Apr 2020 and 7 Nov 2026 | Contains modified Copernicus Sentinel data 2020, 2026 (`S2B_12SUC_20200427_1`, `S2C_12SUC_20261107_0`); 27 Apr 2020 is 18 days before the project was announced |
| 100M+ chips for Apple in 2026 | "producing more than 100 million chips for Apple in 2026", for iPhone, iPad and Apple Watch | Apple newsroom, 20 Oct 2026 |
| $12B → $40B → $65B → $165B → $265B | announced totals, 2020, 2022, 2024, 2025, 2026 | TSMC releases (15 May 2020, 6 Dec 2022, Apr 2024, 4 Mar 2025); City of Phoenix, 16 Jul 2026 |
| 92 % of the most advanced chip capacity on one island, 2019 | "100% of the world's most advanced (below 10 nanometers) … capacity is currently located in Taiwan (92%) and South Korea (8%)" | SIA / BCG, April 2021 (2019 data); the year is on screen |
| Arizona 4 nm, Taiwan 2 nm | Fab 1 "in volume production since late 2024" on 4 nm | TSMC, 4 Mar 2025; 2 nm in Taiwan per TSMC |
| Next fab: 3 nm, 2027 | "Volume production will begin in third quarter 2027" | TSMC Q3 2026 results call, 15 Oct 2026 |

Wording chosen with care: "Apple now gets chips for the iPhone" (Apple names the products, not the chip), "its plan" (the
$265B is an announced total, not money spent), "chip capacity" (the SIA figure is capacity below 10 nm). Not said: that
Nvidia's finished AI chips are made here (only wafers, from Oct 2025), or that Arizona makes the most advanced chips.

## What these three add to the format

1. **The first frame is the subject, moving**: a satellite image, a map with a pin, a 3D map. None opens on text.
2. **The reveal is a camera move, not a slide**: the wipe, the dive across the Bay of Bengal, the vote bar stopping short
   of the line.
3. **The loop is also a picture loop**: each Short ends on its opening frame, so the replay is seamless.
4. **One source line at the top, changed with the picture**, in 28 px type; "our measurement" or "हमारी गणना" on anything we
   computed.
5. **Captions of 2–4 words** in the middle-lower band, the key word in the channel's accent colour; Hindi in Teko.
