#!/usr/bin/env python3
"""Master plan: the whole UPSC syllabus (concept serials) and the Mains question-and-answer series, week by week.

  python3 -I scripts/upsc/master_plan.py [--concept 3] [--answers 6] [--themes 2] [--start 2026-11-16]

Pace (AK, 10 Nov 2026): 3 concept episodes, 6 answer videos (each with its Short) and 2 Ten Years videos a week; then AK asked to
speed up the answers: 10 answers (each with its Short) and 3 Ten Years a week, the defaults. Faster answers gain nothing, because each
answer waits for its concept episode; only a faster concept pace moves the end date further.

Writes docs/upsc/planner/MASTER.md and docs/upsc/planner/master.csv. Rules:
- Concept order (AK, 3 Nov 2026): the launch wave (launch.csv), then Economics, Geography, Polity, each finished before the next and
  each followed by its optional-depth season; then History, then Agriculture and its optional season. RBI Grade B is its own lane, last.
  International relations has no serial yet: its answers wait in their own bucket until one is planned.
- An answer video (format A) is scheduled only in or after the week its topic's concept episode is scheduled, so the answer can
  point back to the episode. GS questions come before optional ones, across all ready topics. Optional questions: up to OPT_PER_TOPIC per topic, latest first;
  the rest are shown as cousins inside those videos (docs/upsc/PYQ_ANSWERS_PLAN.md section 7).
- A Ten Years, One Idea video (format B) follows once every A of a topic with 5+ questions is scheduled.
- Every A gets its Answer Sheet Short (format C) in the same week. One Geography map round per sitting goes with GEO-40.
- Done = delivered to /Volumes/DarwinSSD/The UPSC Mains (a folder named for the topic, or an answer pilot in 'Mains Answers (pilots)').
"""
import csv, datetime as dt, os, pathlib, re, sys
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parents[2]
CH = pathlib.Path("/Volumes/DarwinSSD/The UPSC Mains/01 Videos")
FOCUS = ["Economics", "Geography", "Polity", "International relations"]   # IR beside Polity (AK, 10 Nov 2026)
LATER = ["History", "Agriculture"]
SUBJ = ["Economics", "Geography", "Polity", "International relations", "Agriculture"]
OPT_PER_TOPIC = 4
NEW = Counter()   # (subject, proposed episode) -> questions that wait for it
THEME_MIN = 5


def arg(flag, default):
    return type(default)(sys.argv[sys.argv.index(flag) + 1]) if flag in sys.argv else default


def concept_order():
    ser = [r for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"]
    launch = [r["topic"] for r in csv.DictReader(open(ROOT / "docs/upsc/planner/launch.csv", encoding="utf-8"))]
    order = [r for t in launch for r in ser if r["topic"] == t]
    for s in FOCUS + LATER:
        order += [r for r in ser if r["serial"] == s and r not in order]
        order += [r for r in ser if r["serial"] == f"{s} (optional)" and r not in order]
    order += [r for r in ser if r not in order]          # RBI Grade B and anything else, last
    return order


def delivered():
    done_topics, done_answers = set(), set()
    if CH.exists():
        for p in CH.iterdir():
            m = re.match(r"([A-Z]{3}-\d+)\b", p.name)
            if m and p.is_dir():                      # a part is done when its film is in the topic folder (xxx-pN_..., or one film for a 1-part topic)
                for f in p.glob("*.mp4"):
                    k = re.search(r"[-_][pP](\d+)[_.-]", f.name)
                    done_topics.add((m.group(1), k.group(1) if k else "1"))
        for sub, pat in (("Mains Answers (pilots)", "pyq_*_v2.mp4"), ("Mains Answers", "pyq_*_60fps_2k.mp4")):
            if (CH / sub).exists():
                for f in (CH / sub).glob(pat):
                    done_answers.add(f.name[4:].split("_60fps")[0].replace("_v2", ""))
    return done_topics, done_answers


def answer_items(done_answers):
    Q = list(csv.DictReader(open(ROOT / "research/upsc/_pyq/mains/questions.csv", encoding="utf-8")))
    NEW.clear()
    for q in Q:
        q["subject"] = {"Political theory": "Polity"}.get(q["subject"], q["subject"])
    Q = [q for q in Q if q["subject"] in SUBJ]
    slug = lambda q: f"{q['year']}-{q['paper']}-{q['q']}{q['part']}"
    items, buckets = [], Counter()
    by_topic = defaultdict(list)
    for q in Q:
        if q["paper"] == "geo2" and q["q"] == "1" and re.search(r"\bmap\b", q["text"], re.I) and q["part"] in ("a", ""):
            items.append(dict(kind="MAP", topic="GEO-40", subject="Geography", id=f"map-{q['year']}", title=f"Map round, Geography Paper II {q['year']}", gs=False, year=int(q["year"])))
            continue
        if not q["topic"]:
            if q.get("new_topic"):
                NEW[(q["subject"], q["new_topic"])] += 1
                buckets[f"{q['subject']}: waits for a new episode"] += 1
            else:
                buckets[f"{q['subject']}: no topic tag yet"] += 1
            continue
        by_topic[q["topic"]].append(q)
    for tid, qs in by_topic.items():
        gs = [q for q in qs if q["paper"].startswith("gs")]
        opt = sorted([q for q in qs if not q["paper"].startswith("gs")], key=lambda q: (-int(q["year"]), q["paper"], int(q["q"]), q["part"]))
        pick = [q for q in opt if slug(q) in done_answers]       # a made answer always stays in the plan
        seen = {(q["year"], q["paper"]) for q in pick}
        for q in opt:                                        # one per sitting and paper first, latest first
            if len(pick) >= OPT_PER_TOPIC: break
            if (q["year"], q["paper"]) in seen or q in pick: continue
            seen.add((q["year"], q["paper"])); pick.append(q)
        for q in gs + pick:
            items.append(dict(kind="A", topic=tid, subject=q["subject"], id=slug(q), gs=q["paper"].startswith("gs"), year=int(q["year"]),
                              title=f"{q['year']} {q['paper'].upper()} Q{q['q']}{q['part']}: {q['text'][:70]}", done=slug(q) in done_answers))
        buckets[f"{qs[0]['subject']}: optional questions shown as cousins"] += len(opt) - len(pick)
        if len(qs) >= THEME_MIN:
            items.append(dict(kind="B", topic=tid, subject=qs[0]["subject"], id=f"theme-{tid}", gs=False, year=0,
                              title=f"Ten Years, One Idea: {tid} ({len(qs)} questions)"))
    return items, buckets


def schedule(cpw, apw, tpw, start):
    order = concept_order()
    done_topics, done_answers = delivered()
    week_of_topic, rows, w, slot = {}, [], 0, 0
    for r in order:                                          # concept lane
        if (r["topic"], (r["part"].split("/")[0] if r["part"] else "1")) in done_topics:
            rows.append(dict(week=-1, date="done", lane="Concept", kind="EP", serial=r["serial"], topic=r["topic"], id=f"{r['topic']} {r['part']}".strip(), title=r["title"]))
            week_of_topic.setdefault(r["topic"], -1); continue
        if slot == cpw: w, slot = w + 1, 0
        rows.append(dict(week=w, date="", lane="Concept", kind="EP", serial=r["serial"], topic=r["topic"], id=f"{r['topic']} {r['part']}".strip(), title=r["title"]))
        week_of_topic.setdefault(r["topic"], w); slot += 1
    last_concept = w
    items, buckets = answer_items(done_answers)
    topic_rank = {t: i for i, t in enumerate(dict.fromkeys(r["topic"] for r in order))}
    pend = sorted([i for i in items if not i.get("done")], key=lambda i: (not i["gs"], topic_rank.get(i["topic"], 9999), {"A": 0, "MAP": 1, "B": 2}[i["kind"]], -i["year"]))   # GS answers first, across topics
    for i in items:
        if i.get("done"):
            rows.append(dict(week=-1, date="done", lane="Answers", kind=i["kind"], serial=i["subject"], topic=i["topic"], id=i["id"], title=i["title"]))
    a_left = defaultdict(int)
    for i in pend:
        if i["kind"] in ("A", "MAP"): a_left[i["topic"]] += 1
    # the Shorts of answers already made are still to cut: they go in the first week
    rows += [dict(week=0, date="", lane="Answers", kind="C", serial=i["subject"], topic=i["topic"], id=i["id"] + "-short", title="Short of " + i["id"])
             for i in items if i.get("done")]
    w = 0
    while pend and w < 2000:
        a_used = t_used = 0
        for i in list(pend):
            ready = week_of_topic.get(i["topic"], 10 ** 6) <= w
            if not ready: continue
            if i["kind"] in ("A", "MAP") and a_used < apw:
                rows.append(dict(week=w, date="", lane="Answers", kind=i["kind"], serial=i["subject"], topic=i["topic"], id=i["id"], title=i["title"]))
                rows.append(dict(week=w, date="", lane="Answers", kind="C", serial=i["subject"], topic=i["topic"], id=i["id"] + "-short", title="Short of " + i["id"]))
                a_used += 1; a_left[i["topic"]] -= 1; pend.remove(i)
            elif i["kind"] == "B" and t_used < tpw and a_left[i["topic"]] == 0:
                rows.append(dict(week=w, date="", lane="Answers", kind="B", serial=i["subject"], topic=i["topic"], id=i["id"], title=i["title"]))
                t_used += 1; pend.remove(i)
        w += 1
    for r in rows:
        if r["week"] >= 0: r["date"] = (start + dt.timedelta(weeks=r["week"])).isoformat()
    return rows, buckets, last_concept


def finish(rows, pred):
    ws = [r["week"] for r in rows if pred(r) and r["week"] >= 0]
    return max(ws) if ws else -1


def main():
    cpw, apw, tpw = arg("--concept", 3), arg("--answers", 10), arg("--themes", 3)
    start = dt.date.fromisoformat(arg("--start", "2026-11-23"))
    rows, buckets, _ = schedule(cpw, apw, tpw, start)
    out = ROOT / "docs/upsc/planner"; out.mkdir(parents=True, exist_ok=True)
    with open(out / "master.csv", "w", newline="", encoding="utf-8") as f:
        wr = csv.DictWriter(f, fieldnames=["week", "date", "lane", "kind", "serial", "topic", "id", "title"]); wr.writeheader(); wr.writerows(rows)
    day = lambda w: (start + dt.timedelta(weeks=w)).strftime("%b %Y") if w >= 0 else "done"
    count = Counter((r["lane"], r["kind"]) for r in rows)
    done = Counter(r["kind"] for r in rows if r["week"] == -1)
    L = [f"# Master plan: syllabus series and Mains answers (built {dt.date.today().isoformat()} by `scripts/upsc/master_plan.py`)", "",
         f"Pace (AK's pick, 10 Nov 2026, unless overridden): {cpw} concept episodes, {apw} answer videos (each with its Short) and {tpw} Ten Years video a week, from {start.isoformat()}.",
         "Rules and order: see the script's header. Done = delivered to the channel folder.", "",
         "## Totals", "", "| Item | Planned | Done |", "|---|---:|---:|",
         f"| Concept episodes | {count[('Concept', 'EP')]} | {done['EP']} |",
         f"| One Question answers (A) | {count[('Answers', 'A')]} | {done['A']} |",
         f"| Answer Sheet Shorts (C) | {count[('Answers', 'C')]} | {done['C']} |",
         f"| Ten Years, One Idea (B) | {count[('Answers', 'B')]} | {done['B']} |",
         f"| Map rounds | {count[('Answers', 'MAP')]} | {done['MAP']} |",
         f"| **All videos** | **{len(rows)}** | **{sum(done.values())}** |", "",
         "Not scheduled yet: " + "; ".join(f"{k} {v}" for k, v in sorted(buckets.items())) + ".", "",
         "## Milestones", "", "| Milestone | Week | Month |", "|---|---:|---|"]
    ms = [("Launch wave (30 topics) done", lambda r: r["lane"] == "Concept" and r["topic"] in {x["topic"] for x in csv.DictReader(open(ROOT / "docs/upsc/planner/launch.csv"))})]
    for s in FOCUS:
        ms.append((f"{s} serial and its optional season done", lambda r, s=s: r["lane"] == "Concept" and r["serial"] in (s, f"{s} (optional)")))
    ms += [("Every GS answer in the five subjects done", lambda r: r["lane"] == "Answers" and r["kind"] == "A" and re.search(r"-gs\d-", r["id"] or "") is not None),
           ("History serial done", lambda r: r["lane"] == "Concept" and r["serial"] == "History"),
           ("Agriculture serials done", lambda r: r["lane"] == "Concept" and r["serial"].startswith("Agriculture")),
           ("UPSC syllabus complete (all but RBI Grade B)", lambda r: r["lane"] == "Concept" and not r["serial"].startswith("RBI")),
           ("RBI Grade B lane done", lambda r: r["lane"] == "Concept" and r["serial"].startswith("RBI")),
           ("All answer videos done", lambda r: r["lane"] == "Answers")]
    for name, p in ms:
        w = finish(rows, p); L.append(f"| {name} | {w + 1 if w >= 0 else '-'} | {day(w)} |")
    L += ["", "## Paces compared (same rules)", "", "| Concept / answers a week | Syllabus done (UPSC) | All answers done |", "|---|---|---|"]
    L[L.index("| Concept / answers a week | Syllabus done (UPSC) | All answers done |")] = "| Concept / answers / Ten Years a week | Videos a week (with Shorts) | Syllabus done (UPSC) | All answers done |"
    L[L.index("|---|---|---|")] = "|---|---:|---|---|"
    for c, a, th in ((3, 6, 2), (3, 10, 3), (4, 12, 4), (5, 14, 5)):
        rr, _, _ = schedule(c, a, th, start)
        L.append(f"| {c} / {a} / {th} | {c + 2 * a + th} | {day(finish(rr, lambda r: r['lane'] == 'Concept' and not r['serial'].startswith('RBI')))} | {day(finish(rr, lambda r: r['lane'] == 'Answers'))} |")
    L += ["", "## The next eight weeks", ""]
    for w in range(8):
        wk = [r for r in rows if r["week"] == w and r["kind"] != "C"]
        L.append(f"**Week {w + 1} ({(start + dt.timedelta(weeks=w)).strftime('%d %b %Y')})**")
        L += [f"- {r['lane']} {r['kind']}: {r['id']} · {r['title'][:90]}" for r in wk] or ["- (nothing scheduled)"]
        L.append("")
    L += ["Full list: `docs/upsc/planner/master.csv` (one row per video, with its week and date).",
          "Episodes the questions need but the catalogue lacks: `docs/upsc/planner/NEW_EPISODES.md`."]
    N = ["# Episodes the Mains questions need that the catalogue lacks", "",
         "From the checked topic tags (`research/upsc/_pyq/mains/tags/out/`): questions no catalogue episode teaches, grouped by the episode",
         "the tagger proposed. Seeds for new serials (International relations, political theory) and for gaps in the others.", "",
         "| Subject | Proposed episode | Questions waiting |", "|---|---|---:|"]
    N += [f"| {s} | {lab} | {n} |" for (s, lab), n in sorted(NEW.items(), key=lambda x: (x[0][0], -x[1]))]
    (out / "NEW_EPISODES.md").write_text("\n".join(N) + "\n", encoding="utf-8")
    (out / "MASTER.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\n".join(L[:40]))


if __name__ == "__main__":
    sys.exit(main())
