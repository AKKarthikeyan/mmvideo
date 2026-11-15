#!/usr/bin/env python3
"""Data Kadai long-form pack: the thumbnail, the X image, the map and list with every state, the Instagram carousel, and captions.md.

AK, 13 Oct 2026: every video ships with one X post, one Instagram carousel and one map with all the data. For a long-form video this
writes, beside its video in out/datakadai/long/<id>/:
  thumb.png      1280x720   the YouTube thumbnail (the config's "thumb" words and a state map in colour only)
  x.png          1600x900   the claim, the state map, the highest and lowest five
  map.png        1080x1350  one map scene with every state's number
  list.png       1080x1350  the same figures ranked, every state
  ig/01.png ...  1080x1350  the carousel: chosen scenes of the video fitted to 4:5, the map, the list, the question and the sources
  captions.md               title, description with the chapter times and sources, pinned comment, X and Instagram text, the checks
and copies captions.md to docs/datakadai/posts/<date>-<id>.md. The words come from public/datayt/long/packs/<id>.json (written by a
person), the chapter times from the built data.json. Templates: src/datayt/LongPosts.tsx. Nothing is posted: posting needs AK's go.

Usage (repo root, in a login shell so node is on the path):
  python3 scripts/datayt/long_posts.py <id> <YYYY-MM-DD> [--list] [--words]
--list prints the stills it would render and stops; --words writes captions.md only (no rendering).
"""
import json, os, shutil, subprocess, sys, tempfile

sid, date = sys.argv[1], sys.argv[2]
D = json.load(open(f"public/datayt/long/{sid}/data.json"))
N = json.load(open(f"public/datayt/long/packs/{sid}.json"))
out = f"out/datakadai/long/{sid}"; os.makedirs(out, exist_ok=True)
late = lambda i: max(0, round((D["scenes"][i]["t1"] - 0.25) * 30))      # a scene as it stands just before it ends, every animation done
kind = lambda i: D["scenes"][i]["kind"]
maps = [i for i, s in enumerate(D["scenes"]) if s["kind"] == "map"]
map_i = N.get("map_scene", maps[0] if maps else None)
assert map_i is None or kind(map_i) == "map", f"map_scene {map_i} is a {kind(map_i)} scene"
carousel = N.get("carousel") or [i for i, s in enumerate(D["scenes"]) if s["kind"] not in ("card", "map", "end")][:8]
assert all(kind(i) not in ("card", "end") for i in carousel), "a carousel slide is a scene of the video, not a chapter card or the end card"
jobs = [{"comp": "DK-lp-thumb", "props": {"id": sid, "scene": N.get("thumb_scene", map_i)}, "out": f"{out}/thumb.png"}]
if map_i is not None:
    jobs += [{"comp": "DK-lp-x", "props": {"id": sid, "scene": N.get("x_scene", map_i)}, "out": f"{out}/x.png"},
             {"comp": "DK-lp-map", "props": {"id": sid, "scene": map_i}, "out": f"{out}/map.png"},
             {"comp": "DK-lp-list", "props": {"id": sid, "scene": map_i}, "out": f"{out}/list.png"}]
slides = [("DK-lp-ig", {"id": sid, "scene": i}, late(i)) for i in carousel]
slides += [("map", None, 0), ("list", None, 0)] if map_i is not None else []
slides.append(("DK-lp-end", {"id": sid}, 0))
for n, (comp, props, frame) in enumerate(slides, 1):
    if comp not in ("map", "list"):
        jobs.append({"comp": comp, "props": props, "frame": frame, "out": f"{out}/ig/{n:02d}.png"})
if "--list" in sys.argv:
    for j in jobs: print(j)
    sys.exit(0)

# ---------------------------------------------------------------- captions.md
title = N.get("title") or D["title"]
assert len(title) <= 100, f"the YouTube title is {len(title)} characters (at most 100)"
chapters = open(f"public/datayt/long/{sid}/chapters.txt").read().strip().splitlines()
assert chapters[0].startswith("0:00"), "YouTube chapters start at 0:00"
mins = D["total"] / 60
tags = " ".join("#" + t for t in ["DataKadai", "India"] + N["tags"] + ["IndiaData"])
made = "Made by Data Kadai: data analysed and animated from the official sources above. Narration is an AI voice."
L = [f"# Post pack: {sid} · {date}", "",
     "Status: DRAFT, waiting for AK's approval. Not posted.",
     f"{N['idea']} Video: `long.mp4`, {int(D['total'] // 60)} min {D['total'] % 60:.0f} s, 1920×1080, narrated (voice: {D.get('voiceEngine', '')}).", "",
     "## YouTube (long-form)", f"**Title** ({len(title)} characters): {title}"] + ([f"Alternative: {N['alt_title']}"] if N.get("alt_title") else []) + [
     "**Thumbnail:** `thumb.png` (1280×720).", "", "**Description:**"] + N["description"] + ["", "Chapters:"] + chapters + ["", "Sources:"] + [f"- {s}" for s in N["sources"]] + [
     "", made, N["question"], tags, "",
     f"**Pinned comment:** {N['pinned']}", "",
     "**Upload settings:** Audience: not made for kids. Altered or synthetic content: No (animated charts and maps, an AI narrator, no real person or realistic scene). "
     "Chapters come from the timestamps in the description.", "",
     "## Instagram (carousel)", N["instagram"], " ".join("#" + t for t in ["DataKadai", "India"] + N["tags"] + ["IndiaData"]), "",
     "## X", N["x"] + " #DataKadai", "",
     "## Checks before posting"]
L += [f"- [x] Builder checks passed: {len(D.get('checked', []))} figures and claims recomputed from the saved tables"]
L += [f"- [x] {c}" for c in N["done"]]
L += [f"- [ ] {c}" for c in N["open"]]
L += ["- [ ] Watched the video end to end and listened to the narration (not done by Claude: frames and audio levels were checked)", "- [ ] AK approved"]
if N.get("signoff"):
    L += ["", "## Sentences for AK's sign-off"] + [f"- {s}" for s in N["signoff"]]
n = len(slides)
L += ["", "## Post images", "- **YouTube thumbnail:** `thumb.png` (1280×720).", "- **X post:** `x.png` (1600×900) with the text under \"X\".",
      f"- **Instagram carousel:** `ig/01.png` to `ig/{n:02d}.png` ({n} slides, 1080×1350), in that order, with the caption under \"Instagram\"."
      + (f" Slide {n - 2} is the map and slide {n - 1} the ranked list." if map_i is not None else ""),
      "- **Map with all the data:** `map.png` (every state's number) and `list.png` (the same figures ranked)."]
open(f"{out}/captions.md", "w").write("\n".join(L) + "\n")
os.makedirs("docs/datakadai/posts", exist_ok=True)
shutil.copy(f"{out}/captions.md", f"docs/datakadai/posts/{date}-{sid}.md")
print(f"{sid}: pack written to {out}/captions.md ({len(title)}-character title, {mins:.1f} min, {len(chapters)} chapters)")
if "--words" in sys.argv:
    sys.exit(0)

# ---------------------------------------------------------------- the stills (one bundle, one browser)
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
    json.dump(jobs, f)
r = subprocess.run(["node", "scripts/datayt/render_posts.mjs", f.name])
os.unlink(f.name)
for k, (comp, _, _) in enumerate(slides, 1):
    if comp in ("map", "list") and os.path.exists(f"{out}/{comp}.png"):
        shutil.copy(f"{out}/{comp}.png", f"{out}/ig/{k:02d}.png")
sys.exit(r.returncode)
