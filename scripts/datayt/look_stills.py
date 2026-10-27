#!/usr/bin/env python3
"""Still-frame harness for the premium looks: every beat of every story, at the two frames that matter, plus a contact sheet.

For each story and each beat it renders the look's preview composition DATA-<id>-look-<look> at
  lock+8    the beat's lock frame (the narrator's number word, from word_times.json; beat start + 6 without timing) + 8,
            i.e. just after the number has landed
  settle    round((t1 - 0.4) * 30): the beat as it must stand still before the cut (scene_frames.py checks the same frame)
into out/looks/<look>/<id>/ (out/looks/<look>-<brand>/<id>/ for another brand), then one contact sheet per story
(<id>-sheet.jpg: top row lock+8, bottom row settle) and index.json with the frames used. Any failed render (a look
throws on a number drawn before its lock, a font missing a glyph, a fit that cannot fit) makes the run exit 1.

  .venv/bin/python scripts/datayt/look_stills.py slab                       # the 11 national stories
  .venv/bin/python scripts/datayt/look_stills.py all gd01 cw01              # slab, counter and dispatch, two stories
  .venv/bin/python scripts/datayt/look_stills.py dispatch fm01 --brand indicaatlas
  options: --concurrency N (default 3), --no-sheets,
           --safe-check: also fail any still with ink outside the safe box (x 95-850, y 210-1480): every pixel outside it must
           be the ground colour. Only for flat grounds (placeholders, flat slabs); a look whose texture or plate bleeds
           to the edge will be flagged and should not use it.
Runs node through a login shell (zsh -lc) so node is on the path, from the repo root. One bundle for the whole run.
"""
import json, math, os, subprocess, sys, tempfile
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCOPE = ["gd01", "cw01", "fm02", "fm03", "fm04", "fm05", "fm01", "fs01", "fs02", "fs03", "fs04"]
LOOKS = ["slab", "counter", "dispatch"]
FPS = 30
F = lambda s: int(math.floor(s * FPS + 0.5))      # Math.round, as BeatStory


def locks(sid, D):
    """Per-beat lock frames from word_times.json when it was measured on this narration, else beat start + 6."""
    p = os.path.join(ROOT, "public/datayt/beats", sid, "word_times.json")
    W = json.load(open(p)) if os.path.exists(p) else None
    vo = D.get("vo") or []
    ok = W and len(W["lines"]) == len(vo) and all(l["text"] == v.get("text") and abs(l["at"] - v["at"]) < 0.002 for l, v in zip(W["lines"], vo))
    out = []
    for i, b in enumerate(D["beats"]):
        if ok:
            wb = W["beats"][i]
            out.append((wb["lockF"], wb["lockHow"], wb.get("lockWord")))
        else:
            out.append((F(b["t0"]) + 6, "no-timing", None))
    return out, bool(ok)


SAFE = (95, 850, 210, 1480)
COMP = os.path.join(ROOT, "node_modules/@remotion/compositor-darwin-arm64")


def outside_safe(png, tol=24, allow=40):
    """Pixels outside the safe box that differ from the ground (the most common colour there). Returns their count."""
    raw = subprocess.run([f"{COMP}/ffmpeg", "-v", "error", "-i", png, "-f", "image2pipe", "-vcodec", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True, env={**os.environ, "DYLD_LIBRARY_PATH": COMP}).stdout
    a = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3).astype(np.int16)
    m = np.ones((1920, 1080), bool)
    m[SAFE[2]:SAFE[3], SAFE[0]:SAFE[1]] = False
    px = a[m]
    key = (px[:, 0].astype(np.int32) << 16) | (px[:, 1].astype(np.int32) << 8) | px[:, 2]
    g = int(np.bincount(key).argmax())
    ground = np.array([g >> 16, (g >> 8) & 255, g & 255], np.int16)
    n = int(np.count_nonzero(np.abs(px - ground).max(axis=1) > tol))
    return n if n > allow else 0


def plan(look, ids, brand, sheets):
    tag = look if not brand or brand == "datakadai" else f"{look}-{brand}"
    stills, sheet_jobs, index = [], [], {}
    for sid in ids:
        D = json.load(open(os.path.join(ROOT, "public/datayt/beats", sid, "data.json")))
        L, measured = locks(sid, D)
        d = os.path.join(ROOT, "out/looks", tag, sid)
        os.makedirs(d, exist_ok=True)
        for old in os.listdir(d):      # stills of an earlier run may be at other frames
            if old.endswith(".png"):
                os.remove(os.path.join(d, old))
        props = {"brand": brand} if brand else {}
        rows, cells_lock, cells_settle = [], [], []
        for i, b in enumerate(D["beats"]):
            f0, f1 = F(b["t0"]), F(b["t1"])
            lockF, how, word = L[i]
            fl = min(max(lockF + 8, f0), f1 - 1)
            fs = min(max(F(b["t1"] - 0.4), f0), f1 - 1)
            name = f"b{i:02d}-{b['kind']}"
            pl, ps = os.path.join(d, f"{name}-lock-f{fl}.png"), os.path.join(d, f"{name}-settle-f{fs}.png")
            for fr, path in ((fl, pl), (fs, ps)):
                stills.append({"comp": f"DATA-{sid}-look-{look}", "props": props, "frame": fr, "out": path})
            rows.append({"beat": i, "kind": b["kind"], "name": b.get("name"), "f0": f0, "f1": f1, "lockF": lockF, "lockHow": how, "lockWord": word,
                         "lockStill": os.path.relpath(pl, ROOT), "settleStill": os.path.relpath(ps, ROOT)})
            who = f"b{i} {b['kind']}" + (f" {b['name']}" if b.get("name") else "")
            cells_lock.append({"png": pl, "label": f"{who} · lock {lockF}+8 = f{fl} · {how}" + (f" '{word}'" if word else "")})
            cells_settle.append({"png": ps, "label": f"{who} · settle f{fs} (t1 - 0.4 s)"})
        index[sid] = {"look": look, "brand": brand or "datakadai", "timing": "word_times.json" if measured else "none (beat start + 6)", "beats": rows}
        json.dump(index[sid], open(os.path.join(d, "index.json"), "w"), indent=1, ensure_ascii=False)
        if sheets:
            sheet_jobs.append({"out": os.path.join(ROOT, "out/looks", tag, f"{sid}-sheet.jpg"), "cols": len(D["beats"]), "cellW": 240,
                               "title": f"{look.upper()} · {sid} · {brand or 'datakadai'} · top: lock+8 · bottom: settle · timing: {index[sid]['timing']}",
                               "cells": cells_lock + cells_settle})
    return stills, sheet_jobs, index


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0].startswith("--"):
        raise SystemExit(__doc__)
    which = LOOKS if args[0] == "all" else args[0].split(",")
    bad = [w for w in which if w not in LOOKS]
    if bad:
        raise SystemExit(f"unknown look {bad}: use slab, counter, dispatch, a comma list or all")
    brand = args[args.index("--brand") + 1] if "--brand" in args else None
    conc = int(args[args.index("--concurrency") + 1]) if "--concurrency" in args else 3
    skip = {brand, str(conc)}
    ids = [a for a in args[1:] if not a.startswith("--") and a not in skip] or SCOPE
    stills, sheets = [], []
    for look in which:
        s, sh, _ = plan(look, ids, brand, "--no-sheets" not in args)
        stills += s; sheets += sh
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, dir=os.path.join(ROOT, "out/looks")) as fh:
        json.dump({"stills": stills, "sheets": sheets, "concurrency": conc}, fh)
        jobs = fh.name
    print(f"{len(stills)} stills and {len(sheets)} sheets: {', '.join(which)} × {len(ids)} stories", flush=True)
    r = subprocess.run(["zsh", "-lc", f"cd '{ROOT}' && node scripts/datayt/look_render.mjs '{jobs}'"])
    missing = [s["out"] for s in stills if not os.path.exists(s["out"])]
    os.unlink(jobs)
    unsafe = []
    if "--safe-check" in args:
        for s_ in stills:
            if os.path.exists(s_["out"]):
                n = outside_safe(s_["out"])
                if n:
                    unsafe.append(s_["out"]); print(f"OUTSIDE SAFE BOX: {os.path.relpath(s_['out'], ROOT)}: {n} px")
        print(f"safe-box check: {len(stills) - len(unsafe)} of {len(stills)} clean")
    if r.returncode or missing or unsafe:
        print(f"look_stills: FAILED (renderer exit {r.returncode}, {len(missing)} stills missing, {len(unsafe)} outside the safe box)")
        sys.exit(1)
    print("look_stills: all rendered")
