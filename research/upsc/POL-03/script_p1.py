"""POL-03 Part 1, draft 1 (10 Nov 2026): Fundamental Rights, Part 1 of 3: what a right is, who is bound, who holds which right,
equality (Arts 14-18) and the reservation debate. Storytelling v2 (docs/STORYTELLING.md on claude/keen-ride-f20uky) and the Gold Standard.
Single source of the script: render and check with scripts/upsc/script_tool.py. Numbers are words in `say`, numerals in `cap`.
`claims` are claim ids in claims.csv (only CONFIRMED, CORRECTED or CONFLICT may be narrated; the Indra Sawhney rows C03, C04, C06-C08 are
UNVERIFIED because the Court's own copy is not served, so the 50% rule is carried by the DoPT order (C22) and Jaishri Patil (C10)).
Sensitive ground (dossier section 5): law and judgments only, every split named, no party, no community singled out."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="POL-03-P1",
    title="Equal, But How? Fundamental Rights and the Reservation Puzzle",
    beats=[
        T(1, "b00", "",
          """India's Constitution has a line about bathing ghats.
          It says no citizen can be kept from shops, public restaurants, or public wells, tanks, bathing ghats and roads.
          Not because of religion, race, caste, sex or place of birth.
          Why would a constitution need to name a bathing ghat?""",
          "Article 15(2): shops · public restaurants · public wells · tanks · bathing ghats · roads",
          """First second: river steps at dawn, people of every kind walking down to the water. The words of Article 15(2) write
          themselves across the steps. The girl from the monsoon films reads them on a phone.""",
          ["POL03-B04"], "question"),
        T(1, "b01", "but",
          """And here is a puzzle. The same Constitution lets the State reserve seats and jobs for some groups.
          So is that a break in the promise of equality? Or is it part of the promise?
          This is part one of three on Fundamental Rights. We start with what a right is. Then who it binds. Then equality, and that puzzle.""",
          "Part 1: what a right is · who it binds · equality · the reservation puzzle",
          "A balance scale: EQUALITY on one pan, RESERVATION on the other; it wobbles. A three-stop path, Part 1 lit.",
          ["POL03-B09", "POL03-K10"], "stakes"),
        T(2, "b02", "therefore",
          """So what is a right? NCERT's answer is short. A right is a justified claim, something others must accept as fair.
          Not every want is a right. Wanting a phone is not a right. Not being thrown out of a public well is.
          Rights are mostly claims on the state. They tell it what it must do, and what it must not do.""",
          "NCERT: a right = a justified claim · rights tell the state what it must and must not do",
          "The girl's notebook: two columns, WANTS and RIGHTS; a phone slides into WANTS, a well into RIGHTS.",
          ["POL03-K01", "POL03-K03"], "1", "justified claim"),
        T(2, "b03", "therefore",
          """Some rights are written into the Constitution itself. NCERT calls such a list a bill of rights.
          NCERT says the Motilal Nehru committee asked for one as early as nineteen twenty-eight.
          Fundamental Rights are in Part Three. A majority cannot vote them away by an ordinary law.
          And if they are broken, you can go to court.""",
          "NCERT: Motilal Nehru committee demanded a bill of rights, 1928 · Part III · courts enforce it",
          "A scroll unrolls into the Constitution's Part III; a vote counter tries to push it and stops at a glass wall; a courthouse door opens.",
          ["POL03-K06", "POL03-K08", "POL03-K09"], "1-2", "bill of rights"),
        T(2, "b04", "therefore",
          """But who must respect these rights? Article twelve calls it the State.
          That means the governments and legislatures of India and of each State, and local and other authorities.
          In nineteen eighty, the Supreme Court read it wider. A body that works as an arm of the government counts too.""",
          "Article 12: 'the State' · Ajay Hasia (1980): an instrumentality or agency of the Government counts",
          "Buildings light up one by one: Parliament, a State assembly, a municipal office; then a public-sector corporation joins them under one roof label THE STATE.",
          ["POL03-A01", "POL03-A02"], "2", "the State"),
        T(2, "b05", "therefore",
          """And Article thirteen gives the rights their teeth. A law that takes away a Fundamental Right is void, to that extent.
          Laws made before the Constitution are tested too.
          And law here is wide. It includes an ordinance, a rule, a notification, even a custom with the force of law.
          UPSC Prelims has tested this. In twenty twenty-six, what counts as law here. In twenty twenty-five, whether an ordinance can take away a Fundamental Right.""",
          "Article 13: a law that breaks Part III is void · 'law' includes ordinance, rule, notification, custom · Prelims 2025, 2026",
          "A rulebook with pages labelled ORDINANCE, RULE, NOTIFICATION, CUSTOM; the page that crosses a right fades to grey with VOID stamped on it.",
          ["POL03-A03", "POL03-A04", "POL03-A05", "POL03-A09"], "2-3"),
        T(2, "b06", "but",
          """But can Parliament change the rights themselves? Yes, by amending the Constitution.
          Article thirteen does not apply to an amendment.
          Still, in nineteen seventy-three, in Kesavananda Bharati, seven judges drew a line. An amendment cannot destroy the basic structure.
          That story has its own episode.""",
          "Art. 13(4) (24th Amendment, 1971) · Kesavananda Bharati (1973), seven judges: no amendment may destroy the basic structure",
          "The Constitution as a building: a crane can replace bricks, but a glowing frame inside it cannot be touched. A card points to the basic structure episode.",
          ["POL03-A07", "POL03-A08"], "3"),
        T(3, "b07", "therefore",
          """Now, who holds which right? Many people say every citizen has these rights. That is not quite how the text reads.
          Some rights belong to every person, citizen or not. Equality before law in Article fourteen is one.
          Life and personal liberty in Article twenty-one is another.
          Others are for citizens only, like the six freedoms of Article nineteen, and Articles fifteen and sixteen.""",
          "Any person: Arts 14, 20, 21, 22, 25 · citizens only: Arts 15, 16, 19, 29",
          "Two circles: EVERY PERSON (a tourist, a worker, a child) and, inside it, CITIZENS; article numbers drop into each.",
          ["POL03-A10", "POL03-A11", "POL03-A12"], "1-2", note="NCERT Grade 8's 'every Indian citizen' is CORRECTED (A12)."),
        T(4, "b08", "therefore",
          """Start the equality code with Article fourteen. The State shall not deny any person equality before the law, or the equal protection of the laws.
          NCERT explains the two phrases. Equality before law means the law treats everyone alike, whatever their rank.
          Equal protection means people in similar situations are treated alike. And in Maneka Gandhi, in nineteen seventy-eight, the lead opinion said equality is the opposite of arbitrary action.""",
          "Art. 14: equality before the law · equal protection of the laws · Maneka Gandhi (1978), lead opinion: equality is opposed to arbitrariness",
          "A judge's scale with a minister and a domestic worker on the same pan; then two queues of similar people treated alike.",
          ["POL03-B01", "POL03-B02", "POL03-B03"], "2", "equal protection"),
        T(4, "b09", "therefore",
          """Article fifteen bars the State from discriminating against a citizen. Not on grounds only of religion, race, caste, sex or place of birth.
          Clause two goes further. No citizen can be shut out of shops, public restaurants, wells, tanks, bathing ghats and roads.
          That answers our first question, as we read it. The ghats are named because people had been kept from them.
          But clause three adds that the State can still make special provisions for women and children.""",
          "Art. 15(1)-(2): no discrimination · named public places · Art. 15(3): special provisions for women and children",
          "Back to the river steps from the start: the ghat now open to all; then a women's bus seat and a children's school ramp appear.",
          ["POL03-B04", "POL03-B05", "POL03-K13"], "2-3", note="Pays off the opening plant (b00)."),
        T(4, "b10", "therefore",
          """Article sixteen gives every citizen equality of opportunity in public jobs.
          Article seventeen abolishes untouchability and forbids it in any form. Enforcing it is an offence punishable by law.
          The Protection of Civil Rights Act of nineteen fifty-five punishes it.
          A separate law of nineteen eighty-nine, the Prevention of Atrocities Act, lists atrocities against Scheduled Castes and Scheduled Tribes.
          And Article eighteen ends titles, except military or academic distinctions.""",
          "Art. 16: equal opportunity in public jobs · Art. 17: untouchability abolished · PCR Act 1955 · PoA Act 1989 · Art. 18: titles ended",
          "Three cards on a desk: a job notice open to all; a broken chain across a village well; a crossed-out title scroll beside a military medal and a degree.",
          ["POL03-B08", "POL03-B11", "POL03-B14", "POL03-B13", "POL03-B12"], "2"),
        T(5, "b11", "but",
          """But now the puzzle. Article sixteen, clause four, says nothing in it stops the State from reserving posts.
          The reservation is for any backward class which, in the State's opinion, is not adequately represented in its services.
          NCERT reads this plainly. It says reservation is not a violation of equality.
          And Article fifteen got a similar clause in nineteen fifty-one, by the First Amendment.""",
          "Art. 16(4): a backward class not adequately represented, in the State's opinion · NCERT: not a violation of equality · Art. 15(4), 1951",
          "The balance scale from the start steadies: the clause slides in as part of the EQUALITY pan, not against it.",
          ["POL03-B09", "POL03-B05"], "3", "adequately represented", note="The turn: reservation is written inside the equality code."),
        T(5, "b12", "therefore",
          """In plain words, as we read it, equality here means more than treating everyone the same. It means treating people in unequal situations differently, so they can start level.
          The Directive Principles point the same way. Article forty-six asks the State to promote, with special care, the interests of the weaker sections.
          And Article three thirty-five adds a balance. The claims of Scheduled Castes and Scheduled Tribes to services are weighed with the efficiency of administration.""",
          "Art. 46: promote weaker sections 'with special care' · Art. 335: SC/ST claims, consistently with efficiency of administration",
          "Two runners at different starting lines; a ramp brings one up to the line. A small balance labelled EFFICIENCY sits beside the track.",
          ["POL03-C18", "POL03-C17"], "3-4", "substantive equality", note="'Start level' is our plain reading of B09 and C18, said as such."),
        T(5, "b13", "therefore",
          """How did the quota for backward classes come about? The Mandal Commission reported on the last day of nineteen eighty.
          In nineteen ninety, the Government ordered twenty-seven percent of central civil posts for these classes, in direct recruitment.
          The Supreme Court's nine judges upheld it in nineteen ninety-two. But the lead judgment set a condition. The creamy layer, the better-off among them, must be left out.""",
          "Mandal report: 31 Dec 1980 · 1990 order: 27% of central civil posts · Indra Sawhney (1992), lead judgment: exclude the creamy layer",
          "A report on a desk dated 1980; a government order stamped 1990 with 27%; then a family pyramid with its well-off top shaded out.",
          ["POL03-C01", "POL03-C02", "POL03-C05"], "3", "creamy layer"),
        T(5, "b14", "therefore",
          """The second limit is the fifty percent rule. A government order of nineteen ninety-three applies it, following that judgment.
          Reservations for Scheduled Castes, Scheduled Tribes and backward classes together must not cross half of a year's vacancies.
          In twenty twenty-one, a five-judge bench kept that ceiling. It said a Maratha quota above it was not justified by exceptional circumstances.""",
          "DoPT OM, 1993, following Indra Sawhney: SC + ST + OBC within 50% of a year's vacancies · Jaishri Patil (2021, five judges): ceiling kept",
          "A bar of a year's vacancies with a bright line at the half mark; coloured blocks fill up to it; a new block tries to go above and is stopped.",
          ["POL03-C22", "POL03-C10"], "3-4"),
        T(5, "b15", "but",
          """But in twenty nineteen, a new quota went on top. The hundred-and-third Amendment allowed up to ten percent for economically weaker sections.
          The Supreme Court upheld it by three to two. One of the majority, Justice Maheshwari, wrote about the ceiling. It is not inflexible, he said, and covers only the older classes.
          Two judges dissented. They held that leaving out the poor among the older groups broke the basic structure.
          In central jobs, that brings reserved posts to fifty-nine and a half percent, by our arithmetic.""",
          "EWS: up to 10%, 103rd Amendment, 2019 · Janhit Abhiyan (2022): upheld 3:2 · 15 + 7.5 + 27 + 10 = 59.5% (our arithmetic)",
          "The vacancy bar again: a new block of 10% sits above the half line. Five judges' chairs: three green, two amber with the word DISSENT.",
          ["POL03-B07", "POL03-C12", "POL03-C13", "POL03-C14", "POL03-C24"], "4", note="Both sides of the split named (dossier section 3)."),
        T(5, "b16", "therefore",
          """And the debate goes on. In twenty twenty-four, seven judges ruled six to one. States may sub-classify the Scheduled Castes, if their data shows a group is inadequately represented because of its backwardness.
          In a separate opinion, one judge said the State must also find a creamy layer among them. That is his opinion, and three judges agreed with it.
          Reservation in promotion has its own clause too, added in nineteen ninety-five.""",
          "Davinder Singh (2024): sub-classification allowed, 6:1 · Gavai J.: creamy layer among SCs (agreed by three judges) · Art. 16(4A), 1995",
          "A tree of the SC list branching into groups, each with a small data chart; a separate scroll labelled ONE JUDGE'S OPINION, three signatures beside it.",
          ["POL03-C15", "POL03-C16", "POL03-B10"], "4"),
        T(6, "b17", "therefore",
          """So, is reservation a break in the promise of equality? Read plainly, the Constitution's own text says no.
          It writes reservation into the equality code, for a backward class which, in the State's opinion, is not adequately represented. NCERT says the same.
          The arguments are about its limits. The creamy layer. The fifty percent ceiling and its exceptions. And the data the State must show.
          For the exam, write it this way. Article fourteen is equality before law. Fifteen and sixteen bar discrimination, but allow special provisions.
          Sixteen four makes reservation part of equality, and courts have set its limits.""",
          "exam card: Art. 14 · 15 and 16 (no discrimination + special provisions) · 16(4) · limits: creamy layer, 50%, data",
          "The girl's notebook: the scale balanced; exam lines fill in one by one; the words 'break the promise?' crossed out.",
          ["POL03-B09", "POL03-B01", "POL03-B04", "POL03-B08", "POL03-C05", "POL03-C22", "POL03-C13", "POL03-C15"], "5", note="Payoff of the primary loop."),
        T(6, "b18", "therefore",
          """In part two: the freedoms, and life and liberty.
          Including one of the two stories NCERT opens with: a man held in custody for fifty-four years.""",
          "next: Articles 19 to 24",
          "The girl closes the notebook; a prison gate opens onto daylight.",
          ["POL03-K07"], "handoff"),
    ],
    story=dict(
        promise="If the Constitution promises everyone equality, how can it also reserve seats and jobs: a break in the promise, or part of it?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="Is reservation a break in equality, or part of it?", open="b01", close="b17"),
            dict(id="L2", kind="secondary", q="Why would a constitution name a bathing ghat?", open="b00", close="b09"),
            dict(id="L3", kind="tertiary", q="Who must respect these rights, and whose are they?", open="b04", close="b07"),
            dict(id="M1", kind="micro", q="What makes a right a right?", open="b02", close="b03"),
            dict(id="M2", kind="micro", q="Can Parliament change the rights?", open="b05", close="b06"),
            dict(id="M3", kind="micro", q="Where does the fifty percent rule come from, and does it still hold?", open="b14", close="b15"),
        ],
        turn="b11",
        plants=[("b00", "b09"), ("b01", "b11"), ("b01", "b17")],
        critical=[
            dict(what="Article 16(4) and NCERT's reading of it", src="Constitution as on 10 Sep 2026; NCERT keps2 (B09)"),
            dict(what="The 50% rule and its exceptions", src="DoPT OM 1993 (C22); Jaishri Patil 2021 (C10); Janhit Abhiyan 2022 (C12-C14)"),
            dict(what="Sub-classification and the creamy-layer opinion", src="Davinder Singh 2024, Court's copy (C15, C16)"),
        ],
        fallback="If the Janhit Abhiyan reading failed review: stop at the 50% rule (C22, C10) and say the EWS quota was upheld 3:2 (C12) without the reasons.",
        tier="broad",
    ),
)
