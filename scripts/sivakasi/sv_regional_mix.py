"""Regional tracks (hi, ta, te) for the Sivakasi films: voice track + the same CC0 music bed (ducked) and sound effects as the English cut.
Outputs per film: out/sivakasi/audio/<film>_<lang>_DRAFT.m4a and one multi-audio mp4 (video copied, tracks: English, Hindi, Tamil, Telugu).
  python3 sv_regional_mix.py paradox longroad     (run with the DataKadai .venv python: needs numpy)"""
import json, os, subprocess, sys, wave
import numpy as np
sys.path.insert(0, "/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp/scripts/datayt")
import tiruppur_music as TM
R = "/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks/voice"; LIB = TM.LIB; FF = TM.FF; OUT = "/Volumes/DarwinSSD/MMVideo/out/sivakasi"; TP = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp"
FILMS = {"paradox": ("paradox_v1", "music_06_curious_ambience_reg1n0ld.wav"), "longroad": ("long_road_v1", "music_07_strings_with_percussion_buythefield.wav")}
SFX = {"thump": ("sfx_thump_stamp_mpuffenbarger.wav", 0.55), "whoosh": ("sfx_whoosh_deep_kinoton.wav", 0.35), "pop": ("sfx_pop_conarb13.wav", 0.30), "ding": ("sfx_coin_ding_greenvwbeetle.wav", 0.22)}
LANGS = [("hi", "hin", "Hindi"), ("ta", "tam", "Tamil"), ("te", "tel", "Telugu")]
def dec(path, sr):
    tmp = "/tmp/sv_dec2.wav"; subprocess.run([FF, "-v", "error", "-y", "-i", path, "-ar", str(sr), "-ac", "2", "-c:a", "pcm_s16le", tmp], check=True); return TM.read(tmp)[1]
os.makedirs(f"{OUT}/audio", exist_ok=True)
for film in (sys.argv[1:] or FILMS):
    name, bed = FILMS[film]; d = json.load(open(f"/Volumes/DarwinSSD/MMVideo/src/sivakasi/data/{film}.json")); fps = d["fps"]; cues = []
    for a in d["acts"]:
        cues += [(s["frame"], s["name"]) for s in a["sfx"]]
        if a["scene"] == "Chain":
            p = a["p"]
            for i, b in enumerate(p.get("litAt", [])):
                if b >= 0: cues.append((a["from"] + a["spans"][min(b, len(a["spans"]) - 1)]["s"] + 6 + i * p.get("stagger", 0), "pop"))
    streams = []
    for lang, iso, label in LANGS:
        voice = f"{R}/{name}/tracks/{name}_{lang}_DRAFT.wav"
        if not os.path.exists(voice): print("skip", film, lang, "(no fitted track)"); continue
        mus = f"{R}/{name}/tracks/{name}_{lang}_DRAFT_music.wav"; TM.mix(voice, f"{LIB}/{bed}", mus)
        sr, x = TM.read(mus); x = x.copy()
        for fr, nm in cues:
            f, g = SFX[nm]; fx = dec(f"{LIB}/{f}", sr)[: sr * 2] * g; i = int(fr / fps * sr); j = min(len(x), i + len(fx))
            if i < len(x): x[i:j] += fx[: j - i]
        pk = np.max(np.abs(x)); x = x * (0.97 / pk) if pk > 0.97 else x
        fin = f"{R}/{name}/tracks/{name}_{lang}_DRAFT_final.wav"; w = wave.open(fin, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
        m4a = f"{OUT}/audio/sivakasi-{film}-{lang}-DRAFT.m4a"
        subprocess.run(["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", fin, "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-f", "mp4", m4a], check=True, cwd=TP)
        streams.append((lang, iso, label, m4a)); print(film, lang, "->", m4a, round(len(x) / sr, 1), "s")
    if streams:
        video = f"{OUT}/sivakasi-{film}-60fps.mp4"; outp = f"{OUT}/sivakasi-{film}-60fps-multiaudio.mp4"
        cmd = ["npx", "remotion", "ffmpeg", "-v", "error", "-y", "-i", video] + sum([["-i", m] for *_, m in streams], []) + ["-map", "0:v", "-map", "0:a"] + sum([["-map", f"{i + 1}:a"] for i in range(len(streams))], [])
        cmd += ["-c", "copy", "-metadata:s:a:0", "language=eng", "-metadata:s:a:0", "title=English"]
        for i, (lang, iso, label, _) in enumerate(streams): cmd += [f"-metadata:s:a:{i + 1}", f"language={iso}", f"-metadata:s:a:{i + 1}", f"title={label} (DRAFT)"]
        cmd += ["-disposition:a:0", "default", "-movflags", "+faststart", outp]; subprocess.run(cmd, check=True, cwd=TP); print("wrote", outp)
