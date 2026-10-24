# Jev review of the 15-minute Gita video: findings

On 22 Oct 2026 Jev (jev-latest) checked 169 items: 24 verse cards, 87 on-screen labels and 58 narration lines. Each claim was paired with its verse from the corpus (`scripts/gita/jev_review.py`; raw scores are in `jev_review.jsonl` and the auto-flag list in `jev_review.md`). It flagged 125 items. I checked each flag against the Sanskrit myself; the verdicts follow.

## What the flags are worth

- **Label word form ("is this a correct standalone Sanskrit form?") is noise.** The median score is 0.58, even for words copied letter for letter from the verse (pitṝn scored 0.54). The code check in `gita15.py check` proves every label occurs in its verse, which is stronger evidence.
- **Possible offence sits at 0.2–0.5 on almost every line**, including lines that only restate a verse ("I am the taste in water", 0.32). It is useful only where it stands out.
- **The support question marks framing lines as "unsupported"** ("This is the summit.", "Two armies face each other…"). Those lines make no claim about the Gita, so these flags are not errors.
- **The "fair reading" question was also asked of Meera's lines.** Those are story, not readings of a verse, so their low scores mean nothing.

## Real findings

### A. On-screen label glosses (my wording; no re-voice needed)

| Label | Jev | Problem | Fix |
| --- | --- | --- | --- |
| himālayaḥ (10.25) | 0.39 | The English shows only "among mountains", not what the word means | "the Himalaya, among mountains" |
| aśvatthaḥ (10.26) | 0.43 | Same | "the sacred fig, among trees" |
| mārgaśīrṣa (10.35) | 0.32 | Same | "Margashirsha, among months" |
| yajñārthāt karmaṇo’nyatra (3.9) | 0.60 | "binds" comes from the rest of the verse, not from this phrase | "action other than for the sake of offering" |
| sattva (14.5) | 0.64 | "clarity" alone is narrow; the usual rendering is goodness or purity | "goodness, clarity" |

### B. Card translations (read aloud, so 3 lines would be re-voiced)

| Card | Jev | Finding | Proposed wording |
| --- | --- | --- | --- |
| 9.26 | faithful at only 0.32; adds 0.42 | "offering of love" is looser than bhakty-upahṛtam, "offered with devotion" | "…that offering, made with devotion by one whose heart is pure, I accept and partake of." |
| 10.41 | omits 0.18 | sattvaṃ, "whatever being", is not rendered | "Whatever being is glorious, beautiful or mighty, know that it springs from a spark of my splendour." |
| 13.2 | misleading 0.46 | The second sentence is awkward English | "This body, Kaunteya, is called the field. Whoever knows it is called the knower of the field by those who know." |

No change is proposed for these:
- 18.66 (misleading 0.52): the verse is contested between schools, and the card's gloss already says so.
- 12.13 (omits 0.32): the sentence continues into 12.14, and the gloss says that.
- 15.1 and 1.47: within tolerance.

### C. Narration (your call: these lines are in the approved script)

| Line | Jev | Finding | Option |
| --- | --- | --- | --- |
| open1_1 "the finest archer of his age" | false-fact 0.48 | Contested within the Mahabharata (Karna, Bhishma, Drona) | "the great archer Arjuna" |
| ch9_1 the LIC motto line | offence 0.61 (the highest); false-fact 0.49 | The fact is true (LIC's motto is योगक्षेमं वहाम्यहम्, 9.22), but tying the verse to an insurance logo may read as trivialising | keep, or drop the sentence |
| ch1_2 OUR NOTE "Even this collapse is called a yoga, because it is where the journey begins" | fair reading 0.18 | Presented as the reason for the chapter's name; it is a modern reading | "…called a yoga. Many teachers read it as the place where the journey begins." |
| ch10_1 "Margashirsha, the month of Gita Jayanti" | false-fact 0.55 | True: Gita Jayanti is Mokshada Ekadashi, Margashirsha Shukla Ekadashi | keep |
| ch8_2 OUR NOTE "Remember, and do the work in front of you" | fair reading 0.35 | A defensible reading of 8.7, "remember me and fight" | keep |

## Still needed

Jev is a fast first pass; it is not a Sanskrit reviewer. A person who reads Sanskrit should still sign off on the cards before upload.
