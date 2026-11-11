"""One Question, format A: UPSC CSE (Main) 2023, General Studies Paper II, Q15. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2023-gs2-15/claims.csv); the topic ledger ECO-12 is listed but not cited.
'Accommodative federalism' is the question's phrase; Mohit Minerals speaks of cooperative and 'uncooperative' federalism and a dialogue (-06).
The Centre's veto under the three-fourths rule is our inference from Art 279A(9) and is labelled so on the sheet.
Limits stated, not filled: no tally of Council decisions by consensus or division (-17), and no record that the Art 279A(11) mechanism was set up (-18).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2023-GS2-15",
    fmt="A",
    title="The 101st Amendment and Accommodative Federalism (UPSC GS II 2023)",
    question=dict(year=2023, paper="gs2", label="General Studies Paper II", q=15, part="", marks=15,
                  text="Explain the significance of the 101st Constitutional Amendment Act. To what extent does it reflect the accommodative spirit of federalism ?",
                  pdf="research/upsc/_pyq/mains/2023_gs2.pdf", page=3),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words; 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-12", "pyq/2023-gs2-15", "pyq/2020-gs3-12"],
    demands=[
        dict(id="D1", text="The significance of the 101st Amendment Act"),
        dict(id="D2", text="To what extent it reflects an accommodative spirit of federalism", view=True),
    ],
    sheet=[
        S("intro", """The 101st Amendment (2016) gave the Union and States one shared GST power and a Council where States hold two-thirds of the weighted vote.""",
          ["D1"], ["2023-GS2-15-01", "2023-GS2-15-03"]),
        S("head", "1. Significance", ["D1"], ["2023-GS2-15-13"]),
        S("points", """• _One tax, one market_: the Council is guided by a harmonised national market (Art 279A(6)).
          • _Art 246A_: Parliament and State Legislatures both legislate on GST.
          • Both gave up heads: States their sales and entry taxes, the Union service tax.
          • Compensation for five years (s.18) was the price of the deal (our reading).""",
          ["D1"], ["2023-GS2-15-13", "2023-GS2-15-01", "2023-GS2-15-11", "2023-GS2-15-12", "2023-GS2-15-09"]),
        S("head", "2. How accommodative?", ["D2"], ["2023-GS2-15-05"]),
        S("points", """• _Accommodative_: States share two-thirds of the vote equally; the Centre has one-third. Special provision for 11 named States (Art 279A(4)(g), 2016 text).
          • _Mohit Minerals_ (2022): Council recommendations are not binding; the Court calls federalism a dialogue of cooperative and uncooperative federalism, 'collaboration to contestation'.
          • The 2011 draft dispute authority and consensus rule were dropped.""",
          ["D2"], ["2023-GS2-15-03", "2023-GS2-15-02", "2023-GS2-15-10", "2023-GS2-15-05", "2023-GS2-15-06", "2023-GS2-15-07"]),
        S("points", """• _Limits_: a three-fourths majority gives the Centre's one-third a veto (our inference from Art 279A(9)).
          • The Union collects and apportions IGST (Art 269A); Parliament alone legislates on inter-State supply.
          • The s.18 duty ran five years (to June 2022); the Council extended the cess (Oct 2020) and in Sept 2025 recommended the tobacco cess stay until loans are repaid.
          • We found no record that the Art 279A(11) dispute mechanism was set up.
          • _Tested_: at the 42nd Council (Oct 2020) Punjab, Chhattisgarh, Kerala and West Bengal dissented on the borrowing options; Punjab cited Art 279A(11).""",
          ["D2"], ["2023-GS2-15-03", "2023-GS2-15-08", "2023-GS2-15-01", "2023-GS2-15-16", "2023-GS2-15-15", "2023-GS2-15-04", "2020-GS3-12-15", "2020-GS3-12-22"]),
        S("close", """Largely accommodative in design; the borrowing dispute tested it. 'Accommodative' is the question's word.""",
          ["D1", "D2"], ["2023-GS2-15-04", "2020-GS3-12-15"]),
    ],
    weak=[
        dict(text="The Council's recommendations bind States.", miss="the Court held them persuasive, not binding", claims=["2023-GS2-15-05"]),
        dict(text="The Centre alone decides GST rates.", miss="the Centre holds one-third of the vote; States together hold two-thirds", claims=["2023-GS2-15-03"]),
        dict(text="The Council always decides by consensus.", miss="no tally of consensus against division was found; a division by secret ballot is allowed", claims=["2023-GS2-15-14"]),
        dict(text="The dispute authority under Art 279A(11) is working.", miss="the Article requires it; we saw no record that it was set up", claims=["2023-GS2-15-04"]),
    ],
    cousins=["2017 GS II Q11: the 101st Amendment Act and cascading of taxes",
             "2019 GS III Q1: taxes subsumed in GST and revenue since 2017",
             "2020 GS III Q12: GST compensation to States and COVID-19"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-three. General Studies Paper Two, fifteen marks, two hundred and fifty words.
          Explain why the hundred and first Amendment matters. Then say how far it is accommodative federalism.
          Here is the catch. That phrase is the question's own. The Supreme Court uses other words.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2023, GS Paper II, Q15'.
          The word 'accommodative' glows faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Explain, then to what extent. That means take a view.
          Two jobs. The significance. Then how federal it is, with a verdict.""",
          "Question X-ray: 'explain' and 'to what extent' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with why it matters. One tax and one national market.
          Parliament and every State Legislature may now make GST law. Both sides gave up their old taxes.""",
          "A single GST box absorbing Union and State tax cards.",
          ["2023-GS2-15-13", "2023-GS2-15-01", "2023-GS2-15-11"]),
        T("b03", "therefore", "idea",
          """On our reading the design favours States. They hold two-thirds of the weighted vote, shared equally.
          The Court said the Council's advice is not binding. It called federalism a dialogue.""",
          "A vote bar split one-third and two-thirds; a Court card with the word 'dialogue'.",
          ["2023-GS2-15-03", "2023-GS2-15-05", "2023-GS2-15-06"]),
        T("b04", "but", "idea",
          """But a decision needs three-fourths. So the Centre's one-third is a veto. That is our inference.
          The Union also collects the inter-State tax and shares it.""",
          "The vote bar again; a quarter marked as the blocking share.",
          ["2023-GS2-15-03", "2023-GS2-15-08"]),
        T("b05", "but", "idea",
          """And compensation was promised for five years. The cess was extended past it. Our reading: a strain.
          The Article on settling disputes is there. We saw no record that it was set up.""",
          "A five-year ribbon with the cess line running past its end.",
          ["2023-GS2-15-09", "2023-GS2-15-16", "2023-GS2-15-04"]),
        T("b06", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Significance first. Then the case for, the limits, and a verdict in one line.""",
          "The answer sheet; clock 11:00 and word counter 0. Sections write in; boxes D1 and D2 fill.",
          ["2023-GS2-15-13", "2023-GS2-15-03"]),
        T("b07", "but", "compare",
          """Now the easy answer beside it. It says the Council binds States. The Court said no.
          It says the Centre alone sets rates. It holds one-third. And it says disputes are settled. We found no record.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2023-GS2-15-05", "2023-GS2-15-03", "2023-GS2-15-04"]),
        T("b08", "therefore", "cousins",
          """Here is the payoff. This answer serves its cousins.
          Twenty seventeen asked about the Amendment. Twenty nineteen asked about revenue. Twenty twenty asked about compensation.""",
          "The boxes tick; three cousin question cards slide in.",
          ["2023-GS2-15-01"]),
    ],
    story=dict(
        promise="How accommodative is the 101st Amendment, and how do you answer in 250 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 250 words?", open="b00", close="b08"),
            dict(id="L2", kind="secondary", q="Whose word is 'accommodative'?", open="b00", close="b06"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b06"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b06", close="b07"),
        ],
        turn="b04",
        plants=[("b00", "b06"), ("b01", "b08")],
        critical=[
            dict(what="Mohit Minerals on non-binding recommendations and federalism as dialogue", src="Supreme Court, 19 May 2022 (2023-GS2-15-05, -06)"),
            dict(what="Art 279A(9) weighted vote, Centre one-third", src="The Act, Gazette 8 Sept 2016 (2023-GS2-15-03)"),
        ],
        fallback="If the veto inference failed review: drop it and keep the vote shares and the Court's holding.",
        tier="broad",
    ),
)
