#!/usr/bin/env python3
"""Data Kadai daily post pack for one built Short: video + chart images + captions, ready for AK's approval.

Usage (repo root): python3 scripts/datayt/post_pack.py <short_id> [YYYY-MM-DD] [--no-video]
Writes out/datakadai/daily/<date>/<id>/ : short.mp4 (YouTube Shorts / Reels), ig.png (Instagram 4:5), x.png (X 16:9),
captions.md (YouTube title + description, Instagram caption, X post, pinned comment). captions.md is also copied to
docs/datakadai/posts/<date>-<id>.md as the record.
Nothing is posted: posting needs AK's go.
"""
import json, os, subprocess, sys, datetime, shutil

sid = sys.argv[1]
date = next((a for a in sys.argv[2:] if a[:2] == "20"), datetime.date.today().isoformat())
video = "--no-video" not in sys.argv
D = json.load(open(f"public/datayt/shorts/{sid}/data.json"))
out = f"out/datakadai/daily/{date}/{sid}"
os.makedirs(out, exist_ok=True)

def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode:
        print(r.stdout[-2000:], r.stderr[-2000:]); sys.exit(f"failed: {' '.join(args)}")

run(["npx", "remotion", "still", "src/index.ts", f"DK-post-{sid}-ig", f"{out}/ig.png"])
run(["npx", "remotion", "still", "src/index.ts", f"DK-post-{sid}-x", f"{out}/x.png"])
if video:
    run(["npx", "remotion", "render", "src/index.ts", f"DATA-{sid}", f"{out}/short.mp4", "--crf=18"])

u = D["unit"]; f = lambda v: f"{v:.1f}{u}"
hook = " ".join(D["hook"]).replace("*", "")
title = D.get("title") or (hook if len(hook) <= 60 else hook[:58].rsplit(" ", 1)[0] + "…")
ans, lab = D["answerName"], D["label"]
ratio = D["value"] / D["india"] if D["india"] else None
rx = f"{ratio:.1f}".rstrip("0").rstrip(".") if ratio else ""
vs = f"{rx}× India's {f(D['india'])}" if ratio and ratio >= 2 else f"vs India {f(D['india'])}"
top = "\n".join(f"{i + 1}. {t['name']}: {f(t['v'])}" for i, t in enumerate(D["top"]))
tags = "#DataKadai #India #Shorts #IndiaData #NFHS6"
voice_check = ("- [ ] Voice is MiniMax English_Diligent_Man (Moat & Margin male)\n" if D.get("voiceEngine") == "minimax" else
               "- [ ] **PLACEHOLDER VOICE (Kokoro): re-voice with MiniMax before posting** (`MINIMAX_API_KEY=... python3 scripts/datayt/build_india_shorts.py " + sid + "`, then post_pack)\n")
cap = f"""# Post pack: {sid} · {date}

Status: DRAFT, waiting for AK's approval. Not posted.

## YouTube Shorts
**Title** (≤ 60 chars): {title}
**Description:**
{hook} Watch to the end for the answer.
Data: {lab}, every state. Source: {D['source']}.
Where does your state rank? Comment below 👇
{tags}

**Pinned comment:** Source: {D['source']}, indicator "{lab}". State averages. Which topic should we map next?

## Instagram (Reel + chart post `ig.png`)
{hook} 🤔
It's {ans}: {f(D['value'])}, {vs}.

{"Top 5" if D.get("side", "top") == "top" else "Lowest 5"}:
{top}

Source: {D['source']}
{tags} #IndianStates

## X (`x.png`)
{hook} It's {ans}: {f(D['value'])}, {vs}. Top 5 in the chart 👇 Source: NFHS-6 (2023-24). #DataKadai #India

## Checks before posting
{voice_check}- [ ] Numbers match `public/datayt/shorts/{sid}/data.json` and the source table
- [ ] Watched the video end to end; audio OK
- [ ] AK approved
"""
open(f"{out}/captions.md", "w").write(cap)
os.makedirs("docs/datakadai/posts", exist_ok=True)
shutil.copy(f"{out}/captions.md", f"docs/datakadai/posts/{date}-{sid}.md")
print("pack:", out, "·", ", ".join(sorted(os.listdir(out))))
