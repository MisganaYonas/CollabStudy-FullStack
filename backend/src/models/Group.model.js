// src/models/group.model.js
const { ObjectId } = require("mongodb");

class GroupModel {
  constructor(db) {
    this.collection = db.collection("groups");
  }

  async createGroup(name, adminId, members = []) {
    const group = {
      name,
      admin: adminId,
      members: [adminId, ...members], // include admin by default
      createdAt: new Date(),
    };
    const result = await this.collection.insertOne(group);
    return { _id: result.insertedId, ...group };
  }

  async getGroupById(groupId) {
    return this.collection.findOne({ _id: new ObjectId(groupId) });
  }

  async addMember(groupId, userId) {
    return this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      { $addToSet: { members: userId } }
    );
  }

  async removeMember(groupId, userId) {
    return this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      { $pull: { members: userId } }
    );
  }
}

module.exports = GroupModel;
