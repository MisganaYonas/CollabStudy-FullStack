const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

/* ---------------- IMPORTS ---------------- */
const { connectDB } = require("./config/db");
const validateEmail = require("./utils/validateEmail");
const authMiddleware = require("./middleware/auth.middleware");

const chatRoutes = require("./routes/chat.routes");
const aiRoutes = require("./routes/ai.routes");
const groupRoutes = require("./routes/group.routes");
const userRoutes = require("./routes/user.routes");
const enableCORS = require("./middleware/cors");

/* ---------------- CONFIG ---------------- */
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

(async function initDB() {
  try {
    dbInstance = await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
})();

/* ---------------- HTTP SERVER ---------------- */
const server = http.createServer(async (req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  if (enableCORS(req, res)) return;

  if (!dbInstance) {
    return sendJSON(res, 503, { error: "Database not ready" });
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  /* ---------------- HEALTH ---------------- */
  if (req.method === "GET" && pathname === "/") {
    return sendJSON(res, 200, { message: "Backend running 🚀" });
  }

  /* ---------------- SIGNUP ---------------- */
  if (req.method === "POST" && pathname === "/api/signup") {
    const { username, email, password, confirmPassword, department, year } = await getBody(req);

    if (!username || !email || !password || !confirmPassword || !department || !year) {
      return sendJSON(res, 400, { error: "All fields are required" });
    }

    if (!validateEmail(email)) return sendJSON(res, 400, { error: "Invalid AAU email format" });
    if (password.length < 8) return sendJSON(res, 400, { error: "Password must be at least 8 characters" });
    if (password !== confirmPassword) return sendJSON(res, 400, { error: "Passwords do not match" });

    const users = dbInstance.collection("users");
    const existingUser = await users.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return sendJSON(res, 400, { error: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({ username, email, password: hashedPassword, department, year, createdAt: new Date() });
    return sendJSON(res, 201, { message: "Signup successful" });
  }

  /* ---------------- LOGIN ---------------- */
  if (req.method === "POST" && pathname === "/api/login") {
    const { email, password } = await getBody(req);
    if (!email || !password) return sendJSON(res, 400, { error: "Email and password required" });

    const users = dbInstance.collection("users");
    const user = await users.findOne({ email });
    if (!user) return sendJSON(res, 400, { error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendJSON(res, 400, { error: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return sendJSON(res, 200, {
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        department: user.department,
        year: user.year,
        bio: user.bio || ""
      }
    });
  }

  /* ---------------- PROFILE (GET) ---------------- */
  if (req.method === "GET" && pathname === "/api/profile") {
    const userDecoded = authMiddleware(req, res);
    if (!userDecoded) return;

    try {
      const { ObjectId } = require("mongodb");
      const users = dbInstance.collection("users");
      const user = await users.findOne({ _id: new ObjectId(userDecoded.id) });

      if (!user) return sendJSON(res, 404, { error: "User not found" });

      return sendJSON(res, 200, {
        message: "Profile loaded successfully",
        user: {
          username: user.username || "",
          email: user.email || "",
          department: user.department || "",
          year: user.year || "",
          bio: user.bio || ""
        }
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      return sendJSON(res, 500, { error: "Server error" });
    }
  }

  /* ---------------- PROFILE (EDIT) ---------------- */
  if (req.method === "PUT" && pathname === "/api/profile/edit") {
    const userDecoded = authMiddleware(req, res);
    if (!userDecoded) return;

    try {
      const { username, email, department, year, bio } = await getBody(req);

      if (!username || !email || !department || !year)
        return sendJSON(res, 400, { error: "Username, email, department, and year are required" });

      if (!validateEmail(email)) return sendJSON(res, 400, { error: "Invalid AAU email format" });

      const validYears = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "graduate"];
      const normalizedYear = year.toLowerCase();
      if (!validYears.includes(normalizedYear)) return sendJSON(res, 400, { error: "Invalid year option" });

      const { ObjectId } = require("mongodb");
      const users = dbInstance.collection("users");

      const existing = await users.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: new ObjectId(userDecoded.id) }
      });
      if (existing) return sendJSON(res, 400, { error: "Username or email already exists" });

      const updateData = { username, email, department, year };
      if (bio !== undefined) updateData.bio = bio;

      await users.updateOne({ _id: new ObjectId(userDecoded.id) }, { $set: updateData });
      const updatedUser = await users.findOne({ _id: new ObjectId(userDecoded.id) });

      return sendJSON(res, 200, {
        message: "Profile updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          department: updatedUser.department,
          year: updatedUser.year,
          bio: updatedUser.bio || ""
        }
      });
    } catch (err) {
      console.error(err);
      return sendJSON(res, 500, { error: "Server error" });
    }
  }

  /* ---------------- DELETE ACCOUNT ---------------- */
  if (pathname === "/api/user/delete" && req.method === "DELETE") {
    const userDecoded = authMiddleware(req, res);
    if (!userDecoded) return;

    try {
      const { ObjectId } = require("mongodb");
      const users = dbInstance.collection("users");
      await users.deleteOne({ _id: new ObjectId(userDecoded.id) });
      return sendJSON(res, 200, { message: "Account deleted successfully" });
    } catch (err) {
      console.error(err);
      return sendJSON(res, 500, { error: "Server error" });
    }
  }

  /* ---------------- AI CHAT ---------------- */
  if (req.method === "POST" && pathname === "/api/ai/chat") {
    const userDecoded = authMiddleware(req, res);
    if (!userDecoded) return;
    
    return aiRoutes.chat(req, res, dbInstance, userDecoded);
  }

  /* ---------------- CHAT ---------------- */
  if (pathname.startsWith("/api/chat")) {
    const userDecoded = authMiddleware(req, res);
    if (!userDecoded) return;
    
    if (req.method === "GET" && pathname === "/api/chat/messages") {
      return chatRoutes.getMessages(req, res, dbInstance, userDecoded);
    }
    if (req.method === "POST" && pathname === "/api/chat/send") {
      return chatRoutes.sendMessage(req, res, dbInstance, userDecoded);
    }
  }

  /* ---------------- GROUPS ---------------- */
  if (pathname.startsWith("/api/group")) {
    console.log("Group route hit:", req.method, pathname);
    
    const userDecoded = authMiddleware(req, res);
    if (!userDecoded) {
      console.log("Auth middleware failed");
      return;
    }
    
    console.log("Auth successful, user:", userDecoded);
    
    if (req.method === "POST" && pathname === "/api/group/create") {
      console.log("Calling createGroup route");
      return groupRoutes.createGroup(req, res, dbInstance, userDecoded);
    }
    if (req.method === "POST" && pathname === "/api/group/join") {
      return groupRoutes.joinGroup(req, res, dbInstance, userDecoded);
    }
    if (req.method === "GET" && pathname === "/api/group/get") {
      return groupRoutes.getGroup(req, res, dbInstance, userDecoded);
    }
    if (req.method === "POST" && pathname === "/api/group/invite") {
      return groupRoutes.inviteMember(req, res, dbInstance, userDecoded);
    }
    if (req.method === "POST" && pathname === "/api/group/search") {
      return groupRoutes.searchGroups(req, res, dbInstance, userDecoded);
    }
  }

  /* ---------------- FALLBACK ---------------- */
  return sendJSON(res, 404, { error: "Route not found" });
});

/* ---------------- WEBSOCKET ---------------- */
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");
  ws.on("message", (msg) => ws.send("Echo: " + msg.toString()));
  ws.on("close", () => console.log("❌ WebSocket client disconnected"));
});

/* ---------------- START ---------------- */
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = server;
