# Indica Atlas, DRAFT 16 Nov 2026: "Who controls the gate to the Red Sea?" (Bab el-Mandeb). News-led map Short.
# Cleared facts only (caller's brief, 15 Nov 2026): C-A1 Reuters 15 Nov 2026 (southern Yemeni forces announced a pullout
# from the Dhubab / Bab el-Mandeb area toward Aden; the Houthis hold the area), C-A2 EIA STEO (petroleum liquids through
# Bab el-Mandeb: Q4 2025 5.4, Q1 2026 5.6, Q2 2026 8.1 million b/d), C-A3 EIA chokepoints (round the Cape adds
# approximately 15 days, Arabian Sea to Europe), G = plain map geography.
# Hard limits: never say the strait is closed, ships attacked or rerouted, or that anyone controls the water.
# Say "southern Yemeni forces", never "government-aligned". Always say the quarter with the barrels figure.
# RE-CHECK on the morning of 16 Nov before posting: the territorial position and any new ship attacks.
S["ia-babelmandeb"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Gates of the Sea", pause=0.2,
    title="Who controls the gate to the Red Sea?",
    send="A narrow gap between Yemen and Africa is the short way from India to Europe; this week its coast changed hands, but the water is another question.",
    beats=[
        # G (the strait joins the Gulf of Aden to the Red Sea); hook question
        ("b1", [("This narrow gap", "This *narrow gap*"), ("is the gate to the Red Sea.", "is the gate to the *Red Sea.*"),
                ("Who controls it?", "Who *controls* it?")],
         {"hook": "This narrow gap", "gate": "is the gate", "who": "Who controls"}),
        # G (Arabian Sea -> Gulf of Aden -> Bab el-Mandeb, between Yemen and Djibouti)
        ("b2", [("Follow a ship.", "Follow a *ship.*"), ("Arabian Sea,", "*Arabian Sea,*"), ("Gulf of Aden,", "*Gulf of Aden,*"),
                ("Bab el Mandeb,", "*Bab el-Mandeb,*"), ("between Yemen and Djibouti.", "between *Yemen* and *Djibouti.*")],
         {"follow": "Follow a ship", "arab": "Arabian Sea", "aden": "Gulf of Aden", "bab": "Bab el Mandeb", "between": "between Yemen"}),
        # G (Red Sea -> Suez -> Mediterranean)
        ("b3", [("Up the Red Sea,", "Up the *Red Sea,*"), ("through Suez,", "through *Suez,*"), ("to the Mediterranean:", "to the *Mediterranean:*"),
                ("the short way to Europe.", "the *short way* to Europe.")],
         {"up": "Up the Red", "suez": "through Suez", "med": "to the Mediterranean", "short": "the short way"}),
        # C-A3 (EIA: round the Cape adds approximately 15 days, Arabian Sea to Europe)
        ("b4", [("The long way:", "The *long way:*"), ("round Africa's Cape of Good Hope.", "round Africa's *Cape of Good Hope.*"),
                ("About fifteen days longer,", "About *15 days* longer,"), ("by E I A's estimate.", "by EIA's estimate.")],
         {"long": "The long way", "cape": "round Africa", "fifteen": "About fifteen", "eia": "by E I A"}),
        # C-A2 (EIA STEO: petroleum liquids through Bab el-Mandeb, Q2 2026 = 8.1 million b/d)
        ("b5", [("Oil too:", "*Oil* too:"), ("about eight point one million barrels a day,", "about *8.1 million* barrels a day,"),
                ("April to June twenty twenty-six.", "April to June *2026.*")],
         {"oil": "Oil too", "barrels": "about eight point", "q2": "April to June"}),
        # G (India-Europe cargo on the short way uses this gate; Gulf oil straight to India's west coast goes via Hormuz, not here)
        ("b6", [("Cargo between India and Europe", "Cargo between *India* and *Europe*"), ("uses this gate.", "uses this gate."),
                ("Gulf oil straight to India's west coast", "Gulf oil straight to India's *west coast*"), ("doesn't:", "*doesn't:*"),
                ("that's Hormuz.", "that's *Hormuz.*")],
         {"india": "Cargo between", "uses": "uses this gate", "gulf": "Gulf oil", "hormuz": "that's Hormuz"}),
        # C-A1 (Reuters, 15 Nov 2026: southern Yemeni forces announced a pullout from the Dhubab area, toward Aden; Houthis hold the area)
        ("b7", [("Reuters reports southern Yemeni forces", "Reuters: *southern Yemeni forces*"),
                ("announced a pullout from the Dhubab area,", "announced a *pullout* from the *Dhubab* area,"),
                ("toward Aden.", "toward *Aden.*"), ("The Houthis hold the area.", "The *Houthis* hold the area.")],
         {"reuters": "Reuters reports", "dhubab": "announced a pullout", "toaden": "toward Aden", "houthis": "The Houthis"}),
        # Framing (no claim): holding the coast is not controlling the water
        ("b8", [("So the Houthis control the gate?", "So the Houthis *control* the gate?"), ("Not quite.", "*Not quite.*"),
                ("Holding the coast", "Holding the *coast*"), ("isn't controlling the water.", "isn't controlling the *water.*")],
         {"so": "So the Houthis", "nq": "Not quite", "coast": "Holding the coast", "water": "isn't controlling"}),
        # Open question; loop into b1 ("So keep watching / this narrow gap")
        ("b9", [("Will ship movements actually change?", "Will ship movements *actually change?*"), ("Still open.", "Still *open.*"),
                ("So keep watching", "So keep watching")],
         {"will": "Will ship", "open": "Still open", "end": "So keep watching"}),
    ])
