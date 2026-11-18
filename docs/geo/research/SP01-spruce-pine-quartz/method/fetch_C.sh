#!/bin/zsh
# usage: fetch_C.sh ID slug URL  -> sources/ID_slug.txt (text); pdf handled via pdftotext
id=$1; slug=$2; url=$3
d=$(dirname $0)/../sources; tmp=$(mktemp -d)
curl -sL -m 60 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" -o $tmp/raw "$url"
{ echo "URL: $url"; echo "ACCESSED: 2026-11-11"; echo "---"; 
if head -c 5 $tmp/raw | grep -q '%PDF'; then pdftotext -layout $tmp/raw - ; else python3 -I -c "
import sys,re,html
t=open('$tmp/raw',errors='ignore').read()
t=re.sub(r'(?is)<(script|style|noscript).*?</\1>','',t)
t=re.sub(r'(?s)<[^>]+>','\n',t)
t=html.unescape(t)
print(re.sub(r'\n\s*\n+','\n',t))
"; fi; } > $d/${id}_${slug}.txt
wc -c $d/${id}_${slug}.txt
