# Indica Atlas Week 4, W4-05 tea (research: docs/geo/research/W4-05-tea, G6 PASS 14 Nov 2026).
# ⚑ colonial history. Hedges kept: Fortune is never a "spy", "thief" or "smuggler" (the belief says "in disguise");
# 1834 is the Company's recognition, never "discovery"; each record names its author (Fortune; the Committee of Tea
# Culture; Lieut. Charlton, who reports second-hand: "was told"); "half of India's tea is grown in Assam" is production
# by state, our measurement, never "the Assam variety"; "almost the same latitude" is our measurement (C010).
# The belief is not shown to be common, so it is put as a question tag ("right?").
# People forward this because it flips a story they've heard about their daily chai, with the Company's own words as proof.
S["ia-tea"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="India's tea came from China? Not quite",
    send="People have heard India's tea came from China with a British plant hunter; the Company's own 1834 letter says tea was already native in Upper Assam.",
    beats=[
        # belief (not from sources; asked as a question tag), sets up C003 (Chinese dress)
        ("b1", [("India's tea came from China.", "India's *tea* came from *China.*"), ("A British plant hunter brought it out in disguise.", "A *British plant hunter* brought it out in disguise."),
                ("Right?", "*Right?*")],
         {"hook": "India's tea", "brit": "A British", "right": "Right"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C001 (Court of Directors sent him; left 20 June 1848), C003 (Chinese dress, on screen)
        ("b3", [("Robert Fortune did go, in eighteen forty-eight,", "*Robert Fortune* did go, in *1848,*"), ("for the East India Company.", "for the *East India Company.*")],
         {"fort": "Robert Fortune", "eic": "for the East"}),
        # C006 (Committee of Tea Culture, Calcutta, 24 Dec 1834: "beyond all doubt indigenous in Upper Assam")
        ("b4", [("But in eighteen thirty-four, the Company's own Tea Committee wrote", "But in *1834,* the Company's own *Tea Committee* wrote"),
                ("tea was beyond all doubt", "tea was \"*beyond all doubt*"), ("indigenous in Upper Assam.", "indigenous in *Upper Assam.*\"")],
         {"but": "But in", "comm": "the Company", "doubt": "tea was beyond", "ua": "indigenous in"}),
        # C010 (Tsong-gan-hien 27° 47' N, Fortune 1852; Manché 27° 29' N, Wilcox in JASB 1835; ~34 km apart, our measurement)
        ("b5", [("Fortune's tea hills in China", "Fortune's *tea hills* in China"), ("and an Assam tea village", "and an *Assam tea village*"),
                ("sit at almost the same latitude.", "sit at almost the *same latitude.*")],
         {"hills": "Fortune's tea", "vil": "and an Assam", "lat": "sit at"}),
        # C008 (Tea Board 2024-25 FINAL: 666.82 of 1,315.77 million kg = 50.7%, our measurement)
        ("b6", [("Today, about half of India's tea", "Today, about *half* of India's tea"), ("is grown in Assam.", "is grown in *Assam.*")],
         {"half": "Today, about", "grown": "is grown"}),
        # C007 (Lieut. Charlton, 17 May 1834, second-hand: Singphos and Khamtis drank an infusion; leaves dried in the sun)
        ("b7", [("In 1834, Lieutenant Charlton was told", "In 1834, *Lieutenant Charlton* was told"),
                ("Singpho and Khamti people already drank it,", "*Singpho* and *Khamti* people already drank it,"), ("its leaves dried in the sun.", "its leaves dried *in the sun.*")],
         {"charl": "In 1834", "sing": "Singpho and", "sun": "its leaves"}),
        # loop -> b1 "India's tea came from China."
        ("b8", [("And still, the story goes:", "And still, the story *goes:*")], {"end": "And still"}),
    ])
