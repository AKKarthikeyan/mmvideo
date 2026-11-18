# Flow Build scripts (7 Oct 2026): one diagram that builds up with the narration, rendered in five skins
# (navyred, ivorygold, flatvector, sketch, iso). Engine: src/flow/FlowBuild.tsx. Build: scripts/build_flow.py.
# Each beat: key, say (spoken, numbers as words), cap (captions, numerals).
# Nodes appear at a phrase of a beat ("beat|phrase"); edges draw just before their target node.
# Every number on screen is from a cited filing (see sources); nothing is hard-coded in the engine.

UBI100 = dict(id="ubi100", voice="English_Diligent_Man",
  title="HOW UNION BANK EARNS ON ₹100 · Q1 FY27",
  source="Sources: Union Bank Q1 FY27 investor presentation (15 Jul 2026) p4, p7, p12-15; SBI and ICICI Bank Q1 FY27 presentations.",
  beats=[
    dict(key="f1", say="Follow one hundred rupees through Union Bank of India, and you'll see where it makes money, and where it's weakest.",
         cap="Follow ₹100 through Union Bank of India, and you'll see where it makes money, and where it's weakest."),
    dict(key="f2", say="A saver deposits a hundred rupees. The bank pays about five rupees a year for it. Its cost of deposits is five point zero five percent.",
         cap="A saver deposits ₹100. The bank pays about ₹5 a year for it. Its cost of deposits is 5.05%."),
    dict(key="f3", say="For every hundred rupees of deposits, about eighty three go out as loans, earning seven point nine percent.",
         cap="For every ₹100 of deposits, about ₹83 go out as loans, earning 7.90%."),
    dict(key="f4", say="What it earns minus what it pays is the net interest margin: two point eight percent.",
         cap="What it earns minus what it pays is the net interest margin: 2.80%."),
    dict(key="f5", say="Running the bank takes forty five rupees of every hundred it earns. Bad loans cost another point three eight percent of loans.",
         cap="Running the bank takes ₹45 of every ₹100 it earns. Bad loans cost another 0.38% of loans."),
    dict(key="f6", say="What's left is a return on assets of one point three six percent.",
         cap="What's left is a return on assets of 1.36%."),
    dict(key="f7", say="The weak link is the first step. Union pays more for its deposits than SBI, at four point eight five percent, and far more than ICICI Bank, at four point four one. Cheaper money is the moat Union is still building.",
         cap="The weak link is the first step. Union pays more for its deposits than SBI, at 4.85%, and far more than ICICI Bank, at 4.41%. Cheaper money is the moat Union is still building."),
  ],
  # x, y = node centre on a 1920x1080 stage; title lines split with "\n"
  nodes=[
    dict(id="saver", x=260, y=330, icon="saver", title="SAVER", num="₹100", sub="DEPOSITED", at="f2|A saver deposits"),
    dict(id="bank", x=740, y=330, icon="bank", title="UNION BANK", at="f2|The bank pays"),
    dict(id="loans", x=1210, y=330, icon="factory", title="BORROWERS", num="₹83", sub="LENT PER ₹100 · EARNS 7.90%", at="f3|about eighty three"),
    dict(id="nim", x=1640, y=330, icon="percent", title="NET INTEREST\nMARGIN", num="2.80%", at="f4|net interest margin"),
    dict(id="costs", x=1640, y=690, icon="gear", title="RUNNING COSTS", num="₹45", sub="OF EVERY ₹100 EARNED", at="f5|Running the bank"),
    dict(id="bad", x=1210, y=690, icon="warning", title="BAD LOANS", num="0.38%", sub="CREDIT COST", at="f5|Bad loans"),
    dict(id="roa", x=740, y=690, icon="trophy", title="RETURN ON\nASSETS", num="1.36%", at="f6|return on assets"),
    dict(id="peers", x=270, y=745, kind="panel", icon="bars", title="COST OF DEPOSITS", at="f7|Union pays more",
         rows=[dict(name="UNION", v=5.05, label="5.05%", hi=True), dict(name="SBI", v=4.85, label="4.85%"), dict(name="ICICI", v=4.41, label="4.41%")]),
  ],
  edges=[
    dict(a="saver", b="bank", label="PAYS 5.05%", id="e1"),
    dict(a="bank", b="loans", label="EARNS 7.90%", id="e2"),
    dict(a="loans", b="nim", id="e3"),
    dict(a="nim", b="costs", id="e4"),
    dict(a="costs", b="bad", id="e5"),
    dict(a="bad", b="roa", id="e6"),
  ],
  highlight=dict(at="f7|The weak link", edges=["e1"], nodes=["saver", "bank", "peers"]),
  ledger=[
    ("5.05%", "Union cost of deposits Q1 FY27 (Jun-26 3M)", "deck p14 'CoD (%)' 5.05"),
    ("₹83 per ₹100", "Domestic credit/deposit ratio 83.38% (Jun-26)", "deck p7 '86.10% 83.38% Global Domestic Credit / Deposit Ratio'"),
    ("7.90%", "Yield on advances Q1 FY27", "deck p14 'YoA (%)' 7.90"),
    ("2.80%", "NIM Q1 FY27", "deck p4 'NIM 2.80%', p14"),
    ("₹45 of ₹100", "Cost-to-income 45.34% Q1 FY27", "deck p15 'Cost to Income (%)' 45.34"),
    ("0.38%", "Credit cost Q1 FY27", "deck p13 'Credit Cost 0.38'"),
    ("1.36%", "RoA Q1 FY27", "deck p4 'RoA 1.36%'"),
    ("4.85%", "SBI cost of deposits, domestic, Q1 FY27", "SBIN_2026-08-07 deck p15"),
    ("4.41%", "ICICI Bank cost of deposits Q1 FY27", "ICICIBANK_2026-07-18 deck p10"),
  ])

FLOWS = [UBI100]
