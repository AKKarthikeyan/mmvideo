#!/bin/bash
while IFS='|' read -r cat h; do
  [ -s "raw/$h.json" ] && continue
  timeout 180 yt-dlp --flat-playlist --playlist-end 250 -J "https://www.youtube.com/@$h/shorts" > "raw/$h.json" 2>"raw/$h.err" || echo "fail $h"
  echo "$cat $h $(python3 -c "import json;D=json.load(open('raw/$h.json'));print(len(D.get('entries') or []), D.get('channel_follower_count'))" 2>/dev/null)"
  sleep 4
done < channels.txt
echo DONE
