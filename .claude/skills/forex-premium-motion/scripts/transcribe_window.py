import sys, wave, numpy as np, sherpa_onnx
M=sys.argv[1]; a=np.frombuffer(wave.open(sys.argv[2]).readframes(10**9),dtype=np.int16).astype(np.float32)/32768
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{M}/sherpa-onnx-whisper-turbo/turbo-encoder.int8.onnx",decoder=f"{M}/sherpa-onnx-whisper-turbo/turbo-decoder.int8.onnx",tokens=f"{M}/sherpa-onnx-whisper-turbo/turbo-tokens.txt",language=sys.argv[3],task="transcribe",num_threads=4,tail_paddings=48000)
for p in sys.argv[4:]:
    s,e=map(float,p.split(':'))
    ch=np.concatenate([np.zeros(1600,np.float32),a[int(s*16000):int(e*16000)],np.zeros(16000,np.float32)])
    st=rec.create_stream(); st.accept_waveform(16000,ch); rec.decode_stream(st); print(p,st.result.text,flush=True)
