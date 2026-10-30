#!/usr/bin/env bash
# Rebuilds the derived assets for the DocusignVertical composition from the
# horizontal master in public/source/horizontal.mp4.
#   - public/footage/th1.mp4: opening talking head, cropped to 9:16 around the
#     speaker, with the burned-in horizontal lower third painted out
#   - public/brand/*.png: wordmark mattes pulled from the 4K end card
# Needs ffmpeg and Python 3 with numpy, pillow and opencv-python-headless.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=public/source/horizontal.mp4
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# Opening shot: frames 0-83, full-height 9:16 window centred on the face.
mkdir -p "$TMP/th1" public/footage
ffmpeg -v error -y -i "$SRC" -frames:v 84 -vf "crop=1215:2160:1170:0" "$TMP/th1/f_%03d.png"
python3 -I scripts/paint_out_lower_third.py "$TMP/th1"
ffmpeg -v error -y -framerate 25 -i "$TMP/th1/f_%03d.png" \
  -vf "scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -preset slow -crf 14 \
  -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 public/footage/th1.mp4

# Brand mattes from the end card.
ffmpeg -v error -y -ss 44 -i "$SRC" -frames:v 1 "$TMP/end.png"
python3 -I scripts/extract_wordmark.py "$TMP/end.png" public/brand
