"""One Question, format A: UPSC CSE (Main) 2021, PSIR optional Paper I, Q5(e). Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2021-psir1-5e/claims.csv). Links between a case and the Act are our inference
unless the Act or a Court says so. Kameshwar Singh was not read at the Court's copy and is not cited. People are named by office.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


P = "2021-PSIR1-5E-"
A = dict(
    id="PYQ-2021-PSIR1-5E",
    fmt="A",
    title="The First Amendment: A 150-Word Answer for PSIR Optional",
    question=dict(year=2021, paper="psir1", label="PSIR optional Paper I", q=5, part="e", marks=10,
                  text="Underline the significance of the first constitutional amendment.",
                  pdf="research/upsc/_pyq/mains/2021_psir1.pdf", page=3),
    budget=(120, 150),
    minutes=7,
    budget_note="the bank lists 150 words for this question; 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["pyq/2021-psir1-5e"],
    demands=[
        dict(id="D1", text="Say what the First Amendment changed (and why it was passed)"),
        dict(id="D2", text="Underline its significance (the case it answered, its test in court, its later course)"),
    ],
    sheet=[
        S("intro", """Act of 18 June 1951. Its Statement of Objects: court rulings raised difficulties on _fundamental rights_.""",
          ["D1"], [P + "01", P + "02"]),
        S("head", "1. What it changed", ["D1"], [P + "04", P + "07", P + "08"]),
        S("points", """• _Article 19(2)_: public order added (old clause narrower), with retrospective effect.
          • _Article 15(4)_: backward classes.
          • Articles 31A, 31B and the _Ninth Schedule_ (13 entries) shielded land reform.""",
          ["D1"], [P + "04", P + "07", P + "08"]),
        S("head", "2. Why it mattered", ["D2"], [P + "05", P + "12", P + "13", P + "14"]),
        S("points", """• _Romesh Thappar_ (1950): a public-order law fell outside Art 19(2); the new ground, a likely reply (our inference).
          • _Champakam Dorairajan_ (9 Apr 1951): communal seat order void under Art 29(2); Art 15(4), overriding 29(2), reads as the reply (our inference; SOR names no case).
          • _Shankari Prasad_ (1951): Act upheld; Provisional Parliament could amend under Art 368.
          • _Coelho_ (2007, nine judges): Ninth Schedule laws from 24 April 1973 open to basic-structure challenge.""",
          ["D2"], [P + "05", P + "07", P + "11", P + "12", P + "13", P + "14"]),
        S("close", """Our reading: it began the contest over amending power; Coelho reaches laws added from 24 April 1973, not the 1951 entries.""",
          ["D2"], [P + "13", P + "14"]),
    ],
    weak=[
        dict(text="The SOR names Romesh Thappar as the reason.", miss="the Statement of Objects names no case; the link is our inference",
             claims=[P + "03", P + "12"]),
        dict(text="Lists amendments to Articles and stops.", miss="the question underlines significance: the case, the court test, the later course",
             claims=[P + "13"]),
        dict(text="The Ninth Schedule is beyond all review.", miss="Coelho: laws after 24 April 1973 can be challenged on the basic structure",
             claims=[P + "14"]),
        dict(text="Article 19(2) already had public order.", miss="as the Court quoted it, the old clause was narrower",
             claims=[P + "05"]),
    ],
    cousins=["2021 PSIR Paper I Q5(a): the Constitution of India as a product of a historical process (comment)"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-one. PSIR optional, Paper One, ten marks, one hundred and fifty words.
          Underline the significance of the first constitutional amendment.
          Here is the catch. The Statement of Objects does not name the case people link to it.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2021, PSIR Paper I, Q5(e)'.
          The word 'significance' glows faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Underline means pick out what mattered most.
          So there are two jobs. What did the Act change? And why did it matter?""",
          "Question X-ray: 'underline' and 'significance' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the Act. It is dated eighteenth June nineteen fifty-one.
          Its Statement of Objects speaks of the last fifteen months. Court rulings, it says, had raised difficulties on fundamental rights.""",
          "A calendar page, 18 June 1951; a card quoting the Statement of Objects.",
          [P + "01", P + "02"]),
        T("b03", "therefore", "idea",
          """Then what changed. Article nineteen two got added grounds for limiting speech, with effect from the start.
          Article fifteen four allowed special provision for backward classes.
          Articles thirty-one A and B, and the Ninth Schedule, shielded land reform laws.""",
          "Three cards: a speech bubble with a fence, a ladder, a land deed under a shield.",
          [P + "04", P + "07", P + "08"]),
        T("b04", "but", "idea",
          """But now the catch. The case is often linked to the Act. The Statement of Objects names no case.
          The link is our inference. Write it as ours.""",
          "A Statement of Objects card with no case name; a stamp 'our inference' appears (pay-off of the plant).",
          [P + "03", P + "12"]),
        T("b05", "therefore", "idea",
          """Here is why it fits. In nineteen fifty, the Court struck down a public-order law. The Court held public order sat outside Article nineteen two then.
          The Act then added it. The old clause was narrower, as the Court quoted it.""",
          "Two versions of Article 19(2) side by side; 'public order' slides in.",
          [P + "05", P + "12"]),
        T("b06", "therefore", "idea",
          """Then the test. In nineteen fifty-one, Shankari Prasad upheld the Act.
          The Provisional Parliament could amend under Article three sixty-eight. Later came Coelho, in two thousand seven. Ninth Schedule laws put in from twenty-fourth April nineteen seventy-three can be challenged.""",
          "A gavel on the Act; a timeline arrow from 1951 to 2007.",
          [P + "13", P + "14"]),
        T("b07", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open with the date, and the reason in the Statement of Objects.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          [P + "01", P + "02"]),
        T("b08", "therefore", "sheet",
          """Section one is what changed. Three bullets: speech, backward classes, land reform.""",
          "Section 1 writes in with Article 19(2) and the Ninth Schedule underlined.",
          [P + "04", P + "07", P + "08"]),
        T("b09", "therefore", "sheet",
          """Section two is why it mattered. Thappar, flagged as inference. Shankari Prasad. Coelho.
          End with one line: the contest over the amending power began here.""",
          "Section 2 writes in; box D2 fills; the conclusion follows; word counter near 150.",
          [P + "05", P + "12", P + "13", P + "14"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It says the Statement of Objects named Thappar. It lists Articles and stops.
          It says the Ninth Schedule is beyond review. Both took seven minutes. Only one separated fact from inference.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          [P + "03", P + "12", P + "14"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousin. Twenty twenty-one also asked for the Constitution's historical roots.
          Learn it once: what changed, what fits, what the Court said.""",
          "The two boxes tick; one cousin question card slides in.",
          []),
    ],
    story=dict(
        promise="What do you write on the First Amendment in 150 words, and which link must you mark as your own inference?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Does the Statement of Objects name a case?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="Could Parliament amend rights?", open="b06", close="b09"),
        ],
        turn="b04",
        plants=[("b00", "b04"), ("b01", "b11")],
        critical=[
            dict(what="Act dated 18 June 1951; Statement of Objects 10 May 1951", src="Legislative Department (2021-PSIR1-5E-01)"),
            dict(what="Shankari Prasad upheld the Act", src="Supreme Court's own copy (2021-PSIR1-5E-13)"),
        ],
        fallback="If a case line failed review: keep the Act's own changes and the Statement of Objects only.",
        tier="broad",
    ),
)
