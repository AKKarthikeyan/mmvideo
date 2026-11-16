"""Fix This Answer, episode 2 (playbook docs/UPSC_MAINS_PLAYBOOK.md §3a; doc docs/upsc/fix-this-answer/FTA-02.md). Draft 1, 16 Nov 2026.
A GS-II question, so the pilot covers General Studies as well as an optional (FTA-01). Single source of this episode's page, repair
and narration. Build: python3 scripts/upsc/fta_storyboard.py fta-02.

The one mistake is a writing gap (rule A2): the directive word is "Comment", and the answer repeats the statement back instead of
giving a view backed by cases. The answer on the page is ILLUSTRATIVE: written by us, not any candidate's copy. Every number the
repair writes is locked to the ledgers (POL-03 and pyq/2022-gs2-2).
"""

QUESTION = "pyq/2022-gs2-2"            # GS-II 2022 Q2, 10 marks, 150 words
TRANSFER = "pyq/2017-gs2-12"           # GS-II 2017 Q12, 15 marks: "Examine", the same skill
LEDGERS = ["POL-03", "pyq/2022-gs2-2"]

STAMP = "ILLUSTRATIVE · WRITTEN BY US, NOT A CANDIDATE'S COPY"
DEMANDS = [dict(id="D1", label="Free, and only for citizens"), dict(id="D2", label="The limits the Constitution sets"),
           dict(id="D3", label="Comment: cases and a verdict")]

ITEMS = [
    dict(id="o1", kind="orig", text="Article 19(1)(d) and (e) give the right to move freely and to reside and settle anywhere in India."),
    dict(id="n0", kind="new", text="Article 19(1)(d) and (e) give _citizens_, not foreigners, free movement and residence in India.",
         claims=["2022-GS2-2-01", "POL03-A11"]),
    dict(id="o2", kind="orig", text="These are very important rights in a democracy and they help national unity."),
    dict(id="o3", kind="orig", text="But these rights are not absolute. Article 19(5) allows reasonable restrictions in the interest of the general public and to protect Scheduled Tribes."),
    dict(id="o4", kind="orig", text="Thus the rights of movement and residence are not absolute and have restrictions."),
    dict(id="h1", kind="head", text="What the courts held"),
    dict(id="n1", kind="new", text="• _Gurbachan Singh_ (1952): externment upheld as a reasonable restriction.", claims=["2022-GS2-2-05"]),
    dict(id="n2", kind="new", text="• _Ebrahim Vazir Mavat_ (1954): removing a citizen from India violated Article 19(1)(e).", claims=["2022-GS2-2-07"]),
    dict(id="n3", kind="new", text="• _Anuradha Bhasin_ (2020): section 144 orders must be necessary and reasoned.", claims=["2022-GS2-2-11"]),
    dict(id="n4", kind="new", text="• _Maneka Gandhi_ (1978): these freedoms 'are not and cannot be absolute'.", claims=["2022-GS2-2-10"]),
    dict(id="c1", kind="new", text="So the rights are _fundamental yet conditional_: a restriction must be by law, reasonable, and on a named ground.",
         claims=["2022-GS2-2-02", "2022-GS2-2-05"]),
]

NOTES = dict(
    diag=dict(kind="diag", title="A2 · TAKE A VIEW", tag="WRITING GAP",
              text="'Comment' asks for your judgement, backed by cases. This answer repeats the statement back and names no case.", claims=[]),
    gap=dict(kind="gap", title="D1 · ONE WORD MISSING", tag="QUICK FIX",
             text="Article 19 says 'All citizens'. Foreigners cannot claim these two freedoms. Say who holds the right.",
             claims=["POL03-A11"]),
    rubric=dict(kind="rubric", title="OUR RUBRIC, NOT A UPSC MARK", tag="",
                text="UPSC publishes no marking scheme. The ticks are our answer standard (A1–A12), not a score.", claims=[]),
)


def B(key, say, scenes):
    return dict(key=key, say=" ".join(say.split()), scenes=scenes)


BEATS = [
    B("b00", """UPSC, twenty twenty-two. General Studies Paper Two, ten marks, one hundred and fifty words. You know Article nineteen.
               So why does this answer still lose marks? Let's fix it, line by line.""",
      [("pyq_question", None, dict(glow=[]), [])]),
    B("b01", """Read the last word first. Comment means give your view, and back it. So there are three jobs: the right is free, for
               citizens. It has limits. And then your verdict, with cases.""",
      [("pyq_xray", None, dict(directives=[("Comment", "give a view, and back it", "x1", "Comment")],
                               demand_words={"D1": "citizens.", "D2": "limits.", "D3": "verdict,"}), [])]),
    B("b02", """Here is an answer. We wrote it, the way many aspirants write it. It is not a real candidate's copy.""",
      [("fta_page", None, dict(ops=[dict(op="write", ids=["o1", "o2", "o3", "o4"], key="wr"), dict(op="stamp", key="il")]),
        [("wr", "answer."), ("il", "wrote")])]),
    B("b03", """The middle is right. Article nineteen, five, and its two grounds: the general public, and Scheduled Tribes. Keep it.
               Now look at the end. Thus the rights are not absolute. That is the question, read back to the examiner. Comment wants
               your judgement, and this answer never gives one. It names no case at all. This is not a knowledge problem. It is a reading
               problem.""",
      [("fta_page", None, dict(ops=[dict(op="status", id="D2", to="ok", key="ok2"), dict(op="ring", ids=["o4"], key="rg"),
                                    dict(op="note", note="diag", key="dx"), dict(op="status", id="D3", to="miss", key="dx")]),
        [("ok2", "Keep"), ("rg", "Thus"), ("dx", "judgement,")])]),
    B("b04", """One smaller slip, at the top. Article nineteen begins: all citizens. A foreigner cannot claim these two freedoms. So say who
               holds the right.""",
      [("fta_page", None, dict(ops=[dict(op="gap", ids=["o1"], key="g1"), dict(op="note", note="gap", key="gn"),
                                    dict(op="status", id="D1", to="part", word="partial · one word missing", key="g1")]),
        [("g1", "citizens."), ("gn", "foreigner")])]),
    B("b05", """Now the repair. First line: strike it, and write citizens, not foreigners.""",
      [("fta_page", None, dict(ops=[dict(op="strike", ids=["o1"], key="s1"), dict(op="remove", ids=["o1"], key="r1"),
                                    dict(op="insert", ids=["n0"], key="i0"), dict(op="status", id="D1", to="ok", key="ok1")]),
        [("s1", "strike"), ("r1", "write"), ("i0", "citizens,"), ("ok1", "foreigners.")])]),
    B("b06", """Then delete the line about democracy and national unity. It is true, and it earns nothing.""",
      [("fta_page", None, dict(ops=[dict(op="strike", ids=["o2"], key="s2"), dict(op="remove", ids=["o2"], key="r2")]),
        [("s2", "delete"), ("r2", "earns")])]),
    B("b07", """Now the end. Strike the line that repeats the question. In its place, the cases, each with a year and a holding.
               Gurbachan Singh, nineteen fifty-two: externment upheld as reasonable. Ebrahim Vazir Mavat, nineteen fifty-four: removing
               a citizen from India was a violation. Anuradha Bhasin, twenty twenty: orders under section one forty-four must be necessary
               and reasoned. And Maneka Gandhi: these freedoms are not, and cannot be, absolute.""",
      [("fta_page", None, dict(ops=[dict(op="strike", ids=["o4"], key="s4"), dict(op="remove", ids=["o4"], key="r4"),
                                    dict(op="insert", ids=["h1"], key="i1"), dict(op="insert", ids=["n1"], key="i2"),
                                    dict(op="insert", ids=["n2"], key="i3"), dict(op="insert", ids=["n3"], key="i4"),
                                    dict(op="insert", ids=["n4"], key="i5")]),
        [("s4", "Strike"), ("r4", "place,"), ("i1", "cases,"), ("i2", "Gurbachan"), ("i3", "Ebrahim"), ("i4", "Anuradha"), ("i5", "Maneka")])]),
    B("b08", """Then the verdict, in one line. The rights are fundamental, yet conditional: a restriction must be by law, reasonable, and on a
               named ground. That is the view the word comment asks for.""",
      [("fta_page", None, dict(ops=[dict(op="insert", ids=["c1"], key="i6"), dict(op="status", id="D3", to="ok", key="ok3")]),
        [("i6", "verdict,"), ("ok3", "view")])]),
    B("b09", """Count the words: about a hundred and ten. The limit is one hundred and fifty, and seven minutes is our share of the
               time. There is room for one more limit, the Emergency, from the full answer. And there is no mark here. These ticks are
               our rubric, not a UPSC score.""",
      [("fta_page", None, dict(ops=[dict(op="count", key="ct"), dict(op="note", note="rubric", key="rb")]),
        [("ct", "Count"), ("rb", "mark")])]),
    B("b10", """Now you. Twenty seventeen: examine the scope of Fundamental Rights, in the light of the privacy judgement. A different
               question, the same skill: end on the verdict the directive word asks for, and back it with a named case. Two hundred and
               fifty words, eleven minutes. Write it before the next episode. Post it in our group: we'll repair a few on screen, and
               only then show ours.""",
      [("fta_transfer", None, dict(skill="End on the verdict the directive word asks for, and back it with a named case.",
                                   limits="200–250 words in 11 minutes (the printed limit is 250; 11 minutes is our share of the time)",
                                   checks=["Every demand has a heading", "Every claim names its case", "The last line answers 'Examine'"],
                                   cta="Write it first. We repair a few of yours, then show ours."),
        [("q", "seventeen:"), ("sk", "verdict"), ("lm", "hundred"), ("c1", "Write"), ("cta", "Post")])]),
]

SAID_COUNT = (100, 120)
