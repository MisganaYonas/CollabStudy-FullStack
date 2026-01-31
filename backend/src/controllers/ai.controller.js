const { ObjectId } = require("mongodb");

class AIController {
  constructor(db) {
    this.users = db.collection("users");
    this.aiConversations = db.collection("ai_conversations");
  }

  async chat(req, res, userDecoded) {
    try {
      const body = await this.getBody(req);
      console.log("AI chat received body:", body);
      console.log("User decoded:", userDecoded);
      
      const { message } = body;
      const userId = userDecoded.id; // Get userId from JWT token

      console.log("Extracted message:", message);
      console.log("User ID:", userId);

      if (!message) {
        console.log("No message provided");
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "message is required" })
        );
      }

      // Validate User Exists
      const user = await this.users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      /* ---------------- MOCK AI RESPONSES ---------------- */
      const mockResponses = {
        "how do i create a group": "To create a group, go to the Dashboard and click 'Create New Group'. Fill in the group name, department, year, meeting time, and days. You'll automatically become the group admin.",
        "How do I create a group?": "To create a group, go to the Dashboard and click 'Create New Group'. Fill in the group name, department, year, meeting time, and days. You'll automatically become the group admin.",
        "how to join a group?": "Browse groups on the Dashboard, then click 'Join Now' on any group that interests you. You'll automatically be added as a member and can start chatting.",
        "How to join a group?": "Browse groups on the Dashboard, then click 'Join Now' on any group that interests you. You'll automatically be added as a member and can start chatting.",
        "how do i invite members?": "As a group admin, you can invite members by email using the invite feature in your group settings.",
        "How do I invite members?": "As a group admin, you can invite members by email using the invite feature in your group settings.",
        "what is collabstudy?": "CollabStudy is a platform for AAU students to form study groups, collaborate on coursework, and get AI assistance with their studies.",
        "What is CollabStudy?": "CollabStudy is a platform for AAU students to form study groups, collaborate on coursework, and get AI assistance with their studies.",
        "how to send messages?": "Once you join a group, click on it to enter the group chat. Type your message and press Enter or click the send button.",
        "How to send messages?": "Once you join a group, click on it to enter the group chat. Type your message and press Enter or click the send button.",
        "how to edit my profile?": "Go to 'My Profile' from the dashboard menu. You can edit your username, email, department, year, and bio.",
        "How to edit my profile?": "Go to 'My Profile' from the dashboard menu. You can edit your username, email, department, year, and bio.",
        "what departments are supported?": "CollabStudy supports all AAU departments. Just enter your department when creating your profile or group.",
        "What departments are supported?": "CollabStudy supports all AAU departments. Just enter your department when creating your profile or group.",
        "how to search for groups?": "Use the search filters on the Dashboard to find groups by name, department, year, meeting time, or status.",
        "How to search for groups?": "Use the search filters on the Dashboard to find groups by name, department, year, meeting time, or status.",
        "what are meeting times?": "Groups can meet in the Morning (8-10 AM), Afternoon (2-5 PM), or Evening (5-9 PM).",
        "What are meeting times?": "Groups can meet in the Morning (8-10 AM), Afternoon (2-5 PM), or Evening (5-9 PM).",
        "how many members per group?": "Groups can have between 2-10 members. The group creator sets the maximum number.",
        "How many members per group?": "Groups can have between 2-10 members. The group creator sets the maximum number.",
        "what is group status?": "Groups are 'Inactive' with 1 member and become 'Active' with 2+ members.",
        "What is group status?": "Groups are 'Inactive' with 1 member and become 'Active' with 2+ members.",
        "how to delete my account?": "Go to your profile settings and use the delete account option. This will permanently remove your account.",
        "How to delete my account?": "Go to your profile settings and use the delete account option. This will permanently remove your account.",
        "what email format is required?": "You must use your AAU email address ending with @aau.edu.et to sign up.",
        "What email format is required?": "You must use your AAU email address ending with @aau.edu.et to sign up.",
        "how to change password?": "Currently, password changes are not available. Contact support if you need to reset your password.",
        "How to change password?": "Currently, password changes are not available. Contact support if you need to reset your password.",
        "what are meeting days?": "You can select any combination of days: Monday through Sunday for your group meetings.",
        "What are meeting days?": "You can select any combination of days: Monday through Sunday for your group meetings.",
        "how to leave a group?": "Group leaving functionality is not currently available. Contact the group admin if needed.",
        "How to leave a group?": "Group leaving functionality is not currently available. Contact the group admin if needed.",
        "what is the ai assistant?": "I'm your AI study assistant! I can help answer questions about using CollabStudy and provide study tips.",
        "What is the AI assistant?": "I'm your AI study assistant! I can help answer questions about using CollabStudy and provide study tips.",
        "how to become group admin?": "The person who creates a group automatically becomes the admin. Admins can invite members and manage the group.",
        "How to become group admin?": "The person who creates a group automatically becomes the admin. Admins can invite members and manage the group.",
        "what happens when group is full?": "When a group reaches its maximum members, it shows as 'Group Full' and no new members can join.",
        "What happens when group is full?": "When a group reaches its maximum members, it shows as 'Group Full' and no new members can join.",
        "how to find study partners?": "Use the group search feature to find groups in your department and year, or create your own group to attract study partners.",
        "How to find study partners?": "Use the group search feature to find groups in your department and year, or create your own group to attract study partners."
      };

      // Find matching response
      const userMessage = message.toLowerCase().trim();
      let reply = "I'm not sure about that. Please ask a CollabStudy-related question like 'How do I create a group?' or 'How to join a group?'";
      
      for (const [key, response] of Object.entries(mockResponses)) {
        if (userMessage.includes(key) || key.includes(userMessage)) {
          reply = response;
          break;
        }
      }
      
      // Check for common greetings
      if (userMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)$/)) {
        reply = "Hello! I'm your CollabStudy AI assistant. I can help you with questions about creating groups, joining groups, messaging, and using the platform. What would you like to know?";
      }

      // Store in DB
      await this.aiConversations.insertOne({
        userId,
        prompt: message,
        response: reply,
        createdAt: new Date()
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ reply }));
    } catch (err) {
      console.error("AI service error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "AI service error" }));
    }
  }

  getBody(req) {
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
}

module.exports = AIController;
