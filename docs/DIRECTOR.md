# Director: how a script becomes a film (v1, 22 Nov 2026)

**What this is.** The third part of our system, between the script and the build:
- `docs/*/RESEARCH_RULES.md` decides **what is true**.
- `docs/storytelling/STORY_ENGINE.md` decides **how the story is told** (format, beats, the story gate).
- **This file decides how it is shown and heard**: picture, camera, sound and pacing, and how we check them before and
  after building.

**Why it exists.** Our films are correct but flat. The research behind this file (`docs/DIRECTION_RESEARCH.md`) found
that the best explainer teams (Vox, Kurzgesagt, Johnny Harris) all have one owner per film, design the picture before
the words are final, test a rough version before building, and use music and silence on purpose. We did none of these.
AK approved this approach on 22 Nov 2026, including the animatic review and the music rule in section 6.

**Applies to:** every long video and every Vox+ film on every channel. Shorts keep `docs/SHORTS_FORMAT.md` and
`docs/SHORTS_RULES.md`; they also use sections 6 (sound) and 9 (review) of this file.

**Where it overrides older rules.** Where a brief, a kit README or `docs/HANDOFF_MAC_MINI.md` says otherwise, this file
wins on: who owns a film, when narration is locked, music under narration, and the review before delivery. Evidence
rules (the ledger, sources on screen, labels, cueing figures to the spoken word) are unchanged and still win over craft.

---

## 1. One director per film

- **One session is the director** for the whole film, from treatment to delivery. It writes the treatment, approves
  every shot, plans the sound and runs the final review.
- Builders may still split the scenes (as the Vox+ briefs do), but they build **the director's shot list**, not their
  own reading of the script. A builder who wants to change a shot asks the director.
- The director writes `DIRECTOR_LOG.md` in the film's folder: decisions, what AK said, what changed and why. A new
  session (or the Mac Mini, on another account) picks up from that log.
- Machines: the treatment can be written in a cloud session. The animatic, every render, voice and mix happen on the
  **Mac Mini** (CLAUDE.md).

## 2. The order of work

| Step | Output | Gate |
|---|---|---|
| 1. Script draft | Story Engine script with claim IDs | Story gate S1–S13 (STORY_ENGINE section 8) |
| 2. Treatment | `TREATMENT.md` (section 3) | Director's self-check (section 3, last list) |
| 3. Style frames | 3 frames rendered with the real code | Director checks them at phone size |
| 4. Animatic | Rough cut with key frames and a scratch voice (section 4) | **AK reviews** (10 minutes per film) |
| 5. Narration locked | Final words, then the real voice | Voice check: every word heard (`verify` in the builder) |
| 6. Build | Full picture cut to the real voice | Still checks per shot (as today) |
| 7. Sound | Music, effects and silences per the sound plan | Mix check (section 6) |
| 8. Review | Full-speed watch with sound (section 9) | One fix round, then **AK reviews** |

The change from what we did before: **narration is no longer locked at step 1.** The picture is designed in steps 2–4,
and the words are adjusted to the picture (shorter lines where a picture says it, a pause where the reveal needs
room) before the real voice is recorded. Facts never change in this step; only wording and timing do, and the claim IDs
stay on every line.

## 3. The treatment (`TREATMENT.md`)

Write it before building anything. About two pages. In this order:

1. **Logline.** One sentence: who or what, what is at stake, what changes.
2. **Benchmark.** One or two films that set the bar for this topic (not our own). Write what we take from them
   (structure, pacing, camera, sound) and what we don't (their look, their music, their shots). Watch them before
   writing the shot list.
3. **Three ways to tell it.** A few lines each (for example: follow the money, a countdown, a before-and-after, a
   mystery). Then the one chosen and why. The first idea is usually the obvious one; say why it lost or won.
4. **The visual anchor for each act.** One concrete thing on screen that carries the act's idea, and comes back
   (a bill that keeps ticking, a stack of notes, one document page, one map). Charts serve the anchor; they are not the
   anchor. An act without an anchor is a slideshow.
5. **The reveal and the signature shot.** Where the biggest reveal lands (about two-thirds in, STORY_ENGINE T9), what
   we hold back until then, and the one shot people will remember (a scale reveal, a match cut, a document that turns
   into a chart). Only one.
6. **Beat sheet.** For every beat: time, what is said (short), what is seen (the anchor's state), the emotion
   (STORY_ENGINE T8), and the link to the next beat: **"but"** or **"therefore"**. A link that can only be "and then"
   means the beat is cut or rewritten.
7. **Shot list.** For every shot: framing (wide, medium, close, insert), the camera move (push, pull, pan, track, rack
   focus, match cut, hold), duration, and **why** this shot. Rules in section 5.
8. **Sound plan.** For every section: room tone or ambience, the effects tied to actions, the music state (none,
   low, rising, peak, out) and the two planned silences. Rules in section 6.
9. **Packaging.** Draft title and thumbnail now, and the shot in the first 30 s that pays them off (STORY_ENGINE T16).
10. **Re-engagement points.** In a long video, a fresh question or turn at about 3 and 6 minutes.

**Director's self-check before step 3:**
- Could someone retell the film from the anchors alone, with the sound off?
- Is every beat linked by "but" or "therefore"?
- Is there exactly one signature shot, and is the reveal held back to it?
- Is there anything a first-time viewer would find confusing? Mark it and fix it now.

## 4. The animatic (AK's first review)

A rough version of the whole film, made fast, to judge structure and pacing before the expensive build.

- **Picture:** one or two key frames per beat, rendered with our real code (HyperFrames `hf.py snap` or Remotion
  stills) or, where the code isn't written yet, a plain frame with the shot's description. Simple moves only (a push or
  a pan on the still).
- **Voice:** a scratch voice from the draft script (MiniMax on the Mac Mini, or AK reading it on his phone).
- **Sound:** music state and silences marked, even as a placeholder bed and on-screen notes.
- **Assembly:** frames and voice joined with ffmpeg to `out/<film>/animatic.mp4`, at the film's real length.
- **AK watches it once at full speed** and answers three questions: where were you bored, where were you confused, and
  did the reveal land? The director changes the treatment from those answers, and only then is the narration locked.

## 5. Picture and camera

- **One look and one camera language per film.** Pick the kit (Vox+ or HyperFrames) and keep one palette, one type
  system and one way of moving. Samples are ingredients, not templates: restyle a sample to the film's look rather than
  dropping in its default look.
- **Every shot has a reason** written in the shot list. "To show the number" is not a reason; "close, so the viewer
  sees the one line that contradicts the headline" is.
- **Vary the camera.** At least four kinds of move in a long video; never three push-ins in a row (the Vox+ rule stays).
  One long held shot somewhere, to let the viewer breathe.
- **Vary the pace on purpose.** At least one clear speed-up (a run of quick cuts) and one slow-down (a hold before the
  reveal). A film at one even speed has failed, however correct it is.
- **Something is always alive on screen**, but small: a slow drift, a counter, grain. Large motion is saved for
  meaning.
- **Transitions come from the look**: a page turning, a highlighter stroke becoming the next chart's line, a zoom into
  a number. Plain fades only for a change of time or place.
- **The subject is big.** At key moments it fills at least a third of the frame height. On a phone, a document line
  fills most of the width (Vox+ review pass, 20 Oct 2026).
- **Text holds long enough to read:** at least 1.5 s after it has finished animating, plus about 1 s for every 15
  characters (more for Hindi and Tamil). Narration and screen text never compete (STORY_ENGINE T10).

## 6. Sound

AK's rule of 18 Nov 2026 ("no music under narration") is replaced, on his approval of 22 Nov 2026, by this:

- **Music is allowed under narration only if all of these hold:**
  - it is low under the voice (the Vox+ `MusicBed` duck level or lower) and never busy where the voice explains;
  - it **changes with the story's sections**: a new cue, a drop-out or a rise marks each turn, rather than one bed for
    the whole film;
  - there are **at least two planned silences** (music and effects out, voice or near-silence only), the last one just
    before the reveal;
  - there is **one musical peak**, at the reveal or the signature shot.
  If a film can't meet these, it has no music, as before.
- **India Ledger** may stay music-free to sound distinct (AK to confirm per channel), but still gets effects and the
  planned silences.
- **Effects follow actions on screen**: a stamp lands, a page turns, a counter ticks, a pin drops. Match the material
  (paper, metal, glass). In a narrated film, keep them sparse and under the voice; the old "about one every 10 s" is a
  ceiling for busy stretches, not a quota.
- **Room tone or ambience under every scene**, so cuts don't drop into dead air.
- **Use sound across a cut at least twice**: the next scene's sound arrives early, or the last scene's sound carries
  over.
- **Mix check:** about −14 LUFS overall, the voice always clear, every row of the sound plan audible in the final mix.
- Every music and effect file has its licence in the film's `LICENSES.md` (as `src/voxplus/LICENSES.md` does).

## 7. Evidence on screen (unchanged, and part of the style)

- Every number from the ledger, on screen only when spoken, with its source chip; our arithmetic and illustrations are
  labelled (CLAUDE.md).
- Show the method on big claims: a short "how we know" moment (the document, the page, the calculation) is a feature,
  not a cost. It is what the best investigative teams do and what our viewers trust us for.
- A document is shown briefly for provenance, then cropped so the key line is big (Vox+ review pass rule 1).

## 8. Things that make a film flat (check for them)

- Every sentence gets its own new picture: the viewer never settles. Group beats around the act's anchor instead.
- The reveal comes in the first minute and nothing is left to wait for.
- Three charts in a row with nothing else on screen.
- The whole film at one speed, one loudness and one music bed.
- A finished chart held in silence with nothing moving.
- Transitions that pass through an empty frame (Vox+ review pass rule 4).
- The ending is admin (subscribe, sources) rather than a callback to the opening (STORY_ENGINE T9).

## 9. Review before delivery (on the Mac Mini)

1. **Still checks** per shot, as today (overlaps, cut-off text, empty frames, the bottom 12% clear).
2. **Contact sheet** of the whole film (one frame every few seconds): one look throughout? Does the signature shot
   stand out?
3. **Full-speed watch with sound**, start to end, without stopping. Then answer, in order of weight (Walter Murch's
   ranking, emotion first):
   - **Feeling:** what should the viewer feel in each section, and did they?
   - **Story:** does every cut move the story on?
   - **Rhythm:** where does it drag, where does it rush?
   - Only then: eye-trace, layout and readability.
4. **First-time viewer pass:** watch as someone who knows nothing about the topic and note every "I was confused here".
5. **Side by side with the benchmark** for the first 60 seconds and the reveal.
6. **One fix round** for everything found, then one more check. Anything bigger goes to AK in one line.
7. **AK reviews** the final film.

## 10. After publishing

Log the YouTube Intro figure (share watching at 30 s) and the dips and spikes against the beat IDs, as STORY_ENGINE
section 7 says. After three films with this process, compare their retention graphs to our earlier films and update
this file with what changed.
