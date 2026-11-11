"""One Question, format A: UPSC CSE (Main) 2020, General Studies Paper III, Q12. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2020-gs3-12/claims.csv); the topic ledger ECO-12 is listed but not cited.
The ten-month gap Rs 1,65,178 crore is our arithmetic: 6,38,339 minus 4,73,161 (claim -10; the minutes print 1,65,718 once, a transposition settled by the audit).
Left out on purpose: the 1 Feb 2026 cess withdrawal (-25, UNVERIFIED), the '31 March 2026' cess end date (-26), the 43rd meeting (-29), and party affiliations.
Members are named by office and State as the minutes record them. The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2020-GS3-12",
    fmt="A",
    title="GST Compensation: Why It Exists and What COVID Did to It (UPSC GS III 2020)",
    question=dict(year=2020, paper="gs3", label="General Studies Paper III", q=12, part="", marks=15,
                  text="Explain the rationale behind the Goods and Services Tax (Compensation to States) Act of 2017. How has COVID-19 impacted the GST compensation fund and created new federal tensions?",
                  pdf="research/upsc/_pyq/mains/2020_gs3.pdf", page=3),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words; 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-12", "pyq/2020-gs3-12"],
    demands=[
        dict(id="D1", text="The rationale of the Compensation Act, 2017"),
        dict(id="D2", text="How COVID-19 hit the Compensation Fund"),
        dict(id="D3", text="The new federal tensions, as the Council's own record shows them"),
    ],
    sheet=[
        S("intro", """The 101st Amendment (s.18) promised States compensation for GST revenue loss for five years; the Compensation Act, 2017 made it a formula.""",
          ["D1"], ["2020-GS3-12-01", "2020-GS3-12-02"]),
        S("head", "1. Rationale", ["D1"], ["2020-GS3-12-03"]),
        S("points", """• _Protected revenue_: 14% yearly growth on the 2015-16 base (ss.3-4, 6).
          • Compensation is projected minus actual revenue, on _CAG_-audited figures (s.7).
          • Paid from a _cess_ into a non-lapsable _Compensation Fund_ (ss.8, 10), for five years 'or such period as may be prescribed'.
          • The Joint Secretary (DoR) told the 41st Council the Chairperson had said earlier that cess, not the Consolidated Fund, would pay.""",
          ["D1"], ["2020-GS3-12-03", "2020-GS3-12-04", "2020-GS3-12-05", "2020-GS3-12-06", "2020-GS3-12-07"]),
        S("head", "2. COVID and the Fund", ["D2"], ["2020-GS3-12-08"]),
        S("points", """• On 31 July 2020 the Fund held about Rs 11,000 crore.
          • Finance Secretary: around Rs 3,00,000 crore needed; Rs 1,65,000 crore GST implementation, Rs 1,35,000 crore COVID (41st Council). After Rs 68,700 crore of Fund and cess, GST alone left Rs 96,477 crore.
          • _Special Window_: the Centre borrowed Rs 1.1 lakh crore (2020-21) and Rs 1.59 lakh crore (2021-22), passed on as back-to-back loans.
          • The cess was extended beyond June 2022 till the shortfall is covered.""",
          ["D2"], ["2020-GS3-12-08", "2020-GS3-12-10", "2020-GS3-12-30", "2020-GS3-12-19", "2020-GS3-12-13"]),
        S("diagram", """A flow from the shortfall to the loans and the cess.""",
          ["D2"], ["2020-GS3-12-10", "2020-GS3-12-30", "2020-GS3-12-19", "2020-GS3-12-13"], label="Fig. 1: From shortfall to loans",
          items=[dict(when="Shortfall", what="GST shortfall Rs 96,477 crore + COVID Rs 1,35,000 crore"), dict(when="Two options", what="States asked to borrow"),
                 dict(when="Back-to-back loans", what="Rs 1.1 and 1.59 lakh crore"), dict(when="Cess extended", what="beyond June 2022")]),
        S("head", "3. Federal tensions", ["D3"], ["2020-GS3-12-15"]),
        S("points", """• Punjab's Minister: the options were not in accordance with law; _Article 279A(11)_ offered a dispute mechanism.
          • Assam's Minister: about 21 States had no dispute.
          • Attorney General's opinion: the entitlement is 'hard coded in the Act'; no express duty on the Centre to raise resources.""",
          ["D3"], ["2020-GS3-12-15", "2020-GS3-12-16", "2020-GS3-12-09", "2020-GS3-12-19"]),
        S("close", """The bargain held: the Ministry says all compensation due to May 2022 was released (PIB), part through borrowed loans. We saw no record of the 279A(11) mechanism being set up.""",
          ["D1", "D2", "D3"], ["2020-GS3-12-15", "2020-GS3-12-19"]),
    ],
    weak=[
        dict(text="Compensation is paid from the Consolidated Fund of India.", miss="s.10: it is paid out of the Compensation Fund, built from the cess", claims=["2020-GS3-12-06"]),
        dict(text="The 14% and the 2015-16 base are in section 7.", miss="they are in ss.3-4; s.7 is how compensation is worked out", claims=["2020-GS3-12-03", "2020-GS3-12-04"]),
        dict(text="Compensation ran for ever.", miss="the Act's five years ended in June 2022 (our reading of s.2(1)); the cess continued, to repay the loans", claims=["2020-GS3-12-22"]),
        dict(text="Every State fought the borrowing plan.", miss="Assam's Minister said about 21 States had no dispute; PIB later said all had agreed", claims=["2020-GS3-12-16", "2020-GS3-12-19"]),
        dict(text="(adds a cess end date and a withdrawal date)", miss="end date: not found; withdrawal date: one source (Council newsletter), not confirmed at the notification", claims=[]),
    ],
    cousins=["2017 GS II Q11: the 101st Amendment Act and cascading of taxes",
             "2019 GS III Q1: taxes subsumed in GST and revenue since 2017",
             "2023 GS II Q15: the 101st Amendment and accommodative federalism"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty. General Studies Paper Three, fifteen marks, two hundred and fifty words.
          Explain why the Compensation Act exists. Then say how COVID hit the fund and strained federalism.
          Here is the catch. A date for the end of the cess was in our brief. We could not source it.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2020, GS Paper III, Q12'.
          A blurred date card sits behind it (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Explain, then how. That is three jobs.
          The rationale. The hit to the fund. The tensions, as the record shows them.""",
          "Question X-ray: 'explain' highlighted; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """States agreed to merge their taxes. In return the Constitution promised compensation for five years.
          The Act set protected revenue at fourteen per cent growth on a twenty fifteen-sixteen base.""",
          "A promise card from the Amendment; a 14% staircase on a 2015-16 bar.",
          ["2020-GS3-12-02", "2020-GS3-12-03"]),
        T("b03", "therefore", "idea",
          """The money came from a cess, kept in a separate fund. Compensation was projected revenue minus actual revenue.
          The Council was told the Chairperson had said the cess, not the Consolidated Fund, would pay.""",
          "Cess drops into a Compensation Fund; a subtraction line of projected minus actual.",
          ["2020-GS3-12-04", "2020-GS3-12-06", "2020-GS3-12-07"]),
        T("b04", "but", "idea",
          """But COVID broke the arithmetic. At the forty-first Council, the fund held about eleven thousand crore.
          The shortfall from GST alone was about ninety-six thousand four hundred and seventy-seven crore. COVID added about one lakh thirty-five thousand crore more.""",
          "The fund gauge near empty; the gap bar drawn beside it.",
          ["2020-GS3-12-08", "2020-GS3-12-10", "2020-GS3-12-30"]),
        T("b05", "therefore", "idea",
          """So the Centre borrowed and passed the money on as back-to-back loans.
          One point one lakh crore in 2020-21. One point five nine in 2021-22. The cess was extended to repay.""",
          "Loan arrows from the Centre to the States; the cess tag stretched past June 2022.",
          ["2020-GS3-12-19", "2020-GS3-12-13"]),
        T("b06", "but", "idea",
          """But States did not all agree. Punjab's Minister said the options were not in accordance with law and pointed to the dispute mechanism.
          Assam's Minister said about twenty-one States had no dispute. By May twenty twenty-two, the Ministry said all had agreed.""",
          "Two columns of State positions; a PIB line at the foot.",
          ["2020-GS3-12-15", "2020-GS3-12-16", "2020-GS3-12-19"]),
        T("b07", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Rationale, then the fund, then the tensions. End by stating what we could not find.""",
          "The answer sheet; clock 11:00 and word counter 0. Sections write in; Fig. 1 draws; boxes D1 to D3 fill.",
          ["2020-GS3-12-03", "2020-GS3-12-10"]),
        T("b08", "but", "compare",
          """Now the easy answer beside it. It says compensation comes from the Consolidated Fund. It comes from the cess fund.
          It puts the fourteen per cent in section seven. It is in sections three and four. And it says every State fought.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2020-GS3-12-06", "2020-GS3-12-03", "2020-GS3-12-16"]),
        T("b09", "therefore", "cousins",
          """Here is the payoff. This answer serves its cousins.
          Twenty seventeen asked about the Amendment. Twenty nineteen asked about revenue. Twenty twenty-three asked about federalism.""",
          "The boxes tick; three cousin question cards slide in.",
          ["2020-GS3-12-02"]),
    ],
    story=dict(
        promise="Why does the compensation Act exist, what did COVID do to it, and how do you answer in 250 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 250 words?", open="b00", close="b09"),
            dict(id="L2", kind="secondary", q="Which end date can't we source?", open="b00", close="b07"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b07"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b07", close="b08"),
        ],
        turn="b04",
        plants=[("b00", "b07"), ("b01", "b09")],
        critical=[
            dict(what="Rs 96,477 crore shortfall from GST alone", src="41st Council minutes, OCR checked on page image (2020-GS3-12-10)"),
            dict(what="Rs 1.1 and 1.59 lakh crore back-to-back loans", src="PIB, 15 Oct 2020 and 31 May 2022 (2020-GS3-12-19)"),
        ],
        fallback="If the minutes figure failed review: drop the crore figure and keep the order of events.",
        tier="broad",
    ),
)
