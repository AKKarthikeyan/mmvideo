#!/usr/bin/env python3
"""Word onsets in a beat Short's existing narration, so a look can land each number on the narrator's word.

Critic blocker 3 (docs/datakadai/looks/README.md): the looks lock a number on the spoken word, but nothing measured when the
words are said. This script measures it in the narration that is already voiced (public/datayt/beats/<id>/vo_XX.mp3). It
never voices anything and never writes data.json (build_beats.py rewrites that file); it writes

  public/datayt/beats/<id>/word_times.json      every voice line's words with start/end seconds, every spoken number, and for
                                                each beat the lock frame of its number (see "lock rules" below)
  src/looks/shared/registry.ts                  the registry the looks import (word times + each config's look fields)

Method
  1. Transcribe each line with faster-whisper (word timestamps), the line's own text given as the prompt so numbers come
     back as words. Model: $WT_MODEL, else the first one already in the Hugging Face cache (small.en, base.en, small,
     medium); nothing is downloaded unless WT_ALLOW_DOWNLOAD=1. Results are cached under out/looks/word_cache/.
  2. Align the known line text (data.json vo[].text) to the transcript word by word (Needleman-Wunsch; digit tokens are
     spelled out first, years as years), so every word of the script gets a time even where whisper heard it differently.
  3. Measure each number's onset on the audio with the rule its first sound needs (see "number onsets on the audio" below):
     the frication that runs into the first vowel (f, s, th, z), the burst out of the closure (t), the boundary of the n / w
     murmur, or the edge of the vowel; whisper's start (corrected for pauses) only picks which candidate. Whisper's own start
     is not used as the onset: it sits on the vowel of a fricative word and at the start of a pause before a word.
  If faster-whisper is missing or fails, step 1 is replaced by an energy alignment: words are spread over the voiced
  stretches of the line by length, then step 3 measures each number the same way ("method" in the file says which).

Lock rules (per beat; frames are 30 fps on the rendered timeline: lock = ceil((round(at*30)/30 + onset + margin) * 30), margin
10 ms after a stop burst, else 25 ms, so a number lands 0.3 to 1.75 frames after its measured onset)
  big / hero      the beat's own number (fact 'big'; the first starred number of a spot/say line) matched by value to a
                  number the narrator says in that beat's line          -> lockHow "spoken"
                  else, if an earlier line already said it              -> beat start + 6 frames, "said-earlier"
                  else the first number the narrator says in the beat   -> "first-number"
                  else                                                  -> beat start + 6 frames, "no-number" / "no-voice"
  bar labels and other printed numbers: their own spoken onset, else beat start + 6 if said earlier, else the beat's lock.

  .venv/bin/python scripts/datayt/word_times.py gd01 cw01 ...     # or no ids: the 11 national stories
  .venv/bin/python scripts/datayt/word_times.py --spot            # also print how each onset was found
  .venv/bin/python scripts/datayt/word_times.py --check           # and compare every lock with the onsets read off spectrograms
                                                                  # (scripts/datayt/word_onsets_checked.json); exit 1 if any lock
                                                                  # is not 0-3 frames after its onset
"""
import glob, hashlib, json, math, os, re, subprocess, sys, time
import numpy as np

FPS, SR = 30, 16000
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BEATS = os.path.join(ROOT, "public/datayt/beats")
CACHE = os.path.join(ROOT, "out/looks/word_cache")
COMP = os.path.join(ROOT, "node_modules/@remotion/compositor-darwin-arm64")
SCOPE = ["gd01", "cw01", "fm02", "fm03", "fm04", "fm05", "fm01", "fs01", "fs02", "fs03", "fs04"]
LOOK_TYPES = ("money", "basket")

UNITS = {w: i for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen "
                                     "sixteen seventeen eighteen nineteen".split())}
TENS = {w: 10 * (i + 2) for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}
BIG = {"thousand": 1e3, "lakh": 1e5, "lakhs": 1e5, "crore": 1e7, "crores": 1e7, "million": 1e6, "billion": 1e9}
NUM = {**UNITS, **TENS}
SCALE_WORDS = {"hundred"} | set(BIG)


# ---------------------------------------------------------------- audio
def load_audio(path):
    """Mono 16 kHz float32, decoded by the ffmpeg that ships with Remotion (PyAV in this venv is too new for faster-whisper)."""
    env = {**os.environ, "DYLD_LIBRARY_PATH": COMP}
    raw = subprocess.run([f"{COMP}/ffmpeg", "-v", "error", "-i", path, "-f", "wav", "-acodec", "pcm_s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, env=env, check=True).stdout
    i = raw.find(b"data")
    return np.frombuffer(raw[i + 8: i + 8 + (len(raw) - i - 8) // 2 * 2], np.int16).astype(np.float32) / 32768


def energy(a, hop=0.005, win=0.02):
    """Short-time energy in dB, one value per 5 ms (used only by the no-whisper fallback alignment)."""
    h, w = int(SR * hop), int(SR * win)
    n = max(1, (len(a) - w) // h + 1)
    idx = np.arange(w)[None, :] + h * np.arange(n)[:, None]
    seg = a[np.clip(idx, 0, len(a) - 1)]
    e = 10 * np.log10(np.mean(seg ** 2, axis=1) + 1e-10)
    k = np.ones(3) / 3
    return np.convolve(e, k, mode="same"), hop


# ---------------------------------------------------------------- number onsets on the audio
# Whisper's word start is not the word's onset. It sits on the first vowel of a word that opens with a fricative (it missed the
# 170 ms /f/ of 'to fifteen'), it puts a word that follows a pause at the pause's start (the 'twenty' of 'value: twenty-eight'
# 450 ms early) and it can sit late inside the first vowel after a pause. So each number's onset is measured on the audio,
# with the rule its first sound needs; whisper only says which word to look at.
#
# Frames every 2.5 ms (10 ms Hann window, centred on the frame time) carry three levels in dB: et, the pre-emphasised total
# (so a weak f / th / s still shows), lo, the raw 80-1000 Hz band (voicing, vowel F1) and hi, the 2.5-8 kHz band (hiss).
# Each frame is labelled S (silence or closure: 40 dB under the line's peak), N (sonorant: loud with the low band on top, which
# also catches an /i/ with strong upper formants) or O (obstruent: frication, burst, aspiration); 'quiet' (35 dB under) marks
# pauses and breaths. The rule comes from the number's first word:
#   fricative  four five six seven three thirteen thirty fourteen ... zero: the frication run that ends at the word's first
#              vowel, walked back to a silence or a real sonorant. A voiced /z/ ('rose four') or a louder s / z hiss ('cars
#              four') before a weaker f / th is the previous word's; a closure inside the run ('cost | four') ends it; a voiced
#              blip right after a stop release ('cost[ə] four') puts the onset at the blip; a hiss shared by two words with no
#              voicing change ('was zero') puts it in the middle of the hiss.
#   stop       two ten twelve twenty: the burst, half-way up the rise out of the closure (a rise that follows aspiration is the
#              voicing, not the burst).
#   weak       nine nineteen ninety one: the fall into the murmur after a vowel ('higher nine'), the release of the previous
#              word's closure ('moved one', 'held ninety'), the rise out of the previous word's nasal ('from one'), the edge out
#              of a silence, or the middle of a nasal shared with the previous word ('on nine').
#   vowel      eight eighteen eighty eleven: the edge out of a silence or of the previous word's final consonant, or the rise
#              out of the dip between two vowels ('to eighty'); never the voicing after a stop release when the previous word
#              ends in a vowel (that is the 'ty' of 'eighty').
# Whisper's start is first moved to the end of a pause it falls in, or back to the end of a pause when it sits inside the
# first vowel after that pause and the previous word began before the pause. Then the candidate whose anchor (the vowel for a
# fricative, else the boundary itself) is nearest that start wins, inside a window per rule; for a fricative the window
# reaches 100 ms before and 250 ms after whisper, because whisper hears these on the vowel.
# The lock is the first frame starting at least a margin after the onset, on the rendered timeline (the narration line starts
# at frame round(at * 30), as BeatStory and LookAudio place it): lock = ceil((round(at*30)/30 + onset + margin) * 30), margin
# 10 ms after a stop burst and 25 ms after any other boundary. So a number lands 0.3 to 1.3 frames after a burst and 0.75 to
# 1.75 frames after any other onset, and never before the word while the estimate is within the margin.
O_HOP, O_WIN, LOCK_MARGIN, BURST_MARGIN = 0.0025, 0.010, 0.025, 0.010
O_FRIC = {"four", "five", "fourteen", "fifteen", "forty", "fifty", "six", "sixteen", "sixty", "seven", "seventeen", "seventy",
          "three", "thirteen", "thirty", "zero"}
O_STOP = {"two", "ten", "twelve", "twenty"}
O_WEAK = {"nine", "nineteen", "ninety", "one"}
O_SIB = {"six", "sixteen", "sixty", "seven", "seventeen", "seventy", "zero"}
O_WINDOW = {"fric": (-0.10, 0.25), "stop": (-0.12, 0.16), "weak": (-0.20, 0.06), "vowel": (-0.25, 0.08)}   # anchor - whisper (s)
O_EARLY = {"fric": 1.0, "stop": 1.0, "weak": 0.75, "vowel": 0.75}      # cost of an anchor before whisper, per second
O_LATE = {"fric": 1.0, "stop": 1.0, "weak": 1.5, "vowel": 1.5}         # ... and after it


def lock_margin(how):
    """A stop burst is a sharp event (measured within about 5 ms), so its margin is 10 ms; every other boundary is gradual
    (a frication fading in, a vowel decaying, a murmur) and gets 25 ms."""
    return BURST_MARGIN if how == "burst" else LOCK_MARGIN


def onset_class(word):
    return "fric" if word in O_FRIC else "stop" if word in O_STOP else "weak" if word in O_WEAK else "vowel"


def final_sound(prev):
    """Rough class of a script word's last sound, from its spelling: sib, stop, fric, nasal or son (vowel, r, l, w, y)."""
    p = (prev or "").lower().strip("'")
    if not p:
        return None
    if p.endswith(("s", "z", "ce", "se", "ze", "x", "sh", "ch")):
        return "sib"
    if p.endswith(("t", "d", "k", "p", "b", "g", "te", "de", "ke", "pe", "be", "ck")) and not p.endswith("ng"):
        return "stop"
    if p.endswith(("f", "v", "ve", "fe", "th", "of")):
        return "fric"
    if p.endswith(("m", "n", "ng", "me", "ne")):
        return "nasal"
    return "son"


def shares_hiss(prev, word):
    """The previous word's final s / z and the number's first s / z are one hiss with no voicing change in it ('was zero')."""
    p = (prev or "").lower()
    if word not in O_SIB or final_sound(p) != "sib":
        return False
    voiceless_s = p.endswith(("ss", "ts", "ks", "ps", "fs", "ce", "us", "x"))
    return (word != "zero") if voiceless_s else (word == "zero")


def _median5(x):
    p = np.pad(x, 2, mode="edge")
    return np.median(np.stack([p[i:i + len(x)] for i in range(5)]), 0).astype(int)


def _runs(mask):
    out, s = [], None
    for i, x in enumerate(list(mask) + [False]):
        if x and s is None:
            s = i
        elif not x and s is not None:
            out.append((s, i)); s = None
    return out


def _segments(lab):
    out, s = [], 0
    for i in range(1, len(lab) + 1):
        if i == len(lab) or lab[i] != lab[s]:
            out.append((int(lab[s]), s, i)); s = i
    return out


def onset_features(a):
    """Frame-centred levels every 2.5 ms and the S / O / N labels (see the block comment above)."""
    h, w = int(SR * O_HOP), int(SR * O_WIN)
    n = len(a) // h + 1
    pad = np.concatenate([np.zeros(w // 2), a, np.zeros(w)])
    idx = h * np.arange(n)[:, None] + np.arange(w)[None, :]
    fr = pad[np.clip(idx, 0, len(pad) - 1)] * np.hanning(w)[None, :]
    P = np.abs(np.fft.rfft(fr, 256, axis=1)) ** 2
    fq = np.arange(P.shape[1]) * SR / 256
    g = np.abs(1 - 0.97 * np.exp(-2j * np.pi * fq / SR)) ** 2          # pre-emphasis (0.97)
    db = lambda x: 10 * np.log10(x + 1e-12)
    sm = lambda x: np.convolve(x, np.ones(3) / 3, mode="same")
    et = sm(db((P * g).sum(1)))
    lo = sm(db(P[:, (fq >= 80) & (fq < 1000)].sum(1)))
    hi = sm(db((P * g)[:, (fq >= 2500) & (fq < 8000)].sum(1)))
    peak = float(np.percentile(et, 99))
    son = (et > peak - 34) & ((lo - hi > 10) | ((lo - et > 6) & (lo > peak - 6)))
    lab = _median5(np.where(et < peak - 40, 0, np.where(son, 2, 1)))      # 0 S, 1 O, 2 N
    quiet = _median5((et < peak - 35).astype(int)).astype(bool)
    return {"et": et, "lo": lo, "hi": hi, "peak": peak, "lab": lab, "quiet": quiet}


def _bursts(F, w, I):
    """Rises of 8 dB or more in 10 ms near w: (frame half-way up from the closure, 'burst' if out of a quiet closure else 'rise')."""
    et, quiet = F["et"], F["quiet"]
    n = len(et)
    r = np.full(n, -99.0)
    r[2:-2] = et[4:] - et[:-4]
    out = []
    for i in range(max(1, I(w - 0.14)), min(n - 1, I(w + 0.18))):
        if r[i] >= 8 and r[i] >= r[i - 1] and r[i] >= r[i + 1]:
            m = max(0, i - 12) + int(np.argmin(et[max(0, i - 12):i]))
            top = float(np.max(et[i:i + 12]))
            if top - et[m] >= 10:
                thr = et[m] + 0.5 * (top - et[m])
                j = next((q for q in range(m, i + 12) if et[q] >= thr), i)
                out.append((j, "burst" if bool(quiet[max(0, j - 6):j].any()) else "rise", j))
    return out


def number_onset(F, ws, word, prev, prev_ws=None):
    """Onset (s, line-local) of a spoken number whose first word is `word` and whisper start ws; prev is the script word before it
    (None at the line's start) and prev_ws its whisper start. Returns (onset, {cls, how, w})."""
    et, lo, hi, lab, quiet = F["et"], F["lo"], F["hi"], F["lab"], F["quiet"]
    n, HOP = len(et), O_HOP
    I = lambda s: int(np.clip(round(s / HOP), 0, n - 1))
    cls, fin = onset_class(word), final_sound(prev)
    nruns = [(a, b) for L_, a, b in _segments(lab) if L_ == 2]
    voiced = lambda q: (lab[q:q + 12] == 2).sum() >= 9          # what follows a boundary must be a sonorant
    # whisper's start, corrected for pauses
    w, pe, why = ws, None, "whisper"
    Q = [(a, b) for a, b in _runs(quiet) if (b - a) * HOP >= 0.06]
    for a, b in Q:
        if a * HOP <= ws + 0.06 and b * HOP > ws:                 # in (or just before) a pause: its end
            w, pe, why = b * HOP, b, "pause-end"; break
    if pe is None:
        for a, b in Q:                                            # late inside the first vowel after a pause: back to its end
            if (b - a) * HOP >= 0.08 and ws - 0.25 <= b * HOP <= ws - 0.02 and (prev_ws is None or prev_ws < a * HOP - 0.08):
                held = next(((x, y) for x, y in nruns if x <= I(ws) < y), None)
                if held and held[0] <= b + int(0.10 / HOP) and not any(b + 2 < x < held[0] for x, _ in nruns):
                    w, pe, why = b * HOP, b, "after-pause"
    floor_i = (pe - int(0.10 / HOP)) if pe is not None else 0
    cands = []      # (onset frame, how, anchor frame)
    if cls == "fric":
        for V, Vend in nruns:
            if Vend - V < 12 or not (w + O_WINDOW["fric"][0] <= V * HOP <= w + O_WINDOW["fric"][1]):
                continue
            i, raw = V - 1, V
            while i > 0 and V - i < int(0.34 / HOP):
                if lab[i] == 0:
                    break
                if lab[i] == 2:                                   # a sonorant inside the run
                    k = i
                    while k > 0 and lab[k] == 2:
                        k -= 1
                    if i - k >= (24 if word == "three" else 12):  # a real one ends the run (the r of 'three' may be 60 ms)
                        break
                    j = k
                    while j > 0 and lab[j] == 1:
                        j -= 1
                    if fin == "stop" and k - j < 14 and (lab[j] == 0 or bool(quiet[max(0, j - 4):j + 1].any())):
                        raw = k + 1                               # 'cost[ə] four': a release, then a blip; the word starts at the blip
                        break
                    i = k; continue
                raw = i; i -= 1
            if V - raw < 4:                                       # out of a silence, frication too short or weak to label
                cands.append((V, "edge", V)); continue
            after_vowel = bool((lab[max(0, raw - 3):raw] == 2).any())
            lo_ref, hi_ref = float(np.percentile(lo[raw:V], 25)), float(np.percentile(hi[raw:V], 25))
            start, miss, fr = V, 0, []
            for i in range(V - 1, raw - 1, -1):
                ok, near = lab[i] != 0, i >= V - 12               # near: voicing for the vowel starts inside the frication
                med = float(np.median(fr)) if fr else None
                if ok and fr and et[i] < med - 10 and bool((et[max(0, i - 16):i] > med - 6).any()):
                    ok = False                                    # a closure with sound before it ('cost | four'), not a fade-in
                if ok and after_vowel and not near and word != "zero" and lo[i] > lo_ref + 12 and (word in O_SIB or not fr or et[i] > med + 8):
                    ok = False                                    # the voiced /z/ of 'rose' before f / s / th
                if ok and after_vowel and not near and fin == "sib" and word not in O_SIB and hi[i] > hi_ref + 8:
                    ok = False                                    # an s / z hiss before a weaker f / th ('cars four')
                if ok:
                    start, miss = i, 0
                    if lab[i] == 1:
                        fr.append(et[i])
                else:
                    miss += 1
                    if miss > 2:
                        break
            on = start
            if after_vowel and start == raw:                      # out of a vowel: wait for its low band to decay (<= 30 ms)
                lvl = float(np.median(lo[start:V]))
                while on < min(V - 4, start + 12) and lo[on] > lvl + 6:
                    on += 1
            if shares_hiss(prev, word):
                cands.append(((start + V) // 2, "shared-hiss", V))
            else:
                cands.append((on, "frication", V))
    elif cls == "stop":
        cands = _bursts(F, w, I)
        if any(h == "burst" and O_WINDOW["stop"][0] <= a_ * HOP - w <= O_WINDOW["stop"][1] for _, h, a_ in cands):
            cands = [c for c in cands if c[1] == "burst"]
    else:
        for V, Vend in nruns:
            if abs(V * HOP - w) > 0.3 or V == 0 or Vend - V < 12:
                continue
            if lab[V - 1] == 0 or (lab[max(0, V - 10):V] == 0).any() or (lab[V - 1] == 1 and fin in ("sib", "stop", "fric")) or prev is None:
                o = V
                while o > 0 and V - o < 16 and lab[o - 1] != 0:
                    o -= 1
                # a breathy or glottal start (a little noise straight out of a silence) is the word's first sound
                cands.append((o if o < V and lab[o - 1] == 0 else V, "edge", V))
        if cls == "weak" and fin in ("stop", None):
            cands += _bursts(F, w, I)
        for i in range(max(1, I(w - 0.25)), min(n - 1, I(w + 0.2))):
            if not (et[i] <= et[i - 1] and et[i] < et[i + 1]) or et[i] > float(np.min(et[max(0, i - 8):i + 9])) or lab[i] == 0:
                continue                                          # a real dip: the lowest point 20 ms either side
            left, right = float(np.max(et[max(0, i - 48):i])), float(np.max(et[i:i + 24]))
            if min(left, right) - et[i] < 3:
                continue
            rise = next((q for q in range(i, i + 24) if et[q] >= et[i] + 0.5 * (right - et[i])), i)
            fall = next((q for q in range(i, max(0, i - 48), -1) if et[q] >= et[i] + 0.5 * (left - et[i])), i) + 1
            if cls == "weak":
                if fin == "nasal" and word.startswith("n"):
                    if voiced(fall):
                        cands.append(((fall + rise) // 2, "shared-nasal", (fall + rise) // 2))
                elif fin in ("nasal", "stop"):
                    if voiced(rise):
                        cands.append((rise, "dip-rise", rise))
                elif voiced(fall):
                    cands.append((fall, "fall", fall))
            else:
                released = (lab[max(0, rise - 16):rise] == 1).sum() >= 4 and bool(quiet[max(0, rise - 28):rise].any())
                if (fin in ("son", "nasal") and released) or not voiced(rise):
                    continue
                cands.append((rise, "dip-rise", rise))
        if cls == "weak" and fin == "stop":                       # the release of the previous word's closure, not the w's dip
            rel = [c for c in cands if c[1] in ("burst", "rise") and -0.15 <= c[2] * HOP - w <= 0.04]
            if rel:
                cands = rel
    lo_w, hi_w = O_WINDOW[cls]
    best, bc = None, 1e9
    for on, how, anc in cands:
        d = anc * HOP - w
        if not (lo_w <= d <= hi_w) or (cls != "fric" and on < floor_i - 2):
            continue
        cost = d * O_LATE[cls] if d >= 0 else -d * O_EARLY[cls]
        if cost < bc:
            best, bc = (on, how), cost
    if best is None:
        return w, {"cls": cls, "how": "whisper" if why == "whisper" else why, "w": round(w, 3)}
    return best[0] * HOP, {"cls": cls, "how": best[1], "w": round(w, 3)}


def voiced_spans(e, hop, floor_db=None, min_gap=0.15):
    """Stretches of speech: energy above (peak - 35 dB), gaps shorter than min_gap merged."""
    thr = (np.max(e) - 35) if floor_db is None else floor_db
    on = e > thr
    spans, start = [], None
    for i, x in enumerate(on):
        if x and start is None:
            start = i
        if not x and start is not None:
            spans.append([start * hop, i * hop]); start = None
    if start is not None:
        spans.append([start * hop, len(e) * hop])
    out = []
    for s in spans:
        if out and s[0] - out[-1][1] < min_gap:
            out[-1][1] = s[1]
        else:
            out.append(s)
    return [s for s in out if s[1] - s[0] > 0.04]


# ---------------------------------------------------------------- words and numbers
def tokens(text):
    """Script words, hyphen compounds split ("twenty-five" -> twenty, five; "ten-rupee" -> ten, rupee).
    Each token: {w: normalised, raw, word: index of the script word, hy: joined to the previous token by a hyphen}."""
    out = []
    for wi, raw in enumerate(text.split()):
        parts = [p for p in re.split(r"[-‐‑]", raw) if p]
        for k, p in enumerate(parts):
            w = re.sub(r"[^a-z0-9.%₹]", "", p.lower().replace("’", "'").replace("'s", "")).strip(".,")
            if w:
                out.append({"w": w, "raw": raw, "word": wi, "hy": k > 0})
    return out


def spoken_value(ws, hy):
    """Value of a run of number words. Returns dict(value, mantissa, scale, kind) or None."""
    if not ws:
        return None
    # years: "twenty fifteen", "twenty twenty-two", "nineteen ninety-one"
    if ws[0] in ("twenty", "nineteen") and len(ws) in (2, 3) and not hy[1] and not set(ws) & SCALE_WORDS and "point" not in ws and "and" not in ws:
        rest = ws[1:]
        two = (UNITS.get(rest[0]) if len(rest) == 1 and 10 <= UNITS.get(rest[0], -1) <= 19 else
               TENS.get(rest[0]) if len(rest) == 1 and rest[0] in TENS else
               TENS[rest[0]] + UNITS[rest[1]] if len(rest) == 2 and rest[0] in TENS and rest[1] in UNITS and UNITS[rest[1]] < 10 and hy[2] else None)
        if two is not None:
            y = (2000 if ws[0] == "twenty" else 1900) + two
            return {"value": float(y), "mantissa": float(y), "scale": 1.0, "kind": "year"}
    half = 0.0
    if ws[-2:] == ["a", "half"]:
        half, ws = 0.5, ws[:-3] if len(ws) >= 3 and ws[-3] == "and" else ws[:-2]
    trail = 1.0
    while ws and ws[-1] in BIG:      # "twenty-five thousand", "one point one three lakh crore", "seventy-seven crore"
        trail *= BIG[ws[-1]]; ws = ws[:-1]
    if not ws:
        return None
    if "point" in ws:
        k = ws.index("point")
        ip = int_value(ws[:k]) if k else 0
        dec = "".join(str(UNITS[w]) for w in ws[k + 1:] if w in UNITS and UNITS[w] < 10)
        if ip is None or not dec:
            return None
        m = float(f"{ip}.{dec}")
    else:
        m = int_value(ws)
        if m is None:
            return None
        m = float(m)
    m += half
    return {"value": m * trail, "mantissa": m, "scale": trail, "kind": "number"}


def int_value(ws):
    total = cur = 0
    seen = False
    for w in ws:
        if w == "and":
            continue
        if w in NUM:
            cur += NUM[w]; seen = True
        elif w == "hundred":
            cur = max(cur, 1) * 100; seen = True
        elif w in BIG:
            total += max(cur, 1) * BIG[w]; cur = 0; seen = True
        else:
            return None
    return total + cur if seen else None


def number_phrases(toks):
    """Runs of number words in a token list: [{i0, i1, words, value...}]."""
    out, i, n = [], 0, len(toks)
    while i < n:
        if toks[i]["w"] not in NUM:
            i += 1; continue
        j = i + 1
        while j < n:
            w = toks[j]["w"]
            run = [t["w"] for t in toks[i:j]]
            if w in NUM or w in SCALE_WORDS:
                # a new year-like phrase starts here ("twenty sixteen and twenty seventeen" is two numbers)
                j += 1; continue
            if w == "point" and j + 1 < n and toks[j + 1]["w"] in UNITS:
                j += 1; continue
            if w == "and" and j + 1 < n and (toks[j + 1]["w"] in NUM and (set(run) & SCALE_WORDS) or toks[j + 1]["w"] == "a"):
                j += 1; continue
            if w == "a" and j + 1 < n and toks[j + 1]["w"] == "half" and toks[j - 1]["w"] == "and":
                j += 2; continue
            break
        ws = [t["w"] for t in toks[i:j]]
        hy = [t["hy"] for t in toks[i:j]]
        v = spoken_value(ws, hy)
        if v:
            out.append({"i0": i, "i1": j - 1, "words": ws, **v})
        i = j
    # "twenty-five and twenty-eight thousand": the first number takes the scale the narrator left off
    for a, b in zip(out, out[1:]):
        if b["i0"] == a["i1"] + 2 and toks[a["i1"] + 1]["w"] == "and" and a["scale"] == 1 and b["scale"] > 1 and a["kind"] == "number":
            a["scale"], a["value"], a["elided"] = b["scale"], a["mantissa"] * b["scale"], True
    return out


def digits_to_words(tok):
    """A transcript token with digits, spelled out the way the narrator would say it."""
    s = tok.replace(",", "")
    out = []
    m = re.match(r"^(\d+)(?:\.(\d+))?", s)
    if not m:
        return [tok]
    ip, dp = m.group(1), m.group(2)
    if not dp and len(ip) == 4 and 1900 <= int(ip) <= 2099 and "," not in tok:
        y = int(ip)
        out = [("twenty" if y >= 2000 else "nineteen")] + say_int(y % 100) if y % 100 else say_int(y)
    else:
        out = say_int(int(ip))
        if dp:
            out += ["point"] + [say_int(int(c))[0] for c in dp]
    if "%" in s:
        out.append("percent")
    return out


def say_int(n):
    if n < 20:
        return [list(UNITS)[n]]
    if n < 100:
        t, u = divmod(n, 10)
        return [list(TENS)[t - 2]] + ([list(UNITS)[u]] if u else [])
    if n < 1000:
        h, r = divmod(n, 100)
        return say_int(h) + ["hundred"] + (say_int(r) if r else [])
    for name, v in (("crore", 10 ** 7), ("lakh", 10 ** 5), ("thousand", 1000)):
        if n >= v:
            q, r = divmod(n, v)
            return say_int(q) + [name] + (say_int(r) if r else [])
    return [str(n)]


def align(known, heard):
    """Needleman-Wunsch over normalised words. Returns, for each known index, the heard index (or None)."""
    n, m = len(known), len(heard)
    def sc(a, b):
        if a == b:
            return 2
        if a in NUM and b in NUM:
            return 0.5
        if a[:4] == b[:4] and len(a) > 3:
            return 1
        return -1
    G = -0.8
    S = np.zeros((n + 1, m + 1)); B = np.zeros((n + 1, m + 1), dtype=np.int8)
    S[:, 0] = G * np.arange(n + 1); S[0, :] = G * np.arange(m + 1); B[1:, 0] = 1; B[0, 1:] = 2
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            opts = (S[i - 1, j - 1] + sc(known[i - 1], heard[j - 1]), S[i - 1, j] + G, S[i, j - 1] + G)
            k = int(np.argmax(opts)); S[i, j] = opts[k]; B[i, j] = k
    out = [None] * n
    i, j = n, m
    while i > 0 and j > 0:
        if B[i, j] == 0:
            if sc(known[i - 1], heard[j - 1]) > 0:
                out[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif B[i, j] == 1:
            i -= 1
        else:
            j -= 1
    return out


# ---------------------------------------------------------------- printed numbers (same rules as src/looks/shared/numbers.ts)
NUM_RE = re.compile(r"(?P<sign>[+\-−]?)(?P<prefix>₹?)(?P<digits>\d[\d,]*(?:\.\d+)?)(?P<unit>\s?(?:lakh crore|lakh cr|crore|cr|lakh|thousand|million|billion)\b|%|×|\s?t\b|\s?years?\b|\s?ml\b)?")
UNIT_SCALE = [("lakh crore", 1e12), ("lakh cr", 1e12), ("crore", 1e7), ("cr", 1e7), ("lakh", 1e5), ("thousand", 1e3), ("million", 1e6), ("billion", 1e9)]


def printed_numbers(text):
    """Every printed number in a string: [{text, value (abs, unscaled), scaled}]."""
    out = []
    for m in NUM_RE.finditer((text or "").replace("*", "")):
        d = m.group("digits").rstrip(",.")
        v = float(d.replace(",", ""))
        u = (m.group("unit") or "").strip()
        sc = next((s for k, s in UNIT_SCALE if u == k), 1.0)
        out.append({"text": m.group(0).rstrip(",. "), "value": v, "scaled": v * sc, "year": bool(re.fullmatch(r"(19|20)\d\d", d))})
    return out


def first_printed(text):
    n = printed_numbers(text)
    return n[0] if n else None


def matches(p, s, tol=0.03):
    if s["kind"] == "year" or p["year"]:
        return s["kind"] == "year" and p["year"] and abs(p["value"] - s["value"]) < 0.5
    rel = lambda a, b: abs(a - b) / max(abs(a), abs(b), 1e-9)
    return rel(p["scaled"], s["value"]) <= tol or rel(p["value"], s["value"]) <= tol or (s["scale"] > 1 and rel(p["value"], s["mantissa"]) <= tol)


def hero_text(lines):
    """The first starred token of a hook/say line that holds a number, as printed (no stars)."""
    for l in lines or []:
        for seg in re.findall(r"\*([^*]+)\*", l):
            if re.search(r"\d", seg):
                return seg
    return None


# ---------------------------------------------------------------- transcription
_model = None
def whisper_model():
    global _model
    if _model is not None:
        return _model
    from faster_whisper import WhisperModel
    want = os.environ.get("WT_MODEL")
    hub = os.path.expanduser("~/.cache/huggingface/hub")
    cached = [m for m in ("small.en", "base.en", "small", "medium", "medium.en") if os.path.isdir(f"{hub}/models--Systran--faster-whisper-{m}")]
    name = want or (cached[0] if cached else "base.en")
    if not os.environ.get("WT_ALLOW_DOWNLOAD") and name not in cached:
        os.environ["HF_HUB_OFFLINE"] = "1"
    if name in cached:
        os.environ["HF_HUB_OFFLINE"] = "1"
    _model = (WhisperModel(name, device="cpu", compute_type="int8", cpu_threads=int(os.environ.get("WT_THREADS", "6"))), name)
    return _model


def transcribe(path, text, key):
    os.makedirs(os.path.dirname(key), exist_ok=True)
    if os.path.exists(key):
        return json.load(open(key))
    model, name = whisper_model()
    a = load_audio(path)
    segs, _ = model.transcribe(a, language="en", word_timestamps=True, beam_size=5, vad_filter=False, initial_prompt=text,
                               condition_on_previous_text=False)
    words = [{"w": w.word, "start": round(float(w.start), 3), "end": round(float(w.end), 3), "p": round(float(w.probability), 3)} for s in segs for w in s.words]
    out = {"model": f"faster-whisper {name}", "words": words}
    json.dump(out, open(key, "w"), indent=1)
    return out


def energy_align(text, e, hop):
    """Fallback when whisper is not available: known words spread over the voiced stretches by letter count."""
    toks = tokens(text)
    spans = voiced_spans(e, hop)
    if not spans or not toks:
        return [{"start": 0.0, "end": 0.0} for _ in toks]
    L = [max(2, len(t["w"])) for t in toks]
    total_v = sum(s[1] - s[0] for s in spans)
    per = total_v / sum(L)
    out, si, pos = [], 0, spans[0][0]
    for l in L:
        d = l * per
        while si < len(spans) - 1 and pos + d * 0.5 > spans[si][1]:
            si += 1; pos = max(pos, spans[si][0])
        out.append({"start": pos, "end": pos + d}); pos += d
    return out


# ---------------------------------------------------------------- one story
def line_words(sid, i, v, use_whisper):
    """Words of one voice line with line-local start/end seconds, plus how they were found."""
    path = os.path.join(BEATS, sid, v["file"])
    a = load_audio(path)
    e, hop = energy(a)
    toks = tokens(v["text"])
    method = "energy"
    times = None
    if use_whisper:
        try:
            side = os.path.join(BEATS, sid, v["file"] + ".json")
            h = json.load(open(side)).get("h") if os.path.exists(side) else hashlib.sha1(open(path, "rb").read()).hexdigest()[:12]
            tr = transcribe(path, v["text"], os.path.join(CACHE, sid, f"{v['file']}.{h}.json"))
            merged = []      # a digit token split by whisper (" 25" ",000", " 0" ".88%") is joined before it is spelled out
            for w in tr["words"]:
                if merged and re.match(r"^[,.]\d", w["w"].strip()) and re.search(r"\d$", merged[-1]["w"].strip()):
                    merged[-1] = {**merged[-1], "w": merged[-1]["w"] + w["w"].strip(), "end": w["end"]}
                else:
                    merged.append(dict(w))
            tr = {**tr, "words": merged}
            heard, owner = [], []
            for k, w in enumerate(tr["words"]):
                raw = w["w"].strip()
                parts = [p for p in re.split(r"[-\s]", raw) if p]
                exp = []
                for p in parts:
                    q = re.sub(r"[^a-z0-9.,%₹']", "", p.lower()).replace("'s", "").replace("'", "")
                    if re.search(r"\d", q):
                        exp += digits_to_words(q)
                    elif q:
                        exp.append(q.strip(".,"))
                for x in exp:
                    if x:
                        heard.append(x); owner.append(k)
            amap = align([t["w"] for t in toks], heard)
            times = []
            for ti, hj in enumerate(amap):
                if hj is None:
                    times.append(None); continue
                k = owner[hj]
                same = [x for x in range(len(owner)) if owner[x] == k]
                w = tr["words"][k]
                frac0 = same.index(hj) / len(same); frac1 = (same.index(hj) + 1) / len(same)
                times.append({"start": w["start"] + (w["end"] - w["start"]) * frac0, "end": w["start"] + (w["end"] - w["start"]) * frac1})
            # words whisper did not hear get the gap between their neighbours
            for ti in range(len(times)):
                if times[ti] is None:
                    prev = next((times[x]["end"] for x in range(ti - 1, -1, -1) if times[x]), 0.0)
                    nxt = next((times[x]["start"] for x in range(ti + 1, len(times)) if times[x]), prev)
                    times[ti] = {"start": prev, "end": max(prev, nxt), "guessed": True}
            method = tr["model"]
        except Exception as ex:      # noqa: BLE001 - any failure falls back to the energy alignment
            print(f"{sid} {v['file']}: whisper failed ({type(ex).__name__}: {ex}); energy alignment instead")
            times = None
    if times is None:
        times = energy_align(v["text"], e, hop)
    words = []
    for t, tm in zip(toks, times):
        words.append({"w": t["raw"] if not t["hy"] else t["w"], "norm": t["w"], "word": t["word"], "start": round(tm["start"], 3), "end": round(tm["end"], 3),
                      **({"guessed": True} if tm.get("guessed") else {})})
    nums = []
    F = onset_features(a)
    rs = int(math.floor(v["at"] * FPS + 0.5)) / FPS      # the line plays from frame round(at * 30), as BeatStory and LookAudio place it
    for ph in number_phrases(toks):
        ws = words[ph["i0"]]["start"]
        prev = toks[ph["i0"] - 1]["w"] if ph["i0"] > 0 else None
        prev_ws = words[ph["i0"] - 1]["start"] if ph["i0"] > 0 else None
        on, how = number_onset(F, ws, ph["words"][0], prev, prev_ws)
        nums.append({"text": " ".join(ph["words"]), "value": ph["value"], "mantissa": ph["mantissa"], "scale": ph["scale"], "kind": ph["kind"],
                     "w0": ph["i0"], "w1": ph["i1"], "whisper": round(ws, 3), "onset": round(on, 4), "rule": how["cls"], "how": how["how"],
                     "at": round(rs + on, 4), "f": math.ceil((rs + on + lock_margin(how["how"])) * FPS - 1e-6)})
    return {"file": v["file"], "at": v["at"], "sec": v["sec"], "text": v["text"], "method": method, "words": words, "numbers": nums}


def story(sid, use_whisper=True):
    D = json.load(open(os.path.join(BEATS, sid, "data.json")))
    vo = D.get("vo") or []
    lines = [line_words(sid, i, v, use_whisper) for i, v in enumerate(vo)]
    F = lambda s: int(math.floor(s * FPS + 0.5))      # Math.round, as BeatStory's F()
    out_beats = []
    said = []      # spoken numbers of earlier lines
    for bi, b in enumerate(D["beats"]):
        f0, f1 = F(b["t0"]), F(b["t1"])
        li = next((k for k, v in enumerate(vo) if b["t0"] - 0.01 <= v["at"] < b["t1"]), None)
        here = lines[li]["numbers"] if li is not None else []
        printed = []
        if b["kind"] == "fact":
            if b.get("big"):
                printed.append(("big", b["big"]))
            printed += [("bar", r["label"]) for r in b.get("bars") or []]
            printed += [("text", n["text"]) for n in printed_numbers(b.get("text"))]
        elif b["kind"] in ("spot", "say", "hook"):
            h = hero_text(b.get("lines"))
            if h:
                printed.append(("hero", h))
            for l in b.get("lines") or []:
                for n in printed_numbers(l):
                    if not h or n["text"] not in h:
                        printed.append(("line", n["text"]))
        elif b["kind"] in ("end", "mapend"):
            printed += [("q", n["text"]) for n in printed_numbers(b.get("q"))]
        used, rows = set(), []
        for role, txt in printed:
            p = first_printed(txt)
            if not p:
                continue
            hit = next((k for k, s in enumerate(here) if k not in used and matches(p, s)), None)
            if hit is None:
                hit = next((k for k, s in enumerate(here) if matches(p, s)), None)
            if hit is not None:
                if role in ("big", "hero"):
                    used.add(hit)
                rows.append({"role": role, "text": txt, "spokenF": here[hit]["f"], "word": here[hit]["text"], "how": "spoken"})
            elif any(matches(p, s) for s in said):
                rows.append({"role": role, "text": txt, "spokenF": None, "how": "said-earlier"})
            else:
                rows.append({"role": role, "text": txt, "spokenF": None, "how": "not-spoken"})
        first = here[0] if here else None
        main = next((r for r in rows if r["role"] in ("big", "hero")), None)
        if li is None:
            lockF, how, word = f0 + 6, "no-voice", None
        elif main and main["how"] == "spoken":
            lockF, how, word = main["spokenF"], "spoken", main["word"]
        elif main and main["how"] == "said-earlier":
            lockF, how, word = f0 + 6, "said-earlier", None
        elif first:
            lockF, how, word = first["f"], "first-number", first["text"]
        else:
            lockF, how, word = f0 + 6, "no-number", None
        for r in rows:
            r["lockF"] = r["spokenF"] if r["how"] == "spoken" else (f0 + 6 if r["how"] == "said-earlier" else lockF)
        out_beats.append({"i": bi, "kind": b["kind"], "f0": f0, "f1": f1, "settleF": F(b["t1"] - 0.4), "line": li, "lockF": lockF, "lockHow": how,
                          "lockWord": word, "firstNumF": first["f"] if first else None, "late": lockF > f1 - 12, "numbers": rows})
        said += here
    methods = sorted({l["method"] for l in lines})
    return {"id": sid, "fps": FPS, "made": time.strftime("%Y-%m-%d"),
            "method": " + ".join(methods) + "; each number's onset measured on the audio by its first sound (fricative run to the vowel, "
                      "stop burst, nasal / w boundary, vowel edge), pause-corrected; lock = ceil((round(at*30)/30 + onset + 10 ms after a burst, "
                      "else 25 ms) * 30)",
            "lines": lines, "beats": out_beats}


# ---------------------------------------------------------------- registry for the looks
def write_registry(ids):
    """src/looks/shared/registry.ts: word times and each config's look fields, for every story that has word_times.json."""
    have = [i for i in ids if os.path.exists(os.path.join(BEATS, i, "word_times.json")) and os.path.exists(os.path.join(BEATS, "configs", f"{i}.json"))]
    L = ["// Generated by scripts/datayt/word_times.py: measured word times and the config look fields of the stories a look can render.",
         "// Do not edit by hand; run `.venv/bin/python scripts/datayt/word_times.py` (it rewrites this file).",
         'import type {WordTimes} from "./types";']
    for i in have:
        L.append(f'import {i}_w from "../../../public/datayt/beats/{i}/word_times.json";')
        L.append(f'import {i}_c from "../../../public/datayt/beats/configs/{i}.json";')
    L.append("")
    L.append(f"export const LOOK_STORIES: string[] = {json.dumps(have)};")
    L.append("export const WORD_TIMES: Record<string, WordTimes> = {" + ", ".join(f"{i}: {i}_w as unknown as WordTimes" for i in have) + "};")
    L.append("const cfg = (c: any) => ({look: c.look as string | undefined, brand: c.brand as string | undefined, look_opts: c.look_opts as Record<string, unknown> | undefined});")
    L.append("export const CONFIG_LOOK: Record<string, {look?: string; brand?: string; look_opts?: Record<string, unknown>}> = {" + ", ".join(f"{i}: cfg({i}_c)" for i in have) + "};")
    L.append("")
    path = os.path.join(ROOT, "src/looks/shared/registry.ts")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write("\n".join(L))
    return have


def onset_summary(stories):
    """How each spoken number's onset was found, and how far whisper's start was from it."""
    nums = [n for S in stories.values() for l in S["lines"] for n in l["numbers"]]
    by = {}
    for n in nums:
        by[f"{n['rule']}/{n['how']}"] = by.get(f"{n['rule']}/{n['how']}", 0) + 1
    d = sorted(1000 * (n["onset"] - n["whisper"]) for n in nums)
    return {"numbers": len(nums), "rules": dict(sorted(by.items())),
            "onset_minus_whisper_ms": {"min": round(d[0]), "median": round(d[len(d) // 2]), "max": round(d[-1]),
                                       "over_100ms_early": sum(1 for x in d if x <= -100), "over_100ms_late": sum(1 for x in d if x >= 100)}} if d else {}


CHECKED = os.path.join(os.path.dirname(os.path.abspath(__file__)), "word_onsets_checked.json")


def check_against(stories, path=CHECKED):
    """Compare every lock frame with onsets read by eye off spectrograms (word_onsets_checked.json: '<id>|<line>|<word index>' ->
    onset s, line-local, plus alternate readings where another boundary is defensible). Returns (rows, failures): a failure is a
    lock outside 0-3 frames after the reading. 'frames_after' lists the reading, then the alternate."""
    J = json.load(open(path))
    ref, alt = J["onsets"], J.get("alternates", {})
    rows, bad = [], []
    for key, t0 in ref.items():
        ts = [t0] + ([alt[key]["s"]] if key in alt else [])
        sid, li, w0 = key.split("|")
        if sid not in stories:
            continue
        ln = stories[sid]["lines"][int(li)]
        n = next((x for x in ln["numbers"] if x["w0"] == int(w0)), None)
        if n is None:
            bad.append((key, "number not found")); continue
        rs = int(math.floor(ln["at"] * FPS + 0.5)) / FPS
        ds = [round(n["f"] - (rs + t) * FPS, 2) for t in ts]
        lock = any(b["lockF"] == n["f"] and b["line"] == int(li) and b["lockHow"] == "spoken" for b in stories[sid]["beats"])
        rows.append({"key": key, "text": n["text"], "lock_f": n["f"], "frames_after": ds, "beat_lock": lock})
        if not (0 <= ds[0] <= 3):
            bad.append((key, ds))
    return rows, bad


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ids = args or SCOPE
    use_whisper = "--energy" not in sys.argv
    done = {}
    for sid in ids:
        t = time.time()
        S = story(sid, use_whisper)
        json.dump(S, open(os.path.join(BEATS, sid, "word_times.json"), "w"), indent=1, ensure_ascii=False)
        done[sid] = S
        locks = ", ".join(f"{b['kind']}@{b['lockF']}({b['lockHow']})" for b in S["beats"])
        print(f"{sid}: {len(S['lines'])} lines, {time.time() - t:.0f} s · {S['method']} · {locks}", flush=True)
    reg = write_registry(sorted(set(SCOPE) | set(ids)))
    print(f"registry: {len(reg)} stories -> src/looks/shared/registry.ts")
    if "--spot" in sys.argv or "--check" in sys.argv:
        print(json.dumps(onset_summary(done), ensure_ascii=False))
    if "--check" in sys.argv and os.path.exists(CHECKED):
        rows, bad = check_against(done)
        d = sorted(r["frames_after"][0] for r in rows)
        dl = sorted(r["frames_after"][0] for r in rows if r["beat_lock"])
        print(f"checked: {len(rows)} numbers ({len(dl)} beat locks) against {os.path.basename(CHECKED)}; lock - onset "
              f"min {d[0]:.2f}, median {d[len(d) // 2]:.2f}, max {d[-1]:.2f} frames; beat locks min {dl[0]:.2f}, max {dl[-1]:.2f}")
        for r in rows:
            if len(r["frames_after"]) > 1:
                print(f"  alternate reading {r['key']} {r['text']!r}: lock {r['frames_after'][0]:+.2f} frames after the reading, "
                      f"{r['frames_after'][1]:+.2f} after the alternate")
        for k, v in bad:
            print("  OUTSIDE", k, v)
        if bad:
            sys.exit(1)
