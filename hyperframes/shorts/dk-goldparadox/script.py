# Data Kadai, DRAFT 16 Nov 2026: "India's gold imports tripled in October. They also fell about 63%. Both are true."
# Number-led Short (two headlines, three bars, rule card). No map. Lesson: check what a number is compared with.
# Cleared facts only (caller's brief, 16 Nov 2026). Dollar VALUE only, never tonnes.
# G1 gold imports Oct 2026 $5.51 bn (The Pamphlet, 14 Nov 2026, citing Commerce Ministry data)
# G2 gold imports Oct 2025 $14.72 bn (Indian Opinion, 14 Nov 2026) -> Oct vs Oct about -63% (never "62.57%")
# G3 gold imports Sep 2026 about $1.8 bn (PTI via ThePrint) -> Sep to Oct "about tripled"
# G4 Business Today 14 Nov 2026 citing Axis Bank: gold ~$5 bn, half, of the ~$10 bn m-o-m rise in the trade deficit;
#    delayed pickup in festive demand (Axis Bank's view, attributed); higher prices raise the dollar value
# G5 Commerce Ministry release 13 Nov 2026: Oct exports $49.47 bn, imports $89.35 bn (estimated; kit only)
# Hard limits: no single cause as fact; no tonnes; no "record"; no forecast; no investment talk.
S["dk-goldparadox"] = dict(
    channel="Data Kadai", lang="en-IN", series="Compared With What?", pause=0.25,
    title="Gold imports tripled. And fell 63%. Both true.",
    send="Two opposite gold headlines are both true: they compare October with different months.",
    beats=[
        # G1, G3 (headline 1); G1, G2 (headline 2); [frame] hook
        ("b1", [("India's gold imports about tripled in October.", "Gold imports *about tripled.*"),
                ("India's gold imports fell about sixty-three percent in October.", "Gold imports *fell about 63%.*"),
                ("Both are true.", "*Both* are true.")],
         {"hook": "India's gold imports about", "fell": "India's gold imports fell", "both": "Both are"}),
        # [frame] the question
        ("b2", [("The trick: compared with what?", "Compared with *what?*")], {"what": "The trick"}),
        # G3 (Sep 2026 about $1.8 bn)
        ("b3", [("In September, gold imports were about one point eight billion dollars.", "September: *about $1.8 billion*")],
         {"sep": "In September"}),
        # G1 (Oct 2026 $5.51 bn)
        ("b4", [("In October, five and a half billion.", "October: *$5.51 billion*")], {"oct": "In October"}),
        # G1, G3 (about three times)
        ("b5", [("Against the month before, that's about three times.", "vs September: *about 3×*")], {"x3": "Against the month"}),
        # G2 (Oct 2025 $14.72 bn)
        ("b6", [("Now compare with October last year:", "Now compare with *October 2025:*"),
                ("almost fifteen billion dollars.", "*$14.72 billion*")],
         {"ly": "Now compare", "ly2": "almost fifteen"}),
        # G1, G2 (about -63%, nearly two-thirds)
        ("b7", [("Against that, this October is down about sixty-three percent.", "vs a year ago: *down about 63%.*"),
                ("Nearly two-thirds.", "Nearly *two-thirds.*")],
         {"dn": "Against that", "two3": "Nearly two"}),
        # G4 (Axis Bank's view, attributed; higher prices raise dollar value)
        ("b8", [("Why the jump from September? Axis Bank points to festive buying that picked up late.", "Axis Bank: *festive buying* picked up late."),
                ("And higher gold prices raise the dollar bill.", "Higher prices raise the *dollar bill.*")],
         {"why": "Why the jump", "axis": "Axis Bank", "price": "And higher"}),
        # [frame] value is not volume (these figures are dollars, not tonnes)
        ("b9", [("These figures are dollars, not tonnes.", "*Dollars,* not tonnes.")], {"usd": "These figures"}),
        # [frame] the rule
        ("b10", [("So, two rules.", "*Two* rules."), ("Check what a number is compared with.", "1 · Check the *comparison.*"),
                 ("And value is not volume.", "2 · *Value* is not *volume.*")],
         {"rules": "So, two", "r1": "Check what", "r2": "And value"}),
        # [frame] loop: runs back into b1 ("...or you'll believe only one headline: India's gold imports about tripled")
        ("b11", [("Or you'll believe only one headline:", "Or you'll believe *only one…*")], {"end": "Or you'll"}),
    ])
