# Pipeline (commands + environment fixes)

Scripts are in `scripts/`. Put scratch files in the session scratchpad; run Python on downloaded data with `-I`.

## 1. Grade + voice (client already cut the video)

```bash
ffmpeg -i Main.mp4 -filter_complex "[0:v]curves=all='0/0.02 0.25/0.24 0.5/0.5 0.85/0.86 1/0.97',colorbalance=rs=-0.02:bs=0.03:gm=0.01:rh=0.01,eq=contrast=1.07:saturation=1.04,format=yuv420p[v];[0:a]highpass=f=80,afftdn=nf=-30:nr=12:tn=1,lowpass=f=13000,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 15 -r 24 -c:a aac -b:a 192k public/<proj>/cut.mp4
```

## 2. Transcribe (Hugging Face / OpenAI hosts are blocked; GitHub releases + PyPI work)

```bash
pip install sherpa-onnx onnxruntime
curl -L -o turbo.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2 && tar xjf turbo.tar.bz2
curl -L -o silero_vad.onnx https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
ffmpeg -i cut.mp4 -ac 1 -ar 16000 a.wav
python3 transcribe_vad.py <models_dir> a.wav ur segs.json      # long chunks
python3 transcribe.py <models_dir> a.wav segs.json fine.json    # ≤3.6 s chunks (better endings)
python3 transcribe_window.py <models_dir> a.wav ur 14.0:16.6 …  # re-check unclear windows (also try 'en')
```

Whisper drops chunk endings: always `tail_paddings=48000` and short chunks. Urdu comes out in Urdu script:
write Roman Urdu yourself. Flag words you're unsure of in the report.

## 3. Jump cuts (real ones only)

Compare frames using only the static background (top rows + side strips), ignore the periodic encoder-keyframe
spikes (~every 2 s, small), then confirm candidates visually (frame before/after). Extract the outgoing frozen
frame per cut: `ffmpeg -ss <cut-0.045> -i cut.mp4 -frames:v 1 public/<proj>/cut_<t>.png`.

## 4. Face, cut-out, cover frame

- Face track: Haar XML from the OpenCV 4 wheel (`pip download --no-deps opencv-python-headless==4.10.0.84`,
  unzip `cv2/data/haarcascade_frontalface_default.xml`), then `face_track.py`.
- Cover frame: `best_frame.py` (needs `haarcascade_eye_tree_eyeglasses.xml` from the same wheel) scores open eyes,
  closed mouth, even light, sharpness; send a numbered sheet, client picks.
- Cut-out: U²-Net human model from GitHub releases
  (`https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx`) via
  `segment_person_refined.py model cut.mp4 mask.mp4 "start-end"`: guided filter needs a **float32 guide scaled 0–1**
  (`np.nan_to_num` the result), else masks get holes. Keep the largest blob. If the mask grabs background objects,
  use GrabCut with a trimap (definite background zones + face core as foreground).

## 5. Music (client-supplied file)

```bash
ffmpeg -i song.mp4 -vn -ac 2 -ar 48000 song.wav
# find a beat onset near the requested time (10 ms RMS, biggest rise), then:
ffmpeg -ss <onset> -t <reel+0.3> -i song.wav -af "loudnorm=I=-30:TP=-9:LRA=7,afade=t=out:st=<reel-1.5>:d=1.6" public/<proj>/music.wav
```

`loudnorm` TP must be ≥ −9.

## 6. Remotion

- Fonts: copy `assets/template/public/fonts/*` to `public/fonts/` (`design.tsx` loads them).
- Browser: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
- Stills: `npx remotion still <Id> out.png --frame=N --scale=0.3`, then hstack/xstack into contact sheets.
  A still at frame 0 shows text not yet revealed; use a later frame or a negative `at` for boards.
- Render: `npx remotion render <Id> out.mp4 --concurrency=4 --crf=16 --audio-bitrate=256k` (74 s ≈ 15–25 min,
  run in background). Verify `ebur128` ≈ −14 LUFS, `astats` peak < −1 dB.
- Speaker `OffthreadVideo` muted; voice via `<Audio src=cut.mp4>`; music via `<Audio src=music.wav>`.
- Don't `pkill -f` a pattern that appears in your own command line (it kills the shell); use `pkill -f "[r]emotion render"`.
- Git-ignore `cut.mp4` and `music.wav`; commit code, fonts, small images, freeze frames.
