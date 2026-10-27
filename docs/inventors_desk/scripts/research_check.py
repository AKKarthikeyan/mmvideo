#!/usr/bin/env python3
"""Mechanical gates for an Inventor's Desk research folder (RESEARCH_RULES.md section 9).

Checks G1, G2, G3, G4, G5 and G8, re-finds every quote in the saved local copy where the copy is text/HTML,
and (with --script) checks that every narration line carries claim IDs that may be narrated.
G6 (independent verifier) and G7 (fresh angle) need judgement: this script only reads their verdict lines
from verify.md and dossier.md.

  python3 docs/inventors_desk/scripts/research_check.py docs/inventors_desk/research/P01-velcro \
      [--script src/gadget/velcroglow/script_v2.json]

Exit 0 only when every gate passes.
"""
import argparse, html, json, re, sys
from pathlib import Path

NARRATABLE = {"VERIFIED-P", "CORROBORATED", "SECONDARY-ONLY", "RECOLLECTION", "DISPUTED"}
SPINE_OK = {"VERIFIED-P", "CORROBORATED"}
VERDICTS = {"Confirmed", "Confirmed (secondary only)", "Contradicted", "Embellished", "Unverifiable"}
TIERS_P = {"P1", "P2", "P3", "P4", "P5"}


def jsonl(p):
    return [json.loads(l) for l in p.read_text().splitlines() if l.strip()]


def norm(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).strip().lower()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--script")
    a = ap.parse_args()
    d = Path(a.folder)
    claims, sources = jsonl(d / "claims.jsonl"), {s["src"]: s for s in jsonl(d / "sources.jsonl")}
    by_id = {c["id"]: c for c in claims}
    res, warn = {}, []

    # G1 sourced
    bad = [c["id"] for c in claims if c["status"] in NARRATABLE
           and not any(e.get("locator") and e.get("quote") for e in c["evidence"])]
    res["G1 sourced"] = (not bad, bad)
    # G2 spine
    bad = [f'{c["id"]}={c["status"]}' for c in claims if c.get("spine") and c["status"] not in SPINE_OK]
    res["G2 spine"] = (not bad, bad)
    # G5 no banned evidence
    used = {e["src"] for c in claims for e in c["evidence"]}
    bad = sorted(s for s in used if s not in sources or sources[s]["tier"] not in TIERS_P | {"S"})
    res["G5 no banned evidence"] = (not bad, bad)
    # G3 coverage
    log = (d / "search_log.md").read_text()
    missing = [n for n in range(1, 11) if not re.search(rf"^## Category {n}\b", log, re.M)]
    res["G3 coverage"] = (not missing, [f"category {n} not logged" for n in missing])
    # G4 floor + saturation
    m = re.search(r"Examined sources:\s*(\d+)", log)
    examined = int(m.group(1)) if m else 0
    n_p = sum(1 for s in sources.values() if s["tier"] in TIERS_P)
    sat = bool(re.search(r"^Saturation:\s*yes", log, re.M | re.I))
    why = []
    if examined < 12: why.append(f"examined {examined} < 12")
    if n_p < 6: why.append(f"tier-P sources {n_p} < 6")
    if not sat: why.append("saturation not reached")
    res["G4 floor+saturation"] = (not why, why or [f"examined {examined}, tier-P {n_p}"])
    # G8 myths
    rows = [r for r in (d / "myths.md").read_text().splitlines() if re.match(r"\|\s*M\d+", r)]
    bad = [r.split("|")[1].strip() for r in rows if r.split("|")[3].strip() not in VERDICTS]
    res["G8 myths audited"] = (bool(rows) and not bad, bad or [f"{len(rows)} myths"])
    # G6 / G7 read from the judgement files
    v = (d / "verify.md").read_text() if (d / "verify.md").exists() else ""
    res["G6 independent verification"] = (bool(re.search(r"^G6:\s*PASS", v, re.M)), ["see verify.md"])
    dz = (d / "dossier.md").read_text() if (d / "dossier.md").exists() else ""
    res["G7 fresh angle"] = (bool(re.search(r"^G7:\s*PASS", dz, re.M)), ["see dossier.md"])

    # quote re-find in local copies (warning only: PDFs and scans can't be searched here)
    cache = {}
    for c in claims:
        for e in c["evidence"]:
            s = sources.get(e["src"], {})
            q = e.get("quote", "")
            if q.startswith("("):
                continue
            files = [f.strip().split(" ")[0] for f in s.get("local_file", "").split(";")]
            files = [d / f for f in files if f.endswith((".html", ".txt", ".json"))]
            if not files:
                continue
            hay = cache.setdefault(tuple(files), " ".join(norm(f.read_text(errors="ignore")) for f in files if f.exists()))
            if norm(q.replace("''", '"')) not in hay and norm(q) not in hay:
                warn.append(f'{c["id"]}/{e["src"]}: quote not found verbatim in local copy')

    # script check
    if a.script:
        sc = json.loads(Path(a.script).read_text())
        bad = []
        for b in sc["beats"]:
            b["id"] = b.get("key", b.get("id"))
            for cid in b.get("claims", []):
                c = by_id.get(cid)
                if not c:
                    bad.append(f'{b["id"]}: unknown {cid}')
                elif c["status"] not in NARRATABLE:
                    bad.append(f'{b["id"]}: {cid} is {c["status"]}')
            if not b.get("claims") and not b.get("no_fact"):
                bad.append(f'{b["id"]}: no claim IDs and not marked no_fact')
        res["Script claim IDs"] = (not bad, bad)

    ok = True
    for k, (passed, det) in res.items():
        ok &= passed
        print(f'{"PASS" if passed else "FAIL"}  {k}' + (f"  ({'; '.join(det)})" if det else ""))
    for w in warn:
        print("WARN ", w)
    print("CLEARED FOR SCRIPTING" if ok else "NOT CLEARED")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
