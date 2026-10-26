"""Synthesises the sound-effect kit used by the Inflation graphics into
public/sfx/*.wav (48 kHz stereo). Everything is generated from noise and
sine partials, so there are no licensing questions. Usage:

    python3 scripts/make-inflation-sfx.py
"""

import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def t(seconds):
    return np.arange(int(SR * seconds)) / SR


def env(n, attack, release, curve=4.0):
    """Attack in seconds, then an exponential-ish fall to zero."""
    e = np.ones(n)
    a = max(1, int(SR * attack))
    e[:a] = np.linspace(0, 1, a) ** 2
    rest = n - a
    e[a:] = np.power(np.linspace(1, 0, rest), curve * release / max(release, 1e-3))
    return e


def sweep_sine(f0, f1, seconds, shape="exp"):
    x = t(seconds)
    if shape == "exp":
        f = f0 * (f1 / f0) ** (x / seconds)
    else:
        f = f0 + (f1 - f0) * x / seconds
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def lowpass(sig, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    out = np.empty_like(sig)
    y = 0.0
    for i, s in enumerate(sig):
        y = (1 - a) * s + a * y
        out[i] = y
    return out


def reverb(sig, seconds=0.6, mix=0.18):
    ir = rng.standard_normal(int(SR * seconds)) * np.exp(-np.linspace(0, 7, int(SR * seconds)))
    ir = lowpass(lowpass(ir, 2800), 2800)
    ir /= np.abs(ir).sum() ** 0.5 * 6
    wet = np.fft.irfft(np.fft.rfft(sig, len(sig) + len(ir)) * np.fft.rfft(ir, len(sig) + len(ir)))
    dry = np.concatenate([sig, np.zeros(len(ir))])
    return dry * (1 - mix) + wet[: len(dry)] * mix * 4


def stereo(sig, width=0.15):
    """Small Haas-style widening so effects don't sit dead-centre on the voice."""
    d = int(SR * 0.004 * width / 0.15)
    left = sig
    right = np.concatenate([np.zeros(d), sig[: len(sig) - d]]) if d else sig
    return np.stack([left, 0.85 * right + 0.15 * left], axis=1)


def save(name, sig, peak_db=-3.0, width=0.15):
    sig = sig - sig.mean()
    fade = min(len(sig), int(SR * 0.01))
    sig[-fade:] *= np.linspace(1, 0, fade)
    sig = sig / (np.abs(sig).max() or 1) * 10 ** (peak_db / 20)
    data = (stereo(sig, width) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"wrote sfx/{name}.wav ({len(sig) / SR:.2f}s)")


def shaped_noise(seconds, center, octaves=0.9):
    """Noise whose spectrum is a log-Gaussian band around center(x), x in 0..1,
    built frame by frame (short-time overlap-add) so the band can sweep cleanly."""
    n = int(SR * seconds)
    size, hop = 2048, 512
    win = np.hanning(size)
    out = np.zeros(n + size)
    freqs = np.fft.rfftfreq(size, 1 / SR)
    logf = np.log2(np.maximum(freqs, 20))
    for start in range(0, n, hop):
        fc = center(min(1.0, start / max(1, n - 1)))
        gain = np.exp(-0.5 * ((logf - np.log2(fc)) / (octaves / 2)) ** 2)
        frame = np.fft.irfft(np.fft.rfft(rng.standard_normal(size)) * gain)
        out[start : start + size] += frame * win
    return out[:n]


def whoosh(seconds, f0, f1, peak=0.45):
    x = np.linspace(0, 1, int(SR * seconds))
    body = shaped_noise(seconds, lambda u: f0 * (f1 / f0) ** u)
    shape = np.sin(np.pi * np.clip(x / peak, 0, 1) / 2) ** 2 * np.where(x > peak, (1 - (x - peak) / (1 - peak)) ** 2, 1)
    return body * shape


def pop(f0=900, f1=320, seconds=0.12):
    body = sweep_sine(f0, f1, seconds) * env(int(SR * seconds), 0.002, seconds, 6)
    click = rng.standard_normal(int(SR * 0.006)) * np.linspace(1, 0, int(SR * 0.006)) * 0.3
    body[: len(click)] += click
    return reverb(body, 0.35, 0.12)


def blip(freq, seconds=0.16):
    x = t(seconds)
    tone = np.sin(2 * np.pi * freq * x) + 0.25 * np.sin(2 * np.pi * 2 * freq * x) + 0.08 * np.sin(2 * np.pi * 3 * freq * x)
    return reverb(tone * env(len(x), 0.003, seconds, 5), 0.4, 0.15)


def bell(freq, seconds=1.2):
    x = t(seconds)
    partials = [(1, 1.0, 1.0), (2.0, 0.35, 1.6), (2.76, 0.18, 2.2), (5.4, 0.06, 3.5)]
    tone = sum(a * np.sin(2 * np.pi * freq * m * x) * np.exp(-x * 3.2 * d) for m, a, d in partials)
    return reverb(tone * env(len(x), 0.002, seconds, 1), 0.8, 0.22)


os.makedirs(OUT, exist_ok=True)

# Heading / panel entrances.
save("whoosh-soft", whoosh(0.7, 400, 3200, 0.55), -6)
save("whoosh", whoosh(0.5, 300, 5000, 0.45), -4)
save("swoosh", whoosh(0.32, 800, 7000, 0.35), -5)

# Line draw-on: a long, airy sweep.
save("draw", whoosh(2.6, 250, 2400, 0.7) + 0.4 * whoosh(2.6, 1200, 6000, 0.8), -7)

# Chips, tags and callouts.
save("pop", pop(), -3)
save("pop-high", pop(1400, 520, 0.1), -4)

# Bars and steps: a pentatonic run so staggered bars sound musical.
for i, f in enumerate([523.25, 587.33, 659.25, 783.99, 880.0]):
    save(f"blip{i + 1}", blip(f), -6)
save("blip-low", blip(196.0, 0.3), -5)

# Number landing: low thump with a bright transient.
x = t(0.6)
thump = sweep_sine(110, 42, 0.6) * env(len(x), 0.003, 0.6, 4)
snap = shaped_noise(0.05, lambda u: 2500, 1.2) * np.linspace(1, 0, int(SR * 0.05)) ** 2
thump[: len(snap)] += snap / (np.abs(snap).max() or 1) * 0.35
save("impact", reverb(thump, 0.7, 0.2), -3)

# Ticks, ding, riser, strike.
save("tick", reverb(np.sin(2 * np.pi * 2600 * t(0.03)) * env(int(SR * 0.03), 0.0005, 0.03, 8), 0.2, 0.1), -9)
save("ding", bell(1046.5), -6)
riser = whoosh(1.1, 300, 6000, 0.95) + 0.25 * sweep_sine(220, 880, 1.1) * np.linspace(0, 1, int(SR * 1.1)) ** 2
save("riser", riser, -6)
strike = shaped_noise(0.28, lambda u: 4500 * (1500 / 4500) ** u, 0.6)
save("strike", strike * env(len(strike), 0.004, 0.28, 3), -6)
