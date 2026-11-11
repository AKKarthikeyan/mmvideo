"""One Question, format A: UPSC CSE (Main) 2017, General Studies Paper I, Q17. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the monsoon ledger (research/upsc/GEO-07/claims.csv) and this answer's ledger (research/upsc/pyq/2017-gs1-17/claims.csv).
Premise: 'more than 50 percent' holds only for whole UN regions (54.1%, an upper bound); the sheet says 'about half'.
Claim 2017-GS1-17-05 (Geen et al., 'over one third' for all monsoons worldwide) is a CONFLICT with the UN sum, so the tool will not let it be cited; it is left out.
Left out (no publisher of record): a single official figure for people living under the Asian monsoon; Indochina onset dates.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2017-GS1-17",
    fmt="A",
    title="Monsoon Asia and Half of Humanity: A 250-Word Answer (UPSC GS I 2017)",
    question=dict(year=2017, paper="gs1", label="General Studies Paper I", q=17, part="", marks=15,
                  text="What characteristics can be assigned to monsoon climate that succeeds in feeding more than 50 percent of the world population residing in Monsoon Asia ?",
                  pdf="research/upsc/_pyq/mains/2017_gs1.pdf", page=4),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words (printed on the paper); 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["GEO-07", "pyq/2017-gs1-17"],
    demands=[
        dict(id="D1", text="The characteristics of the monsoon climate"),
        dict(id="D2", text="How that climate feeds so many people (the link to food)"),
        dict(id="D3", text="Test the premise (more than 50 percent) and name the risks"),
    ],
    sheet=[
        S("intro", """_Monsoon climate_ means a seasonal reversal of winds. East, South-East and South Asia hold 54.1% of humanity,
          so 'about half' is the safe reading.""",
          ["D1"], ["M001", "2017-GS1-17-02"]),
        S("head", "1. Characteristics of the climate", ["D1"]),
        S("points", """• _Seasonal reversal_: a hot monsoonal climate across south and south-east Asia (NCERT).
          • _Two systems_: South and South-East Asia June-September; East Asia June-August (IPCC AR6); Japan's _Baiu_ runs early June to late July (JMA).
          • _Concentrated rain_: June-September gives 74.9% of India's annual rain, with Kerala onset about 1 June.
          • _Variable_: the standard deviation is about 10% of the mean, and El Niño can cut it.""",
          ["D1"], ["M001", "2017-GS1-17-11", "2017-GS1-17-12", "M046", "M027", "M081", "M073"]),
        S("head", "2. How it feeds the people", ["D2"]),
        S("points", """• _Rice_ is the bridge: Asia grows 89.4% of the world's rice (FAOSTAT 2024), and FAO calls it central to the food security of
          about half of humanity.
          • The top five producers, all in the monsoon belt, make 71.2% of world rice.
          • Rice needs over 100 cm of rain or irrigation; _kharif_ crops are sown with the monsoon.""",
          ["D2"], ["2017-GS1-17-07", "2017-GS1-17-06", "2017-GS1-17-08", "M087"]),
        S("diagram", """Four bars: share of world rice grown in Asia; share from the top five producers; share of world people in the three UN
          regions; share of Asia's rice that depends on rain alone.""",
          ["D2", "D3"], ["2017-GS1-17-07", "2017-GS1-17-08", "2017-GS1-17-02", "2017-GS1-17-09"], label="Fig. 1: People and rice",
          items=[dict(when="89.4%", what="Asia's share of world rice"), dict(when="71.2%", what="top five producers' share"),
                 dict(when="54.1%", what="share of world people (UN East, South-East, South Asia)"), dict(when="40%", what="Asia's rice on rain alone")]),
        S("head", "3. The premise and the risks", ["D3"]),
        S("points", """• 54.1% counts whole UN regions, an upper bound; it was already 52.2% in 1950.
          • About 40% of Asia's rice depends on rain alone, and FAO names _rainfall instability_ a main risk.
          • IPCC AR6: these regions' people depend heavily on freshwater for agriculture.""",
          ["D3"], ["2017-GS1-17-02", "2017-GS1-17-04", "2017-GS1-17-09", "2017-GS1-17-10", "2017-GS1-17-13"]),
        S("close", """So the monsoon feeds Asia as a seasonal, rain-fed rice engine; its variability, not its size, is the risk.""",
          ["D3"], ["2017-GS1-17-10"]),
    ],
    weak=[
        dict(text="Monsoon Asia has more than half the world's people, exactly as the question says.", miss="that holds only for whole UN regions (54.1%, an upper bound); say 'about half'",
             claims=["2017-GS1-17-02"]),
        dict(text="The monsoon is regular, so food is always secure.", miss="rainfall instability is a main rice risk, and about 40% of Asia's rice depends on rain alone",
             claims=["2017-GS1-17-10", "2017-GS1-17-09"]),
        dict(text="Rice is grown only in India and China.", miss="five monsoon countries make 71.2% of the world's rice, including Bangladesh, Indonesia and Viet Nam",
             claims=["2017-GS1-17-08"]),
        dict(text="Monsoon means only the Indian summer rain.", miss="East Asia has its own system, with different months",
             claims=["2017-GS1-17-11", "2017-GS1-17-12"]),
        dict(text="(no figures: 'a lot of people eat rice')", miss="no named source and no number", claims=[]),
    ],
    cousins=["2018 Geography Paper I Q3(a): origin, progress and retreat of the Indian monsoon, and its economic impact",
             "2022 Geography Paper II Q2(a): factors in the unpredictability of the south-west monsoon",
             "2023 GS I Q7: why the south-west monsoon is called 'Purvaiya' in the Bhojpur region"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty seventeen. General Studies Paper One, fifteen marks, two hundred and fifty words.
          What characteristics can be assigned to the monsoon climate? It feeds more than fifty per cent of the world's people in Monsoon Asia.
          Here's the catch. About half of humanity is easy to prove. More than half is not.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2017, GS Paper I, Q17'.
          The words 'more than 50 percent' glow faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Can be assigned means list the traits of the climate. That feeds means link it to food.
          So there are three jobs. The traits. The link to food. And a check on the premise.""",
          "Question X-ray: 'characteristics' and 'feeding' highlighted; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the traits. Monsoon means a seasonal reversal of winds.
          South and South-East Asia have it from June to September. East Asia has its own, from June to August.
          Japan's Baiu runs from early June to late July.""",
          "A map of Asia with two coloured monsoon zones and month bars beside each.",
          ["M001", "2017-GS1-17-11", "2017-GS1-17-12"]),
        T("b03", "but", "idea",
          """But the rain is not even. India gets nearly seventy-five per cent of its yearly rain in four months.
          It starts in Kerala about the first of June. And it swings about ten per cent from year to year, with dry breaks.""",
          "A rain-gauge year strip: four tall bars for June to September; a wobbling line for the yearly swing.",
          ["M046", "M027", "M081", "M066"]),
        T("b04", "therefore", "idea",
          """Now the link to food. It is rice. Asia grows eighty-nine per cent of the world's rice.
          FAO says rice is central to the food security of about half of humanity.
          And rice needs over one hundred centimetres of rain, or irrigation.""",
          "A rice paddy beside a rain gauge marked 100 cm; a share ring at 89 per cent.",
          ["2017-GS1-17-07", "2017-GS1-17-06", "M087"]),
        T("b05", "but", "idea",
          """But check the premise. Add East, South-East and South Asia, and you get fifty-four per cent of the world.
          That counts whole regions, so it is an upper bound. And it was already fifty-two per cent in nineteen fifty.
          So write: about half.""",
          "Three region blocks add to 54.1 per cent; a '1950: 52.2 per cent' ghost bar beside it (pay-off of the plant).",
          ["2017-GS1-17-02", "2017-GS1-17-04"]),
        T("b06", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Open with the definition. Then give the safe figure: about half of humanity.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["M001", "2017-GS1-17-02"]),
        T("b07", "therefore", "sheet",
          """Section one is the traits. Wind reversal. Two systems with their months. Rain packed into four months.
          And a swing of about ten per cent, with El Niño as one cause.""",
          "Section 1 writes in; key terms underlined.",
          ["M001", "2017-GS1-17-11", "2017-GS1-17-12", "M046", "M081", "M073"]),
        T("b08", "therefore", "sheet",
          """Section two is the feeding. Rice is the bridge. Asia's share, FAO's wording, and five big producers, all in the belt.
          Add one diagram: four bars, drawn in a minute. People, rice, top five, and rain alone.""",
          "Section 2 writes in; Fig. 1 bars draw one by one; box D2 fills.",
          ["2017-GS1-17-07", "2017-GS1-17-06", "2017-GS1-17-08", "2017-GS1-17-09", "2017-GS1-17-02"]),
        T("b09", "therefore", "sheet",
          """Section three tests the premise. Fifty-four per cent is an upper bound.
          About forty per cent of Asia's rice depends on rain alone. FAO names rainfall instability a main risk.
          Close on that. The variability, not the size, is the risk.""",
          "Section 3 and the conclusion write in; box D3 fills; word counter near 250.",
          ["2017-GS1-17-02", "2017-GS1-17-09", "2017-GS1-17-10", "2017-GS1-17-13"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It says over half, exactly, with no figure behind it. It says the monsoon is regular.
          It says rice grows only in India and China. It treats monsoon as Indian summer rain alone.
          And it names no number or source. Both took eleven minutes. Only one tested the premise.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2017-GS1-17-02", "2017-GS1-17-10", "2017-GS1-17-08", "2017-GS1-17-11"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty eighteen asked for the origin, progress and retreat of the monsoon.
          Twenty twenty-two asked why it is unpredictable. Learn it once: the traits, the link, the check.""",
          "The three boxes tick; three cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="What traits of the monsoon climate feed Asia, and why should you write 'about half' and not 'more than half'?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 250 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Is it really more than half of humanity?", open="b00", close="b05"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="What crop links the climate to food?", open="b03", close="b04"),
        ],
        turn="b05",
        plants=[("b00", "b05"), ("b01", "b11")],
        critical=[
            dict(what="UN sum of three regions (54.1%) and 1950 share (52.2%)", src="UN DESA World Population Prospects (2017-GS1-17-02, -04)"),
            dict(what="Asia's share of world rice", src="FAOSTAT 2024 (2017-GS1-17-07)"),
        ],
        fallback="If the premise check failed review: say 'a large share of humanity' and keep the rice figures and the FAO wording.",
        tier="broad",
    ),
)
