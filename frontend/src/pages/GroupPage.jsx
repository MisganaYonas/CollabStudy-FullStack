import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getGroupMessages, sendGroupMessage, searchGroups, joinGroup } from "../api";
import "../styles/groupPage.css";
import "../styles/general.css";

export default function GroupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  const headerRightRef = useRef(null);
  const groupSidebarRef = useRef(null);
  const groupIconRef = useRef(null);
  const groupNameRef = useRef(null);
  const messageInputRef = useRef(null);
  const messagesAreaRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (groupId) {
      joinGroupAutomatically();
      fetchMessages();
      fetchGroupInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const joinGroupAutomatically = async () => {
    try {
      await joinGroup(groupId);
      console.log("Successfully joined group");
    } catch (err) {
      // Ignore error if already a member
      if (err.response?.status !== 400) {
        console.error("Failed to join group:", err);
      }
    }
  };

  const fetchGroupInfo = async () => {
    try {
      // Inefficient fetch all to find one because no getById endpoint specified
      const res = await searchGroups({});
      const groups = res.data?.groups || res.data || [];
      const found = Array.isArray(groups) ? groups.find(g => g._id === groupId || g.id === groupId) : null;
      if (found) setGroupDetails(found);
    } catch (err) {
      console.error("Failed to load group info", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await getGroupMessages(groupId);
      // Ensure messages is always an array
      const messagesData = res.data?.messages || res.data || [];
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]); // Set empty array on error
    }
  };

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
    // Backend Logic: No "Leave Group" endpoint specified.
    // "Frontend must match backend exactly".
    // "5. DELETE ACCOUNT" deletes memberships.
    // But generic leave? Not listed.
    // So I will disable this or make it just navigate away.
    alert("Leave group functionality not available in this version.");
    navigate("/dashboard");
  };

  /* ---------------- MESSAGES ---------------- */

  const sendMessage = async () => {
    const text = messageInputRef.current.value.trim();
    if (text === "") return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      await sendGroupMessage({
        groupId,
        message: text
        // senderId will be extracted from JWT token on backend
      });
      messageInputRef.current.value = "";
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Failed to send message.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
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
                {groupDetails ? groupDetails.name : "Loading..."}
              </h1>
              <p className="course-code">{groupDetails ? groupDetails.course : ""}</p>
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

              {/* LEAVE GROUP REMOVED/DISABLED as per spec */}
            </div>
          </div>
        </header>

        <main className="grouppage-chat-container">
          <div className="grouppage-messages-area" ref={messagesAreaRef}>
            {messages.length === 0 ? <p style={{ textAlign: "center", marginTop: "20px" }}>No messages yet.</p> : messages.map((msg, index) => (
              <div key={index} className="grouppage-message">
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
                  <div className="grouppage-message-sender">{msg.senderName}</div>
                  {/* Note: Logic to resolve senderId to name requires a user list or lookup, but backend message just returns what's stored. Spec doesn't clarify return type. Assuming simple storage. */}
                  <div className="grouppage-message-bubble">
                    <p>{msg.message}</p>
                  </div>
                  <div className="grouppage-message-time">{new Date(msg.timestamp || Date.now()).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
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
            <h3>Members (Placeholder)</h3>
            {/* If groupDetails.members exists (and is populated), we could list them. 
               The search endpoint returns what? 
               Usually lightweight. 
               We probably can't see members list here unless backend provides it.
           */}
            <p>Only admin sees full list (if implemented).</p>
          </div>

          {groupDetails && (
            <div className="grouppage-sidebar-section">
              <h3>Group Details</h3>
              <p><strong>Status:</strong> <span className={`grouppage-status ${groupDetails.status}`}>{groupDetails.status}</span></p>
              <p><strong>Members:</strong> {groupDetails.membersCount}/{groupDetails.maxMembers}</p>
              <p><strong>Time:</strong> {groupDetails.meetingTime}</p>
              <p><strong>Days:</strong> {Array.isArray(groupDetails.meetingDays) ? groupDetails.meetingDays.join(", ") : groupDetails.meetingDays}</p>
              <p><strong>Admin:</strong> {groupDetails.admin?.username || "Unknown"}</p>
              <hr />
              <p>{groupDetails.description}</p>
            </div>
          )}

          {/* Rating Section REMOVED */}

        </aside>
      </div>
    </>
  );
}
