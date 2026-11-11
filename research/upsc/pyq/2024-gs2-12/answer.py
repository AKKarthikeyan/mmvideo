"""Format A (One Question): UPSC CSE (Main) 2024, General Studies Paper II, Q12. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the POL-03 ledger (research/upsc/POL-03/claims.csv) and this answer's ledger (research/upsc/pyq/2024-gs2-12/claims.csv).
Limit stated, not filled: no Supreme Court judgment was found on a DNA test of a child in the womb to prove paternity (2024-GS2-12-18, NOT FOUND).
Rows -17 (Nikhat Parveen, 2026) is UNVERIFIED and not used. The paternity cases are read through the Court's own quotations in Firodia (2023).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2024-GS2-12",
    fmt="A",
    title="Privacy, Article 21 and the DNA Paternity Test (UPSC GS II 2024)",
    question=dict(year=2024, paper="gs2", label="General Studies Paper II", q=12, part="", marks=15,
                  text="Right to privacy is intrinsic to life and personal liberty and is inherently protected under Article 21 of the "
                       "constitution. Explain. In this reference discuss the law relating to D.N.A. testing of child in the womb to "
                       "establish its paternity.",
                  pdf="research/upsc/_pyq/mains/2024_gs2.pdf", page=3),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words; 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["POL-03", "pyq/2024-gs2-12"],
    demands=[
        dict(id="D1", text="Explain why privacy is intrinsic to life and liberty under Article 21"),
        dict(id="D2", text="The law on DNA testing to establish paternity"),
        dict(id="D3", text="The child, and the child in the womb: privacy and the pre-natal limit (a part with no case law yet)"),
    ],
    sheet=[
        S("intro", """_Puttaswamy_ (2017) held privacy an intrinsic part of life and liberty under Article 21; a paternity test
          tests that right against a court's search for truth.""",
          ["D1"], ["POL03-D12", "2024-GS2-12-01"]),
        S("head", "1. Privacy within Article 21", ["D1"], ["2024-GS2-12-01"]),
        S("points", """• Nine judges (2017): privacy is protected under Article 21 and Part III, though the word is not in the
          Constitution. • _Dignity_: 'the constitutional core of human dignity'; it covers family life and procreation.
          • Not absolute: _legality, need, proportionality_.""",
          ["D1"], ["POL03-D12", "POL03-L05", "2024-GS2-12-02", "2024-GS2-12-03", "2024-GS2-12-04"]),
        S("head", "2. DNA test to prove paternity", ["D2"], ["2024-GS2-12-06"]),
        S("points", """• Section 112, Evidence Act (now s.116, BSA 2023): birth in marriage is _conclusive proof_ of legitimacy
          unless non-access. • Courts allow a test only on 'eminent need' and a strong prima facie case (_Bhabani Prasad Jena_,
          _Goutam Kundu_); never exploratory. • _Sharda v Dharmpal_: a test is not per se against Article 21, but not mechanical.
          • _Dipanwita Roy_: allowed on a specific non-access plea; refusal may draw an adverse inference, which is discretionary.""",
          ["D2"], ["2024-GS2-12-06", "2024-GS2-12-15", "2024-GS2-12-07", "2024-GS2-12-08", "2024-GS2-12-10", "2024-GS2-12-09", "2024-GS2-12-11", "2024-GS2-12-14", "POL03-D08"]),
        S("diagram", """A flow: presumption, then a strong prima facie case, then eminent need weighed against the child's privacy,
          then an order, or a refusal.""",
          ["D2"], ["2024-GS2-12-06", "2024-GS2-12-08", "2024-GS2-12-10"], label="Fig. 1: When a court orders a paternity test",
          items=[dict(when="Presumption", what="s.112: conclusive proof of legitimacy"), dict(when="Non-access", what="a strong prima facie case"),
                 dict(when="Eminent need", what="weighed against the child's privacy"), dict(when="Order or refusal", what="never exploratory")]),
        S("head", "3. The child and the womb", ["D3"], ["2024-GS2-12-12"]),
        S("points", """• _Firodia_ (2023) refused a test of the child: legitimacy is 'an essential attribute of the right to privacy';
          'the child cannot be used as a pawn'. • PC-PNDT Act, s.4(2): pre-natal tests only for listed conditions; paternity is
          not one. • We found no Supreme Court ruling on a foetal paternity test; these rules apply by analogy.""",
          ["D3"], ["2024-GS2-12-05", "2024-GS2-12-12", "2024-GS2-12-13", "2024-GS2-12-16"]),
        S("close", """So privacy shields the child from casual tests; a court orders one only on eminent need, and the womb limb has no ruling we could find.""",
          ["D1", "D2", "D3"], ["2024-GS2-12-08"]),
    ],
    weak=[
        dict(text="A husband can get a DNA test of the child whenever he doubts paternity.", miss="courts refuse a test on a mere asking; eminent need and a prima facie case are needed", claims=["2024-GS2-12-10", "2024-GS2-12-08"]),
        dict(text="The section 112 presumption falls once a DNA test is sought.", miss="birth in marriage is conclusive proof unless non-access is shown", claims=["2024-GS2-12-06"]),
        dict(text="Pre-natal DNA tests are allowed to settle paternity.", miss="PC-PNDT s.4(2) lists the permitted purposes; paternity is not one", claims=["2024-GS2-12-16"]),
        dict(text="Privacy is an absolute right under Article 21.", miss="it must pass legality, need and proportionality", claims=["2024-GS2-12-04", "POL03-D08"]),
        dict(text="Privacy is written in Article 21.", miss="the word 'privacy' appears nowhere in the Constitution", claims=["POL03-L05", "POL03-D08"]),
    ],
    cousins=["2017 GS II Q12: the scope of Fundamental Rights in the light of the privacy judgment",
             "2017 PSIR Paper I Q5(b): right to privacy is an intrinsic part of the right to life",
             "2026 GS II Q1: privacy and self-identity, and the 2026 amendment to the Transgender Persons Act"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-four. General Studies Paper Two, fifteen marks, two hundred and fifty words.
          Explain why privacy sits under Article twenty-one. Then discuss the law on a DNA test of a child in the womb, to prove paternity.
          Here is the strange part. We found no Supreme Court ruling on that second half.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2024, GS Paper II, Q12'.
          The words 'child in the womb' glow faintly (plant).""",
          ["POL03-D12"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Explain, then discuss. That is three jobs.
          Show why privacy sits in Article twenty-one. Give the law on paternity tests. Then deal with the child, and the womb.""",
          "Question X-ray: 'explain' and 'discuss' highlighted; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the right. The word privacy is nowhere in the Constitution.
          In twenty seventeen, nine judges found it inside Article twenty-one. It is the core of human dignity.""",
          "A Constitution page searched for 'privacy': zero hits; then nine judges lift the word into Article 21.",
          ["POL03-L05", "POL03-D12", "2024-GS2-12-02"]),
        T("b03", "but", "idea",
          """But the right is not absolute. A law must pass three tests.
          Legality, a legitimate aim, and proportionality. A court's order for a DNA test must pass the same kind of weighing.""",
          "Three gates labelled legality, need, proportionality.",
          ["2024-GS2-12-04"]),
        T("b04", "therefore", "idea",
          """Now paternity. Section one-twelve of the Evidence Act says a child born in marriage is conclusively legitimate.
          Only proof of no access breaks it. The Bharatiya Sakshya Adhiniyam repeats it, in section one-sixteen.""",
          "The Act section as a card; a married-couple icon and a 280-day band; non-access as the only exit.",
          ["2024-GS2-12-06", "2024-GS2-12-15"]),
        T("b05", "therefore", "idea",
          """So courts are careful. In Goutam Kundu, no test as a matter of course. In Bhabani Prasad Jena, only on eminent need.
          In Dipanwita Roy, a test was allowed on a specific plea. And Firodia, in twenty twenty-three, refused it for a child.""",
          "Four case cards in a row; the last one carries a stop sign.",
          ["2024-GS2-12-07", "2024-GS2-12-08", "2024-GS2-12-11", "2024-GS2-12-05"]),
        T("b06", "but", "idea",
          """But all these cases concern a child already born. For the womb, the nearest law is the PC-PNDT Act.
          Section four allows pre-natal tests only for listed conditions. Paternity is not among them.""",
          "A womb icon; the PC-PNDT list of permitted purposes with 'paternity' absent (pay-off of the plant).",
          ["2024-GS2-12-16"]),
        T("b07", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Open with Puttaswamy and the clash it sets up. That one line frames the whole answer.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["POL03-D12"]),
        T("b08", "therefore", "sheet",
          """Section one is the right: nine judges, dignity, and the three tests.
          Section two is the law on tests. Four cases and the section one-twelve presumption.""",
          "Sections 1 and 2 write in; the flow Fig. 1 draws; box D2 fills.",
          ["2024-GS2-12-02", "2024-GS2-12-04", "2024-GS2-12-06", "2024-GS2-12-08"]),
        T("b09", "therefore", "sheet",
          """Section three is the child. Use Firodia: legitimacy is part of a child's privacy. The child cannot be used as a pawn.
          Then state the limit honestly. We found no Supreme Court ruling on a foetal paternity test.""",
          "Section 3 writes in; the close writes in; box D3 fills.",
          ["2024-GS2-12-12", "2024-GS2-12-13", "2024-GS2-12-16"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It says a husband can get a test whenever he doubts. Courts refuse that.
          It says pre-natal tests can settle paternity. The PC-PNDT Act does not allow that. It says privacy is absolute. It is not.
          And it says privacy is written in Article twenty-one. The word is not there.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2024-GS2-12-10", "2024-GS2-12-16", "2024-GS2-12-04", "POL03-L05"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. This answer serves its cousins. Twenty seventeen asked about the scope of Fundamental Rights after the privacy case.
          Twenty twenty-six asked about privacy and self-identity. Learn the three tests once.""",
          "The boxes tick; three cousin question cards slide in.",
          ["POL03-D13"]),
    ],
    story=dict(
        promise="What does the law say about a DNA test of a child in the womb, and how do you answer it in 250 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this, and prove it, in 250 words?", open="b00", close="b11"),
            dict(id="L2", kind="secondary", q="Is there a Supreme Court ruling on the child in the womb?", open="b00", close="b09"),
            dict(id="L3", kind="tertiary", q="Where is the word privacy in the Constitution?", open="b02", close="b10"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b07", close="b10"),
        ],
        turn="b06",
        plants=[("b00", "b06"), ("b01", "b11")],
        critical=[
            dict(what="Firodia (2023) on the child's privacy and on the paternity-test cases", src="Supreme Court judgment, 20 Feb 2023 (2024-GS2-12-05, -12)"),
            dict(what="PC-PNDT Act s.4(2) list of permitted purposes", src="India Code (2024-GS2-12-16)"),
        ],
        fallback="If the PC-PNDT reading failed review: end on the born-child rules and state plainly that no ruling covers the womb.",
        tier="broad",
    ),
)
