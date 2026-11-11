"""ECO-12 Part 2, draft 1 (11 Nov 2026): GST in the Constitution. Part 2 of 3: why one tax needed an amendment, the 101st Amendment
(Arts 246A, 269A, 366(12A), the Seventh Schedule edits), what GST merged, the GST Council (Art 279A), its weighted vote, and
Union of India v Mohit Minerals (2022). Part 3 is the money: compensation, COVID, rates and the Budget.
Storytelling v2 and the Gold Standard. Check with scripts/upsc/script_tool.py. Numbers are words in `say`, numerals in `cap`.
F03 (octroi wording) is a CONFLICT and is not narrated. 'Accommodative federalism' is the exam's phrase, not the Court's (dossier E3).
The vote arithmetic in b09 is our working from the Article's shares, labelled as such."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="ECO-12-P2",
    title="Who Decides GST: Delhi or the States? GST and the Rest, Part 2",
    beats=[
        T(1, "b00", "",
          """The Union Finance Minister and a minister from every State sit at one table, the GST Council.
          Guess first. Can the Centre alone push a decision through? Can all the States together outvote the Centre?""",
          "Guess first: can the Centre alone decide? Can all States together?",
          """First second: a long table seen from above, one chair labelled UNION and many chairs with blank State name cards
          (no party colours, no faces). Two question cards: CENTRE ALONE? ALL STATES TOGETHER?""",
          ["E12-C06", "E12-D01"], "question"),
        T(1, "b01", "therefore",
          """Hold your guess. First, why does this table exist at all?
          This is part two of three. Part one was who really pays. This part is how the Constitution made one tax possible.""",
          "Part 2 of 3: GST in the Constitution",
          "The three-stop path, the second stop lit.",
          ["E12-C01"], "stakes"),
        T(2, "b02", "but",
          """Before GST, the Constitution gave the Centre and the States separate tax powers.
          The Centre taxed manufacture and services. The States taxed sales.
          So one tax on the whole supply chain did not fit into either list.""",
          "before 2016: separate Union and State tax entries · excise and service tax with the Centre · sales tax with the States",
          """Two locked boxes, UNION LIST and STATE LIST, each holding its own tax cards; a single long GST card cannot fit into either.""",
          ["E12-C14", "E12-C13"], "1", note="General description from the omitted and amended entries (C13, C14)."),
        T(2, "b03", "therefore",
          """So Parliament amended the Constitution. The hundred and first Amendment Act received the President's assent on the eighth of September, twenty sixteen.
          Its GST Council article came into force on the twelfth of September. The rest followed four days later.""",
          "Constitution (101st Amendment) Act, 2016 · assent 8 Sep 2016 · Art. 279A from 12 Sep, the rest from 16 Sep 2016",
          """A constitution book opens; a new page is stitched in with the date 8 SEP 2016; two calendar pins: 12 SEP and 16 SEP.""",
          ["E12-C01", "E12-C02"], "1"),
        T(2, "b04", "therefore",
          """The key new article is two hundred forty-six A. It gives both Parliament and the State legislatures the power to make GST laws.
          But when a supply crosses a State border, only Parliament can make the law.
          That inter-State tax is collected by the Centre and shared, under Article two hundred sixty-nine A.""",
          "Art. 246A: Parliament and States both legislate on GST · inter-State: Parliament only · Art. 269A: IGST collected and shared",
          """The two locked boxes open into one shared table drawer marked 246A; a truck crossing a State line drops its tax into a
          separate drawer marked 269A, which then splits in two.""",
          ["E12-C03", "E12-C04"], "2", "concurrent power"),
        T(2, "b05", "therefore",
          """The Constitution also defines GST. It is any tax on the supply of goods, services or both.
          The one exception is alcohol for drinking. And services are defined simply as anything other than goods.""",
          "Art. 366(12A): GST = tax on supply of goods, services or both, except alcoholic liquor for human consumption · 366(26A): services",
          """A dictionary page in the Constitution: GOODS AND SERVICES TAX, with one item set outside the frame: a generic bottle.""",
          ["E12-C11"], "2"),
        T(2, "b06", "therefore",
          """Old powers were cut back. The article for service tax was removed.
          The Centre's excise now covers only petrol, diesel, crude oil, natural gas, aviation fuel and tobacco products.""",
          "Art. 268A omitted · Union List entry 84: excise only on 5 petroleum goods and tobacco",
          """A list of old tax cards; most fade out; six cards remain under UNION EXCISE: five fuel icons and a tobacco leaf.""",
          ["E12-C13", "E12-C14"], "2"),
        T(3, "b07", "therefore",
          """Into GST went a long list. From the Centre, central excise, service tax and the extra customs duty on imports.
          From the States, VAT, central sales tax, luxury tax, entry tax and entertainment tax, among others.
          The Finance Ministry counts seventeen taxes and thirteen cesses in all.""",
          "CBIC: central excise, service tax, CVD... · State VAT, CST, luxury, entry, entertainment... · MoF: 17 taxes + 13 cesses",
          """Many small tax cards from two directions pour into one funnel labelled GST; a counter ticks to 17 TAXES + 13 CESSES.""",
          ["E12-F01", "E12-F02", "E12-F04"], "2"),
        T(4, "b08", "but",
          """But who sets the rates for this shared tax? Not Parliament alone, and not any one State.
          Article two hundred seventy-nine A creates the GST Council. The Union Finance Minister chairs it, with a Union Minister for revenue or finance.
          Every State sends its finance minister or a nominee.""",
          "Art. 279A: GST Council · Union Finance Minister (chair) · Union MoS (revenue or finance) · each State's minister",
          """Back to the long table from the opening; the UNION chair is labelled CHAIR; each State chair gets a blank name card.""",
          ["E12-C06"], "turn", "GST Council"),
        T(4, "b09", "therefore",
          """The Council recommends almost everything. Which taxes merge, which goods are taxed or exempt, the rates and the thresholds.
          It also decides the date petrol, diesel and three other fuels enter GST.
          And it must aim for a harmonised national market. NCERT's slogan is one nation, one tax, one market. The Constitution's words are harmonised structure and harmonised national market.""",
          "Art. 279A(4): what the Council recommends · 279A(5): date for 5 petroleum goods · 279A(6): 'harmonised national market'",
          """A recommendation sheet with ticked lines (TAXES SUBSUMED, EXEMPTIONS, RATES, THRESHOLD); a fuel nozzle with a blank date
          card; two banners side by side: NCERT'S SLOGAN and THE CONSTITUTION'S WORDS.""",
          ["E12-C07", "E12-C08", "E12-C09", "E12-K04"], "2"),
        T(4, "b10", "therefore",
          """Now your guess. Every decision needs three-fourths of the weighted votes of members present and voting.
          The Centre's vote counts as one-third. All the States together count as two-thirds.
          Our working: one-third alone is short of three-fourths. Two-thirds alone is short too.
          So neither the Centre nor all the States can decide without the other.""",
          "Art. 279A(9): 3/4 of weighted votes · Centre 1/3 · all States 2/3 · our working: neither alone reaches 3/4",
          """A vote meter filling: the Centre's block (one-third) stops short of the 3/4 line; the States' block (two-thirds) also stops
          short; only together do they cross it. The two question cards from the opening flip to NO and NO.""",
          ["E12-D01"], "2-3", note="Arithmetic labelled ours."),
        T(4, "b11", "therefore",
          """The design has more locks. Changing the Council article needs the States to ratify, not just Parliament.
          The Council must also set up a way to settle disputes between the Centre and the States.
          And the Act promised the States compensation for five years, for any revenue they lost. That story is part three.""",
          "Art. 368(2): 279A needs State ratification · 279A(11): dispute mechanism · s.18: 5 years of compensation",
          """Three padlocks on the Council's door: STATES MUST RATIFY, DISPUTE MECHANISM, 5-YEAR COMPENSATION (this one tagged PART 3).""",
          ["E12-C16", "E12-C10", "E12-C17"], "2"),
        T(4, "b12", "therefore",
          """GST began at midnight, as the first of July twenty seventeen began, in a special midnight session of Parliament.
          NCERT calls it the biggest tax reform since Independence.""",
          "rollout: midnight, 30 Jun / 1 Jul 2017 · NCERT: 'biggest tax reform since Independence'",
          """A clock striking twelve over a generic Parliament building (no emblem); a calendar page turns to 1 JULY 2017.""",
          ["E12-C19", "E12-K01"], "1"),
        T(5, "b13", "but",
          """But is the Council's word law? A case about shipping settled it.
          Importers were charged IGST on the ocean freight paid by the foreign seller to a shipping line.
          In twenty twenty-two, the Supreme Court struck that levy down.""",
          "Union of India v Mohit Minerals (19 May 2022): IGST on ocean freight in CIF imports struck down",
          """A cargo ship at sea; a tax tag on its freight is stamped STRUCK DOWN by a generic court building (no emblem).""",
          ["E12-D07"], "3"),
        T(5, "b14", "therefore",
          """On the way, the Court answered the bigger question. The Union argued the Council's recommendations must bind Parliament and the States, or there would be an impasse.
          The Court disagreed. It held the recommendations are persuasive, not binding.
          One reason: Parliament had dropped a proposed clause that would have given the Council more power.""",
          "Union: recommendations should bind (else an impasse) · Court: persuasive, not binding · Art. 279B proposal dropped",
          """Two papers on a desk: UNION'S ARGUMENT: BINDING and the Court's order: PERSUASIVE. A torn draft page marked 279B (DROPPED).""",
          ["E12-D05", "E12-D02", "E12-D03"], "3"),
        T(5, "b15", "but",
          """But the Court drew a line. When the Government makes rules under the GST Acts, it is bound by the Council's recommendations.
          Parliament and the State legislatures keep their own power to make laws.
          The Court described GST federalism as a dialogue, from collaboration to contestation, between equal law-makers.""",
          "Court: rule-making bound; legislation not · federalism as a dialogue between Union and States, equal power to legislate",
          """Two hands on one shared pen over a GST law page, neither hand above the other; a speech-bubble chain going back and forth.""",
          ["E12-D04", "E12-D06"], "5"),
        T(6, "b16", "therefore",
          """So who decides GST, Delhi or the States? Both, at one table, and neither alone.
          For the exam, write it this way. The hundred and first Amendment gave Parliament and the States a shared power under two hundred forty-six A.
          Inter-State supply is taxed by the Centre and shared, under two hundred sixty-nine A. The Council under two hundred seventy-nine A recommends, with a three-fourths weighted vote, Centre one-third, States two-thirds.
          Mohit Minerals held its recommendations persuasive, not binding. The Court called the relationship cooperative and collaborative federalism.""",
          "exam card: 101st Amendment · Art. 246A · 269A · 279A (3/4; 1/3 + 2/3) · Mohit Minerals (2022): persuasive · cooperative federalism",
          """The long table again, both sides' hands on the same document; the girl's notebook fills with the exam lines.""",
          ["E12-C03", "E12-C04", "E12-C06", "E12-D01", "E12-D02", "E12-D06"], "5"),
        T(6, "b17", "therefore",
          """Then came twenty twenty, and the promise of five years of compensation met a pandemic. That is part three.""",
          "next: compensation, COVID, rates and the Budget",
          "The three-stop path, the third stop glowing; a calendar page reading 2020.",
          ["E12-C17"], "handoff"),
    ],
    story=dict(
        promise="Who decides GST: the Centre, the States, or neither alone?",
        arc="mystery",
        loops=[
            dict(id="L1", kind="primary", q="Who decides GST: Delhi or the States?", open="b00", close="b16"),
            dict(id="M1", kind="micro", q="Can the Centre alone, or all States together, pass a Council decision?", open="b00", close="b10"),
            dict(id="L2", kind="secondary", q="Is the Council's word law?", open="b13", close="b15"),
        ],
        turn="b08",
        plants=[("b00", "b10"), ("b11", "b17"), ("b02", "b04")],
        critical=[
            dict(what="Art. 279A voting shares and the three-fourths rule", src="Constitution text (E12-D01)"),
            dict(what="Mohit Minerals' holding and reasons", src="Supreme Court's own copy (E12-D02 to D07)"),
            dict(what="17 taxes and 13 cesses", src="Ministry of Finance (E12-F04); one source only, say 'the Finance Ministry counts'"),
        ],
        fallback="If the vote puzzle failed review: open on the two locked boxes (b02) and the question why one tax needed the Constitution to change.",
        tier="broad",
    ),
)
