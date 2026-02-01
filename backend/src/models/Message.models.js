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

  // Fix for modern MongoDB driver
  return {
    _id: result.insertedId,
    ...message
  };
  }

  // limit = 50 means it will fetch at most 50 messages unless you specify otherwise.
  async getMessagesByGroup(groupId, limit = 50) {
    return this.collection
      .find({ groupId: new ObjectId(groupId) })
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  }

}

module.exports = MessageModel;
