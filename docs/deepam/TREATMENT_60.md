# Treatment: Karthigai Deepam, the 60-second story (`kd-deepam60`)

AK, 24 Nov 2026: "Keep improving, make up to 60 sec video on short story on Karthigai Deepam, use our Director engine and
interesting Shorts." Director: this session. Process: `docs/DIRECTOR.md` (Shorts use its sections 6 and 9, plus
`docs/SHORTS_RULES.md` and `docs/storytelling/SHORTS_ENGINE.md`). Channel: The Inner Chariot. Text on screen, no voice
(AK, 24 Nov 2026), our own synthesised score.

## 1. Logline
Two gods race to find the end of a pillar of fire. One of them cheats with a flower's help, and that is why a whole
mountain is lit every Karthigai and why one flower is never offered to Shiva.

## 2. Benchmark
Not yet watched. DIRECTOR.md asks for one before the shot list. **Open:** AK to name a mythology Short he likes, or
the director picks one at the review step. What we take from the genre already: one character at a time, a clear villain
beat (the lie), a big reveal at two-thirds, and the ending looping into the opening.

## 3. Three ways to tell it
1. **"Why this hill?"** (the 15 s cut). Clean, but the answer is "because the legend says so": no conflict.
2. **The banned flower (chosen).** Open on a mystery the Tamil viewer half-knows: thalampoo is never offered to Shiva.
   The story then has a contest, a cheat, a witness who lies and a judgement. Bhagyaraj's "lie the audience knows":
   we see Brahma make the flower lie before Shiva reveals himself. The answer to the hook arrives at b8, after the peak.
3. **Countdown to the Deepam.** Festival-day framing ("tonight at 6 pm the hill is lit"). Lost: it ties the Short to a
   date, and the 15 s cut is kept date-free so it can be reposted every year.

## 4. Visual anchor per act
- **Act 1 (b1–b3), the question:** the hill-lamp, then the pillar of fire. The pillar is in every shot until b9.
- **Act 2 (b4–b6), the race and the lie:** the falling thalampoo, pale against the fire. Planted at b1 (close-up), paid
  at b6 (the wide shot with the swan) and at b8 (cast aside at the lingam).
- **Act 3 (b7–b10), the judgement:** the fire itself opening, then cooling into the hill, which is the opening shot.

## 5. Reveal and signature shot
- **Reveal:** b7 "But the fire opened. Shiva stepped out." The fire was never a thing to measure; it was Shiva.
- **Held back until then:** who the fire is. Before b7, the pillar is just fire.
- **Signature shot:** k6, Shiva emerging from the pillar, after the score's second silence and on its only peak.

## 6. Beat sheet (timings from `story.js`, 12 characters a second)

| Beat | Time | On screen | Picture | Feeling | Link |
|---|---|---|---|---|---|
| b1 | 0.0 | A whole mountain becomes a lamp. And one flower is never offered to Shiva. | k1 hill-lamp → k11 flower, close | wonder → curiosity | but |
| b2 | 6.3 | Why? It began with Brahma and Vishnu. Who is greater? | k8 the argument, wide → close | tension | therefore |
| b3 | 10.8 | A pillar of fire split the sky. Find its end, and you win. | k9 the pillar bursts → k5 up the pillar | awe | therefore |
| b4 | 15.8 | Brahma flew up as a swan. Vishnu dug down as a boar. | k3 swan → k4 boar | the race | but |
| b5 | 20.2 | But the fire never ended. Vishnu came back. "I could not find it." | k5 close → k10 Vishnu bows | defeat, honesty | but |
| b6 | 25.9 | Brahma saw a flower falling, a thalampoo. He made it lie: "He reached the top." | k11 the flower falls → k8 close on Brahma's face | unease (the lie we know) | but |
| b7 | 32.6 | But the fire opened. Shiva stepped out. Shiva has no end. | k6 close on fire → k6 Shiva | awe, the peak | therefore |
| b8 | 37.5 | No worship for Brahma. No thalampoo for Shiva. Vishnu told the truth. He was blessed. | k13 kneeling → k14 flower cast aside → k10 close | judgement, relief | therefore |
| b9 | 44.8 | They begged the fire to become small. It cooled into this hill. | k13 tilt up → k7 fire becomes hill | calm | therefore |
| b10 | 50.2 | So every Karthigai, in Thiruvannamalai, | k2 devotees → k1 backwards to frame 1 | homecoming | loops to b1 |

Three "but"s are links between beats; the script itself uses "But" twice (b5, b7), within SHORTS_ENGINE SH3.

## 7. Shot list
Kept in `PLAN60` and `SHOTS` in `scripts/deepam/film.py` (21 cuts, longest 3.6 s). Reasons, in short:
- k1 wide hill-lamp: the image everyone knows (C6, prime with what is known). It is also the last frame (loop).
- k11 punch-in on the flower at b1: plants the payoff; at b6 the same clip wide shows where the flower came from.
- k8 wide then punch-in: the argument tightens on "Who is greater?".
- k9 then k5: the pillar's arrival, then its scale.
- k3 / k4: the race in two fast cuts (the speed-up).
- k10 on Vishnu's honesty, reused close at b8 for the blessing (the same face, now blessed).
- k8 punch-in on Brahma's face for the lie: the audience knows; Shiva doesn't yet. (A separate k12 shot was dropped:
  image-01 drew Brahma as an East Asian sage in three tries.)
- k6 punch-in on the flames then wide on Shiva: the reveal from inside the fire.
- k14 the flower cast aside at the lingam: the hook answered in one picture.
- k7 fire into hill, k2 devotees, k1 reversed: the hold and the loop.
Every new shot is made from a still with Hailuo-02 and graded to the 8-colour palette, like k1–k7.

## 8. Sound plan (`film.py sound`, all synthesised in code, nothing to license)

| Section | Music | Effects |
|---|---|---|
| b1 | low D pad | temple bell at 0 s (the hill lamp) |
| end of b1 | **silence 1** (0.45 s) before "Why?" | — |
| b2 | low pad back | — |
| b3 | pad rises, A pad enters | big drum + echo on "A pillar of fire" |
| b4 | fuller | chase pulse every 0.5 s |
| b5 | pad thins | — |
| b6 | a semitone-off drone under the lie | — |
| end of b6 | **silence 2** (0.85 s), just before the reveal | — |
| b7 | **the one peak**: A pad full on "Shiva stepped out" | big drum + deep temple bell |
| b8 | calm D pad | small high bell on "Vishnu told the truth" |
| b9 | settling | slow low drum on "It cooled into this hill" |
| b10 | same level as the start, so the loop does not jump | — |

Mixed to about −14 LUFS.

## 9. Packaging
- **Title** (32 characters): "Why Shiva never gets this flower". The hook is the flower, the answer is in the Short (O6).
- **Thumbnail / first frame:** k1, the hill-lamp.
- **Send line:** the flower every Tamil home knows, and why it is never offered to Shiva.

## 10. Evidence and labels
- On screen all the way through: "Illustration · legend (Shiva Purana, Vidyeshvara Samhita; Arunachala Mahatmyam)".
- Sources for each beat: the pillar, the swan and boar, the ketaki (thalampoo) false witness, the curses and Vishnu's
  blessing are in the Shiva Purana, Vidyeshvara Samhita (chapters 6–9 in most translations). The fire becoming the
  hill and the yearly light on it are in the Arunachala Mahatmyam (Skanda Purana). Retellings vary in detail; the
  Short states only what all the common ones share, and calls it legend.
- No date, number or price is claimed.

## Director's self-check
- Retell from the anchors with sound off: hill-lamp → flower → pillar → race → flower and lie → fire opens → flower cast
  aside → hill. Yes.
- Every link is "but" or "therefore". Yes (section 6).
- One signature shot (k6), with the reveal held back to it. Yes.
- Possible confusion for a first-time viewer: "thalampoo" is Tamil; a non-Tamil viewer may not know it. The picture
  shows the flower each time the word appears. Kept, since the Short is for Tamil families first.
