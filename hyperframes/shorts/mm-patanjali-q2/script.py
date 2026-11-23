# Moat & Margin, DRAFT 15 Nov 2026: "Patanjali Foods' sales grew 16%. Profit fell 19%. Where did the profit go?"
# Number-led finance Short (big numbers, two segment bars, filing strip). No map.
# Cleared facts only (caller's brief, 15 Nov 2026), all from Patanjali Foods' results filing of 14 Nov 2026,
# quarter ended 30 Sep 2026 (Q2 FY27): P1 revenue 11,322.58 vs 9,798.84 cr (+15.55%); P2 consolidated net profit
# 419.76 vs 516.70 cr (-18.76%); P3 edible-oil revenue 8,532.25 vs 6,971.64 cr (+22.39%), EBITDA margin 3.00%;
# P4 FMCG revenue 2,923.48 vs 2,914.24 cr (+0.31%), EBITDA margin 7.57%; P5 FMCG segment result 207.90 vs 341.63 cr
# (about -39%); P6 FMCG 25.50% of revenue, 45.04% of EBITDA (ex unallocable); P7 one-off tax credit in both years'
# net profit (115.31 / 141.00 cr; kit only); P8 biscuits 638.31 cr +27.69% (not used).
# Hard limits: no single cause for the profit fall; never mix EBITDA and net profit in one comparison; no edible-oil
# segment-profit figure; no buy/sell, price or forecast.
S["mm-patanjali-q2"] = dict(
    channel="Moat & Margin", lang="en-IN", series="Where did the profit go?", pause=0.25,
    title="Patanjali Foods: sales up 16%, profit down 19%",
    send="Sales grew, profit fell: the branded side earned far less on the same sales.",
    beats=[
        # P1, P2 (revenue +15.55%, net profit -18.76%); hook
        ("b1", [("Patanjali Foods' sales grew sixteen percent.", "Sales grew *16%.*"),
                ("But profit fell nineteen percent.", "Profit fell *19%.*"),
                ("So where did the profit go?", "Where did it *go?*")],
         {"hook": "Patanjali Foods", "fell": "But profit fell", "where": "So where"}),
        # P1 (revenue from operations 11,322.58 cr, Jul-Sep 2026)
        ("b2", [("Sales: about eleven thousand three hundred crore,", "*₹11,322.58 crore*"),
                ("in July to September.", "in *July–September.*")],
         {"sales": "Sales: about", "jul": "in July"}),
        # [frame] two segments
        ("b3", [("Inside are two engines.", "*Two* engines.")], {"two": "Inside are"}),
        # P3 (edible oil revenue +22.39%, EBITDA margin 3.00%)
        ("b4", [("Edible oil is the big one,", "*Edible oil:* the big one,"), ("up twenty-two percent.", "up *22%.*"),
                ("But its EBITDA margin is just three percent.", "EBITDA margin: just *3%.*")],
         {"oil": "Edible oil", "up22": "up twenty-two", "thin": "But its EBITDA"}),
        # P4 (FMCG EBITDA margin 7.57%), P6 (25.50% of revenue, 45.04% of EBITDA)
        ("b5", [("F M C G, the branded side, is richer:", "*FMCG,* the branded side:"), ("seven and a half percent.", "margin *7.57%.*"),
                ("A quarter of sales,", "*A quarter* of sales,"), ("but forty-five percent of the EBITDA.", "*45%* of the EBITDA.")],
         {"fmcg": "the branded side", "rich": "seven and a half", "quarter": "A quarter of sales", "half": "but forty-five"}),
        # P4 (FMCG revenue +0.31%: flat)
        ("b6", [("This quarter, F M C G sales stayed flat.", "FMCG sales: *flat.*")], {"flat": "This quarter", "stayed": "sales stayed"}),
        # P4 (same sales), P5 (FMCG segment result 341.63 -> 207.90 cr, about -39%); [frame] not a single cause:
        # "the biggest drop the segment table shows" per brief
        ("b7", [("Same sales,", "*Same* sales,"), ("but its segment profit fell about thirty-nine percent.", "segment profit *−39%.*"),
                ("Not the only reason,", "*Not* the only reason,"), ("but the biggest drop the segment table shows.", "the *biggest drop* in the table.")],
         {"same": "Same sales", "drop": "but its segment", "table": "Not the only", "big": "but the biggest"}),
        # P4, P5 margin verdict
        ("b8", [("Margin verdict:", "*Margin* verdict:"), ("the branded side earned less on the same sales.", "branded side earned *less.*")],
         {"mv": "Margin verdict", "less": "the branded side earned", "same2": "on the same"}),
        # [frame] moat verdict: one quarter cannot settle it; what to watch
        ("b9", [("Moat verdict:", "*Moat* verdict:"), ("one quarter can't settle it.", "one quarter *can't settle it.*"),
                ("Watch whether the branded margin comes back.", "Watch the *branded margin.*")],
         {"moat": "Moat verdict", "one": "one quarter", "watch": "Watch whether"}),
        # [frame] loop: runs straight back into b1 ("So next time you hear... Patanjali Foods' sales grew sixteen percent")
        ("b10", [("So next time you hear", "Next time you *hear…*")], {"end": "So next time"}),
    ])
