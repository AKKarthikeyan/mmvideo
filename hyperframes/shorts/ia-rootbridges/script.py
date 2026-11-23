# Indica Atlas Week 4, W4-04 Living root bridges, Meghalaya (research: docs/geo/research/W4-04-rootbridges, G6 PASS 14 Nov 2026).
# The belief is uncited (dossier), so the hook is a question the viewer might hold. "Grown, and tended" (verify residual 3).
# "Around 1951" is our back-calculation (verify residual 2): on screen as "our measurement". The belief beat is credited to
# India's UNESCO file (C008). No rainfall claim, no "World Heritage" claim, no completion time.
# People forward this because it is a real Indian place where a bridge is a tree, and "unfinished after 66 years" surprises
# even people who have seen the photos.
S["ia-rootbridges"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="In Meghalaya, some bridges are grown",
    send="Everyone knows a bridge is built; in Meghalaya some are grown from living roots, and one was still unfinished after 66 years.",
    beats=[
        # belief (uncited, worded as a question)
        ("b1", [("Is a bridge always something you build?", "Is a bridge always something you *build?*"), ("Stone. Steel. Concrete.", "*Stone.* *Steel.* *Concrete.*"),
                ("Right?", "*Right?*")],
         {"hook": "Is a bridge", "stone": "Stone.", "steel": "Steel.", "conc": "Concrete.", "right": "Right"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C002 (Khasi villages), C001 (grown); "and tended" per verify residual 3
        ("b3", [("In Khasi villages of Meghalaya,", "In *Khasi villages* of *Meghalaya,*"), ("some bridges are grown, and tended.", "some bridges are *grown,* and tended.")],
         {"khasi": "In Khasi", "grown": "some bridges"}),
        # C001 (Ficus elastica, the India rubber tree)
        ("b4", [("From the living roots of rubber trees.", "From the living *roots* of *rubber trees.*")], {"roots": "From the living"}),
        # C003 (secondary growth + inosculation: stronger over time)
        ("b5", [("The roots thicken and fuse,", "The roots *thicken* and *fuse,*"), ("so the bridge gets stronger as it grows.", "so the bridge gets *stronger* as it grows.")],
         {"thick": "The roots thicken", "fuse": "and fuse", "strong": "so the bridge"}),
        # C006 (Siej #50, 66 years, not fully usable); "around 1951" = our measurement (ages as of 2017/2018)
        ("b6", [("One at Siej was started around 1951.", "One at *Siej* was started around *1951.*"),
                ("Sixty-six years later,", "*66 years* later,"), ("it still wasn't fully usable.", "it still wasn't *fully usable.*")],
         {"siej": "One at Siej", "y66": "Sixty-six", "usable": "it still"}),
        # C006 (data do not allow a statement on the time needed)
        ("b7", [("Scientists say their data can't yet tell", "Scientists say their data *can't yet tell*"), ("how long a bridge takes.", "*how long* a bridge takes.")],
         {"sci": "Scientists say", "long": "how long"}),
        # C008 (belief, attributed to India's UNESCO Tentative List file)
        ("b8", [("India's UNESCO file says, by local belief,", "India's *UNESCO file* says, by local *belief,*"),
                ("only an elder with no children", "only an *elder* with *no children*"), ("may plant the sapling.", "may plant the *sapling.*")],
         {"belief": "India's UNESCO", "elder": "only an elder"}),
        # loop -> b1
        ("b9", [("So the next time you cross a bridge, ask:", "So the next time you *cross a bridge,* ask:")], {"end": "So the next"}),
    ])
