#!/usr/bin/env python3
"""Clone a native narrator voice on MiniMax for the regional audio tracks (AK, 2 Oct 2026).

MiniMax has no native Tamil system voice, so the Tamil track uses a voice cloned from a recording of a native speaker
who has agreed to it. Then set "voice": "<voice_id>" in each scripts/translations/<id>.ta.json.

    python3 scripts/voice_clone.py <recording.m4a|wav|mp3> <voice_id> [--preview "a Tamil sentence"]

Recording: 10 s to 5 min (1 to 2 min is best), under 20 MB, one speaker, quiet room, no music.
voice_id: at least 8 characters, starts with a letter, letters, digits, - and _ only, e.g. TamilNarrator01.
MiniMax deletes a cloned voice that is not used for TTS within 7 days, so build a track with it right away.
Needs MINIMAX_API_KEY. The preview is saved next to the recording as <voice_id>_preview.mp3.
"""
import os, sys
from pathlib import Path
import requests

API = "https://api.minimax.io/v1"


def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    preview = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
    if preview in a:
        a.remove(preview)
    if len(a) != 2:
        raise SystemExit(__doc__)
    rec, voice_id = Path(a[0]), a[1]
    if not rec.exists():
        raise SystemExit(f"no such file: {rec}")
    if rec.stat().st_size > 20 * 1024 * 1024:
        raise SystemExit("recording is over 20 MB: trim it to 1 to 2 minutes")
    head = {"Authorization": "Bearer " + os.environ["MINIMAX_API_KEY"]}

    with open(rec, "rb") as fh:
        up = requests.post(f"{API}/files/upload", headers=head, data={"purpose": "voice_clone"},
                           files={"file": (rec.name, fh)}, timeout=300).json()
    file_id = (up.get("file") or {}).get("file_id")
    if not file_id:
        raise SystemExit(f"upload failed: {up.get('base_resp')}")
    print("uploaded, file_id", file_id)

    body = {"file_id": file_id, "voice_id": voice_id, "need_noise_reduction": True, "need_volume_normalization": True}
    if preview:
        body.update({"text": preview, "model": "speech-2.6-hd"})
    r = requests.post(f"{API}/voice_clone", headers=head, json=body, timeout=300).json()
    if (r.get("base_resp") or {}).get("status_code") != 0:
        raise SystemExit(f"clone failed: {r.get('base_resp')}")
    print("cloned voice_id", voice_id)
    if r.get("demo_audio"):
        out = rec.with_name(f"{voice_id}_preview.mp3")
        out.write_bytes(requests.get(r["demo_audio"], timeout=120).content)
        print("preview", out)


if __name__ == "__main__":
    main()
