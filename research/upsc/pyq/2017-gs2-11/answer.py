"""One Question, format A: UPSC CSE (Main) 2017, General Studies Paper II, Q11. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2017-gs2-11/claims.csv); the topic ledger ECO-12 is listed but not cited.
Limit stated, not filled: no audit or official figure measures how far cascading was removed (-26, NOT FOUND). The efficacy view is argued
from the Act's design and the Council's own statements, and labelled so on the sheet. The Bill as introduced was not found (-27); the object is read through the Court's recital (-16).
Not re-checked after 2019: whether petroleum and alcohol remain outside GST (-07 is the constitutional text only).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2017-GS2-11",
    fmt="A",
    title="The 101st Amendment: Features, and Did It End Cascading? (UPSC GS II 2017)",
    question=dict(year=2017, paper="gs2", label="General Studies Paper II", q=11, part="", marks=15,
                  text="Explain the salient features of the Constitution (One Hundred and First Amendment) Act, 2016. Do you think it is efficacious enough “to remove cascading effect of taxes and provide for common national market for goods and services”?",
                  pdf="research/upsc/_pyq/mains/2017_gs2.pdf", page=2),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words; 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-12", "pyq/2017-gs2-11"],
    demands=[
        dict(id="D1", text="The salient features of the 101st Amendment Act, 2016"),
        dict(id="D2", text="Whether it is efficacious to remove cascading and give a common national market", view=True),
    ],
    sheet=[
        S("intro", """The Amendment Act (assent 8 September 2016) lets the Union and States tax goods and services together, guided by a Council.""",
          ["D1"], ["2017-GS2-11-01", "2017-GS2-11-02", "2017-GS2-11-05"]),
        S("head", "1. Salient features", ["D1"], ["2017-GS2-11-02"]),
        S("points", """• _Art 246A_: Parliament and State Legislatures both make GST law; Parliament alone on inter-State supply.
          • _Art 269A_: the Union levies and collects IGST and apportions it.
          • _GST Council_ (Art 279A): the Union Finance Minister chairs, each State has a Minister; decisions need three-fourths of weighted votes; Centre one-third.
          • Service tax, entry tax and advertisement taxes left the Lists; 'supply' replaces 'sale' (Art 286).
          • Council recommends on rates, exemptions, special provision for 11 States (279A(4)); it must set up a dispute mechanism (279A(11)).
          • Outside, in the 2016 text: alcohol; five petroleum goods until the Council recommends a date.
          • Compensation for five years (s.18).""",
          ["D1"], ["2017-GS2-11-02", "2017-GS2-11-03", "2017-GS2-11-04", "2017-GS2-11-05", "2017-GS2-11-10", "2017-GS2-11-01", "2017-GS2-11-12", "2017-GS2-11-13", "2017-GS2-11-06", "2017-GS2-11-11", "2017-GS2-11-07", "2017-GS2-11-08", "2017-GS2-11-14"]),
        S("head", "2. Is it efficacious?", ["D2"], ["2017-GS2-11-16"]),
        S("points", """• Aim, as the Court recites the Bill: remove the _cascading effect_, give a common national market.
          • We found no audit measuring cascading removed; we argue from design.
          • _For_: 8 central and 9 State taxes merged; the Council is guided by a harmonised national market (Art 279A(6)); entry tax left the Lists (our reading: fewer breaks in the chain).
          • _Against_: petroleum and alcohol outside, tobacco excise stays; in September 2025 the 56th Council recommended two rates plus 40%, and listed inverted-duty correction (textiles, fertilizers).
          • Supreme Court (Mohit Minerals): recommendations are persuasive, not binding.""",
          ["D2"], ["2017-GS2-11-16", "2017-GS2-11-19", "2017-GS2-11-09", "2017-GS2-11-12", "2017-GS2-11-13", "2017-GS2-11-07", "2017-GS2-11-24", "2017-GS2-11-21"]),
        S("close", """Efficacious in design, unfinished in practice: one GST and one Council, but, our reading, exclusions and slab corrections suggest cascading is not fully gone.""",
          ["D2"], ["2017-GS2-11-24", "2017-GS2-11-07"]),
    ],
    weak=[
        dict(text="GST removed cascading completely.", miss="we found no audit measuring it; petroleum and alcohol are outside, and in 2025 the Council was still correcting inverted duty", claims=["2017-GS2-11-24", "2017-GS2-11-07"]),
        dict(text="The Council's recommendations bind the Union and States.", miss="the Court held them persuasive, not binding", claims=["2017-GS2-11-21"]),
        dict(text="GST covers all goods and services.", miss="alcohol for human consumption is outside by the Constitution's own definition", claims=["2017-GS2-11-08"]),
        dict(text="The Centre alone decides in the Council.", miss="decisions need three-fourths of weighted votes; the Centre holds one-third", claims=["2017-GS2-11-10"]),
    ],
    cousins=["2019 GS III Q1: taxes subsumed in GST and revenue since 2017",
             "2020 GS III Q12: GST compensation to States and COVID-19",
             "2023 GS II Q15: the 101st Amendment and accommodative federalism"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty seventeen. General Studies Paper Two, fifteen marks, two hundred and fifty words.
          List the features of the hundred and first Amendment. Then say if it is efficacious enough to end cascading.
          Here is the catch. We found no audit that measures cascading removed.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2017, GS Paper II, Q11'.
          The word 'cascading' glows faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Explain, then do you think. That means take a view.
          Two jobs. The features. Then efficacy, argued from design.""",
          "Question X-ray: 'explain' and 'do you think' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """First the features. Article two forty-six A gives both Parliament and States the power to make GST law.
          Article two sixty-nine A lets the Union collect the inter-State tax and share it.""",
          "Two legislature icons sharing one GST pen; an IGST arrow splitting to the States.",
          ["2017-GS2-11-02", "2017-GS2-11-04"]),
        T("b03", "therefore", "idea",
          """Article two seventy-nine A makes the Council. The Centre holds one-third of the vote, the States two-thirds.
          Decisions need three-fourths.""",
          "A vote bar split one-third, two-thirds; a three-fourths line drawn across.",
          ["2017-GS2-11-10", "2017-GS2-11-05"]),
        T("b04", "but", "idea",
          """But not everything is inside. In the Constitution's text, alcohol is out and five petroleum goods wait for a date the Council recommends.""",
          "A bottle and a fuel pump held outside the GST box.",
          ["2017-GS2-11-07", "2017-GS2-11-08"]),
        T("b05", "therefore", "idea",
          """Now efficacy. The aim is clear: end cascading, build one market. The design helps.
          Eight central and nine State taxes merged. The Council must be guided by a harmonised market.""",
          "Seventeen tax cards sliding into one box; the phrase 'harmonised national market'.",
          ["2017-GS2-11-16", "2017-GS2-11-19", "2017-GS2-11-09"]),
        T("b06", "but", "idea",
          """But the Council itself kept mending it. In September twenty twenty-five it recommended two rates plus a forty per cent rate.
          It listed correction of inverted duty. That is our evidence that the work is unfinished.""",
          "Four slab bars merge into two; an 'inverted duty' tag marked 'to correct'.",
          ["2017-GS2-11-24"]),
        T("b07", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Features in points. Then for and against, labelled as argued from design. End with a verdict.""",
          "The answer sheet; clock 11:00 and word counter 0. Sections write in; boxes D1 and D2 fill.",
          ["2017-GS2-11-02"]),
        T("b08", "but", "compare",
          """Now the easy answer beside it. It says GST ended cascading completely. We found no audit that shows that.
          It says the Council binds States. The Court said no. And it says all goods are covered. Alcohol is not.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2017-GS2-11-21", "2017-GS2-11-08"]),
        T("b09", "therefore", "cousins",
          """Here is the payoff. This answer serves its cousins.
          Twenty nineteen asked about revenue. Twenty twenty asked about compensation. Twenty twenty-three asked about federalism.""",
          "The boxes tick; three cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="Did the 101st Amendment end cascading, and how do you answer in 250 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 250 words?", open="b00", close="b09"),
            dict(id="L2", kind="secondary", q="Is there an audit of cascading removed?", open="b00", close="b07"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b07"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b07", close="b08"),
        ],
        turn="b04",
        plants=[("b00", "b07"), ("b01", "b09")],
        critical=[
            dict(what="Council cut four slabs to two on 3 Sept 2025 and listed inverted-duty correction", src="PIB, 56th Council recommendations (2017-GS2-11-24)"),
            dict(what="Aim as recited by the Court", src="Mohit Minerals, 19 May 2022 (2017-GS2-11-16)"),
        ],
        fallback="If the 2025 reading failed review: drop it and argue from the exclusions alone.",
        tier="broad",
    ),
)
