---
name: datakadai-daily
description: Make today's Data Kadai post pack (one Short video + Instagram and X chart images + captions) as drafts for AK's approval. dk-planner picks and reviews, dk-video-worker (Sonnet) makes the Short, dk-social-worker (Haiku) checks and logs it. Use for the daily Data Kadai routine or when AK says "make today's Data Kadai post".
---

# Data Kadai daily pack

You (the main session) dispatch; agents can't start each other. Today = the date in IST.

1. **Pick:** start `dk-planner`: "Pick today's story from docs/datakadai/ops/QUEUE.md (first `queued`), confirm its
   facts against public/datayt/nfhs6/nfhs6_states.json, top the queue up to 14, and write the task to
   docs/datakadai/ops/plan-<date>.md."
2. **Make:** start `dk-video-worker` with the story block and the date.
3. **Check and log:** start `dk-social-worker` with the id and the date.
4. **Review:** give both reports to `dk-planner` to check the numbers, the stills in `out/datakadai/check/` and the
   captions. Redo once if needed.
5. **Hand off to AK:** send `short.mp4`, `ig.png`, `x.png` and `captions.md` from
   `out/datakadai/daily/<date>/<id>/` with SendUserFile (status `proactive`), with a one-line caption: the title and
   "Approve to post at 7:30 pm IST".
6. Push the branch (never `main`).

## Posting
**Nothing is posted by any agent.** AK approves, then posts: YouTube Studio (schedule 7:30 pm IST), Instagram and
Facebook via Meta Business Suite (Reel + `ig.png` carousel), X (post `x.png` with the X text). Auto-posting needs
AK to connect a scheduler (e.g. Buffer or Meta API) and say so explicitly; until then, drafts only.

## Rules
Quality and compliance rules: `.claude/agents/dk-planner.md`. Palette and brand: `src/datayt/IndiaShort.tsx` (P) and
`src/datayt/Brand.tsx`. Official India map only.
