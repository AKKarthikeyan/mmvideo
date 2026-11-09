#!/usr/bin/env python3
"""Builds public/datayt/long/upsc/eco16-p3/storyboard.json from the locked script (ECO-16 Part 3, 6 Nov 2026).

The script is the single source of the words: research/upsc/ECO-16/script_p3.py in the main checkout
(/Volumes/DarwinSSD/DataKadai/mmvideo-dk). This file only cuts each beat into scenes and gives each scene a kind and a spec.
Every scene's vo is a run of whole sentences of its beat, so the narration stays word for word the script.
Kinds and spec fields: src/looks/upsc_rich_b/CONTRACT_B.md (the look), CONTRACT_B_ECO3.md (the new `analogy` variants of this film).

  .venv/bin/python scripts/upsc/eco16_p3_storyboard.py      # writes the storyboard and prints a scene table
"""
import importlib.util, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/ECO-16/script_p3.py"
OUT = os.path.join(ROOT, "public/datayt/long/upsc/eco16-p3/storyboard.json")
KID = "girl"


def load():
    spec = importlib.util.spec_from_file_location("ep", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.V


def L(lab_or_text, key, **k):
    d = dict(lab=lab_or_text) if lab_or_text.startswith("e16_") else dict(text=lab_or_text)
    d.update(key=key, **k)
    return d


def A(which, labels=(), chip="", limit="", **k):
    return dict(which=which, chip=chip, limit=limit, labels=list(labels), **k)


# beat -> list of (sentence indices, kind, spec, reveals [(key, word)], visual note)
PLAN = {
 "b00": [
  ([0, 1, 2, 3], "analogy", A("two-borrowers", [L("NCERT Class 10 · Salim, a shoe manufacturer", "sl"), L("a big order to fill", "od"), L("good profit · loan repaid", "pf")], mode="salim"),
   [("sl", "Salim"), ("od", "order."), ("pf", "profit,")], "Salim's shoe workshop: stacked boxes, a trader's van, a big order; he delivers it and repays the loan."),
  ([4, 5, 6, 7, 8], "analogy", A("two-borrowers", [L("Swapna, a small farmer", "sw"), L("groundnut · the crop fails", "cf"), L("part of her land sold", "ld"), L("SAME TOOL · OPPOSITE RESULTS", "op"), L("What decides whether credit helps or traps?", "q")], mode="swapna"),
   [("sw", "Swapna"), ("cf", "fails,"), ("ld", "land."), ("op", "opposite"), ("q", "decides")], "Swapna's three-acre field with wilted plants; a moneylender at the gate holds a few notes (no ledger); the two stories meet in one question."),
 ],
 "b01": [
  ([0, 1, 2], "analogy", A("plan-steps-3", [L("PART 1 · what money is", "p1"), L("PART 2 · how banks create it", "p2"), L("who gets it · at what price · how it moves", "q")], mode="recap"),
   [("p1", "money"), ("p2", "create"), ("q", "price,")], "A three-stop path: Part 1 and Part 2 done, with their key pictures; a question card for Part 3."),
  ([3, 4, 5, 6, 7, 8, 9], "analogy", A("plan-steps-3", [L("1 · credit and what it costs", "s1"), L("2 · who lends: banks or moneylenders", "s2"), L("3 · groups that help the poor borrow", "s3"), L("4 · how payments move", "s4"), L("a 2024 Prelims question", "pq"), L("PART 3 of 3", "p3")], mode="steps"),
   [("s1", "costs."), ("s2", "moneylenders."), ("s3", "borrow."), ("s4", "tap."), ("pq", "Prelims"), ("p3", "three")], "Four numbered boxes tick in turn; a Prelims tag; the path lights Part 3."),
 ],
 "b02": [
  ([0, 1, 2, 3, 4, 5, 6, 7], "analogy", A("credit-terms", [L("CREDIT · a loan = an agreement", "cr"), L("the lender supplies money, goods or services", "ls"), L("the borrower promises to pay later", "bp"), L("TERMS OF CREDIT", "tc"), L("interest rate", "ir"), L("documents", "dc"), L("mode of repayment", "mr"), L("collateral: an asset the borrower owns", "co")]),
   [("cr", "credit,"), ("ls", "supplies"), ("bp", "promises"), ("tc", "terms"), ("ir", "interest"), ("dc", "documents"), ("mr", "mode"), ("co", "collateral:")], "A loan agreement on a desk: four stamped boxes light in turn; a small house and a tractor sit beside the collateral box with a padlock."),
 ],
 "b03": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("debt-trap", [L("repayment depends crucially on income from farming", "ri"), L("the crop fails → the debt grows", "dg"), L("DEBT TRAP", "dt"), L("risk · and support if things go wrong", "rs")]),
   [("ri", "crucially"), ("dg", "grew."), ("dt", "debt"), ("rs", "support")], "Swapna's field in two seasons: a thin harvest, a moneylender at the gate; then a small safety net stretched under the field; a balance tips from RISK to SUPPORT."),
 ],
 "b04": [
  ([0, 1, 2, 3], "analogy", A("debt-bars", [L("FORMAL · banks and cooperatives", "fm"), L("INFORMAL · moneylenders, traders, employers, relatives and friends", "if")], mode="kinds"),
   [("fm", "Formal"), ("if", "Informal")], "Two columns: FORMAL (bank and cooperative icons) and INFORMAL (moneylender, trader, employer, relatives)."),
  ([4, 5, 6, 7], "analogy", A("debt-bars", [L("NSO · NSS 77th round · debt on 30 Jun 2018", "sv"), L("RURAL · institutional 66 · non-institutional 34", "rr"), L("URBAN · institutional 87 · non-institutional 13", "ur")], ref="e16_debt", mode="bars"),
   [("sv", "seventy-seventh"), ("rr", "rural"), ("ur", "eighty-seven")], "Two long bars, RURAL and URBAN, split into institutional (formal) and non-institutional in the table's proportions."),
 ],
 "b05": [
  ([0, 1, 2, 3, 4], "analogy", A("graph-trap", [L("NCERT text: 'only about half'", "tx"), L("NCERT graph: formal = 66%", "gr"), L("BOTH ARE IN NCERT", "bt"), L("matches the survey · use the graph", "sv")], ref="e16_graph"),
   [("tx", "text"), ("gr", "graph"), ("bt", "Both"), ("sv", "survey,")], "A textbook page card with the sentence underlined in red; a graph card with three formal slices adding to 66; a notebook tag: USE THE GRAPH, NAME THE SURVEY."),
 ],
 "b06": [
  ([0, 1, 2, 3, 4], "analogy", A("supervision", [L("FORMAL · the Reserve Bank supervises", "fs"), L("minimum cash balance checked", "cb"), L("banks report: how much · to whom · at what rate", "rp"), L("INFORMAL · no organisation supervises (NCERT)", "is")]),
   [("fs", "supervises"), ("cb", "cash"), ("rp", "report"), ("is", "organisation")], "A bank counter with an RBI inspector's chair and a reports tray; beside it a moneylender's table with a few notes and an empty chair (no ledger)."),
 ],
 "b07": [
  ([0, 1, 2, 3, 4], "analogy", A("access-ladder", [L("richer households receive formal credit", "rh"), L("the poor depend on informal sources", "pd"), L("the poor should get a much greater share", "gs"), L("absence of collateral · one of the major reasons", "ac")]),
   [("rh", "richer"), ("pd", "depend"), ("gs", "greater"), ("ac", "collateral")], "A ladder against a bank counter: the top rungs crowded; the lowest rung empty with a padlock marked COLLATERAL; a shadow of a group approaches."),
 ],
 "b08": [
  ([0, 1, 2, 3], "analogy", A("shg-circle", [L("A TYPICAL SELF-HELP GROUP", "sg"), L("15–20 members", "mb"), L("saves ₹25 to ₹100 or more each", "sv"), L("eligible for a bank loan in the group's name", "el"), L("banks lend without collateral · the group is responsible for repayment", "gp")], mode="group"),
   [("sg", "self-help"), ("mb", "fifteen"), ("sv", "twenty-five"), ("el", "eligible"), ("gp", "collateral,")], "A circle of women and men on a floor mat with a savings box and a passbook; coins drop in; a bank officer opens a file marked GROUP LOAN."),
  ([4, 5], "analogy", A("shg-circle", [L("NABARD · 31 Mar 2024", "nb"), L("about 144 lakh groups · savings linked to banks", "sl"), L("about 77 lakh · also linked to bank credit", "cl")], ref="e16_shg", mode="numbers"),
   [("nb", "NABARD"), ("sl", "savings"), ("cl", "seventy-seven")], "A map-free counter: two stacks of small group icons, the larger labelled savings-linked, the smaller credit-linked."),
 ],
 "b09": [
  ([0, 1, 2, 3], "analogy", A("nobel-grameen", [L("NCERT's other example: Grameen Bank, Bangladesh", "gb"), L("NOBEL PEACE PRIZE 2006 · YUNUS AND GRAMEEN BANK", "nb"), L("efforts to create economic and social development from below", "ef"), L("10 Dec 2006: over 95% of borrowers are women", "wm")]),
   [("gb", "Grameen"), ("nb", "Norwegian"), ("ef", "efforts"), ("wm", "ninety-five")], "A prize plaque with names only (no faces); a village group at a table behind; a small women's share badge at the end."),
 ],
 "b10": [
  ([0, 1, 2, 3, 4], "analogy", A("jan-dhan", [L("PM JAN DHAN YOJANA · 19 Aug 2026", "pm"), L("59.09 crore accounts", "ac"), L("55.7% of account holders are women", "wm"), L("77.8% of accounts rural and semi-urban", "ru"), L("Ministry of Finance · PIB · 27 Aug 2026", "mf")], ref="e16_jd"),
   [("pm", "Pradhan"), ("ac", "fifty-nine"), ("wm", "Women"), ("ru", "seventy-seven"), ("mf", "Finance")], "A row of passbooks growing into a wall; two split bars: women's share of account holders, rural and semi-urban share of accounts; no flags, no leaders."),
 ],
 "b11": [
  ([0, 1, 2, 3], "analogy", A("institutions", [L("POST OFFICE · savings schemes", "po"), L("NSC · Kisan Vikas Patra", "ns"), L("NABARD · funds banks that lend for farming, village industries, rural infrastructure", "nb"), L("RBI · the banker to banks", "rb")]),
   [("po", "Post"), ("ns", "National"), ("nb", "NABARD"), ("rb", "Reserve")], "Three small buildings in a row: a post office with a savings certificate in the window; NABARD with a field and a village tile; the RBI with a line of banks' doors leading to it."),
 ],
 "b12": [
  ([0, 1, 2, 3], "analogy", A("accounts", [L("SAVINGS · interest · limited withdrawals", "sa"), L("CURRENT · for businesses · no interest", "cu"), L("FIXED DEPOSIT · fixed period · usually higher interest", "fd")]),
   [("sa", "savings"), ("cu", "current"), ("fd", "fixed")], "Three passbooks fan out: SAVINGS, CURRENT, FIXED."),
  ([4, 5], "analogy", A("accounts", [L("COMPOUNDING · NCERT's example", "cm"), L("₹1,000 at 6% a year", "p"), L("12 years", "yr"), L("→ ₹2,012.20", "fv")], ref="e16_comp", mode="compound"),
   [("cm", "compounding"), ("p", "thousand"), ("yr", "twelve"), ("fv", "paise.")], "A seedling of coins grows year by year, a counter ticking to 12; a card shows the final amount."),
 ],
 "b13": [
  ([0, 1, 2, 3, 4], "analogy", A("payment-modes", [L("NOW · HOW MONEY MOVES", "hm"), L("CASH · withdrawal slip · ATM (debit card + PIN)", "ca"), L("CHEQUE · paper · takes time", "ch"), L("ELECTRONIC · debit card at a PoS machine · net banking · mobile payment", "el")]),
   [("hm", "moves."), ("ca", "cash,"), ("ch", "cheque."), ("el", "electronically:")], "A counter with a slip and notes; an ATM; a cheque on a clipboard with a clock beside it; a PoS machine and a phone with a QR code, each lighting in turn."),
 ],
 "b14": [
  ([0, 1, 2, 3, 4], "analogy", A("upi-chain", [L("UPI · Unified Payments Interface", "up"), L("launched 2016 by NPCI", "np"), L("QR code or phone number", "qr"), L("payer's app", "pa"), L("payer's bank", "pb"), L("NPCI checks the UPI PIN, processes", "nc"), L("receiver's bank", "rb")]),
   [("up", "UPI,"), ("np", "NPCI,"), ("qr", "QR"), ("pa", "app,"), ("pb", "then"), ("nc", "checks"), ("rb", "receiver's")], "A four-box chain of icons with a flowing coin: PAYER'S APP, PAYER'S BANK, NPCI (a lock for the PIN check), RECEIVER'S BANK; a phone with a QR scan at the left."),
 ],
 "b15": [
  ([0, 1, 2], "analogy", A("upi-compare", [L("RBI payment-system data · June 2026 (provisional)", "sr"), L("UPI · about 2,272 crore payments", "up"), L("average about ₹1,273", "av")], ref="e16_upi", mode="upi"),
   [("sr", "provisional"), ("up", "two"), ("av", "average")], "A vast UPI strip of tiny coins fills the frame; a counter and an average tag."),
  ([3, 4, 5], "analogy", A("upi-compare", [L("UPI : cheques cleared (CTS) · about 534 : 1", "rt"), L("RTGS · about 3.2 crore payments · average about ₹72 lakh", "rg")], ref="e16_upi", mode="compare", limit="our arithmetic from the published figures; the strips are not to scale"),
   [("rt", "five"), ("rg", "RTGS")], "Three horizontal strips: a vast UPI strip, a thin CHEQUE strip, an RTGS strip of few very large blocks; a ratio badge."),
 ],
 "b16": [
  ([0, 1, 2], "analogy", A("fraud", [L("NCERT: beware of fraud and scams", "fr"), L("never share account numbers, passwords or OTPs with strangers", "sh"), L("avoid clicking unknown links", "lk"), L("helpline 1930 · National Cybercrime Reporting Portal", "hl")]),
   [("fr", "fraud."), ("sh", "share"), ("lk", "unknown"), ("hl", "helpline")], "A phone showing an incoming link with a red cross; a hand covers an OTP; a helpline card with 1930 glows."),
 ],
 "b17": [
  ([0, 1, 2, 3], "analogy", A("syndicated", [L("PRELIMS 2024 · GS I · Q52", "q"), L("I · syndication spreads the risk of default across several lenders", "s1"), L("II · a syndicated loan can be a lump sum, but cannot be a credit line", "s2")], mode="question"),
   [("q", "Prelims"), ("s1", "spreads"), ("s2", "lump")], "Two statement cards on an exam paper."),
  ([4, 5, 6, 7, 8, 9, 10], "analogy", A("syndicated", [L("BIS, 2004: more efficient geographical and institutional sharing of risk", "bq"), L("BIS, March 2022: a group of lenders funds one loan", "bg"), L("credit lines and term loans", "cl"), L("BY OUR REASONING · I correct · II not · option C", "ans"), L("UPSC's own key: not read", "nk")], mode="answer"),
   [("bq", "sharing"), ("bg", "group"), ("cl", "credit"), ("ans", "reasoning,"), ("nk", "read")], "A big loan drawn as a pie of several banks' shares around one borrower; a credit-line gauge and a lump-sum block both labelled SYNDICATED; a stamp BY OUR REASONING."),
 ],
 "b18": [
  ([0, 1, 2, 3, 4, 5, 6, 7], "notebook", dict(who=KID, strike=dict(text="credit always helps?", key="x"), lines=[
        dict(text="Credit = an agreement: lender supplies, borrower promises to pay later", key="n1"),
        dict(text="Terms: interest rate · collateral · documents · mode of repayment", key="n2"),
        dict(text="Helps or traps: the risk, and support if things go wrong", key="n3"),
        dict(text="NCERT: RBI supervises formal lenders; no one supervises informal", key="n4"),
        dict(text="Self-help groups: the poor borrow in the group's name", key="n5"),
        dict(text="UPI: money between bank accounts through NPCI", key="n6")]),
   [("x", "exam,"), ("n1", "agreement:"), ("n2", "Terms"), ("n3", "Whether"), ("n4", "NCERT:"), ("n5", "Self-help"), ("n6", "UPI")],
   "Exam card: 'credit always helps?' struck out; the answer fills the page, one line per sentence."),
 ],
 "b19": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("part-wrap", [L("PART 1 · money = cash + deposits (NCERT)", "p1"), L("PART 2 · a loan opens a new deposit, within limits", "p2"), L("PART 3 · credit can help or trap", "p3"), L("Salim · Swapna", "ss"), L("the risk · and support if things go wrong", "rs")]),
   [("p1", "cash"), ("p2", "loan"), ("p3", "trap."), ("ss", "Swapna"), ("rs", "risk,")], "The three parts' key pictures fade in in a row: the money bar, the ledger, the two fields; the two fields end the sequence."),
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
    json.dump(dict(id="eco16-p3", format="long-16x9", target_minutes=8, script=SCRIPT, scenes=scenes), open(OUT, "w"), indent=1, ensure_ascii=False)
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
