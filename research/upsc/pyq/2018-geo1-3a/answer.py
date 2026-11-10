"""Pilot 1, format A (One Question): UPSC CSE (Main) 2018, Geography optional Paper I, Q3(a). Draft 1, 7 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the GEO-07 ledger (research/upsc/GEO-07/claims.csv) and the answer-video ledger (research/upsc/pyq/claims.csv).
Numbers are words in `say` and numerals on the sheet. The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {})


A = dict(
    id="PYQ-2018-GEO1-3A",
    fmt="A",
    title="The Monsoon Question UPSC Keeps Asking: Origin, Progress, Retreat, Economy",
    question=dict(year=2018, paper="geo1", label="Geography optional Paper I", q=3, part="a", marks=20,
                  text="Explain the origin, progress and retreat of the Indian monsoon and discuss its impact on the Indian economy.",
                  pdf="research/upsc/_pyq/mains/2018_geo1.pdf", page=3),
    budget=(300, 350),
    minutes=14,
    budget_note="our working budget; UPSC prints no word limit for this question (P003); 14 minutes is our arithmetic from 3 hours for 250 marks (P002)",
    ledgers=["GEO-07", "pyq"],
    demands=[
        dict(id="D1", text="Explain the origin (the mechanism: why it forms)"),
        dict(id="D2", text="Explain the progress (onset, advance, branches, spells)"),
        dict(id="D3", text="Explain the retreat (withdrawal and what follows)"),
        dict(id="D4", text="Discuss the impact on the Indian economy (more than one effect, with figures)"),
    ],
    sheet=[
        S("intro", """The Indian monsoon is a _seasonal reversal of winds_ (Arabic mausim, 'season'). June-September brings
          about 75% of India's annual rain.""",
          ["D1"], ["M001", "M002", "M085"]),
        S("head", "1. Origin: no single theory", ["D1"], ["M004", "M122"]),
        S("points", """• _Thermal concept_ (Halley, 1686): land heats faster than sea; a heat low over north-west India and a
          monsoon trough draw in moist sea air. • _Dynamic concept_ (Flohn, 1951): the ITCZ shifts north with the sun, to about
          20-25°N in July; today's view sees the monsoon as this rain belt's seasonal migration. • Cross-equatorial flow: trades
          from the Mascarene High cross the equator at 40-60°E, turn south-west and ride the _Somali jet_.
          • _Tibetan heating_ (Koteswaram, 1958): the heated plateau builds the _Tropical Easterly Jet_ aloft.
          • _El Niño_ tends to weaken it.""",
          ["D1"], ["M007", "M015", "M016", "M119", "M013", "M095", "M011", "M020", "M026", "M018", "M120", "M121", "M021", "M073"]),
        S("diagram", """India outline; Mascarene High south of the equator; arrows crossing the equator and bending
          north-east (Somali jet); Arabian Sea and Bay of Bengal branches; heat low and monsoon trough; dashed upper-air
          easterly jet; ITCZ line at 20-25°N in July.""",
          ["D1", "D2"], ["M020", "M018", "M042", "M015", "M016", "M021", "M013"], label="Fig. 1: How the monsoon arrives",
          labels=dict(equator="Equator", high="Mascarene High (about 30°S)", jet="Somali jet", bay="Bay of Bengal branch",
                      arabian="Arabian Sea branch", low="Heat low", trough="Monsoon trough", tej="TEJ (upper air)")),
        S("head", "2. Progress", ["D2"]),
        S("points", """• Onset: Andaman Sea about 22 May, Kerala about 1 June, often with a 'burst'. • Two branches: the Arabian
          Sea branch strikes the Western Ghats; the Bay branch turns up the Ganga and Brahmaputra valleys. • All India by
          about _8 July_ (IMD's new normal), in active spells and breaks as the trough shifts.""",
          ["D2"], ["M031", "M027", "M043", "M042", "M029", "M017", "M066"]),
        S("head", "3. Retreat", ["D3"]),
        S("points", """• Withdrawal starts in north-west India about 17 September and clears most of the country by
          15 October. • The winds reverse: the _north-east monsoon_ gives Tamil Nadu about 48% of its yearly rain.""",
          ["D3"], ["M033", "M034", "M060"]),
        S("head", "4. Impact on the economy", ["D4"]),
        S("points", """• Farms: agriculture employs nearly half of Indians; nearly half of farming is _rain-fed_.
          • Food: kharif gave 46.7% of foodgrain output in 2025-26. • Drought: an all-India deficit above 10% with 20-40%
          of the area in drought; 2002, 2009 and 2015 were El Niño years. • Water: the above-normal 2025 monsoon raised
          reservoir levels (Economic Survey 2025-26). • Prices: RBI (October 2026) names the deficient monsoon as a risk
          to rural demand and a food-price pressure.""",
          ["D4"], ["M085", "M086", "M116", "M093", "M073", "M117", "M114", "M115"]),
        S("close", """No single theory explains it; the newer view sees a migrating rain belt shaped by land, ocean and jets.
          With June-September rain down about 6% in 50 years and wet spells more intense, better forecasts (Mission Mausam)
          and stored water are India's insurance.""",
          ["D1"], ["M004", "M011", "M083", "M088"]),
    ],
    weak=[
        dict(text="The monsoon is caused by unequal heating of land and sea, like a big sea breeze.",
             miss="one cause only; NCERT Class XI itself says no single theory explains it", claims=["M003", "M004"]),
        dict(text="It covers the whole of India by 15 July.", miss="the old normal; IMD's new normal is 8 July", claims=["M029"]),
        dict(text="It retreats in October and November.", miss="vague; no withdrawal dates and no north-east monsoon", claims=[]),
        dict(text="The monsoon is very important for Indian agriculture.", miss="the economy demand gets one line and no figures", claims=[]),
        dict(text="(no diagram)", miss="a mechanism question with no diagram", claims=[]),
    ],
    cousins=["2020 Geography Paper I Q3(a): factors in the origin and development of the Indian monsoon",
             "2022 Geography Paper II Q2(a): the unpredictability of the south-west monsoon",
             "2019 Geography Paper II Q1(c): why is the Indian monsoon erratic?",
             "2017 GS I Q17: the monsoon climate that feeds more than half the world's people"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty eighteen. Geography optional, Paper One, twenty marks.
          Explain the origin, progress and retreat of the Indian monsoon, and discuss its impact on the Indian economy.
          The easy answer opens with one cause. Our own Class Eleven textbook warns against exactly that.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2018, Geography Paper I, Q3(a)'.
          The words 'origin', 'progress', 'retreat' and 'impact on the Indian economy' glow faintly (plant).""",
          ["M004"]),
        T("b01", "therefore", "question",
          """And this idea keeps coming back. In the last eleven sittings, UPSC asked about the monsoon in seven.
          So let's learn to write this one well. Then its cousins get easier.""",
          "A strip of eleven years; seven light up with small monsoon clouds.",
          ["P001"]),
        T("b02", "therefore", "xray",
          """First, read what it asks. Explain means show how and why. Discuss means weigh more than one effect.
          And there are four jobs: origin, progress, retreat, and the economy. Miss one, and the answer has a hole.""",
          """Question X-ray: 'Explain' and 'discuss' highlighted; the question splits into four empty boxes,
          D1 origin, D2 progress, D3 retreat, D4 economy (plant: the boxes tick at the end).""",
          []),
        T("b03", "but", "idea",
          """Start with the easy origin story. In summer, land heats faster than the sea.
          A low forms over the hot north-west. Moist sea air flows in, and it rains. That part is true.""",
          "Cartoon India in May: heat shimmer over Rajasthan, a low-pressure swirl, arrows from the sea.",
          ["M003", "M006", "M015"]),
        T("b04", "but", "idea",
          """But our Class Eleven book adds a warning. No single theory has fully explained the monsoon.
          And the record shows why. India is hotter in May than in July, yet the heavy rain waits for July.""",
          "The textbook page as a quote card (NCERT Class XI, India: Physical Environment); a May-July thermometer and rain gauge.",
          ["M004", "M008"]),
        T("b05", "therefore", "idea",
          """So scientists now picture something bigger. Near the equator sits a belt of rising air and rain.
          It follows the sun north each summer. By July it lies at about twenty to twenty-five degrees north, as the monsoon trough.
          The monsoon is that rain belt arriving, not a giant sea breeze.""",
          "Globe: the white cloud band slides north with the sun and settles over north India in July.",
          ["M011", "M013", "M095", "M107"]),
        T("b06", "therefore", "idea",
          """Other parts work with it. Winds from the southern Indian Ocean cross the equator and swing to the south-west.
          A fast low-level jet carries them past Somalia to our west coast. High above, an easterly jet sets in.""",
          "Atlas map, India whole: Mascarene High, arrows crossing the equator and bending; a dashed jet aloft.",
          ["M020", "M026", "M018", "M021"]),
        T("b07", "therefore", "sheet",
          """Now we write. There is no word limit, so we set our own: about three hundred words in fourteen minutes.
          Open with one line that defines the monsoon and shows the stakes.""",
          "The answer sheet appears; clock 14:00 and word counter 0. The introduction writes itself in.",
          ["P002", "P003", "M001", "M085"]),
        T("b08", "therefore", "sheet",
          """Origin gets the classic theories, each with its author. Halley's thermal concept. Flohn's dynamic concept, the shifting rain belt.
          Koteswaram's Tibetan heating, with the jet above. Then the Somali jet, and one line on El Niño.
          Underline the terms an examiner scans for.""",
          "Heading '1. Origin: no single theory'; the bullets write in with key terms underlined; box D1 fills.",
          ["M007", "M119", "M120", "M013", "M018", "M021", "M073"]),
        T("b09", "therefore", "sheet",
          """Now the diagram. Give it about a minute. India, the high below the equator, and arrows bending north-east.
          Mark the heat low, the trough, and the two branches.""",
          "Fig. 1 draws stroke by stroke in pen; labels appear as the narrator names them.",
          ["M020", "M042", "M015", "M016"]),
        T("b10", "therefore", "sheet",
          """Progress is dates and directions. The Andaman Sea about the twenty-second of May. Kerala about the first of June.
          The whole country by about the eighth of July. That date is IMD's newer normal. Many older notes still say the fifteenth.""",
          "Section 2 writes in; a small date strip; box D2 fills.",
          ["M031", "M027", "M029", "M042"]),
        T("b11", "therefore", "sheet",
          """Retreat starts in the north-west around the seventeenth of September. Most of India is clear by the fifteenth of October.
          Then the winds turn, and Tamil Nadu gets its north-east monsoon.""",
          "Section 3 writes in; box D3 fills.",
          ["M033", "M034", "M060"]),
        T("b12", "but", "sheet",
          """The last job is the one people rush. The economy needs figures, not one line.
          Nearly half of Indians work in farming. Nearly half of that farming depends on rain.
          Kharif crops give almost half the year's grain. A good monsoon fills the reservoirs.
          And a weak one shows up in prices. This October, the Reserve Bank named the deficient monsoon as a pressure on food prices.""",
          "Section 4 writes in, bullet by bullet; box D4 fills.",
          ["M085", "M086", "M116", "M117", "M114", "M115"]),
        T("b13", "therefore", "sheet",
          """End where the science is going. June to September rain has fallen about six percent in fifty years.
          Wet spells have grown more intense. So better forecasts and stored water are India's insurance.""",
          "The conclusion writes in; clock near 0:30; word counter near 300.",
          ["M083", "M088"]),
        T("b14", "but", "compare",
          """Now put it beside the easy answer. One cause. An old date. Vague on the retreat. One line on the economy. No diagram.
          Both took fourteen minutes. Only one did all four jobs.""",
          "Two sheets side by side; the weaker one's gaps ringed in red with one-line notes.",
          ["M004", "M029"]),
        T("b15", "therefore", "cousins",
          """And here is the payoff. The same frame answers its cousins. Twenty twenty asked for the factors behind the monsoon.
          Twenty twenty-two asked why it is unpredictable. Twenty nineteen asked why it is erratic.
          Learn the frame once. To see why the rain belt moves, watch our monsoon episode.""",
          "The four boxes tick; three cousin question cards slide in; end card to the GEO-07 episode.",
          ["P001"]),
    ],
    story=dict(
        promise="How do you write a twenty-mark monsoon answer that does all four jobs, and why does the easy first line fall short?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you write this answer well?", open="b00", close="b14"),
            dict(id="L2", kind="secondary", q="Why does the textbook warn against the one-cause opening?", open="b00", close="b05"),
            dict(id="M1", kind="micro", q="What are the four jobs?", open="b02", close="b13"),
            dict(id="M2", kind="micro", q="Which date do older notes get wrong?", open="b10", close="b14"),
        ],
        turn="b04",
        plants=[("b00", "b02"), ("b02", "b15")],
        critical=[
            dict(what="NCERT's 'no single theory' warning", src="NCERT Class XI India: Physical Environment ch.4 p.30 (M004)"),
            dict(what="IMD's new normal dates", src="IMD CRS Research Report 3/2020 (M029, M031, M033, M034)"),
        ],
        fallback="If the convergence-zone view failed review: answer origin with NCERT's own list of factors and its warning.",
        tier="broad",
    ),
)
