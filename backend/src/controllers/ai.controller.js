// src/controllers/ai.controller.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const fetch = require("node-fetch");

class AIController {
  constructor(db) {
    this.db = db;
  }

  async chat(req, res) {
    try {
      const body = await this.getBody(req);
      const { message, userId } = body;

      if (!message || !userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "message and userId are required" })
        );
      }

      const aiResponse = await this.getAIResponse(message);

      // (Optional) Save chat to DB later
      // await this.db.collection("ai_chats").insertOne({
      //   userId,
      //   message,
      //   aiResponse,
      //   createdAt: new Date(),
      // });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ reply: aiResponse }));
    } catch (err) {
      console.error("AI Controller Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "AI chat failed" }));
    }
  }

  async getAIResponse(userMessage) {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY is missing.");
      return "Error: AI service is not configured.";
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
          max_tokens: 150,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("OpenAI API Error:", data);
        return "I encountered an error with the AI service.";
      }

      return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
    } catch (error) {
      console.error("Fetch Error:", error);
      return "I encountered a technical issue.";
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
