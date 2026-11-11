"""Format A (One Question): UPSC CSE (Main) 2026, General Studies Paper II, Q1. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the POL-03 ledger (research/upsc/POL-03/claims.csv) and this answer's ledger (research/upsc/pyq/2026-gs2-1/claims.csv).
Law and record only: no view on any party or government. No court has ruled on the 2026 Act; the Puttaswamy test is applied as our analysis.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2026-GS2-1",
    fmt="A",
    title="Privacy, Self-Identity and the 2026 Transgender Act Amendment (UPSC GS II 2026)",
    question=dict(year=2026, paper="gs2", label="General Studies Paper II", q=1, part="", marks=10,
                  text="Right to privacy relating to self-identity is very dear to every human being and well protected under Article 21 "
                       "of the Constitution. In this context, examine the effect of the amendment in 2026, to the Transgender Persons "
                       "(Protection of Rights) Act, 2019.",
                  pdf="research/upsc/_pyq/mains/2026_gs2.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="UPSC's printed limit is 150 words; 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["POL-03", "pyq/2026-gs2-1"],
    demands=[
        dict(id="D1", text="The premise: privacy and self-identity under Article 21"),
        dict(id="D2", text="What the 2026 amendment changed"),
        dict(id="D3", text="Examine its effect on that right, tested against Puttaswamy", view=True),
    ],
    sheet=[
        S("intro", """_NALSA_ (2014) and _Puttaswamy_ (2017) place privacy and self-identity within Article 21.""",
          ["D1"], ["POL03-D08", "POL03-D12", "2026-GS2-1-16", "2026-GS2-1-17"]),
        S("head", "1. What the Act changed", ["D2"], ["2026-GS2-1-05"]),
        S("points", """• Act 3 of 2026, in force 25 May 2026, omits s.4(2): the statutory right to _self-perceived gender identity_.
          • A closed definition; its proviso excludes 'self-perceived sexual identities'.
          • A _medical board_ must recommend before the District Magistrate issues a certificate.
          • New penalties for forcing a transgender identity.""",
          ["D2"], ["2026-GS2-1-01", "2026-GS2-1-03", "2026-GS2-1-04", "2026-GS2-1-05", "2026-GS2-1-08", "2026-GS2-1-10", "2026-GS2-1-14"]),
        S("head", "2. Tested against Puttaswamy", ["D3"], ["2026-GS2-1-18"]),
        S("points", """• The test: _legality, need, proportionality_ (Chandrachud J.).
          • NALSA called self-identity a fundamental value; a board's recommendation replaces self-perception.
          • Puttaswamy called LGBT rights 'real rights'; the proviso is where that reasoning would be tested.
          • No court has yet ruled on the Act.""",
          ["D3"], ["2026-GS2-1-18", "2026-GS2-1-17", "2026-GS2-1-20", "2026-GS2-1-10"]),
        S("close", """So the Act narrows self-identity in statute; whether that passes the _proportionality_ test awaits the courts.""",
          ["D1", "D3"], ["2026-GS2-1-18"]),
    ],
    weak=[
        dict(text="The 2026 Act keeps the right to self-perceived gender identity in section 4(2).", miss="section 3 of the 2026 Act omits s.4(2)", claims=["2026-GS2-1-05", "2026-GS2-1-04"]),
        dict(text="The Act took effect on 30 March 2026, the day of assent.", miss="s.1(2) waits for a notification; it began on 25 May 2026", claims=["2026-GS2-1-01", "2026-GS2-1-03"]),
        dict(text="The Supreme Court has struck the amendment down.", miss="no court ruling on its validity is in the record we read", claims=["2026-GS2-1-05"]),
        dict(text="Article 21 does not cover self-identity.", miss="NALSA, quoted in Puttaswamy, ties self-identity to privacy and autonomy", claims=["2026-GS2-1-17", "POL03-D08"]),
        dict(text="(no mention of the three-fold test)", miss="the question asks for the effect on a right; Puttaswamy's test is the yardstick", claims=["2026-GS2-1-18"]),
    ],
    cousins=["2017 PSIR Paper I Q5(b): right to privacy is an intrinsic part of the right to life",
             "2023 GS II Q12: constitutional perspectives of gender justice, with case laws",
             "2026 GS II Q2: the evolution of women's constitutional position, as a class"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-six. General Studies Paper Two, ten marks, a hundred and fifty words.
          Privacy and self-identity sit under Article twenty-one. Examine what the twenty twenty-six amendment did to the Transgender Persons Act.
          Here is the catch. The Act once gave a right to self-perceived identity. Did it survive?""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2026, GS Paper II, Q1'.
          The words 'self-identity' glow faintly (plant).""",
          ["2026-GS2-1-04"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Examine means weigh the effect and take a balanced view.
          There are three jobs. Set out the premise. Say what changed. Then test the effect against the right.""",
          "Question X-ray: 'examine' highlighted; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the premise. In twenty fourteen, in NALSA, the Supreme Court upheld a person's right to decide their own gender.
          In twenty seventeen, Puttaswamy quoted NALSA. Privacy, self-identity and autonomy are fundamental values.""",
          "Two judgment cards, 2014 and 2017, linked by a quote line; Article 21 text underneath.",
          ["2026-GS2-1-16", "2026-GS2-1-17", "POL03-D12"]),
        T("b03", "therefore", "idea",
          """Puttaswamy also gave a yardstick. A law that invades privacy must pass three tests.
          Legality, a legitimate aim, and proportionality. Privacy is not absolute, but limits must be earned.""",
          "Three gates in a row labelled legality, need, proportionality (plant: reused in the verdict).",
          ["2026-GS2-1-18", "POL03-D13"]),
        T("b04", "but", "idea",
          """But the twenty-nineteen Act went further. Section four, sub-section two gave a right to self-perceived gender identity.
          The twenty twenty-six Act, in section three, omits that sub-section. In force from the twenty-fifth of May.""",
          "Two Act texts side by side; s.4(2) struck through on the 2026 side (pay-off of the plant).",
          ["2026-GS2-1-04", "2026-GS2-1-05", "2026-GS2-1-03"]),
        T("b05", "therefore", "idea",
          """So identity now runs through a process. A medical board must recommend before the District Magistrate issues a certificate.
          The definition is a closed list. Its proviso excludes self-perceived sexual identities. The Act also adds heavier penalties for forcing a transgender identity.""",
          "A flow card: person, medical board, District Magistrate, certificate; the new penalties as a side card.",
          ["2026-GS2-1-10", "2026-GS2-1-09", "2026-GS2-1-08", "2026-GS2-1-14"]),
        T("b06", "therefore", "sheet",
          """Now we write. A hundred and fifty words, about seven minutes.
          Open with the two judgments in one line. That sets the premise.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["2026-GS2-1-16", "POL03-D12"]),
        T("b07", "therefore", "sheet",
          """Section one is what changed. Four short points. The omitted sub-section, the closed definition, the medical board, and the new penalties.""",
          "Section 1 writes in; box D2 fills.",
          ["2026-GS2-1-05", "2026-GS2-1-08", "2026-GS2-1-10", "2026-GS2-1-14"]),
        T("b08", "therefore", "sheet",
          """Section two applies the three tests. Be careful with the last point. No court has ruled on this Act.
          So the verdict is a reasoned view, not a holding. It says the question awaits the courts.""",
          "Section 2 writes in; the close writes in; box D3 fills.",
          ["2026-GS2-1-18", "2026-GS2-1-20", "2026-GS2-1-17"]),
        T("b09", "but", "compare",
          """Now the easy answer beside it. It says self-perceived identity stays in section four. It does not.
          It says the Act began on assent. It began on a notified date. It says the Court struck it down. The record shows no ruling.
          And it never names the three-fold test.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2026-GS2-1-05", "2026-GS2-1-03", "2026-GS2-1-18"]),
        T("b10", "therefore", "cousins",
          """Here is the payoff. This one answer serves its cousins. Twenty seventeen asked about privacy as part of the right to life.
          Twenty twenty-three asked about gender justice. Learn the premise once.""",
          "The three boxes tick; three cousin question cards slide in.",
          ["POL03-D12"]),
    ],
    story=dict(
        promise="Does the 2026 amendment cut the right to self-identity that Article 21 protects, and how do you answer that in 150 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this, and prove it, in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Did the right to self-perceived identity survive the amendment?", open="b00", close="b04"),
            dict(id="L3", kind="tertiary", q="What is the yardstick for judging the effect?", open="b03", close="b08"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b08"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b06", close="b09"),
        ],
        turn="b04",
        plants=[("b00", "b04"), ("b01", "b10")],
        critical=[
            dict(what="Section 3 of the 2026 Act omits s.4(2) of the 2019 Act", src="Gazette of India, 30 Mar 2026, egazette.gov.in (2026-GS2-1-05)"),
            dict(what="Commencement on 25 May 2026", src="S.O. 2620(E), egazette.gov.in (2026-GS2-1-03)"),
        ],
        fallback="If the commencement date failed review: say the Act came into force on a notified date after assent, with no day named.",
        tier="broad",
    ),
)
