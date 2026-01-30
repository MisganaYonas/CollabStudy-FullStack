const http = require("http");
const { parse } = require("url");
const { connectDB } = require("./config/db");
const chatRoutes = require("./routes/chat.routes");
const aiRoutes = require("./routes/ai.routes");
const groupRoutes = require("./routes/group.routes");
const enableCORS = require("./middleware/cors");
const WebSocket = require("ws");

const PORT = 5000;

/* ---------------- HELPERS ---------------- */
function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

/* ---------------- DATABASE INIT ---------------- */
let dbInstance = null;
(async () => {
  dbInstance = await connectDB();
  console.log("Database ready for requests");
})();

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(async (req, res) => {
  // --- CORS ---
  if (enableCORS(req, res)) return;

  if (!dbInstance) {
    return sendJSON(res, 503, { error: "Database not ready" });
  }

  const parsedUrl = parse(req.url, true);

  // --- Health check ---
  if (req.method === "GET" && parsedUrl.pathname === "/") {
    return sendJSON(res, 200, { message: "Backend running" });
  }

  const validateEmail = require("./utils/validateEmail");

  // --- Signup ---
  if (req.method === "POST" && parsedUrl.pathname === "/api/signup") {
    const body = await getBody(req);
    const { name, email } = body;

    if (!validateEmail(email)) {
      return sendJSON(res, 400, { error: "Invalid institutional email" });
    }

    return sendJSON(res, 200, { message: "Signup successful", user: { name, email } });
  }

  // --- AI Chat ---
  if (req.method === "POST" && parsedUrl.pathname === "/api/ai/chat") {
    return aiRoutes.chat(req, res, dbInstance);
  }

  // --- Chat ---
  if (parsedUrl.pathname.startsWith("/api/chat")) {
    if (req.method === "GET" && parsedUrl.pathname === "/api/chat/messages") {
      return chatRoutes.getMessages(req, res, dbInstance);
    }
    if (req.method === "POST" && parsedUrl.pathname === "/api/chat/send") {
      return chatRoutes.sendMessage(req, res, dbInstance);
    }
  }

  // --- Group ---
  if (parsedUrl.pathname.startsWith("/api/group")) {
    if (req.method === "POST" && parsedUrl.pathname === "/api/group/create") {
      return groupRoutes.createGroup(req, res, dbInstance);
    }
    if (req.method === "GET" && parsedUrl.pathname === "/api/group/get") {
      return groupRoutes.getGroup(req, res, dbInstance);
    }
    if (req.method === "POST" && parsedUrl.pathname === "/api/group/add-member") {
      return groupRoutes.addMember(req, res, dbInstance);
    }
    if (req.method === "POST" && parsedUrl.pathname === "/api/group/remove-member") {
      return groupRoutes.removeMember(req, res, dbInstance);
    }
  }

  return sendJSON(res, 404, { error: "Route not found" });
});

/* ---------------- WEBSOCKET SERVER ---------------- */
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ New WebSocket client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    ws.send("Echo: " + msg.toString());
  });

  ws.on("close", () => console.log("Client disconnected"));
});

/* ---------------- START SERVER ---------------- */
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = server;
