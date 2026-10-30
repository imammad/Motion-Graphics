#!/usr/bin/env node
// Premiere Pro MCP server: Claude <-> (stdio) this server <-> (HTTP, 127.0.0.1) the "Claude MCP" panel in Premiere.
// The panel must be open in Premiere (Window > Extensions > Claude MCP). It writes the shared token to
// ~/.premiere-mcp/token; this server reads it. Port: PREMIERE_MCP_PORT (default 8971).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PORT = Number(process.env.PREMIERE_MCP_PORT) || 8971;
const TOKEN_FILE = path.join(os.homedir(), ".premiere-mcp", "token");
const NOT_RUNNING =
  "Can't reach Premiere Pro. Open Premiere, open a project, then open Window > Extensions > Claude MCP " +
  "(the panel must say 'Ready for Claude'). If it isn't in the menu, run the installer in premiere-mcp/install.";

async function callPremiere(tool, args, timeoutMs = 120000) {
  let token;
  try { token = fs.readFileSync(TOKEN_FILE, "utf8").trim(); } catch { throw new Error(NOT_RUNNING); }
  let res;
  try {
    res = await fetch(`http://127.0.0.1:${PORT}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tool, args }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e) {
    if (e.name === "TimeoutError") throw new Error(`Premiere didn't answer within ${timeoutMs / 1000}s (it may be busy or showing a dialog).`);
    throw new Error(NOT_RUNNING);
  }
  if (res.status === 401) throw new Error("The Premiere panel rejected the token. Close and reopen the Claude MCP panel, then try again.");
  const out = await res.json();
  if (!out.ok) throw new Error(out.error);
  return out.result;
}

const server = new McpServer({ name: "premiere-pro", version: "1.0.0" });

// Shared argument pieces
const seq = { sequence_id: z.string().optional().describe("Sequence ID or name. Default: the active sequence.") };
const clipRef = {
  ...seq,
  track_type: z.enum(["video", "audio"]).default("video").describe("Track kind"),
  track: z.number().int().min(0).describe("Track index, 0 = V1/A1"),
  clip_index: z.number().int().min(0).describe("Clip index on that track, 0 = first (see get_timeline)"),
};
const value = z.union([z.number(), z.string(), z.boolean(), z.array(z.number())]);

function tool(name, description, inputSchema, opts = {}) {
  server.registerTool(name, { description, inputSchema, annotations: opts.annotations }, async (args) => {
    try {
      const result = await callPremiere(name, args, opts.timeoutMs);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: e.message }] };
    }
  });
}
const readOnly = { annotations: { readOnlyHint: true } };

tool("get_project_info", "Premiere version, open project, its sequences, and the active sequence (size, fps, duration, playhead). Start here.", {}, readOnly);
tool("list_project_items", "List the Project panel: bins, clips and files with node_id and bin path (use either to refer to an item).", {
  bin: z.string().optional().describe("Only this bin, as a path like 'Footage/Day 1'"),
  max_depth: z.number().int().min(0).optional().describe("How deep to go into sub-bins (default 10)"),
}, readOnly);
tool("import_files", "Import media files (absolute paths on this computer) into a bin, created if missing.", {
  paths: z.array(z.string()).min(1).describe("Absolute file paths"),
  bin: z.string().optional().describe("Target bin path, e.g. 'Imports/Graphics'"),
  as_image_sequence: z.boolean().optional().describe("Treat numbered stills as one image sequence"),
}, { timeoutMs: 600000 });
tool("create_bin", "Create a bin (and any missing parent bins) from a path like 'Exports/Social'.", { path: z.string() });
tool("open_sequence", "Open a sequence in the timeline and make it active.", { sequence_id: z.string().describe("Sequence ID or name") });
tool("create_sequence_from_clips", "Create a new sequence from project items, in order. Its settings match the first clip.", {
  name: z.string(),
  items: z.array(z.string()).min(1).describe("Project items: node_id, bin path or name"),
  bin: z.string().optional().describe("Bin to put the sequence in"),
});
tool("get_timeline", "Every track and clip of a sequence (start/end/in/out in seconds, media path) plus its markers. Use the indexes it returns to address clips.", seq, readOnly);
tool("add_clip_to_timeline", "Place a project item on a track at a time (seconds). Overwrite by default; insert pushes later clips right.", {
  ...seq,
  item: z.string().describe("Project item: node_id, bin path or name"),
  track_type: z.enum(["video", "audio"]).default("video"),
  track: z.number().int().min(0).default(0),
  time: z.number().min(0).optional().describe("Seconds from the sequence start. Default: the playhead"),
  mode: z.enum(["overwrite", "insert"]).default("overwrite"),
});
tool("remove_clip", "Delete a clip from the timeline.", { ...clipRef, ripple: z.boolean().default(false).describe("Close the gap it leaves") }, { annotations: { destructiveHint: true } });
tool("move_clip", "Move a clip along its track: give new_start (seconds) or offset (seconds, may be negative).", {
  ...clipRef, new_start: z.number().optional(), offset: z.number().optional(),
});
tool("set_clip_enabled", "Enable or disable a clip (disabled clips don't play or render).", { ...clipRef, enabled: z.boolean() });
tool("get_clip_properties", "A clip's effects and their properties with current values (Motion, Opacity, Time Remapping, applied effects, Motion Graphics Template fields). Motion Position is in pixels.", clipRef, readOnly);
tool("set_clip_property", "Set a static effect property, e.g. effect 'Motion' property 'Scale' value 120, 'Position' [960, 540] (pixels), 'Opacity'/'Opacity' 50.", {
  ...clipRef, effect: z.string().describe("Effect name as shown in Effect Controls, e.g. 'Motion', 'Opacity'"),
  property: z.string().describe("Property name, e.g. 'Position', 'Scale', 'Rotation', 'Opacity'"), value,
});
tool("add_keyframes", "Animate a property: keyframes at sequence times (seconds). E.g. Motion > Scale 0 at 2.0 and 100 at 2.5 with ease_out.", {
  ...clipRef, effect: z.string(), property: z.string(),
  keyframes: z.array(z.object({
    time: z.number().describe("Seconds on the sequence timeline (must be inside the clip)"),
    value,
    interpolation: z.enum(["linear", "bezier", "hold", "ease_in", "ease_out"]).optional(),
  })).min(1),
});
tool("add_marker", "Add a sequence marker at a time (seconds), optionally with a name, comment, duration and colour (0-7).", {
  ...seq, time: z.number().min(0), name: z.string().optional(), comments: z.string().optional(),
  duration: z.number().positive().optional(), color_index: z.number().int().min(0).max(7).optional(),
});
tool("set_playhead", "Move the playhead to a time (seconds).", { ...seq, time: z.number().min(0) });
tool("import_mogrt", "Place a Motion Graphics Template (.mogrt, absolute path) on the timeline, optionally filling its fields, e.g. params {'Title': 'Hello'}.", {
  ...seq, path: z.string(), time: z.number().min(0).optional().describe("Seconds. Default: the playhead"),
  video_track: z.number().int().min(0).default(0), audio_track: z.number().int().min(0).default(0),
  params: z.record(z.string(), value).optional().describe("Template field name -> value (text, number, checkbox, colour)"),
});
tool("set_mogrt_params", "Change the fields of a Motion Graphics Template clip already on the timeline (names as in Essential Graphics).", {
  ...seq, track: z.number().int().min(0), clip_index: z.number().int().min(0), params: z.record(z.string(), value),
});
tool("export_sequence", "Export a sequence with an encoder preset (.epr). Direct = Premiere renders now and waits; via_media_encoder = queue it in Adobe Media Encoder.", {
  ...seq, output_path: z.string().describe("Absolute output file path"),
  preset_path: z.string().describe("Absolute path to an .epr preset (Media Encoder presets, or Premiere's install folder MediaIO/systempresets)"),
  work_area: z.boolean().default(false).describe("Only the in/out work area"),
  via_media_encoder: z.boolean().default(false),
}, { timeoutMs: 3600000 });
tool("save_project", "Save the open project.", {});
tool("run_extendscript", "Escape hatch: run ExtendScript (ES3) inside Premiere and return the last expression's value. Use only when no other tool fits; the full Premiere scripting DOM is available as app.project etc.", {
  code: z.string().describe("ExtendScript code. The value of its last expression is returned (keep it JSON-friendly)."),
}, { annotations: { destructiveHint: true } });

await server.connect(new StdioServerTransport());
