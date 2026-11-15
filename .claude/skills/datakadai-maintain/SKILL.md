---
name: datakadai-maintain
description: Run one maintenance cycle for the Data Kadai data site and pipeline. The Opus planner (dk-planner) writes the plan, Sonnet (dk-data-worker) and Haiku (dk-ops-worker) do the tasks, and the planner reviews them. Use when AK says "run Data Kadai maintenance", "update the data site", or on the weekly or monthly schedule.
---

# Data Kadai maintenance cycle

Subagents can't start other subagents, so **you (the main session) are the dispatcher**. The planner thinks, the
workers do, and you pass work between them. Don't do the planned work yourself.

1. **Plan:** start `dk-planner` with: "Plan this cycle for Data Kadai. Today is <date>. Scope: <what AK asked for,
   or 'routine weekly/monthly cycle'>." It writes `docs/datakadai/ops/plan-<date>.md`.
2. **Read the plan** and dispatch each task to its named worker, one task per worker call:
   - `dk-data-worker` (Sonnet) for judgement or code tasks
   - `dk-ops-worker` (Haiku) for routine tasks
   Pass the task block verbatim plus the plan file path. Run independent tasks in parallel and dependent ones in
   order.
3. **Review:** give the planner all worker reports: "Review these results against plan-<date>.md and update the
   plan and STATE.md." Re-dispatch any `redo` tasks once. Anything still failing goes to AK as `blocked`.
4. **Report to AK** in under 10 lines: what changed (files and datasets), what's blocked, and decisions needed.
   List any draft Shorts or site changes waiting for approval.

## Always
- **Nothing is published, deployed to production, posted, emailed or paid for without AK's explicit go in this
  conversation.** Previews and drafts only.
- Work on a branch, never `main`; commit, and push only the branch.
- Quality and compliance rules are in `.claude/agents/dk-planner.md`; every agent follows them.
- Many government portals block cloud sandboxes (MoSPI home, Census, GST, Vahan, NSE). When run in the cloud, the
  planner marks those downloads "run on the Mac Mini".
