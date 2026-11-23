# F14 "Build It" TEST, Indica Atlas: Gol Gumbaz (script: docs/geo/topics/F14_test_gol_gumbaz_DRAFT.md v2, approved lines
# word for word; claims ledger rows 1-13). Format rules: docs/storytelling/F14_BUILD_IT.md (B1-B11).
# Expected gate FAILs: ~60 s / ~150 words is outside the Reveal Loop 24-38 s / 65-100 word band, and there is no loop
# line (the video ends on the reveal card, B11). The name is held back until b9 (B2).
# Numbers are spelt out in captions except "38 metres" (allowed on screen: "38 M" and "10+" only).
S["ia-golgumbaz"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Build It", pause=0.2, cast={"N": {"speed": 0.9}},   # slower than the loop Shorts: AK 24 Oct "followable pacing"
    title="Build a sultan's tomb with no pillar inside",
    send="You build a giant tomb one problem at a time, and only at the end find out which famous building you made.",
    beats=[
        # L1 (tomb of Sultan Muhammad Adil Shah), L2 (square hall, "giant cube")
        ("b1", [("If you want", "If you want"), ("to bury", "to bury"), ("a sultan", "a sultan"), ("under one", "under one"), ("giant room,", "giant room,"),
                ("you raise", "you raise"), ("four thick walls.", "four thick walls."), ("This is", "This is"), ("a cube.", "a *cube.*")],
         {"open": "If you want", "walls": "you raise", "cube": "This is a cube"}, "N"),
        # L3 (no intermediate supports of any kind)
        ("b2", [("But you want", "But you want"), ("no pillar inside.", "no pillar inside."), ("So you", "So you"), ("cover it", "cover it"), ("with one dome.", "with one *dome.*")],
         {"pillar": "no pillar", "cover": "So you cover", "dome": "one dome"}, "N"),
        # L4 (eight intersecting arches, ASI-1), L5 (pendentives = curved corner surfaces, Cousens)
        ("b3", [("But a dome", "But a dome"), ("is round,", "is round,"), ("and your walls", "and your walls"), ("are square.", "are square."),
                ("So you cross", "So you cross"), ("eight arches", "eight arches"), ("until the square", "until the square"), ("becomes a circle.", "becomes a circle."),
                ("These curved corners", "These curved corners"), ("are pendentives.", "are *pendentives.*")],
         {"round": "is round", "square": "are square", "arches": "So you cross", "circle": "becomes a circle", "pend": "These curved"}, "N"),
        # L6 (Fergusson: arch masonry's weight acting inwards counters the dome's thrust; "can" push, see conflict 1), L7 (gallery on that platform)
        ("b4", [("But a", "But a"), ("heavy dome", "heavy dome"), ("can push", "can push"), ("walls outward.", "walls outward."), ("So the arches", "So the arches"),
                ("lock into", "lock into"), ("a mass", "a mass"), ("of masonry", "of masonry"), ("that leans inward", "that leans inward"), ("and pushes back.", "and pushes back."),
                ("Its top", "Its top"), ("becomes the gallery.", "becomes the *gallery.*")],
         {"push": "can push", "mass": "lock into", "inward": "that leans", "back": "and pushes back", "gal": "Its top"}, "N"),
        # L8 (thirty-year reign not enough to complete), L9 ("seems to have died while the plastering ... was in progress"; hedge kept)
        ("b5", [("But thirty years", "But thirty years"), ("on the throne", "on the throne"), ("is not enough.", "is not enough."), ("The sultan", "The sultan"),
                ("seems to", "seems to"), ("have died", "have died"), ("with the walls", "with the walls"), ("still being plastered.", "still being *plastered.*")],
         {"reign": "But thirty", "sultan": "The sultan", "plaster": "with the walls"}, "N"),
        # L10 (interior diameter 124 ft 5 in = 37.92 m; inner span, not the 144 ft outside)
        ("b6", [("The dome is", "The dome is"), ("thirty-eight metres", "*38 metres*"), ("across inside.", "across inside.")],
         {"ruler": "The dome is", "n38": "thirty-eight"}, "N"),
        # L11 (whisper heard side to side, Cousens 1916)
        ("b7", [("Whisper", "*Whisper*"), ("to the wall,", "to the wall,"), ("and you", "and you"), ("are heard", "are heard"), ("on the", "on the"), ("far side.", "far side.")],
         {"whisper": "Whisper", "heard": "and you are heard"}, "N"),
        # L12 (clap echoed over ten times, as reported), L13 (counterfeit tombs; real graves in the vault underneath)
        ("b8", [("Add a clap", "Add a *clap*"), ("that returns", "that returns"), ("more than", "more than"), ("ten times,", "ten times,"), ("and tombs", "and tombs"),
                ("that are", "that are"), ("only stand-ins.", "only *stand-ins.*"), ("The real graves", "The real graves"), ("lie in", "lie in"), ("a vault below.", "a *vault* below.")],
         {"clap": "Add a clap", "tombs": "and tombs", "vault": "The real graves"}, "N"),
        # L1 (name), reveal card: Vijayapura, Karnataka; mid-17th century CE (date conflict 3)
        ("b9", [("Congratulations.", "Congratulations."), ("You have built", "You have built"), ("Gol Gumbaz.", "*Gol Gumbaz.*")],
         {"cong": "Congratulations", "name": "Gol Gumbaz"}, "N"),
    ])
