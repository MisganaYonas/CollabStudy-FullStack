import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/groupPage.css";
import "../styles/general.css";

export default function GroupPage() {
  const navigate = useNavigate();

  const headerRightRef = useRef(null);
  const groupSidebarRef = useRef(null);
  const groupIconRef = useRef(null);
  const groupNameRef = useRef(null);
  const messageInputRef = useRef(null);
  const messagesAreaRef = useRef(null);

  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  

  useEffect(() => { 
    if (messagesAreaRef.current) { 
      messagesAreaRef.current.scrollTop = 0;  
    } 
  }, []);

  /* ---------------- HEADER MENU ---------------- */

  const handleHamburgerClick = (e) => {
    e.stopPropagation();
    headerRightRef.current.classList.toggle("active");
  };

  const closeHeaderMenu = () => {
    headerRightRef.current.classList.remove("active");
  };

  /* ---------------- SIDEBAR ---------------- */

  const openSidebar = () => {
    groupSidebarRef.current.classList.add("active");
  };

  const closeSidebar = () => {
    groupSidebarRef.current.classList.remove("active");
  };

  /* ---------------- BACK / LEAVE ---------------- */

  const handleBackDashboard = () => {
    navigate("/dashboard");
  };

  const handleLeaveGroup = () => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      navigate("/dashboard");
    }
  };

  /* ---------------- MESSAGES ---------------- */

  const sendMessage = () => {
    const text = messageInputRef.current.value.trim();
    if (text === "") return;

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");

    msgDiv.innerHTML = `
      <div class="message-avatar">ME</div>
      <div class="message-content">
        <div class="message-sender">You</div>
        <div class="message-bubble"><p>${text}</p></div>
        <div class="message-time">${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}</div>
      </div>
    `;

    messagesAreaRef.current.appendChild(msgDiv);
    messagesAreaRef.current.scrollTop =
      messagesAreaRef.current.scrollHeight;
    messageInputRef.current.value = "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ---------------- STAR RATING ---------------- */

  const updateStars = (rating) => {
    setHoverRating(rating);
  };

  const selectRating = (rating) => {
    setCurrentRating(rating);
  };

  /* ---------------- OUTSIDE CLICKS ---------------- */

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        groupSidebarRef.current.classList.contains("active") &&
        !groupSidebarRef.current.contains(e.target) &&
        !groupIconRef.current.contains(e.target) &&
        !groupNameRef.current.contains(e.target)
      ) {
        groupSidebarRef.current.classList.remove("active");
      }

      if (
        headerRightRef.current &&
        !headerRightRef.current.contains(e.target)
      ) {
        headerRightRef.current.classList.remove("active");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
    <div className="whole-grouppage">
      <header className="grouppage-chat-header">
        <div className="grouppage-header-left">
          <div className="grouppage-group-icon" ref={groupIconRef} onClick={openSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="grouppage-group-info">
            <h1 className="grouppage-group-name" ref={groupNameRef} onClick={openSidebar}>
              Group Name
            </h1>
            <p className="course-code">Math 301</p>
          </div>
        </div>

        <div className="grouppage-header-right" ref={headerRightRef}>
          <button className="grouppage-hamburger-menu" aria-label="Menu" onClick={handleHamburgerClick}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="grouppage-menu-dropdown" onClick={(e) => e.stopPropagation()}>
            <button className="grouppage-menu-item" onClick={handleBackDashboard}>
              <svg
                className="grouppage-header-link-icon"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
                <line x1={12} y1={12} x2={12} y2={2} />
                <polyline points="10 4 12 2 14 4" />
              </svg>
              <span>Back to Dashboard</span>
            </button>

            <button className="grouppage-menu-item" id="leaveGroupBtn" onClick={handleLeaveGroup}>
              <svg
                className="grouppage-header-link-icon"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Leave Group</span>
            </button>
          </div>
        </div>
      </header>

      <main className="grouppage-chat-container">
        <div className="grouppage-messages-area" ref={messagesAreaRef}>
          <div className="grouppage-message">
            <div className="grouppage-message-avatar">
              <svg
                  className="grouppage-avatar-icon"
                  width={56}
                  height={56}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
            </div>
            <div className="grouppage-message-content">
              <div className="grouppage-message-sender">Sara Ahmed</div>
              <div className="grouppage-message-bubble">
                <p>Welcome to the group! Let's have a productive study session.</p>
              </div>
              <div className="grouppage-message-time">12:09 AM</div>
            </div>
          </div>

          <div className="grouppage-message">
            <div className="grouppage-message-avatar">
              <svg
                  className="grouppage-avatar-icon"
                  width={56}
                  height={56}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
            </div>
            <div className="grouppage-message-content">
              <div className="grouppage-message-sender">John Doe</div>
              <div className="grouppage-message-bubble">
                <p>Hey everyone! Ready for today's session?</p>
              </div>
              <div className="grouppage-message-time">12:39 AM</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="grouppage-chat-input-area">
        <div className="grouppage-input-container">
          <input
            type="text"
            className="grouppage-message-input"
            placeholder="Type a message..."
            ref={messageInputRef}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button className="grouppage-input-icon send-icon" aria-label="Send" onClick={sendMessage}>
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </footer>

      <div className="grouppage-chatbot-container">
        <div className="grouppage-chatbot-dot"></div>
        <button className="grouppage-chatbot" aria-label="chatbot button" type="button" onClick={() => navigate("/AI")}>
          <svg className="grouppage-chatbot-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="8" width="12" height="10" rx="1.5" fill="white" />
            <rect x="8.5" y="10" width="2" height="2" fill="#2F6B66" />
            <rect x="13.5" y="10" width="2" height="2" fill="#2F6B66" />
            <rect x="4" y="11" width="2" height="5" rx="0.5" fill="white" />
            <rect x="18" y="11" width="2" height="5" rx="0.5" fill="white" />
          </svg>
        </button>
      </div>

      <aside className="grouppage-group-sidebar" id="groupSidebar" ref={groupSidebarRef}>
        <div className="grouppage-sidebar-header">
          <h2>Group Details</h2>
          <button className="grouppage-close-sidebar" onClick={closeSidebar}>&times;</button>
        </div>

        <div className="grouppage-sidebar-section">
          <h3>Members</h3>
          <div className="grouppage-member-list">
            <div className="grouppage-member">
              <div className="grouppage-member-avatar">
                <svg
                  className="grouppage-avatar-icon"
                  width={56}
                  height={56}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
              </div>
              <div className="grouppage-member-info">
                <p className="grouppage-member-name">Marta Solomon</p>
                <p className="grouppage-member-course">Mathematics</p>
              </div>
            </div>
            <div className="grouppage-member">
              <div className="grouppage-member-avatar">
                <svg
                  className="grouppage-avatar-icon"
                  width={56}
                  height={56}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" />
                </svg>
              </div>
              <div className="grouppage-member-info">
                <p className="grouppage-member-name">Jerry</p>
                <p className="grouppage-member-course">Computer Science</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grouppage-sidebar-section">
          <h3>Group Details</h3>
          <p><strong>Status:</strong> <span className="grouppage-status active">Active</span></p>
          <p><strong>Members:</strong> 4/7</p>
          <p><strong>Time:</strong> Evening</p>
          <p><strong>Days:</strong> Mon, Wed, Fri</p>
          <p><strong>Mode:</strong> In-Person</p>
          <p><strong>Admin:</strong> Sara Ahmed</p>
          <hr/>
          <p>We focus on problem-solving and exam preparation. Group meets at the library.</p>
        </div>

        <div className="grouppage-sidebar-section">
          <h3>Rate Your Group</h3>

          <div className="grouppage-star-rating">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`grouppage-star ${(hoverRating || currentRating) >= num ? "filled" : ""}`}
                onClick={() => selectRating(num)}
                onMouseOver={() => updateStars(num)}
                onMouseOut={() => updateStars(0)}
              >
                ★
              </span>
            ))}
          </div>

          <p className="grouppage-rating-text">
            You rated this group <strong>{currentRating}</strong> stars
          </p>
        </div>
      </aside>
      </div>
    </>
  );
}
