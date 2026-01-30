// src/routes/group.routes.js
const { connectDB } = require("../config/db");
const GroupController = require("../controllers/group.controller");

// DB & controller instances (reuse the same for all requests)
let dbInstance = null;
let groupController = null;

async function init() {
  if (!dbInstance) {
    dbInstance = await connectDB();
    groupController = new GroupController(dbInstance);
  }
}

// Route: POST /api/group/create
async function createGroup(req, res) {
  await init();
  return groupController.createGroup(req, res);
}

// Route: GET /api/group/get?groupId=...
async function getGroup(req, res) {
  await init();
  return groupController.getGroup(req, res);
}

// Route: POST /api/group/add-member
async function addMember(req, res) {
  await init();
  return groupController.addMember(req, res);
}

// Route: POST /api/group/remove-member
async function removeMember(req, res) {
  await init();
  return groupController.removeMember(req, res);
}

module.exports = {
  createGroup,
  getGroup,
  addMember,
  removeMember,
};
