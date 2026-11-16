#!/usr/bin/env python3
"""Build data for a dharma video in the Vox engine: validate phrases, fill verse scenes from the corpus, voice beats (MiniMax),
write public/vx/<id>/data.json (the engine reads audio from public/vx/<id>/<key>.mp3, so the data lives beside the other videos).
Usage: build_dharma.py [--no-tts] [--pics] [ids...]     (--pics: generate the title beats' mood plates with MiniMax)
Also writes public/vx/<id>/review.md: every verse with its Sanskrit, the English shown, and the narration round it, for the reviewer."""
import json, os, pathlib, re, sys, time
HERE = pathlib.Path(__file__).resolve().parent; sys.path.insert(0, str(HERE))
import corpus
from dharma_scripts import VIDEOS
ROOT = HERE.parent.parent / "public" / "vx"


def chunks(t, lim=78):   # caption cues, same rule as build_vx.py
    out = []
    for s in re.findall(r'.+?(?:[.!?:]["”]?(?=\s|$)|$)', t):
        s = s.strip()
        while len(s) > lim:
            c = s.rfind(", ", 0, lim); cut = c + 1 if c > lim * 0.45 else s.rfind(" ", 0, lim)
            out.append(s[:cut].strip()); s = s[cut:].strip()
        if s: out.append(s)
    return out


def phrases(scene):
    """Every `at` (and, outside verse scenes, every `hl`) must be a phrase of the narration."""
    out = []
    def walk(x, in_verse):
        if isinstance(x, dict):
            iv = in_verse or x.get("type") == "verse"
            for k, v in x.items():
                if k == "at" and isinstance(v, str): out.append(v)
                elif k == "hl" and not iv: out.extend(v if isinstance(v, list) else [v])
                elif k == "add" and isinstance(v, list): out.extend(v)
                else: walk(v, iv)
        elif isinstance(x, list):
            for v in x: walk(v, in_verse)
    walk(scene, False); return out


def tts(text, path, voice):
    import requests
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            open(path, "wb").write(bytes.fromhex(j["data"]["audio"])); return j["extra_info"]["audio_length"] / 1000
        print("  retry", path.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))   # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + path.name)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; notts = "--no-tts" in sys.argv
    for V in VIDEOS:
        if args and V["id"] not in args: continue
        out = ROOT / V["id"]; out.mkdir(parents=True, exist_ok=True)
        bad, review, warn = [], [], []
        for b in V["beats"]:
            b["cap"] = b["cap"] or b["say"]
            s = b["scene"]
            if s.get("type") == "verse":
                r = corpus.ref(s["ref"]); s.update(r)   # sa, tr, en, src, author: from the source files, never typed
                for w in s.get("hl") or []:
                    if w.lower() not in s["en"].lower(): warn.append((b["key"], f"hl word not in the translation: {w}"))
                review.append((b["key"], s["ref"], " / ".join(r["sa"]), r["en"], r["src"], b["say"]))
            for p in phrases(s):
                if p.split("|")[0].lower() not in b["say"].lower(): bad.append((b["key"], p))
        if bad: raise SystemExit(f"{V['id']}: phrases not in narration: {bad}")
        for k, m in warn: print(" warn", k, m)
        old = {}
        if (out / "data.json").exists(): old = {x["key"]: x for x in json.load(open(out / "data.json"))["beats"]}
        for b in V["beats"]:
            mp3 = out / f"{b['key']}.mp3"; o = old.get(b["key"])
            if mp3.exists() and o and o.get("say") == b["say"]: b["sec"] = o["sec"]
            elif notts: b["sec"] = max(3.0, len(b["say"]) / 15)
            else: b["sec"] = round(tts(b["say"], mp3, V.get("voice", "English_Diligent_Man")), 2); print(" voiced", b["key"], b["sec"])
            b["cues"] = chunks(b["cap"])
        data = {k: V.get(k) for k in ("id", "title", "chapters", "shorts", "reviewed_by", "sources_note", "brand", "brandName", "endLines",
                                       "keyword", "spine", "gate", "marks", "hooks", "next_video", "pics")}
        data["timelines"] = {}; data["beats"] = V["beats"]; data["clips"] = {}
        json.dump(data, open(out / "data.json", "w"), indent=1, ensure_ascii=False)
        with open(out / "review.md", "w", encoding="utf-8") as f:
            f.write(f"# {V['title']} · verse review sheet\n\nreviewed_by: {V.get('reviewed_by')}\n\n{V.get('sources_note','')}\n\n")
            for key, ref, sa, en, src, say in review:
                f.write(f"## {key} · {ref}\n\n{sa}\n\n**Shown:** {en}  \n*{src}*\n\n**Narration:** {say}\n\n")
        tot = sum(b["sec"] for b in V["beats"])
        print(f"{V['id']}: {len(V['beats'])} beats, {tot/60:.2f} min narration ({'estimated' if notts else 'voiced'}), {len(review)} verses, review sheet at {out / 'review.md'}")
        hook_check(V, data)
        if "--pics" in sys.argv: pics(V, out)


def hook_check(V, data, MAX=45.0):
    """The story-format rule (AK, 11 Oct 2026), same arithmetic as scripts/hook_check.py: a question by 0:05, then a hook at
    most every 45 s. V["hooks"] = ["key|phrase" ...] or bare "key"."""
    import math
    HK = {}
    for h in V.get("hooks") or []:
        k, _, ph = h.partition("|"); HK.setdefault(k, []).append(ph)
    t = 0.0; pts = []; first_q = None
    for b in data["beats"]:
        say = b["say"]; n = math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * 30) / 30
        if first_q is None and "?" in say: first_q = t + b["sec"] * say.index("?") / len(say)
        for ph in HK.get(b["key"], []):
            i = say.lower().find(ph.lower()) if ph else 0
            if i < 0: print(f"  FAIL  hook phrase not in {b['key']}: {ph}"); i = 0
            pts.append((t + b["sec"] * i / len(say), b["key"], (ph or say)[:60]))
        t += n
    pts.sort(); fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"; bad = 0
    print(f"hooks: {fmt(t)} total, {len(pts)} hook beats, limit {MAX:.0f} s")
    if first_q is None or first_q > 5: bad += 1; print(f"  FAIL  opening question by 0:05: first question at {fmt(first_q) if first_q is not None else 'never'}")
    else: print(f"  PASS  opening question by 0:05: at {first_q:.1f} s")
    prev = 0.0
    for s, k, txt in pts + [(t, "END", "")]:
        gap = s - prev
        if gap > MAX: bad += 1; print(f"  FAIL  {fmt(s)}  +{gap:4.0f} s  {k:5} {txt}")
        prev = s
    print("  hook cadence holds" if not bad else f"  {bad} hook problem(s)")
    return bad == 0


PLATE_STYLE = ("Vintage mid-century editorial illustration, muted warm palette of cream, tan, charcoal and brick red, halftone print texture, "
               "visible paper grain, soft cinematic light, quiet documentary mood. No people, no faces, no figures, no deities, no idols, no statues, "
               "no text, no letters, no numbers, no logos.")


def pics(V, out):
    """Mood plates for title beats, like scripts/pics_gen.py (MiniMax image-01). V["pics"] = {name: (prompt, "land"|"vert")}.
    The channel's rule: no deity, no person, no text in any generated image; the plate is a background, never the illustration."""
    import os, base64, requests
    key = os.environ.get("MINIMAX_API_KEY")
    if not key: print("pics: MINIMAX_API_KEY not set, skipped"); return
    d = out / "pics"; d.mkdir(exist_ok=True)
    for name, (prompt, orient) in (V.get("pics") or {}).items():
        f = d / f"{name}.png"
        if f.exists(): continue
        w, h = (1920, 1080) if orient == "land" else (1080, 1920)
        body = {"model": "image-01", "prompt": f"{prompt}. {PLATE_STYLE}", "width": w, "height": h, "response_format": "base64", "n": 1, "prompt_optimizer": False}
        for attempt in range(6):
            j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=180).json()
            imgs = (j.get("data") or {}).get("image_base64") or []
            if imgs: f.write_bytes(base64.b64decode(imgs[0])); print(" plate", name); break
            print("  retry", name, j.get("base_resp")); time.sleep(20 * (attempt + 1))
        else: raise SystemExit("plate failed: " + name)


if __name__ == "__main__":
    main()
