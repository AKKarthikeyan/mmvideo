"""Pilot 3, format A (One Question): UPSC CSE (Main) 2025, Economics optional Paper I, Q4(c). Draft 1, 7 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the ECO-16 ledger (research/upsc/ECO-16/claims.csv) and the answer-video ledger (research/upsc/pyq/claims.csv).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2025-ECO1-4C",
    fmt="A",
    title="The Money Multiplier: Define It, Find Its Levers, Show Who Controls It (UPSC Economics 2025)",
    question=dict(year=2025, paper="eco1", label="Economics optional Paper I", q=4, part="c", marks=15,
                  text="Define money multiplier and discuss its determinants. Explain in terms of money multiplier, how the banking system "
                       "of an economy can control money supply.",
                  pdf="research/upsc/_pyq/mains/2025_eco1.pdf", page=5),
    budget=(220, 270),
    minutes=11,
    budget_note="our working budget; UPSC prints no word limit for this part (P007); 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-16", "pyq"],
    demands=[
        dict(id="D1", text="Define the money multiplier (with its formula)"),
        dict(id="D2", text="Discuss its determinants (what raises or lowers it, and its limits)"),
        dict(id="D3", text="Explain, through the multiplier, how the banking system controls the money supply"),
    ],
    sheet=[
        S("intro", """The money multiplier (m) links the money supply (M) to high-powered money (H): M = m × H. H, also called
          reserve money, is the currency issued by the central bank, held by the public or by banks.""",
          ["D1"], ["ECO16-T07", "ECO16-N07"]),
        S("head", "1. Definition and formula", ["D1"]),
        S("para", """With currency C, deposits D and bank reserves R: M = C + D and H = C + R, so m = (cdr + 1)/(cdr + rr), where
          cdr = C/D and rr = R/D. If no cash is held, m = 1/rr: at rr = 20%, ₹100 of reserves supports ₹500 of deposits (m = 5).""",
          ["D1"], ["ECO16-T07", "ECO16-N15", "ECO16-N16", "ECO16-A04"]),
        S("diagram", """Lending rounds at a 20% reserve ratio: ₹100, ₹80, ₹64 … adding up to ₹500 of deposits.""",
          ["D1"], ["ECO16-N15", "ECO16-A04"], label="Fig. 1: How ₹100 of reserves becomes ₹500 of deposits",
          items=[dict(when="₹100", what="first deposit"), dict(when="₹80", what="lent, deposited"), dict(when="₹64", what="lent again"),
                 dict(when="…", what="more rounds"), dict(when="₹500", what="total deposits")]),
        S("head", "2. Determinants", ["D2"]),
        S("points", """• Reserve ratio (rr): set partly by RBI's CRR (3.00% of NDTL since November 2025) and SLR (18.00%); a higher rr
          lowers m. • Currency-deposit ratio (cdr): the public's taste for cash, about 15% in July 2026; a higher cdr lowers m.
          • Banks' willingness to lend and the demand for loans: profit, regulation and borrowers limit lending (Bundesbank, 2017).
          • Shocks: in 1930-1933 US money fell about 35% while the base rose about 20%, as people pulled cash from banks.""",
          ["D2"], ["ECO16-R03", "ECO16-R05", "ECO16-R07", "ECO16-A09", "ECO16-T05", "ECO16-T09"]),
        S("head", "3. How the banking system controls money supply", ["D3"]),
        S("points", """• RBI changes H: buying bonds in the open market adds reserves; selling them drains reserves. • RBI changes rr:
          a higher CRR makes banks cut lending, so m and M fall. • The policy rate (repo 5.50%) is today's main lever, working
          through banks' lending decisions. • Banks create deposits when they lend; the multiplier is the outer limit, not a constant.""",
          ["D3"], ["ECO16-N19", "ECO16-N18", "ECO16-I05", "ECO16-T06", "ECO16-T03", "ECO16-A06"]),
        S("close", """So M = m × H: RBI steers H, the reserve ratio and the policy rate, while people's cash habits and banks' lending
          decide how far the multiplier really works.""",
          ["D2", "D3"], ["ECO16-T07", "ECO16-T06"]),
    ],
    weak=[
        dict(text="Money multiplier = 1/CRR.", miss="only true with no cash held; the full formula has the currency-deposit ratio", claims=["ECO16-T07"]),
        dict(text="With today's CRR the multiplier is about 33.3.", miss="a toy ceiling; real lending is capped by more than the CRR", claims=["ECO16-A06"]),
        dict(text="Determinants: CRR and SLR.", miss="leaves out the public's cash habits and banks' wish to lend", claims=["ECO16-A09", "ECO16-T05"]),
        dict(text="RBI controls money supply through the multiplier.", miss="no mechanism: H, rr and the policy rate are never named", claims=[]),
        dict(text="(no worked example)", miss="a definition question that never shows the ₹100 → ₹500 rounds", claims=["ECO16-N15"]),
    ],
    cousins=["2018 Economics Paper I Q1(e): high-powered money and the money multiplier",
             "2019 Economics Paper I Q5(a): the multiplier when the public hoards cash",
             "2024 Economics Paper I Q4(a): credit creation by commercial banks"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-five. Economics optional, Paper One, fifteen marks.
          Define money multiplier and discuss its determinants. Then explain how the banking system can control money supply.
          Here's the trap. The formula most people write first is only true in a world with no cash.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2025, Economics Paper I, Q4(c)'.
          The words 'define', 'determinants' and 'control money supply' glow faintly (plant).""",
          ["ECO16-T07"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Define means a precise meaning, with the formula. Discuss means more than one side.
          So there are three jobs: the definition, the determinants, and how the system controls money.""",
          "Question X-ray: 'Define', 'discuss' and 'Explain' underlined; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "but", "idea",
          """Start with what NCERT shows. A bank must keep part of each deposit as reserves. Say twenty percent.
          A hundred rupees comes in. Eighty is lent, and comes back as a deposit somewhere else. Then sixty-four is lent, and so on.""",
          "The lending rounds as stacked coins: 100, 80, 64, each smaller; a reserve jar fills.",
          ["ECO16-N14", "ECO16-N15"]),
        T("b03", "therefore", "idea",
          """Add up the rounds, and a hundred rupees of reserves supports five hundred rupees of deposits.
          That five is the money multiplier. Here it is one over the reserve ratio.""",
          "The rounds sum to 500; the label m = 5 = 1/0.2 appears.",
          ["ECO16-N16", "ECO16-A04"]),
        T("b04", "but", "idea",
          """But people also keep cash. Every rupee held as cash stops a round. So the full formula has two ratios: cash to deposits, and reserves to deposits.
          In India, cash is about fifteen percent of deposits.""",
          "A rupee leaks out of the chain into a wallet; the formula m = (cdr + 1)/(cdr + rr) writes itself.",
          ["ECO16-T07", "ECO16-A09"]),
        T("b05", "therefore", "sheet",
          """Now we write. No word limit is printed, so we set our own: about two hundred and fifty words in eleven minutes.
          Open with the definition in one line: the money supply is the multiplier times high-powered money.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction writes in.",
          ["P007", "ECO16-T07", "ECO16-N07"]),
        T("b06", "therefore", "sheet",
          """Section one gives the formula, and the case with no cash. Then a small diagram of the lending rounds.
          It takes a minute, and it proves you understand.""",
          "Section 1 writes in; Fig. 1 draws; box D1 fills.",
          ["ECO16-T07", "ECO16-N15"]),
        T("b07", "therefore", "sheet",
          """Section two is the determinants. The reserve ratio, which RBI sets partly through the CRR, now three percent.
          The public's taste for cash. Banks' willingness to lend. And shocks: in the Great Depression, people pulled cash from banks, and America's money shrank.""",
          "Section 2 writes in; box D2 fills.",
          ["ECO16-R03", "ECO16-A09", "ECO16-T05", "ECO16-T09"]),
        T("b08", "therefore", "sheet",
          """Section three answers the control question. RBI changes high-powered money by buying or selling bonds. It changes the reserve ratio.
          And today its main lever is the policy rate. Banks create deposits when they lend, so the multiplier is a limit, not a constant.""",
          "Section 3 and the conclusion write in; box D3 fills.",
          ["ECO16-N19", "ECO16-N18", "ECO16-T06", "ECO16-T03"]),
        T("b09", "but", "compare",
          """Now the easy answer beside it. It writes one over CRR, and stops. It says today's multiplier is about thirty-three.
          It lists only CRR and SLR. It never says how control works. And there is no worked example.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["ECO16-T07", "ECO16-A06", "ECO16-A09", "ECO16-N15"]),
        T("b10", "therefore", "cousins",
          """Here is the payoff. One frame answers its cousins. Twenty eighteen asked about high-powered money.
          Twenty nineteen asked what happens when people hoard cash. Twenty twenty-four asked about credit creation.
          Learn the frame once. For the full story of how banks create money, watch our money episode.""",
          "The three boxes tick; three cousin question cards slide in; end card to the ECO-16 film.",
          ["ECO16-T07"]),
    ],
    story=dict(
        promise="Why is the money multiplier formula most people write only half true, and how do you write the whole answer in eleven minutes?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you write this answer well?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Why is the first formula only true with no cash?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b08"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b05", close="b09"),
        ],
        turn="b04",
        plants=[("b00", "b04"), ("b01", "b10")],
        critical=[
            dict(what="The multiplier formula with the currency-deposit ratio", src="IGNOU (ECO16-T07)"),
            dict(what="Today's CRR, SLR and repo rate", src="RBI Current Rates panel, 3 Nov 2026 (ECO16-R05, R07, I05)"),
        ],
        fallback="If the banks-create-deposits view failed review: answer control with NCERT's three tools (H, CRR, bank rate) alone.",
        tier="broad",
    ),
)
