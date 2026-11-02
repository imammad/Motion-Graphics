import sys, wave, numpy as np, sherpa_onnx, json
M=sys.argv[1]; wav=sys.argv[2]; lang=sys.argv[3]
w=wave.open(wav); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{M}/sherpa-onnx-whisper-turbo/turbo-encoder.int8.onnx",decoder=f"{M}/sherpa-onnx-whisper-turbo/turbo-decoder.int8.onnx",tokens=f"{M}/sherpa-onnx-whisper-turbo/turbo-tokens.txt",language=lang,task="transcribe",num_threads=4,tail_paddings=48000)
cfg=sherpa_onnx.VadModelConfig(); cfg.silero_vad.model=f"{M}/silero_vad.onnx"; cfg.silero_vad.min_silence_duration=0.15; cfg.silero_vad.min_speech_duration=0.2; cfg.silero_vad.max_speech_duration=8; cfg.silero_vad.threshold=0.4; cfg.sample_rate=16000
vad=sherpa_onnx.VoiceActivityDetector(cfg,buffer_size_in_seconds=200)
out=[]
def drain():
    while not vad.empty():
        seg=vad.front; st=seg.start/16000; n=len(seg.samples); a0=max(0,seg.start-1600); chunk=np.concatenate([a[a0:seg.start+n+3200],np.zeros(16000,np.float32)]); s=rec.create_stream(); s.accept_waveform(16000,chunk); rec.decode_stream(s)
        r=s.result; out.append(dict(start=round(st,2),end=round(st+len(seg.samples)/16000,2),text=r.text.strip()))
        print(f"{out[-1]['start']:7.2f}-{out[-1]['end']:7.2f} {out[-1]['text']}",flush=True); vad.pop()
for i in range(0,len(a),512):
    vad.accept_waveform(a[i:i+512]); drain()
vad.flush(); drain()
json.dump(out,open(sys.argv[4],"w"),ensure_ascii=False,indent=1)
