"""GEO-07 Part 2, draft 2 (3 Nov 2026, audit fixes from SCRIPT_P2_AUDIT.md): the monsoon's behaviour, to docs/STORYTELLING.md v2 and the Gold Standard
(docs/upsc/GOLD_STANDARD.md). Same form as script_p1.py; render and check with scripts/upsc/script_tool.py.
Numbers are words in `say` (years may be digits, as in Part 1), numerals in `cap`. `claims` are ids in claims.csv."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="GEO-07-P2",
    title="What Does a 'Normal' Monsoon Really Mean?",
    beats=[
        T(1, "b00", "",
          """In a normal year, Konkan and Goa get more than three hundred centimetres of rain.
          West Rajasthan gets about thirty-three. And Tamil Nadu?
          It gets almost half its year's rain from October to December. By then, the monsoon has left most of India.
          So what does a normal monsoon really mean?""",
          "Konkan & Goa: 300+ cm a year | West Rajasthan: ~33 cm | Tamil Nadu: almost ½ in Oct–Dec · IMD",
          """The girl from Part 1 on her Nagpur rooftop, the rain bucket beside her (plant: the bucket). Three postcards
          pinned to a line: a green Konkan coast in rain, Thar dunes under a dry sky, the Chennai shore under October cloud.""",
          ["M056", "M060", "M034"], "question"),
        T(1, "b01", "therefore",
          """Every year, India's weather office sums up the whole season in one word. Normal, or not.
          Its yardstick is called the long period average. For June to September, over all of India, it is about eighty-seven centimetres.
          That word matters. Nearly half of India's farming is rain-fed, watered by rain alone.
          So we'll follow the monsoon across India. Where it lands first, where it leaves last, and what that one word hides.
          And we'll keep an eye on the rain belt from part one.""",
          "long period average (LPA), June–September: 87 cm · nearly ½ of farming rain-fed · IMD",
          """A season report card with one box: NORMAL? The girl's notebook opens to a blank India map. A faint glowing
          band of cloud from Part 1 drifts across the top of the frame (plant: the rain belt).""",
          ["M044", "M048", "M086"], "stakes", "long period average"),
        T(2, "b02", "therefore",
          """Where does it land first? Most of us would say Kerala, on the first of June.
          But it reaches the Andaman and Nicobar Islands earlier, around the twenty-second of May.
          It arrives at two doors. First the Andaman Sea and the Bay of Bengal, in May.
          Then Kerala, on the Arabian Sea side, around the first of June.
          But who decides the exact day it arrives?""",
          "Andaman & Nicobar: ~22 May · Kerala: ~1 June · IMD normals",
          "Atlas map of India and the two seas, whole India with the islands; a first pin on the Andamans, then Kerala.",
          ["M027", "M031", "M041"], "1", note="First small win, under 1:30 (STORYTELLING 3.7)."),
        T(2, "b03", "therefore",
          """The India Meteorological Department, IMD, uses a test. It starts watching after the tenth of May.
          It has a list of fourteen weather stations in and near Kerala.
          The test is passed when six in ten of them get rain on two days in a row.
          Each needs at least two and a half millimetres a day.
          The westerly winds must also run deep, and a satellite measure must show deep cloud.
          Only then does IMD declare the onset over Kerala.
          The Andaman Sea has a test of its own. For the rest of India, IMD uses judgement.""",
          "Kerala onset test (IMD): after 10 May · 60% of 14 stations · ≥2.5 mm on 2 days · deep westerlies · satellite: deep cloud (OLR)",
          """A checklist on a clipboard, ticking one box at a time over a small Kerala map dotted with stations;
          a satellite above sees towering cloud. Then the clipboard over the rest of India shows a question mark: judgement.""",
          ["M035", "M037"], "2", "onset", note="Exposition as the game: the rule is a test with a pass mark."),
        T(2, "b04", "therefore",
          """Once it lands, the monsoon moves north in two arms.
          The Arabian Sea branch climbs up the west coast. The Bay of Bengal branch turns north into Bengal and the north-east.
          It reaches Mumbai around the eleventh of June, and Delhi around the twenty-seventh.
          It does not glide. It moves in surges, and IMD draws its front edge each day.
          That line is called the northern limit of the monsoon.
          On average, by the eighth of July, it covers the whole country.""",
          "Mumbai ~11 June · Delhi ~27 June · whole country ~8 July · northern limit of monsoon (NLM)",
          """Two arms of cloud advance over the atlas map in jumps, not a smooth slide; a dashed front line steps north
          day by day with the dates. Whole India shown; no date lines drawn outside India.""",
          ["M042", "M032", "M038", "M029"], "2", "northern limit of the monsoon"),
        T(2, "b05", "but",
          """But open our Class 11 textbook, and it says mid-July for the whole country.
          That is the old normal, worked out from the years 1901 to 1940.
          In 2020, IMD worked out new normal dates from more recent decades.
          The whole-country date moved a week earlier, from the fifteenth of July to the eighth.
          A normal date is only an average. In 2025, it covered the whole country on the twenty-seventh of June.
          The dates matter: farmers sow their kharif crops when the monsoon arrives.""",
          "NCERT: mid-July (old normal, 1901–40) · IMD new normal: 8 July · 2025: 27 June · kharif sown with the onset",
          """The girl's textbook page shows "mid-July"; a sticky note on it reads "old normal". A calendar flips from
          15 to 8 July. Then a farmer sowing in a wet field as the clouds arrive.""",
          ["M028", "M029", "M030", "M040", "M087"], "3", "kharif",
          note="Correction named with its source and date (Gold Standard rule 6)."),
        T(3, "b06", "therefore",
          """Now watch where the rain falls. The Arabian Sea branch runs straight into the Western Ghats.
          The moist air is pushed up the slopes. It cools, and its water falls out as rain.
          Rain made this way, by mountains, is called orographic rain.
          NCERT puts the windward side at two hundred and fifty to four hundred centimetres.
          Over the top, the air sinks and warms. Little rain falls east of the Ghats.
          That dry side is called the rain shadow.""",
          "orographic rain · windward Ghats: 250–400 cm (NCERT) · rain shadow to the east",
          """Cut-away slice of the Western Ghats in atlas relief: wet wind climbing the west face, cloud piling and
          raining; on the east side dry, warm air sliding down over brown land.""",
          ["M058"], "2", "orographic rain"),
        T(3, "b07", "therefore",
          """Textbooks name three kinds of rain. Convectional rain comes from warm air rising by itself.
          Orographic rain comes from mountains. Cyclonic rain comes from storms.
          The Bay branch meets its own mountains, the hills of the north-east.
          Cherrapunji, in the Meghalaya hills, gets more than ten metres of rain in a year, says NCERT.
          Stack that water up, and it would stand about as tall as a three-storey house.""",
          "3 kinds of rain: convectional · orographic · cyclonic | Cherrapunji: 1,080+ cm a year (NCERT)",
          """Three small panels: a rising warm bubble, a mountain, a swirling storm. Then the Meghalaya hills in mist,
          and a column of water beside a three-storey house, taller than its roof. [chip: ILLUSTRATION]""",
          ["M059", "M057", "M042", "M113"], "2", "convectional rain",
          note="Station figure from NCERT, consistent with IMD's Cherrapunji normal (see claim note). No 'world record' claim."),
        T(3, "b08", "but",
          """But at the other end of the map, little rain falls.
          West Rajasthan gets about thirty-three centimetres in a whole year.
          Konkan and Goa get about nine times as much, or more.
          And look at the south-east coast. Our Class 11 textbook says the Tamil Nadu coast remains dry in this season.
          Remember that coast. We will come back to it.""",
          "West Rajasthan: ~33 cm a year · Konkan & Goa: 300+ cm (~9×) · NCERT: Tamil Nadu coast \"remains dry\"",
          """The whole atlas map of India shades wet to dry: deep green Konkan and the north-east, pale sand in West Rajasthan.
          A small pin with a question mark lands on the Tamil Nadu coast (plant: the coast).""",
          ["M056", "M061", "M042"], "2", note="~9x is our arithmetic: 300 / 33 = 9.1; Konkan is 'more than 300'."),
        T(4, "b09", "but",
          """But even where it rains a lot, it does not rain every day.
          The monsoon is not one long rain. It comes in spells.
          Wet spells are called active spells. Dry gaps are called breaks.
          In a break, the trough from part one moves north, to the Himalayan foothills.
          Rain falls off over much of India, and the foothills get heavy rain.
          But what exactly counts as a break?""",
          "active spell · break · in a break the trough shifts to the Himalayan foothills",
          """The rooftop bucket fills in a downpour, then sits in sun for days. A map inset shows the trough line sliding
          north to the foothills, the rain moving with it.""",
          ["M066", "M069", "M112"], "2", "break"),
        T(4, "b10", "therefore",
          """Our textbook says a break is when rain fails for a week or more.
          IMD's test is different. It looks for the trough and the winds, not a count of dry days.
          A study of the years 1951 to 2007 measured spells by its own rule.
          Breaks lasted longer than active spells. About a third of breaks lasted a week or more.
          In about one year in four, July and August had no break at all.
          And seasons with many break days tend to be poor seasons.
          So where does most of the rain come from?""",
          "NCERT: a week or more without rain · IMD: trough + winds | 1951–2007: ⅓ of breaks ≥ 1 week · no July–August break in ~¼ of years",
          """A strip calendar of one July, blue wet days and sand-coloured breaks; beside it, a tally of many seasons with
          one in four marked "no break". [Rajeevan, Gadgil and Bhate 2010]""",
          ["M066", "M067", "M069"], "3"),
        T(4, "b11", "therefore",
          """Much of it comes from low-pressure systems that form over the monsoon.
          The stronger ones are called monsoon depressions.
          On average, about two form in each month of the season.
          They bring most of the monsoon's rain.
          July and August are the wettest months. Between them, they bring more than three-fifths of the season's rain.""",
          "monsoon depressions: ~2 a month · they bring most of the rain · July 32% + August 29% of the season",
          "A slow swirl of cloud crossing the atlas map from the Bay side inland; four month bars, July and August tallest.",
          ["M071", "M046"], "2", "monsoon depression", note="61.7% is our sum of IMD's 32.3 and 29.4."),
        T(5, "b12", "therefore",
          """So how does it leave? The end, like the start, is decided by a test.
          IMD will not declare a withdrawal before the first of September.
          North-west India then needs five days without rain, much drier air and a change in the winds.
          On average, the monsoon starts leaving the north-west around the seventeenth of September.
          Our Class 11 book says it leaves western Rajasthan by the first week of September. Again, that is the old normal.
          By the fifteenth of October, it has left most of the country.""",
          "withdrawal: not before 1 Sept · 5 dry days + dry air + wind change · NW from ~17 Sept (NCERT: 1st week, old) · most of India by ~15 Oct",
          """The clipboard checklist again, now for leaving; the dashed front line steps back south over the atlas map,
          from the north-west down to the south.""",
          ["M036", "M033", "M034"], "3", "withdrawal"),
        T(5, "b13", "but",
          """But remember that south-east coast. Just as the monsoon leaves, Tamil Nadu's main rain begins.
          By about the fourteenth of October, easterly winds set in over the south-east.
          Around the twentieth, IMD's normal date, the north-east monsoon reaches coastal Tamil Nadu.
          Its season runs from October to December.
          Now that word, dry. From June to September, Tamil Nadu gets about a third of its year's rain.
          Relatively dry, then, but not dry. From October to December, it gets almost half.""",
          "NE monsoon onset, coastal TN: ~20 Oct · season Oct–Dec | Tamil Nadu: Jun–Sep 342 mm (~⅓) · Oct–Dec 447 mm (almost ½) of 944 mm",
          """The question-mark pin on the Tamil Nadu coast turns into a cloud; two jars fill side by side, the
          October-December jar taller than the June-September jar.""",
          ["M062", "M060", "M061"], "4", "north-east monsoon",
          note="IMD prints 35% and 48%; its own mm give 36% and 47%: say 'about a third' and 'almost half' (claim M060 note)."),
        T(5, "b14", "therefore",
          """Why then? Here the rain belt from part one comes back.
          In summer, it moved north with the sun. In autumn, it slides back south.
          When the belt and its storms sit over the south, Tamil Nadu gets its rain.
          Storms from the Bay of Bengal add to it significantly.
          In December, the belt moves further south, and the rain falls away.
          So the monsoon lands first on the Andaman Sea in May. And its rains end last in the south, as the north-east monsoon fades in December.""",
          "the rain belt (ITCZ) returns south · Bay storms add rain · Dec: belt moves south, rain falls away",
          """The glowing band from Part 1 slides back down the globe and settles over south India; Bay storms swirl in
          from the east; in December the band moves on south toward the equator.""",
          ["M063", "M095"], "4", note="The turn (STORYTELLING 4.1): the plant from Part 1 pays off in a new place."),
        T(6, "b15", "therefore",
          """Now back to that one word, normal. Add up June to September rain over all of India.
          On average, it comes to about eighty-seven centimetres.
          From year to year, it changes less than you might think. The typical swing is about a tenth of the average.
          The biggest shortfall on record was under thirty percent.""",
          "all-India June–Sept average: 87 cm · typical swing ~10% · largest deficit on record < 30%",
          "The girl's bucket on a scale marked in centimetres; a band drawn around 87; the water level wobbling inside it.",
          ["M044", "M081"], "3"),
        T(6, "b16", "but",
          """But here is the catch. IMD uses the word normal on more than one scale.
          For a forecast, normal means ninety-six to a hundred and four percent of the average.
          For a finished season over all of India, normal means within ten percent either way.
          So IMD's report called the 2025 season, at a hundred and eight percent, normal.
          On the forecast scale, the same number is above normal.
          For a district or a state, normal stretches to nineteen percent either way.
          Each scale answers a different question. So name the scale when you use the word.""",
          "IMD 'normal': forecast 96–104% · finished season ±10% · district or state ±19% | 2025: 108% = normal (season) / above normal (forecast)",
          """Three rulers side by side, each with a green 'normal' band of a different width; a marker at 108 sits inside
          one band and outside another.""",
          ["M048", "M049", "M050", "M051", "M055"], "4", note="Claim M050: scripts must name the scale."),
        T(6, "b17", "therefore",
          """So what pushes a season above or below? The best-known push comes from the Pacific Ocean.
          Every few years, the eastern Pacific warms up. This is called El Niño.
          It generally weakens India's monsoon. The droughts of 1982, 1987, 2002, 2009 and 2015 came in El Niño years.
          But El Niño is not a verdict. In 1997, a strong El Niño year, India's monsoon was normal.
          Our own Indian Ocean has a see-saw too, the Indian Ocean Dipole.
          When its west runs warmer than usual and its east cooler than usual, it tends to help.
          An exam trap: our two Class 11 books describe El Niño in opposite ways.
          The right way round is warm water replacing the cold Peruvian current.""",
          "ENSO events: every 2–7 years · generally weakens the monsoon · 1997: strong El Niño, normal monsoon | IOD positive (west warmer, east cooler than usual) = tends to help",
          """A globe turns to the Pacific; warm red water spreads east toward Peru. Five drought years drop like cards,
          then a sixth card, 1997, lands face up green. The Indian Ocean tilts like a see-saw, warm on the west.
          [chip: ANALOGY for 'see-saw']""",
          ["M073", "M074", "M075", "M076"], "4", "El Niño",
          note="The 1997 IOD explanation is UNVERIFIED (M074 note): not said."),
        T(6, "b18", "but",
          """But the average itself is not fixed. In 2022, IMD lowered the normal from about eighty-eight centimetres to under eighty-seven.
          It used newer decades of data.
          IMD calls this part of a natural cycle of wetter and drier decades.
          It says India has been in a drier phase since the 1970s.
          IMD also reports that monsoon rain fell about six percent over fifty years.
          It reports more dry spells, and more intense wet spells.
          How much of this is natural, and how much is our doing? We take that up in the climate change episode.""",
          "LPA: 88.1 cm (1961–2010) → 86.9 cm (1971–2020) · IMD: dry phase since the 1970s · ~6% fall in 50 years",
          """The girl's ruler gets a new mark, a little lower. A long strip of decades shades wetter and drier in turns.
          An open question card: "natural, ours, or both?" """,
          ["M044", "M082", "M083"], "4", note="Unknown shown as its own beat (STORYTELLING 4.12). AR6 not used: its text is unread at the published version (M084 note)."),
        T(7, "b19", "therefore",
          """So what does a normal monsoon really mean? It is one number for all of India, inside a band.
          That number hides a map: soaked Konkan, dry West Rajasthan.
          It hides a calendar: the Andaman Sea in May, Tamil Nadu's rain in October and November.
          It hides a rhythm of active spells and breaks. And the band depends on the scale you read.
          For the exam, write it this way. The monsoon reaches the Andaman Sea around the twenty-second of May, and Kerala around the first of June.
          It covers India by about the eighth of July. It starts withdrawing from the north-west around the seventeenth of September.
          Relief shapes the rain. The windward Western Ghats are wet, and the rain shadow behind them is dry.
          Tamil Nadu gets almost half its rain from the north-east monsoon, from October to December.
          The all-India normal is the 1971 to 2020 average, about eighty-seven centimetres.
          El Niño usually weakens the monsoon, but not every time. Normal is a band, not a number.""",
          "normal = a band, not a number · it hides a map, a calendar, a rhythm · exam card",
          """The girl's notebook from Part 1: a new page headed "normal = ?"; the answer fills in, one line per sentence,
          with her filled map beside it. The rooftop bucket stands full.""",
          ["M044", "M048", "M049", "M056", "M031", "M027", "M029", "M033", "M058", "M060", "M067", "M073", "M074"], "5",
          note="Payoff with the exam card inside it (AK, 2 Nov 2026)."),
        T(7, "b20", "therefore",
          """In the serial's next episode: the jet streams high above us. And the winter rain that feeds the north's winter crops.""",
          "next: jet streams and the winter rain of the north",
          "The girl looks up from the rooftop to a thin fast stream of cloud high in a winter sky.",
          ["M087"], "handoff"),
    ],
    story=dict(
        promise="What does a 'normal' monsoon really mean, when Konkan, West Rajasthan and Tamil Nadu get such different rain?",
        arc="story-circle",
        loops=[
            dict(id="L1", kind="primary", q="What does a normal monsoon really mean?", open="b00", close="b19"),
            dict(id="L2", kind="secondary", q="Where does it land first, and where does it leave last?", open="b01", close="b14"),
            dict(id="L3", kind="tertiary", q="Why does the 'dry' Tamil Nadu coast get almost half its rain after the monsoon leaves?", open="b08", close="b14"),
            dict(id="M1", kind="micro", q="Who decides the day it arrives?", open="b02", close="b03"),
            dict(id="M2", kind="micro", q="Why does the textbook say mid-July?", open="b04", close="b05"),
            dict(id="M3", kind="micro", q="What exactly counts as a break?", open="b09", close="b10"),
            dict(id="M4", kind="micro", q="Where does most of the rain come from?", open="b10", close="b11"),
            dict(id="M5", kind="micro", q="Which 'normal' does IMD mean?", open="b15", close="b16"),
            dict(id="M6", kind="micro", q="What pushes a season above or below?", open="b16", close="b17"),
            dict(id="M7", kind="micro", q="Is the average itself fixed?", open="b17", close="b18"),
        ],
        turn="b14",
        plants=[("b00", "b19"), ("b01", "b14"), ("b08", "b13")],
        critical=[
            dict(what="IMD's new normal dates of onset and withdrawal", src="IMD CRS Research Report 3/2020 pp.2, 31 (M029, M031, M033, M034)"),
            dict(what="Tamil Nadu's split between the two monsoons", src="IMD Chennai Scientific Report IMDC-SR/10 p.5 (M060, M062)"),
            dict(what="The all-India normal and IMD's scales for 'normal'", src="IMD press release 14 Apr 2022; LRF 13 Apr 2026 p.4; IMD Monsoon FAQ Q3-Q4 (M044, M048-M051)"),
        ],
        fallback="If the new dates failed review: why do textbooks and IMD give different monsoon dates?",
        tier="nurture",
    ),
)
