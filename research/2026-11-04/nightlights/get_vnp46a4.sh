#!/bin/zsh
# Download NASA Black Marble annual night lights (VNP46A4, collection 002) for India's 16 tiles.
# Run on the Mini inside the login shell so the token loads (it is never printed):
#   zsh -lic 'research/2026-11-04/nightlights/get_vnp46a4.sh 2012 2025'
# Needs EARTHDATA_TOKEN in ~/.zshrc (urs.earthdata.nasa.gov -> Generate Token).
set -u
[[ -z "${EARTHDATA_TOKEN:-}" ]] && { echo "EARTHDATA_TOKEN is not set in this shell"; exit 1; }
here=${0:A:h}
base=https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/5200/VNP46A4
for y in "${@:-2012 2025}"; do
  out=$here/vnp46a4/$y; mkdir -p $out
  files=$(curl -s -m 60 "$base/$y/001.json" | python3 -I -c "
import json,sys
for x in json.load(sys.stdin)['content']:
    n=x['name']
    if any('h%02dv%02d'%(h,v) in n for h in range(24,28) for v in range(5,9)): print(n)")
  for f in ${(f)files}; do
    [[ -s $out/$f ]] && { echo "have $f"; continue; }
    code=$(curl -s -L -m 600 -H "Authorization: Bearer $EARTHDATA_TOKEN" -o $out/$f.part -w "%{http_code}" "$base/$y/001/$f")
    if [[ $code == 200 && "$(head -c 4 $out/$f.part | xxd -p)" == 89484446 ]]; then mv $out/$f.part $out/$f; echo "got  $f"
    elif head -c 2000 $out/$f.part | grep -qi "<html\|<!doctype"; then rm -f $out/$f.part
      echo "STOP: LAADS sent a login/licence page. Accept the licence once in a browser:"
      echo "  https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/5200/VNP46A4/$y/001/$f"; exit 2
    else rm -f $out/$f.part; echo "FAIL $f (HTTP $code)"; fi
  done
done
