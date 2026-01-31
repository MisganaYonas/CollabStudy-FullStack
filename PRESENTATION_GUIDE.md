# CollabStudy FullStack - Presentation Guide (10 Minutes)

## 🎯 Presentation Structure

### 1. Introduction (30 seconds)
- **What**: CollabStudy - A study group collaboration platform
- **Tech Stack**: React (Frontend) + Custom Node.js Server (Backend) + MongoDB (Database)
- **Key Features**: User authentication, group creation, search, AI chat

---

## 2. End-to-End Feature: User Signup (2 minutes)

### **Full Flow: React Form → Node Handler → Database → Response**

#### **Step 1: Frontend - React Form (Signup.jsx)**

```javascript
// Key Code Snippet to Show:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const payload = { username, email, password, confirmPassword, department, year };
  
  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    // Handle response...
  } catch (err) {
    // Error handling...
  }
};
```

**Talking Points:**
- `useState` hooks manage form input values (username, email, password, etc.)
- `e.preventDefault()` stops default form submission
- `fetch()` sends POST request with JSON payload
- `JSON.stringify()` converts JavaScript object to JSON string
- Async/await handles asynchronous API call

#### **Step 2: Backend - Custom Node.js Server (app.js)**

```javascript
// Key Code Snippet to Show:
const server = http.createServer(async (req, res) => {
  // CORS handling
  if (enableCORS(req, res)) return;
  
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  
  // Manual routing - no Express framework!
  if (req.method === "POST" && pathname === "/api/signup") {
    try {
      // Parse request body manually
      const { username, email, password, department, year } = await getBody(req);
      
      // Validation
      if (!username || !email || !password) {
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
    } catch (err) {
      return sendJSON(res, 500, { error: "Server error" });
    }
  }
});
```

**Talking Points:**
- **Manual Routing**: Using `if` statements instead of Express router
- **Request Parsing**: `getBody()` function manually collects request data:
  ```javascript
  function getBody(req) {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        resolve(JSON.parse(body || "{}"));
      });
    });
  }
  ```
- **Response Handling**: `sendJSON()` helper sends JSON responses
- **Security**: Password hashing with bcrypt before storing

#### **Step 3: Database - MongoDB Insert**

```javascript
// Key Code Snippet to Show:
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

**Talking Points:**
- MongoDB uses collections (like tables in SQL)
- `insertOne()` adds a single document
- Data is stored as JSON-like documents
- `_id` is automatically generated

#### **Step 4: Response Flow**

```
Frontend → POST /api/signup → Backend validates → DB inserts → Backend responds → Frontend updates UI
```

---

## 3. Frontend Deep Dive: React State & Effects (2 minutes)

### **Component: Dashboard.jsx**

#### **State Management with useState**

```javascript
// Key Code Snippet to Show:
const [groups, setGroups] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");

// Update state
setGroups(fetchedGroups);
setLoading(false);
```

**Talking Points:**
- `useState` returns [value, setter function]
- State changes trigger re-renders
- Each component manages its own state

#### **Data Fetching with useEffect**

```javascript
// Key Code Snippet to Show:
useEffect(() => {
  fetchGroups();
}, []); // Empty array = run once on mount

const fetchGroups = async () => {
  setLoading(true);
  try {
    const response = await searchGroups(filters);
    let fetchedGroups = response.data?.groups || [];
    setGroups(fetchedGroups);
  } catch (error) {
    console.error("Error:", error);
    setGroups([]);
  } finally {
    setLoading(false);
  }
};
```

**Talking Points:**
- `useEffect` runs after component mounts
- Empty dependency array `[]` = run once
- Async function fetches data from API
- State updates trigger UI re-render

#### **Dynamic Rendering with map()**

```javascript
// Key Code Snippet to Show:
{groups.map((group) => {
  if (!group || !group._id) return null;
  return (
    <article key={group._id} className="dashboard-group-card">
      <h4>{group.name}</h4>
      <p>Department: {group.department}</p>
      <p>Members: {group.membersCount}/{group.maxMembers}</p>
    </article>
  );
})}
```

**Talking Points:**
- `map()` transforms array into JSX elements
- `key` prop helps React track elements
- Conditional rendering with `if` statements

---

## 4. Backend Deep Dive: Manual Node.js Server (2 minutes)

### **Custom HTTP Server (app.js)**

#### **Manual Request Routing**

```javascript
// Key Code Snippet to Show:
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  
  // Manual routing - check method and pathname
  if (req.method === "GET" && pathname === "/api/profile") {
    // Handle GET request
  }
  
  if (req.method === "POST" && pathname === "/api/signup") {
    // Handle POST request
  }
  
  if (req.method === "PUT" && pathname === "/api/profile/edit") {
    // Handle PUT request
  }
});
```

**Talking Points:**
- No framework = full control over request handling
- `req.method` tells us GET, POST, PUT, DELETE
- `pathname` tells us the route
- Manual `if` statements route requests

#### **Manual Request Body Parsing**

```javascript
// Key Code Snippet to Show:
function getBody(req) {
  return new Promise((resolve) => {
    let body = "";
    
    // Collect data chunks as they arrive
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    
    // When all data received, parse JSON
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

// Usage in route handler
const { username, email, password } = await getBody(req);
```

**Talking Points:**
- Node.js streams data in chunks
- `req.on("data")` fires for each chunk
- `req.on("end")` fires when complete
- Promise-based for async/await usage

#### **Manual JSON Response**

```javascript
// Key Code Snippet to Show:
function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// Usage
sendJSON(res, 200, { message: "Success", user: userData });
```

**Talking Points:**
- `res.writeHead()` sets status and headers
- `res.end()` sends response and closes connection
- `JSON.stringify()` converts object to JSON

---

## 5. Database Interaction: MongoDB CRUD (1.5 minutes)

### **Connection Setup (db.js)**

```javascript
// Key Code Snippet to Show:
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  await client.connect();
  db = client.db();
  return db;
}
```

### **CRUD Operations**

#### **CREATE - Insert User**

```javascript
// Key Code Snippet to Show:
const users = dbInstance.collection("users");
await users.insertOne({
  username: "john",
  email: "john@aau.edu.et",
  password: hashedPassword
});
```

#### **READ - Find User**

```javascript
// Key Code Snippet to Show:
const user = await users.findOne({ email: "john@aau.edu.et" });
// Returns single document or null

const allGroups = await groups.find({ department: "CSE" }).toArray();
// Returns array of documents
```

#### **UPDATE - Update Profile**

```javascript
// Key Code Snippet to Show:
await users.updateOne(
  { _id: new ObjectId(userId) },
  { $set: { username: "newUsername", bio: "New bio" } }
);
```

#### **DELETE - Delete Account**

```javascript
// Key Code Snippet to Show:
await users.deleteOne({ _id: new ObjectId(userId) });
```

**Talking Points:**
- MongoDB uses collections (like tables)
- Documents are JSON-like objects
- `_id` is unique identifier (ObjectId)
- Queries use JavaScript objects as filters

---

## 6. Complete Feature Walkthrough: Group Creation (2 minutes)

### **Visual Flow Diagram**

```
┌─────────────┐
│   React UI  │
│ CreateGroup │
└──────┬──────┘
       │ 1. User fills form
       │ 2. Click "Create Group"
       │ 3. fetch() POST request
       ▼
┌─────────────────────┐
│  Custom Node Server │
│      app.js         │
│  - Parse request    │
│  - Validate data   │
│  - Authenticate    │
└──────┬──────────────┘
       │ 4. Extract user from JWT
       │ 5. Validate fields
       ▼
┌─────────────────────┐
│   Group Controller  │
│  group.controller.js│
│  - Business logic   │
└──────┬──────────────┘
       │ 6. Call model
       ▼
┌─────────────────────┐
│   Group Model       │
│   Group.model.js    │
│  - DB operations    │
└──────┬──────────────┘
       │ 7. Insert into MongoDB
       ▼
┌─────────────────────┐
│     MongoDB         │
│   groups collection │
│  - Store document   │
└──────┬──────────────┘
       │ 8. Return inserted doc
       ▼
┌─────────────────────┐
│   Response Chain    │
│  Model → Controller │
│  → Server → Client  │
└──────┬──────────────┘
       │ 9. JSON response
       ▼
┌─────────────┐
│   React UI  │
│  - Show success     │
│  - Navigate to dashboard │
└─────────────┘
```

### **Code Flow**

#### **1. Frontend Form Submission**

```javascript
// CreateGroup.jsx
const handleCreateGroup = async () => {
  const groupData = {
    name: groupName,
    department,
    year,
    meetingTime: selectedTime,
    meetingDays: selectedDays,
    maxMembers: parseInt(maxMembers),
  };
  
  const response = await createGroup(groupData);
  // Navigate on success
};
```

#### **2. Backend Route Handler**

```javascript
// app.js
if (req.method === "POST" && pathname === "/api/group/create") {
  const user = authMiddleware(req, res); // Extract user from JWT
  if (!user) return;
  return groupRoutes.createGroup(req, res, dbInstance, user);
}
```

#### **3. Controller Logic**

```javascript
// group.controller.js
async createGroup(req, res, user) {
  const body = await this.getBody(req);
  const { name, department, year, meetingTime, meetingDays } = body;
  const adminId = user.id; // From JWT token
  
  // Validate
  if (!name || !department || !year) {
    return this.sendJSON(res, 400, { error: "Missing fields" });
  }
  
  // Create group via model
  const group = await this.groupModel.createGroup({
    name, department, year, meetingTime, meetingDays,
    adminId
  });
  
  return this.sendJSON(res, 201, { message: "Group created", group });
}
```

#### **4. Database Insert**

```javascript
// Group.model.js
async createGroup({ name, department, year, adminId }) {
  const group = {
    name, department, year,
    admin: adminId,
    members: [adminId],
    status: "Inactive",
    createdAt: new Date()
  };
  
  const result = await this.collection.insertOne(group);
  return { _id: result.insertedId, ...group };
}
```

**Talking Points:**
- **Separation of Concerns**: Route → Controller → Model → Database
- **Authentication**: JWT token validated before allowing creation
- **Data Flow**: UI → API → Validation → Database → Response → UI
- **Error Handling**: Each layer can catch and return errors

---

## 7. Key Concepts Summary (30 seconds)

### **Why This Architecture Works**

1. **Frontend (React)**
   - Component-based UI
   - State management with hooks
   - Async API calls with fetch/axios

2. **Backend (Custom Node.js)**
   - Full control without framework overhead
   - Manual routing = understand every request
   - Direct HTTP server handling

3. **Database (MongoDB)**
   - NoSQL = flexible schema
   - JSON documents = easy to work with
   - Collections = organized data storage

4. **Data Flow**
   ```
   User Action → React State → API Call → Node Server → 
   Validation → Database → Response → React Update → UI Refresh
   ```

---

## 🎤 Presentation Tips

### **Do's:**
- ✅ Show actual code snippets (not entire files)
- ✅ Explain WHY you made choices (manual server vs Express)
- ✅ Demonstrate live: create a user, create a group
- ✅ Point to specific lines while explaining
- ✅ Show browser DevTools Network tab for API calls
- ✅ Show database contents (MongoDB Compass or terminal)

### **Don'ts:**
- ❌ Don't just run the app without explaining
- ❌ Don't show entire files (too much code)
- ❌ Don't skip error handling explanation
- ❌ Don't forget to explain the "why" behind choices

### **Key Questions to Be Ready For:**
1. "Why custom Node.js server instead of Express?"
   - **Answer**: To demonstrate understanding of HTTP fundamentals, manual request handling, and full control over the request/response cycle.

2. "How does authentication work?"
   - **Answer**: JWT tokens stored in localStorage, sent in Authorization header, verified on backend before protected routes.

3. "What happens if the database is down?"
   - **Answer**: Backend catches errors, returns 500 status, frontend shows error message to user.

4. "How do you handle CORS?"
   - **Answer**: Custom CORS middleware sets headers, handles preflight OPTIONS requests.

---

## 📋 Quick Reference: Code Locations

- **Signup Flow**: `frontend/src/pages/Signup.jsx` → `backend/src/app.js` (line 73-133)
- **Group Creation**: `frontend/src/pages/CreateGroup.jsx` → `backend/src/controllers/group.controller.js`
- **Database Connection**: `backend/src/config/db.js`
- **Request Parsing**: `backend/src/app.js` (getBody function)
- **State Management**: `frontend/src/pages/Dashboard.jsx` (useState, useEffect)

---

## 🎯 Demo Checklist

- [ ] Show signup form → explain useState
- [ ] Show API call → explain fetch()
- [ ] Show backend route → explain manual routing
- [ ] Show database insert → explain MongoDB
- [ ] Show response → explain JSON
- [ ] Show UI update → explain React re-render
- [ ] Show group creation → full flow
- [ ] Show search feature → explain useEffect
- [ ] Show authentication → explain JWT

---

**Good luck with your presentation! 🚀**

