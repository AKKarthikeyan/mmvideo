#!/usr/bin/env python3
"""Check and render a UPSC episode script kept as Python data (research/upsc/<id>/script_*.py).

usage: script_tool.py <script.py> [--story-check <path to mmvideo scripts/story_check.py>] [--wpm 150]

Checks (Gold Standard): every claim id exists in the episode's claims.csv and has a status that may be narrated;
sentence length; a new term and a number in one sentence; the but/therefore link on every beat (STORYTELLING 4.1).
Writes SCRIPT_<part>.md beside the script. With --story-check, runs the mmvideo story checker on a scratch copy."""
import csv, importlib.util, pathlib, re, shutil, subprocess, sys, tempfile

NARRATE = {"CONFIRMED", "CORRECTED", "CONFLICT"}   # CONFLICT only when the script names both sides
NUM = re.compile(r"\b(\d|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|twenty|thirty|forty|fifty|sixty|hundred|thousand)\b", re.I)


def arg(flag, default=None):
    return sys.argv[sys.argv.index(flag) + 1] if flag in sys.argv else default


def load(path):
    spec = importlib.util.spec_from_file_location("ep", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.V


def sentences(text):
    return [s for s in re.split(r"(?<=[.?!])\s+", text.strip()) if s]


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    path = pathlib.Path(sys.argv[1]).resolve()
    V, wpm = load(path), float(arg("--wpm", 150))
    claims = {r["claim_id"]: r for r in csv.DictReader(open(path.parent / "claims.csv", encoding="utf-8"))}
    fails, warns = [], []

    words = 0
    for b in V["beats"]:
        k = b["key"]
        words += len(b["say"].split())
        for c in b["claims"]:
            if c not in claims:
                fails.append(f"{k}: claim {c} is not in claims.csv")
            elif claims[c]["status"] not in NARRATE:
                fails.append(f"{k}: claim {c} is {claims[c]['status']}, which may not be narrated")
        if b is not V["beats"][0] and b["link"] not in ("but", "therefore"):
            fails.append(f"{k}: link must be 'but' or 'therefore', got {b['link']!r}")
        for s in sentences(b["say"]):
            n = len(s.split())
            if n > 20:
                fails.append(f"{k}: {n}-word sentence: {s[:70]}")
            elif n > 15:
                warns.append(f"{k}: {n}-word sentence: {s[:70]}")
            if b["term"] and b["term"].lower() in s.lower() and NUM.search(s):
                warns.append(f"{k}: new term and a number in one sentence: {s[:70]}")
        if not b["claims"] and b["rung"] not in ("handoff", "stakes"):
            warns.append(f"{k}: no claims listed")

    used = sorted({c for b in V["beats"] for c in b["claims"]})
    print(f"{V['id']}: {len(V['beats'])} beats, {words} words, about {words / wpm:.1f} min at {wpm:.0f} wpm; {len(used)} claims used")
    print("  claim status:", {s: sum(claims[c]["status"] == s for c in used if c in claims) for s in sorted(NARRATE)})
    for w in warns:
        print("  warn ", w)
    for f in fails:
        print("  FAIL ", f)

    render(V, path, claims)

    sc = arg("--story-check")
    if sc:
        with tempfile.TemporaryDirectory() as d:
            d = pathlib.Path(d) / "scripts"
            d.mkdir()
            shutil.copy(sc, d / "story_check.py")
            beats = [dict(key=b["key"], say=b["say"], scene=b["scene"]) for b in V["beats"]]
            (d / "vx_scripts.py").write_text("VIDEOS = [" + repr(dict(id=V["id"], title=V["title"], beats=beats, story=V["story"])) + "]\n")
            r = subprocess.run([sys.executable, "-I", str(d / "story_check.py"), V["id"], "--wpm", str(wpm)], capture_output=True, text=True, cwd=d)
            print("story_check.py (exit %d):" % r.returncode)
            print(r.stdout.rstrip() or r.stderr.rstrip())
    return 1 if fails else 0


def render(V, path, claims):
    S, out = V["story"], []
    out.append(f"# {V['id']}: {V['title']}\n")
    out.append(f"Rendered from `{path.name}` by `scripts/upsc/script_tool.py`. Edit the .py, not this file.\n")
    out.append(f"**Promise:** {S['promise']}  \n**Arc:** {S['arc']} · **Tier:** {S.get('tier', '')} · **Turn:** {S['turn']}\n")
    out.append("**Loops:**\n")
    for L in S["loops"]:
        out.append(f"- {L['id']} ({L['kind']}): {L['q']} — opens {L['open']}, closes {L['close']}")
    out.append("\n**Plants:** " + ", ".join(f"{a} → {b}" for a, b in S["plants"]))
    out.append("\n**Critical evidence:**\n")
    for c in S["critical"]:
        out.append(f"- {c['what']}: {c['src']}")
    out.append(f"\n**Fallback question:** {S.get('fallback', '')}\n\n---\n")
    ch = None
    for b in V["beats"]:
        if b["ch"] != ch:
            ch = b["ch"]
            out.append(f"\n## Chapter {ch}\n")
        link = f"*{b['link'].upper()}* · " if b["link"] else ""
        out.append(f"### {b['key']} · {link}rung {b['rung']}" + (f" · new term: {b['term']}" if b["term"] else ""))
        out.append(f"**PICTURE:** {b['scene']['pic']}  ")
        out.append(f"**VOICE:** {b['say']}  ")
        out.append(f"**SCREEN:** {b['cap']}  ")
        out.append("**CLAIMS:** " + (", ".join(f"{c} ({claims[c]['status']})" if c in claims else f"{c} (MISSING)" for c in b["claims"]) or "none"))
        if b["note"]:
            out.append(f"  \n**NOTE:** {b['note']}")
        out.append("")
    name = "SCRIPT_" + path.stem.split("_")[-1].upper() + ".md"
    (path.parent / name).write_text("\n".join(out) + "\n", encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
