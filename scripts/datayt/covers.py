#!/usr/bin/env python3
"""Data Kadai covers for this week's Shorts: image-model art with the headline drawn in code (src/datayt/Covers.tsx).

AK, 25 Oct 2026: "Prepare Thumpnail, Title Discription also using Google Nano Banana". YouTube lets only Partner Program
channels upload a Shorts thumbnail (July 2026), so for now a cover is the Instagram Reel cover and the YouTube thumbnail later.
The model draws no text, numbers, maps, flags, logos or real people: an India map from an image model can get the official
boundaries wrong, and every figure must be the checked one, so the headline and its numbers are drawn in code.

Engines:
  gemini   Google's Nano Banana through the Gemini API (needs GEMINI_API_KEY; model DK_IMAGE_MODEL, default gemini-2.5-flash-image)
  minimax  MiniMax image-01 (needs MINIMAX_API_KEY; run with MINIMAX_API_KEY="$MINIMAX_GO_API_KEY" while the main plan is spent)

Usage (repo root, login shell):
  python3 scripts/datayt/covers.py gemini [id ...]     art to public/datayt/covers/<id>-<engine>.png, cover to <pack>/cover-<engine>.png
  python3 scripts/datayt/covers.py minimax gd01        one Short
Art is reused if it exists; delete the file to draw it again. Nothing is posted.
"""
import base64, json, os, subprocess, sys, time
import requests

STYLE = ("Flat editorial illustration, warm cream, deep maroon and amber palette, soft paper texture, clean simple shapes, "
         "vertical 9:16 portrait. The top 45 percent of the picture is plain light cream background with nothing in it; "
         "the subject sits in the lower half. Absolutely no text, letters, numbers, labels, logos, brand marks, maps, flags "
         "or real people, and no religious buildings or symbols.")
# id: (pack date, kicker, headline with *accent*, what to draw). Every number in a headline is one the Short shows and tests.
COVERS = {
    "gd01": ("2026-10-26", "GOLD · ESTIMATE", "Indian homes hold *3×* the US government's gold",
             "a heap of traditional Indian gold bangles, necklaces and plain coins spilling out of an old steel almirah locker in a home, warm glow"),
    "vs03": ("2026-10-22", "STATE vs STATE", "Maharashtra or Gujarat: *which economy wins?*",
             "on the left a cluster of glass office towers by the sea, on the right factory sheds, chimneys and port cranes, the two halves meeting in the middle"),
    "cw01": ("2026-10-27", "SOFT DRINKS", "The *₹10* cola war",
             "three plain straight-sided cylindrical glass bottles of dark fizzy drink with bubbles, one short bottle in front of two tall ones, no labels and no curved or contoured bottle shapes (no brand's bottle design)"),
    "vs05": ("2026-10-22", "STATE vs STATE", "Karnataka wins on 5G. Tamil Nadu on power. *Who wins?*",
             "on the left a tall mobile phone tower sending signal waves over a tech campus, on the right wind turbines and power lines over green fields"),
    "cn02": ("2026-10-22", "TOP 5 · BANK LOANS", "Delhi owes banks *more than its whole year's output*",
             "a city skyline of old domed monuments and modern towers, with a tall stack of plain unmarked banknotes rising above the buildings"),
    "vs02": ("2026-10-22", "STATE vs STATE", "Punjab or Haryana: *who wins on money?*",
             "golden wheat fields with a small village bank building and a neat pile of plain unmarked coins in the foreground"),
    "vs06": ("2026-10-22", "STATE vs STATE", "Gujarat or Rajasthan: *where do women and girls do better?*",
             "faceless stylised figures: schoolgirls in plain school uniforms carrying books, a young woman at a tailoring shop counter and a woman holding a closed plain blank booklet, a modern small-town street with plain shops behind, no religious buildings or symbols"),
    "cn08": ("2026-10-22", "INDIA QUIZ", "Can you beat this *India quiz?*",
             "a playful scene with two large question-mark shapes made of objects: coconut palms and backwaters on one side, a crowded busy town street on the other"),
    "vs07": ("2026-10-22", "STATE vs STATE", "Odisha wins on mothers. *West Bengal on schools.*",
             "a village school with children's school bags on a bench and a small health clinic with a mother holding a baby, faceless stylised figures, river and paddy fields"),
    "pp118": ("2026-10-27", "CRICKET · T20I RECORD", "India *118/0* in six overs",
              "a white cricket ball flying fast off the face of a wooden cricket bat, motion streaks behind the ball, a floodlit cricket ground at night far in the background, no people, no scoreboard"),
}


def gemini(prompt, path):
    key = os.environ["GEMINI_API_KEY"]
    model = os.environ.get("DK_IMAGE_MODEL", "gemini-2.5-flash-image")
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "9:16"}}}
    for attempt in range(6):
        r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                          headers={"x-goog-api-key": key}, json=body, timeout=180)
        if r.status_code in (402, 429, 500, 503):      # 402: prepaid credit not yet usable (seen 25 Oct 2026 right after a top-up)
            time.sleep(15 * (attempt + 1)); continue
        r.raise_for_status()
        for part in r.json()["candidates"][0]["content"]["parts"]:
            if "inlineData" in part:
                open(path, "wb").write(base64.b64decode(part["inlineData"]["data"])); return
        raise SystemExit(f"{model} returned no image: {json.dumps(r.json())[:400]}")
    raise SystemExit(f"{model}: still refused after 6 tries (HTTP {r.status_code}: {r.json().get('error', {}).get('message', '')[:120]})")


def minimax(prompt, path):
    body = {"model": "image-01", "prompt": prompt, "aspect_ratio": "9:16", "response_format": "base64", "n": 1, "prompt_optimizer": False}
    j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"},
                      json=body, timeout=240).json()
    if j.get("base_resp", {}).get("status_code", 0) != 0:
        raise SystemExit(f"MiniMax: {j['base_resp']}")
    open(path, "wb").write(base64.b64decode(j["data"]["image_base64"][0]))


def main():
    engine, ids = sys.argv[1], sys.argv[2:] or list(COVERS)
    draw = {"gemini": gemini, "minimax": minimax}[engine]
    os.makedirs("public/datayt/covers", exist_ok=True)
    jobs = []
    for sid in ids:
        date, kicker, headline, scene = COVERS[sid]
        art = f"public/datayt/covers/{sid}-{engine}.png"
        if not os.path.exists(art):
            try:
                draw(f"{scene}. {STYLE}", art); print(f"{sid}: art drawn ({engine})")
            except (SystemExit, requests.RequestException) as e:      # one refusal skips that Short, not the rest
                print(f"{sid}: SKIPPED, no art: {e}"); continue
        accent = json.load(open(f"public/datayt/beats/{sid}/data.json"))["accent"]
        jobs.append({"comp": "DK-cover", "props": {"art": art.removeprefix("public/"), "kicker": kicker, "headline": headline, "accent": accent},
                     "out": f"out/datakadai/daily/{date}/{sid}/cover-{engine}.png"})
    jf = "out/datakadai/covers_jobs.json"; json.dump(jobs, open(jf, "w"), indent=1, ensure_ascii=False)
    subprocess.run(["node", "scripts/datayt/render_posts.mjs", jf], check=True)


if __name__ == "__main__":
    main()
