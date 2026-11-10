# "Will NVIDIA Survive Without JENSEN? Explained Like You're 5" (Moat Atlas, written 9-10 Nov 2026).
# Source of truth for the words and the picture plan: public/vx/nvidiajensen/SCRIPT.md (branch claude/festive-euler-tw49ng of
# AKKarthikeyan/mmvideo, commit cc52c1e). Beat keys match the script (n00 ... n90). n81 is split in two so the castle and the
# closing line each get their own beat. Four trailer-style Shorts are separate ids (nvidiasa ... nvidiasd), see the end of this file.
# Photos live in public/vx/<id>/pics/<name>.png (converted from the licensed JPGs; none is CC BY-SA). Clips are cropped from NVIDIA's
# own annual report PDF by build_vx.crop (CLIPS entries nv_succession and nv_cuda).
# Imported at the end of vx_scripts.py, so T, title and VIDEOS already exist.
from vx_scripts import VIDEOS, T, title

NVT = [["1995", "NV1 CHIP"], ["1999", "GEFORCE 256"], ["2006", "CUDA"], ["2012", "ALEXNET ON 2 NVIDIA GPUS"], ["2023–26", "AI BOOM"]]
OFFICERS = [("HUANG", "PRESIDENT & CEO"), ("KRESS", "EVP & CFO"), ("PURI", "EVP, WORLDWIDE FIELD OPS"), ("SHOQUIST", "EVP, OPERATIONS"), ("TETER", "EVP & GENERAL COUNSEL")]
TENK = "NVIDIA 10-K FY2026"

def _officer_rows(huang_at, rest_at):
    return [dict(cells=[n, r], at=(huang_at if n == "HUANG" else rest_at)) for n, r in OFFICERS]

NV = dict(calm=True, brand="Moat Atlas", id="nvidiajensen", title="Will NVIDIA Survive Without JENSEN? Explained Like You're 5", voice="English_Diligent_Man",
  keyword="NVIDIA",
  spine="Would NVIDIA survive without Jensen Huang? Three checks: is the recipe written down, are the customers stuck, is there a second chef?",
  chapters=["Cold open", "What happened", "Why Jensen matters", "The moat test", "Has this happened before?", "The answer", "Sources"],
  beats=[
  # ---- 0 · cold open
  T(0, "n00", "This man runs one of the most valuable companies in the world. On Friday, NVIDIA was worth about four and a half trillion dollars.",
    "This man runs one of the most valuable companies in the world. On Friday, NVIDIA was worth about $4.5 trillion.",
    dict(type="pic", pic="ces", heading="CES 2025 · PHOTO: PRONOIA, CC0",
         items=[dict(text="NVIDIA", at="NVIDIA was worth"), dict(text="≈ $4.5 TRILLION · 6 NOV", at="four and a half trillion")],
         stamps=[dict(text="VALUE: YAHOO FINANCE", at="four and a half trillion")])),
  T(0, "n01", "This weekend, its board opened an investigation into him. Nobody has charged him with anything. But it raised one big question.", None,
    dict(type="kinetic", kicker="8 NOV 2026",
         lines=[dict(t="A BOARD INVESTIGATION.", at="board opened an investigation", em=["INVESTIGATION"]), dict(t="NO CHARGES.", at="Nobody has charged", em=["CHARGES"]),
                dict(t="ONE BIG QUESTION.", at="one big question", em=["QUESTION"])])),
  T(0, "n02", "Will NVIDIA survive without Jensen Huang? Let's explain it like you're five.", None,
    dict(type="strips", items=[dict(text="WILL NVIDIA SURVIVE", at="Will NVIDIA survive"), dict(text="WITHOUT JENSEN?", at="without Jensen", red=True),
                               dict(text="EXPLAINED LIKE YOU'RE 5", at="explain it like")])),
  # ---- 1 · what happened
  title(1, "n10", ["WHAT", "HAPPENED"], "Chapter one. What happened."),
  T(1, "n11", "At the end of October, the New York Times reported that American officials believe someone close to Jensen was working for Chinese intelligence. On Sunday, Jensen told his staff he had been unfaithful to his wife. The same day, NVIDIA's board said independent directors, with outside lawyers, would investigate.", None,
    dict(type="cards", heading="NYT (OCT 2026) · CNN · CNBC · NPR (8 NOV)",
         cards=[dict(top="THE REPORT", big="NYT · END OCT", sub="REPORTED, NOT PROVEN", at="New York Times reported"), dict(top="THE MEMO", big="8 NOV", sub="JENSEN TO STAFF", at="On Sunday"),
                dict(top="THE PROBE", big="BOARD + LAWYERS", sub="INDEPENDENT DIRECTORS", at="The same day", fill="mustard")])),
  T(1, "n12", "Three things matter. The board says it has no reason to believe NVIDIA's secrets or America's national security were compromised. China calls the spy claims groundless speculation. And NVIDIA says Jensen will stay on as boss during the investigation.", None,
    dict(type="pic", pic="gesturing", heading="PHOTO: MAURIZIO PESCE, CC BY 2.0",
         items=[dict(text="BOARD: NO SIGN SECRETS LEAKED", at="The board says"), dict(text="CHINA: \"GROUNDLESS SPECULATION\"", at="China calls"), dict(text="STILL CEO DURING THE PROBE", at="And NVIDIA says")])),
  T(1, "n13", "So this is a question mark, not a verdict. But markets hate question marks. Friday, NVIDIA's shares closed at one hundred and eighty six dollars sixty four cents. On Monday morning, before trading began, they were down about four percent.",
    "So this is a question mark, not a verdict. But markets hate question marks. Friday, NVIDIA's shares closed at $186.64. On Monday morning, before trading began, they were down about 4%.",
    dict(type="strips", heading="YAHOO FINANCE · 9 NOV 2026",
         items=[dict(text="FRI 6 NOV CLOSE: $186.64", at="closed at"), dict(text="MON PRE-MARKET: ABOUT −4%", at="down about four percent", red=True)])),
  T(1, "n14", "For a company this big, every one percent is worth about forty five billion dollars. So people are asking: how much of NVIDIA is just Jensen?",
    "For a company this big, every 1% is worth about $45 billion. So people are asking: how much of NVIDIA is just Jensen?",
    dict(type="kinetic", kicker="OUR ARITHMETIC: 1% OF $4.5 TRILLION",
         lines=[dict(t="1% ≈ $45 BILLION", at="every one percent", em=["45"]), dict(t="HOW MUCH IS JUST JENSEN?", at="how much of NVIDIA", em=["JENSEN"])])),
  # ---- 2 · why Jensen matters
  title(2, "n20", ["WHY JENSEN", "MATTERS"], "Chapter two. Why Jensen matters."),
  T(2, "n21", "Think of NVIDIA as a restaurant. In nineteen ninety three, Jensen and two friends, Chris Malachowsky and Curtis Priem, planned it at a Denny's in Silicon Valley.", None,
    dict(type="pic", pic="dennys", heading="ILLUSTRATIVE · PHOTO: JEEPERSMEDIA, CC BY",
         items=[dict(text="1993", at="nineteen ninety three"), dict(text="A DENNY'S IN SILICON VALLEY", at="Denny's"), dict(text="3 FOUNDERS", at="two friends")],
         stamps=[dict(text="SOURCE: NVIDIA BLOG, 2023", at="Silicon Valley")])),
  T(2, "n22", "Jensen has been the head chef since day one. Thirty three years.", None,
    dict(type="cards", heading=TENK + " · EXECUTIVE OFFICERS",
         cards=[dict(top="CO-FOUNDED", big="1993", at="head chef"), dict(top="CEO SINCE", big="DAY ONE", at="since day one"), dict(top="YEARS", big="33", at="Thirty three", fill="mustard")])),
  T(2, "n23", "For years, the kitchen made one dish: graphics chips for video games. Its first chip came out in nineteen ninety five.", None,
    dict(type="timeline", events="NVT", show=0, add=["nineteen ninety five"], stamps=[dict(text="SOURCE: " + TENK, at="graphics chips")])),
  T(2, "n24", "Then Jensen made a strange bet. He said the same chips could also do maths, huge amounts of maths, all at the same time. In two thousand six, NVIDIA introduced software called CUDA, so programmers could use the chips that way.",
    "Then Jensen made a strange bet. He said the same chips could also do maths, huge amounts of maths, all at the same time. In 2006, NVIDIA introduced software called CUDA, so programmers could use the chips that way.",
    dict(type="pic", pic="gtc", heading="GTC 2010 · PHOTO: CHANG_SEN, CC BY",
         items=[dict(text="THE BET", at="strange bet"), dict(text="CHIPS THAT DO MATHS", at="could also do maths"), dict(text="2006: CUDA", at="two thousand six")])),
  T(2, "n25", "In twenty twelve, researchers trained a famous AI program called AlexNet on two NVIDIA gaming cards. It turned out AI needs exactly that kind of maths.",
    "In 2012, researchers trained a famous AI program called AlexNet on two NVIDIA gaming cards. It turned out AI needs exactly that kind of maths.",
    dict(type="timeline", events="NVT", show=3, add=["twenty twelve", "exactly that kind"], stamps=[dict(text="SOURCE: NEURIPS 2012 PAPER", at="AlexNet")])),
  T(2, "n26", "So when people say Jensen is NVIDIA, this is what they mean. He didn't just run the kitchen. He picked the menu, twice.", None,
    dict(type="kinetic", lines=[dict(t="HE DIDN'T JUST RUN THE KITCHEN.", at="didn't just run"), dict(t="HE PICKED THE MENU. TWICE.", at="picked the menu", em=["MENU", "TWICE"])])),
  # ---- 3 · the moat test (checks 1-3)
  title(3, "n30", ["THE MOAT", "TEST"], "Chapter three. The moat test."),
  T(3, "n31", "If the famous chef leaves, does the restaurant survive? We'll check three things. Is the recipe written down? Are the diners stuck? And is there a second chef?", None,
    dict(type="castle", heading="ILLUSTRATIVE · OUR VIEW: A RESTAURANT WITHOUT ITS CHEF", flag="THE RESTAURANT", flagAt="does the restaurant survive", moatAt="Are the diners stuck", checks=[])),
  T(3, "n40", "Check one. Is the recipe written down? Last year, NVIDIA sold about two hundred and sixteen billion dollars of chips and systems, up sixty five percent. It kept about one hundred and twenty billion as profit.",
    "Check one. Is the recipe written down? Last year, NVIDIA sold about $216 billion of chips and systems, up 65%. It kept about $120 billion as profit.",
    dict(type="cards", heading=TENK + " · YEAR TO JAN 2026",
         cards=[dict(top="REVENUE", big="$215.9B", sub="UP 65%", at="two hundred and sixteen"), dict(top="NET INCOME", big="$120.1B", at="one hundred and twenty billion", fill="mustard")])),
  T(3, "n41", "And the recipe isn't only in Jensen's head. NVIDIA has about forty two thousand people. Thirty one thousand of them work on research and development. Last year, fewer than four in every hundred left.",
    "And the recipe isn't only in Jensen's head. NVIDIA has about 42,000 people. 31,000 of them work on research and development. Last year, fewer than four in every hundred left.",
    dict(type="cards", heading=TENK + " · HUMAN CAPITAL",
         cards=[dict(top="STAFF", big="42,000", at="forty two thousand"), dict(top="IN R&D", big="31,000", at="Thirty one thousand"), dict(top="LEFT IN FY2026", big="3.7%", at="fewer than four", fill="mustard")])),
  T(3, "n42", "NVIDIA has also announced its next chips years in advance. A chef can leave on a Monday. A chip roadmap doesn't change on a Monday.", None,
    dict(type="kinetic", kicker="SOURCE: NVIDIA GTC KEYNOTES",
         lines=[dict(t="A CHEF CAN LEAVE ON A MONDAY.", at="A chef can leave"), dict(t="A ROADMAP DOESN'T.", at="A chip roadmap", em=["ROADMAP"])])),
  T(3, "n43", "Check one: mostly yes.", None,
    dict(type="castle", heading="ILLUSTRATIVE · OUR VIEW · CHECK 1 OF 3", flag="THE RESTAURANT", flagAt=0, moatAt=0,
         checks=[dict(text="RECIPE WRITTEN DOWN: MOSTLY YES", ok=True, at="mostly yes")])),
  T(3, "n50", "Check two. Are the diners stuck? About six million programmers have learned CUDA, and their code is written for NVIDIA chips.", None,
    dict(type="counter", heading="NVIDIA DEVELOPER FORUM · 20 YEARS OF CUDA", to=6, prefix="≈ ", suffix=" MILLION", sub="PROGRAMMERS WHO HAVE LEARNED CUDA", at="six million")),
  T(3, "n51", "NVIDIA's annual report says CUDA runs on all NVIDIA chips. Moving all that code to another company's chips is like moving your whole house to a new city. It's possible, but slow and expensive.", None,
    dict(type="clip", clip="nv_cuda", heading=TENK + " · ITEM 1", hl=["CUDA runs on all NVIDIA chips"], stamps=[dict(text="ILLUSTRATIVE: MOVING HOUSE", at="moving your whole house")])),
  T(3, "n52", "And customers don't buy because they like Jensen. They buy because their software already runs on these chips.", None,
    dict(type="kinetic", lines=[dict(t="THEY BUY THE CHIPS,", at="customers don't buy"), dict(t="NOT THE CHEF.", at="They buy because", em=["CHEF"])])),
  T(3, "n53", "But here's the warning sign. Just two customers made up more than a third of NVIDIA's sales last year: one at twenty two percent, another at fourteen. NVIDIA doesn't name them.",
    "But here's the warning sign. Just two customers made up more than a third of NVIDIA's sales last year: one at 22%, another at 14%. NVIDIA doesn't name them.",
    dict(type="bars", heading=TENK + " · DIRECT CUSTOMERS, % OF REVENUE",
         rows=[dict(name="CUSTOMER A", v=22, label="22%", at="twenty two percent"), dict(name="CUSTOMER B", v=14, label="14%", at="fourteen")],
         stamps=[dict(text="22% + 14% = 36%: OUR SUM", at="more than a third")])),
  T(3, "n54", "Check two: yes, with a warning.", None,
    dict(type="castle", heading="ILLUSTRATIVE · OUR VIEW · CHECK 2 OF 3", flag="THE RESTAURANT", flagAt=0, moatAt=0,
         checks=[dict(text="RECIPE WRITTEN DOWN: MOSTLY YES", ok=True, at=0), dict(text="DINERS STUCK: YES · WARNING: 2 BUYERS", ok=True, at="yes, with a warning")])),
  T(3, "n60", "Check three. Is there a second chef? NVIDIA's annual report names five executive officers. Jensen is one of them, and he has run the company since the start.", None,
    dict(type="table", heading="AS LISTED IN THE 10-K · FEB 2026", cols=["OFFICER", "ROLE"], rows=_officer_rows("Jensen is one", "five executive officers"))),
  T(3, "n61", "And the same report carries a warning. It says NVIDIA is highly dependent on its longstanding executive team, and that failing to plan succession could hurt its long-term success.", None,
    dict(type="clip", clip="nv_succession", heading=TENK + " · ITEM 1A · PAGE 23", hl=["highly dependent"])),
  T(3, "n62", "What it doesn't do is name a successor. There's no public number two. Jensen has said his direct staff is sixty people. That's how he runs things. It also means no obvious next in line.",
    "What it doesn't do is name a successor. There's no public number two. Jensen has said his direct staff is 60 people. That's how he runs things. It also means no obvious next in line.",
    dict(type="pic", pic="ceo", heading="PHOTO: PESTOVERDE, CC BY 2.0",
         items=[dict(text="NO NAMED SUCCESSOR", at="name a successor"), dict(text="\"MY DIRECT STAFF IS 60 PEOPLE\"", at="his direct staff"), dict(text="OUR READING: NO OBVIOUS NEXT", at="no obvious next")],
         stamps=[dict(text="LEX FRIDMAN #494 · 5:36", at="his direct staff")])),
  T(3, "n63", "Check three: not clear.", None,
    dict(type="castle", heading="ILLUSTRATIVE · OUR VIEW · CHECK 3 OF 3", flag="THE RESTAURANT", flagAt=0, moatAt=0,
         checks=[dict(text="RECIPE WRITTEN DOWN: MOSTLY YES", ok=True, at=0), dict(text="DINERS STUCK: YES · WARNING", ok=True, at=0), dict(text="SECOND CHEF: NOT CLEAR", ok=False, at="not clear")])),
  # ---- 4 · has this happened before?
  title(4, "n70", ["HAS THIS HAPPENED", "BEFORE?"], "Chapter four. Has this happened before?"),
  T(4, "n71", "Famous founders have stepped back before. In August twenty eleven, Steve Jobs handed Apple to Tim Cook. Apple's sales that year: about one hundred and eight billion dollars. Four years on: two hundred and thirty four billion. In January two thousand, Bill Gates handed Microsoft to Steve Ballmer. Microsoft's revenue then: about twenty three billion. Thirteen years on: seventy eight billion.",
    "Famous founders have stepped back before. In August 2011, Steve Jobs handed Apple to Tim Cook. Apple's sales that year: about $108 billion. Four years on: $234 billion. In January 2000, Bill Gates handed Microsoft to Steve Ballmer. Microsoft's revenue then: about $23 billion. Thirteen years on: $78 billion.",
    dict(type="bars", heading="SALES, NOT SHARE PRICE · APPLE AND MICROSOFT FILINGS",
         rows=[dict(name="APPLE FY2011", v=108.2, label="$108.2B", at="Apple's sales that year"), dict(name="APPLE FY2015", v=233.7, label="$233.7B", at="Four years on"),
               dict(name="MICROSOFT FY2000", v=23.0, label="$23.0B", at="Microsoft's revenue then"), dict(name="MICROSOFT FY2013", v=77.8, label="$77.8B", at="Thirteen years on")])),
  T(4, "n72", "Both companies survived, and both kept growing. So survival is the easy part. The hard part is the next big bet.", None,
    dict(type="kinetic", lines=[dict(t="BOTH SURVIVED.", at="Both companies survived", em=["SURVIVED"]), dict(t="THE HARD PART IS THE NEXT BIG BET.", at="The hard part", em=["BET"])])),
  # ---- 5 · the answer
  title(5, "n80", ["THE ANSWER"], "Chapter five. The answer, like you're five."),
  T(5, "n81", "So, will NVIDIA survive without Jensen? Yes. The recipe is written down, and the diners are stuck with the menu.", None,
    dict(type="castle", heading="ILLUSTRATIVE · OUR VIEW · THE THREE CHECKS", flag="THE RESTAURANT", flagAt=0, moatAt=0,
         checks=[dict(text="RECIPE WRITTEN DOWN", ok=True, at="The recipe"), dict(text="DINERS STUCK (WARNING: 2 BUYERS)", ok=True, at="and the diners"),
                 dict(text="SECOND CHEF: NOT CLEAR", ok=False, at="are stuck")])),
  T(5, "n81b", "But surviving isn't the same as winning. Jensen's real job was picking the next dish before anyone knew they were hungry for it. That's the hardest thing to replace.", None,
    dict(type="kinetic", lines=[dict(t="SURVIVING IS NOT WINNING.", at="surviving isn't", em=["WINNING"]), dict(t="HE PICKED THE NEXT DISH FIRST.", at="picking the next dish", em=["FIRST"])])),
  T(5, "n82", "Here's what to watch. The board's findings, which have no deadline. NVIDIA's results on the seventeenth of November. A closed-door briefing on the eighteenth that three House committee chairs have asked Jensen to attend. And whether NVIDIA names a successor.",
    "Here's what to watch. The board's findings, which have no deadline. NVIDIA's results on 17 November. A closed-door briefing on the 18th that three House committee chairs have asked Jensen to attend. And whether NVIDIA names a successor.",
    dict(type="hand", title="WATCH:", items=[dict(text="BOARD FINDINGS (NO DEADLINE)", at="board's findings"), dict(text="17 NOV: NVIDIA RESULTS", at="seventeenth of November"),
                                              dict(text="18 NOV: HOUSE BRIEFING (REQUESTED)", at="closed-door briefing"), dict(text="A NAMED SUCCESSOR?", at="names a successor")])),
  T(5, "n83", "And remember: nothing has been proven, no one has been charged, and Jensen is still the boss. We'll update this video when the investigation ends.", None,
    dict(type="pic", pic="portrait", heading="PHOTO: OFFICE OF THE PRESIDENT, TAIWAN · CC BY 2.0",
         items=[dict(text="NOT PROVEN", at="nothing has been proven"), dict(text="NO CHARGES", at="no one has been charged"), dict(text="STILL CEO", at="still the boss")])),
  # ---- 6 · sources
  T(6, "n90", "All our sources are on screen and in the description. This video is for education. It is not investment advice. If it helped, subscribe to Moat Atlas.", None,
    dict(type="sources", items=["NVIDIA Form 10-K, year ended 25 Jan 2026 (filed 25 Feb 2026)", "NVIDIA blog, 26 Sep 2023: the Denny's booth",
                                "NVIDIA Developer Forum: 20 Years of CUDA", "Krizhevsky, Sutskever & Hinton, NeurIPS 2012 (AlexNet)",
                                "Apple 8-K (24 Aug 2011) and 10-Ks; Microsoft 10-K FY2000 and annual reports (sales)", "Lex Fridman Podcast #494, 5:36: Huang on his direct staff",
                                "CNN, CNBC, NPR, Yahoo Finance: 8 and 9 Nov 2026", "Photo credits are in the description",
                                "Education, not investment advice · allegations unproven, no charges"])),
])
NV["timelines"] = {"NVT": NVT}
NV["shorts"] = []
NV["pics"] = {}
VIDEOS.append(NV)

# ====================================================================== Shorts (one video id each, one Short each)
# Spine or chapter cuts under SHORTS_ENGINE.md: question, one "but", a turn, an ending; the pointer to the long film is the last line.
def _short(sid, title_, hook, beats):
    V = dict(calm=True, brand="Moat Atlas", id=sid, title=title_, voice="English_Diligent_Man", chapters=["Short"], beats=beats, timelines={"NVT": NVT}, pics={})
    V["shorts"] = [dict(title=title_, beats=[b["key"] for b in beats], hook=hook)]
    VIDEOS.append(V)
    return V

_short("nvidiasa", "Could NVIDIA survive without Jensen?", "COULD NVIDIA SURVIVE WITHOUT JENSEN?", [
  T(0, "a1", "NVIDIA is worth about four and a half trillion dollars, and this weekend its board opened an investigation into its boss.",
    "NVIDIA is worth about $4.5 trillion, and this weekend its board opened an investigation into its boss.",
    dict(type="pic", pic="ces", heading="PHOTO: PRONOIA, CC0", items=[dict(text="≈ $4.5 TRILLION", at="four and a half trillion"), dict(text="BOARD INVESTIGATION", at="investigation", red=True)])),
  T(0, "a2", "Nobody has charged him. So here's the real question: could NVIDIA survive without Jensen Huang?", None,
    dict(type="kinetic", lines=[dict(t="NO CHARGES.", at="Nobody has charged"), dict(t="COULD NVIDIA SURVIVE WITHOUT JENSEN?", at="could NVIDIA survive", em=["JENSEN"])])),
  T(0, "a3", "Treat it like a restaurant losing its head chef. Is the recipe written down? Yes: thirty one thousand of its staff work on research. Are the diners stuck? Mostly: millions of programmers write code for its chips.",
    "Treat it like a restaurant losing its head chef. Is the recipe written down? Yes: 31,000 of its staff work on research. Are the diners stuck? Mostly: millions of programmers write code for its chips.",
    dict(type="cards", heading="ILLUSTRATIVE · OUR VIEW · TWO OF THREE CHECKS",
         cards=[dict(top="RECIPE WRITTEN DOWN?", big="YES", sub="31,000 IN R&D", at="Is the recipe written down"), dict(top="DINERS STUCK?", big="MOSTLY", sub="MILLIONS TIED TO CUDA", at="Are the diners stuck", fill="mustard")])),
  T(0, "a4", "But is there a second chef? NVIDIA's own annual report says it is highly dependent on its longstanding executive team, and it names no successor.", None,
    dict(type="clip", clip="nv_succession", heading=TENK + " · ITEM 1A · P.23", hl=["highly dependent"])),
  T(0, "a5", "So the company would likely survive. The open question: who picks the next dish? The full test is on the channel.", None,
    dict(type="kinetic", lines=[dict(t="WHO PICKS THE NEXT DISH?", at="who picks", em=["DISH"]), dict(t="THE FULL TEST IS ON THE CHANNEL.", at="The full test")])),
])

_short("nvidiasb", "Six million programmers can't easily leave NVIDIA", "6 MILLION CAN'T EASILY LEAVE NVIDIA", [
  T(0, "b1", "Six million programmers can't easily leave NVIDIA.", None,
    dict(type="counter", heading="NVIDIA DEVELOPER FORUM · 20 YEARS OF CUDA", to=6, prefix="≈ ", suffix=" MILLION", sub="PROGRAMMERS TIED TO CUDA", at="Six million")),
  T(0, "b2", "In two thousand six, NVIDIA released CUDA, software that lets programmers use its chips for heavy maths.",
    "In 2006, NVIDIA released CUDA, software that lets programmers use its chips for heavy maths.",
    dict(type="strips", heading=TENK + " · ITEM 1", items=[dict(text="2006", at="two thousand six"), dict(text="CUDA", at="CUDA", red=True), dict(text="HEAVY MATHS", at="heavy maths")])),
  T(0, "b3", "Their code is written for NVIDIA chips. Moving it to another company's chips is like moving your whole house to a new city: possible, but slow and expensive.", None,
    dict(type="clip", clip="nv_cuda", heading=TENK + " · ITEM 1", hl=["Moving it"], stamps=[dict(text="ILLUSTRATIVE: MOVING HOUSE", at="moving your whole house")])),
  T(0, "b4", "Now the twist. Two buyers, never named, made up more than a third of NVIDIA's sales last year: twenty two percent and fourteen.",
    "Now the twist. Two buyers, never named, made up more than a third of NVIDIA's sales last year: 22% and 14%.",
    dict(type="bars", heading=TENK + " · % OF REVENUE", rows=[dict(name="BUYER A", v=22, label="22%", at="never named"), dict(name="BUYER B", v=14, label="14%", at="more than a third")],
         stamps=[dict(text="22% + 14% = 36%: OUR SUM", at="more than a third")])),
  T(0, "b5", "Six million can't easily leave. Two buyers carry a third of the sales. Would that hold without Jensen? Our full test is on the channel.", None,
    dict(type="kinetic", lines=[dict(t="SIX MILLION STUCK.", at="Six million can't", em=["STUCK"]), dict(t="TWO BUYERS.", at="Two buyers carry", em=["TWO"]), dict(t="FULL TEST ON THE CHANNEL.", at="Our full test")])),
])

_short("nvidiasc", "NVIDIA's annual report already warned about this", "NVIDIA'S OWN REPORT WARNED ABOUT THIS", [
  T(0, "c1", "NVIDIA's annual report warned about this months before the news broke.", None,
    dict(type="clip", clip="nv_succession", heading=TENK + " · FILED 25 FEB 2026", hl=["annual report"])),
  T(0, "c2", "The report lists NVIDIA's executive officers. Jensen Huang is CEO, and he has been since he co-founded the company.", None,
    dict(type="table", heading="AS LISTED IN THE 10-K · FEB 2026", cols=["OFFICER", "ROLE"], rows=_officer_rows("Jensen Huang is CEO", "executive officers"))),
  T(0, "c3", "Then, on page twenty three, it says the company is highly dependent on its longstanding executive team, and that poor succession planning could hurt its long-term success.",
    "Then, on page 23, it says the company is highly dependent on its longstanding executive team, and that poor succession planning could hurt its long-term success.",
    dict(type="clip", clip="nv_succession", heading=TENK + " · ITEM 1A · PAGE 23", hl=["highly dependent"])),
  T(0, "c4", "But the report names no successor. Jensen has said his direct staff is sixty people, and that's how he runs things. So there's no public number two.",
    "But the report names no successor. Jensen has said his direct staff is 60 people, and that's how he runs things. So there's no public number two.",
    dict(type="pic", pic="ceo", heading="PHOTO: PESTOVERDE, CC BY 2.0", items=[dict(text="NO NAMED SUCCESSOR", at="names no successor"), dict(text="\"MY DIRECT STAFF IS 60 PEOPLE\"", at="his direct staff")],
         stamps=[dict(text="LEX FRIDMAN #494 · 5:36", at="his direct staff")])),
  T(0, "c5", "The warning came months before the news. Now the question is who is next. The full test is on the channel.", None,
    dict(type="kinetic", lines=[dict(t="THE WARNING CAME FIRST.", at="The warning came", em=["FIRST"]), dict(t="WHO IS NEXT?", at="who is next", em=["NEXT"]), dict(t="FULL TEST ON THE CHANNEL.", at="The full test")])),
])

_short("nvidiasd", "A Denny's, then a strange bet", "PLANNED AT A DENNY'S. THEN A STRANGE BET.", [
  T(0, "d1", "NVIDIA was planned at a Denny's. Then its boss made a strange bet.", None,
    dict(type="pic", pic="dennys", heading="PHOTO: JEEPERSMEDIA · CC BY", items=[dict(text="PLANNED AT A DENNY'S", at="planned at a Denny's"), dict(text="THEN A STRANGE BET", at="strange bet", red=True)],
         stamps=[dict(text="SOURCE: NVIDIA BLOG, 2023", at="NVIDIA was planned")])),
  T(0, "d2", "In nineteen ninety three, Jensen Huang and two friends sketched a chip company over endless coffee. For years it made graphics chips for video games.",
    "In 1993, Jensen Huang and two friends sketched a chip company over endless coffee. For years it made graphics chips for video games.",
    dict(type="timeline", events="NVT", show=0, add=["graphics chips"])),
  T(0, "d3", "But Jensen bet the same chips could do huge amounts of maths at once. In two thousand six, NVIDIA released CUDA so programmers could use them that way.",
    "But Jensen bet the same chips could do huge amounts of maths at once. In 2006, NVIDIA released CUDA so programmers could use them that way.",
    dict(type="pic", pic="gtc", heading="PHOTO: CHANG_SEN · CC BY", items=[dict(text="THE BET: MATHS ON CHIPS", at="bet the same chips"), dict(text="2006: CUDA", at="two thousand six", red=True)])),
  T(0, "d4", "Later, researchers trained a famous AI program, AlexNet, on two NVIDIA gaming cards. It turned out AI needed exactly that maths.", None,
    dict(type="timeline", events="NVT", show=3, add=["AlexNet", "exactly that maths"], stamps=[dict(text="SOURCE: NEURIPS 2012 PAPER", at="AlexNet")])),
  T(0, "d5", "He didn't just run the kitchen. He picked the menu, twice. So what happens when the chef who picks the menu leaves? Full story on the channel.", None,
    dict(type="kinetic", lines=[dict(t="HE PICKED THE MENU. TWICE.", at="picked the menu", em=["MENU", "TWICE"]), dict(t="WHAT IF HE LEAVES?", at="what happens", em=["LEAVES"]), dict(t="FULL STORY ON THE CHANNEL.", at="Full story")])),
])

# ---- clips for build_vx.crop: (pdf, phrase, lines above, lines below). The PDF is NVIDIA's own 2026 Annual Report (contains the 10-K); SSD/Mini only, never in git.
import pathlib as _pl
_NV_PDF = _pl.Path("/Users/akkarthikeyan/jev_full/research/nvidia/2026-Annual-Report-Web.pdf")
CLIPS_NV = {
  "nv_succession": (_NV_PDF, "highly dependent on the services of our longstanding executive team", 1, 2),
  "nv_cuda": (_NV_PDF, "CUDA development platform that runs on all NVIDIA GPUs", 1, 1),
}

# long film only (landscape): stamps on photo beats sit top-right so they never cover the strips or the captions
for _b in NV["beats"]:
    if _b["scene"].get("type") == "pic":
        for _st in _b["scene"].get("stamps", []):
            _sw = len(_st["text"]) * 62 * 0.55 + 70
            _st.setdefault("x", int(1920 - 60 - _sw / 2)); _st.setdefault("y", 250)
