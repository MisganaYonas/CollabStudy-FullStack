const AuthController = require("../controllers/auth.controller");

let authController = null;

/**
 * Initialize controller once
 */
function getController(db) {
  if (!db) {
    throw new Error("Database instance not provided to auth routes");
  }

  if (!authController) {
    authController = new AuthController(db);
  }
  return authController;
}

/**
 * POST /api/signup
 */
async function signup(req, res, db) {
  try {
    return await getController(db).signup(req, res);
  } catch (err) {
    console.error("Signup route error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Signup failed" }));
  }
}

/**
 * POST /api/login
 */
async function login(req, res, db) {
  try {
    return await getController(db).login(req, res);
  } catch (err) {
    console.error("Login route error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Login failed" }));
  }
}

module.exports = { signup, login };