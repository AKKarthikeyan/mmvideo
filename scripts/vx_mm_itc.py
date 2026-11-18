"""Moat & Margin itc video (Nov 2026): kept in its own module so two builds do not edit the same file.
Imported at the end of vx_scripts.py. Defines one video dict appended to VIDEOS and CLIPS_EXTRA for build_vx.py."""
from pathlib import Path
from vx_scripts import T, title, VIDEOS, END_SAY, END_CAP

RF = Path("/Volumes/DarwinSSD/Moat and Margin/01 Videos/ITC cigarette moat/raw")
CFS = RF / "ITC-Financial-Result-Q2-FY2027-cfs.pdf"
SFS = RF / "ITC-Financial-Result-Q2-FY2027-sfs.pdf"
PR = RF / "ITC-Press-Release-Q2-FY2027.pdf"
DECK = RF / "ITC-Quarterly-Result-Presentation-Q2-FY2027.pdf"
Q4S = RF / "more/ITC-Financial-Result-Q4-FY2026-sfs.pdf"

CLIPS_EXTRA = {
  "itc_rev":    (CFS, "30578.40", 1, 0),
  "itc_excise": (CFS, "10309.77", 0, 0),
  "itc_pat":    (CFS, "4168.40", 0, 0),
  "itc_note7":  (SFS, "increased GST and Central Excise duty", 0, 2),
  "itc_note7b": (SFS, "Excise duty is not excluded", 3, 3),
  "itc_cigrev": (SFS, "15536.13", 0, 0),
  "itc_cig":    (SFS, "3813.45", 1, 1),
  "itc_oth":    (SFS, "558.30", 0, 0),
  "itc_h1":     (SFS, "7154.68", 0, 0),
  "itc_q4":     (Q4S, "5488.16", 0, 0),
  "itc_slide13": (DECK, "Gross Revenue", 3, 3),
  "itc_slide9": (DECK, "Net Revenue", 3, 4),
  "itc_pr_unp": (PR, "unprecedented", 1, 1),
  "itc_pr_rearch": (PR, "rearchitect", 1, 2),
}

ENG_HEAD = "ITC · STANDALONE · SEGMENT RESULT · ₹ CRORE · Q2 FY26 vs Q2 FY27"


def anchor(a1, a2, a3, a4, stamps=None, heading=ENG_HEAD):
    """The deciding object: cigarette result against FMCG-Others result, Q2 FY26 and Q2 FY27 (standalone, Rs crore)."""
    s = dict(type="bars", heading=heading, rows=[
        dict(name="CIGARETTES · Q2 FY26", v=5240.66, label="₹5,241 cr", at=a1),
        dict(name="CIGARETTES · Q2 FY27", v=3813.45, label="₹3,813 cr", red=True, at=a2),
        dict(name="FMCG-OTHERS · Q2 FY26", v=436.85, label="₹437 cr", at=a3),
        dict(name="FMCG-OTHERS · Q2 FY27", v=558.30, label="₹558 cr", at=a4)])
    if stamps: s["stamps"] = stamps
    return s


ITC = dict(id="itcq2", title="Can FMCG Replace ITC's Cigarette Profit Moat?", voice="English_Diligent_Man",
  keyword="I T C",
  spine="ITC's reported revenue jumped 44% while its profit fell 19%. And can its fast-growing FMCG business ever replace what its cigarettes earn?",
  gate=dict(
    changed="ITC Q2 FY27 results and media statement (2 Nov 2026): consolidated revenue ₹30,578 crore (+43.9%) but profit to owners ₹4,168 crore (-18.7%); note 7: GST and central excise on cigarettes raised from 1 Feb 2026, excise duty stays inside gross revenue, so revenue is 'not strictly comparable'; cigarette segment result ₹3,813 crore (-27.2%).",
    care="ITC's moat is the cigarette business: it has long earned about 84% of the segment result. The margin question: what each rupee of cigarette sales earns after the tax change, and whether FMCG-Others (₹558 crore) can ever stand in for it.",
    added="Cigarette result in five quarters (Q3 and Q4 FY26, Q1 and Q2 FY27, H1); offset arithmetic (FMCG-Others covers 8.5% of the fall, all non-cigarette segments 18.4%); 6.8x ratio against 12.0x; OUR ESTIMATE of cigarette segment profit per rupee of net sales (65 paise against 71) using ITC's own net-revenue deduction; acquisition caveats (Century Pulp and Paper, Sproutlife).",
    invalidate="The net-revenue deduction is whole-company, so the 65 paise is our estimate; the tax change is known only through ITC's note 7; ITC gives no volume figure; one quarter is not a trend; Q4 FY26 already holds two months under the new tax; part of the non-cigarette growth is bought.",
    monitor="Cigarette segment result in Q3 FY27 (January); any volume figure ITC gives; FMCG-Others EBITDA margin beyond 10%; the government's tax notification itself (CBIC / Finance Ministry)."),
  next_video="ITC follow-up: the volume figure and the tax notification",
  chapters=["Cold open", "Two engines", "The hidden factor", "What really fell", "Can FMCG replace it", "What the number cannot tell us", "The verdict", "Sources"],
  beats=[
  # ---------------- 0 · cold open
  T(0,"k00","I T C's reported revenue jumped forty four percent in the September quarter, on the group's consolidated figures. Its profit fell nearly nineteen percent. Both are true. How?",
    "ITC's reported revenue jumped 44% in the September quarter, on the group's consolidated figures. Its profit fell nearly 19%. Both are true. How?",
    dict(type="cards", heading="ITC · Q2 FY27 · CONSOLIDATED · OWN RESULTS · 2 NOV 2026", cards=[
      dict(top="REPORTED REVENUE", big="+43.9%", at="forty four percent"),
      dict(top="PROFIT TO OWNERS", big="−18.7%", at="nearly nineteen percent", fill="mustard"),
      dict(top="BOTH ARE TRUE", big="HOW?", at="Both are true")],
      stamps=[dict(text="THE REVENUE CARRIES A MUCH BIGGER TAX INSIDE IT", at="reported revenue")])),
  T(0,"k01","And a bigger question sits underneath. I T C's biscuits, noodles and atta are growing fast. Can they ever replace what its cigarettes earn? We will answer both from I T C's own filing. No share price, no view on what to buy.",
    "And a bigger question sits underneath. ITC's biscuits, noodles and atta are growing fast. Can they ever replace what its cigarettes earn? We will answer both from ITC's own filing. No share price, no view on what to buy.",
    dict(type="strips", items=[dict(text="THE PARADOX: REVENUE UP, PROFIT DOWN", at="bigger question"), dict(text="CAN FMCG REPLACE CIGARETTE PROFIT?", at="Can they ever replace"), dict(text="ITC'S OWN FILING · NO SHARE PRICE · NO BUY OR SELL VIEW", at="No share price", red=True)])),
  # ---------------- 1 · prime
  title(1,"k10",["TWO", "ENGINES"], "Chapter one. Two engines."),
  T(1,"k11","I T C reports its business in segments. Two of them make up its FMCG business: cigarettes, and everything else, the foods, personal care and notebooks. Agri, paper and a few others make up the rest.",
    "ITC reports its business in segments. Two of them make up its FMCG business: cigarettes, and everything else, the foods, personal care and notebooks. Agri, paper and a few others make up the rest.",
    dict(type="table", heading="ITC · STANDALONE SEGMENTS · FROM ITS RESULTS", cols=["SEGMENT", "WHAT IT IS"], rows=[
      dict(cells=["FMCG · Cigarettes", "the big profit engine"], at="cigarettes"),
      dict(cells=["FMCG · Others", "foods, personal care, notebooks"], at="everything else"),
      dict(cells=["Agri business", "leaf tobacco, exports"], at="Agri"),
      dict(cells=["Paperboards & packaging", "paper"], at="paper"),
      dict(cells=["Others", "a few small ones"], at="a few others")])),
  T(1,"k12","The profit engine has long been cigarettes. In this quarter they were seventy four percent of the profit the segments report. A year ago, eighty three. In the full year to March, eighty four, about twelve times what the rest of F M C G earned.",
    "The profit engine has long been cigarettes. In this quarter they were 74% of the profit the segments report. A year ago, 83%. In the full year to March, 84%, about 12 times what the rest of FMCG earned.",
    dict(type="bars", heading="CIGARETTES' SHARE OF SEGMENT RESULT · STANDALONE · OUR ARITHMETIC", rows=[
      dict(name="Q2 FY27", v=74.0, label="74%", at="seventy four percent"),
      dict(name="Q2 FY26", v=82.9, label="83%", at="A year ago, eighty three"),
      dict(name="FULL YEAR TO MARCH 2026", v=83.7, label="84%", at="eighty four")],
      stamps=[dict(text="≈ 12× FMCG-OTHERS, FULL YEAR", at="twelve times")])),
  T(1,"k13","Keep that picture in mind: one large engine, and one growing one. These are the two bars we will keep coming back to: the cigarette result, and the F M C G Others result.",
    "Keep that picture in mind: one large engine, and one growing one. These are the two bars we will keep coming back to: the cigarette result, and the FMCG-Others result.",
    anchor("two bars", "cigarette result", "one growing one", "Others result")),
  # ---------------- 2 · the hidden factor
  title(2,"k20",["THE HIDDEN", "FACTOR"], "Chapter two. The hidden factor."),
  T(2,"k21","First, the paradox. Reported revenue up forty four percent, profit down nineteen. Normally that would mean costs exploded. They did not.",
    "First, the paradox. Reported revenue up 44%, profit down 19%. Normally that would mean costs exploded. They did not.",
    dict(type="strips", items=[dict(text="REPORTED REVENUE +44% · EXCISE INSIDE IT", at="forty four percent"), dict(text="PROFIT −19%", at="profit down nineteen"), dict(text="COSTS DID NOT EXPLODE", at="They did not", red=True)])),
  T(2,"k22","The answer is a note at the back of I T C's results, note seven. In February, after a tax called the G S T compensation cess ended, the government raised G S T and central excise duty on cigarettes. I T C says so itself.",
    "The answer is a note at the back of ITC's results, note 7. In February, after a tax called the GST compensation cess ended, the government raised GST and central excise duty on cigarettes. ITC says so itself.",
    dict(type="clip", clip="itc_note7", heading="ITC · Q2 FY27 RESULTS · NOTE 7 · 2 NOV 2026", hl=["note seven"], stamps=[dict(text="FROM 1 FEB 2026 · ITC'S OWN NOTE", at="I T C says so")])),
  T(2,"k23","Here is the accounting. Under the rules I T C follows, G S T is left out of revenue. Excise duty is not. So when the excise went up, revenue went up with it.",
    "Here is the accounting. Under the rules ITC follows, GST is left out of revenue. Excise duty is not. So when the excise went up, revenue went up with it.",
    dict(type="clip", clip="itc_note7b", heading="ITC · Q2 FY27 RESULTS · NOTE 7", hl=["Excise duty is not"], stamps=[dict(text="GST OUT OF REVENUE · EXCISE STAYS IN", at="revenue went up with it")])),
  T(2,"k24","On the consolidated figures, the excise duty I T C booked this quarter: ten thousand three hundred and ten crore rupees. A year ago: one thousand seven hundred and fifty four.",
    "On the consolidated figures, the excise duty ITC booked this quarter: ₹10,310 crore. A year ago: ₹1,754 crore.",
    dict(type="clip", clip="itc_excise", heading="ITC · Q2 FY27 CONSOLIDATED · EXCISE DUTY · COLUMNS: SEP-26 QTR, SEP-25 QTR, JUN-26 QTR", hl=["ten thousand three hundred"], stamps=[dict(text="₹10,310 CR vs ₹1,754 CR A YEAR AGO", at="A year ago")])),
  T(2,"k25","I T C warns, in its own note, that these revenue figures are, in its words, not strictly comparable with earlier periods.",
    "ITC warns, in its own note, that these revenue figures are, in its words, not strictly comparable with earlier periods.",
    dict(type="quote", text="“…are not strictly comparable with those of the previous periods.”", who="ITC · NOTE 7 · Q2 FY27 RESULTS, 2 NOV 2026", at="not strictly comparable")),
  T(2,"k26","So look at cigarettes alone, on the standalone figures. Gross revenue, with excise inside it, is up seventy eight percent. I T C's own slide says net revenue is down twenty one percent, and the segment's result is down twenty seven.",
    "So look at cigarettes alone, on the standalone figures. Gross revenue, with excise inside it, is up 78%. ITC's own slide says net revenue is down 21%, and the segment's result is down 27%.",
    dict(type="cards", heading="ITC'S OWN SLIDE · Q2 FY27 · FMCG-CIGARETTES · STANDALONE", cards=[
      dict(top="GROSS REVENUE (EXCISE INSIDE)", big="+78%", at="seventy eight percent"),
      dict(top="NET REVENUE (ITC'S DEFINITION)", big="−21%", at="net revenue is down", fill="mustard"),
      dict(top="SEGMENT RESULT", big="−27%", at="result is down twenty seven")])),
  T(2,"k27","And for the whole company, I T C says net revenue is up about five percent, while E B I T D A is down sixteen. These are I T C's own definitions, on the consolidated figures.",
    "And for the whole company, ITC says net revenue is up about 5%, while EBITDA is down 16%. These are ITC's own definitions, on the consolidated figures.",
    dict(type="cards", heading="ITC'S OWN SLIDE · KEY HIGHLIGHTS · Q2 FY27 · CONSOLIDATED · ITC'S DEFINITIONS", cards=[
      dict(top="NET REVENUE · WHOLE COMPANY", big="+5%", at="about five percent"),
      dict(top="EBITDA · WHOLE COMPANY", big="−16%", at="down sixteen", fill="mustard")])),
  T(2,"k28","Both facts were true because revenue now carries a bigger tax inside it. So far: revenue up, but not really; profit down, and really.",
    "Both facts were true because revenue now carries a bigger tax inside it. So far: revenue up, but not really; profit down, and really.",
    dict(type="strips", items=[dict(text="REVENUE: UP, WITH A BIGGER TAX INSIDE", at="bigger tax"), dict(text="PROFIT: DOWN, AND REALLY", at="profit down, and really", red=True)])),
  # ---------------- 3 · what really fell
  title(3,"k30",["WHAT REALLY", "FELL"], "Chapter three. What really fell."),
  T(3,"k31","From here we use I T C's standalone figures. The cigarette segment's result was three thousand eight hundred and thirteen crore rupees. A year ago, five thousand two hundred and forty one. Down twenty seven point two percent.",
    "From here we use ITC's standalone figures. The cigarette segment's result was ₹3,813 crore. A year ago, ₹5,241 crore. Down 27.2%.",
    dict(type="clip", clip="itc_cig", heading="ITC · Q2 FY27 STANDALONE · FMCG-CIGARETTES · COLUMNS: SEP-26 QTR, SEP-25 QTR, JUN-26 QTR", hl=["three thousand eight hundred"], stamps=[dict(text="−27.2% ON A YEAR AGO (OUR ARITHMETIC)", at="Down twenty seven")])),
  T(3,"k32","That is one thousand four hundred and twenty seven crore less.",
    "That is ₹1,427 crore less.",
    anchor("one thousand four", "crore less", "crore less|30", "crore less|60", stamps=[dict(text="CIGARETTES: −₹1,427 CR (OUR ARITHMETIC)", at="crore less")])),
  T(3,"k33","Zoom out. Before the tax change, cigarettes earned five thousand one hundred and seventy seven crore rupees in the December quarter. In the March quarter, with the tax change in its last two months, five thousand four hundred and eighty eight.",
    "Zoom out. Before the tax change, cigarettes earned ₹5,177 crore in the December quarter. In the March quarter, with the tax change in its last two months, ₹5,488 crore.",
    dict(type="clip", clip="itc_q4", heading="ITC · Q4 FY26 STANDALONE · FMCG-CIGARETTES · COLUMNS: MAR-26 QTR, MAR-25 QTR, DEC-25 QTR", hl=["five thousand four hundred"], stamps=[dict(text="DEC QTR ₹5,177 CR · MAR QTR ₹5,488 CR", at="December quarter")])),
  T(3,"k34","This quarter's number is about thirty percent below that March peak.",
    "This quarter's number is about 30% below that March peak.",
    dict(type="bars", heading="CIGARETTES · STANDALONE SEGMENT RESULT · ₹ CRORE · OWN FILINGS", rows=[
      dict(name="Q3 FY26 (DEC)", v=5177.02, label="₹5,177 cr", at="This quarter's"),
      dict(name="Q4 FY26 (MAR)", v=5488.16, label="₹5,488 cr", at="March peak"),
      dict(name="Q2 FY27 (SEP)", v=3813.45, label="₹3,813 cr", red=True, at="thirty percent below")],
      stamps=[dict(text="−30.5% vs MARCH QTR (OUR ARITHMETIC)", at="thirty percent below")])),
  T(3,"k35","For the half year, the cigarette result is down thirty one percent. In the June quarter alone it was down thirty five. So June was the low.",
    "For the half year, the cigarette result is down 31%. In the June quarter alone it was down 35%. So June was the low.",
    dict(type="table", heading="CIGARETTES · RESULT vs A YEAR AGO · STANDALONE · OUR ARITHMETIC", cols=["PERIOD", "CHANGE"], rows=[
      dict(cells=["Half year to Sep 2026 (₹7,155 cr)", "−31.1%"], at="half year"),
      dict(cells=["June quarter (₹3,341 cr)", "−35.1%"], at="June quarter"),
      dict(cells=["September quarter (₹3,813 cr)", "−27.2%"], at="June was the low")])),
  T(3,"k36","Against the June quarter, though, it is up fourteen percent. I T C calls that an improvement from its calibrated response.",
    "Against the June quarter, though, it is up 14%. ITC calls that an improvement from its calibrated response.",
    dict(type="cards", heading="CIGARETTES · SEPTEMBER vs JUNE QUARTER · STANDALONE", cards=[
      dict(top="JUNE QUARTER", big="₹3,341 cr", at="June quarter"),
      dict(top="SEPTEMBER QUARTER", big="₹3,813 cr", at="up fourteen percent", fill="mustard"),
      dict(top="CHANGE (OUR ARITHMETIC)", big="+14.1%", at="improvement")])),
  T(3,"k37","What does I T C say is behind the fall? That legal volumes remain under pressure after what it calls an unprecedented tax increase, and that seizures of smuggled cigarettes have sharply increased.",
    "What does ITC say is behind the fall? That legal volumes remain under pressure after what it calls an unprecedented tax increase, and that seizures of smuggled cigarettes have sharply increased.",
    dict(type="clip", clip="itc_pr_unp", heading="ITC · MEDIA STATEMENT · 2 NOV 2026 · WHAT ITC SAYS", hl=["unprecedented tax increase"], stamps=[dict(text="ITC'S WORD: 'UNPRECEDENTED'", at="what it calls")])),
  T(3,"k38","I T C does not give a volume figure in its release. So we can say what I T C says. We cannot measure it.",
    "ITC does not give a volume figure in its release. So we can say what ITC says. We cannot measure it.",
    dict(type="strips", items=[dict(text="NO VOLUME FIGURE IN ITC'S RELEASE", at="volume figure"), dict(text="WE CAN SAY WHAT ITC SAYS", at="what I T C says"), dict(text="WE CANNOT MEASURE IT", at="cannot measure it", red=True)])),
  T(3,"k39","Now the margin, the M in Moat and Margin. Take each rupee of sales. Our estimate, assuming the excise I T C deducts all sits in cigarettes: strip it out, and the cigarette segment kept about sixty five paise of segment profit on every rupee of net sales. A year ago, about seventy one.",
    "Now the margin, the M in Moat and Margin. Take each rupee of sales. Our estimate, assuming the excise ITC deducts all sits in cigarettes: strip it out, and the cigarette segment kept about 65 paise of segment profit on every rupee of net sales. A year ago, about 71.",
    dict(type="bars", heading="OUR ESTIMATE · CIGARETTE SEGMENT PROFIT PER ₹1 OF NET SALES · ASSUMES ALL DEDUCTED EXCISE IS CIGARETTES", rows=[
      dict(name="Q2 FY27", v=65.4, label="≈65 paise", red=True, at="sixty five paise"),
      dict(name="Q2 FY26", v=70.7, label="≈71 paise", at="A year ago")],
      stamps=[dict(text="OUR ESTIMATE · NOT AN ITC MARGIN", at="Our estimate")])),
  T(3,"k3a","FMCG-Others kept about eight paise on every rupee. On I T C's own E B I T D A measure, it is about ten percent, up half a point.",
    "FMCG-Others kept about 8 paise on every rupee. On ITC's own EBITDA measure, it is about 10%, up half a point.",
    dict(type="cards", heading="FMCG-OTHERS · STANDALONE · Q2 FY27 · OUR ARITHMETIC", cards=[
      dict(top="SEGMENT PROFIT PER ₹1", big="≈8 paise", at="eight paise"),
      dict(top="EBITDA MARGIN (ITC'S MEASURE)", big="10.4%", at="about ten percent", fill="mustard"),
      dict(top="A YEAR AGO", big="9.9%", at="half a point")])),
  T(3,"k3b","So, roughly, our estimate says a rupee of cigarette sales is worth eight rupees of FMCG-Others sales. That is a big reason a fast-growing small engine cannot easily match a shrinking big one.",
    "So, roughly, our estimate says a rupee of cigarette sales is worth ₹8 of FMCG-Others sales. That is a big reason a fast-growing small engine cannot easily match a shrinking big one.",
    dict(type="strips", items=[dict(text="OUR ESTIMATE: ₹1 OF CIGARETTE SALES ≈ ₹8 OF FMCG-OTHERS SALES", at="our estimate says"), dict(text="A FAST SMALL ENGINE vs A SHRINKING BIG ONE", at="fast-growing small engine", red=True)])),
  T(3,"k3c","Remember where we started: reported revenue up forty four percent, with a tax inside it, and profit down nineteen. Now the question under it.",
    "Remember where we started: reported revenue up 44%, with a tax inside it, and profit down 19%. Now the question under it.",
    dict(type="strips", items=[dict(text="REPORTED REVENUE +44% · TAX INSIDE", at="forty four percent"), dict(text="PROFIT −19%", at="down nineteen"), dict(text="CAN FMCG REPLACE IT?", at="the question under it", red=True)])),
  # ---------------- 4 · can FMCG replace it (the peak)
  title(4,"k40",["CAN FMCG", "REPLACE IT?"], "Chapter four. Can F M C G replace it?"),
  T(4,"k41","Now the growing engine. FMCG-Others earned a result of five hundred and fifty eight crore rupees. A year ago, four hundred and thirty seven. Up twenty eight percent.",
    "Now the growing engine. FMCG-Others earned a result of ₹558 crore. A year ago, ₹437 crore. Up 28%.",
    dict(type="clip", clip="itc_oth", heading="ITC · Q2 FY27 STANDALONE · FMCG-OTHERS · COLUMNS: SEP-26 QTR, SEP-25 QTR, JUN-26 QTR", hl=["five hundred and fifty eight"], stamps=[dict(text="+27.8% ON A YEAR AGO (OUR ARITHMETIC)", at="Up twenty eight")])),
  T(4,"k42","Its revenue rose about sixteen percent on I T C's standalone numbers. For the group, I T C says nineteen percent, its best in fourteen quarters. Part of the group figure comes from an acquisition, so the standalone sixteen is the cleaner one. I T C's own like-for-like figure is seventeen.",
    "Its revenue rose about 16% on ITC's standalone numbers. For the group, ITC says 19%, its best in 14 quarters. Part of the group figure comes from an acquisition, so the standalone 16% is the cleaner one. ITC's own like-for-like figure is 17%.",
    dict(type="bars", heading="FMCG-OTHERS · REVENUE GROWTH vs A YEAR AGO · Q2 FY27", rows=[
      dict(name="STANDALONE (OUR ARITHMETIC)", v=15.7, label="+15.7%", at="about sixteen percent"),
      dict(name="GROUP (ITC SAYS)", v=19, label="+19%", at="nineteen percent"),
      dict(name="LIKE-FOR-LIKE (ITC SAYS)", v=17.3, label="+17.3%", at="like-for-like")],
      stamps=[dict(text="GROUP FIGURE INCLUDES AN ACQUISITION", at="acquisition")])),
  T(4,"k43","That is real growth. Now put it next to the fall. The cigarette result fell by one thousand four hundred and twenty seven crore. FMCG-Others added one hundred and twenty one. That covers eight and a half percent of the gap.",
    "That is real growth. Now put it next to the fall. The cigarette result fell by ₹1,427 crore. FMCG-Others added ₹121 crore. That covers 8.5% of the gap.",
    anchor("next to the fall", "fell by one thousand", "FMCG-Others added", "one hundred and twenty one",
           stamps=[dict(text="−₹1,427 CR vs +₹121 CR = 8.5% COVERED (OUR ARITHMETIC)", at="added one hundred")])),
  T(4,"k44","Add every other segment, Agri, paper and the rest, to FMCG-Others. Together they rose by two hundred and sixty three crore. That covers eighteen percent. Part of that is bought, a paper business acquired in August. And I T C says Agri's leaf tobacco demand is hit by the same tax.",
    "Add every other segment, Agri, paper and the rest, to FMCG-Others. Together they rose by ₹263 crore. That covers 18%. Part of that is bought, a paper business acquired in August. And ITC says Agri's leaf tobacco demand is hit by the same tax.",
    dict(type="table", heading="ALL NON-CIGARETTE SEGMENTS · RESULT vs A YEAR AGO · ₹ CRORE · OUR ARITHMETIC", cols=["SEGMENT", "CHANGE"], rows=[
      dict(cells=["FMCG-Others", "+₹121 cr"], at="FMCG-Others"),
      dict(cells=["Agri (leaf tobacco hit by the tax, ITC says)", "+₹52 cr"], at="Agri"),
      dict(cells=["Paper (acquired Aug 2026)", "+₹91 cr"], at="paper"),
      dict(cells=["All together", "+₹263 cr = 18% of the fall"], at="two hundred and sixty three")])),
  T(4,"k45","Another way to see it: cigarettes earned six point eight times as much as FMCG-Others this quarter. A year ago, twelve times.",
    "Another way to see it: cigarettes earned 6.8 times as much as FMCG-Others this quarter. A year ago, 12 times.",
    dict(type="bars", heading="CIGARETTE RESULT ÷ FMCG-OTHERS RESULT · STANDALONE · OUR ARITHMETIC", rows=[
      dict(name="Q2 FY27", v=6.8, label="6.8×", red=True, at="six point eight times"),
      dict(name="Q2 FY26", v=12.0, label="12.0×", at="A year ago, twelve")])),
  T(4,"k46","So the gap is closing. It has not closed.",
    "So the gap is closing. It has not closed.",
    anchor("the gap", "closing", "It has", "not closed", stamps=[dict(text="THE GAP IS CLOSING. IT HAS NOT CLOSED.", at="closing")])),
  # ---------------- 5 · what the number cannot tell us
  title(5,"k50",["WHAT THE NUMBER", "CANNOT TELL US"], "Chapter five. What the number cannot tell us."),
  T(5,"k51","Here is a piece of arithmetic, not a forecast. If FMCG-Others kept adding one hundred and twenty one crore a year, it would take about twelve such years to cover this one quarter's fall. One quarter is not a trend, and a tax effect can fade or deepen.",
    "Here is a piece of arithmetic, not a forecast. If FMCG-Others kept adding ₹121 crore a year, it would take about 12 such years to cover this one quarter's fall. One quarter is not a trend, and a tax effect can fade or deepen.",
    dict(type="counter", heading="OUR ARITHMETIC · NOT A FORECAST · ₹1,427 CR FALL ÷ ₹121 CR A YEAR", to=11.8, decimals=1, suffix=" YEARS", at="about twelve such years", sub="ONE QUARTER IS NOT A TREND")),
  T(5,"k52","What does I T C say it is doing about it? It says it has re-architected its cigarette portfolio, with new variants and its own trademarks with international appeal, to fight smuggled global brands. That is a plan in I T C's words. It is not yet a result.",
    "What does ITC say it is doing about it? It says it has re-architected its cigarette portfolio, with new variants and its own trademarks with international appeal, to fight smuggled global brands. That is a plan in ITC's words. It is not yet a result.",
    dict(type="clip", clip="itc_pr_rearch", heading="ITC · MEDIA STATEMENT · 2 NOV 2026 · WHAT ITC SAYS", hl=["re-architected its cigarette portfolio"], stamps=[dict(text="A PLAN IN ITC'S WORDS · NOT YET A RESULT", at="not yet a result")])),
  T(5,"k53","And we are missing two things: the tax notification itself, and a volume figure. Without them, nobody can say how long this lasts.",
    "And we are missing two things: the tax notification itself, and a volume figure. Without them, nobody can say how long this lasts.",
    dict(type="hand", title="Missing:", items=[dict(text="The tax notification itself", at="tax notification"), dict(text="A volume figure", at="volume figure"), dict(text="So: how long this lasts?", at="how long this lasts", red=True)])),
  # ---------------- 6 · verdict and end
  title(6,"k60",["THE", "VERDICT"], "Chapter six. The verdict."),
  T(6,"k61","So, can F M C G replace I T C's cigarette profit? Here is what the filing shows. A real fall in cigarette profit. A fast-growing, smaller engine covering a small part of it. And a headline, reported revenue up forty four percent, that mostly measures a tax.",
    "So, can FMCG replace ITC's cigarette profit? Here is what the filing shows. A real fall in cigarette profit. A fast-growing, smaller engine covering a small part of it. And a headline, reported revenue up 44%, that mostly measures a tax.",
    dict(type="strips", items=[dict(text="CIGARETTE PROFIT: A REAL FALL, −27%", at="real fall"), dict(text="FMCG-OTHERS: GROWING, COVERS 8.5% OF IT", at="smaller engine"), dict(text="REPORTED REVENUE +44%: MOSTLY A TAX", at="mostly measures a tax", red=True)])),
  T(6,"k62","Four things to watch. The cigarette result next quarter. Any volume figure I T C gives. Whether FMCG-Others' margin moves beyond ten percent. And the tax notification itself.",
    "Four things to watch. The cigarette result next quarter. Any volume figure ITC gives. Whether FMCG-Others' margin moves beyond 10%. And the tax notification itself.",
    dict(type="hand", title="What to watch:", items=[dict(text="Cigarette result next quarter", at="next quarter"), dict(text="Any volume figure from ITC", at="volume figure"), dict(text="FMCG-Others margin beyond 10%", at="beyond ten percent"), dict(text="The tax notification itself", at="tax notification")])),
  T(6,"k63","Our view, as analysis and not a filing fact: not yet, and not on one quarter's numbers.",
    "Our view, as analysis and not a filing fact: not yet, and not on one quarter's numbers.",
    dict(type="strips", items=[dict(text="OUR VIEW (ANALYSIS, NOT A FILING FACT)", at="Our view"), dict(text="NOT YET · NOT ON ONE QUARTER", at="not yet", red=True), dict(text="INFORMATION, NOT INVESTMENT ADVICE", at="one quarter's numbers")])),
  T(6,"k64","Go back to where we started. Reported revenue up forty four percent, with a tax inside it. Profit down nineteen. The number to watch is not either of them. It is the gap between the two bars.",
    "Go back to where we started. Reported revenue up 44%, with a tax inside it. Profit down 19%. The number to watch is not either of them. It is the gap between the two bars.",
    anchor("where we started", "forty four percent", "down nineteen", "the two bars",
           stamps=[dict(text="WATCH THE GAP BETWEEN THE TWO BARS", at="gap between the two bars")])),
  # ---------------- 7 · sources and end
  T(7,"k70","Every number here comes from I T C's own filings of the second of November, or its earlier results, or our arithmetic on them. Our estimates are marked. Links are in the description.",
    "Every number here comes from ITC's own filings of 2 November, or its earlier results, or our arithmetic on them. Our estimates are marked. Links are in the description.",
    dict(type="sources", items=["ITC · Q2 FY27 standalone results (with segment table and notes) · 2 Nov 2026", "ITC · Q2 FY27 consolidated results · 2 Nov 2026", "ITC · Q2 FY27 media statement and quarterly presentation · 2 Nov 2026", "ITC · Q4 FY26 standalone results and presentation", "Net revenue, margin per rupee, ratios, offsets: our arithmetic / OUR ESTIMATE", "Information, not investment advice"])),
  T(7,"k71","Next: when I T C gives a volume figure, or the tax notification is public, we come back to the gap between the two bars.",
    "Next: when ITC gives a volume figure, or the tax notification is public, we come back to the gap between the two bars.",
    dict(type="strips", items=[dict(text="NEXT", at="Next"), dict(text="A VOLUME FIGURE · THE TAX NOTIFICATION", at="volume figure"), dict(text="BACK TO THE GAP BETWEEN THE TWO BARS", at="gap between the two bars", red=True)])),
  T(7,"k72",END_SAY,END_CAP, dict(type="end")),
])
ITC["marks"] = dict(hook=["k00"], rehooks=["k28", "k3c", "k46", "k53"], turn="k23", counter=["k45", "k51"],
                    plants=[("k13", "k46")], moat="k61", margin="k39", known="k61", unknown="k53", monitor="k62", handoff="k71")
ITC["timelines"] = {}
ITC["shorts"] = []
ITC["pics"] = {}
VIDEOS.append(ITC)
