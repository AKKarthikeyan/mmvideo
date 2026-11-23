"""India Ledger Episode 2: Hindi, Tamil and Telugu audio tracks in Maya-2-Native, voice Siddhant (AK 20 Nov 2026: all three).

Audio only, for YouTube's extra audio tracks. The picture and the English video stay as they are.
usage (on the Mini, inside zsh -lc so ffmpeg is on PATH):
  /Volumes/DarwinSSD/DataKadai/research/2026-10-28-voices/work/mayavenv/bin/python hyperframes/tools/il_v3_maya.py <hi|ta|te>
Model aruntemme/maya2-native-mlx-8bit, run locally with mlx-audio (no key). Text = docs/india_ledger/il-gold-ep2.<lang>.json.
Each beat: up to TAKES takes, keep the shortest that did not skip words; trim edge silence; speed up with atempo only as far as
MAX_TEMPO to fit the English beat slot; start at the English beat time (or just after the previous line).
Writes out/audio/il-gold-v3/il-gold-v3_<lang>_maya-siddhant_DRAFT.{wav,m4a} + _report.json (same report shape as il_v3_tracks.py).
"""
import hashlib, json, os, re, subprocess, sys, wave
from pathlib import Path

import numpy as np

ROOT = Path("/Volumes/DarwinSSD/MMVideo")
VID = "il-gold-ep2"
PROJ = ROOT / "hyperframes" / "videos" / VID
MODEL, VOICE, TAG = "aruntemme/maya2-native-mlx-8bit", "Siddhant", "maya-siddhant"
SR = 24000
TAIL, GAP, MAX_LATE, MAX_TEMPO = 3.5, 0.12, 1.0, 1.12
TAKES = int(os.environ.get("IL_TAKES", 2))


def wav_write(p, a, sr=SR):
    a = np.clip(np.asarray(a, dtype=np.float64).reshape(-1), -1, 1)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((a * 32767).astype(np.int16).tobytes())


def wav_read(p):
    with wave.open(str(p)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


def trim(a):
    nz = np.flatnonzero(np.abs(a) > 0.01)
    return a[max(0, nz[0] - int(0.03 * SR)): nz[-1] + int(0.08 * SR)] if len(nz) else a


def tempo(a, f, tmp):
    if f <= 1.0005:
        return a
    i, o = tmp.with_suffix(".in.wav"), tmp.with_suffix(".out.wav")
    wav_write(i, a)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(i), "-af", f"atempo={f:.4f}", str(o)], check=True)
    b = wav_read(o); i.unlink(); o.unlink()
    return b


def main():
    lang = sys.argv[1]
    act = json.loads(re.sub(r"^window.ACT = |;\s*$", "", (PROJ / "act.js").read_text()))
    T = json.loads((ROOT / "docs" / "india_ledger" / f"{VID}.{lang}.json").read_text())
    tr, beats = T["beats"], act["beats"]
    total = act["dur"] + TAIL
    miss = [b["id"] for b in beats if not tr.get(b["id"], "").strip()]
    if miss:
        sys.exit(f"no translation for {miss}")
    out = ROOT / "out" / "audio" / VID
    cache = out / "cache" / f"{lang}_{TAG}"; cache.mkdir(parents=True, exist_ok=True)

    # 1. voice every beat (cached by text)
    model = None
    raw = {}
    for b in beats:
        text = tr[b["id"]].strip()
        p = cache / (b["id"] + "_" + hashlib.md5(f"{text}|{VOICE}".encode()).hexdigest()[:8] + ".wav")
        if not p.exists():
            if model is None:
                from mlx_audio.tts.utils import load
                model = load(MODEL); print("model loaded", flush=True)
            takes = [trim(np.concatenate([np.array(r.audio).reshape(-1) for r in model.generate(text, voice=VOICE, lang_code=lang)]))
                     for _ in range(TAKES)]
            # a take far shorter than the others probably skipped words: keep the shortest within 85% of the longest
            longest = max(len(t) for t in takes)
            best = min((t for t in takes if len(t) >= 0.85 * longest), key=len)
            wav_write(p, best)
            print(f"  voiced {b['id']:<13} takes {[round(len(t) / SR, 1) for t in takes]}", flush=True)
        raw[b["id"]] = (text, trim(wav_read(p)))

    # 2. fit and place
    buf = np.zeros(int(total * SR) + SR, dtype=np.float32)
    end_prev, report, bad = 0.0, [], []
    for i, b in enumerate(beats):
        text, a = raw[b["id"]]
        nxt = beats[i + 1]["t0"] if i + 1 < len(beats) else total - 0.3
        slot = nxt - b["t0"] - 0.15
        need = len(a) / SR / slot
        f = min(max(need, 1.0), MAX_TEMPO)
        a = tempo(a, f, cache / "_tmp")
        sec = len(a) / SR
        start = max(b["t0"], end_prev + GAP); late = start - b["t0"]; end = start + sec
        status = "ok"
        if late > MAX_LATE:
            status = "LATE"
        if i + 1 < len(beats) and end > nxt + MAX_LATE:
            status = "TOO LONG"
        if end > total - 0.2:
            status = "PAST END"
        if status != "ok":
            bad.append(b["id"])
        s0 = int(start * SR); buf[s0: s0 + len(a)] += a
        end_prev = end
        report.append({"id": b["id"], "english": b["say"], "text": text, "eng_t0": b["t0"], "start": round(start, 2),
                       "late": round(late, 2), "sec": round(sec, 2), "slot": round(slot, 2), "tempo": round(f, 3), "status": status})
        print(f"  {b['id']:<13} slot {slot:5.2f}  voice {sec:5.2f}  tempo {f:.2f}  late {late:4.2f}  {status}")
    buf = buf[: int(round(total * SR))]
    name = f"{VID}_{lang}_{TAG}" + ("" if T.get("reviewed_by") else "_DRAFT")
    rawp = out / (name + ".raw.wav"); wav_write(rawp, buf)
    wav, m4a = out / (name + ".wav"), out / (name + ".m4a")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(rawp), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000",
                    "-t", f"{total:.3f}", str(wav)], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-c:a", "aac", "-b:a", "192k", str(m4a)], check=True)
    rawp.unlink()
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
                               capture_output=True, text=True).stdout)
    json.dump({"video": VID, "lang": lang, "voice": VOICE, "provider": MODEL + " (local, mlx-audio)", "reviewed_by": T.get("reviewed_by"),
               "film_sec": round(total, 2), "track_sec": round(dur, 2), "problems": bad, "beats": report},
              open(out / (name + "_report.json"), "w"), indent=1, ensure_ascii=False)
    print(f"\n{m4a}\nfilm {total:.2f}s, track {dur:.2f}s {'MATCH' if abs(dur - total) < 0.1 else 'MISMATCH'}; problems: {bad or 'none'}")


if __name__ == "__main__":
    main()
