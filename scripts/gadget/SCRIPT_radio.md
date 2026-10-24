# The Inventor's Desk No. 001 — The Radio (everyday-science channel, episode 1)

Built 22 Oct 2026 after AK said "Ok Start with 1 videos" on the channel plan (`CHANNEL_PLAN.md`). Channel name The Inventor's Desk (AK, 22 Oct 2026); sign-off "Now you know."; tag "No. 001".
Also copied as `out/gadget/radio/TheInventorsDesk-001-radio.mp4` (+ `_phone`).
Output: `out/gadget/radio/GK-radio.mp4` (90.9 s, 1080x1920, -14.1 LUFS) + `_phone.mp4`. Composition `GK-radio`.

## v2 (23 Oct 2026): explain like I'm 5 + rich motion
AK: "Yes, redo the radio episode explain-like-I'm-5 with rich motion." New narration in `src/gadget/radio/script.json`
(v1 kept as `script_v1_grownup.json`); art in `src/gadget/radio/art2.tsx` (classroom, long wire, pond, spark, ocean with
Marconi's kite, tower over a city, tuner, noisy room, jigsaw, valve radio, 100 people / homes); output
`out/gadget/radio/TheInventorsDesk-001-radio.mp4` (101.3 s, -14.1 LUFS; phone copy `_phone.mp4`).
Simple wording and what it stands for (facts unchanged from the ledger below):
- "a teacher made a bell ring in another room, with no wire" = Bose, Presidency College, 1895, rang a bell remotely (IEEE).
- "invisible waves ... like ripples in a pond" = electromagnetic waves (analogy, tagged on screen).
- "Maxwell said these waves must exist" = predicted them (1865); "Hertz made them with a spark" = spark-gap transmitter (1886-88).
- "he said he heard a signal from across the ocean" = Marconi reported hearing Morse "S" (1901, IEEE lists the doubts).
  The kite on screen: the receiving antenna at Signal Hill was lifted by a kite (IEEE Milestone).
- "a tall metal rod shakes tiny bits of electricity up and down" = an antenna's accelerating charges (NASA).
- "turning the knob picks just one" = tuning to one frequency; "one friend's voice in a noisy room" = analogy, tagged.
- "reaches ninety nine in every hundred Indians" = AIR covers 99.18% of the population (Prasar Bharati).
- "about five in a hundred homes" = 4.9% own a radio/transistor (NFHS-5).

## Fact ledger (checked 21-22 Oct 2026)
| Line | Source |
|---|---|
| 1895, Presidency College, Calcutta; bell rung and gunpowder set off remotely; 60 GHz; 23 m; two walls | IEEE Milestone "First Millimeter-wave Communication Experiments by J.C. Bose, 1894-96" (dedicated 2012), ethw.org |
| Maxwell predicted electromagnetic waves at the speed of light, 1865 | Maxwell, Phil. Trans. 155 (1865); IEEE Milestone "Maxwell's Equations" |
| Hertz made the waves with a spark gap and detected them, Karlsruhe 1886-88 | IEEE Milestone "First Generation and Experimental Proof of Electromagnetic Waves, 1886-1888" |
| Marconi filed his wireless patent in 1896 | GB 12039 (filed 2 Jun 1896); page shown is US 586,193 (granted 13 Jul 1897), public domain |
| 1901: Marconi reported hearing a signal across the Atlantic (Poldhu to Signal Hill, Morse "S") | IEEE Milestone "Reception of Transatlantic Radio Signals, 1901" (it lists the doubts, hence "reported") |
| Transmitter: accelerating charges in an antenna make the wave; tuning picks one frequency | NASA Radio JOVE lesson 1; NASA "Radio Waves"; Marconi US 763,772 |
| AM varies strength, FM varies frequency | Britannica "Modulation" (secondary; standard textbook fact) |
| No single inventor | IEEE Milestones for Maxwell, Hertz, Bose, Marconi, Popov, Branly; Nobel 1909 shared Marconi/Braun |
| Radio Club of Bombay on air June 1923; All India Radio named 8 Jun 1936 | Prasar Bharati milestones |
| AIR signal covers about 99% of the population (99.18%) | Prasar Bharati growth page |
| 4.9% of households own a radio/transistor (2019-21); 30.9% in 2005-06 | NFHS-5 via DHS Program API (indicator HC_HEFF_H_RDO); counts sets, not listening on phones |

**Not said on purpose:** "Bose invented radio before Marconi"; "Marconi stole Bose's coherer"; "Marconi proved
transatlantic radio"; Fessenden's Christmas Eve 1906 broadcast; the 1943 Supreme Court "Tesla invented radio" myth.
**Recheck before publishing:** NFHS-6 (2023-24) fact sheets, out since 29 May 2026, may have a newer radio figure.

## Visual sources
- Marconi US 586,193 drawing sheet 1 (patentimages.storage.googleapis.com), public domain.
- Bose portrait: Commons "J. C. Bose (1907).jpg", reproduced in Patrick Geddes, *The Life and Work of Sir Jagadis C.
  Bose* (1920), marked public domain; credited on screen.
- Everything else drawn in code (`src/gadget/radio/art.tsx`). Music and SFX: CC0 files in `public/voxplus/audio`.
