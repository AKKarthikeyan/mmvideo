"""ECO-16 Part 3, draft 1 (6 Nov 2026): credit in daily life (who gets a loan, at what price, who is left out) and how money moves.
Part 3 of 3 of "How banks create money" (Part 1: what money is; Part 2: how banks create money and what limits it).
Storytelling v2 (docs/STORYTELLING.md, mmvideo branch claude/keen-ride-f20uky) and the Gold Standard (docs/upsc/GOLD_STANDARD.md).
Same form as script_p1.py and script_p2.py; check with scripts/upsc/script_tool.py. Numbers are words in `say` (years may be
digits), numerals in `cap`. `claims` are ids in this folder's claims.csv (audit of the research: AUDIT.md; the script itself is
not yet audited: gate S5). Lessons from the Part 1 and Part 2 audits are applied: attribute each statement to its source in the
voice, keep NCERT's hedges, date living figures, and mark our own arithmetic and reasoning."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="ECO-16-P3",
    title="Who Gets a Loan? And How Does Your Money Move?",
    beats=[
        T(1, "b00", "",
          """Two people borrow money to make something grow. Salim makes shoes. He borrows to fill a big order.
          He delivers it, makes a good profit, and repays the loan.
          Swapna is a small farmer. She borrows to grow groundnut. The crop fails, and she has to sell part of her land.
          Same tool, opposite results. So what decides whether credit helps or traps?""",
          "NCERT Class 10: Salim (shoes, festival order) · Swapna (groundnut, crop fails) · same tool, opposite results",
          """Split frame: left, Salim's small workshop with stacked shoe boxes and a trader's van; right, Swapna's three-acre field with
          wilted groundnut plants and a moneylender's ledger; a line joins them: CREDIT, with a question mark.""",
          ["ECO16-N33"], "question"),
        T(1, "b01", "therefore",
          """In part one we saw what money is. In part two, how banks create it.
          Now we ask who gets it, at what price, and how it moves from one hand to another.
          We take it in four steps. What credit is, and what it costs. Who lends: banks or moneylenders. Groups that lend to the poor.
          And how payments move, from a cheque to a phone tap.
          We end with a Prelims question from 2024. This is part three of three.""",
          "1 credit and its terms · 2 formal and informal lenders · 3 groups for the poor · 4 how payments move · a 2024 Prelims question · Part 3 of 3",
          """A notebook page with four numbered boxes; a three-part path beneath: PART 1 and PART 2 (done), PART 3 (lit).""",
          [], "stakes"),
        T(2, "b02", "therefore",
          """NCERT defines credit, or a loan, as an agreement. The lender supplies money, goods or services.
          The borrower promises to pay later.
          Every loan has terms of credit. The interest rate. The documents needed. The mode of repayment.
          And collateral: an asset that the lender may sell if the loan is not repaid.""",
          "credit = lender supplies money, goods or services · borrower promises to pay later (NCERT) · terms of credit: interest rate · collateral · documentation · mode of repayment",
          """A loan agreement on a desk: four stamped boxes light in turn: INTEREST RATE, DOCUMENTS, REPAYMENT, COLLATERAL (a small house
          and a tractor sit beside the last, with a padlock).""",
          ["ECO16-N33", "ECO16-N34"], "2", "terms of credit",
          note="First small win, under 1:30: what is credit and what does it cost? (STORYTELLING 3.7)."),
        T(2, "b03", "therefore",
          """Now go back to Swapna. Repaying her loan depended on one thing: income from her farm.
          When the crop failed, she could not repay, and the debt grew. NCERT calls this a debt trap.
          Credit pushed her into a situation from which recovery is very painful.
          NCERT says whether credit helps depends on the risks, and on whether there is some support in case of loss.""",
          "debt trap = credit pushes the borrower into a situation from which recovery is painful · helps or traps depends on risk and on support if things go wrong (NCERT)",
          """Swapna's field in two seasons: a thin harvest with a moneylender at the gate; a small safety net stretched under the field
          in the second panel; a balance tips from RISK to SUPPORT.""",
          ["ECO16-N33"], "3", "debt trap",
          note="Pays the hook's question in NCERT's words: risk, and support if things go wrong."),
        T(3, "b04", "therefore",
          """Where do people borrow? NCERT sorts lenders into two kinds.
          Formal lenders are banks and cooperatives. Informal lenders are moneylenders, landlords, relatives and friends.
          A government survey, with debt counted on the thirtieth of June 2018, gives the split.
          In rural India, formal lenders held sixty-six percent of cash debt, and informal lenders thirty-four. In urban India, eighty-seven and thirteen.""",
          "formal / informal share of outstanding cash debt · rural 66 / 34 · urban 87 / 13 · NSS 77th round (debt as on 30 Jun 2018)",
          """Two long bars, RURAL and URBAN, each split into FORMAL (banks, cooperatives) and INFORMAL (moneylenders, landlords, relatives)
          in the table's proportions; small icons for each lender kind.""",
          ["ECO16-I10", "ECO16-N35"], "3", "formal and informal credit"),
        T(3, "b05", "but",
          """Here is an exam trap. NCERT's text says formal lenders meet only about half of rural credit needs.
          But NCERT's own graph shows formal lenders at sixty-six percent.
          Trust the graph, and say where it comes from.""",
          "NCERT text: formal sector meets 'only about half' · NCERT Graph 1: formal 51 + 10 + 5 = 66% · exam trap",
          """A textbook page card with the sentence underlined in red; beside it a graph card with three formal slices adding to 66;
          a notebook tag: TRUST THE GRAPH.""",
          ["ECO16-N37", "ECO16-N35"], "4",
          note="CORRECTED row N37: both NCERT passages are cited; the graph wins."),
        T(3, "b06", "therefore",
          """Formal and informal lenders also differ in who watches them.
          NCERT says the Reserve Bank supervises formal lenders. It checks that banks keep the minimum cash balance.
          Banks report how much they lend, to whom, and at what interest rate. Nobody supervises informal lenders.""",
          "RBI supervises formal lenders: minimum cash balance · banks report how much, to whom, at what rate · informal lenders: no supervisor (NCERT)",
          """A bank counter with a clipboard-holding RBI inspector's chair, banks' reports in a tray; beside it a moneylender's table with
          a handwritten ledger and an empty chair.""",
          ["ECO16-N36"], "3"),
        T(3, "b07", "but",
          """NCERT's summary adds a hard fact. Richer households get most of the formal credit.
          And formal credit must expand to reach the poor.
          Why is that hard? A bank asks for collateral. NCERT's next example shows one way around it.""",
          "NCERT: richer households get most formal credit · formal credit must expand and reach the poor",
          """A ladder against a bank counter: the top rungs crowded, the lowest rung empty with a padlock marked COLLATERAL; a faint
          shadow of a group of people approaches.""",
          ["ECO16-N41", "ECO16-N34"], "4",
          note="'A bank asks for collateral' is NCERT's definition of the terms of credit; the claim 'the poor often lack collateral' is not narrated as fact."),
        T(4, "b08", "therefore",
          """A self-help group has fifteen to twenty members. Each saves a small amount regularly, from twenty-five rupees to a hundred or more.
          After a year or two of regular saving, the group can get a bank loan in the group's name.
          So no member has to offer collateral alone.
          On the thirty-first of March 2024, NABARD counted about one hundred and forty-four lakh groups with savings linked to banks.
          About seventy-seven lakh were also linked to bank credit.""",
          "self-help group: 15–20 members · saves ₹25–₹100 or more each · after a year or two, a bank loan in the group's name (NCERT) · NABARD, 31 Mar 2024: ~144 lakh groups savings-linked · ~77 lakh credit-linked",
          """A circle of women and men on a floor mat with a savings box and a passbook; coins drop in; a bank officer opens a file marked
          GROUP LOAN; a counter shows the NABARD figures at the end.""",
          ["ECO16-N39", "ECO16-I11"], "3", "self-help group"),
        T(4, "b09", "therefore",
          """The idea travelled. In 2006, Muhammad Yunus and Bangladesh's Grameen Bank shared the Nobel Peace Prize.
          The Nobel Committee said they created economic and social development from below.
          In the presentation speech, over ninety-five percent of Grameen Bank's borrowers were women.""",
          "Nobel Peace Prize 2006: Muhammad Yunus and Grameen Bank · 'economic and social development from below' · Nobel presentation speech: over 95% of borrowers women",
          """A prize medal plaque: NOBEL PEACE PRIZE 2006, YUNUS AND GRAMEEN BANK (name plaque, no faces); a village group at a table in
          the background.""",
          ["ECO16-S01", "ECO16-S02"], "3",
          note="Only the 2006 award and the microcredit idea (dossier A5): no later politics."),
        T(4, "b10", "therefore",
          """Access also starts with an account. The Pradhan Mantri Jan Dhan Yojana had fifty-nine point oh nine crore accounts on the nineteenth of August 2026.
          Women held fifty-five point seven percent of them.
          And seventy-seven point eight percent were in rural and semi-urban areas.
          Those are the Ministry's figures.""",
          "PMJDY, 19 Aug 2026: 59.09 crore accounts · 55.7% held by women · 77.8% rural and semi-urban · the Ministry's figures",
          """A row of passbooks growing into a wall; three simple split bars: a share held by women, a share rural and semi-urban; no
          flags, no leaders.""",
          ["ECO16-I06"], "3"),
        T(5, "b11", "therefore",
          """Other institutions help too. Post offices run savings schemes, such as National Savings Certificates and Kisan Vikas Patra.
          NABARD funds banks that lend for farming, village industries and rural infrastructure.
          And the Reserve Bank is the banker to banks.""",
          "post offices: savings schemes (NSC, KVP) · NABARD funds banks that lend for farming, village industries, rural infrastructure · RBI: banker to banks (NCERT Class 7)",
          """Three small buildings in a row: a post office with a savings certificate in the window; NABARD with a field and a village
          tile; the RBI with a line of banks' doors leading to it.""",
          ["ECO16-N49", "ECO16-N50"], "3"),
        T(5, "b12", "therefore",
          """And a bank gives you three kinds of account. A savings account pays interest, with limited withdrawals.
          A current account is for businesses, and pays no interest. A fixed deposit holds your money for a fixed period, usually at higher interest.
          NCERT's compounding example: one thousand rupees at six percent a year grows for twelve years. It becomes two thousand and twelve rupees and twenty paise.""",
          "savings · current · fixed deposit (NCERT Class 7) · compounding: ₹1,000 at 6% a year → ₹2,012.20 after 12 years",
          """Three passbooks fan out, SAVINGS, CURRENT, FIXED; beside them a seedling of coins grows year by year, a counter ticking
          to 12.""",
          ["ECO16-N44", "ECO16-N45", "ECO16-A01"], "3"),
        T(6, "b13", "but",
          """Now, how money moves. To get cash, you use a withdrawal slip, or an ATM with a debit card and a PIN.
          To move money between accounts, you can write a cheque. It is paper, and it takes time.
          Or you pay electronically: a debit card at a shop machine, net banking, or a mobile payment.""",
          "cash: withdrawal slip or ATM (debit card + PIN) · between accounts: cheque (paper, takes time) · electronic: debit card at a PoS machine, net banking, mobile payment (NCERT Class 7)",
          """A counter with a slip and notes; an ATM; a cheque on a clipboard with a clock beside it; a PoS machine and a phone with a QR code,
          each lighting in turn.""",
          ["ECO16-N51"], "3"),
        T(6, "b14", "therefore",
          """NCERT describes UPI, the Unified Payments Interface. The National Payments Corporation of India launched it in 2016.
          It moves money between bank accounts using a QR code or a phone number.
          The steps: the payer's app, the payer's bank, then the Corporation, which checks the UPI PIN and processes the payment.
          Last comes the receiver's bank.""",
          "UPI: launched 2016 by NPCI · QR code or phone number · payer's app → payer's bank → NPCI (checks UPI PIN, processes) → payee's bank (NCERT Class 7)",
          """A four-box chain of icons with a flowing coin: PAYER'S APP, PAYER'S BANK, NPCI (a lock for the PIN check), PAYEE'S BANK;
          a phone with a QR scan at the left.""",
          ["ECO16-N52"], "3", "UPI",
          note="NPCI's own site was not readable (ledger U04): UPI facts stay 'NCERT says'."),
        T(6, "b15", "therefore",
          """How big is it? In June 2026, UPI handled about two thousand, two hundred and seventy crore payments.
          The average payment was about one thousand, two hundred and seventy-three rupees.
          In the same month, UPI payments outnumbered cheques about five hundred and thirty-four to one. The cheques are those cleared through the Cheque Truncation System.
          RTGS handled about three crore payments, and the average was about seventy-two lakh rupees.""",
          "June 2026: UPI ≈ 2,272 crore payments · average ≈ ₹1,273 · UPI : cheques cleared (CTS) ≈ 534 : 1 · RTGS ≈ 3.2 crore payments · average ≈ ₹72 lakh · our arithmetic from the published figures",
          """Three horizontal strips on a log-style scale: a vast UPI strip of tiny coins; a thin CHEQUE strip; an RTGS strip of few very
          large blocks; a ratio badge 534 : 1.""",
          ["ECO16-I07", "ECO16-I09", "ECO16-A10"], "4",
          note="Figures are published (I07, I09); the 534:1 and the averages are our arithmetic (A10): the voice says 'about'."),
        T(6, "b16", "therefore",
          """With so many payments, there is fraud. NCERT's advice: never share your OTP or bank details, and avoid unknown links.
          In case of fraud, call the helpline one nine three zero, or use the National Cybercrime Reporting Portal.""",
          "NCERT Class 7: never share OTPs or bank details · avoid unknown links · helpline 1930 · National Cybercrime Reporting Portal",
          """A phone showing an incoming link with a red cross; a hand covers an OTP; a helpline card with 1930 glows.""",
          ["ECO16-N54"], "3"),
        T(7, "b17", "but",
          """Now a Prelims question. In 2024, UPSC asked about syndicated loans.
          Statement one: syndicated lending spreads the risk of a borrower's default across several lenders.
          Statement two: a syndicated loan can be a fixed lump sum, but cannot be a credit line.
          A Bank for International Settlements article says large banks arrange the loan. They pass shares to other banks, so risk is shared.
          And its data show syndicated loans come as both credit lines and term loans.
          So, by our reasoning, statement one is correct and statement two is not. That points to option C.
          We did not read UPSC's own answer key.""",
          "Prelims 2024 GS I Q52 · statement I: syndication spreads default risk (BIS: shares passed to other banks) · statement II: 'cannot be a credit line' (BIS: syndicated loans come as credit lines and term loans) · by our reasoning: (c) · UPSC's key not read",
          """A big loan drawn as a pie of several banks' shares around one borrower; a credit-line gauge and a lump-sum block both labelled
          SYNDICATED; a notebook tag: BY OUR REASONING.""",
          ["ECO16-P02", "ECO16-P03", "ECO16-P04"], "4", "syndicated loan",
          note="P05 UNVERIFIED: the official key was not found: the voice says so. Option letters per the question as printed."),
        T(8, "b18", "therefore",
          """For the exam, write it this way. Credit is an agreement: the lender supplies money, and the borrower promises to pay later.
          Terms of credit are the interest rate, collateral, documents and mode of repayment.
          Whether credit helps depends on the risk, and on support if things go wrong.
          Formal lenders are supervised by the Reserve Bank. Informal lenders are not.
          Self-help groups let the poor borrow in the group's name. UPI moves money between bank accounts through the National Payments Corporation of India.""",
          "credit · terms of credit · helps or traps: risk and support · formal (RBI-supervised) vs informal · self-help groups · UPI via NPCI",
          """The notebook page fills line by line in handwriting; the key terms turn gold as the narration reaches them.""",
          ["ECO16-N33", "ECO16-N34", "ECO16-N36", "ECO16-N39", "ECO16-N52"], "5"),
        T(8, "b19", "therefore",
          """So, in three parts: money is cash and deposits. A loan opens a new deposit, within limits.
          And credit can help or trap. Salim and Swapna borrowed in the same way.
          The risk, and the support if things go wrong, made the difference.""",
          "Series wrap: money = cash + deposits · a loan opens a deposit, within limits · credit helps or traps: risk and support",
          """The three parts' key pictures in a row, fading in: the money bar, the ledger, the two fields; the two fields end the sequence.""",
          [], "handoff",
          note="Loop back to the hook: Salim and Swapna. No new claim."),
    ],
    story=dict(
        promise="Who gets a loan, at what price, and how does money move? Why does the same loan help one borrower and trap another?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="Who gets credit, on what terms, and how does money move?", open="b00", close="b18"),
            dict(id="L2", kind="secondary", q="Why did Salim's loan help and Swapna's trap?", open="b00", close="b03"),
            dict(id="L3", kind="tertiary", q="Can the poor borrow without collateral?", open="b07", close="b09"),
            dict(id="M1", kind="micro", q="Which lenders are formal, and what do the numbers say?", open="b04", close="b05"),
            dict(id="M2", kind="micro", q="How big is UPI next to cheques?", open="b14", close="b15"),
            dict(id="M3", kind="micro", q="What is a syndicated loan?", open="b17", close="b17"),
        ],
        turn="b03",
        plants=[("b00", "b03"), ("b00", "b19")],
        critical=[
            dict(what="NCERT's Salim and Swapna stories and the terms of credit", src="NCERT Class 10 Understanding Economic Development ch.3 (ECO16-N33, N34)"),
            dict(what="Formal and informal shares of debt", src="NSS 77th round, All India Debt and Investment Survey, debt as on 30 Jun 2018 (ECO16-I10); NCERT Class 10 Graph 1 (N35, N37)"),
            dict(what="UPI and cheque volumes, June 2026", src="RBI payment-system statistics (ECO16-I07, I09, A10)"),
        ],
        fallback="If the June 2026 payment figures failed review: how do the modes of payment in NCERT Class 7 differ?",
        tier="broad",
    ),
)
