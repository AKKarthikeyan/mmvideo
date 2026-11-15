#!/usr/bin/env python3
"""Builds public/datayt/long/upsc/eco16-p2/storyboard.json from the locked script (ECO-16 Part 2, 5 Nov 2026).

The script is the single source of the words: research/upsc/ECO-16/script_p2.py in the main checkout
(/Volumes/DarwinSSD/DataKadai/mmvideo-dk). This file only cuts each beat into scenes and gives each scene a kind and a spec.
Every scene's vo is a run of whole sentences of its beat, so the narration stays word for word the script.
Kinds and spec fields: src/looks/upsc_rich_b/CONTRACT_B.md (the look), CONTRACT_B_ECO2.md (the new `analogy` variants of this film).

  .venv/bin/python scripts/upsc/eco16_p2_storyboard.py      # writes the storyboard and prints a scene table
"""
import importlib.util, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/ECO-16/script_p2.py"
OUT = os.path.join(ROOT, "public/datayt/long/upsc/eco16-p2/storyboard.json")
KID = "girl"


def load():
    spec = importlib.util.spec_from_file_location("ep", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.V


def L(lab_or_text, key, **k):
    """A label item: keys starting e16_ are quantities read with lab(); anything else is plain text."""
    d = dict(lab=lab_or_text) if lab_or_text.startswith("e16_") else dict(text=lab_or_text)
    d.update(key=key, **k)
    return d


def A(which, labels=(), chip="", limit="", **k):
    return dict(which=which, chip=chip, limit=limit, labels=list(labels), **k)


# beat -> list of (sentence indices, kind, spec, reveals [(key, word)], visual note)
PLAN = {
 "b00": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("deposit-hook", [L("e16_h100", "d1"), L("e16_h20", "k"), L("e16_h80", "l"), L("e16_h180", "t")], ref="e16_p2"),
   [("d1", "hundred"), ("k", "twenty"), ("l", "eighty"), ("t", "where")], "A bank counter: a hand slips a hundred-rupee note across; two account bars: yours stays at 100, a new bar for the borrower grows to 80; a counter reads 180; a question mark between."),
 ],
 "b01": [
  ([0, 1, 2, 3], "analogy", A("plan-steps", [L("Last time: most money is deposits (M3)", "pr"), L("Who makes the deposits?", "q1"), L("What stops them growing without end?", "q2")], mode="questions"),
   [("pr", "M3,"), ("q1", "who"), ("q2", "stops")], "A notebook page: last time's finding at the top; two questions written below."),
  ([4, 5, 6, 7, 8, 9], "analogy", A("plan-steps", [L("1 · a story", "s1"), L("2 · a bank's books", "s2"), L("3 · the limit, and its arithmetic", "s3"), L("4 · does the textbook hold?", "s4"), L("PART 2 of 3", "p2")], mode="steps"),
   [("s1", "story"), ("s2", "books."), ("s3", "limit,"), ("s4", "honest"), ("p2", "two")], "Four numbered boxes tick in turn; a three-stop path beneath: Part 1 done, Part 2 lit, Part 3."),
 ],
 "b02": [
  ([0, 1, 2, 3], "analogy", A("goldsmith", [L("NCERT's story of Lala", "nl"), L("gold bars left for safekeeping", "gb"), L("a receipt for each", "rc"), L("receipts used as money", "rm")], mode="receipts"),
   [("nl", "Lala."), ("gb", "gold"), ("rc", "receipt."), ("rm", "money,")], "A village goldsmith's shop: villagers leave small gold bars; each gets a receipt; at a market stall the receipts pass from hand to hand."),
  ([4, 5, 6, 7, 8], "analogy", A("goldsmith", [L("Ramu asks for 25 kg", "rk"), L("not everyone comes at once", "na"), L("Ali re-deposits the gold", "al"), L("e16_l125", "t125")], mode="lend", ref="e16_lala"),
   [("rk", "Ramu"), ("na", "decides"), ("al", "Ali"), ("t125", "receipts")], "Ramu borrows a bar, pays Ali; Ali leaves it with Lala for a new receipt; the receipt pile in circulation counts up from 100 to 125 kg."),
  ([9, 10, 11], "analogy", A("goldsmith", [L("“money out of thin air”?", "tt"), L("A MADE-UP STORY", "mu"), L("modern banks work the same way (NCERT)", "mb")], mode="moral", chip="NCERT'S STORY"),
   [("tt", "seems"), ("mu", "made-up"), ("mb", "modern")], "The goldsmith's counter with a faint glow around the new receipts; a stamp lands: A MADE-UP STORY; a bank building fades in behind."),
 ],
 "b03": [
  ([0, 1, 2, 3, 4], "analogy", A("queue-calm", [L("EVERYONE AT ONCE", "q"), L("not all depositors withdraw together", "nw"), L("keep enough to repay on demand", "kp"), L("CONFIDENCE", "cf")]),
   [("q", "same"), ("nw", "together."), ("kp", "enough"), ("cf", "confident")], "Two panels: a long worried queue at the goldsmith's door; a calm village staying home; a confidence meter."),
 ],
 "b04": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", A("ledger", [L("BALANCE SHEET", "bs"), L("ASSETS: reserves + loans", "as"), L("LIABILITIES: deposits", "li"), L("reserves = cash + deposits with the RBI", "rv"), L("e16_h100", "st")], mode="start"),
   [("bs", "sides."), ("as", "Assets"), ("li", "Liabilities"), ("rv", "Reserves"), ("st", "hundred")], "A two-sided ledger on a desk: assets (reserves, loans) at the left, liabilities (deposits) at the right; a 100 block in reserves and in deposits; the loans slot empty."),
 ],
 "b05": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("ledger", [L("a loan opens a new deposit", "nd"), L("in the borrower's name", "bn"), L("money supply rises by that deposit", "ms"), L("e16_h180", "t")], mode="loan"),
   [("nd", "opens"), ("bn", "borrower's"), ("ms", "supply"), ("t", "extra")], "The ledger again: a new 80 block appears on the deposits side under the borrower's name; the loans slot fills; the original 100 stays; the counter reads 100 to 180."),
 ],
 "b06": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", A("vault-crr", [L("CASH RESERVE RATIO · CRR", "cr"), L("a share of deposits kept as reserves", "sh"), L("in law: net demand and time liabilities", "nd"), L("a balance with the Reserve Bank", "bk"), L("a legal requirement · stops over-lending", "lg")]),
   [("cr", "CRR."), ("sh", "share"), ("nd", "net"), ("bk", "balance"), ("lg", "legal")], "A bank vault door with a CRR dial; behind the glass a fixed fraction of the deposit bar is shaded RESERVE; a hand-stop sign: STOP OVER-LENDING."),
 ],
 "b07": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", A("rounds-stairs", [L("reserve ratio 20%", "rr"), L("deposit 100", "r0"), L("loan 80", "r1"), L("loan 64", "r2"), L("deposits ≈ 500 · reserves 100 · loans 400", "tot")], ref="e16_rounds"),
   [("rr", "twenty"), ("r0", "deposited."), ("r1", "eighty."), ("r2", "sixty-four."), ("tot", "Added")], "A staircase of coin stacks: the first deposit 100, then loans 80, 64 ...; a running total of deposits climbs toward 500; a pie: reserves 100, loans 400."),
 ],
 "b08": [
  ([0, 1, 2, 3, 4], "analogy", A("gear-multiplier", [L("RESERVES · 100", "rs"), L("DEPOSITS · 500", "dp"), L("MONEY MULTIPLIER = 5", "mm"), L("1 ÷ r", "fm")], mode="plain"),
   [("rs", "Reserves"), ("dp", "deposits"), ("mm", "multiplier."), ("fm", "divided")], "A gear train: a small gear (reserves 100) drives a big gear (deposits 500); MULTIPLIER 5; the formula 1 ÷ r slides in."),
 ],
 "b09": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("gear-multiplier", [L("CASH LEAKS OUT", "lk"), L("currency-deposit ratio · cdr", "cd"), L("IGNOU: m = (cdr + 1) ÷ (cdr + rr)", "fm")], mode="leak"),
   [("lk", "leaks"), ("cd", "currency-deposit"), ("fm", "IGNOU")], "The gear train with a leak: coins roll off the big gear into a wallet; the formula card appears."),
  ([6, 7, 8, 9], "analogy", A("gear-multiplier", [L("CRR 3% (3 Nov 2026) → 33", "c33"), L("cash 15 paise per ₹1 of deposits (31 Jul 2026) → 6.4", "c64"), L("TOY CEILINGS · NOT FORECASTS", "toy")], mode="toy", limit="the CRR is not the only limit on real lending"),
   [("c33", "thirty-three."), ("c64", "six"), ("toy", "toy")], "The multiplier readout shows 33 at the 3% CRR, then drops to 6.4 with the cash leak; a stamp lands: TOY CEILING."),
 ],
 "b10": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("crr-timeline", [L("NCERT Class 10: banks hold about 5% as cash", "n5"), L("CRR 3.00% · 3 Nov 2026", "c3"), L("4.5% until mid-Dec 2024", "c45"), L("4.0% from 28 Dec 2024", "c4"), L("four cuts of 0.25 · Sep to Nov 2025", "cuts")]),
   [("n5", "five"), ("c3", "CRR"), ("c45", "half"), ("c4", "month."), ("cuts", "cuts")], "A dial labelled CRR on a dated timeline: 4.5 to 4.0 in Dec 2024; pause; then 3.75, 3.5, 3.25, 3.0 across Sep to Nov 2025."),
  ([6, 7, 8], "analogy", A("crr-timeline", [L("STATUTORY LIQUIDITY RATIO · SLR", "sl"), L("liquid assets: cash, gold, government securities", "la"), L("at least 18% of net demand and time liabilities", "mn")], mode="slr"),
   [("sl", "statutory"), ("la", "liquid"), ("mn", "eighteen")], "A second vault door, SLR, holding cash, gold bars and government-bond folders."),
 ],
 "b11": [
  ([0, 1, 2, 3, 4], "analogy", A("rbi-panel", [L("RAISE THE CRR → LESS LENDING → LESS MONEY", "up"), L("QUANTITATIVE: CRR · bank rate · bonds", "qn"), L("QUALITATIVE: e.g. moral suasion · margin requirement", "ql")]),
   [("up", "raises"), ("qn", "Quantitative"), ("ql", "Qualitative")], "A control panel with five dials in two groups; the CRR dial turns up and a small money bar beside it shrinks."),
 ],
 "b12": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("omo", [L("OPEN MARKET OPERATION", "om"), L("buy a bond → reserves rise", "bu"), L("sell a bond → reserves fall", "se"), L("LENDER OF LAST RESORT", "ll")]),
   [("om", "open"), ("bu", "buys"), ("se", "Selling"), ("ll", "lender")], "A bond passes from a dealer to the RBI building; a cheque flies back into a bank's reserve bar, which rises; the reverse trade makes it fall; a lifebuoy tag."),
 ],
 "b13": [
  ([0, 1, 2, 3, 4, 5, 6, 7], "analogy", A("two-views", [L("TEXTBOOK: reserves → loans → deposits", "tb"), L("BANK OF ENGLAND STAFF, 2014 (UK)", "bo"), L("most money is created when banks make loans", "mc"), L("not simply lending out deposits · not multiplying up reserves", "nm"), L("an article by staff, in the Bank's Quarterly Bulletin", "qb")]),
   [("tb", "reserves"), ("bo", "Staff"), ("mc", "Most"), ("nm", "do"), ("qb", "article")], "Two cards face to face: TEXTBOOK (reserves, loans, deposits) and a STAFF ARTICLE (loans, deposits); a plaque: BANK OF ENGLAND STAFF, 2014 (UK)."),
 ],
 "b14": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("limits-balance", [L("BUNDESBANK · MONTHLY REPORT · APRIL 2017 · EURO AREA", "bb"), L("not tied to excess reserves", "ex"), L("PROFIT", "pf"), L("RULES", "ru"), L("DEMAND AND PORTFOLIO CHOICES", "dm"), L("the interest rate policy influences it", "ir")]),
   [("bb", "Bundesbank,"), ("ex", "excess"), ("pf", "profitably,"), ("ru", "rules"), ("dm", "households"), ("ir", "interest")], "Three weights labelled profit, rules, demand pressing on a loan counter; above them a dial: interest rate policy; a plaque for the Bundesbank report."),
 ],
 "b15": [
  ([0, 1, 2], "analogy", A("reserve-world", [L("US reserve requirements: zero since 26 Mar 2020", "us"), L("NCERT and IGNOU still teach the multiplier", "mt")]),
   [("us", "States"), ("mt", "teach")], "A wall of reserve-ratio dials, one set to zero (US, March 2020); two textbooks on a shelf: NCERT, IGNOU."),
  ([3, 4, 5], "analogy", A("reserve-world", [L("EXOGENOUS · the authority fixes it", "ex"), L("ENDOGENOUS · banks, firms and households shape it", "en"), L("the real world: more likely a mix", "mx"), L("NAME THE VIEW", "nv")], mode="mix"),
   [("ex", "controlled"), ("en", "shaped"), ("mx", "mix."), ("nv", "name")], "Two toolboxes with a bridge between them; a mixing dial in the middle; a notebook tag: NAME THE VIEW."),
 ],
 "b16": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", A("depression-lines", [L("US · Mar 1930 to Mar 1933", "us"), L("money about −35%", "mo"), L("monetary base about +20%", "bs"), L("people pulled money out of banks", "pm"), L("banks held large excess reserves", "xr"), L("Friedman and Schwartz, among others", "fs")], chip="ILLUSTRATION"),
   [("us", "States,"), ("mo", "thirty-five"), ("bs", "twenty"), ("pm", "pulled"), ("xr", "excess"), ("fs", "Friedman")], "Two lines on a sketch chart with no axis numbers: money falling, base rising, a widening gap; a queue at a bank door and a vault of unused cash in two corners."),
 ],
 "b17": [
  ([0, 1, 2, 3, 4], "analogy", A("deposit-insurance", [L("DEPOSIT INSURANCE · DICGC", "di"), L("up to ₹5 lakh per depositor per bank", "cap"), L("principal + interest together", "pi"), L("the bank pays the premium", "pr"), L("stated aim: public confidence, particularly the small depositor", "aim")]),
   [("di", "insurance."), ("cap", "five"), ("pi", "interest"), ("pr", "premium."), ("aim", "aim")], "A passbook under a clear umbrella labelled DICGC; a coin stack marked 5 LAKH slides under it; a second panel with the earlier queue and the stated aim."),
 ],
 "b18": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", A("spread", [L("SPREAD = interest charged − interest paid", "sp"), L("lent ₹200 at 5% → ₹10", "ln"), L("deposited ₹200 at 2% → ₹4", "dp"), L("the bank earns ₹6, before its own costs", "ea"), L("savings rate 2.5% · RBI panel · 3 Nov 2026", "sr")]),
   [("sp", "spread."), ("ln", "five"), ("dp", "two"), ("ea", "earns"), ("sr", "savings")], "Two coin stacks of the same ₹200: one earns a ₹10 stack on the way out, one costs a ₹4 stack on the way in; the gap, ₹6, glows in the bank's till."),
 ],
 "b19": [
  ([0, 1, 2, 3, 4, 5, 6, 7, 8], "notebook", dict(who=KID, strike=dict(text="a bank lends out your deposit?", key="x"), lines=[
        dict(text="A loan opens a new deposit: lending creates money", key="n1"),
        dict(text="Textbook limit: the reserve ratio · ratio 20% → multiplier 5", key="n2"),
        dict(text="Cash held by the public leaks out: multiplier smaller", key="n3"),
        dict(text="3 Nov 2026: CRR 3% · SLR 18% (RBI)", key="n4"),
        dict(text="Name the view: the Bundesbank; Bank of England staff", key="n5"),
        dict(text="Limits named: profit, regulation, demand for credit · policy rate the ultimate limit (BoE)", key="n6")]),
   [("x", "exam,"), ("n1", "loan"), ("n2", "limit"), ("n3", "Cash"), ("n4", "third"), ("n5", "view."), ("n6", "profit,")],
   "Exam card: 'a bank lends out your deposit?' struck out; the answer fills the page, one line per sentence."),
 ],
 "b20": [
  ([0, 1], "statement", dict(lines=[dict(text="On NCERT's account, banks create money when they lend", key="s1"), dict(text="Central-bank papers name limits such as profit and regulation", key="s2")], accent=["create money", "profit and regulation"]),
   [("s1", "NCERT's"), ("s2", "Central-bank")], "Two citation cards, text only."),
  ([2, 3, 4], "analogy", A("part3-street", [L("who gets a loan?", "wg"), L("at what price?", "pp"), L("who is left out?", "lo"), L("PART 3 · credit in daily life · how the money moves", "p3")]),
   [("wg", "Who"), ("pp", "price,"), ("lo", "left"), ("p3", "three:")], "A street scene: a moneylender's table beside a bank counter, a phone tap at a cart; a frame: PART 3."),
 ],
}


def main():
    V = load()
    scenes, n, problems = [], 0, []
    for b in V["beats"]:
        ss = [s for s in re.split(r"(?<=[.?!])\s+", b["say"]) if s]
        plan = PLAN.get(b["key"])
        if not plan:
            problems.append(f"{b['key']}: no plan"); continue
        used = [i for g in plan for i in g[0]]
        if sorted(used) != list(range(len(ss))):
            problems.append(f"{b['key']}: scenes cover sentences {sorted(used)} of {len(ss)}")
        for idx, kind, spec, reveals, visual in plan:
            n += 1
            vo = " ".join(ss[i] for i in idx if i < len(ss))
            words = re.findall(r"[\w'’-]+[.,?!:]?", vo)
            for key, word in reveals:
                if not any(w == word or w.rstrip(".,?!:") == word.rstrip(".,?!:") for w in words):
                    problems.append(f"s{n:03d} ({b['key']}): reveal word {word!r} not in vo")
            scenes.append(dict(id=f"s{n:03d}", act=f"Ch{b['ch']} {b['key']}", kind=kind, spec=spec, vo=vo,
                               reveals=[dict(key=k, word=w) for k, w in reveals], transition="cut", visual=visual,
                               beat=b["key"], claims=b["claims"]))
    joined = " ".join(s["vo"] for s in scenes)
    if joined.split() != " ".join(b["say"] for b in V["beats"]).split():
        problems.append("storyboard vo is not word for word the script")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(dict(id="eco16-p2", format="long-16x9", target_minutes=9.5, script=SCRIPT, scenes=scenes), open(OUT, "w"), indent=1, ensure_ascii=False)
    kinds, wh = {}, {}
    for s in scenes:
        kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
        if s["kind"] == "analogy":
            wh[s["spec"]["which"]] = wh.get(s["spec"]["which"], 0) + 1
    print(f"{len(scenes)} scenes -> {OUT}\n  kinds: {kinds}\n  analogy which: {wh}")
    for p in problems:
        print("  PROBLEM", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
