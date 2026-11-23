"""Cut the plain-background character clips out frame by frame (Apple Vision) and write VP9 webm with alpha for HyperFrames.
usage: il_cutclips.py name [name ...]   (names in media_src/characters/anim/<name>.mp4) -> videos/il-gold-v3/assets/clips/<name>.webm"""
import glob, os, shutil, subprocess, sys
A = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/anim/"
OUT = "/Volumes/DarwinSSD/MMVideo/hyperframes/videos/il-gold-v3/assets/clips/"; os.makedirs(OUT, exist_ok=True)
FF = "/opt/homebrew/bin/ffmpeg"
for name in sys.argv[1:]:
    d = f"/tmp/cc_{name}"; shutil.rmtree(d, ignore_errors=True); os.makedirs(d + "/in"); os.makedirs(d + "/out")
    subprocess.run([FF, "-loglevel", "error", "-i", A + name + ".mp4", "-vf", "fps=30", d + "/in/%04d.png"], check=True)
    miss = 0
    for f in sorted(glob.glob(d + "/in/*.png")):
        o = d + "/out/" + os.path.basename(f)
        r = subprocess.run(["/tmp/cutout_full", f, o], capture_output=True, text=True)
        if "ok" not in r.stdout:
            miss += 1
            prev = sorted(glob.glob(d + "/out/*.png"))
            if prev: shutil.copy(prev[-1], o)
    subprocess.run([FF, "-loglevel", "error", "-y", "-framerate", "30", "-i", d + "/out/%04d.png", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
                    "-b:v", "2500k", "-auto-alt-ref", "0", OUT + name + ".webm"], check=True)
    print("ok", name, "frames without a subject:", miss, flush=True)
