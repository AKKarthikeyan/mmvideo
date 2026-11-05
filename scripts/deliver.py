#!/usr/bin/env python3
"""Copy finished videos into their channel folder on the SSD (AK: every video made goes to its channel's folder).

Usage:  python3 scripts/deliver.py <channel> <video.mp4> [more.mp4 ...] [--sub "Folder name"] [--name new-name.mp4]
Channels: datakadai, indica, moat, inventors, chariot, upsc.
A file already in the folder with the same name and size is skipped. Each copy is logged in the folder's DELIVERED.txt.
Called by week_pack.py (Data Kadai Shorts); run it by hand after any other final render.
"""
import argparse, datetime, os, shutil, sys

SSD = "/Volumes/DarwinSSD"
FOLDERS = {
    "datakadai": f"{SSD}/DataKadai/videos",
    "indica": f"{SSD}/Indica Atlas",
    "moat": f"{SSD}/Moat and Margin/01 Videos",
    "inventors": f"{SSD}/The Inventors Desk/01 Videos",
    "chariot": f"{SSD}/The Inner Chariot/01 Video",
    "upsc": f"{SSD}/The UPSC Mains/01 Videos",
}


def deliver(channel, src, sub=None, name=None):
    dest_dir = os.path.join(FOLDERS[channel], sub) if sub else FOLDERS[channel]
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, name or os.path.basename(src))
    if os.path.exists(dest) and os.path.getsize(dest) == os.path.getsize(src):
        print(f"already there: {dest}")
        return dest
    shutil.copy2(src, dest)
    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    with open(os.path.join(dest_dir, "DELIVERED.txt"), "a") as log:
        log.write(f"{stamp}  {os.path.basename(dest)}  <-  {os.path.abspath(src)}\n")
    print(f"copied: {dest}")
    return dest


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("channel", choices=sorted(FOLDERS))
    ap.add_argument("videos", nargs="+")
    ap.add_argument("--sub")
    ap.add_argument("--name")
    a = ap.parse_args()
    if a.name and len(a.videos) > 1:
        sys.exit("--name works with one video only")
    for v in a.videos:
        deliver(a.channel, v, a.sub, a.name)
