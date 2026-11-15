# ECO-16 P1 script: independent fact audit (gate S5), 4 Nov 2026

Auditor opened each cited passage in `sources/` (txt). Script, claims.csv and all other files not edited. Rows = every `VOICE` sentence (s1, s2...) and each `SCREEN` caption (cap), beat by beat.
Files: leec103 = NCERT XII Introductory Macroeconomics ch.3 (printed pp.36-51); jess203 = NCERT X Money and Credit (pp.39-41); gees111 = NCERT VII Ch.11 (p.243); rbi_faq = RBI "Indian Currency" FAQ (15 Apr 2025); wss = RBI Weekly Statistical Supplement extract 21 Aug 2026, Table 6; hbk = RBI Handbook notes (rbi_pub16037); ign_b8 = IGNOU EEC-11 Block 8 Unit 18; ign_u5 = IGNOU Unit 5; keynes13/15; fisher = Fisher 1911 text; pigou = Pigou 1950.

**Arithmetic redone.** M3 = 4,185,446 + 3,585,981 + 24,387,268 + 122,607 = 32,281,302 (matches wss). Shares: cash 12.97%, demand 11.11%, time 75.55%, other-RBI 0.38%, cash+demand 24.07%, all deposits 87.03% (A08, A12 OK). Currency-deposit ratio 4,185,446 / 27,973,249 = 0.1496 (A09 "0.150" rounds; "about fifteen paise" OK). Pen/pencil 10/2 = 5 OK. Bond: 10/1.05 + 110/1.05^2 = 109.297 (NCERT prints 109.29 "approx.", truncated; rounds to 109.30); 10/1.06 + 110/1.06^2 = 107.334 (107.33 OK). P = MV/T, doubling M doubles P if V, T fixed (IGNOU 18.4 prints exactly this). Syllabus line P01 checked in the UPSC notice text: "Demand for and Supply of Money ... Quantity Theory of Money (Fisher, Pigou and Friedman) and Keynes' Theory on Demand for Money" OK. "Set up in 1935": RBI About Us "established on April 1, 1935" OK.

**Totals: 118 rows. PASS 86 · FIX 30 · FAIL 1 · UNREAD 1.**

## Row table

| beat | sentence | claim | verdict | what was checked | exact corrected wording (FIX/FAIL) |
|---|---|---|---|---|---|
| b00 s1 | Last time you paid for fruit with your phone; no note changed hands; money moved | N55 | PASS | gees111 p.243: UPI etc. "directly transfer money from one person's bank account into another"; the fruit-cart QR scene is NCERT VII's own example. Framing is ours and makes no figure claim. | |
| b00 s2 | "all the money in India, by the widest measure the Reserve Bank uses" | A08, I02 | **FAIL** | Not supported and contradicted by the sources. leec103 p.48: "M3 and M4 are known as broad money ... M4 is least liquid of all" (M4 = M3 + post office deposits, so M4 is wider than M3). hbk table (Measures of Monetary and Liquidity Aggregates) lists M0-M4, NM1-NM3 and L1-L3 (L3 is wider again). NCERT calls M3 only "the most commonly used measure". "All the money in India" also overstates: M3 is one measure. | "Now add up the money in India using broad money, M3. NCERT calls it the most commonly used measure." |
| b00 s3 | In July 2026 only about 13% was notes and coins | A08, I02 | PASS | wss Table 6 row 1.1 currency with the public 41,85,446 of M3 3,22,81,302 = 12.97%. "Currency with the public" excludes cash in bank vaults; caption says "cash with the public", narration is fine as the sentence is about M3's cash part. | |
| b00 s4 | "The rest was deposits, almost all of them in banks" | A08, I02 | PASS | Rest = 87.03%: demand 11.11 + time 75.55 + other deposits with RBI 0.38. Bank deposits are 86.66 of 87.03 = 99.6% of "the rest". "Almost all" is accurate. | |
| b00 s5 | So what is money, really? And who makes it? | none | PASS | Question, no claim. | |
| b00 cap | Money (M3), 31 Jul 2026: cash with the public ≈ 13% · deposits ≈ 87% · RBI | A08, I02 | PASS | As above; date and publisher given; 87% includes 0.38% "other deposits with RBI", disclosed in claim note. | |
| b01 s1 | "This matters for the exam too. The syllabus for the Economics optional paper names the demand for money and the supply of money" | P01 | PASS | UPSC notice 05/2026, Economics Paper I 3(a): "Demand for and Supply of Money". | |
| b01 s2-s6 | The plan: why people want money, what counts as money, who supplies it; part 1 of 3; part 2 loan money; part 3 credit and payments | P01 | PASS | Structure only (our plan). Depends on Parts 2-3 being built as described. | |
| b01 cap | plan: why we want money → what counts as money → who supplies it · Part 1 of 3 | P01 | PASS | As above. | |
| b02 s1 | "NCERT's example is a shoe-maker who wants wheat" | N29 | PASS | jess203 p.39: "Take the case of a shoe manufacturer. He wants to sell shoes in the market and buy wheat." It is the Class X book (Class XII uses rice and clothing). Say "Class 10" if shown. | |
| b02 s2 | "Barter works only if the wheat farmer wants shoes at that very moment" | N29 | **FIX** | jess203 p.39: farmer "not only wants to sell wheat but also wants to buy the shoes in exchange". "At that very moment" is our addition and not in NCERT. | "Barter works only if the wheat farmer also wants to buy shoes." |
| b02 s3 | Economists call this a double coincidence of wants | N01 | PASS | jess203 p.39 and leec103 p.36 both use the term. | |
| b02 s4 | "What one person wants to sell must be exactly what the other wants to buy" | N29 | PASS | jess203 p.39: "What a person desires to sell is exactly what the other wishes to buy." | |
| b02 s5 | That is hard to find | N01 | PASS | leec103 p.36: "improbable ... search costs may become prohibitive". | |
| b02 s6 | "So people picked something that everyone accepts, and traded through it. That is money." | N01 | **FIX** | NCERT says an intermediate good "acceptable to both parties" is necessary and "is called money" (XII p.36); "commonly accepted medium of exchange" (p.36). A historical story that "people picked" it is not in the text. | "So an intermediate good that everyone accepts is needed. That is money." |
| b02 cap | barter: needs a double coincidence of wants · money = a commonly accepted go-between · NCERT | N01, N29 | PASS | leec103 p.36 "commonly accepted medium of exchange". | |
| b03 s1-s2 | Money does three jobs; the first is medium of exchange | N02, N01 | PASS | leec103 pp.36-37 3.1 Functions of Money: medium of exchange, unit of account, store of value. | |
| b03 s3-s4 | Shoe-maker sells shoes for money, buys wheat; neither needs to want what the other makes | N01 | PASS | jess203 p.39-40: money "eliminates the need for double coincidence of wants". | |
| b03 cap | job 1: medium of exchange | N02 | PASS | | |
| b04 s1-s2 | Second job: unit of account; every price is stated in rupees | N02 | PASS | leec103 p.36: "value of all goods and services can be expressed in monetary units". | |
| b04 s3-s4 | Pen ten rupees, pencil two; one pen is worth five pencils | N02 | PASS | leec103 p.36: "pen is worth 10 ÷ 2 = 5 pencils". 10/2 = 5 redone. Call it "NCERT Class 12" if class shown. | |
| b04 s5 | "nobody needs to test every pair of goods" | N02 | **FIX** | Our inference, not in NCERT, unlabelled and not a claim anyone can check. | "So prices in rupees let us compare any two goods." |
| b04 cap | job 2: unit of account · NCERT: pen ₹10, pencil ₹2 → 1 pen = 5 pencils | N02 | PASS | | |
| b05 s1 | "The third job is the hardest." | N03 | **FIX** | Editorial, no source. NCERT only says the function needs stable value. | "The third job depends on stability." |
| b05 s2-s4 | Money must be a store of value; a rupee kept today should buy about as much later; when prices rise purchasing power falls; "That is what a rupee can buy" | N03 | PASS | leec103 pp.36-37: "a rising price level may erode the purchasing power of money". The "about as much later" gloss is ours but harmless. | |
| b05 s5 | "NCERT says money stores value only if its own value stays fairly steady" | N03 | **FIX** | leec103 p.37: "to perform this function well, the value of money must be sufficiently stable". "Only if" is stronger than "to perform well". | "NCERT says that, to store value well, the value of money must be sufficiently stable." |
| b05 s6 + cap | "Gold, land and bonds store value too, but they are harder to convert and not accepted everywhere" / "harder to convert" | N03 | **FIX** | leec103 p.37: assets can store value, "however, they may not be easily convertible ... and do not have universal acceptability". NCERT hedges "may not"; also lists houses. | "Gold, land and bonds can store value too, but they may not be easily converted, and they are not accepted everywhere." Caption: "gold, land, bonds: may be harder to convert". |
| b06 s1-s3 | People want money, but how much do they hold? "NCERT gives two forces." | N05 | PASS | leec103 p.37 3.2.1: transactions (income) and interest rate. | |
| b06 s2 | "money in a pocket earns nothing" | N05 | PASS | leec103 p.37 (holding money = foregone interest); ign_u5: "money at home does not earn anything". | |
| b06 s4 | "The more you spend, the more money you need at hand. So the demand for money rises with income." | N05 | PASS | leec103 p.37: larger transactions, transactions depend on income, so a rise in income raises demand. | |
| b06 s5 | When interest rate rises people hold less, because money in hand gives up that interest | N05 | PASS | leec103 p.37, wording matches. | |
| b06 cap | demand for money: rises with income · falls when the interest rate rises (NCERT 3.2.1) | N05 | PASS | | |
| b07 s1 | "In 1936, Keynes split this demand into three motives." | T14 | PASS | keynes13 l.23: "The three divisions of liquidity-preference ... transactions-motive ... precautionary-motive ... speculative-motive" (General Theory 1936 ch.13; local copy is a marxists.org transcription, not the Macmillan page). | |
| b07 s2 | Transactions motive: money for the week's shopping and bills | T14 | PASS | keynes13: "the need of cash for the current transaction of personal and business exchanges". | |
| b07 s3 | Precautionary motive: money kept for a bad day | T14 | PASS | keynes13: "the desire for security as to the future cash equivalent"; keynes15: "contingencies requiring sudden expenditure". | |
| b07 s4 | "Speculative motive: money kept back while you wait for a better time to buy a bond" | T14 | **FIX** | keynes13: "the object of securing profit from knowing better than the market what the future will bring forth". Waiting to buy a bond is only one case; and the wording does not say whose guess drives it. | "The speculative motive: money held to profit from judging the future of interest rates better than the market, for instance selling bonds when you expect their price to fall." |
| b07 s5 | "Keynes called the whole thing liquidity preference, and NCERT uses that name too" | T14, N20 | PASS | keynes13 l.12, 23 ("three divisions of liquidity-preference"); leec103 p.43: "referred to as liquidity preference". Note: NCERT's own Box 3.1 says "two motives" (transaction and speculative); it does not name the precautionary motive, so the three-motive list rests on Keynes alone. | |
| b07 cap + picture | Keynes (1936): 3 motives ... → liquidity preference | T14 | **FIX** | SCRIPT note says the jars are "labelled as such on screen", but the SCREEN text has no "our picture" tag. The three jars (shopping, umbrella, bond) are our illustration. | Add to caption: "jars: our picture". |
| b08 s1 | A bond's price falls when interest rates rise | N21 | PASS | leec103 pp.45-46: "price of a bond is inversely related to the market rate of interest". | |
| b08 s2-s3 | NCERT's bond is worth about 109 at 5%, about 107 at 6% | N21, A03 | PASS | PV = 109.297 (NCERT prints 109.29 approx.) and 107.334 (107.33). "About one hundred and nine / one hundred and seven" is correct either way. | |
| b08 s4 | People who expect rates to rise sell bonds and hold money | N21 | PASS | leec103 p.46: "You expect interest rate to rise ... try to sell your bond and hold money instead". | |
| b08 s5 | "That is why speculative demand for money falls as the interest rate rises." | N21 | **FIX** | Non sequitur. The sentence before explains why people hold money at LOW rates. NCERT (p.46): at high rates "everyone expects it to fall ... convert their money into bonds. Thus speculative demand for money is low"; at low rates more expect a rise and "convert their bonds into money". The ledger row N21 itself fuses the two ("so"). | Replace s4-s5: "When the rate is very high, people expect it to fall, so they buy bonds and hold little money. When the rate is low, more people expect it to rise, so they sell bonds and hold money. So speculative demand for money falls as the interest rate rises." |
| b08 cap | bond price falls as the interest rate rises · NCERT's bond: ₹109.29 at 5%, ₹107.33 at 6% | N21 | PASS | Quotes NCERT's printed figures; exact 109.297 is within NCERT's "approx.". | |
| b09 s1-s3 | A limit: rate already so low everyone expects it to rise; people hold money; hand them more and it just sits | N22 | PASS | leec103 p.46-47: "if the market rate of interest is already low enough so that everybody expects it to rise ... additional money ... used up to satiate people's craving for money balances". | |
| b09 s4-s5 | The rate does not fall any further; NCERT calls this a liquidity trap | N22 | PASS | leec103 p.47: "without further lowering the rate of interest below the floor rmin. Such a situation is called a liquidity trap." | |
| b09 cap | liquidity trap ... · NCERT Box 3.1 | N22 | PASS | | |
| b10 s1-s2 | "an older way to see the same idea. Ask how often one rupee is used" | N20 | PASS | Framing. Velocity (Fisher 1911) predates liquidity preference (1936). | |
| b10 s3-s5 | Hundred-rupee note: fruit seller, milkman, bus conductor ("a picture, our own") | none | PASS | Labelled ours in speech and by the OUR PICTURE tag; states no fact. Hundred-rupee note passing three hands is an illustration of "changes hands". | |
| b10 s6 | Velocity of circulation = number of times a unit of money changes hands in a period | N20 | PASS | leec103 p.44: "The number of times a unit of money changes hands during the unit period is called the velocity of circulation". | |
| b10 s7 | NCERT writes demand for money for payments as k times the value of transactions; velocity is 1/k | N20 | PASS | leec103 p.44: MdT = k.T (3.1); "v = 1/k is the velocity of circulation". | |
| b10 cap | NCERT: MdT = k·T · v = 1/k · picture: our own | N20 | PASS | | |
| b11 s1 | "In 1911, Irving Fisher tied these together. Money times its velocity equals the price level times the number of transactions. That is his equation of exchange." | T10, T11 | **FIX** | Fisher's 1911 equation is MV + M'V' = PT (money and bank deposits, each with its own velocity): fisher text lines 125-128 and 3482 ("MV + M'V' = PT"); his Preface lists five factors. The simple M·V = P·T is IGNOU 18.4's form (ledger T10 notes this) and Fisher himself uses it only as a simplification "overlooking checks". The sentence puts the simple form in Fisher's 1911 mouth. | "In 1911, Irving Fisher linked the money in circulation, bank deposits, the speed of each, and the volume of trade in an equation of exchange. IGNOU's notes give the simple form: money times velocity equals the price level times the number of transactions." |
| b11 s2 | IGNOU's notes: if trade is fixed and velocity steady, price level follows quantity of money | T11 | PASS | ign_b8 18.4: T fixed (full employment), V "a long term constant"; "direct relationship between money supply and price level". | |
| b11 s3 | Double the money, and prices double | A13 | PASS | ign_b8 18.4: "If M doubles, P will also double." P = MV/T redone. | |
| b11 s4 | That is the classical quantity theory | T11 | PASS | ign_b8 18.4 heading. | |
| b11 s5 | "It holds only under those two assumptions." | T11, A13 | **FIX** | ign_b8: "With any one or more of these assumptions not valid [the] proportionality is unlikely to hold". "Only under" is stronger than "unlikely to hold otherwise". | "If either assumption fails, the price level is unlikely to move in step with the money." |
| b11 cap | Fisher (1911): M·V = P·T · classical quantity theory: T fixed, V steady → P follows M | T10, T11 | **FIX** | Same as s1. | "Fisher (1911): equation of exchange · simple form (IGNOU): M·V = P·T". |
| b12 s1-s2 | Cambridge economists Marshall, Pigou, Robertson, Keynes asked what share of income people keep as money | T12 | PASS | ign_u5 5.4.2: "credit ... goes to Alfred Marshall, A.C. Pigou, D.H. Robertson and J.M. Keynes ... Cambridge"; "only a portion (denoted by k) of the income is held". | |
| b12 s3 | They called that share k. It is the reciprocal of velocity. | T12, N20 | PASS | Holds: leec103 p.44 v = 1/k; pigou: liquidity preference "the inverse of the income velocity". Note IGNOU's own words are "reciprocal of the k in the quantity theory"; the velocity link rests on NCERT/Pigou, not IGNOU. | |
| b12 s4 + cap | "Pigou later noted that this share falls when the interest rate rises" | T13 | **FIX** | pigou (1950, p.18 of text): proportion of real income held as money "a decreasing function of the rate of interest" is "a reasonable approximation"; he calls it the Marshallian liquidity preference function. Hedge dropped and date missing. | "In 1950 Pigou wrote that it is a reasonable approximation to say this share falls when the interest rate rises." Caption: "Pigou (1950): the share falls as the interest rate rises". |
| b12 s5 | That is the demand for money we met earlier | N05 | PASS | | |
| b12 picture | Dial "k = 1/4 of income" | none | PASS | Illustrative picture only; not narrated. Keep it off the caption or tag "example". | |
| b13 s1 | Later, Milton Friedman restated it as a theory of the demand for money | T15 | PASS | ign_b8 18.6: "a restatement of the Quantity Theory ... primarily a theory of the demand for money". Single-source (IGNOU; 1956 essay not opened) and caption says "per IGNOU". | |
| b13 s2 | "IGNOU's notes say that for him, money is one asset among others. Bonds, shares and physical goods are the others." | T15 | **FIX** | ign_b8 18.6 lists five forms: money, bonds, equities, physical goods, human wealth. Dropping human wealth makes "the others" look complete. | "Bonds, shares, physical goods and human wealth are the others." |
| b13 s3 | He dropped Keynes's separate motives | T15 | PASS | ign_b8 18.6: "neglects completely Keynes' classification of the motives". | |
| b13 s4 | Monetarists, who follow him, hold velocity is fairly steady | T15 | PASS | ign_b8 18.7: "monetarist approach, led by Friedman ... velocity of money v is relatively stable". | |
| b13 cap | Friedman: ... · per IGNOU | T15 | PASS | | |
| b14 s1-s2 | Now the supply side; what you can touch | none | PASS | Framing. | |
| b14 s3-s4 | "Only the Reserve Bank may issue banknotes in India. That is section twenty-two of the RBI Act." | R11 | PASS | rbi_faq A.6: "In terms of Section 22 of the Act, Reserve Bank has the sole right to issue banknotes in India." Act text not saved (blocked); the RBI FAQ is the evidence. Word "banknotes" is right: the FAQ (A.2) says ₹1 notes are issued by the Government of India, so "notes" in b21 is a simplification. | |
| b14 s5 | "Coins come from the Government of India, under the Coinage Act of 2011" | N23, R11 | PASS | rbi_faq A.2: "coins issued by Government of India under Section 6 of The Coinage Act, 2011"; A.6: GoI designs and mints them; leec103 p.47. (RBI only distributes.) | |
| b14 cap | banknotes: RBI alone (RBI Act s.22) · coins: Government of India (Coinage Act 2011) | R11 | PASS | | |
| b15 s1-s2 | Why do we accept paper? It has no value of its own | N24 | PASS | leec103 p.47-48: paper's value "negligible"; notes and coins "do not have intrinsic value". | |
| b15 s3-s4 | Its value comes from the issuer's guarantee; NCERT calls this fiat money | N24 | PASS | leec103 p.47-48: "value ... is derived from the guarantee provided by the issuing authority ... therefore called fiat money". | |
| b15 s5-s6 | Each note says "I promise to pay the bearer"; those words record the RBI's own obligation to the holder | R12 | PASS | rbi_faq B.1: clause "denotes the obligation on the part of the Bank towards the holder", Bank liable under s.26. (NCERT instead says the promise is "from the Governor of RBI"; do not say NCERT says "obligation".) | |
| b15 cap | fiat money ... · RBI Act s.26 | N24, R12 | PASS | | |
| b16 s1 | "Section twenty-six goes further." | R11 | PASS | rbi_faq A.2, B.2: s.26. | |
| b16 s2 + cap | "Every banknote is legal tender anywhere in India, guaranteed by the Central Government" | R11 | **FIX** | rbi_faq A.2: "Every banknote ... unless withdrawn from circulation, shall be legal tender at any place in India in payment or on account for the amount expressed therein, and shall be guaranteed by the Central Government, subject to ... sub-section (2) of Section 26". The ₹500/₹1000 notes of 8 Nov 2016 ceased to be legal tender (same FAQ; NCERT Box 3.2). As worded it is false for withdrawn notes. | "Every banknote still in circulation is legal tender anywhere in India, guaranteed by the Central Government." Caption: "every banknote in circulation, anywhere in India (RBI Act s.26)". |
| b16 s3 | Legal tender means it cannot be refused when offered in payment | N24, N30 | PASS | leec103 p.48: "cannot be refused by any citizen ... for settlement of any kind of transaction"; jess203 p.40: "No individual in India can legally refuse a payment made in rupees". RBI's own definition is "legally tenderable for discharge of debt". Coins have limits (see b21). | |
| b16 s4-s5 | Remember that line; it will matter in a minute | none | PASS | Plant. | |
| b17 s1 | But notes are not the whole story | none | PASS | | |
| b17 s2 | "A bank deposit is money too." | N31 | **FIX** | jess203 p.41 and leec103 p.47 call only demand deposits money in this sense (withdrawable on demand, payable by cheque). Fixed (time) deposits are counted in M3 but are not payable by cheque; the next sentences only justify demand deposits, so the blanket line overstates. | "Money in a bank account that you can take out on demand is money too." |
| b17 s3 | NCERT's Class 10 book says modern money is currency plus deposits | N30 | PASS | jess203 p.40-41: "The modern forms of money — currency and deposits". | |
| b17 s4-s6 | Savings or current account money can be taken out on demand; payable by cheque, "a written order to the bank"; so called demand deposits | N31, N23 | PASS | jess203 p.40-41 ("withdrawn on demand ... demand deposits"; cheque is "a paper instructing the bank"); leec103 p.47 names savings or current accounts. | |
| b17 s7-s8 | "A cheque can be refused. So a deposit is money, but it is not legal tender." | N24 | PASS | leec103 p.48: "Cheques drawn on savings or current accounts, however, can be refused by anyone as a mode of payment. Hence, demand deposits are not legal tenders." (Use "demand deposit" in the line if edited per above.) | |
| b17 cap | modern money = currency + deposits · demand deposits: withdraw any time, pay by cheque · not legal tender | N30, N31, N24 | PASS | | |
| b18 s1-s2 | "The Reserve Bank adds money up in steps. M1 is cash with the public plus demand deposits." | N25, R08 | **FIX** | The definitions are NCERT's (leec103 p.48). RBI's own M1 is currency with the public + demand deposits + 'other' deposits with the RBI (hbk), and RBI's own M3 table (wss Table 6) is the only measure in the 2026 supplement saved here, so "the Reserve Bank adds money up" in four steps today is not shown. Attribute to NCERT. | "NCERT lists four measures of money that the Reserve Bank has published. M1 is cash with the public plus demand deposits." |
| b18 s3 | "M3 adds the time deposits, which are fixed deposits locked for a term" | N25, N23 | **FIX** | leec103 p.47: "fixed deposits, have a fixed period to maturity and are referred to as time deposits" ("e.g."). "Locked" is wrong (fixed deposits can be broken early; NCERT does not say locked) and time deposits are not only fixed deposits. | "M3 adds the time deposits, such as fixed deposits, which have a fixed period to maturity." |
| b18 s4 | M2 and M4 add post office deposits | N25, R08 | PASS | leec103 p.48; hbk: M2 = M1 + savings deposits of post office savings banks, M4 = M3 + all deposits with post office savings banks. | |
| b18 s5 | M1 and M2 are narrow money, M3 and M4 broad | N25 | PASS | leec103 p.48. | |
| b18 s6 | "M3 is the one most used." | N25 | **FIX** | Only NCERT says it ("the most commonly used measure of money supply", p.48); no RBI statement saved. Unattributed in speech. | "NCERT calls M3 the most commonly used measure." |
| b18 picture | Ladder of four steps M1, M2, M3, M4 | none | **FIX** | Not a ladder: M2 and M3 each add to M1 separately (M2 = M1 + post office savings; M3 = M1 + time deposits); M4 = M3 + post office. NCERT orders them only by liquidity. | Draw M1 as base with two branches (M2, M3) and M4 above M3. |
| b18 cap | M1 = cash + demand deposits · M3 = M1 + time deposits · M2, M4 add post-office deposits · M3 most used (NCERT) | N25 | PASS | Attributed to NCERT. | |
| b18 current status | Whether the Reserve Bank still publishes M2/M4 in 2026 | R08 | **UNREAD** | wss (21 Aug 2026) shows only M3; hbk is dated 15 Sep 2014. No saved 2026 source states which of M1-M4 RBI publishes today. Avoid the present tense for M2/M4. | |
| b19 s1 | "On the thirty-first of July 2026, broad money split as follows." | A12 | **FIX** | The three shares listed add to 99.5%; the 0.38% "other deposits with the Reserve Bank" is omitted without saying so, and "the money you can spend at once" is NCERT's M1 (RBI's M1 would add the 0.38%). Also "broad money" should read M3. | "On the thirty-first of July 2026, M3, a broad measure of money, split like this." |
| b19 s2 | About 13% was cash with the public | A08, A12 | PASS | 12.97%. | |
| b19 s3 | "About eleven percent was in savings and current accounts" | A12, N23 | **FIX** | 11.11% is RBI's "demand deposits with banks", which NCERT illustrates with savings and current accounts (p.47). | "About eleven percent was in demand deposits, such as savings and current accounts." |
| b19 s4 | "About seventy-five and a half percent was in fixed deposits" | A12 | **FIX** | 75.55% is RBI's "time deposits with banks"; fixed deposits are an example (leec103 p.47), not the whole. | "About seventy-five and a half percent was in time deposits, such as fixed deposits. The last sliver, under half a percent, was other deposits with the Reserve Bank." |
| b19 s5 | "So the money you can spend at once is only about a quarter of it." | A12 | PASS | Cash + demand deposits = 7,771,427 / 32,281,302 = 24.07% (24.1%). "Spend at once" is our gloss; fine. | |
| b19 cap | M3, 31 Jul 2026 · cash ≈ 13% · demand deposits ≈ 11% · time deposits ≈ 75.5% · cash + demand ≈ ¼ · RBI | A12, A08, I02 | **FIX** | Shares add to 99.5%. | Add "other RBI deposits ≈ 0.4%". |
| b20 s1 | Cash is small, but it matters | N07 | PASS | Editorial; supported by next sentences. | |
| b20 s2 | "Currency issued by the central bank is called high-powered money." | N07, R08 | **FIX** | The definition is NCERT's (leec103 p.38). RBI's own Reserve Money (M0) is currency in circulation + bankers' deposits with RBI + 'other' deposits with RBI (hbk), wider than currency alone. | "NCERT calls the currency issued by the central bank high-powered money." Caption: "high-powered money (NCERT): currency issued by the central bank". |
| b20 s3 | NCERT says it is the base for credit creation | N07 | PASS | leec103 p.38: "as it acts as a basis for credit creation". | |
| b20 s4 | "India's central bank, the Reserve Bank, was set up in 1935" | N07 | PASS | leec103 p.38 "India got its central bank in 1935"; RBI About Us: "established on April 1, 1935". | |
| b20 s5 | Public holds about fifteen paise of cash for every rupee in deposits | A09 | PASS | 41,85,446 / (35,85,981 + 2,43,87,268) = 0.1496. Deposits here exclude 'other' RBI deposits (stated in A09). | |
| b20 s6 | "Cash is the base. Deposits are the money built on top." | N07 | **FIX** | NCERT's base is currency "held by the public or by the commercial banks", not the public's cash alone, and 'built on top' (credit creation, section 3.3) is not narrated or cited here. Read with the 15-paise sentence it suggests the public's 13% supports the 87%. | "Currency from the Reserve Bank, whether held by the public or by banks, is the base. Deposits are built on that base." |
| b20 s7 | How is that possible? | none | PASS | Hook for Part 2. | |
| b20 cap | ... RBI: 1935 · cash ≈ 15 paise per ₹1 of deposits (31 Jul 2026) | N07, A09 | **FIX** | Caption defines high-powered money as currency issued by the central bank with no NCERT label (see b20 s2); 1935 and 15 paise are fine. | "high-powered money (NCERT): currency issued by the central bank · RBI: 1935 · cash ≈ 15 paise per ₹1 of deposits (31 Jul 2026)" |
| b21 s1 | Money does three jobs | N02 | PASS | | |
| b21 s2 | Demand for money rises with income and falls as the interest rate rises | N05 | PASS | | |
| b21 s3 | Keynes gave three motives | T14 | PASS | | |
| b21 s4 | Money supply is currency plus deposits | N23 | PASS | leec103 p.38: "money comprises cash and bank deposits". | |
| b21 s5 | Notes come from the Reserve Bank and coins from the Government | N23 | PASS | Class XII p.47. Caveat: ₹1 notes are issued by the Government (rbi_faq A.2); say "banknotes" if kept. | |
| b21 s6 | "Both are legal tender." | N24, R11 | **FIX** | rbi_faq A.2: coins of ₹1 or more are legal tender only up to ₹1,000 in one transaction; 50 paise only up to ₹10. NCERT's "cannot be refused" is unlimited. | "Both are legal tender, coins up to set limits." |
| b21 s7 | A cheque is not | N24 | PASS | | |
| b21 s8 + cap | "M3 is the most used measure, and in July 2026 about thirteen percent of it was cash" / "M3 most used" | N25, A08 | **FIX** | Only NCERT says "most commonly used"; cash means cash with the public. | "NCERT calls M3 the most commonly used measure, and in July 2026 about thirteen percent of it was cash with the public." Caption: "M3 most used (NCERT)". |
| b22 s1-s2 | "remember what moved. Not a note. A deposit." | none | **FIX** | CLAIMS list is "none". gees111 p.243 (N55): UPI etc. "transfer money from one person's bank account into another". Safe wording uses that; UPI can also be funded in other ways not read in a saved source (npci_upi.txt is 226 bytes, unreadable). | Add claim N55. "Not a note. A balance moving from one bank account to another." |
| b22 s3 | In part two: when a bank gives a loan, where does the money come from? | none | PASS | Question, a teaser; NOTE confirms N11 not narrated. | |
| b22 cap | Part 2: where does a bank's loan money come from? · what limits it? | none | PASS | | |

## Ledger notes (not script errors; fix the ledger)

- **A13** source column cites NCERT Appendix 3.1 (geometric series) for P = MV/T. Wrong place. The correct source is IGNOU ign_b8 18.4 (T11), which prints P = (V/T)M and "If M doubles, P will also double".
- **N21** claim text joins "people expecting rates to rise sell bonds and hold money" with "so speculative demand falls as the interest rate rises". NCERT's reasoning goes through what people expect at high versus low rates (p.46). Rewrite the claim so the script cannot copy the muddle.
- **T12** says "reciprocal of velocity"; IGNOU 5.4.2 says "reciprocal of the k in the quantity theory". Velocity link is supported by NCERT (v = 1/k) and Pigou 1950.
- **T10** is correctly noted as not the simple form; the script missed that note (b11).
- **R11/R12**: Act text not saved; RBI FAQ used as evidence. Fine for the sentences as written, but do not put "the Act says" in narration.

## Summary

**Totals: 118 rows. PASS 86 · FIX 30 · FAIL 1 · UNREAD 1.**

Every FIX / FAIL / UNREAD row (corrected wording is in the table above):

- b00 s2 [FAIL] "all the money in India, by the widest measure the Reserve B
- b02 s2 [FIX] "Barter works only if the wheat farmer wants shoes at that v
- b02 s6 [FIX] "So people picked something that everyone accepts, and trade
- b04 s5 [FIX] "nobody needs to test every pair of goods"
- b05 s1 [FIX] "The third job is the hardest."
- b05 s5 [FIX] "NCERT says money stores value only if its own value stays f
- b05 s6 + cap [FIX] "Gold, land and bonds store value too, but they are harder t
- b07 s4 [FIX] "Speculative motive: money kept back while you wait for a be
- b07 cap + picture [FIX] Keynes (1936): 3 motives ... → liquidity preference
- b08 s5 [FIX] "That is why speculative demand for money falls as the inter
- b11 s1 [FIX] "In 1911, Irving Fisher tied these together. Money times its
- b11 s5 [FIX] "It holds only under those two assumptions."
- b11 cap [FIX] Fisher (1911): M·V = P·T · classical quantity theory: T fixe
- b12 s4 + cap [FIX] "Pigou later noted that this share falls when the interest r
- b13 s2 [FIX] "IGNOU's notes say that for him, money is one asset among ot
- b16 s2 + cap [FIX] "Every banknote is legal tender anywhere in India, guarantee
- b17 s2 [FIX] "A bank deposit is money too."
- b18 s1-s2 [FIX] "The Reserve Bank adds money up in steps. M1 is cash with th
- b18 s3 [FIX] "M3 adds the time deposits, which are fixed deposits locked 
- b18 s6 [FIX] "M3 is the one most used."
- b18 picture [FIX] Ladder of four steps M1, M2, M3, M4
- b18 current status [UNREAD] Whether the Reserve Bank still publishes M2/M4 in 2026
- b19 s1 [FIX] "On the thirty-first of July 2026, broad money split as foll
- b19 s3 [FIX] "About eleven percent was in savings and current accounts"
- b19 s4 [FIX] "About seventy-five and a half percent was in fixed deposits
- b19 cap [FIX] M3, 31 Jul 2026 · cash ≈ 13% · demand deposits ≈ 11% · time 
- b20 s2 [FIX] "Currency issued by the central bank is called high-powered 
- b20 s6 [FIX] "Cash is the base. Deposits are the money built on top."
- b20 cap [FIX] ... RBI: 1935 · cash ≈ 15 paise per ₹1 of deposits (31 Jul 2
- b21 s6 [FIX] "Both are legal tender."
- b21 s8 + cap [FIX] "M3 is the most used measure, and in July 2026 about thirtee
- b22 s1-s2 [FIX] "remember what moved. Not a note. A deposit."

Most serious: (1) b00 'widest measure the Reserve Bank uses' is FAIL, because M4 (and RBI's L1-L3) are wider than M3; (2) b11 puts the simplified M·V = P·T in Fisher's 1911 mouth, but his own equation is MV + M'V' = PT; (3) b08's 'That is why speculative demand falls as the interest rate rises' does not follow from the sentence before it. Next: b16 'every banknote is legal tender' ignores withdrawn notes, and b21 'both are legal tender' ignores the coin limits (₹1,000 / ₹10).
