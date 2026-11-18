# Regional audio tracks (Tamil, Hindi) for existing videos

**Plan (AK, 2 Oct 2026).** Every video keeps **English as the original audio**. Tamil and Hindi are added as **extra audio tracks** on the
same YouTube video (multi-language audio). The picture is never re-rendered. Telugu and Malayalam are **on hold**: MiniMax rejects them
(`language_boost` invalid; the same sentence came back 1.8 s to 20.9 s long, so the output is unreliable). Do not attempt them.

Your job as the other Claude session: produce a Tamil and a Hindi audio track for each existing video (the long video and each Short),
draft only. A native speaker approves, AK uploads.

## What the tool does
`scripts/audio_tracks.py` (read its docstring). For one video id (a folder in `public/vx/`) and one language:
1. `python3 scripts/audio_tracks.py list` shows every video, its beats and which translations exist.
2. `python3 scripts/audio_tracks.py prep <id> <ta|hi>` writes `scripts/translations/<id>.<lang>.json` with each English beat (`_english`,
   including the time slot in seconds) and an empty `beats.<key>` for you to fill. **One file per video covers the long video and all its Shorts**
   (Shorts reuse the long video's beats).
3. `python3 scripts/audio_tracks.py build <id> <lang> [--short N] [--gender male|female] [--video out/vx/<file>.mp4]`
   voices every beat with MiniMax, speeds it up to fit (at most 1.10x for Tamil, 1.25x for Hindi), adds explicit pauses after Tamil
   sentences and commas, places it at the **same start time as the English beat**, and writes
   `out/audio/<id>/<id>_<lang>[_shortN]_DRAFT.wav` and `.m4a` plus a `_report.json`. With `--video` it checks the track length against the
   real mp4 and prints MATCH or MISMATCH. It exits with an error if any beat is TOO LONG: shorten that translation and rebuild.

Pilot (done 2 Oct): KPI Green Short 1 in Tamil and Hindi, track 24.53 s vs video 24.55 s, MATCH.
Files: `scripts/translations/kpigreen.{ta,hi}.json` (only the 2 Short-1 beats are filled).

## Rules (all of them matter)
1. **Voice only, English picture.** Each beat's regional line must finish inside the English beat's slot. If it is longer, rewrite it shorter.
   Aim for speed <= 1.15x for Hindi and <= 1.06x for Tamil (the report marks anything faster as FAST). Literal translations run about
   10 to 15 % long: write concisely.
   **Style (AK review, 2 Oct):** spoken, not written. Tamil = spoken Tamil (இருக்கு, பண்ணாரு) with the everyday English words people use
   (கஸ்டமர், ஷேர், பர்சென்ட்); Hindi = conversational Hindustani (कस्टमर, परसेंट). Every sentence keeps its subject and verb: fit the slot
   by saying the idea more simply, never by chopping words out.
2. **Same facts, same numbers, nothing added.** Translate only what the English narration says. Do not add commentary, scores or claims.
   Spell numbers out in words in the target language (the English `say` already spells them out), keep crore and lakh as the speaker would
   say them, and keep company names and tickers in Latin letters (e.g. "KPI Green") so they match the on-screen text.
3. **Disclaimer beats are critical.** The spoken disclaimer ("educational research, not investment advice; not a SEBI-registered Research
   Analyst") and any holdings disclosure must be translated faithfully and kept. Mark them in the notes for the reviewer.
4. **Filing quotes.** On screen the quote stays in English. In the regional track say it as "the filing says" plus a faithful translation, and
   do not change figures or hedges ("may", "subject to"). List every quoted beat in `notes` so the reviewer checks it first.
5. **No price data, no buy/sell/target language,** same as the English videos (SEBI no-price rule, YouTube Guide). Never translate a line into
   something stronger than the English.
6. **You do not approve translations.** `reviewed_by` stays `null` (output files are named `_DRAFT`). Only set it when AK tells you which
   native speaker reviewed that file. Never upload or share a DRAFT as final.
7. **Voices.** MiniMax has no native Tamil system voice (checked 2 Oct: 332 voices, none Tamil). The default English voice reads Tamil with a
   non-native accent and flat delivery (AK rejected it). Plan (AK, 2 Oct): **clone a native Tamil voice** from a 1 to 2 minute recording with
   `scripts/voice_clone.py`, then set `"voice": "<cloned id>"` in each `.ta.json`. Hindi uses the native `hindi_male_1_v2` /
   `hindi_female_1_v2`. Use the same gender as the English video's narrator. A cloned voice is deleted by MiniMax if it is not used for
   TTS within 7 days of cloning, so use it right away.
   **Emotion (optional).** In a translation file, `"emotion": {"k04": "fearful", "_default": "calm"}` sets MiniMax's emotion per beat
   (happy, sad, angry, fearful, disgusted, surprised, calm). Leave it out and the model picks its own.
8. **Quota.** The MiniMax key is shared (v1/v2 nightly jobs). Run builds one at a time, never between 22:00 and 02:00 IST, and on 429s wait;
   never switch provider. Cached beats are reused, so rebuilds only pay for changed lines.
9. **Do not edit engine files** (`src/`, `build_vx.py`, `vx_scripts.py`). You only add `scripts/translations/*.json`. Commit only on AK's word.
10. **Out of scope until AK decides:** the channel intro, the Som long-form, and the Sleep / Letter videos in `src/letters/` (they have an
    ambient bed under the voice, so the track needs the bed mixed in). Telugu and Malayalam.
    `public/explainer` (What is a moat?) is in scope since AK's 2 Oct "Dub it": use `scripts/audio_tracks_explainer.py` with the ids
    `explainer` (16x9) and `explainer-vertical` (60 s), same prep/build commands.

## Order of work
Ask AK for the priority list. If none: (1) videos already published or scheduled this week, (2) the daily-filings set (`zee`, `kpigreen`,
`adani`, `irdai`, `anupam`, `pb`, `mdr`, `welspun`, `autoq2`, `autoq2s`), (3) Moat Files `mf001`..`mf010` and `l47`..`l50`.
For each video: prep ta and hi, translate all long beats (Shorts come free), build the long track, then each Short (`--short 1..N`),
fix TOO LONG beats, and hand AK the list of files with the reviewer notes.

## YouTube side (AK uploads)
Studio -> the video -> Subtitles -> add the language -> upload the audio track (WAV/M4A, same length as the video). **Check that multi-language
audio is enabled for the channel and whether it works on Shorts: not verified.** Translated title and description are a separate step.
The track must match the video's duration (use `--video`).

## Starter glossary (draft, native review needed)
| English | Tamil | Hindi |
| --- | --- | --- |
| moat | மோட் (competitive moat) | मोट / प्रतिस्पर्धी सुरक्षा-दीवार |
| filing | தாக்கல் ஆவணம் | फ़ाइलिंग |
| auditor | தணிக்கையாளர் | ऑडिटर |
| qualified opinion | தகுதிக் குறிப்புடன் கூடிய கருத்து | शर्तों वाली (क्वालिफ़ाइड) राय |
| going concern | தொடர் நிறுவனம் (going concern) | गोइंग कंसर्न |
| promoter | ப்ரமோட்டர் | प्रमोटर |
| pledge | அடமானம் (பங்கு அடமானம்) | गिरवी (शेयर गिरवी) |
| related-party transaction | தொடர்புடைய தரப்பு பரிவர்த்தனை | संबंधित पक्ष लेनदेन |
| crore / lakh | கோடி / லட்சம் | करोड़ / लाख |
Choose one rendering per term and use it in every video; the reviewer may change it, and then update this table.
