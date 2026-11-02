# Storytelling rules (v2, 2 Nov 2026)

**Status.** AK, 2 Nov 2026: these rules replace every earlier storytelling rule in this engine. They apply to every new
script: long video, Short, Reel. Videos already built are not re-cut; a remake follows these rules. What was retired and
what was kept is in section 9.

**Source.** The research brief "The Architecture of Algorithmic Attention: Engineering Multi-Million-View Storytelling on
YouTube" (25 pp, supplied by AK on 2 Nov 2026; the PDF is not in git). Tags: **[R]** = taken from the brief.
**[H]** = our own setting or adaptation, a default to tune with our retention data, not a law.

**Unchanged house guardrails.** Real data with its source on screen. Anything illustrative is labelled on screen.
Educational research only: no price talk, no buy or sell, no verdict on a stock. Quotes are verbatim or not at all.

## 1. The idea in one paragraph

Viewers leave because nothing is at stake or nobody is wondering what comes next, not because the cutting is slow [R].
So a video is a chain of cause and effect that keeps at least one question open from the first line to the payoff, makes
good on its title straight away, and stops when it pays off. Cutting speed, effects and B-roll do not rescue a sequence
that has no stakes [R].

## 2. Before scripting

- **One promise.** Title, thumbnail and first line are one promise [R]. Write it as one sentence in `story.promise`. The
  opening frames must deliver exactly that. Platforms penalise misleading packaging, and viewers punish a broken promise
  on the next upload [R]. Make the promise concrete: the most believable outcome for the least perceived effort and wait
  [R, Hormozi's value equation]. For us that is an honest "what you will understand in N minutes", never a promise the
  documents cannot keep.
- **Critical evidence first** [R, MrBeast's "critical components": the non-negotiable pieces without which the story
  collapses, guarded above everything else]. Before scripting, name the 2 or 3 documents or figures the story cannot exist
  without, and verify each against its source. List them in `story.critical` (what, and where it comes from). If one fails
  verification, the video is reframed or dropped before the script exists. Name a fallback question too, one the surviving
  evidence can still answer [R, backup days: plan for the thing that goes wrong].
- **Adapt a proven format at our scale** [R]. A concept that earned views across several formats or platforms signals deep
  curiosity (the Rs 1 versus Rs 1,000,000 series began as a one-dollar versus hundred-dollar donut video). Look for such a
  format, then rebuild it on our own evidence. This is the "second-mover advantage" of a platform with 15 years of data.
- **Mix the slate** [R, Hormozi's three tiers; watch concept lifecycles so no format is overused]. Tag each video
  `story.tier`: `broad` (a mass-market topic that pulls cold viewers), `nurture` (deep value that builds trust), or
  `authority` (proof of method: the Moat Files, reference videos). Plan the slate so no arc or concept runs three times in a
  row. We do not sell anything in the video; the tiers are for planning only.
- **Promise type** [R, Harris]: Question (answer a burning curiosity), Teaching (explain a system), Adventure (come along),
  or Tension (an uncertain outcome). Pick one; it sets title and tone. Most of ours are Question or Teaching.
- **Frame for the honest curiosity gap** [R]. Same facts, bigger pull: "Who took DMart's missing 56 paise?" beats
  "DMart Q2 results". The answer must be in the filings and in the video. [H] Never a gap the documents cannot close.
- **Demand check** [R]: look for a comparable video that earned about 5x to 10x its channel's subscriber count (the topic
  escaped that channel's own fans), using Viewstats, Spotter Studio, vidIQ, or a manual search of one to three keywords
  sorted by views. [H] Required for evergreen and series videos, recorded in `gate["demand"]`. For filing-driven news
  videos the existing `keyword` check stays and this is optional.
- **Pick one arc** and declare it in `story.arc`:

| `arc` | Use when | Beats |
| --- | --- | --- |
| `three-act` | a turning point, a crisis, a long company history | Setup and catalyst. Confrontation, midpoint, lowest point. Resolution with a changed state [R] |
| `story-circle` | a journey: will X survive Y | The specific want. The "But" obstacle. The cost and near-failures. The visible payoff that closes every loop. Immediate exit [R] |
| `kishotenketsu` | a perspective-shifting explainer with no villain ("what is a moat") | Ki baseline. Sho deepen, no conflict. Ten twist that reframes. Ketsu reconcile into a realisation [R] |
| `misconception-first` | the audience holds a wrong intuition ("low margin means weak") | State the common belief. Let it clash with the evidence. Test it on the filing. Hang the true idea on it [R, Veritasium] |
| `wow-first` | a mechanism that is hard to feel | The anchoring surprise. An early small win. A failed first guess treated as a step, not a shame. Then the how [R, Rober] |
| `serial-momentum` | one simple rule carries the video (one Rs 100 note, one rupee) | Challenge. Obstacle. Pivot. Breakthrough. Result [R, Trahan] |
| `evidence-first` | a document, an anomaly, an investigation | The striking evidence on screen first, then step back for context. Keep forward motion. Strip every detail that does not move the central conflict [R, Harris, Magnates] |
| `modular-value` | a reference or how-to video (Moat 60) | Per unit: why care, what it is, how to use it, re-hook into the next unit. Open with proof, value, structure, stakes [R, Hormozi, Whiffen] |
| `claim-verdict` | testing a claim | Thesis. What the documents show in real use. A yes or no on the claim, never on the stock [R, Brownlee; the guardrail is [H]] |

### The default skeleton for a filing-driven long video [H, built on the brief's four phases]

| Time | Phase [R] | In our engine |
| --- | --- | --- |
| 0:00 to 0:30 | Hook and validation | Cold-open chapter: the promise as a number or a question, the source document on screen, primary loop opens |
| 0:30 to 1:00 | Stakes | What is at stake, how it will be tested, the rule of the game ("follow the Rs 100"); secondary loop opens |
| 1:00 to 3:00 | Hype to execution | The first chapter shows rather than announces; the first small answer lands by 2:00; setup is compressed |
| about 3:00 | Re-engagement | The first reversal or change of scale found in the documents; tertiary loop opens |
| 3:00 to the payoff | Back half | One chapter per question, each harder than the last; the counter-evidence; the `turn` beat; every chapter turn re-engages |
| Payoff | Instant payoff | The answer, and what changes in how the viewer sees it |
| Tail, 30 s at most | none | Next-video handoff, sources, the plain end card |

## 3. The opening (0:00 to 1:00)

1. **The first sentence delivers what the title promised** [R]. No hello, no channel name, no "in this video", no agenda.
   Show or say the thing.
2. **Primary loop open by 0:30** [H, from the brief's finding that the first 30 seconds must validate the click]. This is
   the check `story_check.py` runs.
3. **By 1:00 the central conflict, the rules and the stakes are on the table** [R]: what is asked, what is at stake, how it
   will be tested, with the source document on screen.
4. **Open with the move that fits the arc** [R]: a misconception exposed; a wow anchor; evidence before context; or proof
   (the filing itself, shown in the first sentence, not a biography), value (the outcome, in the title's words),
   structure, stakes.
5. **Minutes 1 to 3: stop announcing, start showing** [R]. Narration must stop explaining what is coming and demonstrate.
   Compress long setups into one dense sequence, for example years of filings into a single timeline or counter, so
   momentum starts at once [R, "crazy progression"].
6. **Be specific, and echo the title** [R, Hormozi, Whiffen]. Replace a vague opener ("here is some advice for creators") with
   the exact problem and its consequence ("if Shorts get views but no subscribers, check what happens right after the
   payoff"). Say the title's own keywords in the first sentence so the viewer knows the click was right. `story_check.py`
   warns when fewer than 2 of the title's keywords are spoken in the first 30 seconds.
7. **Give a small win early** [R, Rober's graduated retention: early micro-satisfactions buy the patience for the heavy
   explanation]. Answer one small question in the first chapter so the viewer has been paid before the hard part. [H] By 2:00;
   `story_check.py` warns if nothing has been answered by then.
8. **For a wrong intuition, steelman it first** [R, Veritasium]. A clear explanation alone can leave a viewer feeling they
   understood while learning nothing, because the old belief filters it. State the common belief at full strength, say why it
   feels right, then test it on the filing. The wrong answer becomes the peg the right one hangs on.

## 4. The middle

1. **But or Therefore, never "and then"** [R, Parker and Stone]. The link between any two beats is *therefore* (a
   consequence, progression) or *but* (a conflict, complication, reversal). Write the word between every pair of beats in
   the outline. A beat that follows only because it came next in time is rewritten or cut. Dates listed inside one
   timeline scene are fine.
2. **Open loops** [R]. Plant a specific unanswered question or a high-stakes tease early and delay the answer. Every loop is
   listed in the ledger (section 7). Every loop is paid on screen, with its source, before the end. A loop left unpaid is a
   broken promise and costs the next upload [R].
3. **Stack the loops** [R]. Primary loop = the title's question, open from the opening to the payoff. Secondary = the
   obstacle or setup, opened before the primary resolves. Tertiary = the final twist. Add short `micro` loops (a question
   raised and answered inside a chapter) to carry the stretches between them. A viewer must never reach a point where
   every question is answered but the video is still running. The primary resolves last. [H] A video of 5 minutes or more
   has a primary, a secondary and a tertiary loop.
4. **Re-engage, with something real** [R]. Plant a deliberate re-engagement around the 3-minute mark and at regular
   intervals after it: a scale shift, a number nobody expected, a reversal found in the documents, a rule change ("now
   the same test on the rival"). It comes from the real data, never invented drama. [H] Until we have retention data: no
   stretch longer than 3 minutes in which no loop is opened or answered (`story_check.py --max-quiet` enforces it), and a
   re-engagement at each chapter turn. After every upload, read the retention graph in YouTube Studio and place the next
   video's re-engagements just before the dips it showed [R].
5. **Pattern interrupts, placed not sprayed** [R]. Break the predictable rhythm just before a known dip, on four channels:
   *visual* (a 1.0x to 1.1x punch-in, an angle or graphic change), *audio* (a sound effect, a mood change, one beat of
   silence before the crucial line), *cutaway* (a reference clip or a burst of B-roll), *tonal* (shift energy, add levity
   after dense exposition).
6. **Pace is the removal of dead air, not a cutting quota** [R]. Cut hesitations, breaths and frames where the story
   stalls. Mark the second your own attention wanders on a rough cut and fix that spot. There is no "cut every 10 to 15
   seconds" rule, and the 3-to-4-second interrupt rhythm of the 2021 to 2023 "overstim" era is not our target either (see
   rule 9).
7. **Every visual proves the sentence beside it** [R]. A filing crop, a chart, a close-up of the thing named. If a clip
   does not advance understanding it is filler: remove it. This is the on-screen-source rule seen from the story side.
8. **Show, do not name, the feeling** [R]. Stage the evidence: the line in the filing, the number moving, the two bars in
   one frame. Do not write "shocking" or "devastating". Use contrast and juxtaposition inside one frame, and plant a
   recurring object early so it can carry meaning when it pays off (the Rs 100 note, the castle).
9. **Leave room to breathe** [R]. Content cut at maximum intensity every second loses emotional contrast and feels
   synthetic, which is why the originator of the style walked it back in 2024 and 2025. [H] After each dense run, one slow
   beat: a single image or number held, a person or decision in view. Optimising only for the retention metric does not
   make a better video [R, Brownlee].
10. **Manage cognitive load** [R]. A deep mid-video trough almost always comes from broken causality or from overload. [H] One
    new idea per beat. Define a term, and show the number, before the next sentence leans on it. Never introduce a new term
    and a new number in the same sentence.
11. **Make the abstract human** [R, Kurzgesagt]. Give a big or invisible scale a thing the viewer can feel: one rupee, one
    shop, one person. Keep the same one through the whole video (the Rs 100 note, the castle). Leave the viewer with a new
    way of seeing, not a lecture.
12. **Say what we do not know** [R, Harris: shown uncertainty keeps an analytical topic from feeling sterile]. The unknown and
    what to monitor are on screen as their own beats, never buried. Our reading is labelled as ours.
13. **Keep forward motion** [R, Harris]. Each scene orients the viewer (where are we) and then shows action. Carry an object
    or a number from one scene into the next so the video reads as one movement.
14. **Treat sound as structure** [R, Harris, Magnates, Kurzgesagt]. Choose the music before assembling the edit and let its
    crescendos and rhythm shifts mark the turns and the payoff. Use one beat of silence before the line that matters. Keep
    one steady narrator register inside a video: clinical clarity with some warmth, no shouting, rare first-person.

## 5. The back half and the payoff

1. **Escalate, do not coast** [R]. Each section raises the stakes or tightens the question: the bear case, the counter-evidence,
   the unknown. A recap is not an escalation.
2. **Cut every dull moment** [R]. Review the rough cut with several people and have them flag the energy dips. Write several
   full drafts, each one stripping background that does not move the story (the brief cites about a dozen at the top
   end) [R, Kurzgesagt]. Strip every detail, however interesting, that does not advance the central conflict [R,
   MagnatesMedia]; log the strongest source passages by page so the cut stays fast. Keep the source ledger so every claim is
   provable, and have an outside expert audit the facts where one is available [R]. Our review set is a common-viewer
   reader, a retention editor and an adversarial fact-check [H, as used for `dmartstory`].
3. **Pay off and stop** [R]. The moment the title's promise and the last open loop are fulfilled on screen, land the
   change in what the viewer now understands, then end. No victory lap. [H] After the payoff, only a handoff to the next
   video, sources and the plain end card, 30 seconds in all. Do not attach unrelated add-ons after the payoff (the
   "ten announcements" roundup in `dmartstory`): make them their own video or leave them to the digest.
4. **No spoken ask.** Subscribe, like and link requests go in the description and pinned comment, not in the voice-over [H].

## 6. Short-form (Shorts, Reels, vertical)

1. **Attention in 1 second** [R]. The hook is on screen from frame 1 (the engine already does this).
2. **Foreshadow the payoff within 3 seconds** [R], so the viewer commits.
3. **Middle: quick But and Therefore turns** [R]. One finding per Short, two receipts at most [H, kept from the old template].
4. **Cut at the exact moment the promise is fulfilled** [R]. No outro plea, no victory lap. The engine's 2 s end card
   stays: brand only, no ask [H].
5. **Length follows the payoff** [R]. The brief's benchmark average is about 34 seconds. The old fixed 45 to 60 s window is
   retired. Make the last frame lead into the first where it can [H].

## 7. The ledger and the check

Every new long video declares `story` in its `scripts/vx_scripts.py` or `scripts/vx_letters.py` entry. `story` replaces
`spine`, `hooks` and the hook keys of `marks`. Keep using `gate`, `keyword`, `next_video` and the other `marks` keys.

A schematic (the beat keys are placeholders; use your own video's keys):

```python
V["story"] = dict(
  promise="Who took D Mart's missing 56 paise?",           # the title's promise, one sentence
  arc="serial-momentum",                                   # one of the nine arcs in section 2
  loops=[                                                  # the primary first; open/close are beat keys
    dict(id="L1", kind="primary",   q="Who took the 56 paise?",              open="b00", close="b60"),
    dict(id="L2", kind="secondary", q="Is the low-price promise in danger?", open="b02", close="b50"),
    dict(id="L3", kind="tertiary",  q="Will the new stores fill up?",        open="b40", close="b60"),
    dict(id="M1", kind="micro",     q="Is it the discounts?",                open="b10", close="b20"),
  ],
  turn="b30",                                              # the "But": the first answer is complicated or reversed
  plants=[("b02", "b60")],                                 # (set up here, pay off there)
  critical=[dict(what="Q2 FY27 standalone results", src="BSE filing, 10 Oct 2026, p.3")],   # 2 or 3 pieces the story needs
  tier="broad",                                            # optional: broad, nurture or authority (slate planning)
)
```

`kind` is `primary` (exactly one), `secondary`, `tertiary` or `micro`. The loops overlap on purpose: L2 opens before L1
resolves and L3 before L2 resolves, so the viewer is always holding a nearer question than the title.

```bash
python3 scripts/story_check.py <video id>     # uses built timings in public/vx/<id>/data.json, else counts words
```

It fails if: the ledger is missing or malformed, a beat key does not exist, the primary loop opens after 0:30, the primary is
not the last to close, a plant is paid before it is set, `tier` is not one of the three, or more than 3 minutes pass with no
loop opened or answered. It warns about beats that open with "and then", a video of 5 minutes or more without a primary, a
secondary and a tertiary loop, nothing answered by 2:00, fewer than 2 of the title's keywords in the first 30 s, a missing
`critical` list, a tail after the payoff longer than 30 s, a spoken subscribe or like ask near the end, and a missing
`turn`. It cannot judge the rest; section 8 does.

## 8. Checklists: before the voice is built, and after the upload

**Before the voice is built** (the retention editor answers yes or no):

1. Are the 2 or 3 critical documents or figures named in `story.critical` and verified against their sources?
2. Can the promise be said in one sentence, and does the first sentence of the video deliver it in the title's own words?
3. Is the primary loop open by 0:30 and are the stakes clear by 1:00?
4. Is the connecting word between every pair of beats *but* or *therefore*?
5. Does a question open or get answered at least every 3 minutes, and has a small question been answered by 2:00
   (`story_check.py` passes)?
6. Is every loop answered on screen, with its source?
7. Is there a real re-engagement near 3:00 and at each chapter turn, drawn from the documents?
8. Pick any beat and ask what the viewer loses by leaving now. Is there a clear answer for every beat? (A beat with no
   answer is a dead zone.)
9. Does each beat add one new idea, with terms and numbers introduced before they are leaned on?
10. Does every visual prove the sentence beside it, and are feelings shown as evidence rather than named?
11. Is there a slow beat after each dense run, and is the unknown shown on screen?
12. Does the video stop within 30 s of the payoff, with no spoken ask?
13. Is every number sourced, every illustration labelled, and every line free of price talk and verdicts on a stock?
14. Have the common-viewer reader, the retention editor and the fact-check each signed off?

**After the upload.** Open the retention graph in YouTube Studio, with the click-through rate beside it, and read the shape
[R]. The symptom points at the rule that broke:

| What the graph shows | Likely cause [R] | Rules to revisit |
| --- | --- | --- |
| High click-through, steep fall by the first-30-seconds marker | Packaging mismatch: the opening did not deliver what the title promised | 2 (one promise), 3.1, 3.6 |
| Steep fall through minutes 1 to 3 | Setup too long; announcing instead of showing | 3.5, 3.7 |
| A deep trough in the middle | Broken cause and effect ("and then"), or overload | 4.1, 4.10 |
| The same kind of scene dips every time | A dead stretch with nothing pending | 4.3, 4.4, 4.5 |
| Slow decay through the back half | Coasting instead of escalating | 5.1 |
| A fall at the very end, or poor average view percentage | A tail after the payoff | 5.3, 5.4 |
| Next upload's impressions drop after a high-click, low-retention video | A broken promise taught the audience to skip us | 2 (one promise) |
| Strong retention but weak comments and no return viewers | Over-stimulation: retention bought at the cost of the video | 4.9 |

Write the two or three biggest dips as beat keys into the next video's notes, and place its pattern interrupts and
re-engagements just before them [R]. One video is a small sample; act on a pattern across two or three, not on one curve.

## 9. Retired and kept

| Retired on 2 Nov 2026 | Where it lived | Replaced by |
| --- | --- | --- |
| "A question in the first 5 seconds" (AK, 11 Oct 2026) | `scripts/hook_check.py`; `illustration-library/README.md`; comments above the DMS, AMK, CAB, LOM, E2G and A01 entries in `vx_scripts.py` | Section 3: promise in the first sentence, primary loop by 0:30, stakes by 1:00 |
| "A hook at most every 45 seconds" (AK, 11 Oct 2026) | the same places | Section 4 rules 3 and 4: stacked loops, real re-engagements, and no stretch over 3 minutes with no question opened or answered. A periodic ping does not hold a viewer; an open question and a turn do |
| `V["hooks"]` and the `hook` and `rehooks` keys of `V["marks"]`; `V["spine"]` | `vx_scripts.py` (only `hooks` was ever read, by `hook_check.py`) | `V["story"]`. Old entries stay as history; do not copy them into new videos |
| Shorts: a fixed 45 to 60 s, a spoken "link in bio" close | darwin-research `contentengine/templates/short_video_script.md` | Section 6 (that template now points here) |

Kept unchanged, because they are not structure rules or the brief does not touch them:

- AK, 11 Oct 2026: told as a story to a viewer who does not follow the market; illustrated motion graphics; the review set.
- AK, 17 Oct 2026, for the Moat 60 reference series: understandable by school children; more motion graphics, less text,
  more numbers, less jargon; sentences of 15 words or fewer (none over 20); at most 4 words per label.
  *Open point:* the A01 script ends with a 20 s recap of every answer. Rule 5.3 says pay off and stop. Left as built until
  AK decides whether a reference video keeps its recap.
- One thing, one colour and one icon; made-up examples labelled; a through-line object.
- AK, 3 Oct 2026: no disclaimer beat or warnings in long videos; the disclaimer lives in the description and pinned comment.
- AK, 30 Sep 2026 (YouTube Guide): the hook on screen from frame 1 for Shorts, a 2 s end card; the thumbnail rules.
- The written-article and dossier formats in darwin-research (`FORMAT_BLUEPRINTS.md`): they are not video.
- The Sleep pilot draft (`scripts/letters/sleep_pilot_script_v1.md`): a three-act script (pledge, turn, prestige). Not a rule.

## 10. What was not taken from the brief, and how far to trust it

- **MrBeast production operations** (the $10,000 on-camera rule, the 3-hour contestant rule, daily vendor check-ins,
  backup shoot days, "cheat code" consultants, staff quizzes): they run physical shoots. We have no equivalent.
- **Hormozi's funnel** (the "secret offer" packaging, workshops, lead capture): a direct-response sales model that does not fit
  research without advice. Only his script mechanics (hook, retain, reward; modular units with a re-hook), his value
  equation as a way to word an honest promise, and his idea of mixing content tiers are used.
- **The retention curve and benchmarks in the brief** (the 100% to 66% curve, the 10% CTR baseline): modelled or channel-specific
  figures, not targets for us. We set targets from our own Studio data.
- **The Zeigarnik effect.** The brief states as settled that interrupted tasks are remembered about twice as well. Replication
  of that memory result is mixed. We use open loops as a craft practice that works for audiences, not as a law of memory.
- **Sources.** Most of the brief's 70 citations are blogs, Reddit threads, YouTube videos, Medium posts, a leaked internal
  PDF and a GitHub gist. Read the numbers as heuristics. The structural advice (cause and effect, loops, payoff,
  breathing room) is consistent across many independent creators, which is why it is the part we adopted.
