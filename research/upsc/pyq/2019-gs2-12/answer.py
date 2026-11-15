"""Pilot 2, format A (One Question): UPSC CSE (Main) 2019, General Studies Paper II, Q12. Draft 1, 7 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the POL-06 ledger (research/upsc/POL-06/claims.csv) and the answer-video ledger (research/upsc/pyq/claims.csv).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2019-GS2-12",
    fmt="A",
    title="Can Parliament Amend Its Way Past the Basic Structure? (UPSC GS II 2019)",
    question=dict(year=2019, paper="gs2", label="General Studies Paper II", q=12, part="", marks=15,
                  text="“Parliament’s power to amend the Constitution is a limited power and it cannot be enlarged into absolute power.” "
                       "In the light of this statement explain whether Parliament under Article 368 of the Constitution can destroy "
                       "the Basic Structure of the Constitution by expanding its amending power ?",
                  pdf="research/upsc/_pyq/mains/2019_gs2.pdf", page=3),
    budget=(220, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words (P005); 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["POL-06", "pyq"],
    demands=[
        dict(id="D1", text="Explain the statement: why the amending power is limited and cannot be made absolute"),
        dict(id="D2", text="What Article 368 lets Parliament do, and how"),
        dict(id="D3", text="Whether Parliament can destroy the basic structure by expanding the power (the 42nd Amendment and the cases)"),
        dict(id="D4", text="Weigh it: what Parliament can still change, and why the limit exists"),
    ],
    sheet=[
        S("intro", """The statement echoes Minerva Mills (1980): a limited amending power is itself a basic feature,
          so Parliament cannot use it to make itself all-powerful.""",
          ["D1"], ["POL06-F05", "P006"]),
        S("head", "1. The power under Article 368", ["D2"], ["POL06-A01"]),
        S("points", """• Parliament may amend 'by addition, variation or repeal any provision' (Art. 368(1)).
          • Special majority: a majority of each House's total membership and two-thirds of those present and voting;
          some federal provisions also need half the States. • Art. 368(3): Art. 13 does not apply to amendments.""",
          ["D2"], ["POL06-A01", "POL06-A02", "POL06-A03", "POL06-A04"]),
        S("head", "2. Can it destroy the basic structure? No", ["D3"]),
        S("points", """• Kesavananda Bharati (1973, 13 judges, 7:6): the amending power does not include the power to alter
          the basic structure. • The 42nd Amendment (1976) tried to expand it: Art. 368(4) barred courts from questioning
          any amendment, and 368(5) declared 'no limitation whatever'. • Minerva Mills (1980) struck both down 5:0:
          'The power to destroy is not a power to amend.' • The test still bites: the 99th Amendment (NJAC) fell 4:1 in
          2015; I.R. Coelho (2007) opened post-1973 Ninth Schedule laws to review.""",
          ["D3", "D1"], ["POL06-D01", "POL06-D04", "POL06-B05", "P004", "POL06-F04", "P006", "POL06-F08", "POL06-F07"]),
        S("diagram", """A timeline arrow: Art. 368 power → Kesavananda sets the limit (1973) → the 42nd Amendment adds
          368(4)-(5) (1976) → Minerva Mills strikes them down (1980) → NJAC (2015).""",
          ["D3"], ["POL06-D01", "POL06-B05", "POL06-F04", "POL06-F08", "POL06-A01"], label="Fig. 1: The limit, and the attempt to remove it",
          items=[dict(when="Art. 368", what="the power to amend"), dict(when="1973", what="Kesavananda sets the limit"),
                 dict(when="1976", what="42nd Amendment: 368(4), (5)"), dict(when="1980", what="Minerva Mills strikes them"),
                 dict(when="2015", what="NJAC amendment falls")]),
        S("head", "3. Weighing it", ["D4"]),
        S("para", """Parliament can still amend any part within the limit; the judiciary decides whether it is crossed
          (NCERT), and what counts as basic is still debated. Change stays open: Ambedkar held that those who cannot win
          a two-thirds majority cannot claim the public's backing.""",
          ["D4"], ["POL06-H01", "POL06-E07", "POL06-G04"]),
        S("close", """So Parliament can amend the Constitution but not unmake it: the limit guards its identity while
          keeping it open to change.""",
          ["D1", "D4"], ["POL06-D04"]),
    ],
    weak=[
        dict(text="The basic structure is laid down in Article 368.", miss="the words 'basic structure' appear nowhere in the Constitution", claims=["POL06-A06", "POL06-A01"]),
        dict(text="Kesavananda Bharati gave a fixed list of the basic features.", miss="NCERT itself says what counts as basic is still debated", claims=["POL06-E07"]),
        dict(text="Indira Gandhi v Raj Narain was the first time an amendment was struck down.", miss="a common belief the record does not support", claims=["POL06-F03"]),
        dict(text="So Parliament can never amend Fundamental Rights.", miss="wrong: it can amend any part within the limit", claims=["POL06-H01"]),
        dict(text="(no mention of Article 368(4) and (5))", miss="skips the question's own words: 'by expanding its amending power'", claims=["P004"]),
    ],
    cousins=["2016 GS II Q6: what was held in the Coelho case, and is judicial review key?",
             "2016 PSIR Paper I Q5(c): 'Article 368 does not enable Parliament to alter the basic structure'",
             "2017 PSIR Paper I Q6(a): parliamentary supremacy and parliamentary sovereignty"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty nineteen. General Studies Paper Two, fifteen marks, two hundred and fifty words.
          Can Parliament destroy the Constitution's basic structure by expanding its own amending power?
          Here's the strange part. Parliament once wrote a clause that tried to do exactly that.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2019, GS Paper II, Q12'.
          The words 'by expanding its amending power' glow faintly (plant).""",
          ["P004", "P005"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Explain whether means give a reasoned yes or no. And there are four jobs.
          Explain the statement. Show what Article three sixty-eight allows. Answer whether the power can grow.
          Then weigh it.""",
          "Question X-ray: 'explain whether' highlighted; four empty boxes D1 to D4 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the power itself. Article three sixty-eight lets Parliament add, change or repeal any provision.
          It needs a special majority in each House. Some changes also need half the States.""",
          "Cartoon Parliament: a bill passing two doors, a two-thirds gauge, a row of State flags (no party symbols).",
          ["POL06-A01", "POL06-A02", "POL06-A03"]),
        T("b03", "but", "idea",
          """But in nineteen seventy-three, thirteen judges sat in Kesavananda Bharati.
          By seven to six, they set a limit. The power to amend does not include the power to alter the basic structure.""",
          "A long bench of thirteen chairs; the vote counter stops at 7 to 6.",
          ["POL06-D01", "POL06-D04"]),
        T("b04", "therefore", "idea",
          """So in nineteen seventy-six, Parliament pushed back. The Forty-second Amendment added two clauses.
          One said no court could question any amendment. The other said there was no limit whatever on the power.""",
          "The 1976 Gazette as a paper card; clauses 368(4) and 368(5) highlighted (pay-off of the plant).",
          ["POL06-B05", "P004"]),
        T("b05", "but", "idea",
          """But in nineteen eighty, in Minerva Mills, all five judges struck both clauses down.
          Their reason is the line in our question. A limited power cannot enlarge itself into an absolute one.
          The power to destroy is not a power to amend.""",
          "The judgment as a quote card (Minerva Mills, 1980); the two clauses fade, still printed but marked invalid.",
          ["POL06-F04", "P006", "POL06-A05"]),
        T("b06", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Open by naming where the statement comes from. That one line shows you know the case.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["P005", "P006"]),
        T("b07", "therefore", "sheet",
          """Section one is the power. Three short points: what it allows, the special majority, and Article thirteen kept out.""",
          "Section 1 writes in; box D2 fills.",
          ["POL06-A01", "POL06-A02", "POL06-A04"]),
        T("b08", "therefore", "sheet",
          """Section two answers the question directly: no. Then prove it in order.
          Kesavananda sets the limit. The Forty-second Amendment tries to remove it. Minerva Mills strikes that down.
          And it still applies: in twenty fifteen, the judicial appointments amendment fell four to one.""",
          "Section 2 writes in; the timeline Fig. 1 draws; box D3 fills.",
          ["POL06-D04", "POL06-B05", "POL06-F04", "POL06-F08"]),
        T("b09", "therefore", "sheet",
          """Section three weighs it. Parliament can still amend any part, within the limit. The courts decide where the limit is.
          And Ambedkar's point keeps change open. Win two-thirds, and you can change the text, inside the limit.""",
          "Section 3 writes in; box D4 fills.",
          ["POL06-H01", "POL06-G04"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It says the basic structure is written in the Constitution. It isn't.
          It says Kesavananda gave a fixed list. Even NCERT says that is debated. It repeats a common myth about Indira Gandhi's case.
          It says Fundamental Rights can never be amended. And it never mentions the two clauses the question is about.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["POL06-A06", "POL06-E07", "POL06-F03", "POL06-H01", "P004"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. One timeline answers its cousins. Twenty sixteen asked about the Coelho case.
          The PSIR paper asked about Article three sixty-eight and parliamentary sovereignty.
          Learn the timeline once. The full story of the case gets its own episode in our Polity series.""",
          "The four boxes tick; three cousin question cards slide in; a 'coming in the Polity series' card for POL-06.",
          ["POL06-F07"]),
    ],
    story=dict(
        promise="Can Parliament grow its own amending power until nothing is out of reach, and how do you prove the answer in 250 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this, and prove it, in 250 words?", open="b00", close="b11"),
            dict(id="L2", kind="secondary", q="Can Parliament expand its amending power without limit?", open="b00", close="b05"),
            dict(id="L3", kind="tertiary", q="What clause did Parliament once write?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the four jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b06", close="b10"),
        ],
        turn="b05",
        plants=[("b00", "b04"), ("b01", "b11")],
        critical=[
            dict(what="Articles 368(4) and (5) as printed", src="Legislative Department, Constitution as on 10 Sep 2026 (P004)"),
            dict(what="Minerva Mills holding and wording", src="Minerva Mills (1980), headnote 240C-E (P006, POL06-F04)"),
        ],
        fallback="If the Minerva Mills wording failed review: answer from Kesavananda's 7:6 holding and the printed footnotes alone.",
        tier="broad",
    ),
)
