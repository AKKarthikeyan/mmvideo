#!/usr/bin/env python3
"""A01 v4 regional AUDIO TRACKS (Hindi, Tamil) for "What Is a Moat? The $26 Loom That Explains It".

The English film is the original; Hindi and Tamil are extra YouTube audio tracks on the same video, so the picture is never
re-rendered. Each track is a FULL MIX: the regional voice, placed at the same start time as each English beat and fitted inside
the English slot, plus the same music bed (same MusicBed ducking function and parameters as the composition) and the same SFX
cues at the same frames and gains. Length = the composition's frame count, to the sample.

Logic copied (not imported) from scripts/audio_tracks.py, which belongs to another session and is not edited: per-beat fit to the
English slot with a speed cap, cached TTS, report with TOO LONG beats. Differences: speed caps from AK's A01 v4 brief (Tamil 1.06,
Hindi 1.15); Tamil voiced by Sarvam Bulbul v3 (native), Hindi by MiniMax speech-2.6-hd hindi_male_1_v2; every beat is loudness-
normalised exactly like the English beats (loudnorm I=-16 TP=-1.5, as scripts/voxplus/a01v4_audio_prep.sh); the timeline, bed and
cues are read from the composition source (src/voxplus/*.tsx), never retyped; the whole mix is set to -16 LUFS, true peak < -1 dBFS.

Usage (from /Volumes/DarwinSSD/MMVideo, keys only inside zsh -lic, never printed):
  source /Volumes/DarwinSSD/vendor/env.sh
  uv run --no-project --with numpy --with requests python scripts/voxplus/a01v4_regional.py sample ta --voices mani,gokul,vijay
  uv run ... a01v4_regional.py sample hi
  uv run ... a01v4_regional.py build hi [--comp src/voxplus/A01V4.tsx] [--video out/voxplus/<english>.mp4] [--preview <540p.mp4>]
  uv run ... a01v4_regional.py build ta --voice <sarvam speaker> ...
  uv run ... a01v4_regional.py nulltest --comp <tsx> --video <english mp4>     # rebuilds the ENGLISH mix and compares it
Translations: public/voxplus/a01v4/regional/a01v4.<lang>.json (DRAFT, reviewed_by null). Output: out/audio/a01v4/ (not in git).
MiniMax: wait on 429s, never switch provider, no builds 22:00-02:00 IST (shared key). Sarvam: SARVAM_API_KEY.
"""
import base64, hashlib, json, os, re, subprocess, sys, time
from datetime import datetime
from pathlib import Path

import numpy as np
import requests

ROOT = Path(__file__).resolve().parents[2]
REG = ROOT / "public" / "voxplus" / "a01v4" / "regional"
PUB = ROOT / "public" / "voxplus"
OUT = ROOT / "out" / "audio" / "a01v4"
FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
FP = "/Volumes/DarwinSSD/vendor/bin/ffprobe"
SR = 48000            # Remotion renders 48 kHz stereo AAC; the mix is built at that rate
SLOP = 0.15           # keep this much silence before the next English beat starts (as audio_tracks.py)
PAUSE_CAP = 0.36      # longest pause kept inside a regional line (s): the English pause fix of 18 Oct (inside a beat 0.36 s)
LEAD = TAIL = 0.10    # silence kept before / after each regional line (the English beats: 0.10 s)

LANGS = {
    "ta": {"name": "Tamil", "speed_max": 1.06, "provider": "sarvam", "code": "ta-IN"},
    "hi": {"name": "Hindi", "speed_max": 1.15, "provider": "sarvam", "code": "hi-IN", "boost": "Hindi",
           "pause": None},      # AK 18 Oct: "Try Saravam Bulbul v4 for Tamil and Hindi" (MiniMax hindi_male_1_v2 kept via --provider minimax --voice ...)      # no <#x#> marks: hindi_male_1_v2 already pauses 0.5-0.9 s at every sentence (measured 18 Oct)
}


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)


def duration(p):
    return float(run([FP, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).stdout.strip())


# ---------------------------------------------------------------- composition: timeline, bed, cues (read from the source)
def jsround(x):
    """JavaScript Math.round (halves go up), as the composition uses for frames."""
    import math
    return int(math.floor(x + 0.5))


def _num(expr, fps):
    """Evaluates the tiny expression language the cue lists use: numbers, sf(x) / fr(x) (seconds -> frames), + - * /."""
    e = re.sub(r"\b(?:sf|fr)\(", "_fr(", expr)
    if re.search(r"[^\d\s.+\-*/()_fr]", e):
        raise SystemExit(f"cannot read cue time {expr!r}; extend _num()")
    return eval(e, {"__builtins__": {}}, {"_fr": lambda s: jsround(s * fps)})


def read_comp(tsx):
    """Returns dict(fps, total_frames, vo=[(key, at_s, len_s)], cues=[(frame, name, gain)], bed={...}, sfx={name: (file, vol)})."""
    src = (ROOT / tsx).read_text()
    snd = (ROOT / "src" / "voxplus" / "Sound.tsx").read_text()
    # the MusicBed / SfxTrack code this mix reproduces; stop if it changed
    for must in ("const o = clamp01((gap - 8 * k) / (18 * k));", "const v = duck + (open - duck) * o;",
                 "return v * clamp01(f / fadeIn) * (1 - clamp01((f - (total - fadeOut)) / fadeOut));",
                 "durationInFrames={Math.round(5 * fps)}", "volume={SFX[name].vol * g}", "k = fps / 30"):
        if must not in snd:
            raise SystemExit(f"Sound.tsx changed ({must!r} not found): update mix_bed()/mix_sfx() before building")
    m = re.search(r"const fr = \(s: number\) => Math\.round\(s \* (\d+)\)", src)
    fps = int(m.group(1)) if m else None
    tm = re.search(r"\bFPS\s*=\s*(\d+)", (ROOT / "src" / "voxplus" / "tokens.ts").read_text())
    if fps is None:
        fps = int(tm.group(1))
    vo = [(k, float(a), float(l)) for k, a, l in re.findall(r'\{k: "(\w+)", at: ([\d.]+), len: ([\d.]+)\}', src)]
    tot = re.search(r"export const \w+_TOTAL = (.+?);", src)
    total = int(_num(tot.group(1), fps))
    cue_txt = re.search(r"export const \w+_CUES: Cue\[\] = \[(.*?)\n\];", src, re.S).group(1)
    cues = []
    for item in re.findall(r"\[([^\[\]]+)\]", cue_txt):
        parts = [p.strip() for p in item.split(",")]
        fr_ = _num(parts[0], fps); name = parts[1].strip('"'); g = float(parts[2]) if len(parts) > 2 else 1.0
        cues.append((max(0, jsround(fr_)), name, g))
    sfx = {n: (f, float(v)) for n, f, v in re.findall(r'(\w+): \{file: "([^"]+)", vol: ([\d.]+)\}', snd)}
    jsx = re.search(r"<MusicBed ([^>]*)/>", src).group(1)
    attr = lambda k, d=None: (re.search(k + r"=\{([^}]*)\}", jsx) or [None, d])[1]
    bed_src = attr("src")
    if bed_src == "bed":
        bed_src = re.search(r'bed = "([^"]+)"', src).group(1)
    bed = {"src": bed_src.strip('"'), "duck": float(attr("duck", 0.2)), "open": float(attr("open", 0.4)),
           "fadeIn": float(attr("fadeIn", 18)), "fadeOut": float(attr("fadeOut", 30)), "startFrom": float(attr("startFrom", 0))}
    voice_attr = attr("voice")
    if voice_attr != "voice":
        raise SystemExit(f"MusicBed voice={voice_attr}: expected the VO spans; update read_comp()")
    if "fr(v.at), fr(v.at + v.len)" not in src:
        raise SystemExit("voice spans are not [fr(at), fr(at+len)]; update duck_spans()")
    missing = {n for _, n, _ in cues} - set(sfx)
    if missing:
        raise SystemExit(f"cues use unknown SFX {missing}")
    vo = [(k, a, l, jsround(a * fps)) for k, a, l in vo]
    beds = [dict(bed, a=0, z=total)]
    spans = [(jsround(a * fps), jsround((a + l) * fps)) for _, a, l, _ in vo]
    return {"fps": fps, "total": total, "vo": vo, "cues": cues, "beds": beds, "sfx": sfx, "tsx": tsx, "en_spans": spans}


SND_MUST = ("const o = clamp01((gap - 8 * k) / (18 * k));", "const v = duck + (open - duck) * o;",
            "return v * clamp01(f / fadeIn) * (1 - clamp01((f - (total - fadeOut)) / fadeOut));",
            "durationInFrames={Math.round(5 * fps)}", "volume={SFX[name].vol * g}", "k = fps / 30")


def read_film(tsx="src/voxplus/A01V4Film.tsx", fps=60):
    """The full film (composition A01V4-full): timing from a01v4Timing.ts, cues = COLD_CUES + FILM_CUES, four music beds."""
    V = ROOT / "src" / "voxplus"
    src = (ROOT / tsx).read_text(); cold = (V / "A01V4Cold.tsx").read_text(); snd = (V / "Sound.tsx").read_text()
    tim = (V / "a01v4Timing.ts").read_text(); tok = (V / "tokens.ts").read_text(); parts = (V / "A01V4Parts.tsx").read_text()
    for must in SND_MUST:
        if must not in snd:
            raise SystemExit(f"Sound.tsx changed ({must!r} not found): update mix_bed()/mix_sfx()")
    # the exact code this mix reproduces; stop if any of it changed
    for txt, must in ((tok, "export const tk2f = (ticks: number, fps: number) => Math.round((ticks * fps) / TICK);"),
                      (parts, "export const tsec = (s: number) => Math.round(s * 30);"),
                      (cold, "<Sequence key={v.k} from={tk2f(tsec(v.at), fps)}"),
                      (cold, "export const cueFrames = (cues: SCue[], fps: number): Cue[] => cues.map(([s, n, g]) => [tk2f(tsec(s), fps), n, g] as Cue);"),
                      (src, "const B = (k: string, rel: number) => warp(BEAT_OLD[k] + rel);"),
                      (cold, "<Audio src={V(`a01v4/vo/${v.k}${VO_SUFFIX}.wav`)} volume={1}/>"),
                      (src, "const fs = (s: number) => tk2f(tsec(s), fps);"),
                      (src, "const voice: [number, number][] = VO_ALL.map((v) => [fs(v.at) - a, fs(v.at + v.len) - a]);"),
                      (src, "<Sequence key={i} from={a} durationInFrames={z - a} layout=\"none\">"),
                      (src, "<MusicBed src={b.src} total={z - a} voice={voice} duck={0.2 * b.gain} open={0.4 * b.gain} startFrom={fs(b.offset)} fadeIn={fs(1.0)} fadeOut={fs(1.0)}/>"),
                      (src, "const VO_ALL = BEAT_ORDER.map((k) => ({k, at: BEAT[k], len: BEAT_DUR[k]}));"),
                      (src, "<VoiceTrack vo={VO_ALL}/>"), (src, "{music ? <Beds/> : null}"), (src, "<SfxTrack cues={cueFrames(FILM_CUES, fps)}/>"),
                      (src, "export const FILM_TOTAL = tsec(FILM_TOTAL_S);")):
        if must not in txt:
            raise SystemExit(f"composition code changed ({must[:70]!r} not found): update read_film()")
    if "TICK = 30" not in tok and not re.search(r"TICK\s*=\s*30\b", tok):
        raise SystemExit("tokens.ts TICK is not 30")
    BEAT = json.loads(re.search(r"BEAT: Record<string, number> = (\{.*?\});", tim).group(1))
    DUR = json.loads(re.search(r"BEAT_DUR: Record<string, number> = (\{.*?\});", tim).group(1))
    ORDER = json.loads(re.search(r"BEAT_ORDER = (\[.*?\]);", tim).group(1))
    TOT_S = float(re.search(r"FILM_TOTAL_S = ([\d.]+);", tim).group(1))
    tsec = lambda s: jsround(s * 30); tk2f = lambda t: jsround(t * fps / 30); fs = lambda s: tk2f(tsec(s))
    total = tk2f(tsec(TOT_S))
    OLD = json.loads(re.search(r"BEAT_OLD: Record<string, number> = (\{.*?\});", tim).group(1))
    WO = json.loads(re.search(r"const WO = (\[.*?\]);", tim).group(1)); WN = json.loads(re.search(r"const WN = (\[.*?\]);", tim).group(1))
    VO_SUFFIX = re.search(r'export const VO_SUFFIX = "([^"]*)";', tim).group(1)
    for must in ("if (t <= WO[0]) return Math.max(0, WN[0] + (t - WO[0]));", "if (t >= WO[WO.length - 1]) return WN[WN.length - 1] + (t - WO[WO.length - 1]);",
                 "return span <= 1e-9 ? WN[hi] : WN[lo] + ((t - WO[lo]) / span) * (WN[hi] - WN[lo]);"):
        if must not in tim:
            raise SystemExit("a01v4Timing.ts W() changed: update warp()")

    def warp(t):      # a01v4Timing.ts W(): old film second -> new film second
        if t <= WO[0]:
            return max(0.0, WN[0] + (t - WO[0]))
        if t >= WO[-1]:
            return WN[-1] + (t - WO[-1])
        lo, hi = 0, len(WO) - 1
        while hi - lo > 1:
            m = (lo + hi) >> 1
            if WO[m] <= t:
                lo = m
            else:
                hi = m
        span = WO[hi] - WO[lo]
        return WN[hi] if span <= 1e-9 else WN[lo] + ((t - WO[lo]) / span) * (WN[hi] - WN[lo])
    ev = lambda e: float(eval(e, {"__builtins__": {}}, {"BEAT": BEAT, "FILM_TOTAL_S": TOT_S, "warp": warp, "W": warp,
                                                         "B": lambda k, rel: warp(OLD[k] + rel)}))
    cm = re.search(r"export const COLD_CUES: SCue\[\] = \[(.*?)\n\](\.map\(\(\[t, n, g\]\) => \[warp\(t\), n, g\] as SCue\))?;", cold, re.S)
    cold_txt, cold_warp = cm.group(1), bool(cm.group(2))
    film_txt = re.search(r"export const FILM_CUES: SCue\[\] = \[(.*?)\n\];", src, re.S).group(1)
    if "...COLD_CUES," not in film_txt:
        raise SystemExit("FILM_CUES no longer starts with ...COLD_CUES")
    cues = []
    for txt, wrap in ((cold_txt, cold_warp), (film_txt.replace("...COLD_CUES,", ""), False)):
        for t, name, g in re.findall(r'\[((?:B\("\w+", -?[\d.]+\))|-?[\d.]+), "(\w+)"(?:, ([\d.]+))?\]', txt):
            s = ev(t); s = warp(s) if wrap else s
            cues.append((tk2f(tsec(s)), name, float(g) if g else 1.0))
    n_items = len(re.findall(r'"\w+"(?:, [\d.]+)?\]', cold_txt)) + len(re.findall(r'"\w+"(?:, [\d.]+)?\]', film_txt))
    if n_items != len(cues):
        raise SystemExit(f"read {len(cues)} cues but the lists hold {n_items}: update the cue parser")
    beds_txt = re.search(r"const BEDS: .*? = \[(.*?)\n\];", src, re.S).group(1)
    beds = []
    for s_, fr_, to_, off, g in re.findall(r'\{src: "([^"]+)", from: (B\("\w+", -?[\d.]+\)|[^,]+), to: (B\("\w+", -?[\d.]+\)|[^,]+), offset: ([\d.]+), gain: ([\d.]+)\}', beds_txt):
        a, z = fs(ev(fr_)), fs(ev(to_)); g = float(g)
        beds.append({"src": s_, "a": a, "z": z, "duck": 0.2 * g, "open": 0.4 * g, "startFrom": fs(float(off)), "fadeIn": fs(1.0), "fadeOut": fs(1.0)})
    if len(beds) != beds_txt.count("{src:"):
        raise SystemExit("could not read every BEDS entry")
    sfx = {n: (f, float(v)) for n, f, v in re.findall(r'(\w+): \{file: "([^"]+)", vol: ([\d.]+)\}', snd)}
    missing = {n for _, n, _ in cues} - set(sfx)
    if missing:
        raise SystemExit(f"cues use unknown SFX {missing}")
    vo = [(k, BEAT[k], DUR[k], fs(BEAT[k])) for k in ORDER]
    spans = [(fs(at), fs(at + ln)) for _, at, ln, _ in vo]
    return {"fps": fps, "total": total, "vo": vo, "cues": cues, "beds": beds, "sfx": sfx, "tsx": tsx, "en_spans": spans,
            "film_total_s": TOT_S, "vo_suffix": VO_SUFFIX}


# ---------------------------------------------------------------- audio helpers
def load_audio(path, start=0.0):
    """Any file -> float32 stereo at 48 kHz, starting `start` seconds in."""
    cmd = [FF, "-v", "error"] + (["-ss", f"{start:.6f}"] if start else []) + ["-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"]
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def write_wav(path, x):
    p = subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", str(path)],
                       input=np.clip(x, -1, 1).astype(np.float32).tobytes(), capture_output=True)
    if p.returncode:
        raise SystemExit(p.stderr.decode())


def loudness(path):
    e = subprocess.run([FF, "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    s = e[e.rfind("Summary:"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1))


def mix_bed(C, spans_f, n):
    """Remotion MusicBed in a <Sequence from={a} durationInFrames={z - a}>: volume evaluated per local frame (a step per frame),
    the source trimmed by startFrom frames, ducked under the voice spans (absolute frames, made local here)."""
    fps = C["fps"]; k = fps / 30; spf = int(round(SR / fps)); out = np.zeros((n, 2), np.float32)
    c01 = lambda x: np.clip(x, 0, 1)
    for b in C["beds"]:
        a, z = b["a"], b["z"]; total = z - a
        src = load_audio(PUB / b["src"], start=b["startFrom"] / fps)[: total * spf]
        f = np.arange(total)
        if spans_f:
            S = np.array(spans_f, dtype=float) - a
            inside = ((f[:, None] >= S[:, 0]) & (f[:, None] <= S[:, 1])).any(1)
            d = np.minimum(np.abs(f[:, None] - S[:, 0]), np.abs(f[:, None] - S[:, 1])).min(1)
            gap = np.where(inside, 0, d)
        else:
            gap = np.full(total, 1e9)
        o = c01((gap - 8 * k) / (18 * k))
        v = b["duck"] + (b["open"] - b["duck"]) * o
        vol = v * c01(f / b["fadeIn"]) * (1 - c01((f - (total - b["fadeOut"])) / b["fadeOut"]))
        ps = np.repeat(vol, spf)[: len(src)]
        a0 = a * spf; m = min(len(ps), n - a0)
        if m > 0:
            out[a0: a0 + m] += src[:m] * ps[:m, None]
    return out


def mix_sfx(C, n):
    out = np.zeros((n, 2), np.float32); cache = {}
    for fr_, name, g in C["cues"]:
        file, vol = C["sfx"][name]
        if file not in cache:
            cache[file] = load_audio(PUB / file)
        x = cache[file][: int(5 * SR)] * (vol * g)       # SfxTrack: 5 s window per cue
        a = int(round(fr_ * SR / C["fps"])); x = x[: max(0, n - a)]
        out[a: a + len(x)] += x
    return out


def place_voice(items, n, fps):
    """items: [(start_frame, wav_path)] -> stereo track. As Remotion: each beat starts on a whole frame (the composition's own
    rounding), mono is copied to both channels at full level (checked by the null test against the English render)."""
    out = np.zeros((n, 2), np.float32)
    for f0, p in items:
        x = load_audio(p); a = int(f0 * SR // fps); x = x[: max(0, n - a)]
        out[a: a + len(x)] += x
    return out


# ---------------------------------------------------------------- TTS (copied from audio_tracks.py, caps/providers per this brief)
def with_pauses(text, lang):
    p = LANGS[lang].get("pause")
    if not p:
        return text
    text = re.sub(r"\?\s+(?=\S)", f"?<#{p[0]}#>", text)
    return re.sub(r"([।.!])\s+(?=\S)", lambda m: f"{m.group(1)}<#{p[1]}#>", text)


def tts_minimax(text, voice, lang, speed, path):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": LANGS[lang]["boost"],
            "voice_setting": {"voice_id": voice, "speed": speed, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(8):
        try:
            j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=180).json()
        except Exception as e:      # network hiccup: wait and retry, same provider
            print("  retry (network)", path.name, type(e).__name__, flush=True); time.sleep(20 * (attempt + 1)); continue
        if (j.get("data") or {}).get("audio"):
            path.write_bytes(bytes.fromhex(j["data"]["audio"]))
            return
        print("  retry", path.name, j.get("base_resp"), flush=True)
        time.sleep(20 * (attempt + 1))        # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + path.name)


def tts_sarvam(text, speaker, lang, pace, path):
    key = os.environ["SARVAM_API_KEY"]
    if len(text) > 2500:
        raise SystemExit(f"{path.name}: {len(text)} characters, Sarvam allows 2500 per call")
    # v4 persona voices (e.g. gokul_ta_narration) need bulbul:v4-flash; the short names (gokul, mani) are bulbul:v3 (docs.sarvam.ai, 18 Oct)
    model = "bulbul:v4-flash" if "_" in speaker else "bulbul:v3"
    body = {"text": text, "language_code": LANGS[lang]["code"], "speaker": speaker, "model": model, "pace": pace,
            "speech_sample_rate": 44100, "output_audio_codec": "mp3"}
    for attempt in range(8):
        try:
            r = requests.post("https://api.sarvam.ai/text-to-speech", headers={"api-subscription-key": key}, json=body, timeout=180)
        except Exception as e:
            print("  retry (network)", path.name, type(e).__name__, flush=True); time.sleep(20 * (attempt + 1)); continue
        if r.status_code == 200 and r.json().get("audios"):
            path.write_bytes(base64.b64decode("".join(r.json()["audios"])))
            OUT.mkdir(parents=True, exist_ok=True)      # characters billed per call (for the cost note)
            with open(OUT / "sarvam_usage.jsonl", "a") as u:
                u.write(json.dumps({"t": datetime.now().isoformat(timespec="seconds"), "model": model, "speaker": speaker, "lang": lang,
                                    "pace": pace, "chars": len(text), "file": path.name}) + "\n")
            return
        if r.status_code in (400, 402, 422):      # 402 = no credits: stop at once, never retry or switch provider
            raise SystemExit(f"Sarvam refused the request ({r.status_code}): {r.text[:300]}")
        print("  retry", path.name, r.status_code, r.text[:200], flush=True)
        if r.status_code in (401, 403):
            raise SystemExit("Sarvam rejected the key (401/403)")
        time.sleep(20 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)


PRON = {}       # per language: Latin name -> respelling used only for the voice (set from the translation file)


def pron(text, lang):
    for k in sorted(PRON.get(lang, {}), key=len, reverse=True):      # longest first ("Warren Buffett" before "Buffett")
        # "Maggi-யோட" -> "மேகியோட": a Tamil case ending joins the respelled name as one word
        text = text.replace(k + "-", PRON[lang][k]).replace(k, PRON[lang][k])
    return text


def cap_pauses(x, sr, cap=None, thr_db=-40.0, lead=None, tail=None):
    """Leading silence to `lead`, trailing to `tail`, and every pause inside the line longer than `cap` shortened to `cap`
    (keeps its first and last halves, 5 ms crossfade). Silence = 10 ms frames with RMS below thr_db. Words are never cut:
    only frames below the threshold are removed. (ffmpeg's silenceremove did not trim mid-line pauses on this build.)"""
    cap = PAUSE_CAP if cap is None else cap; lead = LEAD if lead is None else lead; tail = TAIL if tail is None else tail
    hop = sr // 100; n = len(x) // hop
    if n < 3:
        return x
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop).astype(np.float64) ** 2, axis=1) + 1e-12)
    sil = rms < 10 ** (thr_db / 20)
    runs, i = [], 0
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]:
                j += 1
            runs.append((i, j)); i = j
        else:
            i += 1
    keep = np.ones(len(x), bool); fade = int(0.005 * sr)
    out_parts, pos = [], 0
    for a, b in runs:
        s, e = a * hop, (b * hop if b < n else len(x))
        if a == 0:
            cut = (s, max(s, e - int(lead * sr)))
        elif b >= n:
            cut = (min(e, s + int(tail * sr)), e)
        elif (e - s) > cap * sr:
            half = int(cap * sr / 2); cut = (s + half, e - half)
        else:
            continue
        if cut[1] > cut[0]:
            out_parts.append(x[pos: cut[0]]); pos = cut[1]
    out_parts.append(x[pos:])
    y = out_parts[0]
    for seg in out_parts[1:]:
        if len(y) > fade and len(seg) > fade:      # crossfade the join (both sides are near-silent)
            w = np.linspace(0, 1, fade, dtype=np.float32)
            y = np.concatenate([y[:-fade], y[-fade:] * (1 - w) + seg[:fade] * w, seg[fade:]])
        else:
            y = np.concatenate([y, seg])
    return y


def voiced(text, lang, provider, voice, speed, cache, take=0):
    """Cached TTS -> loudness-normalised, trailing-silence-trimmed wav (44.1k mono, -16 LUFS, TP -1.5). Returns (wav, seconds)."""
    text = pron(text, lang)
    spoken = with_pauses(text, lang) if provider == "minimax" else text
    h = hashlib.md5((f"{provider}|{voice}|{speed}|{spoken}" + (f"|take{take}" if take else "")).encode()).hexdigest()[:10]
    mp3 = cache / f"{h}.mp3"; wav = cache / f"{h}_c{PAUSE_CAP}.wav"
    if not mp3.exists():
        (tts_minimax if provider == "minimax" else tts_sarvam)(spoken, voice, lang, speed, mp3)
    if not wav.exists():
        # same loudness treatment as the English beats (a01v4_audio_prep.sh), then cap_pauses()
        raw = subprocess.run([FF, "-v", "error", "-i", str(mp3), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1",
                              "-f", "f32le", "-"], check=True, capture_output=True).stdout
        x = cap_pauses(np.frombuffer(raw, dtype=np.float32).copy(), 44100)
        p = subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", "44100", "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", str(wav)],
                           input=np.clip(x, -1, 1).astype(np.float32).tobytes(), capture_output=True)
        if p.returncode:
            raise SystemExit(p.stderr.decode())
    return wav, duration(wav)


def fit(key, text, lang, provider, voice, slot, cache):
    cap = LANGS[lang]["speed_max"]; speed = 1.0
    wav, sec = voiced(text, lang, provider, voice, speed, cache)
    for _ in range(3):        # speed does not scale linearly (pauses stay), so correct up to 3 times
        if sec <= slot or speed >= cap:
            break
        speed = min(cap, round(speed * sec / slot * 1.02, 2))
        wav, sec = voiced(text, lang, provider, voice, speed, cache)
    takes = 1
    if sec > slot:
        # neither TTS is deterministic: the same text at the same pace came back 12.2 s to 18.4 s (Sarvam) and +-8 % (MiniMax),
        # 18 Oct. Re-take up to 3 times at the cap and keep the shortest; the words never change.
        for t in (1, 2, 3):
            w2, s2 = voiced(text, lang, provider, voice, speed, cache, take=t); takes += 1
            if s2 < sec:
                wav, sec = w2, s2
            if sec <= slot:
                break
    status = "ok" if sec <= slot else ("TOO LONG" if sec > slot + 0.05 else "ok (within 0.05 s)")
    return wav, sec, speed, status, takes


# ---------------------------------------------------------------- build
def timeline(C, keys=None):
    """[(key, start_s, english_len_s, start_frame, slot_s)]: slot = until the next English beat starts, minus SLOP."""
    vo = [v for v in C["vo"] if keys is None or v[0] in keys]
    fps = C["fps"]; tl = []
    for i, (k, at, ln, f0) in enumerate(vo):
        nxt = vo[i + 1][3] if i + 1 < len(vo) else C["total"]
        slot = (nxt - f0) / fps - SLOP
        if i + 1 == len(vo) and keys is None:
            slot = min(slot, ln + 1.0)        # last beat of the film: at most 1 s past the English line (end card / fade)
        tl.append((k, at, ln, f0, round(slot, 3)))
    return tl


def build(C, lang, provider, voice, tag, keys=None, video=None, preview=None, preview_out=None, sample=False):
    T = json.load(open(REG / f"a01v4.{lang}.json")); tr = T["beats"]; PRON[lang] = T.get("pron") or {}
    tl = timeline(C, keys)
    miss = [k for k, *_ in tl if not (tr.get(k) or "").strip()]
    if miss:
        raise SystemExit(f"no translation for {miss}")
    cache = OUT / "cache" / f"{lang}_{provider}_{voice}"; cache.mkdir(parents=True, exist_ok=True)
    fps, total = C["fps"], C["total"]; n = int(round(total * SR / fps))
    rep, items, spans, bad = [], [], [], []
    for k, at, ln, f0, slot in tl:
        wav, sec, speed, status, takes = fit(k, tr[k].strip(), lang, provider, voice, slot, cache)
        if status == "TOO LONG":
            bad.append(k)
        items.append((f0, wav))
        spans.append((f0, f0 + jsround(sec * fps)))
        rep.append({"key": k, "start_s": at, "english_sec": ln, "slot_sec": slot, "voice_sec": round(sec, 2), "speed": speed,
                    "over_english_sec": round(max(0.0, sec - ln), 2), "takes": takes, "status": status, "text": tr[k].strip(), "spoken": pron(tr[k].strip(), lang)})
        print(f"  {k:<4} start {at:7.2f}  slot {slot:5.2f}  english {ln:5.2f}  voice {sec:5.2f}  speed {speed:.2f}  {status}", flush=True)
    # ducking: the composition's own spans (English VO), joined with the regional spans so the bed never opens under the voice
    en_spans = [s for v, s in zip(C["vo"], C["en_spans"]) if keys is None or v[0] in keys]
    voice_tr = place_voice(items, n, fps)
    mix = voice_tr + mix_bed(C, en_spans + spans, n) + mix_sfx(C, n)
    if sample:      # a cut of the film: 0.5 s fade at the cut so the sample does not end mid-bed with a click
        fl = int(0.5 * SR); mix[-fl:] *= np.linspace(1, 0, fl, dtype=np.float32)[:, None]
    OUT.mkdir(parents=True, exist_ok=True)
    reviewed = bool(T.get("reviewed_by")); name = f"a01v4_{lang}{tag}" + ("" if reviewed else "_DRAFT")
    raw = OUT / (name + "_raw.wav"); write_wav(raw, mix)
    I, tp = loudness(raw); g = 10 ** ((-16.0 - I) / 20)
    mix = mix * g; wavp = OUT / (name + ".wav"); write_wav(wavp, mix)
    I2, tp2 = loudness(wavp)
    if tp2 > -1.2:      # gentle limiter only if the gain pushed the true peak above -1.2 dBFS (target: below -1 dBFS)
        run([FF, "-v", "error", "-y", "-i", str(wavp), "-af", "alimiter=limit=0.84:attack=2:release=60:level=false", "-c:a", "pcm_s24le", str(raw)])
        os.replace(raw, wavp); I2, tp2 = loudness(wavp)
    raw.unlink(missing_ok=True)
    write_wav(OUT / (name + "_voice_only.wav"), voice_tr)
    m4a = OUT / (name + ".m4a")
    run([FF, "-v", "error", "-y", "-i", str(wavp), "-c:a", "aac", "-b:a", "256k", "-ar", str(SR), "-ac", "2", "-movflags", "+faststart", str(m4a)])
    exp = total / fps; wav_len = duration(wavp); m4a_len = duration(m4a)
    res = {"video": "a01v4", "lang": lang, "provider": provider, "voice": voice, "reviewed_by": T.get("reviewed_by"),
           "composition": C["tsx"], "fps": fps, "frames": total, "expected_sec": round(exp, 4), "wav_sec": round(wav_len, 4),
           "m4a_sec": round(m4a_len, 4), "integrated_lufs": I2, "true_peak_dbfs": tp2, "too_long": bad, "built": datetime.now().isoformat(timespec="seconds"),
           "ducking": "Sound.tsx MusicBed function and the composition's bed parameters; spans = English VO spans joined with the regional voice spans",
           "beats": rep}
    if video:
        info = json.loads(run([FP, "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                               "stream=nb_read_packets,r_frame_rate", "-of", "json", str(video)]).stdout)["streams"][0]
        vframes = int(info["nb_read_packets"]); vfps = eval(info["r_frame_rate"])
        res["video_check"] = {"video": str(video), "video_frames": vframes, "video_fps": vfps, "track_frames": total,
                              "result": "MATCH" if (vframes == total and abs(vfps - fps) < 1e-6) else "MISMATCH"}
        print("video", vframes, "frames @", vfps, "vs track", total, "frames @", fps, "->", res["video_check"]["result"])
    if preview:
        po = preview_out or (OUT / f"{name}_preview_540p.mp4")
        vcodec = ["-t", f"{exp:.4f}", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p"] if sample else ["-c:v", "copy"]
        run([FF, "-v", "error", "-y", "-i", str(preview), "-i", str(m4a), "-map", "0:v:0", "-map", "1:a:0"] + vcodec + ["-c:a", "copy",
             "-metadata:s:a:0", f"language={'hin' if lang == 'hi' else 'tam'}", "-movflags", "+faststart", str(po)])
        res["preview"] = str(po)
    json.dump(res, open(OUT / (name + "_report.json"), "w"), indent=1, ensure_ascii=False)
    print(f"\n{m4a}\n  expected {exp:.3f}s  wav {wav_len:.3f}s  m4a {m4a_len:.3f}s  I {I2} LUFS  TP {tp2} dBFS  too long: {bad or 'none'}")
    return res


def nulltest(C, video):
    """Rebuilds the ENGLISH mix from the same parts and subtracts the English render: proves bed + SFX are the same."""
    fps, total = C["fps"], C["total"]; n = int(round(total * SR / fps))
    items = [(f0, PUB / "a01v4" / "vo" / f"{k}{C.get('vo_suffix', '_n')}.wav") for k, _, _, f0 in C["vo"]]
    spans = C["en_spans"]
    parts = {"voice": place_voice(items, n, fps), "bed": mix_bed(C, spans, n), "sfx": mix_sfx(C, n)}
    ours = sum(parts.values()); ref = load_audio(video)[:n]
    m = min(len(ref), len(ours)); ours, ref = ours[:m], ref[:m]
    # alignment (AAC priming): cross-correlate 30 s of the left channel by FFT, search +-100 ms
    W = min(m, 30 * SR); x, y = ours[:W, 0].astype(np.float64), ref[:W, 0].astype(np.float64)
    N = 1 << (2 * W - 1).bit_length(); cc = np.fft.irfft(np.fft.rfft(y, N) * np.conj(np.fft.rfft(x, N)), N)
    lags = np.r_[np.arange(0, 4800), np.arange(-4800, 0)]; vals = np.r_[cc[:4800], cc[-4800:]]
    lag = int(lags[np.argmax(vals)])          # ref[t + lag] ~ ours[t]
    # Remotion places each voice beat up to +-16 samples (0.33 ms) off its frame (measured 18 Oct on the re-timed film); that is
    # inaudible but ruins a speech null, so each English beat is re-aligned within +-1 ms before subtracting. Bed and SFX are not moved.
    beat_shift = {}
    if lag >= 0:
        vref = ref[lag:, 0].astype(np.float64); vox = np.zeros((n, 2), np.float32)
        for f0, p in items:
            x = load_audio(p); a0 = int(f0 * SR // fps); xm = x[:, 0].astype(np.float64)
            if a0 + len(x) + 48 >= len(vref):
                xm = xm[: max(0, len(vref) - a0 - 48)]
            best = max((float(np.dot(xm, vref[a0 + s: a0 + s + len(xm)])), s) for s in range(-48, 49) if a0 + s >= 0)
            s = best[1]; beat_shift[p.stem] = s; x = x[: max(0, n - a0 - s)]
            vox[a0 + s: a0 + s + len(x)] += x
        parts["voice"] = vox; ours = sum(parts.values())[:m]
    a = ours[max(0, -lag):]; b = ref[max(0, lag):]; L = min(len(a), len(b)) - 10; a, b = a[:L], b[:L]
    rms = lambda x: float(np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-12)
    out = {"lag_samples": lag, "voice_beat_shift_samples": sorted(set(beat_shift.values())),
           "ref_rms_db": 20 * np.log10(rms(b)), "residual_db_rel": 20 * np.log10(rms(a - b) / rms(b))}
    # per-component least-squares gains (0 dB = same level as the render) and the residual left after them
    P = [parts[k][max(0, -lag):][:L, 0][::4] for k in ("voice", "bed", "sfx")]      # left channel, every 4th sample: memory-light
    A = np.stack(P, 1).astype(np.float64); y = b[:, 0][::4].astype(np.float64)
    coef, *_ = np.linalg.lstsq(A, y, rcond=None)
    out.update({f"{k}_gain_db": round(20 * np.log10(abs(c)), 2) for k, c in zip(("voice", "bed", "sfx"), coef)})
    out["note"] = "AAC in the render leaves roughly -15 to -20 dB of residual; component gains near 0 dB and a stable lag mean the same mix"
    res = (a - b)[:, 0]; W = 60 * SR
    out["residual_db_rel_per_minute"] = [round(20 * np.log10(rms(res[i:i + W]) / rms(b[i:i + W, 0])), 1) for i in range(0, L - SR, W)]
    print(json.dumps(out, indent=1))
    return out


def load_comp(tsx, fps=None):
    return read_film(tsx, int(fps or 60)) if tsx.endswith("A01V4Film.tsx") else read_comp(tsx)


def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    if not a:
        raise SystemExit(__doc__)
    cmd = a[0]
    if cmd == "nulltest":
        return nulltest(load_comp(opt("--comp", "src/voxplus/A01V4Film.tsx"), opt("--fps")), opt("--video"))
    lang = a[1]; L = LANGS[lang]; provider = L["provider"]
    if cmd == "sample":
        # the film itself, cut where the beat after --until starts: same beds, cues and timing as the full track
        C = load_comp(opt("--comp", "src/voxplus/A01V4Film.tsx"), opt("--fps"))
        order = [v[0] for v in C["vo"]]; i = order.index(opt("--until", "m01"))
        C = dict(C, total=C["vo"][i + 1][3]); keys = set(order[: i + 1])
        prev = opt("--preview", str(ROOT / "out" / "voxplus" / "a01v4" / "what-is-a-moat-26-loom_540p60.mp4"))
        voices = (opt("--voices") or (L.get("voice") or "")).split(",")
        for v in voices:
            print(f"== {L['name']} sample, {provider} {v}, c01-{order[i]} ({C['total'] / C['fps']:.2f} s)", flush=True)
            build(C, lang, provider, v, f"_v4sample_{v}", keys=keys, preview=prev, sample=True,
                  preview_out=OUT / f"a01v4_{lang}_v4sample_{v}_DRAFT_540p.mp4")
        return
    if cmd == "build":
        C = load_comp(opt("--comp", "src/voxplus/A01V4Film.tsx"), opt("--fps"))
        voice = opt("--voice") or L.get("voice") or json.load(open(REG / f"a01v4.{lang}.json")).get("voice_sarvam")
        if not voice:
            raise SystemExit("Tamil needs --voice <sarvam speaker> (AK's pick)")
        res = build(C, lang, provider, voice, "", video=opt("--video"), preview=opt("--preview"))
        if res["too_long"]:
            sys.exit("Shorten the translation for the TOO LONG beats and rebuild. Do not upload this track.")
        return
    raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
