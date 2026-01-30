// src/controllers/chat.controller.js
const { ObjectId } = require("mongodb");

class ChatController {
  constructor(db) {
    this.messages = db.collection("messages");
    this.groups = db.collection("groups");
  }

  /* ---------------- HELPERS ---------------- */
  getBody(req) {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => body += chunk);
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  }

  sendJSON(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  /* ---------------- SEND MESSAGE ---------------- */
  async sendMessage(req, res) {
    try {
      const { groupId, senderId, message } = await this.getBody(req);

      if (!groupId || !senderId || !message) {
        return this.sendJSON(res, 400, { error: "groupId, senderId, and message are required" });
      }

      // Validate Group Exists
      const group = await this.groups.findOne({ _id: new ObjectId(groupId) });
      if (!group) {
        return this.sendJSON(res, 404, { error: "Group not found" });
      }

      // Validate User is Member
      // members can be strings or ObjectIds. Normalize to string for comparison.
      const isMember = group.members.some(m => m.toString() === senderId);
      if (!isMember) {
        return this.sendJSON(res, 403, { error: "User is not a member of this group" });
      }

      // Store Message
      const newMessage = {
        groupId,
        senderId,
        message,
        createdAt: new Date()
      };

      await this.messages.insertOne(newMessage);

      return this.sendJSON(res, 201, { message: "Message sent", data: newMessage });
    } catch (error) {
      console.error("Send message error:", error);
      return this.sendJSON(res, 500, { error: "Failed to send message", details: error.message });
    }
  }

  /* ---------------- GET MESSAGES ---------------- */
  async getMessages(req, res) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const groupId = url.searchParams.get("groupId");

      if (!groupId) {
        return this.sendJSON(res, 400, { error: "groupId missing" });
      }

      // Fetch messages for this group, sorted chronologically (oldest first)
      const messages = await this.messages.find({ groupId })
        .sort({ createdAt: 1 })
        .toArray();

      return this.sendJSON(res, 200, { messages });
    } catch (error) {
      console.error("Get messages error:", error);
      return this.sendJSON(res, 500, { error: "Failed to get messages", details: error.message });
    }
  }
}

module.exports = ChatController;
