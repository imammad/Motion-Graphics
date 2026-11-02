#!/usr/bin/env python3
"""Generates HubBox_CollectionPoints_Rebuild.jsx (+ PNG assets) from src/HubBoxCollection (Remotion).

  node ae/HubBoxCollection_ae/generator/source_curves.mjs > ae/HubBoxCollection_ae/generator/source_curves.json
  python3 ae/HubBoxCollection_ae/generator/build.py

Curves come from source_curves.json (Remotion's own spring / Easing, sampled at 1/8 frame). Each channel is split
into its separate moves (stretches where it actually changes) and every move is fitted to AE keys on whole
60 fps frames with the ae-builder skill's ease_fit.fit_move. Layout numbers are the same constants the scene uses.
"""
import json, math, os, re, sys
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
REPO = os.path.dirname(os.path.dirname(OUT))
SKILL = os.path.join(REPO, ".claude", "skills", "ae-builder")
sys.path.insert(0, os.path.join(SKILL, "scripts"))
from ease_fit import fit_move  # noqa: E402

FPS, W, H, DUR = 60, 1080, 1920, 5.5
SRC = json.load(open(os.path.join(HERE, "source_curves.json")))
TS = np.array(SRC["times"])
CH = {k: np.array(v) for k, v in SRC["channels"].items()}
CH["drop_cy"] = 120 + CH["drop_y"]          # supermarket parcel: layer y inside the 600 px icon comp


# ------------------------------------------------------------------ fits
NF = int(round(DUR * FPS))


def jumps(v):
    """Frame intervals i (between frame i and i+1) where the source pops instantly (a ring appearing at full opacity)."""
    rng = max(1e-9, v.max() - v.min()); d = np.abs(np.diff(v)); out = []
    for j in np.nonzero(d > 0.03 * rng)[0]:
        i = int(math.floor(TS[j] * FPS + 1e-9))
        if i not in out: out.append(i)
    return out


def windows(v, fa, fb):
    """Frame ranges [a, b] inside [fa, fb] where the channel moves (merged when the pause is under 4 frames)."""
    rng = max(1e-9, v.max() - v.min()); out = []
    for i in range(fa, fb):
        seg = v[(TS >= i / FPS - 1e-9) & (TS <= (i + 1) / FPS + 1e-9)]
        if not (seg.size and seg.max() - seg.min() > 2e-4 * rng): continue
        if out and i - out[-1][1] <= 4: out[-1][1] = i + 1
        else: out.append([i, i + 1])
    return out


def fit_channel(name):
    """Keys [t, value, speed, infl in, infl out, hold out] for a whole channel: every move fitted on its own,
    instant pops become a HOLD key on the frame before plus a key on the frame after."""
    v = CH[name]; rng = v.max() - v.min()
    if rng < 1e-6: return [], 0.0, float(v[0])
    val = lambda t: float(np.interp(t, TS, v))
    J = jumps(v); cuts = [0] + [j + 1 for j in J] + [NF]
    keys, worst = [], 0.0
    for pi in range(len(cuts) - 1):
        fa, fb = cuts[pi], cuts[pi + 1] - (1 if pi < len(cuts) - 2 else 0)
        piece = []
        for a, b in windows(v, fa, fb):
            t0, dur = a / FPS, (b - a) / FPS
            v0, v1 = val(t0 + 1e-6), val(t0 + dur - 1e-6)
            seg = v[(TS >= t0 - 1e-9) & (TS <= t0 + dur + 1e-9)]; srng = max(1e-9, seg.max() - seg.min())
            D = (v1 - v0) if abs(v1 - v0) >= 0.5 * srng else 1.25 * srng * (1 if seg.max() - v0 >= v0 - seg.min() else -1)
            f = lambda u, t0=t0, dur=dur, v0=v0, D=D: (val(min(t0 + dur - 1e-6, max(t0 + 1e-6, t0 + u * dur))) - v0) / D
            ks, err = fit_move(f, t0, dur, fps=FPS, tol=0.012 * srng / abs(D), max_keys=24)
            worst = max(worst, err * abs(D) / rng)
            for k in ks: piece.append([round(k[0], 6), round(v0 + k[1] * D, 5), round(k[2] * D, 5), round(k[3], 2), round(k[4], 2), 0])
        if pi > 0 and (not piece or piece[0][0] > fa / FPS + 1e-6):       # value right after a pop, if it then holds
            piece.insert(0, [round(fa / FPS, 6), round(val(fa / FPS + 1e-6), 5), 0.0, 33.33, 33.33, 0])
        if pi < len(cuts) - 2:                                            # hold until the pop
            if not piece or piece[-1][0] < fb / FPS - 1e-6: piece.append([round(fb / FPS, 6), round(val(fb / FPS - 1e-6), 5), 0.0, 33.33, 33.33, 1])
            else: piece[-1][5] = 1
        keys += piece
    return keys, worst, float(v[0])


FITS, FIT_ERR, STATIC = {}, {}, {}
SKIP = {"drop_y"}
for name in sorted(CH):
    if name in SKIP: continue
    k, e, v0 = fit_channel(name)
    if k: FITS[name], FIT_ERR[name] = k, e
    else: STATIC[name] = v0

# ------------------------------------------------------------------ SVG paths -> AE bezier paths
TOK = re.compile(r"[MmLlHhVvCcSsQqAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?")


def arc_to_cubics(x1, y1, rx, ry, phi, fa, fs, x2, y2):
    phi = math.radians(phi); c, s = math.cos(phi), math.sin(phi)
    dx, dy = (x1 - x2) / 2, (y1 - y2) / 2
    x1p, y1p = c * dx + s * dy, -s * dx + c * dy
    lam = (x1p / rx) ** 2 + (y1p / ry) ** 2
    if lam > 1: rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
    num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    co = math.sqrt(max(0, num / (rx * rx * y1p * y1p + ry * ry * x1p * x1p))) * (-1 if fa == fs else 1)
    cxp, cyp = co * rx * y1p / ry, -co * ry * x1p / rx
    cx, cy = c * cxp - s * cyp + (x1 + x2) / 2, s * cxp + c * cyp + (y1 + y2) / 2
    ang = lambda ux, uy, vx, vy: math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
    th1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if not fs and dth > 0: dth -= 2 * math.pi
    if fs and dth < 0: dth += 2 * math.pi
    n = max(1, int(math.ceil(abs(dth) / (math.pi / 2) - 1e-9))); d = dth / n
    k = 4 / 3 * math.tan(d / 4); segs = []
    pt = lambda t: (cx + rx * math.cos(t) * c - ry * math.sin(t) * s, cy + rx * math.cos(t) * s + ry * math.sin(t) * c)
    dv = lambda t: (-rx * math.sin(t) * c - ry * math.cos(t) * s, -rx * math.sin(t) * s + ry * math.cos(t) * c)
    for i in range(n):
        ta, tb = th1 + i * d, th1 + (i + 1) * d
        pa, pb, da, db = pt(ta), pt(tb), dv(ta), dv(tb)
        segs.append(((pa[0] + k * da[0], pa[1] + k * da[1]), (pb[0] - k * db[0], pb[1] - k * db[1]), pb))
    return segs


def svg_paths(d, tx=lambda p: p):
    """SVG path data -> [{v, i, o, c}] in AE form (tangents relative to their vertex), mapped through tx."""
    toks = TOK.findall(d); i = 0; cmd = None; subs = []; cur = None
    x = y = 0.0; last_c = None
    def num():
        nonlocal i; i += 1; return float(toks[i - 1])
    def start(px, py):
        nonlocal cur; cur = {"pts": [(px, py)], "in": [(0, 0)], "out": [(0, 0)], "c": False}; subs.append(cur)
    def add(c1, c2, p):
        cur["out"][-1] = (c1[0] - cur["pts"][-1][0], c1[1] - cur["pts"][-1][1])
        cur["pts"].append(p); cur["in"].append((c2[0] - p[0], c2[1] - p[1])); cur["out"].append((0, 0))
    while i < len(toks):
        if re.match(r"[A-Za-z]", toks[i]): cmd = toks[i]; i += 1
        rel = cmd.islower(); C = cmd.upper(); ox, oy = (x, y) if rel else (0, 0)
        if C == "Z":
            cur["c"] = True; x, y = cur["pts"][0]; last_c = None; continue
        if C == "M":
            x, y = ox + num(), oy + num(); start(x, y); cmd = "l" if rel else "L"; last_c = None
        elif C in "LHV":
            if C == "L": nx, ny = ox + num(), oy + num()
            elif C == "H": nx, ny = ox + num(), y
            else: nx, ny = x, oy + num()
            add((x, y), (nx, ny), (nx, ny)); x, y = nx, ny; last_c = None
        elif C == "C":
            c1 = (ox + num(), oy + num()); c2 = (ox + num(), oy + num()); p = (ox + num(), oy + num())
            add(c1, c2, p); x, y = p; last_c = c2
        elif C == "S":
            c1 = (2 * x - last_c[0], 2 * y - last_c[1]) if last_c else (x, y)
            c2 = (ox + num(), oy + num()); p = (ox + num(), oy + num())
            add(c1, c2, p); x, y = p; last_c = c2
        elif C == "Q":
            q = (ox + num(), oy + num()); p = (ox + num(), oy + num())
            add((x + 2 / 3 * (q[0] - x), y + 2 / 3 * (q[1] - y)), (p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1])), p)
            x, y = p; last_c = None
        elif C == "A":
            rx, ry, ph, fa, fs = num(), num(), num(), num(), num(); p = (ox + num(), oy + num())
            for c1, c2, pe in arc_to_cubics(x, y, rx, ry, ph, int(fa), int(fs), p[0], p[1]): add(c1, c2, pe)
            x, y = p; last_c = None
    out = []
    for s in subs:
        pts, ins, outs = s["pts"], s["in"], s["out"]
        if s["c"] and len(pts) > 1 and math.hypot(pts[-1][0] - pts[0][0], pts[-1][1] - pts[0][1]) < 1e-6:
            ins[0] = ins[-1]; pts, ins, outs = pts[:-1], ins[:-1], outs[:-1]
        sc = tx((1, 1)); o0 = tx((0, 0)); kx, ky = sc[0] - o0[0], sc[1] - o0[1]
        out.append({"v": [[round(c, 3) for c in tx(p)] for p in pts], "i": [[round(a * kx, 3), round(b * ky, 3)] for a, b in ins],
                    "o": [[round(a * kx, 3), round(b * ky, 3)] for a, b in outs], "c": s["c"]})
    return out


# ------------------------------------------------------------------ icons (src/HubBoxCollection/Icons.tsx, 120-unit grid at 3x + 120 px margin)
IC = lambda p: (120 + 3 * p[0], 120 + 3 * p[1])
SW = 6.5 * 3


def hx(c): return "#%02X%02X%02X" % tuple(int(round(v)) for v in c)
def mix(a, b, t): return [a[k] + (b[k] - a[k]) * t for k in range(3)]
def h2c(h): return [int(h[i:i + 2], 16) for i in (1, 3, 5)]


# icon gradient: userSpace (0,0)->(120,120), #FF9CBC / #EF296A 50% / #D11657. Gradient Ramp takes 2 colours, so it
# runs between t = 0.25 and 0.75 (the part the glyphs actually cover) with the source's colours at those points.
G0, G1, G2 = h2c("#FF9CBC"), h2c("#EF296A"), h2c("#D11657")
RAMP = {"a": [210, 210], "b": [390, 390], "ca": hx(mix(G0, G1, 0.5)), "cb": hx(mix(G1, G2, 0.5))}

def P(d): return svg_paths(d, IC)
def R(x, y, w, h, r): return {"rect": [120 + 3 * (x + w / 2), 120 + 3 * (y + h / 2), 3 * w, 3 * h, 3 * r]}
def E(x, y, r): return {"ell": [120 + 3 * x, 120 + 3 * y, 6 * r]}
PARCEL_RECT = {"rect": [0, 0, 72, 66, 10.5]}
TAPE = svg_paths("M-12 -3 H12 M0 -11 V-3", lambda p: (3 * p[0], 3 * p[1]))

ICONS = {
    "Locker": [
        {"name": "Parcel", "pos": list(IC((82, 60))), "groups": [dict(PARCEL_RECT, fill=1)], "ramp": 1, "fits": [["op", "parcel_op"], ["scale", "parcel_scale"]]},
        {"name": "Parcel_Tape", "pos": [0, 0], "parent": "Parcel", "groups": [{"paths": TAPE, "stroke": 7.2, "white": 1}], "opcopy": 1},
        {"name": "Locker_Body", "pos": [0, 0], "ramp": 1, "groups": [dict(R(16, 12, 88, 96, 12), stroke=SW), {"paths": P("M60 12 V108 M16 44 H104 M16 76 H104"), "stroke": SW}]
            + [dict(E(x, y, 3.6), fill=1) for x, y in [(51, 28), (69, 28), (51, 92), (69, 92), (51, 60)]]},
        {"name": "Door", "pos": list(IC((104, 60))), "groups": [{"rect": [-66, 0, 132, 96, 0], "fill": 1, "solid": 1}], "fits": [["scalex", "door_scalex"], ["fillop", "door_fill"]]},
        {"name": "Door_Handle", "pos": [0, 0], "parent": "Door", "groups": [{"ell": [-105, 0, 21.6], "fill": 1, "white": 1}], "fits": [["op", "door_handle"]]},
        {"name": "Door_Hinge", "pos": [0, 0], "ramp": 1, "groups": [{"paths": P("M104 44 V76"), "stroke": SW}]},
    ],
    "PickupPoint": [
        {"name": "Store", "pos": [0, 0], "ramp": 1, "groups": [
            {"paths": P("M24 36 H96 L106 56 H14 Z"), "stroke": SW}, {"paths": P("M42 36 L38 56 M60 36 V56 M78 36 L82 56"), "stroke": SW},
            {"paths": P("M14 56 q11.5 11 23 0 q11.5 11 23 0 q11.5 11 23 0 q11.5 11 23 0"), "stroke": SW},
            {"paths": P("M20 66 V108 M100 66 V108 M10 108 H110"), "stroke": SW},
            dict(R(49, 80, 22, 28, 3), stroke=SW), dict(R(28, 74, 13, 13, 3), stroke=SW), dict(R(79, 74, 13, 13, 3), stroke=SW)]},
        {"name": "Pin", "pos": [0, 0], "ramp": 1, "groups": [{"paths": P("M60 32 C52 23 48.5 19.5 48.5 13.5 A11.5 11.5 0 1 1 71.5 13.5 C71.5 19.5 68 23 60 32 Z"), "fill": 1}],
         "fits": [["y", "pin_y"], ["op", "pin_op"]]},
        {"name": "Pin_Dot", "pos": [0, 0], "parent": "Pin", "groups": [dict(E(60, 13.5, 4.2), fill=1, white=1)], "opcopy": 1},
    ],
    "Supermarket": [
        {"name": "Parcel", "pos": [120 + 3 * 66, 120 + 3 * 4], "scale": 105, "ramp": 1, "groups": [dict(PARCEL_RECT, fill=1)], "fits": [["y", "drop_cy"], ["op", "drop_op"]]},
        {"name": "Parcel_Tape", "pos": [0, 0], "parent": "Parcel", "groups": [{"paths": TAPE, "stroke": 7.2, "white": 1}], "opcopy": 1},
        {"name": "Cart", "pos": [0, 0], "ramp": 1, "groups": [{"paths": P("M8 20 H22 L35 80 H94"), "stroke": SW}, {"paths": P("M26 34 H106 L97 66 H32"), "stroke": SW},
                                                               dict(E(42, 96, 7.5), stroke=SW), dict(E(88, 96, 7.5), stroke=SW)]},
    ],
    "Pin": [
        {"name": "Pin_Outline", "pos": [0, 0], "ramp": 1, "groups": [{"paths": P("M60 110 C38 84 22 68 22 46 A38 38 0 1 1 98 46 C98 68 82 84 60 110 Z"), "stroke": SW}]},
        {"name": "Parcel", "pos": list(IC((60, 46))), "scale": 125, "ramp": 1, "groups": [dict(PARCEL_RECT, fill=1)]},
        {"name": "Parcel_Tape", "pos": [0, 0], "parent": "Parcel", "groups": [{"paths": TAPE, "stroke": 7.2, "white": 1}]},
    ],
}

# ------------------------------------------------------------------ map streets (MapStreets in CollectionVideo.tsx, 860 x 1000)
M1 = lambda d: svg_paths(d)
MAP = [
    {"name": "Map_Blocks", "groups": [{"rect": [680, 635, 240, 150, 28], "fill": 1, "col": "#FFFFFF", "op": 3.5}, {"rect": [170, 155, 200, 130, 28], "fill": 1, "col": "#FFFFFF", "op": 3.5}]},
    {"name": "Map_Water", "groups": [{"paths": M1("M-20 820 C 200 760, 360 900, 560 860 S 820 760, 900 800"), "stroke": 46, "col": "#785AE6", "op": 20}]},
    {"name": "Map_Main_Roads", "groups": [{"paths": M1(d), "stroke": 22, "col": "#FFFFFF", "op": 9} for d in
                                          ["M-20 300 C 220 280, 420 380, 880 330", "M300 -20 C 330 300, 380 600, 520 980", "M-20 640 C 260 600, 520 520, 880 560"]]},
    {"name": "Map_Side_Streets", "groups": [{"paths": M1(d), "stroke": 8, "col": "#FFFFFF", "op": 6} for d in
                                            ["M640 -20 C 620 200, 690 420, 660 980", "M-20 470 H 880", "M120 300 V 980", "M-20 930 C 300 900, 600 960, 880 920"]]},
]

# ------------------------------------------------------------------ scene layout (constants of CollectionVideo.tsx)
HERO = [540, 930]; HUB = [540, 1070]; MAP_C = 128
MAPPT = {"locker": [300, 810], "pickup": [790, 770], "super": [770, 1340]}
OTHERS = [[250, 1160], [500, 1450], [850, 1060]]
targets = [MAPPT["locker"], MAPPT["pickup"], MAPPT["super"]] + OTHERS
CG0, CG1 = h2c("#FF8AB0"), h2c("#EF296A")
links = []
for i, p in enumerate(targets):
    L = math.hypot(p[0] - HUB[0], p[1] - HUB[1]); ux, uy = (p[0] - HUB[0]) / L, (p[1] - HUB[1]) / L
    a = [HUB[0] + ux * 34, HUB[1] + uy * 34]; b = [p[0] - ux * (MAP_C / 2 + 12), p[1] - uy * (MAP_C / 2 + 12)]
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    t = (mx * 1080 + my * 1920) / (1080 ** 2 + 1920 ** 2)          # userSpace gradient (0,0)->(1080,1920)
    links.append({"a": [round(a[0], 3), round(a[1], 3)], "b": [round(b[0], 3), round(b[1], 3)], "col": hx(mix(CG0, CG1, t))})

# Headline baseline: Chrome line box (line-height 1.08) centred on y, Plus Jakarta Sans ascent 1.038 / descent 0.222,
# rounded to whole px like Chrome. Text layers are centre-justified point text on that baseline.
FS = 112; LH = 1.08 * FS; ASC, DSC = round(1.038 * FS), round(0.222 * FS)
BASE_OFF = -LH / 2 + (LH - (ASC + DSC)) / 2 + ASC            # baseline below the box centre
heads = []
for k, (txt, y, extra) in enumerate([("Locker", 380, 0), ("Pickup Point", 380, 0), ("Supermarket", 380, 0), ("Any Collection", 340, 0), ("Location", 461, 14)]):
    heads.append({"text": txt, "base": round(y + BASE_OFF, 3), "box": round(-BASE_OFF, 3), "extra": extra, "fit": k})
# "Location" gradient (160deg #FF7AA3 / #EF296A 55% / #C4144F over the 1080 x 121 line box): 2-colour ramp between
# the 25% and 75% points of the gradient line, where the glyphs sit.
a160 = math.radians(160); dxg, dyg = math.sin(a160), -math.cos(a160); Lg = abs(1080 * dxg) + abs(LH * dyg)
LG0, LG1, LG2 = h2c("#FF7AA3"), h2c("#EF296A"), h2c("#C4144F")
gc = lambda t: mix(LG0, LG1, t / 0.55) if t <= 0.55 else mix(LG1, LG2, (t - 0.55) / 0.45)
heads[4]["ramp"] = {"a": [round((0.25 - 0.5) * Lg * dxg, 2), round(-BASE_OFF + (0.25 - 0.5) * Lg * dyg, 2)], "ca": hx(gc(0.25)),
                    "b": [round((0.75 - 0.5) * Lg * dxg, 2), round(-BASE_OFF + (0.75 - 0.5) * Lg * dyg, 2)], "cb": hx(gc(0.75))}

LAY = {"icons": ICONS, "map": MAP, "links": links, "heads": heads, "ramp": RAMP, "hero": HERO, "hub": HUB, "mappt": MAPPT, "others": OTHERS,
       "dock": [[330, 1520], [540, 1520], [750, 1520]], "fixed": {k: round(v, 4) for k, v in STATIC.items()}}

# ------------------------------------------------------------------ PNG assets (exact CSS maths, see Background.tsx / CollectionVideo.tsx)
A = os.path.join(OUT, "assets"); os.makedirs(A, exist_ok=True)


def save_premul(rgbp, a, path):   # premultiplied rgb + alpha -> straight RGBA PNG
    a = np.clip(a, 0, 1); rgb = np.where(a[..., None] > 1e-6, rgbp / np.maximum(a[..., None], 1e-6), 0)
    img = np.dstack([np.clip(rgb * 255 + 0.5, 0, 255), np.clip(a * 255 + 0.5, 0, 255)]).astype(np.uint8)
    Image.fromarray(img, "RGBA").save(path, optimize=True)


def stops_eval(d, stops):          # CSS gradient: colours interpolate in premultiplied space
    pos = [s[0] for s in stops]; cols = [np.array(s[1][:3], float) / 255 * s[1][3] for s in stops]; al = [s[1][3] for s in stops]
    a = np.interp(d, pos, al); rgbp = np.dstack([np.interp(d, pos, [c[k] for c in cols]) for k in range(3)])
    return rgbp, a


def radial(w, h, cx, cy, rx, ry, stops, clip_ellipse=False, path=None):
    y, x = np.mgrid[0:h, 0:w] + 0.5
    d = np.hypot((x - cx) / rx, (y - cy) / ry)
    rgbp, a = stops_eval(d, stops)
    if clip_ellipse:
        inside = (((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2) <= 1
        a = a * inside; rgbp = rgbp * inside[..., None]
    save_premul(rgbp, a, path)


PINKA = lambda al: (239, 41, 106, al)
for name, r, col in [("blob_pink_top", 420, PINKA(0.42)), ("blob_violet_left", 460, (98, 62, 214, 0.48)),
                     ("blob_pink_low", 300, PINKA(0.22)), ("blob_violet_top", 320, (120, 80, 220, 0.28))]:
    radial(2 * r, 2 * r, r, r, r * math.sqrt(2), r * math.sqrt(2), [(0, col), (0.68, col[:3] + (0,)), (99, col[:3] + (0,))], path=os.path.join(A, name + ".png"))
# ambient arc: 1600 x 1100 div, border-radius 50%, radial-gradient(ellipse at 50% 0%) farthest-corner
radial(1600, 1100, 800, 0, 800 * math.sqrt(2), 1100 * math.sqrt(2),
       [(0, PINKA(0.38)), (0.38, (110, 26, 69, 0.22)), (0.70, (110, 26, 69, 0)), (99, (110, 26, 69, 0))], clip_ellipse=True, path=os.path.join(A, "ambient_arc.png"))
# vignette: radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, rgba(10,8,18,.55) 100%)
radial(W, H, 540, 0.45 * H, 0.9 * W, 0.7 * H, [(0, (10, 8, 18, 0)), (0.55, (10, 8, 18, 0)), (1, (10, 8, 18, 0.55)), (99, (10, 8, 18, 0.55))], path=os.path.join(A, "vignette.png"))
# hero glow behind the centre-stage icon: 660 px circle
radial(660, 660, 330, 330, 330 * math.sqrt(2), 330 * math.sqrt(2), [(0, PINKA(0.42)), (0.40, PINKA(0.10)), (0.68, PINKA(0)), (99, PINKA(0))], path=os.path.join(A, "hero_glow.png"))
# base ground: linear-gradient(180deg, #0F0B19 0%, #15122A 48%, #1A1636 100%)
yy = (np.arange(H) + 0.5) / H
base = np.stack([np.interp(yy, [0, 0.48, 1], [c[k] for c in [h2c("#0F0B19"), h2c("#15122A"), h2c("#1A1636")]]) for k in range(3)], axis=-1)   # (H, 3)
Image.fromarray(np.repeat(np.clip(base[:, None, :] + 0.5, 0, 255).astype(np.uint8), W, axis=1), "RGB").save(os.path.join(A, "ground.png"))
# hex network: pointy-top hexes r 64, stroke rgba(239,41,106,.11) 1.4 px, masked by radial-gradient(ellipse 75% 60% at 50% 45%, .9 -> 0 at 85%)
S = 4; img = Image.new("L", (W * S, H * S), 0); dr = ImageDraw.Draw(img); HR = 64; HW = math.sqrt(3) * HR
for row in range(-1, int(H / (HR * 1.5)) + 3):
    for col in range(-1, int(W / HW) + 3):
        cx = col * HW + (HW / 2 if row % 2 else 0); cy = row * HR * 1.5
        pts = [((cx + HR * math.cos(math.radians(60 * i - 90))) * S, (cy + HR * math.sin(math.radians(60 * i - 90))) * S) for i in range(7)]
        dr.line(pts, fill=255, width=int(round(1.4 * S)))
lines = np.asarray(img, float).reshape(H, S, W, S).mean(axis=(1, 3)) / 255
y, x = np.mgrid[0:H, 0:W] + 0.5
mask = np.interp(np.hypot((x - 540) / (0.75 * W), (y - 0.45 * H) / (0.6 * H)), [0, 0.85, 99], [0.9, 0, 0])
a = lines * 0.11 * mask
save_premul(np.dstack([a * 239 / 255, a * 41 / 255, a * 106 / 255]), a, os.path.join(A, "hex_network.png"))
# hub dot at 2x: 52 px padding box + 5 px white border, radial-gradient(circle at 35% 30%, #FF9CBC, #EF296A 60%, #C4144F)
S2 = 2; n = 62 * S2; y, x = (np.mgrid[0:n, 0:n] + 0.5) / S2
r = np.hypot(x - 31, y - 31); inner = r <= 26; ring = (r > 26) & (r <= 31)
fx_, fy_ = 5 + 0.35 * 52, 5 + 0.30 * 52; far = math.hypot(57 - fx_, 57 - fy_)
t = np.hypot(x - fx_, y - fy_) / far
rgb = np.dstack([np.interp(t, [0, 0.6, 1], [c[k] for c in [h2c("#FF9CBC"), h2c("#EF296A"), h2c("#C4144F")]]) for k in range(3)]) / 255
rgbp = rgb * inner[..., None] + 0.95 * ring[..., None]; al = inner * 1.0 + ring * 0.95
save_premul(rgbp, al.astype(float), os.path.join(A, "hub_dot.png"))

# ------------------------------------------------------------------ write the .jsx
lib = open(os.path.join(SKILL, "assets", "ae_build_lib.jsx")).read()
body = open(os.path.join(HERE, "build_body.jsx")).read()
data = "\n".join([
    "// ---------------------------------------------------------------- generated data (generator/build.py)",
    "FPS = %d; W = %d; H = %d;" % (FPS, W, H),
    "var CURVES = {};",
    "// FITS: Remotion's own curves fitted to AE keys [t (s), value, speed (value/s), infl in %, infl out %]. Apply with applyFit(L, which, FITS.x, 0, 1).",
    "var FITS = {\n" + ",\n".join('  %s: %s' % (k, json.dumps(v)) for k, v in FITS.items()) + "\n};",
    "var LAY = " + json.dumps(LAY) + ";", ""])
jsx = os.path.join(OUT, "HubBox_CollectionPoints_Rebuild.jsx")
open(jsx, "w").write("// HubBox: \"A locker, pickup point, supermarket or other collection location\" rebuilt for After Effects.\n"
                     "// GENERATED by ae/HubBoxCollection_ae/generator/build.py from src/HubBoxCollection, do not edit by hand.\n" + lib + "\n" + data + body)
json.dump({"fits": FITS, "err": FIT_ERR}, open(os.path.join(HERE, "fits.json"), "w"))
print("wrote", jsx, "(%d fitted channels, %d keys)" % (len(FITS), sum(len(v) for v in FITS.values())))
worst = sorted(FIT_ERR.items(), key=lambda kv: -kv[1])[:6]
print("worst fits:", ", ".join("%s %.2f%%" % (k, e * 100) for k, e in worst))
print("static:", STATIC)
