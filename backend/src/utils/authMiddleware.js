const jwt = require("jsonwebtoken");

function authMiddleware(req, res) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "No token provided" }));
    return false;
  }

  const token = authHeader.split(" ")[1]; // remove "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user to request
    return true;
  } catch (err) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid token" }));
    return false;
  }
}

module.exports = authMiddleware;

