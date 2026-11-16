# FTA-01 · Fix This Answer: "Your limits section answers a different question"

**Pilot episode 1 of the Fix This Answer format** (`docs/UPSC_MAINS_PLAYBOOK.md` §3a, AK agreed 15 Nov 2026). This is a
draft for AK and a Mains mentor to review. Built as a silent draft with estimated timing; nothing is voiced yet.

| | |
| --- | --- |
| Question | UPSC CSE (Main) 2024, Economics optional Paper I, Q4(a), 20 marks |
| Answer repaired | **Illustrative: written by us, not a candidate's copy.** The page says so for as long as it is on screen |
| The one mistake | **Writing gap (rule A1, answer what is asked):** the limits section lists RBI's rules instead of what stops the real multiplier reaching its textbook value |
| Content gaps (flagged, not repaired) | D1 (a loan opens a new deposit) and D2 (1/CRR ignores the cash people hold): taught in the ECO-16 film first |
| Transfer question | UPSC CSE (Main) 2022, Economics optional Paper I, Q3(b), 15 marks |
| Visual | Look B, the answer-video look: `pyq_question`, `pyq_xray`, `pyq_card` and the new `fta_page`, `fta_transfer` (`src/looks/upsc_rich_b/fta/CONTRACT_FTA.md`) |
| Source | `research/upsc/fta/fta-01/fta.py` (page, repair, narration); build `python3 scripts/upsc/fta_storyboard.py fta-01` |
| Length | 3 min 12 s at the estimated pace (12 scenes) |
| Language | English (AK, 16 Nov 2026: the channel is in English) |

**Where the facts come from.** Every claim ID below is in `research/upsc/ECO-16/claims.csv` and
`research/upsc/pyq/2024-eco1-4a/claims.csv`, and the builder checks every number on screen against them. The reference answer this
repair works towards is `research/upsc/pyq/2024-eco1-4a/ANSWER.md` (349 words, checked against the question paper PDF).
The transfer question's reference answer is `research/upsc/pyq/2022-eco1-3b/ANSWER.md`.

**Why this question for the pilot.** It is the most common shape of mistake the playbook's research describes: the
aspirant knows the topic (they can name CRR, SLR and the multiplier) but answers a neighbouring question. It also lets
the episode show both kinds of gap in one answer, and the topic is fully researched, so every repair rests on a checked
claim.

## 1. The question and its demands

> Describe the mechanism of credit creation by commercial banks and its implications on multiplier effect. Analyse some of
> the limitations that can jeopardise the implications on multiplier effect.

| Demand | The words | What it needs |
| --- | --- | --- |
| D1 | "Describe the mechanism of credit creation by commercial banks" | How lending creates a deposit, step by step |
| D2 | "its implications on multiplier effect" | What that does to the money multiplier |
| D3 | "Analyse some of the limitations that can jeopardise" | What stops the real multiplier reaching the textbook one, and how each does it |

Working budget: 300–350 words in about 14 minutes. That is our budget, not UPSC's: UPSC prints no word limit for this part,
and 14 minutes is our arithmetic from 3 hours for 250 marks (ANSWER_STANDARD A3, A4).

## 2. The illustrative answer (written by us)

> Banking is very important for the economy of any country. Commercial banks create credit by lending out the deposits
> they receive from the public. This process is called credit creation. Multiplier = 1/CRR. RBI's CRR is 3%, so the
> multiplier is about 33. So ₹100 of deposits becomes about ₹3,300 in the economy. Limitations: banks must keep CRR and
> SLR, so they cannot lend all their deposits. RBI also changes the repo rate. Conclusion: banks play a very important role
> in the economy.

About 80 words. It is built from the weaker answers in the reference answers, written out as an aspirant would write them.

## 3. Diagnosis

| Where | What is wrong | Kind | Rule |
| --- | --- | --- | --- |
| "Limitations: banks must keep CRR and SLR … RBI also changes the repo rate." | **The main mistake.** CRR is already inside the multiplier (m = 1/rr, ECO16-T07): it sets the multiplier's size, it does not jeopardise it. The question asks what stops real money reaching that size, and how. The answer names rules and gives no channel | Writing gap | A1 |
| "Banking is very important for the economy of any country." | Says nothing an examiner can mark | Writing | A5 |
| "Conclusion: banks play a very important role in the economy." | Repeats the opening; takes no view where "analyse" asks for one | Writing | A2, A10 |
| "Commercial banks create credit by lending out the deposits they receive" | Misses the mechanism: when a bank lends, it opens a new deposit in the borrower's name (NCERT 3.3, ECO16-N11) | Content gap (D1) | — |
| "Multiplier = 1/CRR … about 33 … ₹3,300" | 1/rr holds only if nobody holds cash (ECO16-T07). At today's CRR it is a toy ceiling of 33.3 (ECO16-A06), far above RBI's measured 5.20 for 2021-22 (2024-ECO1-4A-07) | Content gap (D2) | A7 |

The episode repairs the writing gap and the two writing slips. It **does not** repair the content gaps on screen: it says
what is wrong, gives the source, and sends the viewer to the ECO-16 film, because a structure fix cannot supply a concept
(playbook §3a).

## 4. The repair

| Action | Line(s) | Becomes | Claims |
| --- | --- | --- | --- |
| Delete | "Banking is very important for the economy of any country." | (nothing) | — |
| Strike and rewrite | "Limitations: banks must keep CRR and SLR, so they cannot lend all their deposits. RBI also changes the repo rate." | **Limits: what can break the multiplier** | |
| | | • Cash drain: people keep cash, so a higher cash-deposit ratio cuts m. India: m 5.57 → 5.20 as cdr rose 0.16 → 0.18 (RBI Bulletin, June 2022; 2019-20 to 2021-22) | 2024-ECO1-4A-06, 2024-ECO1-4A-07 |
| | | • Spare reserves: banks may not lend. US 1930–33: money fell about 35% while the base rose about 20% (IGNOU Unit 13) | ECO16-T09 |
| | | • Loan demand: the rounds go on only if people borrow (IGNOU Unit 13) | 2024-ECO1-4A-03 |
| Strike and rewrite | "Conclusion: banks play a very important role in the economy." | So the multiplier is a ceiling, not a constant: cash, spare reserves and weak loan demand keep real money below it | ECO16-T05, ECO16-A06 |

After the repair the page has about 120 words: D3 is covered, and the answer is still well under the 300–350 budget. The
episode says so plainly. The words left in the budget belong to D1 and D2 (the ₹100 → ₹500 rounds and RBI's 5.20), and
they come after the film. The reference answer shows the whole thing.

**Status shown on screen (our rubric, not a UPSC mark):** D1 partial (content gap), D2 partial (content gap), D3 missed →
covered.

## 5. The transfer question

> Compare the deposit multiplier with the money multiplier. Is there any impact on the money multiplier arising out of
> massive use of credit and debit cards? Justify your answer.
> (UPSC CSE (Main) 2022, Economics optional Paper I, Q3(b), 15 marks; checked against the PDF in the reference answer)

**The same skill:** name the channel (the cash ratio or the reserve ratio) before you give a verdict. A viewer who
learned the repair will say *how* cards could move the multiplier (a card payment that replaces cash lowers the
cash-deposit ratio, which raises m), then judge the size. A viewer who memorised our answer has nothing to copy.

Budget: 220–270 words in 11 minutes (ours; no limit is printed). Viewers write it before the next episode. With consent,
we repair two or three of theirs on screen in a later episode, and release our reference answer
(`research/upsc/pyq/2022-eco1-3b/ANSWER.md`) only after that.

**Self-check list on screen (for everyone whose answer we don't repair):**
1. Every demand has a heading.
2. Every effect names its channel.
3. The verdict answers "Justify".

## 6. Narration (draft, English)

The narration as built is in `fta.py` (it is the source; the table below is the plan it came from, lightly edited there).

| Beat | Says | On screen (sample 17 act) | Claims |
| --- | --- | --- | --- |
| b00 | You know this topic. You can write CRR, SLR and the multiplier in your sleep. So why does this answer still miss the question? Let's fix it, line by line. | The question card | — |
| b01 | UPSC, 2024, Economics optional, twenty marks. Read it slowly. It asks three things. Describe how banks create credit. Say what that does to the multiplier. And analyse what can jeopardise it. | Demands D1 to D3 highlight | — |
| b02 | Here is an answer. We wrote it, the way many aspirants do. It is not a real candidate's copy. | The page; the illustrative stamp | — |
| b03 | Start with the limits, because that is where the marks go. The answer says banks must keep CRR and SLR, and RBI changes the repo rate. | The red ring | — |
| b04 | But CRR is already inside the multiplier. One over the reserve ratio. It sets how big the multiplier is. The question asks something else: what stops real money from reaching that size? This is not a knowledge problem. It is a reading problem. | Diagnosis box: A1, writing gap; D3 missed | ECO16-T07 |
| b05 | There are two more problems, and they are different. Banks do not just lend out deposits. When a bank lends, it opens a new deposit. And one over CRR ignores the cash people keep. These are concept gaps. A better structure won't fix them. Watch our film on how banks create money first. We'll come back to them. | Amber brackets; content-gap box; D1, D2 partial | ECO16-N11, ECO16-T07 |
| b06 | Now the repair. First, delete. "Banking is very important for any economy" earns nothing. It goes. | Strike and collapse the opening | — |
| b07 | Then the limits. Strike them. A limit must say what breaks, and how. Cash drain: people keep cash, so the cash ratio rises and the multiplier falls. India's fell from five point five seven to five point two zero, as the cash ratio rose. | Heading and the first point write in | 2024-ECO1-4A-06, 2024-ECO1-4A-07 |
| b08 | Spare reserves: banks may simply not lend. In America, from 1930 to 1933, money fell about thirty-five percent even as the base rose about twenty. And loan demand: the rounds go on only if people borrow. | Points two and three write in | ECO16-T09, 2024-ECO1-4A-03 |
| b09 | Last, the conclusion. Don't repeat the opening. Answer the question: the multiplier is a ceiling, not a constant. | The verdict writes in; D3 covered | ECO16-T05 |
| b10 | Count the words. About a hundred and twenty. Our budget for twenty marks is three hundred to three hundred and fifty, in fourteen minutes. The rest belongs to the mechanism and RBI's figure, once the concept is in place. We are not giving this a mark. UPSC publishes no marking scheme, so these ticks are our rubric. | Word count, clock, rubric line | 2024-ECO1-4A-07 |
| b11 | Now you. Here is 2022: compare the deposit and money multipliers, and say whether cards change it. Different question, same skill. Name the channel before you give a verdict. Two hundred and fifty words, eleven minutes. Write it before the next episode. | Transfer card and self-check list | — |
| b12 | Post your answer in the group. We'll repair a few on screen, and only then show ours. | End card | — |

## 7. Before this is published

- [ ] A Mains mentor (economics optional) checks the diagnosis and the repair, especially the line "CRR is already inside
      the multiplier", which disagrees with textbooks that list CRR among the "limitations of credit creation". Our
      position: CRR sets the textbook multiplier; the question asks what stops the real one reaching it.
- [x] Channel language: English (AK, 16 Nov 2026).
- [ ] Re-read the living figure on the day of the voice (CRR 3.00% on RBI's Current Rates panel, last read 11 Nov 2026,
      2024-ECO1-4A-02).
- [ ] Open the Telegram group (or another way to collect answers) before b12 promises it; otherwise cut b12.
- [ ] The ECO-16 film is published first, so b05 has somewhere to send viewers.
- [ ] Watch the draft on the Mac, where the handwriting renders in Noteworthy (the cloud draft falls back to a serif).
