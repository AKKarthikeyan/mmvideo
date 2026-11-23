# Indica Atlas, DRAFT 16 Nov 2026: "One gate got the trouble, the other got the bill" (Bab el-Mandeb -> Suez). Map Short.
# Cleared facts only (BM01 ledger, 15 Nov 2026), each used as the ledger's "what the source says" column states it:
#   E2  Suez Canal revenue, CALENDAR years (SCA figures as reported): $10.25 billion in 2023, $3.991 billion in 2024.
#       The FY2025/26 $4.67 billion figure is NOT used.
#   H5  EIA chokepoints page: oil round the Cape of Good Hope 6.2 million b/d (2023) -> 9.3 (2024). One beat only.
#   X3  EIA chokepoints page (pre-confirmed): a Suez/SUMED closure would add about 15 days, Arabian Sea to Europe, via the
#       Cape. An estimate for that scenario: said as "EIA estimate", the scenario is on screen.
#   B1  Galaxy Leader, 19 Nov 2023 (gCaptain timeline; snippet-only, so it is attributed: "reports").
#   G   plain map geography.  F  framing / plain logic, no new factual claim.
# Hard limits: never say Bab el-Mandeb or Suez is closed now; no 5.7/6.0 EIA figures, transit counts, vessel counts,
# freight or insurance numbers; no forecasts; calendar-year revenue only. B3/B4 read, not used (one Houthi beat at most).
# RE-CHECK current events before posting.
S["ia-suezbill"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Gates of the Sea", pause=0.2,
    title="One gate got the trouble, the other got the bill",
    send="Trouble at Bab el-Mandeb, at the bottom of the Red Sea, and Egypt's Suez Canal income fell from about $10.25 billion in 2023 to about $3.99 billion in 2024.",
    beats=[
        # G + E2 (hook: Bab el-Mandeb to Suez is over 2,000 km by map; Suez income fell, shown in b8-b9)
        ("b1", [("Trouble at this gate.", "*Trouble* at this gate."),
                ("A country over two thousand kilometres away lost much of its toll.", "A country *2,000+ km* away lost much of its *toll.*")],
         {"tr": "Trouble at", "bill": "A country over"}),
        # G (Bab el-Mandeb at the bottom of the Red Sea, the Suez Canal at the top)
        ("b2", [("Bab el Mandeb, at the bottom of the Red Sea.", "*Bab el-Mandeb,* at the bottom of the Red Sea."),
                ("Suez, at the top.", "*Suez,* at the top.")],
         {"bab": "Bab el Mandeb", "suez": "Suez, at"}),
        # G (the short sea route Asia -> Europe runs through both; India-Europe cargo uses it; no number)
        ("b3", [("Asia to Europe, the short way, runs through both.", "*Asia* to *Europe,* the short way, runs through *both.*"),
                ("India's cargo to Europe too.", "*India's* cargo to Europe too.")],
         {"asia": "Asia to Europe", "india": "India's cargo"}),
        # B1 (attributed: reports; Galaxy Leader, 19 Nov 2023)
        ("b4", [("Then, reports of Houthi attacks on ships,", "Then, reports of *Houthi attacks* on ships,"),
                ("like Galaxy Leader, November twenty twenty-three.", "like *Galaxy Leader,* November *2023.*")],
         {"hou": "Then, reports", "gl": "like Galaxy"}),
        # H5 (EIA: Cape oil flows 6.2 million b/d in 2023 -> 9.3 in 2024; numbers on the panel only)
        ("b5", [("In twenty twenty-four, more oil went the long way,", "In *2024,* more oil went the *long way,*"),
                ("round Africa.", "round *Africa.*")],
         {"y24c": "In twenty twenty-four, more", "afr": "round Africa"}),
        # X3 (EIA estimate for a Suez/SUMED closure scenario: about 15 days more, Arabian Sea to Europe via the Cape)
        ("b6", [("E I A estimate: about fifteen extra days,", "EIA estimate: about *15 extra days,*"),
                ("Arabian Sea to Europe.", "*Arabian Sea* to Europe.")],
         {"eia": "E I A estimate", "ara": "Arabian Sea"}),
        # F (a ship that does not enter the Red Sea does not transit Suez, so pays no canal toll)
        ("b7", [("Skip the Red Sea, and you skip Suez.", "Skip the Red Sea, and you skip *Suez.*"),
                ("And Egypt's toll.", "And Egypt's *toll.*")],
         {"skip": "Skip the Red", "toll": "And Egypt"}),
        # E2 (calendar 2023: about $10.25 billion)
        ("b8", [("Suez Canal income, twenty twenty-three:", "Suez Canal income, *2023:*"),
                ("about ten point two five billion dollars.", "about *$10.25 billion.*")],
         {"y23": "Suez Canal income", "ten": "about ten point"}),
        # E2 (calendar 2024: about $3.99 billion)
        ("b9", [("Twenty twenty-four:", "*2024:*"), ("about three point nine nine billion.", "about *$3.99 billion.*")],
         {"y24": "Twenty twenty-four", "three": "about three point"}),
        # F (loop: "...the bill." runs into "Trouble at this gate.")
        ("b10", [("One gate got the trouble.", "One gate got the *trouble.*"), ("The other got the bill.", "The other got the *bill.*")],
         {"g1": "One gate", "g2": "The other"}),
    ])
