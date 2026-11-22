# mm-asianpaints-dealers: SCRIPT (DRAFT v1)

**DRAFT, 22 Nov 2026, script writer (role 4).** The director joins next. Wording may change at the director's request until
AK approves the animatic; facts and claim IDs do not change. Not voiced. Machine-readable copy: `script.json` (same beats).

- **Film question:** Is the Asian Paints dealer and tinting network still a moat now that new entrants are spending to copy it?
- **Channel:** Moat & Margin. No buy/sell/hold, no price target, no valuation verdict. On screen throughout:
  "Educational research, not investment advice · not SEBI-registered" (SHORTS_RULES O5).
- **Written from:** `research/claims.jsonl` only (not the article). Sources: S01 Asian Paints IAR 2025-26, S02 Grasim IAR
  2025-26, S03 Bombay High Court judgment WP 2887/2025.

## Format and length

**A Short: about 44 s (40-46 s at 2.9-3.4 words a second plus 5.0 s of pauses), 120 spoken words, 10 beats, Reveal Loop.**

Why a Short, not a long film:
- The research was done in Shorts mode (3 primary sources). A long film (STORY_ENGINE section 6) needs three chapters, each
  with its own loop and turn. The sources can fill one: they show what each company says and what a court recorded as an
  allegation. They have no tinting-machine count, no dealer margins and no evidence of dealers switching (open_questions 3,
  4, 9). Three chapters would be padding, or would need facts we don't have (Rule zero).
- SHORTS_ENGINE section 5: "one turn after one obstacle" is the 45 s row, and F1 Myth Flip sits there.
- Topic test (SHORTS_FORMAT section 1). **Familiar:** pass. Asian Paints is a household name, and a paint shop's colour-mixing
  machine is something most viewers have seen. **Hidden:** pass. Most viewers won't know that the top ten dealers take under
  ₹1 in ₹100, or that the rival's tinting machine turned up in a court judgment. **Send:** borderline. The court angle is
  forwardable, but the moat question is closer to an investor's interest. Send line (in `script.json`): people forward it
  because everyone has stood at that machine, and nobody knows it turned up in a court case.

**Main format: F1 Myth Flip**, in the Moat & Margin series **The Catch** (SHORTS_FORMAT section 6). Signal: myths.md M13
"Asian Paints' dealer network is its moat" is **Embellished**, against primary evidence. The company's own risk table
treats the dealer as the contested asset [C008], the rival says it built a dealer network of its own [C012, C013], and the
fight has reached a court record [C028]. The flip is partial, and the script says so: not "no moat", but "still the prize,
and now contested". No layer added.
Rejected: F10 Paradox. The count fell while "nearly 6,000 touchpoints" were added (C001/C003), but the hidden factor is not
in the research (open_questions 9). F9 Face-off: the two dealer counts are not like-for-like (conflicts K4).
Rotation: nothing records the previous Moat & Margin main format, so I could not check it (dry-run note).

**The reveal (peak), b6-b7, about 50-69% of the way through:** the rival's tinting machine is in a court judgment. Grasim
alleged that Asian Paints directed dealers to return it or not install it. It is held as an allegation only (b8).
**The click (b9-b10):** even the rival's own report says challengers with distribution depth gain most. So the counter is
still the prize, which is why Asian Paints calls its network one of its strongest advantages (loop to b1).

## Beats

Link = how the beat leads into the next: BUT or THEREFORE. Only one spoken "But" (b6), to meet SHORTS_ENGINE SH3. The
other links are logical, and the director should keep them as cuts on the turn.

| Beat | Move | Narration (say) | On screen (keywords) | Claims | Link to next |
|---|---|---|---|---|---|
| b1 | M1 Hook | Asian Paints calls its network one of its strongest advantages. | Hook overlay from frame 0: **STILL A MOAT?** · caption 'One of our strongest' · src S01 | C004 | BUT: a rival is spending |
| b2 | M1 Foreshadow | Still a moat? A new rival says it invests aggressively. | Rival: 'invest aggressively' · src S02 | C024 | THEREFORE: to judge it, look at how Asian Paints sells |
| b3 | M2 Ground | Asian Paints sells almost all to dealers and distributors. The ten biggest take under one rupee in a hundred. | **Top 10: 0.9%** · src S01 BRSR | C002 | THEREFORE |
| b4 | M2 Ground (mechanism) | So rivals must win them shop by shop. | Shop by shop · label **OUR READING** | C002 (inference, dossier "real story" 1) | THEREFORE: that is what the rival did |
| b5 | M3 Push | Grasim says its Birla Opus has over fifty thousand dealers, with compact tinting machines. | **50,000+ dealers · Grasim says** · src S02 | C012, C013 | BUT: that machine is now in a court record |
| b6 | M4 Turn (peak starts) | But that machine has ended up in a court judgment. | In a court judgment · src S03 | C027, C028 | THEREFORE |
| b7 | M4 Turn (**PEAK**) | Grasim alleged Asian Paints directed dealers to return it, or not install it. | **Allegation only** · src S03 para 30 | C028 | BUT: an allegation is not a finding |
| b8 | M4 Turn (guard rail) | The regulator's probe order, the court notes, is merely a prima facie opinion. | 'Merely a prima facie opinion' · src S03 | C030, C031 | THEREFORE: so what decides it? |
| b9 | M5 Echo (click) | Still a moat? Even Grasim's report says challengers with distribution depth gain most. | Brand · capacity · **distribution depth** · src S02 Outlook | C025 | THEREFORE |
| b10 | M5 Echo (loop) | So the counter is still the prize. Which is why | The counter · label **OUR READING** ('counter' is a metaphor from Asian Paints' 'counter share') | C006, C008, C025 | THEREFORE: loops into b1 |

Words: 10 / 10 / 19 / 8 / 14 / 10 / 13 / 13 / 13 / 10 = **120**. Spoken numbers: three (ten, one rupee in a hundred, fifty
thousand). The loop line runs into the first: "...Which is why / Asian Paints calls its network one of its strongest
advantages."

## Fact notes for the director (keep these when the wording changes)
- Every Birla Opus figure is Grasim's own claim: keep "Grasim says" or "it says" in the voice, and "Grasim says" on screen.
- C028 is an allegation recorded by the court. Keep "alleged". Never "forced" or "made dealers" (C031). No finding exists.
- C027: no upload date for the CCI order. No order date is spoken.
- C023 is DISPUTED. It is not used, and no contractor growth rate appears anywhere.
- Dropped on purpose: the dealer/distributor count falling (75,793 to 72,873, C001/C033), the researcher's top hook. Netting
  it against the 6,000 touchpoints is barred (K1), and the report gives no reason for the fall. In a 45 s Short, placing it
  next to Birla Opus's 50,000 would imply the rival took them (C033 note), and the hook would promise a "why" we cannot pay
  (SHORTS_RULES O6). It fits a long film with the K1 caveat on screen.
- C025 lists three things (brand strength, capacity, distribution depth). The voice names one, so the caption must show all three.
- b3 "under one rupee in a hundred" is 0.9% of sales to dealers/distributors, which is 99.0% of sales (C002). The rounding is
  safe either way.
- Visuals: real document close-ups (S01 BRSR table PDF p.164; S02 PDF pp.30-31; S03 PDF pp.28-29, 39). A drawn shop counter
  or tinting machine is **illustrative** and must be labelled so. No company photos until AK clears them. Frame 1 should be
  the subject (the highlighted report line, or the machine labelled illustrative), not text on a plain background (S8).
- What the script does **not** claim: that the moat holds, that dealers are switching, or who is winning. The sources cannot
  say any of that.

## Story gate (STORY_ENGINE section 8)

| Gate | Result | Reason |
|---|---|---|
| S1 Facts | PASS | Every line carries claim IDs. All are VERIFIED-P; C023 (DISPUTED) is unused. `research_check.py --lite --script` exits 0 |
| S2 Format | PASS | F1 Myth Flip. Signal: M13 Embellished, against primary evidence (C008, C012, C013, C028) |
| S3 Question | PASS | "STILL A MOAT?" is on screen from frame 0 and spoken at about 3.5-4 s (under 6 s) |
| S4 Prime | PASS | b1 opens on a name the viewer knows and the company's own claim, before the question |
| S5 Resolve | PASS (with a note) | "Still a moat?" is answered in b9-b10: still the prize, now contested. It honestly stops short of "the moat holds", because the sources cannot show dealer behaviour |
| S6 Peak | PASS | Marked at b7 (the allegation), in b6-b7, about 50-69% through |
| S7 End | PASS | The loop line rhymes with b1; no admin |
| S8 Screen text | PASS | Keywords and numbers only, never the spoken sentence (the C031 quote is the only full phrase, a 4-word quote) |
| S9 Numbers | PASS (with a note) | Three numbers. 0.9% is given its own perspective ("one rupee in a hundred"); 50,000 is there to show the rival's scale. b3 has "ten" plus "one rupee in a hundred", which I count as one statistic (the top-10 share) |
| S10 Hedges | PASS | "says" / "Grasim says" on every Birla Opus line; "alleged"; "merely a prima facie opinion" word for word |
| S11 Retell | PASS | "Asian Paints sells through tens of thousands of small dealers and calls that a key advantage. A rival says it built 50,000 dealers with tinting machines, and the fight over those machines reached a court, as an allegation. Even the rival says distribution depth wins, so the dealer counter is still the prize." |
| S12 Audience | PASS (with a note) | Nothing from any "avoid" list: no advice, no hype, no persona. STORY_ENGINE has no Moat & Margin profile, so I used SHORTS_RULES section 8's Moat & Margin row plus the Moat Atlas avoid list |
| S13 Review | **FAIL as written** | The repo has no Bhagyaraj skill and no Nolan skill (`.claude/skills/` holds only motion-design). I did both passes by hand from the gate's own words. Heart and plants: b5 plants "the machine", b6 pays it off, b10 pays off b1. Structure and turn: one turn (b6), peak at b7, the click reinterprets b1. A real skill pass is still owed |

Shorts gate (SHORTS_ENGINE section 8) and hard rules (SHORTS_RULES section 2):
- SH1: the question is on screen at 0 s, spoken about 3.5 s in.
- SH2: 120 words is the top of the 45 s budget (100-120).
- SH3: one spoken "But".
- SH4: links are in the table above.
- SH7: 3 numbers.
- SH8: the turn (machine in court) is planted at b5.
- SH9: b10 runs into b1.
- SH10: the Short stands alone.
- H3: the first sentence is 10 words, about 3.2 s.
- H5: about 167 words a minute.
- H6: 10 beats, 120 words.
- **WARN expected:** `shorts_check.py` warns above 45 s. If the voiced cut runs over 45 s, trim b3 first. The script writer
  cannot run it: it needs a built Short id.
