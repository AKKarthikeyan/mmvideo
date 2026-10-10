"""SRT helpers shared by the package_*.py kits (split out of package_shyam.py, whose import re-ran the Shyam kit)."""

def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

def srt(entries, path):
    with open(path, "w") as f:
        for i, (a, b, t) in enumerate(entries, 1): f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n")

def split(text, a, b, parts):
    tot = sum(len(p) for p in parts) or 1; out = []; acc = 0
    for p in parts:
        s = a + (b - a) * acc / tot; acc += len(p); out.append((s, a + (b - a) * acc / tot, p))
    return out
