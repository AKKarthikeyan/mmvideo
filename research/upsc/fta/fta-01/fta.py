"""Fix This Answer, episode 1 (docs/upsc/fix-this-answer/FTA-01.md; playbook docs/UPSC_MAINS_PLAYBOOK.md §3a). Draft 1, 15 Nov 2026.
Single source of this episode's page, repair and narration. Build: python3 scripts/upsc/fta_storyboard.py fta-01
(it checks the numbers against the ledgers, then writes public/datayt/long/upsc/fta-01/storyboard.json and timeline.json).

The answer on the page is ILLUSTRATIVE: written by us, the way many aspirants write it. It is not any candidate's copy, and the
page says so for as long as it is on screen. Its own numbers are deliberately weak (that is the point) and are not number-locked;
every number the repair writes is. The question and the transfer question are read from their answer modules, so they stay
word for word as checked against the question papers.
"""

QUESTION = "pyq/2024-eco1-4a"          # the question repaired: its text, budget and minutes come from that answer module
TRANSFER = "pyq/2022-eco1-3b"          # the fresh question that needs the same repair
LEDGERS = ["ECO-16", "pyq/2024-eco1-4a"]

STAMP = "ILLUSTRATIVE · WRITTEN BY US, NOT A CANDIDATE'S COPY"
DEMANDS = [dict(id="D1", label="How credit is created"), dict(id="D2", label="What it does to the multiplier"),
           dict(id="D3", label="Limits that can break it")]

# The page, top to bottom. kind: orig (the illustrative answer, pencil), head / new (the repair, ink). claims: what locks its numbers.
ITEMS = [
    dict(id="o1", kind="orig", text="Banking is very important for the economy of any country."),
    dict(id="o2", kind="orig", text="Commercial banks create credit by lending out the deposits they receive from the public. This process is called credit creation."),
    dict(id="o3", kind="orig", text="Multiplier = 1/CRR. RBI's CRR is 3%, so the multiplier is about 33. So ₹100 of deposits becomes about ₹3,300 in the economy."),
    dict(id="o4", kind="orig", text="Limitations: banks must keep CRR and SLR, so they cannot lend all their deposits. RBI also changes the repo rate."),
    dict(id="h1", kind="head", text="Limits: what can break the multiplier"),
    dict(id="n1", kind="new", text="• Cash drain: people keep cash, so a higher _cash-deposit ratio_ cuts m. India: m 5.57 → 5.20 as cdr rose 0.16 → 0.18 (RBI Bulletin, 2022).",
         claims=["2024-ECO1-4A-06", "2024-ECO1-4A-07"]),
    dict(id="n2", kind="new", text="• Spare reserves: banks may not lend. US, 1930–1933: money fell about 35% while the base rose about 20% (IGNOU).",
         claims=["ECO16-T09"]),
    dict(id="n3", kind="new", text="• Loan demand: the rounds go on only if people borrow (IGNOU).", claims=["2024-ECO1-4A-03"]),
    dict(id="o5", kind="orig", text="Conclusion: banks play a very important role in the economy."),
    dict(id="c1", kind="new", text="So the multiplier is a _ceiling, not a constant_: cash, spare reserves and weak loan demand keep real money below it.",
         claims=["ECO16-T05", "ECO16-A06"]),
]

# Notes in the right-hand column. kind: diag (red, the one mistake), gap (amber, a content gap), rubric (plain).
NOTES = dict(
    diag=dict(kind="diag", title="A1 · ANSWER WHAT IS ASKED", tag="WRITING GAP",
              text="CRR is already inside the multiplier (m = 1/rr). D3 asks what stops real money reaching it, and how.", claims=["ECO16-T07"]),
    gap=dict(kind="gap", title="D1, D2 · THE CONCEPT IS WRONG", tag="CONTENT GAP",
             text="A loan opens a new deposit (NCERT 3.3). 1/CRR ignores the cash people hold (IGNOU). Learn these first.",
             claims=["ECO16-N11", "ECO16-T07"]),
    rubric=dict(kind="rubric", title="OUR RUBRIC, NOT A UPSC MARK", tag="",
                text="UPSC publishes no marking scheme. The ticks are our answer standard (A1–A12). Next: D1 and D2, after the film.", claims=[]),
)


def B(key, say, scenes):
    return dict(key=key, say=" ".join(say.split()), scenes=scenes)


# Each beat is one voice line; each scene is (kind, the sentences of the line it covers or None for all, spec additions, reveals).
# fta_page ops: write (the illustrative answer appears), ring, gap, strike, remove, insert, status, note. Every op has a key,
# and every key is a word of the scene's narration (the builder checks).
BEATS = [
    B("b00", """UPSC, twenty twenty-four. Economics optional, twenty marks. You know this topic: the CRR, the SLR, the multiplier.
               So why does this answer still miss the question? Let's fix it, line by line.""",
      [("pyq_question", None, dict(glow=[]), [])]),
    B("b01", """Read it slowly. Describe means set out how it works. Analyse means split it into parts, and show the links.
               So there are three jobs: the mechanism, what it does to the multiplier, and the limits that can break it.""",
      [("pyq_xray", None, dict(directives=[("Describe", "set out how it works", "x1", "Describe"), ("Analyse", "the parts and their links", "x2", "Analyse")],
                               demand_words={"D1": "mechanism,", "D2": "multiplier,", "D3": "limits"}), [])]),
    B("b02", """Here is an answer. We wrote it, the way many aspirants write it. It is not a real candidate's copy.""",
      [("fta_page", None, dict(ops=[dict(op="write", ids=["o1", "o2", "o3", "o4", "o5"], key="wr"), dict(op="stamp", key="il")]),
        [("wr", "answer."), ("il", "wrote")])]),
    B("b03", """Start with the limits, because that is where this answer loses the question. It says banks must keep the CRR and the SLR,
               and that RBI changes the repo rate. But the CRR is already inside the multiplier: one over the reserve ratio. It sets how big the
               multiplier is. The question asks something else: what stops real money from reaching that size? This is not a knowledge
               problem. It is a reading problem.""",
      [("fta_page", None, dict(ops=[dict(op="ring", ids=["o4"], key="rg"), dict(op="note", note="diag", key="dx"),
                                    dict(op="status", id="D3", to="miss", key="dx")]),
        [("rg", "says"), ("dx", "inside")])]),
    B("b04", """There are two more problems, and they are different. Banks do not just lend out deposits: when a bank lends, it opens a new
               deposit. And one over the CRR ignores the cash that people keep. These are concept gaps. A better structure will not fix them.""",
      [("fta_page", None, dict(ops=[dict(op="gap", ids=["o2"], key="g1"), dict(op="gap", ids=["o3"], key="g2"), dict(op="note", note="gap", key="gn"),
                                    dict(op="status", id="D1", to="part", key="g1"), dict(op="status", id="D2", to="part", key="g2")]),
        [("g1", "lend"), ("g2", "ignores"), ("gn", "concept")])]),
    B("b05", """Learn those first. A loan opens a new deposit. Cash that people hold shrinks the multiplier. Our film on how banks create
               money shows both, and we will come back to them.""",
      [("pyq_card", None, dict(title="Content gaps: learn them first", lines=[
            dict(text="A loan opens a new deposit · NCERT Class XII, 3.3", key="l1", claims=["ECO16-N11"]),
            dict(text="Cash held shrinks the multiplier · IGNOU Unit 13", key="l2", claims=["ECO16-T07"]),
            dict(text="Our film: how banks create money", key="l3", claims=[])]),
        [("l1", "loan"), ("l2", "Cash"), ("l3", "film")])]),
    B("b06", """Now the repair. First, delete. Banking is very important for any economy: that line earns nothing. It goes.""",
      [("fta_page", None, dict(ops=[dict(op="strike", ids=["o1"], key="s1"), dict(op="remove", ids=["o1"], key="rm")]),
        [("s1", "delete."), ("rm", "goes.")])]),
    B("b07", """Then the limits. Strike them out. A limit must say what breaks, and how. Cash drain: people keep cash, so the cash ratio
               rises and the multiplier falls. India's fell from five point five seven to five point two zero, as the cash ratio rose.""",
      [("fta_page", None, dict(ops=[dict(op="strike", ids=["o4"], key="s2"), dict(op="remove", ids=["o4"], key="r2"),
                                    dict(op="insert", ids=["h1"], key="i1"), dict(op="insert", ids=["n1"], key="i2")]),
        [("s2", "Strike"), ("r2", "limit"), ("i1", "breaks,"), ("i2", "Cash")])]),
    B("b08", """Spare reserves: banks may simply not lend. In America, from 1930 to 1933, money fell about thirty-five percent, even as
               the base rose about twenty. And loan demand: the rounds go on only if people borrow.""",
      [("fta_page", None, dict(ops=[dict(op="insert", ids=["n2"], key="i3"), dict(op="insert", ids=["n3"], key="i4")]),
        [("i3", "Spare"), ("i4", "loan")])]),
    B("b09", """Last, the conclusion. Don't repeat the opening. Answer the question: the multiplier is a ceiling, not a constant.""",
      [("fta_page", None, dict(ops=[dict(op="strike", ids=["o5"], key="s3"), dict(op="remove", ids=["o5"], key="r3"),
                                    dict(op="insert", ids=["c1"], key="i5"), dict(op="status", id="D3", to="ok", key="ok")]),
        [("s3", "Don't"), ("r3", "Answer"), ("i5", "question:"), ("ok", "constant.")])]),
    B("b10", """Count the words: about a hundred and twenty. Our budget for twenty marks is three hundred to three hundred and fifty, in
               fourteen minutes. The rest belongs to the mechanism and RBI's own figure, once the concept is in place. And we are not giving
               this a mark. UPSC publishes no marking scheme, so these ticks are our rubric.""",
      [("fta_page", None, dict(ops=[dict(op="count", key="ct"), dict(op="note", note="rubric", key="rb")]),
        [("ct", "Count"), ("rb", "mark.")])]),
    B("b11", """Now you. Here is twenty twenty-two: compare the deposit and money multipliers, and say whether cards change it.
               A different question, the same skill: name the channel before you give a verdict. Two hundred and fifty words, eleven minutes.
               Write it before the next episode. Post it in our group: we'll repair a few on screen, and only then show ours.""",
      [("fta_transfer", None, dict(skill="Name the channel (the cash ratio or the reserve ratio) before you give a verdict.",
                                   limits="220–270 words in 11 minutes (our working budget; no limit is printed)",
                                   checks=["Every demand has a heading", "Every effect names its channel", "The verdict answers 'Justify'"],
                                   cta="Write it first. We repair a few of yours, then show ours."),
        [("q", "twenty-two:"), ("sk", "channel"), ("lm", "hundred"), ("c1", "Write"), ("cta", "Post")])]),
]

# The words left on the page after the repair, said in b10 as "about a hundred and twenty": the builder checks the count is 110-130.
SAID_COUNT = (110, 130)
