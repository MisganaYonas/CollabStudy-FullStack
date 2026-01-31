const AIController = require("../controllers/ai.controller");

let aiController = null;

/**
 * Initialize controller once
 */
function getController(db) {
  if (!db) {
    throw new Error("Database instance not provided to AI routes");
  }

  if (!aiController) {
    aiController = new AIController(db);
  }
  return aiController;
}

/**
 * POST /api/ai/chat
 */
async function chat(req, res, db, userDecoded) {
  try {
    return getController(db).chat(req, res, userDecoded);
  } catch (err) {
    console.error("AI chat route error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "AI service error" }));
  }
}

module.exports = { chat };
