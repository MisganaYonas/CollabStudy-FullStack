const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { validateEmail } = require("../utils/validateEmail");

async function signup(req, res, body) {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "All fields are required" }));
  }

  if (!validateEmail(email)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Invalid institutional email" }));
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.writeHead(409, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Email already in use" }));
  }

  const hashed = await hashPassword(password);

  try {
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User created" }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "User creation failed" }));
  }
}

async function login(req, res, body) {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "User not found" }));
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Invalid password" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Login successful", userId: user._id }));
}

module.exports = { signup, login };