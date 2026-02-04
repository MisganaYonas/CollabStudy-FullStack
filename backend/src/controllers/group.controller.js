// src/controllers/group.controller.js
const { ObjectId } = require("mongodb");

class GroupController {
  constructor(groupModel, db) {
    this.groupModel = groupModel;
    this.usersCollection = db.collection("users");
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

  sendJSON(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  /* ---------------- CREATE GROUP ---------------- */
  async createGroup(req, res, userDecoded) {
    try {
      const {
        name, department, year, meetingTime, meetingDays,
        maxMembers // Renamed membersCount to maxMembers for clarity
      } = await this.getBody(req);

      // Debug logging
      console.log("Received group data:", { name, department, year, meetingTime, meetingDays, maxMembers });
      console.log("User decoded:", userDecoded);

      // Use authenticated user ID as admin
      const adminId = userDecoded.id;

      // Validate required fields. Initial membersCount is fixed at 1 (adminId).
      if (!name || !department || !year) {
        console.log("Missing fields check:", { name: !!name, department: !!department, year: !!year });
        return this.sendJSON(res, 400, { error: "Missing required fields" });
      }

      // Validate year format
      const validYears = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "graduate"];
      const normalizedYear = year.toLowerCase();
      if (!validYears.includes(normalizedYear)) {
        console.log("Invalid year:", year, "normalized:", normalizedYear, "valid options:", validYears);
        return this.sendJSON(res, 400, { error: "Invalid year option" });
      }

      // Validate maxMembers if provided, otherwise default to 10 in model
      if (maxMembers && maxMembers > 10) {
        return this.sendJSON(res, 400, { error: "Max members allowed is 10" });
      }
      if (maxMembers && maxMembers < 1) {
        return this.sendJSON(res, 400, { error: "Min members allowed is 1" });
      }

      // Group starts with members = [adminId], status = "Inactive" (handled by model)
      // We ignore any 'members' array passed in request body for creation.
      const group = await this.groupModel.createGroup({
        name, department, year, meetingTime, meetingDays,
        maxMembers, // Pass maxMembers (optional, defaults to 10 in model)
        adminId // adminId will be the initial member
      });

      return this.sendJSON(res, 201, { message: "Group created", group });
    } catch (error) {
      console.error("Create group error:", error);
      return this.sendJSON(res, 500, { error: "Failed to create group", details: error.message });
    }
  }

  /* ---------------- INVITE MEMBER ---------------- */
  async inviteMember(req, res, userDecoded) {
    try {
      const { groupId, email } = await this.getBody(req);

      if (!groupId || !email) {
        return this.sendJSON(res, 400, { error: "groupId and email are required" });
      }

      // 1. Find User by Email
      const user = await this.usersCollection.findOne({ email });
      if (!user) {
        return this.sendJSON(res, 404, { error: "User with this email not found" });
      }
      const userId = user._id.toString();

      // 2. Find Group to check limits and logic
      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        return this.sendJSON(res, 404, { error: "Group not found" });
      }

      // 3. Check duplicate
      // group.members is array of strings or ObjectIds? Model puts adminId (string usually).
      // Let's normalize comparison.
      const isMember = group.members.some(m => m.toString() === userId);
      if (isMember) {
        return this.sendJSON(res, 400, { error: "User is already a member" });
      }

      // 4. Check max members
      if (group.members.length >= 10) {
        return this.sendJSON(res, 400, { error: "Group is full (max 10 members)" });
      }

      // 5. Add Member
      await this.groupModel.addMember(groupId, userId);

      // 6. Update Status if needed
      // If it was inactive (1 member) and we added one, it becomes 2.
      if (group.members.length + 1 > 1 && group.status !== "Active") {
        await this.groupModel.updateStatus(groupId, "Active");
      }

      return this.sendJSON(res, 200, { message: "Member invited successfully" });
    } catch (error) {
      console.error("Invite member error:", error);
      return this.sendJSON(res, 500, { error: "Failed to invite member", details: error.message });
    }
  }

  /* ---------------- SEARCH GROUPS ---------------- */
  async searchGroups(req, res, userDecoded) {
    try {
      const filters = await this.getBody(req);
      const groups = await this.groupModel.searchGroups(filters);
      return this.sendJSON(res, 200, { groups });
    } catch (error) {
      console.error("Search groups error:", error);
      return this.sendJSON(res, 500, { error: "Failed to search groups", details: error.message });
    }
  }

  /* ---------------- JOIN GROUP ---------------- */
  async joinGroup(req, res, userDecoded) {
    try {
      const { groupId } = await this.getBody(req);
      const userId = userDecoded.id;

      if (!groupId) {
        return this.sendJSON(res, 400, { error: "groupId is required" });
      }

      // Find Group
      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        return this.sendJSON(res, 404, { error: "Group not found" });
      }

      // Check if already a member
      const isMember = group.members.some(m => m.toString() === userId);
      if (isMember) {
        return this.sendJSON(res, 400, { error: "User is already a member" });
      }

      // Check max members
      if (group.members.length >= group.maxMembers) {
        return this.sendJSON(res, 400, { error: "Group is full" });
      }

      // Add Member
      await this.groupModel.addMember(groupId, userId);

      // Update Status if needed
      if (group.members.length + 1 > 1 && group.status !== "Active") {
        await this.groupModel.updateStatus(groupId, "Active");
      }

      return this.sendJSON(res, 200, { message: "Successfully joined group" });
    } catch (error) {
      console.error("Join group error:", error);
      return this.sendJSON(res, 500, { error: "Failed to join group", details: error.message });
    }
  }
  async getUserGroups(req, res, userDecoded) {
    try {
      const userId = userDecoded.id;
      
      // Get groups where user is admin (created groups)
      const createdGroups = await this.groupModel.searchGroups({ admin: userId });
      
      // Get groups where user is a member (joined groups)
      const joinedGroups = await this.groupModel.searchGroups({ members: userId });
      
      // Filter out created groups from joined groups to avoid duplicates
      const filteredJoinedGroups = joinedGroups.filter(group => group.admin !== userId);
      
      return this.sendJSON(res, 200, {
        createdGroups,
        joinedGroups: filteredJoinedGroups
      });
    } catch (error) {
      console.error("Get user groups error:", error);
      return this.sendJSON(res, 500, { error: "Failed to get user groups", details: error.message });
    }
  }
  async getGroup(req, res, userDecoded) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const groupId = url.searchParams.get("groupId");

      if (!groupId) {
        return this.sendJSON(res, 400, { error: "groupId missing" });
      }

      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        return this.sendJSON(res, 404, { error: "Group not found" });
      }

      return this.sendJSON(res, 200, { group });
    } catch (error) {
      console.error("Get group error:", error);
      return this.sendJSON(res, 500, { error: "Failed to get group", details: error.message });
    }
  }
}

module.exports = GroupController;
