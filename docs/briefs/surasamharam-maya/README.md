# Surasamharam: lines for Maya

AK, 17 Nov 2026: Tamil, Hindi and Telugu are voiced with **Maya**, AK's local voice. Maya lives on AK's machine, so
the cloud session could not run it; the Tamil and Hindi cuts it made carry MiniMax as a stand-in, and Telugu has no
voice yet.

`ta.tsv`, `hi.tsv`, `te.tsv`: one line per beat, `<lang> <beat>` then a tab then the narration. Beat b10 is a verse card
with no narration. Generated from `docs/briefs/IC_SURASAMHARAM_NARRATION_TA_HI_TE.md`; regenerate with
`python3 scripts/katha/voice_sura.py lines ta hi te` if that file changes.

Two ways to finish, from the repo root on the machine with Maya:

```sh
# 1. Maya as a command: it reads {text}, writes {out} (.wav); {lang} is ta, hi or te
SURA_TTS_CMD='<maya command> --lang {lang} --text-file {text} --out {out}' scripts/katha/finish_sura_maya.sh

# 2. Maya by hand: save one file per beat as ~/maya/sura/<lang>/b01.wav ... b20.wav (no b10), then
SURA_CLIPS=~/maya/sura scripts/katha/finish_sura_maya.sh
```

Either way the script voices or imports every beat, re-times each cut to its own voice, re-scores the music to the new
timing, and renders `out/sura/sura-ta.mp4`, `sura-hi.mp4` and `sura-te.mp4`. `LANGS="te"` limits it to one language.
