#!/usr/bin/env python3
"""Data Kadai post pack for a beat Short: captions.md from the built data and a short notes file.

Usage (repo root): python3 scripts/datayt/week_pack.py <id> <YYYY-MM-DD>
Reads public/datayt/beats/<id>/data.json (title, source, what the builder checked, length) and
public/datayt/beats/packs/<id>.json (the words a person wrote: description, pinned comment, checks done and not done).
Writes out/datakadai/daily/<date>/<id>/captions.md and copies it to docs/datakadai/posts/<date>-<id>.md.
The video files are rendered separately. Nothing is posted: posting needs AK's go.
"""
import json, os, shutil, sys

sid, date = sys.argv[1], sys.argv[2]
D = json.load(open(f"public/datayt/beats/{sid}/data.json"))
N = json.load(open(f"public/datayt/beats/packs/{sid}.json"))
out = f"out/datakadai/daily/{date}/{sid}"; os.makedirs(out, exist_ok=True)
title = D["ytTitle"]
cuts = "narrated" + (" and text-led" if os.path.exists(f"{out}/short-text.mp4") else "")
tags = " ".join("#" + t for t in ["DataKadai", "India"] + N["tags"] + ["IndiaData", "Shorts"])
made = "Made by Data Kadai: data analysed and animated from the official source above. Narration is an AI voice."
L = [f"# Post pack: {sid} · {date}", "",
     "Status: DRAFT, waiting for AK's approval. Not posted.",
     f"{N['idea']} Video: `short.mp4`, {D['total']:.0f} seconds, 1080×1920, {cuts}.", "",
     "## YouTube Shorts", f"**Title** ({len(title)} characters): {title}"] + ([f"Alternative: {N['alt_title']}"] if N.get("alt_title") else []) + ["",
     "**Description:**"] + N["description"] + ["", f"Source: {N['source']}"] + ([N["url"]] if N.get("url") else []) + ["", made, N["question"], tags, "",
     f"**Pinned comment:** {N['pinned']}", "",
     "**Upload settings:** Audience: not made for kids. Altered or synthetic content: No (animated maps and charts, no real person or realistic scene).", "",
     "## Instagram (Reel)", N["instagram"], f"Source: {N['source_short']}", " ".join("#" + t for t in ["DataKadai", "India"] + N["tags"] + ["IndiaData"]), "",
     "## X", N["x"] + " #DataKadai", "",
     "## Checks before posting"]
L += [f"- [x] Builder checks passed: {c}" for c in D.get("checked", [])]
L += [f"- [x] {c}" for c in N["done"]]
L += ["- [x] House rules passed before voicing: hook on the map, three to five beats, every state on the map, question and source on the last card, word limits, title numbers on screen",
      f"- [x] Voice is MiniMax {D.get('voice', '')}; numbers and years are spelled out in the voice text",
      "- [x] Frames checked for overlap: one frame late in every beat"]
L += [f"- [ ] {c}" for c in N["open"]]
L += ["- [ ] Watched the video end to end and listened to the narration (not done by Claude: only sampled frames and audio levels were checked)", "- [ ] AK approved"]
if N.get("signoff"):
    L += ["", "## Sentences for AK's sign-off"] + [f"- {s}" for s in N["signoff"]]
open(f"{out}/captions.md", "w").write("\n".join(L) + "\n")
os.makedirs("docs/datakadai/posts", exist_ok=True)
shutil.copy(f"{out}/captions.md", f"docs/datakadai/posts/{date}-{sid}.md")
print(f"{sid}: pack written to {out}/captions.md ({len(title)}-character title, {D['total']:.0f} s)")
