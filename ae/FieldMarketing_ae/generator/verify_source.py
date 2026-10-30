#!/usr/bin/env python3
"""Checks the keys the build script writes against Remotion's own curves (source_curves.json),
at every frame and 4 sub-frames per frame. Exit 1 if any move is more than 2% off.
  DUMP_KEYS=generator/keys.json node <skill>/scripts/ae_mock_dryrun.js FieldMarketing_EventsScene_Rebuild.jsx
  python3 generator/verify_source.py generator/keys.json
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", ".claude", "skills", "ae-builder", "scripts"))
from verify_curves import ae_curve  # noqa: E402

SRC = json.load(open(os.path.join(HERE, "source_curves.json")))
FR = np.array(SRC["frames"]); CH = {k: np.array(v) for k, v in SRC["channels"].items()}
CH["winOpacity"] = np.minimum(1, CH["win"]); CH["pressDriver"] = (1 - CH["press"]) / 0.08; CH["unblur"] = 1 - CH["wordBlur"] / 10
S4, W = "S4_BookedTheEvents > ", "PRE_Window > "
EF = "ADBE Effect Parade/%s/1"
CHECKS = [  # key, channel, frames (start, end), AE value at fraction 0 and 1
    (S4 + "PRE_Window > ADBE Position_0", "win", (6, 32), 1470, 1350),
    (S4 + "PRE_Window > ADBE Rotate Z", "win", (6, 32), 4, 0),
    (S4 + "PRE_Window > ADBE Opacity", "winOpacity", (6, 32), 0, 100),
    (W + "Chip_1_Summit > ADBE Scale", "chip", (30, 65), 0, 100),
    (W + "Cursor > ADBE Position_0", "cursor", (40, 78), 923, 713),
    (W + "Cursor > ADBE Position_1", "cursor", (40, 78), 389, 683),
    (W + "CTRL_Click > " + EF % "Press (%)", "pressDriver", (80, 90), 0, 100),
    (S4 + "CTRL_Headline > " + EF % "Rise (%)", "wordRise", (4, 22), 0, 100),
    (S4 + "CTRL_Headline > " + EF % "Fade In (%)", "wordOpacity", (4, 16), 0, 100),
    (S4 + "CTRL_Headline > " + EF % "Unblur (%)", "unblur", (4, 18), 0, 100),
    (S4 + "Label_Pill > ADBE Opacity", "labelOpacity", (0, 10), 0, 100),
]
dump = json.load(open(sys.argv[1])); bad = 0; worst = 0
for key, ch, (f0, f1), a, b in CHECKS:
    if key not in dump: print("MISSING", key); bad += 1; continue
    ts, vs = ae_curve(dump[key])
    tt = np.arange(f0, f1 + 1e-9, 0.25) / 30
    ref = a + (b - a) * np.interp(tt * 30, FR, CH[ch]); ae = np.interp(tt, ts, vs)
    e = np.abs(ae - ref).max() / abs(b - a) * 100; worst = max(worst, e); bad += e > 2
    print("%s %5.2f%%  %s" % ("OK " if e <= 2 else "BAD", e, key))
# the cell tint switches when the chip passes 10%: same frame as the source?
ts, vs = ae_curve(dump[W + "Chip_1_Summit > ADBE Scale"])
frames = np.arange(0, 135)
src_on = frames[np.interp(frames, FR, CH["chip"]) > 0.1][0]; ae_on = frames[np.interp(frames / 30, ts, vs) > 10][0]
print("%s tint switches on frame %d (source %d)" % ("OK " if src_on == ae_on else "BAD", ae_on, src_on)); bad += src_on != ae_on
print("worst error %.2f%% of a move" % worst)
sys.exit(1 if bad else 0)
