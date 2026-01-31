const { ObjectId } = require("mongodb");

class AIController {
  constructor(db) {
    this.users = db.collection("users");
    this.aiConversations = db.collection("ai_conversations");
  }

  async chat(req, res) {
    try {
      const body = await this.getBody(req);
      const { userId, message } = body;

      if (!userId || !message) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "userId and message are required" })
        );
      }

      // Validate User Exists
      const user = await this.users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "User not found" }));
      }

      /* ---------------- OPENAI INTEGRATION ---------------- */
      let reply = "I'm not sure about that. Please ask a CollabStudy-related question.";

      if (process.env.OPENAI_API_KEY) {
        try {
          const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: message }]
            })
          });

          const data = await openAIResponse.json();
          if (data.choices && data.choices.length > 0) {
            reply = data.choices[0].message.content;
          }
        } catch (openaiErr) {
          console.error("OpenAI API error:", openaiErr);
          reply = "AI service temporarily unavailable.";
        }
      } else {
        console.warn("OPENAI_API_KEY not found, using fallback.");
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
