"""ECO-16 Part 2, draft 1 (5 Nov 2026): how banks create money, and what limits it.
Part 2 of 3 of "How banks create money" (Part 1: what money is and who supplies it; Part 3: credit and payments).
Storytelling v2 (docs/STORYTELLING.md, mmvideo branch claude/keen-ride-f20uky) and the Gold Standard (docs/upsc/GOLD_STANDARD.md).
Same form as research/upsc/ECO-16/script_p1.py; check with scripts/upsc/script_tool.py. Numbers are words in `say` (years may be
digits), numerals in `cap`. `claims` are ids in this folder's claims.csv (audit of the research: AUDIT.md; the script itself is not
yet audited: gate S5)."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="ECO-16-P2",
    title="Where Does a Bank's Loan Money Come From?",
    beats=[
        T(1, "b00", "",
          """A bank takes a hundred rupees from you. NCERT's example says it keeps twenty and lends eighty to someone else.
          You can still spend your hundred. The borrower can spend eighty.
          So there is now one hundred and eighty rupees to spend, where there was one hundred.
          Where did the extra eighty come from?""",
          "NCERT's example: ₹100 deposited · ₹20 kept · ₹80 lent · deposits now ₹180",
          """A hand slips a hundred-rupee note across a bank counter. Two account bars appear: yours, still at 100, and a new one
          for the borrower, 80, growing out of nothing; a big question mark between them.""",
          ["ECO16-N15", "ECO16-N11"], "question"),
        T(1, "b01", "therefore",
          """Last time we saw that most of India's money is not cash. It is deposits.
          So who makes the deposits? And what stops them from growing without end?
          We take it in four steps. A story NCERT tells. A bank's books. The limit, and the arithmetic of the limit.
          Then an honest question: does the textbook picture match how banks work?
          This is part two of three.""",
          "1 a story · 2 a bank's books · 3 the limit and its arithmetic · 4 does the textbook hold? · Part 2 of 3",
          """A notebook page with four numbered boxes; a small three-part path beneath: PART 1 (dim, done), PART 2 (lit), PART 3.""",
          ["ECO16-A08"], "stakes"),
        T(2, "b02", "therefore",
          """NCERT tells the story of a goldsmith called Lala. Villagers leave their gold with him for safekeeping. He gives each a receipt.
          Soon the receipts themselves are used as money, because everyone trusts Lala's gold.
          Then Lala notices that nobody asks for the gold back all at once.
          So he lends out twenty-five kilograms of the hundred he holds.
          Now the receipts in use add up to the value of one hundred and twenty-five kilograms.
          Money out of thin air, says NCERT. It is a made-up story, not history. But NCERT says modern banks work the same way.""",
          "NCERT's story of Lala: gold held 100 kg · receipts used as money · 25 kg lent → receipts worth 125 kg · a made-up story",
          """A village goldsmith's shop, atlas painted: villagers hand over small gold bars and get paper receipts; the receipts pass
          from hand to hand at a market stall; a small tag: A MADE-UP STORY. Lala lends a bar to a farmer, and a new receipt appears.""",
          ["ECO16-N09"], "1", "money out of thin air",
          note="First small win, under 1:30: how can lending add money? (STORYTELLING 3.7). NCERT's own words: made-up story."),
        T(2, "b03", "but",
          """But Lala has a problem. If everyone came for their gold on the same day, he could not pay.
          NCERT says a bank can lend because it does not expect all depositors to withdraw together.
          But it must keep enough funds to repay any depositor on demand.
          Depositors stay only if they are fully confident of getting their money back.""",
          "lend, because not all depositors withdraw together · but keep enough to repay any depositor on demand · confidence (NCERT)",
          """A long queue at the goldsmith's door with worried faces; Lala wipes his brow behind the counter; a calm village stays home
          in the next frame: two panels, QUEUE / CALM.""",
          ["ECO16-N10"], "3"),
        T(3, "b04", "therefore",
          """To see the limit, read a bank's books. NCERT's balance sheet has two sides.
          Assets are what the bank holds: its reserves and its loans. Liabilities are what it owes: its deposits.
          Reserves are cash plus the bank's deposits with the Reserve Bank.
          Start with a bank that holds a hundred rupees of deposits and keeps all hundred as reserves. It has lent nothing yet.""",
          "balance sheet · assets = reserves + loans · liabilities = deposits · reserves = cash + deposits with RBI (NCERT 3.3.1) · start: ₹100 deposits, ₹100 reserves",
          """A two-sided ledger on a desk: ASSETS (reserves, loans) at the left, LIABILITIES (deposits) at the right; a hundred-rupee
          block sits in RESERVES and the same block in DEPOSITS; the loans slot is empty.""",
          ["ECO16-N12", "ECO16-N13"], "2", "balance sheet"),
        T(3, "b05", "therefore",
          """Now the bank makes a loan. NCERT's answer is plain: it opens a new deposit in the borrower's name.
          So the money supply rises by that new deposit.
          In NCERT's example, the borrower's eighty rupees is such a deposit. And your hundred is still there.
          That is where the extra eighty came from.""",
          "a loan opens a new deposit in the borrower's name → the money supply rises by that deposit (NCERT 3.3)",
          """The ledger again: a new block of 80 appears on the DEPOSITS side under the borrower's name; the loan slot fills; the
          original 100 stays; a counter above shows 100 → 180.""",
          ["ECO16-N11", "ECO16-N15"], "3",
          note="The payoff of b00's question (the plant): where the extra eighty came from. Not yet the limit."),
        T(4, "b06", "but",
          """So what stops a bank from lending without end? The first answer is a rule.
          The Reserve Bank decides what share of deposits every bank must keep as reserves. This is the cash reserve ratio, the CRR.
          NCERT says it is a legal requirement, meant to stop over-lending.""",
          "cash reserve ratio (CRR) = the share of deposits banks must keep as reserves · a legal requirement · RBI",
          """A bank vault door with a dial labelled CRR; behind the glass, a fixed fraction of the deposit bar is shaded: RESERVE.
          A hand-stop sign: STOP OVER-LENDING.""",
          ["ECO16-N14", "ECO16-R02"], "2", "cash reserve ratio"),
        T(4, "b07", "therefore",
          """NCERT's example uses a reserve ratio of twenty percent. A hundred rupees is deposited.
          The bank keeps twenty and lends eighty. The borrower spends it, and someone deposits it. That is a new deposit of eighty.
          The bank keeps sixteen and lends sixty-four. Round after round, the loans shrink by a fifth.
          Added up, deposits reach five hundred rupees, with reserves of one hundred and loans of four hundred.""",
          "20% reserve ratio · ₹100 → lend ₹80 → ₹80 deposited → lend ₹64 → … → deposits ₹500 · reserves ₹100 · loans ₹400 (NCERT 3.3.2)",
          """A staircase of coin stacks: each step is a smaller loan (100, 80, 64 ...); a running total counter on the side climbs and
          stops at 500; a pie shows the final split: reserves 100, loans 400.""",
          ["ECO16-N15", "ECO16-A04"], "3"),
        T(4, "b08", "therefore",
          """Reserves of one hundred rupees created deposits of five hundred. NCERT calls the ratio the money multiplier.
          Here it is five. It is one divided by the reserve ratio. One divided by point two is five.""",
          "money multiplier = 1 ÷ reserve ratio · 1 ÷ 0.2 = 5 (NCERT)",
          """A gear train: a small gear (RESERVES 100) drives a big gear (DEPOSITS 500); a label reads MULTIPLIER 5; the formula card
          1 ÷ r slides in beneath.""",
          ["ECO16-N16", "ECO16-A04"], "3", "money multiplier"),
        T(4, "b09", "but",
          """But people also keep some cash in their pockets. That cash leaks out of the process.
          The currency-deposit ratio is the cash people hold for each rupee of deposits. IGNOU shows the multiplier is that ratio plus one, divided by that ratio plus the reserve ratio.
          At today's CRR of three percent, the plain formula gives thirty-three.
          With the public holding about fifteen paise of cash for every rupee of deposits, the same formula gives about six.
          Both are toy ceilings, not forecasts.""",
          "IGNOU: m = (cdr + 1) ÷ (cdr + rr) · CRR 3%: 1 ÷ 0.03 ≈ 33 · with cdr ≈ 0.15: ≈ 6.4 · toy ceilings, not forecasts",
          """The gear train again with a leak: a few coins roll off the big gear into a wallet beside it; the multiplier readout
          drops from 33 to 6.4 while a stamp lands: TOY CEILING.""",
          ["ECO16-T07", "ECO16-A14", "ECO16-A09", "ECO16-A06"], "4", "currency-deposit ratio",
          note="Rung 4: leakage. Ceilings in a toy model; the next beats say what actually limits lending."),
        T(5, "b10", "but",
          """NCERT's Class 10 book says banks hold about five percent of deposits as cash. That is dated.
          On the third of November 2026, the CRR was three percent. It was four and a half percent until December 2024.
          The Reserve Bank cut it to three percent in four steps, between September and November 2025.
          Banks must also hold safe, easily sold assets worth at least eighteen percent of their deposits.
          That is the statutory liquidity ratio, the SLR.""",
          "CRR 3.00% (3 Nov 2026) · 4.5% until Dec 2024 → 3.0% by Nov 2025 · SLR: at least 18% in safe, easily sold assets · RBI",
          """A dial labelled CRR turns from 4.5 down to 3.0 in four clicks along a dated timeline; beside it a second vault door: SLR 18,
          full of government-bond folders.""",
          ["ECO16-N32", "ECO16-R03", "ECO16-R04", "ECO16-R05", "ECO16-R06", "ECO16-R07"], "4", "statutory liquidity ratio",
          note="Dated NCERT figure (N32) corrected by the RBI panel (R05). Living figures: CRR and SLR on 3 Nov 2026."),
        T(5, "b11", "therefore",
          """The reserve ratio is one lever. NCERT says that when the Reserve Bank raises it, banks cut their lending, so the money supply falls.
          NCERT sorts the Reserve Bank's tools in two groups. Quantitative tools change the CRR, the bank rate, or buy and sell bonds.
          Qualitative tools are moral suasion and the margin requirement.""",
          "RBI's tools · quantitative: CRR, bank rate, open market operations · qualitative: moral suasion, margin requirement (NCERT 3.4)",
          """A control panel with five dials in two groups, QUANTITATIVE and QUALITATIVE; the CRR dial turns up and a small money
          bar beside it shrinks.""",
          ["ECO16-N18"], "3"),
        T(5, "b12", "therefore",
          """Take one tool. In an open market operation, the Reserve Bank buys a government bond and pays by cheque.
          That adds to the banks' reserves and to the money supply. Selling a bond does the opposite.
          And NCERT calls the Reserve Bank the lender of last resort. It stands ready to lend to banks at all times.""",
          "open market operation: RBI buys a bond → pays by cheque → reserves rise · sells → reserves fall · lender of last resort (NCERT 3.4)",
          """A bond certificate passes from a dealer to the RBI building; a cheque flies back and lands in a bank's reserve bar, which
          rises; the reverse trade makes it fall; a lifebuoy tag: LENDER OF LAST RESORT.""",
          ["ECO16-N19", "ECO16-N17"], "3", "open market operation"),
        T(6, "b13", "but",
          """Now the honest question. Does a bank wait for reserves before it lends?
          Staff of the Bank of England wrote in 2014 that most money is created when banks make loans.
          They said banks do not simply lend out the deposits savers leave with them. Nor do they multiply up central bank money.
          This was a staff article, not the bank's policy.""",
          "Bank of England staff (2014): most money is created when banks lend · banks do not simply lend out deposits, nor multiply up central bank money · staff research, not policy",
          """Two cards face to face: TEXTBOOK (reserves → loans → deposits) and STAFF RESEARCH (loans → deposits); a plaque: BANK OF
          ENGLAND STAFF, 2014; a tag: STAFF VIEW, NOT POLICY.""",
          ["ECO16-T01", "ECO16-T02", "ECO16-T03"], "4",
          note="CONFLICT row (T02): both sides are named. The views are those of the article's authors."),
        T(6, "b14", "therefore",
          """Staff of Germany's central bank, the Bundesbank, said something similar in 2017.
          A bank's ability to lend has nothing to do with whether it already holds excess reserves or deposits.
          Then what limits it? Their answer: the need to lend profitably, the rules that regulate banks, and what borrowers want to borrow.
          And in normal times, the central bank steers the process through its interest rate.""",
          "Bundesbank staff (2017): lending is not tied to excess reserves · limits: profit, regulation, borrowers' demand · the central bank steers through its interest rate",
          """A balance of three weights labelled PROFIT, RULES, DEMAND pressing on a loan counter; above them, a dial: INTEREST RATE. A
          plaque: BUNDESBANK STAFF, 2017.""",
          ["ECO16-T05", "ECO16-T06", "ECO16-T04"], "4"),
        T(6, "b15", "but",
          """Reserve rules are not universal. The United States cut its reserve requirement ratios to zero in March 2020.
          Yet NCERT and IGNOU still teach the multiplier. IGNOU adds a caution: in the real world, money supply is likely a mix.
          Sometimes the central bank fixes it. Sometimes banks, firms and households shape it.
          So when you write the exam answer, name the view you are describing.""",
          "US reserve requirement ratios: zero since 26 Mar 2020 · IGNOU: exogenous (authority fixes) and endogenous (banks, firms, households influence) · likely a combination",
          """A map-free world scene: a wall of reserve-ratio dials, one set to ZERO (US, 2020); two toolboxes labelled EXOGENOUS and
          ENDOGENOUS with a bridge between; a notebook tag: NAME THE VIEW.""",
          ["ECO16-R15", "ECO16-T08", "ECO16-N16"], "4", "endogenous money",
          note="No side taken: the Gold Standard asks that debates name who holds which view."),
        T(6, "b16", "therefore",
          """The multiplier can also shrink. IGNOU recounts that in the United States, between March 1930 and March 1933, the money stock fell about thirty-five percent.
          Over the same time, the monetary base rose about twenty percent.
          IGNOU gives two reasons. People pulled money out of banks, and banks held large excess reserves.
          IGNOU credits Milton Friedman and Anna Schwartz with the argument that the fall in money was a major factor.""",
          "US, Mar 1930 – Mar 1933: money −35%, monetary base +20% · IGNOU's reasons: bank runs and excess reserves · Friedman and Schwartz",
          """Two lines on a chart sketch with no axis numbers: MONEY falling, BASE rising, a widening gap; a small queue at a bank door
          in one corner, a vault full of unused cash in another. A tag: ILLUSTRATION.""",
          ["ECO16-T09"], "4",
          note="Single-source (IGNOU) row; the original Friedman and Schwartz book not opened (U05): attribute on screen."),
        T(7, "b17", "therefore",
          """Which brings us back to confidence. What protects a depositor today?
          Deposit insurance. Each depositor in a bank is insured up to five lakh rupees, for principal and interest together.
          The cover applies bank by bank, and the bank, not the depositor, pays the premium.
          So a small depositor need not run to the door.""",
          "deposit insurance: up to ₹5 lakh per depositor per bank (principal + interest) · the bank pays the premium · DICGC",
          """A passbook under a clear umbrella labelled DICGC; a coin stack marked 5 LAKH slides under it; the queue at the bank door
          from before thins out.""",
          ["ECO16-R13"], "3",
          note="Names no failed bank (dossier A5). 'A small depositor need not run' is our plain restatement of the purpose; keep it hedged on screen."),
        T(7, "b18", "therefore",
          """And how does a bank earn? It pays depositors less than it charges borrowers. The gap is called the spread.
          NCERT's Class 7 example: two hundred rupees lent at five percent brings ten rupees.
          Two hundred rupees deposited at two percent costs four. The bank keeps six.
          On the third of November 2026, the Reserve Bank's rate panel showed savings deposits at two and a half percent.""",
          "spread = interest charged − interest paid · NCERT Grade 7: ₹200 at 5% → ₹10; ₹200 at 2% → ₹4; bank keeps ₹6 · savings rate 2.5% (3 Nov 2026)",
          """Two coin stacks of the same ₹200: one earns a ₹10 stack as it goes out, one costs a ₹4 stack as it comes in; the gap, ₹6,
          glows in the bank's till.""",
          ["ECO16-N08", "ECO16-N47", "ECO16-A11", "ECO16-I05"], "3", "spread"),
        T(8, "b19", "therefore",
          """For the exam, write it this way. A bank's loan opens a new deposit, so lending creates money.
          The limit in the textbook model is the reserve ratio. With a reserve ratio of twenty percent, the multiplier is five.
          Cash held by the public leaks out of the process, and the multiplier is smaller.
          Today the Reserve Bank's CRR is three percent and the SLR eighteen.
          Name the view: central bank staff say lending depends on profit, regulation and demand, and on the interest rate.""",
          "Loan → new deposit · multiplier = 1 ÷ reserve ratio (toy) · cash leakage · CRR 3%, SLR 18% (3 Nov 2026) · name the view",
          """The notebook page fills line by line in handwriting; the terms turn gold as the narration reaches them; the last line
          carries the debate: name the view.""",
          ["ECO16-N11", "ECO16-N16", "ECO16-T07", "ECO16-R05", "ECO16-R07", "ECO16-T05"], "5"),
        T(8, "b20", "therefore",
          """So banks create money when they lend, and the limits are rules, profit and demand.
          But money is only half of credit. Who gets a loan, at what price, and who is left out?
          In part three: credit in daily life, formal and informal, and how the money moves.""",
          "Part 3: credit in daily life · formal and informal · how money moves (UPI, cards)",
          """The ledger closes; a map-free street scene opens beyond: a moneylender's table beside a bank counter, a phone tap at a cart.
          A frame: PART 3.""",
          [], "handoff"),
    ],
    story=dict(
        promise="When a bank gives you a loan, where does the money come from, and what stops it from lending more?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="Where does a bank's loan money come from, and what stops it lending more?", open="b00", close="b19"),
            dict(id="L2", kind="secondary", q="Where did the extra eighty rupees come from?", open="b00", close="b05"),
            dict(id="L3", kind="tertiary", q="Does the textbook multiplier match how banks work?", open="b13", close="b15"),
            dict(id="M1", kind="micro", q="Can a goldsmith lend gold he holds for others?", open="b02", close="b03"),
            dict(id="M2", kind="micro", q="How big can the multiplier get?", open="b07", close="b09"),
            dict(id="M3", kind="micro", q="What are today's reserve ratios?", open="b10", close="b10"),
            dict(id="M4", kind="micro", q="What protects a depositor, and how does a bank earn?", open="b17", close="b18"),
        ],
        turn="b05",
        plants=[("b00", "b05"), ("b03", "b17")],
        critical=[
            dict(what="A loan opens a new deposit; the worked 20% example to deposits of ₹500", src="NCERT Class 12 Introductory Macroeconomics ch.3, 3.3 and 3.3.2 (ECO16-N11, N15, N16)"),
            dict(what="The CRR and SLR today", src="RBI Current Rates panel, 3 Nov 2026; CRR and SLR rules (ECO16-R03, R05, R06, R07)"),
            dict(what="Central bank staff on how banks create money", src="Bank of England Quarterly Bulletin 2014 Q1; Bundesbank Monthly Report April 2017 (ECO16-T01-T06)"),
        ],
        fallback="If the staff articles failed review: what does the textbook multiplier assume, and where does NCERT say it is only an example?",
        tier="broad",
    ),
)
