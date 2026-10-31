# Pipeline (with the fixes already found)

Scripts are in `scripts/` next to this file (also in the repo at `scripts/anfaal/`). Put scratch files in the
session scratchpad, run Python on downloaded data with `-I`.

## 1. Probe

`ffprobe` duration/size/fps; contact sheet `fps=1/10,scale=270:-1,tile=7x2`. Phone takes are usually 1080×1920,
24 or 30 fps, with constant car/room hum (so silence detection by level fails; use VAD).

## 2. Transcribe (no Hugging Face / OpenAI hosts in this sandbox)

Allowed hosts: GitHub releases, PyPI, npm. Working recipe:

```bash
pip install sherpa-onnx onnxruntime
curl -L -o turbo.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2
curl -L -o silero_vad.onnx https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
ffmpeg -i raw.mp4 -ac 1 -ar 16000 a.wav
```

- Whisper turbo drops the last word of long chunks: pass `tail_paddings=48000`, and split VAD segments into
  ≤ 3.6 s pieces at their quietest 20 ms frame (`transcribe.py` does this). Run two passes (long + short chunks)
  and merge by reading both.
- Urdu speech comes out in Urdu script: write the Roman Urdu captions yourself from it.
- Find clean cut points: 10 ms RMS of a 150–5000 Hz band-passed track, gaps below the 22nd percentile ≥ 80 ms.
  Confirm each clip's first/last words by transcribing 1.6 s at each end.

## 3. Cut, grade, voice

`python3 build_cut.py raw.mp4`: edit the `cuts` list (source seconds). It trims, adds 20–30 ms audio fades,
concats, grades, cleans the voice and writes `public/<project>/cut.mp4`. Record the source → cut map at the top of
`timeline.ts`.

## 4. Person cut-out (for words behind the head)

MediaPipe ≥ 1.0 ships no model, so use rembg's U²-Net human model from GitHub releases:

```bash
curl -L -o human_seg.onnx https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx
python3 segment_person.py human_seg.onnx public/x/cut.mp4 mask.mp4      # ~0.5 s/frame on 4 CPUs, run in background
ffmpeg -i public/x/cut.mp4 -i mask.mp4 -filter_complex "[1:v]format=gray[m];[0:v][m]alphamerge,format=yuva420p" \
  -an -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 6M -deadline good -cpu-used 4 -row-mt 1 public/x/person.webm
```

The mask is clean on hair/head, rough on seats and seatbelts, so only use it where it sits over the head. In
Remotion, mount `person.webm` (`transparent`, `muted`, `trimBefore={from}`) only inside the behind-word sequences.

## 5. Face track (where captions may go)

OpenCV 5 wheels have no Haar files and raw.githubusercontent is blocked, so take the XML out of the 4.x wheel:

```bash
pip download --no-deps opencv-python-headless==4.10.0.84 -d cv4
python3 -c "import zipfile,glob;z=zipfile.ZipFile(glob.glob('cv4/*.whl')[0]);open('haar_face.xml','wb').write(z.read('cv2/data/haarcascade_frontalface_default.xml'))"
python3 face_track.py public/x/cut.mp4 faceTrack.json haar_face.xml
```

Take the per-clip median (cx, cy, h) into `FACE_SEG` in `timeline.ts`. Box bottom ≈ chin, hair top ≈ cy − 0.85·h.
Phone selfies put the chin around y 1500, so captions go **above** the head; there's no room under the chin
inside the safe zone.

## 6. Audio

`python3 make_audio.py` writes `music.wav` (length `DUR`, section switches in `drums_on`, low-pass window for the
lesson) and `sfx/whoosh|pop|thud.wav`. Edit those times for each reel.

## 7. Remotion

- `npm ci`, then fonts: `npm i --no-save @fontsource/anton @fontsource/jetbrains-mono` and copy the woff2 files to `public/fonts/`.
- Browser: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
  (adjust the build number via `ls /opt/pw-browsers`).
- Stills: `npx remotion still AnfaalFOMC out/s.png --frame=N --scale=0.5`, then `hstack` into one sheet and look at it.
- Render: `npx remotion render AnfaalFOMC out/x.mp4 --concurrency=4 --crf=18 --audio-bitrate=256k`
  (60 s ≈ 10–15 min, run in background). Check `ebur128` ≈ −14 LUFS and the peak below −0.5 dB.
- The speaker `OffthreadVideo` must be `muted`; voice comes from a separate `<Audio src=cut.mp4>`.
- Git-ignore `cut.mp4` and `person.webm` (too big); commit code, scripts, fonts, small images, sfx, music.
