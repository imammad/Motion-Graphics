# Original music bed + soft SFX for the Anfaal reel (no samples, pure synthesis).
# usage: python3 scripts/anfaal/make_audio.py  → public/anfaal/music.wav, public/anfaal/sfx/*.wav
import numpy as np, wave
SR = 48000
DUR = 60.4
BPM = 100
B = 60 / BPM
rng = np.random.default_rng(7)

def write(path, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1: x = np.stack([x, x], 1)
    w = wave.open(path, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()

def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai) ** 2
    if ri: e[-ri:] *= np.linspace(1, 0, ri) ** 2
    return e


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if lo: g *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: g *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))

def reverb(x, t=1.6, mix=0.25):
    n = int(t * SR); ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n)); ir = fft_filter(ir, 200, 6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n; N = 1 << int(np.ceil(np.log2(L)))
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
    return x * (1 - mix) + y * mix

N = int(DUR * SR); t = np.arange(N) / SR
midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# --- sections (seconds): drums off during rumours (3.55-6.35) and lesson (44.1-50.85)
def drums_on(sec):
    return not (3.55 <= sec < 6.35 or 44.1 <= sec < 50.85)

# --- pads: Fm9 | Dbmaj7 | Ebadd9 | Cm7, 2 bars each
chords = [[53, 56, 60, 63, 67], [49, 53, 56, 60, 65], [51, 55, 58, 65, 70], [48, 51, 55, 58, 63]]
bar = 4 * B
pad = np.zeros(N); bass = np.zeros(N)
k = 0; pos = 0.0
while pos < DUR:
    ch = chords[k % 4]; seg = 2 * bar
    i0 = int(pos * SR); i1 = min(N, int((pos + seg + 1.2) * SR)); n = i1 - i0
    tt = np.arange(n) / SR
    e = env(n, 0.5, 1.4)
    for m in ch:
        for det in (-0.0018, 0.0018):
            f0 = midi(m) * (1 + det)
            for h in range(1, 6):
                pad[i0:i1] += e * np.sin(2 * np.pi * f0 * h * tt + rng.random() * 6) / (h ** 1.6) * 0.05
    # bass: root on beat 1 and the "and" of 2, per bar
    root = midi(ch[0] - 24)
    for b0 in range(2):
        for off, ln in ((0, 1.4 * B), (1.5 * B, 1.2 * B)):
            s0 = int((pos + b0 * bar + off) * SR); s1 = min(N, s0 + int(ln * SR))
            if s0 >= N: continue
            tb = np.arange(s1 - s0) / SR
            note = np.sin(2 * np.pi * root * tb) + 0.25 * np.sin(4 * np.pi * root * tb)
            bass[s0:s1] += np.tanh(1.5 * note) * env(s1 - s0, 0.01, 0.15) * 0.35
    k += 1; pos += seg
pad = fft_filter(pad, 120, 2600)

# --- drums
kick = np.zeros(N); clap = np.zeros(N); hat = np.zeros(N); side = np.ones(N)
def add(buf, at, sig):
    i = int(at * SR)
    if i >= N: return
    j = min(N, i + len(sig)); buf[i:j] += sig[: j - i]
kl = int(0.4 * SR); tk = np.arange(kl) / SR
ksig = np.sin(2 * np.pi * np.cumsum(45 + 75 * np.exp(-tk * 30)) / SR) * np.exp(-tk * 7) * 0.9
cl = int(0.25 * SR); csig = fft_filter(rng.standard_normal(cl), 900, 5000) * np.exp(-np.arange(cl) / SR * 18) * 0.35
hl = int(0.05 * SR); hsig = fft_filter(rng.standard_normal(hl), 7000, None) * np.exp(-np.arange(hl) / SR * 90) * 0.12
duck = 1 - 0.45 * np.exp(-np.arange(int(0.35 * SR)) / SR * 9)
beat = 0
while beat * B < DUR:
    at = beat * B; inbar = beat % 4
    if drums_on(at):
        if inbar in (0, 2) or (inbar == 3 and (beat // 4) % 2 == 1):
            add(kick, at if inbar != 3 else at + 0.5 * B, ksig)
            i = int(at * SR); j = min(N, i + len(duck)); side[i:j] = np.minimum(side[i:j], duck[: j - i])
        if inbar in (1, 3): add(clap, at, csig)
        for s8 in (0, 0.54):  # swung 8ths
            add(hat, at + s8 * B, hsig * (1.0 if s8 == 0 else 0.6))
    beat += 1

# riser into PANIC (5.0-6.35) and impact
rl = int(1.35 * SR); tr = np.arange(rl) / SR
riser = fft_filter(rng.standard_normal(rl), 400, 6000) * (tr / tr[-1]) ** 2 * 0.18
add(hat, 5.0, riser)

mus = pad * side + bass * side + kick + reverb(clap, 1.2, 0.3) + hat
# low-pass the lesson section for a "thinking" feel
i0, i1 = int(44.1 * SR), int(50.85 * SR)
mus[i0:i1] = fft_filter(mus[i0:i1], None, 900) * 1.3
mus = reverb(mus, 1.8, 0.12)
mus *= env(N, 0.05, 1.8)
mus = mus / np.max(np.abs(mus)) * 0.8
L = mus + 0.02 * np.roll(pad, 240); R = mus + 0.02 * np.roll(pad, -240)
write("public/anfaal/music.wav", np.stack([L, R], 1) / 1.05)

# --- soft SFX
def sfx_whoosh():
    n = int(0.75 * SR); x = rng.standard_normal(n); tt = np.arange(n) / SR
    out = np.zeros(n); fc = 300 + 2500 * np.sin(np.pi * tt / tt[-1]) ** 2
    # band sweep via short FFT blocks
    blk = 2048
    for i in range(0, n, blk // 2):
        seg = x[i:i + blk]
        if len(seg) < 64: break
        w = np.hanning(len(seg)); f = fc[min(n - 1, i + len(seg) // 2)]
        out[i:i + len(seg)] += fft_filter(seg * w, f * 0.5, f * 1.6)
    out *= np.abs(np.sin(np.pi * tt / tt[-1])) ** 2.2
    return out / np.max(np.abs(out)) * 0.5
def sfx_tick():
    n = int(0.09 * SR); tt = np.arange(n) / SR
    f = 900 * np.exp(-tt * 12)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 55)
    return fft_filter(x, None, 3000) * 0.5
def sfx_boom():
    n = int(0.9 * SR); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-tt * 14)) / SR) * np.exp(-tt * 4.5)
    x += fft_filter(rng.standard_normal(n), 60, 400) * np.exp(-tt * 9) * 0.25
    x *= env(n, 0.004, 0.2)
    return x / np.max(np.abs(x)) * 0.7
write("public/anfaal/sfx/whoosh.wav", reverb(sfx_whoosh(), 0.8, 0.25))
write("public/anfaal/sfx/pop.wav", reverb(sfx_tick(), 0.5, 0.2))
write("public/anfaal/sfx/thud.wav", sfx_boom())
print("ok")
