"""Compose an original background-music bed and mix it under a voiceover.

Usage: python3 scripts/bg_music_mix.py <vo.mp3> <out_dir> [intro_end_seconds]

- VO is loudness-normalised to -16 LUFS (speech stays the loudest thing).
- Music is an upbeat, warm SaaS/tech bed (108 BPM, D major, Dmaj7-A-Bm7-Gmaj7).
- Intro (0 -> intro_end) gets the full arrangement, sitting ~7 dB under the VO.
- After the intro the music drops to a lighter bed ~18 dB under the VO, is
  EQ-carved in the 1-4 kHz speech band and side-chain ducked by the VO.
"""
import json
import os
import subprocess
import sys

import numpy as np

SR = 48000
BPM = 108
BEAT = 60 / BPM
BAR = 4 * BEAT
VO_LUFS = -16.0
INTRO_MUSIC_LU = -7.0   # music loudness relative to VO during the intro
BED_MUSIC_LU = -19.0    # music loudness relative to VO under the dialogue

rng = np.random.default_rng(7)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# D major: Dmaj7, A/C#, Bm7, Gmaj7  (MIDI notes, mid register)
CHORDS = [
    (50, [62, 66, 69, 73]),
    (45, [61, 64, 69, 73]),
    (47, [62, 66, 69, 71]),
    (43, [62, 66, 67, 71]),
]


def ffmpeg_decode(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def lufs(x):
    p = subprocess.run(
        ["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
         "-af", "loudnorm=print_format=json", "-f", "null", "-"],
        input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode()
    return float(json.loads(p[p.rindex("{"):])["input_i"])


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = min(int(a * SR), n), min(int(r * SR), n)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def add(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i:i + len(sig)] += sig


def pad_note(hz, dur):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros((len(t), 2))
    for ch, det in ((0, -0.08), (1, 0.08)):
        for d in (det, 0.0, -det * 0.6):
            f = hz * 2 ** (d / 12)
            ph = rng.uniform(0, 2 * np.pi)
            for h in range(1, 10):
                if f * h > 9000:
                    break
                out[:, ch] += np.sin(2 * np.pi * f * h * t + ph * h) / h * np.exp(-h / 2.2)
    return out * env_adsr(len(t), 0.6, 0.8)[:, None]


def pluck(hz, dur=0.45):
    t = np.arange(int(dur * SR)) / SR
    s = (np.sin(2 * np.pi * hz * t) + 0.35 * np.sin(4 * np.pi * hz * t)
         + 0.12 * np.sin(6 * np.pi * hz * t)) * np.exp(-t * 9)
    return s * env_adsr(len(t), 0.003, 0.05)


def bass(hz, dur):
    t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * hz * t) + 0.25 * np.sin(4 * np.pi * hz * t)
    return s * np.exp(-t * 2.5) * env_adsr(len(t), 0.01, 0.06)


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    f = 45 + 85 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)


def hat(dur=0.06):
    n = rng.standard_normal(int(dur * SR))
    n = np.diff(np.diff(n, prepend=0), prepend=0)
    t = np.arange(len(n)) / SR
    return n * np.exp(-t * 70) * 0.25


def clap():
    n = rng.standard_normal(int(0.25 * SR))
    n = np.diff(n, prepend=0)
    t = np.arange(len(n)) / SR
    e = np.exp(-t * 18) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 25) * (t > 0.012)
    return n * e * 0.3


def riser(dur):
    n = rng.standard_normal(int(dur * SR))
    t = np.arange(len(n)) / SR
    # brighten over time by mixing in more high-passed noise
    hp = np.diff(n, prepend=0)
    k = (t / dur)
    return (n * (1 - k) * 0.3 + hp * k) * (k ** 2) * 0.35


def fft_conv(x, ir):
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]


def reverb(x, secs=1.6, wet=0.25):
    out = x.copy()
    t = np.arange(int(secs * SR)) / SR
    for ch in range(2):
        ir = rng.standard_normal(len(t)) * np.exp(-t * 6.9 / secs)
        ir[: int(0.02 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] += wet * fft_conv(x[:, ch], ir)
    return out


def eq(x, intro_end, total):
    """Speech-band carve + rumble high-pass, applied to the body section."""
    f = np.fft.rfftfreq(len(x), 1 / SR)
    hp = 1 / np.sqrt(1 + (40 / np.maximum(f, 1)) ** 4)
    carve = 1 - (1 - 10 ** (-5 / 20)) * np.exp(-0.5 * (np.log2(np.maximum(f, 1) / 2500) / 0.8) ** 2)
    full = np.stack([np.fft.irfft(np.fft.rfft(x[:, c]) * hp, len(x)) for c in range(2)], 1)
    carved = np.stack([np.fft.irfft(np.fft.rfft(x[:, c]) * hp * carve, len(x)) for c in range(2)], 1)
    k = np.clip((np.arange(len(x)) / SR - intro_end) / 1.0, 0, 1)[:, None]
    return full * (1 - k) + carved * k


def compose(total, intro_end):
    n = int(total * SR)
    pads, plk, bas, drm, fx = (np.zeros((n, 2)) for _ in range(5))
    bars = int(np.ceil(total / BAR)) + 1
    for b in range(bars):
        t0 = b * BAR
        root, notes = CHORDS[b % 4]
        in_intro = t0 < intro_end
        for m in notes:
            add(pads, t0, pad_note(midi_hz(m), BAR + 0.8) * 0.06)
        # arpeggio, 8th notes, ping-pong panned
        arp = [notes[0] + 12, notes[2] + 12, notes[1] + 12, notes[3] + 12]
        for i in range(8):
            s = pluck(midi_hz(arp[i % 4] if i % 4 else arp[0]))
            pan = 0.3 if i % 2 else 0.7
            vel = 0.22 if in_intro else 0.15
            add(plk, t0 + i * BEAT / 2, np.stack([s * (1 - pan), s * pan], 1) * vel)
        # bass on the 8ths, accent on downbeats
        for i in range(8):
            v = 0.5 if i % 2 == 0 else 0.28
            s = bass(midi_hz(root), BEAT / 2)
            add(bas, t0 + i * BEAT / 2, np.stack([s, s], 1) * v * (1 if in_intro else 0.75))
        # drums: full groove in the intro, light hats + soft kick under the dialogue
        for i in range(4):
            bt = t0 + i * BEAT
            if in_intro or i in (0, 2):
                k = kick() * (0.55 if in_intro else 0.32)
                add(drm, bt, np.stack([k, k], 1))
            h = hat() * (1.0 if in_intro else 0.6)
            add(drm, bt + BEAT / 2, np.stack([h * 0.8, h], 1))
            if in_intro and i in (1, 3):
                c = clap()
                add(drm, bt, np.stack([c, c * 0.9], 1))
    # riser into the end of the intro, then a soft downlifter
    r = riser(min(2.5, intro_end))
    add(fx, intro_end - len(r) / SR, np.stack([r, r[::-1] * 0 + r], 1))
    # side-chain pump from the kick on pads/bass for groove
    pump = np.ones(n)
    for b in range(int(total / BEAT) + 1):
        i = int(b * BEAT * SR)
        seg = np.arange(int(BEAT * SR)) / SR
        g = 1 - 0.35 * np.exp(-seg * 9)
        pump[i:i + len(g)] = g[: max(0, min(len(g), n - i))]
    music = (reverb(pads, 2.2, 0.35) + bas) * pump[:, None] + reverb(plk, 1.4, 0.3) + drm + reverb(fx, 1.5, 0.4)
    return music


def limit(x, ceil):
    """Look-ahead peak limiter: 5 ms look-ahead, 80 ms release."""
    pk = np.abs(x).max(1)
    la = int(0.005 * SR)
    need = np.minimum(1, ceil / np.maximum(pk, 1e-9))
    need = np.minimum(need, np.concatenate([need[la:], np.ones(la)]))
    # running min over look-ahead window, then smooth release
    from numpy.lib.stride_tricks import sliding_window_view
    need = sliding_window_view(np.concatenate([need, np.ones(la)]), la + 1).min(1)[: len(need)]
    g = np.empty_like(need)
    r, y = np.exp(-1 / (0.08 * SR)), 1.0
    for i, v in enumerate(need):
        y = v if v < y else r * y + (1 - r) * v
        g[i] = y
    return x * g[:, None]


def vo_activity(vo):
    m = np.abs(vo).mean(1)
    w = int(0.02 * SR)
    rms = np.sqrt(np.convolve(m ** 2, np.ones(w) / w, "same"))
    act = (20 * np.log10(rms + 1e-9) > -40).astype(float)
    # fast attack (30 ms), slow release (400 ms)
    out = np.empty_like(act)
    a, r, y = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.4 * SR)), 0.0
    for i, v in enumerate(act):
        c = a if v > y else r
        y = c * y + (1 - c) * v
        out[i] = y
    return out


def main():
    vo_path, out_dir = sys.argv[1], sys.argv[2]
    intro_end = float(sys.argv[3]) if len(sys.argv) > 3 else 13.6
    os.makedirs(out_dir, exist_ok=True)

    vo = ffmpeg_decode(vo_path)
    vo *= 10 ** ((VO_LUFS - lufs(vo)) / 20)
    total = len(vo) / SR

    music = compose(total, intro_end)[: len(vo)]
    music = eq(music, intro_end, total)
    ie = int(intro_end * SR)
    intro_g = VO_LUFS + INTRO_MUSIC_LU - lufs(music[:ie])
    bed_g = VO_LUFS + BED_MUSIC_LU - lufs(music[ie + 2 * SR:])

    t = np.arange(len(vo)) / SR
    # section level: intro level, 1.2 s glide down to the bed after the intro
    k = np.clip((intro_end + 0.4 - t) / 1.2, 0, 1)
    sect = bed_g + (intro_g - bed_g) * k
    # side-chain duck (extra 3 dB) only under the dialogue section
    duck = -3.0 * vo_activity(vo) * (t > intro_end)
    duck_ref = -3.0 * np.median(vo_activity(vo)[ie:])  # bed level already measured ducked
    gain_db = sect + duck - duck_ref * (t > intro_end)
    fade = np.clip(t / 0.25, 0, 1) * np.clip((total - t) / 2.0, 0, 1)
    music *= (10 ** (gain_db / 20) * fade)[:, None]

    mix = vo + music
    mix = limit(mix, 0.89)  # ~-1 dBTP ceiling, only touches rare peaks

    def write(x, name):
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
             "-c:a", "libmp3lame", "-b:a", "320k", os.path.join(out_dir, name)],
            input=x.astype(np.float32).tobytes(), check=True)

    write(mix, "Badge_Phone_with_music.mp3")
    write(music, "Badge_Phone_music_stem.mp3")
    print("VO", round(lufs(vo), 1), "LUFS | intro music", round(lufs(music[: int(intro_end * SR)]), 1),
          "| bed music", round(lufs(music[int((intro_end + 2) * SR):]), 1), "| mix", round(lufs(mix), 1))


if __name__ == "__main__":
    main()
