#!/usr/bin/env python3
"""Builds public/datayt/long/upsc/eco16-p1/storyboard.json from the locked script (ECO-16 Part 1, 4 Nov 2026).

The script is the single source of the words: research/upsc/ECO-16/script_p1.py in the main checkout
(/Volumes/DarwinSSD/DataKadai/mmvideo-dk). This file only cuts each beat into scenes and gives each scene a kind and a spec.
Every scene's vo is a run of whole sentences of its beat (or, for a few, a stretch of them), so the narration stays word for word the script.
Kinds and spec fields: src/looks/upsc_rich_b/CONTRACT_B.md (the look), CONTRACT_B_ECO1.md (the new `analogy` variants of this film).

  .venv/bin/python scripts/upsc/eco16_p1_storyboard.py      # writes the storyboard and prints a scene table
"""
import importlib.util, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/ECO-16/script_p1.py"
OUT = os.path.join(ROOT, "public/datayt/long/upsc/eco16-p1/storyboard.json")
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
  ([0, 1, 2], "analogy", A("phone-pay", [L("a fruit cart · a QR code", "fc")], mode="start"),
   [("fc", "fruit"), ("tap", "phone."), ("nn", "note")], "A fruit cart on a market street, a customer taps a phone at the QR code, a soft chime; the hands hold no note; a small balance moves between two phones."),
  ([3, 4, 5], "analogy", A("split-bar", [L("e16_m3cap", "cap"), L("e16_cash", "lc"), L("e16_dep", "ld")], ref="e16_m3", mode="hook"),
   [("cap", "M3,"), ("lc", "thirteen"), ("ld", "deposits,")], "A wide bar of all India's money: a thin slice of notes and coins at the left, a long band of bank deposits."),
  ([6, 7], "statement", dict(lines=[dict(text="What is money, really?", key="q1"), dict(text="And who makes it?", key="q2")], accent=["money", "makes"]),
   [("q1", "money,"), ("q2", "who")], "The two questions of the series on one card."),
 ],
 "b01": [
  ([0, 1], "statement", dict(lines=[dict(text="UPSC Economics (optional), Paper I", key="s1"), dict(text="“Demand for and Supply of Money”", key="s2")], accent=["Supply of Money"]),
   [("s1", "exam"), ("s2", "syllabus")], "Citation card: the syllabus line, text only."),
  ([2, 3, 4, 5, 6, 7, 8], "analogy", A("plan-path", [L("Why we want money", "w1"), L("What counts as money", "w2"), L("Who supplies it", "w3"),
        L("PART 1 · money and its supply", "p1"), L("PART 2 · how banks create money", "p2"), L("PART 3 · credit and payments", "p3")]),
   [("w1", "First,"), ("w2", "counts"), ("w3", "supplies"), ("p1", "three."), ("p2", "loan"), ("p3", "credit")], "A notebook page with three numbered boxes; below it a three-stop path, Part 1 lit, Parts 2 and 3 dim."),
 ],
 "b02": [
  ([0, 1, 2], "analogy", A("barter", [L("NCERT's example", "ex"), L("a shoe-maker wants wheat", "sw")], mode="stuck"),
   [("ex", "NCERT's"), ("sw", "shoe-maker")], "A market lane in atlas style: a shoe-maker with shoes, a wheat farmer with sacks; the farmer shakes his head and points to a plough."),
  ([3, 4, 5, 6, 7], "analogy", A("barter", [L("DOUBLE COINCIDENCE OF WANTS", "dc"), L("a go-between both sides accept", "gb"), L("MONEY", "mo")], mode="coin"),
   [("dc", "coincidence"), ("gb", "go-between"), ("mo", "money.")], "The same lane: a coin appears between them and the deal closes."),
 ],
 "b03": [
  ([0, 1, 2, 3, 4], "analogy", A("medium-exchange", [L("JOB 1 · MEDIUM OF EXCHANGE", "j1")]),
   [("j1", "medium")], "The shoe-maker hands over shoes for a coin, then hands the same coin to the farmer for wheat; the coin glows and travels."),
 ],
 "b04": [
  ([0, 1, 2, 3, 4], "analogy", A("unit-shelf", [L("JOB 2 · UNIT OF ACCOUNT", "j2"), L("e16_pen", "pe"), L("e16_pencil", "pc"), L("e16_pen5", "p5")], ref="e16_price"),
   [("j2", "unit"), ("pe", "pen"), ("pc", "pencil"), ("p5", "five")], "A stationery shelf: a pen with a rupee tag, a pencil with a tag; five pencils balance one pen."),
 ],
 "b05": [
  ([0, 1, 2, 3], "analogy", A("shrinking-basket", [L("JOB 3 · STORE OF VALUE", "j3"), L("PURCHASING POWER · what a rupee can buy", "pp")]),
   [("j3", "store"), ("pp", "purchasing")], "A jar of coins on a shelf; the shopping basket beside it holds less and less as price tags climb year by year."),
  ([4, 5, 6], "analogy", A("asset-shelf", [L("NCERT: the value of money must be sufficiently stable", "st"), L("gold", "ag"), L("land", "al"), L("bonds", "ab"), L("may not be easily converted", "cv")], mode="stable"),
   [("st", "NCERT"), ("ag", "Gold,"), ("al", "land"), ("ab", "bonds"), ("cv", "easily")], "A card for NCERT's line; a gold bar, a plot of land and a bond certificate stand on a shelf, each with a small padlock: slower to spend."),
 ],
 "b06": [
  ([0, 1, 2], "analogy", A("wallet-idle", [L("MONEY IN HAND EARNS NOTHING", "wi")]),
   [("wi", "pocket")], "A trouser pocket with one coin; a clock ticks; nothing grows."),
  ([3, 4, 5, 6], "analogy", A("sliders", [L("DEMAND FOR MONEY", "dm"), L("INCOME", "in"), L("INTEREST RATE", "ir")]),
   [("dm", "demand"), ("in", "income."), ("ir", "interest")], "Two sliders on a desk: income up, the wallet grows; interest rate up, coins hop from the wallet into a bank passbook."),
 ],
 "b07": [
  ([0, 1, 2, 3, 4], "analogy", A("three-jars", [L("e16_k1936", "k"), L("TRANSACTIONS · the week's shopping", "j1"), L("PRECAUTIONARY · a bad day", "j2"),
        L("SPECULATIVE · judging interest rates", "j3"), L("LIQUIDITY PREFERENCE", "lp")], chip="OUR PICTURE"),
   [("k", "Keynes"), ("j1", "transactions"), ("j2", "precautionary"), ("j3", "speculative"), ("lp", "liquidity")], "Three jars on a table: a shopping basket, an umbrella, a bond certificate; a plaque KEYNES 1936; a bracket across all three."),
 ],
 "b08": [
  ([0, 1, 2, 3], "analogy", A("bond-seesaw", [L("e16_b5", "b5"), L("e16_b6", "b6"), L("BOND PRICE FALLS AS THE RATE RISES", "bp")], ref="e16_bond", chip="TILT EXAGGERATED"),
   [("bp", "bond's"), ("b5", "five"), ("b6", "six")], "A bond certificate on a seesaw against a rate dial: dial up, the certificate sinks, the price tag ticks down."),
  ([4, 5, 6, 7, 8], "analogy", A("rate-crowd", [L("e16_hi", "hi"), L("buy bonds · hold little money", "bb"), L("e16_lo", "lo"), L("sell bonds · hold money", "sb"), L("SPECULATIVE DEMAND FALLS AS THE RATE RISES", "fl")]),
   [("hi", "high,"), ("bb", "buy"), ("lo", "low,"), ("sb", "sell"), ("fl", "falls")], "Two panels: at a high rate, a crowd walks to the bond counter; at a low rate, the crowd walks away from it to their wallets."),
 ],
 "b09": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("liquidity-tank", [L("INTEREST RATE", "ir"), L("everyone expects it to rise", "ex"), L("extra money just sits", "sit"), L("LIQUIDITY TRAP", "lt")], limit="the picture simplifies: the real rate is set by many things"),
   [("ir", "interest"), ("ex", "expects"), ("sit", "Hand"), ("lt", "trap.")], "A tank labelled interest rate with the water at the floor; a pump pours money in; it pools in wallets and the level does not move."),
 ],
 "b10": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("velocity-street", [L("one ₹100 note", "n0"), L("fruit seller", "n1"), L("milkman", "n2"), L("bus conductor", "n3")], chip="OUR PICTURE", limit="velocity is an average; a real note can sit idle"),
   [("n0", "rupee"), ("n1", "fruit"), ("n2", "milkman."), ("n3", "conductor.")], "One note travels hand to hand along a street: fruit seller, milkman, bus conductor; a counter ticks."),
  ([6, 7, 8], "analogy", A("formula-card", [L("VELOCITY OF CIRCULATION", "vc"), L("Md = k · T", "kt"), L("e16_vk", "v")], mode="velocity"),
   [("vc", "velocity"), ("kt", "k"), ("v", "divided")], "A formula card: velocity of circulation; the demand for money for payments as k times the value of transactions; v = 1 over k."),
 ],
 "b11": [
  ([0, 1, 2], "analogy", A("fisher-scale", [L("e16_f1911", "fi"), L("M × V = P × T · IGNOU's simple form", "ig"), L("THE EQUATION OF EXCHANGE", "eq")], mode="level"),
   [("fi", "Fisher"), ("ig", "IGNOU"), ("eq", "equation")], "A balance scale: money times speed on one pan, prices times trade on the other, level; a plaque FISHER 1911."),
  ([3, 4, 5], "analogy", A("fisher-scale", [L("TRADE FIXED · SPEED STEADY", "fx"), L("e16_x2", "db"), L("IF EITHER FAILS, THE LINK LOOSENS", "fl")], mode="double"),
   [("fx", "fixed"), ("db", "double"), ("fl", "fails,")], "The left pan doubles and the price tags double; a flag: only if trade and speed stay fixed; at the end the flag wobbles and the scale tilts loosely."),
 ],
 "b12": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("cambridge-k", [L("CAMBRIDGE", "cb"), L("SHARE OF INCOME KEPT AS MONEY", "sh"), L("e16_ck", "k"), L("e16_p1950", "pg")]),
   [("cb", "Cambridge"), ("sh", "share"), ("k", "k."), ("pg", "1950,")], "A wallet beside a salary slip with a dial showing the share kept as cash; the dial shrinks as an interest-rate arrow climbs."),
 ],
 "b13": [
  ([0, 1, 2, 3, 4], "analogy", A("asset-shelf", [L("FRIEDMAN", "fr"), L("MONEY IS ONE ASSET AMONG OTHERS", "as"), L("bonds", "bd"), L("shares", "sh"), L("physical goods", "pg"), L("human wealth", "hw"), L("monetarists: velocity fairly steady", "st")], mode="friedman", chip="PER IGNOU"),
   [("fr", "Friedman"), ("as", "asset"), ("bd", "Bonds,"), ("sh", "shares,"), ("pg", "physical"), ("hw", "wealth"), ("st", "steady.")], "A shelf of assets: cash, a bond, a share, goods, a tool kit for human wealth; a hand weighs each; a plaque FRIEDMAN."),
 ],
 "b14": [
  ([0, 1, 2, 3, 4], "analogy", A("press-mint", [L("NOTES · the Reserve Bank only", "rb"), L("e16_s22", "s2"), L("COINS · the Government of India", "co"), L("e16_coin", "cn")]),
   [("rb", "Reserve"), ("s2", "Act."), ("co", "Coins"), ("cn", "2011.")], "A printing press behind a glass wall, a note emerging with the RBI mark; a mint stamping a coin with the national emblem."),
 ],
 "b15": [
  ([0, 1, 2, 3], "analogy", A("fiat-note", [L("A NOTE HAS NO VALUE OF ITS OWN", "nv"), L("value = the issuer's guarantee", "gu"), L("FIAT MONEY", "fm")]),
   [("nv", "paper?"), ("gu", "guarantee."), ("fm", "fiat")], "A banknote under a lamp; its value drains out when the guarantee stamp lifts and returns when it is set back."),
  ([4, 5], "analogy", A("promise-note", [L("“I promise to pay the bearer”", "pr"), L("the Reserve Bank's own obligation to the holder", "ob"), L("e16_s26", "s6")]),
   [("pr", "promise"), ("ob", "obligation"), ("s6", "holds")], "A note close up, the promise clause glowing; the glow follows the note hand to hand and back to the RBI building."),
 ],
 "b16": [
  ([0, 1, 2, 3, 4], "analogy", A("legal-tender", [L("LEGAL TENDER", "lt"), L("every banknote in circulation, anywhere in India", "cr"), L("cannot be refused", "rf"), L("?", "q")]),
   [("lt", "legal"), ("cr", "circulation"), ("rf", "refused"), ("q", "minute.")], "A shop counter: a shopkeeper tries to push a note back; a red hand-stop appears over his palm; a small question mark floats (plant: the cheque)."),
 ],
 "b17": [
  ([0, 1, 2], "analogy", A("deposit-money", [L("MONEY IN A BANK ACCOUNT", "bk"), L("take it out on demand", "dm"), L("currency + deposits", "cd")]),
   [("bk", "bank"), ("dm", "demand"), ("cd", "currency")], "An account balance bar with an arrow: money can be taken out on demand; NCERT's line currency plus deposits."),
  ([3, 4, 5], "analogy", A("cheque", [L("a written order to the bank", "ch"), L("DEMAND DEPOSIT", "dd"), L("payable on demand", "pd")]),
   [("ch", "cheque,"), ("dd", "called"), ("pd", "payable")], "A customer writes a cheque; the money rises out of one account bar and into another."),
  ([6, 7, 8], "analogy", A("not-tender", [L("A CHEQUE CAN BE REFUSED", "rf"), L("DEPOSIT = MONEY", "dm"), L("NOT LEGAL TENDER", "nt")]),
   [("rf", "refused."), ("dm", "money,"), ("nt", "tender.")], "The shopkeeper nods at the cheque but his hand can wave it away; a badge flips: deposit = money, not legal tender."),
 ],
 "b18": [
  ([0, 1, 2, 3, 4, 5, 6, 7], "analogy", A("m-measures", [L("NCERT's four measures", "nc"), L("M1 · cash with the public + demand deposits", "m1"), L("M3 · M1 + time deposits", "m3"), L("M2 · adds post office savings", "m2"), L("M4 · adds post office deposits", "m4"),
        L("NARROW MONEY", "nr"), L("BROAD MONEY", "br"), L("M3 · most commonly used", "mc")]),
   [("nc", "NCERT"), ("m1", "M1"), ("m3", "M3"), ("m2", "M2"), ("m4", "M4"), ("nr", "narrow"), ("br", "broad"), ("mc", "commonly")], "M1 as a base block with two branches rising from it, M2 and M3; M4 above M3; brackets for narrow and broad; M3 glows."),
 ],
 "b19": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", A("m3-bar", [L("e16_m3cap", "cap"), L("e16_cash", "c"), L("e16_dd", "d"), L("e16_td", "t"), L("e16_oth", "o"), L("e16_q", "q")], ref="e16_m3", mode="split"),
   [("cap", "M3,"), ("c", "cash"), ("d", "demand"), ("t", "time"), ("o", "sliver,"), ("q", "quarter.")], "One tall bar fills in: a ribbon of notes, a slightly thinner band of demand deposits, a huge block of time deposits, a hairline of other RBI deposits; a bracket over the bottom two: about a quarter."),
 ],
 "b20": [
  ([0, 1, 2, 3], "analogy", A("base-tower", [L("HIGH-POWERED MONEY · currency issued by the central bank", "hp"), L("a basis for credit creation", "ba"), L("e16_1935", "rb")]),
   [("hp", "high-powered"), ("ba", "basis"), ("rb", "1935.")], "A small stone base labelled reserve money with a tall tower of deposits rising beside it; a question mark pulses at the tower's foot."),
  ([4, 5, 6], "analogy", A("paise-bar", [L("e16_paise", "fp"), L("deposits are most of the money", "dp"), L("HOW DOES CREDIT CREATION WORK?", "q")], ref="e16_cdr"),
   [("fp", "fifteen"), ("dp", "deposits."), ("q", "creation")], "A rupee in deposits beside fifteen paise of coins; a long block of deposits behind; the question grows."),
 ],
 "b21": [
  ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "notebook", dict(who=KID, strike=dict(text="money = notes and coins?", key="x"), lines=[
        dict(text="Three jobs: medium of exchange · unit of account · store of value", key="n1"),
        dict(text="Demand for money rises with income, falls as the interest rate rises", key="n2"),
        dict(text="Keynes: transactions · precaution · speculation", key="n3"),
        dict(text="Supply of money = currency + deposits", key="n4"),
        dict(text="Notes: the Reserve Bank · coins: the Government", key="n5"),
        dict(text="Both legal tender (coins up to limits) · a cheque is not", key="n6"),
        dict(text="M3 most commonly used (NCERT) · cash about 13%, July 2026", key="n7")]),
   [("x", "exam,"), ("n1", "jobs:"), ("n2", "demand"), ("n3", "Keynes"), ("n4", "supply"), ("n5", "Notes"), ("n6", "tender,"), ("n7", "NCERT")],
   "Exam card: 'money = notes and coins?' struck out; the answer fills the page, one line per sentence."),
 ],
 "b22": [
  ([0, 1, 2], "analogy", A("phone-pay", [L("a balance moves from one bank account to another", "bm")], mode="end"),
   [("bm", "balance")], "The phone tap again; the balance glides from one account bar to another."),
  ([3, 4, 5], "analogy", A("part2-seam", [L("where did that deposit come from?", "wd"), L("PART 2", "p2"), L("what stops a bank lending more?", "lm")]),
   [("wd", "deposit"), ("p2", "two:"), ("lm", "lending")], "The account bar's base shows a faint seam that opens: a new block grows out of nowhere. A frame: PART 2."),
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
    json.dump(dict(id="eco16-p1", format="long-16x9", target_minutes=9.5, script=SCRIPT, scenes=scenes), open(OUT, "w"), indent=1, ensure_ascii=False)
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
