"""Run the HyperFrames visual library: sync shared assets, check, snapshot, render, build the selection reel.

usage:
  hf.py sync [id ...]            copy shared/ libs, fonts and css (plus linked public/ images) into each sample
  hf.py check <id>               HyperFrames lint, layout and contrast check
  hf.py snap <id> <t1,t2,...>    stills at those seconds -> out/hyperframes/snap/<id>/
  hf.py render <id ...|all>      MP4s -> out/hyperframes/<id>.mp4
  hf.py reel                     title cards + every rendered sample -> out/hyperframes/visual-samples-reel.mp4
                                 and hyperframes/stills/contact-sheet.jpg
Ids are folder names under hyperframes/samples (s01-satellite ...) or just the number (1, 01), or folder names under
hyperframes/videos (ia-poultry ...); "videos" means every video.
Needs Node 22+ (HyperFrames runs through npx) and ffmpeg on PATH.
"""
import shutil
import subprocess
import sys
from pathlib import Path

HF = "hyperframes@0.8.202"
ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / "hyperframes"
SAMPLES = LIB / "samples"
VIDEOS = LIB / "videos"
OUT = ROOT / "out" / "hyperframes"
CARD_SEC = 1.6
# images a sample uses that already live in public/; copied at sync time instead of kept twice in git
LINKS = {
    "s03-desk/assets/img/page.png": "public/letters/l48_nomad_letters/pages/p34.png",
    "s10-parallax/assets/img/scene.jpg": "public/vx/mf003-textile/img/mill_gate.jpeg",
    "s13-quote/assets/img/n48_children.png": "public/vx/l48-nomad-letters/clips/n48_children.png",
    "s14-notes/assets/img/p99.png": "public/letters/l48_nomad_letters/pages/p99.png",
}
PUBLIC_FONTS = ["Oswald-700.woff2", "Virgil-Regular.woff2"]


def project(name):
    return VIDEOS / name if (VIDEOS / name).is_dir() else SAMPLES / name


def ids(args):
    names = sorted(p.name for p in SAMPLES.iterdir() if p.is_dir() and p.name.startswith("s"))
    vids = sorted(p.name for p in VIDEOS.iterdir() if p.is_dir() and not p.name.startswith("_")) if VIDEOS.exists() else []
    if args == ["videos"]:
        return vids
    if not args or args == ["all"]:
        return names
    out = []
    for a in args:
        hit = [n for n in names + vids if n == a or (a.isdigit() and n.startswith(f"s{int(a):02d}-"))]
        if not hit:
            sys.exit(f"no sample called {a}; have: {', '.join(names)}")
        out += hit
    return out


def sync(names):
    for n in names + ["cards"]:
        a = project(n) / "assets"
        for sub in ("lib", "fonts", "css"):
            (a / sub).mkdir(parents=True, exist_ok=True)
        for f in (LIB / "shared" / "lib").iterdir():
            shutil.copy(f, a / "lib")
        for f in (LIB / "shared" / "fonts").iterdir():
            shutil.copy(f, a / "fonts")
        for f in PUBLIC_FONTS:
            shutil.copy(ROOT / "public" / "fonts" / f, a / "fonts")
        shutil.copy(LIB / "shared" / "base.css", a / "css")
        if project(n).parent == VIDEOS:
            (a / "geo").mkdir(exist_ok=True)
            shutil.copy(LIB / "shared" / "geo" / "india_districts.js", a / "geo")
    for dst, src in LINKS.items():
        d = SAMPLES / dst
        d.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(ROOT / src, d)
    print("synced", len(names) + 1, "projects")


def hf(cwd, *args):
    subprocess.run(["npx", "--yes", HF, *args], cwd=cwd, check=True)


def render(n):
    OUT.mkdir(parents=True, exist_ok=True)
    hf(project(n), "render", "-o", str(OUT / f"{n}.mp4"))


def reel():
    names = ids([])
    missing = [n for n in names if not (OUT / f"{n}.mp4").exists()]
    if missing:
        sys.exit(f"render these first: {' '.join(missing)}")
    if not (OUT / "cards.mp4").exists():
        hf(SAMPLES / "cards", "render", "-o", str(OUT / "cards.mp4"))
    args = ["ffmpeg", "-v", "error", "-y"]
    for i, n in enumerate(names):
        args += ["-ss", f"{i * CARD_SEC:.2f}", "-t", str(CARD_SEC), "-i", str(OUT / "cards.mp4"), "-i", str(OUT / f"{n}.mp4")]
    k = 2 * len(names)
    fc = "".join(f"[{i}:v]scale=1920:1080,fps=30,format=yuv420p,setsar=1[v{i}];" for i in range(k))
    fc += "".join(f"[v{i}]" for i in range(k)) + f"concat=n={k}:v=1:a=0[out]"
    subprocess.run(args + ["-filter_complex", fc, "-map", "[out]", "-c:v", "libx264", "-crf", "21", "-preset", "medium",
                           "-movflags", "+faststart", str(OUT / "visual-samples-reel.mp4")], check=True)
    contact_sheet(names)
    print(OUT / "visual-samples-reel.mp4")


def contact_sheet(names):
    from PIL import Image, ImageDraw, ImageFont
    tiles = []
    for i, n in enumerate(names, 1):
        f = OUT / f"{n}.mp4"
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                                   capture_output=True, text=True, check=True).stdout)
        png = OUT / f"still-{i:02d}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{dur * 0.78:.2f}", "-i", str(f), "-frames:v", "1",
                        "-vf", "scale=640:360", str(png)], check=True)
        im = Image.open(png).convert("RGB")
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 92, 64], fill=(217, 164, 65))
        d.text((14, 8), f"{i:02d}", fill=(11, 14, 19), font=ImageFont.load_default(size=44))
        tiles.append(im)
    cols, rows = 3, -(-len(tiles) // 3)
    sheet = Image.new("RGB", (640 * cols, 360 * rows), (14, 17, 22))
    for i, im in enumerate(tiles):
        sheet.paste(im, ((i % cols) * 640, (i // cols) * 360))
    (LIB / "stills").mkdir(exist_ok=True)
    sheet.save(LIB / "stills" / "contact-sheet.jpg", quality=86)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "sync":
        sync(ids(args) if args else ids([]) + ids(["videos"]))
    elif cmd == "check":
        sys.exit(subprocess.run(["npx", "--yes", HF, "check"], cwd=project(ids(args[:1])[0])).returncode)
    elif cmd == "snap":
        n = ids(args[:1])[0]
        hf(project(n), "snapshot", "--at", args[1], "--no-end", "-o", str(OUT / "snap" / n))
    elif cmd == "render":
        for n in ids(args):
            render(n)
    elif cmd == "reel":
        reel()
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
