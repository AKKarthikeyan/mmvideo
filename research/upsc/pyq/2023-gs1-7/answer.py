"""One Question, format A: UPSC CSE (Main) 2023, General Studies Paper I, Q7. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the monsoon ledger (research/upsc/GEO-07/claims.csv) and this answer's ledger (research/upsc/pyq/2023-gs1-7/claims.csv).
Left out on purpose (unverified): the '-aiya' suffix etymology and the proverb; festivals tied to the easterly wind.
Careful step: that Bhojpur lies near the monsoon trough is OUR inference; IMD and NCERT never name Bhojpur.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2023-GS1-7",
    fmt="A",
    title="Why 'Purvaiya'? A 150-Word Answer (UPSC GS I 2023)",
    question=dict(year=2023, paper="gs1", label="General Studies Paper I", q=7, part="", marks=10,
                  text="Why is the South-West Monsoon called ‘Purvaiya’ (easterly) in Bhojpur Region? How has this directional seasonal wind system influenced the cultural ethos of the region?",
                  pdf="research/upsc/_pyq/mains/2023_gs1.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="UPSC's printed limit is 150 words (printed on the paper); 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["GEO-07", "pyq/2023-gs1-7"],
    demands=[
        dict(id="D1", text="Why the South-West Monsoon is called Purvaiya (easterly) in the Bhojpur region"),
        dict(id="D2", text="How this wind system influenced the region's cultural ethos"),
    ],
    sheet=[
        S("intro", """_Purvaiya_ is the easterly (_purva_) wind of Bhojpuri song; the monsoon's Bay branch reaches the Ganga plain from the east.""",
          ["D1"], ["2023-GS1-7-01", "2023-GS1-7-02", "M042"]),
        S("head", "1. Why easterly", ["D1"]),
        S("points", """• The Bay of Bengal branch, bent by the Arakan Hills, moves _westward_ along the Ganga plain (NCERT).
          • IMD: north of the _monsoon trough_ (Ganganagar-Prayagraj-Kolkata) winds are easterly or south-easterly; placing Bhojpur there is our inference.""",
          ["D1"], ["M042", "2023-GS1-7-03", "2023-GS1-7-04", "2023-GS1-7-05"]),
        S("diagram", """A flow: the Bay branch, the Ganga plain, the Purva wind, the Kajari song.""",
          ["D1", "D2"], ["M042", "2023-GS1-7-03", "2023-GS1-7-05", "2023-GS1-7-14"], label="Fig. 1: From the Bay of Bengal to the song",
          items=[dict(when="Bay branch", what="bent by the Arakan Hills"), dict(when="Ganga plain", what="moves west along it"),
                 dict(when="Purva wind", what="easterly north of the trough"), dict(when="Kajari", what="Sawan songs of rain and parting")]),
        S("head", "2. Cultural ethos", ["D2"]),
        S("points", """• _Farming_: paddy is sown from the third week of June, and rain calls transplanting in song (Jassal).
          • _Kajari_, sung by women in Sawan (July-August); the slack season brings visits to natal homes.
          • _Migration_ shaped Biraha, Bidesiya and Kajari: the same wind pains wives left behind (Chauhan and Mishra).
          • 50,579,447 speak Bhojpuri (Census 2011).""",
          ["D2"], ["2023-GS1-7-09", "2023-GS1-7-12", "2023-GS1-7-14", "2023-GS1-7-10", "2023-GS1-7-11", "2023-GS1-7-15", "2023-GS1-7-02", "2023-GS1-7-07"]),
        S("close", """So the easterly sets the work, the songs and the ache: a boon for fields, a pain for the parted.""",
          ["D2"], ["2023-GS1-7-17"]),
    ],
    weak=[
        dict(text="Purvaiya comes from a Bhojpuri suffix meaning 'from'.", miss="no scholarly source gives that etymology; the word appears in songs as the easterly wind",
             claims=["2023-GS1-7-01"]),
        dict(text="A south-west monsoon cannot be easterly.", miss="north of the trough, winds are easterly or south-easterly",
             claims=["2023-GS1-7-04"]),
        dict(text="IMD names Bhojpur's wind as easterly.", miss="IMD names the trough, not Bhojpur: that step is our inference",
             claims=["2023-GS1-7-03"]),
        dict(text="Festivals like Hariyali Teej come from the easterly wind.", miss="no official or university-press source ties them to it", claims=[]),
        dict(text="The wind only brings joy.", miss="the songs also call it an enemy of wives left behind",
             claims=["2023-GS1-7-02"]),
    ],
    cousins=["2022 GS III Q8: mechanism and occurrence of cloudburst, with two recent examples",
             "2019 Geography Paper II Q1(c): why is the Indian monsoon erratic in nature?",
             "2018 Geography Paper I Q3(a): origin, progress and retreat of the monsoon, and its economic impact"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-three. General Studies Paper One, ten marks, one hundred and fifty words.
          Why is the South-West Monsoon called Purvaiya, easterly, in the Bhojpur region?
          And how has this wind system influenced the region's culture?
          Here's the puzzle. A south-west monsoon with an east wind's name.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2023, GS Paper I, Q7'.
          The words 'South-West' and 'easterly' glow faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Why asks for a cause. How has it influenced asks for effects.
          So there are two jobs. The reason for the name. And the mark it left on culture.""",
          "Question X-ray: 'why' and 'how' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the word. In Bhojpuri song, purva is the easterly wind.
          A song collected in Jaunpur reads, gusts of easterly winds blow.""",
          "The song line as a quote card (Jassal, Unearthing Gender); a small wind-vane pointing east.",
          ["2023-GS1-7-01", "2023-GS1-7-02"]),
        T("b03", "but", "idea",
          """But the monsoon is south-west. Yes, over the sea. Then the Bay of Bengal branch meets the Arakan Hills.
          It bends, and runs west up the Ganga plain. So it arrives from the east.""",
          "Map of the Bay branch bending at the Arakan Hills and running west along the Ganga plain (pay-off of the plant).",
          ["M042", "2023-GS1-7-05"]),
        T("b04", "therefore", "idea",
          """IMD gives the weather map. Its monsoon trough runs from Ganganagar through Prayagraj to Kolkata.
          North of that line, winds are easterly or south-easterly.
          Placing Bhojpur there is our own step. IMD never names it, so say it with care.""",
          "The trough drawn as a line on a map; arrows on its north side point west; a 'our inference' tag on Bhojpur.",
          ["2023-GS1-7-03", "2023-GS1-7-04"]),
        T("b05", "therefore", "idea",
          """Now the culture. The rains set the farm calendar.
          Paddy sowing runs from the third week of June to the fourth week of July.
          A Jaunpur work song says, it's raining, let's go transplant paddy.""",
          "A paddy field with a calendar strip; the song line as a quote card.",
          ["2023-GS1-7-09", "2023-GS1-7-12"]),
        T("b06", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open by translating the word. Purva means easterly. Then the Bay branch.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["2023-GS1-7-01", "2023-GS1-7-02", "M042"]),
        T("b07", "therefore", "sheet",
          """Section one is the cause. The Bay branch turns west. The trough has easterlies on its north.
          Then say plainly that placing Bhojpur there is our inference. Add a small flow diagram.""",
          "Section 1 writes in; Fig. 1 draws as four boxes joined by arrows.",
          ["M042", "2023-GS1-7-03", "2023-GS1-7-04", "2023-GS1-7-05"]),
        T("b08", "therefore", "sheet",
          """Section two is the culture. Farming first, with the paddy dates. Then Kajari, sung by women in Sawan, July and August.
          That slack season lets wives visit their parents. And fifty million people speak Bhojpuri.""",
          "Section 2 writes in, bullet by bullet; key terms underlined; box D2 fills.",
          ["2023-GS1-7-09", "2023-GS1-7-10", "2023-GS1-7-11", "2023-GS1-7-14", "2023-GS1-7-07"]),
        T("b09", "therefore", "sheet",
          """Last, the ache. Migration shaped Biraha, Bidesiya and Kajari.
          The same wind that should comfort pains a wife whose husband is away.
          Rain is a boon for the fields and a pain for the parted. End on that.""",
          "The last bullet and the conclusion write in; word counter near 150.",
          ["2023-GS1-7-15", "2023-GS1-7-02", "2023-GS1-7-17"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It invents an origin for the word, from a suffix. It says a south-west monsoon cannot be easterly.
          It credits festivals to the wind with no source. It says the wind only brings joy.
          And it says IMD named the Bhojpur wind. It did not.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2023-GS1-7-01", "2023-GS1-7-04", "2023-GS1-7-02", "2023-GS1-7-03"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty twenty-two asked about the cloudburst.
          Twenty nineteen asked why the monsoon is erratic. Learn it once: the cause first, then its effects.""",
          "The two boxes tick; three cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="Why does a south-west monsoon carry an east wind's name in Bhojpur, and what does that wind do to the region's songs?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Why does a south-west monsoon have an easterly name?", open="b00", close="b03"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b08"),
            dict(id="M2", kind="micro", q="Which step must be marked as our inference?", open="b04", close="b07"),
        ],
        turn="b03",
        plants=[("b00", "b03"), ("b01", "b11")],
        critical=[
            dict(what="Easterlies north of the monsoon trough", src="IMD Monsoon 2025 report and IMD FAQ (2023-GS1-7-03, -04)"),
            dict(what="The Purva wind inside the songs", src="Jassal (Duke UP) and Chauhan and Mishra (2024) (2023-GS1-7-01, -02)"),
        ],
        fallback="If the Bhojpur-near-the-trough step failed review: answer from NCERT's westward Bay branch alone and mark the rest as a limit.",
        tier="broad",
    ),
)
