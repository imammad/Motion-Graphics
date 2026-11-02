// ---------------------------------------------------------------- HubBox collection points build (hand-written part, ES3)
var PINK = "#EF296A", WHITE = "#FFFFFF", BLACK = "#000000";
var DUR = 5.5;   // 330 frames at 60 fps; this line sits at VO 0:06.00-0:10.03
var VO = [[0.36, "locker"], [0.84, "pickup point"], [1.41, "supermarket"], [2.06, "or other"], [2.72, "collection"], [3.27, "location"], [4.03, "(VO ends)"]];
var HEAD_FONT = "PlusJakartaSans-Bold";   // Satoshi-Bold is used instead when it is installed (see the run block)

// ---------------------------------------------------------------- small helpers
function fx(L, matchName, name) { var e = prop(L, "ADBE Effect Parade").addProperty(matchName); e.name = name; return e; }
function fxp(L, name, i) { return prop(prop(prop(L, "ADBE Effect Parade"), name), i); }
function maxOf(p, dflt) { var mx = dflt; try { if (p.hasMax) mx = p.maxValue; } catch (e) { } return mx; }
// Drop Shadow used as a glow (distance 0) or a real shadow. Opacity range differs between AE versions: scaled by its max.
function shadowFx(L, name, col, pct, dist, soft, only) {
  try { fx(L, "ADBE Drop Shadow", name); } catch (e) { ERRORS.push(L.containingComp.name + " > " + L.name + ": '" + name + "' not added (" + e.toString() + "), add Effect > Perspective > Drop Shadow by hand"); return 0; }
  fxp(L, name, 1).setValue(rgba(col));
  var op = fxp(L, name, 2), mx = maxOf(op, 100);
  op.setValue(pct / 100 * mx); fxp(L, name, 3).setValue(180); fxp(L, name, 4).setValue(dist); fxp(L, name, 5).setValue(soft);
  if (only) fxp(L, name, 6).setValue(1);
  return mx;
}
function rampFx(L, a, ca, b, cb) {
  fx(L, "ADBE Ramp", "Gradient"); fxp(L, "Gradient", 1).setValue(a); fxp(L, "Gradient", 2).setValue(rgba(ca));
  fxp(L, "Gradient", 3).setValue(b); fxp(L, "Gradient", 4).setValue(rgba(cb)); fxp(L, "Gradient", 5).setValue(1);
}
function marker(L, t, text) { prop(L, "ADBE Marker").setValueAtTime(lt(t), new MarkerValue(text)); }
// Fitted keys: FITS values are absolute, so applyFit maps fraction = value (from 0 to 1).
function hasFit(n) { return FITS[n] != null; }
// keys flagged hold (6th value = 1) jump to the next key, like the source's instant pops
function holds(p, fit) { for (var i = 0; i < fit.length; i++) if (fit[i][5] == 1) { var k = p.nearestKeyIndex(lt(fit[i][0])); try { p.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.HOLD); } catch (e) { } } }
function fitTo(L, which, n) { if (hasFit(n)) { applyFit(L, which, FITS[n], 0, 1); holds(getter(L, which)(), FITS[n]); } else if (LAY.fixed[n] != null) getter(L, which)().setValue(LAY.fixed[n]); }
function fit2(L, which, n) { if (hasFit(n)) { applyFit(L, which, FITS[n], [0, 0], [1, 1]); holds(getter(L, which)(), FITS[n]); } }   // 2D properties (sizes) get [v, v]
function fitScale(L, n) { if (hasFit(n)) { applyFit(L, "scale", FITS[n], [0, 0], [1, 1]); holds(S(L), FITS[n]); } else if (LAY.fixed[n] != null) sv(L, [LAY.fixed[n], LAY.fixed[n]]); }
function fixedOr(n) { return LAY.fixed[n] != null ? LAY.fixed[n] : FITS[n][0][1]; }
// Straight-line keys (the source is linear here): bezier with the segment slopes, still easy to re-ease.
function linKeys(L, which, pts) {
  var p = getter(L, which)(), i, k;
  for (i = 0; i < pts.length; i++) setKeySafe(p, lt(pts[i][0]), pts[i][1]);
  for (i = 0; i < pts.length; i++) {
    var sIn = i > 0 ? (pts[i][1] - pts[i - 1][1]) / (pts[i][0] - pts[i - 1][0]) : 0;
    var sOut = i < pts.length - 1 ? (pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]) : 0;
    if (i == 0) sIn = sOut; if (i == pts.length - 1) sOut = sIn;
    k = p.nearestKeyIndex(lt(pts[i][0]));
    p.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
    setEaseSafe(p, k, [new KeyframeEase(sIn, 33.33)], [new KeyframeEase(sOut, 33.33)]); KEY_COUNT++;
  }
}
function adj(c, name) { var L = c.layers.addSolid([1, 1, 1], name, W, H, 1); L.name = name; L.adjustmentLayer = true; L.label = 10; LAYER_COUNT++; return L; }
function png(c, root, fold, rel, name, pos) {
  var it = importAsset(root, rel, fold); if (!it) return null;
  var L = c.layers.add(it); L.name = name; LAYER_COUNT++; if (pos) setv(P(L), pos); L.label = 15; return L;
}
function guide(c, lines) {
  var T = c.layers.addText(lines.join("\r")); T.name = "GUIDE_READ_ME";
  var sp = prop(prop(T, "ADBE Text Properties"), "ADBE Text Document"), d = sp.value;
  setFont(d, "PlusJakartaSans-Bold"); d.fontSize = 22; d.applyFill = true; d.fillColor = rgb("#FFD24A"); d.applyStroke = false;
  d.justification = ParagraphJustification.LEFT_JUSTIFY; sp.setValue(d);
  setv(A(T), [0, 0]); setv(P(T), [40, 70]); LAYER_COUNT++;
  T.guideLayer = true; T.enabled = false; T.label = 2; lockLater(T); return T;   // eye off: it would cover the picture
}
// Centre-justified point text sitting on its baseline (the layer's origin = baseline centre).
function txtC(c, name, str, font, size, col, tracking, pos) {
  var L = c.layers.addText(str); L.name = name;
  var sp = prop(prop(L, "ADBE Text Properties"), "ADBE Text Document"), d = sp.value;
  if (d.resetCharStyle) d.resetCharStyle(); if (d.resetParagraphStyle) d.resetParagraphStyle();
  setFont(d, font); d.fontSize = size; d.applyFill = true; d.fillColor = rgb(col); d.applyStroke = false; d.tracking = tracking || 0;
  d.justification = ParagraphJustification.CENTER_JUSTIFY; sp.setValue(d);
  setv(A(L), [0, 0]); setv(P(L), pos); L.label = 15; LAYER_COUNT++; return L;
}
// shape contents built from generator data: rect [cx, cy, w, h, r], ell [cx, cy, d] or SVG-converted paths
function drawGroups(L, groups, defCol) {
  for (var i = 0; i < groups.length; i++) {
    var s = groups[i], g = grp(L, "Part " + (i + 1)), col = s.white ? WHITE : (s.col || defCol), j;
    if (s.rect) rect(g, s.rect[2], s.rect[3], s.rect[0], s.rect[1], s.rect[4]);
    if (s.ell) ell(g, s.ell[2], s.ell[2], s.ell[0], s.ell[1]);
    if (s.paths) for (j = 0; j < s.paths.length; j++) pth(g, s.paths[j].v, s.paths[j].c, s.paths[j].i, s.paths[j].o);
    if (s.stroke) stroke(g, col, s.stroke, true);
    if (s.fill) fill(g, col, s.op != null ? s.op : null);
    if (s.stroke && s.op != null) prop(prop(vg(g), "ADBE Vector Graphic - Stroke"), "ADBE Vector Stroke Opacity").setValue(s.op);
  }
}

// ---------------------------------------------------------------- expressions a designer can read (all linear maps of keyed sliders)
function q(s) { return "\"" + s + "\""; }
function eff(c, n, kind) { return c + ".effect(" + q(n) + ")(" + q(kind || "Slider") + ")"; }
// Gradient reveal as a feathered mask: the source's CSS mask-image linear-gradient, rebuilt exactly in layer space.
// N = { ctrl: expression for the control layer, label, rev: reveal slider, ang: angle control, soft: softness slider,
//       geo: lines that set w and h, cx, cy: the shape's centre in this layer, focus: true = also follows the focus pull }
function revealLines(N) {
  var L = ["var c = " + N.ctrl + ";",
    "var p = " + eff("c", N.rev) + " / 100;"].concat(N.geo);
  L.push(N.focus ? "var k = 1 + (1 - p) * " + eff("c", "Focus Scale (%)") + " / 100, oy = (1 - p) * " + eff("c", "Focus Drop (px)") + ";" : "var k = 1, oy = 0;");
  L.push("var a = " + eff("c", N.ang, "Angle") + " * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a);   // CSS angle: 0 = up, 90 = right");
  L.push("var soft = " + eff("c", N.soft) + " / 100, L = (Math.abs(w * dx) + Math.abs(h * dy)) * k;   // CSS gradient line length");
  L.push("var e = -soft - 0.05 + p * (1 + 2 * soft + 0.1);   // the edge starts just before the shape and ends just past it");
  return L;
}
function revealHead(N) { return "// REVEAL: soft gradient wipe that uncovers this layer. Controls: " + N.label + " > " + N.rev + " keys (the ease), " + N.ang + ", " + N.soft + (N.focus ? ", Focus Drop (px), Focus Scale (%)" : "") + "."; }
function revealMask(Lr, N) {
  addMask(Lr, "Reveal", rrShape(-10, -10, 20, 20, 0));
  var L = revealLines(N);
  expr(Lr, function () { return prop(prop(prop(Lr, "ADBE Mask Parade"), "Reveal"), "ADBE Mask Shape"); },
    [revealHead(N)].concat(L).concat([
      "var s = (e - soft / 2) * L - L / 2, mx = " + N.cx + " + dx * s, my = " + N.cy + " + oy + dy * s, B = 6000;",
      "createPath([[mx - dy * B, my + dx * B], [mx - dx * B - dy * B, my - dy * B + dx * B], [mx - dx * B + dy * B, my - dy * B - dx * B], [mx + dy * B, my - dx * B]], [], [], true);"]).join("\n"));
  expr(Lr, function () { return prop(prop(prop(Lr, "ADBE Mask Parade"), "Reveal"), "ADBE Mask Feather"); },
    ["// REVEAL EDGE: how soft the wipe's edge is (the source's gradient width). Controls: " + N.label + " > " + N.soft + "."].concat(L).concat(["[soft * L, soft * L];"]).join("\n"));
}

// ---------------------------------------------------------------- glass (backdrop blur = adjustment layer matted to the shape)
// One glass shape = MATTE (solid copy, hidden) + FX_Frost (blurs what is behind, through the matte) + Shadow
// (shadow only, cut out where the glass is) + Glass (fill + rim) + Sheen (top light). Size, focus pull and reveal
// all come from one control layer.
function glassSet(c, key, ctrl, ctrlName, pos, geo, kind, rev, ang, soft) {
  var C = "thisComp.layer(" + q(ctrlName) + ")", parts = {}, names = ["MATTE_" + key, key + "_Shadow", key + "_Glass", key + "_Sheen"], i;
  var N = { ctrl: C, label: ctrlName, rev: rev, ang: ang, soft: soft, geo: geo, cx: 0, cy: 0, focus: true };
  var HEAD = "Controls: " + ctrlName + " > " + rev + " keys, Focus Drop (px), Focus Scale (%).";
  function shapeLayer(name, col, op) {
    var L = shp(c, name, pos[0], pos[1]);
    var g = grp(L, "Glass");
    if (kind == "rect") rect(g, 100, 100, 0, 0, 10); else ell(g, 100, 100, 0, 0);
    fill(g, col, op);
    if (name == key + "_Glass") stroke(g, WHITE, 1.5, false);
    parentTo(L, ctrl);
    function shapeProp(m) { return function () { var gg = prop(prop(L, "ADBE Root Vectors Group"), "Glass"); return prop(prop(vg(gg), kind == "rect" ? "ADBE Vector Shape - Rect" : "ADBE Vector Shape - Ellipse"), m); }; }
    expr(L, shapeProp(kind == "rect" ? "ADBE Vector Rect Size" : "ADBE Vector Ellipse Size"),
      ["// SIZE: follows the glass size. Controls: " + ctrlName + (kind == "rect" ? " > Morph (%) keys, Width/Height Start and End (px)." : " > Circle (px) keys."), "var c = " + C + ";"].concat(geo).concat(["[w, h];"]).join("\n"));
    if (kind == "rect") expr(L, shapeProp("ADBE Vector Rect Roundness"),
      ["// CORNERS: follow the morph. Controls: " + ctrlName + " > Morph (%) keys, Corner Start/End (px).", "var c = " + C + ";"].concat(geo).concat(["r;"]).join("\n"));
    function gt(m) { return function () { return prop(gtr(prop(prop(L, "ADBE Root Vectors Group"), "Glass")), m); }; }
    expr(L, gt("ADBE Vector Position"), ["// FOCUS PULL: drops in from slightly lower as it reveals. " + HEAD, "var c = " + C + ";",
      "var p = " + eff("c", rev) + " / 100;", "[value[0], value[1] + (1 - p) * " + eff("c", "Focus Drop (px)") + "];"].join("\n"));
    expr(L, gt("ADBE Vector Scale"), ["// FOCUS PULL: settles from slightly bigger as it reveals. " + HEAD, "var c = " + C + ";",
      "var k = 1 + (1 - " + eff("c", rev) + " / 100) * " + eff("c", "Focus Scale (%)") + " / 100;", "[value[0] * k, value[1] * k];"].join("\n"));
    revealMask(L, N);
    blur(L); return L;
  }
  var matte = shapeLayer(names[0], WHITE, 100); parts.matte = matte;
  var frost = adj(c, "FX_Frost_" + key);
  fx(frost, "ADBE Gaussian Blur 2", "Frost"); fxp(frost, "Frost", 3).setValue(1);
  expr(frost, function () { return fxp(frost, "Frost", 1); }, "// FROST: blurs everything behind the glass (backdrop blur). Controls: CTRL_Glass > Frost Blur.\nthisComp.layer(\"CTRL_Glass\").effect(\"Frost Blur\")(\"Slider\");");
  MATTES.push([frost, matte, TrackMatteType.ALPHA]); parts.frost = frost;
  var sh = shapeLayer(names[1], BLACK, 100);
  shadowFx(sh, "Shadow", "#06040E", 55, 40, 90, true);
  MATTES.push([sh, matte, TrackMatteType.ALPHA_INVERTED]); parts.shadow = sh;
  var gl = shapeLayer(names[2], WHITE, 9); parts.glass = gl;
  var sn = shapeLayer(names[3], WHITE, 10); parts.sheen = sn;
  // the sheen only lights the top 38 % (source: linear-gradient(180deg, white 10%, transparent 38%))
  var fm = addMask(sn, "Top Fade", rrShape(-10, -10, 20, 20, 0)); try { fm.maskMode = MaskMode.INTERSECT; } catch (e) { WARN.push(key + "_Sheen: set the Top Fade mask to Intersect by hand"); }
  var TF = ["var c = " + C + ";"].concat(geo).concat(["var p = " + eff("c", rev) + " / 100, k = 1 + (1 - p) * " + eff("c", "Focus Scale (%)") + " / 100, oy = (1 - p) * " + eff("c", "Focus Drop (px)") + ";",
    "var top = -h / 2 * k + oy, cut = top + 0.19 * h * k, B = 6000;"]);
  expr(sn, function () { return prop(prop(prop(sn, "ADBE Mask Parade"), "Top Fade"), "ADBE Mask Shape"); },
    ["// SHEEN: light only across the top of the glass. " + HEAD].concat(TF).concat(["createPath([[-B, top - B], [B, top - B], [B, cut], [-B, cut]], [], [], true);"]).join("\n"));
  expr(sn, function () { return prop(prop(prop(sn, "ADBE Mask Parade"), "Top Fade"), "ADBE Mask Feather"); },
    ["// SHEEN FADE: the light fades out by 38 % of the height. " + HEAD].concat(TF).concat(["[0.38 * h * k, 0.38 * h * k];"]).join("\n"));
  for (i = 0; i < 2; i++) {   // focus blur on the visible parts
    var Lb = i == 0 ? gl : sn;
    fx(Lb, "ADBE Gaussian Blur 2", "Focus Blur"); fxp(Lb, "Focus Blur", 3).setValue(1);
    expr(Lb, function (LL) { return function () { return fxp(LL, "Focus Blur", 1); }; }(Lb),
      ["// FOCUS PULL: starts soft and sharpens as it reveals. Controls: " + ctrlName + " > " + rev + " keys, Focus Blur (px).", "var c = " + C + ";",
       "(1 - " + eff("c", rev) + " / 100) * " + eff("c", "Focus Blur (px)") + ";"].join("\n"));
  }
  return parts;
}
function focusControls(L) { ctl(L, "slider", "Focus Blur (px)", 12); ctl(L, "slider", "Focus Scale (%)", 3.5); ctl(L, "slider", "Focus Drop (px)", 26); }

// ---------------------------------------------------------------- icon precomps (glyph 120 units drawn at 3x, 120 px margin for the drop)
function buildIcon(fold, key) {
  var spec = LAY.icons[key], i, j, byName = {};
  var c = makeComp("PRE_Icon_" + key, DUR, fold, "The " + key + " glyph (Icons.tsx), drawn 3x on a 600 px comp so it stays crisp. Pink layers get the brand gradient (Gradient Ramp). Its own little moment (door, pin, parcel) is keyed here in scene time.", 600, 600);
  for (i = 0; i < spec.length; i++) {
    var s = spec[i], L = shp(c, s.name, s.pos[0], s.pos[1]);
    drawGroups(L, s.groups, PINK);
    if (s.scale) sv(L, [s.scale, s.scale]);
    if (s.parent) { parentTo(L, byName[s.parent]); setv(P(L), [0, 0]); }
    if (s.ramp) rampFx(L, [LAY.ramp.a[0] - s.pos[0], LAY.ramp.a[1] - s.pos[1]], LAY.ramp.ca, [LAY.ramp.b[0] - s.pos[0], LAY.ramp.b[1] - s.pos[1]], LAY.ramp.cb);
    if (s.opcopy) { L.label = 10; expr(L, "op", "// FADE: copies its parent's opacity, so retime the parent only. Controls: " + s.parent + " > Opacity keys.\nthisLayer.parent.transform.opacity;"); }
    if (s.fits) for (j = 0; j < s.fits.length; j++) {
      var f = s.fits[j], w = f[0], n = f[1];
      if (w == "op") fitTo(L, "op", n);
      else if (w == "scale") fitScale(L, n);
      else if (w == "scalex") { if (hasFit(n)) applyFit(L, "scale", FITS[n], [0, 100], [1, 100]); }
      else if (w == "y") { sep(L); fitTo(L, "y", n); }
      else if (w == "fillop") fitTo(L, function (LL) { return function () { return prop(prop(vg(prop(prop(LL, "ADBE Root Vectors Group"), "Part 1")), "ADBE Vector Graphic - Fill"), "ADBE Vector Fill Opacity"); }; }(L), n);
      blur(L);
    }
    byName[s.name] = L;
  }
  finishComp(c); return c;
}

function buildMap(fold) {
  var c = makeComp("PRE_MapStreets", DUR, fold, "The streets, water and blocks of the map (MapStreets in CollectionVideo.tsx), 860 x 1000. Revealed in S1 by the PRE_MapStreets layer's Reveal (%) keys and clipped to the card by MATTE_Card.", 860, 1000);
  for (var i = 0; i < LAY.map.length; i++) { var L = shp(c, LAY.map[i].name, 0, 0); drawGroups(L, LAY.map[i].groups, WHITE); lockLater(L); }
  finishComp(c); return c;
}

// ---------------------------------------------------------------- S1: the scene
function buildScene(fold, root, refFold, pre) {
  var c = makeComp("S1_CollectionPoints", DUR, fold, "\"A locker, pickup point, supermarket or other collection location\" (VO 0:06.00-0:10.03). 1080 x 1920, 60 fps, 5.5 s. One continuous move: card > dock > map.");
  var i, k;

  // ---- background (Background.tsx): ground, drifting colour fields, ambient arc, hex network, vignette
  var bc = nul(c, "CTRL_Background", 540, 120); ctl(bc, "slider", "Drift (%)", 100);
  var gnd = png(c, root, refFold, "assets/ground.png", "BG_Ground", [540, 960]); if (gnd) lockLater(gnd);
  var DRIFT = ["// DRIFT: the colour field drifts slowly so the glass has moving light behind it. Controls: CTRL_Background > Drift (%). This layer: Drift X/Y (px), Speed X/Y, Phase X/Y.",
    "var amt = thisComp.layer(\"CTRL_Background\").effect(\"Drift (%)\")(\"Slider\") / 100;",
    "add(value, mul([Math.sin(time * effect(\"Speed X\")(\"Slider\") + effect(\"Phase X\")(\"Slider\")) * effect(\"Drift X (px)\")(\"Slider\"), Math.sin(time * effect(\"Speed Y\")(\"Slider\") + effect(\"Phase Y\")(\"Slider\")) * effect(\"Drift Y (px)\")(\"Slider\")], amt));"].join("\n");
  var blobs = [["BG_Blob_Pink_Top", "blob_pink_top", [790, 560], [40, 0.5, 0, 50, 0.4, 1]], ["BG_Blob_Violet_Left", "blob_violet_left", [260, 1020], [50, 0.45, 2, 60, 0.35, 0]],
    ["BG_Blob_Pink_Low", "blob_pink_low", [880, 1250], [40, 0.4, 3, 40, 0.5, 2]], ["BG_Blob_Violet_Top", "blob_violet_top", [180, 380], [30, 0.3, 1, 30, 0.4, 3]],
    ["BG_Ambient_Arc", "ambient_arc", [540, 1950], [0, 0, 0, 14, 0.6, 0]]];
  for (i = 0; i < blobs.length; i++) {
    var Bl = png(c, root, refFold, "assets/" + blobs[i][1] + ".png", blobs[i][0], blobs[i][2]); if (!Bl) continue;
    var d = blobs[i][3];
    ctl(Bl, "slider", "Drift X (px)", d[0]); ctl(Bl, "slider", "Speed X", d[1]); ctl(Bl, "slider", "Phase X", d[2]);
    ctl(Bl, "slider", "Drift Y (px)", d[3]); ctl(Bl, "slider", "Speed Y", d[4]); ctl(Bl, "slider", "Phase Y", d[5]);
    expr(Bl, "pos", DRIFT); Bl.label = 10;
  }
  var hex = png(c, root, refFold, "assets/hex_network.png", "BG_Hex_Network", [540, 960]);
  if (hex) { sep(hex); linKeys(hex, "y", [[0, 960], [DUR, 960 - 14 * DUR]]); }   // scrolls up 14 px/s
  var vig = png(c, root, refFold, "assets/vignette.png", "BG_Vignette", [540, 960]); if (vig) lockLater(vig);

  // ---- global glass controls
  var gc = nul(c, "CTRL_Glass", 540, 60);
  ctl(gc, "slider", "Frost Blur", 80); ctl(gc, "slider", "Glow Size (%)", 100);

  // ---- the card: hero card that opens into the map
  var cc = nul(c, "CTRL_Card", LAY.hero[0], LAY.hero[1]);
  ctl(cc, "slider", "Reveal (%)", 0); ctl(cc, "slider", "Morph (%)", 0);
  ctl(cc, "slider", "Width Start (px)", 720); ctl(cc, "slider", "Width End (px)", 860); ctl(cc, "slider", "Height Start (px)", 720); ctl(cc, "slider", "Height End (px)", 1000);
  ctl(cc, "slider", "Corner Start (px)", 64); ctl(cc, "slider", "Corner End (px)", 56); ctl(cc, "slider", "Move Down (px)", 150);
  ctl(cc, "angle", "Wipe Angle", 160); ctl(cc, "slider", "Edge Softness (%)", 30); focusControls(cc);
  fitTo(cc, function () { return ctlProp(cc, "Reveal (%)"); }, "card_reveal");
  fitTo(cc, function () { return ctlProp(cc, "Morph (%)"); }, "card_morph");
  marker(cc, 2.06, "card opens into the map");
  expr(cc, "pos", "// MORPH MOVE: the card slides down as it opens into the map. Controls: CTRL_Card > Morph (%) keys, Move Down (px).\nvar c = thisComp.layer(\"CTRL_Card\");\nadd(value, [0, c.effect(\"Move Down (px)\")(\"Slider\") * c.effect(\"Morph (%)\")(\"Slider\") / 100]);");
  var CGEO = ["var m = " + eff("c", "Morph (%)") + " / 100;",
    "var w = " + eff("c", "Width Start (px)") + " + (" + eff("c", "Width End (px)") + " - " + eff("c", "Width Start (px)") + ") * m;",
    "var h = " + eff("c", "Height Start (px)") + " + (" + eff("c", "Height End (px)") + " - " + eff("c", "Height Start (px)") + ") * m;",
    "var r = " + eff("c", "Corner Start (px)") + " + (" + eff("c", "Corner End (px)") + " - " + eff("c", "Corner Start (px)") + ") * m;"];
  var card = glassSet(c, "Card", cc, "CTRL_Card", LAY.hero, CGEO, "rect", "Reveal (%)", "Wipe Angle", "Edge Softness (%)");

  // card contents, clipped to the card (MATTE_Card)
  var hg = png(c, root, refFold, "assets/hero_glow.png", "Hero_Glow", LAY.hero);
  if (hg) { fitTo(hg, "op", "hero_glow"); MATTES.push([hg, card.matte, TrackMatteType.ALPHA]); }
  for (k = 0; k < 6; k++) {
    var rp = shp(c, "Hero_Ripple_" + (k + 1), LAY.hero[0], LAY.hero[1]), rg = grp(rp, "Ring");
    ell(rg, 300, 300, 0, 0); stroke(rg, PINK, 2.5, false);
    fit2(rp, function (LL) { return function () { return prop(prop(vg(prop(prop(LL, "ADBE Root Vectors Group"), "Ring")), "ADBE Vector Shape - Ellipse"), "ADBE Vector Ellipse Size"); }; }(rp), "ripple" + k + "_size");
    fitTo(rp, "op", "ripple" + k + "_op"); MATTES.push([rp, card.matte, TrackMatteType.ALPHA]);
  }
  if (pre.map) {
    var mp = c.layers.add(pre.map); mp.name = "PRE_MapStreets"; LAYER_COUNT++; setv(P(mp), [540, 1080]);
    ctl(mp, "slider", "Reveal (%)", 0); ctl(mp, "angle", "Wipe Angle", 160); ctl(mp, "slider", "Edge Softness (%)", 34);
    fitTo(mp, function () { return ctlProp(mp, "Reveal (%)"); }, "map_reveal");
    revealMask(mp, { ctrl: "thisLayer", label: "PRE_MapStreets", rev: "Reveal (%)", ang: "Wipe Angle", soft: "Edge Softness (%)", geo: ["var w = 860, h = 1000;"], cx: 430, cy: 500, focus: false });
    MATTES.push([mp, card.matte, TrackMatteType.ALPHA]);
  }
  // leading-edge light that rides the card's wipe (source: pink-white band, screen)
  var edge = shp(c, "Card_Edge", LAY.hero[0], LAY.hero[1]), eg = grp(edge, "Glass"); rect(eg, 100, 100, 0, 0, 10); fill(eg, "#FF96BE"); parentTo(edge, cc);
  try { edge.blendingMode = BlendingMode.SCREEN; } catch (e) { WARN.push("Card_Edge: set its mode to Screen by hand"); }
  fitTo(edge, "op", "card_edge");
  function ep(m) { return function () { return prop(prop(vg(prop(prop(edge, "ADBE Root Vectors Group"), "Glass")), "ADBE Vector Shape - Rect"), m); }; }
  expr(edge, ep("ADBE Vector Rect Size"), ["// SIZE: same as the card. Controls: CTRL_Card > Morph (%) keys, Width/Height Start and End (px).", "var c = thisComp.layer(\"CTRL_Card\");"].concat(CGEO).concat(["[w, h];"]).join("\n"));
  expr(edge, ep("ADBE Vector Rect Roundness"), ["// CORNERS: same as the card. Controls: CTRL_Card > Morph (%) keys, Corner Start/End (px).", "var c = thisComp.layer(\"CTRL_Card\");"].concat(CGEO).concat(["r;"]).join("\n"));
  addMask(edge, "Band", rrShape(-10, -10, 20, 20, 0));
  var EN = { ctrl: "thisComp.layer(\"CTRL_Card\")", label: "CTRL_Card", rev: "Reveal (%)", ang: "Wipe Angle", soft: "Edge Softness (%)", geo: CGEO, cx: 0, cy: 0, focus: true };
  expr(edge, function () { return prop(prop(prop(edge, "ADBE Mask Parade"), "Band"), "ADBE Mask Shape"); },
    ["// EDGE LIGHT: a soft band that rides just behind the card's reveal edge. Controls: CTRL_Card > Reveal (%) keys, Wipe Angle, Edge Softness (%); this layer's Opacity keys = its brightness."].concat(revealLines(EN)).concat([
      "var s = (e - 0.55 * soft) * L - L / 2, hw = 0.1 * L, B = 6000;",
      "var ax = dx * (s - hw), ay = oy + dy * (s - hw), bx = dx * (s + hw), by = oy + dy * (s + hw);",
      "createPath([[ax - dy * B, ay + dx * B], [bx - dy * B, by + dx * B], [bx + dy * B, by - dx * B], [ax + dy * B, ay - dx * B]], [], [], true);"]).join("\n"));
  expr(edge, function () { return prop(prop(prop(edge, "ADBE Mask Parade"), "Band"), "ADBE Mask Feather"); },
    ["// EDGE LIGHT SOFTNESS: Controls: CTRL_Card > Edge Softness (%)."].concat(revealLines(EN)).concat(["[0.18 * L, 0.18 * L];"]).join("\n"));
  blur(edge);

  // ---- links from the shopper hub to every collection point
  for (i = 0; i < LAY.links.length; i++) {
    var lk = LAY.links[i], ln = shp(c, "Link_" + (i + 1), 0, 0), lg = grp(ln, "Link");
    pth(lg, [lk.a, lk.b], false);
    var st = stroke(lg, lk.col, 3.5, true); prop(st, "ADBE Vector Stroke Opacity").setValue(85); dashes(st, 2, 12);
    trim(lg);
    fitTo(ln, function (LL) { return function () { return prop(prop(vg(prop(prop(LL, "ADBE Root Vectors Group"), "Link")), "ADBE Vector Filter - Trim"), "ADBE Vector Trim End"); }; }(ln), "conn" + i + "_end");
    prop(prop(vg(prop(prop(ln, "ADBE Root Vectors Group"), "Link")), "ADBE Vector Filter - Trim"), "ADBE Vector Trim Start").setValue(0);
    var dot = shp(c, "Link_" + (i + 1) + "_End", lk.b[0], lk.b[1]), dg = grp(dot, "Dot"); ell(dg, 10, 10, 0, 0); fill(dg, PINK);
    fitTo(dot, "op", "conn" + i + "_dot");
    var pu = shp(c, "Link_" + (i + 1) + "_Pulse", lk.a[0], lk.a[1]), pg = grp(pu, "Pulse"); ell(pg, 14, 14, 0, 0); fill(pg, "#FFD1E0");
    sep(pu); fitTo(pu, "x", "conn" + i + "_px"); fitTo(pu, "y", "conn" + i + "_py"); fitTo(pu, "op", "conn" + i + "_pop");
    shadowFx(pu, "Glow", PINK, 100, 0, 10, false); blur(pu);
  }

  // ---- "location": one pulse across the network, clipped to the map card
  for (k = 0; k < 2; k++) {
    var lr = shp(c, "Location_Pulse_" + (k + 1), LAY.hub[0], LAY.hub[1]), lrg = grp(lr, "Ring");
    ell(lrg, 60, 60, 0, 0); stroke(lrg, PINK, k ? 2 : 4, false);
    fit2(lr, function (LL) { return function () { return prop(prop(vg(prop(prop(LL, "ADBE Root Vectors Group"), "Ring")), "ADBE Vector Shape - Ellipse"), "ADBE Vector Ellipse Size"); }; }(lr), "loc" + k + "_size");
    fitTo(lr, "op", "loc" + k + "_op"); shadowFx(lr, "Glow", PINK, 90, 0, 12, false);
    MATTES.push([lr, card.matte, TrackMatteType.ALPHA]); blur(lr);
  }
  if (lr) marker(lr, 3.27, "location");

  // ---- shopper hub
  for (k = 0; k < 4; k++) {
    var hr = shp(c, "Hub_Ripple_" + (k + 1), LAY.hub[0] + 2.5, LAY.hub[1] + 2.5), hrg = grp(hr, "Ring");
    ell(hrg, 222.5, 222.5, 0, 0); stroke(hrg, PINK, 2.5, false);
    fitScale(hr, "hubring" + k + "_scale"); fitTo(hr, "op", "hubring" + k + "_op"); blur(hr);
  }
  var hub = png(c, root, refFold, "assets/hub_dot.png", "Hub_Dot", [LAY.hub[0] + 5, LAY.hub[1] + 5]);
  if (hub) { fitScale(hub, "hub_scale"); fitTo(hub, "op", "hub_op"); shadowFx(hub, "Glow Wide", PINK, 90, 0, 40, false); shadowFx(hub, "Glow Core", "#FF96BE", 90, 0, 12, false); blur(hub); }

  // ---- the six collection points: glass circle + glowing icon, each steered from its CTRL_ null
  var badges = [["Locker", "locker", "Locker", LAY.hero, 0], ["Pickup", "pickup", "PickupPoint", LAY.hero, 1], ["Supermarket", "super", "Supermarket", LAY.hero, 2],
    ["Other_1", "other0", "Pin", LAY.others[0], 3], ["Other_2", "other1", "Pin", LAY.others[1], 4], ["Other_3", "other2", "Pin", LAY.others[2], 5]];
  for (i = 0; i < badges.length; i++) {
    var b = badges[i], key = b[0], ch = b[1], named = i < 3, cn = "CTRL_" + key;
    var start = named ? [fixedOr(ch + "_x"), fixedOr(ch + "_y")] : b[3];
    var bn = nul(c, cn, start[0], start[1]);
    ctl(bn, "slider", "Circle (px)", named ? fixedOr(ch + "_circle") : 128); ctl(bn, "slider", "Circle Reveal (%)", 0); ctl(bn, "slider", "Wipe (%)", 0); ctl(bn, "slider", "Glow (%)", 60);
    ctl(bn, "angle", "Circle Wipe Angle", 0); ctl(bn, "slider", "Circle Edge Softness (%)", 30); ctl(bn, "angle", "Icon Wipe Angle", 0); ctl(bn, "slider", "Icon Edge Softness (%)", 34);
    ctl(bn, "slider", "Breathe (%)", 7); ctl(bn, "slider", "Breathe Speed", 2.2); ctl(bn, "slider", "Breathe Phase", b[4] * 1.7);
    focusControls(bn);
    if (named) {
      ctl(bn, "slider", "Docked (%)", 0); ctl(bn, "slider", "Float (px)", 5); ctl(bn, "slider", "Float Speed", 1.8); ctl(bn, "slider", "Float Phase", b[4] * 1.3);
      sep(bn); fitTo(bn, "x", ch + "_x"); fitTo(bn, "y", ch + "_y");
      fitTo(bn, function (LL) { return function () { return ctlProp(LL, "Docked (%)"); }; }(bn), ch + "_docked");
      expr(bn, "y", ["// DOCK FLOAT: bobs gently while it waits in the dock. Controls: " + cn + " > Docked (%) keys (when), Float (px), Float Speed, Float Phase (0 px = still).",
        "var c = thisComp.layer(" + q(cn) + ");",
        "value + Math.sin(time * " + eff("c", "Float Speed") + " + " + eff("c", "Float Phase") + ") * " + eff("c", "Float (px)") + " * " + eff("c", "Docked (%)") + " / 100;"].join("\n"));
      fitTo(bn, function (LL) { return function () { return ctlProp(LL, "Circle (px)"); }; }(bn), ch + "_circle");
      marker(bn, VO[i][0], VO[i][1]);
    }
    fitTo(bn, function (LL) { return function () { return ctlProp(LL, "Circle Reveal (%)"); }; }(bn), ch + "_circlep");
    fitTo(bn, function (LL) { return function () { return ctlProp(LL, "Wipe (%)"); }; }(bn), ch + "_wipe");
    fitTo(bn, function (LL) { return function () { return ctlProp(LL, "Glow (%)"); }; }(bn), ch + "_glow");
    glassSet(c, key, bn, cn, start, ["var w = " + eff("c", "Circle (px)") + ", h = w, r = w / 2;"], "ell", "Circle Reveal (%)", "Circle Wipe Angle", "Circle Edge Softness (%)");

    var ic = pre[b[2]]; if (!ic) { ERRORS.push("S1: icon " + key + " missing (PRE_Icon_" + b[2] + " failed)"); continue; }
    var IL = c.layers.add(ic); IL.name = "Icon_" + key; LAYER_COUNT++; IL.label = 15;
    setv(A(IL), [300, 300]); setv(P(IL), start); parentTo(IL, bn);
    fitScale(IL, ch + "_scale");
    revealMask(IL, { ctrl: "thisComp.layer(" + q(cn) + ")", label: cn, rev: "Wipe (%)", ang: "Icon Wipe Angle", soft: "Icon Edge Softness (%)", geo: ["var w = 360, h = 360;"], cx: 300, cy: 300, focus: false });
    var mxW = shadowFx(IL, "Glow Wide", PINK, 95, 0, 30, false), mxC = shadowFx(IL, "Glow Core", "#FF96BE", 90, 0, 8, false);
    var G = ["var c = thisComp.layer(" + q(cn) + ");",
      "var g = (" + eff("c", "Glow (%)") + " + " + eff("c", "Breathe (%)") + " * Math.sin(time * " + eff("c", "Breathe Speed") + " + " + eff("c", "Breathe Phase") + ")) / 100;",
      "var s = Math.max(0.01, transform.scale[0] / 100), z = thisComp.layer(\"CTRL_Glass\").effect(\"Glow Size (%)\")(\"Slider\") / 100;   // softness is in the icon's own pixels"];
    var GH = "Controls: " + cn + " > Glow (%) keys (pulses on landing), Breathe (%), Breathe Speed, Breathe Phase; CTRL_Glass > Glow Size (%).";
    if (mxW) {
      expr(IL, function (LL) { return function () { return fxp(LL, "Glow Wide", 2); }; }(IL), ["// GLOW STRENGTH: pink glow brightens on each landing and breathes. " + GH].concat(G).concat(["Math.min(1, 0.95 * g) * " + mxW + ";"]).join("\n"));
      expr(IL, function (LL) { return function () { return fxp(LL, "Glow Wide", 5); }; }(IL), ["// GLOW SIZE: wide pink glow, 9 % of the icon (14 px minimum) times the glow. " + GH].concat(G).concat(["Math.max(14, 32.4 * s) * g / s * z;"]).join("\n"));
    }
    if (mxC) {
      expr(IL, function (LL) { return function () { return fxp(LL, "Glow Core", 2); }; }(IL), ["// CORE GLOW STRENGTH: tight light-pink glow. " + GH].concat(G).concat(["Math.min(1, 0.9 * g) * " + mxC + ";"]).join("\n"));
      expr(IL, function (LL) { return function () { return fxp(LL, "Glow Core", 5); }; }(IL), ["// CORE GLOW SIZE: 2.5 % of the icon (4 px minimum) times the glow. " + GH].concat(G).concat(["Math.max(4, 9 * s) * g / s * z;"]).join("\n"));
    }
    blur(IL);
  }

  // ---- hero headings (Satoshi Bold): gradient wipe in, blur and lift out
  for (i = 0; i < LAY.heads.length; i++) {
    var hd = LAY.heads[i], T = txtC(c, "Heading_" + (i + 1) + "_" + hd.text.replace(/ /g, "_"), hd.text, HEAD_FONT, 112, WHITE, -25, [540, hd.base]);
    T.label = 10;
    if (hd.ramp) rampFx(T, hd.ramp.a, hd.ramp.ca, hd.ramp.b, hd.ramp.cb);
    ctl(T, "slider", "Enter (%)", 0); ctl(T, "slider", "Exit (%)", 0); ctl(T, "slider", "Rise (px)", 22); ctl(T, "slider", "Extra Rise (px)", hd.extra);
    ctl(T, "slider", "Lift Out (px)", 60); ctl(T, "slider", "Start Blur", 10); ctl(T, "slider", "End Blur", 16); ctl(T, "angle", "Wipe Angle", 90); ctl(T, "slider", "Edge Softness (%)", 26);
    fitTo(T, function (LL) { return function () { return ctlProp(LL, "Enter (%)"); }; }(T), "head" + hd.fit + "_in");
    fitTo(T, function (LL) { return function () { return ctlProp(LL, "Exit (%)"); }; }(T), "head" + hd.fit + "_out");
    fx(T, "ADBE Gaussian Blur 2", "Blur"); fxp(T, "Blur", 3).setValue(1);
    sep(T);
    expr(T, "y", "// RISE AND LIFT: rises into place, lifts away on exit. Controls (this layer): Enter (%) / Exit (%) keys, Rise (px), Extra Rise (px), Lift Out (px).\nvalue + (1 - effect(\"Enter (%)\")(\"Slider\") / 100) * (effect(\"Rise (px)\")(\"Slider\") + effect(\"Extra Rise (px)\")(\"Slider\")) - effect(\"Exit (%)\")(\"Slider\") / 100 * effect(\"Lift Out (px)\")(\"Slider\");");
    expr(T, "op", "// FADE OUT: fades as it exits. Controls (this layer): Exit (%) keys.\nvalue * (1 - effect(\"Exit (%)\")(\"Slider\") / 100);");
    expr(T, function (LL) { return function () { return fxp(LL, "Blur", 1); }; }(T), "// FOCUS: sharpens as it enters, blurs as it exits. Controls (this layer): Enter (%) / Exit (%) keys, Start Blur, End Blur.\n(1 - effect(\"Enter (%)\")(\"Slider\") / 100) * effect(\"Start Blur\")(\"Slider\") + effect(\"Exit (%)\")(\"Slider\") / 100 * effect(\"End Blur\")(\"Slider\");");
    revealMask(T, { ctrl: "thisLayer", label: "this layer", rev: "Enter (%)", ang: "Wipe Angle", soft: "Edge Softness (%)", geo: ["var w = 1080, h = " + (1.08 * 112).toFixed(2) + ";"], cx: 0, cy: hd.box, focus: false });
    blur(T);
  }

  var ref = importAsset(root, "assets/reference/HubBox_CollectionPoints_9x16.mp4", refFold);
  if (ref) { var rl = c.layers.add(ref); rl.name = "GUIDE_Reference_Remotion"; rl.guideLayer = true; rl.enabled = false; rl.label = 2; LAYER_COUNT++; }

  guide(c, ["S1_CollectionPoints  (1080 x 1920, 60 fps, 5.5 s)",
    "CTRL_Card: Reveal (%) / Morph (%) keys = the card's wipe-in and its opening into the map.",
    "CTRL_Locker / CTRL_Pickup / CTRL_Supermarket: X/Y Position keys = the flights (card > dock > map).",
    "   Circle (px), Circle Reveal (%), Wipe (%), Glow (%), Docked (%) keys; Float / Breathe = the idle motion.",
    "CTRL_Other_1..3: the three extra pins. CTRL_Glass: Frost Blur (glass blur), Glow Size (%).",
    "Glass = MATTE_x (hidden) + FX_Frost_x (adjustment layer, alpha matte) + x_Shadow + x_Glass + x_Sheen.",
    "Headings: each text layer has Enter (%) / Exit (%) keys. Links: Trim End keys. Hub: Scale / Opacity keys.",
    "GUIDE_Reference_Remotion = the original render: switch its eye on to compare.",
    "Want plain keys instead of an expression? Select the property > Animation > Keyframe Assistant > Convert Expression to Keyframes."]);
  finishComp(c); return c;
}

(function () {
  app.beginUndoGroup("HubBox collection points rebuild");
  if (!HAS_NEW_MATTES) { alert("This rebuild needs After Effects 2023 or newer: several layers share one track matte (the glass). It will still build, but the glass and the map clipping will be wrong."); WARN.push("After Effects older than 2023: shared track mattes not supported"); }
  var root = findProjectFolder("assets/ground.png");
  if (fontInstalled("Satoshi-Bold") === true) HEAD_FONT = "Satoshi-Bold";
  checkFonts([HEAD_FONT], root);
  var top = folder("HubBox_CollectionPoints_AE"), fMain = folder("00_MAIN", top), fScenes = folder("01_SCENES", top), fPre = folder("03_PRECOMPS", top), fRef = folder("05_REFERENCE", top);
  var pre = {}, keys = ["Locker", "PickupPoint", "Supermarket", "Pin"], i;
  for (i = 0; i < keys.length; i++) pre[keys[i]] = safe("PRE_Icon_" + keys[i], function (k) { return function () { return buildIcon(fPre, k); }; }(keys[i]));
  pre.map = safe("PRE_MapStreets", function () { return buildMap(fPre); });
  var scene = safe("S1_CollectionPoints", function () { return buildScene(fScenes, root, fRef, pre); });
  safe("MAIN_HubBox_CollectionPoints", function () {
    var m = makeComp("MAIN_HubBox_CollectionPoints", DUR, fMain, "The line \"A locker, pickup point, supermarket or other collection location\". In the full film it starts at VO 0:06.00.");
    if (scene) { var s = m.layers.add(scene); s.name = "S1_CollectionPoints"; }
    var dm = nul(m, "DIALOGUE_MARKERS", 540, 960, 2); dm.enabled = false;
    for (var v = 0; v < VO.length; v++) marker(dm, VO[v][0], VO[v][1]);
    guide(m, ["MAIN_HubBox_CollectionPoints", "Open S1_CollectionPoints for the animation. DIALOGUE_MARKERS = the VO word onsets (from 0:06.00).",
      "Drop the voice-over in here and slide it so 0:06.00 sits at frame 0.",
      "Red = controls (CTRL_), purple = driven by expressions, aqua = mattes, yellow = guides, sandstone = artwork."]);
    finishComp(m); try { m.openInViewer(); } catch (e) { } return m;
  });
  app.endUndoGroup();
  report("HubBox Collection Points", 7);
})();
