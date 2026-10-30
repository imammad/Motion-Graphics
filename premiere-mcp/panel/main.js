// Claude MCP panel: a tiny HTTP server on 127.0.0.1 that runs Premiere tools for the MCP server.
// POST /run {"tool": "...", "args": {...}} with header "Authorization: Bearer <token>".
// The token lives in ~/.premiere-mcp/token (created here, read by the MCP server), so only processes
// running as you on this computer can drive Premiere.
/* global __adobe_cep__ */
var http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), crypto = require("crypto");
var PORT = Number(process.env.PREMIERE_MCP_PORT) || 8971;
var DIR = path.join(os.homedir(), ".premiere-mcp"), TOKEN_FILE = path.join(DIR, "token");
var statusEl = document.getElementById("status"), logEl = document.getElementById("log");

function log(msg) {
  var line = new Date().toLocaleTimeString() + "  " + msg + "\n";
  logEl.textContent = (line + logEl.textContent).slice(0, 6000);
}
function status(text, ok) { statusEl.textContent = text; statusEl.className = ok ? "ok" : "bad"; }

function token() {
  try { var t = fs.readFileSync(TOKEN_FILE, "utf8").trim(); if (t.length >= 32) return t; } catch (e) { }
  fs.mkdirSync(DIR, { recursive: true });
  var t2 = crypto.randomBytes(24).toString("hex");
  fs.writeFileSync(TOKEN_FILE, t2, { mode: 384 });   // 0600
  return t2;
}
var TOKEN = token();

// evalScript is ExtendScript's door. JSON is a valid JS literal once U+2028/2029 are escaped.
function runInPremiere(tool, args, done) {
  var lit = JSON.stringify(args || {}).replace(/ /g, "\\u2028").replace(/ /g, "\\u2029");
  var script = tool === "__ping" ? "PMCP.ping()" : "PMCP.dispatch(" + JSON.stringify(tool) + ", " + lit + ")";
  __adobe_cep__.evalScript("typeof PMCP === 'undefined' ? 'NO_HOST' : " + script, function (res) {
    if (res === "NO_HOST") return done({ ok: false, error: "The Premiere side of the Claude panel didn't load. Close and reopen Window > Extensions > Claude MCP." });
    if (res === "EvalScript error.") return done({ ok: false, error: "Premiere's script engine reported an error running " + tool + "." });
    try { done(JSON.parse(res)); } catch (e) { done({ ok: false, error: "Unreadable reply from Premiere: " + String(res).slice(0, 200) }); }
  });
}

var server = http.createServer(function (req, res) {
  function reply(code, obj) { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); }
  if (req.headers.authorization !== "Bearer " + TOKEN) return reply(401, { ok: false, error: "Bad token" });
  if (req.method !== "POST" || req.url !== "/run") return reply(404, { ok: false, error: "Use POST /run" });
  var body = "";
  req.on("data", function (c) { body += c; if (body.length > 5e6) req.destroy(); });
  req.on("end", function () {
    var msg; try { msg = JSON.parse(body); } catch (e) { return reply(400, { ok: false, error: "Body is not JSON" }); }
    var t0 = Date.now();
    runInPremiere(msg.tool, msg.args, function (out) {
      log((out.ok ? "ok   " : "FAIL ") + msg.tool + " (" + (Date.now() - t0) + " ms)" + (out.ok ? "" : ": " + out.error));
      reply(200, out);
    });
  });
});
server.on("error", function (e) {
  status(e.code === "EADDRINUSE" ? "Port " + PORT + " is busy (is another Premiere open?)" : "Server error: " + e.message, false);
});
server.listen(PORT, "127.0.0.1", function () {
  status("Ready for Claude on 127.0.0.1:" + PORT, true);
  log("Listening. Token file: " + TOKEN_FILE);
});
