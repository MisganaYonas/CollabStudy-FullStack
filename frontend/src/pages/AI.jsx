import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sendAIChat } from "../api";
import "../styles/ai.css";
import "../styles/general.css";

export default function AIChat() {
  const inputFieldRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser)._id);
    }
  }, []);

  function scrollToBottom() {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function addMessage(text, sender = "user") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("aipage-message-box");
    if (sender === "ai") msgDiv.classList.add("aipage-ai-message");
    msgDiv.textContent = text;

    const timestamp = document.createElement("div");
    timestamp.classList.add("aipage-timestamp");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    timestamp.textContent = `${hours}:${minutes}`;
    msgDiv.appendChild(timestamp);

    const spacer = chatContainerRef.current.querySelector(".aipage-spacer");
    chatContainerRef.current.insertBefore(msgDiv, spacer);
    scrollToBottom();
  }

  async function sendMessage() {
    const text = inputFieldRef.current.value.trim();
    if (!text) return;

    if (!userId) {
      alert("Please login first.");
      return;
    }

    addMessage(text, "user");
    inputFieldRef.current.value = "";

    try {
      const response = await sendAIChat({ userId, prompt: text });
      // Assuming response is { response: "AI text" } or similar.
      // Spec doesn't define output format.
      // But usually it returns a message.
      const aiResponse = response.data.reply || response.data.response || response.data.message || JSON.stringify(response.data);
      addMessage(aiResponse, "ai");
    } catch (err) {
      console.error("AI chat error", err);
      addMessage("Sorry, I couldn't reach the server.", "ai");
    }
  }

  useEffect(() => {
    const inputField = inputFieldRef.current;

    function handleKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    }

    inputField.addEventListener("keydown", handleKeyDown);
    return () => inputField.removeEventListener("keydown", handleKeyDown);
  }, [userId]); // Re-bind if user changes, though unlikely on this page without reload

  return (
    <div className="aipage-full">
      <div className="aipage-chat-container" ref={chatContainerRef}>
        <div className="aipage-header">
          <div className="aipage-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="aipage-icon"
              style={{ color: "rgb(255, 255, 255)" }}
            >
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          </div>

          <div>
            <div className="aipage-title">AI Study Assistant</div>
            <div className="aipage-status">Online</div>
          </div>

          <Link to="/Dashboard">
            <div className="aipage-close-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </Link>
        </div>

        <div className="aipage-message-box">
          Hello! I'm your AI study assistant. I can help you with study tips, group recommendations, course
          information, and more. How can I assist you today?
          <div className="aipage-timestamp">01:33 PM</div>
        </div>

        <div className="aipage-spacer"></div>
        <div className="aipage-input-area">
          <input
            className="aipage-input-field"
            type="text"
            placeholder="Ask me anything..."
            ref={inputFieldRef}
          />
          <div className="aipage-send-btn" onClick={sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="aipage-svg"
            >
              <path
                d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z">
              </path>
              <path d="m21.854 2.147-10.94 10.939"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
