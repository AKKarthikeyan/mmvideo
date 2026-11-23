#!/usr/bin/env python3
"""Builder (role 6) for mm-asianpaints-dealers: voice, voiced story.js, sound mix, loudness, voice check.

Uses tools/shorts_build.py's own MiniMax call (tts), clip trimming (pcm) and wav writer, so the voice is made exactly as
for the benchmark Shorts. What is different, and why it lives here: the beats come from the LOCKED
productions/<id>/script.json (not from shorts_build.py's S dict), and each beat keeps the script's own pause after it
(the director's two planned silences, b4 0.7 s and b6 1.0 s), where shorts_build.py puts a fixed 0.12 s gap.

usage (on the Mac Mini, repo root, inside `zsh -lic` so the key loads):
  python3 hyperframes/shorts/mm-asianpaints-dealers/build_film.py story     voice -> story.js, check.json, voice.wav
  python3 hyperframes/shorts/mm-asianpaints-dealers/build_film.py check     scripts/shorts_check.py on check.json
  python3 hyperframes/shorts/mm-asianpaints-dealers/build_film.py mix       after `hf.py render`: sound plan + -14 LUFS
  python3 hyperframes/shorts/mm-asianpaints-dealers/build_film.py verify    mlx-whisper on the final mix vs the script
Never prints a key. Media go to out/ (not git).
"""
import hashlib, json, math, re, subprocess, sys, wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(ROOT / "hyperframes" / "tools"))
import shorts_build as sb  # noqa: E402

SID = "mm-asianpaints-dealers"
SCRIPT = json.loads((ROOT / "productions" / SID / "script.json").read_text())
ADIR = sb.OUT / "shorts_audio" / SID
PROD = ROOT / "out" / "productions" / SID
SR = sb.SR
LANG = "en-IN"          # voice English_Diligent_Man, as named in script.json
assert sb.VOICE[LANG]["voice_id"] == SCRIPT["voice"]
GAP = 0.12               # check.json's gap (shorts_check.py's loop gap); a beat's extra pause is folded into its sec
# pauses the builder may shorten if the voiced cut passes 45 s (director: b3 first, never b4/b6); logged in DIRECTOR_LOG
PAUSE_OVERRIDE = json.loads((HERE / "pauses.json").read_text()) if (HERE / "pauses.json").exists() else {}

# one caption per beat (*word* = accent); AK fix 1 (22 Nov): b3 shows the spoken words, not 0.9 %
CAPS = {"b1": "'One of our *strongest*'", "b2": "Rival: '*invest aggressively*'",
        # review M1 (23 Nov): a number shows only from the word that says it; [(cue phrase, caption), ...]
        "b3": [(None, "*Almost all* to dealers"), ("The ten", "The *ten biggest*")],
        "b4": "*Shop by shop*", "b5": [(None, "Birla Opus · *Grasim says*"), ("fifty", "*50,000+* dealers · Grasim says")], "b6": "In a *court judgment*",
        "b7": "*Allegation* only", "b8": "'Merely a *prima facie* opinion'", "b9": "Brand · capacity · *distribution depth*",
        "b10": "The *counter*"}
# phrases at which the picture changes (index.html moments), for shorts_check.py H4
EV = {"b1": ["Asian Paints calls", "one of its"], "b2": ["Still a moat", "A new rival"],
      "b3": ["Asian Paints sells", "The ten biggest"], "b4": ["So rivals"],
      "b5": ["Grasim says", "over fifty", "with compact"], "b6": ["But that machine", "turned up"],
      "b7": ["Grasim alleged", "alleged", "return it"], "b8": ["The competition", "probe order", "the court notes"],
      "b9": ["Still a moat", "distribution depth"], "b10": ["So the counter", "Which is why"]}


# review M1 (23 Nov): word starts measured on voice.wav (mlx-whisper large-v3-turbo, word timestamps), because the
# char-proportional estimate put "ten" 0.53 s and "fifty" 0.46 s early. Valid for the current voice clips only.
CUES = {"b3:The ten": 11.32, "b3:under one": 12.36, "b5:over fifty": 19.30, "b5:fifty": 19.60}


def pause(b):
    return float(PAUSE_OVERRIDE.get(b["key"], b["pause"]))


def clip(say, k=0):
    eng = sb.VOICE[LANG]["voice_id"]
    return ADIR / (hashlib.sha1((eng + say + ("#%d" % k if k else "")).encode()).hexdigest()[:12] + ".mp3")


def story():
    ADIR.mkdir(parents=True, exist_ok=True)
    beats_in = SCRIPT["beats"]; audio = {}
    for b in beats_in:
        say = b["say"]
        if not clip(say).exists():
            print(f"  voicing {b['key']}", flush=True)
            if not sb.tts(say, LANG, clip(say)):
                sys.exit(f"MiniMax gave no audio for {b['key']} (see the retry lines above); nothing written")
        audio[say] = sb.pcm(clip(say))
    # same guard as shorts_build.py: a beat far slower than the rest for its text was probably said twice
    rate = {s: len(a) / SR / len(s) for s, a in audio.items()}; med = sorted(rate.values())[len(rate) // 2]
    for b in beats_in:
        say = b["say"]; k = 0
        while rate[say] > 1.4 * med and len(say) > 12 and k < 3:
            k += 1
            if clip(say, k).exists() or sb.tts(say, LANG, clip(say, k)):
                a = sb.pcm(clip(say, k))
                if len(a) < len(audio[say]):
                    audio[say] = a; rate[say] = len(a) / SR / len(say)
                    print(f"  re-voiced a slow beat ({len(a) / SR:.1f} s): {say[:40]}")
    t = 0.0; beats = []; caps = []; placed = []
    for b in beats_in:
        a = audio[b["say"]]; sec = len(a) / SR; p = pause(b)
        for ph in EV[b["key"]]:
            assert ph.lower() in b["say"].lower(), (b["key"], ph)
        beats.append(dict(id=b["key"], t0=round(t, 3), sec=round(sec, 3), pause=p, say=b["say"], ev=EV[b["key"]],
                          claims=b["claims"], source=b["source"], label=b.get("label", "")))
        cl = CAPS[b["key"]] if isinstance(CAPS[b["key"]], list) else [(None, CAPS[b["key"]])]
        cue = lambda ph: t if ph is None else CUES.get(b["key"] + ":" + ph, t + sec * b["say"].lower().index(ph.lower()) / len(b["say"]))
        for i, (ph, txt) in enumerate(cl):
            c1 = cue(cl[i + 1][0]) if i + 1 < len(cl) else t + sec + p
            caps.append(dict(t0=round(cue(ph), 3), t1=round(c1, 3), html=sb.cap_html(txt)))
        placed.append((t, a)); t += sec + p
    dur = math.ceil(t * 30) / 30
    st = dict(cues=CUES, id=SID, channel="Moat & Margin", lang=LANG, title=SCRIPT["title"], dur=round(dur, 3), voiced=True,
              note="VOICED timings (MiniMax speech-2.6-hd, English_Diligent_Man); pauses from script.json", beats=beats, caps=caps)
    (HERE / "story.js").write_text("window.STORY = " + json.dumps(st, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    chk = dict(id=SID, title=SCRIPT["title"], shorts=[dict(title=SCRIPT["title"], beats=[b["id"] for b in beats], loop=True)],
               beats=[dict(key=b["id"], say=b["say"], sec=round(b["sec"] + b["pause"] - GAP, 3),
                           scene=dict(type="picture", items=[dict(at=p) for p in b["ev"]])) for b in beats])
    (HERE / "check.json").write_text(json.dumps(chk, ensure_ascii=False, indent=1), encoding="utf-8")
    mix = np.zeros(int(dur * SR) + SR, dtype=np.float32)
    for (t0, a), b in zip(placed, beats):
        i = int(t0 * SR); mix[i:i + len(a)] += a; sb.write_wav(ADIR / f"{b['id']}.wav", a)
    sb.write_wav(ADIR / "voice.wav", mix[: int(dur * SR)])
    idx = HERE / "index.html"; h = idx.read_text(encoding="utf-8")
    idx.write_text(re.sub(r'data-duration="[0-9.]+"', f'data-duration="{dur:.3f}"', h), encoding="utf-8")
    words = sum(len(b["say"].split()) for b in beats)
    print(f"{SID}: {dur:.2f} s voiced, {words} words, {words / dur * 60:.0f} wpm")
    for b in beats:
        print(f"  {b['id']:>3}  {b['t0']:6.2f}  voice {b['sec']:5.2f}  pause {b['pause']:.2f}")


# ---- sound ---------------------------------------------------------------------------------------------------------
def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def at(st, bid, phrase=None, off=0.0):
    b = next(x for x in st["beats"] if x["id"] == bid)
    if phrase is None:
        return b["t0"] + off
    i = b["say"].lower().index(phrase.lower())
    return b["t0"] + b["sec"] * i / len(b["say"]) + off


def pulse(n, t, root, bpm=84.0, level=1.0, bright=0.0):
    """Code-made music: a soft low pad plus a gentle pulse on each beat (our own, nothing to license)."""
    x = np.zeros(n, dtype=np.float64)
    for ratio, g in [(1, 1.0), (1.5, 0.5), (2, 0.45), (3, 0.12 + 0.25 * bright)]:
        for det in (-0.5, 0.5):
            x += g * np.sin(2 * np.pi * (root * ratio + det) * t)
    x /= 4.0
    ph = (t * bpm / 60.0) % 1.0
    env = np.exp(-ph * 7.0)
    kick = np.sin(2 * np.pi * (root / 2) * t) * env
    return level * (0.55 * x * (0.6 + 0.4 * env) + 0.6 * kick)


def mix():
    st = json.loads((HERE / "story.js").read_text().split("=", 1)[1].rstrip().rstrip(";"))
    v = sb.OUT / f"{SID}.mp4"
    if not v.exists():
        sys.exit(f"render first: python3 hyperframes/tools/hf.py render {SID}")
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(v)],
                               capture_output=True, text=True, check=True).stdout)
    n = int(dur * SR); t = np.arange(n) / SR
    voice = load(ADIR / "voice.wav"); voice = np.pad(voice, (0, max(0, n - len(voice))))[:n]
    B = {b["id"]: b for b in st["beats"]}
    end = lambda k: B[k]["t0"] + B[k]["sec"]
    s1 = (end("b4"), end("b4") + B["b4"]["pause"])          # silence 1
    s2 = (end("b6"), end("b6") + B["b6"]["pause"])          # silence 2
    t7a = at(st, "b7", "alleged"); t8 = B["b8"]["t0"]; t9 = B["b9"]["t0"]
    # music cue levels (relative), sections per TREATMENT section 8
    def ramp(a, b, w=0.25):
        return np.clip((t - a) / w, 0, 1) * np.clip((b - t) / w, 0, 1)
    low_a = ramp(-1, s1[0] + 0.05, 0.25) * np.clip(1 - (t - s1[0]) / 0.15, 0, 1)
    rise = ramp(s1[1], s2[0] + 0.05, 0.2) * (0.8 + 0.5 * np.clip((t - B["b5"]["t0"]) / max(0.1, s2[0] - B["b5"]["t0"]), 0, 1))
    hitenv = np.where(t >= t7a, np.exp(-(t - t7a) / 1.6), 0) * (t < t8 + 0.3)
    near = ramp(t8, t9, 0.4) * 0.18
    low_d = np.clip((t - t9) / 0.3, 0, 1)
    music = (pulse(n, t, 73.42, level=1.0) * low_a + pulse(n, t, 73.42, level=1.0, bright=1.0) * rise
             + pulse(n, t, 73.42, level=1.0) * low_d + pulse(n, t, 73.42, level=0.6) * near)
    hit = np.sin(2 * np.pi * 49.0 * t) * hitenv * 1.6 + np.sin(2 * np.pi * 98.0 * t) * hitenv * 0.5
    music = music / max(1e-6, np.max(np.abs(music))) * 0.07 + hit * 0.07
    # room tone: soft filtered noise, always on except it thins under b6
    rng = np.random.default_rng(7); noise = rng.standard_normal(n)
    k = np.ones(400) / 400; room = np.convolve(noise, k, mode="same"); room = room / np.max(np.abs(room)) * 0.010
    room *= 1 - 0.5 * ramp(B["b6"]["t0"], s2[1], 0.3)
    # effects (Vox+ CC0 set, src/voxplus/LICENSES.md)
    A = ROOT / "public" / "voxplus" / "audio"
    fx = np.zeros(n, dtype=np.float32)
    def put(name, when, gain):
        a = load(A / name); a = a / max(1e-6, np.max(np.abs(a))) * gain; i = int(max(0, when) * SR)
        if i < n:
            fx[i:i + len(a)] += a[: n - i]
    hl, paper, stamp, whoosh = ("sfx_underline_stroke_zembacraftworks.wav", "sfx_paper_slide_kingofgamers.wav",
                                "sfx_thump_stamp_mpuffenbarger.wav", "sfx_whoosh_deep_kinoton.wav")
    put(hl, 0.0, 0.10)                                             # b1 highlighter, already moving on frame 0
    put(paper, B["b2"]["t0"] + 0.25, 0.16)                         # b2 clipping slap
    put(whoosh, B["b3"]["t0"] - 0.1, 0.10)                         # b3 move to the table
    put(hl, B["b3"]["t0"] + 0.4, 0.08); put(hl, at(st, "b3", "The ten biggest"), 0.08)
    put("sfx_pop_conarb13.wav", B["b4"]["t0"] + 0.15, 0.04)        # b4 dot field (very low)
    put(paper, B["b5"]["t0"], 0.16)                                # b5 page slides in at the end of silence 1
    put(hl, B["b5"]["t0"] + 0.6, 0.08); put(hl, at(st, "b5", "with compact"), 0.10)   # carries over the match cut
    put(hl, t7a, 0.09)                                             # b7 red marker
    put(stamp, t7a, 0.30)                                          # b7 stamp, on the peak hit
    put(paper, t8, 0.14)                                           # b8 page turn
    put(hl, at(st, "b9", "distribution depth") - 0.6, 0.09)        # b9 underline
    put(hl, B["b10"]["t0"] + 0.3, 0.08)                            # b10 counter-share highlight
    vpk = max(1e-6, np.max(np.abs(voice)))
    out = voice / vpk * 0.89 + music + room + fx
    ADIR.mkdir(parents=True, exist_ok=True); sb.write_wav(ADIR / "mix_pre.wav", out / max(1.0, np.max(np.abs(out))))
    PROD.mkdir(parents=True, exist_ok=True)
    final = PROD / f"{SID}-final.mp4"
    # two-pass loudnorm to -14 LUFS integrated, -1.5 dBTP
    m = subprocess.run(["ffmpeg", "-v", "info", "-i", str(ADIR / "mix_pre.wav"), "-af", PRE + "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(m[m.rindex("{"): m.rindex("}") + 1])
    af = PRE + (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
          f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=false")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-i", str(ADIR / "mix_pre.wav"), "-map", "0:v", "-map", "1:a",
                    "-af", af, "-ar", "48000", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest",
                    "-movflags", "+faststart", str(final)], check=True)
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", str(final), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    summ = r[r.rindex("Summary:"):]
    print(final); print(summ)
    print("sections: silence1 %.2f-%.2f  silence2 %.2f-%.2f  stamp %.2f  b8 %.2f  b9 %.2f" % (*s1, *s2, t7a, t8, t9))


PRE = "acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120:makeup=1,"   # gentle voice-safe compression so -14 LUFS fits under -1.5 dBTP


def verify():
    """Transcribe the final mix with local mlx-whisper and list every script word not heard."""
    final = PROD / f"{SID}-final.mp4"; wav = ADIR / "final16k.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(final), "-ac", "1", "-ar", "16000", str(wav)], check=True)
    py = Path.home() / "jev_full" / ".stt-venv" / "bin" / "python"
    code = ("import mlx_whisper,json,sys;r=mlx_whisper.transcribe(sys.argv[1],path_or_hf_repo='mlx-community/whisper-large-v3-turbo',"
            "language='en',word_timestamps=True);print(json.dumps(r))")
    r = json.loads(subprocess.run([str(py), "-c", code, str(wav)], capture_output=True, text=True, check=True).stdout.strip().splitlines()[-1])
    heard = " ".join(s["text"] for s in r["segments"])
    (PROD / "voice_check.txt").write_text(heard + "\n", encoding="utf-8")
    norm = lambda s: re.findall(r"[a-z0-9]+", s.lower().replace("'s", "s").replace("’s", "s"))
    script = norm(" ".join(b["say"] for b in SCRIPT["beats"])); got = norm(heard)
    # alignment: longest common subsequence of words
    import difflib
    sm = difflib.SequenceMatcher(a=script, b=got, autojunk=False)
    missing = [];
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("replace", "delete"):
            missing.append((" ".join(script[i1:i2]), " ".join(got[j1:j2])))
    print("HEARD:", heard)
    print(f"script words {len(script)}, heard words {len(got)}, matched {sum(x.size for x in sm.get_matching_blocks())}")
    for a, b in missing:
        print(f"  script '{a}'  vs heard '{b}'")
    if not missing:
        print("every script word heard, in order")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "story":
        story()
    elif cmd == "check":
        sys.exit(subprocess.run([sys.executable, str(ROOT / "scripts" / "shorts_check.py"), "--file", str(HERE / "check.json")]).returncode)
    elif cmd == "mix":
        mix()
    elif cmd == "verify":
        verify()
    else:
        sys.exit(__doc__)
