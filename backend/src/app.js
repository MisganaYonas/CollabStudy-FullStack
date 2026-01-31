const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

/* ---------------- IMPORTS ---------------- */
const { connectDB } = require("./config/db");
const validateEmail = require("./utils/validateEmail");
const authMiddleware = require("./utils/authMiddleware");

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
  /* --- CORS --- */
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
    const {
      username,
      email,
      password,
      confirmPassword,
      department,
      year
    } = await getBody(req);

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !department ||
      !year
    ) {
      return sendJSON(res, 400, { error: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return sendJSON(res, 400, { error: "Invalid AAU email format" });
    }

    if (password.length < 8) {
      return sendJSON(res, 400, { error: "Password must be at least 8 characters" });
    }

    if (password !== confirmPassword) {
      return sendJSON(res, 400, { error: "Passwords do not match" });
    }

    const users = dbInstance.collection("users");

    const existingUser = await users.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return sendJSON(res, 400, { error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      username,
      email,
      password: hashedPassword,
      department,
      year,
      createdAt: new Date()
    });

    return sendJSON(res, 201, { message: "Signup successful" });
  }

  /* ---------------- LOGIN ---------------- */
  if (req.method === "POST" && pathname === "/api/login") {
    const { email, password } = await getBody(req);

    // 1️⃣ validate email/password exists
    if (!email || !password) {
      return sendJSON(res, 400, { error: "Email and password required" });
    }

    // 2️⃣ get user from DB
    const users = dbInstance.collection("users");
    const user = await users.findOne({ email });

    if (!user) {
      return sendJSON(res, 400, { error: "User not found" });
    }

    // 3️⃣ compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendJSON(res, 400, { error: "Incorrect password" });
    }

    // ✅ 4️⃣ DEBUG: check if JWT_SECRET is loaded
    console.log("JWT_SECRET:", process.env.JWT_SECRET);  // <--- put it here

    // 5️⃣ create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // <-- must exist
      { expiresIn: "1h" }
    );

    return sendJSON(res, 200, {
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
        department: user.department,
        year: user.year
      }
    });
  }

  // ---------------- EDIT PROFILE ---------------- */
  if (req.method === "PUT" && pathname === "/api/profile/edit") {
    const user = authMiddleware(req, res);
    if (!user) return; // stop if JWT invalid

    // Make the route handler async
    try {
      const { username, email, department, year, bio } = await getBody(req);

      if (!username || !email || !department || !year) {
        return sendJSON(res, 400, { error: "Username, email, department, and year are required" });
      }

      if (!validateEmail(email)) {
        return sendJSON(res, 400, { error: "Invalid AAU email format" });
      }

      const validYears = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "Graduate"];
      if (!validYears.includes(year)) {
        return sendJSON(res, 400, { error: "Invalid year option" });
      }

      const users = dbInstance.collection("users");

      // Check unique username/email ignoring current user
      const { ObjectId } = require("mongodb");
      const existing = await users.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: new ObjectId(user.id) }
      });

      if (existing) {
        return sendJSON(res, 400, { error: "Username or email already exists" });
      }

      const updateData = { username, email, department, year };
      if (bio !== undefined) updateData.bio = bio;

      await users.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: updateData }
      );

      const updatedUser = await users.findOne({ _id: new ObjectId(user.id) });

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

  /* ---------------- PROFILE (PROTECTED) ---------------- */
  if (req.method === "GET" && pathname === "/api/profile") {
    const user = authMiddleware(req, res);
    if (!user) return;

    return sendJSON(res, 200, {
      message: "Protected route accessed",
      user
    });
  }

  /* ---------------- AI CHAT ---------------- */
  if (req.method === "POST" && pathname === "/api/ai/chat") {
    return aiRoutes.chat(req, res, dbInstance);
  }

  /* ---------------- CHAT ---------------- */
  if (pathname.startsWith("/api/chat")) {
    if (req.method === "GET" && pathname === "/api/chat/messages") {
      return chatRoutes.getMessages(req, res, dbInstance);
    }

    if (req.method === "POST" && pathname === "/api/chat/send") {
      return chatRoutes.sendMessage(req, res, dbInstance);
    }
  }

  /* ---------------- GROUPS ---------------- */
  if (pathname.startsWith("/api/group")) {
    if (req.method === "POST" && pathname === "/api/group/create") {
      return groupRoutes.createGroup(req, res, dbInstance);
    }

    if (req.method === "GET" && pathname === "/api/group/get") {
      return groupRoutes.getGroup(req, res, dbInstance);
    }

    if (req.method === "POST" && pathname === "/api/group/invite") {
      return groupRoutes.inviteMember(req, res, dbInstance);
    }

    if (req.method === "POST" && pathname === "/api/group/search") {
      return groupRoutes.searchGroups(req, res, dbInstance);
    }
  }

  /* ---------------- USER ---------------- */
  if (pathname.startsWith("/api/user")) {
    if (req.method === "DELETE" && pathname === "/api/user/delete") {
      return userRoutes.deleteAccount(req, res, dbInstance);
    }

    if (req.method === "POST" && pathname === "/api/user/forget-password") {
      return userRoutes.forgetPassword(req, res, dbInstance);
    }
  }

  /* ---------------- FALLBACK ---------------- */
  return sendJSON(res, 404, { error: "Route not found" });
});

/* ---------------- WEBSOCKET ---------------- */
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.on("message", (msg) => {
    ws.send("Echo: " + msg.toString());
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });
});

/* ---------------- START ---------------- */
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = server;
