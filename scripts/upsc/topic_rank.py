#!/usr/bin/env python3
"""Ranks the topics of the focus subjects (Economics, Geography, Polity) for the launch wave (AK, 3 Nov 2026: "select 10 high
demand topics in each subject and rank with JEV").

Two signals, kept separate and both shown:
  demand  measured on YouTube: the search results for the topic's own words; the biggest and the median view counts of
          the top results (what people already watch). Not a forecast for us.
  jev     TypeSafe Jev judges the topic's title and hook for our channel: curiosity, everyday relevance, clarity, urge to
          share, and fit for a short animated explainer; flags for "done to death" and "risky". It judges wording, not facts.
score = 0.5 * demand (log views, scaled 0-1 within the subject) + 0.5 * jev.

  zsh -lic 'TYPESAFE_API_KEY=$VIGIL_V2_TYPESAFE_API_KEY python3 -I scripts/upsc/topic_rank.py [--step demand|jev|rank|all]'
Writes research/upsc/_rank/demand.json, jev.json, and docs/upsc/planner/LAUNCH.md + launch.csv.
"""
import concurrent.futures, csv, json, math, os, pathlib, re, sys, time, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "research/upsc/_rank"
SUBJ = {"ECO": "Economics", "GEO": "Geography", "POL": "Polity"}
URL, MODEL = "https://api.typesafe.ai/v1/systemone", "jev-1.13.0"
CHANNEL = ("A YouTube channel of short animated cartoon explainers (about 10 minutes) that teach Indian Economics, Geography "
           "and Polity in depth, from NCERT and official sources, for school and college students, UPSC aspirants and curious "
           "adults in India. Each video starts from the viewer's daily life and is fun to learn.")
Q = {
    "curiosity": {"type": "score", "instructions": "Seeing `title` with the line in `hook` on YouTube, how strongly would an Indian student or curious adult want to click?",
                  "criteria": ["Not at all: feels like a dry school chapter.", "Mild interest: useful but easy to skip.",
                               "Strong pull: a real question they have wondered about.", "Irresistible: a question about their own money, country or daily life they need answered now."]},
    "everyday": {"type": "score", "instructions": "How much does the subject of `title` touch the daily life of ordinary people in India?",
                 "criteria": ["Not at all: only an exam fact.", "Indirectly: in the news or textbooks.", "Often: people meet it in prices, bills, weather or rights.", "Daily: almost everyone meets it every day."]},
    "clear": {"type": "score", "instructions": "How quickly would a viewer understand what the video `title` is about, with no context?",
              "criteria": ["Confusing jargon.", "Understandable after a second read.", "Clear on first read.", "Instantly clear and visual."]},
    "share": {"type": "score", "instructions": "After a video that answers `title`, how likely is a viewer to share it, comment or save it for revision?",
              "criteria": ["Unlikely.", "Some chance.", "Likely: useful to friends or for exam revision.", "Very likely: people send it to classmates and family."]},
    "fit": {"type": "score", "instructions": "How well can `title` be taught as `channel` describes: a drawable mechanism, map or story in about 10 minutes?",
            "criteria": ["Poor: abstract, nothing to draw.", "Weak: mostly lists.", "Good: a clear mechanism or story to animate.", "Perfect: a vivid, drawable mechanism with a daily-life hook."]},
    "saturated": {"type": "noul", "instructions": "Is `title` a topic that many big Indian education channels have already explained many times in short videos?"},
    "risky": {"type": "noul", "instructions": "Does `title` involve party politics, a disputed border or religion, or advice on money or health that viewers might act on?"},
}
SENSITIVE = {"POL-07", "POL-34", "GEO-35", "GEO-37"}   # Emergency, caste and politics, state borders, Indian Ocean geopolitics
W = {"curiosity": 0.3, "everyday": 0.2, "clear": 0.15, "share": 0.2, "fit": 0.15}


def topics():
    home = {r["topic"]: r["serial"] for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"}
    cat = [r for r in csv.DictReader(open(ROOT / "docs/upsc/catalogue.csv", encoding="utf-8"))
           if r["id"][:3] in SUBJ and r["tier"] == "C" and home.get(r["id"]) == SUBJ[r["id"][:3]]]
    for r in cat:
        cov = [c.strip() for c in r["covers"].split("·") if c.strip()]
        head = re.split(r"[:?]", r["title"])[0]
        r["query"] = f"{head} {cov[0] if cov else ''}".strip() + (" explained" if r["id"][:3] != "POL" else " indian constitution")
        r["hook"] = "; ".join(cov[:4])
    return cat


def yt_search(q):
    req = urllib.request.Request("https://www.youtube.com/results?search_query=" + urllib.parse.quote(q) + "&hl=en&gl=IN",
                                 headers={"User-Agent": "Mozilla/5.0", "Accept-Language": "en-IN,en;q=0.9"})
    h = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", h, re.S)
    if not m:
        return []
    vids = []

    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                t = (v.get("viewCountText") or {}).get("simpleText", "")
                n = int(re.sub(r"\D", "", t) or 0)
                vids.append(dict(title=(v.get("title", {}).get("runs") or [{}])[0].get("text", ""), channel=(v.get("ownerText", {}).get("runs") or [{}])[0].get("text", ""),
                                 views=n, age=(v.get("publishedTimeText") or {}).get("simpleText", ""), length=(v.get("lengthText") or {}).get("simpleText", ""), id=v.get("videoId")))
                return
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(json.loads(m.group(1)))
    return vids[:10]


def step_demand(T):
    f = OUT / "demand.json"
    d = json.load(open(f)) if f.exists() else {}
    qf = OUT / "queries.json"   # hand-written phrases as students type them: [English, Hindi in Latin letters]
    QQ = json.load(open(qf)) if qf.exists() else {}
    for r in T:
        if r["id"] in d:
            continue
        qs = QQ.get(r["id"], [r["query"]])
        v = []
        for q in qs:
            try:
                v += [dict(x, q=q) for x in yt_search(q)]
            except Exception as e:
                print("search failed", r["id"], q, e)
            time.sleep(1.2)
        v.sort(key=lambda x: -x["views"])
        top = [x["views"] for x in v[:5]]
        d[r["id"]] = dict(query=" | ".join(qs), max=(top[0] if top else 0), median5=(top[2] if len(top) > 2 else 0), top=v[:5])
        json.dump(d, open(f, "w"), indent=1, ensure_ascii=False)
        time.sleep(1.2)
    print(f"demand: {len(d)} topics searched")


def ask(r, key, tries=5):
    body = json.dumps({"model": MODEL, "state": {"title": r["title"], "hook": r["hook"], "channel": CHANNEL}, "questions": Q}).encode()
    for n in range(tries):
        try:
            req = urllib.request.Request(URL, data=body, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
            return json.load(urllib.request.urlopen(req, timeout=30))
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 529) or n == tries - 1:
                raise SystemExit(f"TypeSafe answered {e.code}: {e.read().decode(errors='replace')[:300]}")
        except (urllib.error.URLError, TimeoutError):
            if n == tries - 1:
                raise
        time.sleep(1.5 * 2 ** n)


def step_jev(T):
    key = os.environ.get("TYPESAFE_API_KEY") or sys.exit("no TypeSafe key in this shell")
    f = OUT / "jev.json"
    j = json.load(open(f)) if f.exists() else {}
    todo = [r for r in T if r["id"] not in j]
    with concurrent.futures.ThreadPoolExecutor(6) as ex:
        for r, res in zip(todo, ex.map(lambda r: ask(r, key), todo)):
            a = res["answers"]
            s = {k: a[k]["score"] / (len(Q[k]["criteria"]) - 1) for k in W}
            total = sum(W[k] * s[k] for k in W) - 0.12 * a["saturated"]["noul"] - 0.2 * a["risky"]["noul"]
            j[r["id"]] = dict(total=round(total, 3), **{k: round(v, 2) for k, v in s.items()}, saturated=round(a["saturated"]["noul"], 2), risky=round(a["risky"]["noul"], 2))
    json.dump(j, open(f, "w"), indent=1)
    print(f"jev: {len(j)} topics scored")


def step_rank(T):
    d = json.load(open(OUT / "demand.json")); j = json.load(open(OUT / "jev.json"))
    rows = []
    for p, subj in SUBJ.items():
        mine = [r for r in T if r["id"][:3] == p and r["id"] in d and r["id"] in j]
        lv = {r["id"]: math.log10(1 + d[r["id"]]["max"]) * 0.6 + math.log10(1 + d[r["id"]]["median5"]) * 0.4 for r in mine}
        lo, hi = min(lv.values()), max(lv.values())
        for r in mine:
            dem = (lv[r["id"]] - lo) / (hi - lo) if hi > lo else 0
            rows.append(dict(subject=subj, topic=r["id"], title=r["title"], demand=round(dem, 3), jev=j[r["id"]]["total"],
                             score=round(0.5 * dem + 0.5 * j[r["id"]]["total"], 3), max_views=d[r["id"]]["max"], median5=d[r["id"]]["median5"],
                             risky=j[r["id"]]["risky"], saturated=j[r["id"]]["saturated"], query=d[r["id"]]["query"],
                             best=(d[r["id"]]["top"][0]["title"][:70] + " | " + d[r["id"]]["top"][0]["channel"]) if d[r["id"]]["top"] else ""))
    ser = {r["topic"]: r for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"}
    top = {}
    for subj in SUBJ.values():
        sr = sorted([x for x in rows if x["subject"] == subj], key=lambda x: -x["score"])
        top[subj] = sr[:10]
        # a politically sensitive topic never opens a subject's launch (AK's no-politics rule): it moves to fourth place
        safe = [x for x in top[subj] if x["topic"] not in SENSITIVE][:3]
        top[subj] = safe + [x for x in top[subj] if x not in safe]
        for i, x in enumerate(sr, 1):
            x["rank"] = i
    # launch wave: the three subjects' top tens interleaved by rank (E1, G1, P1, E2...); playlists keep serial order
    wave = [top[s][i] for i in range(10) for s in SUBJ.values() if i < len(top[s])]
    (ROOT / "docs/upsc/planner").mkdir(parents=True, exist_ok=True)
    with open(ROOT / "docs/upsc/planner/launch.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=["order"] + list(rows[0].keys()) + ["parts"]); w.writeheader()
        for n, x in enumerate(wave, 1):
            w.writerow(dict(order=n, **x, parts=ser[x["topic"]]["part"].split("/")[-1] if x["topic"] in ser and ser[x["topic"]]["part"] else 1))
    with open(OUT / "all_ranked.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(sorted(rows, key=lambda x: (x["subject"], x["rank"])))
    md = ["# Launch wave: top 10 topics per subject (rendered by `scripts/upsc/topic_rank.py`)", "",
          "Score = half measured YouTube demand (views of what people already watch for the topic's own words, scaled within the "
          "subject) and half Jev's judgement of our title for our channel. Demand is not a forecast for us; Jev judges wording, not facts. "
          "Release order interleaves the subjects by rank; the playlists keep the serial order in `SERIES.md`.", ""]
    for subj in SUBJ.values():
        md += [f"## {subj}", "", "| Rank | Topic | Episode | Score | Demand | Jev | Top video now (views) | Flags |", "|---:|---|---|---:|---:|---:|---|---|"]
        for x in top[subj]:
            fl = ", ".join(f for f, v in (("risky", x["risky"]), ("done often", x["saturated"])) if v >= 0.5)
            md.append(f"| {x['rank']} | {x['topic']} | {x['title']} | {x['score']:.2f} | {x['demand']:.2f} | {x['jev']:.2f} | {x['best']} ({x['max_views']:,}) | {fl} |")
        md.append("")
    md += ["## Release order (launch wave)", "", "| # | Subject | Topic | Episode |", "|---:|---|---|---|"]
    md += [f"| {n} | {x['subject']} | {x['topic']} | {x['title']} |" for n, x in enumerate(wave, 1)]
    md += ["", "All candidates with both scores: `research/upsc/_rank/all_ranked.csv`."]
    (ROOT / "docs/upsc/planner/LAUNCH.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    for subj in SUBJ.values():
        print(subj, [f"{x['topic']} {x['score']:.2f}" for x in top[subj]])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    step = sys.argv[sys.argv.index("--step") + 1] if "--step" in sys.argv else "all"
    T = topics()
    if step in ("demand", "all"): step_demand(T)
    if step in ("jev", "all"): step_jev(T)
    if step in ("rank", "all"): step_rank(T)


if __name__ == "__main__":
    sys.exit(main())
