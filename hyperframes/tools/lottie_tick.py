"""Write our own small Lottie animation for sample s16-lottie: an India Ledger "verified" tick (ring draws, tick draws,
then a small pop). Made by us, so no licence to track. usage: python3 hyperframes/tools/lottie_tick.py"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "samples" / "s16-lottie" / "assets" / "data" / "tick.json"
GREEN = [14 / 255, 124 / 255, 102 / 255, 1]
FR, OP = 30, 60


def kf(frames, ease=(0.2, 0, 0, 1)):
    """Keyframes [(frame, value list)] with one easing curve (Material on-screen standard)."""
    out = []
    for (f, v), nxt in zip(frames, frames[1:] + [None]):
        k = {"t": f, "s": v}
        if nxt:
            k.update({"o": {"x": [ease[0]], "y": [ease[1]]}, "i": {"x": [ease[2]], "y": [ease[3]]}})
        out.append(k)
    return {"a": 1, "k": out}


def tr(scale=None):
    return {"ty": "tr", "p": {"a": 0, "k": [0, 0]}, "a": {"a": 0, "k": [0, 0]}, "s": scale or {"a": 0, "k": [100, 100]},
            "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}}


def stroke(w):
    return {"ty": "st", "c": {"a": 0, "k": GREEN}, "o": {"a": 0, "k": 100}, "w": {"a": 0, "k": w}, "lc": 2, "lj": 2}


ring = {"ty": "gr", "it": [
    {"ty": "el", "p": {"a": 0, "k": [0, 0]}, "s": {"a": 0, "k": [300, 300]}},
    stroke(18),
    {"ty": "tm", "s": {"a": 0, "k": 0}, "e": kf([(0, [0]), (20, [100])]), "o": {"a": 0, "k": -90}, "m": 1},
    tr()]}
tick = {"ty": "gr", "it": [
    {"ty": "sh", "ks": {"a": 0, "k": {"c": False, "v": [[-70, 5], [-20, 55], [80, -55]],
                                      "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]]}}},
    stroke(26),
    {"ty": "tm", "s": {"a": 0, "k": 0}, "e": kf([(16, [0]), (34, [100])]), "o": {"a": 0, "k": 0}, "m": 1},
    tr()]}
pop = kf([(32, [100, 100]), (38, [108, 108]), (46, [100, 100])], ease=(0.175, 0.885, 0.32, 1))
layer = {"ddd": 0, "ind": 1, "ty": 4, "nm": "tick", "sr": 1, "ip": 0, "op": OP, "st": 0, "bm": 0,
         "ks": {"o": {"a": 0, "k": 100}, "r": {"a": 0, "k": 0}, "p": {"a": 0, "k": [200, 200, 0]},
                "a": {"a": 0, "k": [0, 0, 0]}, "s": {"a": 1, "k": [dict(k, s=k["s"] + [100]) for k in pop["k"]]}},
         "shapes": [ring, tick]}
anim = {"v": "5.7.4", "fr": FR, "ip": 0, "op": OP, "w": 400, "h": 400, "nm": "India Ledger verified tick", "ddd": 0,
        "assets": [], "layers": [layer]}
OUT.write_text(json.dumps(anim, separators=(",", ":")))
print(OUT, OUT.stat().st_size, "bytes")
