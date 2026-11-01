# Smoother roto: U2-Net human mask at 512 px, temporal EMA, edge refinement with a
# guided filter on the full-res frame (hair edges follow the image), soft feather.
# Frames outside the windows get an empty mask (only behind-head moments need it).
# usage: segment_person_refined.py model.onnx cut.mp4 mask.mp4 "6.8-9.2,30.5-33.0"
import sys, numpy as np, onnxruntime as ort, cv2, subprocess
M, src, out, wins = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
wins = [tuple(map(float, w.split("-"))) for w in wins.split(",")]
sess = ort.InferenceSession(M, providers=["CPUExecutionProvider"]); inp = sess.get_inputs()[0].name
cap = cv2.VideoCapture(src); fps = cap.get(5); W, H = 1080, 1920
mean = np.array([0.485, 0.456, 0.406]); std = np.array([0.229, 0.224, 0.225])
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
                      "-c:v", "libx264", "-crf", "10", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
prev = None; i = 0; zero = np.zeros((H, W), np.uint8)
while True:
    ok, fr = cap.read()
    if not ok: break
    t = i / fps; i += 1
    if not any(a <= t <= b for a, b in wins):
        prev = None; p.stdin.write(zero.tobytes()); continue
    x = cv2.resize(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB), (320, 320)).astype(np.float32) / 255
    x = ((x - mean) / std).transpose(2, 0, 1)[None].astype(np.float32)
    m = sess.run(None, {inp: x})[0][0, 0]
    m = (m - m.min()) / (m.max() - m.min() + 1e-6)
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    m = prev * 0.45 + m * 0.55 if prev is not None else m   # temporal smoothing
    prev = m
    guide = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    m = np.nan_to_num(cv2.ximgproc.guidedFilter(guide, np.ascontiguousarray(m, np.float32), 10, 2e-3))  # snap edges to hair
    m = np.clip(m, 0, 1)
    m = np.clip((m - 0.3) / 0.4, 0, 1)
    m = cv2.GaussianBlur(m, (5, 5), 0)
    p.stdin.write(np.ascontiguousarray((m * 255).astype(np.uint8)).tobytes())
p.stdin.close(); p.wait(); print("done", i)
