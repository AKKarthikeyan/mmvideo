"""One Question, format A: UPSC CSE (Main) 2017, Geography optional Paper I, Q1(a). Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2017-geo1-1a/claims.csv). We found no definition of 'pseudovolcanic'
(2017-GEO1-1A-01, NOT FOUND), so the working definition is ours and is labelled so. The weaker answer is written by us."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


P = "2017-GEO1-1A-"
A = dict(
    id="PYQ-2017-GEO1-1A",
    fmt="A",
    title="Pseudovolcanic Features: A 150-Word Note for Geography Optional",
    question=dict(year=2017, paper="geo1", label="Geography optional Paper I", q=1, part="a", marks=10,
                  text="Write a note on pseudovolcanic features.",
                  pdf="research/upsc/_pyq/mains/2017_geo1.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="the bank lists 150 words for this question; 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["pyq/2017-geo1-1a"],
    demands=[
        dict(id="D1", text="Say what 'pseudovolcanic' means (we found no definition, so a labelled working definition)"),
        dict(id="D2", text="Give the look-alike features, with examples"),
        dict(id="D3", text="Say which borderline features belong (our reading)"),
    ],
    sheet=[
        S("intro", """We found no definition of _pseudovolcanic_ at any publisher we could open. Our working definition: looks volcanic, but no magma erupts at that spot.""",
          ["D1"], []),
        S("head", "1. Look-alike features", ["D2"], [P + "03", P + "07", P + "09"]),
        S("diagram", """Cross-section: lava flow over wet ground; steam blasts build a small cone; no pipe down to a magma chamber.""",
          ["D2"], [P + "03"], label="Fig. 1: A rootless cone",
          labels=dict(lava="Lava flow", wet="Wet ground", cone="Cone", steam="Steam blasts", none="No link to magma chamber")),
        S("points", """• _Rootless cones_: lava crosses wet ground; steam explosions build craters with no magma chamber below (Mývatn, Iceland; NASA).
          • _Lonar_, Maharashtra: a _meteorite impact_ crater in Deccan basalt, 1.8 km wide, 150 m deep (Chandran et al.).
          • _Mud volcano_: NCERT says gases and pressure push mud up at Baratang, Andaman, "India's only" one.""",
          ["D2"], [P + "03", P + "07", P + "09"]),
        S("head", "2. Borderline features (our reading)", ["D3"], [P + "04"]),
        S("points", """• Some exam-prep notes list _geysers_ and _fumaroles_ here; no publisher we read does. USGS ties them to heat around a magma reservoir in young volcanic regions, "sometimes called dying volcanoes".
          • _Fumarole_: a vent releasing volcanic gas even when not erupting. _Geyser_: Old Faithful erupts about every 65 minutes on average; the mechanism is "not completely understood" (USGS).""",
          ["D3"], [P + "04", P + "05", P + "06"]),
        S("close", """Treat the term as a convenience; judge each feature by its cause, not its shape.""",
          ["D3"], []),
    ],
    weak=[
        dict(text="Pseudovolcanic is defined as in the textbook.", miss="we found no definition at any publisher; the working definition must be labelled ours",
             claims=[]),
        dict(text="Lonar is a volcanic crater.", miss="Lonar is a meteorite impact crater in Deccan basalt",
             claims=[P + "07"]),
        dict(text="Lists geysers as pseudovolcanic without comment.", miss="USGS ties them to heat from young volcanic activity; they are borderline",
             claims=[P + "04"]),
        dict(text="Treats the mud volcano as magma-driven.", miss="NCERT says gases and pressure push the mud up",
             claims=[P + "09"]),
    ],
    cousins=["2019 Geography Paper I Q1(a): phreatic eruptions and their consequences",
             "2021 GS I Q7: global occurrence of volcanic eruptions in 2021 and their impact on regional environment"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty seventeen. Geography optional, Paper One, ten marks, one hundred and fifty words.
          Write a note on pseudovolcanic features.
          Here is the catch. The key word has no definition at any publisher we could open.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2017, Geography Paper I, Q1(a)'.
          The word 'pseudovolcanic' glows faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. A note means short facts, in order. So there are three jobs.
          What does the word mean? Which features fit? And which features are borderline?""",
          "Question X-ray: 'note' highlighted; three empty boxes D1, D2, D3 (plant: they tick at the end).",
          []),
        T("b02", "but", "idea",
          """First, the catch. We searched what we could open: universities, surveys and glossaries. We found no definition of the word.
          So the safe move is a working definition, and to label it as ours.""",
          "A search card with a red 'definition not found'; a stamp 'our working definition' appears.",
          []),
        T("b03", "therefore", "idea",
          """Our working definition is simple. Looks volcanic, but no magma erupts at that spot.
          First example: a rootless cone. NASA shows lava crossing wet ground. Steam explosions build the cone. No magma chamber lies below.""",
          "Lava over a swamp; steam bursts; a cone rises with a cut-off pipe below.",
          [P + "03"]),
        T("b04", "therefore", "idea",
          """Second, Lonar in Maharashtra. It is a crater in Deccan basalt, but it is a meteorite impact crater.
          It is about one point eight kilometres wide and a hundred and fifty metres deep. The lead author is Chandran.""",
          "A crater outline with width and depth markers; a meteor arrow.",
          [P + "07"]),
        T("b05", "therefore", "idea",
          """Third, the mud volcano at Baratang, in the Andaman Islands. NCERT calls it India's only one.
          NCERT says gases and pressure push the mud up.""",
          "A mud cone bubbling beside a small Andaman map.",
          [P + "09"]),
        T("b06", "but", "idea",
          """But now a borderline case. Some exam-prep notes list geysers and fumaroles here. No publisher we read does.
          USGS ties them to heat from young volcanic activity. It says they are sometimes called dying volcanoes.""",
          "Two columns: 'exam notes' lists geyser; 'USGS' lists it under volcanic heat (pay-off of the plant).",
          [P + "04"]),
        T("b07", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open with the label. We found no definition, so here is our working definition.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          []),
        T("b08", "therefore", "sheet",
          """Section one is the look-alikes. Draw the rootless cone in a minute. Then add Lonar and Baratang, each with its source.""",
          "Fig. 1 draws stroke by stroke; section 1 writes in; box D2 fills.",
          [P + "03", P + "07", P + "09"]),
        T("b09", "therefore", "sheet",
          """Section two is the borderline cases. Geysers and fumaroles are volcanic heat, says USGS.
          Call them secondary, not false. Add Old Faithful's sixty-five minutes.""",
          "Section 2 writes in; box D3 fills; the conclusion follows; word counter near 150.",
          [P + "04", P + "05"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It quotes a definition we could not source. It calls Lonar volcanic.
          It lists geysers without comment. Both took seven minutes. Only one was honest about the gaps.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          [P + "07", P + "04"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty nineteen asked about phreatic eruptions.
          Twenty twenty-one asked about volcanic impact on regions. Learn it once: define, list, then flag the borderline cases.""",
          "The three boxes tick; two cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="How do you write a note on a term nobody defines, and what do you do when sources disagree?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Where do the sources disagree?", open="b00", close="b06"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="Is Lonar volcanic?", open="b04", close="b10"),
        ],
        turn="b06",
        plants=[("b00", "b02"), ("b01", "b11")],
        critical=[
            dict(what="No authoritative definition exists", src="searched, NOT FOUND (2017-GEO1-1A-01)"),
            dict(what="USGS ties geysers and fumaroles to young volcanic activity", src="USGS Volcanoes GIP (2017-GEO1-1A-04)"),
        ],
        fallback="If the Baratang line failed review: keep Lonar and the rootless cone only.",
        tier="broad",
    ),
)
