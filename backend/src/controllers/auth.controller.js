const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const validateEmail = require("../utils/validateEmail");

class AuthController {
  constructor(db) {
    this.usersCollection = db.collection("users");
  }

  /* ---------------- HELPERS ---------------- */
  getBody(req) {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  }

  sendJSON(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  /* ---------------- SIGNUP ---------------- */
  async signup(req, res) {
    try {
      console.log("Signup attempt started");
      const { username, email, password, confirmPassword, department, year } = await this.getBody(req);
      console.log("Request body:", { username, email, department, year, hasPassword: !!password, hasConfirmPassword: !!confirmPassword });

      if (!username || !email || !password || !confirmPassword || !department || !year) {
        console.log("Missing required fields");
        return this.sendJSON(res, 400, { error: "All fields are required" });
      }

      console.log("Validating email:", email);
      if (!validateEmail(email)) {
        console.log("Email validation failed");
        return this.sendJSON(res, 400, { error: "Invalid AAU email format" });
      }

      if (password.length < 8) {
        console.log("Password too short");
        return this.sendJSON(res, 400, { error: "Password must be at least 8 characters" });
      }

      if (password !== confirmPassword) {
        console.log("Passwords don't match");
        return this.sendJSON(res, 400, { error: "Passwords do not match" });
      }

      console.log("Checking for existing user");
      const existingUser = await this.usersCollection.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        console.log("User already exists");
        return this.sendJSON(res, 400, { error: "Username or email already exists" });
      }

      console.log("Hashing password");
      const hashedPassword = await hashPassword(password);
      
      console.log("Inserting user into database");
      await this.usersCollection.insertOne({ 
        username, 
        email, 
        password: hashedPassword, 
        department, 
        year, 
        createdAt: new Date()
      });

      console.log("User created successfully");
      return this.sendJSON(res, 201, { message: "Signup successful" });
    } catch (error) {
      console.error("Signup error:", error);
      return this.sendJSON(res, 500, { error: "User creation failed", details: error.message });
    }
  }

  /* ---------------- LOGIN ---------------- */
  async login(req, res) {
    try {
      const { email, password } = await this.getBody(req);

      if (!email || !password) {
        return this.sendJSON(res, 400, { error: "Email and password required" });
      }

      const user = await this.usersCollection.findOne({ email });
      
      if (!user) {
        return this.sendJSON(res, 400, { error: "User not found" });
      }

      const bcrypt = require("bcrypt");
      const match = await bcrypt.compare(password, user.password);
      
      if (!match) {
        return this.sendJSON(res, 400, { error: "Incorrect password" });
      }

      const jwt = require("jsonwebtoken");
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return this.sendJSON(res, 200, { 
        message: "Login successful", 
        token,
        user: {
          username: user.username,
          email: user.email,
          department: user.department,
          year: user.year,
          bio: user.bio || ""
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      return this.sendJSON(res, 500, { error: "Login failed" });
    }
  }
}

module.exports = AuthController;