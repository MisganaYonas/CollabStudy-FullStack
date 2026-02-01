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
    if (filters.admin) query.admin = filters.admin;
    if (filters.members) query.members = filters.members;

    // Meeting Days (array match: all specified days must be present)
    if (filters.meetingDays && Array.isArray(filters.meetingDays) && filters.meetingDays.length > 0) {
      query.meetingDays = { $all: filters.meetingDays };
    }

    // Use aggregation to populate admin username and calculate member count
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          adminObjectId: { $toObjectId: "$admin" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "adminObjectId",
          foreignField: "_id",
          as: "adminUser"
        }
      },
      {
        $addFields: {
          membersCount: { $size: "$members" },
          adminUsername: { $arrayElemAt: ["$adminUser.username", 0] }
        }
      },
      {
        $project: {
          adminUser: 0,
          adminObjectId: 0
        }
      }
    ];

    return this.collection.aggregate(pipeline).toArray();
  }

  async getGroupById(groupId) {
    if (!ObjectId.isValid(groupId)) return null;
    return this.collection.findOne({ _id: new ObjectId(groupId) });
  }

  async addMember(groupId, userId) {
    // Add member and update membersCount
    const result = await this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      { 
        $addToSet: { members: userId },
      }
    );
    
    // Update membersCount to reflect actual array size
    await this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      [{ $set: { membersCount: { $size: "$members" } } }]
    );
    
    return result;
  }

  async updateStatus(groupId, status) {
    return this.collection.updateOne(
      { _id: new ObjectId(groupId) },
      { $set: { status } }
    );
  }
}

module.exports = GroupModel;
