// src/controllers/user.controller.js
const { ObjectId } = require("mongodb");
const authMiddleware = require("../utils/authMiddleware");

class UserController {
  constructor(db) {
    this.usersCallback = db.collection("users");
    this.groupsCallback = db.collection("groups");
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

  /* ---------------- DELETE ACCOUNT ---------------- */
  async deleteAccount(req, res) {
    try {
      const user = authMiddleware(req, res);
      if (!user) return; // Response handled by middleware

      const userId = user.id; // String from token

      // 1. Delete User
      const deleteUserResult = await this.usersCallback.deleteOne({ _id: new ObjectId(userId) });
      if (deleteUserResult.deletedCount === 0) {
        return this.sendJSON(res, 404, { error: "User not found" });
      }

      // 2. Delete groups created by this user
      await this.groupsCallback.deleteMany({ admin: userId });

      // 3. Remove user from all groups members array
      await this.groupsCallback.updateMany(
        {},
        { $pull: { members: userId } }
      );

      return this.sendJSON(res, 200, { message: "Account and related data deleted successfully" });
    } catch (error) {
      console.error("Delete account error:", error);
      return this.sendJSON(res, 500, { error: "Failed to delete account", details: error.message });
    }
  }

  /* ---------------- FORGET PASSWORD ---------------- */
  async forgetPassword(req, res) {
    try {
      const { email } = await this.getBody(req);

      if (!email) {
        return this.sendJSON(res, 400, { error: "Email is required" });
      }

      const user = await this.usersCallback.findOne({ email });
      if (!user) {
        return this.sendJSON(res, 404, { error: "User with this email not found" });
      }

      // Generate 6-digit code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

      // Save to DB
      await this.usersCallback.updateOne(
        { _id: user._id },
        { $set: { resetCode, resetCodeExpires } }
      );

      // Log to console (Simulation)
      console.log(`[Forget Password] Reset code for ${email}: ${resetCode}`);

      return this.sendJSON(res, 200, { message: "Reset code sent to email" });
    } catch (error) {
      console.error("Forget password error:", error);
      return this.sendJSON(res, 500, { error: "Failed to process request", details: error.message });
    }
  }
}

module.exports = UserController;
