// src/controller/chat.controller.js
class ChatController {
  constructor(messageModel, groupModel) {
    this.messageModel = messageModel;
    this.groupModel = groupModel;
  }

  async sendMessage(req, res, db) {
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

    if (!group.members.includes(senderId)) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not in group" }));
    }

    const message = await this.messageModel.sendMessage(groupId, senderId, content);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message }));
  }

  async getMessages(req, res, db) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const groupId = urlObj.searchParams.get("groupId");

  if (!groupId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "groupId missing" }));
  }

  const messages = await this.messageModel.getMessagesByGroup(groupId);

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ messages }));
}
}

module.exports = ChatController;

// Helper for parsing POST body
function getBody(req) {
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
