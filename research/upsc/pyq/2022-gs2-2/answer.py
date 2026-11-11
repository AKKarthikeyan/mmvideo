"""One Question, format A: UPSC CSE (Main) 2022, General Studies Paper II, Q2. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the POL-03 ledger (research/upsc/POL-03/claims.csv) and this answer's ledger (research/upsc/pyq/2022-gs2-2/claims.csv).
Law and record only. The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2022-GS2-2",
    fmt="A",
    title="Free to Move, But Not Absolute (UPSC GS II 2022)",
    question=dict(year=2022, paper="gs2", label="General Studies Paper II", q=2, part="", marks=10,
                  text="“Right of movement and residence throughout the territory of India are freely available to the Indian citizens, "
                       "but these rights are not absolute.” Comment.",
                  pdf="research/upsc/_pyq/mains/2022_gs2.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="UPSC's printed limit is 150 words; 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["POL-03", "pyq/2022-gs2-2"],
    demands=[
        dict(id="D1", text="The rights are free, and only for citizens"),
        dict(id="D2", text="Why they are not absolute: the limits the Constitution itself sets"),
        dict(id="D3", text="Comment: what the courts held, and the verdict", view=True),
    ],
    sheet=[
        S("intro", """Article 19(1)(d) and (e) give citizens, not foreigners, free movement and residence in India.""",
          ["D1"], ["2022-GS2-2-01", "POL03-A11"]),
        S("head", "1. The Constitution's limits", ["D2"], ["2022-GS2-2-02"]),
        S("points", """• _Article 19(5)_: reasonable restrictions in the general public interest or to protect any Scheduled Tribe.
          • _Emergency_: Article 358 suspends Article 19 during a war or external-aggression Emergency.
          • Residence: Article 16(3) lets Parliament require it for some posts.""",
          ["D2"], ["2022-GS2-2-02", "2022-GS2-2-03", "2022-GS2-2-04"]),
        S("head", "2. What the courts held", ["D3"], ["2022-GS2-2-05"]),
        S("points", """• _Gurbachan Singh_ (1952): externment upheld as a reasonable restriction.
          • _Ebrahim Vazir Mavat_ (1954): removing a citizen violated Article 19(1)(e).
          • _Anuradha Bhasin_ (2020): section 144 orders must be necessary and reasoned.
          • _Maneka Gandhi_ (1978): these freedoms 'are not and cannot be absolute'. • _Amit Sahni_ (2020): a protest cannot block public ways indefinitely.""",
          ["D3"], ["2022-GS2-2-05", "2022-GS2-2-07", "2022-GS2-2-11", "2022-GS2-2-10", "2022-GS2-2-12"]),
        S("close", """So the rights are fundamental yet conditional: a restriction must be by law and reasonable.""",
          ["D3"], ["2022-GS2-2-02", "2022-GS2-2-05"]),
    ],
    weak=[
        dict(text="Article 19 rights belong to every person in India, including foreigners.", miss="Article 19 says 'All citizens'", claims=["POL03-A11", "POL03-L10"]),
        dict(text="Article 19(5) lets the police stop anyone's movement at will.", miss="a restriction must be by law, reasonable and on two named grounds", claims=["2022-GS2-2-02"]),
        dict(text="Externment was struck down in Gurbachan Singh.", miss="the Court upheld it as reasonable", claims=["2022-GS2-2-05"]),
        dict(text="(no case named)", miss="no named source for 'not absolute'", claims=["2022-GS2-2-11"]),
    ],
    cousins=["2017 GS II Q12: scope of Fundamental Rights in the light of the Supreme Court's latest privacy judgement",
             "2021 GS II Q13: distinguishing features of the Right to Equality in the USA and India",
             "2023 GS II Q12: constitutional perspectives of Gender Justice, with provisions and case laws"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-two. General Studies Paper Two, ten marks, one hundred and fifty words.
          Movement and residence are free for citizens, but not absolute. Comment.
          Here's the strange part. The Constitution itself says so, in one clause.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2022, GS Paper II, Q2'. The words 'not absolute' glow (plant).""",
          ["2022-GS2-2-02"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Comment means give a view, and back it. There are three jobs.
          Show the right is free, for citizens. Show its limits. Then give a verdict with cases.""",
          "Question X-ray: 'Comment' highlighted; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the right. Article nineteen, one, d and e, gives citizens free movement and residence.
          Article nineteen says all citizens. So foreigners cannot claim it.""",
          "A map of India with an open road; a 'citizens' badge on Article 19.",
          ["2022-GS2-2-01", "POL03-A11"]),
        T("b03", "but", "idea",
          """But Article nineteen, five, makes it conditional. A law may impose reasonable restrictions.
          Two grounds are named: the general public interest, and Scheduled Tribe interests.""",
          "The clause 19(5) as a paper card; the two grounds light up (plant pays off).",
          ["2022-GS2-2-02"]),
        T("b04", "but", "idea",
          """But courts watch the word reasonable. In nineteen fifty-two, Gurbachan Singh upheld externment.
          In nineteen fifty-four, Ebrahim Vazir Mavat did not allow a citizen's removal. The test is reasonableness.""",
          "Two judgment cards, one with a green tick, one with a red cross; a scale of 'reasonable'.",
          ["2022-GS2-2-05", "2022-GS2-2-07"]),
        T("b05", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open with the right and who holds it. One line.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["2022-GS2-2-01", "POL03-A11"]),
        T("b06", "therefore", "sheet",
          """Section one is the limits. Article nineteen five. Article three fifty-eight in an Emergency.
          And Article sixteen three on residence for some posts.""",
          "Section 1 writes in; box D2 fills.",
          ["2022-GS2-2-02", "2022-GS2-2-03", "2022-GS2-2-04"]),
        T("b07", "therefore", "sheet",
          """Section two is the cases. Gurbachan Singh. Ebrahim Vazir Mavat. Anuradha Bhasin, in twenty twenty, on section one forty-four.
          Each has a year and a holding.""",
          "Section 2 writes in; three case cards stack; box D3 starts to fill.",
          ["2022-GS2-2-05", "2022-GS2-2-07", "2022-GS2-2-11"]),
        T("b08", "therefore", "sheet",
          """Close with the verdict. The rights are fundamental yet conditional. A restriction must be by law and reasonable.
          That is the view the question asks for.""",
          "The close writes in; all three boxes D1 to D3 tick.",
          ["2022-GS2-2-02", "2022-GS2-2-05"]),
        T("b09", "but", "compare",
          """Now the easy answer beside it. It says Article nineteen belongs to every person. It says all citizens.
          It says police can stop anyone at will. It says Gurbachan Singh struck externment down. And it names no case.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["POL03-A11", "2022-GS2-2-02", "2022-GS2-2-05"]),
        T("b10", "therefore", "cousins",
          """Here is the payoff. This frame answers its cousins. Twenty seventeen asked about the scope of Fundamental Rights.
          Twenty twenty-one asked about the Right to Equality.
          Learn the clause once. The full story gets its own episode in our Polity series.""",
          "The three boxes tick; three cousin question cards slide in; a 'coming in the Polity series' card for POL-03.",
          ["POL03-A11"]),
    ],
    story=dict(
        promise="The right to move is free, yet not absolute, so how do you prove that with cases in 150 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you comment on this, with a view, in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Where does the Constitution say it is not absolute?", open="b00", close="b03"),
            dict(id="L3", kind="tertiary", q="Do courts accept every restriction?", open="b03", close="b04"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b08"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b05", close="b09"),
        ],
        turn="b04",
        plants=[("b00", "b03"), ("b01", "b10")],
        critical=[
            dict(what="Article 19(5) wording", src="Constitution as on 10 Sep 2026 (2022-GS2-2-02)"),
            dict(what="Gurbachan Singh and Ebrahim Vazir Mavat holdings", src="Indian Kanoon mirrors of the Court's judgments (2022-GS2-2-05, -07)"),
        ],
        fallback="If a case holding failed review: answer from Article 19(5) and Article 358 alone.",
        tier="broad",
    ),
)
