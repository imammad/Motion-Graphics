import sys, numpy as np, onnxruntime as ort, cv2, subprocess
M, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
lim = int(sys.argv[4]) if len(sys.argv)>4 else 10**9
sess = ort.InferenceSession(M, providers=["CPUExecutionProvider"])
inp = sess.get_inputs()[0].name
cap = cv2.VideoCapture(src); W,H=1080,1920
mean=np.array([0.485,0.456,0.406]); std=np.array([0.229,0.224,0.225])
# output: grayscale mask video
p = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","gray","-s",f"{W}x{H}","-r","24","-i","-","-c:v","libx264","-crf","12","-pix_fmt","yuv420p",out],stdin=subprocess.PIPE)
prev=None; i=0
while i<lim:
    ok, fr = cap.read()
    if not ok: break
    x = cv2.resize(cv2.cvtColor(fr,cv2.COLOR_BGR2RGB),(320,320)).astype(np.float32)/255
    x = ((x-mean)/std).transpose(2,0,1)[None].astype(np.float32)
    m = sess.run(None,{inp:x})[0][0,0]
    m = (m-m.min())/(m.max()-m.min()+1e-6)
    m = cv2.resize(m,(W,H),interpolation=cv2.INTER_CUBIC)
    if prev is not None: m = 0.6*m+0.4*prev
    prev=m
    mm = np.clip((m-0.35)/0.3,0,1)
    mm = cv2.GaussianBlur(mm,(9,9),0)
    p.stdin.write((mm*255).astype(np.uint8).tobytes()); i+=1
    if i%100==0: print(i,flush=True)
p.stdin.close(); p.wait()
