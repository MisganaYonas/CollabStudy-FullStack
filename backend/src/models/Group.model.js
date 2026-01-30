const { ObjectId } = require("mongodb");

class GroupModel {
  constructor(db) {
    this.collection = db.collection("groups");
  }

  async createGroup({ name, department, year, meetingTime, meetingDays, maxMembers = 10, adminId }) {
    // Initial status is always Inactive because it starts with 1 member (admin)
    const status = "Inactive";

    const group = {
      name,
      department,
      year,
      meetingTime,
      meetingDays, // array
      maxMembers: parseInt(maxMembers) || 10,
      membersCount: 1, // Start with 1
      admin: adminId,
      members: [adminId], // start with only admin
      status,
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(group);
    return { _id: result.insertedId, ...group };
  }

  async searchGroups(filters = {}) {
    const query = {};

    // Text search: name (Regex)
    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    // Exact matches
    if (filters.course) query.course = filters.course;
    if (filters.department) query.department = filters.department;
    if (filters.year) query.year = filters.year;
    if (filters.meetingTime) query.meetingTime = filters.meetingTime;
    if (filters.status) query.status = filters.status;

    // Meeting Days (array match: all specified days must be present)
    if (filters.meetingDays && Array.isArray(filters.meetingDays) && filters.meetingDays.length > 0) {
      query.meetingDays = { $all: filters.meetingDays };
    }

    return this.collection.find(query).toArray();
  }

  async getGroupById(groupId) {
    if (!ObjectId.isValid(groupId)) return null;
    return this.collection.findOne({ _id: new ObjectId(groupId) });
  }

  async addMember(groupId, userId) {
    // Add member and potentially update status to Active if members > 1
    // We do this in two steps or pipeline? 
    // Simple approach: just add. Controller handles status logic or we use pipeline.
    // Requirement: "Update status to 'Active' if members.length > 1"

    // We'll just push the member here. Logic for status update can be done after check or here.
    return this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      { $addToSet: { members: userId } }
    );
  }

  async updateStatus(groupId, status) {
    return this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      { $set: { status } }
    );
  }
}

module.exports = GroupModel;
