#!/usr/bin/env bash
# Tiles 4 stills into a 2×2 design board for review:
#   contact_sheet.sh out.jpg a.png b.png c.png d.png
set -euo pipefail
out=$1; shift
ffmpeg -loglevel error -y -i "$1" -i "$2" -i "$3" -i "$4" \
  -filter_complex "xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0" "$out"
echo "wrote $out"
