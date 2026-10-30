#!/usr/bin/env python3
"""Generates FieldMarketing_EventsScene_Rebuild.jsx (+ PNG assets) from the Remotion EventsScene.

  node ae/FieldMarketing_ae/generator/source_curves.mjs > ae/FieldMarketing_ae/generator/source_curves.json
  python3 ae/FieldMarketing_ae/generator/build.py

Layout comes from generator/measure (the real scene measured in Chrome), curves from source_curves.json
(Remotion's own spring/interpolate), fitted to AE keys with the ae-builder skill's ease_fit.fit_move.
"""
import json, math, os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
SKILL = os.path.join(OUT, "..", "..", ".claude", "skills", "ae-builder")
sys.path.insert(0, os.path.join(SKILL, "scripts"))
from ease_fit import fit_move  # noqa: E402

FPS = 30
SRC = json.load(open(os.path.join(HERE, "source_curves.json")))
FR = np.array(SRC["frames"])
CH = {k: np.array(v) for k, v in SRC["channels"].items()}
CH["winOpacity"] = np.minimum(1, CH["win"])
CH["pressDriver"] = (1 - CH["press"]) / 0.08
CH["unblur"] = 1 - CH["wordBlur"] / 10


# ------------------------------------------------------------------ fits
def fit(channel, f0, f1):
    v = CH[channel]
    f = lambda u: float(np.interp(f0 + u * (f1 - f0), FR, v))
    keys, err = fit_move(f, f0 / FPS, (f1 - f0) / FPS, fps=FPS)
    if abs(keys[-1][1] - 1) < 0.003: keys[-1][1] = 1.0
    assert err <= 0.02, (channel, err)
    return [[round(k[0], 6), round(k[1], 6), round(k[2], 5), round(k[3], 2), round(k[4], 2)] for k in keys], err

FITS, FIT_ERR = {}, {}
for name, ch, f0, f1 in [("win_op", "winOpacity", 6, 32), ("win", "win", 6, 32), ("chip", "chip", 30, 65),
                         ("cursor", "cursor", 40, 78), ("rise", "wordRise", 4, 22), ("fade", "wordOpacity", 4, 16),
                         ("unblur", "unblur", 4, 18), ("label", "labelOpacity", 0, 10)]:
    FITS[name], FIT_ERR[name] = fit(ch, f0, f1)

# ------------------------------------------------------------------ layout (measured at frame 134 / 60)
L134 = {e["path"]: e for e in json.load(open(os.path.join(HERE, "measure", "out", "layout_134.json")))}
L60 = {e["path"]: e for e in json.load(open(os.path.join(HERE, "measure", "out", "layout_60.json")))}
ASC = 1984 / 2048
def base(t, fs): return [round(t["x"], 3), round(t["y"] + round(ASC * fs), 3)]   # Chrome rounds ascent to whole px
WX, WY = 920, 180   # window top-left in the scene; PRE_Window coordinates are relative to it
def loc(p): return [round(p[0] - WX, 3), round(p[1] - WY, 3)]

words = []
for i in range(4):
    e = L134["0.0.1.0.1.%d" % i]; t = e["texts"][0]
    words.append({"text": t["text"], "pos": base(t, 92), "accent": i >= 2, "w": round(e["w"], 3)})
lab = L134["0.0.1.0.0"]
cells, days, weekdays = [], [], []
for i in range(31):
    c = L134["0.0.1.1.1.0.1.%d" % i]; d = L134["0.0.1.1.1.0.1.%d.0" % i]["texts"][0]
    cells.append({"day": i + 1, "x": round(c["x"] - WX + c["w"] / 2, 3), "y": round(c["y"] - WY + 42, 3), "w": round(c["w"], 3)})
    days.append({"day": i + 1, "pos": loc(base(d, 20))})
for i in range(7):
    t = L134["0.0.1.1.1.0.0.%d" % i]["texts"][0]; weekdays.append({"t": t["text"], "pos": loc(base(t, 20))})
chips = []
for day, name in [(8, "Summit"), (16, "Roadshow"), (23, "Expo")]:
    e = L134["0.0.1.1.1.0.1.%d.1" % (day - 1)]; t = e["texts"][0]
    chips.append({"day": day, "name": name, "x": round(e["x"] - WX, 3), "y": round(e["y"] - WY + e["h"] / 2, 3), "w": round(e["w"], 3), "h": e["h"],
                  "text": [round(t["x"] - e["x"], 3), round(t["y"] + 15 - (e["y"] + e["h"] / 2), 3)]})
title = L134["0.0.1.1.0.3"]["texts"][0]
footer = L134["0.0.1.1.1.1"]["texts"][0]
btn = L134["0.0.1.1.1.2"]
LAY = {
    "label": {"cx": round(lab["x"] + lab["w"] / 2, 3), "cy": round(lab["y"] + lab["h"] / 2, 3), "w": round(lab["w"], 3), "h": lab["h"], "text": base(lab["texts"][0], 28)},
    "words": words, "title": loc(base(title, 24)), "footer": loc(base(footer, 22)),
    "dots": [loc([L134["0.0.1.1.0.%d" % i]["x"] + 7, L134["0.0.1.1.0.%d" % i]["y"] + 7]) for i in range(3)],
    "cells": cells, "days": days, "weekdays": weekdays, "chips": chips,
    "button": {"cx": btn["x"] - WX + 150, "cy": btn["y"] - WY + 38, "booked": loc(base(btn["texts"][0], 28)), "book": loc(base(L60["0.0.1.1.1.2"]["texts"][0], 28))},
    # cursor wrapper: content origin (921, 245) + translate, pivot at the 44x48 wrapper centre
    "cursor": {"from": [921 + 900 + 22 - WX, 245 + 300 + 24 - WY], "to": [921 + 690 + 22 - WX, 245 + 594 + 24 - WY]},
}

# ------------------------------------------------------------------ PNG assets (exact CSS maths)
A = os.path.join(OUT, "assets"); os.makedirs(A, exist_ok=True)
BLUE, BLUE_TINT, BLUE_LIGHT, BLUE_DARK = (61, 138, 252), (234, 242, 255), (141, 187, 255), (31, 95, 214)

def save_rgba(rgb, alpha, path):
    a = np.clip(alpha * 255 + 0.5, 0, 255).astype(np.uint8)
    img = np.dstack([np.full(a.shape, c, np.uint8) for c in rgb] + [a]) if isinstance(rgb, tuple) else np.dstack([rgb.astype(np.uint8), a])
    Image.fromarray(img, "RGBA").save(path)

def glow(size, a0, path):   # radial-gradient(circle, BLUE a0 0%, transparent 65%), farthest-corner
    y, x = np.mgrid[0:size, 0:size] + 0.5; r = np.hypot(x - size / 2, y - size / 2)
    save_rgba(BLUE, a0 * np.clip(1 - r / (0.65 * size / 2 * math.sqrt(2)), 0, 1), path)
glow(1100, 0x33 / 255, os.path.join(A, "glow_top_left.png"))
glow(1200, 0x2b / 255, os.path.join(A, "glow_bottom_right.png"))

# dot grid: radial-gradient(BLUE_TINT 2px, transparent 2px) every 40px, 4x supersampled
S = 4; y, x = (np.mgrid[0:1080 * S, 0:1920 * S] + 0.5) / S
inside = (np.hypot((x % 40) - 20, (y % 40) - 20) <= 2).astype(float)
save_rgba(BLUE_TINT, inside.reshape(1080, S, 1920, S).mean(axis=(1, 3)), os.path.join(A, "dot_grid.png"))

# booked button: 300x76 r18, linear-gradient(135deg, BLUE_LIGHT 0%, BLUE 45%, BLUE_DARK 100%)
w, h, r = 300, 76, 18; y, x = (np.mgrid[0:h * S, 0:w * S] + 0.5) / S
L = w * math.sin(math.radians(45)) + h * math.cos(math.radians(45))
t = np.clip(0.5 + ((x - w / 2) + (y - h / 2)) * math.sqrt(0.5) / L, 0, 1)
stops = [(0, BLUE_LIGHT), (0.45, BLUE), (1, BLUE_DARK)]
rgb = np.dstack([np.interp(t, [s[0] for s in stops], [s[1][c] for s in stops]) for c in range(3)])
dx = np.maximum(np.maximum(r - x, x - (w - r)), 0); dy = np.maximum(np.maximum(r - y, y - (h - r)), 0)
inside = (np.hypot(dx, dy) <= r).astype(float)
rgb = rgb.reshape(h, S, w, S, 3).mean(axis=(1, 3)); a = inside.reshape(h, S, w, S).mean(axis=(1, 3))
save_rgba(rgb, a, os.path.join(A, "button_booked.png"))

# ------------------------------------------------------------------ write the .jsx
lib = open(os.path.join(SKILL, "assets", "ae_build_lib.jsx")).read()
build = open(os.path.join(HERE, "build_body.jsx")).read()
data = "\n".join([
    "// ---------------------------------------------------------------- generated data (generator/build.py)",
    "FPS = 30; W = 1920; H = 1080;",
    "var CURVES = {};",
    "// FITS: Remotion's own curves fitted to AE keys [t (s), fraction, speed, infl in %, infl out %]. Worst error per move noted.",
    "var FITS = {\n" + ",\n".join('  %s: %s' % (k, json.dumps(v)) for k, v in FITS.items()) + "\n};",
    "// worst error per move: " + ", ".join("%s %.2f%%" % (k, FIT_ERR[k] * 100) for k in FITS),
    "var LAY = " + json.dumps(LAY) + ";", ""])
jsx = os.path.join(OUT, "FieldMarketing_EventsScene_Rebuild.jsx")
open(jsx, "w").write("// FieldMarketing: EventsScene (\"They booked the events.\") rebuilt for After Effects. GENERATED by generator/build.py, do not edit by hand.\n" + lib + "\n" + data + build)
print("wrote", jsx)
for k in FITS: print("  %-8s %d keys  max error %.2f%%" % (k, len(FITS[k]), FIT_ERR[k] * 100))
