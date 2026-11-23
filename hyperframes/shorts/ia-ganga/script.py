# Indica Atlas Week 4, W4-02 Ganga at Varanasi (research: docs/geo/research/W4-02-ganga, G6 PASS 14 Nov 2026).
# ⚑ religion: the belief beat is credited to the district page and keeps "believed" (C11); no Uttarvahini (C12).
# People forward this because it is a surprise about the river every Indian knows, and the proof is two government
# websites anyone can check (left bank + west bank).
S["ia-ganga"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="At Varanasi, the Ganga runs north",
    send="Everyone pictures the Ganga running down to the sea; two government pages put together show it turns north at Varanasi.",
    beats=[
        # C01 (Himalaya to the Bay of Bengal, about 2,525 km), C07 (whole river bears south-east)
        ("b1", [("The Ganga flows from the Himalaya", "The *Ganga* flows from the *Himalaya*"), ("down to the sea.", "down to *the sea.*"),
                ("Away from the mountains.", "Away from the mountains."), ("Right?", "*Right?*")],
         {"hook": "The Ganga", "sea": "down to the sea", "away": "Away from", "right": "Right"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C02 (CWC: Varanasi on the left bank)
        ("b3", [("The Central Water Commission", "The *Central Water Commission*"), ("puts Varanasi on the Ganga's left bank.", "puts Varanasi on the *left bank.*")],
         {"cwc": "The Central", "left": "left bank"}),
        # C03 (district: west bank)
        ("b4", [("Varanasi's own district website", "Varanasi's own *district website*"), ("says the west bank.", "says the *west bank.*")],
         {"dist": "Varanasi's own", "west": "says the west"}),
        # C04 (our inference from C02 + C03: only a north-flowing river has its west bank on its left)
        ("b5", [("Which means, at Varanasi,", "Which means, at *Varanasi,*"), ("the river is running north.", "the river runs *north.*"),
                ("Towards the Himalaya.", "Towards the *Himalaya.*")],
         {"means": "Which means", "north": "the river is running", "tow": "Towards the"}),
        # C05 (our measurement: about 15 km within 45 degrees of north, along the city)
        ("b6", [("For about fifteen kilometres,", "For about *15 km,*"), ("by our measurement.", "our measurement.")], {"fif": "For about"}),
        # C06 (58 km of river, 37 km further north; our measurement), C07 (then almost east)
        ("b7", [("Over fifty-eight kilometres of river,", "Over *58 km* of river,"), ("it ends up thirty-seven kilometres further north.", "it ends up *37 km* further north."),
                ("Then it turns east again.", "Then it turns *east* again.")],
         {"r58": "Over fifty", "n37": "it ends up", "east": "Then it turns"}),
        # C11 (credited as belief, district History page)
        ("b8", [("Here, the district says,", "Here, the district says,"), ("the river is believed", "the river is *believed*"), ("to wash away sins.", "to wash away sins.")],
         {"belief": "Here, the district"}),
        # loop -> b1
        ("b9", [("So the next time someone tells you,", "So the next time *someone tells you,*")], {"end": "So the next"}),
    ])
