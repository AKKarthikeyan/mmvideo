"""GEO-07 Part 1, draft 3 (2 Nov 2026): the monsoon script rebuilt to docs/STORYTELLING.md v2 (AK, 2 Nov 2026,
mmvideo branch claude/keen-ride-f20uky) and the Gold Standard (docs/upsc/GOLD_STANDARD.md).
Single source of the script: render and check with scripts/upsc/script_tool.py. Numbers are words in `say`, numerals in `cap`.
`claims` are claim ids in claims.csv. `link` is the word that joins a beat to the one before it (STORYTELLING 4.1)."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="GEO-07-P1",
    title="If Heat Brings the Monsoon, Why Does the Rain Wait?",
    beats=[
        T(1, "b00", "",
          """In Nagpur, a May afternoon averages forty-three degrees Celsius. Rain falls on about four days that month.
          In July, afternoons average thirty-two degrees. Rain falls on about twenty-one days.
          So if heat brings the monsoon, why does the rain wait for the cooler months?""",
          "May: 43°C · rain on 4 days | July: 32°C · rain on 21 days | IMD normals 1991–2020",
          """First second, unlabelled: Earth from space, a thin white band of cloud near the equator (plant).
          Cut to a Nagpur rooftop in May: heat shimmer, an empty bucket beside the kid. Then July: grey sky, the bucket filling.""",
          ["M104"], "question"),
        T(1, "b01", "therefore",
          """This matters. On average, about three-quarters of India's yearly rain falls from June to September.
          Our textbooks give a clear answer for why. Here is the plan.
          We'll make that answer as strong as we can. Then we'll test it against the record.""",
          "about ¾ of the year's rain: June–September · IMD normals 1971–2020",
          "A calendar with June to September glowing. The kid opens a notebook.",
          ["M046"], "stakes"),
        T(2, "b02", "therefore",
          """The textbook answer goes like this. In summer, land heats up faster than the sea.
          Air over the hot land rises. Cooler, moist air flows in from the sea, and it brings rain.
          Our Class 9 book says the south-west monsoon is mainly caused by this unequal heating.
          It feels right. You can feel it on any beach.""",
          "\"unequal heating of land and the sea\" · NCERT Class 9",
          "The kid writes in the notebook: \"Easy. Land hot, sea cool, wind comes.\" (plant: the notebook)",
          ["M003", "M005", "M103"], "1", note="Steelman first (STORYTELLING 3.8)."),
        T(2, "b03", "therefore",
          """Why does land heat faster? Walk on a beach at noon. The sand burns your feet, but the water stays cool.
          Land heats fast and cools fast. Water heats slowly and cools slowly.""",
          "land: fast · water: slow",
          "The kid hops across burning sand (\"Ow, ow, ow!\") and steps into cool water with a sigh.",
          ["M006"], "1-2"),
        T(2, "b04", "therefore",
          """Why does air move at all? Air has weight. The weight of the air above us is called air pressure.
          Over a low-pressure area, air tends to rise. Over a high-pressure area, it tends to sink.
          Wind blows from high pressure towards low pressure.
          The faster pressure changes from place to place, the stronger the wind. That rate of change is the pressure gradient.""",
          "HIGH → LOW · pressure gradient",
          """A column of air pressing on the kid's head. Then two rooms, crowded and empty, people drifting into the empty one.
          [analogy: shows only the direction of flow; air is pushed, it does not choose]""",
          ["M105", "M103", "M096"], "2-3", "pressure gradient"),
        T(2, "b05", "therefore",
          """At the beach, this makes a daily wind. By day, air over the hot sand rises, and cooler air slides in from the sea.
          That is a sea breeze. At night the land cools faster, and the breeze turns round.""",
          "sea breeze: by day · land breeze: by night",
          "Day and night over the same beach, the arrow flipping.",
          ["M005"], "3", "sea breeze"),
        T(2, "b06", "therefore",
          """Now make the beach as big as a country. In 1686, Halley suggested exactly that.
          In his model, the monsoon was a gigantic land-sea breeze.
          In 2018, Gadgil wrote that many papers and most textbooks still treat this heating as the main driver.""",
          "Halley, 1686 · \"a gigantic land-sea breeze\"",
          "The beach zooms out until it becomes India. One giant arrow sweeps from the Indian Ocean onto the land.",
          ["M007", "M106"], "3"),
        T(2, "b07", "but",
          """But look at a map of the monsoon winds. They don't blow straight north into India. They arrive from the south-west. Why?
          Because the Earth spins. Roll a ball across a spinning roundabout, and to the riders it seems to curve.
          On Earth this is the Coriolis force. North of the equator it bends moving air to the right. South of it, to the left.
          It is strongest at the poles and absent at the equator.
          Our monsoon winds start south of the equator as the south-east trade winds. They cross the equator between about forty and sixty degrees east.
          There they bend to the right. The south-east trades become the south-west monsoon.""",
          "Coriolis: right in the north · SE trades → SW monsoon",
          """A playground roundabout from above, a rolled ball tracing a curve.
          [analogy: on Earth the curve comes from the planet's rotation; zero at the equator, strongest at the poles]
          Then an Indian Ocean map: arrows from the south-east cross the equator and swing to the south-west.""",
          ["M096", "M026"], "2-5", "Coriolis force",
          note="Exam line on screen at the end of the beat: SE trades cross the equator and become the SW monsoon."),
        T(3, "b08", "but",
          """So the textbook answer is neat. But does it pass the test? If heat drives the monsoon, more heat should mean more rain.
          In 1921, Simpson, as Gadgil reports, pointed out three problems.
          India is much hotter in May, before the monsoon, than in July.
          Simpson said the north-west, where the land is hottest, got no monsoon rain at all. Gadgil's modern maps show hardly any.
          And in years of poor rain, the land was on average hotter, not cooler.""",
          "Simpson, 1921: May hotter than July · hottest NW, no rain · poor-rain years hotter | Gadgil 2018: hardly any rain",
          """The kid on the rooftop in May with the empty bucket: \"If heat brings rain, this bucket should be full by now.\"""",
          ["M008", "M102"], "4", note="The turn (STORYTELLING 4.1, 7)."),
        T(3, "b09", "therefore",
          """Nearly a century later, Sulochana Gadgil, of the Indian Institute of Science, checked the record.
          Gadgil looked at the years 1950 to 2014. In years when India's June-to-September land temperature was higher, monsoon rain tended to be lower.
          More heat should mean more rain. In these records, it tended to go the other way.""",
          "1950–2014: hotter years, rain tended lower · Gadgil 2018",
          """Slow beat: two hand-drawn lines, one rising as the other falls, labelled ILLUSTRATION (shape only, not the data).
          Hold for a breath.""",
          ["M009"], "4"),
        T(3, "b10", "but",
          """But here is the surprise. Our Class 11 textbook already warned us.
          In its section on the nature of the monsoon, it says no single theory has fully explained it.
          It says the breakthrough came when scientists studied the whole planet, not just one region.
          So is heat useless? Hold that question. First, let's zoom out.""",
          "\"no single theory\" · NCERT Class 11",
          "The kid flips the textbook. A small note glows. Citation label only, never the page itself.",
          ["M004"], "4"),
        T(4, "b11", "therefore",
          """Remember the very first picture in this video? That white band.
          Around the tropics runs a band where winds come together and rain falls.
          There, strong heating makes warm, moist air rise, up to about fourteen kilometres.
          High up, that air flows towards the poles. Near thirty degrees north and south, it sinks and builds high pressure.
          Then it flows back along the surface towards the equator. These returning winds are the trade winds.
          Think of a pot of water on a stove. It rises in the middle, spreads, sinks at the sides and flows back.
          This giant loop is called the Hadley cell.""",
          "rising air · sinking near 30° · Hadley cell",
          """The same view as the first frame, now glowing. Arrows rise, flow out, sink near 30°, return low down.
          [analogy: a real loop of rising and sinking, but the planet's spin bends the returning winds, so the trade winds slant]""",
          ["M107", "M097", "M013"], "1-3", "Hadley cell"),
        T(4, "b12", "therefore",
          """Where the trade winds from both sides meet, air is forced up. And rising air is what makes cloud and rain.
          That meeting zone is called the Inter-Tropical Convergence Zone, or ITCZ. It is the planet's rain belt.""",
          "ITCZ = the rain belt",
          "Trade-wind arrows from north and south meet; a line of cloud towers grows where they meet.",
          ["M097", "M103", "M013"], "2-3", "ITCZ"),
        T(4, "b13", "therefore",
          """Here is the key. The belts move with the sun. In our summer they shift north. In our winter they slide back south.
          Our Class 11 book says the most pronounced effect of this shift is seen in the monsoons.
          NCERT puts the ITCZ near the equator. In July it sits at about twenty to twenty-five degrees north, over the Gangetic plain.
          There it has a special name: the monsoon trough.
          So: the sun moves north, the belt moves north, and the rain moves with it.""",
          "July: 20–25° N · monsoon trough",
          "The year runs fast. The sun's overhead spot slides north; the cloud belt slides after it like a shadow and settles over India.",
          ["M095", "M098", "M013"], "3", "monsoon trough"),
        T(5, "b14", "therefore",
          """So here is the newer picture. On this view, the monsoon is not India sucking in a sea breeze.
          It is the tropical rain belt moving north with the sun. It settles over our subcontinent for the season.
          A 2020 review by Geen and colleagues says theory and observations support this view of monsoons.
          They call it a shift in the understanding.
          Gadgil goes further, and argues that the sea-breeze view should be abandoned. Not everyone agrees.""",
          "newer view: the rain belt moving north · \"a shift in the understanding\"",
          """Peak. Split screen: the giant sea-breeze arrow fading on one side; the glowing belt sliding up over India on the other,
          pulling the trade winds across the equator behind it. Music rises here.""",
          ["M011", "M107", "M010", "M007"], "3-4", note="Peak (STORYTELLING 4.4)."),
        T(5, "b15", "but",
          """But does heat play no part at all? Some scientists say it still does.
          Over the deserts of north-west India and Pakistan, summer heat makes a shallow low called the heat low.
          It is only about one and a half kilometres deep.
          IMD links an intense heat low, to some extent, with a good monsoon.
          Wu and colleagues found something in 2012. Land-sea heating still sets the monsoon south of about twenty degrees north.
          Gadgil reads the evidence differently. Scientists still argue about how much heat matters.""",
          "heat low · \"to some extent\" · open question",
          "A shimmering dome over the north-west, a thin swirl near the ground, clear sky above.",
          ["M015", "M108", "M099", "M010"], "4", "heat low"),
        T(6, "b16", "therefore",
          """From that heat low, the monsoon trough stretches to the head of the Bay of Bengal.
          When the trough sits south of its usual place, the monsoon is active over most of India.
          When it moves north, most of India has break conditions, and the Himalayan foothills get heavy rain.
          We follow the breaks in part two.""",
          "trough south: active · trough north: break",
          "A line from the heat low to the Bay of Bengal, sliding south (rain over India) then north (rain on the foothills).",
          ["M016", "M017"], "3"),
        T(6, "b17", "therefore",
          """Two more parts drive the winds. Far south of the equator sits a high-pressure area called the Mascarene High.
          When it strengthens, it boosts a fast, low wind that crosses the equator.
          That wind is the Somali jet. It blows only about one to one and a half kilometres up.
          It reaches India's west coast in June, and is strongest in July.
          When it strengthens, the monsoon strengthens over peninsular India.""",
          "Mascarene High (30° S, 50° E) · Somali jet · June → July",
          "An Indian Ocean map: an H near Madagascar; a low ribbon of wind runs up the Somali coast and bends east to India.",
          ["M020", "M018", "M019"], "2-3", "Somali jet"),
        T(6, "b18", "but",
          """But one more piece of geography sits in the north. The Himalaya. Our textbook calls it a climatic divide.
          It shields India from cold northern winds, and traps the monsoon winds inside the subcontinent.
          North of the Himalaya lies the Tibetan Plateau, rising over four and a half kilometres.
          How it matters is still argued. IMD's 2025 report calls it both a barrier to the winds and a heat source.
          Boos and Kuang's models fit another idea. The Himalaya and nearby ranges act as a wall that keeps cold, dry air out.
          Wu and colleagues argue that plateau heating drives the eastern part of the South Asian monsoon.
          This one is still open.""",
          "Himalaya: shield + trap · Tibetan Plateau: heater, or the Himalaya as a wall? · open",
          "The Himalaya rises like a wall; cold air bumps into it from the north; clouds pile up on the Indian side. [analogy: \"wall\" and \"heater\" are figures of speech]",
          ["M025", "M111", "M024", "M100", "M099"], "4", note="Unknown shown as its own beat (STORYTELLING 4.12)."),
        T(6, "b19", "but",
          """One more piece sits very high up. In July, a fast wind blows from east to west high above India.
          It is the Tropical Easterly Jet, stretching from Vietnam to west Africa, near the latitude of Chennai.
          The monsoon often arrives suddenly, with thunder and lightning. This is called the burst.
          Our textbook says the jet streams changing at this time are held responsible for the burst.
          A 2007 review lists the jet changes among the circulation changes that come with the onset. It does not say they cause it.
          Whether the jets trigger the burst is not settled in what we read.""",
          "Tropical Easterly Jet · the burst · NCERT: held responsible · 2007 review: not stated as cause",
          "A thin fast stream high over India near Chennai's latitude; below, the sky splits open in thunder.",
          ["M021", "M043", "M022", "M110"], "4", "Tropical Easterly Jet"),
        T(7, "b20", "therefore",
          """So why does the rain wait, if heat brings the monsoon? On the newer view, land heat is not what brings it.
          On that view, the rain comes when the rain belt arrives overhead, and rising air fills the sky with cloud.
          Our textbook says day temperatures fall by five to eight degrees Celsius between mid-June and mid-July.
          And Gadgil's maps put the hottest land in the north-west, where there is hardly any monsoon rain.
          On Gadgil's reading, the rain follows the belt, not the heat.
          For the exam, write it this way. The south-east trades cross the equator and become the south-west monsoon.
          The classic explanation is unequal heating of land and sea.
          A 2020 review supports seeing the monsoon as the tropical convergence zone shifting north. Over India in July, NCERT calls it the monsoon trough.
          The heat low, the Mascarene High and the Somali jet are linked to its strength.
          The Himalaya shield and trap the winds. The roles of the jets and of Tibet are still debated.""",
          "the rain follows the belt · exam card: 6 lines",
          """The kid's notebook from the start: \"Easy.\" is crossed out; the answer fills the page, one line per sentence.
          The rooftop bucket is full.""",
          ["M043", "M102", "M010", "M026", "M003", "M011", "M107", "M013", "M015", "M108", "M020", "M018", "M019", "M025", "M022", "M024"], "5",
          note="Payoff. The exam card is part of the payoff, not a recap after it (AK, 2 Nov 2026: keep it inside)."),
        T(7, "b21", "therefore",
          """In part two, we follow the monsoon across India.
          Where it lands first, where it reaches last, and what normal rain really means.""",
          "next: the monsoon's journey",
          "The kid closes the notebook and looks up at the sky, imagining the glowing belt overhead.",
          ["M029"], "handoff"),
    ],
    story=dict(
        promise="If heat brings the monsoon, why does the rain wait for the cooler months?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="If heat brings the monsoon, why does the rain wait?", open="b00", close="b20"),
            dict(id="L2", kind="secondary", q="Does the textbook heating answer pass the test?", open="b01", close="b09"),
            dict(id="L3", kind="tertiary", q="Then does heat play any part at all?", open="b10", close="b15"),
            dict(id="M1", kind="micro", q="Why does land heat faster than the sea?", open="b02", close="b03"),
            dict(id="M2", kind="micro", q="Why do the winds arrive from the south-west?", open="b06", close="b07"),
            dict(id="M3", kind="micro", q="What is the white band in the first picture?", open="b00", close="b11"),
            dict(id="M4", kind="micro", q="Tibetan Plateau: heater, or the Himalaya as a wall?", open="b18", close="b20"),
            dict(id="M5", kind="micro", q="Do the jets trigger the burst?", open="b19", close="b20"),
        ],
        turn="b08",
        plants=[("b00", "b11"), ("b02", "b20"), ("b00", "b20")],
        critical=[
            dict(what="NCERT's heating explanation and its own 'no single theory' warning", src="NCERT Grade 9 Part 1 ch.3 p.49; Class XI India: Physical Environment ch.4 pp.29-30 (M003, M004)"),
            dict(what="Observations against the heating view", src="Simpson 1921 via Gadgil 2003 p.437 (M008); Gadgil 2018 pp.7, 10-11 (M009, M102)"),
            dict(what="The convergence-zone view", src="Geen et al. 2020, Rev. Geophys., abstract and p.32 (M011, M107)"),
        ],
        fallback="If the newer view failed review: what does NCERT itself say about why no single theory explains the monsoon?",
        tier="broad",
    ),
)
