"""Format A (One Question): UPSC CSE (Main) 2017, General Studies Paper II, Q12. Draft 1, 10 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the POL-03 ledger (research/upsc/POL-03/claims.csv) and this answer's ledger (research/upsc/pyq/2017-gs2-12/claims.csv).
Left out: Joseph Shine (2018), whose Court copy was not reached (-21 BLOCKED); the separate opinions of Nariman, Bobde, Chelameswar and Sapre JJ.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [])


A = dict(
    id="PYQ-2017-GS2-12",
    fmt="A",
    title="How the Privacy Judgment Widened Fundamental Rights (UPSC GS II 2017)",
    question=dict(year=2017, paper="gs2", label="General Studies Paper II", q=12, part="", marks=15,
                  text="Examine the scope of Fundamental Rights in the light of the latest judgement of the Supreme Court on Right to Privacy.",
                  pdf="research/upsc/_pyq/mains/2017_gs2.pdf", page=3),
    budget=(200, 250),
    minutes=11,
    budget_note="UPSC's printed limit is 250 words; 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["POL-03", "pyq/2017-gs2-12"],
    demands=[
        dict(id="D1", text="The latest judgment: what it decided (Puttaswamy, 24 Aug 2017)"),
        dict(id="D2", text="How it widens the scope of Fundamental Rights (nature and new content)"),
        dict(id="D3", text="Who is bound by the right, and its limits"),
        dict(id="D4", text="Examine: how far the scope now reaches", view=True),
    ],
    sheet=[
        S("intro", """On 24 Aug 2017 nine judges held in _Puttaswamy_ that privacy is protected under Article 21 and Part III,
          overruling M.P. Sharma and Kharak Singh.""",
          ["D1"], ["2017-GS2-12-01", "POL03-D12"]),
        S("head", "1. Scope widened", ["D2"], ["2017-GS2-12-03"]),
        S("points", """• _Recognised, not granted_: life and liberty are 'inalienable' and inhere in each individual.
          • _Overlap_: Gopalan's 'silos' gave way to overlapping rights (Cooper, Maneka); ADM Jabalpur was overruled.
          • _Evolving_: the Constitution 'must evolve with the felt necessities of time'.
          • New content: dignity, family life, procreation, sexual orientation, informational privacy and self-identity (NALSA).
          • Koushal's 'so-called' rights view fell; _Navtej Johar_ (2018) followed.""",
          ["D2"], ["2017-GS2-12-03", "POL03-D09", "POL03-D14", "2017-GS2-12-06", "2017-GS2-12-05", "2017-GS2-12-08", "2017-GS2-12-12", "2017-GS2-12-10", "2017-GS2-12-15"]),
        S("head", "2. Who is bound, and the limits", ["D3"], ["2017-GS2-12-11"]),
        S("points", """• Privacy runs against the State and _non-State actors_ (Kaul J.); the Court commended a data-protection regime,
          now the DPDP Act, 2023.
          • Not absolute: _legality, need, proportionality_, with Article 21 procedure fair, just and reasonable.
          • The Aadhaar judgment (2018) applied a four-part proportionality test.""",
          ["D3"], ["2017-GS2-12-11", "2017-GS2-12-08", "POL03-X06", "2017-GS2-12-07", "2017-GS2-12-13", "2017-GS2-12-18"]),
        S("diagram", """A timeline: Gopalan's silos, then Maneka's overlap, then Puttaswamy, then 2018's cases.""",
          ["D2"], ["POL03-D09", "POL03-D10", "POL03-D12", "2017-GS2-12-15", "2017-GS2-12-18"], label="Fig. 1: From silos to privacy",
          items=[dict(when="1950", what="Gopalan: rights as silos"), dict(when="1978", what="Maneka: rights overlap"),
                 dict(when="2017", what="Puttaswamy: privacy in Art 21"), dict(when="2018", what="Navtej Johar; Aadhaar")]),
        S("head", "3. Weighing it", ["D4"], ["2017-GS2-12-04"]),
        S("points", """• The Court was 'not amending the Constitution' but recognising a right already there.
          • The Court did not list every entitlement, so each new facet is settled case by case.
          • Gain: a base for later dignity cases, such as _Navtej Johar_ and Aadhaar; cost: an open-ended list.""",
          ["D4"], ["2017-GS2-12-04", "2017-GS2-12-06", "2017-GS2-12-15", "2017-GS2-12-16", "2017-GS2-12-18"]),
        S("close", """So Part III is wider and still growing, but never absolute: each new facet must pass legality, need and proportionality.""",
          ["D2", "D3", "D4"], ["2017-GS2-12-07"]),
    ],
    weak=[
        dict(text="The Court created privacy by amending Article 21.", miss="it recognised a right already inside Article 21, not an amendment", claims=["2017-GS2-12-04"]),
        dict(text="Privacy is an absolute right.", miss="it must pass legality, need and proportionality", claims=["2017-GS2-12-07"]),
        dict(text="Only the State must respect privacy.", miss="Kaul J.: privacy is protected against State and non-State actors", claims=["2017-GS2-12-11"]),
        dict(text="Fundamental Rights are separate silos.", miss="Gopalan's silos were replaced by overlapping rights", claims=["2017-GS2-12-09"]),
        dict(text="(no mention of dignity or the 2018 cases)", miss="dignity is 'the constitutional core' and the 2018 cases applied the right", claims=["2017-GS2-12-05", "2017-GS2-12-15"]),
    ],
    cousins=["2024 GS II Q12: privacy under Article 21 and DNA testing of a child to establish paternity",
             "2026 GS II Q1: privacy and self-identity, and the 2026 amendment to the Transgender Persons Act",
             "2017 PSIR Paper I Q5(b): right to privacy is an intrinsic part of the right to life"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty seventeen. General Studies Paper Two, fifteen marks, two hundred and fifty words.
          Examine the scope of Fundamental Rights in the light of the latest privacy judgment.
          Here is the twist. The judgment did not amend anything. It found a right already there.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2017, GS Paper II, Q12'.
          The words 'scope of Fundamental Rights' glow faintly (plant).""",
          ["2017-GS2-12-04"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Examine means weigh, and give a balanced view. There are four jobs.
          Say what the judgment decided. Show how it widens the scope. Say who is bound, and the limits. Then weigh it.""",
          "Question X-ray: 'examine' highlighted; four empty boxes D1 to D4 (plant: they tick at the end).",
          []),
        T("b02", "therefore", "idea",
          """Start with the decision. In August twenty seventeen, nine judges signed one order.
          Privacy is protected under Article twenty-one. Two older cases, Sharma and Kharak Singh, were overruled on that point.""",
          "Nine chairs and a signed order card; two old case cards stamped 'overruled'.",
          ["2017-GS2-12-01", "2017-GS2-12-02", "POL03-D12"]),
        T("b03", "but", "idea",
          """But how can a court add a right? It says it did not add one. Fundamental rights are recognised, not granted.
          Life and liberty are inalienable. The Court only recognised what was there.""",
          "A seed inside a closed box labelled Article 21; the lid lifts. Quote card: 'not creations of the Constitution'.",
          ["2017-GS2-12-03", "2017-GS2-12-04"]),
        T("b04", "therefore", "idea",
          """That changes the shape of Part III. In nineteen fifty, Gopalan treated rights as separate silos.
          Later cases made them overlap. Puttaswamy confirmed it, and overruled ADM Jabalpur.""",
          "A timeline arrow from silos to overlapping circles (Fig. 1).",
          ["POL03-D09", "POL03-D14", "POL03-D10"]),
        T("b05", "therefore", "idea",
          """And the content grows. Privacy covers dignity, family life, procreation and sexual orientation.
          It reaches informational privacy and self-identity. It binds the State and private actors.""",
          "A widening ring of icons around the word privacy: home, family, data, identity.",
          ["2017-GS2-12-05", "2017-GS2-12-08", "2017-GS2-12-11", "2017-GS2-12-12"]),
        T("b06", "but", "idea",
          """But it is not unlimited. A law that invades privacy must have legality, a legitimate aim, and proportionality.
          In twenty eighteen the Aadhaar case applied a four-part version of that test.""",
          "Three gates; a fourth gate slides in for the Aadhaar test (pay-off of the plant).",
          ["2017-GS2-12-07", "2017-GS2-12-18"]),
        T("b07", "therefore", "sheet",
          """Now we write. Two hundred and fifty words, about eleven minutes.
          Open with the date, the nine judges and the two cases overruled. That frames the whole answer.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction writes in; box D1 fills.",
          ["2017-GS2-12-01", "POL03-D12"]),
        T("b08", "therefore", "sheet",
          """Section one is the widening. Five points: recognised, overlap, evolving, new content, and the Koushal turn.
          The timeline draws beside it.""",
          "Section 1 writes in; the timeline Fig. 1 draws; box D2 fills.",
          ["2017-GS2-12-03", "2017-GS2-12-06", "2017-GS2-12-10", "POL03-D09"]),
        T("b09", "therefore", "sheet",
          """Section two is who is bound, and the limits. Then section three weighs it.
          Scope grows by recognition, but case by case, and never without the three tests.""",
          "Sections 2 and 3 write in; the close writes in; boxes D3 and D4 fill.",
          ["2017-GS2-12-11", "2017-GS2-12-07", "2017-GS2-12-04"]),
        T("b10", "but", "compare",
          """Now the easy answer beside it. It says the Court amended Article twenty-one. It did not.
          It says privacy is absolute. It is not. It says only the State is bound. Kaul J. said otherwise.
          And it repeats the silos idea that the Court replaced.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2017-GS2-12-04", "2017-GS2-12-07", "2017-GS2-12-11", "2017-GS2-12-09"]),
        T("b11", "therefore", "cousins",
          """Here is the payoff. One answer serves its cousins. Twenty twenty-four asked about privacy and the DNA test.
          Twenty twenty-six asked about privacy and self-identity. Learn the judgment once.""",
          "The four boxes tick; three cousin question cards slide in.",
          ["POL03-D13"]),
    ],
    story=dict(
        promise="How far did the privacy judgment widen Fundamental Rights, and how do you weigh that in 250 words?",
        arc="claim-verdict",
        loops=[
            dict(id="L1", kind="primary", q="How do you answer this, and prove it, in 250 words?", open="b00", close="b11"),
            dict(id="L2", kind="secondary", q="Did the judgment add a right or recognise one?", open="b00", close="b03"),
            dict(id="L3", kind="tertiary", q="Is the new right unlimited?", open="b03", close="b09"),
            dict(id="M1", kind="micro", q="What are the four jobs?", open="b01", close="b09"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b07", close="b10"),
        ],
        turn="b03",
        plants=[("b00", "b03"), ("b01", "b11")],
        critical=[
            dict(what="Order of the Court, items (i)-(iv), 24 Aug 2017", src="Puttaswamy, Supreme Court copy (2017-GS2-12-01)"),
            dict(what="Conclusion 3(H): the three-fold test", src="Puttaswamy, Supreme Court copy (2017-GS2-12-07)"),
        ],
        fallback="If the Aadhaar test wording failed review: end the limits on Puttaswamy's own three-fold test.",
        tier="broad",
    ),
)
