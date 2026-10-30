// premiere.jsx - runs INSIDE Premiere Pro (ExtendScript, ES3). Loaded by the Claude MCP panel.
// The panel calls PMCP.dispatch("tool_name", {args}) and gets back a JSON string:
//   {"ok": true, "result": ...}  or  {"ok": false, "error": "..."}
// ES3 rules: no let/const/arrow functions/forEach/map/JSON/Array.indexOf/trailing commas.

var PMCP = (function () {
  var TICKS = 254016000000;   // Premiere ticks per second

  // ------------------------------------------------------------------ JSON (ExtendScript has none)
  function esc(s) {
    return '"' + String(s).replace(/[\\"\u0000-\u001f  ]/g, function (c) {
      var m = { '"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f" }[c];
      return m || "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    }) + '"';
  }
  function stringify(v) {
    var t = typeof v, i, out;
    if (v === null || v === undefined || t === "function") return "null";
    if (t === "number") return isFinite(v) ? String(v) : "null";
    if (t === "boolean") return String(v);
    if (t === "string") return esc(v);
    if (v instanceof Array) { out = []; for (i = 0; i < v.length; i++) out.push(stringify(v[i])); return "[" + out.join(",") + "]"; }
    out = [];
    for (i in v) if (v.hasOwnProperty(i) && typeof v[i] !== "function") out.push(esc(i) + ":" + stringify(v[i]));
    return "{" + out.join(",") + "}";
  }

  // ------------------------------------------------------------------ helpers
  function fail(msg) { throw new Error(msg); }
  function secs(t) { return t ? Math.round(t.seconds * 100000) / 100000 : null; }
  function timeOf(seconds) { var t = new Time(); t.seconds = seconds; return t; }
  function ticksOf(seconds) { return String(Math.round(seconds * TICKS)); }
  function project() { if (!app.project) fail("No project is open in Premiere Pro."); return app.project; }
  function seqById(id) {
    var p = project(), i;
    if (id === undefined || id === null || id === "") { if (!p.activeSequence) fail("No active sequence. Open one, or pass sequence_id."); return p.activeSequence; }
    for (i = 0; i < p.sequences.numSequences; i++) { var s = p.sequences[i]; if (s.sequenceID == id || s.name == id) return s; }
    return fail("No sequence with id or name '" + id + "'.");
  }
  function itemType(it) { var t = it.type; return t == 2 ? "bin" : t == 3 ? "root" : t == 4 ? "file" : "clip"; }
  function walk(item, path, depth, out, maxDepth) {
    var i;
    for (i = 0; i < item.children.numItems; i++) {
      var c = item.children[i], p = path + "/" + c.name, rec = { name: c.name, type: itemType(c), node_id: c.nodeId, path: p };
      if (rec.type !== "bin") { try { rec.media_path = c.getMediaPath(); } catch (e) { } }
      out.push(rec);
      if (rec.type === "bin" && depth < maxDepth) walk(c, p, depth + 1, out, maxDepth);
    }
    return out;
  }
  function findItem(ref) {   // node_id, bin path "Bin/Sub/Name", or plain name
    var all = walk(project().rootItem, "", 0, [], 50), i;
    for (i = 0; i < all.length; i++) if (all[i].node_id == ref || all[i].path == ref || all[i].path == "/" + ref) return byNode(all[i].node_id);
    for (i = 0; i < all.length; i++) if (all[i].name == ref) return byNode(all[i].node_id);
    return fail("No project item matching '" + ref + "'. Use list_project_items to see what's there.");
  }
  function byNode(id) {
    function rec(item) { var i; for (i = 0; i < item.children.numItems; i++) { var c = item.children[i]; if (c.nodeId == id) return c; if (c.type == 2) { var r = rec(c); if (r) return r; } } return null; }
    return rec(project().rootItem);
  }
  function binFor(path) {   // finds or creates "A/B/C" under the root
    if (!path) return project().rootItem;
    var parts = String(path).split("/"), cur = project().rootItem, i, j;
    for (i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var next = null;
      for (j = 0; j < cur.children.numItems; j++) if (cur.children[j].type == 2 && cur.children[j].name == parts[i]) next = cur.children[j];
      cur = next || cur.createBin(parts[i]);
    }
    return cur;
  }
  function tracks(seq, kind) { return kind === "audio" ? seq.audioTracks : seq.videoTracks; }
  function clipAt(seq, kind, track, index) {
    var tr = tracks(seq, kind)[track]; if (!tr) fail("No " + kind + " track " + track + " (tracks start at 0).");
    var c = tr.clips[index]; if (!c) fail("No clip " + index + " on " + kind + " track " + track + " (clips start at 0).");
    return c;
  }
  function clipInfo(c, i) {
    var r = { index: i, name: c.name, start: secs(c.start), end: secs(c.end), in_point: secs(c.inPoint), out_point: secs(c.outPoint), duration: secs(c.duration) };
    try { r.node_id = c.nodeId; } catch (e) { }
    try { r.media_path = c.projectItem ? c.projectItem.getMediaPath() : null; } catch (e) { }
    try { r.disabled = c.disabled; } catch (e) { }
    try { r.selected = c.isSelected(); } catch (e) { }
    try { r.is_mogrt = !!c.isMGT(); } catch (e) { }
    return r;
  }
  function frameSize(seq) { var s = seq.getSettings(); return [s.videoFrameWidth, s.videoFrameHeight]; }
  function component(c, name) {
    var i; for (i = 0; i < c.components.numItems; i++) { var k = c.components[i]; if (k.displayName == name || k.matchName == name) return k; }
    return fail("Clip has no effect '" + name + "'. Use get_clip_properties to list them.");
  }
  function param(comp, name) {
    var i; for (i = 0; i < comp.properties.numItems; i++) { var p = comp.properties[i]; if (p.displayName == name) return p; }
    return fail("Effect '" + comp.displayName + "' has no property '" + name + "'.");
  }
  // Motion > Position is stored as 0..1 of the frame; tools speak pixels.
  function toNative(seq, comp, prop, v) {
    if (comp.displayName == "Motion" && (prop.displayName == "Position" || prop.displayName == "Anchor Point") && v instanceof Array) { var f = frameSize(seq); return [v[0] / f[0], v[1] / f[1]]; }
    return v;
  }
  function fromNative(seq, comp, prop, v) {
    if (comp.displayName == "Motion" && (prop.displayName == "Position" || prop.displayName == "Anchor Point") && v instanceof Array) { var f = frameSize(seq); return [v[0] * f[0], v[1] * f[1]]; }
    return v;
  }
  // keyframe times on a clip are in the clip's media time: in_point + (sequence time - clip start)
  function keyTime(c, seqSeconds) { return timeOf(c.inPoint.seconds + (seqSeconds - c.start.seconds)); }

  // ------------------------------------------------------------------ tools
  var T = {};
  T.get_project_info = function () {
    var p = project(), seqs = [], i, s = p.activeSequence;
    for (i = 0; i < p.sequences.numSequences; i++) seqs.push({ id: p.sequences[i].sequenceID, name: p.sequences[i].name });
    var r = { premiere_version: app.version, project_name: p.name, project_path: p.path, sequences: seqs, active_sequence: null };
    if (s) { var f = frameSize(s); r.active_sequence = { id: s.sequenceID, name: s.name, width: f[0], height: f[1], fps: Math.round(TICKS / Number(s.timebase) * 1000) / 1000, duration: Number(s.end) / TICKS, playhead: secs(s.getPlayerPosition()) }; }
    return r;
  };
  T.list_project_items = function (a) { var root = a.bin ? binFor(a.bin) : project().rootItem; return walk(root, a.bin ? "/" + a.bin : "", 0, [], a.max_depth == null ? 10 : a.max_depth); };
  T.import_files = function (a) {
    var bin = binFor(a.bin), before = bin.children.numItems, out = [], i;
    if (!project().importFiles(a.paths, true, bin, !!a.as_image_sequence)) fail("Premiere refused the import. Check the paths exist and are media Premiere can read.");
    for (i = before; i < bin.children.numItems; i++) out.push({ name: bin.children[i].name, node_id: bin.children[i].nodeId });
    return { imported: out };
  };
  T.create_bin = function (a) { var b = binFor(a.path); return { name: b.name, node_id: b.nodeId }; };
  T.open_sequence = function (a) { var s = seqById(a.sequence_id); project().openSequence(s.sequenceID); return { id: s.sequenceID, name: s.name }; };
  T.create_sequence_from_clips = function (a) {
    var clips = [], i; for (i = 0; i < a.items.length; i++) clips.push(findItem(a.items[i]));
    var s = project().createNewSequenceFromClips(a.name, clips, binFor(a.bin));
    if (!s) fail("Premiere could not create the sequence.");
    return { id: s.sequenceID, name: s.name };
  };
  T.get_timeline = function (a) {
    var s = seqById(a.sequence_id), out = { sequence: s.name, id: s.sequenceID, video_tracks: [], audio_tracks: [] }, k, i, j;
    var kinds = [["video", "video_tracks"], ["audio", "audio_tracks"]];
    for (k = 0; k < 2; k++) {
      var trs = tracks(s, kinds[k][0]);
      for (i = 0; i < trs.numTracks; i++) {
        var tr = trs[i], rec = { index: i, name: tr.name, clips: [] };
        try { rec.muted = tr.isMuted(); } catch (e) { }
        for (j = 0; j < tr.clips.numItems; j++) rec.clips.push(clipInfo(tr.clips[j], j));
        out[kinds[k][1]].push(rec);
      }
    }
    var m = s.markers.getFirstMarker(), ms = [];
    while (m) { ms.push({ name: m.name, comments: m.comments, start: secs(m.start), end: secs(m.end) }); m = s.markers.getNextMarker(m); }
    out.markers = ms; return out;
  };
  T.add_clip_to_timeline = function (a) {
    var s = seqById(a.sequence_id), item = findItem(a.item), kind = a.track_type || "video", tr = tracks(s, kind)[a.track || 0];
    if (!tr) fail("No " + kind + " track " + (a.track || 0) + ". Add tracks in Premiere first.");
    var at = a.time == null ? s.getPlayerPosition().seconds : a.time;
    if (a.mode === "insert") tr.insertClip(item, at); else tr.overwriteClip(item, at);
    return { placed: item.name, track_type: kind, track: a.track || 0, time: at, mode: a.mode || "overwrite" };
  };
  T.remove_clip = function (a) { var s = seqById(a.sequence_id), c = clipAt(s, a.track_type || "video", a.track, a.clip_index), n = c.name; c.remove(!!a.ripple, true); return { removed: n }; };
  T.move_clip = function (a) {
    var s = seqById(a.sequence_id), c = clipAt(s, a.track_type || "video", a.track, a.clip_index);
    var by = a.new_start != null ? a.new_start - c.start.seconds : a.offset;
    if (by == null) fail("Give new_start or offset (seconds).");
    c.move(timeOf(by)); return clipInfo(c, a.clip_index);
  };
  T.set_clip_enabled = function (a) { var s = seqById(a.sequence_id), c = clipAt(s, a.track_type || "video", a.track, a.clip_index); c.disabled = !a.enabled; return clipInfo(c, a.clip_index); };
  T.get_clip_properties = function (a) {
    var s = seqById(a.sequence_id), c = clipAt(s, a.track_type || "video", a.track, a.clip_index), out = [], i, j;
    for (i = 0; i < c.components.numItems; i++) {
      var k = c.components[i], props = [];
      for (j = 0; j < k.properties.numItems; j++) {
        var p = k.properties[j], r = { name: p.displayName };
        try { r.value = fromNative(s, k, p, p.getValue()); } catch (e) { }
        try { r.animated = p.isTimeVarying(); } catch (e) { }
        props.push(r);
      }
      out.push({ effect: k.displayName, match_name: k.matchName, properties: props });
    }
    return { clip: clipInfo(c, a.clip_index), effects: out, note: "Motion Position / Anchor Point are in pixels." };
  };
  T.set_clip_property = function (a) {
    var s = seqById(a.sequence_id), c = clipAt(s, a.track_type || "video", a.track, a.clip_index), k = component(c, a.effect), p = param(k, a.property);
    if (p.isTimeVarying()) fail("'" + a.property + "' is animated. Use add_keyframes, or remove its keyframes in Premiere first.");
    p.setValue(toNative(s, k, p, a.value), true); return { effect: k.displayName, property: p.displayName, value: a.value };
  };
  T.add_keyframes = function (a) {
    var s = seqById(a.sequence_id), c = clipAt(s, a.track_type || "video", a.track, a.clip_index), k = component(c, a.effect), p = param(k, a.property), i;
    if (!p.areKeyframesSupported()) fail("'" + a.property + "' can't be keyframed.");
    if (!p.isTimeVarying()) p.setTimeVarying(true);
    for (i = 0; i < a.keyframes.length; i++) {
      var kf = a.keyframes[i], t = keyTime(c, kf.time);
      p.addKey(t); p.setValueAtKey(t, toNative(s, k, p, kf.value), true);
      if (kf.interpolation) { var mode = { linear: 0, hold: 4, bezier: 5, ease_in: 6, ease_out: 7 }[kf.interpolation]; try { p.setInterpolationTypeAtKey(t, mode, true); } catch (e) { } }
    }
    return { effect: k.displayName, property: p.displayName, keys: a.keyframes.length };
  };
  T.add_marker = function (a) {
    var s = seqById(a.sequence_id), m = s.markers.createMarker(a.time);
    if (a.name) m.name = a.name; if (a.comments) m.comments = a.comments;
    if (a.duration) m.end = timeOf(a.time + a.duration);
    if (a.color_index != null) { try { m.setColorByIndex(a.color_index); } catch (e) { } }
    return { name: m.name, start: secs(m.start) };
  };
  T.set_playhead = function (a) { var s = seqById(a.sequence_id); s.setPlayerPosition(ticksOf(a.time)); return { playhead: secs(s.getPlayerPosition()) }; };
  T.import_mogrt = function (a) {
    var s = seqById(a.sequence_id), at = a.time == null ? s.getPlayerPosition().seconds : a.time;
    var c = s.importMGT(a.path, ticksOf(at), a.video_track || 0, a.audio_track || 0);
    if (!c) fail("Premiere could not import the .mogrt (check the path and that the track exists).");
    var r = { name: c.name, start: secs(c.start), end: secs(c.end) };
    if (a.params) r.set = T.set_mogrt_params({ clip: c, params: a.params }).set;
    return r;
  };
  T.set_mogrt_params = function (a) {
    var c = a.clip, set = [], n;
    if (!c) { var s = seqById(a.sequence_id); c = clipAt(s, "video", a.track, a.clip_index); }
    var comp = c.getMGTComponent(); if (!comp) fail("That clip is not a Motion Graphics Template.");
    for (n in a.params) {
      if (!a.params.hasOwnProperty(n)) continue;
      var p = comp.properties.getParamForDisplayName(n); if (!p) fail("The template has no parameter '" + n + "'. Use get_clip_properties to list them.");
      var v = a.params[n], cur = p.getValue();
      if (typeof v === "string" && typeof cur === "string" && cur.indexOf("textEditValue") >= 0) {   // newer text params are JSON blobs
        var obj = eval("(" + cur + ")"); obj.textEditValue = v; v = stringify(obj);
      }
      p.setValue(v, true); set.push(n);
    }
    return { set: set };
  };
  T.export_sequence = function (a) {
    var s = seqById(a.sequence_id), area = a.work_area ? 1 : 0;
    if (a.via_media_encoder) {
      app.encoder.launchEncoder();
      var job = app.encoder.encodeSequence(s, a.output_path, a.preset_path, area, 1);
      app.encoder.startBatch(); return { queued_in_media_encoder: true, job_id: job };
    }
    var res = s.exportAsMediaDirect(a.output_path, a.preset_path, area);
    return { exported: a.output_path, premiere_says: res || "done" };
  };
  T.save_project = function () { project().save(); return { saved: project().path }; };
  T.run_extendscript = function (a) { var r = eval(a.code); return r === undefined ? null : r; };

  return {
    dispatch: function (name, args) {
      try {
        if (!T.hasOwnProperty(name)) fail("Unknown tool " + name);
        return stringify({ ok: true, result: T[name](args || {}) });
      } catch (e) { return stringify({ ok: false, error: String(e.message || e) + (e.line ? " (premiere.jsx line " + e.line + ")" : "") }); }
    },
    ping: function () { return stringify({ ok: true, result: { premiere_version: app.version, project_open: !!app.project } }); },
    _stringify: stringify
  };
})();
