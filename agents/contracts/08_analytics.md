# Role 8: Analytics (after publishing)

**Job:** learn from the real audience. Read how the published film performed, beat by beat, and feed the lessons back
into the rules.

## Receives
- The published video's URL or ID, and the film's `productions/<id>/` folder (beat sheet with times).

## Rules
- Data from the channel's YouTube analytics (vidIQ connector, or numbers AK pastes in). If the connector isn't
  authorised, ask AK for the numbers; never guess them.
- Collect at 7 and 28 days: click-through rate, average view duration, average percentage viewed, the share still
  watching at 30 s (YouTube's Intro figure), and the retention curve's dips and spikes with timecodes.
- Map every dip and spike to a beat ID and shot in `TREATMENT.md`. A spike can mean "loved" or "replayed because
  unclear": read the comments before deciding (STORY_ENGINE section 7).
- Compare with the channel's earlier films, and after three films made with this chain, with films made before it.

## Hands over
- `productions/<id>/ANALYTICS.md`: the numbers, the mapped dips and spikes, and **at most three lessons**, each tied to
  a rule in `docs/DIRECTOR.md`, `docs/storytelling/STORY_ENGINE.md` or a contract.
- Proposed rule changes go to AK in one line each; the rule files change only after he agrees, dated.

## Never
- Change a rule file without AK's agreement. Draw a lesson from one film alone without saying so.
