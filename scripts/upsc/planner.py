#!/usr/bin/env python3
"""Content planner: the production queue, one subject at a time, each serial in its own viewing
order. Focus (AK, 3 Nov 2026): Economics, then Geography, then Polity, each finished before the next, with current affairs linked to the syllabus
(scripts/upsc/ca_scan.py); History and Agriculture start after those three are complete. Status comes from the files on disk.

  python3 -I scripts/upsc/planner.py [--rows 40]

Writes docs/upsc/planner/QUEUE.md and docs/upsc/planner/queue.csv. Pipeline: docs/upsc/PIPELINE.md.
"""
import csv, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
UP = ROOT / "research/upsc"
CORE = ["Economics", "Geography", "Polity"]
LATER = ["History", "Agriculture"]
STAGES = ["gemini research", "researched (pilot)", "gemini draft", "claims checked", "script revised", "script audited", "storyboard", "rendered"]


def status(tid, part):
    """Furthest stage reached for this topic and part, read from the files each stage writes."""
    d = UP / tid
    done = []
    g = d / "gemini"
    if (g / "research.json").exists():
        done.append("gemini research")
    if (d / "dossier.md").exists() and (d / "claims.csv").exists():
        done.append("researched (pilot)")
    if (g / f"draft_p{part}.json").exists():
        done.append("gemini draft")
    if (d / "claims.csv").exists() and (d / "CHECKED.md").exists():
        done.append("claims checked")
    if (d / f"script_p{part}.py").exists():
        done.append("script revised")
    if any(d.glob(f"SCRIPT_P{part}_AUDIT*.md")):
        done.append("script audited")
    if (ROOT.parent / "mmvideo-dk-upsc" / "public/datayt/long/upsc" / f"{tid.lower().replace('-', '')}-p{part}").exists():
        done.append("storyboard")
    last = max((STAGES.index(s) for s in done), default=-1)
    return STAGES[last] if last >= 0 else "not started", done


def main():
    rows = int(sys.argv[sys.argv.index("--rows") + 1]) if "--rows" in sys.argv else 40
    ser = [r for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"]
    lanes = {s: [r for r in ser if r["serial"] == s] for s in CORE}
    # Launch wave first (AK, 3 Nov 2026: the top 10 topics per subject by demand and Jev, docs/upsc/planner/LAUNCH.md), every
    # part of each; then the rest one subject at a time, finished before the next: Economics, then Geography, then Polity.
    lf = ROOT / "docs/upsc/planner/launch.csv"
    launch = [r["topic"] for r in csv.DictReader(open(lf, encoding="utf-8"))] if lf.exists() else []
    queue = [r for tid in launch for r in ser if r["topic"] == tid]
    queue += [r for s in CORE for r in lanes[s] if r["topic"] not in launch]
    for s in LATER:   # after the focus serials, in viewing order
        queue += [r for r in ser if r["serial"] == s]
    out = []
    for n, r in enumerate(queue, 1):
        part = int(r["part"].split("/")[0]) if r["part"] else 1
        st, _ = status(r["topic"], part)
        out.append(dict(order=n, serial=r["serial"], episode=r["episode"], topic=r["topic"], part=part, title=r["title"], stage=st))
    (ROOT / "docs/upsc/planner").mkdir(parents=True, exist_ok=True)
    with open(ROOT / "docs/upsc/planner/queue.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
    counts = {}
    for o in out:
        counts[o["stage"]] = counts.get(o["stage"], 0) + 1
    md = ["# Production queue (rendered by `scripts/upsc/planner.py`)", "",
          "Launch wave first (top 10 per subject, `LAUNCH.md`), then one subject at a time: Economics, Geography, Polity; then History and Agriculture. Stage = furthest step done (pipeline in `docs/upsc/PIPELINE.md`).", "",
          "Stages so far: " + ", ".join(f"{k} {v}" for k, v in counts.items()), "",
          "| # | Serial | Ep | Topic | Part | Episode | Stage |", "|---:|---|---:|---|---:|---|---|"]
    md += [f"| {o['order']} | {o['serial']} | {o['episode']} | {o['topic']} | {o['part']} | {o['title']} | {o['stage']} |" for o in out[:rows]]
    md += ["", f"{len(out)} episodes in the queue; the full list is `docs/upsc/planner/queue.csv`."]
    (ROOT / "docs/upsc/planner/QUEUE.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"{len(out)} episodes; " + ", ".join(f"{k} {v}" for k, v in counts.items()))


if __name__ == "__main__":
    sys.exit(main())
