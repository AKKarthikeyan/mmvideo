#!/usr/bin/env python3
"""Voices a long-form storyboard scene by scene with MiniMax (the house voice) and measures the word times.

  zsh -lic '.venv/bin/python scripts/datayt/long_voice.py voice [--only s001,s002]'   # MiniMax, 06:45-22:10 IST only
  .venv/bin/python scripts/datayt/long_voice.py words                                  # whisper word times -> word_times.json
  .venv/bin/python scripts/datayt/long_voice.py mix                                    # master narration track, -16 LUFS, from timeline.json

Files (public/datayt/long/babies/): vo/<id>.mp3 (+ .json sidecar from voice_dk.say), vo/manifest.json, word_times.json (the --words file of
long_timeline.py: {"scenes": {id: {"words": [{w, start, end}], "sec"}}}), vo/narration.wav (mixed master, placed at each scene's `from`).
Voice lines are cached by voice_dk.say (engine, voice, speed and text), so a re-run only voices what changed. Never falls back to Kokoro.
MINIMAX_KEY_VAR=MINIMAX_GO_API_KEY uses the second plan (AK, 25 Oct 2026: when the first hits its limit).
"""
import json, os, subprocess, sys, datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LONG = os.path.join(ROOT, os.environ.get("LONG_DIR") or "public/datayt/long/babies")   # LONG_DIR=public/datayt/long/namakkal/A for another film
VO = os.path.join(LONG, "vo")
SB = os.path.join(LONG, "storyboard.json")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def scenes():
    return json.load(open(SB, encoding="utf-8"))["scenes"]


def spoken(text):
    """The text sent to the voice: same words, plus a comma when a scene stops mid-sentence so the voice does not fall as if it had ended."""
    t = text.strip()
    return t if t[-1] in ".?!,;:" else t + ","


def in_window():
    ist = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=5, minutes=30)))
    return (6, 45) <= (ist.hour, ist.minute) < (22, 10), ist.strftime("%H:%M IST")


def voice(only):
    ok, now = in_window()
    # NIGHT_OK=1: AK's explicit go-ahead to voice outside the window (29 Oct 2026, Namakkal films, on MINIMAX_GO_API_KEY, which only
    # com.vigilv2.shadow uses, from 02:10). Never set it without AK saying so for that run.
    if not ok and os.environ.get("NIGHT_OK") == "1": ok = True; print("voicing outside the window on AK's go-ahead,", now, flush=True)
    if not ok: raise SystemExit(f"MiniMax voice runs 06:45-22:10 IST only (now {now}); the key is busy at night.")
    kv = os.environ.get("MINIMAX_KEY_VAR")
    if kv: os.environ["MINIMAX_API_KEY"] = os.environ[kv]
    if not os.environ.get("MINIMAX_API_KEY"): raise SystemExit("MINIMAX_API_KEY is not set: run this inside zsh -lic")
    import voice_dk as V
    if V.ENGINE != "minimax": raise SystemExit("engine is not minimax")
    os.makedirs(VO, exist_ok=True)
    man_p = os.path.join(VO, "manifest.json")
    man = json.load(open(man_p)) if os.path.exists(man_p) else {}
    for s in scenes():
        if only and s["id"] not in only: continue
        if not s["vo"].strip(): continue                 # silent scenes (chapter cards)
        f, sec = V.say(spoken(s["vo"]), os.path.join(VO, s["id"]))
        man[s["id"]] = {"file": f, "sec": sec, "text": s["vo"], "voice": V.VOICE, "engine": V.ENGINE}
        json.dump(man, open(man_p, "w"), indent=1)
        print(s["id"], f"{sec:.2f}s", flush=True)
    print("voiced", len(man), "scenes, total", round(sum(m["sec"] for m in man.values()), 1), "s")


def words(only):
    import wave, tempfile
    import numpy as np, mlx_whisper
    man = json.load(open(os.path.join(VO, "manifest.json")))
    out_p = os.path.join(LONG, "word_times.json")
    out = json.load(open(out_p))["scenes"] if os.path.exists(out_p) else {}
    ff = "/tmp/ffbin/ffmpeg"     # Remotion's ffmpeg has no pipe muxer, so decode to a 16 kHz wav first (run in ~/jev_full/.stt-venv)

    def a16(path):
        with tempfile.TemporaryDirectory() as td:
            wav = os.path.join(td, "a.wav")
            subprocess.run([ff, "-v", "error", "-y", "-i", path, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav], check=True)
            w = wave.open(wav)
            return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    for s in scenes():
        if only and s["id"] not in only: continue
        if not s["vo"].strip(): continue
        m = man[s["id"]]
        audio = a16(os.path.join(VO, m["file"]))
        import difflib, re
        keep = lambda t: re.sub(r"[^a-z0-9]", "", t.lower())
        best = None
        for prompt in (s["vo"], None):      # the script as a prompt helps numbers; but it sometimes makes whisper drop the start of a line, so retry without it
            r = mlx_whisper.transcribe(audio, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="en", word_timestamps=True,
                                       initial_prompt=prompt, condition_on_previous_text=False)
            q = difflib.SequenceMatcher(None, keep(s["vo"]), keep(r["text"])).ratio()
            if best is None or q > best[0]: best = (q, r)
            if q >= 0.93: break
        r = best[1]
        if best[0] < 0.93: print("  WARNING", s["id"], "heard text matches the script only", round(best[0], 2), flush=True)
        ws = [{"w": w["word"].strip(), "start": round(w["start"], 3), "end": round(w["end"], 3)} for seg in r["segments"] for w in seg.get("words", []) if w["word"].strip()]
        out[s["id"]] = {"words": ws, "sec": m["sec"], "heard": r["text"].strip()}
        print(s["id"], len(ws), "words,", m["sec"], "s |", r["text"].strip()[:90], flush=True)
        json.dump({"scenes": out}, open(out_p, "w"), indent=1, ensure_ascii=False)


def mix():
    import numpy as np
    sys.path.insert(0, os.path.join(ROOT, "scripts"))
    import voice_dk as V
    tl = json.load(open(os.path.join(LONG, "timeline.json")))
    man = json.load(open(os.path.join(VO, "manifest.json")))
    sr = V.SR
    total = int(round(tl["total"] / tl["fps"] * sr))
    track = np.zeros(total + sr, dtype=np.float32)
    for s in tl["scenes"]:
        if s["id"] not in man: continue                  # silent scenes
        a = V.pcm(os.path.join(VO, man[s["id"]]["file"]))
        i = int(round(s["from"] / tl["fps"] * sr))
        end = min(len(track), i + len(a))
        track[i:end] += a[:end - i]
    track = track[:total]
    import wave
    raw = os.path.join(VO, "narration_raw.wav")
    w = wave.open(raw, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    final = os.path.join(VO, "narration.wav")
    subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(sr), "-ac", "1", final], check=True, cwd=ROOT)
    print("wrote", final, round(total / sr, 1), "s")


def srt(out_path):
    """English captions (SRT) for YouTube: the script's own words, timed by the measured word times, phrases of up to two lines."""
    import re, textwrap
    tl = json.load(open(os.path.join(LONG, "timeline.json")))
    wt = json.load(open(os.path.join(LONG, "word_times.json")))["scenes"]
    alnum = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
    fps, cues = tl["fps"], []
    for sc in tl["scenes"]:
        if not sc["vo"].strip() or sc["id"] not in wt: continue          # silent scenes (chapter cards)
        ws = wt[sc["id"]]["words"]
        cum, tot = [], 0
        for w in ws:
            cum.append((tot, tot + len(alnum(w["w"]))))
            tot += len(alnum(w["w"]))
        parts = [p for p in re.split(r"(?<=[,.?!:;])\s+", sc["vo"].strip()) if p]
        groups, cur = [], ""
        for p in parts:
            if cur and (len(cur) + 1 + len(p) > 72 or cur[-1] in ".?!"): groups.append(cur); cur = p
            else: cur = (cur + " " + p).strip()
        if cur: groups.append(cur)
        total_script = sum(len(alnum(g)) for g in groups) or 1
        base, pos = sc["from"] / fps, 0
        for g in groups:
            a, b = pos, pos + len(alnum(g)); pos = b
            a2, b2 = a * tot / total_script, b * tot / total_script
            i = next((k for k, (x, y) in enumerate(cum) if x <= a2 < y), 0)
            j = next((k for k, (x, y) in enumerate(cum) if x < b2 <= y), len(ws) - 1)
            lines = [g] if len(g) <= 48 else textwrap.wrap(g, len(g) // 2 + 8, break_on_hyphens=False)     # one line, or two balanced lines
            cues.append([base + ws[i]["start"], base + ws[j]["end"] + 0.12, "\n".join(lines)])
    for k, c in enumerate(cues):                       # no overlap, nothing shorter than 0.7 s unless the next cue starts sooner
        nxt = cues[k + 1][0] if k + 1 < len(cues) else c[1] + 1
        c[1] = min(max(c[1], c[0] + 0.7), nxt - 0.02) if nxt - 0.02 > c[0] else c[0] + 0.05
    ts = lambda t: f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(round(t % 1 * 1000)) % 1000:03d}"
    with open(out_path, "w", encoding="utf-8") as fh:
        for n, (s0, s1, tx) in enumerate(cues, 1): fh.write(f"{n}\n{ts(s0)} --> {ts(s1)}\n{tx}\n\n")
    print("wrote", out_path, len(cues), "cues")


if __name__ == "__main__":
    a = sys.argv[1:]
    only = set(a[a.index("--only") + 1].split(",")) if "--only" in a else None
    if a[0] == "srt": srt(a[1] if len(a) > 1 else os.path.join(ROOT, "out/long/babies/babies_english.srt"))
    else: {"voice": voice, "words": words, "mix": lambda o: mix()}[a[0]](only)
