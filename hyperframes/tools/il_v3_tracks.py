"""India Ledger gold V3: Hindi, Tamil and Telugu audio tracks for YouTube's multi-language audio (picture unchanged).

usage: python3 hyperframes/tools/il_v3_tracks.py <hi|ta|te> [--voice <sarvam speaker>]
Reads videos/il-gold-v3/act.js (English beat times) and docs/india_ledger/il-gold-v3.<lang>.json (the translation).
Voices each beat with Sarvam Bulbul v3 (scripts/audio_tracks.tts_sarvam), raises pace only as far as the language allows,
starts each line at the English beat's time (or just after the previous line, never more than MAX_LATE late),
and writes out/audio/il-gold-v3/il-gold-v3_<lang>_<voice>_DRAFT.{wav,m4a} at the film's exact length, plus a report.
DRAFT until a native speaker approves ("reviewed_by" in the translation file).
"""
import hashlib, json, re, subprocess, sys, wave
from pathlib import Path

import numpy as np

ROOT = Path("/Volumes/DarwinSSD/MMVideo")
sys.path.insert(0, str(ROOT / "scripts"))
import audio_tracks as AT   # noqa: E402

AT.PROVIDER = "sarvam"
VID = "il-gold-v3"
PROJ = ROOT / "hyperframes" / "videos" / VID
TAIL = 3.5                    # end-card hold after the voice (same as the English mux)
SR = AT.SR
GAP = 0.12                    # least silence between two lines
MAX_LATE = 1.0                # a line may start at most this late against the English beat
LANG = {"hi": {"name": "Hindi", "pace_max": 1.2, "voice": "shubh"},
        "ta": {"name": "Tamil", "pace_max": 1.12, "voice": "vijay"},
        "te": {"name": "Telugu", "pace_max": 1.15, "voice": "shubh"}}


def pcm(mp3):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp3), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    nz = np.flatnonzero(np.abs(a) > 0.01)            # trim the silence Sarvam leaves at both ends
    return a[max(0, nz[0] - int(0.03 * SR)): nz[-1] + int(0.08 * SR)] if len(nz) else a


def main():
    lang = sys.argv[1]
    L = LANG[lang]
    voice = sys.argv[sys.argv.index("--voice") + 1] if "--voice" in sys.argv else L["voice"]
    act = json.loads(re.sub(r"^window.ACT = |;\s*$", "", (PROJ / "act.js").read_text()))
    T = json.loads((ROOT / "docs" / "india_ledger" / f"{VID}.{lang}.json").read_text())
    tr = T["beats"]
    beats = act["beats"]; total = act["dur"] + TAIL
    miss = [b["id"] for b in beats if not tr.get(b["id"], "").strip()]
    if miss:
        sys.exit(f"no translation for {miss}")
    out = ROOT / "out" / "audio" / VID; cache = out / "cache" / f"{lang}_{voice}"; cache.mkdir(parents=True, exist_ok=True)
    buf = np.zeros(int(total * SR) + SR, dtype=np.float32)
    end_prev, report, bad = 0.0, [], []
    for i, b in enumerate(beats):
        text = tr[b["id"]].strip()
        nxt = beats[i + 1]["t0"] if i + 1 < len(beats) else total - 0.3
        slot = nxt - b["t0"] - 0.15
        pace, a = 1.0, None
        for _ in range(4):
            mp3 = cache / (b["id"] + "_" + hashlib.md5(f"{text}|{voice}|{pace}".encode()).hexdigest()[:8] + ".mp3")
            AT.tts_sarvam(text, voice, lang, pace, mp3)
            a = pcm(mp3); sec = len(a) / SR
            if sec <= slot or pace >= L["pace_max"]:
                break
            pace = min(L["pace_max"], round(pace * sec / slot * 1.03, 2))
        start = max(b["t0"], end_prev + GAP)
        late = start - b["t0"]
        end = start + sec
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
                       "late": round(late, 2), "sec": round(sec, 2), "slot": round(slot, 2), "pace": pace, "status": status})
        print(f"  {b['id']:<13} slot {slot:5.2f}  voice {sec:5.2f}  pace {pace:.2f}  late {late:4.2f}  {status}")
    buf = buf[: int(round(total * SR))]
    reviewed = bool(T.get("reviewed_by"))
    name = f"{VID}_{lang}_{voice}" + ("" if reviewed else "_DRAFT")
    raw = out / (name + ".raw.wav")
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
    wav, m4a = out / (name + ".wav"), out / (name + ".m4a")
    norm = "loudnorm=I=-16:TP=-1.5:LRA=11"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", norm, "-ar", "48000", "-t", f"{total:.3f}", str(wav)], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-c:a", "aac", "-b:a", "192k", str(m4a)], check=True)
    raw.unlink()
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)],
                               capture_output=True, text=True).stdout)
    json.dump({"video": VID, "lang": lang, "voice": voice, "provider": "sarvam bulbul:v3", "reviewed_by": T.get("reviewed_by"),
               "film_sec": round(total, 2), "track_sec": round(dur, 2), "problems": bad, "beats": report},
              open(out / (name + "_report.json"), "w"), indent=1, ensure_ascii=False)
    print(f"\n{m4a}\nfilm {total:.2f}s, track {dur:.2f}s {'MATCH' if abs(dur - total) < 0.1 else 'MISMATCH'}; problems: {bad or 'none'}")


if __name__ == "__main__":
    main()
