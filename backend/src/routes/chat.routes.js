// src/routes/chat.routes.js
const ChatController = require("../controllers/chat.controller");

let chatController = null;

/**
 * Lazily initialize the controller ONCE
 * using the DB instance passed from app.js
 */
function getController(db) {
  if (!db) {
    throw new Error("Database instance not provided to chat routes");
  }

  if (!chatController) {
    chatController = new ChatController(db);
  }

  return chatController;
}

/**
 * GET /api/chat/messages?groupId=...
 */
async function getMessages(req, res, db, userDecoded) {
  try {
    return await getController(db).getMessages(req, res, userDecoded);
  } catch (err) {
    console.error("Chat getMessages error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to fetch messages" }));
  }
}

/**
 * POST /api/chat/send
 */
async function sendMessage(req, res, db, userDecoded) {
  try {
    return await getController(db).sendMessage(req, res, userDecoded);
  } catch (err) {
    console.error("Chat sendMessage error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to send message" }));
  }
}

module.exports = {
  getMessages,
  sendMessage,
};
