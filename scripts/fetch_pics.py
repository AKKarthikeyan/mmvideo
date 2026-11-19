"""Fetch freely licensed pictures listed in <dir>/pending.json and keep the credits in step.

Usage:
  python3 scripts/fetch_pics.py public/vx/nvidia_jensen/img             # download pending pictures, rewrite CREDITS.md
  python3 scripts/fetch_pics.py public/vx/nvidia_jensen/img --credits   # only rewrite CREDITS.md from credits.json

<dir>/pending.json and <dir>/credits.json are lists of entries:
  {file, download_url (pending only), title, creator, license, license_url, source_page, original_url, original_size,
   via, note (optional)}
Each picture is resized to a 1,920 px long edge and saved as JPEG (PNG if it is a logo with transparency), then its
entry moves from pending.json to credits.json. Wikimedia only serves standard thumbnail widths (1920 is one) and asks
for modest request rates: requests are 5 s apart, and a 429 waits for Retry-After. Needs Pillow.
"""
import io, json, pathlib, sys, time, urllib.error, urllib.request

UA = "MMVideoAssetCollector/1.0 (https://github.com/AKKarthikeyan/mmvideo)"
EDGE = 1920


def fetch(url):
    for _ in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            wait = min(int(e.headers.get("Retry-After") or 60), 600)
            print(f"  429, waiting {wait}s", flush=True)
            time.sleep(wait)
    raise RuntimeError("still refused: " + url)


def save(data, out):
    from PIL import Image, ImageOps
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    im.thumbnail((EDGE, EDGE))
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.suffix == ".png":
        im.convert("RGBA").save(out, optimize=True)
    else:
        im.convert("RGB").save(out, quality=86, optimize=True, progressive=True)
    return f"{im.width}x{im.height}"


def write_credits(d, credits):
    L = [f"# Picture credits: `{d.as_posix()}`", "",
         "Every picture here is under a licence that allows commercial use and changes (cropping, collage): CC0, Public",
         "Domain Mark, CC BY or CC BY-SA. NC and ND licences are excluded. Pictures are resized (long edge 1,920 px) and",
         "re-saved, which counts as a change: say \"cropped\" or \"edited\" in the credit when it matters.", "",
         "**How to credit.** CC BY and CC BY-SA need the author, the licence and a link. Put a short credit on screen",
         "while the picture shows (for example `Photo: 總統府 · CC BY 2.0`) and paste the attribution lines below into the",
         "video description. CC BY-SA also asks that the changed picture be shared under the same licence; say so in",
         "the description.", "",
         "**People.** Photos of real people are for news commentary only. Don't imply anyone endorses the channel, and",
         "don't edit faces to mock or mislead. Logos and brand marks are trademarks: use them only to name the company.", "",
         "**Check the source page** before publishing: the licence data came through Openverse and can lag behind the",
         "source site.", "",
         "| File | Title | Author | Licence | Source |", "| --- | --- | --- | --- | --- |"]
    for c in credits:
        t = c["title"].replace("|", "/")
        L.append(f"| `{c['file']}` | {t} | {c['creator'] or 'unknown'} | {c['license']} | [link]({c['source_page']}) |")
    notes = [c for c in credits if c.get("note")]
    if notes:
        L += ["", "## Notes on specific files", ""] + [f"- `{c['file']}`: {c['note']}" for c in notes]
    L += ["", "## Attribution lines for the video description", "", "```"]
    L += [f"\"{c['title']}\" by {c['creator'] or 'unknown'}, {c['license']}, {c['source_page']}" for c in credits]
    L += ["```", ""]
    (d / "CREDITS.md").write_text("\n".join(L), encoding="utf-8")


def main():
    d = pathlib.Path(sys.argv[1])
    credits = json.loads((d / "credits.json").read_text(encoding="utf-8")) if (d / "credits.json").exists() else []
    pending_path = d / "pending.json"
    pending = json.loads(pending_path.read_text(encoding="utf-8")) if pending_path.exists() else []
    if "--credits" not in sys.argv:
        left = []
        for p in pending:
            print(p["file"], flush=True)
            try:
                size = save(fetch(p["download_url"]), d / p["file"])
            except Exception as e:  # keep it pending and carry on with the rest
                print("  skipped:", e, flush=True)
                left.append(p)
                continue
            credits.append({k: v for k, v in p.items() if k != "download_url"} | {"saved_size": size})
            time.sleep(5)
        pending = left
        (d / "credits.json").write_text(json.dumps(credits, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        if pending:
            pending_path.write_text(json.dumps(pending, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        elif pending_path.exists():
            pending_path.unlink()
        print(f"{len(credits)} credited, {len(pending)} still pending")
    write_credits(d, credits)


if __name__ == "__main__":
    main()
