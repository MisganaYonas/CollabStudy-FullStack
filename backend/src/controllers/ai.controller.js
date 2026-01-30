// src/controller/ai.controller.js
const fetch = require("node-fetch"); // Optional if Node < 18
require("dotenv").config();

class AIController {
  constructor(db) {
    this.db = db; // in case you want to log user messages
  }

  async chat(req, res) {
    try {
      const body = await this.getBody(req);
      const { message, userId } = body;

      if (!message || !userId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Missing message or userId" }));
      }

      // Call OpenAI API
      const aiResponse = await this.getAIResponse(message);

      // Optional: save the chat message in DB
      // await this.db.collection("ai_chats").insertOne({ userId, message, aiResponse, createdAt: new Date() });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ aiResponse }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "AI chat failed" }));
    }
  }

  async getAIResponse(userMessage) {
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
    return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
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
