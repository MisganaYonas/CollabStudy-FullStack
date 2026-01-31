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
    groupController = new GroupController(groupModel, db);
  }

  return groupController;
}

/**
 * POST /api/group/create
 */
async function createGroup(req, res, db, user) {
  try {
    return await getController(db).createGroup(req, res, user);
  } catch (err) {
    console.error("Create group error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to create group" }));
  }
}

/**
 * POST /api/group/invite
 */
async function inviteMember(req, res, db, user) {
  try {
    return await getController(db).inviteMember(req, res, user);
  } catch (err) {
    console.error("Invite member error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to invite member" }));
  }
}

/**
 * POST /api/group/search
 */
async function searchGroups(req, res, db) {
  try {
    return await getController(db).searchGroups(req, res);
  } catch (err) {
    console.error("Search groups error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to search groups" }));
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

module.exports = {
  createGroup,
  inviteMember,
  searchGroups,
  getGroup,
};


