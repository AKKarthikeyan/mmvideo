"""Format A (One Question): UPSC CSE (Main) 2024, Economics optional Paper I, Q4(a), 20 marks. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the ECO-16 ledger (research/upsc/ECO-16/claims.csv), this folder's claims.csv and the answer-video ledger (research/upsc/pyq/claims.csv).
ECO16-T02 (CONFLICT) and the unverified rows are not cited. The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None, formula=False):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [], formula=formula)


A = dict(
    id="PYQ-2024-ECO1-4A",
    fmt="A",
    title="How Banks Create Credit, and What Can Break the Multiplier (UPSC Economics 2024)",
    question=dict(year=2024, paper="eco1", label="Economics optional Paper I", q=4, part="a", marks=20,
                  text="Describe the mechanism of credit creation by commercial banks and its implications on multiplier effect. "
                       "Analyse some of the limitations that can jeopardise the implications on multiplier effect.",
                  pdf="research/upsc/_pyq/mains/2024_eco1.pdf", page=3),
    budget=(300, 350),
    minutes=14,
    budget_note="our working budget; UPSC prints no word limit for this part (Q4(a) of the 2024 paper; no ledger claim yet); 14 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-16", "pyq", "pyq/2024-eco1-4a"],
    demands=[
        dict(id="D1", text="Describe the mechanism of credit creation by commercial banks"),
        dict(id="D2", text="Explain its implications for the multiplier effect"),
        dict(id="D3", text="Analyse the limitations that can jeopardise those implications", view=True),
    ],
    sheet=[
        S("intro", """_Credit creation_: when a bank lends, a new deposit opens in the borrower's name and money supply rises (NCERT 3.3). Multiplier = money (credit) multiplier.""",
          ["D1"], ["ECO16-N11"]),
        S("head", "1. Mechanism of credit creation", ["D1"]),
        S("points", """• Banks lend part of deposits, as depositors do not withdraw together; the _spread_ is profit.
          • Bank of England staff (2014): most money is created by bank loans, as deposits.
          • NCERT's example assumes the loan returns to the same bank. At its made-up 20% _reserve ratio_, ₹100 gives ₹500 of deposits.
          • RBI sets the CRR by law: 3.00%; SLR 18.00% (11 Nov 2026).""",
          ["D1"], ["ECO16-N08", "ECO16-N10", "ECO16-T01", "2024-ECO1-4A-01", "ECO16-N14", "ECO16-N15", "ECO16-R02", "2024-ECO1-4A-02"]),
        S("diagram", """Lending rounds at a 20% reserve ratio: ₹100, ₹80, ₹64 … adding up to ₹500 of deposits.""",
          ["D1"], ["ECO16-N15", "ECO16-A04"], label="Fig. 1: How ₹100 of reserves becomes ₹500 of deposits",
          items=[dict(when="₹100", what="first deposit"), dict(when="₹80", what="lent, deposited"), dict(when="₹64", what="lent again"),
                 dict(when="…", what="more rounds"), dict(when="₹500", what="total deposits")]),
        S("head", "2. Implications for the multiplier", ["D2"]),
        S("para", """_m = 1/rr_ (IGNOU's formula with cdr = 0); with cash held, _m = (cdr + 1)/(cdr + rr)_, where rr is the reserve-deposit ratio
          and cdr the currency-deposit ratio. So RBI can move deposits by a multiple: at a 25% ratio ₹100 of reserves supports ₹400, not ₹500
          (NCERT; our arithmetic). CRR and open market operations change these. RBI's multiplier (M3 / base money) was
          5.57, 5.48, 5.20 in 2019-20 to 2021-22, the latest we could read (RBI Bulletin, 2022), as cdr rose 0.16 to 0.18.
          Our arithmetic: 1/rr at today's CRR of 3.00% is 33.3, a toy ceiling.""",
          ["D2"], ["ECO16-N16", "ECO16-A04", "ECO16-T07", "ECO16-A05", "ECO16-N18", "ECO16-N19", "2024-ECO1-4A-07", "ECO16-A06", "2024-ECO1-4A-02"], formula=True),
        S("head", "3. Limitations", ["D3"]),
        S("points", """• _Cash drain_: a higher cdr cuts the multiplier; crisis cash holding can be offset by a lower CRR (RBI Bulletin).
          • _Excess reserves_: IGNOU: US money fell about 35% (March 1930 to March 1933) while the base rose about 20%, as cdr and excess reserves rose.
          • _Leakage_: loans paid out as cash or to other banks break NCERT's same-bank chain (our reading).
          • _Loan demand_: the process continues only if there is sufficient demand for loans (IGNOU); profit and regulation limit it too (Bundesbank, 2017).
          • _Lending share_: banks lent 81.9% of deposits on 31 Jul 2026 (our arithmetic from RBI).
          • The multiplier is a reduced form, not a causal rule (Bundesbank). Bank of England staff (2014): in normal times money depends on interest-rate policy, not a multiplier of reserves.""",
          ["D3"], ["2024-ECO1-4A-06", "2024-ECO1-4A-04", "ECO16-T09", "2024-ECO1-4A-01", "2024-ECO1-4A-03", "ECO16-T05", "ECO16-A09", "2024-ECO1-4A-05", "ECO16-T01", "ECO16-T04"]),
        S("close", """Our reading: the multiplier is a ceiling in a toy model: cash habits, spare reserves and loan demand keep real money below it; it is not a causal rule.""",
          ["D2", "D3"], ["ECO16-N16", "ECO16-T05"]),
    ],
    weak=[
        dict(text="Banks create money by lending deposits.", miss="no mechanism: the loan opening a new deposit is never said", claims=["ECO16-N11"]),
        dict(text="Multiplier = 1/CRR, so about 33.3 today.", miss="a toy ceiling at today's CRR; it ignores cash held and real limits", claims=["ECO16-A06"]),
        dict(text="Limitation: banks keep CRR and SLR.", miss="leaves out cash drain, idle reserves and weak loan demand", claims=["2024-ECO1-4A-04", "2024-ECO1-4A-03"]),
        dict(text="(no worked example)", miss="a 20-mark answer that never shows the ₹100 to ₹500 rounds", claims=["ECO16-N15"]),
        dict(text="(no India figure)", miss="RBI's own multiplier of 5.20 for 2021-22 is never used, so the theory is left unchecked", claims=["2024-ECO1-4A-07"]),
    ],
    cousins=["2025 Economics Paper I Q4(c): money multiplier and its determinants",
             "2019 Economics Paper I Q5(a) (10 marks): partial cash hoarding and excess reserves",
             "2018 Economics Paper I Q1(e) (10 marks): high-powered money and short-term policy"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-four. Economics optional, Paper One, twenty marks.
          Describe how banks create credit, and what it means for the multiplier. Then analyse what can limit it.
          Here's the trap. The textbook story is tidy. It holds only if nobody keeps cash and every loan comes back as a deposit.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2024, Economics Paper I, Q4(a)'.
          The words 'describe', 'implications' and 'analyse' glow faintly (plant).""",
          ["ECO16-T07"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Describe means say how it works, step by step. Analyse means break it into parts and weigh them.
          So there are three jobs: the mechanism, the multiplier, and the limits.""",
          "Question X-ray: 'Describe', 'implications' and 'Analyse' underlined; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "but", "idea",
          """Start with the loan. When a bank lends, it opens a deposit in the borrower's name. That is new money.
          The bank can do this because depositors do not all come at once.""",
          "A loan slip turns into a new deposit line on a bank ledger; the money total ticks up.",
          ["ECO16-N11", "ECO16-N10"]),
        T("b03", "therefore", "idea",
          """Now add the reserve ratio. At twenty percent, a hundred rupees comes in and eighty is lent. Then sixty-four, and so on.
          The rounds add up to five hundred. That is the multiplier of five.""",
          "The lending rounds as stacked coins: 100, 80, 64, each smaller; the total reaches 500 and m = 5 appears.",
          ["ECO16-N15", "ECO16-A04"]),
        T("b04", "but", "idea",
          """But people hold cash, and banks keep spare reserves. In our reading, every rupee that leaves the chain stops a round.
          India's own multiplier fell from five point five seven to five point two zero. That is in the two years to twenty twenty-two.""",
          "A rupee leaks from the chain into a wallet; a small line chart shows 5.57, 5.48, 5.20.",
          ["2024-ECO1-4A-07", "ECO16-T07"]),
        T("b05", "therefore", "sheet",
          """Now we write. No word limit is printed. So we set our own: about three hundred and fifty words, in fourteen minutes.
          Open with credit creation in one line, then the mechanism in three points.""",
          "The answer sheet; clock 14:00 and word counter 0. The introduction and Section 1 write in; box D1 fills.",
          ["ECO16-N11"]),
        T("b06", "therefore", "sheet",
          """Section two gives both formulas and RBI's actual multiplier, with its year. One small diagram shows the rounds.
          It takes a minute, and it proves you understand.""",
          "Section 2 writes in; Fig. 1 draws; box D2 fills.",
          ["ECO16-T07", "2024-ECO1-4A-07", "ECO16-N15"]),
        T("b07", "therefore", "sheet",
          """Section three is the limits. Cash drain, idle reserves, weak loan demand. Then the caution that the multiplier is not a causal rule.
          End with a verdict: the multiplier is a ceiling, not a constant.""",
          "Section 3 and the conclusion write in; box D3 fills.",
          ["2024-ECO1-4A-06", "2024-ECO1-4A-03", "2024-ECO1-4A-05", "ECO16-T09"]),
        T("b08", "but", "compare",
          """Now the easy answer beside it. It says banks lend out deposits, and stops. It writes one over CRR and calls it thirty-three.
          It lists only CRR and SLR as limits. And it never shows the rounds.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["ECO16-N11", "ECO16-A06", "2024-ECO1-4A-03", "ECO16-N15"]),
        T("b09", "therefore", "cousins",
          """Here is the payoff. One frame answers its cousins. Twenty twenty-five asked for the money multiplier and its determinants.
          Twenty nineteen asked about cash hoarding. Twenty eighteen asked about high-powered money.
          For the full story of how banks create money, watch our money episode.""",
          "The three boxes tick; three cousin question cards slide in; end card to the ECO-16 film.",
          []),
    ],
    story=dict(
        promise="Why does the tidy textbook story of credit creation fail in the real world, and how do you write the whole answer in fourteen minutes?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you write this answer well?", open="b00", close="b09"),
            dict(id="L2", kind="secondary", q="Why does the neat multiplier overstate credit?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b07"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b05", close="b08"),
        ],
        turn="b04",
        plants=[("b00", "b04"), ("b01", "b09")],
        critical=[
            dict(what="How a loan opens a deposit; the 100 to 500 rounds", src="NCERT Class XII Ch 3 (ECO16-N11, N15)"),
            dict(what="RBI's multiplier of 5.20 for 2021-22, and CRR 3.00% and SLR 18.00%", src="RBI Bulletin June 2022 (2024-ECO1-4A-07); RBI Current Rates panel, 11 Nov 2026 (2024-ECO1-4A-02)"),
        ],
        fallback="If the limitations from the Bulletin and Bundesbank failed review: end Section 3 on IGNOU's two determinants, cash held and excess reserves.",
        tier="broad",
    ),
)
