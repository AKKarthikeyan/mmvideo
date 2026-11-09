# ECO-16-P2: Where Does a Bank's Loan Money Come From?

Rendered from `script_p2.py` by `scripts/upsc/script_tool.py`. Edit the .py, not this file.

**Promise:** When a bank gives you a loan, where does the money come from, and what stops it from lending more?  
**Arc:** misconception-first · **Tier:** broad · **Turn:** b05

**Loops:**

- L1 (primary): Where does a bank's loan money come from, and what stops it lending more? — opens b00, closes b19
- L2 (secondary): Where did the extra eighty rupees come from? — opens b00, closes b05
- L3 (tertiary): Does the textbook multiplier match how banks work? — opens b13, closes b15
- M1 (micro): Can a goldsmith lend gold he holds for others? — opens b02, closes b03
- M2 (micro): How big can the multiplier get? — opens b07, closes b09
- M3 (micro): What were the reserve ratios on 3 Nov 2026? — opens b10, closes b10
- M4 (micro): What protects a depositor, and how does a bank earn? — opens b17, closes b18

**Plants:** b00 → b05, b03 → b17

**Critical evidence:**

- A loan opens a new deposit; the worked 20% example to deposits of ₹500: NCERT Class 12 Introductory Macroeconomics ch.3, 3.3 and 3.3.2 (ECO16-N11, N15, N16)
- The CRR and SLR on 3 Nov 2026: RBI Current Rates panel, 3 Nov 2026; CRR and SLR rules (ECO16-R03, R05, R06, R07)
- Central-bank papers on how banks create money (Bank of England staff article, 2014; Bundesbank Monthly Report, 2017): Bank of England Quarterly Bulletin 2014 Q1; Bundesbank Monthly Report April 2017 (ECO16-T01-T06)

**Fallback question:** If the central-bank papers failed review: what does the textbook multiplier assume, and where does NCERT say it is only an example?

---


## Chapter 1

### b00 · rung question
**PICTURE:** A hand slips a hundred-rupee note across a bank counter. Two account bars appear: yours, still at 100, and a new one for the borrower, 80, growing out of nothing; a big question mark between them.  
**VOICE:** A bank takes a hundred rupees from you. NCERT's example says it keeps twenty and lends eighty to someone else. You can still spend your hundred. The borrower can spend eighty. So there is now one hundred and eighty rupees to spend, where there was one hundred. Where did the extra eighty come from?  
**SCREEN:** NCERT's example: ₹100 deposited · ₹20 kept · ₹80 lent · deposits now ₹180  
**CLAIMS:** ECO16-N15 (CONFIRMED), ECO16-N11 (CONFIRMED)

### b01 · *THEREFORE* · rung stakes
**PICTURE:** A notebook page with four numbered boxes; a small three-part path beneath: PART 1 (dim, done), PART 2 (lit), PART 3.  
**VOICE:** Last time we saw that, by M3, the broad measure, most of India's money is not cash. It is deposits. So who makes the deposits? And what stops them from growing without end? We take it in four steps. A story NCERT tells. A bank's books. The limit, and the arithmetic of the limit. Then an honest question: does the textbook picture match how banks work? This is part two of three.  
**SCREEN:** 1 a story · 2 a bank's books · 3 the limit and its arithmetic · 4 does the textbook hold? · Part 2 of 3  
**CLAIMS:** ECO16-A08 (CONFIRMED)


## Chapter 2

### b02 · *THEREFORE* · rung 1 · new term: money out of thin air
**PICTURE:** A village goldsmith's shop, atlas painted: villagers hand over small gold bars and get paper receipts; the receipts pass from hand to hand at a market stall; a small tag: A MADE-UP STORY. Lala lends a bar to Ramu, who pays Ali; Ali leaves it with Lala, and a new receipt appears.  
**VOICE:** NCERT tells the story of a goldsmith called Lala. Villagers leave their gold with him for safekeeping. He gives each a receipt. Slowly, the receipts themselves are used as money, because everyone in the village accepts them. Then a man called Ramu asks Lala for a loan of twenty-five kilograms. Lala decides that not everyone will come for their gold at the same time. So he lends Ramu twenty-five kilograms of the hundred he holds. Ramu pays Ali with that gold, and Ali leaves it with Lala for a receipt. Now the receipts in use add up to one hundred and twenty-five kilograms. It seems that Lala has created money out of thin air, says NCERT. It is a made-up story, not history. But NCERT says modern banks work the same way.  
**SCREEN:** NCERT's story of Lala: gold held 100 kg · Ramu borrows 25 kg · Ali re-deposits it · receipts worth 125 kg · a made-up story  
**CLAIMS:** ECO16-N09 (CONFIRMED)
  
**NOTE:** First small win, under 1:30: how can lending add money? (STORYTELLING 3.7). The 'made-up story, not history' line is our plain statement that it is an illustration; NCERT introduces it as a story.

### b03 · *BUT* · rung 3
**PICTURE:** A long queue at the goldsmith's door with worried faces; Lala wipes his brow behind the counter; a calm village stays home in the next frame: two panels, QUEUE / CALM.  
**VOICE:** But Lala has a problem. If everyone came for their gold on the same day, he could not pay. NCERT says a bank can lend because it does not expect all depositors to withdraw together. But it must keep enough funds to repay any depositor on demand. Depositors stay only if they are fully confident of getting their money back.  
**SCREEN:** lend, because not all depositors withdraw together · but keep enough to repay any depositor on demand · confidence (NCERT)  
**CLAIMS:** ECO16-N10 (CONFIRMED)


## Chapter 3

### b04 · *THEREFORE* · rung 2 · new term: balance sheet
**PICTURE:** A two-sided ledger on a desk: ASSETS (reserves, loans) at the left, LIABILITIES (deposits) at the right; a hundred-rupee block sits in RESERVES and the same block in DEPOSITS; the loans slot is empty.  
**VOICE:** To see the limit, read a bank's books. NCERT's balance sheet has two sides. Assets are what the bank holds: its reserves and its loans. Liabilities are what it owes: its deposits. Reserves are cash plus the bank's deposits with the Reserve Bank. Start with a bank that holds a hundred rupees of deposits and keeps all hundred as reserves. It has lent nothing yet.  
**SCREEN:** balance sheet · assets = reserves + loans · liabilities = deposits · reserves = cash + deposits with RBI (NCERT 3.3) · start: ₹100 deposits, ₹100 reserves (Table 3.1)  
**CLAIMS:** ECO16-N12 (CONFIRMED), ECO16-N13 (CONFIRMED)

### b05 · *THEREFORE* · rung 3
**PICTURE:** The ledger again: a new block of 80 appears on the DEPOSITS side under the borrower's name; the loan slot fills; the original 100 stays; a counter above shows 100 → 180.  
**VOICE:** Now the bank makes a loan. NCERT's answer is plain: it opens a new deposit in the borrower's name. So the money supply rises by that new deposit. In NCERT's example, the borrower's eighty rupees is such a deposit. And your hundred is still there. That is where the extra eighty came from.  
**SCREEN:** a loan opens a new deposit in the borrower's name → the money supply rises by that deposit (NCERT 3.3)  
**CLAIMS:** ECO16-N11 (CONFIRMED), ECO16-N15 (CONFIRMED)
  
**NOTE:** The payoff of b00's question (the plant): where the extra eighty came from. Not yet the limit.


## Chapter 4

### b06 · *BUT* · rung 2 · new term: cash reserve ratio
**PICTURE:** A bank vault door with a dial labelled CRR; behind the glass, a fixed fraction of the deposit bar is shaded: RESERVE. A hand-stop sign: STOP OVER-LENDING.  
**VOICE:** So what stops a bank from lending without end? The first answer is a rule. NCERT says the Reserve Bank decides what share of deposits every bank must keep as reserves. This is the cash reserve ratio, the CRR. In the rules, that share is counted on a bank's net demand and time liabilities. It is kept as a balance with the Reserve Bank. NCERT says it is a legal requirement, meant to stop over-lending.  
**SCREEN:** CRR = share of deposits (in law: net demand and time liabilities) kept as a balance with RBI · a legal requirement · RBI  
**CLAIMS:** ECO16-N14 (CONFIRMED), ECO16-R02 (CONFIRMED)

### b07 · *THEREFORE* · rung 3
**PICTURE:** A staircase of coin stacks: the first deposit 100, then loans 80, 64 ...; a running total of deposits on the side climbs toward 500 and settles there; a pie shows the final split: reserves 100, loans 400.  
**VOICE:** NCERT's example uses a reserve ratio of twenty percent. A hundred rupees is deposited. The bank keeps twenty and lends eighty. NCERT's example has only one bank, so the eighty comes back as a new deposit of eighty. The bank keeps sixteen and lends sixty-four. Round after round, the loans shrink by a fifth. Added up, deposits come to five hundred rupees, with reserves of one hundred and loans of four hundred.  
**SCREEN:** 20% reserve ratio · ₹100 → lend ₹80 → ₹80 deposited → lend ₹64 → … → deposits ₹500 · reserves ₹100 · loans ₹400 (NCERT 3.3.2)  
**CLAIMS:** ECO16-N15 (CONFIRMED), ECO16-A04 (CORRECTED)

### b08 · *THEREFORE* · rung 3 · new term: money multiplier
**PICTURE:** A gear train: a small gear (RESERVES 100) drives a big gear (DEPOSITS 500); a label reads MULTIPLIER 5; the formula card 1 ÷ r slides in beneath.  
**VOICE:** Reserves of one hundred rupees created deposits of five hundred. NCERT calls the ratio the money multiplier. Here it is five. It is one divided by the reserve ratio. One divided by point two is five.  
**SCREEN:** money multiplier = 1 ÷ reserve ratio · 1 ÷ 0.2 = 5 (NCERT)  
**CLAIMS:** ECO16-N16 (CONFIRMED), ECO16-A04 (CORRECTED)

### b09 · *BUT* · rung 4 · new term: currency-deposit ratio
**PICTURE:** The gear train again with a leak: a few coins roll off the big gear into a wallet beside it; the multiplier readout drops from 33 to 6.4 while a stamp lands: TOY CEILING.  
**VOICE:** But people also keep some cash in their pockets. That cash leaks out of the process. The currency-deposit ratio is the cash people hold for each rupee of bank deposits. IGNOU counts demand deposits only. Here we count demand and time deposits together, as M3 does. IGNOU shows the multiplier is that ratio plus one, divided by that ratio plus the reserve ratio. At the CRR of three percent on the third of November 2026, the plain formula gives thirty-three. In July 2026 the public held about fifteen paise of cash for every rupee of deposits. IGNOU's full formula then gives about six point four. Both are toy ceilings, not forecasts.  
**SCREEN:** IGNOU: m = (cdr + 1) ÷ (cdr + rr) · CRR 3% (3 Nov 2026): 1 ÷ 0.03 ≈ 33 · cdr ≈ 0.15 (31 Jul 2026; cash ÷ demand + time deposits, our count; IGNOU's D is demand deposits): ≈ 6.4 · toy ceilings, not forecasts  
**CLAIMS:** ECO16-T07 (CONFIRMED), ECO16-A14 (CONFIRMED), ECO16-A09 (CONFIRMED), ECO16-A06 (CONFIRMED)
  
**NOTE:** Rung 4: leakage. Ceilings in a toy model; the next beats say what actually limits lending.


## Chapter 5

### b10 · *BUT* · rung 4 · new term: statutory liquidity ratio
**PICTURE:** A dial labelled CRR turns from 4.5 to 4.0 (Dec 2024), pauses, then 3.75, 3.5, 3.25, 3.0 (Sep to Nov 2025) along a dated timeline; beside it a second vault door: SLR 18, holding cash, gold bars and government-bond folders.  
**VOICE:** NCERT's Class 10 book says banks hold about five percent of deposits as cash. The legal minimum has since changed. On the third of November 2026, the CRR was three percent. It was four and a half percent until mid-December 2024, and four percent from the end of that month. Then, in four cuts of a quarter point in 2025, the Reserve Bank took it to three percent. The cuts ran from September to November. Banks must also hold liquid assets, such as cash, gold and government securities. The minimum is eighteen percent of their net demand and time liabilities. That is the statutory liquidity ratio, the SLR.  
**SCREEN:** CRR 3.00% (3 Nov 2026) · 4.5% to Dec 2024 → 4.0% by 28 Dec 2024 → 3.0% by 29 Nov 2025 · SLR: at least 18% in liquid assets · RBI  
**CLAIMS:** ECO16-N32 (CONFIRMED), ECO16-R03 (CONFIRMED), ECO16-R04 (CONFIRMED), ECO16-R05 (CONFIRMED), ECO16-R06 (CONFIRMED), ECO16-R07 (CONFIRMED)
  
**NOTE:** Dated NCERT figure (N32) corrected by the RBI panel (R05). Living figures: CRR and SLR on 3 Nov 2026.

### b11 · *THEREFORE* · rung 3
**PICTURE:** A control panel with five dials in two groups, QUANTITATIVE and QUALITATIVE; the CRR dial turns up and a small money bar beside it shrinks.  
**VOICE:** The reserve ratio is one lever. NCERT says that when the Reserve Bank raises it, banks cut their lending, so the money supply falls. NCERT sorts the Reserve Bank's tools in two groups. Quantitative tools change the CRR, the bank rate, or buy and sell bonds. Qualitative tools include moral suasion and the margin requirement.  
**SCREEN:** RBI's tools · quantitative: CRR, bank rate, open market operations · qualitative: e.g. moral suasion, margin requirement (NCERT 3.4)  
**CLAIMS:** ECO16-N18 (CONFIRMED)

### b12 · *THEREFORE* · rung 3 · new term: open market operation
**PICTURE:** A bond certificate passes from a dealer to the RBI building; a cheque flies back and lands in a bank's reserve bar, which rises; the reverse trade makes it fall; a lifebuoy tag: LENDER OF LAST RESORT.  
**VOICE:** Take one tool. In an open market operation, the Reserve Bank buys a government bond and pays by cheque. That adds to the banks' reserves and to the money supply. Selling a bond does the opposite. And NCERT calls the Reserve Bank the lender of last resort. It stands ready to lend to banks at all times.  
**SCREEN:** open market operation: RBI buys a bond → pays by cheque → reserves rise · sells → reserves fall · lender of last resort (NCERT 3.4)  
**CLAIMS:** ECO16-N19 (CONFIRMED), ECO16-N17 (CONFIRMED)


## Chapter 6

### b13 · *BUT* · rung 4
**PICTURE:** Two cards face to face: TEXTBOOK (reserves → loans → deposits) and STAFF RESEARCH (loans → deposits); a plaque: BANK OF ENGLAND STAFF, 2014 (UK); a tag: STAFF ARTICLE, 2014.  
**VOICE:** Now the honest question. Does a bank wait for reserves before it lends? Staff of the Bank of England wrote in 2014 about the modern economy. Most money, they said, is created by commercial banks making loans. Their article is about the UK. They said banks do not simply lend out the deposits savers leave with them. Nor do they multiply up central bank money. This was an article by Bank of England staff, in the Bank's Quarterly Bulletin.  
**SCREEN:** Bank of England staff (2014, UK): in the modern economy most money is created when banks make loans · banks do not simply lend out deposits, nor multiply up central bank money · staff article in the Bank's Quarterly Bulletin  
**CLAIMS:** ECO16-T01 (CONFIRMED), ECO16-T02 (CONFLICT), ECO16-T03 (CONFIRMED)
  
**NOTE:** CONFLICT row (T02): both sides are named. Both sides named. The saved Bank of England copy has no disclaimer of any kind: attribute to its staff authors, nothing more.

### b14 · *THEREFORE* · rung 4
**PICTURE:** A balance of three weights labelled PROFIT, RULES, DEMAND pressing on a loan counter; above them, a dial: INTEREST RATE. A plaque: BUNDESBANK, MONTHLY REPORT, APRIL 2017.  
**VOICE:** Germany's central bank, the Bundesbank, said something similar in its Monthly Report of April 2017, about the euro area. A bank's ability to lend has nothing to do with whether it already holds excess reserves or deposits. Then what limits it? Its answer: the need to lend profitably, and the rules that regulate banks. Also what households and firms want to borrow and hold. And in normal times, the central bank influences the process through its interest rate policy.  
**SCREEN:** Bundesbank (Monthly Report, Apr 2017, euro area): lending is not tied to excess reserves · limits: profit, regulation, demand for credit and portfolio choices · the central bank influences it through its interest rate policy  
**CLAIMS:** ECO16-T05 (CONFIRMED), ECO16-T06 (CONFIRMED), ECO16-T04 (CONFIRMED)

### b15 · *BUT* · rung 4 · new term: endogenous money
**PICTURE:** A map-free world scene: a wall of reserve-ratio dials, one set to ZERO (US, 2020); two toolboxes labelled EXOGENOUS and ENDOGENOUS with a bridge between; a notebook tag: NAME THE VIEW.  
**VOICE:** Reserve rules are not universal. The United States cut its reserve requirement ratios to zero in March 2020. Yet NCERT and IGNOU still teach the multiplier. IGNOU adds that in the real world the money supply is more likely a mix. It is partly controlled by the central bank, and partly shaped by firms, households and the banking sector. So when you write the exam answer, name the view you are describing.  
**SCREEN:** US reserve requirement ratios: zero since 26 Mar 2020 · IGNOU: exogenous (authority fixes) and endogenous (banks, firms, households influence) · the real world more likely a mix: partly the authority, partly firms and households  
**CLAIMS:** ECO16-R15 (CONFIRMED), ECO16-T08 (CONFIRMED), ECO16-N16 (CONFIRMED), ECO16-T07 (CONFIRMED)
  
**NOTE:** No side taken: the Gold Standard asks that debates name who holds which view.

### b16 · *THEREFORE* · rung 4
**PICTURE:** Two lines on a chart sketch with no axis numbers: MONEY falling, BASE rising, a widening gap; a small queue at a bank door in one corner, a vault full of unused cash in another. A tag: ILLUSTRATION.  
**VOICE:** The multiplier can also shrink. IGNOU recounts that in the United States, between March 1930 and March 1933, money fell about thirty-five percent. Over the same time, the monetary base rose about twenty percent. IGNOU gives two reasons. People pulled money out of banks, and banks held large excess reserves. IGNOU adds an argument. Friedman and Schwartz, among others, argued the fall was one of the major factors in the Depression.  
**SCREEN:** US, Mar 1930 – Mar 1933: money about −35%, monetary base about +20% · IGNOU's reasons: people pulling money out of banks, large excess reserves · Friedman and Schwartz, among others  
**CLAIMS:** ECO16-T09 (CONFIRMED)
  
**NOTE:** Single-source (IGNOU) row; the original Friedman and Schwartz book not opened (U05): attribute on screen.


## Chapter 7

### b17 · *THEREFORE* · rung 3
**PICTURE:** A passbook under a clear umbrella labelled DICGC; a coin stack marked 5 LAKH slides under it; the queue at the bank door from before stays in a second, separate panel: STATED AIM.  
**VOICE:** Which brings us back to confidence. One protection for a depositor is deposit insurance. Each depositor in a bank is insured up to five lakh rupees, for principal and interest together. The cover applies bank by bank, and the bank, not the depositor, pays the premium. The insurer says its aim is to secure public confidence in the banking system, particularly for the small depositor.  
**SCREEN:** deposit insurance: up to ₹5 lakh per depositor per bank (principal + interest) · the bank pays the premium · DICGC's stated aim: public confidence, particularly for the small depositor  
**CLAIMS:** ECO16-R13 (CONFIRMED)
  
**NOTE:** Names no failed bank (dossier A5). The insurer's stated aim is quoted from its leaflet; insurance pays after a failure and does not itself stop a run.

### b18 · *THEREFORE* · rung 3 · new term: spread
**PICTURE:** Two coin stacks of the same ₹200: one earns a ₹10 stack as it goes out, one costs a ₹4 stack as it comes in; the gap, ₹6, glows in the bank's till.  
**VOICE:** And how does a bank earn? It pays depositors less than it charges borrowers. The gap is called the spread. NCERT's Class 7 example: two hundred rupees lent at five percent brings ten rupees. Two hundred rupees deposited at two percent costs four. The bank earns six, before its own costs. On the third of November 2026, the Reserve Bank's rate panel showed savings deposits at two and a half percent.  
**SCREEN:** spread = interest charged − interest paid · NCERT Grade 7: ₹200 at 5% → ₹10; ₹200 at 2% → ₹4; bank earns ₹6, before its own costs · savings rate 2.5% (3 Nov 2026)  
**CLAIMS:** ECO16-N08 (CONFIRMED), ECO16-N47 (CONFIRMED), ECO16-A11 (CONFIRMED), ECO16-I05 (CONFIRMED)


## Chapter 8

### b19 · *THEREFORE* · rung 5
**PICTURE:** The notebook page fills line by line in handwriting; the terms turn gold as the narration reaches them; the last line carries the debate: name the view.  
**VOICE:** For the exam, write it this way. A bank's loan opens a new deposit, so lending creates money. The limit in the textbook model is the reserve ratio. With a reserve ratio of twenty percent, the multiplier is five. Cash held by the public leaks out of the process, and the multiplier is smaller. On the third of November 2026, the Reserve Bank's CRR was three percent and the SLR eighteen. Name the view. The Bundesbank says lending is limited by profit, regulation and demand for credit. Bank of England staff name profit, regulation, the behaviour of money holders, and monetary policy as the ultimate limit.  
**SCREEN:** Loan → new deposit · multiplier = 1 ÷ reserve ratio (toy) · cash leakage · CRR 3%, SLR 18% (3 Nov 2026) · name the view  
**CLAIMS:** ECO16-N11 (CONFIRMED), ECO16-N16 (CONFIRMED), ECO16-T07 (CONFIRMED), ECO16-R05 (CONFIRMED), ECO16-R07 (CONFIRMED), ECO16-T05 (CONFIRMED), ECO16-T01 (CONFIRMED), ECO16-T04 (CONFIRMED), ECO16-T06 (CONFIRMED)

### b20 · *THEREFORE* · rung handoff
**PICTURE:** The ledger closes; a map-free street scene opens beyond: a moneylender's table beside a bank counter, a phone tap at a cart. A frame: PART 3.  
**VOICE:** So, on NCERT's account, banks create money when they lend. Central-bank papers name limits such as profit and regulation. But money is not the whole story of credit. Who gets a loan, at what price, and who is left out? In part three: credit in daily life, formal and informal, and how the money moves.  
**SCREEN:** Part 3: credit in daily life · formal and informal · how money moves (UPI, cards)  
**CLAIMS:** ECO16-N11 (CONFIRMED), ECO16-T05 (CONFIRMED), ECO16-T01 (CONFIRMED), ECO16-T04 (CONFIRMED)

