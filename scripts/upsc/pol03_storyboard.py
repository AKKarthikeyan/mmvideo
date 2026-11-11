#!/usr/bin/env python3
"""Builds the storyboards of POL-03 Parts 1 and 2 (Fundamental Rights, 10 Nov 2026) from the audited scripts, adds the on-screen
quantities to figures.json (u7_labels / u7_claims, keys f3_*), and builds each estimated timeline.

The scripts are the single source of the words: research/upsc/POL-03/script_p1.py and script_p2.py in the main checkout (audit fixes
applied). This file only cuts beats into scenes. Look: CONTRACT_B.md; this film's new analogy variants: CONTRACT_B_POL03.md (W1-W4).
Article numbers and years may appear as text; every quantity (%, counts, durations, splits) comes from an f3_ label.

  .venv/bin/python scripts/upsc/pol03_storyboard.py 1      # or 2
"""
import importlib.util, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MAIN = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/POL-03"
FIG = os.path.join(ROOT, "public/datayt/long/upsc/figures.json")
F3 = {
    "f3_rule": ("THE 50% RULE · DoPT order, 1993", "POL03-C22"),
    "f3_limits": ("the limits: creamy layer · the 50% ceiling · data", "POL03-C22"),
    "f3_lalung": ("held in judicial custody 54 years · released 2005 (NCERT)", "POL03-K07"),
    "f3_27": ("27% of central civil posts · the 1990 order", "POL03-C02"),
    "f3_half": ("SC + ST + OBC within 50% of a year's vacancies", "POL03-C22"),
    "f3_ews": ("EWS: up to 10% · 103rd Amendment, 2019", "POL03-B07"),
    "f3_split": ("upheld 3:2", "POL03-C12"),
    "f3_595": ("15 + 7.5 + 27 + 10 = 59.5% of central posts (our arithmetic)", "POL03-C24"),
    "f3_61": ("seven judges · 6:1", "POL03-C15"),
    "f3_kes": ("seven judges: no amendment may destroy the basic structure", "POL03-A08"),
    "f3_24h": ("before the nearest magistrate within 24 hours", "POL03-D20"),
    "f3_3m": ("beyond 3 months: an Advisory Board's report", "POL03-D21"),
    "f3_2m": ("2 months: the 1978 change, still not in force", "POL03-D21b"),
    "f3_9": ("nine judges · 24 Aug 2017", "POL03-D12"),
    "f3_zero": ("'privacy' in the Constitution: 0 results", "POL03-L05"),
    "f3_21a": ("Art. 21A: children aged 6 to 14", "POL03-D16"),
    "f3_child": ("no child under 14 in factories, mines or hazardous work", "POL03-E03"),
}
QTY = re.compile(r"\d+(\.\d+)?\s*(%|percent|hours?|months?|years?|judges?)|\d+\s*:\s*\d+", re.I)


def L(t, key, **k):
    d = dict(lab=t) if t.startswith("f3_") else dict(text=t)
    d.update(key=key, **k)
    return d


def A(which, labels=(), chip="", limit="", **k):
    return dict(which=which, chip=chip, limit=limit, labels=list(labels), **k)


def S(lines, accent=()):
    return dict(lines=lines, accent=list(accent))


def NB(lines, strike=None):
    d = dict(who="girl", lines=[dict(text=t, key=k) for t, k in lines])
    if strike: d["strike"] = dict(text=strike[0], key=strike[1])
    return d


P1 = {
 "b00": [([0, 1, 2], "analogy", A("ghat-steps", [L("Article 15(2)", "a1"), L("shops · public restaurants · wells · tanks · bathing ghats · roads", "pl")], mode="dawn"),
          [("a1", "Constitution"), ("pl", "shops,")], "River steps at dawn, people of every kind walking down to the water; the words of Article 15(2) appear on the steps."),
         ([3], "title", dict(title="Equal, but how?", sub="Fundamental Rights, part one", chip="POLITY · UPSC"), [], "Title card.")],
 "b01": [([0, 1, 2, 3], "analogy", A("balance", [L("EQUALITY", "eq"), L("RESERVATION", "rs")], mode="wobble"),
          [("eq", "equality?"), ("rs", "reserve")], "A balance scale: EQUALITY on one pan, RESERVATION on the other; it wobbles."),
         ([4, 5, 6, 7], "analogy", A("series-path", [L("PART 1 · what a right is · who it binds · equality", "p1"), L("PART 2 · freedom", "p2"), L("PART 3 · religion, culture, limits", "p3")], mode="part1"),
          [("p1", "one"), ("p2", "binds."), ("p3", "puzzle.")], "A three-stop path, Part 1 lit.")],
 "b02": [([0, 1, 2, 3, 4, 5, 6, 7], "analogy", A("wants-rights", [L("NCERT: a right is a justified claim", "jc"), L("WANTS", "wn"), L("RIGHTS", "rt"), L("claims on the state: must do · must not do", "cs")]),
          [("jc", "justified"), ("wn", "want"), ("rt", "well"), ("cs", "claims")], "The girl's notebook: two columns; a phone slides into WANTS, a well into RIGHTS.")],
 "b03": [([0, 1, 2, 3, 4, 5], "analogy", A("bill-glass", [L("NCERT: a bill of rights · Motilal Nehru committee, 1928", "br"), L("PART III", "p3"), L("a majority cannot vote them away", "mj"), L("YOU CAN GO TO COURT", "ct")]),
          [("br", "Motilal"), ("p3", "Part"), ("mj", "majority"), ("ct", "court.")], "A scroll unrolls into Part III; a vote counter pushes and stops at a glass wall; a courthouse door opens.")],
 "b04": [([0, 1, 2, 3, 4], "analogy", A("state-buildings", [L("ARTICLE 12 · THE STATE", "st"), L("Parliament · State legislatures · governments · local authorities", "ls"), L("Ajay Hasia (1980): an arm of the government counts", "ah")]),
          [("st", "twelve"), ("ls", "legislatures"), ("ah", "arm")], "Buildings light up one by one under one roof label THE STATE; a public-sector corporation joins them.")],
 "b05": [([0, 1, 2, 3, 4], "analogy", A("rulebook", [L("ARTICLE 13", "a13"), L("VOID · to that extent", "vd"), L("ordinance · rule · notification · custom", "lw")]),
          [("a13", "thirteen"), ("vd", "void,"), ("lw", "ordinance,")], "A rulebook with pages ORDINANCE, RULE, NOTIFICATION, CUSTOM; the page that crosses a right greys out with VOID stamped on it."),
         ([5, 6, 7], "statement", S([dict(text="UPSC Prelims {const:2026}: what counts as 'law' in Article {const:13}", key="q6"), dict(text="Prelims {const:2025}: can an ordinance take away a Fundamental Right?", key="q5")], ["Prelims"]),
          [("q6", "twenty-six,"), ("q5", "twenty-five,")], "Citation card: the two Prelims questions.")],
 "b06": [([0, 1, 2, 3, 4, 5], "analogy", A("frame-crane", [L("ARTICLE 368 · amendment", "am"), L("Art. 13(4): Article 13 does not apply", "a4"), L("f3_kes", "ks"), L("BASIC STRUCTURE · its own episode", "bs")]),
          [("am", "amending"), ("a4", "apply"), ("ks", "Kesavananda"), ("bs", "episode.")], "The Constitution as a building: a crane swaps bricks, but a glowing inner frame cannot be touched.")],
 "b07": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("two-circles", [L("EVERY PERSON · Arts 14, 20, 21, 22, 25", "ep"), L("CITIZENS ONLY · Arts 15, 16, 19, 29", "ci"), L("not 'every citizen' (NCERT Grade 8, corrected)", "nc")]),
          [("nc", "text"), ("ep", "person,"), ("ci", "citizens")], "Two circles: EVERY PERSON and, inside it, CITIZENS; article numbers drop into each.")],
 "b08": [([0, 1, 2, 3, 4], "analogy", A("judge-scale", [L("ARTICLE 14", "a14"), L("EQUALITY BEFORE LAW · same law, whatever the rank", "eb"), L("EQUAL PROTECTION · alike situations, alike treatment", "ep")]),
          [("a14", "fourteen."), ("eb", "rank."), ("ep", "similar")], "A judge's scale with a minister and a domestic worker on the same pan; then two queues of similar people treated alike."),
         ([5], "statement", S(["Maneka Gandhi (1978), lead opinion:", dict(text="equality is the opposite of arbitrary action", key="ar")], ["arbitrary"]), [("ar", "arbitrary")], "Quote card.")],
 "b09": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("ghat-steps", [L("ARTICLE 15", "a15"), L("shops · restaurants · wells · tanks · bathing ghats · roads", "pl"), L("as we read it: named because people were kept from them", "wr"), L("Art. 15(3): women and children", "wc")], mode="open"),
          [("a15", "fifteen"), ("pl", "shops,"), ("wr", "kept"), ("wc", "women")], "Back to the river steps: the ghat open to all; then a women's bus seat and a school ramp appear.")],
 "b10": [([0, 1, 2, 3, 4, 5], "analogy", A("three-cards", [L("ART. 16 · equal opportunity in public jobs", "a16"), L("ART. 17 · untouchability abolished", "a17"), L("PCR Act 1955 · PoA Act 1989", "lw"), L("ART. 18 · titles ended", "a18")]),
          [("a16", "sixteen"), ("a17", "seventeen"), ("lw", "Protection"), ("a18", "eighteen")], "Three cards: a job notice open to all; a broken chain across a village well; a crossed-out title beside a medal and a degree.")],
 "b11": [([0, 1, 2, 3, 4, 5], "analogy", A("balance", [L("ART. 16(4)", "c4"), L("not adequately represented, in the State's opinion", "ar"), L("NCERT: not a violation of equality", "nv"), L("Art. 15(4), First Amendment, 1951", "f4")], mode="steady"),
          [("c4", "clause"), ("ar", "adequately"), ("nv", "violation"), ("f4", "First")], "The scale steadies: the clause slides in as part of the EQUALITY pan.")],
 "b12": [([0, 1, 2, 3, 4, 5], "analogy", A("runners", [L("AS WE READ IT: treat unequal situations differently", "uq"), L("ART. 46 · weaker sections, 'with special care'", "a46"), L("ART. 335 · SC/ST claims, with efficiency of administration", "a335")]),
          [("uq", "unequal"), ("a46", "forty-six"), ("a335", "thirty-five")], "Two runners at different starting lines; a ramp lifts one to the line; a small balance labelled EFFICIENCY.")],
 "b13": [([0, 1, 2, 3, 4, 5], "analogy", A("mandal-desk", [L("MANDAL REPORT · 31 Dec 1980", "mr"), L("f3_27", "c27"), L("Indra Sawhney (1992), lead judgment", "is"), L("CREAMY LAYER · left out", "cl")]),
          [("mr", "Mandal"), ("c27", "twenty-seven"), ("is", "nine"), ("cl", "creamy")], "A report dated 1980; an order stamped 1990; then a family pyramid with its well-off top shaded out.")],
 "b14": [([0, 1, 2, 3, 4], "analogy", A("vacancy-bar", [L("f3_rule", "r5"), L("f3_half", "hf"), L("Jaishri Patil (2021): ceiling kept", "jp")], mode="half"),
          [("r5", "fifty"), ("hf", "half"), ("jp", "twenty-one,")], "A bar of a year's vacancies with a bright line at the half mark; coloured blocks fill up to it; a block above is stopped.")],
 "b15": [([0, 1, 2, 3, 4, 5, 6, 7], "analogy", A("vacancy-bar", [L("f3_ews", "ew"), L("f3_split", "sp"), L("Maheshwari J.: ceiling 'not inflexible'", "mh"), L("DISSENT: two judges", "ds"), L("f3_595", "ar")], mode="ews"),
          [("ew", "hundred-and-third"), ("sp", "three"), ("mh", "Maheshwari,"), ("ds", "dissented."), ("ar", "fifty-nine")], "The vacancy bar: a 10% block above the half line; five judges' chairs, three green, two amber marked DISSENT.")],
 "b16": [([0, 1, 2, 3, 4, 5], "analogy", A("sc-tree", [L("Davinder Singh (2024)", "dv"), L("f3_61", "s61"), L("sub-classification, with data", "sc"), L("ONE JUDGE'S OPINION · creamy layer among SCs · three agreed", "gj"), L("Art. 16(4A), 1995: promotion", "pr")]),
          [("dv", "debate"), ("s61", "seven"), ("sc", "sub-classify"), ("gj", "separate"), ("pr", "promotion")], "A tree of the SC list branching into groups, each with a small data chart; a scroll labelled ONE JUDGE'S OPINION with signatures.")],
 "b17": [([0, 1, 2, 3, 4, 5, 6, 7], "analogy", A("balance", [L("READ PLAINLY: part of the promise", "pp"), L("f3_limits", "lm")], mode="balanced"),
          [("pp", "plainly,"), ("lm", "limits.")], "The scale balanced, the limits written on its base."),
         ([8, 9, 10, 11], "notebook", NB([("Art. 14: equality before law", "n1"), ("Arts 15, 16: no discrimination, special provisions allowed", "n2"), ("16(4): reservation inside equality; courts set its limits", "n3")], ("break the promise?", "x")),
          [("x", "exam,"), ("n1", "fourteen"), ("n2", "Fifteen"), ("n3", "Sixteen")], "The girl's notebook: the old question struck out; the exam lines fill in.")],
 "b18": [([0, 1], "analogy", A("prison-gate", [L("NEXT · the freedoms, life and liberty", "nx")], mode="tease"),
          [("nx", "freedoms,")], "The girl closes the notebook; a prison gate in grey light, its lock glinting.")],
}

P2 = {
 "b00": [([0, 1, 2, 3], "analogy", A("prison-gate", [L("NCERT's opening story", "ns"), L("f3_lalung", "ml")], mode="closed"),
          [("ns", "NCERT"), ("ml", "fifty-four")], "A heavy prison gate in grey light; a calendar's pages flying past for decades."),
         ([4, 5], "statement", S([dict(text="Article {const:21}: no one shall lose life or personal liberty,", key="a21"), dict(text="except according to procedure established by law", key="pe")], ["procedure established by law"]),
          [("a21", "Article"), ("pe", "procedure")], "The words of Article 21 on the gate.")],
 "b01": [([0, 1, 2, 3, 4], "analogy", A("series-path", [L("PART 1 · equality", "p1"), L("PART 2 · freedom", "p2"), L("PART 3 · religion, culture, limits", "p3")], mode="part2"),
          [("p1", "equality."), ("p2", "freedom."), ("p3", "Then")], "The three-stop path, the second stop lit.")],
 "b02": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("six-doors", [L("ARTICLE 19(1) · six freedoms, for citizens", "a19"), L("SPEECH", "d1"), L("ASSEMBLY", "d2"), L("ASSOCIATION", "d3"), L("MOVEMENT", "d4"), L("RESIDENCE", "d5"), L("PROFESSION", "d6")], mode="open"),
          [("a19", "nineteen"), ("d1", "speak"), ("d2", "gather"), ("d3", "associations"), ("d4", "move"), ("d5", "settle"), ("d6", "profession,")], "Six doors in a row, each opening on its scene.")],
 "b03": [([0, 1, 2, 3, 4], "analogy", A("six-doors", [L("REASONABLE RESTRICTIONS", "rr"), L("speech: sovereignty · security · public order · decency · defamation · contempt · incitement", "sp"), L("movement: public interest · Scheduled Tribes", "mv")], mode="gates"),
          [("rr", "absolute."), ("sp", "Speech"), ("mv", "movement")], "Each door gets a small gate with a sign of its limits.")],
 "b04": [([0, 1, 2], "analogy", A("phone-66a", [L("Shreya Singhal (2015)", "ss"), L("SECTION 66A, IT ACT · struck down in full", "sd")]),
          [("ss", "twenty"), ("sd", "sixty-six")], "A phone screen with a post; a law-book page labelled 66A tears out and falls away.")],
 "b05": [([0, 1, 2, 3], "analogy", A("court-shields", [L("ARTICLE 20", "a20"), L("no retroactive offence", "s1"), L("no double punishment", "s2"), L("no forced self-incrimination", "s3")]),
          [("a20", "twenty"), ("s1", "offence"), ("s2", "twice"), ("s3", "witness")], "A courtroom in warm light; three shields appear in front of the accused, one per protection.")],
 "b06": [([0, 1, 2, 3, 4, 5], "analogy", A("glass-boxes", [L("ARTICLE 21", "a21"), L("Gopalan (1950), majority: rights in separate boxes", "gp"), L("NCERT Grade 9: 'strict adherence to... valid laws'", "nc"), L("to our ear: the Gopalan idea", "oe")], mode="boxes"),
          [("a21", "twenty-one."), ("gp", "Gopalan"), ("nc", "glossary"), ("oe", "ear,")], "Rights as separate glass boxes on a shelf; a stamped rulebook alone opens the liberty box.")],
 "b07": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("glass-boxes", [L("PASSPORT · IMPOUNDED", "pi"), L("Maneka Gandhi (1978), lead opinion: right, just and fair", "mg"), L("one judge dissented", "dj"), L("tested by Article 14", "t14"), L("RIGHTS OVERLAP", "ov")], mode="web"),
          [("pi", "passport"), ("mg", "lead"), ("dj", "dissented."), ("t14", "equality"), ("ov", "overlap.")], "A passport stamped IMPOUNDED; the glass boxes melt into one connected web.")],
 "b08": [([0, 1, 2, 3, 4], "analogy", A("privacy-search", [L("f3_zero", "z"), L("f3_9", "nj"), L("PRIVACY · under Article 21 and Part III", "pv")]),
          [("z", "privacy"), ("nj", "nine"), ("pv", "Privacy")], "A search box over the Constitution's text: 'privacy', 0 results; then nine chairs on a bench.")],
 "b09": [([0, 1, 2, 3, 4, 5, 6], "analogy", A("three-gates", [L("lead opinion, four judges", "lo"), L("LAW", "g1"), L("LEGITIMATE AIM", "g2"), L("PROPORTION", "g3"), L("your data: informational privacy", "dt"), L("DPDP Act 2023 · in force in stages", "dp")]),
          [("lo", "lead"), ("g1", "law"), ("g2", "legitimate"), ("g3", "proportionate"), ("dt", "data,"), ("dp", "protection")], "A phone, a bank card and a health app glow; three gates labelled LAW, AIM, PROPORTION stand before them.")],
 "b10": [([0, 1, 2, 3, 4, 5], "analogy", A("tree-21", [L("f3_21a", "ed"), L("86th Amendment 2002 · in force 2010 (NCERT says 2009)", "nc"), L("LIVELIHOOD · Olga Tellis (1985)", "lv"), L("CLEAN WATER AND AIR · Subhash Kumar (1991)", "wa")]),
          [("ed", "Education"), ("nc", "nine."), ("lv", "livelihood."), ("wa", "water")], "A tree growing from a seed labelled ARTICLE 21: branches EDUCATION, LIVELIHOOD, WATER AND AIR.")],
 "b11": [([0, 1, 2, 3, 4], "analogy", A("police-desk", [L("ARTICLE 22", "a22"), L("told the grounds · a lawyer of choice", "gr"), L("f3_24h", "h24"), L("D.K. Basu (1996): memo of arrest · a relative told", "dk")]),
          [("a22", "twenty-two"), ("gr", "lawyer"), ("h24", "magistrate"), ("dk", "memo")], "A police-station desk: an arrest memo signed and witnessed; a clock; a phone call to a relative.")],
 "b12": [([0, 1, 2, 3, 4], "analogy", A("detention-calendar", [L("PREVENTIVE DETENTION", "pd"), L("f3_3m", "m3"), L("f3_2m", "m2")]),
          [("pd", "preventive"), ("m3", "three"), ("m2", "two")], "A calendar marked at three months with an Advisory Board; a second marked two months behind glass labelled NOT IN FORCE.")],
 "b13": [([0, 1, 2, 3, 4, 5], "analogy", A("emergency-door", [L("ART. 359(1) · EMERGENCY", "em"), L("ARTICLES 20 AND 21 · never suspended", "ns"), L("Puttaswamy (2017), lead opinion: ADM Jabalpur (1976) overruled", "adm")]),
          [("em", "Emergency?"), ("ns", "twenty-one."), ("adm", "Jabalpur.")], "A courthouse door half shut by an EMERGENCY bar; two small doors marked 20 and 21 stay open.")],
 "b14": [([0, 1, 2, 3, 4], "analogy", A("stadium-wage", [L("ARTICLE 23 · no trafficking, no forced labour", "a23"), L("Asian Games works, 1982", "ag"), L("PUDR (1982): below minimum wage = forced labour", "pu"), L("binds private contractors too", "pc")]),
          [("a23", "twenty-three"), ("ag", "Asian"), ("pu", "forced"), ("pc", "private")], "A stadium under construction in 1982 light; a wage slip below a minimum line; a contractor's office gets the same notice.")],
 "b15": [([0, 1], "analogy", A("mine-school", [L("f3_child", "a24"), L("NCERT: manual scavenging banned by law, Dec 2013", "ms")]),
          [("a24", "fourteen"), ("ms", "scavengers.")], "A school bag replaces a pick at a mine entrance; a sanitation machine replaces a bucket.")],
 "b16": [([0, 1, 2, 3, 4], "analogy", A("prison-gate", [L("SINCE MANEKA GANDHI: fair, just, reasonable", "mg"), L("SINCE PUTTASWAMY: legitimate aim, proportionate means", "pt")], mode="open"),
          [("mg", "Maneka"), ("pt", "Puttaswamy,")], "The prison gate from the start opens onto daylight."),
         ([5, 6, 7, 8, 9], "notebook", NB([("Art. 19: six freedoms + reasonable restrictions", "n1"), ("Art. 20: protects the accused", "n2"), ("Art. 21: fair procedure (Maneka Gandhi)", "n3"), ("Art. 21 holds privacy, livelihood, water and air; 21A education", "n4")], ("any law will do?", "x")),
          [("x", "exam,"), ("n1", "nineteen"), ("n2", "accused."), ("n3", "Maneka"), ("n4", "privacy,")], "The girl's notebook: the exam lines fill in.")],
 "b17": [([0, 1], "analogy", A("series-path", [L("PART 1 · equality", "p1"), L("PART 2 · freedom", "p2"), L("PART 3 · religion, culture, remedies, Directive Principles", "p3")], mode="part3"),
          [("p1", "part"), ("p2", "religion,"), ("p3", "Directive")], "The three-stop path, the third stop glowing.")],
}


def sentences(t):
    return [s for s in re.split(r"(?<=[.?!])\s+", t.strip()) if s]


def main():
    part = sys.argv[1]
    script = f"{MAIN}/script_p{part}.py"
    spec = importlib.util.spec_from_file_location("ep", script); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    V, PLAN = mod.V, (P1 if part == "1" else P2)
    out = os.path.join(ROOT, f"public/datayt/long/upsc/pol03-p{part}/storyboard.json")
    fig = json.load(open(FIG, encoding="utf-8"))
    for k, (txt, cid) in F3.items():
        fig["u7_labels"][k] = txt; fig["u7_claims"][k] = cid
    fig["meta"]["f3_source"] = "research/upsc/POL-03/claims.csv in the main checkout; u7_claims names the claim id of every f3_ value"
    json.dump(fig, open(FIG, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    scenes, problems, n = [], [], 0
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
                    problems.append(f"s{n:03d}: a quantity typed in label {lab['text']!r} (use an f3_ key)")
            scenes.append(dict(id=f"s{n:03d}", act=f"Ch{b['ch']} {b['key']}", kind=kind, spec=sp, vo=vo, reveals=[dict(key=k, word=w) for k, w in reveals],
                               transition="cut", visual=visual, beat=b["key"], claims=b["claims"]))
    if " ".join(s["vo"] for s in scenes).split() != " ".join(b["say"] for b in V["beats"]).split():
        problems.append("storyboard vo is not word for word the script")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(dict(id=f"pol03-p{part}", format="long-16x9", target_minutes=8.0, script=script, scenes=scenes), open(out, "w"), indent=1, ensure_ascii=False)
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
    print(r.stdout.strip()[-250:], r.stderr.strip()[-250:])
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
