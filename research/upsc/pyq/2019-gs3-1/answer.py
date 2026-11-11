"""One Question, format A: UPSC CSE (Main) 2019, General Studies Paper III, Q1. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2019-gs3-1/claims.csv); the topic ledger ECO-12 is listed but not cited.
One basis only: gross collection INCLUDING cess (Lok Sabha figures, -04, and GSTN FY25, -09). The ex-cess series (-07, -08, FY26 Rs 22.27 lakh crore)
is not mixed in. Left out on purpose: any like-for-like comparison with the taxes replaced (-14, NOT FOUND), and 2018-19 growth rates (nine-month 2017-18 base).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2019-GS3-1",
    fmt="A",
    title="Taxes Subsumed in GST and What It Did to Revenue (UPSC GS III 2019)",
    question=dict(year=2019, paper="gs3", label="General Studies Paper III", q=1, part="", marks=10,
                  text="Enumerate the indirect taxes which have been subsumed in the Goods and Services Tax (GST) in India. Also, comment on the revenue implications of the GST introduced in India since July 2017.",
                  pdf="research/upsc/_pyq/mains/2019_gs3.pdf", page=1),
    budget=(120, 150),
    minutes=7,
    budget_note="UPSC's printed limit is 150 words (printed on the paper); 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-12", "pyq/2019-gs3-1"],
    demands=[
        dict(id="D1", text="Enumerate the Union and State indirect taxes subsumed in GST"),
        dict(id="D2", text="Comment on the revenue implications since July 2017", view=True),
    ],
    sheet=[
        S("intro", """GST began on 1 July 2017 and merged many Union and State taxes into one.""",
          ["D1"], ["2019-GS3-1-03"]),
        S("head", "1. Taxes subsumed", ["D1"], ["2019-GS3-1-01", "2019-GS3-1-02"]),
        S("points", """• Union (8 heads): _central excise_, other excise duties, CVD, SAD, _service tax_, related cesses.
          • States (9 heads): _VAT_, central sales tax, purchase, luxury, entry, entertainment and advertisement taxes, lottery and betting taxes, cesses.
          • Outside (CBIC): alcohol; five petroleum goods until a date the Council recommends.""",
          ["D1"], ["2019-GS3-1-01", "2019-GS3-1-02", "2019-GS3-1-03"]),
        S("head", "2. Revenue implications", ["D2"], ["2019-GS3-1-04"]),
        S("points", """• Basis: gross, with cess.
          • Rose from Rs 7.41 lakh crore (nine months, 2017-18) to 20.18 lakh crore in 2023-24 and 22.09 lakh crore in 2024-25.
          • One fall: 12.22 to 11.37 lakh crore in 2020-21, the pandemic year (our reading).
          • _Compensation_ protected States at 14% growth on 2015-16; PIB: about Rs 49,000 crore, 83,000 crore and 1.65 lakh crore released for 2017-18 to 2019-20.""",
          ["D2"], ["2019-GS3-1-04", "2019-GS3-1-09", "2019-GS3-1-11", "2019-GS3-1-12"]),
        S("diagram", """A bar chart of gross GST collection with cess, lakh crore, 2019-20 to 2023-24, the 2020-21 bar ringed.""",
          ["D2"], ["2019-GS3-1-04"], label="Fig. 1: Gross GST collection with cess (lakh crore)",
          items=[dict(when="2019-20", what="12.22"), dict(when="2020-21", what="11.37"), dict(when="2021-22", what="14.83"),
                 dict(when="2022-23", what="18.08"), dict(when="2023-24", what="20.18")]),
        S("close", """Revenue rose, with one fall in 2020-21 (our reading: the pandemic). We found no official like-for-like comparison with the replaced taxes.""",
          ["D2"], ["2019-GS3-1-04"]),
    ],
    weak=[
        dict(text="GST collected more than the taxes it replaced.", miss="we found no official like-for-like figure; collections alone do not show it", claims=[]),
        dict(text="Collections rose every year.", miss="they fell in 2020-21, from 12.22 to 11.37 lakh crore", claims=["2019-GS3-1-04"]),
        dict(text="Alcohol and petrol are taxed under GST today.", miss="alcohol is outside; for the five petroleum goods CBIC says the Council will recommend a date", claims=["2019-GS3-1-03"]),
        dict(text="Mixes figures with and without cess in one series.", miss="one basis only; the two differ (22.09 lakh crore with cess for 2024-25)", claims=["2019-GS3-1-09"]),
    ],
    cousins=["2017 GS II Q11: the 101st Amendment Act and cascading of taxes",
             "2020 GS III Q12: GST compensation to States and COVID-19",
             "2023 GS II Q15: the 101st Amendment and federalism"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty nineteen. General Studies Paper Three, ten marks, one hundred and fifty words.
          List the indirect taxes GST swallowed. Then comment on its revenue since July twenty seventeen.
          Here is the catch. Two sets of GST totals are in circulation, one with cess and one without.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2019, GS Paper III, Q1'.
          Two stacks of totals sit blurred behind it (plant).""",
          ["2019-GS3-1-03"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Enumerate means list. Comment means give a view.
          So two jobs. List the taxes, Union and State. Then judge the revenue.""",
          "Question X-ray: 'enumerate' and 'comment' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """The Union gave up eight heads. Central excise, other excise duties, CVD, SAD, service tax and related cesses.
          The States gave up nine. VAT, sales tax, entry tax and more.""",
          "Two columns of tax cards, eight and nine, sliding into one GST box.",
          ["2019-GS3-1-01", "2019-GS3-1-02"]),
        T("b03", "but", "idea",
          """But not everything went in. Alcohol stayed outside. Five petroleum goods come in from a date the Council recommends, per the CBIC note.""",
          "A bottle and a fuel pump icon held outside the GST box.",
          ["2019-GS3-1-03"]),
        T("b04", "therefore", "idea",
          """Now revenue. Pick one basis and say so. We use totals with cess.
          Nine months of twenty seventeen-eighteen gave seven point four one lakh crore. Twenty twenty-three-twenty-four gave twenty point one eight.""",
          "A bar chart of the with-cess series, labelled 'with cess'.",
          ["2019-GS3-1-04"]),
        T("b05", "but", "idea",
          """But the line is not straight. In twenty twenty to twenty-one it fell, from twelve point two two to eleven point three seven. A pandemic year, our reading.
          States were shielded by compensation at fourteen per cent growth on a twenty fifteen-sixteen base.""",
          "The dip in the bars ringed; a shield card with 14% over 2015-16.",
          ["2019-GS3-1-04", "2019-GS3-1-12"]),
        T("b06", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          List the heads under one heading. Then give the revenue with its basis, the dip, and compensation.""",
          "The answer sheet; clock 7:00 and word counter 0. Both sections write in; boxes D1 and D2 fill.",
          ["2019-GS3-1-01", "2019-GS3-1-04"]),
        T("b07", "but", "compare",
          """Now the easy answer beside it. It says GST collected more than the old taxes. We found no official figure that shows that.
          It says collections rose every year. They fell in twenty twenty to twenty-one. And it mixes totals with and without cess.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2019-GS3-1-04", "2019-GS3-1-09"]),
        T("b08", "therefore", "cousins",
          """Here is the payoff. This answer serves its cousins.
          Twenty seventeen asked about cascading. Twenty twenty asked about compensation. Twenty twenty-three asked about federalism.""",
          "The boxes tick; three cousin question cards slide in.",
          ["2019-GS3-1-12"]),
    ],
    story=dict(
        promise="Which taxes did GST replace, and what did it do to revenue, in 150 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b08"),
            dict(id="L2", kind="secondary", q="Which basis for the totals?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b06"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b06", close="b07"),
        ],
        turn="b05",
        plants=[("b00", "b04"), ("b01", "b08")],
        critical=[
            dict(what="Gross collection series with cess, 2017-18 to 2023-24", src="Lok Sabha reply, Annexure A (2019-GS3-1-04)"),
            dict(what="Compensation Act ss.3-4: 14% on the 2015-16 base", src="GST (Compensation to States) Act, 2017 (2019-GS3-1-12)"),
        ],
        fallback="If the series failed review: drop the end-point figures and keep the dip and the compensation rule.",
        tier="broad",
    ),
)
