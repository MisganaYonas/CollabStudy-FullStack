// src/controller/group.controller.js
const GroupModel = require("../models/Group.model");

class GroupController {
  constructor(db) {
    this.groupModel = new GroupModel(db);
  }

  // Create a new group
  async createGroup(req, res) {
    const body = await this.getBody(req);
    const { name, adminId, members } = body;

    if (!name || !adminId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing required fields" }));
    }

    try {
      const group = await this.groupModel.createGroup(name, adminId, members || []);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Group created", group }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Failed to create group", details: err.message }));
    }
  }

  // Get group info by ID
  async getGroup(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const groupId = urlObj.searchParams.get("groupId"); // safer than url.parse

  if (!groupId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "groupId missing" }));
  }

  try {
    const group = await this.groupModel.getGroupById(groupId);
    if (!group) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Group not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ group }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Failed to get group", details: err.message }));
  }
}

  // Add a member to a group
  async addMember(req, res) {
    const body = await this.getBody(req);
    const { groupId, userId } = body;
    if (!groupId || !userId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing groupId or userId" }));
    }

    try {
      await this.groupModel.addMember(groupId, userId);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Member added successfully" }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Failed to add member", details: err.message }));
    }
  }

  // Remove a member from a group
  async removeMember(req, res) {
    const body = await this.getBody(req);
    const { groupId, userId } = body;
    if (!groupId || !userId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing groupId or userId" }));
    }

    try {
      await this.groupModel.removeMember(groupId, userId);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Member removed successfully" }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Failed to remove member", details: err.message }));
    }
  }

  // Helper to parse POST body
  getBody(req) {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          resolve(JSON.parse(body || "{}"));
        } catch {
          resolve({});
        }
      });
    });
  }

  // Helper to parse query parameters from GET requests
  parseQuery(req) {
    const { parse } = require("url");
    return parse(req.url, true).query;
  }
}


module.exports = GroupController;
