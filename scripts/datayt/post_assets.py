#!/usr/bin/env python3
"""Data Kadai post images for a beat Short: one X image, one Instagram carousel, one map with all the data.

AK, 13 Oct 2026: "all the videos should have one X POST, one Insta Carosaul. one MAP with all data."
For each Short this writes, beside its video in out/datakadai/daily/<date>/<id>/:
  x.png          1600x900   the claim, the map, the highest and lowest five (a game or a place story: its closing card)
  map.png        1080x1350  every state's number on the map (not made for a game or a place story)
  list.png       1080x1350  the same figures as a ranked list, every state
  ig/01.png ...  1080x1350  the carousel: the hook, each card, the map, the ranked list, the question and the source
and lists them under "Post images" in captions.md (and in the copy under docs/datakadai/posts/). The X text and the
Instagram caption are already in captions.md. Templates: src/datayt/BeatPosts.tsx. Nothing is posted: posting needs AK's go.

Usage (repo root, in a login shell so node is on the path):
  python3 scripts/datayt/post_assets.py <id> [...]     these Shorts
  python3 scripts/datayt/post_assets.py --all          every built Short filed under a theme
  add --list to print what would be rendered and stop
"""
import glob, json, os, re, shutil, subprocess, sys, tempfile, datetime

SKIP = {"map", "mapend", "end"}      # the map goes in as the all-data image; the last card is drawn for the carousel
START, STOP = "<!-- post images: start -->", "<!-- post images: end -->"


def pack_dir(sid):
    """Where the Short's pack lives: the newest dated folder that holds it, or today's."""
    found = sorted(glob.glob(f"out/datakadai/daily/*/{sid}"))
    return found[-1] if found else f"out/datakadai/daily/{datetime.date.today().isoformat()}/{sid}"


def plan(sid):
    D = json.load(open(f"public/datayt/beats/{sid}/data.json"))
    out, jobs, slides = pack_dir(sid), [], []
    has_map = bool(D.get("map")) and any(b["kind"] == "map" for b in D["beats"])
    late = lambda i: max(0, round((D["beats"][i]["t1"] - 0.25) * 30))      # a beat as it stands just before it ends, every animation finished
    kinds = [b["kind"] for b in D["beats"]]
    key = kinds.index("tally") if "tally" in kinds else (len(kinds) - 1 - kinds[::-1].index("event") if "event" in kinds else 0)      # without a map the X image shows the closing card
    jobs.append({"comp": "DK-bp-x", "props": {"id": sid}, "frame": 0 if has_map else late(key), "out": f"{out}/x.png"})
    if has_map:
        jobs.append({"comp": "DK-bp-map", "props": {"id": sid}, "out": f"{out}/map.png"})
        jobs.append({"comp": "DK-bp-list", "props": {"id": sid}, "out": f"{out}/list.png"})
    for i, b in enumerate(D["beats"]):
        if b["kind"] in SKIP or (b["kind"] == "shift" and b.get("mode") == "then") or (b["kind"] == "pick" and b.get("mode") == "ask"):
            continue      # a then-and-now's second card shows both dates; a game's answer card shows the question too
        slides.append(("DK-bp-ig", {"id": sid}, late(i)))
    slides += [("map", None, 0), ("list", None, 0)] if has_map else []
    slides.append(("DK-bp-end", {"id": sid}, 0))
    slides = [s for s in slides if s]
    for n, (comp, props, frame) in enumerate(slides, 1):
        if comp not in ("map", "list"):
            jobs.append({"comp": comp, "props": props, "frame": frame, "out": f"{out}/ig/{n:02d}.png"})
    return D, out, jobs, slides, has_map


def note(sid, D, out, slides, has_map):
    """List the images in captions.md, between two markers so a second run replaces the list."""
    n = len(slides)
    L = [START, "## Post images",
         f"- **X post:** `x.png` (1600×900) with the text under \"X\"." ,
         f"- **Instagram carousel:** `ig/01.png` to `ig/{n:02d}.png` ({n} slides, 1080×1350), in that order, with the caption under \"Instagram\"."
         + (f" Slide {n - 2} is the map and slide {n - 1} the ranked list." if has_map else ""),
         ("- **Map with all the data:** `map.png` (1080×1350): every state's number on the map. `list.png` is the same data as a ranked list."
          if has_map else f"- **Map with all the data:** none. This Short is a {'game' if D['type'] == 'pick' else 'place story'} and has no state map."),
         "- [ ] Images looked at by AK (Claude checked a sample for overlap and missing figures, not every image).", STOP]
    block = "\n".join(L)
    targets = [f"{out}/captions.md"] + glob.glob(f"docs/datakadai/posts/*-{sid}.md")
    for f in targets:
        if not os.path.exists(f):
            continue
        s = open(f).read()
        s = re.sub(re.escape(START) + ".*?" + re.escape(STOP), block, s, flags=re.S) if START in s else s.rstrip("\n") + "\n\n" + block + "\n"
        open(f, "w").write(s)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ids = sorted(json.load(open("public/datayt/bank/themes.json"))["videos"]) if "--all" in sys.argv else args
    assert ids, "give Short ids or --all"
    plans = {i: plan(i) for i in ids}
    jobs = [j for p in plans.values() for j in p[2]]
    print(f"{len(ids)} Shorts, {len(jobs)} images to render")
    if "--list" in sys.argv:
        for i, (D, out, js, slides, has_map) in plans.items():
            print(f"  {i}: {out}  x, {'map, ' if has_map else ''}{len(slides)} carousel slides")
        sys.exit(0)
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(jobs, f)
    r = subprocess.run(["node", "scripts/datayt/render_posts.mjs", f.name])
    os.unlink(f.name)
    for i, (D, out, js, slides, has_map) in plans.items():
        for n, (comp, props, frame) in enumerate(slides, 1):
            if comp in ("map", "list") and os.path.exists(f"{out}/{comp}.png"):
                shutil.copy(f"{out}/{comp}.png", f"{out}/ig/{n:02d}.png")
        for old in glob.glob(f"{out}/ig/*.png"):      # a re-run with fewer slides leaves no stale image behind
            if int(os.path.basename(old)[:2]) > len(slides):
                os.remove(old)
        note(i, D, out, slides, has_map)
    sys.exit(r.returncode)
