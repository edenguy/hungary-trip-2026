#!/usr/bin/env bash
# Run before every commit: stamps a new build id into index.html, app.js, sw.js, version.json
set -e
cd "$(dirname "$0")"
V=$(date +%Y%m%d%H%M%S)
sed -i -E "s#(style\.css|app\.js|data\.js|mapdata\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#g" index.html
sed -i -E "s#const BUILD = '[0-9]*';#const BUILD = '$V';#" app.js
sed -i -E "s#const C='hu-trip-[0-9a-z]+'#const C='hu-trip-$V'#" sw.js
printf '{"v":"%s"}\n' "$V" > version.json
echo "build $V"
