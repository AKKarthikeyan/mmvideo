# The Inner Chariot: North Star

**The Inner Chariot** (@InnerChariotIN). *The Gita, Upanishads and epics in plain words. Chapter and verse on screen.*

Written 15 Nov 2026, from:
- the cross-check of AK's pasted market playbook (`research/MARKET_PLAYBOOK_CROSSCHECK_2026-11-15.md`);
- a visual-format scout of the closest competitors;
- the existing plan, style guide and house rules (`INNER_CHARIOT_CONTENT_PLAN.md`, `INNER_CHARIOT_STYLE_GUIDE.md`, `DHARMA_CHANNEL.md`).

This page is the test every video, title and build decision has to pass. **When a later doc disagrees with it, this page wins until AK changes it.**

---

## 1. Why we exist (one sentence)

**To be the place people trust to tell them what the Indian texts actually say: the verse on screen, the translator named, our reading marked, told as a story worth watching.**

## 2. Who we make it for

**Primary viewer:** Meera, 29, Bengaluru or New Jersey. She is English-first, Indian by family, and a little embarrassed she has never read the Gita. She arrives with a problem (overthinking, anger, grief, a family fight, a film she just saw), not with a scripture.

**Also welcome:**
- her parents, who know the stories and want the source;
- the curious non-Indian viewer who found Eternalised or Einzelgänger and wants the Indian shelf.

**Not our viewer:** someone looking for a guru, a miracle, a prediction, or proof that the Vedas invented aircraft.

## 3. The promise: five things every video does

1. **The verse is on screen**, with its chapter and verse and the named public-domain translator ("AFTER SHRI PUROHIT SWAMI, 1935"). None of the channels checked on 24 Oct or 15 Nov showed the translator's name on screen. udbhava comes closest: it shows the Sanskrit and the verse number, and its descriptions credit Shankara and Krishnananda as sources.
2. **Our reading is marked** as OUR NOTE. The school is named when it matters ("Shankara reads this as…").
3. **One idea the viewer can use tonight**, said plainly, without a sermon.
4. **A story, not a lecture.** One of the eight episode shapes in the style guide. A real question at 0:00, and a turn at least every 45 s.
5. **Honest about itself:** drawn in code, synthetic voice, nobody here speaks for God. This is said in the video, in the description, and in the YouTube Studio AI box.

## 4. What we will never do

- **Speak as a god**, or put words in a deity's mouth.
- **Draw a deity's face.** Krishna and the Ramayana figures appear only as backlit silhouettes; every other deity appears as a symbol or light (rule 5).
- **Use an image model for any sacred figure.** Never post an AI slideshow.
- **Make pseudoscience claims** ("the rishis knew quantum physics"), or mock any tradition, telling or devotee.
- **Quote a translation that isn't public domain** in India and the US. If no clean translation exists, we paraphrase and mark it OUR NOTE with the Sanskrit verse number.
- **Clip a guru's lecture,** or re-upload anyone's audio.
- **Cite an unsourced statistic.** About a third of the pasted playbook's numbers turned out to be vendor marketing or untraceable.

## 5. The look: Lamplight and line art, plus the manuscript card

The scout scored six options from 1 to 5 on seven criteria: retention evidence, distinctiveness, fit with rule 5, feasibility in code, 9:16 Shorts, inauthentic-content risk (5 = low risk) and readability.

| Option | Total out of 35 |
| --- | --- |
| **Hybrid: Lamplight + ink + manuscript** | **31** |
| Gold line art alone | 29 |
| Manuscript type and diagrams alone | 28 |
| Lamplight alone | 25 |
| Folk-art idioms | 20 |
| Parallax over classical paintings | 19 |

Retention for each option is judged from view counts against channel size and from video length, because retention data isn't public.

| Layer | Used for | Why |
| --- | --- | --- |
| **Lamplight silhouettes** (the Gita film's look, kept as the primary) | Story beats: Kurukshetra, the forest hut, the court | Nobody else makes rim-lit landscape cinema. It fits rule 5 by design. It is code-drawn, so it carries no inauthentic-content risk |
| **Line art on warm paper** (decided 16 Nov; absorbs "ink on warm paper") | "The version you know", the present day (the viewer's own life), recaps, diagrams, maps; Shorts that tell a story | It reads instantly on a phone and its figures can act: walk, leap, grow, squeeze through a mouth. It is the Sundara Kandam pilot's style, on the MIT `line-art-animation` library (vendored in `src/katha/lineart/vendor`) |
| **Manuscript verse card** (new; replaces the flat verse card) | Every verse | A palm leaf or pothi page, with the Devanagari first and then the English, and the translator's name large. **This is our signature** |

**The mix (AK, 16 Nov 2026).** After a side-by-side test of the same IC-01 beat in both looks (`The Inner Chariot/Docs/Style test 2026-11-16/` on the Mini), AK chose to use both. The rule that keeps it one channel, not two stitched together:
- **Lamplight is the source's world:** what the text itself tells (Valmiki's Ayodhya and forest, Kurukshetra, the court). Solemn beats, and every long video's signature moments.
- **Line art on warm paper is the retelling and the present:** the version people grew up with (the TV serial, later tellings), the viewer's own life ("you at 2 a.m."), recaps, diagrams and maps. Story-for-teens series (Kamban's Sundara Kandam) may stay in line art throughout.
- **The manuscript card serves both:** every verse, in either look.
- **Switch only at a boundary,** with one of the kit's transitions (the palm-leaf turn, a lamp flare, a split frame like IC-01's Ahalya). Never cut between looks in the middle of a beat.
- **Faces:** the line-art figures are faceless for now (a profile, no eye or mouth), the same as rule 5 for silhouettes. Whether simple line faces are allowed is AK's call (section 10).

**Ruled out, and why:**
- **Parallax over Ravi Varma or miniature paintings:** they show deities' faces, which breaks rule 5. Splitting a painting into layers would need an image model to fill in behind the figures. It is also close to YouTube's "slideshow" category.
- **Folk-art puppets or Pattachitra:** these have painted faces. udbhava already owns the leather-puppet screen, and at least five new puppet-Ramayana channels appeared in Oct–Nov.
- **udbhava's glowing gold-on-indigo line art:** we must not look like it. Our ink layer is dark ink on *warm paper*.

Folk art stays as transitions only: the Kaavad doors and the phad pan, as the style guide already plans.

**The closest competitor to watch:**
- udbhava, "What Never Dies? Nachiketa and Death" (14:39, 456K views, 23.8K subscribers): leather-puppet style, the Sanskrit on screen, verse numbers cited, and a synthetic ElevenLabs voice that it discloses. It shows our model works. It also means the Katha chariot is no longer ours alone, so our version has to win on the named translation and on the modern question ("who is driving?").
- Reference videos for the feel:
  - Lotte Reiniger, *The Adventures of Prince Achmed* (1926), for silhouette acting and depth;
  - Eternalised, "Journey to Hell" (36:30), for pacing on still art;
  - udbhava, "The Two Birds", to know what to stay different from.

## 6. The economics we plan around (verified 15 Nov)

- **Long-form is the business; Shorts are the doorway.**
  - Creators keep 55% of long-form ad revenue but only 45% of the Shorts pool.
  - Mid-rolls need 8 minutes or more.
  - **From 1 Feb 2027, a new channel needs 1,000 subscribers plus 8,000 public long-form watch hours in 365 days** (Shorts views don't count toward the hours), **or 20M Shorts views in 90 days**, to join YPP.
  - From the same date, Shorts-pool revenue needs 10M Shorts views every 90 days.
- **English, education category, a global audience.** AIR Media-Tech's 300-channel study puts Education's median RPM at $10.22 against $2.30 overall. That was a client sample, so treat it as direction, not a forecast. India-only RPMs are a fraction of US and UK RPMs, though the exact ratios found are vendor estimates.
- **Length:** 12–20 minutes when the material earns it; never padded. The three breakout faceless videos run 13:50, 14:39 and 23:01.
- **Off-platform comes later:** a reading list with the free public-domain texts linked, then memberships. **Nothing paid before the channel is in YPP.**

## 7. The North Star metric

**Public long-form watch hours per week.**
- The 8,000-hour bar in 365 days works out to **about 154 hours a week**. That is the target once the catalogue reaches 20 long videos.
- It rewards exactly what the promise asks for: a story people stay with.

**Guard-rail metrics, checked every week:**
- **Retention at 30 s and at the midpoint.** Investigate any long video below 50% at 30 s.
- **Returning viewers** (do people come back?).
- **Comments that ask about a verse** (the trust signal).
- **Errors:** zero corrections needed after upload. Every correction is logged and pinned.

**Not a goal:** subscriber count on its own, or Shorts views on their own.

## 8. The series (the curriculum)

| Slot | Series | What it is |
| --- | --- | --- |
| **Tuesday long** | **The Inner Chariot** (mind series) | One modern problem, and what the Gita, Upanishads, Yoga Sutras or Ashtavakra Gita actually say about it (overthinking, anger, the witness, perfectionism, fear of death). Searchable and evergreen |
| **Friday long** | **Stories with Sources** | Valmiki, Not the Film; the Mahabharata to Ganguli's text; Upanishad stories; festivals a fortnight early |
| **Daily Short** | **One Verse** / **One Correction** / **One Word** | 25–45 s: one verse, one myth the text corrects, or one Sanskrit word. Two a week are cut from that week's long videos |

**The playlists form a path:** Start Here (the Gita film, which Gita to read) → the Gita by problem → the Upanishads → the Yoga Sutras and Vivekachudamani → the Ashtavakra Gita. Valmiki and the Mahabharata run alongside.

## 9. What we quote (rights checked 15 Nov)

**USE:**
- Gita: Shri Purohit Swami 1935; Sivananda, with attribution.
- Ramayana: Griffith.
- Mahabharata: Ganguli.
- Upanishads: Müller; Hume, 1921 first edition only.
- Yoga Sutras: Charles Johnston 1912 (Gutenberg #2526); J. H. Woods 1914.
- Vivekachudamani: Madhavananda 1921.
- Vishnu Purana: H. H. Wilson 1840.
- Tirukkural: G. U. Pope 1886.

**USE WITH CARE:** check the title page before anything goes on screen.
- Ashtavakra Gita: Lala Baij Nath, 1904/07.
- Mandukya with Gaudapada's Karika: M. N. Dvivedi 1894.

**PARAPHRASE ONLY:**
- Avadhuta Gita, Drg-Drshya Viveka, the Kashmir Shaivism sutras, Tattva Bodha, Chitrakavya.
- Shiva Purana and Kanda Puranam material.
- Jung: his English translations are still in copyright, so we name his ideas but don't quote him.

## 10. Decisions only AK can make

**Decided:** the Dec–Jan plan (`INNER_CHARIOT_PLAN_DEC_JAN.md`) is the plan in force, over the Mini's 90-day plan (AK, 16 Nov 2026).
**Decided:** mix both looks, Lamplight for the source and line art for the retelling and the present (AK, 16 Nov 2026; section 5).
**Decided:** Lamplight's Ramayana figures and other human figures may wear dark colour on costume, ornament and skin tone; faces stay in shadow (AK, 16 Nov 2026; amends the colour clause of rule 5 in `DHARMA_CHANNEL.md`).

**Still open:**

1. **Name the human reviewer** (rule 8). **This blocks every upload, including the finished Gita film.**
2. **Rule 5 and line-art faces:** may line-art figures (Hanuman, Rama, Sita) have a simple dot eye and mouth, as the Sundara Kandam pilot drew Hanuman? We recommend no for Rama, Sita and Krishna, and asking a devotional reviewer about Hanuman. Until AK rules, they stay faceless.
3. **Rule 5 and public-domain paintings:** may a public-domain painting that shows a deity's face appear as a "source exhibit"? We recommend no.
4. **Audio tracks:** Hindi only (house rule 10), or Hindi plus Tamil and Telugu, as AK set for Moat & Margin on 30 Oct?
5. **Narration voice:** the MiniMax voice as now, or a human narrator? Both work (udbhava shows a disclosed synthetic voice can carry it), so this comes down to taste.
