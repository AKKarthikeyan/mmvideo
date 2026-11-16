#!/usr/bin/env python3
"""Builds the storyboard of ECO-12 (Who really pays a tax? GST and the rest) Part 1 or 2 from the audited script, adds the on-screen
quantities to figures.json (u7_labels / u7_claims, keys f12_*), and builds the estimated timeline. Look B; new art in
src/looks/upsc_rich_b/CONTRACT_B_ECO12.md (builder X1).

The script is the single source of the words: research/upsc/ECO-12/script_p<part>.py (draft 2, audit applied). This file only cuts
beats into scenes. Every quantity (rupees, paise, %) on screen comes from an f12_ label, each tied to a claim in claims.csv.

  python3 scripts/upsc/eco12_storyboard.py 1      # or 2
"""
import csv, importlib.util, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MAIN = os.environ.get("ECO12_MAIN") or os.path.join(ROOT, "research/upsc/ECO-12")
FIG = os.path.join(ROOT, "public/datayt/long/upsc/figures.json")
F12 = {
    "f12_paise": ("major subsidies: 6 paise of every rupee (Budget 2026-27, BE)", "E12-B08"),
    "f12_in": ("inputs ₹10 + ₹1 excise", "E12-E03"),
    "f12_pen": ("the pen: ₹20 + ₹2 excise = ₹22", "E12-E03"),
    "f12_vat": ("State VAT charged on all ₹22", "E12-E03"),
    "f12_petro": ("5 petroleum products: until the GST Council sets a date", "E12-E07"),
    "f12_wm": ("average GST rate ≈ 9.66% (old rates)", "E12-K02"),
    "f12_excise": ("Union excise now: only 5 petroleum goods and tobacco", "E12-C13"),
    "f12_17": ("17 taxes + 13 cesses (Finance Ministry)", "E12-F04"),
    "f12_vote": ("every decision: 3/4 of weighted votes, present and voting", "E12-D01"),
    "f12_union": ("the Centre: 1/3 of the vote", "E12-D01"),
    "f12_states": ("all the States together: 2/3", "E12-D01"),
    "f12_comp": ("compensation to States for 5 years", "E12-C17"),
}
QTY = re.compile(r"₹|\d+(\.\d+)?\s*(%|percent|paise|rupees?)|\d+\s*:\s*\d+", re.I)


def L(t, key, **k):
    d = dict(lab=t) if t.startswith("f12_") else dict(text=t)
    d.update(key=key, **k)
    return d


def A(which, labels=(), chip="", limit="", **k):
    return dict(which=which, chip=chip, limit=limit, labels=list(labels), **k)


def NB(lines, strike=None):
    d = dict(who="girl", lines=[dict(text=t, key=k) for t, k in lines])
    if strike: d["strike"] = dict(text=strike[0], key=strike[1])
    return d


P1 = {
 "b00": [([0, 1, 2, 3], "analogy", A("shop-bill", [L("YOUR BILL · GST", "bl"), L("the shop collects it and sends it on", "cs"), L("TRUE OR FALSE?", "tf")], mode="question"),
          [("bl", "GST."), ("cs", "collects"), ("tf", "True")], "A shop counter; a printed bill slides out with a GST line circled; a TRUE OR FALSE card.")],
 "b01": [([0, 1], "title", dict(title="Who really pays a tax?", sub="GST and the rest, part one", chip="ECONOMY · UPSC"), [], "Title card."),
         ([2, 3, 4], "analogy", A("series-path", [L("PART 1 · the economics", "p1"), L("PART 2 · GST in the Constitution", "p2"), L("PART 3 · the money", "p3")], mode="part1"),
          [("p1", "economics."), ("p2", "Constitution"), ("p3", "money.")], "The three-stop path, the first stop lit.")],
 "b02": [([0, 1, 2, 3], "analogy", A("treasury-flow", [L("NCERT: a compulsory payment to the government", "cp"), L("schools · hospitals · roads · defence", "sv"), L("ART. 265 · no tax without authority of law", "a265")]),
          [("cp", "compulsory"), ("sv", "schools,"), ("a265", "sixty-five")], "Coins flow from many hands into a treasury, then out to a school, a hospital, a road and a border post; ART. 265 stamps the flow.")],
 "b02b": [([0, 1, 2, 3, 4], "analogy", A("three-jobs", [L("NCERT: the Budget's three jobs", "bj"), L("ALLOCATION · public goods", "al"), L("REDISTRIBUTION · taxes and transfers", "rd"), L("STABILISATION", "st")]),
          [("bj", "three"), ("al", "Allocation"), ("rd", "Redistribution"), ("st", "Stabilisation")], "Three jars: a street light (an example), coins moving from a big pile to a small one, a see-saw being steadied.")],
 "b03": [([0, 1, 2], "analogy", A("tax-doors", [L("DIRECT · on income or profits", "dr"), L("INDIRECT · added to the price", "in"), L("income tax", "it"), L("GST", "gs")]),
          [("dr", "direct"), ("in", "indirect"), ("it", "like"), ("gs", "GST.")], "Two doors: DIRECT, where a salary slip goes in; INDIRECT, where a price tag goes in.")],
 "b04": [([0, 1, 2, 3, 4, 5], "analogy", A("shop-bill", [L("IMPACT · who hands it to the government", "im"), L("INCIDENCE · who finally bears it", "ic"), L("direct: the same person · indirect: can differ", "dd")], mode="split"),
          [("im", "Impact"), ("ic", "Incidence"), ("dd", "direct")], "The bill splits into two arrows: IMPACT to the shopkeeper and the government window, INCIDENCE to the customer's wallet.")],
 "b05": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("shop-bill", [L("CGST Act: the taxable person pays", "ca"), L("CBIC: the final consumer is to bear it", "cb"), L("FALSE", "fl")], mode="answer"),
          [("ca", "CGST"), ("cb", "CBIC's"), ("fl", "false.")], "The TRUE OR FALSE card flips to FALSE; an envelope goes to the government window, the same amount shows on the customer's price tag.")],
 "b06": [([0, 1, 2, 3, 4, 5], "analogy", A("tax-wedge", [L("IGNOU: buyers buy a little less", "ig"), L("the price rises by less than the tax", "pr"), L("BUYER'S SHARE · SELLER'S SHARE", "sh"), L("the split depends on how easily each can walk away", "el")]),
          [("ig", "IGNOU"), ("pr", "less"), ("sh", "absorbs"), ("el", "walk")], "A supply-demand diagram drawn in a notebook: a tax wedge between the curves, coloured BUYER and SELLER.")],
 "b07": [([0, 1, 2, 3, 4, 5], "analogy", A("staircases", [L("PROGRESSIVE · higher rate as income rises", "pg"), L("PROPORTIONAL · the same rate", "pp"), L("REGRESSIVE · a falling rate", "rg"), L("India's income tax: progressive", "ix")]),
          [("pg", "progressive"), ("pp", "proportional"), ("rg", "regressive"), ("ix", "India's")], "Three staircases: rising, flat, falling, a small figure on each.")],
 "b08": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("family-jars", [L("NCERT, IGNOU: indirect taxes are called regressive", "nr"), L("OUR READING", "or"), L("the same rupees: a bigger share of a smaller income", "sm")]),
          [("nr", "regressive,"), ("or", "reading."), ("sm", "share")], "Two family budgets as two jars, one small, one large; the same tax coin fills a bigger slice of the small one. Labelled OUR READING.")],
 "b09": [([0, 1, 2, 3, 4], "analogy", A("subsidy-tag", [L("a subsidy: the State pays so something costs less", "sb"), L("NCERT: explicit · implicit", "ex"), L("f12_paise", "pa"), L("the Budget's total includes the States' share of taxes", "bg")]),
          [("sb", "subsidy"), ("ex", "open,"), ("pa", "six"), ("bg", "Budget's")], "A price tag with a slice paid by a government hand; a rupee coin cut into slices, one slice highlighted.")],
 "b10": [([0, 1, 2, 3, 4, 5], "analogy", A("pen-chain", [L("CBIC's own example", "cx"), L("f12_in", "in"), L("f12_pen", "pn")], mode="excise"),
          [("cx", "CBIC's"), ("in", "inputs"), ("pn", "twenty")], "A pen on a factory desk; its parts arrive with a small excise tag; the finished pen gets its price tag.")],
 "b11": [([0, 1, 2, 3, 4, 5], "analogy", A("pen-chain", [L("f12_vat", "vt"), L("TAX ON TAX · NCERT: cascading", "cs"), L("excise could not be set off against State VAT", "so")], mode="vat"),
          [("vt", "VAT"), ("cs", "cascading."), ("so", "set")], "A second tag, VAT, stacks on the whole price tag; the stack wobbles: TAX ON TAX.")],
 "b12": [([0, 1, 2, 3], "analogy", A("credit-chain", [L("tax at every stage", "ts"), L("CREDIT for the tax paid before", "cr"), L("only the value added is taxed", "va"), L("NCERT: a tax on value addition", "nc")]),
          [("ts", "every"), ("cr", "credit"), ("va", "value"), ("nc", "NCERT")], "A chain of hands from factory to wholesaler to shop to customer; at each link a coin passes and a credit receipt comes back.")],
 "b13": [([0, 1, 2, 3, 4, 5], "analogy", A("destination-trucks", [L("CBIC: a destination tax", "ds"), L("within a State: CGST + SGST", "wi"), L("between States: IGST, shared", "bt")]),
          [("ds", "destination"), ("wi", "Inside"), ("bt", "Across")], "Two roads, no map: a truck stays inside one State (bill: CGST + SGST); a second crosses a State line sign (bill: IGST).")],
 "b14": [([0, 1, 2, 3], "analogy", A("outside-glass", [L("NOT IN GST", "ng"), L("alcohol for drinking · by definition", "al"), L("electricity · CBIC FAQ", "el"), L("f12_petro", "pt")]),
          [("ng", "not"), ("al", "Alcohol"), ("el", "electricity."), ("pt", "five")], "Three items behind a glass panel marked NOT IN GST: a bottle, a power line, a fuel nozzle with a calendar tag.")],
 "b15": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("bags-seesaw", [L("NCERT Class XI Statistics: a weighted mean", "wm"), L("f12_wm", "rt"), L("OLD RATES · the method is the point", "ol")]),
          [("wm", "weighted"), ("rt", "nine"), ("ol", "old")], "Five shopping bags of different sizes, each with a rate tag, on a see-saw that balances at the average. Stamp: OLD RATES, NCERT EXAMPLE.")],
 "b16": [([0, 1, 2, 3], "analogy", A("shop-bill", [L("BY LAW · the shop pays", "bl"), L("IN THE PRICE · you bear it", "ip"), L("how much passes on depends on buyers and sellers", "hm")], mode="answer"),
          [("bl", "law,"), ("ip", "price,"), ("hm", "respond.")], "The bill from the opening, answered."),
         ([4, 5, 6, 7, 8], "notebook", NB([("impact v incidence: who pays v who bears", "n1"), ("direct taxes stay; indirect taxes shift", "n2"), ("indirect taxes are called regressive", "n3"), ("cascading was tax on tax; GST credits earlier tax, at the destination", "n4")], ("the shop pays it all", "x")),
          [("x", "exam,"), ("n1", "Separate"), ("n2", "Direct"), ("n3", "regressive."), ("n4", "Cascading")], "The girl's notebook: the old claim struck out; the exam lines fill in.")],
 "b17": [([0, 1], "analogy", A("series-path", [L("PART 1 · the economics", "p1"), L("PART 2 · GST in the Constitution", "p2"), L("PART 3 · the money", "p3")], mode="part2"),
          [("p1", "tax"), ("p2", "Constitution"), ("p3", "two.")], "The three-stop path, the second stop glowing.")],
}

P2 = {
 "b00": [([0, 1, 2, 3], "analogy", A("council-table", [L("THE GST COUNCIL", "gc"), L("THE CENTRE ALONE?", "q1"), L("ALL THE STATES TOGETHER?", "q2")], mode="guess"),
          [("gc", "GST"), ("q1", "alone"), ("q2", "together")], "A long table from above: one Union chair, many chairs with blank State name cards; two question cards.")],
 "b01": [([0, 1], "title", dict(title="Who decides GST: Delhi or the States?", sub="GST and the rest, part two", chip="ECONOMY · UPSC"), [], "Title card."),
         ([2, 3, 4], "analogy", A("series-path", [L("PART 1 · who really pays", "p1"), L("PART 2 · GST in the Constitution", "p2"), L("PART 3 · the money", "p3")], mode="part2"),
          [("p1", "pays."), ("p2", "Constitution"), ("p3", "three.")], "The three-stop path, the second stop lit.")],
 "b02": [([0, 1, 2, 3], "analogy", A("two-lists", [L("UNION LIST", "ul"), L("STATE LIST", "sl"), L("OUR SUMMARY: excise and services with the Centre · sales with the States", "os"), L("ONE TAX ON THE WHOLE CHAIN?", "gs")], mode="locked"),
          [("ul", "Centre"), ("sl", "States"), ("os", "summary"), ("gs", "fit")], "Two locked boxes, UNION LIST and STATE LIST; a long GST card cannot fit into either.")],
 "b03": [([0, 1, 2, 3], "analogy", A("amendment-book", [L("Constitution (101st Amendment) Act, 2016", "am"), L("assent: 8 September 2016", "as"), L("Art. 279A: in force from 12 September", "c1"), L("the other changes: from 16 September", "c2")]),
          [("am", "hundred"), ("as", "assent"), ("c1", "Council"), ("c2", "later.")], "The Constitution book opens; a new page is stitched in; two calendar pins.")],
 "b04": [([0, 1, 2, 3], "analogy", A("two-lists", [L("ART. 246A · Parliament and the States both", "a246"), L("inter-State: Parliament only", "is"), L("ART. 269A · collected by the Centre, shared", "a269")], mode="open"),
          [("a246", "forty-six"), ("is", "border,"), ("a269", "sixty-nine")], "The two boxes open into one shared drawer; a truck's tax drops into a second drawer that splits in two.")],
 "b05": [([0, 1, 2, 3], "analogy", A("definition-page", [L("ART. 366(12A) · a tax on the supply of goods, services or both", "df"), L("except alcohol for drinking", "ex"), L("366(26A): services = anything other than goods", "sv")]),
          [("df", "supply"), ("ex", "alcohol"), ("sv", "services")], "A dictionary page in the Constitution; one item, a generic bottle, set outside the frame.")],
 "b06": [([0, 1, 2], "analogy", A("excise-cards", [L("ART. 268A (service tax): omitted", "om"), L("f12_excise", "ex")]),
          [("om", "removed."), ("ex", "petrol,")], "Old tax cards fade; six remain under UNION EXCISE: five fuel icons and a tobacco leaf.")],
 "b07": [([0, 1, 2, 3], "analogy", A("tax-funnel", [L("from the Centre: excise · service tax · extra customs duty", "fc"), L("from the States: VAT · CST · luxury · entry · entertainment …", "fs"), L("f12_17", "ct")]),
          [("fc", "Centre,"), ("fs", "States,"), ("ct", "seventeen")], "Tax cards from two sides pour into one funnel labelled GST.")],
 "b08": [([0, 1, 2, 3, 4], "analogy", A("council-table", [L("ART. 279A · the GST Council", "a279"), L("CHAIR · the Union Finance Minister", "ch"), L("with the Union Minister of State, revenue or finance", "ms"), L("every State: its finance or taxation minister", "st")], mode="seated"),
          [("a279", "seventy-nine"), ("ch", "chairs"), ("ms", "revenue"), ("st", "Every")], "The long table again: the Union chair labelled CHAIR; each State chair gets a blank name card.")],
 "b09": [([0, 1, 2, 3, 4, 5], "analogy", A("council-sheet", [L("THE COUNCIL RECOMMENDS", "cr"), L("taxes merged · exemptions · rates · thresholds", "ls"), L("the date for petrol, diesel and three other fuels", "dt"), L("NCERT: One Nation, One Tax, One Market", "nc"), L("the Constitution: a harmonised national market", "cn")]),
          [("cr", "recommends"), ("ls", "rates"), ("dt", "date"), ("nc", "NCERT"), ("cn", "Constitution's")], "A recommendation sheet with ticked lines; a fuel nozzle with a blank date card; two banners side by side.")],
 "b10": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("vote-meter", [L("f12_vote", "v"), L("f12_union", "u"), L("f12_states", "s"), L("OUR WORKING: neither alone reaches it", "ow")]),
          [("v", "three-fourths"), ("u", "Centre's"), ("s", "States"), ("ow", "working:")], "A vote meter: the Centre's block stops short of the line; the States' block stops short too; together they cross it.")],
 "b11": [([0, 1, 2, 3, 4], "analogy", A("padlocks", [L("half the State legislatures must ratify", "rt"), L("a way to settle Centre-State disputes", "dm"), L("f12_comp", "cp"), L("PART 3", "p3")]),
          [("rt", "ratification"), ("dm", "disputes"), ("cp", "compensation"), ("p3", "three.")], "Three padlocks on the Council's door; the third tagged PART 3.")],
 "b12": [([0, 1], "analogy", A("midnight-clock", [L("1 July 2017 · a midnight session of Parliament", "md"), L("NCERT: the biggest tax reform since Independence", "nc")]),
          [("md", "midnight,"), ("nc", "biggest")], "A clock striking twelve over a generic Parliament building; a calendar page turns.")],
 "b13": [([0, 1, 2, 3], "analogy", A("ship-freight", [L("Union of India v Mohit Minerals (2022)", "mm"), L("IGST on ocean freight", "ig"), L("STRUCK DOWN", "sd")]),
          [("mm", "shipping."), ("ig", "IGST"), ("sd", "struck")], "A cargo ship at sea; a tax tag on its freight is stamped STRUCK DOWN.")],
 "b14": [([0, 1, 2, 3, 4, 5, 6], "statement", dict(lines=[dict(text="The Union argued: recommendations must bind", key="ub"), dict(text="The Court: persuasive, not binding", key="cp"),
                                                      dict(text="Proposed Article {const:279}B: dropped", key="pb")], accent=["persuasive, not binding"]),
          [("ub", "Union"), ("cp", "persuasive,"), ("pb", "dropped")], "Citation card: the Union's argument and the Court's holding.")],
 "b15": [([0, 1, 2, 3, 4], "analogy", A("shared-pen", [L("rules under the CGST and IGST Acts: bound", "rb"), L("Parliament and the States keep their power to make laws", "lp"), L("federalism as a dialogue", "fd"), L("equal power to legislate on GST", "eq")]),
          [("rb", "rules"), ("lp", "legislatures"), ("fd", "dialogue"), ("eq", "equal")], "Two hands on one shared pen over a GST law page, neither above the other; speech bubbles going back and forth.")],
 "b16": [([0, 1, 2], "analogy", A("council-table", [L("OUR SUMMARY", "os"), L("BOTH TOGETHER · NEITHER ALONE", "bt"), L("each legislature keeps its law-making power", "lk")], mode="together"),
          [("os", "summary:"), ("bt", "both"), ("lk", "legislature")], "The long table, both sides' hands on the same document."),
         ([3, 4, 5, 6, 7, 8], "notebook", NB([("101st Amendment: Art. 246A, a shared power", "n1"), ("Art. 269A: inter-State tax, collected by the Centre and shared", "n2"),
                                             ("Art. 279A Council: three-fourths vote; Centre one-third, States two-thirds", "n3"), ("Mohit Minerals: persuasive, not binding · cooperative federalism", "n4")], ("Delhi decides", "x")),
          [("x", "exam,"), ("n1", "hundred"), ("n2", "sixty-nine"), ("n3", "Council"), ("n4", "Mohit")], "The girl's notebook: the old guess struck out; the exam lines fill in.")],
 "b17": [([0, 1], "analogy", A("series-path", [L("PART 1 · who really pays", "p1"), L("PART 2 · GST in the Constitution", "p2"), L("PART 3 · the money", "p3")], mode="part3"),
          [("p1", "twenty,"), ("p2", "promise"), ("p3", "three.")], "The three-stop path, the third stop glowing.")],
}


def sentences(t):
    return [s for s in re.split(r"(?<=[.?!])\s+", t.strip()) if s]


def main():
    part = sys.argv[1]
    script = os.path.join(MAIN, f"script_p{part}.py")
    spec = importlib.util.spec_from_file_location("ep", script); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    V, PLAN = mod.V, {"1": P1, "2": P2}[part]
    out = os.path.join(ROOT, f"public/datayt/long/upsc/eco12-p{part}/storyboard.json")
    claims = {r["claim_id"]: r for r in csv.DictReader(open(os.path.join(MAIN, "claims.csv"), encoding="utf-8"))}
    problems = []
    for k, (txt, cid) in F12.items():
        if cid not in claims or claims[cid]["status"] not in ("CONFIRMED", "CORRECTED"):
            problems.append(f"{k}: claim {cid} missing or not CONFIRMED/CORRECTED")
    fig = json.load(open(FIG, encoding="utf-8"))
    for k, (txt, cid) in F12.items():
        fig["u7_labels"][k] = txt; fig["u7_claims"][k] = cid
    fig["meta"]["f12_source"] = "research/upsc/ECO-12/claims.csv; u7_claims names the claim id of every f12_ value"
    json.dump(fig, open(FIG, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    scenes, n = [], 0
    for b in V["beats"]:
        ss, plan = sentences(b["say"]), PLAN.get(b["key"])
        if not plan:
            problems.append(f"{b['key']}: no plan"); continue
        used = sorted(i for p in plan for i in p[0])
        if used != list(range(len(ss))):
            problems.append(f"{b['key']}: scenes cover sentences {used} of {len(ss)}")
        for idx, kind, sp, reveals, visual in plan:
            n += 1
            vo = " ".join(ss[i] for i in idx if i < len(ss))
            words = re.findall(r"[\w'’-]+[.,?!:]?", vo)
            for key, word in reveals:
                if not any(w == word or w.rstrip(".,?!:") == word.rstrip(".,?!:") for w in words):
                    problems.append(f"s{n:03d} ({b['key']}): reveal word {word!r} not in vo")
            for lab in sp.get("labels", []):
                if "text" in lab and QTY.search(lab["text"]):
                    problems.append(f"s{n:03d}: a quantity typed in label {lab['text']!r} (use an f12_ key)")
            scenes.append(dict(id=f"s{n:03d}", act=f"Ch{b['ch']} {b['key']}", kind=kind, spec=sp, vo=vo, reveals=[dict(key=k, word=w) for k, w in reveals],
                               transition="cut", visual=visual, beat=b["key"], claims=b["claims"]))
    if " ".join(s["vo"] for s in scenes).split() != " ".join(b["say"] for b in V["beats"]).split():
        problems.append("storyboard vo is not word for word the script")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(dict(id=f"eco12-p{part}", format="long-16x9", target_minutes=8.0, script=os.path.relpath(script, ROOT), scenes=scenes), open(out, "w"), indent=1, ensure_ascii=False)
    kinds = {}
    for s in scenes:
        kk = s["kind"] + (":" + s["spec"]["which"] if s["kind"] == "analogy" else "")
        kinds[kk] = kinds.get(kk, 0) + 1
    print(f"{len(scenes)} scenes -> {out}\n  " + ", ".join(f"{k} {v}" for k, v in sorted(kinds.items())))
    for p in problems:
        print("  PROBLEM", p)
    if problems:
        return 1
    r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts/datayt/long_timeline.py"), out, "--out", out.replace("storyboard.json", "timeline.json")], capture_output=True, text=True)
    print(r.stdout.strip()[-300:], r.stderr.strip()[-300:])
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
