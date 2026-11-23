# Indica Atlas Week 4, W4-07 Puducherry (research: docs/geo/research/W4-07-puducherry, G6 PASS 15 Nov 2026).
# ⚑ borders (internal): maps draw NO borders and no territory outlines, only four town pins and one measured line.
# Belief not shown to be common (open_questions 1), so the hook is a question. "Scattered across three states",
# never "in three states"; Yanam only "beside" Andhra Pradesh; 1954 is de facto only ("in practice"); no 1963 date.
# People forward this because the one French town on the coast turns out to be four pieces, up to about 910 km apart.
S["ia-puducherry"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="Puducherry is not one place: it's four pieces",
    send="People forward this because the one French town on the coast turns out to be four pieces, up to about 910 km apart.",
    beats=[
        # C02 (Puducherry bounded by Tamil Nadu on three sides): the possible belief, asked as a question
        ("b1", [("Is Puducherry one town", "Is *Puducherry* one town"), ("on the Tamil Nadu coast?", "on the Tamil Nadu coast?")],
         {"hook": "Is Puducherry", "coast": "on the Tamil"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C01 (four former French establishments, scattered in South India)
        ("b3", [("Its own government says:", "Its own *government* says:"), ("four pieces, all once French.", "*four pieces,* all once French.")],
         {"gov": "Its own", "four": "four pieces"}),
        # C02 (bounded by Tamil Nadu on three sides), C05 (Karaikal about 130 km south)
        ("b4", [("Puducherry, with Tamil Nadu on three sides.", "*Puducherry,* Tamil Nadu on three sides."), ("Karaikal, about a hundred and thirty kilometres south.", "*Karaikal,* about *130 km* south.")],
         {"pdy": "Puducherry, with", "kkl": "Karaikal, about"}),
        # C03 (Mahe surrounded by Kerala; on the Malabar coast, shown on the pin tag)
        ("b5", [("Then all the way across:", "Then all the way *across:*"), ("Mahe, surrounded by Kerala.", "*Mahe,* surrounded by *Kerala.*")],
         {"across": "Then all the", "mahe": "Mahe, surrounded"}),
        # C04 (Yanam adjoins East Godavari district, Andhra Pradesh)
        ("b6", [("And far to the north-east:", "And far to the *north-east:*"), ("Yanam, beside Andhra Pradesh.", "*Yanam,* beside *Andhra Pradesh.*")],
         {"ne": "And far", "yanam": "Yanam, beside"}),
        # C01-C05 (one territory; pieces lie within or beside three states)
        ("b7", [("One territory,", "*One* territory,"), ("scattered across three states.", "scattered across *three states.*")],
         {"one": "One territory", "three": "scattered across"}),
        # C08 (our measurement: Mahe-Yanam 911 km straight line, said "about 910"); C01 (one Union Territory, four regions). C07 district line removed 15 Nov: Census 2011 lists four districts, conflict not resolved
        ("b8", [("Mahe to Yanam: about nine hundred and ten kilometres,", "Mahe to Yanam: about *910 km,*"), ("in a straight line.", "in a straight line."),
                ("Yet they share one government.", "Yet they share *one government.*")],
         {"km": "Mahe to Yanam", "line": "in a straight", "dist": "Yet they"}),
        # C06 (de facto transfer, 1 November 1954; "in practice" = de facto)
        ("b9", [("France handed them to India, in practice,", "France handed them to India, *in practice,*"), ("on the first of November, 1954.", "on *1 Nov 1954.*")],
         {"fr": "France handed", "date": "on the first"}),
        # loop -> b1
        ("b10", [("So, ask yourself again:", "So, ask yourself *again:*")], {"end": "So, ask"}),
    ])
