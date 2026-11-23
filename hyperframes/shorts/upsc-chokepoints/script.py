# The UPSC Mains, DRAFT 16 Nov 2026: "Three gates on a blank map" (Hormuz, Bab el-Mandeb, Suez). Map recall Short.
# Claim ids (from the brief, 16 Nov 2026):
#   G    plain map geography: Hormuz joins the Persian Gulf and the Gulf of Oman (Iran / Oman); Bab el-Mandeb joins the
#        Red Sea and the Gulf of Aden (Yemen / Djibouti); the Suez Canal joins the Red Sea and the Mediterranean (Egypt).
#        Gulf oil coming straight to India's west coast passes Hormuz, not Bab el-Mandeb; India-Europe cargo by the short
#        route passes Bab el-Mandeb and Suez.
#   X3   EIA, World Oil Transit Chokepoints: a Suez/SUMED closure would add about 15 days, Arabian Sea to Europe round the
#        Cape (an estimate for that scenario; said as an EIA estimate).
#   frame  no factual claim.
# Hard limits: no current events (no war, attacks, closures, who holds what); no other numbers; no promise about what
# UPSC will ask. X1 (Bab el-Mandeb flow) deliberately NOT used: it invites current-events context.
S["upsc-chokepoints"] = dict(
    channel="The UPSC Mains", lang="en-IN", series="Blank Map", pause=0.2,
    title="Three gates on a blank map",
    send="Place three sea gates on a blank map: Hormuz, Bab el-Mandeb and Suez, and what each one means for India.",
    beats=[
        # frame (hook: the task)
        ("b1", [("Three sea gates.", "*Three* sea gates."), ("Place them on a blank map.", "Place them on a *blank map.*")],
         {"three": "Three sea gates", "blank": "Place them"}),
        # frame (recall countdown)
        ("b2", [("Three. Two. One.", "*3 · 2 · 1*")],
         {"c3": "Three.", "c2": "Two.", "c1": "One."}),
        # G (Hormuz joins the Persian Gulf and the Gulf of Oman, between Iran and Oman)
        ("b3", [("Gate one: Hormuz.", "Gate one: *Hormuz.*"), ("It joins the Persian Gulf and the Gulf of Oman,", "*Persian Gulf* + *Gulf of Oman*"),
                ("between Iran and Oman.", "between *Iran* and *Oman.*")],
         {"g1": "Gate one", "hj": "It joins", "ho": "Gulf of Oman", "hb": "between Iran"}),
        # G (Bab el-Mandeb joins the Red Sea and the Gulf of Aden, between Yemen and Djibouti)
        ("b4", [("Gate two: Bab el Mandeb.", "Gate two: *Bab el-Mandeb.*"), ("Red Sea and Gulf of Aden,", "*Red Sea* + *Gulf of Aden*"),
                ("between Yemen and Djibouti.", "between *Yemen* and *Djibouti.*")],
         {"g2": "Gate two", "bj": "Red Sea and Gulf", "bb": "between Yemen"}),
        # G (the Suez Canal, in Egypt, joins the Red Sea and the Mediterranean)
        ("b5", [("Gate three: the Suez Canal, in Egypt.", "Gate three: *Suez Canal,* Egypt."),
                ("Red Sea and the Mediterranean.", "*Red Sea* + *Mediterranean*")],
         {"g3": "Gate three", "sj": "Red Sea and the Med"}),
        # G (Gulf oil coming straight to India's west coast passes Hormuz, not Bab el-Mandeb)
        ("b6", [("Why India cares.", "Why *India* cares."), ("Gulf oil sailing straight to India's west coast", "Gulf oil → *west coast*"),
                ("passes Hormuz.", "passes *Hormuz.*")],
         {"why": "Why India cares", "oil": "Gulf oil", "ph": "passes Hormuz"}),
        # G (India-Europe cargo by the short route passes Bab el-Mandeb and Suez)
        ("b7", [("India to Europe, the short route,", "India → *Europe,* short route"), ("passes Bab el Mandeb,", "passes *Bab el-Mandeb,*"),
                ("then Suez.", "then *Suez.*")],
         {"eu": "India to Europe", "via": "passes Bab", "then": "then Suez"}),
        # X3 (EIA: a Suez/SUMED closure adds about 15 days, Arabian Sea to Europe round the Cape; a scenario estimate)
        ("b8", [("E I A estimate: without Suez,", "EIA estimate: *without Suez,*"), ("about fifteen extra days round the Cape,", "about *15 extra days*"),
                ("Arabian Sea to Europe.", "round the *Cape*")],
         {"eia": "E I A estimate", "fift": "about fifteen", "ase": "Arabian Sea to Europe"}),
        # G-derived framing (mains takeaway; restates b6 and b7 only)
        ("b9", [("Mains line:", "*Mains* line:"), ("Hormuz for Gulf oil;", "*Hormuz* → Gulf oil"),
                ("Bab el Mandeb and Suez for the Europe route.", "*Bab el-Mandeb + Suez* → Europe")],
         {"mains": "Mains line", "hfor": "Hormuz for", "efor": "Mandeb and Suez for"}),
        # frame (loop: a question that runs into b1 "Three sea gates. Place them on a blank map.")
        ("b10", [("Pause. Now, can you place all three again?", "Place them *again?*")],
         {"again": "Pause"}),
    ])
