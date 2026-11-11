"""POL-03 Part 3, draft 1 (11 Nov 2026): Fundamental Rights, Part 3 of 3: freedom of religion (Arts 25-28), cultural and educational
rights (Arts 29-30), the right to constitutional remedies (Arts 32, 226) and the limits of Part III (31A-31C, 33-34), the Directive
Principles (Part IV) and their clash with rights, property (Art. 300A), the Fundamental Duties (Art. 51A) and the NHRC.
Storytelling v2 and the Gold Standard. Check with scripts/upsc/script_tool.py. Numbers are words in `say`, numerals in `cap`.
Sensitive (dossier section 5): religion and minority rights are taught from the text and NCERT's framing only; no community is named
or shown by look or dress; Arts 44 and 48 are read as text, not argued. J02 (NCERT on Kesavananda and property) is a CONFLICT and is
not narrated."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="POL-03-P3",
    title="Rights You Can Enforce, Goals You Cannot: Fundamental Rights, Part 3",
    beats=[
        T(1, "b00", "",
          """In nineteen eighty-six, three schoolchildren stood up respectfully every morning when the national anthem played.
          But they did not sing, because their faith did not allow it. The school expelled them.
          Their case reached the Supreme Court. Can a school make you sing?""",
          "Bijoe Emmanuel (1986): three children stood for the anthem but did not sing",
          """First second: a school assembly at dawn, rows of generic children standing; three of them stand still with closed lips.
          A school gate shuts. Then a courthouse door, and a question card: CAN A SCHOOL MAKE YOU SING?""",
          ["POL03-F06"], "question"),
        T(1, "b01", "but",
          """Hold that question. There is a bigger one in this last part.
          Part Three of the Constitution gives rights you can take to court. Part Four lists goals for the State that no court can enforce.
          So when a right and a goal collide, which one wins?""",
          "Part III: rights a court enforces · Part IV: Directive Principles no court enforces",
          """The three-stop path from Parts 1 and 2, the third stop now lit. Beside it, two books on a desk: PART III with a gavel,
          PART IV with a compass. They slide towards each other.""",
          ["POL03-K10", "POL03-I01"], "stakes"),
        T(2, "b02", "therefore",
          """Start with religion. Article twenty-five gives every person freedom of conscience.
          It also gives the right to profess, practise and propagate religion. That means to declare it, follow it and spread it.
          This right is for all persons, not only citizens.""",
          "Art. 25(1): freedom of conscience · profess, practise, propagate · all persons",
          """Three verbs written on a notebook page: PROFESS, PRACTISE, PROPAGATE, each with a small generic icon (a voice, a lamp,
          a book). Generic people of many kinds, no religious dress singled out.""",
          ["POL03-F01"], "1", "freedom of conscience"),
        T(2, "b03", "but",
          """But this freedom has limits written into it. It is subject to public order, morality and health.
          The State may also regulate money and other worldly matters linked to religion, and pass laws for social reform.
          NCERT gives sati, bigamy and human sacrifice as practices the State may stop.
          And NCERT says spreading your faith is allowed, but forcing anyone to convert is not.""",
          "Art. 25(1)-(2): public order, morality, health · secular activity · social reform · NCERT: no forcible conversion",
          """The three verbs sit inside a frame whose edges are labelled PUBLIC ORDER, MORALITY, HEALTH. A small gear marked
          SECULAR ACTIVITY turns at the side. NCERT's three examples appear only as words on a crossed-out card, never as pictures.""",
          ["POL03-F02", "POL03-F07"], "2"),
        T(2, "b04", "therefore",
          """So back to the anthem. The children had stood in respect. They had disturbed no one.
          The Supreme Court held that expelling them broke two rights. Freedom of speech and expression under Article nineteen, and freedom of
          religion under Article twenty-five. No one can be forced to sing.""",
          "Bijoe Emmanuel (1986): Arts 19(1)(a) and 25(1) infringed",
          "The school gate from the opening reopens; the three children walk back in. A card: ARTS 19(1)(a) + 25(1).",
          ["POL03-F06"], "2-3"),
        T(2, "b05", "therefore",
          """Article twenty-six is for groups. Every religious denomination may set up its own institutions and manage its own religious affairs.
          It may own property and run it as the law allows.
          When this clashed with the law opening temples to all Hindus, the Court in nineteen fifty-seven harmonised the two.
          The temple had to open to all. The denomination kept some of its own rites.""",
          "Art. 26: denominations' own affairs · Venkataramana Devaru (1957): temple entry for all, own rites kept",
          """A generic temple building with open doors and many people walking in; inside, a small reserved space for the
          denomination's own ritual. Balance icon: ART. 25(2)(b) and ART. 26(b), both lit.""",
          ["POL03-F03", "POL03-F05", "POL03-F02"], "2"),
        T(2, "b06", "therefore",
          """Two more rules keep the State neutral. No one can be made to pay a tax spent on promoting one particular religion.
          And a school fully paid for by the State cannot give religious instruction.
          The word secular entered the Preamble in nineteen seventy-seven. NCERT explains it simply. India has no official religion.""",
          "Art. 27: no tax for one religion · Art. 28(1): no religious instruction in State-run schools · 'secular' in Preamble (in force 1977)",
          """A tax receipt with a blank 'religion' line; a State school whose notice board reads ALL WELCOME; the Preamble page with
          the word SECULAR written in.""",
          ["POL03-F04", "POL03-F08"], "2"),
        T(3, "b07", "therefore",
          """Now culture and education. Article twenty-nine says any section of citizens with its own language, script or culture may conserve it.
          Notice the words, any section. It is not only for minorities.
          And no State-run or State-aided school may refuse a citizen only for religion, race, caste or language.""",
          "Art. 29(1): any section may conserve its language, script, culture · 29(2): no denial of admission",
          """Many scripts written on a long ribbon across the screen, generic and varied; a school door with an open sign.""",
          ["POL03-G01"], "1"),
        T(3, "b08", "therefore",
          """Article thirty goes further for minorities. Religious and linguistic minorities may set up and run schools and colleges of their choice.
          The State cannot refuse aid to a school just because a minority manages it.
          Yet the Constitution never defines who counts as a minority. NCERT describes a group outnumbered in a part of the country or the whole.""",
          "Art. 30(1)-(2): minorities' own institutions; no discrimination in aid · 'minority' not defined in the text",
          """A plain school building with a nameplate MANAGED BY A MINORITY; an aid envelope reaches it like any other school.
          A dictionary page titled MINORITY in the Constitution is blank.""",
          ["POL03-G02", "POL03-G03"], "2"),
        T(3, "b09", "but",
          """But NCERT itself notes a debate. Some people feel these protections go against secularism and equal treatment.
          The Constitution's own answer is in the text. Equality, and special protection so a smaller group can keep what is its own.""",
          "NCERT: 'some people feel' minority protections go against secularism · the text: Arts 29-30",
          """Two speech bubbles of the same size and colour, side by side, with no faces; under them, the Article 29 and 30 cards.""",
          ["POL03-F09", "POL03-G01", "POL03-G02"], "3", note="Both sides shown equally; NCERT's framing only."),
        T(4, "b10", "therefore",
          """A right is only as strong as the way to enforce it. So Article thirty-two makes going to the Supreme Court a right in itself.
          The Court can issue orders and writs to enforce your rights. Under Article two hundred twenty-six, every High Court can too.
          Ambedkar told the Constituent Assembly it was the very soul of the Constitution and the very heart of it.""",
          "Art. 32: moving the Supreme Court is a right · Art. 226: High Courts · Ambedkar (9 Dec 1948): 'soul' and 'heart'",
          """A courthouse door labelled ART. 32 with a key in it; a smaller door ART. 226 beside it. A robed, faceless silhouette at a
          lectern with a name plaque B.R. AMBEDKAR, 1948, and the quote written beside it.""",
          ["POL03-H01", "POL03-H02", "POL03-H03"], "1", "writ"),
        T(4, "b11", "but",
          """But Part Three has its own outer limits. Parliament decides how far these rights apply to the armed forces.
          It can also protect acts done to restore order where martial law was in force.
          And some land and policy laws are shielded from challenge on these rights. We will open that box in the basic structure episode.""",
          "Arts 33-34: armed forces, martial law · Arts 31A, 31B (Ninth Schedule), 31C: shielded laws (see POL-06)",
          """The rights shelf from Part 2, with a fence at its edge labelled ARTS 33-34, and a sealed box labelled NINTH SCHEDULE
          set aside with a tag 'POL-06'.""",
          ["POL03-H04", "POL03-H05"], "2"),
        T(5, "b12", "therefore",
          """Now Part Four, the Directive Principles. Article thirty-seven says no court can enforce them.
          Yet it calls them fundamental in the governance of the country. The State has a duty to apply them when it makes laws.
          So they are not rights you can sue for. They are goals the State has promised to work towards.""",
          "Art. 37: not enforceable by any court · fundamental in governance · State's duty in making laws",
          """The PART IV book opens into a compass; its needle points to a horizon marked GOALS. No gavel on this side.""",
          ["POL03-I01"], "turn", "Directive Principles"),
        T(5, "b13", "therefore",
          """The goals are broad. A livelihood for men and women, and equal pay for equal work. Resources shared for the common good.
          Village panchayats with real powers. The right to work and to public help in old age, sickness and unemployment, within the State's means.
          A living wage. Care and education for every child below six. A judiciary kept separate from the executive.
          And a uniform civil code, and better nutrition and public health.""",
          "Arts 38-39 livelihood, equal pay · 40 panchayats · 41 work, assistance · 43 living wage · 44 uniform civil code · 45 early childhood · 47 nutrition · 50 judiciary separate",
          """A horizon of small signposts, one per goal, each with its article number, appearing one by one as they are named;
          the text only, no scene for Article 44.""",
          ["POL03-I02", "POL03-I03", "POL03-I03b", "POL03-I03c", "POL03-I05", "POL03-I04"], "2",
          note="Art. 44 read as text, not argued (dossier section 5)."),
        T(6, "b14", "but",
          """But these goals ran into rights. To reform land, States passed laws that took property, and owners went to court.
          NCERT says the courts at first held that Fundamental Rights were too sacred to be limited for these goals.
          Property itself was a fundamental right until June nineteen seventy-nine. Since then it is a constitutional right under Article three hundred A.
          The State can take your property only by authority of law.""",
          "land reform vs property · Arts 19(1)(f), 31 omitted (in force 20 Jun 1979) · Art. 300A: only by authority of law",
          """The two books from the opening collide; a land map between them tears. A card PROPERTY moves from the PART III shelf to a
          separate plinth labelled ART. 300A.""",
          ["POL03-I06", "POL03-J01", "POL03-D04"], "3"),
        T(6, "b15", "therefore",
          """So which one wins? Neither. The Minerva Mills case was decided in nineteen eighty.
          The majority held that the balance between Part Three and Part Four is itself a basic feature.
          Rights and goals must be read together. In twenty twenty-four, nine judges held that the original Article thirty-one C still stands.
          The wider version from nineteen seventy-six had been struck down in Minerva Mills.""",
          "Minerva Mills (1980): FR-DPSP balance is a basic feature · Property Owners Association (2024): unamended Art. 31C in force",
          """The brass balance from Part 1 returns, PART III in one pan and PART IV in the other, level. Nine empty judges' chairs,
          labelled by count only; a card ART. 31C (ORIGINAL) stays, a card ART. 31C (1976) is crossed out.""",
          ["POL03-I06", "POL03-H06"], "5"),
        T(7, "b16", "therefore",
          """Rights also come with duties. Article fifty-one A lists eleven Fundamental Duties. Ten came in nineteen seventy-seven.
          The eleventh was added later. Parents and guardians must give a child aged six to fourteen the chance to study.
          No clause lets a court enforce these duties. And NCERT says your rights do not depend on doing them first.""",
          "Art. 51A: 11 duties · 10 from 1977 (42nd Amendment) · 11th: education, ages 6-14 (86th) · not court-enforceable",
          """The girl's notebook: a page titled DUTIES with eleven short lines; the eleventh line is a school bag. A small note at the
          bottom: RIGHTS DO NOT WAIT FOR DUTIES (NCERT).""",
          ["POL03-I07", "POL03-K17", "POL03-I08"], "2"),
        T(7, "b17", "therefore",
          """And when rights are broken, the National Human Rights Commission can step in. It was set up under a law of nineteen ninety-three.
          It can inquire and recommend. It cannot punish anyone itself.""",
          "NHRC: Protection of Human Rights Act, 1993 · recommends, does not prosecute",
          """A plain office door labelled NATIONAL HUMAN RIGHTS COMMISSION; a recommendation letter goes out, no gavel.""",
          ["POL03-H07"], "2"),
        T(8, "b18", "therefore",
          """So, rights you can enforce, and goals you cannot. When they clash, neither simply wins. The courts must keep them in balance.
          For the exam, write it this way. Articles twenty-five to twenty-eight give freedom of religion, within public order, morality and health.
          Articles twenty-nine and thirty protect culture and minority education. Article thirty-two makes the remedy a right.
          The Directive Principles guide the State but cannot be enforced, and since Minerva Mills the two are read in balance.
          Property is now a constitutional right under Article three hundred A. And there are eleven duties.""",
          "exam card: Arts 25-28 · 29-30 · 32 · Part IV (Art. 37) · Minerva Mills balance · Art. 300A · 11 duties",
          "The balance stays level; the girl's notebook fills with the exam lines; the three-stop path is complete.",
          ["POL03-F01", "POL03-G01", "POL03-G02", "POL03-H01", "POL03-I01", "POL03-I06", "POL03-J01", "POL03-I07"], "5"),
        T(8, "b19", "therefore",
          """That completes Fundamental Rights. Next, the five writs that Article thirty-two promised, one by one.""",
          "next: the five writs (POL-04)",
          "The three-stop path, all three stops lit; a fourth road sign ahead reads THE FIVE WRITS.",
          ["POL03-H01"], "handoff"),
    ],
    story=dict(
        promise="When a right you can enforce meets a goal no court can enforce, which one wins?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="When a right and a Directive Principle collide, which wins?", open="b01", close="b15"),
            dict(id="M1", kind="micro", q="Can a school make you sing?", open="b00", close="b04"),
            dict(id="L2", kind="secondary", q="Is a right worth anything if you cannot enforce it?", open="b10", close="b10"),
            dict(id="M2", kind="micro", q="Who counts as a minority?", open="b08", close="b09"),
        ],
        turn="b12",
        plants=[("b00", "b04"), ("b01", "b15"), ("b10", "b19")],
        critical=[
            dict(what="Bijoe Emmanuel's holding", src="Bijoe Emmanuel (1986), Court's copy (F06)"),
            dict(what="Minerva Mills' balance holding and the 2024 nine-judge ruling on Art. 31C", src="POL-06 F05, F04, F09 via I06, H06"),
            dict(what="Property: Arts 19(1)(f) and 31 omitted in force 20 Jun 1979; Art. 300A", src="Constitution footnotes (J01, D04)"),
        ],
        fallback="If the anthem case failed review: open on the two books, Part III and Part IV, and the question of which wins (I01).",
        tier="broad",
    ),
)
