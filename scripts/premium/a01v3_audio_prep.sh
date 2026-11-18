#!/bin/zsh
# A01 v3 audio prep: copy the CC0 bed + SFX (with LICENSES.md) into public/premium/a01v3/audio, trim the bed to its
# music (0-162 s), loudness-normalise bed and narration to -16 LUFS, peak-normalise SFX to -3 dBFS. Uses vendor ffmpeg.
source /Volumes/DarwinSSD/vendor/env.sh
A=/Volumes/DarwinSSD/vendor/audio/A01; O=/Volumes/DarwinSSD/MMVideo/public/premium/a01v3/audio; V=/Volumes/DarwinSSD/MMVideo/public/premium/a01v3/vo
mkdir -p $O; cp $A/LICENSES.md $O/LICENSES.md
ffmpeg -v error -y -i $A/music_01_cottagecore_lindseysewell.mp3 -t 162 -af "afade=t=out:st=159:d=3,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 $O/music_01_bed.wav
for s in sfx_whoosh_deep_kinoton sfx_whoosh_cartoony_branrainey sfx_coin_pickup_davidsraba sfx_coin_ding_greenvwbeetle sfx_splash_audiosmedia sfx_splash_small_alegemaate sfx_pop_conarb13 sfx_pop_bubble_mafon2; do
  mx=$(ffmpeg -hide_banner -i $A/$s.mp3 -af volumedetect -f null - 2>&1 | grep -o "max_volume: [-0-9.]*" | awk "{print \$2}")
  g=$(python3 -c "print(round(-3 - ($mx), 2))")
  ffmpeg -v error -y -i $A/$s.mp3 -af "volume=${g}dB" -ar 44100 $O/$s.wav; echo "$s peak $mx gain $g"
done
for b in c01 c02 c03 c04; do ffmpeg -v error -y -i $V/$b.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 $V/${b}_n.wav; done
ls -la $O $V
