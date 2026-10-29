"""Word-level timestamps for a voice-over, to cue animation beats on words.

    pip install faster-whisper
    python word_timestamps.py <audio file> [--model small] [--start 0] [--end 60]

Prints one line per segment as "<seconds>:<word>" pairs, absolute to the
source file. --model accepts a model name or a local CTranslate2 model folder
(useful when Hugging Face is blocked: copy one in from elsewhere).
"""

import argparse
import subprocess

import numpy as np
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("--model", default="small")
ap.add_argument("--start", type=float, default=0.0)
ap.add_argument("--end", type=float, default=None)
args = ap.parse_args()

# Decode with ffmpeg to 16 kHz mono float32 (avoids PyAV quirks).
cmd = ["ffmpeg", "-loglevel", "error", "-ss", str(args.start)]
if args.end is not None:
    cmd += ["-to", str(args.end)]
cmd += ["-i", args.audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"]
audio = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32)

model = WhisperModel(args.model, device="cpu", compute_type="int8")
segments, _ = model.transcribe(audio, language="en", word_timestamps=True, beam_size=5)
for seg in segments:
    print(" ".join(f"{args.start + w.start:.2f}:{w.word.strip()}" for w in seg.words), flush=True)
