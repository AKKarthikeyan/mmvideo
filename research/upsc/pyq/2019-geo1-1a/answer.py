"""One Question, format A: UPSC CSE (Main) 2019, Geography optional Paper I, Q1(a). Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from this answer's ledger (research/upsc/pyq/2019-geo1-1a/claims.csv). Whakaari 2019 being 'phreatic' is our inference
(GeoNet does not use the word). The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


P = "2019-GEO1-1A-"
A = dict(
    id="PYQ-2019-GEO1-1A",
    fmt="A",
    title="Phreatic Eruptions: A 150-Word Answer for Geography Optional",
    question=dict(year=2019, paper="geo1", label="Geography optional Paper I", q=1, part="a", marks=10,
                  text="Describe phreatic eruptions and their consequences.",
                  pdf="research/upsc/_pyq/mains/2019_geo1.pdf", page=2),
    budget=(120, 150),
    minutes=7,
    budget_note="the bank lists 150 words for this question; 7 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["pyq/2019-geo1-1a"],
    demands=[
        dict(id="D1", text="Describe phreatic eruptions (what they are and how they happen)"),
        dict(id="D2", text="Give their consequences (with named events and figures)"),
    ],
    sheet=[
        S("intro", """A _phreatic eruption_ is a _steam explosion_. Water meets hot rock, and only old rock is blasted out, _not new magma_.""",
          ["D1"], [P + "01", P + "02"]),
        S("head", "1. How they work", ["D1"], [P + "02", P + "04"]),
        S("diagram", """Cross-section: cold water or crater lake above hot rock; a mineral seal; steam pressure building; blast throwing out old rock;
          a dashed magma body below, not erupted.""",
          ["D1"], [P + "02", P + "04"], label="Fig. 1: A steam blast",
          labels=dict(water="Water or crater lake", seal="Seal", steam="Steam pressure", rock="Old rock thrown out", magma="Magma below (not erupted)")),
        S("points", """• USGS: steam expands where water meets hot rock; no new magma erupts.
          • GeoNet: gas and steam build up behind a _mineral seal_ until it breaks.
          • Often weak, but can be violent: Taal 1965, La Soufriere 1975-76.""",
          ["D1"], [P + "02", P + "03", P + "04"]),
        S("head", "2. Consequences", ["D2"], [P + "08", P + "11"]),
        S("points", """• _Little warning_: GeoNet: Whakaari's explosions typically give little to no warning, ejecting hot rocks, ash and surges. 9 December 2019 (our reading: phreatic): 1-2 minutes; 22 died (WorkSafe NZ).
          • _Hazards_: Ontake, 27 September 2014 (Cabinet Office: 'difficult-to-predict phreatic'): ash 7,000 m, projectiles about 1 km, flows 2.5 km (JMA); 63 dead or missing, among climbers.
          • _Response_: entry limits stayed even at Level 1; shelters, radio followed.""",
          ["D2"], [P + "06", P + "07", P + "08", P + "10", P + "11", P + "12", P + "13"]),
        S("close", """In our reading, effects stay local (a few km) but deadly; with little warning, visitor limits matter most.""",
          ["D2"], [P + "07", P + "11", P + "13"]),
    ],
    weak=[
        dict(text="Whakaari's eruption is called phreatic by GeoNet.", miss="GeoNet defines the term but no page we read uses it for 9 December 2019; the label is our reading",
             claims=[P + "06"]),
        dict(text="Magma erupts in a phreatic blast.", miss="USGS: only old rock is thrown out, no new magma",
             claims=[P + "02"]),
        dict(text="Lists the definition and stops.", miss="the second job is consequences: deaths, warning time, safety rules",
             claims=[P + "08"]),
        dict(text="The death count is quoted from the news.", miss="we cite WorkSafe NZ's own statement for the toll",
             claims=[P + "08"]),
    ],
    cousins=["2021 GS I Q7: global occurrence of volcanic eruptions in 2021 and their impact on regional environment",
             "2017 Geography Paper I Q1(a): a note on pseudovolcanic features"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty nineteen. Geography optional, Paper One, ten marks, one hundred and fifty words.
          Describe phreatic eruptions and their consequences.
          Here is the catch. One word in the easy answer is not what the source says.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2019, Geography Paper I, Q1(a)'.
          The word 'consequences' glows faintly (plant).""",
          []),
        T("b01", "therefore", "xray",
          """Read what it asks. Describe means say what it is and how it works. Consequences means say what it did.
          So there are two jobs. What is a phreatic eruption? And what happens after one?""",
          "Question X-ray: 'describe' and 'consequences' highlighted; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the what. USGS says a phreatic eruption is a steam explosion.
          Water meets hot rock. Only old rock is blasted out. No new magma erupts.""",
          "A cutaway: water over hot rock, steam arrows, rock fragments flying, a magma blob below marked 'not erupted'.",
          [P + "01", P + "02"]),
        T("b03", "therefore", "idea",
          """GeoNet adds how the pressure builds. Gas and steam gather behind a seal of rock and mineral.
          The seal breaks when pressure beats its strength. Two agencies word the cause differently. Both say steam drives it.""",
          "A seal drawn as a lid; a pressure gauge climbs, then the lid cracks.",
          [P + "04"]),
        T("b04", "but", "idea",
          """Now the catch. Whakaari, New Zealand, nineteen nineteen, is a well-documented recent example. No GeoNet page we read says in words that it was phreatic.
          That label is our reading. So write it as ours, not as theirs.""",
          "A GeoNet page card with the word 'phreatic' missing from the Whakaari line; a small tag 'our reading' stamps beside it (pay-off of the plant).",
          [P + "06"]),
        T("b05", "therefore", "idea",
          """What did it do? The eruption lasted one to two minutes. GeoNet says Whakaari's explosions typically eject rocks, ash and surges, with little warning. WorkSafe New Zealand says twenty-two people died.""",
          "A clock face showing a short burst; cards for rocks, ash, surge; a '22' counter tagged WorkSafe NZ.",
          [P + "06", P + "07", P + "08"]),
        T("b06", "therefore", "idea",
          """Japan gives a second case. Ontake erupted on twenty-seventh September twenty fourteen.
          The ash rose about seven thousand metres. Sixty-three people were dead or missing, among climbers.
          Afterwards, entry limits stayed in place and shelters were added.""",
          "Mount Ontake outline with a plume to scale; a small hiker icon; a shelter icon.",
          [P + "10", P + "11", P + "12", P + "13"]),
        T("b07", "therefore", "sheet",
          """Now we write. One hundred and fifty words, about seven minutes.
          Open with the definition. Say steam, and say no new magma.""",
          "The answer sheet; clock 7:00 and word counter 0. The introduction writes in; box D1 fills.",
          [P + "01", P + "02"]),
        T("b08", "therefore", "sheet",
          """Section one is how it works. Draw the small diagram. Water, a seal, steam pressure, a blast of old rock.
          Add one line on strength. Taal and La Soufriere show it can be violent.""",
          "Fig. 1 draws stroke by stroke; section 1 writes in with 'mineral seal' underlined.",
          [P + "02", P + "03", P + "04"]),
        T("b09", "therefore", "sheet",
          """Section two is consequences. Whakaari first, marked as our reading, with the toll from WorkSafe.
          Then Ontake with its seven thousand metre plume and sixty-three lost. End with the new safety rules.""",
          "Section 2 writes in, bullet by bullet; box D2 fills.",
          [P + "06", P + "08", P + "11", P + "12", P + "13"]),
        T("b10", "therefore", "sheet",
          """Close in one line. In our reading, the effects stay local but are deadly. With little warning, limits for visitors matter most.""",
          "The conclusion writes in; clock near 0:30; word counter near 150.",
          [P + "07", P + "13"]),
        T("b11", "but", "compare",
          """Now the easy answer beside it. It says GeoNet called Whakaari phreatic. It says magma erupts.
          It stops at the definition. Both took seven minutes. Only one did both jobs.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          [P + "06", P + "02", P + "08"]),
        T("b12", "therefore", "cousins",
          """Here is the payoff. The same frame answers its cousins. Twenty twenty-one asked about volcanic impact on regions.
          Twenty seventeen asked about pseudovolcanic features. Learn it once: what it is, then what it did.""",
          "The two boxes tick; two cousin question cards slide in.",
          []),
    ],
    story=dict(
        promise="How do you describe phreatic eruptions and their consequences in 150 words, and which label must you mark as your own?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this in 150 words?", open="b00", close="b11"),
            dict(id="L2", kind="secondary", q="Which word is our reading, not the source's?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="What makes these eruptions deadly?", open="b05", close="b10"),
        ],
        turn="b04",
        plants=[("b00", "b04"), ("b01", "b12")],
        critical=[
            dict(what="USGS: steam-driven, no new magma", src="USGS Volcanoes GIP (2019-GEO1-1A-02)"),
            dict(what="22 deaths at Whakaari", src="WorkSafe NZ, 30 Nov 2020 (2019-GEO1-1A-08)"),
        ],
        fallback="If the Ontake figures failed review: keep the date and the Cabinet Office's 63 dead or missing only.",
        tier="broad",
    ),
)
