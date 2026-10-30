"""Word-level transcript + planner seed for a cut talking-head video.

    python3 tools/transcribe.py public/footage/client/edit/cut.mp4 src/Reels/edit

Writes <out>/transcript.json (every word with start/end seconds) and
<out>/plan.json (caption lines, ready to load in planner/index.html).
Runs fully offline with sherpa-onnx + NVIDIA Parakeet TDT 0.6B v2 (English).
First run: pip install sherpa-onnx numpy  (the model, ~480 MB, downloads itself).
"""
import json
import os
import re
import subprocess
import sys
import tarfile
import urllib.request
import wave

MODEL = "sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"
MODEL_URL = f"https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/{MODEL}.tar.bz2"
CACHE = os.path.expanduser("~/.cache/reelkit")
CHUNK_S = 20  # seconds per recognition chunk


def ensure_model():
    path = os.path.join(CACHE, MODEL)
    if not os.path.isdir(path):
        os.makedirs(CACHE, exist_ok=True)
        archive = path + ".tar.bz2"
        print("Downloading speech model (~480 MB)…")
        urllib.request.urlretrieve(MODEL_URL, archive)
        with tarfile.open(archive) as t:
            t.extractall(CACHE)
        os.remove(archive)
    return path


def load_audio(video):
    wav = os.path.join(CACHE, "audio16k.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-ac", "1", "-ar", "16000", wav], check=True)
    import numpy as np

    w = wave.open(wav)
    return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768, 16000


def transcribe(video):
    import sherpa_onnx

    d = ensure_model()
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=f"{d}/encoder.int8.onnx",
        decoder=f"{d}/decoder.int8.onnx",
        joiner=f"{d}/joiner.int8.onnx",
        tokens=f"{d}/tokens.txt",
        num_threads=os.cpu_count() or 4,
        model_type="nemo_transducer",
    )
    audio, sr = load_audio(video)
    words = []
    for i in range(0, len(audio), CHUNK_S * sr):
        s = rec.create_stream()
        s.accept_waveform(sr, audio[i : i + CHUNK_S * sr])
        rec.decode_stream(s)
        offset = i / sr
        for tok, t in zip(s.result.tokens, s.result.timestamps):
            # A token starting with a space begins a new word.
            if tok.startswith(" ") or not words or words[-1].get("_chunk") != i:
                words.append({"word": tok.strip(), "start": round(offset + t, 3), "_chunk": i})
            else:
                words[-1]["word"] += tok
    words = [w for w in words if w["word"]]
    for k, w in enumerate(words):
        nxt = words[k + 1]["start"] if k + 1 < len(words) else w["start"] + 0.4
        w["end"] = round(min(nxt, w["start"] + 0.8), 3)
        del w["_chunk"]
    return words


def caption_lines(words, max_words=10):
    """Group words into caption lines: break on sentence ends, commas after
    3+ words, pauses over 0.35 s, or max_words."""
    lines, cur = [], []
    for k, w in enumerate(words):
        cur.append(w)
        gap = words[k + 1]["start"] - w["end"] if k + 1 < len(words) else 9
        end_sentence = re.search(r"[.!?]$", w["word"])
        comma = re.search(r"[,;:]$", w["word"]) and len(cur) >= 3
        if end_sentence or comma or gap > 0.35 or len(cur) >= max_words:
            lines.append(cur)
            cur = []
    if cur:
        lines.append(cur)
    return lines


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    video, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    words = transcribe(video)
    with open(os.path.join(out, "transcript.json"), "w") as f:
        json.dump(words, f, indent=1)

    plan_lines = []
    for n, ln in enumerate(caption_lines(words), 1):
        text = " ".join(w["word"] for w in ln)
        plan_lines.append(
            {
                "id": f"L{n:02d}",
                "start": round(max(0, ln[0]["start"] - 0.05), 3),
                "end": round(ln[-1]["end"] + 0.05, 3),
                "text": text,
                "caption": [text],
                "captionTimes": [w["start"] for w in ln],
                "type": "captions",
                "notes": "",
            }
        )
    # Lines butt up against each other so there are no gaps between Sequences.
    for a, b in zip(plan_lines, plan_lines[1:]):
        a["end"] = b["start"]
    rel = os.path.relpath(video, "public") if video.startswith("public") else video
    plan = {"title": os.path.basename(os.path.normpath(out)), "speakerSrc": rel, "fps": 30, "width": 1080, "height": 1920, "lines": plan_lines}
    with open(os.path.join(out, "plan.json"), "w") as f:
        json.dump(plan, f, indent=1)
    print(f"{len(words)} words, {len(plan_lines)} caption lines → {out}/transcript.json, {out}/plan.json")


if __name__ == "__main__":
    main()
