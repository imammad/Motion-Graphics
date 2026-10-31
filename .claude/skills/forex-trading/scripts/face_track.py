# Face track for auto-reframing: writes src/Anfaal/faceTrack.json with one
# [cx, cy, h] entry per 1/6 s of public/anfaal/cut.mp4 (source pixels), smoothed.
import cv2, json, sys, numpy as np
cap = cv2.VideoCapture(sys.argv[1]); fps = cap.get(cv2.CAP_PROP_FPS)
cas = cv2.CascadeClassifier(sys.argv[3])
step = fps / 6; out = []; i = 0; nxt = 0.0
while True:
    ok, fr = cap.read()
    if not ok: break
    if i >= nxt:
        g = cv2.cvtColor(cv2.resize(fr, (540, 960)), cv2.COLOR_BGR2GRAY)
        fs = cas.detectMultiScale(g, 1.1, 6, minSize=(120, 120))
        if len(fs):
            x, y, w, h = max(fs, key=lambda f: f[2] * f[3])
            out.append([(x + w / 2) * 2, (y + h / 2) * 2, h * 2])
        else:
            out.append(None)
        nxt += step
    i += 1
# fill gaps, then smooth (keeps cuts sharp enough; 1 s window)
last = next(o for o in out if o)
for k, o in enumerate(out):
    if o is None: out[k] = last
    else: last = o
a = np.array(out, float)
cuts = [7.54, 15.52, 20.75, 27.1, 33.16, 42.66, 44.14, 51.73]
seg = np.searchsorted([c * 6 for c in cuts], np.arange(len(a)), side="right")
sm = a.copy()
for s in np.unique(seg):
    idx = np.where(seg == s)[0]
    for j in idx:
        lo, hi = max(idx[0], j - 4), min(idx[-1], j + 4)
        sm[j] = np.median(a[lo:hi + 1], axis=0)
json.dump([[round(v, 1) for v in r] for r in sm.tolist()], open(sys.argv[2], "w"))
print(len(sm), "min/max cy", sm[:, 1].min(), sm[:, 1].max(), "h", sm[:, 2].min(), sm[:, 2].max())
