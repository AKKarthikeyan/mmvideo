# Mark "Jio's Size Advantage Has a Catch" FINAL once AK has signed every ledger row (AK, 20 Oct 2026: "Draft 3 looks good.
# Once I've checked the ledger, mark it final."). If any (beat, value) changed during the check, DO NOT mark final: the film
# shows the old figures and must be re-rendered. Polls every 5 minutes; writes out/voxplus/scale/FINAL_STATUS.txt.
import csv, hashlib, io, re, shutil, time, datetime, pathlib
L = pathlib.Path("/Volumes/DarwinSSD/MMVideo/scripts/ledger/jioscale.csv")
O = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/voxplus/scale")
EXPECT = "df28ab3dd20387d5"   # (beat, value) hash of the FILM rows (beats sNNpK) DRAFT3 was built from; rows for Shorts/blog/carousel don't count
SRC = {"jio-size-advantage-catch_DRAFT3_60fps_-14LUFS.mp4": "jio-size-advantage-catch_FINAL_60fps_-14LUFS.mp4",
       "jio-size-advantage-catch_DRAFT3_phone.mp4": "jio-size-advantage-catch_FINAL_phone.mp4"}
status = O / "FINAL_STATUS.txt"
while True:
    rows = list(csv.DictReader(io.StringIO(L.read_bytes().decode("utf-8"))))
    signed = sum(1 for r in rows if r["checked_by"].strip())
    if rows and signed == len(rows):
        film = lambda b: any(re.match(r"^s\d\dp\d+$", t) for t in b.split())
        h = hashlib.sha256("|".join(r["beat"] + "=" + r["value"] for r in rows if film(r["beat"])).encode()).hexdigest()[:16]
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        if h == EXPECT:
            for a, b in SRC.items(): shutil.copy2(O / a, O / b)
            status.write_text(f"FINAL {now}: all {len(rows)} ledger rows signed, figures unchanged; DRAFT3 copied to *_FINAL_*.\n")
        else:
            status.write_text(f"NEEDS RE-RENDER {now}: all {len(rows)} rows signed but figures changed during the check (hash {h} != {EXPECT}). Not marked final.\n")
        break
    status.write_text(f"WAITING {datetime.datetime.now():%Y-%m-%d %H:%M}: {signed}/{len(rows)} ledger rows signed.\n")
    time.sleep(300)
