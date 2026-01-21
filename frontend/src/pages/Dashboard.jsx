import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/general.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profileActive, setProfileActive] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const handleDocumentClick = () => {
      setProfileActive(false);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  function menuClick(e) {
    e.stopPropagation();
    setProfileActive((prev) => !prev);
  }

  function profileClick(e) {
    e.stopPropagation();
  }

  function createClick() {
    navigate("/CreateGroup");
  }

  function toggleGroup(groupId) {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="welcome">Welcome, username!</div>
          <div className={`profile-area ${profileActive ? "active" : ""}`} onClick={profileClick}>
            <Link to="/myProfile" className="profile-link">
              <div className="dashboard-profile-avatar icon-avatar">
                <svg
                  className="dashboard-avatar-icon"
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

              <div className="profile-text">My Profile</div>
            </Link>

            <div className="menu-dropdown">
              <Link to="
              /dashboard" className="menu-item">
                <svg
                  className="header-link-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  <line x1="12" y1="12" x2="12" y2="2"></line>
                  <polyline points="10 4 12 2 14 4"></polyline>
                </svg>
                <span>Back to Homepage</span>
              </Link>
              <Link to="/" className="menu-item logout">
                <svg
                  className="header-link-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </Link>
            </div>
            <button className="menu-icon" aria-label="Menu" onClick={menuClick}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main className="page-wrap">
        <section className="hero-row">
          <div className="hero-card hero-search">
            <div className="hero-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="16.5" y1="16.5" x2="22" y2="22"></line>
              </svg>
            </div>
            <div className="hero-body">
              <h2>Search for Groups</h2>
              <p>
                Browse through existing study groups and find the perfect match for your academic needs. Filter by course,
                major, meeting time, and more to discover groups that align with your schedule.
              </p>
            </div>
          </div>

          <div className="hero-card hero-create">
            <div className="hero-icon circle-white">＋</div>
            <div className="hero-body">
              <h2>Create Your Own Group</h2>
              <p>
                Can't find a group that matches your needs? Start your own study group! Set your own schedule, invite
                classmates, and build the perfect study environment.
              </p>
              <button className="btn-create" type="button" onClick={createClick}>
                ＋ Create New Group
              </button>
            </div>
          </div>
        </section>

        <section className="search-panel" aria-label="Search for Study Groups">
          <h2 className="search-panel-title">Search for Study Groups</h2>
          <div className="search-bar">
            <div className="search-input">
              <div className="search-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b6f6c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="16.5" y1="16.5" x2="22" y2="22"></line>
                </svg>
              </div>
              <input type="search" placeholder="Search by group name or course…" aria-label="search groups" />
            </div>
          </div>

          <div className="filters">
            <div className="filters-title">Filter your groups</div>

            <div className="filters-grid">
              <div className="field">
                <label className="field-label">Course</label>
                <input className="pill-input" type="text" placeholder="Enter course name..." />
              </div>

              <div className="field">
                <label className="field-label">Major</label>
                <input className="pill-input" type="text" placeholder="Enter major..." />
              </div>

              <div className="field">
                <label className="field-label">Year</label>
                <select className="pill-select" defaultValue="All Years">
                  <option>All Years</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                  <option>Graduate</option>
                </select>
              </div>

              <div className="field">
                <label className="field-label">Meeting Time</label>
                <select className="pill-select" defaultValue="Any Time">
                  <option>Any Time</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>

            <div className="meeting-days-block">
              <div className="field-label">Meeting Days (select multiple)</div>
              <div className="days-row">
                <div className="day-chip">Mon</div>
                <div className="day-chip">Tue</div>
                <div className="day-chip">Wed</div>
                <div className="day-chip">Thu</div>
                <div className="day-chip">Fri</div>
                <div className="day-chip">Sat</div>
                <div className="day-chip">Sun</div>
              </div>
            </div>

            <div className="status-row">
              <div className="field-label">Group Status</div>
              <select className="pill-select status-select" defaultValue="All Status">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </section>

        <h3 className="groups-heading">Groups with High Ratings (4)</h3>

        <section className="groups-list">
          {[
            {
              id: "CS202",
              course: "CS 202",
              major: "Computer Science",
              time: "Afternoon",
              title: "Data Structures & Algorithms",
              members: "7/7",
              membersFull: true,
              days: "Tue, Thu",
              admin: "John Doe",
              type: "Online",
              status: "active",
              rating: 4.8,
              joinType: "full",
              description: "Intensive coding practice and theory discussions. We share code and resources.",
            },
            {
              id: "MATH301",
              course: "Math 301",
              major: "Mathematics",
              time: "Evening",
              title: "Advanced Calculus Study Group",
              members: "5/7",
              membersFull: false,
              days: "Mon, Wed, Fri",
              admin: "Sara Ahmed",
              type: "In-Person",
              status: "active",
              rating: 4.5,
              joinType: "join",
              description: "We focus on problem-solving and exam preparation. Group meets at the library.",
            },
            {
              id: "CHEM205",
              course: "Chem 205",
              major: "Chemistry",
              time: "Morning",
              title: "Organic Chemistry Lab Partners",
              members: "3/5",
              membersFull: false,
              days: "Mon, Wed",
              admin: "Marta Solomon",
              type: "In-Person",
              status: "active",
              rating: 4.2,
              joinType: "join",
              description: "Lab report collaboration and exam prep. Friendly and supportive environment.",
            },
            {
              id: "BUS301",
              course: "BUS 301",
              major: "Business",
              time: "Afternoon",
              title: "Business Statistics Group",
              members: "4/6",
              membersFull: false,
              days: "Wed, Fri",
              admin: "David Tesfaye",
              type: "Online",
              status: "inactive",
              rating: 3.9,
              joinType: "join",
              description: "Currently on break but accepting new members for next semester.",
            },
          ].map((group) => (
            <article key={group.id} className={`dashboard-group-card ${expandedGroups[group.id] ? "active" : ""}`}>
              <div className="card-header">
                <div className="card-header-content" onClick={() => toggleGroup(group.id)}>
                  <div className="card-left">
                    <div className="card-label">COURSE</div>
                    <div className="card-value">{group.course}</div>
                  </div>
                  <div className="card-mid">
                    <div className="card-label">MAJOR</div>
                    <div className="card-value">{group.major}</div>
                  </div>
                  <div className="card-right">
                    <div className="card-label">TIME</div>
                    <div className="card-value">{group.time}</div>
                  </div>
                </div>
                <span
                  className="card-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(group.id);
                  }}
                >
                  ▾
                </span>
              </div>
              <div className="card-expanded">
                <h4 className="group-title">{group.title}</h4>
                <div className="group-details">
                  <div className="details-left">
                    <div className="detail-item">
                      <span className="detail-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </span>
                      <span>
                        Members: {group.members} {group.membersFull && <span className="full-badge">(FULL)</span>}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </span>
                      <span>{group.days}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      </span>
                      <span>Admin: {group.admin}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                      <span>{group.type}</span>
                    </div>
                  </div>
                  <div className="details-right">
                    <div className={`status-badge ${group.status}`}>• {group.status === "active" ? "Active" : "Inactive"}</div>
                    <div className="rating">
                      <span className="rating-value">{group.rating}</span>
                      <span className="stars">{"★".repeat(Math.floor(group.rating)) + "☆".repeat(5 - Math.floor(group.rating))}</span>
                    </div>
                  </div>
                </div>
                <div className="group-description">{group.description}</div>
                <button
                  className={`group-btn ${group.joinType}`}
                  type="button"
                  onClick={() => {
                    if (group.joinType === "join") {
                      navigate(`/GroupPage/${group.id}`);
                    }
                  }}
                >
                  {group.joinType === "join" ? "Join Now" : "Group Full"}
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className="chatbot-container">
        <div className="chatbot-dot"></div>
        <button className="chatbot" aria-label="chatbot button" type="button" onClick={() => navigate("/AI")}>
          <svg className="chatbot-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="8" width="12" height="10" rx="1.5" fill="white" />
            <rect x="8.5" y="10" width="2" height="2" fill="#2F6B66" />
            <rect x="13.5" y="10" width="2" height="2" fill="#2F6B66" />
            <rect x="4" y="11" width="2" height="5" rx="0.5" fill="white" />
            <rect x="18" y="11" width="2" height="5" rx="0.5" fill="white" />
          </svg>
        </button>
      </div>
    </>
  );
}
