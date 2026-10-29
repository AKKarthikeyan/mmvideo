# Voice picks (AK, 29 Oct 2026, after the blind listening test)

AK listened to 21 blind clips (the same seven cola-war lines, letters hide the engine) and picked these. The test files and the
sealed key are on the SSD only: `/Volumes/DarwinSSD/DataKadai/research/2026-10-28-voices/` (`audio/blind/`, `BLIND_KEY_do_not_open.json`).

| Language | AK's pick | Engine and voice | How to call it |
|---|---|---|---|
| English | **D** (used for the babies long-form, AK 29 Oct) | MiniMax `speech-2.6-hd`, `English_Diligent_Man`, speed 1.0 (the house voice) | `scripts/datayt/voice_dk.py` `say()`; long-form: `scripts/datayt/long_voice.py voice` |
| English | A (second pick, not yet used) | Google Gemini TTS `gemini-3.8-flash-tts`, voice `Iapetus` | `generateContent` with `responseModalities: ["AUDIO"]` and `prebuiltVoiceConfig.voiceName` (see `research/2026-10-28-voices/work/make_google.py`); key `GEMINI_API_KEY` |
| Hindi | H | Google Gemini TTS `gemini-3.8-flash-tts`, voice `Charon` | same as above |
| Tamil | M | Maya-2-Native (community MLX 8-bit port `aruntemme/maya2-native-mlx-8bit`), voice `Siddhant`, `lang_code="ta"` | local, `research/2026-10-28-voices/work/make_maya.py` in the venv `work/mayavenv` (mlx-audio) |
| Telugu | N | Maya-2-Native, voice `Siddhant`, `lang_code="te"` | same |
| Bengali | O | Maya-2-Native, voice `Siddhant`, `lang_code="bn"` | same |

## Rules and cautions
- **Taste is AK's.** These are AK's picks for the test lines. No channel's voice changes because of this file; a channel moves only when AK says so. English stays MiniMax `English_Diligent_Man` unless AK picks A for a video.
- **MiniMax** runs 06:45-22:10 IST only (the key is busy at night). Run inside `zsh -lic` so `MINIMAX_API_KEY` loads; `MINIMAX_KEY_VAR=MINIMAX_GO_API_KEY` uses the second plan when the first hits its limit. Never print or copy a key.
- **Gemini TTS** takes plain text only: it reads instruction text aloud and rejects `systemInstruction` (tested 28 Oct 2026). No time window. A 7-second line took about 3 s. Rate limits and cost on this key were not checked.
- **Maya** runs on the Mini (no key, no time window), about 1.1x real time; the first model load took about 5 minutes. The `mlx-audio` code is MIT, but the licence of the model weights was **not read at the source**. Read it before any Maya audio ships. The Hindi/Tamil/Telugu/Bengali test lines are `translations_DRAFT.json`: draft translations that a native reader has not checked.
- **Lip sync:** Rhubarb is English-only, so Hindi, Tamil, Telugu and Bengali tracks use the audio-envelope mouth cues (`scripts/datayt/mouth_cues.py`).
- **Tamil words inside English narration** are unchanged: Sarvam Bulbul v3, speaker `vijay` (`PREFERENCES.md`).
- **Disclosure:** every one of these is an AI voice. Set "Altered or synthetic content: Yes" on YouTube.
