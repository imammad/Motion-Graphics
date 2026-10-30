// ---------------------------------------------------------------- EventsScene build (hand-written part, ES3)
var BLUE = "#3D8AFC", BLUE_DARK = "#1F5FD6", BLUE_TINT = "#EAF2FF", INK = "#0E1B33", MUTED = "#8A97AD", WHITE = "#FFFFFF", CELL = "#F6F9FE";
var DUR = 4.5;   // 135 frames, as in src/FieldMarketing/FieldMarketingVideo.tsx

// Text placed on its baseline, left-aligned, exactly where Chrome put it (measured, not estimated).
function txtAt(c, name, str, font, size, col, tracking, pos) {
  var L = c.layers.addText(str); L.name = name;
  var sp = prop(prop(L, "ADBE Text Properties"), "ADBE Text Document"), d = sp.value;
  if (d.resetCharStyle) d.resetCharStyle(); if (d.resetParagraphStyle) d.resetParagraphStyle();
  setFont(d, font); d.fontSize = size; d.applyFill = true; d.fillColor = rgb(col); d.applyStroke = false; d.tracking = tracking || 0;
  d.justification = ParagraphJustification.LEFT_JUSTIFY; sp.setValue(d);
  setv(A(L), [0, 0]); setv(P(L), pos); L.label = 15; LAYER_COUNT++; return L;
}
function rrLayer(c, name, cx, cy, w, h, r, col) { var L = shp(c, name, cx, cy), g = grp(L, "Shape"); rect(g, w, h, 0, 0, r); fill(g, col); return L; }
function fx(L, matchName, name) { var e = prop(L, "ADBE Effect Parade").addProperty(matchName); e.name = name; return e; }
function fxp(L, name, i) { return prop(prop(prop(L, "ADBE Effect Parade"), name), i); }
// Drop Shadow: opacity range differs between AE versions, so scale by the property's own maximum.
function shadow(L, name, col, pct, dist, soft) {
  try { fx(L, "ADBE Drop Shadow", name); } catch (e) { ERRORS.push(L.containingComp.name + " > " + L.name + ": shadow '" + name + "' not added (" + e.toString() + "), add Effect > Perspective > Drop Shadow by hand"); return; }
  fxp(L, name, 1).setValue(rgba(col));
  var op = fxp(L, name, 2), mx = 100; try { if (op.hasMax) mx = op.maxValue; } catch (e) { }
  op.setValue(pct / 100 * mx); fxp(L, name, 3).setValue(180); fxp(L, name, 4).setValue(dist); fxp(L, name, 5).setValue(soft);
}
// Straight-line keys (the source is linear here). Bezier with the segment slopes = exactly linear, and still easy to re-ease.
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
function marker(L, t, text) { prop(L, "ADBE Marker").setValueAtTime(lt(t), new MarkerValue(text)); }
function guide(c, lines) {
  var T = txtAt(c, "GUIDE_READ_ME", lines.join("\r"), "Inter-SemiBold", 16, "#C0392B", 0, [30, 40]);
  T.guideLayer = true; T.enabled = false; T.label = 2; lockLater(T); return T;   // eye off: it would cover the scene in the viewer
}
function noBlur(c) { try { c.motionBlur = false; } catch (e) { } }   // the Remotion render has no motion blur

// ---------------------------------------------------------------- PRE_Calendar_Grid: the static month (never animates)
function buildGrid(fold) {
  var c = makeComp("PRE_Calendar_Grid", DUR, fold, "Static part of the calendar: weekday letters, the 28 plain day cells and their numbers. Days 8, 16 and 23 (the event days) live in PRE_Window because they animate. Same size and coordinates as PRE_Window.", 860, 720);
  noBlur(c);
  var cl = shp(c, "Cells_Plain", 0, 0), i;
  for (i = 0; i < LAY.cells.length; i++) {
    var ce = LAY.cells[i]; if (ce.day == 8 || ce.day == 16 || ce.day == 23) continue;
    var g = grp(cl, "Day " + ce.day); rect(g, ce.w, 84, ce.x, ce.y, 14); fill(g, CELL);   // finished before the next grp()
  }
  lockLater(cl);
  for (i = 0; i < LAY.days.length; i++) { var d = LAY.days[i]; if (d.day == 8 || d.day == 16 || d.day == 23) continue; lockLater(txtAt(c, "Day_" + (d.day < 10 ? "0" : "") + d.day, String(d.day), "Inter-SemiBold", 20, INK, 0, d.pos)); }
  for (i = 0; i < LAY.weekdays.length; i++) lockLater(txtAt(c, "Weekday_" + (i + 1) + "_" + LAY.weekdays[i].t, LAY.weekdays[i].t, "Inter-Bold", 20, MUTED, 0, LAY.weekdays[i].pos));
  finishComp(c); return c;
}

// ---------------------------------------------------------------- PRE_Window: the app window and everything inside it
function buildWindow(fold, grid, root, assetsFold) {
  var c = makeComp("PRE_Window", DUR, fold, "The 'Events · October' app window, 860x720. Its entrance (slide, tilt, fade) and shadow are on the PRE_Window layer in S4. Inside: chips pop in (CTRL_Chips), the cursor travels to the button and clicks (CTRL_Click).", 860, 720);
  noBlur(c); var i;
  var card = shp(c, "Card", 430, 360), g = grp(card, "Card"); rect(g, 859, 719, 0, 0, 27.5); stroke(g, BLUE_TINT, 1); fill(g, WHITE);
  lockLater(card);
  var dv = shp(c, "Header_Divider", 430, 64.5), gd = grp(dv, "Line"); rect(gd, 858, 1, 0, 0, 0); fill(gd, BLUE_TINT); lockLater(dv);
  var dots = shp(c, "Header_Dots", 0, 0);
  for (i = 0; i < 3; i++) { var gg = grp(dots, "Dot " + (i + 1)); ell(gg, 14, 14, LAY.dots[i][0], LAY.dots[i][1]); fill(gg, i == 0 ? BLUE : BLUE_TINT); }
  lockLater(dots);
  txtAt(c, "Title", "Events · October", "Inter-SemiBold", 24, MUTED, 0, LAY.title);
  var gl = c.layers.add(grid); gl.name = "PRE_Calendar_Grid"; lockLater(gl);

  // chips + the three event days
  var ctrlC = nul(c, "CTRL_Chips", 60, 30);
  ctl(ctrlC, "slider", "Delay (frames)", 8); ctl(ctrlC, "slider", "Tint At (%)", 10); ctl(ctrlC, "color", "Tint Color", rgba(BLUE_TINT));
  var chipL = [];
  for (i = 0; i < LAY.chips.length; i++) {
    var ch = LAY.chips[i], ce = LAY.cells[ch.day - 1], dd = LAY.days[ch.day - 1];
    var cell = rrLayer(c, "Cell_" + ch.day, ce.x, ce.y, ce.w, 84, 14, CELL); cell.label = 10;
    txtAt(c, "Day_" + ch.day, String(ch.day), "Inter-SemiBold", 20, INK, 0, dd.pos);
    var chip = shp(c, "Chip_" + (i + 1) + "_" + ch.name, ch.x, ch.y), gc = grp(chip, "Chip"); rect(gc, ch.w, ch.h, ch.w / 2, 0, 6); fill(gc, BLUE);   // anchor = left centre, as in CSS
    var lbl = txtAt(c, "Chip_" + (i + 1) + "_Label", ch.name, "Inter-Bold", 15, WHITE, 0, [ch.x + ch.text[0], ch.y + ch.text[1]]);
    parentTo(lbl, chip); setv(P(lbl), ch.text);   // parent = shape layer: position is in the chip's own space
    ctl(cell, "layer", "Chip", chip);
    expr(cell, function (Lc) { return function () { return prop(vg(prop(prop(Lc, "ADBE Root Vectors Group"), "Shape")), "ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color"); }; }(cell),
      ["// TINT: the cell turns light blue once its chip is bigger than Tint At. Controls: CTRL_Chips > Tint At (%), Tint Color. This layer: Chip.",
       "var c = thisComp.layer(\"CTRL_Chips\");",
       "var s = effect(\"Chip\")(\"Layer\").transform.scale[0];",
       "s > c.effect(\"Tint At (%)\")(\"Slider\") ? c.effect(\"Tint Color\")(\"Color\") : value;"].join("\n"));
    chipL.push(chip);
  }
  ctl(ctrlC, "layer", "Leader", chipL[0]);
  applyFit(chipL[0], "scale", FITS.chip, [0, 0], [100, 100]); marker(chipL[0], FITS.chip[0][0], "chips pop");
  for (i = 1; i < chipL.length; i++) { ctl(chipL[i], "slider", "Order", i); expr(chipL[i], "scale", staggerExpr("CTRL_Chips", "transform.scale")); chipL[i].label = 10; }

  txtAt(c, "Footer", "3 events this month", "Inter-SemiBold", 22, MUTED, 0, LAY.footer);

  // the click: one control holds its timing
  var ck = nul(c, "CTRL_Click", 60, 70);
  ctl(ck, "slider", "Press (%)", 0); ctl(ck, "slider", "Press Depth (%)", 8); ctl(ck, "check", "Booked", 0);
  linKeys(ck, function () { return ctlProp(ck, "Press (%)"); }, [[80 / 30, 0], [84 / 30, 100], [90 / 30, 0]]);
  holdKey(ck, function () { return ctlProp(ck, "Booked"); }, 0, 0); holdKey(ck, function () { return ctlProp(ck, "Booked"); }, 84 / 30, 1);
  marker(ck, 84 / 30, "CLICK");
  var PRESS = ["// PRESS: shrinks a little while the button is clicked. Controls: CTRL_Click > Press (%) keys (the timing), Press Depth (%).",
    "var c = thisComp.layer(\"CTRL_Click\");",
    "value * (1 - c.effect(\"Press Depth (%)\")(\"Slider\") / 100 * c.effect(\"Press (%)\")(\"Slider\") / 100);"].join("\n");
  function swap(on) {
    return ["// " + (on ? "BOOKED" : "DEFAULT") + " STATE: shows " + (on ? "after" : "before") + " the click. Controls: CTRL_Click > Booked (checkbox key = the moment it switches).",
      "var b = thisComp.layer(\"CTRL_Click\").effect(\"Booked\")(\"Checkbox\");",
      on ? "b == 1 ? value : 0;" : "b == 1 ? 0 : value;"].join("\n");
  }
  var B = LAY.button, gb = nul(c, "GRP_Button", B.cx, B.cy, 10);
  expr(gb, "scale", PRESS);
  var bd = rrLayer(c, "Button_Default", B.cx, B.cy, 300, 76, 18, INK);
  var bi = importAsset(root, "assets/button_booked.png", assetsFold), bk = null;
  if (bi) { bk = c.layers.add(bi); bk.name = "Button_Booked"; setv(P(bk), [B.cx, B.cy]); LAYER_COUNT++; shadow(bk, "Glow Shadow", BLUE, 45, 18, 40); }
  var td = txtAt(c, "Button_Text_Default", "Book events", "Inter-Bold", 28, WHITE, 0, B.book);
  var tb = txtAt(c, "Button_Text_Booked", "Booked ✓", "Inter-Bold", 28, WHITE, 0, B.booked);
  var parts = [bd, td, tb]; if (bk) parts.push(bk);
  for (i = 0; i < parts.length; i++) { parentTo(parts[i], gb); parts[i].label = 10; }
  expr(bd, "op", swap(false)); expr(td, "op", swap(false)); expr(tb, "op", swap(true)); if (bk) expr(bk, "op", swap(true));

  // cursor: SVG path from src/FieldMarketing/Cursor.tsx, 24 -> 44 px
  var k = 44 / 24, v = [[4, 2.5], [4, 19.5], [8.6, 15.4], [11.6, 22], [14.6, 20.7], [11.7, 14.2], [18, 14.2]], vv = [];
  for (i = 0; i < v.length; i++) vv.push([v[i][0] * k - 22, v[i][1] * k - 24]);   // pivot = centre of the 44x48 wrapper
  var cur = shp(c, "Cursor", LAY.cursor.from[0], LAY.cursor.from[1]), gk = grp(cur, "Arrow");
  pth(gk, vv, true); stroke(gk, WHITE, 1.4 * k, true); fill(gk, INK);
  shadow(cur, "Shadow", INK, 25, 6, 10);
  sep(cur); applyFit(cur, "x", FITS.cursor, LAY.cursor.from[0], LAY.cursor.to[0]); applyFit(cur, "y", FITS.cursor, LAY.cursor.from[1], LAY.cursor.to[1]);
  expr(cur, "scale", PRESS);

  guide(c, ["PRE_Window  (open S4 to see it move in)",
    "CTRL_Chips: chip pop = keys on Chip_1_Summit > Scale (graph editor = the bounce). Chips 2-3 copy it Delay (frames) later.",
    "   Cells 8/16/23 turn Tint Color when their chip passes Tint At (%).",
    "CTRL_Click: Press (%) keys = when/how the button and cursor squash; Press Depth (%) = how much.",
    "   Booked checkbox key = the frame the button switches to 'Booked'.",
    "Cursor: X/Y keys = its path to the button. Static grid lives in PRE_Calendar_Grid (locked).",
    "Want plain keys instead of an expression? Select the property > Animation > Keyframe Assistant > Convert Expression to Keyframes."]);
  finishComp(c); return c;
}

// ---------------------------------------------------------------- S4: the scene
function buildScene(fold, win, root, assetsFold) {
  var c = makeComp("S4_BookedTheEvents", DUR, fold, "Scene 4 of FieldMarketing: 'One person will tell you they booked the events.' 135 frames. In the full video it starts at frame 430 (14.33 s), after a 15-frame slide transition.");
  noBlur(c); var i;
  var bg = rrLayer(c, "BG_White", 960, 540, 1920, 1080, 0, WHITE); lockLater(bg);
  var im = importAsset(root, "assets/dot_grid.png", assetsFold);
  if (im) { var dg = c.layers.add(im); dg.name = "BG_DotGrid"; setv(P(dg), [960, 540]); setv(O(dg), 90); lockLater(dg); LAYER_COUNT++; }
  var glows = [["BG_Glow_TopLeft", "assets/glow_top_left.png", [170, 30], [140, 80]], ["BG_Glow_BottomRight", "assets/glow_bottom_right.png", [1780, 1100], [-160, -60]]];
  for (i = 0; i < glows.length; i++) {
    var gi = importAsset(root, glows[i][1], assetsFold); if (!gi) continue;
    var G = c.layers.add(gi); G.name = glows[i][0]; LAYER_COUNT++; setv(P(G), glows[i][2]); sep(G);
    var f = DUR * 30 / 600;   // the source drifts this far over 600 frames; the scene shows 135 of them
    linKeys(G, "x", [[0, glows[i][2][0]], [DUR, glows[i][2][0] + glows[i][3][0] * f]]);
    linKeys(G, "y", [[0, glows[i][2][1]], [DUR, glows[i][2][1] + glows[i][3][1] * f]]);
  }
  var Lb = LAY.label, pill = rrLayer(c, "Label_Pill", Lb.cx, Lb.cy, Lb.w, Lb.h, Lb.h / 2, BLUE_TINT);
  applyFit(pill, "op", FITS.label, 0, 100);
  var lt1 = txtAt(c, "Label_Text", "ONE PERSON SAYS", "Inter-Bold", 28, BLUE, 60, Lb.text);
  expr(lt1, "op", "// FADE: copies Label_Pill's opacity, so retime the pill's keys only. Controls: Label_Pill > Opacity keys.\nthisComp.layer(\"Label_Pill\").transform.opacity;"); lt1.label = 10;

  // headline: four words rise in one after another, the eases live on CTRL_Headline
  var hc = nul(c, "CTRL_Headline", 140, 60);
  ctl(hc, "slider", "Rise (%)", 0); ctl(hc, "slider", "Fade In (%)", 0); ctl(hc, "slider", "Unblur (%)", 0);
  ctl(hc, "slider", "Rise Distance (px)", 41.4); ctl(hc, "slider", "Start Blur", 10); ctl(hc, "slider", "Word Delay (frames)", 3);
  applyFit(hc, function () { return ctlProp(hc, "Rise (%)"); }, FITS.rise, 0, 100);
  applyFit(hc, function () { return ctlProp(hc, "Fade In (%)"); }, FITS.fade, 0, 100);
  applyFit(hc, function () { return ctlProp(hc, "Unblur (%)"); }, FITS.unblur, 0, 100);
  var D = "var d = c.effect(\"Word Delay (frames)\")(\"Slider\") * thisComp.frameDuration * effect(\"Order\")(\"Slider\");";
  for (i = 0; i < LAY.words.length; i++) {
    var w = LAY.words[i], T = txtAt(c, "Word_" + (i + 1), w.text, "Inter-ExtraBold", 92, INK, -35, w.pos);
    T.label = 10; ctl(T, "slider", "Order", i);
    if (w.accent) { fx(T, "ADBE Ramp", "Gradient"); fxp(T, "Gradient", 1).setValue([0, 0]); fxp(T, "Gradient", 2).setValue(rgba(BLUE)); fxp(T, "Gradient", 3).setValue([w.w, 0]); fxp(T, "Gradient", 4).setValue(rgba(BLUE_DARK)); fxp(T, "Gradient", 5).setValue(1); }
    fx(T, "ADBE Gaussian Blur 2", "Blur");
    sep(T);
    expr(T, "y", ["// RISE: the word slides up into place after the one before. Controls: CTRL_Headline > Rise (%) keys (the ease), Rise Distance (px), Word Delay (frames). This layer: Order.",
      "var c = thisComp.layer(\"CTRL_Headline\");", D,
      "value + c.effect(\"Rise Distance (px)\")(\"Slider\") * (1 - c.effect(\"Rise (%)\")(\"Slider\").valueAtTime(time - d) / 100);"].join("\n"));
    expr(T, "op", ["// FADE: the word fades in after the one before. Controls: CTRL_Headline > Fade In (%) keys, Word Delay (frames). This layer: Order.",
      "var c = thisComp.layer(\"CTRL_Headline\");", D,
      "value * c.effect(\"Fade In (%)\")(\"Slider\").valueAtTime(time - d) / 100;"].join("\n"));
    expr(T, function (Lt) { return function () { return fxp(Lt, "Blur", 1); }; }(T),
      ["// BLUR: the word starts blurred and sharpens. Controls: CTRL_Headline > Unblur (%) keys, Start Blur, Word Delay (frames). This layer: Order.",
       "var c = thisComp.layer(\"CTRL_Headline\");", D,
       "c.effect(\"Start Blur\")(\"Slider\") * (1 - c.effect(\"Unblur (%)\")(\"Slider\").valueAtTime(time - d) / 100);"].join("\n"));
  }

  // the window
  if (!win) { ERRORS.push("S4_BookedTheEvents: built without the window (PRE_Window failed, see above)"); } else {
  var wl = c.layers.add(win); wl.name = "PRE_Window"; LAYER_COUNT++;
  setv(A(wl), [430, 360]); setv(P(wl), [1350, 540]);
  shadow(wl, "Shadow Soft", BLUE, 18, 30, 80); shadow(wl, "Shadow Contact", INK, 6, 6, 18);
  sep(wl); applyFit(wl, "x", FITS.win, 1470, 1350); applyFit(wl, "rot", FITS.win, 4, 0); applyFit(wl, "op", FITS.win_op, 0, 100);
  marker(wl, FITS.win[0][0], "window in"); }

  var ref = importAsset(root, "assets/reference/EventsScene_reference.mp4", assetsFold);
  if (ref) { var rl = c.layers.add(ref); rl.name = "GUIDE_Reference_Remotion"; rl.guideLayer = true; rl.enabled = false; rl.label = 2; LAYER_COUNT++; }

  guide(c, ["S4_BookedTheEvents  (1920x1080, 30 fps, 135 frames)",
    "CTRL_Headline: Rise / Fade In / Unblur (%) keys = the eases of every word (graph editor). Word Delay (frames) = gap between words.",
    "   Rise Distance (px) = how far they travel, Start Blur = how blurry they start. Each Word_ layer: Order.",
    "Label_Pill: opacity keys fade the pill AND its text. PRE_Window layer: X / Rotation / Opacity keys = the window's spring in.",
    "GUIDE_Reference_Remotion: the original render. Switch its eye on to compare frame by frame.",
    "Want plain keys instead of an expression? Select the property > Animation > Keyframe Assistant > Convert Expression to Keyframes."]);
  finishComp(c); return c;
}

(function () {
  app.beginUndoGroup("FieldMarketing EventsScene rebuild");
  var root = findProjectFolder("assets/dot_grid.png");
  checkFonts(["Inter-ExtraBold", "Inter-Bold", "Inter-SemiBold"], root);
  var top = folder("FieldMarketing_AE"), fMain = folder("00_MAIN", top), fScenes = folder("01_SCENES", top), fPre = folder("03_PRECOMPS", top), fRef = folder("05_REFERENCE", top);
  var grid = safe("PRE_Calendar_Grid", function () { return buildGrid(fPre); });
  var win = grid ? safe("PRE_Window", function () { return buildWindow(fPre, grid, root, fRef); }) : null;
  var scene = safe("S4_BookedTheEvents", function () { return buildScene(fScenes, win, root, fRef); });
  safe("MAIN_FieldMarketing", function () {
    var m = makeComp("MAIN_FieldMarketing", DUR, fMain, "Pilot: only scene 4 (EventsScene) so far. The full video is 835 frames; scene 4 sits at frame 430 there.");
    noBlur(m);
    if (scene) { var s = m.layers.add(scene); s.name = "S4_BookedTheEvents"; }
    var dm = nul(m, "DIALOGUE_MARKERS", 960, 540, 2); dm.enabled = false;
    marker(dm, 0, "One person will tell you they booked the events.");
    guide(m, ["MAIN_FieldMarketing (pilot: scene 4 only)", "Open S4_BookedTheEvents for the scene, PRE_Window for the app window.", "Red layers = controls (CTRL_), purple = driven by expressions, yellow = guides."]);
    finishComp(m); try { m.openInViewer(); } catch (e) { } return m;
  });
  app.endUndoGroup();
  report("FieldMarketing EventsScene", 4);
})();
