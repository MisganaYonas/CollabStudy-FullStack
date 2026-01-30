// src/middleware/cors.js

function enableCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins, you can restrict later
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // allowed methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // allowed headers

  // handle preflight request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true; // indicate that the request was handled
  }

  return false; // request not handled, continue with your route
}

module.exports = enableCORS;
