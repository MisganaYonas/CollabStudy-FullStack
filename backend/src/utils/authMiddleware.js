const jwt = require("jsonwebtoken");

function authMiddleware(req, res) {
  console.log("Auth middleware called for:", req.url);
  const authHeader = req.headers["authorization"];
  console.log("Auth header:", authHeader);

  if (!authHeader) {
    console.log("No auth header provided");
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "No token provided" }));
    return null;
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    console.log("Invalid token format");
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid token format" }));
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    return decoded; // ✅ return decoded user
  } catch (err) {
    console.log("Token verification failed:", err.message);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid or expired token" }));
    return null;
  }
}

module.exports = authMiddleware;
