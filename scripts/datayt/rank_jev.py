#!/usr/bin/env python3
"""Data Kadai story ranker: score every lead in the story bank with Jev (TypeSafe), rank them, pick a month.

The miner (scripts/datayt/mine_stories.py) finds leads by arithmetic. It cannot tell whether a viewer would care.
This script asks Jev the questions code cannot answer, one small judgment each, about the lead's one-line finding:

  surprise   how unexpected the finding is to an ordinary adult in India              (Score, 5 levels)
  everyday   how close the thing measured is to a household's daily life              (Score, 5 levels)
  clear      how easy the finding is to follow on one hearing                         (Score, 4 levels)
  talk       how likely a viewer is to send it to someone from a state named          (Score, 4 levels)
  named      whether the thing counted is named in plain words                        (Noul)
  sensitive  whether it touches religion, caste, violence, deaths, crime, elections   (Noul)
  shaming    whether a resident would read it as running their state down             (Noul)
  topic      which subject it belongs to                                              (Choice)

Jev is weak at arithmetic, so every number stays in code: the size of the effect is the miner's score, and the caps
for the month (one lead per source table, a few per state, per topic and per format) are plain counting.
Two more judgments are asked about the measure alone, for the kinds of lead they can break: whether it is a rate
(a highest-against-lowest story on a total is only a big state against a small one), and whether higher is better
or worse (a "poor state at the top" lead is a paradox only if the top is the good end). Code applies the rule.
The month also allows one video per measure: code finds pairs of leads from different tables whose measures share a
word, and Jev says whether the two are the same quantity (rice output and rice area, gross and net irrigated area).
Jev reads wording, not tables. A lead it ranks high can still fail when a writer recomputes it (a leader that flips
year to year, a latest column that is an estimate). Those leads are listed with the reason in bank/rejected.json and
are kept out of the month; bank/scripts_index.json marks the leads that already have a script.
The answers are kept in public/datayt/bank/jev_answers.json keyed by lead and question set, so changing a weight in
WEIGHTS re-ranks without asking again. A Jev score is a judgment of the wording, not a forecast of views: after a
month of posts, compare it with the real numbers and change the weights.

Writes public/datayt/bank/ranked.json and docs/datakadai/bank/RANKED.md; with --month N also bank/month.json and
docs/datakadai/bank/MONTH.md.
Run from the repo root, on the machine whose login shell holds TYPESAFE_API_KEY:
  python3 scripts/datayt/rank_jev.py --dry            build the requests, count tokens and cost, send nothing
  python3 scripts/datayt/rank_jev.py --probe          score the probe leads only and say whether the order holds
  python3 scripts/datayt/rank_jev.py [--limit N]      score the leads (cached), rank, write the files
  python3 scripts/datayt/rank_jev.py --month 60       rank, then pick a month of N videos with spares
  python3 scripts/datayt/rank_jev.py --scripts        rank the scripts already written, by title: the order to build and post in
"""
import collections, concurrent.futures, hashlib, itertools, json, os, re, sys, time, urllib.error, urllib.request

BANK = "public/datayt/bank"
URL = "https://api.typesafe.ai/v1/systemone"
MODEL = "jev-1.13.0"            # pinned: a new model version means new answers, so the cache key carries it
PRICE = 0.042                   # US dollars per million input tokens (docs.typesafe.ai/models, read 11 Oct 2026)
WEIGHTS = {"surprise": 0.35, "talk": 0.25, "everyday": 0.25, "clear": 0.15}
SHAPE = {"share": "one state's share of the all-India total", "ls_share": "one state's share of the all-India total",
         "stack": "one state compared with the next few states added together", "ls_stack": "one state compared with the next few states added together",
         "race": "which state leads now against which state led about ten years ago", "climber": "a state's share of the all-India total, then and now",
         "faller": "a state's share of the all-India total, then and now", "pick": "two states compared on one measure",
         "gap": "the highest state against the lowest state on one rate", "outlier": "one state far from every other state on one measure",
         "rate_change": "how much a rate changed in one state over about ten years", "ls_change": "how much a count changed in one state between two years",
         "rank_jump": "a state's rank among the larger states, then and now", "paradox": "a state at one end on income per person and at the other end on another measure",
         "nfhs_extreme": "the highest or lowest state on a family health survey measure", "nfhs_india_change": "how an all-India family health survey figure changed between two rounds",
         "nfhs_state_change": "how a family health survey figure changed in one state between two rounds", "nfhs_urban_rural": "urban India against rural India on one measure"}
# what the builder can make today (scripts/datayt/build_beats.py): leads on other templates wait for a format
FORMAT = {"share": "share", "race": "race", "paradox": "paradox", "pick": "pick", "ranking": "countdown", "faceoff": "versus"}
# flags that keep a lead out of a month until someone has dealt with them; the lead stays in the ranked list
HOLD = {"stale year": "stale year", "thin lead": "thin lead", "read the answer: column meaning not parsed": "column not read yet",
        "sensitive topic": "sensitive: AK sign-off", "AK sign-off: sensitive subject": "sensitive: AK sign-off",
        "totals compared, not rates": "a total, not a rate", "extreme ratio: check for a tiny base": "extreme ratio",
        "not a paradox once the direction is read": "not a paradox", "rejected when the table was read": "rejected on reading"}
RATE_KINDS = {"gap", "outlier", "rank_jump", "rate_change", "paradox"}      # leads that only work if the measure is a rate
STOP = {"state", "wise", "statewise", "production", "area", "total", "number", "india", "national", "average", "estimates", "pattern", "different", "schemes", "under",
        "from", "with", "nfhs", "last", "columns", "against", "rate", "rates", "base", "prices", "the", "and", "for", "per", "who", "any"}
TOPICS = {"farming and crops": "Crops, harvests, irrigation, land use, fertiliser, farm credit.",
          "food, milk, fish and livestock": "Milk, eggs, meat, fish, cattle, poultry and what people eat.",
          "money, income and prices": "Income per person, wages, taxes, state budgets, debt, banks, deposits, loans, prices.",
          "jobs and industry": "Employment, unemployment, factories, companies, exports, mining, small businesses.",
          "health and family": "Births, deaths, hospitals, insurance, nutrition, marriage, children, the family health survey.",
          "education": "Schools, colleges, literacy, students, teachers.",
          "water, forests and weather": "Ground water, rivers, rain, forests, wildlife, pollution, heat, disasters.",
          "power and fuel": "Electricity, coal, solar, wind, cooking gas, petrol.",
          "roads, rail and travel": "Roads, railways, airports, vehicles, tourism, ports.",
          "phones and internet": "Mobile coverage, internet, digital payments, telecom.",
          "crime, courts and safety": "Crime, police, prisons, courts, accidents.",
          "government schemes and offices": "A named scheme's funds, beneficiaries, posts or offices, where the scheme itself is the subject.",
          "none of these": "The finding fits none of the other subjects."}
Q = {
    "surprise": {"type": "score", "instructions": "How unexpected would the statement in `finding` be to an ordinary adult in India who follows the news but has never looked at the statistics?", "criteria": [
        "The finding says what almost everyone already assumes, such as the most populous state having the largest count of something.",
        "The finding is new information but fits what people would expect of the states it names.",
        "The finding would make most people say they did not know that, without going against anything they believed.",
        "The finding names a state that most people would not have guessed for this measure.",
        "The finding goes against a common belief about a well-known state, or puts a state with a poor reputation ahead of states with a strong one."]},
    "everyday": {"type": "score", "instructions": "How close is the thing measured in `finding` to the daily life of an ordinary household in India?", "criteria": [
        "An administrative count that only officials deal with, such as funds sanctioned, posts filled, proposals received or committees formed under a scheme.",
        "An industry or infrastructure figure that households never see directly, such as transmission losses, mineral output or installed capacity.",
        "Something people know from the news or from their region but do not handle every week, such as tourist visits, forest area, factories or a crop grown elsewhere.",
        "Something many households deal with every month, such as a job, a salary, a bank account, a phone connection, a school or a hospital visit.",
        "Something almost every household eats, drinks, buys or pays for every week, such as milk, rice, sugar, eggs, fish, cooking gas, electricity or drinking water."]},
    "clear": {"type": "score", "instructions": "How easy is the statement in `finding` to understand when heard once, with no chart to look at?", "criteria": [
        "The statement uses a technical term, a scheme name or an unnamed column that has to be explained before it makes sense.",
        "The statement can be followed, but its meaning depends on a qualifier such as a price basis, an adjusted rate or a survey definition.",
        "The statement is one plain comparison, but the thing counted needs a few words of explanation.",
        "The statement is one plain comparison between named places about something everyone can picture, and a child could repeat it."]},
    "talk": {"type": "score", "instructions": "How likely is a viewer to send the statement in `finding` to a friend or relative from one of the states it names, or to comment in support of their own state?", "criteria": [
        "No state stands out: the finding is about India as a whole or about small territories few viewers come from.",
        "A state is named, but for a measure nobody feels proud of or competitive about.",
        "A large, well-known state is named for a result its residents would be pleased or surprised to see.",
        "Two or more large, well-known states are compared directly on something people take pride in, and one clearly comes out ahead."]},
    "named": {"type": "noul", "instructions": "Does `finding` name the thing that was counted or measured in plain words, so that a reader knows what the number refers to?", "criteria": {
        "true": "The measure is named, such as sugarcane production, homes with health insurance or domestic tourist visits.",
        "false": "The measure appears only as a question or scheme title, a column position such as 'last of 4 columns', or a term with no clear unit."}},
    "sensitive": {"type": "noul", "instructions": "Is `finding` about religion, caste, a tribe or community, communal or political violence, deaths, suicide, crime, sexual violence, alcohol, elections or a political party?"},
    "shaming": {"type": "noul", "instructions": "Would a reasonable resident of a state named in `finding` feel that it presents their state as backward, poor, dirty, unsafe or uneducated?"},
    "topic": {"type": "choice", "instructions": "Which subject does the statement in `finding` belong to?", "criteria": TOPICS},
}
QSET = hashlib.sha1(json.dumps([MODEL, Q], sort_keys=True).encode()).hexdigest()[:10]
Q_SAME = {"same": {"type": "noul", "instructions": "Do `a` and `b` describe the same quantity, or two closely related versions of one quantity, so that a viewer would feel two videos about them covered the same ground?", "criteria": {
    "true": "The same quantity or closely related versions of it, such as production of a crop and the area under that crop, gross and net irrigated area, wage rates for two kinds of rural worker, or one figure at current and at constant prices.",
    "false": "Different quantities, even when they come from the same field, such as rice and wheat, milk and eggs, or bank deposits and bank credit."}}}
PSET = hashlib.sha1(json.dumps([MODEL, Q_SAME], sort_keys=True).encode()).hexdigest()[:10]
Q_KIND = {
    "fair": {"type": "noul", "instructions": "Is the quantity named in `measure` a rate, a share, an average or a per-person figure, so that a large state and a small state can be compared on it directly?", "criteria": {
        "true": "A rate, percentage, average, yield per hectare, price index or per-person figure, such as an unemployment rate, a daily wage, yield of wheat or power available per person.",
        "false": "A total count or amount that is bigger simply because a state is bigger, such as installed capacity, total production, number of factories, total value added or kilometres of road."}},
    "direction": {"type": "choice", "instructions": "For the people of a state, is a higher figure on `measure` good news, bad news, or neither?", "criteria": {
        "higher is better": "A higher figure plainly means people are better off, such as clean drinking water, vaccination, schooling, wages or mobile coverage.",
        "higher is worse": "A higher figure plainly means people are worse off, such as unemployment, inflation, infant deaths, early marriage or anaemia.",
        "neither or unclear": "A higher figure is not plainly good or bad, or depends on the point of view, such as population under 15, births by caesarean or use of traditional family planning."}}}
KSET = hashlib.sha1(json.dumps([MODEL, Q_KIND], sort_keys=True).encode()).hexdigest()[:10]
# probe leads, found in the bank by the start of their title: my own reading of which should land high and which low,
# used to check Jev's answers on a handful of leads before a full run is trusted
PROBE = [("high", "Bihar: low income per person, but at the top end on: Villages with 5G"),
         ("high", "Uttar Pradesh has 49% of India's total: State-wise Production of Non-Foodgrains - Sugarcane"),
         ("high", "Andhra Pradesh is above the next 3 states together: State-wise Fish Production"),
         ("high", "Rajasthan is higher than Gujarat: State-wise Milk Production"),
         ("high", "Telangana is higher than Uttar Pradesh: State-wise Egg Production"),
         ("high", "Tamil Nadu led in 2014; Uttar Pradesh leads in 2024: State-wise Domestic Tourist Visits"),
         ("low", "Uttar Pradesh is above the next two states together: Training for Panchayati Raj Representatives"),
         ("low", "Assam has 50% of the national total: Setting up of New Water Treatment Plant"),
         ("low", "Rajasthan has 80% of the national total: Implementation of MILAN Mobile Application"),
         ("low", "Uttar Pradesh is 32.1 times Uttarakhand: Gross State Value Added by Economic Activity - Agriculture (Constant Prices)"),
         ("low", "Jharkhand moved from rank 18 to 2 of 19: State-wise Electricity Transmission & Distribution Losses"),
         ("low", "Andaman and Nicobar Islands moved by -26.3 points: Kids (2-4) in pre-school")]


def state_of(c):
    """What Jev sees for one lead: the finding in one line and what kind of comparison it is. Nothing else, so nothing distracts."""
    return {"finding": c["title"], "comparison": SHAPE.get(c["kind"], c["kind"])}


def ask(state, key, questions=Q, tries=5):
    body = json.dumps({"model": MODEL, "state": state, "questions": questions}).encode()
    for n in range(tries):
        req = urllib.request.Request(URL, data=body, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        try:
            return json.load(urllib.request.urlopen(req, timeout=30))
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 529) or n == tries - 1:
                raise SystemExit(f"TypeSafe answered {e.code}: {e.read().decode(errors='replace')[:400]}")
        except (urllib.error.URLError, TimeoutError):
            if n == tries - 1:
                raise
        time.sleep(1.5 * 2 ** n)


def flat(resp):
    """One lead's answers reduced to numbers: each Score as 0..1 with its confidence, each Noul as a probability, the topic and its confidence."""
    a, out = resp["answers"], {}
    for k, q in Q.items():
        if q["type"] == "score":
            out[k], out[k + "_conf"] = round(a[k]["score"] / (len(q["criteria"]) - 1), 3), round(a[k]["confidence"], 2)
        elif q["type"] == "noul":
            out[k] = round(a[k]["noul"], 3)
        else:
            out[k], out[k + "_conf"] = a[k]["choice"], round(a[k]["confidence"], 2)
    out["tokens"] = resp.get("usage", {}).get("input_tokens", 0)
    return out


def rank_of(c, j):
    """The order key. Jev's four graded judgments are weighted; an unnamed measure halves the result; a finding that shames a
    state or touches a sensitive subject is marked down; the miner's score (the size of the effect) moves it by up to 30%."""
    appeal = sum(w * j[k] for k, w in WEIGHTS.items())
    return round(100 * appeal * (0.5 + 0.5 * j["named"]) * (1 - 0.35 * j["shaming"]) * (1 - 0.25 * j["sensitive"]) * (0.7 + 0.3 * min(1, max(0, c["score"]) / 9)), 1)


def source_of(c):
    """The table or answer a lead came from: one video per source in a month."""
    k = c["key"].split("#")[0].split("|")
    return "|".join(k[:2]) if k[0] in ("LS", "NFHS", "COVERAGE") else k[0]


def checks(c, j):
    f = list(c["flags"])
    f += ["AK sign-off: sensitive subject"] if j["sensitive"] >= 0.5 else []
    f += ["reword: reads as running a state down"] if j["shaming"] >= 0.5 else []
    f += ["read the source: measure not named"] if j["named"] < 0.5 else []
    f += ["Jev unsure: read by hand"] if sum(w * j[k + "_conf"] for k, w in WEIGHTS.items()) < 0.4 else []
    return f


def measure_of(c):
    """The thing measured, cut out of the lead's title: no states, no year, no ministry."""
    t = c["title"].split("end on: ", 1)[1] if c["kind"] == "paradox" else c["title"].split(": ", 1)[1]
    return re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]|\([^)]*\)|State-?wise", " ", t, flags=re.I)).strip(" -*")


def kind_checks(R, cache, key):
    """For leads that need a rate or a direction: ask Jev about the measure, then let code decide whether the lead still stands."""
    need = [r for r in R if r["kind"] in RATE_KINDS]
    todo = sorted({measure_of(r) for r in need if f"kind|{measure_of(r)}|{KSET}" not in cache})
    with concurrent.futures.ThreadPoolExecutor(8) as ex:
        for m, resp in zip(todo, ex.map(lambda m: ask({"measure": m}, key, Q_KIND), todo)):
            a = resp["answers"]
            cache[f"kind|{m}|{KSET}"] = {"fair": round(a["fair"]["noul"], 3), "direction": a["direction"]["choice"], "direction_conf": round(a["direction"]["confidence"], 2)}
    n = collections.Counter()
    for r in need:
        k = cache[f"kind|{measure_of(r)}|{KSET}"]
        r["fair"], r["direction"] = k["fair"], k["direction"]
        if k["fair"] < 0.5:
            r["check"].append("totals compared, not rates")
        if r["kind"] == "gap" and r["numbers"].get("ratio", 0) > 12:
            r["check"].append("extreme ratio: check for a tiny base")
        if r["kind"] == "paradox":
            poor, top = "low income" in r["title"], "top end" in r["title"]
            if not (k["direction"] == "higher is better" and poor == top or k["direction"] == "higher is worse" and poor != top):
                r["check"].append("not a paradox once the direction is read")
        n.update(f for f in r["check"] if f in ("totals compared, not rates", "extreme ratio: check for a tiny base", "not a paradox once the direction is read"))
    print(f"  rate and direction: {len(need)} leads, asked {len(todo)} measures; " + ", ".join(f"{v} {k}" for k, v in n.most_common()))


def same_measures(pool, cache, key):
    """Pairs of measures in the pool that Jev says are one quantity. Code proposes a pair when two measures share a word; Jev decides."""
    words = lambda m: {w for w in re.findall(r"[a-z]{3,}", m.lower()) if w not in STOP}
    ms = sorted({measure_of(c) for c in pool})
    pairs = [(a, b) for a, b in itertools.combinations(ms, 2) if words(a) & words(b)]
    todo = [p for p in pairs if f"pair|{p[0]}|{p[1]}|{PSET}" not in cache]
    with concurrent.futures.ThreadPoolExecutor(8) as ex:
        for p, resp in zip(todo, ex.map(lambda p: ask({"a": p[0], "b": p[1]}, key, Q_SAME), todo)):
            cache[f"pair|{p[0]}|{p[1]}|{PSET}"] = {"same": round(resp["answers"]["same"]["noul"], 3), "tokens": resp.get("usage", {}).get("input_tokens", 0)}
    same = collections.defaultdict(set)
    for a, b in pairs:
        if cache[f"pair|{a}|{b}|{PSET}"]["same"] >= 0.5:
            same[a].add(b); same[b].add(a)
    print(f"  measures: {len(ms)} in the pool, {len(pairs)} pairs share a word, asked {len(todo)} "
          f"(${sum(cache[f'pair|{a}|{b}|{PSET}']['tokens'] for a, b in todo) / 1e6 * PRICE:.3f}), {sum(len(v) for v in same.values()) // 2} pairs are one quantity")
    return same


def pick_month(R, n, cache, key, spare=0.25):
    """The month's leads, best first, with caps so no table, measure, state, subject or format repeats too often. A game Short uses four pick leads."""
    want = round(n * (1 + spare))
    cap_state, cap_topic = max(4, want // 10), max(6, want // 6)
    cap_fmt = {"share": want // 4, "race": want // 4, "paradox": want // 5, "countdown": want // 5, "versus": want // 8, "pick": 4 * (want // 8)}
    fmt = lambda r: "countdown" if r["kind"] == "gap" else FORMAT.get(r["template"])
    held, waiting, pool = collections.Counter(), collections.Counter(), []
    for r in R:
        why = sorted({HOLD[f] for f in r["check"] if f in HOLD})
        if not fmt(r):
            waiting[r["template"]] += r["rank"] >= 45
        elif why:
            held[why[0]] += r["rank"] >= 40
        elif r["named"] >= 0.5:
            pool.append(r)
    pool = pool[:8 * want]
    same = same_measures(pool, cache, key)
    used, done, st, tp, fm, out = set(), set(), collections.Counter(), collections.Counter(), collections.Counter(), []
    # two passes: a full video has first claim on a measure, a game round takes what is left
    for r in [r for r in pool if fmt(r) != "pick"] + [r for r in pool if fmt(r) == "pick"]:
        f, s, m = fmt(r), source_of(r), measure_of(r)
        lead = r["numbers"].get("state") or r["numbers"].get("now") or r["numbers"].get("higher") or r["numbers"].get("high") or ""
        if s in used or m in done or same[m] & done or (lead and st[lead] >= cap_state) or tp[r["topic"]] >= cap_topic or fm[f] >= cap_fmt[f]:
            continue
        used.add(s); done.add(m); st[lead] += 1; fm[f] += 1
        tp[r["topic"]] += 0.25 if f == "pick" else 1
        out.append({**r, "format": f, "measure": m})
    out.sort(key=lambda r: -r["rank"])
    return out, fm, waiting, held


def rank_scripts(cache, key, path):
    """The scripts in bank/scripts_index.json in the order Jev rates their titles: the title is what a viewer sees first."""
    kinds = {"share": SHAPE["share"], "race": SHAPE["race"], "paradox": "one or two states against what income per person would suggest",
             "pick": "a game of four rounds: which of two states is higher", "over": "states where a figure passes 100%", "place": "how a place came to be part of India, by dates"}
    S = json.load(open(f"{BANK}/scripts_index.json"))
    todo = [x for x in S if f"{x['title']}|{QSET}" not in cache]
    for x in todo:
        cache[f"{x['title']}|{QSET}"] = flat(ask({"finding": x["title"], "comparison": kinds.get(x["type"], x["type"])}, key))
    json.dump(cache, open(path, "w"), indent=0, ensure_ascii=False)
    rows = sorted(({**x, **cache[f"{x['title']}|{QSET}"]} for x in S), key=lambda x: -rank_of({"score": 6}, x))
    L = ["# Data Kadai: scripts in hand, in Jev's order", "",
         f"Made by `scripts/datayt/rank_jev.py --scripts` with `{MODEL}`. The rank is Jev's reading of the title alone (0 to 100, same weights as `RANKED.md`); "
         "it says nothing about whether the numbers stand, which the builder's checks and the script review cover.", "",
         "| # | ID | Type | Title | Rank | Surprise | Everyday | Clear | Talk | Status |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    L += [f"| {n} | {x['id']} | {x['type']} | {x['title']} | {rank_of({'score': 6}, x)} | {x['surprise']:.2f} | {x['everyday']:.2f} | {x['clear']:.2f} | {x['talk']:.2f} | "
          f"{x.get('status', '')}{'; sensitive: AK sign-off' if x['sensitive'] >= 0.5 else ''}{'; reads as running a state down' if x['shaming'] >= 0.5 else ''} |" for n, x in enumerate(rows, 1)]
    L += ["", "## What each script says and what to read before it is voiced", ""]
    for x in rows:
        if x.get("claim"):
            L += [f"### {x['id']}. {x['title']}", "", f"- **Claim:** {x['claim']}", f"- **Numbers recomputed by the writer:** {x['numbers_checked']}", f"- **Read before voicing:** {x['verify_before_voicing']}", ""]
    open("docs/datakadai/bank/SCRIPTS.md", "w").write("\n".join(L) + "\n")
    for n, x in enumerate(rows, 1):
        print(f"  {n:2d} {rank_of({'score': 6}, x):5.1f}  {x['id']:7s} {x['title']}")


def main():
    dry, probe = "--dry" in sys.argv, "--probe" in sys.argv
    arg = lambda name: int(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else None
    C = json.load(open(f"{BANK}/candidates.json"))["candidates"]
    if probe:
        C = [{**c, "expect": e} for e, t in PROBE for c in C if c["title"].startswith(t)]
        len(C) == len(PROBE) or print(f"  note: {len(PROBE) - len(C)} probe leads are no longer in the bank")
    elif arg("--limit"):
        C = C[:arg("--limit")]
    per = len(json.dumps({"model": MODEL, "questions": Q})) / 4
    est = sum(per + len(json.dumps(state_of(c))) / 4 for c in C)
    print(f"{len(C)} leads, question set {QSET}, about {est / 1e6:.2f} million input tokens, about ${est / 1e6 * PRICE:.2f} at ${PRICE} per million")
    if dry:
        os.makedirs("out/datakadai/bank_check", exist_ok=True)
        json.dump({"model": MODEL, "state": state_of(C[0]), "questions": Q}, open("out/datakadai/bank_check/jev_request_sample.json", "w"), indent=1, ensure_ascii=False)
        return print("dry run: nothing sent; one sample request is in out/datakadai/bank_check/jev_request_sample.json")
    key = os.environ.get("TYPESAFE_API_KEY") or sys.exit("TYPESAFE_API_KEY is not set in this shell: nothing sent")
    path = f"{BANK}/jev_answers.json"
    cache = json.load(open(path)) if os.path.exists(path) else {}
    if "--scripts" in sys.argv:
        return rank_scripts(cache, key, path)
    todo = [c for c in C if f"{c['title']}|{QSET}" not in cache]
    spent = 0
    with concurrent.futures.ThreadPoolExecutor(8) as ex:
        for n, (c, resp) in enumerate(zip(todo, ex.map(lambda c: ask(state_of(c), key), todo)), 1):
            cache[f"{c['title']}|{QSET}"] = flat(resp)
            spent += cache[f"{c['title']}|{QSET}"]["tokens"]
            if n % 200 == 0 or n == len(todo):
                json.dump(cache, open(path, "w"), indent=0, ensure_ascii=False)
                print(f"  asked {n} of {len(todo)}")
    print(f"asked {len(todo)}, reused {len(C) - len(todo)}; {spent} input tokens, ${spent / 1e6 * PRICE:.3f}")
    R = []
    for c in C:
        j = cache[f"{c['title']}|{QSET}"]
        R.append({**c, **{k: v for k, v in j.items() if k != "tokens"}, "rank": rank_of(c, j), "check": checks(c, j)})
    R.sort(key=lambda r: -r["rank"])
    if not probe:
        load = lambda f, d: json.load(open(f"{BANK}/{f}")) if os.path.exists(f"{BANK}/{f}") else d
        rejected = {v["title"] for v in load("rejected.json", {}).values()}
        written = {t: s["id"] for s in load("scripts_index.json", []) for t in s.get("lead_titles") or []}
        for r in R:
            r["check"] += ["rejected when the table was read"] if r["title"] in rejected else []
            r["check"] += [f"script written: {written[r['title']]}"] if r["title"] in written else []
        kind_checks(R, cache, key)
        json.dump(cache, open(path, "w"), indent=0, ensure_ascii=False)
    if probe:
        for r in R:
            print(f"  {r['rank']:5.1f}  expect {r['expect']:4s}  surprise {r['surprise']:.2f} everyday {r['everyday']:.2f} clear {r['clear']:.2f} talk {r['talk']:.2f} "
                  f"named {r['named']:.2f} sens {r['sensitive']:.2f} shame {r['shaming']:.2f}  {r['topic']}  | {r['title'][:70]}")
        hi, lo = [r["rank"] for r in R if r["expect"] == "high"], [r["rank"] for r in R if r["expect"] == "low"]
        wrong = sum(h < l for h in hi for l in lo)
        return print(f"probe: {len(hi) * len(lo) - wrong} of {len(hi) * len(lo)} high/low pairs in the expected order" + ("" if not wrong else ": read the rows above before a full run"))
    json.dump({"made_by": "scripts/datayt/rank_jev.py", "model": MODEL, "question_set": QSET, "weights": WEIGHTS, "ranked": R}, open(f"{BANK}/ranked.json", "w"), indent=1, ensure_ascii=False)
    row = lambda r: (f"| {r['id']} | {r['rank']} | {r['kind']} | {r['title'].replace('|', '/')} | {r['topic']} | {r['surprise']:.2f} | {r['everyday']:.2f} | {r['clear']:.2f} | "
                     f"{r['talk']:.2f} | {'; '.join(r['check']) or 'none'} |")
    head = ["| ID | Rank | Kind | Lead | Subject | Surprise | Everyday | Clear | Talk | Check before use |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    L = ["# Data Kadai story bank: leads ranked with Jev", "",
         f"Made by `scripts/datayt/rank_jev.py` with TypeSafe's `{MODEL}` (question set `{QSET}`) over the {len(R)} leads in `CANDIDATES.md`.", "",
         "Rank (0 to 100) = Jev's four judgments of the one-line finding, weighted " + ", ".join(f"{k} {w}" for k, w in WEIGHTS.items()) +
         "; halved when the measure is not named; marked down when it shames a state or is sensitive; moved by up to 30% by the miner's score for the size of the effect.",
         "A rank is a model's reading of the wording. It has not been compared with real views. Every lead still gets its number read at the publisher before a script.", "",
         "## Top 300", ""] + head + [row(r) for r in R[:300]]
    open("docs/datakadai/bank/RANKED.md", "w").write("\n".join(L) + "\n")
    print(f"ranked {len(R)}: top is {R[0]['rank']} ({R[0]['title'][:60]}); {sum(r['rank'] >= 45 for r in R)} at 45 or above")
    if arg("--month"):
        n = arg("--month")
        M, fm, waiting, held = pick_month(R, n, cache, key)
        json.dump(cache, open(path, "w"), indent=0, ensure_ascii=False)
        videos = sum(v / 4 if k == "pick" else v for k, v in fm.items())
        json.dump({"made_by": "scripts/datayt/rank_jev.py", "videos": n, "leads": M}, open(f"{BANK}/month.json", "w"), indent=1, ensure_ascii=False)
        L = [f"# Data Kadai: leads for a month of {n} videos", "",
             f"The best-ranked leads from `RANKED.md` under caps: one per source table, one per measure, a few per state and subject, and a spread of formats. "
             f"{len(M)} leads, enough for {videos:.0f} videos against a target of {n} plus a quarter spare (a game Short uses four `pick` leads).", "",
             "By format: " + ", ".join(f"{k} {v}" for k, v in fm.most_common()) + ".",
             "Ranks compare leads within a format. Across formats they are not like for like: a `pick` lead always sets two large states against each other, which Jev rates as easy to talk about.",
             "Leads at 45 or above that wait for a format the builder does not have yet: " + (", ".join(f"{k} {v}" for k, v in waiting.most_common()) or "none") + ".",
             "Leads at 40 or above held back: " + (", ".join(f"{k} {v}" for k, v in held.most_common()) or "none") + ".", ""]
        open("docs/datakadai/bank/MONTH.md", "w").write("\n".join(L + head + [row(r) for r in M]) + "\n")
        print(f"month: {len(M)} leads, {videos:.0f} videos' worth for a target of {n}; formats {dict(fm)}; waiting for a format {dict(waiting)}; held {dict(held)}")


if __name__ == "__main__":
    main()
