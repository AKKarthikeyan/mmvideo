# Indica Atlas, DRAFT 16 Nov 2026: "The detour became the main road" (Hormuz -> Bab el-Mandeb). Map Short.
# Cleared facts only (BM01 ledger, 15 Nov 2026):
#   C-H1  ledger H1: war on Iran began 28 Feb 2026; IRGC closure of Hormuz announced (28 Feb per bne IntelliNews; others
#         date it 2 Mar). Snippet-only, so it is attributed: "reports say".
#   C-H2  ledger H2: EIA (Aug STEO) Hormuz oil flow 21.6 million b/d in Q4 2025 -> 4.9 in Q2 2026.
#   C-BM  ledger header (pre-confirmed): EIA STEO petroleum liquids through Bab el-Mandeb 5.4 (Q4 2025), 5.6 (Q1 2026),
#         8.1 (Q2 2026) million b/d.
#   C-H6  ledger H6: EIA chokepoints page, 1H 2025: 89% of Hormuz crude went to Asia; China, India, Japan, S Korea 74%.
#   G     plain map geography.  F  framing, no factual claim.
# Changed 16 Nov (finishing agent): b1 merged to 'Two different gates for ships' (hook <2 s, shorter); b2 'Not quite' -> 'It was'
# (21.6 in Q4 2025 shows it WAS the main road); b6 and b8 now name the EIA; b8 caption matches the voice (no 'barrels').
# Hard limits: never say Bab el-Mandeb is closed or that anyone controls passage; no forecasts; quarters always said;
# the yearly EIA table (C-H6) never shares a line with the quarterly series (C-H2, C-BM). H4 (Saudi pipeline) not used.
# RE-CHECK current events before posting.
S["ia-hormuzshift"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Gates of the Sea", pause=0.2,
    title="The detour became the main road",
    send="Two different sea gates: in 2026, oil through Hormuz fell and oil through Bab el-Mandeb rose, by the EIA's quarterly numbers.",
    beats=[
        # G (Hormuz joins the Persian Gulf to the open sea; Bab el-Mandeb joins the Red Sea to the Gulf of Aden; two different straits)
        ("b1", [("Two different gates for ships.", "Two *different* gates for ships."), ("Hormuz, out of the Gulf.", "*Hormuz,* out of the Gulf."),
                ("Bab el Mandeb, out of the Red Sea.", "*Bab el-Mandeb,* out of the Red Sea.")],
         {"two": "Two different", "hormuz": "Hormuz, out", "bab": "Bab el Mandeb"}),
        # F + C-H2 (the belief; "It was." = EIA STEO 21.6 million b/d through Hormuz in Q4 2025, shown next beat)
        ("b2", [("Hormuz is the main road for oil.", "Hormuz is the *main road* for oil."), ("Right?", "*Right?*"),
                ("It was.", "It *was.*")],
         {"main": "Hormuz is the main", "right": "Right", "nq": "It was"}),
        # C-H2 (EIA STEO, Aug: Hormuz oil flow about 21.6 million b/d, Q4 2025)
        ("b3", [("E I A: about twenty-one point six million barrels a day", "EIA: about *21.6 million* barrels a day"),
                ("through Hormuz,", "through *Hormuz,*"), ("October to December twenty twenty-five.", "October to December *2025.*")],
         {"eia": "E I A: about twenty", "thru": "through Hormuz", "q4": "October to December"}),
        # C-H2 (EIA STEO: Hormuz oil flow about 4.9 million b/d, Q2 2026)
        ("b4", [("April to June twenty twenty-six:", "April to June *2026:*"), ("about four point nine million.", "about *4.9 million.*")],
         {"q2": "April to June", "low": "about four point"}),
        # C-H1 (attributed: reports say war on Iran began 28 Feb 2026 and Iran announced the strait closed)
        ("b5", [("Why?", "*Why?*"), ("Reports say war on Iran began on twenty-eight February,", "Reports say war on Iran began on *28 February,*"),
                ("and Iran announced the strait closed.", "and Iran *announced* the strait closed.")],
         {"why": "Why", "war": "Reports say", "ann": "and Iran announced"}),
        # C-H6 (EIA chokepoints, 1H 2025: 89% of Hormuz crude went to Asia)
        ("b6", [("E I A: Hormuz crude mostly went east:", "EIA: Hormuz crude mostly went *east:*"),
                ("eighty-nine percent to Asia,", "*89%* to Asia,"), ("January to June twenty twenty-five.", "January to June *2025.*")],
         {"east": "E I A: Hormuz crude", "asia": "eighty-nine percent", "h1": "January to June"}),
        # C-H6 (EIA chokepoints, 1H 2025: China, India, Japan and South Korea took 74% of Hormuz crude)
        ("b7", [("China, India, Japan and South Korea", "*China, India,* Japan and South Korea"), ("took seventy-four percent.", "took *74%.*")],
         {"four": "China, India", "pct": "took seventy"}),
        # C-BM (EIA STEO: petroleum liquids through Bab el-Mandeb about 5.4 million b/d, Q4 2025)
        ("b8", [("Now the other gate.", "Now the *other* gate."), ("E I A, October to December twenty twenty-five:", "EIA, October to December *2025:*"),
                ("about five point four million a day.", "about *5.4 million* a day.")],
         {"other": "Now the other", "bq4": "E I A, October", "bfive": "about five point"}),
        # C-BM (EIA STEO: petroleum liquids through Bab el-Mandeb about 8.1 million b/d, Q2 2026)
        ("b9", [("April to June twenty twenty-six:", "April to June *2026:*"), ("about eight point one million.", "about *8.1 million.*")],
         {"bq2": "April to June", "beight": "about eight point"}),
        # F + C-H2/C-BM (both Q2 2026, EIA STEO: 8.1 through Bab el-Mandeb vs 4.9 through Hormuz); loop into b1 ("Look again: two different gates for ships")
        ("b10", [("The detour became the main road.", "The *detour* became the *main road.*"), ("Look again:", "Look *again:*")],
         {"detour": "The detour", "end": "Look again"}),
    ])
