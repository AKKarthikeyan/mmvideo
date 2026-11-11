"""One Question, format A: UPSC CSE (Main) 2020, General Studies Paper I, Q4. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the volcano and earthquake ledger (research/upsc/GEO-04/claims.csv) and this answer's ledger (research/upsc/pyq/2020-gs1-4/claims.csv).
Left out on purpose (no checkable source): gravity anomalies, heat flow, seafloor age, and the popular '90% of earthquakes' and '75% of volcanoes'.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2020-GS1-4",
    fmt="A",
    title="The Circum-Pacific Zone: A 150-Word Answer (UPSC GS I 2020)",
    question=dict(year=2020, paper="gs1", label="General Studies Paper I", q=4, part="", marks=10,
                  text="Discuss the geophysical characteristics of Circum-Pacific Zone.",
                  pdf="research/upsc/_pyq/mains/2020_gs1.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="UPSC's printed limit is 150 words (printed on the paper); 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["GEO-04", "pyq/2020-gs1-4"],
    demands=[
        dict(id="D1", text="What the zone is and how far it extends"),
        dict(id="D2", text="Its plate-tectonic setting and relief (subduction, trenches, exceptions)"),
        dict(id="D3", text="Seismicity: depth of foci and great earthquakes"),
        dict(id="D4", text="Volcanism"),
    ],
    sheet=[
        S("intro", """The _Ring of Fire_ is a horseshoe of 450+ volcanoes about 40,250 km long, the most active zone on Earth.""",
          ["D1"], ["2020-GS1-4-01", "2020-GS1-4-02"]),
        S("head", "1. Setting and relief", ["D2"]),
        S("points", """• Mostly _convergent_: plates subduct, e.g. Nazca under South America, raising the Andes.
          • _Trenches_ 8-10 km deep; Challenger Deep, 10,935 m. • Exceptions: the San Andreas _transform_ fault, about 5 cm a year;
          Hawaii, a _hotspot_ inside the plate. • The Pacific is shrinking as the Atlantic widens.""",
          ["D2"], ["2020-GS1-4-03", "2020-GS1-4-04", "2020-GS1-4-12", "2020-GS1-4-13", "2020-GS1-4-11"]),
        S("diagram", """A flow: subduction → trench → earthquake foci → volcanic arc.""",
          ["D2", "D3", "D4"], ["2020-GS1-4-03", "2020-GS1-4-05", "2020-GS1-4-06"], label="Fig. 1: One process, four features",
          items=[dict(when="Subduction", what="the oceanic plate sinks"), dict(when="Trench", what="8-10 km deep"),
                 dict(when="Earthquakes", what="foci shallow to deep"), dict(when="Volcanic arc", what="above the 100 km contour")]),
        S("head", "2. Earthquakes", ["D3"]),
        S("points", """• Foci deepen along the _Wadati-Benioff zone_, from 0-70 km to over 300 km (NCERT: rim quakes are deep-seated).
          • 7 of the 8 quakes of M 8.8 or more since 1900 struck the rim, e.g. Chile 1960, M9.5.""",
          ["D3"], ["2020-GS1-4-06", "2020-GS1-4-09", "2020-GS1-4-08"]),
        S("head", "3. Volcanism", ["D4"]),
        S("points", """• Arcs rise above the 100 km contour; more than half of active volcanoes ring the Pacific (USGS).""",
          ["D4"], ["2020-GS1-4-06", "V026"]),
        S("close", """One process, four features: plates dive, trenches form, quakes deepen, volcanoes rise.""",
          ["D4"], ["2020-GS1-4-05"]),
    ],
    weak=[
        dict(text="The zone holds ninety per cent of earthquakes.", miss="no allowed source gives that share; USGS says only 'more than half' of active volcanoes ring the Pacific",
             claims=["V026"]),
        dict(text="It is only a volcanic belt.", miss="it is also the world's most active earthquake zone",
             claims=["2020-GS1-4-02"]),
        dict(text="Hawaii lies on the rim.", miss="Hawaii is a hotspot inside the Pacific plate",
             claims=["2020-GS1-4-13"]),
        dict(text="Trenches are caused by faulting.", miss="they are made by subduction",
             claims=["2020-GS1-4-03"]),
        dict(text="(adds gravity anomaly and heat-flow figures)", miss="no source we could check; we drop what we cannot support", claims=[]),
    ],
    cousins=["2021 GS I Q7: global volcanic eruptions in 2021 and their regional impact",
             "2019 Geography Paper I Q1(a): phreatic eruptions and their consequences",
             "2017 Geography Paper I Q1(a): pseudovolcanic features"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty. General Studies Paper One, ten marks, one hundred and fifty words.
          Discuss the geophysical characteristics of the Circum-Pacific Zone.
          Here's a catch. Two famous numbers about this zone are quoted everywhere. We could not source either.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2020, GS Paper I, Q4'.
          Two blurred percentage cards sit behind it (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Discuss means look at several sides. Geophysical means the physical earth: plates, quakes, volcanoes.
          So there are four jobs. What and where. The plate setting. The earthquakes. The volcanoes.""",
          "Question X-ray: 'discuss' and 'geophysical' highlighted; four empty boxes D1 to D4 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with what it is. A horseshoe of more than four hundred and fifty volcanoes.
          It runs about forty thousand kilometres around the Pacific. USGS calls it the most active zone on Earth.""",
          "A Pacific map with the horseshoe lit in orange; a card reading 'USGS, This Dynamic Earth'.",
          ["2020-GS1-4-01", "2020-GS1-4-02"]),
        T("b03", "but", "idea",
          """But why a belt, and not a scatter? Because plates meet there. Fewer than one earthquake in ten falls inside a plate.
          Along this rim, plates dive under each other.""",
          "Plates as tiles; quake dots gather along the rim, a few stray dots inside tiles.",
          ["2020-GS1-4-05"]),
        T("b04", "therefore", "idea",
          """That diving is subduction. The Nazca Plate slides under South America and raises the Andes.
          It also drags down trenches, eight to ten kilometres deep. The deepest, Challenger Deep, is nearly eleven.""",
          "Cross-section: Nazca plate sinking under the Andes; a depth ruler beside the trench.",
          ["2020-GS1-4-03", "2020-GS1-4-04"]),
        T("b05", "therefore", "idea",
          """The sinking plate carries earthquakes down with it. Foci run from shallow to over three hundred kilometres deep.
          That sloping line is the Wadati-Benioff zone. And above the hundred-kilometre mark, volcanoes appear.""",
          "The cross-section again: a sloping line of dots; a volcano appears where the slab reaches a 100 km line.",
          ["2020-GS1-4-06", "2020-GS1-4-08"]),
        T("b06", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open with the horseshoe: the volcano count and the length. Box one fills.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["2020-GS1-4-01", "2020-GS1-4-02"]),
        T("b07", "therefore", "sheet",
          """Section one is setting and relief. Subduction, with the Andes as the example. Trenches, with a depth.
          Then two exceptions: the San Andreas fault, and Hawaii's hotspot. Exceptions show you know the rule.""",
          "Section 1 writes in; box D2 fills.",
          ["2020-GS1-4-03", "2020-GS1-4-04", "2020-GS1-4-12", "2020-GS1-4-13"]),
        T("b08", "therefore", "sheet",
          """Section two is earthquakes. Depth grows along the Wadati-Benioff zone.
          And seven of the eight biggest quakes since nineteen hundred struck this rim.
          Add one diagram: a flow from subduction to trench to quakes to volcanoes. Give it a minute.""",
          "Section 2 writes in; Fig. 1 draws as four boxes joined by arrows; box D3 fills.",
          ["2020-GS1-4-06", "2020-GS1-4-09", "2020-GS1-4-03", "2020-GS1-4-05"]),
        T("b09", "therefore", "sheet",
          """Section three is volcanoes. Arcs rise above the hundred-kilometre mark.
          And more than half of the world's active volcanoes ring the Pacific. That is USGS's wording, so we use it.
          Close with the one process, seen four ways.""",
          "Section 3 and the conclusion write in; box D4 fills; word counter near 150.",
          ["2020-GS1-4-06", "V026", "2020-GS1-4-05"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It quotes ninety per cent of earthquakes, a share we cannot source.
          It calls the zone only volcanic. It puts Hawaii on the rim. It blames trenches on faulting.
          And it adds gravity and heat-flow figures we could not check. Ours leaves them out.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["V026", "2020-GS1-4-02", "2020-GS1-4-13", "2020-GS1-4-03"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty twenty-one asked about volcanic eruptions and regional impact.
          Twenty nineteen asked about phreatic eruptions. Learn it once: what, setting, quakes, volcanoes.""",
          "The four boxes tick; the two blurred percentage cards fall away; three cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="How do you discuss the Circum-Pacific Zone in 150 words, and which famous percentages must you not quote?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Which two famous numbers can't we source?", open="b00", close="b09"),
            dict(id="M1", kind="micro", q="What are the four jobs?", open="b01", close="b08"),
            dict(id="M2", kind="micro", q="Why a belt and not a scatter?", open="b03", close="b04"),
        ],
        turn="b03",
        plants=[("b00", "b10"), ("b01", "b11")],
        critical=[
            dict(what="The wording 'more than half' of active volcanoes", src="USGS This Dynamic Earth (GEO-04 V026)"),
            dict(what="Seven of eight M 8.8+ quakes on the rim", src="NOAA NCEI Significant Earthquake Database, our count (2020-GS1-4-09)"),
        ],
        fallback="If the NCEI count failed review: drop the seven-of-eight line and keep Chile 1960 as the single named example.",
        tier="broad",
    ),
)
