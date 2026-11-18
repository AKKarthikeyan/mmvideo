"""W3-08 Kochi: (1) Visscher's era arithmetic; (2) does any pre-1912 record we hold tie 1341/Vypeen to a flood?
Run: python3 -I method/era_check.py  (from the topic folder)"""
import re, pathlib
src = pathlib.Path("sources")
# (1) Visscher, letter dated in-text to 1723: Pooda Vaipum era began "383 years ago"
print("Visscher era start = 1723 - 383 =", 1723 - 383, "(Menon 1911 and Logan 1887 give A.D. 1341; difference 1 yr)")
print("Years from era start (1341) to first ship through the cut bar (1928):", 1928 - 1341)
print("Years from era start (1341) to 2026:", 2026 - 1341)
# (2) flood words within ~600 chars of the era / island passages
files = {"visscher1862_djvu.txt": r"Pooda Vaipum", "cochin_state_manual1911.txt": r"Pudu Vaip|Pucluvaipp|formation of the harbour in 1341",
         "logan_malabar_manual_v1.txt": r"Putuveppu"}
for f, pat in files.items():
    t = (src / f).read_text(errors="ignore")
    for m in re.finditer(pat, t):
        win = t[max(0, m.start() - 600): m.end() + 600]
        hits = re.findall(r"flood|inundat|deluge|Periyar|Alwaye river|Muziris|Muyiri", win, re.I)
        print(f"{f} @ char {m.start()} '{m.group(0)}': flood/Periyar/Muziris words nearby -> {hits or 'none'}")
