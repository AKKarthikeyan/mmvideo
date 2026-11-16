"""ECO-12 Part 1, draft 1 (11 Nov 2026): Who really pays a tax? Part 1 of 3: what a tax is, direct and indirect, impact and incidence,
progressive and regressive, subsidies, the old cascade (the pen), and how GST's credit chain and destination principle work.
Part 2 is GST in the Constitution (101st Amendment, Council, Mohit Minerals); Part 3 is the money (compensation, rates, Budget).
Storytelling v2 and the Gold Standard. Check with scripts/upsc/script_tool.py. Numbers are words in `say`, numerals in `cap`.
A10 is a CONFLICT (NCERT's reason for 'regressive'): narrated with NCERT named and our reasoning labelled as ours.
K02's basket uses NCERT's old rates and is labelled so; no item's rate today is named (dossier open item 11)."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="ECO-12-P1",
    title="Who Really Pays a Tax? GST and the Rest, Part 1",
    beats=[
        T(1, "b00", "",
          """Your bill says GST. The shop collects it and the shop sends it to the government.
          So the shopkeeper pays GST out of his own pocket. True or false?""",
          "Spot the mistake: 'the shopkeeper pays GST out of his own pocket'",
          """First second: a shop counter, a printed bill sliding out with a GST line circled in red. A question card: TRUE OR FALSE?
          A generic shopkeeper behind the counter, a generic customer in front; no brand names.""",
          ["E12-K05"], "question"),
        T(1, "b01", "but",
          """The law and your wallet give two different answers. This is the puzzle of who really pays a tax.
          This part is the economics. Part two is how the Constitution made GST possible. Part three is the money.""",
          "who pays by law vs who bears the burden · Part 1 of 3",
          """A three-stop path; the first stop lit. Two arrows from the bill: one to a government building (LAW), one to a wallet (BURDEN).""",
          ["E12-A05", "E12-A06"], "stakes"),
        T(2, "b02", "therefore",
          """Start with what a tax is. NCERT calls it a compulsory payment to the government. It pays for schools, hospitals, roads and defence.
          And Article two hundred sixty-five says no tax can be collected except by authority of law.""",
          "NCERT: a compulsory payment for public services · Art. 265: no tax without law",
          """Coins flow from many hands into a public treasury, then out to a school, a hospital, a road and a soldier's post.
          A law book stamps the flow: ART. 265.""",
          ["E12-A01", "E12-B02"], "1"),
        T(2, "b02b", "therefore",
          """Why does a government tax at all? NCERT gives the Budget three jobs.
          Allocation pays for things the market will not supply, like street lights. Redistribution moves income through taxes and transfers.
          Stabilisation steadies the economy when demand rises or falls too fast.""",
          "NCERT: the Budget's three jobs · allocation · redistribution · stabilisation",
          """Three jars on a desk labelled ALLOCATION (a street light), REDISTRIBUTION (coins moving from a big pile to a small one),
          STABILISATION (a see-saw being steadied).""",
          ["E12-B03", "E12-B09"], "1"),
        T(2, "b03", "therefore",
          """Taxes come in two families. A direct tax is paid on your income or profits, like income tax.
          An indirect tax is added to the price of goods and services, like GST.""",
          "direct: on income or profits (income tax) · indirect: added to the price (GST)",
          """Two doors: DIRECT, where a salary slip goes in; INDIRECT, where a price tag goes in.""",
          ["E12-A02", "E12-A07"], "1", "direct tax"),
        T(2, "b04", "but",
          """But that line hides the real question. Economists separate impact from incidence.
          Impact is who hands the tax to the government. Incidence is who finally bears it.
          For a direct tax they are the same person. For an indirect tax they can be different people.""",
          "IGNOU: impact = who pays the government · incidence = who bears the burden",
          """The bill from the opening splits into two labels: IMPACT points at the shopkeeper, INCIDENCE at the customer's wallet.""",
          ["E12-A03"], "2", "incidence"),
        T(2, "b05", "therefore",
          """So back to the shop. The CGST Act makes the supplier the legal payer. The tax shall be paid by the taxable person.
          But CBIC, the tax department, says the burden is borne by the final consumer.
          So the answer is false. The shop pays by law. You bear it in the price.""",
          "CGST Act: the supplier pays · CBIC: the final consumer bears it · answer: false",
          """The TRUE OR FALSE card flips to FALSE. The shopkeeper hands an envelope to a government window; the same amount shows on
          the customer's price tag.""",
          ["E12-A05", "E12-A06", "E12-K05"], "2-3"),
        T(3, "b06", "but",
          """But can the shop always pass on the whole tax? Not always.
          IGNOU shows that when a tax pushes the price up, buyers buy a little less.
          So the price may rise by less than the tax, and the seller bears the rest.
          How the burden splits depends on how easily buyers and sellers can walk away.""",
          "IGNOU: the burden is shared; the split depends on elasticity of demand and supply",
          """A supply-demand diagram drawn on a notebook: a tax wedge between two curves; the price rises by less than the wedge;
          the wedge is coloured in two parts, BUYER and SELLER.""",
          ["E12-A04", "E12-A03"], "3", "elasticity"),
        T(3, "b07", "therefore",
          """Taxes also differ by who carries more of the weight. A progressive tax takes a higher rate as income rises.
          A proportional tax takes the same rate. A regressive tax takes a falling rate as income rises.
          India's personal income tax is progressive. People below a limit pay nothing.""",
          "IGNOU: progressive · proportional · regressive · NCERT: income tax is progressive",
          """Three staircases: one rising, one flat, one falling, each with a small figure climbing it.""",
          ["E12-A09", "E12-A11", "E12-A08"], "2", "progressive tax"),
        T(3, "b08", "but",
          """But what about GST? NCERT calls indirect taxes regressive, because they hit all income groups equally.
          IGNOU also calls them regressive.
          Here is our reading. The same tax in rupees is a bigger share of a smaller income.
          A poorer family spends more of what it earns on taxed goods.""",
          "NCERT and IGNOU: indirect taxes are regressive · our reading: same rupees, bigger share of a smaller income",
          """Two family budgets as two jars, one small and one large; the same coin of tax drops into each. In the small jar it
          fills a much bigger slice. A label: OUR READING.""",
          ["E12-A10"], "3", note="A10 is CONFLICT: NCERT's reason ('equally') is named as NCERT's; the share-of-income reason is labelled ours."),
        T(3, "b09", "therefore",
          """Money flows the other way too. A subsidy is the State paying part of your price.
          NCERT says some are open, on food or fertiliser. Others are hidden, when a public school or hospital charges less than it costs.
          In the twenty twenty-six to twenty-seven Budget, major subsidies take six paise of every rupee the Union spends.""",
          "NCERT: explicit and implicit subsidies · Budget 2026-27: major subsidies 6 paise of every rupee spent",
          """A price tag with a slice cut away and paid by a government hand; a rupee coin cut into slices, 6 paise highlighted.""",
          ["E12-B06", "E12-B08"], "2", "subsidy"),
        T(4, "b10", "therefore",
          """Now the old problem that GST was built to fix. Follow one pen, using the GST Council's own example.
          The maker's inputs cost ten rupees and carry one rupee of excise.
          The pen sells for twenty rupees plus two rupees of excise. That is twenty-two.""",
          "GST Council example: inputs ₹10 + ₹1 excise · pen ₹20 + ₹2 excise = ₹22",
          """A pen on a factory desk; its parts arrive with a small tag 'Rs 1'; the finished pen gets a tag 'Rs 20 + Rs 2 = Rs 22'.""",
          ["E12-E03"], "1"),
        T(4, "b11", "but",
          """But then the State's VAT was charged on the whole twenty-two rupees. That includes the two rupees of central tax.
          So a tax was charged on a tax. NCERT calls this cascading.
          Before GST, input tax was given little credit, so it was taxed again further down the chain.""",
          "GST Council: VAT on all ₹22 · NCERT: cascading, tax on tax",
          """The Rs 22 tag gets a second tag stacked on top of it, VAT; the stack wobbles like a tower of boxes, labelled TAX ON TAX.""",
          ["E12-E03", "E12-E02"], "2", "cascading"),
        T(4, "b12", "therefore",
          """GST fixes this with a credit chain. Tax is paid at every stage, but each seller gets credit for the tax already paid before.
          So only the value added at each stage is taxed. That is why GST is called a value-added tax.""",
          "NCERT, CBIC: tax at every stage, credit for earlier tax · only value addition taxed",
          """A chain of hands from factory to wholesaler to shop to customer; at each link a small coin passes and a receipt for the
          earlier coin is handed back as credit. The wobbly tower collapses into one neat tag.""",
          ["E12-E01", "E12-E02", "E12-A06"], "2", "input tax credit"),
        T(4, "b13", "therefore",
          """GST is also a destination tax. The revenue goes to the place where the goods are consumed, not where they are made.
          So it is split two ways. Inside a State, the Centre levies CGST and the State levies SGST. That is why one bill can show two taxes.
          Across States, the Centre levies IGST and shares it.""",
          "CBIC: destination principle · within a State: CGST + SGST · between States: IGST, shared",
          """A map of India in plain outline: a truck moves within one State and the bill shows CGST + SGST; a second truck crosses a
          State line and the bill shows IGST. No disputed borders drawn.""",
          ["E12-E09", "E12-E04"], "2", "destination principle"),
        T(5, "b14", "but",
          """But not everything is inside GST. Alcohol for drinking is outside by the Constitution's own definition. Electricity is outside.
          And five petroleum products, including petrol and diesel, wait for the GST Council to set a date.""",
          "outside GST: alcohol (by definition) · electricity · 5 petroleum products until the Council decides",
          """Three items behind a glass panel marked NOT IN GST: a bottle, a power line, a fuel nozzle with a calendar tag 'COUNCIL TO DECIDE'.""",
          ["E12-E07"], "2"),
        T(5, "b15", "therefore",
          """Here is a game from NCERT's own statistics book. A family spends on five groups of goods at five GST rates.
          What is its average GST rate? NCERT works it out as a weighted mean, about nine point six six per cent.
          Those were the old rates. The point is the method. The more you spend at a rate, the more it counts.""",
          "NCERT Class XI Statistics: weighted mean GST rate 9.66% (old rates) · weight = what you spend",
          """Five shopping bags of different sizes, each with a rate tag; a see-saw balances them and points to 9.66%. A small stamp:
          OLD RATES, NCERT EXAMPLE.""",
          ["E12-K02"], "3", note="Old rates, labelled; no current item rate named."),
        T(6, "b16", "therefore",
          """So who really pays a tax? By law, the shop pays GST to the government. In the price, you bear it.
          And how much the shop can pass on depends on how buyers and sellers respond.
          For the exam, write it this way. Separate impact from incidence. Direct taxes land where they fall; indirect taxes shift.
          Indirect taxes are called regressive. Cascading was tax on tax, and GST's credit chain taxes only value added, at the destination.""",
          "exam card: impact vs incidence · direct vs indirect · progressive and regressive · cascading · credit chain · destination",
          """The bill from the opening, now annotated; the girl's notebook fills with the exam lines; the three-stop path, first stop done.""",
          ["E12-A03", "E12-A05", "E12-A06", "E12-A04", "E12-A10", "E12-E02", "E12-E01", "E12-E09"], "5"),
        T(6, "b17", "therefore",
          """But one tax shared by the Centre and every State needed the Constitution itself to change. That is part two.""",
          "next: the 101st Amendment and the GST Council",
          "The three-stop path, the second stop glowing; a constitution book opening.",
          ["E12-C01"], "handoff"),
    ],
    story=dict(
        promise="Does the shop really pay the GST on your bill, or do you?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="Who really pays a tax: the shop or the buyer?", open="b00", close="b16"),
            dict(id="M1", kind="micro", q="True or false: the shopkeeper pays GST from his own pocket?", open="b00", close="b05"),
            dict(id="L2", kind="secondary", q="Can the shop always pass on the whole tax?", open="b06", close="b06"),
            dict(id="M2", kind="micro", q="Why did a pen cost more tax than it should?", open="b10", close="b12"),
        ],
        turn="b04",
        plants=[("b00", "b05"), ("b04", "b16"), ("b10", "b12")],
        critical=[
            dict(what="CGST Act legal payer and CBIC's burden statement", src="E12-A05, A06"),
            dict(what="The pen example", src="GST Council flyer (E12-E03)"),
            dict(what="Budget 2026-27 subsidy share", src="Budget at a Glance (E12-B08)"),
        ],
        fallback="If the pen example failed review: show cascading from NCERT's own text (E02) with a plain three-stage chain and no figures.",
        tier="broad",
    ),
)
