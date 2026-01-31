# 📋 Code Snippets to Show - Exact Locations

## Quick Reference: Which Code to Show When

---

## SECTION 2: USER SIGNUP (2 minutes)

### 2.1 Frontend Form - useState
**File:** `frontend/src/pages/Signup.jsx`  
**Lines:** 10-15  
**What to show:**
```javascript
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [department, setDepartment] = useState("");
const [year, setYear] = useState("");
```
**Say:** "These useState hooks manage form input state."

---

### 2.2 Frontend Form - Form Submission
**File:** `frontend/src/pages/Signup.jsx`  
**Lines:** 29-58  
**What to show:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // ... validation code ...

  const payload = { username, email, password, confirmPassword, department, year };

  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    // ... handle response ...
  } catch (err) {
    // ... error handling ...
  }
};
```
**Say:** "Form submission handler that sends POST request with JSON payload."

---

### 2.3 Backend - Server Setup
**File:** `backend/src/app.js`  
**Lines:** 55-70  
**What to show:**
```javascript
const server = http.createServer(async (req, res) => {
  /* --- CORS --- */
  if (enableCORS(req, res)) return;

  if (!dbInstance) {
    return sendJSON(res, 503, { error: "Database not ready" });
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
```
**Say:** "Custom HTTP server setup and URL parsing."

---

### 2.4 Backend - Manual Routing
**File:** `backend/src/app.js`  
**Lines:** 72-73  
**What to show:**
```javascript
/* ---------------- SIGNUP ---------------- */
if (req.method === "POST" && pathname === "/api/signup") {
```
**Say:** "Manual routing with if statement checking method and pathname."

---

### 2.5 Backend - Request Body Parsing
**File:** `backend/src/app.js`  
**Lines:** 28-39  
**What to show:**
```javascript
function getBody(req) {
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
```
**Say:** "Manual request body parsing using Node.js streams."

---

### 2.6 Backend - Signup Handler
**File:** `backend/src/app.js`  
**Lines:** 75-133  
**What to show (key parts):**
```javascript
const {
  username,
  email,
  password,
  confirmPassword,
  department,
  year
} = await getBody(req);

// Validation
if (!username || !email || !password || !confirmPassword || !department || !year) {
  return sendJSON(res, 400, { error: "All fields are required" });
}

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Save to database
const users = dbInstance.collection("users");
await users.insertOne({
  username, email, password: hashedPassword, department, year,
  createdAt: new Date()
});

return sendJSON(res, 201, { message: "Signup successful" });
```
**Say:** "Complete signup handler: parse body, validate, hash password, save to DB, respond."

---

## SECTION 3: REACT DEEP DIVE (2 minutes)

### 3.1 useState Hook
**File:** `frontend/src/pages/Dashboard.jsx`  
**Lines:** 12-13  
**What to show:**
```javascript
const [groups, setGroups] = useState([]);
const [loading, setLoading] = useState(true);
```
**Say:** "useState manages component state - returns value and setter function."

---

### 3.2 useEffect Hook
**File:** `frontend/src/pages/Dashboard.jsx`  
**Lines:** 24-32  
**What to show:**
```javascript
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  // Initial fetch
  fetchGroups();
}, []);
```
**Say:** "useEffect runs after component mounts - empty array means run once."

---

### 3.3 Data Fetching Function
**File:** `frontend/src/pages/Dashboard.jsx`  
**Lines:** 52-105  
**What to show:**
```javascript
const fetchGroups = async () => {
  setLoading(true);
  try {
    const filters = {};
    if (searchTerm) filters.name = searchTerm;
    if (majorFilter) filters.department = majorFilter;
    // ... more filters ...

    const response = await searchGroups(filters);
    let fetchedGroups = response.data?.groups || response.data || [];

    setGroups(fetchedGroups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    setGroups([]); // Set empty array on error to prevent UI crash
  } finally {
    setLoading(false);
  }
};
```
**Say:** "Async function that fetches data, updates state, handles errors."

---

### 3.4 Dynamic Rendering with map()
**File:** `frontend/src/pages/Dashboard.jsx`  
**Lines:** 390-420  
**What to show:**
```javascript
{groups.map((group) => {
  if (!group || !group._id) return null;
  return (
    <article key={group._id} className={`dashboard-group-card ${expandedGroups[group._id] ? "active" : ""}`}>
      <div className="card-header">
        <div className="card-left">
          <div className="card-label">COURSE</div>
          <div className="card-value">{group.course || group.name}</div>
        </div>
        <div className="card-mid">
          <div className="card-label">MAJOR</div>
          <div className="card-value">{group.department || "N/A"}</div>
        </div>
        <div className="card-right">
          <div className="card-label">TIME</div>
          <div className="card-value">{group.meetingTime || "N/A"}</div>
        </div>
      </div>
      <div className="card-expanded">
        <h4 className="group-title">{group.name || group.course || "Untitled Group"}</h4>
        {/* More group details */}
      </div>
    </article>
  );
})}
```
**Say:** "map() transforms array into JSX elements, key prop for React tracking."

---

## SECTION 4: BACKEND DEEP DIVE (2 minutes)

### 4.1 Multiple Route Examples
**File:** `backend/src/app.js`  
**Lines:** 73, 136, 189, 251, 280  
**What to show (scroll through these):**
```javascript
// Line 73
if (req.method === "POST" && pathname === "/api/signup") {

// Line 136
if (req.method === "POST" && pathname === "/api/login") {

// Line 189
if (req.method === "PUT" && pathname === "/api/profile/edit") {

// Line 251
if (req.method === "GET" && pathname === "/api/profile") {

// Line 280
if (req.method === "POST" && pathname === "/api/group/create") {
```
**Say:** "Multiple examples of manual routing - checking method and pathname."

---

### 4.2 Request Body Parsing (Repeat from 2.5)
**File:** `backend/src/app.js`  
**Lines:** 28-39  
**Same code as section 2.5**  
**Say:** "This is how we manually parse request bodies - understanding Node.js streams."

---

### 4.3 Response Helper Function
**File:** `backend/src/app.js`  
**Lines:** 23-26  
**What to show:**
```javascript
function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
```
**Say:** "Helper function for sending JSON responses - sets status, headers, body."

---

## SECTION 5: DATABASE CRUD (1.5 minutes)

### 5.1 Database Connection
**File:** `backend/src/config/db.js`  
**Lines:** 13-25  
**What to show:**
```javascript
async function connectDB() {
  if (db) return db; // return if already connected

  try {
    await client.connect();
    db = client.db();
    console.log("MongoDB connected successfully");
    return db;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
```
**Say:** "MongoDB connection setup using the official driver."

---

### 5.2 CREATE - Insert User
**File:** `backend/src/app.js`  
**Lines:** 117-126  
**What to show:**
```javascript
const hashedPassword = await bcrypt.hash(password, 10);

const users = dbInstance.collection("users");

await users.insertOne({
  username,
  email,
  password: hashedPassword,
  department,
  year,
  createdAt: new Date()
});
```
**Say:** "CREATE operation - insertOne adds a document to the collection."

---

### 5.3 READ - Find User
**File:** `backend/src/app.js`  
**Lines:** 147  
**What to show:**
```javascript
const user = await users.findOne({ email });
```
**Say:** "READ operation - findOne returns a single matching document."

---

### 5.4 UPDATE - Update Profile
**File:** `backend/src/app.js`  
**Lines:** 226-229  
**What to show:**
```javascript
await users.updateOne(
  { _id: new ObjectId(user.id) },
  { $set: { username, email, department, year } }
);
```
**Say:** "UPDATE operation - updateOne with filter and $set operator."

---

## SECTION 6: GROUP CREATION (2 minutes)

### 6.1 Frontend - Group Data Preparation
**File:** `frontend/src/pages/CreateGroup.jsx`  
**Lines:** 105-114  
**What to show:**
```javascript
const groupData = {
  name: groupName,
  department,
  year,
  meetingTime: selectedTime,
  meetingDays: selectedDays,
  maxMembers: parseInt(maxMembers),
};

const response = await createGroup(groupData);
```
**Say:** "Frontend prepares group data and sends API request."

---

### 6.2 Backend - Route with Authentication
**File:** `backend/src/app.js`  
**Lines:** 279-282  
**What to show:**
```javascript
if (req.method === "POST" && pathname === "/api/group/create") {
  const user = authMiddleware(req, res);
  if (!user) return; // stop if JWT invalid
  return groupRoutes.createGroup(req, res, dbInstance, user);
}
```
**Say:** "Route handler authenticates user via JWT, then delegates to controller."

---

### 6.3 Controller - Business Logic
**File:** `backend/src/controllers/group.controller.js`  
**Lines:** 33-82  
**What to show:**
```javascript
async createGroup(req, res, user) {
  try {
    const body = await this.getBody(req);
    const {
      name, department, year, meetingTime, meetingDays,
      maxMembers
    } = body;

    // Get adminId from authenticated user
    const adminId = user.id?.toString() || user.id;

    // Validate required fields
    const missingFields = [];
    if (!name || (typeof name === 'string' && name.trim() === '')) {
      missingFields.push("name");
    }
    // ... more validation ...

    if (missingFields.length > 0) {
      return this.sendJSON(res, 400, { 
        error: "Missing required fields", 
        missingFields: missingFields 
      });
    }

    // Create group via model
    const group = await this.groupModel.createGroup({
      name, department, year, meetingTime, meetingDays,
      maxMembers, adminId
    });

    return this.sendJSON(res, 201, { message: "Group created", group });
  } catch (error) {
    console.error("Create group error:", error);
    return this.sendJSON(res, 500, { error: "Failed to create group" });
  }
}
```
**Say:** "Controller handles validation, business logic, and coordinates with model."

---

### 6.4 Model - Database Operation
**File:** `backend/src/models/Group.model.js`  
**Lines:** 8-27  
**What to show:**
```javascript
async createGroup({ name, department, year, meetingTime, meetingDays, maxMembers = 10, adminId }) {
  // Initial status is always Inactive because it starts with 1 member (admin)
  const status = "Inactive";

  const group = {
    name,
    department,
    year,
    meetingTime,
    meetingDays, // array
    maxMembers: parseInt(maxMembers) || 10,
    membersCount: 1, // Start with 1
    admin: adminId,
    members: [adminId], // start with only admin
    status,
    createdAt: new Date(),
  };

  const result = await this.collection.insertOne(group);
  return { _id: result.insertedId, ...group };
}
```
**Say:** "Model handles database operations - creates document structure and inserts into MongoDB."

---

## 🎯 VISUAL FLOW TO DRAW/SHOW

When explaining the complete flow, draw or show this:

```
React Form
    ↓
fetch() POST request
    ↓
Node.js Server (app.js)
    ↓ (routes to)
Controller (group.controller.js)
    ↓ (calls)
Model (Group.model.js)
    ↓ (inserts into)
MongoDB Database
    ↓ (returns)
Model → Controller → Server → Response
    ↓
React updates state
    ↓
UI re-renders
```

---

## 📍 FILE NAVIGATION QUICK REFERENCE

| Section | File | Lines | Purpose |
|---------|------|-------|---------|
| 2.1 | Signup.jsx | 10-15 | useState hooks |
| 2.2 | Signup.jsx | 29-58 | Form submission |
| 2.3 | app.js | 55-70 | Server setup |
| 2.4 | app.js | 72-73 | Manual routing |
| 2.5 | app.js | 28-39 | Request parsing |
| 2.6 | app.js | 75-133 | Signup handler |
| 3.1 | Dashboard.jsx | 12-13 | useState |
| 3.2 | Dashboard.jsx | 24-32 | useEffect |
| 3.3 | Dashboard.jsx | 52-105 | Data fetching |
| 3.4 | Dashboard.jsx | 390-420 | map() rendering |
| 4.1 | app.js | 73, 136, 189, 251, 280 | Multiple routes |
| 4.2 | app.js | 28-39 | Request parsing (repeat) |
| 4.3 | app.js | 23-26 | Response helper |
| 5.1 | db.js | 13-25 | Connection |
| 5.2 | app.js | 117-126 | CREATE |
| 5.3 | app.js | 147 | READ |
| 5.4 | app.js | 226-229 | UPDATE |
| 6.1 | CreateGroup.jsx | 105-114 | Frontend prep |
| 6.2 | app.js | 279-282 | Route + auth |
| 6.3 | group.controller.js | 33-82 | Controller logic |
| 6.4 | Group.model.js | 8-27 | Model + DB |

---

**Use this as your cheat sheet during the presentation! 📝**

