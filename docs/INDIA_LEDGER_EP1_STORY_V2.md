# India Ledger · Episode 1 · STORY VERSION (V2) · for AK's review · 19 Nov 2026

**Title (kept):** How Do You Lose Money on Gold That Only Went Up?
**Why a V2:** AK watched the built episode (10:04) and said it feels like an economics class full of numbers. People want a story full of visuals: photos, videos, motion graphics.
Every frame of the built version is a beige card with a chart or a big number, and "The Tab" box keeps numbers on screen the whole time.

**What changes:**
1. **A story with people.** Two neighbours carry the film. Amma keeps her wedding bangle. Ravi, next door, buys the government's paper gold. The government is the third character, the one making a bet. (Amma and Ravi are a made-up family, shown as "Illustration".)
   - **How they look (19 Nov):** AK asked to try all three options (illustrated, AI photo, stock photo) and pick the best. The pick is **illustrated**: flat cut-paper style characters, made with MiniMax, cut out as stickers.
   - **Why:** the government is shown in real photos, so the made-up family must look clearly made up. An AI photo could pass for a real person. Stock gave one pose each and a half-shadowed Ravi.
   - **Same faces all film:** one master cut-out each, moved and animated. New poses only from the same reference, with the outfit stated in the prompt.
   - Test frames are in `out/india_ledger/v2_tests/` and the log is in `hyperframes/media_src/characters/LICENSES.md`.
   - **They move (AK approved, 19 Nov):** each action is a 6-second MiniMax Hailuo-02 clip made from the master drawing, cut out frame by frame with `tools/anim_cut.py` and placed on the collage paper. Gestures are kept inside the frame.
   - **Clips to make (C1-C3 exist):**

| Clip | Scene | Action |
|---|---|---|
| C1 `amma_turn` | 1 | Amma turns her head, looks back and lifts the bangle hand |
| C2 `amma_no` | 4 | Amma shakes her head no and folds her hands |
| C3 `ravi_turn` | 5 | Ravi looks up from his phone and explains |
| C4 | 1 | Amma at the steel locker, opening it |
| C5 | 4 | Amma at the door, facing the bank officer (from amma_door2) |
| C6 | 5 | Ravi pays on his phone and smiles at the screen |
| C7 | 6 | Ravi opens his redemption envelope, surprised and happy |
| C8 | 8 | Amma slides the bangle across a gold-loan counter, then takes it back |
| C9 | 10 | Amma puts the bangle back in the locker and closes it |
2. **Numbers cut from about 45 to 7 spoken.** Each one is shown as a thing you can see (a single gram next to a heap, a pile of notes), not as a chart.
3. **Every scene says what you SEE.** Each is tagged VIDEO (real footage), PHOTO (a real photo) or MOTION (animation drawn in code), with where it would come from.
4. **"The Tab" box goes.** The bill shows up three times, at the moments it matters.
5. **About 7 minutes, about 1,000 spoken words** (was 10 min, 1,400).
6. **Three news sources are gone.** The old script cited ThePrint, Business Today and Business Standard. V2 uses only RBI, PIB, Ministry of Finance, DGCIS, Ministry of Mines and World Gold Council lines that are already in the fact check.

**Visual sources allowed now:** public domain, CC0, CC BY (credited), drawn in code, our own documents (src/voxplus/LICENSES.md). Never CC BY-SA.
Each PHOTO and VIDEO below is a candidate. I'll check the licence of every file before it goes in, and each one has a MOTION fallback.

**The government as a character (AK, 19 Nov 2026): a Vox-style collage of real photos.**
- **PM Narendra Modi** is the face of the 2015 bet. He launched the schemes, and the government's own photos show him handing out the first gold bond certificates.
- **FM Nirmala Sitharaman** is the face of the bill. Bonds kept being sold in her budgets from 2019, stopped in February 2024, and are paid for from the budget.
- In 2015 the Finance Minister was Arun Jaitley. Sitharaman is in the launch photos too, as a minister of state, so she is never captioned "Finance Minister" in a 2015 frame.
- **Look:**
  - Black-and-white cut-out with a white sticker edge.
  - Event photos as torn, taped prints.
  - Marker circles and handwriting on a paper background.
  - Test frames: `out/india_ledger/v2_tests/collage_A.jpg` and `collage_B.jpg`.
- **Licence:** 24 photos, all GODL-India (Government of India open licence). Free to use with credit, never in a way that mocks or suggests endorsement. The log is `hyperframes/media_src/govt/LICENSES.md`.
- **Rule:** the joke is on the situation, never on the PM or the FM. Their photos appear only on factual lines (launched, sold, paid, stopped), never on a punchline.

---

## 1 · The bangle (0:00–0:35)

**SEE:**
- VIDEO, close: molten gold poured into a mould and glowing.
- Cut to a bangle on a jeweller's scale; the digits settle.
- Cut to a steel almirah locker at home, opening.

**SAY:**
This is Amma's bangle. Her mother gave it to her on her wedding day.
In 2015, the Government of India wanted it.
She said no. So the government made a bet against her.
Eleven years later, gold is worth five times as much. Amma is fine. The government is not.
How do you lose money on gold that only went up?

**ON SCREEN (one number):** GOLD ×5 SINCE 2015 *(RBI issue price SGB 2015-I vs RBI redemption price, 19 Nov 2026 ⟳)*
**Sources to find:** pouring and weighing footage from a public-domain or CC0 archive (e.g. US government mint and refinery footage). Fallback: MOTION, a gold liquid pour drawn in code.

## 2 · A country that buys its shine (0:35–1:30)

**SEE:**
- PHOTO or VIDEO: a cargo plane landing at night.
- MOTION: a globe with gold-coloured flight lines from Switzerland and the UAE into Delhi.
- MOTION, the key image: one tiny gram of gold on the left; on the right, gram after gram piles up into a heap.

**SAY:**
India loves gold, but it hardly has any of its own.
For every gram India digs out of its own ground, it buys four hundred and forty three from abroad.
Most of it doesn't even come by ship. It flies in, much of it from Switzerland and the UAE, and lands in Delhi.
And every gram is paid for in dollars. Buy too much, and a country starts to run short of them.
So the government looked at Amma's locker and had an idea.

**ON SCREEN:** 1 GRAM DUG · 443 GRAMS BOUGHT *(Ministry of Mines 2024-25; DGCIS FY26; our arithmetic)*
**Sources to find:** a public-domain or CC BY plane photo; map from Natural Earth (already licensed).

## 3 · 5 November 2015: two plans (1:30–2:00)

**SEE (collage, frame A):**
- PHOTO: PM Modi's cut-out (official portrait) slides in.
- PHOTO: a taped print of the 5 Nov 2015 launch, with Modi handing a gold bond certificate to a woman. A marker circles the envelope.
- MOTION: two envelopes slide out of the photo, marked PLAN A and PLAN B.
- Credit: PMO / Government of India, GODL-India.

**SAY:**
On the fifth of November 2015, the government launched its gold plans on a single day.
Plan A: ask families to lend their gold to a bank.
Plan B: if they won't, sell them gold made of paper.

*Source: PIB, Ministry of Finance, 5 Nov 2015.*

## 4 · Plan A: the knock on the door (2:00–3:00)

**SEE:**
- MOTION, illustrated: a bank officer at Amma's door. She opens the locker.
- MOTION: the bangle goes into a furnace and comes out as a plain bar. Amma's face says it all.
- MOTION: an hourglass. Nine years drain on the left; sixteen days on the right.

**SAY:**
Plan A sounded simple. Lend your gold to a bank, earn interest, and the country buys less from abroad.
But the rules had a line nobody put on the poster. Your jewellery is tested and, if you agree, melted. You only ever get back gold. Never the piece.
So the government wasn't really asking for idle gold. It was asking for the bangle from her wedding. And it would give it back as a bar.
You can guess Amma's answer.
In nine years, the whole of India lent about thirty one tonnes. The country imports that much in about sixteen days.
In 2025, the government shut most of Plan A.

**ON SCREEN:** 9 YEARS OF DEPOSITS = 16 DAYS OF IMPORTS *(Ministry of Finance, Mar 2025; DGCIS; our arithmetic)*
*Sources: RBI FAQ on the Gold Monetisation Scheme (melting rule); PIB, 25 Mar 2025 (closure).*

## 5 · Plan B: Ravi buys paper gold (3:00–4:15)

**SEE:**
- MOTION, illustrated: Ravi, next door, at his laptop, pays rupees and gets a certificate that says SOVEREIGN GOLD BOND, 10 GRAMS.
- PHOTO: the Reserve Bank of India building in Mumbai (public-domain or CC BY photo, to find).
- MOTION: Ravi's money flows into a government wallet and is spent; the vault behind the certificate is empty.
- PHOTO, on "the government never bought any gold": the 2015 launch print again, with the gold envelope now circled and labelled "a promise, not gold".

**SAY:**
Next door, Ravi liked Plan B.
He pays rupees today for, say, ten grams. Eight years later, the government pays him whatever ten grams of gold is worth then, plus two and a half percent interest every year.
No locker. No making charges. No uncle asking if it's real.
But here is the catch. The government never bought any gold. Ravi's money was spent like any other loan.
What it kept was a promise: to pay back at whatever gold costs on the day.
If gold stays flat, that is a cheap loan. If gold shoots up, the government pays the difference.
It was a bet that gold wouldn't rise much. Against the one thing every Indian mother has bought for generations.

**ON SCREEN:** THE GOVERNMENT SOLD GOLD IT NEVER BOUGHT
*Sources: RBI, Sovereign Gold Bond terms; Government Securities Act, 2006.*

## 6 · The bet goes wrong (4:15–5:15)

**SEE:**
- MOTION: a seesaw. On one end, the government's piggy bank; on the other, a gold bar that keeps growing. The seesaw tips.
- MOTION: Ravi opens an envelope at redemption: one bond paid back 4.4 times what he paid.
- MOTION: the bill as a physical pile of ₹500 bundles that grows with the gold line behind it.

**SAY:**
Then gold did what gold does in India. It went up, and up. Five times.
Last week, one batch of these bonds paid back four point four times what people paid for it.
Today, the government owes about one point six lakh crore rupees on the bonds still out there.
And the bill moves every day. Each time gold rises, it grows.
Most of us check the gold price before a wedding. Someone in the finance ministry checks it before breakfast.

**ON SCREEN:** OWED TODAY ≈ ₹1.64 LAKH CRORE *(RBI tranche data; our arithmetic at ₹13,345/g ⟳)*
*Sources: RBI press release, 13 Nov 2026 (+341%); RBI tranche data.*

## 7 · Who pays (5:15–6:00)

**SEE (collage, frame B):**
- PHOTO: FM Sitharaman's cut-out, then a taped print of her carrying the budget folder (Union Budget 2023-24, cropped to her alone).
- Handwritten: "who pays? the budget". Credit: Ministry of Finance / Government of India, GODL-India.
- Her photo sits on "who pays", never on the "congratulations" line.
- MOTION: the pile of notes splits. Most of it is just the money the government borrowed. A smaller stack is the real extra cost.
- MOTION: that stack is shared out as tiny coins to a crowd of 142 crore people; each gets one coin marked ₹690.

**SAY:**
But owing isn't the same as losing. Most of that money is just what the government borrowed. It would owe that on any loan.
So we went bond by bond, all sixty seven of them, and took that out.
The real extra cost of the bet is close to one lakh crore rupees. About six hundred and ninety rupees for every Indian.
If you hold a gold bond, congratulations, you won the bet. If you pay tax, congratulations, you paid for it.

**ON SCREEN:** REAL EXTRA COST ≈ ₹690 PER INDIAN *(our bond-by-bond estimate vs the 10-year G-sec of each issue month; at ₹13,345/g ⟳; 142.6 crore people, MoHFW)*

## 8 · What Amma did instead (6:00–6:35)

**SEE:**
- VIDEO or PHOTO: a gold-loan counter, no brand name visible; a bangle slid across, a receipt slid back.
- MOTION: the same bangle goes into a bank, and comes back out.

**SAY:**
And Amma? She still won't lend her gold. But she will pawn it.
Bank loans against gold jewellery grew almost ninety percent in one year.
Same bangle goes in. Same bangle comes out. That is the whole difference.

**ON SCREEN:** GOLD LOANS +88% IN A YEAR *(RBI Bulletin, Sep 2026, bank credit by sector, 31 Jul 2026)*

## 9 · Was it a mistake? (6:35–7:05)

**SEE:**
- MOTION: one simple gold line from 2012 to 2019. It dips, then stays flat. A marker on 2015: "the first bond".
- The line then rockets off the top of the frame.

**SAY:**
Before you forward this with "scam" in capital letters: in the three years before the first bond, gold actually fell. For three years after, it barely moved. Nobody knew it would then go up five times.
Hindsight is twenty four carat.

*Source: RBI Handbook of Statistics 2019, Table 39.*

## 10 · The locker closes (7:05–7:25)

**SEE:**
- MOTION, illustrated: Amma puts the bangle back. The locker door closes. Cut to the molten gold from scene 1.

**SAY:**
Now there's a new idea: a national gold board to bring some household gold into the system. Attempt number three.
Maybe this time, someone asks Amma first.
The bondholders won. The taxpayers paid. And Amma kept her bangle.

*Source: World Gold Council, "Swarnim Udaan 2047", Aug 2026 (a proposal, not government policy).*
**EDIT:** end card: "Educational research, not investment advice." AI voice disclosed.

---

## Cut from the built version (still true, now too much for a story)
- The import rank table (crude #1, gold #2), the 86% more money / 18% less gold bars, and the airport shares.
- The first bond's 12.9% vs 7.75%, and the 15.8% a year across matured bonds.
- The redemption waves (₹80,000 cr cashable, 2028, 2031) and the reserve fund.
- The "fairly high-cost borrowing" quote: only in ThePrint. It comes back only if a primary copy of the remark is found.
- The $3.3 billion import saving: only in Business Standard.

## Open points for AK
0. **Government collage:** done as you asked (Modi for the 2015 bet, Sitharaman for the bill). Test frames sent. Scene 6's "someone in the finance ministry checks it before breakfast" uses a picture of North Block, not her face, because it is a punchline.
1. **Footage sources.** Real video is hard to get under PD/CC0/CC BY. Can I also use Pexels and Pixabay? Their own licences allow free commercial use on YouTube, but they are not CC, so the rules don't cover them yet.
2. **AI-made pictures** for Amma and Ravi (illustration style, labelled "Illustration"), or drawn-in-code characters only?
3. **Rebuild:** this replaces the built episode only if you say so. The finished version stays as it is until then (handover rule 8).
