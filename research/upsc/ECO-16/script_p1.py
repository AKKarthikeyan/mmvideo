"""ECO-16 Part 1, draft 1 (4 Nov 2026): what money is, why people want it, what counts as money in India today, who supplies it.
Part 1 of 3 of "How banks create money" (Part 2: how banks create money and what limits it; Part 3: credit and payments).
Storytelling v2 (docs/STORYTELLING.md, mmvideo branch claude/keen-ride-f20uky) and the Gold Standard (docs/upsc/GOLD_STANDARD.md).
Same form as research/upsc/GEO-07/script_p2.py; check with scripts/upsc/script_tool.py. Numbers are words in `say` (years may be
digits), numerals in `cap`. `claims` are ids in this folder's claims.csv (audit of the research: AUDIT.md; the script itself is
not yet audited: gate S5)."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="ECO-16-P1",
    title="Only 13% of India's Money Is Cash. So What Is the Rest?",
    beats=[
        T(1, "b00", "",
          """Think of the last time you paid for fruit with your phone. No note changed hands. Yet money moved.
          Now add up the money in India using M3, which NCERT calls the most commonly used measure.
          In July 2026, only about thirteen percent of it was notes and coins.
          The rest was deposits, almost all of them in banks. So what is money, really? And who makes it?""",
          "Money (M3), 31 Jul 2026: cash with the public ≈ 13% · deposits ≈ 87% · RBI",
          """First second: a hand holds a phone over a fruit cart's QR code; a soft chime; no note changes hands. The phone's
          screen turns into a bar split in two: a thin slice of notes and coins, and a long band of bank balances.""",
          ["ECO16-A08", "ECO16-I02", "ECO16-N55"], "question"),
        T(1, "b01", "therefore",
          """This matters for the exam too. The syllabus for the Economics optional paper names the demand for money and the supply of money.
          So here is our plan. First, why people want money at all. Then what counts as money. Then who supplies it.
          This is part one of three. Part two asks where a bank's loan money comes from. Part three is about credit and payments.""",
          "plan: why we want money → what counts as money → who supplies it · Part 1 of 3",
          """A notebook page with three numbered boxes; a small three-part path drawn beneath: PART 1 (lit), PART 2, PART 3.""",
          ["ECO16-P01"], "stakes"),
        T(2, "b02", "therefore",
          """Start with a world without money. NCERT's example is a shoe-maker who wants wheat.
          Barter works only if the wheat farmer also wants to buy shoes.
          Economists call this a double coincidence of wants. What one person wants to sell must be exactly what the other wants to buy.
          That is hard to find. So the trade needs a go-between that both sides accept. That go-between is called money.""",
          "barter: needs a double coincidence of wants · money = a commonly accepted go-between · NCERT",
          """A shoe-maker and a wheat farmer face each other in an atlas-style market; the farmer shakes his head and points to a
          plough; a thought bubble of shoes crossed out. Then a coin appears between them and the line between them closes.""",
          ["ECO16-N01", "ECO16-N29"], "1", "double coincidence of wants",
          note="First small win, under 1:30: why do we need money at all? (STORYTELLING 3.7)."),
        T(2, "b03", "therefore",
          """Money does three jobs. The first is to be a medium of exchange.
          The shoe-maker sells his shoes for money. Then he buys wheat with that money.
          Neither needs to want what the other makes.""",
          "job 1: medium of exchange",
          """The shoe-maker hands over shoes, receives a coin; hands the coin to the farmer, receives wheat. The coin glows and
          travels along; a label slides in: MEDIUM OF EXCHANGE.""",
          ["ECO16-N01", "ECO16-N02"], "2", "medium of exchange"),
        T(2, "b04", "therefore",
          """The second job is to be a unit of account. Every price is stated in rupees.
          NCERT's example: a pen costs ten rupees and a pencil costs two.
          So one pen is worth five pencils. Prices in rupees let us compare any two goods.""",
          "job 2: unit of account · NCERT: pen ₹10, pencil ₹2 → 1 pen = 5 pencils",
          """A stationery shelf: a pen with a tag ₹10, a pencil with a tag ₹2; five pencils line up beside the pen on a
          balance. A label slides in: UNIT OF ACCOUNT.""",
          ["ECO16-N02"], "2", "unit of account"),
        T(2, "b05", "but",
          """The third job is to be a store of value. A rupee kept today should buy about as much later.
          But when prices rise, its purchasing power falls. That is what a rupee can buy.
          NCERT says that, to store value well, the value of money must be sufficiently stable.
          Gold, land and bonds can store value too. But they may not be easily converted, and they are not accepted everywhere.""",
          "job 3: store of value · prices rise → purchasing power falls · gold, land, bonds: may be harder to convert",
          """A jar of coins on a shelf; a shopping basket beside it shrinks year by year as price tags climb. Gold bar, a plot of
          land and a bond certificate stand to one side with a small padlock: SLOWER TO SPEND.""",
          ["ECO16-N03"], "3", "store of value"),
        T(3, "b06", "but",
          """So people want money. But money in a pocket earns nothing. How much of it do people hold?
          NCERT gives two forces. The more you spend, the more money you need at hand.
          So the demand for money rises with income.
          And when the interest rate rises, people hold less, because money in hand gives up that interest.""",
          "demand for money: rises with income · falls when the interest rate rises (NCERT 3.2.1)",
          """Two sliders on a desk. Slide INCOME up: a wallet grows fatter. Slide INTEREST RATE up: coins hop out of the wallet
          into a bank passbook. A label: DEMAND FOR MONEY.""",
          ["ECO16-N05"], "3", "demand for money"),
        T(3, "b07", "therefore",
          """In 1936, Keynes split this demand into three motives.
          The transactions motive: money for the week's shopping and bills. The precautionary motive: money kept for a bad day.
          The speculative motive: money held to profit from judging the future of interest rates better than the market.
          Keynes called the whole thing liquidity preference, and NCERT uses that name too.""",
          "Keynes (1936): 3 motives · transactions · precautionary · speculative → liquidity preference · jars: our picture",
          """Three jars on a table: SHOPPING (a basket), BAD DAY (an umbrella), WAITING (a bond certificate and a clock). One
          portrait plaque: KEYNES, 1936. A bracket over all three: LIQUIDITY PREFERENCE.""",
          ["ECO16-T14", "ECO16-N20"], "3", "liquidity preference",
          note="Syllabus item (Keynes' theory on demand for money). The jars are our own picture, labelled as such on screen."),
        T(3, "b08", "therefore",
          """The speculative motive needs one fact. A bond's price falls when interest rates rise.
          NCERT's worked bond is worth about one hundred and nine rupees at five percent. At six percent, it is worth only about one hundred and seven.
          When rates are very high, people expect them to fall. They buy bonds and hold little money.
          When rates are low, more people expect them to rise. They sell bonds and hold money.
          So speculative demand for money falls as the interest rate rises.""",
          "bond price falls as the interest rate rises · NCERT's bond: ₹109.29 at 5%, ₹107.33 at 6%",
          """A bond certificate on a seesaw against a rate dial. Dial up: the certificate sinks, a price tag ticks from 109.29
          to 107.33. A figure with a calculator sells it and tucks the money in a wallet.""",
          ["ECO16-N21"], "4",
          note="Rung 4: NCERT Box 3.1 worked example; kept short because it is optional-paper depth."),
        T(3, "b09", "but",
          """There is a limit to this. Suppose the interest rate is already so low that everyone expects it to rise.
          Then people simply hold on to money. Hand them more, and it just sits with them.
          The rate does not fall any further. NCERT calls this a liquidity trap.""",
          "liquidity trap: rate very low, everyone expects it to rise → extra money is just held · NCERT Box 3.1",
          """A tank of water labelled INTEREST RATE, the water at the floor. A pump pours money in; it pools in wallets
          and the water level does not move. A label: LIQUIDITY TRAP.""",
          ["ECO16-N22"], "4", "liquidity trap"),
        T(3, "b10", "therefore",
          """There is an older way to see the same idea. Ask how often one rupee is used.
          Here is a picture, our own. You pay a hundred-rupee note to the fruit seller. She pays it to the milkman. He pays it to the bus conductor.
          The number of times a unit of money changes hands in a period is called its velocity of circulation.
          NCERT writes the demand for money for payments as k times the value of transactions. It says velocity is one divided by k.""",
          "velocity of circulation = times a unit of money changes hands · NCERT: MdT = k·T · v = 1/k · picture: our own",
          """One note travels hand to hand along a street: fruit seller, milkman, bus conductor; a counter ticks 1, 2, 3 and
          a small tag says OUR PICTURE. A formula card slides in: v = 1/k.""",
          ["ECO16-N20"], "3", "velocity of circulation",
          note="Analogy labelled as ours; it stops being true where a note sits idle (velocity is an average)."),
        T(3, "b11", "therefore",
          """In 1911, Irving Fisher linked the money in circulation, bank deposits, the speed of each, and the volume of trade.
          IGNOU gives a simple form: money times its velocity equals the price level times the number of transactions.
          That is the equation of exchange. IGNOU's notes say that if trade is fixed and velocity steady, the price level follows the quantity of money.
          So in this classical quantity theory, double the money and prices double. If either assumption fails, the price level is unlikely to move in step with the money.""",
          "Fisher (1911): equation of exchange · simple form (IGNOU): M·V = P·T · T fixed, V steady → P follows M",
          """A balance scale: MONEY × SPEED on one pan, PRICES × TRADE on the other; both sides stay level as the left side doubles
          and the price tags double. A portrait plaque: FISHER, 1911. A small flag: ONLY IF TRADE AND SPEED STAY FIXED.""",
          ["ECO16-T10", "ECO16-T11", "ECO16-A13"], "4", "equation of exchange",
          note="Syllabus item: Quantity Theory of Money (Fisher). The deeper inflation side belongs to ECO-15."),
        T(3, "b12", "therefore",
          """Economists at Cambridge looked from the holder's side. Marshall, Pigou, Robertson and Keynes asked what share of income people choose to keep as money.
          They called that share k. It is the reciprocal of velocity.
          In 1950, Pigou wrote that it is a reasonable approximation to say this share falls when the interest rate rises. That is the demand for money we met earlier.""",
          "Cambridge k = share of income held as money = 1/V · Pigou (1950): the share falls as the interest rate rises",
          """A wallet beside a salary slip with a dial: k = 1/4 of income kept as cash. Four hands pass the note along: velocity.
          The dial shrinks as the interest-rate arrow climbs.""",
          ["ECO16-T12", "ECO16-T13"], "4", "Cambridge k"),
        T(3, "b13", "therefore",
          """Later, Milton Friedman restated it as a theory of the demand for money. IGNOU's notes say that for him, money is one asset among others.
          Bonds, shares, physical goods and human wealth are the others. He dropped Keynes's separate motives.
          Monetarists, who follow him, hold that velocity is fairly steady.""",
          "Friedman: money = one asset among others · no separate motives · monetarists: velocity fairly steady · per IGNOU",
          """A shelf of assets in a row: cash, bond, share, house, a tool kit; a hand chooses among them by weighing each. A
          label: MONEY IS ONE ASSET. A plaque: FRIEDMAN.""",
          ["ECO16-T15"], "4",
          note="Single-source (IGNOU) row: attribute it on screen (dossier E5). Friedman's 1956 essay not opened."),
        T(4, "b14", "therefore",
          """Now the supply side. Start with what you can touch. Only the Reserve Bank may issue banknotes in India.
          That is section twenty-two of the RBI Act. Coins come from the Government of India, under the Coinage Act of 2011.""",
          "banknotes: RBI alone (RBI Act s.22) · coins: Government of India (Coinage Act 2011)",
          """A printing press behind a glass wall, a note emerging with the RBI mark; beside it a mint stamping a coin with the
          national emblem. Two labels: NOTES: RBI. COINS: GOVERNMENT OF INDIA.""",
          ["ECO16-R11", "ECO16-N23"], "3"),
        T(4, "b15", "but",
          """Why do we accept a piece of paper? It has no value of its own. Its value comes from the issuer's guarantee.
          NCERT calls this fiat money.
          Each note says, I promise to pay the bearer. Those words record the Reserve Bank's own obligation to whoever holds the note.""",
          "fiat money: value from the issuer's guarantee · 'I promise to pay the bearer' = RBI's obligation (RBI Act s.26)",
          """A note close up, the promise clause glowing; the glow follows a hand-off from person to person and back to an RBI
          building. A tag: FIAT MONEY.""",
          ["ECO16-N24", "ECO16-R12"], "3", "fiat money"),
        T(4, "b16", "therefore",
          """Section twenty-six goes further. Every banknote still in circulation is legal tender anywhere in India, guaranteed by the Central Government.
          Legal tender means it cannot be refused when it is offered in payment.
          Remember that line. It will matter in a minute.""",
          "legal tender: cannot be refused · every banknote in circulation, anywhere in India (RBI Act s.26)",
          """A shopkeeper tries to push a note back; a gentle red hand-stop appears over his palm; a label: LEGAL TENDER. A
          small question mark floats at the edge (plant: the cheque).""",
          ["ECO16-R11", "ECO16-N24"], "3", "legal tender",
          note="Plant for b13: the cheque can be refused."),
        T(5, "b17", "but",
          """But notes are not the whole story. Money in a bank account that you can take out on demand is money too.
          NCERT's Class 10 book says modern money is currency plus deposits. Why?
          You can pay with it by cheque, a written order to the bank. Such deposits are called demand deposits because they are payable on demand.
          Here is the catch. A cheque can be refused. So a demand deposit is money, but it is not legal tender.""",
          "modern money = currency + deposits · demand deposits: withdraw any time, pay by cheque · not legal tender",
          """A customer writes a cheque; the money rises out of one account bar into another; the shopkeeper nods but his hand
          can wave it away. A badge flips: DEPOSIT = MONEY, NOT LEGAL TENDER.""",
          ["ECO16-N30", "ECO16-N31", "ECO16-N24"], "3", "demand deposit",
          note="Pays the plant of b12 and the misconception 'a cheque is money like a note' (dossier A2)."),
        T(5, "b18", "therefore",
          """How do we count it all? NCERT lists four measures of money that the Reserve Bank has published.
          M1 is cash with the public plus demand deposits. M3 adds time deposits, such as fixed deposits, which have a fixed period to maturity.
          M2 and M4 add post office deposits. M1 and M2 are narrow money. M3 and M4 are broad money.
          NCERT calls M3 the most commonly used measure.""",
          "NCERT: M1 = cash + demand deposits · M3 = M1 + time deposits · M2, M4 add post-office deposits · M3 most commonly used",
          """M1 as a base block (cash + demand deposits) with two branches rising from it: M2 (adds post office savings) and M3 (adds
          time deposits); M4 sits above M3 (adds post office deposits). A bracket over M1-M2: NARROW. Over M3-M4: BROAD. M3 glows.""",
          ["ECO16-N25", "ECO16-R08", "ECO16-N23"], "3", "broad money",
          note="NCERT's definitions. RBI's own table also adds a small 'other deposits with RBI' (R08); not narrated."),
        T(5, "b19", "therefore",
          """Now we can answer the opening question. On the thirty-first of July 2026, M3, a broad measure of money, split as follows.
          About thirteen percent was cash with the public. About eleven percent was in demand deposits, such as savings and current accounts.
          About seventy-five and a half percent was in time deposits, such as fixed deposits. The last sliver, under half a percent, was other deposits with the Reserve Bank.
          So cash and demand deposits together, NCERT's M1, are only about a quarter of it.""",
          "M3, 31 Jul 2026 · cash ≈ 13% · demand deposits ≈ 11% · time deposits ≈ 75.5% · other RBI deposits ≈ 0.4% · cash + demand ≈ ¼ · RBI",
          """A single tall bar standing on a table fills in three bands: a ribbon of notes (about 13%), a slightly thinner band of
          demand deposits, a huge block of time deposits and a hairline of other RBI deposits. A bracket over the bottom two: ABOUT A QUARTER.""",
          ["ECO16-A08", "ECO16-A12", "ECO16-I02"], "3",
          note="The turn: the plant of b00 pays. Figures are RBI's (Weekly Statistical Supplement, 21 Aug 2026), shares our arithmetic (A12)."),
        T(6, "b20", "but",
          """Cash is small, but it matters. NCERT calls the currency issued by the central bank high-powered money.
          Held by the public or by banks, it acts as a basis for credit creation. India's central bank, the Reserve Bank, was set up in 1935.
          The public holds only about fifteen paise of cash for every rupee in deposits.
          But deposits are most of the money. So how does credit creation work?""",
          "high-powered money (NCERT): currency issued by the central bank · RBI: 1935 · cash ≈ 15 paise per ₹1 of deposits (31 Jul 2026)",
          """A small stone base with a glowing label RESERVE MONEY; a tall tower of deposits rises from it, held up by faint
          beams. A question mark pulses at the tower's foot.""",
          ["ECO16-N07", "ECO16-A09"], "3", "high-powered money"),
        T(6, "b21", "therefore",
          """For the exam, write it this way. Money does three jobs: medium of exchange, unit of account and store of value.
          The demand for money rises with income and falls as the interest rate rises.
          Keynes gave three motives: transactions, precaution and speculation.
          The money supply is currency plus deposits. Notes come from the Reserve Bank and coins from the Government.
          Both are legal tender, coins up to set limits. A cheque is not. NCERT calls M3 the most commonly used measure. In July 2026, about thirteen percent of it was cash with the public.""",
          "Money: medium of exchange · unit of account · store of value · supply = currency + deposits · notes: RBI, coins: Government · M3 most used (NCERT)",
          """The notebook page fills line by line in handwriting; the key terms turn gold as the narration reaches them; the
          last line is the 13% figure with its source.""",
          ["ECO16-N02", "ECO16-N05", "ECO16-T14", "ECO16-N23", "ECO16-N24", "ECO16-N25", "ECO16-A08"], "5"),
        T(6, "b22", "therefore",
          """So next time you tap your phone at a fruit cart, remember what moved. Not a note. A balance moving from one bank account to another.
          But where did that deposit come from? In part two: when a bank gives you a loan, where does the money come from?
          And what stops it from lending more?""",
          "Part 2: where does a bank's loan money come from? · what limits it?",
          """The phone tap again; the deposit bar glides from one account to another; the bar's base shows a faint seam that
          opens, a new block growing out of nowhere. A frame: PART 2.""",
          ["ECO16-N55"], "handoff",
          note="Loop back to b00. Teases Part 2: NCERT 3.3 (a loan opens a new deposit, ECO16-N11) is not narrated here."),
    ],
    story=dict(
        promise="Only 13% of India's money is cash: what is the rest, what counts as money, and who makes it?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="What counts as money in India, and who supplies it?", open="b00", close="b21"),
            dict(id="L2", kind="secondary", q="If notes are only 13%, what is the rest?", open="b00", close="b19"),
            dict(id="M1", kind="micro", q="Why do we need money at all?", open="b02", close="b04"),
            dict(id="M2", kind="micro", q="How much money do people hold?", open="b06", close="b09"),
            dict(id="M3", kind="micro", q="How often is a rupee used, and what does that do to prices?", open="b10", close="b13"),
            dict(id="M4", kind="micro", q="Who may issue notes and coins?", open="b14", close="b16"),
            dict(id="L3", kind="tertiary", q="Is a bank deposit money too, if a cheque can be refused?", open="b16", close="b17"),
        ],
        turn="b19",
        plants=[("b00", "b21"), ("b16", "b17")],
        critical=[
            dict(what="The split of broad money into cash and deposits", src="RBI Weekly Statistical Supplement, 21 Aug 2026, Table 6 (ECO16-I02, A08, A12)"),
            dict(what="Who issues notes and what legal tender means", src="RBI Act 1934 ss.22, 26 via RBI FAQ on Indian Currency (ECO16-R11, R12)"),
            dict(what="Why a deposit is money", src="NCERT Class 10 Money and Credit; Class 12 ch.3 (ECO16-N24, N31)"),
        ],
        fallback="If the July 2026 split failed review: what does 'money' include besides notes and coins?",
        tier="broad",
    ),
)
