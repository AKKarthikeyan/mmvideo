# Indica Atlas Week 4, W4-01 Greenland on a Mercator map (research: docs/geo/research/W4-01-greenland, G6 PASS 14 Nov 2026).
# The belief is not shown to be common, so the hook is a question. "On a Mercator map", never "your map". No UN footnote
# on Jammu and Kashmir, nothing on Greenland's political status. Density "rounds to zero". Every ratio: "our measurement".
# People forward this because it's a map they've looked at all their life, and in ten seconds it's caught stretching
# the truth about their own country.
S["ia-greenland"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="Is Greenland bigger than India?",
    send="A map people have looked at all their life is caught stretching Greenland to nine times India; it is really two-thirds of India.",
    beats=[
        # C004 (on a Mercator map Greenland's outline is about 8.9 times India's; our measurement), C008 (it is huge: largest island)
        ("b1", [("On a Mercator map,", "On a *Mercator* map,"), ("Greenland looks huge.", "*Greenland* looks huge."),
                ("Is it bigger than India?", "Bigger than *India?*")],
         {"hook": "On a Mercator", "huge": "Greenland looks", "india": "Is it bigger"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C004 (8.92 times on Mercator; our measurement on Natural Earth outlines)
        ("b3", [("On this map, its outline", "On this map, its outline"), ("is about nine times India's.", "is about *9 times* India's."),
                ("That's our measurement.", "Our measurement.")],
         {"onmap": "On this map", "nine": "is about nine", "ours": "That's our"}),
        # C005 (Mercator inflates area more the further from the equator: about 13.7 times at 74 N, 1.17 times at 23 N; our measurement)
        ("b4", [("But Mercator stretches land", "But Mercator *stretches* land"), ("the further it lies from the equator.", "the further from the *equator.*"),
                ("So slide Greenland", "So slide *Greenland*"), ("down to India's latitude.", "down to *India's latitude.*")],
         {"stretch": "But Mercator", "equator": "the further", "slide": "So slide", "down": "down to India"}),
        # C003 (Greenland is about two-thirds of India; our arithmetic on C001 2,166,086 and C002 3,287,263 sq km, UN table), C005 (the shrink)
        ("b5", [("It shrinks.", "It *shrinks.*"), ("Greenland is really", "Greenland is really"),
                ("about two-thirds of India's size.", "about *two-thirds* of India.")],
         {"shrinks": "It shrinks", "really": "Greenland is really", "twothirds": "about two-thirds"}),
        # C006 (an ice sheet covers about 80 percent of Greenland; NSIDC)
        ("b6", [("And about eighty percent of it", "And about *80%* of it"), ("lies under an ice sheet.", "lies under an *ice sheet.*")],
         {"eighty": "And about eighty", "ice": "lies under"}),
        # C007 (about 57 thousand people, 2023; the UN table prints density as 0 per sq km, a rounding)
        ("b7", [("About fifty-seven thousand people live there.", "About *57,000* people live there."),
                ("The U N's density figure", "The UN's density figure"), ("rounds to zero.", "rounds to *zero.*")],
         {"people": "About fifty-seven", "un": "The U N", "zero": "rounds to zero"}),
        # C008 (NSIDC: the largest island in the world); loop into b1
        ("b8", [("It's still the world's largest island.", "Still the world's *largest island.*"), ("And still,", "And still,")],
         {"island": "It's still", "end": "And still"}),
    ])
