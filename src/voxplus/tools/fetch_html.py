# Fetch a page through headless Chromium (the Berkshire site serves Brotli only) and save its HTML: fetch_html.py URL OUT
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    r = pg.goto(url, wait_until="load", timeout=60000)
    open(out, "w").write(pg.content())
    print(r.status, len(pg.content()))
    b.close()
