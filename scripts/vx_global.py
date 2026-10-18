# Moat Atlas (the international channel, Oct 2026): long videos in the Moat 60 template (A01 "What Is a Moat in Business?",
# vx_scripts.py): the same Vox engine and illustrated scenes, voiced and built by build_vx.py. Only three things differ:
#   cur   = "$"  (coins, tags and notes print dollars; money texts start with "$" so the scenes read it too)
#   brand = Moat Atlas corner line and end card, with the synthetic-voice credit and "not investment advice"
#   no SEBI wording (a global audience; the end card says information, not investment advice)
# Each beat: key, ch, say (spoken; numbers as words), cap (display; numerals), scene (engine spec), as in vx_scripts.py.
# Appended to VIDEOS at the end of vx_scripts.py, so `build_vx.py tsmc3q26` works unchanged.

def T(ch, key, say, cap, scene): return dict(ch=ch, key=key, say=say, cap=cap, scene=scene)
def title(ch, key, lines, say=None, red=False):
    return T(ch, key, say or f"Chapter {ch}. " + " ".join(lines).capitalize().rstrip(",") + ".", None, dict(type="title", lines=lines, red=red))

ATLAS = dict(name="MOAT ATLAS", line="Moat Atlas · the business behind the ticker",
             end=["Information, not investment advice.", "Research and script: Moat & Margin research team", "Narration: synthetic voice", "Sources linked in the description"])

# ---------------------------------------------------------------- TSMC Q3 2026 (episode 1, publish 27 Oct 2026)
# Written to the Moat 60 template of A01 "What Is a Moat in Business?" (vx_scripts.py, 17 Oct 2026), AK 18 Oct 2026:
#   understandable for school children; more motion, fewer words, more numbers, no jargon left unexplained;
#   chapters are the questions people search, and each answers itself in its first two sentences;
#   a through-line picture (the castle and its water) in every chapter; one made-up example, labelled (Priya's bakery);
#   sentences of 15 words or fewer (none over 20); at most 4 words a label on screen; a 20 s recap of every answer;
#   the close runs the same 3-question moat test as A01 (copy it? rebuild it? one person?).
# One thing, one colour and icon: TSMC = store; money = coin; making = box; people = person; tax = tag.
# NOT VOICED. Every figure is from search excerpts of TSMC's 3Q26 earnings release (15 Oct 2026); the filing PDFs could
# not be opened from the build session. Before voicing, read each one off the 3Q26 management report:
#   revenue US$46.72B (NT$1,494.24B; +50.9% Y/Y in NT$, +17.6% Q/Q); gross margin 66.4% (-1.3 pt Q/Q); operating margin
#   58.7% (-1.6 pt Q/Q); net income NT$763.06B (51.1% of revenue; +68.7% Y/Y, +8.0% Q/Q); wafer revenue by node 2nm 8%,
#   3nm 33%, 5nm 28%, 7nm 10%; Q4 guide gross 65-67%, operating 56.5-58.5% at NT$31.8.
#   CHECK HARDER: the platform split (HPC 68%, smartphone 21%, rest 11%) and HPC 57% a year ago come from the App Economy
#   Insights graphic, not the filing. Year-ago net margin (about 46%) and every per-$100 split are our arithmetic.
#   Customers named (Apple, Nvidia, AMD): confirm each is named as a customer in TSMC's annual report or the companies' own.
# Beat s42 has placeholder reasons: fill them from the earnings call, in TSMC's words, before voicing.
_TSMC_PLAT = [dict(key="hpc", label="AI CHIP MAKERS", v=68, text="$68", icon="box", color="blue"),
              dict(key="phone", label="SMARTPHONES", v=21, text="$21", icon="tag", color="orange"),
              dict(key="rest", label="EVERYTHING ELSE", v=11, text="$11", icon="coin", color="gray")]
_TSMC_DOLLAR = [dict(key="make", label="MAKING THE CHIPS", v=33, text="$33", icon="box", color="orange"),
                dict(key="run", label="RUNNING THE COMPANY", v=8, text="$8", icon="person", color="orange"),
                dict(key="tax", label="TAX", v=8, text="$8", icon="tag", color="gray"),
                dict(key="kept", label="KEPT", v=51, text="$51", icon="coin", color="gold")]
MA_TSMC = dict(id="tsmc3q26", title="How Does TSMC Make Money? Explained Simply", voice="English_Diligent_Man",
  keyword="TSMC", cur="$", brand=ATLAS,
  spine="How does a company that runs factories keep half of every dollar it sells?",
  next_video="Your Netflix Subscription: Where Does the Money Go?",
  chapters=["What does TSMC do?", "Who pays TSMC?", "How much does TSMC keep?", "Why can't rivals copy TSMC?",
            "Why did TSMC's margin slip?", "What does TSMC expect next?", "Does TSMC pass the moat test?", "Sources"],
  beats=[
  # ---- 0 · What does TSMC do?
  T(0,"w00","What does TSMC do? It makes chips that other companies design. And it keeps fifty one dollars of every hundred it sells. How does a factory keep half? Picture a castle, with deep water all around it.",
    "What does TSMC do? It makes chips that other companies design. And it keeps $51 of every $100 it sells. How does a factory keep half? Picture a castle, with deep water all around it.",
    dict(type="castle", flag="TSMC", flagAt="What does TSMC do", moatAt="deep water all around", checks=[],
         stamps=[dict(text="$51 OF EVERY $100", at="fifty one dollars")])),
  T(0,"w01","Here is a made up bakery. Priya bakes cakes for ten famous cafés. Each café puts its own name on the box. Customers never see Priya's name. But every café needs her ovens.",
    "Here is a made-up bakery. Priya bakes cakes for 10 famous cafés. Each café puts its own name on the box. Customers never see Priya's name. But every café needs her ovens.",
    dict(type="store", heading="PRIYA'S BAKERY", note="MADE-UP EXAMPLE", sign="BAKERY",
         facts=[dict(text="BAKES FOR 10 CAFÉS", at="ten famous cafés"), dict(text="CAFÉS PUT THEIR NAME", at="its own name on the box")])),
  T(0,"w02","TSMC is Priya, for chips. Companies like Apple and Nvidia design chips. TSMC builds them. From July to September, that brought in forty six point seven billion dollars.",
    "TSMC is Priya, for chips. Companies like Apple and Nvidia design chips. TSMC builds them. From July to September 2026, that brought in $46.7 billion.",
    dict(type="store", heading="TSMC · JULY TO SEPTEMBER 2026", note="TSMC'S RESULTS · 15 OCT 2026", sign="CHIP FACTORY",
         facts=[dict(text="OTHERS DESIGN", at="design chips"), dict(text="TSMC BUILDS", at="TSMC builds them"), dict(text="$46.7 BILLION", at="forty six point seven")])),
  T(0,"w03","By the end, you will run our three question moat test on TSMC. First: who pays it?",
    "By the end, you will run our 3-question moat test on TSMC. First: who pays it?",
    dict(type="castle", flag="TSMC", flagAt=0, moatAt=0, checks=[], stamps=[dict(text="3-QUESTION TEST", at="three question moat test")])),
  # ---- 1 · Who pays TSMC?
  T(1,"p10","Who pays TSMC? Mostly companies that make chips for A I and data centres. Of every hundred dollars, about sixty eight came from them. Smartphones paid about twenty one. Everything else, about eleven.",
    "Who pays TSMC? Mostly companies that make chips for AI and data centres. Of every $100, about $68 came from them. Smartphones paid about $21. Everything else, about $11.",
    dict(type="note", heading="WHO PAID TSMC'S $100", note="TSMC'S RESULTS · JUL–SEP 2026 · BY PLATFORM", total=100, label="$100", segs=_TSMC_PLAT,
         done=[], show=[dict(key="hpc", at="about sixty eight"), dict(key="phone", at="Smartphones paid"), dict(key="rest", at="Everything else")], zoom=False, callouts=[])),
  T(1,"p11","A year ago, A I chip makers paid about fifty seven of every hundred. Now, sixty eight. So the castle now stands on A I. Why does that help TSMC keep more?",
    "A year ago, AI chip makers paid about $57 of every $100. Now, $68. So the castle now stands on AI. Why does that help TSMC keep more?",
    dict(type="stacks", heading="AI CHIP MAKERS' SHARE", note="TSMC'S RESULTS · OF EVERY $100", icon="box",
         items=[dict(label="A YEAR AGO", v=57, text="$57", at="about fifty seven"), dict(label="NOW", v=68, text="$68", at="Now, sixty eight", red=True)],
         stamps=[dict(text="WHY DOES IT HELP?", at="Why does that help")])),
  # ---- 2 · How much does TSMC keep?
  T(2,"k20","How much does TSMC keep? Fifty one dollars of every hundred. Not ten. Not twenty five. A year ago, it kept about forty six.",
    "How much does TSMC keep? $51 of every $100. Not $10. Not $25. A year ago, it kept about $46 (our arithmetic).",
    dict(type="keep", heading="TSMC SELLS $100. WHAT DOES IT KEEP?", note="NET PROFIT · TSMC'S RESULTS, 15 OCT 2026", total=100,
         guesses=[dict(text="$10?", at="Not ten"), dict(text="$25?", at="Not twenty five")],
         was=dict(v=45.7, text="$46", label="A YEAR AGO", at="A year ago"), now=dict(v=51.1, text="$51", label="NOW", at="Fifty one dollars of every"))),
  T(2,"k21","Follow one hundred dollars. Making the chips takes about thirty three. Running the company takes about eight. Tax takes about eight more. Fifty one is left.",
    "Follow $100. Making the chips takes about $33. Running the company takes about $8. Tax takes about $8 more. $51 is left (our arithmetic; tax is after interest income).",
    dict(type="note", heading="$100 OF SALES, CUT UP", note="OUR ARITHMETIC FROM TSMC'S RESULTS · JUL–SEP 2026", total=100, label="$100", segs=_TSMC_DOLLAR,
         done=[], show=[dict(key="make", at="Making the chips"), dict(key="run", at="Running the company"), dict(key="tax", at="Tax takes"), dict(key="kept", at="Fifty one is left")], zoom=False,
         callouts=[dict(text="KEPT: $51", at="Fifty one is left", red=True)])),
  T(2,"k22","And the share it keeps is growing. In a year, sales grew by half. Profit grew by two thirds.",
    "And the share it keeps is growing. In a year, sales grew by half (+50.9%). Profit grew by two thirds (+68.7%, in Taiwan dollars).",
    dict(type="duo", heading="IN ONE YEAR", note="TSMC'S RESULTS · IN TAIWAN DOLLARS",
         items=[dict(icon="box", label="SALES", v=50.9, text="+51%", at="sales grew by half"), dict(icon="coin", label="PROFIT", v=68.7, text="+69%", at="Profit grew")],
         gap=dict(text="PROFIT GREW FASTER", at="two thirds"))),
  # ---- 3 · Why can't rivals copy TSMC?
  T(3,"c30","Why can't rivals copy TSMC? Because very few can make the newest chips. Chip makers name each new step by size. Smaller is newer, and harder to make.",
    "Why can't rivals copy TSMC? Because very few can make the newest chips. Chip makers name each new step by size, in nanometres. Smaller is newer, and harder to make.",
    dict(type="castle", flag="TSMC", flagAt=0, moatAt="very few can make", checks=[], stamps=[dict(text="SMALLER = HARDER", at="Smaller is newer")])),
  T(3,"c31","Of every hundred dollars of chips TSMC sold, thirty three were the three nanometre size. Twenty eight were five. Ten were seven. The newest, two, is already eight. Older sizes: twenty one.",
    "Of every $100 of chips TSMC sold, $33 were the 3-nanometre size. $28 were 5. $10 were 7. The newest, 2, is already $8. Older sizes: $21.",
    dict(type="bars", heading="OF EVERY $100 OF CHIPS SOLD", unit="$",
         rows=[dict(name="2nm · NEWEST", v=8, label="$8", at="is already eight", red=True), dict(name="3nm", v=33, label="$33", at="thirty three were"),
               dict(name="5nm", v=28, label="$28", at="Twenty eight were"), dict(name="7nm", v=10, label="$10", at="Ten were seven"), dict(name="OLDER", v=21, label="$21", at="Older sizes")])),
  T(3,"c32","Add up the newest four. Seventy nine of every hundred dollars. That is the water around the castle. A new chip factory costs billions of dollars. And it takes years to run one well.",
    "Add up the newest four: $79 of every $100. That is the water around the castle. A new chip factory costs billions of dollars. And it takes years to run one well.",
    dict(type="castle", flag="TSMC", flagAt=0, moatAt="That is the water", note="OUR READING",
         checks=[dict(text="$79 OF $100: NEWEST", ok=True, at="Seventy nine of every"), dict(text="BILLIONS TO BUILD", ok=True, at="costs billions"), dict(text="YEARS TO LEARN", ok=True, at="takes years")])),
  # ---- 4 · Why did TSMC's margin slip?
  T(4,"s40","Why did TSMC's margin slip? Because costs grew faster than sales, against April to June. Sales grew seventeen point six percent. Profit grew only eight.",
    "Why did TSMC's margin slip? Because costs grew faster than sales, against April to June. Sales grew 17.6%. Profit grew only 8.0%.",
    dict(type="duo", heading="AGAINST APRIL TO JUNE 2026", note="TSMC'S RESULTS · IN TAIWAN DOLLARS",
         items=[dict(icon="box", label="SALES", v=17.6, text="+17.6%", at="Sales grew"), dict(icon="coin", label="PROFIT", v=8.0, text="+8%", at="Profit grew only")],
         gap=dict(text="COSTS GREW FASTER", at="costs grew faster"))),
  T(4,"s41","The gross margin is what is left after making the chips. It fell from about sixty seven point seven percent to sixty six point four. Small, on a very big base.",
    "The gross margin is what is left after making the chips. It fell from about 67.7% to 66.4%. Small, on a very big base.",
    dict(type="stacks", heading="GROSS MARGIN", note="TSMC'S RESULTS · LEFT AFTER MAKING THE CHIPS", icon="coin",
         items=[dict(label="APR–JUN", v=67.7, text="67.7%", at="sixty seven point seven"), dict(label="JUL–SEP", v=66.4, text="66.4%", at="to sixty six point four", red=True)],
         stamps=[dict(text="SMALL, ON A BIG BASE", at="Small, on a very")])),
  # TODO before voicing: replace the placeholder reasons with what TSMC said on the 3Q26 earnings call, attributed.
  T(4,"s42","What made costs grow? On its earnings call, TSMC named its reasons. Reason one. Reason two. Reason three.",
    "What made costs grow? On its earnings call, TSMC named its reasons. Reason one. Reason two. Reason three.",
    dict(type="hand", title="TSMC's reasons:", items=[dict(text="FILL: reason one", at="Reason one"), dict(text="FILL: reason two", at="Reason two"), dict(text="FILL: reason three", at="Reason three", red=True)])),
  # ---- 5 · What does TSMC expect next?
  T(5,"g50","What does TSMC expect next? About the same margins, or a little lower. For October to December, its gross margin guide is sixty five to sixty seven percent. Last quarter: sixty six point four.",
    "What does TSMC expect next? About the same margins, or a little lower. For October to December, its gross margin guide is 65% to 67%. Last quarter: 66.4%.",
    dict(type="cards", cards=[dict(top="GUIDE · OCT–DEC", big="65–67%", sub="GROSS MARGIN", at="sixty five to sixty seven"),
                              dict(top="LAST QUARTER", big="66.4%", sub="GROSS MARGIN", at="Last quarter", fill="mustard")])),
  T(5,"g51","The middle of that range sits a little below last quarter. Flat, or slightly lower. Not a slide.",
    "The middle of that range sits a little below last quarter. Flat, or slightly lower. Not a slide. (Operating margin guide: 56.5% to 58.5%, against 58.7%.)",
    dict(type="strips", items=[dict(text="A LITTLE BELOW", at="a little below"), dict(text="FLAT OR SLIGHTLY LOWER", at="Flat, or slightly"), dict(text="NOT A SLIDE", at="Not a slide", red=True)])),
  # ---- 6 · Does TSMC pass the moat test?
  T(6,"t60","Does TSMC pass our moat test? Ask our three questions. One: can a rival with money and time copy it? Two: must it be rebuilt again and again? Three: does it walk out with one person?",
    "Does TSMC pass our moat test? Ask our 3 questions. One: can a rival with money and time copy it? Two: must it be rebuilt again and again? Three: does it walk out with one person?",
    dict(type="counter", to=3, decimals=0, sub="QUESTIONS", at="three questions", stamps=[dict(text="COPY · REBUILD · ONE PERSON", at="walk out with one person")])),
  T(6,"t61","Copy it? Very hard, on our reading. Rebuild it? Yes. Every new size costs billions again. One person? No. So: a wide moat, that must be dug again every few years.",
    "Copy it? Very hard, on our reading. Rebuild it? Yes. Every new size costs billions again. One person? No. So: a wide moat, that must be dug again every few years.",
    dict(type="castle", flag="TSMC", flagAt=0, moatAt="a wide moat", note="OUR READING · NOT INVESTMENT ADVICE",
         checks=[dict(text="COPY IT? VERY HARD", ok=True, at="Copy it?"), dict(text="REBUILD IT? YES", ok=False, at="Rebuild it?"), dict(text="ONE PERSON? NO", ok=True, at="One person?")],
         stamps=[dict(text="DUG AGAIN AND AGAIN", at="dug again")])),
  T(6,"t62","Three numbers to watch next time. Does the two nanometre share keep growing? Does the margin land in the guide? Do A I chip makers stay above two thirds?",
    "Three numbers to watch next time. Does the 2-nanometre share keep growing? Does the margin land in the guide? Do AI chip makers stay above two thirds?",
    dict(type="hand", title="Watch next time:", items=[dict(text="2nm share: $8 today", at="two nanometre share"), dict(text="Margin inside 65–67%?", at="land in the guide"), dict(text="AI makers above ⅔?", at="stay above two thirds", red=True)])),
  T(6,"t63","Quick recap. What does TSMC do? Makes chips others design. Who pays? Mostly A I chip makers. What does it keep? Fifty one of every hundred. Why can't rivals copy it? The newest chips are hard to make. The slip? Costs grew faster. Next? About the same. The test? A wide moat, dug again.",
    "Quick recap. What does TSMC do? Makes chips others design. Who pays? Mostly AI chip makers. What does it keep? $51 of every $100. Why can't rivals copy it? The newest chips are hard to make. The slip? Costs grew faster. Next? About the same. The test? A wide moat, dug again.",
    dict(type="castle", flag="RECAP", flagAt=0, moatAt=0, checks=[])),
  T(6,"t64","Next: your Netflix subscription. Where does each dollar go?",
    "Next: your Netflix subscription. Where does each dollar go?",
    dict(type="cards", cards=[dict(top="NEXT", big="NETFLIX", sub="WHERE YOUR DOLLAR GOES", at="your Netflix subscription")])),
  # ---- 7 · Sources
  T(7,"z70","Every source is in the description. Priya's bakery is made up.",
    "Every source is in the description. Priya's bakery is made up.",
    dict(type="sources", items=["TSMC: 3Q26 earnings release, 15 Oct 2026", "TSMC: 3Q26 management report and earnings conference presentation", "TSMC: 3Q26 earnings call (reasons for the margin change)",
                                "US$ figures as reported by TSMC; growth rates in Taiwan dollars", "Per-$100 splits, the year-ago share kept and the moat test: our arithmetic and our reading",
                                "Priya's bakery is a made-up example", "Information, not investment advice · narration: synthetic voice"])),
  T(7,"z71","Subscribe to follow the dollar, explained simply.",
    "Subscribe to follow the dollar, explained simply.",
    dict(type="end", plain=True)),
])
MA_TSMC["hooks"] = ["w00|What does TSMC do", "w00|How does a factory keep half", "w01|Here is a made up bakery", "w03|First: who pays it", "p10|Who pays TSMC",
                    "p11|Why does that help", "k20|How much does TSMC keep", "k21|Follow one hundred dollars", "c30|Why can't rivals copy", "c32|That is the water",
                    "s40|Why did TSMC's margin slip", "s42|What made costs grow", "g50|What does TSMC expect next", "t60|Does TSMC pass", "t61|So: a wide moat", "t63|Quick recap", "t64|Next"]
MA_TSMC["timelines"] = {}
MA_TSMC["shorts"] = []
MA_TSMC["pics"] = {}

GLOBAL_VIDEOS = [MA_TSMC]
