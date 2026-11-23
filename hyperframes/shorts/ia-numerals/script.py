# Indica Atlas Week 4, W4-03 numerals (research: docs/geo/research/W4-03-numerals, G6 PASS 14 Nov 2026).
# ⚑ cultural-origin topic. Hedges kept: the belief is asked as a question (not shown to be common); "in his book" for
# zephirum (C002); al-Khwarizmi is "in Latin" (a Latin version of an Arabic-language text); "near Peshawar", never
# "India", for the find spot (C007); "Oxford's Bodleian dates some leaves as early as" (holder's statement, C006);
# the 800-1,000 years is our measurement (C008); no Baghdad, no Bugia/Béjaïa (C012 unverified); never "Arabic at all".
# People forward this because it corrects a name everyone uses every day, using the 1202 book's own words, not a slogan.
S["ia-numerals"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="Arabic numerals? Europe's 1202 book calls them Indian",
    send="Everyone uses Arabic numerals daily; the 1202 book that brought them to Europe calls them the figures of the Indians.",
    beats=[
        # belief, asked as a question (dossier: the belief is not shown to be common)
        ("b1", [("Arabic numerals.", "*Arabic numerals.*"), ("Your phone's digits.", "Your *phone's digits.*"),
                ("Made by the Arabs, right?", "Made by the Arabs, *right?*")],
         {"hook": "Arabic numerals", "phone": "Your phone", "right": "Made by"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C001 (Liber abaci, dated 1202; ch.1 "The nine figures of the Indians are these")
        ("b3", [("In twelve oh two, Leonardo of Pisa's book", "In *1202*, Leonardo of Pisa's book"), ("brought them to Europe.", "brought them to *Europe.*"),
                ("Chapter one:", "Chapter one:"), ("the nine figures of the Indians.", "\"the nine figures of the *Indians.*\"")],
         {"leo": "In twelve", "eur": "brought them", "ch1": "Chapter one", "nine": "the nine figures"}),
        # C002 (only zero is named in Arabic, in his book: "zephirum")
        ("b4", [("There, only zero's name is Arabic:", "There, only *zero's* name is Arabic:"), ("zephirum.", "\"*zephirum.*\"")],
         {"zero": "There, only", "zeph": "zephirum"}),
        # C004, C005 (Latin al-Khwarizmi, Cambridge MS Ii.6.5: "the numbering of the Indians by nine letters")
        ("b5", [("Al-Khwarizmi's arithmetic, in Latin,", "*Al-Khwarizmi's* arithmetic, in Latin,"), ("credits the Indians too.", "credits the *Indians* too.")],
         {"alk": "Al-Khwarizmi", "too": "credits the"}),
        # C007 (found near Peshawar, 1881), C006 (dot for zero, hundreds of times)
        ("b6", [("Near Peshawar,", "Near *Peshawar,*"), ("a birch-bark book uses a dot for zero.", "a birch-bark book uses a *dot* for zero.")],
         {"pesh": "Near Peshawar", "dot": "a birch-bark"}),
        # C006 (Bodleian 2017 radiocarbon test: as early as the 3rd or 4th century, some leaves)
        ("b7", [("Oxford's Bodleian dates some leaves", "Oxford's *Bodleian* dates some leaves"), ("as early as the third or fourth century.", "as early as the *3rd or 4th century.*")],
         {"bod": "Oxford's", "cent": "as early as"}),
        # C008 (our measurement: about 800-1,000 years before 1202)
        ("b8", [("About eight hundred to a thousand years", "About *800 to 1,000 years*"), ("before Leonardo.", "before Leonardo.")],
         {"gap": "About eight", "before": "before Leonardo"}),
        # C003 (his father, a public scribe at a customs house for Pisan merchants; place not named: C012 unverified)
        ("b9", [("He learnt them as a boy,", "He learnt them *as a boy,*"), ("at a customs house where his father was a scribe.", "at a *customs house* where his father was a scribe.")],
         {"boy": "He learnt", "dad": "at a customs"}),
        # loop -> b1 "Arabic numerals."
        ("b10", [("And we still call them", "And we still *call them*")], {"end": "And we still"}),
    ])
