// src/routes/chat.routes.js
const ChatController = require("../controllers/chat.controller");
const MessageModel = require("../models/Message.models");
const GroupModel = require("../models/Group.model");
const connectDB = require("../config/db");

// Initialize DB and models (we reuse the same db instance for all requests) 
let dbInstance = null;
let chatController = null;

async function init() {
  if (!dbInstance) {
    dbInstance = await connectDB();
    const messageModel = new MessageModel(dbInstance);
    const groupModel = new GroupModel(dbInstance);
    chatController = new ChatController(messageModel, groupModel);
  }
}

// Wrapper for GET /api/chat/messages
async function getMessages(req, res) {
  await init();
  return chatController.getMessages(req, res);
}

// Wrapper for POST /api/chat/send
async function sendMessage(req, res) {
  await init();
  return chatController.sendMessage(req, res);
}

module.exports = {
  getMessages,
  sendMessage,
};
