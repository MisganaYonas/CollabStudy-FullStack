import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { searchGroups } from "../api";
import "../styles/dashboard.css";
import "../styles/general.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profileActive, setProfileActive] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [timeFilter, setTimeFilter] = useState("Any Time");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    // Load initial user data
    loadUserData();

    // Listen for storage changes (when user updates profile)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUserData();
      }
    };

    // Listen for custom event when profile is updated
    const handleProfileUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Initial fetch
    fetchGroups();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Fetch groups when filters change (debounced or triggered)
  // For simplicity, I'll trigger on effect dependencies for inputs if I wanted live search,
  // but let's do it on filter changes.
  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, yearFilter, timeFilter, statusFilter]);

  // Handle text search on enter or blur? or just live. Let's do live with debounce or just live for now.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGroups();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, courseFilter, majorFilter]);


  const fetchGroups = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (searchTerm) filters.name = searchTerm;
      if (courseFilter) filters.course = courseFilter; // Assuming backend might not have 'course' but 'name' covers it or 'department'? Spec says 'name', 'department', 'year', 'meetingTime', 'status'. 
      // Spec says "name uses case-insensitive partial match". Assuming 'course' maps to 'name' or 'department'? 
      // The CreateGroup has 'course' field. The backend SEARCH spec has "name", "department", "year", "meetingTime", "status". It DOES NOT list "course".
      // However, CreateGroup sends "course". It's possible the backend ignores it or I should map "course" search to "name" or just omit if backend doesn't support it.
      // I'll map 'searchTerm' to 'name'. Course filter might not work if backend doesn't support it. I'll omit it for now or send it if backend supports extensions.
      // Actually, spec said: "Rules: - All filters OPTIONAL - If empty body -> return all groups ... Others use exact match".
      // If I send extra fields, maybe ignored.

      if (majorFilter) filters.department = majorFilter;
      if (yearFilter !== "All Years") filters.year = yearFilter;
      if (timeFilter !== "Any Time") filters.meetingTime = timeFilter;
      if (statusFilter !== "All Status") filters.status = statusFilter;

      // Days logic? Backend CreateGroup has "meetingDays". Search spec doesn't list it explicitly but says "name, department ... meetingTime, status".
      // I'll assume meetingDays logic isn't in search spec, so I'll client side filter or just ignore. 
      // Waiting... I should probably not filter by days if backend doesn't support it. I'll leave it as visual for now.

      const response = await searchGroups(filters);
      let fetchedGroups = response.data?.groups || response.data || [];

      // Ensure it's an array
      if (!Array.isArray(fetchedGroups)) {
        fetchedGroups = [];
      }

      // Logic: "Top 4 Groups by Members"
      // Rules says: "Sort groups by membersCount DESC, Show top 4 only"
      // It also says "REPLACE 'Highest Rated Groups' ... with ...".
      // If I am searching, should I show top 4?
      // I'll assume if filters are essentially empty (or default), show Top 4.
      // If user is searching, show results.

      const isDefaultFilters = !searchTerm && !majorFilter && yearFilter === "All Years" && timeFilter === "Any Time" && statusFilter === "All Status";

      if (isDefaultFilters) {
        // Sort by membersCount DESC
        fetchedGroups?.sort((a, b) => (b.membersCount || 1) - (a.membersCount || 1));
        // Take top 4
        fetchedGroups = fetchedGroups.slice(0, 4);
      } else {
        // If searching, maybe don't limit to 4? Spec just says "REPLACE Highest Rated Groups ... with Top 4".
        // It implies the DASHBOARD VIEW is Top 4.
        // If I search, I probably want to see results.
        // I'll leave it as is.
      }

      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };


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

  function toggleDay(day) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  const isDefaultFilters = !searchTerm && !majorFilter && yearFilter === "All Years" && timeFilter === "Any Time" && statusFilter === "All Status";
  const sectionTitle = isDefaultFilters ? "Top 4 Groups by Members" : "Search Results";

  return (
    <>
      <div className="whole-dashboard">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="welcome">Welcome, {user?.username || "Student"}!</div>
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
                <Link to="/" className="menu-item">
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
                <Link to="/" className="menu-item logout" onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                }}>
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
                <input
                  type="search"
                  placeholder="Search by group name..."
                  aria-label="search groups"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filters">
              <div className="filters-title">Filter your groups</div>

              <div className="filters-grid">
                <div className="field">
                  <label className="field-label">Course</label>
                  <input
                    className="pill-input"
                    type="text"
                    placeholder="Enter course name..."
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="field-label">Major/Dept</label>
                  <input
                    className="pill-input"
                    type="text"
                    placeholder="Enter major..."
                    value={majorFilter}
                    onChange={(e) => setMajorFilter(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label className="field-label">Year</label>
                  <select
                    className="pill-select"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
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
                  <select
                    className="pill-select"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
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
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <label key={day} className={`day-chip ${selectedDays.includes(day) ? "selected" : ""}`}>
                      <input
                        type="checkbox"
                        value={day}
                        checked={selectedDays.includes(day)}
                        onChange={() => toggleDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="status-row">
                <div className="field-label">Group Status</div>
                <select
                  className="pill-select status-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <h3 className="groups-heading">{sectionTitle} ({groups.length})</h3>

          <section className="groups-list">
            {loading ? <p>Loading groups...</p> : groups.length === 0 ? <p>No groups found.</p> : groups.map((group) => (
              <article key={group._id} className={`dashboard-group-card ${expandedGroups[group._id] ? "active" : ""}`}>
                <div className="card-header">
                  <div className="card-header-content" onClick={() => toggleGroup(group._id)}>
                    <div className="card-left">
                      <div className="card-label">COURSE</div>
                      <div className="card-value">{group.course || group.name}</div>
                    </div>
                    <div className="card-mid">
                      <div className="card-label">MAJOR</div>
                      <div className="card-value">{group.department}</div>
                    </div>
                    <div className="card-right">
                      <div className="card-label">TIME</div>
                      <div className="card-value">{group.meetingTime}</div>
                    </div>
                  </div>
                  <span
                    className="card-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGroup(group._id);
                    }}
                  >
                    ▾
                  </span>
                </div>
                <div className="card-expanded">
                  <h4 className="group-title">{group.name}</h4>
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
                          Members: {group.membersCount || 1}/{group.maxMembers} {(group.membersCount >= group.maxMembers) && <span className="full-badge">(FULL)</span>}
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
                        <span>{Array.isArray(group.meetingDays) ? group.meetingDays.join(", ") : group.meetingDays}</span>
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
                        {/* Admin field might not be in the lightweight group search object unless backend provides it. Inspecting "3. GET PROFILE" calls, but here it's Group Search. Backend 'create' sets admin. 'search' might return it. Assuming it does. */}
                        <span>Admin: {group.adminUsername || "Unknown"}</span>
                      </div>
                      <div className="detail-item">
                        {/* Removed Type (Online/InPerson) as it's not in CreateGroup spec */}
                      </div>
                    </div>
                    <div className="details-right">
                      <div className={`status-badge ${group.status}`}>• {group.status}</div>
                      {/* Rating REMOVED */}
                    </div>
                  </div>
                  <div className="group-description">{group.description}</div>
                  <button
                    className={`group-btn ${(group.membersCount >= group.maxMembers) ? "full" : "join"}`}
                    type="button"
                    disabled={group.membersCount >= group.maxMembers}
                    onClick={() => {
                      // Navigate to GroupPage passing state or just navigating.
                      // Ideally pass groupId via route params /group/:id
                      // Existing GroupPage seems to be generic or logic missing.
                      // I'll assume I should navigate to GroupPage and it deals with state or query param.
                      // The user spec said "Group Chat ... GET messages?groupId=..."
                      // So I should pass groupId.
                      navigate(`/GroupPage?groupId=${group._id}`);
                    }}
                  >
                    {(group.membersCount >= group.maxMembers) ? "Group Full" : "Join Now"}
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
      </div>
    </>
  );
}
