// src/controllers/group.controller.js
const GroupModel = require("../models/Group.model");

class GroupController {
  constructor(db) {
    this.groupModel = new GroupModel(db);
  }

  /* ---------------- CREATE GROUP ---------------- */
  async createGroup(req, res) {
    try {
      const { name, adminId, members } = await this.getBody(req);

      if (!name || !adminId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Missing required fields" })
        );
      }

      const group = await this.groupModel.createGroup(
        name,
        adminId,
        members || []
      );

      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Group created", group })
      );
    } catch (error) {
      console.error("Create group error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "Failed to create group",
          details: error.message,
        })
      );
    }
  }

  /* ---------------- GET GROUP ---------------- */
  async getGroup(req, res) {
    try {
      // ✅ FIXED: modern URL API
      const url = new URL(req.url, `http://${req.headers.host}`);
      const groupId = url.searchParams.get("groupId");

      if (!groupId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "groupId missing" })
        );
      }

      const group = await this.groupModel.getGroupById(groupId);

      if (!group) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Group not found" })
        );
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ group }));
    } catch (error) {
      console.error("Get group error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "Failed to get group",
          details: error.message,
        })
      );
    }
  }

  /* ---------------- ADD MEMBER ---------------- */
  async addMember(req, res) {
    try {
      const { groupId, userId } = await this.getBody(req);

      if (!groupId || !userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Missing groupId or userId" })
        );
      }

      await this.groupModel.addMember(groupId, userId);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Member added successfully" })
      );
    } catch (error) {
      console.error("Add member error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "Failed to add member",
          details: error.message,
        })
      );
    }
  }

  /* ---------------- REMOVE MEMBER ---------------- */
  async removeMember(req, res) {
    try {
      const { groupId, userId } = await this.getBody(req);

      if (!groupId || !userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Missing groupId or userId" })
        );
      }

      await this.groupModel.removeMember(groupId, userId);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Member removed successfully" })
      );
    } catch (error) {
      console.error("Remove member error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "Failed to remove member",
          details: error.message,
        })
      );
    }
  }

  /* ---------------- HELPERS ---------------- */
  getBody(req) {
    return new Promise((resolve) => {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  }
}

module.exports = GroupController;
