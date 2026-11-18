MMVideo media from the cloud session of 18 Nov 2026 (not in git: renders and voice are regenerable but cost time/money).
Unzip INTO the MMVideo folder on the Mac Mini (e.g. /Volumes/DarwinSSD/MMVideo). Files land in out/ where the tools expect them:
  out/india_ledger/india_ledger_gold_act1_style_test_v2.mp4   Gold episode Act 1, style test v2 (no music, paragraph narration)
  out/india_ledger/manim_trial_compounding.mp4                 Manim trial (Moat & Margin look)
  out/india_ledger/posters/carousel/01-10.png                  Gold posters 1080x1350 (Instagram carousel)
  out/india_ledger/posters/community/01-10.png                 Gold posters 1080x1080 (YouTube Community)
  out/hyperframes/il-gold-act1-final.mp4                       same Act 1 video, where hf.py / il_act1_build.py write it
  out/hyperframes/shorts_audio/il-gold-act1/                   MiniMax voice paragraphs (p1-p5 .mp3 + timing .json) and voice.wav:
                                                               il_act1_build.py reuses these instead of paying to re-voice
