# W4-05-tea: files that must stay on the SSD (never commit; the repo is public)

| File | Why local only |
|---|---|
| `sources/fortune1852_djvu.txt` | public domain (1852) but large archive.org OCR; keep local |
| `sources/jasb1835_assam_tea_djvu.txt` | public domain (1835) archive.org/DLI OCR; keep local |
| `sources/teaboard_prod_2025_2025-26.pdf`, `.txt` | Government of India PDF copy and its text; keep local |
- `sources/fortune1852_djvu_nobrackets.txt`: same OCR with stray < > turned into ( ) so the gate script does not read them as HTML tags (tr "<>" "()"; made 14 Nov).
