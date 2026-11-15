"""Format A (One Question): UPSC CSE (Main) 2022, Economics optional Paper I, Q3(b), 15 marks. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the ECO-16 ledger, this folder's claims.csv, the 2024-eco1-4a ledger (RBI Bulletin multiplier, same source) and the answer-video ledger.
ECO16-A07 (UNVERIFIED) is not used; 'deposit multiplier' is our label (not defined in NCERT or IGNOU); the card effect on cdr is our reasoning.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None, formula=False):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [], formula=formula)


A = dict(
    id="PYQ-2022-ECO1-3B",
    fmt="A",
    title="Deposit Multiplier vs Money Multiplier, and What Cards Do to It (UPSC Economics 2022)",
    question=dict(year=2022, paper="eco1", label="Economics optional Paper I", q=3, part="b", marks=15,
                  text="Compare the deposit multiplier with the money multiplier. Is there any impact on the money multiplier arising out of "
                       "massive use of credit and debit cards? Justify your answer.",
                  pdf="research/upsc/_pyq/mains/2022_eco1.pdf", page=4),
    budget=(220, 270),
    minutes=11,
    budget_note="our working budget; UPSC prints no word limit for this part (Q3(b) of the 2022 paper; no ledger claim yet); 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-16", "pyq", "pyq/2022-eco1-3b", "pyq/2024-eco1-4a"],
    demands=[
        dict(id="D1", text="Compare the deposit multiplier with the money multiplier"),
        dict(id="D2", text="Say whether massive use of credit and debit cards affects the money multiplier"),
        dict(id="D3", text="Justify the answer", view=True),
    ],
    sheet=[
        S("intro", """Both show how far reserves stretch. We found _deposit multiplier_ in neither NCERT nor IGNOU: it is our label for _1/rr_.
          The _money multiplier_ is _(cdr + 1)/(cdr + rr)_ (IGNOU).""",
          ["D1"], ["ECO16-T07"]),
        S("head", "1. Comparison", ["D1"]),
        S("points", """• _Deposit multiplier_: deposits per rupee of reserves when no cash is held. At a 20% reserve ratio, ₹100 of reserves supports ₹500: m = 5.
          • _Money multiplier_: M/H, which counts the cash the public holds (cdr). Cash leaks from the lending chain, so it is smaller.
          • At today's CRR of 3.00%: 1/rr is 33.3, while the money multiplier is 6.40 with cdr 0.1496 (toy figures, 31 Jul 2026).
          • RBI's actual multiplier fell from 5.57 in 2019-20 to 5.20 in 2021-22 (RBI Bulletin, June 2022).""",
          ["D1"], ["ECO16-N16", "ECO16-A04", "ECO16-T07", "ECO16-A14", "2024-ECO1-4A-07"]),
        S("diagram", """The same reserves, two multipliers (toy figures at CRR 3.00%).""",
          ["D1"], ["ECO16-A14"], label="Fig. 1: Same reserves, two multipliers",
          items=[dict(when="1/rr", what="deposit multiplier 33.3"), dict(when="(cdr + 1)/(cdr + rr)", what="money multiplier 6.40")]),
        S("head", "2. Impact of cards", ["D2"]),
        S("points", """• Reasoning (ours): a card payment moves a deposit between accounts. If it replaces cash, cdr falls and the money multiplier rises.
          Credit cards are deferred-payment loans, not cash (ours).
          • An RBI staff paper (authors' views) finds digital payments (all modes, not cards alone) inversely linked to currency use,
          but income outweighs it. Currency peaked at 14.4% of GDP in 2020-21 while digital payments grew 27% a year by value (2016-17 to 2022-23).
          • Cards: ₹2,36,660 crore in June 2026, 0.75% of digital payment value (our arithmetic from RBI). Debit-card purchases were
          ₹35,299 crore against ₹2,16,359 crore of ATM cash.""",
          ["D2"], ["ECO16-T07", "ECO16-N16", "2022-ECO1-3B-08", "2022-ECO1-3B-01", "2022-ECO1-3B-02", "2022-ECO1-3B-03", "2022-ECO1-3B-05", "2022-ECO1-3B-07", "2022-ECO1-3B-06"]),
        S("head", "3. Justification", ["D3"]),
        S("close", """Yes in direction (our reasoning), but small on today's data (our inference). Less cash raises the money multiplier, but cards are a sliver of payments
          and income dominates. We found no measured fall in cdr caused by cards.""",
          ["D2", "D3"], ["2022-ECO1-3B-01", "2022-ECO1-3B-07"]),
    ],
    weak=[
        dict(text="Both multipliers are the same: 1/CRR.", miss="the money multiplier also counts the cash the public holds", claims=["ECO16-T07"]),
        dict(text="At today's CRR the money multiplier is 33.3.", miss="that is the cash-free figure; with today's cash ratio the toy value is 6.40", claims=["ECO16-A14"]),
        dict(text="Cards have no effect, as they are only a payment method.", miss="a card payment can replace cash, which moves cdr and so the multiplier", claims=["2022-ECO1-3B-08"]),
        dict(text="Cards will raise the multiplier a lot.", miss="no size: cards are 0.75% of digital value and debit cards mostly draw cash", claims=["2022-ECO1-3B-07"]),
        dict(text="(no label for the two terms)", miss="never says that 'deposit multiplier' was not found as a defined term in NCERT or IGNOU", claims=[]),
    ],
    cousins=["2025 Economics Paper I Q4(c): money multiplier, determinants and control of money supply",
             "2019 Economics Paper I Q5(a) (10 marks): partial cash hoarding and excess reserves",
             "2024 Economics Paper I Q4(a): credit creation by commercial banks",
             "2018 Economics Paper I Q1(e) (10 marks): high-powered money and short-term policy"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-two. Economics optional, Paper One, fifteen marks.
          Compare the deposit multiplier with the money multiplier. Do cards affect it? Justify.
          Here's the trap. The words deposit multiplier are not in NCERT's money chapter or IGNOU's unit, so you must say what you mean.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2022, Economics Paper I, Q3(b)'.
          The words 'compare', 'cards' and 'justify' glow faintly (plant).""",
          ["ECO16-T07"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Compare means set two things side by side. Justify means give a reason and a verdict.
          So there are three jobs: the comparison, the cards, and the justification.""",
          "Question X-ray: 'Compare', 'cards' and 'Justify' underlined; three empty boxes D1 to D3 (plant: they tick at the end).",
          []),
        T("b02", "but", "idea",
          """Start with the rounds. At twenty percent, a hundred rupees of reserves supports five hundred of deposits. The multiplier is five.
          That is one over the reserve ratio. We call it the deposit multiplier.""",
          "The lending rounds as stacked coins: 100, 80, 64; the total reaches 500 and m = 5 = 1/0.2 appears.",
          ["ECO16-N16", "ECO16-A04"]),
        T("b03", "but", "idea",
          """But people also keep cash. Every rupee held as cash stops a round. So the money multiplier adds the cash ratio.
          At today's reserve ratio, the toy value drops from thirty-three to six point four.""",
          "A rupee leaks into a wallet; the formula m = (cdr + 1)/(cdr + rr) writes itself; 33.3 shrinks to 6.40.",
          ["ECO16-T07", "ECO16-A14"]),
        T("b04", "therefore", "idea",
          """Now the cards. A card payment moves a deposit from one account to another. If it replaces cash, cash held falls.
          The cash ratio falls, and the money multiplier rises. That is our reasoning, and we label it so.""",
          "Cash notes fade from a wallet as a card tap moves a deposit between two accounts; the multiplier bar rises.",
          ["2022-ECO1-3B-08"]),
        T("b05", "but", "sheet",
          """But the size matters. Cards were under one percent of digital payment value in June twenty twenty-six.
          Debit cards mostly draw cash. And a staff paper on all digital payments says income still dominates.""",
          "The answer sheet; Section 2 writes in; box D2 fills.",
          ["2022-ECO1-3B-07", "2022-ECO1-3B-06", "2022-ECO1-3B-01"]),
        T("b06", "therefore", "sheet",
          """Now we write. No word limit is printed. So we set our own: about two hundred and fifty words, in eleven minutes.
          Open with the two labels. Then compare, with one small diagram.""",
          "The answer sheet; clock 11:00 and word counter 0. Introduction and Section 1 write in; Fig. 1 draws; box D1 fills.",
          ["ECO16-T07", "ECO16-A14"]),
        T("b07", "therefore", "sheet",
          """End with the justification. Yes, there is an impact, in the direction of a higher multiplier. But it is small today.
          And say plainly that no measured fall in cash, caused by cards, was found.""",
          "The conclusion writes in; box D3 fills.",
          ["2022-ECO1-3B-01", "2022-ECO1-3B-07"]),
        T("b08", "but", "compare",
          """Now the easy answer beside it. It treats the two multipliers as one. It says cards have no effect, or a huge one.
          It never says the first label is not a textbook term. And it gives no size.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["ECO16-T07", "ECO16-A14", "2022-ECO1-3B-07"]),
        T("b09", "therefore", "cousins",
          """Here is the payoff. One frame answers its cousins. Twenty twenty-five asked for the money multiplier and its control.
          Twenty nineteen asked about cash hoarding. Twenty twenty-four asked about credit creation. Twenty eighteen asked about high-powered money.
          For the full story of how banks create money, watch our money episode.""",
          "The three boxes tick; three cousin question cards slide in; end card to the ECO-16 film.",
          []),
    ],
    story=dict(
        promise="Why is the deposit multiplier not the money multiplier, and do cards change it? How do you write that in eleven minutes?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you write this answer well?", open="b00", close="b09"),
            dict(id="L2", kind="secondary", q="Why does cash make the two multipliers differ?", open="b00", close="b03"),
            dict(id="M1", kind="micro", q="What are the three jobs?", open="b01", close="b07"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b06", close="b08"),
        ],
        turn="b03",
        plants=[("b00", "b03"), ("b01", "b09")],
        critical=[
            dict(what="The money multiplier formula with the currency-deposit ratio", src="IGNOU (ECO16-T07)"),
            dict(what="Card payments of Rs 2,36,660 crore in June 2026", src="RBI Payment System Indicators, June 2026 (2022-ECO1-3B-05)"),
        ],
        fallback="If the card-size figures failed review: give the direction by reasoning and say the size could not be measured from official data.",
        tier="broad",
    ),
)
