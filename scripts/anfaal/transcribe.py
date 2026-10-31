import sys, wave, json, numpy as np, sherpa_onnx
M=sys.argv[1]; a=np.frombuffer(wave.open(sys.argv[2]).readframes(10**9),dtype=np.int16).astype(np.float32)/32768
segs=json.load(open(sys.argv[3]))
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{M}/sherpa-onnx-whisper-turbo/turbo-encoder.int8.onnx",decoder=f"{M}/sherpa-onnx-whisper-turbo/turbo-decoder.int8.onnx",tokens=f"{M}/sherpa-onnx-whisper-turbo/turbo-tokens.txt",language="ur",task="transcribe",num_threads=4,tail_paddings=48000)
SR=16000; F=320
def split(s,e):
    if e-s<=3.6*SR: return [(s,e)]
    lo,hi=s+int(1.8*SR),min(e-int(1.2*SR),s+int(3.4*SR))
    fr=[(np.sqrt(np.mean(a[i:i+F]**2)),i) for i in range(lo,hi,F//2)]
    c=min(fr)[1]+F//2
    return [(s,c)]+split(c,e)
out=[]
for g in segs:
    for s,e in split(int(g['start']*SR),int(g['end']*SR)):
        ch=np.concatenate([np.zeros(1600,np.float32),a[s:e],np.zeros(16000,np.float32)])
        st=rec.create_stream(); st.accept_waveform(SR,ch); rec.decode_stream(st)
        out.append(dict(start=round(s/SR,2),end=round(e/SR,2),text=st.result.text.strip()))
        print(f"{out[-1]['start']:7.2f}-{out[-1]['end']:7.2f} {out[-1]['text']}",flush=True)
json.dump(out,open(sys.argv[4],'w'),ensure_ascii=False,indent=1)
