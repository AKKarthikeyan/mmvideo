#!/usr/bin/env python3
"""Gita channel style test (60 s): 2.10 cold open, one verse card, one chariot diagram build.
Voices every cue, composes the sound samples in code (tanpura cycle, bell, conch swell, thud)
and writes public/gita/styletest/data.json for src/gita/StyleTest.tsx.

  python3 scripts/gita/styletest.py            # scratch voice: macOS `say -v Aman` (male, en-IN)
  python3 scripts/gita/styletest.py minimax    # English_Diligent_Man (only 06:45-22:10 IST; NOT YET RUN)

Sources (checked 21 Oct 2026 against sanskritdocuments.org):
  Gita 1.29-30 (mouth dry, limbs fail, Gandiva slips), 1.47 (sits down in the chariot), 2.9 ("na yotsya", I will not fight),
  2.10 (prahasann iva, "as if smiling"), Katha Upanishad 1.3.3-4 (self = rider, body = chariot, intellect = driver,
  mind = reins, senses = horses). Translations are ours, word for word. b7 and b8 are our interpretation and are shown
  in the "our note" style on screen.
"""
import array, json, math, os, random, socket, subprocess, sys, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "gita" / "styletest"
OUT.mkdir(parents=True, exist_ok=True)
SR = 44100
VOICE = sys.argv[1] if len(sys.argv) > 1 else "say"
SPEED = 1.12                   # MiniMax speed, as the geo Shorts use
VTAG = f"minimax@{SPEED}" if VOICE == "minimax" else VOICE
FFMPEG = ROOT / "node_modules/@remotion/compositor-darwin-arm64/ffmpeg"

# (beat, cue key, spoken text). Cues are voiced one by one so every on-screen reveal lands on its own words.
CUES = [
    ("b1", "c01", "Two armies face each other at dawn."),
    ("b1", "c02", "Between them, in a chariot, stands the finest archer of his age."),
    ("b1", "c03", "And his hands begin to shake."),
    ("b2", "c04", "His mouth goes dry."),
    ("b2", "c05", "His limbs give way."),
    ("b2", "c06", "His bow slips from his hand."),
    ("b2", "c07", "He sits down in the chariot, and says: I will not fight."),
    ("b3", "c08", "Then the man holding the reins does something strange."),
    ("b3", "c09", "He smiles."),
    ("b4", "c10", "Bhagavad Gita. Chapter two, verse ten."),
    ("b4", "c11", "And Krishna, as if smiling, spoke these words to him, sinking in despair between the two armies."),
    ("b5", "c12", "Why would anyone smile at a man who is falling apart?"),
    ("b5", "c13", "Start with who is holding the reins."),
    ("b6", "c14", "An older text, the Katha Upanishad, draws the picture."),
    ("b6", "c15", "Your body is the chariot."),
    ("b6", "c16", "The senses are the horses."),
    ("b6", "c17", "The mind is the reins."),
    ("b6", "c18", "The intellect is the driver."),
    ("b6", "c19", "And you, the self, are the one riding."),
    ("b7", "c20", "Arjuna's horses had bolted."),
    ("b7", "c21", "But the reins were still in steady hands."),
    ("b8", "c22", "What Krishna says next, the whole of chapter two, is how to take them back."),
]
LEAD = 1.6                     # conch swell and dawn before the first word
GAP_CUE, GAP_BEAT = 0.22, 0.55
EXTRA_AFTER = {"c03": 0.5, "c06": 0.45, "c09": 1.1, "c10": 3.2, "c11": 1.2, "c13": 0.6, "c19": 0.8, "c21": 0.6}
TAIL = 2.4                     # end card hold


def wav_seconds(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def trim(wav, pad=0.06, thr=500):
    """Cut the clip's leading and trailing silence down to `pad` seconds (MiniMax adds ~0.25 s each side)."""
    with wave.open(str(wav)) as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth(); a = array.array("h", w.readframes(w.getnframes()))
    i = next((k for k, x in enumerate(a) if abs(x) > thr), 0); j = len(a) - next((k for k, x in enumerate(reversed(a)) if abs(x) > thr), 0)
    a = a[max(0, i - int(pad * sr)): min(len(a), j + int(pad * sr))]
    with wave.open(str(wav), "w") as w:
        w.setnchannels(ch); w.setsampwidth(sw); w.setframerate(sr); w.writeframes(a.tobytes())


def voice_say(text, wav):
    aiff = wav.with_suffix(".aiff")
    subprocess.run(["say", "-v", "Aman", "-r", "180", "-o", str(aiff), text], check=True)
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@44100", "-c", "1", str(aiff), str(wav)], check=True)
    aiff.unlink()


def voice_minimax(text, wav):   # same call as scripts/geo/voice_geo.py; IPv4 only (the Mini's IPv6 route hangs)
    import time, requests, urllib3.util.connection as uc
    uc.allowed_gai_family = lambda: socket.AF_INET
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": "English_Diligent_Man", "speed": SPEED, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"},
                          json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            mp3 = wav.with_suffix(".mp3"); mp3.write_bytes(bytes.fromhex(j["data"]["audio"]))
            subprocess.run([str(FFMPEG), "-y", "-loglevel", "error", "-i", str(mp3), "-ac", "1", "-ar", "44100", str(wav)],
                           check=True, env={**os.environ, "DYLD_LIBRARY_PATH": str(FFMPEG.parent)})
            return
        print("  retry", wav.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))   # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + wav.name)


# ---------- narration + timeline
old = {}
if (OUT / "data.json").exists():
    old = {c["key"]: c for c in json.load(open(OUT / "data.json"))["cues"]}
t = LEAD; cues = []; prev_beat = None
for beat, key, text in CUES:
    wav = OUT / f"{key}.wav"
    o = old.get(key)
    if not (wav.exists() and o and o["text"] == text and o.get("voice") == VTAG):
        (voice_minimax if VOICE == "minimax" else voice_say)(text, wav); trim(wav); print(" voiced", key)
    if prev_beat and beat != prev_beat: t += GAP_BEAT - GAP_CUE
    dur = round(wav_seconds(wav), 3)
    cues.append({"key": key, "beat": beat, "text": text, "voice": VTAG, "start": round(t, 3), "dur": dur})
    t += dur + GAP_CUE + EXTRA_AFTER.get(key, 0); prev_beat = beat
total = round(t + TAIL, 3)


# ---------- sound samples, composed in code (no licensed music)
def write(name, samples, peak=0.9):
    m = max(1e-9, max(abs(x) for x in samples))
    a = array.array("h", (int(x / m * peak * 32767) for x in samples))
    with wave.open(str(OUT / name), "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(a.tobytes())


def tanpura_cycle():
    """One seamless 6.4 s tanpura cycle, soft: Pa, Sa, Sa, low Sa (Sa = C#3). Pluck tails wrap round so the file loops.
    v2 (AK 21 Oct: v1 "sounds like loud noise"): 6 partials rolling off fast, slow bloom, two-pole low-pass."""
    sa = 138.59; notes = [sa * 1.5, sa * 2, sa * 2, sa]    # Pa (upper), Sa', Sa', Sa
    n = int(6.4 * SR); buf = [0.0] * n; step = n // 4
    for i, f in enumerate(notes):
        start = i * step
        for k in range(1, 7):
            amp = 1 / k ** 1.8; bloom = 0.18 + 0.08 * k; decay = 0.45 + 0.12 * k
            w = 2 * math.pi * f * k; ph = random.random() * 6.28
            for j in range(n):
                tt = j / SR
                buf[(start + j) % n] += amp * (1 - math.exp(-tt / bloom)) * math.exp(-tt * decay) * math.sin(w * tt + ph)
    for _ in range(2):    # two passes of a one-pole low-pass (~600 Hz): warm, no fizz
        y = buf[-1]; out = []
        for x in buf: y += 0.08 * (x - y); out.append(y)
        buf = out
    return buf


def bell():
    """Small temple bell: inharmonic partials, long ring."""
    f0 = 523.0; parts = [(1.0, 1.0, 1.6), (2.76, 0.5, 2.6), (5.40, 0.25, 4.0), (8.93, 0.12, 6.0), (0.5, 0.35, 1.0)]
    n = int(4.5 * SR)
    return [sum(a * math.exp(-j / SR * d) * math.sin(2 * math.pi * f0 * r * j / SR) for r, a, d in parts)
            * min(1, j / 40) for j in range(n)]


def conch():
    """Shankha: a soft, slightly rising horn tone that swells and fades (v2: almost no breath noise)."""
    n = int(3.4 * SR); out = []; ph = 0.0; rng = random.Random(3); y = 0.0; lp = 0.0
    for j in range(n):
        tt = j / SR
        f = 233 * (1 + 0.02 * min(1, tt / 1.2))
        ph += 2 * math.pi * f / SR
        tone = sum((1 / k ** 1.8) * math.sin(k * ph) for k in range(1, 6))
        y += 0.02 * (rng.uniform(-1, 1) - y)
        env = min(1, tt / 1.2) * (1 if tt < 2.0 else max(0, 1 - (tt - 2.0) / 1.4))
        lp += 0.12 * (env * (tone + 0.6 * y) - lp)
        out.append(lp)
    return out


def thud():
    """Low drum hit for the bow hitting the chariot floor."""
    n = int(0.9 * SR); out = []; ph = 0.0
    for j in range(n):
        tt = j / SR; f = 48 + 70 * math.exp(-tt * 18); ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * math.exp(-tt * 5.5))
    return out


random.seed(7)
for name, fn in [("tanpura.wav", tanpura_cycle), ("bell.wav", bell), ("conch.wav", conch), ("thud.wav", thud)]:
    if not (OUT / name).exists(): write(name, fn()); print(" composed", name)

json.dump({"id": "styletest", "fps": 30, "lead": LEAD, "total": total, "cues": cues},
          open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
print("styletest", len(cues), "cues", total, "s")
