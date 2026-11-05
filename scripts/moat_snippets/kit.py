#!/usr/bin/env python3
"""YouTube kit for finished Moat Snippets: video, English captions, cover frame and the upload text, as DRAFTs for AK.

    python3 scripts/moat_snippets/kit.py A1 A2 ...      # after sfx.py; writes into KIT (below), one set of files per snippet

Per snippet: moat-snippet-<id>_DRAFT.mp4 (copied from out/hyperframes), <id>_DRAFT.en.srt (from the voice's word times),
<id>_cover_DRAFT.jpg (the hook frame) and youtube-moat-snippet-<id>_DRAFT.txt. Title, source line and post caption come from
final/FINAL_SCRIPTS.md; the rest of the copy is in COPY below. Source links are left for AK to fill: no URL is guessed.
Nothing here is uploaded or scheduled (AK posts by hand).
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
KIT = Path("/Volumes/DarwinSSD/Moat and Margin/Moat Atlas - Moat Snippets - DRAFT 2026-11-05")
VOICE = "MiniMax English_CaptivatingStoryteller"
NUM = {"A1": 1, "A2": 2, "A3": 3, "A4": 4, "A5": 5, "V1": 6, "V2": 7, "V3": 8, "V4": 9, "V5": 10}

COPY = {
    "A1": dict(b="2.5 billion devices and one very good negotiator", c="Why about 9 in 10 iPhone buyers stay",
        lead="Apple has more than 2.5 billion active devices, and about 9 in 10 iPhone owners who bought a new phone in the year to September 2026 chose another iPhone. Leaving is legal; leaving with your photos, watch and earbuds is the hard part. The marriage is an analogy and the drawings are illustrations.",
        src=["Apple, first-quarter fiscal 2026 results, 29 Jan 2026 (more than 2.5 billion active devices)", "CIRP (Consumer Intelligence Research Partners), 12 months to Sep 2026 (about 90% chose an iPhone again)"],
        pin="Leaving is legal. Leaving with your photos, your watch and your earbuds is the hard part. What would it take for you to switch?",
        tags="#Apple #iPhone", cover=1.3, open="VERIFICATION_LOG open item 3: confirm whether the 2.5 billion line is in Apple's release or on the call."),
    "A2": dict(b="28% of sales, 44% of gross profit", c="The toll bridge inside Apple",
        lead="Services was about 28% of Apple's sales but about 44% of its gross profit in the July to September 2026 quarter (our arithmetic from Apple's release). On 30 Jun 2026 the US Supreme Court agreed to hear the contempt question in Apple's fight over that toll. The bridge is an analogy and the drawings are illustrations.",
        src=["Apple, fourth-quarter fiscal 2026 results, 2 Nov 2026 (Form 8-K, Exhibit 99.1); shares are our arithmetic", "US Supreme Court order list, 30 Jun 2026 (certiorari granted, limited to Question 1)"],
        pin="The phone is sold once; the subscriptions keep billing. Which one have you forgotten you pay for?",
        tags="#Apple #AppStore", cover=1.3, hook="Almost half the gross profit", open="VERIFICATION_LOG open item 4: re-check the court dates on the day of posting; they move."),
    "A4": dict(b="Apple writes the recipe. Who owns the kitchen?", c="Chef or landlord: who has the power in iPhone chips?",
        lead="Apple says it designs nearly the entire solution and that most of its manufacturing is done by outsourcing partners. TSMC is widely reported as Apple's chip maker; Apple's 10-K does not name it. Asked about reports of price rises, TSMC's CEO called its pricing very strategic, and confirmed no rise. \"Landlord-speak\" is our reading. The chef and the kitchen are an analogy.",
        src=["Apple, Form 10-K for fiscal 2025", "TSMC third-quarter 2026 earnings call, 15 Oct 2026 (C.C. Wei)"],
        pin="TSMC did not confirm any price rise; its CEO only called its pricing \"very strategic\". Chef or landlord: who holds more power?",
        tags="#Apple #TSMC #Semiconductors", cover=1.4, open=""),
    "V1": dict(b="Visa is a language. Good luck inventing a better one.", c="$45.9 billion from one loop",
        lead="A payment network is useful because everyone already uses it: more shops make the card more useful, and more cards make shops keener. Visa's net revenue was $45.9 billion in fiscal 2026, up 15%. The language is an analogy and the drawings are illustrations.",
        src=["Visa, fiscal fourth-quarter and full-year 2026 results, 27 Oct 2026"],
        pin="A better network on its own is Esperanto: right, and completely alone. What would get billions of strangers to switch at once?",
        tags="#Visa #Payments", cover=1.3, open=""),
    "V2": dict(b="Visa 59.8%. Mastercard 59.8%.", c="Run the road, not the potholes",
        lead="When a cardholder doesn't repay, the bank takes the loss; the network has already taken its fee. In July to September 2026 Visa's operating margin was 59.8% (our arithmetic: operating income over net revenue) and Mastercard's was also 59.8%. The road is an analogy and the drawings are illustrations.",
        src=["Visa, fiscal fourth-quarter 2026 results, 27 Oct 2026 (margin: our arithmetic)", "Mastercard, third-quarter 2026 results, 29 Oct 2026"],
        pin="Same margin, different companies. So why hasn't anyone built a cheaper road?",
        tags="#Visa #Mastercard #Payments", cover=1.4, open=""),
    "V3": dict(b="About $3 trillion in a quarter, on a sticker's word", c="Why boring is the point",
        lead="Mastercard's gross dollar volume was about $3 trillion in July to September 2026, up 7% in local currency. Nobody reads the network's rules; everybody trusts the sticker. Trust at that scale is boring, which is the point. The grade card is an analogy and the drawings are illustrations.",
        src=["Mastercard, third-quarter 2026 results, 29 Oct 2026 (gross dollar volume, +7% local currency)"],
        pin="Nobody reads the rules; everybody trusts the letter. Where you live, has a QR code already beaten the sticker?",
        tags="#Mastercard #Payments #UPI", cover=1.3, open=""),
}


def field(sid, name):
    t = (HERE / "final" / "FINAL_SCRIPTS.md").read_text()
    blk = re.search(rf"## {sid} ·(.*?)(?=\n## |\Z)", t, re.S).group(1)
    m = re.search(rf"\*\*{re.escape(name)}:\*\*\s*(.+)", blk)
    return m.group(1).strip() if m else ""


def srt(words):
    def ts(s): h, r = divmod(int(round(s * 1000)), 3600000); m, r = divmod(r, 60000); return f"{h:02d}:{m:02d}:{r // 1000:02d},{r % 1000:03d}"
    cues, cur = [], []
    for i, w in enumerate(words):
        cur.append(w); text = " ".join(x["w"] for x in cur)
        if w["w"][-1] in ".?!:" or len(text) > 38 or i == len(words) - 1:
            cues.append(cur); cur = []
    out = []
    for n, c in enumerate(cues, 1):
        text = " ".join(x["w"] for x in c)
        if len(text) > 24:                                 # two balanced lines
            ws = text.split(); k = min(range(1, len(ws)), key=lambda j: abs(len(" ".join(ws[:j])) - len(" ".join(ws[j:])))); text = " ".join(ws[:k]) + "\n" + " ".join(ws[k:])
        end = c[-1]["t1"] + 0.15 if n == len(cues) else min(c[-1]["t1"] + 0.15, cues[n][0]["t0"] - 0.02)
        out.append(f"{n}\n{ts(c[0]['t0'])} --> {ts(end)}\n{text}\n")
    return "\n".join(out)


def kit(sid):
    lo = sid.lower(); c = COPY[sid]
    vid = ROOT / "out" / "hyperframes" / f"moat-snippet-{lo}.mp4"
    if not vid.exists(): sys.exit(f"{sid}: no final video yet (voice.py, render, sfx.py)")
    tm = json.loads((ROOT / "hyperframes" / "samples" / f"s18-snippet-{lo}" / "assets" / "timing.js").read_text().split("=", 1)[1].strip().rstrip(";"))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(vid)], capture_output=True, text=True, check=True).stdout)
    KIT.mkdir(parents=True, exist_ok=True)
    shutil.copy(vid, KIT / f"moat-snippet-{lo}_DRAFT.mp4")
    (KIT / f"{lo}_DRAFT.en.srt").write_text(srt(tm["words"]))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(c["cover"]), "-i", str(vid), "-frames:v", "1", "-q:v", "2", str(KIT / f"{lo}_cover_DRAFT.jpg")], check=True)
    title = field(sid, "Title").split(" | ")[0].strip()
    hook = re.findall(r"“([^”]+)”", field(sid, "On-screen captions (in order)"))
    src = "\n".join(f"  - {s} · link: [TO FILL from the publisher's own page]" for s in c["src"])
    txt = f"""MOAT ATLAS · Moat Snippets {NUM[sid]} ({sid}) · Short (DRAFT: built {__import__('datetime').date.today():%d %b %Y}; awaiting AK review; not posted)
Script and claim log: scripts/moat_snippets/final/FINAL_SCRIPTS.md and VERIFICATION_LOG.md (branch claude/moat-atlas-asian-paints-short)

VIDEO · 1080x1920 · moat-snippet-{lo}_DRAFT.mp4 · {dur:.1f} s (measured) · voice {tm['duration']:.1f} s + end card
Title: {title} #shorts
Title alt B: {c['b']} #shorts
Title alt C: {c['c']} #shorts
Hook on screen: {c.get('hook') or (hook[0] if hook else '(see the first caption)')}
Cover frame: {lo}_cover_DRAFT.jpg ({c['cover']} s, the hook caption over the opening drawing)
Description: {c['lead']}
Sources (read at the publisher; figures as shown on screen):
{src}
Educational research, not investment advice. Not SEBI-registered. Narration is an AI voice.
#MoatSnippets #MoatAtlas {c['tags']} #Moat
Pinned comment: {c['pin']}
Captions file: {lo}_DRAFT.en.srt (English, from the voice's word times)
Altered or synthetic content: Yes (AI narration, {VOICE})
Holdings disclosure line: [AK to fill: does AK or Darwin Research hold any company named in this video?]
Sound: code-made effects (scripts/moat_snippets/sfx.py), no licensed music or samples
{('Before posting: ' + c['open']) if c['open'] else 'Before posting: nothing open in the claim log for this snippet.'}
"""
    (KIT / f"youtube-moat-snippet-{lo}_DRAFT.txt").write_text(txt)
    print(f"{sid}: kit -> {KIT.name}/ ({dur:.1f} s)")


def readme(ids):
    rows = "\n".join(f"  {s}  moat-snippet-{s.lower()}_DRAFT.mp4   {field(s, 'Title').split(' | ')[0].strip()}" for s in ids)
    (KIT / "README.txt").write_text(f"""Moat Atlas · Moat Snippets: YouTube kits, DRAFTS for AK. Not posted. Nothing is scheduled.
Each snippet: the video (_DRAFT.mp4), English captions (.en.srt), a cover frame (_cover_DRAFT.jpg) and the upload text (youtube-...txt).
Voice: {VOICE}, an AI voice: set "Altered or synthetic content" to Yes. Sound effects are code-made (no licences).

{rows}

Not built yet: A3, A5, V4, V5. Their scripts rest on sources not yet read at the publisher (transcript vendors, news); see VERIFICATION_LOG.md.
Source links in each text file are left for AK to fill from the publisher's own page. Holdings disclosure is AK's to fill.
Built from MMVideo branch claude/moat-atlas-asian-paints-short: scripts/moat_snippets/ (voice.py, sfx.py, kit.py) and hyperframes/samples/s18-snippet-*.
""")


if __name__ == "__main__":
    ids = [a.upper() for a in sys.argv[1:]] or list(COPY)
    for s in ids: kit(s)
    readme([s for s in COPY if (KIT / f"moat-snippet-{s.lower()}_DRAFT.mp4").exists()])
