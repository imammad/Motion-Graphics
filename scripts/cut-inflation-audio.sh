#!/usr/bin/env bash
# Cuts the voice clips the Inflation compositions are timed to from the raw
# episode audio. Usage: scripts/cut-inflation-audio.sh path/to/C0080.mp3
set -euo pipefail

src="${1:?usage: $0 path/to/C0080.mp3}"
out="$(dirname "$0")/../public/audio"
mkdir -p "$out"

# name start end (seconds into C0080)
clips=(
  "T1 84.0 96.6"
  "T2 96.75 110.95"
  "T3 175.1 191.5"
  "T4 195.0 215.0"
  "F01 40.4 61.8"
  "F02 110.6 122.95"
  "F03 140.1 158.1"
  "F04 238.0 256.2"
  "F05 256.2 275.6"
  "F06 276.3 291.1"
  "F07 291.3 312.5"
  "F08 319.9 333.0"
  "F09 366.4 387.8"
  "F10 397.3 414.9"
  "F11 438.9 465.0"
  "F12 503.0 532.0"
  "F13 566.4 582.0"
  "F14 581.9 601.2"
  "F15 601.0 620.0"
  "F16 717.8 749.6"
  "F17 819.0 840.4"
  "F18 852.9 899.6"
  "F19 993.2 1014.0"
  "I1 2.9 11.75"
  "I2 11.6 25.55"
  "I3 34.5 46.9"
)

for clip in "${clips[@]}"; do
  read -r name start end <<<"$clip"
  fade_out=$(python3 -c "print(round($end - $start - 0.12, 3))")
  ffmpeg -loglevel error -y -ss "$start" -to "$end" -i "$src" \
    -af "afade=t=in:d=0.06,afade=t=out:st=$fade_out:d=0.12" \
    -ar 48000 -ac 2 "$out/$name.wav"
  echo "wrote $out/$name.wav"
done
