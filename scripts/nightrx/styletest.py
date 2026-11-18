#!/usr/bin/env python3
"""The Night Pharmacist: 60-second style test. Ep 1, Night 1, 1:07 am: Raghavan's coffee, the order book, the red foil.
Voices each line with Sarvam Bulbul v3 (Indian English, one speaker per character), composes the night sounds in code
(no licensed audio) and writes public/nightrx/styletest/data.json for src/nightrx/StyleTest.tsx.

  zsh -lic 'python3 scripts/nightrx/styletest.py'       # needs SARVAM_API_KEY (Mini login shell)
  zsh -lic 'python3 scripts/nightrx/styletest.py audition'   # also writes audition.wav: every candidate voice, one line each
Render: npx remotion render src/nightrx/index.ts NRX-styletest out/nightrx/nightrx_styletest.mp4
Voices are SAMPLES for AK to judge (AGENTS.md rule 7); a female voice for Meena is not yet approved."""
import array, base64, json, math, os, random, subprocess, sys, wave
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/nightrx/styletest"
VO = OUT / "vo"; SFX = OUT / "sfx"
for d in (VO, SFX): d.mkdir(parents=True, exist_ok=True)
SR = 44100
FFMPEG = ROOT / "node_modules/@remotion/compositor-darwin-arm64/ffmpeg"

VOICE = {"meena": "kavitha", "raghavan": "ratan", "babu": "rohan"}
PACE = {"meena": 0.95, "raghavan": 0.92, "babu": 1.08}
AUDITION = {"meena": ["kavitha", "roopa", "ritu", "shruti"], "raghavan": ["ratan", "anand", "gokul", "mani"],
            "babu": ["rohan", "aayan", "shubh"]}

# Shots in screen order. kb = Ken Burns (scale, focus x, focus y) at start -> end; focus is 0..1 of the frame.
# Events: ("say", who, key, text[, italic]) | ("pause", s) | ("sfx", name, offset_s, vol)
SHOTS = [
    {"p": "p01", "kb": [(1.0, .30, .45), (1.12, .28, .42)], "card": "NIGHT 1 · 1:07 AM|7 DAYS TO THE INQUIRY",
     "ev": [("sfx", "chime", 3.6, .55), ("pause", 4.6)]},
    {"p": "p04", "kb": [(1.08, .55, .40), (1.0, .50, .45)],
     "ev": [("pause", .35), ("say", "raghavan", "r1", "Coffee for the night pharmacist! Fresh filter. Strong, like me."), ("pause", .35)]},
    {"p": "p03", "kb": [(1.05, .62, .40), (1.14, .64, .36)],
     "ev": [("say", "meena", "m1", "Good evening, Raghu! Nobody is strong at one o'clock in the morning."), ("pause", .45)]},
    {"p": "p05", "kb": [(1.0, .45, .50), (1.10, .45, .55)], "ev": [("sfx", "pour", 0.0, .8), ("pause", 2.6)]},
    {"p": "p06", "mode": "reel", "stamp": "01:07", "kb": [(1.0, .62, .45), (1.06, .62, .42)],
     "ev": [("say", "babu", "b1", "Day one. One-oh-seven a.m. Raghu uncle arrives. Every night. Like a clock.", True), ("pause", .35)]},
    {"p": "p07", "kb": [(1.0, .55, .55), (1.08, .45, .60)],
     "ev": [("say", "raghavan", "r2", "Tomorrow's order, madam. Sign here, and I will leave you in peace."), ("pause", .3)]},
    {"p": "p08", "subTop": True, "kb": [(1.04, .62, .60), (1.20, .70, .70)],
     "ev": [("sfx", "pen", 0.2, .7), ("pause", .9), ("say", "babu", "b2", "Akka, your glasses. They are on your head."), ("pause", .25),
            ("say", "meena", "m2", "For thirty years I have signed my name, Babu. My hand knows the way."), ("pause", .5)]},
    {"p": "p10", "kb": [(1.0, .40, .50), (1.07, .35, .45)],
     "ev": [("sfx", "tear", 0.15, .8), ("pause", .55), ("say", "raghavan", "r3", "Your copy, madam."), ("pause", .45)]},
    {"p": "p06", "mode": "reel", "stamp": "01:09", "kb": [(1.08, .62, .40), (1.12, .62, .40)],
     "ev": [("say", "babu", "b3", "Uncle, what's your medicine? Akka knows everyone's medicine."), ("pause", .25)]},
    {"p": "p09", "kb": [(1.0, .42, .45), (1.08, .40, .40)],
     "ev": [("say", "meena", "m3", "Him? Nothing at all. Strong as an ox."), ("pause", .3)]},
    {"p": "p09b", "kb": [(1.0, .55, .45), (1.06, .58, .40)],
     "ev": [("say", "raghavan", "r4", "Never taken a pill in my life!"), ("pause", .6)]},
    {"p": "p11", "kb": [(1.0, .60, .55), (1.22, .80, .62)],
     "ev": [("sfx", "keys", 0.1, .8), ("sfx", "sting", 0.7, .75), ("pause", 3.2)]},
    {"p": "p12", "kb": [(1.0, .55, .50), (1.08, .70, .55)], "card2": "1:25 AM",
     "ev": [("say", "raghavan", "r5", "Good night, Meena. Going home. Anna Nagar."), ("sfx", "car", 0.4, .7), ("pause", 3.4)]},
    {"p": "end", "ev": [("pause", 4.2)]},
]
GAP = 0.18      # between consecutive lines inside a shot
XF = 0.4        # cross-fade between shots (seconds), overlapping the end of the previous shot


def wav_read(p):
    with wave.open(str(p)) as w:
        return w.getframerate(), array.array("h", w.readframes(w.getnframes()))


def wav_seconds(p):
    sr, a = wav_read(p); return len(a) / sr


def write(path, samples, peak=0.9):
    m = max(1e-9, max(abs(x) for x in samples))
    a = array.array("h", (int(x / m * peak * 32767) for x in samples))
    with wave.open(str(path), "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())


def trim(path, pad=0.05, thr=400):
    sr, a = wav_read(path)
    i = next((k for k, x in enumerate(a) if abs(x) > thr), 0); j = len(a) - next((k for k, x in enumerate(reversed(a)) if abs(x) > thr), 0)
    a = a[max(0, i - int(pad * sr)): min(len(a), j + int(pad * sr))]
    with wave.open(str(path), "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(a.tobytes())


def sarvam(text, speaker, pace, path):
    body = {"text": text, "target_language_code": "en-IN", "speaker": speaker, "model": "bulbul:v3", "pace": pace,
            "speech_sample_rate": 24000}
    for attempt in range(5):
        r = requests.post("https://api.sarvam.ai/text-to-speech", headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                          json=body, timeout=120)
        if r.status_code == 200 and r.json().get("audios"):
            raw = path.with_suffix(".raw.wav"); raw.write_bytes(base64.b64decode("".join(r.json()["audios"])))
            subprocess.run([str(FFMPEG), "-y", "-loglevel", "error", "-i", str(raw), "-ac", "1", "-ar", str(SR), str(path)],
                           check=True, env={**os.environ, "DYLD_LIBRARY_PATH": str(FFMPEG.parent)})
            raw.unlink(); trim(path); return
        print("  retry", path.name, r.status_code, r.text[:200], flush=True)
        import time; time.sleep(5 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)


# ---------- sounds, composed in code
def noise_lp(n, a, seed):
    rng = random.Random(seed); y = 0.0; out = []
    for _ in range(n):
        y += a * (rng.uniform(-1, 1) - y); out.append(y)
    return out


def snd_tick():
    n = int(0.06 * SR); return [math.sin(2 * math.pi * 2400 * j / SR) * math.exp(-j / SR * 140) + 0.4 * math.sin(2 * math.pi * 900 * j / SR) * math.exp(-j / SR * 90) for j in range(n)]


def snd_room():
    """6 s seamless loop: tube-light hum (100 Hz + harmonics) over far traffic rumble."""
    n = 6 * SR; rumble = noise_lp(n, 0.004, 1); out = []
    for j in range(n):
        t = j / SR
        hum = sum(math.sin(2 * math.pi * 100 * k * t) / k ** 1.5 for k in (1, 2, 3, 5))
        out.append(0.18 * hum + 9 * rumble[j])
    f = int(0.3 * SR)                     # cross-fade the ends so the loop has no click
    for j in range(f):
        w = j / f; out[j] = out[j] * w + out[n - f + j] * (1 - w)
    return out[: n - f]


def snd_chime():
    out = [0.0] * int(2.2 * SR)
    for start, f in ((0.0, 659.3), (0.42, 523.3)):
        s = int(start * SR)
        for j in range(len(out) - s):
            t = j / SR; out[s + j] += sum(a * math.sin(2 * math.pi * f * r * t) for r, a in ((1, 1), (2.01, .3), (3.9, .12))) * math.exp(-t * 2.6)
    return out


def snd_pour():
    n = int(2.6 * SR); base = noise_lp(n, 0.25, 2); rng = random.Random(4); out = []; ph = 0.0
    for j in range(n):
        t = j / SR; env = min(1, t / 0.25) * (1 if t < 2.0 else max(0, 1 - (t - 2.0) / 0.6))
        f = 380 + 160 * math.sin(2 * math.pi * 3.1 * t) + rng.uniform(-40, 40); ph += 2 * math.pi * f / SR
        out.append(env * (0.8 * base[j] + 0.12 * math.sin(ph) * (0.5 + 0.5 * math.sin(2 * math.pi * 7 * t))))
    return out


def snd_pen():
    n = int(1.1 * SR); base = noise_lp(n, 0.6, 5); out = []
    for j in range(n):
        t = j / SR; strokes = max(0, math.sin(2 * math.pi * 4.5 * t)) ** 3
        out.append(base[j] * strokes * min(1, (1.1 - t) / 0.2))
    return out


def snd_tear():
    n = int(0.75 * SR); base = noise_lp(n, 0.7, 6); rng = random.Random(7); out = []
    for j in range(n):
        t = j / SR; env = min(1, t / 0.03) * math.exp(-t * 2.2) * (0.6 + 0.4 * (rng.random() > 0.55))
        out.append(base[j] * env)
    return out


def snd_keys():
    rng = random.Random(8); out = [0.0] * int(1.4 * SR)
    for _ in range(14):
        s = int(rng.uniform(0, 0.9) * SR); f = rng.uniform(2800, 6200); a = rng.uniform(.3, 1)
        for j in range(min(int(0.25 * SR), len(out) - s)):
            t = j / SR; out[s + j] += a * math.sin(2 * math.pi * f * t) * math.exp(-t * 28)
    return out


def snd_sting():
    """Low cello-like swell for the red foil: the one ominous note in the scene."""
    n = int(3.2 * SR); out = []; ph = 0.0
    for j in range(n):
        t = j / SR; f = 73.4 * (1 - 0.015 * min(1, t / 2.5)); ph += 2 * math.pi * f / SR
        env = min(1, t / 0.9) * (1 if t < 2.2 else max(0, 1 - (t - 2.2) / 1.0))
        out.append(env * sum(math.sin(k * ph) / k ** 1.3 for k in range(1, 7)))
    return out


def snd_car():
    n = int(3.6 * SR); out = []; ph = 0.0; base = noise_lp(n, 0.02, 9)
    for j in range(n):
        t = j / SR; f = 38 + 22 * min(1, t / 1.6); ph += 2 * math.pi * f / SR
        env = min(1, t / 0.4) * (1 if t < 1.4 else max(0, 1 - (t - 1.4) / 2.2))
        out.append(env * (0.5 * math.sin(ph) + 0.25 * math.sin(2 * ph) + 12 * base[j]))
    return out


SOUNDS = {"tick": snd_tick, "room": snd_room, "chime": snd_chime, "pour": snd_pour, "pen": snd_pen, "tear": snd_tear,
          "keys": snd_keys, "sting": snd_sting, "car": snd_car}


LOOK = os.environ.get("NRX_LOOK", "ink")   # "live": the live-action look AK chose 24 Oct; same voices, sound and edit
PICS = ROOT / ("public/nightrx/styletest_live" if LOOK == "live" else "public/nightrx/styletest")   # img/, clip/, data.json
CLIPS = PICS / "clip"
CLIP_FROM = {("p06", 1): 5.4}    # Babu's second reel moment plays the back half of his 10 s clip


def clip_secs(path):
    probe = FFMPEG.parent / "ffprobe"
    r = subprocess.run([str(probe), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True, env={**os.environ, "DYLD_LIBRARY_PATH": str(FFMPEG.parent)})
    return float(r.stdout.strip())


def attach_clips(shots):
    """Moving cut: a shot with clip/<panel>.mp4 plays it instead of the still. Where the shot (plus its cross-fade)
    outlasts what is left of the clip, the clip is slowed just enough to cover it."""
    seen = {}
    for s in shots:
        path = CLIPS / f"{s['p']}.mp4"
        if not path.exists(): continue
        n = seen.get(s["p"], 0); seen[s["p"]] = n + 1
        start = CLIP_FROM.get((s["p"], n), 0.0)
        need = s["end"] - s["start"] + XF
        rate = min(1.0, (clip_secs(path) - start - 0.05) / need)
        s["clip"] = {"src": f"{s['p']}.mp4", "from": start, "rate": round(rate, 3)}


def main():
    random.seed(11)
    for name, fn in SOUNDS.items():
        if not (SFX / f"{name}.wav").exists(): write(SFX / f"{name}.wav", fn()); print(" composed", name)

    old = {}
    if (OUT / "data.json").exists():
        old = {l["key"]: l for l in json.load(open(OUT / "data.json"))["lines"]}
    t = 0.0; shots, lines, sfx = [], [], []
    for i, s in enumerate(SHOTS):
        start = max(0.0, t - (XF if i else 0)); cur = t; prev_line = False
        for ev in s["ev"]:
            if ev[0] == "pause":
                cur += ev[1]; prev_line = False
            elif ev[0] == "sfx":
                sfx.append({"name": ev[1], "start": round(cur + ev[2], 3), "vol": ev[3]})
            else:
                _, who, key, text, *it = ev
                wav = VO / f"{key}.wav"; spk = VOICE[who]
                o = old.get(key)
                if not (wav.exists() and o and o["text"] == text and o["voice"] == spk):
                    sarvam(text, spk, PACE[who], wav); print(" voiced", key, spk, flush=True)
                if prev_line: cur += GAP
                d = round(wav_seconds(wav), 3)
                lines.append({"key": key, "who": who, "voice": spk, "text": text, "italic": bool(it and it[0]), "start": round(cur, 3), "dur": d})
                cur += d; prev_line = True
        shots.append({k: v for k, v in s.items() if k != "ev"} | {"start": round(start, 3), "end": round(cur, 3)})
        t = cur
    total = round(t, 3)
    attach_clips(shots)
    if LOOK == "live":   # the live p08 has the pen at the top of the frame, so its subtitles stay at the bottom
        for sh in shots: sh.pop("subTop", None)
    json.dump({"id": "styletest", "base": f"nightrx/{PICS.name}", "fps": 30, "total": total, "xf": XF, "shots": shots, "lines": lines, "sfx": sfx},
              open(PICS / "data.json", "w"), indent=1, ensure_ascii=False)
    print("styletest", len(shots), "shots", len(lines), "lines", total, "s")

    if sys.argv[1:] == ["audition"]:
        sample = {"meena": "Good evening, Raghu! Nobody is strong at one o'clock in the morning.",
                  "raghavan": "Coffee for the night pharmacist! Fresh filter. Strong, like me.",
                  "babu": "Uncle, what's your medicine? Akka knows everyone's medicine."}
        AUD = OUT / "audition"; AUD.mkdir(exist_ok=True); seq = []
        for who, spks in AUDITION.items():
            for spk in spks:
                p = AUD / f"{who}_{spk}.wav"
                if not p.exists(): sarvam(sample[who], spk, PACE[who], p); print(" audition", who, spk, flush=True)
                seq.append(p)
        lst = AUD / "list.txt"; lst.write_text("".join(f"file '{p}'\n" for p in seq))
        subprocess.run([str(FFMPEG), "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                        "-af", "apad=pad_dur=0.6", str(OUT / "audition.wav")], check=True, env={**os.environ, "DYLD_LIBRARY_PATH": str(FFMPEG.parent)})
        print(" audition order:", ", ".join(f"{w}:{s}" for w, ss in AUDITION.items() for s in ss))


if __name__ == "__main__":
    main()
