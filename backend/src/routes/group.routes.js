// src/routes/group.routes.js
const GroupController = require("../controllers/group.controller");
const GroupModel = require("../models/Group.model");

let groupController = null;

/**
 * Initialize controller ONCE using shared DB instance
 */
function getController(db) {
  if (!db) {
    throw new Error("Database instance not provided to group routes");
  }

  if (!groupController) {
    const groupModel = new GroupModel(db);
    groupController = new GroupController(groupModel);
  }

  return groupController;
}

/**
 * POST /api/group/create
 */
async function createGroup(req, res, db) {
  try {
    return await getController(db).createGroup(req, res);
  } catch (err) {
    console.error("Create group error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to create group" }));
  }
}

/**
 * GET /api/group/get?groupId=...
 */
async function getGroup(req, res, db) {
  try {
    return await getController(db).getGroup(req, res);
  } catch (err) {
    console.error("Get group error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to get group" }));
  }
}

/**
 * POST /api/group/add-member
 */
async function addMember(req, res, db) {
  try {
    return await getController(db).addMember(req, res);
  } catch (err) {
    console.error("Add member error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to add member" }));
  }
}

/**
 * POST /api/group/remove-member
 */
async function removeMember(req, res, db) {
  try {
    return await getController(db).removeMember(req, res);
  } catch (err) {
    console.error("Remove member error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to remove member" }));
  }
}

module.exports = {
  createGroup,
  getGroup,
  addMember,
  removeMember,
};
