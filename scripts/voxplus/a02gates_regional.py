#!/usr/bin/env python3
"""a02gates regional audio (Hindi, Tamil, Telugu), Gemini TTS (29 Oct 2026). Run inside zsh -lic on the Mini; the key comes from
$GEMINI_API_KEY and is sent only as the x-goog-api-key header, never in a URL, never printed.
  a02gates_regional.py one LANG KEY     voice one beat (test)
  a02gates_regional.py all LANG         voice every beat not yet voiced -> regional/<lang>/<k>_g.wav + fit_raw.json
Translations: contentengine/drafts/2026-10-29/_video/regional/a02gates.<lang>.json, copied to public/voxplus/a02gates/regional/.
English timing: public/voxplus/a02gates/vo/timeline.json. Gemini returns raw PCM s16le 24 kHz mono; ffmpeg wraps it as WAV."""
import base64, json, os, pathlib, re, subprocess, sys, time, urllib.request, urllib.error
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); P = R / "public/voxplus/a02gates"; FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
MODEL = os.environ.get("A02_TTS_MODEL", "gemini-3.8-flash-tts"); VOICE = "Charon"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
PROMPT = "### DIRECTOR'S NOTES\n{style}\n\n### TRANSCRIPT\n{text}"
STYLE = os.environ.get("A02_STYLE", "Style: calm, clear documentary narrator. Pace: brisk news-reader pace, short pauses between sentences. Speak only the transcript.")
LOG = []


def tts(text, out):
    body = json.dumps({"contents": [{"parts": [{"text": PROMPT.format(style=STYLE, text=text)}]}],
                       "generationConfig": {"responseModalities": ["AUDIO"],
                                            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}).encode()
    for att in range(6):
        req = urllib.request.Request(URL, body, {"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=180))
            part = r["candidates"][0]["content"]["parts"][0]["inlineData"]
            pcm = out.with_suffix(".pcm"); pcm.write_bytes(base64.b64decode(part["data"]))
            subprocess.run([FF, "-v", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", str(pcm), str(out)], check=True)
            pcm.unlink(); return att
        except urllib.error.HTTPError as e:
            msg = " ".join(e.read().decode().split())[:200];
            if e.code == 400: raise SystemExit("HTTP 400 " + msg)
            if e.code == 429: raise SystemExit("HTTP 429 (quota): stopping, no retry, no model switch. " + msg.replace(os.environ["GEMINI_API_KEY"], "***"))
            wait = 20 * (att + 1) if e.code == 429 else 5 * (att + 1)
            print("HTTP", e.code, msg.replace(os.environ["GEMINI_API_KEY"], "***"), "retry in", wait, "s", flush=True); LOG.append(e.code); time.sleep(wait)
        except (KeyError, IndexError, urllib.error.URLError, TimeoutError) as e:
            print("bad reply", type(e).__name__, "retry", flush=True); LOG.append(type(e).__name__); time.sleep(5 * (att + 1))
    raise SystemExit("gemini tts failed repeatedly; stopping")


def dur(p):
    e = subprocess.run([FF, "-hide_banner", "-i", str(p), "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"time=(\d+):(\d+):([\d.]+)", e)[-1]; return int(m[0]) * 3600 + int(m[1]) * 60 + float(m[2])


if __name__ == "__main__":
    mode, lang = sys.argv[1], sys.argv[2]
    T = json.load(open(P / f"regional/a02gates.{lang}.json")); TL = json.load(open(P / "vo/timeline.json"))
    o = P / f"regional/{lang}"; o.mkdir(parents=True, exist_ok=True)
    keys = [sys.argv[3]] if mode == "one" else TL["order"]
    fp = o / "fit_raw.json"; rep = json.loads(fp.read_text()) if fp.exists() else {}
    for k in keys:
        f = o / f"{k}_g.wav"; src = T[k]["tts"]
        if f.exists() and rep.get(k, {}).get("tts") == src:
            continue
        retries = tts(src, f); d = dur(f); slot = TL["dur"][k] + 0.2
        rep[k] = {"slot": round(slot, 2), "raw": round(d, 2), "need": round(d / slot, 3), "retries": retries, "model": MODEL, "voice": VOICE, "tts": src}
        print(lang, k, {x: rep[k][x] for x in ("slot", "raw", "need", "retries")}, flush=True)
        fp.write_text(json.dumps(rep, indent=1, ensure_ascii=False))
    print("http errors this run:", LOG or "none")
