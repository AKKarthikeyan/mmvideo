"""One Question, format A: UPSC CSE (Main) 2024, General Studies Paper I, Q18. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the POL-03 ledger (research/upsc/POL-03/claims.csv) and this answer's ledger (research/upsc/pyq/2024-gs1-18/claims.csv).
Law and official record only; no opinion on any party, government or community. The weaker answer is written by us."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2024-GS1-18",
    fmt="A",
    title="Why Reservation Benefits Still Fall Short (UPSC GS I 2024)",
    question=dict(year=2024, paper="gs1", label="General Studies Paper I", q=18, part="", marks=15,
                  text="Despite comprehensive policies for equity and social justice, underprivileged sections are not yet getting "
                       "the full benefits of affirmative action envisaged by the Constitution. Comment.",
                  pdf="research/upsc/_pyq/mains/2024_gs1.pdf", page=4),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words; 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["POL-03", "pyq/2024-gs1-18"],
    demands=[
        dict(id="D1", text="The frame: the policies and constitutional provisions for equity and social justice"),
        dict(id="D2", text="Why the benefits are not yet fully reaching the underprivileged (the reasons, each with a named source)"),
        dict(id="D3", text="Comment: weigh the policies against the gaps and say what the Court's answer is", view=True),
    ],
    sheet=[
        S("intro", """The Constitution backs affirmative action through _Articles 15(4), 16(4)_ and 46, and posts carry
          quotas of 15, 7.5 and 27 per cent. Official records still show gaps.""",
          ["D1"], ["POL03-B05", "POL03-B09", "POL03-C18", "2024-GS1-18-21"]),
        S("head", "1. Where the benefit stalls", ["D2"], ["2024-GS1-18-20"]),
        S("points", """• _Backlog_: unfilled reserved posts in ten Ministries did not fall between 2016 and 2019 (SC: 8,223 to 14,366);
          DoPT keeps no consolidated vacancy count. • Rank: in Group A, SC hold 14.20, ST 6.54 and OBC 19.14 per cent
          (1 Jan 2024), against the quotas (our comparison). • _Creamy layer_: OBC limit Rs 8 lakh since 2017;
          none for SC and ST in policy, and the judges differ.
          • Spread within groups: Punjab's 2006 Act gave half the SC quota first to two castes.
          • Education: ST gross enrolment is 22.8 against 30 overall (2023-24).""",
          ["D2"], ["2024-GS1-18-03", "2024-GS1-18-23", "2024-GS1-18-20", "2024-GS1-18-21", "2024-GS1-18-05", "2024-GS1-18-06",
                   "2024-GS1-18-13", "2024-GS1-18-12", "2024-GS1-18-15"]),
        S("diagram", "Bars: Group A shares against the quotas.", ["D2"], ["2024-GS1-18-20", "2024-GS1-18-21"],
          label="Fig. 1: Group A representation, 1 Jan 2024",
          items=[dict(when="14.20%", what="SC (quota 15%)"), dict(when="6.54%", what="ST (quota 7.5%)"),
                 dict(when="19.14%", what="OBC (quota 27%)")]),
        S("head", "2. The Court's answer", ["D3"]),
        S("points", """• _Davinder Singh_ (2024, 6:1) allowed _sub-classification_ of SC, but only on data showing inadequate
          representation. • Article 335 is no bar. • Backlog drives have filled over 4.80 lakh posts since 2016. • The Rohini Commission, appointed in 2017 to study uneven OBC benefits, reported on 31 Jul 2023. """,
          ["D3"], ["POL03-C15", "2024-GS1-18-09", "2024-GS1-18-10", "2024-GS1-18-22", "2024-GS1-18-07"]),
        S("close", """So the policy exists, but backlogs, uneven spread within groups and gaps in education show the benefit has not reached all. The way forward is data on
          representation, as the Court asked.""",
          ["D1", "D3"], ["2024-GS1-18-04", "2024-GS1-18-09"]),
    ],
    weak=[
        dict(text="Reservation is given to all backward people, so everyone benefits.", miss="the Court records that benefits are uneven within groups", claims=["POL03-C15"]),
        dict(text="SC, ST and OBC are below their quota in government jobs.", miss="aggregate SC and ST shares met 15 and 7.5 per cent at 1 Jan 2024; the gap is by rank", claims=["2024-GS1-18-04", "2024-GS1-18-20"]),
        dict(text="The Supreme Court held that creamy layer applies to SC and ST.", miss="the order is silent; judges differ", claims=["2024-GS1-18-13"]),
        dict(text="(no case and no figure)", miss="names no Article, case or report, so no evidence", claims=["POL03-B09"]),
    ],
    cousins=["2021 GS II Q13: distinguishing features of the Right to Equality in the USA and India",
             "2017 GS II Q12: scope of Fundamental Rights in the light of the latest Supreme Court judgement on privacy",
             "2021 PSIR Paper I Q5(e): significance of the First Constitutional Amendment"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-four. General Studies Paper One, fifteen marks, two hundred and fifty words.
          Policies for social justice exist, yet the underprivileged do not get the full benefit. Comment.
          Here's the strange part. The official numbers say both things are true.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2024, GS Paper I, Q18'. The word 'Comment' glows.""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Comment means take a view, and back it. There are three jobs.
          Name the policies. Show why the benefit stalls. Then weigh it, with the Court's answer.""",
          "Question X-ray: 'Comment' highlighted; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the frame. Articles fifteen and sixteen let the State make special provision. Article forty-six is the directive.
          Central posts carry fifteen, seven and a half, and twenty-seven per cent quotas.""",
          "Cartoon scales with three quota bars; Article cards slide in (no party symbols).",
          ["POL03-B05", "POL03-B09", "POL03-C18", "2024-GS1-18-21"]),
        T("b03", "but", "idea",
          """But in aggregate, the quotas are met. Scheduled Castes and Tribes met fifteen and seven and a half per cent in twenty twenty-four.
          Look at rank, though. In Group A, Scheduled Castes hold fourteen point two per cent. Scheduled Tribes hold six point five four.""",
          "A staircase of ranks; the Group A step shows a bar just short of the quota line.",
          ["2024-GS1-18-04", "2024-GS1-18-20"]),
        T("b04", "therefore", "idea",
          """So the gap is about stock and spread, not only the total. Backlog posts did not fall between twenty sixteen and twenty nineteen.
          And the Court's judges differ on creamy layer for Scheduled Castes and Tribes.""",
          "Backlog counter for the ten Ministries; a split bench of judges (plant for the close).",
          ["2024-GS1-18-03", "2024-GS1-18-13"]),
        T("b05", "but", "idea",
          """But in twenty twenty-four, in Davinder Singh, seven judges answered part of this. By six to one, States may sub-classify Scheduled Castes.
          They need data showing inadequate representation. The question's gap now has a legal test.""",
          "The judgment as a quote card; a ruler marks 'data on inadequate representation'.",
          ["POL03-C15", "2024-GS1-18-09"]),
        T("b06", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Open with the Articles and the quotas. Then say that records still show gaps.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["POL03-B05", "POL03-B09", "2024-GS1-18-21"]),
        T("b07", "therefore", "sheet",
          """Section one gives the reasons, each with a source. Backlog. Rank. Creamy layer. Spread within groups. Education.
          Every point carries a figure or a case.""",
          "Section 1 writes in; the Group A bar chart Fig. 1 draws; box D2 fills.",
          ["2024-GS1-18-03", "2024-GS1-18-20", "2024-GS1-18-05", "2024-GS1-18-12", "2024-GS1-18-15"]),
        T("b08", "therefore", "sheet",
          """Section two is the Court's answer. Sub-classification is allowed, but only on data. Article three thirty-five is no bar.
          Backlog drives filled over four point eight lakh posts since twenty sixteen.""",
          "Section 2 writes in; box D3 starts to fill.",
          ["POL03-C15", "2024-GS1-18-09", "2024-GS1-18-10", "2024-GS1-18-22"]),
        T("b09", "therefore", "sheet",
          """Close with a balanced verdict. Policy exists and aggregate quotas are met. But stock, spread and access lag.
          The way forward is data. That is the view the question asks for.""",
          "The close writes in; all three boxes D1 to D3 tick.",
          ["2024-GS1-18-04", "2024-GS1-18-09"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It says all backward people benefit equally. The Court records that they do not.
          It says Scheduled Castes and Tribes are below quota overall. The gap is by rank.
          It says creamy layer applies to them. The order is silent, and judges differ. And it names no case.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["POL03-C15", "2024-GS1-18-04", "2024-GS1-18-20", "2024-GS1-18-13"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty twenty-one asked about the Right to Equality.
          Twenty seventeen asked about the scope of Fundamental Rights.
          Learn the Articles once. The full story gets its own episode in our Polity series.""",
          "The three boxes tick; three cousin question cards slide in; a 'coming in the Polity series' card for POL-03.",
          ["POL03-B05"]),
    ],
    story=dict(
        promise="Policies exist, quotas are met in total, so why do the underprivileged still miss the full benefit, and how do you comment on that in 250 words?",
        arc="evidence-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you comment on this, with a view, in 250 words?", open="b00", close="b11"),
            dict(id="L2", kind="secondary", q="If quotas are met, where is the gap?", open="b00", close="b04"),
            dict(id="L3", kind="tertiary", q="Has the Court said anything on the gap?", open="b04", close="b05"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b06", close="b10"),
        ],
        turn="b03",
        plants=[("b01", "b11"), ("b04", "b05")],
        critical=[
            dict(what="Group A shares as on 1 Jan 2024", src="DoPT Annual Report 2024-25, para 4.8 (2024-GS1-18-20)"),
            dict(what="Davinder Singh holding and para 205(f)", src="State of Punjab v Davinder Singh (1 Aug 2024) (POL03-C15)"),
        ],
        fallback="If the Group A comparison failed review: drop it and answer from the backlog table and the Court's holding alone.",
        tier="broad",
    ),
)
