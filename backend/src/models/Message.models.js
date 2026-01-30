// src/models/message.models.js
const { ObjectId } = require("mongodb");

class MessageModel {
  constructor(db) {
    this.collection = db.collection("messages");
  }

  async sendMessage(groupId, senderId, content) {
    const message = {
      groupId: new ObjectId(groupId),
      senderId,
      content,
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(message);
    return result.ops[0];
  }

  async getMessagesByGroup(groupId, limit = 50) {
    return this.collection
      .find({ groupId: new ObjectId(groupId) })
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  }

  async deleteMessagesByUser(userId) {
    return this.collection.deleteMany({ senderId: userId });
  }
}

module.exports = MessageModel;
