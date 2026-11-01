import sys, cv2, numpy as np, json
S, src = sys.argv[1], sys.argv[2]
face = cv2.CascadeClassifier(S + '/models/haar_face.xml'); eye = cv2.CascadeClassifier(S + '/models/haar_eye.xml')
cap = cv2.VideoCapture(src); fps = cap.get(5); i = 0; res = []
while True:
    ok, fr = cap.read()
    if not ok: break
    if i % 2 == 0:
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        fs = face.detectMultiScale(cv2.resize(g, (540, 960)), 1.1, 6, minSize=(120, 120))
        if len(fs):
            x, y, w, h = [int(v * 2) for v in max(fs, key=lambda f: f[2] * f[3])]
            fg = g[y:y + h, x:x + w]
            sharp = cv2.Laplacian(fg, cv2.CV_64F).var()
            eyes = eye.detectMultiScale(fg[: h // 2], 1.1, 6, minSize=(w // 10, w // 10))
            mouth = fg[int(h * 0.68):int(h * 0.88), int(w * 0.3):int(w * 0.7)]
            dark = float((mouth < np.percentile(fg, 12)).mean())   # open mouth = dark gap
            L = fg[:, : w // 2].mean(); R = fg[:, w // 2:].mean()
            even = 1 - abs(L - R) / max(L, R)
            bright = fg.mean() / 255
            score = min(len(eyes), 2) * 1.0 + even * 2.0 - dark * 6.0 + min(sharp, 400) / 400 + (0.5 - abs(bright - 0.55))
            res.append(dict(t=round(i / fps, 2), score=round(score, 3), eyes=len(eyes), dark=round(dark, 3), even=round(even, 3), sharp=round(sharp), cx=x + w / 2, cy=y + h / 2, h=h))
    i += 1
res.sort(key=lambda r: -r['score'])
# keep candidates at least 1 s apart
pick = []
for r in res:
    if all(abs(r['t'] - p['t']) > 1.0 for p in pick): pick.append(r)
    if len(pick) == 16: break
json.dump(pick, open(sys.argv[3], 'w'))
for p in pick: print(p)
