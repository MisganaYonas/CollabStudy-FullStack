const { ObjectId } = require("mongodb");

class AIController {
  constructor(db) {
    this.users = db.collection("users");
    this.aiConversations = db.collection("ai_conversations");
  }

  async chat(req, res, authenticatedUser) {
    try {
      const body = await this.getBody(req);
      const { message, prompt } = body; // Accept both 'message' and 'prompt' for compatibility

      const userMessage = message || prompt;
      if (!userMessage) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "message is required" })
        );
      }

      // Get userId from authenticated user
      const userId = authenticatedUser.id;

      // Validate User Exists
      const user = await this.users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      /* ---------------- MOCK QUESTIONS & ANSWERS ---------------- */
      const QA = {
        "How do I create a group?":
          "To create a group, go to Groups and click on 'Create Group'. Enter a name and add members.",

        "How can I create a group?":
          "You can create a group by clicking the 'Create Group' button and adding members.",

        "I want to make a group":
          "To make a group, open the Groups section and choose 'Create Group'.",

        "How do I add members to a group?":
          "Open your group, click 'Add Member', and select the user you want to add.",

        "How can I invite someone to my group?":
          "Go to the group and use the 'Add Member' option to invite users.",

        "How do I remove a member?":
          "Open the group, select the member, and click 'Remove Member'.",

        "How do I send a message?":
          "Open the group chat, type your message, and press send.",

        "How do I see messages?":
          "You can see messages inside the group chat.",

        "Can I see old messages?":
          "Yes, all previous messages are saved in the group chat.",

        "What is CollabStudy?":
          "CollabStudy is a platform for students to create groups, chat, and collaborate.",

        "How do I join a group?":
          "You can join a group by clicking the 'Join Group' button.",

        "Can I leave a group?":
          "Yes, open the group and click 'Leave Group'.",

        "How do I delete a group?":
          "Only the group admin can delete a group from group settings.",

        "Can I search for groups?":
          "Yes, use the search feature to find groups by name.",

        "How do I sign up?":
          "Sign up using your institutional email and name.",

        "How do I log in?":
          "Enter your email and password on the login page.",

        "Can I change my name?":
          "Yes, you can change your name in profile settings.",

        "Is private chat available?":
          "Currently, only group chat is supported.",

        "Can I add multiple members at once?":
          "Yes, you can add multiple members when creating or editing a group.",

        "Can I use emojis in chat?":
          "No, emojis are not supported in chat messages."
      };

      /* ---------------- EXACT MATCH ONLY ---------------- */
      const reply =
        QA[userMessage] ||
        "I'm not sure about that. Please ask a CollabStudy-related question.";

      // Store in DB
      await this.aiConversations.insertOne({
        userId,
        prompt: userMessage,
        response: reply,
        createdAt: new Date()
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ reply }));
    } catch (err) {
      console.error("Mock AI error:", err);
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
