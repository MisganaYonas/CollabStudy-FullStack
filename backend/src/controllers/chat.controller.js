// src/controllers/chat.controller.js
const { ObjectId } = require("mongodb");

class ChatController {
  constructor(db) {
    this.messages = db.collection("messages");
    this.groups = db.collection("groups");
    this.users = db.collection("users");
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
  async sendMessage(req, res, userDecoded) {
    try {
      const { groupId, message } = await this.getBody(req);
      const senderId = userDecoded.id; // Get senderId from JWT token

      console.log("Send message request:", { groupId, message, senderId });

      if (!groupId || !message) {
        console.log("Missing required fields:", { groupId: !!groupId, message: !!message });
        return this.sendJSON(res, 400, { error: "groupId and message are required" });
      }

      // Get sender username
      const { ObjectId } = require("mongodb");
      const sender = await this.users.findOne({ _id: new ObjectId(senderId) });
      
      if (!sender) {
        return this.sendJSON(res, 404, { error: "Sender not found" });
      }
      
      const senderName = sender.username;

      // Validate Group Exists
      const group = await this.groups.findOne({ _id: new ObjectId(groupId) });
      console.log("Found group:", group ? "Yes" : "No");
      if (!group) {
        return this.sendJSON(res, 404, { error: "Group not found" });
      }

      // Validate User is Member
      console.log("Group members:", group.members);
      console.log("Checking if user", senderId, "is member");
      const isMember = group.members.some(m => m.toString() === senderId);
      console.log("Is member:", isMember);
      
      if (!isMember) {
        return this.sendJSON(res, 403, { error: "User is not a member of this group" });
      }

      // Store Message
      const newMessage = {
        groupId,
        senderId,
        senderName,
        message,
        createdAt: new Date()
      };

      await this.messages.insertOne(newMessage);
      console.log("Message stored successfully");

      return this.sendJSON(res, 201, { message: "Message sent", data: newMessage });
    } catch (error) {
      console.error("Send message error:", error);
      return this.sendJSON(res, 500, { error: "Failed to send message", details: error.message });
    }
  }

  /* ---------------- GET MESSAGES ---------------- */
  async getMessages(req, res, userDecoded) {
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

      // Populate sender names for messages that don't have them
      const { ObjectId } = require("mongodb");
      for (let message of messages) {
        if (!message.senderName && message.senderId) {
          const sender = await this.users.findOne({ _id: new ObjectId(message.senderId) });
          if (sender) {
            message.senderName = sender.username;
          }
        }
      }

      return this.sendJSON(res, 200, { messages });
    } catch (error) {
      console.error("Get messages error:", error);
      return this.sendJSON(res, 500, { error: "Failed to get messages", details: error.message });
    }
  }
}

module.exports = ChatController;
