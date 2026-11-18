#!/usr/bin/env python3
"""report JSON(s) from a01v4_regional.py build -> a01v4_<lang>_DRAFT_report.md (per-beat slot, voice length, speed, status)."""
import json, sys
from pathlib import Path

for p in sys.argv[1:]:
    d = json.load(open(p)); lang = {"hi": "Hindi", "ta": "Tamil"}[d["lang"]]
    L = [f"# A01 v4 {lang} track: per-beat report (DRAFT)", "",
         f"Voice: {d['provider']} `{d['voice']}`. Composition `{d['composition']}` at {d['fps']} fps, {d['frames']} frames = "
         f"{d['expected_sec']} s. Track: wav {d['wav_sec']} s, m4a {d['m4a_sec']} s. Loudness {d['integrated_lufs']} LUFS integrated, "
         f"true peak {d['true_peak_dbfs']} dBFS. Built {d['built']}. reviewed_by: {d['reviewed_by']}.", ""]
    vc = d.get("video_check")
    L.append(f"Length check against the English master: **{vc['result']}** ({vc['video']}: {vc['video_frames']} frames at {vc['video_fps']} fps "
             f"vs track {vc['track_frames']} frames)." if vc else "Length check against the English master: not run (no final mp4 given).")
    L += ["", f"Too long: {', '.join(d['too_long']) or 'none'}. Slot = time until the next English beat starts, minus 0.15 s. "
          "Speed = TTS speed used (cap: Tamil 1.06, Hindi 1.15). Takes = TTS calls at the final speed (the shortest take is kept).", "",
          "| Beat | Start (s) | English (s) | Slot (s) | Voice (s) | Speed | Takes | Status |", "|---|---|---|---|---|---|---|---|"]
    for b in d["beats"]:
        L.append(f"| {b['key']} | {b['start_s']:.2f} | {b['english_sec']:.2f} | {b['slot_sec']:.2f} | {b['voice_sec']:.2f} | {b['speed']:.2f} | "
                 f"{b.get('takes', 1)} | {b['status']} |")
    tot_v = sum(b["voice_sec"] for b in d["beats"]); tot_e = sum(b["english_sec"] for b in d["beats"])
    L += ["", f"Voice total {tot_v:.1f} s vs English narration {tot_e:.1f} s. Speeds: "
          + ", ".join(f"{s:.2f}x x{n}" for s, n in sorted(__import__('collections').Counter(round(b['speed'], 2) for b in d['beats']).items())), ""]
    out = Path(p).with_name(Path(p).name.replace("_report.json", "_report.md"))
    out.write_text("\n".join(L) + "\n"); print(out)
