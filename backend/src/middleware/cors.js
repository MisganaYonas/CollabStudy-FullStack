// src/middleware/cors.js

/**
 * Simple CORS middleware for raw Node.js HTTP server
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @returns {boolean} true if request is preflight OPTIONS and should stop processing
 */
function enableCORS(req, res) {
  // Allow all origins (for dev only)
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allow standard methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Allow headers used in requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return true; // stop further processing in app.js
  }

  return false; // continue normal processing
}

module.exports = enableCORS;
