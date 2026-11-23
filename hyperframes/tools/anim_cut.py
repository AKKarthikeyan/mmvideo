"""Cut each frame of the AI character clips out of its grey background (Apple Vision), then composite on collage paper with
a sticker edge. Writes /tmp/ai_anim_test.mp4 (Amma turn, Amma no, Ravi, side by side)."""
import os, subprocess, glob, shutil
from PIL import Image, ImageDraw
exec(open("/tmp/collage.py").read().split("# ---------- Frame A")[0])
A = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/anim/"
FF = "/opt/homebrew/bin/ffmpeg"
def cut(name):
    d = f"/tmp/cut_{name}"; shutil.rmtree(d, ignore_errors=True); os.makedirs(d + "/in"); os.makedirs(d + "/out")
    subprocess.run([FF, "-loglevel", "error", "-i", A + name + ".mp4", "-vf", "fps=30", d + "/in/%04d.png"], check=True)
    fs = sorted(glob.glob(d + "/in/*.png"))
    for f in fs:
        r = subprocess.run(["/tmp/cutout_full", f, d + "/out/" + os.path.basename(f)], capture_output=True, text=True)
        if "ok" not in r.stdout: print("miss", f, r.stdout[:80])
    return sorted(glob.glob(d + "/out/*.png"))
seqs = {n: cut(n) for n in ("amma_turn", "amma_no", "ravi_turn")}
n = min(len(v) for v in seqs.values()); print({k: len(v) for k, v in seqs.items()})
BG = paper().convert("RGBA"); d = ImageDraw.Draw(BG)
d.text((90, 50), "TEST · AI-ANIMATED DRAWINGS", font=SERIF, fill=(30, 30, 35))
ff = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1920x1080", "-r", "30", "-i", "-",
                       "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "/tmp/ai_anim_test.mp4"], stdin=subprocess.PIPE)
for i in range(n):
    F = BG.copy()
    for k, x in (("amma_turn", 40), ("amma_no", 680), ("ravi_turn", 1320)):
        im = Image.open(seqs[k][i]).convert("RGBA"); im = im.resize((int(im.width * 0.82), int(im.height * 0.82)), Image.LANCZOS)
        st = sticker(im, border=10); F.alpha_composite(st, (x, 1080 - st.height + 12))
    ff.stdin.write(F.convert("RGB").tobytes())
ff.stdin.close(); ff.wait(); print("ok", n, "frames")
