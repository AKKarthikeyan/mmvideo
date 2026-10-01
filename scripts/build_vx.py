#!/usr/bin/env python3
"""Build data for the Vox engine: validate phrases, crop PDF clippings, voice beats (MiniMax), write public/vx/<id>/data.json.
Usage: build_vx.py [--no-tts] [ids...]"""
import json, os, re, sys, time, pathlib
import fitz, requests
sys.path.insert(0, os.path.dirname(__file__))
from vx_scripts import VIDEOS

ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
R = pathlib.Path("/Users/akkarthikeyan/jev_full/research")
ZL = R / "zl"; TH = R / "themes"; AN = R / "anuras"; WS = R / "welspun"; AD = R / "adani"; KG = R / "kpigreen"; AQ = R / "autoq2"
CLIPS = {
  "zl_petition": (ZL/"corpaffairs_27092026003206_Upload.pdf", "approximately Rs. 821 crores", 4, 0),
  "zl_june": (ZL/"corpaffairs_17062026180110_Intimation.pdf", "the lender has decided to withdraw the Company Petition", 2, 1),
  "zl_impair": (ZL/"corpaffairs_29072026212228_Outcome_signed.pdf", "In the absence of assessment of impairment of the recoverable amount of Rs. 79,993.47 lakhs, we are unable to comment upon adjustments", 2, 1),
  "zl_noprov": (ZL/"corpaffairs_29072026212228_Outcome_signed.pdf", "the Company has not provided for any liability against the above Corporate Guarantee", 1, 2),
  "zl_gc": (ZL/"corpaffairs_29072026212228_Outcome_signed.pdf", "These conditions indicate existence of material uncertainty which may cast significant doubt", 1, 1),
  "npci_example": (TH/"npci_mdr_faq.pdf", "For a ₹3,000 purchase, applying the 0.4% rate results in an MDR fee of ₹12", 1, 2),
  "npci_committee": (TH/"npci_mdr_faq.pdf", "The operational parameters, fee distribution models, and category caps are decided by the UPI and Services Steering Committee", 1, 1),
  "paytm_rev": (TH/"PAYTM_PAYTM_15092026234600_SEDisclosureNPCICircularsd.pdf", "This will generate additional revenue from the merchant business for many of the payment transactions that were free earlier", 3, 1),
  "pine_quote": (TH/"PINELABS_PINELABS_24092026103059_PR_PLL.pdf", "With new monetization levers emerging, we want to walk the talk by investing back into the ecosystem", 2, 2),
  "irdai_unwound": (TH/"irdai_p1.pdf", "The discipline achieved over a decade has been unwound in the space of a few years and it is policyholders who have funded the reversal", 2, 0),
  "irdai_consequences": (TH/"irdai_p1.pdf", "restrictions on new product launches, restrictions on dividend distribution", 1, 1),
  "irdai_staff": (TH/"irdai_p1.pdf", "prohibit any volume linked or reward linked incentive for bank or NBFC staff selling insurance", 2, 1),
  "irdai_health": (TH/"irdai_p1.pdf", "have largely channelled underwriting margins into commissions and operating expenses rather than lower premiums", 1, 1),
  "irdai_access": (TH/"irdai_p1.pdf", "control over customer access", 3, 1),
  "irdai_leadgen": (TH/"irdai_p1.pdf", "Access to information should not be used as a lead generation opportunity", 3, 0),
  "pb_third": (pathlib.Path("/Users/akkarthikeyan/jev_full/docs/NSE_106793388.pdf"), "between one-third to 40% of what we have today", 2, 1),
  "pb_fy28": (pathlib.Path("/Users/akkarthikeyan/jev_full/docs/NSE_106793388.pdf"), "FY28 will be a year of challenges and discovery", 2, 0),
  "anu_24x": (AN/"NSE_106798927.pdf", "made at approximately 24x LTM earnings", 2, 1),
  "anu_util": (AN/"ANURAS_20082026173857_ARILSLDSTX20260820046Transcriptofearningscall.pdf", "improve the utilization of the company's assets to 60% to 70%", 3, 2),
  "anu_bain": (AN/"NSE_106798927.pdf", "non-voting instruments from a group of financial investors led by Bain Capital", 2, 2),
  "anu_trigger": (AN/"ANURAS_23092026235444_ARILSLDSTX20260923063Regulation30Disclosure.pdf", "identified event of default scenarios in connection with financing availed by MVCPL", 3, 1),
  "anu_option": (AN/"ANURAS_23092026235444_ARILSLDSTX20260923063Regulation30Disclosure.pdf", "The INR 1 purchase consideration reflects the distressed-scenario nature of the trigger conditions", 3, 0, 2),
  "ada_mps": (AD/"SEBI_settlement_adani_20260928.pdf", "alleging violations relating to non-compliance with MPS requirements", 2, 1),
  "ada_paid": (AD/"SEBI_settlement_adani_20260928.pdf", "Applicants have remitted the aforesaid settlement amounts on August 26, 2026", 1, 1),
  "ada_noadmit": (AD/"SEBI_settlement_adani_20260928.pdf", "without admitting or denying the facts and conclusions of law", 2, 1, 2),
  "ada_final": (AD/"SEBI_settlement_adani_20260928.pdf", "SEBI shall not initiate any other enforcement action against Applicants", 1, 1),
  "ada_various": (AD/"SEBI_settlement_adani_20260928.pdf", "various entities including the Applicants", 1, 2),
  "ada_aesl": (AD/"AESL_22092026.pdf", "The settlement amount is INR 9,75,000", 2, 2),
  "pb_manuf": (pathlib.Path("/Users/akkarthikeyan/jev_full/docs/NSE_106793388.pdf"), "higher probability of us having some manufacturing capability of our own", 2, 1),
  "wel_aug": (WS/"WELCORP_20082026225650_SEintimationsigned.pdf", "largest single order in its history", 1, 1),
  "wel_sep": (WS/"WELCORP_25092026082837_SEDisclosureUSOrdersigned.pdf", "USD 4.7 billion", 2, 1),
  "wel_zero": (WS/"welspun_q3fy26_transcript.pdf", "commercially unviable", 3, 0),
  "wel_local": (WS/"welspun_q3fy26_transcript.pdf", "tariff per se is something which is not impacting us", 1, 0, 1),
  "wel_protect": (WS/"AR_29836_WELCORP_2025_2026_A_27280476_16072026201247.pdf", "protection against imports", 3, 0, None, True),
  "wel_largest": (WS/"AR_29836_WELCORP_2025_2026_A_27280476_16072026201247.pdf", "We are the largest manufacturer in the USA", 0, 3, None, True),
  "wel_booked": (WS/"AR_29836_WELCORP_2025_2026_A_27280476_16072026201247.pdf", "remains substantially booked until FY 2027-28", 1, 0, 3, True),
  "kpi_binding": (KG/"KPIGLOBAL_30092026101722_7_KPI_Green_Acquire_Alfanar_30092026_Signed.pdf", "binding offer dated September 29, 2026", 1, 2),
  "kpi_ev": (KG/"KPIGLOBAL_30092026101722_7_KPI_Green_Acquire_Alfanar_30092026_Signed.pdf", "2,410 Crores", 2, 1),
  "kpi_seci": (KG/"KPIGLOBAL_30092026102112_8_KPI_Green_Acquire_Alfanar_Press_Release_30092026_Signed.pdf", "25-year power purchase agreements", 1, 3),
  "kpi_debt": (KG/"KPIGLOBAL_18082026195034_20_Intimation_Transcript_of_Earning_Conference_Call_to_Exchange_Signed.pdf", "debt to equity will be in the comfortable position of 3:1", 2, 1),
  "kpi_bs": (KG/"KPIGLOBAL_18082026195034_20_Intimation_Transcript_of_Earning_Conference_Call_to_Exchange_Signed.pdf", "We prepare the balance sheet in the half yearly only", 1, 1),
  "aq_gst": (AQ/"ESCORTS2_01102026090533_EKL_Sept2026_volume_F_Signed.pdf", "high base following the GST rate reduction in September 2025", 1, 2),
  "aq_tataev": (AQ/"TATAMOTORSSJS_01102026131705_NSEBSEQ2FY27.pdf", "EV penetration in our portfolio rising sharply to 23%", 1, 1),
  "aq_re": (AQ/"EICHERMOT_01102026111841_EMLMonthlyBusinessUpdate1stOctober2026Signed__1_.pdf", "Models with engine capacity exceeding 350cc", 3, 2),
}

def crop(name, pdf, phrase, up, dn, outdir, last=None, col=False):
    d = fitz.open(pdf)
    for pno, p in enumerate(d):
        hits = p.search_for(phrase)
        if hits:
            if last: hits = hits[-last:]
            break
    else:
        raise SystemExit(f"clip {name}: phrase not found in {pdf.name}: {phrase[:60]}")
    L = []
    band = None
    if col:   # multi-column pages (annual reports): keep only lines in the hit's column
        blk = [fitz.Rect(b["bbox"]) for b in p.get_text("dict")["blocks"] if any(fitz.Rect(b["bbox"]).intersects(h) for h in hits)]
        band = (min(r.x0 for r in blk) - 4, max(r.x1 for r in blk) + 4)
    for b in p.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            r = fitz.Rect(l["bbox"])
            if r.width < 2: continue
            if band and not (band[0] <= (r.x0 + r.x1) / 2 <= band[1]): continue
            for m in L:
                if abs(m.y0 - r.y0) < 3 and abs(m.y1 - r.y1) < 3: m.include_rect(r); break
            else: L.append(r)
    L.sort(key=lambda r: r.y0)
    li = lambda y: min(range(len(L)), key=lambda i: abs((L[i].y0 + L[i].y1) / 2 - y))
    a = max(0, li(min((h.y0 + h.y1) / 2 for h in hits)) - up); z = min(len(L) - 1, li(max((h.y0 + h.y1) / 2 for h in hits)) + dn)
    top = max((L[a].y0 + L[a-1].y1) / 2 if a > 0 else L[a].y0 - 6, L[a].y0 - 8)
    bot = min((L[z].y1 + L[z+1].y0) / 2 if z + 1 < len(L) else L[z].y1 + 6, L[z].y1 + 8)
    sel = L[a:z+1]
    clip = fitz.Rect(min(r.x0 for r in sel) - 16, top, max(r.x1 for r in sel) + 16, bot) & p.rect
    pix = p.get_pixmap(matrix=fitz.Matrix(3, 3), clip=clip); pix.save(outdir / f"{name}.png")
    bands = []
    for h in hits:
        r = [(h.x0 - clip.x0 - 3) / clip.width, (h.y0 - clip.y0 - 1) / clip.height, (h.width + 6) / clip.width, (h.height + 2) / clip.height]
        if bands and abs(bands[-1][1] - r[1]) < 0.02: bands[-1][2] = r[0] + r[2] - bands[-1][0]
        else: bands.append(r)
    return {"w": pix.width, "h": pix.height, "hl": [[round(v, 4) for v in b] for b in bands], "page": pno + 1, "quote": phrase}

def chunks(t, lim=78):
    out = []
    for s in re.findall(r'.+?(?:[.!?:]["”]?(?=\s|$)|$)', t):
        s = s.strip()
        while len(s) > lim:
            c = s.rfind(", ", 0, lim)
            cut = c + 1 if c > lim * 0.45 else s.rfind(" ", 0, lim)
            out.append(s[:cut].strip()); s = s[cut:].strip()
        if s: out.append(s)
    return out

def phrases(scene):
    out = []
    def walk(x):
        if isinstance(x, dict):
            for k, v in x.items():
                if k in ("at", "hl") and isinstance(v, str): out.append(v)
                elif k == "hl" and isinstance(v, list): out.extend(v)
                elif k == "add" and isinstance(v, list): out.extend(v)
                else: walk(v)
        elif isinstance(x, list):
            for v in x: walk(v)
    walk(scene); return out

def tts(text, path, voice="English_Diligent_Man"):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text.replace("MoatSCORE", "Moat Score"), "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            open(path, "wb").write(bytes.fromhex(j["data"]["audio"])); return j["extra_info"]["audio_length"] / 1000
        print("  retry", path.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))   # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + path.name)

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; notts = "--no-tts" in sys.argv
    for V in VIDEOS:
        if args and V["id"] not in args: continue
        out = ROOT / V["id"]; (out / "clips").mkdir(parents=True, exist_ok=True)
        bad = []
        for b in V["beats"]:
            b["cap"] = b["cap"] or b["say"]
            for p in phrases(b["scene"]):
                if isinstance(p, str) and p.split("|")[0].lower() not in b["say"].lower(): bad.append((b["key"], p))
        if bad: raise SystemExit(f"{V['id']}: phrases not in narration: {bad}")
        clips = {}
        for b in V["beats"]:
            c = b["scene"].get("clip")
            if c and c not in clips:
                pdf, ph, up, dn, *ex = CLIPS[c]; clips[c] = crop(c, pdf, ph, up, dn, out / "clips", *ex)
        old = {}
        if (out / "data.json").exists():
            old = {b["key"]: b for b in json.load(open(out / "data.json"))["beats"]}
        for b in V["beats"]:
            mp3 = out / f"{b['key']}.mp3"
            o = old.get(b["key"])
            if mp3.exists() and o and o.get("say") == b["say"]: b["sec"] = o["sec"]
            elif notts: b["sec"] = max(3.0, len(b["say"]) / 15)
            else: b["sec"] = round(tts(b["say"], mp3), 2); print(" voiced", b["key"], b["sec"])
            b["cues"] = chunks(b["cap"])
        data = {k: V[k] for k in ("id", "title", "chapters", "shorts")}
        data["timelines"] = V.get("timelines", {}); data["beats"] = V["beats"]; data["clips"] = clips
        json.dump(data, open(out / "data.json", "w"), indent=1, ensure_ascii=False)
        tot = sum(b["sec"] for b in V["beats"])
        print(f"{V['id']}: {len(V['beats'])} beats, {tot/60:.2f} min narration, {len(clips)} clips")

if __name__ == "__main__":
    main()
