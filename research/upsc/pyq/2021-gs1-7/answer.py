"""One Question, format A: UPSC CSE (Main) 2021, General Studies Paper I, Q7. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the volcano ledger (research/upsc/GEO-04/claims.csv) and this answer's ledger (research/upsc/pyq/2021-gs1-7/claims.csv).
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2021-GS1-7",
    fmt="A",
    title="Volcanoes of 2021: What UPSC Wants in 150 Words",
    question=dict(year=2021, paper="gs1", label="General Studies Paper I", q=7, part="", marks=10,
                  text="Mention the global occurrence of volcanic eruptions in 2021 and their impact on regional environment.",
                  pdf="research/upsc/_pyq/mains/2021_gs1.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="UPSC's printed limit is 150 words (printed on the paper); 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["GEO-04", "pyq/2021-gs1-7"],
    demands=[
        dict(id="D1", text="Mention the global occurrence of volcanic eruptions in 2021 (where, how many, how big)"),
        dict(id="D2", text="Give their impact on the regional environment (region by region)"),
    ],
    sheet=[
        S("intro", """NOAA's database lists _seven significant eruptions_ in 2021, none above VEI 4: regional in effect, not global.""",
          ["D1"], ["2021-GS1-7-01", "2021-GS1-7-02"]),
        S("head", "1. Where they occurred", ["D1"], ["2021-GS1-7-01"]),
        S("points", """• Americas 3 (Ecuador, Guatemala, _St Vincent_), Europe 2 (Italy, _La Palma_), Africa 1 (Nyiragongo), Asia 1 (Semeru).
          • Only St Vincent and Semeru reached VEI 4. • Hunga Tonga is 2022, not 2021.""",
          ["D1"], ["2021-GS1-7-01", "2021-GS1-7-02", "2021-GS1-7-16"]),
        S("head", "2. Impact on regional environment", ["D2"], ["2021-GS1-7-05"]),
        S("points", """• _Caribbean_: St Vincent's ash covered the island; about 16,000 were evacuated, water and power failed, banana farming was hit.
          • _Central Africa_: Nyiragongo destroyed about 5,000 houses and disrupted water and power.
          • _Europe_: La Palma erupted for 85 days, covering 12 km2 in lava; 1.8 Mt SO2 drifted over Africa, Europe and the Caribbean.
          • _Pacific_: Fukutoku-Oka-no-Ba's pumice raft drifted 1,300 km, stranding on Okinawa's reefs and mangroves.""",
          ["D2"], ["2021-GS1-7-03", "2021-GS1-7-05", "2021-GS1-7-06", "2021-GS1-7-07", "2021-GS1-7-08", "2021-GS1-7-09", "2021-GS1-7-13", "2021-GS1-7-14"]),
        S("close", """So the harm was regional: ash, water, land, air. La Palma's SO2 was a tenth of Pinatubo's; no global cooling followed.""",
          ["D2"], ["2021-GS1-7-10"]),
    ],
    weak=[
        dict(text="Hunga Tonga erupted in 2021 and cooled the Earth.", miss="Tonga was January 2022; no source gives any global cooling for 2021",
             claims=["2021-GS1-7-16", "2021-GS1-7-10"]),
        dict(text="Gives a total count of all eruptions in the year.", miss="no allowed source gives one; NOAA's seven are only the significant ones",
             claims=["2021-GS1-7-01"]),
        dict(text="Lists the eruptions and stops.", miss="the question's second job is impact: water, farms, air and sea",
             claims=["2021-GS1-7-05"]),
        dict(text="La Palma's gas stayed over the Canary Islands.", miss="the plume reached Africa, Europe and the Caribbean",
             claims=["2021-GS1-7-09"]),
    ],
    cousins=["2020 GS I Q4: geophysical characteristics of the Circum-Pacific Zone",
             "2019 Geography Paper I Q1(a): phreatic eruptions and their consequences",
             "2017 Geography Paper I Q1(a): pseudovolcanic features"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-one. General Studies Paper One, ten marks, one hundred and fifty words.
          Mention the global occurrence of volcanic eruptions in twenty twenty-one. Then give their impact on regional environment.
          Here's a trap. One famous eruption feels like it belongs in this answer, and it doesn't.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2021, GS Paper I, Q7'.
          The year '2021' glows faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Mention means list, briefly. Impact means say what each eruption did.
          So there are two jobs. Where did they happen? And what did they do to each region?""",
          "Question X-ray: 'mention' and 'impact' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the where. NOAA's database lists seven significant eruptions for twenty twenty-one.
          Three in the Americas, two in Europe, one in Africa, one in Asia.
          That is NOAA's filter, not a count of every eruption.""",
          "A world map with seven dots, coloured by continent; a card reading 'NOAA NCEI, significant eruptions'.",
          ["2021-GS1-7-01"]),
        T("b03", "but", "idea",
          """But now the trap. Hunga Tonga is not on that list. It erupted in January twenty twenty-two.
          Tonga is the famous one, so it sneaks into answers. Leave it out.""",
          "The 2021 calendar page; a Tonga card tries to slide in and bounces to the next year's page (pay-off of the plant).",
          ["2021-GS1-7-16"]),
        T("b04", "therefore", "idea",
          """So how big was twenty twenty-one? None passed four on the explosivity scale.
          La Palma put out one point eight million tonnes of sulphur dioxide. That is about a tenth of Pinatubo.
          So the damage stayed regional.""",
          "A bar scale: La Palma's gas beside Pinatubo's, one tenth the height; a regional-not-global tag.",
          ["2021-GS1-7-02", "2021-GS1-7-08", "2021-GS1-7-10"]),
        T("b05", "therefore", "idea",
          """Regional is the word to build on. Each eruption hit a place in its own way.
          Ash and water in the Caribbean. Houses and power in Central Africa. Air in Europe. Reefs in the Pacific.""",
          "Four small region cards with icons: ash cloud, house, plume arrow, coral reef.",
          ["2021-GS1-7-05", "2021-GS1-7-03", "2021-GS1-7-09", "2021-GS1-7-14"]),
        T("b06", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open with NOAA's seven, and say the effect was regional, not global.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["2021-GS1-7-01", "2021-GS1-7-02"]),
        T("b07", "therefore", "sheet",
          """Section one is the where. Three in the Americas, two in Europe, one each in Africa and Asia.
          Then one line that shows you know the trap. Tonga is twenty twenty-two.""",
          "Section 1 writes in with St Vincent and La Palma underlined.",
          ["2021-GS1-7-01", "2021-GS1-7-02", "2021-GS1-7-16"]),
        T("b08", "therefore", "sheet",
          """Section two is the impact, one region at a time, each with a figure.
          St Vincent: sixteen thousand evacuated, water and power lost. Nyiragongo: five thousand houses.
          La Palma: eighty-five days and twelve square kilometres of lava. Its plume reached Africa and the Caribbean.
          And a pumice raft drifted thirteen hundred kilometres to Okinawa's reefs.""",
          "Section 2 writes in, bullet by bullet; box D2 fills.",
          ["2021-GS1-7-03", "2021-GS1-7-05", "2021-GS1-7-07", "2021-GS1-7-09", "2021-GS1-7-13", "2021-GS1-7-14"]),
        T("b09", "therefore", "sheet",
          """End with the scale. La Palma's gas was a tenth of Pinatubo's. So no global cooling followed.
          The harm was regional.""",
          "The conclusion writes in; clock near 0:30; word counter near 150.",
          ["2021-GS1-7-10", "2021-GS1-7-08"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It adds Tonga and a global cooling. It gives a total count nobody can source.
          It lists eruptions but not their impact. It says the plume stayed on the island.
          Both took seven minutes. Only one did both jobs.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2021-GS1-7-16", "2021-GS1-7-10", "2021-GS1-7-01", "2021-GS1-7-05", "2021-GS1-7-09"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty twenty asked about the Circum-Pacific Zone.
          Twenty nineteen asked about phreatic eruptions. Learn it once: where, then what it did.""",
          "The two boxes tick; three cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="What do you write about the eruptions of 2021 in 150 words, and which famous eruption must stay out?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Which famous eruption does not belong to 2021?", open="b00", close="b03"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b08"),
            dict(id="M2", kind="micro", q="Did 2021's eruptions change the global climate?", open="b04", close="b09"),
        ],
        turn="b03",
        plants=[("b00", "b03"), ("b01", "b11")],
        critical=[
            dict(what="NOAA's list of seven significant 2021 eruptions", src="NOAA NCEI Significant Volcanic Eruptions Database (2021-GS1-7-01)"),
            dict(what="Hunga Tonga is 15 January 2022", src="NOAA NCEI (GEO-04 V064, 2021-GS1-7-16)"),
        ],
        fallback="If the pumice-raft claims failed review: close the Pacific line with the eruption date and the 1,300 km drift only.",
        tier="broad",
    ),
)
