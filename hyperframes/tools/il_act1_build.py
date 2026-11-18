"""India Ledger style test: Act 1 of the gold episode (docs/INDIA_LEDGER_EP1_SCRIPT.md), voiced and timed to the voice.

usage:
  python3 hyperframes/tools/il_act1_build.py              voice the act in paragraphs, write videos/il-gold-act1/act.js
  python3 hyperframes/tools/il_act1_build.py verify       transcribe the voice track and list any script word not heard
  python3 hyperframes/tools/hf.py sync il-gold-act1 && python3 hyperframes/tools/hf.py render il-gold-act1
  python3 hyperframes/tools/il_act1_build.py mux          -> out/hyperframes/il-gold-act1-final.mp4 (voice only, no music)
Every number on screen comes from scripts/india_ledger_gold.py, so the picture cannot disagree with the data.
"""
import contextlib
import io
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import india_ledger_gold as G  # noqa: E402
import shorts_build as SB      # noqa: E402  (tts, pcm, write_wav, bed, mux, SR)

ID = "il-gold-act1"
PROJ = ROOT / "hyperframes" / "videos" / ID
ADIR = SB.OUT / "shorts_audio" / ID
VOICE_ID = "English_Diligent_Man"      # the account's Indian-accent English voice: says lakh and crore the Indian way
SPEED = 0.94                           # a touch slower than default, for weight
PARA_GAP = 0.55                        # silence between paragraphs, seconds

# Act 1, voiced as five paragraphs so the intonation flows from sentence to sentence (AK, 18 Nov: "complete the
# sentence properly, with emotional flow"). Each paragraph is one TTS call with one emotion; <#s#> is a pause of s
# seconds inside it. Scenes in index.html hang off the beat ids.
PARAS = [
    (None, [("hook", "How do you lose money… on gold that only went up?"),
            ("way", "<#0.7#>The Government of India found a way.")]),
    ("happy", [("bet", "Back in twenty fifteen, it made a bet. Against your mother."),
               ("ask", "<#0.45#>It asked her to hand over her gold."),
               ("no", "<#0.35#>She said no."),
               ("paper", "<#0.6#>So it sold her paper gold instead.")]),
    (None, [("owes", "Today, it owes about one point six lakh crore rupees on that paper."),
            ("not", "<#0.6#>Not because anyone stole it. Not because gold crashed."),
            ("up", "<#0.5#>Gold went up. And that is exactly why it lost.")]),
    ("surprised", [("week", "And this isn't history. Just last week, one batch of these bonds paid back four point four times what people paid for it."),
                   ("call", "<#0.45#>And holders of the older bonds can cash in about eighty thousand crore rupees more, whenever they choose.")]),
    (None, [("next", "So how did all this happen? Let's start with a number almost nobody has seen.")]),
]


def say_of(text):
    return re.sub(r"<#[0-9.]+#>", "", text).strip()


def tts_para(text, emotion, path):
    """One MiniMax call for a whole paragraph; returns sentence timings (seconds) from its subtitle file."""
    import hashlib
    import requests
    key = hashlib.sha1(f"{VOICE_ID}|{SPEED}|{emotion}|{text}".encode()).hexdigest()[:10]
    mp3, sub = path.with_name(f"{path.stem}-{key}.mp3"), path.with_name(f"{path.stem}-{key}.json")
    if not (mp3.exists() and sub.exists()):
        vs = {"voice_id": VOICE_ID, "speed": SPEED, "vol": 1, "pitch": 0}
        if emotion:
            vs["emotion"] = emotion
        body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English", "subtitle_enable": True,
                "voice_setting": vs, "audio_setting": {"sample_rate": SB.SR, "bitrate": 128000, "format": "mp3", "channel": 1}}
        key = __import__("os").environ.get("MINIMAX_API_KEY", "proxy-injected")   # Mac Mini: set MINIMAX_API_KEY
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"},
                          json=body, timeout=180).json()
        d = j.get("data") or {}
        if not d.get("audio"):
            sys.exit(f"MiniMax failed: {j.get('base_resp')}")
        mp3.write_bytes(bytes.fromhex(d["audio"]))
        sub.write_text(requests.get(d["subtitle_file"], timeout=60).text, encoding="utf-8")
    return mp3, json.loads(sub.read_text(encoding="utf-8"))


def decode(mp3):
    """The whole paragraph, untrimmed except for leading silence, so no sentence loses its ending."""
    raw = __import__("subprocess").run(["ffmpeg", "-v", "error", "-i", str(mp3), "-f", "s16le", "-ac", "1", "-ar", str(SB.SR), "-"],
                                       capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        imp = G.imports()
        sgb = G.sgb_model()
    t = sgb["tranches"]
    s3 = t[t.tranche.str.contains("2018-19 Series III")].iloc[0]
    return {
        "price": [[d.strftime("%Y-%m-%d"), float(p)] for d, p in zip(pd.to_datetime(t.issue_date), t.issue_price)]
                 + [[G.PRICE_DATE, float(G.PRICE_TODAY)]],
        "first": float(t.iloc[0].issue_price), "today": float(G.PRICE_TODAY), "today_label": G.PRICE_LABEL,
        "x": round(G.PRICE_TODAY / float(t.iloc[0].issue_price), 1),
        "owed_cr": round(sgb["owed"]), "early_cr": round(sgb["early_cr"]),
        "s3_issue": float(s3.issue_price), "s3_redeem": float(s3.redemption_price),
        "s3_pct": round((s3.redemption_price / s3.issue_price - 1) * 100),
        "mined_per": round(imp["t26"] / G.MINE_OUTPUT_T),
    }


def build():
    ADIR.mkdir(parents=True, exist_ok=True)
    t, chunks, beats = 0.6, [np.zeros(int(0.6 * SB.SR), dtype=np.float32)], []
    for pi, (emo, parts) in enumerate(PARAS):
        text = " ".join(x for _, x in parts)
        mp3, subs = tts_para(text, emo, ADIR / f"p{pi + 1}.mp3")
        a = decode(mp3)
        # assign subtitle segments to beats in order, by their text (character offsets drift around pause markers)
        norm = lambda z: re.sub(r"[^a-z0-9]", "", z.lower())
        segs = [(norm(g["text"]), g["time_begin"] / 1000, g["time_end"] / 1000) for g in subs if norm(g["text"])]
        k = 0
        for bid, x in parts:
            want, got, mine = norm(say_of(x)), "", []
            while k < len(segs) and len(got) < len(want) and want.startswith(got + segs[k][0][: max(1, len(want) - len(got))][:4]):
                got += segs[k][0]; mine.append(segs[k]); k += 1
            if not mine or got != want:
                sys.exit(f"could not time beat {bid!r}: script {want!r} vs subtitles {got!r}")
            beats.append({"id": bid, "t0": round(t + mine[0][1], 3), "t1": round(t + mine[-1][2], 3), "say": say_of(x),
                          "emotion": emo or "auto"})
        chunks.append(a)
        chunks.append(np.zeros(int(PARA_GAP * SB.SR), dtype=np.float32))
        t += len(a) / SB.SR + PARA_GAP
    dur = round(t + 0.9, 2)
    SB.write_wav(ADIR / "voice.wav", np.concatenate(chunks))
    act = {"dur": dur, "beats": beats, "n": numbers(), "voiced": True}
    (PROJ / "act.js").write_text("window.ACT = " + json.dumps(act, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    idx = PROJ / "index.html"
    h = idx.read_text(encoding="utf-8")
    h = re.sub(r'data-duration="[0-9.]+"', f'data-duration="{dur}"', h)
    h = re.sub(r"HF\.setup\([0-9.]+\)", f"HF.setup({dur})", h)
    idx.write_text(h, encoding="utf-8")
    print(f"{ID}: {len(beats)} beats in {len(PARAS)} paragraphs, {dur:.1f} s")
    for b in beats:
        print(f"  {b['t0']:6.2f}-{b['t1']:6.2f}  {b['id']:6s} [{b['emotion']}] {b['say']}")


def verify():
    """Transcribe the finished voice track paragraph by paragraph, so a dropped or cut-off word shows up."""
    from faster_whisper import WhisperModel
    m = WhisperModel("small.en", device="cpu", compute_type="int8")
    import subprocess
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ADIR / "voice.wav"), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    segs, _ = m.transcribe(audio, language="en", word_timestamps=False)
    heard = " ".join(x.text.strip() for x in segs)
    said = " ".join(say_of(x) for _, parts in PARAS for _, x in parts)
    print("SCRIPT:", said, "\nHEARD: ", heard)
    from num2words import num2words  # Whisper writes numbers as digits ("2015", "1.7", "84,000"); spell them out to compare

    def spell(z):
        z = re.sub(r"\b(\d{1,2}),(\d\d),(\d{3})\b", lambda m: f"{num2words(int(m[1]))} lakh {num2words(int(m[2] + m[3]))}", z)  # 1,33,000
        z = re.sub(r"(?<=\d),(?=\d{3})", "", z)
        z = re.sub(r"%", " percent", z)                                          # Whisper: 86% -> eighty six percent
        z = re.sub(r"\btons\b", "tonnes", z, flags=re.I)                           # US spelling of the same spoken word
        z = re.sub(r"\b(19|20)(\d\d)\b", lambda m: f"{num2words(int(m[1]))} {num2words(int(m[2]))}", z)   # years: twenty fifteen
        z = re.sub(r"\d+\.\d+", lambda m: num2words(float(m[0])).replace("-", " "), z)
        return re.sub(r"\d+", lambda m: num2words(int(m[0])).replace("-", " "), z)
    SAME = {"money lender": "moneylender", "bond holders": "bondholders", "dmat": "demat", "peace": "piece", "jewelry": "jewellery"}  # spellings and homophones
    def same(z):
        for k, v in SAME.items():
            z = re.sub(rf"\b{k}\b", v, z)
        return z
    norm = lambda z: re.findall(r"[a-z]+", same(spell(z).lower()).replace(" and ", " "))
    a, b = norm(said), norm(heard)
    missing = [w for w in dict.fromkeys(a) if w not in b]
    print("words in the script not heard:", missing or "none")


def mux():
    """Voice only, no music (AK, 18 Nov). Loudness-normalised to about -16 LUFS for YouTube."""
    import subprocess
    v, out = SB.OUT / f"{ID}.mp4", SB.OUT / f"{ID}-final.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-i", str(ADIR / "voice.wav"), "-filter:a",
                    "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-shortest", "-movflags", "+faststart", str(out)], check=True)
    print(out)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    {"build": build, "verify": verify, "mux": mux}[cmd]()
