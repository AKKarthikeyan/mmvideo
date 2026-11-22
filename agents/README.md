# The production agents (v1, 22 Nov 2026)

Eight roles take a topic to a published film. AK designed the chain (research, article, script, director, reviewer);
the fact-checker, builder and analytics roles were added from `docs/DIRECTION_RESEARCH.md`. Each role has a contract in
`contracts/`: what it receives, what it hands over, the rules it follows and the check it must pass. Any session (a
cloud session, or Claude Code on the Mac Mini on its other account) can run any role from its contract alone.

## The chain

| # | Role | Contract | Hands over | Runs on | AK |
|---|---|---|---|---|---|
| 1 | Research | `contracts/01_research.md` | Research folder: dossier, claims, sources | Cloud or Mac Mini | Picks the topic |
| 2 | Fact-checker | `contracts/02_factcheck.md` | `verify.md`, gates passed | Cloud or Mac Mini (fresh session) | — |
| 3 | Article (parallel to 4) | `contracts/03_article.md` | `ARTICLE.md` | Cloud or Mac Mini | Reads it |
| 4 | Script writer | `contracts/04_script.md` | `SCRIPT.md` + `script.json` with claim IDs | Cloud or Mac Mini | — |
| 5 | Director (owns the film from step 4) | `contracts/05_director.md` | `TREATMENT.md`, shot list, sound plan, animatic | Treatment: anywhere; animatic: **Mac Mini** | **Reviews the animatic** |
| 6 | Builder | `contracts/06_builder.md` | The film, cut to the real voice | **Mac Mini** | — |
| 7 | Reviewer | `contracts/07_reviewer.md` | `REVIEW.md`, one fix round | **Mac Mini** | **Reviews the final film** |
| 8 | Analytics (after publishing) | `contracts/08_analytics.md` | `ANALYTICS.md`, lessons into the rules | Cloud (vidIQ) | Reads the lessons |

The script writer and the director work as a pair: the director joins while the script is still a draft and may ask
for wording changes until the narration is locked (`docs/DIRECTOR.md` section 2). Facts never change after step 2.

## One folder per film

Every film gets `productions/<id>/` (copy `productions/_template/`). `<id>` is short and stable, e.g. `mm-airtel-arpu`.

- `STATUS.md`: which step the film is at, who handed over what, and what is blocked. **Every role reads it first and
  updates it last.**
- The research itself stays where the channel's rules put it (for example `docs/geo/research/<id>/`); `STATUS.md`
  links to it.
- Media (voice, renders, downloads) never goes in git: it lives under `out/` on the Mac Mini (CLAUDE.md).

## Rules every role follows

- Read `CLAUDE.md`, this file, your contract and the film's `STATUS.md` before anything else.
- Rule 0 of research applies to everyone: nothing comes from memory. A fact not in the claims ledger is not used.
- Stay in your lane: edit only the files your contract lists. Need something from another role? Write it in
  `STATUS.md` under "Blocked" and stop.
- Never publish, never print a key, never commit media. Commit text files on the session's branch only.
- Name the machine ("Mac Mini" or "MacBook Air"), never just "Mac".

## Running a role

- **Claude Code on the Mac Mini, in the repo:** each role is also a subagent (`.claude/agents/mm-*.md`). Say for
  example "Use the mm-research agent for productions/mm-airtel-arpu", or run it as the main session: "Act as the
  director in agents/contracts/05_director.md for productions/mm-airtel-arpu."
- **Cloud session:** paste the same line. Cloud sessions can do roles 1–5 (up to the treatment) and 8; anything that
  renders, voices or mixes is Mac Mini only.

## Tonight's check (22 Nov 2026)

A dry run of the chain on one small topic, to see whether the contracts hold up, not to finish a film.

1. AK picks a small Moat & Margin topic (one company, one question).
2. `productions/<id>/` from the template; fill the brief in `STATUS.md`.
3. Research in **Shorts mode** (2–3 primary sources, channel rules' Shorts section), so it finishes tonight.
4. Fact-checker in a **fresh session**.
5. Article and script, then the director's treatment.
6. If time allows, on the Mac Mini: style frames and the animatic.
7. AK notes what broke at each handoff in `STATUS.md` under "Dry-run notes"; the contracts get fixed from those notes.
