"""Format A (One Question): UPSC CSE (Main) 2021, Economics optional Paper I, Q4(b), 15 marks. Draft 1, 11 Nov 2026.
Single source of this video's answer sheet and narration; check and render with scripts/upsc/pyq_tool.py.
Facts come from the ECO-16 ledger, this folder's claims.csv, the 2024-eco1-4a ledger (IGNOU glossary and RBI Bulletin rows) and the answer-video ledger.
The assumptions are our reading of IGNOU's derivation (2021-ECO1-4B-06 is UNVERIFIED and is not cited); no scholars are named.
The weaker answer is written by us; it is not any student's copy."""


def T(key, link, kind, say, pic, claims):
    return dict(key=key, link=link, say=" ".join(say.split()), scene=dict(type=kind, pic=" ".join(pic.split())), claims=claims)


def S(kind, text, demands=(), claims=(), label="", labels=None, items=None, formula=False):
    return dict(kind=kind, text=" ".join(text.split()), demands=list(demands), claims=list(claims), label=label, labels=labels or {}, items=items or [], formula=formula)


A = dict(
    id="PYQ-2021-ECO1-4B",
    fmt="A",
    title="The High-Powered Money Theory of Money Supply, and Its Assumptions (UPSC Economics 2021)",
    question=dict(year=2021, paper="eco1", label="Economics optional Paper I", q=4, part="b", marks=15,
                  text="Describe high powered theory of money supply in brief. State the assumptions made in its construction.",
                  pdf="research/upsc/_pyq/mains/2021_eco1.pdf", page=3),
    budget=(220, 270),
    minutes=11,
    budget_note="our working budget; UPSC prints no word limit for this part (Q4(b) of the 2021 paper, printed 8+7; no ledger claim yet); 11 minutes is our arithmetic from 3 hours for 250 marks",
    ledgers=["ECO-16", "pyq", "pyq/2021-eco1-4b", "pyq/2024-eco1-4a"],
    demands=[
        dict(id="D1", text="Describe the high-powered money theory of money supply, in brief"),
        dict(id="D2", text="State the assumptions made in constructing it"),
    ],
    sheet=[
        S("intro", """_High-powered money_ (H) is currency held by the public plus bank reserves. The theory says the
          _money supply_ (M) is a multiple of it: M = m × H.""",
          ["D1"], ["ECO16-N07", "2021-ECO1-4B-02"]),
        S("head", "1. The theory", ["D1"]),
        S("para", """With currency C, demand deposits D and bank reserves R: M = C + D and H = C + R. So _m = (cdr + 1)/(cdr + rr)_,
          where cdr = C/D and rr = R/D. With no cash held (cdr = 0), m = 1/rr: at a 20% reserve ratio, m = 5.""",
          ["D1"], ["2021-ECO1-4B-01", "ECO16-T07", "ECO16-N16"], formula=True),
        S("points", """• RBI is the only issuer of currency and lender of last resort. It changes H by _open market operations_; a CRR change alters rr, and so m.
          • RBI's _reserve money_ (M0) is currency in circulation plus bankers' deposits with RBI plus 'other' deposits.
          • India: RBI's multiplier is M3 / base money: 5.57 (2019-20), 5.20 (2021-22) (RBI Bulletin, June 2022).""",
          ["D1"], ["ECO16-N17", "ECO16-N18", "ECO16-N19", "2021-ECO1-4B-03", "2021-ECO1-4B-04"]),
        S("head", "2. Assumptions (our reading of the derivation; no source we read lists them)", ["D2"]),
        S("points", """• The public holds a stable currency-deposit ratio, cdr = C/D. Fails in a crisis: cash holding rises and m falls (RBI Bulletin).
          • Banks hold required reserves plus desired excess reserves, a fixed fraction of deposits, inside rr. Fails when excess reserves jump:
          IGNOU: US money fell about 35% from March 1930 to March 1933 while the base rose about 20%, as cdr and excess reserves both rose.
          • RBI sets H. RBI authors say money is determined endogenously and, in shocks, the link from H breaks.
          • Money is only cash plus demand deposits (M = C + D).""",
          ["D2"], ["2021-ECO1-4B-01", "2024-ECO1-4A-04", "ECO16-T08", "2024-ECO1-4A-06", "ECO16-T09", "2021-ECO1-4B-05"]),
        S("close", """In our view, M = m × H holds while cdr and rr are stable; in shocks m moves and, RBI authors say, the link from H breaks.""",
          ["D1", "D2"], ["ECO16-T07", "2021-ECO1-4B-05"]),
    ],
    weak=[
        dict(text="H is the money printed by RBI, and M is a multiple of it.", miss="no formula: C, R, cdr and rr are never named", claims=["2021-ECO1-4B-01"]),
        dict(text="Multiplier = 1/CRR.", miss="only true with no cash held; the full formula has the currency-deposit ratio", claims=["ECO16-T07"]),
        dict(text="Assumption: banks keep CRR.", miss="leaves out stable cdr, demand deposits only, desired excess reserves and RBI control of H", claims=["2024-ECO1-4A-04"]),
        dict(text="(no India figure)", miss="RBI's multiplier of 5.20 for 2021-22 is never used to test the theory", claims=["2021-ECO1-4B-04"]),
        dict(text="(no failure case)", miss="never says what happens to the assumptions in a crisis", claims=["ECO16-T09"]),
    ],
    cousins=["2025 Economics Paper I Q4(c): money multiplier, determinants and control of money supply",
             "2019 Economics Paper I Q5(a) (10 marks): partial cash hoarding and excess reserves",
             "2022 Economics Paper I Q3(b): deposit and money multipliers, and the effect of cards",
             "2018 Economics Paper I Q1(e) (10 marks): high-powered money and short-term policy"],
    beats=[
        T("b00", "", "question",
          """UPSC, twenty twenty-one. Economics optional, Paper One, fifteen marks.
          Describe the high-powered theory of money supply, in brief. Then state the assumptions made in building it.
          Here's the trap. None of the sources we read lists the assumptions, so we read them out of the derivation.""",
          """The printed question on a paper card, credit line 'UPSC CSE (Main) 2021, Economics Paper I, Q4(b)'.
          The words 'in brief' and 'assumptions' glow faintly (plant).""",
          ["2021-ECO1-4B-01"]),
        T("b01", "therefore", "xray",
          """Read what it asks. Describe means say what it is and how it works. In brief means short. State means list, without arguing.
          So there are two jobs: the theory, and the assumptions.""",
          "Question X-ray: 'Describe', 'in brief' and 'State' underlined; two empty boxes D1 and D2 (plant: they tick at the end).",
          []),
        T("b02", "but", "idea",
          """Start with the definition. High-powered money is currency, held by the public or by banks as reserves.
          It is the base on which banks build deposits. RBI is its only issuer.""",
          "A stack of notes splits into a wallet pile (C) and a bank vault pile (R); the two add up to H.",
          ["ECO16-N07", "2021-ECO1-4B-02", "ECO16-N17"]),
        T("b03", "therefore", "idea",
          """Now the formula. Money is cash plus deposits. High-powered money is cash plus reserves. Divide one by the other.
          You get cash ratio plus one, over cash ratio plus reserve ratio. With no cash, it is one over the reserve ratio.""",
          "M = C + D and H = C + R slide together; the fraction (cdr + 1)/(cdr + rr) writes itself; cdr = 0 gives 1/rr.",
          ["2021-ECO1-4B-01", "ECO16-T07"]),
        T("b04", "but", "idea",
          """But every step rests on an assumption. The two ratios must stay put. Money is only cash and demand deposits.
          Spare reserves stay a fixed share. And the central bank sets the base.""",
          "Four padlocks, one per assumption, on the formula; each is labelled with the line of the derivation it comes from.",
          ["2021-ECO1-4B-01", "2024-ECO1-4A-04", "ECO16-T08"]),
        T("b05", "therefore", "sheet",
          """Now we write. No word limit is printed. So we set our own: about two hundred and fifty words, in eleven minutes.
          Open with the definition in one line. Then the formula, with the no-cash case.""",
          "The answer sheet; clock 11:00 and word counter 0. The introduction and Section 1 write in; box D1 fills.",
          ["2021-ECO1-4B-01", "ECO16-N07"]),
        T("b06", "therefore", "sheet",
          """Section two lists the assumptions. Say plainly that the list is our reading, because none we read prints it.
          Beside each, a half-line on where it fails, with RBI's own bulletin and the nineteen-thirties.""",
          "Sections 2 and 3 write in; box D2 fills.",
          ["2021-ECO1-4B-01", "2024-ECO1-4A-06", "ECO16-T09"]),
        T("b07", "but", "compare",
          """Now the easy answer beside it. It says H is printed money and stops. It writes one over CRR.
          It lists CRR as the only assumption. And it gives no failure case.""",
          "Two sheets side by side; the weaker one's slips ringed in red with one-line notes.",
          ["2021-ECO1-4B-01", "ECO16-T07", "2024-ECO1-4A-04", "ECO16-T09"]),
        T("b08", "therefore", "cousins",
          """Here is the payoff. One frame answers its cousins. Twenty twenty-five asked for the money multiplier and its control.
          Twenty nineteen asked about cash hoarding. Twenty twenty-two compared two multipliers. Twenty eighteen asked about high-powered money.
          For the full story of how banks create money, watch our money episode.""",
          "The two boxes tick; three cousin question cards slide in; end card to the ECO-16 film.",
          []),
    ],
    story=dict(
        promise="What is the high-powered money theory, and why is the list of its assumptions the part that most answers miss?",
        arc="misconception-first",
        loops=[
            dict(id="L1", kind="primary", q="How do you write this answer well?", open="b00", close="b08"),
            dict(id="L2", kind="secondary", q="Why must you read the assumptions out of the derivation?", open="b00", close="b04"),
            dict(id="M1", kind="micro", q="What are the two jobs?", open="b01", close="b06"),
            dict(id="M2", kind="micro", q="What does the easy answer get wrong?", open="b05", close="b07"),
        ],
        turn="b04",
        plants=[("b00", "b04"), ("b01", "b08")],
        critical=[
            dict(what="The derivation M = C + D, H = C + R", src="IGNOU Unit 13 (2021-ECO1-4B-01, ECO16-T07)"),
            dict(what="RBI's multiplier of 5.20 for 2021-22 and the 28.2% and 22.0% rises", src="RBI Bulletin June 2022 (2021-ECO1-4B-04)"),
        ],
        fallback="If the assumptions list failed review: state only the derivation and say that no source prints a list of assumptions.",
        tier="broad",
    ),
)
