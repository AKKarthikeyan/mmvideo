# Moat Atlas (the international channel, Oct 2026): long videos in the same Vox engine and illustrated scenes as
# Moat & Margin, voiced and built by build_vx.py like any other entry. Only three things differ, all set per video:
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
# NOT VOICED, NOT RENDERED. Every figure is from search excerpts of TSMC's 3Q26 earnings release (15 Oct 2026); the filing
# PDFs could not be opened from the build session. Before voicing, read each one off the 3Q26 management report:
#   revenue NT$1,494.24B = US$46.72B (+50.9% Y/Y in NT$, +17.6% Q/Q); gross profit NT$992.38B (66.4%, -1.3 pt Q/Q);
#   operating income NT$876.45B (58.7%, -1.6 pt Q/Q); pre-tax NT$911.04B; net income NT$763.06B (51.1%, +68.7% Y/Y, +8.0% Q/Q);
#   wafer revenue by node 2nm 8%, 3nm 33%, 5nm 28%, 7nm 10%; Q4 guide gross 65-67%, operating 56.5-58.5% at NT$31.8.
#   CHECK HARDER: the platform split (HPC 68%, smartphone 21%, rest 11%) and HPC 57% a year ago come from the App Economy
#   Insights graphic, not the filing. Year-ago net margin 45.7% is our arithmetic from the two growth rates.
#   Per $100 of revenue (our arithmetic): $33.60 to make the chips, $7.80 to run the company, +$2.30 interest and other
#   income, $9.90 tax and minority interests, $51.10 kept. Q2 margins (67.7% gross, 60.3% operating) are Q3 plus the Q/Q change.
# Beat d43 has placeholder reasons: fill them from the earnings call, in TSMC's words, before voicing.
_TSMC_PLAT = [dict(key="hpc", label="AI AND DATA-CENTRE CHIPS (HPC)", v=68, text="$68", icon="box", color="blue"),
              dict(key="phone", label="SMARTPHONES", v=21, text="$21", icon="tag", color="orange"),
              dict(key="rest", label="CARS, DEVICES AND THE REST", v=11, text="$11", icon="coin", color="gray")]
_TSMC_DOLLAR = [dict(key="make", label="MAKING THE CHIPS", v=33.586, text="$33.60", icon="box", color="orange"),
                dict(key="run", label="RUNNING THE COMPANY", v=7.759, text="$7.80", icon="person", color="orange"),
                dict(key="tax", label="TAX, LESS INTEREST INCOME", v=7.588, text="$7.60", icon="tag", color="gray"),
                dict(key="kept", label="KEPT AS PROFIT", v=51.067, text="$51.10", icon="coin", color="gold")]
MA_TSMC = dict(id="tsmc3q26", title="TSMC Keeps $51 of Every $100 It Sells. How?", voice="English_Diligent_Man",
  keyword="TSMC", cur="$", brand=ATLAS,
  spine="How does a company that runs factories keep half of every dollar it sells, and why did that slip a little this quarter?",
  next_video="Your Netflix Subscription: Where Does the Money Go?",
  chapters=["$51 of every $100", "Where the dollars come from", "The newest chips", "Following the dollar", "Why the margin slipped", "What TSMC expects", "What to watch", "Sources"],
  beats=[
  T(0,"h00","Out of every hundred dollars TSMC sells, how much does it keep? Not ten. Not twenty five. Fifty one dollars, after paying for its factories, its engineers and its taxes. A year ago, it kept about forty six. So how does a company that runs factories keep half of everything it sells?",
    "Out of every $100 TSMC sells, how much does it keep? Not $10. Not $25. $51, after paying for its factories, its engineers and its taxes. A year ago, it kept about $46 (our arithmetic). So how does a company that runs factories keep half of everything it sells?",
    dict(type="keep", heading="TSMC SELLS $100 OF CHIPS. HOW MUCH DOES IT KEEP?", note="NET PROFIT · TSMC'S RESULTS, 15 OCT 2026 · FILED IN TAIWAN DOLLARS", total=100,
         guesses=[dict(text="$10?", at="Not ten"), dict(text="$25?", at="Not twenty five")],
         was=dict(v=45.7, text="$45.70", label="JUL–SEP 2025", at="A year ago"), now=dict(v=51.1, text="$51.10", label="JUL–SEP 2026", at="Fifty one dollars"),
         ask=dict(text="HOW DOES A FACTORY KEEP HALF?", at="So how does a company"))),
  T(0,"h01","Here is the strange part. Sales grew by about half in a year. Profit grew faster, by more than two thirds. Most factories work the other way round.",
    "Here is the strange part. Sales grew by about half in a year (+50.9% in Taiwan dollars). Profit grew faster, by more than two thirds (+68.7%). Most factories work the other way round.",
    dict(type="duo", heading="JULY TO SEPTEMBER 2026 · AGAINST A YEAR AGO · IN TAIWAN DOLLARS", note="TSMC'S RESULTS · 15 OCT 2026",
         items=[dict(icon="box", label="SALES GREW", v=50.9, text="+50.9%", at="Sales grew"), dict(icon="coin", label="PROFIT GREW", v=68.7, text="+68.7%", at="Profit grew faster")],
         gap=dict(text="PROFIT GREW FASTER", at="other way round"))),
  T(0,"h02","So three questions. Where do the dollars come from? Where do they go? And why, in a record quarter, did the margin slip a little from the quarter before? Stay for the three numbers to watch.",
    "So three questions. Where do the dollars come from? Where do they go? And why, in a record quarter, did the margin slip a little from the quarter before? Stay for the three numbers to watch.",
    dict(type="strips", items=[dict(text="WHERE DO THE DOLLARS COME FROM?", at="Where do the dollars come"), dict(text="WHERE DO THEY GO?", at="Where do they go"), dict(text="WHY DID THE MARGIN SLIP?", at="did the margin slip", red=True)])),
  title(1,"m10",["WHERE THE DOLLARS", "COME FROM"], "First, who pays TSMC?"),
  T(1,"m11","In three months, TSMC billed forty six point seven billion dollars. Of every hundred, about sixty eight came from chips for A I and data centres, which TSMC calls high performance computing. About twenty one came from smartphones. Cars, devices and the rest: about eleven.",
    "In three months, TSMC billed $46.7 billion. Of every $100, about $68 came from chips for AI and data centres, which TSMC calls high-performance computing. About $21 came from smartphones. Cars, devices and the rest: about $11.",
    dict(type="note", heading="EVERY $100 TSMC BILLED · JULY TO SEPTEMBER 2026", note="TSMC'S RESULTS · 15 OCT 2026 · SHARE OF REVENUE BY PLATFORM", total=100, label="$100", segs=_TSMC_PLAT,
         done=[], show=[dict(key="hpc", at="about sixty eight"), dict(key="phone", at="About twenty one"), dict(key="rest", at="Cars, devices")], zoom=False,
         callouts=[dict(text="$46.7 BILLION IN THREE MONTHS", at="forty six point seven")])),
  T(1,"m12","A year ago, the A I and data centre share was about fifty seven dollars of every hundred. Now sixty eight. Smartphones went the other way. Why does that matter for profit? Because of which chips those customers buy.",
    "A year ago, the AI and data-centre share was about $57 of every $100. Now $68. Smartphones went the other way. Why does that matter for profit? Because of which chips those customers buy.",
    dict(type="stacks", heading="OF EVERY $100 TSMC BILLED: AI AND DATA-CENTRE CHIPS", note="TSMC'S RESULTS · JUL–SEP 2025 AND JUL–SEP 2026", icon="box",
         items=[dict(label="JUL–SEP 2025", v=57, text="$57", at="about fifty seven"), dict(label="JUL–SEP 2026", v=68, text="$68", at="Now sixty eight", red=True)],
         stamps=[dict(text="WHY DOES THAT MATTER?", at="Why does that matter")])),
  title(2,"f20",["THE NEWEST", "CHIPS"], "So, which chips?"),
  T(2,"f21","Chips are made on processes named in nanometres. Smaller is newer, and harder to make. Of every hundred dollars of wafers TSMC sold, thirty three were three nanometre chips. Twenty eight were five nanometre. Ten were seven. The newest, two nanometres, is already eight. Older processes: twenty one.",
    "Chips are made on processes named in nanometres. Smaller is newer, and harder to make. Of every $100 of wafers TSMC sold, $33 were 3-nanometre chips. $28 were 5-nanometre. $10 were 7. The newest, 2 nanometres, is already $8. Older processes: $21.",
    dict(type="bars", heading="OF EVERY $100 OF WAFERS TSMC SOLD · JULY TO SEPTEMBER 2026", unit="$",
         rows=[dict(name="2nm (NEWEST)", v=8, label="$8", at="is already eight", red=True), dict(name="3nm", v=33, label="$33", at="thirty three were"),
               dict(name="5nm", v=28, label="$28", at="Twenty eight were"), dict(name="7nm", v=10, label="$10", at="Ten were seven"), dict(name="OLDER", v=21, label="$21", at="Older processes")])),
  T(2,"f22","Add the first four together: seventy nine dollars of every hundred came from seven nanometres or newer. Very few factories in the world can make these at scale. Our reading: when customers have few other places to go, the price reflects it.",
    "Add the first four together: $79 of every $100 came from 7 nanometres or newer. Very few factories in the world can make these at scale. Our reading: when customers have few other places to go, the price reflects it.",
    dict(type="hand", title="Why the newest chips matter:", items=[dict(text="$79 of every $100: 7nm or newer", at="seventy nine dollars"), dict(text="Few factories can make them", at="Very few factories"), dict(text="Few choices → the price reflects it (our reading)", at="the price reflects it", red=True)])),
  title(3,"c30",["FOLLOWING", "THE DOLLAR"], "Now follow one hundred dollars through TSMC."),
  T(3,"c31","Take one hundred dollars of TSMC's sales. Making the chips, the materials, the power, and the machines wearing out, took about thirty three dollars sixty. Running the company, research, sales and offices, took seven eighty. Tax, after a little interest income, took seven sixty. Kept as profit: fifty one dollars.",
    "Take $100 of TSMC's sales. Making the chips (the materials, the power, and the machines wearing out) took about $33.60. Running the company (research, sales and offices) took $7.80. Tax, after a little interest income, took $7.60. Kept as profit: $51.10 (our arithmetic).",
    dict(type="note", heading="$100 OF TSMC'S SALES, CUT INTO PIECES · JULY TO SEPTEMBER 2026", note="OUR ARITHMETIC FROM TSMC'S RESULTS · 15 OCT 2026", total=100, label="$100", segs=_TSMC_DOLLAR,
         done=[], show=[dict(key="make", at="Making the chips"), dict(key="run", at="Running the company"), dict(key="tax", at="Tax, after"), dict(key="kept", at="Kept as profit")], zoom=False,
         callouts=[dict(text="KEPT: $51.10", at="Kept as profit", red=True)])),
  T(3,"c32","The tax line hides two moves. Interest and other income added about two dollars thirty. Tax, and the slice that belongs to minority shareholders in TSMC's subsidiaries, took about nine ninety. Net, seven sixty.",
    "The tax line hides two moves. Interest and other income added about $2.30. Tax, and the slice that belongs to minority shareholders in TSMC's subsidiaries, took about $9.90. Net, $7.60 (our arithmetic).",
    dict(type="scale", heading="INSIDE THE TAX LINE · PER $100 OF SALES", note="OUR ARITHMETIC FROM TSMC'S RESULTS · 15 OCT 2026",
         left=dict(label="INTEREST AND OTHER INCOME", text="+$2.30", v=2.3, at="Interest and other income", color="green"), right=dict(label="TAX AND MINORITY INTERESTS", text="$9.90", v=9.9, at="took about nine ninety", color="blue"),
         result=dict(text="NET: $7.60", at="Net, seven sixty"))),
  title(4,"d40",["WHY THE MARGIN", "SLIPPED"], "So why did the margin slip, in a record quarter?"),
  T(4,"d41","Compared with April to June, sales grew seventeen point six percent. Profit grew only eight. Something cost more.",
    "Compared with April to June, sales grew 17.6%. Profit grew only 8.0%. Something cost more.",
    dict(type="duo", heading="JULY TO SEPTEMBER 2026 · AGAINST APRIL TO JUNE · IN TAIWAN DOLLARS", note="TSMC'S RESULTS · 15 OCT 2026",
         items=[dict(icon="box", label="SALES GREW", v=17.6, text="+17.6%", at="sales grew"), dict(icon="coin", label="PROFIT GREW", v=8.0, text="+8.0%", at="Profit grew only")],
         gap=dict(text="SOMETHING COST MORE", at="Something cost more"))),
  T(4,"d42","The gross margin fell from about sixty seven point seven percent to sixty six point four. The operating margin fell from about sixty point three to fifty eight point seven. Small moves, on a very large base.",
    "The gross margin fell from about 67.7% to 66.4%. The operating margin fell from about 60.3% to 58.7%. Small moves, on a very large base.",
    dict(type="bars", heading="TSMC'S MARGINS · APRIL TO JUNE AND JULY TO SEPTEMBER 2026", unit="%",
         rows=[dict(name="GROSS · APR–JUN", v=67.7, label="67.7%", at="sixty seven point seven"), dict(name="GROSS · JUL–SEP", v=66.4, label="66.4%", at="to sixty six point four", red=True),
               dict(name="OPERATING · APR–JUN", v=60.3, label="60.3%", at="about sixty point three"), dict(name="OPERATING · JUL–SEP", v=58.7, label="58.7%", at="to fifty eight point seven", red=True)])),
  # TODO before voicing: replace the placeholder reasons with what TSMC said on the 3Q26 earnings call, attributed.
  T(4,"d43","Why? On its earnings call, TSMC gave its reasons. In its own words: reason one. Reason two. Reason three.",
    "Why? On its earnings call, TSMC gave its reasons. In its own words: reason one. Reason two. Reason three.",
    dict(type="hand", title="TSMC's reasons (earnings call):", items=[dict(text="FILL: reason one", at="reason one"), dict(text="FILL: reason two", at="Reason two"), dict(text="FILL: reason three", at="Reason three", red=True)])),
  title(5,"g50",["WHAT TSMC", "EXPECTS"], "So what does TSMC expect next?"),
  T(5,"g51","For October to December, TSMC expects a gross margin between sixty five and sixty seven percent, and an operating margin between fifty six and a half and fifty eight and a half. That assumes thirty one point eight Taiwan dollars to the US dollar.",
    "For October to December, TSMC expects a gross margin between 65% and 67%, and an operating margin between 56.5% and 58.5%. That assumes NT$31.8 to the US dollar.",
    dict(type="cards", cards=[dict(top="GROSS MARGIN · Q4 GUIDE", big="65–67%", sub="JUL–SEP: 66.4%", at="gross margin between"),
                              dict(top="OPERATING MARGIN · Q4 GUIDE", big="56.5–58.5%", sub="JUL–SEP: 58.7%", at="operating margin between"),
                              dict(top="ASSUMES", big="NT$31.8 = $1", at="That assumes", fill="mustard")])),
  T(5,"g52","Both midpoints sit a little below what TSMC just did. Flat to slightly lower: not a slide.",
    "Both midpoints sit a little below what TSMC just did. Flat to slightly lower: not a slide.",
    dict(type="strips", items=[dict(text="MIDPOINTS: A LITTLE BELOW Q3", at="Both midpoints"), dict(text="FLAT TO SLIGHTLY LOWER", at="Flat to slightly lower"), dict(text="NOT A SLIDE", at="not a slide", red=True)])),
  title(6,"v60",["WHAT TO", "WATCH"], "So will fifty one dollars hold?"),
  T(6,"v61","Three numbers will tell you. How fast two nanometres grows from eight dollars of every hundred. Whether the gross margin lands inside sixty five to sixty seven percent. And whether A I and data centre chips stay above two thirds of sales.",
    "Three numbers will tell you. How fast 2 nanometres grows from $8 of every $100. Whether the gross margin lands inside 65% to 67%. And whether AI and data-centre chips stay above two thirds of sales.",
    dict(type="hand", title="Three numbers to watch:", items=[dict(text="2nm: $8 of every $100 today", at="How fast two nanometres"), dict(text="Gross margin inside 65–67%?", at="Whether the gross margin"), dict(text="AI chips above ⅔ of sales?", at="stay above two thirds", red=True)])),
  T(6,"v62","TSMC keeps fifty one dollars of every hundred. Next week, a hundred dollars you may spend yourself: your Netflix subscription. How much pays for the shows, and how much does Netflix keep?",
    "TSMC keeps $51 of every $100. Next week, $100 you may spend yourself: your Netflix subscription. How much pays for the shows, and how much does Netflix keep?",
    dict(type="strips", items=[dict(text="TSMC KEEPS $51 OF EVERY $100", at="TSMC keeps"), dict(text="NEXT: YOUR NETFLIX SUBSCRIPTION", at="your Netflix subscription"), dict(text="HOW MUCH DOES NETFLIX KEEP?", at="how much does Netflix keep", red=True)])),
  T(7,"z71","Every number is from TSMC's own filings, except our own arithmetic, which we label. Sources are linked in the description.",
    "Every number is from TSMC's own filings, except our own arithmetic, which we label. Sources are linked in the description.",
    dict(type="sources", items=["TSMC: 3Q26 earnings release, 15 Oct 2026", "TSMC: 3Q26 management report and earnings conference presentation", "TSMC: 3Q26 earnings call (reasons for the margin change)",
                                "US$ at NT$31.98, the rate implied by reported revenue of US$46.72B", "Per-$100 splits and year-ago margin: our arithmetic", "Information, not investment advice · narration: synthetic voice"])),
  T(7,"z72","Subscribe to follow the dollar, every week.",
    "Subscribe to follow the dollar, every week.",
    dict(type="end", plain=True)),
])
MA_TSMC["hooks"] = ["h00|how much does it keep", "h00|So how does a company", "h01|Here is the strange part", "h02|Where do the dollars come from", "h02|Stay for the three numbers",
                    "m10", "m12|Why does that matter", "f20", "f22|Our reading", "c30", "c32|The tax line hides", "d40", "d41|Something cost more", "d43|Why?", "g50", "v60", "v62|how much does Netflix keep"]
MA_TSMC["timelines"] = {}
MA_TSMC["shorts"] = []
MA_TSMC["pics"] = {}
_MA_TSMC_CAP = {"m10": "First, who pays TSMC?", "f20": "So, which chips?", "c30": "Now follow $100 through TSMC.", "d40": "So why did the margin slip, in a record quarter?",
                "g50": "So what does TSMC expect next?", "v60": "So will $51 hold?"}
for _b in MA_TSMC["beats"]:
    if _b["scene"]["type"] == "title": _b["cap"] = _MA_TSMC_CAP.get(_b["key"])

GLOBAL_VIDEOS = [MA_TSMC]
