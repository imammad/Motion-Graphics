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
)

for clip in "${clips[@]}"; do
  read -r name start end <<<"$clip"
  fade_out=$(python3 -c "print(round($end - $start - 0.12, 3))")
  ffmpeg -loglevel error -y -ss "$start" -to "$end" -i "$src" \
    -af "afade=t=in:d=0.06,afade=t=out:st=$fade_out:d=0.12" \
    -ar 48000 -ac 2 "$out/$name.wav"
  echo "wrote $out/$name.wav"
done
