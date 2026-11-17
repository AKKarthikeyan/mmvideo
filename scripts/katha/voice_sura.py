#!/usr/bin/env python3
"""Voice the Surasamharam film: one clip per beat per language, public/katha/sura/<lang>/<key>.(mp3|wav) (not in git),
and the measured lengths in public/katha/sura/voice.json (in git), which build_sura.py reads to time the picture.

  python3 scripts/katha/voice_sura.py en                       # English: MiniMax (the house narrator)
  SURA_TTS_CMD='<maya command> --lang {lang} --text-file {text} --out {out}' \
      python3 scripts/katha/voice_sura.py ta hi te --force     # Tamil, Hindi, Telugu: Maya (AK, 17 Nov 2026)
  python3 scripts/katha/voice_sura.py ta --clips ~/maya/ta     # or recorded / exported clips: b01.wav ... b20.wav
  python3 scripts/katha/voice_sura.py lines ta                 # print the lines to voice, one per beat

AK, 17 Nov 2026: "Use Maya for Tamil, Hindi, Telugu." Maya is AK's local voice and lives on his machine (as in
docs/SHORTS_BENCHMARKS.md), so the cloud session cannot run it. A local command gets {text} (a UTF-8 text file),
{out} (a .wav to write) and {lang} (ta, hi or te); SURA_TTS_CMD_TA / _HI / _TE override it per language.
Without a local command or clips, Tamil and Hindi fall back to MiniMax as a stand-in (marked "minimax" in voice.json);
Telugu has no stand-in (MiniMax refuses Telugu).
English comes from build_sura.py; Tamil, Hindi and Telugu from docs/briefs/IC_SURASAMHARAM_NARRATION_TA_HI_TE.md
(written for each listener, not translated line by line; a native speaker must check them before upload).
The MiniMax key is never read here: in the cloud session the network proxy adds it; on the Mini set MINIMAX_API_KEY."""
import json, os, re, sys, time, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import build_sura
OUT = ROOT / "public/katha/sura"
VOICE = {  # MiniMax has native Hindi voices; Tamil uses the house narrator with a language boost (as audio_tracks.py does).
    # Telugu cannot be voiced here: the service rejects language_boost "Telugu" (16 Nov 2026).
    "en": dict(voice_id="English_Diligent_Man", speed=0.94, boost="English"),
    "hi": dict(voice_id="hindi_male_1_v2", speed=1.06, boost="Hindi"),
    "ta": dict(voice_id="English_Diligent_Man", speed=0.94, boost="Tamil"),
}
HEAD = {"ta": "## Tamil", "hi": "## Hindi", "te": "## Telugu"}
def lines(lang):
    return {k: v for k, v in build_sura.narration(lang).items() if v}
def local_cmd(lang):
    return os.environ.get("SURA_TTS_CMD_" + lang.upper()) or os.environ.get("SURA_TTS_CMD")
def tts_local(cmd, text, path, lang):
    txt = path.with_suffix(".txt"); txt.write_text(text, encoding="utf-8"); raw = path.with_suffix(".raw.wav")
    r = subprocess.run(cmd.format(text=str(txt), out=str(raw), lang=lang), shell=True)
    if r.returncode != 0 or not raw.exists(): raise SystemExit(f"local voice command failed for {lang} {path.name}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-ac", "1", "-ar", "44100", str(path)], check=True)
    raw.unlink(); txt.unlink()
def tts(text, path, v):
    import requests
    key = os.environ.get("MINIMAX_API_KEY", "proxy-injected")
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": v["boost"],
            "voice_setting": {"voice_id": v["voice_id"], "speed": v["speed"], "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=180).json()
        if (j.get("data") or {}).get("audio"):
            path.write_bytes(bytes.fromhex(j["data"]["audio"])); return
        print("  retry", path.name, j.get("base_resp")); time.sleep(15 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)
def length(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).decode())
def main():
    args = sys.argv[1:]; force = "--force" in args; clips = None
    if "--clips" in args: i = args.index("--clips"); clips = pathlib.Path(args[i + 1]).expanduser(); args = args[:i] + args[i + 2:]
    if args and args[0] == "lines":
        for lang in [a for a in args[1:] if a in ("en", "ta", "hi", "te")]:
            for key, text in lines(lang).items(): print(f"{lang} {key}\t{text}")
        return
    langs = [a for a in args if a in ("en", "ta", "hi", "te")] or ["en"]
    vj = OUT / "voice.json"; V = json.loads(vj.read_text()) if vj.exists() else {}
    for lang in langs:
        d = OUT / lang; d.mkdir(parents=True, exist_ok=True); V.setdefault(lang, {})
        cmd = local_cmd(lang) if lang != "en" else None
        engine = "clips" if clips else ("maya" if cmd else ("minimax" if lang in VOICE else None))
        if engine is None: print(f"{lang}: no voice. Run on the machine with Maya (SURA_TTS_CMD) or pass --clips"); continue
        for key, text in lines(lang).items():
            old = V[lang].get(key, {})
            if not force and old.get("text") == text and old.get("engine", "minimax") == engine and old.get("file") and (d / old["file"]).exists(): continue
            for f in d.glob(f"{key}.*"): f.unlink()
            if clips:
                hit = [f for ext in ("wav", "mp3", "m4a", "flac") for f in [clips / f"{key}.{ext}"] if f.exists()]
                if not hit: raise SystemExit(f"{lang}: no clip for {key} in {clips}")
                p = d / f"{key}.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(hit[0]), "-ac", "1", "-ar", "44100", str(p)], check=True)
            elif cmd: p = d / f"{key}.wav"; tts_local(cmd, text, p, lang)
            else: p = d / f"{key}.mp3"; tts(text, p, VOICE[lang])
            V[lang][key] = dict(sec=round(length(p), 2), text=text, engine=engine, file=p.name)
            print(f"  {lang} {key} {V[lang][key]['sec']:6.2f}s  {engine}"); vj.write_text(json.dumps(V, ensure_ascii=False, indent=1))
        print(f"{lang}: {len(V[lang])} beats, {sum(x['sec'] for x in V[lang].values()):.0f}s of voice ({engine})")
if __name__ == "__main__": main()
