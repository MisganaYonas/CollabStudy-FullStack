// src/controllers/chat.controller.js

class ChatController {
  constructor(messageModel, groupModel) {
    this.messageModel = messageModel;
    this.groupModel = groupModel;
  }

  // POST /api/chat/send
  async sendMessage(req, res) {
    try {
      const { groupId, senderId, content } = await getBody(req);

      if (!groupId || !senderId || !content) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Missing data" }));
      }

      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Group not found" }));
      }

      if (!group.members || !group.members.includes(senderId)) {
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not in group" }));
      }

      const message = await this.messageModel.sendMessage(
        groupId,
        senderId,
        content
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message }));
    } catch (error) {
      console.error("Send message error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }

  // GET /api/chat/messages?groupId=...
  async getMessages(req, res) {
    try {
      // ✅ FIXED: modern URL API (no url.parse)
      const url = new URL(req.url, `http://${req.headers.host}`);
      const groupId = url.searchParams.get("groupId");

      if (!groupId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "groupId missing" }));
      }

      const messages = await this.messageModel.getMessagesByGroup(groupId);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ messages }));
    } catch (error) {
      console.error("Get messages error:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
}

module.exports = ChatController;

/**
 * Helper: parse JSON body safely
 */
function getBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}
