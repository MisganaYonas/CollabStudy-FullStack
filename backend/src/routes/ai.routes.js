// src/routes/ai.routes.js
const AIController = require("../controllers/ai.controller");
const { initDB } = require("../config/db");

let aiController = null;

async function init() {
  if (!aiController) {
    const db = await initDB();
    aiController = new AIController(db);
  }
}

async function chat(req, res) {
  await init();
  return aiController.chat(req, res);
}

module.exports = { chat };
