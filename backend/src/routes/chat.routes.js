// src/routes/chat.routes.js
const ChatController = require("../controllers/chat.controller");
const MessageModel = require("../models/Message.models");
const GroupModel = require("../models/Group.model");

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
    const messageModel = new MessageModel(db);
    const groupModel = new GroupModel(db);
    chatController = new ChatController(messageModel, groupModel);
  }

  return chatController;
}

/**
 * GET /api/chat/messages?groupId=...
 */
async function getMessages(req, res, db) {
  try {
    return await getController(db).getMessages(req, res);
  } catch (err) {
    console.error("Chat getMessages error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to fetch messages" }));
  }
}

/**
 * POST /api/chat/send
 */
async function sendMessage(req, res, db) {
  try {
    return await getController(db).sendMessage(req, res);
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
