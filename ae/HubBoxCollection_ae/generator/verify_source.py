#!/usr/bin/env python3
"""Checks the keys the build script ACTUALLY writes (dumped by the strict mock) against Remotion's own curves
(source_curves.json), at every frame and 4 sub-frames per frame, for every fitted channel. Exit 1 if any channel is
more than 2% of its range off, or if a fitted channel never reached a property.
  DUMP_KEYS=generator/keys.json node ../../.claude/skills/ae-builder/scripts/ae_mock_dryrun.js HubBox_CollectionPoints_Rebuild.jsx
  python3 generator/verify_source.py generator/keys.json
"""
import json, os, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = json.load(open(os.path.join(HERE, "source_curves.json")))
TS = np.array(SRC["times"]); CH = {k: np.array(v) for k, v in SRC["channels"].items()}
CH["drop_cy"] = 120 + CH["drop_y"]
FITS = json.load(open(os.path.join(HERE, "fits.json")))["fits"]
FPS, DUR = 60, 5.5
dump = json.load(open(sys.argv[1]))


def v0(v): return v[0] if isinstance(v, list) else v


def ae_eval(rec, holds, tt):
    """AE temporal bezier between the dumped keys (speed/influence per key), HOLD where the fit says so."""
    K, E = rec["keys"], rec["eases"]; out = np.empty_like(tt)
    for n, t in enumerate(tt):
        if t <= K[0]["t"]: out[n] = v0(K[0]["v"]); continue
        if t >= K[-1]["t"]: out[n] = v0(K[-1]["v"]); continue
        i = max(j for j in range(len(K) - 1) if K[j]["t"] <= t)
        a, b = K[i], K[i + 1]; va, vb = v0(a["v"]), v0(b["v"])
        if holds[i]: out[n] = va; continue
        T = b["t"] - a["t"]; so, fo = E[str(i + 1)][1][0]; si, fi = E[str(i + 2)][0][0]
        s = np.linspace(0, 1, 400)
        P = [(0, va), (fo / 100 * T, va + so * fo / 100 * T), (T - fi / 100 * T, vb - si * fi / 100 * T), (T, vb)]
        B = [(1 - s) ** 3, 3 * (1 - s) ** 2 * s, 3 * (1 - s) * s ** 2, s ** 3]
        x = sum(B[j] * P[j][0] for j in range(4)); y = sum(B[j] * P[j][1] for j in range(4))
        out[n] = np.interp(t - a["t"], x, y)
    return out


tt = np.arange(0, DUR * FPS + 1e-9, 0.25) / FPS
bad, worst, used = 0, (0, ""), set()
for name, fit in sorted(FITS.items()):
    ft = [round(k[0] * FPS) for k in fit]; fv = [k[1] for k in fit]
    match = None
    for key, rec in dump.items():
        if " > ADBE" not in key and "/" not in key: continue
        K = rec["keys"]
        if len(K) == len(fit) and all(round(K[i]["t"] * FPS) == ft[i] and abs(v0(K[i]["v"]) - fv[i]) < 1e-3 for i in range(len(fit))):
            match = key; break
    if not match: print("NOT APPLIED", name); bad += 1; continue
    used.add(match)
    rng = max(1e-9, CH[name].max() - CH[name].min())
    holds = [k[5] == 1 for k in fit]
    keep = np.ones_like(tt, bool)   # skip the inside of an instant pop: the source jumps between two frames, AE on the next
    for i, k in enumerate(fit):
        if k[5] == 1: keep &= ~((tt > k[0] + 1e-9) & (tt < fit[i + 1][0] - 1e-9))
    e = np.abs(ae_eval(dump[match], holds, tt[keep]) - np.interp(tt[keep], TS, CH[name])).max() / rng * 100
    if e > worst[0]: worst = (e, name)
    flag = e > 2; bad += flag
    print("%s %5.2f%%  %-16s %s" % ("BAD" if flag else "OK ", e, name, match.split(" > ADBE")[0] if " > ADBE" in match else match))
print("checked %d fitted channels; worst error %.2f%% of a move (%s)" % (len(FITS), worst[0], worst[1]))
sys.exit(1 if bad else 0)
