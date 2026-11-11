"""POL-03 Part 2, draft 1 (10 Nov 2026): Fundamental Rights, Part 2 of 3: the six freedoms and their limits, the accused (Art. 20),
life and liberty from Gopalan to Maneka Gandhi to Puttaswamy, the widening of Article 21, arrest and preventive detention, Emergency,
and rights against exploitation (Arts 23-24). Storytelling v2 and the Gold Standard. Check with scripts/upsc/script_tool.py.
Numbers are words in `say`, numerals in `cap`. Real private persons (dossier section 5): NCERT's own framing, attributed to NCERT."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="POL-03-P2",
    title="Can Any Law Take Your Liberty? Fundamental Rights, Part 2",
    beats=[
        T(1, "b00", "",
          """NCERT opens its chapter on rights with two true stories. One is about a man named Machal Lalung.
          He was held in judicial custody for fifty-four years. He was released in two thousand five.
          Article twenty-one says no one can lose life or liberty, except by procedure established by law.
          So can any law take your liberty, as long as it follows its own procedure?""",
          "NCERT: held in judicial custody 54 years, released 2005 · Art. 21: 'procedure established by law'",
          """First second: a heavy prison gate in grey light; a calendar's pages flying past for decades. Then the words of Article 21
          write themselves on the gate. The girl reads them.""",
          ["POL03-K07", "POL03-D08"], "question"),
        T(1, "b01", "therefore",
          """This is part two of three on Fundamental Rights. Part one was equality.
          This part is freedom. First the six freedoms and their limits.
          Then life and liberty, and how one phrase in Article twenty-one changed its meaning.""",
          "Part 2: the six freedoms · Article 20 · Article 21 · arrest · exploitation",
          "The three-stop path from Part 1, the second stop now lit.",
          ["POL03-K10"], "stakes"),
        T(2, "b02", "therefore",
          """Article nineteen gives citizens six freedoms. To speak and express yourself. To gather peacefully, without arms.
          To form associations or unions. To move freely across India. To live and settle anywhere in it.
          And to practise any profession, trade or business.""",
          "Art. 19(1): speech · assembly · associations · movement · residence · profession",
          "Six doors in a row, each opening on its scene: a speaker, a peaceful crowd, a union meeting, a train, a new home, a shop.",
          ["POL03-D01"], "1"),
        T(2, "b03", "but",
          """But no freedom here is absolute. Each comes with its own limits.
          Speech can be restricted for the sovereignty and integrity of India, security of the State, public order, decency or morality.
          Defamation, contempt of court and incitement to an offence are grounds too.
          And movement can be limited in the public interest, or to protect a Scheduled Tribe's interests.""",
          "Art. 19(2)-(6): reasonable restrictions · speech: sovereignty, security, public order, decency, defamation... · 19(5): Scheduled Tribes",
          "Each of the six doors gets a small gate with a sign of its limits; the speech door's sign lists the grounds.",
          ["POL03-D02", "POL03-D03"], "2", "reasonable restrictions"),
        T(2, "b04", "therefore",
          """A restriction must still be reasonable, and courts check that.
          In twenty fifteen, the Supreme Court struck down Section sixty-six A of the Information Technology Act in full.
          It held the section violated free speech and was not saved by the allowed limits.""",
          "Shreya Singhal (2015): s.66A of the IT Act struck down in full",
          "A phone screen with a post; a law book page labelled 66A tears out and falls away.",
          ["POL03-D05"], "2-3"),
        T(3, "b05", "therefore",
          """Article twenty protects anyone accused of a crime. You cannot be punished for an act that was not an offence when you did it.
          You cannot be prosecuted and punished twice for the same offence.
          And you cannot be forced to be a witness against yourself.""",
          "Art. 20: no retroactive offence · no double jeopardy · no compelled self-incrimination",
          "A courtroom in warm light; three shields appear in front of the accused, one for each protection.",
          ["POL03-D07"], "2"),
        T(3, "b06", "therefore",
          """Now Article twenty-one. Life and liberty can go only by procedure established by law.
          In nineteen fifty, in the Gopalan case, a majority of the Court read each right as a separate box.
          On that reading, a law that set out a procedure could be enough.
          NCERT's Class Nine glossary says the phrase means strict adherence to duly enacted and valid laws. To our ear, that is the Gopalan idea.""",
          "Art. 21 · Gopalan (1950), majority: rights as separate silos · NCERT Grade 9's gloss: the older idea",
          "Rights drawn as separate glass boxes on a shelf; a stamped rulebook alone opens the liberty box.",
          ["POL03-D08", "POL03-D09", "POL03-D11"], "2-3", "procedure established by law",
          note="The steelman: the text, read plainly, sounds like Gopalan."),
        T(3, "b07", "but",
          """But in nineteen seventy-eight, Maneka Gandhi's passport was impounded, at first without reasons.
          Seven judges heard her case. Six joined the lead opinion: the procedure must be right, just and fair, not arbitrary. One judge dissented.
          It must also pass the test of equality in Article fourteen.
          And the rights are not separate boxes. Later judges said they overlap.""",
          "Maneka Gandhi (1978): procedure must be 'right and just and fair' · tested by Art. 14 · rights overlap (Puttaswamy on Gopalan)",
          "A passport stamped IMPOUNDED; then the glass boxes melt into one connected web of rights.",
          ["POL03-L04", "POL03-D10", "POL03-D09"], "3", note="The turn: a valid law is not enough; the procedure must be fair."),
        T(4, "b08", "therefore",
          """So Article twenty-one grew wider and wider. Take privacy.
          The word privacy does not appear anywhere in the Constitution.
          Yet on the twenty-fourth of August, twenty seventeen, nine judges decided it together. Privacy is protected under Article twenty-one, and by the other freedoms.""",
          "'privacy': 0 times in the Constitution · Puttaswamy (24 Aug 2017, nine judges): privacy under Art. 21 and Part III",
          "A search box over the Constitution's text: 'privacy', 0 results. Then nine chairs on a bench; the Order is signed by all nine.",
          ["POL03-L05", "POL03-D12", "POL03-L08"], "3", "right to privacy"),
        T(4, "b09", "but",
          """But privacy is not absolute either. The lead opinion, for four judges, set a three-part test.
          A law must exist. It must serve a legitimate aim. And the means must be proportionate to that aim.
          The same opinion said privacy covers your data, with dangers from the State and from others.
          A data protection law came in twenty twenty-three, and comes into force in stages.""",
          "Puttaswamy (lead opinion, 4 judges): legality · legitimate aim · proportionality · informational privacy · DPDP Act 2023, in stages",
          "A phone, a bank card and a health app glow; three gates labelled LAW, AIM, PROPORTION stand before them.",
          ["POL03-D13", "POL03-D15", "POL03-L03", "POL03-X06"], "4", "proportionality"),
        T(4, "b10", "therefore",
          """Article twenty-one kept widening. Education became its own right in Article twenty-one A, for children aged six to fourteen.
          NCERT's Class Nine book says it was added in two thousand nine. The amendment is of two thousand two, in force from two thousand ten.
          The Court also held that the right to life includes livelihood. And it read clean water and air into it.""",
          "Art. 21A (86th Amendment 2002, in force 1 Apr 2010; NCERT says 2009) · Olga Tellis (1985): livelihood · Subhash Kumar (1991): water and air",
          "A tree growing from a seed labelled ARTICLE 21: branches for EDUCATION, LIVELIHOOD, WATER AND AIR.",
          ["POL03-D16", "POL03-D17", "POL03-D18", "POL03-D24"], "3", note="NCERT's 2009 is CORRECTED (D17)."),
        T(5, "b11", "therefore",
          """What if you are arrested? Article twenty-two says you must be told why, as soon as possible.
          You may consult a lawyer of your choice. And you must be taken before the nearest magistrate within twenty-four hours.
          In nineteen ninety-six, the Court added rules for every arrest: a memo of arrest, and a relative or friend told.""",
          "Art. 22(1)-(2): grounds · lawyer · magistrate within 24 hours · D.K. Basu (1996): memo of arrest, a relative informed",
          "A police station desk: an arrest memo being signed and witnessed; a clock showing 24 hours; a phone call to a relative.",
          ["POL03-D20", "POL03-D22"], "2"),
        T(5, "b12", "but",
          """But there is a harder case: preventive detention, to stop a feared act before it happens.
          The Constitution allows it, with a check. Detention beyond three months needs an Advisory Board's report, unless a law of Parliament provides otherwise.
          A nineteen seventy-eight amendment would cut that to two months. But in the Legislative Department's text of September twenty twenty-six, that change is still not in force.""",
          "Art. 22(4): 3 months, then an Advisory Board · 44th Amendment change to 2 months: 'date to be notified'",
          "A calendar marked at three months with a board of three robed figures; a second calendar marked two months, behind glass labelled NOT IN FORCE.",
          ["POL03-D21", "POL03-D21b"], "3", "preventive detention"),
        T(5, "b13", "therefore",
          """And during an Emergency? The President may suspend the right to go to court for most Fundamental Rights.
          But not for Articles twenty and twenty-one. That exception was added in nineteen seventy-eight.
          In twenty seventeen came Puttaswamy. Its lead opinion, for four judges, overruled the Emergency-era ruling of nineteen seventy-six, ADM Jabalpur.""",
          "Art. 359(1): Arts 20 and 21 cannot be suspended (44th Amendment, 1978) · Puttaswamy (2017), lead opinion: ADM Jabalpur (1976) overruled",
          "A courthouse door half-shut by an EMERGENCY bar; two small doors marked 20 and 21 stay open.",
          ["POL03-D23", "POL03-D14"], "3-4"),
        T(6, "b14", "therefore",
          """Freedom also means freedom from exploitation. Article twenty-three bans trafficking in people, and forced labour.
          In nineteen eighty-two, workers building for the Asian Games were paid below the minimum wage.
          The Supreme Court held that this was forced labour. And it held that the Article binds private contractors too.""",
          "Art. 23: no trafficking or forced labour · PUDR (1982): below-minimum-wage work = forced labour; binds private contractors",
          "A stadium under construction in 1982 light; a wage slip below a minimum line; a contractor's office gets the same notice as a government one.",
          ["POL03-E01", "POL03-E02", "POL03-K07"], "2-3", "forced labour"),
        T(6, "b15", "therefore",
          """Article twenty-four bars children under fourteen from factories, mines and other hazardous work.
          And NCERT Class Eight says a law in force from December twenty thirteen bans employing people as manual scavengers.""",
          "Art. 24: no child under 14 in factories, mines, hazardous work · Manual Scavengers Act, in force 6 Dec 2013",
          "A school bag replaces a pick at a mine entrance; a sanitation machine replaces a bucket.",
          ["POL03-E03", "POL03-E04"], "2"),
        T(7, "b16", "therefore",
          """So can any law take your liberty, as long as it follows its own procedure? Since Maneka Gandhi, no.
          The procedure itself must be fair, just and reasonable, and must pass the test of equality.
          And since Puttaswamy, a law that touches privacy needs a legitimate aim and proportionate means. That is the lead opinion, for four judges.
          For the exam, write it this way. Article nineteen gives six freedoms, each with reasonable restrictions.
          Article twenty protects the accused. Article twenty-one, after Maneka Gandhi, needs fair procedure. It now holds privacy, livelihood, and clean water and air, and Article twenty-one A adds education.""",
          "exam card: Art. 19 + restrictions · Art. 20 · Art. 21 after Maneka (fair, just, reasonable) · privacy (Puttaswamy) · 21A · arrest rights",
          "The prison gate from the start opens onto daylight; the girl's notebook fills with the exam lines.",
          ["POL03-D10", "POL03-D13", "POL03-D01", "POL03-D02", "POL03-D07", "POL03-D12", "POL03-D16", "POL03-D18", "POL03-D24"], "5"),
        T(7, "b17", "therefore",
          """In part three: religion, culture and education. Then the right to move the Court, and the Directive Principles that guide the State.""",
          "next: Articles 25 to 35 and Part IV",
          "The three-stop path, the third stop glowing.",
          ["POL03-K10"], "handoff"),
    ],
    story=dict(
        promise="Can any law take your liberty, as long as it follows its own procedure?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="Can any law take your liberty if it follows its own procedure?", open="b00", close="b16"),
            dict(id="L2", kind="secondary", q="Are the six freedoms absolute?", open="b02", close="b04"),
            dict(id="L3", kind="tertiary", q="How does a right that the text never names, privacy, get protected?", open="b08", close="b09"),
            dict(id="M1", kind="micro", q="What happens to rights in an Emergency?", open="b12", close="b13"),
            dict(id="M2", kind="micro", q="Does forced labour need chains?", open="b00", close="b14"),
        ],
        turn="b07",
        plants=[("b00", "b16"), ("b06", "b07"), ("b00", "b14")],
        critical=[
            dict(what="Maneka Gandhi's fair-procedure holding", src="Maneka Gandhi (1978), Court's copy (D10)"),
            dict(what="Puttaswamy: the Order and the lead opinion's test", src="Puttaswamy (2017), Court's copy (D12, D13)"),
            dict(what="Art. 22(4) and the un-notified 44th Amendment change", src="Constitution as on 10 Sep 2026 and its footnote (D21, D21b)"),
        ],
        fallback="If the Gopalan contrast failed review: open the turn on the text of Art. 21 and NCERT's gloss (D08, D11), then Maneka Gandhi.",
        tier="broad",
    ),
)
