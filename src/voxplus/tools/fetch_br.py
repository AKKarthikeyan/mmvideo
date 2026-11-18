# Fetch a URL that is served Brotli-only (berkshirehathaway.com) and save the decoded bytes: fetch_br.py URL OUT
import sys, urllib.request, brotli
req = urllib.request.Request(sys.argv[1], headers={"User-Agent": "Mozilla/5.0 (MoatMargin research)", "Accept-Encoding": "br"})
r = urllib.request.urlopen(req); d = r.read()
if r.headers.get("Content-Encoding") == "br": d = brotli.decompress(d)
open(sys.argv[2], "wb").write(d); print(r.status, len(d))
