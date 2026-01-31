// src/controllers/group.controller.js
const { ObjectId } = require("mongodb");

class GroupController {
  constructor(groupModel, db) {
    this.groupModel = groupModel;
    this.usersCollection = db.collection("users");
  }

  /* ---------------- HELPERS ---------------- */
  getBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          console.log("GroupController.getBody - Raw body:", body);
          console.log("GroupController.getBody - Parsed:", parsed);
          resolve(parsed);
        } catch (err) {
          console.error("GroupController.getBody - Parse error:", err);
          console.error("GroupController.getBody - Raw body:", body);
          resolve({});
        }
      });
      req.on("error", (err) => {
        console.error("GroupController.getBody - Request error:", err);
        resolve({});
      });
    });
  }

  sendJSON(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  /* ---------------- CREATE GROUP ---------------- */
  async createGroup(req, res, user) {
    try {
      const body = await this.getBody(req);
      const {
        name, department, year, meetingTime, meetingDays,
        maxMembers // Renamed membersCount to maxMembers for clarity
      } = body;

      // Get adminId from authenticated user (ensure it's a string)
      console.log("Create group - Authenticated user object:", JSON.stringify(user));
      const adminId = user.id?.toString() || user._id?.toString() || user.id;
      console.log("Create group - Extracted adminId:", adminId);

      // Log received data for debugging
      console.log("Create group - Received body:", JSON.stringify(body));
      console.log("Create group - Parsed data:", { name, department, year, meetingTime, meetingDays, maxMembers, adminId });
      console.log("Create group - Data types:", { 
        name: typeof name, 
        department: typeof department, 
        year: typeof year, 
        meetingTime: typeof meetingTime, 
        meetingDays: Array.isArray(meetingDays) ? 'array' : typeof meetingDays,
        meetingDaysLength: Array.isArray(meetingDays) ? meetingDays.length : 'N/A'
      });

      // Validate required fields. Initial membersCount is fixed at 1 (adminId).
      const missingFields = [];
      if (!name || (typeof name === 'string' && name.trim() === '')) {
        missingFields.push("name");
        console.log("❌ Missing name - value:", name, "type:", typeof name);
      }
      if (!adminId) {
        missingFields.push("adminId");
        console.log("❌ Missing adminId - user object:", JSON.stringify(user));
      }
      if (!department || (typeof department === 'string' && department.trim() === '')) {
        missingFields.push("department");
        console.log("❌ Missing department - value:", department, "type:", typeof department);
      }
      if (!year || (typeof year === 'string' && year.trim() === '')) {
        missingFields.push("year");
        console.log("❌ Missing year - value:", year, "type:", typeof year);
      }
      if (!meetingTime || (typeof meetingTime === 'string' && meetingTime.trim() === '')) {
        missingFields.push("meetingTime");
        console.log("❌ Missing meetingTime - value:", meetingTime, "type:", typeof meetingTime);
      }
      if (!meetingDays || !Array.isArray(meetingDays) || meetingDays.length === 0) {
        missingFields.push("meetingDays");
        console.log("❌ Missing meetingDays - value:", meetingDays, "isArray:", Array.isArray(meetingDays), "length:", meetingDays?.length);
      }

      if (missingFields.length > 0) {
        console.error("❌ Missing required fields:", missingFields);
        console.error("Full validation context:", {
          name: name || "MISSING",
          adminId: adminId || "MISSING",
          department: department || "MISSING",
          year: year || "MISSING",
          meetingTime: meetingTime || "MISSING",
          meetingDays: meetingDays || "MISSING"
        });
        return this.sendJSON(res, 400, { 
          error: "Missing required fields", 
          missingFields: missingFields 
        });
      }
      
      console.log("✅ All fields validated successfully!");

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
  async inviteMember(req, res, authenticatedUser) {
    try {
      const { groupId, email } = await this.getBody(req);

      if (!groupId || !email) {
        return this.sendJSON(res, 400, { error: "groupId and email are required" });
      }

      // 1. Find User by Email
      const invitedUser = await this.usersCollection.findOne({ email });
      if (!invitedUser) {
        return this.sendJSON(res, 404, { error: "User with this email not found" });
      }
      const userId = invitedUser._id.toString();

      // 2. Find Group to check limits and logic
      const group = await this.groupModel.getGroupById(groupId);
      if (!group) {
        return this.sendJSON(res, 404, { error: "Group not found" });
      }

      // 3. Verify that the authenticated user is the admin of the group
      if (group.admin !== authenticatedUser.id && group.admin !== authenticatedUser.id.toString()) {
        return this.sendJSON(res, 403, { error: "Only the group admin can invite members" });
      }

      // 4. Check duplicate
      // group.members is array of strings or ObjectIds? Model puts adminId (string usually).
      // Let's normalize comparison.
      const isMember = group.members.some(m => m.toString() === userId);
      if (isMember) {
        return this.sendJSON(res, 400, { error: "User is already a member" });
      }

      // 5. Check max members
      if (group.members.length >= 10) {
        return this.sendJSON(res, 400, { error: "Group is full (max 10 members)" });
      }

      // 6. Add Member
      await this.groupModel.addMember(groupId, userId);

      // 7. Update Status if needed
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
  async searchGroups(req, res) {
    try {
      const filters = await this.getBody(req);
      const groups = await this.groupModel.searchGroups(filters);
      return this.sendJSON(res, 200, { groups });
    } catch (error) {
      console.error("Search groups error:", error);
      return this.sendJSON(res, 500, { error: "Failed to search groups", details: error.message });
    }
  }

  /* ---------------- GET GROUP ---------------- */
  async getGroup(req, res) {
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
