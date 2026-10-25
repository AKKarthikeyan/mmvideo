# Assemble the Week 2 review sheet from docs/geo/week2/drafts/*.md (AK 25 Oct 2026).
#   python3 scripts/geo/week2_sheet.py   ->  docs/geo/week2/WEEK2_SCRIPTS.md
import re

D = "docs/geo/week2/"
ORDER = [("minicoy", "1 AM", "India"), ("austria", "1 PM", "Global"), ("kuttanad", "2 AM", "India"), ("sikhpolice", "2 PM", "Global"),
         ("seazone", "3 AM", "India"), ("nainsingh", "3 PM", "India"), ("thumba", "4 AM", "India"), ("zanzibar", "4 PM", "Global"),
         ("barmer", "5 AM", "India"), ("berenike", "5 PM", "Global"), ("panipat", "6 AM", "India"), ("bhitarkanika", "6 PM", "India"),
         ("thibaw", "7 AM", "India"), ("narcondam", "7 PM", "India")]
STATUS = {"sikhpolice": "558 confirmed on the printed 1936 page (p. 90)",
          "thumba": "Ready for review (rocket's make left out, AK 25 Oct)",
          "bhitarkanika": "Count shown as 1,800+ (official counts 1,809–1,880)"}
SLOW, FAST = 2.89, 3.39          # spoken words per second, measured on Week 1 renders

rows, body = [], []
for id_, slot, aud in ORDER:
    s = open(f"{D}drafts/{id_}.md").read()
    title = re.search(r"^## (.+)$", s, re.M).group(1)
    words = sum(len(m.group(1).split()) for m in re.finditer(r"^\|\s*\d\s*\|\s*([^|]+)\|", s, re.M))
    m = re.search(r"-\s*\*?\*?[AB]\*?\*?:?\s*\"?([^\n]*?)\"?\s*\*\(recommended\)\*", s)
    hook = m.group(1).strip(' "*') if m else "see script"
    rows.append(f"| {slot} | {aud} | [{title}](#{id_}) | {hook} | {words} | {words / FAST:.0f}–{words / SLOW:.0f} s | {s.count('⚠')} | "
                f"{STATUS.get(id_, 'Ready for review')} |")
    body.append(f'\n---\n\n<a id="{id_}"></a>\n\n**Day {slot} · {aud}**\n\n' + s.strip() + "\n")

hdr = ["# Indica Atlas: Week 2 scripts (14 \"Why\" Shorts) for AK's review", "",
       "Drafted 25 Oct 2026. **Nothing is voiced until AK approves.**", "",
       "**Format:** 9 beats, 85–100 spoken words. **Length rule (AK): 25–35 s, never more.** The time column uses Week 1's measured",
       "pace (2.9–3.4 words a second). Each render is checked before packing.", "",
       "**Sources:** every claim was read at a primary source (government pages, treaty texts, period reports, excavation reports, peer-reviewed",
       "papers, UN Comtrade). There is no Wikipedia or news behind any figure. ⚠ marks a claim with only one source, or where sources disagree;",
       "each fact table says why.", "",
       "**Swapped on AK's call:** Attock 1758 (historians disagree it happened) → Thumba. Floating post office (no official source) →",
       "Bhitarkanika. The old drafts are in `drafts/dropped/`.", "",
       "**Spot-checked by me at source:**",
       "- Panipat, UN Comtrade: India imported 160,253,570 kg of worn clothing (HS 6309) in 2024 ✅",
       "- Sikh police, Shanghai Municipal Council 1936 report, printed page 90: the Sikh column adds to 558 ✅", "",
       "| Day | India/Global | Script | Recommended hook | Words | Length | ⚠ | Status |", "|---|---|---|---|---|---|---|---|"]
open(D + "WEEK2_SCRIPTS.md", "w").write("\n".join(hdr + rows) + "\n" + "".join(body))
print("\n".join(rows))
