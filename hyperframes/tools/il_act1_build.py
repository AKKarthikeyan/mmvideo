"""India Ledger style test: Act 1 of the gold episode (docs/INDIA_LEDGER_EP1_SCRIPT.md), voiced and timed to the voice.

usage:
  python3 hyperframes/tools/il_act1_build.py [--no-tts]     voice each line, write videos/il-gold-act1/act.js and the duration
  python3 hyperframes/tools/hf.py sync il-gold-act1 && python3 hyperframes/tools/hf.py render il-gold-act1
  python3 hyperframes/tools/il_act1_build.py mux            -> out/hyperframes/il-gold-act1-final.mp4 (voice + quiet bed)
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
ADIR = SB.OUT / "shorts_audio" / ID   # mux() reads voice.wav from here
LANG = "en-IN"
GAP = 0.28                            # seconds between lines

# (beat id, what the voice says). Scenes in index.html hang off these ids.
LINES = [
    ("hook", "How do you lose money on gold that only went up?"),
    ("way", "The Government of India found a way."),
    ("bet", "In twenty fifteen, it made a bet against your mother."),
    ("ask", "It asked her to hand over her gold."),
    ("no", "She said no."),
    ("paper", "So it sold her paper gold instead."),
    ("owes", "Today, it owes about one point seven lakh crore rupees on it."),
    ("not", "Not because anyone stole it. Not because gold crashed."),
    ("up", "Gold went up. That's exactly why it lost."),
    ("week", "And this isn't history. Last week, one batch of these bonds paid back four point four times its price."),
    ("call", "And holders can call in another eighty four thousand crore, whenever they choose."),
    ("next", "To see how this happened, start with a number almost nobody has seen."),
]


def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        imp = G.imports()
        sgb = G.sgb_model()
    t = sgb["tranches"]
    s3 = t[t.tranche.str.contains("2018-19 Series III")].iloc[0]
    return {
        "price": [[d.strftime("%Y-%m-%d"), float(p)] for d, p in zip(pd.to_datetime(t.issue_date), t.issue_price)]
                 + [["2026-11-13", float(G.PRICE_TODAY)]],
        "first": float(t.iloc[0].issue_price), "today": float(G.PRICE_TODAY),
        "x": round(G.PRICE_TODAY / float(t.iloc[0].issue_price), 1),
        "owed_cr": round(sgb["owed"]), "early_cr": round(sgb["early_cr"]),
        "s3_issue": float(s3.issue_price), "s3_redeem": float(s3.redemption_price),
        "s3_pct": round((s3.redemption_price / s3.issue_price - 1) * 100),
        "mined_per": round(imp["t26"] / G.MINE_OUTPUT_T),
    }


def build(use_tts=True):
    ADIR.mkdir(parents=True, exist_ok=True)
    beats, t, chunks = [], 0.6, []          # 0.6 s of picture before the first word
    chunks.append(np.zeros(int(0.6 * SB.SR), dtype=np.float32))
    for bid, say in LINES:
        mp3 = ADIR / f"{bid}.mp3"
        ok = use_tts and (mp3.exists() or SB.tts(say, LANG, mp3))
        if ok:
            a = SB.pcm(mp3)
            d = len(a) / SB.SR
        else:
            a = None
            d = len(say) / SB.VOICE[LANG]["cps"]
        beats.append({"id": bid, "t0": round(t, 3), "t1": round(t + d, 3), "say": say})
        chunks.append(a if a is not None else np.zeros(int(d * SB.SR), dtype=np.float32))
        chunks.append(np.zeros(int(GAP * SB.SR), dtype=np.float32))
        t += d + GAP
    dur = round(t + 1.2, 2)
    if use_tts:
        SB.write_wav(ADIR / "voice.wav", np.concatenate(chunks))
    act = {"dur": dur, "beats": beats, "n": numbers(), "voiced": bool(use_tts)}
    (PROJ / "act.js").write_text("window.ACT = " + json.dumps(act, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    idx = PROJ / "index.html"
    h = idx.read_text(encoding="utf-8")
    h = re.sub(r'data-duration="[0-9.]+"', f'data-duration="{dur}"', h)
    h = re.sub(r"HF\.setup\([0-9.]+\)", f"HF.setup({dur})", h)
    idx.write_text(h, encoding="utf-8")
    print(f"{ID}: {len(beats)} lines, {dur:.1f} s", "(voiced)" if use_tts else "(estimated timings)")
    for b in beats:
        print(f"  {b['t0']:6.2f}-{b['t1']:6.2f}  {b['id']:6s} {b['say']}")


if __name__ == "__main__":
    if sys.argv[1:2] == ["mux"]:
        SB.mux(ID)
    else:
        build(use_tts="--no-tts" not in sys.argv)
